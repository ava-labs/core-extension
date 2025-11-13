import { Account, IMPORTED_ACCOUNTS_WALLET_ID, SecretType } from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { Box, Stack } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountListItem } from './AccountListItem';
import { WalletCard } from '@/components/WalletCard';
import { WalletIcon } from '@/components/WalletIcon';
import * as Styled from './Styled';
import { AddOrConnectWalletButton } from '../../AddOrCreateWallet';

export const WalletList: FC = () => {
  const { t } = useTranslation();
  const { wallets } = useWalletContext();
  const { accounts, selectAccount, isActiveAccount } = useAccountsContext();
  const importedAccounts = Object.values(accounts.imported);
  const renderAccount = getAccountRenderer(isActiveAccount, selectAccount);

  return (
    <>
      {wallets.map((wallet) => {
        const walletAccounts = accounts.primary[wallet.id];
        if (!walletAccounts) {
          return undefined;
        }

        const isActiveWallet = walletAccounts.some(isActiveAccount);

        return (
          <WalletCard
            key={wallet.id}
            accountsNumber={walletAccounts.length}
            id={wallet.id}
            name={wallet.name}
            icon={
              <Stack direction="row" alignItems="center" gap={0.5}>
                {isActiveWallet && (
                  <Box
                    width={6}
                    height={6}
                    borderRadius="50%"
                    bgcolor="success.main"
                  />
                )}
                <WalletIcon
                  type={wallet.type}
                  authProvider={wallet.authProvider}
                />
              </Stack>
            }
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
                <>
                  {renderAccount(account)}
                  {!isLastItem && (
                    <Styled.AccountDivider
                      className={
                        shouldHideDivider ? 'account-divider-hidden' : ''
                      }
                    />
                  )}
                </>
              );
            })}
            {isActiveWallet && <AddOrConnectWalletButton />}
          </WalletCard>
        );
      })}
      {importedAccounts.length > 0 && (
        <WalletCard
          accountsNumber={importedAccounts.length}
          key={IMPORTED_ACCOUNTS_WALLET_ID}
          id={IMPORTED_ACCOUNTS_WALLET_ID}
          name={t('Imported Accounts')}
          icon={<WalletIcon type={SecretType.PrivateKey} />}
          initialExpanded={importedAccounts.some(isActiveAccount)}
        >
          {importedAccounts.map((account, index) => {
            const isSelectedActive = isActiveAccount(account.id);
            const isLastItem = index === importedAccounts.length - 1;
            const nextAccount = importedAccounts[index + 1];
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
              <>
                {renderAccount(account)}
                {!isLastItem && (
                  <Styled.AccountDivider
                    className={
                      shouldHideDivider ? 'account-divider-hidden' : ''
                    }
                  />
                )}
              </>
            );
          })}
          {importedAccounts.some(isActiveAccount) && (
            <AddOrConnectWalletButton />
          )}
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
