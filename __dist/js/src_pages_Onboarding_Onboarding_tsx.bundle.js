(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Onboarding_Onboarding_tsx"],{

/***/ "./src/background/services/wallet/utils/createMnemonicPhrase.ts":
/*!**********************************************************************!*\
  !*** ./src/background/services/wallet/utils/createMnemonicPhrase.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createNewMnemonic": () => (/* binding */ createNewMnemonic)
/* harmony export */ });
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/wallet/mnemonic.js");

function createNewMnemonic() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return ethers__WEBPACK_IMPORTED_MODULE_0__.Mnemonic.entropyToPhrase(randomBytes);
}

/***/ }),

/***/ "./src/components/common/FunctionIsOffline.tsx":
/*!*****************************************************!*\
  !*** ./src/components/common/FunctionIsOffline.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionIsOffline": () => (/* binding */ FunctionIsOffline),
/* harmony export */   "getTranslatedFunctionName": () => (/* binding */ getTranslatedFunctionName)
/* harmony export */ });
/* harmony import */ var _PageTitle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function getTranslatedFunctionName(name) {
  const translations = {
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.BRIDGE]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Bridge'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.SWAP]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Swap'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.SEND]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Send'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.BUY]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Buy'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.DEFI]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('DeFi'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.KEYSTONE]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Keystone'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.TOKEN_DETAILS]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Token Details')
  };
  return translations[name];
}
function FunctionIsOffline({
  functionName,
  hidePageTitle,
  children
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      height: '100%',
      width: '100%'
    }
  }, !hidePageTitle && /*#__PURE__*/React.createElement(_PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitle, {
    variant: _PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitleVariant.PRIMARY
  }, t('Sorry')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.AlertCircleIcon, {
    size: 72,
    sx: {
      mb: 3,
      mt: -9
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "h5",
    sx: {
      mb: 1
    }
  }, t('Feature Disabled')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    size: 16,
    align: "center",
    height: "24px",
    sx: {
      color: 'text.secondary'
    }
  }, t('{{functionName}} is currently unavailable.', {
    functionName: getTranslatedFunctionName(functionName) ?? t('This Feature')
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    sx: {
      color: 'text.secondary'
    }
  }, t('Please check back later and try again.')), children));
}

/***/ }),

/***/ "./src/components/common/InlineBold.tsx":
/*!**********************************************!*\
  !*** ./src/components/common/InlineBold.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InlineBold": () => (/* binding */ InlineBold)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");

const InlineBold = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])('span')`
  font-weight: bold;
`;

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

/***/ "./src/hooks/useKeystoneScannerContents.tsx":
/*!**************************************************!*\
  !*** ./src/hooks/useKeystoneScannerContents.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useKeystoneScannerContents": () => (/* binding */ useKeystoneScannerContents)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _keystonehq_animated_qr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @keystonehq/animated-qr */ "./node_modules/@keystonehq/animated-qr/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const useKeystoneScannerContents = ({
  cameraPermission,
  hasError,
  setHasError,
  handleScan,
  handleError
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const {
    palette
  } = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const headLines = {
    allowAccess: t('Camera Access'),
    hasAccess: t('Scan QR Code'),
    blockedAccess: t('Access Blocked'),
    hasError: t('Invalid QR Code')
  };
  const descriptions = {
    allowAccess: t('Allow Chrome access to your camera to scan the QR Code'),
    hasAccess: t('Scan the QR code displayed on your Keystone device'),
    blockedAccess: t('You’ve blocked access to your camera. Please allow access to continue.'),
    hasError: t('Please ensure you have selected a valid QR code from your Keystone device. ')
  };
  const helperTexts = {
    allowAccess: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
      align: "center",
      variant: "body2",
      sx: {
        color: 'text.secondary'
      }
    }, t('If you block access, look in the top right corner of your browser to enable camera access')),
    hasAccess: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
      align: "center",
      variant: "body2",
      sx: {
        color: 'text.secondary'
      }
    }, t('Position the QR code in front of your camera. The screen is blurred, but this will not affect the scan.')),
    blockedAccess: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
      align: "center",
      variant: "body2",
      sx: {
        color: 'text.secondary'
      }
    }, t('If you block access, look in the top right corner of your browser to enable camera access')),
    hasError: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
      sx: {
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      "data-testid": "try-again-button",
      onClick: () => {
        setHasError(false);
      },
      sx: {
        width: '246px'
      }
    }, t('Try Again')))
  };
  const contents = {
    allowAccess: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CircularProgress, {
      size: 88
    })),
    hasAccess: /*#__PURE__*/React.createElement(_keystonehq_animated_qr__WEBPACK_IMPORTED_MODULE_0__.AnimatedQRScanner, {
      purpose: _keystonehq_animated_qr__WEBPACK_IMPORTED_MODULE_0__.Purpose.SYNC,
      handleScan: handleScan,
      handleError: handleError,
      options: {
        width: 229,
        height: 229
      },
      urTypes: [_keystonehq_animated_qr__WEBPACK_IMPORTED_MODULE_0__.URType.CRYPTO_MULTI_ACCOUNTS]
    }),
    blockedAccess: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CameraBlockedIcon, {
      size: 50,
      sx: {
        outline: `3px solid ${palette.error.main}`,
        outlineOffset: 5,
        backgroundColor: 'error.main',
        m: 1,
        p: 2,
        borderRadius: 999,
        border: 1,
        borderColor: 'error.main'
      }
    }),
    hasError: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.QRCodeIcon, {
      size: 56,
      sx: {
        outline: `3px solid ${palette.error.main}`,
        outlineOffset: 5,
        backgroundColor: 'error.main',
        m: 1,
        p: 2,
        borderRadius: 999,
        border: 1,
        borderColor: 'error.main'
      }
    })
  };
  const getPageContent = () => {
    if (!cameraPermission || cameraPermission === 'prompt') {
      return {
        headLine: headLines.allowAccess,
        description: descriptions.allowAccess,
        content: contents.allowAccess,
        helperText: helperTexts.allowAccess
      };
    }
    if (cameraPermission === 'granted' && hasError) {
      return {
        headLine: headLines.hasError,
        description: descriptions.hasError,
        content: contents.hasError,
        helperText: helperTexts.hasError
      };
    }
    if (cameraPermission === 'granted') {
      return {
        headLine: headLines.hasAccess,
        description: descriptions.hasAccess,
        content: contents.hasAccess,
        helperText: helperTexts.hasAccess
      };
    }
    if (cameraPermission === 'denied') {
      return {
        headLine: headLines.blockedAccess,
        description: descriptions.blockedAccess,
        content: contents.blockedAccess,
        helperText: helperTexts.blockedAccess
      };
    }
  };
  return getPageContent();
};

/***/ }),

/***/ "./src/pages/Onboarding/Onboarding.tsx":
/*!*********************************************!*\
  !*** ./src/pages/Onboarding/Onboarding.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Onboarding": () => (/* binding */ Onboarding)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _components_LanguageSelector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/LanguageSelector */ "./src/pages/Onboarding/components/LanguageSelector.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _pages_CreateWallet_CreateWallet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/CreateWallet/CreateWallet */ "./src/pages/Onboarding/pages/CreateWallet/CreateWallet.tsx");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _pages_Keystone_Keystone__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/Keystone/Keystone */ "./src/pages/Onboarding/pages/Keystone/Keystone.tsx");
/* harmony import */ var _pages_Ledger_LedgerConnect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/Ledger/LedgerConnect */ "./src/pages/Onboarding/pages/Ledger/LedgerConnect.tsx");
/* harmony import */ var _pages_ImportWallet__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/ImportWallet */ "./src/pages/Onboarding/pages/ImportWallet.tsx");
/* harmony import */ var _pages_CreatePassword__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pages/CreatePassword */ "./src/pages/Onboarding/pages/CreatePassword.tsx");
/* harmony import */ var _pages_AnalyticsConsent__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/AnalyticsConsent */ "./src/pages/Onboarding/pages/AnalyticsConsent.tsx");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var _src_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/components/common/LoadingOverlay */ "./src/components/common/LoadingOverlay.tsx");
/* harmony import */ var _src_components_common_AppBackground__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/components/common/AppBackground */ "./src/components/common/AppBackground.tsx");
/* harmony import */ var _pages_Ledger_LedgerTrouble__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pages/Ledger/LedgerTrouble */ "./src/pages/Onboarding/pages/Ledger/LedgerTrouble.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _pages_Welcome_Welcome__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./pages/Welcome/Welcome */ "./src/pages/Onboarding/pages/Welcome/Welcome.tsx");
/* harmony import */ var _pages_Seedless_RecoveryMethods__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./pages/Seedless/RecoveryMethods */ "./src/pages/Onboarding/pages/Seedless/RecoveryMethods.tsx");
/* harmony import */ var _pages_Seedless_RecoveryMethodsLogin__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./pages/Seedless/RecoveryMethodsLogin */ "./src/pages/Onboarding/pages/Seedless/RecoveryMethodsLogin.tsx");
/* harmony import */ var _pages_Seedless_modals_VerifyGoBackModal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./pages/Seedless/modals/VerifyGoBackModal */ "./src/pages/Onboarding/pages/Seedless/modals/VerifyGoBackModal.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




















const ContentPart = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack)`
  flex-grow: 1;
  height: 100%;
  width: 100%;
  background-color: black;
`;
const OnboardingStep = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack)`
  align-items: center;
  flex: 1;
`;
function Onboarding() {
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_20__.useHistory)();
  const location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_20__.useLocation)();
  const {
    submitInProgress,
    setOnboardingPhase,
    onboardingPhase
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_9__.useOnboardingContext)();
  const {
    initAnalyticsIds,
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_13__.useAnalyticsContext)();
  const [isVerifyGoBackModalOpen, setIsVerifyGoBackModalOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    initAnalyticsIds(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Box, {
    sx: {
      display: 'grid',
      height: '100%',
      gridTemplateColumns: '1fr 1fr'
    }
  }, submitInProgress && /*#__PURE__*/React.createElement(_src_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_10__.LoadingOverlay, null), /*#__PURE__*/React.createElement(ContentPart, {
    sx: {
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    sx: {
      alignItems: 'end',
      py: 2
    }
  }, /*#__PURE__*/React.createElement(_components_LanguageSelector__WEBPACK_IMPORTED_MODULE_0__.LanguageSelector, null)), /*#__PURE__*/React.createElement(OnboardingStep, {
    sx: {
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    sx: {
      height: '100%',
      mt: 2
    }
  }, /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Switch, null, /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.ANALYTICS_CONSENT
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_AnalyticsConsent__WEBPACK_IMPORTED_MODULE_8__.AnalyticsConsent, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.CREATE_PASSWORD
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_CreatePassword__WEBPACK_IMPORTED_MODULE_7__.CreatePassword, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.SEED_PHRASE
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_ImportWallet__WEBPACK_IMPORTED_MODULE_6__.ImportWallet, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.KEYSTONE
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_Keystone_Keystone__WEBPACK_IMPORTED_MODULE_4__.Keystone, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.LEDGER
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_Ledger_LedgerConnect__WEBPACK_IMPORTED_MODULE_5__.LedgerConnect, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.LEDGER_TROUBLE
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_Ledger_LedgerTrouble__WEBPACK_IMPORTED_MODULE_12__.LedgerTrouble, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.CREATE_WALLET
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_CreateWallet_CreateWallet__WEBPACK_IMPORTED_MODULE_2__.CreateWallet, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.RECOVERY_METHODS
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_Seedless_RecoveryMethods__WEBPACK_IMPORTED_MODULE_15__.RecoveryMethods, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.RECOVERY_METHODS_LOGIN
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_Seedless_RecoveryMethodsLogin__WEBPACK_IMPORTED_MODULE_16__.RecoveryMethodsLogin, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.ONBOARDING_HOME
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(_pages_Welcome_Welcome__WEBPACK_IMPORTED_MODULE_14__.Welcome, null))), /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Route, {
    path: "/"
  }, /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CircularProgress, null)
  }, /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_20__.Redirect, {
    to: "/onboarding"
  }))))), location.pathname !== _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.ONBOARDING_HOME && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    sx: {
      width: '100%',
      pl: 1,
      pb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.HomeIcon, {
    size: 20,
    sx: {
      cursor: 'pointer'
    },
    onClick: () => {
      capture('OnboardingCancelled', {
        step: onboardingPhase
      });
      if (onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingPhase.SEEDLESS_GOOGLE) {
        setIsVerifyGoBackModalOpen(true);
        return;
      }
      setOnboardingPhase(null);
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.ONBOARDING_HOME);
    }
  })), /*#__PURE__*/React.createElement(_pages_Seedless_modals_VerifyGoBackModal__WEBPACK_IMPORTED_MODULE_17__.VerifyGoBackModal, {
    isOpen: isVerifyGoBackModalOpen,
    onBack: () => {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.ONBOARDING_HOME);
      setIsVerifyGoBackModalOpen(false);
    },
    onCancel: () => {
      setIsVerifyGoBackModalOpen(false);
    }
  }))), /*#__PURE__*/React.createElement(ContentPart, {
    sx: {
      backgroundColor: 'background.paper',
      height: '100%',
      backdropFilter: 'blur(15px)'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_AppBackground__WEBPACK_IMPORTED_MODULE_11__.AppBackground, null)));
}

/***/ }),

/***/ "./src/pages/Onboarding/components/LanguageSelector.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/Onboarding/components/LanguageSelector.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LanguageSelector": () => (/* binding */ LanguageSelector)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_hooks_useLanguages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useLanguages */ "./src/hooks/useLanguages.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function LanguageSelector() {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const {
    availableLanguages,
    changeLanguage,
    currentLanguage
  } = (0,_src_hooks_useLanguages__WEBPACK_IMPORTED_MODULE_3__.useLanguage)();
  const buttonRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();
  const [isDropdownOpen, setIsDropdownOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.ClickAwayListener, {
    onClickAway: () => setIsDropdownOpen(false)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    variant: "text",
    color: "primary",
    onClick: () => setIsDropdownOpen(!isDropdownOpen),
    ref: buttonRef,
    "data-testid": "onboarding-language-selector",
    sx: {
      gap: 0.5,
      color: 'text.primary'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2",
    className: "current-language"
  }, currentLanguage?.name), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.ChevronDownIcon, {
    size: 16,
    sx: {
      transition: theme.transitions.create('transform'),
      transform: isDropdownOpen ? 'rotateX(180deg)' : 'none'
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Popper, {
    open: isDropdownOpen,
    anchorEl: buttonRef.current,
    placement: "bottom-end",
    transition: true
  }, ({
    TransitionProps
  }) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, TransitionProps, {
    timeout: 250
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.MenuList, {
    dense: true,
    sx: {
      p: 0,
      borderRadius: 1,
      overflow: 'hidden'
    }
  }, availableLanguages.map(lang => {
    const isCurrentLang = lang.code === currentLanguage?.code;
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.MenuItem, {
      key: lang.code,
      onClick: () => {
        changeLanguage(lang.code);
        capture('OnboardingLanguageChanged', {
          language: lang.code
        });
      },
      "data-testid": `onboarding-language-selector-menu-item-${lang.code}`,
      sx: {
        flexDirection: 'row',
        gap: 2,
        justifyContent: 'space-between',
        px: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      color: isCurrentLang ? 'text.secondary' : 'text.primary'
    }, lang.name, " (", lang.originalName, ")"), isCurrentLang && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.CheckIcon, {
      size: 18
    }));
  }))))));
}

/***/ }),

/***/ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx":
/*!******************************************************************!*\
  !*** ./src/pages/Onboarding/components/OnboardingStepHeader.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OnboardingStepHeader": () => (/* binding */ OnboardingStepHeader)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_icons_BrandName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/icons/BrandName */ "./src/components/icons/BrandName.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function OnboardingStepHeader({
  testId,
  title
}) {
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_src_components_icons_BrandName__WEBPACK_IMPORTED_MODULE_0__.BrandName, {
    width: 90
  }), title && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h3",
    sx: {
      pt: 3
    },
    "data-testid": `${testId}-header`
  }, title));
}

/***/ }),

/***/ "./src/pages/Onboarding/components/PageNav.tsx":
/*!*****************************************************!*\
  !*** ./src/pages/Onboarding/components/PageNav.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PageNav": () => (/* binding */ PageNav)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _PageTracker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PageTracker */ "./src/pages/Onboarding/components/PageTracker.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function PageNav({
  onBack,
  backText,
  onNext,
  nextText,
  disableNext,
  nextDisabledReason,
  steps,
  activeStep,
  children,
  expand
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: '100%',
      justifyItems: 'space-between',
      alignContent: 'center',
      my: 3,
      rowGap: `${expand && children ? theme.spacing(2) : theme.spacing(8)}`
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      columnGap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    color: "secondary",
    size: "large",
    "data-testid": "page-nav-back-button",
    onClick: async () => {
      onBack();
    },
    sx: {
      width: theme.spacing(21)
    }
  }, backText ? backText : t('Back')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Tooltip, {
    title: nextDisabledReason,
    sx: {
      cursor: 'not-allowed'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    "data-testid": "page-nav-next-button",
    size: "large",
    disabled: disableNext,
    onClick: async () => {
      onNext();
    },
    sx: {
      width: theme.spacing(21)
    }
  }, nextText ? nextText : t('Next')))), expand && children && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      height: theme.spacing(4)
    }
  }, children), /*#__PURE__*/React.createElement(_PageTracker__WEBPACK_IMPORTED_MODULE_0__.PageTracker, {
    steps: steps,
    activeStep: activeStep
  }));
}

/***/ }),

/***/ "./src/pages/Onboarding/components/PageTracker.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/Onboarding/components/PageTracker.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PageTracker": () => (/* binding */ PageTracker)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function PageTracker({
  steps,
  activeStep
}) {
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.MobileStepper, {
    backButton: null,
    nextButton: null,
    variant: "dots",
    steps: steps,
    position: "static",
    activeStep: activeStep,
    sx: theme => ({
      backgroundColor: 'transparent',
      justifyContent: 'center',
      flexGrow: 1,
      '& .MuiMobileStepper-dot': {
        margin: `0 ${theme.spacing(0.5)}`
      },
      '& .MuiMobileStepper-dotActive': {
        backgroundColor: 'secondary.main'
      }
    })
  });
}

/***/ }),

/***/ "./src/pages/Onboarding/components/WordsLengthSelector.tsx":
/*!*****************************************************************!*\
  !*** ./src/pages/Onboarding/components/WordsLengthSelector.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WordsLengthSelector": () => (/* binding */ WordsLengthSelector)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_seedPhraseValidation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/seedPhraseValidation */ "./src/utils/seedPhraseValidation.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function WordsLengthSelector({
  wordsLength: currentWordsLength,
  setWordsLength
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const buttonRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)();
  const [isDropdownOpen, setIsDropdownOpen] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    color: "secondary",
    onClick: () => setIsDropdownOpen(!isDropdownOpen),
    ref: buttonRef,
    "data-testid": "onboarding-language-selector",
    sx: {
      width: '135px'
    },
    size: "small"
  }, `${currentWordsLength} ${t('Word Phrase')}`, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.ChevronDownIcon, {
    size: 16,
    sx: {
      transition: theme.transitions.create('transform'),
      transform: isDropdownOpen ? 'rotateX(180deg)' : 'none',
      ml: 1
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Popper, {
    open: isDropdownOpen,
    anchorEl: buttonRef.current,
    placement: "bottom-end",
    transition: true
  }, ({
    TransitionProps
  }) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, TransitionProps, {
    timeout: 250
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.MenuList, {
    dense: true,
    sx: {
      p: 0,
      borderRadius: 1,
      overflow: 'hidden'
    }
  }, _src_utils_seedPhraseValidation__WEBPACK_IMPORTED_MODULE_1__.wordPhraseLength.map(length => {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.MenuItem, {
      key: length,
      onClick: () => {
        setWordsLength(length);
      },
      "data-testid": `onboarding-words-length-selector-menu-item-${length}`,
      sx: {
        flexDirection: 'row',
        gap: 2,
        justifyContent: 'space-between',
        px: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      color: currentWordsLength !== length ? 'text.secondary' : 'text.primary'
    }, `${length} ${t('Word Phrase')}`), currentWordsLength === length && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.CheckIcon, {
      size: 18
    }));
  })))));
}

/***/ }),

/***/ "./src/pages/Onboarding/hooks/useSeedlessActions.ts":
/*!**********************************************************!*\
  !*** ./src/pages/Onboarding/hooks/useSeedlessActions.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useSeedlessActions": () => (/* binding */ useSeedlessActions)
/* harmony export */ });
/* harmony import */ var _utils_approveSeedlessRegistration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/approveSeedlessRegistration */ "./src/pages/Onboarding/utils/approveSeedlessRegistration.ts");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/seedless/getCubeSigner */ "./src/utils/seedless/getCubeSigner.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_utils_seedless_getSignerToken__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/utils/seedless/getSignerToken */ "./src/utils/seedless/getSignerToken.ts");
/* harmony import */ var _pages_Seedless_models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pages/Seedless/models */ "./src/pages/Onboarding/pages/Seedless/models.ts");
/* harmony import */ var _src_utils_seedless_fido_launchFidoFlow__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/seedless/fido/launchFidoFlow */ "./src/utils/seedless/fido/launchFidoFlow.ts");
/* harmony import */ var _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/utils/seedless/fido/types */ "./src/utils/seedless/fido/types.ts");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");















const TOTP_ISSUER = 'Core';
const recoveryMethodToFidoKeyType = method => {
  switch (method) {
    case _pages_Seedless_models__WEBPACK_IMPORTED_MODULE_7__.RecoveryMethodTypes.PASSKEY:
      return _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Passkey;
    case _pages_Seedless_models__WEBPACK_IMPORTED_MODULE_7__.RecoveryMethodTypes.YUBIKEY:
      return _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Yubikey;
    default:
      throw new Error('Unsupported FIDO device');
  }
};
function useSeedlessActions() {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__.useAnalyticsContext)();
  const {
    setOidcToken,
    setSeedlessSignerToken,
    oidcToken,
    setUserId,
    setIsSeedlessMfaRequired,
    setNewsletterEmail
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__.useOnboardingContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_12__.useHistory)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_13__.useTranslation)();
  const [totpChallenge, setTotpChallenge] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)();
  const [mfaSession, setMfaSession] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(null);
  const [errorMessage, setErrorMessage] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_10__.useFeatureFlagContext)();
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!errorMessage) {
      return;
    }
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"].error(errorMessage);
  }, [errorMessage]);
  const handleOidcToken = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async idToken => {
    setOidcToken(idToken);
    const oidcClient = (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.getOidcClient)(idToken);
    const identity = await oidcClient.identityProve();
    if (!identity.user_info) {
      const result = await (0,_utils_approveSeedlessRegistration__WEBPACK_IMPORTED_MODULE_0__.approveSeedlessRegistration)(identity, !featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_11__.FeatureGates.SEEDLESS_OPTIONAL_MFA]);
      if (result !== _utils_approveSeedlessRegistration__WEBPACK_IMPORTED_MODULE_0__.SeedlessRegistartionResult.APPROVED) {
        _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"].error(t('Seedless login error'));
        return;
      }
    } else {
      // If the user already has an account, it's possible that the
      // account was created before we made MFA optional, but the user
      // then resigned from following through (e.g. didn't know how to
      // use MFA yet). So now we're in a situation where we need to use
      // the user's OIDC token to get the information about their
      // CubeSigner account and see if it has an MFA policy set.
      const oidcAuth = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(idToken);
      const mfaSessionInfo = oidcAuth.mfaSessionInfo();

      // We set the policy to undefined when MFA is optional.
      setIsSeedlessMfaRequired(typeof mfaSessionInfo !== 'undefined');
    }
    setUserId(identity.identity?.sub);
    setNewsletterEmail(identity.email ?? '');
    if ((identity.user_info?.configured_mfa ?? []).length === 0) {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingURLs.RECOVERY_METHODS);
    } else {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingURLs.RECOVERY_METHODS_LOGIN);
    }
  }, [setOidcToken, setUserId, setIsSeedlessMfaRequired, setNewsletterEmail, t, history, featureFlags]);
  const signIn = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(({
    setIsLoading,
    getOidcToken,
    provider
  }) => {
    setIsLoading(true);
    getOidcToken().then(handleOidcToken).catch(() => {
      capture('SeedlessSignInFailed', {
        provider
      });
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"].error(t('Seedless login error'));
    }).finally(() => {
      setIsLoading(false);
    });
  }, [capture, handleOidcToken, t]);
  const registerTOTPStart = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => {
    if (!oidcToken) {
      return false;
    }
    (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(oidcToken).then(async c => {
      const mfaSessionInfo = c.requiresMfa() ? c.mfaSessionInfo() : c.data();
      if (!mfaSessionInfo) {
        console.error('No MFA info');
        return;
      }
      const signerSession = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.getSignerSession)(mfaSessionInfo);
      setMfaSession(signerSession);
      signerSession.resetTotpStart(TOTP_ISSUER).then(challenge => {
        setTotpChallenge(challenge.data());
      }).catch(e => {
        console.error(e);
        (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"])(t('Unable to set TOTP configuration'));
      });
      return true;
    }).catch(e => {
      console.error(e);
      capture('SeedlessRegisterTOTPStartFailed');
      return false;
    });
  }, [capture, oidcToken, t]);
  const verifyRegistrationCode = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async code => {
    setErrorMessage('');
    if (!totpChallenge || !mfaSession || code.length < 6 || !oidcToken) {
      return;
    }
    try {
      await mfaSession.resetTotpComplete(totpChallenge.totpId, code);
      // attempt to reuse the code quickly
      const c = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(oidcToken);
      if (!c.requiresMfa()) {
        throw new Error('MFA setup failed');
      }
      const status = await mfaSession.totpApprove(c.mfaId(), code);
      if (!status.receipt?.confirmation) {
        setErrorMessage(t('Code verification error'));
        return;
      }
      const oidcAuthResponse = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(oidcToken, {
        mfaOrgId: (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.getOrgId)(),
        mfaId: c.mfaId(),
        mfaConf: status.receipt.confirmation
      });
      const signerToken = oidcAuthResponse.data();
      setSeedlessSignerToken(signerToken);
      return true;
    } catch (_err) {
      setErrorMessage(t('Invalid code'));
      return false;
    }
  }, [oidcToken, setSeedlessSignerToken, t, totpChallenge, mfaSession]);
  const loginWithFIDO = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async () => {
    if (!oidcToken) {
      return false;
    }
    let resp = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(oidcToken);
    if (resp.requiresMfa()) {
      const mfaSessionInfo = resp.mfaSessionInfo();
      if (!mfaSessionInfo) {
        return false;
      }
      const signerSession = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.getSignerSession)(mfaSessionInfo);
      const respondMfaId = resp.mfaId();
      const challenge = await signerSession.fidoApproveStart(respondMfaId);

      // prompt the user to tap their FIDO and send the answer back to CubeSigner
      const answer = await (0,_src_utils_seedless_fido_launchFidoFlow__WEBPACK_IMPORTED_MODULE_8__.launchFidoFlow)(_src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.FIDOApiEndpoint.Authenticate, challenge.options);
      const mfaInfo = await challenge.answer(answer);

      // print out the current status of the MFA request and assert that it has been approved
      if (!mfaInfo.receipt) {
        throw new Error('MFA not approved yet');
      }

      // proceed with the MFA approval
      resp = await resp.signWithMfaApproval({
        mfaId: respondMfaId,
        mfaOrgId: "Org#abc03353-9320-4bf4-bc25-d1b687bf2b2c" || 0,
        mfaConf: mfaInfo.receipt.confirmation
      });
    }
    if (resp.requiresMfa()) {
      throw new Error('MFA should not be required after approval');
    }
    setSeedlessSignerToken(await (0,_src_utils_seedless_getSignerToken__WEBPACK_IMPORTED_MODULE_6__.getSignerToken)(resp));
    return true;
  }, [oidcToken, setSeedlessSignerToken]);
  const loginWithoutMFA = async () => {
    if (!oidcToken) {
      throw new Error('There is no token to log in');
    }
    const authResponse = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(oidcToken);
    const signerToken = await (0,_src_utils_seedless_getSignerToken__WEBPACK_IMPORTED_MODULE_6__.getSignerToken)(authResponse);
    setSeedlessSignerToken(signerToken);
  };
  const addFIDODevice = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async (name, selectedMethod) => {
    if (!oidcToken) {
      return false;
    }
    const loginResp = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(oidcToken);
    const mfaSessionInfo = loginResp.requiresMfa() ? loginResp.mfaSessionInfo() : loginResp.data();
    if (!mfaSessionInfo) {
      console.error('No MFA info');
      return;
    }
    const session = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.getSignerSession)(mfaSessionInfo);
    const addFidoResp = await session.addFidoStart(name);
    const challenge = addFidoResp.data();
    if (selectedMethod === _pages_Seedless_models__WEBPACK_IMPORTED_MODULE_7__.RecoveryMethodTypes.PASSKEY && (await PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable())) {
      challenge.options.authenticatorSelection = {
        authenticatorAttachment: 'platform'
      };
    }
    const answer = await (0,_src_utils_seedless_fido_launchFidoFlow__WEBPACK_IMPORTED_MODULE_8__.launchFidoFlow)(_src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.FIDOApiEndpoint.Register, challenge.options, recoveryMethodToFidoKeyType(selectedMethod));
    await challenge.answer(answer);
    return true;
  }, [oidcToken]);
  return {
    signIn,
    registerTOTPStart,
    totpChallenge,
    verifyRegistrationCode,
    addFIDODevice,
    loginWithFIDO,
    loginWithoutMFA
  };
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/AnalyticsConsent.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/Onboarding/pages/AnalyticsConsent.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnalyticsConsent": () => (/* binding */ AnalyticsConsent)
/* harmony export */ });
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _components_PageNav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/PageNav */ "./src/pages/Onboarding/components/PageNav.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _Seedless_modals_VerifyGoBackModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Seedless/modals/VerifyGoBackModal */ "./src/pages/Onboarding/pages/Seedless/modals/VerifyGoBackModal.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");









const AnalyticsConsent = () => {
  const {
    setAnalyticsConsent,
    submit,
    onboardingPhase,
    analyticsConsent,
    newsletterEmail,
    isNewsletterEnabled
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_0__.useOnboardingContext)();
  const {
    capture,
    stopDataCollection
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useHistory)();
  const [isVerifyGoBackModalOpen, setIsVerifyGoBackModalOpen] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const getSteps = (0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    if (onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingPhase.IMPORT_WALLET) {
      return {
        stepsNumber: 3,
        activeStep: 2
      };
    }
    if (onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingPhase.KEYSTONE) {
      return {
        stepsNumber: 6,
        activeStep: 5
      };
    }
    if (onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingPhase.SEEDLESS_GOOGLE || onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingPhase.SEEDLESS_APPLE) {
      return {
        stepsNumber: 3,
        activeStep: 2
      };
    }
    return {
      stepsNumber: 4,
      activeStep: 3
    };
  }, [onboardingPhase]);
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!onboardingPhase) {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingURLs.ONBOARDING_HOME);
    }
    capture(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingPhase.ANALYTICS_CONSENT);
  }, [capture, history, onboardingPhase]);
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (analyticsConsent === undefined) {
      return;
    }
    const coreWebLink = `${"https://core.app"}/discover/?newUser=1`;

    // submit handler can't be in the onNext and onBack callbacks since it would run in a stale closure
    // resulting in an always false analytics consent
    submit(async () => coreWebLink ? window.location.replace(coreWebLink) : window.close());
  }, [analyticsConsent, onboardingPhase, submit, newsletterEmail, capture, isNewsletterEnabled]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      width: '465px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      mt: 4,
      flexGrow: 1,
      textAlign: 'center',
      gap: 4,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      alignItems: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.AirdropIcon, {
    size: 64
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    variant: "h3"
  }, t('Unlock Airdrops'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      mb: 4,
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    variant: "body2"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_9__.Trans, {
    i18nKey: "As a Core user, you have the option to opt-in for <b>airdrop rewards</b> based on your activity and engagement. Core will collect anonymous interaction data to power this feature.",
    components: {
      b: /*#__PURE__*/React.createElement("b", null)
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    variant: "body2"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_9__.Trans, {
    i18nKey: "Core is committed to protecting your privacy. We will <b>never</b> sell or share your data. If you wish, you can disable this at any time in the settings menu.",
    components: {
      b: /*#__PURE__*/React.createElement("b", null)
    }
  })))), /*#__PURE__*/React.createElement(_components_PageNav__WEBPACK_IMPORTED_MODULE_3__.PageNav, {
    onBack: () => {
      if (onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingPhase.SEEDLESS_GOOGLE || onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingPhase.SEEDLESS_APPLE) {
        setIsVerifyGoBackModalOpen(true);
        return;
      }
      history.goBack();
    },
    backText: t('Back'),
    onNext: async () => {
      capture('OnboardingAnalyticsAccepted');
      setAnalyticsConsent(true);
    },
    nextText: t('Unlock'),
    disableNext: false,
    expand: true,
    steps: getSteps.stepsNumber,
    activeStep: getSteps.activeStep
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Button, {
    variant: "text",
    onClick: async () => {
      capture('OnboardingAnalyticsRejected');
      stopDataCollection();
      setAnalyticsConsent(false);
    },
    disableRipple: true,
    sx: {
      color: 'secondary'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    variant: "caption",
    sx: {
      ml: 1
    }
  }, t('No Thanks')))), /*#__PURE__*/React.createElement(_Seedless_modals_VerifyGoBackModal__WEBPACK_IMPORTED_MODULE_5__.VerifyGoBackModal, {
    isOpen: isVerifyGoBackModalOpen,
    onBack: () => {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingURLs.ONBOARDING_HOME);
      setIsVerifyGoBackModalOpen(false);
    },
    onCancel: () => {
      setIsVerifyGoBackModalOpen(false);
    }
  }));
};

/***/ }),

/***/ "./src/pages/Onboarding/pages/CreatePassword.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/Onboarding/pages/CreatePassword.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CreatePassword": () => (/* binding */ CreatePassword)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/OnboardingStepHeader */ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _components_PageNav__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/PageNav */ "./src/pages/Onboarding/components/PageNav.tsx");
/* harmony import */ var _src_components_common_PasswordStrength__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/PasswordStrength */ "./src/components/common/PasswordStrength.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _components_TypographyLink__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/TypographyLink */ "./src/pages/Onboarding/components/TypographyLink.tsx");
/* harmony import */ var _Seedless_modals_VerifyGoBackModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Seedless/modals/VerifyGoBackModal */ "./src/pages/Onboarding/pages/Seedless/modals/VerifyGoBackModal.tsx");
/* harmony import */ var _avalabs_types__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/types */ "./node_modules/@avalabs/types/esm/coreAccounts.js");
/* harmony import */ var joi__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! joi */ "./node_modules/joi/lib/index.js");
/* harmony import */ var joi__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(joi__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _src_utils_newsletter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/utils/newsletter */ "./src/utils/newsletter.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");















var EmailValidationResult = /*#__PURE__*/function (EmailValidationResult) {
  EmailValidationResult[EmailValidationResult["Undetermined"] = 0] = "Undetermined";
  EmailValidationResult[EmailValidationResult["Valid"] = 1] = "Valid";
  EmailValidationResult[EmailValidationResult["Invalid"] = 2] = "Invalid";
  return EmailValidationResult;
}(EmailValidationResult || {});
const validateEmail = email => {
  const {
    error
  } = joi__WEBPACK_IMPORTED_MODULE_9___default().string().email().validate(email);
  return error ? EmailValidationResult.Invalid : EmailValidationResult.Valid;
};
const CreatePassword = () => {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__.useAnalyticsContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_11__.useHistory)();
  const {
    setPasswordAndNames,
    onboardingPhase,
    isNewsletterEnabled,
    setIsNewsletterEnabled,
    newsletterEmail,
    setNewsletterEmail,
    onboardingWalletType
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__.useOnboardingContext)();
  const [walletName, setWalletName] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [password, setPassword] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [confirmPasswordVal, setConfirmPasswordVal] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [termAndPolicyChecked, setTermAndPolicyChecked] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isPasswordInputFilled, setIsPasswordInputFilled] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_12__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__["default"])();
  const [newPasswordStrength, setNewPasswordStrength] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [isVerifyGoBackModalOpen, setIsVerifyGoBackModalOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [emailValidationResult, setEmailValidationResult] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(onboardingWalletType === _avalabs_types__WEBPACK_IMPORTED_MODULE_14__.WalletType.Seedless ? EmailValidationResult.Valid : newsletterEmail ? validateEmail(newsletterEmail) : EmailValidationResult.Undetermined);
  const getSteps = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.IMPORT_WALLET) {
      return {
        stepsNumber: 3,
        activeStep: 1
      };
    }
    if (onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.KEYSTONE) {
      return {
        stepsNumber: 6,
        activeStep: 4
      };
    }
    if (onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.SEEDLESS_GOOGLE || onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.SEEDLESS_APPLE) {
      return {
        stepsNumber: 3,
        activeStep: 1
      };
    }
    return {
      stepsNumber: 4,
      activeStep: 2
    };
  }, [onboardingPhase]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!onboardingPhase) {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingURLs.ONBOARDING_HOME);
    }
    capture(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.PASSWORD);
  }, [capture, history, onboardingPhase]);
  const isFieldsFilled = !!(password && confirmPasswordVal);
  const confirmationError = !!(password && confirmPasswordVal && password !== confirmPasswordVal);
  const passwordLengthError = isPasswordInputFilled && password && password.length < 8;
  const canSubmit = !confirmationError && isFieldsFilled && termAndPolicyChecked && newPasswordStrength > 1 && (!isNewsletterEnabled || emailValidationResult === EmailValidationResult.Valid);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      width: 375,
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_3__.OnboardingStepHeader, {
    testId: "name-and-password",
    title: t('Account Details')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexGrow: 1,
      mb: 3,
      px: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "body2",
    sx: {
      mb: 4
    },
    color: theme.palette.text.secondary
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_16__.Trans, {
    i18nKey: "For your security, please create a name and password."
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      alignSelf: 'center',
      rowGap: 2,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.TextField, {
    size: "small",
    "data-testid": "wallet-name-input",
    label: t('Wallet Name'),
    onChange: e => setWalletName(e.target.value),
    placeholder: t('Enter a Name'),
    autoFocus: true,
    fullWidth: true,
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: theme.typography.body2.fontSize,
        pb: 0.5
      }
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      minHeight: theme.spacing(10)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.TextField, {
    size: "small",
    "data-testid": "wallet-password-input",
    type: "password",
    label: t('Password'),
    onChange: e => setPassword(e.target.value),
    placeholder: t('Enter a Password'),
    error: !!passwordLengthError,
    helperText: password ? '' : t('Password must be 8 characters minimum'),
    onBlur: () => {
      setIsPasswordInputFilled(true);
    },
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: theme.typography.body2.fontSize,
        pb: 0.5
      }
    },
    fullWidth: true
  }), password && /*#__PURE__*/React.createElement(_src_components_common_PasswordStrength__WEBPACK_IMPORTED_MODULE_6__.PasswordStrength, {
    password: password,
    setPasswordStrength: setNewPasswordStrength
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      minHeight: theme.spacing(10)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.TextField, {
    size: "small",
    type: "password",
    "data-testid": "wallet-confirm-password-input",
    label: t('Confirm Password'),
    onChange: e => setConfirmPasswordVal(e.target.value),
    placeholder: t('Confirm Password'),
    error: confirmationError,
    helperText: confirmationError ? t('Passwords do not match') : undefined,
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: theme.typography.body2.fontSize,
        pb: 0.5
      }
    },
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      justifyContent: 'center',
      mt: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Checkbox, {
    disableRipple: true,
    size: "small",
    style: {
      height: theme.spacing(2.5),
      color: termAndPolicyChecked ? theme.palette.secondary.main : theme.palette.primary.main
    },
    "data-testid": "terms-of-use-checkbox",
    checked: termAndPolicyChecked,
    onChange: () => setTermAndPolicyChecked(!termAndPolicyChecked),
    label: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
      variant: "caption"
    }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_16__.Trans, {
      i18nKey: "I have read and agree to the <termLink>Terms of Use</termLink>",
      components: {
        termLink: /*#__PURE__*/React.createElement(_components_TypographyLink__WEBPACK_IMPORTED_MODULE_7__.TypographyLink, {
          as: "a",
          target: "_blank",
          href: "https://core.app/terms/core",
          variant: "caption",
          sx: {
            color: 'secondary.main'
          },
          rel: "noreferrer"
        })
      }
    }))
  }))), (0,_src_utils_newsletter__WEBPACK_IMPORTED_MODULE_10__.isNewsletterConfigured)() && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Divider, {
    light: true,
    sx: {
      my: 4,
      mx: 1.5
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      alignSelf: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Checkbox, {
    disableRipple: true,
    size: "small",
    style: {
      height: theme.spacing(2.5),
      color: isNewsletterEnabled ? theme.palette.secondary.main : theme.palette.primary.main
    },
    sx: {
      alignSelf: 'flex-start',
      mt: -0.25
    },
    "data-testid": "newsletter-checkbox",
    checked: isNewsletterEnabled,
    onChange: () => setIsNewsletterEnabled(enabled => !enabled),
    label: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
      variant: "caption"
    }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_16__.Trans, {
      i18nKey: "Stay updated on latest airdrops, events and more! You can unsubscribe anytime. For more details, see our <privacyLink>Privacy Policy</privacyLink>",
      components: {
        privacyLink: /*#__PURE__*/React.createElement(_components_TypographyLink__WEBPACK_IMPORTED_MODULE_7__.TypographyLink, {
          as: "a",
          target: "_blank",
          href: "https://www.avalabs.org/privacy-policy",
          variant: "caption",
          sx: {
            color: 'secondary.main'
          },
          rel: "noreferrer"
        })
      }
    }))
  }))), isNewsletterEnabled && onboardingWalletType !== _avalabs_types__WEBPACK_IMPORTED_MODULE_14__.WalletType.Seedless && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.TextField, {
    autoFocus: true,
    sx: {
      mt: 1.5
    },
    size: "small",
    "data-testid": "newsletter-email-input",
    onChange: e => {
      setNewsletterEmail(e.target.value);
      setEmailValidationResult(validateEmail(e.target.value));
    },
    value: newsletterEmail,
    placeholder: t('E-mail address'),
    error: emailValidationResult === EmailValidationResult.Invalid,
    helperText: emailValidationResult === EmailValidationResult.Invalid ? t('Please provide a valid e-mail address') : '',
    fullWidth: true,
    InputProps: {
      endAdornment: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.InputAdornment, {
        position: "end"
      }, emailValidationResult === EmailValidationResult.Valid && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.CheckIcon, {
        color: theme.palette.success.main
      }), emailValidationResult === EmailValidationResult.Invalid && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.XIcon, {
        color: theme.palette.error.main
      }))
    }
  }))), /*#__PURE__*/React.createElement(_components_PageNav__WEBPACK_IMPORTED_MODULE_5__.PageNav, {
    onBack: () => {
      capture('OnboardingPasswordCancelled');
      if (onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.SEEDLESS_GOOGLE) {
        setIsVerifyGoBackModalOpen(true);
        return;
      }
      history.goBack();
    },
    onNext: () => {
      capture('OnboardingPasswordSet');
      setPasswordAndNames(password, walletName);
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingURLs.ANALYTICS_CONSENT);
    },
    nextText: t('Save'),
    disableNext: !canSubmit,
    expand: onboardingPhase === _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.CREATE_WALLET ? false : true,
    steps: getSteps.stepsNumber,
    activeStep: getSteps.activeStep
  }), /*#__PURE__*/React.createElement(_Seedless_modals_VerifyGoBackModal__WEBPACK_IMPORTED_MODULE_8__.VerifyGoBackModal, {
    isOpen: isVerifyGoBackModalOpen,
    onBack: () => {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingURLs.ONBOARDING_HOME);
      setIsVerifyGoBackModalOpen(false);
    },
    onCancel: () => {
      setIsVerifyGoBackModalOpen(false);
    }
  }));
};

/***/ }),

/***/ "./src/pages/Onboarding/pages/CreateWallet/ConfirmMnemonic.tsx":
/*!*********************************************************************!*\
  !*** ./src/pages/Onboarding/pages/CreateWallet/ConfirmMnemonic.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConfirmMnemonic": () => (/* binding */ ConfirmMnemonic)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const BoldText = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])('span')`
  font-weight: bold;
`;
function ConfirmMnemonic({
  phrase,
  wordCount = 24,
  confirmWordCount = 3,
  onConfirmedChange
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const [wordsToConfirm, setWordsToConfirm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const words = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return phrase.split(' ');
  }, [phrase]);
  const firstWordText = t('Select the first word');
  const nextWordText = t('Select the word that comes after');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const getRandomWordsForIndex = index => {
      const randomWords = [];
      while (randomWords.length < 2) {
        const randomIndex = Math.floor(Math.random() * wordCount);
        const randomWord = words[randomIndex];
        if (randomIndex === index || words.length <= randomIndex || !randomWord || randomWords.includes(randomWord)) {
          continue;
        }
        randomWords.push(randomWord);
      }
      return randomWords;
    };
    const toConfirm = {};
    while (Object.keys(toConfirm).length < confirmWordCount) {
      const randomIndex = Math.floor(Math.random() * wordCount);
      const randomWord = words[randomIndex];
      if (!toConfirm[randomIndex] && randomWord) {
        toConfirm[randomIndex] = {
          index: randomIndex,
          randomWords: [randomWord, ...getRandomWordsForIndex(randomIndex)].sort(() => 0.5 - Math.random()),
          selected: ''
        };
      }
    }
    setWordsToConfirm(toConfirm);
  }, [confirmWordCount, wordCount, words]);
  const selectWordForIndex = (index, word) => {
    const selectedWord = wordsToConfirm[index];
    if (selectedWord) {
      const newState = {
        ...wordsToConfirm,
        [index]: {
          ...selectedWord,
          selected: word
        }
      };
      setWordsToConfirm(newState);
      if (!onConfirmedChange) {
        return;
      }
      onConfirmedChange(Object.values(newState).every(item => item.index >= 0 && words[item.index] === item.selected));
    }
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, Object.keys(wordsToConfirm).map(Number).map(i => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    key: i,
    sx: {
      mb: 4,
      textAlign: 'left'
    }
  }, i !== 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body1",
    sx: {
      mb: 2
    }
  }, nextWordText, " ", /*#__PURE__*/React.createElement(BoldText, null, `(${words[i - 1]})`))) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body1",
    sx: {
      mb: 2,
      fontWeight: 'fontWeightBold'
    }
  }, `${firstWordText}`), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row'
    }
  }, wordsToConfirm[i]?.randomWords.map(randomWord => {
    const selected = wordsToConfirm[i]?.selected === randomWord;
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
      key: `${i}-${randomWord}`,
      onClick: () => selectWordForIndex(i, randomWord),
      sx: {
        flexDirection: 'row',
        borderRadius: 12.5,
        py: 1,
        mx: 1,
        justifyContent: 'center',
        width: theme.spacing(13),
        background: selected ? theme.palette.primary.main : theme.palette.grey[800],
        color: selected ? theme.palette.grey[800] : theme.palette.primary.main,
        cursor: 'pointer',
        '&:first-of-type': {
          ml: '0'
        },
        '&:last-of-type': {
          mr: '0'
        },
        '&:hover': {
          background: theme.palette.primary.main,
          color: theme.palette.grey[800]
        }
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
      variant: "caption",
      sx: {
        userSelect: 'none',
        fontWeight: 'semibold'
      }
    }, randomWord));
  })))));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/CreateWallet/ConfirmPhrase.tsx":
/*!*******************************************************************!*\
  !*** ./src/pages/Onboarding/pages/CreateWallet/ConfirmPhrase.tsx ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConfirmPhrase": () => (/* binding */ ConfirmPhrase)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/OnboardingStepHeader */ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _Mnemonic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Mnemonic */ "./src/pages/Onboarding/pages/CreateWallet/Mnemonic.tsx");
/* harmony import */ var _components_PageNav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/PageNav */ "./src/pages/Onboarding/components/PageNav.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function ConfirmPhrase({
  onNext,
  onBack,
  mnemonic
}) {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const [termsConfirmed, setTermsConfirmed] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_1__.OnboardingStepHeader, {
    testId: "confirm-phrase",
    title: t('Verify Phrase')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    "data-testid": "confirm-phrase-section",
    sx: {
      flexGrow: 1,
      pt: 1,
      px: 6,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      mb: 5
    },
    color: theme.palette.text.secondary
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_8__.Trans, {
    i18nKey: "Select the words below to verify your secret recovery phrase."
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    alignSelf: "center"
  }, /*#__PURE__*/React.createElement(_Mnemonic__WEBPACK_IMPORTED_MODULE_3__.Mnemonic, {
    phrase: mnemonic,
    confirmMnemonic: true,
    onConfirmedChange: confirmed => {
      setTermsConfirmed(confirmed);
    }
  }))), /*#__PURE__*/React.createElement(_components_PageNav__WEBPACK_IMPORTED_MODULE_4__.PageNav, {
    onBack: onBack,
    onNext: () => {
      capture('OnboardingMnemonicVerified');
      onNext();
    },
    nextText: t('Save'),
    disableNext: !termsConfirmed,
    expand: false,
    steps: 4,
    activeStep: 1
  }));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/CreateWallet/CopyPhrase.tsx":
/*!****************************************************************!*\
  !*** ./src/pages/Onboarding/pages/CreateWallet/CopyPhrase.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CopyPhrase": () => (/* binding */ CopyPhrase)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/OnboardingStepHeader */ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _Mnemonic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Mnemonic */ "./src/pages/Onboarding/pages/CreateWallet/Mnemonic.tsx");
/* harmony import */ var _components_PageNav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/PageNav */ "./src/pages/Onboarding/components/PageNav.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function CopyPhrase({
  onBack,
  onNext,
  mnemonic
}) {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const [termsConfirmed, setTermsConfirmed] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '410px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_1__.OnboardingStepHeader, {
    testId: "copy-phrase",
    title: t('Write Down Recovery Phrase')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    "data-testid": "copy-phrase-section",
    sx: {
      flexGrow: 1,
      textAlign: 'center',
      mb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      mb: 5
    },
    color: theme.palette.text.secondary
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_8__.Trans, {
    i18nKey: "This is your secret recovery phrase. Write it down, and store it in a secure location."
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    alignItems: "center",
    sx: {
      rowGap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: theme.spacing(44),
      mb: 4
    }
  }, /*#__PURE__*/React.createElement(_Mnemonic__WEBPACK_IMPORTED_MODULE_3__.Mnemonic, {
    phrase: mnemonic,
    confirmMnemonic: false
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: theme.spacing(44)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Checkbox, {
    "data-testid": "privacy-policy-checkbox",
    onChange: e => {
      setTermsConfirmed(e.target.checked);
    },
    disableRipple: true,
    style: {
      height: theme.spacing(2.5),
      color: termsConfirmed ? theme.palette.secondary.main : theme.palette.primary.main
    },
    label: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
      sx: {
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
      variant: "caption"
    }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_8__.Trans, {
      i18nKey: "I understand losing this phrase will result in lost funds. I have stored it in a secure location."
    })))
  })))), /*#__PURE__*/React.createElement(_components_PageNav__WEBPACK_IMPORTED_MODULE_4__.PageNav, {
    onBack: onBack,
    onNext: () => {
      capture('OnboardingMnemonicCreated');
      onNext();
    },
    disableNext: !termsConfirmed,
    expand: false,
    steps: 4,
    activeStep: 0
  }));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/CreateWallet/CreateWallet.tsx":
/*!******************************************************************!*\
  !*** ./src/pages/Onboarding/pages/CreateWallet/CreateWallet.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CreateWallet": () => (/* binding */ CreateWallet)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_background_services_wallet_utils_createMnemonicPhrase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/wallet/utils/createMnemonicPhrase */ "./src/background/services/wallet/utils/createMnemonicPhrase.ts");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var _ConfirmPhrase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ConfirmPhrase */ "./src/pages/Onboarding/pages/CreateWallet/ConfirmPhrase.tsx");
/* harmony import */ var _CopyPhrase__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CopyPhrase */ "./src/pages/Onboarding/pages/CreateWallet/CopyPhrase.tsx");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _avalabs_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/types */ "./node_modules/@avalabs/types/esm/coreAccounts.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");









function CreateWallet() {
  const {
    setMnemonic,
    setOnboardingPhase,
    setOnboardingWalletType
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_2__.useOnboardingContext)();
  const [isCopied, setIsCopied] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [mnemonic, setMnemonicPhrase] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__.useAnalyticsContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useHistory)();
  const onCancel = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    capture('OnboardingCancelled', {
      step: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_5__.OnboardingPhase.CREATE_WALLET
    });
    history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_5__.OnboardingURLs.ONBOARDING_HOME);
  }, [capture, history]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setMnemonicPhrase((0,_src_background_services_wallet_utils_createMnemonicPhrase__WEBPACK_IMPORTED_MODULE_1__.createNewMnemonic)());
    setOnboardingPhase(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_5__.OnboardingPhase.CREATE_WALLET);
    setOnboardingWalletType(_avalabs_types__WEBPACK_IMPORTED_MODULE_8__.WalletType.Mnemonic);
    capture(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_5__.ONBOARDING_EVENT_NAMES.create_wallet);
  }, [capture, setOnboardingPhase, setOnboardingWalletType]);
  return isCopied ? /*#__PURE__*/React.createElement(_ConfirmPhrase__WEBPACK_IMPORTED_MODULE_3__.ConfirmPhrase, {
    onBack: () => setIsCopied(false),
    onNext: () => {
      setMnemonic(mnemonic);
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_5__.OnboardingURLs.CREATE_PASSWORD);
    },
    onCancel: onCancel,
    mnemonic: mnemonic
  }) : /*#__PURE__*/React.createElement(_CopyPhrase__WEBPACK_IMPORTED_MODULE_4__.CopyPhrase, {
    onNext: () => setIsCopied(true),
    onCancel: onCancel,
    mnemonic: mnemonic,
    onBack: onCancel
  });
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/CreateWallet/Mnemonic.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/Onboarding/pages/CreateWallet/Mnemonic.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mnemonic": () => (/* binding */ Mnemonic)
/* harmony export */ });
/* harmony import */ var _ConfirmMnemonic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ConfirmMnemonic */ "./src/pages/Onboarding/pages/CreateWallet/ConfirmMnemonic.tsx");
/* harmony import */ var _ShowMnemonic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ShowMnemonic */ "./src/pages/Onboarding/pages/CreateWallet/ShowMnemonic.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function Mnemonic(props) {
  return props.confirmMnemonic ? /*#__PURE__*/React.createElement(_ConfirmMnemonic__WEBPACK_IMPORTED_MODULE_0__.ConfirmMnemonic, props) : /*#__PURE__*/React.createElement(_ShowMnemonic__WEBPACK_IMPORTED_MODULE_1__.ShowMnemonic, props);
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/CreateWallet/ShowMnemonic.tsx":
/*!******************************************************************!*\
  !*** ./src/pages/Onboarding/pages/CreateWallet/ShowMnemonic.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShowMnemonic": () => (/* binding */ ShowMnemonic)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _utils_getRandomMnemonicWord__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/getRandomMnemonicWord */ "./src/pages/Onboarding/utils/getRandomMnemonicWord.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const FakeWord = () => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
  as: "span",
  translate: "no",
  sx: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1,
    opacity: 0
  }
}, (0,_utils_getRandomMnemonicWord__WEBPACK_IMPORTED_MODULE_1__.getRandomMnemonicWord)());
function ShowMnemonic({
  phrase,
  wordCount = 24
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const words = phrase.split(' ');
  const inputs = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const list = [];
    for (let num = 1; num <= wordCount; num++) {
      const isFakeBeforeReal = Math.random() < 0.5;
      list.push( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Grid, {
        item: true,
        key: num
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        sx: {
          width: theme.spacing(13),
          alignItems: 'center',
          flexDirection: 'row'
        }
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
        variant: "body2",
        sx: {
          userSelect: 'none',
          minWidth: 2,
          mr: 1
        }
      }, num, "."), isFakeBeforeReal && /*#__PURE__*/React.createElement(FakeWord, null), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
        as: "span",
        variant: "body2",
        translate: "no"
      }, words[num - 1]), !isFakeBeforeReal && /*#__PURE__*/React.createElement(FakeWord, null))));
    }
    return list;
  }, [wordCount, words, theme]);
  const onCopy = () => {
    navigator.clipboard.writeText(phrase);
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"].success(t('Copied!'), {
      duration: 2000,
      position: 'top-left'
    });
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    alignItems: "flex-end"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Grid, {
    container: true,
    sx: {
      backgroundColor: theme.palette.grey[850],
      height: theme.spacing(38),
      width: theme.spacing(44),
      justifyContent: 'space-between',
      alignItems: 'center',
      rowGap: 1.5,
      p: 2,
      borderRadius: 1,
      userSelect: 'none' // prevent user from manually selecting & copying the phrase, as it contains fake words in-between
    },

    onCopy: ev => ev.preventDefault()
  }, inputs), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "text",
    onClick: onCopy,
    sx: {
      color: 'secondary'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.CopyIcon, {
    size: 16
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    sx: {
      ml: 1
    }
  }, t('Copy Phrase'))));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/ImportWallet.tsx":
/*!*****************************************************!*\
  !*** ./src/pages/Onboarding/pages/ImportWallet.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImportWallet": () => (/* binding */ ImportWallet)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/OnboardingStepHeader */ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _components_PageNav__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/PageNav */ "./src/pages/Onboarding/components/PageNav.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _components_WordsLengthSelector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/WordsLengthSelector */ "./src/pages/Onboarding/components/WordsLengthSelector.tsx");
/* harmony import */ var _utils_splitSeedPhrase__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/splitSeedPhrase */ "./src/pages/Onboarding/utils/splitSeedPhrase.ts");
/* harmony import */ var _src_utils_seedPhraseValidation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/seedPhraseValidation */ "./src/utils/seedPhraseValidation.ts");
/* harmony import */ var _avalabs_types__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/types */ "./node_modules/@avalabs/types/esm/coreAccounts.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");













const ImportWallet = () => {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__.useAnalyticsContext)();
  const {
    setMnemonic,
    setOnboardingPhase,
    setOnboardingWalletType
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__.useOnboardingContext)();
  const [recoveryPhrase, setRecoveryPhrase] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_9__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__["default"])();
  const [wordsLength, setWordsLength] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(24);
  const [words, setWords] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_11__.useHistory)();
  const onNext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (recoveryPhrase) {
      capture('OnboardingMnemonicImported');
      setMnemonic(recoveryPhrase);
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingURLs.CREATE_PASSWORD);
    }
  }, [capture, history, recoveryPhrase, setMnemonic]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setOnboardingPhase(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.IMPORT_WALLET);
    setOnboardingWalletType(_avalabs_types__WEBPACK_IMPORTED_MODULE_12__.WalletType.Mnemonic);
    capture(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.ONBOARDING_EVENT_NAMES.import_wallet);
  }, [capture, setOnboardingPhase, setOnboardingWalletType]);
  const sliceWords = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(selectedLength => {
    setWordsLength(selectedLength);
    setWords(currentWords => {
      const cutWords = [...currentWords];
      const limit = selectedLength > currentWords.length ? currentWords.length : selectedLength;
      return [...currentWords.slice(0, selectedLength), ...cutWords].slice(0, limit);
    });
  }, []);
  const isPhraseValid = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(phrase => {
    if (wordsLength !== words.length) {
      return false;
    }
    return phrase && (0,_src_utils_seedPhraseValidation__WEBPACK_IMPORTED_MODULE_8__.isPhraseCorrect)(phrase);
  }, [words.length, wordsLength]);
  const onPhraseChanged = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const phrase = [...words].join(' ');
    if (!isPhraseValid(phrase)) {
      setError(t('Invalid mnemonic phrase'));
      return;
    }
    setRecoveryPhrase(phrase);
    setError('');
  }, [isPhraseValid, t, words]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    onPhraseChanged();
  }, [onPhraseChanged, words]);
  const nextButtonDisabled = !isPhraseValid(recoveryPhrase) || !!error;
  const inputFields = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const fields = [];
    for (let i = 0; i < wordsLength; i++) {
      fields.push( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
        sx: {
          width: '135px'
        },
        key: i
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.TextField, {
        size: "small",
        type: "password",
        autoComplete: "off",
        InputProps: {
          endAdornment: null
        },
        onFocus: ev => {
          ev.target.setAttribute('type', 'text');
        },
        onBlur: ev => {
          ev.target.setAttribute('type', 'password');
        },
        autoFocus: i === 0,
        placeholder: `${i + 1}.`,
        onPaste: e => {
          const pastedText = (0,_utils_splitSeedPhrase__WEBPACK_IMPORTED_MODULE_7__["default"])(e.clipboardData.getData('Text'));
          setWords([...words.slice(0, i), ...pastedText].slice(0, wordsLength));
          e.preventDefault();
        },
        onChange: e => {
          const value = e.target.value;
          const newWords = [...words];
          newWords[i] = value;
          setWords(newWords);
        },
        onKeyPress: e => {
          if (e.key === 'Enter') {
            onNext();
          }
        },
        value: words[i] || ''
      })));
    }
    return fields;
  }, [onNext, words, wordsLength]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: '432px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_3__.OnboardingStepHeader, {
    testId: "enter-recovery-phrase",
    title: t('Enter Recovery Phrase')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      flexGrow: 1,
      pt: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "body2",
    sx: {
      color: theme.palette.grey[400]
    }
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_14__.Trans, {
    i18nKey: "Access an existing wallet with your recovery phrase. You can paste your entire phrase in the first field."
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      pt: 4,
      pb: 1,
      alignSelf: 'center',
      flexFlow: 'row wrap',
      justifyContent: 'space-between',
      gap: '8px 8px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: '100%',
      justifyContent: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(_components_WordsLengthSelector__WEBPACK_IMPORTED_MODULE_6__.WordsLengthSelector, {
    wordsLength: wordsLength,
    setWordsLength: sliceWords
  })), inputFields()), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      justifyContent: 'flex-end',
      width: '100%',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    onClick: () => setWords([]),
    sx: {
      width: '73px',
      pr: 0
    },
    variant: "text",
    color: "secondary",
    disabled: !words.length
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "caption"
  }, t('Clear All'))))), /*#__PURE__*/React.createElement(_components_PageNav__WEBPACK_IMPORTED_MODULE_5__.PageNav, {
    onBack: () => {
      capture('OnboardingCancelled', {
        step: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.IMPORT_WALLET
      });
      history.goBack();
    },
    onNext: onNext,
    disableNext: nextButtonDisabled,
    expand: true,
    steps: 3,
    activeStep: 0
  }));
};

/***/ }),

/***/ "./src/pages/Onboarding/pages/Keystone/Keystone.tsx":
/*!**********************************************************!*\
  !*** ./src/pages/Onboarding/pages/Keystone/Keystone.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Keystone": () => (/* binding */ Keystone)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/OnboardingStepHeader */ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _components_PageNav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/PageNav */ "./src/pages/Onboarding/components/PageNav.tsx");
/* harmony import */ var _src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _KeystoneQRCodeScanner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./KeystoneQRCodeScanner */ "./src/pages/Onboarding/pages/Keystone/KeystoneQRCodeScanner.tsx");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getAddressFromXPub.js");
/* harmony import */ var _src_hooks_useGetAvaxBalance__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/hooks/useGetAvaxBalance */ "./src/hooks/useGetAvaxBalance.ts");
/* harmony import */ var _components_DerivedAddresses__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/DerivedAddresses */ "./src/pages/Onboarding/components/DerivedAddresses.tsx");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _avalabs_types__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @avalabs/types */ "./node_modules/@avalabs/types/esm/coreAccounts.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


















const KeystoneStepImage = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack)`
  position: relative;
  img {
    width: 167px;
    z-index: 1;
  }
`;
const KeystoneImageBackground = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack)`
  position: absolute;
  width: 242px;
  height: 318px;
  left: 50px;
  top: 0px;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.2)
  );
  filter: blur(77px);
  transform: rotate(-112deg);
  z-index: 0;
`;
const tutorialLastStep = 2; // there are 3 steps to get through the tutorial (the images basically)

const Keystone = () => {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const {
    setMasterFingerprint,
    setXpub,
    setOnboardingPhase,
    setOnboardingWalletType
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_9__.useOnboardingContext)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_15__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__["default"])();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_17__.useHistory)();
  const [stepNumber, setStepNumber] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [xPubKey, setXPubKey] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [isQRCodeScanOpen, setIsQRCodeScanOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [addresses, setAddresses] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const {
    getAvaxBalance
  } = (0,_src_hooks_useGetAvaxBalance__WEBPACK_IMPORTED_MODULE_7__.useGetAvaxBalance)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_5__.useFeatureFlagContext)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setOnboardingPhase(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_11__.OnboardingPhase.KEYSTONE);
    setOnboardingWalletType(_avalabs_types__WEBPACK_IMPORTED_MODULE_18__.WalletType.Keystone);
    if (!stepNumber) {
      capture(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_11__.ONBOARDING_EVENT_NAMES.keystone);
    } else {
      capture(`KeystoneTutorialStep${stepNumber}`);
    }
  }, [capture, setOnboardingPhase, setOnboardingWalletType, stepNumber]);
  const getAddressFromXpubKey = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (xpub, accountIndex, addressList = []) => {
    const address = (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_19__.getAddressFromXPub)(xpub, accountIndex);
    const {
      balance
    } = await getAvaxBalance(address);
    const newAddresses = [...addressList, {
      address,
      balance: balance.balanceDisplayValue || '0'
    }];
    setAddresses(newAddresses);
    if (accountIndex < 2) {
      await getAddressFromXpubKey(xpub, accountIndex + 1, newAddresses);
    }
    if (accountIndex >= 2) {
      capture('OnboardingKeystoneHasAddresses');
    }
  }, [capture, getAvaxBalance]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (xPubKey && !addresses.length) {
      getAddressFromXpubKey(xPubKey, 0);
    }
  }, [addresses.length, getAddressFromXpubKey, xPubKey]);
  const steps = 3;
  const headerTitles = [t('Connect Software Wallet'), t('Connect Network'), t('Scan QR Code'), t('Confirm Derived Addresses')];
  const headerDescriptions = [t('Tap “Connect Software Wallet” at the bottom left corner.'), t('Select the Core wallet.'), t('Click on the “Scan” button at the bottom to scan the QR code displayed on the Keystone device.'), t('These are the addresses derived from your Keystone device')];
  const nextButtonLabels = [t('Next'), t('Next'), t('Scan QR Code')];
  function xpubChangeHandler(newValue) {
    setXPubKey(newValue);
    setXpub(newValue);
  }
  if (!featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_10__.FeatureGates.KEYSTONE]) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, {
      sx: {
        width: '100%',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_1__.OnboardingStepHeader, {
      title: headerTitles[stepNumber]
    }), /*#__PURE__*/React.createElement(_src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_4__.FunctionIsOffline, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_12__.FunctionNames.KEYSTONE,
      hidePageTitle: true
    }));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, {
    sx: {
      width: '460px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_1__.OnboardingStepHeader, {
    testId: "keystone-tutorial-step-1",
    title: headerTitles[stepNumber]
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, {
    sx: {
      flexGrow: 1,
      pt: 1,
      px: 6,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Typography, {
    variant: "body2",
    minHeight: 40
  }, headerDescriptions[stepNumber]), stepNumber <= tutorialLastStep && /*#__PURE__*/React.createElement(KeystoneStepImage, {
    sx: {
      pt: 5,
      width: theme.spacing(44),
      alignSelf: 'center',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `/images/keystone/keystone_onboarding_step_${stepNumber + 1}.png`
  }), /*#__PURE__*/React.createElement(KeystoneImageBackground, null)), stepNumber === tutorialLastStep + 1 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, {
    sx: {
      alignItems: 'center',
      mt: 3
    }
  }, /*#__PURE__*/React.createElement(_components_DerivedAddresses__WEBPACK_IMPORTED_MODULE_8__.DerivedAddresses, {
    addresses: addresses
  }))), /*#__PURE__*/React.createElement(_components_PageNav__WEBPACK_IMPORTED_MODULE_3__.PageNav, {
    onBack: () => {
      if (!stepNumber) {
        capture('OnboardingCancelled', {
          step: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_11__.OnboardingPhase.KEYSTONE_TUTORIAL
        });
        history.goBack();
        return;
      }
      setStepNumber(stepNumber - 1);
    },
    onNext: () => {
      if (stepNumber === tutorialLastStep + 1) {
        history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_11__.OnboardingURLs.CREATE_PASSWORD);
      }
      if (stepNumber === tutorialLastStep) {
        setIsQRCodeScanOpen(true);
      }
      if (stepNumber + 1 === steps) {
        return;
      }
      setStepNumber(stepNumber + 1);
    },
    disableNext: false,
    expand: true,
    steps: 6,
    activeStep: stepNumber,
    nextText: nextButtonLabels[stepNumber]
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Button, {
    variant: "text",
    onClick: () => {
      window.open(_KeystoneQRCodeScanner__WEBPACK_IMPORTED_MODULE_6__.KEYSTONE_CONNECT_SUPPORT_URL, '_blank', 'noreferrer');
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.ExternalLinkIcon, {
    size: 16,
    sx: {
      color: 'secondary.main',
      marginRight: 1
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Typography, {
    variant: "caption",
    sx: {
      color: 'secondary.main',
      fontWeight: 600
    }
  }, t('Keystone Support')))), isQRCodeScanOpen && /*#__PURE__*/React.createElement(_KeystoneQRCodeScanner__WEBPACK_IMPORTED_MODULE_6__.KeystoneQRCodeScanner, {
    onCancel: () => setIsQRCodeScanOpen(false),
    setXPubKey: xpubChangeHandler,
    setMasterFingerPrint: setMasterFingerprint,
    onSuccess: () => {
      setIsQRCodeScanOpen(false);
      setStepNumber(stepNumber + 1);
      getAddressFromXpubKey(xPubKey, 0);
    }
  })));
};

/***/ }),

/***/ "./src/pages/Onboarding/pages/Keystone/KeystoneQRCodeScanner.tsx":
/*!***********************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Keystone/KeystoneQRCodeScanner.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KEYSTONE_CONNECT_SUPPORT_URL": () => (/* binding */ KEYSTONE_CONNECT_SUPPORT_URL),
/* harmony export */   "KeystoneQRCodeScanner": () => (/* binding */ KeystoneQRCodeScanner)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _keystonehq_bc_ur_registry_eth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @keystonehq/bc-ur-registry-eth */ "./node_modules/@keystonehq/bc-ur-registry-eth/dist/index.js");
/* harmony import */ var _keystonehq_bc_ur_registry_eth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_keystonehq_bc_ur_registry_eth__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_hooks_useKeystoneScannerContents__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useKeystoneScannerContents */ "./src/hooks/useKeystoneScannerContents.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js")["Buffer"];
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







const KEYSTONE_CONNECT_SUPPORT_URL = 'https://support.keyst.one/getting-started/new-how-to-sync-keystone-with-compatible-software-wallets';
const promptAccess = setCameraPermission => {
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(() => {
    setCameraPermission('granted');
  }).catch(() => {
    setCameraPermission('denied');
  });
};
const KeystoneQRCodeScanner = ({
  onCancel,
  setXPubKey,
  setMasterFingerPrint,
  onSuccess
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const {
    palette
  } = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__.useAnalyticsContext)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const [cameraPermission, setCameraPermission] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [hasError, setHasError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const attempts = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  const handleScan = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({
    cbor
  }) => {
    attempts.current = [];
    const buffer = Buffer.from(cbor, 'hex');
    const cryptoMultiAccounts = _keystonehq_bc_ur_registry_eth__WEBPACK_IMPORTED_MODULE_2__.CryptoMultiAccounts.fromCBOR(buffer);
    const masterFingerprint = cryptoMultiAccounts.getMasterFingerprint();
    setMasterFingerPrint(masterFingerprint.toString('hex'));
    const keys = cryptoMultiAccounts.getKeys();
    const key = keys[0];
    if (key) {
      const xpub = key.getBip32Key();
      setXPubKey(xpub);
      capture(`KeystoneScanQRCodeSuccess`);
      onSuccess();
    }
  }, [capture, onSuccess, setMasterFingerPrint, setXPubKey]);
  const handleError = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(error => {
    if (!/^Dimensions/i.test(error)) {
      capture(`KeystoneScanQRCodeError`);
      setHasError(true);
      return;
    }
    attempts.current.push(Date.now());
    if (attempts.current.length === 5) {
      if (attempts.current[4] && attempts.current[0] && attempts.current[4] - attempts.current[0] < 500) {
        capture(`KeystoneScanQRCodeDimensionsError`);
        setHasError(true);
        return;
      }
      attempts.current = [];
    }
  }, [capture]);
  const pageContent = (0,_src_hooks_useKeystoneScannerContents__WEBPACK_IMPORTED_MODULE_3__.useKeystoneScannerContents)({
    cameraPermission,
    hasError,
    setHasError,
    handleScan,
    handleError
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    promptAccess(setCameraPermission);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    async function getPermissions() {
      const permission = await navigator.permissions.query({
        name: 'camera' // workaround to avoid the ts error
      });

      permission.onchange = () => {
        promptAccess(setCameraPermission);
        if (permission.state === 'denied') {
          capture(`KeystoneScanQRCameraAccessDenied`);
        }
      };
    }
    getPermissions();
  }, [capture]);
  return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_1__.Overlay, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '512px',
      minHeight: '495px',
      background: palette.background.paper,
      borderRadius: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      pt: 2,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "h4",
    sx: {
      pt: 3,
      px: 4
    },
    "data-testid": `keystone-modal-header`
  }, pageContent?.headLine), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    variant: "text",
    "data-testid": `keystone-modal-close-button`,
    onClick: onCancel,
    sx: {
      p: 0,
      height: theme.spacing(3),
      width: theme.spacing(3),
      minWidth: theme.spacing(3)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.XIcon, {
    size: 24,
    sx: {
      color: 'primary.main'
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexGrow: 1,
      pt: 1,
      px: 6
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    minHeight: 40
  }, pageContent?.description), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'center',
      flexGrow: 1
    }
  }, pageContent?.content)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '100%',
      justifyItems: 'space-between',
      alignContent: 'center',
      mb: 3,
      rowGap: 2,
      pt: 1,
      px: 6
    }
  }, pageContent?.helperText, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    variant: "text",
    onClick: () => {
      window.open(KEYSTONE_CONNECT_SUPPORT_URL, '_blank', 'noreferrer');
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.ExternalLinkIcon, {
    size: 16,
    sx: {
      color: 'secondary.main',
      marginRight: 1
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: 'secondary.main',
      fontWeight: 600
    }
  }, t('Keystone Support'))))));
};

/***/ }),

/***/ "./src/pages/Onboarding/pages/Ledger/LedgerConnect.tsx":
/*!*************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Ledger/LedgerConnect.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerConnect": () => (/* binding */ LedgerConnect),
/* harmony export */   "LedgerStatus": () => (/* binding */ LedgerStatus),
/* harmony export */   "WAIT_1500_MILLI_FOR_USER": () => (/* binding */ WAIT_1500_MILLI_FOR_USER)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/OnboardingStepHeader */ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _Ledger_LedgerWrongVersionOverlay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../Ledger/LedgerWrongVersionOverlay */ "./src/pages/Ledger/LedgerWrongVersionOverlay.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _components_PageNav__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/PageNav */ "./src/pages/Onboarding/components/PageNav.tsx");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_components_ledger_LedgerConnector__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/ledger/LedgerConnector */ "./src/components/ledger/LedgerConnector.tsx");
/* harmony import */ var _avalabs_types__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/types */ "./node_modules/@avalabs/types/esm/coreAccounts.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");












let LedgerStatus = /*#__PURE__*/function (LedgerStatus) {
  LedgerStatus["LEDGER_UNINITIATED"] = "uninitiated";
  LedgerStatus["LEDGER_LOADING"] = "loading";
  LedgerStatus["LEDGER_CONNECTED"] = "connected";
  LedgerStatus["LEDGER_CONNECTION_FAILED"] = "failed";
  return LedgerStatus;
}({});

/**
 * Waiting this amount of time otherwise this screen would be a blip and the user wouldnt even know it happened
 */
const WAIT_1500_MILLI_FOR_USER = 1500;
function LedgerConnect() {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const {
    setXpub,
    setXpubXP,
    setPublicKeys,
    setOnboardingPhase,
    setOnboardingWalletType,
    setNumberOfAccountsToCreate
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_3__.useOnboardingContext)();
  const [hasPublicKeys, setHasPublicKeys] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_9__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useHistory)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setOnboardingPhase(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.OnboardingPhase.LEDGER);
    setOnboardingWalletType(_avalabs_types__WEBPACK_IMPORTED_MODULE_11__.WalletType.Ledger);
    capture(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.ONBOARDING_EVENT_NAMES.ledger);
  }, [capture, setOnboardingPhase, setOnboardingWalletType]);
  function onSuccess(data) {
    setXpub(data.xpub);
    setXpubXP(data.xpubXP);
    setPublicKeys(data.publicKeys);
    setHasPublicKeys(data.hasPublicKeys);
    setNumberOfAccountsToCreate(data.lastAccountIndexWithBalance + 1);
  }
  const Content = /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_12__.Trans, {
    i18nKey: "<typography>This process retrieves the addresses<br />from your ledger</typography>",
    components: {
      typography: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
        variant: "caption"
      })
    }
  });
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_1__.OnboardingStepHeader, {
    testId: "connect-ledger",
    title: t('Connect your Ledger')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      flexGrow: 1,
      pt: 1,
      px: 6
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "body2"
  }, t('Select a derivation path to see your derived addresses.'), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Tooltip, {
    title: Content,
    sx: {
      display: 'inline',
      cursor: 'pointer',
      pl: theme.spacing(1),
      verticalAlign: 'middle'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.InfoCircleIcon, {
    size: 14
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      mt: 7.5
    }
  }, /*#__PURE__*/React.createElement(_src_components_ledger_LedgerConnector__WEBPACK_IMPORTED_MODULE_7__.LedgerConnector, {
    onSuccess: onSuccess,
    onTroubleshoot: () => history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.OnboardingURLs.LEDGER_TROUBLE)
  }))), /*#__PURE__*/React.createElement(_components_PageNav__WEBPACK_IMPORTED_MODULE_5__.PageNav, {
    onBack: () => {
      capture('OnboardingCancelled', {
        step: _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.OnboardingPhase.LEDGER
      });
      history.goBack();
    },
    onNext: () => history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.OnboardingURLs.CREATE_PASSWORD),
    disableNext: !hasPublicKeys,
    expand: true,
    steps: 3,
    activeStep: 0
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    variant: "text",
    onClick: () => {
      window.open('https://www.ledger.com/ledger-live', '_blank', 'noreferrer');
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.ExternalLinkIcon, {
    size: 16,
    sx: {
      color: 'secondary.main'
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "caption",
    sx: {
      ml: 1,
      color: 'secondary.main'
    }
  }, t('Ledger Live Support')))), /*#__PURE__*/React.createElement(_Ledger_LedgerWrongVersionOverlay__WEBPACK_IMPORTED_MODULE_4__.LedgerWrongVersionOverlay, {
    onClose: () => history.goBack()
  }));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Ledger/LedgerTrouble.tsx":
/*!*************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Ledger/LedgerTrouble.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerTrouble": () => (/* binding */ LedgerTrouble)
/* harmony export */ });
/* harmony import */ var _components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/OnboardingStepHeader */ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _src_hooks_useLanguages__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useLanguages */ "./src/hooks/useLanguages.ts");
/* harmony import */ var _components_TypographyLink__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/TypographyLink */ "./src/pages/Onboarding/components/TypographyLink.tsx");
/* harmony import */ var _components_ledger_LedgerTroublesSteps__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../components/ledger/LedgerTroublesSteps */ "./src/components/ledger/LedgerTroublesSteps.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function LedgerTrouble() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useHistory)();
  const {
    currentLanguage
  } = (0,_src_hooks_useLanguages__WEBPACK_IMPORTED_MODULE_2__.useLanguage)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      width: '390px',
      height: '100%',
      mt: 4
    }
  }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_0__.OnboardingStepHeader, {
    testId: "ledger-trouble",
    title: t('Trouble Connecting')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexGrow: 1,
      pt: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    variant: "body2",
    sx: {
      mt: 1
    }
  }, t("We're having trouble connecting to your device."))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      alignItems: 'center',
      mt: 4,
      mb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.RemoteIcon, {
    size: 88
  })), /*#__PURE__*/React.createElement(_components_ledger_LedgerTroublesSteps__WEBPACK_IMPORTED_MODULE_4__.LedgerTroubleSteps, {
    sx: {
      pt: 1.5
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      width: '100%',
      justifyItems: 'space-between',
      alignContent: 'center',
      mb: 9,
      rowGap: theme.spacing(2)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      columnGap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Button, {
    color: "secondary",
    "data-testid": "page-nav-back-button",
    onClick: () => {
      history.goBack();
    },
    sx: {
      width: theme.spacing(21)
    }
  }, t('Back')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Button, {
    "data-testid": "page-nav-next-button",
    onClick: () => {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_1__.OnboardingURLs.ONBOARDING_HOME);
    },
    sx: {
      width: theme.spacing(21)
    }
  }, t('Cancel'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      justifyContent: 'center',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_components_TypographyLink__WEBPACK_IMPORTED_MODULE_3__.TypographyLink, {
    as: "a",
    href: `https://support.ledger.com/hc/${currentLanguage?.code || 'en-us'}/categories/4404376139409?docs=true`,
    target: "_blank",
    rel: "noopener noreferrer",
    variant: "body2"
  }, t('Ledger Live Support')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.ExternalLinkIcon, {
    size: 16,
    sx: {
      color: 'secondary.main',
      marginLeft: 1
    }
  }))));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/RecoveryMethods.tsx":
/*!*****************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/RecoveryMethods.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RecoveryMethods": () => (/* binding */ RecoveryMethods)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/OnboardingStepHeader */ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _components_MethodCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/MethodCard */ "./src/pages/Onboarding/pages/Seedless/components/MethodCard.tsx");
/* harmony import */ var _components_PageNav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/PageNav */ "./src/pages/Onboarding/components/PageNav.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _modals_AuthenticatorModal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modals/AuthenticatorModal */ "./src/pages/Onboarding/pages/Seedless/modals/AuthenticatorModal.tsx");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var _modals_FIDOModal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modals/FIDOModal */ "./src/pages/Onboarding/pages/Seedless/modals/FIDOModal.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_components_common_InlineBold__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/components/common/InlineBold */ "./src/components/common/InlineBold.tsx");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./models */ "./src/pages/Onboarding/pages/Seedless/models.ts");
/* harmony import */ var _hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../hooks/useSeedlessActions */ "./src/pages/Onboarding/hooks/useSeedlessActions.ts");
/* harmony import */ var _avalabs_types__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/types */ "./node_modules/@avalabs/types/esm/coreAccounts.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


















function RecoveryMethods() {
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_14__.useHistory)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_15__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_10__.useAnalyticsContext)();
  const [selectedMethod, setSelectedMethod] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
  const [isModalOpen, setIsModalOpen] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_5__.useFeatureFlagContext)();
  const {
    oidcToken,
    isSeedlessMfaRequired: isSeedlessMfaRequiredForAccount,
    setOnboardingWalletType
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_8__.useOnboardingContext)();
  const {
    loginWithoutMFA
  } = (0,_hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_13__.useSeedlessActions)();
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (!oidcToken) {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_7__.OnboardingURLs.ONBOARDING_HOME);
      return;
    }
  }, [history, oidcToken, t]);
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    setOnboardingWalletType(_avalabs_types__WEBPACK_IMPORTED_MODULE_16__.WalletType.Seedless);
    if (selectedMethod) {
      setIsModalOpen(true);
    }
  }, [selectedMethod, setOnboardingWalletType]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      width: '420px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_0__.OnboardingStepHeader, {
    testId: "copy-phrase",
    title: t('Add Recovery Methods')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      flexGrow: 1,
      textAlign: 'center',
      mb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Typography, {
    variant: "body2",
    sx: {
      mb: 5
    }
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_18__.Trans, {
    i18nKey: "Add <bold>one</bold> recovery method to continue.",
    components: {
      bold: /*#__PURE__*/React.createElement(_src_components_common_InlineBold__WEBPACK_IMPORTED_MODULE_11__.InlineBold, null)
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      textAlign: 'left',
      rowGap: 1
    }
  }, featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.SEEDLESS_MFA_PASSKEY] && /*#__PURE__*/React.createElement(_components_MethodCard__WEBPACK_IMPORTED_MODULE_1__.MethodCard, {
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.KeyIcon, {
      size: 24
    }),
    title: t('Passkey'),
    description: t('Add a Passkey as a recovery method.'),
    onClick: () => setSelectedMethod(_models__WEBPACK_IMPORTED_MODULE_12__.RecoveryMethodTypes.PASSKEY)
  }), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.SEEDLESS_MFA_AUTHENTICATOR] && /*#__PURE__*/React.createElement(_components_MethodCard__WEBPACK_IMPORTED_MODULE_1__.MethodCard, {
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.QRCodeIcon, {
      size: 24
    }),
    title: t('Authenticator'),
    description: t('Use an authenticator app as a recovery method.'),
    onClick: () => setSelectedMethod(_models__WEBPACK_IMPORTED_MODULE_12__.RecoveryMethodTypes.TOTP)
  }), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.SEEDLESS_MFA_YUBIKEY] && /*#__PURE__*/React.createElement(_components_MethodCard__WEBPACK_IMPORTED_MODULE_1__.MethodCard, {
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.UsbIcon, {
      size: 24
    }),
    title: t('Yubikey'),
    description: t('Add a Yubikey as a recovery method.'),
    onClick: () => setSelectedMethod(_models__WEBPACK_IMPORTED_MODULE_12__.RecoveryMethodTypes.YUBIKEY)
  }))), /*#__PURE__*/React.createElement(_components_PageNav__WEBPACK_IMPORTED_MODULE_2__.PageNav, {
    onBack: () => {
      history.goBack();
    },
    nextText: t('Set Up Later'),
    disableNext: !featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.SEEDLESS_OPTIONAL_MFA] || isSeedlessMfaRequiredForAccount,
    nextDisabledReason: !featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.SEEDLESS_OPTIONAL_MFA] ? t('Coming soon!') : isSeedlessMfaRequiredForAccount ? t('MFA configuration is required for your account.') : undefined,
    onNext: async () => {
      await loginWithoutMFA();
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_7__.OnboardingURLs.CREATE_PASSWORD);
    },
    activeStep: 0,
    steps: 3
  })), isModalOpen && selectedMethod === _models__WEBPACK_IMPORTED_MODULE_12__.RecoveryMethodTypes.TOTP && /*#__PURE__*/React.createElement(_modals_AuthenticatorModal__WEBPACK_IMPORTED_MODULE_6__.AuthenticatorModal, {
    activeStep: _modals_AuthenticatorModal__WEBPACK_IMPORTED_MODULE_6__.AuthenticatorSteps.SCAN,
    onFinish: () => {
      capture('recoveryMethodAdded', {
        method: selectedMethod
      });
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_7__.OnboardingURLs.CREATE_PASSWORD);
    },
    onCancel: () => {
      capture(`FidoDevice${selectedMethod}Cancelled`);
      setIsModalOpen(false);
      setSelectedMethod(null);
    }
  }), isModalOpen && (selectedMethod === _models__WEBPACK_IMPORTED_MODULE_12__.RecoveryMethodTypes.YUBIKEY || selectedMethod === _models__WEBPACK_IMPORTED_MODULE_12__.RecoveryMethodTypes.PASSKEY) && /*#__PURE__*/React.createElement(_modals_FIDOModal__WEBPACK_IMPORTED_MODULE_9__.FIDOModal, {
    onFinish: () => {
      capture(`recoveryMethodAdded`, {
        method: selectedMethod
      });
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_7__.OnboardingURLs.CREATE_PASSWORD);
    },
    onCancel: () => {
      setIsModalOpen(false);
      capture(`FidoDevice${selectedMethod}Cancelled`);
      setSelectedMethod(null);
    },
    selectedMethod: selectedMethod
  }));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/RecoveryMethodsLogin.tsx":
/*!**********************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/RecoveryMethodsLogin.tsx ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RecoveryMethodsLogin": () => (/* binding */ RecoveryMethodsLogin)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/OnboardingStepHeader */ "./src/pages/Onboarding/components/OnboardingStepHeader.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _components_MethodCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/MethodCard */ "./src/pages/Onboarding/pages/Seedless/components/MethodCard.tsx");
/* harmony import */ var _components_PageNav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/PageNav */ "./src/pages/Onboarding/components/PageNav.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var _modals_TOTPModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modals/TOTPModal */ "./src/pages/Onboarding/pages/Seedless/modals/TOTPModal.tsx");
/* harmony import */ var _src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/utils/seedless/getCubeSigner */ "./src/utils/seedless/getCubeSigner.ts");
/* harmony import */ var _modals_FIDOModal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modals/FIDOModal */ "./src/pages/Onboarding/pages/Seedless/modals/FIDOModal.tsx");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./models */ "./src/pages/Onboarding/pages/Seedless/models.ts");
/* harmony import */ var _avalabs_types__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/types */ "./node_modules/@avalabs/types/esm/coreAccounts.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
















function RecoveryMethodsLogin() {
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_12__.useHistory)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_13__.useTranslation)();
  const [selectedMethod, setSelectedMethod] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
  const [isModalOpen, setIsModalOpen] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_5__.useFeatureFlagContext)();
  const {
    oidcToken,
    setOnboardingWalletType
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_7__.useOnboardingContext)();
  const [configuredMfas, setConfiguredMfas] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)([]);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (!oidcToken) {
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"].error(t('Seedless login error'));
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.OnboardingURLs.ONBOARDING_HOME);
      return;
    }
  }, [history, oidcToken, t]);
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    setOnboardingWalletType(_avalabs_types__WEBPACK_IMPORTED_MODULE_15__.WalletType.Seedless);
    setIsLoading(true);
    const getMfas = async () => {
      if (!oidcToken) {
        return false;
      }
      const oidcClient = (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_9__.getOidcClient)(oidcToken);
      const identity = await oidcClient.identityProve();
      const configuredMfa = identity.user_info?.configured_mfa;
      if (configuredMfa) {
        const mfas = configuredMfa.map(mfa => {
          if (mfa.type === 'fido') {
            return {
              name: mfa.name,
              type: mfa.type
            };
          }
          if (mfa.type === 'totp') {
            return {
              name: '',
              type: mfa.type
            };
          }
          return {
            name: '',
            type: _models__WEBPACK_IMPORTED_MODULE_11__.RecoveryMethodTypes.UNKNOWN
          };
        });
        setConfiguredMfas(mfas);
        if (mfas.length === 1 && mfas[0]) {
          setSelectedMethod(mfas[0].type);
          setIsModalOpen(true);
        }
      }
      setIsLoading(false);
    };
    getMfas();
  }, [oidcToken, setOnboardingWalletType]);
  const onFinish = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(() => {
    history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.OnboardingURLs.CREATE_PASSWORD);
  }, [history]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      width: '420px',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_components_OnboardingStepHeader__WEBPACK_IMPORTED_MODULE_0__.OnboardingStepHeader, {
    testId: "copy-phrase",
    title: t('Verify Recovery Methods')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      flexGrow: 1,
      textAlign: 'center',
      mb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
    variant: "body2",
    sx: {
      mb: 5
    }
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_17__.Trans, {
    i18nKey: "Verify your recovery method(s) to continue."
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      textAlign: 'left',
      rowGap: 1
    }
  }, isLoading && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Skeleton, {
    sx: {
      width: '100%',
      height: '80px',
      transform: 'none'
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Skeleton, {
    sx: {
      width: '100%',
      height: '80px',
      transform: 'none'
    }
  })), configuredMfas.map((mfaDevice, index) => {
    if (mfaDevice.type === 'totp' && !featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.SEEDLESS_MFA_AUTHENTICATOR]) {
      return null;
    }
    if (mfaDevice.type === 'fido' && !featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.SEEDLESS_MFA_PASSKEY] && !featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.SEEDLESS_MFA_YUBIKEY]) {
      return null;
    }
    return /*#__PURE__*/React.createElement(_components_MethodCard__WEBPACK_IMPORTED_MODULE_1__.MethodCard, {
      key: index,
      icon: mfaDevice.type === 'totp' ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.QRCodeIcon, {
        size: 24
      }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.KeyIcon, {
        size: 24
      }),
      title: mfaDevice.name ? mfaDevice.name : mfaDevice.type === 'totp' ? t('Authenticator') : t('FIDO Device'),
      description: mfaDevice.type === 'totp' ? t('Verify an authenticator app as a recovery method.') : t('Verify your FIDO device as a recovery method.'),
      onClick: () => {
        setSelectedMethod(mfaDevice.type);
        setIsModalOpen(true);
      }
    });
  }))), /*#__PURE__*/React.createElement(_components_PageNav__WEBPACK_IMPORTED_MODULE_2__.PageNav, {
    onBack: () => {
      history.goBack();
    },
    onNext: () => {
      setIsModalOpen(true);
    },
    activeStep: 0,
    steps: 3,
    disableNext: !selectedMethod
  })), isModalOpen && selectedMethod === _models__WEBPACK_IMPORTED_MODULE_11__.RecoveryMethodTypes.TOTP && /*#__PURE__*/React.createElement(_modals_TOTPModal__WEBPACK_IMPORTED_MODULE_8__.TOTPModal, {
    onFinish: () => {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.OnboardingURLs.CREATE_PASSWORD);
    },
    onCancel: () => {
      setIsModalOpen(false);
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.OnboardingURLs.ONBOARDING_HOME);
    }
  }), isModalOpen && selectedMethod === _models__WEBPACK_IMPORTED_MODULE_11__.RecoveryMethodTypes.FIDO && /*#__PURE__*/React.createElement(_modals_FIDOModal__WEBPACK_IMPORTED_MODULE_10__.FIDOModal, {
    onFinish: onFinish,
    onCancel: () => {
      setIsModalOpen(false);
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_6__.OnboardingURLs.ONBOARDING_HOME);
    },
    selectedMethod: selectedMethod,
    startingStep: _models__WEBPACK_IMPORTED_MODULE_11__.FIDOSteps.LOGIN
  }));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/components/AppleButton.tsx":
/*!************************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/components/AppleButton.tsx ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppleButton": () => (/* binding */ AppleButton)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _src_utils_seedless_authenticateWithApple__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/seedless/authenticateWithApple */ "./src/utils/seedless/authenticateWithApple.ts");
/* harmony import */ var _src_background_services_wallet_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/wallet/models */ "./src/background/services/wallet/models.ts");
/* harmony import */ var _src_pages_Onboarding_hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/pages/Onboarding/hooks/useSeedlessActions */ "./src/pages/Onboarding/hooks/useSeedlessActions.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function AppleButton({
  setIsLoading
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_0__.useAnalyticsContext)();
  const {
    setOnboardingPhase,
    setAuthProvider
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__.useOnboardingContext)();
  const {
    signIn
  } = (0,_src_pages_Onboarding_hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_5__.useSeedlessActions)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    sx: {
      width: '100%'
    },
    "data-testid": "create-wallet-apple-button",
    color: "primary",
    size: "large",
    startIcon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.AppleIcon, {
      size: 20
    }),
    onClick: () => {
      setOnboardingPhase(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.SEEDLESS_APPLE);
      capture(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.ONBOARDING_EVENT_NAMES[_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingPhase.SEEDLESS_APPLE]);
      setAuthProvider(_src_background_services_wallet_models__WEBPACK_IMPORTED_MODULE_4__.SeedlessAuthProvider.Apple);
      signIn({
        setIsLoading,
        getOidcToken: _src_utils_seedless_authenticateWithApple__WEBPACK_IMPORTED_MODULE_3__.authenticateWithApple,
        provider: _src_background_services_wallet_models__WEBPACK_IMPORTED_MODULE_4__.SeedlessAuthProvider.Apple
      });
    }
  }, t('Continue with Apple'));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/components/ExistingWalletButton.tsx":
/*!*********************************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/components/ExistingWalletButton.tsx ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExistingWalletButton": () => (/* binding */ ExistingWalletButton)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function ExistingWalletButton({
  icon,
  text,
  onClick
}) {
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Stack, {
    sx: {
      width: '225px',
      height: '180px',
      borderRadius: 2,
      backgroundColor: 'rgba(88, 88, 91, 0.75)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'grey.200',
        color: 'common.black',
        transition: 'all 300ms ease-in-out'
      },
      alignItems: 'flex-start',
      p: 2,
      rowGap: 1
    },
    onClick: () => {
      onClick();
    }
  }, icon, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
    variant: "h6",
    sx: {
      width: '130px',
      textAlign: 'start',
      fontWeight: 'fontWeightSemibolds'
    }
  }, text));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/components/ExistingWalletOptions.tsx":
/*!**********************************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/components/ExistingWalletOptions.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExistingWalletOptions": () => (/* binding */ ExistingWalletOptions)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var _ExistingWalletButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ExistingWalletButton */ "./src/pages/Onboarding/pages/Seedless/components/ExistingWalletButton.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");









const ExistingWalletOptions = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function ExistingWalletOptions({
  setShowExistingWalletOption
}, ref) {
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_6__.useHistory)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_1__.useFeatureFlagContext)();
  return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_4__.Overlay, {
    sx: {
      backgroundColor: 'rgba(17, 17, 17, 0.75)'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    ref: ref,
    sx: {
      width: 480,
      alignItems: 'flex-start',
      rowGap: 5,
      position: 'fixed',
      top: 90
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.ArrowLeftIconV2, {
    sx: {
      cursor: 'pointer',
      width: 19,
      height: 14
    },
    onClick: () => {
      setShowExistingWalletOption(false);
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    variant: "h3",
    sx: {
      textAlign: 'left'
    }
  }, t('How would you like to access your existing wallet?')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 3,
      pb: 3
    }
  }, /*#__PURE__*/React.createElement(_ExistingWalletButton__WEBPACK_IMPORTED_MODULE_5__.ExistingWalletButton, {
    "data-testid": "access-with-seed-phrase",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.ShieldLockIcon, {
      size: 30
    }),
    text: t('Enter recovery phrase'),
    onClick: () => {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.SEED_PHRASE);
    }
  }), /*#__PURE__*/React.createElement(_ExistingWalletButton__WEBPACK_IMPORTED_MODULE_5__.ExistingWalletButton, {
    "data-testid": "access-with-ledger",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.LedgerIcon, {
      size: 30
    }),
    text: t('Add using Ledger'),
    onClick: () => {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.LEDGER);
    }
  })), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_2__.FeatureGates.KEYSTONE] && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_ExistingWalletButton__WEBPACK_IMPORTED_MODULE_5__.ExistingWalletButton, {
    "data-testid": "access-with-seed-keystone",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.KeystoneIcon, {
      size: 30
    }),
    text: t('Add using Keystone'),
    onClick: () => {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_3__.OnboardingURLs.KEYSTONE);
    }
  })))));
});

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/components/GoogleButton.tsx":
/*!*************************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/components/GoogleButton.tsx ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GoogleButton": () => (/* binding */ GoogleButton)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_pages_Onboarding_hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/pages/Onboarding/hooks/useSeedlessActions */ "./src/pages/Onboarding/hooks/useSeedlessActions.ts");
/* harmony import */ var _src_background_services_wallet_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/wallet/models */ "./src/background/services/wallet/models.ts");
/* harmony import */ var _src_utils_seedless_authenticateWithGoogle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/seedless/authenticateWithGoogle */ "./src/utils/seedless/authenticateWithGoogle.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function GoogleButton({
  setIsLoading
}) {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const {
    setOnboardingPhase,
    setAuthProvider
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__.useOnboardingContext)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    signIn
  } = (0,_src_pages_Onboarding_hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_3__.useSeedlessActions)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    sx: {
      width: '100%'
    },
    "data-testid": "create-wallet-google-button",
    color: "primary",
    size: "large",
    startIcon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.GoogleColorIcon, {
      size: 20
    }),
    onClick: () => {
      setOnboardingPhase(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_0__.OnboardingPhase.SEEDLESS_GOOGLE);
      capture(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_0__.ONBOARDING_EVENT_NAMES.seedless_google);
      setAuthProvider(_src_background_services_wallet_models__WEBPACK_IMPORTED_MODULE_4__.SeedlessAuthProvider.Google);
      signIn({
        setIsLoading,
        getOidcToken: _src_utils_seedless_authenticateWithGoogle__WEBPACK_IMPORTED_MODULE_5__.authenticateWithGoogle,
        provider: _src_background_services_wallet_models__WEBPACK_IMPORTED_MODULE_4__.SeedlessAuthProvider.Google
      });
    }
  }, t('Continue with Google'));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/components/MethodCard.tsx":
/*!***********************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/components/MethodCard.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MethodCard": () => (/* binding */ MethodCard)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_InlineBold__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/InlineBold */ "./src/components/common/InlineBold.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function MethodCard({
  icon,
  title,
  description,
  onClick
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Card, {
    "data-testid": `method-card-${title}`,
    onClick: onClick,
    sx: {
      backgroundColor: theme.palette.background.paper
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.CardActionArea, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      color: theme.palette.text.primary
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 2
    }
  }, icon, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h6",
    sx: {
      mb: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_InlineBold__WEBPACK_IMPORTED_MODULE_0__.InlineBold, null, title)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    sx: {
      color: theme.palette.text.secondary
    }
  }, description))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.ChevronRightIcon, {
    size: 24
  }))));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/modals/AuthenticatorModal.tsx":
/*!***************************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/modals/AuthenticatorModal.tsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthenticatorModal": () => (/* binding */ AuthenticatorModal),
/* harmony export */   "AuthenticatorSteps": () => (/* binding */ AuthenticatorSteps)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var _src_pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/pages/Onboarding/components/TypographyLink */ "./src/pages/Onboarding/components/TypographyLink.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! qrcode.react */ "./node_modules/qrcode.react/lib/index.js");
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(qrcode_react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _src_pages_Onboarding_hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/pages/Onboarding/hooks/useSeedlessActions */ "./src/pages/Onboarding/hooks/useSeedlessActions.ts");
/* harmony import */ var _src_components_common_InlineBold__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/InlineBold */ "./src/components/common/InlineBold.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");









let AuthenticatorSteps = /*#__PURE__*/function (AuthenticatorSteps) {
  AuthenticatorSteps["SCAN"] = "scan";
  AuthenticatorSteps["KEY"] = "key";
  AuthenticatorSteps["VERIFY"] = "verify";
  AuthenticatorSteps["HELP"] = "help";
  return AuthenticatorSteps;
}({});
function AuthenticatorModal({
  activeStep,
  onFinish,
  onCancel
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__.useAnalyticsContext)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const [step, setStep] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(activeStep);
  const {
    registerTOTPStart,
    totpChallenge,
    verifyRegistrationCode
  } = (0,_src_pages_Onboarding_hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_4__.useSeedlessActions)();
  const [totpCode, setTotpCode] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [isCodeVerifying, setIsCodeVerifying] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const totpSecret = totpChallenge ? new URL(totpChallenge.totpUrl).searchParams.get('secret') : '';
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    registerTOTPStart();
  }, [registerTOTPStart]);
  const onCopy = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
    navigator.clipboard.writeText(totpSecret || '');
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__["default"].success(t('Copied!'), {
      duration: 2000,
      position: 'top-left'
    });
  }, [t, totpSecret]);
  const headLines = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    scan: t('Scan Qr Code'),
    verify: t('Verify Code'),
    key: t('Authenticator Setup'),
    help: t('Learn More')
  }), [t]);
  const verifyCode = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    setIsCodeVerifying(true);
    const isSuccessful = await verifyRegistrationCode(totpCode);
    if (!isSuccessful) {
      capture('SeedlessAuthenticatorVerificationFailed');
      setError(t('Incorrect code. Try again.'));
    }
    if (isSuccessful) {
      capture('SeedlessAuthenticatorVerificationSuccess');
      onFinish();
      setError('');
    }
    setIsCodeVerifying(false);
  }, [capture, onFinish, t, totpCode, verifyRegistrationCode]);
  const descriptions = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    scan: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, null, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_11__.Trans, {
      i18nKey: "On your mobile device, install an <bold>authenticator app</bold> and use it to scan this QR code. Or enter the code manually.",
      components: {
        bold: /*#__PURE__*/React.createElement(_src_components_common_InlineBold__WEBPACK_IMPORTED_MODULE_5__.InlineBold, null)
      }
    })), /*#__PURE__*/React.createElement(_src_pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__.TypographyLink, {
      onClick: () => setStep(AuthenticatorSteps.HELP)
    }, t('Learn more'))),
    verify: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, null, t('Enter the code generated from your authenticator app.')),
    key: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, null, t('Open any authenticator app and use it to enter the key found below. Or tap Scan QR Code.')), /*#__PURE__*/React.createElement(_src_pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__.TypographyLink, {
      onClick: () => setStep(AuthenticatorSteps.HELP)
    }, t('Learn more'))),
    help: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, null, t('Use any authenticator app and paste in the code found below.'))
  }), [t]);
  const contents = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    scan: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      sx: {
        p: 3
      }
    }, totpChallenge ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      sx: {
        p: 1,
        backgroundColor: theme.palette.common.white,
        borderRadius: 1
      }
    }, /*#__PURE__*/React.createElement((qrcode_react__WEBPACK_IMPORTED_MODULE_3___default()), {
      renderAs: "svg",
      fgColor: theme.palette.common.black,
      bgColor: theme.palette.common.white,
      value: totpChallenge.totpUrl,
      level: "H",
      size: 180
    })) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.CircularProgress, null)),
    verify: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      sx: {
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.TextField, {
      inputProps: {
        style: {
          width: '100%'
        }
      },
      type: "tel",
      onChange: event => setTotpCode(event.target.value),
      rows: 3,
      multiline: true,
      error: !!error,
      helperText: error,
      onKeyDown: async event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          await verifyCode();
        }
      }
    })),
    key: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      onClick: onCopy,
      sx: {
        backgroundColor: theme.palette.grey[850],
        flexDirection: 'row',
        columnGap: 2,
        p: 2,
        width: '358px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      sx: {
        rowGap: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.CopyIcon, {
      size: 24
    })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      sx: {
        wordBreak: 'break-all'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, {
      variant: "button",
      sx: {
        fontSize: theme.typography.subtitle2.fontSize
      }
    }, t('Copy Key')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, {
      variant: "button",
      sx: {
        fontSize: theme.typography.h5.fontSize
      }
    }, totpSecret))),
    help: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      sx: {
        width: '358px'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      onClick: onCopy,
      sx: {
        backgroundColor: theme.palette.grey[850],
        flexDirection: 'row',
        columnGap: 2,
        p: 2,
        cursor: 'pointer',
        mb: 2
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      sx: {
        rowGap: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.CopyIcon, {
      size: 24
    })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      sx: {
        rowGap: 0.5,
        wordBreak: 'break-all'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, {
      variant: "button",
      sx: {
        fontSize: theme.typography.subtitle2.fontSize
      }
    }, t('Copy Key')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, {
      variant: "button",
      sx: {
        fontSize: theme.typography.h5.fontSize
      }
    }, totpSecret))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, null, t('If using Google Authenticator, make sure that Time based is selected.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, null, t('If using Microsoft Authenticator, click Add Account.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, null, t('If using Authenticator App, click the + to add account.')))
  }), [error, onCopy, t, theme.palette.common.black, theme.palette.common.white, theme.palette.grey, theme.typography.h5.fontSize, theme.typography.subtitle2.fontSize, totpChallenge, totpSecret, verifyCode]);
  const actionButtons = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    scan: /*#__PURE__*/React.createElement(_src_pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__.TypographyLink, {
      onClick: () => {
        setStep(AuthenticatorSteps.KEY);
      }
    }, t('Enter Code Manually')),
    verify: null,
    key: /*#__PURE__*/React.createElement(_src_pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__.TypographyLink, {
      onClick: () => {
        setStep(AuthenticatorSteps.SCAN);
      }
    }, t('Scan QR Code')),
    help: /*#__PURE__*/React.createElement(_src_pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__.TypographyLink, {
      onClick: () => setStep(AuthenticatorSteps.SCAN)
    }, t('Back'))
  }), [t]);
  const nextStepAction = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    scan: () => setStep(AuthenticatorSteps.VERIFY),
    help: () => setStep(AuthenticatorSteps.VERIFY),
    code: () => setStep(AuthenticatorSteps.VERIFY),
    verify: () => verifyCode()
  }), [verifyCode]);
  return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__.Overlay, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      width: '512px',
      minHeight: '407px',
      background: theme.palette.background.paper,
      borderRadius: 1,
      p: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, {
    variant: "h4",
    sx: {
      pt: 3,
      px: 4
    },
    "data-testid": `authenticator-modal-header`
  }, headLines[step]), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    variant: "text",
    "data-testid": `authenticator-modal-close-button`,
    onClick: onCancel,
    sx: {
      p: 0,
      height: theme.spacing(3),
      width: theme.spacing(3),
      minWidth: theme.spacing(3)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.XIcon, {
    size: 24,
    sx: {
      color: 'primary.main'
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      flexGrow: 1,
      pt: 1,
      px: 4
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, {
    variant: "body2",
    minHeight: 40
  }, descriptions[step]), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      alignItems: 'center',
      height: '100%',
      justifyContent: step !== AuthenticatorSteps.VERIFY ? 'center' : 'flex-start',
      flexGrow: 1
    }
  }, contents[step])), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, null, /*#__PURE__*/React.createElement(_src_pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__.TypographyLink, null, actionButtons[step])), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    color: "secondary",
    "data-testid": "authenticator-modal-cancel",
    onClick: onCancel,
    isDisabled: isCodeVerifying
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    "data-testid": "authenticator-modal-next",
    onClick: nextStepAction[step],
    isLoading: isCodeVerifying,
    isDisabled: isCodeVerifying
  }, t('Next'))))));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/modals/FIDOModal.tsx":
/*!******************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/modals/FIDOModal.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FIDOModal": () => (/* binding */ FIDOModal)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var _src_pages_Onboarding_hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/pages/Onboarding/hooks/useSeedlessActions */ "./src/pages/Onboarding/hooks/useSeedlessActions.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models */ "./src/pages/Onboarding/pages/Seedless/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function FIDOModal({
  onFinish,
  onCancel,
  selectedMethod,
  startingStep
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    addFIDODevice,
    loginWithFIDO
  } = (0,_src_pages_Onboarding_hooks_useSeedlessActions__WEBPACK_IMPORTED_MODULE_1__.useSeedlessActions)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const [FIDODeviceName, setFIDODeviceName] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const [step, setStep] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(startingStep || _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.NAMING);
  const [isLoginSuccessful, setIsLoginSuccessful] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const isButtonsDisabled = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (step === _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.LOGIN || step === _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.REGISTER) {
      return true;
    }
    return false;
  }, [step]);
  const login = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    setStep(_models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.LOGIN);
    try {
      const isSuccessful = await loginWithFIDO();
      if (isSuccessful) {
        capture(`FidoDevice${selectedMethod}LoginSuccess`);
        setIsLoginSuccessful(isSuccessful);
        onFinish();
      }
    } catch (_err) {
      setStep(_models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.ERROR);
      capture(`FidoDevice${selectedMethod}LoginError`);
    }
    return;
  }, [capture, loginWithFIDO, onFinish, selectedMethod]);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (startingStep === _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.LOGIN && !isLoginSuccessful) {
      login();
    }
  }, [isLoginSuccessful, login, startingStep]);
  const addDevice = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async name => {
    setStep(_models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.REGISTER);
    try {
      const deviceName = name || `${selectedMethod}-1`;
      const isFidoRegisterSuccessful = await addFIDODevice(deviceName, selectedMethod);
      if (!isFidoRegisterSuccessful) {
        throw new Error('Something went wrong with the device registration.');
      }
      setStep(_models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.LOGIN);
      const isFidoLoginSuccessful = await loginWithFIDO();
      if (isFidoLoginSuccessful) {
        capture(`FidoDevice${selectedMethod}Added`);
        onFinish();
      }
    } catch (_err) {
      setStep(_models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.ERROR);
      capture(`FidoDevice${selectedMethod}AddError`);
    }
  }, [addFIDODevice, capture, loginWithFIDO, onFinish, selectedMethod]);
  const headLines = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    naming: t('Name Your {{device}}', {
      device: selectedMethod
    }),
    register: t('{{device}} Setup', {
      device: selectedMethod
    }),
    login: t('{{device}} Login', {
      device: selectedMethod
    }),
    error: t('Couldn’t Connect')
  }), [selectedMethod, t]);
  const descriptions = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    naming: t('Add a {{device}} name, so that it’s easier to find later.', {
      device: selectedMethod
    }),
    register: t('You will see instructions in your browser window for adding your key to your account.'),
    login: t('You will see instructions in your browser window for logging in with your key.'),
    error: t('The operation either timed out or was not allowed.')
  }), [selectedMethod, t]);
  const contents = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    naming: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
      sx: {
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.TextField, {
      inputProps: {
        style: {
          width: '100%'
        }
      },
      type: "tel",
      onChange: event => {
        setFIDODeviceName(event.target.value);
      },
      placeholder: t('Enter {{device}} name', {
        device: selectedMethod
      })
    })),
    register: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
      sx: {
        width: '100%',
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.CircularProgress, {
      size: 56
    })),
    login: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
      sx: {
        width: '100%',
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.CircularProgress, {
      size: 56
    })),
    error: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
      sx: {
        width: '100%',
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.AlertCircleIcon, {
      size: 56
    }))
  }), [selectedMethod, t]);
  return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__.Overlay, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '512px',
      minHeight: '407px',
      background: theme.palette.background.paper,
      borderRadius: 1,
      p: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "h4",
    sx: {
      pt: 3,
      px: 4,
      textTransform: 'capitalize'
    },
    "data-testid": `fido-modal-header`
  }, headLines[step]), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    variant: "text",
    "data-testid": `fido-modal-close-button`,
    onClick: onCancel,
    sx: {
      p: 0,
      height: theme.spacing(3),
      width: theme.spacing(3),
      minWidth: theme.spacing(3)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.XIcon, {
    size: 24,
    sx: {
      color: 'primary.main'
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexGrow: 1,
      pt: 1,
      px: 4
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    minHeight: 40
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    sx: {
      color: 'text.secondary'
    }
  }, descriptions[step])), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      height: '100%',
      flexGrow: 1
    }
  }, contents[step])), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: step !== _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.ERROR ? 'space-between' : 'flex-end',
      alignItems: 'center',
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, step !== _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.ERROR && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    variant: "text",
    disabled: step === _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.REGISTER,
    onClick: async () => {
      await addDevice();
    },
    sx: {
      color: step === _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.LOGIN ? 'text.secondary' : 'secondary.main'
    },
    "data-testid": "fido-modal-naming-skip"
  }, t('Skip'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    color: "secondary",
    "data-testid": "fido-modal-cancel",
    disabled: isButtonsDisabled,
    onClick: () => {
      capture(`FidoDevice${selectedMethod}Cancelled`);
      onCancel();
    }
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    isLoading: isButtonsDisabled,
    disabled: isButtonsDisabled,
    "data-testid": "fido-modal-advance",
    onClick: async () => {
      if (startingStep === _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.LOGIN) {
        await login();
        return;
      }
      await addDevice(FIDODeviceName);
    }
  }, step !== _models__WEBPACK_IMPORTED_MODULE_4__.FIDOSteps.ERROR ? t('Next') : t('Try Again'))))));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/modals/TOTPModal.tsx":
/*!******************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/modals/TOTPModal.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TOTPModal": () => (/* binding */ TOTPModal)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var _src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useSeedlessAuth */ "./src/hooks/useSeedlessAuth.ts");
/* harmony import */ var _src_hooks_useTotpErrorMessage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useTotpErrorMessage */ "./src/hooks/useTotpErrorMessage.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function TOTPModal({
  onFinish,
  onCancel
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    oidcToken,
    setSeedlessSignerToken
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_4__.useOnboardingContext)();
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [totpCode, setTotpCode] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)('');
  const onSignerTokenObtained = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(async token => {
    setSeedlessSignerToken(token);
    onFinish();
  }, [setSeedlessSignerToken, onFinish]);
  const getOidcToken = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(async () => oidcToken ?? '', [oidcToken]);
  const {
    error,
    authenticate,
    verifyTotpCode,
    step
  } = (0,_src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__.useSeedlessAuth)({
    setIsLoading,
    onSignerTokenObtained,
    getOidcToken
  });
  const totpError = (0,_src_hooks_useTotpErrorMessage__WEBPACK_IMPORTED_MODULE_2__.useTotpErrorMessage)(error);
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (step === _src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__.AuthStep.NotInitialized) {
      authenticate({});
    }
  }, [authenticate, step]);
  return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__.Overlay, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '512px',
      minHeight: '407px',
      background: theme.palette.background.paper,
      borderRadius: 1,
      p: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "h4",
    sx: {
      pt: 3,
      px: 4
    },
    "data-testid": `authenticator-modal-header`
  }, t('Verify Code')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    variant: "text",
    "data-testid": `authenticator-modal-close-button`,
    onClick: onCancel,
    sx: {
      p: 0,
      height: theme.spacing(3),
      width: theme.spacing(3),
      minWidth: theme.spacing(3)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.XIcon, {
    size: 24,
    sx: {
      color: 'primary.main'
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexGrow: 1,
      pt: 1,
      px: 4
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    minHeight: 40
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    sx: {
      color: 'text.secondary'
    }
  }, t('Enter the code generated from your authenticator app.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      height: '100%',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.TextField, {
    inputProps: {
      style: {
        width: '100%'
      }
    },
    type: "tel",
    onChange: event => setTotpCode(event.target.value),
    rows: 3,
    multiline: true,
    error: !!totpError,
    helperText: totpError,
    onKeyDown: async event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        await verifyTotpCode(totpCode);
      }
    }
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    color: "secondary",
    "data-testid": "authenticator-modal-cancel",
    onClick: onCancel,
    disabled: isLoading
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    isLoading: isLoading,
    disabled: isLoading,
    "data-testid": "authenticator-modal-next",
    onClick: async () => {
      await verifyTotpCode(totpCode);
    }
  }, t('Next'))))));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/modals/VerifyGoBackModal.tsx":
/*!**************************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/modals/VerifyGoBackModal.tsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VerifyGoBackModal": () => (/* binding */ VerifyGoBackModal)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function VerifyGoBackModal({
  onBack,
  onCancel,
  isOpen
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  if (!isOpen) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__.Overlay, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: '512px',
      minHeight: '407px',
      background: theme.palette.background.paper,
      borderRadius: 1,
      p: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "h4",
    sx: {
      pt: 3,
      px: 4
    },
    "data-testid": `authenticator-modal-header`
  }, t('Are You Sure You Want To Go Back?')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: "text",
    "data-testid": `authenticator-modal-close-button`,
    onClick: onCancel,
    sx: {
      p: 0,
      height: theme.spacing(3),
      width: theme.spacing(3),
      minWidth: theme.spacing(3)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.XIcon, {
    size: 24,
    sx: {
      color: 'primary.main'
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexGrow: 1,
      pt: 1,
      px: 4
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Going back will take you to the beginning of the onboarding flow. You will need to re-verify the MFA you just set up before continuing with account creation.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'center',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.AlertCircleIcon, {
    size: 80
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 2,
      justifyContent: 'flex-end',
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    color: "secondary",
    "data-testid": "authenticator-modal-cancel",
    onClick: onCancel
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    "data-testid": "authenticator-modal-next",
    onClick: onBack
  }, t('Go Back')))));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Seedless/models.ts":
/*!*******************************************************!*\
  !*** ./src/pages/Onboarding/pages/Seedless/models.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FIDOSteps": () => (/* binding */ FIDOSteps),
/* harmony export */   "RecoveryMethodTypes": () => (/* binding */ RecoveryMethodTypes)
/* harmony export */ });
let FIDOSteps = /*#__PURE__*/function (FIDOSteps) {
  FIDOSteps["NAMING"] = "naming";
  FIDOSteps["REGISTER"] = "register";
  FIDOSteps["LOGIN"] = "login";
  FIDOSteps["ERROR"] = "error";
  return FIDOSteps;
}({});

// When the user wants to login with a FIDO device, we don't get the device exact type (e.g. passkey or yubikey), only we get the tpye it is 'fido"
// so we need to handle them as a unit in the login process
let RecoveryMethodTypes = /*#__PURE__*/function (RecoveryMethodTypes) {
  RecoveryMethodTypes["PASSKEY"] = "passkey";
  RecoveryMethodTypes["TOTP"] = "totp";
  RecoveryMethodTypes["YUBIKEY"] = "yubikey";
  RecoveryMethodTypes["FIDO"] = "fido";
  RecoveryMethodTypes["UNKNOWN"] = "unknown";
  return RecoveryMethodTypes;
}({});

/***/ }),

/***/ "./src/pages/Onboarding/pages/Welcome/SignUpWithSeedless.tsx":
/*!*******************************************************************!*\
  !*** ./src/pages/Onboarding/pages/Welcome/SignUpWithSeedless.tsx ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SignUpWithSeedless": () => (/* binding */ SignUpWithSeedless)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/onboarding/models */ "./src/background/services/onboarding/models.ts");
/* harmony import */ var _Seedless_components_GoogleButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Seedless/components/GoogleButton */ "./src/pages/Onboarding/pages/Seedless/components/GoogleButton.tsx");
/* harmony import */ var _Seedless_components_AppleButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Seedless/components/AppleButton */ "./src/pages/Onboarding/pages/Seedless/components/AppleButton.tsx");
/* harmony import */ var _src_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/LoadingOverlay */ "./src/components/common/LoadingOverlay.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _Seedless_components_ExistingWalletOptions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Seedless/components/ExistingWalletOptions */ "./src/pages/Onboarding/pages/Seedless/components/ExistingWalletOptions.tsx");
/* harmony import */ var _src_components_icons_BrandName__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/components/icons/BrandName */ "./src/components/icons/BrandName.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");













function SignUpWithSeedless() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_7__.useAnalyticsContext)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_0__.useFeatureFlagContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_11__.useHistory)();
  const [isAuthenticationInProgress, setIsAuthenticationInProgress] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(false);
  const scrimRef = (0,react__WEBPACK_IMPORTED_MODULE_6__.useRef)(null);
  const optionsRef = (0,react__WEBPACK_IMPORTED_MODULE_6__.useRef)(null);
  const [showExistingWalletOption, setShowExistingWalletOption] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
    const handleClickInShim = event => {
      const {
        target
      } = event;
      const overlayClicked = scrimRef.current?.contains(target);
      const optionsClicked = optionsRef.current?.contains(target);
      if (overlayClicked && !optionsClicked) {
        setShowExistingWalletOption(false);
      }
    };
    document.addEventListener('mousedown', handleClickInShim);
    return () => {
      document.removeEventListener('mousedown', handleClickInShim);
    };
  }, [scrimRef, setShowExistingWalletOption]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      width: '322px',
      textAlign: 'center',
      height: '100%'
    },
    ref: scrimRef
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '40%'
    }
  }, /*#__PURE__*/React.createElement(_src_components_icons_BrandName__WEBPACK_IMPORTED_MODULE_9__.BrandName, {
    width: 120
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      rowGap: 2,
      height: '40%'
    }
  }, featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SEEDLESS_ONBOARDING_GOOGLE] && /*#__PURE__*/React.createElement(_Seedless_components_GoogleButton__WEBPACK_IMPORTED_MODULE_3__.GoogleButton, {
    setIsLoading: setIsAuthenticationInProgress
  }), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_1__.FeatureGates.SEEDLESS_ONBOARDING_APPLE] && /*#__PURE__*/React.createElement(_Seedless_components_AppleButton__WEBPACK_IMPORTED_MODULE_4__.AppleButton, {
    setIsLoading: setIsAuthenticationInProgress
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      pt: 2,
      justifyContent: 'space-between',
      alignItems: 'center',
      rowGap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Button, {
    sx: {
      width: '100%'
    },
    "data-testid": "create-wallet-seed-phrase-button",
    color: "secondary",
    size: "large",
    onClick: () => {
      history.push(_src_background_services_onboarding_models__WEBPACK_IMPORTED_MODULE_2__.OnboardingURLs.CREATE_WALLET);
      capture('RecoveryPhraseClicked');
    }
  }, t('Manually Create New Wallet')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Button, {
    sx: {
      width: '100%'
    },
    "data-testid": "access-existing-wallet-button",
    color: "secondary",
    size: "large",
    onClick: () => {
      setShowExistingWalletOption(true);
    }
  }, t('Access Existing Wallet')))), showExistingWalletOption && /*#__PURE__*/React.createElement(_Seedless_components_ExistingWalletOptions__WEBPACK_IMPORTED_MODULE_8__.ExistingWalletOptions, {
    ref: optionsRef,
    setShowExistingWalletOption: setShowExistingWalletOption
  })), isAuthenticationInProgress && /*#__PURE__*/React.createElement(_src_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_5__.LoadingOverlay, null));
}

/***/ }),

/***/ "./src/pages/Onboarding/pages/Welcome/Welcome.tsx":
/*!********************************************************!*\
  !*** ./src/pages/Onboarding/pages/Welcome/Welcome.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Welcome": () => (/* binding */ Welcome)
/* harmony export */ });
/* harmony import */ var _SignUpWithSeedless__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignUpWithSeedless */ "./src/pages/Onboarding/pages/Welcome/SignUpWithSeedless.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/OnboardingProvider */ "./src/contexts/OnboardingProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function Welcome() {
  const {
    resetStates
  } = (0,_src_contexts_OnboardingProvider__WEBPACK_IMPORTED_MODULE_1__.useOnboardingContext)();
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    resetStates();
  }, [resetStates]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_SignUpWithSeedless__WEBPACK_IMPORTED_MODULE_0__.SignUpWithSeedless, null));
}

/***/ }),

/***/ "./src/pages/Onboarding/utils/approveSeedlessRegistration.ts":
/*!*******************************************************************!*\
  !*** ./src/pages/Onboarding/utils/approveSeedlessRegistration.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SeedlessRegistartionResult": () => (/* binding */ SeedlessRegistartionResult),
/* harmony export */   "approveSeedlessRegistration": () => (/* binding */ approveSeedlessRegistration)
/* harmony export */ });
let SeedlessRegistartionResult = /*#__PURE__*/function (SeedlessRegistartionResult) {
  SeedlessRegistartionResult["ALREADY_REGISTERED"] = "ALREADY_REGISTERED";
  SeedlessRegistartionResult["APPROVED"] = "APPROVED";
  SeedlessRegistartionResult["ERROR"] = "ERROR";
  return SeedlessRegistartionResult;
}({});
var SeedlessRegistartionResponseTextStatus = /*#__PURE__*/function (SeedlessRegistartionResponseTextStatus) {
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
  }).then(async response => {
    const {
      message
    } = await response.json();
    if (message === SeedlessRegistartionResponseTextStatus.ALREADY_REGISTERED) {
      return SeedlessRegistartionResult.ALREADY_REGISTERED;
    }
    if (message === SeedlessRegistartionResponseTextStatus.APPROVED) {
      return SeedlessRegistartionResult.APPROVED;
    }
    throw new Error(message);
  }).catch(() => {
    return SeedlessRegistartionResult.ERROR;
  });
}

/***/ }),

/***/ "./src/pages/Onboarding/utils/getRandomMnemonicWord.ts":
/*!*************************************************************!*\
  !*** ./src/pages/Onboarding/utils/getRandomMnemonicWord.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRandomMnemonicWord": () => (/* binding */ getRandomMnemonicWord)
/* harmony export */ });
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bip39 */ "./node_modules/bip39/src/index.js");

const getRandomMnemonicWord = (wordlist = 'english') => {
  const words = bip39__WEBPACK_IMPORTED_MODULE_0__.wordlists[wordlist];
  if (!words) {
    throw new Error(`Unknown wordlist: ${wordlist}`);
  }
  const rand = Math.floor(Math.random() * words.length);
  return words[rand];
};

/***/ }),

/***/ "./src/pages/Onboarding/utils/splitSeedPhrase.ts":
/*!*******************************************************!*\
  !*** ./src/pages/Onboarding/utils/splitSeedPhrase.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ splitSeedPhrase)
/* harmony export */ });
function splitSeedPhrase(seedPhrase) {
  return seedPhrase.trim().split(/\s+/g);
}

/***/ }),

/***/ "./src/utils/seedPhraseValidation.ts":
/*!*******************************************!*\
  !*** ./src/utils/seedPhraseValidation.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "?0b7d":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX09uYm9hcmRpbmdfT25ib2FyZGluZ190c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQWtDO0FBRTNCLFNBQVNDLGlCQUFpQkEsQ0FBQSxFQUFXO0VBQzFDLE1BQU1DLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxlQUFlLENBQUMsSUFBSUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQzlELE9BQU9MLDREQUF3QixDQUFDRSxXQUFXLENBQUM7QUFDOUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKMEQ7QUFDakI7QUFLSjtBQUNVO0FBQ21CO0FBTzNELFNBQVNjLHlCQUF5QkEsQ0FBQ0MsSUFBbUIsRUFBRTtFQUM3RCxNQUFNQyxZQUFZLEdBQUc7SUFDbkIsQ0FBQ0gsbUZBQW9CLEdBQUdMLDBDQUFTLENBQUMsUUFBUSxDQUFDO0lBQzNDLENBQUNLLGlGQUFrQixHQUFHTCwwQ0FBUyxDQUFDLE1BQU0sQ0FBQztJQUN2QyxDQUFDSyxpRkFBa0IsR0FBR0wsMENBQVMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQ0ssZ0ZBQWlCLEdBQUdMLDBDQUFTLENBQUMsS0FBSyxDQUFDO0lBQ3JDLENBQUNLLGlGQUFrQixHQUFHTCwwQ0FBUyxDQUFDLE1BQU0sQ0FBQztJQUN2QyxDQUFDSyxxRkFBc0IsR0FBR0wsMENBQVMsQ0FBQyxVQUFVLENBQUM7SUFDL0MsQ0FBQ0ssMEZBQTJCLEdBQUdMLDBDQUFTLENBQUMsZUFBZTtFQUMxRCxDQUFDO0VBRUQsT0FBT1EsWUFBWSxDQUFDRCxJQUFJLENBQUM7QUFDM0I7QUFFTyxTQUFTUyxpQkFBaUJBLENBQUM7RUFDaENDLFlBQVk7RUFDWkMsYUFBYTtFQUNiQztBQUN5QyxDQUFDLEVBQUU7RUFDNUMsTUFBTTtJQUFFcEI7RUFBRSxDQUFDLEdBQUdLLDZEQUFjLEVBQUU7RUFFOUIsb0JBQ0VnQixLQUFBLENBQUFDLGFBQUEsQ0FBQ25CLDhEQUFLO0lBQUNvQixFQUFFLEVBQUU7TUFBRUMs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QUFNLENBQUM7RUFFckQsT0FBT2lOLEtBQUssQ0FBQ29WLElBQUksQ0FBQztBQUNwQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNaYyxTQUFTL1EsZUFBZUEsQ0FBQ2dSLFVBQWtCLEVBQVk7RUFDcEUsT0FBT0EsVUFBVSxDQUFDQyxJQUFJLEVBQUUsQ0FBQ3JWLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDeEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRmtDO0FBRTNCLE1BQU14TixnQkFBZ0IsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBRXJDLE1BQU02UixlQUFlLEdBQUk1RSxNQUFjLElBQUs7RUFDakQsTUFBTTZWLE9BQU8sR0FBRzdWLE1BQU0sQ0FBQzRWLElBQUksRUFBRSxDQUFDclYsS0FBSyxDQUFDLE1BQU0sQ0FBQztFQUUzQyxPQUNFeE4sZ0JBQWdCLENBQUNtTyxRQUFRLENBQUMyVSxPQUFPLENBQUN4aUIsTUFBTSxDQUFDLElBQ3pDM08sNERBQXdCLENBQUNteEIsT0FBTyxDQUFDblEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDcVEsV0FBVyxFQUFFLENBQUM7QUFFN0QsQ0FBQzs7Ozs7Ozs7OztBQ1hEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3dhbGxldC91dGlscy9jcmVhdGVNbmVtb25pY1BocmFzZS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0Z1bmN0aW9uSXNPZmZsaW5lLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0lubGluZUJvbGQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vTG9hZGluZ092ZXJsYXkudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlS2V5c3RvbmVTY2FubmVyQ29udGVudHMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9PbmJvYXJkaW5nLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvY29tcG9uZW50cy9MYW5ndWFnZVNlbGVjdG9yLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvY29tcG9uZW50cy9PbmJvYXJkaW5nU3RlcEhlYWRlci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL2NvbXBvbmVudHMvUGFnZU5hdi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL2NvbXBvbmVudHMvUGFnZVRyYWNrZXIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9jb21wb25lbnRzL1dvcmRzTGVuZ3RoU2VsZWN0b3IudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9ob29rcy91c2VTZWVkbGVzc0FjdGlvbnMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL0FuYWx5dGljc0NvbnNlbnQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9DcmVhdGVQYXNzd29yZC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL0NyZWF0ZVdhbGxldC9Db25maXJtTW5lbW9uaWMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9DcmVhdGVXYWxsZXQvQ29uZmlybVBocmFzZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL0NyZWF0ZVdhbGxldC9Db3B5UGhyYXNlLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvcGFnZXMvQ3JlYXRlV2FsbGV0L0NyZWF0ZVdhbGxldC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL0NyZWF0ZVdhbGxldC9NbmVtb25pYy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL0NyZWF0ZVdhbGxldC9TaG93TW5lbW9uaWMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9JbXBvcnRXYWxsZXQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9LZXlzdG9uZS9LZXlzdG9uZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL0tleXN0b25lL0tleXN0b25lUVJDb2RlU2Nhbm5lci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL0xlZGdlci9MZWRnZXJDb25uZWN0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvcGFnZXMvTGVkZ2VyL0xlZGdlclRyb3VibGUudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9TZWVkbGVzcy9SZWNvdmVyeU1ldGhvZHMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9TZWVkbGVzcy9SZWNvdmVyeU1ldGhvZHNMb2dpbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL1NlZWRsZXNzL2NvbXBvbmVudHMvQXBwbGVCdXR0b24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9TZWVkbGVzcy9jb21wb25lbnRzL0V4aXN0aW5nV2FsbGV0QnV0dG9uLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvcGFnZXMvU2VlZGxlc3MvY29tcG9uZW50cy9FeGlzdGluZ1dhbGxldE9wdGlvbnMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9TZWVkbGVzcy9jb21wb25lbnRzL0dvb2dsZUJ1dHRvbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL1NlZWRsZXNzL2NvbXBvbmVudHMvTWV0aG9kQ2FyZC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL1NlZWRsZXNzL21vZGFscy9BdXRoZW50aWNhdG9yTW9kYWwudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9TZWVkbGVzcy9tb2RhbHMvRklET01vZGFsLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvcGFnZXMvU2VlZGxlc3MvbW9kYWxzL1RPVFBNb2RhbC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL1NlZWRsZXNzL21vZGFscy9WZXJpZnlHb0JhY2tNb2RhbC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3BhZ2VzL1NlZWRsZXNzL21vZGVscy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvcGFnZXMvV2VsY29tZS9TaWduVXBXaXRoU2VlZGxlc3MudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy9wYWdlcy9XZWxjb21lL1dlbGNvbWUudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy91dGlscy9hcHByb3ZlU2VlZGxlc3NSZWdpc3RyYXRpb24udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9PbmJvYXJkaW5nL3V0aWxzL2dldFJhbmRvbU1uZW1vbmljV29yZC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvdXRpbHMvc3BsaXRTZWVkUGhyYXNlLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvc2VlZFBocmFzZVZhbGlkYXRpb24udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi9pZ25vcmVkfC9Vc2Vycy9jc2FiYS52YWx5aS9wcmovY29yZS1leHRlbnNpb24vbm9kZV9tb2R1bGVzL0Bub2JsZS9zZWNwMjU2azEvbGlifGNyeXB0byJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNbmVtb25pYyB9IGZyb20gJ2V0aGVycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZXdNbmVtb25pYygpOiBzdHJpbmcge1xuICBjb25zdCByYW5kb21CeXRlcyA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoMzIpKTtcbiAgcmV0dXJuIE1uZW1vbmljLmVudHJvcHlUb1BocmFzZShyYW5kb21CeXRlcyk7XG59XG4iLCJpbXBvcnQgeyBQcm9wc1dpdGhDaGlsZHJlbiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFBhZ2VUaXRsZSwgUGFnZVRpdGxlVmFyaWFudCB9IGZyb20gJy4vUGFnZVRpdGxlJztcbmltcG9ydCB7IHQgYXMgdHJhbnNsYXRlIH0gZnJvbSAnaTE4bmV4dCc7XG5pbXBvcnQge1xuICBBbGVydENpcmNsZUljb24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IEZ1bmN0aW9uTmFtZXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUlzRnVuY3Rpb25BdmFpbGFibGUnO1xuXG5pbnRlcmZhY2UgRnVuY3Rpb25Jc09mZmxpbmVQcm9wcyB7XG4gIGZ1bmN0aW9uTmFtZTogRnVuY3Rpb25OYW1lcztcbiAgaGlkZVBhZ2VUaXRsZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUcmFuc2xhdGVkRnVuY3Rpb25OYW1lKG5hbWU6IEZ1bmN0aW9uTmFtZXMpIHtcbiAgY29uc3QgdHJhbnNsYXRpb25zID0ge1xuICAgIFtGdW5jdGlvbk5hbWVzLkJSSURHRV06IHRyYW5zbGF0ZSgnQnJpZGdlJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuU1dBUF06IHRyYW5zbGF0ZSgnU3dhcCcpLFxuICAgIFtGdW5jdGlvbk5hbWVzLlNFTkRdOiB0cmFuc2xhdGUoJ1NlbmQnKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5CVVldOiB0cmFuc2xhdGUoJ0J1eScpLFxuICAgIFtGdW5jdGlvbk5hbWVzLkRFRkldOiB0cmFuc2xhdGUoJ0RlRmknKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5LRVlTVE9ORV06IHRyYW5zbGF0ZSgnS2V5c3RvbmUnKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5UT0tFTl9ERVRBSUxTXTogdHJhbnNsYXRlKCdUb2tlbiBEZXRhaWxzJyksXG4gIH07XG5cbiAgcmV0dXJuIHRyYW5zbGF0aW9uc1tuYW1lXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZ1bmN0aW9uSXNPZmZsaW5lKHtcbiAgZnVuY3Rpb25OYW1lLFxuICBoaWRlUGFnZVRpdGxlLFxuICBjaGlsZHJlbixcbn06IFByb3BzV2l0aENoaWxkcmVuPEZ1bmN0aW9uSXNPZmZsaW5lUHJvcHM+KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBoZWlnaHQ6ICcxMDAlJywgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgIHshaGlkZVBhZ2VUaXRsZSAmJiAoXG4gICAgICAgIDxQYWdlVGl0bGUgdmFyaWFudD17UGFnZVRpdGxlVmFyaWFudC5QUklNQVJZfT57dCgnU29ycnknKX08L1BhZ2VUaXRsZT5cbiAgICAgICl9XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3sgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZmxleEdyb3c6IDEgfX1cbiAgICAgID5cbiAgICAgICAgPEFsZXJ0Q2lyY2xlSWNvbiBzaXplPXs3Mn0gc3g9e3sgbWI6IDMsIG10OiAtOSB9fSAvPlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIiBzeD17eyBtYjogMSB9fT5cbiAgICAgICAgICB7dCgnRmVhdHVyZSBEaXNhYmxlZCcpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgYWxpZ249XCJjZW50ZXJcIlxuICAgICAgICAgIGhlaWdodD1cIjI0cHhcIlxuICAgICAgICAgIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dCgne3tmdW5jdGlvbk5hbWV9fSBpcyBjdXJyZW50bHkgdW5hdmFpbGFibGUuJywge1xuICAgICAgICAgICAgZnVuY3Rpb25OYW1lOlxuICAgICAgICAgICAgICBnZXRUcmFuc2xhdGVkRnVuY3Rpb25OYW1lKGZ1bmN0aW9uTmFtZSkgPz8gdCgnVGhpcyBGZWF0dXJlJyksXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHkgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAge3QoJ1BsZWFzZSBjaGVjayBiYWNrIGxhdGVyIGFuZCB0cnkgYWdhaW4uJyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IElubGluZUJvbGQgPSBzdHlsZWQoJ3NwYW4nKWBcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG5gO1xuIiwiaW1wb3J0IHsgQ2lyY3VsYXJQcm9ncmVzcyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPdmVybGF5IH0gZnJvbSAnLi9PdmVybGF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIExvYWRpbmdPdmVybGF5KCkge1xuICByZXR1cm4gKFxuICAgIDxPdmVybGF5PlxuICAgICAgPENpcmN1bGFyUHJvZ3Jlc3MgLz5cbiAgICA8L092ZXJsYXk+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBCdXR0b24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgUVJDb2RlSWNvbixcbiAgQ2FtZXJhQmxvY2tlZEljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgQW5pbWF0ZWRRUlNjYW5uZXIsIFB1cnBvc2UsIFVSVHlwZSB9IGZyb20gJ0BrZXlzdG9uZWhxL2FuaW1hdGVkLXFyJztcblxuZXhwb3J0IGNvbnN0IHVzZUtleXN0b25lU2Nhbm5lckNvbnRlbnRzID0gKHtcbiAgY2FtZXJhUGVybWlzc2lvbixcbiAgaGFzRXJyb3IsXG4gIHNldEhhc0Vycm9yLFxuICBoYW5kbGVTY2FuLFxuICBoYW5kbGVFcnJvcixcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IHBhbGV0dGUgfSA9IHVzZVRoZW1lKCk7XG5cbiAgY29uc3QgaGVhZExpbmVzID0ge1xuICAgIGFsbG93QWNjZXNzOiB0KCdDYW1lcmEgQWNjZXNzJyksXG4gICAgaGFzQWNjZXNzOiB0KCdTY2FuIFFSIENvZGUnKSxcbiAgICBibG9ja2VkQWNjZXNzOiB0KCdBY2Nlc3MgQmxvY2tlZCcpLFxuICAgIGhhc0Vycm9yOiB0KCdJbnZhbGlkIFFSIENvZGUnKSxcbiAgfTtcblxuICBjb25zdCBkZXNjcmlwdGlvbnMgPSB7XG4gICAgYWxsb3dBY2Nlc3M6IHQoJ0FsbG93IENocm9tZSBhY2Nlc3MgdG8geW91ciBjYW1lcmEgdG8gc2NhbiB0aGUgUVIgQ29kZScpLFxuICAgIGhhc0FjY2VzczogdCgnU2NhbiB0aGUgUVIgY29kZSBkaXNwbGF5ZWQgb24geW91ciBLZXlzdG9uZSBkZXZpY2UnKSxcbiAgICBibG9ja2VkQWNjZXNzOiB0KFxuICAgICAgJ1lvdeKAmXZlIGJsb2NrZWQgYWNjZXNzIHRvIHlvdXIgY2FtZXJhLiBQbGVhc2UgYWxsb3cgYWNjZXNzIHRvIGNvbnRpbnVlLicsXG4gICAgKSxcbiAgICBoYXNFcnJvcjogdChcbiAgICAgICdQbGVhc2UgZW5zdXJlIHlvdSBoYXZlIHNlbGVjdGVkIGEgdmFsaWQgUVIgY29kZSBmcm9tIHlvdXIgS2V5c3RvbmUgZGV2aWNlLiAnLFxuICAgICksXG4gIH07XG5cbiAgY29uc3QgaGVscGVyVGV4dHMgPSB7XG4gICAgYWxsb3dBY2Nlc3M6IChcbiAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgIGFsaWduPVwiY2VudGVyXCJcbiAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgID5cbiAgICAgICAge3QoXG4gICAgICAgICAgJ0lmIHlvdSBibG9jayBhY2Nlc3MsIGxvb2sgaW4gdGhlIHRvcCByaWdodCBjb3JuZXIgb2YgeW91ciBicm93c2VyIHRvIGVuYWJsZSBjYW1lcmEgYWNjZXNzJyxcbiAgICAgICAgKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICApLFxuICAgIGhhc0FjY2VzczogKFxuICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgYWxpZ249XCJjZW50ZXJcIlxuICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fVxuICAgICAgPlxuICAgICAgICB7dChcbiAgICAgICAgICAnUG9zaXRpb24gdGhlIFFSIGNvZGUgaW4gZnJvbnQgb2YgeW91ciBjYW1lcmEuIFRoZSBzY3JlZW4gaXMgYmx1cnJlZCwgYnV0IHRoaXMgd2lsbCBub3QgYWZmZWN0IHRoZSBzY2FuLicsXG4gICAgICAgICl9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgKSxcbiAgICBibG9ja2VkQWNjZXNzOiAoXG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICBhbGlnbj1cImNlbnRlclwiXG4gICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19XG4gICAgICA+XG4gICAgICAgIHt0KFxuICAgICAgICAgICdJZiB5b3UgYmxvY2sgYWNjZXNzLCBsb29rIGluIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHlvdXIgYnJvd3NlciB0byBlbmFibGUgY2FtZXJhIGFjY2VzcycsXG4gICAgICAgICl9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgKSxcbiAgICBoYXNFcnJvcjogKFxuICAgICAgPFN0YWNrIHN4PXt7IGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cnktYWdhaW4tYnV0dG9uXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRIYXNFcnJvcihmYWxzZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzeD17eyB3aWR0aDogJzI0NnB4JyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ1RyeSBBZ2FpbicpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvU3RhY2s+XG4gICAgKSxcbiAgfTtcblxuICBjb25zdCBjb250ZW50cyA9IHtcbiAgICBhbGxvd0FjY2VzczogKFxuICAgICAgPD5cbiAgICAgICAgPENpcmN1bGFyUHJvZ3Jlc3Mgc2l6ZT17ODh9IC8+XG4gICAgICA8Lz5cbiAgICApLFxuICAgIGhhc0FjY2VzczogKFxuICAgICAgPEFuaW1hdGVkUVJTY2FubmVyXG4gICAgICAgIHB1cnBvc2U9e1B1cnBvc2UuU1lOQ31cbiAgICAgICAgaGFuZGxlU2Nhbj17aGFuZGxlU2Nhbn1cbiAgICAgICAgaGFuZGxlRXJyb3I9e2hhbmRsZUVycm9yfVxuICAgICAgICBvcHRpb25zPXt7XG4gICAgICAgICAgd2lkdGg6IDIyOSxcbiAgICAgICAgICBoZWlnaHQ6IDIyOSxcbiAgICAgICAgfX1cbiAgICAgICAgdXJUeXBlcz17W1VSVHlwZS5DUllQVE9fTVVMVElfQUNDT1VOVFNdfVxuICAgICAgLz5cbiAgICApLFxuICAgIGJsb2NrZWRBY2Nlc3M6IChcbiAgICAgIDxDYW1lcmFCbG9ja2VkSWNvblxuICAgICAgICBzaXplPXs1MH1cbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBvdXRsaW5lOiBgM3B4IHNvbGlkICR7cGFsZXR0ZS5lcnJvci5tYWlufWAsXG4gICAgICAgICAgb3V0bGluZU9mZnNldDogNSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdlcnJvci5tYWluJyxcbiAgICAgICAgICBtOiAxLFxuICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiA5OTksXG4gICAgICAgICAgYm9yZGVyOiAxLFxuICAgICAgICAgIGJvcmRlckNvbG9yOiAnZXJyb3IubWFpbicsXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICksXG4gICAgaGFzRXJyb3I6IChcbiAgICAgIDxRUkNvZGVJY29uXG4gICAgICAgIHNpemU9ezU2fVxuICAgICAgICBzeD17e1xuICAgICAgICAgIG91dGxpbmU6IGAzcHggc29saWQgJHtwYWxldHRlLmVycm9yLm1haW59YCxcbiAgICAgICAgICBvdXRsaW5lT2Zmc2V0OiA1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2Vycm9yLm1haW4nLFxuICAgICAgICAgIG06IDEsXG4gICAgICAgICAgcDogMixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDk5OSxcbiAgICAgICAgICBib3JkZXI6IDEsXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICdlcnJvci5tYWluJyxcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgKSxcbiAgfTtcblxuICBjb25zdCBnZXRQYWdlQ29udGVudCA9ICgpID0+IHtcbiAgICBpZiAoIWNhbWVyYVBlcm1pc3Npb24gfHwgY2FtZXJhUGVybWlzc2lvbiA9PT0gJ3Byb21wdCcpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRMaW5lOiBoZWFkTGluZXMuYWxsb3dBY2Nlc3MsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbnMuYWxsb3dBY2Nlc3MsXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRzLmFsbG93QWNjZXNzLFxuICAgICAgICBoZWxwZXJUZXh0OiBoZWxwZXJUZXh0cy5hbGxvd0FjY2VzcyxcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChjYW1lcmFQZXJtaXNzaW9uID09PSAnZ3JhbnRlZCcgJiYgaGFzRXJyb3IpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRMaW5lOiBoZWFkTGluZXMuaGFzRXJyb3IsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbnMuaGFzRXJyb3IsXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRzLmhhc0Vycm9yLFxuICAgICAgICBoZWxwZXJUZXh0OiBoZWxwZXJUZXh0cy5oYXNFcnJvcixcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChjYW1lcmFQZXJtaXNzaW9uID09PSAnZ3JhbnRlZCcpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlYWRMaW5lOiBoZWFkTGluZXMuaGFzQWNjZXNzLFxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25zLmhhc0FjY2VzcyxcbiAgICAgICAgY29udGVudDogY29udGVudHMuaGFzQWNjZXNzLFxuICAgICAgICBoZWxwZXJUZXh0OiBoZWxwZXJUZXh0cy5oYXNBY2Nlc3MsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChjYW1lcmFQZXJtaXNzaW9uID09PSAnZGVuaWVkJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGVhZExpbmU6IGhlYWRMaW5lcy5ibG9ja2VkQWNjZXNzLFxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25zLmJsb2NrZWRBY2Nlc3MsXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRzLmJsb2NrZWRBY2Nlc3MsXG4gICAgICAgIGhlbHBlclRleHQ6IGhlbHBlclRleHRzLmJsb2NrZWRBY2Nlc3MsXG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZ2V0UGFnZUNvbnRlbnQoKTtcbn07XG4iLCJpbXBvcnQge1xuICBzdHlsZWQsXG4gIFN0YWNrLFxuICBDaXJjdWxhclByb2dyZXNzLFxuICBIb21lSWNvbixcbiAgQm94LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgTGFuZ3VhZ2VTZWxlY3RvciB9IGZyb20gJy4vY29tcG9uZW50cy9MYW5ndWFnZVNlbGVjdG9yJztcbmltcG9ydCB7XG4gIFJlZGlyZWN0LFxuICBSb3V0ZSxcbiAgU3dpdGNoLFxuICB1c2VIaXN0b3J5LFxuICB1c2VMb2NhdGlvbixcbn0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBTdXNwZW5zZSwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IENyZWF0ZVdhbGxldCB9IGZyb20gJy4vcGFnZXMvQ3JlYXRlV2FsbGV0L0NyZWF0ZVdhbGxldCc7XG5pbXBvcnQge1xuICBPbmJvYXJkaW5nUGhhc2UsXG4gIE9uYm9hcmRpbmdVUkxzLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvb25ib2FyZGluZy9tb2RlbHMnO1xuaW1wb3J0IHsgS2V5c3RvbmUgfSBmcm9tICcuL3BhZ2VzL0tleXN0b25lL0tleXN0b25lJztcbmltcG9ydCB7IExlZGdlckNvbm5lY3QgfSBmcm9tICcuL3BhZ2VzL0xlZGdlci9MZWRnZXJDb25uZWN0JztcbmltcG9ydCB7IEltcG9ydFdhbGxldCB9IGZyb20gJy4vcGFnZXMvSW1wb3J0V2FsbGV0JztcbmltcG9ydCB7IENyZWF0ZVBhc3N3b3JkIH0gZnJvbSAnLi9wYWdlcy9DcmVhdGVQYXNzd29yZCc7XG5pbXBvcnQgeyBBbmFseXRpY3NDb25zZW50IH0gZnJvbSAnLi9wYWdlcy9BbmFseXRpY3NDb25zZW50JztcbmltcG9ydCB7IHVzZU9uYm9hcmRpbmdDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9PbmJvYXJkaW5nUHJvdmlkZXInO1xuaW1wb3J0IHsgTG9hZGluZ092ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0xvYWRpbmdPdmVybGF5JztcbmltcG9ydCB7IEFwcEJhY2tncm91bmQgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0FwcEJhY2tncm91bmQnO1xuaW1wb3J0IHsgTGVkZ2VyVHJvdWJsZSB9IGZyb20gJy4vcGFnZXMvTGVkZ2VyL0xlZGdlclRyb3VibGUnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgV2VsY29tZSB9IGZyb20gJy4vcGFnZXMvV2VsY29tZS9XZWxjb21lJztcbmltcG9ydCB7IFJlY292ZXJ5TWV0aG9kcyB9IGZyb20gJy4vcGFnZXMvU2VlZGxlc3MvUmVjb3ZlcnlNZXRob2RzJztcbmltcG9ydCB7IFJlY292ZXJ5TWV0aG9kc0xvZ2luIH0gZnJvbSAnLi9wYWdlcy9TZWVkbGVzcy9SZWNvdmVyeU1ldGhvZHNMb2dpbic7XG5pbXBvcnQgeyBWZXJpZnlHb0JhY2tNb2RhbCB9IGZyb20gJy4vcGFnZXMvU2VlZGxlc3MvbW9kYWxzL1ZlcmlmeUdvQmFja01vZGFsJztcblxuY29uc3QgQ29udGVudFBhcnQgPSBzdHlsZWQoU3RhY2spYFxuICBmbGV4LWdyb3c6IDE7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xuYDtcblxuY29uc3QgT25ib2FyZGluZ1N0ZXAgPSBzdHlsZWQoU3RhY2spYFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmbGV4OiAxO1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIE9uYm9hcmRpbmcoKSB7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IGxvY2F0aW9uID0gdXNlTG9jYXRpb24oKTtcbiAgY29uc3QgeyBzdWJtaXRJblByb2dyZXNzLCBzZXRPbmJvYXJkaW5nUGhhc2UsIG9uYm9hcmRpbmdQaGFzZSB9ID1cbiAgICB1c2VPbmJvYXJkaW5nQ29udGV4dCgpO1xuICBjb25zdCB7IGluaXRBbmFseXRpY3NJZHMsIGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgW2lzVmVyaWZ5R29CYWNrTW9kYWxPcGVuLCBzZXRJc1ZlcmlmeUdvQmFja01vZGFsT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpbml0QW5hbHl0aWNzSWRzKGZhbHNlKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIHN4PXt7IGRpc3BsYXk6ICdncmlkJywgaGVpZ2h0OiAnMTAwJScsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICcxZnIgMWZyJyB9fVxuICAgID5cbiAgICAgIHtzdWJtaXRJblByb2dyZXNzICYmIDxMb2FkaW5nT3ZlcmxheSAvPn1cbiAgICAgIDxDb250ZW50UGFydCBzeD17eyBweDogMiB9fT5cbiAgICAgICAgPFN0YWNrIHN4PXt7IGFsaWduSXRlbXM6ICdlbmQnLCBweTogMiB9fT5cbiAgICAgICAgICA8TGFuZ3VhZ2VTZWxlY3RvciAvPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8T25ib2FyZGluZ1N0ZXAgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICBtdDogMixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN3aXRjaD5cbiAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9e09uYm9hcmRpbmdVUkxzLkFOQUxZVElDU19DT05TRU5UfT5cbiAgICAgICAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxDaXJjdWxhclByb2dyZXNzIC8+fT5cbiAgICAgICAgICAgICAgICAgIDxBbmFseXRpY3NDb25zZW50IC8+XG4gICAgICAgICAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgICAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9e09uYm9hcmRpbmdVUkxzLkNSRUFURV9QQVNTV09SRH0+XG4gICAgICAgICAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8Q2lyY3VsYXJQcm9ncmVzcyAvPn0+XG4gICAgICAgICAgICAgICAgICA8Q3JlYXRlUGFzc3dvcmQgLz5cbiAgICAgICAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICAgICAgICA8L1JvdXRlPlxuICAgICAgICAgICAgICA8Um91dGUgcGF0aD17T25ib2FyZGluZ1VSTHMuU0VFRF9QSFJBU0V9PlxuICAgICAgICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PENpcmN1bGFyUHJvZ3Jlc3MgLz59PlxuICAgICAgICAgICAgICAgICAgPEltcG9ydFdhbGxldCAvPlxuICAgICAgICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgICAgICAgIDwvUm91dGU+XG4gICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPXtPbmJvYXJkaW5nVVJMcy5LRVlTVE9ORX0+XG4gICAgICAgICAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8Q2lyY3VsYXJQcm9ncmVzcyAvPn0+XG4gICAgICAgICAgICAgICAgICA8S2V5c3RvbmUgLz5cbiAgICAgICAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICAgICAgICA8L1JvdXRlPlxuICAgICAgICAgICAgICA8Um91dGUgcGF0aD17T25ib2FyZGluZ1VSTHMuTEVER0VSfT5cbiAgICAgICAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxDaXJjdWxhclByb2dyZXNzIC8+fT5cbiAgICAgICAgICAgICAgICAgIDxMZWRnZXJDb25uZWN0IC8+XG4gICAgICAgICAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgICAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9e09uYm9hcmRpbmdVUkxzLkxFREdFUl9UUk9VQkxFfT5cbiAgICAgICAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxDaXJjdWxhclByb2dyZXNzIC8+fT5cbiAgICAgICAgICAgICAgICAgIDxMZWRnZXJUcm91YmxlIC8+XG4gICAgICAgICAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgICAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9e09uYm9hcmRpbmdVUkxzLkNSRUFURV9XQUxMRVR9PlxuICAgICAgICAgICAgICAgIDxTdXNwZW5zZSBmYWxsYmFjaz17PENpcmN1bGFyUHJvZ3Jlc3MgLz59PlxuICAgICAgICAgICAgICAgICAgPENyZWF0ZVdhbGxldCAvPlxuICAgICAgICAgICAgICAgIDwvU3VzcGVuc2U+XG4gICAgICAgICAgICAgIDwvUm91dGU+XG4gICAgICAgICAgICAgIDxSb3V0ZSBwYXRoPXtPbmJvYXJkaW5nVVJMcy5SRUNPVkVSWV9NRVRIT0RTfT5cbiAgICAgICAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxDaXJjdWxhclByb2dyZXNzIC8+fT5cbiAgICAgICAgICAgICAgICAgIDxSZWNvdmVyeU1ldGhvZHMgLz5cbiAgICAgICAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICAgICAgICA8L1JvdXRlPlxuICAgICAgICAgICAgICA8Um91dGUgcGF0aD17T25ib2FyZGluZ1VSTHMuUkVDT1ZFUllfTUVUSE9EU19MT0dJTn0+XG4gICAgICAgICAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8Q2lyY3VsYXJQcm9ncmVzcyAvPn0+XG4gICAgICAgICAgICAgICAgICA8UmVjb3ZlcnlNZXRob2RzTG9naW4gLz5cbiAgICAgICAgICAgICAgICA8L1N1c3BlbnNlPlxuICAgICAgICAgICAgICA8L1JvdXRlPlxuICAgICAgICAgICAgICA8Um91dGUgcGF0aD17T25ib2FyZGluZ1VSTHMuT05CT0FSRElOR19IT01FfT5cbiAgICAgICAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9ezxDaXJjdWxhclByb2dyZXNzIC8+fT5cbiAgICAgICAgICAgICAgICAgIDxXZWxjb21lIC8+XG4gICAgICAgICAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgICAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCIvXCI+XG4gICAgICAgICAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8Q2lyY3VsYXJQcm9ncmVzcyAvPn0+XG4gICAgICAgICAgICAgICAgICA8UmVkaXJlY3QgdG89XCIvb25ib2FyZGluZ1wiIC8+XG4gICAgICAgICAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgICAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgICAgIDwvU3dpdGNoPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAge2xvY2F0aW9uLnBhdGhuYW1lICE9PSBPbmJvYXJkaW5nVVJMcy5PTkJPQVJESU5HX0hPTUUgJiYgKFxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAnMTAwJScsIHBsOiAxLCBwYjogMiB9fT5cbiAgICAgICAgICAgICAgPEhvbWVJY29uXG4gICAgICAgICAgICAgICAgc2l6ZT17MjB9XG4gICAgICAgICAgICAgICAgc3g9e3sgY3Vyc29yOiAncG9pbnRlcicgfX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjYXB0dXJlKCdPbmJvYXJkaW5nQ2FuY2VsbGVkJywgeyBzdGVwOiBvbmJvYXJkaW5nUGhhc2UgfSk7XG4gICAgICAgICAgICAgICAgICBpZiAob25ib2FyZGluZ1BoYXNlID09PSBPbmJvYXJkaW5nUGhhc2UuU0VFRExFU1NfR09PR0xFKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldElzVmVyaWZ5R29CYWNrTW9kYWxPcGVuKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBzZXRPbmJvYXJkaW5nUGhhc2UobnVsbCk7XG4gICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuT05CT0FSRElOR19IT01FKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxWZXJpZnlHb0JhY2tNb2RhbFxuICAgICAgICAgICAgaXNPcGVuPXtpc1ZlcmlmeUdvQmFja01vZGFsT3Blbn1cbiAgICAgICAgICAgIG9uQmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuT05CT0FSRElOR19IT01FKTtcbiAgICAgICAgICAgICAgc2V0SXNWZXJpZnlHb0JhY2tNb2RhbE9wZW4oZmFsc2UpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldElzVmVyaWZ5R29CYWNrTW9kYWxPcGVuKGZhbHNlKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9PbmJvYXJkaW5nU3RlcD5cbiAgICAgIDwvQ29udGVudFBhcnQ+XG4gICAgICA8Q29udGVudFBhcnRcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdiYWNrZ3JvdW5kLnBhcGVyJyxcbiAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICBiYWNrZHJvcEZpbHRlcjogJ2JsdXIoMTVweCknLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QXBwQmFja2dyb3VuZCAvPlxuICAgICAgPC9Db250ZW50UGFydD5cbiAgICA8L0JveD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIENoZWNrSWNvbixcbiAgQ2hldnJvbkRvd25JY29uLFxuICBDbGlja0F3YXlMaXN0ZW5lcixcbiAgR3JvdyxcbiAgTWVudUl0ZW0sXG4gIE1lbnVMaXN0LFxuICBQb3BwZXIsXG4gIFR5cG9ncmFwaHksXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VMYW5ndWFnZSB9IGZyb20gJ0BzcmMvaG9va3MvdXNlTGFuZ3VhZ2VzJztcblxuZXhwb3J0IGZ1bmN0aW9uIExhbmd1YWdlU2VsZWN0b3IoKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IHsgYXZhaWxhYmxlTGFuZ3VhZ2VzLCBjaGFuZ2VMYW5ndWFnZSwgY3VycmVudExhbmd1YWdlIH0gPSB1c2VMYW5ndWFnZSgpO1xuXG4gIGNvbnN0IGJ1dHRvblJlZiA9IHVzZVJlZjxIVE1MQnV0dG9uRWxlbWVudD4oKTtcbiAgY29uc3QgW2lzRHJvcGRvd25PcGVuLCBzZXRJc0Ryb3Bkb3duT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8Q2xpY2tBd2F5TGlzdGVuZXIgb25DbGlja0F3YXk9eygpID0+IHNldElzRHJvcGRvd25PcGVuKGZhbHNlKX0+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgY29sb3I9XCJwcmltYXJ5XCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNEcm9wZG93bk9wZW4oIWlzRHJvcGRvd25PcGVuKX1cbiAgICAgICAgcmVmPXtidXR0b25SZWZ9XG4gICAgICAgIGRhdGEtdGVzdGlkPVwib25ib2FyZGluZy1sYW5ndWFnZS1zZWxlY3RvclwiXG4gICAgICAgIHN4PXt7IGdhcDogMC41LCBjb2xvcjogJ3RleHQucHJpbWFyeScgfX1cbiAgICAgID5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgY2xhc3NOYW1lPVwiY3VycmVudC1sYW5ndWFnZVwiPlxuICAgICAgICAgIHtjdXJyZW50TGFuZ3VhZ2U/Lm5hbWV9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cblxuICAgICAgICA8Q2hldnJvbkRvd25JY29uXG4gICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHRoZW1lLnRyYW5zaXRpb25zLmNyZWF0ZSgndHJhbnNmb3JtJyksXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGlzRHJvcGRvd25PcGVuID8gJ3JvdGF0ZVgoMTgwZGVnKScgOiAnbm9uZScsXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPFBvcHBlclxuICAgICAgICAgIG9wZW49e2lzRHJvcGRvd25PcGVufVxuICAgICAgICAgIGFuY2hvckVsPXtidXR0b25SZWYuY3VycmVudH1cbiAgICAgICAgICBwbGFjZW1lbnQ9XCJib3R0b20tZW5kXCJcbiAgICAgICAgICB0cmFuc2l0aW9uXG4gICAgICAgID5cbiAgICAgICAgICB7KHsgVHJhbnNpdGlvblByb3BzIH0pID0+IChcbiAgICAgICAgICAgIDxHcm93IHsuLi5UcmFuc2l0aW9uUHJvcHN9IHRpbWVvdXQ9ezI1MH0+XG4gICAgICAgICAgICAgIDxNZW51TGlzdFxuICAgICAgICAgICAgICAgIGRlbnNlXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHA6IDAsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHthdmFpbGFibGVMYW5ndWFnZXMubWFwKChsYW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBpc0N1cnJlbnRMYW5nID0gbGFuZy5jb2RlID09PSBjdXJyZW50TGFuZ3VhZ2U/LmNvZGU7XG5cbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbVxuICAgICAgICAgICAgICAgICAgICAgIGtleT17bGFuZy5jb2RlfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZUxhbmd1YWdlKGxhbmcuY29kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXB0dXJlKCdPbmJvYXJkaW5nTGFuZ3VhZ2VDaGFuZ2VkJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZTogbGFuZy5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YG9uYm9hcmRpbmctbGFuZ3VhZ2Utc2VsZWN0b3ItbWVudS1pdGVtLSR7bGFuZy5jb2RlfWB9XG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FwOiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB4OiAxLFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I9e1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpc0N1cnJlbnRMYW5nID8gJ3RleHQuc2Vjb25kYXJ5JyA6ICd0ZXh0LnByaW1hcnknXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge2xhbmcubmFtZX0gKHtsYW5nLm9yaWdpbmFsTmFtZX0pXG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIHtpc0N1cnJlbnRMYW5nICYmIDxDaGVja0ljb24gc2l6ZT17MTh9IC8+fVxuICAgICAgICAgICAgICAgICAgICA8L01lbnVJdGVtPlxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgPC9NZW51TGlzdD5cbiAgICAgICAgICAgIDwvR3Jvdz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1BvcHBlcj5cbiAgICAgIDwvQnV0dG9uPlxuICAgIDwvQ2xpY2tBd2F5TGlzdGVuZXI+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBTdGFjaywgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBCcmFuZE5hbWUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvaWNvbnMvQnJhbmROYW1lJztcblxuaW50ZXJmYWNlIE9uYm9hcmRpbmdTdGVwSGVhZGVyUHJvcHMge1xuICB0ZXN0SWQ/OiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICBvbkJhY2s/OiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gT25ib2FyZGluZ1N0ZXBIZWFkZXIoe1xuICB0ZXN0SWQsXG4gIHRpdGxlLFxufTogT25ib2FyZGluZ1N0ZXBIZWFkZXJQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEJyYW5kTmFtZSB3aWR0aD17OTB9IC8+XG4gICAgICB7dGl0bGUgJiYgKFxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHZhcmlhbnQ9XCJoM1wiXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHB0OiAzLFxuICAgICAgICAgIH19XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2Ake3Rlc3RJZH0taGVhZGVyYH1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgKX1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgQnV0dG9uLCBTdGFjaywgVG9vbHRpcCwgdXNlVGhlbWUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgUGFnZVRyYWNrZXIgfSBmcm9tICcuL1BhZ2VUcmFja2VyJztcblxuaW50ZXJmYWNlIFBhZ2VOYXZQcm9wcyB7XG4gIG9uQmFjazogKCkgPT4gdm9pZDtcbiAgYmFja1RleHQ/OiBzdHJpbmc7XG4gIG9uTmV4dDogKCkgPT4gdm9pZDtcbiAgbmV4dFRleHQ/OiBzdHJpbmc7XG4gIGRpc2FibGVOZXh0PzogYm9vbGVhbjtcbiAgbmV4dERpc2FibGVkUmVhc29uPzogc3RyaW5nO1xuICBleHBhbmQ/OiBib29sZWFuO1xuICBzdGVwczogbnVtYmVyO1xuICBhY3RpdmVTdGVwOiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQYWdlTmF2KHtcbiAgb25CYWNrLFxuICBiYWNrVGV4dCxcbiAgb25OZXh0LFxuICBuZXh0VGV4dCxcbiAgZGlzYWJsZU5leHQsXG4gIG5leHREaXNhYmxlZFJlYXNvbixcbiAgc3RlcHMsXG4gIGFjdGl2ZVN0ZXAsXG4gIGNoaWxkcmVuLFxuICBleHBhbmQsXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxQYWdlTmF2UHJvcHM+KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBqdXN0aWZ5SXRlbXM6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgYWxpZ25Db250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgbXk6IDMsXG4gICAgICAgIHJvd0dhcDogYCR7ZXhwYW5kICYmIGNoaWxkcmVuID8gdGhlbWUuc3BhY2luZygyKSA6IHRoZW1lLnNwYWNpbmcoOCl9YCxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgY29sdW1uR2FwOiAyLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYWdlLW5hdi1iYWNrLWJ1dHRvblwiXG4gICAgICAgICAgb25DbGljaz17YXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgb25CYWNrKCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgd2lkdGg6IHRoZW1lLnNwYWNpbmcoMjEpLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7YmFja1RleHQgPyBiYWNrVGV4dCA6IHQoJ0JhY2snKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxUb29sdGlwIHRpdGxlPXtuZXh0RGlzYWJsZWRSZWFzb259IHN4PXt7IGN1cnNvcjogJ25vdC1hbGxvd2VkJyB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBhZ2UtbmF2LW5leHQtYnV0dG9uXCJcbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZU5leHR9XG4gICAgICAgICAgICBvbkNsaWNrPXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgIG9uTmV4dCgpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHdpZHRoOiB0aGVtZS5zcGFjaW5nKDIxKSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge25leHRUZXh0ID8gbmV4dFRleHQgOiB0KCdOZXh0Jyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvVG9vbHRpcD5cbiAgICAgIDwvU3RhY2s+XG4gICAgICB7ZXhwYW5kICYmIGNoaWxkcmVuICYmIChcbiAgICAgICAgPFN0YWNrIHN4PXt7IGhlaWdodDogdGhlbWUuc3BhY2luZyg0KSB9fT57Y2hpbGRyZW59PC9TdGFjaz5cbiAgICAgICl9XG4gICAgICA8UGFnZVRyYWNrZXIgc3RlcHM9e3N0ZXBzfSBhY3RpdmVTdGVwPXthY3RpdmVTdGVwfSAvPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBNb2JpbGVTdGVwcGVyIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW50ZXJmYWNlIFBhZ2VUcmFja2VyclByb3BzIHtcbiAgc3RlcHM6IG51bWJlcjtcbiAgYWN0aXZlU3RlcDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUGFnZVRyYWNrZXIoeyBzdGVwcywgYWN0aXZlU3RlcCB9OiBQYWdlVHJhY2tlcnJQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxNb2JpbGVTdGVwcGVyXG4gICAgICBiYWNrQnV0dG9uPXtudWxsfVxuICAgICAgbmV4dEJ1dHRvbj17bnVsbH1cbiAgICAgIHZhcmlhbnQ9XCJkb3RzXCJcbiAgICAgIHN0ZXBzPXtzdGVwc31cbiAgICAgIHBvc2l0aW9uPVwic3RhdGljXCJcbiAgICAgIGFjdGl2ZVN0ZXA9e2FjdGl2ZVN0ZXB9XG4gICAgICBzeD17KHRoZW1lKSA9PiAoe1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICcmIC5NdWlNb2JpbGVTdGVwcGVyLWRvdCc6IHtcbiAgICAgICAgICBtYXJnaW46IGAwICR7dGhlbWUuc3BhY2luZygwLjUpfWAsXG4gICAgICAgIH0sXG4gICAgICAgICcmIC5NdWlNb2JpbGVTdGVwcGVyLWRvdEFjdGl2ZSc6IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdzZWNvbmRhcnkubWFpbicsXG4gICAgICAgIH0sXG4gICAgICB9KX1cbiAgICAvPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgUG9wcGVyLFxuICBCdXR0b24sXG4gIENoZXZyb25Eb3duSWNvbixcbiAgVHlwb2dyYXBoeSxcbiAgR3JvdyxcbiAgQ2hlY2tJY29uLFxuICBNZW51SXRlbSxcbiAgTWVudUxpc3QsXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgd29yZFBocmFzZUxlbmd0aCB9IGZyb20gJ0BzcmMvdXRpbHMvc2VlZFBocmFzZVZhbGlkYXRpb24nO1xuaW1wb3J0IHsgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBXb3Jkc0xlbmd0aFNlbGVjdG9yKHtcbiAgd29yZHNMZW5ndGg6IGN1cnJlbnRXb3Jkc0xlbmd0aCxcbiAgc2V0V29yZHNMZW5ndGgsXG59OiB7XG4gIHdvcmRzTGVuZ3RoOiBudW1iZXI7XG4gIHNldFdvcmRzTGVuZ3RoOiAobGVuZ3RoOiBudW1iZXIpID0+IHZvaWQ7XG59KSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IGJ1dHRvblJlZiA9IHVzZVJlZjxIVE1MQnV0dG9uRWxlbWVudD4oKTtcbiAgY29uc3QgW2lzRHJvcGRvd25PcGVuLCBzZXRJc0Ryb3Bkb3duT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8QnV0dG9uXG4gICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc0Ryb3Bkb3duT3BlbighaXNEcm9wZG93bk9wZW4pfVxuICAgICAgcmVmPXtidXR0b25SZWZ9XG4gICAgICBkYXRhLXRlc3RpZD1cIm9uYm9hcmRpbmctbGFuZ3VhZ2Utc2VsZWN0b3JcIlxuICAgICAgc3g9e3sgd2lkdGg6ICcxMzVweCcgfX1cbiAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgPlxuICAgICAge2Ake2N1cnJlbnRXb3Jkc0xlbmd0aH0gJHt0KCdXb3JkIFBocmFzZScpfWB9XG5cbiAgICAgIDxDaGV2cm9uRG93bkljb25cbiAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgdHJhbnNpdGlvbjogdGhlbWUudHJhbnNpdGlvbnMuY3JlYXRlKCd0cmFuc2Zvcm0nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGlzRHJvcGRvd25PcGVuID8gJ3JvdGF0ZVgoMTgwZGVnKScgOiAnbm9uZScsXG4gICAgICAgICAgbWw6IDEsXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICAgPFBvcHBlclxuICAgICAgICBvcGVuPXtpc0Ryb3Bkb3duT3Blbn1cbiAgICAgICAgYW5jaG9yRWw9e2J1dHRvblJlZi5jdXJyZW50fVxuICAgICAgICBwbGFjZW1lbnQ9XCJib3R0b20tZW5kXCJcbiAgICAgICAgdHJhbnNpdGlvblxuICAgICAgPlxuICAgICAgICB7KHsgVHJhbnNpdGlvblByb3BzIH0pID0+IChcbiAgICAgICAgICA8R3JvdyB7Li4uVHJhbnNpdGlvblByb3BzfSB0aW1lb3V0PXsyNTB9PlxuICAgICAgICAgICAgPE1lbnVMaXN0XG4gICAgICAgICAgICAgIGRlbnNlXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgcDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7d29yZFBocmFzZUxlbmd0aC5tYXAoKGxlbmd0aCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8TWVudUl0ZW1cbiAgICAgICAgICAgICAgICAgICAga2V5PXtsZW5ndGh9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRXb3Jkc0xlbmd0aChsZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YG9uYm9hcmRpbmctd29yZHMtbGVuZ3RoLXNlbGVjdG9yLW1lbnUtaXRlbS0ke2xlbmd0aH1gfVxuICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIGdhcDogMixcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIHB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRXb3Jkc0xlbmd0aCAhPT0gbGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gJ3RleHQuc2Vjb25kYXJ5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICA6ICd0ZXh0LnByaW1hcnknXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge2Ake2xlbmd0aH0gJHt0KCdXb3JkIFBocmFzZScpfWB9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAge2N1cnJlbnRXb3Jkc0xlbmd0aCA9PT0gbGVuZ3RoICYmIDxDaGVja0ljb24gc2l6ZT17MTh9IC8+fVxuICAgICAgICAgICAgICAgICAgPC9NZW51SXRlbT5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvTWVudUxpc3Q+XG4gICAgICAgICAgPC9Hcm93PlxuICAgICAgICApfVxuICAgICAgPC9Qb3BwZXI+XG4gICAgPC9CdXR0b24+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBTaWduZXJTZXNzaW9uLCBUb3RwQ2hhbGxlbmdlIH0gZnJvbSAnQGN1YmlzdC1sYWJzL2N1YmVzaWduZXItc2RrJztcbmltcG9ydCB7XG4gIFNlZWRsZXNzUmVnaXN0YXJ0aW9uUmVzdWx0LFxuICBhcHByb3ZlU2VlZGxlc3NSZWdpc3RyYXRpb24sXG59IGZyb20gJy4uL3V0aWxzL2FwcHJvdmVTZWVkbGVzc1JlZ2lzdHJhdGlvbic7XG5pbXBvcnQgeyB0b2FzdCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VPbmJvYXJkaW5nQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvT25ib2FyZGluZ1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IE9uYm9hcmRpbmdVUkxzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL29uYm9hcmRpbmcvbW9kZWxzJztcbmltcG9ydCB7XG4gIHJlcXVlc3RPaWRjQXV0aCxcbiAgZ2V0T2lkY0NsaWVudCxcbiAgZ2V0T3JnSWQsXG4gIGdldFNpZ25lclNlc3Npb24sXG59IGZyb20gJ0BzcmMvdXRpbHMvc2VlZGxlc3MvZ2V0Q3ViZVNpZ25lcic7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgRGlzcGF0Y2gsXG4gIFNldFN0YXRlQWN0aW9uLFxuICB1c2VDYWxsYmFjayxcbiAgdXNlRWZmZWN0LFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgU2VlZGxlc3NBdXRoUHJvdmlkZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L21vZGVscyc7XG5pbXBvcnQgeyBnZXRTaWduZXJUb2tlbiB9IGZyb20gJ0BzcmMvdXRpbHMvc2VlZGxlc3MvZ2V0U2lnbmVyVG9rZW4nO1xuaW1wb3J0IHsgUmVjb3ZlcnlNZXRob2RUeXBlcyB9IGZyb20gJy4uL3BhZ2VzL1NlZWRsZXNzL21vZGVscyc7XG5pbXBvcnQgeyBsYXVuY2hGaWRvRmxvdyB9IGZyb20gJ0BzcmMvdXRpbHMvc2VlZGxlc3MvZmlkby9sYXVuY2hGaWRvRmxvdyc7XG5pbXBvcnQgeyBGSURPQXBpRW5kcG9pbnQsIEtleVR5cGUgfSBmcm9tICdAc3JjL3V0aWxzL3NlZWRsZXNzL2ZpZG8vdHlwZXMnO1xuaW1wb3J0IHsgdXNlRmVhdHVyZUZsYWdDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9GZWF0dXJlRmxhZ3NQcm92aWRlcic7XG5pbXBvcnQgeyBGZWF0dXJlR2F0ZXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmVhdHVyZUZsYWdzL21vZGVscyc7XG5cbnR5cGUgT2lkY1Rva2VuR2V0dGVyID0gKCkgPT4gUHJvbWlzZTxzdHJpbmc+O1xudHlwZSBHZXRBdXRoQnV0dG9uQ2FsbGJhY2tPcHRpb25zID0ge1xuICBzZXRJc0xvYWRpbmc6IERpc3BhdGNoPFNldFN0YXRlQWN0aW9uPGJvb2xlYW4+PjtcbiAgZ2V0T2lkY1Rva2VuOiBPaWRjVG9rZW5HZXR0ZXI7XG4gIHByb3ZpZGVyOiBTZWVkbGVzc0F1dGhQcm92aWRlcjtcbn07XG5cbmNvbnN0IFRPVFBfSVNTVUVSOiBzdHJpbmcgPSAnQ29yZSc7XG5cbmNvbnN0IHJlY292ZXJ5TWV0aG9kVG9GaWRvS2V5VHlwZSA9IChtZXRob2Q6IFJlY292ZXJ5TWV0aG9kVHlwZXMpOiBLZXlUeXBlID0+IHtcbiAgc3dpdGNoIChtZXRob2QpIHtcbiAgICBjYXNlIFJlY292ZXJ5TWV0aG9kVHlwZXMuUEFTU0tFWTpcbiAgICAgIHJldHVybiBLZXlUeXBlLlBhc3NrZXk7XG5cbiAgICBjYXNlIFJlY292ZXJ5TWV0aG9kVHlwZXMuWVVCSUtFWTpcbiAgICAgIHJldHVybiBLZXlUeXBlLll1YmlrZXk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBGSURPIGRldmljZScpO1xuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlU2VlZGxlc3NBY3Rpb25zKCkge1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3Qge1xuICAgIHNldE9pZGNUb2tlbixcbiAgICBzZXRTZWVkbGVzc1NpZ25lclRva2VuLFxuICAgIG9pZGNUb2tlbixcbiAgICBzZXRVc2VySWQsXG4gICAgc2V0SXNTZWVkbGVzc01mYVJlcXVpcmVkLFxuICAgIHNldE5ld3NsZXR0ZXJFbWFpbCxcbiAgfSA9IHVzZU9uYm9hcmRpbmdDb250ZXh0KCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgW3RvdHBDaGFsbGVuZ2UsIHNldFRvdHBDaGFsbGVuZ2VdID0gdXNlU3RhdGU8VG90cENoYWxsZW5nZT4oKTtcbiAgY29uc3QgW21mYVNlc3Npb24sIHNldE1mYVNlc3Npb25dID0gdXNlU3RhdGU8U2lnbmVyU2Vzc2lvbiB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbZXJyb3JNZXNzYWdlLCBzZXRFcnJvck1lc3NhZ2VdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCB7IGZlYXR1cmVGbGFncyB9ID0gdXNlRmVhdHVyZUZsYWdDb250ZXh0KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWVycm9yTWVzc2FnZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0b2FzdC5lcnJvcihlcnJvck1lc3NhZ2UpO1xuICB9LCBbZXJyb3JNZXNzYWdlXSk7XG5cbiAgY29uc3QgaGFuZGxlT2lkY1Rva2VuID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKGlkVG9rZW4pID0+IHtcbiAgICAgIHNldE9pZGNUb2tlbihpZFRva2VuKTtcblxuICAgICAgY29uc3Qgb2lkY0NsaWVudCA9IGdldE9pZGNDbGllbnQoaWRUb2tlbik7XG4gICAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IG9pZGNDbGllbnQuaWRlbnRpdHlQcm92ZSgpO1xuXG4gICAgICBpZiAoIWlkZW50aXR5LnVzZXJfaW5mbykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhcHByb3ZlU2VlZGxlc3NSZWdpc3RyYXRpb24oXG4gICAgICAgICAgaWRlbnRpdHksXG4gICAgICAgICAgIWZlYXR1cmVGbGFnc1tGZWF0dXJlR2F0ZXMuU0VFRExFU1NfT1BUSU9OQUxfTUZBXSxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAocmVzdWx0ICE9PSBTZWVkbGVzc1JlZ2lzdGFydGlvblJlc3VsdC5BUFBST1ZFRCkge1xuICAgICAgICAgIHRvYXN0LmVycm9yKHQoJ1NlZWRsZXNzIGxvZ2luIGVycm9yJykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgdGhlIHVzZXIgYWxyZWFkeSBoYXMgYW4gYWNjb3VudCwgaXQncyBwb3NzaWJsZSB0aGF0IHRoZVxuICAgICAgICAvLyBhY2NvdW50IHdhcyBjcmVhdGVkIGJlZm9yZSB3ZSBtYWRlIE1GQSBvcHRpb25hbCwgYnV0IHRoZSB1c2VyXG4gICAgICAgIC8vIHRoZW4gcmVzaWduZWQgZnJvbSBmb2xsb3dpbmcgdGhyb3VnaCAoZS5nLiBkaWRuJ3Qga25vdyBob3cgdG9cbiAgICAgICAgLy8gdXNlIE1GQSB5ZXQpLiBTbyBub3cgd2UncmUgaW4gYSBzaXR1YXRpb24gd2hlcmUgd2UgbmVlZCB0byB1c2VcbiAgICAgICAgLy8gdGhlIHVzZXIncyBPSURDIHRva2VuIHRvIGdldCB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlaXJcbiAgICAgICAgLy8gQ3ViZVNpZ25lciBhY2NvdW50IGFuZCBzZWUgaWYgaXQgaGFzIGFuIE1GQSBwb2xpY3kgc2V0LlxuICAgICAgICBjb25zdCBvaWRjQXV0aCA9IGF3YWl0IHJlcXVlc3RPaWRjQXV0aChpZFRva2VuKTtcbiAgICAgICAgY29uc3QgbWZhU2Vzc2lvbkluZm8gPSBvaWRjQXV0aC5tZmFTZXNzaW9uSW5mbygpO1xuXG4gICAgICAgIC8vIFdlIHNldCB0aGUgcG9saWN5IHRvIHVuZGVmaW5lZCB3aGVuIE1GQSBpcyBvcHRpb25hbC5cbiAgICAgICAgc2V0SXNTZWVkbGVzc01mYVJlcXVpcmVkKHR5cGVvZiBtZmFTZXNzaW9uSW5mbyAhPT0gJ3VuZGVmaW5lZCcpO1xuICAgICAgfVxuXG4gICAgICBzZXRVc2VySWQoaWRlbnRpdHkuaWRlbnRpdHk/LnN1Yik7XG4gICAgICBzZXROZXdzbGV0dGVyRW1haWwoaWRlbnRpdHkuZW1haWwgPz8gJycpO1xuXG4gICAgICBpZiAoKGlkZW50aXR5LnVzZXJfaW5mbz8uY29uZmlndXJlZF9tZmEgPz8gW10pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuUkVDT1ZFUllfTUVUSE9EUyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuUkVDT1ZFUllfTUVUSE9EU19MT0dJTik7XG4gICAgICB9XG4gICAgfSxcbiAgICBbXG4gICAgICBzZXRPaWRjVG9rZW4sXG4gICAgICBzZXRVc2VySWQsXG4gICAgICBzZXRJc1NlZWRsZXNzTWZhUmVxdWlyZWQsXG4gICAgICBzZXROZXdzbGV0dGVyRW1haWwsXG4gICAgICB0LFxuICAgICAgaGlzdG9yeSxcbiAgICAgIGZlYXR1cmVGbGFncyxcbiAgICBdLFxuICApO1xuXG4gIGNvbnN0IHNpZ25JbiA9IHVzZUNhbGxiYWNrKFxuICAgICh7XG4gICAgICBzZXRJc0xvYWRpbmcsXG4gICAgICBnZXRPaWRjVG9rZW4sXG4gICAgICBwcm92aWRlcixcbiAgICB9OiBHZXRBdXRoQnV0dG9uQ2FsbGJhY2tPcHRpb25zKSA9PiB7XG4gICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgICBnZXRPaWRjVG9rZW4oKVxuICAgICAgICAudGhlbihoYW5kbGVPaWRjVG9rZW4pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgY2FwdHVyZSgnU2VlZGxlc3NTaWduSW5GYWlsZWQnLCB7IHByb3ZpZGVyIH0pO1xuICAgICAgICAgIHRvYXN0LmVycm9yKHQoJ1NlZWRsZXNzIGxvZ2luIGVycm9yJykpO1xuICAgICAgICB9KVxuICAgICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBbY2FwdHVyZSwgaGFuZGxlT2lkY1Rva2VuLCB0XSxcbiAgKTtcblxuICBjb25zdCByZWdpc3RlclRPVFBTdGFydCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoIW9pZGNUb2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXF1ZXN0T2lkY0F1dGgob2lkY1Rva2VuKVxuICAgICAgLnRoZW4oYXN5bmMgKGMpID0+IHtcbiAgICAgICAgY29uc3QgbWZhU2Vzc2lvbkluZm8gPSBjLnJlcXVpcmVzTWZhKCkgPyBjLm1mYVNlc3Npb25JbmZvKCkgOiBjLmRhdGEoKTtcbiAgICAgICAgaWYgKCFtZmFTZXNzaW9uSW5mbykge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIE1GQSBpbmZvJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNpZ25lclNlc3Npb24gPSBhd2FpdCBnZXRTaWduZXJTZXNzaW9uKG1mYVNlc3Npb25JbmZvKTtcbiAgICAgICAgc2V0TWZhU2Vzc2lvbihzaWduZXJTZXNzaW9uKTtcbiAgICAgICAgc2lnbmVyU2Vzc2lvblxuICAgICAgICAgIC5yZXNldFRvdHBTdGFydChUT1RQX0lTU1VFUilcbiAgICAgICAgICAudGhlbigoY2hhbGxlbmdlKSA9PiB7XG4gICAgICAgICAgICBzZXRUb3RwQ2hhbGxlbmdlKGNoYWxsZW5nZS5kYXRhKCkpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgdG9hc3QodCgnVW5hYmxlIHRvIHNldCBUT1RQIGNvbmZpZ3VyYXRpb24nKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICBjYXB0dXJlKCdTZWVkbGVzc1JlZ2lzdGVyVE9UUFN0YXJ0RmFpbGVkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICB9LCBbY2FwdHVyZSwgb2lkY1Rva2VuLCB0XSk7XG5cbiAgY29uc3QgdmVyaWZ5UmVnaXN0cmF0aW9uQ29kZSA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChjb2RlOiBzdHJpbmcpID0+IHtcbiAgICAgIHNldEVycm9yTWVzc2FnZSgnJyk7XG4gICAgICBpZiAoIXRvdHBDaGFsbGVuZ2UgfHwgIW1mYVNlc3Npb24gfHwgY29kZS5sZW5ndGggPCA2IHx8ICFvaWRjVG9rZW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgbWZhU2Vzc2lvbi5yZXNldFRvdHBDb21wbGV0ZSh0b3RwQ2hhbGxlbmdlLnRvdHBJZCwgY29kZSk7XG4gICAgICAgIC8vIGF0dGVtcHQgdG8gcmV1c2UgdGhlIGNvZGUgcXVpY2tseVxuICAgICAgICBjb25zdCBjID0gYXdhaXQgcmVxdWVzdE9pZGNBdXRoKG9pZGNUb2tlbik7XG4gICAgICAgIGlmICghYy5yZXF1aXJlc01mYSgpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNRkEgc2V0dXAgZmFpbGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBtZmFTZXNzaW9uLnRvdHBBcHByb3ZlKGMubWZhSWQoKSwgY29kZSk7XG5cbiAgICAgICAgaWYgKCFzdGF0dXMucmVjZWlwdD8uY29uZmlybWF0aW9uKSB7XG4gICAgICAgICAgc2V0RXJyb3JNZXNzYWdlKHQoJ0NvZGUgdmVyaWZpY2F0aW9uIGVycm9yJykpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9pZGNBdXRoUmVzcG9uc2UgPSBhd2FpdCByZXF1ZXN0T2lkY0F1dGgob2lkY1Rva2VuLCB7XG4gICAgICAgICAgbWZhT3JnSWQ6IGdldE9yZ0lkKCksXG4gICAgICAgICAgbWZhSWQ6IGMubWZhSWQoKSxcbiAgICAgICAgICBtZmFDb25mOiBzdGF0dXMucmVjZWlwdC5jb25maXJtYXRpb24sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNpZ25lclRva2VuID0gb2lkY0F1dGhSZXNwb25zZS5kYXRhKCk7XG4gICAgICAgIHNldFNlZWRsZXNzU2lnbmVyVG9rZW4oc2lnbmVyVG9rZW4pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICAgICAgc2V0RXJyb3JNZXNzYWdlKHQoJ0ludmFsaWQgY29kZScpKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG4gICAgW29pZGNUb2tlbiwgc2V0U2VlZGxlc3NTaWduZXJUb2tlbiwgdCwgdG90cENoYWxsZW5nZSwgbWZhU2Vzc2lvbl0sXG4gICk7XG5cbiAgY29uc3QgbG9naW5XaXRoRklETyA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoIW9pZGNUb2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgcmVzcCA9IGF3YWl0IHJlcXVlc3RPaWRjQXV0aChvaWRjVG9rZW4pO1xuICAgIGlmIChyZXNwLnJlcXVpcmVzTWZhKCkpIHtcbiAgICAgIGNvbnN0IG1mYVNlc3Npb25JbmZvID0gcmVzcC5tZmFTZXNzaW9uSW5mbygpO1xuICAgICAgaWYgKCFtZmFTZXNzaW9uSW5mbykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zdCBzaWduZXJTZXNzaW9uID0gYXdhaXQgZ2V0U2lnbmVyU2Vzc2lvbihtZmFTZXNzaW9uSW5mbyk7XG4gICAgICBjb25zdCByZXNwb25kTWZhSWQgPSByZXNwLm1mYUlkKCk7XG5cbiAgICAgIGNvbnN0IGNoYWxsZW5nZSA9IGF3YWl0IHNpZ25lclNlc3Npb24uZmlkb0FwcHJvdmVTdGFydChyZXNwb25kTWZhSWQpO1xuXG4gICAgICAvLyBwcm9tcHQgdGhlIHVzZXIgdG8gdGFwIHRoZWlyIEZJRE8gYW5kIHNlbmQgdGhlIGFuc3dlciBiYWNrIHRvIEN1YmVTaWduZXJcbiAgICAgIGNvbnN0IGFuc3dlciA9IGF3YWl0IGxhdW5jaEZpZG9GbG93KFxuICAgICAgICBGSURPQXBpRW5kcG9pbnQuQXV0aGVudGljYXRlLFxuICAgICAgICBjaGFsbGVuZ2Uub3B0aW9ucyxcbiAgICAgICk7XG4gICAgICBjb25zdCBtZmFJbmZvID0gYXdhaXQgY2hhbGxlbmdlLmFuc3dlcihhbnN3ZXIpO1xuXG4gICAgICAvLyBwcmludCBvdXQgdGhlIGN1cnJlbnQgc3RhdHVzIG9mIHRoZSBNRkEgcmVxdWVzdCBhbmQgYXNzZXJ0IHRoYXQgaXQgaGFzIGJlZW4gYXBwcm92ZWRcbiAgICAgIGlmICghbWZhSW5mby5yZWNlaXB0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTUZBIG5vdCBhcHByb3ZlZCB5ZXQnKTtcbiAgICAgIH1cblxuICAgICAgLy8gcHJvY2VlZCB3aXRoIHRoZSBNRkEgYXBwcm92YWxcbiAgICAgIHJlc3AgPSBhd2FpdCByZXNwLnNpZ25XaXRoTWZhQXBwcm92YWwoe1xuICAgICAgICBtZmFJZDogcmVzcG9uZE1mYUlkLFxuICAgICAgICBtZmFPcmdJZDogcHJvY2Vzcy5lbnYuU0VFRExFU1NfT1JHX0lEIHx8ICcnLFxuICAgICAgICBtZmFDb25mOiBtZmFJbmZvLnJlY2VpcHQuY29uZmlybWF0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChyZXNwLnJlcXVpcmVzTWZhKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTUZBIHNob3VsZCBub3QgYmUgcmVxdWlyZWQgYWZ0ZXIgYXBwcm92YWwnKTtcbiAgICB9XG4gICAgc2V0U2VlZGxlc3NTaWduZXJUb2tlbihhd2FpdCBnZXRTaWduZXJUb2tlbihyZXNwKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sIFtvaWRjVG9rZW4sIHNldFNlZWRsZXNzU2lnbmVyVG9rZW5dKTtcblxuICBjb25zdCBsb2dpbldpdGhvdXRNRkEgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFvaWRjVG9rZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gdG9rZW4gdG8gbG9nIGluJyk7XG4gICAgfVxuICAgIGNvbnN0IGF1dGhSZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RPaWRjQXV0aChvaWRjVG9rZW4pO1xuICAgIGNvbnN0IHNpZ25lclRva2VuID0gYXdhaXQgZ2V0U2lnbmVyVG9rZW4oYXV0aFJlc3BvbnNlKTtcbiAgICBzZXRTZWVkbGVzc1NpZ25lclRva2VuKHNpZ25lclRva2VuKTtcbiAgfTtcblxuICBjb25zdCBhZGRGSURPRGV2aWNlID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKG5hbWU6IHN0cmluZywgc2VsZWN0ZWRNZXRob2Q6IFJlY292ZXJ5TWV0aG9kVHlwZXMpID0+IHtcbiAgICAgIGlmICghb2lkY1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxvZ2luUmVzcCA9IGF3YWl0IHJlcXVlc3RPaWRjQXV0aChvaWRjVG9rZW4pO1xuXG4gICAgICBjb25zdCBtZmFTZXNzaW9uSW5mbyA9IGxvZ2luUmVzcC5yZXF1aXJlc01mYSgpXG4gICAgICAgID8gbG9naW5SZXNwLm1mYVNlc3Npb25JbmZvKClcbiAgICAgICAgOiBsb2dpblJlc3AuZGF0YSgpO1xuXG4gICAgICBpZiAoIW1mYVNlc3Npb25JbmZvKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIE1GQSBpbmZvJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNpZ25lclNlc3Npb24obWZhU2Vzc2lvbkluZm8pO1xuICAgICAgY29uc3QgYWRkRmlkb1Jlc3AgPSBhd2FpdCBzZXNzaW9uLmFkZEZpZG9TdGFydChuYW1lKTtcbiAgICAgIGNvbnN0IGNoYWxsZW5nZSA9IGFkZEZpZG9SZXNwLmRhdGEoKTtcbiAgICAgIGlmIChcbiAgICAgICAgc2VsZWN0ZWRNZXRob2QgPT09IFJlY292ZXJ5TWV0aG9kVHlwZXMuUEFTU0tFWSAmJlxuICAgICAgICAoYXdhaXQgUHVibGljS2V5Q3JlZGVudGlhbD8uaXNVc2VyVmVyaWZ5aW5nUGxhdGZvcm1BdXRoZW50aWNhdG9yQXZhaWxhYmxlKCkpXG4gICAgICApIHtcbiAgICAgICAgY2hhbGxlbmdlLm9wdGlvbnMuYXV0aGVudGljYXRvclNlbGVjdGlvbiA9IHtcbiAgICAgICAgICBhdXRoZW50aWNhdG9yQXR0YWNobWVudDogJ3BsYXRmb3JtJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYW5zd2VyID0gYXdhaXQgbGF1bmNoRmlkb0Zsb3coXG4gICAgICAgIEZJRE9BcGlFbmRwb2ludC5SZWdpc3RlcixcbiAgICAgICAgY2hhbGxlbmdlLm9wdGlvbnMsXG4gICAgICAgIHJlY292ZXJ5TWV0aG9kVG9GaWRvS2V5VHlwZShzZWxlY3RlZE1ldGhvZCksXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBjaGFsbGVuZ2UuYW5zd2VyKGFuc3dlcik7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgW29pZGNUb2tlbl0sXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBzaWduSW4sXG4gICAgcmVnaXN0ZXJUT1RQU3RhcnQsXG4gICAgdG90cENoYWxsZW5nZSxcbiAgICB2ZXJpZnlSZWdpc3RyYXRpb25Db2RlLFxuICAgIGFkZEZJRE9EZXZpY2UsXG4gICAgbG9naW5XaXRoRklETyxcbiAgICBsb2dpbldpdGhvdXRNRkEsXG4gIH07XG59XG4iLCJpbXBvcnQgeyB1c2VPbmJvYXJkaW5nQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvT25ib2FyZGluZ1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIE9uYm9hcmRpbmdVUkxzLFxuICBPbmJvYXJkaW5nUGhhc2UsXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9vbmJvYXJkaW5nL21vZGVscyc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEFpcmRyb3BJY29uLFxuICBCdXR0b24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUGFnZU5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvUGFnZU5hdic7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IHsgVmVyaWZ5R29CYWNrTW9kYWwgfSBmcm9tICcuL1NlZWRsZXNzL21vZGFscy9WZXJpZnlHb0JhY2tNb2RhbCc7XG5cbmV4cG9ydCBjb25zdCBBbmFseXRpY3NDb25zZW50ID0gKCkgPT4ge1xuICBjb25zdCB7XG4gICAgc2V0QW5hbHl0aWNzQ29uc2VudCxcbiAgICBzdWJtaXQsXG4gICAgb25ib2FyZGluZ1BoYXNlLFxuICAgIGFuYWx5dGljc0NvbnNlbnQsXG4gICAgbmV3c2xldHRlckVtYWlsLFxuICAgIGlzTmV3c2xldHRlckVuYWJsZWQsXG4gIH0gPSB1c2VPbmJvYXJkaW5nQ29udGV4dCgpO1xuICBjb25zdCB7IGNhcHR1cmUsIHN0b3BEYXRhQ29sbGVjdGlvbiB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IFtpc1ZlcmlmeUdvQmFja01vZGFsT3Blbiwgc2V0SXNWZXJpZnlHb0JhY2tNb2RhbE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGdldFN0ZXBzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKG9uYm9hcmRpbmdQaGFzZSA9PT0gT25ib2FyZGluZ1BoYXNlLklNUE9SVF9XQUxMRVQpIHtcbiAgICAgIHJldHVybiB7IHN0ZXBzTnVtYmVyOiAzLCBhY3RpdmVTdGVwOiAyIH07XG4gICAgfVxuICAgIGlmIChvbmJvYXJkaW5nUGhhc2UgPT09IE9uYm9hcmRpbmdQaGFzZS5LRVlTVE9ORSkge1xuICAgICAgcmV0dXJuIHsgc3RlcHNOdW1iZXI6IDYsIGFjdGl2ZVN0ZXA6IDUgfTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgb25ib2FyZGluZ1BoYXNlID09PSBPbmJvYXJkaW5nUGhhc2UuU0VFRExFU1NfR09PR0xFIHx8XG4gICAgICBvbmJvYXJkaW5nUGhhc2UgPT09IE9uYm9hcmRpbmdQaGFzZS5TRUVETEVTU19BUFBMRVxuICAgICkge1xuICAgICAgcmV0dXJuIHsgc3RlcHNOdW1iZXI6IDMsIGFjdGl2ZVN0ZXA6IDIgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc3RlcHNOdW1iZXI6IDQsIGFjdGl2ZVN0ZXA6IDMgfTtcbiAgfSwgW29uYm9hcmRpbmdQaGFzZV0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvbmJvYXJkaW5nUGhhc2UpIHtcbiAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5PTkJPQVJESU5HX0hPTUUpO1xuICAgIH1cbiAgICBjYXB0dXJlKE9uYm9hcmRpbmdQaGFzZS5BTkFMWVRJQ1NfQ09OU0VOVCk7XG4gIH0sIFtjYXB0dXJlLCBoaXN0b3J5LCBvbmJvYXJkaW5nUGhhc2VdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhbmFseXRpY3NDb25zZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb3JlV2ViTGluayA9IGAke3Byb2Nlc3MuZW52LkNPUkVfV0VCX0JBU0VfVVJMfS9kaXNjb3Zlci8/bmV3VXNlcj0xYDtcblxuICAgIC8vIHN1Ym1pdCBoYW5kbGVyIGNhbid0IGJlIGluIHRoZSBvbk5leHQgYW5kIG9uQmFjayBjYWxsYmFja3Mgc2luY2UgaXQgd291bGQgcnVuIGluIGEgc3RhbGUgY2xvc3VyZVxuICAgIC8vIHJlc3VsdGluZyBpbiBhbiBhbHdheXMgZmFsc2UgYW5hbHl0aWNzIGNvbnNlbnRcbiAgICBzdWJtaXQoYXN5bmMgKCkgPT5cbiAgICAgIGNvcmVXZWJMaW5rID8gd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY29yZVdlYkxpbmspIDogd2luZG93LmNsb3NlKCksXG4gICAgKTtcbiAgfSwgW1xuICAgIGFuYWx5dGljc0NvbnNlbnQsXG4gICAgb25ib2FyZGluZ1BoYXNlLFxuICAgIHN1Ym1pdCxcbiAgICBuZXdzbGV0dGVyRW1haWwsXG4gICAgY2FwdHVyZSxcbiAgICBpc05ld3NsZXR0ZXJFbmFibGVkLFxuICBdKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6ICc0NjVweCcsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBtdDogNCxcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgIGdhcDogNCxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAyIH19PlxuICAgICAgICAgIDxBaXJkcm9wSWNvbiBzaXplPXs2NH0gLz5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDNcIj57dCgnVW5sb2NrIEFpcmRyb3BzJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2sgc3g9e3sgbWI6IDQsIGdhcDogMyB9fT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgIDxUcmFuc1xuICAgICAgICAgICAgICBpMThuS2V5PVwiQXMgYSBDb3JlIHVzZXIsIHlvdSBoYXZlIHRoZSBvcHRpb24gdG8gb3B0LWluIGZvciA8Yj5haXJkcm9wIHJld2FyZHM8L2I+IGJhc2VkIG9uIHlvdXIgYWN0aXZpdHkgYW5kIGVuZ2FnZW1lbnQuIENvcmUgd2lsbCBjb2xsZWN0IGFub255bW91cyBpbnRlcmFjdGlvbiBkYXRhIHRvIHBvd2VyIHRoaXMgZmVhdHVyZS5cIlxuICAgICAgICAgICAgICBjb21wb25lbnRzPXt7XG4gICAgICAgICAgICAgICAgYjogPGIgLz4sXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgIDxUcmFuc1xuICAgICAgICAgICAgICBpMThuS2V5PVwiQ29yZSBpcyBjb21taXR0ZWQgdG8gcHJvdGVjdGluZyB5b3VyIHByaXZhY3kuIFdlIHdpbGwgPGI+bmV2ZXI8L2I+IHNlbGwgb3Igc2hhcmUgeW91ciBkYXRhLiBJZiB5b3Ugd2lzaCwgeW91IGNhbiBkaXNhYmxlIHRoaXMgYXQgYW55IHRpbWUgaW4gdGhlIHNldHRpbmdzIG1lbnUuXCJcbiAgICAgICAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgICAgICAgIGI6IDxiIC8+LFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuXG4gICAgICA8UGFnZU5hdlxuICAgICAgICBvbkJhY2s9eygpID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBvbmJvYXJkaW5nUGhhc2UgPT09IE9uYm9hcmRpbmdQaGFzZS5TRUVETEVTU19HT09HTEUgfHxcbiAgICAgICAgICAgIG9uYm9hcmRpbmdQaGFzZSA9PT0gT25ib2FyZGluZ1BoYXNlLlNFRURMRVNTX0FQUExFXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBzZXRJc1ZlcmlmeUdvQmFja01vZGFsT3Blbih0cnVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaGlzdG9yeS5nb0JhY2soKTtcbiAgICAgICAgfX1cbiAgICAgICAgYmFja1RleHQ9e3QoJ0JhY2snKX1cbiAgICAgICAgb25OZXh0PXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgY2FwdHVyZSgnT25ib2FyZGluZ0FuYWx5dGljc0FjY2VwdGVkJyk7XG4gICAgICAgICAgc2V0QW5hbHl0aWNzQ29uc2VudCh0cnVlKTtcbiAgICAgICAgfX1cbiAgICAgICAgbmV4dFRleHQ9e3QoJ1VubG9jaycpfVxuICAgICAgICBkaXNhYmxlTmV4dD17ZmFsc2V9XG4gICAgICAgIGV4cGFuZFxuICAgICAgICBzdGVwcz17Z2V0U3RlcHMuc3RlcHNOdW1iZXJ9XG4gICAgICAgIGFjdGl2ZVN0ZXA9e2dldFN0ZXBzLmFjdGl2ZVN0ZXB9XG4gICAgICA+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgb25DbGljaz17YXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY2FwdHVyZSgnT25ib2FyZGluZ0FuYWx5dGljc1JlamVjdGVkJyk7XG4gICAgICAgICAgICBzdG9wRGF0YUNvbGxlY3Rpb24oKTtcbiAgICAgICAgICAgIHNldEFuYWx5dGljc0NvbnNlbnQoZmFsc2UpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgZGlzYWJsZVJpcHBsZVxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBjb2xvcjogJ3NlY29uZGFyeScsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgbWw6IDEgfX0+XG4gICAgICAgICAgICB7dCgnTm8gVGhhbmtzJyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvUGFnZU5hdj5cbiAgICAgIDxWZXJpZnlHb0JhY2tNb2RhbFxuICAgICAgICBpc09wZW49e2lzVmVyaWZ5R29CYWNrTW9kYWxPcGVufVxuICAgICAgICBvbkJhY2s9eygpID0+IHtcbiAgICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuT05CT0FSRElOR19IT01FKTtcbiAgICAgICAgICBzZXRJc1ZlcmlmeUdvQmFja01vZGFsT3BlbihmYWxzZSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uQ2FuY2VsPXsoKSA9PiB7XG4gICAgICAgICAgc2V0SXNWZXJpZnlHb0JhY2tNb2RhbE9wZW4oZmFsc2UpO1xuICAgICAgICB9fVxuICAgICAgLz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VPbmJvYXJkaW5nQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvT25ib2FyZGluZ1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIE9uYm9hcmRpbmdQaGFzZSxcbiAgT25ib2FyZGluZ1VSTHMsXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9vbmJvYXJkaW5nL21vZGVscyc7XG5pbXBvcnQgeyBPbmJvYXJkaW5nU3RlcEhlYWRlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvT25ib2FyZGluZ1N0ZXBIZWFkZXInO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBDaGVja0ljb24sXG4gIENoZWNrYm94LFxuICBEaXZpZGVyLFxuICBJbnB1dEFkb3JubWVudCxcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgVHlwb2dyYXBoeSxcbiAgWEljb24sXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUGFnZU5hdiB9IGZyb20gJy4uL2NvbXBvbmVudHMvUGFnZU5hdic7XG5pbXBvcnQgeyBQYXNzd29yZFN0cmVuZ3RoIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9QYXNzd29yZFN0cmVuZ3RoJztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IFR5cG9ncmFwaHlMaW5rIH0gZnJvbSAnLi4vY29tcG9uZW50cy9UeXBvZ3JhcGh5TGluayc7XG5cbmltcG9ydCB7IFZlcmlmeUdvQmFja01vZGFsIH0gZnJvbSAnLi9TZWVkbGVzcy9tb2RhbHMvVmVyaWZ5R29CYWNrTW9kYWwnO1xuaW1wb3J0IHsgV2FsbGV0VHlwZSB9IGZyb20gJ0BhdmFsYWJzL3R5cGVzJztcbmltcG9ydCBKb2kgZnJvbSAnam9pJztcbmltcG9ydCB7IGlzTmV3c2xldHRlckNvbmZpZ3VyZWQgfSBmcm9tICdAc3JjL3V0aWxzL25ld3NsZXR0ZXInO1xuXG5lbnVtIEVtYWlsVmFsaWRhdGlvblJlc3VsdCB7XG4gIFVuZGV0ZXJtaW5lZCxcbiAgVmFsaWQsXG4gIEludmFsaWQsXG59XG5cbmNvbnN0IHZhbGlkYXRlRW1haWwgPSAoZW1haWw6IHN0cmluZykgPT4ge1xuICBjb25zdCB7IGVycm9yIH0gPSBKb2kuc3RyaW5nKCkuZW1haWwoKS52YWxpZGF0ZShlbWFpbCk7XG5cbiAgcmV0dXJuIGVycm9yID8gRW1haWxWYWxpZGF0aW9uUmVzdWx0LkludmFsaWQgOiBFbWFpbFZhbGlkYXRpb25SZXN1bHQuVmFsaWQ7XG59O1xuXG5leHBvcnQgY29uc3QgQ3JlYXRlUGFzc3dvcmQgPSAoKSA9PiB7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7XG4gICAgc2V0UGFzc3dvcmRBbmROYW1lcyxcbiAgICBvbmJvYXJkaW5nUGhhc2UsXG4gICAgaXNOZXdzbGV0dGVyRW5hYmxlZCxcbiAgICBzZXRJc05ld3NsZXR0ZXJFbmFibGVkLFxuICAgIG5ld3NsZXR0ZXJFbWFpbCxcbiAgICBzZXROZXdzbGV0dGVyRW1haWwsXG4gICAgb25ib2FyZGluZ1dhbGxldFR5cGUsXG4gIH0gPSB1c2VPbmJvYXJkaW5nQ29udGV4dCgpO1xuICBjb25zdCBbd2FsbGV0TmFtZSwgc2V0V2FsbGV0TmFtZV0gPSB1c2VTdGF0ZTxzdHJpbmc+KCk7XG4gIGNvbnN0IFtwYXNzd29yZCwgc2V0UGFzc3dvcmRdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG4gIGNvbnN0IFtjb25maXJtUGFzc3dvcmRWYWwsIHNldENvbmZpcm1QYXNzd29yZFZhbF0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcbiAgY29uc3QgW3Rlcm1BbmRQb2xpY3lDaGVja2VkLCBzZXRUZXJtQW5kUG9saWN5Q2hlY2tlZF0gPVxuICAgIHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcblxuICBjb25zdCBbaXNQYXNzd29yZElucHV0RmlsbGVkLCBzZXRJc1Bhc3N3b3JkSW5wdXRGaWxsZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgW25ld1Bhc3N3b3JkU3RyZW5ndGgsIHNldE5ld1Bhc3N3b3JkU3RyZW5ndGhdID0gdXNlU3RhdGU8bnVtYmVyPigwKTtcbiAgY29uc3QgW2lzVmVyaWZ5R29CYWNrTW9kYWxPcGVuLCBzZXRJc1ZlcmlmeUdvQmFja01vZGFsT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgW2VtYWlsVmFsaWRhdGlvblJlc3VsdCwgc2V0RW1haWxWYWxpZGF0aW9uUmVzdWx0XSA9IHVzZVN0YXRlKFxuICAgIG9uYm9hcmRpbmdXYWxsZXRUeXBlID09PSBXYWxsZXRUeXBlLlNlZWRsZXNzXG4gICAgICA/IEVtYWlsVmFsaWRhdGlvblJlc3VsdC5WYWxpZFxuICAgICAgOiBuZXdzbGV0dGVyRW1haWxcbiAgICAgICAgPyB2YWxpZGF0ZUVtYWlsKG5ld3NsZXR0ZXJFbWFpbClcbiAgICAgICAgOiBFbWFpbFZhbGlkYXRpb25SZXN1bHQuVW5kZXRlcm1pbmVkLFxuICApO1xuXG4gIGNvbnN0IGdldFN0ZXBzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKG9uYm9hcmRpbmdQaGFzZSA9PT0gT25ib2FyZGluZ1BoYXNlLklNUE9SVF9XQUxMRVQpIHtcbiAgICAgIHJldHVybiB7IHN0ZXBzTnVtYmVyOiAzLCBhY3RpdmVTdGVwOiAxIH07XG4gICAgfVxuICAgIGlmIChvbmJvYXJkaW5nUGhhc2UgPT09IE9uYm9hcmRpbmdQaGFzZS5LRVlTVE9ORSkge1xuICAgICAgcmV0dXJuIHsgc3RlcHNOdW1iZXI6IDYsIGFjdGl2ZVN0ZXA6IDQgfTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgb25ib2FyZGluZ1BoYXNlID09PSBPbmJvYXJkaW5nUGhhc2UuU0VFRExFU1NfR09PR0xFIHx8XG4gICAgICBvbmJvYXJkaW5nUGhhc2UgPT09IE9uYm9hcmRpbmdQaGFzZS5TRUVETEVTU19BUFBMRVxuICAgICkge1xuICAgICAgcmV0dXJuIHsgc3RlcHNOdW1iZXI6IDMsIGFjdGl2ZVN0ZXA6IDEgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc3RlcHNOdW1iZXI6IDQsIGFjdGl2ZVN0ZXA6IDIgfTtcbiAgfSwgW29uYm9hcmRpbmdQaGFzZV0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvbmJvYXJkaW5nUGhhc2UpIHtcbiAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5PTkJPQVJESU5HX0hPTUUpO1xuICAgIH1cbiAgICBjYXB0dXJlKE9uYm9hcmRpbmdQaGFzZS5QQVNTV09SRCk7XG4gIH0sIFtjYXB0dXJlLCBoaXN0b3J5LCBvbmJvYXJkaW5nUGhhc2VdKTtcblxuICBjb25zdCBpc0ZpZWxkc0ZpbGxlZCA9ICEhKHBhc3N3b3JkICYmIGNvbmZpcm1QYXNzd29yZFZhbCk7XG4gIGNvbnN0IGNvbmZpcm1hdGlvbkVycm9yID0gISEoXG4gICAgcGFzc3dvcmQgJiZcbiAgICBjb25maXJtUGFzc3dvcmRWYWwgJiZcbiAgICBwYXNzd29yZCAhPT0gY29uZmlybVBhc3N3b3JkVmFsXG4gICk7XG4gIGNvbnN0IHBhc3N3b3JkTGVuZ3RoRXJyb3IgPVxuICAgIGlzUGFzc3dvcmRJbnB1dEZpbGxlZCAmJiBwYXNzd29yZCAmJiBwYXNzd29yZC5sZW5ndGggPCA4O1xuICBjb25zdCBjYW5TdWJtaXQgPVxuICAgICFjb25maXJtYXRpb25FcnJvciAmJlxuICAgIGlzRmllbGRzRmlsbGVkICYmXG4gICAgdGVybUFuZFBvbGljeUNoZWNrZWQgJiZcbiAgICBuZXdQYXNzd29yZFN0cmVuZ3RoID4gMSAmJlxuICAgICghaXNOZXdzbGV0dGVyRW5hYmxlZCB8fFxuICAgICAgZW1haWxWYWxpZGF0aW9uUmVzdWx0ID09PSBFbWFpbFZhbGlkYXRpb25SZXN1bHQuVmFsaWQpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogMzc1LFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPE9uYm9hcmRpbmdTdGVwSGVhZGVyXG4gICAgICAgIHRlc3RJZD1cIm5hbWUtYW5kLXBhc3N3b3JkXCJcbiAgICAgICAgdGl0bGU9e3QoJ0FjY291bnQgRGV0YWlscycpfVxuICAgICAgLz5cbiAgICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSwgbWI6IDMsIHB4OiAxLjUgfX0+XG4gICAgICAgIDxTdGFjayBzeD17eyB0ZXh0QWxpZ246ICdjZW50ZXInIH19PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgc3g9e3sgbWI6IDQgfX1cbiAgICAgICAgICAgIGNvbG9yPXt0aGVtZS5wYWxldHRlLnRleHQuc2Vjb25kYXJ5fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUcmFucyBpMThuS2V5PVwiRm9yIHlvdXIgc2VjdXJpdHksIHBsZWFzZSBjcmVhdGUgYSBuYW1lIGFuZCBwYXNzd29yZC5cIiAvPlxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICA8U3RhY2sgc3g9e3sgYWxpZ25TZWxmOiAnY2VudGVyJywgcm93R2FwOiAyLCB3aWR0aDogMSB9fT5cbiAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwid2FsbGV0LW5hbWUtaW5wdXRcIlxuICAgICAgICAgICAgICBsYWJlbD17dCgnV2FsbGV0IE5hbWUnKX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRXYWxsZXROYW1lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0VudGVyIGEgTmFtZScpfVxuICAgICAgICAgICAgICBhdXRvRm9jdXNcbiAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgIGlucHV0TGFiZWxQcm9wcz17e1xuICAgICAgICAgICAgICAgIHN4OiB7XG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdub25lJyxcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGVtZS50eXBvZ3JhcGh5LmJvZHkyLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgcGI6IDAuNSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBtaW5IZWlnaHQ6IHRoZW1lLnNwYWNpbmcoMTApIH19PlxuICAgICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cIndhbGxldC1wYXNzd29yZC1pbnB1dFwiXG4gICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgIGxhYmVsPXt0KCdQYXNzd29yZCcpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFBhc3N3b3JkKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0VudGVyIGEgUGFzc3dvcmQnKX1cbiAgICAgICAgICAgICAgZXJyb3I9eyEhcGFzc3dvcmRMZW5ndGhFcnJvcn1cbiAgICAgICAgICAgICAgaGVscGVyVGV4dD17XG4gICAgICAgICAgICAgICAgcGFzc3dvcmQgPyAnJyA6IHQoJ1Bhc3N3b3JkIG11c3QgYmUgOCBjaGFyYWN0ZXJzIG1pbmltdW0nKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uQmx1cj17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldElzUGFzc3dvcmRJbnB1dEZpbGxlZCh0cnVlKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgaW5wdXRMYWJlbFByb3BzPXt7XG4gICAgICAgICAgICAgICAgc3g6IHtcbiAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkuYm9keTIuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgICBwYjogMC41LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHtwYXNzd29yZCAmJiAoXG4gICAgICAgICAgICAgIDxQYXNzd29yZFN0cmVuZ3RoXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ9e3Bhc3N3b3JkfVxuICAgICAgICAgICAgICAgIHNldFBhc3N3b3JkU3RyZW5ndGg9e3NldE5ld1Bhc3N3b3JkU3RyZW5ndGh9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IG1pbkhlaWdodDogdGhlbWUuc3BhY2luZygxMCkgfX0+XG4gICAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwid2FsbGV0LWNvbmZpcm0tcGFzc3dvcmQtaW5wdXRcIlxuICAgICAgICAgICAgICBsYWJlbD17dCgnQ29uZmlybSBQYXNzd29yZCcpfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENvbmZpcm1QYXNzd29yZFZhbChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0KCdDb25maXJtIFBhc3N3b3JkJyl9XG4gICAgICAgICAgICAgIGVycm9yPXtjb25maXJtYXRpb25FcnJvcn1cbiAgICAgICAgICAgICAgaGVscGVyVGV4dD17XG4gICAgICAgICAgICAgICAgY29uZmlybWF0aW9uRXJyb3IgPyB0KCdQYXNzd29yZHMgZG8gbm90IG1hdGNoJykgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpbnB1dExhYmVsUHJvcHM9e3tcbiAgICAgICAgICAgICAgICBzeDoge1xuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhlbWUudHlwb2dyYXBoeS5ib2R5Mi5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIHBiOiAwLjUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgPFN0YWNrIHN4PXt7IGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgbXQ6IDIgfX0+XG4gICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICAgIGRpc2FibGVSaXBwbGVcbiAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoZW1lLnNwYWNpbmcoMi41KSxcbiAgICAgICAgICAgICAgICBjb2xvcjogdGVybUFuZFBvbGljeUNoZWNrZWRcbiAgICAgICAgICAgICAgICAgID8gdGhlbWUucGFsZXR0ZS5zZWNvbmRhcnkubWFpblxuICAgICAgICAgICAgICAgICAgOiB0aGVtZS5wYWxldHRlLnByaW1hcnkubWFpbixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0ZXJtcy1vZi11c2UtY2hlY2tib3hcIlxuICAgICAgICAgICAgICBjaGVja2VkPXt0ZXJtQW5kUG9saWN5Q2hlY2tlZH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHNldFRlcm1BbmRQb2xpY3lDaGVja2VkKCF0ZXJtQW5kUG9saWN5Q2hlY2tlZCl9XG4gICAgICAgICAgICAgIGxhYmVsPXtcbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgICAgICAgIGkxOG5LZXk9XCJJIGhhdmUgcmVhZCBhbmQgYWdyZWUgdG8gdGhlIDx0ZXJtTGluaz5UZXJtcyBvZiBVc2U8L3Rlcm1MaW5rPlwiXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgICAgICAgICB0ZXJtTGluazogKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlMaW5rXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFzPVwiYVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL2NvcmUuYXBwL3Rlcm1zL2NvcmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdzZWNvbmRhcnkubWFpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICB7aXNOZXdzbGV0dGVyQ29uZmlndXJlZCgpICYmIChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPERpdmlkZXIgbGlnaHQgc3g9e3sgbXk6IDQsIG14OiAxLjUgfX0gLz5cblxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGFsaWduU2VsZjogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlUmlwcGxlXG4gICAgICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDIuNSksXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpc05ld3NsZXR0ZXJFbmFibGVkXG4gICAgICAgICAgICAgICAgICAgICAgPyB0aGVtZS5wYWxldHRlLnNlY29uZGFyeS5tYWluXG4gICAgICAgICAgICAgICAgICAgICAgOiB0aGVtZS5wYWxldHRlLnByaW1hcnkubWFpbixcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICBhbGlnblNlbGY6ICdmbGV4LXN0YXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgbXQ6IC0wLjI1LFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibmV3c2xldHRlci1jaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICBjaGVja2VkPXtpc05ld3NsZXR0ZXJFbmFibGVkfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHNldElzTmV3c2xldHRlckVuYWJsZWQoKGVuYWJsZWQpID0+ICFlbmFibGVkKX1cbiAgICAgICAgICAgICAgICAgIGxhYmVsPXtcbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8VHJhbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG5LZXk9XCJTdGF5IHVwZGF0ZWQgb24gbGF0ZXN0IGFpcmRyb3BzLCBldmVudHMgYW5kIG1vcmUhIFlvdSBjYW4gdW5zdWJzY3JpYmUgYW55dGltZS4gRm9yIG1vcmUgZGV0YWlscywgc2VlIG91ciA8cHJpdmFjeUxpbms+UHJpdmFjeSBQb2xpY3k8L3ByaXZhY3lMaW5rPlwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByaXZhY3lMaW5rOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlMaW5rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcz1cImFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3d3dy5hdmFsYWJzLm9yZy9wcml2YWN5LXBvbGljeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3NlY29uZGFyeS5tYWluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICB7aXNOZXdzbGV0dGVyRW5hYmxlZCAmJlxuICAgICAgICAgICAgICBvbmJvYXJkaW5nV2FsbGV0VHlwZSAhPT0gV2FsbGV0VHlwZS5TZWVkbGVzcyAmJiAoXG4gICAgICAgICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgICAgICAgICBzeD17eyBtdDogMS41IH19XG4gICAgICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJuZXdzbGV0dGVyLWVtYWlsLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZXROZXdzbGV0dGVyRW1haWwoZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzZXRFbWFpbFZhbGlkYXRpb25SZXN1bHQodmFsaWRhdGVFbWFpbChlLnRhcmdldC52YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtuZXdzbGV0dGVyRW1haWx9XG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnRS1tYWlsIGFkZHJlc3MnKX1cbiAgICAgICAgICAgICAgICAgIGVycm9yPXtcbiAgICAgICAgICAgICAgICAgICAgZW1haWxWYWxpZGF0aW9uUmVzdWx0ID09PSBFbWFpbFZhbGlkYXRpb25SZXN1bHQuSW52YWxpZFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaGVscGVyVGV4dD17XG4gICAgICAgICAgICAgICAgICAgIGVtYWlsVmFsaWRhdGlvblJlc3VsdCA9PT0gRW1haWxWYWxpZGF0aW9uUmVzdWx0LkludmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICA/IHQoJ1BsZWFzZSBwcm92aWRlIGEgdmFsaWQgZS1tYWlsIGFkZHJlc3MnKVxuICAgICAgICAgICAgICAgICAgICAgIDogJydcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICAgICAgSW5wdXRQcm9wcz17e1xuICAgICAgICAgICAgICAgICAgICBlbmRBZG9ybm1lbnQ6IChcbiAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRBZG9ybm1lbnQgcG9zaXRpb249XCJlbmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtlbWFpbFZhbGlkYXRpb25SZXN1bHQgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgIEVtYWlsVmFsaWRhdGlvblJlc3VsdC5WYWxpZCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxDaGVja0ljb24gY29sb3I9e3RoZW1lLnBhbGV0dGUuc3VjY2Vzcy5tYWlufSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHtlbWFpbFZhbGlkYXRpb25SZXN1bHQgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgIEVtYWlsVmFsaWRhdGlvblJlc3VsdC5JbnZhbGlkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFhJY29uIGNvbG9yPXt0aGVtZS5wYWxldHRlLmVycm9yLm1haW59IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgIDwvSW5wdXRBZG9ybm1lbnQ+XG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgPC8+XG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFBhZ2VOYXZcbiAgICAgICAgb25CYWNrPXsoKSA9PiB7XG4gICAgICAgICAgY2FwdHVyZSgnT25ib2FyZGluZ1Bhc3N3b3JkQ2FuY2VsbGVkJyk7XG4gICAgICAgICAgaWYgKG9uYm9hcmRpbmdQaGFzZSA9PT0gT25ib2FyZGluZ1BoYXNlLlNFRURMRVNTX0dPT0dMRSkge1xuICAgICAgICAgICAgc2V0SXNWZXJpZnlHb0JhY2tNb2RhbE9wZW4odHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGhpc3RvcnkuZ29CYWNrKCk7XG4gICAgICAgIH19XG4gICAgICAgIG9uTmV4dD17KCkgPT4ge1xuICAgICAgICAgIGNhcHR1cmUoJ09uYm9hcmRpbmdQYXNzd29yZFNldCcpO1xuICAgICAgICAgIHNldFBhc3N3b3JkQW5kTmFtZXMocGFzc3dvcmQsIHdhbGxldE5hbWUpO1xuICAgICAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5BTkFMWVRJQ1NfQ09OU0VOVCk7XG4gICAgICAgIH19XG4gICAgICAgIG5leHRUZXh0PXt0KCdTYXZlJyl9XG4gICAgICAgIGRpc2FibGVOZXh0PXshY2FuU3VibWl0fVxuICAgICAgICBleHBhbmQ9e1xuICAgICAgICAgIG9uYm9hcmRpbmdQaGFzZSA9PT0gT25ib2FyZGluZ1BoYXNlLkNSRUFURV9XQUxMRVQgPyBmYWxzZSA6IHRydWVcbiAgICAgICAgfVxuICAgICAgICBzdGVwcz17Z2V0U3RlcHMuc3RlcHNOdW1iZXJ9XG4gICAgICAgIGFjdGl2ZVN0ZXA9e2dldFN0ZXBzLmFjdGl2ZVN0ZXB9XG4gICAgICAvPlxuICAgICAgPFZlcmlmeUdvQmFja01vZGFsXG4gICAgICAgIGlzT3Blbj17aXNWZXJpZnlHb0JhY2tNb2RhbE9wZW59XG4gICAgICAgIG9uQmFjaz17KCkgPT4ge1xuICAgICAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5PTkJPQVJESU5HX0hPTUUpO1xuICAgICAgICAgIHNldElzVmVyaWZ5R29CYWNrTW9kYWxPcGVuKGZhbHNlKTtcbiAgICAgICAgfX1cbiAgICAgICAgb25DYW5jZWw9eygpID0+IHtcbiAgICAgICAgICBzZXRJc1ZlcmlmeUdvQmFja01vZGFsT3BlbihmYWxzZSk7XG4gICAgICAgIH19XG4gICAgICAvPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIHN0eWxlZCxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IE1uZW1vbmljUHJvcHMgfSBmcm9tICcuL01uZW1vbmljJztcblxuaW50ZXJmYWNlIFdvcmRUb0NvbmZpcm0ge1xuICBpbmRleDogbnVtYmVyO1xuICByYW5kb21Xb3Jkczogc3RyaW5nW107XG4gIHNlbGVjdGVkOiBzdHJpbmc7XG59XG5cbmNvbnN0IEJvbGRUZXh0ID0gc3R5bGVkKCdzcGFuJylgXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbmZpcm1NbmVtb25pYyh7XG4gIHBocmFzZSxcbiAgd29yZENvdW50ID0gMjQsXG4gIGNvbmZpcm1Xb3JkQ291bnQgPSAzLFxuICBvbkNvbmZpcm1lZENoYW5nZSxcbn06IE1uZW1vbmljUHJvcHMpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgY29uc3QgW3dvcmRzVG9Db25maXJtLCBzZXRXb3Jkc1RvQ29uZmlybV0gPSB1c2VTdGF0ZTxcbiAgICBSZWNvcmQ8bnVtYmVyLCBXb3JkVG9Db25maXJtPlxuICA+KHt9KTtcbiAgY29uc3Qgd29yZHMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gcGhyYXNlLnNwbGl0KCcgJyk7XG4gIH0sIFtwaHJhc2VdKTtcbiAgY29uc3QgZmlyc3RXb3JkVGV4dCA9IHQoJ1NlbGVjdCB0aGUgZmlyc3Qgd29yZCcpO1xuICBjb25zdCBuZXh0V29yZFRleHQgPSB0KCdTZWxlY3QgdGhlIHdvcmQgdGhhdCBjb21lcyBhZnRlcicpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgZ2V0UmFuZG9tV29yZHNGb3JJbmRleCA9IChpbmRleDogbnVtYmVyKTogc3RyaW5nW10gPT4ge1xuICAgICAgY29uc3QgcmFuZG9tV29yZHM6IHN0cmluZ1tdID0gW107XG4gICAgICB3aGlsZSAocmFuZG9tV29yZHMubGVuZ3RoIDwgMikge1xuICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHdvcmRDb3VudCk7XG4gICAgICAgIGNvbnN0IHJhbmRvbVdvcmQgPSB3b3Jkc1tyYW5kb21JbmRleF07XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHJhbmRvbUluZGV4ID09PSBpbmRleCB8fFxuICAgICAgICAgIHdvcmRzLmxlbmd0aCA8PSByYW5kb21JbmRleCB8fFxuICAgICAgICAgICFyYW5kb21Xb3JkIHx8XG4gICAgICAgICAgcmFuZG9tV29yZHMuaW5jbHVkZXMocmFuZG9tV29yZClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcmFuZG9tV29yZHMucHVzaChyYW5kb21Xb3JkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByYW5kb21Xb3JkcztcbiAgICB9O1xuXG4gICAgY29uc3QgdG9Db25maXJtOiBSZWNvcmQ8bnVtYmVyLCBXb3JkVG9Db25maXJtPiA9IHt9O1xuICAgIHdoaWxlIChPYmplY3Qua2V5cyh0b0NvbmZpcm0pLmxlbmd0aCA8IGNvbmZpcm1Xb3JkQ291bnQpIHtcbiAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogd29yZENvdW50KTtcbiAgICAgIGNvbnN0IHJhbmRvbVdvcmQgPSB3b3Jkc1tyYW5kb21JbmRleF07XG4gICAgICBpZiAoIXRvQ29uZmlybVtyYW5kb21JbmRleF0gJiYgcmFuZG9tV29yZCkge1xuICAgICAgICB0b0NvbmZpcm1bcmFuZG9tSW5kZXhdID0ge1xuICAgICAgICAgIGluZGV4OiByYW5kb21JbmRleCxcbiAgICAgICAgICByYW5kb21Xb3JkczogW1xuICAgICAgICAgICAgcmFuZG9tV29yZCxcbiAgICAgICAgICAgIC4uLmdldFJhbmRvbVdvcmRzRm9ySW5kZXgocmFuZG9tSW5kZXgpLFxuICAgICAgICAgIF0uc29ydCgoKSA9PiAwLjUgLSBNYXRoLnJhbmRvbSgpKSxcbiAgICAgICAgICBzZWxlY3RlZDogJycsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0V29yZHNUb0NvbmZpcm0odG9Db25maXJtKTtcbiAgfSwgW2NvbmZpcm1Xb3JkQ291bnQsIHdvcmRDb3VudCwgd29yZHNdKTtcblxuICBjb25zdCBzZWxlY3RXb3JkRm9ySW5kZXggPSAoaW5kZXg6IG51bWJlciwgd29yZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0ZWRXb3JkID0gd29yZHNUb0NvbmZpcm1baW5kZXhdO1xuXG4gICAgaWYgKHNlbGVjdGVkV29yZCkge1xuICAgICAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgICAgIC4uLndvcmRzVG9Db25maXJtLFxuICAgICAgICBbaW5kZXhdOiB7XG4gICAgICAgICAgLi4uc2VsZWN0ZWRXb3JkLFxuICAgICAgICAgIHNlbGVjdGVkOiB3b3JkLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIHNldFdvcmRzVG9Db25maXJtKG5ld1N0YXRlKTtcblxuICAgICAgaWYgKCFvbkNvbmZpcm1lZENoYW5nZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9uQ29uZmlybWVkQ2hhbmdlKFxuICAgICAgICBPYmplY3QudmFsdWVzKG5ld1N0YXRlKS5ldmVyeShcbiAgICAgICAgICAoaXRlbSkgPT4gaXRlbS5pbmRleCA+PSAwICYmIHdvcmRzW2l0ZW0uaW5kZXhdID09PSBpdGVtLnNlbGVjdGVkLFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2s+XG4gICAgICB7T2JqZWN0LmtleXMod29yZHNUb0NvbmZpcm0pXG4gICAgICAgIC5tYXAoTnVtYmVyKVxuICAgICAgICAubWFwKChpKSA9PiAoXG4gICAgICAgICAgPFN0YWNrIGtleT17aX0gc3g9e3sgbWI6IDQsIHRleHRBbGlnbjogJ2xlZnQnIH19PlxuICAgICAgICAgICAge2kgIT09IDAgPyAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCIgc3g9e3sgbWI6IDIgfX0+XG4gICAgICAgICAgICAgICAgICB7bmV4dFdvcmRUZXh0fSA8Qm9sZFRleHQ+e2AoJHt3b3Jkc1tpIC0gMV19KWB9PC9Cb2xkVGV4dD5cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTFcIlxuICAgICAgICAgICAgICAgIHN4PXt7IG1iOiAyLCBmb250V2VpZ2h0OiAnZm9udFdlaWdodEJvbGQnIH19XG4gICAgICAgICAgICAgID57YCR7Zmlyc3RXb3JkVGV4dH1gfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycgfX0+XG4gICAgICAgICAgICAgIHt3b3Jkc1RvQ29uZmlybVtpXT8ucmFuZG9tV29yZHMubWFwKChyYW5kb21Xb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB3b3Jkc1RvQ29uZmlybVtpXT8uc2VsZWN0ZWQgPT09IHJhbmRvbVdvcmQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgICBrZXk9e2Ake2l9LSR7cmFuZG9tV29yZH1gfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZWxlY3RXb3JkRm9ySW5kZXgoaSwgcmFuZG9tV29yZCl9XG4gICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxMi41LFxuICAgICAgICAgICAgICAgICAgICAgIHB5OiAxLFxuICAgICAgICAgICAgICAgICAgICAgIG14OiAxLFxuICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhlbWUuc3BhY2luZygxMyksXG4gICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdGhlbWUucGFsZXR0ZS5wcmltYXJ5Lm1haW5cbiAgICAgICAgICAgICAgICAgICAgICAgIDogdGhlbWUucGFsZXR0ZS5ncmV5WzgwMF0sXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHNlbGVjdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRoZW1lLnBhbGV0dGUuZ3JleVs4MDBdXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5tYWluLFxuICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICcmOmZpcnN0LW9mLXR5cGUnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtbDogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJyY6bGFzdC1vZi10eXBlJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXI6ICcwJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICcmOmhvdmVyJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5wcmltYXJ5Lm1haW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGhlbWUucGFsZXR0ZS5ncmV5WzgwMF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdzZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHtyYW5kb21Xb3JkfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICApKX1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBPbmJvYXJkaW5nU3RlcEhlYWRlciB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvT25ib2FyZGluZ1N0ZXBIZWFkZXInO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBTdGFjaywgVHlwb2dyYXBoeSwgdXNlVGhlbWUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgTW5lbW9uaWMgfSBmcm9tICcuL01uZW1vbmljJztcbmltcG9ydCB7IFBhZ2VOYXYgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL1BhZ2VOYXYnO1xuXG5pbnRlcmZhY2UgQ29uZmlybVBocmFzZVByb3BzIHtcbiAgbW5lbW9uaWM6IHN0cmluZztcbiAgb25DYW5jZWw6ICgpID0+IHZvaWQ7XG4gIG9uTmV4dDogKCkgPT4gdm9pZDtcbiAgb25CYWNrOiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29uZmlybVBocmFzZSh7XG4gIG9uTmV4dCxcbiAgb25CYWNrLFxuICBtbmVtb25pYyxcbn06IENvbmZpcm1QaHJhc2VQcm9wcykge1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgW3Rlcm1zQ29uZmlybWVkLCBzZXRUZXJtc0NvbmZpcm1lZF0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPE9uYm9hcmRpbmdTdGVwSGVhZGVyXG4gICAgICAgIHRlc3RJZD1cImNvbmZpcm0tcGhyYXNlXCJcbiAgICAgICAgdGl0bGU9e3QoJ1ZlcmlmeSBQaHJhc2UnKX1cbiAgICAgIC8+XG4gICAgICA8U3RhY2tcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJjb25maXJtLXBocmFzZS1zZWN0aW9uXCJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBwdDogMSxcbiAgICAgICAgICBweDogNixcbiAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgc3g9e3sgbWI6IDUgfX1cbiAgICAgICAgICBjb2xvcj17dGhlbWUucGFsZXR0ZS50ZXh0LnNlY29uZGFyeX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUcmFucyBpMThuS2V5PVwiU2VsZWN0IHRoZSB3b3JkcyBiZWxvdyB0byB2ZXJpZnkgeW91ciBzZWNyZXQgcmVjb3ZlcnkgcGhyYXNlLlwiIC8+XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFN0YWNrIGFsaWduU2VsZj1cImNlbnRlclwiPlxuICAgICAgICAgIDxNbmVtb25pY1xuICAgICAgICAgICAgcGhyYXNlPXttbmVtb25pY31cbiAgICAgICAgICAgIGNvbmZpcm1NbmVtb25pYz17dHJ1ZX1cbiAgICAgICAgICAgIG9uQ29uZmlybWVkQ2hhbmdlPXsoY29uZmlybWVkKSA9PiB7XG4gICAgICAgICAgICAgIHNldFRlcm1zQ29uZmlybWVkKGNvbmZpcm1lZCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuXG4gICAgICA8UGFnZU5hdlxuICAgICAgICBvbkJhY2s9e29uQmFja31cbiAgICAgICAgb25OZXh0PXsoKSA9PiB7XG4gICAgICAgICAgY2FwdHVyZSgnT25ib2FyZGluZ01uZW1vbmljVmVyaWZpZWQnKTtcbiAgICAgICAgICBvbk5leHQoKTtcbiAgICAgICAgfX1cbiAgICAgICAgbmV4dFRleHQ9e3QoJ1NhdmUnKX1cbiAgICAgICAgZGlzYWJsZU5leHQ9eyF0ZXJtc0NvbmZpcm1lZH1cbiAgICAgICAgZXhwYW5kPXtmYWxzZX1cbiAgICAgICAgc3RlcHM9ezR9XG4gICAgICAgIGFjdGl2ZVN0ZXA9ezF9XG4gICAgICAvPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IE9uYm9hcmRpbmdTdGVwSGVhZGVyIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9PbmJvYXJkaW5nU3RlcEhlYWRlcic7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIENoZWNrYm94LFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBNbmVtb25pYyB9IGZyb20gJy4vTW5lbW9uaWMnO1xuaW1wb3J0IHsgUGFnZU5hdiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvUGFnZU5hdic7XG5cbmludGVyZmFjZSBDb3B5UGhyYXNlUHJvcHMge1xuICBtbmVtb25pYzogc3RyaW5nO1xuICBvbkNhbmNlbDogKCkgPT4gdm9pZDtcbiAgb25CYWNrOiAoKSA9PiB2b2lkO1xuICBvbk5leHQ6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb3B5UGhyYXNlKHsgb25CYWNrLCBvbk5leHQsIG1uZW1vbmljIH06IENvcHlQaHJhc2VQcm9wcykge1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgW3Rlcm1zQ29uZmlybWVkLCBzZXRUZXJtc0NvbmZpcm1lZF0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzQxMHB4JyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxPbmJvYXJkaW5nU3RlcEhlYWRlclxuICAgICAgICB0ZXN0SWQ9XCJjb3B5LXBocmFzZVwiXG4gICAgICAgIHRpdGxlPXt0KCdXcml0ZSBEb3duIFJlY292ZXJ5IFBocmFzZScpfVxuICAgICAgLz5cbiAgICAgIDxTdGFja1xuICAgICAgICBkYXRhLXRlc3RpZD1cImNvcHktcGhyYXNlLXNlY3Rpb25cIlxuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgbWI6IDMsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICBzeD17eyBtYjogNSB9fVxuICAgICAgICAgIGNvbG9yPXt0aGVtZS5wYWxldHRlLnRleHQuc2Vjb25kYXJ5fVxuICAgICAgICA+XG4gICAgICAgICAgPFRyYW5zIGkxOG5LZXk9XCJUaGlzIGlzIHlvdXIgc2VjcmV0IHJlY292ZXJ5IHBocmFzZS4gV3JpdGUgaXQgZG93biwgYW5kIHN0b3JlIGl0IGluIGEgc2VjdXJlIGxvY2F0aW9uLlwiIC8+XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFN0YWNrIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBzeD17eyByb3dHYXA6IDEgfX0+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiB0aGVtZS5zcGFjaW5nKDQ0KSwgbWI6IDQgfX0+XG4gICAgICAgICAgICA8TW5lbW9uaWMgcGhyYXNlPXttbmVtb25pY30gY29uZmlybU1uZW1vbmljPXtmYWxzZX0gLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogdGhlbWUuc3BhY2luZyg0NCkgfX0+XG4gICAgICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwcml2YWN5LXBvbGljeS1jaGVja2JveFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFRlcm1zQ29uZmlybWVkKGUudGFyZ2V0LmNoZWNrZWQpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBkaXNhYmxlUmlwcGxlXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDIuNSksXG4gICAgICAgICAgICAgICAgY29sb3I6IHRlcm1zQ29uZmlybWVkXG4gICAgICAgICAgICAgICAgICA/IHRoZW1lLnBhbGV0dGUuc2Vjb25kYXJ5Lm1haW5cbiAgICAgICAgICAgICAgICAgIDogdGhlbWUucGFsZXR0ZS5wcmltYXJ5Lm1haW4sXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGxhYmVsPXtcbiAgICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgdGV4dEFsaWduOiAnbGVmdCcgfX0+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8VHJhbnMgaTE4bktleT1cIkkgdW5kZXJzdGFuZCBsb3NpbmcgdGhpcyBwaHJhc2Ugd2lsbCByZXN1bHQgaW4gbG9zdCBmdW5kcy4gSSBoYXZlIHN0b3JlZCBpdCBpbiBhIHNlY3VyZSBsb2NhdGlvbi5cIiAvPlxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG5cbiAgICAgIDxQYWdlTmF2XG4gICAgICAgIG9uQmFjaz17b25CYWNrfVxuICAgICAgICBvbk5leHQ9eygpID0+IHtcbiAgICAgICAgICBjYXB0dXJlKCdPbmJvYXJkaW5nTW5lbW9uaWNDcmVhdGVkJyk7XG4gICAgICAgICAgb25OZXh0KCk7XG4gICAgICAgIH19XG4gICAgICAgIGRpc2FibGVOZXh0PXshdGVybXNDb25maXJtZWR9XG4gICAgICAgIGV4cGFuZD17ZmFsc2V9XG4gICAgICAgIHN0ZXBzPXs0fVxuICAgICAgICBhY3RpdmVTdGVwPXswfVxuICAgICAgLz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjcmVhdGVOZXdNbmVtb25pYyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvdXRpbHMvY3JlYXRlTW5lbW9uaWNQaHJhc2UnO1xuaW1wb3J0IHsgdXNlT25ib2FyZGluZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL09uYm9hcmRpbmdQcm92aWRlcic7XG5pbXBvcnQgeyBDb25maXJtUGhyYXNlIH0gZnJvbSAnLi9Db25maXJtUGhyYXNlJztcbmltcG9ydCB7IENvcHlQaHJhc2UgfSBmcm9tICcuL0NvcHlQaHJhc2UnO1xuaW1wb3J0IHtcbiAgT05CT0FSRElOR19FVkVOVF9OQU1FUyxcbiAgT25ib2FyZGluZ1BoYXNlLFxuICBPbmJvYXJkaW5nVVJMcyxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL29uYm9hcmRpbmcvbW9kZWxzJztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IFdhbGxldFR5cGUgfSBmcm9tICdAYXZhbGFicy90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVXYWxsZXQoKSB7XG4gIGNvbnN0IHsgc2V0TW5lbW9uaWMsIHNldE9uYm9hcmRpbmdQaGFzZSwgc2V0T25ib2FyZGluZ1dhbGxldFR5cGUgfSA9XG4gICAgdXNlT25ib2FyZGluZ0NvbnRleHQoKTtcbiAgY29uc3QgW2lzQ29waWVkLCBzZXRJc0NvcGllZF0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IFttbmVtb25pYywgc2V0TW5lbW9uaWNQaHJhc2VdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuXG4gIGNvbnN0IG9uQ2FuY2VsID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNhcHR1cmUoJ09uYm9hcmRpbmdDYW5jZWxsZWQnLCB7XG4gICAgICBzdGVwOiBPbmJvYXJkaW5nUGhhc2UuQ1JFQVRFX1dBTExFVCxcbiAgICB9KTtcbiAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuT05CT0FSRElOR19IT01FKTtcbiAgfSwgW2NhcHR1cmUsIGhpc3RvcnldKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldE1uZW1vbmljUGhyYXNlKGNyZWF0ZU5ld01uZW1vbmljKCkpO1xuICAgIHNldE9uYm9hcmRpbmdQaGFzZShPbmJvYXJkaW5nUGhhc2UuQ1JFQVRFX1dBTExFVCk7XG4gICAgc2V0T25ib2FyZGluZ1dhbGxldFR5cGUoV2FsbGV0VHlwZS5NbmVtb25pYyk7XG4gICAgY2FwdHVyZShPTkJPQVJESU5HX0VWRU5UX05BTUVTLmNyZWF0ZV93YWxsZXQpO1xuICB9LCBbY2FwdHVyZSwgc2V0T25ib2FyZGluZ1BoYXNlLCBzZXRPbmJvYXJkaW5nV2FsbGV0VHlwZV0pO1xuXG4gIHJldHVybiBpc0NvcGllZCA/IChcbiAgICA8Q29uZmlybVBocmFzZVxuICAgICAgb25CYWNrPXsoKSA9PiBzZXRJc0NvcGllZChmYWxzZSl9XG4gICAgICBvbk5leHQ9eygpID0+IHtcbiAgICAgICAgc2V0TW5lbW9uaWMobW5lbW9uaWMpO1xuICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuQ1JFQVRFX1BBU1NXT1JEKTtcbiAgICAgIH19XG4gICAgICBvbkNhbmNlbD17b25DYW5jZWx9XG4gICAgICBtbmVtb25pYz17bW5lbW9uaWN9XG4gICAgLz5cbiAgKSA6IChcbiAgICA8Q29weVBocmFzZVxuICAgICAgb25OZXh0PXsoKSA9PiBzZXRJc0NvcGllZCh0cnVlKX1cbiAgICAgIG9uQ2FuY2VsPXtvbkNhbmNlbH1cbiAgICAgIG1uZW1vbmljPXttbmVtb25pY31cbiAgICAgIG9uQmFjaz17b25DYW5jZWx9XG4gICAgLz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IENvbmZpcm1NbmVtb25pYyB9IGZyb20gJy4vQ29uZmlybU1uZW1vbmljJztcbmltcG9ydCB7IFNob3dNbmVtb25pYyB9IGZyb20gJy4vU2hvd01uZW1vbmljJztcblxuZXhwb3J0IGludGVyZmFjZSBNbmVtb25pY1Byb3BzIHtcbiAgcGhyYXNlOiBzdHJpbmc7XG4gIHdvcmRDb3VudD86IG51bWJlcjtcbiAgY29uZmlybVdvcmRDb3VudD86IG51bWJlcjtcbiAgY29uZmlybU1uZW1vbmljPzogYm9vbGVhbjtcbiAgb25Db25maXJtZWRDaGFuZ2U/OiAoY29uZmlybWVkOiBib29sZWFuKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTW5lbW9uaWMocHJvcHM6IE1uZW1vbmljUHJvcHMpIHtcbiAgcmV0dXJuIHByb3BzLmNvbmZpcm1NbmVtb25pYyA/IChcbiAgICA8Q29uZmlybU1uZW1vbmljIHsuLi5wcm9wc30gLz5cbiAgKSA6IChcbiAgICA8U2hvd01uZW1vbmljIHsuLi5wcm9wc30gLz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQ29weUljb24sXG4gIEdyaWQsXG4gIFN0YWNrLFxuICB0b2FzdCxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IE1uZW1vbmljUHJvcHMgfSBmcm9tICcuL01uZW1vbmljJztcbmltcG9ydCB7IGdldFJhbmRvbU1uZW1vbmljV29yZCB9IGZyb20gJy4uLy4uL3V0aWxzL2dldFJhbmRvbU1uZW1vbmljV29yZCc7XG5cbmNvbnN0IEZha2VXb3JkID0gKCkgPT4gKFxuICA8VHlwb2dyYXBoeVxuICAgIGFzPVwic3BhblwiXG4gICAgdHJhbnNsYXRlPVwibm9cIlxuICAgIHN4PXt7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICB6SW5kZXg6IC0xLFxuICAgICAgb3BhY2l0eTogMCxcbiAgICB9fVxuICA+XG4gICAge2dldFJhbmRvbU1uZW1vbmljV29yZCgpfVxuICA8L1R5cG9ncmFwaHk+XG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gU2hvd01uZW1vbmljKHsgcGhyYXNlLCB3b3JkQ291bnQgPSAyNCB9OiBNbmVtb25pY1Byb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB3b3JkcyA9IHBocmFzZS5zcGxpdCgnICcpO1xuXG4gIGNvbnN0IGlucHV0cyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGxpc3Q6IGFueVtdID0gW107XG4gICAgZm9yIChsZXQgbnVtID0gMTsgbnVtIDw9IHdvcmRDb3VudDsgbnVtKyspIHtcbiAgICAgIGNvbnN0IGlzRmFrZUJlZm9yZVJlYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXG4gICAgICBsaXN0LnB1c2goXG4gICAgICAgIDxHcmlkIGl0ZW0ga2V5PXtudW19PlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IHRoZW1lLnNwYWNpbmcoMTMpLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgIHN4PXt7IHVzZXJTZWxlY3Q6ICdub25lJywgbWluV2lkdGg6IDIsIG1yOiAxIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtudW19LlxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAge2lzRmFrZUJlZm9yZVJlYWwgJiYgPEZha2VXb3JkIC8+fVxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgYXM9XCJzcGFuXCIgdmFyaWFudD1cImJvZHkyXCIgdHJhbnNsYXRlPVwibm9cIj5cbiAgICAgICAgICAgICAge3dvcmRzW251bSAtIDFdfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgeyFpc0Zha2VCZWZvcmVSZWFsICYmIDxGYWtlV29yZCAvPn1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L0dyaWQ+LFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH0sIFt3b3JkQ291bnQsIHdvcmRzLCB0aGVtZV0pO1xuXG4gIGNvbnN0IG9uQ29weSA9ICgpID0+IHtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChwaHJhc2UpO1xuICAgIHRvYXN0LnN1Y2Nlc3ModCgnQ29waWVkIScpLCB7IGR1cmF0aW9uOiAyMDAwLCBwb3NpdGlvbjogJ3RvcC1sZWZ0JyB9KTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBhbGlnbkl0ZW1zPVwiZmxleC1lbmRcIj5cbiAgICAgIDxHcmlkXG4gICAgICAgIGNvbnRhaW5lclxuICAgICAgICBzeD17e1xuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF0sXG4gICAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDM4KSxcbiAgICAgICAgICB3aWR0aDogdGhlbWUuc3BhY2luZyg0NCksXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICByb3dHYXA6IDEuNSxcbiAgICAgICAgICBwOiAyLFxuICAgICAgICAgIGJvcmRlclJhZGl1czogMSxcbiAgICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsIC8vIHByZXZlbnQgdXNlciBmcm9tIG1hbnVhbGx5IHNlbGVjdGluZyAmIGNvcHlpbmcgdGhlIHBocmFzZSwgYXMgaXQgY29udGFpbnMgZmFrZSB3b3JkcyBpbi1iZXR3ZWVuXG4gICAgICAgIH19XG4gICAgICAgIG9uQ29weT17KGV2KSA9PiBldi5wcmV2ZW50RGVmYXVsdCgpfVxuICAgICAgPlxuICAgICAgICB7aW5wdXRzfVxuICAgICAgPC9HcmlkPlxuICAgICAgPEJ1dHRvbiB2YXJpYW50PVwidGV4dFwiIG9uQ2xpY2s9e29uQ29weX0gc3g9e3sgY29sb3I6ICdzZWNvbmRhcnknIH19PlxuICAgICAgICA8Q29weUljb24gc2l6ZT17MTZ9IC8+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBtbDogMSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ0NvcHkgUGhyYXNlJyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvQnV0dG9uPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZU9uYm9hcmRpbmdDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9PbmJvYXJkaW5nUHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgT05CT0FSRElOR19FVkVOVF9OQU1FUyxcbiAgT25ib2FyZGluZ1BoYXNlLFxuICBPbmJvYXJkaW5nVVJMcyxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL29uYm9hcmRpbmcvbW9kZWxzJztcbmltcG9ydCB7IE9uYm9hcmRpbmdTdGVwSGVhZGVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9PbmJvYXJkaW5nU3RlcEhlYWRlcic7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBQYWdlTmF2IH0gZnJvbSAnLi4vY29tcG9uZW50cy9QYWdlTmF2JztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IFdvcmRzTGVuZ3RoU2VsZWN0b3IgfSBmcm9tICcuLi9jb21wb25lbnRzL1dvcmRzTGVuZ3RoU2VsZWN0b3InO1xuaW1wb3J0IHNwbGl0U2VlZFBocmFzZSBmcm9tICcuLi91dGlscy9zcGxpdFNlZWRQaHJhc2UnO1xuaW1wb3J0IHsgaXNQaHJhc2VDb3JyZWN0IH0gZnJvbSAnQHNyYy91dGlscy9zZWVkUGhyYXNlVmFsaWRhdGlvbic7XG5pbXBvcnQgeyBXYWxsZXRUeXBlIH0gZnJvbSAnQGF2YWxhYnMvdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgSW1wb3J0V2FsbGV0ID0gKCkgPT4ge1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgeyBzZXRNbmVtb25pYywgc2V0T25ib2FyZGluZ1BoYXNlLCBzZXRPbmJvYXJkaW5nV2FsbGV0VHlwZSB9ID1cbiAgICB1c2VPbmJvYXJkaW5nQ29udGV4dCgpO1xuICBjb25zdCBbcmVjb3ZlcnlQaHJhc2UsIHNldFJlY292ZXJ5UGhyYXNlXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgW3dvcmRzTGVuZ3RoLCBzZXRXb3Jkc0xlbmd0aF0gPSB1c2VTdGF0ZSgyNCk7XG4gIGNvbnN0IFt3b3Jkcywgc2V0V29yZHNdID0gdXNlU3RhdGU8c3RyaW5nW10+KFtdKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcblxuICBjb25zdCBvbk5leHQgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgaWYgKHJlY292ZXJ5UGhyYXNlKSB7XG4gICAgICBjYXB0dXJlKCdPbmJvYXJkaW5nTW5lbW9uaWNJbXBvcnRlZCcpO1xuICAgICAgc2V0TW5lbW9uaWMocmVjb3ZlcnlQaHJhc2UpO1xuICAgICAgaGlzdG9yeS5wdXNoKE9uYm9hcmRpbmdVUkxzLkNSRUFURV9QQVNTV09SRCk7XG4gICAgfVxuICB9LCBbY2FwdHVyZSwgaGlzdG9yeSwgcmVjb3ZlcnlQaHJhc2UsIHNldE1uZW1vbmljXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRPbmJvYXJkaW5nUGhhc2UoT25ib2FyZGluZ1BoYXNlLklNUE9SVF9XQUxMRVQpO1xuICAgIHNldE9uYm9hcmRpbmdXYWxsZXRUeXBlKFdhbGxldFR5cGUuTW5lbW9uaWMpO1xuICAgIGNhcHR1cmUoT05CT0FSRElOR19FVkVOVF9OQU1FUy5pbXBvcnRfd2FsbGV0KTtcbiAgfSwgW2NhcHR1cmUsIHNldE9uYm9hcmRpbmdQaGFzZSwgc2V0T25ib2FyZGluZ1dhbGxldFR5cGVdKTtcblxuICBjb25zdCBzbGljZVdvcmRzID0gdXNlQ2FsbGJhY2soKHNlbGVjdGVkTGVuZ3RoOiBudW1iZXIpID0+IHtcbiAgICBzZXRXb3Jkc0xlbmd0aChzZWxlY3RlZExlbmd0aCk7XG4gICAgc2V0V29yZHMoKGN1cnJlbnRXb3JkcykgPT4ge1xuICAgICAgY29uc3QgY3V0V29yZHMgPSBbLi4uY3VycmVudFdvcmRzXTtcbiAgICAgIGNvbnN0IGxpbWl0ID1cbiAgICAgICAgc2VsZWN0ZWRMZW5ndGggPiBjdXJyZW50V29yZHMubGVuZ3RoXG4gICAgICAgICAgPyBjdXJyZW50V29yZHMubGVuZ3RoXG4gICAgICAgICAgOiBzZWxlY3RlZExlbmd0aDtcblxuICAgICAgcmV0dXJuIFsuLi5jdXJyZW50V29yZHMuc2xpY2UoMCwgc2VsZWN0ZWRMZW5ndGgpLCAuLi5jdXRXb3Jkc10uc2xpY2UoXG4gICAgICAgIDAsXG4gICAgICAgIGxpbWl0LFxuICAgICAgKTtcbiAgICB9KTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGlzUGhyYXNlVmFsaWQgPSB1c2VDYWxsYmFjayhcbiAgICAocGhyYXNlOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICh3b3Jkc0xlbmd0aCAhPT0gd29yZHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwaHJhc2UgJiYgaXNQaHJhc2VDb3JyZWN0KHBocmFzZSk7XG4gICAgfSxcbiAgICBbd29yZHMubGVuZ3RoLCB3b3Jkc0xlbmd0aF0sXG4gICk7XG5cbiAgY29uc3Qgb25QaHJhc2VDaGFuZ2VkID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHBocmFzZSA9IFsuLi53b3Jkc10uam9pbignICcpO1xuXG4gICAgaWYgKCFpc1BocmFzZVZhbGlkKHBocmFzZSkpIHtcbiAgICAgIHNldEVycm9yKHQoJ0ludmFsaWQgbW5lbW9uaWMgcGhyYXNlJykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRSZWNvdmVyeVBocmFzZShwaHJhc2UpO1xuICAgIHNldEVycm9yKCcnKTtcbiAgfSwgW2lzUGhyYXNlVmFsaWQsIHQsIHdvcmRzXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBvblBocmFzZUNoYW5nZWQoKTtcbiAgfSwgW29uUGhyYXNlQ2hhbmdlZCwgd29yZHNdKTtcblxuICBjb25zdCBuZXh0QnV0dG9uRGlzYWJsZWQgPSAhaXNQaHJhc2VWYWxpZChyZWNvdmVyeVBocmFzZSkgfHwgISFlcnJvcjtcblxuICBjb25zdCBpbnB1dEZpZWxkcyA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCBmaWVsZHM6IEpTWC5FbGVtZW50W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmRzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGZpZWxkcy5wdXNoKFxuICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6ICcxMzVweCcgfX0ga2V5PXtpfT5cbiAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgIGF1dG9Db21wbGV0ZT1cIm9mZlwiXG4gICAgICAgICAgICBJbnB1dFByb3BzPXt7XG4gICAgICAgICAgICAgIGVuZEFkb3JubWVudDogbnVsbCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkZvY3VzPXsoZXYpID0+IHtcbiAgICAgICAgICAgICAgZXYudGFyZ2V0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25CbHVyPXsoZXYpID0+IHtcbiAgICAgICAgICAgICAgZXYudGFyZ2V0LnNldEF0dHJpYnV0ZSgndHlwZScsICdwYXNzd29yZCcpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGF1dG9Gb2N1cz17aSA9PT0gMH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtgJHtpICsgMX0uYH1cbiAgICAgICAgICAgIG9uUGFzdGU9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhc3RlZFRleHQgPSBzcGxpdFNlZWRQaHJhc2UoXG4gICAgICAgICAgICAgICAgZS5jbGlwYm9hcmREYXRhLmdldERhdGEoJ1RleHQnKSxcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICBzZXRXb3JkcyhcbiAgICAgICAgICAgICAgICBbLi4ud29yZHMuc2xpY2UoMCwgaSksIC4uLnBhc3RlZFRleHRdLnNsaWNlKDAsIHdvcmRzTGVuZ3RoKSxcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgICAgICAgY29uc3QgbmV3V29yZHMgPSBbLi4ud29yZHNdO1xuICAgICAgICAgICAgICBuZXdXb3Jkc1tpXSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgIHNldFdvcmRzKG5ld1dvcmRzKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbktleVByZXNzPXsoZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICBvbk5leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHZhbHVlPXt3b3Jkc1tpXSB8fCAnJ31cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0YWNrPixcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHM7XG4gIH0sIFtvbk5leHQsIHdvcmRzLCB3b3Jkc0xlbmd0aF0pO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzQzMnB4JyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxPbmJvYXJkaW5nU3RlcEhlYWRlclxuICAgICAgICB0ZXN0SWQ9XCJlbnRlci1yZWNvdmVyeS1waHJhc2VcIlxuICAgICAgICB0aXRsZT17dCgnRW50ZXIgUmVjb3ZlcnkgUGhyYXNlJyl9XG4gICAgICAvPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgcHQ6IDEsXG4gICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgY29sb3I6IHRoZW1lLnBhbGV0dGUuZ3JleVs0MDBdIH19PlxuICAgICAgICAgIDxUcmFucyBpMThuS2V5PVwiQWNjZXNzIGFuIGV4aXN0aW5nIHdhbGxldCB3aXRoIHlvdXIgcmVjb3ZlcnkgcGhyYXNlLiBZb3UgY2FuIHBhc3RlIHlvdXIgZW50aXJlIHBocmFzZSBpbiB0aGUgZmlyc3QgZmllbGQuXCIgLz5cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgcHQ6IDQsXG4gICAgICAgICAgICBwYjogMSxcbiAgICAgICAgICAgIGFsaWduU2VsZjogJ2NlbnRlcicsXG4gICAgICAgICAgICBmbGV4RmxvdzogJ3JvdyB3cmFwJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICBnYXA6ICc4cHggOHB4JyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAnMTAwJScsIGp1c3RpZnlDb250ZW50OiAnZmxleC1zdGFydCcgfX0+XG4gICAgICAgICAgICA8V29yZHNMZW5ndGhTZWxlY3RvclxuICAgICAgICAgICAgICB3b3Jkc0xlbmd0aD17d29yZHNMZW5ndGh9XG4gICAgICAgICAgICAgIHNldFdvcmRzTGVuZ3RoPXtzbGljZVdvcmRzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIHtpbnB1dEZpZWxkcygpfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFdvcmRzKFtdKX1cbiAgICAgICAgICAgIHN4PXt7IHdpZHRoOiAnNzNweCcsIHByOiAwIH19XG4gICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBkaXNhYmxlZD17IXdvcmRzLmxlbmd0aH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPnt0KCdDbGVhciBBbGwnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFBhZ2VOYXZcbiAgICAgICAgb25CYWNrPXsoKSA9PiB7XG4gICAgICAgICAgY2FwdHVyZSgnT25ib2FyZGluZ0NhbmNlbGxlZCcsIHtcbiAgICAgICAgICAgIHN0ZXA6IE9uYm9hcmRpbmdQaGFzZS5JTVBPUlRfV0FMTEVULFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGhpc3RvcnkuZ29CYWNrKCk7XG4gICAgICAgIH19XG4gICAgICAgIG9uTmV4dD17b25OZXh0fVxuICAgICAgICBkaXNhYmxlTmV4dD17bmV4dEJ1dHRvbkRpc2FibGVkfVxuICAgICAgICBleHBhbmQ9e3RydWV9XG4gICAgICAgIHN0ZXBzPXszfVxuICAgICAgICBhY3RpdmVTdGVwPXswfVxuICAgICAgLz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7IHVzZVN0YXRlLCB1c2VDYWxsYmFjaywgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgT25ib2FyZGluZ1N0ZXBIZWFkZXIgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL09uYm9hcmRpbmdTdGVwSGVhZGVyJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG4gIEV4dGVybmFsTGlua0ljb24sXG4gIEJ1dHRvbixcbiAgc3R5bGVkLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUGFnZU5hdiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvUGFnZU5hdic7XG5pbXBvcnQgeyBGdW5jdGlvbklzT2ZmbGluZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRnVuY3Rpb25Jc09mZmxpbmUnO1xuaW1wb3J0IHsgdXNlRmVhdHVyZUZsYWdDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9GZWF0dXJlRmxhZ3NQcm92aWRlcic7XG5pbXBvcnQge1xuICBLZXlzdG9uZVFSQ29kZVNjYW5uZXIsXG4gIEtFWVNUT05FX0NPTk5FQ1RfU1VQUE9SVF9VUkwsXG59IGZyb20gJy4vS2V5c3RvbmVRUkNvZGVTY2FubmVyJztcbmltcG9ydCB7IEFkZHJlc3NUeXBlIH0gZnJvbSAnLi4vTGVkZ2VyL0xlZGdlckNvbm5lY3QnO1xuaW1wb3J0IHsgZ2V0QWRkcmVzc0Zyb21YUHViIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5pbXBvcnQgeyB1c2VHZXRBdmF4QmFsYW5jZSB9IGZyb20gJ0BzcmMvaG9va3MvdXNlR2V0QXZheEJhbGFuY2UnO1xuaW1wb3J0IHsgRGVyaXZlZEFkZHJlc3NlcyB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvRGVyaXZlZEFkZHJlc3Nlcyc7XG5pbXBvcnQgeyB1c2VPbmJvYXJkaW5nQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvT25ib2FyZGluZ1Byb3ZpZGVyJztcbmltcG9ydCB7IEZlYXR1cmVHYXRlcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9mZWF0dXJlRmxhZ3MvbW9kZWxzJztcbmltcG9ydCB7XG4gIE9OQk9BUkRJTkdfRVZFTlRfTkFNRVMsXG4gIE9uYm9hcmRpbmdQaGFzZSxcbiAgT25ib2FyZGluZ1VSTHMsXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9vbmJvYXJkaW5nL21vZGVscyc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBGdW5jdGlvbk5hbWVzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VJc0Z1bmN0aW9uQXZhaWxhYmxlJztcbmltcG9ydCB7IFdhbGxldFR5cGUgfSBmcm9tICdAYXZhbGFicy90eXBlcyc7XG5cbmNvbnN0IEtleXN0b25lU3RlcEltYWdlID0gc3R5bGVkKFN0YWNrKWBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBpbWcge1xuICAgIHdpZHRoOiAxNjdweDtcbiAgICB6LWluZGV4OiAxO1xuICB9XG5gO1xuXG5jb25zdCBLZXlzdG9uZUltYWdlQmFja2dyb3VuZCA9IHN0eWxlZChTdGFjaylgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDI0MnB4O1xuICBoZWlnaHQ6IDMxOHB4O1xuICBsZWZ0OiA1MHB4O1xuICB0b3A6IDBweDtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuICAgIDBkZWcsXG4gICAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpLFxuICAgIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKVxuICApO1xuICBmaWx0ZXI6IGJsdXIoNzdweCk7XG4gIHRyYW5zZm9ybTogcm90YXRlKC0xMTJkZWcpO1xuICB6LWluZGV4OiAwO1xuYDtcblxuY29uc3QgdHV0b3JpYWxMYXN0U3RlcCA9IDI7IC8vIHRoZXJlIGFyZSAzIHN0ZXBzIHRvIGdldCB0aHJvdWdoIHRoZSB0dXRvcmlhbCAodGhlIGltYWdlcyBiYXNpY2FsbHkpXG5cbmV4cG9ydCBjb25zdCBLZXlzdG9uZSA9ICgpID0+IHtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBzZXRNYXN0ZXJGaW5nZXJwcmludCxcbiAgICBzZXRYcHViLFxuICAgIHNldE9uYm9hcmRpbmdQaGFzZSxcbiAgICBzZXRPbmJvYXJkaW5nV2FsbGV0VHlwZSxcbiAgfSA9IHVzZU9uYm9hcmRpbmdDb250ZXh0KCk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuXG4gIGNvbnN0IFtzdGVwTnVtYmVyLCBzZXRTdGVwTnVtYmVyXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbeFB1YktleSwgc2V0WFB1YktleV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtpc1FSQ29kZVNjYW5PcGVuLCBzZXRJc1FSQ29kZVNjYW5PcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2FkZHJlc3Nlcywgc2V0QWRkcmVzc2VzXSA9IHVzZVN0YXRlPEFkZHJlc3NUeXBlW10+KFtdKTtcblxuICBjb25zdCB7IGdldEF2YXhCYWxhbmNlIH0gPSB1c2VHZXRBdmF4QmFsYW5jZSgpO1xuICBjb25zdCB7IGZlYXR1cmVGbGFncyB9ID0gdXNlRmVhdHVyZUZsYWdDb250ZXh0KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRPbmJvYXJkaW5nUGhhc2UoT25ib2FyZGluZ1BoYXNlLktFWVNUT05FKTtcbiAgICBzZXRPbmJvYXJkaW5nV2FsbGV0VHlwZShXYWxsZXRUeXBlLktleXN0b25lKTtcbiAgICBpZiAoIXN0ZXBOdW1iZXIpIHtcbiAgICAgIGNhcHR1cmUoT05CT0FSRElOR19FVkVOVF9OQU1FUy5rZXlzdG9uZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhcHR1cmUoYEtleXN0b25lVHV0b3JpYWxTdGVwJHtzdGVwTnVtYmVyfWApO1xuICAgIH1cbiAgfSwgW2NhcHR1cmUsIHNldE9uYm9hcmRpbmdQaGFzZSwgc2V0T25ib2FyZGluZ1dhbGxldFR5cGUsIHN0ZXBOdW1iZXJdKTtcblxuICBjb25zdCBnZXRBZGRyZXNzRnJvbVhwdWJLZXkgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoXG4gICAgICB4cHViOiBzdHJpbmcsXG4gICAgICBhY2NvdW50SW5kZXg6IG51bWJlcixcbiAgICAgIGFkZHJlc3NMaXN0OiBBZGRyZXNzVHlwZVtdID0gW10sXG4gICAgKSA9PiB7XG4gICAgICBjb25zdCBhZGRyZXNzID0gZ2V0QWRkcmVzc0Zyb21YUHViKHhwdWIsIGFjY291bnRJbmRleCk7XG4gICAgICBjb25zdCB7IGJhbGFuY2UgfSA9IGF3YWl0IGdldEF2YXhCYWxhbmNlKGFkZHJlc3MpO1xuICAgICAgY29uc3QgbmV3QWRkcmVzc2VzID0gW1xuICAgICAgICAuLi5hZGRyZXNzTGlzdCxcbiAgICAgICAgeyBhZGRyZXNzLCBiYWxhbmNlOiBiYWxhbmNlLmJhbGFuY2VEaXNwbGF5VmFsdWUgfHwgJzAnIH0sXG4gICAgICBdO1xuICAgICAgc2V0QWRkcmVzc2VzKG5ld0FkZHJlc3Nlcyk7XG4gICAgICBpZiAoYWNjb3VudEluZGV4IDwgMikge1xuICAgICAgICBhd2FpdCBnZXRBZGRyZXNzRnJvbVhwdWJLZXkoeHB1YiwgYWNjb3VudEluZGV4ICsgMSwgbmV3QWRkcmVzc2VzKTtcbiAgICAgIH1cbiAgICAgIGlmIChhY2NvdW50SW5kZXggPj0gMikge1xuICAgICAgICBjYXB0dXJlKCdPbmJvYXJkaW5nS2V5c3RvbmVIYXNBZGRyZXNzZXMnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtjYXB0dXJlLCBnZXRBdmF4QmFsYW5jZV0sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoeFB1YktleSAmJiAhYWRkcmVzc2VzLmxlbmd0aCkge1xuICAgICAgZ2V0QWRkcmVzc0Zyb21YcHViS2V5KHhQdWJLZXksIDApO1xuICAgIH1cbiAgfSwgW2FkZHJlc3Nlcy5sZW5ndGgsIGdldEFkZHJlc3NGcm9tWHB1YktleSwgeFB1YktleV0pO1xuXG4gIGNvbnN0IHN0ZXBzID0gMztcblxuICBjb25zdCBoZWFkZXJUaXRsZXMgPSBbXG4gICAgdCgnQ29ubmVjdCBTb2Z0d2FyZSBXYWxsZXQnKSxcbiAgICB0KCdDb25uZWN0IE5ldHdvcmsnKSxcbiAgICB0KCdTY2FuIFFSIENvZGUnKSxcbiAgICB0KCdDb25maXJtIERlcml2ZWQgQWRkcmVzc2VzJyksXG4gIF07XG4gIGNvbnN0IGhlYWRlckRlc2NyaXB0aW9ucyA9IFtcbiAgICB0KCdUYXAg4oCcQ29ubmVjdCBTb2Z0d2FyZSBXYWxsZXTigJ0gYXQgdGhlIGJvdHRvbSBsZWZ0IGNvcm5lci4nKSxcbiAgICB0KCdTZWxlY3QgdGhlIENvcmUgd2FsbGV0LicpLFxuICAgIHQoXG4gICAgICAnQ2xpY2sgb24gdGhlIOKAnFNjYW7igJ0gYnV0dG9uIGF0IHRoZSBib3R0b20gdG8gc2NhbiB0aGUgUVIgY29kZSBkaXNwbGF5ZWQgb24gdGhlIEtleXN0b25lIGRldmljZS4nLFxuICAgICksXG4gICAgdCgnVGhlc2UgYXJlIHRoZSBhZGRyZXNzZXMgZGVyaXZlZCBmcm9tIHlvdXIgS2V5c3RvbmUgZGV2aWNlJyksXG4gIF07XG5cbiAgY29uc3QgbmV4dEJ1dHRvbkxhYmVscyA9IFt0KCdOZXh0JyksIHQoJ05leHQnKSwgdCgnU2NhbiBRUiBDb2RlJyldO1xuXG4gIGZ1bmN0aW9uIHhwdWJDaGFuZ2VIYW5kbGVyKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBzZXRYUHViS2V5KG5ld1ZhbHVlKTtcbiAgICBzZXRYcHViKG5ld1ZhbHVlKTtcbiAgfVxuXG4gIGlmICghZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5LRVlTVE9ORV0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPE9uYm9hcmRpbmdTdGVwSGVhZGVyIHRpdGxlPXtoZWFkZXJUaXRsZXNbc3RlcE51bWJlcl19IC8+XG4gICAgICAgIDxGdW5jdGlvbklzT2ZmbGluZVxuICAgICAgICAgIGZ1bmN0aW9uTmFtZT17RnVuY3Rpb25OYW1lcy5LRVlTVE9ORX1cbiAgICAgICAgICBoaWRlUGFnZVRpdGxlXG4gICAgICAgIC8+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzQ2MHB4JyxcbiAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPE9uYm9hcmRpbmdTdGVwSGVhZGVyXG4gICAgICAgICAgdGVzdElkPVwia2V5c3RvbmUtdHV0b3JpYWwtc3RlcC0xXCJcbiAgICAgICAgICB0aXRsZT17aGVhZGVyVGl0bGVzW3N0ZXBOdW1iZXJdfVxuICAgICAgICAvPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICBwdDogMSxcbiAgICAgICAgICAgIHB4OiA2LFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgbWluSGVpZ2h0PXs0MH0+XG4gICAgICAgICAgICB7aGVhZGVyRGVzY3JpcHRpb25zW3N0ZXBOdW1iZXJdfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICB7c3RlcE51bWJlciA8PSB0dXRvcmlhbExhc3RTdGVwICYmIChcbiAgICAgICAgICAgIDxLZXlzdG9uZVN0ZXBJbWFnZVxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHB0OiA1LFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGVtZS5zcGFjaW5nKDQ0KSxcbiAgICAgICAgICAgICAgICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgc3JjPXtgL2ltYWdlcy9rZXlzdG9uZS9rZXlzdG9uZV9vbmJvYXJkaW5nX3N0ZXBfJHtcbiAgICAgICAgICAgICAgICAgIHN0ZXBOdW1iZXIgKyAxXG4gICAgICAgICAgICAgICAgfS5wbmdgfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8S2V5c3RvbmVJbWFnZUJhY2tncm91bmQgLz5cbiAgICAgICAgICAgIDwvS2V5c3RvbmVTdGVwSW1hZ2U+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7c3RlcE51bWJlciA9PT0gdHV0b3JpYWxMYXN0U3RlcCArIDEgJiYgKFxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGFsaWduSXRlbXM6ICdjZW50ZXInLCBtdDogMyB9fT5cbiAgICAgICAgICAgICAgPERlcml2ZWRBZGRyZXNzZXMgYWRkcmVzc2VzPXthZGRyZXNzZXN9IC8+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxQYWdlTmF2XG4gICAgICAgICAgb25CYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN0ZXBOdW1iZXIpIHtcbiAgICAgICAgICAgICAgY2FwdHVyZSgnT25ib2FyZGluZ0NhbmNlbGxlZCcsIHtcbiAgICAgICAgICAgICAgICBzdGVwOiBPbmJvYXJkaW5nUGhhc2UuS0VZU1RPTkVfVFVUT1JJQUwsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBoaXN0b3J5LmdvQmFjaygpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRTdGVwTnVtYmVyKHN0ZXBOdW1iZXIgLSAxKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTmV4dD17KCkgPT4ge1xuICAgICAgICAgICAgaWYgKHN0ZXBOdW1iZXIgPT09IHR1dG9yaWFsTGFzdFN0ZXAgKyAxKSB7XG4gICAgICAgICAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5DUkVBVEVfUEFTU1dPUkQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0ZXBOdW1iZXIgPT09IHR1dG9yaWFsTGFzdFN0ZXApIHtcbiAgICAgICAgICAgICAgc2V0SXNRUkNvZGVTY2FuT3Blbih0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyICsgMSA9PT0gc3RlcHMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RlcE51bWJlcihzdGVwTnVtYmVyICsgMSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBkaXNhYmxlTmV4dD17ZmFsc2V9XG4gICAgICAgICAgZXhwYW5kPXt0cnVlfVxuICAgICAgICAgIHN0ZXBzPXs2fVxuICAgICAgICAgIGFjdGl2ZVN0ZXA9e3N0ZXBOdW1iZXJ9XG4gICAgICAgICAgbmV4dFRleHQ9e25leHRCdXR0b25MYWJlbHNbc3RlcE51bWJlcl19XG4gICAgICAgID5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuKEtFWVNUT05FX0NPTk5FQ1RfU1VQUE9SVF9VUkwsICdfYmxhbmsnLCAnbm9yZWZlcnJlcicpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8RXh0ZXJuYWxMaW5rSWNvblxuICAgICAgICAgICAgICBzaXplPXsxNn1cbiAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICdzZWNvbmRhcnkubWFpbicsIG1hcmdpblJpZ2h0OiAxIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGNvbG9yOiAnc2Vjb25kYXJ5Lm1haW4nLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ0tleXN0b25lIFN1cHBvcnQnKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9QYWdlTmF2PlxuICAgICAgICB7aXNRUkNvZGVTY2FuT3BlbiAmJiAoXG4gICAgICAgICAgPEtleXN0b25lUVJDb2RlU2Nhbm5lclxuICAgICAgICAgICAgb25DYW5jZWw9eygpID0+IHNldElzUVJDb2RlU2Nhbk9wZW4oZmFsc2UpfVxuICAgICAgICAgICAgc2V0WFB1YktleT17eHB1YkNoYW5nZUhhbmRsZXJ9XG4gICAgICAgICAgICBzZXRNYXN0ZXJGaW5nZXJQcmludD17c2V0TWFzdGVyRmluZ2VycHJpbnR9XG4gICAgICAgICAgICBvblN1Y2Nlc3M9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0SXNRUkNvZGVTY2FuT3BlbihmYWxzZSk7XG4gICAgICAgICAgICAgIHNldFN0ZXBOdW1iZXIoc3RlcE51bWJlciArIDEpO1xuICAgICAgICAgICAgICBnZXRBZGRyZXNzRnJvbVhwdWJLZXkoeFB1YktleSwgMCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgIDwvPlxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIHVzZUVmZmVjdCxcbiAgdXNlU3RhdGUsXG4gIHVzZUNhbGxiYWNrLFxuICBEaXNwYXRjaCxcbiAgU2V0U3RhdGVBY3Rpb24sXG4gIHVzZVJlZixcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIEJ1dHRvbixcbiAgRXh0ZXJuYWxMaW5rSWNvbixcbiAgdXNlVGhlbWUsXG4gIFhJY29uLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vT3ZlcmxheSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgQ3J5cHRvTXVsdGlBY2NvdW50cyB9IGZyb20gJ0BrZXlzdG9uZWhxL2JjLXVyLXJlZ2lzdHJ5LWV0aCc7XG5pbXBvcnQgeyB1c2VLZXlzdG9uZVNjYW5uZXJDb250ZW50cyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlS2V5c3RvbmVTY2FubmVyQ29udGVudHMnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuXG5leHBvcnQgY29uc3QgS0VZU1RPTkVfQ09OTkVDVF9TVVBQT1JUX1VSTCA9XG4gICdodHRwczovL3N1cHBvcnQua2V5c3Qub25lL2dldHRpbmctc3RhcnRlZC9uZXctaG93LXRvLXN5bmMta2V5c3RvbmUtd2l0aC1jb21wYXRpYmxlLXNvZnR3YXJlLXdhbGxldHMnO1xuXG5pbnRlcmZhY2UgS2V5c3RvbmVQcm9wcyB7XG4gIG9uQ2FuY2VsKCk6IHZvaWQ7XG4gIHNldFhQdWJLZXk6IChuZXdWYWx1ZTogc3RyaW5nKSA9PiB2b2lkO1xuICBzZXRNYXN0ZXJGaW5nZXJQcmludDogRGlzcGF0Y2g8U2V0U3RhdGVBY3Rpb248c3RyaW5nPj47XG4gIG9uU3VjY2VzcygpOiB2b2lkO1xufVxuXG5jb25zdCBwcm9tcHRBY2Nlc3MgPSAoc2V0Q2FtZXJhUGVybWlzc2lvbikgPT4ge1xuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgLmdldFVzZXJNZWRpYSh7XG4gICAgICB2aWRlbzogdHJ1ZSxcbiAgICB9KVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHNldENhbWVyYVBlcm1pc3Npb24oJ2dyYW50ZWQnKTtcbiAgICB9KVxuICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICBzZXRDYW1lcmFQZXJtaXNzaW9uKCdkZW5pZWQnKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBLZXlzdG9uZVFSQ29kZVNjYW5uZXIgPSAoe1xuICBvbkNhbmNlbCxcbiAgc2V0WFB1YktleSxcbiAgc2V0TWFzdGVyRmluZ2VyUHJpbnQsXG4gIG9uU3VjY2Vzcyxcbn06IEtleXN0b25lUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IHBhbGV0dGUgfSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgY29uc3QgW2NhbWVyYVBlcm1pc3Npb24sIHNldENhbWVyYVBlcm1pc3Npb25dID0gdXNlU3RhdGU8UGVybWlzc2lvblN0YXRlPigpO1xuICBjb25zdCBbaGFzRXJyb3IsIHNldEhhc0Vycm9yXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgYXR0ZW1wdHMgPSB1c2VSZWY8bnVtYmVyW10+KFtdKTtcblxuICBjb25zdCBoYW5kbGVTY2FuID0gdXNlQ2FsbGJhY2soXG4gICAgKHsgY2JvciB9OiB7IHR5cGU6IHN0cmluZzsgY2Jvcjogc3RyaW5nIH0pID0+IHtcbiAgICAgIGF0dGVtcHRzLmN1cnJlbnQgPSBbXTtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGNib3IsICdoZXgnKTtcbiAgICAgIGNvbnN0IGNyeXB0b011bHRpQWNjb3VudHMgPSBDcnlwdG9NdWx0aUFjY291bnRzLmZyb21DQk9SKGJ1ZmZlcik7XG5cbiAgICAgIGNvbnN0IG1hc3RlckZpbmdlcnByaW50ID0gY3J5cHRvTXVsdGlBY2NvdW50cy5nZXRNYXN0ZXJGaW5nZXJwcmludCgpO1xuICAgICAgc2V0TWFzdGVyRmluZ2VyUHJpbnQobWFzdGVyRmluZ2VycHJpbnQudG9TdHJpbmcoJ2hleCcpKTtcbiAgICAgIGNvbnN0IGtleXMgPSBjcnlwdG9NdWx0aUFjY291bnRzLmdldEtleXMoKTtcblxuICAgICAgY29uc3Qga2V5ID0ga2V5c1swXTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBjb25zdCB4cHViID0ga2V5LmdldEJpcDMyS2V5KCk7XG4gICAgICAgIHNldFhQdWJLZXkoeHB1Yik7XG4gICAgICAgIGNhcHR1cmUoYEtleXN0b25lU2NhblFSQ29kZVN1Y2Nlc3NgKTtcbiAgICAgICAgb25TdWNjZXNzKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbY2FwdHVyZSwgb25TdWNjZXNzLCBzZXRNYXN0ZXJGaW5nZXJQcmludCwgc2V0WFB1YktleV0sXG4gICk7XG5cbiAgY29uc3QgaGFuZGxlRXJyb3IgPSB1c2VDYWxsYmFjayhcbiAgICAoZXJyb3IpID0+IHtcbiAgICAgIGlmICghL15EaW1lbnNpb25zL2kudGVzdChlcnJvcikpIHtcbiAgICAgICAgY2FwdHVyZShgS2V5c3RvbmVTY2FuUVJDb2RlRXJyb3JgKTtcbiAgICAgICAgc2V0SGFzRXJyb3IodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGF0dGVtcHRzLmN1cnJlbnQucHVzaChEYXRlLm5vdygpKTtcbiAgICAgIGlmIChhdHRlbXB0cy5jdXJyZW50Lmxlbmd0aCA9PT0gNSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgYXR0ZW1wdHMuY3VycmVudFs0XSAmJlxuICAgICAgICAgIGF0dGVtcHRzLmN1cnJlbnRbMF0gJiZcbiAgICAgICAgICBhdHRlbXB0cy5jdXJyZW50WzRdIC0gYXR0ZW1wdHMuY3VycmVudFswXSA8IDUwMFxuICAgICAgICApIHtcbiAgICAgICAgICBjYXB0dXJlKGBLZXlzdG9uZVNjYW5RUkNvZGVEaW1lbnNpb25zRXJyb3JgKTtcbiAgICAgICAgICBzZXRIYXNFcnJvcih0cnVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYXR0ZW1wdHMuY3VycmVudCA9IFtdO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2NhcHR1cmVdLFxuICApO1xuXG4gIGNvbnN0IHBhZ2VDb250ZW50ID0gdXNlS2V5c3RvbmVTY2FubmVyQ29udGVudHMoe1xuICAgIGNhbWVyYVBlcm1pc3Npb24sXG4gICAgaGFzRXJyb3IsXG4gICAgc2V0SGFzRXJyb3IsXG4gICAgaGFuZGxlU2NhbixcbiAgICBoYW5kbGVFcnJvcixcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBwcm9tcHRBY2Nlc3Moc2V0Q2FtZXJhUGVybWlzc2lvbik7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFzeW5jIGZ1bmN0aW9uIGdldFBlcm1pc3Npb25zKCkge1xuICAgICAgY29uc3QgcGVybWlzc2lvbiA9IGF3YWl0IG5hdmlnYXRvci5wZXJtaXNzaW9ucy5xdWVyeSh7XG4gICAgICAgIG5hbWU6ICdjYW1lcmEnIGFzIFBlcm1pc3Npb25OYW1lLCAvLyB3b3JrYXJvdW5kIHRvIGF2b2lkIHRoZSB0cyBlcnJvclxuICAgICAgfSk7XG4gICAgICBwZXJtaXNzaW9uLm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBwcm9tcHRBY2Nlc3Moc2V0Q2FtZXJhUGVybWlzc2lvbik7XG4gICAgICAgIGlmIChwZXJtaXNzaW9uLnN0YXRlID09PSAnZGVuaWVkJykge1xuICAgICAgICAgIGNhcHR1cmUoYEtleXN0b25lU2NhblFSQ2FtZXJhQWNjZXNzRGVuaWVkYCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIGdldFBlcm1pc3Npb25zKCk7XG4gIH0sIFtjYXB0dXJlXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8T3ZlcmxheT5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnNTEycHgnLFxuICAgICAgICAgIG1pbkhlaWdodDogJzQ5NXB4JyxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBwYWxldHRlLmJhY2tncm91bmQucGFwZXIsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgcHQ6IDIsXG4gICAgICAgICAgICBweDogMixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJoNFwiXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBwdDogMyxcbiAgICAgICAgICAgICAgcHg6IDQsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BrZXlzdG9uZS1tb2RhbC1oZWFkZXJgfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtwYWdlQ29udGVudD8uaGVhZExpbmV9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtga2V5c3RvbmUtbW9kYWwtY2xvc2UtYnV0dG9uYH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2FuY2VsfVxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgcDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDMpLFxuICAgICAgICAgICAgICB3aWR0aDogdGhlbWUuc3BhY2luZygzKSxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IHRoZW1lLnNwYWNpbmcoMyksXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxYSWNvbiBzaXplPXsyNH0gc3g9e3sgY29sb3I6ICdwcmltYXJ5Lm1haW4nIH19IC8+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgIHB0OiAxLFxuICAgICAgICAgICAgcHg6IDYsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIG1pbkhlaWdodD17NDB9PlxuICAgICAgICAgICAge3BhZ2VDb250ZW50Py5kZXNjcmlwdGlvbn1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtwYWdlQ29udGVudD8uY29udGVudH1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGp1c3RpZnlJdGVtczogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgYWxpZ25Db250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIG1iOiAzLFxuICAgICAgICAgICAgcm93R2FwOiAyLFxuICAgICAgICAgICAgcHQ6IDEsXG4gICAgICAgICAgICBweDogNixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3BhZ2VDb250ZW50Py5oZWxwZXJUZXh0fVxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgd2luZG93Lm9wZW4oS0VZU1RPTkVfQ09OTkVDVF9TVVBQT1JUX1VSTCwgJ19ibGFuaycsICdub3JlZmVycmVyJyk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxFeHRlcm5hbExpbmtJY29uXG4gICAgICAgICAgICAgIHNpemU9ezE2fVxuICAgICAgICAgICAgICBzeD17eyBjb2xvcjogJ3NlY29uZGFyeS5tYWluJywgbWFyZ2luUmlnaHQ6IDEgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgY29sb3I6ICdzZWNvbmRhcnkubWFpbicsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnS2V5c3RvbmUgU3VwcG9ydCcpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L092ZXJsYXk+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IE9uYm9hcmRpbmdTdGVwSGVhZGVyIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9PbmJvYXJkaW5nU3RlcEhlYWRlcic7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VPbmJvYXJkaW5nQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvT25ib2FyZGluZ1Byb3ZpZGVyJztcbmltcG9ydCB7IFRyYW5zLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgTGVkZ2VyV3JvbmdWZXJzaW9uT3ZlcmxheSB9IGZyb20gJy4uLy4uLy4uL0xlZGdlci9MZWRnZXJXcm9uZ1ZlcnNpb25PdmVybGF5JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgRXh0ZXJuYWxMaW5rSWNvbixcbiAgSW5mb0NpcmNsZUljb24sXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFBhZ2VOYXYgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL1BhZ2VOYXYnO1xuaW1wb3J0IHtcbiAgT05CT0FSRElOR19FVkVOVF9OQU1FUyxcbiAgT25ib2FyZGluZ1BoYXNlLFxuICBPbmJvYXJkaW5nVVJMcyxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL29uYm9hcmRpbmcvbW9kZWxzJztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7XG4gIExlZGdlckNvbm5lY3RvcixcbiAgTGVkZ2VyQ29ubmVjdG9yRGF0YSxcbn0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2xlZGdlci9MZWRnZXJDb25uZWN0b3InO1xuaW1wb3J0IHsgV2FsbGV0VHlwZSB9IGZyb20gJ0BhdmFsYWJzL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBBZGRyZXNzVHlwZSB7XG4gIGFkZHJlc3M6IHN0cmluZztcbiAgYmFsYW5jZTogc3RyaW5nO1xufVxuXG5leHBvcnQgZW51bSBMZWRnZXJTdGF0dXMge1xuICBMRURHRVJfVU5JTklUSUFURUQgPSAndW5pbml0aWF0ZWQnLFxuICBMRURHRVJfTE9BRElORyA9ICdsb2FkaW5nJyxcbiAgTEVER0VSX0NPTk5FQ1RFRCA9ICdjb25uZWN0ZWQnLFxuICBMRURHRVJfQ09OTkVDVElPTl9GQUlMRUQgPSAnZmFpbGVkJyxcbn1cblxuLyoqXG4gKiBXYWl0aW5nIHRoaXMgYW1vdW50IG9mIHRpbWUgb3RoZXJ3aXNlIHRoaXMgc2NyZWVuIHdvdWxkIGJlIGEgYmxpcCBhbmQgdGhlIHVzZXIgd291bGRudCBldmVuIGtub3cgaXQgaGFwcGVuZWRcbiAqL1xuZXhwb3J0IGNvbnN0IFdBSVRfMTUwMF9NSUxMSV9GT1JfVVNFUiA9IDE1MDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBMZWRnZXJDb25uZWN0KCkge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCB7XG4gICAgc2V0WHB1YixcbiAgICBzZXRYcHViWFAsXG4gICAgc2V0UHVibGljS2V5cyxcbiAgICBzZXRPbmJvYXJkaW5nUGhhc2UsXG4gICAgc2V0T25ib2FyZGluZ1dhbGxldFR5cGUsXG4gICAgc2V0TnVtYmVyT2ZBY2NvdW50c1RvQ3JlYXRlLFxuICB9ID0gdXNlT25ib2FyZGluZ0NvbnRleHQoKTtcbiAgY29uc3QgW2hhc1B1YmxpY0tleXMsIHNldEhhc1B1YmxpY0tleXNdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldE9uYm9hcmRpbmdQaGFzZShPbmJvYXJkaW5nUGhhc2UuTEVER0VSKTtcbiAgICBzZXRPbmJvYXJkaW5nV2FsbGV0VHlwZShXYWxsZXRUeXBlLkxlZGdlcik7XG4gICAgY2FwdHVyZShPTkJPQVJESU5HX0VWRU5UX05BTUVTLmxlZGdlcik7XG4gIH0sIFtjYXB0dXJlLCBzZXRPbmJvYXJkaW5nUGhhc2UsIHNldE9uYm9hcmRpbmdXYWxsZXRUeXBlXSk7XG5cbiAgZnVuY3Rpb24gb25TdWNjZXNzKGRhdGE6IExlZGdlckNvbm5lY3RvckRhdGEpIHtcbiAgICBzZXRYcHViKGRhdGEueHB1Yik7XG4gICAgc2V0WHB1YlhQKGRhdGEueHB1YlhQKTtcbiAgICBzZXRQdWJsaWNLZXlzKGRhdGEucHVibGljS2V5cyk7XG4gICAgc2V0SGFzUHVibGljS2V5cyhkYXRhLmhhc1B1YmxpY0tleXMpO1xuICAgIHNldE51bWJlck9mQWNjb3VudHNUb0NyZWF0ZShkYXRhLmxhc3RBY2NvdW50SW5kZXhXaXRoQmFsYW5jZSArIDEpO1xuICB9XG5cbiAgY29uc3QgQ29udGVudCA9IChcbiAgICA8VHJhbnNcbiAgICAgIGkxOG5LZXk9XCI8dHlwb2dyYXBoeT5UaGlzIHByb2Nlc3MgcmV0cmlldmVzIHRoZSBhZGRyZXNzZXM8YnIgLz5mcm9tIHlvdXIgbGVkZ2VyPC90eXBvZ3JhcGh5PlwiXG4gICAgICBjb21wb25lbnRzPXt7XG4gICAgICAgIHR5cG9ncmFwaHk6IDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgLz4sXG4gICAgICB9fVxuICAgIC8+XG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxPbmJvYXJkaW5nU3RlcEhlYWRlclxuICAgICAgICB0ZXN0SWQ9XCJjb25uZWN0LWxlZGdlclwiXG4gICAgICAgIHRpdGxlPXt0KCdDb25uZWN0IHlvdXIgTGVkZ2VyJyl9XG4gICAgICAvPlxuICAgICAgPFN0YWNrIHN4PXt7IGZsZXhHcm93OiAxLCBwdDogMSwgcHg6IDYgfX0+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgIHt0KCdTZWxlY3QgYSBkZXJpdmF0aW9uIHBhdGggdG8gc2VlIHlvdXIgZGVyaXZlZCBhZGRyZXNzZXMuJyl9XG4gICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgIHRpdGxlPXtDb250ZW50fVxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZScsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICBwbDogdGhlbWUuc3BhY2luZygxKSxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxJbmZvQ2lyY2xlSWNvbiBzaXplPXsxNH0gLz5cbiAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFN0YWNrIHN4PXt7IG10OiA3LjUgfX0+XG4gICAgICAgICAgPExlZGdlckNvbm5lY3RvclxuICAgICAgICAgICAgb25TdWNjZXNzPXtvblN1Y2Nlc3N9XG4gICAgICAgICAgICBvblRyb3VibGVzaG9vdD17KCkgPT4gaGlzdG9yeS5wdXNoKE9uYm9hcmRpbmdVUkxzLkxFREdFUl9UUk9VQkxFKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxQYWdlTmF2XG4gICAgICAgIG9uQmFjaz17KCkgPT4ge1xuICAgICAgICAgIGNhcHR1cmUoJ09uYm9hcmRpbmdDYW5jZWxsZWQnLCB7IHN0ZXA6IE9uYm9hcmRpbmdQaGFzZS5MRURHRVIgfSk7XG4gICAgICAgICAgaGlzdG9yeS5nb0JhY2soKTtcbiAgICAgICAgfX1cbiAgICAgICAgb25OZXh0PXsoKSA9PiBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuQ1JFQVRFX1BBU1NXT1JEKX1cbiAgICAgICAgZGlzYWJsZU5leHQ9eyFoYXNQdWJsaWNLZXlzfVxuICAgICAgICBleHBhbmQ9e3RydWV9XG4gICAgICAgIHN0ZXBzPXszfVxuICAgICAgICBhY3RpdmVTdGVwPXswfVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKFxuICAgICAgICAgICAgICAnaHR0cHM6Ly93d3cubGVkZ2VyLmNvbS9sZWRnZXItbGl2ZScsXG4gICAgICAgICAgICAgICdfYmxhbmsnLFxuICAgICAgICAgICAgICAnbm9yZWZlcnJlcicsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8RXh0ZXJuYWxMaW5rSWNvbiBzaXplPXsxNn0gc3g9e3sgY29sb3I6ICdzZWNvbmRhcnkubWFpbicgfX0gLz5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgbWw6IDEsXG4gICAgICAgICAgICAgIGNvbG9yOiAnc2Vjb25kYXJ5Lm1haW4nLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnTGVkZ2VyIExpdmUgU3VwcG9ydCcpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L1BhZ2VOYXY+XG5cbiAgICAgIDxMZWRnZXJXcm9uZ1ZlcnNpb25PdmVybGF5IG9uQ2xvc2U9eygpID0+IGhpc3RvcnkuZ29CYWNrKCl9IC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IE9uYm9hcmRpbmdTdGVwSGVhZGVyIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9PbmJvYXJkaW5nU3RlcEhlYWRlcic7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBFeHRlcm5hbExpbmtJY29uLFxuICBSZW1vdGVJY29uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBPbmJvYXJkaW5nVVJMcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9vbmJvYXJkaW5nL21vZGVscyc7XG5pbXBvcnQgeyB1c2VMYW5ndWFnZSB9IGZyb20gJ0BzcmMvaG9va3MvdXNlTGFuZ3VhZ2VzJztcbmltcG9ydCB7IFR5cG9ncmFwaHlMaW5rIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9UeXBvZ3JhcGh5TGluayc7XG5pbXBvcnQgeyBMZWRnZXJUcm91YmxlU3RlcHMgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21wb25lbnRzL2xlZGdlci9MZWRnZXJUcm91Ymxlc1N0ZXBzJztcblxuZXhwb3J0IGZ1bmN0aW9uIExlZGdlclRyb3VibGUoKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7IGN1cnJlbnRMYW5ndWFnZSB9ID0gdXNlTGFuZ3VhZ2UoKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6ICczOTBweCcsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICBtdDogNCxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPE9uYm9hcmRpbmdTdGVwSGVhZGVyXG4gICAgICAgIHRlc3RJZD1cImxlZGdlci10cm91YmxlXCJcbiAgICAgICAgdGl0bGU9e3QoJ1Ryb3VibGUgQ29ubmVjdGluZycpfVxuICAgICAgLz5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgIHB0OiAxLFxuICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFjayBzeD17eyB0ZXh0QWxpZ246ICdjZW50ZXInIH19PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IG10OiAxIH19PlxuICAgICAgICAgICAge3QoXCJXZSdyZSBoYXZpbmcgdHJvdWJsZSBjb25uZWN0aW5nIHRvIHlvdXIgZGV2aWNlLlwiKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFjaz5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgYWxpZ25JdGVtczogJ2NlbnRlcicsIG10OiA0LCBtYjogMyB9fT5cbiAgICAgICAgICAgIDxSZW1vdGVJY29uIHNpemU9ezg4fSAvPlxuICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICA8TGVkZ2VyVHJvdWJsZVN0ZXBzIHN4PXt7IHB0OiAxLjUgfX0gLz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGp1c3RpZnlJdGVtczogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgIGFsaWduQ29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgbWI6IDksXG4gICAgICAgICAgcm93R2FwOiB0aGVtZS5zcGFjaW5nKDIpLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgY29sdW1uR2FwOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBhZ2UtbmF2LWJhY2stYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaGlzdG9yeS5nb0JhY2soKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB3aWR0aDogdGhlbWUuc3BhY2luZygyMSksXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdCYWNrJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYWdlLW5hdi1uZXh0LWJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5PTkJPQVJESU5HX0hPTUUpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHdpZHRoOiB0aGVtZS5zcGFjaW5nKDIxKSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ0NhbmNlbCcpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2sgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBmbGV4RGlyZWN0aW9uOiAncm93JyB9fT5cbiAgICAgICAgICA8VHlwb2dyYXBoeUxpbmtcbiAgICAgICAgICAgIGFzPVwiYVwiXG4gICAgICAgICAgICBocmVmPXtgaHR0cHM6Ly9zdXBwb3J0LmxlZGdlci5jb20vaGMvJHtcbiAgICAgICAgICAgICAgY3VycmVudExhbmd1YWdlPy5jb2RlIHx8ICdlbi11cydcbiAgICAgICAgICAgIH0vY2F0ZWdvcmllcy80NDA0Mzc2MTM5NDA5P2RvY3M9dHJ1ZWB9XG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdMZWRnZXIgTGl2ZSBTdXBwb3J0Jyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5TGluaz5cbiAgICAgICAgICA8RXh0ZXJuYWxMaW5rSWNvblxuICAgICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgICBzeD17eyBjb2xvcjogJ3NlY29uZGFyeS5tYWluJywgbWFyZ2luTGVmdDogMSB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBLZXlJY29uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgVXNiSWNvbixcbiAgUVJDb2RlSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IE9uYm9hcmRpbmdTdGVwSGVhZGVyIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9PbmJvYXJkaW5nU3RlcEhlYWRlcic7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IE1ldGhvZENhcmQgfSBmcm9tICcuL2NvbXBvbmVudHMvTWV0aG9kQ2FyZCc7XG5pbXBvcnQgeyBQYWdlTmF2IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9QYWdlTmF2JztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBGZWF0dXJlR2F0ZXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmVhdHVyZUZsYWdzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIEF1dGhlbnRpY2F0b3JNb2RhbCxcbiAgQXV0aGVudGljYXRvclN0ZXBzLFxufSBmcm9tICcuL21vZGFscy9BdXRoZW50aWNhdG9yTW9kYWwnO1xuaW1wb3J0IHsgT25ib2FyZGluZ1VSTHMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvb25ib2FyZGluZy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlT25ib2FyZGluZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL09uYm9hcmRpbmdQcm92aWRlcic7XG5pbXBvcnQgeyBGSURPTW9kYWwgfSBmcm9tICcuL21vZGFscy9GSURPTW9kYWwnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgSW5saW5lQm9sZCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vSW5saW5lQm9sZCc7XG5pbXBvcnQgeyBSZWNvdmVyeU1ldGhvZFR5cGVzIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlU2VlZGxlc3NBY3Rpb25zIH0gZnJvbSAnLi4vLi4vaG9va3MvdXNlU2VlZGxlc3NBY3Rpb25zJztcbmltcG9ydCB7IFdhbGxldFR5cGUgfSBmcm9tICdAYXZhbGFicy90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWNvdmVyeU1ldGhvZHMoKSB7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IFtzZWxlY3RlZE1ldGhvZCwgc2V0U2VsZWN0ZWRNZXRob2RdID1cbiAgICB1c2VTdGF0ZTxSZWNvdmVyeU1ldGhvZFR5cGVzIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtpc01vZGFsT3Blbiwgc2V0SXNNb2RhbE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCB7IGZlYXR1cmVGbGFncyB9ID0gdXNlRmVhdHVyZUZsYWdDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBvaWRjVG9rZW4sXG4gICAgaXNTZWVkbGVzc01mYVJlcXVpcmVkOiBpc1NlZWRsZXNzTWZhUmVxdWlyZWRGb3JBY2NvdW50LFxuICAgIHNldE9uYm9hcmRpbmdXYWxsZXRUeXBlLFxuICB9ID0gdXNlT25ib2FyZGluZ0NvbnRleHQoKTtcbiAgY29uc3QgeyBsb2dpbldpdGhvdXRNRkEgfSA9IHVzZVNlZWRsZXNzQWN0aW9ucygpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFvaWRjVG9rZW4pIHtcbiAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5PTkJPQVJESU5HX0hPTUUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSwgW2hpc3RvcnksIG9pZGNUb2tlbiwgdF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0T25ib2FyZGluZ1dhbGxldFR5cGUoV2FsbGV0VHlwZS5TZWVkbGVzcyk7XG4gICAgaWYgKHNlbGVjdGVkTWV0aG9kKSB7XG4gICAgICBzZXRJc01vZGFsT3Blbih0cnVlKTtcbiAgICB9XG4gIH0sIFtzZWxlY3RlZE1ldGhvZCwgc2V0T25ib2FyZGluZ1dhbGxldFR5cGVdKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzQyMHB4JyxcbiAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPE9uYm9hcmRpbmdTdGVwSGVhZGVyXG4gICAgICAgICAgdGVzdElkPVwiY29weS1waHJhc2VcIlxuICAgICAgICAgIHRpdGxlPXt0KCdBZGQgUmVjb3ZlcnkgTWV0aG9kcycpfVxuICAgICAgICAvPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgbWI6IDMsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IG1iOiA1IH19PlxuICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgIGkxOG5LZXk9XCJBZGQgPGJvbGQ+b25lPC9ib2xkPiByZWNvdmVyeSBtZXRob2QgdG8gY29udGludWUuXCJcbiAgICAgICAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgICAgICAgIGJvbGQ6IDxJbmxpbmVCb2xkIC8+LFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgcm93R2FwOiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7ZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5TRUVETEVTU19NRkFfUEFTU0tFWV0gJiYgKFxuICAgICAgICAgICAgICA8TWV0aG9kQ2FyZFxuICAgICAgICAgICAgICAgIGljb249ezxLZXlJY29uIHNpemU9ezI0fSAvPn1cbiAgICAgICAgICAgICAgICB0aXRsZT17dCgnUGFzc2tleScpfVxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPXt0KCdBZGQgYSBQYXNza2V5IGFzIGEgcmVjb3ZlcnkgbWV0aG9kLicpfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkTWV0aG9kKFJlY292ZXJ5TWV0aG9kVHlwZXMuUEFTU0tFWSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2ZlYXR1cmVGbGFnc1tGZWF0dXJlR2F0ZXMuU0VFRExFU1NfTUZBX0FVVEhFTlRJQ0FUT1JdICYmIChcbiAgICAgICAgICAgICAgPE1ldGhvZENhcmRcbiAgICAgICAgICAgICAgICBpY29uPXs8UVJDb2RlSWNvbiBzaXplPXsyNH0gLz59XG4gICAgICAgICAgICAgICAgdGl0bGU9e3QoJ0F1dGhlbnRpY2F0b3InKX1cbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbj17dChcbiAgICAgICAgICAgICAgICAgICdVc2UgYW4gYXV0aGVudGljYXRvciBhcHAgYXMgYSByZWNvdmVyeSBtZXRob2QuJyxcbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkTWV0aG9kKFJlY292ZXJ5TWV0aG9kVHlwZXMuVE9UUCl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2ZlYXR1cmVGbGFnc1tGZWF0dXJlR2F0ZXMuU0VFRExFU1NfTUZBX1lVQklLRVldICYmIChcbiAgICAgICAgICAgICAgPE1ldGhvZENhcmRcbiAgICAgICAgICAgICAgICBpY29uPXs8VXNiSWNvbiBzaXplPXsyNH0gLz59XG4gICAgICAgICAgICAgICAgdGl0bGU9e3QoJ1l1YmlrZXknKX1cbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbj17dCgnQWRkIGEgWXViaWtleSBhcyBhIHJlY292ZXJ5IG1ldGhvZC4nKX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWxlY3RlZE1ldGhvZChSZWNvdmVyeU1ldGhvZFR5cGVzLllVQklLRVkpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgIDxQYWdlTmF2XG4gICAgICAgICAgb25CYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBoaXN0b3J5LmdvQmFjaygpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgbmV4dFRleHQ9e3QoJ1NldCBVcCBMYXRlcicpfVxuICAgICAgICAgIGRpc2FibGVOZXh0PXtcbiAgICAgICAgICAgICFmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLlNFRURMRVNTX09QVElPTkFMX01GQV0gfHxcbiAgICAgICAgICAgIGlzU2VlZGxlc3NNZmFSZXF1aXJlZEZvckFjY291bnRcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dERpc2FibGVkUmVhc29uPXtcbiAgICAgICAgICAgICFmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLlNFRURMRVNTX09QVElPTkFMX01GQV1cbiAgICAgICAgICAgICAgPyB0KCdDb21pbmcgc29vbiEnKVxuICAgICAgICAgICAgICA6IGlzU2VlZGxlc3NNZmFSZXF1aXJlZEZvckFjY291bnRcbiAgICAgICAgICAgICAgICA/IHQoJ01GQSBjb25maWd1cmF0aW9uIGlzIHJlcXVpcmVkIGZvciB5b3VyIGFjY291bnQuJylcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgICAgIH1cbiAgICAgICAgICBvbk5leHQ9e2FzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IGxvZ2luV2l0aG91dE1GQSgpO1xuICAgICAgICAgICAgaGlzdG9yeS5wdXNoKE9uYm9hcmRpbmdVUkxzLkNSRUFURV9QQVNTV09SRCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBhY3RpdmVTdGVwPXswfVxuICAgICAgICAgIHN0ZXBzPXszfVxuICAgICAgICAvPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIHtpc01vZGFsT3BlbiAmJiBzZWxlY3RlZE1ldGhvZCA9PT0gUmVjb3ZlcnlNZXRob2RUeXBlcy5UT1RQICYmIChcbiAgICAgICAgPEF1dGhlbnRpY2F0b3JNb2RhbFxuICAgICAgICAgIGFjdGl2ZVN0ZXA9e0F1dGhlbnRpY2F0b3JTdGVwcy5TQ0FOfVxuICAgICAgICAgIG9uRmluaXNoPXsoKSA9PiB7XG4gICAgICAgICAgICBjYXB0dXJlKCdyZWNvdmVyeU1ldGhvZEFkZGVkJywgeyBtZXRob2Q6IHNlbGVjdGVkTWV0aG9kIH0pO1xuICAgICAgICAgICAgaGlzdG9yeS5wdXNoKE9uYm9hcmRpbmdVUkxzLkNSRUFURV9QQVNTV09SRCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNhbmNlbD17KCkgPT4ge1xuICAgICAgICAgICAgY2FwdHVyZShgRmlkb0RldmljZSR7c2VsZWN0ZWRNZXRob2R9Q2FuY2VsbGVkYCk7XG4gICAgICAgICAgICBzZXRJc01vZGFsT3BlbihmYWxzZSk7XG4gICAgICAgICAgICBzZXRTZWxlY3RlZE1ldGhvZChudWxsKTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtpc01vZGFsT3BlbiAmJlxuICAgICAgICAoc2VsZWN0ZWRNZXRob2QgPT09IFJlY292ZXJ5TWV0aG9kVHlwZXMuWVVCSUtFWSB8fFxuICAgICAgICAgIHNlbGVjdGVkTWV0aG9kID09PSBSZWNvdmVyeU1ldGhvZFR5cGVzLlBBU1NLRVkpICYmIChcbiAgICAgICAgICA8RklET01vZGFsXG4gICAgICAgICAgICBvbkZpbmlzaD17KCkgPT4ge1xuICAgICAgICAgICAgICBjYXB0dXJlKGByZWNvdmVyeU1ldGhvZEFkZGVkYCwgeyBtZXRob2Q6IHNlbGVjdGVkTWV0aG9kIH0pO1xuICAgICAgICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuQ1JFQVRFX1BBU1NXT1JEKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkNhbmNlbD17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRJc01vZGFsT3BlbihmYWxzZSk7XG4gICAgICAgICAgICAgIGNhcHR1cmUoYEZpZG9EZXZpY2Uke3NlbGVjdGVkTWV0aG9kfUNhbmNlbGxlZGApO1xuICAgICAgICAgICAgICBzZXRTZWxlY3RlZE1ldGhvZChudWxsKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBzZWxlY3RlZE1ldGhvZD17c2VsZWN0ZWRNZXRob2R9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEtleUljb24sXG4gIFFSQ29kZUljb24sXG4gIFNrZWxldG9uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdG9hc3QsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPbmJvYXJkaW5nU3RlcEhlYWRlciB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvT25ib2FyZGluZ1N0ZXBIZWFkZXInO1xuaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBNZXRob2RDYXJkIH0gZnJvbSAnLi9jb21wb25lbnRzL01ldGhvZENhcmQnO1xuaW1wb3J0IHsgUGFnZU5hdiB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvUGFnZU5hdic7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEZlYXR1cmVHYXRlcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9mZWF0dXJlRmxhZ3MvbW9kZWxzJztcbmltcG9ydCB7IHVzZUZlYXR1cmVGbGFnQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvRmVhdHVyZUZsYWdzUHJvdmlkZXInO1xuaW1wb3J0IHsgT25ib2FyZGluZ1VSTHMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvb25ib2FyZGluZy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlT25ib2FyZGluZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL09uYm9hcmRpbmdQcm92aWRlcic7XG5pbXBvcnQgeyBUT1RQTW9kYWwgfSBmcm9tICcuL21vZGFscy9UT1RQTW9kYWwnO1xuaW1wb3J0IHsgZ2V0T2lkY0NsaWVudCB9IGZyb20gJ0BzcmMvdXRpbHMvc2VlZGxlc3MvZ2V0Q3ViZVNpZ25lcic7XG5pbXBvcnQgeyBGSURPTW9kYWwgfSBmcm9tICcuL21vZGFscy9GSURPTW9kYWwnO1xuaW1wb3J0IHsgRklET1N0ZXBzLCBSZWNvdmVyeU1ldGhvZFR5cGVzIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgV2FsbGV0VHlwZSB9IGZyb20gJ0BhdmFsYWJzL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlY292ZXJ5TWV0aG9kc0xvZ2luKCkge1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IFtzZWxlY3RlZE1ldGhvZCwgc2V0U2VsZWN0ZWRNZXRob2RdID1cbiAgICB1c2VTdGF0ZTxSZWNvdmVyeU1ldGhvZFR5cGVzIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtpc01vZGFsT3Blbiwgc2V0SXNNb2RhbE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCB7IGZlYXR1cmVGbGFncyB9ID0gdXNlRmVhdHVyZUZsYWdDb250ZXh0KCk7XG4gIGNvbnN0IHsgb2lkY1Rva2VuLCBzZXRPbmJvYXJkaW5nV2FsbGV0VHlwZSB9ID0gdXNlT25ib2FyZGluZ0NvbnRleHQoKTtcbiAgY29uc3QgW2NvbmZpZ3VyZWRNZmFzLCBzZXRDb25maWd1cmVkTWZhc10gPSB1c2VTdGF0ZTxcbiAgICB7IHR5cGU6IFJlY292ZXJ5TWV0aG9kVHlwZXM7IG5hbWU6IHN0cmluZyB9W11cbiAgPihbXSk7XG5cbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb2lkY1Rva2VuKSB7XG4gICAgICB0b2FzdC5lcnJvcih0KCdTZWVkbGVzcyBsb2dpbiBlcnJvcicpKTtcbiAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5PTkJPQVJESU5HX0hPTUUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSwgW2hpc3RvcnksIG9pZGNUb2tlbiwgdF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0T25ib2FyZGluZ1dhbGxldFR5cGUoV2FsbGV0VHlwZS5TZWVkbGVzcyk7XG4gICAgc2V0SXNMb2FkaW5nKHRydWUpO1xuICAgIGNvbnN0IGdldE1mYXMgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIW9pZGNUb2tlbikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zdCBvaWRjQ2xpZW50ID0gZ2V0T2lkY0NsaWVudChvaWRjVG9rZW4pO1xuICAgICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBvaWRjQ2xpZW50LmlkZW50aXR5UHJvdmUoKTtcbiAgICAgIGNvbnN0IGNvbmZpZ3VyZWRNZmEgPSBpZGVudGl0eS51c2VyX2luZm8/LmNvbmZpZ3VyZWRfbWZhO1xuXG4gICAgICBpZiAoY29uZmlndXJlZE1mYSkge1xuICAgICAgICBjb25zdCBtZmFzID0gY29uZmlndXJlZE1mYS5tYXAoKG1mYSkgPT4ge1xuICAgICAgICAgIGlmIChtZmEudHlwZSA9PT0gJ2ZpZG8nKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBuYW1lOiBtZmEubmFtZSxcbiAgICAgICAgICAgICAgdHlwZTogbWZhLnR5cGUgYXMgUmVjb3ZlcnlNZXRob2RUeXBlcy5GSURPLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1mYS50eXBlID09PSAndG90cCcpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgICAgICB0eXBlOiBtZmEudHlwZSBhcyBSZWNvdmVyeU1ldGhvZFR5cGVzLlRPVFAsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgICB0eXBlOiBSZWNvdmVyeU1ldGhvZFR5cGVzLlVOS05PV04sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNldENvbmZpZ3VyZWRNZmFzKG1mYXMpO1xuICAgICAgICBpZiAobWZhcy5sZW5ndGggPT09IDEgJiYgbWZhc1swXSkge1xuICAgICAgICAgIHNldFNlbGVjdGVkTWV0aG9kKG1mYXNbMF0udHlwZSk7XG4gICAgICAgICAgc2V0SXNNb2RhbE9wZW4odHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgfTtcbiAgICBnZXRNZmFzKCk7XG4gIH0sIFtvaWRjVG9rZW4sIHNldE9uYm9hcmRpbmdXYWxsZXRUeXBlXSk7XG5cbiAgY29uc3Qgb25GaW5pc2ggPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaGlzdG9yeS5wdXNoKE9uYm9hcmRpbmdVUkxzLkNSRUFURV9QQVNTV09SRCk7XG4gIH0sIFtoaXN0b3J5XSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6ICc0MjBweCcsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxPbmJvYXJkaW5nU3RlcEhlYWRlclxuICAgICAgICAgIHRlc3RJZD1cImNvcHktcGhyYXNlXCJcbiAgICAgICAgICB0aXRsZT17dCgnVmVyaWZ5IFJlY292ZXJ5IE1ldGhvZHMnKX1cbiAgICAgICAgLz5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgIG1iOiAzLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBtYjogNSB9fT5cbiAgICAgICAgICAgIDxUcmFucyBpMThuS2V5PVwiVmVyaWZ5IHlvdXIgcmVjb3ZlcnkgbWV0aG9kKHMpIHRvIGNvbnRpbnVlLlwiIC8+XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCcsXG4gICAgICAgICAgICAgIHJvd0dhcDogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2lzTG9hZGluZyAmJiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPFNrZWxldG9uXG4gICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPFNrZWxldG9uXG4gICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICc4MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtjb25maWd1cmVkTWZhcy5tYXAoKG1mYURldmljZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIG1mYURldmljZS50eXBlID09PSAndG90cCcgJiZcbiAgICAgICAgICAgICAgICAhZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5TRUVETEVTU19NRkFfQVVUSEVOVElDQVRPUl1cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgbWZhRGV2aWNlLnR5cGUgPT09ICdmaWRvJyAmJlxuICAgICAgICAgICAgICAgICFmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLlNFRURMRVNTX01GQV9QQVNTS0VZXSAmJlxuICAgICAgICAgICAgICAgICFmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLlNFRURMRVNTX01GQV9ZVUJJS0VZXVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPE1ldGhvZENhcmRcbiAgICAgICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICBpY29uPXtcbiAgICAgICAgICAgICAgICAgICAgbWZhRGV2aWNlLnR5cGUgPT09ICd0b3RwJyA/IChcbiAgICAgICAgICAgICAgICAgICAgICA8UVJDb2RlSWNvbiBzaXplPXsyNH0gLz5cbiAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICA8S2V5SWNvbiBzaXplPXsyNH0gLz5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e1xuICAgICAgICAgICAgICAgICAgICBtZmFEZXZpY2UubmFtZVxuICAgICAgICAgICAgICAgICAgICAgID8gbWZhRGV2aWNlLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICA6IG1mYURldmljZS50eXBlID09PSAndG90cCdcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdCgnQXV0aGVudGljYXRvcicpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHQoJ0ZJRE8gRGV2aWNlJylcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPXtcbiAgICAgICAgICAgICAgICAgICAgbWZhRGV2aWNlLnR5cGUgPT09ICd0b3RwJ1xuICAgICAgICAgICAgICAgICAgICAgID8gdCgnVmVyaWZ5IGFuIGF1dGhlbnRpY2F0b3IgYXBwIGFzIGEgcmVjb3ZlcnkgbWV0aG9kLicpXG4gICAgICAgICAgICAgICAgICAgICAgOiB0KCdWZXJpZnkgeW91ciBGSURPIGRldmljZSBhcyBhIHJlY292ZXJ5IG1ldGhvZC4nKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZXRTZWxlY3RlZE1ldGhvZChtZmFEZXZpY2UudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIHNldElzTW9kYWxPcGVuKHRydWUpO1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICA8UGFnZU5hdlxuICAgICAgICAgIG9uQmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgaGlzdG9yeS5nb0JhY2soKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTmV4dD17KCkgPT4ge1xuICAgICAgICAgICAgc2V0SXNNb2RhbE9wZW4odHJ1ZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBhY3RpdmVTdGVwPXswfVxuICAgICAgICAgIHN0ZXBzPXszfVxuICAgICAgICAgIGRpc2FibGVOZXh0PXshc2VsZWN0ZWRNZXRob2R9XG4gICAgICAgIC8+XG4gICAgICA8L1N0YWNrPlxuICAgICAge2lzTW9kYWxPcGVuICYmIHNlbGVjdGVkTWV0aG9kID09PSBSZWNvdmVyeU1ldGhvZFR5cGVzLlRPVFAgJiYgKFxuICAgICAgICA8VE9UUE1vZGFsXG4gICAgICAgICAgb25GaW5pc2g9eygpID0+IHtcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5DUkVBVEVfUEFTU1dPUkQpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25DYW5jZWw9eygpID0+IHtcbiAgICAgICAgICAgIHNldElzTW9kYWxPcGVuKGZhbHNlKTtcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5PTkJPQVJESU5HX0hPTUUpO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge2lzTW9kYWxPcGVuICYmIHNlbGVjdGVkTWV0aG9kID09PSBSZWNvdmVyeU1ldGhvZFR5cGVzLkZJRE8gJiYgKFxuICAgICAgICA8RklET01vZGFsXG4gICAgICAgICAgb25GaW5pc2g9e29uRmluaXNofVxuICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRJc01vZGFsT3BlbihmYWxzZSk7XG4gICAgICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuT05CT0FSRElOR19IT01FKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHNlbGVjdGVkTWV0aG9kPXtzZWxlY3RlZE1ldGhvZH1cbiAgICAgICAgICBzdGFydGluZ1N0ZXA9e0ZJRE9TdGVwcy5MT0dJTn1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBBcHBsZUljb24sIEJ1dHRvbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VPbmJvYXJkaW5nQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvT25ib2FyZGluZ1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBTZWVkbGVzQnV0dG9uIH0gZnJvbSAnLi9Hb29nbGVCdXR0b24nO1xuaW1wb3J0IHtcbiAgT05CT0FSRElOR19FVkVOVF9OQU1FUyxcbiAgT25ib2FyZGluZ1BoYXNlLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvb25ib2FyZGluZy9tb2RlbHMnO1xuaW1wb3J0IHsgYXV0aGVudGljYXRlV2l0aEFwcGxlIH0gZnJvbSAnQHNyYy91dGlscy9zZWVkbGVzcy9hdXRoZW50aWNhdGVXaXRoQXBwbGUnO1xuaW1wb3J0IHsgU2VlZGxlc3NBdXRoUHJvdmlkZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L21vZGVscyc7XG5pbXBvcnQgeyB1c2VTZWVkbGVzc0FjdGlvbnMgfSBmcm9tICdAc3JjL3BhZ2VzL09uYm9hcmRpbmcvaG9va3MvdXNlU2VlZGxlc3NBY3Rpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFwcGxlQnV0dG9uKHsgc2V0SXNMb2FkaW5nIH06IFNlZWRsZXNCdXR0b24pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgeyBzZXRPbmJvYXJkaW5nUGhhc2UsIHNldEF1dGhQcm92aWRlciB9ID0gdXNlT25ib2FyZGluZ0NvbnRleHQoKTtcbiAgY29uc3QgeyBzaWduSW4gfSA9IHVzZVNlZWRsZXNzQWN0aW9ucygpO1xuXG4gIHJldHVybiAoXG4gICAgPEJ1dHRvblxuICAgICAgc3g9e3sgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJjcmVhdGUtd2FsbGV0LWFwcGxlLWJ1dHRvblwiXG4gICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgIHN0YXJ0SWNvbj17PEFwcGxlSWNvbiBzaXplPXsyMH0gLz59XG4gICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgIHNldE9uYm9hcmRpbmdQaGFzZShPbmJvYXJkaW5nUGhhc2UuU0VFRExFU1NfQVBQTEUpO1xuICAgICAgICBjYXB0dXJlKE9OQk9BUkRJTkdfRVZFTlRfTkFNRVNbT25ib2FyZGluZ1BoYXNlLlNFRURMRVNTX0FQUExFXSk7XG4gICAgICAgIHNldEF1dGhQcm92aWRlcihTZWVkbGVzc0F1dGhQcm92aWRlci5BcHBsZSk7XG4gICAgICAgIHNpZ25Jbih7XG4gICAgICAgICAgc2V0SXNMb2FkaW5nLFxuICAgICAgICAgIGdldE9pZGNUb2tlbjogYXV0aGVudGljYXRlV2l0aEFwcGxlLFxuICAgICAgICAgIHByb3ZpZGVyOiBTZWVkbGVzc0F1dGhQcm92aWRlci5BcHBsZSxcbiAgICAgICAgfSk7XG4gICAgICB9fVxuICAgID5cbiAgICAgIHt0KCdDb250aW51ZSB3aXRoIEFwcGxlJyl9XG4gICAgPC9CdXR0b24+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBTdGFjaywgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCc7XG5cbmludGVyZmFjZSBFeGlzdGluZ1dhbGxldEJ1dHRvblByb3BzIHtcbiAgaWNvbjogUmVhY3ROb2RlO1xuICB0ZXh0OiBzdHJpbmc7XG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFeGlzdGluZ1dhbGxldEJ1dHRvbih7XG4gIGljb24sXG4gIHRleHQsXG4gIG9uQ2xpY2ssXG59OiBFeGlzdGluZ1dhbGxldEJ1dHRvblByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzIyNXB4JyxcbiAgICAgICAgaGVpZ2h0OiAnMTgwcHgnLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDIsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoODgsIDg4LCA5MSwgMC43NSknLFxuICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgJyY6aG92ZXInOiB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnZ3JleS4yMDAnLFxuICAgICAgICAgIGNvbG9yOiAnY29tbW9uLmJsYWNrJyxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDMwMG1zIGVhc2UtaW4tb3V0JyxcbiAgICAgICAgfSxcbiAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLFxuICAgICAgICBwOiAyLFxuICAgICAgICByb3dHYXA6IDEsXG4gICAgICB9fVxuICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICBvbkNsaWNrKCk7XG4gICAgICB9fVxuICAgID5cbiAgICAgIHtpY29ufVxuICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgdmFyaWFudD1cImg2XCJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgICAgICB0ZXh0QWxpZ246ICdzdGFydCcsXG4gICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZHMnLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dGV4dH1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIFNoaWVsZExvY2tJY29uLFxuICBMZWRnZXJJY29uLFxuICBLZXlzdG9uZUljb24sXG4gIEFycm93TGVmdEljb25WMixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IGZvcndhcmRSZWYsIEZvcndhcmRlZFJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB7IEZlYXR1cmVHYXRlcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9mZWF0dXJlRmxhZ3MvbW9kZWxzJztcbmltcG9ydCB7IE9uYm9hcmRpbmdVUkxzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL29uYm9hcmRpbmcvbW9kZWxzJztcbmltcG9ydCB7IE92ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL092ZXJsYXknO1xuaW1wb3J0IHsgRXhpc3RpbmdXYWxsZXRCdXR0b24gfSBmcm9tICcuL0V4aXN0aW5nV2FsbGV0QnV0dG9uJztcblxudHlwZSBFeGlzdGluZ1dhbGxldE9wdGlvbnNQcm9wcyA9IHtcbiAgc2V0U2hvd0V4aXN0aW5nV2FsbGV0T3B0aW9uOiAob3BlbjogYm9vbGVhbikgPT4gdm9pZDtcbn07XG5cbmV4cG9ydCBjb25zdCBFeGlzdGluZ1dhbGxldE9wdGlvbnMgPSBmb3J3YXJkUmVmKGZ1bmN0aW9uIEV4aXN0aW5nV2FsbGV0T3B0aW9ucyhcbiAgeyBzZXRTaG93RXhpc3RpbmdXYWxsZXRPcHRpb24gfTogRXhpc3RpbmdXYWxsZXRPcHRpb25zUHJvcHMsXG4gIHJlZjogRm9yd2FyZGVkUmVmPEhUTUxEaXZFbGVtZW50Pixcbikge1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgZmVhdHVyZUZsYWdzIH0gPSB1c2VGZWF0dXJlRmxhZ0NvbnRleHQoKTtcblxuICByZXR1cm4gKFxuICAgIDxPdmVybGF5XG4gICAgICBzeD17e1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDE3LCAxNywgMTcsIDAuNzUpJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHJlZj17cmVmfVxuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiA0ODAsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLFxuICAgICAgICAgIHJvd0dhcDogNSxcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICB0b3A6IDkwLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QXJyb3dMZWZ0SWNvblYyXG4gICAgICAgICAgc3g9e3sgY3Vyc29yOiAncG9pbnRlcicsIHdpZHRoOiAxOSwgaGVpZ2h0OiAxNCB9fVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHNldFNob3dFeGlzdGluZ1dhbGxldE9wdGlvbihmYWxzZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImgzXCIgc3g9e3sgdGV4dEFsaWduOiAnbGVmdCcgfX0+XG4gICAgICAgICAge3QoJ0hvdyB3b3VsZCB5b3UgbGlrZSB0byBhY2Nlc3MgeW91ciBleGlzdGluZyB3YWxsZXQ/Jyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFN0YWNrPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgY29sdW1uR2FwOiAzLCBwYjogMyB9fT5cbiAgICAgICAgICAgIDxFeGlzdGluZ1dhbGxldEJ1dHRvblxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY2Vzcy13aXRoLXNlZWQtcGhyYXNlXCJcbiAgICAgICAgICAgICAgaWNvbj17PFNoaWVsZExvY2tJY29uIHNpemU9ezMwfSAvPn1cbiAgICAgICAgICAgICAgdGV4dD17dCgnRW50ZXIgcmVjb3ZlcnkgcGhyYXNlJyl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuU0VFRF9QSFJBU0UpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxFeGlzdGluZ1dhbGxldEJ1dHRvblxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY2Vzcy13aXRoLWxlZGdlclwiXG4gICAgICAgICAgICAgIGljb249ezxMZWRnZXJJY29uIHNpemU9ezMwfSAvPn1cbiAgICAgICAgICAgICAgdGV4dD17dCgnQWRkIHVzaW5nIExlZGdlcicpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoKE9uYm9hcmRpbmdVUkxzLkxFREdFUik7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAge2ZlYXR1cmVGbGFnc1tGZWF0dXJlR2F0ZXMuS0VZU1RPTkVdICYmIChcbiAgICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JyB9fT5cbiAgICAgICAgICAgICAgPEV4aXN0aW5nV2FsbGV0QnV0dG9uXG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2Nlc3Mtd2l0aC1zZWVkLWtleXN0b25lXCJcbiAgICAgICAgICAgICAgICBpY29uPXs8S2V5c3RvbmVJY29uIHNpemU9ezMwfSAvPn1cbiAgICAgICAgICAgICAgICB0ZXh0PXt0KCdBZGQgdXNpbmcgS2V5c3RvbmUnKX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2goT25ib2FyZGluZ1VSTHMuS0VZU1RPTkUpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvT3ZlcmxheT5cbiAgKTtcbn0pO1xuIiwiaW1wb3J0IHsgRGlzcGF0Y2gsIFNldFN0YXRlQWN0aW9uIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgR29vZ2xlQ29sb3JJY29uLCBCdXR0b24gfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtcbiAgT05CT0FSRElOR19FVkVOVF9OQU1FUyxcbiAgT25ib2FyZGluZ1BoYXNlLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvb25ib2FyZGluZy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlT25ib2FyZGluZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL09uYm9hcmRpbmdQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgdXNlU2VlZGxlc3NBY3Rpb25zIH0gZnJvbSAnQHNyYy9wYWdlcy9PbmJvYXJkaW5nL2hvb2tzL3VzZVNlZWRsZXNzQWN0aW9ucyc7XG5pbXBvcnQgeyBTZWVkbGVzc0F1dGhQcm92aWRlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvbW9kZWxzJztcbmltcG9ydCB7IGF1dGhlbnRpY2F0ZVdpdGhHb29nbGUgfSBmcm9tICdAc3JjL3V0aWxzL3NlZWRsZXNzL2F1dGhlbnRpY2F0ZVdpdGhHb29nbGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlZWRsZXNCdXR0b24ge1xuICBzZXRJc0xvYWRpbmc6IERpc3BhdGNoPFNldFN0YXRlQWN0aW9uPGJvb2xlYW4+Pjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEdvb2dsZUJ1dHRvbih7IHNldElzTG9hZGluZyB9OiBTZWVkbGVzQnV0dG9uKSB7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCB7IHNldE9uYm9hcmRpbmdQaGFzZSwgc2V0QXV0aFByb3ZpZGVyIH0gPSB1c2VPbmJvYXJkaW5nQ29udGV4dCgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgc2lnbkluIH0gPSB1c2VTZWVkbGVzc0FjdGlvbnMoKTtcblxuICByZXR1cm4gKFxuICAgIDxCdXR0b25cbiAgICAgIHN4PXt7IHdpZHRoOiAnMTAwJScgfX1cbiAgICAgIGRhdGEtdGVzdGlkPVwiY3JlYXRlLXdhbGxldC1nb29nbGUtYnV0dG9uXCJcbiAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgc3RhcnRJY29uPXs8R29vZ2xlQ29sb3JJY29uIHNpemU9ezIwfSAvPn1cbiAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgc2V0T25ib2FyZGluZ1BoYXNlKE9uYm9hcmRpbmdQaGFzZS5TRUVETEVTU19HT09HTEUpO1xuICAgICAgICBjYXB0dXJlKE9OQk9BUkRJTkdfRVZFTlRfTkFNRVMuc2VlZGxlc3NfZ29vZ2xlKTtcbiAgICAgICAgc2V0QXV0aFByb3ZpZGVyKFNlZWRsZXNzQXV0aFByb3ZpZGVyLkdvb2dsZSk7XG4gICAgICAgIHNpZ25Jbih7XG4gICAgICAgICAgc2V0SXNMb2FkaW5nLFxuICAgICAgICAgIGdldE9pZGNUb2tlbjogYXV0aGVudGljYXRlV2l0aEdvb2dsZSxcbiAgICAgICAgICBwcm92aWRlcjogU2VlZGxlc3NBdXRoUHJvdmlkZXIuR29vZ2xlLFxuICAgICAgICB9KTtcbiAgICAgIH19XG4gICAgPlxuICAgICAge3QoJ0NvbnRpbnVlIHdpdGggR29vZ2xlJyl9XG4gICAgPC9CdXR0b24+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBDYXJkLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgQ2hldnJvblJpZ2h0SWNvbixcbiAgQ2FyZEFjdGlvbkFyZWEsXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUmVhY3RFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgSW5saW5lQm9sZCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vSW5saW5lQm9sZCc7XG5cbmludGVyZmFjZSBNZXRob2RDYXJkUHJvcHMge1xuICBpY29uOiBSZWFjdEVsZW1lbnQ7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBNZXRob2RDYXJkKHtcbiAgaWNvbixcbiAgdGl0bGUsXG4gIGRlc2NyaXB0aW9uLFxuICBvbkNsaWNrLFxufTogTWV0aG9kQ2FyZFByb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgcmV0dXJuIChcbiAgICA8Q2FyZFxuICAgICAgZGF0YS10ZXN0aWQ9e2BtZXRob2QtY2FyZC0ke3RpdGxlfWB9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgc3g9e3tcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmJhY2tncm91bmQucGFwZXIsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxDYXJkQWN0aW9uQXJlYT5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgcDogMixcbiAgICAgICAgICAgIGNvbG9yOiB0aGVtZS5wYWxldHRlLnRleHQucHJpbWFyeSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBjb2x1bW5HYXA6IDIgfX0+XG4gICAgICAgICAgICB7aWNvbn1cbiAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg2XCIgc3g9e3sgbWI6IDEgfX0+XG4gICAgICAgICAgICAgICAgPElubGluZUJvbGQ+e3RpdGxlfTwvSW5saW5lQm9sZD5cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICBjb2xvcjogdGhlbWUucGFsZXR0ZS50ZXh0LnNlY29uZGFyeSxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPENoZXZyb25SaWdodEljb24gc2l6ZT17MjR9IC8+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L0NhcmRBY3Rpb25BcmVhPlxuICAgIDwvQ2FyZD5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIFR5cG9ncmFwaHksXG4gIFN0YWNrLFxuICB1c2VUaGVtZSxcbiAgQnV0dG9uLFxuICBYSWNvbixcbiAgVGV4dEZpZWxkLFxuICBDb3B5SWNvbixcbiAgdG9hc3QsXG4gIENpcmN1bGFyUHJvZ3Jlc3MsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IE92ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL092ZXJsYXknO1xuaW1wb3J0IHsgVHlwb2dyYXBoeUxpbmsgfSBmcm9tICdAc3JjL3BhZ2VzL09uYm9hcmRpbmcvY29tcG9uZW50cy9UeXBvZ3JhcGh5TGluayc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBRUkNvZGUgZnJvbSAncXJjb2RlLnJlYWN0JztcbmltcG9ydCB7IHVzZVNlZWRsZXNzQWN0aW9ucyB9IGZyb20gJ0BzcmMvcGFnZXMvT25ib2FyZGluZy9ob29rcy91c2VTZWVkbGVzc0FjdGlvbnMnO1xuaW1wb3J0IHsgSW5saW5lQm9sZCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vSW5saW5lQm9sZCc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5cbmV4cG9ydCBlbnVtIEF1dGhlbnRpY2F0b3JTdGVwcyB7XG4gIFNDQU4gPSAnc2NhbicsXG4gIEtFWSA9ICdrZXknLFxuICBWRVJJRlkgPSAndmVyaWZ5JyxcbiAgSEVMUCA9ICdoZWxwJyxcbn1cblxuaW50ZXJmYWNlIEF1dGhlbnRpY2F0b3JNb2RhbFByb3BzIHtcbiAgYWN0aXZlU3RlcDogQXV0aGVudGljYXRvclN0ZXBzO1xuICBvbkZpbmlzaDogKCkgPT4gdm9pZDtcbiAgb25DYW5jZWw6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBdXRoZW50aWNhdG9yTW9kYWwoe1xuICBhY3RpdmVTdGVwLFxuICBvbkZpbmlzaCxcbiAgb25DYW5jZWwsXG59OiBBdXRoZW50aWNhdG9yTW9kYWxQcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IFtzdGVwLCBzZXRTdGVwXSA9IHVzZVN0YXRlKGFjdGl2ZVN0ZXApO1xuICBjb25zdCB7IHJlZ2lzdGVyVE9UUFN0YXJ0LCB0b3RwQ2hhbGxlbmdlLCB2ZXJpZnlSZWdpc3RyYXRpb25Db2RlIH0gPVxuICAgIHVzZVNlZWRsZXNzQWN0aW9ucygpO1xuICBjb25zdCBbdG90cENvZGUsIHNldFRvdHBDb2RlXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2lzQ29kZVZlcmlmeWluZywgc2V0SXNDb2RlVmVyaWZ5aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IHRvdHBTZWNyZXQgPSB0b3RwQ2hhbGxlbmdlXG4gICAgPyBuZXcgVVJMKHRvdHBDaGFsbGVuZ2UudG90cFVybCkuc2VhcmNoUGFyYW1zLmdldCgnc2VjcmV0JylcbiAgICA6ICcnO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmVnaXN0ZXJUT1RQU3RhcnQoKTtcbiAgfSwgW3JlZ2lzdGVyVE9UUFN0YXJ0XSk7XG5cbiAgY29uc3Qgb25Db3B5ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRvdHBTZWNyZXQgfHwgJycpO1xuICAgIHRvYXN0LnN1Y2Nlc3ModCgnQ29waWVkIScpLCB7IGR1cmF0aW9uOiAyMDAwLCBwb3NpdGlvbjogJ3RvcC1sZWZ0JyB9KTtcbiAgfSwgW3QsIHRvdHBTZWNyZXRdKTtcblxuICBjb25zdCBoZWFkTGluZXMgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBzY2FuOiB0KCdTY2FuIFFyIENvZGUnKSxcbiAgICAgIHZlcmlmeTogdCgnVmVyaWZ5IENvZGUnKSxcbiAgICAgIGtleTogdCgnQXV0aGVudGljYXRvciBTZXR1cCcpLFxuICAgICAgaGVscDogdCgnTGVhcm4gTW9yZScpLFxuICAgIH0pLFxuICAgIFt0XSxcbiAgKTtcblxuICBjb25zdCB2ZXJpZnlDb2RlID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIHNldElzQ29kZVZlcmlmeWluZyh0cnVlKTtcbiAgICBjb25zdCBpc1N1Y2Nlc3NmdWwgPSBhd2FpdCB2ZXJpZnlSZWdpc3RyYXRpb25Db2RlKHRvdHBDb2RlKTtcbiAgICBpZiAoIWlzU3VjY2Vzc2Z1bCkge1xuICAgICAgY2FwdHVyZSgnU2VlZGxlc3NBdXRoZW50aWNhdG9yVmVyaWZpY2F0aW9uRmFpbGVkJyk7XG4gICAgICBzZXRFcnJvcih0KCdJbmNvcnJlY3QgY29kZS4gVHJ5IGFnYWluLicpKTtcbiAgICB9XG4gICAgaWYgKGlzU3VjY2Vzc2Z1bCkge1xuICAgICAgY2FwdHVyZSgnU2VlZGxlc3NBdXRoZW50aWNhdG9yVmVyaWZpY2F0aW9uU3VjY2VzcycpO1xuICAgICAgb25GaW5pc2goKTtcbiAgICAgIHNldEVycm9yKCcnKTtcbiAgICB9XG5cbiAgICBzZXRJc0NvZGVWZXJpZnlpbmcoZmFsc2UpO1xuICB9LCBbY2FwdHVyZSwgb25GaW5pc2gsIHQsIHRvdHBDb2RlLCB2ZXJpZnlSZWdpc3RyYXRpb25Db2RlXSk7XG5cbiAgY29uc3QgZGVzY3JpcHRpb25zID0gdXNlTWVtbyhcbiAgICAoKSA9PiAoe1xuICAgICAgc2NhbjogKFxuICAgICAgICA8PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgIGkxOG5LZXk9XCJPbiB5b3VyIG1vYmlsZSBkZXZpY2UsIGluc3RhbGwgYW4gPGJvbGQ+YXV0aGVudGljYXRvciBhcHA8L2JvbGQ+IGFuZCB1c2UgaXQgdG8gc2NhbiB0aGlzIFFSIGNvZGUuIE9yIGVudGVyIHRoZSBjb2RlIG1hbnVhbGx5LlwiXG4gICAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgICBib2xkOiA8SW5saW5lQm9sZCAvPixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5TGluayBvbkNsaWNrPXsoKSA9PiBzZXRTdGVwKEF1dGhlbnRpY2F0b3JTdGVwcy5IRUxQKX0+XG4gICAgICAgICAgICB7dCgnTGVhcm4gbW9yZScpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeUxpbms+XG4gICAgICAgIDwvPlxuICAgICAgKSxcbiAgICAgIHZlcmlmeTogKFxuICAgICAgICA8VHlwb2dyYXBoeT5cbiAgICAgICAgICB7dCgnRW50ZXIgdGhlIGNvZGUgZ2VuZXJhdGVkIGZyb20geW91ciBhdXRoZW50aWNhdG9yIGFwcC4nKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgKSxcbiAgICAgIGtleTogKFxuICAgICAgICA8PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5PlxuICAgICAgICAgICAge3QoXG4gICAgICAgICAgICAgICdPcGVuIGFueSBhdXRoZW50aWNhdG9yIGFwcCBhbmQgdXNlIGl0IHRvIGVudGVyIHRoZSBrZXkgZm91bmQgYmVsb3cuIE9yIHRhcCBTY2FuIFFSIENvZGUuJyxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5TGluayBvbkNsaWNrPXsoKSA9PiBzZXRTdGVwKEF1dGhlbnRpY2F0b3JTdGVwcy5IRUxQKX0+XG4gICAgICAgICAgICB7dCgnTGVhcm4gbW9yZScpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeUxpbms+XG4gICAgICAgIDwvPlxuICAgICAgKSxcbiAgICAgIGhlbHA6IChcbiAgICAgICAgPFR5cG9ncmFwaHk+XG4gICAgICAgICAge3QoJ1VzZSBhbnkgYXV0aGVudGljYXRvciBhcHAgYW5kIHBhc3RlIGluIHRoZSBjb2RlIGZvdW5kIGJlbG93LicpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICApLFxuICAgIH0pLFxuICAgIFt0XSxcbiAgKTtcblxuICBjb25zdCBjb250ZW50cyA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIHNjYW46IChcbiAgICAgICAgPFN0YWNrIHN4PXt7IHA6IDMgfX0+XG4gICAgICAgICAge3RvdHBDaGFsbGVuZ2UgPyAoXG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBwOiAxLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhlbWUucGFsZXR0ZS5jb21tb24ud2hpdGUsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8UVJDb2RlXG4gICAgICAgICAgICAgICAgcmVuZGVyQXM9XCJzdmdcIlxuICAgICAgICAgICAgICAgIGZnQ29sb3I9e3RoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrfVxuICAgICAgICAgICAgICAgIGJnQ29sb3I9e3RoZW1lLnBhbGV0dGUuY29tbW9uLndoaXRlfVxuICAgICAgICAgICAgICAgIHZhbHVlPXt0b3RwQ2hhbGxlbmdlLnRvdHBVcmx9XG4gICAgICAgICAgICAgICAgbGV2ZWw9XCJIXCJcbiAgICAgICAgICAgICAgICBzaXplPXsxODB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8Q2lyY3VsYXJQcm9ncmVzcyAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApLFxuICAgICAgdmVyaWZ5OiAoXG4gICAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICAgIGlucHV0UHJvcHM9e3sgc3R5bGU6IHsgd2lkdGg6ICcxMDAlJyB9IH19XG4gICAgICAgICAgICB0eXBlPVwidGVsXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFRvdHBDb2RlKGV2ZW50LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICByb3dzPXszfVxuICAgICAgICAgICAgbXVsdGlsaW5lXG4gICAgICAgICAgICBlcnJvcj17ISFlcnJvcn1cbiAgICAgICAgICAgIGhlbHBlclRleHQ9e2Vycm9yfVxuICAgICAgICAgICAgb25LZXlEb3duPXthc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdmVyaWZ5Q29kZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApLFxuICAgICAga2V5OiAoXG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIG9uQ2xpY2s9e29uQ29weX1cbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODUwXSxcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgY29sdW1uR2FwOiAyLFxuICAgICAgICAgICAgcDogMixcbiAgICAgICAgICAgIHdpZHRoOiAnMzU4cHgnLFxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjayBzeD17eyByb3dHYXA6IDEgfX0+XG4gICAgICAgICAgICA8Q29weUljb24gc2l6ZT17MjR9IC8+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgd29yZEJyZWFrOiAnYnJlYWstYWxsJyB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJidXR0b25cIlxuICAgICAgICAgICAgICBzeD17eyBmb250U2l6ZTogdGhlbWUudHlwb2dyYXBoeS5zdWJ0aXRsZTIuZm9udFNpemUgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ0NvcHkgS2V5Jyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgc3g9e3sgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkuaDUuZm9udFNpemUgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3RvdHBTZWNyZXR9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICksXG4gICAgICBoZWxwOiAoXG4gICAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogJzM1OHB4JyB9fT5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ29weX1cbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF0sXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICBjb2x1bW5HYXA6IDIsXG4gICAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICBtYjogMixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IHJvd0dhcDogMSB9fT5cbiAgICAgICAgICAgICAgPENvcHlJY29uIHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDxTdGFjayBzeD17eyByb3dHYXA6IDAuNSwgd29yZEJyZWFrOiAnYnJlYWstYWxsJyB9fT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBzeD17eyBmb250U2l6ZTogdGhlbWUudHlwb2dyYXBoeS5zdWJ0aXRsZTIuZm9udFNpemUgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0KCdDb3B5IEtleScpfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgc3g9e3sgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkuaDUuZm9udFNpemUgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0b3RwU2VjcmV0fVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPFR5cG9ncmFwaHk+XG4gICAgICAgICAgICB7dChcbiAgICAgICAgICAgICAgJ0lmIHVzaW5nIEdvb2dsZSBBdXRoZW50aWNhdG9yLCBtYWtlIHN1cmUgdGhhdCBUaW1lIGJhc2VkIGlzIHNlbGVjdGVkLicsXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeT5cbiAgICAgICAgICAgIHt0KCdJZiB1c2luZyBNaWNyb3NvZnQgQXV0aGVudGljYXRvciwgY2xpY2sgQWRkIEFjY291bnQuJyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5PlxuICAgICAgICAgICAge3QoJ0lmIHVzaW5nIEF1dGhlbnRpY2F0b3IgQXBwLCBjbGljayB0aGUgKyB0byBhZGQgYWNjb3VudC4nKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApLFxuICAgIH0pLFxuICAgIFtcbiAgICAgIGVycm9yLFxuICAgICAgb25Db3B5LFxuICAgICAgdCxcbiAgICAgIHRoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrLFxuICAgICAgdGhlbWUucGFsZXR0ZS5jb21tb24ud2hpdGUsXG4gICAgICB0aGVtZS5wYWxldHRlLmdyZXksXG4gICAgICB0aGVtZS50eXBvZ3JhcGh5Lmg1LmZvbnRTaXplLFxuICAgICAgdGhlbWUudHlwb2dyYXBoeS5zdWJ0aXRsZTIuZm9udFNpemUsXG4gICAgICB0b3RwQ2hhbGxlbmdlLFxuICAgICAgdG90cFNlY3JldCxcbiAgICAgIHZlcmlmeUNvZGUsXG4gICAgXSxcbiAgKTtcblxuICBjb25zdCBhY3Rpb25CdXR0b25zID0gdXNlTWVtbyhcbiAgICAoKSA9PiAoe1xuICAgICAgc2NhbjogKFxuICAgICAgICA8VHlwb2dyYXBoeUxpbmtcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRTdGVwKEF1dGhlbnRpY2F0b3JTdGVwcy5LRVkpO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnRW50ZXIgQ29kZSBNYW51YWxseScpfVxuICAgICAgICA8L1R5cG9ncmFwaHlMaW5rPlxuICAgICAgKSxcbiAgICAgIHZlcmlmeTogbnVsbCxcbiAgICAgIGtleTogKFxuICAgICAgICA8VHlwb2dyYXBoeUxpbmtcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRTdGVwKEF1dGhlbnRpY2F0b3JTdGVwcy5TQ0FOKTtcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ1NjYW4gUVIgQ29kZScpfVxuICAgICAgICA8L1R5cG9ncmFwaHlMaW5rPlxuICAgICAgKSxcbiAgICAgIGhlbHA6IChcbiAgICAgICAgPFR5cG9ncmFwaHlMaW5rIG9uQ2xpY2s9eygpID0+IHNldFN0ZXAoQXV0aGVudGljYXRvclN0ZXBzLlNDQU4pfT5cbiAgICAgICAgICB7dCgnQmFjaycpfVxuICAgICAgICA8L1R5cG9ncmFwaHlMaW5rPlxuICAgICAgKSxcbiAgICB9KSxcbiAgICBbdF0sXG4gICk7XG5cbiAgY29uc3QgbmV4dFN0ZXBBY3Rpb24gPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBzY2FuOiAoKSA9PiBzZXRTdGVwKEF1dGhlbnRpY2F0b3JTdGVwcy5WRVJJRlkpLFxuICAgICAgaGVscDogKCkgPT4gc2V0U3RlcChBdXRoZW50aWNhdG9yU3RlcHMuVkVSSUZZKSxcbiAgICAgIGNvZGU6ICgpID0+IHNldFN0ZXAoQXV0aGVudGljYXRvclN0ZXBzLlZFUklGWSksXG4gICAgICB2ZXJpZnk6ICgpID0+IHZlcmlmeUNvZGUoKSxcbiAgICB9KSxcbiAgICBbdmVyaWZ5Q29kZV0sXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8T3ZlcmxheT5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnNTEycHgnLFxuICAgICAgICAgIG1pbkhlaWdodDogJzQwN3B4JyxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGVtZS5wYWxldHRlLmJhY2tncm91bmQucGFwZXIsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAxLFxuICAgICAgICAgIHA6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiaDRcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgcHQ6IDMsXG4gICAgICAgICAgICAgIHB4OiA0LFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgYXV0aGVudGljYXRvci1tb2RhbC1oZWFkZXJgfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtoZWFkTGluZXNbc3RlcF19XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgYXV0aGVudGljYXRvci1tb2RhbC1jbG9zZS1idXR0b25gfVxuICAgICAgICAgICAgb25DbGljaz17b25DYW5jZWx9XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBwOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoZW1lLnNwYWNpbmcoMyksXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGVtZS5zcGFjaW5nKDMpLFxuICAgICAgICAgICAgICBtaW5XaWR0aDogdGhlbWUuc3BhY2luZygzKSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFhJY29uIHNpemU9ezI0fSBzeD17eyBjb2xvcjogJ3ByaW1hcnkubWFpbicgfX0gLz5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgcHQ6IDEsXG4gICAgICAgICAgICBweDogNCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgbWluSGVpZ2h0PXs0MH0+XG4gICAgICAgICAgICB7ZGVzY3JpcHRpb25zW3N0ZXBdfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6XG4gICAgICAgICAgICAgICAgc3RlcCAhPT0gQXV0aGVudGljYXRvclN0ZXBzLlZFUklGWSA/ICdjZW50ZXInIDogJ2ZsZXgtc3RhcnQnLFxuICAgICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2NvbnRlbnRzW3N0ZXBdfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5TGluaz57YWN0aW9uQnV0dG9uc1tzdGVwXX08L1R5cG9ncmFwaHlMaW5rPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBjb2x1bW5HYXA6IDIgfX0+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhdXRoZW50aWNhdG9yLW1vZGFsLWNhbmNlbFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2FuY2VsfVxuICAgICAgICAgICAgICBpc0Rpc2FibGVkPXtpc0NvZGVWZXJpZnlpbmd9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImF1dGhlbnRpY2F0b3ItbW9kYWwtbmV4dFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e25leHRTdGVwQWN0aW9uW3N0ZXBdfVxuICAgICAgICAgICAgICBpc0xvYWRpbmc9e2lzQ29kZVZlcmlmeWluZ31cbiAgICAgICAgICAgICAgaXNEaXNhYmxlZD17aXNDb2RlVmVyaWZ5aW5nfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnTmV4dCcpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9PdmVybGF5PlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDaXJjdWxhclByb2dyZXNzLFxuICBTdGFjayxcbiAgVGV4dEZpZWxkLFxuICBUeXBvZ3JhcGh5LFxuICBYSWNvbixcbiAgdXNlVGhlbWUsXG4gIEFsZXJ0Q2lyY2xlSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IE92ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL092ZXJsYXknO1xuaW1wb3J0IHsgdXNlU2VlZGxlc3NBY3Rpb25zIH0gZnJvbSAnQHNyYy9wYWdlcy9PbmJvYXJkaW5nL2hvb2tzL3VzZVNlZWRsZXNzQWN0aW9ucyc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyBGSURPU3RlcHMsIFJlY292ZXJ5TWV0aG9kVHlwZXMgfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5pbnRlcmZhY2UgU2VlZGxlc3NNb2RhbFByb3BzIHtcbiAgb25GaW5pc2g6ICgpID0+IHZvaWQ7XG4gIG9uQ2FuY2VsOiAoKSA9PiB2b2lkO1xuICBzZWxlY3RlZE1ldGhvZDogUmVjb3ZlcnlNZXRob2RUeXBlcztcbiAgc3RhcnRpbmdTdGVwPzogRklET1N0ZXBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRklET01vZGFsKHtcbiAgb25GaW5pc2gsXG4gIG9uQ2FuY2VsLFxuICBzZWxlY3RlZE1ldGhvZCxcbiAgc3RhcnRpbmdTdGVwLFxufTogU2VlZGxlc3NNb2RhbFByb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGFkZEZJRE9EZXZpY2UsIGxvZ2luV2l0aEZJRE8gfSA9IHVzZVNlZWRsZXNzQWN0aW9ucygpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcblxuICBjb25zdCBbRklET0RldmljZU5hbWUsIHNldEZJRE9EZXZpY2VOYW1lXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW3N0ZXAsIHNldFN0ZXBdID0gdXNlU3RhdGU8RklET1N0ZXBzPihzdGFydGluZ1N0ZXAgfHwgRklET1N0ZXBzLk5BTUlORyk7XG4gIGNvbnN0IFtpc0xvZ2luU3VjY2Vzc2Z1bCwgc2V0SXNMb2dpblN1Y2Nlc3NmdWxdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGlzQnV0dG9uc0Rpc2FibGVkID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKHN0ZXAgPT09IEZJRE9TdGVwcy5MT0dJTiB8fCBzdGVwID09PSBGSURPU3RlcHMuUkVHSVNURVIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sIFtzdGVwXSk7XG5cbiAgY29uc3QgbG9naW4gPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgc2V0U3RlcChGSURPU3RlcHMuTE9HSU4pO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpc1N1Y2Nlc3NmdWwgPSBhd2FpdCBsb2dpbldpdGhGSURPKCk7XG4gICAgICBpZiAoaXNTdWNjZXNzZnVsKSB7XG4gICAgICAgIGNhcHR1cmUoYEZpZG9EZXZpY2Uke3NlbGVjdGVkTWV0aG9kfUxvZ2luU3VjY2Vzc2ApO1xuICAgICAgICBzZXRJc0xvZ2luU3VjY2Vzc2Z1bChpc1N1Y2Nlc3NmdWwpO1xuICAgICAgICBvbkZpbmlzaCgpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICAgIHNldFN0ZXAoRklET1N0ZXBzLkVSUk9SKTtcbiAgICAgIGNhcHR1cmUoYEZpZG9EZXZpY2Uke3NlbGVjdGVkTWV0aG9kfUxvZ2luRXJyb3JgKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9LCBbY2FwdHVyZSwgbG9naW5XaXRoRklETywgb25GaW5pc2gsIHNlbGVjdGVkTWV0aG9kXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc3RhcnRpbmdTdGVwID09PSBGSURPU3RlcHMuTE9HSU4gJiYgIWlzTG9naW5TdWNjZXNzZnVsKSB7XG4gICAgICBsb2dpbigpO1xuICAgIH1cbiAgfSwgW2lzTG9naW5TdWNjZXNzZnVsLCBsb2dpbiwgc3RhcnRpbmdTdGVwXSk7XG5cbiAgY29uc3QgYWRkRGV2aWNlID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKG5hbWU/OiBzdHJpbmcpID0+IHtcbiAgICAgIHNldFN0ZXAoRklET1N0ZXBzLlJFR0lTVEVSKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRldmljZU5hbWUgPSBuYW1lIHx8IGAke3NlbGVjdGVkTWV0aG9kfS0xYDtcbiAgICAgICAgY29uc3QgaXNGaWRvUmVnaXN0ZXJTdWNjZXNzZnVsID0gYXdhaXQgYWRkRklET0RldmljZShcbiAgICAgICAgICBkZXZpY2VOYW1lLFxuICAgICAgICAgIHNlbGVjdGVkTWV0aG9kLFxuICAgICAgICApO1xuICAgICAgICBpZiAoIWlzRmlkb1JlZ2lzdGVyU3VjY2Vzc2Z1bCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB0aGUgZGV2aWNlIHJlZ2lzdHJhdGlvbi4nKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRTdGVwKEZJRE9TdGVwcy5MT0dJTik7XG4gICAgICAgIGNvbnN0IGlzRmlkb0xvZ2luU3VjY2Vzc2Z1bCA9IGF3YWl0IGxvZ2luV2l0aEZJRE8oKTtcbiAgICAgICAgaWYgKGlzRmlkb0xvZ2luU3VjY2Vzc2Z1bCkge1xuICAgICAgICAgIGNhcHR1cmUoYEZpZG9EZXZpY2Uke3NlbGVjdGVkTWV0aG9kfUFkZGVkYCk7XG4gICAgICAgICAgb25GaW5pc2goKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoX2Vycikge1xuICAgICAgICBzZXRTdGVwKEZJRE9TdGVwcy5FUlJPUik7XG4gICAgICAgIGNhcHR1cmUoYEZpZG9EZXZpY2Uke3NlbGVjdGVkTWV0aG9kfUFkZEVycm9yYCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbYWRkRklET0RldmljZSwgY2FwdHVyZSwgbG9naW5XaXRoRklETywgb25GaW5pc2gsIHNlbGVjdGVkTWV0aG9kXSxcbiAgKTtcblxuICBjb25zdCBoZWFkTGluZXMgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBuYW1pbmc6IHQoJ05hbWUgWW91ciB7e2RldmljZX19Jywge1xuICAgICAgICBkZXZpY2U6IHNlbGVjdGVkTWV0aG9kLFxuICAgICAgfSksXG4gICAgICByZWdpc3RlcjogdCgne3tkZXZpY2V9fSBTZXR1cCcsIHtcbiAgICAgICAgZGV2aWNlOiBzZWxlY3RlZE1ldGhvZCxcbiAgICAgIH0pLFxuXG4gICAgICBsb2dpbjogdCgne3tkZXZpY2V9fSBMb2dpbicsIHtcbiAgICAgICAgZGV2aWNlOiBzZWxlY3RlZE1ldGhvZCxcbiAgICAgIH0pLFxuICAgICAgZXJyb3I6IHQoJ0NvdWxkbuKAmXQgQ29ubmVjdCcpLFxuICAgIH0pLFxuICAgIFtzZWxlY3RlZE1ldGhvZCwgdF0sXG4gICk7XG5cbiAgY29uc3QgZGVzY3JpcHRpb25zID0gdXNlTWVtbyhcbiAgICAoKSA9PiAoe1xuICAgICAgbmFtaW5nOiB0KCdBZGQgYSB7e2RldmljZX19IG5hbWUsIHNvIHRoYXQgaXTigJlzIGVhc2llciB0byBmaW5kIGxhdGVyLicsIHtcbiAgICAgICAgZGV2aWNlOiBzZWxlY3RlZE1ldGhvZCxcbiAgICAgIH0pLFxuICAgICAgcmVnaXN0ZXI6IHQoXG4gICAgICAgICdZb3Ugd2lsbCBzZWUgaW5zdHJ1Y3Rpb25zIGluIHlvdXIgYnJvd3NlciB3aW5kb3cgZm9yIGFkZGluZyB5b3VyIGtleSB0byB5b3VyIGFjY291bnQuJyxcbiAgICAgICksXG4gICAgICBsb2dpbjogdChcbiAgICAgICAgJ1lvdSB3aWxsIHNlZSBpbnN0cnVjdGlvbnMgaW4geW91ciBicm93c2VyIHdpbmRvdyBmb3IgbG9nZ2luZyBpbiB3aXRoIHlvdXIga2V5LicsXG4gICAgICApLFxuICAgICAgZXJyb3I6IHQoJ1RoZSBvcGVyYXRpb24gZWl0aGVyIHRpbWVkIG91dCBvciB3YXMgbm90IGFsbG93ZWQuJyksXG4gICAgfSksXG4gICAgW3NlbGVjdGVkTWV0aG9kLCB0XSxcbiAgKTtcblxuICBjb25zdCBjb250ZW50cyA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIG5hbWluZzogKFxuICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICBpbnB1dFByb3BzPXt7IHN0eWxlOiB7IHdpZHRoOiAnMTAwJScgfSB9fVxuICAgICAgICAgICAgdHlwZT1cInRlbFwiXG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIHNldEZJRE9EZXZpY2VOYW1lKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0VudGVyIHt7ZGV2aWNlfX0gbmFtZScsIHtcbiAgICAgICAgICAgICAgZGV2aWNlOiBzZWxlY3RlZE1ldGhvZCxcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApLFxuICAgICAgcmVnaXN0ZXI6IChcbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXs1Nn0gLz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICksXG4gICAgICBsb2dpbjogKFxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxDaXJjdWxhclByb2dyZXNzIHNpemU9ezU2fSAvPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgKSxcbiAgICAgIGVycm9yOiAoXG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEFsZXJ0Q2lyY2xlSWNvbiBzaXplPXs1Nn0gLz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICksXG4gICAgfSksXG4gICAgW3NlbGVjdGVkTWV0aG9kLCB0XSxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxPdmVybGF5PlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6ICc1MTJweCcsXG4gICAgICAgICAgbWluSGVpZ2h0OiAnNDA3cHgnLFxuICAgICAgICAgIGJhY2tncm91bmQ6IHRoZW1lLnBhbGV0dGUuYmFja2dyb3VuZC5wYXBlcixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgICAgcDogMSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJoNFwiXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBwdDogMyxcbiAgICAgICAgICAgICAgcHg6IDQsXG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICdjYXBpdGFsaXplJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD17YGZpZG8tbW9kYWwtaGVhZGVyYH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aGVhZExpbmVzW3N0ZXBdfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD17YGZpZG8tbW9kYWwtY2xvc2UtYnV0dG9uYH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2FuY2VsfVxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgcDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDMpLFxuICAgICAgICAgICAgICB3aWR0aDogdGhlbWUuc3BhY2luZygzKSxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IHRoZW1lLnNwYWNpbmcoMyksXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxYSWNvbiBzaXplPXsyNH0gc3g9e3sgY29sb3I6ICdwcmltYXJ5Lm1haW4nIH19IC8+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgIHB0OiAxLFxuICAgICAgICAgICAgcHg6IDQsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIG1pbkhlaWdodD17NDB9PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAgICAgIHtkZXNjcmlwdGlvbnNbc3RlcF19XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7Y29udGVudHNbc3RlcF19XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6XG4gICAgICAgICAgICAgIHN0ZXAgIT09IEZJRE9TdGVwcy5FUlJPUiA/ICdzcGFjZS1iZXR3ZWVuJyA6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgIHtzdGVwICE9PSBGSURPU3RlcHMuRVJST1IgJiYgKFxuICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtzdGVwID09PSBGSURPU3RlcHMuUkVHSVNURVJ9XG4gICAgICAgICAgICAgICAgb25DbGljaz17YXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgYXdhaXQgYWRkRGV2aWNlKCk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgY29sb3I6XG4gICAgICAgICAgICAgICAgICAgIHN0ZXAgPT09IEZJRE9TdGVwcy5MT0dJTlxuICAgICAgICAgICAgICAgICAgICAgID8gJ3RleHQuc2Vjb25kYXJ5J1xuICAgICAgICAgICAgICAgICAgICAgIDogJ3NlY29uZGFyeS5tYWluJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZmlkby1tb2RhbC1uYW1pbmctc2tpcFwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dCgnU2tpcCcpfVxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgY29sdW1uR2FwOiAyIH19PlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZmlkby1tb2RhbC1jYW5jZWxcIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17aXNCdXR0b25zRGlzYWJsZWR9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBjYXB0dXJlKGBGaWRvRGV2aWNlJHtzZWxlY3RlZE1ldGhvZH1DYW5jZWxsZWRgKTtcbiAgICAgICAgICAgICAgICBvbkNhbmNlbCgpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnQ2FuY2VsJyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgaXNMb2FkaW5nPXtpc0J1dHRvbnNEaXNhYmxlZH1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzQnV0dG9uc0Rpc2FibGVkfVxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImZpZG8tbW9kYWwtYWR2YW5jZVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2FzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRpbmdTdGVwID09PSBGSURPU3RlcHMuTE9HSU4pIHtcbiAgICAgICAgICAgICAgICAgIGF3YWl0IGxvZ2luKCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF3YWl0IGFkZERldmljZShGSURPRGV2aWNlTmFtZSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtzdGVwICE9PSBGSURPU3RlcHMuRVJST1IgPyB0KCdOZXh0JykgOiB0KCdUcnkgQWdhaW4nKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvT3ZlcmxheT5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJ1dHRvbixcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgVHlwb2dyYXBoeSxcbiAgWEljb24sXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgU2lnbmVyU2Vzc2lvbkRhdGEgfSBmcm9tICdAY3ViaXN0LWxhYnMvY3ViZXNpZ25lci1zZGsnO1xuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vT3ZlcmxheSc7XG5pbXBvcnQgeyBBdXRoU3RlcCwgdXNlU2VlZGxlc3NBdXRoIH0gZnJvbSAnQHNyYy9ob29rcy91c2VTZWVkbGVzc0F1dGgnO1xuaW1wb3J0IHsgdXNlVG90cEVycm9yTWVzc2FnZSB9IGZyb20gJ0BzcmMvaG9va3MvdXNlVG90cEVycm9yTWVzc2FnZSc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyB1c2VPbmJvYXJkaW5nQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvT25ib2FyZGluZ1Byb3ZpZGVyJztcblxuaW50ZXJmYWNlIFRPVFBNb2RhbFByb3BzIHtcbiAgb25GaW5pc2g6ICgpID0+IHZvaWQ7XG4gIG9uQ2FuY2VsOiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVE9UUE1vZGFsKHsgb25GaW5pc2gsIG9uQ2FuY2VsIH06IFRPVFBNb2RhbFByb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IG9pZGNUb2tlbiwgc2V0U2VlZGxlc3NTaWduZXJUb2tlbiB9ID0gdXNlT25ib2FyZGluZ0NvbnRleHQoKTtcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3RvdHBDb2RlLCBzZXRUb3RwQ29kZV0gPSB1c2VTdGF0ZSgnJyk7XG5cbiAgY29uc3Qgb25TaWduZXJUb2tlbk9idGFpbmVkID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHRva2VuOiBTaWduZXJTZXNzaW9uRGF0YSkgPT4ge1xuICAgICAgc2V0U2VlZGxlc3NTaWduZXJUb2tlbih0b2tlbik7XG4gICAgICBvbkZpbmlzaCgpO1xuICAgIH0sXG4gICAgW3NldFNlZWRsZXNzU2lnbmVyVG9rZW4sIG9uRmluaXNoXSxcbiAgKTtcblxuICBjb25zdCBnZXRPaWRjVG9rZW4gPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiBvaWRjVG9rZW4gPz8gJycsIFtvaWRjVG9rZW5dKTtcblxuICBjb25zdCB7IGVycm9yLCBhdXRoZW50aWNhdGUsIHZlcmlmeVRvdHBDb2RlLCBzdGVwIH0gPSB1c2VTZWVkbGVzc0F1dGgoe1xuICAgIHNldElzTG9hZGluZyxcbiAgICBvblNpZ25lclRva2VuT2J0YWluZWQsXG4gICAgZ2V0T2lkY1Rva2VuLFxuICB9KTtcblxuICBjb25zdCB0b3RwRXJyb3IgPSB1c2VUb3RwRXJyb3JNZXNzYWdlKGVycm9yKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzdGVwID09PSBBdXRoU3RlcC5Ob3RJbml0aWFsaXplZCkge1xuICAgICAgYXV0aGVudGljYXRlKHt9KTtcbiAgICB9XG4gIH0sIFthdXRoZW50aWNhdGUsIHN0ZXBdKTtcblxuICByZXR1cm4gKFxuICAgIDxPdmVybGF5PlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6ICc1MTJweCcsXG4gICAgICAgICAgbWluSGVpZ2h0OiAnNDA3cHgnLFxuICAgICAgICAgIGJhY2tncm91bmQ6IHRoZW1lLnBhbGV0dGUuYmFja2dyb3VuZC5wYXBlcixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgICAgcDogMSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJoNFwiXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBwdDogMyxcbiAgICAgICAgICAgICAgcHg6IDQsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BhdXRoZW50aWNhdG9yLW1vZGFsLWhlYWRlcmB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ1ZlcmlmeSBDb2RlJyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgYXV0aGVudGljYXRvci1tb2RhbC1jbG9zZS1idXR0b25gfVxuICAgICAgICAgICAgb25DbGljaz17b25DYW5jZWx9XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBwOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoZW1lLnNwYWNpbmcoMyksXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGVtZS5zcGFjaW5nKDMpLFxuICAgICAgICAgICAgICBtaW5XaWR0aDogdGhlbWUuc3BhY2luZygzKSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFhJY29uIHNpemU9ezI0fSBzeD17eyBjb2xvcjogJ3ByaW1hcnkubWFpbicgfX0gLz5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgcHQ6IDEsXG4gICAgICAgICAgICBweDogNCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgbWluSGVpZ2h0PXs0MH0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgICAge3QoJ0VudGVyIHRoZSBjb2RlIGdlbmVyYXRlZCBmcm9tIHlvdXIgYXV0aGVudGljYXRvciBhcHAuJyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgICAgIGlucHV0UHJvcHM9e3sgc3R5bGU6IHsgd2lkdGg6ICcxMDAlJyB9IH19XG4gICAgICAgICAgICAgICAgdHlwZT1cInRlbFwiXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0VG90cENvZGUoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICByb3dzPXszfVxuICAgICAgICAgICAgICAgIG11bHRpbGluZVxuICAgICAgICAgICAgICAgIGVycm9yPXshIXRvdHBFcnJvcn1cbiAgICAgICAgICAgICAgICBoZWxwZXJUZXh0PXt0b3RwRXJyb3J9XG4gICAgICAgICAgICAgICAgb25LZXlEb3duPXthc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdmVyaWZ5VG90cENvZGUodG90cENvZGUpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBwOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGNvbHVtbkdhcDogMiB9fT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImF1dGhlbnRpY2F0b3ItbW9kYWwtY2FuY2VsXCJcbiAgICAgICAgICAgICAgb25DbGljaz17b25DYW5jZWx9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtpc0xvYWRpbmd9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzTG9hZGluZ31cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhdXRoZW50aWNhdG9yLW1vZGFsLW5leHRcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdmVyaWZ5VG90cENvZGUodG90cENvZGUpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnTmV4dCcpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9PdmVybGF5PlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgdXNlVGhlbWUsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICBCdXR0b24sXG4gIFhJY29uLFxuICBBbGVydENpcmNsZUljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPdmVybGF5IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9PdmVybGF5JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmludGVyZmFjZSBWZXJpZnlHb0JhY2tNb2RhbFByb3BzIHtcbiAgb25CYWNrOiAoKSA9PiB2b2lkO1xuICBvbkNhbmNlbDogKCkgPT4gdm9pZDtcbiAgaXNPcGVuOiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmVyaWZ5R29CYWNrTW9kYWwoe1xuICBvbkJhY2ssXG4gIG9uQ2FuY2VsLFxuICBpc09wZW4sXG59OiBWZXJpZnlHb0JhY2tNb2RhbFByb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGlmICghaXNPcGVuKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8T3ZlcmxheT5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnNTEycHgnLFxuICAgICAgICAgIG1pbkhlaWdodDogJzQwN3B4JyxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGVtZS5wYWxldHRlLmJhY2tncm91bmQucGFwZXIsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAxLFxuICAgICAgICAgIHA6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiaDRcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgcHQ6IDMsXG4gICAgICAgICAgICAgIHB4OiA0LFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgYXV0aGVudGljYXRvci1tb2RhbC1oZWFkZXJgfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdBcmUgWW91IFN1cmUgWW91IFdhbnQgVG8gR28gQmFjaz8nKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BhdXRoZW50aWNhdG9yLW1vZGFsLWNsb3NlLWJ1dHRvbmB9XG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNhbmNlbH1cbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHA6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhlbWUuc3BhY2luZygzKSxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoZW1lLnNwYWNpbmcoMyksXG4gICAgICAgICAgICAgIG1pbldpZHRoOiB0aGVtZS5zcGFjaW5nKDMpLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8WEljb24gc2l6ZT17MjR9IHN4PXt7IGNvbG9yOiAncHJpbWFyeS5tYWluJyB9fSAvPlxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICBwdDogMSxcbiAgICAgICAgICAgIHB4OiA0LFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAnR29pbmcgYmFjayB3aWxsIHRha2UgeW91IHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG9uYm9hcmRpbmcgZmxvdy4gWW91IHdpbGwgbmVlZCB0byByZS12ZXJpZnkgdGhlIE1GQSB5b3UganVzdCBzZXQgdXAgYmVmb3JlIGNvbnRpbnVpbmcgd2l0aCBhY2NvdW50IGNyZWF0aW9uLicsXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEFsZXJ0Q2lyY2xlSWNvbiBzaXplPXs4MH0gLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGNvbHVtbkdhcDogMixcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICAgICAgICAgICAgcDogMixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhdXRoZW50aWNhdG9yLW1vZGFsLWNhbmNlbFwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNhbmNlbH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnQ2FuY2VsJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvbiBkYXRhLXRlc3RpZD1cImF1dGhlbnRpY2F0b3ItbW9kYWwtbmV4dFwiIG9uQ2xpY2s9e29uQmFja30+XG4gICAgICAgICAgICB7dCgnR28gQmFjaycpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L092ZXJsYXk+XG4gICk7XG59XG4iLCJleHBvcnQgZW51bSBGSURPU3RlcHMge1xuICBOQU1JTkcgPSAnbmFtaW5nJyxcbiAgUkVHSVNURVIgPSAncmVnaXN0ZXInLFxuICBMT0dJTiA9ICdsb2dpbicsXG4gIEVSUk9SID0gJ2Vycm9yJyxcbn1cblxuLy8gV2hlbiB0aGUgdXNlciB3YW50cyB0byBsb2dpbiB3aXRoIGEgRklETyBkZXZpY2UsIHdlIGRvbid0IGdldCB0aGUgZGV2aWNlIGV4YWN0IHR5cGUgKGUuZy4gcGFzc2tleSBvciB5dWJpa2V5KSwgb25seSB3ZSBnZXQgdGhlIHRweWUgaXQgaXMgJ2ZpZG9cIlxuLy8gc28gd2UgbmVlZCB0byBoYW5kbGUgdGhlbSBhcyBhIHVuaXQgaW4gdGhlIGxvZ2luIHByb2Nlc3NcbmV4cG9ydCBlbnVtIFJlY292ZXJ5TWV0aG9kVHlwZXMge1xuICBQQVNTS0VZID0gJ3Bhc3NrZXknLFxuICBUT1RQID0gJ3RvdHAnLFxuICBZVUJJS0VZID0gJ3l1YmlrZXknLFxuICBGSURPID0gJ2ZpZG8nLFxuICBVTktOT1dOID0gJ3Vua25vd24nLFxufVxuIiwiaW1wb3J0IHsgQnV0dG9uLCBTdGFjayB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgdXNlRmVhdHVyZUZsYWdDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9GZWF0dXJlRmxhZ3NQcm92aWRlcic7XG5pbXBvcnQgeyBGZWF0dXJlR2F0ZXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmVhdHVyZUZsYWdzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBPbmJvYXJkaW5nVVJMcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9vbmJvYXJkaW5nL21vZGVscyc7XG5pbXBvcnQgeyBHb29nbGVCdXR0b24gfSBmcm9tICcuLi9TZWVkbGVzcy9jb21wb25lbnRzL0dvb2dsZUJ1dHRvbic7XG5pbXBvcnQgeyBBcHBsZUJ1dHRvbiB9IGZyb20gJy4uL1NlZWRsZXNzL2NvbXBvbmVudHMvQXBwbGVCdXR0b24nO1xuaW1wb3J0IHsgTG9hZGluZ092ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0xvYWRpbmdPdmVybGF5JztcbmltcG9ydCB7IHVzZVJlZiwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IEV4aXN0aW5nV2FsbGV0T3B0aW9ucyB9IGZyb20gJy4uL1NlZWRsZXNzL2NvbXBvbmVudHMvRXhpc3RpbmdXYWxsZXRPcHRpb25zJztcbmltcG9ydCB7IEJyYW5kTmFtZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9pY29ucy9CcmFuZE5hbWUnO1xuXG5leHBvcnQgZnVuY3Rpb24gU2lnblVwV2l0aFNlZWRsZXNzKCkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCB7IGZlYXR1cmVGbGFncyB9ID0gdXNlRmVhdHVyZUZsYWdDb250ZXh0KCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IFtpc0F1dGhlbnRpY2F0aW9uSW5Qcm9ncmVzcywgc2V0SXNBdXRoZW50aWNhdGlvbkluUHJvZ3Jlc3NdID1cbiAgICB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IHNjcmltUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgY29uc3Qgb3B0aW9uc1JlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG5cbiAgY29uc3QgW3Nob3dFeGlzdGluZ1dhbGxldE9wdGlvbiwgc2V0U2hvd0V4aXN0aW5nV2FsbGV0T3B0aW9uXSA9XG4gICAgdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlQ2xpY2tJblNoaW0gPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSBldmVudDtcbiAgICAgIGNvbnN0IG92ZXJsYXlDbGlja2VkID0gc2NyaW1SZWYuY3VycmVudD8uY29udGFpbnModGFyZ2V0IGFzIE5vZGUpO1xuICAgICAgY29uc3Qgb3B0aW9uc0NsaWNrZWQgPSBvcHRpb25zUmVmLmN1cnJlbnQ/LmNvbnRhaW5zKHRhcmdldCBhcyBOb2RlKTtcbiAgICAgIGlmIChvdmVybGF5Q2xpY2tlZCAmJiAhb3B0aW9uc0NsaWNrZWQpIHtcbiAgICAgICAgc2V0U2hvd0V4aXN0aW5nV2FsbGV0T3B0aW9uKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZUNsaWNrSW5TaGltKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVDbGlja0luU2hpbSk7XG4gICAgfTtcbiAgfSwgW3NjcmltUmVmLCBzZXRTaG93RXhpc3RpbmdXYWxsZXRPcHRpb25dKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzMyMnB4JyxcbiAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICB9fVxuICAgICAgICByZWY9e3NjcmltUmVmfVxuICAgICAgPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICBoZWlnaHQ6ICc0MCUnLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8QnJhbmROYW1lIHdpZHRoPXsxMjB9IC8+XG4gICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgPFN0YWNrIHN4PXt7IHJvd0dhcDogMiwgaGVpZ2h0OiAnNDAlJyB9fT5cbiAgICAgICAgICB7ZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5TRUVETEVTU19PTkJPQVJESU5HX0dPT0dMRV0gJiYgKFxuICAgICAgICAgICAgPEdvb2dsZUJ1dHRvbiBzZXRJc0xvYWRpbmc9e3NldElzQXV0aGVudGljYXRpb25JblByb2dyZXNzfSAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAge2ZlYXR1cmVGbGFnc1tGZWF0dXJlR2F0ZXMuU0VFRExFU1NfT05CT0FSRElOR19BUFBMRV0gJiYgKFxuICAgICAgICAgICAgPEFwcGxlQnV0dG9uIHNldElzTG9hZGluZz17c2V0SXNBdXRoZW50aWNhdGlvbkluUHJvZ3Jlc3N9IC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHB0OiAyLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgcm93R2FwOiAyLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIHN4PXt7IHdpZHRoOiAnMTAwJScgfX1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjcmVhdGUtd2FsbGV0LXNlZWQtcGhyYXNlLWJ1dHRvblwiXG4gICAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaChPbmJvYXJkaW5nVVJMcy5DUkVBVEVfV0FMTEVUKTtcbiAgICAgICAgICAgICAgICBjYXB0dXJlKCdSZWNvdmVyeVBocmFzZUNsaWNrZWQnKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ01hbnVhbGx5IENyZWF0ZSBOZXcgV2FsbGV0Jyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgc3g9e3sgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY2Vzcy1leGlzdGluZy13YWxsZXQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0U2hvd0V4aXN0aW5nV2FsbGV0T3B0aW9uKHRydWUpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnQWNjZXNzIEV4aXN0aW5nIFdhbGxldCcpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAge3Nob3dFeGlzdGluZ1dhbGxldE9wdGlvbiAmJiAoXG4gICAgICAgICAgPEV4aXN0aW5nV2FsbGV0T3B0aW9uc1xuICAgICAgICAgICAgcmVmPXtvcHRpb25zUmVmfVxuICAgICAgICAgICAgc2V0U2hvd0V4aXN0aW5nV2FsbGV0T3B0aW9uPXtzZXRTaG93RXhpc3RpbmdXYWxsZXRPcHRpb259XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG4gICAgICB7aXNBdXRoZW50aWNhdGlvbkluUHJvZ3Jlc3MgJiYgPExvYWRpbmdPdmVybGF5IC8+fVxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgU2lnblVwV2l0aFNlZWRsZXNzIH0gZnJvbSAnLi9TaWduVXBXaXRoU2VlZGxlc3MnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlT25ib2FyZGluZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL09uYm9hcmRpbmdQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBXZWxjb21lKCkge1xuICBjb25zdCB7IHJlc2V0U3RhdGVzIH0gPSB1c2VPbmJvYXJkaW5nQ29udGV4dCgpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmVzZXRTdGF0ZXMoKTtcbiAgfSwgW3Jlc2V0U3RhdGVzXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICA8U2lnblVwV2l0aFNlZWRsZXNzIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IElkZW50aXR5UHJvb2YgfSBmcm9tICdAY3ViaXN0LWxhYnMvY3ViZXNpZ25lci1zZGsnO1xuXG5leHBvcnQgZW51bSBTZWVkbGVzc1JlZ2lzdGFydGlvblJlc3VsdCB7XG4gIEFMUkVBRFlfUkVHSVNURVJFRCA9ICdBTFJFQURZX1JFR0lTVEVSRUQnLFxuICBBUFBST1ZFRCA9ICdBUFBST1ZFRCcsXG4gIEVSUk9SID0gJ0VSUk9SJyxcbn1cblxuZW51bSBTZWVkbGVzc1JlZ2lzdGFydGlvblJlc3BvbnNlVGV4dFN0YXR1cyB7XG4gIEFMUkVBRFlfUkVHSVNURVJFRCA9ICdBTFJFQURZX1JFR0lTVEVSRUQnLFxuICBBUFBST1ZFRCA9ICdvaycsXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhcHByb3ZlU2VlZGxlc3NSZWdpc3RyYXRpb24oXG4gIGlkZW50aXR5UHJvb2Y6IElkZW50aXR5UHJvb2YsXG4gIGlzTWZhUmVxdWlyZWQ6IGJvb2xlYW4sXG4pOiBQcm9taXNlPFNlZWRsZXNzUmVnaXN0YXJ0aW9uUmVzdWx0PiB7XG4gIHJldHVybiBmZXRjaChcbiAgICBwcm9jZXNzLmVudi5TRUVETEVTU19VUkwgK1xuICAgICAgYC92MS9yZWdpc3Rlcj9tZmEtcmVxdWlyZWQ9JHtpc01mYVJlcXVpcmVkID8gJ3RydWUnIDogJ2ZhbHNlJ31gLFxuICAgIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoaWRlbnRpdHlQcm9vZiksXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgIH0sXG4gIClcbiAgICAudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnN0IHsgbWVzc2FnZSB9OiB7IG1lc3NhZ2U6IFNlZWRsZXNzUmVnaXN0YXJ0aW9uUmVzcG9uc2VUZXh0U3RhdHVzIH0gPVxuICAgICAgICBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgbWVzc2FnZSA9PT0gU2VlZGxlc3NSZWdpc3RhcnRpb25SZXNwb25zZVRleHRTdGF0dXMuQUxSRUFEWV9SRUdJU1RFUkVEXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIFNlZWRsZXNzUmVnaXN0YXJ0aW9uUmVzdWx0LkFMUkVBRFlfUkVHSVNURVJFRDtcbiAgICAgIH1cbiAgICAgIGlmIChtZXNzYWdlID09PSBTZWVkbGVzc1JlZ2lzdGFydGlvblJlc3BvbnNlVGV4dFN0YXR1cy5BUFBST1ZFRCkge1xuICAgICAgICByZXR1cm4gU2VlZGxlc3NSZWdpc3RhcnRpb25SZXN1bHQuQVBQUk9WRUQ7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSlcbiAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgcmV0dXJuIFNlZWRsZXNzUmVnaXN0YXJ0aW9uUmVzdWx0LkVSUk9SO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgd29yZGxpc3RzIH0gZnJvbSAnYmlwMzknO1xuXG5leHBvcnQgY29uc3QgZ2V0UmFuZG9tTW5lbW9uaWNXb3JkID0gKHdvcmRsaXN0ID0gJ2VuZ2xpc2gnKTogc3RyaW5nID0+IHtcbiAgY29uc3Qgd29yZHMgPSB3b3JkbGlzdHNbd29yZGxpc3RdO1xuXG4gIGlmICghd29yZHMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gd29yZGxpc3Q6ICR7d29yZGxpc3R9YCk7XG4gIH1cblxuICBjb25zdCByYW5kID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogd29yZHMubGVuZ3RoKTtcblxuICByZXR1cm4gd29yZHNbcmFuZF0gYXMgc3RyaW5nO1xufTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNwbGl0U2VlZFBocmFzZShzZWVkUGhyYXNlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBzZWVkUGhyYXNlLnRyaW0oKS5zcGxpdCgvXFxzKy9nKTtcbn1cbiIsImltcG9ydCB7IE1uZW1vbmljIH0gZnJvbSAnZXRoZXJzJztcblxuZXhwb3J0IGNvbnN0IHdvcmRQaHJhc2VMZW5ndGggPSBbMTIsIDE4LCAyNF07XG5cbmV4cG9ydCBjb25zdCBpc1BocmFzZUNvcnJlY3QgPSAocGhyYXNlOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgdHJpbW1lZCA9IHBocmFzZS50cmltKCkuc3BsaXQoL1xccysvZyk7XG5cbiAgcmV0dXJuIChcbiAgICB3b3JkUGhyYXNlTGVuZ3RoLmluY2x1ZGVzKHRyaW1tZWQubGVuZ3RoKSAmJlxuICAgIE1uZW1vbmljLmlzVmFsaWRNbmVtb25pYyh0cmltbWVkLmpvaW4oJyAnKS50b0xvd2VyQ2FzZSgpKVxuICApO1xufTtcbiIsIi8qIChpZ25vcmVkKSAqLyJdLCJuYW1lcyI6WyJNbmVtb25pYyIsImNyZWF0ZU5ld01uZW1vbmljIiwicmFuZG9tQnl0ZXMiLCJjcnlwdG8iLCJnZXRSYW5kb21WYWx1ZXMiLCJVaW50OEFycmF5IiwiZW50cm9weVRvUGhyYXNlIiwiUGFnZVRpdGxlIiwiUGFnZVRpdGxlVmFyaWFudCIsInQiLCJ0cmFuc2xhdGUiLCJBbGVydENpcmNsZUljb24iLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJ1c2VUcmFuc2xhdGlvbiIsIkZ1bmN0aW9uTmFtZXMiLCJnZXRUcmFuc2xhdGVkRnVuY3Rpb25OYW1lIiwibmFtZSIsInRyYW5zbGF0aW9ucyIsIkJSSURHRSIsIlNXQVAiLCJTRU5EIiwiQlVZIiwiREVGSSIsIktFWVNUT05FIiwiVE9LRU5fREVUQUlMUyIsIkZ1bmN0aW9uSXNPZmZsaW5lIiwiZnVuY3Rpb25OYW1lIiwiaGlkZVBhZ2VUaXRsZSIsImNoaWxkcmVuIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJoZWlnaHQiLCJ3aWR0aCIsInZhcmlhbnQiLCJQUklNQVJZIiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZmxleEdyb3ciLCJzaXplIiwibWIiLCJtdCIsImFsaWduIiwiY29sb3IiLCJzdHlsZWQiLCJJbmxpbmVCb2xkIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIk92ZXJsYXkiLCJMb2FkaW5nT3ZlcmxheSIsIkJ1dHRvbiIsInVzZVRoZW1lIiwiUVJDb2RlSWNvbiIsIkNhbWVyYUJsb2NrZWRJY29uIiwiQW5pbWF0ZWRRUlNjYW5uZXIiLCJQdXJwb3NlIiwiVVJUeXBlIiwidXNlS2V5c3RvbmVTY2FubmVyQ29udGVudHMiLCJjYW1lcmFQZXJtaXNzaW9uIiwiaGFzRXJyb3IiLCJzZXRIYXNFcnJvciIsImhhbmRsZVNjYW4iLCJoYW5kbGVFcnJvciIsInBhbGV0dGUiLCJoZWFkTGluZXMiLCJhbGxvd0FjY2VzcyIsImhhc0FjY2VzcyIsImJsb2NrZWRBY2Nlc3MiLCJkZXNjcmlwdGlvbnMiLCJoZWxwZXJUZXh0cyIsIm9uQ2xpY2siLCJjb250ZW50cyIsIkZyYWdtZW50IiwicHVycG9zZSIsIlNZTkMiLCJvcHRpb25zIiwidXJUeXBlcyIsIkNSWVBUT19NVUxUSV9BQ0NPVU5UUyIsIm91dGxpbmUiLCJlcnJvciIsIm1haW4iLCJvdXRsaW5lT2Zmc2V0IiwiYmFja2dyb3VuZENvbG9yIiwibSIsInAiLCJib3JkZXJSYWRpdXMiLCJib3JkZXIiLCJib3JkZXJDb2xvciIsImdldFBhZ2VDb250ZW50IiwiaGVhZExpbmUiLCJkZXNjcmlwdGlvbiIsImNvbnRlbnQiLCJoZWxwZXJUZXh0IiwiSG9tZUljb24iLCJCb3giLCJMYW5ndWFnZVNlbGVjdG9yIiwiUmVkaXJlY3QiLCJSb3V0ZSIsIlN3aXRjaCIsInVzZUhpc3RvcnkiLCJ1c2VMb2NhdGlvbiIsIlN1c3BlbnNlIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJDcmVhdGVXYWxsZXQiLCJPbmJvYXJkaW5nUGhhc2UiLCJPbmJvYXJkaW5nVVJMcyIsIktleXN0b25lIiwiTGVkZ2VyQ29ubmVjdCIsIkltcG9ydFdhbGxldCIsIkNyZWF0ZVBhc3N3b3JkIiwiQW5hbHl0aWNzQ29uc2VudCIsInVzZU9uYm9hcmRpbmdDb250ZXh0IiwiQXBwQmFja2dyb3VuZCIsIkxlZGdlclRyb3VibGUiLCJ1c2VBbmFseXRpY3NDb250ZXh0IiwiV2VsY29tZSIsIlJlY292ZXJ5TWV0aG9kcyIsIlJlY292ZXJ5TWV0aG9kc0xvZ2luIiwiVmVyaWZ5R29CYWNrTW9kYWwiLCJDb250ZW50UGFydCIsIk9uYm9hcmRpbmdTdGVwIiwiT25ib2FyZGluZyIsImhpc3RvcnkiLCJsb2NhdGlvbiIsInN1Ym1pdEluUHJvZ3Jlc3MiLCJzZXRPbmJvYXJkaW5nUGhhc2UiLCJvbmJvYXJkaW5nUGhhc2UiLCJpbml0QW5hbHl0aWNzSWRzIiwiY2FwdHVyZSIsImlzVmVyaWZ5R29CYWNrTW9kYWxPcGVuIiwic2V0SXNWZXJpZnlHb0JhY2tNb2RhbE9wZW4iLCJkaXNwbGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsInB4IiwicHkiLCJwYXRoIiwiQU5BTFlUSUNTX0NPTlNFTlQiLCJmYWxsYmFjayIsIkNSRUFURV9QQVNTV09SRCIsIlNFRURfUEhSQVNFIiwiTEVER0VSIiwiTEVER0VSX1RST1VCTEUiLCJDUkVBVEVfV0FMTEVUIiwiUkVDT1ZFUllfTUVUSE9EUyIsIlJFQ09WRVJZX01FVEhPRFNfTE9HSU4iLCJPTkJPQVJESU5HX0hPTUUiLCJ0byIsInBhdGhuYW1lIiwicGwiLCJwYiIsImN1cnNvciIsInN0ZXAiLCJTRUVETEVTU19HT09HTEUiLCJwdXNoIiwiaXNPcGVuIiwib25CYWNrIiwib25DYW5jZWwiLCJiYWNrZHJvcEZpbHRlciIsInVzZVJlZiIsIkNoZWNrSWNvbiIsIkNoZXZyb25Eb3duSWNvbiIsIkNsaWNrQXdheUxpc3RlbmVyIiwiR3JvdyIsIk1lbnVJdGVtIiwiTWVudUxpc3QiLCJQb3BwZXIiLCJ1c2VMYW5ndWFnZSIsInRoZW1lIiwiYXZhaWxhYmxlTGFuZ3VhZ2VzIiwiY2hhbmdlTGFuZ3VhZ2UiLCJjdXJyZW50TGFuZ3VhZ2UiLCJidXR0b25SZWYiLCJpc0Ryb3Bkb3duT3BlbiIsInNldElzRHJvcGRvd25PcGVuIiwib25DbGlja0F3YXkiLCJyZWYiLCJnYXAiLCJjbGFzc05hbWUiLCJ0cmFuc2l0aW9uIiwidHJhbnNpdGlvbnMiLCJjcmVhdGUiLCJ0cmFuc2Zvcm0iLCJvcGVuIiwiYW5jaG9yRWwiLCJjdXJyZW50IiwicGxhY2VtZW50IiwiVHJhbnNpdGlvblByb3BzIiwiX2V4dGVuZHMiLCJ0aW1lb3V0IiwiZGVuc2UiLCJvdmVyZmxvdyIsIm1hcCIsImxhbmciLCJpc0N1cnJlbnRMYW5nIiwiY29kZSIsImtleSIsImxhbmd1YWdlIiwiZmxleERpcmVjdGlvbiIsIm9yaWdpbmFsTmFtZSIsIkJyYW5kTmFtZSIsIk9uYm9hcmRpbmdTdGVwSGVhZGVyIiwidGVzdElkIiwidGl0bGUiLCJ0ZXh0QWxpZ24iLCJwdCIsIlRvb2x0aXAiLCJQYWdlVHJhY2tlciIsIlBhZ2VOYXYiLCJiYWNrVGV4dCIsIm9uTmV4dCIsIm5leHRUZXh0IiwiZGlzYWJsZU5leHQiLCJuZXh0RGlzYWJsZWRSZWFzb24iLCJzdGVwcyIsImFjdGl2ZVN0ZXAiLCJleHBhbmQiLCJqdXN0aWZ5SXRlbXMiLCJhbGlnbkNvbnRlbnQiLCJteSIsInJvd0dhcCIsInNwYWNpbmciLCJjb2x1bW5HYXAiLCJkaXNhYmxlZCIsIk1vYmlsZVN0ZXBwZXIiLCJiYWNrQnV0dG9uIiwibmV4dEJ1dHRvbiIsInBvc2l0aW9uIiwibWFyZ2luIiwid29yZFBocmFzZUxlbmd0aCIsIldvcmRzTGVuZ3RoU2VsZWN0b3IiLCJ3b3Jkc0xlbmd0aCIsImN1cnJlbnRXb3Jkc0xlbmd0aCIsInNldFdvcmRzTGVuZ3RoIiwibWwiLCJsZW5ndGgiLCJTZWVkbGVzc1JlZ2lzdGFydGlvblJlc3VsdCIsImFwcHJvdmVTZWVkbGVzc1JlZ2lzdHJhdGlvbiIsInRvYXN0IiwicmVxdWVzdE9pZGNBdXRoIiwiZ2V0T2lkY0NsaWVudCIsImdldE9yZ0lkIiwiZ2V0U2lnbmVyU2Vzc2lvbiIsInVzZUNhbGxiYWNrIiwiZ2V0U2lnbmVyVG9rZW4iLCJSZWNvdmVyeU1ldGhvZFR5cGVzIiwibGF1bmNoRmlkb0Zsb3ciLCJGSURPQXBpRW5kcG9pbnQiLCJLZXlUeXBlIiwidXNlRmVhdHVyZUZsYWdDb250ZXh0IiwiRmVhdHVyZUdhdGVzIiwiVE9UUF9JU1NVRVIiLCJyZWNvdmVyeU1ldGhvZFRvRmlkb0tleVR5cGUiLCJtZXRob2QiLCJQQVNTS0VZIiwiUGFzc2tleSIsIllVQklLRVkiLCJZdWJpa2V5IiwiRXJyb3IiLCJ1c2VTZWVkbGVzc0FjdGlvbnMiLCJzZXRPaWRjVG9rZW4iLCJzZXRTZWVkbGVzc1NpZ25lclRva2VuIiwib2lkY1Rva2VuIiwic2V0VXNlcklkIiwic2V0SXNTZWVkbGVzc01mYVJlcXVpcmVkIiwic2V0TmV3c2xldHRlckVtYWlsIiwidG90cENoYWxsZW5nZSIsInNldFRvdHBDaGFsbGVuZ2UiLCJtZmFTZXNzaW9uIiwic2V0TWZhU2Vzc2lvbiIsImVycm9yTWVzc2FnZSIsInNldEVycm9yTWVzc2FnZSIsImZlYXR1cmVGbGFncyIsImhhbmRsZU9pZGNUb2tlbiIsImlkVG9rZW4iLCJvaWRjQ2xpZW50IiwiaWRlbnRpdHkiLCJpZGVudGl0eVByb3ZlIiwidXNlcl9pbmZvIiwicmVzdWx0IiwiU0VFRExFU1NfT1BUSU9OQUxfTUZBIiwiQVBQUk9WRUQiLCJvaWRjQXV0aCIsIm1mYVNlc3Npb25JbmZvIiwic3ViIiwiZW1haWwiLCJjb25maWd1cmVkX21mYSIsInNpZ25JbiIsInNldElzTG9hZGluZyIsImdldE9pZGNUb2tlbiIsInByb3ZpZGVyIiwidGhlbiIsImNhdGNoIiwiZmluYWxseSIsInJlZ2lzdGVyVE9UUFN0YXJ0IiwiYyIsInJlcXVpcmVzTWZhIiwiZGF0YSIsImNvbnNvbGUiLCJzaWduZXJTZXNzaW9uIiwicmVzZXRUb3RwU3RhcnQiLCJjaGFsbGVuZ2UiLCJlIiwidmVyaWZ5UmVnaXN0cmF0aW9uQ29kZSIsInJlc2V0VG90cENvbXBsZXRlIiwidG90cElkIiwic3RhdHVzIiwidG90cEFwcHJvdmUiLCJtZmFJZCIsInJlY2VpcHQiLCJjb25maXJtYXRpb24iLCJvaWRjQXV0aFJlc3BvbnNlIiwibWZhT3JnSWQiLCJtZmFDb25mIiwic2lnbmVyVG9rZW4iLCJfZXJyIiwibG9naW5XaXRoRklETyIsInJlc3AiLCJyZXNwb25kTWZhSWQiLCJmaWRvQXBwcm92ZVN0YXJ0IiwiYW5zd2VyIiwiQXV0aGVudGljYXRlIiwibWZhSW5mbyIsInNpZ25XaXRoTWZhQXBwcm92YWwiLCJwcm9jZXNzIiwiZW52IiwiU0VFRExFU1NfT1JHX0lEIiwibG9naW5XaXRob3V0TUZBIiwiYXV0aFJlc3BvbnNlIiwiYWRkRklET0RldmljZSIsInNlbGVjdGVkTWV0aG9kIiwibG9naW5SZXNwIiwic2Vzc2lvbiIsImFkZEZpZG9SZXNwIiwiYWRkRmlkb1N0YXJ0IiwiUHVibGljS2V5Q3JlZGVudGlhbCIsImlzVXNlclZlcmlmeWluZ1BsYXRmb3JtQXV0aGVudGljYXRvckF2YWlsYWJsZSIsImF1dGhlbnRpY2F0b3JTZWxlY3Rpb24iLCJhdXRoZW50aWNhdG9yQXR0YWNobWVudCIsIlJlZ2lzdGVyIiwiVHJhbnMiLCJBaXJkcm9wSWNvbiIsInVzZU1lbW8iLCJzZXRBbmFseXRpY3NDb25zZW50Iiwic3VibWl0IiwiYW5hbHl0aWNzQ29uc2VudCIsIm5ld3NsZXR0ZXJFbWFpbCIsImlzTmV3c2xldHRlckVuYWJsZWQiLCJzdG9wRGF0YUNvbGxlY3Rpb24iLCJnZXRTdGVwcyIsIklNUE9SVF9XQUxMRVQiLCJzdGVwc051bWJlciIsIlNFRURMRVNTX0FQUExFIiwidW5kZWZpbmVkIiwiY29yZVdlYkxpbmsiLCJDT1JFX1dFQl9CQVNFX1VSTCIsIndpbmRvdyIsInJlcGxhY2UiLCJjbG9zZSIsImkxOG5LZXkiLCJjb21wb25lbnRzIiwiYiIsImdvQmFjayIsImRpc2FibGVSaXBwbGUiLCJDaGVja2JveCIsIkRpdmlkZXIiLCJJbnB1dEFkb3JubWVudCIsIlRleHRGaWVsZCIsIlhJY29uIiwiUGFzc3dvcmRTdHJlbmd0aCIsIlR5cG9ncmFwaHlMaW5rIiwiV2FsbGV0VHlwZSIsIkpvaSIsImlzTmV3c2xldHRlckNvbmZpZ3VyZWQiLCJFbWFpbFZhbGlkYXRpb25SZXN1bHQiLCJ2YWxpZGF0ZUVtYWlsIiwic3RyaW5nIiwidmFsaWRhdGUiLCJJbnZhbGlkIiwiVmFsaWQiLCJzZXRQYXNzd29yZEFuZE5hbWVzIiwic2V0SXNOZXdzbGV0dGVyRW5hYmxlZCIsIm9uYm9hcmRpbmdXYWxsZXRUeXBlIiwid2FsbGV0TmFtZSIsInNldFdhbGxldE5hbWUiLCJwYXNzd29yZCIsInNldFBhc3N3b3JkIiwiY29uZmlybVBhc3N3b3JkVmFsIiwic2V0Q29uZmlybVBhc3N3b3JkVmFsIiwidGVybUFuZFBvbGljeUNoZWNrZWQiLCJzZXRUZXJtQW5kUG9saWN5Q2hlY2tlZCIsImlzUGFzc3dvcmRJbnB1dEZpbGxlZCIsInNldElzUGFzc3dvcmRJbnB1dEZpbGxlZCIsIm5ld1Bhc3N3b3JkU3RyZW5ndGgiLCJzZXROZXdQYXNzd29yZFN0cmVuZ3RoIiwiZW1haWxWYWxpZGF0aW9uUmVzdWx0Iiwic2V0RW1haWxWYWxpZGF0aW9uUmVzdWx0IiwiU2VlZGxlc3MiLCJVbmRldGVybWluZWQiLCJQQVNTV09SRCIsImlzRmllbGRzRmlsbGVkIiwiY29uZmlybWF0aW9uRXJyb3IiLCJwYXNzd29yZExlbmd0aEVycm9yIiwiY2FuU3VibWl0IiwidGV4dCIsInNlY29uZGFyeSIsImFsaWduU2VsZiIsImxhYmVsIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJ2YWx1ZSIsInBsYWNlaG9sZGVyIiwiYXV0b0ZvY3VzIiwiZnVsbFdpZHRoIiwiaW5wdXRMYWJlbFByb3BzIiwiZm9udFNpemUiLCJ0eXBvZ3JhcGh5IiwiYm9keTIiLCJtaW5IZWlnaHQiLCJ0eXBlIiwib25CbHVyIiwic2V0UGFzc3dvcmRTdHJlbmd0aCIsInN0eWxlIiwicHJpbWFyeSIsImNoZWNrZWQiLCJ0ZXJtTGluayIsImFzIiwiaHJlZiIsInJlbCIsImxpZ2h0IiwibXgiLCJlbmFibGVkIiwicHJpdmFjeUxpbmsiLCJJbnB1dFByb3BzIiwiZW5kQWRvcm5tZW50Iiwic3VjY2VzcyIsIkJvbGRUZXh0IiwiQ29uZmlybU1uZW1vbmljIiwicGhyYXNlIiwid29yZENvdW50IiwiY29uZmlybVdvcmRDb3VudCIsIm9uQ29uZmlybWVkQ2hhbmdlIiwid29yZHNUb0NvbmZpcm0iLCJzZXRXb3Jkc1RvQ29uZmlybSIsIndvcmRzIiwic3BsaXQiLCJmaXJzdFdvcmRUZXh0IiwibmV4dFdvcmRUZXh0IiwiZ2V0UmFuZG9tV29yZHNGb3JJbmRleCIsImluZGV4IiwicmFuZG9tV29yZHMiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInJhbmRvbVdvcmQiLCJpbmNsdWRlcyIsInRvQ29uZmlybSIsIk9iamVjdCIsImtleXMiLCJzb3J0Iiwic2VsZWN0ZWQiLCJzZWxlY3RXb3JkRm9ySW5kZXgiLCJ3b3JkIiwic2VsZWN0ZWRXb3JkIiwibmV3U3RhdGUiLCJ2YWx1ZXMiLCJldmVyeSIsIml0ZW0iLCJOdW1iZXIiLCJpIiwiZm9udFdlaWdodCIsImJhY2tncm91bmQiLCJncmV5IiwibXIiLCJ1c2VyU2VsZWN0IiwiQ29uZmlybVBocmFzZSIsIm1uZW1vbmljIiwidGVybXNDb25maXJtZWQiLCJzZXRUZXJtc0NvbmZpcm1lZCIsImNvbmZpcm1NbmVtb25pYyIsImNvbmZpcm1lZCIsIkNvcHlQaHJhc2UiLCJPTkJPQVJESU5HX0VWRU5UX05BTUVTIiwic2V0TW5lbW9uaWMiLCJzZXRPbmJvYXJkaW5nV2FsbGV0VHlwZSIsImlzQ29waWVkIiwic2V0SXNDb3BpZWQiLCJzZXRNbmVtb25pY1BocmFzZSIsImNyZWF0ZV93YWxsZXQiLCJTaG93TW5lbW9uaWMiLCJwcm9wcyIsIkNvcHlJY29uIiwiR3JpZCIsImdldFJhbmRvbU1uZW1vbmljV29yZCIsIkZha2VXb3JkIiwibGVmdCIsInRvcCIsInpJbmRleCIsIm9wYWNpdHkiLCJpbnB1dHMiLCJsaXN0IiwibnVtIiwiaXNGYWtlQmVmb3JlUmVhbCIsIm1pbldpZHRoIiwib25Db3B5IiwibmF2aWdhdG9yIiwiY2xpcGJvYXJkIiwid3JpdGVUZXh0IiwiZHVyYXRpb24iLCJjb250YWluZXIiLCJldiIsInByZXZlbnREZWZhdWx0Iiwic3BsaXRTZWVkUGhyYXNlIiwiaXNQaHJhc2VDb3JyZWN0IiwicmVjb3ZlcnlQaHJhc2UiLCJzZXRSZWNvdmVyeVBocmFzZSIsInNldEVycm9yIiwic2V0V29yZHMiLCJpbXBvcnRfd2FsbGV0Iiwic2xpY2VXb3JkcyIsInNlbGVjdGVkTGVuZ3RoIiwiY3VycmVudFdvcmRzIiwiY3V0V29yZHMiLCJsaW1pdCIsInNsaWNlIiwiaXNQaHJhc2VWYWxpZCIsIm9uUGhyYXNlQ2hhbmdlZCIsImpvaW4iLCJuZXh0QnV0dG9uRGlzYWJsZWQiLCJpbnB1dEZpZWxkcyIsImZpZWxkcyIsImF1dG9Db21wbGV0ZSIsIm9uRm9jdXMiLCJzZXRBdHRyaWJ1dGUiLCJvblBhc3RlIiwicGFzdGVkVGV4dCIsImNsaXBib2FyZERhdGEiLCJnZXREYXRhIiwibmV3V29yZHMiLCJvbktleVByZXNzIiwiZmxleEZsb3ciLCJwciIsIkV4dGVybmFsTGlua0ljb24iLCJLZXlzdG9uZVFSQ29kZVNjYW5uZXIiLCJLRVlTVE9ORV9DT05ORUNUX1NVUFBPUlRfVVJMIiwiZ2V0QWRkcmVzc0Zyb21YUHViIiwidXNlR2V0QXZheEJhbGFuY2UiLCJEZXJpdmVkQWRkcmVzc2VzIiwiS2V5c3RvbmVTdGVwSW1hZ2UiLCJLZXlzdG9uZUltYWdlQmFja2dyb3VuZCIsInR1dG9yaWFsTGFzdFN0ZXAiLCJzZXRNYXN0ZXJGaW5nZXJwcmludCIsInNldFhwdWIiLCJzdGVwTnVtYmVyIiwic2V0U3RlcE51bWJlciIsInhQdWJLZXkiLCJzZXRYUHViS2V5IiwiaXNRUkNvZGVTY2FuT3BlbiIsInNldElzUVJDb2RlU2Nhbk9wZW4iLCJhZGRyZXNzZXMiLCJzZXRBZGRyZXNzZXMiLCJnZXRBdmF4QmFsYW5jZSIsImtleXN0b25lIiwiZ2V0QWRkcmVzc0Zyb21YcHViS2V5IiwieHB1YiIsImFjY291bnRJbmRleCIsImFkZHJlc3NMaXN0IiwiYWRkcmVzcyIsImJhbGFuY2UiLCJuZXdBZGRyZXNzZXMiLCJiYWxhbmNlRGlzcGxheVZhbHVlIiwiaGVhZGVyVGl0bGVzIiwiaGVhZGVyRGVzY3JpcHRpb25zIiwibmV4dEJ1dHRvbkxhYmVscyIsInhwdWJDaGFuZ2VIYW5kbGVyIiwibmV3VmFsdWUiLCJzcmMiLCJLRVlTVE9ORV9UVVRPUklBTCIsIm1hcmdpblJpZ2h0Iiwic2V0TWFzdGVyRmluZ2VyUHJpbnQiLCJvblN1Y2Nlc3MiLCJDcnlwdG9NdWx0aUFjY291bnRzIiwicHJvbXB0QWNjZXNzIiwic2V0Q2FtZXJhUGVybWlzc2lvbiIsIm1lZGlhRGV2aWNlcyIsImdldFVzZXJNZWRpYSIsInZpZGVvIiwiYXR0ZW1wdHMiLCJjYm9yIiwiYnVmZmVyIiwiQnVmZmVyIiwiZnJvbSIsImNyeXB0b011bHRpQWNjb3VudHMiLCJmcm9tQ0JPUiIsIm1hc3RlckZpbmdlcnByaW50IiwiZ2V0TWFzdGVyRmluZ2VycHJpbnQiLCJ0b1N0cmluZyIsImdldEtleXMiLCJnZXRCaXAzMktleSIsInRlc3QiLCJEYXRlIiwibm93IiwicGFnZUNvbnRlbnQiLCJnZXRQZXJtaXNzaW9ucyIsInBlcm1pc3Npb24iLCJwZXJtaXNzaW9ucyIsInF1ZXJ5Iiwib25jaGFuZ2UiLCJzdGF0ZSIsInBhcGVyIiwiTGVkZ2VyV3JvbmdWZXJzaW9uT3ZlcmxheSIsIkluZm9DaXJjbGVJY29uIiwiTGVkZ2VyQ29ubmVjdG9yIiwiTGVkZ2VyU3RhdHVzIiwiV0FJVF8xNTAwX01JTExJX0ZPUl9VU0VSIiwic2V0WHB1YlhQIiwic2V0UHVibGljS2V5cyIsInNldE51bWJlck9mQWNjb3VudHNUb0NyZWF0ZSIsImhhc1B1YmxpY0tleXMiLCJzZXRIYXNQdWJsaWNLZXlzIiwiTGVkZ2VyIiwibGVkZ2VyIiwieHB1YlhQIiwicHVibGljS2V5cyIsImxhc3RBY2NvdW50SW5kZXhXaXRoQmFsYW5jZSIsIkNvbnRlbnQiLCJ2ZXJ0aWNhbEFsaWduIiwib25Ucm91Ymxlc2hvb3QiLCJvbkNsb3NlIiwiUmVtb3RlSWNvbiIsIkxlZGdlclRyb3VibGVTdGVwcyIsIm1hcmdpbkxlZnQiLCJLZXlJY29uIiwiVXNiSWNvbiIsIk1ldGhvZENhcmQiLCJBdXRoZW50aWNhdG9yTW9kYWwiLCJBdXRoZW50aWNhdG9yU3RlcHMiLCJGSURPTW9kYWwiLCJzZXRTZWxlY3RlZE1ldGhvZCIsImlzTW9kYWxPcGVuIiwic2V0SXNNb2RhbE9wZW4iLCJpc1NlZWRsZXNzTWZhUmVxdWlyZWQiLCJpc1NlZWRsZXNzTWZhUmVxdWlyZWRGb3JBY2NvdW50IiwiYm9sZCIsIlNFRURMRVNTX01GQV9QQVNTS0VZIiwiaWNvbiIsIlNFRURMRVNTX01GQV9BVVRIRU5USUNBVE9SIiwiVE9UUCIsIlNFRURMRVNTX01GQV9ZVUJJS0VZIiwiU0NBTiIsIm9uRmluaXNoIiwiU2tlbGV0b24iLCJUT1RQTW9kYWwiLCJGSURPU3RlcHMiLCJjb25maWd1cmVkTWZhcyIsInNldENvbmZpZ3VyZWRNZmFzIiwiaXNMb2FkaW5nIiwiZ2V0TWZhcyIsImNvbmZpZ3VyZWRNZmEiLCJtZmFzIiwibWZhIiwiVU5LTk9XTiIsIm1mYURldmljZSIsIkZJRE8iLCJzdGFydGluZ1N0ZXAiLCJMT0dJTiIsIkFwcGxlSWNvbiIsImF1dGhlbnRpY2F0ZVdpdGhBcHBsZSIsIlNlZWRsZXNzQXV0aFByb3ZpZGVyIiwiQXBwbGVCdXR0b24iLCJzZXRBdXRoUHJvdmlkZXIiLCJzdGFydEljb24iLCJBcHBsZSIsIkV4aXN0aW5nV2FsbGV0QnV0dG9uIiwiU2hpZWxkTG9ja0ljb24iLCJMZWRnZXJJY29uIiwiS2V5c3RvbmVJY29uIiwiQXJyb3dMZWZ0SWNvblYyIiwiZm9yd2FyZFJlZiIsIkV4aXN0aW5nV2FsbGV0T3B0aW9ucyIsInNldFNob3dFeGlzdGluZ1dhbGxldE9wdGlvbiIsIkdvb2dsZUNvbG9ySWNvbiIsImF1dGhlbnRpY2F0ZVdpdGhHb29nbGUiLCJHb29nbGVCdXR0b24iLCJzZWVkbGVzc19nb29nbGUiLCJHb29nbGUiLCJDYXJkIiwiQ2hldnJvblJpZ2h0SWNvbiIsIkNhcmRBY3Rpb25BcmVhIiwiUVJDb2RlIiwic2V0U3RlcCIsInRvdHBDb2RlIiwic2V0VG90cENvZGUiLCJpc0NvZGVWZXJpZnlpbmciLCJzZXRJc0NvZGVWZXJpZnlpbmciLCJ0b3RwU2VjcmV0IiwiVVJMIiwidG90cFVybCIsInNlYXJjaFBhcmFtcyIsImdldCIsInNjYW4iLCJ2ZXJpZnkiLCJoZWxwIiwidmVyaWZ5Q29kZSIsImlzU3VjY2Vzc2Z1bCIsIkhFTFAiLCJjb21tb24iLCJ3aGl0ZSIsInJlbmRlckFzIiwiZmdDb2xvciIsImJsYWNrIiwiYmdDb2xvciIsImxldmVsIiwiaW5wdXRQcm9wcyIsImV2ZW50Iiwicm93cyIsIm11bHRpbGluZSIsIm9uS2V5RG93biIsIndvcmRCcmVhayIsInN1YnRpdGxlMiIsImg1IiwiYWN0aW9uQnV0dG9ucyIsIktFWSIsIm5leHRTdGVwQWN0aW9uIiwiVkVSSUZZIiwiaXNEaXNhYmxlZCIsIkZJRE9EZXZpY2VOYW1lIiwic2V0RklET0RldmljZU5hbWUiLCJOQU1JTkciLCJpc0xvZ2luU3VjY2Vzc2Z1bCIsInNldElzTG9naW5TdWNjZXNzZnVsIiwiaXNCdXR0b25zRGlzYWJsZWQiLCJSRUdJU1RFUiIsImxvZ2luIiwiRVJST1IiLCJhZGREZXZpY2UiLCJkZXZpY2VOYW1lIiwiaXNGaWRvUmVnaXN0ZXJTdWNjZXNzZnVsIiwiaXNGaWRvTG9naW5TdWNjZXNzZnVsIiwibmFtaW5nIiwiZGV2aWNlIiwicmVnaXN0ZXIiLCJ0ZXh0VHJhbnNmb3JtIiwiQXV0aFN0ZXAiLCJ1c2VTZWVkbGVzc0F1dGgiLCJ1c2VUb3RwRXJyb3JNZXNzYWdlIiwib25TaWduZXJUb2tlbk9idGFpbmVkIiwidG9rZW4iLCJhdXRoZW50aWNhdGUiLCJ2ZXJpZnlUb3RwQ29kZSIsInRvdHBFcnJvciIsIk5vdEluaXRpYWxpemVkIiwiU2lnblVwV2l0aFNlZWRsZXNzIiwiaXNBdXRoZW50aWNhdGlvbkluUHJvZ3Jlc3MiLCJzZXRJc0F1dGhlbnRpY2F0aW9uSW5Qcm9ncmVzcyIsInNjcmltUmVmIiwib3B0aW9uc1JlZiIsInNob3dFeGlzdGluZ1dhbGxldE9wdGlvbiIsImhhbmRsZUNsaWNrSW5TaGltIiwib3ZlcmxheUNsaWNrZWQiLCJjb250YWlucyIsIm9wdGlvbnNDbGlja2VkIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIlNFRURMRVNTX09OQk9BUkRJTkdfR09PR0xFIiwiU0VFRExFU1NfT05CT0FSRElOR19BUFBMRSIsInJlc2V0U3RhdGVzIiwiU2VlZGxlc3NSZWdpc3RhcnRpb25SZXNwb25zZVRleHRTdGF0dXMiLCJpZGVudGl0eVByb29mIiwiaXNNZmFSZXF1aXJlZCIsImZldGNoIiwiU0VFRExFU1NfVVJMIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJoZWFkZXJzIiwicmVzcG9uc2UiLCJtZXNzYWdlIiwianNvbiIsIkFMUkVBRFlfUkVHSVNURVJFRCIsIndvcmRsaXN0cyIsIndvcmRsaXN0IiwicmFuZCIsInNlZWRQaHJhc2UiLCJ0cmltIiwidHJpbW1lZCIsImlzVmFsaWRNbmVtb25pYyIsInRvTG93ZXJDYXNlIl0sInNvdXJjZVJvb3QiOiIifQ==