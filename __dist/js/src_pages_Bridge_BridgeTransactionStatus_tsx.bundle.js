"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Bridge_BridgeTransactionStatus_tsx"],{

/***/ "./src/background/services/network/events/networkUpdatedEventListener.ts":
/*!*******************************************************************************!*\
  !*** ./src/background/services/network/events/networkUpdatedEventListener.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "networkUpdatedEventListener": () => (/* binding */ networkUpdatedEventListener)
/* harmony export */ });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ "./src/background/services/network/models.ts");

function networkUpdatedEventListener(evt) {
  return evt.name === _models__WEBPACK_IMPORTED_MODULE_0__.NetworkEvents.NETWORK_UPDATE_EVENT;
}

/***/ }),

/***/ "./src/components/common/ConfirmationTracker.tsx":
/*!*******************************************************!*\
  !*** ./src/components/common/ConfirmationTracker.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConfirmationTracker": () => (/* binding */ ConfirmationTracker)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/react */ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const pulseStart = 'rgba(232, 232, 232, 0.7)';
const pulseEnd = 'rgba(232, 232, 232, 0)';
const pulse = () => _emotion_react__WEBPACK_IMPORTED_MODULE_2__.keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 ${pulseStart};
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px ${pulseEnd};
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 ${pulseEnd};
  }
`;
const move = _emotion_react__WEBPACK_IMPORTED_MODULE_2__.keyframes`
  0% {
    left: -6px;
  }

  100% {
    left: 100%;
  }
`;
const Line = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Box, {
  shouldForwardProp: prop => prop !== 'complete' && prop !== 'active' && prop !== 'grow'
})(({
  active,
  complete,
  theme,
  width,
  grow
}) => ({
  width: grow ? '100%' : `${width}px`,
  height: 2,
  marginTop: 9,
  position: 'relative',
  background: active || complete ? theme.palette.text.primary : theme.palette.divider,
  transition: 'background-color 500ms'
}));
const Dot = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])('div')(({
  theme,
  delay
}) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: theme.palette.secondary.main,
  position: 'absolute',
  top: -3,
  left: -6,
  animation: `${move} 1.6s infinite ease-in`,
  animationDelay: `${delay}s`
}));
const Circle = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Box, {
  shouldForwardProp: prop => prop !== 'labelBackgroundColor' && prop !== 'complete' && prop !== 'active'
})(({
  complete,
  active,
  theme,
  labelBackgroundColor
}) => ({
  display: 'flex',
  border: `3px solid ${theme.palette.primary.main}`,
  background: complete ? theme.palette.secondary.main : labelBackgroundColor || theme.palette.background.paper,
  borderRadius: '50%',
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'background-color 500ms',
  zIndex: 2,
  animation: active ? `${pulse()} 1.6s infinite` : 'unset'
}));
const Label = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography)(() => ({
  position: 'absolute',
  top: 10,
  left: '50%',
  transform: 'translateX(-50%)'
}));
const StartLabel = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(Label, {
  shouldForwardProp: prop => prop !== 'labelBackgroundColor'
})(({
  theme
}) => ({
  left: 0,
  transform: 'unset',
  zIndex: 1,
  paddingRight: 8,
  backgroundColor: theme.palette.grey[850]
}));
const FinishLabel = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(Label, {
  shouldForwardProp: prop => prop !== 'labelBackgroundColor'
})(({
  theme
}) => ({
  right: 0,
  left: 'unset',
  zIndex: 1,
  paddingLeft: 8,
  transform: 'unset',
  backgroundColor: theme.palette.grey[850]
}));
const DashedLine = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])('div', {
  shouldForwardProp: prop => prop !== 'labelBackgroundColor'
})(({
  theme,
  labelBackgroundColor
}) => ({
  width: 40,
  height: 0,
  backgroundColor: labelBackgroundColor || theme.palette.background.default,
  position: 'absolute',
  left: 20,
  top: 9,
  borderTop: `2px dashed ${theme.palette.text.primary}`,
  zIndex: 1
}));
const Slider = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])('div')(({
  left
}) => ({
  position: 'absolute',
  display: 'flex',
  left: left,
  transition: 'left 500ms ease-in-out',
  minWidth: '100%'
}));
const ConfirmationTracker = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(function ConfirmationTracker({
  labelBackgroundColor = '#000',
  started,
  requiredCount,
  currentCount,
  ...props
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const numberOfDots = requiredCount - 1;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const containerRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const dots = [];
  let left = 0;
  const calculateLineWidth = () => {
    const containerWidth = containerRef.current?.clientWidth;
    if (!containerWidth) {
      return numberOfDots === 1 ? 125 : 90;
    }
    const divider = numberOfDots < 3 ? 2 : 3;
    const multiplier = numberOfDots < 3 ? 3 : 4;
    return (containerWidth - multiplier * 20) / divider;
  };
  const renderLine = (complete, active, grow = false) => /*#__PURE__*/React.createElement(Line, {
    width: calculateLineWidth(),
    complete: complete,
    active: active,
    grow: grow
  }, active && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dot, null), /*#__PURE__*/React.createElement(Dot, {
    delay: 0.45
  }), /*#__PURE__*/React.createElement(Dot, {
    delay: 0.9
  })));
  for (let i = 1; i <= numberOfDots; i++) {
    const active = started && currentCount < i && currentCount >= i - 1;
    dots.push( /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
      key: `container-${i}`
    }, renderLine(currentCount >= i, active), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Box, {
      display: "flex",
      direction: "column",
      align: "center",
      position: "relative"
    }, /*#__PURE__*/React.createElement(Circle, {
      complete: currentCount >= i,
      active: active,
      labelBackgroundColor: labelBackgroundColor
    }), /*#__PURE__*/React.createElement(Label, {
      margin: "25px 0 0",
      size: 14
    }, i, "/", requiredCount))));
  }
  const lastStepActive = started && currentCount < requiredCount && currentCount >= numberOfDots;
  const showBreakEnd = currentCount < requiredCount - 2 && requiredCount > 3;
  if (currentCount > 1 && requiredCount > 2) {
    if (!showBreakEnd) {
      left = -(calculateLineWidth() + 20) * (requiredCount - 3);
    } else {
      left = -(calculateLineWidth() + 20) * (currentCount - 1);
    }
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Box, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    ref: containerRef,
    sx: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      minWidth: 311,
      maxWidth: '100%'
    }
  }, props), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Box, {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '10px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Circle, {
    complete: started,
    active: false,
    labelBackgroundColor: labelBackgroundColor
  }), /*#__PURE__*/React.createElement(StartLabel, {
    labelBackgroundColor: labelBackgroundColor,
    margin: "25px 0 0 0",
    size: 14
  }, t('Start')), currentCount > 1 && /*#__PURE__*/React.createElement(DashedLine, {
    labelBackgroundColor: labelBackgroundColor
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Box, {
    sx: {
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      flexGrow: 1,
      height: 63,
      p: '10px 0 0 0'
    }
  }, /*#__PURE__*/React.createElement(Slider, {
    left: `${left}px`
  }, dots, renderLine(currentCount >= requiredCount, lastStepActive, requiredCount === 1))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Box, {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '10px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Circle, {
    complete: currentCount >= requiredCount,
    active: lastStepActive
  }), /*#__PURE__*/React.createElement(FinishLabel, {
    margin: "25px 0 0 0",
    size: 14
  }, t('Final'))));
});

/***/ }),

/***/ "./src/hooks/useCoinGeckoId.ts":
/*!*************************************!*\
  !*** ./src/hooks/useCoinGeckoId.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useCoinGeckoId": () => (/* binding */ useCoinGeckoId)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/contexts/TokenInfoProvider.js");


// This is a copy from https://github.com/ava-labs/core-web-properties/blob/develop/packages/web/src/hooks/bridge/useCoingeckoId.ts

const KNOWN_IDS = {
  BTC: 'bitcoin',
  AVAX: 'avalanche-2',
  ETH: 'ethereum'
};
const useCoinGeckoId = tokenSymbol => {
  const tokenInfoData = (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.useTokenInfoContext)();
  return tokenSymbol && (KNOWN_IDS[tokenSymbol] || tokenInfoData?.[tokenSymbol]?.coingeckoId);
};

/***/ }),

/***/ "./src/hooks/useIsMainnet.ts":
/*!***********************************!*\
  !*** ./src/hooks/useIsMainnet.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useIsMainnet": () => (/* binding */ useIsMainnet)
/* harmony export */ });
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");

const useIsMainnet = () => {
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__.useNetworkContext)();
  return !network?.isTestnet;
};

/***/ }),

/***/ "./src/pages/Bridge/BridgeTransactionStatus.tsx":
/*!******************************************************!*\
  !*** ./src/pages/Bridge/BridgeTransactionStatus.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/contexts/BridgeSDKProvider.js");
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/hooks/usePrice.js");
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/types/config.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_contexts_BridgeProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/BridgeProvider */ "./src/contexts/BridgeProvider.tsx");
/* harmony import */ var _components_ElapsedTimer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/ElapsedTimer */ "./src/pages/Bridge/components/ElapsedTimer.tsx");
/* harmony import */ var _src_hooks_useIsMainnet__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useIsMainnet */ "./src/hooks/useIsMainnet.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/getExplorerAddress */ "./src/utils/getExplorerAddress.ts");
/* harmony import */ var _hooks_useLogoUriForBridgeTransaction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./hooks/useLogoUriForBridgeTransaction */ "./src/pages/Bridge/hooks/useLogoUriForBridgeTransaction.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_hooks_useCoinGeckoId__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/hooks/useCoinGeckoId */ "./src/hooks/useCoinGeckoId.ts");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Dialog__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/components/common/Dialog */ "./src/components/common/Dialog.tsx");
/* harmony import */ var _src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/components/common/NetworkLogo */ "./src/components/common/NetworkLogo.tsx");
/* harmony import */ var _src_components_common_ConfirmationTracker__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/components/common/ConfirmationTracker */ "./src/components/common/ConfirmationTracker.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./utils/blockchainConversion */ "./src/pages/Bridge/utils/blockchainConversion.ts");
/* harmony import */ var _utils_getNativeTokenSymbol__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./utils/getNativeTokenSymbol */ "./src/pages/Bridge/utils/getNativeTokenSymbol.ts");
/* harmony import */ var _utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./utils/isUnifiedBridgeTransfer */ "./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts");
/* harmony import */ var _hooks_useBridgeAmounts__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./hooks/useBridgeAmounts */ "./src/pages/Bridge/hooks/useBridgeAmounts.ts");
/* harmony import */ var _hooks_useSyncBridgeConfig__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./hooks/useSyncBridgeConfig */ "./src/pages/Bridge/hooks/useSyncBridgeConfig.ts");
/* harmony import */ var _hooks_useBridgeNetworkPrice__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./hooks/useBridgeNetworkPrice */ "./src/pages/Bridge/hooks/useBridgeNetworkPrice.ts");
/* harmony import */ var _hooks_useBridgeTransferStatus__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./hooks/useBridgeTransferStatus */ "./src/pages/Bridge/hooks/useBridgeTransferStatus.ts");
/* harmony import */ var _components_BridgeCard__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/BridgeCard */ "./src/pages/Bridge/components/BridgeCard.tsx");
/* harmony import */ var _components_OffloadTimerTooltip__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./components/OffloadTimerTooltip */ "./src/pages/Bridge/components/OffloadTimerTooltip.tsx");
/* harmony import */ var _hooks_usePendingBridgeTransactions__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./hooks/usePendingBridgeTransactions */ "./src/pages/Bridge/hooks/usePendingBridgeTransactions.ts");
/* harmony import */ var _src_contexts_UnifiedBridgeProvider__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @src/contexts/UnifiedBridgeProvider */ "./src/contexts/UnifiedBridgeProvider.tsx");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");































const BridgeTransactionStatus = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_26__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_27__.useHistory)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_28__["default"])();
  const params = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_27__.useParams)();
  const {
    currencyFormatter,
    currency
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_3__.useSettingsContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_0__.useAccountsContext)();
  const {
    getErrorMessage
  } = (0,_src_contexts_UnifiedBridgeProvider__WEBPACK_IMPORTED_MODULE_25__.useUnifiedBridgeContext)();
  const bridgeTransactions = (0,_hooks_usePendingBridgeTransactions__WEBPACK_IMPORTED_MODULE_24__.usePendingBridgeTransactions)();
  const {
    removeBridgeTransaction
  } = (0,_src_contexts_BridgeProvider__WEBPACK_IMPORTED_MODULE_4__.useBridgeContext)();
  const [fromCardOpen, setFromCardOpen] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [toCardOpen, setToCardOpen] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [toastShown, setToastShown] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)();
  const [isDialogOpen, setIsDialogOpen] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const isMainnet = (0,_src_hooks_useIsMainnet__WEBPACK_IMPORTED_MODULE_6__.useIsMainnet)();
  const bridgeTransaction = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => bridgeTransactions.find(({
    sourceTxHash
  }) => sourceTxHash === params.txHash), [params.txHash, bridgeTransactions]);
  const symbol = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_17__.isUnifiedBridgeTransfer)(bridgeTransaction) ? bridgeTransaction.asset.symbol : bridgeTransaction?.symbol, [bridgeTransaction]);
  const coingeckoId = (0,_src_hooks_useCoinGeckoId__WEBPACK_IMPORTED_MODULE_10__.useCoinGeckoId)(symbol);
  const logoUri = (0,_hooks_useLogoUriForBridgeTransaction__WEBPACK_IMPORTED_MODULE_9__.useLogoUriForBridgeTransaction)(bridgeTransaction);
  const {
    networks,
    getNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_14__.useNetworkContext)();
  const {
    bridgeConfig
  } = (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_29__.useBridgeSDK)();
  (0,_hooks_useSyncBridgeConfig__WEBPACK_IMPORTED_MODULE_19__.useSyncBridgeConfig)();
  const sourceNetwork = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (bridgeTransaction) {
      return (0,_utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_15__.blockchainToNetwork)(bridgeTransaction.sourceChain, networks, bridgeConfig);
    }
    return undefined;
  }, [bridgeTransaction, networks, bridgeConfig]);
  const targetNetwork = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (bridgeTransaction) {
      return (0,_utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_15__.blockchainToNetwork)(bridgeTransaction.targetChain, networks, bridgeConfig);
    }
    return undefined;
  }, [bridgeTransaction, networks, bridgeConfig]);
  const assetPrice = (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_30__.usePrice)(coingeckoId, currency.toLowerCase());
  const networkPrice = (0,_hooks_useBridgeNetworkPrice__WEBPACK_IMPORTED_MODULE_20__.useBridgeNetworkPrice)(bridgeTransaction?.sourceChain);
  const targetNetworkPrice = (0,_hooks_useBridgeNetworkPrice__WEBPACK_IMPORTED_MODULE_20__.useBridgeNetworkPrice)(bridgeTransaction?.targetChain);
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_7__.useAnalyticsContext)();
  const {
    amount,
    sourceNetworkFee,
    targetNetworkFee
  } = (0,_hooks_useBridgeAmounts__WEBPACK_IMPORTED_MODULE_18__.useBridgeAmounts)(bridgeTransaction);
  const formattedNetworkPrice = networkPrice && sourceNetworkFee ? currencyFormatter(networkPrice.mul(sourceNetworkFee).toNumber()) : '-';
  const formattedTargetNetworkPrice = targetNetworkPrice && targetNetworkFee ? currencyFormatter(targetNetworkPrice.mul(targetNetworkFee).toNumber()) : '-';
  const {
    isComplete,
    sourceCurrentConfirmations,
    sourceRequiredConfirmations,
    targetCurrentConfirmations,
    targetRequiredConfirmations
  } = (0,_hooks_useBridgeTransferStatus__WEBPACK_IMPORTED_MODULE_21__.useBridgeTransferStatus)(bridgeTransaction);
  const errorCode = (0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_17__.isUnifiedBridgeTransfer)(bridgeTransaction) ? bridgeTransaction.errorCode : undefined;
  const hasError = typeof errorCode !== 'undefined';
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (bridgeTransaction && isComplete && !toastShown) {
      const errorMessage = errorCode ? getErrorMessage(errorCode) : '';
      const toasterId = _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_31__["default"].custom( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.ToastCard, {
        onDismiss: () => _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_31__["default"].remove(toasterId),
        variant: hasError ? 'error' : 'success',
        title: hasError ? t('Bridge Failed') : t('Bridge Successful')
      }, hasError ? errorMessage : t(`You transferred {{amount}} {{symbol}}!`, {
        amount,
        symbol
      })), {
        duration: Infinity
      });
      setToastShown(true);
    }
    // We only want this to trigger when `complete` switches to `true` and on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridgeTransaction?.completedAt, toastShown]);
  const isOffboarding = bridgeTransaction?.sourceChain === _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_33__.Blockchain.AVALANCHE && bridgeTransaction?.targetChain === _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_33__.Blockchain.BITCOIN;
  const offboardingDelay = bridgeConfig.config?.criticalBitcoin.offboardDelaySeconds;
  const hasOffBoardingDelay = typeof offboardingDelay === 'number';
  if (!activeAccount) {
    history.push('/home');
    return null;
  }
  const bridgeAmount = bridgeTransaction ? (0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_17__.isUnifiedBridgeTransfer)(bridgeTransaction) ? new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_34__.TokenUnit(bridgeTransaction.amount, bridgeTransaction.asset.decimals, bridgeTransaction.asset.symbol).toDisplay() : bridgeTransaction.amount.toString() : '';
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      height: '100%',
      width: '100%',
      justifyContent: 'space-between',
      pt: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitle, {
    onBackClick: () => history.replace('/assets')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, t('Transaction Status'), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Button, {
    variant: "text",
    sx: {
      mr: 1
    },
    onClick: () => {
      if (bridgeTransaction && isComplete) {
        history.replace('/home');
        removeBridgeTransaction(bridgeTransaction.sourceTxHash);
      } else {
        setIsDialogOpen(true);
      }
    }
  }, isComplete ? t('Close') : t('Hide')))), bridgeTransaction && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Scrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      alignItems: 'center',
      mx: 2,
      mb: 4,
      rowGap: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_12__.NetworkLogo, {
    src: logoUri,
    width: "56px",
    height: "56px",
    defaultSize: 48,
    zIndex: 2,
    withBackground: true,
    showComplete: isComplete && !hasError,
    showGlobeMargin: true
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Card // sending amount (Top Card)
  , {
    sx: {
      width: '100%',
      p: 2,
      pt: 4,
      mt: -5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Sending Amount')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "h6"
  }, bridgeAmount), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "h6",
    sx: {
      ml: 1,
      color: 'text.secondary'
    }
  }, symbol))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      alignItems: 'flex-end',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, amount && currencyFormatter(assetPrice.mul(amount).toNumber())))), /*#__PURE__*/React.createElement(_components_BridgeCard__WEBPACK_IMPORTED_MODULE_22__.BridgeCard // from chain (Middle Card)
  , {
    isWaiting: false // starts immediately
    ,
    isDone: Boolean(bridgeTransaction.targetStartedAt),
    isTransferComplete: isComplete
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('From')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      textTransform: 'capitalize',
      mr: 1
    }
  }, (0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_17__.isUnifiedBridgeTransfer)(bridgeTransaction) ? bridgeTransaction.sourceChain.chainName : bridgeTransaction.sourceChain), /*#__PURE__*/React.createElement(_src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_12__.NetworkLogo, {
    src: sourceNetwork?.logoUri,
    width: "16px",
    height: "16px",
    zIndex: 2
  }), bridgeTransaction.sourceTxHash && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.IconButton, {
    size: "small",
    "data-testid": "source-tx-link",
    "data-tx-hash": bridgeTransaction.sourceTxHash,
    onClick: () => window.open((0,_src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_8__.getExplorerAddress)(bridgeTransaction.sourceChain, bridgeTransaction.sourceTxHash, isMainnet, getNetwork), '_blank', 'noreferrer'),
    disableRipple: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.ExternalLinkIcon, null)))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Divider, {
    sx: {
      my: 1.5
    }
  }), bridgeTransaction.targetStartedAt ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2"
  }, ' ', sourceNetworkFee?.toNumber().toFixed(9), ' ', (0,_utils_getNativeTokenSymbol__WEBPACK_IMPORTED_MODULE_16__.getNativeTokenSymbol)(bridgeTransaction.sourceChain)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, formattedNetworkPrice, " ", currency))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Divider, {
    sx: {
      my: 2
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Time Elapsed')), /*#__PURE__*/React.createElement(_components_ElapsedTimer__WEBPACK_IMPORTED_MODULE_5__.ElapsedTimer, {
    startTime: bridgeTransaction.sourceStartedAt,
    endTime: bridgeTransaction.targetStartedAt,
    hasError: hasError
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Confirmations')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      mr: 2
    }
  }, sourceCurrentConfirmations, "/", sourceRequiredConfirmations), /*#__PURE__*/React.createElement(_components_ElapsedTimer__WEBPACK_IMPORTED_MODULE_5__.ElapsedTimer, {
    startTime: bridgeTransaction.sourceStartedAt,
    endTime: bridgeTransaction.targetStartedAt,
    hasError: hasError
  }))), /*#__PURE__*/React.createElement(_src_components_common_ConfirmationTracker__WEBPACK_IMPORTED_MODULE_13__.ConfirmationTracker, {
    started: true,
    requiredCount: sourceRequiredConfirmations,
    currentCount: sourceCurrentConfirmations,
    labelBackgroundColor: theme.palette.grey[850]
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Collapse, {
    in: fromCardOpen
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Divider, {
    sx: {
      my: 2
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2"
  }, ' ', sourceNetworkFee?.toNumber().toFixed(9), ' ', (0,_utils_getNativeTokenSymbol__WEBPACK_IMPORTED_MODULE_16__.getNativeTokenSymbol)(bridgeTransaction.sourceChain)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, formattedNetworkPrice, " ", currency)))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-around'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.IconButton, {
    onClick: () => setFromCardOpen(!fromCardOpen),
    disableRipple: true,
    sx: {
      pb: 0
    }
  }, fromCardOpen ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.ChevronDownIcon, null) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.ChevronUpIcon, null))))), /*#__PURE__*/React.createElement(_components_BridgeCard__WEBPACK_IMPORTED_MODULE_22__.BridgeCard // to chain (Bottom Card)
  , {
    isWaiting: !bridgeTransaction.targetStartedAt,
    isDone: isComplete,
    isTransferComplete: isComplete
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('To')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      textTransform: 'capitalize',
      mr: 1
    }
  }, (0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_17__.isUnifiedBridgeTransfer)(bridgeTransaction) ? bridgeTransaction.targetChain.chainName : bridgeTransaction.targetChain), /*#__PURE__*/React.createElement(_src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_12__.NetworkLogo, {
    src: targetNetwork?.logoUri,
    width: "16px",
    height: "16px",
    zIndex: 2
  }), bridgeTransaction.targetTxHash && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.IconButton, {
    size: "small",
    "data-testid": "target-tx-link",
    "data-tx-hash": bridgeTransaction.targetTxHash,
    onClick: () => window.open((0,_src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_8__.getExplorerAddress)(bridgeTransaction.targetChain, bridgeTransaction.targetTxHash || '', isMainnet, getNetwork), '_blank', 'noreferrer'),
    disableRipple: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.ExternalLinkIcon, null)))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Divider, {
    sx: {
      my: 1.5
    }
  }), isComplete ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2"
  }, ' ', targetNetworkFee?.toNumber().toFixed(9), ' ', (0,_utils_getNativeTokenSymbol__WEBPACK_IMPORTED_MODULE_16__.getNativeTokenSymbol)(bridgeTransaction.targetChain)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, formattedTargetNetworkPrice, " ", currency))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Divider, {
    sx: {
      my: 2
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Time Elapsed')), bridgeTransaction.targetStartedAt && /*#__PURE__*/React.createElement(_components_ElapsedTimer__WEBPACK_IMPORTED_MODULE_5__.ElapsedTimer, {
    startTime: bridgeTransaction.targetStartedAt,
    endTime: bridgeTransaction.completedAt,
    hasError: hasError
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Confirmations')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      mr: 2
    }
  }, (0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_17__.isUnifiedBridgeTransfer)(bridgeTransaction) ? bridgeTransaction.targetConfirmationCount // with Unified Bridge, the SDK provides info about the target confirmations
  : bridgeTransaction.complete // with Legacy Bridge, it's either 0 if tx has not completed yet, or 1 if it has
  ? '1' : '0', "/", (0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_17__.isUnifiedBridgeTransfer)(bridgeTransaction) ? bridgeTransaction.targetRequiredConfirmationCount : 1 // With legacy Avalanche Bridge, we just need 1 confirmation on the destination network
  ), /*#__PURE__*/React.createElement(_components_ElapsedTimer__WEBPACK_IMPORTED_MODULE_5__.ElapsedTimer, {
    hasError: hasError,
    offloadDelayTooltip: isOffboarding && hasOffBoardingDelay ? /*#__PURE__*/React.createElement(_components_OffloadTimerTooltip__WEBPACK_IMPORTED_MODULE_23__.OffloadTimerTooltip, {
      offloadDelaySeconds: bridgeConfig.config?.criticalBitcoin.offboardDelaySeconds || 0
    }) : undefined,
    startTime: bridgeTransaction.targetStartedAt || 0,
    endTime: bridgeTransaction.completedAt
  }))), bridgeTransaction.targetStartedAt && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_ConfirmationTracker__WEBPACK_IMPORTED_MODULE_13__.ConfirmationTracker, {
    currentCount: targetCurrentConfirmations,
    requiredCount: targetRequiredConfirmations,
    started: Boolean(bridgeTransaction.targetStartedAt),
    labelBackgroundColor: theme.palette.grey[850]
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Collapse, {
    in: toCardOpen
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Divider, {
    sx: {
      my: 2
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body2"
  }, ' ', targetNetworkFee?.toNumber().toFixed(9), ' ', (0,_utils_getNativeTokenSymbol__WEBPACK_IMPORTED_MODULE_16__.getNativeTokenSymbol)(bridgeTransaction.targetChain)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, formattedTargetNetworkPrice, " ", currency)))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-around'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.IconButton, {
    onClick: () => setToCardOpen(!toCardOpen),
    disableRipple: true,
    sx: {
      pb: 0,
      '&.MuiButtonBase-root:hover': {
        bgcolor: 'transparent'
      }
    }
  }, toCardOpen ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.ChevronDownIcon, null) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.ChevronUpIcon, null)))))))), /*#__PURE__*/React.createElement(_src_components_common_Dialog__WEBPACK_IMPORTED_MODULE_11__["default"], {
    open: isDialogOpen,
    isCloseable: false,
    onClose: () => setIsDialogOpen(false),
    content: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
      sx: {
        justifyContent: 'center',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
      variant: "h5",
      sx: {
        textAlign: 'center'
      }
    }, t('Hide Transaction')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
      variant: "body2",
      sx: {
        textAlign: 'center',
        mt: 1
      }
    }, t('Your transaction is processing. Go to Activity to see the current status.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
      sx: {
        mt: 3
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Button, {
      sx: {
        mb: 1
      },
      onClick: () => {
        capture('BridgeTransactionHide');
        history.replace('/assets');
      }
    }, t('Go to Activity')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Button, {
      variant: "text",
      onClick: () => {
        capture('BridgeTransactionHideCancel');
        setIsDialogOpen(false);
      }
    }, t('Back'))))
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BridgeTransactionStatus);

/***/ }),

/***/ "./src/pages/Bridge/components/BridgeCard.tsx":
/*!****************************************************!*\
  !*** ./src/pages/Bridge/components/BridgeCard.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BridgeCard": () => (/* binding */ BridgeCard)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const BridgeCard = ({
  isWaiting,
  isDone,
  isTransferComplete,
  ...props
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Card, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    sx: {
      width: '100%',
      p: 2,
      transition: theme.transitions.create('opacity'),
      backgroundColor: isDone ? 'background.paper' : 'grey.850',
      opacity: !isTransferComplete && (isDone || isWaiting) ? 0.6 : 'unset'
    }
  }, props));
};

/***/ }),

/***/ "./src/pages/Bridge/components/ElapsedTimer.tsx":
/*!******************************************************!*\
  !*** ./src/pages/Bridge/components/ElapsedTimer.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ElapsedTimer": () => (/* binding */ ElapsedTimer)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_timer_hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-timer-hook */ "./node_modules/react-timer-hook/dist/index.js");
/* harmony import */ var react_timer_hook__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_timer_hook__WEBPACK_IMPORTED_MODULE_1__);
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const TimeElapsed = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
  shouldForwardProp: prop => prop !== 'complete'
})`
  min-width: 76px; // this prevents the chip growing and shrinking due to numbers changing
  border-radius: 66px;
  padding: 2px 8px;
  text-align: center;
  background-color: ${({
  complete,
  theme
}) => complete ? theme.palette.success.dark : theme.palette.grey[700]};
`;
const padTimeElapsed = (startTime, endTime) => {
  // based on created time, set elapsed time offset

  const now = Date.now();
  const diff = (endTime || now) - startTime;
  const offset = new Date(now + diff);
  return offset;
};
function ElapsedTimer({
  offloadDelayTooltip,
  startTime,
  endTime,
  hasError
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    hours,
    minutes,
    seconds,
    reset,
    isRunning
  } = (0,react_timer_hook__WEBPACK_IMPORTED_MODULE_1__.useStopwatch)({
    autoStart: false,
    offsetTimestamp: padTimeElapsed(startTime, endTime)
  });

  // Stop the timer when we know the endTime
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (startTime && !endTime && !isRunning) {
      reset(padTimeElapsed(startTime, endTime), true);
    }
  }, [endTime, startTime, reset, isRunning]);
  const displayedSeconds = seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  });
  const displayedMinutes = minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  });
  const displayedHours = hours > 0 ? hours.toLocaleString('en-US') : undefined;
  if (!startTime) {
    return /*#__PURE__*/React.createElement(TimeElapsed, {
      complete: !!endTime
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, null, "00:00"));
  }
  return /*#__PURE__*/React.createElement(TimeElapsed, {
    complete: !!endTime && !hasError,
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: hasError ? 'center' : 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, null, displayedHours && `${displayedHours}:`, displayedMinutes, ":", displayedSeconds), endTime ? hasError ? null : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CheckIcon, {
    size: "12",
    sx: {
      ml: 0.5
    }
  }) : offloadDelayTooltip ?? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Tooltip, {
    title: t('Time Elapsed')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.InfoCircleIcon, null)));
}

/***/ }),

/***/ "./src/pages/Bridge/components/OffloadTimerTooltip.tsx":
/*!*************************************************************!*\
  !*** ./src/pages/Bridge/components/OffloadTimerTooltip.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OffloadTimerTooltip": () => (/* binding */ OffloadTimerTooltip)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/formatDistance/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const formatedOffloadDelaySeconds = (seconds, includeSeconds) => {
  return (0,date_fns__WEBPACK_IMPORTED_MODULE_0__["default"])(0, seconds * 1000, {
    includeSeconds
  });
};
function OffloadTimerTooltip({
  offloadDelaySeconds
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const faqLink = /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Link, {
    href: "https://support.avax.network/en/articles/6325230-avalanche-bridge-faq-for-converting-btc-to-btc-b",
    target: "_blank",
    rel: "noreferrer",
    sx: {
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '14px'
    }
  }, t('FAQ'));
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    title: /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_3__.Trans, {
      i18nKey: `Bridging from Avalanche to Bitcoin takes approximately ${formatedOffloadDelaySeconds(offloadDelaySeconds, true)}. Please see
          the <FaqLink>FAQ</FaqLink> for additional info.`,
      components: {
        FaqLink: faqLink
      }
    }),
    PopperProps: {
      sx: {
        maxWidth: '240px',
        m: 1
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.InfoCircleIcon, null));
}

/***/ }),

/***/ "./src/pages/Bridge/hooks/useBridgeAmounts.ts":
/*!****************************************************!*\
  !*** ./src/pages/Bridge/hooks/useBridgeAmounts.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useBridgeAmounts": () => (/* binding */ useBridgeAmounts)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/bigintToBig */ "./src/utils/bigintToBig.ts");
/* harmony import */ var _utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/isUnifiedBridgeTransfer */ "./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts");



const useBridgeAmounts = bridgeTx => {
  const sourceNetworkFee = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (typeof bridgeTx?.sourceNetworkFee === 'undefined') {
      return;
    }
    if ((0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_2__.isUnifiedBridgeTransfer)(bridgeTx)) {
      return (0,_src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_1__.bigintToBig)(bridgeTx.sourceNetworkFee, bridgeTx.sourceChain.networkToken.decimals);
    }
    return bridgeTx.sourceNetworkFee;
  }, [bridgeTx]);
  const targetNetworkFee = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (typeof bridgeTx?.targetNetworkFee === 'undefined') {
      return;
    }
    if ((0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_2__.isUnifiedBridgeTransfer)(bridgeTx)) {
      return (0,_src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_1__.bigintToBig)(bridgeTx.targetNetworkFee, bridgeTx.targetChain.networkToken.decimals);
    }
    return bridgeTx.targetNetworkFee;
  }, [bridgeTx]);
  return {
    amount: (0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_2__.isUnifiedBridgeTransfer)(bridgeTx) ? (0,_src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_1__.bigintToBig)(bridgeTx.amount, bridgeTx.asset.decimals) : bridgeTx?.amount,
    sourceNetworkFee,
    targetNetworkFee
  };
};

/***/ }),

/***/ "./src/pages/Bridge/hooks/useBridgeNetworkPrice.ts":
/*!*********************************************************!*\
  !*** ./src/pages/Bridge/hooks/useBridgeNetworkPrice.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useBridgeNetworkPrice": () => (/* binding */ useBridgeNetworkPrice)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/hooks/usePriceForChain.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/blockchainConversion */ "./src/pages/Bridge/utils/blockchainConversion.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/caipConversion */ "./src/utils/caipConversion.ts");





const useBridgeNetworkPrice = chain => {
  const {
    networks
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__.useNetworkContext)();
  const blockchain = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    // Standardize input to Blockchain type
    if (!chain) {
      return undefined;
    }
    if (typeof chain === 'object') {
      const network = networks.find(({
        chainId
      }) => chainId === (0,_src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_3__.caipToChainId)(chain.chainId));
      if (!network) {
        return undefined;
      }
      return (0,_utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_1__.networkToBlockchain)(network);
    }
    return chain;
  }, [chain, networks]);
  return (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_4__.usePriceForChain)(blockchain);
};

/***/ }),

/***/ "./src/pages/Bridge/hooks/useBridgeTransferStatus.ts":
/*!***********************************************************!*\
  !*** ./src/pages/Bridge/hooks/useBridgeTransferStatus.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useBridgeTransferStatus": () => (/* binding */ useBridgeTransferStatus)
/* harmony export */ });
/* harmony import */ var _utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/isUnifiedBridgeTransfer */ "./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts");

const useBridgeTransferStatus = bridgeTx => {
  if (!bridgeTx) {
    return {
      isComplete: false,
      sourceCurrentConfirmations: 0,
      targetCurrentConfirmations: 0,
      sourceRequiredConfirmations: 0,
      targetRequiredConfirmations: 0
    };
  }
  if ((0,_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_0__.isUnifiedBridgeTransfer)(bridgeTx)) {
    return {
      isComplete: Boolean(bridgeTx.completedAt),
      // cap the current confirmations so we don't go over
      sourceCurrentConfirmations: Math.min(bridgeTx.sourceConfirmationCount, bridgeTx.sourceRequiredConfirmationCount),
      targetCurrentConfirmations: Math.min(bridgeTx.targetConfirmationCount, bridgeTx.targetRequiredConfirmationCount),
      // with Unified Bridge, the SDK provides info about the target confirmations
      sourceRequiredConfirmations: bridgeTx.sourceRequiredConfirmationCount,
      targetRequiredConfirmations: bridgeTx.targetRequiredConfirmationCount
    };
  }
  return {
    isComplete: bridgeTx.complete,
    // cap the current confirmations so we don't go over
    sourceCurrentConfirmations: Math.min(bridgeTx.confirmationCount, bridgeTx.requiredConfirmationCount),
    // with Legacy Bridge, the count is either 0 if tx has not completed yet, or 1 if it has
    targetCurrentConfirmations: bridgeTx.complete ? 1 : 0,
    sourceRequiredConfirmations: bridgeTx.requiredConfirmationCount,
    targetRequiredConfirmations: 1 // and we only require one confirmation on the target blockchain
  };
};

/***/ }),

/***/ "./src/pages/Bridge/hooks/useLogoUriForBridgeTransaction.ts":
/*!******************************************************************!*\
  !*** ./src/pages/Bridge/hooks/useLogoUriForBridgeTransaction.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useLogoUriForBridgeTransaction": () => (/* binding */ useLogoUriForBridgeTransaction)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/types/config.js");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useTokensWithBalances */ "./src/hooks/useTokensWithBalances.ts");
/* harmony import */ var _utils_findTokenForAsset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/findTokenForAsset */ "./src/pages/Bridge/utils/findTokenForAsset.ts");
/* harmony import */ var _utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/blockchainConversion */ "./src/pages/Bridge/utils/blockchainConversion.ts");
/* harmony import */ var _src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/caipConversion */ "./src/utils/caipConversion.ts");
/* harmony import */ var _src_utils_bridge_getBridgedAssetSymbol__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/bridge/getBridgedAssetSymbol */ "./src/utils/bridge/getBridgedAssetSymbol.ts");








function useLogoUriForBridgeTransaction(bridgeTransaction) {
  const {
    network,
    networks,
    getNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__.useNetworkContext)();
  const isMainnet = !network?.isTestnet;
  const isUnifiedTransfer = typeof bridgeTransaction?.sourceChain === 'object';
  const targetBlockchain = isUnifiedTransfer ? (0,_utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_3__.networkToBlockchain)(networks.find(({
    chainId
  }) => (0,_src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_4__.caipToChainId)(bridgeTransaction.targetChain.chainId) === chainId)) : bridgeTransaction?.targetChain;
  let chainId;
  if (isUnifiedTransfer) {
    chainId = (0,_src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_4__.caipToChainId)(bridgeTransaction.sourceChain.chainId);
  } else {
    chainId = bridgeTransaction?.sourceChain === _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_6__.Blockchain.BITCOIN ? isMainnet ? _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_7__.ChainId.BITCOIN : _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_7__.ChainId.BITCOIN_TESTNET : isMainnet ? _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_7__.ChainId.AVALANCHE_MAINNET_ID : _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_7__.ChainId.AVALANCHE_TESTNET_ID;
  }
  const tokens = (0,_src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_1__.useTokensWithBalances)({
    forceShowTokensWithoutBalances: true,
    network: getNetwork(chainId)
  });
  if (!bridgeTransaction || !targetBlockchain) {
    return;
  }
  const token = (0,_utils_findTokenForAsset__WEBPACK_IMPORTED_MODULE_2__.findTokenForAsset)((0,_src_utils_bridge_getBridgedAssetSymbol__WEBPACK_IMPORTED_MODULE_5__.getBridgedAssetSymbol)(bridgeTransaction), targetBlockchain, tokens);
  return token?.logoUri;
}

/***/ }),

/***/ "./src/pages/Bridge/hooks/usePendingBridgeTransactions.ts":
/*!****************************************************************!*\
  !*** ./src/pages/Bridge/hooks/usePendingBridgeTransactions.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "usePendingBridgeTransactions": () => (/* binding */ usePendingBridgeTransactions)
/* harmony export */ });
/* harmony import */ var _src_contexts_BridgeProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/BridgeProvider */ "./src/contexts/BridgeProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_UnifiedBridgeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/UnifiedBridgeProvider */ "./src/contexts/UnifiedBridgeProvider.tsx");
/* harmony import */ var _src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/caipConversion */ "./src/utils/caipConversion.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const usePendingBridgeTransactions = () => {
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__.useNetworkContext)();
  const {
    bridgeTransactions: legacyBridgeTransfers
  } = (0,_src_contexts_BridgeProvider__WEBPACK_IMPORTED_MODULE_0__.useBridgeContext)();
  const {
    state: {
      pendingTransfers: unifiedBridgeTransfers
    }
  } = (0,_src_contexts_UnifiedBridgeProvider__WEBPACK_IMPORTED_MODULE_2__.useUnifiedBridgeContext)();
  const bridgeTransactions = (0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    return [...Object.values(legacyBridgeTransfers), ...Object.values(unifiedBridgeTransfers).filter(tx =>
    // filter pending transactions that don't belong to the given network
    network?.chainId === (0,_src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_3__.caipToChainId)(tx.sourceChain.chainId) || network?.chainId === (0,_src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_3__.caipToChainId)(tx.targetChain.chainId))];
  }, [unifiedBridgeTransfers, legacyBridgeTransfers, network]);
  return bridgeTransactions;
};

/***/ }),

/***/ "./src/pages/Bridge/hooks/useSyncBridgeConfig.ts":
/*!*******************************************************!*\
  !*** ./src/pages/Bridge/hooks/useSyncBridgeConfig.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useSyncBridgeConfig": () => (/* binding */ useSyncBridgeConfig)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/contexts/BridgeSDKProvider.js");
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/hooks/useBridgeConfigUpdater.js");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_background_services_bridge_events_listeners__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/bridge/events/listeners */ "./src/background/services/bridge/events/listeners.ts");
/* harmony import */ var _src_background_services_network_events_networkUpdatedEventListener__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/network/events/networkUpdatedEventListener */ "./src/background/services/network/events/networkUpdatedEventListener.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/operators/filter.js");








/**
 * Periodically update the bridge config and keep it in sync with the background.
 */
function useSyncBridgeConfig() {
  const {
    setBridgeConfig
  } = (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_5__.useBridgeSDK)();
  const {
    events,
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_3__.useConnectionContext)();
  const fetchConfig = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => request({
    method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__.ExtensionRequest.BRIDGE_GET_CONFIG
  }), [request]);

  // Periodically update the bridge config
  (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_6__.useBridgeConfigUpdater)(fetchConfig);

  // Update the bridge config when either the network or bridge state changes
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const subscription = events().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_7__.filter)(event => (0,_src_background_services_network_events_networkUpdatedEventListener__WEBPACK_IMPORTED_MODULE_2__.networkUpdatedEventListener)(event) || (0,_src_background_services_bridge_events_listeners__WEBPACK_IMPORTED_MODULE_1__.isBridgeStateUpdateEventListener)(event))).subscribe(async () => {
      const newConfig = await fetchConfig();
      setBridgeConfig(newConfig);
    });
    return () => subscription.unsubscribe();
  }, [events, fetchConfig, setBridgeConfig]);
}

/***/ }),

/***/ "./src/pages/Bridge/utils/findTokenForAsset.ts":
/*!*****************************************************!*\
  !*** ./src/pages/Bridge/utils/findTokenForAsset.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "findTokenForAsset": () => (/* binding */ findTokenForAsset)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/types/config.js");

function findTokenForAsset(symbol, nativeChain, tokens) {
  // When the source is Avalanche use the wrapped version of the symbol e.g. BTC.b
  const wrappedSymbol = getWrappedSymbol(symbol, nativeChain);
  return tokens.find(t => t.symbol === symbol || t.symbol === wrappedSymbol);
}
function getWrappedSymbol(symbol, chain) {
  if (chain === _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.Blockchain.ETHEREUM) {
    return `${symbol}.e`;
  } else if (chain === _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.Blockchain.BITCOIN) {
    return `${symbol}.b`;
  }
  return symbol;
}

/***/ }),

/***/ "./src/pages/Bridge/utils/getNativeTokenSymbol.ts":
/*!********************************************************!*\
  !*** ./src/pages/Bridge/utils/getNativeTokenSymbol.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getNativeTokenSymbol": () => (/* binding */ getNativeTokenSymbol)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/utils/getNativeSymbol.js");

const getNativeTokenSymbol = chain => {
  if (typeof chain === 'object') {
    return chain.networkToken.symbol;
  }
  return (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.getNativeSymbol)(chain);
};

/***/ }),

/***/ "./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts":
/*!***********************************************************!*\
  !*** ./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isUnifiedBridgeTransfer": () => (/* binding */ isUnifiedBridgeTransfer)
/* harmony export */ });
const isUnifiedBridgeTransfer = transfer => {
  return transfer !== undefined && 'type' in transfer;
};

/***/ }),

/***/ "./src/utils/bigintToBig.ts":
/*!**********************************!*\
  !*** ./src/utils/bigintToBig.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bigintToBig": () => (/* binding */ bigintToBig)
/* harmony export */ });
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bnToBig.js");
/* harmony import */ var bn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bn.js */ "./node_modules/bn.js/lib/bn.js");
/* harmony import */ var bn_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bn_js__WEBPACK_IMPORTED_MODULE_0__);


function bigintToBig(amount, denomination) {
  return (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_1__.bnToBig)(new bn_js__WEBPACK_IMPORTED_MODULE_0__.BN(amount.toString()), denomination);
}

/***/ }),

/***/ "./src/utils/bridge/getBridgedAssetSymbol.ts":
/*!***************************************************!*\
  !*** ./src/utils/bridge/getBridgedAssetSymbol.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getBridgedAssetSymbol": () => (/* binding */ getBridgedAssetSymbol)
/* harmony export */ });
/* harmony import */ var _src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Bridge/utils/isUnifiedBridgeTransfer */ "./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts");

const getBridgedAssetSymbol = tx => {
  if ((0,_src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_0__.isUnifiedBridgeTransfer)(tx)) {
    return tx.asset.symbol;
  }
  return tx.symbol;
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0JyaWRnZV9CcmlkZ2VUcmFuc2FjdGlvblN0YXR1c190c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ21EO0FBRTVDLFNBQVNDLDJCQUEyQkEsQ0FDekNDLEdBQXNDLEVBQ3RDO0VBQ0EsT0FBT0EsR0FBRyxDQUFDQyxJQUFJLEtBQUtILHVFQUFrQztBQUN4RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ArQztBQUM4QjtBQUNsQztBQUNJO0FBRS9DLE1BQU1hLFVBQVUsR0FBRywwQkFBMEI7QUFDN0MsTUFBTUMsUUFBUSxHQUFHLHdCQUF3QjtBQUN6QyxNQUFNQyxLQUFLLEdBQUdBLENBQUEsS0FBTUoscURBQVU7QUFDOUI7QUFDQTtBQUNBLDBCQUEwQkUsVUFBVztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QkMsUUFBUztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQkEsUUFBUztBQUNuQztBQUNBLENBQUM7QUFFRCxNQUFNRSxJQUFJLEdBQUdMLHFEQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUVELE1BQU1NLElBQVMsR0FBR1IsdUVBQU0sQ0FBQ0QsNERBQUcsRUFBRTtFQUM1QlUsaUJBQWlCLEVBQUdDLElBQUksSUFDdEJBLElBQUksS0FBSyxVQUFVLElBQUlBLElBQUksS0FBSyxRQUFRLElBQUlBLElBQUksS0FBSztBQUN6RCxDQUFDLENBQUMsQ0FDQSxDQUFDO0VBQ0NDLE1BQU07RUFDTkMsUUFBUTtFQUNSQyxLQUFLO0VBQ0xDLEtBQUs7RUFDTEM7QUFPRixDQUFDLE1BQU07RUFDTEQsS0FBSyxFQUFFQyxJQUFJLEdBQUcsTUFBTSxHQUFJLEdBQUVELEtBQU0sSUFBRztFQUNuQ0UsTUFBTSxFQUFFLENBQUM7RUFDVEMsU0FBUyxFQUFFLENBQUM7RUFDWkMsUUFBUSxFQUFFLFVBQVU7RUFDcEJDLFVBQVUsRUFDUlIsTUFBTSxJQUFJQyxR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Qy9CLE9BQU9BLEVBQUUsQ0FBQzVLLEtBQUssQ0FBQ0QsTUFBTTtFQUN4QjtFQUVBLE9BQU82SyxFQUFFLENBQUM3SyxNQUFNO0FBQ2xCLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay9ldmVudHMvbmV0d29ya1VwZGF0ZWRFdmVudExpc3RlbmVyLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vQ29uZmlybWF0aW9uVHJhY2tlci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VDb2luR2Vja29JZC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUlzTWFpbm5ldC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0JyaWRnZS9CcmlkZ2VUcmFuc2FjdGlvblN0YXR1cy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9CcmlkZ2UvY29tcG9uZW50cy9CcmlkZ2VDYXJkLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0JyaWRnZS9jb21wb25lbnRzL0VsYXBzZWRUaW1lci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9CcmlkZ2UvY29tcG9uZW50cy9PZmZsb2FkVGltZXJUb29sdGlwLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0JyaWRnZS9ob29rcy91c2VCcmlkZ2VBbW91bnRzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQnJpZGdlL2hvb2tzL3VzZUJyaWRnZU5ldHdvcmtQcmljZS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0JyaWRnZS9ob29rcy91c2VCcmlkZ2VUcmFuc2ZlclN0YXR1cy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0JyaWRnZS9ob29rcy91c2VMb2dvVXJpRm9yQnJpZGdlVHJhbnNhY3Rpb24udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9CcmlkZ2UvaG9va3MvdXNlUGVuZGluZ0JyaWRnZVRyYW5zYWN0aW9ucy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0JyaWRnZS9ob29rcy91c2VTeW5jQnJpZGdlQ29uZmlnLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQnJpZGdlL3V0aWxzL2ZpbmRUb2tlbkZvckFzc2V0LnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQnJpZGdlL3V0aWxzL2dldE5hdGl2ZVRva2VuU3ltYm9sLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQnJpZGdlL3V0aWxzL2lzVW5pZmllZEJyaWRnZVRyYW5zZmVyLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvYmlnaW50VG9CaWcudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9icmlkZ2UvZ2V0QnJpZGdlZEFzc2V0U3ltYm9sLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV4dGVuc2lvbkNvbm5lY3Rpb25FdmVudCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgTmV0d29yaywgTmV0d29ya0V2ZW50cyB9IGZyb20gJy4uL21vZGVscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXR3b3JrVXBkYXRlZEV2ZW50TGlzdGVuZXIoXG4gIGV2dDogRXh0ZW5zaW9uQ29ubmVjdGlvbkV2ZW50PE5ldHdvcms+LFxuKSB7XG4gIHJldHVybiBldnQubmFtZSA9PT0gTmV0d29ya0V2ZW50cy5ORVRXT1JLX1VQREFURV9FVkVOVDtcbn1cbiIsImltcG9ydCB7IEZyYWdtZW50LCBtZW1vLCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIHN0eWxlZCwgVGhlbWUsIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsga2V5ZnJhbWVzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuY29uc3QgcHVsc2VTdGFydCA9ICdyZ2JhKDIzMiwgMjMyLCAyMzIsIDAuNyknO1xuY29uc3QgcHVsc2VFbmQgPSAncmdiYSgyMzIsIDIzMiwgMjMyLCAwKSc7XG5jb25zdCBwdWxzZSA9ICgpID0+IGtleWZyYW1lc2BcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSk7XG4gICAgYm94LXNoYWRvdzogMCAwIDAgMCAke3B1bHNlU3RhcnR9O1xuICB9XG5cbiAgNzAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIGJveC1zaGFkb3c6IDAgMCAwIDhweCAke3B1bHNlRW5kfTtcbiAgfVxuXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSk7XG4gICAgYm94LXNoYWRvdzogMCAwIDAgMCAke3B1bHNlRW5kfTtcbiAgfVxuYDtcblxuY29uc3QgbW92ZSA9IGtleWZyYW1lc2BcbiAgMCUge1xuICAgIGxlZnQ6IC02cHg7XG4gIH1cblxuICAxMDAlIHtcbiAgICBsZWZ0OiAxMDAlO1xuICB9XG5gO1xuXG5jb25zdCBMaW5lOiBhbnkgPSBzdHlsZWQoQm94LCB7XG4gIHNob3VsZEZvcndhcmRQcm9wOiAocHJvcCkgPT5cbiAgICBwcm9wICE9PSAnY29tcGxldGUnICYmIHByb3AgIT09ICdhY3RpdmUnICYmIHByb3AgIT09ICdncm93Jyxcbn0pKFxuICAoe1xuICAgIGFjdGl2ZSxcbiAgICBjb21wbGV0ZSxcbiAgICB0aGVtZSxcbiAgICB3aWR0aCxcbiAgICBncm93LFxuICB9OiB7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIGNvbXBsZXRlOiBib29sZWFuO1xuICAgIGdyb3c/OiBib29sZWFuO1xuICAgIHRoZW1lOiBUaGVtZTtcbiAgICB3aWR0aDogbnVtYmVyO1xuICB9KSA9PiAoe1xuICAgIHdpZHRoOiBncm93ID8gJzEwMCUnIDogYCR7d2lkdGh9cHhgLFxuICAgIGhlaWdodDogMixcbiAgICBtYXJnaW5Ub3A6IDksXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgYmFja2dyb3VuZDpcbiAgICAgIGFjdGl2ZSB8fCBjb21wbGV0ZSA/IHRoZW1lLnBhbGV0dGUudGV4dC5wcmltYXJ5IDogdGhlbWUucGFsZXR0ZS5kaXZpZGVyLFxuICAgIHRyYW5zaXRpb246ICdiYWNrZ3JvdW5kLWNvbG9yIDUwMG1zJyxcbiAgfSksXG4pO1xuXG5jb25zdCBEb3Q6IGFueSA9IHN0eWxlZCgnZGl2JykoKHsgdGhlbWUsIGRlbGF5IH06IGFueSkgPT4gKHtcbiAgd2lkdGg6IDgsXG4gIGhlaWdodDogOCxcbiAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5zZWNvbmRhcnkubWFpbixcbiAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gIHRvcDogLTMsXG4gIGxlZnQ6IC02LFxuICBhbmltYXRpb246IGAke21vdmV9IDEuNnMgaW5maW5pdGUgZWFzZS1pbmAsXG4gIGFuaW1hdGlvbkRlbGF5OiBgJHtkZWxheX1zYCxcbn0pKTtcblxuY29uc3QgQ2lyY2xlOiBhbnkgPSBzdHlsZWQoQm94LCB7XG4gIHNob3VsZEZvcndhcmRQcm9wOiAocHJvcCkgPT5cbiAgICBwcm9wICE9PSAnbGFiZWxCYWNrZ3JvdW5kQ29sb3InICYmIHByb3AgIT09ICdjb21wbGV0ZScgJiYgcHJvcCAhPT0gJ2FjdGl2ZScsXG59KSgoeyBjb21wbGV0ZSwgYWN0aXZlLCB0aGVtZSwgbGFiZWxCYWNrZ3JvdW5kQ29sb3IgfTogYW55KSA9PiAoe1xuICBkaXNwbGF5OiAnZmxleCcsXG4gIGJvcmRlcjogYDNweCBzb2xpZCAke3RoZW1lLnBhbGV0dGUucHJpbWFyeS5tYWlufWAsXG4gIGJhY2tncm91bmQ6IGNvbXBsZXRlXG4gICAgPyB0aGVtZS5wYWxldHRlLnNlY29uZGFyeS5tYWluXG4gICAgOiBsYWJlbEJhY2tncm91bmRDb2xvciB8fCB0aGVtZS5wYWxldHRlLmJhY2tncm91bmQucGFwZXIsXG4gIGJvcmRlclJhZGl1czogJzUwJScsXG4gIHdpZHRoOiAyMCxcbiAgaGVpZ2h0OiAyMCxcbiAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgdHJhbnNpdGlvbjogJ2JhY2tncm91bmQtY29sb3IgNTAwbXMnLFxuICB6SW5kZXg6IDIsXG4gIGFuaW1hdGlvbjogYWN0aXZlID8gYCR7cHVsc2UoKX0gMS42cyBpbmZpbml0ZWAgOiAndW5zZXQnLFxufSkpO1xuXG5jb25zdCBMYWJlbCA9IHN0eWxlZChUeXBvZ3JhcGh5KSgoKSA9PiAoe1xuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgdG9wOiAxMCxcbiAgbGVmdDogJzUwJScsXG4gIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknLFxufSkpO1xuXG5jb25zdCBTdGFydExhYmVsID0gc3R5bGVkKExhYmVsLCB7XG4gIHNob3VsZEZvcndhcmRQcm9wOiAocHJvcCkgPT4gcHJvcCAhPT0gJ2xhYmVsQmFja2dyb3VuZENvbG9yJyxcbn0pKCh7IHRoZW1lIH0pID0+ICh7XG4gIGxlZnQ6IDAsXG4gIHRyYW5zZm9ybTogJ3Vuc2V0JyxcbiAgekluZGV4OiAxLFxuICBwYWRkaW5nUmlnaHQ6IDgsXG4gIGJhY2tncm91bmRDb2xvcjogdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF0sXG59KSk7XG5cbmNvbnN0IEZpbmlzaExhYmVsID0gc3R5bGVkKExhYmVsLCB7XG4gIHNob3VsZEZvcndhcmRQcm9wOiAocHJvcCkgPT4gcHJvcCAhPT0gJ2xhYmVsQmFja2dyb3VuZENvbG9yJyxcbn0pKCh7IHRoZW1lIH0pID0+ICh7XG4gIHJpZ2h0OiAwLFxuICBsZWZ0OiAndW5zZXQnLFxuICB6SW5kZXg6IDEsXG4gIHBhZGRpbmdMZWZ0OiA4LFxuICB0cmFuc2Zvcm06ICd1bnNldCcsXG4gIGJhY2tncm91bmRDb2xvcjogdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF0sXG59KSk7XG5cbmNvbnN0IERhc2hlZExpbmU6IGFueSA9IHN0eWxlZCgnZGl2Jywge1xuICBzaG91bGRGb3J3YXJkUHJvcDogKHByb3ApID0+IHByb3AgIT09ICdsYWJlbEJhY2tncm91bmRDb2xvcicsXG59KSgoeyB0aGVtZSwgbGFiZWxCYWNrZ3JvdW5kQ29sb3IgfTogYW55KSA9PiAoe1xuICB3aWR0aDogNDAsXG4gIGhlaWdodDogMCxcbiAgYmFja2dyb3VuZENvbG9yOiBsYWJlbEJhY2tncm91bmRDb2xvciB8fCB0aGVtZS5wYWxldHRlLmJhY2tncm91bmQuZGVmYXVsdCxcbiAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gIGxlZnQ6IDIwLFxuICB0b3A6IDksXG4gIGJvcmRlclRvcDogYDJweCBkYXNoZWQgJHt0aGVtZS5wYWxldHRlLnRleHQucHJpbWFyeX1gLFxuICB6SW5kZXg6IDEsXG59KSk7XG5cbmNvbnN0IFNsaWRlcjogYW55ID0gc3R5bGVkKCdkaXYnKSgoeyBsZWZ0IH06IHsgbGVmdDogbnVtYmVyIH0pID0+ICh7XG4gIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIGxlZnQ6IGxlZnQsXG4gIHRyYW5zaXRpb246ICdsZWZ0IDUwMG1zIGVhc2UtaW4tb3V0JyxcbiAgbWluV2lkdGg6ICcxMDAlJyxcbn0pKTtcblxuZXhwb3J0IHR5cGUgQ29uZmlybWF0aW9uVHJhY2tlclByb3BzID0ge1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIGN1cnJlbnRDb3VudDogbnVtYmVyO1xuICBsYWJlbEJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgcmVxdWlyZWRDb3VudDogbnVtYmVyO1xuICBzdGFydGVkOiBib29sZWFuO1xufTtcblxuZXhwb3J0IGNvbnN0IENvbmZpcm1hdGlvblRyYWNrZXIgPSBtZW1vKGZ1bmN0aW9uIENvbmZpcm1hdGlvblRyYWNrZXIoe1xuICBsYWJlbEJhY2tncm91bmRDb2xvciA9ICcjMDAwJyxcbiAgc3RhcnRlZCxcbiAgcmVxdWlyZWRDb3VudCxcbiAgY3VycmVudENvdW50LFxuICAuLi5wcm9wc1xufTogQ29uZmlybWF0aW9uVHJhY2tlclByb3BzKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9ydWxlcy1vZi1ob29rc1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IG51bWJlck9mRG90cyA9IHJlcXVpcmVkQ291bnQgLSAxO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvcnVsZXMtb2YtaG9va3NcbiAgY29uc3QgY29udGFpbmVyUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgY29uc3QgZG90czogSlNYLkVsZW1lbnRbXSA9IFtdO1xuICBsZXQgbGVmdCA9IDA7XG5cbiAgY29uc3QgY2FsY3VsYXRlTGluZVdpZHRoID0gKCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyUmVmLmN1cnJlbnQ/LmNsaWVudFdpZHRoO1xuXG4gICAgaWYgKCFjb250YWluZXJXaWR0aCkge1xuICAgICAgcmV0dXJuIG51bWJlck9mRG90cyA9PT0gMSA/IDEyNSA6IDkwO1xuICAgIH1cblxuICAgIGNvbnN0IGRpdmlkZXIgPSBudW1iZXJPZkRvdHMgPCAzID8gMiA6IDM7XG4gICAgY29uc3QgbXVsdGlwbGllciA9IG51bWJlck9mRG90cyA8IDMgPyAzIDogNDtcblxuICAgIHJldHVybiAoY29udGFpbmVyV2lkdGggLSBtdWx0aXBsaWVyICogMjApIC8gZGl2aWRlcjtcbiAgfTtcblxuICBjb25zdCByZW5kZXJMaW5lID0gKGNvbXBsZXRlOiBib29sZWFuLCBhY3RpdmU6IGJvb2xlYW4sIGdyb3cgPSBmYWxzZSkgPT4gKFxuICAgIDxMaW5lXG4gICAgICB3aWR0aD17Y2FsY3VsYXRlTGluZVdpZHRoKCl9XG4gICAgICBjb21wbGV0ZT17Y29tcGxldGV9XG4gICAgICBhY3RpdmU9e2FjdGl2ZX1cbiAgICAgIGdyb3c9e2dyb3d9XG4gICAgPlxuICAgICAge2FjdGl2ZSAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgPERvdCAvPlxuICAgICAgICAgIDxEb3QgZGVsYXk9ezAuNDV9IC8+XG4gICAgICAgICAgPERvdCBkZWxheT17MC45fSAvPlxuICAgICAgICA8Lz5cbiAgICAgICl9XG4gICAgPC9MaW5lPlxuICApO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IG51bWJlck9mRG90czsgaSsrKSB7XG4gICAgY29uc3QgYWN0aXZlID0gc3RhcnRlZCAmJiBjdXJyZW50Q291bnQgPCBpICYmIGN1cnJlbnRDb3VudCA+PSBpIC0gMTtcbiAgICBkb3RzLnB1c2goXG4gICAgICA8RnJhZ21lbnQga2V5PXtgY29udGFpbmVyLSR7aX1gfT5cbiAgICAgICAge3JlbmRlckxpbmUoY3VycmVudENvdW50ID49IGksIGFjdGl2ZSl9XG4gICAgICAgIDxCb3hcbiAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiXG4gICAgICAgICAgZGlyZWN0aW9uPVwiY29sdW1uXCJcbiAgICAgICAgICBhbGlnbj1cImNlbnRlclwiXG4gICAgICAgICAgcG9zaXRpb249XCJyZWxhdGl2ZVwiXG4gICAgICAgID5cbiAgICAgICAgICA8Q2lyY2xlXG4gICAgICAgICAgICBjb21wbGV0ZT17Y3VycmVudENvdW50ID49IGl9XG4gICAgICAgICAgICBhY3RpdmU9e2FjdGl2ZX1cbiAgICAgICAgICAgIGxhYmVsQmFja2dyb3VuZENvbG9yPXtsYWJlbEJhY2tncm91bmRDb2xvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxMYWJlbCBtYXJnaW49XCIyNXB4IDAgMFwiIHNpemU9ezE0fT5cbiAgICAgICAgICAgIHtpfS97cmVxdWlyZWRDb3VudH1cbiAgICAgICAgICA8L0xhYmVsPlxuICAgICAgICA8L0JveD5cbiAgICAgIDwvRnJhZ21lbnQ+LFxuICAgICk7XG4gIH1cblxuICBjb25zdCBsYXN0U3RlcEFjdGl2ZSA9XG4gICAgc3RhcnRlZCAmJiBjdXJyZW50Q291bnQgPCByZXF1aXJlZENvdW50ICYmIGN1cnJlbnRDb3VudCA+PSBudW1iZXJPZkRvdHM7XG4gIGNvbnN0IHNob3dCcmVha0VuZCA9IGN1cnJlbnRDb3VudCA8IHJlcXVpcmVkQ291bnQgLSAyICYmIHJlcXVpcmVkQ291bnQgPiAzO1xuXG4gIGlmIChjdXJyZW50Q291bnQgPiAxICYmIHJlcXVpcmVkQ291bnQgPiAyKSB7XG4gICAgaWYgKCFzaG93QnJlYWtFbmQpIHtcbiAgICAgIGxlZnQgPSAtKGNhbGN1bGF0ZUxpbmVXaWR0aCgpICsgMjApICogKHJlcXVpcmVkQ291bnQgLSAzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdCA9IC0oY2FsY3VsYXRlTGluZVdpZHRoKCkgKyAyMCkgKiAoY3VycmVudENvdW50IC0gMSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICByZWY9e2NvbnRhaW5lclJlZn1cbiAgICAgIHN4PXt7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIG1pbldpZHRoOiAzMTEsXG4gICAgICAgIG1heFdpZHRoOiAnMTAwJScsXG4gICAgICB9fVxuICAgICAgey4uLnByb3BzfVxuICAgID5cbiAgICAgIDxCb3hcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICAgICAgbWFyZ2luVG9wOiAnMTBweCcsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDaXJjbGVcbiAgICAgICAgICBjb21wbGV0ZT17c3RhcnRlZH1cbiAgICAgICAgICBhY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgIGxhYmVsQmFja2dyb3VuZENvbG9yPXtsYWJlbEJhY2tncm91bmRDb2xvcn1cbiAgICAgICAgLz5cbiAgICAgICAgPFN0YXJ0TGFiZWxcbiAgICAgICAgICBsYWJlbEJhY2tncm91bmRDb2xvcj17bGFiZWxCYWNrZ3JvdW5kQ29sb3J9XG4gICAgICAgICAgbWFyZ2luPVwiMjVweCAwIDAgMFwiXG4gICAgICAgICAgc2l6ZT17MTR9XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnU3RhcnQnKX1cbiAgICAgICAgPC9TdGFydExhYmVsPlxuICAgICAgICB7Y3VycmVudENvdW50ID4gMSAmJiAoXG4gICAgICAgICAgPERhc2hlZExpbmUgbGFiZWxCYWNrZ3JvdW5kQ29sb3I9e2xhYmVsQmFja2dyb3VuZENvbG9yfSAvPlxuICAgICAgICApfVxuICAgICAgPC9Cb3g+XG4gICAgICA8Qm94XG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBoZWlnaHQ6IDYzLFxuICAgICAgICAgIHA6ICcxMHB4IDAgMCAwJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFNsaWRlciBsZWZ0PXtgJHtsZWZ0fXB4YH0+XG4gICAgICAgICAge2RvdHN9XG4gICAgICAgICAge3JlbmRlckxpbmUoXG4gICAgICAgICAgICBjdXJyZW50Q291bnQgPj0gcmVxdWlyZWRDb3VudCxcbiAgICAgICAgICAgIGxhc3RTdGVwQWN0aXZlLFxuICAgICAgICAgICAgcmVxdWlyZWRDb3VudCA9PT0gMSxcbiAgICAgICAgICApfVxuICAgICAgICA8L1NsaWRlcj5cbiAgICAgIDwvQm94PlxuICAgICAgPEJveFxuICAgICAgICBzeD17e1xuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgICAgICBtYXJnaW5Ub3A6ICcxMHB4JyxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPENpcmNsZVxuICAgICAgICAgIGNvbXBsZXRlPXtjdXJyZW50Q291bnQgPj0gcmVxdWlyZWRDb3VudH1cbiAgICAgICAgICBhY3RpdmU9e2xhc3RTdGVwQWN0aXZlfVxuICAgICAgICAvPlxuICAgICAgICA8RmluaXNoTGFiZWwgbWFyZ2luPVwiMjVweCAwIDAgMFwiIHNpemU9ezE0fT5cbiAgICAgICAgICB7dCgnRmluYWwnKX1cbiAgICAgICAgPC9GaW5pc2hMYWJlbD5cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApO1xufSk7XG4iLCJpbXBvcnQgeyB1c2VUb2tlbkluZm9Db250ZXh0IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1icmlkZ2Utc2RrJztcblxuLy8gVGhpcyBpcyBhIGNvcHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYXZhLWxhYnMvY29yZS13ZWItcHJvcGVydGllcy9ibG9iL2RldmVsb3AvcGFja2FnZXMvd2ViL3NyYy9ob29rcy9icmlkZ2UvdXNlQ29pbmdlY2tvSWQudHNcblxuY29uc3QgS05PV05fSURTID0ge1xuICBCVEM6ICdiaXRjb2luJyxcbiAgQVZBWDogJ2F2YWxhbmNoZS0yJyxcbiAgRVRIOiAnZXRoZXJldW0nLFxufTtcblxuZXhwb3J0IGNvbnN0IHVzZUNvaW5HZWNrb0lkID0gKHRva2VuU3ltYm9sPzogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgY29uc3QgdG9rZW5JbmZvRGF0YSA9IHVzZVRva2VuSW5mb0NvbnRleHQoKTtcblxuICByZXR1cm4gKFxuICAgIHRva2VuU3ltYm9sICYmXG4gICAgKEtOT1dOX0lEU1t0b2tlblN5bWJvbF0gfHwgdG9rZW5JbmZvRGF0YT8uW3Rva2VuU3ltYm9sXT8uY29pbmdlY2tvSWQpXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5cbmV4cG9ydCBjb25zdCB1c2VJc01haW5uZXQgPSAoKSA9PiB7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgcmV0dXJuICFuZXR3b3JrPy5pc1Rlc3RuZXQ7XG59O1xuIiwiaW1wb3J0IHsgQmxvY2tjaGFpbiwgdXNlUHJpY2UsIHVzZUJyaWRnZVNESyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSwgdXNlUGFyYW1zIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUJyaWRnZUNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JyaWRnZVByb3ZpZGVyJztcbmltcG9ydCB7IFZzQ3VycmVuY3lUeXBlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jb2luZ2Vja28tc2RrJztcbmltcG9ydCB7IEVsYXBzZWRUaW1lciB9IGZyb20gJy4vY29tcG9uZW50cy9FbGFwc2VkVGltZXInO1xuaW1wb3J0IHsgdXNlSXNNYWlubmV0IH0gZnJvbSAnQHNyYy9ob29rcy91c2VJc01haW5uZXQnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgZ2V0RXhwbG9yZXJBZGRyZXNzIH0gZnJvbSAnQHNyYy91dGlscy9nZXRFeHBsb3JlckFkZHJlc3MnO1xuaW1wb3J0IHsgdXNlTG9nb1VyaUZvckJyaWRnZVRyYW5zYWN0aW9uIH0gZnJvbSAnLi9ob29rcy91c2VMb2dvVXJpRm9yQnJpZGdlVHJhbnNhY3Rpb24nO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZUNvaW5HZWNrb0lkIH0gZnJvbSAnQHNyYy9ob29rcy91c2VDb2luR2Vja29JZCc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIFN0YWNrLFxuICB0b2FzdCxcbiAgVG9hc3RDYXJkLFxuICBTY3JvbGxiYXJzLFxuICBUeXBvZ3JhcGh5LFxuICBDYXJkLFxuICBEaXZpZGVyLFxuICBDaGV2cm9uVXBJY29uLFxuICBJY29uQnV0dG9uLFxuICBFeHRlcm5hbExpbmtJY29uLFxuICBDb2xsYXBzZSxcbiAgQ2hldnJvbkRvd25JY29uLFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IERpYWxvZyBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0RpYWxvZyc7XG5pbXBvcnQgeyBOZXR3b3JrTG9nbyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vTmV0d29ya0xvZ28nO1xuaW1wb3J0IHsgQ29uZmlybWF0aW9uVHJhY2tlciB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vQ29uZmlybWF0aW9uVHJhY2tlcic7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcblxuaW1wb3J0IHsgYmxvY2tjaGFpblRvTmV0d29yayB9IGZyb20gJy4vdXRpbHMvYmxvY2tjaGFpbkNvbnZlcnNpb24nO1xuaW1wb3J0IHsgZ2V0TmF0aXZlVG9rZW5TeW1ib2wgfSBmcm9tICcuL3V0aWxzL2dldE5hdGl2ZVRva2VuU3ltYm9sJztcbmltcG9ydCB7IGlzVW5pZmllZEJyaWRnZVRyYW5zZmVyIH0gZnJvbSAnLi91dGlscy9pc1VuaWZpZWRCcmlkZ2VUcmFuc2Zlcic7XG5cbmltcG9ydCB7IHVzZUJyaWRnZUFtb3VudHMgfSBmcm9tICcuL2hvb2tzL3VzZUJyaWRnZUFtb3VudHMnO1xuaW1wb3J0IHsgdXNlU3luY0JyaWRnZUNvbmZpZyB9IGZyb20gJy4vaG9va3MvdXNlU3luY0JyaWRnZUNvbmZpZyc7XG5pbXBvcnQgeyB1c2VCcmlkZ2VOZXR3b3JrUHJpY2UgfSBmcm9tICcuL2hvb2tzL3VzZUJyaWRnZU5ldHdvcmtQcmljZSc7XG5pbXBvcnQgeyB1c2VCcmlkZ2VUcmFuc2ZlclN0YXR1cyB9IGZyb20gJy4vaG9va3MvdXNlQnJpZGdlVHJhbnNmZXJTdGF0dXMnO1xuXG5pbXBvcnQgeyBCcmlkZ2VDYXJkIH0gZnJvbSAnLi9jb21wb25lbnRzL0JyaWRnZUNhcmQnO1xuaW1wb3J0IHsgT2ZmbG9hZFRpbWVyVG9vbHRpcCB9IGZyb20gJy4vY29tcG9uZW50cy9PZmZsb2FkVGltZXJUb29sdGlwJztcbmltcG9ydCB7IHVzZVBlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbnMgfSBmcm9tICcuL2hvb2tzL3VzZVBlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbnMnO1xuaW1wb3J0IHsgdXNlVW5pZmllZEJyaWRnZUNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1VuaWZpZWRCcmlkZ2VQcm92aWRlcic7XG5pbXBvcnQgeyBUb2tlblVuaXQgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5cbmNvbnN0IEJyaWRnZVRyYW5zYWN0aW9uU3RhdHVzID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgcGFyYW1zID0gdXNlUGFyYW1zPHtcbiAgICBjb21wbGV0ZTogc3RyaW5nO1xuICAgIHNvdXJjZUJsb2NrY2hhaW46IEJsb2NrY2hhaW47XG4gICAgdHhIYXNoOiBzdHJpbmc7XG4gICAgdHhUaW1lc3RhbXA6IHN0cmluZztcbiAgfT4oKTtcbiAgY29uc3QgeyBjdXJyZW5jeUZvcm1hdHRlciwgY3VycmVuY3kgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICBjb25zdCB7XG4gICAgYWNjb3VudHM6IHsgYWN0aXZlOiBhY3RpdmVBY2NvdW50IH0sXG4gIH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcbiAgY29uc3QgeyBnZXRFcnJvck1lc3NhZ2UgfSA9IHVzZVVuaWZpZWRCcmlkZ2VDb250ZXh0KCk7XG4gIGNvbnN0IGJyaWRnZVRyYW5zYWN0aW9ucyA9IHVzZVBlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbnMoKTtcbiAgY29uc3QgeyByZW1vdmVCcmlkZ2VUcmFuc2FjdGlvbiB9ID0gdXNlQnJpZGdlQ29udGV4dCgpO1xuICBjb25zdCBbZnJvbUNhcmRPcGVuLCBzZXRGcm9tQ2FyZE9wZW5dID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xuICBjb25zdCBbdG9DYXJkT3Blbiwgc2V0VG9DYXJkT3Blbl0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IFt0b2FzdFNob3duLCBzZXRUb2FzdFNob3duXSA9IHVzZVN0YXRlPGJvb2xlYW4+KCk7XG4gIGNvbnN0IFtpc0RpYWxvZ09wZW4sIHNldElzRGlhbG9nT3Blbl0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IGlzTWFpbm5ldCA9IHVzZUlzTWFpbm5ldCgpO1xuICBjb25zdCBicmlkZ2VUcmFuc2FjdGlvbiA9IHVzZU1lbW8oXG4gICAgKCkgPT5cbiAgICAgIGJyaWRnZVRyYW5zYWN0aW9ucy5maW5kKFxuICAgICAgICAoeyBzb3VyY2VUeEhhc2ggfSkgPT4gc291cmNlVHhIYXNoID09PSBwYXJhbXMudHhIYXNoLFxuICAgICAgKSxcbiAgICBbcGFyYW1zLnR4SGFzaCwgYnJpZGdlVHJhbnNhY3Rpb25zXSxcbiAgKTtcblxuICBjb25zdCBzeW1ib2wgPSB1c2VNZW1vKFxuICAgICgpID0+XG4gICAgICBpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlcihicmlkZ2VUcmFuc2FjdGlvbilcbiAgICAgICAgPyBicmlkZ2VUcmFuc2FjdGlvbi5hc3NldC5zeW1ib2xcbiAgICAgICAgOiBicmlkZ2VUcmFuc2FjdGlvbj8uc3ltYm9sLFxuICAgIFticmlkZ2VUcmFuc2FjdGlvbl0sXG4gICk7XG4gIGNvbnN0IGNvaW5nZWNrb0lkID0gdXNlQ29pbkdlY2tvSWQoc3ltYm9sKTtcbiAgY29uc3QgbG9nb1VyaSA9IHVzZUxvZ29VcmlGb3JCcmlkZ2VUcmFuc2FjdGlvbihicmlkZ2VUcmFuc2FjdGlvbik7XG4gIGNvbnN0IHsgbmV0d29ya3MsIGdldE5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG5cbiAgY29uc3QgeyBicmlkZ2VDb25maWcgfSA9IHVzZUJyaWRnZVNESygpO1xuICB1c2VTeW5jQnJpZGdlQ29uZmlnKCk7XG5cbiAgY29uc3Qgc291cmNlTmV0d29yayA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChicmlkZ2VUcmFuc2FjdGlvbikge1xuICAgICAgcmV0dXJuIGJsb2NrY2hhaW5Ub05ldHdvcmsoXG4gICAgICAgIGJyaWRnZVRyYW5zYWN0aW9uLnNvdXJjZUNoYWluLFxuICAgICAgICBuZXR3b3JrcyxcbiAgICAgICAgYnJpZGdlQ29uZmlnLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSwgW2JyaWRnZVRyYW5zYWN0aW9uLCBuZXR3b3JrcywgYnJpZGdlQ29uZmlnXSk7XG5cbiAgY29uc3QgdGFyZ2V0TmV0d29yayA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChicmlkZ2VUcmFuc2FjdGlvbikge1xuICAgICAgcmV0dXJuIGJsb2NrY2hhaW5Ub05ldHdvcmsoXG4gICAgICAgIGJyaWRnZVRyYW5zYWN0aW9uLnRhcmdldENoYWluLFxuICAgICAgICBuZXR3b3JrcyxcbiAgICAgICAgYnJpZGdlQ29uZmlnLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSwgW2JyaWRnZVRyYW5zYWN0aW9uLCBuZXR3b3JrcywgYnJpZGdlQ29uZmlnXSk7XG5cbiAgY29uc3QgYXNzZXRQcmljZSA9IHVzZVByaWNlKFxuICAgIGNvaW5nZWNrb0lkLFxuICAgIGN1cnJlbmN5LnRvTG93ZXJDYXNlKCkgYXMgVnNDdXJyZW5jeVR5cGUsXG4gICk7XG4gIGNvbnN0IG5ldHdvcmtQcmljZSA9IHVzZUJyaWRnZU5ldHdvcmtQcmljZShicmlkZ2VUcmFuc2FjdGlvbj8uc291cmNlQ2hhaW4pO1xuICBjb25zdCB0YXJnZXROZXR3b3JrUHJpY2UgPSB1c2VCcmlkZ2VOZXR3b3JrUHJpY2UoXG4gICAgYnJpZGdlVHJhbnNhY3Rpb24/LnRhcmdldENoYWluLFxuICApO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgeyBhbW91bnQsIHNvdXJjZU5ldHdvcmtGZWUsIHRhcmdldE5ldHdvcmtGZWUgfSA9XG4gICAgdXNlQnJpZGdlQW1vdW50cyhicmlkZ2VUcmFuc2FjdGlvbik7XG5cbiAgY29uc3QgZm9ybWF0dGVkTmV0d29ya1ByaWNlID1cbiAgICBuZXR3b3JrUHJpY2UgJiYgc291cmNlTmV0d29ya0ZlZVxuICAgICAgPyBjdXJyZW5jeUZvcm1hdHRlcihuZXR3b3JrUHJpY2UubXVsKHNvdXJjZU5ldHdvcmtGZWUpLnRvTnVtYmVyKCkpXG4gICAgICA6ICctJztcblxuICBjb25zdCBmb3JtYXR0ZWRUYXJnZXROZXR3b3JrUHJpY2UgPVxuICAgIHRhcmdldE5ldHdvcmtQcmljZSAmJiB0YXJnZXROZXR3b3JrRmVlXG4gICAgICA/IGN1cnJlbmN5Rm9ybWF0dGVyKHRhcmdldE5ldHdvcmtQcmljZS5tdWwodGFyZ2V0TmV0d29ya0ZlZSkudG9OdW1iZXIoKSlcbiAgICAgIDogJy0nO1xuXG4gIGNvbnN0IHtcbiAgICBpc0NvbXBsZXRlLFxuICAgIHNvdXJjZUN1cnJlbnRDb25maXJtYXRpb25zLFxuICAgIHNvdXJjZVJlcXVpcmVkQ29uZmlybWF0aW9ucyxcbiAgICB0YXJnZXRDdXJyZW50Q29uZmlybWF0aW9ucyxcbiAgICB0YXJnZXRSZXF1aXJlZENvbmZpcm1hdGlvbnMsXG4gIH0gPSB1c2VCcmlkZ2VUcmFuc2ZlclN0YXR1cyhicmlkZ2VUcmFuc2FjdGlvbik7XG5cbiAgY29uc3QgZXJyb3JDb2RlID0gaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIoYnJpZGdlVHJhbnNhY3Rpb24pXG4gICAgPyBicmlkZ2VUcmFuc2FjdGlvbi5lcnJvckNvZGVcbiAgICA6IHVuZGVmaW5lZDtcbiAgY29uc3QgaGFzRXJyb3IgPSB0eXBlb2YgZXJyb3JDb2RlICE9PSAndW5kZWZpbmVkJztcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChicmlkZ2VUcmFuc2FjdGlvbiAmJiBpc0NvbXBsZXRlICYmICF0b2FzdFNob3duKSB7XG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvckNvZGUgPyBnZXRFcnJvck1lc3NhZ2UoZXJyb3JDb2RlKSA6ICcnO1xuICAgICAgY29uc3QgdG9hc3RlcklkID0gdG9hc3QuY3VzdG9tKFxuICAgICAgICA8VG9hc3RDYXJkXG4gICAgICAgICAgb25EaXNtaXNzPXsoKSA9PiB0b2FzdC5yZW1vdmUodG9hc3RlcklkKX1cbiAgICAgICAgICB2YXJpYW50PXtoYXNFcnJvciA/ICdlcnJvcicgOiAnc3VjY2Vzcyd9XG4gICAgICAgICAgdGl0bGU9e2hhc0Vycm9yID8gdCgnQnJpZGdlIEZhaWxlZCcpIDogdCgnQnJpZGdlIFN1Y2Nlc3NmdWwnKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtoYXNFcnJvclxuICAgICAgICAgICAgPyBlcnJvck1lc3NhZ2VcbiAgICAgICAgICAgIDogdChgWW91IHRyYW5zZmVycmVkIHt7YW1vdW50fX0ge3tzeW1ib2x9fSFgLCB7XG4gICAgICAgICAgICAgICAgYW1vdW50LFxuICAgICAgICAgICAgICAgIHN5bWJvbCxcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgIDwvVG9hc3RDYXJkPixcbiAgICAgICAgeyBkdXJhdGlvbjogSW5maW5pdHkgfSxcbiAgICAgICk7XG5cbiAgICAgIHNldFRvYXN0U2hvd24odHJ1ZSk7XG4gICAgfVxuICAgIC8vIFdlIG9ubHkgd2FudCB0aGlzIHRvIHRyaWdnZXIgd2hlbiBgY29tcGxldGVgIHN3aXRjaGVzIHRvIGB0cnVlYCBhbmQgb24gbG9hZFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW2JyaWRnZVRyYW5zYWN0aW9uPy5jb21wbGV0ZWRBdCwgdG9hc3RTaG93bl0pO1xuXG4gIGNvbnN0IGlzT2ZmYm9hcmRpbmcgPVxuICAgIGJyaWRnZVRyYW5zYWN0aW9uPy5zb3VyY2VDaGFpbiA9PT0gQmxvY2tjaGFpbi5BVkFMQU5DSEUgJiZcbiAgICBicmlkZ2VUcmFuc2FjdGlvbj8udGFyZ2V0Q2hhaW4gPT09IEJsb2NrY2hhaW4uQklUQ09JTjtcblxuICBjb25zdCBvZmZib2FyZGluZ0RlbGF5ID1cbiAgICBicmlkZ2VDb25maWcuY29uZmlnPy5jcml0aWNhbEJpdGNvaW4ub2ZmYm9hcmREZWxheVNlY29uZHM7XG5cbiAgY29uc3QgaGFzT2ZmQm9hcmRpbmdEZWxheSA9IHR5cGVvZiBvZmZib2FyZGluZ0RlbGF5ID09PSAnbnVtYmVyJztcblxuICBpZiAoIWFjdGl2ZUFjY291bnQpIHtcbiAgICBoaXN0b3J5LnB1c2goJy9ob21lJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBicmlkZ2VBbW91bnQgPSBicmlkZ2VUcmFuc2FjdGlvblxuICAgID8gaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIoYnJpZGdlVHJhbnNhY3Rpb24pXG4gICAgICA/IG5ldyBUb2tlblVuaXQoXG4gICAgICAgICAgYnJpZGdlVHJhbnNhY3Rpb24uYW1vdW50LFxuICAgICAgICAgIGJyaWRnZVRyYW5zYWN0aW9uLmFzc2V0LmRlY2ltYWxzLFxuICAgICAgICAgIGJyaWRnZVRyYW5zYWN0aW9uLmFzc2V0LnN5bWJvbCxcbiAgICAgICAgKS50b0Rpc3BsYXkoKVxuICAgICAgOiBicmlkZ2VUcmFuc2FjdGlvbi5hbW91bnQudG9TdHJpbmcoKVxuICAgIDogJyc7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICBwdDogMSxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFBhZ2VUaXRsZSBvbkJhY2tDbGljaz17KCkgPT4gaGlzdG9yeS5yZXBsYWNlKCcvYXNzZXRzJyl9PlxuICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XG4gICAgICAgICAge3QoJ1RyYW5zYWN0aW9uIFN0YXR1cycpfVxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHN4PXt7IG1yOiAxIH19XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChicmlkZ2VUcmFuc2FjdGlvbiAmJiBpc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgaGlzdG9yeS5yZXBsYWNlKCcvaG9tZScpO1xuICAgICAgICAgICAgICAgIHJlbW92ZUJyaWRnZVRyYW5zYWN0aW9uKGJyaWRnZVRyYW5zYWN0aW9uLnNvdXJjZVR4SGFzaCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0SXNEaWFsb2dPcGVuKHRydWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpc0NvbXBsZXRlID8gdCgnQ2xvc2UnKSA6IHQoJ0hpZGUnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvUGFnZVRpdGxlPlxuICAgICAge2JyaWRnZVRyYW5zYWN0aW9uICYmIChcbiAgICAgICAgPFNjcm9sbGJhcnM+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IGFsaWduSXRlbXM6ICdjZW50ZXInLCBteDogMiwgbWI6IDQsIHJvd0dhcDogMiB9fT5cbiAgICAgICAgICAgIDxOZXR3b3JrTG9nb1xuICAgICAgICAgICAgICBzcmM9e2xvZ29Vcml9XG4gICAgICAgICAgICAgIHdpZHRoPVwiNTZweFwiXG4gICAgICAgICAgICAgIGhlaWdodD1cIjU2cHhcIlxuICAgICAgICAgICAgICBkZWZhdWx0U2l6ZT17NDh9XG4gICAgICAgICAgICAgIHpJbmRleD17Mn1cbiAgICAgICAgICAgICAgd2l0aEJhY2tncm91bmRcbiAgICAgICAgICAgICAgc2hvd0NvbXBsZXRlPXtpc0NvbXBsZXRlICYmICFoYXNFcnJvcn1cbiAgICAgICAgICAgICAgc2hvd0dsb2JlTWFyZ2luPXt0cnVlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDYXJkIC8vIHNlbmRpbmcgYW1vdW50IChUb3AgQ2FyZClcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgICAgICAgcHQ6IDQsXG4gICAgICAgICAgICAgICAgbXQ6IC01LFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAgICAgICAgICB7dCgnU2VuZGluZyBBbW91bnQnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnIH19PlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg2XCI+e2JyaWRnZUFtb3VudH08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiaDZcIlxuICAgICAgICAgICAgICAgICAgICBzeD17eyBtbDogMSwgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3N5bWJvbH1cbiAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAgICAgICAgICB7YW1vdW50ICYmXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5Rm9ybWF0dGVyKGFzc2V0UHJpY2UubXVsKGFtb3VudCkudG9OdW1iZXIoKSl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgICAgPEJyaWRnZUNhcmQgLy8gZnJvbSBjaGFpbiAoTWlkZGxlIENhcmQpXG4gICAgICAgICAgICAgIGlzV2FpdGluZz17ZmFsc2V9IC8vIHN0YXJ0cyBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICBpc0RvbmU9e0Jvb2xlYW4oYnJpZGdlVHJhbnNhY3Rpb24udGFyZ2V0U3RhcnRlZEF0KX1cbiAgICAgICAgICAgICAgaXNUcmFuc2ZlckNvbXBsZXRlPXtpc0NvbXBsZXRlfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgICAgICAgIHt0KCdGcm9tJyl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgICBzeD17eyB0ZXh0VHJhbnNmb3JtOiAnY2FwaXRhbGl6ZScsIG1yOiAxIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlcihicmlkZ2VUcmFuc2FjdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICA/IGJyaWRnZVRyYW5zYWN0aW9uLnNvdXJjZUNoYWluLmNoYWluTmFtZVxuICAgICAgICAgICAgICAgICAgICAgIDogYnJpZGdlVHJhbnNhY3Rpb24uc291cmNlQ2hhaW59XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8TmV0d29ya0xvZ29cbiAgICAgICAgICAgICAgICAgICAgc3JjPXtzb3VyY2VOZXR3b3JrPy5sb2dvVXJpfVxuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjE2cHhcIlxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4PXsyfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIHticmlkZ2VUcmFuc2FjdGlvbi5zb3VyY2VUeEhhc2ggJiYgKFxuICAgICAgICAgICAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzb3VyY2UtdHgtbGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YS10eC1oYXNoPXticmlkZ2VUcmFuc2FjdGlvbi5zb3VyY2VUeEhhc2h9XG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRFeHBsb3JlckFkZHJlc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlVHJhbnNhY3Rpb24uc291cmNlQ2hhaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlVHJhbnNhY3Rpb24uc291cmNlVHhIYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTWFpbm5ldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXROZXR3b3JrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnX2JsYW5rJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ25vcmVmZXJyZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8RXh0ZXJuYWxMaW5rSWNvbiAvPlxuICAgICAgICAgICAgICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDxEaXZpZGVyIHN4PXt7IG15OiAxLjUgfX0gLz5cbiAgICAgICAgICAgICAge2JyaWRnZVRyYW5zYWN0aW9uLnRhcmdldFN0YXJ0ZWRBdCA/IChcbiAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnTmV0d29yayBGZWUnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgICAgICAgICAge3NvdXJjZU5ldHdvcmtGZWU/LnRvTnVtYmVyKCkudG9GaXhlZCg5KX17JyAnfVxuICAgICAgICAgICAgICAgICAgICAgICAge2dldE5hdGl2ZVRva2VuU3ltYm9sKGJyaWRnZVRyYW5zYWN0aW9uLnNvdXJjZUNoYWluKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdHRlZE5ldHdvcmtQcmljZX0ge2N1cnJlbmN5fVxuICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICA8RGl2aWRlciBzeD17eyBteTogMiB9fSAvPlxuICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnVGltZSBFbGFwc2VkJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgPEVsYXBzZWRUaW1lclxuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZT17YnJpZGdlVHJhbnNhY3Rpb24uc291cmNlU3RhcnRlZEF0fVxuICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU9e2JyaWRnZVRyYW5zYWN0aW9uLnRhcmdldFN0YXJ0ZWRBdH1cbiAgICAgICAgICAgICAgICAgICAgICBoYXNFcnJvcj17aGFzRXJyb3J9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdDb25maXJtYXRpb25zJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IG1yOiAyIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge3NvdXJjZUN1cnJlbnRDb25maXJtYXRpb25zfS9cbiAgICAgICAgICAgICAgICAgICAgICAgIHtzb3VyY2VSZXF1aXJlZENvbmZpcm1hdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIDxFbGFwc2VkVGltZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZT17YnJpZGdlVHJhbnNhY3Rpb24uc291cmNlU3RhcnRlZEF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZT17YnJpZGdlVHJhbnNhY3Rpb24udGFyZ2V0U3RhcnRlZEF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3I9e2hhc0Vycm9yfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgPENvbmZpcm1hdGlvblRyYWNrZXJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRDb3VudD17c291cmNlUmVxdWlyZWRDb25maXJtYXRpb25zfVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q291bnQ9e3NvdXJjZUN1cnJlbnRDb25maXJtYXRpb25zfVxuICAgICAgICAgICAgICAgICAgICBsYWJlbEJhY2tncm91bmRDb2xvcj17dGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPENvbGxhcHNlIGluPXtmcm9tQ2FyZE9wZW59PlxuICAgICAgICAgICAgICAgICAgICA8RGl2aWRlciBzeD17eyBteTogMiB9fSAvPlxuICAgICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3QoJ05ldHdvcmsgRmVlJyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtzb3VyY2VOZXR3b3JrRmVlPy50b051bWJlcigpLnRvRml4ZWQoOSl9eycgJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2dldE5hdGl2ZVRva2VuU3ltYm9sKGJyaWRnZVRyYW5zYWN0aW9uLnNvdXJjZUNoYWluKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdHRlZE5ldHdvcmtQcmljZX0ge2N1cnJlbmN5fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYXJvdW5kJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGcm9tQ2FyZE9wZW4oIWZyb21DYXJkT3Blbil9XG4gICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZVJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYjogMCxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge2Zyb21DYXJkT3BlbiA/IDxDaGV2cm9uRG93bkljb24gLz4gOiA8Q2hldnJvblVwSWNvbiAvPn1cbiAgICAgICAgICAgICAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvQnJpZGdlQ2FyZD5cbiAgICAgICAgICAgIDxCcmlkZ2VDYXJkIC8vIHRvIGNoYWluIChCb3R0b20gQ2FyZClcbiAgICAgICAgICAgICAgaXNXYWl0aW5nPXshYnJpZGdlVHJhbnNhY3Rpb24udGFyZ2V0U3RhcnRlZEF0fVxuICAgICAgICAgICAgICBpc0RvbmU9e2lzQ29tcGxldGV9XG4gICAgICAgICAgICAgIGlzVHJhbnNmZXJDb21wbGV0ZT17aXNDb21wbGV0ZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgICAgICAgIHt0KCdUbycpfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgc3g9e3sgdGV4dFRyYW5zZm9ybTogJ2NhcGl0YWxpemUnLCBtcjogMSB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7aXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIoYnJpZGdlVHJhbnNhY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgPyBicmlkZ2VUcmFuc2FjdGlvbi50YXJnZXRDaGFpbi5jaGFpbk5hbWVcbiAgICAgICAgICAgICAgICAgICAgICA6IGJyaWRnZVRyYW5zYWN0aW9uLnRhcmdldENoYWlufVxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgPE5ldHdvcmtMb2dvXG4gICAgICAgICAgICAgICAgICAgIHNyYz17dGFyZ2V0TmV0d29yaz8ubG9nb1VyaX1cbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIxNnB4XCJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMTZweFwiXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleD17Mn1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICB7YnJpZGdlVHJhbnNhY3Rpb24udGFyZ2V0VHhIYXNoICYmIChcbiAgICAgICAgICAgICAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwidGFyZ2V0LXR4LWxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdHgtaGFzaD17YnJpZGdlVHJhbnNhY3Rpb24udGFyZ2V0VHhIYXNofVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RXhwbG9yZXJBZGRyZXNzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyaWRnZVRyYW5zYWN0aW9uLnRhcmdldENoYWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyaWRnZVRyYW5zYWN0aW9uLnRhcmdldFR4SGFzaCB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc01haW5uZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TmV0d29yayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ19ibGFuaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdub3JlZmVycmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZVJpcHBsZVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPEV4dGVybmFsTGlua0ljb24gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8RGl2aWRlciBzeD17eyBteTogMS41IH19IC8+XG4gICAgICAgICAgICAgIHtpc0NvbXBsZXRlID8gKFxuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdOZXR3b3JrIEZlZScpfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGFyZ2V0TmV0d29ya0ZlZT8udG9OdW1iZXIoKS50b0ZpeGVkKDkpfXsnICd9XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2V0TmF0aXZlVG9rZW5TeW1ib2woYnJpZGdlVHJhbnNhY3Rpb24udGFyZ2V0Q2hhaW4pfVxuICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0dGVkVGFyZ2V0TmV0d29ya1ByaWNlfSB7Y3VycmVuY3l9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICAgIDxEaXZpZGVyIHN4PXt7IG15OiAyIH19IC8+XG4gICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdUaW1lIEVsYXBzZWQnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICB7YnJpZGdlVHJhbnNhY3Rpb24udGFyZ2V0U3RhcnRlZEF0ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8RWxhcHNlZFRpbWVyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU9e2JyaWRnZVRyYW5zYWN0aW9uLnRhcmdldFN0YXJ0ZWRBdH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU9e2JyaWRnZVRyYW5zYWN0aW9uLmNvbXBsZXRlZEF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3I9e2hhc0Vycm9yfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdDb25maXJtYXRpb25zJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IG1yOiAyIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge2lzVW5pZmllZEJyaWRnZVRyYW5zZmVyKGJyaWRnZVRyYW5zYWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICA/IGJyaWRnZVRyYW5zYWN0aW9uLnRhcmdldENvbmZpcm1hdGlvbkNvdW50IC8vIHdpdGggVW5pZmllZCBCcmlkZ2UsIHRoZSBTREsgcHJvdmlkZXMgaW5mbyBhYm91dCB0aGUgdGFyZ2V0IGNvbmZpcm1hdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBicmlkZ2VUcmFuc2FjdGlvbi5jb21wbGV0ZSAvLyB3aXRoIExlZ2FjeSBCcmlkZ2UsIGl0J3MgZWl0aGVyIDAgaWYgdHggaGFzIG5vdCBjb21wbGV0ZWQgeWV0LCBvciAxIGlmIGl0IGhhc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnMCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAvXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzVW5pZmllZEJyaWRnZVRyYW5zZmVyKGJyaWRnZVRyYW5zYWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYnJpZGdlVHJhbnNhY3Rpb24udGFyZ2V0UmVxdWlyZWRDb25maXJtYXRpb25Db3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMSAvLyBXaXRoIGxlZ2FjeSBBdmFsYW5jaGUgQnJpZGdlLCB3ZSBqdXN0IG5lZWQgMSBjb25maXJtYXRpb24gb24gdGhlIGRlc3RpbmF0aW9uIG5ldHdvcmtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgICAgPEVsYXBzZWRUaW1lclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3I9e2hhc0Vycm9yfVxuICAgICAgICAgICAgICAgICAgICAgICAgb2ZmbG9hZERlbGF5VG9vbHRpcD17XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzT2ZmYm9hcmRpbmcgJiYgaGFzT2ZmQm9hcmRpbmdEZWxheSA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8T2ZmbG9hZFRpbWVyVG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2ZmbG9hZERlbGF5U2Vjb25kcz17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyaWRnZUNvbmZpZy5jb25maWc/LmNyaXRpY2FsQml0Y29pblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vZmZib2FyZERlbGF5U2Vjb25kcyB8fCAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lPXticmlkZ2VUcmFuc2FjdGlvbi50YXJnZXRTdGFydGVkQXQgfHwgMH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU9e2JyaWRnZVRyYW5zYWN0aW9uLmNvbXBsZXRlZEF0fVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAge2JyaWRnZVRyYW5zYWN0aW9uLnRhcmdldFN0YXJ0ZWRBdCAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgPENvbmZpcm1hdGlvblRyYWNrZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb3VudD17dGFyZ2V0Q3VycmVudENvbmZpcm1hdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZENvdW50PXt0YXJnZXRSZXF1aXJlZENvbmZpcm1hdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydGVkPXtCb29sZWFuKGJyaWRnZVRyYW5zYWN0aW9uLnRhcmdldFN0YXJ0ZWRBdCl9XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEJhY2tncm91bmRDb2xvcj17dGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF19XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8Q29sbGFwc2UgaW49e3RvQ2FyZE9wZW59PlxuICAgICAgICAgICAgICAgICAgICAgICAgPERpdmlkZXIgc3g9e3sgbXk6IDIgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ05ldHdvcmsgRmVlJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0YXJnZXROZXR3b3JrRmVlPy50b051bWJlcigpLnRvRml4ZWQoOSl9eycgJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtnZXROYXRpdmVUb2tlblN5bWJvbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlVHJhbnNhY3Rpb24udGFyZ2V0Q2hhaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0dGVkVGFyZ2V0TmV0d29ya1ByaWNlfSB7Y3VycmVuY3l9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgICAgICAgICAgIDxTdGFjayBzeD17eyBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWFyb3VuZCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRUb0NhcmRPcGVuKCF0b0NhcmRPcGVuKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZVJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBiOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmLk11aUJ1dHRvbkJhc2Utcm9vdDpob3Zlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJnY29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RvQ2FyZE9wZW4gPyA8Q2hldnJvbkRvd25JY29uIC8+IDogPENoZXZyb25VcEljb24gLz59XG4gICAgICAgICAgICAgICAgICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9CcmlkZ2VDYXJkPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICAgICl9XG4gICAgICA8RGlhbG9nXG4gICAgICAgIG9wZW49e2lzRGlhbG9nT3Blbn1cbiAgICAgICAgaXNDbG9zZWFibGU9e2ZhbHNlfVxuICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRJc0RpYWxvZ09wZW4oZmFsc2UpfVxuICAgICAgICBjb250ZW50PXtcbiAgICAgICAgICA8U3RhY2sgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgc3g9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgICAge3QoJ0hpZGUgVHJhbnNhY3Rpb24nKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIG10OiAxIH19PlxuICAgICAgICAgICAgICB7dChcbiAgICAgICAgICAgICAgICAnWW91ciB0cmFuc2FjdGlvbiBpcyBwcm9jZXNzaW5nLiBHbyB0byBBY3Rpdml0eSB0byBzZWUgdGhlIGN1cnJlbnQgc3RhdHVzLicsXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBtdDogMyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgIHN4PXt7IG1iOiAxIH19XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY2FwdHVyZSgnQnJpZGdlVHJhbnNhY3Rpb25IaWRlJyk7XG4gICAgICAgICAgICAgICAgICBoaXN0b3J5LnJlcGxhY2UoJy9hc3NldHMnKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoJ0dvIHRvIEFjdGl2aXR5Jyl9XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNhcHR1cmUoJ0JyaWRnZVRyYW5zYWN0aW9uSGlkZUNhbmNlbCcpO1xuICAgICAgICAgICAgICAgICAgc2V0SXNEaWFsb2dPcGVuKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoJ0JhY2snKX1cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIH1cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEJyaWRnZVRyYW5zYWN0aW9uU3RhdHVzO1xuIiwiaW1wb3J0IHsgQ2FyZCwgQ2FyZFByb3BzLCB1c2VUaGVtZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbnR5cGUgQnJpZGdlQ2FyZFByb3BzID0gQ2FyZFByb3BzICYge1xuICBpc1dhaXRpbmc6IGJvb2xlYW47XG4gIGlzRG9uZTogYm9vbGVhbjtcbiAgaXNUcmFuc2ZlckNvbXBsZXRlOiBib29sZWFuO1xufTtcbmV4cG9ydCBjb25zdCBCcmlkZ2VDYXJkID0gKHtcbiAgaXNXYWl0aW5nLFxuICBpc0RvbmUsXG4gIGlzVHJhbnNmZXJDb21wbGV0ZSxcbiAgLi4ucHJvcHNcbn06IEJyaWRnZUNhcmRQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8Q2FyZFxuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgcDogMixcbiAgICAgICAgdHJhbnNpdGlvbjogdGhlbWUudHJhbnNpdGlvbnMuY3JlYXRlKCdvcGFjaXR5JyksXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogaXNEb25lID8gJ2JhY2tncm91bmQucGFwZXInIDogJ2dyZXkuODUwJyxcbiAgICAgICAgb3BhY2l0eTogIWlzVHJhbnNmZXJDb21wbGV0ZSAmJiAoaXNEb25lIHx8IGlzV2FpdGluZykgPyAwLjYgOiAndW5zZXQnLFxuICAgICAgfX1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIENoZWNrSWNvbixcbiAgSW5mb0NpcmNsZUljb24sXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICBzdHlsZWQsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlU3RvcHdhdGNoIH0gZnJvbSAncmVhY3QtdGltZXItaG9vayc7XG5cbmNvbnN0IFRpbWVFbGFwc2VkID0gc3R5bGVkKFN0YWNrLCB7XG4gIHNob3VsZEZvcndhcmRQcm9wOiAocHJvcCkgPT4gcHJvcCAhPT0gJ2NvbXBsZXRlJyxcbn0pPHtcbiAgY29tcGxldGU/OiBib29sZWFuO1xufT5gXG4gIG1pbi13aWR0aDogNzZweDsgLy8gdGhpcyBwcmV2ZW50cyB0aGUgY2hpcCBncm93aW5nIGFuZCBzaHJpbmtpbmcgZHVlIHRvIG51bWJlcnMgY2hhbmdpbmdcbiAgYm9yZGVyLXJhZGl1czogNjZweDtcbiAgcGFkZGluZzogMnB4IDhweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAkeyh7IGNvbXBsZXRlLCB0aGVtZSB9KSA9PlxuICAgIGNvbXBsZXRlID8gdGhlbWUucGFsZXR0ZS5zdWNjZXNzLmRhcmsgOiB0aGVtZS5wYWxldHRlLmdyZXlbNzAwXX07XG5gO1xuXG5jb25zdCBwYWRUaW1lRWxhcHNlZCA9IChzdGFydFRpbWU6IG51bWJlciwgZW5kVGltZT86IG51bWJlcik6IERhdGUgPT4ge1xuICAvLyBiYXNlZCBvbiBjcmVhdGVkIHRpbWUsIHNldCBlbGFwc2VkIHRpbWUgb2Zmc2V0XG5cbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZGlmZiA9IChlbmRUaW1lIHx8IG5vdykgLSBzdGFydFRpbWU7XG4gIGNvbnN0IG9mZnNldCA9IG5ldyBEYXRlKG5vdyArIGRpZmYpO1xuXG4gIHJldHVybiBvZmZzZXQ7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gRWxhcHNlZFRpbWVyKHtcbiAgb2ZmbG9hZERlbGF5VG9vbHRpcCxcbiAgc3RhcnRUaW1lLFxuICBlbmRUaW1lLFxuICBoYXNFcnJvcixcbn06IHtcbiAgb2ZmbG9hZERlbGF5VG9vbHRpcD86IFJlYWN0LlJlYWN0Q2hpbGQ7XG4gIHN0YXJ0VGltZTogbnVtYmVyO1xuICBlbmRUaW1lPzogbnVtYmVyO1xuICBoYXNFcnJvcj86IGJvb2xlYW47XG59KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBob3VycywgbWludXRlcywgc2Vjb25kcywgcmVzZXQsIGlzUnVubmluZyB9ID0gdXNlU3RvcHdhdGNoKHtcbiAgICBhdXRvU3RhcnQ6IGZhbHNlLFxuICAgIG9mZnNldFRpbWVzdGFtcDogcGFkVGltZUVsYXBzZWQoc3RhcnRUaW1lLCBlbmRUaW1lKSxcbiAgfSk7XG5cbiAgLy8gU3RvcCB0aGUgdGltZXIgd2hlbiB3ZSBrbm93IHRoZSBlbmRUaW1lXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHN0YXJ0VGltZSAmJiAhZW5kVGltZSAmJiAhaXNSdW5uaW5nKSB7XG4gICAgICByZXNldChwYWRUaW1lRWxhcHNlZChzdGFydFRpbWUsIGVuZFRpbWUpLCB0cnVlKTtcbiAgICB9XG4gIH0sIFtlbmRUaW1lLCBzdGFydFRpbWUsIHJlc2V0LCBpc1J1bm5pbmddKTtcblxuICBjb25zdCBkaXNwbGF5ZWRTZWNvbmRzID0gc2Vjb25kcy50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7XG4gICAgbWluaW11bUludGVnZXJEaWdpdHM6IDIsXG4gIH0pO1xuICBjb25zdCBkaXNwbGF5ZWRNaW51dGVzID0gbWludXRlcy50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7XG4gICAgbWluaW11bUludGVnZXJEaWdpdHM6IDIsXG4gIH0pO1xuICBjb25zdCBkaXNwbGF5ZWRIb3VycyA9IGhvdXJzID4gMCA/IGhvdXJzLnRvTG9jYWxlU3RyaW5nKCdlbi1VUycpIDogdW5kZWZpbmVkO1xuXG4gIGlmICghc3RhcnRUaW1lKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUaW1lRWxhcHNlZCBjb21wbGV0ZT17ISFlbmRUaW1lfT5cbiAgICAgICAgPFR5cG9ncmFwaHk+MDA6MDA8L1R5cG9ncmFwaHk+XG4gICAgICA8L1RpbWVFbGFwc2VkPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxUaW1lRWxhcHNlZFxuICAgICAgY29tcGxldGU9eyEhZW5kVGltZSAmJiAhaGFzRXJyb3J9XG4gICAgICBzeD17e1xuICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiBoYXNFcnJvciA/ICdjZW50ZXInIDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8VHlwb2dyYXBoeT5cbiAgICAgICAge2Rpc3BsYXllZEhvdXJzICYmIGAke2Rpc3BsYXllZEhvdXJzfTpgfVxuICAgICAgICB7ZGlzcGxheWVkTWludXRlc306e2Rpc3BsYXllZFNlY29uZHN9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICB7ZW5kVGltZSA/IChcbiAgICAgICAgaGFzRXJyb3IgPyBudWxsIDogKFxuICAgICAgICAgIDxDaGVja0ljb24gc2l6ZT1cIjEyXCIgc3g9e3sgbWw6IDAuNSB9fSAvPlxuICAgICAgICApXG4gICAgICApIDogKFxuICAgICAgICAob2ZmbG9hZERlbGF5VG9vbHRpcCA/PyAoXG4gICAgICAgICAgPFRvb2x0aXAgdGl0bGU9e3QoJ1RpbWUgRWxhcHNlZCcpfT5cbiAgICAgICAgICAgIDxJbmZvQ2lyY2xlSWNvbiAvPlxuICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgKSlcbiAgICAgICl9XG4gICAgPC9UaW1lRWxhcHNlZD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IEluZm9DaXJjbGVJY29uLCBMaW5rLCBUb29sdGlwIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFRyYW5zLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgZm9ybWF0RGlzdGFuY2UgfSBmcm9tICdkYXRlLWZucyc7XG5cbmNvbnN0IGZvcm1hdGVkT2ZmbG9hZERlbGF5U2Vjb25kcyA9IChcbiAgc2Vjb25kczogbnVtYmVyLFxuICBpbmNsdWRlU2Vjb25kcz86IGJvb2xlYW4sXG4pID0+IHtcbiAgcmV0dXJuIGZvcm1hdERpc3RhbmNlKDAsIHNlY29uZHMgKiAxMDAwLCB7IGluY2x1ZGVTZWNvbmRzIH0pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIE9mZmxvYWRUaW1lclRvb2x0aXAoe1xuICBvZmZsb2FkRGVsYXlTZWNvbmRzLFxufToge1xuICBvZmZsb2FkRGVsYXlTZWNvbmRzOiBudW1iZXI7XG59KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCBmYXFMaW5rID0gKFxuICAgIDxMaW5rXG4gICAgICBocmVmPVwiaHR0cHM6Ly9zdXBwb3J0LmF2YXgubmV0d29yay9lbi9hcnRpY2xlcy82MzI1MjMwLWF2YWxhbmNoZS1icmlkZ2UtZmFxLWZvci1jb252ZXJ0aW5nLWJ0Yy10by1idGMtYlwiXG4gICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgcmVsPVwibm9yZWZlcnJlclwiXG4gICAgICBzeD17e1xuICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICBmb250V2VpZ2h0OiAnNTAwJyxcbiAgICAgICAgbGluZUhlaWdodDogJzE0cHgnLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7dCgnRkFRJyl9XG4gICAgPC9MaW5rPlxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPFRvb2x0aXBcbiAgICAgIHRpdGxlPXtcbiAgICAgICAgPFRyYW5zXG4gICAgICAgICAgaTE4bktleT17YEJyaWRnaW5nIGZyb20gQXZhbGFuY2hlIHRvIEJpdGNvaW4gdGFrZXMgYXBwcm94aW1hdGVseSAke2Zvcm1hdGVkT2ZmbG9hZERlbGF5U2Vjb25kcyhcbiAgICAgICAgICAgIG9mZmxvYWREZWxheVNlY29uZHMsXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICl9LiBQbGVhc2Ugc2VlXG4gICAgICAgICAgdGhlIDxGYXFMaW5rPkZBUTwvRmFxTGluaz4gZm9yIGFkZGl0aW9uYWwgaW5mby5gfVxuICAgICAgICAgIGNvbXBvbmVudHM9e3sgRmFxTGluazogZmFxTGluayB9fVxuICAgICAgICAvPlxuICAgICAgfVxuICAgICAgUG9wcGVyUHJvcHM9e3tcbiAgICAgICAgc3g6IHtcbiAgICAgICAgICBtYXhXaWR0aDogJzI0MHB4JyxcbiAgICAgICAgICBtOiAxLFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8SW5mb0NpcmNsZUljb24gLz5cbiAgICA8L1Rvb2x0aXA+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQnJpZGdlVHJhbnNhY3Rpb24gfSBmcm9tICdAYXZhbGFicy9jb3JlLWJyaWRnZS1zZGsnO1xuaW1wb3J0IHsgQnJpZGdlVHJhbnNmZXIgfSBmcm9tICdAYXZhbGFicy9icmlkZ2UtdW5pZmllZCc7XG5cbmltcG9ydCB7IGJpZ2ludFRvQmlnIH0gZnJvbSAnQHNyYy91dGlscy9iaWdpbnRUb0JpZyc7XG5cbmltcG9ydCB7IGlzVW5pZmllZEJyaWRnZVRyYW5zZmVyIH0gZnJvbSAnLi4vdXRpbHMvaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXInO1xuXG5leHBvcnQgY29uc3QgdXNlQnJpZGdlQW1vdW50cyA9IChcbiAgYnJpZGdlVHg/OiBCcmlkZ2VUcmFuc2FjdGlvbiB8IEJyaWRnZVRyYW5zZmVyLFxuKSA9PiB7XG4gIGNvbnN0IHNvdXJjZU5ldHdvcmtGZWUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAodHlwZW9mIGJyaWRnZVR4Py5zb3VyY2VOZXR3b3JrRmVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlcihicmlkZ2VUeCkpIHtcbiAgICAgIHJldHVybiBiaWdpbnRUb0JpZyhcbiAgICAgICAgYnJpZGdlVHguc291cmNlTmV0d29ya0ZlZSxcbiAgICAgICAgYnJpZGdlVHguc291cmNlQ2hhaW4ubmV0d29ya1Rva2VuLmRlY2ltYWxzLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGJyaWRnZVR4LnNvdXJjZU5ldHdvcmtGZWU7XG4gIH0sIFticmlkZ2VUeF0pO1xuXG4gIGNvbnN0IHRhcmdldE5ldHdvcmtGZWUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAodHlwZW9mIGJyaWRnZVR4Py50YXJnZXROZXR3b3JrRmVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlcihicmlkZ2VUeCkpIHtcbiAgICAgIHJldHVybiBiaWdpbnRUb0JpZyhcbiAgICAgICAgYnJpZGdlVHgudGFyZ2V0TmV0d29ya0ZlZSxcbiAgICAgICAgYnJpZGdlVHgudGFyZ2V0Q2hhaW4ubmV0d29ya1Rva2VuLmRlY2ltYWxzLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGJyaWRnZVR4LnRhcmdldE5ldHdvcmtGZWU7XG4gIH0sIFticmlkZ2VUeF0pO1xuXG4gIHJldHVybiB7XG4gICAgYW1vdW50OiBpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlcihicmlkZ2VUeClcbiAgICAgID8gYmlnaW50VG9CaWcoYnJpZGdlVHguYW1vdW50LCBicmlkZ2VUeC5hc3NldC5kZWNpbWFscylcbiAgICAgIDogYnJpZGdlVHg/LmFtb3VudCxcbiAgICBzb3VyY2VOZXR3b3JrRmVlLFxuICAgIHRhcmdldE5ldHdvcmtGZWUsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgQmxvY2tjaGFpbiwgdXNlUHJpY2VGb3JDaGFpbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBDaGFpbiB9IGZyb20gJ0BhdmFsYWJzL2JyaWRnZS11bmlmaWVkJztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBuZXR3b3JrVG9CbG9ja2NoYWluIH0gZnJvbSAnLi4vdXRpbHMvYmxvY2tjaGFpbkNvbnZlcnNpb24nO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyBjYWlwVG9DaGFpbklkIH0gZnJvbSAnQHNyYy91dGlscy9jYWlwQ29udmVyc2lvbic7XG5cbmV4cG9ydCBjb25zdCB1c2VCcmlkZ2VOZXR3b3JrUHJpY2UgPSAoY2hhaW4/OiBCbG9ja2NoYWluIHwgQ2hhaW4pID0+IHtcbiAgY29uc3QgeyBuZXR3b3JrcyB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcblxuICBjb25zdCBibG9ja2NoYWluID0gdXNlTWVtbygoKSA9PiB7XG4gICAgLy8gU3RhbmRhcmRpemUgaW5wdXQgdG8gQmxvY2tjaGFpbiB0eXBlXG4gICAgaWYgKCFjaGFpbikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNoYWluID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgbmV0d29yayA9IG5ldHdvcmtzLmZpbmQoXG4gICAgICAgICh7IGNoYWluSWQgfSkgPT4gY2hhaW5JZCA9PT0gY2FpcFRvQ2hhaW5JZChjaGFpbi5jaGFpbklkKSxcbiAgICAgICk7XG5cbiAgICAgIGlmICghbmV0d29yaykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV0d29ya1RvQmxvY2tjaGFpbihuZXR3b3JrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhaW47XG4gIH0sIFtjaGFpbiwgbmV0d29ya3NdKTtcblxuICByZXR1cm4gdXNlUHJpY2VGb3JDaGFpbihibG9ja2NoYWluKTtcbn07XG4iLCJpbXBvcnQgeyBCcmlkZ2VUcmFuc2FjdGlvbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBCcmlkZ2VUcmFuc2ZlciB9IGZyb20gJ0BhdmFsYWJzL2JyaWRnZS11bmlmaWVkJztcblxuaW1wb3J0IHsgaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIgfSBmcm9tICcuLi91dGlscy9pc1VuaWZpZWRCcmlkZ2VUcmFuc2Zlcic7XG5cbmV4cG9ydCBjb25zdCB1c2VCcmlkZ2VUcmFuc2ZlclN0YXR1cyA9IChcbiAgYnJpZGdlVHg/OiBCcmlkZ2VUcmFuc2FjdGlvbiB8IEJyaWRnZVRyYW5zZmVyLFxuKSA9PiB7XG4gIGlmICghYnJpZGdlVHgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNDb21wbGV0ZTogZmFsc2UsXG4gICAgICBzb3VyY2VDdXJyZW50Q29uZmlybWF0aW9uczogMCxcbiAgICAgIHRhcmdldEN1cnJlbnRDb25maXJtYXRpb25zOiAwLFxuICAgICAgc291cmNlUmVxdWlyZWRDb25maXJtYXRpb25zOiAwLFxuICAgICAgdGFyZ2V0UmVxdWlyZWRDb25maXJtYXRpb25zOiAwLFxuICAgIH07XG4gIH1cblxuICBpZiAoaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIoYnJpZGdlVHgpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzQ29tcGxldGU6IEJvb2xlYW4oYnJpZGdlVHguY29tcGxldGVkQXQpLFxuICAgICAgLy8gY2FwIHRoZSBjdXJyZW50IGNvbmZpcm1hdGlvbnMgc28gd2UgZG9uJ3QgZ28gb3ZlclxuICAgICAgc291cmNlQ3VycmVudENvbmZpcm1hdGlvbnM6IE1hdGgubWluKFxuICAgICAgICBicmlkZ2VUeC5zb3VyY2VDb25maXJtYXRpb25Db3VudCxcbiAgICAgICAgYnJpZGdlVHguc291cmNlUmVxdWlyZWRDb25maXJtYXRpb25Db3VudCxcbiAgICAgICksXG4gICAgICB0YXJnZXRDdXJyZW50Q29uZmlybWF0aW9uczogTWF0aC5taW4oXG4gICAgICAgIGJyaWRnZVR4LnRhcmdldENvbmZpcm1hdGlvbkNvdW50LFxuICAgICAgICBicmlkZ2VUeC50YXJnZXRSZXF1aXJlZENvbmZpcm1hdGlvbkNvdW50LFxuICAgICAgKSxcbiAgICAgIC8vIHdpdGggVW5pZmllZCBCcmlkZ2UsIHRoZSBTREsgcHJvdmlkZXMgaW5mbyBhYm91dCB0aGUgdGFyZ2V0IGNvbmZpcm1hdGlvbnNcbiAgICAgIHNvdXJjZVJlcXVpcmVkQ29uZmlybWF0aW9uczogYnJpZGdlVHguc291cmNlUmVxdWlyZWRDb25maXJtYXRpb25Db3VudCxcbiAgICAgIHRhcmdldFJlcXVpcmVkQ29uZmlybWF0aW9uczogYnJpZGdlVHgudGFyZ2V0UmVxdWlyZWRDb25maXJtYXRpb25Db3VudCxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpc0NvbXBsZXRlOiBicmlkZ2VUeC5jb21wbGV0ZSxcbiAgICAvLyBjYXAgdGhlIGN1cnJlbnQgY29uZmlybWF0aW9ucyBzbyB3ZSBkb24ndCBnbyBvdmVyXG4gICAgc291cmNlQ3VycmVudENvbmZpcm1hdGlvbnM6IE1hdGgubWluKFxuICAgICAgYnJpZGdlVHguY29uZmlybWF0aW9uQ291bnQsXG4gICAgICBicmlkZ2VUeC5yZXF1aXJlZENvbmZpcm1hdGlvbkNvdW50LFxuICAgICksXG4gICAgLy8gd2l0aCBMZWdhY3kgQnJpZGdlLCB0aGUgY291bnQgaXMgZWl0aGVyIDAgaWYgdHggaGFzIG5vdCBjb21wbGV0ZWQgeWV0LCBvciAxIGlmIGl0IGhhc1xuICAgIHRhcmdldEN1cnJlbnRDb25maXJtYXRpb25zOiBicmlkZ2VUeC5jb21wbGV0ZSA/IDEgOiAwLFxuICAgIHNvdXJjZVJlcXVpcmVkQ29uZmlybWF0aW9uczogYnJpZGdlVHgucmVxdWlyZWRDb25maXJtYXRpb25Db3VudCxcbiAgICB0YXJnZXRSZXF1aXJlZENvbmZpcm1hdGlvbnM6IDEsIC8vIGFuZCB3ZSBvbmx5IHJlcXVpcmUgb25lIGNvbmZpcm1hdGlvbiBvbiB0aGUgdGFyZ2V0IGJsb2NrY2hhaW5cbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBCbG9ja2NoYWluLCBCcmlkZ2VUcmFuc2FjdGlvbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBDaGFpbklkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7IEJyaWRnZVRyYW5zZmVyIH0gZnJvbSAnQGF2YWxhYnMvYnJpZGdlLXVuaWZpZWQnO1xuXG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZVRva2Vuc1dpdGhCYWxhbmNlcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlVG9rZW5zV2l0aEJhbGFuY2VzJztcblxuaW1wb3J0IHsgZmluZFRva2VuRm9yQXNzZXQgfSBmcm9tICcuLi91dGlscy9maW5kVG9rZW5Gb3JBc3NldCc7XG5pbXBvcnQgeyBuZXR3b3JrVG9CbG9ja2NoYWluIH0gZnJvbSAnLi4vdXRpbHMvYmxvY2tjaGFpbkNvbnZlcnNpb24nO1xuaW1wb3J0IHsgY2FpcFRvQ2hhaW5JZCB9IGZyb20gJ0BzcmMvdXRpbHMvY2FpcENvbnZlcnNpb24nO1xuaW1wb3J0IHsgZ2V0QnJpZGdlZEFzc2V0U3ltYm9sIH0gZnJvbSAnQHNyYy91dGlscy9icmlkZ2UvZ2V0QnJpZGdlZEFzc2V0U3ltYm9sJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUxvZ29VcmlGb3JCcmlkZ2VUcmFuc2FjdGlvbihcbiAgYnJpZGdlVHJhbnNhY3Rpb246IEJyaWRnZVRyYW5zYWN0aW9uIHwgQnJpZGdlVHJhbnNmZXIgfCB1bmRlZmluZWQsXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBjb25zdCB7IG5ldHdvcmssIG5ldHdvcmtzLCBnZXROZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuXG4gIGNvbnN0IGlzTWFpbm5ldCA9ICFuZXR3b3JrPy5pc1Rlc3RuZXQ7XG4gIGNvbnN0IGlzVW5pZmllZFRyYW5zZmVyID0gdHlwZW9mIGJyaWRnZVRyYW5zYWN0aW9uPy5zb3VyY2VDaGFpbiA9PT0gJ29iamVjdCc7XG4gIGNvbnN0IHRhcmdldEJsb2NrY2hhaW4gPSBpc1VuaWZpZWRUcmFuc2ZlclxuICAgID8gbmV0d29ya1RvQmxvY2tjaGFpbihcbiAgICAgICAgbmV0d29ya3MuZmluZChcbiAgICAgICAgICAoeyBjaGFpbklkIH0pID0+XG4gICAgICAgICAgICBjYWlwVG9DaGFpbklkKGJyaWRnZVRyYW5zYWN0aW9uLnRhcmdldENoYWluLmNoYWluSWQpID09PSBjaGFpbklkLFxuICAgICAgICApLFxuICAgICAgKVxuICAgIDogYnJpZGdlVHJhbnNhY3Rpb24/LnRhcmdldENoYWluO1xuXG4gIGxldCBjaGFpbklkOiBudW1iZXI7XG5cbiAgaWYgKGlzVW5pZmllZFRyYW5zZmVyKSB7XG4gICAgY2hhaW5JZCA9IGNhaXBUb0NoYWluSWQoYnJpZGdlVHJhbnNhY3Rpb24uc291cmNlQ2hhaW4uY2hhaW5JZCk7XG4gIH0gZWxzZSB7XG4gICAgY2hhaW5JZCA9XG4gICAgICBicmlkZ2VUcmFuc2FjdGlvbj8uc291cmNlQ2hhaW4gPT09IEJsb2NrY2hhaW4uQklUQ09JTlxuICAgICAgICA/IGlzTWFpbm5ldFxuICAgICAgICAgID8gQ2hhaW5JZC5CSVRDT0lOXG4gICAgICAgICAgOiBDaGFpbklkLkJJVENPSU5fVEVTVE5FVFxuICAgICAgICA6IGlzTWFpbm5ldFxuICAgICAgICAgID8gQ2hhaW5JZC5BVkFMQU5DSEVfTUFJTk5FVF9JRFxuICAgICAgICAgIDogQ2hhaW5JZC5BVkFMQU5DSEVfVEVTVE5FVF9JRDtcbiAgfVxuXG4gIGNvbnN0IHRva2VucyA9IHVzZVRva2Vuc1dpdGhCYWxhbmNlcyh7XG4gICAgZm9yY2VTaG93VG9rZW5zV2l0aG91dEJhbGFuY2VzOiB0cnVlLFxuICAgIG5ldHdvcms6IGdldE5ldHdvcmsoY2hhaW5JZCksXG4gIH0pO1xuXG4gIGlmICghYnJpZGdlVHJhbnNhY3Rpb24gfHwgIXRhcmdldEJsb2NrY2hhaW4pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB0b2tlbiA9IGZpbmRUb2tlbkZvckFzc2V0KFxuICAgIGdldEJyaWRnZWRBc3NldFN5bWJvbChicmlkZ2VUcmFuc2FjdGlvbiksXG4gICAgdGFyZ2V0QmxvY2tjaGFpbixcbiAgICB0b2tlbnMsXG4gICk7XG5cbiAgcmV0dXJuIHRva2VuPy5sb2dvVXJpO1xufVxuIiwiaW1wb3J0IHsgdXNlQnJpZGdlQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQnJpZGdlUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VVbmlmaWVkQnJpZGdlQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvVW5pZmllZEJyaWRnZVByb3ZpZGVyJztcbmltcG9ydCB7IGNhaXBUb0NoYWluSWQgfSBmcm9tICdAc3JjL3V0aWxzL2NhaXBDb252ZXJzaW9uJztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBjb25zdCB1c2VQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb25zID0gKCkgPT4ge1xuICBjb25zdCB7IG5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IHsgYnJpZGdlVHJhbnNhY3Rpb25zOiBsZWdhY3lCcmlkZ2VUcmFuc2ZlcnMgfSA9IHVzZUJyaWRnZUNvbnRleHQoKTtcbiAgY29uc3Qge1xuICAgIHN0YXRlOiB7IHBlbmRpbmdUcmFuc2ZlcnM6IHVuaWZpZWRCcmlkZ2VUcmFuc2ZlcnMgfSxcbiAgfSA9IHVzZVVuaWZpZWRCcmlkZ2VDb250ZXh0KCk7XG4gIGNvbnN0IGJyaWRnZVRyYW5zYWN0aW9ucyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBbXG4gICAgICAuLi5PYmplY3QudmFsdWVzKGxlZ2FjeUJyaWRnZVRyYW5zZmVycyksXG4gICAgICAuLi5PYmplY3QudmFsdWVzKHVuaWZpZWRCcmlkZ2VUcmFuc2ZlcnMpLmZpbHRlcihcbiAgICAgICAgKHR4KSA9PlxuICAgICAgICAgIC8vIGZpbHRlciBwZW5kaW5nIHRyYW5zYWN0aW9ucyB0aGF0IGRvbid0IGJlbG9uZyB0byB0aGUgZ2l2ZW4gbmV0d29ya1xuICAgICAgICAgIG5ldHdvcms/LmNoYWluSWQgPT09IGNhaXBUb0NoYWluSWQodHguc291cmNlQ2hhaW4uY2hhaW5JZCkgfHxcbiAgICAgICAgICBuZXR3b3JrPy5jaGFpbklkID09PSBjYWlwVG9DaGFpbklkKHR4LnRhcmdldENoYWluLmNoYWluSWQpLFxuICAgICAgKSxcbiAgICBdO1xuICB9LCBbdW5pZmllZEJyaWRnZVRyYW5zZmVycywgbGVnYWN5QnJpZGdlVHJhbnNmZXJzLCBuZXR3b3JrXSk7XG5cbiAgcmV0dXJuIGJyaWRnZVRyYW5zYWN0aW9ucztcbn07XG4iLCJpbXBvcnQgeyB1c2VCcmlkZ2VDb25maWdVcGRhdGVyLCB1c2VCcmlkZ2VTREsgfSBmcm9tICdAYXZhbGFicy9jb3JlLWJyaWRnZS1zZGsnO1xuaW1wb3J0IHsgRXh0ZW5zaW9uUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9leHRlbnNpb25Db25uZWN0aW9uL21vZGVscyc7XG5pbXBvcnQgeyBpc0JyaWRnZVN0YXRlVXBkYXRlRXZlbnRMaXN0ZW5lciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9icmlkZ2UvZXZlbnRzL2xpc3RlbmVycyc7XG5pbXBvcnQgeyBCcmlkZ2VHZXRDb25maWdIYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2JyaWRnZS9oYW5kbGVycy9nZXRCcmlkZ2VDb25maWcnO1xuaW1wb3J0IHsgbmV0d29ya1VwZGF0ZWRFdmVudExpc3RlbmVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvZXZlbnRzL25ldHdvcmtVcGRhdGVkRXZlbnRMaXN0ZW5lcic7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBQZXJpb2RpY2FsbHkgdXBkYXRlIHRoZSBicmlkZ2UgY29uZmlnIGFuZCBrZWVwIGl0IGluIHN5bmMgd2l0aCB0aGUgYmFja2dyb3VuZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVN5bmNCcmlkZ2VDb25maWcoKSB7XG4gIGNvbnN0IHsgc2V0QnJpZGdlQ29uZmlnIH0gPSB1c2VCcmlkZ2VTREsoKTtcbiAgY29uc3QgeyBldmVudHMsIHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG5cbiAgY29uc3QgZmV0Y2hDb25maWcgPSB1c2VDYWxsYmFjayhcbiAgICAoKSA9PlxuICAgICAgcmVxdWVzdDxCcmlkZ2VHZXRDb25maWdIYW5kbGVyPih7XG4gICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5CUklER0VfR0VUX0NPTkZJRyxcbiAgICAgIH0pLFxuICAgIFtyZXF1ZXN0XSxcbiAgKTtcblxuICAvLyBQZXJpb2RpY2FsbHkgdXBkYXRlIHRoZSBicmlkZ2UgY29uZmlnXG4gIHVzZUJyaWRnZUNvbmZpZ1VwZGF0ZXIoZmV0Y2hDb25maWcpO1xuXG4gIC8vIFVwZGF0ZSB0aGUgYnJpZGdlIGNvbmZpZyB3aGVuIGVpdGhlciB0aGUgbmV0d29yayBvciBicmlkZ2Ugc3RhdGUgY2hhbmdlc1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGV2ZW50cygpXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKFxuICAgICAgICAgIChldmVudCkgPT5cbiAgICAgICAgICAgIG5ldHdvcmtVcGRhdGVkRXZlbnRMaXN0ZW5lcihldmVudCkgfHxcbiAgICAgICAgICAgIGlzQnJpZGdlU3RhdGVVcGRhdGVFdmVudExpc3RlbmVyKGV2ZW50KSxcbiAgICAgICAgKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdDb25maWcgPSBhd2FpdCBmZXRjaENvbmZpZygpO1xuICAgICAgICBzZXRCcmlkZ2VDb25maWcobmV3Q29uZmlnKTtcbiAgICAgIH0pO1xuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfSwgW2V2ZW50cywgZmV0Y2hDb25maWcsIHNldEJyaWRnZUNvbmZpZ10pO1xufVxuIiwiaW1wb3J0IHsgQmxvY2tjaGFpbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBUb2tlbldpdGhCYWxhbmNlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUb2tlbkZvckFzc2V0KFxuICBzeW1ib2w6IHN0cmluZyxcbiAgbmF0aXZlQ2hhaW46IEJsb2NrY2hhaW4sXG4gIHRva2VuczogVG9rZW5XaXRoQmFsYW5jZVtdLFxuKSB7XG4gIC8vIFdoZW4gdGhlIHNvdXJjZSBpcyBBdmFsYW5jaGUgdXNlIHRoZSB3cmFwcGVkIHZlcnNpb24gb2YgdGhlIHN5bWJvbCBlLmcuIEJUQy5iXG4gIGNvbnN0IHdyYXBwZWRTeW1ib2wgPSBnZXRXcmFwcGVkU3ltYm9sKHN5bWJvbCwgbmF0aXZlQ2hhaW4pO1xuXG4gIHJldHVybiB0b2tlbnMuZmluZCgodCkgPT4gdC5zeW1ib2wgPT09IHN5bWJvbCB8fCB0LnN5bWJvbCA9PT0gd3JhcHBlZFN5bWJvbCk7XG59XG5cbmZ1bmN0aW9uIGdldFdyYXBwZWRTeW1ib2woc3ltYm9sOiBzdHJpbmcsIGNoYWluOiBCbG9ja2NoYWluKTogc3RyaW5nIHtcbiAgaWYgKGNoYWluID09PSBCbG9ja2NoYWluLkVUSEVSRVVNKSB7XG4gICAgcmV0dXJuIGAke3N5bWJvbH0uZWA7XG4gIH0gZWxzZSBpZiAoY2hhaW4gPT09IEJsb2NrY2hhaW4uQklUQ09JTikge1xuICAgIHJldHVybiBgJHtzeW1ib2x9LmJgO1xuICB9XG4gIHJldHVybiBzeW1ib2w7XG59XG4iLCJpbXBvcnQgeyBCbG9ja2NoYWluLCBnZXROYXRpdmVTeW1ib2wgfSBmcm9tICdAYXZhbGFicy9jb3JlLWJyaWRnZS1zZGsnO1xuaW1wb3J0IHsgQ2hhaW4gfSBmcm9tICdAYXZhbGFicy9icmlkZ2UtdW5pZmllZCc7XG5cbmV4cG9ydCBjb25zdCBnZXROYXRpdmVUb2tlblN5bWJvbCA9IChjaGFpbjogQmxvY2tjaGFpbiB8IENoYWluKSA9PiB7XG4gIGlmICh0eXBlb2YgY2hhaW4gPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGNoYWluLm5ldHdvcmtUb2tlbi5zeW1ib2w7XG4gIH1cblxuICByZXR1cm4gZ2V0TmF0aXZlU3ltYm9sKGNoYWluKTtcbn07XG4iLCJpbXBvcnQgeyBCcmlkZ2VUcmFuc2FjdGlvbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBCcmlkZ2VUcmFuc2ZlciB9IGZyb20gJ0BhdmFsYWJzL2JyaWRnZS11bmlmaWVkJztcblxuZXhwb3J0IGNvbnN0IGlzVW5pZmllZEJyaWRnZVRyYW5zZmVyID0gKFxuICB0cmFuc2Zlcj86IEJyaWRnZVRyYW5zYWN0aW9uIHwgQnJpZGdlVHJhbnNmZXIsXG4pOiB0cmFuc2ZlciBpcyBCcmlkZ2VUcmFuc2ZlciA9PiB7XG4gIHJldHVybiB0cmFuc2ZlciAhPT0gdW5kZWZpbmVkICYmICd0eXBlJyBpbiB0cmFuc2Zlcjtcbn07XG4iLCJpbXBvcnQgeyBiblRvQmlnIH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IEJpZyBmcm9tICdiaWcuanMnO1xuaW1wb3J0IHsgQk4gfSBmcm9tICdibi5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBiaWdpbnRUb0JpZyhhbW91bnQ6IGJpZ2ludCwgZGVub21pbmF0aW9uOiBudW1iZXIpOiBCaWcge1xuICByZXR1cm4gYm5Ub0JpZyhuZXcgQk4oYW1vdW50LnRvU3RyaW5nKCkpLCBkZW5vbWluYXRpb24pO1xufVxuIiwiaW1wb3J0IHsgQnJpZGdlVHJhbnNmZXIgfSBmcm9tICdAYXZhbGFicy9icmlkZ2UtdW5pZmllZCc7XG5pbXBvcnQgeyBCcmlkZ2VUcmFuc2FjdGlvbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlciB9IGZyb20gJ0BzcmMvcGFnZXMvQnJpZGdlL3V0aWxzL2lzVW5pZmllZEJyaWRnZVRyYW5zZmVyJztcblxuZXhwb3J0IGNvbnN0IGdldEJyaWRnZWRBc3NldFN5bWJvbCA9IChcbiAgdHg6IEJyaWRnZVRyYW5zZmVyIHwgQnJpZGdlVHJhbnNhY3Rpb24sXG4pOiBzdHJpbmcgPT4ge1xuICBpZiAoaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIodHgpKSB7XG4gICAgcmV0dXJuIHR4LmFzc2V0LnN5bWJvbDtcbiAgfVxuXG4gIHJldHVybiB0eC5zeW1ib2w7XG59O1xuIl0sIm5hbWVzIjpbIk5ldHdvcmtFdmVudHMiLCJuZXR3b3JrVXBkYXRlZEV2ZW50TGlzdGVuZXIiLCJldnQiLCJuYW1lIiwiTkVUV09SS19VUERBVEVfRVZFTlQiLCJGcmFnbWVudCIsIm1lbW8iLCJ1c2VSZWYiLCJCb3giLCJzdHlsZWQiLCJUeXBvZ3JhcGh5Iiwia2V5ZnJhbWVzIiwidXNlVHJhbnNsYXRpb24iLCJwdWxzZVN0YXJ0IiwicHVsc2VFbmQiLCJwdWxzZSIsIm1vdmUiLCJMaW5lIiwic2hvdWxkRm9yd2FyZFByb3AiLCJwcm9wIiwiYWN0aXZlIiwiY29tcGxldGUiLCJ0aGVtZSIsIndpZHRoIiwiZ3JvdyIsImhlaWdodCIsIm1hcmdpblRvcCIsInBvc2l0aW9uIiwiYmFja2dyb3VuZCIsInBhbGV0dGUiLCJ0ZXh0IiwicHJpbWFyeSIsImRpdmlkZXIiLCJ0cmFuc2l0aW9uIiwiRG90IiwiZGVsYXkiLCJib3JkZXJSYWRpdXMiLCJzZWNvbmRhcnkiLCJtYWluIiwidG9wIiwibGVmdCIsImFuaW1hdGlvbiIsImFuaW1hdGlvbkRlbGF5IiwiQ2lyY2xlIiwibGFiZWxCYWNrZ3JvdW5kQ29sb3IiLCJkaXNwbGF5IiwiYm9yZGVyIiwicGFwZXIiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJ6SW5kZXgiLCJMYWJlbCIsInRyYW5zZm9ybSIsIlN0YXJ0TGFiZWwiLCJwYWRkaW5nUmlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJncmV5IiwiRmluaXNoTGFiZWwiLCJyaWdodCIsInBhZGRpbmdMZWZ0IiwiRGFzaGVkTGluZSIsImRlZmF1bHQiLCJib3JkZXJUb3AiLCJTbGlkZXIiLCJtaW5XaWR0aCIsIkNvbmZpcm1hdGlvblRyYWNrZXIiLCJzdGFydGVkIiwicmVxdWlyZWRDb3VudCIsImN1cnJlbnRDb3VudCIsInByb3BzIiwidCIsIm51bWJlck9mRG90cyIsImNvbnRhaW5lclJlZiIsImRvdHMiLCJjYWxjdWxhdGVMaW5lV2lkdGgiLCJjb250YWluZXJXaWR0aCIsImN1cnJlbnQiLCJjbGllbnRXaWR0aCIsIm11bHRpcGxpZXIiLCJyZW5kZXJMaW5lIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiaSIsInB1c2giLCJrZXkiLCJkaXJlY3Rpb24iLCJhbGlnbiIsIm1hcmdpbiIsInNpemUiLCJsYXN0U3RlcEFjdGl2ZSIsInNob3dCcmVha0VuZCIsIl9leHRlbmRzIiwicmVmIiwic3giLCJtYXhXaWR0aCIsImZsZXhEaXJlY3Rpb24iLCJvdmVyZmxvdyIsImZsZXhHcm93IiwicCIsInVzZVRva2VuSW5mb0NvbnRleHQiLCJLTk9XTl9JRFMiLCJCVEMiLCJBVkFYIiwiRVRIIiwidXNlQ29pbkdlY2tvSWQiLCJ0b2tlblN5bWJvbCIsInRva2VuSW5mb0RhdGEiLCJjb2luZ2Vja29JZCIsInVzZU5ldHdvcmtDb250ZXh0IiwidXNlSXNNYWlubmV0IiwibmV0d29yayIsImlzVGVzdG5ldCIsIkJsb2NrY2hhaW4iLCJ1c2VQcmljZSIsInVzZUJyaWRnZVNESyIsInVzZUFjY291bnRzQ29udGV4dCIsInVzZUhpc3RvcnkiLCJ1c2VQYXJhbXMiLCJQYWdlVGl0bGUiLCJ1c2VFZmZlY3QiLCJ1c2VNZW1vIiwidXNlU3RhdGUiLCJ1c2VTZXR0aW5nc0NvbnRleHQiLCJ1c2VCcmlkZ2VDb250ZXh0IiwiRWxhcHNlZFRpbWVyIiwidXNlQW5hbHl0aWNzQ29udGV4dCIsImdldEV4cGxvcmVyQWRkcmVzcyIsInVzZUxvZ29VcmlGb3JCcmlkZ2VUcmFuc2FjdGlvbiIsIkJ1dHRvbiIsIlN0YWNrIiwidG9hc3QiLCJUb2FzdENhcmQiLCJTY3JvbGxiYXJzIiwiQ2FyZCIsIkRpdmlkZXIiLCJDaGV2cm9uVXBJY29uIiwiSWNvbkJ1dHRvbiIsIkV4dGVybmFsTGlua0ljb24iLCJDb2xsYXBzZSIsIkNoZXZyb25Eb3duSWNvbiIsInVzZVRoZW1lIiwiRGlhbG9nIiwiTmV0d29ya0xvZ28iLCJibG9ja2NoYWluVG9OZXR3b3JrIiwiZ2V0TmF0aXZlVG9rZW5TeW1ib2wiLCJpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlciIsInVzZUJyaWRnZUFtb3VudHMiLCJ1c2VTeW5jQnJpZGdlQ29uZmlnIiwidXNlQnJpZGdlTmV0d29ya1ByaWNlIiwidXNlQnJpZGdlVHJhbnNmZXJTdGF0dXMiLCJCcmlkZ2VDYXJkIiwiT2ZmbG9hZFRpbWVyVG9vbHRpcCIsInVzZVBlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbnMiLCJ1c2VVbmlmaWVkQnJpZGdlQ29udGV4dCIsIlRva2VuVW5pdCIsIkJyaWRnZVRyYW5zYWN0aW9uU3RhdHVzIiwiaGlzdG9yeSIsInBhcmFtcyIsImN1cnJlbmN5Rm9ybWF0dGVyIiwiY3VycmVuY3kiLCJhY2NvdW50cyIsImFjdGl2ZUFjY291bnQiLCJnZXRFcnJvck1lc3NhZ2UiLCJicmlkZ2VUcmFuc2FjdGlvbnMiLCJyZW1vdmVCcmlkZ2VUcmFuc2FjdGlvbiIsImZyb21DYXJkT3BlbiIsInNldEZyb21DYXJkT3BlbiIsInRvQ2FyZE9wZW4iLCJzZXRUb0NhcmRPcGVuIiwidG9hc3RTaG93biIsInNldFRvYXN0U2hvd24iLCJpc0RpYWxvZ09wZW4iLCJzZXRJc0RpYWxvZ09wZW4iLCJpc01haW5uZXQiLCJicmlkZ2VUcmFuc2FjdGlvbiIsImZpbmQiLCJzb3VyY2VUeEhhc2giLCJ0eEhhc2giLCJzeW1ib2wiLCJhc3NldCIsImxvZ29VcmkiLCJuZXR3b3JrcyIsImdldE5ldHdvcmsiLCJicmlkZ2VDb25maWciLCJzb3VyY2VOZXR3b3JrIiwic291cmNlQ2hhaW4iLCJ1bmRlZmluZWQiLCJ0YXJnZXROZXR3b3JrIiwidGFyZ2V0Q2hhaW4iLCJhc3NldFByaWNlIiwidG9Mb3dlckNhc2UiLCJuZXR3b3JrUHJpY2UiLCJ0YXJnZXROZXR3b3JrUHJpY2UiLCJjYXB0dXJlIiwiYW1vdW50Iiwic291cmNlTmV0d29ya0ZlZSIsInRhcmdldE5ldHdvcmtGZWUiLCJmb3JtYXR0ZWROZXR3b3JrUHJpY2UiLCJtdWwiLCJ0b051bWJlciIsImZvcm1hdHRlZFRhcmdldE5ldHdvcmtQcmljZSIsImlzQ29tcGxldGUiLCJzb3VyY2VDdXJyZW50Q29uZmlybWF0aW9ucyIsInNvdXJjZVJlcXVpcmVkQ29uZmlybWF0aW9ucyIsInRhcmdldEN1cnJlbnRDb25maXJtYXRpb25zIiwidGFyZ2V0UmVxdWlyZWRDb25maXJtYXRpb25zIiwiZXJyb3JDb2RlIiwiaGFzRXJyb3IiLCJlcnJvck1lc3NhZ2UiLCJ0b2FzdGVySWQiLCJjdXN0b20iLCJvbkRpc21pc3MiLCJyZW1vdmUiLCJ2YXJpYW50IiwidGl0bGUiLCJkdXJhdGlvbiIsIkluZmluaXR5IiwiY29tcGxldGVkQXQiLCJpc09mZmJvYXJkaW5nIiwiQVZBTEFOQ0hFIiwiQklUQ09JTiIsIm9mZmJvYXJkaW5nRGVsYXkiLCJjb25maWciLCJjcml0aWNhbEJpdGNvaW4iLCJvZmZib2FyZERlbGF5U2Vjb25kcyIsImhhc09mZkJvYXJkaW5nRGVsYXkiLCJicmlkZ2VBbW91bnQiLCJkZWNpbWFscyIsInRvRGlzcGxheSIsInRvU3RyaW5nIiwicHQiLCJvbkJhY2tDbGljayIsInJlcGxhY2UiLCJtciIsIm9uQ2xpY2siLCJteCIsIm1iIiwicm93R2FwIiwic3JjIiwiZGVmYXVsdFNpemUiLCJ3aXRoQmFja2dyb3VuZCIsInNob3dDb21wbGV0ZSIsInNob3dHbG9iZU1hcmdpbiIsIm10IiwiY29sb3IiLCJtbCIsImlzV2FpdGluZyIsImlzRG9uZSIsIkJvb2xlYW4iLCJ0YXJnZXRTdGFydGVkQXQiLCJpc1RyYW5zZmVyQ29tcGxldGUiLCJ0ZXh0VHJhbnNmb3JtIiwiY2hhaW5OYW1lIiwid2luZG93Iiwib3BlbiIsImRpc2FibGVSaXBwbGUiLCJteSIsInRvRml4ZWQiLCJzdGFydFRpbWUiLCJzb3VyY2VTdGFydGVkQXQiLCJlbmRUaW1lIiwiaW4iLCJwYiIsInRhcmdldFR4SGFzaCIsInRhcmdldENvbmZpcm1hdGlvbkNvdW50IiwidGFyZ2V0UmVxdWlyZWRDb25maXJtYXRpb25Db3VudCIsIm9mZmxvYWREZWxheVRvb2x0aXAiLCJvZmZsb2FkRGVsYXlTZWNvbmRzIiwiYmdjb2xvciIsImlzQ2xvc2VhYmxlIiwib25DbG9zZSIsImNvbnRlbnQiLCJ0ZXh0QWxpZ24iLCJ0cmFuc2l0aW9ucyIsImNyZWF0ZSIsIm9wYWNpdHkiLCJDaGVja0ljb24iLCJJbmZvQ2lyY2xlSWNvbiIsIlRvb2x0aXAiLCJ1c2VTdG9wd2F0Y2giLCJUaW1lRWxhcHNlZCIsInN1Y2Nlc3MiLCJkYXJrIiwicGFkVGltZUVsYXBzZWQiLCJub3ciLCJEYXRlIiwiZGlmZiIsIm9mZnNldCIsImhvdXJzIiwibWludXRlcyIsInNlY29uZHMiLCJyZXNldCIsImlzUnVubmluZyIsImF1dG9TdGFydCIsIm9mZnNldFRpbWVzdGFtcCIsImRpc3BsYXllZFNlY29uZHMiLCJ0b0xvY2FsZVN0cmluZyIsIm1pbmltdW1JbnRlZ2VyRGlnaXRzIiwiZGlzcGxheWVkTWludXRlcyIsImRpc3BsYXllZEhvdXJzIiwiTGluayIsIlRyYW5zIiwiZm9ybWF0RGlzdGFuY2UiLCJmb3JtYXRlZE9mZmxvYWREZWxheVNlY29uZHMiLCJpbmNsdWRlU2Vjb25kcyIsImZhcUxpbmsiLCJocmVmIiwidGFyZ2V0IiwicmVsIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwibGluZUhlaWdodCIsImkxOG5LZXkiLCJjb21wb25lbnRzIiwiRmFxTGluayIsIlBvcHBlclByb3BzIiwibSIsImJpZ2ludFRvQmlnIiwiYnJpZGdlVHgiLCJuZXR3b3JrVG9rZW4iLCJ1c2VQcmljZUZvckNoYWluIiwibmV0d29ya1RvQmxvY2tjaGFpbiIsImNhaXBUb0NoYWluSWQiLCJjaGFpbiIsImJsb2NrY2hhaW4iLCJjaGFpbklkIiwiTWF0aCIsIm1pbiIsInNvdXJjZUNvbmZpcm1hdGlvbkNvdW50Iiwic291cmNlUmVxdWlyZWRDb25maXJtYXRpb25Db3VudCIsImNvbmZpcm1hdGlvbkNvdW50IiwicmVxdWlyZWRDb25maXJtYXRpb25Db3VudCIsIkNoYWluSWQiLCJ1c2VUb2tlbnNXaXRoQmFsYW5jZXMiLCJmaW5kVG9rZW5Gb3JBc3NldCIsImdldEJyaWRnZWRBc3NldFN5bWJvbCIsImlzVW5pZmllZFRyYW5zZmVyIiwidGFyZ2V0QmxvY2tjaGFpbiIsIkJJVENPSU5fVEVTVE5FVCIsIkFWQUxBTkNIRV9NQUlOTkVUX0lEIiwiQVZBTEFOQ0hFX1RFU1RORVRfSUQiLCJ0b2tlbnMiLCJmb3JjZVNob3dUb2tlbnNXaXRob3V0QmFsYW5jZXMiLCJ0b2tlbiIsImxlZ2FjeUJyaWRnZVRyYW5zZmVycyIsInN0YXRlIiwicGVuZGluZ1RyYW5zZmVycyIsInVuaWZpZWRCcmlkZ2VUcmFuc2ZlcnMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmaWx0ZXIiLCJ0eCIsInVzZUJyaWRnZUNvbmZpZ1VwZGF0ZXIiLCJFeHRlbnNpb25SZXF1ZXN0IiwiaXNCcmlkZ2VTdGF0ZVVwZGF0ZUV2ZW50TGlzdGVuZXIiLCJ1c2VDb25uZWN0aW9uQ29udGV4dCIsInVzZUNhbGxiYWNrIiwic2V0QnJpZGdlQ29uZmlnIiwiZXZlbnRzIiwicmVxdWVzdCIsImZldGNoQ29uZmlnIiwibWV0aG9kIiwiQlJJREdFX0dFVF9DT05GSUciLCJzdWJzY3JpcHRpb24iLCJwaXBlIiwiZXZlbnQiLCJzdWJzY3JpYmUiLCJuZXdDb25maWciLCJ1bnN1YnNjcmliZSIsIm5hdGl2ZUNoYWluIiwid3JhcHBlZFN5bWJvbCIsImdldFdyYXBwZWRTeW1ib2wiLCJFVEhFUkVVTSIsImdldE5hdGl2ZVN5bWJvbCIsInRyYW5zZmVyIiwiYm5Ub0JpZyIsIkJOIiwiZGVub21pbmF0aW9uIl0sInNvdXJjZVJvb3QiOiIifQ==