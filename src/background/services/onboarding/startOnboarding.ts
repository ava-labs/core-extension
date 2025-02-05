import type { AnalyticsService } from '../analytics/AnalyticsService';
import type { SettingsService } from '../settings/SettingsService';
import type { StorageService } from '../storage/StorageService';

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
