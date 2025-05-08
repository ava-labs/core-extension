import {
  AlertCircleIcon,
  Button,
  SearchOffIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { useGoBack } from '@core/ui';

export enum Origin {
  Search,
  Url,
}

type NoAccountsFoundProps = {
  origin: Origin;
};

export const NoAccountsFound = ({ origin }: NoAccountsFoundProps) => {
  const { t } = useTranslation();

  const close = useGoBack('/accounts');

  return (
    <Stack
      sx={{
        px: 4,
        width: 1,
        height: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
        backgroundColor: 'grey.900',
      }}
    >
      {origin === Origin.Search && (
        <>
          <SearchOffIcon size={72} />
          <Typography variant="h5">{t('No search results found')}</Typography>
          <Typography variant="body2">
            {t(
              'Try typing the information again or go back to the account manager.',
            )}
          </Typography>
        </>
      )}
      {origin === Origin.Url && (
        <>
          <AlertCircleIcon size={72} />
          <Typography variant="h5">{t('Account not found')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t(`Looks like you got here by accident.`)}
          </Typography>
        </>
      )}
      <Button size="large" onClick={close} fullWidth sx={{ mt: 2 }}>
        {t('Close')}
      </Button>
    </Stack>
  );
};
