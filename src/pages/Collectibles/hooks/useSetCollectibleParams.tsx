import { NFT } from '@src/background/services/balances/nftBalanceAggregators/models';
import { useHistory, useLocation } from 'react-router-dom';

type SetCollectibleParams = {
  nft?: NFT;
  tokenId?: string;
  address?: string;
  options?: {
    path?: string;
    replace?: boolean;
  };
};

export function useSetCollectibleParams() {
  const { pathname } = useLocation();
  const history = useHistory();

  return ({ nft, tokenId, address, options }: SetCollectibleParams) => {
    const pushOrReplace = options?.replace ? history.replace : history.push;
    pushOrReplace({
      pathname: options?.path ?? pathname,
      search: `?${new URLSearchParams({
        nft: nft?.contractAddress ?? '',
        tokenId: tokenId ?? '',
        address: address ?? '',
      }).toString()}`,
    });
  };
}
