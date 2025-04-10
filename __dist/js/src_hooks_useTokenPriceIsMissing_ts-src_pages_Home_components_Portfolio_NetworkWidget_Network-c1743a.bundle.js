"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_hooks_useTokenPriceIsMissing_ts-src_pages_Home_components_Portfolio_NetworkWidget_Network-c1743a"],{

/***/ "./src/background/services/balances/utils/isTokenWithBalanceAVM.ts":
/*!*************************************************************************!*\
  !*** ./src/background/services/balances/utils/isTokenWithBalanceAVM.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isTokenWithBalanceAVM": () => (/* binding */ isTokenWithBalanceAVM)
/* harmony export */ });
const isTokenWithBalanceAVM = balance => {
  if (!balance) {
    return false;
  }
  return 'balancePerType' in balance && 'locked' in balance.balancePerType;
};

/***/ }),

/***/ "./src/background/services/balances/utils/isTokenWithBalancePVM.ts":
/*!*************************************************************************!*\
  !*** ./src/background/services/balances/utils/isTokenWithBalancePVM.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isTokenWithBalancePVM": () => (/* binding */ isTokenWithBalancePVM)
/* harmony export */ });
const isTokenWithBalancePVM = balance => {
  if (!balance) {
    return false;
  }
  return 'balancePerType' in balance && 'lockedStaked' in balance.balancePerType;
};

/***/ }),

/***/ "./src/components/common/BalanceColumn.tsx":
/*!*************************************************!*\
  !*** ./src/components/common/BalanceColumn.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BalanceColumn": () => (/* binding */ BalanceColumn)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");

const BalanceColumn = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack)`
  align-items: end;
  padding-left: 8px;
  line-height: 14px;
`;

/***/ }),

/***/ "./src/components/common/InlineTokenEllipsis.tsx":
/*!*******************************************************!*\
  !*** ./src/components/common/InlineTokenEllipsis.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InlineTokenEllipsis": () => (/* binding */ InlineTokenEllipsis)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _TokenEllipsis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TokenEllipsis */ "./src/components/common/TokenEllipsis.tsx");


const InlineTokenEllipsis = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])(_TokenEllipsis__WEBPACK_IMPORTED_MODULE_0__.TokenEllipsis)`
  display: inline-block;
`;

/***/ }),

/***/ "./src/components/common/NetworkLogoK2.tsx":
/*!*************************************************!*\
  !*** ./src/components/common/NetworkLogoK2.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GlobeIconContainer": () => (/* binding */ GlobeIconContainer),
/* harmony export */   "NetworkLogoK2": () => (/* binding */ NetworkLogoK2)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/utils/ipsfResolverWithFallback */ "./src/utils/ipsfResolverWithFallback.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const GlobeIconContainer = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])('div')`
  width: auto;
  height: ${({
  height
}) => height ?? '32px'};
  position: ${({
  position
}) => position ?? 'static'};
	margin: ${({
  margin
}) => margin ?? '0'};
  top: 0;
  left: 0;
  background-color: 'grey.800',
  border-radius: 50%;
`;
const NetworkLogoImage = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])('img')`
  width: auto;
  height: ${({
  height
}) => height ?? '32px'};
  position: ${({
  position
}) => position ?? 'static'};
  margin: ${({
  margin
}) => margin ?? '0'};
  top: 0;
  left: 0;
`;
function NetworkLogoK2({
  src,
  height,
  position,
  margin
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, src ? /*#__PURE__*/React.createElement(NetworkLogoImage, {
    height: height,
    src: (0,_src_utils_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_0__.ipfsResolverWithFallback)(src),
    position: position,
    margin: margin
  }) : /*#__PURE__*/React.createElement(GlobeIconContainer, {
    height: height,
    position: position,
    margin: margin
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.GlobeIcon, {
    size: height,
    sx: {
      p: 0
    }
  })));
}

/***/ }),

/***/ "./src/components/common/TokenEllipsis.tsx":
/*!*************************************************!*\
  !*** ./src/components/common/TokenEllipsis.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenEllipsis": () => (/* binding */ TokenEllipsis)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/trunateAddress.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function isTruncated(maxLength, text) {
  return text.length > maxLength;
}
function TokenEllipsis({
  maxLength,
  text,
  className,
  sx
}) {
  const name = text.length <= maxLength ? text : (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__.truncateAddress)(text, maxLength / 2);
  return /*#__PURE__*/React.createElement("span", {
    className: className
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
    placement: "bottom",
    title: text,
    disableHoverListener: !isTruncated(maxLength, text),
    disableFocusListener: !isTruncated(maxLength, text),
    sx: sx ?? {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(React.Fragment, null, name)));
}

/***/ }),

/***/ "./src/hooks/useTokenPriceIsMissing.ts":
/*!*********************************************!*\
  !*** ./src/hooks/useTokenPriceIsMissing.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useTokenPriceMissing": () => (/* binding */ useTokenPriceMissing)
/* harmony export */ });
/* harmony import */ var _src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/network/utils/isBitcoinNetwork */ "./src/background/services/network/utils/isBitcoinNetwork.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function useTokenPriceMissing() {
  const {
    balances,
    isTokensCached
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_2__.useBalancesContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  const {
    network: activeNetwork,
    favoriteNetworks
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  const {
    getTokenVisibility
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__.useSettingsContext)();
  const networksMissingPrice = (0,react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    if (isTokensCached) {
      return {};
    }
    const networkIds = Object.keys(balances.tokens ?? {});
    if (!networkIds.length) {
      return {};
    }
    const networksIsMissingPrices = {};
    networkIds.forEach(networkId => {
      const tokensForNetwork = balances.tokens?.[networkId];

      // If the network does not have any tokens with balance do nothing,
      if (!tokensForNetwork) {
        return;
      }
      const addressToCheck = (0,_src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_0__.isBitcoinChainId)(Number(networkId)) ? activeAccount?.addressBTC : activeAccount?.addressC;

      // If an address to check is not available, do nothing.
      if (!addressToCheck) {
        return;
      }
      const tokensForActiveAccount = tokensForNetwork[addressToCheck];

      // If tokens for active account not available, do nothing.
      if (!tokensForActiveAccount) {
        return;
      }
      const isMissingPrices = Object.values(tokensForActiveAccount).filter(getTokenVisibility) // Disregard hidden tokens
      .some(token => token.balance > 0n && token.priceInCurrency === undefined // Only look at tokens that actually have some balance
      );

      networksIsMissingPrices[networkId] = isMissingPrices;
    });
    return networksIsMissingPrices;
  }, [activeAccount?.addressBTC, activeAccount?.addressC, isTokensCached, balances.tokens, getTokenVisibility]);
  const favoriteNetworksMissingPrice = (0,react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => favoriteNetworks.some(network => networksMissingPrice[network.chainId] === true), [favoriteNetworks, networksMissingPrice]);
  const activeNetworkMissingPrice = (0,react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    if (!activeNetwork?.chainId) {
      return false;
    }
    return networksMissingPrice[activeNetwork.chainId] === true;
  }, [activeNetwork?.chainId, networksMissingPrice]);
  const isPriceMissingFromNetwork = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(networkId => {
    return networksMissingPrice[networkId] === true;
  }, [networksMissingPrice]);
  return {
    favoriteNetworksMissingPrice,
    activeNetworkMissingPrice,
    isPriceMissingFromNetwork
  };
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/NetworkWidget/ActiveNetworkWidget.tsx":
/*!***********************************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/NetworkWidget/ActiveNetworkWidget.tsx ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActiveNetworkWidget": () => (/* binding */ ActiveNetworkWidget)
/* harmony export */ });
/* harmony import */ var _Assetlist__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Assetlist */ "./src/pages/Home/components/Portfolio/NetworkWidget/Assetlist.tsx");
/* harmony import */ var _common_NetworkCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/NetworkCard */ "./src/pages/Home/components/Portfolio/NetworkWidget/common/NetworkCard.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _ZeroWidget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ZeroWidget */ "./src/pages/Home/components/Portfolio/NetworkWidget/ZeroWidget.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_components_common_NetworkLogoK2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/common/NetworkLogoK2 */ "./src/components/common/NetworkLogoK2.tsx");
/* harmony import */ var _src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/isBitcoin */ "./src/utils/isBitcoin.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_pages_Bridge_hooks_usePendingBridgeTransactions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/pages/Bridge/hooks/usePendingBridgeTransactions */ "./src/pages/Bridge/hooks/usePendingBridgeTransactions.ts");
/* harmony import */ var _src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/background/services/network/utils/isBitcoinNetwork */ "./src/background/services/network/utils/isBitcoinNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _PchainActiveNetworkWidgetContent__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./PchainActiveNetworkWidgetContent */ "./src/pages/Home/components/Portfolio/NetworkWidget/PchainActiveNetworkWidgetContent.tsx");
/* harmony import */ var _src_components_common_ProfitAndLoss__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/components/common/ProfitAndLoss */ "./src/components/common/ProfitAndLoss.tsx");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* harmony import */ var _XchainActiveNetworkWidgetContent__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./XchainActiveNetworkWidgetContent */ "./src/pages/Home/components/Portfolio/NetworkWidget/XchainActiveNetworkWidgetContent.tsx");
/* harmony import */ var _src_background_services_balances_utils_isTokenWithBalancePVM__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @src/background/services/balances/utils/isTokenWithBalancePVM */ "./src/background/services/balances/utils/isTokenWithBalancePVM.ts");
/* harmony import */ var _src_background_services_balances_utils_isTokenWithBalanceAVM__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @src/background/services/balances/utils/isTokenWithBalanceAVM */ "./src/background/services/balances/utils/isTokenWithBalanceAVM.ts");
/* harmony import */ var _src_utils_normalizeBalance__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @src/utils/normalizeBalance */ "./src/utils/normalizeBalance.ts");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_20__);
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
























function ActiveNetworkWidget({
  assetList,
  activeNetworkBalance,
  activeNetworkPriceChanges
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_21__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_22__.useHistory)();
  const {
    network,
    isCustomNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__.useSettingsContext)();
  const {
    isTokensCached
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_5__.useBalancesContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_9__.useAnalyticsContext)();
  const bridgeTransactions = (0,_src_pages_Bridge_hooks_usePendingBridgeTransactions__WEBPACK_IMPORTED_MODULE_10__.usePendingBridgeTransactions)();
  const changePercentage = activeNetworkPriceChanges ? activeNetworkPriceChanges?.value / activeNetworkBalance * 100 : undefined;
  if (!network || !assetList?.length) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Skeleton, {
      variant: "rounded",
      sx: {
        width: 343,
        height: 190
      }
    });
  }
  const handleCardClick = e => {
    e.stopPropagation();
    capture('PortfolioPrimaryNetworkClicked', {
      chainId: network.chainId
    });
    if ((0,_src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_11__.isBitcoinNetwork)(network) || (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_12__.isPchainNetwork)(network) || (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_15__.isXchainNetwork)(network)) {
      history.push('/token');
    } else {
      history.push('/assets');
    }
  };
  const firstAsset = assetList[0];
  const funds = firstAsset && 'decimals' in firstAsset ? (0,_src_utils_normalizeBalance__WEBPACK_IMPORTED_MODULE_19__.normalizeBalance)(firstAsset.balance, firstAsset.decimals) ?? new (big_js__WEBPACK_IMPORTED_MODULE_20___default())(0) : new (big_js__WEBPACK_IMPORTED_MODULE_20___default())(0);
  const hasNoFunds = assetList.length === 1 && funds?.eq(new (big_js__WEBPACK_IMPORTED_MODULE_20___default())(0));
  const selectedAssetList = assetList[0];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_common_NetworkCard__WEBPACK_IMPORTED_MODULE_1__.NetworkCard, {
    "data-testid": "active-network-card",
    display: "block",
    onClick: handleCardClick
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      height: '100%',
      rowGap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    direction: "row",
    sx: {
      justifyContent: 'space-between',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Badge, {
    badgeContent: Object.values(bridgeTransactions).length ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Tooltip, {
      title: /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_24__.Trans, {
        i18nKey: "Bridge in progress. <br/> Click for details."
      }),
      sx: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(React.Fragment, null, Object.values(bridgeTransactions).length)) : null,
    color: "secondary"
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_6__.TokenIcon, {
    width: "40px",
    height: "40px",
    src: network.logoUri,
    name: network.chainName
  }, /*#__PURE__*/React.createElement(_src_components_common_NetworkLogoK2__WEBPACK_IMPORTED_MODULE_7__.NetworkLogoK2, {
    height: "40px",
    src: network.logoUri
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Chip, {
    label: t('Active'),
    size: "small",
    sx: {
      height: '20px',
      cursor: 'pointer',
      color: 'success.main'
    },
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.CheckIcon, {
      color: "success.main"
    })
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    justifyContent: "center",
    sx: {
      rowGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Typography, {
    "data-testid": "active-network-name",
    variant: "h5",
    sx: {
      color: 'grey.300'
    }
  }, network?.chainName), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      textAlign: 'end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Typography, {
    "data-testid": "active-network-total-balance",
    variant: "h6"
  }, currencyFormatter(activeNetworkBalance)), !isCustomNetwork(network.chainId) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  }, isTokensCached && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Tooltip, {
    title: t('Balances loading...'),
    placement: "bottom"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.AlertTriangleIcon, {
    size: 14,
    sx: {
      color: 'warning.main',
      mr: 1
    }
  })), /*#__PURE__*/React.createElement(_src_components_common_ProfitAndLoss__WEBPACK_IMPORTED_MODULE_14__.PAndL, {
    value: activeNetworkPriceChanges?.value,
    percentage: changePercentage,
    size: "big"
  })))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Divider, {
    sx: {
      my: 2,
      width: 'auto'
    }
  }), (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_12__.isPchainNetwork)(network) && (0,_src_background_services_balances_utils_isTokenWithBalancePVM__WEBPACK_IMPORTED_MODULE_17__.isTokenWithBalancePVM)(selectedAssetList) ? /*#__PURE__*/React.createElement(_PchainActiveNetworkWidgetContent__WEBPACK_IMPORTED_MODULE_13__.PchainActiveNetworkWidgetContent, {
    balances: selectedAssetList
  }) : (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_15__.isXchainNetwork)(network) && (0,_src_background_services_balances_utils_isTokenWithBalanceAVM__WEBPACK_IMPORTED_MODULE_18__.isTokenWithBalanceAVM)(selectedAssetList) ? /*#__PURE__*/React.createElement(_XchainActiveNetworkWidgetContent__WEBPACK_IMPORTED_MODULE_16__.XchainActiveNetworkWidgetContent, {
    balances: selectedAssetList
  }) : /*#__PURE__*/React.createElement(_Assetlist__WEBPACK_IMPORTED_MODULE_0__.Assetlist, {
    assetList: assetList
  }), hasNoFunds && !(0,_src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_8__.isBitcoin)(network) ? /*#__PURE__*/React.createElement(_ZeroWidget__WEBPACK_IMPORTED_MODULE_2__.ZeroWidget, null) : null, (0,_src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_8__.isBitcoin)(network) ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Button, {
    "data-testid": "btc-bridge-button",
    color: "secondary",
    fullWidth: true,
    sx: {
      mt: 2
    },
    onClick: e => {
      e.stopPropagation();
      history.push('/bridge');
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.BridgeIcon, {
    sx: {
      mr: 1
    }
  }), t('Bridge')) : null));
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/NetworkWidget/Assetlist.tsx":
/*!*************************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/NetworkWidget/Assetlist.tsx ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Assetlist": () => (/* binding */ Assetlist)
/* harmony export */ });
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useSetSendDataInParams */ "./src/hooks/useSetSendDataInParams.ts");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_InlineTokenEllipsis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/InlineTokenEllipsis */ "./src/components/common/InlineTokenEllipsis.tsx");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_TokenEllipsis__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/TokenEllipsis */ "./src/components/common/TokenEllipsis.tsx");
/* harmony import */ var _src_components_common_BalanceColumn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/BalanceColumn */ "./src/components/common/BalanceColumn.tsx");
/* harmony import */ var _src_components_common_ProfitAndLoss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/common/ProfitAndLoss */ "./src/components/common/ProfitAndLoss.tsx");
/* harmony import */ var _src_utils_hasUnconfirmedBalance__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/hasUnconfirmedBalance */ "./src/utils/hasUnconfirmedBalance.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_background_services_balances_models__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/background/services/balances/models */ "./src/background/services/balances/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");















const ShowAnimation = _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.keyframes`
0% {
  opacity: 0;
}
100% {
  opacity: 1;
}
`;
const HideAnimation = _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.keyframes`
0% {
  opacity: 1;
}
100% {
  opacity: 0;
}
`;
const AssetlistRow = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack)`
  &:hover {
    background-color: ${({
  theme
}) => `${theme.palette.common.white}40`};
    > .balance-column > .balance {
      display: block;
      animation: 0.3s ease-in-out ${ShowAnimation};
    }
    > .balance-column > .balance-usd {
      display: none;
      animation: 0.3s ease-in-out ${HideAnimation};
    }
  }
`;
function Assetlist({
  assetList
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_14__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_1__.useAnalyticsContext)();
  const {
    currencyFormatter,
    getTokenVisibility
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__.useSettingsContext)();
  const maxAssetCount = 4;
  const setSendDataInParams = (0,_src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_3__.useSetSendDataInParams)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_15__.useHistory)();
  const filteredAssetList = assetList.filter(asset => getTokenVisibility(asset)).sort((a, b) => (b.balanceInCurrency ?? 0) - (a.balanceInCurrency ?? 0));
  const restAssetCount = filteredAssetList.length - maxAssetCount;
  return /*#__PURE__*/React.createElement(React.Fragment, null, filteredAssetList.slice(0, maxAssetCount).map(token => {
    const totalBalance = token.balance && (0,_src_utils_hasUnconfirmedBalance__WEBPACK_IMPORTED_MODULE_8__.hasUnconfirmedBalance)(token) ? new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_16__.TokenUnit(token.balance + token.unconfirmedBalance, token.decimals, token.symbol) : new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_16__.TokenUnit(token.balance, 'decimals' in token ? token.decimals : 0, token.symbol);
    const balanceInCurrency = token.balanceInCurrency;
    return /*#__PURE__*/React.createElement(AssetlistRow, {
      "data-testid": `${token.symbol.toLowerCase()}-token-list-row`,
      direction: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "0 -16px",
      padding: "4px 16px",
      key: token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_9__.TokenType.NATIVE ? token.symbol : token.address,
      onClick: e => {
        e.stopPropagation();
        capture('PortfolioTokenSelected', {
          selectedToken: token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_9__.TokenType.ERC20 ? token.address : token.symbol
        });
        setSendDataInParams({
          token: token,
          options: {
            path: '/token'
          }
        });
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
      direction: "row",
      alignItems: "center"
    }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_0__.TokenIcon, {
      width: "24px",
      height: "24px",
      src: token.logoUri,
      name: token.name
    }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
      sx: {
        ml: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
      "data-testid": "token-row-name",
      variant: "button"
    }, /*#__PURE__*/React.createElement(_src_components_common_TokenEllipsis__WEBPACK_IMPORTED_MODULE_5__.TokenEllipsis, {
      maxLength: 12,
      text: token.name
    })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
      variant: "caption",
      sx: {
        color: 'text.secondary'
      }
    }, totalBalance.toDisplay(), ' ', /*#__PURE__*/React.createElement(_src_components_common_InlineTokenEllipsis__WEBPACK_IMPORTED_MODULE_4__.InlineTokenEllipsis, {
      maxLength: 8,
      text: token.symbol
    })))), /*#__PURE__*/React.createElement(_src_components_common_BalanceColumn__WEBPACK_IMPORTED_MODULE_6__.BalanceColumn, {
      className: "balance-column"
    }, typeof balanceInCurrency === 'number' && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
      "data-testid": "token-row-currency-balance",
      variant: "caption",
      sx: {
        fontWeight: 'bold'
      }
    }, currencyFormatter(balanceInCurrency + ((0,_src_background_services_balances_models__WEBPACK_IMPORTED_MODULE_10__.getUnconfirmedBalanceInCurrency)(token) ?? 0))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, null, token.priceChanges && token.priceChanges.value && token.priceChanges.percentage ? /*#__PURE__*/React.createElement(_src_components_common_ProfitAndLoss__WEBPACK_IMPORTED_MODULE_7__.PAndL, {
      value: token.priceChanges.value,
      percentage: token.priceChanges.percentage
    }) : null)));
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    direction: "row",
    justifyContent: "flex-end"
  }, restAssetCount > 0 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    variant: "text",
    onClick: () => history.push('/assets'),
    sx: {
      mt: 1,
      color: 'seconday.main',
      p: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    direction: "row",
    alignContent: "center",
    sx: {
      columnGap: '10px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "caption",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, t('+{{restAssetCount}} more', {
    restAssetCount
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.ChevronRightIcon, {
    size: 16
  })))));
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/NetworkWidget/NetworkList.tsx":
/*!***************************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/NetworkWidget/NetworkList.tsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkList": () => (/* binding */ NetworkList)
/* harmony export */ });
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _common_NetworkCard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/NetworkCard */ "./src/pages/Home/components/Portfolio/NetworkWidget/common/NetworkCard.tsx");
/* harmony import */ var _NetworksWidget__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NetworksWidget */ "./src/pages/Home/components/Portfolio/NetworkWidget/NetworksWidget.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/NetworkLogo */ "./src/components/common/NetworkLogo.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _SeeAllNetworksButton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SeeAllNetworksButton */ "./src/pages/Home/components/Portfolio/NetworkWidget/SeeAllNetworksButton.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_BridgeProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/BridgeProvider */ "./src/contexts/BridgeProvider.tsx");
/* harmony import */ var _src_background_services_bridge_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/background/services/bridge/utils */ "./src/background/services/bridge/utils.ts");
/* harmony import */ var _src_contexts_UnifiedBridgeProvider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/contexts/UnifiedBridgeProvider */ "./src/contexts/UnifiedBridgeProvider.tsx");
/* harmony import */ var _src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/utils/caipConversion */ "./src/utils/caipConversion.ts");
/* harmony import */ var _src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/utils/getAddressForChain */ "./src/utils/getAddressForChain.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
















const LogoContainer = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"])('div')`
  margin-top: 4px;
  margin-right: 16px;
`;
const NetworkListContainer = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack)`
  margin: 16px 0;
  flex-wrap: wrap;
`;
function NetworkList() {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_7__.useAnalyticsContext)();
  const {
    network,
    networks,
    setNetwork,
    favoriteNetworks,
    isCustomNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__.useNetworkContext)();
  const {
    balances,
    isTokensCached
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__.useBalancesContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_0__.useAccountsContext)();
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_5__.useSettingsContext)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_16__.useTranslation)();
  const {
    bridgeState
  } = (0,_src_contexts_BridgeProvider__WEBPACK_IMPORTED_MODULE_9__.useBridgeContext)();
  const {
    state: {
      pendingTransfers: unifiedBridgeTxs
    }
  } = (0,_src_contexts_UnifiedBridgeProvider__WEBPACK_IMPORTED_MODULE_11__.useUnifiedBridgeContext)();
  function getNetworkValue(lookupNetwork) {
    const networkAddress = (0,_src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_13__.getAddressForChain)(lookupNetwork, activeAccount);
    const networkBalances = balances.tokens?.[lookupNetwork.chainId];
    const networkAssetList = networkBalances ? (0,_NetworksWidget__WEBPACK_IMPORTED_MODULE_4__.tokensWithBalances)(Object.values(networkBalances[networkAddress] ?? {})) : null;
    return networkAssetList ? (0,_NetworksWidget__WEBPACK_IMPORTED_MODULE_4__.getNetworkBalance)(networkAssetList) : 0;
  }
  const favoriteNetworksWithoutActive = favoriteNetworks.filter(networkItem => networkItem.chainId !== network?.chainId).sort((a, b) => {
    const networkBalanceForA = getNetworkValue(a);
    const networkBalanceForB = getNetworkValue(b);
    return networkBalanceForB - networkBalanceForA;
  });

  // we don't know the network list yet. Lets show the placeholder tiles instead
  if (!networks.length) {
    return /*#__PURE__*/React.createElement(NetworkListContainer, {
      direction: "row",
      justifyContent: "space-between"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Skeleton, {
      variant: "rounded",
      sx: {
        height: 89,
        width: 164,
        mb: 2
      }
    }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Skeleton, {
      variant: "rounded",
      sx: {
        height: 89,
        width: 164,
        mb: 2
      }
    }));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(NetworkListContainer, {
    direction: "row",
    justifyContent: "space-between"
  }, favoriteNetworksWithoutActive.map(favoriteNetwork => {
    const {
      bridgeTransactions: legacyBridgeTxs
    } = (0,_src_background_services_bridge_utils__WEBPACK_IMPORTED_MODULE_10__.filterBridgeStateToNetwork)(bridgeState, favoriteNetwork);
    const filteredUnifiedBridgeTxs = Object.values(unifiedBridgeTxs).filter(({
      sourceChain,
      targetChain
    }) => {
      return (0,_src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_12__.caipToChainId)(sourceChain.chainId) === favoriteNetwork.chainId || (0,_src_utils_caipConversion__WEBPACK_IMPORTED_MODULE_12__.caipToChainId)(targetChain.chainId) === favoriteNetwork.chainId;
    });
    const bridgeTransactions = [...Object.values(legacyBridgeTxs), ...filteredUnifiedBridgeTxs];
    const networkBalances = balances.tokens?.[favoriteNetwork.chainId];
    const networkBalance = getNetworkValue(favoriteNetwork);

    // show loading skeleton for each tile till we have the balance for them
    return !networkBalances ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Skeleton, {
      key: favoriteNetwork.chainId,
      variant: "rounded",
      sx: {
        height: 89,
        width: 164,
        mb: 2
      }
    }) : /*#__PURE__*/React.createElement(_common_NetworkCard__WEBPACK_IMPORTED_MODULE_3__.NetworkCard, {
      "data-testid": `network-card-${favoriteNetwork.chainId}-button`,
      key: favoriteNetwork.chainId,
      sx: {
        width: '164px',
        display: 'inline-block',
        mb: 2,
        p: 2
      },
      onClick: () => {
        capture('PortfolioSecondaryNetworkClicked', {
          chainId: favoriteNetwork.chainId
        });
        setNetwork(favoriteNetwork);
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
      direction: "row",
      justifyContent: "center",
      alignItems: "flex-start"
    }, /*#__PURE__*/React.createElement(LogoContainer, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Badge, {
      badgeContent: bridgeTransactions.length,
      color: "secondary"
    }, /*#__PURE__*/React.createElement(_src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_6__.NetworkLogo, {
      width: "40px",
      height: "40px",
      padding: "8px",
      src: favoriteNetwork.logoUri,
      defaultSize: 40
    }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
      justifyContent: "center",
      sx: {
        width: '100%',
        minHeight: '51px'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
      variant: "body2",
      fontWeight: "fontWeightSemibold"
    }, favoriteNetwork.chainName), !isCustomNetwork(favoriteNetwork.chainId) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
      sx: {
        flexDirection: 'row',
        alignItems: 'center'
      }
    }, isTokensCached && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Tooltip, {
      title: t('Balances loading...'),
      placement: "bottom"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.AlertTriangleIcon, {
      size: 12,
      sx: {
        color: 'warning.main',
        mr: 1
      }
    })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
      "data-testid": `network-card-${favoriteNetwork.chainId}-balance`,
      size: 14,
      height: "17px"
    }, currencyFormatter(networkBalance))))));
  }), networks.length && /*#__PURE__*/React.createElement(_SeeAllNetworksButton__WEBPACK_IMPORTED_MODULE_8__.SeeAllNetworksButton, {
    isFullWidth: favoriteNetworksWithoutActive.length % 2 === 0
  })));
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/NetworkWidget/NetworksWidget.tsx":
/*!******************************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/NetworkWidget/NetworksWidget.tsx ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworksWidget": () => (/* binding */ NetworksWidget),
/* harmony export */   "getNetworkBalance": () => (/* binding */ getNetworkBalance),
/* harmony export */   "getNetworkTokensPriceChanges": () => (/* binding */ getNetworkTokensPriceChanges),
/* harmony export */   "tokensWithBalances": () => (/* binding */ tokensWithBalances)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_balances_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/balances/models */ "./src/background/services/balances/models.ts");
/* harmony import */ var _src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useTokensWithBalances */ "./src/hooks/useTokensWithBalances.ts");
/* harmony import */ var _ActiveNetworkWidget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ActiveNetworkWidget */ "./src/pages/Home/components/Portfolio/NetworkWidget/ActiveNetworkWidget.tsx");
/* harmony import */ var _NetworkList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NetworkList */ "./src/pages/Home/components/Portfolio/NetworkWidget/NetworkList.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const tokensWithBalances = tokenList => {
  if (!tokenList) {
    return;
  }
  return tokenList.filter(token => token.balance > 0);
};
const getNetworkBalance = assetList => {
  const sum = assetList.reduce((prevAssetUSD, currentAsset) => {
    return prevAssetUSD + ((0,_src_background_services_balances_models__WEBPACK_IMPORTED_MODULE_0__.getUnconfirmedBalanceInCurrency)(currentAsset) ?? 0) + (currentAsset.balanceInCurrency ?? 0);
  }, 0);
  return sum;
};
const getNetworkTokensPriceChanges = assetList => {
  const changes = assetList.reduce((changesSum, currentAsset) => {
    if (!currentAsset.priceChanges) {
      return changesSum;
    }
    const {
      percentage,
      value
    } = currentAsset.priceChanges;
    if (!percentage) {
      return changesSum;
    }
    return {
      value: changesSum.value + (value || 0),
      percentage: [...changesSum.percentage, percentage]
    };
  }, {
    percentage: [],
    value: 0
  });
  return changes;
};
function NetworksWidget() {
  const activeNetworkAssetList = (0,_src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_1__.useTokensWithBalances)();
  const activeNetworkBalance = getNetworkBalance(activeNetworkAssetList);
  const activeNetworkPriceChanges = getNetworkTokensPriceChanges(activeNetworkAssetList);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      m: 2
    }
  }, /*#__PURE__*/React.createElement(_ActiveNetworkWidget__WEBPACK_IMPORTED_MODULE_2__.ActiveNetworkWidget, {
    assetList: activeNetworkAssetList,
    activeNetworkBalance: activeNetworkBalance,
    activeNetworkPriceChanges: activeNetworkPriceChanges
  }), /*#__PURE__*/React.createElement(_NetworkList__WEBPACK_IMPORTED_MODULE_3__.NetworkList, null));
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/NetworkWidget/PchainActiveNetworkWidgetContent.tsx":
/*!************************************************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/NetworkWidget/PchainActiveNetworkWidgetContent.tsx ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PchainActiveNetworkWidgetContent": () => (/* binding */ PchainActiveNetworkWidgetContent)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_BalanceColumn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/BalanceColumn */ "./src/components/common/BalanceColumn.tsx");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function PchainActiveNetworkWidgetContent({
  balances
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const typeDisplayNames = {
    lockedStaked: t('Locked Staked'),
    lockedStakeable: t('Locked Stakeable'),
    lockedPlatform: t('Locked Platform'),
    atomicMemoryLocked: t('Atomic Memory Locked'),
    atomicMemoryUnlocked: t('Atomic Memory Unlocked'),
    unlockedUnstaked: t('Unlocked Unstaked'),
    unlockedStaked: t('Unlocked Staked'),
    pendingStaked: t('Pending Staked')
  };
  if (!balances?.balancePerType) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, Object.entries(balances.balancePerType).map(([type, balance]) => {
    const show = balance > 0;
    if (!show) {
      return null;
    }
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
      key: `pchain-balance-${type}`,
      direction: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "0 -16px",
      padding: "4px 16px"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
      direction: "row",
      alignItems: "center"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
      "data-testid": "token-row-name",
      variant: "caption",
      sx: {
        ml: 1
      }
    }, typeDisplayNames[type])), /*#__PURE__*/React.createElement(_src_components_common_BalanceColumn__WEBPACK_IMPORTED_MODULE_0__.BalanceColumn, {
      className: "balance-column"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
      className: "balance",
      "data-testid": "token-row-token-balance",
      variant: "caption"
    }, new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__.TokenUnit(balance, balances.decimals, balances.symbol).toDisplay(), ' ', "AVAX")));
  }));
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/NetworkWidget/SeeAllNetworksButton.tsx":
/*!************************************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/NetworkWidget/SeeAllNetworksButton.tsx ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SeeAllNetworksButton": () => (/* binding */ SeeAllNetworksButton)
/* harmony export */ });
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _common_NetworkCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/NetworkCard */ "./src/pages/Home/components/Portfolio/NetworkWidget/common/NetworkCard.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_pages_Networks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/pages/Networks */ "./src/pages/Networks/index.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function SeeAllNetworksButton({
  isFullWidth
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useHistory)();
  return isFullWidth ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    color: "secondary",
    size: "large",
    "data-testid": "see-all-networks-button",
    onClick: e => {
      e.stopPropagation();
      history.push(`/networks?activeTab=${_src_pages_Networks__WEBPACK_IMPORTED_MODULE_1__.NetworkTab.All}`);
    },
    fullWidth: true
  }, t('View All Networks')) : /*#__PURE__*/React.createElement(_common_NetworkCard__WEBPACK_IMPORTED_MODULE_0__.NetworkCard, {
    "data-testid": "see-all-networks-button",
    sx: {
      width: '164px',
      display: 'inline-block',
      mb: 2,
      p: 2
    },
    onClick: () => history.push(`/networks?activeTab=${_src_pages_Networks__WEBPACK_IMPORTED_MODULE_1__.NetworkTab.All}`)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    justifyContent: "center",
    alignItems: "center",
    sx: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    fontWeight: "fontWeightSemibold"
  }, t('View All Networks'))));
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/NetworkWidget/XchainActiveNetworkWidgetContent.tsx":
/*!************************************************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/NetworkWidget/XchainActiveNetworkWidgetContent.tsx ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "XchainActiveNetworkWidgetContent": () => (/* binding */ XchainActiveNetworkWidgetContent)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_BalanceColumn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/BalanceColumn */ "./src/components/common/BalanceColumn.tsx");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function XchainActiveNetworkWidgetContent({
  balances
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const typeDisplayNames = {
    locked: t('Locked'),
    unlocked: t('Unlocked'),
    atomicMemoryLocked: t('Atomic Memory Locked'),
    atomicMemoryUnlocked: t('Atomic Memory Unlocked')
  };
  if (!balances?.balancePerType) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, Object.entries(balances.balancePerType).map(([type, balanceRaw]) => {
    if (!balanceRaw) {
      return null;
    }
    const balance = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_2__.TokenUnit(balanceRaw, balances.decimals, balances.symbol).toDisplay();
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
      key: `xchain-balance-${type}`,
      direction: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "0 -16px",
      padding: "4px 16px"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
      direction: "row",
      alignItems: "center"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
      "data-testid": "token-row-name",
      variant: "caption",
      sx: {
        ml: 1
      }
    }, typeDisplayNames[type])), /*#__PURE__*/React.createElement(_src_components_common_BalanceColumn__WEBPACK_IMPORTED_MODULE_0__.BalanceColumn, {
      className: "balance-column"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
      className: "balance",
      "data-testid": "token-row-token-balance",
      variant: "caption"
    }, `${balance} AVAX`)));
  }));
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/NetworkWidget/ZeroWidget.tsx":
/*!**************************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/NetworkWidget/ZeroWidget.tsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZeroWidget": () => (/* binding */ ZeroWidget)
/* harmony export */ });
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_extensionUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/extensionUtils */ "./src/utils/extensionUtils.ts");
/* harmony import */ var _src_utils_getCoreWebUrl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/getCoreWebUrl */ "./src/utils/getCoreWebUrl.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function ZeroWidget() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__.useNetworkContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useHistory)();
  if (network?.chainId === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_5__.ChainId.AVALANCHE_MAINNET_ID) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
      sx: {
        flexDirection: 'row',
        mt: 2,
        gap: 1,
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
      color: "secondary",
      fullWidth: true,
      onClick: e => {
        e.stopPropagation();
        (0,_src_utils_extensionUtils__WEBPACK_IMPORTED_MODULE_1__.openNewTab)({
          url: `${(0,_src_utils_getCoreWebUrl__WEBPACK_IMPORTED_MODULE_2__.getCoreWebUrl)()}/buy`
        });
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.BuyIcon, {
      size: 16,
      sx: {
        mr: 1
      }
    }), t('Buy')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
      color: "secondary",
      fullWidth: true,
      onClick: e => {
        e.stopPropagation();
        history.push('/receive');
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.QRCodeIcon, {
      size: 16,
      sx: {
        mr: 1
      }
    }), t('Receive')));
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      mt: 2,
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    color: "secondary",
    fullWidth: true,
    onClick: e => {
      e.stopPropagation();
      history.push('/receive');
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.QRCodeIcon, {
    size: 16,
    sx: {
      mr: 1
    }
  }), t('Receive')));
}

/***/ }),

/***/ "./src/pages/Home/components/Portfolio/NetworkWidget/common/NetworkCard.tsx":
/*!**********************************************************************************!*\
  !*** ./src/pages/Home/components/Portfolio/NetworkWidget/common/NetworkCard.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkCard": () => (/* binding */ NetworkCard)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");

const NetworkCard = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Card)`
  padding: 16px;
  cursor: pointer;
  line-height: 1;
  &:hover {
    background-color: ${({
  theme
}) => `${theme.palette.grey[800]}b3`};
  }
`;

/***/ }),

/***/ "./src/pages/Networks/index.tsx":
/*!**************************************!*\
  !*** ./src/pages/Networks/index.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkTab": () => (/* reexport safe */ _Networks__WEBPACK_IMPORTED_MODULE_0__.NetworkTab),
/* harmony export */   "Networks": () => (/* reexport safe */ _Networks__WEBPACK_IMPORTED_MODULE_0__.Networks)
/* harmony export */ });
/* harmony import */ var _Networks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Networks */ "./src/pages/Networks/Networks.tsx");


/***/ }),

/***/ "./src/utils/isBitcoin.ts":
/*!********************************!*\
  !*** ./src/utils/isBitcoin.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBitcoin": () => (/* binding */ isBitcoin)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isBitcoin(network) {
  return network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.BITCOIN;
}

/***/ }),

/***/ "./src/utils/normalizeBalance.ts":
/*!***************************************!*\
  !*** ./src/utils/normalizeBalance.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalizeBalance": () => (/* binding */ normalizeBalance)
/* harmony export */ });
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bnToBig.js");
/* harmony import */ var bn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bn.js */ "./node_modules/bn.js/lib/bn.js");
/* harmony import */ var bn_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bn_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bigintToBig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bigintToBig */ "./src/utils/bigintToBig.ts");



function normalizeBalance(balance, decimals) {
  if ((0,bn_js__WEBPACK_IMPORTED_MODULE_0__.isBN)(balance)) {
    return (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_2__.bnToBig)(balance, decimals);
  }
  if (typeof balance === 'bigint') {
    return (0,_bigintToBig__WEBPACK_IMPORTED_MODULE_1__.bigintToBig)(balance, decimals);
  }
  return balance;
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2hvb2tzX3VzZVRva2VuUHJpY2VJc01pc3NpbmdfdHMtc3JjX3BhZ2VzX0hvbWVfY29tcG9uZW50c19Qb3J0Zm9saW9fTmV0d29ya1dpZGdldF9OZXR3b3JrLWMxNzQzYS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUtPLE1BQU1BLHFCQUFxQixHQUNoQ0MsT0FBMEIsSUFDUztFQUNuQyxJQUFJLENBQUNBLE9BQU8sRUFBRTtJQUNaLE9BQU8sS0FBSztFQUNkO0VBRUEsT0FBTyxnQkFBZ0IsSUFBSUEsT0FBTyxJQUFJLFFBQVEsSUFBSUEsT0FBTyxDQUFDQyxjQUFjO0FBQzFFLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDUk0sTUFBTUMscUJBQXFCLEdBQ2hDRixPQUEwQixJQUNTO0VBQ25DLElBQUksQ0FBQ0EsT0FBTyxFQUFFO0lBQ1osT0FBTyxLQUFLO0VBQ2Q7RUFDQSxPQUNFLGdCQUFnQixJQUFJQSxPQUFPLElBQUksY0FBYyxJQUFJQSxPQUFPLENBQUNDLGNBQWM7QUFFM0UsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ2QyRDtBQUVyRCxNQUFNSSxhQUFhLEdBQUdELHVFQUFNLENBQUNELDhEQUFLLENBQUU7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ05vRDtBQUNMO0FBRXpDLE1BQU1JLG1CQUFtQixHQUFHSCx1RUFBTSxDQUFDRSx5REFBYSxDQUFFO0FBQ3pEO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0wrRDtBQUNlO0FBRXhFLE1BQU1JLGtCQUFrQixHQUFHTix1RUFBTSxDQUFDLEtBQUssQ0FBb0I7QUFDbEU7QUFDQSxZQUFZLENBQUM7RUFBRU87QUFBTyxDQUFDLEtBQUtBLE1BQU0sSUFBSSxNQUFPO0FBQzdDLGNBQWMsQ0FBQztFQUFFQztBQUFTLENBQUMsS0FBS0EsUUFBUSxJQUFJLFFBQVM7QUFDckQsV0FBVyxDQUFDO0VBQUVDO0FBQU8sQ0FBQyxLQUFLQSxNQUFNLElBQUksR0FB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LENBQUUsSUFBSTtBQUN0RTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUaUU7QUFFM0QsU0FBUzdLLFNBQVNBLENBQUM3QyxPQUFpQixFQUFFO0VBQzNDLE9BQU9BLE9BQU8sRUFBRTROLE1BQU0sS0FBS0QsMkVBQXFCO0FBQ2xEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKa0Q7QUFFckI7QUFHZTtBQUVyQyxTQUFTckssZ0JBQWdCQSxDQUM5QnZHLE9BQXNDLEVBQ3RDNkgsUUFBZ0IsRUFDQztFQUNqQixJQUFJbUosMkNBQUksQ0FBQ2hSLE9BQU8sQ0FBQyxFQUFFO0lBQ2pCLE9BQU8rUSxnRUFBTyxDQUFDL1EsT0FBTyxFQUFFNkgsUUFBUSxDQUFDO0VBQ25DO0VBRUEsSUFBSSxPQUFPN0gsT0FBTyxLQUFLLFFBQVEsRUFBRTtJQUMvQixPQUFPaVIseURBQVcsQ0FBQ2pSLE9BQU8sRUFBRTZILFFBQVEsQ0FBQztFQUN2QztFQUVBLE9BQU83SCxPQUFPO0FBQ2hCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2JhbGFuY2VzL3V0aWxzL2lzVG9rZW5XaXRoQmFsYW5jZUFWTS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvdXRpbHMvaXNUb2tlbldpdGhCYWxhbmNlUFZNLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vQmFsYW5jZUNvbHVtbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9JbmxpbmVUb2tlbkVsbGlwc2lzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL05ldHdvcmtMb2dvSzIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vVG9rZW5FbGxpcHNpcy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VUb2tlblByaWNlSXNNaXNzaW5nLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSG9tZS9jb21wb25lbnRzL1BvcnRmb2xpby9OZXR3b3JrV2lkZ2V0L0FjdGl2ZU5ldHdvcmtXaWRnZXQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSG9tZS9jb21wb25lbnRzL1BvcnRmb2xpby9OZXR3b3JrV2lkZ2V0L0Fzc2V0bGlzdC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Ib21lL2NvbXBvbmVudHMvUG9ydGZvbGlvL05ldHdvcmtXaWRnZXQvTmV0d29ya0xpc3QudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSG9tZS9jb21wb25lbnRzL1BvcnRmb2xpby9OZXR3b3JrV2lkZ2V0L05ldHdvcmtzV2lkZ2V0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0hvbWUvY29tcG9uZW50cy9Qb3J0Zm9saW8vTmV0d29ya1dpZGdldC9QY2hhaW5BY3RpdmVOZXR3b3JrV2lkZ2V0Q29udGVudC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Ib21lL2NvbXBvbmVudHMvUG9ydGZvbGlvL05ldHdvcmtXaWRnZXQvU2VlQWxsTmV0d29ya3NCdXR0b24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSG9tZS9jb21wb25lbnRzL1BvcnRmb2xpby9OZXR3b3JrV2lkZ2V0L1hjaGFpbkFjdGl2ZU5ldHdvcmtXaWRnZXRDb250ZW50LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0hvbWUvY29tcG9uZW50cy9Qb3J0Zm9saW8vTmV0d29ya1dpZGdldC9aZXJvV2lkZ2V0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0hvbWUvY29tcG9uZW50cy9Qb3J0Zm9saW8vTmV0d29ya1dpZGdldC9jb21tb24vTmV0d29ya0NhcmQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvaXNCaXRjb2luLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvbm9ybWFsaXplQmFsYW5jZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBUb2tlbldpdGhCYWxhbmNlLFxuICBUb2tlbldpdGhCYWxhbmNlQVZNLFxufSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgaXNUb2tlbldpdGhCYWxhbmNlQVZNID0gKFxuICBiYWxhbmNlPzogVG9rZW5XaXRoQmFsYW5jZSxcbik6IGJhbGFuY2UgaXMgVG9rZW5XaXRoQmFsYW5jZUFWTSA9PiB7XG4gIGlmICghYmFsYW5jZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiAnYmFsYW5jZVBlclR5cGUnIGluIGJhbGFuY2UgJiYgJ2xvY2tlZCcgaW4gYmFsYW5jZS5iYWxhbmNlUGVyVHlwZTtcbn07XG4iLCJpbXBvcnQge1xuICBUb2tlbldpdGhCYWxhbmNlLFxuICBUb2tlbldpdGhCYWxhbmNlUFZNLFxufSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgaXNUb2tlbldpdGhCYWxhbmNlUFZNID0gKFxuICBiYWxhbmNlPzogVG9rZW5XaXRoQmFsYW5jZSxcbik6IGJhbGFuY2UgaXMgVG9rZW5XaXRoQmFsYW5jZVBWTSA9PiB7XG4gIGlmICghYmFsYW5jZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgICdiYWxhbmNlUGVyVHlwZScgaW4gYmFsYW5jZSAmJiAnbG9ja2VkU3Rha2VkJyBpbiBiYWxhbmNlLmJhbGFuY2VQZXJUeXBlXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgU3RhY2ssIHN0eWxlZCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmV4cG9ydCBjb25zdCBCYWxhbmNlQ29sdW1uID0gc3R5bGVkKFN0YWNrKWBcbiAgYWxpZ24taXRlbXM6IGVuZDtcbiAgcGFkZGluZy1sZWZ0OiA4cHg7XG4gIGxpbmUtaGVpZ2h0OiAxNHB4O1xuYDtcbiIsImltcG9ydCB7IHN0eWxlZCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBUb2tlbkVsbGlwc2lzIH0gZnJvbSAnLi9Ub2tlbkVsbGlwc2lzJztcblxuZXhwb3J0IGNvbnN0IElubGluZVRva2VuRWxsaXBzaXMgPSBzdHlsZWQoVG9rZW5FbGxpcHNpcylgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbmA7XG4iLCJpbXBvcnQgeyBHbG9iZUljb24sIHN0eWxlZCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBpcGZzUmVzb2x2ZXJXaXRoRmFsbGJhY2sgfSBmcm9tICdAc3JjL3V0aWxzL2lwc2ZSZXNvbHZlcldpdGhGYWxsYmFjayc7XG5cbmV4cG9ydCBjb25zdCBHbG9iZUljb25Db250YWluZXIgPSBzdHlsZWQoJ2RpdicpPE5ldHdvcmtMb2dvUHJvcHM+YFxuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiAkeyh7IGhlaWdodCB9KSA9PiBoZWlnaHQgPz8gJzMycHgnfTtcbiAgcG9zaXRpb246ICR7KHsgcG9zaXRpb24gfSkgPT4gcG9zaXRpb24gPz8gJ3N0YXRpYyd9O1xuXHRtYXJnaW46ICR7KHsgbWFyZ2luIH0pID0+IG1hcmdpbiA/PyAnMCd9O1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGJhY2tncm91bmQtY29sb3I6ICdncmV5LjgwMCcsXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbmA7XG5cbmludGVyZmFjZSBOZXR3b3JrTG9nb1Byb3BzIHtcbiAgc3JjPzogc3RyaW5nO1xuICB3aWR0aD86IHN0cmluZztcbiAgaGVpZ2h0Pzogc3RyaW5nO1xuICBwb3NpdGlvbj86IHN0cmluZztcbiAgcGFkZGluZz86IHN0cmluZztcbiAgbWFyZ2luPzogc3RyaW5nO1xufVxuXG5jb25zdCBOZXR3b3JrTG9nb0ltYWdlID0gc3R5bGVkKCdpbWcnKTxOZXR3b3JrTG9nb1Byb3BzPmBcbiAgd2lkdGg6IGF1dG87XG4gIGhlaWdodDogJHsoeyBoZWlnaHQgfSkgPT4gaGVpZ2h0ID8/ICczMnB4J307XG4gIHBvc2l0aW9uOiAkeyh7IHBvc2l0aW9uIH0pID0+IHBvc2l0aW9uID8/ICdzdGF0aWMnfTtcbiAgbWFyZ2luOiAkeyh7IG1hcmdpbiB9KSA9PiBtYXJnaW4gPz8gJzAnfTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIE5ldHdvcmtMb2dvSzIoe1xuICBzcmMsXG4gIGhlaWdodCxcbiAgcG9zaXRpb24sXG4gIG1hcmdpbixcbn06IE5ldHdvcmtMb2dvUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge3NyYyA/IChcbiAgICAgICAgPE5ldHdvcmtMb2dvSW1hZ2VcbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICBzcmM9e2lwZnNSZXNvbHZlcldpdGhGYWxsYmFjayhzcmMpfVxuICAgICAgICAgIHBvc2l0aW9uPXtwb3NpdGlvbn1cbiAgICAgICAgICBtYXJnaW49e21hcmdpbn1cbiAgICAgICAgPjwvTmV0d29ya0xvZ29JbWFnZT5cbiAgICAgICkgOiAoXG4gICAgICAgIDxHbG9iZUljb25Db250YWluZXIgaGVpZ2h0PXtoZWlnaHR9IHBvc2l0aW9uPXtwb3NpdGlvbn0gbWFyZ2luPXttYXJnaW59PlxuICAgICAgICAgIDxHbG9iZUljb24gc2l6ZT17aGVpZ2h0fSBzeD17eyBwOiAwIH19IC8+XG4gICAgICAgIDwvR2xvYmVJY29uQ29udGFpbmVyPlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgU3hQcm9wcywgVG9vbHRpcCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5cbmludGVyZmFjZSBUb2tlbkVsbGlwc2lzUHJvcHMge1xuICBtYXhMZW5ndGg6IG51bWJlcjtcbiAgdGV4dDogc3RyaW5nO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIHN4PzogU3hQcm9wcztcbn1cblxuZnVuY3Rpb24gaXNUcnVuY2F0ZWQobWF4TGVuZ3RoLCB0ZXh0KSB7XG4gIHJldHVybiB0ZXh0Lmxlbmd0aCA+IG1heExlbmd0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRva2VuRWxsaXBzaXMoe1xuICBtYXhMZW5ndGgsXG4gIHRleHQsXG4gIGNsYXNzTmFtZSxcbiAgc3gsXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxUb2tlbkVsbGlwc2lzUHJvcHM+KSB7XG4gIGNvbnN0IG5hbWUgPVxuICAgIHRleHQubGVuZ3RoIDw9IG1heExlbmd0aCA/IHRleHQgOiB0cnVuY2F0ZUFkZHJlc3ModGV4dCwgbWF4TGVuZ3RoIC8gMik7XG4gIHJldHVybiAoXG4gICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgPFRvb2x0aXBcbiAgICAgICAgcGxhY2VtZW50PVwiYm90dG9tXCJcbiAgICAgICAgdGl0bGU9e3RleHR9XG4gICAgICAgIGRpc2FibGVIb3Zlckxpc3RlbmVyPXshaXNUcnVuY2F0ZWQobWF4TGVuZ3RoLCB0ZXh0KX1cbiAgICAgICAgZGlzYWJsZUZvY3VzTGlzdGVuZXI9eyFpc1RydW5jYXRlZChtYXhMZW5ndGgsIHRleHQpfVxuICAgICAgICBzeD17c3ggPz8geyBjdXJzb3I6ICdwb2ludGVyJyB9fVxuICAgICAgPlxuICAgICAgICA8PntuYW1lfTwvPlxuICAgICAgPC9Ub29sdGlwPlxuICAgIDwvc3Bhbj5cbiAgKTtcbn1cbiIsImltcG9ydCB7IGlzQml0Y29pbkNoYWluSWQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0JpdGNvaW5OZXR3b3JrJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VCYWxhbmNlc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JhbGFuY2VzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbnR5cGUgVXNlVG9rZW5QcmljZU1pc3NpbmdQcm9wcyA9IHtcbiAgZmF2b3JpdGVOZXR3b3Jrc01pc3NpbmdQcmljZTogYm9vbGVhbjtcbiAgYWN0aXZlTmV0d29ya01pc3NpbmdQcmljZTogYm9vbGVhbjtcbiAgaXNQcmljZU1pc3NpbmdGcm9tTmV0d29yazogKG5ldHdvcmtJZDogbnVtYmVyKSA9PiBib29sZWFuO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVRva2VuUHJpY2VNaXNzaW5nKCk6IFVzZVRva2VuUHJpY2VNaXNzaW5nUHJvcHMge1xuICBjb25zdCB7IGJhbGFuY2VzLCBpc1Rva2Vuc0NhY2hlZCB9ID0gdXNlQmFsYW5jZXNDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IG5ldHdvcms6IGFjdGl2ZU5ldHdvcmssIGZhdm9yaXRlTmV0d29ya3MgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IHsgZ2V0VG9rZW5WaXNpYmlsaXR5IH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcblxuICBjb25zdCBuZXR3b3Jrc01pc3NpbmdQcmljZTogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoaXNUb2tlbnNDYWNoZWQpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXR3b3JrSWRzID0gT2JqZWN0LmtleXMoYmFsYW5jZXMudG9rZW5zID8/IHt9KTtcbiAgICBpZiAoIW5ldHdvcmtJZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgY29uc3QgbmV0d29ya3NJc01pc3NpbmdQcmljZXMgPSB7fTtcblxuICAgIG5ldHdvcmtJZHMuZm9yRWFjaCgobmV0d29ya0lkKSA9PiB7XG4gICAgICBjb25zdCB0b2tlbnNGb3JOZXR3b3JrID0gYmFsYW5jZXMudG9rZW5zPy5bbmV0d29ya0lkXTtcblxuICAgICAgLy8gSWYgdGhlIG5ldHdvcmsgZG9lcyBub3QgaGF2ZSBhbnkgdG9rZW5zIHdpdGggYmFsYW5jZSBkbyBub3RoaW5nLFxuICAgICAgaWYgKCF0b2tlbnNGb3JOZXR3b3JrKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWRkcmVzc1RvQ2hlY2sgPSBpc0JpdGNvaW5DaGFpbklkKE51bWJlcihuZXR3b3JrSWQpKVxuICAgICAgICA/IGFjdGl2ZUFjY291bnQ/LmFkZHJlc3NCVENcbiAgICAgICAgOiBhY3RpdmVBY2NvdW50Py5hZGRyZXNzQztcblxuICAgICAgLy8gSWYgYW4gYWRkcmVzcyB0byBjaGVjayBpcyBub3QgYXZhaWxhYmxlLCBkbyBub3RoaW5nLlxuICAgICAgaWYgKCFhZGRyZXNzVG9DaGVjaykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRva2Vuc0ZvckFjdGl2ZUFjY291bnQgPSB0b2tlbnNGb3JOZXR3b3JrW2FkZHJlc3NUb0NoZWNrXTtcblxuICAgICAgLy8gSWYgdG9rZW5zIGZvciBhY3RpdmUgYWNjb3VudCBub3QgYXZhaWxhYmxlLCBkbyBub3RoaW5nLlxuICAgICAgaWYgKCF0b2tlbnNGb3JBY3RpdmVBY2NvdW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGlzTWlzc2luZ1ByaWNlcyA9IE9iamVjdC52YWx1ZXModG9rZW5zRm9yQWN0aXZlQWNjb3VudClcbiAgICAgICAgLmZpbHRlcihnZXRUb2tlblZpc2liaWxpdHkpIC8vIERpc3JlZ2FyZCBoaWRkZW4gdG9rZW5zXG4gICAgICAgIC5zb21lKFxuICAgICAgICAgICh0b2tlbikgPT4gdG9rZW4uYmFsYW5jZSA+IDBuICYmIHRva2VuLnByaWNlSW5DdXJyZW5jeSA9PT0gdW5kZWZpbmVkLCAvLyBPbmx5IGxvb2sgYXQgdG9rZW5zIHRoYXQgYWN0dWFsbHkgaGF2ZSBzb21lIGJhbGFuY2VcbiAgICAgICAgKTtcblxuICAgICAgbmV0d29ya3NJc01pc3NpbmdQcmljZXNbbmV0d29ya0lkXSA9IGlzTWlzc2luZ1ByaWNlcztcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXR3b3Jrc0lzTWlzc2luZ1ByaWNlcztcbiAgfSwgW1xuICAgIGFjdGl2ZUFjY291bnQ/LmFkZHJlc3NCVEMsXG4gICAgYWN0aXZlQWNjb3VudD8uYWRkcmVzc0MsXG4gICAgaXNUb2tlbnNDYWNoZWQsXG4gICAgYmFsYW5jZXMudG9rZW5zLFxuICAgIGdldFRva2VuVmlzaWJpbGl0eSxcbiAgXSk7XG5cbiAgY29uc3QgZmF2b3JpdGVOZXR3b3Jrc01pc3NpbmdQcmljZSA9IHVzZU1lbW8oXG4gICAgKCkgPT5cbiAgICAgIGZhdm9yaXRlTmV0d29ya3Muc29tZShcbiAgICAgICAgKG5ldHdvcmspID0+IG5ldHdvcmtzTWlzc2luZ1ByaWNlW25ldHdvcmsuY2hhaW5JZF0gPT09IHRydWUsXG4gICAgICApLFxuICAgIFtmYXZvcml0ZU5ldHdvcmtzLCBuZXR3b3Jrc01pc3NpbmdQcmljZV0sXG4gICk7XG5cbiAgY29uc3QgYWN0aXZlTmV0d29ya01pc3NpbmdQcmljZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghYWN0aXZlTmV0d29yaz8uY2hhaW5JZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbmV0d29ya3NNaXNzaW5nUHJpY2VbYWN0aXZlTmV0d29yay5jaGFpbklkXSA9PT0gdHJ1ZTtcbiAgfSwgW2FjdGl2ZU5ldHdvcms/LmNoYWluSWQsIG5ldHdvcmtzTWlzc2luZ1ByaWNlXSk7XG5cbiAgY29uc3QgaXNQcmljZU1pc3NpbmdGcm9tTmV0d29yayA9IHVzZUNhbGxiYWNrKFxuICAgIChuZXR3b3JrSWQ6IG51bWJlcikgPT4ge1xuICAgICAgcmV0dXJuIG5ldHdvcmtzTWlzc2luZ1ByaWNlW25ldHdvcmtJZF0gPT09IHRydWU7XG4gICAgfSxcbiAgICBbbmV0d29ya3NNaXNzaW5nUHJpY2VdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgZmF2b3JpdGVOZXR3b3Jrc01pc3NpbmdQcmljZSxcbiAgICBhY3RpdmVOZXR3b3JrTWlzc2luZ1ByaWNlLFxuICAgIGlzUHJpY2VNaXNzaW5nRnJvbU5ldHdvcmssXG4gIH07XG59XG4iLCJpbXBvcnQgeyBBc3NldGxpc3QgfSBmcm9tICcuL0Fzc2V0bGlzdCc7XG5pbXBvcnQgeyBOZXR3b3JrQ2FyZCB9IGZyb20gJy4vY29tbW9uL05ldHdvcmtDYXJkJztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IFplcm9XaWRnZXQgfSBmcm9tICcuL1plcm9XaWRnZXQnO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyB1c2VCYWxhbmNlc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JhbGFuY2VzUHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgQnJpZGdlSWNvbixcbiAgQnV0dG9uLFxuICBDaGlwLFxuICBEaXZpZGVyLFxuICBTa2VsZXRvbixcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG4gIEFsZXJ0VHJpYW5nbGVJY29uLFxuICBCYWRnZSxcbiAgQ2hlY2tJY29uLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgVG9rZW5JY29uIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkljb24nO1xuaW1wb3J0IHsgTmV0d29ya0xvZ29LMiB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vTmV0d29ya0xvZ29LMic7XG5pbXBvcnQgeyBpc0JpdGNvaW4gfSBmcm9tICdAc3JjL3V0aWxzL2lzQml0Y29pbic7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb25zIH0gZnJvbSAnQHNyYy9wYWdlcy9CcmlkZ2UvaG9va3MvdXNlUGVuZGluZ0JyaWRnZVRyYW5zYWN0aW9ucyc7XG5pbXBvcnQgeyBpc0JpdGNvaW5OZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNCaXRjb2luTmV0d29yayc7XG5pbXBvcnQgeyBpc1BjaGFpbk5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZVBjaGFpbk5ldHdvcmsnO1xuaW1wb3J0IHsgUGNoYWluQWN0aXZlTmV0d29ya1dpZGdldENvbnRlbnQgfSBmcm9tICcuL1BjaGFpbkFjdGl2ZU5ldHdvcmtXaWRnZXRDb250ZW50JztcbmltcG9ydCB7IFBBbmRMIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Qcm9maXRBbmRMb3NzJztcbmltcG9ydCB7IGlzWGNoYWluTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzQXZhbGFuY2hlWGNoYWluTmV0d29yayc7XG5pbXBvcnQgeyBYY2hhaW5BY3RpdmVOZXR3b3JrV2lkZ2V0Q29udGVudCB9IGZyb20gJy4vWGNoYWluQWN0aXZlTmV0d29ya1dpZGdldENvbnRlbnQnO1xuaW1wb3J0IHsgaXNUb2tlbldpdGhCYWxhbmNlUFZNIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2JhbGFuY2VzL3V0aWxzL2lzVG9rZW5XaXRoQmFsYW5jZVBWTSc7XG5pbXBvcnQgeyBpc1Rva2VuV2l0aEJhbGFuY2VBVk0gfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvdXRpbHMvaXNUb2tlbldpdGhCYWxhbmNlQVZNJztcbmltcG9ydCB7IG5vcm1hbGl6ZUJhbGFuY2UgfSBmcm9tICdAc3JjL3V0aWxzL25vcm1hbGl6ZUJhbGFuY2UnO1xuaW1wb3J0IEJpZyBmcm9tICdiaWcuanMnO1xuaW1wb3J0IHsgVG9rZW5XaXRoQmFsYW5jZSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbmludGVyZmFjZSBBY3RpdmVOZXR3b3JrV2lkZ2V0UHJvcHMge1xuICBhc3NldExpc3Q6IFRva2VuV2l0aEJhbGFuY2VbXTtcbiAgYWN0aXZlTmV0d29ya0JhbGFuY2U6IG51bWJlcjtcbiAgYWN0aXZlTmV0d29ya1ByaWNlQ2hhbmdlcz86IHsgdmFsdWU6IG51bWJlcjsgcGVyY2VudGFnZTogbnVtYmVyW10gfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFjdGl2ZU5ldHdvcmtXaWRnZXQoe1xuICBhc3NldExpc3QsXG4gIGFjdGl2ZU5ldHdvcmtCYWxhbmNlLFxuICBhY3RpdmVOZXR3b3JrUHJpY2VDaGFuZ2VzLFxufTogQWN0aXZlTmV0d29ya1dpZGdldFByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcbiAgY29uc3QgeyBuZXR3b3JrLCBpc0N1c3RvbU5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG5cbiAgY29uc3QgeyBjdXJyZW5jeUZvcm1hdHRlciB9ID0gdXNlU2V0dGluZ3NDb250ZXh0KCk7XG4gIGNvbnN0IHsgaXNUb2tlbnNDYWNoZWQgfSA9IHVzZUJhbGFuY2VzQ29udGV4dCgpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcblxuICBjb25zdCBicmlkZ2VUcmFuc2FjdGlvbnMgPSB1c2VQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb25zKCk7XG4gIGNvbnN0IGNoYW5nZVBlcmNlbnRhZ2UgPSBhY3RpdmVOZXR3b3JrUHJpY2VDaGFuZ2VzXG4gICAgPyAoYWN0aXZlTmV0d29ya1ByaWNlQ2hhbmdlcz8udmFsdWUgLyBhY3RpdmVOZXR3b3JrQmFsYW5jZSkgKiAxMDBcbiAgICA6IHVuZGVmaW5lZDtcblxuICBpZiAoIW5ldHdvcmsgfHwgIWFzc2V0TGlzdD8ubGVuZ3RoKSB7XG4gICAgcmV0dXJuIDxTa2VsZXRvbiB2YXJpYW50PVwicm91bmRlZFwiIHN4PXt7IHdpZHRoOiAzNDMsIGhlaWdodDogMTkwIH19IC8+O1xuICB9XG5cbiAgY29uc3QgaGFuZGxlQ2FyZENsaWNrID0gKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNhcHR1cmUoJ1BvcnRmb2xpb1ByaW1hcnlOZXR3b3JrQ2xpY2tlZCcsIHsgY2hhaW5JZDogbmV0d29yay5jaGFpbklkIH0pO1xuXG4gICAgaWYgKFxuICAgICAgaXNCaXRjb2luTmV0d29yayhuZXR3b3JrKSB8fFxuICAgICAgaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspIHx8XG4gICAgICBpc1hjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICApIHtcbiAgICAgIGhpc3RvcnkucHVzaCgnL3Rva2VuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpc3RvcnkucHVzaCgnL2Fzc2V0cycpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBmaXJzdEFzc2V0ID0gYXNzZXRMaXN0WzBdO1xuICBjb25zdCBmdW5kcyA9XG4gICAgZmlyc3RBc3NldCAmJiAnZGVjaW1hbHMnIGluIGZpcnN0QXNzZXRcbiAgICAgID8gKG5vcm1hbGl6ZUJhbGFuY2UoZmlyc3RBc3NldC5iYWxhbmNlLCBmaXJzdEFzc2V0LmRlY2ltYWxzKSA/P1xuICAgICAgICBuZXcgQmlnKDApKVxuICAgICAgOiBuZXcgQmlnKDApO1xuICBjb25zdCBoYXNOb0Z1bmRzID0gYXNzZXRMaXN0Lmxlbmd0aCA9PT0gMSAmJiBmdW5kcz8uZXEobmV3IEJpZygwKSk7XG5cbiAgY29uc3Qgc2VsZWN0ZWRBc3NldExpc3QgPSBhc3NldExpc3RbMF07XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPE5ldHdvcmtDYXJkXG4gICAgICAgIGRhdGEtdGVzdGlkPVwiYWN0aXZlLW5ldHdvcmstY2FyZFwiXG4gICAgICAgIGRpc3BsYXk9XCJibG9ja1wiXG4gICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNhcmRDbGlja31cbiAgICAgID5cbiAgICAgICAgPFN0YWNrIHN4PXt7IGhlaWdodDogJzEwMCUnLCByb3dHYXA6IDEgfX0+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCYWRnZVxuICAgICAgICAgICAgICBiYWRnZUNvbnRlbnQ9e1xuICAgICAgICAgICAgICAgIE9iamVjdC52YWx1ZXMoYnJpZGdlVHJhbnNhY3Rpb25zKS5sZW5ndGggPyAoXG4gICAgICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17XG4gICAgICAgICAgICAgICAgICAgICAgPFRyYW5zIGkxOG5LZXk9XCJCcmlkZ2UgaW4gcHJvZ3Jlc3MuIDxici8+IENsaWNrIGZvciBkZXRhaWxzLlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3g9e3sgY3Vyc29yOiAncG9pbnRlcicgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPD57T2JqZWN0LnZhbHVlcyhicmlkZ2VUcmFuc2FjdGlvbnMpLmxlbmd0aH08Lz5cbiAgICAgICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFRva2VuSWNvblxuICAgICAgICAgICAgICAgIHdpZHRoPVwiNDBweFwiXG4gICAgICAgICAgICAgICAgaGVpZ2h0PVwiNDBweFwiXG4gICAgICAgICAgICAgICAgc3JjPXtuZXR3b3JrLmxvZ29Vcml9XG4gICAgICAgICAgICAgICAgbmFtZT17bmV0d29yay5jaGFpbk5hbWV9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8TmV0d29ya0xvZ29LMiBoZWlnaHQ9XCI0MHB4XCIgc3JjPXtuZXR3b3JrLmxvZ29Vcml9IC8+XG4gICAgICAgICAgICAgIDwvVG9rZW5JY29uPlxuICAgICAgICAgICAgPC9CYWRnZT5cbiAgICAgICAgICAgIDxDaGlwXG4gICAgICAgICAgICAgIGxhYmVsPXt0KCdBY3RpdmUnKX1cbiAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyMHB4JyxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3N1Y2Nlc3MubWFpbicsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGljb249ezxDaGVja0ljb24gY29sb3I9XCJzdWNjZXNzLm1haW5cIiAvPn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8U3RhY2sganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIiBzeD17eyByb3dHYXA6IDAuNSB9fT5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY3RpdmUtbmV0d29yay1uYW1lXCJcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiaDVcIlxuICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAnZ3JleS4zMDAnIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7bmV0d29yaz8uY2hhaW5OYW1lfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyB0ZXh0QWxpZ246ICdlbmQnIH19PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjdGl2ZS1uZXR3b3JrLXRvdGFsLWJhbGFuY2VcIlxuICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImg2XCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7Y3VycmVuY3lGb3JtYXR0ZXIoYWN0aXZlTmV0d29ya0JhbGFuY2UpfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cblxuICAgICAgICAgICAgICAgIHshaXNDdXN0b21OZXR3b3JrKG5ldHdvcmsuY2hhaW5JZCkgJiYgKFxuICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtpc1Rva2Vuc0NhY2hlZCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXt0KCdCYWxhbmNlcyBsb2FkaW5nLi4uJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ9XCJib3R0b21cIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxBbGVydFRyaWFuZ2xlSWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPXsxNH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd3YXJuaW5nLm1haW4nLCBtcjogMSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgPFBBbmRMXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2FjdGl2ZU5ldHdvcmtQcmljZUNoYW5nZXM/LnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnRhZ2U9e2NoYW5nZVBlcmNlbnRhZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgc2l6ZT1cImJpZ1wiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxEaXZpZGVyXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIG15OiAyLFxuICAgICAgICAgICAgd2lkdGg6ICdhdXRvJyxcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICB7aXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspICYmXG4gICAgICAgIGlzVG9rZW5XaXRoQmFsYW5jZVBWTShzZWxlY3RlZEFzc2V0TGlzdCkgPyAoXG4gICAgICAgICAgPFBjaGFpbkFjdGl2ZU5ldHdvcmtXaWRnZXRDb250ZW50IGJhbGFuY2VzPXtzZWxlY3RlZEFzc2V0TGlzdH0gLz5cbiAgICAgICAgKSA6IGlzWGNoYWluTmV0d29yayhuZXR3b3JrKSAmJlxuICAgICAgICAgIGlzVG9rZW5XaXRoQmFsYW5jZUFWTShzZWxlY3RlZEFzc2V0TGlzdCkgPyAoXG4gICAgICAgICAgPFhjaGFpbkFjdGl2ZU5ldHdvcmtXaWRnZXRDb250ZW50IGJhbGFuY2VzPXtzZWxlY3RlZEFzc2V0TGlzdH0gLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8QXNzZXRsaXN0IGFzc2V0TGlzdD17YXNzZXRMaXN0fSAvPlxuICAgICAgICApfVxuXG4gICAgICAgIHtoYXNOb0Z1bmRzICYmICFpc0JpdGNvaW4obmV0d29yaykgPyA8WmVyb1dpZGdldCAvPiA6IG51bGx9XG5cbiAgICAgICAge2lzQml0Y29pbihuZXR3b3JrKSA/IChcbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImJ0Yy1icmlkZ2UtYnV0dG9uXCJcbiAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgbXQ6IDIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25DbGljaz17KGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoKCcvYnJpZGdlJyk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCcmlkZ2VJY29uXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgbXI6IDEsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge3QoJ0JyaWRnZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvTmV0d29ya0NhcmQ+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBUb2tlbkljb24gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1Rva2VuSWNvbic7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlU2V0U2VuZERhdGFJblBhcmFtcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlU2V0U2VuZERhdGFJblBhcmFtcyc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgSW5saW5lVG9rZW5FbGxpcHNpcyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vSW5saW5lVG9rZW5FbGxpcHNpcyc7XG5pbXBvcnQgeyBUb2tlblVuaXQgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIENoZXZyb25SaWdodEljb24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICBrZXlmcmFtZXMsXG4gIHN0eWxlZCxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFRva2VuRWxsaXBzaXMgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1Rva2VuRWxsaXBzaXMnO1xuaW1wb3J0IHsgQmFsYW5jZUNvbHVtbiB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vQmFsYW5jZUNvbHVtbic7XG5pbXBvcnQgeyBQQW5kTCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vUHJvZml0QW5kTG9zcyc7XG5pbXBvcnQgeyBoYXNVbmNvbmZpcm1lZEJhbGFuY2UgfSBmcm9tICdAc3JjL3V0aWxzL2hhc1VuY29uZmlybWVkQmFsYW5jZSc7XG5pbXBvcnQgeyBUb2tlblR5cGUsIFRva2VuV2l0aEJhbGFuY2UgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgZ2V0VW5jb25maXJtZWRCYWxhbmNlSW5DdXJyZW5jeSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9iYWxhbmNlcy9tb2RlbHMnO1xuXG5pbnRlcmZhY2UgQXNzZXRMaXN0UHJvcHMge1xuICBhc3NldExpc3Q6IFRva2VuV2l0aEJhbGFuY2VbXTtcbn1cblxuY29uc3QgU2hvd0FuaW1hdGlvbiA9IGtleWZyYW1lc2BcbjAlIHtcbiAgb3BhY2l0eTogMDtcbn1cbjEwMCUge1xuICBvcGFjaXR5OiAxO1xufVxuYDtcblxuY29uc3QgSGlkZUFuaW1hdGlvbiA9IGtleWZyYW1lc2BcbjAlIHtcbiAgb3BhY2l0eTogMTtcbn1cbjEwMCUge1xuICBvcGFjaXR5OiAwO1xufVxuYDtcblxuY29uc3QgQXNzZXRsaXN0Um93ID0gc3R5bGVkKFN0YWNrKWBcbiAgJjpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmNvbW1vbi53aGl0ZX00MGB9O1xuICAgID4gLmJhbGFuY2UtY29sdW1uID4gLmJhbGFuY2Uge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBhbmltYXRpb246IDAuM3MgZWFzZS1pbi1vdXQgJHtTaG93QW5pbWF0aW9ufTtcbiAgICB9XG4gICAgPiAuYmFsYW5jZS1jb2x1bW4gPiAuYmFsYW5jZS11c2Qge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIGFuaW1hdGlvbjogMC4zcyBlYXNlLWluLW91dCAke0hpZGVBbmltYXRpb259O1xuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIEFzc2V0bGlzdCh7IGFzc2V0TGlzdCB9OiBBc3NldExpc3RQcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCB7IGN1cnJlbmN5Rm9ybWF0dGVyLCBnZXRUb2tlblZpc2liaWxpdHkgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICBjb25zdCBtYXhBc3NldENvdW50ID0gNDtcblxuICBjb25zdCBzZXRTZW5kRGF0YUluUGFyYW1zID0gdXNlU2V0U2VuZERhdGFJblBhcmFtcygpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuXG4gIGNvbnN0IGZpbHRlcmVkQXNzZXRMaXN0ID0gYXNzZXRMaXN0XG4gICAgLmZpbHRlcigoYXNzZXQpID0+IGdldFRva2VuVmlzaWJpbGl0eShhc3NldCkpXG4gICAgLnNvcnQoKGEsIGIpID0+IChiLmJhbGFuY2VJbkN1cnJlbmN5ID8/IDApIC0gKGEuYmFsYW5jZUluQ3VycmVuY3kgPz8gMCkpO1xuXG4gIGNvbnN0IHJlc3RBc3NldENvdW50ID0gZmlsdGVyZWRBc3NldExpc3QubGVuZ3RoIC0gbWF4QXNzZXRDb3VudDtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7ZmlsdGVyZWRBc3NldExpc3Quc2xpY2UoMCwgbWF4QXNzZXRDb3VudCkubWFwKCh0b2tlbikgPT4ge1xuICAgICAgICBjb25zdCB0b3RhbEJhbGFuY2UgPVxuICAgICAgICAgIHRva2VuLmJhbGFuY2UgJiYgaGFzVW5jb25maXJtZWRCYWxhbmNlKHRva2VuKVxuICAgICAgICAgICAgPyBuZXcgVG9rZW5Vbml0KFxuICAgICAgICAgICAgICAgIHRva2VuLmJhbGFuY2UgKyB0b2tlbi51bmNvbmZpcm1lZEJhbGFuY2UsXG4gICAgICAgICAgICAgICAgdG9rZW4uZGVjaW1hbHMsXG4gICAgICAgICAgICAgICAgdG9rZW4uc3ltYm9sLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IG5ldyBUb2tlblVuaXQoXG4gICAgICAgICAgICAgICAgdG9rZW4uYmFsYW5jZSxcbiAgICAgICAgICAgICAgICAnZGVjaW1hbHMnIGluIHRva2VuID8gdG9rZW4uZGVjaW1hbHMgOiAwLFxuICAgICAgICAgICAgICAgIHRva2VuLnN5bWJvbCxcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBiYWxhbmNlSW5DdXJyZW5jeSA9IHRva2VuLmJhbGFuY2VJbkN1cnJlbmN5O1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEFzc2V0bGlzdFJvd1xuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2Ake3Rva2VuLnN5bWJvbC50b0xvd2VyQ2FzZSgpfS10b2tlbi1saXN0LXJvd2B9XG4gICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxuICAgICAgICAgICAgbWFyZ2luPVwiMCAtMTZweFwiXG4gICAgICAgICAgICBwYWRkaW5nPVwiNHB4IDE2cHhcIlxuICAgICAgICAgICAga2V5PXt0b2tlbi50eXBlID09PSBUb2tlblR5cGUuTkFUSVZFID8gdG9rZW4uc3ltYm9sIDogdG9rZW4uYWRkcmVzc31cbiAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGNhcHR1cmUoJ1BvcnRmb2xpb1Rva2VuU2VsZWN0ZWQnLCB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRUb2tlbjpcbiAgICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5FUkMyMCA/IHRva2VuLmFkZHJlc3MgOiB0b2tlbi5zeW1ib2wsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBzZXRTZW5kRGF0YUluUGFyYW1zKHtcbiAgICAgICAgICAgICAgICB0b2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgb3B0aW9uczogeyBwYXRoOiAnL3Rva2VuJyB9LFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIGFsaWduSXRlbXM9XCJjZW50ZXJcIj5cbiAgICAgICAgICAgICAgPFRva2VuSWNvblxuICAgICAgICAgICAgICAgIHdpZHRoPVwiMjRweFwiXG4gICAgICAgICAgICAgICAgaGVpZ2h0PVwiMjRweFwiXG4gICAgICAgICAgICAgICAgc3JjPXt0b2tlbi5sb2dvVXJpfVxuICAgICAgICAgICAgICAgIG5hbWU9e3Rva2VuLm5hbWV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyBtbDogMSB9fT5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSBkYXRhLXRlc3RpZD1cInRva2VuLXJvdy1uYW1lXCIgdmFyaWFudD1cImJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgPFRva2VuRWxsaXBzaXMgbWF4TGVuZ3RoPXsxMn0gdGV4dD17dG9rZW4ubmFtZX0gLz5cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgICAgICAgIHt0b3RhbEJhbGFuY2UudG9EaXNwbGF5KCl9eycgJ31cbiAgICAgICAgICAgICAgICAgIDxJbmxpbmVUb2tlbkVsbGlwc2lzIG1heExlbmd0aD17OH0gdGV4dD17dG9rZW4uc3ltYm9sfSAvPlxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8QmFsYW5jZUNvbHVtbiBjbGFzc05hbWU9XCJiYWxhbmNlLWNvbHVtblwiPlxuICAgICAgICAgICAgICB7dHlwZW9mIGJhbGFuY2VJbkN1cnJlbmN5ID09PSAnbnVtYmVyJyAmJiAoXG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwidG9rZW4tcm93LWN1cnJlbmN5LWJhbGFuY2VcIlxuICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2N1cnJlbmN5Rm9ybWF0dGVyKFxuICAgICAgICAgICAgICAgICAgICBiYWxhbmNlSW5DdXJyZW5jeSArXG4gICAgICAgICAgICAgICAgICAgICAgKGdldFVuY29uZmlybWVkQmFsYW5jZUluQ3VycmVuY3kodG9rZW4pID8/IDApLFxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgICB7dG9rZW4ucHJpY2VDaGFuZ2VzICYmXG4gICAgICAgICAgICAgICAgdG9rZW4ucHJpY2VDaGFuZ2VzLnZhbHVlICYmXG4gICAgICAgICAgICAgICAgdG9rZW4ucHJpY2VDaGFuZ2VzLnBlcmNlbnRhZ2UgPyAoXG4gICAgICAgICAgICAgICAgICA8UEFuZExcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Rva2VuLnByaWNlQ2hhbmdlcy52YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudGFnZT17dG9rZW4ucHJpY2VDaGFuZ2VzLnBlcmNlbnRhZ2V9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9CYWxhbmNlQ29sdW1uPlxuICAgICAgICAgIDwvQXNzZXRsaXN0Um93PlxuICAgICAgICApO1xuICAgICAgfSl9XG4gICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIganVzdGlmeUNvbnRlbnQ9XCJmbGV4LWVuZFwiPlxuICAgICAgICB7cmVzdEFzc2V0Q291bnQgPiAwICYmIChcbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoaXN0b3J5LnB1c2goJy9hc3NldHMnKX1cbiAgICAgICAgICAgIHN4PXt7IG10OiAxLCBjb2xvcjogJ3NlY29uZGF5Lm1haW4nLCBwOiAwIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgICAgIGFsaWduQ29udGVudD1cImNlbnRlclwiXG4gICAgICAgICAgICAgIHN4PXt7IGNvbHVtbkdhcDogJzEwcHgnIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dCgnK3t7cmVzdEFzc2V0Q291bnR9fSBtb3JlJywgeyByZXN0QXNzZXRDb3VudCB9KX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8Q2hldnJvblJpZ2h0SWNvbiBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUJhbGFuY2VzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQmFsYW5jZXNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IE5ldHdvcmtDYXJkIH0gZnJvbSAnLi9jb21tb24vTmV0d29ya0NhcmQnO1xuaW1wb3J0IHsgZ2V0TmV0d29ya0JhbGFuY2UsIHRva2Vuc1dpdGhCYWxhbmNlcyB9IGZyb20gJy4vTmV0d29ya3NXaWRnZXQnO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcbmltcG9ydCB7IE5ldHdvcmtMb2dvIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9OZXR3b3JrTG9nbyc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyBTZWVBbGxOZXR3b3Jrc0J1dHRvbiB9IGZyb20gJy4vU2VlQWxsTmV0d29ya3NCdXR0b24nO1xuaW1wb3J0IHtcbiAgQWxlcnRUcmlhbmdsZUljb24sXG4gIFRvb2x0aXAsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICBzdHlsZWQsXG4gIFNrZWxldG9uLFxuICBCYWRnZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyB1c2VCcmlkZ2VDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9CcmlkZ2VQcm92aWRlcic7XG5pbXBvcnQgeyBmaWx0ZXJCcmlkZ2VTdGF0ZVRvTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9icmlkZ2UvdXRpbHMnO1xuaW1wb3J0IHsgdXNlVW5pZmllZEJyaWRnZUNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1VuaWZpZWRCcmlkZ2VQcm92aWRlcic7XG5pbXBvcnQgeyBjYWlwVG9DaGFpbklkIH0gZnJvbSAnQHNyYy91dGlscy9jYWlwQ29udmVyc2lvbic7XG5pbXBvcnQgeyBnZXRBZGRyZXNzRm9yQ2hhaW4gfSBmcm9tICdAc3JjL3V0aWxzL2dldEFkZHJlc3NGb3JDaGFpbic7XG5pbXBvcnQgeyBOZXR3b3JrV2l0aENhaXBJZCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL21vZGVscyc7XG5cbmNvbnN0IExvZ29Db250YWluZXIgPSBzdHlsZWQoJ2RpdicpYFxuICBtYXJnaW4tdG9wOiA0cHg7XG4gIG1hcmdpbi1yaWdodDogMTZweDtcbmA7XG5cbmNvbnN0IE5ldHdvcmtMaXN0Q29udGFpbmVyID0gc3R5bGVkKFN0YWNrKWBcbiAgbWFyZ2luOiAxNnB4IDA7XG4gIGZsZXgtd3JhcDogd3JhcDtcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBOZXR3b3JrTGlzdCgpIHtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IHsgbmV0d29yaywgbmV0d29ya3MsIHNldE5ldHdvcmssIGZhdm9yaXRlTmV0d29ya3MsIGlzQ3VzdG9tTmV0d29yayB9ID1cbiAgICB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCB7IGJhbGFuY2VzLCBpc1Rva2Vuc0NhY2hlZCB9ID0gdXNlQmFsYW5jZXNDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGJyaWRnZVN0YXRlIH0gPSB1c2VCcmlkZ2VDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBzdGF0ZTogeyBwZW5kaW5nVHJhbnNmZXJzOiB1bmlmaWVkQnJpZGdlVHhzIH0sXG4gIH0gPSB1c2VVbmlmaWVkQnJpZGdlQ29udGV4dCgpO1xuXG4gIGZ1bmN0aW9uIGdldE5ldHdvcmtWYWx1ZShsb29rdXBOZXR3b3JrOiBOZXR3b3JrV2l0aENhaXBJZCkge1xuICAgIGNvbnN0IG5ldHdvcmtBZGRyZXNzID0gZ2V0QWRkcmVzc0ZvckNoYWluKGxvb2t1cE5ldHdvcmssIGFjdGl2ZUFjY291bnQpO1xuICAgIGNvbnN0IG5ldHdvcmtCYWxhbmNlcyA9IGJhbGFuY2VzLnRva2Vucz8uW2xvb2t1cE5ldHdvcmsuY2hhaW5JZF07XG4gICAgY29uc3QgbmV0d29ya0Fzc2V0TGlzdCA9IG5ldHdvcmtCYWxhbmNlc1xuICAgICAgPyB0b2tlbnNXaXRoQmFsYW5jZXMoT2JqZWN0LnZhbHVlcyhuZXR3b3JrQmFsYW5jZXNbbmV0d29ya0FkZHJlc3NdID8/IHt9KSlcbiAgICAgIDogbnVsbDtcbiAgICByZXR1cm4gbmV0d29ya0Fzc2V0TGlzdCA/IGdldE5ldHdvcmtCYWxhbmNlKG5ldHdvcmtBc3NldExpc3QpIDogMDtcbiAgfVxuXG4gIGNvbnN0IGZhdm9yaXRlTmV0d29ya3NXaXRob3V0QWN0aXZlID0gZmF2b3JpdGVOZXR3b3Jrc1xuICAgIC5maWx0ZXIoKG5ldHdvcmtJdGVtKSA9PiBuZXR3b3JrSXRlbS5jaGFpbklkICE9PSBuZXR3b3JrPy5jaGFpbklkKVxuICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCBuZXR3b3JrQmFsYW5jZUZvckEgPSBnZXROZXR3b3JrVmFsdWUoYSk7XG4gICAgICBjb25zdCBuZXR3b3JrQmFsYW5jZUZvckIgPSBnZXROZXR3b3JrVmFsdWUoYik7XG4gICAgICByZXR1cm4gbmV0d29ya0JhbGFuY2VGb3JCIC0gbmV0d29ya0JhbGFuY2VGb3JBO1xuICAgIH0pO1xuXG4gIC8vIHdlIGRvbid0IGtub3cgdGhlIG5ldHdvcmsgbGlzdCB5ZXQuIExldHMgc2hvdyB0aGUgcGxhY2Vob2xkZXIgdGlsZXMgaW5zdGVhZFxuICBpZiAoIW5ldHdvcmtzLmxlbmd0aCkge1xuICAgIHJldHVybiAoXG4gICAgICA8TmV0d29ya0xpc3RDb250YWluZXIgZGlyZWN0aW9uPVwicm93XCIganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCI+XG4gICAgICAgIDxTa2VsZXRvbiB2YXJpYW50PVwicm91bmRlZFwiIHN4PXt7IGhlaWdodDogODksIHdpZHRoOiAxNjQsIG1iOiAyIH19IC8+XG4gICAgICAgIDxTa2VsZXRvbiB2YXJpYW50PVwicm91bmRlZFwiIHN4PXt7IGhlaWdodDogODksIHdpZHRoOiAxNjQsIG1iOiAyIH19IC8+XG4gICAgICA8L05ldHdvcmtMaXN0Q29udGFpbmVyPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8TmV0d29ya0xpc3RDb250YWluZXIgZGlyZWN0aW9uPVwicm93XCIganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCI+XG4gICAgICAgIHtmYXZvcml0ZU5ldHdvcmtzV2l0aG91dEFjdGl2ZS5tYXAoKGZhdm9yaXRlTmV0d29yaykgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgYnJpZGdlVHJhbnNhY3Rpb25zOiBsZWdhY3lCcmlkZ2VUeHMgfSA9XG4gICAgICAgICAgICBmaWx0ZXJCcmlkZ2VTdGF0ZVRvTmV0d29yayhicmlkZ2VTdGF0ZSwgZmF2b3JpdGVOZXR3b3JrKTtcbiAgICAgICAgICBjb25zdCBmaWx0ZXJlZFVuaWZpZWRCcmlkZ2VUeHMgPSBPYmplY3QudmFsdWVzKFxuICAgICAgICAgICAgdW5pZmllZEJyaWRnZVR4cyxcbiAgICAgICAgICApLmZpbHRlcigoeyBzb3VyY2VDaGFpbiwgdGFyZ2V0Q2hhaW4gfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgY2FpcFRvQ2hhaW5JZChzb3VyY2VDaGFpbi5jaGFpbklkKSA9PT0gZmF2b3JpdGVOZXR3b3JrLmNoYWluSWQgfHxcbiAgICAgICAgICAgICAgY2FpcFRvQ2hhaW5JZCh0YXJnZXRDaGFpbi5jaGFpbklkKSA9PT0gZmF2b3JpdGVOZXR3b3JrLmNoYWluSWRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uc3QgYnJpZGdlVHJhbnNhY3Rpb25zID0gW1xuICAgICAgICAgICAgLi4uT2JqZWN0LnZhbHVlcyhsZWdhY3lCcmlkZ2VUeHMpLFxuICAgICAgICAgICAgLi4uZmlsdGVyZWRVbmlmaWVkQnJpZGdlVHhzLFxuICAgICAgICAgIF07XG4gICAgICAgICAgY29uc3QgbmV0d29ya0JhbGFuY2VzID0gYmFsYW5jZXMudG9rZW5zPy5bZmF2b3JpdGVOZXR3b3JrLmNoYWluSWRdO1xuICAgICAgICAgIGNvbnN0IG5ldHdvcmtCYWxhbmNlID0gZ2V0TmV0d29ya1ZhbHVlKGZhdm9yaXRlTmV0d29yayk7XG5cbiAgICAgICAgICAvLyBzaG93IGxvYWRpbmcgc2tlbGV0b24gZm9yIGVhY2ggdGlsZSB0aWxsIHdlIGhhdmUgdGhlIGJhbGFuY2UgZm9yIHRoZW1cbiAgICAgICAgICByZXR1cm4gIW5ldHdvcmtCYWxhbmNlcyA/IChcbiAgICAgICAgICAgIDxTa2VsZXRvblxuICAgICAgICAgICAgICBrZXk9e2Zhdm9yaXRlTmV0d29yay5jaGFpbklkfVxuICAgICAgICAgICAgICB2YXJpYW50PVwicm91bmRlZFwiXG4gICAgICAgICAgICAgIHN4PXt7IGhlaWdodDogODksIHdpZHRoOiAxNjQsIG1iOiAyIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8TmV0d29ya0NhcmRcbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BuZXR3b3JrLWNhcmQtJHtmYXZvcml0ZU5ldHdvcmsuY2hhaW5JZH0tYnV0dG9uYH1cbiAgICAgICAgICAgICAga2V5PXtmYXZvcml0ZU5ldHdvcmsuY2hhaW5JZH1cbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogJzE2NHB4JyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgICAgICBtYjogMixcbiAgICAgICAgICAgICAgICBwOiAyLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FwdHVyZSgnUG9ydGZvbGlvU2Vjb25kYXJ5TmV0d29ya0NsaWNrZWQnLCB7XG4gICAgICAgICAgICAgICAgICBjaGFpbklkOiBmYXZvcml0ZU5ldHdvcmsuY2hhaW5JZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzZXROZXR3b3JrKGZhdm9yaXRlTmV0d29yayk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIlxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM9XCJmbGV4LXN0YXJ0XCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxMb2dvQ29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgPEJhZGdlXG4gICAgICAgICAgICAgICAgICAgIGJhZGdlQ29udGVudD17YnJpZGdlVHJhbnNhY3Rpb25zLmxlbmd0aH1cbiAgICAgICAgICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8TmV0d29ya0xvZ29cbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjQwcHhcIlxuICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjQwcHhcIlxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc9XCI4cHhcIlxuICAgICAgICAgICAgICAgICAgICAgIHNyYz17ZmF2b3JpdGVOZXR3b3JrLmxvZ29Vcml9XG4gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFNpemU9ezQwfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9CYWRnZT5cbiAgICAgICAgICAgICAgICA8L0xvZ29Db250YWluZXI+XG4gICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICAgICAgICAgICAgICBzeD17eyB3aWR0aDogJzEwMCUnLCBtaW5IZWlnaHQ6ICc1MXB4JyB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGZvbnRXZWlnaHQ9XCJmb250V2VpZ2h0U2VtaWJvbGRcIj5cbiAgICAgICAgICAgICAgICAgICAge2Zhdm9yaXRlTmV0d29yay5jaGFpbk5hbWV9XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICB7IWlzQ3VzdG9tTmV0d29yayhmYXZvcml0ZU5ldHdvcmsuY2hhaW5JZCkgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtpc1Rva2Vuc0NhY2hlZCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17dCgnQmFsYW5jZXMgbG9hZGluZy4uLicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ9XCJib3R0b21cIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8QWxlcnRUcmlhbmdsZUljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPXsxMn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBjb2xvcjogJ3dhcm5pbmcubWFpbicsIG1yOiAxIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BuZXR3b3JrLWNhcmQtJHtmYXZvcml0ZU5ldHdvcmsuY2hhaW5JZH0tYmFsYW5jZWB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplPXsxNH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjE3cHhcIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtjdXJyZW5jeUZvcm1hdHRlcihuZXR3b3JrQmFsYW5jZSl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9OZXR3b3JrQ2FyZD5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgICAge25ldHdvcmtzLmxlbmd0aCAmJiAoXG4gICAgICAgICAgPFNlZUFsbE5ldHdvcmtzQnV0dG9uXG4gICAgICAgICAgICBpc0Z1bGxXaWR0aD17ZmF2b3JpdGVOZXR3b3Jrc1dpdGhvdXRBY3RpdmUubGVuZ3RoICUgMiA9PT0gMH1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9OZXR3b3JrTGlzdENvbnRhaW5lcj5cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgZ2V0VW5jb25maXJtZWRCYWxhbmNlSW5DdXJyZW5jeSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9iYWxhbmNlcy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlVG9rZW5zV2l0aEJhbGFuY2VzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VUb2tlbnNXaXRoQmFsYW5jZXMnO1xuXG5pbXBvcnQgeyBBY3RpdmVOZXR3b3JrV2lkZ2V0IH0gZnJvbSAnLi9BY3RpdmVOZXR3b3JrV2lkZ2V0JztcbmltcG9ydCB7IE5ldHdvcmtMaXN0IH0gZnJvbSAnLi9OZXR3b3JrTGlzdCc7XG5pbXBvcnQgeyBUb2tlbldpdGhCYWxhbmNlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuZXhwb3J0IGNvbnN0IHRva2Vuc1dpdGhCYWxhbmNlcyA9ICh0b2tlbkxpc3Q/OiBUb2tlbldpdGhCYWxhbmNlW10pID0+IHtcbiAgaWYgKCF0b2tlbkxpc3QpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gdG9rZW5MaXN0LmZpbHRlcigodG9rZW4pID0+IHRva2VuLmJhbGFuY2UgPiAwKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROZXR3b3JrQmFsYW5jZSA9IChhc3NldExpc3Q6IFRva2VuV2l0aEJhbGFuY2VbXSkgPT4ge1xuICBjb25zdCBzdW0gPSBhc3NldExpc3QucmVkdWNlKChwcmV2QXNzZXRVU0QsIGN1cnJlbnRBc3NldCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICBwcmV2QXNzZXRVU0QgK1xuICAgICAgKGdldFVuY29uZmlybWVkQmFsYW5jZUluQ3VycmVuY3koY3VycmVudEFzc2V0KSA/PyAwKSArXG4gICAgICAoY3VycmVudEFzc2V0LmJhbGFuY2VJbkN1cnJlbmN5ID8/IDApXG4gICAgKTtcbiAgfSwgMCk7XG4gIHJldHVybiBzdW07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0TmV0d29ya1Rva2Vuc1ByaWNlQ2hhbmdlcyA9IChhc3NldExpc3Q6IFRva2VuV2l0aEJhbGFuY2VbXSkgPT4ge1xuICBjb25zdCBjaGFuZ2VzID0gYXNzZXRMaXN0LnJlZHVjZShcbiAgICAoY2hhbmdlc1N1bTogeyB2YWx1ZTogbnVtYmVyOyBwZXJjZW50YWdlOiBudW1iZXJbXSB9LCBjdXJyZW50QXNzZXQpID0+IHtcbiAgICAgIGlmICghY3VycmVudEFzc2V0LnByaWNlQ2hhbmdlcykge1xuICAgICAgICByZXR1cm4gY2hhbmdlc1N1bTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgcGVyY2VudGFnZSwgdmFsdWUgfSA9IGN1cnJlbnRBc3NldC5wcmljZUNoYW5nZXM7XG4gICAgICBpZiAoIXBlcmNlbnRhZ2UpIHtcbiAgICAgICAgcmV0dXJuIGNoYW5nZXNTdW07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiBjaGFuZ2VzU3VtLnZhbHVlICsgKHZhbHVlIHx8IDApLFxuICAgICAgICBwZXJjZW50YWdlOiBbLi4uY2hhbmdlc1N1bS5wZXJjZW50YWdlLCBwZXJjZW50YWdlXSxcbiAgICAgIH07XG4gICAgfSxcbiAgICB7XG4gICAgICBwZXJjZW50YWdlOiBbXSxcbiAgICAgIHZhbHVlOiAwLFxuICAgIH0sXG4gICk7XG4gIHJldHVybiBjaGFuZ2VzO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIE5ldHdvcmtzV2lkZ2V0KCkge1xuICBjb25zdCBhY3RpdmVOZXR3b3JrQXNzZXRMaXN0ID0gdXNlVG9rZW5zV2l0aEJhbGFuY2VzKCk7XG5cbiAgY29uc3QgYWN0aXZlTmV0d29ya0JhbGFuY2UgPSBnZXROZXR3b3JrQmFsYW5jZShhY3RpdmVOZXR3b3JrQXNzZXRMaXN0KTtcbiAgY29uc3QgYWN0aXZlTmV0d29ya1ByaWNlQ2hhbmdlcyA9IGdldE5ldHdvcmtUb2tlbnNQcmljZUNoYW5nZXMoXG4gICAgYWN0aXZlTmV0d29ya0Fzc2V0TGlzdCxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBtOiAyIH19PlxuICAgICAgPEFjdGl2ZU5ldHdvcmtXaWRnZXRcbiAgICAgICAgYXNzZXRMaXN0PXthY3RpdmVOZXR3b3JrQXNzZXRMaXN0fVxuICAgICAgICBhY3RpdmVOZXR3b3JrQmFsYW5jZT17YWN0aXZlTmV0d29ya0JhbGFuY2V9XG4gICAgICAgIGFjdGl2ZU5ldHdvcmtQcmljZUNoYW5nZXM9e2FjdGl2ZU5ldHdvcmtQcmljZUNoYW5nZXN9XG4gICAgICAvPlxuICAgICAgPE5ldHdvcmtMaXN0IC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBCYWxhbmNlQ29sdW1uIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9CYWxhbmNlQ29sdW1uJztcbmltcG9ydCB7IFRva2VuV2l0aEJhbGFuY2VQVk0gfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgVG9rZW5Vbml0IH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuXG5pbnRlcmZhY2UgUGNoYWluQWN0aXZlTmV0d29ya1dpZGdldENvbnRlbnRQcm9wcyB7XG4gIGJhbGFuY2VzPzogVG9rZW5XaXRoQmFsYW5jZVBWTTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFBjaGFpbkFjdGl2ZU5ldHdvcmtXaWRnZXRDb250ZW50KHtcbiAgYmFsYW5jZXMsXG59OiBQY2hhaW5BY3RpdmVOZXR3b3JrV2lkZ2V0Q29udGVudFByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCB0eXBlRGlzcGxheU5hbWVzID0ge1xuICAgIGxvY2tlZFN0YWtlZDogdCgnTG9ja2VkIFN0YWtlZCcpLFxuICAgIGxvY2tlZFN0YWtlYWJsZTogdCgnTG9ja2VkIFN0YWtlYWJsZScpLFxuICAgIGxvY2tlZFBsYXRmb3JtOiB0KCdMb2NrZWQgUGxhdGZvcm0nKSxcbiAgICBhdG9taWNNZW1vcnlMb2NrZWQ6IHQoJ0F0b21pYyBNZW1vcnkgTG9ja2VkJyksXG4gICAgYXRvbWljTWVtb3J5VW5sb2NrZWQ6IHQoJ0F0b21pYyBNZW1vcnkgVW5sb2NrZWQnKSxcbiAgICB1bmxvY2tlZFVuc3Rha2VkOiB0KCdVbmxvY2tlZCBVbnN0YWtlZCcpLFxuICAgIHVubG9ja2VkU3Rha2VkOiB0KCdVbmxvY2tlZCBTdGFrZWQnKSxcbiAgICBwZW5kaW5nU3Rha2VkOiB0KCdQZW5kaW5nIFN0YWtlZCcpLFxuICB9O1xuXG4gIGlmICghYmFsYW5jZXM/LmJhbGFuY2VQZXJUeXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge09iamVjdC5lbnRyaWVzKGJhbGFuY2VzLmJhbGFuY2VQZXJUeXBlKS5tYXAoKFt0eXBlLCBiYWxhbmNlXSkgPT4ge1xuICAgICAgICBjb25zdCBzaG93ID0gYmFsYW5jZSA+IDA7XG5cbiAgICAgICAgaWYgKCFzaG93KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAga2V5PXtgcGNoYWluLWJhbGFuY2UtJHt0eXBlfWB9XG4gICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxuICAgICAgICAgICAgbWFyZ2luPVwiMCAtMTZweFwiXG4gICAgICAgICAgICBwYWRkaW5nPVwiNHB4IDE2cHhcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCI+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0b2tlbi1yb3ctbmFtZVwiXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgIHN4PXt7IG1sOiAxIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dHlwZURpc3BsYXlOYW1lc1t0eXBlXX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDxCYWxhbmNlQ29sdW1uIGNsYXNzTmFtZT1cImJhbGFuY2UtY29sdW1uXCI+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmFsYW5jZVwiXG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0b2tlbi1yb3ctdG9rZW4tYmFsYW5jZVwiXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge25ldyBUb2tlblVuaXQoXG4gICAgICAgICAgICAgICAgICBiYWxhbmNlLFxuICAgICAgICAgICAgICAgICAgYmFsYW5jZXMuZGVjaW1hbHMsXG4gICAgICAgICAgICAgICAgICBiYWxhbmNlcy5zeW1ib2wsXG4gICAgICAgICAgICAgICAgKS50b0Rpc3BsYXkoKX17JyAnfVxuICAgICAgICAgICAgICAgIEFWQVhcbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9CYWxhbmNlQ29sdW1uPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICk7XG4gICAgICB9KX1cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IE5ldHdvcmtDYXJkIH0gZnJvbSAnLi9jb21tb24vTmV0d29ya0NhcmQnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IEJ1dHRvbiwgU3RhY2ssIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyBOZXR3b3JrVGFiIH0gZnJvbSAnQHNyYy9wYWdlcy9OZXR3b3Jrcyc7XG5cbmludGVyZmFjZSBTZWVBbGxOZXR3b3Jrc0J1dHRvblByb3BzIHtcbiAgaXNGdWxsV2lkdGg6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWVBbGxOZXR3b3Jrc0J1dHRvbih7XG4gIGlzRnVsbFdpZHRoLFxufTogU2VlQWxsTmV0d29ya3NCdXR0b25Qcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG5cbiAgcmV0dXJuIGlzRnVsbFdpZHRoID8gKFxuICAgIDxCdXR0b25cbiAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICBkYXRhLXRlc3RpZD1cInNlZS1hbGwtbmV0d29ya3MtYnV0dG9uXCJcbiAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGhpc3RvcnkucHVzaChgL25ldHdvcmtzP2FjdGl2ZVRhYj0ke05ldHdvcmtUYWIuQWxsfWApO1xuICAgICAgfX1cbiAgICAgIGZ1bGxXaWR0aFxuICAgID5cbiAgICAgIHt0KCdWaWV3IEFsbCBOZXR3b3JrcycpfVxuICAgIDwvQnV0dG9uPlxuICApIDogKFxuICAgIDxOZXR3b3JrQ2FyZFxuICAgICAgZGF0YS10ZXN0aWQ9XCJzZWUtYWxsLW5ldHdvcmtzLWJ1dHRvblwiXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzE2NHB4JyxcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgIG1iOiAyLFxuICAgICAgICBwOiAyLFxuICAgICAgfX1cbiAgICAgIG9uQ2xpY2s9eygpID0+IGhpc3RvcnkucHVzaChgL25ldHdvcmtzP2FjdGl2ZVRhYj0ke05ldHdvcmtUYWIuQWxsfWApfVxuICAgID5cbiAgICAgIDxTdGFja1xuICAgICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICBzeD17eyBoZWlnaHQ6ICcxMDAlJyB9fVxuICAgICAgPlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBmb250V2VpZ2h0PVwiZm9udFdlaWdodFNlbWlib2xkXCI+XG4gICAgICAgICAge3QoJ1ZpZXcgQWxsIE5ldHdvcmtzJyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9OZXR3b3JrQ2FyZD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBCYWxhbmNlQ29sdW1uIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9CYWxhbmNlQ29sdW1uJztcbmltcG9ydCB7IFRva2VuV2l0aEJhbGFuY2VBVk0gfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgVG9rZW5Vbml0IH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuXG5pbnRlcmZhY2UgWGNoYWluQWN0aXZlTmV0d29ya1dpZGdldENvbnRlbnRQcm9wcyB7XG4gIGJhbGFuY2VzPzogVG9rZW5XaXRoQmFsYW5jZUFWTTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFhjaGFpbkFjdGl2ZU5ldHdvcmtXaWRnZXRDb250ZW50KHtcbiAgYmFsYW5jZXMsXG59OiBYY2hhaW5BY3RpdmVOZXR3b3JrV2lkZ2V0Q29udGVudFByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCB0eXBlRGlzcGxheU5hbWVzID0ge1xuICAgIGxvY2tlZDogdCgnTG9ja2VkJyksXG4gICAgdW5sb2NrZWQ6IHQoJ1VubG9ja2VkJyksXG4gICAgYXRvbWljTWVtb3J5TG9ja2VkOiB0KCdBdG9taWMgTWVtb3J5IExvY2tlZCcpLFxuICAgIGF0b21pY01lbW9yeVVubG9ja2VkOiB0KCdBdG9taWMgTWVtb3J5IFVubG9ja2VkJyksXG4gIH07XG5cbiAgaWYgKCFiYWxhbmNlcz8uYmFsYW5jZVBlclR5cGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtPYmplY3QuZW50cmllcyhiYWxhbmNlcy5iYWxhbmNlUGVyVHlwZSkubWFwKChbdHlwZSwgYmFsYW5jZVJhd10pID0+IHtcbiAgICAgICAgaWYgKCFiYWxhbmNlUmF3KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiYWxhbmNlID0gbmV3IFRva2VuVW5pdChcbiAgICAgICAgICBiYWxhbmNlUmF3LFxuICAgICAgICAgIGJhbGFuY2VzLmRlY2ltYWxzLFxuICAgICAgICAgIGJhbGFuY2VzLnN5bWJvbCxcbiAgICAgICAgKS50b0Rpc3BsYXkoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAga2V5PXtgeGNoYWluLWJhbGFuY2UtJHt0eXBlfWB9XG4gICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxuICAgICAgICAgICAgbWFyZ2luPVwiMCAtMTZweFwiXG4gICAgICAgICAgICBwYWRkaW5nPVwiNHB4IDE2cHhcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCI+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0b2tlbi1yb3ctbmFtZVwiXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgIHN4PXt7IG1sOiAxIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dHlwZURpc3BsYXlOYW1lc1t0eXBlXX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDxCYWxhbmNlQ29sdW1uIGNsYXNzTmFtZT1cImJhbGFuY2UtY29sdW1uXCI+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmFsYW5jZVwiXG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0b2tlbi1yb3ctdG9rZW4tYmFsYW5jZVwiXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2Ake2JhbGFuY2V9IEFWQVhgfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L0JhbGFuY2VDb2x1bW4+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgKTtcbiAgICAgIH0pfVxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5cbmltcG9ydCB7IENoYWluSWQgfSBmcm9tICdAYXZhbGFicy9jb3JlLWNoYWlucy1zZGsnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQnV5SWNvbixcbiAgUVJDb2RlSWNvbixcbiAgU3RhY2ssXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBvcGVuTmV3VGFiIH0gZnJvbSAnQHNyYy91dGlscy9leHRlbnNpb25VdGlscyc7XG5pbXBvcnQgeyBnZXRDb3JlV2ViVXJsIH0gZnJvbSAnQHNyYy91dGlscy9nZXRDb3JlV2ViVXJsJztcblxuZXhwb3J0IGZ1bmN0aW9uIFplcm9XaWRnZXQoKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuXG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG5cbiAgaWYgKG5ldHdvcms/LmNoYWluSWQgPT09IENoYWluSWQuQVZBTEFOQ0hFX01BSU5ORVRfSUQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgbXQ6IDIsXG4gICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBvcGVuTmV3VGFiKHsgdXJsOiBgJHtnZXRDb3JlV2ViVXJsKCl9L2J1eWAgfSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxCdXlJY29uIHNpemU9ezE2fSBzeD17eyBtcjogMSB9fSAvPlxuICAgICAgICAgIHt0KCdCdXknKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBoaXN0b3J5LnB1c2goJy9yZWNlaXZlJyk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxRUkNvZGVJY29uIHNpemU9ezE2fSBzeD17eyBtcjogMSB9fSAvPlxuICAgICAgICAgIHt0KCdSZWNlaXZlJyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IG10OiAyLCBmbGV4RGlyZWN0aW9uOiAncm93JyB9fT5cbiAgICAgIDxCdXR0b25cbiAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGhpc3RvcnkucHVzaCgnL3JlY2VpdmUnKTtcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFFSQ29kZUljb24gc2l6ZT17MTZ9IHN4PXt7IG1yOiAxIH19IC8+XG4gICAgICAgIHt0KCdSZWNlaXZlJyl9XG4gICAgICA8L0J1dHRvbj5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgQ2FyZCwgc3R5bGVkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IE5ldHdvcmtDYXJkID0gc3R5bGVkKENhcmQpYFxuICBwYWRkaW5nOiAxNnB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICAmOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IGAke3RoZW1lLnBhbGV0dGUuZ3JleVs4MDBdfWIzYH07XG4gIH1cbmA7XG4iLCJpbXBvcnQgeyBOZXR3b3JrLCBOZXR3b3JrVk1UeXBlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQml0Y29pbihuZXR3b3JrPzogTmV0d29yaykge1xuICByZXR1cm4gbmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkJJVENPSU47XG59XG4iLCJpbXBvcnQgeyBiblRvQmlnIH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IHR5cGUgQmlnIGZyb20gJ2JpZy5qcyc7XG5pbXBvcnQgeyBpc0JOIH0gZnJvbSAnYm4uanMnO1xuaW1wb3J0IHR5cGUgQk4gZnJvbSAnYm4uanMnO1xuXG5pbXBvcnQgeyBiaWdpbnRUb0JpZyB9IGZyb20gJy4vYmlnaW50VG9CaWcnO1xuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQmFsYW5jZShcbiAgYmFsYW5jZTogQk4gfCBCaWcgfCBiaWdpbnQgfCB1bmRlZmluZWQsXG4gIGRlY2ltYWxzOiBudW1iZXIsXG4pOiBCaWcgfCB1bmRlZmluZWQge1xuICBpZiAoaXNCTihiYWxhbmNlKSkge1xuICAgIHJldHVybiBiblRvQmlnKGJhbGFuY2UsIGRlY2ltYWxzKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYmFsYW5jZSA9PT0gJ2JpZ2ludCcpIHtcbiAgICByZXR1cm4gYmlnaW50VG9CaWcoYmFsYW5jZSwgZGVjaW1hbHMpO1xuICB9XG5cbiAgcmV0dXJuIGJhbGFuY2U7XG59XG4iXSwibmFtZXMiOlsiaXNUb2tlbldpdGhCYWxhbmNlQVZNIiwiYmFsYW5jZSIsImJhbGFuY2VQZXJUeXBlIiwiaXNUb2tlbldpdGhCYWxhbmNlUFZNIiwiU3RhY2siLCJzdHlsZWQiLCJCYWxhbmNlQ29sdW1uIiwiVG9rZW5FbGxpcHNpcyIsIklubGluZVRva2VuRWxsaXBzaXMiLCJHbG9iZUljb24iLCJpcGZzUmVzb2x2ZXJXaXRoRmFsbGJhY2siLCJHbG9iZUljb25Db250YWluZXIiLCJoZWlnaHQiLCJwb3NpdGlvbiIsIm1hcmdpbiIsIk5ldHdvcmtMb2dvSW1hZ2UiLCJOZXR3b3JrTG9nb0syIiwic3JjIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiRnJhZ21lbnQiLCJzaXplIiwic3giLCJwIiwiVG9vbHRpcCIsInRydW5jYXRlQWRkcmVzcyIsImlzVHJ1bmNhdGVkIiwibWF4TGVuZ3RoIiwidGV4dCIsImxlbmd0aCIsImNsYXNzTmFtZSIsIm5hbWUiLCJwbGFjZW1lbnQiLCJ0aXRsZSIsImRpc2FibGVIb3Zlckxpc3RlbmVyIiwiZGlzYWJsZUZvY3VzTGlzdGVuZXIiLCJjdXJzb3IiLCJpc0JpdGNvaW5DaGFpbklkIiwidXNlQWNjb3VudHNDb250ZXh0IiwidXNlQmFsYW5jZXNDb250ZXh0IiwidXNlTmV0d29ya0NvbnRleHQiLCJ1c2VTZXR0aW5nc0NvbnRleHQiLCJ1c2VDYWxsYmFjayIsInVzZU1lbW8iLCJ1c2VUb2tlblByaWNlTWlzc2luZyIsImJhbGFuY2VzIiwiaXNUb2tlbnNDYWNoZWQiLCJhY2NvdW50cyIsImFjdGl2ZSIsImFjdGl2ZUFjY291bnQiLCJuZXR3b3JrIiwiYWN0aXZlTmV0d29yayIsImZhdm9yaXRlTmV0d29ya3MiLCJnZXRUb2tlblZpc2liaWxpdHkiLCJuZXR3b3Jrc01pc3NpbmdQcmljZSIsIm5ldHdvcmtJZHMiLCJPYmplY3QiLCJrZXlzIiwidG9rZW5zIiwibmV0d29ya3NJc01pc3NpbmdQcmljZXMiLCJmb3JFYWNoIiwibmV0d29ya0lkIiwidG9rZW5zRm9yTmV0d29yayIsImFkZHJlc3NUb0NoZWNrIiwiTnVtYmVyIiwiYWRkcmVzc0JUQyIsImFkZHJlc3NDIiwidG9rZW5zRm9yQWN0aXZlQWNjb3VudCIsImlzTWlzc2luZ1ByaWNlcyIsInZhbHVlcyIsImZpbHRlciIsInNvbWUiLCJ0b2tlbiIsInByaWNlSW5DdXJyZW5jeSIsInVuZGVmaW5lZCIsImZhdm9yaXRlTmV0d29ya3NNaXNzaW5nUHJpY2UiLCJjaGFpbklkIiwiYWN0aXZlTmV0d29ya01pc3NpbmdQcmljZSIsImlzUHJpY2VNaXNzaW5nRnJvbU5ldHdvcmsiLCJBc3NldGxpc3QiLCJOZXR3b3JrQ2FyZCIsInVzZUhpc3RvcnkiLCJaZXJvV2lkZ2V0IiwiVHJhbnMiLCJ1c2VUcmFuc2xhdGlvbiIsIkJyaWRnZUljb24iLCJCdXR0b24iLCJDaGlwIiwiRGl2aWRlciIsIlNrZWxldG9uIiwiVHlwb2dyYXBoeSIsIkFsZXJ0VHJpYW5nbGVJY29uIiwiQmFkZ2UiLCJDaGVja0ljb24iLCJUb2tlbkljb24iLCJpc0JpdGNvaW4iLCJ1c2VBbmFseXRpY3NDb250ZXh0IiwidXNlUGVuZGluZ0JyaWRnZVRyYW5zYWN0aW9ucyIsImlzQml0Y29pbk5ldHdvcmsiLCJpc1BjaGFpbk5ldHdvcmsiLCJQY2hhaW5BY3RpdmVOZXR3b3JrV2lkZ2V0Q29udGVudCIsIlBBbmRMIiwiaXNYY2hhaW5OZXR3b3JrIiwiWGNoYWluQWN0aXZlTmV0d29ya1dpZGdldENvbnRlbnQiLCJub3JtYWxpemVCYWxhbmNlIiwiQmlnIiwiQWN0aXZlTmV0d29ya1dpZGdldCIsImFzc2V0TGlzdCIsImFjdGl2ZU5ldHdvcmtCYWxhbmNlIiwiYWN0aXZlTmV0d29ya1ByaWNlQ2hhbmdlcyIsInQiLCJoaXN0b3J5IiwiaXNDdXN0b21OZXR3b3JrIiwiY3VycmVuY3lGb3JtYXR0ZXIiLCJjYXB0dXJlIiwiYnJpZGdlVHJhbnNhY3Rpb25zIiwiY2hhbmdlUGVyY2VudGFnZSIsInZhbHVlIiwidmFyaWFudCIsIndpZHRoIiwiaGFuZGxlQ2FyZENsaWNrIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInB1c2giLCJmaXJzdEFzc2V0IiwiZnVuZHMiLCJkZWNpbWFscyIsImhhc05vRnVuZHMiLCJlcSIsInNlbGVjdGVkQXNzZXRMaXN0IiwiZGlzcGxheSIsIm9uQ2xpY2siLCJyb3dHYXAiLCJkaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsImJhZGdlQ29udGVudCIsImkxOG5LZXkiLCJjb2xvciIsImxvZ29VcmkiLCJjaGFpbk5hbWUiLCJsYWJlbCIsImljb24iLCJmbGV4RGlyZWN0aW9uIiwiYWxpZ25JdGVtcyIsInRleHRBbGlnbiIsIm1yIiwicGVyY2VudGFnZSIsIm15IiwiZnVsbFdpZHRoIiwibXQiLCJ1c2VTZXRTZW5kRGF0YUluUGFyYW1zIiwiVG9rZW5Vbml0IiwiQ2hldnJvblJpZ2h0SWNvbiIsImtleWZyYW1lcyIsImhhc1VuY29uZmlybWVkQmFsYW5jZSIsIlRva2VuVHlwZSIsImdldFVuY29uZmlybWVkQmFsYW5jZUluQ3VycmVuY3kiLCJTaG93QW5pbWF0aW9uIiwiSGlkZUFuaW1hdGlvbiIsIkFzc2V0bGlzdFJvdyIsInRoZW1lIiwicGFsZXR0ZSIsImNvbW1vbiIsIndoaXRlIiwibWF4QXNzZXRDb3VudCIsInNldFNlbmREYXRhSW5QYXJhbXMiLCJmaWx0ZXJlZEFzc2V0TGlzdCIsImFzc2V0Iiwic29ydCIsImEiLCJiIiwiYmFsYW5jZUluQ3VycmVuY3kiLCJyZXN0QXNzZXRDb3VudCIsInNsaWNlIiwibWFwIiwidG90YWxCYWxhbmNlIiwidW5jb25maXJtZWRCYWxhbmNlIiwic3ltYm9sIiwidG9Mb3dlckNhc2UiLCJwYWRkaW5nIiwia2V5IiwidHlwZSIsIk5BVElWRSIsImFkZHJlc3MiLCJzZWxlY3RlZFRva2VuIiwiRVJDMjAiLCJvcHRpb25zIiwicGF0aCIsIm1sIiwidG9EaXNwbGF5IiwiZm9udFdlaWdodCIsInByaWNlQ2hhbmdlcyIsImFsaWduQ29udGVudCIsImNvbHVtbkdhcCIsImdldE5ldHdvcmtCYWxhbmNlIiwidG9rZW5zV2l0aEJhbGFuY2VzIiwiTmV0d29ya0xvZ28iLCJTZWVBbGxOZXR3b3Jrc0J1dHRvbiIsInVzZUJyaWRnZUNvbnRleHQiLCJmaWx0ZXJCcmlkZ2VTdGF0ZVRvTmV0d29yayIsInVzZVVuaWZpZWRCcmlkZ2VDb250ZXh0IiwiY2FpcFRvQ2hhaW5JZCIsImdldEFkZHJlc3NGb3JDaGFpbiIsIkxvZ29Db250YWluZXIiLCJOZXR3b3JrTGlzdENvbnRhaW5lciIsIk5ldHdvcmtMaXN0IiwibmV0d29ya3MiLCJzZXROZXR3b3JrIiwiYnJpZGdlU3RhdGUiLCJzdGF0ZSIsInBlbmRpbmdUcmFuc2ZlcnMiLCJ1bmlmaWVkQnJpZGdlVHhzIiwiZ2V0TmV0d29ya1ZhbHVlIiwibG9va3VwTmV0d29yayIsIm5ldHdvcmtBZGRyZXNzIiwibmV0d29ya0JhbGFuY2VzIiwibmV0d29ya0Fzc2V0TGlzdCIsImZhdm9yaXRlTmV0d29ya3NXaXRob3V0QWN0aXZlIiwibmV0d29ya0l0ZW0iLCJuZXR3b3JrQmFsYW5jZUZvckEiLCJuZXR3b3JrQmFsYW5jZUZvckIiLCJtYiIsImZhdm9yaXRlTmV0d29yayIsImxlZ2FjeUJyaWRnZVR4cyIsImZpbHRlcmVkVW5pZmllZEJyaWRnZVR4cyIsInNvdXJjZUNoYWluIiwidGFyZ2V0Q2hhaW4iLCJuZXR3b3JrQmFsYW5jZSIsImRlZmF1bHRTaXplIiwibWluSGVpZ2h0IiwiaXNGdWxsV2lkdGgiLCJ1c2VUb2tlbnNXaXRoQmFsYW5jZXMiLCJ0b2tlbkxpc3QiLCJzdW0iLCJyZWR1Y2UiLCJwcmV2QXNzZXRVU0QiLCJjdXJyZW50QXNzZXQiLCJnZXROZXR3b3JrVG9rZW5zUHJpY2VDaGFuZ2VzIiwiY2hhbmdlcyIsImNoYW5nZXNTdW0iLCJOZXR3b3Jrc1dpZGdldCIsImFjdGl2ZU5ldHdvcmtBc3NldExpc3QiLCJtIiwidHlwZURpc3BsYXlOYW1lcyIsImxvY2tlZFN0YWtlZCIsImxvY2tlZFN0YWtlYWJsZSIsImxvY2tlZFBsYXRmb3JtIiwiYXRvbWljTWVtb3J5TG9ja2VkIiwiYXRvbWljTWVtb3J5VW5sb2NrZWQiLCJ1bmxvY2tlZFVuc3Rha2VkIiwidW5sb2NrZWRTdGFrZWQiLCJwZW5kaW5nU3Rha2VkIiwiZW50cmllcyIsInNob3ciLCJOZXR3b3JrVGFiIiwiQWxsIiwibG9ja2VkIiwidW5sb2NrZWQiLCJiYWxhbmNlUmF3IiwiQ2hhaW5JZCIsIkJ1eUljb24iLCJRUkNvZGVJY29uIiwib3Blbk5ld1RhYiIsImdldENvcmVXZWJVcmwiLCJBVkFMQU5DSEVfTUFJTk5FVF9JRCIsImdhcCIsInVybCIsIkNhcmQiLCJncmV5IiwiTmV0d29ya1ZNVHlwZSIsInZtTmFtZSIsIkJJVENPSU4iLCJiblRvQmlnIiwiaXNCTiIsImJpZ2ludFRvQmlnIl0sInNvdXJjZVJvb3QiOiIifQ==