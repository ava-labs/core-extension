const set = require('lodash/set');

/**
 * @typedef {Object} ManifestValues
 *
 * @property {string} name
 * @property {string} shortName
 * @property {string} actionDefaultTitle
 * @property {string} [oAuthClientId]
 * @property {string} [publicKey]
 * @property {string} [publicKey]
 */

/**
 *
 * @param {ManifestValues} values
 * @returns {function(Buffer): string} Replacer function
 */
const transformManifestFiles =
  ({
    name,
    shortName,
    actionDefaultTitle,
    oAuthClientId,
    publicKey,
    originTrialsPromptAPIKey,
  }) =>
  (rawContent) => {
    const contentAsText = rawContent.toString();
    let parsed = JSON.parse(contentAsText);

    // If we're looking at manifest.json file, there is some stuff we need to configure
    if ('manifest_version' in parsed) {
      // Set general properties
      parsed = set(parsed, 'name', name);
      parsed = set(parsed, 'short_name', shortName);
      parsed = set(parsed, 'action.default_title', actionDefaultTitle);

      if (oAuthClientId) {
        // If we have OAuth client ID, set it
        parsed = set(parsed, 'oauth2.client_id', oAuthClientId);
      } else {
        // Otherwise remove the oauth2 section from the manifest
        delete parsed.oauth2;
      }

      if (publicKey) {
        // If we have the public key in the env file, set it in the manifest.
        parsed = set(parsed, 'key', publicKey);
      } else {
        // Otherwise remove the `key` property from the manifest
        delete parsed.key;
      }

      if (originTrialsPromptAPIKey) {
        parsed = set(parsed, 'trial_tokens', [originTrialsPromptAPIKey]);
      } else {
        // Otherwise remove the `trial_tokens` property from the manifest
        delete parsed.trial_tokens;
      }

      return JSON.stringify(parsed, null, 2);
    }

    // Otherwise this is a localization file (message.json) and we just need
    // to search & replace some values
    return contentAsText.replace('__NAME__', name);
  };

module.exports = {
  transformManifestFiles,
};
