import { useEffect, useState } from 'react';
import {
  VerticalFlex,
  Typography,
  LoadingIcon,
  PrimaryAddress,
} from '@avalabs/react-components';

import styled from 'styled-components';
import { QRCodeWithLogo } from '@src/components/common/QRCodeWithLogo';
import { PageTitle } from '@src/components/common/PageTitle';
import { AvalancheQRCodeLogo } from '@src/components/icons/AvalancheQRCodeLogo';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  BITCOIN_NETWORK,
  BITCOIN_TEST_NETWORK,
} from '@src/background/services/network/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { BtcQRCodeLogo } from '@src/components/icons/BtcQRCodeLogo';

const StyledPrimaryAddress = styled(PrimaryAddress)`
  width: 100%;
`;

export const Receive = () => {
  const { network } = useNetworkContext();
  const { activeAccount } = useAccountsContext();
  const { capture } = useAnalyticsContext();
  const [address, setAddress] = useState<string>('');
  const [isBitcoinActive, setIsBitcoinActive] = useState<boolean>(false);

  useEffect(() => {
    capture('ReceivePageVisited');
  }, [capture]);

  useEffect(() => {
    setIsBitcoinActive(
      network?.chainId === BITCOIN_NETWORK.chainId ||
        network?.chainId === BITCOIN_TEST_NETWORK.chainId
    );
  }, [network]);

  useEffect(() => {
    const activeAddress = isBitcoinActive
      ? activeAccount?.addressBTC
      : activeAccount?.addressC;
    if (activeAddress) {
      setAddress(activeAddress);
    }
  }, [activeAccount, isBitcoinActive]);

  function getLogo() {
    if (isBitcoinActive) {
      return (
        <BtcQRCodeLogo position={'absolute'} text={'Bitcoin'} size={102} />
      );
    }

    return (
      <AvalancheQRCodeLogo position={'absolute'} text={'C-Chain'} size={102} />
    );
  }

  function getName() {
    return isBitcoinActive ? 'Bitcoin Address' : 'C-Chain Address';
  }

  if (!address || !network) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width="100%" align="center">
      <PageTitle>Receive</PageTitle>
      <VerticalFlex width={'100%'} grow="1" align="center" justify="center">
        <QRCodeWithLogo size={256} value={address}>
          {getLogo()}
        </QRCodeWithLogo>
      </VerticalFlex>
      <VerticalFlex padding="0 16px 24px" width="100%">
        <Typography size={12} height="15px" margin="0 0 4px">
          {getName()}
        </Typography>
        <StyledPrimaryAddress
          truncateLength={24}
          isTruncated={true}
          address={address}
        />
      </VerticalFlex>
    </VerticalFlex>
  );
};
