import { Avatar, Button, Stack, styled } from '@avalabs/k2-alpine';
import { ChainId } from '@avalabs/core-chains-sdk';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useNetworkContext } from '@core/ui';

type ChainOption = {
  chainId: number | 'avalanche';
  chainName: string;
};

type ChainFilterChipsProps = {
  chainOptions: ChainOption[];
  selectedChainId: number | 'avalanche' | null;
  onChainSelect: (chainId: number | 'avalanche' | null) => void;
};

const ChipsContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

const FilterChip = styled(Button)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    minWidth: 'auto',
    padding: theme.spacing(0.5, 1),
    borderRadius: parseInt(theme.shape.borderRadius.toString(), 10) * 2,
    textTransform: 'none',
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    backgroundColor: selected
      ? theme.palette.primary.main
      : theme.palette.background.paper,
    color: selected
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    gap: theme.spacing(0.5),
    border: '0px solid transparent',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: selected
        ? theme.palette.primary.main
        : theme.palette.action.hover,
    },
  }),
);

const ChainLogo = styled(Avatar)({
  width: 16,
  height: 16,
  backgroundColor: 'transparent',
});

export const ChainFilterChips: FC<ChainFilterChipsProps> = ({
  chainOptions,
  selectedChainId,
  onChainSelect,
}) => {
  const { t } = useTranslation();
  const { getNetwork } = useNetworkContext();

  // Get Avalanche C-Chain network for the main logo (for c-x-p merged network)
  const avalancheCChain =
    getNetwork(ChainId.AVALANCHE_MAINNET_ID) ||
    getNetwork(ChainId.AVALANCHE_TESTNET_ID);

  const renderChainLogo = (
    chainId: number | 'avalanche',
    chainName: string,
  ) => {
    // Special handling for Avalanche (merged networks - c-x-p)
    if (chainId === 'avalanche') {
      const mainLogo = avalancheCChain?.logoUri;
      if (!mainLogo) {
        return null;
      }
      return <ChainLogo src={mainLogo} alt={chainName} variant="circular" />;
    }

    const network = getNetwork(chainId);
    const logoUri = network?.logoUri;

    if (!logoUri) {
      return null;
    }

    return <ChainLogo src={logoUri} alt={chainName} variant="circular" />;
  };

  return (
    <ChipsContainer direction="row">
      <FilterChip
        selected={selectedChainId === null}
        onClick={() => onChainSelect(null)}
        variant="outlined"
        size="small"
      >
        {t('All')}
      </FilterChip>
      {chainOptions.map(({ chainId, chainName }) => (
        <FilterChip
          key={chainId}
          selected={selectedChainId === chainId}
          onClick={() => onChainSelect(chainId)}
          variant="outlined"
          size="small"
        >
          {renderChainLogo(chainId, chainName)}
          {chainName}
        </FilterChip>
      ))}
    </ChipsContainer>
  );
};
