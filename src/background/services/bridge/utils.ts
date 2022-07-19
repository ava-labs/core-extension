import { Network } from '@avalabs/chains-sdk';
import { TxData } from '@ethereumjs/tx';
import { TransactionRequest } from '@ethersproject/providers';
import { BNLike, BufferLike } from 'ethereumjs-util';
import { BigNumber, BigNumberish } from 'ethers';
import { BridgeState } from './models';

/**
 * Remove bridgeTransactions that don't belong to the given network.
 */
export function filterBridgeStateToNetwork(
  bridge: BridgeState,
  network: Network
): BridgeState {
  const isMainnet = !network.isTestnet;
  const bridgeTransactions = Object.values(bridge.bridgeTransactions).reduce<
    BridgeState['bridgeTransactions']
  >((txs, btx) => {
    if (btx.environment === (isMainnet ? 'main' : 'test')) {
      txs[btx.sourceTxHash] = btx;
    }
    return txs;
  }, {});

  return { ...bridge, bridgeTransactions };
}

/**
 * Convert tx data from `TransactionRequest` (ethers) to `TxData` (@ethereumjs)
 */
export function convertTxData(txData: TransactionRequest): TxData {
  return {
    to: txData.to,
    nonce: makeBNLike(txData.nonce),
    gasPrice: makeBNLike(txData.gasPrice),
    gasLimit: makeBNLike(txData.gasLimit),
    value: makeBNLike(txData.value),
    data: txData.data as BufferLike,
    type: txData.type,
  };
}

function makeBNLike(n: BigNumberish | undefined): BNLike | undefined {
  if (n == null) return undefined;
  return BigNumber.from(n).toHexString();
}
