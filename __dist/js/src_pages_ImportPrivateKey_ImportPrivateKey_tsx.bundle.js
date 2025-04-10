"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ImportPrivateKey_ImportPrivateKey_tsx"],{

/***/ "./node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/utils/getBech32Address.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/utils/getBech32Address.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getBech32Address": () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bitcoinjs-lib */ "./node_modules/bitcoinjs-lib/src/index.js");
function o(o,t){return bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_0__.payments.p2wpkh({pubkey:o,network:t}).address}


/***/ }),

/***/ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getBtcAddressFromPubKey.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getBtcAddressFromPubKey.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getBtcAddressFromPubKey": () => (/* binding */ e)
/* harmony export */ });
/* harmony import */ var _BitcoinVM_utils_getBech32Address_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../BitcoinVM/utils/getBech32Address.js */ "./node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/utils/getBech32Address.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/strip0x.js");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/crypto/signing-key.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js")["Buffer"];
function e(e,i){const s=(0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__.strip0x)(ethers__WEBPACK_IMPORTED_MODULE_1__.SigningKey.computePublicKey(e,!0)),m=Buffer.from(s,"hex");return (0,_BitcoinVM_utils_getBech32Address_js__WEBPACK_IMPORTED_MODULE_2__.getBech32Address)(m,i)}


/***/ }),

/***/ "./node_modules/@avalabs/core-wallets-sdk/esm/utils/getPublicKeyFromPrivateKey.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@avalabs/core-wallets-sdk/esm/utils/getPublicKeyFromPrivateKey.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getPublicKeyFromPrivateKey": () => (/* binding */ r)
/* harmony export */ });
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js")["Buffer"];
function r(r){const e=Buffer.isBuffer(r)?r:Buffer.from(r,"hex");try{return Buffer.from(_avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_0__.secp256k1.getPublicKey(e))}finally{e.fill(0)}}


/***/ }),

/***/ "./src/hooks/useBalanceTotalInCurrency.ts":
/*!************************************************!*\
  !*** ./src/hooks/useBalanceTotalInCurrency.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useBalanceTotalInCurrency": () => (/* binding */ useBalanceTotalInCurrency)
/* harmony export */ });
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function useBalanceTotalInCurrency(account) {
  const {
    getTotalBalance
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_0__.useBalancesContext)();
  return (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (!account?.addressC) {
      return null;
    }
    return getTotalBalance(account.addressC);
  }, [account?.addressC, getTotalBalance]);
}

/***/ }),

/***/ "./src/hooks/useScopedToast.ts":
/*!*************************************!*\
  !*** ./src/hooks/useScopedToast.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useScopedToast": () => (/* binding */ useScopedToast)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");


const useScopedToast = id => {
  const success = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((...[message, opts]) => {
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"].dismiss(id);
    return _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"].success(message, {
      ...opts,
      id: id
    });
  }, [id]);
  const error = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((...[message, opts]) => {
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"].dismiss(id);
    return _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"].error(message, {
      ...opts,
      id: id
    });
  }, [id]);
  return {
    success,
    error
  };
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/usePrivateKeyImport.ts":
/*!*********************************************************!*\
  !*** ./src/pages/Accounts/hooks/usePrivateKeyImport.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "usePrivateKeyImport": () => (/* binding */ usePrivateKeyImport)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* harmony import */ var _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/monitoring/sentryCaptureException */ "./src/monitoring/sentryCaptureException.ts");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");





const usePrivateKeyImport = () => {
  const [isImporting, setIsImporting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    addAccount
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_3__.useAccountsContext)();
  const importPrivateKey = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async privateKey => {
    setIsImporting(true);
    try {
      const accountId = await addAccount('', {
        importType: _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_2__.ImportType.PRIVATE_KEY,
        data: _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_4__.utils.strip0x(privateKey)
      });
      return accountId;
    } catch (err) {
      (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__["default"])(err, _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__.SentryExceptionTypes.WALLET_IMPORT);
      throw err;
    } finally {
      setIsImporting(false);
    }
  }, [addAccount]);
  return {
    isImporting,
    importPrivateKey
  };
};

/***/ }),

/***/ "./src/pages/ImportPrivateKey/ImportPrivateKey.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/ImportPrivateKey/ImportPrivateKey.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImportPrivateKey": () => (/* binding */ ImportPrivateKey)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/utils/getPublicKeyFromPrivateKey.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getEvmAddressFromPubKey.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getBtcAddressFromPubKey.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_hooks_useBalanceTotalInCurrency__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/hooks/useBalanceTotalInCurrency */ "./src/hooks/useBalanceTotalInCurrency.ts");
/* harmony import */ var bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! bitcoinjs-lib */ "./node_modules/bitcoinjs-lib/src/index.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _components_DerivedAddress__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/DerivedAddress */ "./src/pages/ImportPrivateKey/components/DerivedAddress.tsx");
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* harmony import */ var _Accounts_hooks_usePrivateKeyImport__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Accounts/hooks/usePrivateKeyImport */ "./src/pages/Accounts/hooks/usePrivateKeyImport.ts");
/* harmony import */ var _src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/hooks/useScopedToast */ "./src/hooks/useScopedToast.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _components_DuplicatedAccountDialog__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/DuplicatedAccountDialog */ "./src/pages/ImportPrivateKey/components/DuplicatedAccountDialog.tsx");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


















function ImportPrivateKey() {
  const {
    currency,
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__.useSettingsContext)();
  const {
    updateBalanceOnNetworks
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_2__.useBalancesContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_1__.useAnalyticsContext)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"])();
  const toast = (0,_src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_11__.useScopedToast)('account-switcher');
  const [hasFocus, setHasFocus] = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)(false);
  const [privateKey, setPrivateKey] = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)('');
  const [derivedAddresses, setDerivedAddresses] = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)();
  const [isBalanceLoading, setIsBalanceLoading] = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)('');
  const [isFormDirty, setIsFormDirty] = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)(false);
  const balance = (0,_src_hooks_useBalanceTotalInCurrency__WEBPACK_IMPORTED_MODULE_5__.useBalanceTotalInCurrency)(derivedAddresses);
  const {
    isImporting: isImportLoading,
    importPrivateKey
  } = (0,_Accounts_hooks_usePrivateKeyImport__WEBPACK_IMPORTED_MODULE_10__.usePrivateKeyImport)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_15__.useHistory)();
  const {
    allAccounts,
    selectAccount
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_12__.useAccountsContext)();
  const [isKnownAccount, setIsKnownAccount] = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)(false);
  const [isDuplicatedAccountDialogOpen, setIsDuplicatedAccountDialogOpen] = (0,react__WEBPACK_IMPORTED_MODULE_8__.useState)(false);
  const checkIfAccountExists = (0,react__WEBPACK_IMPORTED_MODULE_8__.useCallback)(address => {
    const findAccount = allAccounts.find(({
      addressC
    }) => addressC.toLowerCase() === address.toLowerCase());
    if (findAccount) {
      setIsKnownAccount(true);
    }
  }, [allAccounts]);
  const isLoading = hasFocus && !derivedAddresses && !error;
  const handleImport = async () => {
    capture('ImportPrivateKeyClicked');
    if (isKnownAccount && !isDuplicatedAccountDialogOpen) {
      setIsDuplicatedAccountDialogOpen(true);
      return;
    }
    try {
      const importedAccountId = await importPrivateKey(privateKey);
      await selectAccount(importedAccountId);
      toast.success((0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Private Key Imported'), {
        duration: 1000
      });
      capture('ImportPrivateKeySucceeded');
      history.replace(`/accounts`);
    } catch (err) {
      toast.error((0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Private Key Import Failed'), {
        duration: 1000
      });
      console.error(err);
    }
  };
  (0,react__WEBPACK_IMPORTED_MODULE_8__.useEffect)(() => {
    function errorHandler() {
      setDerivedAddresses(undefined);
      setError((0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Invalid key. Please re-enter the key.'));
    }
    const strippedPk = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_16__.utils.strip0x(privateKey);
    if (strippedPk.length === 64) {
      try {
        const publicKey = (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_17__.getPublicKeyFromPrivateKey)(strippedPk);
        const addressC = (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_18__.getEvmAddressFromPubKey)(publicKey);
        checkIfAccountExists(addressC);
        const addressBTC = (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_19__.getBtcAddressFromPubKey)(publicKey, network?.isTestnet ? bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_6__.networks.testnet : bitcoinjs_lib__WEBPACK_IMPORTED_MODULE_6__.networks.bitcoin);
        setDerivedAddresses({
          addressC,
          addressBTC
        });
        setError('');
      } catch (_err) {
        errorHandler();
      }
    } else {
      errorHandler();
    }
  }, [checkIfAccountExists, isKnownAccount, network?.isTestnet, privateKey]);
  (0,react__WEBPACK_IMPORTED_MODULE_8__.useEffect)(() => {
    if (derivedAddresses && updateBalanceOnNetworks) {
      setIsBalanceLoading(true);
      updateBalanceOnNetworks([derivedAddresses]).finally(() => setIsBalanceLoading(false));
    }
  }, [derivedAddresses, updateBalanceOnNetworks]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, isKnownAccount && /*#__PURE__*/React.createElement(_components_DuplicatedAccountDialog__WEBPACK_IMPORTED_MODULE_13__.DuplicatedAccountDialog, {
    onClose: () => setIsDuplicatedAccountDialogOpen(false),
    onConfirm: () => handleImport(),
    open: isDuplicatedAccountDialogOpen
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      background: theme.palette.background.paper
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitle, {
    margin: '24px 0 8px',
    onBackClick: () => history.goBack()
  }, (0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Import Private Key')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      px: 2,
      gap: 3,
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      gap: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.TextField, {
    autoFocus: true,
    onKeyDown: e => {
      if (e.key === 'Enter') {
        handleImport();
      }
    },
    "data-testid": "import-private-key-input",
    fullWidth: true,
    label: (0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Enter Private Key'),
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: 'body2.fontSize'
      }
    },
    onChange: e => {
      setIsKnownAccount(false);
      setPrivateKey(e.target.value);
      if (!isFormDirty) setIsFormDirty(true);
    },
    value: privateKey,
    placeholder: (0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Enter Private Key'),
    type: "password",
    onFocus: () => setHasFocus(true),
    onBlur: () => setHasFocus(false)
  }), error && isFormDirty ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Typography, {
    variant: "caption",
    color: theme.palette.error.main
  }, error) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Typography, {
    variant: "caption"
  }, (0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Add an account by entering a private key'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, (0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Derived Addresses')), /*#__PURE__*/React.createElement(_components_DerivedAddress__WEBPACK_IMPORTED_MODULE_9__.DerivedAddress, {
    networkType: _components_DerivedAddress__WEBPACK_IMPORTED_MODULE_9__.NetworkType.AVALANCHE,
    address: derivedAddresses?.addressC ?? '',
    isLoading: isLoading
  }), /*#__PURE__*/React.createElement(_components_DerivedAddress__WEBPACK_IMPORTED_MODULE_9__.DerivedAddress, {
    networkType: _components_DerivedAddress__WEBPACK_IMPORTED_MODULE_9__.NetworkType.BITCOIN,
    address: derivedAddresses?.addressBTC ?? '',
    isLoading: isLoading
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    direction: "row",
    sx: {
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, (0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Total Balance')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Typography, {
    variant: "body2"
  }, isBalanceLoading ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.CircularProgress, {
    size: 16
  }) : balance !== null && balance?.sum ? currencyFormatter(balance?.sum).replace(currency, '') : '-')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      pt: 2,
      pb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Button, {
    "data-testid": "import-private-key-button",
    size: "large",
    disabled: !derivedAddresses || isImportLoading,
    fullWidth: true,
    onClick: handleImport,
    isLoading: isImportLoading,
    sx: {
      gap: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.DownloadIcon, {
    size: 16
  }), (0,i18next__WEBPACK_IMPORTED_MODULE_7__.t)('Import Private Key'))))));
}

/***/ }),

/***/ "./src/pages/ImportPrivateKey/components/DerivedAddress.tsx":
/*!******************************************************************!*\
  !*** ./src/pages/ImportPrivateKey/components/DerivedAddress.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DerivedAddress": () => (/* binding */ DerivedAddress),
/* harmony export */   "NetworkType": () => (/* binding */ NetworkType)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

let NetworkType = /*#__PURE__*/function (NetworkType) {
  NetworkType["AVALANCHE"] = "avalanche";
  NetworkType["BITCOIN"] = "bitcoin";
  return NetworkType;
}({});
function DerivedAddress({
  networkType,
  address,
  isLoading
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const iconStyles = {
    filter: address ? 'none' : 'grayscale(1)'
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    direction: "row",
    sx: {
      gap: 1,
      py: 1,
      px: 2,
      alignItems: 'center',
      background: theme.palette.grey[850],
      borderRadius: 1,
      height: 56
    }
  }, networkType === NetworkType.AVALANCHE ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AvalancheColorIcon, {
    size: 18,
    sx: iconStyles
  }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.BitcoinColorIcon, {
    size: 18,
    sx: iconStyles
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    direction: "row",
    sx: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    sx: {
      wordBreak: 'break-all'
    }
  }, address), isLoading && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, {
    size: 16
  })));
}

/***/ }),

/***/ "./src/pages/ImportPrivateKey/components/DuplicatedAccountDialog.tsx":
/*!***************************************************************************!*\
  !*** ./src/pages/ImportPrivateKey/components/DuplicatedAccountDialog.tsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DuplicatedAccountDialog": () => (/* binding */ DuplicatedAccountDialog)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function DuplicatedAccountDialog({
  onClose,
  onConfirm,
  ...props
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Dialog, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    PaperProps: {
      sx: {
        m: 2
      }
    },
    sx: {
      textAlign: 'center'
    }
  }, props), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.DialogTitle, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, t('Import Duplicate Account?'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.DialogContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2"
  }, t('This account has already been imported, do you want to continue?'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.DialogActions, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    onClick: onConfirm,
    variant: "contained",
    size: "large",
    "data-testid": "import-private-key-confirm-button"
  }, t('Import')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    onClick: onClose,
    variant: "text",
    "data-testid": "import-private-key-cancel-button"
  }, t('Cancel'))));
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0ltcG9ydFByaXZhdGVLZXlfSW1wb3J0UHJpdmF0ZUtleV90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQXlDLGdCQUFnQixPQUFPLDBEQUFRLEVBQUUsbUJBQW1CLFVBQXdDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQThCLGdCQUFnQixRQUFRLGdFQUFDLENBQUMsK0RBQWtCLFVBQVUsTUFBTSxlQUFlLE9BQU8sc0ZBQUMsTUFBMkM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQWhQLGNBQWMsUUFBUSxNQUFNLGVBQWUsTUFBTSxlQUFlLElBQUksT0FBTyxNQUFNLE1BQU0sd0VBQWMsS0FBSyxRQUFRLFdBQW1EOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0NsSjtBQUNwQztBQUV6QixTQUFTRSx5QkFBeUJBLENBQUNDLE9BQWlCLEVBQUU7RUFDM0QsTUFBTTtJQUFFQztFQUFnQixDQUFDLEdBQUdKLGtGQUFrQixFQUFFO0VBRWhELE9BQU9DLDhDQUFPLENBQUMsTUFBTTtJQUNuQixJQUFJLENBQUNFLE9BQU8sRUFBRUUsUUFBUSxFQUFFO01BQ3RCLE9BQU8sSUFBSTtJQUNiO0lBRUEsT0FBT0QsZUFBZSxDQUFDRCxPQUFPLENBQUNFLFFBQVEsQ0FBQztFQUMxQyxDQUFDLEVBQUUsQ0FBQ0YsT0FBTyxFQUFFRSxRQUFRLEVBQUVELGVBQWUsQ0FBQyxDQUFDO0FBQzFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDZG9DO0FBQ2dCO0FBRTdDLE1BQU1JLGNBQWMsR0FBSUMsRUFBVSxJQUFLO0VBQzVDLE1BQU1DLE9BQU8sR0FBR0osa0RBQVcsQ0FDekIsQ0FBQyxHQUFHLENBQUNLLE9BQU8sRUFBRUMsSUFBSSxDQUFtQyxLQUFLO0lBQ3hETCwyRUFBYSxDQUFDRSxFQUFFLENBQUM7SUFFakIsT0FBT0YsMkVBQWEsQ0FBQ0ksT0FBTyxFQUFFO01BQUUsR0FBR0MsSUFBSTtNQUFFSCxFQUFFLEVBQUVBO0lBQUcsQ0FBQyxDQUFDO0VBQ3BELENBQUMsRUFDRCxD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QyxhQUFBLENBQUMyRCxzRUFBYTtJQUFDdEQsRUFBRSxFQUFFO01BQUVVLEdBQUcsRUFBRTtJQUFFO0VBQUUsZ0JBQzVCaEIsS0FBQSxDQUFBQyxhQUFBLENBQUN0RSwrREFBTTtJQUNMc0gsT0FBTyxFQUFFN0MsU0FBVTtJQUNuQjZCLE9BQU8sRUFBQyxXQUFXO0lBQ25CUyxJQUFJLEVBQUMsT0FBTztJQUNaLGVBQVk7RUFBbUMsR0FFOUNoRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ0wsZUFDVHNELEtBQUEsQ0FBQUMsYUFBQSxDQUFDdEUsK0RBQU07SUFDTHNILE9BQU8sRUFBRTlDLE9BQVE7SUFDakI4QixPQUFPLEVBQUMsTUFBTTtJQUNkLGVBQVk7RUFBa0MsR0FFN0N2RixDQUFDLENBQUMsUUFBUSxDQUFDLENBQ0wsQ0FDSyxDQUNUO0FBRWIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsvZXNtL0JpdGNvaW5WTS91dGlscy9nZXRCZWNoMzJBZGRyZXNzLmpzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkay9lc20vRVZNL3V0aWxzL2dldEJ0Y0FkZHJlc3NGcm9tUHViS2V5LmpzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkay9lc20vdXRpbHMvZ2V0UHVibGljS2V5RnJvbVByaXZhdGVLZXkuanMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VCYWxhbmNlVG90YWxJbkN1cnJlbmN5LnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlU2NvcGVkVG9hc3QudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9ob29rcy91c2VQcml2YXRlS2V5SW1wb3J0LnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSW1wb3J0UHJpdmF0ZUtleS9JbXBvcnRQcml2YXRlS2V5LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0ltcG9ydFByaXZhdGVLZXkvY29tcG9uZW50cy9EZXJpdmVkQWRkcmVzcy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9JbXBvcnRQcml2YXRlS2V5L2NvbXBvbmVudHMvRHVwbGljYXRlZEFjY291bnREaWFsb2cudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydHtwYXltZW50cyBhcyByfWZyb21cImJpdGNvaW5qcy1saWJcIjtmdW5jdGlvbiBvKG8sdCl7cmV0dXJuIHIucDJ3cGtoKHtwdWJrZXk6byxuZXR3b3JrOnR9KS5hZGRyZXNzfWV4cG9ydHtvIGFzIGdldEJlY2gzMkFkZHJlc3N9O1xuIiwiaW1wb3J0e2dldEJlY2gzMkFkZHJlc3MgYXMgcn1mcm9tXCIuLi8uLi9CaXRjb2luVk0vdXRpbHMvZ2V0QmVjaDMyQWRkcmVzcy5qc1wiO2ltcG9ydHtzdHJpcDB4IGFzIG99ZnJvbVwiQGF2YWxhYnMvY29yZS11dGlscy1zZGtcIjtpbXBvcnR7U2lnbmluZ0tleSBhcyB0fWZyb21cImV0aGVyc1wiO2Z1bmN0aW9uIGUoZSxpKXtjb25zdCBzPW8odC5jb21wdXRlUHVibGljS2V5KGUsITApKSxtPUJ1ZmZlci5mcm9tKHMsXCJoZXhcIik7cmV0dXJuIHIobSxpKX1leHBvcnR7ZSBhcyBnZXRCdGNBZGRyZXNzRnJvbVB1YktleX07XG4iLCJpbXBvcnR7c2VjcDI1NmsxIGFzIGZ9ZnJvbVwiQGF2YWxhYnMvYXZhbGFuY2hlanNcIjtmdW5jdGlvbiByKHIpe2NvbnN0IGU9QnVmZmVyLmlzQnVmZmVyKHIpP3I6QnVmZmVyLmZyb20ocixcImhleFwiKTt0cnl7cmV0dXJuIEJ1ZmZlci5mcm9tKGYuZ2V0UHVibGljS2V5KGUpKX1maW5hbGx5e2UuZmlsbCgwKX19ZXhwb3J0e3IgYXMgZ2V0UHVibGljS2V5RnJvbVByaXZhdGVLZXl9O1xuIiwiaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQmFsYW5jZXNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9CYWxhbmNlc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VCYWxhbmNlVG90YWxJbkN1cnJlbmN5KGFjY291bnQ/OiBBY2NvdW50KSB7XG4gIGNvbnN0IHsgZ2V0VG90YWxCYWxhbmNlIH0gPSB1c2VCYWxhbmNlc0NvbnRleHQoKTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFhY2NvdW50Py5hZGRyZXNzQykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldFRvdGFsQmFsYW5jZShhY2NvdW50LmFkZHJlc3NDKTtcbiAgfSwgW2FjY291bnQ/LmFkZHJlc3NDLCBnZXRUb3RhbEJhbGFuY2VdKTtcbn1cbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdG9hc3QgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgdXNlU2NvcGVkVG9hc3QgPSAoaWQ6IHN0cmluZykgPT4ge1xuICBjb25zdCBzdWNjZXNzID0gdXNlQ2FsbGJhY2soXG4gICAgKC4uLlttZXNzYWdlLCBvcHRzXTogUGFyYW1ldGVyczx0eXBlb2YgdG9hc3Quc3VjY2Vzcz4pID0+IHtcbiAgICAgIHRvYXN0LmRpc21pc3MoaWQpO1xuXG4gICAgICByZXR1cm4gdG9hc3Quc3VjY2VzcyhtZXNzYWdlLCB7IC4uLm9wdHMsIGlkOiBpZCB9KTtcbiAgICB9LFxuICAgIFtpZF0sXG4gICk7XG5cbiAgY29uc3QgZXJyb3IgPSB1c2VDYWxsYmFjayhcbiAgICAoLi4uW21lc3NhZ2UsIG9wdHNdOiBQYXJhbWV0ZXJzPHR5cGVvZiB0b2FzdC5lcnJvcj4pID0+IHtcbiAgICAgIHRvYXN0LmRpc21pc3MoaWQpO1xuXG4gICAgICByZXR1cm4gdG9hc3QuZXJyb3IobWVzc2FnZSwgeyAuLi5vcHRzLCBpZDogaWQgfSk7XG4gICAgfSxcbiAgICBbaWRdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBlcnJvcixcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gJ0BhdmFsYWJzL2F2YWxhbmNoZWpzJztcblxuaW1wb3J0IHNlbnRyeUNhcHR1cmVFeGNlcHRpb24sIHtcbiAgU2VudHJ5RXhjZXB0aW9uVHlwZXMsXG59IGZyb20gJ0BzcmMvbW9uaXRvcmluZy9zZW50cnlDYXB0dXJlRXhjZXB0aW9uJztcbmltcG9ydCB7IEltcG9ydFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5cbmV4cG9ydCBjb25zdCB1c2VQcml2YXRlS2V5SW1wb3J0ID0gKCkgPT4ge1xuICBjb25zdCBbaXNJbXBvcnRpbmcsIHNldElzSW1wb3J0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCB7IGFkZEFjY291bnQgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuXG4gIGNvbnN0IGltcG9ydFByaXZhdGVLZXkgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAocHJpdmF0ZUtleTogc3RyaW5nKSA9PiB7XG4gICAgICBzZXRJc0ltcG9ydGluZyh0cnVlKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYWNjb3VudElkID0gYXdhaXQgYWRkQWNjb3VudCgnJywge1xuICAgICAgICAgIGltcG9ydFR5cGU6IEltcG9ydFR5cGUuUFJJVkFURV9LRVksXG4gICAgICAgICAgZGF0YTogdXRpbHMuc3RyaXAweChwcml2YXRlS2V5KSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFjY291bnRJZDtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBzZW50cnlDYXB0dXJlRXhjZXB0aW9uKFxuICAgICAgICAgIGVyciBhcyBFcnJvcixcbiAgICAgICAgICBTZW50cnlFeGNlcHRpb25UeXBlcy5XQUxMRVRfSU1QT1JULFxuICAgICAgICApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRJc0ltcG9ydGluZyhmYWxzZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbYWRkQWNjb3VudF0sXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBpc0ltcG9ydGluZyxcbiAgICBpbXBvcnRQcml2YXRlS2V5LFxuICB9O1xufTtcbiIsImltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgRG93bmxvYWRJY29uLFxuICBTdGFjayxcbiAgVGV4dEZpZWxkLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7XG4gIGdldEJ0Y0FkZHJlc3NGcm9tUHViS2V5LFxuICBnZXRFdm1BZGRyZXNzRnJvbVB1YktleSxcbiAgZ2V0UHVibGljS2V5RnJvbVByaXZhdGVLZXksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgUGFnZVRpdGxlIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9QYWdlVGl0bGUnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQmFsYW5jZXNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9CYWxhbmNlc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUJhbGFuY2VUb3RhbEluQ3VycmVuY3kgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUJhbGFuY2VUb3RhbEluQ3VycmVuY3knO1xuaW1wb3J0IHsgbmV0d29ya3MgfSBmcm9tICdiaXRjb2luanMtbGliJztcbmltcG9ydCB7IHQgfSBmcm9tICdpMThuZXh0JztcbmltcG9ydCB7IEtleWJvYXJkRXZlbnQsIHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IHsgRGVyaXZlZEFkZHJlc3MsIE5ldHdvcmtUeXBlIH0gZnJvbSAnLi9jb21wb25lbnRzL0Rlcml2ZWRBZGRyZXNzJztcbmltcG9ydCB7IHV0aWxzIH0gZnJvbSAnQGF2YWxhYnMvYXZhbGFuY2hlanMnO1xuaW1wb3J0IHsgdXNlUHJpdmF0ZUtleUltcG9ydCB9IGZyb20gJy4uL0FjY291bnRzL2hvb2tzL3VzZVByaXZhdGVLZXlJbXBvcnQnO1xuaW1wb3J0IHsgdXNlU2NvcGVkVG9hc3QgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVNjb3BlZFRvYXN0JztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyBEdXBsaWNhdGVkQWNjb3VudERpYWxvZyB9IGZyb20gJy4vY29tcG9uZW50cy9EdXBsaWNhdGVkQWNjb3VudERpYWxvZyc7XG5cbnR5cGUgRGVyaXZlZEFkZHJlc3NlcyA9IHtcbiAgYWRkcmVzc0M6IHN0cmluZztcbiAgYWRkcmVzc0JUQzogc3RyaW5nO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEltcG9ydFByaXZhdGVLZXkoKSB7XG4gIGNvbnN0IHsgY3VycmVuY3ksIGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgY29uc3QgeyB1cGRhdGVCYWxhbmNlT25OZXR3b3JrcyB9ID0gdXNlQmFsYW5jZXNDb250ZXh0KCk7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgdG9hc3QgPSB1c2VTY29wZWRUb2FzdCgnYWNjb3VudC1zd2l0Y2hlcicpO1xuICBjb25zdCBbaGFzRm9jdXMsIHNldEhhc0ZvY3VzXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3ByaXZhdGVLZXksIHNldFByaXZhdGVLZXldID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbZGVyaXZlZEFkZHJlc3Nlcywgc2V0RGVyaXZlZEFkZHJlc3Nlc10gPSB1c2VTdGF0ZTxEZXJpdmVkQWRkcmVzc2VzPigpO1xuICBjb25zdCBbaXNCYWxhbmNlTG9hZGluZywgc2V0SXNCYWxhbmNlTG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbaXNGb3JtRGlydHksIHNldElzRm9ybURpcnR5XSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgYmFsYW5jZSA9IHVzZUJhbGFuY2VUb3RhbEluQ3VycmVuY3koZGVyaXZlZEFkZHJlc3NlcyBhcyBBY2NvdW50KTtcbiAgY29uc3QgeyBpc0ltcG9ydGluZzogaXNJbXBvcnRMb2FkaW5nLCBpbXBvcnRQcml2YXRlS2V5IH0gPVxuICAgIHVzZVByaXZhdGVLZXlJbXBvcnQoKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcbiAgY29uc3QgeyBhbGxBY2NvdW50cywgc2VsZWN0QWNjb3VudCB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG4gIGNvbnN0IFtpc0tub3duQWNjb3VudCwgc2V0SXNLbm93bkFjY291bnRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNEdXBsaWNhdGVkQWNjb3VudERpYWxvZ09wZW4sIHNldElzRHVwbGljYXRlZEFjY291bnREaWFsb2dPcGVuXSA9XG4gICAgdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGNoZWNrSWZBY2NvdW50RXhpc3RzID0gdXNlQ2FsbGJhY2soXG4gICAgKGFkZHJlc3MpID0+IHtcbiAgICAgIGNvbnN0IGZpbmRBY2NvdW50ID0gYWxsQWNjb3VudHMuZmluZChcbiAgICAgICAgKHsgYWRkcmVzc0MgfSkgPT4gYWRkcmVzc0MudG9Mb3dlckNhc2UoKSA9PT0gYWRkcmVzcy50b0xvd2VyQ2FzZSgpLFxuICAgICAgKTtcbiAgICAgIGlmIChmaW5kQWNjb3VudCkge1xuICAgICAgICBzZXRJc0tub3duQWNjb3VudCh0cnVlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFthbGxBY2NvdW50c10sXG4gICk7XG5cbiAgY29uc3QgaXNMb2FkaW5nID0gaGFzRm9jdXMgJiYgIWRlcml2ZWRBZGRyZXNzZXMgJiYgIWVycm9yO1xuXG4gIGNvbnN0IGhhbmRsZUltcG9ydCA9IGFzeW5jICgpID0+IHtcbiAgICBjYXB0dXJlKCdJbXBvcnRQcml2YXRlS2V5Q2xpY2tlZCcpO1xuICAgIGlmIChpc0tub3duQWNjb3VudCAmJiAhaXNEdXBsaWNhdGVkQWNjb3VudERpYWxvZ09wZW4pIHtcbiAgICAgIHNldElzRHVwbGljYXRlZEFjY291bnREaWFsb2dPcGVuKHRydWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgY29uc3QgaW1wb3J0ZWRBY2NvdW50SWQgPSBhd2FpdCBpbXBvcnRQcml2YXRlS2V5KHByaXZhdGVLZXkpO1xuICAgICAgYXdhaXQgc2VsZWN0QWNjb3VudChpbXBvcnRlZEFjY291bnRJZCk7XG4gICAgICB0b2FzdC5zdWNjZXNzKHQoJ1ByaXZhdGUgS2V5IEltcG9ydGVkJyksIHsgZHVyYXRpb246IDEwMDAgfSk7XG4gICAgICBjYXB0dXJlKCdJbXBvcnRQcml2YXRlS2V5U3VjY2VlZGVkJyk7XG4gICAgICBoaXN0b3J5LnJlcGxhY2UoYC9hY2NvdW50c2ApO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdG9hc3QuZXJyb3IodCgnUHJpdmF0ZSBLZXkgSW1wb3J0IEZhaWxlZCcpLCB7IGR1cmF0aW9uOiAxMDAwIH0pO1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH1cbiAgfTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlcigpIHtcbiAgICAgIHNldERlcml2ZWRBZGRyZXNzZXModW5kZWZpbmVkKTtcbiAgICAgIHNldEVycm9yKHQoJ0ludmFsaWQga2V5LiBQbGVhc2UgcmUtZW50ZXIgdGhlIGtleS4nKSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyaXBwZWRQayA9IHV0aWxzLnN0cmlwMHgocHJpdmF0ZUtleSk7XG5cbiAgICBpZiAoc3RyaXBwZWRQay5sZW5ndGggPT09IDY0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwdWJsaWNLZXkgPSBnZXRQdWJsaWNLZXlGcm9tUHJpdmF0ZUtleShzdHJpcHBlZFBrKTtcblxuICAgICAgICBjb25zdCBhZGRyZXNzQyA9IGdldEV2bUFkZHJlc3NGcm9tUHViS2V5KHB1YmxpY0tleSk7XG4gICAgICAgIGNoZWNrSWZBY2NvdW50RXhpc3RzKGFkZHJlc3NDKTtcblxuICAgICAgICBjb25zdCBhZGRyZXNzQlRDID0gZ2V0QnRjQWRkcmVzc0Zyb21QdWJLZXkoXG4gICAgICAgICAgcHVibGljS2V5LFxuICAgICAgICAgIG5ldHdvcms/LmlzVGVzdG5ldCA/IG5ldHdvcmtzLnRlc3RuZXQgOiBuZXR3b3Jrcy5iaXRjb2luLFxuICAgICAgICApO1xuXG4gICAgICAgIHNldERlcml2ZWRBZGRyZXNzZXMoe1xuICAgICAgICAgIGFkZHJlc3NDLFxuICAgICAgICAgIGFkZHJlc3NCVEMsXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRFcnJvcignJyk7XG4gICAgICB9IGNhdGNoIChfZXJyKSB7XG4gICAgICAgIGVycm9ySGFuZGxlcigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvckhhbmRsZXIoKTtcbiAgICB9XG4gIH0sIFtjaGVja0lmQWNjb3VudEV4aXN0cywgaXNLbm93bkFjY291bnQsIG5ldHdvcms/LmlzVGVzdG5ldCwgcHJpdmF0ZUtleV0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGRlcml2ZWRBZGRyZXNzZXMgJiYgdXBkYXRlQmFsYW5jZU9uTmV0d29ya3MpIHtcbiAgICAgIHNldElzQmFsYW5jZUxvYWRpbmcodHJ1ZSk7XG4gICAgICB1cGRhdGVCYWxhbmNlT25OZXR3b3JrcyhbZGVyaXZlZEFkZHJlc3NlcyBhcyBBY2NvdW50XSkuZmluYWxseSgoKSA9PlxuICAgICAgICBzZXRJc0JhbGFuY2VMb2FkaW5nKGZhbHNlKSxcbiAgICAgICk7XG4gICAgfVxuICB9LCBbZGVyaXZlZEFkZHJlc3NlcywgdXBkYXRlQmFsYW5jZU9uTmV0d29ya3NdKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7aXNLbm93bkFjY291bnQgJiYgKFxuICAgICAgICA8RHVwbGljYXRlZEFjY291bnREaWFsb2dcbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRJc0R1cGxpY2F0ZWRBY2NvdW50RGlhbG9nT3BlbihmYWxzZSl9XG4gICAgICAgICAgb25Db25maXJtPXsoKSA9PiBoYW5kbGVJbXBvcnQoKX1cbiAgICAgICAgICBvcGVuPXtpc0R1cGxpY2F0ZWRBY2NvdW50RGlhbG9nT3Blbn1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgIGJhY2tncm91bmQ6IHRoZW1lLnBhbGV0dGUuYmFja2dyb3VuZC5wYXBlcixcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFBhZ2VUaXRsZSBtYXJnaW49eycyNHB4IDAgOHB4J30gb25CYWNrQ2xpY2s9eygpID0+IGhpc3RvcnkuZ29CYWNrKCl9PlxuICAgICAgICAgIHt0KCdJbXBvcnQgUHJpdmF0ZSBLZXknKX1cbiAgICAgICAgPC9QYWdlVGl0bGU+XG4gICAgICAgIDxTdGFjayBzeD17eyBweDogMiwgZ2FwOiAzLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgZ2FwOiAxLjUgfX0+XG4gICAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgICAgICBvbktleURvd249eyhlOiBLZXlib2FyZEV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICAgICAgICBoYW5kbGVJbXBvcnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiaW1wb3J0LXByaXZhdGUta2V5LWlucHV0XCJcbiAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgIGxhYmVsPXt0KCdFbnRlciBQcml2YXRlIEtleScpfVxuICAgICAgICAgICAgICBpbnB1dExhYmVsUHJvcHM9e3tcbiAgICAgICAgICAgICAgICBzeDogeyB0cmFuc2Zvcm06ICdub25lJywgZm9udFNpemU6ICdib2R5Mi5mb250U2l6ZScgfSxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0SXNLbm93bkFjY291bnQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHNldFByaXZhdGVLZXkoZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmICghaXNGb3JtRGlydHkpIHNldElzRm9ybURpcnR5KHRydWUpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICB2YWx1ZT17cHJpdmF0ZUtleX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0VudGVyIFByaXZhdGUgS2V5Jyl9XG4gICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNldEhhc0ZvY3VzKHRydWUpfVxuICAgICAgICAgICAgICBvbkJsdXI9eygpID0+IHNldEhhc0ZvY3VzKGZhbHNlKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7ZXJyb3IgJiYgaXNGb3JtRGlydHkgPyAoXG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgY29sb3I9e3RoZW1lLnBhbGV0dGUuZXJyb3IubWFpbn0+XG4gICAgICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgIHt0KCdBZGQgYW4gYWNjb3VudCBieSBlbnRlcmluZyBhIHByaXZhdGUga2V5Jyl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDEgfX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnRGVyaXZlZCBBZGRyZXNzZXMnKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxEZXJpdmVkQWRkcmVzc1xuICAgICAgICAgICAgICBuZXR3b3JrVHlwZT17TmV0d29ya1R5cGUuQVZBTEFOQ0hFfVxuICAgICAgICAgICAgICBhZGRyZXNzPXtkZXJpdmVkQWRkcmVzc2VzPy5hZGRyZXNzQyA/PyAnJ31cbiAgICAgICAgICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPERlcml2ZWRBZGRyZXNzXG4gICAgICAgICAgICAgIG5ldHdvcmtUeXBlPXtOZXR3b3JrVHlwZS5CSVRDT0lOfVxuICAgICAgICAgICAgICBhZGRyZXNzPXtkZXJpdmVkQWRkcmVzc2VzPy5hZGRyZXNzQlRDID8/ICcnfVxuICAgICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1RvdGFsIEJhbGFuY2UnKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgICAgICB7aXNCYWxhbmNlTG9hZGluZyA/IChcbiAgICAgICAgICAgICAgICA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgICAgKSA6IGJhbGFuY2UgIT09IG51bGwgJiYgYmFsYW5jZT8uc3VtID8gKFxuICAgICAgICAgICAgICAgIGN1cnJlbmN5Rm9ybWF0dGVyKGJhbGFuY2U/LnN1bSkucmVwbGFjZShjdXJyZW5jeSwgJycpXG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgJy0nXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgICAgcHQ6IDIsXG4gICAgICAgICAgICAgIHBiOiAzLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiaW1wb3J0LXByaXZhdGUta2V5LWJ1dHRvblwiXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXshZGVyaXZlZEFkZHJlc3NlcyB8fCBpc0ltcG9ydExvYWRpbmd9XG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVJbXBvcnR9XG4gICAgICAgICAgICAgIGlzTG9hZGluZz17aXNJbXBvcnRMb2FkaW5nfVxuICAgICAgICAgICAgICBzeD17eyBnYXA6IDEuNSB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8RG93bmxvYWRJY29uIHNpemU9ezE2fSAvPlxuICAgICAgICAgICAgICB7dCgnSW1wb3J0IFByaXZhdGUgS2V5Jyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEF2YWxhbmNoZUNvbG9ySWNvbixcbiAgQml0Y29pbkNvbG9ySWNvbixcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgZW51bSBOZXR3b3JrVHlwZSB7XG4gIEFWQUxBTkNIRSA9ICdhdmFsYW5jaGUnLFxuICBCSVRDT0lOID0gJ2JpdGNvaW4nLFxufVxuXG50eXBlIERlcml2ZWRBZGRyZXNzUHJvcHMgPSB7XG4gIG5ldHdvcmtUeXBlOiBOZXR3b3JrVHlwZTtcbiAgYWRkcmVzczogc3RyaW5nO1xuICBpc0xvYWRpbmc6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gRGVyaXZlZEFkZHJlc3Moe1xuICBuZXR3b3JrVHlwZSxcbiAgYWRkcmVzcyxcbiAgaXNMb2FkaW5nLFxufTogRGVyaXZlZEFkZHJlc3NQcm9wcykge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IGljb25TdHlsZXMgPSB7IGZpbHRlcjogYWRkcmVzcyA/ICdub25lJyA6ICdncmF5c2NhbGUoMSknIH07XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICBzeD17e1xuICAgICAgICBnYXA6IDEsXG4gICAgICAgIHB5OiAxLFxuICAgICAgICBweDogMixcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGJhY2tncm91bmQ6IHRoZW1lLnBhbGV0dGUuZ3JleVs4NTBdLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgIGhlaWdodDogNTYsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtuZXR3b3JrVHlwZSA9PT0gTmV0d29ya1R5cGUuQVZBTEFOQ0hFID8gKFxuICAgICAgICA8QXZhbGFuY2hlQ29sb3JJY29uIHNpemU9ezE4fSBzeD17aWNvblN0eWxlc30gLz5cbiAgICAgICkgOiAoXG4gICAgICAgIDxCaXRjb2luQ29sb3JJY29uIHNpemU9ezE4fSBzeD17aWNvblN0eWxlc30gLz5cbiAgICAgICl9XG4gICAgICA8U3RhY2tcbiAgICAgICAgZGlyZWN0aW9uPVwicm93XCJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IHdvcmRCcmVhazogJ2JyZWFrLWFsbCcgfX0+XG4gICAgICAgICAge2FkZHJlc3N9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAge2lzTG9hZGluZyAmJiA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXsxNn0gLz59XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBCdXR0b24sXG4gIERpYWxvZyxcbiAgRGlhbG9nQWN0aW9ucyxcbiAgRGlhbG9nQ29udGVudCxcbiAgRGlhbG9nUHJvcHMsXG4gIERpYWxvZ1RpdGxlLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxudHlwZSBEdXBsaWNhdGVkQWNjb3VudERpYWxvZ1Byb3BzID0gRGlhbG9nUHJvcHMgJiB7XG4gIG9uQ29uZmlybSgpOiB2b2lkO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIER1cGxpY2F0ZWRBY2NvdW50RGlhbG9nKHtcbiAgb25DbG9zZSxcbiAgb25Db25maXJtLFxuICAuLi5wcm9wc1xufTogRHVwbGljYXRlZEFjY291bnREaWFsb2dQcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIHJldHVybiAoXG4gICAgPERpYWxvZ1xuICAgICAgUGFwZXJQcm9wcz17e1xuICAgICAgICBzeDogeyBtOiAyIH0sXG4gICAgICB9fVxuICAgICAgc3g9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fVxuICAgICAgey4uLnByb3BzfVxuICAgID5cbiAgICAgIDxEaWFsb2dUaXRsZT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+e3QoJ0ltcG9ydCBEdXBsaWNhdGUgQWNjb3VudD8nKX08L1R5cG9ncmFwaHk+XG4gICAgICA8L0RpYWxvZ1RpdGxlPlxuICAgICAgPERpYWxvZ0NvbnRlbnQ+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgIHt0KFxuICAgICAgICAgICAgJ1RoaXMgYWNjb3VudCBoYXMgYWxyZWFkeSBiZWVuIGltcG9ydGVkLCBkbyB5b3Ugd2FudCB0byBjb250aW51ZT8nLFxuICAgICAgICAgICl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvRGlhbG9nQ29udGVudD5cbiAgICAgIDxEaWFsb2dBY3Rpb25zIHN4PXt7IGdhcDogMSB9fT5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e29uQ29uZmlybX1cbiAgICAgICAgICB2YXJpYW50PVwiY29udGFpbmVkXCJcbiAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiaW1wb3J0LXByaXZhdGUta2V5LWNvbmZpcm0tYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdJbXBvcnQnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImltcG9ydC1wcml2YXRlLWtleS1jYW5jZWwtYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0RpYWxvZ0FjdGlvbnM+XG4gICAgPC9EaWFsb2c+XG4gICk7XG59XG4iXSwibmFtZXMiOlsidXNlQmFsYW5jZXNDb250ZXh0IiwidXNlTWVtbyIsInVzZUJhbGFuY2VUb3RhbEluQ3VycmVuY3kiLCJhY2NvdW50IiwiZ2V0VG90YWxCYWxhbmNlIiwiYWRkcmVzc0MiLCJ1c2VDYWxsYmFjayIsInRvYXN0IiwidXNlU2NvcGVkVG9hc3QiLCJpZCIsInN1Y2Nlc3MiLCJtZXNzYWdlIiwib3B0cyIsImRpc21pc3MiLCJlcnJvciIsInVzZVN0YXRlIiwidXRpbHMiLCJzZW50cnlDYXB0dXJlRXhjZXB0aW9uIiwiU2VudHJ5RXhjZXB0aW9uVHlwZXMiLCJJbXBvcnRUeXBlIiwidXNlQWNjb3VudHNDb250ZXh0IiwidXNlUHJpdmF0ZUtleUltcG9ydCIsImlzSW1wb3J0aW5nIiwic2V0SXNJbXBvcnRpbmciLCJhZGRBY2NvdW50IiwiaW1wb3J0UHJpdmF0ZUtleSIsInByaXZhdGVLZXkiLCJhY2NvdW50SWQiLCJpbXBvcnRUeXBlIiwiUFJJVkFURV9LRVkiLCJkYXRhIiwic3RyaXAweCIsImVyciIsIldBTExFVF9JTVBPUlQiLCJCdXR0b24iLCJDaXJjdWxhclByb2dyZXNzIiwiRG93bmxvYWRJY29uIiwiU3RhY2siLCJUZXh0RmllbGQiLCJUeXBvZ3JhcGh5IiwidXNlVGhlbWUiLCJnZXRCdGNBZGRyZXNzRnJvbVB1YktleSIsImdldEV2bUFkZHJlc3NGcm9tUHViS2V5IiwiZ2V0UHVibGljS2V5RnJvbVByaXZhdGVLZXkiLCJQYWdlVGl0bGUiLCJ1c2VBbmFseXRpY3NDb250ZXh0IiwidXNlTmV0d29ya0NvbnRleHQiLCJ1c2VTZXR0aW5nc0NvbnRleHQiLCJuZXR3b3JrcyIsInQiLCJ1c2VFZmZlY3QiLCJ1c2VIaXN0b3J5IiwiRGVyaXZlZEFkZHJlc3MiLCJOZXR3b3JrVHlwZSIsIkR1cGxpY2F0ZWRBY2NvdW50RGlhbG9nIiwiSW1wb3J0UHJpdmF0ZUtleSIsImN1cnJlbmN5IiwiY3VycmVuY3lGb3JtYXR0ZXIiLCJ1cGRhdGVCYWxhbmNlT25OZXR3b3JrcyIsIm5ldHdvcmsiLCJjYXB0dXJlIiwidGhlbWUiLCJoYXNGb2N1cyIsInNldEhhc0ZvY3VzIiwic2V0UHJpdmF0ZUtleSIsImRlcml2ZWRBZGRyZXNzZXMiLCJzZXREZXJpdmVkQWRkcmVzc2VzIiwiaXNCYWxhbmNlTG9hZGluZyIsInNldElzQmFsYW5jZUxvYWRpbmciLCJzZXRFcnJvciIsImlzRm9ybURpcnR5Iiwic2V0SXNGb3JtRGlydHkiLCJiYWxhbmNlIiwiaXNJbXBvcnRMb2FkaW5nIiwiaGlzdG9yeSIsImFsbEFjY291bnRzIiwic2VsZWN0QWNjb3VudCIsImlzS25vd25BY2NvdW50Iiwic2V0SXNLbm93bkFjY291bnQiLCJpc0R1cGxpY2F0ZWRBY2NvdW50RGlhbG9nT3BlbiIsInNldElzRHVwbGljYXRlZEFjY291bnREaWFsb2dPcGVuIiwiY2hlY2tJZkFjY291bnRFeGlzdHMiLCJhZGRyZXNzIiwiZmluZEFjY291bnQiLCJmaW5kIiwidG9Mb3dlckNhc2UiLCJpc0xvYWRpbmciLCJoYW5kbGVJbXBvcnQiLCJpbXBvcnRlZEFjY291bnRJZCIsImR1cmF0aW9uIiwicmVwbGFjZSIsImNvbnNvbGUiLCJlcnJvckhhbmRsZXIiLCJ1bmRlZmluZWQiLCJzdHJpcHBlZFBrIiwibGVuZ3RoIiwicHVibGljS2V5IiwiYWRkcmVzc0JUQyIsImlzVGVzdG5ldCIsInRlc3RuZXQiLCJiaXRjb2luIiwiX2VyciIsImZpbmFsbHkiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJGcmFnbWVudCIsIm9uQ2xvc2UiLCJvbkNvbmZpcm0iLCJvcGVuIiwic3giLCJ3aWR0aCIsImhlaWdodCIsImJhY2tncm91bmQiLCJwYWxldHRlIiwicGFwZXIiLCJtYXJnaW4iLCJvbkJhY2tDbGljayIsImdvQmFjayIsInB4IiwiZ2FwIiwiYXV0b0ZvY3VzIiwib25LZXlEb3duIiwiZSIsImtleSIsImZ1bGxXaWR0aCIsImxhYmVsIiwiaW5wdXRMYWJlbFByb3BzIiwidHJhbnNmb3JtIiwiZm9udFNpemUiLCJvbkNoYW5nZSIsInRhcmdldCIsInZhbHVlIiwicGxhY2Vob2xkZXIiLCJ0eXBlIiwib25Gb2N1cyIsIm9uQmx1ciIsInZhcmlhbnQiLCJjb2xvciIsIm1haW4iLCJmb250V2VpZ2h0IiwibmV0d29ya1R5cGUiLCJBVkFMQU5DSEUiLCJCSVRDT0lOIiwiZGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJzaXplIiwic3VtIiwiZmxleEdyb3ciLCJhbGlnbkl0ZW1zIiwicHQiLCJwYiIsImRpc2FibGVkIiwib25DbGljayIsIkF2YWxhbmNoZUNvbG9ySWNvbiIsIkJpdGNvaW5Db2xvckljb24iLCJpY29uU3R5bGVzIiwiZmlsdGVyIiwicHkiLCJncmV5IiwiYm9yZGVyUmFkaXVzIiwiZmxleCIsIndvcmRCcmVhayIsIkRpYWxvZyIsIkRpYWxvZ0FjdGlvbnMiLCJEaWFsb2dDb250ZW50IiwiRGlhbG9nVGl0bGUiLCJ1c2VUcmFuc2xhdGlvbiIsInByb3BzIiwiX2V4dGVuZHMiLCJQYXBlclByb3BzIiwibSIsInRleHRBbGlnbiJdLCJzb3VyY2VSb290IjoiIn0=