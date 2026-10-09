import { BitcoinProviderAbstract } from '@avalabs/core-wallets-sdk';
import { BtcTransactionRequest } from '@core/types';

export async function prepareBtcTxForLedger(
  tx: BtcTransactionRequest,
  provider: BitcoinProviderAbstract,
): Promise<BtcTransactionRequest> {
  const uniqueHashes = [...new Set(tx.inputs.map((i) => i.txHash))];
  const hexes = await Promise.all(
    uniqueHashes.map((hash) => provider.getTxHex(hash)),
  );
  const txHexDict = Object.fromEntries(
    uniqueHashes.map((hash, i) => [hash, hexes[i]]),
  );

  return {
    ...tx,
    inputs: tx.inputs.map((input) => ({
      ...input,
      txHex: txHexDict[input.txHash],
    })),
  };
}
