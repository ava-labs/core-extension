import { DerivationPath } from '@avalabs/core-wallets-sdk';
import {
  IMPORTED_ACCOUNTS_WALLET_ID,
  SecretType,
  WalletDetails,
} from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { FC } from 'react';
import AccountListItem from './components/AccountListItem';
import WalletCard from './components/WalletCard';

const ImportedAccountsWallet: WalletDetails = {
  id: IMPORTED_ACCOUNTS_WALLET_ID,
  type: SecretType.PrivateKey,
  name: 'Imported Accounts',
  derivationPath: DerivationPath.BIP44,
};

export const Wallets: FC = () => {
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
            wallet={wallet}
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
          wallet={ImportedAccountsWallet}
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
