import { windows } from 'webextension-polyfill';

import { openPopup } from '@core/common';

import {
  DecodedFIDOResult,
  FIDOApiEndpoint,
  FIDOApiRequest,
  KeyType,
} from '@core/types';
import { convertRequest } from './convertRequest';
import { convertResult } from './convertResult';
import { isValidResponse } from './validateResponse';

export async function launchFidoFlow(
  endpoint: FIDOApiEndpoint,
  challenge: FIDOApiRequest,
  keyType?: KeyType,
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

  if (endpoint === FIDOApiEndpoint.Register) {
    if (!keyType) {
      throw new Error('FIDO key type not defined for registration request');
    }

    url.searchParams.set('keyType', keyType);
  }

  const popup = await openPopup({
    url: url.toString(),
    setSelfAsOpener: true,
    right: 70,
  });

  // Make sure to close the popup if the calling window gets closed
  window.addEventListener('beforeunload', () => {
    if (popup?.id) {
      windows.remove(popup.id).catch(() => {
        // Do nothing, we can't really do anything about it and
        // the most likely reason of error is that it was already closed.
      });
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

      const response = JSON.parse(event.data);

      if (isValidResponse(endpoint, response)) {
        // Popup can now be closed safely
        closeSubscription.unsubscribe();
        if (popup?.id) {
          windows.remove(popup.id).then(() => {
            // Do nothing, we can't really do anything about it and
            // the most likely reason of error is that it was already closed.
          });
        }
        window.removeEventListener('message', onResponse);

        resolve(convertResult(response));
      }
    };

    window.addEventListener('message', onResponse);
  });
}
