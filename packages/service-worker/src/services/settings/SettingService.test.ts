import {
  Network,
  NetworkContractToken,
  NetworkToken,
  NetworkVMType,
} from '@avalabs/core-chains-sdk';
import {
  AnalyticsConsent,
  CollectiblesVisibility,
  FeatureGates,
  Languages,
  SETTINGS_STORAGE_KEY,
  SETTINGS_UNENCRYPTED_STORAGE_KEY,
  SettingsEvents,
  SettingsState,
  TokensVisibility,
} from '@core/types';
import { changeLanguage } from 'i18next';
import { isTokenSupported } from '../tokens/utils/isTokenSupported';
import { SettingsService } from './SettingsService';

jest.mock('i18next', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('../tokens/utils/isTokenSupported', () => ({
  isTokenSupported: jest.fn(),
}));

describe('background/services/settings/SettingsService.ts', () => {
  const storageServiceMock = {
    load: jest.fn(),
    loadUnencrypted: jest.fn(),
    save: jest.fn(),
    saveUnencrypted: jest.fn(),
  } as any;

  const testNetworkToken: NetworkToken = {
    name: 'test network token',
    symbol: 'TNT',
    description: 'test network token description',
    decimals: 18,
    logoUri: 'test.network.token.com/logo',
  };

  const testNetwork: Network = {
    chainName: 'test chain',
    chainId: 123,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'test.chain.com/rpc',
    explorerUrl: 'https://explorer.url',
    networkToken: testNetworkToken,
    logoUri: 'test.chain.com/logo',
    primaryColor: 'orange',
  };

  const networkServiceMock = {
    uiActiveNetworkChanged: {
      add: jest.fn(),
    },
    activeNetwork: testNetwork,
    getNetwork: jest.fn(),
  } as any;

  const featureFlagServiceMock = {
    featureFlags: {
      [FeatureGates.LANGUAGES]: true,
      [FeatureGates.BALANCE_SERVICE_INTEGRATION]: true,
    },
  } as any;

  const storedSettings: SettingsState = {
    currency: 'EUR',
    customTokens: {},
    showTokensWithoutBalances: true,
    theme: 'DARK',
    tokensVisibility: {},
    collectiblesVisibility: {},
    analyticsConsent: AnalyticsConsent.Denied,
    language: Languages.DE,
    coreAssistant: true,
    preferredView: 'floating',
    showTrendingTokens: false,
    isDegenMode: false,
    feeSetting: 'low',
    maxBuy: '1000',
    privacyMode: false,
    filterSmallUtxos: true,
  };
  const storedUnencryptedSettings: SettingsState = {
    currency: 'USD',
    customTokens: {},
    showTokensWithoutBalances: false,
    theme: 'DARK',
    tokensVisibility: {},
    collectiblesVisibility: {},
    analyticsConsent: AnalyticsConsent.Approved,
    language: Languages.DE,
    coreAssistant: false,
    preferredView: 'floating',
    showTrendingTokens: false,
    isDegenMode: false,
    feeSetting: 'low',
    maxBuy: '1000',
    privacyMode: false,
    filterSmallUtxos: true,
  };

  const customToken: NetworkContractToken = {
    chainId: 1337,
    address: 'customTokenAddress',
    name: 'custom token',
    symbol: 'CT',
    contractType: 'ERC-20',
    decimals: 23,
  };
  let service;

  beforeEach(() => {
    jest.resetAllMocks();
    storageServiceMock.load.mockResolvedValue(storedSettings);
    storageServiceMock.loadUnencrypted.mockResolvedValue(
      storedUnencryptedSettings,
    );
    (isTokenSupported as jest.Mock).mockResolvedValue(false);
    featureFlagServiceMock.featureFlags[FeatureGates.LANGUAGES] = true;
    service = new SettingsService(
      storageServiceMock,
      networkServiceMock,
      featureFlagServiceMock,
    );

    jest.mocked(networkServiceMock.getNetwork).mockResolvedValue(testNetwork);
  });

  describe('getSettings', () => {
    it('should fetch the stored setting if there is no cached setting', async () => {
      const result = await service.getSettings();
      expect(result).toEqual(storedSettings);
      expect(storageServiceMock.loadUnencrypted).toBeCalledTimes(1);
      expect(storageServiceMock.load).toBeCalledTimes(1);
    });

    it('should return cached settings if it is available', async () => {
      // calling getSettings twice, but it should only fetch the value from storage once.
      await service.getSettings();
      const result = await service.getSettings();
      expect(result).toEqual(storedSettings);
      expect(storageServiceMock.loadUnencrypted).toBeCalledTimes(1);
      expect(storageServiceMock.load).toBeCalledTimes(1);
    });

    it('should fetch again when needToRetryFetch is true', async () => {
      storageServiceMock.load
        .mockRejectedValueOnce(new Error('error'))
        .mockResolvedValue(storedSettings);
      const result1 = await service.getSettings();
      expect(result1).toEqual(storedUnencryptedSettings);
      expect(storageServiceMock.loadUnencrypted).toBeCalledTimes(1);
      expect(storageServiceMock.load).toBeCalledTimes(1);
      const result2 = await service.getSettings();
      expect(result2).toEqual(storedSettings);
      expect(storageServiceMock.loadUnencrypted).toBeCalledTimes(2);
      expect(storageServiceMock.load).toBeCalledTimes(2);
    });
  });

  describe('onStorageReady', () => {
    it('should  emit setting updates when successful', async () => {
      const eventListener = jest.fn();
      service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

      await service.onStorageReady();

      // Checking if getSettings was called
      expect(storageServiceMock.loadUnencrypted).toBeCalledTimes(1);
      expect(storageServiceMock.load).toBeCalledTimes(1);

      expect(changeLanguage).toBeCalledTimes(1);
      expect(changeLanguage).toBeCalledWith(storedSettings.language);
      expect(eventListener).toHaveBeenCalledWith(storedSettings);
    });
  });

  it('should should not emit updates when failed to fetch settings', async () => {
    (changeLanguage as jest.Mock).mockImplementation(() => {
      throw new Error('error');
    });
    const eventListener = jest.fn();
    service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

    await service.onStorageReady();
    expect(eventListener).not.toHaveBeenCalled();
  });

  describe('onLock', () => {
    it('should set the cached settings to null', async () => {
      // Loading the cached value
      const result = await service.getSettings();
      expect(result).toEqual(storedSettings);
      expect(storageServiceMock.loadUnencrypted).toBeCalledTimes(1);
      expect(storageServiceMock.load).toBeCalledTimes(1);

      service.onLock();

      // Calling getSettings should trigger to fetch the settings since cached value should be now null.
      const result2 = await service.getSettings();
      expect(result2).toEqual(storedSettings);
      expect(storageServiceMock.loadUnencrypted).toBeCalledTimes(2);
      expect(storageServiceMock.load).toBeCalledTimes(2);
    });
  });

  // helper function
  const expectToOnlyEmitLanguageAfterFailedOperation = async (operation) => {
    storageServiceMock.save.mockRejectedValue(new Error('error'));
    const eventListener = jest.fn();
    service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);
    await operation();
    expect(eventListener).toHaveBeenCalledWith({
      language: storedSettings.language,
      preferredView: storedSettings.preferredView,
    });
  };

  describe('addCustomToken', () => {
    it('should save the new custom token properly', async () => {
      const eventListener = jest.fn();
      service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

      await service.addCustomToken(customToken);

      expect(storageServiceMock.saveUnencrypted).toBeCalledWith(
        SETTINGS_UNENCRYPTED_STORAGE_KEY,
        {
          language: storedSettings.language,
          preferredView: storedSettings.preferredView,
        },
      );

      const newState = {
        ...storedSettings,
        customTokens: {
          [testNetwork.chainId]: {
            [customToken.address.toLowerCase()]: customToken,
          },
        },
      };
      const { language, preferredView, ...encryptedState } = newState;
      expect(storageServiceMock.save).toBeCalledWith(
        SETTINGS_STORAGE_KEY,
        encryptedState,
      );

      expect(eventListener).toHaveBeenCalledWith(newState);
    });

    it('should throw an error if customToken is already supported', async () => {
      (isTokenSupported as jest.Mock).mockResolvedValue(true);
      const eventListener = jest.fn();
      service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

      try {
        await service.addCustomToken(customToken);
        fail('Should have thrown an error');
      } catch (e) {
        expect(e).toEqual(new Error('Token already exists in the wallet.'));
        expect(eventListener).not.toHaveBeenCalled();
      }
    });

    it('should emit only the language if it fails to save', async () => {
      await expectToOnlyEmitLanguageAfterFailedOperation(async () => {
        await service.addCustomToken(customToken);
      });
    });

    describe('setAnalyticsConsent', () => {
      it('should save the new value for analytics consent properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

        await service.setAnalyticsConsent(true);

        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          analyticsConsent: AnalyticsConsent.Approved,
        });
      });

      it('should emit only the language if it fails to save', async () => {
        await expectToOnlyEmitLanguageAfterFailedOperation(async () => {
          await service.setAnalyticsConsent(true);
        });
      });
    });

    describe('setCurrency', () => {
      it('should save the new value for currency properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

        await service.setCurrency('CHF');

        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          currency: 'CHF',
        });
      });

      it('should emit only the language if it fails to save', async () => {
        await expectToOnlyEmitLanguageAfterFailedOperation(async () => {
          await service.setCurrency('CHF');
        });
      });
    });

    describe('setShowTokensWithNoBalance', () => {
      it('should save the new value for show tokens with no balance properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

        await service.setShowTokensWithNoBalance(false);

        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          showTokensWithoutBalances: false,
        });
      });

      it('should emit only the language if it fails to save', async () => {
        await expectToOnlyEmitLanguageAfterFailedOperation(async () => {
          await service.setShowTokensWithNoBalance(false);
        });
      });
    });

    describe('setTheme', () => {
      it('should save the new value for theme properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

        await service.setTheme('LIGHT');

        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          theme: 'LIGHT',
        });
      });

      it('should emit only the language if it fails to save', async () => {
        await expectToOnlyEmitLanguageAfterFailedOperation(async () => {
          await service.setTheme('LIGHT');
        });
      });
    });

    describe('setTokensVisibility', () => {
      const visibility: TokensVisibility = {
        'eip155:1': {
          ETH: false,
        },
      };
      it('should save the new value for token visibility properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);
        await service.setTokensVisibility(visibility);
        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          tokensVisibility: visibility,
        });
      });

      it('should emit only the language if it fails to save', async () => {
        await expectToOnlyEmitLanguageAfterFailedOperation(async () => {
          await service.setTokensVisibility(visibility);
        });
      });
    });

    describe('setCollectiblesVisibility', () => {
      const visibility: CollectiblesVisibility = {
        'eip155:1': {
          '0x00000': false,
        },
      };
      it('should save the new value for collectible visibility properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);
        await service.setCollectiblesVisibility(visibility);
        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          collectiblesVisibility: visibility,
        });
      });

      it('should emit only the language if it fails to save', async () => {
        await expectToOnlyEmitLanguageAfterFailedOperation(async () => {
          await service.setCollectiblesVisibility(visibility);
        });
      });
    });

    describe('setLanguage', () => {
      it('should save the new value for language properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

        await service.setLanguage(Languages.HI);

        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          language: Languages.HI,
        });
      });

      it('should emit only the unencrypted settings if it fails to save', async () => {
        storageServiceMock.save.mockRejectedValue(new Error('error'));
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

        await service.setLanguage(Languages.HI);
        expect(eventListener).toHaveBeenCalledWith({
          language: Languages.HI,
          preferredView: storedSettings.preferredView,
        });
        expect(storageServiceMock.saveUnencrypted).toHaveBeenCalledWith(
          SETTINGS_UNENCRYPTED_STORAGE_KEY,
          {
            language: Languages.HI,
            preferredView: storedSettings.preferredView,
          },
        );
      });
    });

    describe('setCoreAssistant', () => {
      it('should save the core concierge properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

        await service.setCoreAssistant(true);

        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          coreAssistant: true,
        });
      });

      it('should emit only the core concierge if it fails to save', async () => {
        await expectToOnlyEmitLanguageAfterFailedOperation(async () => {
          await service.setCoreAssistant(true);
        });
      });
    });

    describe('setShowTrendingTokens', () => {
      it('should save the new value for show trending tokens properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

        await service.setShowTrendingTokens(true);

        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          showTrendingTokens: true,
        });
      });

      it('should emit only the language if it fails to save', async () => {
        await expectToOnlyEmitLanguageAfterFailedOperation(async () => {
          await service.setShowTrendingTokens(true);
        });
      });
    });

    describe('setPrivacyMode', () => {
      it('should save the new value for privacy mode properly', async () => {
        const eventListener = jest.fn();
        service.addListener(SettingsEvents.SETTINGS_UPDATED, eventListener);

        await service.setPrivacyMode(true);

        expect(eventListener).toHaveBeenCalledWith({
          ...storedSettings,
          privacyMode: true,
        });
      });
    });
  });
});
