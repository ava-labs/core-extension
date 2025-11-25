import { ActivityFilter } from '../../../types';
import { TxHistoryItem } from '@core/types';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { FC, Fragment } from 'react';
import { useGroupedHistory } from '../../../hooks';
import { List, ListItem, Typography } from '@avalabs/k2-alpine';
import { EmptyState } from '@/pages/Portfolio/components/PortfolioHome/components/EmptyState';
import * as Styled from './Styled';
import { TransactionItem } from './TransactionItem';

type Props = {
  filter: ActivityFilter;
  transactionHistory: TxHistoryItem<NetworkVMType>[];
};

export const HistoryList: FC<Props> = ({ filter, transactionHistory }) => {
  const groupedTransactionHistory = useGroupedHistory(
    transactionHistory,
    filter,
  );

  if (transactionHistory.length === 0) {
    return <EmptyState />;
  }

  return (
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
  );
};
