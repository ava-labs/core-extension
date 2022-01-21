import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionNormal as TransactionNormalInterface } from '@avalabs/wallet-react-components';
import { HistoryItem } from './components/HistoryItem';
import {
  HistoryReceivedIndicator,
  HistorySentIndicator,
} from './components/SentReceivedIndicators';

export function TransactionNormal({
  item,
}: {
  item: TransactionNormalInterface;
}) {
  return (
    <HorizontalFlex width={'100%'} justify={'space-between'}>
      {item.isSender ? <HistorySentIndicator /> : <HistoryReceivedIndicator />}
      {item.input !== '0x' ? (
        <HistoryItem label={'Contract Call'} item={item} />
      ) : (
        <HistoryItem label={'Avalanche'} item={item}>
          <VerticalFlex>
            <Typography>
              {item.isSender ? '-' : '+'}
              {item.amountDisplayValue} AVAX
            </Typography>
          </VerticalFlex>
        </HistoryItem>
      )}
    </HorizontalFlex>
  );
}
