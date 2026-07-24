import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { Network } from '@core/types';

import {
  ROBINHOOD_MAINNET_CHAIN_ID,
  ROBINHOOD_TESTNET_CHAIN_ID,
} from '../network/isRobinhoodNetwork';
import { isEthereumAppRequired } from './isEthereumAppRequired';

const baseNetwork: Network = {
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

describe('isEthereumAppRequired', () => {
  it('returns true for Ethereum mainnet', () => {
    expect(
      isEthereumAppRequired({
        ...baseNetwork,
        chainId: ChainId.ETHEREUM_HOMESTEAD,
      }),
    ).toBe(true);
  });

  it('returns true for Ethereum testnets', () => {
    expect(
      isEthereumAppRequired({
        ...baseNetwork,
        chainId: ChainId.ETHEREUM_TEST_SEPOLIA,
      }),
    ).toBe(true);
  });

  it('returns true for Robinhood mainnet', () => {
    expect(
      isEthereumAppRequired({
        ...baseNetwork,
        chainId: ROBINHOOD_MAINNET_CHAIN_ID,
        chainName: 'Robinhood',
      }),
    ).toBe(true);
  });

  it('returns true for Robinhood testnet', () => {
    expect(
      isEthereumAppRequired({
        ...baseNetwork,
        chainId: ROBINHOOD_TESTNET_CHAIN_ID,
        chainName: 'Robinhood Testnet',
      }),
    ).toBe(true);
  });

  it('returns false for non-Ethereum, non-Robinhood networks', () => {
    expect(
      isEthereumAppRequired({
        ...baseNetwork,
        chainId: ChainId.AVALANCHE_MAINNET_ID,
        chainName: 'Avalanche',
      }),
    ).toBe(false);

    expect(
      isEthereumAppRequired({
        ...baseNetwork,
        chainId: 1337,
        chainName: 'Local Devnet',
      }),
    ).toBe(false);
  });
});
