import { FeatureGates, initFeatureFlags } from '@avalabs/posthog-sdk';
import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { AnalyticsService } from '../analytics/AnalyticsService';
import { DEFAULT_FLAGS, FeatureFlagEvents } from './models';
import { AnalyticsEvents } from '../analytics/models';

@singleton()
export class FeatureFlagService {
  private eventEmitter = new EventEmitter();
  private _featureFlags = DEFAULT_FLAGS;
  private listeningInProgress = false;
  public get featureFlags(): Record<FeatureGates, boolean> {
    return this._featureFlags;
  }

  constructor(private analyticsService: AnalyticsService) {
    this.analyticsService.addListener(
      AnalyticsEvents.ANALYTICS_STATE_UPDATED,
      () => {
        if (!this.listeningInProgress) {
          this.initFeatureFlags();
        }
      }
    );
  }

  private async initFeatureFlags() {
    const analyticsState = await this.analyticsService.getIds();

    if (!process.env.POSTHOG_KEY) {
      throw new Error('Analytic token missing');
    }

    const { listen } = initFeatureFlags(
      process.env.POSTHOG_KEY,
      analyticsState?.userId ?? '',
      process.env.POSTHOG_URL ?? 'https://data-posthog.avax.network'
    );
    listen.add((flags) => {
      this._featureFlags == flags;
      this.eventEmitter.emit(FeatureFlagEvents.FEATURE_FLAG_UPDATED, flags);
    });
    this.listeningInProgress = true;
  }

  addListener(event: FeatureFlagEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
