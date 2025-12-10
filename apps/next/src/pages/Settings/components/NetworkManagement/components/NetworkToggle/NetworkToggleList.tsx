import { Stack } from '@avalabs/k2-alpine';
import { useNetworkContext } from '@core/ui';
import { NetworkWithCaipId } from '@core/types';
import { defaultEnabledNetworks } from '~/services/network/consts';
import { useHistory } from 'react-router-dom';
import { NetworkToggleListItem } from './NetworkToggleListItem';
import { useMemo } from 'react';

type NetworkToggleListProps = {
  networks: NetworkWithCaipId[];
};

const defaultNetworkSet = new Set(defaultEnabledNetworks);
export const NetworkToggleList = ({ networks }: NetworkToggleListProps) => {
  const { enabledNetworks, enableNetwork, disableNetwork } =
    useNetworkContext();
  const history = useHistory();

  const enabledNetworksArray =
    enabledNetworks.map((network) => network.chainId) || [];

  const sortedNetworks = useMemo(() => {
    return [...networks].sort((a, b) => {
      return (
        Number(defaultNetworkSet.has(b.chainId)) -
        Number(defaultNetworkSet.has(a.chainId))
      );
    });
  }, [networks]);

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
      {sortedNetworks.map((network) => (
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
