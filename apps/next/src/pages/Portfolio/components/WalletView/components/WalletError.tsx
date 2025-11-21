import { Button, Typography } from '@avalabs/k2-alpine';

import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const WalletError = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Stack
      direction="column"
      gap={1.25}
      height={1}
      alignItems="center"
      justifyContent="center"
    >
      <Typography fontSize="32px">😩</Typography>
      <Typography variant="body3" fontWeight="bold">
        {t('Oops! \n Something went wrong')}
      </Typography>
      <Typography
        variant="subtitle4"
        textAlign="center"
        color="text.secondary"
        paddingX={3}
        marginBottom={3}
      >
        {t(
          'Could not find the wallet you are looking for. \n Please select different wallet.',
        )}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => history.push('/account-management')}
      >
        {t('Select different wallet')}
      </Button>
    </Stack>
  );
};
