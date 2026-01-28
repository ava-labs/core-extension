import { Page } from '@/components/Page';
import { Tab, TabMenu } from '@/components/TabMenu';
import {
  getHexAlpha,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import {
  useAnalyticsContext,
  useNavigation,
  useNetworkContext,
} from '@core/ui';
import { isEmpty } from 'lodash';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd } from 'react-icons/md';
import { NetworkToggleList } from './NetworkToggle/NetworkToggleList';
import { SearchInput } from './SearchInput';

type Tab = 'all' | 'custom';

export const NetworksHome: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useNavigation('slide');
  const { networks, customNetworks } = useNetworkContext();
  const { capture } = useAnalyticsContext();
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const [filter, setFilter] = useState('');

  const currentNetworks = activeTab === 'all' ? networks : customNetworks;

  const filteredNetworks = useMemo(() => {
    const normalizedFilter = filter.toLowerCase();
    return currentNetworks.filter(
      (network) =>
        network.chainName.toLowerCase().includes(normalizedFilter) ||
        network.chainId.toString().includes(filter),
    );
  }, [currentNetworks, filter]);

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
      {isEmpty(filteredNetworks) && filter ? (
        <Stack
          height="100%"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
        >
          <Typography variant="h1" component="span" mb={2} fontWeight="medium">
            🌵
          </Typography>
          <Typography variant="body3" fontWeight={600}>
            {t('No results found')}
          </Typography>
        </Stack>
      ) : (
        <NetworkToggleList networks={filteredNetworks} />
      )}
      {/* Sticky Bottom Tab Menu */}
      <Stack
        width="calc(100vw - 12px)"
        gap={1}
        position="sticky"
        bottom={0}
        pt={3}
        pb={2}
        px={2}
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
        >
          <Tab label={t('All networks')} value={'all' satisfies Tab} />
          <Tab label="Custom" value={'custom' satisfies Tab} />
        </TabMenu>
      </Stack>
    </Page>
  );
};
