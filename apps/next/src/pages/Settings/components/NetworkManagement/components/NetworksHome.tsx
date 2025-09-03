import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabMenu } from '@/components/TabMenu';
import { IconButton, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
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
  const theme = useTheme();
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
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 12px',
          marginTop: '36px',
          maxHeight: '360px',
        }}
      >
        <NetworkToggleList
          networks={
            activeTab === 'all' ? filteredNetworks : filteredCustomNetworks
          }
        />
        <div style={{ height: '32px' }} />
      </div>

      {/* Gradient overlay behind buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px', // To make the gradient start from the top of the buttons
          left: 0,
          right: 0,
          height: '40px', // To make the gradient end before the bottom of the top button , ${theme.palette.background.backdrop}
          background: `linear-gradient(180deg,	rgba(0,0,0,0) 0%, ${theme.palette.background.backdrop} 95%, ${theme.palette.background.backdrop} 100%)`,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Sticky Bottom Tab Menu */}
      <Stack
        width="100%"
        gap={1}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          pt: 0,
          px: 2.5,
          pb: 2,
          backgroundColor: 'transparent',
          background: 'none',
          zIndex: 10,
        }}
      >
        <TabMenu
          size="small"
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          slotProps={{
            root: {
              style: {
                backgroundColor: 'transparent',
              },
            },
          }}
        >
          <Tab label={t('All networks')} value={'all' satisfies Tab} />
          <Tab label="Custom" value={'custom' satisfies Tab} />
        </TabMenu>
      </Stack>
    </Stack>
  );
};
