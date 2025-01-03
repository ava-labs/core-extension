import { useEffect, useMemo } from 'react';

import { QRCodeWithLogo } from '@src/components/common/QRCodeWithLogo';
import { PageTitle } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import {
  BtcQRCodeLogo,
  EthereumQRCodeLogo,
  AvalancheQRCodeLogo,
} from '@src/components/icons/QRCodeLogos';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { isEthereumChainId } from '@src/background/services/network/utils/isEthereumNetwork';
import { useTranslation } from 'react-i18next';
import { PrimaryAddressK2 } from '@src/components/common/AddressK2';
import {
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { isPchainNetwork } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { FunctionIsUnavailable } from '@src/components/common/FunctionIsUnavailable';
import { getAddressForChain } from '@src/utils/getAddressForChain';
import { isXchainNetwork } from '@src/background/services/network/utils/isAvalancheXchainNetwork';

export const Receive = () => {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { capture } = useAnalyticsContext();
  const isBitcoinActive = network?.vmName === NetworkVMType.BITCOIN;
  const isPchainActive = useMemo(() => isPchainNetwork(network), [network]);
  const isXchainActive = useMemo(() => isXchainNetwork(network), [network]);
  const { checkIsFunctionSupported } = useIsFunctionAvailable();

  const address = useMemo(
    () =>
      network && activeAccount
        ? (getAddressForChain(network?.chainId, activeAccount) ?? '')
        : '',
    [activeAccount, network],
  );

  useEffect(() => {
    capture('ReceivePageVisited');
    // the event should be captured exactly once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getLogo() {
    if (isBitcoinActive) {
      return <BtcQRCodeLogo />;
    } else if (network?.chainId && isEthereumChainId(network.chainId)) {
      return <EthereumQRCodeLogo />;
    } else {
      return <AvalancheQRCodeLogo />;
    }
  }

  function getName() {
    if (isBitcoinActive) {
      return t('Bitcoin Address');
    } else if (network?.chainId && isEthereumChainId(network.chainId)) {
      return t('Ethereum Address');
    } else if (isPchainActive) {
      return t('Avalanche (P-Chain) Address');
    } else if (isXchainActive) {
      return t('Avalanche (X-Chain) Address');
    } else {
      return t('Avalanche (C-Chain) Address');
    }
  }

  if (network && !checkIsFunctionSupported(FunctionNames.RECEIVE)) {
    return (
      <FunctionIsUnavailable
        functionName={FunctionNames.RECEIVE}
        network={network?.chainName}
      />
    );
  }

  if (!address || !network) {
    return (
      <Stack sx={{ justifyContent: 'center' }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <PageTitle margin="0">{t('Receive')}</PageTitle>
      <Stack
        data-testid="receive-qr-code"
        sx={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <QRCodeWithLogo size={256} value={address}>
          {getLogo()}
        </QRCodeWithLogo>
      </Stack>
      <Stack
        data-testid="receive-address"
        sx={{
          px: 2,
          pr: 3,
          width: '100%',
          gap: 1.5,
        }}
      >
        {/* TODO: remove sx override as `button` variant should be 14px by default, but currently isn't in k2 */}
        <Typography variant="button" sx={{ fontSize: 14 }}>
          {getName()}
        </Typography>
        <PrimaryAddressK2 address={address} isTruncated={false} />
      </Stack>
    </Stack>
  );
};
