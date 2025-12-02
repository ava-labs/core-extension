import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { concat, filter, from, map } from 'rxjs';
import {
  Accounts,
  ImportData,
  Account,
  ExtensionRequest,
  DAppProviderRequest,
  IMPORTED_ACCOUNTS_WALLET_ID,
} from '@core/types';
import {
  AddAccountHandler,
  GetAccountsHandler,
  SelectAccountHandler,
  AvalancheRenameAccountHandler,
  AvalancheDeleteAccountsHandler,
} from '@core/service-worker';
import { NetworkVMType } from '@avalabs/vm-module-types';
import {
  getAddressByVMType,
  getAllAddressesForAccount,
  isPrimaryAccount,
} from '@core/common';
import { isAccountsUpdatedEvent } from './isAccountsUpdatedEvent';
import { useConnectionContext } from '../ConnectionProvider';

const AccountsContext = createContext<
  | {
      accounts: Accounts;
      allAccounts: Account[];
      getAllAccountsForVM: (vm: NetworkVMType) => Account[];
      getAllWalletAccountsForVM: (
        vm: NetworkVMType,
        walletId: string,
      ) => Account[];
      isActiveAccount(id: Account | Account['id']): boolean;
      selectAccount(id: string): Promise<any>;
      renameAccount(id: string, name: string): Promise<any>;
      addAccount(name?: string, importData?: ImportData): Promise<string>;
      deleteAccounts(ids: string[]): Promise<any>;
      getAccount(address: string): Account | undefined;
      getAccountById(id: string): Account | undefined;
      getAccountByIndex(index: number): Account | undefined;
      getAccountsByWalletId(walletId: string): Account[];
    }
  | undefined
>(undefined);

export function AccountsContextProvider({ children }: PropsWithChildren) {
  const { request, events } = useConnectionContext();
  const [accounts, setAccounts] = useState<Accounts>({
    active: undefined,
    primary: {},
    imported: {},
  });

  useEffect(() => {
    if (!request || !events) {
      return;
    }
    const subscription = concat(
      from(
        request<GetAccountsHandler>({
          method: ExtensionRequest.ACCOUNT_GET_ACCOUNTS,
        }),
      ),
      events().pipe(
        filter(isAccountsUpdatedEvent),
        map((evt) => {
          return evt.value;
        }),
      ),
    ).subscribe((result) => {
      setAccounts(result);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  const allAccounts = useMemo(
    () => [
      ...Object.values(accounts.primary).flat(),
      ...Object.values(accounts.imported),
    ],
    [accounts.imported, accounts.primary],
  );

  const getAllAccountsForVM = useCallback(
    (vm: NetworkVMType) =>
      allAccounts.filter((acc) => getAddressByVMType(acc, vm)),
    [allAccounts],
  );

  const getAllWalletAccountsForVM = useCallback(
    (vm: NetworkVMType, walletId: string) => {
      return allAccounts.filter(
        (acc) =>
          getAddressByVMType(acc, vm) &&
          (isPrimaryAccount(acc)
            ? acc.walletId === walletId
            : walletId === IMPORTED_ACCOUNTS_WALLET_ID),
      );
    },
    [allAccounts],
  );

  const getAccount = useCallback(
    (address: string) =>
      allAccounts.find((acc) =>
        getAllAddressesForAccount(acc)
          .map((addy) => addy?.toLowerCase())
          .includes(address.toLowerCase()),
      ),
    [allAccounts],
  );

  const getAccountById = useCallback(
    (accountId: string) =>
      allAccounts.find(
        (acc) => acc.id.toLowerCase() === accountId.toLowerCase(),
      ),
    [allAccounts],
  );

  const selectAccount = useCallback(
    (id: string) => {
      return request<SelectAccountHandler>({
        method: ExtensionRequest.ACCOUNT_SELECT,
        params: [id],
      });
    },
    [request],
  );

  const renameAccount = useCallback(
    (id: string, name: string) => {
      return request<AvalancheRenameAccountHandler>({
        method: DAppProviderRequest.ACCOUNT_RENAME,
        params: [id, name],
      });
    },
    [request],
  );

  const addAccount = useCallback(
    (name?: string, importData?: ImportData, walletId?: string) =>
      request<AddAccountHandler>({
        method: ExtensionRequest.ACCOUNT_ADD,
        params: { name, importData, walletId },
      }),
    [request],
  );

  const deleteAccounts = useCallback(
    (ids: string[]) =>
      request<AvalancheDeleteAccountsHandler>({
        method: DAppProviderRequest.ACCOUNTS_DELETE,
        params: [ids],
      }),
    [request],
  );

  const isActiveAccount = useCallback<
    (accountOrId: Account | Account['id']) => boolean
  >(
    (accountOrId) => {
      const id = typeof accountOrId === 'string' ? accountOrId : accountOrId.id;
      return accounts.active?.id === id;
    },
    [accounts],
  );

  const getAccountByIndex = useCallback(
    (index: number) => {
      if (!accounts.active) {
        return undefined;
      }

      if (!isPrimaryAccount(accounts.active)) {
        return accounts.active;
      }

      return accounts.primary[accounts.active.walletId]?.[index];
    },
    [accounts.active, accounts.primary],
  );

  const getAccountsByWalletId = useCallback(
    (walletId: string) => {
      return allAccounts.filter((acc) =>
        isPrimaryAccount(acc) ? acc.walletId === walletId : walletId === acc.id,
      );
    },
    [allAccounts],
  );

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        getAccount,
        getAccountById,
        getAccountByIndex,
        allAccounts,
        getAllAccountsForVM,
        getAllWalletAccountsForVM,
        isActiveAccount,
        selectAccount,
        renameAccount,
        addAccount,
        deleteAccounts,
        getAccountsByWalletId,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccountsContext() {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error(
      'useAccountsContext must be used within a AccountsContextProvider',
    );
  }
  return context;
}
