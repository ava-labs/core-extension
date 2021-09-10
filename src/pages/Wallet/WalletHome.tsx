import React from 'react';
import { Link } from 'react-router-dom';
import {
  VerticalFlex,
  LoadingIcon,
  HorizontalFlex,
  Typography,
  PrimaryButton,
  TextButton,
  Card,
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
    <VerticalFlex width={'100%'}>
      <HorizontalFlex width={'100%'}>
        <TextButton margin={'0 20px 0 0'}>
          <Typography>Portfolio</Typography>
        </TextButton>
        <TextButton margin={'0 20px 0 0'}>
          <Typography>Buy</Typography>
        </TextButton>
        <TextButton margin={'0 20px 0 0'}>
          <Typography>Earn</Typography>
        </TextButton>
        <TextButton>
          <Typography>Studio</Typography>
        </TextButton>
      </HorizontalFlex>
      <br />
      <HorizontalFlex>
        <VerticalFlex flex={3} margin={'0 10px 0 0'}>
          <Card>
            <HorizontalFlex
              justify={'space-between'}
              align={'center'}
              width={'100%'}
            >
              <Typography size={36} style={{ flex: 2 }}>
                $
                {parseFloat(
                  getAvaxBalanceUSD(balances.balanceAvaxTotal, avaxPrice)
                ).toFixed(3)}{' '}
                USD
              </Typography>

              <VerticalFlex flex={1}>
                <Typography size={14} margin={'0 0 10px 0'}>
                  Asset Allocation
                </Typography>
                <Typography size={14}>
                  {getAvaxBalanceTotal(balances.balanceAvaxTotal)} AVAX
                </Typography>
              </VerticalFlex>
            </HorizontalFlex>
          </Card>
          <br />
          <Card>
            <VerticalFlex width={'100%'}>
              <HorizontalFlex>
                <Typography size={18}>Assets</Typography>
              </HorizontalFlex>
              <br />
              <HorizontalFlex width={'100%'}>
                <Typography size={14} margin={'0 10px 0 0'}>
                  Tokens
                </Typography>
                <Typography size={14}>Collectibles</Typography>
              </HorizontalFlex>
              <Erc20TokenList />
            </VerticalFlex>
          </Card>
        </VerticalFlex>
        <VerticalFlex flex={1}>
          <Card>
            <Typography>Send</Typography>
          </Card>
          <br />
          <Card>
            <Typography>Recent Transactions</Typography>
          </Card>
        </VerticalFlex>
      </HorizontalFlex>
      {/* <br />
      <VerticalFlex>
        <Typography>
          
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
      <Erc20TokenList /> */}
    </VerticalFlex>
  );
}
