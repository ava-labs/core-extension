/**
 * This is a modification of https://github.com/microsoft/accessibility-insights-web/pull/5421/commits/9ad4e618019298d82732d49d00aafb846fb6bac7
 * More details here: https://github.com/microsoft/accessibility-insights-web/pull/5421#issuecomment-1109168149
 *
 * =======================
 *
 * Our issue is a bit different than the one linked above, but it can be worked around in the same manner.
 *
 * In our case, some of our (deep) dependencies (e.g. is-ipfs, imported by @avalabs/core-utils-sdk) try to CJS-require
 * packages which define ESM versions as default for browser env. This results in errors like:
 *
 * 1. SyntaxError: Cannot use import statement outside a module
 * 2. SyntaxError: Unexpected token 'export'
 *
 * The custom resolver below forces Jest to use CJS version of some packages in browser environment, even when ESM is available.
 */

const packages = ['multiformats', 'uint8arrays', 'rxjs', 'jose', 'isows'];

module.exports = (path, options) => {
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(path, {
    ...options,
    // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
    packageFilter: (pkg) => {
      if (packages.includes(pkg.name)) {
        delete pkg['exports'];
        delete pkg['module'];
      }
      return pkg;
    },
  });
};
