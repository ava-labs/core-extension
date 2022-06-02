import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useCollectibleFromParams = () => {
  const { search } = useLocation();
  const { nfts } = useBalancesContext();

  return useMemo(() => {
    const { nft, tokenId } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );

    return {
      nft: nfts.items?.find((item) => item.contractAddress === nft),
      tokenId: tokenId,
    };
  }, [nfts, search]);
};
