import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import xss from 'xss';

export const useCollectibleFromParams = () => {
  const { search } = useLocation();
  const { nfts } = useBalancesContext();

  return useMemo(() => {
    const { nft, tokenId } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );

    const filteredAddress = xss(nft);

    return {
      nft: nfts.items?.find((item) => item.contractAddress === filteredAddress),
      tokenId: xss(tokenId),
    };
  }, [nfts, search]);
};
