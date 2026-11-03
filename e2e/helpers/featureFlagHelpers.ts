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

async function getEffectiveFeatureFlags(
  page: Page,
): Promise<Record<string, boolean | string>> {
  return page.evaluate(
    ({ portName, method }) =>
      new Promise<Record<string, boolean | string>>((resolve, reject) => {
        const id = `${method}-${Math.floor(Math.random() * 1e7)}`;
        let port: chrome.runtime.Port | undefined;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let settled = false;

        const handleMessage = (raw: unknown) => {
          const message = (typeof raw === 'string' ? JSON.parse(raw) : raw) as {
            id?: string;
            error?: unknown;
            result?: Record<string, boolean | string>;
          };
          if (message?.id !== id) {
            return;
          }
          settle(
            message.error ? new Error(String(message.error)) : undefined,
            message.result,
          );
        };

        function settle(
          error?: Error,
          value?: Record<string, boolean | string>,
        ) {
          if (settled) {
            return;
          }
          settled = true;
          if (timer) {
            clearTimeout(timer);
          }
          if (port) {
            port.onMessage.removeListener(handleMessage);
            port.disconnect();
          }
          if (error) {
            reject(error);
          } else {
            resolve(value ?? {});
          }
        }

        try {
          port = chrome.runtime.connect({ name: portName });
          timer = setTimeout(
            () => settle(new Error('feature_flags_get timed out')),
            10_000,
          );
          port.onMessage.addListener(handleMessage);
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
          settle(error as Error);
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
