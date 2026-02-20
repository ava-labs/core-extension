import { FC } from 'react';
import { ErrorCode } from '@avalabs/unified-asset-transfer';
import { Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/Card';

import { getErrorMessage } from '../utils/getErrorMessage';
import * as Styled from './Styled';

type Props = {
  code: ErrorCode | undefined;
};

export const TransactionFailure: FC<Props> = ({ code }) => {
  const { t } = useTranslation();

  if (!code) {
    return null;
  }

  return (
    <Card noPadding>
      <Styled.Divider />
      <Styled.RowItem>
        <Typography variant="body3" color="text.primary">
          {t('Error')}
        </Typography>
        <Typography variant="body3" color="text.primary">
          {getErrorMessage(t, code)}
        </Typography>
      </Styled.RowItem>
    </Card>
  );
};
