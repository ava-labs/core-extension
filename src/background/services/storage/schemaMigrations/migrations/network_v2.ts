import Joi from 'joi';
import type { Network } from '@avalabs/core-chains-sdk';
import { ChainId } from '@avalabs/core-chains-sdk';
const VERSION = 2;

enum OldChainIDs {
  BITCOIN = -1,
  BITCOIN_TESTNET = -2,
}

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
    case OldChainIDs.BITCOIN:
      return ChainId.BITCOIN;
    case OldChainIDs.BITCOIN_TESTNET:
      return ChainId.BITCOIN_TESTNET;
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
