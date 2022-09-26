import { Blockchain, useBridgeSDK } from '@avalabs/bridge-sdk';
import {
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useAvailableBlockchains } from '../hooks/useAvailableBlockchains';
import { blockchainToNetwork } from '../utils/blockchainConversion';

export const BridgeUnknownNetwork = ({ onSelect }) => {
  const availableBlockchains = useAvailableBlockchains();
  const blockchain = availableBlockchains.includes(Blockchain.ETHEREUM)
    ? Blockchain.ETHEREUM
    : Blockchain.AVALANCHE;
  const { networks } = useNetworkContext();
  const { bridgeConfig } = useBridgeSDK();
  const network = blockchainToNetwork(blockchain, networks, bridgeConfig);

  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitle variant={PageTitleVariant.PRIMARY}>Back</PageTitle>
      <VerticalFlex align="center" justify="center" grow="1" margin="0 16px">
        <Typography size={18} align="center" height="24px" weight={600}>
          Network not supported.
        </Typography>
        <Typography
          size={16}
          align="center"
          height="24px"
          margin="8px 0 24px 0"
        >
          Network is not supported. Change network to supported network to
          continue.
        </Typography>
        <PrimaryButton width="100%" onClick={() => onSelect(blockchain)}>
          Switch to {network?.chainName}
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
};
