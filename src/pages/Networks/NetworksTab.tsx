import { VerticalFlex } from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkTabProps } from './Networks';
import { EmptyContent } from '@src/components/common/EmptyContent';
import { NetworkList } from './common/NetworkList';
import { useTranslation } from 'react-i18next';

export function NetworksTab({ searchTerm }: NetworkTabProps) {
  const { t } = useTranslation();
  const { networks } = useNetworkContext();

  const filteredNetworks = networks.filter(
    (networkItem) => searchTerm && networkItem.chainName.match(searchTerm)
  );

  return (
    <VerticalFlex padding="0px 0px 8px 0px" height="100%">
      {!filteredNetworks.length && (
        <EmptyContent text={t('There is no search result.')} />
      )}
      <NetworkList networkList={filteredNetworks} />
    </VerticalFlex>
  );
}
