import { Typography } from '@avalabs/react-components';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';

export function AddAccountError() {
  const history = useHistory();
  const theme = useTheme();
  useLedgerDisconnectedDialog(history.goBack);
  return (
    <Typography color={theme.colors.error} size={12} margin="8px">
      An error occurred, please try again later
    </Typography>
  );
}
