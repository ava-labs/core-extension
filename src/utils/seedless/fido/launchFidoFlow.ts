import browser from 'webextension-polyfill';

import { openPopup } from '../../extensionUtils';

import { DecodedFIDOResult, FIDOApiEndpoint, FIDOApiRequest } from './types';
import { convertRequest } from './convertRequest';
import { convertResult } from './convertResult';
import { isValidResponse } from './validateResponse';

export async function launchFidoFlow(
  endpoint: FIDOApiEndpoint,
  challenge: FIDOApiRequest
): Promise<DecodedFIDOResult> {
  const baseUrl = process.env.SEEDLESS_FIDO_IDENTITY_URL;

  if (!baseUrl) {
    throw new Error('FIDO Identity Service URL is not configured');
  }

  const url = new URL(baseUrl);
  url.pathname = endpoint;
  url.searchParams.set('responseMode', 'post-message');
  url.searchParams.set('origin', location.origin);
  url.searchParams.set('options', convertRequest(endpoint, challenge));

  const popup = await openPopup({
    url: url.toString(),
    setSelfAsOpener: true,
  });

  // Make sure to close the popup if the calling window gets closed
  window.addEventListener('beforeunload', () => {
    if (popup?.id) {
      browser.windows.remove(popup.id);
    }
  });

  return new Promise((resolve, reject) => {
    // Throw error if popup is closed prematurely
    const closeSubscription = popup.removed.subscribe(() => {
      reject(new Error('Popup closed'));
    });

    const onResponse = (event: MessageEvent) => {
      if (event.origin !== url.origin) {
        return;
      }

      // Popup can now be closed safely
      closeSubscription.unsubscribe();
      if (popup?.id) {
        browser.windows.remove(popup.id);
      }

      const response = JSON.parse(event.data);

      if (isValidResponse(endpoint, response)) {
        resolve(convertResult(response));
      }

      window.removeEventListener('message', onResponse);
    };

    window.addEventListener('message', onResponse);
  });
}
