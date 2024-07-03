import {
  DAppProviderRequest,
  JsonRpcRequestPayload,
} from '@src/background/connections/dAppConnection/models';
import browser from 'webextension-polyfill';

export async function isCoreWeb(
  request: JsonRpcRequestPayload<DAppProviderRequest, any>
): Promise<boolean> {
  const { tabId, domain, name } = request?.site ?? {};
  if (!tabId || !domain || !name) {
    return false;
  }

  try {
    const tab = await browser.tabs.get(tabId);

    if (
      (domain === 'core.app' ||
        domain === 'test.core.app' ||
        domain === 'core-web.pages.dev') &&
      name === 'Core' &&
      tab.active &&
      tab.url?.startsWith(`https://${domain}/`)
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
