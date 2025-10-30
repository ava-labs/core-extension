import { useNetworkContext, useNfts } from '@core/ui';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import xss from 'xss';

export const useCollectibleFromParams = () => {
  const { search } = useLocation();
  const { network } = useNetworkContext();
  const nfts = useNfts(network);

  return useMemo(() => {
    const { nft, tokenId } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries(),
    );

    if (!nft || !tokenId) {
      return {
        nft: undefined,
        tokenId: xss(tokenId),
      };
    }

    const filteredAddress = xss(nft);

    return {
      nft: nfts?.find(
        (item) => item.address === filteredAddress && item.tokenId === tokenId,
      ),
      tokenId: xss(tokenId),
    };
  }, [nfts, search]);
};
