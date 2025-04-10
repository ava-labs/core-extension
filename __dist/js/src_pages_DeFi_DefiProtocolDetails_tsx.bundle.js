"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_DeFi_DefiProtocolDetails_tsx"],{

/***/ "./src/components/common/FunctionIsOffline.tsx":
/*!*****************************************************!*\
  !*** ./src/components/common/FunctionIsOffline.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/pages/DeFi/DefiProtocolDetails.tsx":
/*!************************************************!*\
  !*** ./src/pages/DeFi/DefiProtocolDetails.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiProtocolDetails": () => (/* binding */ DefiProtocolDetails)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_extensionUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/extensionUtils */ "./src/utils/extensionUtils.ts");
/* harmony import */ var _src_contexts_DefiProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/DefiProvider */ "./src/contexts/DefiProvider.tsx");
/* harmony import */ var _src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _components_DefiErrorState__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/DefiErrorState */ "./src/pages/DeFi/components/DefiErrorState.tsx");
/* harmony import */ var _components_DefiPortfolioItemGroup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/DefiPortfolioItemGroup */ "./src/pages/DeFi/components/DefiPortfolioItemGroup.tsx");
/* harmony import */ var _components_DefiProtocolDetailsHeader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/DefiProtocolDetailsHeader */ "./src/pages/DeFi/components/DefiProtocolDetailsHeader.tsx");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");














function DefiProtocolDetails() {
  const {
    protocolId
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_11__.useParams)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_12__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_11__.useHistory)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_4__.useFeatureFlagContext)();
  const {
    hasError,
    isLoading,
    portfolio,
    refresh
  } = (0,_src_contexts_DefiProvider__WEBPACK_IMPORTED_MODULE_2__.useDefiContext)();
  const protocol = portfolio?.protocols?.find(p => p.id === protocolId) ?? null;
  const goToProtocolPage = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (protocol?.siteUrl) {
      (0,_src_utils_extensionUtils__WEBPACK_IMPORTED_MODULE_1__.openNewTab)({
        url: protocol?.siteUrl
      });
    }
  }, [protocol]);

  // Refresh possibly-stale data upon component render
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(refresh, [refresh]);
  if (!featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_9__.FeatureGates.DEFI]) {
    return /*#__PURE__*/React.createElement(_src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_3__.FunctionIsOffline, {
      hidePageTitle: true,
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_10__.FunctionNames.DEFI
    });
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      pt: 1,
      pb: 2,
      px: 2,
      flexGrow: 1,
      width: '100%',
      alignItems: 'center'
    }
  }, isLoading && !protocol && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.CircularProgress, {
    sx: {
      mt: 9
    },
    size: 100
  }), hasError && /*#__PURE__*/React.createElement(_components_DefiErrorState__WEBPACK_IMPORTED_MODULE_6__.DefiErrorState, null), protocol && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_5__.PageTitle, {
    variant: _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_5__.PageTitleVariant.SECONDARY,
    margin: "8px 0 8px -24px"
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Card, {
    sx: {
      width: 1,
      overflow: 'initial',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.CardContent, {
    sx: {
      px: 2,
      py: 0,
      height: '100%',
      ':last-child': {
        pb: 0
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_components_DefiProtocolDetailsHeader__WEBPACK_IMPORTED_MODULE_8__.DefiProtocolDetailsHeader, {
    protocol: protocol
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Divider, {
    sx: {
      my: 1
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Scrollbars, null, protocol.groups.length === 0 ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      mt: 5,
      gap: 1,
      alignItems: 'center'
    },
    "data-testid": "defi-protocol-emptied-state"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t('No Transactions Found')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    variant: "text",
    size: "small",
    onClick: () => history.replace('/home?activeTab=DEFI'),
    sx: {
      mt: 1
    }
  }, t('Go Back to DeFi Portfolio'))) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      gap: 1
    },
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Divider, null),
    "data-testid": "defi-protocol-groups"
  }, protocol.groups.map(group => /*#__PURE__*/React.createElement(_components_DefiPortfolioItemGroup__WEBPACK_IMPORTED_MODULE_7__.DefiPortfolioItemGroup, {
    key: group.name,
    group: group
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Box, {
    sx: {
      width: 1,
      height: 40
    }
  }), ' ')))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: 1,
      flexShrink: 0,
      pt: 2,
      pb: 1,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    fullWidth: true,
    size: "large",
    onClick: goToProtocolPage,
    startIcon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.ExternalLinkIcon, {
      size: 16
    }),
    "data-testid": "defi-protocol-dapp-button"
  }, t('Go to {{protocolName}}', {
    protocolName: protocol.name
  })))));
}

/***/ }),

/***/ "./src/pages/DeFi/components/DefiErrorState.tsx":
/*!******************************************************!*\
  !*** ./src/pages/DeFi/components/DefiErrorState.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiErrorState": () => (/* binding */ DefiErrorState)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const DefiErrorState = props => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    sx: {
      mt: 9,
      gap: 1,
      alignItems: 'center'
    }
  }, props), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AlertCircleIcon, {
    size: 60,
    sx: {
      mb: 2
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, t('Error!')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t('Data currently unavailable, check back later.')));
};

/***/ }),

/***/ "./src/pages/DeFi/components/DefiPortfolioCommon.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/DeFi/components/DefiPortfolioCommon.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiPortfolioCommon": () => (/* binding */ DefiPortfolioCommon)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_sumByProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/utils/sumByProperty */ "./src/utils/sumByProperty.ts");
/* harmony import */ var _hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hooks/useConvertedCurrencyFormatter */ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts");
/* harmony import */ var _DefiTokenAvatarGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefiTokenAvatarGroup */ "./src/pages/DeFi/components/DefiTokenAvatarGroup.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






const DefiPortfolioCommon = ({
  items,
  header
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const formatValue = (0,_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_1__.useConvertedCurrencyFormatter)();
  const mostTokensInAnItem = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => Math.max(...items.map(item => item.supplyTokens?.length ?? 0)), [items]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      gap: 1.25
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    sx: {
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "button"
  }, header), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "button"
  }, t('Value'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      gap: 2
    }
  }, items.map(({
    supplyTokens = [],
    rewardTokens = []
  }, index) => {
    const hasRewards = rewardTokens.length > 0;
    const suppliedValue = formatValue((0,_src_utils_sumByProperty__WEBPACK_IMPORTED_MODULE_0__.sumByProperty)(supplyTokens, 'usdValue'));
    const rewardedValue = formatValue((0,_src_utils_sumByProperty__WEBPACK_IMPORTED_MODULE_0__.sumByProperty)(rewardTokens, 'usdValue'));
    const symbols = supplyTokens.map(({
      symbol
    }) => symbol).join(' + ');
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      key: `defi-common-${index}`,
      direction: "row",
      sx: {
        gap: 1,
        justifyContent: 'space-between'
      },
      "data-testid": "defi-item"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      direction: "row",
      sx: {
        gap: 1,
        width: 1,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(_DefiTokenAvatarGroup__WEBPACK_IMPORTED_MODULE_2__.DefiTokenAvatarGroup, {
      tokens: supplyTokens,
      maxTokens: mostTokensInAnItem
    }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      sx: {
        gap: 0.5,
        flexGrow: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      direction: "row",
      sx: {
        justifyContent: 'space-between',
        gap: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      title: symbols,
      variant: "caption",
      noWrap: true,
      "data-testid": "defi-item-token-list"
    }, symbols), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "caption",
      "data-testid": "defi-item-value"
    }, suppliedValue)), hasRewards && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      direction: "row",
      sx: {
        justifyContent: 'space-between',
        gap: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "caption",
      color: "text.secondary"
    }, t('Rewards')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "caption",
      color: "text.secondary",
      "data-testid": "defi-item-rewards-value"
    }, rewardedValue)))));
  })));
};

/***/ }),

/***/ "./src/pages/DeFi/components/DefiPortfolioInsurance.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/DeFi/components/DefiPortfolioInsurance.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiPortfolioInsurance": () => (/* binding */ DefiPortfolioInsurance)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hooks/useConvertedCurrencyFormatter */ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const DefiPortfolioInsurance = ({
  items
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const formatValue = (0,_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_0__.useConvertedCurrencyFormatter)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 1.25
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    direction: "row",
    sx: {
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "button"
  }, t('Description')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "button"
  }, t('Value'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 2
    }
  }, items.map(({
    description,
    netUsdValue
  }, index) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    key: `defi-insurance-${index}`,
    direction: "row",
    sx: {
      gap: 2,
      justifyContent: 'space-between'
    },
    "data-testid": "defi-item"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    title: description,
    wrapWithSpan: false
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    "data-testid": "defi-item-description",
    sx: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, description)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 0.5,
      textAlign: 'end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    "data-testid": "defi-item-value"
  }, formatValue(netUsdValue)))))));
};

/***/ }),

/***/ "./src/pages/DeFi/components/DefiPortfolioItemGroup.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/DeFi/components/DefiPortfolioItemGroup.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiPortfolioItemGroup": () => (/* binding */ DefiPortfolioItemGroup)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_defi_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/defi/models */ "./src/background/services/defi/models.ts");
/* harmony import */ var _DefiPortfolioLending__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefiPortfolioLending */ "./src/pages/DeFi/components/DefiPortfolioLending.tsx");
/* harmony import */ var _DefiPortfolioCommon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DefiPortfolioCommon */ "./src/pages/DeFi/components/DefiPortfolioCommon.tsx");
/* harmony import */ var _DefiPortfolioRewards__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DefiPortfolioRewards */ "./src/pages/DeFi/components/DefiPortfolioRewards.tsx");
/* harmony import */ var _DefiPortfolioVesting__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DefiPortfolioVesting */ "./src/pages/DeFi/components/DefiPortfolioVesting.tsx");
/* harmony import */ var _DefiPortfolioInsurance__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DefiPortfolioInsurance */ "./src/pages/DeFi/components/DefiPortfolioInsurance.tsx");
/* harmony import */ var _DefiPortfolioPerpetual__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DefiPortfolioPerpetual */ "./src/pages/DeFi/components/DefiPortfolioPerpetual.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










const DefiPortfolioItemGroup = ({
  group
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_8__.useTranslation)();
  const header = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => group.name === 'Rewards' ? t('Pool') : t('Supplied'), [group.name, t]);
  const itemsByType = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => group.items.reduce((grouped, item) => {
    if (!grouped[item.type]) {
      grouped[item.type] = [item];
    } else {
      grouped[item.type].push(item);
    }
    return grouped;
  }, {}), [group]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      gap: 2
    },
    "data-testid": "defi-protocol-group"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      pt: 1,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "h6",
    "data-testid": "defi-protocol-group-name"
  }, t(group.name))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      gap: 2,
      pb: 2
    }
  }, Object.entries(itemsByType).map(([type, items]) => {
    const key = `defi-group-${type}`;
    switch (type) {
      case _src_background_services_defi_models__WEBPACK_IMPORTED_MODULE_1__.DefiItemType.Lending:
        return /*#__PURE__*/React.createElement(_DefiPortfolioLending__WEBPACK_IMPORTED_MODULE_2__.DefiPortfolioLending, {
          key: key,
          items: items
        });
      case _src_background_services_defi_models__WEBPACK_IMPORTED_MODULE_1__.DefiItemType.Reward:
        return /*#__PURE__*/React.createElement(_DefiPortfolioRewards__WEBPACK_IMPORTED_MODULE_4__.DefiPortfolioRewards, {
          key: key,
          items: items
        });
      case _src_background_services_defi_models__WEBPACK_IMPORTED_MODULE_1__.DefiItemType.Vesting:
        return /*#__PURE__*/React.createElement(_DefiPortfolioVesting__WEBPACK_IMPORTED_MODULE_5__.DefiPortfolioVesting, {
          key: key,
          items: items
        });
      case _src_background_services_defi_models__WEBPACK_IMPORTED_MODULE_1__.DefiItemType.InsuranceBuyer:
        return /*#__PURE__*/React.createElement(_DefiPortfolioInsurance__WEBPACK_IMPORTED_MODULE_6__.DefiPortfolioInsurance, {
          key: key,
          items: items
        });
      case _src_background_services_defi_models__WEBPACK_IMPORTED_MODULE_1__.DefiItemType.Perpetual:
        return /*#__PURE__*/React.createElement(_DefiPortfolioPerpetual__WEBPACK_IMPORTED_MODULE_7__.DefiPortfolioPerpetual, {
          key: key,
          items: items
        });
      default:
        return /*#__PURE__*/React.createElement(_DefiPortfolioCommon__WEBPACK_IMPORTED_MODULE_3__.DefiPortfolioCommon, {
          key: key,
          header: header,
          items: items
        });
    }
  })));
};

/***/ }),

/***/ "./src/pages/DeFi/components/DefiPortfolioLending.tsx":
/*!************************************************************!*\
  !*** ./src/pages/DeFi/components/DefiPortfolioLending.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiPortfolioLending": () => (/* binding */ DefiPortfolioLending)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hooks/useConvertedCurrencyFormatter */ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const DefiPortfolioLending = ({
  items
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 3
    }
  }, items.map(({
    supplyTokens,
    borrowTokens,
    rewardTokens
  }, index) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    key: `defi-lending-${index}`,
    sx: {
      gap: 2
    }
  }, supplyTokens.length > 0 && /*#__PURE__*/React.createElement(DefiLendingSection, {
    tokens: supplyTokens,
    headers: [t('Supplied'), t('Value')]
  }), borrowTokens.length > 0 && /*#__PURE__*/React.createElement(DefiLendingSection, {
    tokens: borrowTokens,
    headers: [t('Borrowed')]
  }), rewardTokens.length > 0 && /*#__PURE__*/React.createElement(DefiLendingSection, {
    tokens: rewardTokens,
    headers: [t('Rewards')]
  }))));
};
const DefiLendingSection = ({
  headers,
  tokens
}) => {
  const formatValue = (0,_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_0__.useConvertedCurrencyFormatter)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 1.25
    },
    "data-testid": "defi-lending-section"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    direction: "row",
    sx: {
      justifyContent: 'space-between'
    }
  }, headers.map(header => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    key: header,
    variant: "button"
  }, header))), tokens.map(token => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    key: token.symbol,
    direction: "row",
    sx: {
      gap: 1,
      justifyContent: 'space-between'
    },
    "data-testid": "defi-item"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    direction: "row",
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Avatar, {
    key: token.symbol,
    src: token.logoUrl,
    alt: token.name,
    sx: {
      width: 16,
      height: 16
    },
    "data-testid": "defi-item-token-avatar"
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    "data-testid": "defi-item-token-list"
  }, token.symbol)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    "data-testid": "defi-item-value"
  }, formatValue(token.usdValue)))));
};

/***/ }),

/***/ "./src/pages/DeFi/components/DefiPortfolioPerpetual.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/DeFi/components/DefiPortfolioPerpetual.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiPortfolioPerpetual": () => (/* binding */ DefiPortfolioPerpetual)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hooks/useConvertedCurrencyFormatter */ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts");
/* harmony import */ var _DefiTokenAvatarGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefiTokenAvatarGroup */ "./src/pages/DeFi/components/DefiTokenAvatarGroup.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const GridCell = ({
  sx,
  ...props
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Grid, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
  item: true,
  sx: [{
    display: 'inline-flex',
    alignItems: 'center'
  }, ...(Array.isArray(sx) ? sx : [sx])]
}, props));
const DefiPortfolioPerpetual = ({
  items
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const formatValue = (0,_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_1__.useConvertedCurrencyFormatter)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      gap: 1.25
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Grid, {
    container: true,
    spacing: 1
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Grid, {
    container: true,
    item: true,
    spacing: 1
  }, /*#__PURE__*/React.createElement(GridCell, {
    xs: 5
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "button"
  }, t('Token Pair'))), /*#__PURE__*/React.createElement(GridCell, {
    xs: 3
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "button"
  }, t('PnL'))), /*#__PURE__*/React.createElement(GridCell, {
    xs: 4,
    sx: {
      justifyContent: 'end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "button"
  }, t('Value')))), items.map(({
    marginToken,
    positionToken,
    profitUsdValue,
    netUsdValue
  }, index) => {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Grid, {
      container: true,
      item: true,
      spacing: 1,
      key: `defi-perpetual-${index}`,
      "data-testid": "defi-item",
      sx: {
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(GridCell, {
      xs: 5,
      sx: {
        gap: 0.5
      }
    }, /*#__PURE__*/React.createElement(_DefiTokenAvatarGroup__WEBPACK_IMPORTED_MODULE_2__.DefiTokenAvatarGroup, {
      tokens: [positionToken, marginToken],
      maxTokens: 2
    }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
      variant: "caption",
      "data-testid": "defi-item-token-pair"
    }, positionToken.symbol, "/", marginToken.symbol)), /*#__PURE__*/React.createElement(GridCell, {
      xs: 3
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
      variant: "caption"
    }, formatValue(profitUsdValue))), /*#__PURE__*/React.createElement(GridCell, {
      xs: 4,
      sx: {
        justifyContent: 'end'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
      variant: "caption",
      "data-testid": "defi-item-value"
    }, formatValue(netUsdValue))));
  })));
};

/***/ }),

/***/ "./src/pages/DeFi/components/DefiPortfolioRewards.tsx":
/*!************************************************************!*\
  !*** ./src/pages/DeFi/components/DefiPortfolioRewards.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiPortfolioRewards": () => (/* binding */ DefiPortfolioRewards)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _DefiTokenAvatarGroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DefiTokenAvatarGroup */ "./src/pages/DeFi/components/DefiTokenAvatarGroup.tsx");
/* harmony import */ var _hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useConvertedCurrencyFormatter */ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const DefiPortfolioRewards = ({
  items
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const formatValue = (0,_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_2__.useConvertedCurrencyFormatter)();
  const mostTokensInAnItem = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => items.reduce((max, item) => {
    return Math.max(max, item.tokens.length ?? 0);
  }, 0), [items]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      gap: 1.25
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    direction: "row",
    sx: {
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "button"
  }, t('Pool')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "button"
  }, t('Value'))), items.map(({
    tokens,
    netUsdValue
  }, index) => {
    const symbols = tokens.map(({
      symbol
    }) => symbol).join(' + ');
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
      key: `defi-rewards-${index}`,
      direction: "row",
      sx: {
        gap: 1,
        justifyContent: 'space-between'
      },
      "data-testid": "defi-item"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
      direction: "row",
      sx: {
        gap: 1,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_DefiTokenAvatarGroup__WEBPACK_IMPORTED_MODULE_1__.DefiTokenAvatarGroup, {
      maxTokens: mostTokensInAnItem,
      tokens: tokens
    }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
      sx: {
        gap: 0.5,
        flexGrow: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
      direction: "row",
      sx: {
        justifyContent: 'space-between',
        gap: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
      title: symbols,
      variant: "caption",
      noWrap: true,
      "data-testid": "defi-item-token-list"
    }, symbols), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
      variant: "caption",
      "data-testid": "defi-item-value"
    }, formatValue(netUsdValue))))));
  }));
};

/***/ }),

/***/ "./src/pages/DeFi/components/DefiPortfolioVesting.tsx":
/*!************************************************************!*\
  !*** ./src/pages/DeFi/components/DefiPortfolioVesting.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiPortfolioVesting": () => (/* binding */ DefiPortfolioVesting)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hooks/useConvertedCurrencyFormatter */ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const DefiPortfolioVesting = ({
  items
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const formatValue = (0,_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_0__.useConvertedCurrencyFormatter)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 1.25
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    direction: "row",
    sx: {
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "button"
  }, t('Pool')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "button"
  }, t('Value'))), items.map(({
    token,
    netUsdValue
  }, index) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    key: `defi-vesting-${index}`,
    direction: "row",
    sx: {
      gap: 1,
      justifyContent: 'space-between'
    },
    "data-testid": "defi-item"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    direction: "row",
    sx: {
      gap: 1,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Avatar, {
    sx: {
      width: 16,
      height: 16
    },
    src: token.logoUrl,
    alt: token.name,
    "data-testid": "defi-item-token-avatar"
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    "data-testid": "defi-item-token-list"
  }, token.symbol))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 0.5,
      textAlign: 'end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    "data-testid": "defi-item-value"
  }, formatValue(netUsdValue))))));
};

/***/ }),

/***/ "./src/pages/DeFi/components/DefiProtocolDetailsHeader.tsx":
/*!*****************************************************************!*\
  !*** ./src/pages/DeFi/components/DefiProtocolDetailsHeader.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiProtocolDetailsHeader": () => (/* binding */ DefiProtocolDetailsHeader)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_extensionUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/extensionUtils */ "./src/utils/extensionUtils.ts");
/* harmony import */ var _hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useConvertedCurrencyFormatter */ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const DefiProtocolDetailsHeader = ({
  protocol
}) => {
  const formatValue = (0,_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_2__.useConvertedCurrencyFormatter)();
  const goToProtocolPage = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (protocol?.siteUrl) {
      (0,_src_utils_extensionUtils__WEBPACK_IMPORTED_MODULE_1__.openNewTab)({
        url: protocol?.siteUrl
      });
    }
  }, [protocol]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    direction: "row",
    sx: {
      alignItems: 'start',
      gap: 2,
      pt: 2,
      pb: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Avatar, {
    src: protocol.logoUrl,
    alt: protocol.name,
    sx: {
      mt: 0.5
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      gap: 1,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "h4",
    "data-testid": "defi-protocol-header-name"
  }, protocol.name), protocol.chainId && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    direction: "row",
    sx: {
      gap: 0.75,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Avatar, {
    src: protocol.chainLogoUrl,
    alt: protocol.chainName,
    sx: {
      width: 12,
      height: 12
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "caption",
    color: "text.secondary",
    "data-testid": "defi-protocol-header-chain"
  }, protocol.chainName))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      alignItems: 'flex-end',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "button",
    sx: {
      fontSize: 14
    },
    "data-testid": "defi-protocol-header-value"
  }, formatValue(protocol.totalUsdValue)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.IconButton, {
    component: "a",
    size: "small",
    sx: {
      mr: -0.5
    },
    onClick: goToProtocolPage,
    "data-testid": "defi-protocol-header-dapp-link"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.ExternalLinkIcon, {
    size: 16
  }))));
};

/***/ }),

/***/ "./src/pages/DeFi/components/DefiTokenAvatarGroup.tsx":
/*!************************************************************!*\
  !*** ./src/pages/DeFi/components/DefiTokenAvatarGroup.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefiTokenAvatarGroup": () => (/* binding */ DefiTokenAvatarGroup)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const MAX_DISPLAYED_AVATARS = 3;
const AVATAR_SIZE = 16;
const AVATAR_PROPS = {
  imgProps: {
    loading: 'lazy'
  },
  sx: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE
  }
};
const DefiTokenAvatarGroup = ({
  tokens,
  maxTokens,
  ...rest
}) => {
  const width = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => AVATAR_SIZE + (Math.min(MAX_DISPLAYED_AVATARS, maxTokens) - 1) * (AVATAR_SIZE / 2), [maxTokens]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AvatarGroup, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, rest, {
    max: MAX_DISPLAYED_AVATARS,
    sx: {
      width,
      gap: 0.5,
      justifyContent: 'start',
      display: 'inline-flex'
    },
    slotProps: {
      additionalAvatar: {
        ...AVATAR_PROPS,
        style: {
          fontSize: '9px'
        }
      }
    }
  }), tokens.map(token => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Avatar, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, AVATAR_PROPS, {
    "data-testid": "defi-item-token-avatar",
    key: token.symbol,
    src: token.logoUrl,
    alt: token.name
  }))));
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

/***/ "./src/utils/sumByProperty.ts":
/*!************************************!*\
  !*** ./src/utils/sumByProperty.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sumByProperty": () => (/* binding */ sumByProperty)
/* harmony export */ });
/* harmony import */ var _logging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logging */ "./src/utils/logging.ts");

const sumByProperty = (values, key) => {
  return values.reduce((acc, curr, index) => {
    const value = curr[key];
    if (typeof value === 'number') {
      return acc + value;
    }

    // Log out instances when provided list contains non-numeric values
    (0,_logging__WEBPACK_IMPORTED_MODULE_0__.formatAndLog)(`sumByProperty(): object at index ${index} was ignored. Property ${String(key)} does not contain a number:`, curr);
    return acc;
  }, 0);
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0RlRmlfRGVmaVByb3RvY29sRGV0YWlsc190c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQzBEO0FBQ2pCO0FBS0o7QUFDVTtBQUNtQjtBQU8zRCxTQUFTUyx5QkFBeUJBLENBQUNDLElBQW1CLEVBQUU7RUFDN0QsTUFBTUMsWUFBWSxHQUFHO0lBQ25CLENBQUNILG1GQUFvQixHQUFHTCwwQ0FBUyxDQUFDLFFBQVEsQ0FBQztJQUMzQyxDQUFDSyxpRkFBa0IsR0FBR0wsMENBQVMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQ0ssaUZBQWtCLEdBQUdMLDBDQUFTLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLENBQUNLLGdGQUFpQixHQUFHTCwwQ0FBUyxDQUFDLEtBQUssQ0FBQztJQUNyQyxDQUFDSyxpRkFBa0IsR0FBR0wsMENBQVMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQ0sscUZBQXNCLEdBQUdMLDBDQUFTLENBQUMsVUFBVSxDQUFDO0lBQy9DLENBQUNLLDBGQUEyQixHQUFHTCwwQ0FBUyxDQUFDLGVBQWU7RUFDMUQsQ0FBQztFQUVELE9BQU9RLFlBQVksQ0FBQ0QsSUFBSSxDQUFDO0FBQzNCO0FBRU8sU0FBU1MsaUJBQWlCQSxDQUFDO0VBQ2hDQyxZQUFZO0VBQ1pDLGFBQWE7RUFDYkM7QUFDeUMsQ0FBQyxFQUFFO0VBQzVDLE1BQU07SUFBRXBCO0VBQUUsQ0FBQyxHQUFHSyw2REFBYyxFQUFFO0VBRTlCLG9CQUNFZ0IsS0FBQSxDQUFBQyxhQUFBLENBQUNuQiw4REFBSztJQUFDb0IsRUFBRSxFQUFFO01BQUVDLE1BQU0sRUFBRSxNQUFNO01BQUVDLEtBQUssRUFBRTtJQUFPO0VBQUUsR0FDMUMsQ0FBQ04sYUFBYSxpQkFDYkUsS0FBQSxDQUFBQyxhQUFBLENBQUN4QixpREFBUztJQUFDNEIsT0FBTyxFQUFFM0IsZ0VBQXdCNEI7RUFBQyxHQUFFM0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUMxRCxlQUNE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ZSxFQUNmUixjQUFjLEVBQ2RJLGNBQWMsQ0FDZixDQUFDO0FBQ0osQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDN0N3QztBQUVsQyxNQUFNakcsYUFBYSxHQUFHQSxDQUMzQjRHLE1BQVcsRUFDWG5ILEdBQU0sS0FDSztFQUNYLE9BQU9tSCxNQUFNLENBQUNwRSxNQUFNLENBQUMsQ0FBQ3FFLEdBQUcsRUFBRUMsSUFBSSxFQUFFL0YsS0FBSyxLQUFLO0lBQ3pDLE1BQU11RixLQUFLLEdBQUdRLElBQUksQ0FBQ3JILEdBQUcsQ0FBQztJQUV2QixJQUFJLE9BQU82RyxLQUFLLEtBQUssUUFBUSxFQUFFO01BQzdCLE9BQU9PLEdBQUcsR0FBR1AsS0FBSztJQUNwQjs7SUFFQTtJQUNBSyxzREFBWSxDQUNULG9DQUFtQzVGLEtBQU0sMEJBQXlCZ0csTUFBTSxDQUN2RXRILEdBQUcsQ0FDSCw2QkFBNEIsRUFDOUJxSCxJQUFJLENBQ0w7SUFFRCxPQUFPRCxHQUFHO0VBQ1osQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNQLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0Z1bmN0aW9uSXNPZmZsaW5lLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0RlRmkvRGVmaVByb3RvY29sRGV0YWlscy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9EZUZpL2NvbXBvbmVudHMvRGVmaUVycm9yU3RhdGUudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvRGVGaS9jb21wb25lbnRzL0RlZmlQb3J0Zm9saW9Db21tb24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvRGVGaS9jb21wb25lbnRzL0RlZmlQb3J0Zm9saW9JbnN1cmFuY2UudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvRGVGaS9jb21wb25lbnRzL0RlZmlQb3J0Zm9saW9JdGVtR3JvdXAudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvRGVGaS9jb21wb25lbnRzL0RlZmlQb3J0Zm9saW9MZW5kaW5nLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0RlRmkvY29tcG9uZW50cy9EZWZpUG9ydGZvbGlvUGVycGV0dWFsLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0RlRmkvY29tcG9uZW50cy9EZWZpUG9ydGZvbGlvUmV3YXJkcy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9EZUZpL2NvbXBvbmVudHMvRGVmaVBvcnRmb2xpb1Zlc3RpbmcudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvRGVGaS9jb21wb25lbnRzL0RlZmlQcm90b2NvbERldGFpbHNIZWFkZXIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvRGVGaS9jb21wb25lbnRzL0RlZmlUb2tlbkF2YXRhckdyb3VwLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0RlRmkvaG9va3MvdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXIudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9zdW1CeVByb3BlcnR5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgUGFnZVRpdGxlLCBQYWdlVGl0bGVWYXJpYW50IH0gZnJvbSAnLi9QYWdlVGl0bGUnO1xuaW1wb3J0IHsgdCBhcyB0cmFuc2xhdGUgfSBmcm9tICdpMThuZXh0JztcbmltcG9ydCB7XG4gIEFsZXJ0Q2lyY2xlSWNvbixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgRnVuY3Rpb25OYW1lcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNGdW5jdGlvbkF2YWlsYWJsZSc7XG5cbmludGVyZmFjZSBGdW5jdGlvbklzT2ZmbGluZVByb3BzIHtcbiAgZnVuY3Rpb25OYW1lOiBGdW5jdGlvbk5hbWVzO1xuICBoaWRlUGFnZVRpdGxlPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUobmFtZTogRnVuY3Rpb25OYW1lcykge1xuICBjb25zdCB0cmFuc2xhdGlvbnMgPSB7XG4gICAgW0Z1bmN0aW9uTmFtZXMuQlJJREdFXTogdHJhbnNsYXRlKCdCcmlkZ2UnKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5TV0FQXTogdHJhbnNsYXRlKCdTd2FwJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuU0VORF06IHRyYW5zbGF0ZSgnU2VuZCcpLFxuICAgIFtGdW5jdGlvbk5hbWVzLkJVWV06IHRyYW5zbGF0ZSgnQnV5JyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuREVGSV06IHRyYW5zbGF0ZSgnRGVGaScpLFxuICAgIFtGdW5jdGlvbk5hbWVzLktFWVNUT05FXTogdHJhbnNsYXRlKCdLZXlzdG9uZScpLFxuICAgIFtGdW5jdGlvbk5hbWVzLlRPS0VOX0RFVEFJTFNdOiB0cmFuc2xhdGUoJ1Rva2VuIERldGFpbHMnKSxcbiAgfTtcblxuICByZXR1cm4gdHJhbnNsYXRpb25zW25hbWVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRnVuY3Rpb25Jc09mZmxpbmUoe1xuICBmdW5jdGlvbk5hbWUsXG4gIGhpZGVQYWdlVGl0bGUsXG4gIGNoaWxkcmVuLFxufTogUHJvcHNXaXRoQ2hpbGRyZW48RnVuY3Rpb25Jc09mZmxpbmVQcm9wcz4pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGhlaWdodDogJzEwMCUnLCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgeyFoaWRlUGFnZVRpdGxlICYmIChcbiAgICAgICAgPFBhZ2VUaXRsZSB2YXJpYW50PXtQYWdlVGl0bGVWYXJpYW50LlBSSU1BUll9Pnt0KCdTb3JyeScpfTwvUGFnZVRpdGxlPlxuICAgICAgKX1cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBmbGV4R3JvdzogMSB9fVxuICAgICAgPlxuICAgICAgICA8QWxlcnRDaXJjbGVJY29uIHNpemU9ezcyfSBzeD17eyBtYjogMywgbXQ6IC05IH19IC8+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiIHN4PXt7IG1iOiAxIH19PlxuICAgICAgICAgIHt0KCdGZWF0dXJlIERpc2FibGVkJyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICBzaXplPXsxNn1cbiAgICAgICAgICBhbGlnbj1cImNlbnRlclwiXG4gICAgICAgICAgaGVpZ2h0PVwiMjRweFwiXG4gICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0KCd7e2Z1bmN0aW9uTmFtZX19IGlzIGN1cnJlbnRseSB1bmF2YWlsYWJsZS4nLCB7XG4gICAgICAgICAgICBmdW5jdGlvbk5hbWU6XG4gICAgICAgICAgICAgIGdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUoZnVuY3Rpb25OYW1lKSA/PyB0KCdUaGlzIEZlYXR1cmUnKSxcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICB7dCgnUGxlYXNlIGNoZWNrIGJhY2sgbGF0ZXIgYW5kIHRyeSBhZ2Fpbi4nKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSwgdXNlUGFyYW1zIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIENhcmQsXG4gIENhcmRDb250ZW50LFxuICBDaXJjdWxhclByb2dyZXNzLFxuICBEaXZpZGVyLFxuICBFeHRlcm5hbExpbmtJY29uLFxuICBTY3JvbGxiYXJzLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgb3Blbk5ld1RhYiB9IGZyb20gJ0BzcmMvdXRpbHMvZXh0ZW5zaW9uVXRpbHMnO1xuaW1wb3J0IHsgdXNlRGVmaUNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0RlZmlQcm92aWRlcic7XG5pbXBvcnQgeyBGdW5jdGlvbklzT2ZmbGluZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRnVuY3Rpb25Jc09mZmxpbmUnO1xuaW1wb3J0IHsgdXNlRmVhdHVyZUZsYWdDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9GZWF0dXJlRmxhZ3NQcm92aWRlcic7XG5pbXBvcnQgeyBQYWdlVGl0bGUsIFBhZ2VUaXRsZVZhcmlhbnQgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5cbmltcG9ydCB7IERlZmlFcnJvclN0YXRlIH0gZnJvbSAnLi9jb21wb25lbnRzL0RlZmlFcnJvclN0YXRlJztcbmltcG9ydCB7IERlZmlQb3J0Zm9saW9JdGVtR3JvdXAgfSBmcm9tICcuL2NvbXBvbmVudHMvRGVmaVBvcnRmb2xpb0l0ZW1Hcm91cCc7XG5pbXBvcnQgeyBEZWZpUHJvdG9jb2xEZXRhaWxzSGVhZGVyIH0gZnJvbSAnLi9jb21wb25lbnRzL0RlZmlQcm90b2NvbERldGFpbHNIZWFkZXInO1xuaW1wb3J0IHsgRmVhdHVyZUdhdGVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2ZlYXR1cmVGbGFncy9tb2RlbHMnO1xuaW1wb3J0IHsgRnVuY3Rpb25OYW1lcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNGdW5jdGlvbkF2YWlsYWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBEZWZpUHJvdG9jb2xEZXRhaWxzKCkge1xuICBjb25zdCB7IHByb3RvY29sSWQgfSA9IHVzZVBhcmFtczx7IHByb3RvY29sSWQ6IHN0cmluZyB9PigpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG5cbiAgY29uc3QgeyBmZWF0dXJlRmxhZ3MgfSA9IHVzZUZlYXR1cmVGbGFnQ29udGV4dCgpO1xuICBjb25zdCB7IGhhc0Vycm9yLCBpc0xvYWRpbmcsIHBvcnRmb2xpbywgcmVmcmVzaCB9ID0gdXNlRGVmaUNvbnRleHQoKTtcblxuICBjb25zdCBwcm90b2NvbCA9XG4gICAgcG9ydGZvbGlvPy5wcm90b2NvbHM/LmZpbmQoKHApID0+IHAuaWQgPT09IHByb3RvY29sSWQpID8/IG51bGw7XG5cbiAgY29uc3QgZ29Ub1Byb3RvY29sUGFnZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAocHJvdG9jb2w/LnNpdGVVcmwpIHtcbiAgICAgIG9wZW5OZXdUYWIoeyB1cmw6IHByb3RvY29sPy5zaXRlVXJsIH0pO1xuICAgIH1cbiAgfSwgW3Byb3RvY29sXSk7XG5cbiAgLy8gUmVmcmVzaCBwb3NzaWJseS1zdGFsZSBkYXRhIHVwb24gY29tcG9uZW50IHJlbmRlclxuICB1c2VFZmZlY3QocmVmcmVzaCwgW3JlZnJlc2hdKTtcblxuICBpZiAoIWZlYXR1cmVGbGFnc1tGZWF0dXJlR2F0ZXMuREVGSV0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZ1bmN0aW9uSXNPZmZsaW5lIGhpZGVQYWdlVGl0bGUgZnVuY3Rpb25OYW1lPXtGdW5jdGlvbk5hbWVzLkRFRkl9IC8+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICBwdDogMSxcbiAgICAgICAgcGI6IDIsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtpc0xvYWRpbmcgJiYgIXByb3RvY29sICYmIDxDaXJjdWxhclByb2dyZXNzIHN4PXt7IG10OiA5IH19IHNpemU9ezEwMH0gLz59XG4gICAgICB7aGFzRXJyb3IgJiYgPERlZmlFcnJvclN0YXRlIC8+fVxuICAgICAge3Byb3RvY29sICYmIChcbiAgICAgICAgPD5cbiAgICAgICAgICA8UGFnZVRpdGxlXG4gICAgICAgICAgICB2YXJpYW50PXtQYWdlVGl0bGVWYXJpYW50LlNFQ09OREFSWX1cbiAgICAgICAgICAgIG1hcmdpbj1cIjhweCAwIDhweCAtMjRweFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q2FyZCBzeD17eyB3aWR0aDogMSwgb3ZlcmZsb3c6ICdpbml0aWFsJywgZmxleEdyb3c6IDEgfX0+XG4gICAgICAgICAgICA8Q2FyZENvbnRlbnRcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBweDogMixcbiAgICAgICAgICAgICAgICBweTogMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAnOmxhc3QtY2hpbGQnOiB7IHBiOiAwIH0sXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICAgICAgICA8RGVmaVByb3RvY29sRGV0YWlsc0hlYWRlciBwcm90b2NvbD17cHJvdG9jb2x9IC8+XG4gICAgICAgICAgICAgICAgPERpdmlkZXIgc3g9e3sgbXk6IDEgfX0gLz5cbiAgICAgICAgICAgICAgICA8U2Nyb2xsYmFycz5cbiAgICAgICAgICAgICAgICAgIHtwcm90b2NvbC5ncm91cHMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgICBzeD17eyBtdDogNSwgZ2FwOiAxLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fVxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1wcm90b2NvbC1lbXB0aWVkLXN0YXRlXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdObyBUcmFuc2FjdGlvbnMgRm91bmQnKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhpc3RvcnkucmVwbGFjZSgnL2hvbWU/YWN0aXZlVGFiPURFRkknKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IG10OiAxIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3QoJ0dvIEJhY2sgdG8gRGVGaSBQb3J0Zm9saW8nKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGdhcDogMSB9fVxuICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXI9ezxEaXZpZGVyIC8+fVxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1wcm90b2NvbC1ncm91cHNcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3Byb3RvY29sLmdyb3Vwcy5tYXAoKGdyb3VwKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8RGVmaVBvcnRmb2xpb0l0ZW1Hcm91cFxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2dyb3VwLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwPXtncm91cH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgey8qIEFkZGl0aW9uYWwgcGFkZGluZyBhdCB0aGUgYm90dG9tIG9mIHNjcm9sbGVyICovfVxuICAgICAgICAgICAgICAgICAgPEJveCBzeD17eyB3aWR0aDogMSwgaGVpZ2h0OiA0MCB9fSAvPnsnICd9XG4gICAgICAgICAgICAgICAgPC9TY3JvbGxiYXJzPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgZmxleFNocmluazogMCxcbiAgICAgICAgICAgICAgcHQ6IDIsXG4gICAgICAgICAgICAgIHBiOiAxLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgb25DbGljaz17Z29Ub1Byb3RvY29sUGFnZX1cbiAgICAgICAgICAgICAgc3RhcnRJY29uPXs8RXh0ZXJuYWxMaW5rSWNvbiBzaXplPXsxNn0gLz59XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1wcm90b2NvbC1kYXBwLWJ1dHRvblwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdHbyB0byB7e3Byb3RvY29sTmFtZX19JywgeyBwcm90b2NvbE5hbWU6IHByb3RvY29sLm5hbWUgfSl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8Lz5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBBbGVydENpcmNsZUljb24sXG4gIFN0YWNrLFxuICBTdGFja1Byb3BzLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgRGVmaUVycm9yU3RhdGUgPSAocHJvcHM6IFN0YWNrUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IG10OiA5LCBnYXA6IDEsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19IHsuLi5wcm9wc30+XG4gICAgICA8QWxlcnRDaXJjbGVJY29uIHNpemU9ezYwfSBzeD17eyBtYjogMiB9fSAvPlxuICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+e3QoJ0Vycm9yIScpfTwvVHlwb2dyYXBoeT5cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAge3QoJ0RhdGEgY3VycmVudGx5IHVuYXZhaWxhYmxlLCBjaGVjayBiYWNrIGxhdGVyLicpfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgc3VtQnlQcm9wZXJ0eSB9IGZyb20gJ0BzcmMvdXRpbHMvc3VtQnlQcm9wZXJ0eSc7XG5pbXBvcnQgeyBEZWZpQ29tbW9uSXRlbSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9kZWZpL21vZGVscyc7XG5cbmltcG9ydCB7IHVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyIH0gZnJvbSAnLi4vaG9va3MvdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXInO1xuaW1wb3J0IHsgRGVmaVRva2VuQXZhdGFyR3JvdXAgfSBmcm9tICcuL0RlZmlUb2tlbkF2YXRhckdyb3VwJztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIGl0ZW1zOiBEZWZpQ29tbW9uSXRlbVtdO1xuICBoZWFkZXI6IHN0cmluZztcbn07XG5cbmV4cG9ydCBjb25zdCBEZWZpUG9ydGZvbGlvQ29tbW9uID0gKHsgaXRlbXMsIGhlYWRlciB9OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGZvcm1hdFZhbHVlID0gdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXIoKTtcblxuICBjb25zdCBtb3N0VG9rZW5zSW5Bbkl0ZW0gPSB1c2VNZW1vKFxuICAgICgpID0+IE1hdGgubWF4KC4uLml0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5zdXBwbHlUb2tlbnM/Lmxlbmd0aCA/PyAwKSksXG4gICAgW2l0ZW1zXSxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBnYXA6IDEuMjUgfX0+XG4gICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJ1dHRvblwiPntoZWFkZXJ9PC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYnV0dG9uXCI+e3QoJ1ZhbHVlJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgPC9TdGFjaz5cblxuICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMiB9fT5cbiAgICAgICAge2l0ZW1zLm1hcCgoeyBzdXBwbHlUb2tlbnMgPSBbXSwgcmV3YXJkVG9rZW5zID0gW10gfSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBoYXNSZXdhcmRzID0gcmV3YXJkVG9rZW5zLmxlbmd0aCA+IDA7XG4gICAgICAgICAgY29uc3Qgc3VwcGxpZWRWYWx1ZSA9IGZvcm1hdFZhbHVlKFxuICAgICAgICAgICAgc3VtQnlQcm9wZXJ0eShzdXBwbHlUb2tlbnMsICd1c2RWYWx1ZScpLFxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgcmV3YXJkZWRWYWx1ZSA9IGZvcm1hdFZhbHVlKFxuICAgICAgICAgICAgc3VtQnlQcm9wZXJ0eShyZXdhcmRUb2tlbnMsICd1c2RWYWx1ZScpLFxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3Qgc3ltYm9scyA9IHN1cHBseVRva2Vucy5tYXAoKHsgc3ltYm9sIH0pID0+IHN5bWJvbCkuam9pbignICsgJyk7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIGtleT17YGRlZmktY29tbW9uLSR7aW5kZXh9YH1cbiAgICAgICAgICAgICAgZGlyZWN0aW9uPVwicm93XCJcbiAgICAgICAgICAgICAgc3g9e3sgZ2FwOiAxLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH19XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1pdGVtXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uPVwicm93XCJcbiAgICAgICAgICAgICAgICBzeD17eyBnYXA6IDEsIHdpZHRoOiAxLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxEZWZpVG9rZW5BdmF0YXJHcm91cFxuICAgICAgICAgICAgICAgICAgdG9rZW5zPXtzdXBwbHlUb2tlbnN9XG4gICAgICAgICAgICAgICAgICBtYXhUb2tlbnM9e21vc3RUb2tlbnNJbkFuSXRlbX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgZ2FwOiAwLjUsXG4gICAgICAgICAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICAgIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgICAgICAgICBzeD17eyBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBnYXA6IDEgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17c3ltYm9sc31cbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgbm9XcmFwXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWZpLWl0ZW0tdG9rZW4tbGlzdFwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7c3ltYm9sc31cbiAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGRhdGEtdGVzdGlkPVwiZGVmaS1pdGVtLXZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3N1cHBsaWVkVmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICAgICAgICAgIHtoYXNSZXdhcmRzICYmIChcbiAgICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uPVwicm93XCJcbiAgICAgICAgICAgICAgICAgICAgICBzeD17eyBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBnYXA6IDEgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3QoJ1Jld2FyZHMnKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWZpLWl0ZW0tcmV3YXJkcy12YWx1ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3Jld2FyZGVkVmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgU3RhY2ssIFRvb2x0aXAsIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyBEZWZpSW5zdXJhbmNlQnV5ZXJJdGVtIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2RlZmkvbW9kZWxzJztcblxuaW1wb3J0IHsgdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXIgfSBmcm9tICcuLi9ob29rcy91c2VDb252ZXJ0ZWRDdXJyZW5jeUZvcm1hdHRlcic7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIGl0ZW1zOiBEZWZpSW5zdXJhbmNlQnV5ZXJJdGVtW107XG59O1xuXG5leHBvcnQgY29uc3QgRGVmaVBvcnRmb2xpb0luc3VyYW5jZSA9ICh7IGl0ZW1zIH06IFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgZm9ybWF0VmFsdWUgPSB1c2VDb252ZXJ0ZWRDdXJyZW5jeUZvcm1hdHRlcigpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGdhcDogMS4yNSB9fT5cbiAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH19PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYnV0dG9uXCI+e3QoJ0Rlc2NyaXB0aW9uJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYnV0dG9uXCI+e3QoJ1ZhbHVlJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgPC9TdGFjaz5cblxuICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMiB9fT5cbiAgICAgICAge2l0ZW1zLm1hcCgoeyBkZXNjcmlwdGlvbiwgbmV0VXNkVmFsdWUgfSwgaW5kZXgpID0+IChcbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIGtleT17YGRlZmktaW5zdXJhbmNlLSR7aW5kZXh9YH1cbiAgICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgICBzeD17eyBnYXA6IDIsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1pdGVtXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VG9vbHRpcCB0aXRsZT17ZGVzY3JpcHRpb259IHdyYXBXaXRoU3Bhbj17ZmFsc2V9PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlZmktaXRlbS1kZXNjcmlwdGlvblwiXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7ZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDAuNSwgdGV4dEFsaWduOiAnZW5kJyB9fT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBkYXRhLXRlc3RpZD1cImRlZmktaXRlbS12YWx1ZVwiPlxuICAgICAgICAgICAgICAgIHtmb3JtYXRWYWx1ZShuZXRVc2RWYWx1ZSl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgKSl9XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBTdGFjaywgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7XG4gIERlZmlDb21tb25JdGVtLFxuICBEZWZpSW5zdXJhbmNlQnV5ZXJJdGVtLFxuICBEZWZpSXRlbSxcbiAgRGVmaUl0ZW1Hcm91cCxcbiAgRGVmaUl0ZW1UeXBlLFxuICBEZWZpTGVuZGluZ0l0ZW0sXG4gIERlZmlQZXJwZXR1YWxJdGVtLFxuICBEZWZpUmV3YXJkSXRlbSxcbiAgRGVmaVZlc3RpbmdJdGVtLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZGVmaS9tb2RlbHMnO1xuXG5pbXBvcnQgeyBEZWZpUG9ydGZvbGlvTGVuZGluZyB9IGZyb20gJy4vRGVmaVBvcnRmb2xpb0xlbmRpbmcnO1xuaW1wb3J0IHsgRGVmaVBvcnRmb2xpb0NvbW1vbiB9IGZyb20gJy4vRGVmaVBvcnRmb2xpb0NvbW1vbic7XG5pbXBvcnQgeyBEZWZpUG9ydGZvbGlvUmV3YXJkcyB9IGZyb20gJy4vRGVmaVBvcnRmb2xpb1Jld2FyZHMnO1xuaW1wb3J0IHsgRGVmaVBvcnRmb2xpb1Zlc3RpbmcgfSBmcm9tICcuL0RlZmlQb3J0Zm9saW9WZXN0aW5nJztcbmltcG9ydCB7IERlZmlQb3J0Zm9saW9JbnN1cmFuY2UgfSBmcm9tICcuL0RlZmlQb3J0Zm9saW9JbnN1cmFuY2UnO1xuaW1wb3J0IHsgRGVmaVBvcnRmb2xpb1BlcnBldHVhbCB9IGZyb20gJy4vRGVmaVBvcnRmb2xpb1BlcnBldHVhbCc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIGdyb3VwOiBEZWZpSXRlbUdyb3VwO1xufTtcblxuZXhwb3J0IGNvbnN0IERlZmlQb3J0Zm9saW9JdGVtR3JvdXAgPSAoeyBncm91cCB9OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGhlYWRlciA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKGdyb3VwLm5hbWUgPT09ICdSZXdhcmRzJyA/IHQoJ1Bvb2wnKSA6IHQoJ1N1cHBsaWVkJykpLFxuICAgIFtncm91cC5uYW1lLCB0XSxcbiAgKTtcbiAgY29uc3QgaXRlbXNCeVR5cGUgPSB1c2VNZW1vKFxuICAgICgpID0+XG4gICAgICBncm91cC5pdGVtcy5yZWR1Y2UoXG4gICAgICAgIChncm91cGVkLCBpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKCFncm91cGVkW2l0ZW0udHlwZV0pIHtcbiAgICAgICAgICAgIGdyb3VwZWRbaXRlbS50eXBlXSA9IFtpdGVtXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JvdXBlZFtpdGVtLnR5cGVdLnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGdyb3VwZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHt9IGFzIFJlY29yZDxEZWZpSXRlbVR5cGUsIERlZmlJdGVtW10+LFxuICAgICAgKSxcbiAgICBbZ3JvdXBdLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGdhcDogMiB9fSBkYXRhLXRlc3RpZD1cImRlZmktcHJvdG9jb2wtZ3JvdXBcIj5cbiAgICAgIDxTdGFjayBzeD17eyBwdDogMSwganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInIH19PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDZcIiBkYXRhLXRlc3RpZD1cImRlZmktcHJvdG9jb2wtZ3JvdXAtbmFtZVwiPlxuICAgICAgICAgIHt0KGdyb3VwLm5hbWUpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMiwgcGI6IDIgfX0+XG4gICAgICAgIHtPYmplY3QuZW50cmllcyhpdGVtc0J5VHlwZSkubWFwKChbdHlwZSwgaXRlbXNdKSA9PiB7XG4gICAgICAgICAgY29uc3Qga2V5ID0gYGRlZmktZ3JvdXAtJHt0eXBlfWA7XG5cbiAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgRGVmaUl0ZW1UeXBlLkxlbmRpbmc6XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPERlZmlQb3J0Zm9saW9MZW5kaW5nXG4gICAgICAgICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpdGVtcyBhcyBEZWZpTGVuZGluZ0l0ZW1bXX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjYXNlIERlZmlJdGVtVHlwZS5SZXdhcmQ6XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPERlZmlQb3J0Zm9saW9SZXdhcmRzXG4gICAgICAgICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpdGVtcyBhcyBEZWZpUmV3YXJkSXRlbVtdfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNhc2UgRGVmaUl0ZW1UeXBlLlZlc3Rpbmc6XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPERlZmlQb3J0Zm9saW9WZXN0aW5nXG4gICAgICAgICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgICAgICAgIGl0ZW1zPXtpdGVtcyBhcyBEZWZpVmVzdGluZ0l0ZW1bXX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjYXNlIERlZmlJdGVtVHlwZS5JbnN1cmFuY2VCdXllcjpcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8RGVmaVBvcnRmb2xpb0luc3VyYW5jZVxuICAgICAgICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICAgICAgICBpdGVtcz17aXRlbXMgYXMgRGVmaUluc3VyYW5jZUJ1eWVySXRlbVtdfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNhc2UgRGVmaUl0ZW1UeXBlLlBlcnBldHVhbDpcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8RGVmaVBvcnRmb2xpb1BlcnBldHVhbFxuICAgICAgICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICAgICAgICBpdGVtcz17aXRlbXMgYXMgRGVmaVBlcnBldHVhbEl0ZW1bXX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxEZWZpUG9ydGZvbGlvQ29tbW9uXG4gICAgICAgICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgICAgICAgIGhlYWRlcj17aGVhZGVyfVxuICAgICAgICAgICAgICAgICAgaXRlbXM9e2l0ZW1zIGFzIERlZmlDb21tb25JdGVtW119XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pfVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBBdmF0YXIsIFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHtcbiAgRGVmaUxlbmRpbmdJdGVtLFxuICBEZWZpVG9rZW4sXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9kZWZpL21vZGVscyc7XG5cbmltcG9ydCB7IHVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyIH0gZnJvbSAnLi4vaG9va3MvdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXInO1xuXG50eXBlIFByb3BzID0ge1xuICBpdGVtczogRGVmaUxlbmRpbmdJdGVtW107XG59O1xuXG5leHBvcnQgY29uc3QgRGVmaVBvcnRmb2xpb0xlbmRpbmcgPSAoeyBpdGVtcyB9OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgZ2FwOiAzIH19PlxuICAgICAge2l0ZW1zLm1hcCgoeyBzdXBwbHlUb2tlbnMsIGJvcnJvd1Rva2VucywgcmV3YXJkVG9rZW5zIH0sIGluZGV4KSA9PiAoXG4gICAgICAgIDxTdGFjayBrZXk9e2BkZWZpLWxlbmRpbmctJHtpbmRleH1gfSBzeD17eyBnYXA6IDIgfX0+XG4gICAgICAgICAge3N1cHBseVRva2Vucy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxEZWZpTGVuZGluZ1NlY3Rpb25cbiAgICAgICAgICAgICAgdG9rZW5zPXtzdXBwbHlUb2tlbnN9XG4gICAgICAgICAgICAgIGhlYWRlcnM9e1t0KCdTdXBwbGllZCcpLCB0KCdWYWx1ZScpXX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7Ym9ycm93VG9rZW5zLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgPERlZmlMZW5kaW5nU2VjdGlvblxuICAgICAgICAgICAgICB0b2tlbnM9e2JvcnJvd1Rva2Vuc31cbiAgICAgICAgICAgICAgaGVhZGVycz17W3QoJ0JvcnJvd2VkJyldfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtyZXdhcmRUb2tlbnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8RGVmaUxlbmRpbmdTZWN0aW9uXG4gICAgICAgICAgICAgIHRva2Vucz17cmV3YXJkVG9rZW5zfVxuICAgICAgICAgICAgICBoZWFkZXJzPXtbdCgnUmV3YXJkcycpXX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICkpfVxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuXG50eXBlIFNlY3Rpb25Qcm9wcyA9IHtcbiAgaGVhZGVyczogc3RyaW5nW107XG4gIHRva2VuczogRGVmaVRva2VuW107XG59O1xuXG5jb25zdCBEZWZpTGVuZGluZ1NlY3Rpb24gPSAoeyBoZWFkZXJzLCB0b2tlbnMgfTogU2VjdGlvblByb3BzKSA9PiB7XG4gIGNvbnN0IGZvcm1hdFZhbHVlID0gdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXIoKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBnYXA6IDEuMjUgfX0gZGF0YS10ZXN0aWQ9XCJkZWZpLWxlbmRpbmctc2VjdGlvblwiPlxuICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIHN4PXt7IGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XG4gICAgICAgIHtoZWFkZXJzLm1hcCgoaGVhZGVyKSA9PiAoXG4gICAgICAgICAgPFR5cG9ncmFwaHkga2V5PXtoZWFkZXJ9IHZhcmlhbnQ9XCJidXR0b25cIj5cbiAgICAgICAgICAgIHtoZWFkZXJ9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICApKX1cbiAgICAgIDwvU3RhY2s+XG5cbiAgICAgIHt0b2tlbnMubWFwKCh0b2tlbikgPT4gKFxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBrZXk9e3Rva2VuLnN5bWJvbH1cbiAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgIHN4PXt7IGdhcDogMSwganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1pdGVtXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBnYXA6IDEgfX0+XG4gICAgICAgICAgICA8QXZhdGFyXG4gICAgICAgICAgICAgIGtleT17dG9rZW4uc3ltYm9sfVxuICAgICAgICAgICAgICBzcmM9e3Rva2VuLmxvZ29Vcmx9XG4gICAgICAgICAgICAgIGFsdD17dG9rZW4ubmFtZX1cbiAgICAgICAgICAgICAgc3g9e3sgd2lkdGg6IDE2LCBoZWlnaHQ6IDE2IH19XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1pdGVtLXRva2VuLWF2YXRhclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBkYXRhLXRlc3RpZD1cImRlZmktaXRlbS10b2tlbi1saXN0XCI+XG4gICAgICAgICAgICAgIHt0b2tlbi5zeW1ib2x9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGRhdGEtdGVzdGlkPVwiZGVmaS1pdGVtLXZhbHVlXCI+XG4gICAgICAgICAgICB7Zm9ybWF0VmFsdWUodG9rZW4udXNkVmFsdWUpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICkpfVxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEdyaWQsXG4gIEdyaWRQcm9wcyxcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IERlZmlQZXJwZXR1YWxJdGVtIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2RlZmkvbW9kZWxzJztcblxuaW1wb3J0IHsgdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXIgfSBmcm9tICcuLi9ob29rcy91c2VDb252ZXJ0ZWRDdXJyZW5jeUZvcm1hdHRlcic7XG5pbXBvcnQgeyBEZWZpVG9rZW5BdmF0YXJHcm91cCB9IGZyb20gJy4vRGVmaVRva2VuQXZhdGFyR3JvdXAnO1xuXG50eXBlIFByb3BzID0ge1xuICBpdGVtczogRGVmaVBlcnBldHVhbEl0ZW1bXTtcbn07XG5cbmNvbnN0IEdyaWRDZWxsID0gKHsgc3gsIC4uLnByb3BzIH06IEdyaWRQcm9wcykgPT4gKFxuICA8R3JpZFxuICAgIGl0ZW1cbiAgICBzeD17W1xuICAgICAgeyBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9LFxuICAgICAgLi4uKEFycmF5LmlzQXJyYXkoc3gpID8gc3ggOiBbc3hdKSxcbiAgICBdfVxuICAgIHsuLi5wcm9wc31cbiAgLz5cbik7XG5cbmV4cG9ydCBjb25zdCBEZWZpUG9ydGZvbGlvUGVycGV0dWFsID0gKHsgaXRlbXMgfTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCBmb3JtYXRWYWx1ZSA9IHVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgZ2FwOiAxLjI1IH19PlxuICAgICAgPEdyaWQgY29udGFpbmVyIHNwYWNpbmc9ezF9PlxuICAgICAgICA8R3JpZCBjb250YWluZXIgaXRlbSBzcGFjaW5nPXsxfT5cbiAgICAgICAgICA8R3JpZENlbGwgeHM9ezV9PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJ1dHRvblwiPnt0KCdUb2tlbiBQYWlyJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvR3JpZENlbGw+XG4gICAgICAgICAgPEdyaWRDZWxsIHhzPXszfT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJidXR0b25cIj57dCgnUG5MJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvR3JpZENlbGw+XG4gICAgICAgICAgPEdyaWRDZWxsIHhzPXs0fSBzeD17eyBqdXN0aWZ5Q29udGVudDogJ2VuZCcgfX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYnV0dG9uXCI+e3QoJ1ZhbHVlJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvR3JpZENlbGw+XG4gICAgICAgIDwvR3JpZD5cblxuICAgICAgICB7aXRlbXMubWFwKFxuICAgICAgICAgIChcbiAgICAgICAgICAgIHsgbWFyZ2luVG9rZW4sIHBvc2l0aW9uVG9rZW4sIHByb2ZpdFVzZFZhbHVlLCBuZXRVc2RWYWx1ZSB9LFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8R3JpZFxuICAgICAgICAgICAgICAgIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgICAgICBzcGFjaW5nPXsxfVxuICAgICAgICAgICAgICAgIGtleT17YGRlZmktcGVycGV0dWFsLSR7aW5kZXh9YH1cbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlZmktaXRlbVwiXG4gICAgICAgICAgICAgICAgc3g9e3sgYWxpZ25JdGVtczogJ2NlbnRlcicgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxHcmlkQ2VsbCB4cz17NX0gc3g9e3sgZ2FwOiAwLjUgfX0+XG4gICAgICAgICAgICAgICAgICA8RGVmaVRva2VuQXZhdGFyR3JvdXBcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zPXtbcG9zaXRpb25Ub2tlbiwgbWFyZ2luVG9rZW5dfVxuICAgICAgICAgICAgICAgICAgICBtYXhUb2tlbnM9ezJ9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlZmktaXRlbS10b2tlbi1wYWlyXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3Bvc2l0aW9uVG9rZW4uc3ltYm9sfS97bWFyZ2luVG9rZW4uc3ltYm9sfVxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDwvR3JpZENlbGw+XG4gICAgICAgICAgICAgICAgPEdyaWRDZWxsIHhzPXszfT5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIHtmb3JtYXRWYWx1ZShwcm9maXRVc2RWYWx1ZSl9XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgPC9HcmlkQ2VsbD5cbiAgICAgICAgICAgICAgICA8R3JpZENlbGwgeHM9ezR9IHN4PXt7IGp1c3RpZnlDb250ZW50OiAnZW5kJyB9fT5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgZGF0YS10ZXN0aWQ9XCJkZWZpLWl0ZW0tdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAge2Zvcm1hdFZhbHVlKG5ldFVzZFZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8L0dyaWRDZWxsPlxuICAgICAgICAgICAgICA8L0dyaWQ+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sXG4gICAgICAgICl9XG4gICAgICA8L0dyaWQ+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgRGVmaVJld2FyZEl0ZW0gfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZGVmaS9tb2RlbHMnO1xuXG5pbXBvcnQgeyBEZWZpVG9rZW5BdmF0YXJHcm91cCB9IGZyb20gJy4vRGVmaVRva2VuQXZhdGFyR3JvdXAnO1xuaW1wb3J0IHsgdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXIgfSBmcm9tICcuLi9ob29rcy91c2VDb252ZXJ0ZWRDdXJyZW5jeUZvcm1hdHRlcic7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIGl0ZW1zOiBEZWZpUmV3YXJkSXRlbVtdO1xufTtcblxuZXhwb3J0IGNvbnN0IERlZmlQb3J0Zm9saW9SZXdhcmRzID0gKHsgaXRlbXMgfTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCBmb3JtYXRWYWx1ZSA9IHVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyKCk7XG5cbiAgY29uc3QgbW9zdFRva2Vuc0luQW5JdGVtID0gdXNlTWVtbyhcbiAgICAoKSA9PlxuICAgICAgaXRlbXMucmVkdWNlKChtYXgsIGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KG1heCwgaXRlbS50b2tlbnMubGVuZ3RoID8/IDApO1xuICAgICAgfSwgMCksXG4gICAgW2l0ZW1zXSxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBnYXA6IDEuMjUgfX0+XG4gICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJ1dHRvblwiPnt0KCdQb29sJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYnV0dG9uXCI+e3QoJ1ZhbHVlJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgPC9TdGFjaz5cblxuICAgICAge2l0ZW1zLm1hcCgoeyB0b2tlbnMsIG5ldFVzZFZhbHVlIH0sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHN5bWJvbHMgPSB0b2tlbnMubWFwKCh7IHN5bWJvbCB9KSA9PiBzeW1ib2wpLmpvaW4oJyArICcpO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBrZXk9e2BkZWZpLXJld2FyZHMtJHtpbmRleH1gfVxuICAgICAgICAgICAgZGlyZWN0aW9uPVwicm93XCJcbiAgICAgICAgICAgIHN4PXt7IGdhcDogMSwganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWZpLWl0ZW1cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBnYXA6IDEsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgICA8RGVmaVRva2VuQXZhdGFyR3JvdXBcbiAgICAgICAgICAgICAgICBtYXhUb2tlbnM9e21vc3RUb2tlbnNJbkFuSXRlbX1cbiAgICAgICAgICAgICAgICB0b2tlbnM9e3Rva2Vuc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIGdhcDogMC41LFxuICAgICAgICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgICAgICAgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgZ2FwOiAxIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9e3N5bWJvbHN9XG4gICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgbm9XcmFwXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1pdGVtLXRva2VuLWxpc3RcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7c3ltYm9sc31cbiAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgZGF0YS10ZXN0aWQ9XCJkZWZpLWl0ZW0tdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgICAge2Zvcm1hdFZhbHVlKG5ldFVzZFZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICApO1xuICAgICAgfSl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgQXZhdGFyLCBTdGFjaywgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IERlZmlWZXN0aW5nSXRlbSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9kZWZpL21vZGVscyc7XG5cbmltcG9ydCB7IHVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyIH0gZnJvbSAnLi4vaG9va3MvdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXInO1xuXG50eXBlIFByb3BzID0ge1xuICBpdGVtczogRGVmaVZlc3RpbmdJdGVtW107XG59O1xuXG5leHBvcnQgY29uc3QgRGVmaVBvcnRmb2xpb1Zlc3RpbmcgPSAoeyBpdGVtcyB9OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGZvcm1hdFZhbHVlID0gdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXIoKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBnYXA6IDEuMjUgfX0+XG4gICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJ1dHRvblwiPnt0KCdQb29sJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYnV0dG9uXCI+e3QoJ1ZhbHVlJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgPC9TdGFjaz5cblxuICAgICAge2l0ZW1zLm1hcCgoeyB0b2tlbiwgbmV0VXNkVmFsdWUgfSwgaW5kZXgpID0+IChcbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAga2V5PXtgZGVmaS12ZXN0aW5nLSR7aW5kZXh9YH1cbiAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgIHN4PXt7IGdhcDogMSwganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1pdGVtXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBnYXA6IDEsIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JyB9fT5cbiAgICAgICAgICAgIDxBdmF0YXJcbiAgICAgICAgICAgICAgc3g9e3sgd2lkdGg6IDE2LCBoZWlnaHQ6IDE2IH19XG4gICAgICAgICAgICAgIHNyYz17dG9rZW4ubG9nb1VybH1cbiAgICAgICAgICAgICAgYWx0PXt0b2tlbi5uYW1lfVxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlZmktaXRlbS10b2tlbi1hdmF0YXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDAuNSB9fT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBkYXRhLXRlc3RpZD1cImRlZmktaXRlbS10b2tlbi1saXN0XCI+XG4gICAgICAgICAgICAgICAge3Rva2VuLnN5bWJvbH1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDAuNSwgdGV4dEFsaWduOiAnZW5kJyB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgZGF0YS10ZXN0aWQ9XCJkZWZpLWl0ZW0tdmFsdWVcIj5cbiAgICAgICAgICAgICAge2Zvcm1hdFZhbHVlKG5ldFVzZFZhbHVlKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgKSl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEF2YXRhcixcbiAgRXh0ZXJuYWxMaW5rSWNvbixcbiAgSWNvbkJ1dHRvbixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IG9wZW5OZXdUYWIgfSBmcm9tICdAc3JjL3V0aWxzL2V4dGVuc2lvblV0aWxzJztcbmltcG9ydCB7IERlZmlQcm90b2NvbCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9kZWZpL21vZGVscyc7XG5cbmltcG9ydCB7IHVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyIH0gZnJvbSAnLi4vaG9va3MvdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXInO1xuXG50eXBlIERlZmlQcm90b2NvbERldGFpbHNIZWFkZXJQcm9wcyA9IHtcbiAgcHJvdG9jb2w6IERlZmlQcm90b2NvbDtcbn07XG5cbmV4cG9ydCBjb25zdCBEZWZpUHJvdG9jb2xEZXRhaWxzSGVhZGVyID0gKHtcbiAgcHJvdG9jb2wsXG59OiBEZWZpUHJvdG9jb2xEZXRhaWxzSGVhZGVyUHJvcHMpID0+IHtcbiAgY29uc3QgZm9ybWF0VmFsdWUgPSB1c2VDb252ZXJ0ZWRDdXJyZW5jeUZvcm1hdHRlcigpO1xuXG4gIGNvbnN0IGdvVG9Qcm90b2NvbFBhZ2UgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKHByb3RvY29sPy5zaXRlVXJsKSB7XG4gICAgICBvcGVuTmV3VGFiKHsgdXJsOiBwcm90b2NvbD8uc2l0ZVVybCB9KTtcbiAgICB9XG4gIH0sIFtwcm90b2NvbF0pO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgc3g9e3tcbiAgICAgICAgYWxpZ25JdGVtczogJ3N0YXJ0JyxcbiAgICAgICAgZ2FwOiAyLFxuICAgICAgICBwdDogMixcbiAgICAgICAgcGI6IDEsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxBdmF0YXIgc3JjPXtwcm90b2NvbC5sb2dvVXJsfSBhbHQ9e3Byb3RvY29sLm5hbWV9IHN4PXt7IG10OiAwLjUgfX0gLz5cbiAgICAgIDxTdGFjayBzeD17eyBnYXA6IDEsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiIGRhdGEtdGVzdGlkPVwiZGVmaS1wcm90b2NvbC1oZWFkZXItbmFtZVwiPlxuICAgICAgICAgIHtwcm90b2NvbC5uYW1lfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIHtwcm90b2NvbC5jaGFpbklkICYmIChcbiAgICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3g9e3sgZ2FwOiAwLjc1LCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxBdmF0YXJcbiAgICAgICAgICAgICAgc3JjPXtwcm90b2NvbC5jaGFpbkxvZ29Vcmx9XG4gICAgICAgICAgICAgIGFsdD17cHJvdG9jb2wuY2hhaW5OYW1lfVxuICAgICAgICAgICAgICBzeD17eyB3aWR0aDogMTIsIGhlaWdodDogMTIgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIlxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlZmktcHJvdG9jb2wtaGVhZGVyLWNoYWluXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3Byb3RvY29sLmNoYWluTmFtZX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICApfVxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLCBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiYnV0dG9uXCJcbiAgICAgICAgICBzeD17eyBmb250U2l6ZTogMTQgfX1cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlZmktcHJvdG9jb2wtaGVhZGVyLXZhbHVlXCJcbiAgICAgICAgPlxuICAgICAgICAgIHtmb3JtYXRWYWx1ZShwcm90b2NvbC50b3RhbFVzZFZhbHVlKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgIGNvbXBvbmVudD1cImFcIlxuICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgc3g9e3sgbXI6IC0wLjUgfX1cbiAgICAgICAgICBvbkNsaWNrPXtnb1RvUHJvdG9jb2xQYWdlfVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZGVmaS1wcm90b2NvbC1oZWFkZXItZGFwcC1saW5rXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxFeHRlcm5hbExpbmtJY29uIHNpemU9ezE2fSAvPlxuICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgQXZhdGFyLFxuICBBdmF0YXJHcm91cCxcbiAgQXZhdGFyR3JvdXBQcm9wcyxcbiAgQXZhdGFyUHJvcHMsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBEZWZpVG9rZW4gfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZGVmaS9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxudHlwZSBQcm9wcyA9IEF2YXRhckdyb3VwUHJvcHMgJiB7XG4gIHRva2VuczogRGVmaVRva2VuW107XG4gIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiB0b2tlbnMgZGlzcGxheWVkIGJ5IG5laWdoYm9yaW5nIHBvcnRmb2xpbyBpdGVtcy5cbiAgLy8gVGhpcyBpcyBzbyB0aGF0IHdlIGdldCBhbiBlcXVhbCAoYnV0IHRoZSBuYXJyb3dlc3QgcG9zc2libGUpIGNvbHVtbiB3aWR0aFxuICAvLyBmb3IgYWxsIHBvcnRmb2xpbyBpdGVtcy5cbiAgbWF4VG9rZW5zOiBudW1iZXI7XG59O1xuXG5jb25zdCBNQVhfRElTUExBWUVEX0FWQVRBUlMgPSAzO1xuY29uc3QgQVZBVEFSX1NJWkUgPSAxNjtcbmNvbnN0IEFWQVRBUl9QUk9QUzogQXZhdGFyUHJvcHMgPSB7XG4gIGltZ1Byb3BzOiB7XG4gICAgbG9hZGluZzogJ2xhenknLFxuICB9LFxuICBzeDoge1xuICAgIHdpZHRoOiBBVkFUQVJfU0laRSxcbiAgICBoZWlnaHQ6IEFWQVRBUl9TSVpFLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IERlZmlUb2tlbkF2YXRhckdyb3VwID0gKHsgdG9rZW5zLCBtYXhUb2tlbnMsIC4uLnJlc3QgfTogUHJvcHMpID0+IHtcbiAgY29uc3Qgd2lkdGggPSB1c2VNZW1vKFxuICAgICgpID0+XG4gICAgICBBVkFUQVJfU0laRSArXG4gICAgICAoTWF0aC5taW4oTUFYX0RJU1BMQVlFRF9BVkFUQVJTLCBtYXhUb2tlbnMpIC0gMSkgKiAoQVZBVEFSX1NJWkUgLyAyKSxcbiAgICBbbWF4VG9rZW5zXSxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxBdmF0YXJHcm91cFxuICAgICAgey4uLnJlc3R9XG4gICAgICBtYXg9e01BWF9ESVNQTEFZRURfQVZBVEFSU31cbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoLFxuICAgICAgICBnYXA6IDAuNSxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzdGFydCcsXG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICB9fVxuICAgICAgc2xvdFByb3BzPXt7XG4gICAgICAgIGFkZGl0aW9uYWxBdmF0YXI6IHtcbiAgICAgICAgICAuLi5BVkFUQVJfUFJPUFMsXG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7dG9rZW5zLm1hcCgodG9rZW4pID0+IChcbiAgICAgICAgPEF2YXRhclxuICAgICAgICAgIHsuLi5BVkFUQVJfUFJPUFN9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWZpLWl0ZW0tdG9rZW4tYXZhdGFyXCJcbiAgICAgICAgICBrZXk9e3Rva2VuLnN5bWJvbH1cbiAgICAgICAgICBzcmM9e3Rva2VuLmxvZ29Vcmx9XG4gICAgICAgICAgYWx0PXt0b2tlbi5uYW1lfVxuICAgICAgICAvPlxuICAgICAgKSl9XG4gICAgPC9BdmF0YXJHcm91cD5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyB1c2VDdXJyZW5jaWVzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ3VycmVuY2llc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZVNldHRpbmdzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvU2V0dGluZ3NQcm92aWRlcic7XG5pbXBvcnQgeyBnZXRDdXJyZW5jeUZvcm1hdHRlciB9IGZyb20gJ0BzcmMvY29udGV4dHMvdXRpbHMvZ2V0Q3VycmVuY3lGb3JtYXR0ZXInO1xuXG50eXBlIEN1cnJlbmN5Q29udmVydGVyID0gKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZztcblxuZXhwb3J0IGNvbnN0IHVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyID0gKFxuICBzb3VyY2VDdXJyZW5jeSA9ICdVU0QnLFxuKTogQ3VycmVuY3lDb252ZXJ0ZXIgPT4ge1xuICBjb25zdCB7IGNvbnZlcnQsIGhhc0V4Y2hhbmdlUmF0ZSB9ID0gdXNlQ3VycmVuY2llc0NvbnRleHQoKTtcbiAgY29uc3QgeyBjdXJyZW5jeTogdGFyZ2V0Q3VycmVuY3ksIGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgY29uc3QgZmFsbGJhY2tGb3JtYXR0ZXIgPSB1c2VNZW1vKFxuICAgICgpID0+IGdldEN1cnJlbmN5Rm9ybWF0dGVyKHNvdXJjZUN1cnJlbmN5KSxcbiAgICBbc291cmNlQ3VycmVuY3ldLFxuICApO1xuICBjb25zdCBjYW5Db252ZXJ0ID0gdXNlTWVtbyhcbiAgICAoKSA9PiBoYXNFeGNoYW5nZVJhdGUoc291cmNlQ3VycmVuY3ksIHRhcmdldEN1cnJlbmN5KSxcbiAgICBbc291cmNlQ3VycmVuY3ksIHRhcmdldEN1cnJlbmN5LCBoYXNFeGNoYW5nZVJhdGVdLFxuICApO1xuICBjb25zdCBuZWVkc0NvbnZlcnNpb24gPSBjYW5Db252ZXJ0ICYmIHRhcmdldEN1cnJlbmN5ICE9PSBzb3VyY2VDdXJyZW5jeTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFuZWVkc0NvbnZlcnNpb24pIHtcbiAgICAgIHJldHVybiBmYWxsYmFja0Zvcm1hdHRlcjtcbiAgICB9XG5cbiAgICByZXR1cm4gKHZhbHVlOiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IGNvbnZlcnRlZCA9IGNvbnZlcnQoe1xuICAgICAgICBhbW91bnQ6IHZhbHVlLFxuICAgICAgICBmcm9tOiBzb3VyY2VDdXJyZW5jeSxcbiAgICAgICAgdG86IHRhcmdldEN1cnJlbmN5LFxuICAgICAgfSkgYXMgbnVtYmVyO1xuXG4gICAgICByZXR1cm4gY3VycmVuY3lGb3JtYXR0ZXIoY29udmVydGVkKTtcbiAgICB9O1xuICB9LCBbXG4gICAgY29udmVydCxcbiAgICBjdXJyZW5jeUZvcm1hdHRlcixcbiAgICBmYWxsYmFja0Zvcm1hdHRlcixcbiAgICBuZWVkc0NvbnZlcnNpb24sXG4gICAgc291cmNlQ3VycmVuY3ksXG4gICAgdGFyZ2V0Q3VycmVuY3ksXG4gIF0pO1xufTtcbiIsImltcG9ydCB7IGZvcm1hdEFuZExvZyB9IGZyb20gJy4vbG9nZ2luZyc7XG5cbmV4cG9ydCBjb25zdCBzdW1CeVByb3BlcnR5ID0gPE8gZXh0ZW5kcyBSZWNvcmQ8VCwgdW5rbm93bj4sIFQgZXh0ZW5kcyBrZXlvZiBPPihcbiAgdmFsdWVzOiBPW10sXG4gIGtleTogVCxcbik6IG51bWJlciA9PiB7XG4gIHJldHVybiB2YWx1ZXMucmVkdWNlKChhY2MsIGN1cnIsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBjdXJyW2tleV07XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGFjYyArIHZhbHVlO1xuICAgIH1cblxuICAgIC8vIExvZyBvdXQgaW5zdGFuY2VzIHdoZW4gcHJvdmlkZWQgbGlzdCBjb250YWlucyBub24tbnVtZXJpYyB2YWx1ZXNcbiAgICBmb3JtYXRBbmRMb2coXG4gICAgICBgc3VtQnlQcm9wZXJ0eSgpOiBvYmplY3QgYXQgaW5kZXggJHtpbmRleH0gd2FzIGlnbm9yZWQuIFByb3BlcnR5ICR7U3RyaW5nKFxuICAgICAgICBrZXksXG4gICAgICApfSBkb2VzIG5vdCBjb250YWluIGEgbnVtYmVyOmAsXG4gICAgICBjdXJyLFxuICAgICk7XG5cbiAgICByZXR1cm4gYWNjO1xuICB9LCAwKTtcbn07XG4iXSwibmFtZXMiOlsiUGFnZVRpdGxlIiwiUGFnZVRpdGxlVmFyaWFudCIsInQiLCJ0cmFuc2xhdGUiLCJBbGVydENpcmNsZUljb24iLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJ1c2VUcmFuc2xhdGlvbiIsIkZ1bmN0aW9uTmFtZXMiLCJnZXRUcmFuc2xhdGVkRnVuY3Rpb25OYW1lIiwibmFtZSIsInRyYW5zbGF0aW9ucyIsIkJSSURHRSIsIlNXQVAiLCJTRU5EIiwiQlVZIiwiREVGSSIsIktFWVNUT05FIiwiVE9LRU5fREVUQUlMUyIsIkZ1bmN0aW9uSXNPZmZsaW5lIiwiZnVuY3Rpb25OYW1lIiwiaGlkZVBhZ2VUaXRsZSIsImNoaWxkcmVuIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJoZWlnaHQiLCJ3aWR0aCIsInZhcmlhbnQiLCJQUklNQVJZIiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZmxleEdyb3ciLCJzaXplIiwibWIiLCJtdCIsImFsaWduIiwiY29sb3IiLCJ1c2VDYWxsYmFjayIsInVzZUVmZmVjdCIsInVzZUhpc3RvcnkiLCJ1c2VQYXJhbXMiLCJCb3giLCJCdXR0b24iLCJDYXJkIiwiQ2FyZENvbnRlbnQiLCJDaXJjdWxhclByb2dyZXNzIiwiRGl2aWRlciIsIkV4dGVybmFsTGlua0ljb24iLCJTY3JvbGxiYXJzIiwib3Blbk5ld1RhYiIsInVzZURlZmlDb250ZXh0IiwidXNlRmVhdHVyZUZsYWdDb250ZXh0IiwiRGVmaUVycm9yU3RhdGUiLCJEZWZpUG9ydGZvbGlvSXRlbUdyb3VwIiwiRGVmaVByb3RvY29sRGV0YWlsc0hlYWRlciIsIkZlYXR1cmVHYXRlcyIsIkRlZmlQcm90b2NvbERldGFpbHMiLCJwcm90b2NvbElkIiwiaGlzdG9yeSIsImZlYXR1cmVGbGFncyIsImhhc0Vycm9yIiwiaXNMb2FkaW5nIiwicG9ydGZvbGlvIiwicmVmcmVzaCIsInByb3RvY29sIiwicHJvdG9jb2xzIiwiZmluZCIsInAiLCJpZCIsImdvVG9Qcm90b2NvbFBhZ2UiLCJzaXRlVXJsIiwidXJsIiwicHQiLCJwYiIsInB4IiwiRnJhZ21lbnQiLCJTRUNPTkRBUlkiLCJtYXJnaW4iLCJvdmVyZmxvdyIsInB5IiwibXkiLCJncm91cHMiLCJsZW5ndGgiLCJnYXAiLCJvbkNsaWNrIiwicmVwbGFjZSIsImRpdmlkZXIiLCJtYXAiLCJncm91cCIsImtleSIsImZsZXhTaHJpbmsiLCJmdWxsV2lkdGgiLCJzdGFydEljb24iLCJwcm90b2NvbE5hbWUiLCJwcm9wcyIsIl9leHRlbmRzIiwic3VtQnlQcm9wZXJ0eSIsInVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyIiwiRGVmaVRva2VuQXZhdGFyR3JvdXAiLCJ1c2VNZW1vIiwiRGVmaVBvcnRmb2xpb0NvbW1vbiIsIml0ZW1zIiwiaGVhZGVyIiwiZm9ybWF0VmFsdWUiLCJtb3N0VG9rZW5zSW5Bbkl0ZW0iLCJNYXRoIiwibWF4IiwiaXRlbSIsInN1cHBseVRva2VucyIsImRpcmVjdGlvbiIsInJld2FyZFRva2VucyIsImluZGV4IiwiaGFzUmV3YXJkcyIsInN1cHBsaWVkVmFsdWUiLCJyZXdhcmRlZFZhbHVlIiwic3ltYm9scyIsInN5bWJvbCIsImpvaW4iLCJ0b2tlbnMiLCJtYXhUb2tlbnMiLCJ0ZXh0T3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwidGl0bGUiLCJub1dyYXAiLCJUb29sdGlwIiwiRGVmaVBvcnRmb2xpb0luc3VyYW5jZSIsImRlc2NyaXB0aW9uIiwibmV0VXNkVmFsdWUiLCJ3cmFwV2l0aFNwYW4iLCJ0ZXh0QWxpZ24iLCJEZWZpSXRlbVR5cGUiLCJEZWZpUG9ydGZvbGlvTGVuZGluZyIsIkRlZmlQb3J0Zm9saW9SZXdhcmRzIiwiRGVmaVBvcnRmb2xpb1Zlc3RpbmciLCJEZWZpUG9ydGZvbGlvUGVycGV0dWFsIiwiaXRlbXNCeVR5cGUiLCJyZWR1Y2UiLCJncm91cGVkIiwidHlwZSIsInB1c2giLCJPYmplY3QiLCJlbnRyaWVzIiwiTGVuZGluZyIsIlJld2FyZCIsIlZlc3RpbmciLCJJbnN1cmFuY2VCdXllciIsIlBlcnBldHVhbCIsIkF2YXRhciIsImJvcnJvd1Rva2VucyIsIkRlZmlMZW5kaW5nU2VjdGlvbiIsImhlYWRlcnMiLCJ0b2tlbiIsInNyYyIsImxvZ29VcmwiLCJhbHQiLCJ1c2RWYWx1ZSIsIkdyaWQiLCJHcmlkQ2VsbCIsImRpc3BsYXkiLCJBcnJheSIsImlzQXJyYXkiLCJjb250YWluZXIiLCJzcGFjaW5nIiwieHMiLCJtYXJnaW5Ub2tlbiIsInBvc2l0aW9uVG9rZW4iLCJwcm9maXRVc2RWYWx1ZSIsIkljb25CdXR0b24iLCJjaGFpbklkIiwiY2hhaW5Mb2dvVXJsIiwiY2hhaW5OYW1lIiwiZm9udFNpemUiLCJ0b3RhbFVzZFZhbHVlIiwiY29tcG9uZW50IiwibXIiLCJBdmF0YXJHcm91cCIsIk1BWF9ESVNQTEFZRURfQVZBVEFSUyIsIkFWQVRBUl9TSVpFIiwiQVZBVEFSX1BST1BTIiwiaW1nUHJvcHMiLCJsb2FkaW5nIiwicmVzdCIsIm1pbiIsInNsb3RQcm9wcyIsImFkZGl0aW9uYWxBdmF0YXIiLCJzdHlsZSIsInVzZUN1cnJlbmNpZXNDb250ZXh0IiwidXNlU2V0dGluZ3NDb250ZXh0IiwiZ2V0Q3VycmVuY3lGb3JtYXR0ZXIiLCJzb3VyY2VDdXJyZW5jeSIsImNvbnZlcnQiLCJoYXNFeGNoYW5nZVJhdGUiLCJjdXJyZW5jeSIsInRhcmdldEN1cnJlbmN5IiwiY3VycmVuY3lGb3JtYXR0ZXIiLCJmYWxsYmFja0Zvcm1hdHRlciIsImNhbkNvbnZlcnQiLCJuZWVkc0NvbnZlcnNpb24iLCJ2YWx1ZSIsImNvbnZlcnRlZCIsImFtb3VudCIsImZyb20iLCJ0byIsImZvcm1hdEFuZExvZyIsInZhbHVlcyIsImFjYyIsImN1cnIiLCJTdHJpbmciXSwic291cmNlUm9vdCI6IiJ9