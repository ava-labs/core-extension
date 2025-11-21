import { toast } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { Page } from '@/components/Page';
import { useAccountSearchParams } from '../../hooks/useAccountSearchParams';
import { isPrivateKeyRevealable } from '../../utils/isPrivateKeyRevealable';
import { EnterPassword } from './components/EnterPassword';
import { KeyRevealed } from './components/KeyRevealed';

export const ShowPrivateKey: FC = () => {
  const { t } = useTranslation();
  const accountParams = useAccountSearchParams();
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const revealed = privateKey != null;

  if (!accountParams.success) {
    toast.error(accountParams.error);
    return <Redirect to="/account-management" />;
  }

  const { account } = accountParams;

  if (!isPrivateKeyRevealable(account)) {
    toast.error(t('Account type not supported'));
    return <Redirect to="/account-management" />;
  }

  return (
    <Page
      title={
        revealed
          ? t('Here’s the private key for this account')
          : t('Enter your password to reveal the private key')
      }
      containerProps={{
        mt: 3,
      }}
      description={
        revealed
          ? t('This key gives access to your account’s addresses')
          : undefined
      }
      withBackButton
      contentProps={{ alignItems: 'stretch', justifyContent: 'flex-start' }}
    >
      {revealed ? (
        <KeyRevealed privateKey={privateKey} />
      ) : (
        <EnterPassword account={account} onAuthenticated={setPrivateKey} />
      )}
    </Page>
  );
};
