import extension from 'extensionizer';

import { CONTENT_SCRIPT, INPAGE_SCRIPT, KEEPALIVE_SCRIPT } from './common';
import { Runtime } from 'webextension-polyfill';
import WindowPostMessageConnection from './background/utils/messaging/WindowPostMessageConnection';
import PortConnection from './background/utils/messaging/PortConnection';

function setupStream() {
  /**
   * This is traffic coming from the background page out to the provider and from there
   * to the dApp
   */
  const backgroundConnection = new PortConnection(
    extension.runtime.connect({
      name: CONTENT_SCRIPT,
    })
  );
  backgroundConnection.connect();
  const dappConnection = new WindowPostMessageConnection(INPAGE_SCRIPT);
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

  backgroundConnection.on('disconnect', () => {
    console.log('reconnecting...');
    setupStream();
  });
}

setupStream();
