import { TokenType } from '@avalabs/vm-module-types';
import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { getAddressForChain } from '@core/common';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
  useSettingsContext,
} from '@core/ui';
import { useMemo } from 'react';

export function useTokenDetails({
  networkId,
  tokenAddress,
}: {
  networkId: string;
  tokenAddress: string;
}) {
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
  const tokenBalanceInCurrency = useMemo(() => {
    return tokenBalance?.balanceCurrencyDisplayValue
      ? currencyFormatter(Number(tokenBalance.balanceCurrencyDisplayValue))
      : placeholderTotalBalance;
  }, [
    tokenBalance?.balanceCurrencyDisplayValue,
    placeholderTotalBalance,
    currencyFormatter,
  ]);

  return {
    token,
    tokenBalance,
    tokenBalanceInCurrency,
    currency,
  };
}
