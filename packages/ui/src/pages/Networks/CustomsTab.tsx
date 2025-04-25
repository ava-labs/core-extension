import { Stack } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { useNetworkContext } from '@/contexts/NetworkProvider';
import { EmptyContent } from '@/components/common/EmptyContent';

import { NetworkList } from './common/NetworkList';
import { NetworkTabProps } from './Networks';

export function CustomsTab({ searchTerm }: NetworkTabProps) {
  const { t } = useTranslation();
  const { customNetworks } = useNetworkContext();

  const filteredCustomNetworks = customNetworks.filter(
    (networkItem) => searchTerm && networkItem.chainName.match(searchTerm),
  );

  return (
    <Stack sx={{ height: 1, pb: 1 }}>
      {!filteredCustomNetworks.length && (
        <EmptyContent text={t('There is no search result.')} />
      )}

      <NetworkList networkList={filteredCustomNetworks} />
    </Stack>
  );
}
