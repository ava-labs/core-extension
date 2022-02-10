import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { Fragment, useMemo } from 'react';

import {
  isTransactionERC20,
  isTransactionNormal,
} from '@avalabs/wallet-react-components';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { NoTransactions } from './components/NoTransactions';
import { isSameDay, endOfYesterday, endOfToday, format } from 'date-fns';
import { TransactionERC20 } from './components/History/TransactionERC20';
import { TransactionNormal } from './components/History/TransactionNormal';

type WalletRecentTxsProps = {
  isEmbedded?: boolean;
  tokenSymbolFilter?: string;
};

export function WalletRecentTxs({
  isEmbedded = false,
  tokenSymbolFilter,
}: WalletRecentTxsProps) {
  const { recentTxHistory } = useWalletContext();

  const yesterday = endOfYesterday();
  const today = endOfToday();

  const getDayString = (date: Date) => {
    const isToday = isSameDay(today, date);
    const isYesterday = isSameDay(yesterday, date);
    return isToday
      ? 'Today'
      : isYesterday
      ? 'Yesterday'
      : format(date, 'MMMM do');
  };

  const filteredTxHistory = useMemo(
    () =>
      recentTxHistory.filter((tx: any) =>
        tokenSymbolFilter
          ? tokenSymbolFilter === (tx?.tokenSymbol || 'AVAX')
          : true
      ),
    [recentTxHistory, tokenSymbolFilter]
  );
  console.log(filteredTxHistory);
  if (filteredTxHistory.length === 0) {
    return <NoTransactions />;
  }

  return (
    <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
      <VerticalFlex padding={isEmbedded ? '0' : '4px 16px 68px'}>
        {filteredTxHistory.map((tx, index) => {
          const isNewDay =
            index === 0 ||
            !isSameDay(tx.timestamp, recentTxHistory[index - 1].timestamp);
          return (
            <Fragment key={index}>
              {isNewDay && (
                <Typography
                  size={14}
                  height="15px"
                  weight={500}
                  margin={index === 0 ? '8px 0 13px' : '8px 0'}
                >
                  {getDayString(tx.timestamp)}
                </Typography>
              )}
              <Card
                key={tx.hash}
                padding={'8px 12px 8px 16px'}
                margin={'0 0 8px 0'}
              >
                {isTransactionERC20(tx) && <TransactionERC20 item={tx} />}
                {isTransactionNormal(tx) && <TransactionNormal item={tx} />}
              </Card>
            </Fragment>
          );
        })}
      </VerticalFlex>
    </Scrollbars>
  );
}
