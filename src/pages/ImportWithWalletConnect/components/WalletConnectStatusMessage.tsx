import {
  AlertCircleIcon,
  Box,
  CheckCircleIcon,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

import {
  AccountImportState,
  AccountImportStatus,
} from '@src/contexts/WalletConnectContextProvider/models';

import { getColorForStatus } from './utils/getColorForStatus';

type Props = {
  importState: AccountImportState;
};

export const WalletConnectStatusMessage = ({ importState }: Props) => {
  const { t } = useTranslation();

  const hasConnectionFailed = importState.status === AccountImportStatus.Failed;
  const hasConnectionSucceeded =
    importState.status === AccountImportStatus.Successful;

  if (!hasConnectionFailed && !hasConnectionSucceeded) {
    return null;
  }

  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
        color: getColorForStatus(importState.status),
        textAlign: 'start',
        alignItems: 'start',
      }}
    >
      <Box sx={{ display: 'flex', marginTop: '-1px' }}>
        {hasConnectionFailed ? (
          <AlertCircleIcon size={16} />
        ) : (
          <CheckCircleIcon size={16} />
        )}
      </Box>
      <Typography variant="caption">
        {hasConnectionFailed
          ? importState.error
          : t('Scan successful. Importing accounts...')}
      </Typography>
    </Stack>
  );
};
