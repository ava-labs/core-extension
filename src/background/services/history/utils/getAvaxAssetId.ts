import { Avalanche } from '@avalabs/wallets-sdk';

export const getAvaxAssetId = (isTestnet: boolean) =>
  isTestnet
    ? Avalanche.FujiContext.avaxAssetID
    : Avalanche.MainnetContext.avaxAssetID;
