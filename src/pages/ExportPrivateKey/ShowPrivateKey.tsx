import {
  Alert,
  AlertTitle,
  AlertContent,
  Button,
  KeyIcon,
  Stack,
  useTheme,
  Typography,
  CopyIcon,
  toast,
} from '@avalabs/k2-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { IconWrapper } from './EnterPassword';
import { useCallback } from 'react';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

interface ShowPrivateKeyProps {
  privateKey: string;
}

export function ShowPrivateKey({ privateKey }: ShowPrivateKeyProps) {
  const history = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(privateKey || '');
    capture('ExportPrivateKeyCopied');
    toast.success(t('Copied!'), { duration: 2000 });
  }, [capture, privateKey, t]);

  return (
    <>
      <Stack>
        <PageTitle
          margin={'22px 0 4px 0'}
          onBackClick={() => history.replace('/accounts')}
        >
          {t('Your Private Key')}
        </PageTitle>
        <Stack sx={{ px: 2, rowGap: 3 }}>
          <Stack sx={{ alignItems: 'center' }}>
            <IconWrapper>
              <KeyIcon size={32} />
            </IconWrapper>
          </Stack>
          <Alert severity="warning">
            <AlertTitle>{t('Protect your Private Key')}</AlertTitle>
            <AlertContent>
              {t(
                'Do not share your Private Key with anyone including Core Support'
              )}
            </AlertContent>
          </Alert>
          <Stack
            onClick={onCopy}
            sx={{
              backgroundColor: theme.palette.grey[850],
              flexDirection: 'row',
              columnGap: 2,
              p: 2,
              width: '100%',
              cursor: 'pointer',
              borderRadius: 1,
              alignItems: 'center',
            }}
          >
            <Stack sx={{ wordBreak: 'break-all' }}>
              <Typography variant="body1">{privateKey}</Typography>
            </Stack>
            <Stack sx={{ rowGap: 1 }}>
              <CopyIcon size={24} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Stack
          sx={{
            width: '100%',
            flexDirection: 'row',
            flexGrow: 1,
            gap: 1,
          }}
        >
          <Button
            size="large"
            onClick={() => history.replace('/accounts')}
            data-testid="export-private-key-cancel"
            fullWidth
            variant="contained"
            color="secondary"
          >
            {t('Cancel')}
          </Button>
          <Button
            color="primary"
            size="large"
            data-testid="export-private-key-done"
            type="primary"
            fullWidth
            variant="contained"
            onClick={() => history.replace('/accounts')}
          >
            {t('Done')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
