import Joi from 'joi';
import { Network } from '@avalabs/core-chains-sdk';
import { defaultEnabledNetworks } from '~/services/network/consts';
const VERSION = 3;

const defaultEnableNetworksDeletable = [
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

  const optionalNetworks = favoriteNetworks
    .filter(
      (network) =>
        !defaultEnabledNetworks.includes(network) &&
        !defaultEnableNetworksDeletable.includes(network),
    )
    .concat(defaultEnableNetworksDeletable);

  return {
    ...networkStorage,
    enabledNetworks: optionalNetworks,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
