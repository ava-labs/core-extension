import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { concat, filter, from, map } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { accountsUpdatedEventListener } from '@src/background/services/accounts/events/accountsUpdatedEventListener';
import {
  Accounts,
  ImportData,
  Account,
} from '@src/background/services/accounts/models';
import { GetAccountsHandler } from '@src/background/services/accounts/handlers/getAccounts';
import { SelectAccountHandler } from '@src/background/services/accounts/handlers/selectAccount';
import { RenameAccountHandler } from '@src/background/services/accounts/handlers/renameAccount';
import { AddAccountHandler } from '@src/background/services/accounts/handlers/addAccount';
import { DeleteAccountHandler } from '@src/background/services/accounts/handlers/deleteAccounts';

const AccountsContext = createContext<{
  accounts: Accounts;
  allAccounts: Account[];
  isActiveAccount(id: string): boolean;
  selectAccount(id: string): Promise<any>;
  renameAccount(id: string, name: string): Promise<any>;
  addAccount(name?: string, importData?: ImportData): Promise<any>;
  deleteAccounts(ids: string[]): Promise<any>;
}>({} as any);

export function AccountsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [accounts, setAccounts] = useState<Accounts>({
    active: undefined,
    primary: [],
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
        })
      ),
      events().pipe(
        filter(accountsUpdatedEventListener),
        map((evt) => evt.value)
      )
    ).subscribe((result) => {
      setAccounts(result);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  const allAccounts = useMemo(
    () => [...accounts.primary, ...Object.values(accounts.imported)],
    [accounts.imported, accounts.primary]
  );

  const selectAccount = useCallback(
    (id: string) => {
      return request<SelectAccountHandler>({
        method: ExtensionRequest.ACCOUNT_SELECT,
        params: [id],
      });
    },
    [request]
  );

  const renameAccount = useCallback(
    (id: string, name: string) => {
      return request<RenameAccountHandler>({
        method: ExtensionRequest.ACCOUNT_RENAME,
        params: [id, name],
      });
    },
    [request]
  );

  const addAccount = useCallback(
    (name?: string, importData?: ImportData) =>
      request<AddAccountHandler>({
        method: ExtensionRequest.ACCOUNT_ADD,
        params: [name, importData],
      }),
    [request]
  );

  const deleteAccounts = useCallback(
    (ids: string[]) =>
      request<DeleteAccountHandler>({
        method: ExtensionRequest.ACCOUNT_DELETE,
        params: [ids],
      }),
    [request]
  );

  const isActiveAccount = useCallback(
    (id: string) => {
      return accounts.active?.id === id;
    },
    [accounts.active]
  );

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        allAccounts,
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
