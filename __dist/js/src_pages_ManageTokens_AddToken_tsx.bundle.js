"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ManageTokens_AddToken_tsx"],{

/***/ "./src/components/common/MaliciousTokenWarning.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/MaliciousTokenWarning.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MaliciousTokenWarningBox": () => (/* binding */ MaliciousTokenWarningBox),
/* harmony export */   "MaliciousTokenWarningIcon": () => (/* binding */ MaliciousTokenWarningIcon)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Permissions/components/WarningBox */ "./src/pages/Permissions/components/WarningBox.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const MaliciousTokenWarningBox = props => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Box, props, /*#__PURE__*/React.createElement(_src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_0__.WarningBox, {
    title: t('Malicious Token'),
    text: t('This token has been flagged as malicious. Use caution when interacting with it.')
  }));
};
const MaliciousTokenWarningIcon = ({
  size
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    title: t('This token has been flagged as malicious')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AlertTriangleIcon, {
    color: theme.palette.warning.main,
    size: size ?? 16
  }));
};

/***/ }),

/***/ "./src/components/common/ProfitAndLoss.tsx":
/*!*************************************************!*\
  !*** ./src/components/common/ProfitAndLoss.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PAndL": () => (/* binding */ PAndL)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const DEFAULT_DECIMALS = 2;
const PAndL = ({
  value,
  percentage,
  size,
  showPercentage
}) => {
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__.useSettingsContext)();
  if (!percentage || !value) {
    return /*#__PURE__*/React.createElement(React.Fragment, null);
  }
  const trend = percentage > 0 ? _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Trend.Up : _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Trend.Down;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ProfitAndLoss, {
    value: currencyFormatter(value),
    percentage: showPercentage ? `${percentage.toFixed(DEFAULT_DECIMALS)}%` : undefined,
    trend: trend,
    size: size
  }));
};

/***/ }),

/***/ "./src/components/common/TokenCardWithBalance.tsx":
/*!********************************************************!*\
  !*** ./src/components/common/TokenCardWithBalance.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenCardWithBalance": () => (/* binding */ TokenCardWithBalance)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ProfitAndLoss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProfitAndLoss */ "./src/components/common/ProfitAndLoss.tsx");
/* harmony import */ var _MaliciousTokenWarning__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MaliciousTokenWarning */ "./src/components/common/MaliciousTokenWarning.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function TokenCardWithBalance({
  name,
  balanceDisplayValue,
  symbol,
  onClick,
  balanceInCurrency,
  children,
  currencyFormatter,
  currency,
  priceChanges,
  isMalicious
}) {
  const [hasNameOverflow, setHasNameOverflow] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const overflowingText = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (checkOverflow(overflowingText.current)) {
      setHasNameOverflow(true);
      return;
    }
    setHasNameOverflow(false);
  }, [overflowingText]);
  const checkOverflow = textContainer => {
    if (textContainer) {
      return textContainer.offsetHeight < textContainer.scrollHeight || textContainer.offsetWidth < textContainer.scrollWidth;
    }
    return false;
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Card, {
    onClick: () => onClick && onClick(),
    sx: {
      py: '10px',
      px: 2,
      borderRadius: '10px',
      cursor: onClick ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    direction: "row",
    alignItems: "center",
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    direction: "row",
    sx: {
      flex: 0
    }
  }, children), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      ml: 2,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    sx: {
      width: '100%',
      gap: 1
    }
  }, isMalicious && /*#__PURE__*/React.createElement(_MaliciousTokenWarning__WEBPACK_IMPORTED_MODULE_2__.MaliciousTokenWarningIcon, null), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Tooltip, {
    placement: "bottom",
    title: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
      variant: "caption"
    }, name),
    disableHoverListener: !hasNameOverflow,
    disableFocusListener: !hasNameOverflow,
    sx: {
      flex: 1,
      width: 0,
      cursor: onClick ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    ref: overflowingText,
    variant: "h6",
    fontWeight: "fontWeightSemibold",
    sx: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, name)), balanceInCurrency && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2"
  }, currencyFormatter ? currencyFormatter(Number(balanceInCurrency)) : balanceInCurrency, currency && ` ${currency}`)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      alignItems: 'flex-end',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2"
  }, balanceDisplayValue?.toLocaleString()), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    sx: {
      ml: balanceDisplayValue !== undefined ? 0.4 : 0,
      color: 'text.secondary'
    }
  }, symbol)), priceChanges && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, null, /*#__PURE__*/React.createElement(_ProfitAndLoss__WEBPACK_IMPORTED_MODULE_1__.PAndL, {
    value: priceChanges.value,
    percentage: priceChanges.percentage
  }))))));
}

/***/ }),

/***/ "./src/pages/ManageTokens/AddToken.tsx":
/*!*********************************************!*\
  !*** ./src/pages/ManageTokens/AddToken.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddToken": () => (/* binding */ AddToken)
/* harmony export */ });
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useTokensWithBalances */ "./src/hooks/useTokensWithBalances.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_TokenCardWithBalance__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/common/TokenCardWithBalance */ "./src/components/common/TokenCardWithBalance.tsx");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_isTokenMalicious__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/utils/isTokenMalicious */ "./src/utils/isTokenMalicious.ts");
/* harmony import */ var _src_components_common_MaliciousTokenWarning__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/components/common/MaliciousTokenWarning */ "./src/components/common/MaliciousTokenWarning.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");















function AddToken() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_12__.useTranslation)();
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_1__.useConnectionContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__.useNetworkContext)();
  const tokens = (0,_src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_6__.useTokensWithBalances)({
    forceShowTokensWithoutBalances: true
  });
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_13__.useHistory)();
  const [addressInput, setAddressInput] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)('');
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [newTokenData, setNewTokenData] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)();
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)('');
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__.useAnalyticsContext)();
  const addCustomToken = async () => {
    if (!addressInput) return;
    try {
      const success = await request({
        method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__.ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN,
        params: [addressInput]
      });
      if (success) {
        _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"].success(t('Token Added'), {
          duration: 2000
        });
      }
      capture('ManageTokensAddCustomToken', {
        status: 'success',
        address: addressInput
      });
      history.goBack();
    } catch (_err) {
      capture('ManageTokensAddCustomToken', {
        status: 'failed',
        address: addressInput
      });
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"].error(t('Failed.'), {
        duration: 2000
      });
    }
  };
  const existingToken = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => tokens.find(token => token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_9__.TokenType.ERC20 && token.address.toLowerCase() === addressInput.toLowerCase()), [tokens, addressInput]);
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (!addressInput.length) {
      setNewTokenData(undefined);
      setError('');
      return;
    }
    const getTokenData = async () => {
      if (existingToken) {
        setError(t('Token already exists in your wallet.'));
        return;
      }
      setIsLoading(true);
      const data = await request({
        method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__.ExtensionRequest.SETTINGS_GET_TOKEN_DATA,
        params: [addressInput]
      });
      setIsLoading(false);
      if (!data) {
        setError(t('Not a valid ERC-20 token address.'));
        setNewTokenData(undefined);
        return;
      }
      setError('');
      setNewTokenData(data);
    };
    getTokenData();
  }, [request, addressInput, network, existingToken, t]);
  const tokenData = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => existingToken ?? newTokenData, [existingToken, newTokenData]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flex: 1,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_4__.PageTitle, null, t('Add Custom Token')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexGrow: 1,
      width: '100%',
      pt: 1,
      px: 2,
      pb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.TextField, {
    "data-testid": "add-custom-token-address-input",
    size: "small",
    multiline: true,
    fullWidth: true,
    rows: 2,
    label: t('Custom Token Address'),
    value: addressInput,
    placeholder: t('Enter an Address'),
    onChange: e => setAddressInput(e.nativeEvent.target.value),
    error: !!error,
    helperText: error
  }), tokenData && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      mt: 5,
      rowGap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, t('Token')), (0,_src_utils_isTokenMalicious__WEBPACK_IMPORTED_MODULE_10__.isTokenMalicious)(tokenData) && /*#__PURE__*/React.createElement(_src_components_common_MaliciousTokenWarning__WEBPACK_IMPORTED_MODULE_11__.MaliciousTokenWarningBox, null), /*#__PURE__*/React.createElement(_src_components_common_TokenCardWithBalance__WEBPACK_IMPORTED_MODULE_7__.TokenCardWithBalance, {
    name: tokenData.name,
    symbol: tokenData.symbol,
    isMalicious: (0,_src_utils_isTokenMalicious__WEBPACK_IMPORTED_MODULE_10__.isTokenMalicious)(tokenData)
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_8__.TokenIcon, {
    width: "32px",
    height: "32px",
    name: tokenData.name
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Button, {
    "data-testid": "add-custom-token-button",
    onClick: addCustomToken,
    disabled: isLoading || !!error?.length || !newTokenData,
    fullWidth: true,
    size: "large"
  }, t('Add Token'))))));
}

/***/ }),

/***/ "./src/pages/Permissions/components/WarningBox.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/Permissions/components/WarningBox.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WarningBox": () => (/* binding */ WarningBox)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function WarningBox({
  title,
  text
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Alert, {
    severity: "warning",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.GppMaybeIcon, {
      size: 24,
      color: theme.palette.common.black
    }),
    sx: {
      backgroundColor: 'warning.light',
      borderColor: 'transparent',
      px: 2,
      color: 'common.black',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AlertContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      fontWeight: 600,
      display: 'block'
    }
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      display: 'block'
    }
  }, text)));
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX01hbmFnZVRva2Vuc19BZGRUb2tlbl90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNcUM7QUFDVTtBQUUyQjtBQUVuRSxNQUFNTSx3QkFBd0IsR0FBSUMsS0FBZSxJQUFLO0VBQzNELE1BQU07SUFBRUM7RUFBRSxDQUFDLEdBQUdKLDZEQUFjLEVBQUU7RUFFOUIsb0JBQ0VLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVCw0REFBRyxFQUFLTSxLQUFLLGVBQ1pFLEtBQUEsQ0FBQUMsYUFBQSxDQUFDTCxvRkFBVTtJQUNUTSxLQUFLLEVBQUVILENBQUMsQ0FBQyxpQkFBaUIsQ0FBRTtJQUM1QkksSUFBSSxFQUFFSixDQUFDLENBQ0wsaUZBQWlGO0VBQ2pGLEVBQ0YsQ0FDRTtBQUVWLENBQUM7QUFFTSxNQUFNSyx5QkFBeUIsR0FBR0EsQ0FBQztFQUFFQztBQUF3QixDQUFDLEtBQUs7RUFDeEUsTUFBTTtJQUFFTjtFQUFFLENBQUMsR0FBR0osNkRBQWMsRUFBRTtFQUM5QixNQUFNVyxLQUFLLEdBQUdaLHVFQUFRLEVBQUU7RUFFeEIsb0JBQ0VNLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUixnRUFBTztJQUFDUyxLQUFLLEVBQUVILENBQUMsQ0FBQywwQ0FBMEM7RUFBRSxnQkFDNURDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDViwwRUFBaUI7SUFBQ2dCLEtBQUssRUFBRUQsS0FBSyxDQUFDRSxPQUFPLENBQUNDLE9BQU8sQ0FBQ0MsSUFBSztJQUFDTCxJQUFJLEVBQUVBLElBQUksSUFBSTtFQUFHLEVBQUcsQ0FDbEU7QUFFZCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25DeUU7QUFDTjtBQVNwRSxNQUFNVSxnQkFBZ0IsR0FBRyxDQUFDO0FBRW5CLE1BQU1DLEtBQUssR0FBR0EsQ0FBQztFQUNwQkMsS0FBSztFQUNMQyxVQUFVO0VBQ1ZiLElBQUk7RUFDSmM7QUFDVSxDQUFDLEtBQUs7RUFDaEIsTUFBTTtJQUFFQztFQUFrQixD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cUMsT0FBTyxFQUFDLFNBQVM7SUFBQ2IsRUFBRSxFQUFFO01BQUVvRyxPQUFPLEVBQUU7SUFBUTtFQUFFLEdBQ3BEckosSUFBSSxDQUNNLENBQ0EsQ0FDVDtBQUVaIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9NYWxpY2lvdXNUb2tlbldhcm5pbmcudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vUHJvZml0QW5kTG9zcy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkNhcmRXaXRoQmFsYW5jZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9NYW5hZ2VUb2tlbnMvQWRkVG9rZW4udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvUGVybWlzc2lvbnMvY29tcG9uZW50cy9XYXJuaW5nQm94LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBbGVydFRyaWFuZ2xlSWNvbixcbiAgQm94LFxuICBCb3hQcm9wcyxcbiAgVG9vbHRpcCxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyBXYXJuaW5nQm94IH0gZnJvbSAnQHNyYy9wYWdlcy9QZXJtaXNzaW9ucy9jb21wb25lbnRzL1dhcm5pbmdCb3gnO1xuXG5leHBvcnQgY29uc3QgTWFsaWNpb3VzVG9rZW5XYXJuaW5nQm94ID0gKHByb3BzOiBCb3hQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHsuLi5wcm9wc30+XG4gICAgICA8V2FybmluZ0JveFxuICAgICAgICB0aXRsZT17dCgnTWFsaWNpb3VzIFRva2VuJyl9XG4gICAgICAgIHRleHQ9e3QoXG4gICAgICAgICAgJ1RoaXMgdG9rZW4gaGFzIGJlZW4gZmxhZ2dlZCBhcyBtYWxpY2lvdXMuIFVzZSBjYXV0aW9uIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCBpdC4nLFxuICAgICAgICApfVxuICAgICAgLz5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBNYWxpY2lvdXNUb2tlbldhcm5pbmdJY29uID0gKHsgc2l6ZSB9OiB7IHNpemU/OiBudW1iZXIgfSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxUb29sdGlwIHRpdGxlPXt0KCdUaGlzIHRva2VuIGhhcyBiZWVuIGZsYWdnZWQgYXMgbWFsaWNpb3VzJyl9PlxuICAgICAgPEFsZXJ0VHJpYW5nbGVJY29uIGNvbG9yPXt0aGVtZS5wYWxldHRlLndhcm5pbmcubWFpbn0gc2l6ZT17c2l6ZSA/PyAxNn0gLz5cbiAgICA8L1Rvb2x0aXA+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgU3RhY2ssIFRyZW5kLCBQcm9maXRBbmRMb3NzIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVNldHRpbmdzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvU2V0dGluZ3NQcm92aWRlcic7XG5cbmludGVyZmFjZSBQYW5kTFByb3BzIHtcbiAgdmFsdWU/OiBudW1iZXI7XG4gIHBlcmNlbnRhZ2U/OiBudW1iZXI7XG4gIHNob3dQZXJjZW50YWdlPzogYm9vbGVhbjtcbiAgc2l6ZT86ICdiaWcnO1xufVxuXG5jb25zdCBERUZBVUxUX0RFQ0lNQUxTID0gMjtcblxuZXhwb3J0IGNvbnN0IFBBbmRMID0gKHtcbiAgdmFsdWUsXG4gIHBlcmNlbnRhZ2UsXG4gIHNpemUsXG4gIHNob3dQZXJjZW50YWdlLFxufTogUGFuZExQcm9wcykgPT4ge1xuICBjb25zdCB7IGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgaWYgKCFwZXJjZW50YWdlIHx8ICF2YWx1ZSkge1xuICAgIHJldHVybiA8PjwvPjtcbiAgfVxuICBjb25zdCB0cmVuZCA9IHBlcmNlbnRhZ2UgPiAwID8gVHJlbmQuVXAgOiBUcmVuZC5Eb3duO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrPlxuICAgICAgPFByb2ZpdEFuZExvc3NcbiAgICAgICAgdmFsdWU9e2N1cnJlbmN5Rm9ybWF0dGVyKHZhbHVlKX1cbiAgICAgICAgcGVyY2VudGFnZT17XG4gICAgICAgICAgc2hvd1BlcmNlbnRhZ2VcbiAgICAgICAgICAgID8gYCR7cGVyY2VudGFnZS50b0ZpeGVkKERFRkFVTFRfREVDSU1BTFMpfSVgXG4gICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICAgIHRyZW5kPXt0cmVuZH1cbiAgICAgICAgc2l6ZT17c2l6ZX1cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBDYXJkLCBTdGFjaywgVG9vbHRpcCwgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUb2tlbldpdGhCYWxhbmNlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuaW1wb3J0IHsgUEFuZEwgfSBmcm9tICcuL1Byb2ZpdEFuZExvc3MnO1xuaW1wb3J0IHsgTWFsaWNpb3VzVG9rZW5XYXJuaW5nSWNvbiB9IGZyb20gJy4vTWFsaWNpb3VzVG9rZW5XYXJuaW5nJztcblxuaW50ZXJmYWNlIFRva2VuQ2FyZFByb3BzIHtcbiAgbmFtZTogc3RyaW5nO1xuICBzeW1ib2w6IHN0cmluZztcbiAgYmFsYW5jZURpc3BsYXlWYWx1ZT86IHN0cmluZyB8IG51bWJlcjtcbiAgY2hpbGRyZW4/OiBKU1guRWxlbWVudDtcbiAgYmFsYW5jZUluQ3VycmVuY3k/OiBzdHJpbmc7XG4gIG9uQ2xpY2s/KCk6IHZvaWQ7XG4gIGN1cnJlbmN5Rm9ybWF0dGVyPzogKGJhbGFuY2VJbkN1cnJlbmN5OiBudW1iZXIpID0+IHN0cmluZztcbiAgY3VycmVuY3k/OiBzdHJpbmc7XG4gIHByaWNlQ2hhbmdlcz86IFRva2VuV2l0aEJhbGFuY2VbJ3ByaWNlQ2hhbmdlcyddO1xuICBpc01hbGljaW91cz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUb2tlbkNhcmRXaXRoQmFsYW5jZSh7XG4gIG5hbWUsXG4gIGJhbGFuY2VEaXNwbGF5VmFsdWUsXG4gIHN5bWJvbCxcbiAgb25DbGljayxcbiAgYmFsYW5jZUluQ3VycmVuY3ksXG4gIGNoaWxkcmVuLFxuICBjdXJyZW5jeUZvcm1hdHRlcixcbiAgY3VycmVuY3ksXG4gIHByaWNlQ2hhbmdlcyxcbiAgaXNNYWxpY2lvdXMsXG59OiBUb2tlbkNhcmRQcm9wcykge1xuICBjb25zdCBbaGFzTmFtZU92ZXJmbG93LCBzZXRIYXNOYW1lT3ZlcmZsb3ddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IG92ZXJmbG93aW5nVGV4dCA9IHVzZVJlZjxIVE1MU3BhbkVsZW1lbnQ+KG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGNoZWNrT3ZlcmZsb3cob3ZlcmZsb3dpbmdUZXh0LmN1cnJlbnQpKSB7XG4gICAgICBzZXRIYXNOYW1lT3ZlcmZsb3codHJ1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNldEhhc05hbWVPdmVyZmxvdyhmYWxzZSk7XG4gIH0sIFtvdmVyZmxvd2luZ1RleHRdKTtcblxuICBjb25zdCBjaGVja092ZXJmbG93ID0gKHRleHRDb250YWluZXI6IEhUTUxTcGFuRWxlbWVudCB8IG51bGwpOiBib29sZWFuID0+IHtcbiAgICBpZiAodGV4dENvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGV4dENvbnRhaW5lci5vZmZzZXRIZWlnaHQgPCB0ZXh0Q29udGFpbmVyLnNjcm9sbEhlaWdodCB8fFxuICAgICAgICB0ZXh0Q29udGFpbmVyLm9mZnNldFdpZHRoIDwgdGV4dENvbnRhaW5lci5zY3JvbGxXaWR0aFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPENhcmRcbiAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2xpY2sgJiYgb25DbGljaygpfVxuICAgICAgc3g9e3tcbiAgICAgICAgcHk6ICcxMHB4JyxcbiAgICAgICAgcHg6IDIsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICBjdXJzb3I6IG9uQ2xpY2sgPyAncG9pbnRlcicgOiAnZGVmYXVsdCcsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIgc3g9e3sgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIHN4PXt7IGZsZXg6IDAgfX0+XG4gICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgIDxTdGFjayBzeD17eyBtbDogMiwgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxuICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgICBzeD17eyB3aWR0aDogJzEwMCUnLCBnYXA6IDEgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aXNNYWxpY2lvdXMgJiYgPE1hbGljaW91c1Rva2VuV2FybmluZ0ljb24gLz59XG4gICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICBwbGFjZW1lbnQ9XCJib3R0b21cIlxuICAgICAgICAgICAgICB0aXRsZT17PFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj57bmFtZX08L1R5cG9ncmFwaHk+fVxuICAgICAgICAgICAgICBkaXNhYmxlSG92ZXJMaXN0ZW5lcj17IWhhc05hbWVPdmVyZmxvd31cbiAgICAgICAgICAgICAgZGlzYWJsZUZvY3VzTGlzdGVuZXI9eyFoYXNOYW1lT3ZlcmZsb3d9XG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IG9uQ2xpY2sgPyAncG9pbnRlcicgOiAnZGVmYXVsdCcsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgcmVmPXtvdmVyZmxvd2luZ1RleHR9XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImg2XCJcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiZm9udFdlaWdodFNlbWlib2xkXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLFxuICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtuYW1lfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICB7YmFsYW5jZUluQ3VycmVuY3kgJiYgKFxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgICAgICB7Y3VycmVuY3lGb3JtYXR0ZXJcbiAgICAgICAgICAgICAgICAgID8gY3VycmVuY3lGb3JtYXR0ZXIoTnVtYmVyKGJhbGFuY2VJbkN1cnJlbmN5KSlcbiAgICAgICAgICAgICAgICAgIDogYmFsYW5jZUluQ3VycmVuY3l9XG4gICAgICAgICAgICAgICAge2N1cnJlbmN5ICYmIGAgJHtjdXJyZW5jeX1gfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsIGZsZXhEaXJlY3Rpb246ICdyb3cnIH19PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgICAgICB7YmFsYW5jZURpc3BsYXlWYWx1ZT8udG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIG1sOiBiYWxhbmNlRGlzcGxheVZhbHVlICE9PSB1bmRlZmluZWQgPyAwLjQgOiAwLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtzeW1ib2x9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICB7cHJpY2VDaGFuZ2VzICYmIChcbiAgICAgICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgICAgIDxQQW5kTFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3ByaWNlQ2hhbmdlcy52YWx1ZX1cbiAgICAgICAgICAgICAgICAgIHBlcmNlbnRhZ2U9e3ByaWNlQ2hhbmdlcy5wZXJjZW50YWdlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvQ2FyZD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VUb2tlbnNXaXRoQmFsYW5jZXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVRva2Vuc1dpdGhCYWxhbmNlcyc7XG5pbXBvcnQgeyBBZGRDdXN0b21Ub2tlbkhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2V0dGluZ3MvaGFuZGxlcnMvYWRkQ3VzdG9tVG9rZW4nO1xuaW1wb3J0IHsgR2V0VG9rZW5EYXRhSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9zZXR0aW5ncy9oYW5kbGVycy9nZXRUb2tlbkRhdGFCeUFkZHJlc3MnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgVHlwb2dyYXBoeSxcbiAgdG9hc3QsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBUb2tlbkNhcmRXaXRoQmFsYW5jZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vVG9rZW5DYXJkV2l0aEJhbGFuY2UnO1xuaW1wb3J0IHsgVG9rZW5JY29uIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkljb24nO1xuaW1wb3J0IHsgVG9rZW5UeXBlLCBUb2tlbldpdGhCYWxhbmNlRVJDMjAgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgaXNUb2tlbk1hbGljaW91cyB9IGZyb20gJ0BzcmMvdXRpbHMvaXNUb2tlbk1hbGljaW91cyc7XG5pbXBvcnQgeyBOZXR3b3JrQ29udHJhY3RUb2tlbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtY2hhaW5zLXNkayc7XG5pbXBvcnQgeyBNYWxpY2lvdXNUb2tlbldhcm5pbmdCb3ggfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL01hbGljaW91c1Rva2VuV2FybmluZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGRUb2tlbigpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgdG9rZW5zID0gdXNlVG9rZW5zV2l0aEJhbGFuY2VzKHtcbiAgICBmb3JjZVNob3dUb2tlbnNXaXRob3V0QmFsYW5jZXM6IHRydWUsXG4gIH0pO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuXG4gIGNvbnN0IFthZGRyZXNzSW5wdXQsIHNldEFkZHJlc3NJbnB1dF0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcbiAgY29uc3QgW25ld1Rva2VuRGF0YSwgc2V0TmV3VG9rZW5EYXRhXSA9IHVzZVN0YXRlPE5ldHdvcmtDb250cmFjdFRva2VuPigpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcblxuICBjb25zdCBhZGRDdXN0b21Ub2tlbiA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWFkZHJlc3NJbnB1dCkgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdWNjZXNzID0gYXdhaXQgcmVxdWVzdDxBZGRDdXN0b21Ub2tlbkhhbmRsZXI+KHtcbiAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LlNFVFRJTkdTX0FERF9DVVNUT01fVE9LRU4sXG4gICAgICAgIHBhcmFtczogW2FkZHJlc3NJbnB1dF0sXG4gICAgICB9KTtcbiAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIHRvYXN0LnN1Y2Nlc3ModCgnVG9rZW4gQWRkZWQnKSwgeyBkdXJhdGlvbjogMjAwMCB9KTtcbiAgICAgIH1cbiAgICAgIGNhcHR1cmUoJ01hbmFnZVRva2Vuc0FkZEN1c3RvbVRva2VuJywge1xuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgYWRkcmVzczogYWRkcmVzc0lucHV0LFxuICAgICAgfSk7XG4gICAgICBoaXN0b3J5LmdvQmFjaygpO1xuICAgIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICAgIGNhcHR1cmUoJ01hbmFnZVRva2Vuc0FkZEN1c3RvbVRva2VuJywge1xuICAgICAgICBzdGF0dXM6ICdmYWlsZWQnLFxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzSW5wdXQsXG4gICAgICB9KTtcbiAgICAgIHRvYXN0LmVycm9yKHQoJ0ZhaWxlZC4nKSwgeyBkdXJhdGlvbjogMjAwMCB9KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZXhpc3RpbmdUb2tlbiA9IHVzZU1lbW8oXG4gICAgKCkgPT5cbiAgICAgIHRva2Vucy5maW5kKFxuICAgICAgICAodG9rZW4pID0+XG4gICAgICAgICAgdG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkVSQzIwICYmXG4gICAgICAgICAgdG9rZW4uYWRkcmVzcy50b0xvd2VyQ2FzZSgpID09PSBhZGRyZXNzSW5wdXQudG9Mb3dlckNhc2UoKSxcbiAgICAgICkgYXMgVG9rZW5XaXRoQmFsYW5jZUVSQzIwIHwgdW5kZWZpbmVkLFxuICAgIFt0b2tlbnMsIGFkZHJlc3NJbnB1dF0sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWFkZHJlc3NJbnB1dC5sZW5ndGgpIHtcbiAgICAgIHNldE5ld1Rva2VuRGF0YSh1bmRlZmluZWQpO1xuICAgICAgc2V0RXJyb3IoJycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGdldFRva2VuRGF0YSA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChleGlzdGluZ1Rva2VuKSB7XG4gICAgICAgIHNldEVycm9yKHQoJ1Rva2VuIGFscmVhZHkgZXhpc3RzIGluIHlvdXIgd2FsbGV0LicpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVxdWVzdDxHZXRUb2tlbkRhdGFIYW5kbGVyPih7XG4gICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5TRVRUSU5HU19HRVRfVE9LRU5fREFUQSxcbiAgICAgICAgcGFyYW1zOiBbYWRkcmVzc0lucHV0XSxcbiAgICAgIH0pO1xuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcblxuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIHNldEVycm9yKHQoJ05vdCBhIHZhbGlkIEVSQy0yMCB0b2tlbiBhZGRyZXNzLicpKTtcbiAgICAgICAgc2V0TmV3VG9rZW5EYXRhKHVuZGVmaW5lZCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNldEVycm9yKCcnKTtcbiAgICAgIHNldE5ld1Rva2VuRGF0YShkYXRhKTtcbiAgICB9O1xuXG4gICAgZ2V0VG9rZW5EYXRhKCk7XG4gIH0sIFtyZXF1ZXN0LCBhZGRyZXNzSW5wdXQsIG5ldHdvcmssIGV4aXN0aW5nVG9rZW4sIHRdKTtcblxuICBjb25zdCB0b2tlbkRhdGEgPSB1c2VNZW1vKFxuICAgICgpID0+IGV4aXN0aW5nVG9rZW4gPz8gbmV3VG9rZW5EYXRhLFxuICAgIFtleGlzdGluZ1Rva2VuLCBuZXdUb2tlbkRhdGFdLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxTdGFjayBzeD17eyBmbGV4OiAxLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgPFBhZ2VUaXRsZT57dCgnQWRkIEN1c3RvbSBUb2tlbicpfTwvUGFnZVRpdGxlPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgcHQ6IDEsXG4gICAgICAgICAgICBweDogMixcbiAgICAgICAgICAgIHBiOiAzLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFkZC1jdXN0b20tdG9rZW4tYWRkcmVzcy1pbnB1dFwiXG4gICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgbXVsdGlsaW5lXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHJvd3M9ezJ9XG4gICAgICAgICAgICBsYWJlbD17dCgnQ3VzdG9tIFRva2VuIEFkZHJlc3MnKX1cbiAgICAgICAgICAgIHZhbHVlPXthZGRyZXNzSW5wdXR9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnRW50ZXIgYW4gQWRkcmVzcycpfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICBzZXRBZGRyZXNzSW5wdXQoKGUubmF0aXZlRXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXJyb3I9eyEhZXJyb3J9XG4gICAgICAgICAgICBoZWxwZXJUZXh0PXtlcnJvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHt0b2tlbkRhdGEgJiYgKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IG10OiA1LCByb3dHYXA6IDEgfX0+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3QoJ1Rva2VuJyl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIHtpc1Rva2VuTWFsaWNpb3VzKHRva2VuRGF0YSkgJiYgPE1hbGljaW91c1Rva2VuV2FybmluZ0JveCAvPn1cbiAgICAgICAgICAgICAgICA8VG9rZW5DYXJkV2l0aEJhbGFuY2VcbiAgICAgICAgICAgICAgICAgIG5hbWU9e3Rva2VuRGF0YS5uYW1lfVxuICAgICAgICAgICAgICAgICAgc3ltYm9sPXt0b2tlbkRhdGEuc3ltYm9sfVxuICAgICAgICAgICAgICAgICAgaXNNYWxpY2lvdXM9e2lzVG9rZW5NYWxpY2lvdXModG9rZW5EYXRhKX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8VG9rZW5JY29uIHdpZHRoPVwiMzJweFwiIGhlaWdodD1cIjMycHhcIiBuYW1lPXt0b2tlbkRhdGEubmFtZX0gLz5cbiAgICAgICAgICAgICAgICA8L1Rva2VuQ2FyZFdpdGhCYWxhbmNlPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhZGQtY3VzdG9tLXRva2VuLWJ1dHRvblwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2FkZEN1c3RvbVRva2VufVxuICAgICAgICAgICAgICBkaXNhYmxlZD17aXNMb2FkaW5nIHx8ICEhZXJyb3I/Lmxlbmd0aCB8fCAhbmV3VG9rZW5EYXRhfVxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ0FkZCBUb2tlbicpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBBbGVydCxcbiAgQWxlcnRDb250ZW50LFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbiAgR3BwTWF5YmVJY29uLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbnRlcmZhY2UgV2FybmluZ0JveFByb3BzIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gV2FybmluZ0JveCh7IHRpdGxlLCB0ZXh0IH06IFdhcm5pbmdCb3hQcm9wcykge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIHJldHVybiAoXG4gICAgPEFsZXJ0XG4gICAgICBzZXZlcml0eT1cIndhcm5pbmdcIlxuICAgICAgaWNvbj17PEdwcE1heWJlSWNvbiBzaXplPXsyNH0gY29sb3I9e3RoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrfSAvPn1cbiAgICAgIHN4PXt7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3dhcm5pbmcubGlnaHQnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgcHg6IDIsXG4gICAgICAgIGNvbG9yOiAnY29tbW9uLmJsYWNrJyxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEFsZXJ0Q29udGVudD5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogNjAwLCBkaXNwbGF5OiAnYmxvY2snIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBzeD17eyBkaXNwbGF5OiAnYmxvY2snIH19PlxuICAgICAgICAgIHt0ZXh0fVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L0FsZXJ0Q29udGVudD5cbiAgICA8L0FsZXJ0PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIkFsZXJ0VHJpYW5nbGVJY29uIiwiQm94IiwiVG9vbHRpcCIsInVzZVRoZW1lIiwidXNlVHJhbnNsYXRpb24iLCJXYXJuaW5nQm94IiwiTWFsaWNpb3VzVG9rZW5XYXJuaW5nQm94IiwicHJvcHMiLCJ0IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwidGl0bGUiLCJ0ZXh0IiwiTWFsaWNpb3VzVG9rZW5XYXJuaW5nSWNvbiIsInNpemUiLCJ0aGVtZSIsImNvbG9yIiwicGFsZXR0ZSIsIndhcm5pbmciLCJtYWluIiwiU3RhY2siLCJUcmVuZCIsIlByb2ZpdEFuZExvc3MiLCJ1c2VTZXR0aW5nc0NvbnRleHQiLCJERUZBVUxUX0RFQ0lNQUxTIiwiUEFuZEwiLCJ2YWx1ZSIsInBlcmNlbnRhZ2UiLCJzaG93UGVyY2VudGFnZSIsImN1cnJlbmN5Rm9ybWF0dGVyIiwiRnJhZ21lbnQiLCJ0cmVuZCIsIlVwIiwiRG93biIsInRvRml4ZWQiLCJ1bmRlZmluZWQiLCJDYXJkIiwiVHlwb2dyYXBoeSIsInVzZUVmZmVjdCIsInVzZVJlZiIsInVzZVN0YXRlIiwiVG9rZW5DYXJkV2l0aEJhbGFuY2UiLCJuYW1lIiwiYmFsYW5jZURpc3BsYXlWYWx1ZSIsInN5bWJvbCIsIm9uQ2xpY2siLCJiYWxhbmNlSW5DdXJyZW5jeSIsImNoaWxkcmVuIiwiY3VycmVuY3kiLCJwcmljZUNoYW5nZXMiLCJpc01hbGljaW91cyIsImhhc05hbWVPdmVyZmxvdyIsInNldEhhc05hbWVPdmVyZmxvdyIsIm92ZXJmbG93aW5nVGV4dCIsImNoZWNrT3ZlcmZsb3ciLCJjdXJyZW50IiwidGV4dENvbnRhaW5lciIsIm9mZnNldEhlaWdodCIsInNjcm9sbEhlaWdodCIsIm9mZnNldFdpZHRoIiwic2Nyb2xsV2lkdGgiLCJzeCIsInB5IiwicHgiLCJib3JkZXJSYWRpdXMiLCJjdXJzb3IiLCJkaXJlY3Rpb24iLCJhbGlnbkl0ZW1zIiwid2lkdGgiLCJmbGV4IiwibWwiLCJqdXN0aWZ5Q29udGVudCIsImdhcCIsInBsYWNlbWVudCIsInZhcmlhbnQiLCJkaXNhYmxlSG92ZXJMaXN0ZW5lciIsImRpc2FibGVGb2N1c0xpc3RlbmVyIiwicmVmIiwiZm9udFdlaWdodCIsIm92ZXJmbG93IiwidGV4dE92ZXJmbG93Iiwid2hpdGVTcGFjZSIsIk51bWJlciIsImZsZXhEaXJlY3Rpb24iLCJ0b0xvY2FsZVN0cmluZyIsIkV4dGVuc2lvblJlcXVlc3QiLCJ1c2VDb25uZWN0aW9uQ29udGV4dCIsInVzZU5ldHdvcmtDb250ZXh0IiwidXNlTWVtbyIsInVzZUhpc3RvcnkiLCJQYWdlVGl0bGUiLCJ1c2VBbmFseXRpY3NDb250ZXh0IiwidXNlVG9rZW5zV2l0aEJhbGFuY2VzIiwiQnV0dG9uIiwiVGV4dEZpZWxkIiwidG9hc3QiLCJUb2tlbkljb24iLCJUb2tlblR5cGUiLCJpc1Rva2VuTWFsaWNpb3VzIiwiQWRkVG9rZW4iLCJyZXF1ZXN0IiwibmV0d29yayIsInRva2VucyIsImZvcmNlU2hvd1Rva2Vuc1dpdGhvdXRCYWxhbmNlcyIsImhpc3RvcnkiLCJhZGRyZXNzSW5wdXQiLCJzZXRBZGRyZXNzSW5wdXQiLCJpc0xvYWRpbmciLCJzZXRJc0xvYWRpbmciLCJuZXdUb2tlbkRhdGEiLCJzZXROZXdUb2tlbkRhdGEiLCJlcnJvciIsInNldEVycm9yIiwiY2FwdHVyZSIsImFkZEN1c3RvbVRva2VuIiwic3VjY2VzcyIsIm1ldGhvZCIsIlNFVFRJTkdTX0FERF9DVVNUT01fVE9LRU4iLCJwYXJhbXMiLCJkdXJhdGlvbiIsInN0YXR1cyIsImFkZHJlc3MiLCJnb0JhY2siLCJfZXJyIiwiZXhpc3RpbmdUb2tlbiIsImZpbmQiLCJ0b2tlbiIsInR5cGUiLCJFUkMyMCIsInRvTG93ZXJDYXNlIiwibGVuZ3RoIiwiZ2V0VG9rZW5EYXRhIiwiZGF0YSIsIlNFVFRJTkdTX0dFVF9UT0tFTl9EQVRBIiwidG9rZW5EYXRhIiwiZmxleEdyb3ciLCJwdCIsInBiIiwibXVsdGlsaW5lIiwiZnVsbFdpZHRoIiwicm93cyIsImxhYmVsIiwicGxhY2Vob2xkZXIiLCJvbkNoYW5nZSIsImUiLCJuYXRpdmVFdmVudCIsInRhcmdldCIsImhlbHBlclRleHQiLCJtdCIsInJvd0dhcCIsImhlaWdodCIsImRpc2FibGVkIiwiQWxlcnQiLCJBbGVydENvbnRlbnQiLCJHcHBNYXliZUljb24iLCJzZXZlcml0eSIsImljb24iLCJjb21tb24iLCJibGFjayIsImJhY2tncm91bmRDb2xvciIsImJvcmRlckNvbG9yIiwiZGlzcGxheSJdLCJzb3VyY2VSb290IjoiIn0=