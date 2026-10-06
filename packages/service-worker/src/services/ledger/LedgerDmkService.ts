import {
  DeviceActionStatus,
  DeviceManagementKitBuilder,
  DeviceStatus,
  type DeviceActionState,
  type DeviceManagementKit,
  type DeviceSessionId,
  type DeviceSessionState,
  type DiscoveredDevice,
} from '@ledgerhq/device-management-kit';
import { webHidTransportFactory } from '@ledgerhq/device-transport-kit-web-hid';
import {
  DefaultDescriptorTemplate,
  SignerBtcBuilder,
  WalletPolicy,
} from '@ledgerhq/device-signer-kit-bitcoin';
import { SignerSolanaBuilder } from '@ledgerhq/device-signer-kit-solana';
import type Transport from '@ledgerhq/hw-transport';
import {
  getLedgerExtendedPublicKey,
  quitLedgerApp,
} from '@avalabs/core-wallets-sdk';
import { ensureLedgerAppOpen, getSolanaRpcUrl } from '@core/common';
import {
  LEDGER_DEVICE_LOCKED_ERROR,
  LEDGER_MULTIPLE_DEVICES_ERROR,
} from '@core/types';
import { base58 } from '@scure/base';
import {
  filter,
  firstValueFrom,
  lastValueFrom,
  map,
  type Observable,
  switchMap,
  timeout,
  timer,
} from 'rxjs';
import { singleton } from 'tsyringe';
import { OnLock } from '../../runtime/lifecycleCallbacks';
import { DmkLedgerTransport } from './dmk/DmkLedgerTransport';

const DEVICE_DISCOVERY_TIMEOUT_MS = 30_000;
const DEVICE_DISCOVERY_POLL_MS = 1_000;
const APP_INFO_TIMEOUT_MS = 30_000;

/** hw-app-eth `getAppConfiguration`: CLA, INS, P1, P2. */
export const ETH_GET_APP_CONFIGURATION = [0xe0, 0x06, 0x00, 0x00] as const;

type ReadyDeviceSessionState = Extract<
  DeviceSessionState,
  { currentApp: unknown }
>;

const completeDeviceAction = async <Output>(
  operation: string,
  {
    observable,
  }: { observable: Observable<DeviceActionState<Output, unknown, unknown>> },
): Promise<Output> => {
  // Device actions emit intermediate (pending) states before completing, so
  // wait for the terminal value rather than taking the first emission.
  const result = await lastValueFrom(observable);
  if (result.status !== DeviceActionStatus.Completed) {
    const detail =
      result.status === DeviceActionStatus.Error ? result.error : result;
    throw new Error(
      `${operation} failed (${result.status}): ${JSON.stringify(detail)}`,
    );
  }
  return result.output;
};

// The DMK BTC signer splits paths without accepting the `m/` root.
const stripRootPrefix = (path: string) => path.replace(/^m\//, '');

const APDU_BUSY_RETRY_MS = 150;

const isAlreadySendingApdu = (error: unknown): boolean => {
  if (error && typeof error === 'object' && '_tag' in error) {
    return error._tag === 'AlreadySendingApduError';
  }
  return String(error).includes('AlreadySendingApduError');
};

/**
 * Owns the single WebHID connection to the Ledger device on the service
 * worker. The frontend performs the one-time `navigator.hid.requestDevice()`
 * grant; the service worker enumerates the granted device via the DMK's
 * `getDevices`-backed discovery and opens the session here.
 */
@singleton()
export class LedgerDmkService implements OnLock {
  #dmk?: DeviceManagementKit;
  #sessionId?: DeviceSessionId;
  #pendingConnect?: Promise<DeviceSessionId>;

  #getDmk(): DeviceManagementKit {
    if (!this.#dmk) {
      this.#dmk = new DeviceManagementKitBuilder()
        .addTransport(webHidTransportFactory)
        .build();
    }
    return this.#dmk;
  }

  async #ensureSession(): Promise<{
    dmk: DeviceManagementKit;
    sessionId: DeviceSessionId;
  }> {
    const dmk = this.#getDmk();

    if (this.#sessionId) {
      return { dmk, sessionId: this.#sessionId };
    }

    // Share a single in-flight connect across concurrent callers (the frontend
    // polls `getAppInfo` repeatedly) so we never open competing sessions.
    if (!this.#pendingConnect) {
      const pending = this.#connect(dmk).finally(() => {
        if (this.#pendingConnect === pending) {
          this.#pendingConnect = undefined;
        }
      });
      this.#pendingConnect = pending;
    }
    const sessionId = await this.#pendingConnect;
    return { dmk, sessionId };
  }

  async #waitUntilDeviceCanExchange({
    dmk,
    sessionId,
  }: {
    dmk: DeviceManagementKit;
    sessionId: DeviceSessionId;
  }): Promise<void> {
    await firstValueFrom(
      dmk.getDeviceSessionState({ sessionId }).pipe(
        map((s) => {
          if (s.deviceStatus === DeviceStatus.LOCKED) {
            throw new Error(LEDGER_DEVICE_LOCKED_ERROR);
          }
          return s;
        }),
        filter((s) => s.deviceStatus !== DeviceStatus.BUSY),
        timeout(APP_INFO_TIMEOUT_MS),
      ),
    );
  }

  async #withUnlockedSession<T>(
    fn: (session: {
      dmk: DeviceManagementKit;
      sessionId: DeviceSessionId;
    }) => Promise<T>,
  ): Promise<T> {
    const session = await this.#ensureSession();
    await this.#waitUntilDeviceCanExchange(session);
    try {
      return await fn(session);
    } catch (error) {
      if (!isAlreadySendingApdu(error)) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, APDU_BUSY_RETRY_MS));
      const retrySession = await this.#ensureSession();
      await this.#waitUntilDeviceCanExchange(retrySession);
      return fn(retrySession);
    }
  }

  async #connect(dmk: DeviceManagementKit): Promise<DeviceSessionId> {
    const devices: DiscoveredDevice[] = await firstValueFrom(
      timer(0, DEVICE_DISCOVERY_POLL_MS).pipe(
        switchMap(() => dmk.listenToAvailableDevices({})),
        filter((available) => available.length > 0),
        timeout(DEVICE_DISCOVERY_TIMEOUT_MS),
      ),
    );

    // WebHID exposes no stable identifier the frontend could pass along from
    // its `requestDevice()` pick, so we can't tell which Ledger the user chose.
    if (devices.length > 1) {
      throw new Error(LEDGER_MULTIPLE_DEVICES_ERROR);
    }
    const device = devices[0]!;

    // Keep the session refresher enabled: the DMK gates its `sendApdu` intent
    // queue on the device-session state the refresher establishes, so
    // connecting with it disabled leaves the very first `sendApdu` (e.g.
    // `getLedgerAppInfo`) queued forever.
    const sessionId = await dmk.connect({ device });

    // The wallet was locked while connecting; don't attach a session to a
    // DMK instance that has been discarded.
    if (this.#dmk !== dmk) {
      await dmk.disconnect({ sessionId }).catch(() => undefined);
      throw new Error('Ledger connection was reset');
    }

    this.#sessionId = sessionId;
    return sessionId;
  }

  async getTransport(): Promise<Transport> {
    const { dmk, sessionId } = await this.#ensureSession();
    return new DmkLedgerTransport(dmk, sessionId);
  }

  async getSession(): Promise<{
    dmk: DeviceManagementKit;
    sessionId: DeviceSessionId;
  }> {
    return this.#ensureSession();
  }

  async getAppInfo(): Promise<{ applicationName: string; version: string }> {
    const session = await this.#ensureSession();

    try {
      return await this.#readAppInfo(session);
    } catch (error) {
      // The session was replaced (e.g. lock + reconnect) while this read was
      // pending; resetting now would tear down the new, healthy session.
      // A locked device also must not trigger a reconnect loop — the session is
      // fine, the user just needs to unlock.
      if (
        this.#dmk !== session.dmk ||
        this.#sessionId !== session.sessionId ||
        (error instanceof Error && error.message === LEDGER_DEVICE_LOCKED_ERROR)
      ) {
        throw error;
      }
      // A stale cached session can be stuck at `Connected`/`BUSY` (e.g. a prior
      // exchange never completed) and never advance to a state that reports the
      // running app. Drop it and reconnect once before giving up.
      await this.disconnect();
      return this.#readAppInfo(await this.#ensureSession());
    }
  }

  async #readAppInfo({
    dmk,
    sessionId,
  }: {
    dmk: DeviceManagementKit;
    sessionId: DeviceSessionId;
  }): Promise<{ applicationName: string; version: string }> {
    // Read the running app from the DMK session state (kept fresh by the
    // session refresher) instead of exchanging a raw `sendApdu`: the raw call
    // races the refresher's polling and is rejected while the device is BUSY.
    const state = await firstValueFrom(
      dmk.getDeviceSessionState({ sessionId }).pipe(
        map((s) => {
          if (s.deviceStatus === DeviceStatus.LOCKED) {
            throw new Error(LEDGER_DEVICE_LOCKED_ERROR);
          }
          return s;
        }),
        filter(
          (s): s is ReadyDeviceSessionState =>
            'currentApp' in s && Boolean(s.currentApp?.name),
        ),
        map((s) => s.currentApp),
        timeout(APP_INFO_TIMEOUT_MS),
      ),
    );
    return { applicationName: state.name, version: state.version };
  }

  async getEthAppConfig(): Promise<{ isBlindSigningEnabled: boolean }> {
    return this.#withUnlockedSession(async ({ dmk, sessionId }) => {
      const transport = new DmkLedgerTransport(dmk, sessionId);
      const response = await transport.send(...ETH_GET_APP_CONFIGURATION);
      return { isBlindSigningEnabled: Boolean((response[0] ?? 0) & 0x01) };
    });
  }

  async ensureAppOpen(appName: string): Promise<void> {
    await this.#withUnlockedSession(async ({ dmk, sessionId }) => {
      await ensureLedgerAppOpen(
        new DmkLedgerTransport(dmk, sessionId),
        appName,
      );
    });
  }

  async closeApp(): Promise<void> {
    const { dmk, sessionId } = await this.#ensureSession();
    await quitLedgerApp(dmk, sessionId);
  }

  /**
   * BIP32 extended public key via the Avalanche (Zondax) app for the given
   * path (serves both `m/44'/60'` and `m/44'/9000'`).
   */
  async getExtendedPublicKey(path: string, display = false): Promise<string> {
    return this.#withUnlockedSession(async ({ dmk, sessionId }) => {
      await ensureLedgerAppOpen(
        new DmkLedgerTransport(dmk, sessionId),
        'Avalanche',
      );
      return getLedgerExtendedPublicKey(dmk, sessionId, display, path);
    });
  }

  async getSolanaPublicKey(accountIndex: number): Promise<Buffer> {
    const { dmk, sessionId } = await this.#ensureSession();
    const solanaApp = new SignerSolanaBuilder({
      dmk,
      sessionId,
      // Address derivation never hits the RPC, so the network choice doesn't matter here.
      solanaRPCURL: getSolanaRpcUrl({ isTestnet: false }),
    }).build();
    // Solana app expects the derivation path without the `m/` root.
    const path = `44'/501'/${accountIndex}'/0'`;
    const address = await completeDeviceAction(
      'Solana getAddress',
      await solanaApp.getAddress(path),
    );
    // `getAddress` returns the base58-encoded address; decode it back to the
    // raw 32-byte public key the caller expects.
    return Buffer.from(base58.decode(address));
  }

  // `skipOpenApp`: the signer would otherwise switch to the "Bitcoin" app, but
  // Core's 44'/60' paths need the "Bitcoin Recovery" app the user has open.
  async getBtcMasterFingerprint(): Promise<string> {
    return this.#withUnlockedSession(async ({ dmk, sessionId }) => {
      const signer = new SignerBtcBuilder({ dmk, sessionId }).build();
      const { masterFingerprint } = await completeDeviceAction(
        'Bitcoin getMasterFingerprint',
        signer.getMasterFingerprint({ skipOpenApp: true }),
      );
      return Buffer.from(masterFingerprint).toString('hex');
    });
  }

  async getBtcExtendedPublicKey(path: string): Promise<string> {
    return this.#withUnlockedSession(async ({ dmk, sessionId }) => {
      const signer = new SignerBtcBuilder({ dmk, sessionId }).build();
      const { extendedPublicKey } = await completeDeviceAction(
        'Bitcoin getExtendedPublicKey',
        signer.getExtendedPublicKey(stripRootPrefix(path), {
          checkOnDevice: true,
          skipOpenApp: true,
        }),
      );
      return extendedPublicKey;
    });
  }

  /** Returns the HMAC the device issues for the registered policy. */
  async registerBtcWalletPolicy(
    xpub: string,
    masterFingerprint: string,
    derivationPath: string,
    name: string,
  ): Promise<Buffer> {
    return this.#withUnlockedSession(async ({ dmk, sessionId }) => {
      const signer = new SignerBtcBuilder({ dmk, sessionId }).build();
      const { hmac } = await completeDeviceAction(
        'Bitcoin registerWallet',
        signer.registerWallet(
          new WalletPolicy(name, DefaultDescriptorTemplate.NATIVE_SEGWIT, [
            `[${masterFingerprint}/${stripRootPrefix(derivationPath)}]${xpub}`,
          ]),
          { skipOpenApp: true },
        ),
      );
      return Buffer.from(hmac);
    });
  }

  async disconnect(): Promise<void> {
    const dmk = this.#dmk;
    const sessionId = this.#sessionId;
    this.#sessionId = undefined;
    this.#pendingConnect = undefined;

    if (dmk && sessionId) {
      await dmk.disconnect({ sessionId }).catch(() => undefined);
    }
  }

  onLock(): void {
    const dmk = this.#dmk;
    const disconnecting = this.disconnect();
    this.#dmk = undefined;
    void disconnecting.finally(() => dmk?.close());
  }
}
