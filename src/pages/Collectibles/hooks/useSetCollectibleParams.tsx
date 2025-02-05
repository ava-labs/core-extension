import type { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { useHistory, useLocation } from 'react-router-dom';

type SetCollectibleParams = {
  nft?: NftTokenWithBalance;
  address?: string;
  options?: {
    path?: string;
    replace?: boolean;
  };
};

export function useSetCollectibleParams() {
  const { pathname } = useLocation();
  const history = useHistory();

  return ({ nft, address, options }: SetCollectibleParams) => {
    const pushOrReplace = options?.replace ? history.replace : history.push;
    pushOrReplace({
      pathname: options?.path ?? pathname,
      search: `?${new URLSearchParams({
        nft: nft?.address ?? '',
        tokenId: nft?.tokenId ?? '',
        address: address ?? '',
      }).toString()}`,
    });
  };
}
