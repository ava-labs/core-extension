import {
  Card,
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionDisplayValues } from '@src/background/services/transactions/models';
import { AddressPaths } from './components/AddressPaths';
import { TransactionHeader } from './components/TransactionHeader';
import { useTranslation } from 'react-i18next';

export function UnknownTx({
  fromAddress,
  toAddress,
  displayValue,
  name,
}: TransactionDisplayValues) {
  const { t } = useTranslation();
  return (
    <VerticalFlex width="100%">
      <TransactionHeader
        title={toAddress ? t('Transaction Summary') : t('Contract Deployment')}
      />

      <VerticalFlex>
        {displayValue ? (
          <Typography margin={'8px 0 16px 0'}>{displayValue}</Typography>
        ) : (
          ''
        )}

        <AddressPaths
          fromAddress={fromAddress || ''}
          toAddress={toAddress || ''}
        />

        <Card margin="16px 0 0" padding="16px 0 16px" direction="column">
          <HorizontalFlex justify="space-between" padding="0 16px">
            <Typography size={12} height="15px">
              {toAddress ? t('Transaction') : t('Contract Deployment')}
            </Typography>
            <Typography size={12} height="15px">
              {name}
            </Typography>
          </HorizontalFlex>
        </Card>
      </VerticalFlex>
    </VerticalFlex>
  );
}
