"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_hooks_useIsFunctionAvailable_ts"],{

/***/ "./src/background/services/accounts/utils/typeGuards.ts":
/*!**************************************************************!*\
  !*** ./src/background/services/accounts/utils/typeGuards.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isFireblocksAccount": () => (/* binding */ isFireblocksAccount),
/* harmony export */   "isImportedAccount": () => (/* binding */ isImportedAccount),
/* harmony export */   "isPrimaryAccount": () => (/* binding */ isPrimaryAccount),
/* harmony export */   "isWalletConnectAccount": () => (/* binding */ isWalletConnectAccount)
/* harmony export */ });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ "./src/background/services/accounts/models.ts");

const isFireblocksAccount = account => account?.type === _models__WEBPACK_IMPORTED_MODULE_0__.AccountType.FIREBLOCKS;
const isWalletConnectAccount = account => account?.type === _models__WEBPACK_IMPORTED_MODULE_0__.AccountType.WALLET_CONNECT;
const isPrimaryAccount = account => account?.type === _models__WEBPACK_IMPORTED_MODULE_0__.AccountType.PRIMARY;
const isImportedAccount = account => Boolean(account) && !isPrimaryAccount(account);

/***/ }),

/***/ "./src/background/services/fireblocks/utils/isFireblocksApiSupported.ts":
/*!******************************************************************************!*\
  !*** ./src/background/services/fireblocks/utils/isFireblocksApiSupported.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isFireblocksApiSupported)
/* harmony export */ });
// If we have the BTC address for a Fireblocks account, that means that we were
// provided the correct API credentials (otherwise we wouldn't be able to fetch
// the address).
function isFireblocksApiSupported(account) {
  return Boolean(account?.addressBTC);
}

/***/ }),

/***/ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts":
/*!***************************************************************************!*\
  !*** ./src/background/services/network/utils/isAvalanchePchainNetwork.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPchainNetwork": () => (/* binding */ isPchainNetwork),
/* harmony export */   "isPchainNetworkId": () => (/* binding */ isPchainNetworkId)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isPchainNetwork(network) {
  if (!network) {
    return false;
  }
  return network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.PVM;
}
function isPchainNetworkId(chainId) {
  return _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_P === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_TEST_P === chainId;
}

/***/ }),

/***/ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts":
/*!***************************************************************************!*\
  !*** ./src/background/services/network/utils/isAvalancheXchainNetwork.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isXchainNetwork": () => (/* binding */ isXchainNetwork),
/* harmony export */   "isXchainNetworkId": () => (/* binding */ isXchainNetworkId)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");

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

/***/ }),

/***/ "./src/hooks/useIsFunctionAvailable.ts":
/*!*********************************************!*\
  !*** ./src/hooks/useIsFunctionAvailable.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionNames": () => (/* binding */ FunctionNames),
/* harmony export */   "useIsFunctionAvailable": () => (/* binding */ useIsFunctionAvailable)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/accounts/utils/typeGuards */ "./src/background/services/accounts/utils/typeGuards.ts");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_background_services_fireblocks_utils_isFireblocksApiSupported__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/fireblocks/utils/isFireblocksApiSupported */ "./src/background/services/fireblocks/utils/isFireblocksApiSupported.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _useIsUsingSeedlessAccount__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./useIsUsingSeedlessAccount */ "./src/hooks/useIsUsingSeedlessAccount.ts");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/background/services/network/utils/isEthereumNetwork */ "./src/background/services/network/utils/isEthereumNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalancheNetwork__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheNetwork */ "./src/background/services/network/utils/isAvalancheNetwork.ts");












let FunctionNames = /*#__PURE__*/function (FunctionNames) {
  FunctionNames["BRIDGE"] = "Bridge";
  FunctionNames["BUY"] = "Buy";
  FunctionNames["COLLECTIBLES"] = "COLLECTIBLES";
  FunctionNames["DEFI"] = "DeFi";
  FunctionNames["FEATURE"] = "Feature";
  FunctionNames["KEYSTONE"] = "Keystone";
  FunctionNames["MANAGE_TOKEN"] = "ManageTokens";
  FunctionNames["MANAGE_COLLECTIBLES"] = "ManageCollectibles";
  FunctionNames["RECEIVE"] = "Receive";
  FunctionNames["SEND"] = "Send";
  FunctionNames["SWAP"] = "Swap";
  FunctionNames["SIGN"] = "Sign";
  FunctionNames["TOKEN_DETAILS"] = "TokenDetails";
  return FunctionNames;
}({});
const FeatureFlagMap = {
  [FunctionNames.BRIDGE]: _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.BRIDGE,
  [FunctionNames.BUY]: _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.BUY,
  [FunctionNames.DEFI]: _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.DEFI,
  [FunctionNames.KEYSTONE]: _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.KEYSTONE,
  [FunctionNames.SEND]: _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SEND,
  [FunctionNames.SWAP]: _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SWAP
};
const functionRequireSigning = [FunctionNames.BRIDGE, FunctionNames.SEND, FunctionNames.SWAP, FunctionNames.SIGN];

// The list we want to DISABLE features on certain networks or account types (blacklist)

// Disables given feature on BTC networks when:
//  - active account has no BTC address
//  - active account is imported through WalletConnect (no Bitcoin support)
//  - active account is imported from Fireblocks without BTC support
const disableForAccountsWithoutBtcSupport = (chain, account) => {
  const isBtc = [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.BITCOIN, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.BITCOIN_TESTNET].includes(chain);
  if (!isBtc) {
    return false;
  }
  const hasBtcAddress = Boolean(account.addressBTC);
  return !hasBtcAddress || (0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_0__.isWalletConnectAccount)(account) || (0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_0__.isFireblocksAccount)(account) && !(0,_src_background_services_fireblocks_utils_isFireblocksApiSupported__WEBPACK_IMPORTED_MODULE_2__["default"])(account);
};

// Disables given feature on PVM network when:
//  - active account has no XP address
//  - active account is imported through WalletConnect (no XP support)
//  - active account is imported from Fireblocks
const disableForAccountsWithoutXPSupport = (chain, account) => {
  const isPChain = (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_7__.isPchainNetworkId)(chain);
  const isXChain = (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isXchainNetworkId)(chain);
  if (!isPChain && !isXChain) {
    return false;
  }
  const hasPAddress = Boolean(account.addressPVM);
  const hasXAddress = Boolean(account.addressAVM);
  return isPChain && !hasPAddress || isXChain && !hasXAddress || (0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_0__.isWalletConnectAccount)(account) || (0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_0__.isFireblocksAccount)(account);
};
const disabledFeatures = {
  ManageTokens: {
    networks: [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.BITCOIN, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_P, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_TEST_P, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_X, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_TEST_X],
    complexChecks: []
  },
  ManageCollectibles: {
    networks: [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.BITCOIN, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_P, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_TEST_P, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_X, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_TEST_X],
    complexChecks: []
  },
  Receive: {
    networks: [],
    complexChecks: [disableForAccountsWithoutBtcSupport, disableForAccountsWithoutXPSupport]
  },
  Send: {
    networks: [],
    complexChecks: [disableForAccountsWithoutBtcSupport, disableForAccountsWithoutXPSupport]
  },
  Bridge: {
    networks: [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_P, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_TEST_P, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_X, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_TEST_X, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.DFK, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.DFK_TESTNET, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.SWIMMER, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.SWIMMER_TESTNET],
    complexChecks: [disableForAccountsWithoutBtcSupport]
  }
};

// The list we want to ENABLE features on certain networks (whitelist)
const enabledFeatures = {
  COLLECTIBLES: [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_MAINNET_ID, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_TESTNET_ID, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.ETHEREUM_HOMESTEAD, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.SOLANA_MAINNET_ID, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.SOLANA_DEVNET_ID],
  Swap: [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_MAINNET_ID, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.ETHEREUM_HOMESTEAD],
  Buy: [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_MAINNET_ID, _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_11__.ChainId.AVALANCHE_TESTNET_ID]
};

/**
 * isFunctionAvailable:
 * This is checking feature flags to see if a specific feature is currently available.
 * Also it checks if seedless signing is available if the account is seedless.
 *
 * isFunctionSupported:
 * This is checking if the function is supported on the active network.
 */

const useIsFunctionAvailable = functionName => {
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__.useNetworkContext)();
  const isUsingSeedlessAccount = (0,_useIsUsingSeedlessAccount__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_6__.useFeatureFlagContext)();
  const {
    accounts: {
      active
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_3__.useAccountsContext)();
  const isReady = Boolean(network && active);
  const checkIsFunctionAvailable = functionToCheck => {
    if (isUsingSeedlessAccount && functionRequireSigning.includes(functionToCheck) && !featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SEEDLESS_SIGNING]) {
      return false;
    }
    if (functionToCheck === FunctionNames.SEND) {
      if ((0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_7__.isPchainNetwork)(network)) {
        return Boolean(!!active?.addressPVM && featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SEND] && featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SEND_P_CHAIN]);
      } else if ((0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isXchainNetwork)(network)) {
        return Boolean(!!active?.addressAVM && featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SEND] && featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SEND_X_CHAIN]);
      }
    }
    if (functionToCheck === FunctionNames.SWAP) {
      if (!network || !featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SWAP]) {
        return false;
      }
      return (0,_src_background_services_network_utils_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_9__.isEthereumNetwork)(network) ? featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SWAP_ETHEREUM] : (0,_src_background_services_network_utils_isAvalancheNetwork__WEBPACK_IMPORTED_MODULE_10__.isAvalancheNetwork)(network) ? featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SWAP_C_CHAIN] : false;
    }
    const featureFlagToCheck = FeatureFlagMap[functionToCheck];
    return featureFlagToCheck ? featureFlags[featureFlagToCheck] : true;
  };
  const checkIsFunctionSupported = name => {
    if (!network || !active) {
      return false;
    }

    //The avalanche Ledger app doesn’t suprort send on x/p chain yet
    //The account without addressPVM cannot send on pchain
    const onPchainWithNoAccess = (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_7__.isPchainNetwork)(network) && !active.addressPVM;

    //The account without addressAVM cannot send on xchain
    const onXchainWithNoAccress = (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isXchainNetwork)(network) && !active.addressAVM;
    if (name === FunctionNames.SEND && (onPchainWithNoAccess || onXchainWithNoAccress)) {
      return false;
    }
    // Check whitelist
    if (enabledFeatures[name] && !enabledFeatures[name].includes(network.chainId)) {
      return false;
    }
    // Check blacklist
    const blacklist = disabledFeatures[name];
    if (blacklist) {
      const blacklistedForNetwork = blacklist.networks.includes(network.chainId);
      const blacklistedForOtherReasons = blacklist.complexChecks.some(check => check(network.chainId, active));
      return !blacklistedForNetwork && !blacklistedForOtherReasons;
    }
    return true;
  };
  if (!network || !active || !functionName) {
    return {
      isReady,
      isFunctionAvailable: false,
      isFunctionSupported: false,
      checkIsFunctionSupported: checkIsFunctionSupported,
      checkIsFunctionAvailable: checkIsFunctionAvailable
    };
  }
  return {
    isReady,
    isFunctionAvailable: checkIsFunctionAvailable(functionName ?? FunctionNames.FEATURE),
    isFunctionSupported: checkIsFunctionSupported(functionName),
    checkIsFunctionSupported: checkIsFunctionSupported,
    checkIsFunctionAvailable: checkIsFunctionAvailable
  };
};

/***/ }),

/***/ "./src/hooks/useIsUsingSeedlessAccount.ts":
/*!************************************************!*\
  !*** ./src/hooks/useIsUsingSeedlessAccount.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");




const useIsUsingSeedlessAccount = () => {
  const {
    walletDetails
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_3__.useWalletContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  return walletDetails?.type === _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.Seedless && activeAccount?.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.AccountType.PRIMARY;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useIsUsingSeedlessAccount);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2hvb2tzX3VzZUlzRnVuY3Rpb25BdmFpbGFibGVfdHMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT21CO0FBRVosTUFBTUMsbUJBQW1CLEdBQzlCQyxPQUFpQixJQUNnQkEsT0FBTyxFQUFFQyxJQUFJLEtBQUtILDJEQUFzQjtBQUVwRSxNQUFNSyxzQkFBc0IsR0FDakNILE9BQWlCLElBRWpCQSxPQUFPLEVBQUVDLElBQUksS0FBS0gsK0RBQTBCO0FBRXZDLE1BQU1PLGdCQUFnQixHQUMzQkwsT0FBK0IsSUFDREEsT0FBTyxFQUFFQyxJQUFJLEtBQUtILHdEQUFtQjtBQUU5RCxNQUFNUyxpQkFBaUIsR0FDNUJQLE9BQWlCLElBQ2NRLE9BQU8sQ0FBQ1IsT0FBTyxDQUFDLElBQUksQ0FBQ0ssZ0JBQWdCLENBQUNMLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUN0Qi9FO0FBQ0E7QUFDQTtBQUNlLFNBQVNTLHdCQUF3QkEsQ0FBQ1QsT0FBMkIsRUFBRTtFQUM1RSxPQUFPUSxPQUFPLENBQUNSLE9BQU8sRUFBRVUsVUFBVSxDQUFDO0FBQ3JDOzs7Ozs7Ozs7Ozs7Ozs7O0FDUDJFO0FBRXBFLFNBQVNHLGVBQWVBLENBQUNDLE9BQWlCLEVBQUU7RUFDakQsSUFBSSxDQUFDQSxPQUFPLEVBQUU7SUFDWixPQUFPLEtBQUs7RUFDZDtFQUNBLE9BQU9BLE9BQU8sQ0FBQ0MsTUFBTSxLQUFLSCx1RUFBaUI7QUFDN0M7QUFFTyxTQUFTSyxpQkFBaUJBLENBQUNDLE9BQWUsRUFBRTtFQUNqRCxPQUNFUCx5RUFBbUIsS0FBS08sT0FBTyxJQUFJUCw4RUFBd0IsS0FBS08sT0FBTztBQUUzRTs7Ozs7Ozs7Ozs7Ozs7OztBQ2IyRTtBQUVwRSxTQUFTRyxlQUFlQSxDQUFDUCxPQUFpQixFQUFFO0VBQ2pELElBQUksQ0FBQ0EsT0FBTyxFQUFFO0lBQ1osT0FBTyxLQUFLO0VBQ2Q7RUFDQSxPQUFPQSxPQUFPLENBQUNDLE1BQU0sS0FBS0gsdUVBQWlC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RCxpRUFBZStCLHlCQUF5QiIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy91dGlscy90eXBlR3VhcmRzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9maXJlYmxvY2tzL3V0aWxzL2lzRmlyZWJsb2Nrc0FwaVN1cHBvcnRlZC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZVBjaGFpbk5ldHdvcmsudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNBdmFsYW5jaGVYY2hhaW5OZXR3b3JrLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlSXNGdW5jdGlvbkF2YWlsYWJsZS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUlzVXNpbmdTZWVkbGVzc0FjY291bnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWNjb3VudCxcbiAgQWNjb3VudFR5cGUsXG4gIEZpcmVibG9ja3NBY2NvdW50LFxuICBJbXBvcnRlZEFjY291bnQsXG4gIFByaW1hcnlBY2NvdW50LFxuICBXYWxsZXRDb25uZWN0QWNjb3VudCxcbn0gZnJvbSAnLi4vbW9kZWxzJztcblxuZXhwb3J0IGNvbnN0IGlzRmlyZWJsb2Nrc0FjY291bnQgPSAoXG4gIGFjY291bnQ/OiBBY2NvdW50LFxuKTogYWNjb3VudCBpcyBGaXJlYmxvY2tzQWNjb3VudCA9PiBhY2NvdW50Py50eXBlID09PSBBY2NvdW50VHlwZS5GSVJFQkxPQ0tTO1xuXG5leHBvcnQgY29uc3QgaXNXYWxsZXRDb25uZWN0QWNjb3VudCA9IChcbiAgYWNjb3VudD86IEFjY291bnQsXG4pOiBhY2NvdW50IGlzIFdhbGxldENvbm5lY3RBY2NvdW50ID0+XG4gIGFjY291bnQ/LnR5cGUgPT09IEFjY291bnRUeXBlLldBTExFVF9DT05ORUNUO1xuXG5leHBvcnQgY29uc3QgaXNQcmltYXJ5QWNjb3VudCA9IChcbiAgYWNjb3VudD86IFBpY2s8QWNjb3VudCwgJ3R5cGUnPixcbik6IGFjY291bnQgaXMgUHJpbWFyeUFjY291bnQgPT4gYWNjb3VudD8udHlwZSA9PT0gQWNjb3VudFR5cGUuUFJJTUFSWTtcblxuZXhwb3J0IGNvbnN0IGlzSW1wb3J0ZWRBY2NvdW50ID0gKFxuICBhY2NvdW50PzogQWNjb3VudCxcbik6IGFjY291bnQgaXMgSW1wb3J0ZWRBY2NvdW50ID0+IEJvb2xlYW4oYWNjb3VudCkgJiYgIWlzUHJpbWFyeUFjY291bnQoYWNjb3VudCk7XG4iLCJpbXBvcnQgeyBGaXJlYmxvY2tzQWNjb3VudCB9IGZyb20gJy4uLy4uL2FjY291bnRzL21vZGVscyc7XG5cbi8vIElmIHdlIGhhdmUgdGhlIEJUQyBhZGRyZXNzIGZvciBhIEZpcmVibG9ja3MgYWNjb3VudCwgdGhhdCBtZWFucyB0aGF0IHdlIHdlcmVcbi8vIHByb3ZpZGVkIHRoZSBjb3JyZWN0IEFQSSBjcmVkZW50aWFscyAob3RoZXJ3aXNlIHdlIHdvdWxkbid0IGJlIGFibGUgdG8gZmV0Y2hcbi8vIHRoZSBhZGRyZXNzKS5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzRmlyZWJsb2Nrc0FwaVN1cHBvcnRlZChhY2NvdW50PzogRmlyZWJsb2Nrc0FjY291bnQpIHtcbiAgcmV0dXJuIEJvb2xlYW4oYWNjb3VudD8uYWRkcmVzc0JUQyk7XG59XG4iLCJpbXBvcnQgeyBDaGFpbklkLCBOZXR3b3JrLCBOZXR3b3JrVk1UeXBlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGNoYWluTmV0d29yayhuZXR3b3JrPzogTmV0d29yaykge1xuICBpZiAoIW5ldHdvcmspIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIG5ldHdvcmsudm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLlBWTTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGNoYWluTmV0d29ya0lkKGNoYWluSWQ6IG51bWJlcikge1xuICByZXR1cm4gKFxuICAgIENoYWluSWQuQVZBTEFOQ0hFX1AgPT09IGNoYWluSWQgfHwgQ2hhaW5JZC5BVkFMQU5DSEVfVEVTVF9QID09PSBjaGFpbklkXG4gICk7XG59XG4iLCJpbXBvcnQgeyBDaGFpbklkLCBOZXR3b3JrLCBOZXR3b3JrVk1UeXBlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzWGNoYWluTmV0d29yayhuZXR3b3JrPzogTmV0d29yaykge1xuICBpZiAoIW5ldHdvcmspIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIG5ldHdvcmsudm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkFWTTtcbn1cblxuLy9UT0RPOiBGaXggdGhpcyBvbmNlIHdlIGZpZ3VyZSBvdXQgaG93IHRvIHNlcGFyYXRlIGJldHdlZW4geCBhbmQgcCBjaGFpbiBJRFxuZXhwb3J0IGZ1bmN0aW9uIGlzWGNoYWluTmV0d29ya0lkKGNoYWluSWQ6IG51bWJlcikge1xuICByZXR1cm4gKFxuICAgIENoYWluSWQuQVZBTEFOQ0hFX1ggPT09IGNoYWluSWQgfHwgQ2hhaW5JZC5BVkFMQU5DSEVfVEVTVF9YID09PSBjaGFpbklkXG4gICk7XG59XG4iLCJpbXBvcnQgeyBDaGFpbklkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcbmltcG9ydCB7XG4gIGlzRmlyZWJsb2Nrc0FjY291bnQsXG4gIGlzV2FsbGV0Q29ubmVjdEFjY291bnQsXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy91dGlscy90eXBlR3VhcmRzJztcbmltcG9ydCB7IEZlYXR1cmVHYXRlcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9mZWF0dXJlRmxhZ3MvbW9kZWxzJztcbmltcG9ydCBpc0ZpcmVibG9ja3NBcGlTdXBwb3J0ZWQgZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2ZpcmVibG9ja3MvdXRpbHMvaXNGaXJlYmxvY2tzQXBpU3VwcG9ydGVkJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB1c2VJc1VzaW5nU2VlZGxlc3NBY2NvdW50IGZyb20gJy4vdXNlSXNVc2luZ1NlZWRsZXNzQWNjb3VudCc7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIGlzUGNoYWluTmV0d29yayxcbiAgaXNQY2hhaW5OZXR3b3JrSWQsXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzQXZhbGFuY2hlUGNoYWluTmV0d29yayc7XG5pbXBvcnQge1xuICBpc1hjaGFpbk5ldHdvcmssXG4gIGlzWGNoYWluTmV0d29ya0lkLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZVhjaGFpbk5ldHdvcmsnO1xuaW1wb3J0IHsgaXNFdGhlcmV1bU5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0V0aGVyZXVtTmV0d29yayc7XG5pbXBvcnQgeyBpc0F2YWxhbmNoZU5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZU5ldHdvcmsnO1xuXG5leHBvcnQgZW51bSBGdW5jdGlvbk5hbWVzIHtcbiAgQlJJREdFID0gJ0JyaWRnZScsXG4gIEJVWSA9ICdCdXknLFxuICBDT0xMRUNUSUJMRVMgPSAnQ09MTEVDVElCTEVTJyxcbiAgREVGSSA9ICdEZUZpJyxcbiAgRkVBVFVSRSA9ICdGZWF0dXJlJywgLy8gRGVmYXVsdCB3aGVuIGZ1bmN0aW9uIG5hbWUgaXMgdW5rbm93biBvciBub3QgaW5jbHVkZWRcbiAgS0VZU1RPTkUgPSAnS2V5c3RvbmUnLFxuICBNQU5BR0VfVE9LRU4gPSAnTWFuYWdlVG9rZW5zJyxcbiAgTUFOQUdFX0NPTExFQ1RJQkxFUyA9ICdNYW5hZ2VDb2xsZWN0aWJsZXMnLFxuICBSRUNFSVZFID0gJ1JlY2VpdmUnLFxuICBTRU5EID0gJ1NlbmQnLFxuICBTV0FQID0gJ1N3YXAnLFxuICBTSUdOID0gJ1NpZ24nLCAvLyBUaGlzIGlzIGJlaW5nIHVzZWQgIGJ5IGRBcHAgYXBwcm92YWwgcHJvY2Vzc1xuICBUT0tFTl9ERVRBSUxTID0gJ1Rva2VuRGV0YWlscycsXG59XG5cbmNvbnN0IEZlYXR1cmVGbGFnTWFwOiBSZWNvcmQ8c3RyaW5nLCBGZWF0dXJlR2F0ZXM+ID0ge1xuICBbRnVuY3Rpb25OYW1lcy5CUklER0VdOiBGZWF0dXJlR2F0ZXMuQlJJREdFLFxuICBbRnVuY3Rpb25OYW1lcy5CVVldOiBGZWF0dXJlR2F0ZXMuQlVZLFxuICBbRnVuY3Rpb25OYW1lcy5ERUZJXTogRmVhdHVyZUdhdGVzLkRFRkksXG4gIFtGdW5jdGlvbk5hbWVzLktFWVNUT05FXTogRmVhdHVyZUdhdGVzLktFWVNUT05FLFxuICBbRnVuY3Rpb25OYW1lcy5TRU5EXTogRmVhdHVyZUdhdGVzLlNFTkQsXG4gIFtGdW5jdGlvbk5hbWVzLlNXQVBdOiBGZWF0dXJlR2F0ZXMuU1dBUCxcbn07XG5cbmNvbnN0IGZ1bmN0aW9uUmVxdWlyZVNpZ25pbmcgPSBbXG4gIEZ1bmN0aW9uTmFtZXMuQlJJREdFLFxuICBGdW5jdGlvbk5hbWVzLlNFTkQsXG4gIEZ1bmN0aW9uTmFtZXMuU1dBUCxcbiAgRnVuY3Rpb25OYW1lcy5TSUdOLFxuXTtcblxuLy8gVGhlIGxpc3Qgd2Ugd2FudCB0byBESVNBQkxFIGZlYXR1cmVzIG9uIGNlcnRhaW4gbmV0d29ya3Mgb3IgYWNjb3VudCB0eXBlcyAoYmxhY2tsaXN0KVxudHlwZSBDb21wbGV4Q2hlY2sgPSAoYWN0aXZlTmV0d29yazogQ2hhaW5JZCwgYWN0aXZlQWNjb3VudDogQWNjb3VudCkgPT4gYm9vbGVhbjtcbnR5cGUgQmxhY2tsaXN0Q29uZmlnID0geyBuZXR3b3JrczogQ2hhaW5JZFtdOyBjb21wbGV4Q2hlY2tzOiBDb21wbGV4Q2hlY2tbXSB9O1xuXG4vLyBEaXNhYmxlcyBnaXZlbiBmZWF0dXJlIG9uIEJUQyBuZXR3b3JrcyB3aGVuOlxuLy8gIC0gYWN0aXZlIGFjY291bnQgaGFzIG5vIEJUQyBhZGRyZXNzXG4vLyAgLSBhY3RpdmUgYWNjb3VudCBpcyBpbXBvcnRlZCB0aHJvdWdoIFdhbGxldENvbm5lY3QgKG5vIEJpdGNvaW4gc3VwcG9ydClcbi8vICAtIGFjdGl2ZSBhY2NvdW50IGlzIGltcG9ydGVkIGZyb20gRmlyZWJsb2NrcyB3aXRob3V0IEJUQyBzdXBwb3J0XG5jb25zdCBkaXNhYmxlRm9yQWNjb3VudHNXaXRob3V0QnRjU3VwcG9ydCA9IChcbiAgY2hhaW46IENoYWluSWQsXG4gIGFjY291bnQ6IEFjY291bnQsXG4pID0+IHtcbiAgY29uc3QgaXNCdGMgPSBbQ2hhaW5JZC5CSVRDT0lOLCBDaGFpbklkLkJJVENPSU5fVEVTVE5FVF0uaW5jbHVkZXMoY2hhaW4pO1xuXG4gIGlmICghaXNCdGMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBoYXNCdGNBZGRyZXNzID0gQm9vbGVhbihhY2NvdW50LmFkZHJlc3NCVEMpO1xuXG4gIHJldHVybiAoXG4gICAgIWhhc0J0Y0FkZHJlc3MgfHxcbiAgICBpc1dhbGxldENvbm5lY3RBY2NvdW50KGFjY291bnQpIHx8XG4gICAgKGlzRmlyZWJsb2Nrc0FjY291bnQoYWNjb3VudCkgJiYgIWlzRmlyZWJsb2Nrc0FwaVN1cHBvcnRlZChhY2NvdW50KSlcbiAgKTtcbn07XG5cbi8vIERpc2FibGVzIGdpdmVuIGZlYXR1cmUgb24gUFZNIG5ldHdvcmsgd2hlbjpcbi8vICAtIGFjdGl2ZSBhY2NvdW50IGhhcyBubyBYUCBhZGRyZXNzXG4vLyAgLSBhY3RpdmUgYWNjb3VudCBpcyBpbXBvcnRlZCB0aHJvdWdoIFdhbGxldENvbm5lY3QgKG5vIFhQIHN1cHBvcnQpXG4vLyAgLSBhY3RpdmUgYWNjb3VudCBpcyBpbXBvcnRlZCBmcm9tIEZpcmVibG9ja3NcbmNvbnN0IGRpc2FibGVGb3JBY2NvdW50c1dpdGhvdXRYUFN1cHBvcnQgPSAoXG4gIGNoYWluOiBDaGFpbklkLFxuICBhY2NvdW50OiBBY2NvdW50LFxuKSA9PiB7XG4gIGNvbnN0IGlzUENoYWluID0gaXNQY2hhaW5OZXR3b3JrSWQoY2hhaW4pO1xuICBjb25zdCBpc1hDaGFpbiA9IGlzWGNoYWluTmV0d29ya0lkKGNoYWluKTtcblxuICBpZiAoIWlzUENoYWluICYmICFpc1hDaGFpbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGhhc1BBZGRyZXNzID0gQm9vbGVhbihhY2NvdW50LmFkZHJlc3NQVk0pO1xuICBjb25zdCBoYXNYQWRkcmVzcyA9IEJvb2xlYW4oYWNjb3VudC5hZGRyZXNzQVZNKTtcblxuICByZXR1cm4gKFxuICAgIChpc1BDaGFpbiAmJiAhaGFzUEFkZHJlc3MpIHx8XG4gICAgKGlzWENoYWluICYmICFoYXNYQWRkcmVzcykgfHxcbiAgICBpc1dhbGxldENvbm5lY3RBY2NvdW50KGFjY291bnQpIHx8XG4gICAgaXNGaXJlYmxvY2tzQWNjb3VudChhY2NvdW50KVxuICApO1xufTtcblxuY29uc3QgZGlzYWJsZWRGZWF0dXJlczogUmVjb3JkPHN0cmluZywgQmxhY2tsaXN0Q29uZmlnPiA9IHtcbiAgTWFuYWdlVG9rZW5zOiB7XG4gICAgbmV0d29ya3M6IFtcbiAgICAgIENoYWluSWQuQklUQ09JTixcbiAgICAgIENoYWluSWQuQVZBTEFOQ0hFX1AsXG4gICAgICBDaGFpbklkLkFWQUxBTkNIRV9URVNUX1AsXG4gICAgICBDaGFpbklkLkFWQUxBTkNIRV9YLFxuICAgICAgQ2hhaW5JZC5BVkFMQU5DSEVfVEVTVF9YLFxuICAgIF0sXG4gICAgY29tcGxleENoZWNrczogW10sXG4gIH0sXG4gIE1hbmFnZUNvbGxlY3RpYmxlczoge1xuICAgIG5ldHdvcmtzOiBbXG4gICAgICBDaGFpbklkLkJJVENPSU4sXG4gICAgICBDaGFpbklkLkFWQUxBTkNIRV9QLFxuICAgICAgQ2hhaW5JZC5BVkFMQU5DSEVfVEVTVF9QLFxuICAgICAgQ2hhaW5JZC5BVkFMQU5DSEVfWCxcbiAgICAgIENoYWluSWQuQVZBTEFOQ0hFX1RFU1RfWCxcbiAgICBdLFxuICAgIGNvbXBsZXhDaGVja3M6IFtdLFxuICB9LFxuICBSZWNlaXZlOiB7XG4gICAgbmV0d29ya3M6IFtdLFxuICAgIGNvbXBsZXhDaGVja3M6IFtcbiAgICAgIGRpc2FibGVGb3JBY2NvdW50c1dpdGhvdXRCdGNTdXBwb3J0LFxuICAgICAgZGlzYWJsZUZvckFjY291bnRzV2l0aG91dFhQU3VwcG9ydCxcbiAgICBdLFxuICB9LFxuICBTZW5kOiB7XG4gICAgbmV0d29ya3M6IFtdLFxuICAgIGNvbXBsZXhDaGVja3M6IFtcbiAgICAgIGRpc2FibGVGb3JBY2NvdW50c1dpdGhvdXRCdGNTdXBwb3J0LFxuICAgICAgZGlzYWJsZUZvckFjY291bnRzV2l0aG91dFhQU3VwcG9ydCxcbiAgICBdLFxuICB9LFxuICBCcmlkZ2U6IHtcbiAgICBuZXR3b3JrczogW1xuICAgICAgQ2hhaW5JZC5BVkFMQU5DSEVfUCxcbiAgICAgIENoYWluSWQuQVZBTEFOQ0hFX1RFU1RfUCxcbiAgICAgIENoYWluSWQuQVZBTEFOQ0hFX1gsXG4gICAgICBDaGFpbklkLkFWQUxBTkNIRV9URVNUX1gsXG4gICAgICBDaGFpbklkLkRGSyxcbiAgICAgIENoYWluSWQuREZLX1RFU1RORVQsXG4gICAgICBDaGFpbklkLlNXSU1NRVIsXG4gICAgICBDaGFpbklkLlNXSU1NRVJfVEVTVE5FVCxcbiAgICBdLFxuICAgIGNvbXBsZXhDaGVja3M6IFtkaXNhYmxlRm9yQWNjb3VudHNXaXRob3V0QnRjU3VwcG9ydF0sXG4gIH0sXG59O1xuXG4vLyBUaGUgbGlzdCB3ZSB3YW50IHRvIEVOQUJMRSBmZWF0dXJlcyBvbiBjZXJ0YWluIG5ldHdvcmtzICh3aGl0ZWxpc3QpXG5jb25zdCBlbmFibGVkRmVhdHVyZXMgPSB7XG4gIENPTExFQ1RJQkxFUzogW1xuICAgIENoYWluSWQuQVZBTEFOQ0hFX01BSU5ORVRfSUQsXG4gICAgQ2hhaW5JZC5BVkFMQU5DSEVfVEVTVE5FVF9JRCxcbiAgICBDaGFpbklkLkVUSEVSRVVNX0hPTUVTVEVBRCxcbiAgICBDaGFpbklkLlNPTEFOQV9NQUlOTkVUX0lELFxuICAgIENoYWluSWQuU09MQU5BX0RFVk5FVF9JRCxcbiAgXSxcbiAgU3dhcDogW0NoYWluSWQuQVZBTEFOQ0hFX01BSU5ORVRfSUQsIENoYWluSWQuRVRIRVJFVU1fSE9NRVNURUFEXSxcbiAgQnV5OiBbQ2hhaW5JZC5BVkFMQU5DSEVfTUFJTk5FVF9JRCwgQ2hhaW5JZC5BVkFMQU5DSEVfVEVTVE5FVF9JRF0sXG59O1xuXG4vKipcbiAqIGlzRnVuY3Rpb25BdmFpbGFibGU6XG4gKiBUaGlzIGlzIGNoZWNraW5nIGZlYXR1cmUgZmxhZ3MgdG8gc2VlIGlmIGEgc3BlY2lmaWMgZmVhdHVyZSBpcyBjdXJyZW50bHkgYXZhaWxhYmxlLlxuICogQWxzbyBpdCBjaGVja3MgaWYgc2VlZGxlc3Mgc2lnbmluZyBpcyBhdmFpbGFibGUgaWYgdGhlIGFjY291bnQgaXMgc2VlZGxlc3MuXG4gKlxuICogaXNGdW5jdGlvblN1cHBvcnRlZDpcbiAqIFRoaXMgaXMgY2hlY2tpbmcgaWYgdGhlIGZ1bmN0aW9uIGlzIHN1cHBvcnRlZCBvbiB0aGUgYWN0aXZlIG5ldHdvcmsuXG4gKi9cbmludGVyZmFjZSBGdW5jdGlvbklzQXZhaWxhYmxlIHtcbiAgaXNGdW5jdGlvbkF2YWlsYWJsZTogYm9vbGVhbjtcbiAgaXNGdW5jdGlvblN1cHBvcnRlZDogYm9vbGVhbjtcbiAgaXNSZWFkeTogYm9vbGVhbjtcbiAgY2hlY2tJc0Z1bmN0aW9uU3VwcG9ydGVkOiAoZnVuY3Rpb25OYW1lOiBGdW5jdGlvbk5hbWVzKSA9PiBib29sZWFuO1xuICBjaGVja0lzRnVuY3Rpb25BdmFpbGFibGU6IChmdW5jdGlvbk5hbWU6IEZ1bmN0aW9uTmFtZXMpID0+IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlID0gKFxuICBmdW5jdGlvbk5hbWU/OiBGdW5jdGlvbk5hbWVzLFxuKTogRnVuY3Rpb25Jc0F2YWlsYWJsZSA9PiB7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgaXNVc2luZ1NlZWRsZXNzQWNjb3VudCA9IHVzZUlzVXNpbmdTZWVkbGVzc0FjY291bnQoKTtcbiAgY29uc3QgeyBmZWF0dXJlRmxhZ3MgfSA9IHVzZUZlYXR1cmVGbGFnQ29udGV4dCgpO1xuXG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmUgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCBpc1JlYWR5ID0gQm9vbGVhbihuZXR3b3JrICYmIGFjdGl2ZSk7XG5cbiAgY29uc3QgY2hlY2tJc0Z1bmN0aW9uQXZhaWxhYmxlID0gKGZ1bmN0aW9uVG9DaGVjazogRnVuY3Rpb25OYW1lcykgPT4ge1xuICAgIGlmIChcbiAgICAgIGlzVXNpbmdTZWVkbGVzc0FjY291bnQgJiZcbiAgICAgIGZ1bmN0aW9uUmVxdWlyZVNpZ25pbmcuaW5jbHVkZXMoZnVuY3Rpb25Ub0NoZWNrKSAmJlxuICAgICAgIWZlYXR1cmVGbGFnc1tGZWF0dXJlR2F0ZXMuU0VFRExFU1NfU0lHTklOR11cbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGZ1bmN0aW9uVG9DaGVjayA9PT0gRnVuY3Rpb25OYW1lcy5TRU5EKSB7XG4gICAgICBpZiAoaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICAgICEhYWN0aXZlPy5hZGRyZXNzUFZNICYmXG4gICAgICAgICAgICBmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLlNFTkRdICYmXG4gICAgICAgICAgICBmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLlNFTkRfUF9DSEFJTl0sXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGlzWGNoYWluTmV0d29yayhuZXR3b3JrKSkge1xuICAgICAgICByZXR1cm4gQm9vbGVhbihcbiAgICAgICAgICAhIWFjdGl2ZT8uYWRkcmVzc0FWTSAmJlxuICAgICAgICAgICAgZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5TRU5EXSAmJlxuICAgICAgICAgICAgZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5TRU5EX1hfQ0hBSU5dLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmdW5jdGlvblRvQ2hlY2sgPT09IEZ1bmN0aW9uTmFtZXMuU1dBUCkge1xuICAgICAgaWYgKCFuZXR3b3JrIHx8ICFmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLlNXQVBdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlzRXRoZXJldW1OZXR3b3JrKG5ldHdvcmspXG4gICAgICAgID8gZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5TV0FQX0VUSEVSRVVNXVxuICAgICAgICA6IGlzQXZhbGFuY2hlTmV0d29yayhuZXR3b3JrKVxuICAgICAgICAgID8gZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5TV0FQX0NfQ0hBSU5dXG4gICAgICAgICAgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBmZWF0dXJlRmxhZ1RvQ2hlY2sgPSBGZWF0dXJlRmxhZ01hcFtmdW5jdGlvblRvQ2hlY2tdO1xuXG4gICAgcmV0dXJuIGZlYXR1cmVGbGFnVG9DaGVjayA/IGZlYXR1cmVGbGFnc1tmZWF0dXJlRmxhZ1RvQ2hlY2tdIDogdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBjaGVja0lzRnVuY3Rpb25TdXBwb3J0ZWQgPSAobmFtZTogRnVuY3Rpb25OYW1lcykgPT4ge1xuICAgIGlmICghbmV0d29yayB8fCAhYWN0aXZlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9UaGUgYXZhbGFuY2hlIExlZGdlciBhcHAgZG9lc27igJl0IHN1cHJvcnQgc2VuZCBvbiB4L3AgY2hhaW4geWV0XG4gICAgLy9UaGUgYWNjb3VudCB3aXRob3V0IGFkZHJlc3NQVk0gY2Fubm90IHNlbmQgb24gcGNoYWluXG4gICAgY29uc3Qgb25QY2hhaW5XaXRoTm9BY2Nlc3MgPSBpc1BjaGFpbk5ldHdvcmsobmV0d29yaykgJiYgIWFjdGl2ZS5hZGRyZXNzUFZNO1xuXG4gICAgLy9UaGUgYWNjb3VudCB3aXRob3V0IGFkZHJlc3NBVk0gY2Fubm90IHNlbmQgb24geGNoYWluXG4gICAgY29uc3Qgb25YY2hhaW5XaXRoTm9BY2NyZXNzID1cbiAgICAgIGlzWGNoYWluTmV0d29yayhuZXR3b3JrKSAmJiAhYWN0aXZlLmFkZHJlc3NBVk07XG5cbiAgICBpZiAoXG4gICAgICBuYW1lID09PSBGdW5jdGlvbk5hbWVzLlNFTkQgJiZcbiAgICAgIChvblBjaGFpbldpdGhOb0FjY2VzcyB8fCBvblhjaGFpbldpdGhOb0FjY3Jlc3MpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIHdoaXRlbGlzdFxuICAgIGlmIChcbiAgICAgIGVuYWJsZWRGZWF0dXJlc1tuYW1lXSAmJlxuICAgICAgIWVuYWJsZWRGZWF0dXJlc1tuYW1lXS5pbmNsdWRlcyhuZXR3b3JrLmNoYWluSWQpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIGJsYWNrbGlzdFxuICAgIGNvbnN0IGJsYWNrbGlzdCA9IGRpc2FibGVkRmVhdHVyZXNbbmFtZV07XG5cbiAgICBpZiAoYmxhY2tsaXN0KSB7XG4gICAgICBjb25zdCBibGFja2xpc3RlZEZvck5ldHdvcmsgPSBibGFja2xpc3QubmV0d29ya3MuaW5jbHVkZXMoXG4gICAgICAgIG5ldHdvcmsuY2hhaW5JZCxcbiAgICAgICk7XG4gICAgICBjb25zdCBibGFja2xpc3RlZEZvck90aGVyUmVhc29ucyA9IGJsYWNrbGlzdC5jb21wbGV4Q2hlY2tzLnNvbWUoKGNoZWNrKSA9PlxuICAgICAgICBjaGVjayhuZXR3b3JrLmNoYWluSWQsIGFjdGl2ZSksXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gIWJsYWNrbGlzdGVkRm9yTmV0d29yayAmJiAhYmxhY2tsaXN0ZWRGb3JPdGhlclJlYXNvbnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgaWYgKCFuZXR3b3JrIHx8ICFhY3RpdmUgfHwgIWZ1bmN0aW9uTmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICBpc1JlYWR5LFxuICAgICAgaXNGdW5jdGlvbkF2YWlsYWJsZTogZmFsc2UsXG4gICAgICBpc0Z1bmN0aW9uU3VwcG9ydGVkOiBmYWxzZSxcbiAgICAgIGNoZWNrSXNGdW5jdGlvblN1cHBvcnRlZDogY2hlY2tJc0Z1bmN0aW9uU3VwcG9ydGVkLFxuICAgICAgY2hlY2tJc0Z1bmN0aW9uQXZhaWxhYmxlOiBjaGVja0lzRnVuY3Rpb25BdmFpbGFibGUsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaXNSZWFkeSxcbiAgICBpc0Z1bmN0aW9uQXZhaWxhYmxlOiBjaGVja0lzRnVuY3Rpb25BdmFpbGFibGUoXG4gICAgICBmdW5jdGlvbk5hbWUgPz8gRnVuY3Rpb25OYW1lcy5GRUFUVVJFLFxuICAgICksXG4gICAgaXNGdW5jdGlvblN1cHBvcnRlZDogY2hlY2tJc0Z1bmN0aW9uU3VwcG9ydGVkKGZ1bmN0aW9uTmFtZSksXG4gICAgY2hlY2tJc0Z1bmN0aW9uU3VwcG9ydGVkOiBjaGVja0lzRnVuY3Rpb25TdXBwb3J0ZWQsXG4gICAgY2hlY2tJc0Z1bmN0aW9uQXZhaWxhYmxlOiBjaGVja0lzRnVuY3Rpb25BdmFpbGFibGUsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgQWNjb3VudFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcbmltcG9ydCB7IFNlY3JldFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VjcmV0cy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZVdhbGxldENvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1dhbGxldFByb3ZpZGVyJztcblxuY29uc3QgdXNlSXNVc2luZ1NlZWRsZXNzQWNjb3VudCA9ICgpID0+IHtcbiAgY29uc3QgeyB3YWxsZXREZXRhaWxzIH0gPSB1c2VXYWxsZXRDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuXG4gIHJldHVybiAoXG4gICAgd2FsbGV0RGV0YWlscz8udHlwZSA9PT0gU2VjcmV0VHlwZS5TZWVkbGVzcyAmJlxuICAgIGFjdGl2ZUFjY291bnQ/LnR5cGUgPT09IEFjY291bnRUeXBlLlBSSU1BUllcbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUlzVXNpbmdTZWVkbGVzc0FjY291bnQ7XG4iXSwibmFtZXMiOlsiQWNjb3VudFR5cGUiLCJpc0ZpcmVibG9ja3NBY2NvdW50IiwiYWNjb3VudCIsInR5cGUiLCJGSVJFQkxPQ0tTIiwiaXNXYWxsZXRDb25uZWN0QWNjb3VudCIsIldBTExFVF9DT05ORUNUIiwiaXNQcmltYXJ5QWNjb3VudCIsIlBSSU1BUlkiLCJpc0ltcG9ydGVkQWNjb3VudCIsIkJvb2xlYW4iLCJpc0ZpcmVibG9ja3NBcGlTdXBwb3J0ZWQiLCJhZGRyZXNzQlRDIiwiQ2hhaW5JZCIsIk5ldHdvcmtWTVR5cGUiLCJpc1BjaGFpbk5ldHdvcmsiLCJuZXR3b3JrIiwidm1OYW1lIiwiUFZNIiwiaXNQY2hhaW5OZXR3b3JrSWQiLCJjaGFpbklkIiwiQVZBTEFOQ0hFX1AiLCJBVkFMQU5DSEVfVEVTVF9QIiwiaXNYY2hhaW5OZXR3b3JrIiwiQVZNIiwiaXNYY2hhaW5OZXR3b3JrSWQiLCJBVkFMQU5DSEVfWCIsIkFWQUxBTkNIRV9URVNUX1giLCJGZWF0dXJlR2F0ZXMiLCJ1c2VBY2NvdW50c0NvbnRleHQiLCJ1c2VOZXR3b3JrQ29udGV4dCIsInVzZUlzVXNpbmdTZWVkbGVzc0FjY291bnQiLCJ1c2VGZWF0dXJlRmxhZ0NvbnRleHQiLCJpc0V0aGVyZXVtTmV0d29yayIsImlzQXZhbGFuY2hlTmV0d29yayIsIkZ1bmN0aW9uTmFtZXMiLCJGZWF0dXJlRmxhZ01hcCIsIkJSSURHRSIsIkJVWSIsIkRFRkkiLCJLRVlTVE9ORSIsIlNFTkQiLCJTV0FQIiwiZnVuY3Rpb25SZXF1aXJlU2lnbmluZyIsIlNJR04iLCJkaXNhYmxlRm9yQWNjb3VudHNXaXRob3V0QnRjU3VwcG9ydCIsImNoYWluIiwiaXNCdGMiLCJCSVRDT0lOIiwiQklUQ09JTl9URVNUTkVUIiwiaW5jbHVkZXMiLCJoYXNCdGNBZGRyZXNzIiwiZGlzYWJsZUZvckFjY291bnRzV2l0aG91dFhQU3VwcG9ydCIsImlzUENoYWluIiwiaXNYQ2hhaW4iLCJoYXNQQWRkcmVzcyIsImFkZHJlc3NQVk0iLCJoYXNYQWRkcmVzcyIsImFkZHJlc3NBVk0iLCJkaXNhYmxlZEZlYXR1cmVzIiwiTWFuYWdlVG9rZW5zIiwibmV0d29ya3MiLCJjb21wbGV4Q2hlY2tzIiwiTWFuYWdlQ29sbGVjdGlibGVzIiwiUmVjZWl2ZSIsIlNlbmQiLCJCcmlkZ2UiLCJERksiLCJERktfVEVTVE5FVCIsIlNXSU1NRVIiLCJTV0lNTUVSX1RFU1RORVQiLCJlbmFibGVkRmVhdHVyZXMiLCJDT0xMRUNUSUJMRVMiLCJBVkFMQU5DSEVfTUFJTk5FVF9JRCIsIkFWQUxBTkNIRV9URVNUTkVUX0lEIiwiRVRIRVJFVU1fSE9NRVNURUFEIiwiU09MQU5BX01BSU5ORVRfSUQiLCJTT0xBTkFfREVWTkVUX0lEIiwiU3dhcCIsIkJ1eSIsInVzZUlzRnVuY3Rpb25BdmFpbGFibGUiLCJmdW5jdGlvbk5hbWUiLCJpc1VzaW5nU2VlZGxlc3NBY2NvdW50IiwiZmVhdHVyZUZsYWdzIiwiYWNjb3VudHMiLCJhY3RpdmUiLCJpc1JlYWR5IiwiY2hlY2tJc0Z1bmN0aW9uQXZhaWxhYmxlIiwiZnVuY3Rpb25Ub0NoZWNrIiwiU0VFRExFU1NfU0lHTklORyIsIlNFTkRfUF9DSEFJTiIsIlNFTkRfWF9DSEFJTiIsIlNXQVBfRVRIRVJFVU0iLCJTV0FQX0NfQ0hBSU4iLCJmZWF0dXJlRmxhZ1RvQ2hlY2siLCJjaGVja0lzRnVuY3Rpb25TdXBwb3J0ZWQiLCJuYW1lIiwib25QY2hhaW5XaXRoTm9BY2Nlc3MiLCJvblhjaGFpbldpdGhOb0FjY3Jlc3MiLCJibGFja2xpc3QiLCJibGFja2xpc3RlZEZvck5ldHdvcmsiLCJibGFja2xpc3RlZEZvck90aGVyUmVhc29ucyIsInNvbWUiLCJjaGVjayIsImlzRnVuY3Rpb25BdmFpbGFibGUiLCJpc0Z1bmN0aW9uU3VwcG9ydGVkIiwiRkVBVFVSRSIsIlNlY3JldFR5cGUiLCJ1c2VXYWxsZXRDb250ZXh0Iiwid2FsbGV0RGV0YWlscyIsImFjdGl2ZUFjY291bnQiLCJTZWVkbGVzcyJdLCJzb3VyY2VSb290IjoiIn0=