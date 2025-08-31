import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabMenu } from '@/components/TabMenu';
import { IconButton, SearchInput, Stack, Typography } from '@avalabs/k2-alpine';
import { PageTopBar } from '@/components/PageTopBar';
import { useIsIntersecting } from '@/components/Page/hooks/useIsIntersecting';
import { MdAdd } from 'react-icons/md';
import { useNetworkContext } from '@core/ui';
import { NetworkToggleList } from './NetworkToggle/NetworkToggleList';
import { useHistory } from 'react-router-dom';

type Tab = 'all' | 'custom';

export const NetworksHome: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { isIntersecting, isObserving } = useIsIntersecting();
  const { networks, customNetworks } = useNetworkContext();
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const [filter, setFilter] = useState('');

  const filteredNetworks = useMemo(() => {
    return networks.filter((network) => {
      return (
        network.chainName.toLowerCase().includes(filter.toLowerCase()) ||
        network.chainId.toString().includes(filter)
      );
    });
  }, [networks, filter]);

  const filteredCustomNetworks = useMemo(() => {
    return customNetworks.filter((network) => {
      return (
        network.chainName.toLowerCase().includes(filter.toLowerCase()) ||
        network.chainId.toString().includes(filter)
      );
    });
  }, [customNetworks, filter]);

  return (
    <Stack
      px={1.5}
      pb={1.5}
      gap={3}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Sticky Top Bar */}
      <Stack sx={{ flexShrink: 0 }}>
        <PageTopBar
          showBack
          isObserving={isObserving}
          isIntersecting={isIntersecting}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ flexShrink: 0 }}
        >
          <Typography variant="h2" component="h1">
            {t('Networks')}
          </Typography>
          <IconButton
            onClick={() => {
              history.push(`/settings/network-management/add`);
            }}
          >
            <MdAdd size={24} />
          </IconButton>
        </Stack>
        <Stack sx={{ flexShrink: 0 }}>
          <SearchInput
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t('Search')}
          />
        </Stack>
      </Stack>

      {/* Content Area */}
      <Stack
        sx={{
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
          height: '100%',
        }}
      >
        <NetworkToggleList
          networks={
            activeTab === 'all' ? filteredNetworks : filteredCustomNetworks
          }
        />
      </Stack>

      {/* Sticky Bottom Tab Menu */}
      <Stack sx={{ flexShrink: 0 }}>
        <TabMenu
          size="small"
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
        >
          <Tab
            label={t('All networks')}
            value={'all' satisfies Tab}
            sx={{
              py: 0,
            }}
          />
          <Tab
            label="Custom"
            value={'custom' satisfies Tab}
            sx={{
              py: 0,
            }}
          />
        </TabMenu>
      </Stack>
    </Stack>
  );
};
