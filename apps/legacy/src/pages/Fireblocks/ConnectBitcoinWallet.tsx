import {
  Button,
  Stack,
  TextField,
  Typography,
  toast,
  useTheme,
  Scrollbars,
  Link,
} from '@avalabs/core-k2-components';
import { PageTitle } from '@/components/common/PageTitle';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { FireblocksAvatar } from './components/FireblocksAvatar';
import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useCallback, useState } from 'react';
import { TextFieldLabel } from '@/components/common/TextFieldLabel';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { FireblocksUpdateApiCredentialsHandler } from '@core/service-worker';
import { useFireblocksErrorMessage } from './hooks/useFireblocksErrorMessage';
import { useAnalyticsContext } from '@core/ui';

export default function ConnectBitcoinWallet() {
  const history = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();
  const { request } = useConnectionContext();
  const { capture } = useAnalyticsContext();
  const { accountId } = useParams<{
    accountId: string;
  }>();
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { getErrorMessage } = useFireblocksErrorMessage();
  const [isLoading, setIsLoading] = useState(false);

  const onNextStep = useCallback(() => {
    toast.success(t('New Account Added!'), { duration: 2000 });
    history.push('/accounts');
  }, [history, t]);

  const onConnect = useCallback(() => {
    if (!apiKey || !secretKey) {
      return;
    }

    setIsLoading(true);
    request<FireblocksUpdateApiCredentialsHandler>({
      method: ExtensionRequest.FIREBLOCKS_UPDATE_API_CREDENTIALS,
      params: [accountId, apiKey, secretKey],
    })
      .then(() => {
        capture('ImportWithFireblocks_Success_BTC');
        onNextStep();
      })
      .catch((err) => {
        setApiKey('');
        setSecretKey('');
        setErrorMessage(getErrorMessage(err));
      })
      .finally(() => setIsLoading(false));
  }, [
    accountId,
    capture,
    getErrorMessage,
    apiKey,
    onNextStep,
    request,
    secretKey,
  ]);
  return (
    <Stack
      sx={{
        width: 1,
        backgroundColor: 'background.paper',
      }}
    >
      {isLoading && <LoadingOverlay />}
      <Stack
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <PageTitle margin="20px 0 4px" onBackClick={onNextStep}>
          {t('Connect Bitcoin Wallet')}
        </PageTitle>
        <Scrollbars>
          <Stack
            sx={{
              gap: 2.5,
              px: 5,
              mt: 3,
              alignItems: 'center',
            }}
          >
            <FireblocksAvatar badgeIcon="bitcoin" />
            <Typography>
              <Trans
                i18nKey="Open your Fireblocks account to access your API and Secret Key. <docsLink>Learn more</docsLink>."
                components={{
                  docsLink: (
                    <Link
                      href="https://support.avax.network/en/articles/8506107-core-extension-how-do-i-import-a-fireblocks-account"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              />
            </Typography>
          </Stack>
          <Stack sx={{ pt: 3, px: 2, width: '100%', gap: 1 }}>
            <TextFieldLabel
              label={t('Input API Key')}
              tooltip={t('The API key can be found in the Fireblocks console')}
            />
            <TextField
              data-testid="input-api-key"
              type="password"
              onChange={(e) => {
                setApiKey(e.target.value);
                setErrorMessage('');
              }}
              placeholder={t('Input API Key')}
              size="large"
              fullWidth
              sx={{ mb: 2 }}
              value={apiKey}
              error={!!errorMessage}
            />
          </Stack>
          <Stack sx={{ pt: 3, px: 2, width: '100%', gap: 1 }}>
            <TextFieldLabel
              label={t('Input Secret Key')}
              tooltip={t(
                'The secret key can be assigned by the Fireblocks workspace admin',
              )}
            />
            <TextField
              data-testid="input-secret-key"
              type="password"
              onChange={(e) => {
                setSecretKey(e.target.value);
                setErrorMessage('');
              }}
              placeholder={t('Input Secret Key')}
              size="large"
              fullWidth
              sx={{
                mb: 2,
              }}
              value={secretKey}
              error={!!errorMessage}
            />
          </Stack>
          {!!errorMessage && (
            <Stack sx={{ px: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.error.main }}
              >
                {errorMessage}
              </Typography>
            </Stack>
          )}
        </Scrollbars>
      </Stack>
      <Stack
        sx={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          pb: 3,
          pt: 2,
          px: 2,
          gap: 1,
        }}
      >
        <Button
          color="secondary"
          data-testid="bitcoin-wallet-skip-button"
          onClick={onNextStep}
          fullWidth
          size="large"
        >
          {t('Skip')}
        </Button>
        <Button
          data-testid="bitcoin-wallet-next-button"
          onClick={onConnect}
          fullWidth
          size="large"
          disabled={!apiKey || !secretKey}
        >
          {t('Connect')}
        </Button>
      </Stack>
    </Stack>
  );
}
