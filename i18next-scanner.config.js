const typescriptTransform = require('i18next-scanner-typescript');

module.exports = {
  input: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}'],
  output: './src/',
  options: {
    debug: true,
    func: {
      list: ['i18next.t', 'i18n.t', 't'],
      extensions: ['.js', '.jsx'],
    },
    trans: {
      // don't pass ts or tsx here!
      extensions: ['.js', '.jsx'],
      component: 'Trans',
      i18nKey: 'i18nKey',
    },
    lngs: ['en'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    defaultValue: function (lng, ns, key) {
      if (lng === 'en') {
        // Return key as the default value for English language
        return key;
      }
      // Return the string '__NOT_TRANSLATED__' for other languages
      return '';
    },
    sort: true,
    resource: {
      loadPath: '/localization/locales/{{lng}}/{{ns}}.json',
      savePath: 'localization/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
    metadata: {},
    allowDynamicKeys: false,
  },
  transform: typescriptTransform({
    // default value for extensions
    extensions: ['.ts', '.tsx'],
    // optional ts configuration
    tsOptions: {
      target: 'es2017',
    },
  }),
};
