import Joi from 'joi';
import { ChainId } from '@avalabs/core-chains-sdk';

import {
  AnalyticsConsent,
  Languages,
  ThemeVariant,
} from '@src/background/services/settings/models';

import settings_v2 from './settings_v2';

describe('background/services/storage/schemaMigrations/migrations/settings_v2', () => {
  const validInputRich = {
    currency: 'USD',
    customTokens: {
      '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238': {
        name: 'USDC',
        chainId: ChainId.ETHEREUM_TEST_SEPOLIA,
        symbol: 'USDC',
        decimals: 6,
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        contractType: 'ERC-20' as const,
      },
    },
    showTokensWithoutBalances: false,
    theme: ThemeVariant.DARK,
    tokensVisibility: {},
    collectiblesVisibility: {},
    analyticsConsent: true,
    language: Languages.EN,
  };

  const validInputPoor = {
    analyticsConsent: true,
    language: Languages.EN,
  };

  it('accepts correct inputs', () => {
    expect(settings_v2.previousSchema.validate(validInputRich)).toEqual({
      error: undefined,
      value: validInputRich,
    });
    expect(settings_v2.previousSchema.validate(validInputPoor)).toEqual({
      error: undefined,
      value: validInputPoor,
    });
  });

  it('rejects incorrect inputs', () => {
    const invalidInput = ['foo'];
    const result = settings_v2.previousSchema.validate(invalidInput);

    expect(result).toEqual({
      value: invalidInput,
      error: expect.any(Joi.ValidationError),
    });
  });

  it('migrates to v2 successfully', async () => {
    expect(await settings_v2.up(validInputPoor)).toStrictEqual({
      ...validInputPoor,
      analyticsConsent: AnalyticsConsent.Pending,
      version: 2,
    });

    expect(await settings_v2.up(validInputRich)).toStrictEqual({
      ...validInputRich,
      analyticsConsent: AnalyticsConsent.Pending,
      version: 2,
    });
  });
});
