import Joi from 'joi';

export type PreviousSchema = {
  balances?: {
    [networkId: string | number]: {
      [accountAddress: string]: {
        [tokenAddressOrSymbol: string]: Record<string, unknown>;
      };
    };
  };
};

const VERSION = 3;
const POLYGON_CHAIN_ID = 137;
const previousSchema = Joi.object();

/**
 * Polygon changed the name of their native token from MATIC to POL.
 * We need to remove MATIC from cache so we don't show it twice.
 */
const up = async (cache: PreviousSchema) => {
  const oldBalances = cache.balances;
  const oldPolygonBalances = oldBalances?.[POLYGON_CHAIN_ID];

  if (!oldPolygonBalances) {
    return oldBalances;
  }

  const newPolygonBalances = Object.fromEntries(
    Object.entries(oldPolygonBalances).map(([address, addressBalances]) => {
      const { MATIC, ...addressBalancesWithoutMatic } = addressBalances;

      return [address, addressBalancesWithoutMatic];
    }),
  );

  return {
    ...cache,
    balances: {
      ...oldBalances,
      [POLYGON_CHAIN_ID]: newPolygonBalances,
    },
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
