import { getEvmAddressFromPubKey } from '@avalabs/core-wallets-sdk';
import { ExtensionRequest } from '@core/types';
import { renderHook, waitFor } from '@testing-library/react';
import {
  LedgerAppType,
  useAccountsContext,
  useConnectionContext,
  useLedgerContext,
  useWalletContext,
} from '../contexts';
import { useIsIncorrectDevice } from './useIsIncorrectDevice';

jest.mock('../contexts', () => ({
  LedgerAppType: jest.requireActual('../contexts/LedgerProvider/LedgerProvider')
    .LedgerAppType,
  useAccountsContext: jest.fn(),
  useConnectionContext: jest.fn(),
  useLedgerContext: jest.fn(),
  useWalletContext: jest.fn(),
}));
jest.mock('@avalabs/core-wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/core-wallets-sdk'),
  getEvmAddressFromPubKey: jest.fn(),
}));

describe('hooks/useIsIncorrectDevice', () => {
  const request = jest.fn();
  const getPublicKey = jest.fn();
  const getMasterFingerprint = jest.fn();
  const pubKey = Buffer.from('pubkey');

  const mockLedger = (overrides = {}) =>
    jest.mocked(useLedgerContext).mockReturnValue({
      hasLedgerTransport: true,
      getPublicKey,
      getMasterFingerprint,
      appType: LedgerAppType.AVALANCHE,
      masterFingerprint: undefined,
      ...overrides,
    } as any);

  beforeEach(() => {
    jest.resetAllMocks();
    request.mockResolvedValue(undefined);
    getPublicKey.mockResolvedValue(pubKey);
    jest.mocked(useConnectionContext).mockReturnValue({ request } as any);
    jest.mocked(useWalletContext).mockReturnValue({
      isWalletLocked: false,
      isLedgerWallet: true,
      walletDetails: { derivationPath: 'bip44' },
    } as any);
    jest.mocked(useAccountsContext).mockReturnValue({
      accounts: {
        active: { id: 'wallet-id' },
        primary: { 'wallet-id': [{ addressC: '0xFirstAddress' }] },
      },
    } as any);
    mockLedger();
  });

  it('flags a device whose first address does not match', async () => {
    jest.mocked(getEvmAddressFromPubKey).mockReturnValue('0xOtherAddress');

    const { result } = renderHook(() => useIsIncorrectDevice());

    await waitFor(() => expect(result.current).toBe(true));
    expect(getPublicKey).toHaveBeenCalledWith(0, 'bip44');
    expect(request).not.toHaveBeenCalled();
  });

  it('migrates missing keys once the Avalanche device is verified', async () => {
    jest.mocked(getEvmAddressFromPubKey).mockReturnValue('0xFirstAddress');

    const { result } = renderHook(() => useIsIncorrectDevice());

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith({
        method: ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
      }),
    );
    expect(result.current).toBe(false);
  });

  it('compares master fingerprints when the Bitcoin app is open', async () => {
    mockLedger({
      appType: LedgerAppType.BITCOIN,
      masterFingerprint: 'f00dbabe',
    });
    getMasterFingerprint.mockResolvedValue('deadbeef');

    const { result } = renderHook(() => useIsIncorrectDevice());

    await waitFor(() => expect(result.current).toBe(true));
    expect(getPublicKey).not.toHaveBeenCalled();
  });

  it('accepts a Bitcoin device with a matching fingerprint', async () => {
    mockLedger({
      appType: LedgerAppType.BITCOIN,
      masterFingerprint: 'f00dbabe',
    });
    getMasterFingerprint.mockResolvedValue('f00dbabe');

    const { result } = renderHook(() => useIsIncorrectDevice());

    await waitFor(() => expect(getMasterFingerprint).toHaveBeenCalled());
    expect(result.current).toBe(false);
  });

  it('ignores device errors', async () => {
    getPublicKey.mockRejectedValue(new Error('app closed'));

    const { result } = renderHook(() => useIsIncorrectDevice());

    await waitFor(() => expect(getPublicKey).toHaveBeenCalled());
    expect(result.current).toBe(false);
  });

  it('skips the check without a Ledger transport', () => {
    mockLedger({ hasLedgerTransport: false });

    const { result } = renderHook(() => useIsIncorrectDevice());

    expect(getPublicKey).not.toHaveBeenCalled();
    expect(result.current).toBe(false);
  });
});
