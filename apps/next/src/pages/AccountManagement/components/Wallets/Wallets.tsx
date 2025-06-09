import { IMPORTED_ACCOUNTS_WALLET_ID, SecretType } from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import AccountListItem from './components/AccountListItem';
import { WalletCard } from './components/WalletCard';
import { WalletIcon } from './components/WalletIcon';

export const Wallets: FC = () => {
  const { t } = useTranslation();
  const { wallets } = useWalletContext();
  const { accounts, selectAccount, isActiveAccount } = useAccountsContext();
  const importedAccounts = Object.values(accounts.imported);

  return (
    <>
      {wallets.map((wallet) => {
        const walletAccounts = accounts.primary[wallet.id];
        if (!walletAccounts) {
          return undefined;
        }

        return (
          <WalletCard
            key={wallet.id}
            id={wallet.id}
            name={wallet.name}
            icon={
              <WalletIcon
                type={wallet.type}
                authProvider={wallet.authProvider}
              />
            }
            initialExpanded={walletAccounts.some(isActiveAccount)}
          >
            {walletAccounts.map((account) => (
              <AccountListItem
                key={account.id}
                account={account}
                selected={isActiveAccount(account.id)}
                onSelect={selectAccount}
              />
            ))}
          </WalletCard>
        );
      })}
      {importedAccounts.length > 0 && (
        <WalletCard
          key={IMPORTED_ACCOUNTS_WALLET_ID}
          id={IMPORTED_ACCOUNTS_WALLET_ID}
          name={t('Imported Accounts')}
          icon={<WalletIcon type={SecretType.PrivateKey} />}
          initialExpanded={importedAccounts.some(isActiveAccount)}
        >
          {importedAccounts.map((account) => (
            <AccountListItem
              key={account.id}
              account={account}
              selected={isActiveAccount(account.id)}
              onSelect={selectAccount}
            />
          ))}
        </WalletCard>
      )}
    </>
  );
};
