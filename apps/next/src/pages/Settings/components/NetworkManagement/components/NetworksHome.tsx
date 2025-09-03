import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabMenu } from '@/components/TabMenu';
import { IconButton, Stack, Typography } from '@avalabs/k2-alpine';
import { PageTopBar } from '@/components/PageTopBar';
import { MdAdd } from 'react-icons/md';
import { useNetworkContext } from '@core/ui';
import { useHistory } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { useIsIntersecting } from '@/hooks/useIsIntersecting';
import { NetworkToggleList } from './NetworkToggle/NetworkToggleList';

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
          px={1.5}
          pb={1.5}
          mt={2.5}
          sx={{ flexShrink: 0 }}
        >
          <Typography variant="h2" component="h1">
            {t('Networks')}
          </Typography>
          <IconButton
            sx={{ mr: -1 }}
            onClick={() => {
              history.push(`/settings/network-management/add`);
            }}
          >
            <MdAdd size={24} />
          </IconButton>
        </Stack>
        <Stack sx={{ flexShrink: 0 }} px={1.5}>
          <SearchInput filter={filter} setFilter={setFilter} />
        </Stack>
      </Stack>

      {/* Content Area */}
      <Stack
        px={1.5}
        pb={1.5}
        mt={2.5}
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
      <Stack px={1.5} pb={1.5} sx={{ flexShrink: 0 }}>
        <TabMenu
          size="small"
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
        >
          <Tab label={t('All networks')} value={'all' satisfies Tab} />
          <Tab label="Custom" value={'custom' satisfies Tab} />
        </TabMenu>
      </Stack>
    </Stack>
  );
};
