import { Avalanche } from '@avalabs/wallets-sdk';

export function isPrimarySubnet(subnetId: string) {
  return subnetId === Avalanche.MainnetContext.pBlockchainID;
}
