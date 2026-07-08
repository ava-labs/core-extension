import { TokenType } from '@avalabs/vm-module-types';
import { getAddressForChain } from '@core/common';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
  useSettingsContext,
} from '@core/ui';
import { useMemo } from 'react';
import { useToken } from './useToken';
import { Network } from '@core/types';

export function useTokenDetails({
  networkId,
  tokenAddress,
}: {
  networkId: Network['chainId'];
  tokenAddress: string;
}) {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { balances } = useBalancesContext();
  const { getNetwork } = useNetworkContext();
  const token = useToken(tokenAddress, networkId);
  const network = getNetwork(Number(networkId));

  const address = getAddressForChain(network, activeAccount);
  const { currencyFormatter, currency } = useSettingsContext();

  const addressKey =
    token?.type === TokenType.NATIVE || token?.type === TokenType.SPL
      ? tokenAddress
      : tokenAddress.toLowerCase();

  const tokenBalance = balances.tokens?.[networkId]?.[address]?.[addressKey];

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
