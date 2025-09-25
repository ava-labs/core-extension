import { Stack } from '@avalabs/k2-alpine';
import { useNetworkContext } from '@core/ui';
import { NetworkWithCaipId } from '@core/types';
import { defaultEnabledNetworks } from '~/services/network/consts';
import { useHistory } from 'react-router-dom';
import { NetworkToggleListItem } from './NetworkToggleListItem';

type NetworkToggleListProps = {
  networks: NetworkWithCaipId[];
};

export const NetworkToggleList = ({ networks }: NetworkToggleListProps) => {
  const { enabledNetworks, enableNetwork, disableNetwork } =
    useNetworkContext();
  const history = useHistory();

  const enabledNetworksArray =
    enabledNetworks.map((network) => network.chainId) || [];

  return (
    <Stack
      sx={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0,
        maxHeight: '100%',
        width: '100%',
        rowGap: 1,
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {networks.map((network) => (
        <NetworkToggleListItem
          key={network.chainId}
          network={network}
          isEnabled={enabledNetworksArray.includes(network.chainId)}
          isDefault={defaultEnabledNetworks.includes(network.chainId)}
          onToggle={() => {
            if (enabledNetworksArray.includes(network.chainId)) {
              disableNetwork(network.chainId);
            } else {
              enableNetwork(network.chainId);
            }
          }}
          onClick={() => {
            history.push(
              `/settings/network-management/details/${network.chainId}`,
            );
          }}
        />
      ))}
    </Stack>
  );
};
