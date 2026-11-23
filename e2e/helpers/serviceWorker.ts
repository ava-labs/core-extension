import type { Page } from '@playwright/test';

// Port name the extension UI uses to talk to the service worker (EXTENSION_SCRIPT
// in @core). Requests are the same `provider_request` envelope the UI sends.
const EXTENSION_SCRIPT = 'avalanche-extension';

/**
 * Sends an ExtensionRequest to the service worker over the extension's runtime
 * port and resolves with its result, mirroring how the UI issues requests. Use
 * for querying/driving background state directly instead of through the UI.
 */
export async function requestFromServiceWorker<T = unknown>(
  page: Page,
  method: string,
  params: unknown[] = [],
): Promise<T> {
  return page.evaluate(
    ({ portName, method: rpcMethod, params: rpcParams }) =>
      new Promise<unknown>((resolve, reject) => {
        const id = `${rpcMethod}-${Math.floor(Math.random() * 1e7)}`;
        let port: chrome.runtime.Port | undefined;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let settled = false;

        const handleMessage = (raw: unknown) => {
          const message = (typeof raw === 'string' ? JSON.parse(raw) : raw) as {
            id?: string;
            error?: unknown;
            result?: unknown;
          };
          if (message?.id !== id) {
            return;
          }
          settle(
            message.error ? new Error(String(message.error)) : undefined,
            message.result,
          );
        };

        function settle(error?: Error, value?: unknown) {
          if (settled) {
            return;
          }
          settled = true;
          try {
            if (timer) {
              clearTimeout(timer);
            }
            if (port) {
              port.onMessage.removeListener(handleMessage);
              port.disconnect();
            }
          } catch {
            // Cleanup must never block settlement.
          }
          if (error) {
            reject(error);
          } else {
            resolve(value);
          }
        }

        try {
          port = chrome.runtime.connect({ name: portName });
          timer = setTimeout(
            () => settle(new Error(`${rpcMethod} timed out`)),
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
                request: { id, params: rpcParams, method: rpcMethod },
              },
              context: {},
            }),
          );
        } catch (error) {
          settle(error as Error);
        }
      }),
    { portName: EXTENSION_SCRIPT, method, params },
  ) as Promise<T>;
}
