import Joi from 'joi';
import { ChainId, Network } from '@avalabs/core-chains-sdk';
import { runtime } from 'webextension-polyfill';
import { chainIdToCaip } from '@avalabs/core-ext-utils';

const VERSION = 4;

type PreviousSchema = {
  activeNetworkId: number | null;
  favoriteNetworks: number[];
  customNetworks: Record<number, Network>;
};
const previousSchema = Joi.object();

const up = async (networkStorage: PreviousSchema) => {
  const { activeNetworkId, ...storage } = networkStorage;

  const scope = chainIdToCaip(activeNetworkId ?? ChainId.AVALANCHE_MAINNET_ID);

  return {
    ...storage,
    dAppScopes: {
      [runtime.id]: scope,
    },
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
