import {
  createContext,
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
} from '@core/types';
import {
  AddAccountHandler,
  GetAccountsHandler,
  SelectAccountHandler,
  AvalancheRenameAccountHandler,
  AvalancheDeleteAccountsHandler,
} from '@core/service-worker';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { getAddressByVMType, getAllAddressesForAccount } from '@core/common';
import { isAccountsUpdatedEvent } from './isAccountsUpdatedEvent';
import { useConnectionContext } from '../ConnectionProvider';

const AccountsContext = createContext<{
  accounts: Accounts;
  allAccounts: Account[];
  getAllAccountsForVM: (vm: NetworkVMType) => Account[];
  isActiveAccount(id: string): boolean;
  selectAccount(id: string): Promise<any>;
  renameAccount(id: string, name: string): Promise<any>;
  addAccount(name?: string, importData?: ImportData): Promise<string>;
  deleteAccounts(ids: string[]): Promise<any>;
  getAccount(address: string): Account | undefined;
  getAccountById(id: string): Account | undefined;
}>({} as any);

export function AccountsContextProvider({ children }: { children?: any }) {
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

  const isActiveAccount = useCallback(
    (id: string) => {
      return accounts.active?.id === id;
    },
    [accounts],
  );

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        getAccount,
        getAccountById,
        allAccounts,
        getAllAccountsForVM,
        isActiveAccount,
        selectAccount,
        renameAccount,
        addAccount,
        deleteAccounts,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccountsContext() {
  return useContext(AccountsContext);
}
