import { useWalletContext } from '@src/contexts/WalletProvider';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useCollectibleFromParams = () => {
  const { search } = useLocation();
  const { nfts } = useWalletContext();

  return useMemo(() => {
    const { nft, tokenId } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );

    return {
      nft: nfts.find((item) => item.contractAddress === nft),
      tokenId: tokenId,
    };
  }, [nfts, search]);
};
