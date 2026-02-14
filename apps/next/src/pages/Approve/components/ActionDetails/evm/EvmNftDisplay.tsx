import { Stack, Typography } from '@avalabs/k2-alpine';
import { TokenDiff } from '@avalabs/vm-module-types';
import { FC, useMemo } from 'react';
import { useNfts } from '@core/ui';
import { EvmNetwork } from '@core/types';
import { NftImage } from './NftImage';

type EvmNftDisplayProps = {
  nftDiffs: TokenDiff[];
  network: EvmNetwork;
};

export const EvmNftDisplay: FC<EvmNftDisplayProps> = ({
  nftDiffs,
  network,
}) => {
  const { collectibles } = useNfts();

  // Create a map of collectibles by address (case-insensitive) and chainId for quick lookup
  const collectiblesMap = useMemo(() => {
    const map = new Map<string, (typeof collectibles)[0]>();
    collectibles.forEach((collectible) => {
      if (collectible.address && collectible.chainId === network.chainId) {
        const key = `${collectible.address.toLowerCase()}-${collectible.tokenId}`;
        // If multiple NFTs with same address, prefer one with logoUri
        const existing = map.get(key);
        if (!existing || (!existing.logoUri && collectible.logoUri)) {
          map.set(key, collectible);
        }
      }
    });
    return map;
  }, [collectibles, network]);

  if (nftDiffs.length === 0) {
    return null;
  }

  return (
    <Stack gap={2} alignItems="center" width="100%">
      {nftDiffs.map(({ token, items }, index) => {
        // Get the first item for display (NFTs typically have one item per token)
        const [firstItem] = items;
        if (!firstItem) return null;

        const key =
          'address' in token ? token.address : token.symbol || `nft-${index}`;

        // Try to find matching collectible by address
        const tokenAddress =
          'address' in token ? token.address?.toLowerCase() : undefined;

        const tokenId = Number(firstItem.tokenId);
        const matchedCollectible = tokenAddress
          ? collectiblesMap.get(`${tokenAddress}-${tokenId}`)
          : undefined;

        console.log('matchedCollectible: ', matchedCollectible);

        // Use collectible's logoUri if found, otherwise fall back to token.logoUri
        const logoUri = matchedCollectible?.logoUri || token.logoUri;

        return (
          <Stack key={key} gap={1} alignItems="center" width="100%" mb={2}>
            <NftImage logoUri={logoUri} />
            <Typography variant="caption" textAlign="center">
              {token.name || token.symbol}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};
