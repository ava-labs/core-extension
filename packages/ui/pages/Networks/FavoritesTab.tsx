import { Stack } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { EmptyContent } from 'packages/ui/src/components/common/EmptyContent';

import { NetworkTabProps } from './Networks';
import { NetworkList } from './common/NetworkList';

export function FavoritesTab({ searchTerm }: NetworkTabProps) {
  const { t } = useTranslation();
  const { favoriteNetworks } = useNetworkContext();

  const filteredNetworks = favoriteNetworks.filter(
    (networkItem) => searchTerm && networkItem.chainName.match(searchTerm),
  );

  const hasFavorites = favoriteNetworks.length > 0;
  const hasSearchResults = filteredNetworks.length > 0;

  return (
    <Stack sx={{ width: 1, height: 1, pb: 1 }}>
      {!hasFavorites && (
        <EmptyContent text={t("You don't have any favorite item yet.")} />
      )}

      {hasFavorites && !hasSearchResults && (
        <EmptyContent text={t('There is no search result.')} />
      )}

      <NetworkList networkList={filteredNetworks} />
    </Stack>
  );
}
