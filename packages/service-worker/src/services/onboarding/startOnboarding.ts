import { AnalyticsService } from '../analytics/AnalyticsService';
import { SettingsService } from '../settings/SettingsService';
import { StorageService } from '../storage/StorageService';

export interface FinalizeOnboardingParams {
  storageService: StorageService;
  settingsService: SettingsService;
  analyticsService: AnalyticsService;
  password: string;
  analyticsConsent: boolean;
}

export async function startOnboarding({
  settingsService,
  storageService,
  analyticsService,
  password,
  analyticsConsent,
}: FinalizeOnboardingParams) {
  await storageService.createStorageKey(password);

  await settingsService.setAnalyticsConsent(analyticsConsent);

  if (analyticsConsent) {
    await analyticsService.saveTemporaryAnalyticsIds();
  }
}
