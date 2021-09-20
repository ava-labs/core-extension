import React from 'react';
import {
  UniversalTx,
  UniversalTxActionType,
} from '@avalabs/avalanche-wallet-sdk/dist/helpers/universal_tx_helper';
import { Utils } from '@avalabs/avalanche-wallet-sdk';
import styled from 'styled-components';
import { Typography } from '@avalabs/react-components';

export interface TransactionsListProps {
  txs: UniversalTx[];
}

const TransactionRow = styled.div`
  background-color: #222;
  padding: 8px;
  margin: 4px 0;
`;

function getReadableActionType(action: UniversalTxActionType) {
  switch (action) {
    case 'export_c_x':
      return 'Export from C Chain to X Chain';
    case 'export_p_x':
      return 'Export from P Chain to X Chain';
    case 'export_x_c':
      return 'Export from X Chain to C Chain';
    case 'export_x_p':
      return 'Export from X Chain to P Chain';
    default:
      return '';
  }
}

export function SendTransactionsList({ txs }: TransactionsListProps) {
  const rows = txs.map((tx, index) => {
    return (
      <TransactionRow key={index}>
        <p>
          <Typography>
            <b>{getReadableActionType(tx.action)}</b>
          </Typography>
        </p>
        <p>
          <Typography>
            {tx.amount && Utils.bnToAvaxX(tx.amount)} AVAX
          </Typography>
        </p>
        <p>
          <Typography>Fee 0.002 AVAX</Typography>
        </p>
      </TransactionRow>
    );
  });

  return <>{rows}</>;
}
