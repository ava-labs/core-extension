import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionEVM as TransacionEVMInterface } from '@avalabs/wallet-react-components';
import React from 'react';
import { HistoryItem } from './components/HistoryItem';
import {
  HistorySentIndicator,
  HistoryReceivedIndicator,
} from './components/SentReceivedIndicators';

export function TransactionEVM({ item }: { item: TransacionEVMInterface }) {
  return (
    <HorizontalFlex width={'100%'}>
      {item.isSender ? <HistorySentIndicator /> : <HistoryReceivedIndicator />}

      {item.input ? (
        <HistoryItem label={'Contract Call'} item={item} />
      ) : (
        <HistoryItem label={'Avalanche'} item={item}>
          <VerticalFlex align={'flex-end'} justify="center">
            {/* We dont know the type of token atm */}
            <Typography weight={600} height="24px">
              {item.isSender ? '-' : '+'}
              {item.amountDisplayValue} AVAX
            </Typography>
            {/* putting a placeholder element here for now until we get price */}
            {/* <SubTextTypography>~{currencyFormatter(0.0)}</SubTextTypography> */}
          </VerticalFlex>
        </HistoryItem>
      )}
    </HorizontalFlex>
  );
}
