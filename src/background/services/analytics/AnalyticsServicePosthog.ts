import { FeatureGates } from '@avalabs/posthog-sdk';
import { HttpClient } from '@avalabs/utils-sdk';
import { getUserEnvironment } from '@src/utils/getUserEnvironment';
import { singleton } from 'tsyringe';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { SettingsService } from '../settings/SettingsService';
import { AnalyticsService } from './AnalyticsService';
import { AnalyticsCapturedEvent, AnalyticsState } from './models';

@singleton()
export class AnalyticsServicePosthog {
  private http = new HttpClient(
    process.env.POSTHOG_URL || 'https://data-posthog.avax-test.network'
  );
  private reportedDeviceId;

  constructor(
    private featureFlagService: FeatureFlagService,
    private analyticsService: AnalyticsService,
    private settingsService: SettingsService
  ) {}

  async captureEvent(event: AnalyticsCapturedEvent) {
    const settings = await this.settingsService.getSettings();

    if (
      !this.featureFlagService.featureFlags[FeatureGates.EVENTS] ||
      !settings.analyticsConsent
    ) {
      throw new Error('No need to capture event');
    }

    const analyticsState = await this.analyticsService.getIds();

    if (!analyticsState) {
      throw new Error('Analytics State is not available.');
    }

    const sessionId = await this.analyticsService.getSessionId();
    const extensionVersion = chrome.runtime.getManifest().version;
    const featureFlagsData = this.getFeatureFlagsData();

    const preppedProperties = event.properties
      ? await this.prepProperties(event.windowId, event.properties)
      : {};

    const body = {
      api_key: process.env.POSTHOG_KEY ?? '',
      event: event.name,
      properties: {
        ...preppedProperties,
        ...featureFlagsData,
        distinct_id: analyticsState.userId,
        $user_id: analyticsState.userId,
        $device_id: analyticsState.deviceId,
        $session_id: sessionId,
        extension_Version: extensionVersion,
        $host: chrome.runtime.id,
        $groups: { device: analyticsState.deviceId },
      },
      timestamp: Date.now().toString(),
      ip: '',
    };

    return this.http
      .post(`/capture/`, body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(() => {
        return this.updateGroupPropertiesIfNeeded(analyticsState);
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Analytics capture error');
      });
  }

  private getFeatureFlagsData() {
    const activeFeatureFlags = Object.keys(
      this.featureFlagService.featureFlags
    );

    const reducer = (accumulated, current) => {
      accumulated[`$feature/${current}`] =
        this.featureFlagService.featureFlags[current];
      return accumulated;
    };

    return {
      $active_feature_flags: activeFeatureFlags,
      ...activeFeatureFlags.reduce(reducer, {}),
    };
  }

  private async prepProperties(
    windowId: string,
    properties: Record<string, any>
  ) {
    const userEnv = await getUserEnvironment();

    return {
      ...properties,
      ...userEnv,
      $window_id: windowId,
    };
  }

  private async updateGroupPropertiesIfNeeded(analyticsState: AnalyticsState) {
    if (this.reportedDeviceId === analyticsState.deviceId) {
      return;
    }

    const body = {
      api_key: process.env.POSTHOG_KEY ?? '',
      event: '$groupidentify',
      properties: {
        distinct_id: analyticsState.userId,
        $group_type: 'device',
        $group_key: analyticsState.deviceId,
        $group_set: {
          id: analyticsState.deviceId,
        },
      },
    };

    return this.http
      .post(`/capture/`, body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(() => {
        this.reportedDeviceId = analyticsState.deviceId;
        return;
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  }
}
