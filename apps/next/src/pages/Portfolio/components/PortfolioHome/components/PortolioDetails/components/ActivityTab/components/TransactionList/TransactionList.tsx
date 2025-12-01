import { List, ListItem, Typography } from '@avalabs/k2-alpine';
import { NetworkWithCaipId } from '@core/types';
import { FC, Fragment, memo } from 'react';
import { useAccountHistory, useGroupedHistory } from '../../hooks';
import { ActivityFilter } from '../../types';
import { EmptyState } from '../EmptyState';
import * as Styled from './components/Styled';
import { TransactionItem } from './components/TransactionItem';

type Props = {
  filter: ActivityFilter;
  network: NetworkWithCaipId['chainId'];
};

const TransactionList: FC<Props> = ({ filter, network }) => {
  const transactionHistory = useAccountHistory(network);

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

const TransactionListMemo = memo(TransactionList);

export { TransactionListMemo as TransactionList };
