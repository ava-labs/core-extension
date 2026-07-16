import { NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  HYPERCORE_CHAIN_ID,
  HYPEREVM_CHAIN_ID,
  isHypercoreNetwork,
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
        chainName: 'Some EVM Network',
      }),
    ).toBe(true);
  });

  it('identifies HyperEVM by chain name', () => {
    expect(
      isHyperliquidNetwork({
        ...baseNetwork,
        chainId: 1,
        chainName: 'HyperEVM',
      }),
    ).toBe(true);
  });

  it('identifies HyperCore by chain name only', () => {
    expect(
      isHyperliquidNetwork({
        ...baseNetwork,
        chainId: 42,
        chainName: 'HyperCore',
      }),
    ).toBe(true);
  });

  it('does not treat arbitrary networks as Hyperliquid', () => {
    expect(
      isHyperliquidNetwork({
        ...baseNetwork,
        chainId: 1337,
        chainName: 'Local Devnet',
      }),
    ).toBe(false);
  });
});

describe('isHypercoreNetwork', () => {
  it('returns false for undefined network', () => {
    expect(isHypercoreNetwork(undefined)).toBe(false);
  });

  it('identifies HyperCore by chain name', () => {
    expect(
      isHypercoreNetwork({
        ...baseNetwork,
        chainId: 1,
        chainName: 'HyperCore',
      }),
    ).toBe(true);
  });

  it('identifies HyperCore by synthetic chain id', () => {
    expect(
      isHypercoreNetwork({
        ...baseNetwork,
        chainId: HYPERCORE_CHAIN_ID,
        chainName: 'Something else',
      }),
    ).toBe(true);
  });

  it('identifies HyperCore by CAIP id', () => {
    expect(
      isHypercoreNetwork({
        ...baseNetwork,
        chainId: 1,
        chainName: 'Something else',
        caip2Id: 'hlcore:mainnet',
      }),
    ).toBe(true);
    expect(
      isHypercoreNetwork({
        ...baseNetwork,
        chainId: 1,
        chainName: 'Something else',
        caipId: 'hlcore:mainnet',
      }),
    ).toBe(true);
  });

  it('does not treat HyperEVM as HyperCore', () => {
    expect(
      isHypercoreNetwork({
        ...baseNetwork,
        chainId: HYPEREVM_CHAIN_ID,
        chainName: 'HyperEVM',
      }),
    ).toBe(false);
  });
});

describe('isHyperliquidChainId', () => {
  it('returns true only for HyperEVM chain id', () => {
    expect(isHyperliquidChainId(HYPEREVM_CHAIN_ID)).toBe(true);
    expect(isHyperliquidChainId(1337)).toBe(false);
  });
});
