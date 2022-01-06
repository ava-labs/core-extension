import {
  SecondaryCard,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import React, { Fragment, useMemo } from 'react';

import { isTransactionEVM } from '@avalabs/wallet-react-components';
import Scrollbars from 'react-custom-scrollbars';
import { NoTransactions } from './components/NoTransactions';
import { isSameDay, endOfYesterday, endOfToday, format } from 'date-fns';
import { TransactionEVM } from './components/History/TransactionEVM';

export function WalletRecentTxs() {
  const { recentTxHistory } = useWalletContext();

  const transactions = useMemo(() => {
    return recentTxHistory.filter((item) => isTransactionEVM(item));
  }, [recentTxHistory]);

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

  if (transactions.length === 0) {
    return <NoTransactions />;
  }

  return (
    <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
      <VerticalFlex padding="0 16px">
        {transactions.map((tx, index) => {
          const isNewDay =
            index === 0 ||
            !isSameDay(tx.timestamp, transactions[index - 1].timestamp);
          return (
            <Fragment key={index}>
              {isNewDay && (
                <Typography
                  size={14}
                  height="17px"
                  weight={600}
                  margin="8px 0 16px"
                >
                  {getDayString(tx.timestamp)}
                </Typography>
              )}
              <SecondaryCard
                key={tx.id}
                padding={'16px 8px'}
                margin={'0 0 8px 0'}
              >
                {isTransactionEVM(tx) && <TransactionEVM item={tx} />}
              </SecondaryCard>
            </Fragment>
          );
        })}
      </VerticalFlex>
    </Scrollbars>
  );
}
