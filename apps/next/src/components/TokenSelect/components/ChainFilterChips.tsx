import {
  Avatar,
  Badge,
  BadgeProps,
  Button,
  Stack,
  styled,
  useTheme,
} from '@avalabs/k2-alpine';
import { ChainId } from '@avalabs/core-chains-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useNetworkContext } from '@core/ui';
import { isPchainNetwork, isXchainNetwork } from '@core/common';

import DarkP from '@/images/chain-logos/p_chain_dark.svg';
import LightP from '@/images/chain-logos/p_chain_light.svg';
import DarkX from '@/images/chain-logos/x_chain_dark.svg';
import LightX from '@/images/chain-logos/x_chain_light.svg';

type ChainOption = {
  chainId: number;
  chainName: string;
};

type ChainFilterChipsProps = {
  chainOptions: ChainOption[];
  selectedChainId: number | null;
  onChainSelect: (chainId: number | null) => void;
};

const XP_LOGOS = {
  dark: {
    [NetworkVMType.AVM]: DarkX,
    [NetworkVMType.PVM]: DarkP,
  },
  light: {
    [NetworkVMType.AVM]: LightX,
    [NetworkVMType.PVM]: LightP,
  },
} as const;

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

const ChainBadgeLogo = styled(Avatar)(({ theme }) => ({
  width: 10,
  height: 10,
  backgroundColor: 'transparent',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.palette.background.paper,
}));

const badgeProps: BadgeProps = {
  overlap: 'circular',
  anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
};

export const ChainFilterChips: FC<ChainFilterChipsProps> = ({
  chainOptions,
  selectedChainId,
  onChainSelect,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { getNetwork } = useNetworkContext();

  // Get Avalanche C-Chain network for the main logo
  const avalancheCChain =
    getNetwork(ChainId.AVALANCHE_MAINNET_ID) ||
    getNetwork(ChainId.AVALANCHE_TESTNET_ID);

  const getChainLogo = (chainId: number) => {
    const network = getNetwork(chainId);
    if (!network) return { mainLogo: undefined, badgeLogo: undefined };

    // For X and P chains, use Avalanche logo with badge
    if (isPchainNetwork(network) || isXchainNetwork(network)) {
      const badgeLogo = XP_LOGOS[theme.palette.mode][network.vmName];
      const mainLogo = avalancheCChain?.logoUri;
      return { mainLogo, badgeLogo };
    }

    // For other chains, just use their logo
    return { mainLogo: network.logoUri, badgeLogo: undefined };
  };

  const renderChainLogo = (chainId: number, chainName: string) => {
    const { mainLogo, badgeLogo } = getChainLogo(chainId);

    if (!mainLogo) return null;

    // If there's a badge (X or P chain), render with Badge component
    if (badgeLogo) {
      return (
        <Badge
          {...badgeProps}
          badgeContent={
            <ChainBadgeLogo
              src={badgeLogo}
              alt={chainName}
              variant="circular"
            />
          }
        >
          <ChainLogo src={mainLogo} alt={chainName} variant="circular" />
        </Badge>
      );
    }

    // For other chains, just show the logo
    return <ChainLogo src={mainLogo} alt={chainName} variant="circular" />;
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
