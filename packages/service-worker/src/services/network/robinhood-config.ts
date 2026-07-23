import { NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  ROBINHOOD_MAINNET_CHAIN_ID,
  ROBINHOOD_TESTNET_CHAIN_ID,
} from '@core/common';
import { NetworkWithCaipId } from '@core/types';

const ETH_CONTENTFUL_LOGO_URL =
  'https://images.ctfassets.net/gcj8jwzm6086/6l56QLVZmvacuBfjHBTThP/791d743dd2c526692562780c2325fedf/eth-circle__1_.svg';

const ROBINHOOD_CHAIN_LOGO_URL =
  'https://images.ctfassets.net/gcj8jwzm6086/2PBxVg0TxrKFRCJqOlJomm/b421214db7aec4985b406e996e5c4c19/robinhood.png';

// TODO(@meeh0w): remove the static configs once the feature goes live and everything lives in Contentful
export const ROBINHOOD_MAINNET_CHAIN_INFO: NetworkWithCaipId = {
  description:
    'Robinhood Chain is a permissionless, Ethereum-compatible Layer-2 blockchain built for tokenized real-world assets.',
  explorerUrl: 'https://robinhoodchain.blockscout.com',
  isTestnet: false,
  logoUri: ROBINHOOD_CHAIN_LOGO_URL,
  chainName: 'Robinhood Chain',
  chainId: ROBINHOOD_MAINNET_CHAIN_ID,
  networkToken: {
    description: 'Ether',
    decimals: 18,
    logoUri: ETH_CONTENTFUL_LOGO_URL,
    name: 'Ether',
    symbol: 'ETH',
  },
  primaryColor: '#00C900',
  vmName: NetworkVMType.EVM,
  caipId: 'eip155:4663',
  rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
  utilityAddresses: {
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
  },
};

export const ROBINHOOD_TESTNET_CHAIN_INFO: NetworkWithCaipId = {
  description:
    'Robinhood Chain Testnet is an Ethereum-compatible Layer-2 test network.',
  explorerUrl: 'https://robinhoodchain.blockscout.com',
  isTestnet: true,
  logoUri: ROBINHOOD_CHAIN_LOGO_URL,
  chainName: 'Robinhood Chain Testnet',
  chainId: ROBINHOOD_TESTNET_CHAIN_ID,
  networkToken: {
    description: 'Ether',
    decimals: 18,
    logoUri: ETH_CONTENTFUL_LOGO_URL,
    name: 'Ether',
    symbol: 'ETH',
  },
  primaryColor: '#00C900',
  vmName: NetworkVMType.EVM,
  caipId: 'eip155:46630',
  rpcUrl: 'https://rpc.testnet.chain.robinhood.com',
  mainnetChainId: ROBINHOOD_MAINNET_CHAIN_ID,
  utilityAddresses: {
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
  },
};
