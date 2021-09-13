import React from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import { TransactionSendType } from './models';
import { SendAvaxForm } from '@src/pages/Send/SendAvaxForm';
import { SendAntForm } from '@src/pages/Send/SendAntForm';
import { SendERC20Form } from '@src/pages/Send/SendERC20Form';
import { useLocation } from 'react-router-dom';
import { AssetBalanceX } from '@avalabs/avalanche-wallet-sdk';
import { ERC20 } from '@avalabs/wallet-react-components';

const supportedSendTypes = [
  TransactionSendType.AVAX,
  TransactionSendType.ANT,
  TransactionSendType.ERC20,
];

export interface SendState {
  type: TransactionSendType;
  balanceX?: AssetBalanceX;
  erc20?: ERC20;
}

export function SendFlow() {
  const { state } = useLocation<SendState>();

  return (
    <VerticalFlex>
      {
        {
          [TransactionSendType.AVAX]: <SendAvaxForm />,
          [TransactionSendType.ANT]: (
            <SendAntForm token={state?.balanceX as AssetBalanceX} />
          ),
          [TransactionSendType.ERC20]: (
            <SendERC20Form token={state?.erc20 as ERC20} />
          ),
        }[
          state?.type && supportedSendTypes.includes(state.type)
            ? state.type
            : TransactionSendType.AVAX
        ]
      }
    </VerticalFlex>
  );
}

export default SendFlow;
