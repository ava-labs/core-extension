import { TokenType } from '@avalabs/fusion-sdk';

import { FUSION_HYPERCORE_CAIP_ID, HYPERCORE_CAIP_ID } from '@core/common';
import type { NetworkWithCaipId } from '@core/types';

import { getNetworksForTransfer } from './getNetworksForTransfer';

const hypercoreNetwork = {
  caipId: HYPERCORE_CAIP_ID,
  chainId: 9999,
  chainName: 'HyperCore',
} as NetworkWithCaipId;

const avaxNetwork = {
  caipId: 'eip155:43114',
  chainId: 43114,
  chainName: 'Avalanche',
} as NetworkWithCaipId;

describe('getNetworksForTransfer', () => {
  it('maps Fusion HyperCore CAIP ids back to the extension network registry', () => {
    const getNetwork = jest.fn((caipId: string) => {
      if (caipId === HYPERCORE_CAIP_ID) return hypercoreNetwork;
      if (caipId === 'eip155:43114') return avaxNetwork;
      return undefined;
    });

    const networks = getNetworksForTransfer(
      {
        sourceChain: {
          chainId: FUSION_HYPERCORE_CAIP_ID,
          chainName: 'HyperCore',
          rpcUrl: '',
          networkToken: {
            name: 'USDC',
            symbol: 'USDC',
            decimals: 8,
            type: TokenType.NATIVE,
          },
        },
        targetChain: {
          chainId: 'eip155:43114',
          chainName: 'Avalanche',
          rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
          networkToken: {
            name: 'Avalanche',
            symbol: 'AVAX',
            decimals: 18,
            type: TokenType.NATIVE,
          },
        },
        fees: [],
      } as unknown as Parameters<typeof getNetworksForTransfer>[0],
      getNetwork,
    );

    expect(getNetwork).toHaveBeenCalledWith(HYPERCORE_CAIP_ID);
    expect(getNetwork).toHaveBeenCalledWith('eip155:43114');
    expect(networks).toEqual([hypercoreNetwork, avaxNetwork]);
  });
});
