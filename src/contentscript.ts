// import { browser } from "webextension-polyfill-ts";
// import avalancheWeb3 from "./avalancheWeb3/avalancheweb3";
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import extension from 'extensionizer';
import ObjectMultiplex from 'obj-multiplex';
import PortStream from 'extension-port-stream';
import pump from 'pump';
import {
  CONTENT_SCRIPT,
  INPAGE_SCRIPT,
  INPAGE_PROVIDER as PROVIDER,
} from './common';
import { Duplex } from 'stream';
import logger, {
  LoggerColors,
  requestParser,
} from './background/utils/logging';

const inpage = require('raw-loader!/dist/js/inpage.js');

const inpageSuffix = `//# sourceURL=${extension.runtime.getURL('inpage.js')}\n`;
const inpageBundle = `${inpage.default}` + inpageSuffix;

const shouldInjectProvider = () => {
  return (
    doctypeCheck() &&
    suffixCheck() &&
    documentElementCheck() &&
    !blockedDomainCheck()
  );
};

/**
 * Checks the doctype of the current document if it exists
 *
 * @returns {boolean} {@code true} if the doctype is html or if none exists
 */
const doctypeCheck = () => {
  const { doctype } = window.document;
  if (doctype) {
    return doctype.name === 'html';
  }
  return true;
};

/**
 * Returns whether or not the extension (suffix) of the current document is prohibited
 *
 * This checks {@code window.location.pathname} against a set of file extensions
 * that we should not inject the provider into. This check is indifferent of
 * query parameters in the location.
 *
 * @returns {boolean} whether or not the extension of the current document is prohibited
 */
const suffixCheck = () => {
  const prohibitedTypes = [/\.xml$/u, /\.pdf$/u];
  const currentUrl = window.location.pathname;
  for (let i = 0; i < prohibitedTypes.length; i++) {
    if (prohibitedTypes[i].test(currentUrl)) {
      return false;
    }
  }
  return true;
};

/**
 * Checks the documentElement of the current document
 *
 * @returns {boolean} {@code true} if the documentElement is an html node or if none exists
 */
const documentElementCheck = () => {
  const documentElement = document.documentElement.nodeName;
  if (documentElement) {
    return documentElement.toLowerCase() === 'html';
  }
  return true;
};
/**
 * Checks if the current domain is blocked
 *
 * @returns {boolean} {@code true} if the current domain is blocked
 */
const blockedDomainCheck = () => {
  const blockedDomains = [
    'dropbox.com',
    'cdn.shopify.com/s/javascripts/tricorder/xtld-read-only-frame.html',
  ];
  const currentUrl = window.location.href;
  let currentRegex;
  for (let i = 0; i < blockedDomains.length; i++) {
    const blockedDomain = blockedDomains[i].replace('.', '\\.');
    currentRegex = new RegExp(
      `(?:https?:\\/\\/)(?:(?!${blockedDomain}).)*$`,
      'u'
    );
    if (!currentRegex.test(currentUrl)) {
      return true;
    }
  }
  return false;
};

const injectScript = (content: any) => {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('async', 'false');
    scriptTag.textContent = content;
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error(' Provider injection failed.', error);
  }
};

function setupStream() {
  const pageMux: Duplex = new ObjectMultiplex();
  pageMux.setMaxListeners(25);

  const extensionMux: Duplex = new ObjectMultiplex();
  extensionMux.setMaxListeners(25);

  /**
   * Wrap the postMessage api from inpage as a duplex stream
   */
  const pageStream = new WindowPostMessageStream({
    name: CONTENT_SCRIPT,
    target: INPAGE_SCRIPT,
  });

  /**
   * Establish a connection to the background page via Runtime.Port
   * api and then wrap that as a duplex stream
   */
  const extensionPort = extension.runtime.connect({ name: CONTENT_SCRIPT });
  const extensionStream = new PortStream(extensionPort);

  /**
   * pump all pagstream events into the pageMux, pageMux is
   * a multiplex stream
   */
  pump(
    pageMux,
    pageStream,
    pageMux,
    logger('Background reponse', { color: LoggerColors.success }),
    (err) => console.log('MetaMask Inpage Multiplex', err)
  );

  /**
   * pump all extensionStream events into the extensionMux, extensionMux is
   * a multiplex stream
   */
  pump(
    extensionMux,
    extensionStream,
    extensionMux,
    logger('Provider call'),
    (err) => {
      console.log('MetaMask Background Multiplex', err);
    }
  );

  /**
   * note from original engineer: forward communication across inpage-background for these channels only
   *
   * Essentially this crosses the streams on a private substream pipe,
   * this substream pipe is given a name. From what I can tell the provider
   * uses the same name schema and name as above PROVIDER, this allows that provider
   * to send messages through this private substream.
   */
  forwardTrafficBetweenMuxes(PROVIDER, pageMux, extensionMux);
}

function forwardTrafficBetweenMuxes(channelName, muxA, muxB) {
  const channelA = muxA.createStream(channelName);
  const channelB = muxB.createStream(channelName);
  pump(channelA, channelB, channelA, (error) =>
    console.debug(
      `MetaMask: Muxed traffic for channel "${channelName}" failed.`,
      error
    )
  );
}

if (shouldInjectProvider()) {
  injectScript(inpageBundle);
  setupStream();
}
