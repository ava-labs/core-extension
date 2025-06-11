import onPageActivated from '@core/common';
import AutoPairingPostMessageConnection from '@core/messaging';

import { initializeProvider } from './src/initializeInpageProvider';

const shouldInjectProvider = () => {
  return doctypeCheck() && suffixCheck() && documentElementCheck();
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
 * Returns whether the extension (suffix) of the current document is prohibited
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
    if (prohibitedTypes[i]?.test(currentUrl)) {
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

const connection = new AutoPairingPostMessageConnection(false);

if (shouldInjectProvider()) {
  onPageActivated(() => initializeProvider(connection));
}
