import { useParams } from 'react-router-dom';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
  useSettingsContext,
} from '@core/ui';
import { AssetsErrorState } from '../AssetsErrorState';
import { getAddressForChain } from '@core/common';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { TokenType } from '@avalabs/vm-module-types';
import { useMemo } from 'react';
import { PortfolioActionButtons } from '../PortfolioActionButtons';
import { StyledButton } from '../../styled';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { SizedAvatar } from '@/components/TokenAvatar/components';

export const TokenDetails = () => {
  const { t } = useTranslation();
  const { networkId, tokenAddress } = useParams<{
    networkId: string;
    tokenAddress: string;
  }>();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { balances } = useBalancesContext();
  const { getNetwork } = useNetworkContext();
  const network = getNetwork(Number(networkId));
  const address = getAddressForChain(network, activeAccount);
  const assets = useAllTokensFromEnabledNetworks(true, true);
  const { currencyFormatter, currency } = useSettingsContext();

  const token = assets.find((asset) =>
    asset.coreChainId === Number(networkId) && asset.type === TokenType.ERC20
      ? asset.symbol.toLowerCase() === tokenAddress.toLowerCase()
      : asset.coreChainId === Number(networkId) &&
          asset.type === TokenType.NATIVE
        ? asset.symbol.toLowerCase() === tokenAddress.toLowerCase()
        : false,
  );

  const tokenBalance = balances.tokens?.[networkId]?.[address]?.[tokenAddress];

  const placeholderTotalBalance = useMemo(
    () => currencyFormatter(0).replace('0.00', ' -'),
    [currencyFormatter],
  );
  const tokenBalanceToDisplay = useMemo(() => {
    return tokenBalance?.balanceCurrencyDisplayValue
      ? currencyFormatter(Number(tokenBalance.balanceCurrencyDisplayValue))
      : placeholderTotalBalance;
  }, [
    tokenBalance?.balanceCurrencyDisplayValue,
    placeholderTotalBalance,
    currencyFormatter,
  ]);
  const handleFilterMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    console.log('filter menu clicked', event);
  };

  const handleSortMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('sort menu clicked', event);
  };

  if (!token || !tokenBalance) {
    return <AssetsErrorState />;
  }

  return (
    <Stack mt={4.5} mx={1.5}>
      <Box flexShrink={0}>
        <SizedAvatar src={token.logoUri} alt={token.symbol} size={32} />

        {/* <TokenAvatar token={token} size={32} badgeSize={16} /> */}
      </Box>
      <Typography variant="h2" color="text.secondary">
        {token.name}
      </Typography>
      <Stack
        direction="row"
        alignItems="flex-end"
        gap={0.5}
        color="text.primary"
      >
        <Typography variant="h2">{tokenBalance.balanceDisplayValue}</Typography>
        <Typography variant="h7">{token.symbol}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap={0.5} my={0.5}>
        <Typography variant="body1" fontWeight={500} color="text.primary">
          {tokenBalanceToDisplay} {currency}
        </Typography>
      </Stack>
      <PortfolioActionButtons />

      <Stack direction="row" gap={1.25} mt={3}>
        <StyledButton
          endIcon={<MdKeyboardArrowDown size={16} />}
          onClick={handleFilterMenuClick}
        >
          {t('Filter')}
        </StyledButton>
        <StyledButton
          endIcon={<MdKeyboardArrowDown size={16} />}
          onClick={handleSortMenuClick}
        >
          {t('Sort')}
        </StyledButton>
      </Stack>
    </Stack>
  );
};
