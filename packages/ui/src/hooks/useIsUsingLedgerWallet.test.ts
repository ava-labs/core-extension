import { AccountType } from '@core/types';
import { useAccountsContext } from '../contexts/AccountsProvider';
import { useWalletContext } from '../contexts/WalletProvider';
import { renderHook } from '@testing-library/react';
import { useIsUsingLedgerWallet } from './useIsUsingLedgerWallet';

jest.mock('../contexts/AccountsProvider', () => ({
  useAccountsContext: jest.fn(),
}));

jest.mock('../contexts/WalletProvider', () => ({
  useWalletContext: jest.fn(),
}));

describe('hooks/useIsUsingLedgerWallet', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useWalletContext as jest.Mock).mockReturnValue({
      isLedgerWallet: true,
    });
    (useAccountsContext as jest.Mock).mockReturnValue({
      accounts: {
        active: {
          type: AccountType.PRIMARY,
        },
      },
    });
  });

  it('returns false if wallet type is not ledger', () => {
    (useWalletContext as jest.Mock).mockReturnValue({
      isLedgerWallet: false,
    });

    const { result } = renderHook(() => useIsUsingLedgerWallet());
    expect(result.current).toBe(false);
  });

  it('returns false if account type is not primary', () => {
    (useAccountsContext as jest.Mock).mockReturnValue({
      accounts: {
        active: {
          type: AccountType.IMPORTED,
        },
      },
    });

    const { result } = renderHook(() => useIsUsingLedgerWallet());
    expect(result.current).toBe(false);
  });

  it('returns true if wallet is ledger and account type is primary', () => {
    const { result } = renderHook(() => useIsUsingLedgerWallet());
    expect(result.current).toBe(true);
  });
});
