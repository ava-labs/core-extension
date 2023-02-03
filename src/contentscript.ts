import extension from 'extensionizer';

import { CONTENT_SCRIPT, INPAGE_SCRIPT, KEEPALIVE_SCRIPT } from './common';
import { windowPostMessage } from './utils/windowPostMessage';
import { Runtime } from 'webextension-polyfill';
import { providerHandshake } from './utils/providerHandshake';
import { requestLog, responseLog } from './utils/logging';

function setupStream() {
  /**
   * This is traffic coming from within the dApp origin only and
   * aimed at the content script itself
   */
  const { listen, dispatch } = windowPostMessage({
    scope: CONTENT_SCRIPT,
    target: INPAGE_SCRIPT,
  });

  /**
   * This is traffic coming from the background page out to the provider and from there
   * to the dApp
   */
  const backgroundConnection: Runtime.Port = extension.runtime.connect({
    name: CONTENT_SCRIPT,
  });

  let backgroundKeepaliveConnection: Runtime.Port | null = null;

  function keepAlive() {
    if (backgroundKeepaliveConnection) return;
    backgroundKeepaliveConnection = extension.runtime.connect({
      name: KEEPALIVE_SCRIPT,
    });
    backgroundKeepaliveConnection?.onDisconnect.addListener(() => {
      backgroundKeepaliveConnection = null;
      keepAlive();
    });
  }

  keepAlive();

  const subscription = listen
    .pipe(providerHandshake(dispatch))
    .subscribe((val) => {
      requestLog(`provider request (${val.data.data.method})`, val.data);
      backgroundConnection.postMessage(val.data);
    });

  backgroundConnection.onMessage.addListener((val) => {
    responseLog(`background connection response (${val.data?.method})`, val);
    dispatch(val);
  });

  backgroundConnection.onDisconnect.addListener(() => {
    console.log('reconnecting...');
    setupStream();
    subscription.unsubscribe();
  });
}

setupStream();
