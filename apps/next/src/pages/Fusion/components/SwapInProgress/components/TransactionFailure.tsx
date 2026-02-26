import { FC } from 'react';
import { ErrorCode } from '@avalabs/unified-asset-transfer';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { getErrorMessage } from '../utils/getErrorMessage';

type Props = {
  code: ErrorCode | undefined;
};

export const TransactionFailure: FC<Props> = ({ code }) => {
  const { t } = useTranslation();

  if (!code) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography variant="body3" color="error.main">
        {getErrorMessage(t, code)}
      </Typography>
    </Stack>
  );
};
