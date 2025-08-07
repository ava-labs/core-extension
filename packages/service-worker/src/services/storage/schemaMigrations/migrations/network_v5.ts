import Joi from 'joi';
import { ChainId, Network } from '@avalabs/core-chains-sdk';
const VERSION = 3;

type PreviousSchema = {
  favoriteNetworks: number[];
  customNetworks: Record<number, Network>;
  dappScopes: Record<string, string>;
};
const previousSchema = Joi.object();

const up = async (networkStorage: PreviousSchema) => {
  const { favoriteNetworks } = networkStorage;

  const defaultNetworks = [
    ChainId.AVALANCHE_MAINNET_ID,
    ChainId.AVALANCHE_TESTNET_ID,
    ChainId.AVALANCHE_P,
    ChainId.AVALANCHE_TEST_P,
    ChainId.BITCOIN,
    ChainId.BITCOIN_TESTNET,
    ChainId.ETHEREUM_HOMESTEAD,
    ChainId.ETHEREUM_TEST_SEPOLIA,
    ChainId.SOLANA_MAINNET_ID,
    ChainId.SOLANA_DEVNET_ID,
  ];

  const optionalNetworks = favoriteNetworks.filter(
    (network) => !defaultNetworks.includes(network),
  );

  return {
    ...networkStorage,
    enabledNetworks: {
      default: defaultNetworks,
      optional: optionalNetworks,
    },
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
