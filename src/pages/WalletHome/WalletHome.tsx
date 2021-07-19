import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@src/store/store';
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
  const [loading, setIsLoading] = useState(true);
  const { balances, prices } = useWalletContext();
  const { walletStore } = useStore();

  useEffect(() => {
    (async () => {
      if (walletStore.wallet) {
        walletStore.updateWallet();
        await walletStore.updateBalance();
        setIsLoading(false);
      }
    })();
  }, [walletStore.wallet]);

  if (loading || balances.isLoading) {
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
      {/* <div className="fiat">$12.34</div> */}
      {/* <div className="change">+5.24%</div> */}
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
      {/**
       * This erc20 stuff isnt fully fleshed out so leaving this for later
       * @link https://ava-labs.atlassian.net/browse/PM-197
       */}
      <Erc20TokenList />
    </VerticalFlex>
  );
});
