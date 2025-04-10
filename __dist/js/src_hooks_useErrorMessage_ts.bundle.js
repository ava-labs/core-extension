(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_hooks_useErrorMessage_ts"],{

/***/ "./src/background/services/fireblocks/models.ts":
/*!******************************************************!*\
  !*** ./src/background/services/fireblocks/models.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BTC_ACCESS_ERROR_PREFIX": () => (/* binding */ BTC_ACCESS_ERROR_PREFIX),
/* harmony export */   "FIREBLOCKS_REQUEST_EXPIRY": () => (/* binding */ FIREBLOCKS_REQUEST_EXPIRY),
/* harmony export */   "FireblocksBtcAccessError": () => (/* binding */ FireblocksBtcAccessError),
/* harmony export */   "FireblocksBtcAccessErrorCode": () => (/* binding */ FireblocksBtcAccessErrorCode),
/* harmony export */   "FireblocksErrorCode": () => (/* binding */ FireblocksErrorCode),
/* harmony export */   "MAINNET_LOOKUP_ASSETS": () => (/* binding */ MAINNET_LOOKUP_ASSETS),
/* harmony export */   "TESTNET_LOOKUP_ASSETS": () => (/* binding */ TESTNET_LOOKUP_ASSETS),
/* harmony export */   "TRANSACTION_POLLING_INTERVAL_MS": () => (/* binding */ TRANSACTION_POLLING_INTERVAL_MS),
/* harmony export */   "TX_SUBMISSION_FAILURE_STATUSES": () => (/* binding */ TX_SUBMISSION_FAILURE_STATUSES)
/* harmony export */ });
/* harmony import */ var fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fireblocks-sdk */ "./node_modules/fireblocks-sdk/dist/src/fireblocks-sdk.js");
/* harmony import */ var fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__);

const TRANSACTION_POLLING_INTERVAL_MS = 2000;
const TX_SUBMISSION_FAILURE_STATUSES = [fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.BLOCKED, fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.CANCELLED, fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.CANCELLING, fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.TIMEOUT, fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.FAILED, fireblocks_sdk__WEBPACK_IMPORTED_MODULE_0__.TransactionStatus.REJECTED];
const BTC_ACCESS_ERROR_PREFIX = `FireblocksBtcAccessError:`;
let FireblocksBtcAccessErrorCode = /*#__PURE__*/function (FireblocksBtcAccessErrorCode) {
  FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["VaultAccountNotFound"] = 0] = "VaultAccountNotFound";
  FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["BTCAddressNotFound"] = 1] = "BTCAddressNotFound";
  FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["InvalidSecretKey"] = 2] = "InvalidSecretKey";
  FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["WrongAccountType"] = 3] = "WrongAccountType";
  FireblocksBtcAccessErrorCode[FireblocksBtcAccessErrorCode["SecretsNotConfigured"] = 4] = "SecretsNotConfigured";
  return FireblocksBtcAccessErrorCode;
}({});
class FireblocksBtcAccessError extends Error {
  constructor(code) {
    super(`${BTC_ACCESS_ERROR_PREFIX}${code}`);
    this.code = code;
  }
}
let FireblocksErrorCode = /*#__PURE__*/function (FireblocksErrorCode) {
  FireblocksErrorCode["Failed"] = "fireblocks-tx-failed";
  FireblocksErrorCode["Blocked"] = "fireblocks-tx-blocked";
  FireblocksErrorCode["Cancelled"] = "fireblocks-tx-cancelled";
  FireblocksErrorCode["Rejected"] = "fireblocks-tx-rejected";
  FireblocksErrorCode["Timeout"] = "fireblocks-tx-timeout";
  FireblocksErrorCode["Unknown"] = "fireblocks-tx-unknown-error";
  return FireblocksErrorCode;
}({});

// On Testnet Fireblocks workspaces, we require the connected vault to have one of those wallets created.
const TESTNET_LOOKUP_ASSETS = ['AVAXTEST',
// Avalanche Fuji
'ETH_TEST3',
// Ethereum Goerli
'ETH_TEST4',
// Ethereum Rinkeby
'ETH_TEST5' // Ethereum Sepolia
];

// On Mainnet Fireblocks workspaces, we require the connected vault to have one of those wallets created.
// We need such a wallet to be created, so that we can find the vault account used to connect via WalletConnect.
// Knowing the vault account allows us to find the matching BTC address.
const MAINNET_LOOKUP_ASSETS = ['AVAX'];
const FIREBLOCKS_REQUEST_EXPIRY = 120 * 60; // 2 hours, used only by WalletConnect connections

// this is used as a replacement for PaginatedAddressesResponse from fireblocks sdk
// due to wrong type declarations

/***/ }),

/***/ "./src/background/services/wallet/handlers/models.ts":
/*!***********************************************************!*\
  !*** ./src/background/services/wallet/handlers/models.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SeedphraseImportError": () => (/* binding */ SeedphraseImportError)
/* harmony export */ });
let SeedphraseImportError = /*#__PURE__*/function (SeedphraseImportError) {
  SeedphraseImportError["ExistingSeedphrase"] = "existing-seedphrase";
  return SeedphraseImportError;
}({});

/***/ }),

/***/ "./src/hooks/useErrorMessage.ts":
/*!**************************************!*\
  !*** ./src/hooks/useErrorMessage.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useErrorMessage": () => (/* binding */ useErrorMessage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! eth-rpc-errors */ "./node_modules/eth-rpc-errors/dist/index.js");
/* harmony import */ var _src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/fireblocks/models */ "./src/background/services/fireblocks/models.ts");
/* harmony import */ var _src_utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/errors */ "./src/utils/errors/index.ts");
/* harmony import */ var _src_background_services_unifiedBridge_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/unifiedBridge/models */ "./src/background/services/unifiedBridge/models.ts");
/* harmony import */ var _src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/keystore/models */ "./src/utils/keystore/models.ts");
/* harmony import */ var _src_background_services_wallet_handlers_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/wallet/handlers/models */ "./src/background/services/wallet/handlers/models.ts");
/* harmony import */ var _src_contexts_SwapProvider_models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/SwapProvider/models */ "./src/contexts/SwapProvider/models.ts");









const useErrorMessage = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_8__.useTranslation)();
  const fireblocksErrors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const fireblocksHint = t('Please refer to Active Transfers list in your Fireblocks Console for a detailed explanation.');
    return {
      [_src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_2__.FireblocksErrorCode.Blocked]: {
        title: t('Transaction has been blocked'),
        hint: fireblocksHint
      },
      [_src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_2__.FireblocksErrorCode.Failed]: {
        title: t('Transaction has failed'),
        hint: fireblocksHint
      },
      [_src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_2__.FireblocksErrorCode.Rejected]: {
        title: t('Transaction has been rejected'),
        hint: fireblocksHint
      },
      [_src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_2__.FireblocksErrorCode.Cancelled]: {
        title: t('Transaction has been cancelled'),
        hint: fireblocksHint
      },
      [_src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_2__.FireblocksErrorCode.Timeout]: {
        title: t('Transaction timed out'),
        hint: fireblocksHint
      },
      [_src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_2__.FireblocksErrorCode.Unknown]: {
        title: t('Unknown transaction error'),
        hint: t('Please try again later or contact support.')
      }
    };
  }, [t]);

  // These messages will serve as generic fallbacks in case data.reason
  // is not specified in the returned error.
  const standardRpcErrors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    [eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.errorCodes.rpc.internal]: {
      title: t('Internal error')
    },
    [eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.errorCodes.rpc.transactionRejected]: {
      title: t('Transaction rejected')
    },
    [eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.errorCodes.rpc.invalidRequest]: {
      title: t('Invalid request')
    },
    [eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.errorCodes.rpc.invalidParams]: {
      title: t('Invalid params')
    },
    [eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.errorCodes.rpc.limitExceeded]: {
      title: t('Limit exceeded')
    },
    [eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.errorCodes.rpc.resourceUnavailable]: {
      title: t('Resource unavailable')
    },
    [eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.errorCodes.provider.disconnected]: {
      title: t('Disconnected')
    },
    [eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.errorCodes.provider.unauthorized]: {
      title: t('Unauthorized')
    },
    [eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.errorCodes.provider.userRejectedRequest]: {
      title: t('User rejected the request')
    }
  }), [t]);
  const unifiedBridgeErrors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    [_src_background_services_unifiedBridge_models__WEBPACK_IMPORTED_MODULE_4__.UnifiedBridgeError.AmountLessThanFee]: {
      title: t('Amount is too low'),
      hint: t('The amount cannot be lower than the bridging fee')
    },
    [_src_background_services_unifiedBridge_models__WEBPACK_IMPORTED_MODULE_4__.UnifiedBridgeError.InvalidTxPayload]: {
      title: t('Invalid transaction data')
    },
    [_src_background_services_unifiedBridge_models__WEBPACK_IMPORTED_MODULE_4__.UnifiedBridgeError.InvalidFee]: {
      title: t('The bridging fee is unknown')
    },
    [_src_background_services_unifiedBridge_models__WEBPACK_IMPORTED_MODULE_4__.UnifiedBridgeError.UnknownAsset]: {
      title: t('This asset cannot be bridged')
    },
    [_src_background_services_unifiedBridge_models__WEBPACK_IMPORTED_MODULE_4__.UnifiedBridgeError.UnsupportedNetwork]: {
      title: t('Unsupported network')
    },
    [_src_background_services_unifiedBridge_models__WEBPACK_IMPORTED_MODULE_4__.UnifiedBridgeError.NonBitcoinAccount]: {
      title: t('Unsupported account'),
      hint: t(`The active account does not support Bitcoin.`)
    }
  }), [t]);
  const swapErrors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    [_src_contexts_SwapProvider_models__WEBPACK_IMPORTED_MODULE_7__.SwapErrorCode.ClientNotInitialized]: {
      title: t('Swap client is not initialized'),
      hint: t('Please try switching to a different network.')
    },
    [_src_contexts_SwapProvider_models__WEBPACK_IMPORTED_MODULE_7__.SwapErrorCode.ApiError]: {
      title: t('There was an error contacting our pricing provider.'),
      hint: t('Please try again later.')
    },
    [_src_contexts_SwapProvider_models__WEBPACK_IMPORTED_MODULE_7__.SwapErrorCode.CannotBuildTx]: {
      title: t('Pricing provider did not respond with a valid transaction.'),
      hint: t('Please try again later.')
    },
    [_src_contexts_SwapProvider_models__WEBPACK_IMPORTED_MODULE_7__.SwapErrorCode.CannotFetchAllowance]: {
      title: t('There was an error fetching your spend approvals.'),
      hint: t('Try swapping a different token or try again later.')
    },
    [_src_contexts_SwapProvider_models__WEBPACK_IMPORTED_MODULE_7__.SwapErrorCode.MissingContractMethod]: {
      title: t('This token contract is missing a required method.'),
      hint: t('Try swapping a different token.')
    },
    [_src_contexts_SwapProvider_models__WEBPACK_IMPORTED_MODULE_7__.SwapErrorCode.MissingParams]: {
      title: t('Some of the required parameters are missing.'),
      hint: t('Our team was made aware of this issue. Feel free to contact us for further information.')
    },
    [_src_contexts_SwapProvider_models__WEBPACK_IMPORTED_MODULE_7__.SwapErrorCode.UnexpectedApiResponse]: {
      title: t('Unexpected response from our pricing provider.'),
      hint: t('Please try again later.')
    },
    [_src_contexts_SwapProvider_models__WEBPACK_IMPORTED_MODULE_7__.SwapErrorCode.UnknownSpender]: {
      title: t('Unexpected response from our pricing provider.'),
      hint: t('Please try again later.')
    }
  }), [t]);
  const commonErrors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.Unknown]: {
      title: t('Unknown error')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.UserRejected]: {
      title: t('User declined the transaction')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.UnsupportedTokenType]: {
      title: t('Unsupported token type'),
      hint: t('Sending this type of token is not supported by Core')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.NetworkError]: {
      title: t('Network error'),
      hint: t('Please check your connection and try again.')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.NoActiveAccount]: {
      title: t('No account is active'),
      hint: t('Please try again')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.NoActiveNetwork]: {
      title: t('No active network'),
      hint: t('Please try again')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.UnknownNetwork]: {
      title: t('Unknown network')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.UnknownNetworkFee]: {
      title: t('Unknown network fee')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.RequestTimeout]: {
      title: t('Request timed out'),
      hint: t('This is taking longer than expected. Please try again later.')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.ModuleManagerNotSet]: {
      title: t('Internal error occurred.') // Do not leak implementation details to the UI
    },

    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.MigrationFailed]: {
      title: t('Storage update failed')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.UnableToSign]: {
      title: t('Unable to sign or broadcast transaction')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.UnableToEstimateGas]: {
      title: t('Unable to estimate gas')
    }
  }), [t]);
  const secretErrors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.MissingExtendedPublicKey]: {
      title: t('Extended public key not found')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.NoAccountIndex]: {
      title: t('No account index was provided')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.PublicKeyNotFound]: {
      title: t('Public key not found')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.SecretsNotFound]: {
      title: t('Wallet secrets not found for the requested ID')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.WalletAlreadyExists]: {
      title: t('This wallet is already imported')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.DerivationPathMissing]: {
      title: t('Attempted to use an unknown derivation path')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.DerivationPathTooShort]: {
      title: t('Error while deriving address'),
      hint: t('Requested derivation path is too short')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.UnsupportedSecretType]: {
      title: t('Error while deriving address'),
      hint: t('Unsupporetd secret type')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.UnsupportedCurve]: {
      title: t('Error while deriving address'),
      hint: t('Unsupported elliptic curve')
    },
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.SecretsError.UnknownDerivationPathFormat]: {
      title: t('Error while deriving address'),
      hint: t('Unsupported derivation path format')
    }
  }), [t]);
  const rpcErrors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    [_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.RpcErrorCode.InsufficientFunds]: {
      title: t('Insufficient funds'),
      hint: t('You do not have enough funds to cover the network fees.')
    }
  }), [t]);
  const keystoreErrors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    [_src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_5__.KeystoreError.InvalidPassword]: {
      title: t('Invalid password. Please try again.')
    },
    [_src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_5__.KeystoreError.InvalidVersion]: {
      title: t('Unsupported Version'),
      hint: t('Only keystore files exported from the Avalanche Wallet are supported.')
    },
    [_src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_5__.KeystoreError.NoNewWallets]: {
      title: t('No New Wallets Found'),
      hint: t('All keys contained in this file are already imported.')
    },
    [_src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_5__.KeystoreError.Unknown]: {
      title: t('File Upload Failed'),
      hint: t('Please contact our support team to resolve this issue.')
    }
  }), [t]);
  const seedphraseImportError = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    [_src_background_services_wallet_handlers_models__WEBPACK_IMPORTED_MODULE_6__.SeedphraseImportError.ExistingSeedphrase]: {
      title: t('This recovery phrase is already imported.')
    }
  }), [t]);
  const messages = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    ...fireblocksErrors,
    ...unifiedBridgeErrors,
    ...commonErrors,
    ...standardRpcErrors,
    ...keystoreErrors,
    ...seedphraseImportError,
    ...rpcErrors,
    ...secretErrors,
    ...swapErrors
  }), [fireblocksErrors, unifiedBridgeErrors, commonErrors, standardRpcErrors, keystoreErrors, seedphraseImportError, rpcErrors, secretErrors, swapErrors]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(error => {
    if (typeof error === 'string') {
      return messages[error] ?? {
        title: error
      };
    }
    let message = messages[_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.Unknown];
    if ((0,_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.isWrappedError)(error)) {
      message = messages[error.data.reason] ?? messages[_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.Unknown];
    } else if (typeof error === 'object' && error !== null && 'code' in error && (typeof error.code === 'number' || typeof error.code === 'string')) {
      message = messages[error.code];
    }
    return message ?? messages[_src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.Unknown];
  }, [messages]);
};

/***/ }),

/***/ "./src/utils/keystore/models.ts":
/*!**************************************!*\
  !*** ./src/utils/keystore/models.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeystoreError": () => (/* binding */ KeystoreError)
/* harmony export */ });
// V2 #################################

// V3 #################################
// Underlying encryption changed.
// V4 #################################
// Avalanche uses bech32 addresses. Removed address field from keys and the warning message.
// V5 #################################
// Encodes mnemonic phrase as the key.
// V6 #################################
// Removes pass_hash. Adds activeIndex and a type (mnemonic | singleton) to key
let KeystoreError = /*#__PURE__*/function (KeystoreError) {
  KeystoreError["InvalidPassword"] = "keystore-invalid-password";
  KeystoreError["InvalidVersion"] = "keystore-invalid-version";
  KeystoreError["NoNewWallets"] = "keystore-no-new-wallets";
  KeystoreError["Unknown"] = "keystore-unknown-error";
  return KeystoreError;
}({});

/***/ }),

/***/ "?25ed":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?b1b0":
/*!********************************!*\
  !*** ./util.inspect (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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dFVEOztBQXdCQTtBQUNBO0FBeUJBO0FBQ0E7QUF1QkE7QUFDQTtBQXVCQTtBQUNBO0FBOEJPLElBQUsxRSxhQUFhLDBCQUFiQSxhQUFhO0VBQWJBLGFBQWE7RUFBYkEsYUFBYTtFQUFiQSxhQUFhO0VBQWJBLGFBQWE7RUFBQSxPQUFiQSxhQUFhO0FBQUE7Ozs7Ozs7Ozs7QUMvSXpCOzs7Ozs7Ozs7O0FDQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmlyZWJsb2Nrcy9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3dhbGxldC9oYW5kbGVycy9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VFcnJvck1lc3NhZ2UudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9rZXlzdG9yZS9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi9pZ25vcmVkfC9Vc2Vycy9jc2FiYS52YWx5aS9wcmovY29yZS1leHRlbnNpb24vbm9kZV9tb2R1bGVzL0BzdGFibGVsaWIvcmFuZG9tL2xpYi9zb3VyY2V8Y3J5cHRvIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vaWdub3JlZHwvVXNlcnMvY3NhYmEudmFseWkvcHJqL2NvcmUtZXh0ZW5zaW9uL25vZGVfbW9kdWxlcy9zaWRlLWNoYW5uZWwvbm9kZV9tb2R1bGVzL29iamVjdC1pbnNwZWN0fC4vdXRpbC5pbnNwZWN0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlc3RpbmF0aW9uVHJhbnNmZXJQZWVyUGF0aCwgVHJhbnNhY3Rpb25TdGF0dXMgfSBmcm9tICdmaXJlYmxvY2tzLXNkayc7XG5pbXBvcnQgeyBLZXlMaWtlIH0gZnJvbSAnam9zZSc7XG5pbXBvcnQge1xuICBBZGRyZXNzUmVzcG9uc2UgYXMgX0FkZHJlc3NSZXNwb25zZSxcbiAgUGFnaW5hdGVkQWRkcmVzc2VzUmVzcG9uc2UgYXMgX1BhZ2luYXRlZEFkZHJlc3Nlc1Jlc3BvbnNlLFxufSBmcm9tICdmaXJlYmxvY2tzLXNkayc7XG5cbmV4cG9ydCB0eXBlIEtub3duQWRkcmVzc0RpY3Rpb25hcnkgPSBNYXA8c3RyaW5nLCBEZXN0aW5hdGlvblRyYW5zZmVyUGVlclBhdGg+O1xuXG5leHBvcnQgY29uc3QgVFJBTlNBQ1RJT05fUE9MTElOR19JTlRFUlZBTF9NUyA9IDIwMDA7XG5cbmV4cG9ydCBjb25zdCBUWF9TVUJNSVNTSU9OX0ZBSUxVUkVfU1RBVFVTRVMgPSBbXG4gIFRyYW5zYWN0aW9uU3RhdHVzLkJMT0NLRUQsXG4gIFRyYW5zYWN0aW9uU3RhdHVzLkNBTkNFTExFRCxcbiAgVHJhbnNhY3Rpb25TdGF0dXMuQ0FOQ0VMTElORyxcbiAgVHJhbnNhY3Rpb25TdGF0dXMuVElNRU9VVCxcbiAgVHJhbnNhY3Rpb25TdGF0dXMuRkFJTEVELFxuICBUcmFuc2FjdGlvblN0YXR1cy5SRUpFQ1RFRCxcbl07XG5cbmV4cG9ydCBjb25zdCBCVENfQUNDRVNTX0VSUk9SX1BSRUZJWCA9IGBGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3I6YDtcblxuZXhwb3J0IGVudW0gRmlyZWJsb2Nrc0J0Y0FjY2Vzc0Vycm9yQ29kZSB7XG4gIFZhdWx0QWNjb3VudE5vdEZvdW5kLFxuICBCVENBZGRyZXNzTm90Rm91bmQsXG4gIEludmFsaWRTZWNyZXRLZXksXG4gIFdyb25nQWNjb3VudFR5cGUsXG4gIFNlY3JldHNOb3RDb25maWd1cmVkLFxufVxuXG5leHBvcnQgY2xhc3MgRmlyZWJsb2Nrc0J0Y0FjY2Vzc0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29kZTogRmlyZWJsb2Nrc0J0Y0FjY2Vzc0Vycm9yQ29kZSkge1xuICAgIHN1cGVyKGAke0JUQ19BQ0NFU1NfRVJST1JfUFJFRklYfSR7Y29kZX1gKTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBGaXJlYmxvY2tzRXJyb3JDb2RlIHtcbiAgRmFpbGVkID0gJ2ZpcmVibG9ja3MtdHgtZmFpbGVkJyxcbiAgQmxvY2tlZCA9ICdmaXJlYmxvY2tzLXR4LWJsb2NrZWQnLFxuICBDYW5jZWxsZWQgPSAnZmlyZWJsb2Nrcy10eC1jYW5jZWxsZWQnLFxuICBSZWplY3RlZCA9ICdmaXJlYmxvY2tzLXR4LXJlamVjdGVkJyxcbiAgVGltZW91dCA9ICdmaXJlYmxvY2tzLXR4LXRpbWVvdXQnLFxuICBVbmtub3duID0gJ2ZpcmVibG9ja3MtdHgtdW5rbm93bi1lcnJvcicsXG59XG5cbi8vIE9uIFRlc3RuZXQgRmlyZWJsb2NrcyB3b3Jrc3BhY2VzLCB3ZSByZXF1aXJlIHRoZSBjb25uZWN0ZWQgdmF1bHQgdG8gaGF2ZSBvbmUgb2YgdGhvc2Ugd2FsbGV0cyBjcmVhdGVkLlxuZXhwb3J0IGNvbnN0IFRFU1RORVRfTE9PS1VQX0FTU0VUUyA9IFtcbiAgJ0FWQVhURVNUJywgLy8gQXZhbGFuY2hlIEZ1amlcbiAgJ0VUSF9URVNUMycsIC8vIEV0aGVyZXVtIEdvZXJsaVxuICAnRVRIX1RFU1Q0JywgLy8gRXRoZXJldW0gUmlua2VieVxuICAnRVRIX1RFU1Q1JywgLy8gRXRoZXJldW0gU2Vwb2xpYVxuXTtcblxuLy8gT24gTWFpbm5ldCBGaXJlYmxvY2tzIHdvcmtzcGFjZXMsIHdlIHJlcXVpcmUgdGhlIGNvbm5lY3RlZCB2YXVsdCB0byBoYXZlIG9uZSBvZiB0aG9zZSB3YWxsZXRzIGNyZWF0ZWQuXG4vLyBXZSBuZWVkIHN1Y2ggYSB3YWxsZXQgdG8gYmUgY3JlYXRlZCwgc28gdGhhdCB3ZSBjYW4gZmluZCB0aGUgdmF1bHQgYWNjb3VudCB1c2VkIHRvIGNvbm5lY3QgdmlhIFdhbGxldENvbm5lY3QuXG4vLyBLbm93aW5nIHRoZSB2YXVsdCBhY2NvdW50IGFsbG93cyB1cyB0byBmaW5kIHRoZSBtYXRjaGluZyBCVEMgYWRkcmVzcy5cbmV4cG9ydCBjb25zdCBNQUlOTkVUX0xPT0tVUF9BU1NFVFMgPSBbJ0FWQVgnXTtcblxuZXhwb3J0IGNvbnN0IEZJUkVCTE9DS1NfUkVRVUVTVF9FWFBJUlkgPSAxMjAgKiA2MDsgLy8gMiBob3VycywgdXNlZCBvbmx5IGJ5IFdhbGxldENvbm5lY3QgY29ubmVjdGlvbnNcblxuZXhwb3J0IGludGVyZmFjZSBGaXJlYmxvY2tzU2VjcmV0c1Byb3ZpZGVyIHtcbiAgZ2V0U2VjcmV0cygpOiBQcm9taXNlPHsgYXBpS2V5OiBzdHJpbmc7IHByaXZhdGVLZXk6IEtleUxpa2UgfT47XG59XG5cbmV4cG9ydCB0eXBlIEFkZHJlc3NSZXNwb25zZSA9IE9taXQ8X0FkZHJlc3NSZXNwb25zZSwgJ3R5cGUnPiAmIHtcbiAgdHlwZT86IHN0cmluZztcbn07XG4vLyB0aGlzIGlzIHVzZWQgYXMgYSByZXBsYWNlbWVudCBmb3IgUGFnaW5hdGVkQWRkcmVzc2VzUmVzcG9uc2UgZnJvbSBmaXJlYmxvY2tzIHNka1xuLy8gZHVlIHRvIHdyb25nIHR5cGUgZGVjbGFyYXRpb25zXG5leHBvcnQgdHlwZSBQYWdpbmF0ZWRBZGRyZXNzZXNSZXNwb25zZSA9IE9taXQ8XG4gIF9QYWdpbmF0ZWRBZGRyZXNzZXNSZXNwb25zZSxcbiAgJ2FkZHJlc3Nlcydcbj4gJiB7XG4gIGFkZHJlc3NlczogQWRkcmVzc1Jlc3BvbnNlW107XG59O1xuIiwiaW1wb3J0IHsgVG9rZW5XaXRoQmFsYW5jZUJUQyB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyBTZWNyZXRUeXBlIH0gZnJvbSAnLi4vLi4vc2VjcmV0cy9tb2RlbHMnO1xuaW1wb3J0IHsgUHViS2V5VHlwZSB9IGZyb20gJy4uL21vZGVscyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlzcGxheURhdGFfQml0Y29pblNlbmRUeCB7XG4gIGZyb206IHN0cmluZztcbiAgYWRkcmVzczogc3RyaW5nO1xuICBhbW91bnQ6IG51bWJlcjsgLy8gc2F0b3NoaXNcbiAgc2VuZEZlZTogbnVtYmVyOyAvLyBzYXRvc2hpc1xuICBmZWVSYXRlOiBudW1iZXI7XG4gIGJhbGFuY2U6IFRva2VuV2l0aEJhbGFuY2VCVEM7XG4gIGRpc3BsYXlPcHRpb25zPzogVHhEaXNwbGF5T3B0aW9ucztcbn1cblxuZXhwb3J0IHR5cGUgSW1wb3J0U2VlZHBocmFzZVdhbGxldFBhcmFtcyA9IHtcbiAgbW5lbW9uaWM6IHN0cmluZztcbiAgbmFtZT86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEltcG9ydExlZGdlcldhbGxldFBhcmFtcyA9IHtcbiAgeHB1Yjogc3RyaW5nO1xuICB4cHViWFA6IHN0cmluZztcbiAgcHViS2V5cz86IFB1YktleVR5cGVbXTtcbiAgc2VjcmV0VHlwZTogU2VjcmV0VHlwZS5MZWRnZXIgfCBTZWNyZXRUeXBlLkxlZGdlckxpdmU7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRyeVJ1bj86IGJvb2xlYW47XG4gIG51bWJlck9mQWNjb3VudHNUb0NyZWF0ZT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEltcG9ydFdhbGxldFJlc3VsdCA9IHtcbiAgdHlwZTogU2VjcmV0VHlwZTtcbiAgbmFtZT86IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbn07XG5cbmV4cG9ydCBlbnVtIFNlZWRwaHJhc2VJbXBvcnRFcnJvciB7XG4gIEV4aXN0aW5nU2VlZHBocmFzZSA9ICdleGlzdGluZy1zZWVkcGhyYXNlJyxcbn1cblxuZXhwb3J0IHR5cGUgVHhEaXNwbGF5T3B0aW9ucyA9IHtcbiAgY3VzdG9tQXBwcm92YWxTY3JlZW5UaXRsZT86IHN0cmluZztcbiAgY29udGV4dEluZm9ybWF0aW9uPzoge1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgbm90aWNlPzogc3RyaW5nO1xuICB9O1xufTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IGVycm9yQ29kZXMgfSBmcm9tICdldGgtcnBjLWVycm9ycyc7XG5cbmltcG9ydCB7IEZpcmVibG9ja3NFcnJvckNvZGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmlyZWJsb2Nrcy9tb2RlbHMnO1xuaW1wb3J0IHtcbiAgQ29tbW9uRXJyb3IsXG4gIFJwY0Vycm9yQ29kZSxcbiAgU2VjcmV0c0Vycm9yLFxuICBpc1dyYXBwZWRFcnJvcixcbn0gZnJvbSAnQHNyYy91dGlscy9lcnJvcnMnO1xuaW1wb3J0IHsgVW5pZmllZEJyaWRnZUVycm9yIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3VuaWZpZWRCcmlkZ2UvbW9kZWxzJztcbmltcG9ydCB7IEtleXN0b3JlRXJyb3IgfSBmcm9tICdAc3JjL3V0aWxzL2tleXN0b3JlL21vZGVscyc7XG5pbXBvcnQgeyBTZWVkcGhyYXNlSW1wb3J0RXJyb3IgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L2hhbmRsZXJzL21vZGVscyc7XG5pbXBvcnQgeyBTd2FwRXJyb3JDb2RlIH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Td2FwUHJvdmlkZXIvbW9kZWxzJztcblxudHlwZSBFcnJvclRyYW5zbGF0aW9uID0ge1xuICB0aXRsZTogc3RyaW5nO1xuICBoaW50Pzogc3RyaW5nO1xufTtcblxuZXhwb3J0IGNvbnN0IHVzZUVycm9yTWVzc2FnZSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IGZpcmVibG9ja3NFcnJvcnM6IFJlY29yZDxGaXJlYmxvY2tzRXJyb3JDb2RlLCBFcnJvclRyYW5zbGF0aW9uPiA9XG4gICAgdXNlTWVtbygoKSA9PiB7XG4gICAgICBjb25zdCBmaXJlYmxvY2tzSGludCA9IHQoXG4gICAgICAgICdQbGVhc2UgcmVmZXIgdG8gQWN0aXZlIFRyYW5zZmVycyBsaXN0IGluIHlvdXIgRmlyZWJsb2NrcyBDb25zb2xlIGZvciBhIGRldGFpbGVkIGV4cGxhbmF0aW9uLicsXG4gICAgICApO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBbRmlyZWJsb2Nrc0Vycm9yQ29kZS5CbG9ja2VkXToge1xuICAgICAgICAgIHRpdGxlOiB0KCdUcmFuc2FjdGlvbiBoYXMgYmVlbiBibG9ja2VkJyksXG4gICAgICAgICAgaGludDogZmlyZWJsb2Nrc0hpbnQsXG4gICAgICAgIH0sXG4gICAgICAgIFtGaXJlYmxvY2tzRXJyb3JDb2RlLkZhaWxlZF06IHtcbiAgICAgICAgICB0aXRsZTogdCgnVHJhbnNhY3Rpb24gaGFzIGZhaWxlZCcpLFxuICAgICAgICAgIGhpbnQ6IGZpcmVibG9ja3NIaW50LFxuICAgICAgICB9LFxuICAgICAgICBbRmlyZWJsb2Nrc0Vycm9yQ29kZS5SZWplY3RlZF06IHtcbiAgICAgICAgICB0aXRsZTogdCgnVHJhbnNhY3Rpb24gaGFzIGJlZW4gcmVqZWN0ZWQnKSxcbiAgICAgICAgICBoaW50OiBmaXJlYmxvY2tzSGludCxcbiAgICAgICAgfSxcbiAgICAgICAgW0ZpcmVibG9ja3NFcnJvckNvZGUuQ2FuY2VsbGVkXToge1xuICAgICAgICAgIHRpdGxlOiB0KCdUcmFuc2FjdGlvbiBoYXMgYmVlbiBjYW5jZWxsZWQnKSxcbiAgICAgICAgICBoaW50OiBmaXJlYmxvY2tzSGludCxcbiAgICAgICAgfSxcbiAgICAgICAgW0ZpcmVibG9ja3NFcnJvckNvZGUuVGltZW91dF06IHtcbiAgICAgICAgICB0aXRsZTogdCgnVHJhbnNhY3Rpb24gdGltZWQgb3V0JyksXG4gICAgICAgICAgaGludDogZmlyZWJsb2Nrc0hpbnQsXG4gICAgICAgIH0sXG4gICAgICAgIFtGaXJlYmxvY2tzRXJyb3JDb2RlLlVua25vd25dOiB7XG4gICAgICAgICAgdGl0bGU6IHQoJ1Vua25vd24gdHJhbnNhY3Rpb24gZXJyb3InKSxcbiAgICAgICAgICBoaW50OiB0KCdQbGVhc2UgdHJ5IGFnYWluIGxhdGVyIG9yIGNvbnRhY3Qgc3VwcG9ydC4nKSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSwgW3RdKTtcblxuICAvLyBUaGVzZSBtZXNzYWdlcyB3aWxsIHNlcnZlIGFzIGdlbmVyaWMgZmFsbGJhY2tzIGluIGNhc2UgZGF0YS5yZWFzb25cbiAgLy8gaXMgbm90IHNwZWNpZmllZCBpbiB0aGUgcmV0dXJuZWQgZXJyb3IuXG4gIGNvbnN0IHN0YW5kYXJkUnBjRXJyb3JzOiBSZWNvcmQ8bnVtYmVyLCBFcnJvclRyYW5zbGF0aW9uPiA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIFtlcnJvckNvZGVzLnJwYy5pbnRlcm5hbF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ0ludGVybmFsIGVycm9yJyksXG4gICAgICB9LFxuICAgICAgW2Vycm9yQ29kZXMucnBjLnRyYW5zYWN0aW9uUmVqZWN0ZWRdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdUcmFuc2FjdGlvbiByZWplY3RlZCcpLFxuICAgICAgfSxcbiAgICAgIFtlcnJvckNvZGVzLnJwYy5pbnZhbGlkUmVxdWVzdF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ0ludmFsaWQgcmVxdWVzdCcpLFxuICAgICAgfSxcbiAgICAgIFtlcnJvckNvZGVzLnJwYy5pbnZhbGlkUGFyYW1zXToge1xuICAgICAgICB0aXRsZTogdCgnSW52YWxpZCBwYXJhbXMnKSxcbiAgICAgIH0sXG4gICAgICBbZXJyb3JDb2Rlcy5ycGMubGltaXRFeGNlZWRlZF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ0xpbWl0IGV4Y2VlZGVkJyksXG4gICAgICB9LFxuICAgICAgW2Vycm9yQ29kZXMucnBjLnJlc291cmNlVW5hdmFpbGFibGVdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdSZXNvdXJjZSB1bmF2YWlsYWJsZScpLFxuICAgICAgfSxcbiAgICAgIFtlcnJvckNvZGVzLnByb3ZpZGVyLmRpc2Nvbm5lY3RlZF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ0Rpc2Nvbm5lY3RlZCcpLFxuICAgICAgfSxcbiAgICAgIFtlcnJvckNvZGVzLnByb3ZpZGVyLnVuYXV0aG9yaXplZF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ1VuYXV0aG9yaXplZCcpLFxuICAgICAgfSxcbiAgICAgIFtlcnJvckNvZGVzLnByb3ZpZGVyLnVzZXJSZWplY3RlZFJlcXVlc3RdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdVc2VyIHJlamVjdGVkIHRoZSByZXF1ZXN0JyksXG4gICAgICB9LFxuICAgIH0pLFxuICAgIFt0XSxcbiAgKTtcblxuICBjb25zdCB1bmlmaWVkQnJpZGdlRXJyb3JzOiBSZWNvcmQ8VW5pZmllZEJyaWRnZUVycm9yLCBFcnJvclRyYW5zbGF0aW9uPiA9XG4gICAgdXNlTWVtbyhcbiAgICAgICgpID0+ICh7XG4gICAgICAgIFtVbmlmaWVkQnJpZGdlRXJyb3IuQW1vdW50TGVzc1RoYW5GZWVdOiB7XG4gICAgICAgICAgdGl0bGU6IHQoJ0Ftb3VudCBpcyB0b28gbG93JyksXG4gICAgICAgICAgaGludDogdCgnVGhlIGFtb3VudCBjYW5ub3QgYmUgbG93ZXIgdGhhbiB0aGUgYnJpZGdpbmcgZmVlJyksXG4gICAgICAgIH0sXG4gICAgICAgIFtVbmlmaWVkQnJpZGdlRXJyb3IuSW52YWxpZFR4UGF5bG9hZF06IHtcbiAgICAgICAgICB0aXRsZTogdCgnSW52YWxpZCB0cmFuc2FjdGlvbiBkYXRhJyksXG4gICAgICAgIH0sXG4gICAgICAgIFtVbmlmaWVkQnJpZGdlRXJyb3IuSW52YWxpZEZlZV06IHtcbiAgICAgICAgICB0aXRsZTogdCgnVGhlIGJyaWRnaW5nIGZlZSBpcyB1bmtub3duJyksXG4gICAgICAgIH0sXG4gICAgICAgIFtVbmlmaWVkQnJpZGdlRXJyb3IuVW5rbm93bkFzc2V0XToge1xuICAgICAgICAgIHRpdGxlOiB0KCdUaGlzIGFzc2V0IGNhbm5vdCBiZSBicmlkZ2VkJyksXG4gICAgICAgIH0sXG4gICAgICAgIFtVbmlmaWVkQnJpZGdlRXJyb3IuVW5zdXBwb3J0ZWROZXR3b3JrXToge1xuICAgICAgICAgIHRpdGxlOiB0KCdVbnN1cHBvcnRlZCBuZXR3b3JrJyksXG4gICAgICAgIH0sXG4gICAgICAgIFtVbmlmaWVkQnJpZGdlRXJyb3IuTm9uQml0Y29pbkFjY291bnRdOiB7XG4gICAgICAgICAgdGl0bGU6IHQoJ1Vuc3VwcG9ydGVkIGFjY291bnQnKSxcbiAgICAgICAgICBoaW50OiB0KGBUaGUgYWN0aXZlIGFjY291bnQgZG9lcyBub3Qgc3VwcG9ydCBCaXRjb2luLmApLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBbdF0sXG4gICAgKTtcblxuICBjb25zdCBzd2FwRXJyb3JzOiBSZWNvcmQ8U3dhcEVycm9yQ29kZSwgRXJyb3JUcmFuc2xhdGlvbj4gPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBbU3dhcEVycm9yQ29kZS5DbGllbnROb3RJbml0aWFsaXplZF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ1N3YXAgY2xpZW50IGlzIG5vdCBpbml0aWFsaXplZCcpLFxuICAgICAgICBoaW50OiB0KCdQbGVhc2UgdHJ5IHN3aXRjaGluZyB0byBhIGRpZmZlcmVudCBuZXR3b3JrLicpLFxuICAgICAgfSxcbiAgICAgIFtTd2FwRXJyb3JDb2RlLkFwaUVycm9yXToge1xuICAgICAgICB0aXRsZTogdCgnVGhlcmUgd2FzIGFuIGVycm9yIGNvbnRhY3Rpbmcgb3VyIHByaWNpbmcgcHJvdmlkZXIuJyksXG4gICAgICAgIGhpbnQ6IHQoJ1BsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyksXG4gICAgICB9LFxuICAgICAgW1N3YXBFcnJvckNvZGUuQ2Fubm90QnVpbGRUeF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ1ByaWNpbmcgcHJvdmlkZXIgZGlkIG5vdCByZXNwb25kIHdpdGggYSB2YWxpZCB0cmFuc2FjdGlvbi4nKSxcbiAgICAgICAgaGludDogdCgnUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKSxcbiAgICAgIH0sXG4gICAgICBbU3dhcEVycm9yQ29kZS5DYW5ub3RGZXRjaEFsbG93YW5jZV06IHtcbiAgICAgICAgdGl0bGU6IHQoJ1RoZXJlIHdhcyBhbiBlcnJvciBmZXRjaGluZyB5b3VyIHNwZW5kIGFwcHJvdmFscy4nKSxcbiAgICAgICAgaGludDogdCgnVHJ5IHN3YXBwaW5nIGEgZGlmZmVyZW50IHRva2VuIG9yIHRyeSBhZ2FpbiBsYXRlci4nKSxcbiAgICAgIH0sXG4gICAgICBbU3dhcEVycm9yQ29kZS5NaXNzaW5nQ29udHJhY3RNZXRob2RdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdUaGlzIHRva2VuIGNvbnRyYWN0IGlzIG1pc3NpbmcgYSByZXF1aXJlZCBtZXRob2QuJyksXG4gICAgICAgIGhpbnQ6IHQoJ1RyeSBzd2FwcGluZyBhIGRpZmZlcmVudCB0b2tlbi4nKSxcbiAgICAgIH0sXG4gICAgICBbU3dhcEVycm9yQ29kZS5NaXNzaW5nUGFyYW1zXToge1xuICAgICAgICB0aXRsZTogdCgnU29tZSBvZiB0aGUgcmVxdWlyZWQgcGFyYW1ldGVycyBhcmUgbWlzc2luZy4nKSxcbiAgICAgICAgaGludDogdChcbiAgICAgICAgICAnT3VyIHRlYW0gd2FzIG1hZGUgYXdhcmUgb2YgdGhpcyBpc3N1ZS4gRmVlbCBmcmVlIHRvIGNvbnRhY3QgdXMgZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uJyxcbiAgICAgICAgKSxcbiAgICAgIH0sXG4gICAgICBbU3dhcEVycm9yQ29kZS5VbmV4cGVjdGVkQXBpUmVzcG9uc2VdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdVbmV4cGVjdGVkIHJlc3BvbnNlIGZyb20gb3VyIHByaWNpbmcgcHJvdmlkZXIuJyksXG4gICAgICAgIGhpbnQ6IHQoJ1BsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyksXG4gICAgICB9LFxuICAgICAgW1N3YXBFcnJvckNvZGUuVW5rbm93blNwZW5kZXJdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdVbmV4cGVjdGVkIHJlc3BvbnNlIGZyb20gb3VyIHByaWNpbmcgcHJvdmlkZXIuJyksXG4gICAgICAgIGhpbnQ6IHQoJ1BsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyksXG4gICAgICB9LFxuICAgIH0pLFxuICAgIFt0XSxcbiAgKTtcblxuICBjb25zdCBjb21tb25FcnJvcnM6IFJlY29yZDxDb21tb25FcnJvciwgRXJyb3JUcmFuc2xhdGlvbj4gPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBbQ29tbW9uRXJyb3IuVW5rbm93bl06IHtcbiAgICAgICAgdGl0bGU6IHQoJ1Vua25vd24gZXJyb3InKSxcbiAgICAgIH0sXG4gICAgICBbQ29tbW9uRXJyb3IuVXNlclJlamVjdGVkXToge1xuICAgICAgICB0aXRsZTogdCgnVXNlciBkZWNsaW5lZCB0aGUgdHJhbnNhY3Rpb24nKSxcbiAgICAgIH0sXG4gICAgICBbQ29tbW9uRXJyb3IuVW5zdXBwb3J0ZWRUb2tlblR5cGVdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdVbnN1cHBvcnRlZCB0b2tlbiB0eXBlJyksXG4gICAgICAgIGhpbnQ6IHQoJ1NlbmRpbmcgdGhpcyB0eXBlIG9mIHRva2VuIGlzIG5vdCBzdXBwb3J0ZWQgYnkgQ29yZScpLFxuICAgICAgfSxcbiAgICAgIFtDb21tb25FcnJvci5OZXR3b3JrRXJyb3JdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdOZXR3b3JrIGVycm9yJyksXG4gICAgICAgIGhpbnQ6IHQoJ1BsZWFzZSBjaGVjayB5b3VyIGNvbm5lY3Rpb24gYW5kIHRyeSBhZ2Fpbi4nKSxcbiAgICAgIH0sXG4gICAgICBbQ29tbW9uRXJyb3IuTm9BY3RpdmVBY2NvdW50XToge1xuICAgICAgICB0aXRsZTogdCgnTm8gYWNjb3VudCBpcyBhY3RpdmUnKSxcbiAgICAgICAgaGludDogdCgnUGxlYXNlIHRyeSBhZ2FpbicpLFxuICAgICAgfSxcbiAgICAgIFtDb21tb25FcnJvci5Ob0FjdGl2ZU5ldHdvcmtdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdObyBhY3RpdmUgbmV0d29yaycpLFxuICAgICAgICBoaW50OiB0KCdQbGVhc2UgdHJ5IGFnYWluJyksXG4gICAgICB9LFxuICAgICAgW0NvbW1vbkVycm9yLlVua25vd25OZXR3b3JrXToge1xuICAgICAgICB0aXRsZTogdCgnVW5rbm93biBuZXR3b3JrJyksXG4gICAgICB9LFxuICAgICAgW0NvbW1vbkVycm9yLlVua25vd25OZXR3b3JrRmVlXToge1xuICAgICAgICB0aXRsZTogdCgnVW5rbm93biBuZXR3b3JrIGZlZScpLFxuICAgICAgfSxcbiAgICAgIFtDb21tb25FcnJvci5SZXF1ZXN0VGltZW91dF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ1JlcXVlc3QgdGltZWQgb3V0JyksXG4gICAgICAgIGhpbnQ6IHQoJ1RoaXMgaXMgdGFraW5nIGxvbmdlciB0aGFuIGV4cGVjdGVkLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpLFxuICAgICAgfSxcbiAgICAgIFtDb21tb25FcnJvci5Nb2R1bGVNYW5hZ2VyTm90U2V0XToge1xuICAgICAgICB0aXRsZTogdCgnSW50ZXJuYWwgZXJyb3Igb2NjdXJyZWQuJyksIC8vIERvIG5vdCBsZWFrIGltcGxlbWVudGF0aW9uIGRldGFpbHMgdG8gdGhlIFVJXG4gICAgICB9LFxuICAgICAgW0NvbW1vbkVycm9yLk1pZ3JhdGlvbkZhaWxlZF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ1N0b3JhZ2UgdXBkYXRlIGZhaWxlZCcpLFxuICAgICAgfSxcbiAgICAgIFtDb21tb25FcnJvci5VbmFibGVUb1NpZ25dOiB7XG4gICAgICAgIHRpdGxlOiB0KCdVbmFibGUgdG8gc2lnbiBvciBicm9hZGNhc3QgdHJhbnNhY3Rpb24nKSxcbiAgICAgIH0sXG4gICAgICBbQ29tbW9uRXJyb3IuVW5hYmxlVG9Fc3RpbWF0ZUdhc106IHtcbiAgICAgICAgdGl0bGU6IHQoJ1VuYWJsZSB0byBlc3RpbWF0ZSBnYXMnKSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgW3RdLFxuICApO1xuXG4gIGNvbnN0IHNlY3JldEVycm9yczogUmVjb3JkPFNlY3JldHNFcnJvciwgRXJyb3JUcmFuc2xhdGlvbj4gPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBbU2VjcmV0c0Vycm9yLk1pc3NpbmdFeHRlbmRlZFB1YmxpY0tleV06IHtcbiAgICAgICAgdGl0bGU6IHQoJ0V4dGVuZGVkIHB1YmxpYyBrZXkgbm90IGZvdW5kJyksXG4gICAgICB9LFxuICAgICAgW1NlY3JldHNFcnJvci5Ob0FjY291bnRJbmRleF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ05vIGFjY291bnQgaW5kZXggd2FzIHByb3ZpZGVkJyksXG4gICAgICB9LFxuICAgICAgW1NlY3JldHNFcnJvci5QdWJsaWNLZXlOb3RGb3VuZF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ1B1YmxpYyBrZXkgbm90IGZvdW5kJyksXG4gICAgICB9LFxuICAgICAgW1NlY3JldHNFcnJvci5TZWNyZXRzTm90Rm91bmRdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdXYWxsZXQgc2VjcmV0cyBub3QgZm91bmQgZm9yIHRoZSByZXF1ZXN0ZWQgSUQnKSxcbiAgICAgIH0sXG4gICAgICBbU2VjcmV0c0Vycm9yLldhbGxldEFscmVhZHlFeGlzdHNdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdUaGlzIHdhbGxldCBpcyBhbHJlYWR5IGltcG9ydGVkJyksXG4gICAgICB9LFxuICAgICAgW1NlY3JldHNFcnJvci5EZXJpdmF0aW9uUGF0aE1pc3NpbmddOiB7XG4gICAgICAgIHRpdGxlOiB0KCdBdHRlbXB0ZWQgdG8gdXNlIGFuIHVua25vd24gZGVyaXZhdGlvbiBwYXRoJyksXG4gICAgICB9LFxuICAgICAgW1NlY3JldHNFcnJvci5EZXJpdmF0aW9uUGF0aFRvb1Nob3J0XToge1xuICAgICAgICB0aXRsZTogdCgnRXJyb3Igd2hpbGUgZGVyaXZpbmcgYWRkcmVzcycpLFxuICAgICAgICBoaW50OiB0KCdSZXF1ZXN0ZWQgZGVyaXZhdGlvbiBwYXRoIGlzIHRvbyBzaG9ydCcpLFxuICAgICAgfSxcbiAgICAgIFtTZWNyZXRzRXJyb3IuVW5zdXBwb3J0ZWRTZWNyZXRUeXBlXToge1xuICAgICAgICB0aXRsZTogdCgnRXJyb3Igd2hpbGUgZGVyaXZpbmcgYWRkcmVzcycpLFxuICAgICAgICBoaW50OiB0KCdVbnN1cHBvcmV0ZCBzZWNyZXQgdHlwZScpLFxuICAgICAgfSxcbiAgICAgIFtTZWNyZXRzRXJyb3IuVW5zdXBwb3J0ZWRDdXJ2ZV06IHtcbiAgICAgICAgdGl0bGU6IHQoJ0Vycm9yIHdoaWxlIGRlcml2aW5nIGFkZHJlc3MnKSxcbiAgICAgICAgaGludDogdCgnVW5zdXBwb3J0ZWQgZWxsaXB0aWMgY3VydmUnKSxcbiAgICAgIH0sXG4gICAgICBbU2VjcmV0c0Vycm9yLlVua25vd25EZXJpdmF0aW9uUGF0aEZvcm1hdF06IHtcbiAgICAgICAgdGl0bGU6IHQoJ0Vycm9yIHdoaWxlIGRlcml2aW5nIGFkZHJlc3MnKSxcbiAgICAgICAgaGludDogdCgnVW5zdXBwb3J0ZWQgZGVyaXZhdGlvbiBwYXRoIGZvcm1hdCcpLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBbdF0sXG4gICk7XG5cbiAgY29uc3QgcnBjRXJyb3JzOiBSZWNvcmQ8UnBjRXJyb3JDb2RlLCBFcnJvclRyYW5zbGF0aW9uPiA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIFtScGNFcnJvckNvZGUuSW5zdWZmaWNpZW50RnVuZHNdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdJbnN1ZmZpY2llbnQgZnVuZHMnKSxcbiAgICAgICAgaGludDogdCgnWW91IGRvIG5vdCBoYXZlIGVub3VnaCBmdW5kcyB0byBjb3ZlciB0aGUgbmV0d29yayBmZWVzLicpLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBbdF0sXG4gICk7XG4gIGNvbnN0IGtleXN0b3JlRXJyb3JzOiBSZWNvcmQ8S2V5c3RvcmVFcnJvciwgRXJyb3JUcmFuc2xhdGlvbj4gPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBbS2V5c3RvcmVFcnJvci5JbnZhbGlkUGFzc3dvcmRdOiB7XG4gICAgICAgIHRpdGxlOiB0KCdJbnZhbGlkIHBhc3N3b3JkLiBQbGVhc2UgdHJ5IGFnYWluLicpLFxuICAgICAgfSxcbiAgICAgIFtLZXlzdG9yZUVycm9yLkludmFsaWRWZXJzaW9uXToge1xuICAgICAgICB0aXRsZTogdCgnVW5zdXBwb3J0ZWQgVmVyc2lvbicpLFxuICAgICAgICBoaW50OiB0KFxuICAgICAgICAgICdPbmx5IGtleXN0b3JlIGZpbGVzIGV4cG9ydGVkIGZyb20gdGhlIEF2YWxhbmNoZSBXYWxsZXQgYXJlIHN1cHBvcnRlZC4nLFxuICAgICAgICApLFxuICAgICAgfSxcbiAgICAgIFtLZXlzdG9yZUVycm9yLk5vTmV3V2FsbGV0c106IHtcbiAgICAgICAgdGl0bGU6IHQoJ05vIE5ldyBXYWxsZXRzIEZvdW5kJyksXG4gICAgICAgIGhpbnQ6IHQoJ0FsbCBrZXlzIGNvbnRhaW5lZCBpbiB0aGlzIGZpbGUgYXJlIGFscmVhZHkgaW1wb3J0ZWQuJyksXG4gICAgICB9LFxuICAgICAgW0tleXN0b3JlRXJyb3IuVW5rbm93bl06IHtcbiAgICAgICAgdGl0bGU6IHQoJ0ZpbGUgVXBsb2FkIEZhaWxlZCcpLFxuICAgICAgICBoaW50OiB0KCdQbGVhc2UgY29udGFjdCBvdXIgc3VwcG9ydCB0ZWFtIHRvIHJlc29sdmUgdGhpcyBpc3N1ZS4nKSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgW3RdLFxuICApO1xuXG4gIGNvbnN0IHNlZWRwaHJhc2VJbXBvcnRFcnJvcjogUmVjb3JkPFNlZWRwaHJhc2VJbXBvcnRFcnJvciwgRXJyb3JUcmFuc2xhdGlvbj4gPVxuICAgIHVzZU1lbW8oXG4gICAgICAoKSA9PiAoe1xuICAgICAgICBbU2VlZHBocmFzZUltcG9ydEVycm9yLkV4aXN0aW5nU2VlZHBocmFzZV06IHtcbiAgICAgICAgICB0aXRsZTogdCgnVGhpcyByZWNvdmVyeSBwaHJhc2UgaXMgYWxyZWFkeSBpbXBvcnRlZC4nKSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgW3RdLFxuICAgICk7XG5cbiAgY29uc3QgbWVzc2FnZXMgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICAuLi5maXJlYmxvY2tzRXJyb3JzLFxuICAgICAgLi4udW5pZmllZEJyaWRnZUVycm9ycyxcbiAgICAgIC4uLmNvbW1vbkVycm9ycyxcbiAgICAgIC4uLnN0YW5kYXJkUnBjRXJyb3JzLFxuICAgICAgLi4ua2V5c3RvcmVFcnJvcnMsXG4gICAgICAuLi5zZWVkcGhyYXNlSW1wb3J0RXJyb3IsXG4gICAgICAuLi5ycGNFcnJvcnMsXG4gICAgICAuLi5zZWNyZXRFcnJvcnMsXG4gICAgICAuLi5zd2FwRXJyb3JzLFxuICAgIH0pLFxuICAgIFtcbiAgICAgIGZpcmVibG9ja3NFcnJvcnMsXG4gICAgICB1bmlmaWVkQnJpZGdlRXJyb3JzLFxuICAgICAgY29tbW9uRXJyb3JzLFxuICAgICAgc3RhbmRhcmRScGNFcnJvcnMsXG4gICAgICBrZXlzdG9yZUVycm9ycyxcbiAgICAgIHNlZWRwaHJhc2VJbXBvcnRFcnJvcixcbiAgICAgIHJwY0Vycm9ycyxcbiAgICAgIHNlY3JldEVycm9ycyxcbiAgICAgIHN3YXBFcnJvcnMsXG4gICAgXSxcbiAgKTtcblxuICByZXR1cm4gdXNlQ2FsbGJhY2soXG4gICAgKGVycm9yOiB1bmtub3duKTogRXJyb3JUcmFuc2xhdGlvbiA9PiB7XG4gICAgICBpZiAodHlwZW9mIGVycm9yID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gbWVzc2FnZXNbZXJyb3JdID8/IHsgdGl0bGU6IGVycm9yIH07XG4gICAgICB9XG5cbiAgICAgIGxldCBtZXNzYWdlOiBFcnJvclRyYW5zbGF0aW9uID0gbWVzc2FnZXNbQ29tbW9uRXJyb3IuVW5rbm93bl07XG5cbiAgICAgIGlmIChpc1dyYXBwZWRFcnJvcihlcnJvcikpIHtcbiAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2VzW2Vycm9yLmRhdGEucmVhc29uXSA/PyBtZXNzYWdlc1tDb21tb25FcnJvci5Vbmtub3duXTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgZXJyb3IgIT09IG51bGwgJiZcbiAgICAgICAgJ2NvZGUnIGluIGVycm9yICYmXG4gICAgICAgICh0eXBlb2YgZXJyb3IuY29kZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGVycm9yLmNvZGUgPT09ICdzdHJpbmcnKVxuICAgICAgKSB7XG4gICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlc1tlcnJvci5jb2RlXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1lc3NhZ2UgPz8gbWVzc2FnZXNbQ29tbW9uRXJyb3IuVW5rbm93bl07XG4gICAgfSxcbiAgICBbbWVzc2FnZXNdLFxuICApO1xufTtcbiIsImV4cG9ydCB0eXBlIEtleXN0b3JlRmlsZUtleVR5cGUgPSAnbW5lbW9uaWMnIHwgJ3NpbmdsZXRvbic7XG5leHBvcnQgdHlwZSBBbGxLZXlGaWxlVHlwZXMgPVxuICB8IEtleUZpbGVWMlxuICB8IEtleUZpbGVWM1xuICB8IEtleUZpbGVWNFxuICB8IEtleUZpbGVWNVxuICB8IEtleUZpbGVWNjtcbmV4cG9ydCB0eXBlIEFsbEtleUZpbGVEZWNyeXB0ZWRUeXBlcyA9XG4gIHwgS2V5RmlsZURlY3J5cHRlZFYyXG4gIHwgS2V5RmlsZURlY3J5cHRlZFYzXG4gIHwgS2V5RmlsZURlY3J5cHRlZFY0XG4gIHwgS2V5RmlsZURlY3J5cHRlZFY1XG4gIHwgS2V5RmlsZURlY3J5cHRlZFY2O1xuXG4vLyBWMiAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmV4cG9ydCBpbnRlcmZhY2UgS2V5RmlsZVYyIHtcbiAgc2FsdDogc3RyaW5nO1xuICBrZXlzOiBLZXlGaWxlS2V5VjJbXTtcbiAgcGFzc19oYXNoOiBzdHJpbmc7XG4gIHZlcnNpb246IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlGaWxlS2V5VjIge1xuICBrZXk6IHN0cmluZztcbiAgaXY6IHN0cmluZztcbiAgYWRkcmVzczogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtleUZpbGVEZWNyeXB0ZWRWMiB7XG4gIHZlcnNpb246IHN0cmluZztcbiAga2V5czogS2V5RmlsZUtleURlY3J5cHRlZFYyW107XG4gIGFjdGl2ZUluZGV4OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5RmlsZUtleURlY3J5cHRlZFYyIHtcbiAga2V5OiBzdHJpbmc7XG59XG5cbi8vIFYzICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gVW5kZXJseWluZyBlbmNyeXB0aW9uIGNoYW5nZWQuXG5leHBvcnQgaW50ZXJmYWNlIEtleUZpbGVWMyB7XG4gIHNhbHQ6IHN0cmluZztcbiAga2V5czogS2V5RmlsZUtleVYzW107XG4gIHBhc3NfaGFzaDogc3RyaW5nO1xuICB2ZXJzaW9uOiBzdHJpbmc7XG4gIHdhcm5pbmdzOiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlGaWxlS2V5VjMge1xuICBrZXk6IHN0cmluZztcbiAgaXY6IHN0cmluZztcbiAgYWRkcmVzczogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtleUZpbGVEZWNyeXB0ZWRWMyB7XG4gIHZlcnNpb246IHN0cmluZztcbiAga2V5czogS2V5RmlsZUtleURlY3J5cHRlZFYzW107XG4gIGFjdGl2ZUluZGV4OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5RmlsZUtleURlY3J5cHRlZFYzIHtcbiAga2V5OiBzdHJpbmc7XG59XG5cbi8vIFY0ICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gQXZhbGFuY2hlIHVzZXMgYmVjaDMyIGFkZHJlc3Nlcy4gUmVtb3ZlZCBhZGRyZXNzIGZpZWxkIGZyb20ga2V5cyBhbmQgdGhlIHdhcm5pbmcgbWVzc2FnZS5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5RmlsZVY0IHtcbiAgc2FsdDogc3RyaW5nO1xuICBrZXlzOiBLZXlGaWxlS2V5VjRbXTtcbiAgcGFzc19oYXNoOiBzdHJpbmc7XG4gIHZlcnNpb246IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlGaWxlS2V5VjQge1xuICBrZXk6IHN0cmluZztcbiAgaXY6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlGaWxlRGVjcnlwdGVkVjQge1xuICB2ZXJzaW9uOiBzdHJpbmc7XG4gIGtleXM6IEtleUZpbGVLZXlEZWNyeXB0ZWRWNFtdO1xuICBhY3RpdmVJbmRleDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtleUZpbGVLZXlEZWNyeXB0ZWRWNCB7XG4gIGtleTogc3RyaW5nO1xufVxuXG4vLyBWNSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbi8vIEVuY29kZXMgbW5lbW9uaWMgcGhyYXNlIGFzIHRoZSBrZXkuXG5leHBvcnQgaW50ZXJmYWNlIEtleUZpbGVWNSB7XG4gIHNhbHQ6IHN0cmluZztcbiAga2V5czogS2V5RmlsZUtleVY1W107XG4gIHBhc3NfaGFzaDogc3RyaW5nO1xuICB2ZXJzaW9uOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5RmlsZUtleVY1IHtcbiAga2V5OiBzdHJpbmc7XG4gIGl2OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5RmlsZURlY3J5cHRlZFY1IHtcbiAgdmVyc2lvbjogc3RyaW5nO1xuICBrZXlzOiBLZXlGaWxlS2V5RGVjcnlwdGVkVjVbXTtcbiAgYWN0aXZlSW5kZXg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlGaWxlS2V5RGVjcnlwdGVkVjUge1xuICBrZXk6IHN0cmluZztcbn1cblxuLy8gVjYgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyBSZW1vdmVzIHBhc3NfaGFzaC4gQWRkcyBhY3RpdmVJbmRleCBhbmQgYSB0eXBlIChtbmVtb25pYyB8IHNpbmdsZXRvbikgdG8ga2V5XG5leHBvcnQgaW50ZXJmYWNlIEtleUZpbGVWNiB7XG4gIHNhbHQ6IHN0cmluZztcbiAga2V5czogS2V5RmlsZUtleVY2W107XG4gIHZlcnNpb246IHN0cmluZztcbiAgYWN0aXZlSW5kZXg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlGaWxlS2V5VjYge1xuICBrZXk6IHN0cmluZztcbiAgaXY6IHN0cmluZztcbiAgdHlwZTogS2V5c3RvcmVGaWxlS2V5VHlwZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlGaWxlRGVjcnlwdGVkVjYge1xuICBhY3RpdmVJbmRleDogbnVtYmVyO1xuICB2ZXJzaW9uOiBzdHJpbmc7XG4gIGtleXM6IEtleUZpbGVLZXlEZWNyeXB0ZWRWNltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtleUZpbGVLZXlEZWNyeXB0ZWRWNiB7XG4gIGtleTogc3RyaW5nO1xuICB0eXBlOiBLZXlzdG9yZUZpbGVLZXlUeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjY2Vzc1dhbGxldE11bHRpcGxlSW5wdXQge1xuICB0eXBlOiAnbW5lbW9uaWMnIHwgJ3NpbmdsZXRvbic7XG4gIGtleTogc3RyaW5nO1xufVxuXG5leHBvcnQgZW51bSBLZXlzdG9yZUVycm9yIHtcbiAgSW52YWxpZFBhc3N3b3JkID0gJ2tleXN0b3JlLWludmFsaWQtcGFzc3dvcmQnLFxuICBJbnZhbGlkVmVyc2lvbiA9ICdrZXlzdG9yZS1pbnZhbGlkLXZlcnNpb24nLFxuICBOb05ld1dhbGxldHMgPSAna2V5c3RvcmUtbm8tbmV3LXdhbGxldHMnLFxuICBVbmtub3duID0gJ2tleXN0b3JlLXVua25vd24tZXJyb3InLFxufVxuXG5leHBvcnQgdHlwZSBLZXlzdG9yZUZpbGVDb250ZW50SW5mbyA9IHtcbiAgc2VlZFBocmFzZXNDb3VudDogbnVtYmVyO1xuICBwcml2YXRlS2V5c0NvdW50OiBudW1iZXI7XG59O1xuIiwiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIl0sIm5hbWVzIjpbIlRyYW5zYWN0aW9uU3RhdHVzIiwiVFJBTlNBQ1RJT05fUE9MTElOR19JTlRFUlZBTF9NUyIsIlRYX1NVQk1JU1NJT05fRkFJTFVSRV9TVEFUVVNFUyIsIkJMT0NLRUQiLCJDQU5DRUxMRUQiLCJDQU5DRUxMSU5HIiwiVElNRU9VVCIsIkZBSUxFRCIsIlJFSkVDVEVEIiwiQlRDX0FDQ0VTU19FUlJPUl9QUkVGSVgiLCJGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3JDb2RlIiwiRmlyZWJsb2Nrc0J0Y0FjY2Vzc0Vycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsImNvZGUiLCJGaXJlYmxvY2tzRXJyb3JDb2RlIiwiVEVTVE5FVF9MT09LVVBfQVNTRVRTIiwiTUFJTk5FVF9MT09LVVBfQVNTRVRTIiwiRklSRUJMT0NLU19SRVFVRVNUX0VYUElSWSIsIlNlZWRwaHJhc2VJbXBvcnRFcnJvciIsInVzZUNhbGxiYWNrIiwidXNlTWVtbyIsInVzZVRyYW5zbGF0aW9uIiwiZXJyb3JDb2RlcyIsIkNvbW1vbkVycm9yIiwiUnBjRXJyb3JDb2RlIiwiU2VjcmV0c0Vycm9yIiwiaXNXcmFwcGVkRXJyb3IiLCJVbmlmaWVkQnJpZGdlRXJyb3IiLCJLZXlzdG9yZUVycm9yIiwiU3dhcEVycm9yQ29kZSIsInVzZUVycm9yTWVzc2FnZSIsInQiLCJmaXJlYmxvY2tzRXJyb3JzIiwiZmlyZWJsb2Nrc0hpbnQiLCJCbG9ja2VkIiwidGl0bGUiLCJoaW50IiwiRmFpbGVkIiwiUmVqZWN0ZWQiLCJDYW5jZWxsZWQiLCJUaW1lb3V0IiwiVW5rbm93biIsInN0YW5kYXJkUnBjRXJyb3JzIiwicnBjIiwiaW50ZXJuYWwiLCJ0cmFuc2FjdGlvblJlamVjdGVkIiwiaW52YWxpZFJlcXVlc3QiLCJpbnZhbGlkUGFyYW1zIiwibGltaXRFeGNlZWRlZCIsInJlc291cmNlVW5hdmFpbGFibGUiLCJwcm92aWRlciIsImRpc2Nvbm5lY3RlZCIsInVuYXV0aG9yaXplZCIsInVzZXJSZWplY3RlZFJlcXVlc3QiLCJ1bmlmaWVkQnJpZGdlRXJyb3JzIiwiQW1vdW50TGVzc1RoYW5GZWUiLCJJbnZhbGlkVHhQYXlsb2FkIiwiSW52YWxpZEZlZSIsIlVua25vd25Bc3NldCIsIlVuc3VwcG9ydGVkTmV0d29yayIsIk5vbkJpdGNvaW5BY2NvdW50Iiwic3dhcEVycm9ycyIsIkNsaWVudE5vdEluaXRpYWxpemVkIiwiQXBpRXJyb3IiLCJDYW5ub3RCdWlsZFR4IiwiQ2Fubm90RmV0Y2hBbGxvd2FuY2UiLCJNaXNzaW5nQ29udHJhY3RNZXRob2QiLCJNaXNzaW5nUGFyYW1zIiwiVW5leHBlY3RlZEFwaVJlc3BvbnNlIiwiVW5rbm93blNwZW5kZXIiLCJjb21tb25FcnJvcnMiLCJVc2VyUmVqZWN0ZWQiLCJVbnN1cHBvcnRlZFRva2VuVHlwZSIsIk5ldHdvcmtFcnJvciIsIk5vQWN0aXZlQWNjb3VudCIsIk5vQWN0aXZlTmV0d29yayIsIlVua25vd25OZXR3b3JrIiwiVW5rbm93bk5ldHdvcmtGZWUiLCJSZXF1ZXN0VGltZW91dCIsIk1vZHVsZU1hbmFnZXJOb3RTZXQiLCJNaWdyYXRpb25GYWlsZWQiLCJVbmFibGVUb1NpZ24iLCJVbmFibGVUb0VzdGltYXRlR2FzIiwic2VjcmV0RXJyb3JzIiwiTWlzc2luZ0V4dGVuZGVkUHVibGljS2V5IiwiTm9BY2NvdW50SW5kZXgiLCJQdWJsaWNLZXlOb3RGb3VuZCIsIlNlY3JldHNOb3RGb3VuZCIsIldhbGxldEFscmVhZHlFeGlzdHMiLCJEZXJpdmF0aW9uUGF0aE1pc3NpbmciLCJEZXJpdmF0aW9uUGF0aFRvb1Nob3J0IiwiVW5zdXBwb3J0ZWRTZWNyZXRUeXBlIiwiVW5zdXBwb3J0ZWRDdXJ2ZSIsIlVua25vd25EZXJpdmF0aW9uUGF0aEZvcm1hdCIsInJwY0Vycm9ycyIsIkluc3VmZmljaWVudEZ1bmRzIiwia2V5c3RvcmVFcnJvcnMiLCJJbnZhbGlkUGFzc3dvcmQiLCJJbnZhbGlkVmVyc2lvbiIsIk5vTmV3V2FsbGV0cyIsInNlZWRwaHJhc2VJbXBvcnRFcnJvciIsIkV4aXN0aW5nU2VlZHBocmFzZSIsIm1lc3NhZ2VzIiwiZXJyb3IiLCJtZXNzYWdlIiwiZGF0YSIsInJlYXNvbiJdLCJzb3VyY2VSb290IjoiIn0=