import Joi from 'joi';

import { AnalyticsConsent, Languages, ViewMode, ColorTheme } from '@core/types';
import { ChainId, NetworkContractToken } from '@avalabs/core-chains-sdk';

const VERSION = 3;

export type PreviousSchema = {
  currency?: string;
  customTokens?: {
    [chain: string]: {
      [tokenAddress: string]: NetworkContractToken;
    };
  };
  showTokensWithoutBalances?: boolean;
  theme?: ColorTheme;
  tokensVisibility?: {
    [key: string]: boolean;
  };
  collectiblesVisibility?: {
    [key: string]: boolean;
  };
  analyticsConsent?: AnalyticsConsent;
  language: Languages;
  preferredView: ViewMode;
  showTrendingTokens: boolean;
};

const previousSchema = Joi.object();

// The previous schema was a flat list of token addresses without saving which chain the settings are for.
// To simplify the migration and prevent dependencies on other services we are setting the token configuration
// for the 2 most prevalent EVM chains: C-chain and Ethereum.
const up = async (settingsStorage: PreviousSchema) => {
  const tokenAddresses = Object.keys(
    settingsStorage?.tokensVisibility ?? {},
  ).reduce((acc, key) => {
    acc[key] = settingsStorage?.tokensVisibility?.[key];
    return acc;
  }, {});

  const collectibleAddresses = Object.keys(
    settingsStorage?.collectiblesVisibility ?? {},
  ).reduce((acc, key) => {
    acc[key] = settingsStorage?.collectiblesVisibility?.[key];
    return acc;
  }, {});

  return {
    ...settingsStorage,
    tokensVisibility: {
      [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: tokenAddresses,
      [`eip155:1`]: tokenAddresses,
    },
    collectiblesVisibility: {
      [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: collectibleAddresses,
      [`eip155:1`]: collectibleAddresses,
    },
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
