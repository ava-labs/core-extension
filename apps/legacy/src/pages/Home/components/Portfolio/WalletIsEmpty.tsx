import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  QRCodeIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

export function WalletIsEmpty() {
  const history = useHistory();
  const { isFunctionSupported: isManageTokenSupported } =
    useIsFunctionAvailable({ functionName: FunctionNames.MANAGE_TOKEN });
  const { t } = useTranslation();
  return (
    <Stack
      alignItems="center"
      sx={{
        my: 6,
      }}
    >
      {isManageTokenSupported ? (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('No assets')}
          </Typography>
          <Typography sx={{ mb: 3 }}>
            {t('Add assets by clicking the button below')}
          </Typography>
          <Button
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              history.push('/manage-tokens');
            }}
            sx={{ width: '343px' }}
          >
            {t('Add assets')}
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('No assets')}
          </Typography>
          <Typography sx={{ mb: 3 }}>
            {t('Receive assets by clicking the button below')}
          </Typography>
          <Button
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              history.push('/receive');
            }}
            sx={{ width: '343px' }}
          >
            <QRCodeIcon size={16} sx={{ mr: 1 }} />
            {t('Receive')}
          </Button>
        </>
      )}
    </Stack>
  );
}
