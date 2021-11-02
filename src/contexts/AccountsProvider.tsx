import React, { createContext, useContext, useEffect, useState } from 'react';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { concat, filter, from, map } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/models';
import { accountsUpdatedEventListener } from '@src/background/services/accounts/events/accountsUpdatedEventListener';
import { Account } from '@src/background/services/accounts/models';

const AccountsContext = createContext<{
  accounts: Account[];
  selectAccount(index: number): void;
  renameAccount(index: number, name: string): void;
  addAccount(): void;
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
        request({
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
  }, [request]);

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        selectAccount: (index: number) =>
          request({
            method: ExtensionRequest.ACCOUNT_SELECT,
            params: [index],
          }),
        renameAccount: (index: number, name: string) =>
          request({
            method: ExtensionRequest.ACCOUNT_RENAME,
            params: [index, name],
          }),
        addAccount: () =>
          request({
            method: ExtensionRequest.ACCOUNT_ADD,
            params: [],
          }),
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccountsContext() {
  return useContext(AccountsContext);
}
