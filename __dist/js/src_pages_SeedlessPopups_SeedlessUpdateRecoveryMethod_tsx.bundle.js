"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_SeedlessPopups_SeedlessUpdateRecoveryMethod_tsx"],{

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

/***/ "./src/hooks/useQueryParams.ts":
/*!*************************************!*\
  !*** ./src/hooks/useQueryParams.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useQueryParams": () => (/* binding */ useQueryParams)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");


const useQueryParams = () => {
  const {
    search
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => new URLSearchParams(search), [search]);
};

/***/ }),

/***/ "./src/pages/SeedlessPopups/SeedlessUpdateRecoveryMethod.tsx":
/*!*******************************************************************!*\
  !*** ./src/pages/SeedlessPopups/SeedlessUpdateRecoveryMethod.tsx ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SeedlessUpdateRecoveryMethod": () => (/* binding */ SeedlessUpdateRecoveryMethod)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_hooks_useSeedlessMfa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useSeedlessMfa */ "./src/hooks/useSeedlessMfa.tsx");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");
/* harmony import */ var _src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useKeyboardShortcuts */ "./src/hooks/useKeyboardShortcuts.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/utils/seedless/fido/types */ "./src/utils/seedless/fido/types.ts");
/* harmony import */ var _src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/hooks/useQueryParams */ "./src/hooks/useQueryParams.ts");
/* harmony import */ var _src_components_settings_pages_RecoveryMethods_AuthenticatorDetails__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/components/settings/pages/RecoveryMethods/AuthenticatorDetails */ "./src/components/settings/pages/RecoveryMethods/AuthenticatorDetails.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");














var State = /*#__PURE__*/function (State) {
  State["Loading"] = "loading";
  State["IncompatibleWallet"] = "incompatible-wallet";
  State["NameYourDevice"] = "name-your-device";
  State["AddAuthenticator"] = "add-authenticator";
  State["Success"] = "success";
  State["Failure"] = "failure";
  return State;
}(State || {});
const SeedlessUpdateRecoveryMethod = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_12__.useTranslation)();
  const params = (0,_src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_10__.useQueryParams)();
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_7__.useConnectionContext)();
  const {
    walletDetails
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_4__.useWalletContext)();
  const {
    renderMfaPrompt
  } = (0,_src_hooks_useSeedlessMfa__WEBPACK_IMPORTED_MODULE_2__.useSeedlessMfa)();
  const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(State.Loading);
  const [name, setName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const keyType = params.get('keyType');
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (walletDetails?.type !== _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_5__.SecretType.Seedless) {
      setState(State.IncompatibleWallet);
      return;
    }
    if (keyType) {
      setState(State.NameYourDevice);
    } else {
      setState(State.AddAuthenticator);
    }
  }, [keyType, walletDetails?.type]);
  const addFidoDevice = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async () => {
    try {
      if (!keyType) {
        return;
      }
      setState(State.Loading);
      await request({
        method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_8__.ExtensionRequest.SEEDLESS_ADD_FIDO_DEVICE,
        params: [name, keyType]
      });
      setState(State.Success);
    } catch (_err) {
      setState(State.Failure);
    }
  }, [request, keyType, name]);
  const keyboardHandlers = (0,_src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_6__.useKeyboardShortcuts)({
    Enter: addFidoDevice
  });
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: 375,
      height: 600,
      px: 2,
      backgroundColor: 'background.paper',
      alignSelf: 'center',
      borderRadius: 1,
      pb: 3
    }
  }, state === State.Failure && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: 1,
      height: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      px: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.AlertCircleIcon, {
    size: 72
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      textAlign: 'center',
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "h5",
    sx: {
      mb: 2
    }
  }, t('Something Went Wrong')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "body2"
  }, t('We encountered an unexpected issue.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "body2"
  }, t('Please try again.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    fullWidth: true,
    sx: {
      mt: 4
    },
    onClick: addFidoDevice,
    "data-testid": "btn-try-again"
  }, t('Try again')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    fullWidth: true,
    variant: "text",
    onClick: window.close,
    "data-testid": "btn-close"
  }, t('Close'))), state === State.Success && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: 1,
      height: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      px: 2,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.CheckCircleIcon, {
    size: 72,
    sx: {
      color: 'success.main'
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "h5"
  }, t('Success!')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "body2"
  }, t('You can now use your new {{methodName}} to verify requests.', {
    methodName: keyType === _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Yubikey ? t('Yubikey') : keyType === _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Passkey ? t('Passkey') : t('Authenticator app')
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    fullWidth: true,
    onClick: window.close,
    "data-testid": "btn-close",
    sx: {
      mt: 3
    }
  }, t('Close'))), state === State.IncompatibleWallet && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: 1,
      height: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.AlertCircleIcon, {
    size: 72
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "h5"
  }, t('Incompatible Wallet')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "body2"
  }, t('This action is only allowed for Seedless wallets.'))), state === State.Loading && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__.PageTitle, {
    showBackButton: false,
    variant: _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__.PageTitleVariant.PRIMARY,
    margin: "0 0 0 -16px"
  }, keyType === _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Yubikey ? t('Yubikey Setup') : keyType === _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Passkey ? t('Passkey Setup') : t('Authenticator Setup')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.CircularProgress, {
    size: 72
  })), renderMfaPrompt()), keyType && state === State.NameYourDevice && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__.PageTitle, {
    showBackButton: false,
    variant: _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__.PageTitleVariant.PRIMARY,
    margin: "0 0 0 -16px"
  }, keyType === _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Yubikey ? t('Name Your Yubikey') : t('Name Your Passkey')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.TextField, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    size: "large",
    autoFocus: true,
    "data-testid": "fido-device-name",
    fullWidth: true,
    label: keyType === _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Yubikey ? t('Yubikey Name') : t('Passkey Name'),
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: 'body2.fontSize',
        mb: 1,
        mt: 4
      }
    },
    helperText: t('Add a {{device}} name, so that it’s easier to find later.', {
      device: keyType === _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Yubikey ? t('Yubikey') : t('Passkey')
    }),
    placeholder: keyType === _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_9__.KeyType.Yubikey ? t('My Yubikey') : t('My Passkey'),
    value: name,
    onChange: ev => setName(ev.target.value)
  }, keyboardHandlers))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    fullWidth: true,
    size: "large",
    onClick: addFidoDevice,
    disabled: !name
  }, t('Save'))), !keyType && state === State.AddAuthenticator && /*#__PURE__*/React.createElement(_src_components_settings_pages_RecoveryMethods_AuthenticatorDetails__WEBPACK_IMPORTED_MODULE_11__.AuthenticatorDetails, {
    autoInitialize: true,
    onUpdated: () => setState(State.Success),
    onBackClick: window.close
  }));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1NlZWRsZXNzUG9wdXBzX1NlZWRsZXNzVXBkYXRlUmVjb3ZlcnlNZXRob2RfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUEwRDtBQU1uRCxNQUFNQyxvQkFBb0IsR0FBSUMsU0FBNEIsSUFBSztFQUNwRSxNQUFNQyxTQUErQixHQUFHSCxrREFBVyxDQUNqRCxNQUFPSSxLQUFLLElBQUs7SUFDZixNQUFNQyxRQUFRLEdBQUdILFNBQVMsQ0FBQ0UsS0FBSyxDQUFDRSxHQUFHLENBQUM7SUFFckMsSUFBSSxPQUFPRCxRQUFRLEtBQUssVUFBVSxFQUFFO01BQ2xDRCxLQUFLLENBQUNHLGNBQWMsRUFBRTtNQUN0QixNQUFNRixRQUFRLEVBQUU7SUFDbEI7RUFDRixDQUFDLEVBQ0QsQ0FBQ0gsU0FBUyxDQUFDLENBQ1o7RUFFRCxPQUFPO0lBQ0xDO0VBQ0YsQ0FBQztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0QitCO0FBQ2U7QUFFeEMsTUFBTU8sY0FBYyxHQUFHQSxDQUFBLEtBQU07RUFDbEMsTUFBTTtJQUFFQztFQUFPLENBQUMsR0FBR0YsNkRBQVcsRUFBRTtFQUVoQyxPQUFPRCw4Q0FBTyxDQUFDLE1BQU0sSUFBSUksZUFBZSxDQUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDQSxNQUFNLENBQUMsQ0FBQztBQUM3RCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQd0Q7QUFDVjtBQVNWO0FBRXNCO0FBQ29CO0FBQ2Y7QUFDSztBQUNFO0FBQ0M7QUFFa0I7QUFDakM7QUFDRTtBQUNnRDtBQUFBLElBRXRHcUIsS0FBSywwQkFBTEEsS0FBSztFQUFMQSxLQUFLO0VBQUxBLEtBQUs7RUFBTEEsS0FBSztFQUFMQSxLQUFLO0VBQUxBLEtBQUs7RUFBTEEsS0FBSztFQUFBLE9BQUxBLEtBQUs7QUFBQSxFQUFMQSxLQUFLO0FBU0gsTUFBTUMsNEJBQTRCLEdBQUdBLENBQUEsS0FBTTtFQUNoRCxNQUFNO0lB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O0lBQ0wyRCxTQUFTO0lBQ1RKLElBQUksRUFBQyxPQUFPO0lBQ1pNLE9BQU8sRUFBRTNCLGFBQWM7SUFDdkJvRCxRQUFRLEVBQUUsQ0FBQzdEO0VBQUssR0FFZlIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUNILENBRVosRUFDQSxDQUFDVSxPQUFPLElBQUlMLEtBQUssS0FBS1AsS0FBSyxDQUFDa0IsZ0JBQWdCLGlCQUMzQ1MsS0FBQSxDQUFBQyxhQUFBLENBQUM3QixzSEFBb0I7SUFDbkJ5RSxjQUFjO0lBQ2RDLFNBQVMsRUFBRUEsQ0FBQSxLQUFNakUsUUFBUSxDQUFDUixLQUFLLENBQUNzQixPQUFPLENBQUU7SUFDekNvRCxXQUFXLEVBQUUzQixNQUFNLENBQUNDO0VBQU0sRUFFN0IsQ0FDSztBQUVaLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUtleWJvYXJkU2hvcnRjdXRzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlUXVlcnlQYXJhbXMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZWVkbGVzc1BvcHVwcy9TZWVkbGVzc1VwZGF0ZVJlY292ZXJ5TWV0aG9kLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLZXlib2FyZEV2ZW50SGFuZGxlciwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5cbnR5cGUgQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xudHlwZSBLZXlOYW1lcyA9ICdFbnRlcicgfCAnRXNjYXBlJztcbnR5cGUgS2V5Ym9hcmRTaG9ydGN1dHMgPSBQYXJ0aWFsPFJlY29yZDxLZXlOYW1lcywgQ2FsbGJhY2s+PjtcblxuZXhwb3J0IGNvbnN0IHVzZUtleWJvYXJkU2hvcnRjdXRzID0gKHNob3J0Y3V0czogS2V5Ym9hcmRTaG9ydGN1dHMpID0+IHtcbiAgY29uc3Qgb25LZXlEb3duOiBLZXlib2FyZEV2ZW50SGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBzaG9ydGN1dHNbZXZlbnQua2V5XTtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3Nob3J0Y3V0c10sXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBvbktleURvd24sXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5cbmV4cG9ydCBjb25zdCB1c2VRdWVyeVBhcmFtcyA9ICgpID0+IHtcbiAgY29uc3QgeyBzZWFyY2ggfSA9IHVzZUxvY2F0aW9uKCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4gbmV3IFVSTFNlYXJjaFBhcmFtcyhzZWFyY2gpLCBbc2VhcmNoXSk7XG59O1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQWxlcnRDaXJjbGVJY29uLFxuICBCdXR0b24sXG4gIENoZWNrQ2lyY2xlSWNvbixcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgdXNlU2VlZGxlc3NNZmEgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVNlZWRsZXNzTWZhJztcbmltcG9ydCB7IFBhZ2VUaXRsZSwgUGFnZVRpdGxlVmFyaWFudCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vUGFnZVRpdGxlJztcbmltcG9ydCB7IHVzZVdhbGxldENvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1dhbGxldFByb3ZpZGVyJztcbmltcG9ydCB7IFNlY3JldFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VjcmV0cy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlS2V5Ym9hcmRTaG9ydGN1dHMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUtleWJvYXJkU2hvcnRjdXRzJztcbmltcG9ydCB7IHVzZUNvbm5lY3Rpb25Db250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db25uZWN0aW9uUHJvdmlkZXInO1xuaW1wb3J0IHsgQWRkRmlkb0RldmljZUhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VlZGxlc3MvaGFuZGxlcnMvYWRkRmlkb0RldmljZSc7XG5pbXBvcnQgeyBFeHRlbnNpb25SZXF1ZXN0IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL2Nvbm5lY3Rpb25zL2V4dGVuc2lvbkNvbm5lY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7IEtleVR5cGUgfSBmcm9tICdAc3JjL3V0aWxzL3NlZWRsZXNzL2ZpZG8vdHlwZXMnO1xuaW1wb3J0IHsgdXNlUXVlcnlQYXJhbXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVF1ZXJ5UGFyYW1zJztcbmltcG9ydCB7IEF1dGhlbnRpY2F0b3JEZXRhaWxzIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL3NldHRpbmdzL3BhZ2VzL1JlY292ZXJ5TWV0aG9kcy9BdXRoZW50aWNhdG9yRGV0YWlscyc7XG5cbmVudW0gU3RhdGUge1xuICBMb2FkaW5nID0gJ2xvYWRpbmcnLFxuICBJbmNvbXBhdGlibGVXYWxsZXQgPSAnaW5jb21wYXRpYmxlLXdhbGxldCcsXG4gIE5hbWVZb3VyRGV2aWNlID0gJ25hbWUteW91ci1kZXZpY2UnLFxuICBBZGRBdXRoZW50aWNhdG9yID0gJ2FkZC1hdXRoZW50aWNhdG9yJyxcbiAgU3VjY2VzcyA9ICdzdWNjZXNzJyxcbiAgRmFpbHVyZSA9ICdmYWlsdXJlJyxcbn1cblxuZXhwb3J0IGNvbnN0IFNlZWRsZXNzVXBkYXRlUmVjb3ZlcnlNZXRob2QgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgcGFyYW1zID0gdXNlUXVlcnlQYXJhbXMoKTtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBjb25zdCB7IHdhbGxldERldGFpbHMgfSA9IHVzZVdhbGxldENvbnRleHQoKTtcbiAgY29uc3QgeyByZW5kZXJNZmFQcm9tcHQgfSA9IHVzZVNlZWRsZXNzTWZhKCk7XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoU3RhdGUuTG9hZGluZyk7XG4gIGNvbnN0IFtuYW1lLCBzZXROYW1lXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3Qga2V5VHlwZSA9IHBhcmFtcy5nZXQoJ2tleVR5cGUnKSBhcyBLZXlUeXBlIHwgbnVsbDtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICh3YWxsZXREZXRhaWxzPy50eXBlICE9PSBTZWNyZXRUeXBlLlNlZWRsZXNzKSB7XG4gICAgICBzZXRTdGF0ZShTdGF0ZS5JbmNvbXBhdGlibGVXYWxsZXQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChrZXlUeXBlKSB7XG4gICAgICBzZXRTdGF0ZShTdGF0ZS5OYW1lWW91ckRldmljZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFN0YXRlKFN0YXRlLkFkZEF1dGhlbnRpY2F0b3IpO1xuICAgIH1cbiAgfSwgW2tleVR5cGUsIHdhbGxldERldGFpbHM/LnR5cGVdKTtcblxuICBjb25zdCBhZGRGaWRvRGV2aWNlID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWtleVR5cGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXRTdGF0ZShTdGF0ZS5Mb2FkaW5nKTtcblxuICAgICAgYXdhaXQgcmVxdWVzdDxBZGRGaWRvRGV2aWNlSGFuZGxlcj4oe1xuICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuU0VFRExFU1NfQUREX0ZJRE9fREVWSUNFLFxuICAgICAgICBwYXJhbXM6IFtuYW1lLCBrZXlUeXBlXSxcbiAgICAgIH0pO1xuXG4gICAgICBzZXRTdGF0ZShTdGF0ZS5TdWNjZXNzKTtcbiAgICB9IGNhdGNoIChfZXJyKSB7XG4gICAgICBzZXRTdGF0ZShTdGF0ZS5GYWlsdXJlKTtcbiAgICB9XG4gIH0sIFtyZXF1ZXN0LCBrZXlUeXBlLCBuYW1lXSk7XG5cbiAgY29uc3Qga2V5Ym9hcmRIYW5kbGVycyA9IHVzZUtleWJvYXJkU2hvcnRjdXRzKHtcbiAgICBFbnRlcjogYWRkRmlkb0RldmljZSxcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAzNzUsXG4gICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICBweDogMixcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnYmFja2dyb3VuZC5wYXBlcicsXG4gICAgICAgIGFsaWduU2VsZjogJ2NlbnRlcicsXG4gICAgICAgIGJvcmRlclJhZGl1czogMSxcbiAgICAgICAgcGI6IDMsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtzdGF0ZSA9PT0gU3RhdGUuRmFpbHVyZSAmJiAoXG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgZ2FwOiAyLFxuICAgICAgICAgICAgcHg6IDMsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxBbGVydENpcmNsZUljb24gc2l6ZT17NzJ9IC8+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIGdhcDogMC41IH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgc3g9e3sgbWI6IDIgfX0+XG4gICAgICAgICAgICAgIHt0KCdTb21ldGhpbmcgV2VudCBXcm9uZycpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAgICAgIHt0KCdXZSBlbmNvdW50ZXJlZCBhbiB1bmV4cGVjdGVkIGlzc3VlLicpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+e3QoJ1BsZWFzZSB0cnkgYWdhaW4uJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHN4PXt7IG10OiA0IH19XG4gICAgICAgICAgICBvbkNsaWNrPXthZGRGaWRvRGV2aWNlfVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJidG4tdHJ5LWFnYWluXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnVHJ5IGFnYWluJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICBvbkNsaWNrPXt3aW5kb3cuY2xvc2V9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImJ0bi1jbG9zZVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ0Nsb3NlJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApfVxuICAgICAge3N0YXRlID09PSBTdGF0ZS5TdWNjZXNzICYmIChcbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBnYXA6IDIsXG4gICAgICAgICAgICBweDogMixcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxDaGVja0NpcmNsZUljb24gc2l6ZT17NzJ9IHN4PXt7IGNvbG9yOiAnc3VjY2Vzcy5tYWluJyB9fSAvPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPnt0KCdTdWNjZXNzIScpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgIHt0KCdZb3UgY2FuIG5vdyB1c2UgeW91ciBuZXcge3ttZXRob2ROYW1lfX0gdG8gdmVyaWZ5IHJlcXVlc3RzLicsIHtcbiAgICAgICAgICAgICAgbWV0aG9kTmFtZTpcbiAgICAgICAgICAgICAgICBrZXlUeXBlID09PSBLZXlUeXBlLll1YmlrZXlcbiAgICAgICAgICAgICAgICAgID8gdCgnWXViaWtleScpXG4gICAgICAgICAgICAgICAgICA6IGtleVR5cGUgPT09IEtleVR5cGUuUGFzc2tleVxuICAgICAgICAgICAgICAgICAgICA/IHQoJ1Bhc3NrZXknKVxuICAgICAgICAgICAgICAgICAgICA6IHQoJ0F1dGhlbnRpY2F0b3IgYXBwJyksXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIG9uQ2xpY2s9e3dpbmRvdy5jbG9zZX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYnRuLWNsb3NlXCJcbiAgICAgICAgICAgIHN4PXt7IG10OiAzIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ0Nsb3NlJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApfVxuICAgICAge3N0YXRlID09PSBTdGF0ZS5JbmNvbXBhdGlibGVXYWxsZXQgJiYgKFxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGdhcDogMixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEFsZXJ0Q2lyY2xlSWNvbiBzaXplPXs3Mn0+PC9BbGVydENpcmNsZUljb24+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+e3QoJ0luY29tcGF0aWJsZSBXYWxsZXQnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAgICB7dCgnVGhpcyBhY3Rpb24gaXMgb25seSBhbGxvd2VkIGZvciBTZWVkbGVzcyB3YWxsZXRzLicpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICl9XG4gICAgICB7c3RhdGUgPT09IFN0YXRlLkxvYWRpbmcgJiYgKFxuICAgICAgICA8PlxuICAgICAgICAgIDxQYWdlVGl0bGVcbiAgICAgICAgICAgIHNob3dCYWNrQnV0dG9uPXtmYWxzZX1cbiAgICAgICAgICAgIHZhcmlhbnQ9e1BhZ2VUaXRsZVZhcmlhbnQuUFJJTUFSWX1cbiAgICAgICAgICAgIG1hcmdpbj1cIjAgMCAwIC0xNnB4XCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7a2V5VHlwZSA9PT0gS2V5VHlwZS5ZdWJpa2V5XG4gICAgICAgICAgICAgID8gdCgnWXViaWtleSBTZXR1cCcpXG4gICAgICAgICAgICAgIDoga2V5VHlwZSA9PT0gS2V5VHlwZS5QYXNza2V5XG4gICAgICAgICAgICAgICAgPyB0KCdQYXNza2V5IFNldHVwJylcbiAgICAgICAgICAgICAgICA6IHQoJ0F1dGhlbnRpY2F0b3IgU2V0dXAnKX1cbiAgICAgICAgICA8L1BhZ2VUaXRsZT5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXs3Mn0gLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIHtyZW5kZXJNZmFQcm9tcHQoKX1cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgICAge2tleVR5cGUgJiYgc3RhdGUgPT09IFN0YXRlLk5hbWVZb3VyRGV2aWNlICYmIChcbiAgICAgICAgPD5cbiAgICAgICAgICA8UGFnZVRpdGxlXG4gICAgICAgICAgICBzaG93QmFja0J1dHRvbj17ZmFsc2V9XG4gICAgICAgICAgICB2YXJpYW50PXtQYWdlVGl0bGVWYXJpYW50LlBSSU1BUll9XG4gICAgICAgICAgICBtYXJnaW49XCIwIDAgMCAtMTZweFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge2tleVR5cGUgPT09IEtleVR5cGUuWXViaWtleVxuICAgICAgICAgICAgICA/IHQoJ05hbWUgWW91ciBZdWJpa2V5JylcbiAgICAgICAgICAgICAgOiB0KCdOYW1lIFlvdXIgUGFzc2tleScpfVxuICAgICAgICAgIDwvUGFnZVRpdGxlPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZmlkby1kZXZpY2UtbmFtZVwiXG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICBsYWJlbD17XG4gICAgICAgICAgICAgICAga2V5VHlwZSA9PT0gS2V5VHlwZS5ZdWJpa2V5XG4gICAgICAgICAgICAgICAgICA/IHQoJ1l1YmlrZXkgTmFtZScpXG4gICAgICAgICAgICAgICAgICA6IHQoJ1Bhc3NrZXkgTmFtZScpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaW5wdXRMYWJlbFByb3BzPXt7XG4gICAgICAgICAgICAgICAgc3g6IHtcbiAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICdib2R5Mi5mb250U2l6ZScsXG4gICAgICAgICAgICAgICAgICBtYjogMSxcbiAgICAgICAgICAgICAgICAgIG10OiA0LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGhlbHBlclRleHQ9e3QoXG4gICAgICAgICAgICAgICAgJ0FkZCBhIHt7ZGV2aWNlfX0gbmFtZSwgc28gdGhhdCBpdOKAmXMgZWFzaWVyIHRvIGZpbmQgbGF0ZXIuJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBkZXZpY2U6XG4gICAgICAgICAgICAgICAgICAgIGtleVR5cGUgPT09IEtleVR5cGUuWXViaWtleSA/IHQoJ1l1YmlrZXknKSA6IHQoJ1Bhc3NrZXknKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17XG4gICAgICAgICAgICAgICAga2V5VHlwZSA9PT0gS2V5VHlwZS5ZdWJpa2V5ID8gdCgnTXkgWXViaWtleScpIDogdCgnTXkgUGFzc2tleScpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFsdWU9e25hbWV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXYpID0+IHNldE5hbWUoZXYudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgey4uLmtleWJvYXJkSGFuZGxlcnN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgb25DbGljaz17YWRkRmlkb0RldmljZX1cbiAgICAgICAgICAgIGRpc2FibGVkPXshbmFtZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnU2F2ZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8Lz5cbiAgICAgICl9XG4gICAgICB7IWtleVR5cGUgJiYgc3RhdGUgPT09IFN0YXRlLkFkZEF1dGhlbnRpY2F0b3IgJiYgKFxuICAgICAgICA8QXV0aGVudGljYXRvckRldGFpbHNcbiAgICAgICAgICBhdXRvSW5pdGlhbGl6ZVxuICAgICAgICAgIG9uVXBkYXRlZD17KCkgPT4gc2V0U3RhdGUoU3RhdGUuU3VjY2Vzcyl9XG4gICAgICAgICAgb25CYWNrQ2xpY2s9e3dpbmRvdy5jbG9zZX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iXSwibmFtZXMiOlsidXNlQ2FsbGJhY2siLCJ1c2VLZXlib2FyZFNob3J0Y3V0cyIsInNob3J0Y3V0cyIsIm9uS2V5RG93biIsImV2ZW50IiwiY2FsbGJhY2siLCJrZXkiLCJwcmV2ZW50RGVmYXVsdCIsInVzZU1lbW8iLCJ1c2VMb2NhdGlvbiIsInVzZVF1ZXJ5UGFyYW1zIiwic2VhcmNoIiwiVVJMU2VhcmNoUGFyYW1zIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJ1c2VUcmFuc2xhdGlvbiIsIkFsZXJ0Q2lyY2xlSWNvbiIsIkJ1dHRvbiIsIkNoZWNrQ2lyY2xlSWNvbiIsIkNpcmN1bGFyUHJvZ3Jlc3MiLCJTdGFjayIsIlRleHRGaWVsZCIsIlR5cG9ncmFwaHkiLCJ1c2VTZWVkbGVzc01mYSIsIlBhZ2VUaXRsZSIsIlBhZ2VUaXRsZVZhcmlhbnQiLCJ1c2VXYWxsZXRDb250ZXh0IiwiU2VjcmV0VHlwZSIsInVzZUNvbm5lY3Rpb25Db250ZXh0IiwiRXh0ZW5zaW9uUmVxdWVzdCIsIktleVR5cGUiLCJBdXRoZW50aWNhdG9yRGV0YWlscyIsIlN0YXRlIiwiU2VlZGxlc3NVcGRhdGVSZWNvdmVyeU1ldGhvZCIsInQiLCJwYXJhbXMiLCJyZXF1ZXN0Iiwid2FsbGV0RGV0YWlscyIsInJlbmRlck1mYVByb21wdCIsInN0YXRlIiwic2V0U3RhdGUiLCJMb2FkaW5nIiwibmFtZSIsInNldE5hbWUiLCJrZXlUeXBlIiwiZ2V0IiwidHlwZSIsIlNlZWRsZXNzIiwiSW5jb21wYXRpYmxlV2FsbGV0IiwiTmFtZVlvdXJEZXZpY2UiLCJBZGRBdXRoZW50aWNhdG9yIiwiYWRkRmlkb0RldmljZSIsIm1ldGhvZCIsIlNFRURMRVNTX0FERF9GSURPX0RFVklDRSIsIlN1Y2Nlc3MiLCJfZXJyIiwiRmFpbHVyZSIsImtleWJvYXJkSGFuZGxlcnMiLCJFbnRlciIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJoZWlnaHQiLCJweCIsImJhY2tncm91bmRDb2xvciIsImFsaWduU2VsZiIsImJvcmRlclJhZGl1cyIsInBiIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiZ2FwIiwic2l6ZSIsInRleHRBbGlnbiIsInZhcmlhbnQiLCJtYiIsImZ1bGxXaWR0aCIsIm10Iiwib25DbGljayIsIndpbmRvdyIsImNsb3NlIiwiY29sb3IiLCJtZXRob2ROYW1lIiwiWXViaWtleSIsIlBhc3NrZXkiLCJGcmFnbWVudCIsInNob3dCYWNrQnV0dG9uIiwiUFJJTUFSWSIsIm1hcmdpbiIsImZsZXhHcm93IiwiX2V4dGVuZHMiLCJhdXRvRm9jdXMiLCJsYWJlbCIsImlucHV0TGFiZWxQcm9wcyIsInRyYW5zZm9ybSIsImZvbnRTaXplIiwiaGVscGVyVGV4dCIsImRldmljZSIsInBsYWNlaG9sZGVyIiwidmFsdWUiLCJvbkNoYW5nZSIsImV2IiwidGFyZ2V0IiwiZGlzYWJsZWQiLCJhdXRvSW5pdGlhbGl6ZSIsIm9uVXBkYXRlZCIsIm9uQmFja0NsaWNrIl0sInNvdXJjZVJvb3QiOiIifQ==