import { useEffect, useState } from 'react';
import {
  VerticalFlex,
  Typography,
  LoadingIcon,
} from '@avalabs/react-components';

import styled from 'styled-components';
import { QRCodeWithLogo } from '@src/components/common/QRCodeWithLogo';
import { PageTitle } from '@src/components/common/PageTitle';
import { AvalancheQRCodeLogo } from '@src/components/icons/AvalancheQRCodeLogo';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { BtcQRCodeLogo } from '@src/components/icons/BtcQRCodeLogo';
import { NetworkVMType } from '@avalabs/chains-sdk';
import { EthereumQRCodeLogo } from '@src/components/icons/EthereumQRCodeLogo';
import { isEthereumChainId } from '@src/background/services/network/utils/isEthereumNetwork';
import { useTranslation } from 'react-i18next';
import { PrimaryAddressK2 } from '@src/components/common/AddressK2';

const StyledPrimaryAddress = styled(PrimaryAddressK2)`
  width: 100%;
`;

export const Receive = () => {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { capture } = useAnalyticsContext();
  const [address, setAddress] = useState<string>('');
  const [isBitcoinActive, setIsBitcoinActive] = useState<boolean>(false);

  useEffect(() => {
    capture('ReceivePageVisited');
    // the event should be captured exactly once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsBitcoinActive(network?.vmName === NetworkVMType.BITCOIN);
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
    } else if (network?.chainId && isEthereumChainId(network.chainId)) {
      return (
        <EthereumQRCodeLogo
          position={'absolute'}
          text={'Ethereum'}
          size={102}
        />
      );
    } else {
      return (
        <AvalancheQRCodeLogo
          position={'absolute'}
          text={'C-Chain'}
          size={102}
        />
      );
    }
  }

  function getName() {
    if (isBitcoinActive) {
      return t('Bitcoin Address');
    } else if (network?.chainId && isEthereumChainId(network.chainId)) {
      return t('Ethereum Address');
    } else {
      return t('Avalanche (C-Chain) Address');
    }
  }

  if (!address || !network) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width="100%" align="center">
      <PageTitle>{t('Receive')}</PageTitle>
      <VerticalFlex
        data-testid="receive-qr-code"
        width={'100%'}
        grow="1"
        align="center"
        justify="center"
      >
        <QRCodeWithLogo size={256} value={address}>
          {getLogo()}
        </QRCodeWithLogo>
      </VerticalFlex>
      <VerticalFlex
        data-testid="receive-address"
        padding="0 16px 24px"
        width="100%"
      >
        <Typography size={12} height="15px" margin="0 0 4px">
          {getName()}
        </Typography>
        <StyledPrimaryAddress
          truncateLength={20}
          isTruncated={true}
          address={address}
        />
      </VerticalFlex>
    </VerticalFlex>
  );
};
