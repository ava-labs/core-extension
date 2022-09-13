import log from 'loglevel';
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { initializeProvider } from './background/providers/initializeInpageProvider';
import { CONTENT_SCRIPT, INPAGE_SCRIPT } from './common';

/**
 * This is placing the metamask provider and web3 shim into the dApp environment
 * @link https://github.com/MetaMask/providers/blob/main/src/BaseProvider.ts
 */
const avalancheStream = new WindowPostMessageStream({
  name: INPAGE_SCRIPT,
  target: CONTENT_SCRIPT,
});

initializeProvider({
  connectionStream: avalancheStream,
  logger: log,
});
