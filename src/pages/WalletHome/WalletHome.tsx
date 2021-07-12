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
import { createAvaxERC20 } from '@src/store/wallet/walletStore';
import { useBalance } from '@src/hooks/useBalance';
import { usePrices } from '@src/hooks/usePrices';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { Erc20TokenList } from '@src/components/Erc20Tokens/Erc20TokenList';

export const WalletHome = observer(() => {
  const [loading, setIsLoading] = useState(true);
  const { walletStore, networkStore } = useStore();
  const { balanceAvaxTotal } = useBalance(
    walletStore.wallet,
    networkStore.network
  );
  const { avaxUSD } = usePrices();
  // wait for refreshHD
  // show load screen

  useEffect(() => {
    (async () => {
      if (walletStore.wallet) {
        walletStore.updateWallet();
        await walletStore.updateBalance();
        setIsLoading(false);
      }
    })();
  }, [walletStore.wallet]);

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <br />
      <VerticalFlex>
        <Typography>{balanceAvaxTotal.toLocaleString()} AVAX</Typography>
        <Typography>
          ${balanceAvaxTotal.mul(Big(avaxUSD)).toLocaleString(2)} AVAX
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
            state: createAvaxERC20('0.00'),
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
