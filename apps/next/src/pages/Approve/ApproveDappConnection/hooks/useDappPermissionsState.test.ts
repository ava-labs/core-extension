import { renderHook, act } from '@testing-library/react';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { SecretType, Account } from '@core/types';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { isChainSupportedByWallet } from '@core/common';
import { useDappPermissionsState } from './useDappPermissionsState';

jest.mock('@core/ui');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  isChainSupportedByWallet: jest.fn(),
  mapAddressesToVMs: jest.fn((account: Account) => ({
    [NetworkVMType.EVM]: account.addressC,
  })),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const makeAccount = (id: string, addressC = `0x${id}`): Account =>
  ({
    id,
    name: `Account ${id}`,
    addressC,
    addressBTC: '',
    addressAVM: '',
    addressPVM: '',
    addressCoreEth: '',
    walletId: 'wallet-1',
    index: 0,
    type: 'primary',
  }) as unknown as Account;

const wallet1 = {
  id: 'wallet-1',
  name: 'Wallet 1',
  type: SecretType.Mnemonic,
  derivationPath: DerivationPath.BIP44,
};

const displayData = {
  canSkipApproval: false,
  addressVM: NetworkVMType.EVM,
  isMalicious: false,
  dappUrl: 'https://example.com',
  dappIcon: '',
  dappDomain: 'example.com',
};

describe('useDappPermissionsState', () => {
  const account1 = makeAccount('acc-1', '0xaaa');
  const account2 = makeAccount('acc-2', '0xbbb');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(isChainSupportedByWallet).mockReturnValue(true);
    jest.mocked(useAccountsContext).mockReturnValue({
      allAccounts: [account1, account2],
      getAllWalletAccountsForVM: jest
        .fn()
        .mockReturnValue([account1, account2]),
      getAccount: jest.fn(),
    } as unknown as ReturnType<typeof useAccountsContext>);
    jest.mocked(useWalletContext).mockReturnValue({
      wallets: [wallet1],
      walletDetails: wallet1,
    } as unknown as ReturnType<typeof useWalletContext>);
  });

  it('defaults to the active account as selected', () => {
    const { result } = renderHook(() =>
      useDappPermissionsState(account1, displayData),
    );

    expect(result.current.selectedAccountId).toBe('acc-1');
  });

  it('allows selecting a different account', () => {
    const { result } = renderHook(() =>
      useDappPermissionsState(account1, displayData),
    );

    act(() => {
      result.current.selectAccount('acc-2');
    });

    expect(result.current.selectedAccountId).toBe('acc-2');
  });

  it('selecting one account deselects the previously selected one', () => {
    const { result } = renderHook(() =>
      useDappPermissionsState(account1, displayData),
    );

    act(() => {
      result.current.selectAccount('acc-2');
    });

    expect(result.current.selectedAccountId).toBe('acc-2');

    act(() => {
      result.current.selectAccount('acc-1');
    });

    expect(result.current.selectedAccountId).toBe('acc-1');
  });

  it('reports numberOfSelectedAccounts as 1 when an account is selected', () => {
    const { result } = renderHook(() =>
      useDappPermissionsState(account1, displayData),
    );

    expect(result.current.numberOfSelectedAccounts).toBe(1);
  });

  it('falls back to the first VM-capable account when the active account has no address for the requested VM', () => {
    const nonVmAccount = makeAccount('no-vm', '');
    const vmAccount = makeAccount('has-vm', '0xccc');

    jest.mocked(useAccountsContext).mockReturnValue({
      allAccounts: [nonVmAccount, vmAccount],
      getAllWalletAccountsForVM: jest.fn().mockReturnValue([vmAccount]),
      getAccount: jest.fn(),
    } as unknown as ReturnType<typeof useAccountsContext>);

    // Active account has no EVM address; only vmAccount does
    const { mapAddressesToVMs: mockMap } = jest.requireMock('@core/common');
    mockMap.mockImplementation((account: { id: string; addressC: string }) =>
      account.id === 'no-vm' ? {} : { [NetworkVMType.EVM]: account.addressC },
    );

    const { result } = renderHook(() =>
      useDappPermissionsState(nonVmAccount, displayData),
    );

    expect(result.current.selectedAccountId).toBe('has-vm');
  });

  it('keeps the active account selected when it supports the requested VM', () => {
    const { result } = renderHook(() =>
      useDappPermissionsState(account2, displayData),
    );

    expect(result.current.selectedAccountId).toBe('acc-2');
  });
});
