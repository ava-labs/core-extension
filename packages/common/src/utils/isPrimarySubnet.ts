import { Avalanche } from '@avalabs/core-wallets-sdk';

export function isPrimarySubnet(subnetId: string) {
  return subnetId === Avalanche.MainnetContext.pBlockchainID;
}
