import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabMenu } from '@/components/TabMenu';
import { getHexAlpha, IconButton, Stack, useTheme } from '@avalabs/k2-alpine';
import { MdAdd } from 'react-icons/md';
import { useAnalyticsContext, useNetworkContext } from '@core/ui';
import { useHistory } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { NetworkToggleList } from './NetworkToggle/NetworkToggleList';
import { Page } from '@/components/Page';

type Tab = 'all' | 'custom';

export const NetworksHome: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const { networks, customNetworks } = useNetworkContext();
  const { capture } = useAnalyticsContext();
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
    <Page
      title={t('Networks')}
      titleAction={
        <IconButton
          onClick={() => {
            history.push(`/settings/network-management/add`);
          }}
        >
          <MdAdd size={24} />
        </IconButton>
      }
      contentProps={{ px: 0 }}
      containerProps={{ pb: 0 }}
    >
      <Stack width="100%">
        <SearchInput filter={filter} setFilter={setFilter} />
      </Stack>

      {/* Content Area */}
      <NetworkToggleList
        networks={
          activeTab === 'all' ? filteredNetworks : filteredCustomNetworks
        }
      />
      {/* Sticky Bottom Tab Menu */}
      <Stack
        width="calc(100% + 24px)" // Compensate for container padding which we don't want applied here.
        gap={1}
        position="sticky"
        bottom={0}
        pt={3}
        pb={2}
        px={2} // Since we increased the width, we need to bump the padding too.
        sx={{
          background: `linear-gradient(180deg, ${getHexAlpha(theme.palette.alphaMatch.backdropSolid, 0)} 0%, ${theme.palette.alphaMatch.backdropSolid} 32.5%)`,
        }}
      >
        <TabMenu
          size="small"
          value={activeTab}
          onChange={(_, value) => {
            setActiveTab(value);
            if (value === 'all') {
              capture('NetworkNetworksTabClicked');
            } else if (value === 'custom') {
              capture('NetworkCustomTabClicked');
            }
          }}
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
    </Page>
  );
};
