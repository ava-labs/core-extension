import Joi from 'joi';
import { Network } from '@avalabs/core-chains-sdk';
import { NETWORKS_ENABLED_FOREVER } from '@core/types';
const VERSION = 5;

export const defaultEnableNetworksDeletable = [
  42161, //Arbitrum One Mainnet
  10, //Optimism Mainnet
  8453, //Base Mainnet
];

type PreviousSchema = {
  favoriteNetworks: number[];
  customNetworks: Record<number, Network>;
  dappScopes: Record<string, string>;
};
const previousSchema = Joi.object();

const up = async (networkStorage: PreviousSchema) => {
  const { favoriteNetworks } = networkStorage;

  const enabledNetworks = favoriteNetworks
    .filter(
      (network) =>
        !NETWORKS_ENABLED_FOREVER.includes(network) &&
        !defaultEnableNetworksDeletable.includes(network),
    )
    .concat(defaultEnableNetworksDeletable);

  const networkAvailability = enabledNetworks.reduce((accumulator, network) => {
    accumulator[network] = { isEnabled: true };
    return accumulator;
  }, {}); // Initialize accumulator as an empty object

  return {
    ...networkStorage,
    networkAvailability,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
