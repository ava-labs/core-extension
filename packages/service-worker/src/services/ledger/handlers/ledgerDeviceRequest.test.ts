import { ExtensionRequest } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { LedgerDmkService } from '../LedgerDmkService';
import {
  LedgerDeviceRequestHandler,
  LedgerDeviceRequestParams,
} from './ledgerDeviceRequest';

jest.mock('../LedgerDmkService', () => ({
  LedgerDmkService: jest.fn(),
}));

describe('src/background/services/ledger/handlers/ledgerDeviceRequest.ts', () => {
  const ledgerDmkService = {
    getAppInfo: jest.fn(),
    getEthAppConfig: jest.fn(),
    ensureAppOpen: jest.fn(),
    closeApp: jest.fn(),
    getExtendedPublicKey: jest.fn(),
    getSolanaPublicKey: jest.fn(),
    getBtcMasterFingerprint: jest.fn(),
    getBtcExtendedPublicKey: jest.fn(),
    registerBtcWalletPolicy: jest.fn(),
  };

  const handle = (params: LedgerDeviceRequestParams) =>
    new LedgerDeviceRequestHandler(
      ledgerDmkService as unknown as LedgerDmkService,
    ).handle(
      buildRpcCall({
        id: '123',
        method: ExtensionRequest.LEDGER_DEVICE_REQUEST,
        params: [params],
      }),
    );

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns the app info', async () => {
    const appInfo = { applicationName: 'Avalanche', version: '1.0.0' };
    ledgerDmkService.getAppInfo.mockResolvedValue(appInfo);

    expect((await handle({ op: 'getAppInfo' })).result).toEqual(appInfo);
  });

  it('returns the Ethereum app config', async () => {
    ledgerDmkService.getEthAppConfig.mockResolvedValue({
      isBlindSigningEnabled: true,
    });

    expect((await handle({ op: 'getEthAppConfig' })).result).toEqual({
      isBlindSigningEnabled: true,
    });
  });

  it('opens the requested app', async () => {
    const response = await handle({ op: 'ensureAppOpen', appName: 'Solana' });

    expect(ledgerDmkService.ensureAppOpen).toHaveBeenCalledWith('Solana');
    expect(response.result).toBeNull();
  });

  it('closes the running app', async () => {
    const response = await handle({ op: 'closeApp' });

    expect(ledgerDmkService.closeApp).toHaveBeenCalled();
    expect(response.result).toBeNull();
  });

  it('returns the extended public key', async () => {
    ledgerDmkService.getExtendedPublicKey.mockResolvedValue('xpub123');

    const response = await handle({
      op: 'getExtendedPublicKey',
      path: "m/44'/60'/0'",
      display: true,
    });

    expect(ledgerDmkService.getExtendedPublicKey).toHaveBeenCalledWith(
      "m/44'/60'/0'",
      true,
    );
    expect(response.result).toEqual({ xpub: 'xpub123' });
  });

  it('returns the Solana public key hex-encoded', async () => {
    ledgerDmkService.getSolanaPublicKey.mockResolvedValue(
      Buffer.from([0xab, 0xcd]),
    );

    const response = await handle({
      op: 'getSolanaPublicKey',
      accountIndex: 2,
    });

    expect(ledgerDmkService.getSolanaPublicKey).toHaveBeenCalledWith(2);
    expect(response.result).toEqual({ publicKeyHex: 'abcd' });
  });

  it('returns the Bitcoin master fingerprint', async () => {
    ledgerDmkService.getBtcMasterFingerprint.mockResolvedValue('f00dbabe');

    expect((await handle({ op: 'getBtcMasterFingerprint' })).result).toEqual({
      fingerprint: 'f00dbabe',
    });
  });

  it('returns the Bitcoin extended public key', async () => {
    ledgerDmkService.getBtcExtendedPublicKey.mockResolvedValue('xpubBtc');

    const response = await handle({
      op: 'getBtcExtendedPublicKey',
      path: "m/44'/60'/0'",
    });

    expect(ledgerDmkService.getBtcExtendedPublicKey).toHaveBeenCalledWith(
      "m/44'/60'/0'",
    );
    expect(response.result).toEqual({ xpub: 'xpubBtc' });
  });

  it('returns the registered Bitcoin wallet policy hmac hex-encoded', async () => {
    ledgerDmkService.registerBtcWalletPolicy.mockResolvedValue(
      Buffer.from([0x02]),
    );

    const response = await handle({
      op: 'registerBtcWalletPolicy',
      xpub: 'xpub',
      masterFingerprint: 'f00dbabe',
      derivationPath: "44'/60'/0'",
      name: 'Core',
    });

    expect(ledgerDmkService.registerBtcWalletPolicy).toHaveBeenCalledWith(
      'xpub',
      'f00dbabe',
      "44'/60'/0'",
      'Core',
    );
    expect(response.result).toEqual({ hmacHex: '02' });
  });

  describe('errors', () => {
    it('returns the message of Error instances', async () => {
      ledgerDmkService.getAppInfo.mockRejectedValue(new Error('Locked'));

      expect((await handle({ op: 'getAppInfo' })).error).toBe('Locked');
    });

    it('serializes the own fields of DMK error objects', async () => {
      ledgerDmkService.getAppInfo.mockRejectedValue({
        _tag: 'DeviceLockedError',
        errorCode: '5515',
      });

      expect((await handle({ op: 'getAppInfo' })).error).toBe(
        JSON.stringify({ _tag: 'DeviceLockedError', errorCode: '5515' }),
      );
    });

    it('falls back to the class name of field-less error objects', async () => {
      class OpaqueDmkError {}
      ledgerDmkService.getAppInfo.mockRejectedValue(new OpaqueDmkError());

      expect((await handle({ op: 'getAppInfo' })).error).toBe('OpaqueDmkError');
    });

    it('stringifies primitive rejections', async () => {
      ledgerDmkService.getAppInfo.mockRejectedValue('timeout');

      expect((await handle({ op: 'getAppInfo' })).error).toBe('timeout');
    });
  });
});
