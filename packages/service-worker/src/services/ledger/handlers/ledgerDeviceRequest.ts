import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { LedgerDmkService } from '../LedgerDmkService';

/**
 * Device operations the frontend delegates to the service-worker-owned DMK
 * session. The service worker is the sole opener of the WebHID connection; the
 * frontend only performs the one-time `navigator.hid.requestDevice()` grant.
 */
export type LedgerDeviceRequestParams =
  | { op: 'getAppInfo' }
  | { op: 'getEthAppConfig' }
  | { op: 'ensureAppOpen'; appName: string }
  | { op: 'closeApp' }
  | { op: 'getExtendedPublicKey'; path: string; display?: boolean }
  | { op: 'getSolanaPublicKey'; accountIndex: number }
  | { op: 'getBtcMasterFingerprint' }
  | { op: 'getBtcExtendedPublicKey'; path: string }
  | {
      op: 'registerBtcWalletPolicy';
      xpub: string;
      masterFingerprint: string;
      derivationPath: string;
      name: string;
    };

// Buffers are returned hex-encoded so results stay JSON-serializable across the
// messaging boundary; the frontend re-wraps them where a Buffer is expected.
export type LedgerDeviceRequestResult =
  | { applicationName: string; version: string }
  | { isBlindSigningEnabled: boolean }
  | { publicKeyHex: string }
  | { xpub: string }
  | { fingerprint: string }
  | { policyIdHex: string; hmacHex: string }
  | null;

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_DEVICE_REQUEST,
  LedgerDeviceRequestResult,
  [params: LedgerDeviceRequestParams]
>;

function serializeLedgerError(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }
  if (e && typeof e === 'object') {
    // DMK errors carry their info on enumerable/own fields (e.g. `_tag`,
    // `errorCode`, `originalError`) rather than a `message`.
    try {
      const own = Object.fromEntries(
        Object.getOwnPropertyNames(e).map((key) => [key, Reflect.get(e, key)]),
      );
      const json = JSON.stringify(own);
      if (json && json !== '{}') {
        return json;
      }
      const tag = '_tag' in e ? e._tag : undefined;
      return String(tag ?? e.constructor?.name ?? e);
    } catch {
      return String(e);
    }
  }
  return String(e);
}

@injectable()
export class LedgerDeviceRequestHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_DEVICE_REQUEST as const;

  constructor(private ledgerDmkService: LedgerDmkService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [params] = request.params;

    try {
      return { ...request, result: await this.#dispatch(params) };
    } catch (e) {
      // DMK rejects with non-Error objects (DmkError) that stringify to
      // "[object Object]", so serialize their fields explicitly.
      console.error('[ledgerDeviceRequest] failed', params, e);
      return { ...request, error: serializeLedgerError(e) };
    }
  };

  #dispatch = async (
    params: LedgerDeviceRequestParams,
  ): Promise<LedgerDeviceRequestResult> => {
    switch (params.op) {
      case 'getAppInfo':
        return this.ledgerDmkService.getAppInfo();
      case 'getEthAppConfig':
        return this.ledgerDmkService.getEthAppConfig();
      case 'ensureAppOpen':
        await this.ledgerDmkService.ensureAppOpen(params.appName);
        return null;
      case 'closeApp':
        await this.ledgerDmkService.closeApp();
        return null;
      case 'getExtendedPublicKey':
        return {
          xpub: await this.ledgerDmkService.getExtendedPublicKey(
            params.path,
            params.display,
          ),
        };
      case 'getSolanaPublicKey': {
        const publicKey = await this.ledgerDmkService.getSolanaPublicKey(
          params.accountIndex,
        );
        return { publicKeyHex: publicKey.toString('hex') };
      }
      case 'getBtcMasterFingerprint':
        return {
          fingerprint: await this.ledgerDmkService.getBtcMasterFingerprint(),
        };
      case 'getBtcExtendedPublicKey':
        return {
          xpub: await this.ledgerDmkService.getBtcExtendedPublicKey(
            params.path,
          ),
        };
      case 'registerBtcWalletPolicy': {
        const [policyId, hmac] =
          await this.ledgerDmkService.registerBtcWalletPolicy(
            params.xpub,
            params.masterFingerprint,
            params.derivationPath,
            params.name,
          );
        return {
          policyIdHex: policyId.toString('hex'),
          hmacHex: hmac.toString('hex'),
        };
      }
    }
  };
}
