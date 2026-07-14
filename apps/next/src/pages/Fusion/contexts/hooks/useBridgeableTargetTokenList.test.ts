import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { type BridgeableUiAsset, TokenType } from '@avalabs/fusion-sdk';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';

import { type NetworkWithCaipId } from '@core/types';

import { mapBridgeableAsset } from './useBridgeableTargetTokenList';

const nativeBridgeableAsset = (
  overrides: Partial<BridgeableUiAsset> = {},
): BridgeableUiAsset =>
  ({
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    type: TokenType.NATIVE,
    ...overrides,
  }) as BridgeableUiAsset;

const network = (
  overrides: Partial<NetworkWithCaipId> = {},
): NetworkWithCaipId =>
  ({
    chainId: ChainId.AVALANCHE_MAINNET_ID,
    chainName: 'Avalanche',
    caipId: 'eip155:43114',
    vmName: NetworkVMType.EVM,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    networkToken: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      logoUri: 'network-token-logo.svg',
      description: 'Avalanche native token',
    },
    logoUri: 'network-logo.svg',
    ...overrides,
  }) as NetworkWithCaipId;

describe('mapBridgeableAsset', () => {
  it('uses destination network decimals for P/X native AVAX', () => {
    const token = mapBridgeableAsset(
      nativeBridgeableAsset({ decimals: 18 }),
      network({
        chainId: ChainId.AVALANCHE_X,
        caipId: 'avax:x-chain',
        vmName: NetworkVMType.AVM,
        networkToken: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 9,
          logoUri: 'x-chain-avax-logo.svg',
          description: 'Avalanche native token',
        },
      }),
      'c-chain-avax-logo.svg',
    );

    expect(token).toMatchObject({
      type: VmTokenType.NATIVE,
      assetType: 'avm_native',
      decimals: 9,
    });
  });
});
