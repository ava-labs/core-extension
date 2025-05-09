import { useHistory } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  PlusIcon,
  SearchBar,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  styled,
} from '@avalabs/core-k2-components';

import { useAnalyticsContext } from '@core/ui';
import { PageTitle } from '@/components/common/PageTitle';
import { usePersistedTabs } from '@core/ui';

import { CustomsTab } from './CustomsTab';
import { FavoritesTab } from './FavoritesTab';
import { NetworksTab } from './NetworksTab';

export enum NetworkTab {
  Favorites,
  All,
  Custom,
}

export interface NetworkTabProps {
  searchTerm: RegExp;
}

const NetworkTabPanel = styled(TabPanel)`
  flex-grow: 1;
`;

export function Networks() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { capture } = useAnalyticsContext();
  const history = useHistory();
  const { activeTab, setActiveTab } = usePersistedTabs(NetworkTab.Favorites);

  const term = new RegExp(searchTerm, 'gi');

  return (
    <Stack sx={{ width: 1, flexGrow: 1 }}>
      <PageTitle margin="12px 0">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
          }}
        >
          {t('Networks')}

          <IconButton
            data-testid="add-network-button"
            onClick={() => history.push('/networks/add')}
          >
            <PlusIcon size={24} />
          </IconButton>
        </Stack>
      </PageTitle>
      <Stack sx={{ py: 1, px: 2 }}>
        <SearchBar
          sx={{ width: 1 }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          data-testid="network-search"
        />
      </Stack>
      <Tabs
        size="medium"
        variant="fullWidth"
        indicatorColor="secondary"
        value={activeTab}
        onChange={(_, tab) => {
          if (tab === NetworkTab.Custom) {
            capture('NetworkCustomTabClicked');
          } else if (tab === NetworkTab.Favorites) {
            capture('NetworkFavoritesTabClicked');
          } else {
            capture('NetworkNetworksTabClicked');
          }
          setActiveTab(tab);
        }}
      >
        <Tab label={t('Favorites')} value={NetworkTab.Favorites} />
        <Tab label={t('Networks')} value={NetworkTab.All} />
        <Tab label={t('Custom')} value={NetworkTab.Custom} />
      </Tabs>
      <Stack
        sx={{
          flexGrow: 1,
          mt: -0.25,
          pt: 1,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <NetworkTabPanel value={activeTab} index={NetworkTab.Favorites}>
          <FavoritesTab searchTerm={term} />
        </NetworkTabPanel>
        <NetworkTabPanel value={activeTab} index={NetworkTab.All}>
          <NetworksTab searchTerm={term} />
        </NetworkTabPanel>
        <NetworkTabPanel value={activeTab} index={NetworkTab.Custom}>
          <CustomsTab searchTerm={term} />
        </NetworkTabPanel>
      </Stack>
    </Stack>
  );
}
