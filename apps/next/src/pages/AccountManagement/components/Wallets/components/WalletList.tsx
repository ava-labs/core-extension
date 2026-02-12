import { WalletCard } from '@/components/WalletCard';
import { WalletIcon } from '@/components/WalletIcon';
import {
  Account,
  AccountType,
  IMPORTED_ACCOUNTS_WALLET_ID,
  SecretType,
} from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { AddAccountButton } from '../../AddOrCreateWallet';
import { AccountListItem } from './AccountListItem';
import * as Styled from './Styled';
import { isImportedAccount } from '@core/common';

export const WalletList: FC = () => {
  const { t } = useTranslation();
  const { wallets } = useWalletContext();
  const { accounts, selectAccount, isActiveAccount } = useAccountsContext();
  const importedAccounts = Object.values(accounts.imported);
  const renderAccount = getAccountRenderer(isActiveAccount, selectAccount);
  const isActiveAccountImported = isImportedAccount(accounts.active);

  return (
    <>
      {wallets.map((wallet) => {
        const walletAccounts = accounts.primary[wallet.id];
        if (!walletAccounts) {
          return undefined;
        }

        const isActiveWallet = walletAccounts.some(isActiveAccount);
        const isPrimaryAccount = accounts.active?.type === AccountType.PRIMARY;

        return (
          <WalletCard
            key={wallet.id}
            accountsNumber={walletAccounts.length}
            id={wallet.id}
            name={wallet.name}
            icon={
              <WalletIcon
                type={wallet.type}
                authProvider={wallet.authProvider}
                size={24}
              />
            }
            showActiveIndicator={isActiveWallet}
            initialExpanded={isActiveWallet}
          >
            {walletAccounts.map((account, index) => {
              const isSelectedActive = isActiveAccount(account.id);
              const isLastItem = index === walletAccounts.length - 1;
              const nextAccount = walletAccounts[index + 1];
              const isNextActive = nextAccount
                ? isActiveAccount(nextAccount.id)
                : false;

              // Hide divider if:
              // - Last item (no divider after last)
              // - Current account is active (no divider below active)
              // - Next account is active (no divider above active)
              const shouldHideDivider =
                isLastItem || isSelectedActive || isNextActive;

              return (
                <Fragment key={account.id}>
                  {renderAccount(account)}
                  {!isLastItem && (
                    <Styled.AccountDivider
                      className={
                        shouldHideDivider ? 'account-divider-hidden' : ''
                      }
                    />
                  )}
                </Fragment>
              );
            })}
            {isActiveWallet && isPrimaryAccount && <AddAccountButton />}
          </WalletCard>
        );
      })}
      {importedAccounts.length > 0 && (
        <WalletCard
          accountsNumber={importedAccounts.length}
          id={IMPORTED_ACCOUNTS_WALLET_ID}
          disableRename
          name={t('Imported accounts')}
          icon={<WalletIcon type={SecretType.PrivateKey} size={24} />}
          showActiveIndicator={isActiveAccountImported}
          initialExpanded={isActiveAccountImported}
        >
          {importedAccounts.map(renderAccount)}
        </WalletCard>
      )}
    </>
  );
};

type AccountsCtx = ReturnType<typeof useAccountsContext>;
const getAccountRenderer =
  (
    isActiveAccount: AccountsCtx['isActiveAccount'],
    selectAccount: AccountsCtx['selectAccount'],
  ) =>
  // eslint-disable-next-line react/display-name
  (account: Account) => (
    <AccountListItem
      key={account.id}
      account={account}
      active={isActiveAccount(account.id)}
      onSelect={selectAccount}
    />
  );
