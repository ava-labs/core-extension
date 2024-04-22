import { startOnboarding } from './startOnboarding';
import { SettingsService } from '../settings/SettingsService';
import { AnalyticsService } from '../analytics/AnalyticsService';
import { StorageService } from '../storage/StorageService';

jest.mock('@avalabs/wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/wallets-sdk'),
  getXpubFromMnemonic: jest.fn(),
  Avalanche: {
    getXpubFromMnemonic: jest.fn(),
  },
}));

describe('src/background/services/onboarding/handlers/onboardingInitalWork.ts', () => {
  const storageServiceMock = {
    createStorageKey: jest.fn(),
  } as unknown as StorageService;
  const analyticsServiceMock = {
    saveTemporaryAnalyticsIds: jest.fn(),
  } as unknown as AnalyticsService;
  const settingsServiceMock = {
    setAnalyticsConsent: jest.fn(),
  } as unknown as SettingsService;

  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should call the starting common onboarding setings', async () => {
    await startOnboarding({
      storageService: storageServiceMock,
      settingsService: settingsServiceMock,
      analyticsService: analyticsServiceMock,
      analyticsConsent: true,
      password: 'password',
    });
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password'
    );
    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(true);
    expect(analyticsServiceMock.saveTemporaryAnalyticsIds).toHaveBeenCalled();
  });

  it('should call the starting common onboarding setings but not save analytics', async () => {
    await startOnboarding({
      storageService: storageServiceMock,
      settingsService: settingsServiceMock,
      analyticsService: analyticsServiceMock,
      analyticsConsent: false,
      password: 'password',
    });
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password'
    );
    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);
    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds
    ).not.toHaveBeenCalled();
  });
});
