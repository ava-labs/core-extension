import browser from 'webextension-polyfill';
import { CONTENT_SCRIPT } from '@avalabs/core-ext-common';
import { onPageActivated } from '@avalabs/core-ext-utils';
import {
  AutoPairingPostMessageConnection,
  PortConnection,
} from '@avalabs/core-ext-messaging';

function setupStream() {
  /**
   * This is traffic coming from the background page out to the provider and from there
   * to the dApp
   */
  const backgroundConnection = new PortConnection(
    browser.runtime.connect({
      name: CONTENT_SCRIPT,
    }),
  );
  backgroundConnection.connect();
  const dappConnection = new AutoPairingPostMessageConnection(true);
  dappConnection.connect(async (data) => {
    const request = await backgroundConnection.request(data);

    return request;
  });
  backgroundConnection.on('message', (data) => {
    return dappConnection.message(data);
  });

  document.addEventListener('beforeunload', () => {
    dappConnection.dispose();
    backgroundConnection.dispose();
  });

  backgroundConnection.on('disconnect', () => {
    console.log('reconnecting...');
    setupStream();
  });
}

onPageActivated(setupStream);
