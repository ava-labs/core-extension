import extension from 'extensionizer';

import { CONTENT_SCRIPT, INPAGE_SCRIPT, KEEPALIVE_SCRIPT } from './common';
import { windowPostMessage } from './utils/windowPostMessage';
import { browser, Runtime } from 'webextension-polyfill-ts';
import { providerHandshake } from './utils/providerHandshake';
import { requestLog, responseLog } from './utils/logging';

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

const injectScript = (path: string) => {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('async', 'false');
    scriptTag.src = path;
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error(' Provider injection failed.', error);
  }
};

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

if (shouldInjectProvider()) {
  injectScript(browser.runtime.getURL('js/inpage.js'));
  setupStream();
}
