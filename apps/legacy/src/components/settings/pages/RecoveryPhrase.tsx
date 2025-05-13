import { useState } from 'react';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useWalletContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangleIcon,
  Button,
  Stack,
  TextField,
  Typography,
  LoadingDots,
} from '@avalabs/core-k2-components';

export function RecoveryPhrase({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [recoveryValue, setRecoveryValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fetchingRecoveryValue, setFetchingRecoveryValue] =
    useState<boolean>(false);

  const { getUnencryptedMnemonic } = useWalletContext();

  const handleShowRecoveryPhrase = () => {
    setFetchingRecoveryValue(true);
    getUnencryptedMnemonic(passwordValue)
      .then((res) => {
        setRecoveryValue(res);
        setFetchingRecoveryValue(false);
      })
      .catch((err) => {
        setErrorMessage(err);
        setFetchingRecoveryValue(false);
      });
  };

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Recovery Phrase')}
      />
      <Stack
        sx={{
          mx: 2,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <AlertTriangleIcon sx={{ color: 'warning.main', fontSize: 24 }} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          {t(
            'Do not share this phrase with anyone! These words can be used to steal all your accounts.',
          )}
        </Typography>
      </Stack>

      <Stack sx={{ pt: 3, px: 2 }}>
        <TextField
          data-testid="recovery-phrase-password-input"
          type="password"
          label={t('Password')}
          error={!!errorMessage}
          helperText={errorMessage}
          onChange={(e) => {
            setPasswordValue(e.target.value);
            setErrorMessage('');
          }}
          placeholder={t('Enter password')}
          size="small"
          fullWidth
          sx={{
            mb: 2,
          }}
        />
        {fetchingRecoveryValue && <LoadingDots size={24} />}
        {recoveryValue && (
          <TextField
            data-testid="recovery-phrase"
            value={recoveryValue}
            label={t('Recovery Phrase')}
            multiline
            InputProps={{
              readOnly: true,
            }}
          />
        )}
      </Stack>

      <Stack
        sx={{
          flexGrow: '1',
          width: '100%',
          padding: '0 16px 24px',
          justifyContent: 'flex-end',
          alignContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', textAlign: 'center', mb: 2, px: 0.25 }}
        >
          {t(
            'If you ever change browsers or move computers, you will need this Secret Recovery Phrase to access your accounts. Save them somewhere safe and secret.',
          )}
        </Typography>
        <Button
          data-testid="show-recovery-phrase-button"
          onClick={handleShowRecoveryPhrase}
          fullWidth
          disabled={!!recoveryValue}
        >
          {t('Show Recovery Phrase')}
        </Button>
      </Stack>
    </Stack>
  );
}
