import { CustomsTab } from './CustomsTab';
import { Tabs } from '@src/components/common/Tabs';
import { FavoritesTab } from './FavoritesTab';
import { NetworksTab } from './NetworksTab';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import {
  HorizontalFlex,
  PlusIcon,
  SearchInput,
  TextButton,
  VerticalFlex,
} from '@avalabs/react-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { useTheme } from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

enum NetworkTabs {
  FAVORITES = 'FAVORITES',
  NETWORKS = 'NETWORKS',
  CUSTOM = 'CUSTOM',
}

export interface NetworkTabProps {
  searchTerm: RegExp;
}

export function Networks() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { capture } = useAnalyticsContext();
  const theme = useTheme();
  const history = useHistory();

  const term = new RegExp(searchTerm, 'gi');

  return (
    <VerticalFlex grow="1">
      <HorizontalFlex align="center" padding="0 16px 0 0 ">
        <PageTitle onBackClick={() => history.push('/home')}>
          {t('Networks')}
        </PageTitle>
        <TextButton data-testid="add-network-button">
          <PlusIcon
            color={theme.colors.text1}
            onClick={() => {
              history.push('/networks/add');
            }}
          />
        </TextButton>
      </HorizontalFlex>
      <HorizontalFlex padding="8px 16px">
        <SearchInput
          width="100%"
          placeholder={t('Search')}
          onSearch={setSearchTerm}
          data-testid="network-search"
        />
      </HorizontalFlex>
      <Tabs
        margin="14px 0 0"
        tabs={[
          {
            title: t('Favorites'),
            id: NetworkTabs.FAVORITES,
            component: <FavoritesTab searchTerm={term} />,
            onClick: () => capture('NetworkFavoritesTabClicked'),
          },
          {
            title: t('Networks'),
            id: NetworkTabs.NETWORKS,
            component: <NetworksTab searchTerm={term} />,
            onClick: () => capture('NetworkNetworksTabClicked'),
          },
          {
            title: t('Custom'),
            id: NetworkTabs.CUSTOM,
            component: <CustomsTab searchTerm={term} />,
            onClick: () => capture('NetworkCustomTabClicked'),
          },
        ]}
      />
    </VerticalFlex>
  );
}
