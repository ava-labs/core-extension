import { NetworkVMType } from '@avalabs/vm-module-types';
import type { Network } from '@core/types';
import {
  getEthNativeSymbolForKnownChainId,
  withDefaultNativeTokenSymbol,
} from './withDefaultNativeTokenSymbol';

function createEvmNetwork(
  chainId: number,
  networkToken: Network['networkToken'],
): Network {
  return {
    chainName: 'Test',
    chainId,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'https://rpc.example',
    explorerUrl: 'https://explorer.example',
    networkToken,
    logoUri: 'https://logo.example',
  };
}

describe('getEthNativeSymbolForKnownChainId', () => {
  it('returns ETH for Base', () => {
    expect(getEthNativeSymbolForKnownChainId(8453)).toBe('ETH');
  });

  it('returns ETH for Ethereum mainnet', () => {
    expect(getEthNativeSymbolForKnownChainId(1)).toBe('ETH');
  });

  it('returns undefined for unrelated chains', () => {
    expect(getEthNativeSymbolForKnownChainId(137)).toBeUndefined();
  });
});

describe('withDefaultNativeTokenSymbol', () => {
  it('fills ETH for Base when symbol is missing', () => {
    const base = createEvmNetwork(8453, {
      name: '',
      symbol: '',
      description: '',
      decimals: 18,
      logoUri: '',
    });
    const result = withDefaultNativeTokenSymbol(base);
    expect(result.networkToken.symbol).toBe('ETH');
    expect(result.networkToken.name).toBe('Ether');
  });

  it('fills ETH for Base when networkToken is null (malformed tokenlist)', () => {
    const base = {
      ...createEvmNetwork(8453, {
        name: '',
        symbol: '',
        description: '',
        decimals: 18,
        logoUri: '',
      }),
      networkToken: null as unknown as Network['networkToken'],
    };
    const result = withDefaultNativeTokenSymbol(base as Network);
    expect(result.networkToken.symbol).toBe('ETH');
    expect(result.networkToken.name).toBe('Ether');
    expect(result.networkToken.decimals).toBe(18);
  });

  it('preserves non-empty symbol on Base', () => {
    const base = createEvmNetwork(8453, {
      name: 'Ether',
      symbol: 'ETH',
      description: '',
      decimals: 18,
      logoUri: '',
    });
    expect(withDefaultNativeTokenSymbol(base)).toBe(base);
  });

  it('does not change non–ETH-native EVM chains with empty symbol', () => {
    const polygonLike = createEvmNetwork(137, {
      name: '',
      symbol: '',
      description: '',
      decimals: 18,
      logoUri: '',
    });
    expect(withDefaultNativeTokenSymbol(polygonLike)).toBe(polygonLike);
  });

  it('fills ETH for Ethereum mainnet when symbol is missing', () => {
    const eth = createEvmNetwork(1, {
      name: '',
      symbol: '',
      description: '',
      decimals: 18,
      logoUri: '',
    });
    expect(withDefaultNativeTokenSymbol(eth).networkToken.symbol).toBe('ETH');
  });
});
