import { CONTENT_SCRIPT } from './common';
import browser from 'webextension-polyfill';
import PortConnection from './background/utils/messaging/PortConnection';
import onPageActivated from './background/providers/utils/onPageActivated';
import AutoPairingPostMessageConnection from './background/utils/messaging/AutoPairingPostMessageConnection';

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
