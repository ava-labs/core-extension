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

  public get featureFlags(): Record<FeatureGates, boolean> {
    return this._featureFlags;
  }

  private set featureFlags(newFlags: Record<FeatureGates, boolean>) {
    if (JSON.stringify(this._featureFlags) === JSON.stringify(newFlags)) {
      // do nothing since flags are the same
      // do not trigger new update cycles within the app
      return;
    }
    this._featureFlags = newFlags;
    this.eventEmitter.emit(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      this._featureFlags
    );
  }
  private featureFlagsListener?: ReturnType<typeof initFeatureFlags>;

  constructor(private analyticsService: AnalyticsService) {
    // start fetching feature as early as possible
    // update requests with unique id after it's available
    // if analytics is disabled `ANALYTICS_STATE_UPDATED` will never be fired
    this.initFeatureFlags().catch((e) => {
      console.error(e);
    });

    // subscribe to analytics event updates so that we can set
    // the userId in case the user has opted in for feature flags
    this.analyticsService.addListener(
      AnalyticsEvents.ANALYTICS_STATE_UPDATED,
      () => {
        if (this.featureFlagsListener) {
          this.featureFlagsListener.unsubscribe();
        }
        this.initFeatureFlags().catch((e) => {
          console.error(e);
        });
      }
    );
  }

  private async initFeatureFlags() {
    const analyticsState = await this.analyticsService.getIds();

    if (!process.env.POSTHOG_KEY) {
      throw new Error('POSTHOG_KEY missing');
    }

    this.featureFlagsListener = initFeatureFlags(
      process.env.POSTHOG_KEY,
      analyticsState?.userId ?? '',
      process.env.POSTHOG_URL ?? 'https://data-posthog.avax.network',
      5000
    );
    this.featureFlagsListener.listen.add((flags) => {
      this.featureFlags = flags as Record<FeatureGates, boolean>;
    });
  }

  addListener(event: FeatureFlagEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
