import { Box, Stack, Typography, styled, useTheme } from '@avalabs/k2-alpine';
import { TokenDiff, TokenType } from '@avalabs/vm-module-types';
import { FC, useMemo, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { useNfts } from '@core/ui';
import { EvmNetwork } from '@core/types';

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
        const key = `${collectible.address.toLowerCase()}`;
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
        const firstItem = items[0];
        if (!firstItem) return null;

        const key =
          'address' in token ? token.address : token.symbol || `nft-${index}`;

        // Try to find matching collectible by address
        const tokenAddress =
          'address' in token ? token.address?.toLowerCase() : undefined;
        const matchedCollectible = tokenAddress
          ? collectiblesMap.get(tokenAddress)
          : undefined;

        // Use collectible's logoUri if found, otherwise fall back to token.logoUri
        const logoUri =
          matchedCollectible?.logoUri ||
          matchedCollectible?.logoSmall ||
          token.logoUri;

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

type NftImageProps = {
  logoUri?: string;
};

const NftImage: FC<NftImageProps> = ({ logoUri }) => {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);
  return (
    <Stack
      overflow="hidden"
      width={80}
      height={80}
      borderRadius={theme.shape.mediumBorderRadius}
    >
      {!hasError && logoUri ? (
        <Image src={logoUri} onError={() => setHasError(true)} alt="" />
      ) : (
        <FallbackIconContainer>
          <FaQuestionCircle size={40} color="text.primary" opacity={0.3} />
        </FallbackIconContainer>
      )}
    </Stack>
  );
};

const Image = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 8,
});

const FallbackIconContainer = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
});

/**
 * Helper function to check if a token diff represents an NFT
 */
export const isNftTokenDiff = (tokenDiff: TokenDiff): boolean => {
  return (
    tokenDiff.token &&
    'type' in tokenDiff.token &&
    (tokenDiff.token.type === TokenType.ERC721 ||
      tokenDiff.token.type === TokenType.ERC1155)
  );
};
