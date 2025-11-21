import { Account, IMPORTED_ACCOUNTS_WALLET_ID, SecretType } from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountListItem } from './AccountListItem';
import { WalletCard } from '@/components/WalletCard';
import { WalletIcon } from '@/components/WalletIcon';
import { useHistory } from 'react-router-dom';

export const WalletList: FC = () => {
  const { t } = useTranslation();
  const { wallets } = useWalletContext();
  const history = useHistory();
  const { accounts, selectAccount, isActiveAccount } = useAccountsContext();
  const importedAccounts = Object.values(accounts.imported);
  const renderAccount = getAccountRenderer(
    isActiveAccount,
    selectAccount,
    history,
  );

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
            {walletAccounts.map(renderAccount)}
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
          {importedAccounts.map(renderAccount)}
        </WalletCard>
      )}
    </>
  );
};

type AccountsCtx = ReturnType<typeof useAccountsContext>;
type History = ReturnType<typeof useHistory>;
const getAccountRenderer =
  (
    isActiveAccount: AccountsCtx['isActiveAccount'],
    selectAccount: AccountsCtx['selectAccount'],
    history: History,
  ) =>
  // eslint-disable-next-line react/display-name
  (account: Account) => (
    <AccountListItem
      key={account.id}
      account={account}
      active={isActiveAccount(account.id)}
      onSelect={() => {
        selectAccount(account.id);
        history.push(`/portfolio`);
      }}
    />
  );
