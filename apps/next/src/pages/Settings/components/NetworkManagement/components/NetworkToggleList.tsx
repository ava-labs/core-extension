import { Stack } from '@avalabs/k2-alpine';
import { NetworkToggleListItem } from './NetworkToggleListItem';
import { useNetworkContext } from '@core/ui';
import { NetworkWithCaipId } from '@core/types';
import { defaultEnabledNetworks } from '~/services/network/consts';

type NetworkToggleListProps = {
  networks: NetworkWithCaipId[];
};

export const NetworkToggleList = ({ networks }: NetworkToggleListProps) => {
  const { enabledNetworks, addEnabledNetwork, removeEnabledNetwork } =
    useNetworkContext();

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
          isEnabled={enabledNetworks.includes(network.chainId)}
          isDefault={defaultEnabledNetworks.includes(network.chainId)}
          onToggle={() => {
            if (enabledNetworks.includes(network.chainId)) {
              removeEnabledNetwork(network.chainId);
            } else {
              addEnabledNetwork(network.chainId);
            }
          }}
        />
      ))}
    </Stack>
  );
};
