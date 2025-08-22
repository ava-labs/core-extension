import { Page } from '@/components/Page';
import {
  Box,
  Button,
  SearchInput,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { useNetworkContext } from '@core/ui';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd } from 'react-icons/md';
import { NetworkToggleListItem } from './NetworkToggleListItem';
import { useHistory } from 'react-router-dom';
import { defaultEnabledNetworks } from '~/services/network/consts';

export const AllNetworks = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { enabledNetworks, networks, addEnabledNetwork, removeEnabledNetwork } =
    useNetworkContext();

  const [filter, setFilter] = useState('');

  const filteredNetworks = useMemo(() => {
    return networks.filter((network) => {
      return (
        network.chainName.toLowerCase().includes(filter.toLowerCase()) ||
        network.chainId.toString().includes(filter)
      );
    });
  }, [networks, filter]);
  return (
    <Page
      withBackButton
      contentProps={{
        gap: 2,
        width: 1,
        height: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Fixed Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ flexShrink: 0 }}
      >
        <Typography variant="h2" component="h1">
          {t('Networks')}
        </Typography>
        <MdAdd size={24} />
      </Stack>

      {/* Fixed Search */}
      <Stack sx={{ flexShrink: 0 }}>
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('Search')}
        />
      </Stack>

      {/* Scrollable Network List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'scroll',
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
        {filteredNetworks.map((network) => {
          const isEnabled = (enabledNetworks ?? []).includes(network.chainId);

          return (
            <NetworkToggleListItem
              key={network.chainId}
              network={network}
              isEnabled={isEnabled}
              isDefault={defaultEnabledNetworks.includes(network.chainId)}
              onToggle={() => {
                if (isEnabled) {
                  removeEnabledNetwork(network.chainId);
                } else {
                  addEnabledNetwork(network.chainId);
                }
              }}
            />
          );
        })}
      </Box>

      {/* Fixed Buttons */}
      <Stack
        sx={{
          flexShrink: 0,
          gap: 1,
          paddingTop: 2,
        }}
      >
        <Button variant="contained" color="primary">
          {t('All networks')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push(`/settings/network-management/custom`);
          }}
        >
          {t('custom')}
        </Button>
      </Stack>
    </Page>
  );
};
