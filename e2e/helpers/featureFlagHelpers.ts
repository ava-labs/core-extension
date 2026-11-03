import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const FEATURE_FLAG_OVERRIDES_KEY = '__feature-flag-overrides__';

// Port name the extension UI uses to talk to the service worker, and the
// FEATURE_FLAGS_GET request method — see EXTENSION_SCRIPT and
// ExtensionRequest.FEATURE_FLAGS_GET in @core.
const EXTENSION_SCRIPT = 'avalanche-extension';
const FEATURE_FLAGS_GET = 'feature_flags_get';

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
          // StorageService.loadUnencrypted reads `result[key].data`, so the
          // value must be wrapped under `data`.
          chrome.storage.local.set(
            { [key]: { data: { ...existing, ...next } } },
            () => resolve(),
          );
        });
      }),
    { key: FEATURE_FLAG_OVERRIDES_KEY, next: overrides },
  );
}

/**
 * Reads the service worker's effective feature flags over a short-lived
 * connection, mirroring how the frontend FeatureFlagsProvider requests them.
 * Only resolves plain JSON values, which is all feature flags carry.
 */
async function getEffectiveFeatureFlags(
  page: Page,
): Promise<Record<string, boolean | string>> {
  return page.evaluate(
    ({ portName, method }) =>
      new Promise<Record<string, boolean | string>>((resolve, reject) => {
        try {
          const port = chrome.runtime.connect({ name: portName });
          const id = `${method}-${Math.floor(Math.random() * 1e7)}`;
          const timer = setTimeout(() => {
            port.disconnect();
            reject(new Error('feature_flags_get timed out'));
          }, 10_000);

          port.onMessage.addListener((raw: unknown) => {
            const message = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (message?.id !== id) {
              return;
            }
            clearTimeout(timer);
            port.disconnect();
            if (message.error) {
              reject(new Error(String(message.error)));
            } else {
              resolve(message.result ?? {});
            }
          });

          port.postMessage(
            JSON.stringify({
              id,
              jsonrpc: '2.0',
              method: 'provider_request',
              params: {
                sessionId: crypto.randomUUID(),
                scope: '',
                request: { id, params: [], method },
              },
              context: {},
            }),
          );
        } catch (error) {
          reject(error as Error);
        }
      }),
    { portName: EXTENSION_SCRIPT, method: FEATURE_FLAGS_GET },
  );
}

export async function waitForFeatureFlagValue(
  page: Page,
  flag: string,
  expectedValue: boolean | string,
  timeout = 60_000,
): Promise<void> {
  await expect
    .poll(async () => (await getEffectiveFeatureFlags(page))[flag], {
      timeout,
      message: `Feature flag "${flag}" never became "${expectedValue}"; the service worker may not have completed a successful flag fetch to merge the override.`,
    })
    .toBe(expectedValue);
}
