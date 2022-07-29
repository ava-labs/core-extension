import { VerticalFlex } from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkTabProps } from './Networks';
import { EmptyContent } from '@src/components/common/EmptyContent';
import { NetworkList } from './common/NetworkList';

export function CustomsTab({ searchTerm }: NetworkTabProps) {
  const { customNetworks } = useNetworkContext();

  const filteredCustomNetworks = customNetworks.filter(
    (networkItem) => searchTerm && networkItem.chainName.match(searchTerm)
  );

  return (
    <VerticalFlex padding="0px 0px 8px 0px" height="100%">
      {!filteredCustomNetworks.length && (
        <EmptyContent text="There is no search result." />
      )}

      <NetworkList networkList={filteredCustomNetworks} />
    </VerticalFlex>
  );
}
