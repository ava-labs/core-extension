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
import { Account } from '@src/background/services/accounts/models';
import { GetAccountsHandler } from '@src/background/services/accounts/handlers/getAccounts';
import { SelectAccountHandler } from '@src/background/services/accounts/handlers/selectAccount';
import { RenameAccountHandler } from '@src/background/services/accounts/handlers/renameAccount';
import { AddAccountHandler } from '@src/background/services/accounts/handlers/addAccount';

const AccountsContext = createContext<{
  accounts: Account[];
  activeAccount?: Account;
  selectAccount(index: number): Promise<any>;
  renameAccount(index: number, name: string): Promise<any>;
  addAccount(): Promise<any>;
}>({} as any);

export function AccountsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [accounts, setAccounts] = useState<Account[]>([]);

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

  const activeAccount = useMemo(() => {
    return accounts.find((a) => a.active);
  }, [accounts]);

  const selectAccount = useCallback(
    (index: number) =>
      request<SelectAccountHandler>({
        method: ExtensionRequest.ACCOUNT_SELECT,
        params: [index],
      }),
    [request]
  );

  const renameAccount = useCallback(
    (index: number, name: string) =>
      request<RenameAccountHandler>({
        method: ExtensionRequest.ACCOUNT_RENAME,
        params: [index, name],
      }),
    [request]
  );

  const addAccount = useCallback(
    () => request<AddAccountHandler>({ method: ExtensionRequest.ACCOUNT_ADD }),
    [request]
  );

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        activeAccount,
        selectAccount,
        renameAccount,
        addAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccountsContext() {
  return useContext(AccountsContext);
}
