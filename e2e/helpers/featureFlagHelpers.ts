import type { Page } from '@playwright/test';

const FEATURE_FLAG_OVERRIDES_KEY = '__feature-flag-overrides__';

/**
 * The service worker only merges `__feature-flag-overrides__` on its periodic
 * PostHog flag fetch, which runs every ~30s in production/alpha builds. Callers
 * must allow a full cycle to elapse before relying on an override being live.
 */
export const FEATURE_FLAG_FETCH_INTERVAL_MS = 30_000;

/**
 * Merges values into the unencrypted `__feature-flag-overrides__` store the
 * service worker layers on top of fetched flags. Accepts booleans (gates) and
 * strings (FeatureVars such as `sae-override`). Existing overrides are kept.
 */
export async function setFeatureFlagOverrides(
  page: Page,
  overrides: Record<string, boolean | string>,
): Promise<void> {
  await page.evaluate(
    ({ key, next }) =>
      new Promise<void>((resolve) => {
        chrome.storage.local.get(key, (stored: Record<string, unknown>) => {
          const entry = stored?.[key] as { data?: Record<string, unknown> };
          const existing = entry?.data ?? {};
          chrome.storage.local.set(
            { [key]: { data: { ...existing, ...next } } },
            () => resolve(),
          );
        });
      }),
    { key: FEATURE_FLAG_OVERRIDES_KEY, next: overrides },
  );
}

export async function waitForFeatureFlagFetchCycle(
  page: Page,
  overridesSetAtMs: number,
): Promise<void> {
  const remaining =
    FEATURE_FLAG_FETCH_INTERVAL_MS + 2_000 - (Date.now() - overridesSetAtMs);
  if (remaining > 0) {
    await page.waitForTimeout(remaining);
  }
}
