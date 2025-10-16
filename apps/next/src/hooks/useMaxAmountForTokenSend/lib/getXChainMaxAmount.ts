import { AvmCapableAccount, NetworkWithCaipId } from '@core/types';
import { getMaxUtxoSet } from '@core/common';

import { getAvalancheWallet } from '@/lib/getAvalancheWallet';
import { getAvalancheProvider } from '@/lib/getAvalancheProvider';

export const getXChainMaxAmount = async (
  from: AvmCapableAccount,
  isLedgerWallet: boolean,
  network?: NetworkWithCaipId,
) => {
  if (!network) {
    return {
      maxAmount: 0n,
      estimatedFee: 0n,
    };
  }

  const provider = getAvalancheProvider(network);
  const wallet = getAvalancheWallet(from, provider);
  const estimatedFee = provider.getContext().baseTxFee;
  const utxos = await getMaxUtxoSet(isLedgerWallet, provider, wallet, network);
  const available = utxos?.balance.available ?? BigInt(0);
  const maxAmount = available - estimatedFee;

  return {
    maxAmount: maxAmount > 0n ? maxAmount : 0n,
    estimatedFee,
  };
};
