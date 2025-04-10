"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Home_components_Portfolio_Assets_tsx"],{

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

/***/ "./src/components/common/VirtualizedList.tsx":
/*!***************************************************!*\
  !*** ./src/components/common/VirtualizedList.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-virtualized */ "./node_modules/react-virtualized/dist/es/index.js");


const VirtualizedList = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])(react_virtualized__WEBPACK_IMPORTED_MODULE_0__.List)`
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({
  theme
}) => theme.palette.divider};
    border-radius: 3px;
  }
`;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VirtualizedList);

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/Assets.tsx":
/*!********************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/Assets.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Assets": () => (/* binding */ Assets),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _TokenList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TokenList */ "./src/pages/Home/components/Portfolio/TokenList.tsx");
/* harmony import */ var _src_pages_Bridge_hooks_usePendingBridgeTransactions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/pages/Bridge/hooks/usePendingBridgeTransactions */ "./src/pages/Bridge/hooks/usePendingBridgeTransactions.ts");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _NetworkWidget_NetworksWidget__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NetworkWidget/NetworksWidget */ "./src/pages/Home/components/Portfolio/NetworkWidget/NetworksWidget.tsx");
/* harmony import */ var _src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/hooks/useTokensWithBalances */ "./src/hooks/useTokensWithBalances.ts");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_pages_Wallet_WalletRecentTxs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/pages/Wallet/WalletRecentTxs */ "./src/pages/Wallet/WalletRecentTxs.tsx");
/* harmony import */ var _src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/background/services/network/utils/isBitcoinNetwork */ "./src/background/services/network/utils/isBitcoinNetwork.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_hooks_useTokenPriceIsMissing__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/hooks/useTokenPriceIsMissing */ "./src/hooks/useTokenPriceIsMissing.ts");
/* harmony import */ var _src_components_common_ProfitAndLoss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/components/common/ProfitAndLoss */ "./src/components/common/ProfitAndLoss.tsx");
/* harmony import */ var _src_hooks_useLiveBalance__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/hooks/useLiveBalance */ "./src/hooks/useLiveBalance.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


















var AssetsTabs = /*#__PURE__*/function (AssetsTabs) {
  AssetsTabs[AssetsTabs["TOKENS"] = 0] = "TOKENS";
  AssetsTabs[AssetsTabs["ACTIVITY"] = 1] = "ACTIVITY";
  return AssetsTabs;
}(AssetsTabs || {});
const POLLED_BALANCES = [_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_14__.TokenType.NATIVE, _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_14__.TokenType.ERC20];
function Assets() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_15__.useTranslation)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__.useNetworkContext)();
  const bridgeTransactions = (0,_src_pages_Bridge_hooks_usePendingBridgeTransactions__WEBPACK_IMPORTED_MODULE_2__.usePendingBridgeTransactions)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_16__.useHistory)();
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_6__.useSettingsContext)();
  const activeNetworkAssetList = (0,_src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_5__.useTokensWithBalances)();
  const activeNetworkBalance = (0,_NetworkWidget_NetworksWidget__WEBPACK_IMPORTED_MODULE_4__.getNetworkBalance)(activeNetworkAssetList);
  const activeNetworkPriceChanges = (0,_NetworkWidget_NetworksWidget__WEBPACK_IMPORTED_MODULE_4__.getNetworkTokensPriceChanges)(activeNetworkAssetList);
  const changePercentage = activeNetworkPriceChanges.value / activeNetworkBalance * 100;
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_10__.useAnalyticsContext)();
  const {
    isPriceMissingFromNetwork
  } = (0,_src_hooks_useTokenPriceIsMissing__WEBPACK_IMPORTED_MODULE_11__.useTokenPriceMissing)();
  const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_7__.useState)(AssetsTabs.TOKENS);
  function handleChange(_, newValue) {
    setActiveTab(newValue);
    if (newValue === AssetsTabs.TOKENS) {
      capture('AssetsPageAssetsClicked');
    } else if (newValue === AssetsTabs.ACTIVITY) {
      capture('AssetsPageActivityClicked');
    }
  }
  const missingSomeTokenPrices = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(() => {
    if (!network?.chainId) {
      return;
    }
    return isPriceMissingFromNetwork(network?.chainId);
  }, [isPriceMissingFromNetwork, network]);
  (0,_src_hooks_useLiveBalance__WEBPACK_IMPORTED_MODULE_13__.useLiveBalance)(POLLED_BALANCES);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    direction: "row",
    sx: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      mt: 2,
      py: '12px',
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    direction: "row",
    alignItems: "flex-start"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.ChevronLeftIcon, {
    onClick: () => history.push('/home'),
    size: 30,
    sx: {
      cursor: 'pointer',
      mr: 1
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_3__.TokenIcon, {
    width: "24px",
    height: "24px",
    src: network?.logoUri,
    name: network?.chainName
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Typography, {
    variant: "h5",
    sx: {
      ml: 1
    }
  }, network?.chainName)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, missingSomeTokenPrices && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Tooltip, {
    title: t('The prices of some tokens are missing. The balance might not be accurate currently.'),
    placement: "bottom"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.AlertTriangleIcon, {
    size: 16,
    sx: {
      color: 'warning.main',
      mr: 1
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Typography, {
    variant: "h4"
  }, currencyFormatter(activeNetworkBalance))), /*#__PURE__*/React.createElement(_src_components_common_ProfitAndLoss__WEBPACK_IMPORTED_MODULE_12__.PAndL, {
    value: activeNetworkPriceChanges.value,
    percentage: changePercentage,
    showPercentage: true
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Box, {
    sx: {
      mx: 2,
      borderBottom: 1,
      borderColor: 'divider'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Tabs, {
    onChange: handleChange,
    value: activeTab,
    size: "medium",
    variant: "fullWidth"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Tab, {
    value: AssetsTabs.TOKENS,
    label: t('Tokens')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Tab, {
    value: AssetsTabs.ACTIVITY,
    label: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Badge, {
      badgeContent: Object.values(bridgeTransactions).length,
      color: "secondary"
    }, t('Activity'))
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.TabPanel, {
    value: activeTab,
    index: AssetsTabs.TOKENS,
    sx: {
      flexGrow: activeTab === AssetsTabs.TOKENS ? 1 : 0,
      display: 'flex'
    }
  }, network && (0,_src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_9__.isBitcoinNetwork)(network) ? /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_16__.Redirect, {
    to: '/token'
  }) : /*#__PURE__*/React.createElement(_TokenList__WEBPACK_IMPORTED_MODULE_1__.TokenList, null)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.TabPanel, {
    value: activeTab,
    index: AssetsTabs.ACTIVITY,
    sx: {
      flexGrow: activeTab === AssetsTabs.ACTIVITY ? 1 : 0,
      my: 2
    }
  }, network && (0,_src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_9__.isBitcoinNetwork)(network) ? /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_16__.Redirect, {
    to: '/token'
  }) : /*#__PURE__*/React.createElement(_src_pages_Wallet_WalletRecentTxs__WEBPACK_IMPORTED_MODULE_8__.WalletRecentTxs, null)))));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Assets);

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/TokenList.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/TokenList.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenList": () => (/* binding */ TokenList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useTokensWithBalances */ "./src/hooks/useTokensWithBalances.ts");
/* harmony import */ var _src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useSetSendDataInParams */ "./src/hooks/useSetSendDataInParams.ts");
/* harmony import */ var _TokenListItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TokenListItem */ "./src/pages/Home/components/Portfolio/TokenListItem.tsx");
/* harmony import */ var _WalletIsEmpty__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WalletIsEmpty */ "./src/pages/Home/components/Portfolio/WalletIsEmpty.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-virtualized */ "./node_modules/react-virtualized/dist/es/index.js");
/* harmony import */ var _src_components_common_VirtualizedList__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/components/common/VirtualizedList */ "./src/components/common/VirtualizedList.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_utils_normalizeBalance__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/utils/normalizeBalance */ "./src/utils/normalizeBalance.ts");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_isTokenMalicious__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/utils/isTokenMalicious */ "./src/utils/isTokenMalicious.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


















const TokenRow = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__["default"])('div')`
  padding: 0 10px 0 16px;
`;
function TokenList({
  searchQuery
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_16__.useTranslation)();
  const {
    getTokenVisibility
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_5__.useSettingsContext)();
  const tokensWithBalances = (0,_src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_1__.useTokensWithBalances)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_17__.useHistory)();
  const setSendDataInParams = (0,_src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_2__.useSetSendDataInParams)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__.useAnalyticsContext)();
  const {
    isFunctionSupported: isManageTokenSupported
  } = (0,_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_7__.useIsFunctionAvailable)(_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_7__.FunctionNames.MANAGE_TOKEN);
  const firstAsset = tokensWithBalances[0];
  const firstAssetBalance = firstAsset && 'decimals' in firstAsset ? (0,_src_utils_normalizeBalance__WEBPACK_IMPORTED_MODULE_11__.normalizeBalance)(firstAsset.balance, firstAsset.decimals) ?? new (big_js__WEBPACK_IMPORTED_MODULE_12___default())(0) : new (big_js__WEBPACK_IMPORTED_MODULE_12___default())(0);
  const hasNoFunds = tokensWithBalances.length === 1 && firstAssetBalance.eq(new (big_js__WEBPACK_IMPORTED_MODULE_12___default())(0));
  const tokens = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (searchQuery ? tokensWithBalances.filter(token => getTokenVisibility(token) && (token.name.toLowerCase().includes(searchQuery.toLowerCase()) || token.symbol.toLowerCase().includes(searchQuery.toLowerCase()))) : tokensWithBalances).filter(token => getTokenVisibility(token)).sort((a, b) => (b.balanceInCurrency ?? 0) - (a.balanceInCurrency ?? 0)), [searchQuery, tokensWithBalances, getTokenVisibility]);
  const toggleManageTokensPage = () => {
    if (history.location.pathname.startsWith('/manage-tokens')) {
      history.push('/');
      return;
    }
    history.push('/manage-tokens');
  };
  function rowRenderer({
    key,
    index,
    style
  }) {
    const token = tokens[index];
    if (!token) {
      // Token should be truthy and should not get here. Just adding this to not break the list if this happens. This will make the row just empty.
      return /*#__PURE__*/React.createElement("div", {
        style: style,
        key: key
      });
    }
    return /*#__PURE__*/React.createElement(TokenRow, {
      style: style,
      key: key
    }, /*#__PURE__*/React.createElement(_TokenListItem__WEBPACK_IMPORTED_MODULE_3__.TokenListItem, {
      "data-testid": `${token.symbol}-token-list-item-test2`,
      onClick: () => {
        setSendDataInParams({
          token: token,
          options: {
            path: '/token'
          }
        });
        capture('TokenListTokenSelected', {
          selectedToken: token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_13__.TokenType.ERC20 ? token.address : token.symbol
        });
      },
      name: token.name,
      symbol: token.symbol,
      balanceDisplayValue: token.balanceDisplayValue,
      balanceInCurrency: token.balanceInCurrency?.toString(),
      priceChanges: token.priceChanges,
      isMalicious: (0,_src_utils_isTokenMalicious__WEBPACK_IMPORTED_MODULE_14__.isTokenMalicious)(token)
    }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_10__.TokenIcon, {
      width: "32px",
      height: "32px",
      src: token.logoUri,
      name: token.name
    })));
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    sx: {
      flexGrow: 1,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    direction: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    sx: {
      mx: 2,
      my: 1
    }
  }, isManageTokenSupported && tokens.length && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Button, {
    variant: "text",
    size: "small",
    "data-testid": "manage-tokens-button",
    onClick: toggleManageTokensPage,
    sx: {
      cursor: 'pointer'
    }
  }, t('Manage'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    sx: {
      flexGrow: 1
    }
  }, hasNoFunds ? /*#__PURE__*/React.createElement(_WalletIsEmpty__WEBPACK_IMPORTED_MODULE_4__.WalletIsEmpty, null) : /*#__PURE__*/React.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_8__.AutoSizer, null, ({
    width,
    height
  }) => /*#__PURE__*/React.createElement(_src_components_common_VirtualizedList__WEBPACK_IMPORTED_MODULE_9__["default"], {
    height: height,
    rowCount: tokens.length,
    rowHeight: 72,
    rowRenderer: rowRenderer,
    width: width
  }))));
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/TokenListItem.tsx":
/*!***************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/TokenListItem.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenListItem": () => (/* binding */ TokenListItem)
/* harmony export */ });
/* harmony import */ var _src_components_common_TokenCardWithBalance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/TokenCardWithBalance */ "./src/components/common/TokenCardWithBalance.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function TokenListItem({
  name,
  symbol,
  balanceDisplayValue,
  children,
  balanceInCurrency,
  onClick,
  priceChanges,
  isMalicious
}) {
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__.useSettingsContext)();
  return /*#__PURE__*/React.createElement(_src_components_common_TokenCardWithBalance__WEBPACK_IMPORTED_MODULE_0__.TokenCardWithBalance, {
    name: name,
    symbol: symbol,
    onClick: onClick,
    balanceDisplayValue: balanceDisplayValue,
    balanceInCurrency: balanceInCurrency,
    currencyFormatter: currencyFormatter,
    priceChanges: priceChanges,
    isMalicious: isMalicious
  }, children);
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/WalletIsEmpty.tsx":
/*!***************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/WalletIsEmpty.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletIsEmpty": () => (/* binding */ WalletIsEmpty)
/* harmony export */ });
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function WalletIsEmpty() {
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useHistory)();
  const {
    isFunctionSupported: isManageTokenSupported
  } = (0,_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_0__.useIsFunctionAvailable)(_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_0__.FunctionNames.MANAGE_TOKEN);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    alignItems: "center",
    sx: {
      my: 6
    }
  }, isManageTokenSupported ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "h6",
    sx: {
      mb: 2
    }
  }, t('No assets')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    sx: {
      mb: 3
    }
  }, t('Add assets by clicking the button below')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    color: "secondary",
    onClick: e => {
      e.stopPropagation();
      history.push('/manage-tokens');
    },
    sx: {
      width: '343px'
    }
  }, t('Add assets'))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "h6",
    sx: {
      mb: 2
    }
  }, t('No assets')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    sx: {
      mb: 3
    }
  }, t('Receive assets by clicking the button below')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    color: "secondary",
    onClick: e => {
      e.stopPropagation();
      history.push('/receive');
    },
    sx: {
      width: '343px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.QRCodeIcon, {
    size: 16,
    sx: {
      mr: 1
    }
  }), t('Receive'))));
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0hvbWVfY29tcG9uZW50c19Qb3J0Zm9saW9fQXNzZXRzX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStFO0FBQzNCO0FBR1o7QUFDNEI7QUFlN0QsU0FBU1Msb0JBQW9CQSxDQUFDO0VBQ25DQyxJQUFJO0VBQ0pDLG1CQUFtQjtFQUNuQkMsTUFBTTtFQUNOQyxPQUFPO0VBQ1BDLGlCQUFpQjtFQUNqQkMsUUFBUTtFQUNSQyxpQkFBaUI7RUFDakJDLFFBQVE7RUFDUkMsWUFBWTtFQUNaQztBQUNjLENBQUMsRUFBRTtFQUNqQixNQUFNLENBQUNDLGVBQWUsRUFBRUMsa0JBQWtCLENBQUMsR0FBR2YsK0NBQVEsQ0FBQyxLQUFLLENBQUM7RUFFN0QsTUFBTWdCLGVBQWUsR0FBR2pCLDZDQUFNLENBQWtCLElBQUksQ0FBQztFQUVyREQsZ0RBQVMsQ0FBQyxNQUFNO0lBQ2QsSUFBSW1CLGFBQWEsQ0FBQ0QsZUFBZSxDQUFDRSxPQUFPLENBQUMsRUFBRTtNQUMxQ0gsa0JBQWtCLENBQUMsSUFBSSxDQUFDO01BQ3hCO0lBQ0Y7SUFDQUEsa0JBQWtCLENBQUMsS0FBSyxDQUFDO0VBQzNCLENBQUMsRUFBRSxDQUFDQyxlQUFlLENBQUMsQ0FBQztFQUVyQixNQUFNQyxhQUFhLEdBQUlFLGFBQXFDLElBQWM7SUFDeEUsSUFBSUEsYUFBYSxFQUFFO01BQ2pCLE9BQ0VBLGFBQWEsQ0FBQ0MsWUFBWSxHQUFHRCxhQUFhLENBQUNFLFlBQVksSUFDdkRGLGFBQWEsQ0FBQ0csV0FBVyxHQUFHSCxhQUFhLENBQUNJLFdBQVc7SUFFekQ7SUFDQSxPQUFPLEtBQUs7RUFDZCxDQUFDO0VBRUQsb0JBQ0VDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDL0IsNkRBQUk7SUFDSGEsT0FBTyxFQUFFQSxDQUFBLEtBQU1BLE9BQU8sSUFBSUEsT0FBTyxFQUFHO0lBQ3BDbUIsRUFBRSxFQUFFO01BQ0ZDLEVBQUUsRUFBRSxNQUFNO01BQ1ZDLEVBQUUs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QUNkQSxDQUFDLENBQUNDLGVBQWUsRUFBRTtNQUNuQjFGLE9BQU8sQ0FBQ2tCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNoQyxDQUFFO0lBQ0Z0RixFQUFFLEVBQUU7TUFBRU8sS0FBSyxFQUFFO0lBQVE7RUFBRSxHQUV0QjBELENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDVCxDQUNSLGdCQUVIbkUsS0FBQSxDQUFBQyxhQUFBLENBQUFELEtBQUEsQ0FBQTZKLFFBQUEscUJBQ0U3SixLQUFBLENBQUFDLGFBQUEsQ0FBQzVCLG1FQUFVO0lBQUMyQyxPQUFPLEVBQUMsSUFBSTtJQUFDZCxFQUFFLEVBQUU7TUFBRTRKLEVBQUUsRUFBRTtJQUFFO0VBQUUsR0FDcEMzRixDQUFDLENBQUMsV0FBVyxDQUFDLENBQ0osZUFDYm5FLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNUIsbUVBQVU7SUFBQzZCLEVBQUUsRUFBRTtNQUFFNEosRUFBRSxFQUFFO0lBQUU7RUFBRSxHQUN2QjNGLENBQUMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUN0QyxlQUNibkUsS0FBQSxDQUFBQyxhQUFBLENBQUNrSCwrREFBTTtJQUNMdkYsS0FBSyxFQUFDLFdBQVc7SUFDakI3QyxPQUFPLEVBQUdnTCxDQUFDLElBQUs7TUFDZEEsQ0FBQyxDQUFDQyxlQUFlLEVBQUU7TUFDbkIxRixPQUFPLENBQUNrQixJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzFCLENBQUU7SUFDRnRGLEVBQUUsRUFBRTtNQUFFTyxLQUFLLEVBQUU7SUFBUTtFQUFFLGdCQUV2QlQsS0FBQSxDQUFBQyxhQUFBLENBQUMySixtRUFBVTtJQUFDbkUsSUFBSSxFQUFFLEVBQUc7SUFBQ3ZGLEVBQUUsRUFBRTtNQUFFd0YsRUFBRSxFQUFFO0lBQUU7RUFBRSxFQUFHLEVBQ3RDdkIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNOLENBRVosQ0FDSztBQUVaIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkNhcmRXaXRoQmFsYW5jZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9WaXJ0dWFsaXplZExpc3QudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSG9tZS9jb21wb25lbnRzL1BvcnRmb2xpby9Bc3NldHMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSG9tZS9jb21wb25lbnRzL1BvcnRmb2xpby9Ub2tlbkxpc3QudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSG9tZS9jb21wb25lbnRzL1BvcnRmb2xpby9Ub2tlbkxpc3RJdGVtLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0hvbWUvY29tcG9uZW50cy9Qb3J0Zm9saW8vV2FsbGV0SXNFbXB0eS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FyZCwgU3RhY2ssIFRvb2x0aXAsIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgVG9rZW5XaXRoQmFsYW5jZSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbmltcG9ydCB7IFBBbmRMIH0gZnJvbSAnLi9Qcm9maXRBbmRMb3NzJztcbmltcG9ydCB7IE1hbGljaW91c1Rva2VuV2FybmluZ0ljb24gfSBmcm9tICcuL01hbGljaW91c1Rva2VuV2FybmluZyc7XG5cbmludGVyZmFjZSBUb2tlbkNhcmRQcm9wcyB7XG4gIG5hbWU6IHN0cmluZztcbiAgc3ltYm9sOiBzdHJpbmc7XG4gIGJhbGFuY2VEaXNwbGF5VmFsdWU/OiBzdHJpbmcgfCBudW1iZXI7XG4gIGNoaWxkcmVuPzogSlNYLkVsZW1lbnQ7XG4gIGJhbGFuY2VJbkN1cnJlbmN5Pzogc3RyaW5nO1xuICBvbkNsaWNrPygpOiB2b2lkO1xuICBjdXJyZW5jeUZvcm1hdHRlcj86IChiYWxhbmNlSW5DdXJyZW5jeTogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIGN1cnJlbmN5Pzogc3RyaW5nO1xuICBwcmljZUNoYW5nZXM/OiBUb2tlbldpdGhCYWxhbmNlWydwcmljZUNoYW5nZXMnXTtcbiAgaXNNYWxpY2lvdXM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVG9rZW5DYXJkV2l0aEJhbGFuY2Uoe1xuICBuYW1lLFxuICBiYWxhbmNlRGlzcGxheVZhbHVlLFxuICBzeW1ib2wsXG4gIG9uQ2xpY2ssXG4gIGJhbGFuY2VJbkN1cnJlbmN5LFxuICBjaGlsZHJlbixcbiAgY3VycmVuY3lGb3JtYXR0ZXIsXG4gIGN1cnJlbmN5LFxuICBwcmljZUNoYW5nZXMsXG4gIGlzTWFsaWNpb3VzLFxufTogVG9rZW5DYXJkUHJvcHMpIHtcbiAgY29uc3QgW2hhc05hbWVPdmVyZmxvdywgc2V0SGFzTmFtZU92ZXJmbG93XSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBvdmVyZmxvd2luZ1RleHQgPSB1c2VSZWY8SFRNTFNwYW5FbGVtZW50PihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChjaGVja092ZXJmbG93KG92ZXJmbG93aW5nVGV4dC5jdXJyZW50KSkge1xuICAgICAgc2V0SGFzTmFtZU92ZXJmbG93KHRydWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRIYXNOYW1lT3ZlcmZsb3coZmFsc2UpO1xuICB9LCBbb3ZlcmZsb3dpbmdUZXh0XSk7XG5cbiAgY29uc3QgY2hlY2tPdmVyZmxvdyA9ICh0ZXh0Q29udGFpbmVyOiBIVE1MU3BhbkVsZW1lbnQgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHRleHRDb250YWluZXIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRleHRDb250YWluZXIub2Zmc2V0SGVpZ2h0IDwgdGV4dENvbnRhaW5lci5zY3JvbGxIZWlnaHQgfHxcbiAgICAgICAgdGV4dENvbnRhaW5lci5vZmZzZXRXaWR0aCA8IHRleHRDb250YWluZXIuc2Nyb2xsV2lkdGhcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxDYXJkXG4gICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrICYmIG9uQ2xpY2soKX1cbiAgICAgIHN4PXt7XG4gICAgICAgIHB5OiAnMTBweCcsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICcxMHB4JyxcbiAgICAgICAgY3Vyc29yOiBvbkNsaWNrID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIHN4PXt7IHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBmbGV4OiAwIH19PlxuICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICA8U3RhY2sgc3g9e3sgbWw6IDIsIHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCJcbiAgICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICAgICAgc3g9e3sgd2lkdGg6ICcxMDAlJywgZ2FwOiAxIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2lzTWFsaWNpb3VzICYmIDxNYWxpY2lvdXNUb2tlbldhcm5pbmdJY29uIC8+fVxuICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgcGxhY2VtZW50PVwiYm90dG9tXCJcbiAgICAgICAgICAgICAgdGl0bGU9ezxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+e25hbWV9PC9UeXBvZ3JhcGh5Pn1cbiAgICAgICAgICAgICAgZGlzYWJsZUhvdmVyTGlzdGVuZXI9eyFoYXNOYW1lT3ZlcmZsb3d9XG4gICAgICAgICAgICAgIGRpc2FibGVGb2N1c0xpc3RlbmVyPXshaGFzTmFtZU92ZXJmbG93fVxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBvbkNsaWNrID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHJlZj17b3ZlcmZsb3dpbmdUZXh0fVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJoNlwiXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodD1cImZvbnRXZWlnaHRTZW1pYm9sZFwiXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7bmFtZX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICAge2JhbGFuY2VJbkN1cnJlbmN5ICYmIChcbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAgICAgICAge2N1cnJlbmN5Rm9ybWF0dGVyXG4gICAgICAgICAgICAgICAgICA/IGN1cnJlbmN5Rm9ybWF0dGVyKE51bWJlcihiYWxhbmNlSW5DdXJyZW5jeSkpXG4gICAgICAgICAgICAgICAgICA6IGJhbGFuY2VJbkN1cnJlbmN5fVxuICAgICAgICAgICAgICAgIHtjdXJyZW5jeSAmJiBgICR7Y3VycmVuY3l9YH1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLCBmbGV4RGlyZWN0aW9uOiAncm93JyB9fT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAgICAgICAge2JhbGFuY2VEaXNwbGF5VmFsdWU/LnRvTG9jYWxlU3RyaW5nKCl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICBtbDogYmFsYW5jZURpc3BsYXlWYWx1ZSAhPT0gdW5kZWZpbmVkID8gMC40IDogMCxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7c3ltYm9sfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAge3ByaWNlQ2hhbmdlcyAmJiAoXG4gICAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgICA8UEFuZExcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtwcmljZUNoYW5nZXMudmFsdWV9XG4gICAgICAgICAgICAgICAgICBwZXJjZW50YWdlPXtwcmljZUNoYW5nZXMucGVyY2VudGFnZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L0NhcmQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBzdHlsZWQgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgTGlzdCB9IGZyb20gJ3JlYWN0LXZpcnR1YWxpemVkJztcblxuY29uc3QgVmlydHVhbGl6ZWRMaXN0ID0gc3R5bGVkKExpc3QpYFxuICAmOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgd2lkdGg6IDZweDtcbiAgfVxuICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZDogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5wYWxldHRlLmRpdmlkZXJ9O1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgfVxuYDtcbmV4cG9ydCBkZWZhdWx0IFZpcnR1YWxpemVkTGlzdDtcbiIsImltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IFRva2VuTGlzdCB9IGZyb20gJy4vVG9rZW5MaXN0JztcbmltcG9ydCB7IHVzZVBlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbnMgfSBmcm9tICdAc3JjL3BhZ2VzL0JyaWRnZS9ob29rcy91c2VQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb25zJztcbmltcG9ydCB7XG4gIEFsZXJ0VHJpYW5nbGVJY29uLFxuICBCYWRnZSxcbiAgQm94LFxuICBDaGV2cm9uTGVmdEljb24sXG4gIFN0YWNrLFxuICBUYWIsXG4gIFRhYlBhbmVsLFxuICBUYWJzLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUmVkaXJlY3QsIHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IFRva2VuSWNvbiB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vVG9rZW5JY29uJztcbmltcG9ydCB7XG4gIGdldE5ldHdvcmtCYWxhbmNlLFxuICBnZXROZXR3b3JrVG9rZW5zUHJpY2VDaGFuZ2VzLFxufSBmcm9tICcuL05ldHdvcmtXaWRnZXQvTmV0d29ya3NXaWRnZXQnO1xuaW1wb3J0IHsgdXNlVG9rZW5zV2l0aEJhbGFuY2VzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VUb2tlbnNXaXRoQmFsYW5jZXMnO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgV2FsbGV0UmVjZW50VHhzIH0gZnJvbSAnQHNyYy9wYWdlcy9XYWxsZXQvV2FsbGV0UmVjZW50VHhzJztcbmltcG9ydCB7IGlzQml0Y29pbk5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0JpdGNvaW5OZXR3b3JrJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZVRva2VuUHJpY2VNaXNzaW5nIH0gZnJvbSAnQHNyYy9ob29rcy91c2VUb2tlblByaWNlSXNNaXNzaW5nJztcbmltcG9ydCB7IFBBbmRMIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Qcm9maXRBbmRMb3NzJztcbmltcG9ydCB7IHVzZUxpdmVCYWxhbmNlIH0gZnJvbSAnQHNyYy9ob29rcy91c2VMaXZlQmFsYW5jZSc7XG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5lbnVtIEFzc2V0c1RhYnMge1xuICBUT0tFTlMsXG4gIEFDVElWSVRZLFxufVxuXG5jb25zdCBQT0xMRURfQkFMQU5DRVMgPSBbVG9rZW5UeXBlLk5BVElWRSwgVG9rZW5UeXBlLkVSQzIwXTtcblxuZXhwb3J0IGZ1bmN0aW9uIEFzc2V0cygpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IG5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IGJyaWRnZVRyYW5zYWN0aW9ucyA9IHVzZVBlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbnMoKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcbiAgY29uc3QgeyBjdXJyZW5jeUZvcm1hdHRlciB9ID0gdXNlU2V0dGluZ3NDb250ZXh0KCk7XG4gIGNvbnN0IGFjdGl2ZU5ldHdvcmtBc3NldExpc3QgPSB1c2VUb2tlbnNXaXRoQmFsYW5jZXMoKTtcbiAgY29uc3QgYWN0aXZlTmV0d29ya0JhbGFuY2UgPSBnZXROZXR3b3JrQmFsYW5jZShhY3RpdmVOZXR3b3JrQXNzZXRMaXN0KTtcbiAgY29uc3QgYWN0aXZlTmV0d29ya1ByaWNlQ2hhbmdlcyA9IGdldE5ldHdvcmtUb2tlbnNQcmljZUNoYW5nZXMoXG4gICAgYWN0aXZlTmV0d29ya0Fzc2V0TGlzdCxcbiAgKTtcblxuICBjb25zdCBjaGFuZ2VQZXJjZW50YWdlID1cbiAgICAoYWN0aXZlTmV0d29ya1ByaWNlQ2hhbmdlcy52YWx1ZSAvIGFjdGl2ZU5ldHdvcmtCYWxhbmNlKSAqIDEwMDtcblxuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgeyBpc1ByaWNlTWlzc2luZ0Zyb21OZXR3b3JrIH0gPSB1c2VUb2tlblByaWNlTWlzc2luZygpO1xuXG4gIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSB1c2VTdGF0ZTxudW1iZXI+KEFzc2V0c1RhYnMuVE9LRU5TKTtcblxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoXzogUmVhY3QuU3ludGhldGljRXZlbnQsIG5ld1ZhbHVlOiBudW1iZXIpIHtcbiAgICBzZXRBY3RpdmVUYWIobmV3VmFsdWUpO1xuICAgIGlmIChuZXdWYWx1ZSA9PT0gQXNzZXRzVGFicy5UT0tFTlMpIHtcbiAgICAgIGNhcHR1cmUoJ0Fzc2V0c1BhZ2VBc3NldHNDbGlja2VkJyk7XG4gICAgfSBlbHNlIGlmIChuZXdWYWx1ZSA9PT0gQXNzZXRzVGFicy5BQ1RJVklUWSkge1xuICAgICAgY2FwdHVyZSgnQXNzZXRzUGFnZUFjdGl2aXR5Q2xpY2tlZCcpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG1pc3NpbmdTb21lVG9rZW5QcmljZXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIW5ldHdvcms/LmNoYWluSWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGlzUHJpY2VNaXNzaW5nRnJvbU5ldHdvcmsobmV0d29yaz8uY2hhaW5JZCk7XG4gIH0sIFtpc1ByaWNlTWlzc2luZ0Zyb21OZXR3b3JrLCBuZXR3b3JrXSk7XG5cbiAgdXNlTGl2ZUJhbGFuY2UoUE9MTEVEX0JBTEFOQ0VTKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgIDxTdGFja1xuICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICBzeD17e1xuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1zdGFydCcsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBtdDogMixcbiAgICAgICAgICBweTogJzEycHgnLFxuICAgICAgICAgIHB4OiAyLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgYWxpZ25JdGVtcz1cImZsZXgtc3RhcnRcIj5cbiAgICAgICAgICA8Q2hldnJvbkxlZnRJY29uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoaXN0b3J5LnB1c2goJy9ob21lJyl9XG4gICAgICAgICAgICBzaXplPXszMH1cbiAgICAgICAgICAgIHN4PXt7IGN1cnNvcjogJ3BvaW50ZXInLCBtcjogMSB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUb2tlbkljb25cbiAgICAgICAgICAgICAgICB3aWR0aD1cIjI0cHhcIlxuICAgICAgICAgICAgICAgIGhlaWdodD1cIjI0cHhcIlxuICAgICAgICAgICAgICAgIHNyYz17bmV0d29yaz8ubG9nb1VyaX1cbiAgICAgICAgICAgICAgICBuYW1lPXtuZXR3b3JrPy5jaGFpbk5hbWV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiIHN4PXt7IG1sOiAxIH19PlxuICAgICAgICAgICAgICAgIHtuZXR3b3JrPy5jaGFpbk5hbWV9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICAgIHttaXNzaW5nU29tZVRva2VuUHJpY2VzICYmIChcbiAgICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgICAgdGl0bGU9e3QoXG4gICAgICAgICAgICAgICAgICAgICdUaGUgcHJpY2VzIG9mIHNvbWUgdG9rZW5zIGFyZSBtaXNzaW5nLiBUaGUgYmFsYW5jZSBtaWdodCBub3QgYmUgYWNjdXJhdGUgY3VycmVudGx5LicsXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgcGxhY2VtZW50PVwiYm90dG9tXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8QWxlcnRUcmlhbmdsZUljb25cbiAgICAgICAgICAgICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAnd2FybmluZy5tYWluJywgbXI6IDEgfX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDRcIj5cbiAgICAgICAgICAgICAgICB7Y3VycmVuY3lGb3JtYXR0ZXIoYWN0aXZlTmV0d29ya0JhbGFuY2UpfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPFBBbmRMXG4gICAgICAgICAgICAgIHZhbHVlPXthY3RpdmVOZXR3b3JrUHJpY2VDaGFuZ2VzLnZhbHVlfVxuICAgICAgICAgICAgICBwZXJjZW50YWdlPXtjaGFuZ2VQZXJjZW50YWdlfVxuICAgICAgICAgICAgICBzaG93UGVyY2VudGFnZVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAgPEJveCBzeD17eyBteDogMiwgYm9yZGVyQm90dG9tOiAxLCBib3JkZXJDb2xvcjogJ2RpdmlkZXInIH19PlxuICAgICAgICAgIDxUYWJzXG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgdmFsdWU9e2FjdGl2ZVRhYn1cbiAgICAgICAgICAgIHNpemU9XCJtZWRpdW1cIlxuICAgICAgICAgICAgdmFyaWFudD1cImZ1bGxXaWR0aFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFRhYiB2YWx1ZT17QXNzZXRzVGFicy5UT0tFTlN9IGxhYmVsPXt0KCdUb2tlbnMnKX0gLz5cbiAgICAgICAgICAgIDxUYWJcbiAgICAgICAgICAgICAgdmFsdWU9e0Fzc2V0c1RhYnMuQUNUSVZJVFl9XG4gICAgICAgICAgICAgIGxhYmVsPXtcbiAgICAgICAgICAgICAgICA8QmFkZ2VcbiAgICAgICAgICAgICAgICAgIGJhZGdlQ29udGVudD17T2JqZWN0LnZhbHVlcyhicmlkZ2VUcmFuc2FjdGlvbnMpLmxlbmd0aH1cbiAgICAgICAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dCgnQWN0aXZpdHknKX1cbiAgICAgICAgICAgICAgICA8L0JhZGdlPlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvVGFicz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAgICA8VGFiUGFuZWxcbiAgICAgICAgICAgIHZhbHVlPXthY3RpdmVUYWJ9XG4gICAgICAgICAgICBpbmRleD17QXNzZXRzVGFicy5UT0tFTlN9XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBmbGV4R3JvdzogYWN0aXZlVGFiID09PSBBc3NldHNUYWJzLlRPS0VOUyA/IDEgOiAwLFxuICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtuZXR3b3JrICYmIGlzQml0Y29pbk5ldHdvcmsobmV0d29yaykgPyAoXG4gICAgICAgICAgICAgIDxSZWRpcmVjdCB0bz17Jy90b2tlbid9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8VG9rZW5MaXN0IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgPFRhYlBhbmVsXG4gICAgICAgICAgICB2YWx1ZT17YWN0aXZlVGFifVxuICAgICAgICAgICAgaW5kZXg9e0Fzc2V0c1RhYnMuQUNUSVZJVFl9XG4gICAgICAgICAgICBzeD17eyBmbGV4R3JvdzogYWN0aXZlVGFiID09PSBBc3NldHNUYWJzLkFDVElWSVRZID8gMSA6IDAsIG15OiAyIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge25ldHdvcmsgJiYgaXNCaXRjb2luTmV0d29yayhuZXR3b3JrKSA/IChcbiAgICAgICAgICAgICAgPFJlZGlyZWN0IHRvPXsnL3Rva2VuJ30gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxXYWxsZXRSZWNlbnRUeHMgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgQXNzZXRzO1xuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRva2Vuc1dpdGhCYWxhbmNlcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlVG9rZW5zV2l0aEJhbGFuY2VzJztcbmltcG9ydCB7IHVzZVNldFNlbmREYXRhSW5QYXJhbXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVNldFNlbmREYXRhSW5QYXJhbXMnO1xuaW1wb3J0IHsgVG9rZW5MaXN0SXRlbSB9IGZyb20gJy4vVG9rZW5MaXN0SXRlbSc7XG5pbXBvcnQgeyBXYWxsZXRJc0VtcHR5IH0gZnJvbSAnLi9XYWxsZXRJc0VtcHR5JztcbmltcG9ydCB7IHVzZVNldHRpbmdzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvU2V0dGluZ3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQge1xuICBGdW5jdGlvbk5hbWVzLFxuICB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlLFxufSBmcm9tICdAc3JjL2hvb2tzL3VzZUlzRnVuY3Rpb25BdmFpbGFibGUnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IEF1dG9TaXplciB9IGZyb20gJ3JlYWN0LXZpcnR1YWxpemVkJztcbmltcG9ydCBWaXJ0dWFsaXplZExpc3QgZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9WaXJ0dWFsaXplZExpc3QnO1xuaW1wb3J0IHsgQnV0dG9uLCBTdGFjaywgc3R5bGVkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFRva2VuSWNvbiB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vVG9rZW5JY29uJztcbmltcG9ydCB7IG5vcm1hbGl6ZUJhbGFuY2UgfSBmcm9tICdAc3JjL3V0aWxzL25vcm1hbGl6ZUJhbGFuY2UnO1xuaW1wb3J0IEJpZyBmcm9tICdiaWcuanMnO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IGlzVG9rZW5NYWxpY2lvdXMgfSBmcm9tICdAc3JjL3V0aWxzL2lzVG9rZW5NYWxpY2lvdXMnO1xuXG5jb25zdCBUb2tlblJvdyA9IHN0eWxlZCgnZGl2JylgXG4gIHBhZGRpbmc6IDAgMTBweCAwIDE2cHg7XG5gO1xuXG5pbnRlcmZhY2UgVG9rZW5MaXN0UHJvcHMge1xuICBzZWFyY2hRdWVyeT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRva2VuTGlzdCh7IHNlYXJjaFF1ZXJ5IH06IFRva2VuTGlzdFByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBnZXRUb2tlblZpc2liaWxpdHkgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICBjb25zdCB0b2tlbnNXaXRoQmFsYW5jZXMgPSB1c2VUb2tlbnNXaXRoQmFsYW5jZXMoKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcbiAgY29uc3Qgc2V0U2VuZERhdGFJblBhcmFtcyA9IHVzZVNldFNlbmREYXRhSW5QYXJhbXMoKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IHsgaXNGdW5jdGlvblN1cHBvcnRlZDogaXNNYW5hZ2VUb2tlblN1cHBvcnRlZCB9ID1cbiAgICB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlKEZ1bmN0aW9uTmFtZXMuTUFOQUdFX1RPS0VOKTtcblxuICBjb25zdCBmaXJzdEFzc2V0ID0gdG9rZW5zV2l0aEJhbGFuY2VzWzBdO1xuICBjb25zdCBmaXJzdEFzc2V0QmFsYW5jZSA9XG4gICAgZmlyc3RBc3NldCAmJiAnZGVjaW1hbHMnIGluIGZpcnN0QXNzZXRcbiAgICAgID8gKG5vcm1hbGl6ZUJhbGFuY2UoZmlyc3RBc3NldC5iYWxhbmNlLCBmaXJzdEFzc2V0LmRlY2ltYWxzKSA/P1xuICAgICAgICBuZXcgQmlnKDApKVxuICAgICAgOiBuZXcgQmlnKDApO1xuICBjb25zdCBoYXNOb0Z1bmRzID1cbiAgICB0b2tlbnNXaXRoQmFsYW5jZXMubGVuZ3RoID09PSAxICYmIGZpcnN0QXNzZXRCYWxhbmNlLmVxKG5ldyBCaWcoMCkpO1xuXG4gIGNvbnN0IHRva2VucyA9IHVzZU1lbW8oXG4gICAgKCkgPT5cbiAgICAgIChzZWFyY2hRdWVyeVxuICAgICAgICA/IHRva2Vuc1dpdGhCYWxhbmNlcy5maWx0ZXIoXG4gICAgICAgICAgICAodG9rZW4pID0+XG4gICAgICAgICAgICAgIGdldFRva2VuVmlzaWJpbGl0eSh0b2tlbikgJiZcbiAgICAgICAgICAgICAgKHRva2VuLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICAgICAgICAgIHRva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCkpKSxcbiAgICAgICAgICApXG4gICAgICAgIDogdG9rZW5zV2l0aEJhbGFuY2VzXG4gICAgICApXG4gICAgICAgIC5maWx0ZXIoKHRva2VuKSA9PiBnZXRUb2tlblZpc2liaWxpdHkodG9rZW4pKVxuICAgICAgICAuc29ydChcbiAgICAgICAgICAoYSwgYikgPT4gKGIuYmFsYW5jZUluQ3VycmVuY3kgPz8gMCkgLSAoYS5iYWxhbmNlSW5DdXJyZW5jeSA/PyAwKSxcbiAgICAgICAgKSxcbiAgICBbc2VhcmNoUXVlcnksIHRva2Vuc1dpdGhCYWxhbmNlcywgZ2V0VG9rZW5WaXNpYmlsaXR5XSxcbiAgKTtcblxuICBjb25zdCB0b2dnbGVNYW5hZ2VUb2tlbnNQYWdlID0gKCkgPT4ge1xuICAgIGlmIChoaXN0b3J5LmxvY2F0aW9uLnBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9tYW5hZ2UtdG9rZW5zJykpIHtcbiAgICAgIGhpc3RvcnkucHVzaCgnLycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoaXN0b3J5LnB1c2goJy9tYW5hZ2UtdG9rZW5zJyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcm93UmVuZGVyZXIoeyBrZXksIGluZGV4LCBzdHlsZSB9KSB7XG4gICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaW5kZXhdO1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIC8vIFRva2VuIHNob3VsZCBiZSB0cnV0aHkgYW5kIHNob3VsZCBub3QgZ2V0IGhlcmUuIEp1c3QgYWRkaW5nIHRoaXMgdG8gbm90IGJyZWFrIHRoZSBsaXN0IGlmIHRoaXMgaGFwcGVucy4gVGhpcyB3aWxsIG1ha2UgdGhlIHJvdyBqdXN0IGVtcHR5LlxuICAgICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfSBrZXk9e2tleX0+PC9kaXY+O1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPFRva2VuUm93IHN0eWxlPXtzdHlsZX0ga2V5PXtrZXl9PlxuICAgICAgICA8VG9rZW5MaXN0SXRlbVxuICAgICAgICAgIGRhdGEtdGVzdGlkPXtgJHt0b2tlbi5zeW1ib2x9LXRva2VuLWxpc3QtaXRlbS10ZXN0MmB9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgc2V0U2VuZERhdGFJblBhcmFtcyh7XG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgb3B0aW9uczogeyBwYXRoOiAnL3Rva2VuJyB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjYXB0dXJlKCdUb2tlbkxpc3RUb2tlblNlbGVjdGVkJywge1xuICAgICAgICAgICAgICBzZWxlY3RlZFRva2VuOlxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5FUkMyMCA/IHRva2VuLmFkZHJlc3MgOiB0b2tlbi5zeW1ib2wsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG5hbWU9e3Rva2VuLm5hbWV9XG4gICAgICAgICAgc3ltYm9sPXt0b2tlbi5zeW1ib2x9XG4gICAgICAgICAgYmFsYW5jZURpc3BsYXlWYWx1ZT17dG9rZW4uYmFsYW5jZURpc3BsYXlWYWx1ZX1cbiAgICAgICAgICBiYWxhbmNlSW5DdXJyZW5jeT17dG9rZW4uYmFsYW5jZUluQ3VycmVuY3k/LnRvU3RyaW5nKCl9XG4gICAgICAgICAgcHJpY2VDaGFuZ2VzPXt0b2tlbi5wcmljZUNoYW5nZXN9XG4gICAgICAgICAgaXNNYWxpY2lvdXM9e2lzVG9rZW5NYWxpY2lvdXModG9rZW4pfVxuICAgICAgICA+XG4gICAgICAgICAgPFRva2VuSWNvblxuICAgICAgICAgICAgd2lkdGg9XCIzMnB4XCJcbiAgICAgICAgICAgIGhlaWdodD1cIjMycHhcIlxuICAgICAgICAgICAgc3JjPXt0b2tlbi5sb2dvVXJpfVxuICAgICAgICAgICAgbmFtZT17dG9rZW4ubmFtZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1Rva2VuTGlzdEl0ZW0+XG4gICAgICA8L1Rva2VuUm93PlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSwgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgPFN0YWNrXG4gICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICBqdXN0aWZ5Q29udGVudD1cImZsZXgtZW5kXCJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBteDogMixcbiAgICAgICAgICBteTogMSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge2lzTWFuYWdlVG9rZW5TdXBwb3J0ZWQgJiYgdG9rZW5zLmxlbmd0aCAmJiAoXG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWFuYWdlLXRva2Vucy1idXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlTWFuYWdlVG9rZW5zUGFnZX1cbiAgICAgICAgICAgIHN4PXt7IGN1cnNvcjogJ3BvaW50ZXInIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ01hbmFnZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICApfVxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAge2hhc05vRnVuZHMgPyAoXG4gICAgICAgICAgPFdhbGxldElzRW1wdHkgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8QXV0b1NpemVyPlxuICAgICAgICAgICAgeyh7IHdpZHRoLCBoZWlnaHQgfSkgPT4gKFxuICAgICAgICAgICAgICA8VmlydHVhbGl6ZWRMaXN0XG4gICAgICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICAgICAgcm93Q291bnQ9e3Rva2Vucy5sZW5ndGh9XG4gICAgICAgICAgICAgICAgcm93SGVpZ2h0PXs3Mn1cbiAgICAgICAgICAgICAgICByb3dSZW5kZXJlcj17cm93UmVuZGVyZXJ9XG4gICAgICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0F1dG9TaXplcj5cbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFRva2VuQ2FyZFdpdGhCYWxhbmNlIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkNhcmRXaXRoQmFsYW5jZSc7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuXG5pbnRlcmZhY2UgVG9rZW5MaXN0SXRlbVByb3BzIHtcbiAgbmFtZTogc3RyaW5nO1xuICBzeW1ib2w6IHN0cmluZztcbiAgYmFsYW5jZURpc3BsYXlWYWx1ZT86IHN0cmluZztcbiAgY2hpbGRyZW46IGFueTtcbiAgYmFsYW5jZUluQ3VycmVuY3k/OiBzdHJpbmc7XG4gIG9uQ2xpY2soKTogdm9pZDtcbiAgcHJpY2VDaGFuZ2VzPzoge1xuICAgIHBlcmNlbnRhZ2U/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgdmFsdWU/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIH07XG4gIGlzTWFsaWNpb3VzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRva2VuTGlzdEl0ZW0oe1xuICBuYW1lLFxuICBzeW1ib2wsXG4gIGJhbGFuY2VEaXNwbGF5VmFsdWUsXG4gIGNoaWxkcmVuLFxuICBiYWxhbmNlSW5DdXJyZW5jeSxcbiAgb25DbGljayxcbiAgcHJpY2VDaGFuZ2VzLFxuICBpc01hbGljaW91cyxcbn06IFRva2VuTGlzdEl0ZW1Qcm9wcykge1xuICBjb25zdCB7IGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgcmV0dXJuIChcbiAgICA8VG9rZW5DYXJkV2l0aEJhbGFuY2VcbiAgICAgIG5hbWU9e25hbWV9XG4gICAgICBzeW1ib2w9e3N5bWJvbH1cbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICBiYWxhbmNlRGlzcGxheVZhbHVlPXtiYWxhbmNlRGlzcGxheVZhbHVlfVxuICAgICAgYmFsYW5jZUluQ3VycmVuY3k9e2JhbGFuY2VJbkN1cnJlbmN5fVxuICAgICAgY3VycmVuY3lGb3JtYXR0ZXI9e2N1cnJlbmN5Rm9ybWF0dGVyfVxuICAgICAgcHJpY2VDaGFuZ2VzPXtwcmljZUNoYW5nZXN9XG4gICAgICBpc01hbGljaW91cz17aXNNYWxpY2lvdXN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvVG9rZW5DYXJkV2l0aEJhbGFuY2U+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBGdW5jdGlvbk5hbWVzLFxuICB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlLFxufSBmcm9tICdAc3JjL2hvb2tzL3VzZUlzRnVuY3Rpb25BdmFpbGFibGUnO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgUVJDb2RlSWNvbixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBXYWxsZXRJc0VtcHR5KCkge1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7IGlzRnVuY3Rpb25TdXBwb3J0ZWQ6IGlzTWFuYWdlVG9rZW5TdXBwb3J0ZWQgfSA9XG4gICAgdXNlSXNGdW5jdGlvbkF2YWlsYWJsZShGdW5jdGlvbk5hbWVzLk1BTkFHRV9UT0tFTik7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgc3g9e3tcbiAgICAgICAgbXk6IDYsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtpc01hbmFnZVRva2VuU3VwcG9ydGVkID8gKFxuICAgICAgICA8PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNlwiIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAge3QoJ05vIGFzc2V0cycpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtYjogMyB9fT5cbiAgICAgICAgICAgIHt0KCdBZGQgYXNzZXRzIGJ5IGNsaWNraW5nIHRoZSBidXR0b24gYmVsb3cnKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoKCcvbWFuYWdlLXRva2VucycpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHN4PXt7IHdpZHRoOiAnMzQzcHgnIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ0FkZCBhc3NldHMnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC8+XG4gICAgICApIDogKFxuICAgICAgICA8PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNlwiIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAge3QoJ05vIGFzc2V0cycpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtYjogMyB9fT5cbiAgICAgICAgICAgIHt0KCdSZWNlaXZlIGFzc2V0cyBieSBjbGlja2luZyB0aGUgYnV0dG9uIGJlbG93Jyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGhpc3RvcnkucHVzaCgnL3JlY2VpdmUnKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBzeD17eyB3aWR0aDogJzM0M3B4JyB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxRUkNvZGVJY29uIHNpemU9ezE2fSBzeD17eyBtcjogMSB9fSAvPlxuICAgICAgICAgICAge3QoJ1JlY2VpdmUnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiQ2FyZCIsIlN0YWNrIiwiVG9vbHRpcCIsIlR5cG9ncmFwaHkiLCJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsIlBBbmRMIiwiTWFsaWNpb3VzVG9rZW5XYXJuaW5nSWNvbiIsIlRva2VuQ2FyZFdpdGhCYWxhbmNlIiwibmFtZSIsImJhbGFuY2VEaXNwbGF5VmFsdWUiLCJzeW1ib2wiLCJvbkNsaWNrIiwiYmFsYW5jZUluQ3VycmVuY3kiLCJjaGlsZHJlbiIsImN1cnJlbmN5Rm9ybWF0dGVyIiwiY3VycmVuY3kiLCJwcmljZUNoYW5nZXMiLCJpc01hbGljaW91cyIsImhhc05hbWVPdmVyZmxvdyIsInNldEhhc05hbWVPdmVyZmxvdyIsIm92ZXJmbG93aW5nVGV4dCIsImNoZWNrT3ZlcmZsb3ciLCJjdXJyZW50IiwidGV4dENvbnRhaW5lciIsIm9mZnNldEhlaWdodCIsInNjcm9sbEhlaWdodCIsIm9mZnNldFdpZHRoIiwic2Nyb2xsV2lkdGgiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzeCIsInB5IiwicHgiLCJib3JkZXJSYWRpdXMiLCJjdXJzb3IiLCJkaXJlY3Rpb24iLCJhbGlnbkl0ZW1zIiwid2lkdGgiLCJmbGV4IiwibWwiLCJqdXN0aWZ5Q29udGVudCIsImdhcCIsInBsYWNlbWVudCIsInRpdGxlIiwidmFyaWFudCIsImRpc2FibGVIb3Zlckxpc3RlbmVyIiwiZGlzYWJsZUZvY3VzTGlzdGVuZXIiLCJyZWYiLCJmb250V2VpZ2h0Iiwib3ZlcmZsb3ciLCJ0ZXh0T3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwiTnVtYmVyIiwiZmxleERpcmVjdGlvbiIsInRvTG9jYWxlU3RyaW5nIiwidW5kZWZpbmVkIiwiY29sb3IiLCJ2YWx1ZSIsInBlcmNlbnRhZ2UiLCJzdHlsZWQiLCJMaXN0IiwiVmlydHVhbGl6ZWRMaXN0IiwidGhlbWUiLCJwYWxldHRlIiwiZGl2aWRlciIsInVzZU5ldHdvcmtDb250ZXh0IiwidXNlVHJhbnNsYXRpb24iLCJUb2tlbkxpc3QiLCJ1c2VQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb25zIiwiQWxlcnRUcmlhbmdsZUljb24iLCJCYWRnZSIsIkJveCIsIkNoZXZyb25MZWZ0SWNvbiIsIlRhYiIsIlRhYlBhbmVsIiwiVGFicyIsIlJlZGlyZWN0IiwidXNlSGlzdG9yeSIsIlRva2VuSWNvbiIsImdldE5ldHdvcmtCYWxhbmNlIiwiZ2V0TmV0d29ya1Rva2Vuc1ByaWNlQ2hhbmdlcyIsInVzZVRva2Vuc1dpdGhCYWxhbmNlcyIsInVzZVNldHRpbmdzQ29udGV4dCIsInVzZU1lbW8iLCJXYWxsZXRSZWNlbnRUeHMiLCJpc0JpdGNvaW5OZXR3b3JrIiwidXNlQW5hbHl0aWNzQ29udGV4dCIsInVzZVRva2VuUHJpY2VNaXNzaW5nIiwidXNlTGl2ZUJhbGFuY2UiLCJUb2tlblR5cGUiLCJBc3NldHNUYWJzIiwiUE9MTEVEX0JBTEFOQ0VTIiwiTkFUSVZFIiwiRVJDMjAiLCJBc3NldHMiLCJ0IiwibmV0d29yayIsImJyaWRnZVRyYW5zYWN0aW9ucyIsImhpc3RvcnkiLCJhY3RpdmVOZXR3b3JrQXNzZXRMaXN0IiwiYWN0aXZlTmV0d29ya0JhbGFuY2UiLCJhY3RpdmVOZXR3b3JrUHJpY2VDaGFuZ2VzIiwiY2hhbmdlUGVyY2VudGFnZSIsImNhcHR1cmUiLCJpc1ByaWNlTWlzc2luZ0Zyb21OZXR3b3JrIiwiYWN0aXZlVGFiIiwic2V0QWN0aXZlVGFiIiwiVE9LRU5TIiwiaGFuZGxlQ2hhbmdlIiwiXyIsIm5ld1ZhbHVlIiwiQUNUSVZJVFkiLCJtaXNzaW5nU29tZVRva2VuUHJpY2VzIiwiY2hhaW5JZCIsImZsZXhHcm93IiwibXQiLCJwdXNoIiwic2l6ZSIsIm1yIiwiaGVpZ2h0Iiwic3JjIiwibG9nb1VyaSIsImNoYWluTmFtZSIsInNob3dQZXJjZW50YWdlIiwibXgiLCJib3JkZXJCb3R0b20iLCJib3JkZXJDb2xvciIsIm9uQ2hhbmdlIiwibGFiZWwiLCJiYWRnZUNvbnRlbnQiLCJPYmplY3QiLCJ2YWx1ZXMiLCJsZW5ndGgiLCJpbmRleCIsImRpc3BsYXkiLCJ0byIsIm15IiwidXNlU2V0U2VuZERhdGFJblBhcmFtcyIsIlRva2VuTGlzdEl0ZW0iLCJXYWxsZXRJc0VtcHR5IiwiRnVuY3Rpb25OYW1lcyIsInVzZUlzRnVuY3Rpb25BdmFpbGFibGUiLCJBdXRvU2l6ZXIiLCJCdXR0b24iLCJub3JtYWxpemVCYWxhbmNlIiwiQmlnIiwiaXNUb2tlbk1hbGljaW91cyIsIlRva2VuUm93Iiwic2VhcmNoUXVlcnkiLCJnZXRUb2tlblZpc2liaWxpdHkiLCJ0b2tlbnNXaXRoQmFsYW5jZXMiLCJzZXRTZW5kRGF0YUluUGFyYW1zIiwiaXNGdW5jdGlvblN1cHBvcnRlZCIsImlzTWFuYWdlVG9rZW5TdXBwb3J0ZWQiLCJNQU5BR0VfVE9LRU4iLCJmaXJzdEFzc2V0IiwiZmlyc3RBc3NldEJhbGFuY2UiLCJiYWxhbmNlIiwiZGVjaW1hbHMiLCJoYXNOb0Z1bmRzIiwiZXEiLCJ0b2tlbnMiLCJmaWx0ZXIiLCJ0b2tlbiIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJzb3J0IiwiYSIsImIiLCJ0b2dnbGVNYW5hZ2VUb2tlbnNQYWdlIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInN0YXJ0c1dpdGgiLCJyb3dSZW5kZXJlciIsImtleSIsInN0eWxlIiwib3B0aW9ucyIsInBhdGgiLCJzZWxlY3RlZFRva2VuIiwidHlwZSIsImFkZHJlc3MiLCJ0b1N0cmluZyIsInJvd0NvdW50Iiwicm93SGVpZ2h0IiwiUVJDb2RlSWNvbiIsIkZyYWdtZW50IiwibWIiLCJlIiwic3RvcFByb3BhZ2F0aW9uIl0sInNvdXJjZVJvb3QiOiIifQ==