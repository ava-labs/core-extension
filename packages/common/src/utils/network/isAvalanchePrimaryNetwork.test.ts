import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId } from '@core/types';
import { isAvalanchePrimaryNetwork } from './isAvalanchePrimaryNetwork';

describe('isAvalanchePrimaryNetwork', () => {
  const createMockNetwork = (
    chainId: number,
    vmName: NetworkVMType = NetworkVMType.EVM,
  ): NetworkWithCaipId => ({
    chainName: 'test',
    chainId,
    vmName,
    rpcUrl: 'rpcUrl',
    explorerUrl: 'https://explorer.url',
    networkToken: {
      name: 'networkTokenName',
      symbol: 'TEST',
      description: 'networkToken description',
      decimals: 18,
      logoUri: 'networkToken.logo.uri',
    },
    logoUri: 'logoUri',
    caipId: `eip155:${chainId}`,
  });

  it('should return false if network is undefined', () => {
    const result = isAvalanchePrimaryNetwork(undefined);
    expect(result).toBe(false);
  });

  it('should return true for Avalanche C-Chain mainnet', () => {
    const network = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
    const result = isAvalanchePrimaryNetwork(network);
    expect(result).toBe(true);
  });

  it('should return true for Avalanche C-Chain testnet', () => {
    const network = createMockNetwork(ChainId.AVALANCHE_TESTNET_ID);
    const result = isAvalanchePrimaryNetwork(network);
    expect(result).toBe(true);
  });

  it('should return true for P-Chain mainnet', () => {
    const network = createMockNetwork(ChainId.AVALANCHE_P, NetworkVMType.PVM);
    const result = isAvalanchePrimaryNetwork(network);
    expect(result).toBe(true);
  });

  it('should return true for P-Chain testnet', () => {
    const network = createMockNetwork(
      ChainId.AVALANCHE_TEST_P,
      NetworkVMType.PVM,
    );
    const result = isAvalanchePrimaryNetwork(network);
    expect(result).toBe(true);
  });

  it('should return true for X-Chain mainnet', () => {
    const network = createMockNetwork(ChainId.AVALANCHE_X, NetworkVMType.AVM);
    const result = isAvalanchePrimaryNetwork(network);
    expect(result).toBe(true);
  });

  it('should return true for X-Chain testnet', () => {
    const network = createMockNetwork(
      ChainId.AVALANCHE_TEST_X,
      NetworkVMType.AVM,
    );
    const result = isAvalanchePrimaryNetwork(network);
    expect(result).toBe(true);
  });

  it('should return false for Bitcoin network', () => {
    const network = createMockNetwork(ChainId.BITCOIN);
    const result = isAvalanchePrimaryNetwork(network);
    expect(result).toBe(false);
  });

  it('should return false for Ethereum network', () => {
    const network = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
    const result = isAvalanchePrimaryNetwork(network);
    expect(result).toBe(false);
  });

  it('should return false for other EVM networks', () => {
    const network = createMockNetwork(12345);
    const result = isAvalanchePrimaryNetwork(network);
    expect(result).toBe(false);
  });
});
