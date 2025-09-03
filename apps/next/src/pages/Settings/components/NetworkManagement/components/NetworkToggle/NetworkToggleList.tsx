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
  const { enabledNetworks, addEnabledNetwork, removeEnabledNetwork } =
    useNetworkContext();
  const history = useHistory();

  const enabledNetworksArray = enabledNetworks || [];

  return (
    <Stack
      sx={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0,
        maxHeight: '100%',
        gap: 1,
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '2px',
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
              removeEnabledNetwork(network.chainId);
            } else {
              addEnabledNetwork(network.chainId);
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
