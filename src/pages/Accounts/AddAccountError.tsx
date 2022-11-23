import { Typography } from '@avalabs/react-components';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

export function AddAccountError() {
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation();

  useLedgerDisconnectedDialog(history.goBack);
  return (
    <Typography color={theme.colors.error} size={12} margin="8px">
      {t('An error occurred, please try again later')}
    </Typography>
  );
}
