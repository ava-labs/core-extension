import { BitcoinProviderAbstract } from '@avalabs/core-wallets-sdk';
import { BtcTransactionRequest } from '../models';

export async function prepareBtcTxForLedger(
  tx: BtcTransactionRequest,
  provider: BitcoinProviderAbstract
): Promise<BtcTransactionRequest> {
  //get unique hashes
  const txHashSet = new Set<string>(tx.inputs.map((i) => i.txHash));

  // Get the tx hex for each input tx
  const txHexDict: Record<string, string> = {};
  for (const hash of txHashSet) {
    const hex = await provider.getTxHex(hash);
    txHexDict[hash] = hex;
  }

  return {
    ...tx,
    inputs: tx.inputs.map((input) => ({
      ...input,
      txHex: txHexDict[input.txHash],
    })),
  };
}
