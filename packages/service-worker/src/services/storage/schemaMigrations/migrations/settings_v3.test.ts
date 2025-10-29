import Joi from 'joi';
import { ChainId } from '@avalabs/core-chains-sdk';

import { AnalyticsConsent, Languages, ViewMode, ColorTheme } from '@core/types';

import settings_v3, { PreviousSchema } from './settings_v3';

describe('background/services/storage/schemaMigrations/migrations/settings_v3', () => {
  const mockTokensVisibility = {
    '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238': true,
    '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e': false,
  };

  const mockCollectiblesVisibility = {
    '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d': true,
    '0x60e4d786628fea6478f785a6d7e704777c86a7c6': false,
  };

  const validInputRich: PreviousSchema = {
    currency: 'USD',
    customTokens: {
      '43114': {
        '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238': {
          name: 'USDC',
          chainId: ChainId.AVALANCHE_MAINNET_ID,
          symbol: 'USDC',
          decimals: 6,
          address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
          contractType: 'ERC-20' as const,
        },
      },
    },
    showTokensWithoutBalances: false,
    theme: 'DARK',
    tokensVisibility: mockTokensVisibility,
    collectiblesVisibility: mockCollectiblesVisibility,
    analyticsConsent: AnalyticsConsent.Approved,
    language: Languages.EN,
    preferredView: 'floating' as ViewMode,
    showTrendingTokens: true,
  };

  const validInputMinimal: PreviousSchema = {
    language: Languages.EN,
    preferredView: 'floating' as ViewMode,
    showTrendingTokens: true,
  };

  const validInputWithEmptyVisibility: PreviousSchema = {
    language: Languages.EN,
    preferredView: 'floating' as ViewMode,
    showTrendingTokens: true,
    tokensVisibility: {},
    collectiblesVisibility: {},
  };

  const validInputOnlyTokensVisibility: PreviousSchema = {
    language: Languages.EN,
    preferredView: 'floating' as ViewMode,
    showTrendingTokens: true,
    tokensVisibility: mockTokensVisibility,
  };

  const validInputOnlyCollectiblesVisibility: PreviousSchema = {
    language: Languages.EN,
    preferredView: 'floating' as ViewMode,
    showTrendingTokens: true,
    collectiblesVisibility: mockCollectiblesVisibility,
  };

  const validInputWithUndefinedVisibility: PreviousSchema = {
    language: Languages.EN,
    preferredView: 'floating' as ViewMode,
    showTrendingTokens: true,
    tokensVisibility: undefined,
    collectiblesVisibility: undefined,
  };

  it('accepts correct inputs', () => {
    expect(settings_v3.previousSchema.validate(validInputRich)).toEqual({
      error: undefined,
      value: validInputRich,
    });
    expect(settings_v3.previousSchema.validate(validInputMinimal)).toEqual({
      error: undefined,
      value: validInputMinimal,
    });
    expect(
      settings_v3.previousSchema.validate(validInputWithEmptyVisibility),
    ).toEqual({
      error: undefined,
      value: validInputWithEmptyVisibility,
    });
    expect(
      settings_v3.previousSchema.validate(validInputOnlyTokensVisibility),
    ).toEqual({
      error: undefined,
      value: validInputOnlyTokensVisibility,
    });
    expect(
      settings_v3.previousSchema.validate(validInputOnlyCollectiblesVisibility),
    ).toEqual({
      error: undefined,
      value: validInputOnlyCollectiblesVisibility,
    });
  });

  it('rejects incorrect inputs', () => {
    const invalidInput = ['foo'];
    const result = settings_v3.previousSchema.validate(invalidInput);

    expect(result).toEqual({
      value: invalidInput,
      error: expect.any(Joi.ValidationError),
    });
  });

  it('migrates settings with rich data to v3 successfully', async () => {
    const result = await settings_v3.up(validInputRich);

    expect(result).toStrictEqual({
      ...validInputRich,
      tokensVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: mockTokensVisibility,
        [`eip155:1`]: mockTokensVisibility,
      },
      collectiblesVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: mockCollectiblesVisibility,
        [`eip155:1`]: mockCollectiblesVisibility,
      },
      version: 3,
    });
  });

  it('migrates minimal settings to v3 successfully', async () => {
    const result = await settings_v3.up(validInputMinimal);

    expect(result).toStrictEqual({
      ...validInputMinimal,
      tokensVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {},
        [`eip155:1`]: {},
      },
      collectiblesVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {},
        [`eip155:1`]: {},
      },
      version: 3,
    });
  });

  it('migrates settings with empty visibility objects to v3 successfully', async () => {
    const result = await settings_v3.up(validInputWithEmptyVisibility);

    expect(result).toStrictEqual({
      ...validInputWithEmptyVisibility,
      tokensVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {},
        [`eip155:1`]: {},
      },
      collectiblesVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {},
        [`eip155:1`]: {},
      },
      version: 3,
    });
  });

  it('migrates settings with only tokens visibility to v3 successfully', async () => {
    const result = await settings_v3.up(validInputOnlyTokensVisibility);

    expect(result).toStrictEqual({
      ...validInputOnlyTokensVisibility,
      tokensVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: mockTokensVisibility,
        [`eip155:1`]: mockTokensVisibility,
      },
      collectiblesVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {},
        [`eip155:1`]: {},
      },
      version: 3,
    });
  });

  it('migrates settings with only collectibles visibility to v3 successfully', async () => {
    const result = await settings_v3.up(validInputOnlyCollectiblesVisibility);

    expect(result).toStrictEqual({
      ...validInputOnlyCollectiblesVisibility,
      tokensVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {},
        [`eip155:1`]: {},
      },
      collectiblesVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: mockCollectiblesVisibility,
        [`eip155:1`]: mockCollectiblesVisibility,
      },
      version: 3,
    });
  });

  it('migrates settings with undefined visibility objects to v3 successfully', async () => {
    const result = await settings_v3.up(validInputWithUndefinedVisibility);

    expect(result).toStrictEqual({
      ...validInputWithUndefinedVisibility,
      tokensVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {},
        [`eip155:1`]: {},
      },
      collectiblesVisibility: {
        [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: {},
        [`eip155:1`]: {},
      },
      version: 3,
    });
  });

  it('preserves all other properties during migration', async () => {
    const inputWithExtraProperties: PreviousSchema & {
      customProperty: string;
    } = {
      ...validInputRich,
      currency: 'EUR',
      showTokensWithoutBalances: true,
      theme: 'LIGHT' as ColorTheme,
      analyticsConsent: AnalyticsConsent.Denied,
      language: Languages.FR,
      preferredView: 'sidebar' as ViewMode,
      showTrendingTokens: false,
      customProperty: 'should be preserved',
    };

    const result = await settings_v3.up(inputWithExtraProperties);

    // Check that all original properties are preserved
    expect(result.currency).toBe('EUR');
    expect(result.showTokensWithoutBalances).toBe(true);
    expect(result.theme).toBe('LIGHT');
    expect(result.analyticsConsent).toBe(AnalyticsConsent.Denied);
    expect(result.language).toBe(Languages.FR);
    expect(result.preferredView).toBe('sidebar');
    expect(result.showTrendingTokens).toBe(false);
    expect((result as any).customProperty).toBe('should be preserved');
    expect(result.version).toBe(3);

    // Check that visibility objects are migrated correctly
    expect(result.tokensVisibility).toEqual({
      [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: mockTokensVisibility,
      [`eip155:1`]: mockTokensVisibility,
    });
    expect(result.collectiblesVisibility).toEqual({
      [`eip155:${ChainId.AVALANCHE_MAINNET_ID}`]: mockCollectiblesVisibility,
      [`eip155:1`]: mockCollectiblesVisibility,
    });
  });
});
