import { Blockchain } from '@avalabs/bridge-sdk';
import { LedgerAppType } from '@src/contexts/LedgerProvider';

export function getLedgerAppForBlockchain(
  blockchain: Blockchain
): LedgerAppType {
  if (blockchain === Blockchain.BITCOIN) {
    return LedgerAppType.BITCOIN;
  }

  return LedgerAppType.AVALANCHE;
}
