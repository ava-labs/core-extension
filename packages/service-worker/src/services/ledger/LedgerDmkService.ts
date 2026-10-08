import {
  DeviceActionStatus,
  DeviceManagementKitBuilder,
  DeviceStatus,
  isSuccessCommandResult,
  OpenAppDeviceAction,
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
// Not re-exported from the package root; the kit only uses it internally.
import { GetAppConfiguration } from '@ledgerhq/device-signer-kit-ethereum/internal/app-binder/command/GetAppConfigurationCommand.js';
import { SignerSolanaBuilder } from '@ledgerhq/device-signer-kit-solana';
import {
  getLedgerExtendedPublicKey,
  quitLedgerApp,
} from '@avalabs/core-wallets-sdk';
import { getSolanaRpcUrl } from '@core/common';
import {
  LEDGER_APP_NOT_INSTALLED_ERROR,
  LEDGER_APP_SWITCH_FAILED_ERROR,
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
  type Subscription,
  switchMap,
  timeout,
  timer,
} from 'rxjs';
import { ChainId } from '@avalabs/core-chains-sdk';
import { singleton } from 'tsyringe';
import { OnAllExtensionClosed, OnLock } from '../../runtime/lifecycleCallbacks';

const DEVICE_DISCOVERY_TIMEOUT_MS = 30_000;
const DEVICE_DISCOVERY_POLL_MS = 1_000;
const APP_INFO_TIMEOUT_MS = 30_000;
// Screens that need the device poll `getAppInfo` every 2s, so a session that
// goes this long without a request isn't in use. Holding it would keep the
// WebHID connection claimed (and the refresher pinging), breaking other dApps.
const IDLE_RELEASE_MS = 5_000;

/** BOLOS status word for "application not installed". */
const APP_NOT_INSTALLED_STATUS = '5123';

const REFRESHER_BLOCKER_ID = 'core-device-operation';

export type DmkSession = {
  dmk: DeviceManagementKit;
  sessionId: DeviceSessionId;
};

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

const toOpenAppError = (error: unknown): Error => {
  const tag =
    error && typeof error === 'object' && '_tag' in error
      ? error._tag
      : undefined;
  const errorCode =
    error && typeof error === 'object' && 'errorCode' in error
      ? error.errorCode
      : undefined;

  if (tag === 'DeviceLockedError') {
    return new Error(LEDGER_DEVICE_LOCKED_ERROR);
  }
  // 0x6807 ("unknown application name") is also returned when BOLOS rejects
  // the switch, so only 0x5123 is treated as a definitive "not installed".
  if (errorCode === APP_NOT_INSTALLED_STATUS) {
    return new Error(LEDGER_APP_NOT_INSTALLED_ERROR);
  }
  return new Error(LEDGER_APP_SWITCH_FAILED_ERROR);
};

// The DMK BTC signer splits paths without accepting the `m/` root.
const stripRootPrefix = (path: string) => path.replace(/^m\//, '');

/**
 * Owns the single WebHID connection to the Ledger device on the service
 * worker. The frontend performs the one-time `navigator.hid.requestDevice()`
 * grant; the service worker enumerates the granted device via the DMK's
 * `getDevices`-backed discovery and opens the session here.
 */
@singleton()
export class LedgerDmkService implements OnLock, OnAllExtensionClosed {
  #dmk?: DeviceManagementKit;
  #sessionId?: DeviceSessionId;
  #pendingConnect?: Promise<DeviceSessionId>;
  #activeOperations = 0;
  #idleRelease?: Subscription;
  #releaseAfterOperations = false;

  #cancelIdleRelease(): void {
    this.#idleRelease?.unsubscribe();
    this.#idleRelease = undefined;
  }

  #scheduleIdleRelease(): void {
    this.#cancelIdleRelease();
    this.#idleRelease = timer(IDLE_RELEASE_MS).subscribe(() => {
      this.#idleRelease = undefined;
      if (this.#activeOperations === 0) {
        void this.disconnect();
      }
    });
  }

  #getDmk(): DeviceManagementKit {
    if (!this.#dmk) {
      this.#dmk = new DeviceManagementKitBuilder()
        .addTransport(webHidTransportFactory)
        .build();
    }
    return this.#dmk;
  }

  async #ensureSession(): Promise<DmkSession> {
    const session = await this.#openSession();
    this.#scheduleIdleRelease();
    return session;
  }

  async #openSession(): Promise<DmkSession> {
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

    // The session refresher keeps the running app and lock status in the
    // session state that `getAppInfo` reads; `runDeviceOperation` pauses it
    // while a device flow is in progress.
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

  async getSession(): Promise<DmkSession> {
    return this.#ensureSession();
  }

  /**
   * Runs a device flow (app switch, key derivation, signing) with the session
   * refresher paused, so its background polling can't interleave with the
   * flow's APDUs or desync the session while a review is on screen.
   */
  async runDeviceOperation<T>(
    fn: (session: DmkSession) => Promise<T>,
  ): Promise<T> {
    const session = await this.#ensureSession();
    const resumeRefresher = session.dmk.disableDeviceSessionRefresher({
      sessionId: session.sessionId,
      blockerId: REFRESHER_BLOCKER_ID,
    });
    this.#activeOperations += 1;

    try {
      return await fn(session);
    } finally {
      this.#activeOperations -= 1;
      resumeRefresher();

      if (this.#activeOperations === 0) {
        if (this.#releaseAfterOperations) {
          void this.disconnect();
        } else {
          this.#scheduleIdleRelease();
        }
      }
    }
  }

  async getAppInfo(): Promise<{ applicationName: string; version: string }> {
    const session = await this.#ensureSession();

    try {
      return await this.#readAppInfo(session);
    } catch (error) {
      // Don't reset when the session was replaced (e.g. lock + reconnect), the
      // device is merely locked, or a device flow is running: the state isn't
      // refreshed while the refresher is paused, and tearing the session down
      // would abort that flow.
      if (
        this.#dmk !== session.dmk ||
        this.#sessionId !== session.sessionId ||
        this.#activeOperations > 0 ||
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
  }: DmkSession): Promise<{ applicationName: string; version: string }> {
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
    return this.runDeviceOperation(async ({ dmk, sessionId }) => {
      const result = await dmk.sendCommand({
        sessionId,
        command: new GetAppConfiguration(),
      });
      if (!isSuccessCommandResult(result)) {
        throw new Error(
          `Ethereum getAppConfiguration failed: ${JSON.stringify(result.error)}`,
        );
      }
      return { isBlindSigningEnabled: result.data.blindSigningEnabled };
    });
  }

  /**
   * Opens `appName` (a BOLOS application name, e.g. `'Avalanche'`,
   * `'Bitcoin Recovery'`) unless it's already running, quitting any other app
   * first. Prompts for unlock / open-app confirmation on the device as needed.
   */
  async ensureAppOpen(appName: string): Promise<void> {
    await this.runDeviceOperation(async ({ dmk, sessionId }) => {
      const result = await lastValueFrom(
        dmk.executeDeviceAction({
          sessionId,
          deviceAction: new OpenAppDeviceAction({ input: { appName } }),
        }).observable,
      );

      if (result.status !== DeviceActionStatus.Completed) {
        throw toOpenAppError(
          result.status === DeviceActionStatus.Error ? result.error : undefined,
        );
      }
    });
  }

  async closeApp(): Promise<void> {
    await this.runDeviceOperation(({ dmk, sessionId }) =>
      quitLedgerApp(dmk, sessionId),
    );
  }

  /**
   * BIP32 extended public key via the Avalanche (Zondax) app for the given
   * path (serves both `m/44'/60'` and `m/44'/9000'`).
   */
  async getExtendedPublicKey(path: string, display = false): Promise<string> {
    return this.runDeviceOperation(async ({ dmk, sessionId }) => {
      await this.ensureAppOpen('Avalanche');
      return getLedgerExtendedPublicKey(dmk, sessionId, display, path);
    });
  }

  async getSolanaPublicKey(accountIndex: number): Promise<Buffer> {
    return this.runDeviceOperation(async ({ dmk, sessionId }) => {
      const solanaApp = new SignerSolanaBuilder({
        dmk,
        sessionId,
        // Address derivation never hits the RPC, so the network choice doesn't matter here.
        solanaRPCURL: getSolanaRpcUrl({ chainId: ChainId.SOLANA_MAINNET_ID }),
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
    });
  }

  // `skipOpenApp`: the signer would otherwise switch to the "Bitcoin" app, but
  // Core's 44'/60' paths need the "Bitcoin Recovery" app the user has open.
  async getBtcMasterFingerprint(): Promise<string> {
    return this.runDeviceOperation(async ({ dmk, sessionId }) => {
      const signer = new SignerBtcBuilder({ dmk, sessionId }).build();
      const { masterFingerprint } = await completeDeviceAction(
        'Bitcoin getMasterFingerprint',
        signer.getMasterFingerprint({ skipOpenApp: true }),
      );
      return Buffer.from(masterFingerprint).toString('hex');
    });
  }

  async getBtcExtendedPublicKey(path: string): Promise<string> {
    return this.runDeviceOperation(async ({ dmk, sessionId }) => {
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
    return this.runDeviceOperation(async ({ dmk, sessionId }) => {
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
    this.#releaseAfterOperations = false;
    this.#cancelIdleRelease();

    if (dmk && sessionId) {
      await dmk.disconnect({ sessionId }).catch(() => undefined);
    }
  }

  onAllExtensionsClosed(): void {
    // A signing review can outlive the approval window; let it finish first.
    if (this.#activeOperations > 0) {
      this.#releaseAfterOperations = true;
      return;
    }
    void this.disconnect();
  }

  onLock(): void {
    const dmk = this.#dmk;
    const disconnecting = this.disconnect();
    this.#dmk = undefined;
    void disconnecting.finally(() => dmk?.close());
  }
}
