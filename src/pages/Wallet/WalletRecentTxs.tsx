import {
  SecondaryCard,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import React, { Fragment } from 'react';
import { TransactionEVM } from '@src/pages/Wallet/components/History/TransactionEVM';

import {
  isTransactionBase,
  isTransactionEVM,
  isTransactionImportExport,
  isTransactionStaking,
} from '@avalabs/wallet-react-components';
import Scrollbars from 'react-custom-scrollbars';
import { NoTransactions } from './components/NoTransactions';

/**
 * Since we dont have designs some of the renderers have been commented out
 */
export function WalletRecentTxs() {
  const { chunkedHistoryByDate } = useWalletContext();

  const days = Object.keys(chunkedHistoryByDate).filter((key) =>
    chunkedHistoryByDate[key]?.some((item) => isTransactionEVM(item))
  );

  if (days.length === 0) {
    return <NoTransactions />;
  }

  return (
    <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
      <VerticalFlex padding="0 16px">
        {days.map((key) => {
          const recentTxHistory = chunkedHistoryByDate[key];
          return (
            <Fragment key={key}>
              <Typography
                size={14}
                height="17px"
                weight={600}
                margin="8px 0 16px"
              >
                {key}
              </Typography>
              {recentTxHistory?.map((item) => {
                if (isTransactionBase(item)) {
                  return <></>;
                  // return (
                  //   <Card key={item.id} padding={'16px 8px'} margin={'0 0 8px 0'}>
                  //     <TransactionBase item={item}></TransactionBase>
                  //   </Card>
                  // );
                } else if (isTransactionEVM(item)) {
                  return (
                    <SecondaryCard
                      key={item.id}
                      padding={'16px 8px'}
                      margin={'0 0 8px 0'}
                    >
                      <TransactionEVM item={item} />
                    </SecondaryCard>
                  );
                } else if (isTransactionStaking(item)) {
                  return <></>;
                  // return (
                  //   <Card key={item.id} padding={'16px 8px'} margin={'0 0 8px 0'}>
                  //     <TransactionStaking item={item}></TransactionStaking>
                  //   </Card>
                  // );
                } else if (isTransactionImportExport(item)) {
                  return <></>;
                  // return (
                  //   <Card key={item.id} padding={'16px 8px'} margin={'0 0 8px 0'}>
                  //     <TransactionImportExport
                  //       item={item}
                  //     ></TransactionImportExport>
                  //   </Card>
                  // );
                } else {
                  return <></>;
                  // return (
                  //   <Card key={item.id} padding={'16px 8px'} margin={'0 0 8px 0'}>
                  //     <Typography>Unsupported Transaction Type</Typography>
                  //   </Card>
                  // );
                }
              })}
            </Fragment>
          );
        })}
      </VerticalFlex>
    </Scrollbars>
  );
}
