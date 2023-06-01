import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import { useHistory } from 'react-router-dom';
import { StyledQRCodeIcon } from './NetworkWidget/common/StyledQRCodeIcon';
import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/k2-components';

export function WalletIsEmpty() {
  const history = useHistory();
  const { checkIsFunctionAvailable } = useIsFunctionAvailable();
  const { t } = useTranslation();
  return (
    <Stack
      alignItems="center"
      sx={{
        my: 6,
      }}
    >
      {checkIsFunctionAvailable('ManageTokens') ? (
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
            <StyledQRCodeIcon />
            {t('Receive')}
          </Button>
        </>
      )}
    </Stack>
  );
}
