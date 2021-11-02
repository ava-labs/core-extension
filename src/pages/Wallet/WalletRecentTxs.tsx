import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import React, { Fragment } from 'react';
import { TransactionEVM } from '@src/pages/Wallet/components/History/TransactionEVM';

import {
  isTransactionBase,
  isTransactionEVM,
  isTransactionImportExport,
  isTransactionStaking,
} from '@avalabs/wallet-react-components';

/**
 * Since we dont have designs some of the renderers have been commented out
 */
export function WalletRecentTxs() {
  const { chunkedHistoryByDate } = useWalletContext();

  return (
    <VerticalFlex width={'100%'} overflow={'auto'} maxHeight={'400px'}>
      {Object.keys(chunkedHistoryByDate).map((key) => {
        const recentTxHistory = chunkedHistoryByDate[key];
        return (
          <Fragment key={key}>
            <Typography>{key}</Typography>;
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
                  <Card key={item.id} padding={'16px 8px'} margin={'0 0 8px 0'}>
                    <TransactionEVM item={item}></TransactionEVM>
                  </Card>
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
            ;
          </Fragment>
        );
      })}
    </VerticalFlex>
  );
}
