import {
  AVALANCHE_XP_DEVNET_NETWORK,
  AVALANCHE_XP_NETWORK,
  AVALANCHE_XP_TEST_NETWORK,
  ChainId,
  Network,
} from '@avalabs/core-chains-sdk';
import { AvalancheNetworkType } from '@core/types';

export const BASE_NETWORK_CONFIG_BY_TYPE: Record<
  AvalancheNetworkType,
  Network
> = {
  mainnet: AVALANCHE_XP_NETWORK,
  testnet: AVALANCHE_XP_TEST_NETWORK,
  devnet: AVALANCHE_XP_DEVNET_NETWORK,
};

export const LOGO_BY_ALIAS: Record<'p' | 'x', string> = {
  x: 'https://images.ctfassets.net/gcj8jwzm6086/5xiGm7IBR6G44eeVlaWrxi/fa3ae7dad2d1d39720f4b132e6dfd63f/xchain-square.svg',
  p: 'https://images.ctfassets.net/gcj8jwzm6086/42aMwoCLblHOklt6Msi6tm/b80574ddae50c0cebe904e0c09a60f00/pchain-square.svg',
};

export const getXPExplorerUrl = (
  type: AvalancheNetworkType,
  alias: 'p' | 'x',
  devnetExplorerUrl?: string,
) => {
  const base =
    type === 'devnet'
      ? (devnetExplorerUrl ?? '')
      : BASE_NETWORK_CONFIG_BY_TYPE[type].explorerUrl;

  // Normalize trailing slash so `<base>/<alias>-chain` always uses a single separator.
  return `${base.replace(/\/+$/, '')}/${alias}-chain`;
};

export const getXPChainId = (type: AvalancheNetworkType, alias: 'p' | 'x') => {
  if (type === 'devnet') {
    return alias === 'p'
      ? ChainId.AVALANCHE_DEVNET_P
      : ChainId.AVALANCHE_DEVNET_X;
  }

  if (type === 'testnet') {
    return alias === 'p' ? ChainId.AVALANCHE_TEST_P : ChainId.AVALANCHE_TEST_X;
  }

  return alias === 'p' ? ChainId.AVALANCHE_P : ChainId.AVALANCHE_X;
};
