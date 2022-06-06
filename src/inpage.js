import log from 'loglevel';
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import {
  initializeProvider,
  setGlobalProvider,
  setAvalancheGlobalProvider,
} from './background/providers/initializeInpageProvider';
import { CONTENT_SCRIPT, INPAGE_SCRIPT } from './common';
import { timer } from 'rxjs';

/**
 * This is placing the metamask provider and web3 shim into the dApp environment
 * @link https://github.com/MetaMask/providers/blob/main/src/BaseProvider.ts
 */
const avalancheStream = new WindowPostMessageStream({
  name: INPAGE_SCRIPT,
  target: CONTENT_SCRIPT,
});

const provider = initializeProvider({
  connectionStream: avalancheStream,
  logger: log,
  shouldShimWeb3: true,
});

/**
 * We need to iterate and make sure that we are always the extension that is on window.ethereum.
 * If we are not and the background says we are supposed to be then lets reset the window.ethereum
 * value to our own.
 */
timer(0, 1500).subscribe(async () => {
  if (window.ethereum.isAvalanche) return;

  const doSetAsDefaultExtension = await provider.request({
    method: 'avalanche_getIsDefaultExtensionState',
    params: [],
  });

  doSetAsDefaultExtension &&
    setGlobalProvider(provider) &&
    setAvalancheGlobalProvider(provider);
});
