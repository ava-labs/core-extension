import { VerticalFlex } from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkTabProps } from './Networks';
import { EmptyContent } from '@src/components/common/EmptyContent';
import { NetworkList } from './common/NetworkList';

export function FavoritesTab({ searchTerm }: NetworkTabProps) {
  const { favoriteNetworks } = useNetworkContext();

  const filteredNetworks = favoriteNetworks.filter(
    (networkItem) => searchTerm && networkItem.chainName.match(searchTerm)
  );
  return (
    <VerticalFlex padding="0px 0px 8px 0px" height="100%">
      {!favoriteNetworks.length && (
        <EmptyContent text="You don't have any favorite item yet." />
      )}
      {!!favoriteNetworks.length && !filteredNetworks.length && (
        <EmptyContent text="There is no search result." />
      )}

      <NetworkList networkList={filteredNetworks} />
    </VerticalFlex>
  );
}
