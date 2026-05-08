import Joi from 'joi';
import { Network } from '@avalabs/core-chains-sdk';

const VERSION = 6;

type PreviousSchema = {
  customNetworks: Record<number, Network>;
  dappScopes: Record<string, string>;
  networkAvailability: {
    [chainId: number]: {
      isEnabled: boolean;
    };
  };
};

type NewSchema = PreviousSchema & {
  avalancheDevnetMode: {
    enabled: boolean;
    rpcUrl: string;
    explorerUrl?: string;
  };
  version: typeof VERSION;
};
const previousSchema = Joi.object();

const up = async (networkStorage: PreviousSchema): Promise<NewSchema> => {
  return {
    ...networkStorage,
    avalancheDevnetMode: {
      enabled: false,
      rpcUrl: 'http://localhost:9650',
      explorerUrl: 'https://explorer-xp.avax-dev.network/',
    },
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
