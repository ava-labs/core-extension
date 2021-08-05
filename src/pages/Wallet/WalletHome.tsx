import React from 'react';
import { Link } from 'react-router-dom';
import {
  VerticalFlex,
  LoadingIcon,
  HorizontalFlex,
  Typography,
  PrimaryButton,
} from '@avalabs/react-components';
import { Erc20TokenList } from '@src/pages/Wallet/Erc20TokenList';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { TransactionSendType } from '../Send/models';
import { getAvaxBalanceTotal, getAvaxBalanceUSD } from './utils/balanceHelpers';

export function WalletHome() {
  const { balances, avaxPrice } = useWalletContext();

  if (!balances || !avaxPrice) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <br />
      <VerticalFlex>
        <Typography>
          {getAvaxBalanceTotal(balances.balanceAvaxTotal)} AVAX
        </Typography>
        <Typography>
          ${getAvaxBalanceUSD(balances.balanceAvaxTotal, avaxPrice)} AVAX
        </Typography>
      </VerticalFlex>
      <br />
      <br />
      <HorizontalFlex>
        <Link to="/wallet/overview">
          <PrimaryButton>Overview</PrimaryButton>
        </Link>
        <Link to="/deposit">
          <PrimaryButton>Deposit</PrimaryButton>
        </Link>
        <Link
          to={{
            pathname: '/send',
            state: { type: TransactionSendType.AVAX },
          }}
        >
          <PrimaryButton>Send</PrimaryButton>
        </Link>
      </HorizontalFlex>
      <Erc20TokenList />
    </VerticalFlex>
  );
}
