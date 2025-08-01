import { Page } from '@/components/Page';
import { PasswordField } from '@/components/StandaloneField';
import { WarningMessage } from '@/components/WarningMessage';
import { MIN_PASSWORD_LENGTH } from '@/pages/Settings/constants';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ShowPhrase: FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');

  const handleShowRecoveryPhrase = () => {
    // TODO: Implement recovery phrase display logic
    console.log('Show recovery phrase with password:', password);
  };

  return (
    <Page
      title={t('Recovery phrase')}
      description={t(
        'This phrase is your access key to your wallet. Carefully write it down and store it in a safe location',
      )}
      contentProps={{
        gap: 2.5,
        width: 1,
        justifyContent: undefined,
        alignItems: undefined,
      }}
    >
      <WarningMessage>
        {t('Losing this phrase will result in lost funds')}
      </WarningMessage>

      <Stack gap={1}>
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('Enter password')}
          fullWidth
        />
        <Typography variant="caption" color="text.secondary">
          {t('Enter your password to view your recovery phrase')}
        </Typography>
      </Stack>

      <Button
        variant="contained"
        size="extension"
        fullWidth
        disabled={!password || password.length < MIN_PASSWORD_LENGTH}
        onClick={handleShowRecoveryPhrase}
        sx={{ mt: 'auto' }}
      >
        {t('Show recovery phrase')}
      </Button>
    </Page>
  );
};
