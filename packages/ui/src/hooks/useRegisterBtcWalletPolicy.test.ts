import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { AccountType, ExtensionRequest } from '@core/types';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  useAccountsContext,
  useConnectionContext,
  useLedgerContext,
  useWalletContext,
} from '../contexts';
import { useIsUsingLedgerWallet } from './useIsUsingLedgerWallet';
import { useRegisterBtcWalletPolicy } from './useRegisterBtcWalletPolicy';

jest.mock('../contexts', () => ({
  useAccountsContext: jest.fn(),
  useConnectionContext: jest.fn(),
  useLedgerContext: jest.fn(),
  useWalletContext: jest.fn(),
}));
jest.mock('./useIsUsingLedgerWallet');

describe('hooks/useRegisterBtcWalletPolicy', () => {
  const request = jest.fn();
  const setMasterFingerprint = jest.fn();
  const activeAccount = {
    type: AccountType.PRIMARY,
    walletId: 'wallet-id',
    name: 'Account 3',
    index: 2,
  };

  const mockContexts = ({
    derivationPath = DerivationPath.BIP44,
    walletId = 'wallet-id',
    account = activeAccount as Record<string, unknown>,
  } = {}) => {
    jest.mocked(useWalletContext).mockReturnValue({
      walletDetails: { id: walletId, derivationPath },
    } as any);
    jest
      .mocked(useAccountsContext)
      .mockReturnValue({ accounts: { active: account } } as any);
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(useIsUsingLedgerWallet).mockReturnValue(true);
    jest.mocked(useConnectionContext).mockReturnValue({ request } as any);
    jest
      .mocked(useLedgerContext)
      .mockReturnValue({ setMasterFingerprint } as any);
    mockContexts();
  });

  it('does nothing when the active wallet is not a Ledger', () => {
    jest.mocked(useIsUsingLedgerWallet).mockReturnValue(false);

    const { result } = renderHook(() => useRegisterBtcWalletPolicy());

    expect(request).not.toHaveBeenCalled();
    expect(result.current.shouldRegisterBtcWalletPolicy).toBe(false);
  });

  it('does nothing for non-primary accounts', () => {
    mockContexts({
      account: { ...activeAccount, type: AccountType.IMPORTED },
    });

    renderHook(() => useRegisterBtcWalletPolicy());

    expect(request).not.toHaveBeenCalled();
  });

  it('waits until the active account and wallet are in sync', () => {
    mockContexts({ walletId: 'other-wallet-id' });

    renderHook(() => useRegisterBtcWalletPolicy());

    expect(request).not.toHaveBeenCalled();
  });

  it('does not prompt when the policy is already registered', async () => {
    request.mockResolvedValue({ masterFingerprint: 'f00dbabe' });

    const { result } = renderHook(() => useRegisterBtcWalletPolicy());

    await waitFor(() =>
      expect(setMasterFingerprint).toHaveBeenLastCalledWith('f00dbabe'),
    );
    expect(request).toHaveBeenCalledWith({
      method: ExtensionRequest.WALLET_GET_BTC_WALLET_POLICY_DETAILS,
    });
    expect(result.current.shouldRegisterBtcWalletPolicy).toBe(false);
  });

  it('prompts for a wallet-wide policy on BIP44 wallets', async () => {
    request.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRegisterBtcWalletPolicy());

    await waitFor(() =>
      expect(result.current.shouldRegisterBtcWalletPolicy).toBe(true),
    );
    expect(result.current.walletPolicyName).toBe('Core');
    expect(result.current.walletPolicyDerivationpath).toBe(`44'/60'/0'`);
  });

  it('prompts for a per-account policy on Ledger Live wallets', async () => {
    mockContexts({ derivationPath: DerivationPath.LedgerLive });
    request.mockResolvedValue({});

    const { result } = renderHook(() => useRegisterBtcWalletPolicy());

    await waitFor(() =>
      expect(result.current.shouldRegisterBtcWalletPolicy).toBe(true),
    );
    expect(result.current.walletPolicyName).toBe('Core - Account 3');
    expect(result.current.walletPolicyDerivationpath).toBe(`44'/60'/2'`);
  });

  it('clears the prompt on reset', async () => {
    request.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRegisterBtcWalletPolicy());
    await waitFor(() =>
      expect(result.current.shouldRegisterBtcWalletPolicy).toBe(true),
    );

    act(() => result.current.reset());

    expect(result.current.shouldRegisterBtcWalletPolicy).toBe(false);
    expect(setMasterFingerprint).toHaveBeenLastCalledWith(undefined);
  });
});
