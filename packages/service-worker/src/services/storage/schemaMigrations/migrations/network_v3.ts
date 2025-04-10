import Joi from 'joi';
import { ChainId, Network } from '@avalabs/core-chains-sdk';
const VERSION = 3;

type PreviousSchema = {
  activeNetworkId: number | null;
  favoriteNetworks: number[];
  customNetworks: Record<number, Network>;
};
const previousSchema = Joi.object();

/**
 * Get the new chainId for a given old id
 * @param oldId
 */
function getNewChainId(oldId: number) {
  switch (oldId) {
    case ChainId.AVALANCHE_XP:
      return ChainId.AVALANCHE_P;
    case ChainId.AVALANCHE_TEST_XP:
      return ChainId.AVALANCHE_TEST_P;
  }
  return oldId;
}

const up = async (networkStorage: PreviousSchema) => {
  const favoriteNetworks = networkStorage.favoriteNetworks.map(getNewChainId);

  let activeNetworkId = networkStorage.activeNetworkId;
  if (activeNetworkId) {
    activeNetworkId = getNewChainId(activeNetworkId);
  }

  return {
    ...networkStorage,
    favoriteNetworks,
    activeNetworkId,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
