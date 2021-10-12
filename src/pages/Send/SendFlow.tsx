import React from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import { TransactionSendType } from './models';
import { SendAvaxForm } from '@src/pages/Send/SendAvaxForm';
import { SendAntForm } from '@src/pages/Send/SendAntForm';
import { SendERC20Form } from '@src/pages/Send/SendERC20Form';
import { AssetBalanceX } from '@avalabs/avalanche-wallet-sdk';
import { ERC20 } from '@avalabs/wallet-react-components';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import {
  AntWithBalance,
  ERC20WithBalance,
} from '@avalabs/wallet-react-components';
import { useGetSendTypeFromParams } from '@src/hooks/useGetSendTypeFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

export function SendFlow() {
  const sendType = useGetSendTypeFromParams();
  const tokensWBalances = useTokensWithBalances();
  const selectedToken = useTokenFromParams(tokensWBalances);

  return <SendAvaxForm />;
}

export default SendFlow;
