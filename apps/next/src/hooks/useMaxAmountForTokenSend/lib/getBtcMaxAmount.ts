import {
  BitcoinInputUTXO,
  createTransferTx,
  getMaxTransferAmount,
} from '@avalabs/core-wallets-sdk';

import { getBtcInputUtxos } from '@core/common';
import { BtcTokenBalance, NetworkFee, NetworkWithCaipId } from '@core/types';

import { getBtcProvider } from '@/lib/getBtcProvider';

export const getBtcMaxAmount = async (
  networkFee: NetworkFee,
  token: BtcTokenBalance,
  from: string,
  to: string,
  network?: NetworkWithCaipId,
) => {
  if (!network) {
    return {
      maxAmount: 0n,
      estimatedFee: 0n,
    };
  }

  const feeRate = Number(networkFee.low.maxFeePerGas);
  const provider = getBtcProvider(network);
  const utxos = await getBtcInputUtxos(provider, token, feeRate);
  const maxTransferAmount = getMaxTransferAmount(utxos, to, from, feeRate);

  const { fee } = createTransferTx(
    to,
    from,
    maxTransferAmount,
    feeRate,
    token.utxos as BitcoinInputUTXO[],
    provider.getNetwork(),
  );

  return {
    maxAmount: BigInt(maxTransferAmount),
    estimatedFee: BigInt(fee),
  };
};
