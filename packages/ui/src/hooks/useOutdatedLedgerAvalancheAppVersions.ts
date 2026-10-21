import { isLedgerAppVersionOutdated } from '@core/common';
import { FeatureVars } from '@core/types';
import { useFeatureFlagContext } from '../contexts/FeatureFlagsProvider';
import { LedgerAppType, useLedgerContext } from '../contexts/LedgerProvider';

export type OutdatedLedgerAppVersions = {
  currentVersion: string;
  recommendedVersion: string;
};

/**
 * Reads the active app from the Ledger context without subscribing to polling,
 * so it only reflects fresh data on screens that already call
 * `useActiveLedgerAppInfo()`.
 */
export const useOutdatedLedgerAvalancheAppVersions = ():
  | OutdatedLedgerAppVersions
  | undefined => {
  const { appType, appVersion } = useLedgerContext();
  const { selectFeatureFlag } = useFeatureFlagContext();
  const recommendedVersion = selectFeatureFlag(
    FeatureVars.LEDGER_AVALANCHE_APP_RECOMMENDED_VERSION,
  );

  if (
    appType !== LedgerAppType.AVALANCHE ||
    !appVersion ||
    !isLedgerAppVersionOutdated(appVersion, recommendedVersion)
  ) {
    return undefined;
  }

  return { currentVersion: appVersion, recommendedVersion };
};
