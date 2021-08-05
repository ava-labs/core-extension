import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  VerticalFlex,
  LoadingIcon,
  HorizontalFlex,
  Typography,
  PrimaryButton,
} from '@avalabs/react-components';
import { Erc20TokenList } from '@src/components/Erc20Tokens/Erc20TokenList';
import { TransactionSendType } from '@src/store/wallet/types';
import { useWalletContext } from '@src/contexts/WalletProvider';

export const WalletHome = observer(() => {
  const { balances, prices } = useWalletContext();

  if (balances.isLoading) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <br />
      <VerticalFlex>
        <Typography>{balances.getAvaxBalanceTotal()} AVAX</Typography>
        <Typography>
          ${balances.getAvaxBalanceUSD(prices.avaxUSD)} AVAX
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
});
