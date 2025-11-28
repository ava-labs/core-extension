import { ChainId } from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId } from '@core/types';
import { getNetworkCount } from './networkCount';

describe('getNetworkCount', () => {
  const mockCChainNetwork = {
    chainId: ChainId.AVALANCHE_MAINNET_ID,
    chainName: 'Avalanche C-Chain',
    vmName: 'EVM',
    caipId: 'eip155:43114',
    logoUri: 'avax-logo.png',
  } as NetworkWithCaipId;

  const mockPChainNetwork = {
    chainId: ChainId.AVALANCHE_P,
    chainName: 'Avalanche P-Chain',
    vmName: 'PVM',
    caipId: 'avax:43114-p',
    logoUri: 'p-logo.png',
  } as NetworkWithCaipId;

  const mockBitcoinNetwork = {
    chainId: ChainId.BITCOIN,
    chainName: 'Bitcoin',
    vmName: 'BITCOIN',
    caipId: 'bip122:000000000019d6689c085ae165831e93',
    logoUri: 'btc-logo.png',
  } as NetworkWithCaipId;

  const mockEthereumNetwork = {
    chainId: ChainId.ETHEREUM_HOMESTEAD,
    chainName: 'Ethereum',
    vmName: 'EVM',
    caipId: 'eip155:1',
    logoUri: 'eth-logo.png',
  } as NetworkWithCaipId;

  it('returns 0 for empty networks object', () => {
    const result = getNetworkCount({});
    expect(result).toBe(0);
  });

  it('returns 0 for accounts with empty network arrays', () => {
    const result = getNetworkCount({
      'account-1': [],
      'account-2': [],
    });
    expect(result).toBe(0);
  });

  it('returns correct count for single account with single network', () => {
    const result = getNetworkCount({
      'account-1': [mockCChainNetwork],
    });
    expect(result).toBe(1);
  });

  it('returns correct count for single account with multiple networks', () => {
    const result = getNetworkCount({
      'account-1': [mockCChainNetwork, mockBitcoinNetwork, mockEthereumNetwork],
    });
    expect(result).toBe(3);
  });

  it('returns correct count for multiple accounts with different networks', () => {
    const result = getNetworkCount({
      'account-1': [mockCChainNetwork, mockBitcoinNetwork],
      'account-2': [mockPChainNetwork, mockEthereumNetwork],
    });
    expect(result).toBe(4);
  });

  it('counts duplicate networks across accounts only once', () => {
    const result = getNetworkCount({
      'account-1': [mockCChainNetwork, mockBitcoinNetwork],
      'account-2': [mockCChainNetwork, mockEthereumNetwork],
      'account-3': [mockBitcoinNetwork],
    });
    // C-Chain, Bitcoin, Ethereum = 3 unique networks
    expect(result).toBe(3);
  });

  it('handles mixed empty and non-empty account arrays', () => {
    const result = getNetworkCount({
      'account-1': [],
      'account-2': [mockCChainNetwork, mockBitcoinNetwork],
      'account-3': [],
      'account-4': [mockPChainNetwork],
    });
    expect(result).toBe(3);
  });

  it('counts all unique networks when multiple accounts share some networks', () => {
    const result = getNetworkCount({
      'account-1': [mockCChainNetwork, mockPChainNetwork],
      'account-2': [mockCChainNetwork, mockBitcoinNetwork],
      'account-3': [mockPChainNetwork, mockEthereumNetwork],
      'account-4': [mockBitcoinNetwork, mockEthereumNetwork],
    });
    // C-Chain, P-Chain, Bitcoin, Ethereum = 4 unique networks
    expect(result).toBe(4);
  });

  it('handles accounts with same network repeated', () => {
    const result = getNetworkCount({
      'account-1': [mockCChainNetwork, mockCChainNetwork, mockBitcoinNetwork],
    });
    // C-Chain and Bitcoin = 2 unique networks (duplicates within account ignored)
    expect(result).toBe(2);
  });
});
