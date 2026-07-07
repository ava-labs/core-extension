import { NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  HYPERCORE_CHAIN_ID,
  HYPEREVM_CHAIN_ID,
  isHyperliquidChainId,
  isHyperliquidNetwork,
} from './isHyperliquidNetwork';

const baseNetwork = {
  chainId: 1,
  chainName: 'Ethereum',
  vmName: NetworkVMType.EVM,
  rpcUrl: 'https://rpc.example',
  explorerUrl: 'https://explorer.example',
  networkToken: {
    name: 'Ether',
    symbol: 'ETH',
    description: '',
    decimals: 18,
    logoUri: '',
  },
  logoUri: '',
};

describe('isHyperliquidNetwork', () => {
  it('returns false for undefined network', () => {
    expect(isHyperliquidNetwork(undefined)).toBe(false);
  });

  it('identifies HyperEVM by chain id', () => {
    expect(
      isHyperliquidNetwork({
        ...baseNetwork,
        chainId: HYPEREVM_CHAIN_ID,
        chainName: 'HyperEVM',
      }),
    ).toBe(true);
  });

  it('identifies HyperCore by chain name', () => {
    expect(
      isHyperliquidNetwork({
        ...baseNetwork,
        chainId: HYPERCORE_CHAIN_ID,
        chainName: 'HyperCore',
      }),
    ).toBe(true);
  });

  it('does not treat arbitrary chain id 1337 as Hyperliquid', () => {
    expect(
      isHyperliquidNetwork({
        ...baseNetwork,
        chainId: HYPERCORE_CHAIN_ID,
        chainName: 'Local Devnet',
      }),
    ).toBe(false);
  });
});

describe('isHyperliquidChainId', () => {
  it('returns true only for HyperEVM chain id', () => {
    expect(isHyperliquidChainId(HYPEREVM_CHAIN_ID)).toBe(true);
    expect(isHyperliquidChainId(HYPERCORE_CHAIN_ID)).toBe(false);
  });
});
