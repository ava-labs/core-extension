import { skipToken, useQuery } from '@tanstack/react-query';

import {
  NetworkWithCaipId,
  PChainTokenBalance,
  PvmCapableAccount,
  XPAddresses,
} from '@core/types';

import { getPChainMaxAmount } from './lib/getPChainMaxAmount';

type UsePChainMaxAmountArgs = {
  from?: PvmCapableAccount;
  token?: PChainTokenBalance;
  network?: NetworkWithCaipId;
  isLedgerWallet: boolean;
  filterSmallUtxos: boolean;
  getAddresses: () => Promise<XPAddresses>;
};

/**
 * Estimating the P-Chain max sendable amount requires packing the whole UTXO set into a
 * maximum-size transaction (see `getMaximumUtxoSet`), which is heavy and synchronous. Caching it
 * with React Query — keyed on the account balance (a stable proxy for "the UTXO set changed") —
 * means the packing runs once per real change and is shared across call sites, instead of
 * re-running on every balance poll / render and janking the page on large-UTXO wallets.
 */
export const usePChainMaxAmount = ({
  from,
  token,
  network,
  isLedgerWallet,
  filterSmallUtxos,
  getAddresses,
}: UsePChainMaxAmountArgs) => {
  const { data } = useQuery({
    queryKey: [
      'pChainMaxAmount',
      from?.addressPVM,
      token?.balance?.toString(),
      network?.caipId,
      isLedgerWallet,
      filterSmallUtxos,
    ],
    queryFn:
      from && network
        ? () =>
            getPChainMaxAmount(
              from,
              isLedgerWallet,
              filterSmallUtxos,
              getAddresses,
              network,
            )
        : skipToken,
    // The result only changes when the UTXO set (≈ balance) or fee state changes, both captured
    // by the key, so keep it fresh for a while to avoid needless recomputation.
    staleTime: 30_000,
  });

  return {
    maxAmount: data?.maxAmount,
    estimatedFee: data?.estimatedFee,
  };
};
