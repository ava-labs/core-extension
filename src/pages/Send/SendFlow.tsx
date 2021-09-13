import React from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import { TransactionSendType } from './models';
import { SendAvaxForm } from '@src/pages/Send/SendAvaxForm';
import { SendAntForm } from '@src/pages/Send/SendAntForm';
import { SendERC20Form } from '@src/pages/Send/SendERC20Form';
import { AssetBalanceX } from '@avalabs/avalanche-wallet-sdk';
import { ERC20 } from '@avalabs/wallet-react-components';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useGetSendTypeFromParams } from '@src/hooks/useGetSendTypeFromParams';

export interface SendState {
  type: TransactionSendType;
  balanceX?: AssetBalanceX;
  erc20?: ERC20;
}

export function SendFlow() {
  const sendType = useGetSendTypeFromParams();
  const tokensWBalances = useTokensWithBalances();
  const selectedToken = useTokenFromParams(tokensWBalances);

  return (
    <VerticalFlex>
      {
        {
          [TransactionSendType.AVAX]: <SendAvaxForm />,
          [TransactionSendType.ANT]: (
            <SendAntForm token={selectedToken as unknown as AssetBalanceX} />
          ),
          [TransactionSendType.ERC20]: (
            <SendERC20Form token={selectedToken as ERC20} />
          ),
        }[sendType ?? TransactionSendType.AVAX]
      }
    </VerticalFlex>
  );
}

export default SendFlow;
