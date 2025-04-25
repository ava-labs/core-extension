import { useTranslation } from 'react-i18next';
import { Stack } from '@avalabs/core-k2-components';

import { useNetworkContext } from '@/contexts/NetworkProvider';
import { EmptyContent } from '@/components/common/EmptyContent';

import { NetworkTabProps } from './Networks';
import { NetworkList } from './common/NetworkList';

export function NetworksTab({ searchTerm }: NetworkTabProps) {
  const { t } = useTranslation();
  const { networks } = useNetworkContext();

  const filteredNetworks = networks.filter(
    (networkItem) => searchTerm && networkItem.chainName.match(searchTerm),
  );

  const hasSearchResults = filteredNetworks.length > 0;

  return (
    <Stack sx={{ width: 1, height: 1, pb: 1 }}>
      {hasSearchResults ? (
        <NetworkList networkList={filteredNetworks} />
      ) : (
        <EmptyContent text={t('There is no search result.')} />
      )}
    </Stack>
  );
}
