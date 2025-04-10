"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Accounts_AddWalletWithSeedPhrase_tsx"],{

/***/ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getAddressFromXPub.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getAddressFromXPub.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getAddressFromXPub": () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/transaction/address.js");
/* harmony import */ var _getAddressPublicKeyFromXPub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getAddressPublicKeyFromXPub.js */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getAddressPublicKeyFromXPub.js");
function o(o,e){const i=(0,_getAddressPublicKeyFromXPub_js__WEBPACK_IMPORTED_MODULE_0__.getAddressPublicKeyFromXPub)(o,e);return (0,ethers__WEBPACK_IMPORTED_MODULE_1__.computeAddress)(`0x${i.toString("hex")}`)}


/***/ }),

/***/ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getAddressPublicKeyFromXPub.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getAddressPublicKeyFromXPub.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getAddressPublicKeyFromXPub": () => (/* binding */ e)
/* harmony export */ });
/* harmony import */ var bip32__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bip32 */ "./node_modules/bip32/src/index.js");
function e(e,i){return (0,bip32__WEBPACK_IMPORTED_MODULE_0__.fromBase58)(e).derivePath(`0/${i}`).publicKey}


/***/ }),

/***/ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getXpubFromMnemonic.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getXpubFromMnemonic.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getXpubFromMnemonic": () => (/* binding */ e)
/* harmony export */ });
/* harmony import */ var bip32__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bip32 */ "./node_modules/bip32/src/index.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants.js */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/constants.js");
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bip39 */ "./node_modules/@avalabs/core-wallets-sdk/node_modules/bip39/src/index.js");
async function e(e){if(!(0,bip39__WEBPACK_IMPORTED_MODULE_1__.validateMnemonic)(e))throw new Error("Invalid mnemonic phrase.");const i=await (0,bip39__WEBPACK_IMPORTED_MODULE_1__.mnemonicToSeed)(e);return (0,bip32__WEBPACK_IMPORTED_MODULE_0__.fromSeed)(i).derivePath(_constants_js__WEBPACK_IMPORTED_MODULE_2__.ETH_ACCOUNT_PATH).neutered().toBase58()}


/***/ }),

/***/ "./src/hooks/useKeyboardShortcuts.ts":
/*!*******************************************!*\
  !*** ./src/hooks/useKeyboardShortcuts.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useKeyboardShortcuts": () => (/* binding */ useKeyboardShortcuts)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const useKeyboardShortcuts = shortcuts => {
  const onKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async event => {
    const callback = shortcuts[event.key];
    if (typeof callback === 'function') {
      event.preventDefault();
      await callback();
    }
  }, [shortcuts]);
  return {
    onKeyDown
  };
};

/***/ }),

/***/ "./src/pages/Accounts/AddWalletWithSeedPhrase.tsx":
/*!********************************************************!*\
  !*** ./src/pages/Accounts/AddWalletWithSeedPhrase.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddWalletWithSeedPhrase": () => (/* binding */ AddWalletWithSeedPhrase)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getXpubFromMnemonic.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getAddressFromXPub.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _DeFi_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../DeFi/hooks/useConvertedCurrencyFormatter */ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts");
/* harmony import */ var _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/monitoring/sentryCaptureException */ "./src/monitoring/sentryCaptureException.ts");
/* harmony import */ var _components_NameYourWallet__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/NameYourWallet */ "./src/pages/Accounts/components/NameYourWallet.tsx");
/* harmony import */ var _hooks_useImportSeedphrase__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hooks/useImportSeedphrase */ "./src/pages/Accounts/hooks/useImportSeedphrase.ts");
/* harmony import */ var _src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/hooks/useKeyboardShortcuts */ "./src/hooks/useKeyboardShortcuts.ts");
/* harmony import */ var _src_utils_seedPhraseValidation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/utils/seedPhraseValidation */ "./src/utils/seedPhraseValidation.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_hooks_useErrorMessage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/hooks/useErrorMessage */ "./src/hooks/useErrorMessage.ts");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");



















const EMPTY_ADDRESSES = Array(3).fill('');
var Step = /*#__PURE__*/function (Step) {
  Step[Step["Import"] = 0] = "Import";
  Step[Step["Name"] = 1] = "Name";
  return Step;
}(Step || {});
const NoScrollTextField = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.TextField)`
  textarea::-webkit-scrollbar {
    display: none;
  }
`;
function AddWalletWithSeedPhrase() {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__["default"])();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_18__.useHistory)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_19__.useTranslation)();
  const {
    allAccounts
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_11__.useAccountsContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_12__.useAnalyticsContext)();
  const getErrorMessage = (0,_src_hooks_useErrorMessage__WEBPACK_IMPORTED_MODULE_13__.useErrorMessage)();
  const formatCurrency = (0,_DeFi_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_5__.useConvertedCurrencyFormatter)();
  const {
    updateBalanceOnNetworks,
    getTotalBalance
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_4__.useBalancesContext)();
  const {
    isImporting,
    importSeedphrase
  } = (0,_hooks_useImportSeedphrase__WEBPACK_IMPORTED_MODULE_8__.useImportSeedphrase)();
  const [phrase, setPhrase] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [step, setStep] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(Step.Import);
  const [addresses, setAddresses] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(EMPTY_ADDRESSES);
  const [isBalanceLoading, setIsBalanceLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isKnownPhrase, setIsKnownPhrase] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isPhraseValid, setIsPhraseValid] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const deriveAddresses = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async seedPhrase => {
    const xpub = await (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_20__.getXpubFromMnemonic)(seedPhrase.trim().split(/\s+/g).join(' ').toLowerCase());
    setIsPhraseValid(true);
    const addies = [(0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_21__.getAddressFromXPub)(xpub, 0), (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_21__.getAddressFromXPub)(xpub, 1), (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_21__.getAddressFromXPub)(xpub, 2)];
    const isMnemonicKnown = allAccounts.some(({
      addressC
    }) => addressC.toLowerCase() === addies[0]?.toLowerCase());
    if (isMnemonicKnown) {
      setIsKnownPhrase(true);
      return;
    }
    setIsKnownPhrase(false);
    setIsBalanceLoading(true);
    await updateBalanceOnNetworks(addies.map(addressC => ({
      addressC
    })));
    setIsBalanceLoading(false);
    setAddresses(addies);
  }, [allAccounts, updateBalanceOnNetworks]);
  const onContinue = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    if (isPhraseValid && !isKnownPhrase) {
      setStep(Step.Name);
    }
  }, [isPhraseValid, isKnownPhrase]);
  const onPhraseChanged = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async event => {
    const seedPhrase = event.target.value;
    setPhrase(seedPhrase);
    if (!seedPhrase || !(0,_src_utils_seedPhraseValidation__WEBPACK_IMPORTED_MODULE_10__.isPhraseCorrect)(seedPhrase)) {
      setIsPhraseValid(false);
      setAddresses(EMPTY_ADDRESSES);
      setIsKnownPhrase(false);
      return;
    }
    await deriveAddresses(seedPhrase);
  }, [deriveAddresses]);
  const handleImport = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async name => {
    try {
      capture('SeedphraseImportStarted');
      const result = await importSeedphrase({
        mnemonic: phrase.trim().split(/\s+/g).join(' '),
        name
      });
      capture('SeedphraseImportSuccess');
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_22__["default"].success(t('{{walletName}} Added', {
        walletName: result.name
      }));
      history.replace('/accounts');
    } catch (err) {
      capture('SeedphraseImportFailure');
      (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_6__["default"])(err, _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_6__.SentryExceptionTypes.WALLET_IMPORT);
      const {
        title
      } = getErrorMessage(err);
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_22__["default"].error(title);
    }
  }, [capture, getErrorMessage, history, importSeedphrase, phrase, t]);
  const keyboardShortcuts = (0,_src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_9__.useKeyboardShortcuts)({
    Enter: onContinue
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, step === Step.Name && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_14__.Overlay, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_NameYourWallet__WEBPACK_IMPORTED_MODULE_7__.NameYourWallet, {
    isImporting: isImporting,
    onSave: handleImport,
    onBackClick: () => setStep(Step.Import)
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      background: theme.palette.background.paper
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    direction: "row",
    sx: {
      mt: 2.5,
      mb: 0.5,
      pr: 1
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__.PageTitle, {
    onBackClick: () => history.replace('/accounts')
  }, t('Add Wallet with Recovery Phrase'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      px: 2,
      pt: 1,
      flexGrow: 1,
      gap: 3
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(NoScrollTextField, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    autoFocus: true,
    "data-testid": "add-seed-phrase-input",
    fullWidth: true,
    label: t('Enter Recovery Phrase'),
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: 'body2.fontSize',
        mb: 1
      }
    },
    onChange: onPhraseChanged,
    InputProps: {
      autoComplete: 'off',
      sx: {
        p: 1
      }
    },
    helperText: isKnownPhrase ? t('This recovery phrase appears to have already been imported.') : t('Add account(s) by entering a valid recovery phrase.'),
    multiline: true,
    rows: 3,
    value: phrase,
    placeholder: t('Enter Recovery Phrase'),
    error: isKnownPhrase,
    type: "password"
  }, keyboardShortcuts)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'semibold'
    }
  }, t('Derived Addresses')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      gap: 1
    }
  }, addresses.map((address, index) => {
    const balance = address ? getTotalBalance(address) : null;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Card, {
      key: index,
      sx: {
        backgroundColor: 'grey.800'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.CardContent, {
      sx: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 1.5,
        ':last-child': {
          pb: 1.5
        }
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Tooltip, {
      placement: "top",
      title: address
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
      variant: "body1",
      component: "span"
    }, address ? (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_3__.truncateAddress)(address) : '-')), isBalanceLoading ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.CircularProgress, {
      size: 24
    }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
      variant: "body1",
      color: "text.secondary"
    }, typeof balance === 'number' ? formatCurrency(balance) : '')));
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    direction: "row",
    sx: {
      py: 3,
      px: 2,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Tooltip, {
    sx: {
      width: '100%',
      cursor: 'not-allowed'
    },
    title: isPhraseValid ? isKnownPhrase ? t('This recovery phrase appears to have already been imported.') : '' : t('Provided recovery phrase is not valid.')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Button, {
    fullWidth: true,
    disabled: !isPhraseValid || isKnownPhrase,
    size: "large",
    "data-testid": "add-wallet-with-seed-phrase",
    onClick: onContinue,
    startIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.ListIcon, {
      size: 16
    })
  }, t('Add Recovery Phrase'))))));
}

/***/ }),

/***/ "./src/pages/Accounts/components/NameYourWallet.tsx":
/*!**********************************************************!*\
  !*** ./src/pages/Accounts/components/NameYourWallet.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NameYourWallet": () => (/* binding */ NameYourWallet)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useKeyboardShortcuts */ "./src/hooks/useKeyboardShortcuts.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function NameYourWallet({
  isImporting,
  onSave,
  onBackClick,
  backgroundColor
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const [name, setName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const handleSave = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    onSave(name);
  }, [name, onSave]);
  const keyboardShortcuts = (0,_src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_3__.useKeyboardShortcuts)({
    Enter: handleSave,
    Escape: onBackClick
  });
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      background: backgroundColor ?? theme.palette.background.paper
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      mt: 2.5,
      mb: 0.5,
      pr: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__.PageTitle, {
    onBackClick: onBackClick
  }, t('Name your Wallet'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      px: 2,
      pt: 1,
      flexGrow: 1,
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.TextField, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    autoFocus: true,
    "data-testid": "wallet-name-input",
    fullWidth: true,
    label: t('Wallet Name'),
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: 'body2.fontSize',
        mb: 1
      }
    },
    onChange: ev => setName(ev.target.value),
    value: name,
    placeholder: t('My New Wallet')
  }, keyboardShortcuts))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      py: 3,
      px: 2,
      gap: 1,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    fullWidth: true,
    disabled: !name || isImporting,
    isLoading: isImporting,
    size: "large",
    "data-testid": "save-wallet-name",
    onClick: handleSave
  }, t('Save')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    variant: "text",
    fullWidth: true,
    disabled: isImporting,
    size: "large",
    "data-testid": "skip-wallet-name",
    onClick: () => onSave()
  }, t('Skip'))));
}

/***/ }),

/***/ "./src/pages/Accounts/hooks/useImportSeedphrase.ts":
/*!*********************************************************!*\
  !*** ./src/pages/Accounts/hooks/useImportSeedphrase.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useImportSeedphrase": () => (/* binding */ useImportSeedphrase)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");



const useImportSeedphrase = () => {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__.useConnectionContext)();
  const [isImporting, setIsImporting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const importSeedphrase = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async params => {
    setIsImporting(true);
    try {
      const result = await request({
        method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_1__.ExtensionRequest.WALLET_IMPORT_SEED_PHRASE,
        params: [params]
      });
      return result;
    } finally {
      setIsImporting(false);
    }
  }, [request]);
  return {
    isImporting,
    importSeedphrase
  };
};

/***/ }),

/***/ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts":
/*!***************************************************************!*\
  !*** ./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useConvertedCurrencyFormatter": () => (/* binding */ useConvertedCurrencyFormatter)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_CurrenciesProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/CurrenciesProvider */ "./src/contexts/CurrenciesProvider.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_contexts_utils_getCurrencyFormatter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/utils/getCurrencyFormatter */ "./src/contexts/utils/getCurrencyFormatter.ts");




const useConvertedCurrencyFormatter = (sourceCurrency = 'USD') => {
  const {
    convert,
    hasExchangeRate
  } = (0,_src_contexts_CurrenciesProvider__WEBPACK_IMPORTED_MODULE_1__.useCurrenciesContext)();
  const {
    currency: targetCurrency,
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__.useSettingsContext)();
  const fallbackFormatter = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_src_contexts_utils_getCurrencyFormatter__WEBPACK_IMPORTED_MODULE_3__.getCurrencyFormatter)(sourceCurrency), [sourceCurrency]);
  const canConvert = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => hasExchangeRate(sourceCurrency, targetCurrency), [sourceCurrency, targetCurrency, hasExchangeRate]);
  const needsConversion = canConvert && targetCurrency !== sourceCurrency;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!needsConversion) {
      return fallbackFormatter;
    }
    return value => {
      const converted = convert({
        amount: value,
        from: sourceCurrency,
        to: targetCurrency
      });
      return currencyFormatter(converted);
    };
  }, [convert, currencyFormatter, fallbackFormatter, needsConversion, sourceCurrency, targetCurrency]);
};

/***/ }),

/***/ "./src/utils/seedPhraseValidation.ts":
/*!*******************************************!*\
  !*** ./src/utils/seedPhraseValidation.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPhraseCorrect": () => (/* binding */ isPhraseCorrect),
/* harmony export */   "wordPhraseLength": () => (/* binding */ wordPhraseLength)
/* harmony export */ });
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/wallet/mnemonic.js");

const wordPhraseLength = [12, 18, 24];
const isPhraseCorrect = phrase => {
  const trimmed = phrase.trim().split(/\s+/g);
  return wordPhraseLength.includes(trimmed.length) && ethers__WEBPACK_IMPORTED_MODULE_0__.Mnemonic.isValidMnemonic(trimmed.join(' ').toLowerCase());
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FjY291bnRzX0FkZFdhbGxldFdpdGhTZWVkUGhyYXNlX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXVILGdCQUFnQixRQUFRLDRGQUFDLE1BQU0sT0FBTyxzREFBQyxNQUFNLGtCQUFrQixHQUFtQzs7Ozs7Ozs7Ozs7Ozs7OztBQ0F0TCxnQkFBZ0IsT0FBTyxpREFBQyxvQkFBb0IsRUFBRSxhQUFzRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQVUsb0JBQW9CLElBQUksdURBQUMsZ0RBQWdELGNBQWMscURBQUMsSUFBSSxPQUFPLCtDQUFDLGVBQWUsMkRBQUMsd0JBQXlEOzs7Ozs7Ozs7Ozs7Ozs7O0FDQXBRO0FBTW5ELE1BQU1DLG9CQUFvQixHQUFJQyxTQUE0QixJQUFLO0VBQ3BFLE1BQU1DLFNBQStCLEdBQUdILGtEQUFXLENBQ2pELE1BQU9JLEtBQUssSUFBSztJQUNmLE1BQU1DLFFBQVEsR0FBR0gsU0FBUyxDQUFDRSxLQUFLLENBQUNFLEdBQUcsQ0FBQztJQUVyQyxJQUFJLE9BQU9ELFFBQVEsS0FBSyxVQUFVLEVBQUU7TUFDbENELEtBQUssQ0FBQ0csY0FBYyxFQUFFO01BQ3RCLE1BQU1GLFFBQVEsRUFBRTtJQUNsQjtFQUNGLENBQUMsRUFDRCxDQUFDSCxTQUFTLENBQUMsQ0FDWjtFQUVELE9BQU87SUFDTEM7RUFDRixDQUFDO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Qm9EO0FBY2hCO0FBQ1M7QUFDQztBQUlaO0FBRzBCO0FBQ0E7QUFDTztBQUV3QjtBQUk1QztBQUNhO0FBQ0s7QUFDSztBQUNMO0FBQ0U7QUFDRTtBQUNUO0FBQ0o7QUFFekQsTUFBTW9DLGVBQWUsR0FBR0MsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQUMsSUFFckNDLElBQUksMEJBQUpBLElBQUk7RUFBSkEsSUFBSSxDQUFKQSxJQUFJO0VBQUpB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LEtBQUssQ0FBQyxNQUFNLENBQUM7RUFFM0MsT0FDRThHLGdCQUFnQixDQUFDRSxRQUFRLENBQUNELE9BQU8sQ0FBQ0UsTUFBTSxDQUFDLElBQ3pDSiw0REFBd0IsQ0FBQ0UsT0FBTyxDQUFDOUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxXQUFXLEVBQUUsQ0FBQztBQUU3RCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrL2VzbS9FVk0vdXRpbHMvZ2V0QWRkcmVzc0Zyb21YUHViLmpzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkay9lc20vRVZNL3V0aWxzL2dldEFkZHJlc3NQdWJsaWNLZXlGcm9tWFB1Yi5qcyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsvZXNtL0VWTS91dGlscy9nZXRYcHViRnJvbU1uZW1vbmljLmpzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlS2V5Ym9hcmRTaG9ydGN1dHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9BZGRXYWxsZXRXaXRoU2VlZFBocmFzZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9jb21wb25lbnRzL05hbWVZb3VyV2FsbGV0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2hvb2tzL3VzZUltcG9ydFNlZWRwaHJhc2UudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9EZUZpL2hvb2tzL3VzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvc2VlZFBocmFzZVZhbGlkYXRpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0e2NvbXB1dGVBZGRyZXNzIGFzIHJ9ZnJvbVwiZXRoZXJzXCI7aW1wb3J0e2dldEFkZHJlc3NQdWJsaWNLZXlGcm9tWFB1YiBhcyB0fWZyb21cIi4vZ2V0QWRkcmVzc1B1YmxpY0tleUZyb21YUHViLmpzXCI7ZnVuY3Rpb24gbyhvLGUpe2NvbnN0IGk9dChvLGUpO3JldHVybiByKGAweCR7aS50b1N0cmluZyhcImhleFwiKX1gKX1leHBvcnR7byBhcyBnZXRBZGRyZXNzRnJvbVhQdWJ9O1xuIiwiaW1wb3J0e2Zyb21CYXNlNTggYXMgcn1mcm9tXCJiaXAzMlwiO2Z1bmN0aW9uIGUoZSxpKXtyZXR1cm4gcihlKS5kZXJpdmVQYXRoKGAwLyR7aX1gKS5wdWJsaWNLZXl9ZXhwb3J0e2UgYXMgZ2V0QWRkcmVzc1B1YmxpY0tleUZyb21YUHVifTtcbiIsImltcG9ydHtmcm9tU2VlZCBhcyByfWZyb21cImJpcDMyXCI7aW1wb3J0e0VUSF9BQ0NPVU5UX1BBVEggYXMgb31mcm9tXCIuLi9jb25zdGFudHMuanNcIjtpbXBvcnR7dmFsaWRhdGVNbmVtb25pYyBhcyB0LG1uZW1vbmljVG9TZWVkIGFzIG59ZnJvbVwiYmlwMzlcIjthc3luYyBmdW5jdGlvbiBlKGUpe2lmKCF0KGUpKXRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbW5lbW9uaWMgcGhyYXNlLlwiKTtjb25zdCBpPWF3YWl0IG4oZSk7cmV0dXJuIHIoaSkuZGVyaXZlUGF0aChvKS5uZXV0ZXJlZCgpLnRvQmFzZTU4KCl9ZXhwb3J0e2UgYXMgZ2V0WHB1YkZyb21NbmVtb25pY307XG4iLCJpbXBvcnQgeyBLZXlib2FyZEV2ZW50SGFuZGxlciwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5cbnR5cGUgQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xudHlwZSBLZXlOYW1lcyA9ICdFbnRlcicgfCAnRXNjYXBlJztcbnR5cGUgS2V5Ym9hcmRTaG9ydGN1dHMgPSBQYXJ0aWFsPFJlY29yZDxLZXlOYW1lcywgQ2FsbGJhY2s+PjtcblxuZXhwb3J0IGNvbnN0IHVzZUtleWJvYXJkU2hvcnRjdXRzID0gKHNob3J0Y3V0czogS2V5Ym9hcmRTaG9ydGN1dHMpID0+IHtcbiAgY29uc3Qgb25LZXlEb3duOiBLZXlib2FyZEV2ZW50SGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBzaG9ydGN1dHNbZXZlbnQua2V5XTtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3Nob3J0Y3V0c10sXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBvbktleURvd24sXG4gIH07XG59O1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQ2FyZCxcbiAgQ2FyZENvbnRlbnQsXG4gIENpcmN1bGFyUHJvZ3Jlc3MsXG4gIExpc3RJY29uLFxuICBTdGFjayxcbiAgVGV4dEZpZWxkLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICBzdHlsZWQsXG4gIHRvYXN0LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBnZXRBZGRyZXNzRnJvbVhQdWIsXG4gIGdldFhwdWJGcm9tTW5lbW9uaWMsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuXG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAc3JjL3V0aWxzL3RydW5jYXRlQWRkcmVzcyc7XG5pbXBvcnQgeyB1c2VCYWxhbmNlc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JhbGFuY2VzUHJvdmlkZXInO1xuXG5pbXBvcnQgeyB1c2VDb252ZXJ0ZWRDdXJyZW5jeUZvcm1hdHRlciB9IGZyb20gJy4uL0RlRmkvaG9va3MvdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXInO1xuXG5pbXBvcnQgc2VudHJ5Q2FwdHVyZUV4Y2VwdGlvbiwge1xuICBTZW50cnlFeGNlcHRpb25UeXBlcyxcbn0gZnJvbSAnQHNyYy9tb25pdG9yaW5nL3NlbnRyeUNhcHR1cmVFeGNlcHRpb24nO1xuaW1wb3J0IHsgTmFtZVlvdXJXYWxsZXQgfSBmcm9tICcuL2NvbXBvbmVudHMvTmFtZVlvdXJXYWxsZXQnO1xuaW1wb3J0IHsgdXNlSW1wb3J0U2VlZHBocmFzZSB9IGZyb20gJy4vaG9va3MvdXNlSW1wb3J0U2VlZHBocmFzZSc7XG5pbXBvcnQgeyB1c2VLZXlib2FyZFNob3J0Y3V0cyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlS2V5Ym9hcmRTaG9ydGN1dHMnO1xuaW1wb3J0IHsgaXNQaHJhc2VDb3JyZWN0IH0gZnJvbSAnQHNyYy91dGlscy9zZWVkUGhyYXNlVmFsaWRhdGlvbic7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy9ob29rcy91c2VFcnJvck1lc3NhZ2UnO1xuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vT3ZlcmxheSc7XG5cbmNvbnN0IEVNUFRZX0FERFJFU1NFUyA9IEFycmF5KDMpLmZpbGwoJycpO1xuXG5lbnVtIFN0ZXAge1xuICBJbXBvcnQsXG4gIE5hbWUsXG59XG5cbmNvbnN0IE5vU2Nyb2xsVGV4dEZpZWxkID0gc3R5bGVkKFRleHRGaWVsZClgXG4gIHRleHRhcmVhOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIEFkZFdhbGxldFdpdGhTZWVkUGhyYXNlKCkge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBhbGxBY2NvdW50cyB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCBnZXRFcnJvck1lc3NhZ2UgPSB1c2VFcnJvck1lc3NhZ2UoKTtcbiAgY29uc3QgZm9ybWF0Q3VycmVuY3kgPSB1c2VDb252ZXJ0ZWRDdXJyZW5jeUZvcm1hdHRlcigpO1xuICBjb25zdCB7IHVwZGF0ZUJhbGFuY2VPbk5ldHdvcmtzLCBnZXRUb3RhbEJhbGFuY2UgfSA9IHVzZUJhbGFuY2VzQ29udGV4dCgpO1xuXG4gIGNvbnN0IHsgaXNJbXBvcnRpbmcsIGltcG9ydFNlZWRwaHJhc2UgfSA9IHVzZUltcG9ydFNlZWRwaHJhc2UoKTtcblxuICBjb25zdCBbcGhyYXNlLCBzZXRQaHJhc2VdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbc3RlcCwgc2V0U3RlcF0gPSB1c2VTdGF0ZShTdGVwLkltcG9ydCk7XG4gIGNvbnN0IFthZGRyZXNzZXMsIHNldEFkZHJlc3Nlc10gPSB1c2VTdGF0ZTxzdHJpbmdbXT4oRU1QVFlfQUREUkVTU0VTKTtcblxuICBjb25zdCBbaXNCYWxhbmNlTG9hZGluZywgc2V0SXNCYWxhbmNlTG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc0tub3duUGhyYXNlLCBzZXRJc0tub3duUGhyYXNlXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzUGhyYXNlVmFsaWQsIHNldElzUGhyYXNlVmFsaWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGRlcml2ZUFkZHJlc3NlcyA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChzZWVkUGhyYXNlOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHhwdWIgPSBhd2FpdCBnZXRYcHViRnJvbU1uZW1vbmljKFxuICAgICAgICBzZWVkUGhyYXNlLnRyaW0oKS5zcGxpdCgvXFxzKy9nKS5qb2luKCcgJykudG9Mb3dlckNhc2UoKSxcbiAgICAgICk7XG4gICAgICBzZXRJc1BocmFzZVZhbGlkKHRydWUpO1xuXG4gICAgICBjb25zdCBhZGRpZXMgPSBbXG4gICAgICAgIGdldEFkZHJlc3NGcm9tWFB1Yih4cHViLCAwKSxcbiAgICAgICAgZ2V0QWRkcmVzc0Zyb21YUHViKHhwdWIsIDEpLFxuICAgICAgICBnZXRBZGRyZXNzRnJvbVhQdWIoeHB1YiwgMiksXG4gICAgICBdO1xuXG4gICAgICBjb25zdCBpc01uZW1vbmljS25vd24gPSBhbGxBY2NvdW50cy5zb21lKFxuICAgICAgICAoeyBhZGRyZXNzQyB9KSA9PiBhZGRyZXNzQy50b0xvd2VyQ2FzZSgpID09PSBhZGRpZXNbMF0/LnRvTG93ZXJDYXNlKCksXG4gICAgICApO1xuXG4gICAgICBpZiAoaXNNbmVtb25pY0tub3duKSB7XG4gICAgICAgIHNldElzS25vd25QaHJhc2UodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2V0SXNLbm93blBocmFzZShmYWxzZSk7XG4gICAgICBzZXRJc0JhbGFuY2VMb2FkaW5nKHRydWUpO1xuICAgICAgYXdhaXQgdXBkYXRlQmFsYW5jZU9uTmV0d29ya3MoXG4gICAgICAgIGFkZGllcy5tYXAoKGFkZHJlc3NDKSA9PiAoeyBhZGRyZXNzQyB9KSkgYXMgQWNjb3VudFtdLFxuICAgICAgKTtcbiAgICAgIHNldElzQmFsYW5jZUxvYWRpbmcoZmFsc2UpO1xuICAgICAgc2V0QWRkcmVzc2VzKGFkZGllcyk7XG4gICAgfSxcbiAgICBbYWxsQWNjb3VudHMsIHVwZGF0ZUJhbGFuY2VPbk5ldHdvcmtzXSxcbiAgKTtcblxuICBjb25zdCBvbkNvbnRpbnVlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChpc1BocmFzZVZhbGlkICYmICFpc0tub3duUGhyYXNlKSB7XG4gICAgICBzZXRTdGVwKFN0ZXAuTmFtZSk7XG4gICAgfVxuICB9LCBbaXNQaHJhc2VWYWxpZCwgaXNLbm93blBocmFzZV0pO1xuXG4gIGNvbnN0IG9uUGhyYXNlQ2hhbmdlZDogUmVhY3QuQ2hhbmdlRXZlbnRIYW5kbGVyPEhUTUxJbnB1dEVsZW1lbnQ+ID1cbiAgICB1c2VDYWxsYmFjayhcbiAgICAgIGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBzZWVkUGhyYXNlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIHNldFBocmFzZShzZWVkUGhyYXNlKTtcblxuICAgICAgICBpZiAoIXNlZWRQaHJhc2UgfHwgIWlzUGhyYXNlQ29ycmVjdChzZWVkUGhyYXNlKSkge1xuICAgICAgICAgIHNldElzUGhyYXNlVmFsaWQoZmFsc2UpO1xuICAgICAgICAgIHNldEFkZHJlc3NlcyhFTVBUWV9BRERSRVNTRVMpO1xuICAgICAgICAgIHNldElzS25vd25QaHJhc2UoZmFsc2UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGRlcml2ZUFkZHJlc3NlcyhzZWVkUGhyYXNlKTtcbiAgICAgIH0sXG4gICAgICBbZGVyaXZlQWRkcmVzc2VzXSxcbiAgICApO1xuXG4gIGNvbnN0IGhhbmRsZUltcG9ydCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChuYW1lPzogc3RyaW5nKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjYXB0dXJlKCdTZWVkcGhyYXNlSW1wb3J0U3RhcnRlZCcpO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGltcG9ydFNlZWRwaHJhc2Uoe1xuICAgICAgICAgIG1uZW1vbmljOiBwaHJhc2UudHJpbSgpLnNwbGl0KC9cXHMrL2cpLmpvaW4oJyAnKSxcbiAgICAgICAgICBuYW1lLFxuICAgICAgICB9KTtcblxuICAgICAgICBjYXB0dXJlKCdTZWVkcGhyYXNlSW1wb3J0U3VjY2VzcycpO1xuXG4gICAgICAgIHRvYXN0LnN1Y2Nlc3ModCgne3t3YWxsZXROYW1lfX0gQWRkZWQnLCB7IHdhbGxldE5hbWU6IHJlc3VsdC5uYW1lIH0pKTtcbiAgICAgICAgaGlzdG9yeS5yZXBsYWNlKCcvYWNjb3VudHMnKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjYXB0dXJlKCdTZWVkcGhyYXNlSW1wb3J0RmFpbHVyZScpO1xuICAgICAgICBzZW50cnlDYXB0dXJlRXhjZXB0aW9uKFxuICAgICAgICAgIGVyciBhcyBFcnJvcixcbiAgICAgICAgICBTZW50cnlFeGNlcHRpb25UeXBlcy5XQUxMRVRfSU1QT1JULFxuICAgICAgICApO1xuICAgICAgICBjb25zdCB7IHRpdGxlIH0gPSBnZXRFcnJvck1lc3NhZ2UoZXJyKTtcbiAgICAgICAgdG9hc3QuZXJyb3IodGl0bGUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2NhcHR1cmUsIGdldEVycm9yTWVzc2FnZSwgaGlzdG9yeSwgaW1wb3J0U2VlZHBocmFzZSwgcGhyYXNlLCB0XSxcbiAgKTtcblxuICBjb25zdCBrZXlib2FyZFNob3J0Y3V0cyA9IHVzZUtleWJvYXJkU2hvcnRjdXRzKHtcbiAgICBFbnRlcjogb25Db250aW51ZSxcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge3N0ZXAgPT09IFN0ZXAuTmFtZSAmJiAoXG4gICAgICAgIDxPdmVybGF5PlxuICAgICAgICAgIDxOYW1lWW91cldhbGxldFxuICAgICAgICAgICAgaXNJbXBvcnRpbmc9e2lzSW1wb3J0aW5nfVxuICAgICAgICAgICAgb25TYXZlPXtoYW5kbGVJbXBvcnR9XG4gICAgICAgICAgICBvbkJhY2tDbGljaz17KCkgPT4gc2V0U3RlcChTdGVwLkltcG9ydCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9PdmVybGF5PlxuICAgICAgKX1cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3g9e3sgbXQ6IDIuNSwgbWI6IDAuNSwgcHI6IDEgfX0+XG4gICAgICAgICAgPFBhZ2VUaXRsZSBvbkJhY2tDbGljaz17KCkgPT4gaGlzdG9yeS5yZXBsYWNlKCcvYWNjb3VudHMnKX0+XG4gICAgICAgICAgICB7dCgnQWRkIFdhbGxldCB3aXRoIFJlY292ZXJ5IFBocmFzZScpfVxuICAgICAgICAgIDwvUGFnZVRpdGxlPlxuICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgIDxTdGFjayBzeD17eyBweDogMiwgcHQ6IDEsIGZsZXhHcm93OiAxLCBnYXA6IDMgfX0+XG4gICAgICAgICAgPE5vU2Nyb2xsVGV4dEZpZWxkXG4gICAgICAgICAgICBhdXRvRm9jdXNcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWRkLXNlZWQtcGhyYXNlLWlucHV0XCJcbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgbGFiZWw9e3QoJ0VudGVyIFJlY292ZXJ5IFBocmFzZScpfVxuICAgICAgICAgICAgaW5wdXRMYWJlbFByb3BzPXt7XG4gICAgICAgICAgICAgIHN4OiB7IHRyYW5zZm9ybTogJ25vbmUnLCBmb250U2l6ZTogJ2JvZHkyLmZvbnRTaXplJywgbWI6IDEgfSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkNoYW5nZT17b25QaHJhc2VDaGFuZ2VkfVxuICAgICAgICAgICAgSW5wdXRQcm9wcz17e1xuICAgICAgICAgICAgICBhdXRvQ29tcGxldGU6ICdvZmYnLFxuICAgICAgICAgICAgICBzeDoge1xuICAgICAgICAgICAgICAgIHA6IDEsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgaGVscGVyVGV4dD17XG4gICAgICAgICAgICAgIGlzS25vd25QaHJhc2VcbiAgICAgICAgICAgICAgICA/IHQoXG4gICAgICAgICAgICAgICAgICAgICdUaGlzIHJlY292ZXJ5IHBocmFzZSBhcHBlYXJzIHRvIGhhdmUgYWxyZWFkeSBiZWVuIGltcG9ydGVkLicsXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgOiB0KCdBZGQgYWNjb3VudChzKSBieSBlbnRlcmluZyBhIHZhbGlkIHJlY292ZXJ5IHBocmFzZS4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbXVsdGlsaW5lXG4gICAgICAgICAgICByb3dzPXszfVxuICAgICAgICAgICAgdmFsdWU9e3BocmFzZX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0KCdFbnRlciBSZWNvdmVyeSBQaHJhc2UnKX1cbiAgICAgICAgICAgIGVycm9yPXtpc0tub3duUGhyYXNlfVxuICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgIHsuLi5rZXlib2FyZFNob3J0Y3V0c31cbiAgICAgICAgICAvPlxuXG4gICAgICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMSB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGZvbnRXZWlnaHQ6ICdzZW1pYm9sZCcgfX0+XG4gICAgICAgICAgICAgIHt0KCdEZXJpdmVkIEFkZHJlc3NlcycpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMSB9fT5cbiAgICAgICAgICAgICAge2FkZHJlc3Nlcy5tYXAoKGFkZHJlc3MsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFsYW5jZSA9IGFkZHJlc3MgPyBnZXRUb3RhbEJhbGFuY2UoYWRkcmVzcykgOiBudWxsO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxDYXJkIGtleT17aW5kZXh9IHN4PXt7IGJhY2tncm91bmRDb2xvcjogJ2dyZXkuODAwJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgPENhcmRDb250ZW50XG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBweTogMS41LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAnOmxhc3QtY2hpbGQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBiOiAxLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8VG9vbHRpcCBwbGFjZW1lbnQ9XCJ0b3BcIiB0aXRsZT17YWRkcmVzc30+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIiBjb21wb25lbnQ9XCJzcGFuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHthZGRyZXNzID8gdHJ1bmNhdGVBZGRyZXNzKGFkZHJlc3MpIDogJy0nfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICAgICAgICAgICB7aXNCYWxhbmNlTG9hZGluZyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaXJjdWxhclByb2dyZXNzIHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlb2YgYmFsYW5jZSA9PT0gJ251bWJlcidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGZvcm1hdEN1cnJlbmN5KGJhbGFuY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L0NhcmRDb250ZW50PlxuICAgICAgICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgc3g9e3sgcHk6IDMsIHB4OiAyLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbm90LWFsbG93ZWQnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHRpdGxlPXtcbiAgICAgICAgICAgICAgaXNQaHJhc2VWYWxpZFxuICAgICAgICAgICAgICAgID8gaXNLbm93blBocmFzZVxuICAgICAgICAgICAgICAgICAgPyB0KFxuICAgICAgICAgICAgICAgICAgICAgICdUaGlzIHJlY292ZXJ5IHBocmFzZSBhcHBlYXJzIHRvIGhhdmUgYWxyZWFkeSBiZWVuIGltcG9ydGVkLicsXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIDogJydcbiAgICAgICAgICAgICAgICA6IHQoJ1Byb3ZpZGVkIHJlY292ZXJ5IHBocmFzZSBpcyBub3QgdmFsaWQuJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWlzUGhyYXNlVmFsaWQgfHwgaXNLbm93blBocmFzZX1cbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhZGQtd2FsbGV0LXdpdGgtc2VlZC1waHJhc2VcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNvbnRpbnVlfVxuICAgICAgICAgICAgICBzdGFydEljb249ezxMaXN0SWNvbiBzaXplPXsxNn0gLz59XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdBZGQgUmVjb3ZlcnkgUGhyYXNlJyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IFBhZ2VUaXRsZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vUGFnZVRpdGxlJztcbmltcG9ydCB7IHVzZUtleWJvYXJkU2hvcnRjdXRzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VLZXlib2FyZFNob3J0Y3V0cyc7XG5cbnR5cGUgTmFtZVlvdXJXYWxsZXRQcm9wcyA9IHtcbiAgaXNJbXBvcnRpbmc6IGJvb2xlYW47XG4gIG9uU2F2ZTogKG5hbWU/OiBzdHJpbmcpID0+IHZvaWQ7XG4gIG9uQmFja0NsaWNrOiAoKSA9PiB2b2lkO1xuICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gTmFtZVlvdXJXYWxsZXQoe1xuICBpc0ltcG9ydGluZyxcbiAgb25TYXZlLFxuICBvbkJhY2tDbGljayxcbiAgYmFja2dyb3VuZENvbG9yLFxufTogTmFtZVlvdXJXYWxsZXRQcm9wcykge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCBbbmFtZSwgc2V0TmFtZV0gPSB1c2VTdGF0ZSgnJyk7XG5cbiAgY29uc3QgaGFuZGxlU2F2ZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBvblNhdmUobmFtZSk7XG4gIH0sIFtuYW1lLCBvblNhdmVdKTtcblxuICBjb25zdCBrZXlib2FyZFNob3J0Y3V0cyA9IHVzZUtleWJvYXJkU2hvcnRjdXRzKHtcbiAgICBFbnRlcjogaGFuZGxlU2F2ZSxcbiAgICBFc2NhcGU6IG9uQmFja0NsaWNrLFxuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgIGJhY2tncm91bmQ6IGJhY2tncm91bmRDb2xvciA/PyB0aGVtZS5wYWxldHRlLmJhY2tncm91bmQucGFwZXIsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBtdDogMi41LCBtYjogMC41LCBwcjogMSB9fT5cbiAgICAgICAgPFBhZ2VUaXRsZSBvbkJhY2tDbGljaz17b25CYWNrQ2xpY2t9Pnt0KCdOYW1lIHlvdXIgV2FsbGV0Jyl9PC9QYWdlVGl0bGU+XG4gICAgICA8L1N0YWNrPlxuXG4gICAgICA8U3RhY2sgc3g9e3sgcHg6IDIsIHB0OiAxLCBmbGV4R3JvdzogMSwgZ2FwOiAzIH19PlxuICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ3YWxsZXQtbmFtZS1pbnB1dFwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgbGFiZWw9e3QoJ1dhbGxldCBOYW1lJyl9XG4gICAgICAgICAgaW5wdXRMYWJlbFByb3BzPXt7XG4gICAgICAgICAgICBzeDogeyB0cmFuc2Zvcm06ICdub25lJywgZm9udFNpemU6ICdib2R5Mi5mb250U2l6ZScsIG1iOiAxIH0sXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNoYW5nZT17KGV2KSA9PiBzZXROYW1lKGV2LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgdmFsdWU9e25hbWV9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ015IE5ldyBXYWxsZXQnKX1cbiAgICAgICAgICB7Li4ua2V5Ym9hcmRTaG9ydGN1dHN9XG4gICAgICAgIC8+XG4gICAgICA8L1N0YWNrPlxuXG4gICAgICA8U3RhY2sgc3g9e3sgcHk6IDMsIHB4OiAyLCBnYXA6IDEsIHdpZHRoOiAxIH19PlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgZGlzYWJsZWQ9eyFuYW1lIHx8IGlzSW1wb3J0aW5nfVxuICAgICAgICAgIGlzTG9hZGluZz17aXNJbXBvcnRpbmd9XG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNhdmUtd2FsbGV0LW5hbWVcIlxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVNhdmV9XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnU2F2ZScpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICBkaXNhYmxlZD17aXNJbXBvcnRpbmd9XG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNraXAtd2FsbGV0LW5hbWVcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2F2ZSgpfVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ1NraXAnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7XG4gIEltcG9ydFNlZWRwaHJhc2VXYWxsZXRQYXJhbXMsXG4gIEltcG9ydFdhbGxldFJlc3VsdCxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3dhbGxldC9oYW5kbGVycy9tb2RlbHMnO1xuaW1wb3J0IHsgRXh0ZW5zaW9uUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9leHRlbnNpb25Db25uZWN0aW9uL21vZGVscyc7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7IEltcG9ydFNlZWRQaHJhc2VIYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3dhbGxldC9oYW5kbGVycy9pbXBvcnRTZWVkUGhyYXNlJztcblxudHlwZSBJbXBvcnRXYWxsZXRGbiA9IChcbiAgcGFyYW1zOiBJbXBvcnRTZWVkcGhyYXNlV2FsbGV0UGFyYW1zLFxuKSA9PiBQcm9taXNlPEltcG9ydFdhbGxldFJlc3VsdD47XG5cbmV4cG9ydCBjb25zdCB1c2VJbXBvcnRTZWVkcGhyYXNlID0gKCkgPT4ge1xuICBjb25zdCB7IHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG4gIGNvbnN0IFtpc0ltcG9ydGluZywgc2V0SXNJbXBvcnRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGltcG9ydFNlZWRwaHJhc2U6IEltcG9ydFdhbGxldEZuID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHBhcmFtcykgPT4ge1xuICAgICAgc2V0SXNJbXBvcnRpbmcodHJ1ZSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcXVlc3Q8SW1wb3J0U2VlZFBocmFzZUhhbmRsZXI+KHtcbiAgICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuV0FMTEVUX0lNUE9SVF9TRUVEX1BIUkFTRSxcbiAgICAgICAgICBwYXJhbXM6IFtwYXJhbXNdLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0SXNJbXBvcnRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3JlcXVlc3RdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgaXNJbXBvcnRpbmcsXG4gICAgaW1wb3J0U2VlZHBocmFzZSxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyB1c2VDdXJyZW5jaWVzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ3VycmVuY2llc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZVNldHRpbmdzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvU2V0dGluZ3NQcm92aWRlcic7XG5pbXBvcnQgeyBnZXRDdXJyZW5jeUZvcm1hdHRlciB9IGZyb20gJ0BzcmMvY29udGV4dHMvdXRpbHMvZ2V0Q3VycmVuY3lGb3JtYXR0ZXInO1xuXG50eXBlIEN1cnJlbmN5Q29udmVydGVyID0gKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZztcblxuZXhwb3J0IGNvbnN0IHVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyID0gKFxuICBzb3VyY2VDdXJyZW5jeSA9ICdVU0QnLFxuKTogQ3VycmVuY3lDb252ZXJ0ZXIgPT4ge1xuICBjb25zdCB7IGNvbnZlcnQsIGhhc0V4Y2hhbmdlUmF0ZSB9ID0gdXNlQ3VycmVuY2llc0NvbnRleHQoKTtcbiAgY29uc3QgeyBjdXJyZW5jeTogdGFyZ2V0Q3VycmVuY3ksIGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgY29uc3QgZmFsbGJhY2tGb3JtYXR0ZXIgPSB1c2VNZW1vKFxuICAgICgpID0+IGdldEN1cnJlbmN5Rm9ybWF0dGVyKHNvdXJjZUN1cnJlbmN5KSxcbiAgICBbc291cmNlQ3VycmVuY3ldLFxuICApO1xuICBjb25zdCBjYW5Db252ZXJ0ID0gdXNlTWVtbyhcbiAgICAoKSA9PiBoYXNFeGNoYW5nZVJhdGUoc291cmNlQ3VycmVuY3ksIHRhcmdldEN1cnJlbmN5KSxcbiAgICBbc291cmNlQ3VycmVuY3ksIHRhcmdldEN1cnJlbmN5LCBoYXNFeGNoYW5nZVJhdGVdLFxuICApO1xuICBjb25zdCBuZWVkc0NvbnZlcnNpb24gPSBjYW5Db252ZXJ0ICYmIHRhcmdldEN1cnJlbmN5ICE9PSBzb3VyY2VDdXJyZW5jeTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFuZWVkc0NvbnZlcnNpb24pIHtcbiAgICAgIHJldHVybiBmYWxsYmFja0Zvcm1hdHRlcjtcbiAgICB9XG5cbiAgICByZXR1cm4gKHZhbHVlOiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IGNvbnZlcnRlZCA9IGNvbnZlcnQoe1xuICAgICAgICBhbW91bnQ6IHZhbHVlLFxuICAgICAgICBmcm9tOiBzb3VyY2VDdXJyZW5jeSxcbiAgICAgICAgdG86IHRhcmdldEN1cnJlbmN5LFxuICAgICAgfSkgYXMgbnVtYmVyO1xuXG4gICAgICByZXR1cm4gY3VycmVuY3lGb3JtYXR0ZXIoY29udmVydGVkKTtcbiAgICB9O1xuICB9LCBbXG4gICAgY29udmVydCxcbiAgICBjdXJyZW5jeUZvcm1hdHRlcixcbiAgICBmYWxsYmFja0Zvcm1hdHRlcixcbiAgICBuZWVkc0NvbnZlcnNpb24sXG4gICAgc291cmNlQ3VycmVuY3ksXG4gICAgdGFyZ2V0Q3VycmVuY3ksXG4gIF0pO1xufTtcbiIsImltcG9ydCB7IE1uZW1vbmljIH0gZnJvbSAnZXRoZXJzJztcblxuZXhwb3J0IGNvbnN0IHdvcmRQaHJhc2VMZW5ndGggPSBbMTIsIDE4LCAyNF07XG5cbmV4cG9ydCBjb25zdCBpc1BocmFzZUNvcnJlY3QgPSAocGhyYXNlOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgdHJpbW1lZCA9IHBocmFzZS50cmltKCkuc3BsaXQoL1xccysvZyk7XG5cbiAgcmV0dXJuIChcbiAgICB3b3JkUGhyYXNlTGVuZ3RoLmluY2x1ZGVzKHRyaW1tZWQubGVuZ3RoKSAmJlxuICAgIE1uZW1vbmljLmlzVmFsaWRNbmVtb25pYyh0cmltbWVkLmpvaW4oJyAnKS50b0xvd2VyQ2FzZSgpKVxuICApO1xufTtcbiJdLCJuYW1lcyI6WyJ1c2VDYWxsYmFjayIsInVzZUtleWJvYXJkU2hvcnRjdXRzIiwic2hvcnRjdXRzIiwib25LZXlEb3duIiwiZXZlbnQiLCJjYWxsYmFjayIsImtleSIsInByZXZlbnREZWZhdWx0IiwiUmVhY3QiLCJ1c2VTdGF0ZSIsIkJ1dHRvbiIsIkNhcmQiLCJDYXJkQ29udGVudCIsIkNpcmN1bGFyUHJvZ3Jlc3MiLCJMaXN0SWNvbiIsIlN0YWNrIiwiVGV4dEZpZWxkIiwiVG9vbHRpcCIsIlR5cG9ncmFwaHkiLCJzdHlsZWQiLCJ0b2FzdCIsInVzZVRoZW1lIiwidXNlSGlzdG9yeSIsInVzZVRyYW5zbGF0aW9uIiwiZ2V0QWRkcmVzc0Zyb21YUHViIiwiZ2V0WHB1YkZyb21NbmVtb25pYyIsIlBhZ2VUaXRsZSIsInRydW5jYXRlQWRkcmVzcyIsInVzZUJhbGFuY2VzQ29udGV4dCIsInVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyIiwic2VudHJ5Q2FwdHVyZUV4Y2VwdGlvbiIsIlNlbnRyeUV4Y2VwdGlvblR5cGVzIiwiTmFtZVlvdXJXYWxsZXQiLCJ1c2VJbXBvcnRTZWVkcGhyYXNlIiwiaXNQaHJhc2VDb3JyZWN0IiwidXNlQWNjb3VudHNDb250ZXh0IiwidXNlQW5hbHl0aWNzQ29udGV4dCIsInVzZUVycm9yTWVzc2FnZSIsIk92ZXJsYXkiLCJFTVBUWV9BRERSRVNTRVMiLCJBcnJheSIsImZpbGwiLCJTdGVwIiwiTm9TY3JvbGxUZXh0RmllbGQiLCJBZGRXYWxsZXRXaXRoU2VlZFBocmFzZSIsInRoZW1lIiwiaGlzdG9yeSIsInQiLCJhbGxBY2NvdW50cyIsImNhcHR1cmUiLCJnZXRFcnJvck1lc3NhZ2UiLCJmb3JtYXRDdXJyZW5jeSIsInVwZGF0ZUJhbGFuY2VPbk5ldHdvcmtzIiwiZ2V0VG90YWxCYWxhbmNlIiwiaXNJbXBvcnRpbmciLCJpbXBvcnRTZWVkcGhyYXNlIiwicGhyYXNlIiwic2V0UGhyYXNlIiwic3RlcCIsInNldFN0ZXAiLCJJbXBvcnQiLCJhZGRyZXNzZXMiLCJzZXRBZGRyZXNzZXMiLCJpc0JhbGFuY2VMb2FkaW5nIiwic2V0SXNCYWxhbmNlTG9hZGluZyIsImlzS25vd25QaHJhc2UiLCJzZXRJc0tub3duUGhyYXNlIiwiaXNQaHJhc2VWYWxpZCIsInNldElzUGhyYXNlVmFsaWQiLCJkZXJpdmVBZGRyZXNzZXMiLCJzZWVkUGhyYXNlIiwieHB1YiIsInRyaW0iLCJzcGxpdCIsImpvaW4iLCJ0b0xvd2VyQ2FzZSIsImFkZGllcyIsImlzTW5lbW9uaWNLbm93biIsInNvbWUiLCJhZGRyZXNzQyIsIm1hcCIsIm9uQ29udGludWUiLCJOYW1lIiwib25QaHJhc2VDaGFuZ2VkIiwidGFyZ2V0IiwidmFsdWUiLCJoYW5kbGVJbXBvcnQiLCJuYW1lIiwicmVzdWx0IiwibW5lbW9uaWMiLCJzdWNjZXNzIiwid2FsbGV0TmFtZSIsInJlcGxhY2UiLCJlcnIiLCJXQUxMRVRfSU1QT1JUIiwidGl0bGUiLCJlcnJvciIsImtleWJvYXJkU2hvcnRjdXRzIiwiRW50ZXIiLCJjcmVhdGVFbGVtZW50IiwiRnJhZ21lbnQiLCJvblNhdmUiLCJvbkJhY2tDbGljayIsInN4Iiwid2lkdGgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kIiwicGFsZXR0ZSIsInBhcGVyIiwiZGlyZWN0aW9uIiwibXQiLCJtYiIsInByIiwicHgiLCJwdCIsImZsZXhHcm93IiwiZ2FwIiwiX2V4dGVuZHMiLCJhdXRvRm9jdXMiLCJmdWxsV2lkdGgiLCJsYWJlbCIsImlucHV0TGFiZWxQcm9wcyIsInRyYW5zZm9ybSIsImZvbnRTaXplIiwib25DaGFuZ2UiLCJJbnB1dFByb3BzIiwiYXV0b0NvbXBsZXRlIiwicCIsImhlbHBlclRleHQiLCJtdWx0aWxpbmUiLCJyb3dzIiwicGxhY2Vob2xkZXIiLCJ0eXBlIiwidmFyaWFudCIsImZvbnRXZWlnaHQiLCJhZGRyZXNzIiwiaW5kZXgiLCJiYWxhbmNlIiwiYmFja2dyb3VuZENvbG9yIiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJweSIsInBiIiwicGxhY2VtZW50IiwiY29tcG9uZW50Iiwic2l6ZSIsImNvbG9yIiwiY3Vyc29yIiwiZGlzYWJsZWQiLCJvbkNsaWNrIiwic3RhcnRJY29uIiwic2V0TmFtZSIsImhhbmRsZVNhdmUiLCJFc2NhcGUiLCJldiIsImlzTG9hZGluZyIsIkV4dGVuc2lvblJlcXVlc3QiLCJ1c2VDb25uZWN0aW9uQ29udGV4dCIsInJlcXVlc3QiLCJzZXRJc0ltcG9ydGluZyIsInBhcmFtcyIsIm1ldGhvZCIsIldBTExFVF9JTVBPUlRfU0VFRF9QSFJBU0UiLCJ1c2VNZW1vIiwidXNlQ3VycmVuY2llc0NvbnRleHQiLCJ1c2VTZXR0aW5nc0NvbnRleHQiLCJnZXRDdXJyZW5jeUZvcm1hdHRlciIsInNvdXJjZUN1cnJlbmN5IiwiY29udmVydCIsImhhc0V4Y2hhbmdlUmF0ZSIsImN1cnJlbmN5IiwidGFyZ2V0Q3VycmVuY3kiLCJjdXJyZW5jeUZvcm1hdHRlciIsImZhbGxiYWNrRm9ybWF0dGVyIiwiY2FuQ29udmVydCIsIm5lZWRzQ29udmVyc2lvbiIsImNvbnZlcnRlZCIsImFtb3VudCIsImZyb20iLCJ0byIsIk1uZW1vbmljIiwid29yZFBocmFzZUxlbmd0aCIsInRyaW1tZWQiLCJpbmNsdWRlcyIsImxlbmd0aCIsImlzVmFsaWRNbmVtb25pYyJdLCJzb3VyY2VSb290IjoiIn0=