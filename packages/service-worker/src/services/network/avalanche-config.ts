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
  x: 'https://images.ctfassets.net/gcj8jwzm6086/5xiGm7IBR6G44eeVlaWrxi/1b253c4744a3ad21a278091e3119feba/xchain-square.svg',
  p: 'https://images.ctfassets.net/gcj8jwzm6086/42aMwoCLblHOklt6Msi6tm/1e64aa637a8cead39b2db96fe3225c18/pchain-square.svg',
};

export const getXPExplorerUrl = (
  type: Exclude<AvalancheNetworkType, 'devnet'>,
  alias: 'p' | 'x',
) => `${BASE_NETWORK_CONFIG_BY_TYPE[type].explorerUrl}${alias}-chain`;

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
