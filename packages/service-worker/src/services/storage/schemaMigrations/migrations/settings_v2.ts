import Joi from 'joi';

import {
  AnalyticsConsent,
  Languages,
  ThemeVariant,
  TokensVisibility,
  CollectiblesVisibility,
} from '@core/types/src/models';
import { NetworkContractToken } from '@avalabs/core-chains-sdk';

const VERSION = 2;

type PreviousSchema = {
  currency?: string;
  customTokens?: Record<string, NetworkContractToken>;
  showTokensWithoutBalances?: boolean;
  theme?: ThemeVariant;
  tokensVisibility?: TokensVisibility;
  collectiblesVisibility?: CollectiblesVisibility;
  analyticsConsent?: boolean;
  language?: Languages;
};

const previousSchema = Joi.object();

const up = async (settingsStorage: PreviousSchema) => {
  return {
    ...settingsStorage,
    analyticsConsent: AnalyticsConsent.Pending,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
