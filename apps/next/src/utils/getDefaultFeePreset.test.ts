import { ChainId } from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId } from '@core/types';

import { getDefaultFeePreset } from './getDefaultFeePreset';

const BASE_CHAIN_ID = 8453;
const OPTIMISM_CHAIN_ID = 10;

const networkWithChainId = (chainId: number) =>
  ({ chainId }) as NetworkWithCaipId;

describe('getDefaultFeePreset', () => {
  it.each([
    ChainId.AVALANCHE_MAINNET_ID,
    ChainId.AVALANCHE_TESTNET_ID,
    ChainId.AVALANCHE_LOCAL_ID,
  ])('returns high for Avalanche C-Chain %s', (chainId) => {
    expect(getDefaultFeePreset(networkWithChainId(chainId))).toBe('high');
  });

  it.each([ChainId.ETHEREUM_HOMESTEAD, BASE_CHAIN_ID, OPTIMISM_CHAIN_ID])(
    'returns medium for non-Avalanche EVM chain %s',
    (chainId) => {
      expect(getDefaultFeePreset(networkWithChainId(chainId))).toBe('medium');
    },
  );
});
