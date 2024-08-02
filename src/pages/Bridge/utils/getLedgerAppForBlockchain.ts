import { Blockchain } from '@avalabs/core-bridge-sdk';
import { LedgerAppType } from '@src/contexts/LedgerProvider';

export function getLedgerAppForBlockchain(
  blockchain: Blockchain
): LedgerAppType {
  if (blockchain === Blockchain.BITCOIN) {
    return LedgerAppType.BITCOIN;
  }
  if (blockchain === Blockchain.ETHEREUM) {
    return LedgerAppType.ETHEREUM;
  }

  return LedgerAppType.AVALANCHE;
}
