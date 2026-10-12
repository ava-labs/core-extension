import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { type BridgeableUiAsset, TokenType } from '@avalabs/fusion-sdk';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';

import { type FungibleTokenBalance, type NetworkWithCaipId } from '@core/types';

import { getAvailableBalance } from '@/lib/getAvailableBalance';

import {
  mapBridgeableAsset,
  mergeTokenDetails,
} from './useBridgeableTargetTokenList';

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

describe('mergeTokenDetails', () => {
  const xChainNetwork = network({
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
  });

  it('merges token details keeping the original logo and description', () => {
    const token = mapBridgeableAsset(
      nativeBridgeableAsset({ extras: { isVerified: false } }),
      xChainNetwork,
      'c-chain-avax-logo.svg',
    )!;

    const userToken = {
      ...token,
      balance: 7_000_000_000n,
      balanceDisplayValue: '7',
      balanceInCurrency: 140,
      priceInCurrency: 20,
      available: 6_087_900_000n,
      availableDisplayValue: '6.0879',
      availableInCurrency: 121.76,
      balancePerType: { locked: 912_100_000n, unlocked: 6_087_900_000n },
      logoUri: 'x-chain-avax-logo.svg',
      description: 'Avalanche native token',
    } as FungibleTokenBalance;

    const merged = mergeTokenDetails(token, userToken);

    expect(merged).toStrictEqual({
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 9,
      type: VmTokenType.NATIVE,
      assetType: 'avm_native',
      coreChainId: ChainId.AVALANCHE_X,
      chainCaipId: 'avax:x-chain',
      reputation: null,
      balance: 7_000_000_000n,
      balanceDisplayValue: '7',
      balanceInCurrency: 140,
      priceInCurrency: 20,
      available: 6_087_900_000n,
      availableDisplayValue: '6.0879',
      availableInCurrency: 121.76,
      balancePerType: { locked: 912_100_000n, unlocked: 6_087_900_000n },
      description: 'Avalanche native token',
      logoUri: 'c-chain-avax-logo.svg',
      isVerified: false,
    });
    expect(getAvailableBalance(merged, false)).toBe(6_087_900_000n);
  });
});
