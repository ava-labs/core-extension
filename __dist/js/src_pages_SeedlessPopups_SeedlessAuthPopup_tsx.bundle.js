"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_SeedlessPopups_SeedlessAuthPopup_tsx"],{

/***/ "./src/components/common/seedless/components/AuthenticationError.tsx":
/*!***************************************************************************!*\
  !*** ./src/components/common/seedless/components/AuthenticationError.tsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthenticationError": () => (/* binding */ AuthenticationError)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/seedless/models */ "./src/background/services/seedless/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const AuthenticationError = ({
  error
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      width: 1,
      px: 5,
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center',
      gap: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AlertCircleIcon, {
    size: 48,
    color: "error.light"
  }), error === _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_0__.AuthErrorCode.MismatchingEmail ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, t('Wrong email address.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t('Please log in with the email address you used when you created your wallet.'))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, t('Sorry, we are having trouble logging you in.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t('Please verify your network connection or try again later.'))));
};

/***/ }),

/***/ "./src/components/common/seedless/components/WaitingForAuthentication.tsx":
/*!********************************************************************************!*\
  !*** ./src/components/common/seedless/components/WaitingForAuthentication.tsx ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WaitingForAuthentication": () => (/* binding */ WaitingForAuthentication)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const WaitingForAuthentication = ({
  provider
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_0__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      width: 1,
      px: 5,
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center',
      gap: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, {
    size: 48,
    sx: {
      mb: 3
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h4"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_2__.Trans, {
    i18nKey: "Waiting for <bold>{{provider}}</bold> authentication to complete",
    components: {
      bold: /*#__PURE__*/React.createElement("b", {
        style: {
          textTransform: 'capitalize'
        }
      })
    },
    values: {
      provider
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t('Do not close this window until the process is complete or you may need to restart.')));
};

/***/ }),

/***/ "./src/pages/SeedlessPopups/SeedlessAuthPopup.tsx":
/*!********************************************************!*\
  !*** ./src/pages/SeedlessPopups/SeedlessAuthPopup.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SeedlessAuthPopup": () => (/* binding */ SeedlessAuthPopup)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useSeedlessAuth */ "./src/hooks/useSeedlessAuth.ts");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_utils_seedless_getOidcTokenProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/seedless/getOidcTokenProvider */ "./src/utils/seedless/getOidcTokenProvider.ts");
/* harmony import */ var _src_components_common_seedless_components_TOTPChallenge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/seedless/components/TOTPChallenge */ "./src/components/common/seedless/components/TOTPChallenge.tsx");
/* harmony import */ var _src_components_common_seedless_components_AuthenticationError__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/common/seedless/components/AuthenticationError */ "./src/components/common/seedless/components/AuthenticationError.tsx");
/* harmony import */ var _src_components_common_seedless_components_WaitingForAuthentication__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/components/common/seedless/components/WaitingForAuthentication */ "./src/components/common/seedless/components/WaitingForAuthentication.tsx");
/* harmony import */ var _src_components_common_seedless_components_FIDOChallenge__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/components/common/seedless/components/FIDOChallenge */ "./src/components/common/seedless/components/FIDOChallenge.tsx");
/* harmony import */ var _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/background/services/seedless/models */ "./src/background/services/seedless/models.ts");
/* harmony import */ var _src_components_common_seedless_components_MfaChoicePrompt__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/components/common/seedless/components/MfaChoicePrompt */ "./src/components/common/seedless/components/MfaChoicePrompt.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");














const FATAL_ERRORS = [_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__.AuthErrorCode.NoMfaDetails, _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__.AuthErrorCode.UnknownError, _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__.AuthErrorCode.UnsupportedProvider, _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__.AuthErrorCode.MismatchingEmail, _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__.AuthErrorCode.MismatchingUserId, _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__.AuthErrorCode.MissingUserId, _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__.AuthErrorCode.FailedToFetchOidcToken, _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__.AuthErrorCode.NoMfaMethodsConfigured, _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_10__.AuthErrorCode.UnsupportedMfaMethod];
const SeedlessAuthPopup = () => {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_4__.useConnectionContext)();
  const {
    walletDetails
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_3__.useWalletContext)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_12__.useTranslation)();
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const onSignerTokenObtained = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (token, email, userId) => {
    setIsLoading(true);
    request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_2__.ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
      params: [token, email, userId]
    }).then(() => {
      window.close();
    }).finally(() => {
      setIsLoading(false);
    });
  }, [request]);
  const getOidcToken = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => walletDetails?.authProvider ? (0,_src_utils_seedless_getOidcTokenProvider__WEBPACK_IMPORTED_MODULE_5__.getOidcTokenProvider)(walletDetails?.authProvider) : () => Promise.reject(new Error('No auth provider')), [walletDetails]);
  const {
    authenticate,
    methods,
    chooseMfaMethod,
    verifyTotpCode,
    completeFidoChallenge,
    error,
    step,
    mfaDeviceName
  } = (0,_src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__.useSeedlessAuth)({
    setIsLoading,
    onSignerTokenObtained,
    getOidcToken
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Initiate authentication once we know what email address or userId to expect
    if ((walletDetails?.userEmail || walletDetails?.userId) && step === _src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__.AuthStep.NotInitialized) {
      authenticate({
        expectedEmail: walletDetails.userEmail,
        expectedUserId: walletDetails.userId
      });
    }
  }, [authenticate, walletDetails?.userEmail, step, walletDetails?.userId]);
  const isFatalError = error && FATAL_ERRORS.includes(error);
  return /*#__PURE__*/React.createElement(React.Fragment, null, methods.length > 1 && step === _src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__.AuthStep.ChooseMfaMethod && /*#__PURE__*/React.createElement(_src_components_common_seedless_components_MfaChoicePrompt__WEBPACK_IMPORTED_MODULE_11__.MfaChoicePrompt, {
    mfaChoice: {
      availableMethods: methods
    },
    onChosen: chooseMfaMethod
  }), !isFatalError && step === _src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__.AuthStep.TotpChallenge && /*#__PURE__*/React.createElement(_src_components_common_seedless_components_TOTPChallenge__WEBPACK_IMPORTED_MODULE_6__.TOTPChallenge, {
    error: error,
    isLoading: isLoading,
    onSubmit: verifyTotpCode
  }), !isFatalError && step === _src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__.AuthStep.FidoChallenge && /*#__PURE__*/React.createElement(_src_components_common_seedless_components_FIDOChallenge__WEBPACK_IMPORTED_MODULE_9__.FIDOChallenge, {
    error: error,
    isLoading: isLoading,
    deviceName: mfaDeviceName,
    completeFidoChallenge: completeFidoChallenge
  }), !isFatalError && step === _src_hooks_useSeedlessAuth__WEBPACK_IMPORTED_MODULE_1__.AuthStep.Initialized && /*#__PURE__*/React.createElement(_src_components_common_seedless_components_WaitingForAuthentication__WEBPACK_IMPORTED_MODULE_8__.WaitingForAuthentication, {
    provider: walletDetails?.authProvider
  }), isFatalError && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      height: 1,
      width: 1,
      px: 2,
      py: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_seedless_components_AuthenticationError__WEBPACK_IMPORTED_MODULE_7__.AuthenticationError, {
    error: error
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    color: "primary",
    size: "large",
    onClick: window.close,
    fullWidth: true
  }, t('Close'))));
};

/***/ }),

/***/ "./src/utils/seedless/getOidcTokenProvider.ts":
/*!****************************************************!*\
  !*** ./src/utils/seedless/getOidcTokenProvider.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getOidcTokenProvider": () => (/* binding */ getOidcTokenProvider)
/* harmony export */ });
/* harmony import */ var _src_background_services_wallet_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/wallet/models */ "./src/background/services/wallet/models.ts");
/* harmony import */ var _authenticateWithGoogle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./authenticateWithGoogle */ "./src/utils/seedless/authenticateWithGoogle.ts");
/* harmony import */ var _authenticateWithApple__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./authenticateWithApple */ "./src/utils/seedless/authenticateWithApple.ts");



const SUPPORTED_PROVIDERS = {
  [_src_background_services_wallet_models__WEBPACK_IMPORTED_MODULE_0__.SeedlessAuthProvider.Google]: _authenticateWithGoogle__WEBPACK_IMPORTED_MODULE_1__.authenticateWithGoogle,
  [_src_background_services_wallet_models__WEBPACK_IMPORTED_MODULE_0__.SeedlessAuthProvider.Apple]: _authenticateWithApple__WEBPACK_IMPORTED_MODULE_2__.authenticateWithApple
};
const getOidcTokenProvider = authProvider => {
  if (!authProvider || !SUPPORTED_PROVIDERS[authProvider]) {
    throw new Error(`Unsupported provider: ${authProvider || 'unknown'}`);
  }
  return SUPPORTED_PROVIDERS[authProvider];
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1NlZWRsZXNzUG9wdXBzX1NlZWRsZXNzQXV0aFBvcHVwX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBK0M7QUFLVjtBQUNvQztBQU1sRSxNQUFNSyxtQkFBbUIsR0FBR0EsQ0FBQztFQUFFQztBQUFhLENBQUMsS0FBSztFQUN2RCxNQUFNO0lBQUVDO0VBQUUsQ0FBQyxHQUFHUCw2REFBYyxFQUFFO0VBRTlCLG9CQUNFUSxLQUFBLENBQUFDLGFBQUEsQ0FBQ1AsOERBQUs7SUFDSlEsRUFBRSxFQUFFO01BQ0ZDLEtBQUssRUFBRSxDQUFDO01BQ1JDLEVBQUUsRUFBRSxDQUFDO01BQ0xDLGNBQWMsRUFBRSxRQUFRO01BQ3hCQyxTQUFTLEVBQUUsUUFBUTtNQUNuQkMsVUFBVSxFQUFFLFFBQVE7TUFDcEJDLEdBQUcsRUFBRTtJQUNQO0VBQUUsZ0JBRUZSLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUix3RUFBZTtJQUFDZ0IsSUFBSSxFQUFFLEVBQUc7SUFBQ0MsS0FBSyxFQUFDO0VBQWEsRUFBRyxFQUNoRFosS0FBSyxLQUFLRixvR0FBOEIsZ0JBQ3ZDSSxLQUFBLENBQUFDLGFBQUEsQ0FBQUQsS0FBQSxDQUFBWSxRQUFBLHFCQUNFWixLQUFBLENBQUFDLGFBQUEsQ0FBQ04sbUVBQVU7SUFBQ2tCLE9BQU8sRUFBQztFQUFJLEdBQUVkLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFjLGVBQ2pFQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ04sbUVBQVU7SUFBQ2tCLE9BQU8sRUFBQyxPQUFPO0lBQUNILEtBQUssRUFBQztFQUFnQixHQUMvQ1gsQ0FBQyxDQUNBLDZFQUE2RSxDQUM5RSxDQUNVLENBQ1osZ0JBRUhDLEtBQUEsQ0FBQUMsYUFBQSxDQUFBRCxLQUFBLENBQUFZLFFBQUEscUJBQ0VaLEtBQUEsQ0FBQUMsYUFBQSxDQUFDTixtRUFBVTtJQUFDa0IsT0FBTyxFQUFDO0VBQUksR0FDckJkLENBQUMsQ0FBQyw4Q0FBOEMs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QUFLLEVBQUVBO0VBQU0sRUFBRyxDQUMvQixlQUNSRSxLQUFBLENBQUFDLGFBQUEsQ0FBQ3dCLGdFQUFNO0lBQUNmLEtBQUssRUFBQyxTQUFTO0lBQUNELElBQUksRUFBQyxPQUFPO0lBQUNzRixPQUFPLEVBQUVsQyxNQUFNLENBQUNDLEtBQU07SUFBQ2tDLFNBQVM7RUFBQSxHQUNsRWpHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDSixDQUVaLENBQ0E7QUFFUCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdJNkU7QUFDWjtBQUNGO0FBSWhFLE1BQU1xRyxtQkFBa0UsR0FBRztFQUN6RSxDQUFDSCwrRkFBMkIsR0FBR0MsMkVBQXNCO0VBQ3JELENBQUNELDhGQUEwQixHQUFHRSx5RUFBcUJBO0FBQ3JELENBQUM7QUFFTSxNQUFNaEUsb0JBQW9CLEdBQy9COEIsWUFBbUMsSUFDUDtFQUM1QixJQUFJLENBQUNBLFlBQVksSUFBSSxDQUFDbUMsbUJBQW1CLENBQUNuQyxZQUFZLENBQUMsRUFBRTtJQUN2RCxNQUFNLElBQUlHLEtBQUssQ0FBRSx5QkFBd0JILFlBQVksSUFBSSxTQUFVLEVBQUMsQ0FBQztFQUN2RTtFQUVBLE9BQU9tQyxtQkFBbUIsQ0FBQ25DLFlBQVksQ0FBQztBQUMxQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zZWVkbGVzcy9jb21wb25lbnRzL0F1dGhlbnRpY2F0aW9uRXJyb3IudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2VlZGxlc3MvY29tcG9uZW50cy9XYWl0aW5nRm9yQXV0aGVudGljYXRpb24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2VlZGxlc3NQb3B1cHMvU2VlZGxlc3NBdXRoUG9wdXAudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvc2VlZGxlc3MvZ2V0T2lkY1Rva2VuUHJvdmlkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEFsZXJ0Q2lyY2xlSWNvbixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBBdXRoRXJyb3JDb2RlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3NlZWRsZXNzL21vZGVscyc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIGVycm9yOiBBdXRoRXJyb3JDb2RlO1xufTtcblxuZXhwb3J0IGNvbnN0IEF1dGhlbnRpY2F0aW9uRXJyb3IgPSAoeyBlcnJvciB9OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAxLFxuICAgICAgICBweDogNSxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgZ2FwOiAxLjUsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxBbGVydENpcmNsZUljb24gc2l6ZT17NDh9IGNvbG9yPVwiZXJyb3IubGlnaHRcIiAvPlxuICAgICAge2Vycm9yID09PSBBdXRoRXJyb3JDb2RlLk1pc21hdGNoaW5nRW1haWwgPyAoXG4gICAgICAgIDw+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+e3QoJ1dyb25nIGVtYWlsIGFkZHJlc3MuJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAnUGxlYXNlIGxvZyBpbiB3aXRoIHRoZSBlbWFpbCBhZGRyZXNzIHlvdSB1c2VkIHdoZW4geW91IGNyZWF0ZWQgeW91ciB3YWxsZXQuJyxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8Lz5cbiAgICAgICkgOiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+XG4gICAgICAgICAgICB7dCgnU29ycnksIHdlIGFyZSBoYXZpbmcgdHJvdWJsZSBsb2dnaW5nIHlvdSBpbi4nKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiPlxuICAgICAgICAgICAge3QoJ1BsZWFzZSB2ZXJpZnkgeW91ciBuZXR3b3JrIGNvbm5lY3Rpb24gb3IgdHJ5IGFnYWluIGxhdGVyLicpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBDaXJjdWxhclByb2dyZXNzLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgU2VlZGxlc3NBdXRoUHJvdmlkZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L21vZGVscyc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIHByb3ZpZGVyPzogU2VlZGxlc3NBdXRoUHJvdmlkZXI7XG59O1xuXG5leHBvcnQgY29uc3QgV2FpdGluZ0ZvckF1dGhlbnRpY2F0aW9uID0gKHsgcHJvdmlkZXIgfTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgcHg6IDUsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGdhcDogMS41LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXs0OH0gc3g9e3sgbWI6IDMgfX0gLz5cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiPlxuICAgICAgICA8VHJhbnNcbiAgICAgICAgICBpMThuS2V5PVwiV2FpdGluZyBmb3IgPGJvbGQ+e3twcm92aWRlcn19PC9ib2xkPiBhdXRoZW50aWNhdGlvbiB0byBjb21wbGV0ZVwiXG4gICAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgICAgYm9sZDogPGIgc3R5bGU9e3sgdGV4dFRyYW5zZm9ybTogJ2NhcGl0YWxpemUnIH19IC8+LFxuICAgICAgICAgIH19XG4gICAgICAgICAgdmFsdWVzPXt7IHByb3ZpZGVyIH19XG4gICAgICAgIC8+XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgIHt0KFxuICAgICAgICAgICdEbyBub3QgY2xvc2UgdGhpcyB3aW5kb3cgdW50aWwgdGhlIHByb2Nlc3MgaXMgY29tcGxldGUgb3IgeW91IG1heSBuZWVkIHRvIHJlc3RhcnQuJyxcbiAgICAgICAgKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBCdXR0b24sIFN0YWNrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFNpZ25lclNlc3Npb25EYXRhIH0gZnJvbSAnQGN1YmlzdC1sYWJzL2N1YmVzaWduZXItc2RrJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBBdXRoU3RlcCwgdXNlU2VlZGxlc3NBdXRoIH0gZnJvbSAnQHNyYy9ob29rcy91c2VTZWVkbGVzc0F1dGgnO1xuaW1wb3J0IHsgRXh0ZW5zaW9uUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9leHRlbnNpb25Db25uZWN0aW9uL21vZGVscyc7XG5pbXBvcnQgeyBVcGRhdGVTaWduZXJUb2tlbkhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VlZGxlc3MvaGFuZGxlcnMvdXBkYXRlU2lnbmVyVG9rZW4nO1xuaW1wb3J0IHsgdXNlV2FsbGV0Q29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvV2FsbGV0UHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyBnZXRPaWRjVG9rZW5Qcm92aWRlciB9IGZyb20gJ0BzcmMvdXRpbHMvc2VlZGxlc3MvZ2V0T2lkY1Rva2VuUHJvdmlkZXInO1xuXG5pbXBvcnQgeyBUT1RQQ2hhbGxlbmdlIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9zZWVkbGVzcy9jb21wb25lbnRzL1RPVFBDaGFsbGVuZ2UnO1xuaW1wb3J0IHsgQXV0aGVudGljYXRpb25FcnJvciB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vc2VlZGxlc3MvY29tcG9uZW50cy9BdXRoZW50aWNhdGlvbkVycm9yJztcbmltcG9ydCB7IFdhaXRpbmdGb3JBdXRoZW50aWNhdGlvbiB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vc2VlZGxlc3MvY29tcG9uZW50cy9XYWl0aW5nRm9yQXV0aGVudGljYXRpb24nO1xuaW1wb3J0IHsgRklET0NoYWxsZW5nZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vc2VlZGxlc3MvY29tcG9uZW50cy9GSURPQ2hhbGxlbmdlJztcbmltcG9ydCB7IEF1dGhFcnJvckNvZGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VlZGxlc3MvbW9kZWxzJztcbmltcG9ydCB7IE1mYUNob2ljZVByb21wdCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vc2VlZGxlc3MvY29tcG9uZW50cy9NZmFDaG9pY2VQcm9tcHQnO1xuXG5jb25zdCBGQVRBTF9FUlJPUlMgPSBbXG4gIEF1dGhFcnJvckNvZGUuTm9NZmFEZXRhaWxzLFxuICBBdXRoRXJyb3JDb2RlLlVua25vd25FcnJvcixcbiAgQXV0aEVycm9yQ29kZS5VbnN1cHBvcnRlZFByb3ZpZGVyLFxuICBBdXRoRXJyb3JDb2RlLk1pc21hdGNoaW5nRW1haWwsXG4gIEF1dGhFcnJvckNvZGUuTWlzbWF0Y2hpbmdVc2VySWQsXG4gIEF1dGhFcnJvckNvZGUuTWlzc2luZ1VzZXJJZCxcbiAgQXV0aEVycm9yQ29kZS5GYWlsZWRUb0ZldGNoT2lkY1Rva2VuLFxuICBBdXRoRXJyb3JDb2RlLk5vTWZhTWV0aG9kc0NvbmZpZ3VyZWQsXG4gIEF1dGhFcnJvckNvZGUuVW5zdXBwb3J0ZWRNZmFNZXRob2QsXG5dO1xuXG5leHBvcnQgY29uc3QgU2VlZGxlc3NBdXRoUG9wdXAgPSAoKSA9PiB7XG4gIGNvbnN0IHsgcmVxdWVzdCB9ID0gdXNlQ29ubmVjdGlvbkNvbnRleHQoKTtcbiAgY29uc3QgeyB3YWxsZXREZXRhaWxzIH0gPSB1c2VXYWxsZXRDb250ZXh0KCk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IG9uU2lnbmVyVG9rZW5PYnRhaW5lZCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh0b2tlbjogU2lnbmVyU2Vzc2lvbkRhdGEsIGVtYWlsOiBzdHJpbmcsIHVzZXJJZDogc3RyaW5nKSA9PiB7XG4gICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG5cbiAgICAgIHJlcXVlc3Q8VXBkYXRlU2lnbmVyVG9rZW5IYW5kbGVyPih7XG4gICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5TRUVETEVTU19VUERBVEVfU0lHTkVSX1RPS0VOLFxuICAgICAgICBwYXJhbXM6IFt0b2tlbiwgZW1haWwsIHVzZXJJZF0sXG4gICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFtyZXF1ZXN0XSxcbiAgKTtcblxuICBjb25zdCBnZXRPaWRjVG9rZW4gPSB1c2VNZW1vKFxuICAgICgpID0+XG4gICAgICB3YWxsZXREZXRhaWxzPy5hdXRoUHJvdmlkZXJcbiAgICAgICAgPyBnZXRPaWRjVG9rZW5Qcm92aWRlcih3YWxsZXREZXRhaWxzPy5hdXRoUHJvdmlkZXIpXG4gICAgICAgIDogKCkgPT4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdObyBhdXRoIHByb3ZpZGVyJykpLFxuICAgIFt3YWxsZXREZXRhaWxzXSxcbiAgKTtcblxuICBjb25zdCB7XG4gICAgYXV0aGVudGljYXRlLFxuICAgIG1ldGhvZHMsXG4gICAgY2hvb3NlTWZhTWV0aG9kLFxuICAgIHZlcmlmeVRvdHBDb2RlLFxuICAgIGNvbXBsZXRlRmlkb0NoYWxsZW5nZSxcbiAgICBlcnJvcixcbiAgICBzdGVwLFxuICAgIG1mYURldmljZU5hbWUsXG4gIH0gPSB1c2VTZWVkbGVzc0F1dGgoe1xuICAgIHNldElzTG9hZGluZyxcbiAgICBvblNpZ25lclRva2VuT2J0YWluZWQsXG4gICAgZ2V0T2lkY1Rva2VuLFxuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIEluaXRpYXRlIGF1dGhlbnRpY2F0aW9uIG9uY2Ugd2Uga25vdyB3aGF0IGVtYWlsIGFkZHJlc3Mgb3IgdXNlcklkIHRvIGV4cGVjdFxuICAgIGlmIChcbiAgICAgICh3YWxsZXREZXRhaWxzPy51c2VyRW1haWwgfHwgd2FsbGV0RGV0YWlscz8udXNlcklkKSAmJlxuICAgICAgc3RlcCA9PT0gQXV0aFN0ZXAuTm90SW5pdGlhbGl6ZWRcbiAgICApIHtcbiAgICAgIGF1dGhlbnRpY2F0ZSh7XG4gICAgICAgIGV4cGVjdGVkRW1haWw6IHdhbGxldERldGFpbHMudXNlckVtYWlsLFxuICAgICAgICBleHBlY3RlZFVzZXJJZDogd2FsbGV0RGV0YWlscy51c2VySWQsXG4gICAgICB9KTtcbiAgICB9XG4gIH0sIFthdXRoZW50aWNhdGUsIHdhbGxldERldGFpbHM/LnVzZXJFbWFpbCwgc3RlcCwgd2FsbGV0RGV0YWlscz8udXNlcklkXSk7XG5cbiAgY29uc3QgaXNGYXRhbEVycm9yID0gZXJyb3IgJiYgRkFUQUxfRVJST1JTLmluY2x1ZGVzKGVycm9yKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7bWV0aG9kcy5sZW5ndGggPiAxICYmIHN0ZXAgPT09IEF1dGhTdGVwLkNob29zZU1mYU1ldGhvZCAmJiAoXG4gICAgICAgIDxNZmFDaG9pY2VQcm9tcHRcbiAgICAgICAgICBtZmFDaG9pY2U9e3sgYXZhaWxhYmxlTWV0aG9kczogbWV0aG9kcyB9fVxuICAgICAgICAgIG9uQ2hvc2VuPXtjaG9vc2VNZmFNZXRob2R9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAgeyFpc0ZhdGFsRXJyb3IgJiYgc3RlcCA9PT0gQXV0aFN0ZXAuVG90cENoYWxsZW5nZSAmJiAoXG4gICAgICAgIDxUT1RQQ2hhbGxlbmdlXG4gICAgICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICAgIG9uU3VibWl0PXt2ZXJpZnlUb3RwQ29kZX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7IWlzRmF0YWxFcnJvciAmJiBzdGVwID09PSBBdXRoU3RlcC5GaWRvQ2hhbGxlbmdlICYmIChcbiAgICAgICAgPEZJRE9DaGFsbGVuZ2VcbiAgICAgICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmd9XG4gICAgICAgICAgZGV2aWNlTmFtZT17bWZhRGV2aWNlTmFtZX1cbiAgICAgICAgICBjb21wbGV0ZUZpZG9DaGFsbGVuZ2U9e2NvbXBsZXRlRmlkb0NoYWxsZW5nZX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7IWlzRmF0YWxFcnJvciAmJiBzdGVwID09PSBBdXRoU3RlcC5Jbml0aWFsaXplZCAmJiAoXG4gICAgICAgIDxXYWl0aW5nRm9yQXV0aGVudGljYXRpb24gcHJvdmlkZXI9e3dhbGxldERldGFpbHM/LmF1dGhQcm92aWRlcn0gLz5cbiAgICAgICl9XG4gICAgICB7aXNGYXRhbEVycm9yICYmIChcbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgICBweTogMixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17eyBmbGV4R3JvdzogMSwganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxBdXRoZW50aWNhdGlvbkVycm9yIGVycm9yPXtlcnJvcn0gLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxCdXR0b24gY29sb3I9XCJwcmltYXJ5XCIgc2l6ZT1cImxhcmdlXCIgb25DbGljaz17d2luZG93LmNsb3NlfSBmdWxsV2lkdGg+XG4gICAgICAgICAgICB7dCgnQ2xvc2UnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgU2VlZGxlc3NBdXRoUHJvdmlkZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L21vZGVscyc7XG5pbXBvcnQgeyBhdXRoZW50aWNhdGVXaXRoR29vZ2xlIH0gZnJvbSAnLi9hdXRoZW50aWNhdGVXaXRoR29vZ2xlJztcbmltcG9ydCB7IGF1dGhlbnRpY2F0ZVdpdGhBcHBsZSB9IGZyb20gJy4vYXV0aGVudGljYXRlV2l0aEFwcGxlJztcblxuZXhwb3J0IHR5cGUgT2lkY1Rva2VuR2V0dGVyID0gKCkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuXG5jb25zdCBTVVBQT1JURURfUFJPVklERVJTOiBSZWNvcmQ8U2VlZGxlc3NBdXRoUHJvdmlkZXIsIE9pZGNUb2tlbkdldHRlcj4gPSB7XG4gIFtTZWVkbGVzc0F1dGhQcm92aWRlci5Hb29nbGVdOiBhdXRoZW50aWNhdGVXaXRoR29vZ2xlLFxuICBbU2VlZGxlc3NBdXRoUHJvdmlkZXIuQXBwbGVdOiBhdXRoZW50aWNhdGVXaXRoQXBwbGUsXG59O1xuXG5leHBvcnQgY29uc3QgZ2V0T2lkY1Rva2VuUHJvdmlkZXIgPSAoXG4gIGF1dGhQcm92aWRlcj86IFNlZWRsZXNzQXV0aFByb3ZpZGVyLFxuKTogT2lkY1Rva2VuR2V0dGVyIHwgbmV2ZXIgPT4ge1xuICBpZiAoIWF1dGhQcm92aWRlciB8fCAhU1VQUE9SVEVEX1BST1ZJREVSU1thdXRoUHJvdmlkZXJdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBwcm92aWRlcjogJHthdXRoUHJvdmlkZXIgfHwgJ3Vua25vd24nfWApO1xuICB9XG5cbiAgcmV0dXJuIFNVUFBPUlRFRF9QUk9WSURFUlNbYXV0aFByb3ZpZGVyXTtcbn07XG4iXSwibmFtZXMiOlsidXNlVHJhbnNsYXRpb24iLCJBbGVydENpcmNsZUljb24iLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJBdXRoRXJyb3JDb2RlIiwiQXV0aGVudGljYXRpb25FcnJvciIsImVycm9yIiwidCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJweCIsImp1c3RpZnlDb250ZW50IiwidGV4dEFsaWduIiwiYWxpZ25JdGVtcyIsImdhcCIsInNpemUiLCJjb2xvciIsIk1pc21hdGNoaW5nRW1haWwiLCJGcmFnbWVudCIsInZhcmlhbnQiLCJUcmFucyIsIkNpcmN1bGFyUHJvZ3Jlc3MiLCJXYWl0aW5nRm9yQXV0aGVudGljYXRpb24iLCJwcm92aWRlciIsIm1iIiwiaTE4bktleSIsImNvbXBvbmVudHMiLCJib2xkIiwic3R5bGUiLCJ0ZXh0VHJhbnNmb3JtIiwidmFsdWVzIiwiQnV0dG9uIiwidXNlQ2FsbGJhY2siLCJ1c2VFZmZlY3QiLCJ1c2VNZW1vIiwidXNlU3RhdGUiLCJBdXRoU3RlcCIsInVzZVNlZWRsZXNzQXV0aCIsIkV4dGVuc2lvblJlcXVlc3QiLCJ1c2VXYWxsZXRDb250ZXh0IiwidXNlQ29ubmVjdGlvbkNvbnRleHQiLCJnZXRPaWRjVG9rZW5Qcm92aWRlciIsIlRPVFBDaGFsbGVuZ2UiLCJGSURPQ2hhbGxlbmdlIiwiTWZhQ2hvaWNlUHJvbXB0IiwiRkFUQUxfRVJST1JTIiwiTm9NZmFEZXRhaWxzIiwiVW5rbm93bkVycm9yIiwiVW5zdXBwb3J0ZWRQcm92aWRlciIsIk1pc21hdGNoaW5nVXNlcklkIiwiTWlzc2luZ1VzZXJJZCIsIkZhaWxlZFRvRmV0Y2hPaWRjVG9rZW4iLCJOb01mYU1ldGhvZHNDb25maWd1cmVkIiwiVW5zdXBwb3J0ZWRNZmFNZXRob2QiLCJTZWVkbGVzc0F1dGhQb3B1cCIsInJlcXVlc3QiLCJ3YWxsZXREZXRhaWxzIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwib25TaWduZXJUb2tlbk9idGFpbmVkIiwidG9rZW4iLCJlbWFpbCIsInVzZXJJZCIsIm1ldGhvZCIsIlNFRURMRVNTX1VQREFURV9TSUdORVJfVE9LRU4iLCJwYXJhbXMiLCJ0aGVuIiwid2luZG93IiwiY2xvc2UiLCJmaW5hbGx5IiwiZ2V0T2lkY1Rva2VuIiwiYXV0aFByb3ZpZGVyIiwiUHJvbWlzZSIsInJlamVjdCIsIkVycm9yIiwiYXV0aGVudGljYXRlIiwibWV0aG9kcyIsImNob29zZU1mYU1ldGhvZCIsInZlcmlmeVRvdHBDb2RlIiwiY29tcGxldGVGaWRvQ2hhbGxlbmdlIiwic3RlcCIsIm1mYURldmljZU5hbWUiLCJ1c2VyRW1haWwiLCJOb3RJbml0aWFsaXplZCIsImV4cGVjdGVkRW1haWwiLCJleHBlY3RlZFVzZXJJZCIsImlzRmF0YWxFcnJvciIsImluY2x1ZGVzIiwibGVuZ3RoIiwiQ2hvb3NlTWZhTWV0aG9kIiwibWZhQ2hvaWNlIiwiYXZhaWxhYmxlTWV0aG9kcyIsIm9uQ2hvc2VuIiwiVG90cENoYWxsZW5nZSIsIm9uU3VibWl0IiwiRmlkb0NoYWxsZW5nZSIsImRldmljZU5hbWUiLCJJbml0aWFsaXplZCIsImhlaWdodCIsInB5IiwiZmxleEdyb3ciLCJvbkNsaWNrIiwiZnVsbFdpZHRoIiwiU2VlZGxlc3NBdXRoUHJvdmlkZXIiLCJhdXRoZW50aWNhdGVXaXRoR29vZ2xlIiwiYXV0aGVudGljYXRlV2l0aEFwcGxlIiwiU1VQUE9SVEVEX1BST1ZJREVSUyIsIkdvb2dsZSIsIkFwcGxlIl0sInNvdXJjZVJvb3QiOiIifQ==