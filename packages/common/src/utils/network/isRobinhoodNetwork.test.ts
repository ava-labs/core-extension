import { NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  ROBINHOOD_MAINNET_CHAIN_ID,
  ROBINHOOD_TESTNET_CHAIN_ID,
  isRobinhoodChainId,
  isRobinhoodNetwork,
} from './isRobinhoodNetwork';

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

describe('isRobinhoodChainId', () => {
  it('returns true for the mainnet chain id', () => {
    expect(isRobinhoodChainId(ROBINHOOD_MAINNET_CHAIN_ID)).toBe(true);
  });

  it('returns true for the testnet chain id', () => {
    expect(isRobinhoodChainId(ROBINHOOD_TESTNET_CHAIN_ID)).toBe(true);
  });

  it('returns false for arbitrary chain ids', () => {
    expect(isRobinhoodChainId(1)).toBe(false);
    expect(isRobinhoodChainId(1337)).toBe(false);
  });
});

describe('isRobinhoodNetwork', () => {
  it('returns false for undefined network', () => {
    expect(isRobinhoodNetwork(undefined)).toBe(false);
  });

  it('identifies Robinhood mainnet by chain id', () => {
    expect(
      isRobinhoodNetwork({
        ...baseNetwork,
        chainId: ROBINHOOD_MAINNET_CHAIN_ID,
        chainName: 'Robinhood',
      }),
    ).toBe(true);
  });

  it('identifies Robinhood testnet by chain id', () => {
    expect(
      isRobinhoodNetwork({
        ...baseNetwork,
        chainId: ROBINHOOD_TESTNET_CHAIN_ID,
        chainName: 'Robinhood Testnet',
      }),
    ).toBe(true);
  });

  it('does not treat arbitrary networks as Robinhood', () => {
    expect(
      isRobinhoodNetwork({
        ...baseNetwork,
        chainId: 1337,
        chainName: 'Local Devnet',
      }),
    ).toBe(false);
  });
});
