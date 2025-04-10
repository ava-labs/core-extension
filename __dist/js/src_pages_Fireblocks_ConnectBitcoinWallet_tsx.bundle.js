(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Fireblocks_ConnectBitcoinWallet_tsx"],{

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

/***/ "./src/background/services/fireblocks/utils/getFireblocksBtcAccessErrorCode.ts":
/*!*************************************************************************************!*\
  !*** ./src/background/services/fireblocks/utils/getFireblocksBtcAccessErrorCode.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFireblocksBtcAccessErrorCode)
/* harmony export */ });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ "./src/background/services/fireblocks/models.ts");

function getFireblocksBtcAccessErrorCode(message) {
  const [, code] = message.split(_models__WEBPACK_IMPORTED_MODULE_0__.BTC_ACCESS_ERROR_PREFIX);
  if (typeof code === 'undefined' || code === '') {
    return null;
  }
  return parseInt(code);
}

/***/ }),

/***/ "./src/components/common/LoadingOverlay.tsx":
/*!**************************************************!*\
  !*** ./src/components/common/LoadingOverlay.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoadingOverlay": () => (/* binding */ LoadingOverlay)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _Overlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Overlay */ "./src/components/common/Overlay.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function LoadingOverlay() {
  return /*#__PURE__*/React.createElement(_Overlay__WEBPACK_IMPORTED_MODULE_0__.Overlay, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, null));
}

/***/ }),

/***/ "./src/components/common/TextFieldLabel.tsx":
/*!**************************************************!*\
  !*** ./src/components/common/TextFieldLabel.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextFieldLabel": () => (/* binding */ TextFieldLabel)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const TextFieldLabel = ({
  label,
  tooltip
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Stack, {
  sx: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
  variant: "body2",
  sx: {
    fontWeight: 'semibold'
  }
}, label), tooltip && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Tooltip, {
  title: tooltip
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.InfoCircleIcon, {
  size: 16
})));

/***/ }),

/***/ "./src/pages/Fireblocks/ConnectBitcoinWallet.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/Fireblocks/ConnectBitcoinWallet.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ConnectBitcoinWallet)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _components_FireblocksAvatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/FireblocksAvatar */ "./src/pages/Fireblocks/components/FireblocksAvatar.tsx");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/TextFieldLabel */ "./src/components/common/TextFieldLabel.tsx");
/* harmony import */ var _src_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/LoadingOverlay */ "./src/components/common/LoadingOverlay.tsx");
/* harmony import */ var _hooks_useFireblocksErrorMessage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hooks/useFireblocksErrorMessage */ "./src/pages/Fireblocks/hooks/useFireblocksErrorMessage.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");












function ConnectBitcoinWallet() {
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_9__.useHistory)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__["default"])();
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_3__.useConnectionContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_8__.useAnalyticsContext)();
  const {
    accountId
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_9__.useParams)();
  const [apiKey, setApiKey] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const [secretKey, setSecretKey] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const [errorMessage, setErrorMessage] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const {
    getErrorMessage
  } = (0,_hooks_useFireblocksErrorMessage__WEBPACK_IMPORTED_MODULE_7__.useFireblocksErrorMessage)();
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const onNextStep = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => {
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__["default"].success(t('New Account Added!'), {
      duration: 2000
    });
    history.push('/accounts');
  }, [history, t]);
  const onConnect = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => {
    if (!apiKey || !secretKey) {
      return;
    }
    setIsLoading(true);
    request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_2__.ExtensionRequest.FIREBLOCKS_UPDATE_API_CREDENTIALS,
      params: [accountId, apiKey, secretKey]
    }).then(() => {
      capture('ImportWithFireblocks_Success_BTC');
      onNextStep();
    }).catch(err => {
      setApiKey('');
      setSecretKey('');
      setErrorMessage(getErrorMessage(err));
    }).finally(() => setIsLoading(false));
  }, [accountId, capture, getErrorMessage, apiKey, onNextStep, request, secretKey]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: 1,
      backgroundColor: 'background.paper'
    }
  }, isLoading && /*#__PURE__*/React.createElement(_src_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_6__.LoadingOverlay, null), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitle, {
    margin: "20px 0 4px",
    onBackClick: onNextStep
  }, t('Connect Bitcoin Wallet')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Scrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      gap: 2.5,
      px: 5,
      mt: 3,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_components_FireblocksAvatar__WEBPACK_IMPORTED_MODULE_1__.FireblocksAvatar, {
    badgeIcon: "bitcoin"
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, null, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_14__.Trans, {
    i18nKey: "Open your Fireblocks account to access your API and Secret Key. <docsLink>Learn more</docsLink>.",
    components: {
      docsLink: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Link, {
        href: "https://support.avax.network/en/articles/8506107-core-extension-how-do-i-import-a-fireblocks-account",
        target: "_blank",
        rel: "noopener noreferrer"
      })
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      pt: 3,
      px: 2,
      width: '100%',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_5__.TextFieldLabel, {
    label: t('Input API Key'),
    tooltip: t('The API key can be found in the Fireblocks console')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.TextField, {
    "data-testid": "input-api-key",
    type: "password",
    onChange: e => {
      setApiKey(e.target.value);
      setErrorMessage('');
    },
    placeholder: t('Input API Key'),
    size: "large",
    fullWidth: true,
    sx: {
      mb: 2
    },
    value: apiKey,
    error: !!errorMessage
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      pt: 3,
      px: 2,
      width: '100%',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_5__.TextFieldLabel, {
    label: t('Input Secret Key'),
    tooltip: t('The secret key can be assigned by the Fireblocks workspace admin')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.TextField, {
    "data-testid": "input-secret-key",
    type: "password",
    onChange: e => {
      setSecretKey(e.target.value);
      setErrorMessage('');
    },
    placeholder: t('Input Secret Key'),
    size: "large",
    fullWidth: true,
    sx: {
      mb: 2
    },
    value: secretKey,
    error: !!errorMessage
  })), !!errorMessage && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "caption",
    sx: {
      color: theme.palette.error.main
    }
  }, errorMessage)))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      pb: 3,
      pt: 2,
      px: 2,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    color: "secondary",
    "data-testid": "bitcoin-wallet-skip-button",
    onClick: onNextStep,
    fullWidth: true,
    size: "large"
  }, t('Skip')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    "data-testid": "bitcoin-wallet-next-button",
    onClick: onConnect,
    fullWidth: true,
    size: "large",
    disabled: !apiKey || !secretKey
  }, t('Connect'))));
}

/***/ }),

/***/ "./src/pages/Fireblocks/components/FireblocksAvatar.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/Fireblocks/components/FireblocksAvatar.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FireblocksAvatar": () => (/* binding */ FireblocksAvatar)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const FireblocksAvatar = ({
  badgeIcon = 'walletConnect'
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Badge, {
  overlap: "circular",
  badgeContent: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Avatar, {
    sx: {
      width: '24px',
      height: '24px',
      backgroundColor: badgeIcon === 'walletConnect' ? 'info.dark' : 'transparent',
      border: '1px solid',
      borderColor: 'background.paper'
    }
  }, badgeIcon === 'walletConnect' && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.WalletConnectIcon, {
    size: 16
  }), badgeIcon === 'bitcoin' && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.BitcoinColorIcon, {
    size: 24
  })),
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Avatar, {
  sx: {
    width: '64px',
    height: '64px',
    background: 'transparent',
    border: '1px solid',
    borderColor: 'primary.main'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.FireblocksIcon, {
  size: 32
})));

/***/ }),

/***/ "./src/pages/Fireblocks/hooks/useFireblocksErrorMessage.ts":
/*!*****************************************************************!*\
  !*** ./src/pages/Fireblocks/hooks/useFireblocksErrorMessage.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useFireblocksErrorMessage": () => (/* binding */ useFireblocksErrorMessage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/fireblocks/models */ "./src/background/services/fireblocks/models.ts");
/* harmony import */ var _src_background_services_fireblocks_utils_getFireblocksBtcAccessErrorCode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/fireblocks/utils/getFireblocksBtcAccessErrorCode */ "./src/background/services/fireblocks/utils/getFireblocksBtcAccessErrorCode.ts");




const useFireblocksErrorMessage = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const getErrorMessage = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(rawMessage => {
    const btcAccessErrorCode = (0,_src_background_services_fireblocks_utils_getFireblocksBtcAccessErrorCode__WEBPACK_IMPORTED_MODULE_2__["default"])(rawMessage);
    switch (btcAccessErrorCode) {
      case _src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_1__.FireblocksBtcAccessErrorCode.BTCAddressNotFound:
        return t('The BTC address could not be found for the connected vault account. Ensure your vault account has BTC wallet with a SEGWIT address format configured.');
      case _src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_1__.FireblocksBtcAccessErrorCode.VaultAccountNotFound:
        return t('Could not find any vault account with the specified EVM address');
      case _src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_1__.FireblocksBtcAccessErrorCode.WrongAccountType:
        return t('Fireblocks API credentials can only be configured for accounts imported from Fireblocks');
      case _src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_1__.FireblocksBtcAccessErrorCode.InvalidSecretKey:
        return t('Invalid secret key was provided. Please make sure it is a valid PEM-encoded PKCS#8 string');
      case _src_background_services_fireblocks_models__WEBPACK_IMPORTED_MODULE_1__.FireblocksBtcAccessErrorCode.SecretsNotConfigured:
        return t('API credentials have not been provided');
      default:
        return t('An error occurred. Please reach out to Core Support');
    }
  }, [t]);
  return {
    getErrorMessage
  };
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0ZpcmVibG9ja3NfQ29ubmVjdEJpdGNvaW5XYWxsZXRfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFnRjtBQVN6RSxNQUFNQywrQkFBK0IsR0FBRyxJQUFJO0FBRTVDLE1BQU1DLDhCQUE4QixHQUFHLENBQzVDRixxRUFBeUIsRUFDekJBLHVFQUEyQixFQUMzQkEsd0VBQTRCLEVBQzVCQSxxRUFBeUIsRUFDekJBLG9FQUF3QixFQUN4QkEsc0VBQTBCLENBQzNCO0FBRU0sTUFBTVMsdUJBQXVCLEdBQUksMkJBQTBCO0FBRTNELElBQUtDLDRCQUE0QiwwQkFBNUJBLDRCQUE0QjtFQUE1QkEsNEJBQTRCLENBQTVCQSw0QkFBNEI7RUFBNUJBLDRCQUE0QixDQUE1QkEsNEJBQTRCO0VBQTVCQSw0QkFBNEIsQ0FBNUJBLDRCQUE0QjtFQUE1QkEsNEJBQTRCLENBQTVCQSw0QkFBNEI7RUFBNUJBLDRCQUE0QixDQUE1QkEsNEJBQTRCO0VBQUEsT0FBNUJBLDRCQUE0QjtBQUFBO0FBUWpDLE1BQU1DLHdCQUF3QixTQUFTQyxLQUFLLENBQUM7RUFDbERDLFdBQVdBLENBQVFDLElBQWtDLEVBQUU7SUFDckQsS0FBSyxDQUFFLEdBQUVMLHVCQUF3QixHQUFFSyxJQUFLLEVBQUMsQ0FBQztJQUFDLEtBRDFCQSxJQUFrQyxHQUFsQ0EsSUFBa0M7RUFFckQ7QUFDRjtBQUVPLElBQUtDLG1CQUFtQiwwQkFBbkJBLG1CQUFtQjtFQUFuQkEsbUJBQW1CO0VBQW5CQSxtQkFBbUI7RUFBbkJBLG1CQUFtQjtFQUFuQkEsbUJBQW1CO0VBQW5CQSxtQkFBbUI7RUFBbkJBLG1CQUFtQjtFQUFBLE9BQW5CQSxtQkFBbUI7QUFBQTs7QUFTL0I7QUFDTyxNQUFNQyxxQkFBcUIsR0FBRyxDQUNuQyxVQUFVO0FBQUU7QUFDWixXQUFXO0FBQUU7QUFDYixXQUFXO0FBQUU7QUFDYixXQUFXLENBQUU7QUFBQSxDQUNkOztBQUVEO0FBQ0E7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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqRG1DO0FBQ1c7QUFFMkM7QUFDOEI7QUFFakgsTUFBTWlCLHlCQUF5QixHQUFHQSxDQUFBLEtBQU07RUFDN0MsTUFBTTtJQUFFSTtFQUFFLENBQUMsR0FBR1osNkRBQWMsRUFBRTtFQUU5QixNQUFNdUIsZUFBZSxHQUFHakIsa0RBQVcsQ0FDaEMyRSxVQUFrQixJQUFLO0lBQ3RCLE1BQU1DLGtCQUFrQixHQUFHbEgscUhBQStCLENBQUNpSCxVQUFVLENBQUM7SUFFdEUsUUFBUUMsa0JBQWtCO01BQ3hCLEtBQUszSCx1SEFBK0M7UUFDbEQsT0FBT3FELENBQUMsQ0FDTix1SkFBdUosQ0FDeEo7TUFFSCxLQUFLckQseUhBQWlEO1FBQ3BELE9BQU9xRCxDQUFDLENBQ04saUVBQWlFLENBQ2xFO01BRUgsS0FBS3JELHFIQUE2QztRQUNoRCxPQUFPcUQsQ0FBQyxDQUNOLHlGQUF5RixDQUMxRjtNQUVILEtBQUtyRCxxSEFBNkM7UUFDaEQsT0FBT3FELENBQUMsQ0FDTiwyRkFBMkYsQ0FDNUY7TUFFSCxLQUFLckQseUhBQWlEO1FBQ3BELE9BQU9xRCxDQUFDLENBQUMsd0NBQXdDLENBQUM7TUFFcEQ7UUFDRSxPQUFPQSxDQUFDLENBQUMscURBQXFELENBQUM7SUFBQztFQUV0RSxDQUFDLEVBQ0QsQ0FBQ0EsQ0FBQyxDQUFDLENBQ0o7RUFFRCxPQUFPO0lBQ0xXO0VBQ0YsQ0FBQztBQUNILENBQUM7Ozs7Ozs7Ozs7QUMvQ0Q7Ozs7Ozs7Ozs7QUNBQSIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9maXJlYmxvY2tzL21vZGVscy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmlyZWJsb2Nrcy91dGlscy9nZXRGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3JDb2RlLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vTG9hZGluZ092ZXJsYXkudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vVGV4dEZpZWxkTGFiZWwudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvRmlyZWJsb2Nrcy9Db25uZWN0Qml0Y29pbldhbGxldC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9GaXJlYmxvY2tzL2NvbXBvbmVudHMvRmlyZWJsb2Nrc0F2YXRhci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9GaXJlYmxvY2tzL2hvb2tzL3VzZUZpcmVibG9ja3NFcnJvck1lc3NhZ2UudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi9pZ25vcmVkfC9Vc2Vycy9jc2FiYS52YWx5aS9wcmovY29yZS1leHRlbnNpb24vbm9kZV9tb2R1bGVzL0BzdGFibGVsaWIvcmFuZG9tL2xpYi9zb3VyY2V8Y3J5cHRvIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vaWdub3JlZHwvVXNlcnMvY3NhYmEudmFseWkvcHJqL2NvcmUtZXh0ZW5zaW9uL25vZGVfbW9kdWxlcy9zaWRlLWNoYW5uZWwvbm9kZV9tb2R1bGVzL29iamVjdC1pbnNwZWN0fC4vdXRpbC5pbnNwZWN0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlc3RpbmF0aW9uVHJhbnNmZXJQZWVyUGF0aCwgVHJhbnNhY3Rpb25TdGF0dXMgfSBmcm9tICdmaXJlYmxvY2tzLXNkayc7XG5pbXBvcnQgeyBLZXlMaWtlIH0gZnJvbSAnam9zZSc7XG5pbXBvcnQge1xuICBBZGRyZXNzUmVzcG9uc2UgYXMgX0FkZHJlc3NSZXNwb25zZSxcbiAgUGFnaW5hdGVkQWRkcmVzc2VzUmVzcG9uc2UgYXMgX1BhZ2luYXRlZEFkZHJlc3Nlc1Jlc3BvbnNlLFxufSBmcm9tICdmaXJlYmxvY2tzLXNkayc7XG5cbmV4cG9ydCB0eXBlIEtub3duQWRkcmVzc0RpY3Rpb25hcnkgPSBNYXA8c3RyaW5nLCBEZXN0aW5hdGlvblRyYW5zZmVyUGVlclBhdGg+O1xuXG5leHBvcnQgY29uc3QgVFJBTlNBQ1RJT05fUE9MTElOR19JTlRFUlZBTF9NUyA9IDIwMDA7XG5cbmV4cG9ydCBjb25zdCBUWF9TVUJNSVNTSU9OX0ZBSUxVUkVfU1RBVFVTRVMgPSBbXG4gIFRyYW5zYWN0aW9uU3RhdHVzLkJMT0NLRUQsXG4gIFRyYW5zYWN0aW9uU3RhdHVzLkNBTkNFTExFRCxcbiAgVHJhbnNhY3Rpb25TdGF0dXMuQ0FOQ0VMTElORyxcbiAgVHJhbnNhY3Rpb25TdGF0dXMuVElNRU9VVCxcbiAgVHJhbnNhY3Rpb25TdGF0dXMuRkFJTEVELFxuICBUcmFuc2FjdGlvblN0YXR1cy5SRUpFQ1RFRCxcbl07XG5cbmV4cG9ydCBjb25zdCBCVENfQUNDRVNTX0VSUk9SX1BSRUZJWCA9IGBGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3I6YDtcblxuZXhwb3J0IGVudW0gRmlyZWJsb2Nrc0J0Y0FjY2Vzc0Vycm9yQ29kZSB7XG4gIFZhdWx0QWNjb3VudE5vdEZvdW5kLFxuICBCVENBZGRyZXNzTm90Rm91bmQsXG4gIEludmFsaWRTZWNyZXRLZXksXG4gIFdyb25nQWNjb3VudFR5cGUsXG4gIFNlY3JldHNOb3RDb25maWd1cmVkLFxufVxuXG5leHBvcnQgY2xhc3MgRmlyZWJsb2Nrc0J0Y0FjY2Vzc0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29kZTogRmlyZWJsb2Nrc0J0Y0FjY2Vzc0Vycm9yQ29kZSkge1xuICAgIHN1cGVyKGAke0JUQ19BQ0NFU1NfRVJST1JfUFJFRklYfSR7Y29kZX1gKTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBGaXJlYmxvY2tzRXJyb3JDb2RlIHtcbiAgRmFpbGVkID0gJ2ZpcmVibG9ja3MtdHgtZmFpbGVkJyxcbiAgQmxvY2tlZCA9ICdmaXJlYmxvY2tzLXR4LWJsb2NrZWQnLFxuICBDYW5jZWxsZWQgPSAnZmlyZWJsb2Nrcy10eC1jYW5jZWxsZWQnLFxuICBSZWplY3RlZCA9ICdmaXJlYmxvY2tzLXR4LXJlamVjdGVkJyxcbiAgVGltZW91dCA9ICdmaXJlYmxvY2tzLXR4LXRpbWVvdXQnLFxuICBVbmtub3duID0gJ2ZpcmVibG9ja3MtdHgtdW5rbm93bi1lcnJvcicsXG59XG5cbi8vIE9uIFRlc3RuZXQgRmlyZWJsb2NrcyB3b3Jrc3BhY2VzLCB3ZSByZXF1aXJlIHRoZSBjb25uZWN0ZWQgdmF1bHQgdG8gaGF2ZSBvbmUgb2YgdGhvc2Ugd2FsbGV0cyBjcmVhdGVkLlxuZXhwb3J0IGNvbnN0IFRFU1RORVRfTE9PS1VQX0FTU0VUUyA9IFtcbiAgJ0FWQVhURVNUJywgLy8gQXZhbGFuY2hlIEZ1amlcbiAgJ0VUSF9URVNUMycsIC8vIEV0aGVyZXVtIEdvZXJsaVxuICAnRVRIX1RFU1Q0JywgLy8gRXRoZXJldW0gUmlua2VieVxuICAnRVRIX1RFU1Q1JywgLy8gRXRoZXJldW0gU2Vwb2xpYVxuXTtcblxuLy8gT24gTWFpbm5ldCBGaXJlYmxvY2tzIHdvcmtzcGFjZXMsIHdlIHJlcXVpcmUgdGhlIGNvbm5lY3RlZCB2YXVsdCB0byBoYXZlIG9uZSBvZiB0aG9zZSB3YWxsZXRzIGNyZWF0ZWQuXG4vLyBXZSBuZWVkIHN1Y2ggYSB3YWxsZXQgdG8gYmUgY3JlYXRlZCwgc28gdGhhdCB3ZSBjYW4gZmluZCB0aGUgdmF1bHQgYWNjb3VudCB1c2VkIHRvIGNvbm5lY3QgdmlhIFdhbGxldENvbm5lY3QuXG4vLyBLbm93aW5nIHRoZSB2YXVsdCBhY2NvdW50IGFsbG93cyB1cyB0byBmaW5kIHRoZSBtYXRjaGluZyBCVEMgYWRkcmVzcy5cbmV4cG9ydCBjb25zdCBNQUlOTkVUX0xPT0tVUF9BU1NFVFMgPSBbJ0FWQVgnXTtcblxuZXhwb3J0IGNvbnN0IEZJUkVCTE9DS1NfUkVRVUVTVF9FWFBJUlkgPSAxMjAgKiA2MDsgLy8gMiBob3VycywgdXNlZCBvbmx5IGJ5IFdhbGxldENvbm5lY3QgY29ubmVjdGlvbnNcblxuZXhwb3J0IGludGVyZmFjZSBGaXJlYmxvY2tzU2VjcmV0c1Byb3ZpZGVyIHtcbiAgZ2V0U2VjcmV0cygpOiBQcm9taXNlPHsgYXBpS2V5OiBzdHJpbmc7IHByaXZhdGVLZXk6IEtleUxpa2UgfT47XG59XG5cbmV4cG9ydCB0eXBlIEFkZHJlc3NSZXNwb25zZSA9IE9taXQ8X0FkZHJlc3NSZXNwb25zZSwgJ3R5cGUnPiAmIHtcbiAgdHlwZT86IHN0cmluZztcbn07XG4vLyB0aGlzIGlzIHVzZWQgYXMgYSByZXBsYWNlbWVudCBmb3IgUGFnaW5hdGVkQWRkcmVzc2VzUmVzcG9uc2UgZnJvbSBmaXJlYmxvY2tzIHNka1xuLy8gZHVlIHRvIHdyb25nIHR5cGUgZGVjbGFyYXRpb25zXG5leHBvcnQgdHlwZSBQYWdpbmF0ZWRBZGRyZXNzZXNSZXNwb25zZSA9IE9taXQ8XG4gIF9QYWdpbmF0ZWRBZGRyZXNzZXNSZXNwb25zZSxcbiAgJ2FkZHJlc3Nlcydcbj4gJiB7XG4gIGFkZHJlc3NlczogQWRkcmVzc1Jlc3BvbnNlW107XG59O1xuIiwiaW1wb3J0IHsgQlRDX0FDQ0VTU19FUlJPUl9QUkVGSVggfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3JDb2RlKG1lc3NhZ2U6IHN0cmluZykge1xuICBjb25zdCBbLCBjb2RlXSA9IG1lc3NhZ2Uuc3BsaXQoQlRDX0FDQ0VTU19FUlJPUl9QUkVGSVgpO1xuXG4gIGlmICh0eXBlb2YgY29kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgY29kZSA9PT0gJycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBwYXJzZUludChjb2RlKTtcbn1cbiIsImltcG9ydCB7IENpcmN1bGFyUHJvZ3Jlc3MgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJy4vT3ZlcmxheSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBMb2FkaW5nT3ZlcmxheSgpIHtcbiAgcmV0dXJuIChcbiAgICA8T3ZlcmxheT5cbiAgICAgIDxDaXJjdWxhclByb2dyZXNzIC8+XG4gICAgPC9PdmVybGF5PlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgSW5mb0NpcmNsZUljb24sXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbnRlcmZhY2UgVGV4dEZpZWxkTGFiZWxQcm9wcyB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHRvb2x0aXA/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBUZXh0RmllbGRMYWJlbCA9ICh7IGxhYmVsLCB0b29sdGlwIH06IFRleHRGaWVsZExhYmVsUHJvcHMpID0+IChcbiAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxIH19PlxuICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGZvbnRXZWlnaHQ6ICdzZW1pYm9sZCcgfX0+XG4gICAgICB7bGFiZWx9XG4gICAgPC9UeXBvZ3JhcGh5PlxuICAgIHt0b29sdGlwICYmIChcbiAgICAgIDxUb29sdGlwIHRpdGxlPXt0b29sdGlwfT5cbiAgICAgICAgPEluZm9DaXJjbGVJY29uIHNpemU9ezE2fSAvPlxuICAgICAgPC9Ub29sdGlwPlxuICAgICl9XG4gIDwvU3RhY2s+XG4pO1xuIiwiaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBTdGFjayxcbiAgVGV4dEZpZWxkLFxuICBUeXBvZ3JhcGh5LFxuICB0b2FzdCxcbiAgdXNlVGhlbWUsXG4gIFNjcm9sbGJhcnMsXG4gIExpbmssXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZUhpc3RvcnksIHVzZVBhcmFtcyB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IHsgRmlyZWJsb2Nrc0F2YXRhciB9IGZyb20gJy4vY29tcG9uZW50cy9GaXJlYmxvY2tzQXZhdGFyJztcbmltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUZXh0RmllbGRMYWJlbCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vVGV4dEZpZWxkTGFiZWwnO1xuaW1wb3J0IHsgTG9hZGluZ092ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0xvYWRpbmdPdmVybGF5JztcbmltcG9ydCB7IEZpcmVibG9ja3NVcGRhdGVBcGlDcmVkZW50aWFsc0hhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmlyZWJsb2Nrcy9oYW5kbGVycy9maXJlYmxvY2tzVXBkYXRlQXBpQ3JlZGVudGlhbHMnO1xuaW1wb3J0IHsgdXNlRmlyZWJsb2Nrc0Vycm9yTWVzc2FnZSB9IGZyb20gJy4vaG9va3MvdXNlRmlyZWJsb2Nrc0Vycm9yTWVzc2FnZSc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbm5lY3RCaXRjb2luV2FsbGV0KCkge1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgeyBhY2NvdW50SWQgfSA9IHVzZVBhcmFtczx7XG4gICAgYWNjb3VudElkOiBzdHJpbmc7XG4gIH0+KCk7XG4gIGNvbnN0IFthcGlLZXksIHNldEFwaUtleV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtzZWNyZXRLZXksIHNldFNlY3JldEtleV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtlcnJvck1lc3NhZ2UsIHNldEVycm9yTWVzc2FnZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IHsgZ2V0RXJyb3JNZXNzYWdlIH0gPSB1c2VGaXJlYmxvY2tzRXJyb3JNZXNzYWdlKCk7XG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3Qgb25OZXh0U3RlcCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICB0b2FzdC5zdWNjZXNzKHQoJ05ldyBBY2NvdW50IEFkZGVkIScpLCB7IGR1cmF0aW9uOiAyMDAwIH0pO1xuICAgIGhpc3RvcnkucHVzaCgnL2FjY291bnRzJyk7XG4gIH0sIFtoaXN0b3J5LCB0XSk7XG5cbiAgY29uc3Qgb25Db25uZWN0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICghYXBpS2V5IHx8ICFzZWNyZXRLZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgcmVxdWVzdDxGaXJlYmxvY2tzVXBkYXRlQXBpQ3JlZGVudGlhbHNIYW5kbGVyPih7XG4gICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuRklSRUJMT0NLU19VUERBVEVfQVBJX0NSRURFTlRJQUxTLFxuICAgICAgcGFyYW1zOiBbYWNjb3VudElkLCBhcGlLZXksIHNlY3JldEtleV0sXG4gICAgfSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgY2FwdHVyZSgnSW1wb3J0V2l0aEZpcmVibG9ja3NfU3VjY2Vzc19CVEMnKTtcbiAgICAgICAgb25OZXh0U3RlcCgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHNldEFwaUtleSgnJyk7XG4gICAgICAgIHNldFNlY3JldEtleSgnJyk7XG4gICAgICAgIHNldEVycm9yTWVzc2FnZShnZXRFcnJvck1lc3NhZ2UoZXJyKSk7XG4gICAgICB9KVxuICAgICAgLmZpbmFsbHkoKCkgPT4gc2V0SXNMb2FkaW5nKGZhbHNlKSk7XG4gIH0sIFtcbiAgICBhY2NvdW50SWQsXG4gICAgY2FwdHVyZSxcbiAgICBnZXRFcnJvck1lc3NhZ2UsXG4gICAgYXBpS2V5LFxuICAgIG9uTmV4dFN0ZXAsXG4gICAgcmVxdWVzdCxcbiAgICBzZWNyZXRLZXksXG4gIF0pO1xuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2JhY2tncm91bmQucGFwZXInLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7aXNMb2FkaW5nICYmIDxMb2FkaW5nT3ZlcmxheSAvPn1cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxQYWdlVGl0bGUgbWFyZ2luPVwiMjBweCAwIDRweFwiIG9uQmFja0NsaWNrPXtvbk5leHRTdGVwfT5cbiAgICAgICAgICB7dCgnQ29ubmVjdCBCaXRjb2luIFdhbGxldCcpfVxuICAgICAgICA8L1BhZ2VUaXRsZT5cbiAgICAgICAgPFNjcm9sbGJhcnM+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBnYXA6IDIuNSxcbiAgICAgICAgICAgICAgcHg6IDUsXG4gICAgICAgICAgICAgIG10OiAzLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEZpcmVibG9ja3NBdmF0YXIgYmFkZ2VJY29uPVwiYml0Y29pblwiIC8+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgICAgaTE4bktleT1cIk9wZW4geW91ciBGaXJlYmxvY2tzIGFjY291bnQgdG8gYWNjZXNzIHlvdXIgQVBJIGFuZCBTZWNyZXQgS2V5LiA8ZG9jc0xpbms+TGVhcm4gbW9yZTwvZG9jc0xpbms+LlwiXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgICAgICAgICAgZG9jc0xpbms6IChcbiAgICAgICAgICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9zdXBwb3J0LmF2YXgubmV0d29yay9lbi9hcnRpY2xlcy84NTA2MTA3LWNvcmUtZXh0ZW5zaW9uLWhvdy1kby1pLWltcG9ydC1hLWZpcmVibG9ja3MtYWNjb3VudFwiXG4gICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBwdDogMywgcHg6IDIsIHdpZHRoOiAnMTAwJScsIGdhcDogMSB9fT5cbiAgICAgICAgICAgIDxUZXh0RmllbGRMYWJlbFxuICAgICAgICAgICAgICBsYWJlbD17dCgnSW5wdXQgQVBJIEtleScpfVxuICAgICAgICAgICAgICB0b29sdGlwPXt0KCdUaGUgQVBJIGtleSBjYW4gYmUgZm91bmQgaW4gdGhlIEZpcmVibG9ja3MgY29uc29sZScpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJpbnB1dC1hcGkta2V5XCJcbiAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0QXBpS2V5KGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICBzZXRFcnJvck1lc3NhZ2UoJycpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnSW5wdXQgQVBJIEtleScpfVxuICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgICAgc3g9e3sgbWI6IDIgfX1cbiAgICAgICAgICAgICAgdmFsdWU9e2FwaUtleX1cbiAgICAgICAgICAgICAgZXJyb3I9eyEhZXJyb3JNZXNzYWdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBwdDogMywgcHg6IDIsIHdpZHRoOiAnMTAwJScsIGdhcDogMSB9fT5cbiAgICAgICAgICAgIDxUZXh0RmllbGRMYWJlbFxuICAgICAgICAgICAgICBsYWJlbD17dCgnSW5wdXQgU2VjcmV0IEtleScpfVxuICAgICAgICAgICAgICB0b29sdGlwPXt0KFxuICAgICAgICAgICAgICAgICdUaGUgc2VjcmV0IGtleSBjYW4gYmUgYXNzaWduZWQgYnkgdGhlIEZpcmVibG9ja3Mgd29ya3NwYWNlIGFkbWluJyxcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiaW5wdXQtc2VjcmV0LWtleVwiXG4gICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFNlY3JldEtleShlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgc2V0RXJyb3JNZXNzYWdlKCcnKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0lucHV0IFNlY3JldCBLZXknKX1cbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgbWI6IDIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHZhbHVlPXtzZWNyZXRLZXl9XG4gICAgICAgICAgICAgIGVycm9yPXshIWVycm9yTWVzc2FnZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICB7ISFlcnJvck1lc3NhZ2UgJiYgKFxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IHB4OiAyIH19PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICBzeD17eyBjb2xvcjogdGhlbWUucGFsZXR0ZS5lcnJvci5tYWluIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7ZXJyb3JNZXNzYWdlfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICAgIDwvU3RhY2s+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICBwYjogMyxcbiAgICAgICAgICBwdDogMixcbiAgICAgICAgICBweDogMixcbiAgICAgICAgICBnYXA6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJiaXRjb2luLXdhbGxldC1za2lwLWJ1dHRvblwiXG4gICAgICAgICAgb25DbGljaz17b25OZXh0U3RlcH1cbiAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICA+XG4gICAgICAgICAge3QoJ1NraXAnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImJpdGNvaW4td2FsbGV0LW5leHQtYnV0dG9uXCJcbiAgICAgICAgICBvbkNsaWNrPXtvbkNvbm5lY3R9XG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBkaXNhYmxlZD17IWFwaUtleSB8fCAhc2VjcmV0S2V5fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ0Nvbm5lY3QnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBBdmF0YXIsXG4gIEJhZGdlLFxuICBCaXRjb2luQ29sb3JJY29uLFxuICBGaXJlYmxvY2tzSWNvbixcbiAgV2FsbGV0Q29ubmVjdEljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmludGVyZmFjZSBGaXJlYmxvY2tzQXZhdGFyUHJvcHMge1xuICBiYWRnZUljb24/OiAnd2FsbGV0Q29ubmVjdCcgfCAnYml0Y29pbic7XG59XG5cbmV4cG9ydCBjb25zdCBGaXJlYmxvY2tzQXZhdGFyID0gKHtcbiAgYmFkZ2VJY29uID0gJ3dhbGxldENvbm5lY3QnLFxufTogRmlyZWJsb2Nrc0F2YXRhclByb3BzKSA9PiAoXG4gIDxCYWRnZVxuICAgIG92ZXJsYXA9XCJjaXJjdWxhclwiXG4gICAgYmFkZ2VDb250ZW50PXtcbiAgICAgIDxBdmF0YXJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzI0cHgnLFxuICAgICAgICAgIGhlaWdodDogJzI0cHgnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjpcbiAgICAgICAgICAgIGJhZGdlSWNvbiA9PT0gJ3dhbGxldENvbm5lY3QnID8gJ2luZm8uZGFyaycgOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCcsXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICdiYWNrZ3JvdW5kLnBhcGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge2JhZGdlSWNvbiA9PT0gJ3dhbGxldENvbm5lY3QnICYmIDxXYWxsZXRDb25uZWN0SWNvbiBzaXplPXsxNn0gLz59XG4gICAgICAgIHtiYWRnZUljb24gPT09ICdiaXRjb2luJyAmJiA8Qml0Y29pbkNvbG9ySWNvbiBzaXplPXsyNH0gLz59XG4gICAgICA8L0F2YXRhcj5cbiAgICB9XG4gICAgYW5jaG9yT3JpZ2luPXt7XG4gICAgICB2ZXJ0aWNhbDogJ2JvdHRvbScsXG4gICAgICBob3Jpem9udGFsOiAncmlnaHQnLFxuICAgIH19XG4gID5cbiAgICA8QXZhdGFyXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzY0cHgnLFxuICAgICAgICBoZWlnaHQ6ICc2NHB4JyxcbiAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkJyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICdwcmltYXJ5Lm1haW4nLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8RmlyZWJsb2Nrc0ljb24gc2l6ZT17MzJ9IC8+XG4gICAgPC9BdmF0YXI+XG4gIDwvQmFkZ2U+XG4pO1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyBGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3JDb2RlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2ZpcmVibG9ja3MvbW9kZWxzJztcbmltcG9ydCBnZXRGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3JDb2RlIGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9maXJlYmxvY2tzL3V0aWxzL2dldEZpcmVibG9ja3NCdGNBY2Nlc3NFcnJvckNvZGUnO1xuXG5leHBvcnQgY29uc3QgdXNlRmlyZWJsb2Nrc0Vycm9yTWVzc2FnZSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IGdldEVycm9yTWVzc2FnZSA9IHVzZUNhbGxiYWNrKFxuICAgIChyYXdNZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGJ0Y0FjY2Vzc0Vycm9yQ29kZSA9IGdldEZpcmVibG9ja3NCdGNBY2Nlc3NFcnJvckNvZGUocmF3TWVzc2FnZSk7XG5cbiAgICAgIHN3aXRjaCAoYnRjQWNjZXNzRXJyb3JDb2RlKSB7XG4gICAgICAgIGNhc2UgRmlyZWJsb2Nrc0J0Y0FjY2Vzc0Vycm9yQ29kZS5CVENBZGRyZXNzTm90Rm91bmQ6XG4gICAgICAgICAgcmV0dXJuIHQoXG4gICAgICAgICAgICAnVGhlIEJUQyBhZGRyZXNzIGNvdWxkIG5vdCBiZSBmb3VuZCBmb3IgdGhlIGNvbm5lY3RlZCB2YXVsdCBhY2NvdW50LiBFbnN1cmUgeW91ciB2YXVsdCBhY2NvdW50IGhhcyBCVEMgd2FsbGV0IHdpdGggYSBTRUdXSVQgYWRkcmVzcyBmb3JtYXQgY29uZmlndXJlZC4nLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgY2FzZSBGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3JDb2RlLlZhdWx0QWNjb3VudE5vdEZvdW5kOlxuICAgICAgICAgIHJldHVybiB0KFxuICAgICAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIGFueSB2YXVsdCBhY2NvdW50IHdpdGggdGhlIHNwZWNpZmllZCBFVk0gYWRkcmVzcycsXG4gICAgICAgICAgKTtcblxuICAgICAgICBjYXNlIEZpcmVibG9ja3NCdGNBY2Nlc3NFcnJvckNvZGUuV3JvbmdBY2NvdW50VHlwZTpcbiAgICAgICAgICByZXR1cm4gdChcbiAgICAgICAgICAgICdGaXJlYmxvY2tzIEFQSSBjcmVkZW50aWFscyBjYW4gb25seSBiZSBjb25maWd1cmVkIGZvciBhY2NvdW50cyBpbXBvcnRlZCBmcm9tIEZpcmVibG9ja3MnLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgY2FzZSBGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3JDb2RlLkludmFsaWRTZWNyZXRLZXk6XG4gICAgICAgICAgcmV0dXJuIHQoXG4gICAgICAgICAgICAnSW52YWxpZCBzZWNyZXQga2V5IHdhcyBwcm92aWRlZC4gUGxlYXNlIG1ha2Ugc3VyZSBpdCBpcyBhIHZhbGlkIFBFTS1lbmNvZGVkIFBLQ1MjOCBzdHJpbmcnLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgY2FzZSBGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3JDb2RlLlNlY3JldHNOb3RDb25maWd1cmVkOlxuICAgICAgICAgIHJldHVybiB0KCdBUEkgY3JlZGVudGlhbHMgaGF2ZSBub3QgYmVlbiBwcm92aWRlZCcpO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHQoJ0FuIGVycm9yIG9jY3VycmVkLiBQbGVhc2UgcmVhY2ggb3V0IHRvIENvcmUgU3VwcG9ydCcpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3RdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0RXJyb3JNZXNzYWdlLFxuICB9O1xufTtcbiIsIi8qIChpZ25vcmVkKSAqLyIsIi8qIChpZ25vcmVkKSAqLyJdLCJuYW1lcyI6WyJUcmFuc2FjdGlvblN0YXR1cyIsIlRSQU5TQUNUSU9OX1BPTExJTkdfSU5URVJWQUxfTVMiLCJUWF9TVUJNSVNTSU9OX0ZBSUxVUkVfU1RBVFVTRVMiLCJCTE9DS0VEIiwiQ0FOQ0VMTEVEIiwiQ0FOQ0VMTElORyIsIlRJTUVPVVQiLCJGQUlMRUQiLCJSRUpFQ1RFRCIsIkJUQ19BQ0NFU1NfRVJST1JfUFJFRklYIiwiRmlyZWJsb2Nrc0J0Y0FjY2Vzc0Vycm9yQ29kZSIsIkZpcmVibG9ja3NCdGNBY2Nlc3NFcnJvciIsIkVycm9yIiwiY29uc3RydWN0b3IiLCJjb2RlIiwiRmlyZWJsb2Nrc0Vycm9yQ29kZSIsIlRFU1RORVRfTE9PS1VQX0FTU0VUUyIsIk1BSU5ORVRfTE9PS1VQX0FTU0VUUyIsIkZJUkVCTE9DS1NfUkVRVUVTVF9FWFBJUlkiLCJnZXRGaXJlYmxvY2tzQnRjQWNjZXNzRXJyb3JDb2RlIiwibWVzc2FnZSIsInNwbGl0IiwicGFyc2VJbnQiLCJDaXJjdWxhclByb2dyZXNzIiwiT3ZlcmxheSIsIkxvYWRpbmdPdmVybGF5IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiSW5mb0NpcmNsZUljb24iLCJTdGFjayIsIlRvb2x0aXAiLCJUeXBvZ3JhcGh5IiwiVGV4dEZpZWxkTGFiZWwiLCJsYWJlbCIsInRvb2x0aXAiLCJzeCIsImZsZXhEaXJlY3Rpb24iLCJhbGlnbkl0ZW1zIiwiZ2FwIiwidmFyaWFudCIsImZvbnRXZWlnaHQiLCJ0aXRsZSIsInNpemUiLCJCdXR0b24iLCJUZXh0RmllbGQiLCJ0b2FzdCIsInVzZVRoZW1lIiwiU2Nyb2xsYmFycyIsIkxpbmsiLCJQYWdlVGl0bGUiLCJUcmFucyIsInVzZVRyYW5zbGF0aW9uIiwidXNlSGlzdG9yeSIsInVzZVBhcmFtcyIsIkZpcmVibG9ja3NBdmF0YXIiLCJFeHRlbnNpb25SZXF1ZXN0IiwidXNlQ29ubmVjdGlvbkNvbnRleHQiLCJ1c2VDYWxsYmFjayIsInVzZVN0YXRlIiwidXNlRmlyZWJsb2Nrc0Vycm9yTWVzc2FnZSIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJDb25uZWN0Qml0Y29pbldhbGxldCIsImhpc3RvcnkiLCJ0IiwidGhlbWUiLCJyZXF1ZXN0IiwiY2FwdHVyZSIsImFjY291bnRJZCIsImFwaUtleSIsInNldEFwaUtleSIsInNlY3JldEtleSIsInNldFNlY3JldEtleSIsImVycm9yTWVzc2FnZSIsInNldEVycm9yTWVzc2FnZSIsImdldEVycm9yTWVzc2FnZSIsImlzTG9hZGluZyIsInNldElzTG9hZGluZyIsIm9uTmV4dFN0ZXAiLCJzdWNjZXNzIiwiZHVyYXRpb24iLCJwdXNoIiwib25Db25uZWN0IiwibWV0aG9kIiwiRklSRUJMT0NLU19VUERBVEVfQVBJX0NSRURFTlRJQUxTIiwicGFyYW1zIiwidGhlbiIsImNhdGNoIiwiZXJyIiwiZmluYWxseSIsIndpZHRoIiwiYmFja2dyb3VuZENvbG9yIiwiaGVpZ2h0IiwibWFyZ2luIiwib25CYWNrQ2xpY2siLCJweCIsIm10IiwiYmFkZ2VJY29uIiwiaTE4bktleSIsImNvbXBvbmVudHMiLCJkb2NzTGluayIsImhyZWYiLCJ0YXJnZXQiLCJyZWwiLCJwdCIsInR5cGUiLCJvbkNoYW5nZSIsImUiLCJ2YWx1ZSIsInBsYWNlaG9sZGVyIiwiZnVsbFdpZHRoIiwibWIiLCJlcnJvciIsImNvbG9yIiwicGFsZXR0ZSIsIm1haW4iLCJqdXN0aWZ5Q29udGVudCIsInBiIiwib25DbGljayIsImRpc2FibGVkIiwiQXZhdGFyIiwiQmFkZ2UiLCJCaXRjb2luQ29sb3JJY29uIiwiRmlyZWJsb2Nrc0ljb24iLCJXYWxsZXRDb25uZWN0SWNvbiIsIm92ZXJsYXAiLCJiYWRnZUNvbnRlbnQiLCJib3JkZXIiLCJib3JkZXJDb2xvciIsImFuY2hvck9yaWdpbiIsInZlcnRpY2FsIiwiaG9yaXpvbnRhbCIsImJhY2tncm91bmQiLCJyYXdNZXNzYWdlIiwiYnRjQWNjZXNzRXJyb3JDb2RlIiwiQlRDQWRkcmVzc05vdEZvdW5kIiwiVmF1bHRBY2NvdW50Tm90Rm91bmQiLCJXcm9uZ0FjY291bnRUeXBlIiwiSW52YWxpZFNlY3JldEtleSIsIlNlY3JldHNOb3RDb25maWd1cmVkIl0sInNvdXJjZVJvb3QiOiIifQ==