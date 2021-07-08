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
// import { TokenRow } from '@src/components/TokenRow';

export const WalletHome = observer(() => {
  const [loading, setIsLoading] = useState(true);
  const { walletStore } = useStore();

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

  console.log('walletStore.balanceERC20: ', walletStore.balanceERC20);

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <br />
      <HorizontalFlex>
        <Typography>{walletStore.getCleanTotalBalance(4)} AVAX</Typography>
      </HorizontalFlex>
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
      {/* <TokenRow tokens={walletStore.balanceERC20} />
      <Link to="/token/add">
        <SecondaryButton>Add Token</SecondaryButton>
      </Link> */}
    </VerticalFlex>
  );
});
