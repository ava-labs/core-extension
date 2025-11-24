import { FC } from 'react';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Page } from '@/components/Page';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { useWalletSearchParams } from '../../hooks/useWalletSearchParams';
import { RenameAccountForm } from './components/AccountForm';
import { RenameWalletForm } from './components/WalletForm';

export const RenamePage: FC = () => {
  const { t } = useTranslation();
  const accountParams = useAccountSearchParams(false);
  const walletParams = useWalletSearchParams();

  if (walletParams.success) {
    return (
      <Page
        title={t('Rename wallet')}
        withBackButton
        containerProps={{
          mt: 3,
        }}
        contentProps={{ alignItems: 'stretch', justifyContent: 'flex-start' }}
      >
        <RenameWalletForm wallet={walletParams.wallet} />
      </Page>
    );
  }

  if (accountParams.success) {
    return (
      <Page
        title={t('Rename account')}
        withBackButton
        containerProps={{
          mt: 3,
        }}
        contentProps={{ alignItems: 'stretch', justifyContent: 'flex-start' }}
      >
        <RenameAccountForm account={accountParams.account} />
      </Page>
    );
  }

  return <Redirect to="/account-management" />;
};
