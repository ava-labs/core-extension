(() => { // webpackBootstrap
"use strict";
var __webpack_modules__ = ({
"../common/src/constants.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KNOWN_CORE_DOMAINS: () => (KNOWN_CORE_DOMAINS),
  SYNCED_DOMAINS: () => (SYNCED_DOMAINS),
  WALLET_CONNECT_APP_METADATA: () => (WALLET_CONNECT_APP_METADATA)
});
/* ESM import */var _utils_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/environment.ts");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__);


const CORE_WEB_DOMAIN = 'core.app';
const CORE_WEB_TESTNET_DOMAIN = 'test.core.app';
const CORE_WEB_STAGING_DOMAIN = 'core-web.pages.dev';
const DAPP_DEV_DOMAINS = [
    'localhost',
    '127.0.0.1',
    'redesign-aa3.pages.dev'
];
const SYNCED_DOMAINS_PRODUCTION_BUILD = [
    CORE_WEB_DOMAIN
];
const SYNCED_DOMAINS_DEVELOPMENT_BUILD = [
    CORE_WEB_DOMAIN,
    CORE_WEB_TESTNET_DOMAIN,
    CORE_WEB_STAGING_DOMAIN,
    ...DAPP_DEV_DOMAINS
];
const KNOWN_CORE_DOMAINS = [
    CORE_WEB_DOMAIN,
    CORE_WEB_TESTNET_DOMAIN,
    CORE_WEB_STAGING_DOMAIN,
    ...DAPP_DEV_DOMAINS
];
const SYNCED_DOMAINS = (0,_utils_environment__WEBPACK_IMPORTED_MODULE_0__.isProductionBuild)() ? SYNCED_DOMAINS_PRODUCTION_BUILD : SYNCED_DOMAINS_DEVELOPMENT_BUILD;
const WALLET_CONNECT_APP_METADATA = {
    name: webextension_polyfill__WEBPACK_IMPORTED_MODULE_1___default().i18n.getMessage('appName'),
    // When connecting to Core Mobile, it will allow us to send avalanche_*
    // requests, as long as it recognizes us as part of the Core product.
    //
    // In local development, the extension ID may change from one machine
    // to another, so we use localhost to make it work.
    //
    // For production & blue builds, Core Mobile is able to recognize their
    // extension IDs, since they are permanent.
    url: (0,_utils_environment__WEBPACK_IMPORTED_MODULE_0__.isDevelopment)() ? 'https://localhost' : location.origin,
    description: webextension_polyfill__WEBPACK_IMPORTED_MODULE_1___default().i18n.getMessage('appDesc'),
    icons: [
        'https://extension.core.app/apple-touch-icon.png'
    ]
};


}),
"../common/src/feature-flags.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  DEFAULT_FLAGS: () => (DEFAULT_FLAGS),
  DISABLED_FLAG_VALUES: () => (DISABLED_FLAG_VALUES),
  FEATURE_FLAGS_OVERRIDES_KEY: () => (FEATURE_FLAGS_OVERRIDES_KEY)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");

// Posthog API does not return disabled flags on their `/decide` api endpoint
// Define disabled state values for the flags
const DISABLED_FLAG_VALUES = {
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.EVERYTHING]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.EVENTS]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_C_CHAIN]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_ETHEREUM]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_SOLANA]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_FEES]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_FEES_JUPITER]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BRIDGE]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BRIDGE_ETH]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BRIDGE_BTC]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEND]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEND_P_CHAIN]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEND_X_CHAIN]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BUY]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BUY_MOONPAY]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BUY_COINBASE]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.KEYSTONE]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.NFT_MARKETPLACE]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BOTTOM_NAVIGATION]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.DEFI]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.IMPORT_WALLET_CONNECT]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.IMPORT_FIREBLOCKS]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.IN_APP_SUPPORT_P_CHAIN]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.IN_APP_SUPPORT_X_CHAIN]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_ONBOARDING]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_ONBOARDING_GOOGLE]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_ONBOARDING_APPLE]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_MFA_PASSKEY]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_MFA_AUTHENTICATOR]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_MFA_YUBIKEY]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_SIGNING]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEEDLESS_MFA_SETTINGS]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_OPTIONAL_MFA]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_CCTP]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_ICTT]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_AB_EVM]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.DEBANK_TRANSACTION_PARSING]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.PRIMARY_ACCOUNT_REMOVAL]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.ADD_WALLET_WITH_SEEDPHRASE]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.ADD_WALLET_WITH_KEYSTORE_FILE]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.ADD_WALLET_WITH_LEDGER]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BLOCKAID_DAPP_SCAN]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BLOCKAID_DAPP_SCAN_WARNING]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BLOCKAID_TRANSACTION_SCAN]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BLOCKAID_JSONRPC_SCAN]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.HALLIDAY_BRIDGE_BANNER]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.FIREBASE_CLOUD_MESSAGING]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.ONE_CLICK_SWAP]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.GASLESS]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SOLANA_SUPPORT]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.CORE_ASSISTANT]: false
};
// Default flags are used when posthog is not available
const DEFAULT_FLAGS = {
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.EVERYTHING]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.EVENTS]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_C_CHAIN]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_ETHEREUM]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_SOLANA]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_FEES]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SWAP_FEES_JUPITER]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BRIDGE]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BRIDGE_ETH]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BRIDGE_BTC]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEND]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEND_P_CHAIN]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEND_X_CHAIN]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BUY]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BUY_MOONPAY]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BUY_COINBASE]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.KEYSTONE]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.NFT_MARKETPLACE]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BOTTOM_NAVIGATION]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.DEFI]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.IMPORT_WALLET_CONNECT]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.IMPORT_FIREBLOCKS]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.IN_APP_SUPPORT_P_CHAIN]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.IN_APP_SUPPORT_X_CHAIN]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_ONBOARDING]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_ONBOARDING_GOOGLE]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_ONBOARDING_APPLE]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_MFA_PASSKEY]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_MFA_AUTHENTICATOR]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_MFA_YUBIKEY]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_SIGNING]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEEDLESS_MFA_SETTINGS]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SEEDLESS_OPTIONAL_MFA]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_CCTP]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_ICTT]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_AB_EVM]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.DEBANK_TRANSACTION_PARSING]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.PRIMARY_ACCOUNT_REMOVAL]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.ADD_WALLET_WITH_SEEDPHRASE]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.ADD_WALLET_WITH_KEYSTORE_FILE]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.ADD_WALLET_WITH_LEDGER]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BLOCKAID_DAPP_SCAN]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BLOCKAID_DAPP_SCAN_WARNING]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BLOCKAID_TRANSACTION_SCAN]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BLOCKAID_JSONRPC_SCAN]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.HALLIDAY_BRIDGE_BANNER]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.FIREBASE_CLOUD_MESSAGING]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.ONE_CLICK_SWAP]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.GASLESS]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.SOLANA_SUPPORT]: true,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.CORE_ASSISTANT]: true
};
const FEATURE_FLAGS_OVERRIDES_KEY = '__feature-flag-overrides__';


}),
"../common/src/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AvaxCaipId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.AvaxCaipId),
  AvaxLegacyCaipId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.AvaxLegacyCaipId),
  BitcoinCaipId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.BitcoinCaipId),
  CONTENT_SCRIPT: () => (/* reexport safe */ _script_names__WEBPACK_IMPORTED_MODULE_0__.CONTENT_SCRIPT),
  CaipNamespace: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.CaipNamespace),
  DEFAULT_FLAGS: () => (/* reexport safe */ _feature_flags__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_FLAGS),
  DISABLED_FLAG_VALUES: () => (/* reexport safe */ _feature_flags__WEBPACK_IMPORTED_MODULE_3__.DISABLED_FLAG_VALUES),
  ETHEREUM_ADDRESS: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.ETHEREUM_ADDRESS),
  EXTENSION_SCRIPT: () => (/* reexport safe */ _script_names__WEBPACK_IMPORTED_MODULE_0__.EXTENSION_SCRIPT),
  FEATURE_FLAGS_OVERRIDES_KEY: () => (/* reexport safe */ _feature_flags__WEBPACK_IMPORTED_MODULE_3__.FEATURE_FLAGS_OVERRIDES_KEY),
  INPAGE_SCRIPT: () => (/* reexport safe */ _script_names__WEBPACK_IMPORTED_MODULE_0__.INPAGE_SCRIPT),
  IPFS_URL: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.IPFS_URL),
  KEYSTORE_VERSION: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.KEYSTORE_VERSION),
  KNOWN_CORE_DOMAINS: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_2__.KNOWN_CORE_DOMAINS),
  KeystoreFixtures: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.KeystoreFixtures),
  Monitoring: () => (/* reexport module object */ _monitoring__WEBPACK_IMPORTED_MODULE_1__),
  OFFSCREEN_SCRIPT: () => (/* reexport safe */ _script_names__WEBPACK_IMPORTED_MODULE_0__.OFFSCREEN_SCRIPT),
  SYNCED_DOMAINS: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_2__.SYNCED_DOMAINS),
  SeedlessRegistartionResult: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.SeedlessRegistartionResult),
  SolanaCaipId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.SolanaCaipId),
  USDC_ADDRESSES: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.USDC_ADDRESSES),
  USDC_ADDRESS_C_CHAIN: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.USDC_ADDRESS_C_CHAIN),
  USDC_ADDRESS_ETHEREUM: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.USDC_ADDRESS_ETHEREUM),
  USDC_ADDRESS_SOLANA: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.USDC_ADDRESS_SOLANA),
  WALLET_CONNECT_APP_METADATA: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_2__.WALLET_CONNECT_APP_METADATA),
  addGlacierAPIKeyIfNeeded: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.addGlacierAPIKeyIfNeeded),
  approveSeedlessRegistration: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.approveSeedlessRegistration),
  areArraysOverlapping: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.areArraysOverlapping),
  assert: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.assert),
  assertNonEmptyString: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.assertNonEmptyString),
  assertPresent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.assertPresent),
  assertPropDefined: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.assertPropDefined),
  assertTrue: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.assertTrue),
  authenticateWithApple: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.authenticateWithApple),
  authenticateWithGoogle: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.authenticateWithGoogle),
  base64ToBase64Url: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.base64ToBase64Url),
  base64UrlToBuffer: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.base64UrlToBuffer),
  bigintToBig: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.bigintToBig),
  blockchainToNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.blockchainToNetwork),
  bufferToBase64Url: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.bufferToBase64Url),
  buildBtcTx: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.buildBtcTx),
  buildGlacierAuthHeaders: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.buildGlacierAuthHeaders),
  caipToChainId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.caipToChainId),
  calculateGasAndFees: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.calculateGasAndFees),
  calculatePasswordHash: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.calculatePasswordHash),
  calculateTotalBalance: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.calculateTotalBalance),
  canSkipApproval: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.canSkipApproval),
  chainIdToCaip: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.chainIdToCaip),
  connectionLog: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.connectionLog),
  convertRequest: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.convertRequest),
  convertResult: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.convertResult),
  createNewMnemonic: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.createNewMnemonic),
  decorateWithCaipId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.decorateWithCaipId),
  decrypt: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.decrypt),
  disconnectLog: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.disconnectLog),
  engine: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.engine),
  eventLog: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.eventLog),
  extractKeysFromDecryptedFile: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.extractKeysFromDecryptedFile),
  fetchAndVerify: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.fetchAndVerify),
  filterBridgeStateToNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.filterBridgeStateToNetwork),
  filterFalseyValues: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.filterFalseyValues),
  findMatchingBridgeAsset: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.findMatchingBridgeAsset),
  findTokenForAsset: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.findTokenForAsset),
  formatAndLog: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.formatAndLog),
  formatTime: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.formatTime),
  getAccountKey: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getAccountKey),
  getAddressByVMType: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getAddressByVMType),
  getAddressForChain: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getAddressForChain),
  getAddressesInRange: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getAddressesInRange),
  getAllAddressesForAccount: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getAllAddressesForAccount),
  getAllAddressesForAccounts: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getAllAddressesForAccounts),
  getAvalancheAddressLink: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getAvalancheAddressLink),
  getAvaxAssetId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getAvaxAssetId),
  getBridgedAssetSymbol: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getBridgedAssetSymbol),
  getBtcInputUtxos: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getBtcInputUtxos),
  getCoreWebUrl: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getCoreWebUrl),
  getDefaultChainIds: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getDefaultChainIds),
  getEnabledBridgeTypes: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getEnabledBridgeTypes),
  getEnv: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getEnv),
  getExplorerAddress: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getExplorerAddress),
  getExplorerAddressByNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getExplorerAddressByNetwork),
  getExponentialBackoffDelay: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getExponentialBackoffDelay),
  getFireblocksBtcAccessErrorCode: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getFireblocksBtcAccessErrorCode),
  getHash: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getHash),
  getHexStringToBytes: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getHexStringToBytes),
  getNameSpaceFromScope: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getNameSpaceFromScope),
  getNativeTokenSymbol: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getNativeTokenSymbol),
  getNetworkCaipId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getNetworkCaipId),
  getNftMetadata: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getNftMetadata),
  getOidcClient: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getOidcClient),
  getOidcTokenProvider: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getOidcTokenProvider),
  getOrgId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getOrgId),
  getPriceChangeValues: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getPriceChangeValues),
  getProviderForNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getProviderForNetwork),
  getSignerSession: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getSignerSession),
  getSignerToken: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getSignerToken),
  getSmallImageForNFT: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getSmallImageForNFT),
  getSyncDomain: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getSyncDomain),
  getTokenValue: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getTokenValue),
  getUpdatedSigningData: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getUpdatedSigningData),
  getXPChainIds: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.getXPChainIds),
  groupTokensByType: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.groupTokensByType),
  handleTxOutcome: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.handleTxOutcome),
  hasAccountBalances: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.hasAccountBalances),
  hasDefined: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.hasDefined),
  hasUnconfirmedBalance: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.hasUnconfirmedBalance),
  i18next: () => (/* reexport safe */ _initI18n__WEBPACK_IMPORTED_MODULE_5__.i18next),
  incrementalPromiseResolve: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.incrementalPromiseResolve),
  initI18n: () => (/* reexport safe */ _initI18n__WEBPACK_IMPORTED_MODULE_5__.initI18n),
  ipfsResolverWithFallback: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.ipfsResolverWithFallback),
  is1155Response: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.is1155Response),
  isActiveTab: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isActiveTab),
  isAddressBlockedError: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isAddressBlockedError),
  isAvalancheChainId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isAvalancheChainId),
  isAvalancheNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isAvalancheNetwork),
  isBitcoin: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isBitcoin),
  isBitcoinCaipId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isBitcoinCaipId),
  isBitcoinChainId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isBitcoinChainId),
  isBitcoinNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isBitcoinNetwork),
  isBridgeConfigUpdateEventListener: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isBridgeConfigUpdateEventListener),
  isBridgeStateUpdateEventListener: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isBridgeStateUpdateEventListener),
  isBridgeTransferEventListener: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isBridgeTransferEventListener),
  isBtcAddressInNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isBtcAddressInNetwork),
  isContactValid: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isContactValid),
  isDevelopment: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isDevelopment),
  isErc721TokenBalance: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isErc721TokenBalance),
  isEthereumChainId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isEthereumChainId),
  isEthereumNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isEthereumNetwork),
  isExportRequestOutdated: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isExportRequestOutdated),
  isFailedMfaError: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isFailedMfaError),
  isFailedToFetchError: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isFailedToFetchError),
  isFireblocksAccount: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isFireblocksAccount),
  isFireblocksApiSupported: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isFireblocksApiSupported),
  isFulfilled: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isFulfilled),
  isImportedAccount: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isImportedAccount),
  isLedgerVersionCompatible: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isLedgerVersionCompatible),
  isLockStateChangedEvent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isLockStateChangedEvent),
  isNFT: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isNFT),
  isNewsletterConfigured: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isNewsletterConfigured),
  isNftTokenType: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isNftTokenType),
  isNonXPHistoryItem: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isNonXPHistoryItem),
  isNotNullish: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isNotNullish),
  isPchainNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isPchainNetwork),
  isPchainNetworkId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isPchainNetworkId),
  isPchainTxHistoryItem: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isPchainTxHistoryItem),
  isPendingBridgeTransaction: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isPendingBridgeTransaction),
  isPhraseCorrect: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isPhraseCorrect),
  isPrimaryAccount: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isPrimaryAccount),
  isPrimarySubnet: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isPrimarySubnet),
  isProductionBuild: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isProductionBuild),
  isSeedlessMfaChoiceRequest: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSeedlessMfaChoiceRequest),
  isSeedlessMfaEvent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSeedlessMfaEvent),
  isSeedlessMfaMethodsUpdatedEvent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSeedlessMfaMethodsUpdatedEvent),
  isSeedlessTokenEvent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSeedlessTokenEvent),
  isSessionPermissionsMismatchEvent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSessionPermissionsMismatchEvent),
  isSolanaChainId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSolanaChainId),
  isSolanaNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSolanaNetwork),
  isSupportedBrowser: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSupportedBrowser),
  isSwimmer: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSwimmer),
  isSwimmerByChainId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSwimmerByChainId),
  isSyncDomain: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isSyncDomain),
  isTokenExpiredError: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isTokenExpiredError),
  isTokenMalicious: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isTokenMalicious),
  isTokenWithBalanceAVM: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isTokenWithBalanceAVM),
  isTokenWithBalancePVM: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isTokenWithBalancePVM),
  isUnifiedBridgeStateUpdate: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isUnifiedBridgeStateUpdate),
  isUnifiedBridgeTransfer: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isUnifiedBridgeTransfer),
  isUnifiedBridgeTransferStepChanged: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isUnifiedBridgeTransferStepChanged),
  isUriGeneratedEvent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isUriGeneratedEvent),
  isUserRejectionError: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isUserRejectionError),
  isValidAddress: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isValidAddress),
  isValidAvmAddress: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isValidAvmAddress),
  isValidBtcAddress: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isValidBtcAddress),
  isValidHttpHeader: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isValidHttpHeader),
  isValidPvmAddress: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isValidPvmAddress),
  isValidResponse: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isValidResponse),
  isValidSvmAddress: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isValidSvmAddress),
  isValidXPAddress: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isValidXPAddress),
  isWalletConnectAccount: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isWalletConnectAccount),
  isWalletConnectEvent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isWalletConnectEvent),
  isWalletStateUpdateEvent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isWalletStateUpdateEvent),
  isWrappedError: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isWrappedError),
  isXchainNetwork: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isXchainNetwork),
  isXchainNetworkId: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.isXchainNetworkId),
  launchFidoFlow: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.launchFidoFlow),
  lowerCaseKeys: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.lowerCaseKeys),
  makeBNLike: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.makeBNLike),
  mapAddressesToVMs: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.mapAddressesToVMs),
  mapMfasToRecoveryMethods: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.mapMfasToRecoveryMethods),
  mapVMAddresses: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.mapVMAddresses),
  measureDuration: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.measureDuration),
  networkToBlockchain: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.networkToBlockchain),
  noop: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.noop),
  normalizeBalance: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.normalizeBalance),
  now: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.now),
  omitUndefined: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.omitUndefined),
  onPageActivated: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.onPageActivated),
  openExtensionNewWindow: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.openExtensionNewWindow),
  openFullscreenTab: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.openFullscreenTab),
  openNewTab: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.openNewTab),
  openPopup: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.openPopup),
  openWindow: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.openWindow),
  padStart: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.padStart),
  parseAttributes: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.parseAttributes),
  parseRawAttributesString: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.parseRawAttributesString),
  readKeyFile: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.readKeyFile),
  reload: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.reload),
  repeat: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.repeat),
  requestLog: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.requestLog),
  requestOidcAuth: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.requestOidcAuth),
  requestParser: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.requestParser),
  resolve: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.resolve),
  responseLog: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.responseLog),
  responseParser: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.responseParser),
  shouldUseWalletConnectApproval: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.shouldUseWalletConnectApproval),
  signUpForNewsletter: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.signUpForNewsletter),
  stateLog: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.stateLog),
  stringToBigint: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.stringToBigint),
  stripAddressPrefix: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.stripAddressPrefix),
  sumByProperty: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.sumByProperty),
  supportedBrowsers: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.supportedBrowsers),
  toLogger: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.toLogger),
  toPrecision: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.toPrecision),
  truncateAddress: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.truncateAddress),
  updateIfDifferent: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.updateIfDifferent),
  validateBtcSend: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.validateBtcSend),
  wordPhraseLength: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.wordPhraseLength),
  wrapError: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_4__.wrapError)
});
/* ESM import */var _script_names__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/script-names.ts");
/* ESM import */var _monitoring__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/monitoring/index.ts");
/* ESM import */var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/constants.ts");
/* ESM import */var _feature_flags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/src/feature-flags.ts");
/* ESM import */var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/src/utils/index.ts");
/* ESM import */var _initI18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../common/src/initI18n.ts");








}),
"../common/src/initI18n.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  i18next: () => (/* reexport safe */ i18next__WEBPACK_IMPORTED_MODULE_0__["default"]),
  initI18n: () => (initI18n)
});
/* ESM import */var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/i18next/dist/esm/i18next.js");
/* ESM import */var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/react-i18next/dist/es/context.js");
/* ESM import */var i18next_http_backend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/i18next-http-backend/esm/index.js");



const initI18n = ()=>i18next__WEBPACK_IMPORTED_MODULE_0__["default"].use(react_i18next__WEBPACK_IMPORTED_MODULE_2__.initReactI18next).use(i18next_http_backend__WEBPACK_IMPORTED_MODULE_1__["default"]) // Registering the back-end plugin
    .init({
        // Remove resources from here
        lng: 'en',
        fallbackLng: 'en',
        supportedLngs: [
            'en',
            'de-DE',
            'hi-IN',
            'ko-KR',
            'ru-RU',
            'tr-TR',
            'zh-CN',
            'zh-TW',
            'es-EM',
            'ja-JP',
            'fr-FR'
        ],
        load: 'currentOnly',
        interpolation: {
            escapeValue: false
        },
        // turn on if you want to print out to the console the whole translation object (e.g. check your key and value has been added to the json)
        debug: false
    });



}),
"../common/src/monitoring/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SentryExceptionTypes: () => (/* reexport safe */ _sentryCaptureException__WEBPACK_IMPORTED_MODULE_0__.SentryExceptionTypes),
  sentryCaptureException: () => (/* reexport safe */ _sentryCaptureException__WEBPACK_IMPORTED_MODULE_0__["default"]),
  sharedSentryConfig: () => (/* reexport safe */ _sharedSentryConfig__WEBPACK_IMPORTED_MODULE_1__["default"])
});
/* ESM import */var _sentryCaptureException__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/monitoring/sentryCaptureException.ts");
/* ESM import */var _sharedSentryConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/monitoring/sharedSentryConfig.ts");





}),
"../common/src/monitoring/sentryCaptureException.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SentryExceptionTypes: () => (SentryExceptionTypes),
  "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});
/* ESM import */var _sentry_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@sentry/core/esm/exports.js");

var SentryExceptionTypes = /*#__PURE__*/ function(SentryExceptionTypes) {
    // dApp
    SentryExceptionTypes["DAPP_CONNECTION_EVENT"] = "dAppConnectionEvent";
    // extension
    SentryExceptionTypes["EXTENSION_CONNECTION_MESSAGE"] = "extensionConnectionMessage";
    SentryExceptionTypes["EXTENSION_CONNECTION_EVENT"] = "extensionConnectionEvent";
    SentryExceptionTypes["SWAP"] = "swap";
    SentryExceptionTypes["AI_AGENT"] = "aiAgent";
    // ledger
    SentryExceptionTypes["LEDGER"] = "ledger";
    SentryExceptionTypes["WALLETCONNECT"] = "walletConnect";
    SentryExceptionTypes["SEEDLESS"] = "seedless";
    SentryExceptionTypes["FIREBLOCKS"] = "fireblocks";
    SentryExceptionTypes["UNIFIED_BRIDGE"] = "unifiedBridge";
    SentryExceptionTypes["ANALYTICS"] = "analytics";
    SentryExceptionTypes["WALLET_IMPORT"] = "walletImport";
    SentryExceptionTypes["INTERNAL_ERROR"] = "internalError";
    SentryExceptionTypes["BALANCES"] = "balances";
    SentryExceptionTypes["VM_MODULES"] = "vmModules";
    SentryExceptionTypes["ONBOARDING"] = "onboarding";
    SentryExceptionTypes["FIREBASE"] = "firebase";
    SentryExceptionTypes["NOTIFICATIONS"] = "notifications";
    return SentryExceptionTypes;
}({});
// wrapper to make error reporting contexts unfirom accross the codebase
const sentryCaptureException = (error, type)=>_sentry_browser__WEBPACK_IMPORTED_MODULE_0__.captureException(error, {
        tags: {
            type
        }
    });
/* ESM default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sentryCaptureException);


}),
"../common/src/monitoring/sharedSentryConfig.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);

const sharedSentryConfig = {
    dsn: "",
    environment:  false || 'dev',
    release: `core-extension@${webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getManifest().version}`,
    debug: "" === 'true',
    tracesSampleRate: 0.003,
    ignoreErrors: [
        /Attempting to use a disconnected port object/,
        /^.*The user aborted a request\.$/,
        /^.*could not detect network.*$/,
        /^.*Failed to fetch$/,
        /AbortError: Registration failed - push service error/,
        /^.*NotAllowedError: Registration failed - permission denied/
    ]
};
/* ESM default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sharedSentryConfig);


}),
"../common/src/script-names.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  CONTENT_SCRIPT: () => (CONTENT_SCRIPT),
  EXTENSION_SCRIPT: () => (EXTENSION_SCRIPT),
  INPAGE_SCRIPT: () => (INPAGE_SCRIPT),
  OFFSCREEN_SCRIPT: () => (OFFSCREEN_SCRIPT)
});
const CONTENT_SCRIPT = 'avalanche-contentscript';
const EXTENSION_SCRIPT = 'avalanche-extension';
const INPAGE_SCRIPT = 'avalanche-inpage';
const OFFSCREEN_SCRIPT = 'avalanche-offscreen';


}),
"../common/src/utils/account.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getAllAddressesForAccount: () => (getAllAddressesForAccount),
  getAllAddressesForAccounts: () => (getAllAddressesForAccounts)
});
function getAllAddressesForAccount(acc) {
    return [
        acc.addressC,
        acc.addressBTC,
        acc.addressAVM,
        acc.addressPVM,
        acc.addressCoreEth,
        acc.addressHVM,
        acc.addressSVM
    ].filter((addr)=>typeof addr === 'string');
}
function getAllAddressesForAccounts(accounts) {
    return accounts.flatMap(getAllAddressesForAccount).filter((v)=>typeof v === 'string');
}


}),
"../common/src/utils/accounts/accountTypeGuards.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isFireblocksAccount: () => (isFireblocksAccount),
  isImportedAccount: () => (isImportedAccount),
  isPrimaryAccount: () => (isPrimaryAccount),
  isWalletConnectAccount: () => (isWalletConnectAccount)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");

const isFireblocksAccount = (account)=>account?.type === _core_types__WEBPACK_IMPORTED_MODULE_0__.AccountType.FIREBLOCKS;
const isWalletConnectAccount = (account)=>account?.type === _core_types__WEBPACK_IMPORTED_MODULE_0__.AccountType.WALLET_CONNECT;
const isPrimaryAccount = (account)=>account?.type === _core_types__WEBPACK_IMPORTED_MODULE_0__.AccountType.PRIMARY;
const isImportedAccount = (account)=>Boolean(account) && !isPrimaryAccount(account);


}),
"../common/src/utils/accounts/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isFireblocksAccount: () => (/* reexport safe */ _accountTypeGuards__WEBPACK_IMPORTED_MODULE_0__.isFireblocksAccount),
  isImportedAccount: () => (/* reexport safe */ _accountTypeGuards__WEBPACK_IMPORTED_MODULE_0__.isImportedAccount),
  isPrimaryAccount: () => (/* reexport safe */ _accountTypeGuards__WEBPACK_IMPORTED_MODULE_0__.isPrimaryAccount),
  isWalletConnectAccount: () => (/* reexport safe */ _accountTypeGuards__WEBPACK_IMPORTED_MODULE_0__.isWalletConnectAccount)
});
/* ESM import */var _accountTypeGuards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/accounts/accountTypeGuards.ts");



}),
"../common/src/utils/actions/getUpdatedActionData.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getUpdatedSigningData: () => (getUpdatedSigningData)
});
const getUpdatedSigningData = (oldSigningData, newSigningData)=>{
    if (!oldSigningData) {
        return newSigningData;
    } else if (!newSigningData) {
        return oldSigningData;
    }
    return {
        ...oldSigningData,
        ...newSigningData
    };
};


}),
"../common/src/utils/address.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getAddressByVMType: () => (getAddressByVMType),
  getAddressesInRange: () => (getAddressesInRange),
  mapAddressesToVMs: () => (mapAddressesToVMs),
  mapVMAddresses: () => (mapVMAddresses)
});
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/utils/getAddressFromXpub.js");
/* ESM import */var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/vm-module-types/dist/index.js");
/* ESM import */var _object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/object.ts");



const mapVMAddresses = (addresses)=>(0,_object__WEBPACK_IMPORTED_MODULE_1__.omitUndefined)({
        addressC: addresses[_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.EVM],
        addressBTC: addresses[_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.BITCOIN] || undefined,
        addressAVM: addresses[_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.AVM] || undefined,
        addressPVM: addresses[_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.PVM] || undefined,
        addressCoreEth: addresses[_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.CoreEth] || undefined,
        addressHVM: addresses[_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.HVM] || undefined,
        addressSVM: addresses[_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.SVM] || undefined
    });
const mapAddressesToVMs = (account)=>(0,_object__WEBPACK_IMPORTED_MODULE_1__.omitUndefined)({
        [_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.EVM]: account.addressC,
        [_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.BITCOIN]: account.addressBTC,
        [_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.AVM]: account.addressAVM,
        [_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.PVM]: account.addressPVM,
        [_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.CoreEth]: account.addressCoreEth,
        [_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.HVM]: account.addressHVM,
        [_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.SVM]: account.addressSVM
    });
const getAddressByVMType = (account, vmType)=>mapAddressesToVMs(account)[vmType];
function getAddressesInRange(xpubXP, providerXP, internal = false, start = 0, limit = 64) {
    const addresses = [];
    for(let i = start; i < start + limit; i++){
        addresses.push(_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_2__.getAddressFromXpub(xpubXP, i, providerXP, 'P', internal).split('-')[1]);
    }
    return addresses;
}


}),
"../common/src/utils/approveSeedlessRegistration.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SeedlessRegistartionResult: () => (SeedlessRegistartionResult),
  approveSeedlessRegistration: () => (approveSeedlessRegistration)
});
var SeedlessRegistartionResult = /*#__PURE__*/ function(SeedlessRegistartionResult) {
    SeedlessRegistartionResult["ALREADY_REGISTERED"] = "ALREADY_REGISTERED";
    SeedlessRegistartionResult["APPROVED"] = "APPROVED";
    SeedlessRegistartionResult["ERROR"] = "ERROR";
    return SeedlessRegistartionResult;
}({});
var SeedlessRegistartionResponseTextStatus = /*#__PURE__*/ function(SeedlessRegistartionResponseTextStatus) {
    SeedlessRegistartionResponseTextStatus["ALREADY_REGISTERED"] = "ALREADY_REGISTERED";
    SeedlessRegistartionResponseTextStatus["APPROVED"] = "ok";
    return SeedlessRegistartionResponseTextStatus;
}(SeedlessRegistartionResponseTextStatus || {});
async function approveSeedlessRegistration(identityProof, isMfaRequired) {
    return fetch("https://seedless-api.avax-test.network" + `/v1/register?mfa-required=${isMfaRequired ? 'true' : 'false'}`, {
        method: 'POST',
        body: JSON.stringify(identityProof),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (response)=>{
        const { message } = await response.json();
        if (message === "ALREADY_REGISTERED") {
            return "ALREADY_REGISTERED";
        }
        if (message === "ok") {
            return "APPROVED";
        }
        throw new Error(message);
    }).catch(()=>{
        return "ERROR";
    });
}


}),
"../common/src/utils/array.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  areArraysOverlapping: () => (areArraysOverlapping)
});
const areArraysOverlapping = (listA, listB)=>{
    return listA.some((itemFromA)=>listB.includes(itemFromA));
};


}),
"../common/src/utils/assertions.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  assert: () => (assert),
  assertNonEmptyString: () => (assertNonEmptyString),
  assertPresent: () => (assertPresent),
  assertPropDefined: () => (assertPropDefined),
  assertTrue: () => (assertTrue)
});
/* ESM import */var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/eth-rpc-errors/dist/index.js");
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/index.ts");
/* provided dependency */ var Buffer = __webpack_require__("../../node_modules/buffer/index.js")["Buffer"];


function assertPresent(value, reason, context) {
    const isNullish = typeof value === 'undefined' || value === null;
    const isEmptyBuffer = Buffer.isBuffer(value) && value.length === 0;
    if (isNullish || isEmptyBuffer || value === '') {
        throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.internal({
            data: {
                reason: reason ?? _core_types__WEBPACK_IMPORTED_MODULE_1__.CommonError.Unknown,
                context
            }
        });
    }
}
function assertPropDefined(obj, prop, reason) {
    assertPresent(obj[prop], reason);
}
function assertNonEmptyString(value) {
    if (typeof value !== 'string' || value === '') {
        throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.internal({
            data: {
                reason: 'Expected non-empty string',
                value
            }
        });
    }
}
function assertTrue(condition) {
    if (condition !== true) {
        throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.internal({
            data: {
                reason: 'Expected condition to evaluate as true',
                evaluationResult: condition
            }
        });
    }
}
function assert(value, reason) {
    if (!value) {
        throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.internal({
            data: {
                reason: reason ?? _core_types__WEBPACK_IMPORTED_MODULE_1__.CommonError.Unknown
            }
        });
    }
}


}),
"../common/src/utils/balance/getPriceChangeValues.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getPriceChangeValues: () => (getPriceChangeValues)
});
function getPriceChangeValues(tokenSymbol, balanceInCurrency, priceChanges) {
    if (!priceChanges) {
        return {
            percentage: undefined,
            value: 0
        };
    }
    const symbol = tokenSymbol.toLowerCase();
    const tokenChangePercentage = priceChanges[symbol]?.priceChangePercentage;
    const tokenChangeValue = (balanceInCurrency || 0) * ((priceChanges[symbol]?.priceChangePercentage || 0) / 100);
    return {
        percentage: tokenChangePercentage,
        value: tokenChangeValue
    };
}


}),
"../common/src/utils/balance/getTokenValue.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getTokenValue: () => (getTokenValue)
});
function getTokenValue(decimals, amount) {
    return amount === undefined ? 0 : amount / 10 ** decimals;
}


}),
"../common/src/utils/balance/groupTokensByType.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  groupTokensByType: () => (groupTokensByType)
});
/* ESM import */var _nfts_isNFT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/nfts/isNFT.ts");

function groupTokensByType(balances) {
    const nfts = {};
    const tokens = {};
    if (!balances) {
        return {
            tokens,
            nfts
        };
    }
    for(const address in balances){
        const nftsForAddress = {};
        const tokensForAddress = {};
        for(const tokenId in balances[address]){
            const token = balances[address]?.[tokenId];
            if (!token) {
                continue;
            }
            if ((0,_nfts_isNFT__WEBPACK_IMPORTED_MODULE_0__.isNFT)(token)) {
                nftsForAddress[tokenId] = token;
            } else {
                tokensForAddress[tokenId] = token;
            }
        }
        nfts[address] = nftsForAddress;
        tokens[address] = tokensForAddress;
    }
    return {
        nfts,
        tokens
    };
}


}),
"../common/src/utils/balance/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getPriceChangeValues: () => (/* reexport safe */ _getPriceChangeValues__WEBPACK_IMPORTED_MODULE_0__.getPriceChangeValues),
  getTokenValue: () => (/* reexport safe */ _getTokenValue__WEBPACK_IMPORTED_MODULE_1__.getTokenValue),
  groupTokensByType: () => (/* reexport safe */ _groupTokensByType__WEBPACK_IMPORTED_MODULE_2__.groupTokensByType),
  isTokenWithBalanceAVM: () => (/* reexport safe */ _isTokenWithBalanceAVM__WEBPACK_IMPORTED_MODULE_3__.isTokenWithBalanceAVM),
  isTokenWithBalancePVM: () => (/* reexport safe */ _isTokenWithBalancePVM__WEBPACK_IMPORTED_MODULE_4__.isTokenWithBalancePVM)
});
/* ESM import */var _getPriceChangeValues__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/balance/getPriceChangeValues.ts");
/* ESM import */var _getTokenValue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/balance/getTokenValue.ts");
/* ESM import */var _groupTokensByType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/balance/groupTokensByType.ts");
/* ESM import */var _isTokenWithBalanceAVM__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/src/utils/balance/isTokenWithBalanceAVM.ts");
/* ESM import */var _isTokenWithBalancePVM__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/src/utils/balance/isTokenWithBalancePVM.ts");







}),
"../common/src/utils/balance/isTokenWithBalanceAVM.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isTokenWithBalanceAVM: () => (isTokenWithBalanceAVM)
});
const isTokenWithBalanceAVM = (balance)=>{
    if (!balance) {
        return false;
    }
    return 'balancePerType' in balance && 'locked' in balance.balancePerType;
};


}),
"../common/src/utils/balance/isTokenWithBalancePVM.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isTokenWithBalancePVM: () => (isTokenWithBalancePVM)
});
const isTokenWithBalancePVM = (balance)=>{
    if (!balance) {
        return false;
    }
    return 'balancePerType' in balance && 'lockedStaked' in balance.balancePerType;
};


}),
"../common/src/utils/bigintToBig.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  bigintToBig: () => (bigintToBig)
});
/* ESM import */var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/@avalabs/core-utils-sdk/esm/bnToBig.js");
/* ESM import */var bn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/bn.js/lib/bn.js");
/* ESM import */var bn_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bn_js__WEBPACK_IMPORTED_MODULE_0__);


function bigintToBig(amount, denomination) {
    return (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_1__.bnToBig)(new bn_js__WEBPACK_IMPORTED_MODULE_0__.BN(amount.toString()), denomination);
}


}),
"../common/src/utils/bridge/blockchainConversion.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  blockchainToNetwork: () => (blockchainToNetwork),
  networkToBlockchain: () => (networkToBlockchain)
});
/* ESM import */var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/@avalabs/core-bridge-sdk/esm/types/config.js");
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* ESM import */var _caipConversion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/caipConversion.ts");



const blockchainToNetwork = (blockChain, networks, bridgeConfig, isTestnet)=>{
    if (typeof blockChain === 'object') {
        // We got a Chain from @avalabs/bridge-unified
        const chain = networks.find((network)=>network.chainId === (0,_caipConversion__WEBPACK_IMPORTED_MODULE_0__.caipToChainId)(blockChain.chainId));
        if (!chain) {
            throw new Error('Blockchain not supported');
        }
        return chain;
    }
    switch(blockChain){
        case _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.AVALANCHE:
            return networks.find((network)=>network.chainId === bridgeConfig.config?.critical.networks[_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.AVALANCHE]);
        case _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.ETHEREUM:
            {
                return networks.find((network)=>network.chainId === bridgeConfig.config?.critical.networks[_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.ETHEREUM]);
            }
        case _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.BITCOIN:
            return networks.find((network)=>{
                if (isTestnet === undefined) {
                    return network.chainId === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.BITCOIN_TESTNET || network.chainId === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.BITCOIN;
                }
                return isTestnet ? network.chainId === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.BITCOIN_TESTNET : network.chainId === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.BITCOIN;
            });
        default:
            throw new Error('Blockchain not supported');
    }
};
const networkToBlockchain = (network)=>{
    const chainId = typeof network?.chainId === 'string' ? (0,_caipConversion__WEBPACK_IMPORTED_MODULE_0__.caipToChainId)(network.chainId) : network?.chainId;
    switch(chainId){
        case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.AVALANCHE_MAINNET_ID:
        case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.AVALANCHE_LOCAL_ID:
        case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.AVALANCHE_TESTNET_ID:
            return _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.AVALANCHE;
        case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.ETHEREUM_HOMESTEAD:
        case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.ETHEREUM_TEST_RINKEBY:
        case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.ETHEREUM_TEST_GOERLY:
        case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.ETHEREUM_TEST_SEPOLIA:
            return _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.ETHEREUM;
        case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.BITCOIN:
        case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.ChainId.BITCOIN_TESTNET:
            return _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.BITCOIN;
        default:
            return _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.UNKNOWN;
    }
};


}),
"../common/src/utils/bridge/bridgeEventFilters.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isBridgeConfigUpdateEventListener: () => (isBridgeConfigUpdateEventListener),
  isBridgeStateUpdateEventListener: () => (isBridgeStateUpdateEventListener),
  isBridgeTransferEventListener: () => (isBridgeTransferEventListener),
  isUnifiedBridgeStateUpdate: () => (isUnifiedBridgeStateUpdate),
  isUnifiedBridgeTransferStepChanged: () => (isUnifiedBridgeTransferStepChanged)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");

function isBridgeStateUpdateEventListener(evt) {
    return evt.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.BridgeEvents.BRIDGE_STATE_UPDATE_EVENT;
}
function isBridgeConfigUpdateEventListener(evt) {
    return evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT;
}
function isBridgeTransferEventListener(evt) {
    return evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.BridgeEvents.BRIDGE_TRANSFER_EVENT;
}
const isUnifiedBridgeStateUpdate = (ev)=>ev.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.UnifiedBridgeEvent.StateUpdated;
const isUnifiedBridgeTransferStepChanged = (ev)=>ev.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.UnifiedBridgeEvent.TransferStepChange;


}),
"../common/src/utils/bridge/filterBridgeStateToNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  filterBridgeStateToNetwork: () => (filterBridgeStateToNetwork)
});
/* ESM import */var _network_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/network/isBitcoinNetwork.ts");
/* ESM import */var _network_isAvalancheNetwork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/network/isAvalancheNetwork.ts");
/* ESM import */var _network_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/network/isEthereumNetwork.ts");



var BridgeNetwork = /*#__PURE__*/ function(BridgeNetwork) {
    BridgeNetwork["AVALANCHE"] = "avalanche";
    BridgeNetwork["BITCOIN"] = "bitcoin";
    BridgeNetwork["ETHEREUM"] = "ethereum";
    return BridgeNetwork;
}(BridgeNetwork || {});
/**
 * Remove bridgeTransactions that don't belong to the given network.
 */ function filterBridgeStateToNetwork(bridge, network) {
    const networkNameToCheck = (0,_network_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_0__.isBitcoinNetwork)(network) ? "bitcoin" : (0,_network_isAvalancheNetwork__WEBPACK_IMPORTED_MODULE_1__.isAvalancheNetwork)(network) ? "avalanche" : (0,_network_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_2__.isEthereumNetwork)(network) ? "ethereum" : null;
    const isMainnet = !network.isTestnet;
    const bridgeTransactions = Object.values(bridge.bridgeTransactions).reduce((txs, btx)=>{
        if ((btx.sourceChain.valueOf() === networkNameToCheck || btx.targetChain.valueOf() === networkNameToCheck) && btx.environment === (isMainnet ? 'main' : 'test')) {
            txs[btx.sourceTxHash] = btx;
        }
        return txs;
    }, {});
    return {
        ...bridge,
        bridgeTransactions
    };
}


}),
"../common/src/utils/bridge/findMatchingBridgeAsset.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  findMatchingBridgeAsset: () => (findMatchingBridgeAsset)
});
/* ESM import */var _avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/bridge-unified/dist/index.js");
/* ESM import */var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/@avalabs/vm-module-types/dist/index.js");


const findMatchingBridgeAsset = (assets, token)=>{
    return assets.find((a)=>{
        if (a.type === _avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__.TokenType.NATIVE && token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.NATIVE) {
            return a.symbol.toLowerCase() === token.symbol.toLowerCase();
        }
        if (a.type === _avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC20 && token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.ERC20) {
            return a.address.toLowerCase() === token.address.toLowerCase();
        }
        return false;
    });
};


}),
"../common/src/utils/bridge/getBridgedAssetSymbol.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getBridgedAssetSymbol: () => (getBridgedAssetSymbol)
});
/* ESM import */var _isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/bridge/isUnifiedBridgeTransfer.ts");

const getBridgedAssetSymbol = (tx)=>{
    if ((0,_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_0__.isUnifiedBridgeTransfer)(tx)) {
        return tx.asset.symbol;
    }
    return tx.symbol;
};


}),
"../common/src/utils/bridge/getNativeTokenSymbol.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getNativeTokenSymbol: () => (getNativeTokenSymbol)
});
/* ESM import */var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-bridge-sdk/esm/utils/getNativeSymbol.js");

const getNativeTokenSymbol = (chain)=>{
    if (typeof chain === 'object') {
        return chain.networkToken.symbol;
    }
    return (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.getNativeSymbol)(chain);
};


}),
"../common/src/utils/bridge/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  blockchainToNetwork: () => (/* reexport safe */ _blockchainConversion__WEBPACK_IMPORTED_MODULE_0__.blockchainToNetwork),
  filterBridgeStateToNetwork: () => (/* reexport safe */ _filterBridgeStateToNetwork__WEBPACK_IMPORTED_MODULE_7__.filterBridgeStateToNetwork),
  findMatchingBridgeAsset: () => (/* reexport safe */ _findMatchingBridgeAsset__WEBPACK_IMPORTED_MODULE_1__.findMatchingBridgeAsset),
  getBridgedAssetSymbol: () => (/* reexport safe */ _getBridgedAssetSymbol__WEBPACK_IMPORTED_MODULE_2__.getBridgedAssetSymbol),
  getNativeTokenSymbol: () => (/* reexport safe */ _getNativeTokenSymbol__WEBPACK_IMPORTED_MODULE_5__.getNativeTokenSymbol),
  isAddressBlockedError: () => (/* reexport safe */ _isAddressBlockedError__WEBPACK_IMPORTED_MODULE_3__.isAddressBlockedError),
  isBridgeConfigUpdateEventListener: () => (/* reexport safe */ _bridgeEventFilters__WEBPACK_IMPORTED_MODULE_6__.isBridgeConfigUpdateEventListener),
  isBridgeStateUpdateEventListener: () => (/* reexport safe */ _bridgeEventFilters__WEBPACK_IMPORTED_MODULE_6__.isBridgeStateUpdateEventListener),
  isBridgeTransferEventListener: () => (/* reexport safe */ _bridgeEventFilters__WEBPACK_IMPORTED_MODULE_6__.isBridgeTransferEventListener),
  isUnifiedBridgeStateUpdate: () => (/* reexport safe */ _bridgeEventFilters__WEBPACK_IMPORTED_MODULE_6__.isUnifiedBridgeStateUpdate),
  isUnifiedBridgeTransfer: () => (/* reexport safe */ _isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_4__.isUnifiedBridgeTransfer),
  isUnifiedBridgeTransferStepChanged: () => (/* reexport safe */ _bridgeEventFilters__WEBPACK_IMPORTED_MODULE_6__.isUnifiedBridgeTransferStepChanged),
  networkToBlockchain: () => (/* reexport safe */ _blockchainConversion__WEBPACK_IMPORTED_MODULE_0__.networkToBlockchain)
});
/* ESM import */var _blockchainConversion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/bridge/blockchainConversion.ts");
/* ESM import */var _findMatchingBridgeAsset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/bridge/findMatchingBridgeAsset.ts");
/* ESM import */var _getBridgedAssetSymbol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/bridge/getBridgedAssetSymbol.ts");
/* ESM import */var _isAddressBlockedError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/src/utils/bridge/isAddressBlockedError.ts");
/* ESM import */var _isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/src/utils/bridge/isUnifiedBridgeTransfer.ts");
/* ESM import */var _getNativeTokenSymbol__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../common/src/utils/bridge/getNativeTokenSymbol.ts");
/* ESM import */var _bridgeEventFilters__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../common/src/utils/bridge/bridgeEventFilters.ts");
/* ESM import */var _filterBridgeStateToNetwork__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../common/src/utils/bridge/filterBridgeStateToNetwork.ts");










}),
"../common/src/utils/bridge/isAddressBlockedError.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isAddressBlockedError: () => (isAddressBlockedError)
});
/* ESM import */var _avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/bridge-unified/dist/index.js");

const isAddressBlockedError = (err)=>{
    return !!err && err instanceof Error && err.message === _avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__.ErrorReason.ADDRESS_IS_BLOCKED;
};


}),
"../common/src/utils/bridge/isUnifiedBridgeTransfer.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isUnifiedBridgeTransfer: () => (isUnifiedBridgeTransfer)
});
const isUnifiedBridgeTransfer = (transfer)=>{
    return transfer !== undefined && 'type' in transfer;
};


}),
"../common/src/utils/bridgeTransactionUtils.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ETHEREUM_ADDRESS: () => (ETHEREUM_ADDRESS),
  isPendingBridgeTransaction: () => (isPendingBridgeTransaction)
});
const ETHEREUM_ADDRESS = '0x0000000000000000000000000000000000000000';
function isPendingBridgeTransaction(item) {
    return 'addressBTC' in item || 'sourceChain' in item;
}


}),
"../common/src/utils/caipConversion.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AvaxCaipId: () => (AvaxCaipId),
  AvaxLegacyCaipId: () => (AvaxLegacyCaipId),
  BitcoinCaipId: () => (BitcoinCaipId),
  CaipNamespace: () => (CaipNamespace),
  SolanaCaipId: () => (SolanaCaipId),
  caipToChainId: () => (caipToChainId),
  chainIdToCaip: () => (chainIdToCaip),
  decorateWithCaipId: () => (decorateWithCaipId),
  getNameSpaceFromScope: () => (getNameSpaceFromScope),
  getNetworkCaipId: () => (getNetworkCaipId),
  isBitcoinCaipId: () => (isBitcoinCaipId)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/bitcoin.chain.js");
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/avalanche.chain.js");
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/providers/constants.js");
/* ESM import */var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/vm-module-types/dist/index.js");



var CaipNamespace = /*#__PURE__*/ function(CaipNamespace) {
    CaipNamespace["AVAX"] = "avax";
    CaipNamespace["BIP122"] = "bip122";
    CaipNamespace["EIP155"] = "eip155";
    CaipNamespace["HVM"] = "hvm";
    CaipNamespace["SOLANA"] = "solana";
    return CaipNamespace;
}({});
const BitcoinCaipId = {
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.BITCOIN]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.BitcoinCaip2ChainId.MAINNET,
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.BITCOIN_TESTNET]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.BitcoinCaip2ChainId.TESTNET
};
const SolanaCaipId = {
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.SOLANA_MAINNET_ID]: `${"solana"}:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`,
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.SOLANA_DEVNET_ID]: `${"solana"}:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`,
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.SOLANA_TESTNET_ID]: `${"solana"}:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z`
};
const AvaxLegacyCaipId = {
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_P]: `${"avax"}:${_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__.MainnetContext.pBlockchainID}`,
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_X]: `${"avax"}:${_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__.MainnetContext.xBlockchainID}`,
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_TEST_P]: `${"avax"}:fuji${_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__.FujiContext.pBlockchainID}`,
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_TEST_X]: `${"avax"}:fuji${_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__.FujiContext.xBlockchainID}`
};
const AvaxCaipId = {
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_P]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_4__.AvalancheCaip2ChainId.P,
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_X]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_4__.AvalancheCaip2ChainId.X,
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_TEST_P]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_4__.AvalancheCaip2ChainId.P_TESTNET,
    [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_TEST_X]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_4__.AvalancheCaip2ChainId.X_TESTNET
};
const getNetworkCaipId = (network)=>{
    if (network.caipId) {
        return network.caipId;
    } else if (network.caip2Id) {
        return network.caip2Id;
    }
    if (network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.EVM) {
        return `eip155:${network.chainId}`;
    }
    if (network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.BITCOIN) {
        return BitcoinCaipId[network.chainId];
    }
    const isXChain = network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.AVM;
    const isPChain = network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.PVM;
    if (isXChain || isPChain) {
        return AvaxCaipId[network.chainId];
    }
    if (network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.HVM) {
        return `hvm:${network.chainId}`;
    }
    throw new Error('Unsupported VM type: ' + network.vmName);
};
const caipToChainId = (identifier)=>{
    const [namespace, reference] = identifier.split(':');
    if (!namespace) {
        throw new Error('No namespace found in identifier: ' + identifier);
    }
    if (!reference) {
        throw new Error('No reference found in identifier: ' + identifier);
    }
    if (namespace === "eip155") {
        return Number(reference);
    }
    if (reference.length === 32 && namespace === "hvm") {
        return parseInt(reference.slice(0, 16), 16);
    }
    if (namespace === "solana") {
        const chainId = Object.keys(SolanaCaipId).find((chainIdLookup)=>SolanaCaipId[chainIdLookup] === identifier);
        if (!chainId) {
            throw new Error('No chainId match for CAIP identifier: ' + identifier);
        }
        return Number(chainId);
    }
    if (namespace === "bip122") {
        const chainId = Object.keys(BitcoinCaipId).find((chainIdLookup)=>BitcoinCaipId[chainIdLookup] === identifier);
        if (!chainId) {
            throw new Error('No chainId match for CAIP identifier: ' + identifier);
        }
        return Number(chainId);
    }
    if (namespace === "avax") {
        const chainId = Object.keys(AvaxCaipId).find((chainIdLookup)=>AvaxCaipId[chainIdLookup] === identifier || AvaxLegacyCaipId[chainIdLookup] === identifier);
        if (!chainId) {
            throw new Error('No chainId match for CAIP identifier: ' + identifier);
        }
        return Number(chainId);
    }
    throw new Error('No chainId match for CAIP identifier: ' + identifier);
};
const chainIdToCaip = (chainId)=>{
    return BitcoinCaipId[chainId] ?? AvaxCaipId[chainId] ?? `eip155:${chainId}`;
};
const decorateWithCaipId = (network)=>({
        ...network,
        caipId: getNetworkCaipId(network)
    });
const getNameSpaceFromScope = (scope)=>{
    if (!scope) {
        return null;
    }
    const [namespace] = scope.split(':');
    return namespace;
};
const isBitcoinCaipId = (caipId)=>Object.values(BitcoinCaipId).includes(caipId);


}),
"../common/src/utils/calculateGasAndFees.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  calculateGasAndFees: () => (calculateGasAndFees)
});
/* ESM import */var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");

function calculateGasAndFees({ gasPrice, maxFeePerGas, maxPriorityFeePerGas, tokenPrice, tokenDecimals = 18, gasLimit }) {
    const pricePerGas = maxFeePerGas ?? gasPrice;
    if (pricePerGas == null) {
        throw new Error('Please provide gasPrice or maxFeePerGas parameters');
    }
    const bnFee = gasLimit ? pricePerGas * BigInt(gasLimit) : pricePerGas;
    const bnTip = gasLimit && maxPriorityFeePerGas ? maxPriorityFeePerGas * BigInt(gasLimit) : maxPriorityFeePerGas;
    const fee = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__.TokenUnit(bnFee, tokenDecimals, '');
    const tip = bnTip ? new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__.TokenUnit(bnTip, tokenDecimals, '') : null;
    const price = tokenPrice ? new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__.TokenUnit(tokenPrice, 0, '') : null;
    return {
        maxFeePerGas: maxFeePerGas,
        gasLimit: gasLimit || 0,
        feeUnit: fee,
        fee: fee.toDisplay(),
        bnFee,
        feeUSD: price ? price.mul(fee).toDisplay({
            fixedDp: 6,
            asNumber: true
        }) : null,
        tipUSD: price && tip ? price.mul(tip).toDisplay({
            fixedDp: 2,
            asNumber: true
        }) : null
    };
}


}),
"../common/src/utils/calculateTotalBalance.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  calculateTotalBalance: () => (calculateTotalBalance)
});
/* ESM import */var _hasAccountBalances__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/hasAccountBalances.ts");
/* ESM import */var _getAddressForChain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/getAddressForChain.ts");


function calculateTotalBalance(account, networks, balances) {
    if (!account || !balances || !networks?.length) {
        return {
            sum: null,
            priceChange: {
                value: 0,
                percentage: []
            }
        };
    }
    const networkDict = networks.reduce((dict, network)=>({
            ...dict,
            [network.chainId]: network
        }), {});
    const chainIdsToSum = new Set(Object.keys(networkDict).map(Number));
    const hasBalances = (0,_hasAccountBalances__WEBPACK_IMPORTED_MODULE_0__.hasAccountBalances)(balances, account, Array.from(chainIdsToSum));
    if (!hasBalances) {
        return {
            sum: null,
            priceChange: {
                value: 0,
                percentage: []
            }
        };
    }
    const sum = Array.from(chainIdsToSum).reduce((total, chainId)=>{
        const address = (0,_getAddressForChain__WEBPACK_IMPORTED_MODULE_1__.getAddressForChain)(networkDict[chainId], account);
        if (!address) {
            return total;
        }
        const sumValues = Object.values(balances?.[chainId]?.[address] ?? {})?.reduce((sumTotal, token)=>{
            const percentage = token.priceChanges?.percentage ? [
                ...sumTotal.priceChange.percentage,
                token.priceChanges?.percentage
            ] : [
                ...sumTotal.priceChange.percentage
            ];
            return {
                sum: sumTotal.sum + (token.balanceInCurrency ?? 0),
                priceChange: {
                    value: sumTotal.priceChange.value + (token.priceChanges?.value ?? 0),
                    percentage
                }
            };
        }, {
            sum: 0,
            priceChange: {
                value: 0,
                percentage: []
            }
        }) || {
            sum: 0,
            priceChange: {
                value: 0,
                percentage: []
            }
        };
        return {
            ...total,
            sum: total.sum + sumValues.sum,
            priceChange: {
                value: sumValues.priceChange.value + total.priceChange.value,
                percentage: [
                    ...sumValues.priceChange.percentage,
                    ...total.priceChange.percentage
                ]
            }
        };
    }, {
        sum: 0,
        priceChange: {
            value: 0,
            percentage: []
        }
    });
    return sum;
}


}),
"../common/src/utils/canSkipApproval.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  canSkipApproval: () => (canSkipApproval)
});
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* ESM import */var _getSyncDomain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/getSyncDomain.ts");
/* ESM import */var _isActiveTab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/isActiveTab.ts");



const canSkipApproval = async (domain, tabId, { allowInactiveTabs, domainWhitelist } = {})=>{
    if (!(0,_getSyncDomain__WEBPACK_IMPORTED_MODULE_1__.isSyncDomain)(domain, domainWhitelist)) {
        return false;
    }
    return allowInactiveTabs || domain === webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__.runtime.id || // chrome.tabs.get(...) does not see extension popup
    await (0,_isActiveTab__WEBPACK_IMPORTED_MODULE_2__.isActiveTab)(tabId);
};


}),
"../common/src/utils/constants.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  USDC_ADDRESSES: () => (USDC_ADDRESSES),
  USDC_ADDRESS_C_CHAIN: () => (USDC_ADDRESS_C_CHAIN),
  USDC_ADDRESS_ETHEREUM: () => (USDC_ADDRESS_ETHEREUM),
  USDC_ADDRESS_SOLANA: () => (USDC_ADDRESS_SOLANA)
});
const USDC_ADDRESS_C_CHAIN = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e';
const USDC_ADDRESS_ETHEREUM = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const USDC_ADDRESS_SOLANA = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDC_ADDRESSES = [
    USDC_ADDRESS_C_CHAIN,
    USDC_ADDRESS_ETHEREUM,
    USDC_ADDRESS_SOLANA
];


}),
"../common/src/utils/createMnemonicPhrase.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  createNewMnemonic: () => (createNewMnemonic)
});
/* ESM import */var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/ethers/lib.esm/wallet/mnemonic.js");

function createNewMnemonic() {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    return ethers__WEBPACK_IMPORTED_MODULE_0__.Mnemonic.entropyToPhrase(randomBytes);
}


}),
"../common/src/utils/distributiveomit.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
// if you want to remove properties from a union ype, you can use this
// currently working stackoverflow answer: https://stackoverflow.com/questions/57103834/typescript-omit-a-property-from-all-interfaces-in-a-union-but-keep-the-union-s/57103940#57103940



}),
"../common/src/utils/encoding.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  base64ToBase64Url: () => (base64ToBase64Url),
  base64UrlToBuffer: () => (base64UrlToBuffer),
  bufferToBase64Url: () => (bufferToBase64Url)
});
/* provided dependency */ var Buffer = __webpack_require__("../../node_modules/buffer/index.js")["Buffer"];
const base64ToBase64Url = (b64)=>{
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]*$/g, '');
};
const base64UrlToBuffer = (b64url)=>{
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').replace(/[=]*$/g, '');
    return Buffer.from(b64, 'base64');
};
function bufferToBase64Url(buffer) {
    // buffer to binary string
    const byteView = new Uint8Array(buffer);
    let str = '';
    for (const charCode of byteView){
        str += String.fromCharCode(charCode);
    }
    // binary string to base64
    const base64String = btoa(str); //Buffer.from(str).toString('base64');
    // base64 to base64url
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '');
}


}),
"../common/src/utils/environment.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isDevelopment: () => (isDevelopment),
  isProductionBuild: () => (isProductionBuild)
});
function isDevelopment() {
    return "development" === 'development';
}
function isProductionBuild() {
    return "" === 'production';
}


}),
"../common/src/utils/errors/errorHelpers.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isUserRejectionError: () => (isUserRejectionError),
  isWrappedError: () => (isWrappedError),
  wrapError: () => (wrapError)
});
/* ESM import */var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/eth-rpc-errors/dist/index.js");
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/index.ts");


const isWrappedError = (maybeErr)=>{
    return typeof maybeErr === 'object' && maybeErr !== null && 'code' in maybeErr && 'data' in maybeErr && typeof maybeErr.code === 'number' && typeof maybeErr.data === 'object' && maybeErr.data !== null && 'reason' in maybeErr.data;
};
function wrapError(fallbackError) {
    return (err)=>{
        if (isWrappedError(err)) {
            throw err;
        }
        if (isWrappedError(fallbackError)) {
            throw fallbackError;
        }
        throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.internal({
            data: {
                reason: _core_types__WEBPACK_IMPORTED_MODULE_1__.CommonError.Unknown,
                originalError: fallbackError ?? err
            }
        });
    };
}
const isUserRejectionError = (err)=>{
    if (!err) {
        return false;
    }
    if (typeof err === 'object') {
        return err.message?.startsWith('User rejected') || err.code === 4001;
    }
    return false;
};


}),
"../common/src/utils/errors/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isUserRejectionError: () => (/* reexport safe */ _errorHelpers__WEBPACK_IMPORTED_MODULE_0__.isUserRejectionError),
  isWrappedError: () => (/* reexport safe */ _errorHelpers__WEBPACK_IMPORTED_MODULE_0__.isWrappedError),
  wrapError: () => (/* reexport safe */ _errorHelpers__WEBPACK_IMPORTED_MODULE_0__.wrapError)
});
/* ESM import */var _errorHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/errors/errorHelpers.ts");



}),
"../common/src/utils/exponentialBackoff.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getExponentialBackoffDelay: () => (getExponentialBackoffDelay)
});
/**
 * Returns the delay (in milliseconds) before another attempt should start.
 * Runs on power of 2.
 */ const getExponentialBackoffDelay = ({ attempt, startsAfter = 3, maxDelay = 30000 })=>{
    return Math.min(maxDelay, 2 ** Math.max(1, attempt - startsAfter + 1) * 1000);
};


}),
"../common/src/utils/extensionUtils.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  openExtensionNewWindow: () => (openExtensionNewWindow),
  openNewTab: () => (openNewTab),
  openPopup: () => (openPopup),
  openWindow: () => (openWindow),
  reload: () => (reload)
});
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* ESM import */var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/rxjs/dist/esm5/internal/Subject.js");
/* ESM import */var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/rxjs/dist/esm5/internal/operators/filter.js");
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/index.ts");




const NOTIFICATION_WIDTH = 375;
const NOTIFICATION_HEIGHT = 668;
const WINDOWS_SCROLLBAR_WIDTH = 26;
const contextToOpenIn = _core_types__WEBPACK_IMPORTED_MODULE_1__.ContextContainer.CONFIRM;
/**
 * Fired when a window is removed (closed).
 */ const windowRemovedSignal = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
/**
 * Fired when the currently focused window changes. Returns chrome.windows.WINDOW_ID_NONE if
 * all Chrome windows have lost focus. Note: On some Linux window managers, WINDOW_ID_NONE is
 * always sent immediately preceding a switch from one Chrome window to another.
 */ const windowFocusChangedSignal = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
/**
 * Pipe the two events blow into the matching signal. This way we dont create a bunch of listeners
 */ webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().windows.onRemoved.addListener((windowId)=>{
    windowRemovedSignal.next(windowId);
});
webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().windows.onFocusChanged.addListener((windowId)=>{
    windowFocusChangedSignal.next(windowId);
});
/**
 * Since we cant get direct events from the window we have to rely on a global events that a window has been
 * closed. Each window or tab created then returns a config with a listener on the global events. The listener
 * filters by the windowId tied to the event. Once that is reached then the consumer is notified and can act accordingly
 *
 * @param info the window configs used to create the window
 * @returns
 */ function createWindowInfoAndEvents(info) {
    return {
        ...info,
        removed: windowRemovedSignal.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)((windowId)=>windowId === info.id)),
        focusChanged: windowRemovedSignal.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)((windowId)=>windowId === info.id))
    };
}
const checkForError = ()=>{
    const { lastError } = (webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime);
    if (!lastError) {
        return undefined;
    }
    // if it quacks like an Error, its an Error
    if (lastError.message) {
        return lastError;
    }
    // repair incomplete error object (eg chromium v77)
    return new Error('Something went wrong.');
};
const openNewTab = async (options)=>{
    try {
        const tab = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.create(options);
        const error = checkForError();
        if (error) {
            throw new Error(error.message);
        }
        return tab;
    } catch (error) {
        return error;
    }
};
const openWindow = async (options)=>{
    try {
        const newWindow = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().windows.create(options);
        return createWindowInfoAndEvents(newWindow);
    } catch (error) {
        console.error(error);
        throw new Error('failed to open new window');
    }
};
const openPopup = async ({ url, setSelfAsOpener = false, top = 0, right = 0 })=>{
    const platform = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getPlatformInfo();
    const isPlatformWindows = platform?.os === 'win';
    let left = 0;
    try {
        const lastFocused = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().windows.getLastFocused();
        // Position window in top right corner of lastFocused window.
        top = lastFocused.top ? lastFocused.top + top : 0;
        left = typeof lastFocused.left === 'number' && typeof lastFocused.width === 'number' ? lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH) - right : 0;
    } catch (_) {
    // do nothing, don't know where the last window is so let's just place it to 0,0
    }
    return openWindow({
        url,
        focused: true,
        setSelfAsOpener,
        type: 'popup',
        height: !isPlatformWindows ? NOTIFICATION_HEIGHT : NOTIFICATION_HEIGHT + WINDOWS_SCROLLBAR_WIDTH,
        width: !isPlatformWindows ? NOTIFICATION_WIDTH : NOTIFICATION_WIDTH + WINDOWS_SCROLLBAR_WIDTH,
        left,
        top
    });
};
const openExtensionNewWindow = async (route, queryString)=>{
    let extensionURL = webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getURL(contextToOpenIn);
    if (queryString) {
        extensionURL += `?${queryString}`;
    }
    if (route) {
        extensionURL += `#/${route}`;
    }
    return openPopup({
        url: extensionURL
    });
};
const reload = ()=>{
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.reload();
};


}),
"../common/src/utils/fetchAndVerify.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  fetchAndVerify: () => (fetchAndVerify)
});
async function fetchAndVerify(fetchOptions, schema) {
    const response = await fetch(...fetchOptions);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const responseJson = await response.json();
    return schema.parse(responseJson);
}


}),
"../common/src/utils/filterFalsyValues.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  filterFalseyValues: () => (filterFalseyValues)
});
/* ESM import */var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/rxjs/dist/esm5/internal/operators/filter.js");

function filterFalseyValues() {
    return (observer)=>observer.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_0__.filter)((value)=>!!value));
}


}),
"../common/src/utils/findTokenForAsset.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  findTokenForAsset: () => (findTokenForAsset)
});
/* ESM import */var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-bridge-sdk/esm/types/config.js");

function findTokenForAsset(symbol, nativeChain, tokens) {
    // When the source is Avalanche use the wrapped version of the symbol e.g. BTC.b
    const wrappedSymbol = getWrappedSymbol(symbol, nativeChain);
    return tokens.find((t)=>t.symbol === symbol || t.symbol === wrappedSymbol);
}
function getWrappedSymbol(symbol, chain) {
    if (chain === _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.Blockchain.ETHEREUM) {
        return `${symbol}.e`;
    } else if (chain === _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.Blockchain.BITCOIN) {
        return `${symbol}.b`;
    }
    return symbol;
}


}),
"../common/src/utils/fireblocks/getFireblocksBtcAccessErrorCode.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getFireblocksBtcAccessErrorCode: () => (getFireblocksBtcAccessErrorCode)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");

function getFireblocksBtcAccessErrorCode(message) {
    const [, code] = message.split(_core_types__WEBPACK_IMPORTED_MODULE_0__.BTC_ACCESS_ERROR_PREFIX);
    if (typeof code === 'undefined' || code === '') {
        return null;
    }
    return parseInt(code);
}


}),
"../common/src/utils/fireblocks/isFireblocksApiSupported.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isFireblocksApiSupported: () => (isFireblocksApiSupported)
});
// If we have the BTC address for a Fireblocks account, that means that we were
// provided the correct API credentials (otherwise we wouldn't be able to fetch
// the address).
function isFireblocksApiSupported(account) {
    return Boolean(account?.addressBTC);
}


}),
"../common/src/utils/getAccountKey.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getAccountKey: () => (getAccountKey)
});
function getAccountKey({ address, isTestnet }) {
    const accountSuffix = !isTestnet ? '' : '-test';
    return `${address}${accountSuffix}`;
}


}),
"../common/src/utils/getAddressForChain.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getAddressForChain: () => (getAddressForChain)
});
/* ESM import */var _address__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/address.ts");

function getAddressForChain(network, account) {
    if (!network || !account) {
        return '';
    }
    return (0,_address__WEBPACK_IMPORTED_MODULE_0__.mapAddressesToVMs)(account)[network.vmName] ?? '';
}


}),
"../common/src/utils/getCoreWebUrl.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getCoreWebUrl: () => (getCoreWebUrl)
});
const getCoreWebUrl = (address, networkId)=>{
    const baseCoreWebUrl = "https://core.app";
    if (!address) {
        return baseCoreWebUrl;
    }
    if (address && networkId) {
        return `${baseCoreWebUrl}/account/${address}?network=${networkId}`;
    }
    return `${baseCoreWebUrl}/account/${address}`;
};


}),
"../common/src/utils/getDefaultChainIds.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getDefaultChainIds: () => (getDefaultChainIds),
  getXPChainIds: () => (getXPChainIds)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");

function getXPChainIds(isMainnet) {
    const xChainId = isMainnet ? _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_X : _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_TEST_X;
    const pChainId = isMainnet ? _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_P : _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_TEST_P;
    return [
        pChainId,
        xChainId
    ];
}
function getDefaultChainIds(isMainnet) {
    return [
        isMainnet ? _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_MAINNET_ID : _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_TESTNET_ID,
        ...getXPChainIds(isMainnet)
    ];
}


}),
"../common/src/utils/getEnabledBridgeTypes.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getEnabledBridgeTypes: () => (getEnabledBridgeTypes)
});
/* ESM import */var _avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/bridge-unified/dist/index.js");
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/index.ts");


const getEnabledBridgeTypes = (featureFlags)=>{
    const enabled = [];
    if (featureFlags[_core_types__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.UNIFIED_BRIDGE_CCTP]) {
        enabled.push(_avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__.BridgeType.CCTP);
    }
    if (featureFlags[_core_types__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.UNIFIED_BRIDGE_ICTT]) {
        enabled.push(_avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__.BridgeType.ICTT_ERC20_ERC20);
    }
    if (featureFlags[_core_types__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.UNIFIED_BRIDGE_AB_EVM]) {
        enabled.push(_avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__.BridgeType.AVALANCHE_EVM);
    }
    if (featureFlags[_core_types__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]) {
        enabled.push(_avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__.BridgeType.AVALANCHE_BTC_AVA);
    }
    if (featureFlags[_core_types__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]) {
        enabled.push(_avalabs_bridge_unified__WEBPACK_IMPORTED_MODULE_0__.BridgeType.AVALANCHE_AVA_BTC);
    }
    return enabled;
};


}),
"../common/src/utils/getExplorerAddress.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getAvalancheAddressLink: () => (getAvalancheAddressLink),
  getExplorerAddress: () => (getExplorerAddress),
  getExplorerAddressByNetwork: () => (getExplorerAddressByNetwork)
});
/* ESM import */var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/@avalabs/core-bridge-sdk/esm/types/config.js");
/* ESM import */var _bridge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/bridge/index.ts");


function getAvalancheExplorerBaseUrl(isMainnet = true) {
    return isMainnet ? 'https://subnets.avax.network/c-chain' : 'https://subnets-test.avax.network/c-chain';
}
function getAvalancheTxLink(hash, isMainnet = true) {
    const root = getAvalancheExplorerBaseUrl(isMainnet);
    return `${root}/tx/${hash}`;
}
function getEtherscanLink(txHash, isMainnet) {
    const root = isMainnet ? 'https://etherscan.io' : 'https://sepolia.etherscan.io';
    return `${root}/tx/${txHash}`;
}
function getBTCBlockchainLink(txHash, isMainnet) {
    const env = isMainnet ? 'btc' : 'btc-testnet';
    return `https://www.blockchain.com/${env}/tx/${txHash}`;
}
function getExplorerAddress(chain, txHash, isMainnet, getNetwork) {
    const normalizedChain = typeof chain === 'object' ? (0,_bridge__WEBPACK_IMPORTED_MODULE_0__.networkToBlockchain)(chain) : chain;
    switch(normalizedChain){
        case _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.AVALANCHE:
            return getAvalancheTxLink(txHash, isMainnet);
        case _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.BITCOIN:
            return getBTCBlockchainLink(txHash, isMainnet);
        case _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_1__.Blockchain.ETHEREUM:
            return getEtherscanLink(txHash, isMainnet);
    }
    if (typeof chain === 'string') {
        return '#';
    }
    const network = getNetwork(chain.chainId);
    return network ? getExplorerAddressByNetwork(network, txHash, 'tx') : '#';
}
function getAvalancheAddressLink(hash, isMainnet = true) {
    const root = getAvalancheExplorerBaseUrl(isMainnet);
    return `${root}/address/${hash}`;
}
function getExplorerAddressByNetwork(network, hash, hashType = 'tx') {
    try {
        // Try to respect any query params set on {network.explorerUrl}
        const baseUrl = new URL(network.explorerUrl);
        baseUrl.pathname += `/${hashType}/${hash}`;
        return baseUrl.toString();
    } catch  {
        return `${network.explorerUrl}/${hashType}/${hash}`;
    }
}


}),
"../common/src/utils/getHexStringToBytes.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getHexStringToBytes: () => (getHexStringToBytes)
});
function getHexStringToBytes(hex) {
    if (!hex) return null;
    // the first 2 chars can be ignore since it indicates the hexadecimal representation ( -2 )
    // the reason byte size is calculated this way => F in hex is the biggest number which can be represented with 4 bits (1111)
    // therefore 2 chars at a time can be represented in 1 byte which is 8 bits
    // so the byte value of a hex is the half of the character count
    return (hex.length - 2) / 2;
}


}),
"../common/src/utils/getNftMetadata.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getNftMetadata: () => (getNftMetadata)
});
/* ESM import */var _ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/ipsfResolverWithFallback.ts");
/* provided dependency */ var Buffer = __webpack_require__("../../node_modules/buffer/index.js")["Buffer"];

async function fetchWithTimeout(uri, timeout = 5000) {
    const controller = new AbortController();
    setTimeout(()=>controller.abort(), timeout);
    return fetch(uri, {
        signal: controller.signal
    });
}
async function getNftMetadata(tokenUri) {
    let data = {};
    if (!tokenUri) {
        return {};
    } else if (tokenUri.startsWith('data:application/json;base64,')) {
        const value = tokenUri.substring(29);
        try {
            const json = Buffer.from(value, 'base64').toString();
            data = JSON.parse(json);
        } catch  {
            data = {};
        }
    } else {
        data = await fetchWithTimeout((0,_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_0__.ipfsResolverWithFallback)(tokenUri)).then((r)=>r.json()).catch(()=>({}));
    }
    return data;
}


}),
"../common/src/utils/getSyncDomain.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getSyncDomain: () => (getSyncDomain),
  isSyncDomain: () => (isSyncDomain)
});
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* ESM import */var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/constants.ts");


const isSyncDomain = (domain, exposedDomainList = [])=>{
    return [
        webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__.runtime.id,
        ..._constants__WEBPACK_IMPORTED_MODULE_1__.SYNCED_DOMAINS,
        ...exposedDomainList
    ].some((syncDomain)=>{
        // Match exact domains, but also allow subdomains (i.e. develop.core-web.pages.dev)
        return syncDomain === domain || domain.endsWith(`.${syncDomain}`);
    });
};
/**
 * Returns the extension's ID for synced domains (i.e. the Core Suite apps)
 */ const getSyncDomain = (domain)=>{
    return isSyncDomain(domain) ? webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__.runtime.id : domain;
};


}),
"../common/src/utils/handleTxOutcome.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  handleTxOutcome: () => (handleTxOutcome)
});
/* ESM import */var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/errors/index.ts");

/**
 * Use this util function to distinguish between the user rejecting the
 */ async function handleTxOutcome(txRequestPromise) {
    try {
        const result = await txRequestPromise;
        return {
            isApproved: true,
            hasError: false,
            result
        };
    } catch (err) {
        return {
            isApproved: !(0,_errors__WEBPACK_IMPORTED_MODULE_0__.isUserRejectionError)(err),
            hasError: true,
            error: err
        };
    }
}


}),
"../common/src/utils/hasAccountBalances.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  hasAccountBalances: () => (hasAccountBalances)
});
/* ESM import */var _account__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/account.ts");

function hasAccountBalances(balances, account, networkIds) {
    const accountAddresses = (0,_account__WEBPACK_IMPORTED_MODULE_0__.getAllAddressesForAccount)(account);
    return Object.entries(balances).filter(([networkId])=>networkIds.includes(Number(networkId))).some(([, item])=>{
        if (!item) {
            return false;
        }
        const balanceAddresses = Object.keys(item);
        return balanceAddresses.some((address)=>{
            return accountAddresses.includes(address);
        });
    });
}


}),
"../common/src/utils/hasUnconfirmedBalance.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  hasUnconfirmedBalance: () => (hasUnconfirmedBalance)
});
const hasUnconfirmedBalance = (token)=>{
    return 'unconfirmedBalance' in token && Boolean(token.unconfirmedBalance);
};


}),
"../common/src/utils/history/getAvaxAssetId.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getAvaxAssetId: () => (getAvaxAssetId)
});
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/providers/constants.js");

const getAvaxAssetId = (isTestnet)=>isTestnet ? _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_0__.FujiContext.avaxAssetID : _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_0__.MainnetContext.avaxAssetID;


}),
"../common/src/utils/history/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getAvaxAssetId: () => (/* reexport safe */ _getAvaxAssetId__WEBPACK_IMPORTED_MODULE_1__.getAvaxAssetId),
  isNonXPHistoryItem: () => (/* reexport safe */ _isTxHistoryItem__WEBPACK_IMPORTED_MODULE_0__.isNonXPHistoryItem),
  isPchainTxHistoryItem: () => (/* reexport safe */ _isTxHistoryItem__WEBPACK_IMPORTED_MODULE_0__.isPchainTxHistoryItem)
});
/* ESM import */var _isTxHistoryItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/history/isTxHistoryItem.ts");
/* ESM import */var _getAvaxAssetId__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/history/getAvaxAssetId.ts");




}),
"../common/src/utils/history/isTxHistoryItem.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isNonXPHistoryItem: () => (isNonXPHistoryItem),
  isPchainTxHistoryItem: () => (isPchainTxHistoryItem)
});
function isNonXPHistoryItem(tx) {
    return tx.vmType !== 'AVM' && tx.vmType !== 'PVM';
}
function isPchainTxHistoryItem(tx) {
    return tx.vmType === 'PVM';
}


}),
"../common/src/utils/incrementalPromiseResolve.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  incrementalPromiseResolve: () => (incrementalPromiseResolve)
});
function incrementAndCall(prom, interval = 0) {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            prom().then((res)=>resolve(res)).catch((err)=>reject(err));
        }, 500 * interval);
    });
}
/**
 * If we have api requests or fetches that need to be tried a few times in order to get results
 * we expect than we can do an incremental step off before telling the user it failed
 *
 * @param prom
 * @param errorParser
 * @param increment
 * @param maxTries
 * @returns promise result
 */ async function incrementalPromiseResolve(prom, errorParser, increment = 0, maxTries = 10) {
    try {
        const res = await incrementAndCall(prom, increment);
        if (maxTries === increment + 1) return res;
        if (errorParser(res)) {
            return incrementalPromiseResolve(prom, errorParser, increment + 1, maxTries);
        }
        return res;
    } catch (err) {
        if (maxTries === increment + 1) throw typeof err === 'string' ? new Error(err) : err;
        if (errorParser(err)) {
            return incrementalPromiseResolve(prom, errorParser, increment + 1, maxTries);
        }
        throw typeof err === 'string' ? new Error(err) : err;
    }
}


}),
"../common/src/utils/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AvaxCaipId: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.AvaxCaipId),
  AvaxLegacyCaipId: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.AvaxLegacyCaipId),
  BitcoinCaipId: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.BitcoinCaipId),
  CaipNamespace: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.CaipNamespace),
  ETHEREUM_ADDRESS: () => (/* reexport safe */ _bridgeTransactionUtils__WEBPACK_IMPORTED_MODULE_33__.ETHEREUM_ADDRESS),
  IPFS_URL: () => (/* reexport safe */ _ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_68__.IPFS_URL),
  KEYSTORE_VERSION: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_31__.KEYSTORE_VERSION),
  KeystoreFixtures: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_31__.KeystoreFixtures),
  SeedlessRegistartionResult: () => (/* reexport safe */ _approveSeedlessRegistration__WEBPACK_IMPORTED_MODULE_100__.SeedlessRegistartionResult),
  SolanaCaipId: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.SolanaCaipId),
  USDC_ADDRESSES: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_30__.USDC_ADDRESSES),
  USDC_ADDRESS_C_CHAIN: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_30__.USDC_ADDRESS_C_CHAIN),
  USDC_ADDRESS_ETHEREUM: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_30__.USDC_ADDRESS_ETHEREUM),
  USDC_ADDRESS_SOLANA: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_30__.USDC_ADDRESS_SOLANA),
  addGlacierAPIKeyIfNeeded: () => (/* reexport safe */ _network_addGlacierAPIKeyIfNeeded__WEBPACK_IMPORTED_MODULE_5__.addGlacierAPIKeyIfNeeded),
  approveSeedlessRegistration: () => (/* reexport safe */ _approveSeedlessRegistration__WEBPACK_IMPORTED_MODULE_100__.approveSeedlessRegistration),
  areArraysOverlapping: () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_70__.areArraysOverlapping),
  assert: () => (/* reexport safe */ _assertions__WEBPACK_IMPORTED_MODULE_54__.assert),
  assertNonEmptyString: () => (/* reexport safe */ _assertions__WEBPACK_IMPORTED_MODULE_54__.assertNonEmptyString),
  assertPresent: () => (/* reexport safe */ _assertions__WEBPACK_IMPORTED_MODULE_54__.assertPresent),
  assertPropDefined: () => (/* reexport safe */ _assertions__WEBPACK_IMPORTED_MODULE_54__.assertPropDefined),
  assertTrue: () => (/* reexport safe */ _assertions__WEBPACK_IMPORTED_MODULE_54__.assertTrue),
  authenticateWithApple: () => (/* reexport safe */ _seedless_authenticateWithApple__WEBPACK_IMPORTED_MODULE_35__.authenticateWithApple),
  authenticateWithGoogle: () => (/* reexport safe */ _seedless_authenticateWithGoogle__WEBPACK_IMPORTED_MODULE_36__.authenticateWithGoogle),
  base64ToBase64Url: () => (/* reexport safe */ _encoding__WEBPACK_IMPORTED_MODULE_88__.base64ToBase64Url),
  base64UrlToBuffer: () => (/* reexport safe */ _encoding__WEBPACK_IMPORTED_MODULE_88__.base64UrlToBuffer),
  bigintToBig: () => (/* reexport safe */ _bigintToBig__WEBPACK_IMPORTED_MODULE_84__.bigintToBig),
  blockchainToNetwork: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.blockchainToNetwork),
  bufferToBase64Url: () => (/* reexport safe */ _encoding__WEBPACK_IMPORTED_MODULE_88__.bufferToBase64Url),
  buildBtcTx: () => (/* reexport safe */ _send_btcSendUtils__WEBPACK_IMPORTED_MODULE_17__.buildBtcTx),
  buildGlacierAuthHeaders: () => (/* reexport safe */ _network_buildGlacierAuthHeaders__WEBPACK_IMPORTED_MODULE_6__.buildGlacierAuthHeaders),
  caipToChainId: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.caipToChainId),
  calculateGasAndFees: () => (/* reexport safe */ _calculateGasAndFees__WEBPACK_IMPORTED_MODULE_57__.calculateGasAndFees),
  calculatePasswordHash: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_31__.calculatePasswordHash),
  calculateTotalBalance: () => (/* reexport safe */ _calculateTotalBalance__WEBPACK_IMPORTED_MODULE_18__.calculateTotalBalance),
  canSkipApproval: () => (/* reexport safe */ _canSkipApproval__WEBPACK_IMPORTED_MODULE_48__.canSkipApproval),
  chainIdToCaip: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.chainIdToCaip),
  connectionLog: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.connectionLog),
  convertRequest: () => (/* reexport safe */ _seedless_fido__WEBPACK_IMPORTED_MODULE_39__.convertRequest),
  convertResult: () => (/* reexport safe */ _seedless_fido__WEBPACK_IMPORTED_MODULE_39__.convertResult),
  createNewMnemonic: () => (/* reexport safe */ _createMnemonicPhrase__WEBPACK_IMPORTED_MODULE_15__.createNewMnemonic),
  decorateWithCaipId: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.decorateWithCaipId),
  decrypt: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_31__.decrypt),
  disconnectLog: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.disconnectLog),
  engine: () => (/* reexport safe */ _jsonRpcEngine__WEBPACK_IMPORTED_MODULE_75__.engine),
  eventLog: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.eventLog),
  extractKeysFromDecryptedFile: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_31__.extractKeysFromDecryptedFile),
  fetchAndVerify: () => (/* reexport safe */ _fetchAndVerify__WEBPACK_IMPORTED_MODULE_98__.fetchAndVerify),
  filterBridgeStateToNetwork: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.filterBridgeStateToNetwork),
  filterFalseyValues: () => (/* reexport safe */ _filterFalsyValues__WEBPACK_IMPORTED_MODULE_94__.filterFalseyValues),
  findMatchingBridgeAsset: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.findMatchingBridgeAsset),
  findTokenForAsset: () => (/* reexport safe */ _findTokenForAsset__WEBPACK_IMPORTED_MODULE_51__.findTokenForAsset),
  formatAndLog: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.formatAndLog),
  formatTime: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.formatTime),
  getAccountKey: () => (/* reexport safe */ _getAccountKey__WEBPACK_IMPORTED_MODULE_90__.getAccountKey),
  getAddressByVMType: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_0__.getAddressByVMType),
  getAddressForChain: () => (/* reexport safe */ _getAddressForChain__WEBPACK_IMPORTED_MODULE_32__.getAddressForChain),
  getAddressesInRange: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_0__.getAddressesInRange),
  getAllAddressesForAccount: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_26__.getAllAddressesForAccount),
  getAllAddressesForAccounts: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_26__.getAllAddressesForAccounts),
  getAvalancheAddressLink: () => (/* reexport safe */ _getExplorerAddress__WEBPACK_IMPORTED_MODULE_28__.getAvalancheAddressLink),
  getAvaxAssetId: () => (/* reexport safe */ _history__WEBPACK_IMPORTED_MODULE_25__.getAvaxAssetId),
  getBridgedAssetSymbol: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.getBridgedAssetSymbol),
  getBtcInputUtxos: () => (/* reexport safe */ _send_btcSendUtils__WEBPACK_IMPORTED_MODULE_17__.getBtcInputUtxos),
  getCoreWebUrl: () => (/* reexport safe */ _getCoreWebUrl__WEBPACK_IMPORTED_MODULE_71__.getCoreWebUrl),
  getDefaultChainIds: () => (/* reexport safe */ _getDefaultChainIds__WEBPACK_IMPORTED_MODULE_74__.getDefaultChainIds),
  getEnabledBridgeTypes: () => (/* reexport safe */ _getEnabledBridgeTypes__WEBPACK_IMPORTED_MODULE_27__.getEnabledBridgeTypes),
  getEnv: () => (/* reexport safe */ _seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_34__.getEnv),
  getExplorerAddress: () => (/* reexport safe */ _getExplorerAddress__WEBPACK_IMPORTED_MODULE_28__.getExplorerAddress),
  getExplorerAddressByNetwork: () => (/* reexport safe */ _getExplorerAddress__WEBPACK_IMPORTED_MODULE_28__.getExplorerAddressByNetwork),
  getExponentialBackoffDelay: () => (/* reexport safe */ _exponentialBackoff__WEBPACK_IMPORTED_MODULE_77__.getExponentialBackoffDelay),
  getFireblocksBtcAccessErrorCode: () => (/* reexport safe */ _fireblocks_getFireblocksBtcAccessErrorCode__WEBPACK_IMPORTED_MODULE_46__.getFireblocksBtcAccessErrorCode),
  getHash: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_31__.getHash),
  getHexStringToBytes: () => (/* reexport safe */ _getHexStringToBytes__WEBPACK_IMPORTED_MODULE_55__.getHexStringToBytes),
  getNameSpaceFromScope: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.getNameSpaceFromScope),
  getNativeTokenSymbol: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.getNativeTokenSymbol),
  getNetworkCaipId: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.getNetworkCaipId),
  getNftMetadata: () => (/* reexport safe */ _getNftMetadata__WEBPACK_IMPORTED_MODULE_29__.getNftMetadata),
  getOidcClient: () => (/* reexport safe */ _seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_34__.getOidcClient),
  getOidcTokenProvider: () => (/* reexport safe */ _seedless_getOidcTokenProvider__WEBPACK_IMPORTED_MODULE_37__.getOidcTokenProvider),
  getOrgId: () => (/* reexport safe */ _seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_34__.getOrgId),
  getPriceChangeValues: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_95__.getPriceChangeValues),
  getProviderForNetwork: () => (/* reexport safe */ _network_getProviderForNetwork__WEBPACK_IMPORTED_MODULE_4__.getProviderForNetwork),
  getSignerSession: () => (/* reexport safe */ _seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_34__.getSignerSession),
  getSignerToken: () => (/* reexport safe */ _seedless_getSignerToken__WEBPACK_IMPORTED_MODULE_38__.getSignerToken),
  getSmallImageForNFT: () => (/* reexport safe */ _nfts_getSmallImageForNFT__WEBPACK_IMPORTED_MODULE_42__.getSmallImageForNFT),
  getSyncDomain: () => (/* reexport safe */ _getSyncDomain__WEBPACK_IMPORTED_MODULE_14__.getSyncDomain),
  getTokenValue: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_95__.getTokenValue),
  getUpdatedSigningData: () => (/* reexport safe */ _actions_getUpdatedActionData__WEBPACK_IMPORTED_MODULE_1__.getUpdatedSigningData),
  getXPChainIds: () => (/* reexport safe */ _getDefaultChainIds__WEBPACK_IMPORTED_MODULE_74__.getXPChainIds),
  groupTokensByType: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_95__.groupTokensByType),
  handleTxOutcome: () => (/* reexport safe */ _handleTxOutcome__WEBPACK_IMPORTED_MODULE_79__.handleTxOutcome),
  hasAccountBalances: () => (/* reexport safe */ _hasAccountBalances__WEBPACK_IMPORTED_MODULE_21__.hasAccountBalances),
  hasDefined: () => (/* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_20__.hasDefined),
  hasUnconfirmedBalance: () => (/* reexport safe */ _hasUnconfirmedBalance__WEBPACK_IMPORTED_MODULE_67__.hasUnconfirmedBalance),
  incrementalPromiseResolve: () => (/* reexport safe */ _incrementalPromiseResolve__WEBPACK_IMPORTED_MODULE_52__.incrementalPromiseResolve),
  ipfsResolverWithFallback: () => (/* reexport safe */ _ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_68__.ipfsResolverWithFallback),
  is1155Response: () => (/* reexport safe */ _nfts_nftTypesUtils__WEBPACK_IMPORTED_MODULE_45__.is1155Response),
  isActiveTab: () => (/* reexport safe */ _isActiveTab__WEBPACK_IMPORTED_MODULE_73__.isActiveTab),
  isAddressBlockedError: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.isAddressBlockedError),
  isAvalancheChainId: () => (/* reexport safe */ _network_isAvalancheNetwork__WEBPACK_IMPORTED_MODULE_7__.isAvalancheChainId),
  isAvalancheNetwork: () => (/* reexport safe */ _network_isAvalancheNetwork__WEBPACK_IMPORTED_MODULE_7__.isAvalancheNetwork),
  isBitcoin: () => (/* reexport safe */ _isBitcoin__WEBPACK_IMPORTED_MODULE_83__.isBitcoin),
  isBitcoinCaipId: () => (/* reexport safe */ _caipConversion__WEBPACK_IMPORTED_MODULE_50__.isBitcoinCaipId),
  isBitcoinChainId: () => (/* reexport safe */ _network_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_11__.isBitcoinChainId),
  isBitcoinNetwork: () => (/* reexport safe */ _network_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_11__.isBitcoinNetwork),
  isBridgeConfigUpdateEventListener: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.isBridgeConfigUpdateEventListener),
  isBridgeStateUpdateEventListener: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.isBridgeStateUpdateEventListener),
  isBridgeTransferEventListener: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.isBridgeTransferEventListener),
  isBtcAddressInNetwork: () => (/* reexport safe */ _isBtcAddressInNetwork__WEBPACK_IMPORTED_MODULE_80__.isBtcAddressInNetwork),
  isContactValid: () => (/* reexport safe */ _isContactValid__WEBPACK_IMPORTED_MODULE_23__.isContactValid),
  isDevelopment: () => (/* reexport safe */ _environment__WEBPACK_IMPORTED_MODULE_76__.isDevelopment),
  isErc721TokenBalance: () => (/* reexport safe */ _nfts_nftTypesUtils__WEBPACK_IMPORTED_MODULE_45__.isErc721TokenBalance),
  isEthereumChainId: () => (/* reexport safe */ _network_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_10__.isEthereumChainId),
  isEthereumNetwork: () => (/* reexport safe */ _network_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_10__.isEthereumNetwork),
  isExportRequestOutdated: () => (/* reexport safe */ _seedless_fido__WEBPACK_IMPORTED_MODULE_39__.isExportRequestOutdated),
  isFailedMfaError: () => (/* reexport safe */ _seedless_fido__WEBPACK_IMPORTED_MODULE_39__.isFailedMfaError),
  isFailedToFetchError: () => (/* reexport safe */ _isFailedToFetchError__WEBPACK_IMPORTED_MODULE_87__.isFailedToFetchError),
  isFireblocksAccount: () => (/* reexport safe */ _accounts__WEBPACK_IMPORTED_MODULE_2__.isFireblocksAccount),
  isFireblocksApiSupported: () => (/* reexport safe */ _fireblocks_isFireblocksApiSupported__WEBPACK_IMPORTED_MODULE_47__.isFireblocksApiSupported),
  isFulfilled: () => (/* reexport safe */ _typeUtils__WEBPACK_IMPORTED_MODULE_53__.isFulfilled),
  isImportedAccount: () => (/* reexport safe */ _accounts__WEBPACK_IMPORTED_MODULE_2__.isImportedAccount),
  isLedgerVersionCompatible: () => (/* reexport safe */ _isLedgerVersionCompatible__WEBPACK_IMPORTED_MODULE_66__.isLedgerVersionCompatible),
  isLockStateChangedEvent: () => (/* reexport safe */ _isLockStateChangedEvent__WEBPACK_IMPORTED_MODULE_96__.isLockStateChangedEvent),
  isNFT: () => (/* reexport safe */ _nfts_isNFT__WEBPACK_IMPORTED_MODULE_44__.isNFT),
  isNewsletterConfigured: () => (/* reexport safe */ _newsletter__WEBPACK_IMPORTED_MODULE_61__.isNewsletterConfigured),
  isNftTokenType: () => (/* reexport safe */ _nfts_isNFT__WEBPACK_IMPORTED_MODULE_44__.isNftTokenType),
  isNonXPHistoryItem: () => (/* reexport safe */ _history__WEBPACK_IMPORTED_MODULE_25__.isNonXPHistoryItem),
  isNotNullish: () => (/* reexport safe */ _typeUtils__WEBPACK_IMPORTED_MODULE_53__.isNotNullish),
  isPchainNetwork: () => (/* reexport safe */ _network_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork),
  isPchainNetworkId: () => (/* reexport safe */ _network_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetworkId),
  isPchainTxHistoryItem: () => (/* reexport safe */ _history__WEBPACK_IMPORTED_MODULE_25__.isPchainTxHistoryItem),
  isPendingBridgeTransaction: () => (/* reexport safe */ _bridgeTransactionUtils__WEBPACK_IMPORTED_MODULE_33__.isPendingBridgeTransaction),
  isPhraseCorrect: () => (/* reexport safe */ _seedPhraseValidation__WEBPACK_IMPORTED_MODULE_85__.isPhraseCorrect),
  isPrimaryAccount: () => (/* reexport safe */ _accounts__WEBPACK_IMPORTED_MODULE_2__.isPrimaryAccount),
  isPrimarySubnet: () => (/* reexport safe */ _isPrimarySubnet__WEBPACK_IMPORTED_MODULE_81__.isPrimarySubnet),
  isProductionBuild: () => (/* reexport safe */ _environment__WEBPACK_IMPORTED_MODULE_76__.isProductionBuild),
  isSeedlessMfaChoiceRequest: () => (/* reexport safe */ _seedless_seedlessEventFilters__WEBPACK_IMPORTED_MODULE_40__.isSeedlessMfaChoiceRequest),
  isSeedlessMfaEvent: () => (/* reexport safe */ _seedless_seedlessEventFilters__WEBPACK_IMPORTED_MODULE_40__.isSeedlessMfaEvent),
  isSeedlessMfaMethodsUpdatedEvent: () => (/* reexport safe */ _seedless_seedlessEventFilters__WEBPACK_IMPORTED_MODULE_40__.isSeedlessMfaMethodsUpdatedEvent),
  isSeedlessTokenEvent: () => (/* reexport safe */ _seedless_seedlessEventFilters__WEBPACK_IMPORTED_MODULE_40__.isSeedlessTokenEvent),
  isSessionPermissionsMismatchEvent: () => (/* reexport safe */ _walletConnectEventFilters__WEBPACK_IMPORTED_MODULE_41__.isSessionPermissionsMismatchEvent),
  isSolanaChainId: () => (/* reexport safe */ _network_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_12__.isSolanaChainId),
  isSolanaNetwork: () => (/* reexport safe */ _network_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_12__.isSolanaNetwork),
  isSupportedBrowser: () => (/* reexport safe */ _isSupportedBrowser__WEBPACK_IMPORTED_MODULE_56__.isSupportedBrowser),
  isSwimmer: () => (/* reexport safe */ _isSwimmerNetwork__WEBPACK_IMPORTED_MODULE_82__.isSwimmer),
  isSwimmerByChainId: () => (/* reexport safe */ _isSwimmerNetwork__WEBPACK_IMPORTED_MODULE_82__.isSwimmerByChainId),
  isSyncDomain: () => (/* reexport safe */ _getSyncDomain__WEBPACK_IMPORTED_MODULE_14__.isSyncDomain),
  isTokenExpiredError: () => (/* reexport safe */ _seedless_fido__WEBPACK_IMPORTED_MODULE_39__.isTokenExpiredError),
  isTokenMalicious: () => (/* reexport safe */ _isTokenMalicious__WEBPACK_IMPORTED_MODULE_58__.isTokenMalicious),
  isTokenWithBalanceAVM: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_95__.isTokenWithBalanceAVM),
  isTokenWithBalancePVM: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_95__.isTokenWithBalancePVM),
  isUnifiedBridgeStateUpdate: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.isUnifiedBridgeStateUpdate),
  isUnifiedBridgeTransfer: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.isUnifiedBridgeTransfer),
  isUnifiedBridgeTransferStepChanged: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.isUnifiedBridgeTransferStepChanged),
  isUriGeneratedEvent: () => (/* reexport safe */ _walletConnectEventFilters__WEBPACK_IMPORTED_MODULE_41__.isUriGeneratedEvent),
  isUserRejectionError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_16__.isUserRejectionError),
  isValidAddress: () => (/* reexport safe */ _isAddressValid__WEBPACK_IMPORTED_MODULE_22__.isValidAddress),
  isValidAvmAddress: () => (/* reexport safe */ _isAddressValid__WEBPACK_IMPORTED_MODULE_22__.isValidAvmAddress),
  isValidBtcAddress: () => (/* reexport safe */ _isAddressValid__WEBPACK_IMPORTED_MODULE_22__.isValidBtcAddress),
  isValidHttpHeader: () => (/* reexport safe */ _network_isValidHttpHeader__WEBPACK_IMPORTED_MODULE_13__.isValidHttpHeader),
  isValidPvmAddress: () => (/* reexport safe */ _isAddressValid__WEBPACK_IMPORTED_MODULE_22__.isValidPvmAddress),
  isValidResponse: () => (/* reexport safe */ _seedless_fido__WEBPACK_IMPORTED_MODULE_39__.isValidResponse),
  isValidSvmAddress: () => (/* reexport safe */ _isAddressValid__WEBPACK_IMPORTED_MODULE_22__.isValidSvmAddress),
  isValidXPAddress: () => (/* reexport safe */ _isAddressValid__WEBPACK_IMPORTED_MODULE_22__.isValidXPAddress),
  isWalletConnectAccount: () => (/* reexport safe */ _accounts__WEBPACK_IMPORTED_MODULE_2__.isWalletConnectAccount),
  isWalletConnectEvent: () => (/* reexport safe */ _walletConnectEventFilters__WEBPACK_IMPORTED_MODULE_41__.isWalletConnectEvent),
  isWalletStateUpdateEvent: () => (/* reexport safe */ _isWalletStateUpdateEvent__WEBPACK_IMPORTED_MODULE_97__.isWalletStateUpdateEvent),
  isWrappedError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_16__.isWrappedError),
  isXchainNetwork: () => (/* reexport safe */ _network_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_9__.isXchainNetwork),
  isXchainNetworkId: () => (/* reexport safe */ _network_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_9__.isXchainNetworkId),
  launchFidoFlow: () => (/* reexport safe */ _seedless_fido__WEBPACK_IMPORTED_MODULE_39__.launchFidoFlow),
  lowerCaseKeys: () => (/* reexport safe */ _lowerCaseKeys__WEBPACK_IMPORTED_MODULE_63__.lowerCaseKeys),
  makeBNLike: () => (/* reexport safe */ _makeBNLike__WEBPACK_IMPORTED_MODULE_64__.makeBNLike),
  mapAddressesToVMs: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_0__.mapAddressesToVMs),
  mapMfasToRecoveryMethods: () => (/* reexport safe */ _seedless_fido__WEBPACK_IMPORTED_MODULE_39__.mapMfasToRecoveryMethods),
  mapVMAddresses: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_0__.mapVMAddresses),
  measureDuration: () => (/* reexport safe */ _measureDuration__WEBPACK_IMPORTED_MODULE_65__.measureDuration),
  networkToBlockchain: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_3__.networkToBlockchain),
  noop: () => (/* reexport safe */ _noop__WEBPACK_IMPORTED_MODULE_91__.noop),
  normalizeBalance: () => (/* reexport safe */ _normalizeBalance__WEBPACK_IMPORTED_MODULE_62__.normalizeBalance),
  now: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.now),
  omitUndefined: () => (/* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_20__.omitUndefined),
  onPageActivated: () => (/* reexport safe */ _onPageActivated__WEBPACK_IMPORTED_MODULE_49__.onPageActivated),
  openExtensionNewWindow: () => (/* reexport safe */ _extensionUtils__WEBPACK_IMPORTED_MODULE_69__.openExtensionNewWindow),
  openFullscreenTab: () => (/* reexport safe */ _openFullscreenTab__WEBPACK_IMPORTED_MODULE_99__.openFullscreenTab),
  openNewTab: () => (/* reexport safe */ _extensionUtils__WEBPACK_IMPORTED_MODULE_69__.openNewTab),
  openPopup: () => (/* reexport safe */ _extensionUtils__WEBPACK_IMPORTED_MODULE_69__.openPopup),
  openWindow: () => (/* reexport safe */ _extensionUtils__WEBPACK_IMPORTED_MODULE_69__.openWindow),
  padStart: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.padStart),
  parseAttributes: () => (/* reexport safe */ _nfts_metadataParser__WEBPACK_IMPORTED_MODULE_43__.parseAttributes),
  parseRawAttributesString: () => (/* reexport safe */ _nfts_metadataParser__WEBPACK_IMPORTED_MODULE_43__.parseRawAttributesString),
  readKeyFile: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_31__.readKeyFile),
  reload: () => (/* reexport safe */ _extensionUtils__WEBPACK_IMPORTED_MODULE_69__.reload),
  repeat: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.repeat),
  requestLog: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.requestLog),
  requestOidcAuth: () => (/* reexport safe */ _seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_34__.requestOidcAuth),
  requestParser: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.requestParser),
  resolve: () => (/* reexport safe */ _promiseResolver__WEBPACK_IMPORTED_MODULE_89__.resolve),
  responseLog: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.responseLog),
  responseParser: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.responseParser),
  shouldUseWalletConnectApproval: () => (/* reexport safe */ _shouldUseWalletConnectApproval__WEBPACK_IMPORTED_MODULE_19__.shouldUseWalletConnectApproval),
  signUpForNewsletter: () => (/* reexport safe */ _newsletter__WEBPACK_IMPORTED_MODULE_61__.signUpForNewsletter),
  stateLog: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.stateLog),
  stringToBigint: () => (/* reexport safe */ _stringToBigint__WEBPACK_IMPORTED_MODULE_72__.stringToBigint),
  stripAddressPrefix: () => (/* reexport safe */ _stripAddressPrefix__WEBPACK_IMPORTED_MODULE_78__.stripAddressPrefix),
  sumByProperty: () => (/* reexport safe */ _sumByProperty__WEBPACK_IMPORTED_MODULE_60__.sumByProperty),
  supportedBrowsers: () => (/* reexport safe */ _isSupportedBrowser__WEBPACK_IMPORTED_MODULE_56__.supportedBrowsers),
  toLogger: () => (/* reexport safe */ _logging__WEBPACK_IMPORTED_MODULE_24__.toLogger),
  toPrecision: () => (/* reexport safe */ _number__WEBPACK_IMPORTED_MODULE_92__.toPrecision),
  truncateAddress: () => (/* reexport safe */ _truncateAddress__WEBPACK_IMPORTED_MODULE_93__.truncateAddress),
  updateIfDifferent: () => (/* reexport safe */ _updateIfDifferent__WEBPACK_IMPORTED_MODULE_59__.updateIfDifferent),
  validateBtcSend: () => (/* reexport safe */ _send_btcSendUtils__WEBPACK_IMPORTED_MODULE_17__.validateBtcSend),
  wordPhraseLength: () => (/* reexport safe */ _seedPhraseValidation__WEBPACK_IMPORTED_MODULE_85__.wordPhraseLength),
  wrapError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_16__.wrapError)
});
/* ESM import */var _address__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/address.ts");
/* ESM import */var _actions_getUpdatedActionData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/actions/getUpdatedActionData.ts");
/* ESM import */var _accounts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/accounts/index.ts");
/* ESM import */var _bridge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/src/utils/bridge/index.ts");
/* ESM import */var _network_getProviderForNetwork__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/src/utils/network/getProviderForNetwork.ts");
/* ESM import */var _network_addGlacierAPIKeyIfNeeded__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../common/src/utils/network/addGlacierAPIKeyIfNeeded.ts");
/* ESM import */var _network_buildGlacierAuthHeaders__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../common/src/utils/network/buildGlacierAuthHeaders.ts");
/* ESM import */var _network_isAvalancheNetwork__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../common/src/utils/network/isAvalancheNetwork.ts");
/* ESM import */var _network_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../common/src/utils/network/isAvalanchePchainNetwork.ts");
/* ESM import */var _network_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../common/src/utils/network/isAvalancheXchainNetwork.ts");
/* ESM import */var _network_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("../common/src/utils/network/isEthereumNetwork.ts");
/* ESM import */var _network_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("../common/src/utils/network/isBitcoinNetwork.ts");
/* ESM import */var _network_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("../common/src/utils/network/isSolanaNetwork.ts");
/* ESM import */var _network_isValidHttpHeader__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("../common/src/utils/network/isValidHttpHeader.ts");
/* ESM import */var _getSyncDomain__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("../common/src/utils/getSyncDomain.ts");
/* ESM import */var _createMnemonicPhrase__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("../common/src/utils/createMnemonicPhrase.ts");
/* ESM import */var _errors__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("../common/src/utils/errors/index.ts");
/* ESM import */var _send_btcSendUtils__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("../common/src/utils/send/btcSendUtils.ts");
/* ESM import */var _calculateTotalBalance__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("../common/src/utils/calculateTotalBalance.ts");
/* ESM import */var _shouldUseWalletConnectApproval__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("../common/src/utils/shouldUseWalletConnectApproval.ts");
/* ESM import */var _object__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("../common/src/utils/object.ts");
/* ESM import */var _hasAccountBalances__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("../common/src/utils/hasAccountBalances.ts");
/* ESM import */var _isAddressValid__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("../common/src/utils/isAddressValid.ts");
/* ESM import */var _isContactValid__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("../common/src/utils/isContactValid.ts");
/* ESM import */var _logging__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("../common/src/utils/logging.ts");
/* ESM import */var _history__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("../common/src/utils/history/index.ts");
/* ESM import */var _account__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("../common/src/utils/account.ts");
/* ESM import */var _getEnabledBridgeTypes__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("../common/src/utils/getEnabledBridgeTypes.ts");
/* ESM import */var _getExplorerAddress__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__("../common/src/utils/getExplorerAddress.ts");
/* ESM import */var _getNftMetadata__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__("../common/src/utils/getNftMetadata.ts");
/* ESM import */var _constants__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__("../common/src/utils/constants.ts");
/* ESM import */var _keystore__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__("../common/src/utils/keystore/index.ts");
/* ESM import */var _getAddressForChain__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__("../common/src/utils/getAddressForChain.ts");
/* ESM import */var _bridgeTransactionUtils__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__("../common/src/utils/bridgeTransactionUtils.ts");
/* ESM import */var _seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__("../common/src/utils/seedless/getCubeSigner.ts");
/* ESM import */var _seedless_authenticateWithApple__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__("../common/src/utils/seedless/authenticateWithApple.ts");
/* ESM import */var _seedless_authenticateWithGoogle__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__("../common/src/utils/seedless/authenticateWithGoogle.ts");
/* ESM import */var _seedless_getOidcTokenProvider__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__("../common/src/utils/seedless/getOidcTokenProvider.ts");
/* ESM import */var _seedless_getSignerToken__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__("../common/src/utils/seedless/getSignerToken.ts");
/* ESM import */var _seedless_fido__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__("../common/src/utils/seedless/fido/index.ts");
/* ESM import */var _seedless_seedlessEventFilters__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__("../common/src/utils/seedless/seedlessEventFilters.ts");
/* ESM import */var _walletConnectEventFilters__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__("../common/src/utils/walletConnectEventFilters.ts");
/* ESM import */var _nfts_getSmallImageForNFT__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__("../common/src/utils/nfts/getSmallImageForNFT.ts");
/* ESM import */var _nfts_metadataParser__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__("../common/src/utils/nfts/metadataParser.ts");
/* ESM import */var _nfts_isNFT__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__("../common/src/utils/nfts/isNFT.ts");
/* ESM import */var _nfts_nftTypesUtils__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__("../common/src/utils/nfts/nftTypesUtils.ts");
/* ESM import */var _fireblocks_getFireblocksBtcAccessErrorCode__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__("../common/src/utils/fireblocks/getFireblocksBtcAccessErrorCode.ts");
/* ESM import */var _fireblocks_isFireblocksApiSupported__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__("../common/src/utils/fireblocks/isFireblocksApiSupported.ts");
/* ESM import */var _canSkipApproval__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__("../common/src/utils/canSkipApproval.ts");
/* ESM import */var _onPageActivated__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__("../common/src/utils/onPageActivated.ts");
/* ESM import */var _caipConversion__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__("../common/src/utils/caipConversion.ts");
/* ESM import */var _findTokenForAsset__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__("../common/src/utils/findTokenForAsset.ts");
/* ESM import */var _incrementalPromiseResolve__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__("../common/src/utils/incrementalPromiseResolve.ts");
/* ESM import */var _typeUtils__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__("../common/src/utils/typeUtils.ts");
/* ESM import */var _assertions__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__("../common/src/utils/assertions.ts");
/* ESM import */var _getHexStringToBytes__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__("../common/src/utils/getHexStringToBytes.ts");
/* ESM import */var _isSupportedBrowser__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__("../common/src/utils/isSupportedBrowser.ts");
/* ESM import */var _calculateGasAndFees__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__("../common/src/utils/calculateGasAndFees.ts");
/* ESM import */var _isTokenMalicious__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__("../common/src/utils/isTokenMalicious.ts");
/* ESM import */var _updateIfDifferent__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__("../common/src/utils/updateIfDifferent.ts");
/* ESM import */var _sumByProperty__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__("../common/src/utils/sumByProperty.ts");
/* ESM import */var _newsletter__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__("../common/src/utils/newsletter.ts");
/* ESM import */var _normalizeBalance__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__("../common/src/utils/normalizeBalance.ts");
/* ESM import */var _lowerCaseKeys__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__("../common/src/utils/lowerCaseKeys.ts");
/* ESM import */var _makeBNLike__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__("../common/src/utils/makeBNLike.ts");
/* ESM import */var _measureDuration__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__("../common/src/utils/measureDuration.ts");
/* ESM import */var _isLedgerVersionCompatible__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__("../common/src/utils/isLedgerVersionCompatible.ts");
/* ESM import */var _hasUnconfirmedBalance__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__("../common/src/utils/hasUnconfirmedBalance.ts");
/* ESM import */var _ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__("../common/src/utils/ipsfResolverWithFallback.ts");
/* ESM import */var _extensionUtils__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__("../common/src/utils/extensionUtils.ts");
/* ESM import */var _array__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__("../common/src/utils/array.ts");
/* ESM import */var _getCoreWebUrl__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__("../common/src/utils/getCoreWebUrl.ts");
/* ESM import */var _stringToBigint__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__("../common/src/utils/stringToBigint.ts");
/* ESM import */var _isActiveTab__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__("../common/src/utils/isActiveTab.ts");
/* ESM import */var _getDefaultChainIds__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__("../common/src/utils/getDefaultChainIds.ts");
/* ESM import */var _jsonRpcEngine__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__("../common/src/utils/jsonRpcEngine.ts");
/* ESM import */var _environment__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__("../common/src/utils/environment.ts");
/* ESM import */var _exponentialBackoff__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__("../common/src/utils/exponentialBackoff.ts");
/* ESM import */var _stripAddressPrefix__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__("../common/src/utils/stripAddressPrefix.ts");
/* ESM import */var _handleTxOutcome__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__("../common/src/utils/handleTxOutcome.ts");
/* ESM import */var _isBtcAddressInNetwork__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__("../common/src/utils/isBtcAddressInNetwork.ts");
/* ESM import */var _isPrimarySubnet__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__("../common/src/utils/isPrimarySubnet.ts");
/* ESM import */var _isSwimmerNetwork__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__("../common/src/utils/isSwimmerNetwork.ts");
/* ESM import */var _isBitcoin__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__("../common/src/utils/isBitcoin.ts");
/* ESM import */var _bigintToBig__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__("../common/src/utils/bigintToBig.ts");
/* ESM import */var _seedPhraseValidation__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__("../common/src/utils/seedPhraseValidation.ts");
/* ESM import */var _distributiveomit__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__("../common/src/utils/distributiveomit.ts");
/* ESM import */var _isFailedToFetchError__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__("../common/src/utils/isFailedToFetchError.ts");
/* ESM import */var _encoding__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__("../common/src/utils/encoding.ts");
/* ESM import */var _promiseResolver__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__("../common/src/utils/promiseResolver.ts");
/* ESM import */var _getAccountKey__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__("../common/src/utils/getAccountKey.ts");
/* ESM import */var _noop__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__("../common/src/utils/noop.ts");
/* ESM import */var _number__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__("../common/src/utils/number.ts");
/* ESM import */var _truncateAddress__WEBPACK_IMPORTED_MODULE_93__ = __webpack_require__("../common/src/utils/truncateAddress.ts");
/* ESM import */var _filterFalsyValues__WEBPACK_IMPORTED_MODULE_94__ = __webpack_require__("../common/src/utils/filterFalsyValues.ts");
/* ESM import */var _balance__WEBPACK_IMPORTED_MODULE_95__ = __webpack_require__("../common/src/utils/balance/index.ts");
/* ESM import */var _isLockStateChangedEvent__WEBPACK_IMPORTED_MODULE_96__ = __webpack_require__("../common/src/utils/isLockStateChangedEvent.ts");
/* ESM import */var _isWalletStateUpdateEvent__WEBPACK_IMPORTED_MODULE_97__ = __webpack_require__("../common/src/utils/isWalletStateUpdateEvent.ts");
/* ESM import */var _fetchAndVerify__WEBPACK_IMPORTED_MODULE_98__ = __webpack_require__("../common/src/utils/fetchAndVerify.ts");
/* ESM import */var _openFullscreenTab__WEBPACK_IMPORTED_MODULE_99__ = __webpack_require__("../common/src/utils/openFullscreenTab.ts");
/* ESM import */var _approveSeedlessRegistration__WEBPACK_IMPORTED_MODULE_100__ = __webpack_require__("../common/src/utils/approveSeedlessRegistration.ts");








































































































}),
"../common/src/utils/ipsfResolverWithFallback.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  IPFS_URL: () => (IPFS_URL),
  ipfsResolverWithFallback: () => (ipfsResolverWithFallback)
});
/* ESM import */var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-utils-sdk/esm/ipfsResolver.js");

const IPFS_URL = 'https://ipfs.io';
function ipfsResolverWithFallback(sourceUrl, desiredGatewayPrefix = IPFS_URL) {
    if (!sourceUrl) {
        return '';
    }
    try {
        return (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__.ipfsResolver)(sourceUrl, desiredGatewayPrefix);
    } catch  {
        return sourceUrl;
    }
}


}),
"../common/src/utils/isActiveTab.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isActiveTab: () => (isActiveTab)
});
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);

const isActiveTab = async (tabId)=>{
    try {
        const tab = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__.tabs.get(tabId);
        return Boolean(tab) && tab.active;
    } catch  {
        return false;
    }
};


}),
"../common/src/utils/isAddressValid.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isValidAddress: () => (isValidAddress),
  isValidAvmAddress: () => (isValidAvmAddress),
  isValidBtcAddress: () => (isValidBtcAddress),
  isValidPvmAddress: () => (isValidPvmAddress),
  isValidSvmAddress: () => (isValidSvmAddress),
  isValidXPAddress: () => (isValidXPAddress)
});
/* ESM import */var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/@avalabs/core-bridge-sdk/esm/lib/btc/address.js");
/* ESM import */var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/ethers/lib.esm/address/checks.js");
/* ESM import */var _solana_kit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/@solana/addresses/dist/index.browser.mjs");
/* ESM import */var _stripAddressPrefix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/stripAddressPrefix.ts");
/* ESM import */var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/@avalabs/avalanchejs/dist/es/index.js");





const isValidAddress = (address)=>{
    return !!address.length && (0,ethers__WEBPACK_IMPORTED_MODULE_1__.isAddress)(address);
};
const isValidBtcAddress = (address)=>{
    return !!address.length && (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_2__.isBech32Address)(address);
};
const isValidPvmAddress = (address)=>{
    return isValidXPAddressWithPrefix(address, 'P-');
};
const isValidAvmAddress = (address)=>{
    return isValidXPAddressWithPrefix(address, 'X-');
};
const isValidSvmAddress = (address)=>{
    return (0,_solana_kit__WEBPACK_IMPORTED_MODULE_3__.isAddress)(address);
};
function isValidXPAddressWithPrefix(value, forcedPrefix) {
    const address = forcedPrefix && !value.startsWith(forcedPrefix) ? `${forcedPrefix}${value}` : value;
    const addressBody = (0,_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_0__.stripAddressPrefix)(address);
    return isValidXPAddress(addressBody);
}
const isValidXPAddress = (address)=>{
    try {
        _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_4__.utils.parseBech32(address);
        return true;
    } catch  {
        return false;
    }
};


}),
"../common/src/utils/isBitcoin.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isBitcoin: () => (isBitcoin)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isBitcoin(network) {
    return network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.BITCOIN;
}


}),
"../common/src/utils/isBtcAddressInNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isBtcAddressInNetwork: () => (isBtcAddressInNetwork)
});
/* ESM import */var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-bridge-sdk/esm/lib/btc/address.js");

/**
 * Check if the given address is a valid Bitcoin address
 * @param address Bitcoin address, bech32 or b58
 * @param isMainnet Verify address against mainnet or testnet
 */ function isBtcAddressInNetwork(address, isMainnet) {
    return (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.isBech32AddressInNetwork)(address, isMainnet) || (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.isBase58AddressInNetwork)(address, isMainnet);
}


}),
"../common/src/utils/isContactValid.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isContactValid: () => (isContactValid)
});
/* ESM import */var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/ethers/lib.esm/address/checks.js");
/* ESM import */var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/@avalabs/core-bridge-sdk/esm/lib/btc/address.js");
/* ESM import */var _isAddressValid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/isAddressValid.ts");



const isContactValid = (contact)=>{
    if (!contact.name || !contact.address && !contact.addressBTC && !contact.addressXP && !contact.addressSVM) {
        return {
            valid: false,
            reason: 'contact name or address is missing'
        };
    }
    const isAddressValid = (!contact.address || (0,ethers__WEBPACK_IMPORTED_MODULE_1__.isAddress)(contact.address)) && (!contact.addressBTC || (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_2__.isBech32Address)(contact.addressBTC)) && (!contact.addressXP || (0,_isAddressValid__WEBPACK_IMPORTED_MODULE_0__.isValidXPAddress)(contact.addressXP)) && (!contact.addressSVM || (0,_isAddressValid__WEBPACK_IMPORTED_MODULE_0__.isValidSvmAddress)(contact.addressSVM));
    if (isAddressValid) {
        return {
            valid: true,
            reason: ''
        };
    }
    return {
        valid: false,
        reason: 'address is invalid'
    };
};


}),
"../common/src/utils/isFailedToFetchError.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isFailedToFetchError: () => (isFailedToFetchError)
});
const isFailedToFetchError = (err)=>{
    return err instanceof Error && /Failed to fetch/.test(err.message);
};


}),
"../common/src/utils/isLedgerVersionCompatible.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isLedgerVersionCompatible: () => (isLedgerVersionCompatible)
});
// ledgerAppVersion >= requiredAppVersion
function isLedgerVersionCompatible(ledgerAppVersion, requiredAppVersion) {
    const compare = ledgerAppVersion.localeCompare(requiredAppVersion, undefined, {
        numeric: true,
        sensitivity: 'base'
    });
    // ledgerAppVersion > requiredAppVersion
    if (compare === 1) return true;
    // ledgerAppVersion = requiredAppVersion
    if (compare === 0) return true;
    // ledgerAppVersion < requiredAppVersion
    if (compare === -1) return false;
}


}),
"../common/src/utils/isLockStateChangedEvent.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isLockStateChangedEvent: () => (isLockStateChangedEvent)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");

function isLockStateChangedEvent(evt) {
    return evt.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.LockEvents.LOCK_STATE_CHANGED;
}


}),
"../common/src/utils/isPrimarySubnet.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isPrimarySubnet: () => (isPrimarySubnet)
});
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/providers/constants.js");

function isPrimarySubnet(subnetId) {
    return subnetId === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_0__.MainnetContext.pBlockchainID;
}


}),
"../common/src/utils/isSupportedBrowser.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isSupportedBrowser: () => (isSupportedBrowser),
  supportedBrowsers: () => (supportedBrowsers)
});
/* ESM import */var detect_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/detect-browser/es/index.js");

const supportedBrowsers = [
    'chrome'
];
const isSupportedBrowser = ()=>{
    const browser = (0,detect_browser__WEBPACK_IMPORTED_MODULE_0__.detect)();
    const isSupported = supportedBrowsers.includes(browser?.name ?? '');
    return isSupported;
};


}),
"../common/src/utils/isSwimmerNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isSwimmer: () => (isSwimmer),
  isSwimmerByChainId: () => (isSwimmerByChainId)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isSwimmer(network) {
    return isSwimmerByChainId(network.chainId);
}
function isSwimmerByChainId(chainId) {
    return !!(chainId === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SWIMMER || chainId === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SWIMMER_TESTNET);
}


}),
"../common/src/utils/isTokenMalicious.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isTokenMalicious: () => (isTokenMalicious)
});
/* ESM import */var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/vm-module-types/dist/index.js");
/* ESM import */var _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/@avalabs/glacier-sdk/esm/generated/models/Erc20TokenBalance.js");


const isTokenMalicious = (token)=>{
    if (!('type' in token) || token.type !== _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC20) {
        return false;
    }
    return token.reputation === _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_1__.Erc20TokenBalance.tokenReputation.MALICIOUS;
};


}),
"../common/src/utils/isWalletStateUpdateEvent.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isWalletStateUpdateEvent: () => (isWalletStateUpdateEvent)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");

function isWalletStateUpdateEvent(evt) {
    return evt.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.WalletEvents.WALLET_STATE_UPDATE;
}


}),
"../common/src/utils/jsonRpcEngine.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  engine: () => (engine)
});
/* ESM import */var json_rpc_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/json-rpc-engine/dist/index.js");
/* ESM import */var json_rpc_engine__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(json_rpc_engine__WEBPACK_IMPORTED_MODULE_0__);
/* ESM import */var eth_json_rpc_middleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/eth-json-rpc-middleware/dist/index.js");
/* ESM import */var eth_json_rpc_middleware__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(eth_json_rpc_middleware__WEBPACK_IMPORTED_MODULE_1__);
/* ESM import */var _network_addGlacierAPIKeyIfNeeded__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/network/addGlacierAPIKeyIfNeeded.ts");



async function engine(network) {
    const fetchMiddleware = (0,eth_json_rpc_middleware__WEBPACK_IMPORTED_MODULE_1__.createFetchMiddleware)({
        get rpcUrl () {
            return (0,_network_addGlacierAPIKeyIfNeeded__WEBPACK_IMPORTED_MODULE_2__.addGlacierAPIKeyIfNeeded)(network.rpcUrl);
        }
    });
    const rpcEngine = new json_rpc_engine__WEBPACK_IMPORTED_MODULE_0__.JsonRpcEngine();
    rpcEngine.push(fetchMiddleware);
    return rpcEngine;
}


}),
"../common/src/utils/keystore/cryptoHelpers.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  calculatePasswordHash: () => (calculatePasswordHash),
  decrypt: () => (decrypt),
  getHash: () => (getHash)
});
/* ESM import */var _noble_hashes_sha256__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/@noble/hashes/esm/sha256.js");
/* ESM import */var _noble_hashes_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@noble/hashes/esm/utils.js");
/**
 * Helper utilities for encryption and password hashing, browser-safe.
 * Encryption is using AES-GCM with a random public nonce.
 */ 

const SALT_SIZE = 16;
const AES_LENGTH = 256;
const TAG_LENGTH = 128;
const KEYGEN_ITERATIONS_V3 = 200000; // v3 and and any version above
const makeSalt = ()=>(0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_0__.randomBytes)(SALT_SIZE);
const getHash = (password, salt)=>(0,_noble_hashes_sha256__WEBPACK_IMPORTED_MODULE_1__.sha256)((0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_0__.concatBytes)((0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_0__.utf8ToBytes)(password), salt));
const calculatePasswordHash = (password, salt)=>{
    let slt;
    if (salt instanceof Uint8Array) {
        slt = salt;
    } else {
        slt = makeSalt();
    }
    const hash = getHash(password, getHash(password, slt));
    return {
        salt: slt,
        hash
    };
};
const importKey = async (pwkey)=>crypto.subtle.importKey('raw', pwkey, {
        name: 'PBKDF2'
    }, false, [
        'deriveKey'
    ]);
const deriveKey = async (keyMaterial, salt, iterations = KEYGEN_ITERATIONS_V3)=>crypto.subtle.deriveKey({
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256'
    }, keyMaterial, {
        name: 'AES-GCM',
        length: AES_LENGTH
    }, false, [
        'encrypt',
        'decrypt'
    ]);
const decrypt = async (password, ciphertext, salt, iv, keygenIterations)=>{
    const pwkey = getHash(password, salt);
    const keyMaterial = await importKey(pwkey);
    const pkey = await deriveKey(keyMaterial, salt, keygenIterations);
    const pt = await crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv,
        additionalData: salt,
        tagLength: TAG_LENGTH
    }, pkey, ciphertext);
    return new Uint8Array(pt);
};


}),
"../common/src/utils/keystore/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KEYSTORE_VERSION: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_0__.KEYSTORE_VERSION),
  KeystoreFixtures: () => (/* reexport module object */ _keystore_fixtures__WEBPACK_IMPORTED_MODULE_2__),
  calculatePasswordHash: () => (/* reexport safe */ _cryptoHelpers__WEBPACK_IMPORTED_MODULE_1__.calculatePasswordHash),
  decrypt: () => (/* reexport safe */ _cryptoHelpers__WEBPACK_IMPORTED_MODULE_1__.decrypt),
  extractKeysFromDecryptedFile: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_0__.extractKeysFromDecryptedFile),
  getHash: () => (/* reexport safe */ _cryptoHelpers__WEBPACK_IMPORTED_MODULE_1__.getHash),
  readKeyFile: () => (/* reexport safe */ _keystore__WEBPACK_IMPORTED_MODULE_0__.readKeyFile)
});
/* ESM import */var _keystore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/keystore/keystore.ts");
/* ESM import */var _cryptoHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/keystore/cryptoHelpers.ts");
/* ESM import */var _keystore_fixtures__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/keystore/keystore-fixtures/index.ts");





}),
"../common/src/utils/keystore/keystore-fixtures/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KEYSTORE_V2: () => (KEYSTORE_V2),
  KEYSTORE_V3: () => (KEYSTORE_V3),
  KEYSTORE_V4: () => (KEYSTORE_V4),
  KEYSTORE_V5: () => (KEYSTORE_V5),
  KEYSTORE_V6: () => (KEYSTORE_V6),
  KEYSTORE_V6_PKEY: () => (KEYSTORE_V6_PKEY)
});
/* ESM import */var _keystore_v2_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/keystore/keystore-fixtures/keystore-v2.json");
/* ESM import */var _keystore_v3_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/keystore/keystore-fixtures/keystore-v3.json");
/* ESM import */var _keystore_v4_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/keystore/keystore-fixtures/keystore-v4.json");
/* ESM import */var _keystore_v5_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/src/utils/keystore/keystore-fixtures/keystore-v5.json");
/* ESM import */var _keystore_v6_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/src/utils/keystore/keystore-fixtures/keystore-v6.json");
/* ESM import */var _keystore_v6_private_key_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../common/src/utils/keystore/keystore-fixtures/keystore-v6-private-key.json");
/**
 * All of the keys in the files below are for testing purposes only.
 * Do not use them in any other way.
 */ 





const KEYSTORE_V2 = {
    file: _keystore_v2_json__WEBPACK_IMPORTED_MODULE_0__,
    password: '111111111',
    expectedKeys: [
        {
            key: '2DvMW4ZsNVdiiBsrEdPBTDr47bTtgr4H8qQKXz2D37YKeTLwDw'
        },
        {
            key: '2rr9Fzq87moKGkkJeCjqewGEWY1KW4Na3bnF31GecggLL16XXG'
        }
    ],
    expectedPhrases: [
        {
            key: 'patient dragon there taxi husband medal amused push busy draft only axis chat august december essence vintage must liquid zero truck inner potato effort',
            type: 'mnemonic'
        },
        {
            key: 'visual arctic dune seminar ask balcony mass truly entire surround income battle clump village manual alter purpose various squeeze recipe round fade blame meadow',
            type: 'mnemonic'
        }
    ]
};
const KEYSTORE_V3 = {
    file: _keystore_v3_json__WEBPACK_IMPORTED_MODULE_1__,
    password: '111111111',
    expectedKeys: [
        {
            key: '2DvMW4ZsNVdiiBsrEdPBTDr47bTtgr4H8qQKXz2D37YKeTLwDw'
        },
        {
            key: '2rr9Fzq87moKGkkJeCjqewGEWY1KW4Na3bnF31GecggLL16XXG'
        }
    ],
    expectedPhrases: [
        {
            key: 'patient dragon there taxi husband medal amused push busy draft only axis chat august december essence vintage must liquid zero truck inner potato effort',
            type: 'mnemonic'
        },
        {
            key: 'visual arctic dune seminar ask balcony mass truly entire surround income battle clump village manual alter purpose various squeeze recipe round fade blame meadow',
            type: 'mnemonic'
        }
    ]
};
const KEYSTORE_V4 = {
    file: _keystore_v4_json__WEBPACK_IMPORTED_MODULE_2__,
    password: '111111111',
    expectedKeys: [
        {
            key: 'jegD9bfh1qYjnyxUgnG92CEyAx7s4iZRgcYatdN2u1qhy1Tbr'
        }
    ],
    expectedPhrases: [
        {
            key: 'general ritual pitch clump tragic entry possible detail case moment fade sleep cabin pig churn solid nation wrestle armor because simple disagree cry meat',
            type: 'mnemonic'
        }
    ]
};
const KEYSTORE_V5 = {
    file: _keystore_v5_json__WEBPACK_IMPORTED_MODULE_3__,
    password: '111111111',
    expectedKeys: [
        {
            key: 'solar ordinary sentence pelican trim ring indicate cake ordinary water size improve impose gentle frown sound know siren sick elder wait govern tortoise unit'
        }
    ],
    expectedPhrases: [
        {
            key: 'solar ordinary sentence pelican trim ring indicate cake ordinary water size improve impose gentle frown sound know siren sick elder wait govern tortoise unit',
            type: 'mnemonic'
        }
    ]
};
const KEYSTORE_V6 = {
    file: _keystore_v6_json__WEBPACK_IMPORTED_MODULE_4__,
    password: '111111111',
    expectedPhrases: [
        {
            key: 'solar ordinary sentence pelican trim ring indicate cake ordinary water size improve impose gentle frown sound know siren sick elder wait govern tortoise unit',
            type: 'mnemonic'
        }
    ]
};
const KEYSTORE_V6_PKEY = {
    file: _keystore_v6_private_key_json__WEBPACK_IMPORTED_MODULE_5__,
    password: '123123123',
    expectedPhrases: [
        {
            key: 'PrivateKey-2NryVJe1H9dqRbJggntZggK7fEmj3QpCHTqadj6i6m4qciANPE',
            type: 'singleton'
        }
    ]
};


}),
"../common/src/utils/keystore/keystore.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KEYSTORE_VERSION: () => (KEYSTORE_VERSION),
  extractKeysFromDecryptedFile: () => (extractKeysFromDecryptedFile),
  readKeyFile: () => (readKeyFile)
});
/* ESM import */var bip39__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/bip39/src/index.js");
/* ESM import */var _noble_hashes_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/@noble/hashes/esm/utils.js");
/* ESM import */var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/index.ts");
/* ESM import */var _cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/keystore/cryptoHelpers.ts");
/* provided dependency */ var Buffer = __webpack_require__("../../node_modules/buffer/index.js")["Buffer"];





const KEYSTORE_VERSION = '6.0';
const KEYGEN_ITERATIONS_V2 = 100000;
async function readV2(data, pass) {
    const version = data.version;
    const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
    const checkHash = (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.getHash)(pass, salt);
    const checkHashString = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode((0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_4__.toBytes)(checkHash));
    if (checkHashString !== data.pass_hash) {
        throw _core_types__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
    }
    const decryptedKeys = await Promise.all(data.keys.map(async (keyData)=>{
        const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
        const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
        const decryptedKey = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce, KEYGEN_ITERATIONS_V2);
        return {
            key: _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(decryptedKey)
        };
    }));
    return {
        version,
        activeIndex: 0,
        keys: decryptedKeys
    };
}
async function readV3(data, pass) {
    const version = data.version;
    const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
    const checkHash = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.calculatePasswordHash)(pass, salt);
    const checkHashString = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(checkHash.hash);
    if (checkHashString !== data.pass_hash) {
        throw _core_types__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
    }
    const decryptedKeys = await Promise.all(data.keys.map(async (keyData)=>{
        const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
        const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
        const decryptedKey = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce);
        return {
            key: _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(decryptedKey)
        };
    }));
    return {
        version,
        activeIndex: 0,
        keys: decryptedKeys
    };
}
async function readV4(data, pass) {
    const version = data.version;
    const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
    const checkHash = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.calculatePasswordHash)(pass, salt);
    const checkHashString = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(checkHash.hash);
    if (checkHashString !== data.pass_hash) {
        throw _core_types__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
    }
    const decryptedKeys = await Promise.all(data.keys.map(async (keyData)=>{
        const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
        const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
        const decryptedKey = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce);
        return {
            key: _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(decryptedKey)
        };
    }));
    return {
        version,
        activeIndex: 0,
        keys: decryptedKeys
    };
}
async function readV5(data, pass) {
    const version = data.version;
    const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
    const checkHash = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.calculatePasswordHash)(pass, salt);
    const checkHashString = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(checkHash.hash);
    if (checkHashString !== data.pass_hash) {
        throw _core_types__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
    }
    const decoder = new TextDecoder();
    const decryptedKeys = await Promise.all(data.keys.map(async (keyData)=>{
        const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
        const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
        return {
            key: decoder.decode(await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce))
        };
    }));
    return {
        version,
        activeIndex: 0,
        keys: decryptedKeys
    };
}
async function readV6(data, pass) {
    const version = data.version;
    const activeIndex = data.activeIndex;
    const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
    const decoder = new TextDecoder();
    const decryptedKeys = await Promise.all(data.keys.map(async (keyData)=>{
        const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
        const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
        try {
            return {
                key: decoder.decode(await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce)),
                type: keyData.type
            };
        } catch (_err) {
            throw _core_types__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
        }
    }));
    return {
        version,
        activeIndex: activeIndex || 0,
        keys: decryptedKeys
    };
}
async function readKeyFile(data, pass) {
    switch(data.version){
        case '6.0':
            return await readV6(data, pass);
        case '5.0':
            return await readV5(data, pass);
        case '4.0':
            return await readV4(data, pass);
        case '3.0':
            return await readV3(data, pass);
        case '2.0':
            return await readV2(data, pass);
        default:
            throw _core_types__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidVersion;
    }
}
function extractKeysV2({ keys }) {
    return keys.map((key)=>{
        const keyBuf = Buffer.from(_avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(key.key));
        const keyHex = keyBuf.toString('hex');
        const paddedKeyHex = keyHex.padStart(64, '0');
        const mnemonic = bip39__WEBPACK_IMPORTED_MODULE_0__.entropyToMnemonic(paddedKeyHex);
        return {
            key: mnemonic,
            type: 'mnemonic'
        };
    });
}
function extractKeysV5(file) {
    return file.keys.map((key)=>({
            key: key.key,
            type: 'mnemonic'
        }));
}
function extractKeysV6(file) {
    return file.keys.map((key)=>({
            type: key.type,
            key: key.key
        }));
}
function extractKeysFromDecryptedFile(file) {
    switch(file.version){
        case '6.0':
            return extractKeysV6(file);
        case '5.0':
            return extractKeysV5(file);
        case '4.0':
            return extractKeysV2(file);
        case '3.0':
            return extractKeysV2(file);
        case '2.0':
            return extractKeysV2(file);
        default:
            throw _core_types__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidVersion;
    }
}


}),
"../common/src/utils/logging.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  connectionLog: () => (connectionLog),
  disconnectLog: () => (disconnectLog),
  eventLog: () => (eventLog),
  formatAndLog: () => (formatAndLog),
  formatTime: () => (formatTime),
  now: () => (now),
  padStart: () => (padStart),
  repeat: () => (repeat),
  requestLog: () => (requestLog),
  requestParser: () => (requestParser),
  responseLog: () => (responseLog),
  responseParser: () => (responseParser),
  stateLog: () => (stateLog),
  toLogger: () => (toLogger)
});
/* ESM import */var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/rxjs/dist/esm5/internal/operators/tap.js");
/* ESM import */var _environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/environment.ts");


const repeat = (str, times)=>new Array(times + 1).join(str);
const padStart = (num, maxLength, char = ' ')=>repeat(char, maxLength - num.toString().length) + num;
const formatTime = (time)=>{
    const h = padStart(time.getHours(), 2, '0');
    const m = padStart(time.getMinutes(), 2, '0');
    const s = padStart(time.getSeconds(), 2, '0');
    const ms = padStart(time.getMilliseconds(), 3, '0');
    return `${h}:${m}:${s}.${ms}`;
};
const now = ()=>formatTime(new Date());
const style = (color, bold = true)=>{
    return `color:${color};font-weight:${bold ? '600' : '300'};font-size:11px`;
};
function formatAndLog(message, value, config) {
    console.groupCollapsed('%c%s  %s', style(config?.color ?? '#cccccc'), now(), message);
    console.log(value.data ? requestParser(value.data) : responseParser(value));
    console.groupEnd();
}
function responseParser(response) {
    function setKeyAndValue(key) {
        const value = response[key];
        if (key === 'result' || key === 'value') {
            try {
                return value ? JSON.parse(value) : value;
            } catch  {
                return value;
            }
        }
        return value;
    }
    return Object.keys(response).reduce((acc, key)=>{
        acc[key] = setKeyAndValue(key);
        return acc;
    }, {});
}
function requestParser(request) {
    function setKeyAndValue(key) {
        if (key === 'params') {
            return `${key}: ${JSON.stringify(request[key] || [])}`;
        }
        return `${key}: ${request[key]}`;
    }
    return Object.keys(request).reduce((acc, key)=>{
        return acc ? `${acc}\n${setKeyAndValue(key)}` : setKeyAndValue(key);
    }, ``);
}
function toLogger(name, showLogs = true) {
    return (observer)=>{
        return observer.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_1__.tap)((value)=>showLogs && formatAndLog(name, value)));
    };
}
function connectionLog(message) {
    console.log('%c%s', style('#F2C53D'), `⚡️ connection: ${message}`);
}
function disconnectLog(message) {
    console.log('%c%s', style('#FA981D'), `🔌 disconnected: ${message}`);
}
function responseLog(message, value) {
    if (value.result || value.data?.result || value.result === '') {
        formatAndLog(`🚀 ${message}`, value, {
            color: '#A6BF4B'
        });
    } else if (value.error || value.data?.error) {
        formatAndLog(`💥 ${message}`, value, {
            color: '#E3460E'
        });
    } else {
        formatAndLog(`❓ ${message}`, value, {
            color: '#cccccc'
        });
    }
}
function requestLog(message, data) {
    formatAndLog(`📫 ${message}`, data, {
        color: '#424242'
    });
}
function eventLog(message, data) {
    formatAndLog(`🎯 ${message}`, data, {
        color: '#598AFA'
    });
}
function stateLog(data) {
    // prevent logging sensitive information such as mnemonic or wallet object in production
    if (!(0,_environment__WEBPACK_IMPORTED_MODULE_0__.isDevelopment)()) {
        return;
    }
    if (data.walletState.locked) {
        formatAndLog(`📚 Background State (Locked)`, data, {
            color: '#E346C5'
        });
    } else {
        formatAndLog(`📚 Background State`, data, {
            color: '#E346C5'
        });
    }
}


}),
"../common/src/utils/lowerCaseKeys.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  lowerCaseKeys: () => (lowerCaseKeys)
});
const lowerCaseKeys = (obj)=>{
    return Object.fromEntries(Object.entries(obj).map(([key, value])=>[
            key.toLowerCase(),
            value
        ]));
};


}),
"../common/src/utils/makeBNLike.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  makeBNLike: () => (makeBNLike)
});
function makeBNLike(n) {
    if (n == null) return undefined;
    return '0x' + BigInt(n).toString(16);
}


}),
"../common/src/utils/measureDuration.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  measureDuration: () => (measureDuration)
});
const measureDuration = (id)=>{
    const measurementId = id ?? crypto.randomUUID();
    const start = ()=>{
        performance.mark(`${measurementId}-start`);
    };
    const end = ()=>{
        const measurement = performance.measure(`${measurementId}-measurement`, `${measurementId}-start`);
        performance.clearMarks(`${measurementId}-start`);
        performance.clearMeasures(`${measurementId}-measurement`);
        return measurement.duration;
    };
    return {
        measurementId,
        start,
        end
    };
};


}),
"../common/src/utils/network/addGlacierAPIKeyIfNeeded.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  addGlacierAPIKeyIfNeeded: () => (addGlacierAPIKeyIfNeeded)
});
function addGlacierAPIKeyIfNeeded(url) {
    if (false) {}
    // RPC urls returned in the token list are always using the production URL
    const knownHosts = new Set([
        'glacier-api.avax.network',
        'proxy-api.avax.network',
        new URL("https://glacier-api-dev.avax.network").host,
        new URL("https://proxy-api-dev.avax.network").host
    ]);
    const urlObject = new URL(url);
    if ( true && knownHosts.has(urlObject.host)) {
        urlObject.searchParams.append('token', "bf117238dd19756d9d1845631b189036be0c1f28dca7b35bd7f822eaae3de596");
        return urlObject.toString();
    }
    return url;
}


}),
"../common/src/utils/network/buildGlacierAuthHeaders.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  buildGlacierAuthHeaders: () => (buildGlacierAuthHeaders)
});
const buildGlacierAuthHeaders = (apiKey)=>{
    if (!apiKey) {
        return {};
    }
    return {
        'X-Glacier-Api-Key': apiKey
    };
};


}),
"../common/src/utils/network/getProviderForNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getProviderForNetwork: () => (getProviderForNetwork)
});
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/SolanaVM/utils/solanaProvider.js");
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/providers/BitcoinProvider.js");
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/jsonRpcBatchProvider.js");
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/providers/JsonRpcProvider.js");
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* ESM import */var ethers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/ethers/lib.esm/utils/fetch.js");
/* ESM import */var ethers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../node_modules/ethers/lib.esm/providers/network.js");
/* ESM import */var _addGlacierAPIKeyIfNeeded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/network/addGlacierAPIKeyIfNeeded.ts");




const getProviderForNetwork = async (network, useMulticall = false)=>{
    if (network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.SVM) {
        return (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_2__.getSolanaProvider)({
            isTestnet: Boolean(network.isTestnet),
            rpcUrl: network.isTestnet ? 'https://api.devnet.solana.com' // NowNodes does not support Solana Devnet
             : `${"https://proxy-api-dev.avax.network"}/proxy/nownodes/sol`
        });
    }
    if (network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.BITCOIN) {
        return new _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__.BitcoinProvider(!network.isTestnet, undefined, `${"https://proxy-api-dev.avax.network"}/proxy/nownodes/${network.isTestnet ? 'btcbook-testnet' : 'btcbook'}`, `${"https://proxy-api-dev.avax.network"}/proxy/nownodes/${network.isTestnet ? 'btc-testnet' : 'btc'}`,  true ? {
            token: "bf117238dd19756d9d1845631b189036be0c1f28dca7b35bd7f822eaae3de596"
        } : 0);
    } else if (network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.EVM) {
        const fetchConfig = new ethers__WEBPACK_IMPORTED_MODULE_4__.FetchRequest((0,_addGlacierAPIKeyIfNeeded__WEBPACK_IMPORTED_MODULE_0__.addGlacierAPIKeyIfNeeded)(network.rpcUrl));
        if (network.customRpcHeaders) {
            const headers = Object.entries(network.customRpcHeaders);
            for (const [name, value] of headers){
                fetchConfig.setHeader(name, value);
            }
        }
        const provider = new _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_5__.JsonRpcBatchInternal(useMulticall ? {
            maxCalls: 40,
            multiContractAddress: network.utilityAddresses?.multicall
        } : 40, fetchConfig, new ethers__WEBPACK_IMPORTED_MODULE_6__.Network(network.chainName, network.chainId));
        provider.pollingInterval = 2000;
        return provider;
    } else if (network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.AVM || network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.PVM || network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.CoreEth) {
        return network.isTestnet ? _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_7__.JsonRpcProvider.getDefaultFujiProvider() : _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_7__.JsonRpcProvider.getDefaultMainnetProvider();
    } else {
        throw new Error('unsupported network');
    }
};


}),
"../common/src/utils/network/isAvalancheNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isAvalancheChainId: () => (isAvalancheChainId),
  isAvalancheNetwork: () => (isAvalancheNetwork)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isAvalancheNetwork(network) {
    return isAvalancheChainId(network.chainId);
}
function isAvalancheChainId(chainId) {
    return _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_MAINNET_ID === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_LOCAL_ID === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_TESTNET_ID === chainId;
}


}),
"../common/src/utils/network/isAvalanchePchainNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isPchainNetwork: () => (isPchainNetwork),
  isPchainNetworkId: () => (isPchainNetworkId)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isPchainNetwork(network) {
    if (!network) {
        return false;
    }
    return network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.PVM;
}
function isPchainNetworkId(chainId) {
    return _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_P === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_TEST_P === chainId;
}


}),
"../common/src/utils/network/isAvalancheXchainNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isXchainNetwork: () => (isXchainNetwork),
  isXchainNetworkId: () => (isXchainNetworkId)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isXchainNetwork(network) {
    if (!network) {
        return false;
    }
    return network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.AVM;
}
//TODO: Fix this once we figure out how to separate between x and p chain ID
function isXchainNetworkId(chainId) {
    return _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_X === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_TEST_X === chainId;
}


}),
"../common/src/utils/network/isBitcoinNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isBitcoinChainId: () => (isBitcoinChainId),
  isBitcoinNetwork: () => (isBitcoinNetwork)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isBitcoinNetwork(network) {
    return isBitcoinChainId(network.chainId);
}
function isBitcoinChainId(chainId) {
    return _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.BITCOIN === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.BITCOIN_TESTNET === chainId;
}


}),
"../common/src/utils/network/isEthereumNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isEthereumChainId: () => (isEthereumChainId),
  isEthereumNetwork: () => (isEthereumNetwork)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isEthereumNetwork(network) {
    return isEthereumChainId(network.chainId);
}
function isEthereumChainId(chainId) {
    return _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.ETHEREUM_HOMESTEAD === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.ETHEREUM_TEST_GOERLY === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.ETHEREUM_TEST_RINKEBY === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.ETHEREUM_TEST_SEPOLIA === chainId;
}


}),
"../common/src/utils/network/isSolanaNetwork.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isSolanaChainId: () => (isSolanaChainId),
  isSolanaNetwork: () => (isSolanaNetwork)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isSolanaNetwork(network) {
    return network ? isSolanaChainId(network.chainId) : false;
}
function isSolanaChainId(chainId) {
    return _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SOLANA_DEVNET_ID === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SOLANA_MAINNET_ID === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SOLANA_TESTNET_ID === chainId;
}


}),
"../common/src/utils/network/isValidHttpHeader.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isValidHttpHeader: () => (isValidHttpHeader)
});
const isValidHttpHeader = (name, value)=>{
    try {
        new Headers({
            [name]: value
        });
        return true;
    } catch  {
        return false;
    }
};


}),
"../common/src/utils/newsletter.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isNewsletterConfigured: () => (isNewsletterConfigured),
  signUpForNewsletter: () => (signUpForNewsletter)
});
function isNewsletterConfigured() {
    return Boolean( true && "8c7d7ccd-5a7e-4fcb-b1aa-20c1b3b4ba7c");
}
async function signUpForNewsletter(data) {
    if (!isNewsletterConfigured()) {
        throw new Error('Newsletter is not configured');
    }
    const proxyURl = `${"https://ac-gateway-development-integration-k8s-us-east-1.avacloud-dev.io"}/v1/hs/forms/${"7522520"}/${"8c7d7ccd-5a7e-4fcb-b1aa-20c1b3b4ba7c"}`;
    const headers = {
        Accept: '*',
        'Content-Type': 'application/json'
    };
    const requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    };
    return fetch(proxyURl, requestOptions);
}


}),
"../common/src/utils/nfts/getSmallImageForNFT.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getSmallImageForNFT: () => (getSmallImageForNFT)
});
/* ESM import */var _ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/ipsfResolverWithFallback.ts");

const COVALENT_IMG_SIZER = 'https://image-proxy.svc.prod.covalenthq.com/cdn-cgi/image';
/**
 * Covalent has an on the fly image resizer, it resolves image urls then resizes the image.
 *
 * This allows us to request smaller images depending on the UI needs
 *
 * @param imgUrl the url of the image to convert to size
 * @returns The url to the image which is sized at the time of request
 */ function getSmallImageForNFT(imgUrl, imageSize = '256') {
    const url = (0,_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_0__.ipfsResolverWithFallback)(imgUrl);
    return `${COVALENT_IMG_SIZER}/width=${imageSize},fit/${url}`;
}


}),
"../common/src/utils/nfts/isNFT.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isNFT: () => (isNFT),
  isNftTokenType: () => (isNftTokenType)
});
/* ESM import */var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/vm-module-types/dist/index.js");

function isNftTokenType(type) {
    return type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC721 || type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC1155;
}
function isNFT(token) {
    return isNftTokenType(token.type);
}


}),
"../common/src/utils/nfts/metadataParser.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  parseAttributes: () => (parseAttributes),
  parseRawAttributesString: () => (parseRawAttributesString)
});
const parseAttributes = (attributes)=>{
    return Array.isArray(attributes) ? parseRawAttributesArray(attributes) : attributes === 'string' ? parseRawAttributesString(attributes) : attributes;
};
const parseRawAttributesString = (rawAttributesString)=>{
    if (rawAttributesString === undefined) return [];
    const rawAttributes = rawAttributesString ? JSON.parse(rawAttributesString) : [];
    const parsedAttributes = rawAttributes.reduce((acc, attr)=>[
            ...acc,
            {
                name: attr.name ?? attr.trait_type,
                value: attr.value
            }
        ], []);
    return parsedAttributes;
};
const parseRawAttributesArray = (rawAttributesArray)=>{
    if (rawAttributesArray === undefined) return [];
    const parsedAttributes = rawAttributesArray.map((attr)=>{
        return {
            name: attr.name ?? attr.trait_type,
            value: attr.value
        };
    });
    return parsedAttributes;
};


}),
"../common/src/utils/nfts/nftTypesUtils.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  is1155Response: () => (is1155Response),
  isErc721TokenBalance: () => (isErc721TokenBalance)
});
/* ESM import */var _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/glacier-sdk/esm/generated/models/Erc721TokenBalance.js");

function is1155Response(item) {
    return Object.keys(item.value).includes('erc1155TokenBalances');
}
function isErc721TokenBalance(token) {
    return token.ercType === _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.Erc721TokenBalance.ercType.ERC_721;
}


}),
"../common/src/utils/noop.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  noop: () => (noop)
});
const noop = ()=>{
// noop for testing puposes
};


}),
"../common/src/utils/normalizeBalance.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  normalizeBalance: () => (normalizeBalance)
});
/* ESM import */var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/@avalabs/core-utils-sdk/esm/bnToBig.js");
/* ESM import */var bn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/bn.js/lib/bn.js");
/* ESM import */var bn_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bn_js__WEBPACK_IMPORTED_MODULE_0__);
/* ESM import */var _bigintToBig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/bigintToBig.ts");



function normalizeBalance(balance, decimals) {
    if ((0,bn_js__WEBPACK_IMPORTED_MODULE_0__.isBN)(balance)) {
        return (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_2__.bnToBig)(balance, decimals);
    }
    if (typeof balance === 'bigint') {
        return (0,_bigintToBig__WEBPACK_IMPORTED_MODULE_1__.bigintToBig)(balance, decimals);
    }
    return balance;
}


}),
"../common/src/utils/number.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  toPrecision: () => (toPrecision)
});
function toPrecision(num, precision = 4) {
    const [leftSide, rightSide] = num.split('.');
    if (!rightSide) {
        return leftSide;
    }
    return `${leftSide}.${rightSide.substring(0, precision)}`;
}


}),
"../common/src/utils/object.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  hasDefined: () => (hasDefined),
  omitUndefined: () => (omitUndefined)
});
const omitUndefined = (obj)=>Object.fromEntries(Object.entries(obj).filter(([, value])=>value !== undefined));
const hasDefined = (obj, key)=>{
    return obj[key] !== undefined;
};


}),
"../common/src/utils/onPageActivated.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  onPageActivated: () => (onPageActivated)
});
/**
 * Pre-rendering causes some issues with the way the extension
 * communicates with dApps. Namely, when the page is first pre-rendered,
 * content scripts are injected before the page is activated
 * by the user. Then when the user finally activates it, the connection
 * gets lost.
 *
 * This util is useful for only running certain actions after the page
 * has been activated by the user. This ensures that the connection
 * remains active.
 *
 * References:
 * https://developer.chrome.com/blog/prerender-pages/
 * https://developer.chrome.com/blog/extension-instantnav/#lifecyle
 */ function onPageActivated(callback) {
    // eslint-disable-next-line
    // @ts-ignore
    if (document.prerendering) {
        document.addEventListener('prerenderingchange', callback, {
            once: true
        });
    } else {
        callback();
    }
}


}),
"../common/src/utils/openFullscreenTab.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  openFullscreenTab: () => (openFullscreenTab)
});
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);

const openFullscreenTab = (url)=>{
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__.tabs.create({
        url: `/fullscreen.html#/${url}`
    });
};


}),
"../common/src/utils/promiseResolver.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  resolve: () => (resolve)
});
function resolve(promise) {
    try {
        return promise.then((res)=>[
                res,
                null
            ]).catch((err)=>[
                null,
                err
            ]);
    } catch (err) {
        return Promise.resolve([
            null,
            err
        ]);
    }
}


}),
"../common/src/utils/seedPhraseValidation.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isPhraseCorrect: () => (isPhraseCorrect),
  wordPhraseLength: () => (wordPhraseLength)
});
/* ESM import */var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/ethers/lib.esm/wallet/mnemonic.js");

const wordPhraseLength = [
    12,
    18,
    24
];
const isPhraseCorrect = (phrase)=>{
    const trimmed = phrase.trim().split(/\s+/g);
    return wordPhraseLength.includes(trimmed.length) && ethers__WEBPACK_IMPORTED_MODULE_0__.Mnemonic.isValidMnemonic(trimmed.join(' ').toLowerCase());
};


}),
"../common/src/utils/seedless/authenticateWithApple.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  authenticateWithApple: () => (authenticateWithApple)
});
/* ESM import */var _launchWebAuthFlow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/seedless/launchWebAuthFlow.ts");

async function authenticateWithApple() {
    const clientId = "org.avalabs.corewallet.extension";
    const redirectUrl = "https://seedless-api.avax-test.network/v1/redirectAppleAuth";
    // This is the base URL that the Core Seedless API should redirect to after receiving the data from Apple.
    const baseUrl = 'https://' + chrome.runtime.id + '.chromiumapp.org';
    if (!clientId || !redirectUrl) {
        throw new Error('Apple OAuth not configured');
    }
    const url = new URL('https://appleid.apple.com/auth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('nonce', crypto.randomUUID());
    url.searchParams.set('response_type', 'code id_token');
    url.searchParams.set('state', baseUrl);
    url.searchParams.set('redirect_uri', redirectUrl);
    url.searchParams.set('scope', 'email');
    // "form_post" response mode is forced since we request user's email in "scope".
    // Reference: https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server#query-parameters
    url.searchParams.set('response_mode', 'form_post');
    return (0,_launchWebAuthFlow__WEBPACK_IMPORTED_MODULE_0__.launchWebAuthFlow)(url);
}


}),
"../common/src/utils/seedless/authenticateWithGoogle.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  authenticateWithGoogle: () => (authenticateWithGoogle)
});
/* ESM import */var _launchWebAuthFlow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/seedless/launchWebAuthFlow.ts");

async function authenticateWithGoogle() {
    const manifest = chrome.runtime.getManifest();
    if (!manifest.oauth2 || !manifest.oauth2.scopes) {
        throw new Error('Oauth not configured');
    }
    const redirectUri = 'https://' + chrome.runtime.id + '.chromiumapp.org';
    const url = new URL('https://accounts.google.com/o/oauth2/auth');
    url.searchParams.set('client_id', manifest.oauth2.client_id);
    url.searchParams.set('response_type', 'id_token');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('scope', manifest.oauth2.scopes.join(' '));
    return (0,_launchWebAuthFlow__WEBPACK_IMPORTED_MODULE_0__.launchWebAuthFlow)(url);
}


}),
"../common/src/utils/seedless/fido/convertRequest.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  convertRequest: () => (convertRequest)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");
/* ESM import */var _encoding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/encoding.ts");
/* provided dependency */ var Buffer = __webpack_require__("../../node_modules/buffer/index.js")["Buffer"];


function convertRequest(endpoint, options) {
    if (endpoint === _core_types__WEBPACK_IMPORTED_MODULE_0__.FIDOApiEndpoint.Authenticate || endpoint === _core_types__WEBPACK_IMPORTED_MODULE_0__.FIDOApiEndpoint.Register) {
        return JSON.stringify(options, convertBuffersToBase64Url);
    }
    throw new Error('Unsupported FIDO identity endpoint');
}
function convertBuffersToBase64Url(key, value) {
    const el = this[key];
    if (el instanceof Buffer) {
        return (0,_encoding__WEBPACK_IMPORTED_MODULE_1__.bufferToBase64Url)(el);
    }
    return value;
}


}),
"../common/src/utils/seedless/fido/convertResult.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  convertResult: () => (convertResult)
});
/* ESM import */var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/lodash/lodash.js");
/* ESM import */var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* ESM import */var _encoding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/encoding.ts");


// Result properties that are known to contain Base64Url-encoded
// values. We need these values to be converted back to Buffers
// to satisfy CubeSigner's SDK.
const KNOWN_BUFFER_PROPERTIES = [
    'rawId',
    'response.clientDataJSON',
    'response.attestationObject',
    'response.authenticatorData',
    'response.signature',
    'response.userHandle'
];
function convertResult(result) {
    const copy = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.cloneDeep)(result);
    KNOWN_BUFFER_PROPERTIES.forEach((path)=>{
        // If object does not contain given property or it is nullish,
        // do nothing with it.
        const currentValue = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.get)(copy, path);
        if (currentValue === undefined || currentValue === null) {
            return;
        }
        // Otherwise, convert it to Buffer
        (0,lodash__WEBPACK_IMPORTED_MODULE_0__.update)(copy, path, _encoding__WEBPACK_IMPORTED_MODULE_1__.base64UrlToBuffer);
    });
    return copy;
}


}),
"../common/src/utils/seedless/fido/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  convertRequest: () => (/* reexport safe */ _convertRequest__WEBPACK_IMPORTED_MODULE_0__.convertRequest),
  convertResult: () => (/* reexport safe */ _convertResult__WEBPACK_IMPORTED_MODULE_1__.convertResult),
  isExportRequestOutdated: () => (/* reexport safe */ _seedless_utils__WEBPACK_IMPORTED_MODULE_4__.isExportRequestOutdated),
  isFailedMfaError: () => (/* reexport safe */ _seedless_utils__WEBPACK_IMPORTED_MODULE_4__.isFailedMfaError),
  isTokenExpiredError: () => (/* reexport safe */ _seedless_utils__WEBPACK_IMPORTED_MODULE_4__.isTokenExpiredError),
  isValidResponse: () => (/* reexport safe */ _validateResponse__WEBPACK_IMPORTED_MODULE_2__.isValidResponse),
  launchFidoFlow: () => (/* reexport safe */ _launchFidoFlow__WEBPACK_IMPORTED_MODULE_3__.launchFidoFlow),
  mapMfasToRecoveryMethods: () => (/* reexport safe */ _seedless_utils__WEBPACK_IMPORTED_MODULE_4__.mapMfasToRecoveryMethods)
});
/* ESM import */var _convertRequest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/seedless/fido/convertRequest.ts");
/* ESM import */var _convertResult__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/seedless/fido/convertResult.ts");
/* ESM import */var _validateResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/seedless/fido/validateResponse.ts");
/* ESM import */var _launchFidoFlow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/src/utils/seedless/fido/launchFidoFlow.ts");
/* ESM import */var _seedless_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/src/utils/seedless/fido/seedless-utils.ts");







}),
"../common/src/utils/seedless/fido/launchFidoFlow.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  launchFidoFlow: () => (launchFidoFlow)
});
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/index.ts");
/* ESM import */var _convertRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/seedless/fido/convertRequest.ts");
/* ESM import */var _convertResult__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../common/src/utils/seedless/fido/convertResult.ts");
/* ESM import */var _validateResponse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../common/src/utils/seedless/fido/validateResponse.ts");
/* ESM import */var _extensionUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../common/src/utils/extensionUtils.ts");






async function launchFidoFlow(endpoint, challenge, keyType) {
    const baseUrl = "https://identity.core.app";
    if (!baseUrl) {
        throw new Error('FIDO Identity Service URL is not configured');
    }
    const url = new URL(baseUrl);
    url.pathname = endpoint;
    url.searchParams.set('responseMode', 'post-message');
    url.searchParams.set('origin', location.origin);
    url.searchParams.set('options', (0,_convertRequest__WEBPACK_IMPORTED_MODULE_2__.convertRequest)(endpoint, challenge));
    if (endpoint === _core_types__WEBPACK_IMPORTED_MODULE_1__.FIDOApiEndpoint.Register) {
        if (!keyType) {
            throw new Error('FIDO key type not defined for registration request');
        }
        url.searchParams.set('keyType', keyType);
    }
    const popup = await (0,_extensionUtils__WEBPACK_IMPORTED_MODULE_5__.openPopup)({
        url: url.toString(),
        setSelfAsOpener: true,
        right: 70
    });
    // Make sure to close the popup if the calling window gets closed
    window.addEventListener('beforeunload', ()=>{
        if (popup?.id) {
            webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__.windows.remove(popup.id).catch(()=>{
            // Do nothing, we can't really do anything about it and
            // the most likely reason of error is that it was already closed.
            });
        }
    });
    return new Promise((resolve, reject)=>{
        // Throw error if popup is closed prematurely
        const closeSubscription = popup.removed.subscribe(()=>{
            reject(new Error('Popup closed'));
        });
        const onResponse = (event)=>{
            if (event.origin !== url.origin) {
                return;
            }
            const response = JSON.parse(event.data);
            if ((0,_validateResponse__WEBPACK_IMPORTED_MODULE_4__.isValidResponse)(endpoint, response)) {
                // Popup can now be closed safely
                closeSubscription.unsubscribe();
                if (popup?.id) {
                    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__.windows.remove(popup.id).then(()=>{
                    // Do nothing, we can't really do anything about it and
                    // the most likely reason of error is that it was already closed.
                    });
                }
                window.removeEventListener('message', onResponse);
                resolve((0,_convertResult__WEBPACK_IMPORTED_MODULE_3__.convertResult)(response));
            }
        };
        window.addEventListener('message', onResponse);
    });
}


}),
"../common/src/utils/seedless/fido/seedless-utils.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isExportRequestOutdated: () => (isExportRequestOutdated),
  isFailedMfaError: () => (isFailedMfaError),
  isTokenExpiredError: () => (isTokenExpiredError),
  mapMfasToRecoveryMethods: () => (mapMfasToRecoveryMethods)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");

const isTokenExpiredError = (err)=>{
    // When CubeSigner's refresh token (or the entire session) expires,
    // we get a 403 Forbidden error on attempted API calls.
    return err instanceof Error && 'status' in err && err.status === 403;
};
const isFailedMfaError = (err)=>{
    // When CubeSigner's refresh token (or the entire session) expires,
    // we get a 403 Forbidden error on attempted API calls.
    return err instanceof Error && 'status' in err && err.status === 403 && err.message.includes('Invalid');
};
const isExportRequestOutdated = (exportRequest)=>exportRequest.exp_epoch <= Date.now() / 1000;
const mapMfasToRecoveryMethods = (method)=>{
    if (method.type === 'fido') {
        return {
            ...method,
            type: _core_types__WEBPACK_IMPORTED_MODULE_0__.MfaRequestType.Fido
        };
    }
    return {
        type: _core_types__WEBPACK_IMPORTED_MODULE_0__.MfaRequestType.Totp
    };
};


}),
"../common/src/utils/seedless/fido/validateResponse.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isValidResponse: () => (isValidResponse)
});
/* ESM import */var joi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/joi/dist/joi-browser.min.js");
/* ESM import */var joi__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(joi__WEBPACK_IMPORTED_MODULE_0__);
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/index.ts");
/* ESM import */var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/index.ts");



const REGISTRATION_RESPONSE_SCHEMA = joi__WEBPACK_IMPORTED_MODULE_0___default().object({
    id: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
    rawId: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
    type: joi__WEBPACK_IMPORTED_MODULE_0___default().string(),
    response: joi__WEBPACK_IMPORTED_MODULE_0___default().object({
        attestationObject: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
        clientDataJSON: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required()
    }).unknown(true)
}).unknown(true);
const AUTHENTICATION_RESPONSE_SCHEMA = joi__WEBPACK_IMPORTED_MODULE_0___default().object({
    id: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
    rawId: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
    type: joi__WEBPACK_IMPORTED_MODULE_0___default().string(),
    response: joi__WEBPACK_IMPORTED_MODULE_0___default().object({
        authenticatorData: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
        clientDataJSON: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
        signature: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
        userHandle: joi__WEBPACK_IMPORTED_MODULE_0___default().string().allow(null)
    }).unknown(true)
}).unknown(true);
const isValidResponse = (endpoint, response)=>{
    // The schemas allow additional properties to be defined,
    // but we care about the ones that are specified in the schema.
    const schema = endpoint === _core_types__WEBPACK_IMPORTED_MODULE_1__.FIDOApiEndpoint.Authenticate ? AUTHENTICATION_RESPONSE_SCHEMA : REGISTRATION_RESPONSE_SCHEMA;
    const { error } = schema.validate(response);
    if (error) {
        const messages = error.details.map(({ message })=>message);
        ___WEBPACK_IMPORTED_MODULE_2__.Monitoring.sentryCaptureException(new Error(`Invalid Identity API response: ${messages.join(' | ')}`), ___WEBPACK_IMPORTED_MODULE_2__.Monitoring.SentryExceptionTypes.SEEDLESS);
        return false;
    }
    return true;
};


}),
"../common/src/utils/seedless/getCubeSigner.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getEnv: () => (getEnv),
  getOidcClient: () => (getOidcClient),
  getOrgId: () => (getOrgId),
  getSignerSession: () => (getSignerSession),
  requestOidcAuth: () => (requestOidcAuth)
});
/* ESM import */var _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@cubist-labs/cubesigner-sdk/dist/esm/src/index.js");

/**
 * Get the CubeSigner deployment environment to use.
 *
 * Defaults to 'gamma' but can be overridden via the 'CUBESIGNER_ENV' environment variable.
 *
 * @return {EnvInterface} CubeSigner deployment environment
 */ function getEnv() {
    return _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.envs["gamma" || 0];
}
/**
 * Get the ID of the CubeSigner organization to use.
 *
 * Must be set via the 'SEEDLESS_ORG_ID' environment variable.
 *
 * @return {string} The ID of the organization in CubeSigner.
 */ function getOrgId() {
    const orgId = "Org#abc03353-9320-4bf4-bc25-d1b687bf2b2c";
    if (!orgId) {
        throw new Error('SEEDLESS_ORG_ID must be set');
    }
    return orgId;
}
/**
 * Create a CubeSigner API client for methods that require OIDC authorization.
 *
 * This client can be used to:
 * - obtain a proof of identity (see {@link OidcClient.identityProve})
 * - obtain a full CubeSigner session (see {@link OidcClient.sessionCreate})
 *
 * @param {string} oidcToken The OIDC token to include in 'Authorization' header.
 * @return {OidcClient} CubeSigner API client for methods that require OIDC authorization.
 */ function getOidcClient(oidcToken) {
    return new _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.OidcClient(getEnv(), getOrgId(), oidcToken);
}
/**
 * Create a CubeSigner API client for methods that require signer session authorization.
 *
 * @param {NewSessionResponse | SignerSessionData} sessionInfo Signer session information
 *  (e.g., obtained via {@link OidcClient.sessionCreate}) from which to construct the client.
 * @return {SignerSession} CubeSigner API client.
 */ async function getSignerSession(sessionInfo) {
    return new _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.SignerSession(await _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.SignerSessionManager.createFromSessionInfo(getEnv(), getOrgId(), sessionInfo));
}
/**
 * Request a new CubeSigner session by logging in via OIDC.
 *
 * The new session can be passed to {@link getSignerSession} to create a CubeSigner API client.
 *
 * @param {string} oidcToken The OIDC token to include in 'Authorization' header.
 * @param {MfaReceipt | undefined} mfaReceipt Optional MFA receipt to attach to this request.
 * @return {CubeSignerResponse<SignerSessionData>} The response. If MFA for this request is
 *   required, {@link CubeSignerResponse.requiresMfa()} is set to true and
 *   {@link CubeSignerResponse.mfaSessionInfo()} contains a temporary session that allows
 *   access to the CubeSigner MFA endpoints; otherwise, {@link CubeSignerResponse.data()}
 *   contains the new session information.
 */ async function requestOidcAuth(oidcToken, mfaReceipt) {
    const oidcClient = getOidcClient(oidcToken);
    return await oidcClient.sessionCreate([
        'sign:*',
        'manage:*',
        'export:*'
    ], {
        // How long singing with a particular token works from the token creation
        auth_lifetime: 5 * 60,
        // How long a refresh token is valid, the user has to unlock Core in this timeframe otherwise they will have to re-login
        // Sessions expire either if the session lifetime expires or if a refresh token expires before a new one is generated
        refresh_lifetime: 90 * 24 * 60 * 60,
        // How long till the user absolutely must sign in again
        session_lifetime: 1 * 365 * 24 * 60 * 60
    }, mfaReceipt);
}


}),
"../common/src/utils/seedless/getOidcTokenProvider.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getOidcTokenProvider: () => (getOidcTokenProvider)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");
/* ESM import */var _authenticateWithGoogle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/seedless/authenticateWithGoogle.ts");
/* ESM import */var _authenticateWithApple__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../common/src/utils/seedless/authenticateWithApple.ts");



const SUPPORTED_PROVIDERS = {
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.SeedlessAuthProvider.Google]: _authenticateWithGoogle__WEBPACK_IMPORTED_MODULE_1__.authenticateWithGoogle,
    [_core_types__WEBPACK_IMPORTED_MODULE_0__.SeedlessAuthProvider.Apple]: _authenticateWithApple__WEBPACK_IMPORTED_MODULE_2__.authenticateWithApple
};
const getOidcTokenProvider = (authProvider)=>{
    if (!authProvider || !SUPPORTED_PROVIDERS[authProvider]) {
        throw new Error(`Unsupported provider: ${authProvider || 'unknown'}`);
    }
    return SUPPORTED_PROVIDERS[authProvider];
};


}),
"../common/src/utils/seedless/getSignerToken.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  getSignerToken: () => (getSignerToken)
});
/* ESM import */var _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@cubist-labs/cubesigner-sdk/dist/esm/src/index.js");

const getSignerToken = async (oidcAuthResponse)=>{
    const sessionInfo = oidcAuthResponse.data();
    const sessionMgr = await _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.SignerSessionManager.createFromSessionInfo(_cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.envs["gamma" || 0], "Org#abc03353-9320-4bf4-bc25-d1b687bf2b2c" || 0, sessionInfo);
    return sessionMgr.storage.retrieve();
};


}),
"../common/src/utils/seedless/launchWebAuthFlow.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  launchWebAuthFlow: () => (launchWebAuthFlow)
});
function launchWebAuthFlow(url) {
    return new Promise((resolve, reject)=>{
        chrome.identity.launchWebAuthFlow({
            url: url.toString(),
            interactive: true
        }, (redirectedTo)=>{
            if (!redirectedTo) {
                reject(new Error('Redirect url is undefined'));
                return;
            }
            if (chrome.runtime.lastError) {
                // Example: Authorization page could not be loaded.
                return reject(chrome.runtime.lastError);
            }
            const parsedUrl = new URL(redirectedTo);
            const params = new URLSearchParams(parsedUrl.hash.slice(1)); // hash contains a query string
            const idToken = params.get('id_token');
            if (!idToken) {
                throw new Error('no id token');
            }
            resolve(idToken);
        });
    });
}


}),
"../common/src/utils/seedless/seedlessEventFilters.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isSeedlessMfaChoiceRequest: () => (isSeedlessMfaChoiceRequest),
  isSeedlessMfaEvent: () => (isSeedlessMfaEvent),
  isSeedlessMfaMethodsUpdatedEvent: () => (isSeedlessMfaMethodsUpdatedEvent),
  isSeedlessTokenEvent: () => (isSeedlessTokenEvent)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");

function isSeedlessTokenEvent(evt) {
    return evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.SeedlessEvents.TokenExpired || evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.SeedlessEvents.TokenRefreshed;
}
function isSeedlessMfaEvent(evt) {
    return evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.SeedlessEvents.MfaRequest || evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.SeedlessEvents.MfaFailure || evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.SeedlessEvents.MfaClear;
}
function isSeedlessMfaMethodsUpdatedEvent(evt) {
    return evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.SeedlessEvents.MfaMethodsUpdated;
}
function isSeedlessMfaChoiceRequest(evt) {
    return evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.SeedlessEvents.MfaChoiceRequest;
}


}),
"../common/src/utils/send/btcSendUtils.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  buildBtcTx: () => (buildBtcTx),
  getBtcInputUtxos: () => (getBtcInputUtxos),
  validateBtcSend: () => (validateBtcSend)
});
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/utils/createTransferTx.js");
/* ESM import */var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/utils/getMaxTransferAmount.js");
/* ESM import */var coinselect_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/coinselect/utils.js");
/* ESM import */var coinselect_utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(coinselect_utils__WEBPACK_IMPORTED_MODULE_0__);
/* ESM import */var _isBtcAddressInNetwork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../common/src/utils/isBtcAddressInNetwork.ts");
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../types/src/index.ts");




const getBtcInputUtxos = async (provider, token, feeRate)=>{
    const utxos = await provider.getScriptsForUtxos(token.utxos ?? []);
    if (typeof feeRate === 'number') {
        // Filter out UTXOs that would not be used with the current fee rate,
        // that is those for which fee to use the UTXO would be higher than its value.
        return utxos.filter((utxo)=>{
            const utxoFee = (0,coinselect_utils__WEBPACK_IMPORTED_MODULE_0__.inputBytes)(utxo) * feeRate;
            return utxoFee < utxo.value;
        });
    }
    return utxos;
};
const buildBtcTx = async (from, provider, { amount, address, token, feeRate })=>{
    const utxos = await getBtcInputUtxos(provider, token);
    return (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__.createTransferTx)(address, from, amount, feeRate, utxos, provider.getNetwork());
};
const validateBtcSend = (from, { address, amount, feeRate }, utxos, isMainnet)=>{
    if (!address) {
        return _core_types__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.ADDRESS_REQUIRED;
    }
    if (!feeRate) {
        return _core_types__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INVALID_NETWORK_FEE;
    }
    if (!(0,_isBtcAddressInNetwork__WEBPACK_IMPORTED_MODULE_1__.isBtcAddressInNetwork)(address, isMainnet)) {
        return _core_types__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INVALID_ADDRESS;
    }
    if (!amount || amount <= 0) {
        return _core_types__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.AMOUNT_REQUIRED;
    }
    const maxTransferAmount = Math.max((0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.getMaxTransferAmount)(utxos, address, from, feeRate), 0);
    if (amount > maxTransferAmount) {
        return _core_types__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INSUFFICIENT_BALANCE;
    }
    return null;
};


}),
"../common/src/utils/shouldUseWalletConnectApproval.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  shouldUseWalletConnectApproval: () => (shouldUseWalletConnectApproval)
});
/* ESM import */var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");


function shouldUseWalletConnectApproval(network, account) {
    // We are not supporting CoreEth as a network
    if (network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.CoreEth) {
        return false;
    }
    if (account.type === _core_types__WEBPACK_IMPORTED_MODULE_0__.AccountType.FIREBLOCKS || account.type === _core_types__WEBPACK_IMPORTED_MODULE_0__.AccountType.WALLET_CONNECT) {
        return network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.BITCOIN ? false : true;
    }
    return false;
}


}),
"../common/src/utils/stringToBigint.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  stringToBigint: () => (stringToBigint)
});
/* ESM import */var big_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/big.js/big.mjs");

function stringToBigint(value, decimals) {
    const big = (0,big_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value.replace(/,/gi, ''));
    const tens = (0,big_js__WEBPACK_IMPORTED_MODULE_0__["default"])(10).pow(decimals);
    const mult = big.times(tens);
    const rawStr = mult.toFixed(0, 0);
    return BigInt(rawStr);
}


}),
"../common/src/utils/stripAddressPrefix.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  stripAddressPrefix: () => (stripAddressPrefix)
});
/**
 * Removes the C-, P- and X- prefix from the provided address.
 */ const stripAddressPrefix = (address)=>address.replace(/^[XPC]-/, '');


}),
"../common/src/utils/sumByProperty.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  sumByProperty: () => (sumByProperty)
});
/* ESM import */var _logging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/utils/logging.ts");

const sumByProperty = (values, key)=>{
    return values.reduce((acc, curr, index)=>{
        const value = curr[key];
        if (typeof value === 'number') {
            return acc + value;
        }
        // Log out instances when provided list contains non-numeric values
        (0,_logging__WEBPACK_IMPORTED_MODULE_0__.formatAndLog)(`sumByProperty(): object at index ${index} was ignored. Property ${String(key)} does not contain a number:`, curr);
        return acc;
    }, 0);
};


}),
"../common/src/utils/truncateAddress.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  truncateAddress: () => (truncateAddress)
});
const truncateAddress = (address, size = 6)=>{
    const firstChunk = address.substring(0, size);
    const lastChunk = address.substr(-(size / 2));
    return `${firstChunk}...${lastChunk}`;
};


}),
"../common/src/utils/typeUtils.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isFulfilled: () => (isFulfilled),
  isNotNullish: () => (isNotNullish)
});
const isFulfilled = (x)=>x.status === 'fulfilled';
const isNotNullish = (x)=>x != null;


}),
"../common/src/utils/updateIfDifferent.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  updateIfDifferent: () => (updateIfDifferent)
});
/* ESM import */var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/lodash/lodash.js");
/* ESM import */var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

/**
 * @param newValue New value being proposed to the state setter
 * @returns A callback to be passed to React's SetState functions.
 * 					It will only update the state if the actual value (not the reference) change.
 * 					Use it to prevent unnecessary re-renders.
 */ function updateIfDifferent(setStateFn, newState) {
    setStateFn((prevState)=>{
        if (newState === prevState) {
            return prevState;
        }
        if ((0,lodash__WEBPACK_IMPORTED_MODULE_0__.isEqual)(prevState, newState)) {
            return prevState;
        }
        return newState;
    });
}


}),
"../common/src/utils/walletConnectEventFilters.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  isSessionPermissionsMismatchEvent: () => (isSessionPermissionsMismatchEvent),
  isUriGeneratedEvent: () => (isUriGeneratedEvent),
  isWalletConnectEvent: () => (isWalletConnectEvent)
});
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/index.ts");

function isUriGeneratedEvent(evt) {
    return evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.WalletConnectEvent.UriGenerated;
}
function isSessionPermissionsMismatchEvent(evt) {
    return evt?.name === _core_types__WEBPACK_IMPORTED_MODULE_0__.WalletConnectEvent.SessionPermissionsMismatch;
}
function isWalletConnectEvent(evt) {
    const wcEvents = Object.values(_core_types__WEBPACK_IMPORTED_MODULE_0__.WalletConnectEvent);
    return wcEvents.includes(evt?.name);
}


}),
"./src/offscreen.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
/* ESM import */var _avalabs_core_gasless_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/@avalabs/core-gasless-sdk/esm/gaslessSdk.js");
/* ESM import */var _core_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../common/src/index.ts");
/* ESM import */var _core_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/index.ts");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* ESM import */var webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_2__);




const connection = webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().runtime.connect({
    name: _core_common__WEBPACK_IMPORTED_MODULE_0__.OFFSCREEN_SCRIPT
});
connection.onMessage.addListener(async (param)=>{
    const params = JSON.parse(param);
    const { value, name } = params;
    if (name !== _core_types__WEBPACK_IMPORTED_MODULE_1__.GaslessEvents.SEND_OFFSCREEN_MESSAGE || value.request !== _core_types__WEBPACK_IMPORTED_MODULE_1__.ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE) {
        throw new Error('Incorrect offscreen message or request name');
    }
    const { token, message } = value;
    const gasStationUrl = "https://core-gas-station.avax-test.network";
    if (!gasStationUrl) {
        throw new Error('GASLESS_SERVICE_URL is missing');
    }
    const sdk = new _avalabs_core_gasless_sdk__WEBPACK_IMPORTED_MODULE_3__.GaslessSdk(gasStationUrl, {
        appCheckToken: token
    });
    const { difficulty, challengeHex } = await sdk.fetchChallenge();
    const { solutionHex } = await sdk.solveChallenge(challengeHex, difficulty);
    connection.postMessage(JSON.stringify({
        params: {
            request: {
                method: _core_types__WEBPACK_IMPORTED_MODULE_1__.ExtensionRequest.GASLESS_SET_HEX_VALUES,
                tabId: -1,
                params: {
                    solutionHex,
                    challengeHex,
                    pipelineIndex: message.pipelineIndex ?? undefined
                }
            }
        }
    }));
});


}),
"../types/src/account.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ACCOUNTS_STORAGE_KEY: () => (ACCOUNTS_STORAGE_KEY),
  AccountType: () => (AccountType),
  AccountsEvents: () => (AccountsEvents),
  GetPrivateKeyErrorTypes: () => (GetPrivateKeyErrorTypes),
  IMPORTED_ACCOUNTS_WALLET_ID: () => (IMPORTED_ACCOUNTS_WALLET_ID),
  IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP: () => (IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP),
  ImportType: () => (ImportType),
  PrivateKeyChain: () => (PrivateKeyChain)
});
var AccountType = /*#__PURE__*/ function(AccountType) {
    AccountType["PRIMARY"] = "primary";
    AccountType["IMPORTED"] = "imported";
    AccountType["WALLET_CONNECT"] = "walletConnect";
    AccountType["FIREBLOCKS"] = "fireblocks";
    return AccountType;
}({});
var ImportType = /*#__PURE__*/ function(ImportType) {
    ImportType["PRIVATE_KEY"] = "privateKey";
    ImportType["WALLET_CONNECT"] = "walletConnect";
    ImportType["FIREBLOCKS"] = "fireblocks";
    return ImportType;
}({});
const IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP = {
    ["privateKey"]: "imported",
    ["walletConnect"]: "walletConnect",
    ["fireblocks"]: "fireblocks"
};
const ACCOUNTS_STORAGE_KEY = 'accounts';
var AccountsEvents = /*#__PURE__*/ function(AccountsEvents) {
    AccountsEvents["ACCOUNTS_UPDATED"] = "accounts-updated";
    AccountsEvents["ACTIVE_ACCOUNT_CHANGED"] = "active-account-changed";
    return AccountsEvents;
}({});
var GetPrivateKeyErrorTypes = /*#__PURE__*/ function(GetPrivateKeyErrorTypes) {
    GetPrivateKeyErrorTypes["Password"] = "password";
    GetPrivateKeyErrorTypes["Type"] = "type";
    GetPrivateKeyErrorTypes["Chain"] = "chain";
    GetPrivateKeyErrorTypes["DerivePath"] = "derivePath";
    GetPrivateKeyErrorTypes["Mnemonic"] = "mnemonic";
    return GetPrivateKeyErrorTypes;
}({});
var PrivateKeyChain = /*#__PURE__*/ function(PrivateKeyChain) {
    PrivateKeyChain["C"] = "C";
    PrivateKeyChain["XP"] = "XP";
    return PrivateKeyChain;
}({});
const IMPORTED_ACCOUNTS_WALLET_ID = '__IMPORTED__';


}),
"../types/src/actions.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ACTIONS_STORAGE_KEY: () => (ACTIONS_STORAGE_KEY),
  ActionCompletedEventType: () => (ActionCompletedEventType),
  ActionStatus: () => (ActionStatus),
  ActionType: () => (ActionType),
  ActionsEvent: () => (ActionsEvent),
  buildActionForRequest: () => (buildActionForRequest),
  isBatchApprovalAction: () => (isBatchApprovalAction)
});
var ActionStatus = /*#__PURE__*/ function(ActionStatus) {
    // user has been shown the UI and we are waiting on approval
    ActionStatus["PENDING"] = "pending";
    // user has approved and we are waiting on the background to confirm
    ActionStatus["SUBMITTING"] = "submitting";
    // tx was submitted and returned successful
    ActionStatus["COMPLETED"] = "completed";
    ActionStatus["ERROR"] = "error";
    ActionStatus["ERROR_USER_CANCELED"] = "error-user-canceled";
    return ActionStatus;
}({});
var ActionType = /*#__PURE__*/ function(ActionType) {
    ActionType["Single"] = "single";
    ActionType["Batch"] = "batch";
    return ActionType;
}({});
const ACTIONS_STORAGE_KEY = 'actions';
var ActionsEvent = /*#__PURE__*/ function(ActionsEvent) {
    ActionsEvent["ACTION_UPDATED"] = "action-updated";
    ActionsEvent["ACTION_COMPLETED"] = "action-completed";
    return ActionsEvent;
}({});
var ActionCompletedEventType = /*#__PURE__*/ function(ActionCompletedEventType) {
    ActionCompletedEventType["COMPLETED"] = "completed";
    ActionCompletedEventType["ERROR"] = "error";
    return ActionCompletedEventType;
}({});
const isBatchApprovalAction = (action)=>action && action.type === "batch";
const buildActionForRequest = (request, params)=>{
    return {
        ...request,
        type: "single",
        scope: params.scope,
        displayData: params.displayData
    };
};


}),
"../types/src/analytics.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ANALYTICS_SESSION_KEY: () => (ANALYTICS_SESSION_KEY),
  ANALYTICS_STORAGE_KEY: () => (ANALYTICS_STORAGE_KEY),
  ANALYTICS_UNENCRYPTED_STORAGE_KEY: () => (ANALYTICS_UNENCRYPTED_STORAGE_KEY),
  AnalyticsEvents: () => (AnalyticsEvents),
  BlockchainId: () => (BlockchainId)
});
var AnalyticsEvents = /*#__PURE__*/ function(AnalyticsEvents) {
    AnalyticsEvents["ANALYTICS_STATE_UPDATED"] = "AnalyticsEvents: ANALYTICS_STATE_UPDATED";
    return AnalyticsEvents;
}({});
const ANALYTICS_STORAGE_KEY = 'ANALYTICS_STORAGE_KEY';
const ANALYTICS_UNENCRYPTED_STORAGE_KEY = 'ANALYTICS_UNENCRYPTED_STORAGE_KEY';
const ANALYTICS_SESSION_KEY = 'ANALYTICS_SESSION_KEY';
//Based on CAIP-2
var BlockchainId = /*#__PURE__*/ function(BlockchainId) {
    BlockchainId["P_CHAIN"] = "avax:11111111111111111111111111111111LpoYY";
    BlockchainId["P_CHAIN_TESTNET"] = "avax:fuji-11111111111111111111111111111111LpoYY";
    BlockchainId["X_CHAIN"] = "avax:2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM";
    BlockchainId["X_CHAIN_TESTNET"] = "avax:2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm";
    return BlockchainId;
}({});


}),
"../types/src/app-check.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Algorithm: () => (Algorithm),
  ChallengeTypes: () => (ChallengeTypes)
});
var Algorithm = /*#__PURE__*/ function(Algorithm) {
    Algorithm["SHA256"] = "SHA256";
    Algorithm["SHA512"] = "SHA512";
    return Algorithm;
}({});
var ChallengeTypes = /*#__PURE__*/ function(ChallengeTypes) {
    ChallengeTypes["BASIC"] = "BASIC";
    ChallengeTypes["REVERSE"] = "REVERSE";
    return ChallengeTypes;
}({});


}),
"../types/src/approvals.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ApprovalEvent: () => (ApprovalEvent)
});
var ApprovalEvent = /*#__PURE__*/ function(ApprovalEvent) {
    ApprovalEvent["ApprovalRequested"] = "approval-requested";
    return ApprovalEvent;
}({});


}),
"../types/src/balance.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  BALANCES_CACHE_KEY: () => (BALANCES_CACHE_KEY),
  BalanceServiceEvents: () => (BalanceServiceEvents),
  GlacierUnhealthyError: () => (GlacierUnhealthyError),
  getUnconfirmedBalanceInCurrency: () => (getUnconfirmedBalanceInCurrency),
  hasUnconfirmedBTCBalance: () => (hasUnconfirmedBTCBalance),
  isAvaxWithUnavailableBalance: () => (isAvaxWithUnavailableBalance)
});
const BALANCES_CACHE_KEY = 'balances-service-cache';
var BalanceServiceEvents = /*#__PURE__*/ function(BalanceServiceEvents) {
    BalanceServiceEvents["UPDATED"] = "BalanceServiceEvents:updated";
    return BalanceServiceEvents;
}({});
class GlacierUnhealthyError extends Error {
    constructor(...args){
        super(...args), this.message = 'Glacier is unhealthy. Try again later.';
    }
}
const hasUnconfirmedBTCBalance = (token)=>Boolean(token && 'unconfirmedBalance' in token);
const isAvaxWithUnavailableBalance = (token)=>Boolean(token && 'balancePerType' in token && token.available && token.available !== token.balance);
const getUnconfirmedBalanceInCurrency = (token)=>{
    if (!token || !hasUnconfirmedBTCBalance(token)) {
        return undefined;
    }
    return token.unconfirmedBalanceInCurrency;
};


}),
"../types/src/bridge.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  BRIDGE_STORAGE_KEY: () => (BRIDGE_STORAGE_KEY),
  BridgeEvents: () => (BridgeEvents),
  DefaultBridgeState: () => (DefaultBridgeState),
  TransferEventType: () => (TransferEventType)
});
var TransferEventType = /*#__PURE__*/ function(TransferEventType) {
    TransferEventType["WRAP_STATUS"] = "wrap_status";
    TransferEventType["TX_HASH"] = "tx_hash";
    return TransferEventType;
}({});
var BridgeEvents = /*#__PURE__*/ function(BridgeEvents) {
    BridgeEvents["BRIDGE_CONFIG_UPDATE_EVENT"] = "BRIDGE_CONFIG_UPDATE_EVENT";
    BridgeEvents["BRIDGE_STATE_UPDATE_EVENT"] = "BRIDGE_STATE_UPDATE_EVENT";
    BridgeEvents["BRIDGE_TRANSFER_EVENT"] = "BRIDGE_TRANSFER_EVENT";
    return BridgeEvents;
}({});
const BRIDGE_STORAGE_KEY = 'bridge';
const DefaultBridgeState = {
    bridgeTransactions: {},
    isDevEnv: false
};


}),
"../types/src/contacts.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  CONTACTS_STORAGE_KEY: () => (CONTACTS_STORAGE_KEY),
  ContactsEvents: () => (ContactsEvents)
});
var ContactsEvents = /*#__PURE__*/ function(ContactsEvents) {
    ContactsEvents["CONTACTS_UPDATED"] = "ContactsEvents: CONTACTS_UPDATED";
    return ContactsEvents;
}({});
const CONTACTS_STORAGE_KEY = 'contacts';


}),
"../types/src/currency.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL: () => (CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL),
  CURRENCY_EXCHANGE_RATES_STORAGE_KEY: () => (CURRENCY_EXCHANGE_RATES_STORAGE_KEY),
  CURRENCY_EXCHANGE_RATES_URL: () => (CURRENCY_EXCHANGE_RATES_URL),
  CurrencyServiceEvents: () => (CurrencyServiceEvents),
  ExchangeRatesSchema: () => (ExchangeRatesSchema)
});
/* ESM import */var joi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/joi/dist/joi-browser.min.js");
/* ESM import */var joi__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(joi__WEBPACK_IMPORTED_MODULE_0__);

const ExchangeRatesSchema = joi__WEBPACK_IMPORTED_MODULE_0___default().object({
    date: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
    usd: joi__WEBPACK_IMPORTED_MODULE_0___default().object().pattern(joi__WEBPACK_IMPORTED_MODULE_0___default().string(), joi__WEBPACK_IMPORTED_MODULE_0___default().number())
});
var CurrencyServiceEvents = /*#__PURE__*/ function(CurrencyServiceEvents) {
    CurrencyServiceEvents["RatesUpdated"] = "CurrencyService::RatesUpdated";
    return CurrencyServiceEvents;
}({});
// We're only loading exchange rates for USD at the moment.
const CURRENCY_EXCHANGE_RATES_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json';
// We refresh data every one hour.
// No need to do it more often, since the above API updates the exchange rates daily.
const CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL = 1000 * 60 * 60;
const CURRENCY_EXCHANGE_RATES_STORAGE_KEY = 'currency-exchange-rates';


}),
"../types/src/dapp-connection.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  DAppProviderRequest: () => (DAppProviderRequest),
  DAppRequestHandler: () => (DAppRequestHandler),
  Web3Event: () => (Web3Event)
});
var DAppProviderRequest = /*#__PURE__*/ function(DAppProviderRequest) {
    DAppProviderRequest["DOMAIN_METADATA_METHOD"] = "avalanche_sendDomainMetadata";
    DAppProviderRequest["CONNECT_METHOD"] = "eth_requestAccounts";
    DAppProviderRequest["INIT_DAPP_STATE"] = "avalanche_getProviderState";
    DAppProviderRequest["ETH_ACCOUNTS"] = "eth_accounts";
    DAppProviderRequest["WALLET_PERMISSIONS"] = "wallet_requestPermissions";
    DAppProviderRequest["WALLET_GET_PERMISSIONS"] = "wallet_getPermissions";
    DAppProviderRequest["WALLET_ADD_CHAIN"] = "wallet_addEthereumChain";
    DAppProviderRequest["WALLET_GET_CHAIN"] = "wallet_getEthereumChain";
    DAppProviderRequest["WALLET_SWITCH_ETHEREUM_CHAIN"] = "wallet_switchEthereumChain";
    DAppProviderRequest["WALLET_WATCH_ASSET"] = "wallet_watchAsset";
    DAppProviderRequest["PERSONAL_EC_RECOVER"] = "personal_ecRecover";
    DAppProviderRequest["PERSONAL_SIGN"] = "personal_sign";
    DAppProviderRequest["ETH_SIGN_TYPED_DATA_V4"] = "eth_signTypedData_v4";
    DAppProviderRequest["ETH_SIGN_TYPED_DATA_V3"] = "eth_signTypedData_v3";
    DAppProviderRequest["ETH_SIGN_TYPED_DATA_V1"] = "eth_signTypedData_v1";
    DAppProviderRequest["ETH_SIGN_TYPED_DATA"] = "eth_signTypedData";
    DAppProviderRequest["ETH_SIGN"] = "eth_sign";
    DAppProviderRequest["AVALANCHE_GET_CONTACTS"] = "avalanche_getContacts";
    DAppProviderRequest["AVALANCHE_CREATE_CONTACT"] = "avalanche_createContact";
    DAppProviderRequest["AVALANCHE_UPDATE_CONTACT"] = "avalanche_updateContact";
    DAppProviderRequest["AVALANCHE_REMOVE_CONTACT"] = "avalanche_removeContact";
    DAppProviderRequest["AVALANCHE_GET_ACCOUNTS"] = "avalanche_getAccounts";
    DAppProviderRequest["AVALANCHE_GET_ADDRESSES_IN_RANGE"] = "avalanche_getAddressesInRange";
    DAppProviderRequest["AVALANCHE_GET_BRIDGE_STATE"] = "avalanche_getBridgeState";
    DAppProviderRequest["AVALANCHE_SELECT_WALLET"] = "avalanche_selectWallet";
    DAppProviderRequest["AVALANCHE_SET_DEVELOPER_MODE"] = "avalanche_setDeveloperMode";
    DAppProviderRequest["ACCOUNT_SELECT"] = "avalanche_selectAccount";
    DAppProviderRequest["ACCOUNT_RENAME"] = "avalanche_renameAccount";
    DAppProviderRequest["ACCOUNTS_DELETE"] = "avalanche_deleteAccounts";
    DAppProviderRequest["AVALANCHE_GET_ACCOUNT_PUB_KEY"] = "avalanche_getAccountPubKey";
    DAppProviderRequest["AVALANCHE_SEND_TRANSACTION"] = "avalanche_sendTransaction";
    DAppProviderRequest["AVALANCHE_SIGN_TRANSACTION"] = "avalanche_signTransaction";
    DAppProviderRequest["AVALANCHE_SIGN_MESSAGE"] = "avalanche_signMessage";
    DAppProviderRequest["BITCOIN_SEND_TRANSACTION"] = "bitcoin_sendTransaction";
    DAppProviderRequest["WALLET_RENAME"] = "avalanche_renameWallet";
    DAppProviderRequest["WALLET_ADD_NETWORK"] = "wallet_addNetwork";
    DAppProviderRequest["WALLET_GET_PUBKEY"] = "wallet_getPublicKey";
    DAppProviderRequest["WALLET_CONNECT"] = "wallet_requestAccountPermission";
    return DAppProviderRequest;
}({});
var Web3Event = /*#__PURE__*/ function(Web3Event) {
    // https://eips.ethereum.org/EIPS/eip-1193#connect-1
    // not emitted as a separate event from the background, the inpage provider handles it
    // based on the `avalanche_getProviderState` and the `chainChanged` event
    Web3Event["CONNECT"] = "connect";
    // https://eips.ethereum.org/EIPS/eip-1193#disconnect-1
    Web3Event["DISCONNECT"] = "disconnect";
    // https://eips.ethereum.org/EIPS/eip-1193#accountschanged-1
    Web3Event["ACCOUNTS_CHANGED"] = "accountsChanged";
    Web3Event["ACCOUNTS_CHANGED_CA"] = "accountsChangedCA";
    // https://eips.ethereum.org/EIPS/eip-1193#chainchanged-1
    Web3Event["CHAIN_CHANGED"] = "chainChanged";
    return Web3Event;
}({});
class DAppRequestHandler {
}


}),
"../types/src/debank.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  DebankProtocolDetailTypes: () => (DebankProtocolDetailTypes)
});
// The API reference:
// https://docs.open.debank.com/en/reference/api-models/portfolioitemobject
var DebankProtocolDetailTypes = /*#__PURE__*/ function(DebankProtocolDetailTypes) {
    DebankProtocolDetailTypes["COMMON"] = "common";
    DebankProtocolDetailTypes["LOCKED"] = "locked";
    DebankProtocolDetailTypes["LENDING"] = "lending";
    DebankProtocolDetailTypes["LEVERAGED_FARMING"] = "leveraged_farming";
    DebankProtocolDetailTypes["VESTING"] = "vesting";
    DebankProtocolDetailTypes["REWARD"] = "reward";
    DebankProtocolDetailTypes["OPTIONS_SELLER"] = "options_seller";
    DebankProtocolDetailTypes["OPTIONS_BUYER"] = "options_buyer";
    DebankProtocolDetailTypes["PERPETUALS"] = "perpetuals";
    DebankProtocolDetailTypes["INSURANCE_SELLER"] = "insurance_seller";
    DebankProtocolDetailTypes["INSURANCE_BUYER"] = "insurance_buyer";
    return DebankProtocolDetailTypes;
}({});


}),
"../types/src/defi.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  DefiItemType: () => (DefiItemType),
  DefiServiceEvents: () => (DefiServiceEvents)
});
var DefiItemType = /*#__PURE__*/ function(DefiItemType) {
    DefiItemType["Common"] = "common";
    DefiItemType["Locked"] = "locked";
    DefiItemType["Lending"] = "lending";
    DefiItemType["Vesting"] = "vesting";
    DefiItemType["Reward"] = "reward";
    DefiItemType["InsuranceBuyer"] = "insurance_buyer";
    DefiItemType["Perpetual"] = "perpetual";
    return DefiItemType;
}({});
var DefiServiceEvents = /*#__PURE__*/ function(DefiServiceEvents) {
    DefiServiceEvents["PortfolioUpdated"] = "DefiService::PortfolioUpdated";
    return DefiServiceEvents;
}({});


}),
"../types/src/domain-metadata.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);



}),
"../types/src/error.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AccountError: () => (AccountError),
  CommonError: () => (CommonError),
  FireblocksErrorCode: () => (FireblocksErrorCode),
  KeystoreError: () => (KeystoreError),
  LedgerError: () => (LedgerError),
  RpcErrorCode: () => (RpcErrorCode),
  SecretsError: () => (SecretsError),
  SeedlessError: () => (SeedlessError),
  SeedphraseImportError: () => (SeedphraseImportError),
  SwapErrorCode: () => (SwapErrorCode),
  UnifiedBridgeError: () => (UnifiedBridgeError),
  VMModuleError: () => (VMModuleError)
});
var KeystoreError = /*#__PURE__*/ function(KeystoreError) {
    KeystoreError["InvalidPassword"] = "keystore-invalid-password";
    KeystoreError["InvalidVersion"] = "keystore-invalid-version";
    KeystoreError["NoNewWallets"] = "keystore-no-new-wallets";
    KeystoreError["Unknown"] = "keystore-unknown-error";
    return KeystoreError;
}({});
var SwapErrorCode = /*#__PURE__*/ function(SwapErrorCode) {
    SwapErrorCode["ClientNotInitialized"] = "client-not-initialized";
    SwapErrorCode["MissingParams"] = "missing-params";
    SwapErrorCode["CannotFetchAllowance"] = "cannot-fetch-allowance";
    SwapErrorCode["MissingContractMethod"] = "missing-contract-method";
    SwapErrorCode["ApiError"] = "api-error";
    SwapErrorCode["UnknownSpender"] = "unknown-spender";
    SwapErrorCode["UnexpectedApiResponse"] = "unexpected-api-response";
    SwapErrorCode["CannotBuildTx"] = "cannot-build-tx";
    SwapErrorCode["InvalidParams"] = "invalid-params";
    SwapErrorCode["FeatureDisabled"] = "feature-disabled";
    SwapErrorCode["TransactionError"] = "transaction-error";
    return SwapErrorCode;
}({});
var VMModuleError = /*#__PURE__*/ function(VMModuleError) {
    VMModuleError["UnsupportedChain"] = "unsupported-chain";
    VMModuleError["UnsupportedMethod"] = "unsupported-method";
    VMModuleError["UnsupportedNamespace"] = "unsupported-namespace";
    VMModuleError["ModulesNotInitialized"] = "modules-not-initialized";
    return VMModuleError;
}({});
var SeedphraseImportError = /*#__PURE__*/ function(SeedphraseImportError) {
    SeedphraseImportError["ExistingSeedphrase"] = "existing-seedphrase";
    return SeedphraseImportError;
}({});
var UnifiedBridgeError = /*#__PURE__*/ function(UnifiedBridgeError) {
    UnifiedBridgeError["UnknownAsset"] = "unknown-asset";
    UnifiedBridgeError["AmountLessThanFee"] = "amount-less-than-fee";
    UnifiedBridgeError["InvalidFee"] = "invalid-fee";
    UnifiedBridgeError["UnsupportedNetwork"] = "unsupported-network";
    UnifiedBridgeError["InvalidTxPayload"] = "invalid-tx-payload";
    UnifiedBridgeError["NonBitcoinAccount"] = "non-bitcoin-account";
    return UnifiedBridgeError;
}({});
var SeedlessError = /*#__PURE__*/ function(SeedlessError) {
    SeedlessError["NoMfaMethodAvailable"] = "no-mfa-method-available";
    return SeedlessError;
}({});
var FireblocksErrorCode = /*#__PURE__*/ function(FireblocksErrorCode) {
    FireblocksErrorCode["Failed"] = "fireblocks-tx-failed";
    FireblocksErrorCode["Blocked"] = "fireblocks-tx-blocked";
    FireblocksErrorCode["Cancelled"] = "fireblocks-tx-cancelled";
    FireblocksErrorCode["Rejected"] = "fireblocks-tx-rejected";
    FireblocksErrorCode["Timeout"] = "fireblocks-tx-timeout";
    FireblocksErrorCode["Unknown"] = "fireblocks-tx-unknown-error";
    return FireblocksErrorCode;
}({});
var CommonError = /*#__PURE__*/ function(CommonError) {
    CommonError["Unknown"] = "unknown";
    CommonError["UserRejected"] = "user-rejected";
    CommonError["NetworkError"] = "network-error";
    CommonError["NoActiveAccount"] = "no-active-account";
    CommonError["NoActiveNetwork"] = "no-active-network";
    CommonError["UnknownNetwork"] = "unknown-network";
    CommonError["UnknownNetworkFee"] = "unknown-network-fee";
    CommonError["RequestTimeout"] = "request-timeout";
    CommonError["MigrationFailed"] = "migration-failed";
    CommonError["ModuleManagerNotSet"] = "module-manager-not-set";
    CommonError["UnableToSign"] = "unable-to-sign";
    CommonError["UnableToEstimateGas"] = "unable-to-estimate-gas";
    CommonError["UnsupportedTokenType"] = "unsupported-token-type";
    CommonError["MismatchingProvider"] = "mismatching-provider";
    return CommonError;
}({});
var LedgerError = /*#__PURE__*/ function(LedgerError) {
    LedgerError["TransportNotFound"] = "ledger-transport-not-found";
    LedgerError["NoPublicKeyReturned"] = "ledger-no-public-key-returned";
    return LedgerError;
}({});
var SecretsError = /*#__PURE__*/ function(SecretsError) {
    SecretsError["SecretsNotFound"] = "secrets-not-found";
    SecretsError["UnsupportedSecretType"] = "unsupported-secret-type";
    SecretsError["MissingExtendedPublicKey"] = "missing-ext-pubkey";
    SecretsError["WalletAlreadyExists"] = "wallet-already-exists";
    SecretsError["PublicKeyNotFound"] = "public-key-not-found";
    SecretsError["NoAccountIndex"] = "no-account-index";
    SecretsError["DerivationPathMissing"] = "derivation-path-missing";
    SecretsError["UnknownDerivationPathFormat"] = "unknown-derivation-path-format";
    SecretsError["DerivationPathTooShort"] = "derivation-path-too-short";
    SecretsError["UnsupportedCurve"] = "unsupported-curve";
    return SecretsError;
}({});
var AccountError = /*#__PURE__*/ function(AccountError) {
    AccountError["EVMAddressNotFound"] = "evm-address-not-found";
    AccountError["BTCAddressNotFound"] = "btc-address-not-found";
    AccountError["SVMAddressNotFound"] = "svm-address-not-found";
    AccountError["NoAddressesFound"] = "no-addresses-found";
    return AccountError;
}({});
var RpcErrorCode = /*#__PURE__*/ function(RpcErrorCode) {
    RpcErrorCode["InsufficientFunds"] = "INSUFFICIENT_FUNDS";
    return RpcErrorCode;
}({});


}),
"../types/src/feature-flags.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  FeatureFlagEvents: () => (FeatureFlagEvents),
  FeatureGates: () => (FeatureGates)
});
var FeatureGates = /*#__PURE__*/ function(FeatureGates) {
    FeatureGates["EVERYTHING"] = "everything";
    FeatureGates["EVENTS"] = "events";
    FeatureGates["SWAP"] = "swap-feature";
    FeatureGates["SWAP_C_CHAIN"] = "swap-c-chain";
    FeatureGates["SWAP_ETHEREUM"] = "swap-ethereum";
    FeatureGates["SWAP_SOLANA"] = "swap-solana";
    FeatureGates["SWAP_FEES"] = "swap-fees";
    FeatureGates["SWAP_FEES_JUPITER"] = "swap-fees-jupiter";
    FeatureGates["BRIDGE"] = "bridge-feature";
    FeatureGates["BRIDGE_ETH"] = "bridge-feature-eth";
    FeatureGates["BRIDGE_BTC"] = "bridge-feature-btc";
    FeatureGates["SEND"] = "send-feature";
    FeatureGates["SEND_P_CHAIN"] = "send-p-chain";
    FeatureGates["SEND_X_CHAIN"] = "send-x-chain";
    FeatureGates["SENDTRANSACTION_CHAIN_ID_SUPPORT"] = "sendtransaction-chain-id-support-feature";
    FeatureGates["BUY"] = "buy";
    FeatureGates["BUY_MOONPAY"] = "buy-feature-moonpay";
    FeatureGates["BUY_COINBASE"] = "buy-feature-coinbase";
    FeatureGates["KEYSTONE"] = "keystone";
    FeatureGates["NFT_MARKETPLACE"] = "nft-marketplace";
    FeatureGates["BOTTOM_NAVIGATION"] = "bottom-navigation";
    FeatureGates["DEFI"] = "defi-feature";
    FeatureGates["IMPORT_WALLET_CONNECT"] = "import-wallet-connect";
    FeatureGates["IMPORT_FIREBLOCKS"] = "import-fireblocks";
    FeatureGates["IN_APP_SUPPORT_P_CHAIN"] = "in-app-support-p-chain";
    FeatureGates["IN_APP_SUPPORT_X_CHAIN"] = "in-app-support-x-chain";
    FeatureGates["SEEDLESS_ONBOARDING"] = "seedless-onboarding";
    FeatureGates["SEEDLESS_ONBOARDING_GOOGLE"] = "seedless-onboarding-google";
    FeatureGates["SEEDLESS_ONBOARDING_APPLE"] = "seedless-onboarding-apple";
    FeatureGates["SEEDLESS_MFA_PASSKEY"] = "seedless-mfa-passkey";
    FeatureGates["SEEDLESS_MFA_AUTHENTICATOR"] = "seedless-mfa-authenticator";
    FeatureGates["SEEDLESS_MFA_YUBIKEY"] = "seedless-mfa-yubikey";
    FeatureGates["SEEDLESS_SIGNING"] = "seedless-signing";
    FeatureGates["SEEEDLESS_MFA_SETTINGS"] = "seedless-mfa-settings";
    FeatureGates["SEEDLESS_OPTIONAL_MFA"] = "seedless-optional-mfa";
    FeatureGates["UNIFIED_BRIDGE_CCTP"] = "unified-bridge-cctp";
    FeatureGates["UNIFIED_BRIDGE_ICTT"] = "unified-bridge-ictt";
    FeatureGates["UNIFIED_BRIDGE_AB_EVM"] = "unified-bridge-ab-evm";
    FeatureGates["UNIFIED_BRIDGE_AB_AVA_TO_BTC"] = "unified-bridge-ab-ava-to-btc";
    FeatureGates["UNIFIED_BRIDGE_AB_BTC_TO_AVA"] = "unified-bridge-ab-btc-to-ava";
    FeatureGates["DEBANK_TRANSACTION_PARSING"] = "debank-transaction-parsing";
    FeatureGates["DEBANK_TRANSACTION_PRE_EXECUTION"] = "debank-transaction-pre-execution";
    FeatureGates["PRIMARY_ACCOUNT_REMOVAL"] = "primary-account-removal";
    FeatureGates["ADD_WALLET_WITH_SEEDPHRASE"] = "add-wallet-with-seedphrase";
    FeatureGates["ADD_WALLET_WITH_KEYSTORE_FILE"] = "add-wallet-with-keystore-file";
    FeatureGates["ADD_WALLET_WITH_LEDGER"] = "add-wallet-with-ledger";
    FeatureGates["BLOCKAID_DAPP_SCAN"] = "blockaid-dapp-scan";
    FeatureGates["BLOCKAID_DAPP_SCAN_WARNING"] = "blockaid-dapp-scan-warning";
    FeatureGates["BLOCKAID_TRANSACTION_SCAN"] = "blockaid-transaction-scan";
    FeatureGates["BLOCKAID_JSONRPC_SCAN"] = "blockaid-jsonrpc-scan";
    FeatureGates["HALLIDAY_BRIDGE_BANNER"] = "halliday-bridge-banner";
    FeatureGates["FIREBASE_CLOUD_MESSAGING"] = "firebase-cloud-messaging";
    FeatureGates["ONE_CLICK_SWAP"] = "one-click-swap";
    FeatureGates["GASLESS"] = "gasless";
    FeatureGates["SOLANA_SUPPORT"] = "solana-support";
    FeatureGates["CORE_ASSISTANT"] = "core-assistant";
    return FeatureGates;
}({});
var FeatureFlagEvents = /*#__PURE__*/ function(FeatureFlagEvents) {
    FeatureFlagEvents["FEATURE_FLAG_UPDATED"] = "FeatureFlagEvents: FEATURE_FLAG_UPDATED";
    return FeatureFlagEvents;
}({});


}),
"../types/src/firebase.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  FirebaseEvents: () => (FirebaseEvents)
});
var FirebaseEvents = /*#__PURE__*/ function(FirebaseEvents) {
    FirebaseEvents["FCM_INITIALIZED"] = "FCM_INITIALIZED";
    FirebaseEvents["FCM_TERMINATED"] = "FCM_TERMINATED";
    return FirebaseEvents;
}({});


}),
"../types/src/fireblocks.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  BTC_ACCESS_ERROR_PREFIX: () => (BTC_ACCESS_ERROR_PREFIX),
  FIREBLOCKS_REQUEST_EXPIRY: () => (FIREBLOCKS_REQUEST_EXPIRY),
  FireblocksBtcAccessError: () => (FireblocksBtcAccessError),
  FireblocksBtcAccessErrorCode: () => (FireblocksBtcAccessErrorCode),
  MAINNET_LOOKUP_ASSETS: () => (MAINNET_LOOKUP_ASSETS),
  TESTNET_LOOKUP_ASSETS: () => (TESTNET_LOOKUP_ASSETS),
  TRANSACTION_POLLING_INTERVAL_MS: () => (TRANSACTION_POLLING_INTERVAL_MS),
  TX_SUBMISSION_FAILURE_STATUSES: () => (TX_SUBMISSION_FAILURE_STATUSES)
});
/* ESM import */var fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/fireblocks-sdk/dist/src/fireblocks-sdk.js");
/* ESM import */var fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__);

const TRANSACTION_POLLING_INTERVAL_MS = 2000;
const TX_SUBMISSION_FAILURE_STATUSES = [
    fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.BLOCKED,
    fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.CANCELLED,
    fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.CANCELLING,
    fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.TIMEOUT,
    fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.FAILED,
    fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.REJECTED
];
const BTC_ACCESS_ERROR_PREFIX = `FireblocksBtcAccessError:`;
var FireblocksBtcAccessErrorCode = /*#__PURE__*/ function(FireblocksBtcAccessErrorCode) {
    FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["VaultAccountNotFound"] = 0] = "VaultAccountNotFound";
    FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["BTCAddressNotFound"] = 1] = "BTCAddressNotFound";
    FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["InvalidSecretKey"] = 2] = "InvalidSecretKey";
    FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["WrongAccountType"] = 3] = "WrongAccountType";
    FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["SecretsNotConfigured"] = 4] = "SecretsNotConfigured";
    return FireblocksBtcAccessErrorCode;
}({});
class FireblocksBtcAccessError extends Error {
    constructor(code){
        super(`${BTC_ACCESS_ERROR_PREFIX}${code}`), this.code = code;
    }
}
// On Testnet Fireblocks workspaces, we require the connected vault to have one of those wallets created.
const TESTNET_LOOKUP_ASSETS = [
    'AVAXTEST',
    'ETH_TEST3',
    'ETH_TEST4',
    'ETH_TEST5'
];
// On Mainnet Fireblocks workspaces, we require the connected vault to have one of those wallets created.
// We need such a wallet to be created, so that we can find the vault account used to connect via WalletConnect.
// Knowing the vault account allows us to find the matching BTC address.
const MAINNET_LOOKUP_ASSETS = [
    'AVAX'
];
const FIREBLOCKS_REQUEST_EXPIRY = 120 * 60; // 2 hours, used only by WalletConnect connections


}),
"../types/src/gasless.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  GaslessEvents: () => (GaslessEvents),
  GaslessPhase: () => (GaslessPhase)
});
var GaslessEvents = /*#__PURE__*/ function(GaslessEvents) {
    GaslessEvents["SEND_OFFSCREEN_MESSAGE"] = "Gasless: SEND_OFFSCREEN_MESSAGE";
    GaslessEvents["STATE_UPDATE"] = "Gasless: STATE_UPDATE";
    return GaslessEvents;
}({});
var GaslessPhase = /*#__PURE__*/ function(GaslessPhase) {
    GaslessPhase["NOT_READY"] = "not_ready";
    GaslessPhase["NOT_ELIGIBLE"] = "not_eligible";
    GaslessPhase["READY"] = "ready";
    GaslessPhase["FUNDING_IN_PROGRESS"] = "funding_in_progress";
    GaslessPhase["FUNDED"] = "funded";
    GaslessPhase["ERROR"] = "error";
    return GaslessPhase;
}({});


}),
"../types/src/history.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);



}),
"../types/src/index.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ACCOUNTS_STORAGE_KEY: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_0__.ACCOUNTS_STORAGE_KEY),
  ACTIONS_STORAGE_KEY: () => (/* reexport safe */ _actions__WEBPACK_IMPORTED_MODULE_1__.ACTIONS_STORAGE_KEY),
  ACTION_HANDLED_BY_MODULE: () => (/* reexport safe */ _util_types__WEBPACK_IMPORTED_MODULE_38__.ACTION_HANDLED_BY_MODULE),
  ANALYTICS_SESSION_KEY: () => (/* reexport safe */ _analytics__WEBPACK_IMPORTED_MODULE_2__.ANALYTICS_SESSION_KEY),
  ANALYTICS_STORAGE_KEY: () => (/* reexport safe */ _analytics__WEBPACK_IMPORTED_MODULE_2__.ANALYTICS_STORAGE_KEY),
  ANALYTICS_UNENCRYPTED_STORAGE_KEY: () => (/* reexport safe */ _analytics__WEBPACK_IMPORTED_MODULE_2__.ANALYTICS_UNENCRYPTED_STORAGE_KEY),
  AVALANCHE_BASE_DERIVATION_PATH: () => (/* reexport safe */ _secrets__WEBPACK_IMPORTED_MODULE_29__.AVALANCHE_BASE_DERIVATION_PATH),
  AccountError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.AccountError),
  AccountType: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_0__.AccountType),
  AccountsEvents: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_0__.AccountsEvents),
  ActionCompletedEventType: () => (/* reexport safe */ _actions__WEBPACK_IMPORTED_MODULE_1__.ActionCompletedEventType),
  ActionStatus: () => (/* reexport safe */ _actions__WEBPACK_IMPORTED_MODULE_1__.ActionStatus),
  ActionType: () => (/* reexport safe */ _actions__WEBPACK_IMPORTED_MODULE_1__.ActionType),
  ActionsEvent: () => (/* reexport safe */ _actions__WEBPACK_IMPORTED_MODULE_1__.ActionsEvent),
  AlarmsEvents: () => (/* reexport safe */ _lock__WEBPACK_IMPORTED_MODULE_22__.AlarmsEvents),
  Algorithm: () => (/* reexport safe */ _app_check__WEBPACK_IMPORTED_MODULE_3__.Algorithm),
  AnalyticsConsent: () => (/* reexport safe */ _settings__WEBPACK_IMPORTED_MODULE_32__.AnalyticsConsent),
  AnalyticsEvents: () => (/* reexport safe */ _analytics__WEBPACK_IMPORTED_MODULE_2__.AnalyticsEvents),
  ApprovalEvent: () => (/* reexport safe */ _approvals__WEBPACK_IMPORTED_MODULE_4__.ApprovalEvent),
  AuthErrorCode: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.AuthErrorCode),
  AvalancheChainStrings: () => (/* reexport safe */ _transaction__WEBPACK_IMPORTED_MODULE_42__.AvalancheChainStrings),
  BALANCES_CACHE_KEY: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_5__.BALANCES_CACHE_KEY),
  BRIDGE_STORAGE_KEY: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_6__.BRIDGE_STORAGE_KEY),
  BTC_ACCESS_ERROR_PREFIX: () => (/* reexport safe */ _fireblocks__WEBPACK_IMPORTED_MODULE_16__.BTC_ACCESS_ERROR_PREFIX),
  BalanceNotificationTypes: () => (/* reexport safe */ _notifications__WEBPACK_IMPORTED_MODULE_43__.BalanceNotificationTypes),
  BalanceServiceEvents: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_5__.BalanceServiceEvents),
  BlockchainId: () => (/* reexport safe */ _analytics__WEBPACK_IMPORTED_MODULE_2__.BlockchainId),
  BridgeEvents: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_6__.BridgeEvents),
  CONTACTS_STORAGE_KEY: () => (/* reexport safe */ _contacts__WEBPACK_IMPORTED_MODULE_7__.CONTACTS_STORAGE_KEY),
  CORE_DOMAINS: () => (/* reexport safe */ _ui_connection__WEBPACK_IMPORTED_MODULE_35__.CORE_DOMAINS),
  CORE_MOBILE_WALLET_ID: () => (/* reexport safe */ _wallet_connect__WEBPACK_IMPORTED_MODULE_39__.CORE_MOBILE_WALLET_ID),
  CURRENCIES: () => (/* reexport safe */ _settings__WEBPACK_IMPORTED_MODULE_32__.CURRENCIES),
  CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL: () => (/* reexport safe */ _currency__WEBPACK_IMPORTED_MODULE_8__.CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL),
  CURRENCY_EXCHANGE_RATES_STORAGE_KEY: () => (/* reexport safe */ _currency__WEBPACK_IMPORTED_MODULE_8__.CURRENCY_EXCHANGE_RATES_STORAGE_KEY),
  CURRENCY_EXCHANGE_RATES_URL: () => (/* reexport safe */ _currency__WEBPACK_IMPORTED_MODULE_8__.CURRENCY_EXCHANGE_RATES_URL),
  ChallengeTypes: () => (/* reexport safe */ _app_check__WEBPACK_IMPORTED_MODULE_3__.ChallengeTypes),
  CommonError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.CommonError),
  ContactsEvents: () => (/* reexport safe */ _contacts__WEBPACK_IMPORTED_MODULE_7__.ContactsEvents),
  ContextContainer: () => (/* reexport safe */ _ui__WEBPACK_IMPORTED_MODULE_36__.ContextContainer),
  CoreApiError: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.CoreApiError),
  CurrencyServiceEvents: () => (/* reexport safe */ _currency__WEBPACK_IMPORTED_MODULE_8__.CurrencyServiceEvents),
  DAppProviderRequest: () => (/* reexport safe */ _dapp_connection__WEBPACK_IMPORTED_MODULE_9__.DAppProviderRequest),
  DAppRequestHandler: () => (/* reexport safe */ _dapp_connection__WEBPACK_IMPORTED_MODULE_9__.DAppRequestHandler),
  DEFERRED_RESPONSE: () => (/* reexport safe */ _util_types__WEBPACK_IMPORTED_MODULE_38__.DEFERRED_RESPONSE),
  DebankProtocolDetailTypes: () => (/* reexport safe */ _debank__WEBPACK_IMPORTED_MODULE_10__.DebankProtocolDetailTypes),
  DefaultBridgeState: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_6__.DefaultBridgeState),
  DefiItemType: () => (/* reexport safe */ _defi__WEBPACK_IMPORTED_MODULE_11__.DefiItemType),
  DefiServiceEvents: () => (/* reexport safe */ _defi__WEBPACK_IMPORTED_MODULE_11__.DefiServiceEvents),
  EVM_BASE_DERIVATION_PATH: () => (/* reexport safe */ _secrets__WEBPACK_IMPORTED_MODULE_29__.EVM_BASE_DERIVATION_PATH),
  ExchangeRatesSchema: () => (/* reexport safe */ _currency__WEBPACK_IMPORTED_MODULE_8__.ExchangeRatesSchema),
  ExtensionRequest: () => (/* reexport safe */ _ui_connection__WEBPACK_IMPORTED_MODULE_35__.ExtensionRequest),
  FIDOApiEndpoint: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.FIDOApiEndpoint),
  FIDOSteps: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.FIDOSteps),
  FIREBLOCKS_APP_NAME: () => (/* reexport safe */ _wallet_connect__WEBPACK_IMPORTED_MODULE_39__.FIREBLOCKS_APP_NAME),
  FIREBLOCKS_REQUEST_EXPIRY: () => (/* reexport safe */ _fireblocks__WEBPACK_IMPORTED_MODULE_16__.FIREBLOCKS_REQUEST_EXPIRY),
  FeatureFlagEvents: () => (/* reexport safe */ _feature_flags__WEBPACK_IMPORTED_MODULE_14__.FeatureFlagEvents),
  FeatureGates: () => (/* reexport safe */ _feature_flags__WEBPACK_IMPORTED_MODULE_14__.FeatureGates),
  FidoDeviceType: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.FidoDeviceType),
  FirebaseEvents: () => (/* reexport safe */ _firebase__WEBPACK_IMPORTED_MODULE_15__.FirebaseEvents),
  FireblocksBtcAccessError: () => (/* reexport safe */ _fireblocks__WEBPACK_IMPORTED_MODULE_16__.FireblocksBtcAccessError),
  FireblocksBtcAccessErrorCode: () => (/* reexport safe */ _fireblocks__WEBPACK_IMPORTED_MODULE_16__.FireblocksBtcAccessErrorCode),
  FireblocksErrorCode: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.FireblocksErrorCode),
  GaslessEvents: () => (/* reexport safe */ _gasless__WEBPACK_IMPORTED_MODULE_17__.GaslessEvents),
  GaslessPhase: () => (/* reexport safe */ _gasless__WEBPACK_IMPORTED_MODULE_17__.GaslessPhase),
  GetPrivateKeyErrorTypes: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_0__.GetPrivateKeyErrorTypes),
  GlacierUnhealthyError: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_5__.GlacierUnhealthyError),
  IMPORTED_ACCOUNTS_WALLET_ID: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_0__.IMPORTED_ACCOUNTS_WALLET_ID),
  IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_0__.IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP),
  ImportType: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_0__.ImportType),
  KeyDerivationVersion: () => (/* reexport safe */ _storage__WEBPACK_IMPORTED_MODULE_33__.KeyDerivationVersion),
  KeyType: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.KeyType),
  KeystoneEvent: () => (/* reexport safe */ _keystone__WEBPACK_IMPORTED_MODULE_19__.KeystoneEvent),
  KeystoreError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.KeystoreError),
  LEDGER_TX_SIZE_LIMIT_BYTES: () => (/* reexport safe */ _ledger__WEBPACK_IMPORTED_MODULE_21__.LEDGER_TX_SIZE_LIMIT_BYTES),
  LEDGER_VERSION_WARNING_WAS_CLOSED: () => (/* reexport safe */ _ledger__WEBPACK_IMPORTED_MODULE_21__.LEDGER_VERSION_WARNING_WAS_CLOSED),
  LOCK_TIMEOUT: () => (/* reexport safe */ _lock__WEBPACK_IMPORTED_MODULE_22__.LOCK_TIMEOUT),
  LanguageLinks: () => (/* reexport safe */ _settings__WEBPACK_IMPORTED_MODULE_32__.LanguageLinks),
  Languages: () => (/* reexport safe */ _settings__WEBPACK_IMPORTED_MODULE_32__.Languages),
  LedgerError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.LedgerError),
  LedgerEvent: () => (/* reexport safe */ _ledger__WEBPACK_IMPORTED_MODULE_21__.LedgerEvent),
  LockEvents: () => (/* reexport safe */ _lock__WEBPACK_IMPORTED_MODULE_22__.LockEvents),
  MAINNET_LOOKUP_ASSETS: () => (/* reexport safe */ _fireblocks__WEBPACK_IMPORTED_MODULE_16__.MAINNET_LOOKUP_ASSETS),
  MessageType: () => (/* reexport safe */ _messages__WEBPACK_IMPORTED_MODULE_23__.MessageType),
  MfaRequestType: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.MfaRequestType),
  NAVIGATION_HISTORY_STORAGE_KEY: () => (/* reexport safe */ _navigation_history__WEBPACK_IMPORTED_MODULE_24__.NAVIGATION_HISTORY_STORAGE_KEY),
  NETWORK_LIST_STORAGE_KEY: () => (/* reexport safe */ _network__WEBPACK_IMPORTED_MODULE_26__.NETWORK_LIST_STORAGE_KEY),
  NETWORK_OVERRIDES_STORAGE_KEY: () => (/* reexport safe */ _network__WEBPACK_IMPORTED_MODULE_26__.NETWORK_OVERRIDES_STORAGE_KEY),
  NETWORK_STORAGE_KEY: () => (/* reexport safe */ _network__WEBPACK_IMPORTED_MODULE_26__.NETWORK_STORAGE_KEY),
  NetworkEvents: () => (/* reexport safe */ _network__WEBPACK_IMPORTED_MODULE_26__.NetworkEvents),
  NewsNotificationTypes: () => (/* reexport safe */ _notifications__WEBPACK_IMPORTED_MODULE_43__.NewsNotificationTypes),
  NotificationCategories: () => (/* reexport safe */ _notifications__WEBPACK_IMPORTED_MODULE_43__.NotificationCategories),
  NotificationsEvents: () => (/* reexport safe */ _notifications__WEBPACK_IMPORTED_MODULE_43__.NotificationsEvents),
  ONBOARDING_EVENT_NAMES: () => (/* reexport safe */ _onboarding__WEBPACK_IMPORTED_MODULE_27__.ONBOARDING_EVENT_NAMES),
  ONBOARDING_STORAGE_KEY: () => (/* reexport safe */ _onboarding__WEBPACK_IMPORTED_MODULE_27__.ONBOARDING_STORAGE_KEY),
  OnboardingEvents: () => (/* reexport safe */ _onboarding__WEBPACK_IMPORTED_MODULE_27__.OnboardingEvents),
  OnboardingPhase: () => (/* reexport safe */ _onboarding__WEBPACK_IMPORTED_MODULE_27__.OnboardingPhase),
  OnboardingURLs: () => (/* reexport safe */ _onboarding__WEBPACK_IMPORTED_MODULE_27__.OnboardingURLs),
  PERMISSION_STORAGE_KEY: () => (/* reexport safe */ _permissions__WEBPACK_IMPORTED_MODULE_28__.PERMISSION_STORAGE_KEY),
  PLACEHOLDER_RPC_HEADERS: () => (/* reexport safe */ _network__WEBPACK_IMPORTED_MODULE_26__.PLACEHOLDER_RPC_HEADERS),
  PermissionEvents: () => (/* reexport safe */ _permissions__WEBPACK_IMPORTED_MODULE_28__.PermissionEvents),
  PrivateKeyChain: () => (/* reexport safe */ _account__WEBPACK_IMPORTED_MODULE_0__.PrivateKeyChain),
  RecoveryMethodType: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.RecoveryMethodType),
  RecoveryMethodTypes: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.RecoveryMethodTypes),
  RpcErrorCode: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.RpcErrorCode),
  SESSION_AUTH_DATA_KEY: () => (/* reexport safe */ _lock__WEBPACK_IMPORTED_MODULE_22__.SESSION_AUTH_DATA_KEY),
  SETTINGS_STORAGE_KEY: () => (/* reexport safe */ _settings__WEBPACK_IMPORTED_MODULE_32__.SETTINGS_STORAGE_KEY),
  SETTINGS_UNENCRYPTED_STORAGE_KEY: () => (/* reexport safe */ _settings__WEBPACK_IMPORTED_MODULE_32__.SETTINGS_UNENCRYPTED_STORAGE_KEY),
  SUPPORTED_PRIMARY_SECRET_TYPES: () => (/* reexport safe */ _wallet__WEBPACK_IMPORTED_MODULE_40__.SUPPORTED_PRIMARY_SECRET_TYPES),
  SecretType: () => (/* reexport safe */ _secrets__WEBPACK_IMPORTED_MODULE_29__.SecretType),
  SecretsError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.SecretsError),
  SeedlessAuthProvider: () => (/* reexport safe */ _wallet__WEBPACK_IMPORTED_MODULE_40__.SeedlessAuthProvider),
  SeedlessError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.SeedlessError),
  SeedlessEvents: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.SeedlessEvents),
  SeedlessExportAnalytics: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.SeedlessExportAnalytics),
  SeedphraseImportError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.SeedphraseImportError),
  SendErrorMessage: () => (/* reexport safe */ _send__WEBPACK_IMPORTED_MODULE_31__.SendErrorMessage),
  SettingsEvents: () => (/* reexport safe */ _settings__WEBPACK_IMPORTED_MODULE_32__.SettingsEvents),
  SubscriptionEvents: () => (/* reexport safe */ _notifications__WEBPACK_IMPORTED_MODULE_43__.SubscriptionEvents),
  SwapErrorCode: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.SwapErrorCode),
  TESTNET_LOOKUP_ASSETS: () => (/* reexport safe */ _fireblocks__WEBPACK_IMPORTED_MODULE_16__.TESTNET_LOOKUP_ASSETS),
  TOKENS_PRICE_DATA: () => (/* reexport safe */ _tokens__WEBPACK_IMPORTED_MODULE_34__.TOKENS_PRICE_DATA),
  TOTP_ISSUER: () => (/* reexport safe */ _seedless__WEBPACK_IMPORTED_MODULE_30__.TOTP_ISSUER),
  TRANSACTION_POLLING_INTERVAL_MS: () => (/* reexport safe */ _fireblocks__WEBPACK_IMPORTED_MODULE_16__.TRANSACTION_POLLING_INTERVAL_MS),
  TX_SUBMISSION_FAILURE_STATUSES: () => (/* reexport safe */ _fireblocks__WEBPACK_IMPORTED_MODULE_16__.TX_SUBMISSION_FAILURE_STATUSES),
  ThemeVariant: () => (/* reexport safe */ _settings__WEBPACK_IMPORTED_MODULE_32__.ThemeVariant),
  TransactionType: () => (/* reexport safe */ _transaction__WEBPACK_IMPORTED_MODULE_42__.TransactionType),
  TransferEventType: () => (/* reexport safe */ _bridge__WEBPACK_IMPORTED_MODULE_6__.TransferEventType),
  UNIFIED_BRIDGE_DEFAULT_STATE: () => (/* reexport safe */ _unified_bridge__WEBPACK_IMPORTED_MODULE_37__.UNIFIED_BRIDGE_DEFAULT_STATE),
  UNIFIED_BRIDGE_STATE_STORAGE_KEY: () => (/* reexport safe */ _unified_bridge__WEBPACK_IMPORTED_MODULE_37__.UNIFIED_BRIDGE_STATE_STORAGE_KEY),
  UNIFIED_BRIDGE_TRACKED_FLAGS: () => (/* reexport safe */ _unified_bridge__WEBPACK_IMPORTED_MODULE_37__.UNIFIED_BRIDGE_TRACKED_FLAGS),
  UnifiedBridgeError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.UnifiedBridgeError),
  UnifiedBridgeEvent: () => (/* reexport safe */ _unified_bridge__WEBPACK_IMPORTED_MODULE_37__.UnifiedBridgeEvent),
  VMModuleError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_13__.VMModuleError),
  WALLET_STORAGE_ENCRYPTION_KEY: () => (/* reexport safe */ _storage__WEBPACK_IMPORTED_MODULE_33__.WALLET_STORAGE_ENCRYPTION_KEY),
  WALLET_STORAGE_KEY: () => (/* reexport safe */ _wallet__WEBPACK_IMPORTED_MODULE_40__.WALLET_STORAGE_KEY),
  WalletConnectError: () => (/* reexport safe */ _wallet_connect__WEBPACK_IMPORTED_MODULE_39__.WalletConnectError),
  WalletConnectErrorCode: () => (/* reexport safe */ _wallet_connect__WEBPACK_IMPORTED_MODULE_39__.WalletConnectErrorCode),
  WalletConnectEvent: () => (/* reexport safe */ _wallet_connect__WEBPACK_IMPORTED_MODULE_39__.WalletConnectEvent),
  WalletEvents: () => (/* reexport safe */ _wallet__WEBPACK_IMPORTED_MODULE_40__.WalletEvents),
  WalletExtensionType: () => (/* reexport safe */ _web3__WEBPACK_IMPORTED_MODULE_41__.WalletExtensionType),
  Web3Event: () => (/* reexport safe */ _dapp_connection__WEBPACK_IMPORTED_MODULE_9__.Web3Event),
  buildActionForRequest: () => (/* reexport safe */ _actions__WEBPACK_IMPORTED_MODULE_1__.buildActionForRequest),
  getUnconfirmedBalanceInCurrency: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_5__.getUnconfirmedBalanceInCurrency),
  hasUnconfirmedBTCBalance: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_5__.hasUnconfirmedBTCBalance),
  isAvaxWithUnavailableBalance: () => (/* reexport safe */ _balance__WEBPACK_IMPORTED_MODULE_5__.isAvaxWithUnavailableBalance),
  isBatchApprovalAction: () => (/* reexport safe */ _actions__WEBPACK_IMPORTED_MODULE_1__.isBatchApprovalAction),
  isConnectionEvent: () => (/* reexport safe */ _ui_connection__WEBPACK_IMPORTED_MODULE_35__.isConnectionEvent),
  isConnectionResponse: () => (/* reexport safe */ _ui_connection__WEBPACK_IMPORTED_MODULE_35__.isConnectionResponse),
  isNoMatchingKeyError: () => (/* reexport safe */ _wallet_connect__WEBPACK_IMPORTED_MODULE_39__.isNoMatchingKeyError),
  isProposalExpiredError: () => (/* reexport safe */ _wallet_connect__WEBPACK_IMPORTED_MODULE_39__.isProposalExpiredError),
  isSolanaMsgRequest: () => (/* reexport safe */ _wallet__WEBPACK_IMPORTED_MODULE_40__.isSolanaMsgRequest),
  isSolanaRequest: () => (/* reexport safe */ _wallet__WEBPACK_IMPORTED_MODULE_40__.isSolanaRequest),
  isTxParams: () => (/* reexport safe */ _transaction__WEBPACK_IMPORTED_MODULE_42__.isTxParams),
  priceChangeRefreshRate: () => (/* reexport safe */ _tokens__WEBPACK_IMPORTED_MODULE_34__.priceChangeRefreshRate)
});
/* ESM import */var _account__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/account.ts");
/* ESM import */var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/actions.ts");
/* ESM import */var _analytics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../types/src/analytics.ts");
/* ESM import */var _app_check__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../types/src/app-check.ts");
/* ESM import */var _approvals__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../types/src/approvals.ts");
/* ESM import */var _balance__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../types/src/balance.ts");
/* ESM import */var _bridge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../types/src/bridge.ts");
/* ESM import */var _contacts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../types/src/contacts.ts");
/* ESM import */var _currency__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../types/src/currency.ts");
/* ESM import */var _dapp_connection__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../types/src/dapp-connection.ts");
/* ESM import */var _debank__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("../types/src/debank.ts");
/* ESM import */var _defi__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("../types/src/defi.ts");
/* ESM import */var _domain_metadata__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("../types/src/domain-metadata.ts");
/* ESM import */var _error__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("../types/src/error.ts");
/* ESM import */var _feature_flags__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("../types/src/feature-flags.ts");
/* ESM import */var _firebase__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("../types/src/firebase.ts");
/* ESM import */var _fireblocks__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("../types/src/fireblocks.ts");
/* ESM import */var _gasless__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("../types/src/gasless.ts");
/* ESM import */var _history__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("../types/src/history.ts");
/* ESM import */var _keystone__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("../types/src/keystone.ts");
/* ESM import */var _keystore__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("../types/src/keystore.ts");
/* ESM import */var _ledger__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("../types/src/ledger.ts");
/* ESM import */var _lock__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("../types/src/lock.ts");
/* ESM import */var _messages__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("../types/src/messages.ts");
/* ESM import */var _navigation_history__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("../types/src/navigation-history.ts");
/* ESM import */var _network_fee__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("../types/src/network-fee.ts");
/* ESM import */var _network__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("../types/src/network.ts");
/* ESM import */var _onboarding__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("../types/src/onboarding.ts");
/* ESM import */var _permissions__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__("../types/src/permissions.ts");
/* ESM import */var _secrets__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__("../types/src/secrets.ts");
/* ESM import */var _seedless__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__("../types/src/seedless.ts");
/* ESM import */var _send__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__("../types/src/send.ts");
/* ESM import */var _settings__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__("../types/src/settings.ts");
/* ESM import */var _storage__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__("../types/src/storage.ts");
/* ESM import */var _tokens__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__("../types/src/tokens.ts");
/* ESM import */var _ui_connection__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__("../types/src/ui-connection.ts");
/* ESM import */var _ui__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__("../types/src/ui.ts");
/* ESM import */var _unified_bridge__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__("../types/src/unified-bridge.ts");
/* ESM import */var _util_types__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__("../types/src/util-types.ts");
/* ESM import */var _wallet_connect__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__("../types/src/wallet-connect.ts");
/* ESM import */var _wallet__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__("../types/src/wallet.ts");
/* ESM import */var _web3__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__("../types/src/web3.ts");
/* ESM import */var _transaction__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__("../types/src/transaction.ts");
/* ESM import */var _notifications__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__("../types/src/notifications.ts");
// export * from './all';














































}),
"../types/src/keystone.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KeystoneEvent: () => (KeystoneEvent)
});
var KeystoneEvent = /*#__PURE__*/ function(KeystoneEvent) {
    KeystoneEvent["DEVICE_REQUEST"] = "KeystoneEvent:device_request";
    return KeystoneEvent;
}({});


}),
"../types/src/keystore.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);



}),
"../types/src/ledger.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  LEDGER_TX_SIZE_LIMIT_BYTES: () => (LEDGER_TX_SIZE_LIMIT_BYTES),
  LEDGER_VERSION_WARNING_WAS_CLOSED: () => (LEDGER_VERSION_WARNING_WAS_CLOSED),
  LedgerEvent: () => (LedgerEvent)
});
var LedgerEvent = /*#__PURE__*/ function(LedgerEvent) {
    LedgerEvent["TRANSPORT_REQUEST"] = "LedgerEvent:transport_request";
    LedgerEvent["DISCOVER_TRANSPORTS"] = "LedgerEvent:discover_transports";
    LedgerEvent["TRANSPORT_CLOSE_REQUEST"] = "LedgerEvent:transport_close";
    return LedgerEvent;
}({});
const LEDGER_VERSION_WARNING_WAS_CLOSED = 'LEDGER_VERSION_WARNING_WAS_CLOSED';
/**
 * Ledger app will throw an error if the tx to sign is too large.
 * Approximately `8kb` is the current limit.
 */ const LEDGER_TX_SIZE_LIMIT_BYTES = 8192;


}),
"../types/src/lock.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AlarmsEvents: () => (AlarmsEvents),
  LOCK_TIMEOUT: () => (LOCK_TIMEOUT),
  LockEvents: () => (LockEvents),
  SESSION_AUTH_DATA_KEY: () => (SESSION_AUTH_DATA_KEY)
});
const SESSION_AUTH_DATA_KEY = 'SESSION_AUTH_DATA_KEY';
const LOCK_TIMEOUT = 1000 * 60 * 60 * 12; // 12 hours
var LockEvents = /*#__PURE__*/ function(LockEvents) {
    LockEvents["LOCK_STATE_CHANGED"] = "LockServiceEvents:Lock";
    return LockEvents;
}({});
var AlarmsEvents = /*#__PURE__*/ function(AlarmsEvents) {
    AlarmsEvents["AUTO_LOCK"] = "auto-lock";
    return AlarmsEvents;
}({});


}),
"../types/src/messages.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  MessageType: () => (MessageType)
});
/* ESM import */var _dapp_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/dapp-connection.ts");

var MessageType = /*#__PURE__*/ function(MessageType) {
    MessageType[MessageType["SIGN_TYPED_DATA_V1"] = _dapp_connection__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN_TYPED_DATA_V1] = "SIGN_TYPED_DATA_V1";
    MessageType[MessageType["SIGN_TYPED_DATA_V3"] = _dapp_connection__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3] = "SIGN_TYPED_DATA_V3";
    MessageType[MessageType["SIGN_TYPED_DATA_V4"] = _dapp_connection__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4] = "SIGN_TYPED_DATA_V4";
    MessageType[MessageType["SIGN_TYPED_DATA"] = _dapp_connection__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN_TYPED_DATA] = "SIGN_TYPED_DATA";
    MessageType[MessageType["PERSONAL_SIGN"] = _dapp_connection__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.PERSONAL_SIGN] = "PERSONAL_SIGN";
    MessageType[MessageType["ETH_SIGN"] = _dapp_connection__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN] = "ETH_SIGN";
    MessageType[MessageType["AVALANCHE_SIGN"] = _dapp_connection__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.AVALANCHE_SIGN_MESSAGE] = "AVALANCHE_SIGN";
    return MessageType;
}({});


}),
"../types/src/navigation-history.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  NAVIGATION_HISTORY_STORAGE_KEY: () => (NAVIGATION_HISTORY_STORAGE_KEY)
});
const NAVIGATION_HISTORY_STORAGE_KEY = 'NAVIGATION_HISTORY';


}),
"../types/src/network-fee.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);



}),
"../types/src/network.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  NETWORK_LIST_STORAGE_KEY: () => (NETWORK_LIST_STORAGE_KEY),
  NETWORK_OVERRIDES_STORAGE_KEY: () => (NETWORK_OVERRIDES_STORAGE_KEY),
  NETWORK_STORAGE_KEY: () => (NETWORK_STORAGE_KEY),
  NetworkEvents: () => (NetworkEvents),
  PLACEHOLDER_RPC_HEADERS: () => (PLACEHOLDER_RPC_HEADERS)
});
var NetworkEvents = /*#__PURE__*/ function(NetworkEvents) {
    NetworkEvents["NETWORK_UPDATE_EVENT"] = "network-updated";
    NetworkEvents["DEVELOPER_MODE_CHANGED"] = "developer-mode-changed";
    NetworkEvents["NETWORKS_UPDATED_EVENT"] = "networks-updated";
    return NetworkEvents;
}({});
const NETWORK_STORAGE_KEY = 'NETWORK_STORAGE_KEY';
const NETWORK_LIST_STORAGE_KEY = 'NETWORK_LIST_STORAGE_KEY';
const NETWORK_OVERRIDES_STORAGE_KEY = 'NETWORK_OVERRIDES_STORAGE_KEY';
const PLACEHOLDER_RPC_HEADERS = {
    '': ''
};


}),
"../types/src/notifications.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  BalanceNotificationTypes: () => (BalanceNotificationTypes),
  NewsNotificationTypes: () => (NewsNotificationTypes),
  NotificationCategories: () => (NotificationCategories),
  NotificationsEvents: () => (NotificationsEvents),
  SubscriptionEvents: () => (SubscriptionEvents)
});
var NotificationCategories = /*#__PURE__*/ function(NotificationCategories) {
    NotificationCategories["BALANCE_CHANGES"] = "BALANCE_CHANGES";
    NotificationCategories["NEWS"] = "NEWS";
    return NotificationCategories;
}({});
var BalanceNotificationTypes = /*#__PURE__*/ function(BalanceNotificationTypes) {
    BalanceNotificationTypes["BALANCE_CHANGES"] = "BALANCE_CHANGES";
    return BalanceNotificationTypes;
}({});
var NewsNotificationTypes = /*#__PURE__*/ function(NewsNotificationTypes) {
    NewsNotificationTypes["PRODUCT_ANNOUNCEMENTS"] = "PRODUCT_ANNOUNCEMENTS";
    NewsNotificationTypes["OFFERS_AND_PROMOTIONS"] = "OFFERS_AND_PROMOTIONS";
    NewsNotificationTypes["MARKET_NEWS"] = "MARKET_NEWS";
    NewsNotificationTypes["PRICE_ALERTS"] = "PRICE_ALERTS";
    return NewsNotificationTypes;
}({});
var SubscriptionEvents = /*#__PURE__*/ function(SubscriptionEvents) {
    SubscriptionEvents["SUBSCRIPTIONS_CHANGED_EVENT"] = "SUBSCRIPTIONS_CHANGED_EVENT";
    return SubscriptionEvents;
}({});
var NotificationsEvents = /*#__PURE__*/ function(NotificationsEvents) {
    NotificationsEvents["CLIENT_REGISTERED"] = "CLIENT_REGISTERED";
    return NotificationsEvents;
}({});


}),
"../types/src/onboarding.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ONBOARDING_EVENT_NAMES: () => (ONBOARDING_EVENT_NAMES),
  ONBOARDING_STORAGE_KEY: () => (ONBOARDING_STORAGE_KEY),
  OnboardingEvents: () => (OnboardingEvents),
  OnboardingPhase: () => (OnboardingPhase),
  OnboardingURLs: () => (OnboardingURLs)
});
var OnboardingPhase = /*#__PURE__*/ function(OnboardingPhase) {
    OnboardingPhase["CREATE_WALLET"] = "create_wallet";
    OnboardingPhase["IMPORT_WALLET"] = "import_wallet";
    OnboardingPhase["PASSWORD"] = "password";
    OnboardingPhase["CONFIRM"] = "confirm";
    OnboardingPhase["FINALIZE"] = "finalize";
    OnboardingPhase["RESTART"] = "restart";
    OnboardingPhase["LEDGER"] = "ledger";
    OnboardingPhase["LEDGER_TROUBLE"] = "ledger_trouble";
    OnboardingPhase["ANALYTICS_CONSENT"] = "analytics_consent";
    OnboardingPhase["KEYSTONE"] = "keystone";
    OnboardingPhase["KEYSTONE_TUTORIAL"] = "keystone_tutorial";
    OnboardingPhase["SEEDLESS_GOOGLE"] = "seedless_google";
    OnboardingPhase["SEEDLESS_APPLE"] = "seedless_apple";
    return OnboardingPhase;
}({});
var OnboardingURLs = /*#__PURE__*/ function(OnboardingURLs) {
    OnboardingURLs["ONBOARDING_HOME"] = "/onboarding";
    OnboardingURLs["CREATE_WALLET"] = "/onboarding/create-wallet";
    OnboardingURLs["SEED_PHRASE"] = "/onboarding/seed-phrase";
    OnboardingURLs["KEYSTONE"] = "/onboarding/keystone";
    OnboardingURLs["LEDGER"] = "/onboarding/ledger";
    OnboardingURLs["CREATE_PASSWORD"] = "/onboarding/create-password";
    OnboardingURLs["ANALYTICS_CONSENT"] = "/onboarding/analytics-consent";
    OnboardingURLs["LEDGER_TROUBLE"] = "/onboarding/ledger-trouble";
    OnboardingURLs["SIGN_IN"] = "/onboarding/sign-in";
    OnboardingURLs["RECOVERY_METHODS"] = "/onboarding/recovery-methods";
    OnboardingURLs["RECOVERY_METHODS_LOGIN"] = "/onboarding/recovery-methods-login";
    return OnboardingURLs;
}({});
const ONBOARDING_EVENT_NAMES = {
    ["create_wallet"]: 'OnboardingCreateNewWalletSelected',
    ["import_wallet"]: 'OnboardingImportMnemonicSelected',
    ["ledger"]: 'OnboardingImportLedgerSelected',
    ["keystone"]: 'OnboardingKeystoneSelected',
    ["seedless_google"]: 'OnboardingSeedlessGoogleSelected',
    ["seedless_apple"]: 'OnboardingSeedlessAppleSelected'
};
var OnboardingEvents = /*#__PURE__*/ function(OnboardingEvents) {
    OnboardingEvents["ONBOARDING_UPDATED_EVENT"] = "ONBOARDING_UPDATED_EVENT";
    return OnboardingEvents;
}({});
const ONBOARDING_STORAGE_KEY = 'onboarding';


}),
"../types/src/permissions.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  PERMISSION_STORAGE_KEY: () => (PERMISSION_STORAGE_KEY),
  PermissionEvents: () => (PermissionEvents)
});
var PermissionEvents = /*#__PURE__*/ function(PermissionEvents) {
    PermissionEvents["PERMISSIONS_STATE_UPDATE"] = "permissions-state-updated";
    return PermissionEvents;
}({});
const PERMISSION_STORAGE_KEY = 'permissions';


}),
"../types/src/secrets.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AVALANCHE_BASE_DERIVATION_PATH: () => (AVALANCHE_BASE_DERIVATION_PATH),
  EVM_BASE_DERIVATION_PATH: () => (EVM_BASE_DERIVATION_PATH),
  SecretType: () => (SecretType)
});
var SecretType = /*#__PURE__*/ function(SecretType) {
    // Primary wallet types
    SecretType["Mnemonic"] = "mnemonic";
    SecretType["Ledger"] = "ledger";
    SecretType["LedgerLive"] = "ledger-live";
    SecretType["Keystone"] = "keystone";
    SecretType["Seedless"] = "seedless";
    // Importable wallets types
    SecretType["PrivateKey"] = "private-key";
    SecretType["WalletConnect"] = "wallet-connect";
    SecretType["Fireblocks"] = "fireblocks";
    return SecretType;
}({});
const EVM_BASE_DERIVATION_PATH = "m/44'/60'/0'";
const AVALANCHE_BASE_DERIVATION_PATH = "m/44'/9000'/0'";


}),
"../types/src/seedless.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AuthErrorCode: () => (AuthErrorCode),
  CoreApiError: () => (CoreApiError),
  FIDOApiEndpoint: () => (FIDOApiEndpoint),
  FIDOSteps: () => (FIDOSteps),
  FidoDeviceType: () => (FidoDeviceType),
  KeyType: () => (KeyType),
  MfaRequestType: () => (MfaRequestType),
  RecoveryMethodType: () => (RecoveryMethodType),
  RecoveryMethodTypes: () => (RecoveryMethodTypes),
  SeedlessEvents: () => (SeedlessEvents),
  SeedlessExportAnalytics: () => (SeedlessExportAnalytics),
  TOTP_ISSUER: () => (TOTP_ISSUER)
});
var FIDOApiEndpoint = /*#__PURE__*/ function(FIDOApiEndpoint) {
    FIDOApiEndpoint["Register"] = "register";
    FIDOApiEndpoint["Authenticate"] = "authenticate";
    return FIDOApiEndpoint;
}({});
var KeyType = /*#__PURE__*/ function(KeyType) {
    KeyType["Passkey"] = "passkey";
    KeyType["Yubikey"] = "yubikey";
    return KeyType;
}({});
const TOTP_ISSUER = 'Core';
class CoreApiError extends Error {
}
var SeedlessEvents = /*#__PURE__*/ function(SeedlessEvents) {
    SeedlessEvents["TokenExpired"] = "token-expired";
    SeedlessEvents["TokenRefreshed"] = "token-refreshed";
    SeedlessEvents["MfaRequest"] = "mfa-request";
    SeedlessEvents["MfaFailure"] = "mfa-failure";
    SeedlessEvents["MfaClear"] = "mfa-clear";
    SeedlessEvents["MfaMethodsUpdated"] = "mfa-methods-updated";
    SeedlessEvents["MfaChoiceRequest"] = "mfa-choice-request";
    return SeedlessEvents;
}({});
var MfaRequestType = /*#__PURE__*/ function(MfaRequestType) {
    MfaRequestType["Totp"] = "totp";
    MfaRequestType["Fido"] = "fido";
    MfaRequestType["FidoRegister"] = "FidoRegister";
    return MfaRequestType;
}({});
var RecoveryMethodType = /*#__PURE__*/ function(RecoveryMethodType) {
    RecoveryMethodType["Passkey"] = "Passkey";
    RecoveryMethodType["Yubikey"] = "Yubikey";
    RecoveryMethodType["Authenticator"] = "Authenticator";
    return RecoveryMethodType;
}({});
var AuthErrorCode = /*#__PURE__*/ function(AuthErrorCode) {
    AuthErrorCode["InvalidTotpCode"] = "invalid-totp-code";
    AuthErrorCode["TotpVerificationError"] = "totp-verification-error";
    AuthErrorCode["NoMfaDetails"] = "no-mfa-details";
    AuthErrorCode["UnknownError"] = "unknown-error";
    AuthErrorCode["UnsupportedProvider"] = "unsupported-provider";
    AuthErrorCode["FailedToFetchOidcToken"] = "failed-to-fetch-oidc-token";
    AuthErrorCode["MismatchingEmail"] = "mismatching-email";
    AuthErrorCode["MissingUserId"] = "missing-user-id";
    AuthErrorCode["MismatchingUserId"] = "mismatching-user-id";
    AuthErrorCode["UnsupportedMfaMethod"] = "unsupported-mfa-method";
    AuthErrorCode["FidoChallengeNotApproved"] = "fido-challenge-not-approved";
    AuthErrorCode["FidoChallengeFailed"] = "fido-challenge-failed";
    AuthErrorCode["NoMfaMethodsConfigured"] = "no-mfa-methods-configured";
    AuthErrorCode["WrongMfaResponseAttempt"] = "wrong-mfa-response-attempt";
    return AuthErrorCode;
}({});
var FidoDeviceType = /*#__PURE__*/ function(FidoDeviceType) {
    FidoDeviceType["Passkey"] = "Passkey";
    FidoDeviceType["Yubikey"] = "Yubikey";
    return FidoDeviceType;
}({});
const ExportRecoveryPhrasePrefix = 'Seedless.ExportRecoveryPhrase';
var SeedlessExportAnalytics = /*#__PURE__*/ function(SeedlessExportAnalytics) {
    SeedlessExportAnalytics[SeedlessExportAnalytics["MenuItemClicked"] = `${ExportRecoveryPhrasePrefix}.MenuItemClicked`] = "MenuItemClicked";
    SeedlessExportAnalytics[SeedlessExportAnalytics["Resigned"] = `${ExportRecoveryPhrasePrefix}.Resigned`] = "Resigned";
    SeedlessExportAnalytics[SeedlessExportAnalytics["PopupOpened"] = `${ExportRecoveryPhrasePrefix}.PopupOpened`] = "PopupOpened";
    SeedlessExportAnalytics[SeedlessExportAnalytics["InitiationStarted"] = `${ExportRecoveryPhrasePrefix}.InitiationStarted`] = "InitiationStarted";
    SeedlessExportAnalytics[SeedlessExportAnalytics["InitiationSucceeded"] = `${ExportRecoveryPhrasePrefix}.InitiationSucceeded`] = "InitiationSucceeded";
    SeedlessExportAnalytics[SeedlessExportAnalytics["InitiationFailed"] = `${ExportRecoveryPhrasePrefix}.InitiationFailed`] = "InitiationFailed";
    SeedlessExportAnalytics[SeedlessExportAnalytics["CancellationStarted"] = `${ExportRecoveryPhrasePrefix}.CancellationStarted`] = "CancellationStarted";
    SeedlessExportAnalytics[SeedlessExportAnalytics["CancellationSucceeded"] = `${ExportRecoveryPhrasePrefix}.CancellationSucceeded`] = "CancellationSucceeded";
    SeedlessExportAnalytics[SeedlessExportAnalytics["CancellationFailed"] = `${ExportRecoveryPhrasePrefix}.CancellationFailed`] = "CancellationFailed";
    SeedlessExportAnalytics[SeedlessExportAnalytics["DecryptionStarted"] = `${ExportRecoveryPhrasePrefix}.DecryptionStarted`] = "DecryptionStarted";
    SeedlessExportAnalytics[SeedlessExportAnalytics["DecryptionSucceeded"] = `${ExportRecoveryPhrasePrefix}.DecryptionSucceeded`] = "DecryptionSucceeded";
    SeedlessExportAnalytics[SeedlessExportAnalytics["DecryptionFailed"] = `${ExportRecoveryPhrasePrefix}.DecryptionFailed`] = "DecryptionFailed";
    SeedlessExportAnalytics[SeedlessExportAnalytics["PhraseCopied"] = `${ExportRecoveryPhrasePrefix}.PhraseCopied`] = "PhraseCopied";
    return SeedlessExportAnalytics;
}({});
var FIDOSteps = /*#__PURE__*/ function(FIDOSteps) {
    FIDOSteps["NAMING"] = "naming";
    FIDOSteps["REGISTER"] = "register";
    FIDOSteps["LOGIN"] = "login";
    FIDOSteps["ERROR"] = "error";
    return FIDOSteps;
}({});
// When the user wants to login with a FIDO device, we don't get the device exact type (e.g. passkey or yubikey), only we get the tpye it is 'fido"
// so we need to handle them as a unit in the login process
var RecoveryMethodTypes = /*#__PURE__*/ function(RecoveryMethodTypes) {
    RecoveryMethodTypes["PASSKEY"] = "passkey";
    RecoveryMethodTypes["TOTP"] = "totp";
    RecoveryMethodTypes["YUBIKEY"] = "yubikey";
    RecoveryMethodTypes["FIDO"] = "fido";
    RecoveryMethodTypes["UNKNOWN"] = "unknown";
    return RecoveryMethodTypes;
}({});


}),
"../types/src/send.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SendErrorMessage: () => (SendErrorMessage)
});
var SendErrorMessage = /*#__PURE__*/ function(SendErrorMessage) {
    SendErrorMessage["AMOUNT_REQUIRED"] = "AMOUNT_REQUIRED";
    SendErrorMessage["AMOUNT_TOO_LOW"] = "AMOUNT_TOO_LOW";
    SendErrorMessage["ADDRESS_REQUIRED"] = "ADDRESS_REQUIRED";
    SendErrorMessage["C_CHAIN_REQUIRED"] = "C_CHAIN_REQUIRED";
    SendErrorMessage["INVALID_ADDRESS"] = "INVALID_ADDRESS";
    SendErrorMessage["INVALID_NETWORK_FEE"] = "INVALID_NETWORK_FEE";
    SendErrorMessage["INSUFFICIENT_BALANCE"] = "INSUFFICIENT_BALANCE";
    SendErrorMessage["INSUFFICIENT_BALANCE_FOR_FEE"] = "INSUFFICIENT_BALANCE_FOR_FEE";
    SendErrorMessage["EXCESSIVE_NETWORK_FEE"] = "EXCESSIVE_NETWORK_FEE";
    SendErrorMessage["TOKEN_REQUIRED"] = "TOKEN_REQUIRED";
    SendErrorMessage["UNSUPPORTED_TOKEN"] = "UNSUPPORTED_TOKEN";
    SendErrorMessage["UNABLE_TO_FETCH_UTXOS"] = "UNABLE_TO_FETCH_UTXOS";
    SendErrorMessage["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    SendErrorMessage["UNSUPPORTED_BY_LEDGER"] = "UNSUPPORTED_BY_LEDGER";
    SendErrorMessage["SEND_NOT_AVAILABLE"] = "SEND_NOT_AVAILABLE";
    return SendErrorMessage;
}({});


}),
"../types/src/settings.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AnalyticsConsent: () => (AnalyticsConsent),
  CURRENCIES: () => (CURRENCIES),
  LanguageLinks: () => (LanguageLinks),
  Languages: () => (Languages),
  SETTINGS_STORAGE_KEY: () => (SETTINGS_STORAGE_KEY),
  SETTINGS_UNENCRYPTED_STORAGE_KEY: () => (SETTINGS_UNENCRYPTED_STORAGE_KEY),
  SettingsEvents: () => (SettingsEvents),
  ThemeVariant: () => (ThemeVariant)
});
var ThemeVariant = /*#__PURE__*/ function(ThemeVariant) {
    ThemeVariant["LIGHT"] = "LIGHT";
    ThemeVariant["DARK"] = "DARK";
    return ThemeVariant;
}({});
var Languages = /*#__PURE__*/ function(Languages) {
    Languages["EN"] = "en";
    Languages["DE"] = "de-DE";
    Languages["ES"] = "es-EM";
    Languages["FR"] = "fr-FR";
    Languages["JA"] = "ja-JP";
    Languages["HI"] = "hi-IN";
    Languages["KO"] = "ko-KR";
    Languages["RU"] = "ru-RU";
    Languages["TR"] = "tr-TR";
    Languages["ZHCN"] = "zh-CN";
    Languages["ZHTW"] = "zh-TW";
    return Languages;
}({});
var LanguageLinks = /*#__PURE__*/ function(LanguageLinks) {
    LanguageLinks["EN"] = "en";
    LanguageLinks["DE"] = "de";
    LanguageLinks["ES"] = "es";
    LanguageLinks["FR"] = "fr";
    LanguageLinks["JA"] = "ja";
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    LanguageLinks["HI"] = "en";
    LanguageLinks["KO"] = "ko";
    LanguageLinks["RU"] = "ru";
    LanguageLinks["TR"] = "tr";
    LanguageLinks["ZHCN"] = "zh-CN";
    LanguageLinks["ZHTW"] = "zh-TW";
    return LanguageLinks;
}({});
const SETTINGS_STORAGE_KEY = 'settings';
const SETTINGS_UNENCRYPTED_STORAGE_KEY = 'setting_unencrypted';
var SettingsEvents = /*#__PURE__*/ function(SettingsEvents) {
    SettingsEvents["SETTINGS_UPDATED"] = "SettingsEvents: SETTINGS_UPDATED";
    return SettingsEvents;
}({});
// TODO: bring back the commented currencies when the glacier supports them
var CURRENCIES = /*#__PURE__*/ function(CURRENCIES) {
    CURRENCIES["USD"] = "USD";
    CURRENCIES["EUR"] = "EUR";
    CURRENCIES["GBP"] = "GBP";
    CURRENCIES["AUD"] = "AUD";
    CURRENCIES["CAD"] = "CAD";
    CURRENCIES["CHF"] = "CHF";
    CURRENCIES["HKD"] = "HKD";
    return CURRENCIES;
}({});
var AnalyticsConsent = /*#__PURE__*/ function(AnalyticsConsent) {
    AnalyticsConsent["Pending"] = "pending";
    AnalyticsConsent["Approved"] = "approved";
    AnalyticsConsent["Denied"] = "denied";
    return AnalyticsConsent;
}({});


}),
"../types/src/storage.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KeyDerivationVersion: () => (KeyDerivationVersion),
  WALLET_STORAGE_ENCRYPTION_KEY: () => (WALLET_STORAGE_ENCRYPTION_KEY)
});
const WALLET_STORAGE_ENCRYPTION_KEY = 'WALLET_STORAGE_ENCRYPTION_KEY';
var KeyDerivationVersion = /*#__PURE__*/ function(KeyDerivationVersion) {
    KeyDerivationVersion["V1"] = "V1";
    KeyDerivationVersion["V2"] = "V2";
    return KeyDerivationVersion;
}({});


}),
"../types/src/tokens.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  TOKENS_PRICE_DATA: () => (TOKENS_PRICE_DATA),
  priceChangeRefreshRate: () => (priceChangeRefreshRate)
});
const TOKENS_PRICE_DATA = 'tokens-price-data';
const priceChangeRefreshRate = 1000 * 60 * 60;


}),
"../types/src/transaction.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AvalancheChainStrings: () => (AvalancheChainStrings),
  TransactionType: () => (TransactionType),
  isTxParams: () => (isTxParams)
});
var AvalancheChainStrings = /*#__PURE__*/ function(AvalancheChainStrings) {
    AvalancheChainStrings["AVM"] = "X Chain";
    AvalancheChainStrings["PVM"] = "P Chain";
    AvalancheChainStrings["EVM"] = "C Chain";
    return AvalancheChainStrings;
}({});
var TransactionType = /*#__PURE__*/ function(TransactionType) {
    TransactionType["SEND_TOKEN"] = "send_token";
    TransactionType["SEND_NFT"] = "send_nft";
    TransactionType["APPROVE_TOKEN"] = "approve_token";
    TransactionType["APPROVE_NFT"] = "approve_nft";
    TransactionType["APPROVE_NFT_COLLECTION"] = "approve_nft_collection";
    TransactionType["REVOKE_TOKEN_APPROVAL"] = "revoke_token_approval";
    TransactionType["REVOKE_NFT_APPROVAL"] = "revoke_nft_approval";
    TransactionType["REVOKE_NFT_COLLECTION_APPROVAL"] = "revoke_nft_collection_approval";
    TransactionType["CANCEL_TX"] = "cancel_tx";
    TransactionType["DEPLOY_CONTRACT"] = "deploy_contract";
    TransactionType["SWAP"] = "swap";
    TransactionType["ADD_LIQUIDITY"] = "add_liquidity";
    TransactionType["CALL"] = "call";
    return TransactionType;
}({});
function isTxParams(params) {
    return !!params.from;
}


}),
"../types/src/ui-connection.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  CORE_DOMAINS: () => (CORE_DOMAINS),
  ExtensionRequest: () => (ExtensionRequest),
  isConnectionEvent: () => (isConnectionEvent),
  isConnectionResponse: () => (isConnectionResponse)
});
var ExtensionRequest = /*#__PURE__*/ function(ExtensionRequest) {
    ExtensionRequest["ONBOARDING_GET_STATE"] = "onboarding_getIsOnBoarded";
    ExtensionRequest["ONBOARDING_SUBMIT"] = "onboarding_submit";
    ExtensionRequest["ONBOARDING_INITIAL_WALLET_OPEN"] = "onboarding_initial_wallet_open";
    ExtensionRequest["MNEMONIC_ONBOARDING_SUBMIT"] = "mnemonic_onboarding_submit";
    ExtensionRequest["SEEDLESS_ONBOARDING_SUBMIT"] = "seedless_onboarding_submit";
    ExtensionRequest["KEYSTONE_ONBOARDING_SUBMIT"] = "keystone_onboarding_submit";
    ExtensionRequest["LEDGER_ONBOARDING_SUBMIT"] = "ledger_onboarding_submit";
    ExtensionRequest["NETWORK_SET_ACTIVE"] = "network_setActiveNetwork";
    ExtensionRequest["NETWORK_SET_DEVELOPER_MODE"] = "network_setDeveloperMode";
    ExtensionRequest["NETWORK_ADD_FAVORITE_NETWORK"] = "network_add_favorite_networks";
    ExtensionRequest["NETWORK_REMOVE_FAVORITE_NETWORK"] = "network_remove_favorite_network";
    ExtensionRequest["NETWORK_SAVE_CUSTOM"] = "network_saveCustomNetwork";
    ExtensionRequest["NETWORK_REMOVE_CUSTOM"] = "network_removeCustomNetwork";
    ExtensionRequest["NETWORKS_GET_STATE"] = "networks_get_state";
    ExtensionRequest["NETWORK_UPDATE_DEFAULT"] = "network_update_default";
    ExtensionRequest["ACCOUNT_GET_ACCOUNTS"] = "account_get";
    ExtensionRequest["ACCOUNT_SELECT"] = "account_select";
    ExtensionRequest["ACCOUNT_ADD"] = "account_add";
    ExtensionRequest["ACCOUNT_GET_PRIVATEKEY"] = "account_get_privatekey";
    ExtensionRequest["SECRETS_APPEND_SOLANA_PUBLIC_KEYS"] = "secrets_append_solana_public_keys";
    ExtensionRequest["BALANCES_GET"] = "balances_get";
    ExtensionRequest["BALANCES_START_POLLING"] = "balances_start_polling";
    ExtensionRequest["BALANCES_STOP_POLLING"] = "balances_stop_polling";
    ExtensionRequest["BALANCES_GET_TOTAL_FOR_WALLET"] = "balance_get_total_for_wallet";
    ExtensionRequest["NETWORK_BALANCES_UPDATE"] = "network_balances_update";
    ExtensionRequest["NFT_BALANCES_GET"] = "nft_balances_get";
    ExtensionRequest["NFT_REFRESH_METADATA"] = "nft_refresh_metadata";
    ExtensionRequest["TOKEN_PRICE_GET"] = "token_price_get";
    ExtensionRequest["BALANCE_NATIVE_GET"] = "balance_native_get";
    ExtensionRequest["BRIDGE_GET_CONFIG"] = "bridge_get_config";
    ExtensionRequest["BRIDGE_GET_STATE"] = "bridge_get_state";
    ExtensionRequest["BRIDGE_TRANSFER_ASSET"] = "bridge_transfer_asset";
    ExtensionRequest["BRIDGE_TRANSACTION_CREATE"] = "bridge_transaction_create";
    ExtensionRequest["BRIDGE_TRANSACTION_REMOVE"] = "bridge_transaction_remove";
    ExtensionRequest["BRIDGE_SET_IS_DEV_ENV"] = "bridge_set_is_dev_env";
    ExtensionRequest["BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT"] = "bridge_get_eth_max_transfer_amount";
    ExtensionRequest["BRIDGE_ESTIMATE_GAS"] = "bridge_estimate_gas";
    ExtensionRequest["WALLET_GET_DETAILS"] = "wallet_getDetails";
    ExtensionRequest["WALLET_UNENCRYPTED_MNEMONIC"] = "wallet_getUnencryptedMnemonic";
    ExtensionRequest["WALLET_GET_BTC_WALLET_POLICY_DETAILS"] = "wallet_getBtcWalletPolicyDetails";
    ExtensionRequest["WALLET_STORE_BTC_WALLET_POLICY_DETAILS"] = "wallet_storeBtcWalletPolicyDetails";
    ExtensionRequest["GET_WALLET_HISTORY"] = "wallet_getHistory";
    ExtensionRequest["LOCK_WALLET"] = "lock_lock";
    ExtensionRequest["UNLOCK_WALLET"] = "lock_unlock";
    ExtensionRequest["LOCK_GET_STATE"] = "lock_getState";
    ExtensionRequest["LOCK_CHANGE_PASSWORD"] = "lock_changePassword";
    ExtensionRequest["ACTION_GET"] = "action_getAction";
    ExtensionRequest["ACTION_UPDATE"] = "action_updateAction";
    ExtensionRequest["ACTION_UPDATE_TX_DATA"] = "action_updateTxData";
    ExtensionRequest["PERMISSIONS_REVOKE_ADDRESS_ACCESS_FOR_DOMAIN"] = "permissions_revokeAddressAccessForDomain";
    ExtensionRequest["PERMISSIONS_GET_PERMISSIONS"] = "permissions_getPermissionsForDomain";
    ExtensionRequest["PERMISSIONS_GET_ALL_PERMISSIONS"] = "permissions_getAllPermissions";
    ExtensionRequest["TRANSACTIONS_GET"] = "transactions_getTransaction";
    ExtensionRequest["TRANSACTIONS_UPDATE"] = "transactions_updateTransaction";
    ExtensionRequest["SEND_VALIDATE"] = "send_validate";
    ExtensionRequest["SEND_SUBMIT"] = "send_submit";
    ExtensionRequest["SETTINGS_GET"] = "settings_get";
    ExtensionRequest["SETTINGS_UPDATE_COLLECTIBLES_VISIBILITY"] = "settings_update_collectibles_visibility";
    ExtensionRequest["SETTINGS_UPDATE_CURRENCY"] = "settings_update_currency";
    ExtensionRequest["SETTINGS_UPDATE_SHOW_NO_BALANCE"] = "settings_update_show_no_balance";
    ExtensionRequest["SETTINGS_UPDATE_THEME"] = "settings_update_theme";
    ExtensionRequest["SETTINGS_UPDATE_TOKENS_VISIBILITY"] = "settings_update_tokens_visibility";
    ExtensionRequest["SETTINGS_ADD_CUSTOM_TOKEN"] = "settings_add_custom_token";
    ExtensionRequest["SETTINGS_GET_TOKEN_DATA"] = "settings_get_token_data";
    ExtensionRequest["SETTINGS_SET_DEFAULT_EXTENSION"] = "settings_set_default_extension";
    ExtensionRequest["SETTINGS_GET_DEFAULT_EXTENSION"] = "settings_get_default_extension";
    ExtensionRequest["SETTINGS_SET_ANALYTICS_CONSENT"] = "settings_set_analytics_consent";
    ExtensionRequest["SETTINGS_SET_LANGUAGE"] = "settings_set_language";
    ExtensionRequest["SETTINGS_SET_CORE_ASSISTANT"] = "settings_set_core_assistant";
    ExtensionRequest["CONTACTS_GET"] = "contacts_get";
    ExtensionRequest["CONTACTS_CREATE"] = "contacts_create";
    ExtensionRequest["CONTACTS_UPDATE"] = "contacts_update";
    ExtensionRequest["CONTACTS_REMOVE"] = "contacts_remove";
    ExtensionRequest["FAVORITES_CREATE"] = "favorites_create";
    ExtensionRequest["FAVORITES_REMOVE"] = "favorites_remove";
    ExtensionRequest["FAVORITES_GET"] = "favorites_get";
    ExtensionRequest["SWAP_GET_RATE"] = "swap_get_rate";
    ExtensionRequest["SWAP_PERFORM"] = "swap_perform";
    ExtensionRequest["NETWORK_FEE_GET"] = "network_fee_get";
    ExtensionRequest["LEDGER_INIT_TRANSPORT"] = "ledger_init_transport";
    ExtensionRequest["LEDGER_HAS_TRANSPORT"] = "ledger_has_transport";
    ExtensionRequest["LEDGER_RESPONSE"] = "ledger_response";
    ExtensionRequest["LEDGER_REMOVE_TRANSPORT"] = "ledger_remove_transport";
    ExtensionRequest["LEDGER_CLOSE_TRANSPORT"] = "ledger_close_transport";
    ExtensionRequest["SHOW_LEDGER_VERSION_WARNING"] = "show_ledger_version_warning";
    ExtensionRequest["LEDGER_VERSION_WARNING_CLOSED"] = "ledger_version_warning_closed";
    ExtensionRequest["LEDGER_MIGRATE_MISSING_PUBKEYS"] = "ledger_migrate_missing_pubkeys";
    ExtensionRequest["KEYSTONE_SUBMIT_SIGNATURE"] = "keystone_submit_signature";
    ExtensionRequest["NAVIGATION_HISTORY_GET"] = "navigation_history_get";
    ExtensionRequest["NAVIGATION_HISTORY_SET"] = "navigation_history_set";
    ExtensionRequest["NAVIGATION_HISTORY_DATA_GET"] = "navigation_history_data_get";
    ExtensionRequest["NAVIGATION_HISTORY_DATA_SET"] = "navigation_history_data_set";
    ExtensionRequest["ANALYTICS_INIT_IDS"] = "analytics_init_ids";
    ExtensionRequest["ANALYTICS_STORE_IDS"] = "analytics_store_ids";
    ExtensionRequest["ANALYTICS_CLEAR_IDS"] = "analytics_clear_ids";
    ExtensionRequest["ANALYTICS_GET_IDS"] = "analytics_get_ids";
    ExtensionRequest["ANALYTICS_CAPTURE_EVENT"] = "analytics_capture_event";
    ExtensionRequest["FEATURE_FLAGS_GET"] = "feature_flags_get";
    ExtensionRequest["RESET_EXTENSION_STATE"] = "reset_extension_state";
    ExtensionRequest["HISTORY_GET"] = "history_get";
    ExtensionRequest["DEFI_GET_PORTFOLIO"] = "defi_get_portfolio";
    ExtensionRequest["CURRENCIES_GET_EXCHANGE_RATES"] = "currencies_get_exchange_rates";
    ExtensionRequest["GET_NETWORK_TOKENS"] = "get_network_tokens";
    ExtensionRequest["WALLET_CONNECT_ESTABLISH_REQUIRED_SESSION"] = "wallet_connect_establish_required_session";
    ExtensionRequest["WALLET_CONNECT_IMPORT_ACCOUNT"] = "wallet_connect_import_account";
    ExtensionRequest["FIREBLOCKS_UPDATE_API_CREDENTIALS"] = "fireblocks_update_api_credentials";
    ExtensionRequest["SEEDLESS_UPDATE_SIGNER_TOKEN"] = "seedless_update_signer_token";
    ExtensionRequest["SEEDLESS_HAS_TOKEN_EXPIRED"] = "seedless_has_token_expired";
    ExtensionRequest["SEEDLESS_INIT_RECOVERY_PHRASE_EXPORT"] = "seedless_init_recovery_phrase_export";
    ExtensionRequest["SEEDLESS_CANCEL_RECOVERY_PHRASE_EXPORT"] = "seedless_cancel_recovery_phrase_export";
    ExtensionRequest["SEEDLESS_GET_RECOVERY_PHRASE_EXPORT_STATE"] = "seedless_get_recovery_phrase_export_state";
    ExtensionRequest["SEEDLESS_COMPLETE_RECOVERY_PHRASE_EXPORT"] = "seedless_complete_recovery_phrase_export";
    ExtensionRequest["SEEDLESS_SUBMIT_MFA_RESPONSE"] = "seedless_submit_mfa_response";
    ExtensionRequest["SEEDLESS_GET_RECOVERY_METHODS"] = "seedless_get_recovery_methods";
    ExtensionRequest["SEEDLESS_INIT_AUTHENTICATOR_CHANGE"] = "seedless_init_authenticator_change";
    ExtensionRequest["SEEDLESS_COMPLETE_AUTHENTICATOR_CHANGE"] = "seedless_complete_authenticator_change";
    ExtensionRequest["SEEDLESS_CHOOSE_MFA_METHOD"] = "seedless_choose_mfa_method";
    ExtensionRequest["SEEDLESS_ADD_FIDO_DEVICE"] = "seedless_add_fido_device";
    ExtensionRequest["SEEDLESS_REMOVE_FIDO_DEVICE"] = "seedless_remove_fido_device";
    ExtensionRequest["SEEDLESS_REMOVE_TOTP"] = "seedless_remove_totp";
    ExtensionRequest["SEEDLESS_DERIVE_MISSING_KEYS"] = "seedless_derive_missing_keys";
    ExtensionRequest["UNIFIED_BRIDGE_GET_FEE"] = "unified_bridge_get_fee";
    ExtensionRequest["UNIFIED_BRIDGE_ESTIMATE_GAS"] = "unified_bridge_estimate_gas";
    ExtensionRequest["UNIFIED_BRIDGE_TRANSFER_ASSET"] = "unified_bridge_transfer_asset";
    ExtensionRequest["UNIFIED_BRIDGE_TRACK_TRANSFER"] = "unified_bridge_track_transfer";
    ExtensionRequest["UNIFIED_BRIDGE_GET_STATE"] = "unified_bridge_get_state";
    ExtensionRequest["UNIFIED_BRIDGE_GET_ASSETS"] = "unified_bridge_get_assets";
    ExtensionRequest["WALLET_IMPORT_SEED_PHRASE"] = "wallet_import_seed_phrase";
    ExtensionRequest["WALLET_IMPORT_LEDGER"] = "wallet_import_ledger";
    ExtensionRequest["BLOCKAID_DAPP_SCAN"] = "blockaid_dapp_scan";
    ExtensionRequest["GASLESS_FETCH_AND_SOLVE_CHALLENGE"] = "gasless_fetch_and_solve_challange";
    ExtensionRequest["GASLESS_FUND_TX"] = "gasless_fund_tx";
    ExtensionRequest["GASLESS_GET_ELIGIBILITY"] = "gasless_get_eligibility";
    ExtensionRequest["GASLESS_SET_HEX_VALUES"] = "gasless_set_hex_values";
    ExtensionRequest["GASLESS_SET_DEFAUlT_STATE_VALUES"] = "gasless_set_default_state_values";
    ExtensionRequest["GASLESS_CREATE_OFFSCREEN"] = "gasless_create_offscreen";
    ExtensionRequest["GASLESS_CLOSE_OFFSCREEN"] = "gasless_close_offscreen";
    ExtensionRequest["FIREBASE_SET_MODEL"] = "firebase_set_model";
    ExtensionRequest["FIREBASE_SEND_MESSAGE"] = "firebase_send_message";
    ExtensionRequest["NOTIFICATION_SUBSCRIBE"] = "notification_subscribe";
    ExtensionRequest["NOTIFICATION_UNSUBSCRIBE"] = "notification_unsubscribe";
    ExtensionRequest["NOTIFICATION_GET_SUBSCRIPTIONS"] = "notification_get_subscriptions";
    return ExtensionRequest;
}({});
function isConnectionEvent(message) {
    return !message.hasOwnProperty('id') && message.hasOwnProperty('name');
}
function isConnectionResponse(message) {
    return message.hasOwnProperty('id') && !message.hasOwnProperty('name') && !message.hasOwnProperty('value');
}
const CORE_DOMAINS = [
    'localhost',
    '127.0.0.1',
    'core-web.pages.dev',
    'core.app',
    'test.core.app',
    'ava-labs.github.io',
    'avacloud.io',
    'avacloud-app.pages.dev',
    'redesign-aa3.pages.dev'
];


}),
"../types/src/ui.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ContextContainer: () => (ContextContainer)
});
var ContextContainer = /*#__PURE__*/ function(ContextContainer) {
    ContextContainer["POPUP"] = "/popup.html";
    ContextContainer["CONFIRM"] = "/confirm.html";
    ContextContainer["HOME"] = "/home.html";
    ContextContainer["FULLSCREEN"] = "/fullscreen.html";
    return ContextContainer;
}({});


}),
"../types/src/unified-bridge.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  UNIFIED_BRIDGE_DEFAULT_STATE: () => (UNIFIED_BRIDGE_DEFAULT_STATE),
  UNIFIED_BRIDGE_STATE_STORAGE_KEY: () => (UNIFIED_BRIDGE_STATE_STORAGE_KEY),
  UNIFIED_BRIDGE_TRACKED_FLAGS: () => (UNIFIED_BRIDGE_TRACKED_FLAGS),
  UnifiedBridgeEvent: () => (UnifiedBridgeEvent)
});
/* ESM import */var _feature_flags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../types/src/feature-flags.ts");

const UNIFIED_BRIDGE_TRACKED_FLAGS = [
    _feature_flags__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_CCTP,
    _feature_flags__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_ICTT,
    _feature_flags__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC,
    _feature_flags__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA,
    _feature_flags__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.UNIFIED_BRIDGE_AB_EVM
];
const UNIFIED_BRIDGE_DEFAULT_STATE = {
    pendingTransfers: {}
};
const UNIFIED_BRIDGE_STATE_STORAGE_KEY = 'UNIFIED_BRIDGE_STATE';
var UnifiedBridgeEvent = /*#__PURE__*/ function(UnifiedBridgeEvent) {
    UnifiedBridgeEvent["StateUpdated"] = "UNIFIED_BRIDGE_STATE_UPDATED";
    UnifiedBridgeEvent["TransferStepChange"] = "UNIFIED_BRIDGE_TRASNFER_STEP_CHANGE";
    UnifiedBridgeEvent["AssetsUpdated"] = "UNIFIED_BRIDGE_ASSETS_UPDATED";
    return UnifiedBridgeEvent;
}({});


}),
"../types/src/util-types.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ACTION_HANDLED_BY_MODULE: () => (ACTION_HANDLED_BY_MODULE),
  DEFERRED_RESPONSE: () => (DEFERRED_RESPONSE)
});
const ACTION_HANDLED_BY_MODULE = '__handled.via.vm.modules__';
const DEFERRED_RESPONSE = Symbol();


}),
"../types/src/wallet-connect.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  CORE_MOBILE_WALLET_ID: () => (CORE_MOBILE_WALLET_ID),
  FIREBLOCKS_APP_NAME: () => (FIREBLOCKS_APP_NAME),
  WalletConnectError: () => (WalletConnectError),
  WalletConnectErrorCode: () => (WalletConnectErrorCode),
  WalletConnectEvent: () => (WalletConnectEvent),
  isNoMatchingKeyError: () => (isNoMatchingKeyError),
  isProposalExpiredError: () => (isProposalExpiredError)
});
var WalletConnectEvent = /*#__PURE__*/ function(WalletConnectEvent) {
    WalletConnectEvent["UriGenerated"] = "WalletConnect:uri_generated";
    WalletConnectEvent["SessionPermissionsMismatch"] = "WalletConnect:session_permissions_mismatch";
    return WalletConnectEvent;
}({});
const CORE_MOBILE_WALLET_ID = 'c3de833a-9cb0-4274-bb52-86e402ecfcd3';
const FIREBLOCKS_APP_NAME = 'Fireblocks';
const isProposalExpiredError = (err)=>err instanceof Error && err.message === 'Proposal expired';
const isNoMatchingKeyError = (err)=>err instanceof Error && err.message.includes('No matching key');
var WalletConnectErrorCode = /*#__PURE__*/ function(WalletConnectErrorCode) {
    WalletConnectErrorCode["NoAccountsConnected"] = "no-accounts-connected";
    WalletConnectErrorCode["NoClient"] = "client-not-initialized";
    WalletConnectErrorCode["ClientInitFailed"] = "client-init-failed";
    WalletConnectErrorCode["ProposalExpired"] = "proposal-expired";
    WalletConnectErrorCode["IncorrectAddress"] = "incorrect-address";
    WalletConnectErrorCode["UnknownError"] = "unknown-error";
    WalletConnectErrorCode["UserRejected"] = "user-rejected";
    return WalletConnectErrorCode;
}({});
class WalletConnectError extends Error {
    constructor(message, code, originalError){
        super(message);
        this.code = code;
        this.originalError = originalError;
    }
}


}),
"../types/src/wallet.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  SUPPORTED_PRIMARY_SECRET_TYPES: () => (SUPPORTED_PRIMARY_SECRET_TYPES),
  SeedlessAuthProvider: () => (SeedlessAuthProvider),
  WALLET_STORAGE_KEY: () => (WALLET_STORAGE_KEY),
  WalletEvents: () => (WalletEvents),
  isSolanaMsgRequest: () => (isSolanaMsgRequest),
  isSolanaRequest: () => (isSolanaRequest)
});
/* ESM import */var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/@avalabs/vm-module-types/dist/index.js");
/* ESM import */var _secrets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../types/src/secrets.ts");


const isSolanaRequest = (sigReq)=>'type' in sigReq && (sigReq.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION || sigReq.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.RpcMethod.SOLANA_SIGN_TRANSACTION || sigReq.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.RpcMethod.SOLANA_SIGN_MESSAGE);
const isSolanaMsgRequest = (sigReq)=>sigReq.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.RpcMethod.SOLANA_SIGN_MESSAGE;
var WalletEvents = /*#__PURE__*/ function(WalletEvents) {
    WalletEvents["WALLET_STATE_UPDATE"] = "wallet-state-updated";
    return WalletEvents;
}({});
const WALLET_STORAGE_KEY = 'wallet';
const SUPPORTED_PRIMARY_SECRET_TYPES = [
    _secrets__WEBPACK_IMPORTED_MODULE_1__.SecretType.Mnemonic,
    _secrets__WEBPACK_IMPORTED_MODULE_1__.SecretType.Keystone,
    _secrets__WEBPACK_IMPORTED_MODULE_1__.SecretType.Ledger,
    _secrets__WEBPACK_IMPORTED_MODULE_1__.SecretType.LedgerLive,
    _secrets__WEBPACK_IMPORTED_MODULE_1__.SecretType.Seedless
];
var SeedlessAuthProvider = /*#__PURE__*/ function(SeedlessAuthProvider) {
    SeedlessAuthProvider["Google"] = "google";
    SeedlessAuthProvider["Apple"] = "apple";
    return SeedlessAuthProvider;
}({});


}),
"../types/src/web3.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  WalletExtensionType: () => (WalletExtensionType)
});
var WalletExtensionType = /*#__PURE__*/ function(WalletExtensionType) {
    WalletExtensionType["CORE"] = "CORE";
    WalletExtensionType["METAMASK"] = "METAMASK";
    WalletExtensionType["UNKNOWN"] = "UNKNOWN";
    WalletExtensionType["RABBY"] = "RABBY";
    WalletExtensionType["COINBASE"] = "COINBASE";
    WalletExtensionType["PHANTOM"] = "PHANTOM";
    WalletExtensionType["ZERION"] = "ZERION";
    WalletExtensionType["KEPLR"] = "KEPLR";
    return WalletExtensionType;
}({});


}),
"?54a6": (function () {
/* (ignored) */

}),
"?ebe8": (function () {
/* (ignored) */

}),
"?143a": (function () {
/* (ignored) */

}),
"?1dda": (function () {
/* (ignored) */

}),
"?8d9f": (function () {
/* (ignored) */

}),
"?b827": (function () {
/* (ignored) */

}),
"?197c": (function () {
/* (ignored) */

}),
"?3cf9": (function () {
/* (ignored) */

}),
"?52c2": (function () {
/* (ignored) */

}),
"?5003": (function () {
/* (ignored) */

}),
"?e3ec": (function () {
/* (ignored) */

}),
"?7531": (function () {
/* (ignored) */

}),
"?37b7": (function () {
/* (ignored) */

}),
"?25fb": (function () {
/* (ignored) */

}),
"?fe09": (function () {
/* (ignored) */

}),
"?111e": (function () {
/* (ignored) */

}),
"?74e3": (function () {
/* (ignored) */

}),
"?5dff": (function () {
/* (ignored) */

}),
"?d976": (function () {
/* (ignored) */

}),
"../common/src/utils/keystore/keystore-fixtures/keystore-v2.json": (function (module) {
module.exports = JSON.parse('{"version":"2.0","salt":"2SjQXSMR87tBvYqbkwTFL61gEdwR","pass_hash":"2NJf6rqPshCU69hMkPEMBLBZLfBKshHy68cWgNY7kNmAM988Qt","keys":[{"key":"C8JG3QvhF9XUiXMyAmQoTfTkWg5UySMPKeCrkGH8u67HrqStNtBxZyDxLY6NrSS8k51Fg3V","iv":"Fc8Xyxmhd2X55sgjy4aTxN","address":"X-EAZkJNdFBjVQQ7zS81hWCnRHfMKf3vpYH"},{"key":"p52F7MGpyicfG2c7RXuKKKpUE7X9qjLX7qx2ju3mei58jU4vCxRQpjcR6RvSKbozphMT1s8","iv":"N6fYr5gT4TJfB6Tzs9oLMN","address":"X-7r1aDs2jiJHr1reFfLFzzKrprZruXVzqM"}]}')

}),
"../common/src/utils/keystore/keystore-fixtures/keystore-v3.json": (function (module) {
module.exports = JSON.parse('{"version":"3.0","salt":"kwkVtmPkafnwWbp65nYs2z9cQeN","pass_hash":"2gid7yJzvyg2Mz4HUJLh3jvgumpDJmRu2PBopqHYacVjwisp1g","keys":[{"key":"uDvvzSQQxkFGhYUvDcRFmWtKbqJEZ8swKgMx7Ba3eWUoTMaikvV2oD2jUFzaS35WdP8rtqF","iv":"AN8nLnaK84rfoKXtxm6evy","address":"X-EAZkJNdFBjVQQ7zS81hWCnRHfMKf3vpYH"},{"key":"PiLrcsSBZ1fBE9v3axsHycfhta6NwMf56qqGKgxswr4VSNGL3kZUQG8YCCRG2q7QDN8y5mp","iv":"L7MojgHmudo2WpbMCdfgCg","address":"X-7r1aDs2jiJHr1reFfLFzzKrprZruXVzqM"}],"warnings":["This address listed in this file is for internal wallet use only. DO NOT USE THIS ADDRESS"]}')

}),
"../common/src/utils/keystore/keystore-fixtures/keystore-v4.json": (function (module) {
module.exports = JSON.parse('{"version":"4.0","salt":"UWLRsfsyjY51E1s8CVa7cvvMHMz","pass_hash":"M6mzyfS4i4bKBxXQZFuQ6BsRnMSVMe7GnBd1HTmVLi2jcscPA","keys":[{"key":"s2RScHaFr6nr3JQkb8wNBbAPAWiGNkZRRmbUYY2tnxhCpdTgnHLyTDHXN4mdfEV4fVwFcMP","iv":"A6jQMX7e6doGS6wVvdLzA"}]}')

}),
"../common/src/utils/keystore/keystore-fixtures/keystore-v5.json": (function (module) {
module.exports = JSON.parse('{"version":"5.0","salt":"TEUQMGR1XdHs5wb4SVSA7LriUhR","pass_hash":"avkdK9YFLn1zfZjvBsB9ipKRzfqr4rvqBryVosB6NUgFiv9kd","keys":[{"key":"5jVaPDgXd9nm3DF6XWSbvpGFKVd5yujnYekQCoK4evkoMBAWNz7Nc7YVKYUc6RQJiPy47rh1kfc2uydapEuVieN51eeHRATGqQP4Rj5wjN1xwKVgEsxvGeAytMevbYE9L2y4nCPyHvVcPQB66d7B5kdgYv3N7QVd3K284skjfGsZbZAT16vinjkZry8ypdwt2UV7c6WbVFX72BuEAajapn5TdkWCpPHJZgTkVs9utfndxYMW9m","iv":"Ak8DSMKMy4f1RXHSSt15KK"}]}')

}),
"../common/src/utils/keystore/keystore-fixtures/keystore-v6-private-key.json": (function (module) {
module.exports = JSON.parse('{"version":"6.0","salt":"gpREk7UQELwqHHi5Up745hiH9sM","activeIndex":0,"keys":[{"key":"5yMG6VWZS7qBP6JPYUaU6pYLyEMkWgZfEnQDZmZfTKdEkgpcpwt43kTURFooL7rEmUAe5XhbXhKaeeHPH2wuHvjyvkYqRSVggGef81ZjZNZRUZy","iv":"LkVD8xhaS2Pw6SQ7nT5r5N","type":"singleton"}]}')

}),
"../common/src/utils/keystore/keystore-fixtures/keystore-v6.json": (function (module) {
module.exports = JSON.parse('{"version":"6.0","salt":"2NgqFaoYSe5foo8oEtcdB658c7Eb","activeIndex":0,"keys":[{"key":"KJYzUxFzn2EFazvAkfEgkbdJ7L2qeUTG5jTHUa9MunaNZWzNREd1GvYbwbUDdUsEu9Z5vB4kKW6x3farGCjtDHJ6c4nRCEnJKTUmFsBZ6CZqQ4MfXCMBXPvzvvDuv3VhYeE1LkiQHQRhEfKQGVaY282xDRifx3xyeT8ar18LxF3UPDNjX1D1EDLX4bTvbT4cChc8EPj9ufwXrov1y7Fcw3krJ5H87GnkwCZezzTxUeas1eTztZ","iv":"TQei93ehgGWgUKXkLha8Ef","type":"mnemonic"}]}')

}),

});
/************************************************************************/
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
if (cachedModule.error !== undefined) throw cachedModule.error;
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
id: moduleId,
loaded: false,
exports: {}
});
// Execute the module function
try {

var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
module = execOptions.module;
if (!execOptions.factory) {
  console.error("undefined factory", moduleId)
}
execOptions.factory.call(module.exports, module, module.exports, execOptions.require);

} catch (e) {
module.error = e;
throw e;
}
// Flag the module as loaded
module.loaded = true;
// Return the exports of the module
return module.exports;

}

// expose the modules object (__webpack_modules__)
__webpack_require__.m = __webpack_modules__;

// expose the module cache
__webpack_require__.c = __webpack_module_cache__;

// expose the module execution interceptor
__webpack_require__.i = [];

/************************************************************************/
// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-ESM modules
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

})();
// webpack/runtime/create_fake_namespace_object
(() => {
var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
var leafPrototypes;
// create a fake namespace object
// mode & 1: value is a module id, require it
// mode & 2: merge all properties of value into the ns
// mode & 4: return value when already ns object
// mode & 16: return value when it's Promise-like
// mode & 8|1: behave like require
__webpack_require__.t = function(value, mode) {
	if(mode & 1) value = this(value);
	if(mode & 8) return value;
	if(typeof value === 'object' && value) {
		if((mode & 4) && value.__esModule) return value;
		if((mode & 16) && typeof value.then === 'function') return value;
	}
	var ns = Object.create(null);
  __webpack_require__.r(ns);
	var def = {};
	leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
	for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
		Object.getOwnPropertyNames(current).forEach((key) => { def[key] = () => (value[key]) });
	}
	def['default'] = () => (value);
	__webpack_require__.d(ns, def);
	return ns;
};
})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/ensure_chunk
(() => {
__webpack_require__.f = {};
// This file contains only the entry chunk.
// The chunk loading function for additional chunks
__webpack_require__.e = (chunkId) => {
	return Promise.all(
		Object.keys(__webpack_require__.f).reduce((promises, key) => {
			__webpack_require__.f[key](chunkId, promises);
			return promises;
		}, [])
	);
};
})();
// webpack/runtime/esm_module_decorator
(() => {
__webpack_require__.hmd = (module) => {
  module = Object.create(module);
  if (!module.children) module.children = [];
  Object.defineProperty(module, 'exports', {
      enumerable: true,
      set: () => {
          throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
      }
  });
  return module;
};
})();
// webpack/runtime/get javascript chunk filename
(() => {
// This function allow to reference chunks
__webpack_require__.u = (chunkId) => {
  // return url for filenames not based on template
  
  // return url for filenames based on template
  return "js/" + chunkId + ".js"
}
})();
// webpack/runtime/get mini-css chunk filename
(() => {
// This function allow to reference chunks
__webpack_require__.miniCssF = (chunkId) => {
  // return url for filenames not based on template
  
  // return url for filenames based on template
  return "" + chunkId + ".css"
}
})();
// webpack/runtime/get_chunk_update_filename
(() => {
__webpack_require__.hu = (chunkId) => ('' + chunkId + '.' + __webpack_require__.h() + '.hot-update.js')
})();
// webpack/runtime/get_full_hash
(() => {
__webpack_require__.h = () => ("e16ac0eb3276420e")
})();
// webpack/runtime/get_main_filename/update manifest
(() => {
__webpack_require__.hmrF = function () {
            return "offscreen." + __webpack_require__.h() + ".hot-update.json";
         };
        
})();
// webpack/runtime/global
(() => {
__webpack_require__.g = (() => {
	if (typeof globalThis === 'object') return globalThis;
	try {
		return this || new Function('return this')();
	} catch (e) {
		if (typeof window === 'object') return window;
	}
})();
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
// webpack/runtime/hot_module_replacement
(() => {
var currentModuleData = {};
var installedModules = __webpack_require__.c;

// module and require creation
var currentChildModule;
var currentParents = [];

// status
var registeredStatusHandlers = [];
var currentStatus = "idle";

// while downloading
var blockingPromises = 0;
var blockingPromisesWaiting = [];

// The update info
var currentUpdateApplyHandlers;
var queuedInvalidatedModules;

__webpack_require__.hmrD = currentModuleData;
__webpack_require__.i.push(function (options) {
	var module = options.module;
	var require = createRequire(options.require, options.id);
	module.hot = createModuleHotObject(options.id, module);
	module.parents = currentParents;
	module.children = [];
	currentParents = [];
	options.require = require;
});

__webpack_require__.hmrC = {};
__webpack_require__.hmrI = {};

function createRequire(require, moduleId) {
	var me = installedModules[moduleId];
	if (!me) return require;
	var fn = function (request) {
		if (me.hot.active) {
			if (installedModules[request]) {
				var parents = installedModules[request].parents;
				if (parents.indexOf(moduleId) === -1) {
					parents.push(moduleId);
				}
			} else {
				currentParents = [moduleId];
				currentChildModule = request;
			}
			if (me.children.indexOf(request) === -1) {
				me.children.push(request);
			}
		} else {
			console.warn(
				"[HMR] unexpected require(" +
				request +
				") from disposed module " +
				moduleId
			);
			currentParents = [];
		}
		return require(request);
	};
	var createPropertyDescriptor = function (name) {
		return {
			configurable: true,
			enumerable: true,
			get: function () {
				return require[name];
			},
			set: function (value) {
				require[name] = value;
			}
		};
	};
	for (var name in require) {
		if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
			Object.defineProperty(fn, name, createPropertyDescriptor(name));
		}
	}

	fn.e = function (chunkId, fetchPriority) {
		return trackBlockingPromise(require.e(chunkId, fetchPriority));
	};

	return fn;
}

function createModuleHotObject(moduleId, me) {
	var _main = currentChildModule !== moduleId;
	var hot = {
		_acceptedDependencies: {},
		_acceptedErrorHandlers: {},
		_declinedDependencies: {},
		_selfAccepted: false,
		_selfDeclined: false,
		_selfInvalidated: false,
		_disposeHandlers: [],
		_main: _main,
		_requireSelf: function () {
			currentParents = me.parents.slice();
			currentChildModule = _main ? undefined : moduleId;
			__webpack_require__(moduleId);
		},
		active: true,
		accept: function (dep, callback, errorHandler) {
			if (dep === undefined) hot._selfAccepted = true;
			else if (typeof dep === "function") hot._selfAccepted = dep;
			else if (typeof dep === "object" && dep !== null) {
				for (var i = 0; i < dep.length; i++) {
					hot._acceptedDependencies[dep[i]] = callback || function () { };
					hot._acceptedErrorHandlers[dep[i]] = errorHandler;
				}
			} else {
				hot._acceptedDependencies[dep] = callback || function () { };
				hot._acceptedErrorHandlers[dep] = errorHandler;
			}
		},
		decline: function (dep) {
			if (dep === undefined) hot._selfDeclined = true;
			else if (typeof dep === "object" && dep !== null)
				for (var i = 0; i < dep.length; i++)
					hot._declinedDependencies[dep[i]] = true;
			else hot._declinedDependencies[dep] = true;
		},
		dispose: function (callback) {
			hot._disposeHandlers.push(callback);
		},
		addDisposeHandler: function (callback) {
			hot._disposeHandlers.push(callback);
		},
		removeDisposeHandler: function (callback) {
			var idx = hot._disposeHandlers.indexOf(callback);
			if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
		},
		invalidate: function () {
			this._selfInvalidated = true;
			switch (currentStatus) {
				case "idle":
					currentUpdateApplyHandlers = [];
					Object.keys(__webpack_require__.hmrI).forEach(function (key) {
						__webpack_require__.hmrI[key](moduleId, currentUpdateApplyHandlers);
					});
					setStatus("ready");
					break;
				case "ready":
					Object.keys(__webpack_require__.hmrI).forEach(function (key) {
						__webpack_require__.hmrI[key](moduleId, currentUpdateApplyHandlers);
					});
					break;
				case "prepare":
				case "check":
				case "dispose":
				case "apply":
					(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
						moduleId
					);
					break;
				default:
					break;
			}
		},
		check: hotCheck,
		apply: hotApply,
		status: function (l) {
			if (!l) return currentStatus;
			registeredStatusHandlers.push(l);
		},
		addStatusHandler: function (l) {
			registeredStatusHandlers.push(l);
		},
		removeStatusHandler: function (l) {
			var idx = registeredStatusHandlers.indexOf(l);
			if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
		},
		data: currentModuleData[moduleId]
	};
	currentChildModule = undefined;
	return hot;
}

function setStatus(newStatus) {
	currentStatus = newStatus; 
	var results = [];
	for (var i = 0; i < registeredStatusHandlers.length; i++)
		results[i] = registeredStatusHandlers[i].call(null, newStatus);

	return Promise.all(results).then(function () { });
}

function unblock() {
	if (--blockingPromises === 0) {
		setStatus("ready").then(function () {
			if (blockingPromises === 0) {
				var list = blockingPromisesWaiting;
				blockingPromisesWaiting = [];
				for (var i = 0; i < list.length; i++) {
					list[i]();
				}
			}
		});
	}
}

function trackBlockingPromise(promise) {
	switch (currentStatus) {
		case "ready":
			setStatus("prepare");
		case "prepare":
			blockingPromises++;
			promise.then(unblock, unblock);
			return promise;
		default:
			return promise;
	}
}

function waitForBlockingPromises(fn) {
	if (blockingPromises === 0) return fn();
	return new Promise(function (resolve) {
		blockingPromisesWaiting.push(function () {
			resolve(fn());
		});
	});
}

function hotCheck(applyOnUpdate) {
	if (currentStatus !== "idle") {
		throw new Error("check() is only allowed in idle status");
	} 
	return setStatus("check")
		.then(__webpack_require__.hmrM)
		.then(function (update) {
			if (!update) {
				return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
					function () {
						return null;
					}
				);
			}

			return setStatus("prepare").then(function () {
				var updatedModules = [];
				currentUpdateApplyHandlers = [];

				return Promise.all(
					Object.keys(__webpack_require__.hmrC).reduce(function (
						promises,
						key
					) {
						__webpack_require__.hmrC[key](
							update.c,
							update.r,
							update.m,
							promises,
							currentUpdateApplyHandlers,
							updatedModules
						);
						return promises;
					},
						[])
				).then(function () {
					return waitForBlockingPromises(function () {
						if (applyOnUpdate) {
							return internalApply(applyOnUpdate);
						}
						return setStatus("ready").then(function () {
							return updatedModules;
						});
					});
				});
			});
		});
}

function hotApply(options) {
	if (currentStatus !== "ready") {
		return Promise.resolve().then(function () {
			throw new Error(
				"apply() is only allowed in ready status (state: " + currentStatus + ")"
			);
		});
	}
	return internalApply(options);
}

function internalApply(options) {
	options = options || {};
	applyInvalidatedModules();
	var results = currentUpdateApplyHandlers.map(function (handler) {
		return handler(options);
	});
	currentUpdateApplyHandlers = undefined;
	var errors = results
		.map(function (r) {
			return r.error;
		})
		.filter(Boolean);

	if (errors.length > 0) {
		return setStatus("abort").then(function () {
			throw errors[0];
		});
	}

	var disposePromise = setStatus("dispose");

	results.forEach(function (result) {
		if (result.dispose) result.dispose();
	});

	var applyPromise = setStatus("apply");

	var error;
	var reportError = function (err) {
		if (!error) error = err;
	};

	var outdatedModules = [];
	results.forEach(function (result) {
		if (result.apply) {
			var modules = result.apply(reportError);
			if (modules) {
				for (var i = 0; i < modules.length; i++) {
					outdatedModules.push(modules[i]);
				}
			}
		}
	});

	return Promise.all([disposePromise, applyPromise]).then(function () {
		if (error) {
			return setStatus("fail").then(function () {
				throw error;
			});
		}

		if (queuedInvalidatedModules) {
			return internalApply(options).then(function (list) {
				outdatedModules.forEach(function (moduleId) {
					if (list.indexOf(moduleId) < 0) list.push(moduleId);
				});
				return list;
			});
		}

		return setStatus("idle").then(function () {
			return outdatedModules;
		});
	});
}

function applyInvalidatedModules() {
	if (queuedInvalidatedModules) {
		if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
		Object.keys(__webpack_require__.hmrI).forEach(function (key) {
			queuedInvalidatedModules.forEach(function (moduleId) {
				__webpack_require__.hmrI[key](moduleId, currentUpdateApplyHandlers);
			});
		});
		queuedInvalidatedModules = undefined;
		return true;
	}
}

})();
// webpack/runtime/load_script
(() => {
var inProgress = {};

var dataWebpackPrefix = "@core/offscreen:";
// loadScript function to load a script via script tag
__webpack_require__.l = function (url, done, key, chunkId) {
	if (inProgress[url]) {
		inProgress[url].push(done);
		return;
	}
	var script, needAttach;
	if (key !== undefined) {
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++) {
			var s = scripts[i];
			if (s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) {
				script = s;
				break;
			}
		}
	}
	if (!script) {
		needAttach = true;
		
    script = document.createElement('script');
    
		script.charset = 'utf-8';
		script.timeout = 120;
		if (__webpack_require__.nc) {
			script.setAttribute("nonce", __webpack_require__.nc);
		}
		script.setAttribute("data-webpack", dataWebpackPrefix + key);
		
		script.src = url;
		
    
	}
	inProgress[url] = [done];
	var onScriptComplete = function (prev, event) {
		script.onerror = script.onload = null;
		clearTimeout(timeout);
		var doneFns = inProgress[url];
		delete inProgress[url];
		script.parentNode && script.parentNode.removeChild(script);
		doneFns &&
			doneFns.forEach(function (fn) {
				return fn(event);
			});
		if (prev) return prev(event);
	};
	var timeout = setTimeout(
		onScriptComplete.bind(null, undefined, {
			type: 'timeout',
			target: script
		}),
		120000
	);
	script.onerror = onScriptComplete.bind(null, script.onerror);
	script.onload = onScriptComplete.bind(null, script.onload);
	needAttach && document.head.appendChild(script);
};

})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
})();
// webpack/runtime/node_module_decorator
(() => {
__webpack_require__.nmd = (module) => {
  module.paths = [];
  if (!module.children) module.children = [];
  return module;
};
})();
// webpack/runtime/on_chunk_loaded
(() => {
var deferred = [];
__webpack_require__.O = (result, chunkIds, fn, priority) => {
	if (chunkIds) {
		priority = priority || 0;
		for (var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--)
			deferred[i] = deferred[i - 1];
		deferred[i] = [chunkIds, fn, priority];
		return;
	}
	var notFulfilled = Infinity;
	for (var i = 0; i < deferred.length; i++) {
		var [chunkIds, fn, priority] = deferred[i];
		var fulfilled = true;
		for (var j = 0; j < chunkIds.length; j++) {
			if (
				(priority & (1 === 0) || notFulfilled >= priority) &&
				Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))
			) {
				chunkIds.splice(j--, 1);
			} else {
				fulfilled = false;
				if (priority < notFulfilled) notFulfilled = priority;
			}
		}
		if (fulfilled) {
			deferred.splice(i--, 1);
			var r = fn();
			if (r !== undefined) result = r;
		}
	}
	return result;
};

})();
// webpack/runtime/public_path
(() => {
__webpack_require__.p = "/";
})();
// webpack/runtime/rspack_version
(() => {
__webpack_require__.rv = () => ("1.3.2")
})();
// webpack/runtime/css loading
(() => {
if (typeof document === "undefined") return;
var createStylesheet = function (
	chunkId, fullhref, oldTag, resolve, reject
) {
	var linkTag = document.createElement("link");
	
	linkTag.rel = "stylesheet";
	linkTag.type="text/css";
	if (__webpack_require__.nc) {
		linkTag.nonce = __webpack_require__.nc;
	}
	var onLinkComplete = function (event) {
		// avoid mem leaks.
		linkTag.onerror = linkTag.onload = null;
		if (event.type === 'load') {
			resolve();
		} else {
			var errorType = event && (event.type === 'load' ? 'missing' : event.type);
			var realHref = event && event.target && event.target.href || fullhref;
			var err = new Error("Loading CSS chunk " + chunkId + " failed.\\n(" + realHref + ")");
			err.code = "CSS_CHUNK_LOAD_FAILED";
			err.type = errorType;
			err.request = realHref;
			if (linkTag.parentNode) linkTag.parentNode.removeChild(linkTag)
			reject(err);
		}
	}

	linkTag.onerror = linkTag.onload = onLinkComplete;
	linkTag.href = fullhref;
	
	if (oldTag) {
  oldTag.parentNode.insertBefore(linkTag, oldTag.nextSibling);
} else {
  document.head.appendChild(linkTag);
}
	return linkTag;
}
var findStylesheet = function (href, fullhref) {
	var existingLinkTags = document.getElementsByTagName("link");
	for (var i = 0; i < existingLinkTags.length; i++) {
		var tag = existingLinkTags[i];
		var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
		if (tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
	}

	var existingStyleTags = document.getElementsByTagName("style");
	for (var i = 0; i < existingStyleTags.length; i++) {
		var tag = existingStyleTags[i];
		var dataHref = tag.getAttribute("data-href");
		if (dataHref === href || dataHref === fullhref) return tag;
	}
}

var loadStylesheet = function (chunkId) {
	return new Promise(function (resolve, reject) {
		var href = __webpack_require__.miniCssF(chunkId);
		var fullhref = __webpack_require__.p + href;
		if (findStylesheet(href, fullhref)) return resolve();
		createStylesheet(chunkId, fullhref, null, resolve, reject);
	})
}

// no chunk loading
var oldTags = [];
var newTags = [];
var applyHandler = function (options) {
	return {
		dispose: function () {
			for (var i = 0; i < oldTags.length; i++) {
				var oldTag = oldTags[i];
				if (oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
			}
			oldTags.length = 0;
		},
		apply: function () {
			for (var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
			newTags.length = 0;
		}
	}
}
__webpack_require__.hmrC.miniCss = function (chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) {
	applyHandlers.push(applyHandler);
	chunkIds.forEach(function (chunkId) {
		var href = __webpack_require__.miniCssF(chunkId);
		var fullhref = __webpack_require__.p + href;
		var oldTag = findStylesheet(href, fullhref);
		if (!oldTag) return;
		promises.push(new Promise(function (resolve, reject) {
			var tag = createStylesheet(
				chunkId,
				fullhref,
				oldTag,
				function () {
					tag.as = "style";
					tag.rel = "preload";
					resolve();
				},
				reject
			);
			oldTags.push(oldTag);
			newTags.push(tag);
		}))
	});
}


})();
// webpack/runtime/jsonp_chunk_loading
(() => {

      // object to store loaded and loading chunks
      // undefined = chunk not loaded, null = chunk preloaded/prefetched
      // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
      var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {"offscreen": 0,};
      
        __webpack_require__.f.j = function (chunkId, promises) {
          // JSONP chunk loading for javascript
var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
	? installedChunks[chunkId]
	: undefined;
if (installedChunkData !== 0) {
	// 0 means "already installed".

	// a Promise means "currently loading".
	if (installedChunkData) {
		promises.push(installedChunkData[2]);
	} else {
		if (true) {
			// setup Promise in chunk cache
			var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
			promises.push((installedChunkData[2] = promise));

			// start chunk loading
			var url = __webpack_require__.p + __webpack_require__.u(chunkId);
			// create error before stack unwound to get useful stacktrace later
			var error = new Error();
			var loadingEnded = function (event) {
				if (__webpack_require__.o(installedChunks, chunkId)) {
					installedChunkData = installedChunks[chunkId];
					if (installedChunkData !== 0) installedChunks[chunkId] = undefined;
					if (installedChunkData) {
						var errorType =
							event && (event.type === 'load' ? 'missing' : event.type);
						var realSrc = event && event.target && event.target.src;
						error.message =
							'Loading chunk ' +
							chunkId +
							' failed.\n(' +
							errorType +
							': ' +
							realSrc +
							')';
						error.name = 'ChunkLoadError';
						error.type = errorType;
						error.request = realSrc;
						installedChunkData[1](error);
					}
				}
			};
			__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
		} 
	}
}

        }
        var currentUpdatedModulesList;
var waitingUpdateResolves = {};
function loadUpdateChunk(chunkId, updatedModulesList) {
	currentUpdatedModulesList = updatedModulesList;
	return new Promise((resolve, reject) => {
		waitingUpdateResolves[chunkId] = resolve;
		// start update chunk loading
		var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
		// create error before stack unwound to get useful stacktrace later
		var error = new Error();
		var loadingEnded = (event) => {
			if (waitingUpdateResolves[chunkId]) {
				waitingUpdateResolves[chunkId] = undefined;
				var errorType =
					event && (event.type === 'load' ? 'missing' : event.type);
				var realSrc = event && event.target && event.target.src;
				error.message =
					'Loading hot update chunk ' +
					chunkId +
					' failed.\n(' +
					errorType +
					': ' +
					realSrc +
					')';
				error.name = 'ChunkLoadError';
				error.type = errorType;
				error.request = realSrc;
				reject(error);
			}
		};
		__webpack_require__.l(url, loadingEnded);
	});
}

globalThis["webpackHotUpdate_core_offscreen"] = (chunkId, moreModules, runtime) => {
	for (var moduleId in moreModules) {
		if (__webpack_require__.o(moreModules, moduleId)) {
			currentUpdate[moduleId] = moreModules[moduleId];
			if (currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
		}
	}
	if (runtime) currentUpdateRuntime.push(runtime);
	if (waitingUpdateResolves[chunkId]) {
		waitingUpdateResolves[chunkId]();
		waitingUpdateResolves[chunkId] = undefined;
	}
};
var currentUpdateChunks;
var currentUpdate;
var currentUpdateRemovedChunks;
var currentUpdateRuntime;
function applyHandler(options) {
	if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
	currentUpdateChunks = undefined;
	function getAffectedModuleEffects(updateModuleId) {
		var outdatedModules = [updateModuleId];
		var outdatedDependencies = {};
		var queue = outdatedModules.map(function (id) {
			return {
				chain: [id],
				id: id
			};
		});
		while (queue.length > 0) {
			var queueItem = queue.pop();
			var moduleId = queueItem.id;
			var chain = queueItem.chain;
			var module = __webpack_require__.c[moduleId];
			if (
				!module ||
				(module.hot._selfAccepted && !module.hot._selfInvalidated)
			) {
				continue;
			}

			if (module.hot._selfDeclined) {
				return {
					type: "self-declined",
					chain: chain,
					moduleId: moduleId
				};
			}

			if (module.hot._main) {
				return {
					type: "unaccepted",
					chain: chain,
					moduleId: moduleId
				};
			}

			for (var i = 0; i < module.parents.length; i++) {
				var parentId = module.parents[i];
				var parent = __webpack_require__.c[parentId];
				if (!parent) {
					continue;
				}
				if (parent.hot._declinedDependencies[moduleId]) {
					return {
						type: "declined",
						chain: chain.concat([parentId]),
						moduleId: moduleId,
						parentId: parentId
					};
				}
				if (outdatedModules.indexOf(parentId) !== -1) {
					continue;
				}
				if (parent.hot._acceptedDependencies[moduleId]) {
					if (!outdatedDependencies[parentId]) {
						outdatedDependencies[parentId] = [];
					}
					addAllToSet(outdatedDependencies[parentId], [moduleId]);
					continue;
				}
				delete outdatedDependencies[parentId];
				outdatedModules.push(parentId);
				queue.push({
					chain: chain.concat([parentId]),
					id: parentId
				});
			}
		}

		return {
			type: "accepted",
			moduleId: updateModuleId,
			outdatedModules: outdatedModules,
			outdatedDependencies: outdatedDependencies
		};
	}

	function addAllToSet(a, b) {
		for (var i = 0; i < b.length; i++) {
			var item = b[i];
			if (a.indexOf(item) === -1) a.push(item);
		}
	}

	var outdatedDependencies = {};
	var outdatedModules = [];
	var appliedUpdate = {};

	var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
		console.warn(
			"[HMR] unexpected require(" + module.id + ") to disposed module"
		);
	};

	for (var moduleId in currentUpdate) {
		if (__webpack_require__.o(currentUpdate, moduleId)) {
			var newModuleFactory = currentUpdate[moduleId];
			var result = newModuleFactory ? getAffectedModuleEffects(moduleId) : {
				type: "disposed",
				moduleId: moduleId
			};
			var abortError = false;
			var doApply = false;
			var doDispose = false;
			var chainInfo = "";
			if (result.chain) {
				chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
			}
			switch (result.type) {
				case "self-declined":
					if (options.onDeclined) options.onDeclined(result);
					if (!options.ignoreDeclined)
						abortError = new Error(
							"Aborted because of self decline: " + result.moduleId + chainInfo
						);
					break;
				case "declined":
					if (options.onDeclined) options.onDeclined(result);
					if (!options.ignoreDeclined)
						abortError = new Error(
							"Aborted because of declined dependency: " +
							result.moduleId +
							" in " +
							result.parentId +
							chainInfo
						);
					break;
				case "unaccepted":
					if (options.onUnaccepted) options.onUnaccepted(result);
					if (!options.ignoreUnaccepted)
						abortError = new Error(
							"Aborted because " + moduleId + " is not accepted" + chainInfo
						);
					break;
				case "accepted":
					if (options.onAccepted) options.onAccepted(result);
					doApply = true;
					break;
				case "disposed":
					if (options.onDisposed) options.onDisposed(result);
					doDispose = true;
					break;
				default:
					throw new Error("Unexception type " + result.type);
			}
			if (abortError) {
				return {
					error: abortError
				};
			}
			if (doApply) {
				appliedUpdate[moduleId] = newModuleFactory;
				addAllToSet(outdatedModules, result.outdatedModules);
				for (moduleId in result.outdatedDependencies) {
					if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
						if (!outdatedDependencies[moduleId])
							outdatedDependencies[moduleId] = [];
						addAllToSet(
							outdatedDependencies[moduleId],
							result.outdatedDependencies[moduleId]
						);
					}
				}
			}
			if (doDispose) {
				addAllToSet(outdatedModules, [result.moduleId]);
				appliedUpdate[moduleId] = warnUnexpectedRequire;
			}
		}
	}
	currentUpdate = undefined;

	var outdatedSelfAcceptedModules = [];
	for (var j = 0; j < outdatedModules.length; j++) {
		var outdatedModuleId = outdatedModules[j];
		var module = __webpack_require__.c[outdatedModuleId];
		if (
			module &&
			(module.hot._selfAccepted || module.hot._main) &&
			// removed self-accepted modules should not be required
			appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
			// when called invalidate self-accepting is not possible
			!module.hot._selfInvalidated
		) {
			outdatedSelfAcceptedModules.push({
				module: outdatedModuleId,
				require: module.hot._requireSelf,
				errorHandler: module.hot._selfAccepted
			});
		}
	} 

	var moduleOutdatedDependencies;
	return {
		dispose: function () {
			currentUpdateRemovedChunks.forEach(function (chunkId) {
				delete installedChunks[chunkId];
			});
			currentUpdateRemovedChunks = undefined;

			var idx;
			var queue = outdatedModules.slice();
			while (queue.length > 0) {
				var moduleId = queue.pop();
				var module = __webpack_require__.c[moduleId];
				if (!module) continue;

				var data = {};

				// Call dispose handlers
				var disposeHandlers = module.hot._disposeHandlers; 
				for (j = 0; j < disposeHandlers.length; j++) {
					disposeHandlers[j].call(null, data);
				}
				__webpack_require__.hmrD[moduleId] = data;

				module.hot.active = false;

				delete __webpack_require__.c[moduleId];

				delete outdatedDependencies[moduleId];

				for (j = 0; j < module.children.length; j++) {
					var child = __webpack_require__.c[module.children[j]];
					if (!child) continue;
					idx = child.parents.indexOf(moduleId);
					if (idx >= 0) {
						child.parents.splice(idx, 1);
					}
				}
			}

			var dependency;
			for (var outdatedModuleId in outdatedDependencies) {
				if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
					module = __webpack_require__.c[outdatedModuleId];
					if (module) {
						moduleOutdatedDependencies = outdatedDependencies[outdatedModuleId];
						for (j = 0; j < moduleOutdatedDependencies.length; j++) {
							dependency = moduleOutdatedDependencies[j];
							idx = module.children.indexOf(dependency);
							if (idx >= 0) module.children.splice(idx, 1);
						}
					}
				}
			}
		},
		apply: function (reportError) {
			// insert new code
			for (var updateModuleId in appliedUpdate) {
				if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
					__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId]; 
				}
			}

			// run new runtime modules
			for (var i = 0; i < currentUpdateRuntime.length; i++) {
				currentUpdateRuntime[i](__webpack_require__);
			}

			// call accept handlers
			for (var outdatedModuleId in outdatedDependencies) {
				if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
					var module = __webpack_require__.c[outdatedModuleId];
					if (module) {
						moduleOutdatedDependencies = outdatedDependencies[outdatedModuleId];
						var callbacks = [];
						var errorHandlers = [];
						var dependenciesForCallbacks = [];
						for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
							var dependency = moduleOutdatedDependencies[j];
							var acceptCallback = module.hot._acceptedDependencies[dependency];
							var errorHandler = module.hot._acceptedErrorHandlers[dependency];
							if (acceptCallback) {
								if (callbacks.indexOf(acceptCallback) !== -1) continue;
								callbacks.push(acceptCallback);
								errorHandlers.push(errorHandler); 
								dependenciesForCallbacks.push(dependency);
							}
						}
						for (var k = 0; k < callbacks.length; k++) {
							try {
								callbacks[k].call(null, moduleOutdatedDependencies);
							} catch (err) {
								if (typeof errorHandlers[k] === "function") {
									try {
										errorHandlers[k](err, {
											moduleId: outdatedModuleId,
											dependencyId: dependenciesForCallbacks[k]
										});
									} catch (err2) {
										if (options.onErrored) {
											options.onErrored({
												type: "accept-error-handler-errored",
												moduleId: outdatedModuleId,
												dependencyId: dependenciesForCallbacks[k],
												error: err2,
												originalError: err
											});
										}
										if (!options.ignoreErrored) {
											reportError(err2);
											reportError(err);
										}
									}
								} else {
									if (options.onErrored) {
										options.onErrored({
											type: "accept-errored",
											moduleId: outdatedModuleId,
											dependencyId: dependenciesForCallbacks[k],
											error: err
										});
									}
									if (!options.ignoreErrored) {
										reportError(err);
									}
								}
							}
						}
					}
				}
			}

			// Load self accepted modules
			for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
				var item = outdatedSelfAcceptedModules[o];
				var moduleId = item.module;
				try {
					item.require(moduleId);
				} catch (err) {
					if (typeof item.errorHandler === "function") {
						try {
							item.errorHandler(err, {
								moduleId: moduleId,
								module: __webpack_require__.c[moduleId]
							});
						} catch (err1) {
							if (options.onErrored) {
								options.onErrored({
									type: "self-accept-error-handler-errored",
									moduleId: moduleId,
									error: err1,
									originalError: err
								});
							}
							if (!options.ignoreErrored) {
								reportError(err1);
								reportError(err);
							}
						}
					} else {
						if (options.onErrored) {
							options.onErrored({
								type: "self-accept-errored",
								moduleId: moduleId,
								error: err
							});
						}
						if (!options.ignoreErrored) {
							reportError(err);
						}
					}
				}
			}

			return outdatedModules;
		}
	};
}

__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
	if (!currentUpdate) {
		currentUpdate = {};
		currentUpdateRuntime = [];
		currentUpdateRemovedChunks = [];
		applyHandlers.push(applyHandler);
	}
	if (!__webpack_require__.o(currentUpdate, moduleId)) {
		currentUpdate[moduleId] = __webpack_require__.m[moduleId];
	}
};

__webpack_require__.hmrC.jsonp = function (
	chunkIds,
	removedChunks,
	removedModules,
	promises,
	applyHandlers,
	updatedModulesList
) {
	applyHandlers.push(applyHandler);
	currentUpdateChunks = {};
	currentUpdateRemovedChunks = removedChunks;
	currentUpdate = removedModules.reduce(function (obj, key) {
		obj[key] = false;
		return obj;
	}, {});
	currentUpdateRuntime = [];
	chunkIds.forEach(function (chunkId) {
		if (
			__webpack_require__.o(installedChunks, chunkId) &&
			installedChunks[chunkId] !== undefined
		) {
			promises.push(loadUpdateChunk(chunkId, updatedModulesList));
			currentUpdateChunks[chunkId] = true;
		} else {
			currentUpdateChunks[chunkId] = false;
		}
	});
	if (__webpack_require__.f) {
		__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
			if (
				currentUpdateChunks &&
				__webpack_require__.o(currentUpdateChunks, chunkId) &&
				!currentUpdateChunks[chunkId]
			) {
				promises.push(loadUpdateChunk(chunkId));
				currentUpdateChunks[chunkId] = true;
			}
		};
	}
};
__webpack_require__.hmrM = () => {
	if (typeof fetch === "undefined")
		throw new Error("No browser support: need fetch API");
	return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then(
		(response) => {
			if (response.status === 404) return; // no update available
			if (!response.ok)
				throw new Error(
					"Failed to fetch update manifest " + response.statusText
				);
			return response.json();
		}
	);
};
__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
// install a JSONP callback for chunk loading
var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
	var [chunkIds, moreModules, runtime] = data;
	// add "moreModules" to the modules object,
	// then flag all "chunkIds" as loaded and fire callback
	var moduleId, chunkId, i = 0;
	if (chunkIds.some((id) => (installedChunks[id] !== 0))) {
		for (moduleId in moreModules) {
			if (__webpack_require__.o(moreModules, moduleId)) {
				__webpack_require__.m[moduleId] = moreModules[moduleId];
			}
		}
		if (runtime) var result = runtime(__webpack_require__);
	}
	if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
	for (; i < chunkIds.length; i++) {
		chunkId = chunkIds[i];
		if (
			__webpack_require__.o(installedChunks, chunkId) &&
			installedChunks[chunkId]
		) {
			installedChunks[chunkId][0]();
		}
		installedChunks[chunkId] = 0;
	}
	return __webpack_require__.O(result);
};

var chunkLoadingGlobal = globalThis["webpackChunk_core_offscreen"] = globalThis["webpackChunk_core_offscreen"] || [];
chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
chunkLoadingGlobal.push = webpackJsonpCallback.bind(
	null,
	chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
);

})();
// webpack/runtime/rspack_unique_id
(() => {
__webpack_require__.ruid = "bundler=rspack@1.3.2";

})();
/************************************************************************/
// module cache are used so entry inlining is disabled
// startup
// Load entry module and return exports
var __webpack_exports__ = __webpack_require__.O(undefined, ["lib-axios", "vendors-node_modules_cubist-labs_cubesigner-sdk_dist_esm_src_index_js-node_modules_sentry_cor-6c82cb"], function() { return __webpack_require__("./src/offscreen.ts") });
__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
})()
;
//# sourceMappingURL=offscreen.js.map