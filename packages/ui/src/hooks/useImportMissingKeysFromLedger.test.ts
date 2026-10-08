import { ExtensionRequest } from '@core/types';
import { renderHook, waitFor } from '@testing-library/react';
import {
  LedgerAppType,
  useLedgerContext,
  useConnectionContext,
  useWalletContext,
} from '../contexts';
import { useImportMissingKeysFromLedger } from './useImportMissingKeysFromLedger';
import { useIsCorrectDeviceForActiveWallet } from './useIsCorrectDeviceForActiveWallet';

jest.mock('../contexts', () => ({
  LedgerAppType: jest.requireActual('../contexts/LedgerProvider/LedgerProvider')
    .LedgerAppType,
  useLedgerContext: jest.fn(),
  useConnectionContext: jest.fn(),
  useWalletContext: jest.fn(),
}));
jest.mock('./useIsCorrectDeviceForActiveWallet');

describe('hooks/useImportMissingKeysFromLedger', () => {
  const request = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    request.mockResolvedValue(undefined);
    jest.mocked(useConnectionContext).mockReturnValue({ request } as any);
    jest
      .mocked(useLedgerContext)
      .mockReturnValue({ appType: LedgerAppType.AVALANCHE } as any);
    jest
      .mocked(useWalletContext)
      .mockReturnValue({ isLedgerWallet: true } as any);
    jest.mocked(useIsCorrectDeviceForActiveWallet).mockReturnValue('correct');
  });

  it('migrates missing keys once the correct Avalanche device is connected', async () => {
    renderHook(() => useImportMissingKeysFromLedger());

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith({
        method: ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
      }),
    );
  });

  it('only migrates once per session', async () => {
    const { rerender } = renderHook(() => useImportMissingKeysFromLedger());
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));

    jest
      .mocked(useLedgerContext)
      .mockReturnValue({ appType: LedgerAppType.BITCOIN } as any);
    rerender();
    jest
      .mocked(useLedgerContext)
      .mockReturnValue({ appType: LedgerAppType.AVALANCHE } as any);
    rerender();

    expect(request).toHaveBeenCalledTimes(1);
  });

  it('retries on the next opportunity when the migration fails', async () => {
    request.mockRejectedValueOnce(new Error('device busy'));

    const { rerender } = renderHook(() => useImportMissingKeysFromLedger());
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));

    jest
      .mocked(useLedgerContext)
      .mockReturnValue({ appType: LedgerAppType.BITCOIN } as any);
    rerender();
    jest
      .mocked(useLedgerContext)
      .mockReturnValue({ appType: LedgerAppType.AVALANCHE } as any);
    rerender();

    await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
  });

  it.each([
    ['the wallet is not a Ledger', { isLedgerWallet: false }, 'correct', 'AVA'],
    ['the device is incorrect', { isLedgerWallet: true }, 'incorrect', 'AVA'],
    [
      'the Avalanche app is not open',
      { isLedgerWallet: true },
      'correct',
      'BTC',
    ],
  ])('does nothing when %s', (_, wallet, status, app) => {
    jest.mocked(useWalletContext).mockReturnValue(wallet as any);
    jest
      .mocked(useIsCorrectDeviceForActiveWallet)
      .mockReturnValue(status as any);
    jest.mocked(useLedgerContext).mockReturnValue({
      appType: app === 'AVA' ? LedgerAppType.AVALANCHE : LedgerAppType.BITCOIN,
    } as any);

    renderHook(() => useImportMissingKeysFromLedger());

    expect(request).not.toHaveBeenCalled();
  });
});
