import { HttpClient } from '@avalabs/core-utils-sdk';
import { getUserEnvironment } from '@core/utils';
import { singleton } from 'tsyringe';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { SettingsService } from '../settings/SettingsService';
import { AnalyticsService } from './AnalyticsService';
import { AnalyticsCapturedEvent, AnalyticsState, BlockchainId } from '@core/types/src/models';
import { FeatureGates } from '../featureFlags/models';
import { AnalyticsConsent } from '@core/types/src/models';
import { encryptAnalyticsData } from './utils/encryptAnalyticsData';
import { Monitoring } from '@core/common';
import { ChainId } from '@avalabs/core-chains-sdk';

@singleton()
export class AnalyticsServicePosthog {
  private http = new HttpClient(
    process.env.POSTHOG_URL || 'https://data-posthog.avax-test.network',
  );
  private reportedDeviceId;

  constructor(
    private featureFlagService: FeatureFlagService,
    private analyticsService: AnalyticsService,
    private settingsService: SettingsService,
  ) {}

  /**
   * Alias for {@link AnalyticsServicePosthog.captureEvent} with enforced data encryption.
   */
  async captureEncryptedEvent(event: AnalyticsCapturedEvent) {
    return this.#captureEvent(event, true).catch((err) => {
      // Capture all errors and report them to Sentry instead of breaking the execution chain.
      Monitoring.sentryCaptureException(
        err,
        Monitoring.SentryExceptionTypes.ANALYTICS,
      );
    });
  }

  async captureEvent(event: AnalyticsCapturedEvent) {
    return this.#captureEvent(event, false).catch((err) => {
      // Capture all errors and report them to Sentry instead of breaking the execution chain.
      Monitoring.sentryCaptureException(
        err,
        Monitoring.SentryExceptionTypes.ANALYTICS,
      );
    });
  }

  async #captureEvent(event: AnalyticsCapturedEvent, useEncryption: boolean) {
    const { analyticsConsent } = await this.settingsService.getSettings();

    if (
      !this.featureFlagService.featureFlags[FeatureGates.EVENTS] ||
      analyticsConsent === AnalyticsConsent.Denied
    ) {
      return;
    }

    const analyticsState = await this.analyticsService.getIds();

    if (!analyticsState) {
      throw new Error('Analytics State is not available.');
    }

    const sessionId = await this.analyticsService.getSessionId();

    const extensionVersion = chrome.runtime.getManifest().version;
    const featureFlagsData = this.getFeatureFlagsData();

    const preppedProperties = event.properties
      ? await this.prepProperties(
          event.windowId,
          event.properties,
          useEncryption,
        )
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
      this.featureFlagService.featureFlags,
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

  // TODO update with real value
  private updateChainIdIfNeeded(original: number) {
    if (original === ChainId.AVALANCHE_P) {
      return BlockchainId.P_CHAIN;
    } else if (original === ChainId.AVALANCHE_TEST_P) {
      return BlockchainId.P_CHAIN_TESTNET;
    } else if (original === ChainId.AVALANCHE_X) {
      return BlockchainId.X_CHAIN;
    } else if (original === ChainId.AVALANCHE_TEST_X) {
      return BlockchainId.X_CHAIN_TESTNET;
    }
    return original;
  }

  private async prepProperties(
    windowId: string,
    properties: Record<string, any>,
    useEncryption = false,
  ) {
    const userEnv = await getUserEnvironment();

    if (Object.keys(properties).includes('chainId')) {
      properties.chainId = this.updateChainIdIfNeeded(properties.chainId);
    }

    if (Object.keys(properties).includes('networkChainId')) {
      properties.networkChainId = this.updateChainIdIfNeeded(
        properties.networkChainId,
      );
    }

    const preppedProps = useEncryption
      ? await encryptAnalyticsData(JSON.stringify(properties ?? {}))
      : properties;

    return {
      ...preppedProps,
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
