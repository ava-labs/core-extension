import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionERC20 as TransactionERC20Interface } from '@avalabs/wallet-react-components';
import { HistoryItem } from './components/HistoryItem';
import {
  HistorySentIndicator,
  HistoryReceivedIndicator,
} from './components/SentReceivedIndicators';

export function TransactionERC20({
  item,
}: {
  item: TransactionERC20Interface;
}) {
  return (
    <HorizontalFlex width={'100%'} align="center">
      {item.isSender ? <HistorySentIndicator /> : <HistoryReceivedIndicator />}
      <HistoryItem label={item.tokenName} item={item}>
        <VerticalFlex align={'flex-end'} justify="center">
          {/* We dont know the type of token atm */}
          <Typography size={14} height="24px">
            {item.isSender ? '-' : '+'}
            {item.amountDisplayValue} {item.tokenSymbol}
          </Typography>
          {/* putting a placeholder element here for now until we get price */}
          {/* <SubTextTypography>~{currencyFormatter(0.0)}</SubTextTypography> */}
        </VerticalFlex>
      </HistoryItem>
    </HorizontalFlex>
  );
}
