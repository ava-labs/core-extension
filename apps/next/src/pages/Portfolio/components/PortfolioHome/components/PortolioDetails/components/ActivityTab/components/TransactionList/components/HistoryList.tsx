import { ActivityFilter } from '../../../types';
import { TxHistoryItem } from '@core/types';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { FC, Fragment, useMemo } from 'react';
import { useGroupedHistory } from '../../../hooks';
import { List, ListItem, Typography } from '@avalabs/k2-alpine';
import { EmptyState } from '../../EmptyState';
import * as Styled from './Styled';
import {
  ActivityListNativeSymbolsProvider,
  activityListChainKey,
} from './ActivityListNativeSymbols';
import { TransactionItem } from './TransactionItem';
import { PortfolioTabLoadingSpinner } from '../../../../PortfolioTabLoadingSpinner';

type Props = {
  filter: ActivityFilter;
  transactionHistory: TxHistoryItem<NetworkVMType>[] | null;
};

export const HistoryList: FC<Props> = ({ filter, transactionHistory }) => {
  const groupedTransactionHistory = useGroupedHistory(
    transactionHistory ?? [],
    filter,
  );

  const nativeSymbolChainIds = useMemo(() => {
    if (!transactionHistory) {
      return [];
    }
    const unique = new Set<string>();
    for (const transaction of transactionHistory) {
      const key = activityListChainKey(transaction.chainId);
      if (key !== '') {
        unique.add(key);
      }
    }
    return [...unique];
  }, [transactionHistory]);

  if (transactionHistory === null) {
    return <PortfolioTabLoadingSpinner />;
  }

  if (transactionHistory.length === 0) {
    return <EmptyState />;
  }

  return (
    <ActivityListNativeSymbolsProvider chainIds={nativeSymbolChainIds}>
      <List disablePadding>
        {Object.entries(groupedTransactionHistory).map(
          ([groupName, transactions]) => (
            <ListItem key={groupName} disableGutters disablePadding>
              <Styled.List
                disablePadding
                subheader={
                  <Styled.ListSubheader disableGutters>
                    <Typography variant="h6" color="text.primary">
                      {groupName}
                    </Typography>
                  </Styled.ListSubheader>
                }
              >
                {transactions.map((tx, index, self) => (
                  <Fragment key={tx.hash}>
                    <TransactionItem transaction={tx} />
                    {index < self.length - 1 && (
                      <Styled.Divider variant="inset" />
                    )}
                  </Fragment>
                ))}
              </Styled.List>
            </ListItem>
          ),
        )}
      </List>
    </ActivityListNativeSymbolsProvider>
  );
};
