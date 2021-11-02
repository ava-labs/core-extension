import {
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionEVM } from '@avalabs/wallet-react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import React from 'react';
import { HistoryItem } from './components/HistoryItem';
import {
  HistorySentIndicator,
  HistoryReceivedIndicator,
} from './components/SentReceivedIndicators';

function TransactionEVMDetails({ item }: { item: TransactionEVM }) {
  const { currencyFormatter } = useWalletContext();
  return (
    <VerticalFlex align={'flex-end'}>
      {/* We dont know the type of token atm */}
      <Typography margin={'0 0 4px 0'}>
        {item.isSender ? '-' : '+'}
        {parseFloat(item.amountDisplayValue).toFixed(4)}
      </Typography>
      {/* putting in 0.00 till we get placeholder */}
      <SubTextTypography>~{currencyFormatter(0.0)}</SubTextTypography>
    </VerticalFlex>
  );
}

export function TransactionEVM({ item }: { item: TransactionEVM }) {
  return (
    <HorizontalFlex width={'100%'}>
      {item.isSender ? <HistorySentIndicator /> : <HistoryReceivedIndicator />}

      {item.input ? (
        <HistoryItem label={'Contract Call'} item={item}>
          {/* this is a hack to get the popout link to align with the name */}
          <HorizontalFlex width={'10px'} height={'30px'}></HorizontalFlex>
        </HistoryItem>
      ) : (
        <HistoryItem label={'Avalanche'} item={item}>
          <TransactionEVMDetails item={item} />
        </HistoryItem>
      )}
    </HorizontalFlex>
  );
}
