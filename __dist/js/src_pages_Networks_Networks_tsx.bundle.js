"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Networks_Networks_tsx"],{

/***/ "./src/components/common/EmptyContent.tsx":
/*!************************************************!*\
  !*** ./src/components/common/EmptyContent.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EmptyContent": () => (/* binding */ EmptyContent)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const commonTransitionProps = {
  timeout: 500,
  easing: 'ease-in-out',
  appear: true
};
function EmptyContent({
  text
}) {
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonTransitionProps, {
    in: true
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: '1',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    "data-testid": "empty-list-text",
    variant: "body2"
  }, text)));
}

/***/ }),

/***/ "./src/hooks/usePersistedTabs.ts":
/*!***************************************!*\
  !*** ./src/hooks/usePersistedTabs.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "usePersistedTabs": () => (/* binding */ usePersistedTabs)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");


const usePersistedTabs = (defaultTab, tabParam = 'activeTab') => {
  const {
    search,
    pathname
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useHistory)();
  const tabFromUrl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const params = new URLSearchParams(search);
    const tab = params.get(tabParam);
    if (tab !== null) {
      return Number(tab);
    }
    return null;
  }, [search, tabParam]);
  const setActiveTab = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(tab => {
    // Avoid unnecessary re-renders
    if (tab === tabFromUrl) {
      return;
    }
    history.replace({
      pathname: pathname,
      search: `?${new URLSearchParams({
        [tabParam]: String(tab)
      }).toString()}`
    });
  }, [history, tabFromUrl, tabParam, pathname]);
  return {
    activeTab: tabFromUrl ?? defaultTab,
    setActiveTab
  };
};

/***/ }),

/***/ "./src/pages/Networks/CustomsTab.tsx":
/*!*******************************************!*\
  !*** ./src/pages/Networks/CustomsTab.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CustomsTab": () => (/* binding */ CustomsTab)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_components_common_EmptyContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/EmptyContent */ "./src/components/common/EmptyContent.tsx");
/* harmony import */ var _common_NetworkList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/NetworkList */ "./src/pages/Networks/common/NetworkList.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function CustomsTab({
  searchTerm
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const {
    customNetworks
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__.useNetworkContext)();
  const filteredCustomNetworks = customNetworks.filter(networkItem => searchTerm && networkItem.chainName.match(searchTerm));
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      height: 1,
      pb: 1
    }
  }, !filteredCustomNetworks.length && /*#__PURE__*/React.createElement(_src_components_common_EmptyContent__WEBPACK_IMPORTED_MODULE_1__.EmptyContent, {
    text: t('There is no search result.')
  }), /*#__PURE__*/React.createElement(_common_NetworkList__WEBPACK_IMPORTED_MODULE_2__.NetworkList, {
    networkList: filteredCustomNetworks
  }));
}

/***/ }),

/***/ "./src/pages/Networks/FavoritesTab.tsx":
/*!*********************************************!*\
  !*** ./src/pages/Networks/FavoritesTab.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FavoritesTab": () => (/* binding */ FavoritesTab)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_components_common_EmptyContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/EmptyContent */ "./src/components/common/EmptyContent.tsx");
/* harmony import */ var _common_NetworkList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/NetworkList */ "./src/pages/Networks/common/NetworkList.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function FavoritesTab({
  searchTerm
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const {
    favoriteNetworks
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__.useNetworkContext)();
  const filteredNetworks = favoriteNetworks.filter(networkItem => searchTerm && networkItem.chainName.match(searchTerm));
  const hasFavorites = favoriteNetworks.length > 0;
  const hasSearchResults = filteredNetworks.length > 0;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      width: 1,
      height: 1,
      pb: 1
    }
  }, !hasFavorites && /*#__PURE__*/React.createElement(_src_components_common_EmptyContent__WEBPACK_IMPORTED_MODULE_1__.EmptyContent, {
    text: t("You don't have any favorite item yet.")
  }), hasFavorites && !hasSearchResults && /*#__PURE__*/React.createElement(_src_components_common_EmptyContent__WEBPACK_IMPORTED_MODULE_1__.EmptyContent, {
    text: t('There is no search result.')
  }), /*#__PURE__*/React.createElement(_common_NetworkList__WEBPACK_IMPORTED_MODULE_2__.NetworkList, {
    networkList: filteredNetworks
  }));
}

/***/ }),

/***/ "./src/pages/Networks/Networks.tsx":
/*!*****************************************!*\
  !*** ./src/pages/Networks/Networks.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkTab": () => (/* binding */ NetworkTab),
/* harmony export */   "Networks": () => (/* binding */ Networks)
/* harmony export */ });
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_hooks_usePersistedTabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/usePersistedTabs */ "./src/hooks/usePersistedTabs.ts");
/* harmony import */ var _CustomsTab__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CustomsTab */ "./src/pages/Networks/CustomsTab.tsx");
/* harmony import */ var _FavoritesTab__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FavoritesTab */ "./src/pages/Networks/FavoritesTab.tsx");
/* harmony import */ var _NetworksTab__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./NetworksTab */ "./src/pages/Networks/NetworksTab.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










let NetworkTab = /*#__PURE__*/function (NetworkTab) {
  NetworkTab[NetworkTab["Favorites"] = 0] = "Favorites";
  NetworkTab[NetworkTab["All"] = 1] = "All";
  NetworkTab[NetworkTab["Custom"] = 2] = "Custom";
  return NetworkTab;
}({});
const NetworkTabPanel = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.TabPanel)`
  flex-grow: 1;
`;
function Networks() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_9__.useTranslation)();
  const [searchTerm, setSearchTerm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_1__.useAnalyticsContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useHistory)();
  const {
    activeTab,
    setActiveTab
  } = (0,_src_hooks_usePersistedTabs__WEBPACK_IMPORTED_MODULE_3__.usePersistedTabs)(NetworkTab.Favorites);
  const term = new RegExp(searchTerm, 'gi');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      width: 1,
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__.PageTitle, {
    margin: "12px 0"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    direction: "row",
    sx: {
      alignItems: 'center',
      justifyContent: 'space-between',
      pr: 1
    }
  }, t('Networks'), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
    "data-testid": "add-network-button",
    onClick: () => history.push('/networks/add')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.PlusIcon, {
    size: 24
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      py: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.SearchBar, {
    sx: {
      width: 1
    },
    onChange: e => setSearchTerm(e.target.value),
    "data-testid": "network-search"
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Tabs, {
    size: "medium",
    variant: "fullWidth",
    indicatorColor: "secondary",
    value: activeTab,
    onChange: (_, tab) => {
      if (tab === NetworkTab.Custom) {
        capture('NetworkCustomTabClicked');
      } else if (tab === NetworkTab.Favorites) {
        capture('NetworkFavoritesTabClicked');
      } else {
        capture('NetworkNetworksTabClicked');
      }
      setActiveTab(tab);
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Tab, {
    label: t('Favorites'),
    value: NetworkTab.Favorites
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Tab, {
    label: t('Networks'),
    value: NetworkTab.All
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Tab, {
    label: t('Custom'),
    value: NetworkTab.Custom
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexGrow: 1,
      mt: -0.25,
      pt: 1,
      borderTop: 1,
      borderColor: 'divider'
    }
  }, /*#__PURE__*/React.createElement(NetworkTabPanel, {
    value: activeTab,
    index: NetworkTab.Favorites
  }, /*#__PURE__*/React.createElement(_FavoritesTab__WEBPACK_IMPORTED_MODULE_5__.FavoritesTab, {
    searchTerm: term
  })), /*#__PURE__*/React.createElement(NetworkTabPanel, {
    value: activeTab,
    index: NetworkTab.All
  }, /*#__PURE__*/React.createElement(_NetworksTab__WEBPACK_IMPORTED_MODULE_6__.NetworksTab, {
    searchTerm: term
  })), /*#__PURE__*/React.createElement(NetworkTabPanel, {
    value: activeTab,
    index: NetworkTab.Custom
  }, /*#__PURE__*/React.createElement(_CustomsTab__WEBPACK_IMPORTED_MODULE_4__.CustomsTab, {
    searchTerm: term
  }))));
}

/***/ }),

/***/ "./src/pages/Networks/NetworksTab.tsx":
/*!********************************************!*\
  !*** ./src/pages/Networks/NetworksTab.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworksTab": () => (/* binding */ NetworksTab)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_components_common_EmptyContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/EmptyContent */ "./src/components/common/EmptyContent.tsx");
/* harmony import */ var _common_NetworkList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/NetworkList */ "./src/pages/Networks/common/NetworkList.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function NetworksTab({
  searchTerm
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const {
    networks
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__.useNetworkContext)();
  const filteredNetworks = networks.filter(networkItem => searchTerm && networkItem.chainName.match(searchTerm));
  const hasSearchResults = filteredNetworks.length > 0;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      width: 1,
      height: 1,
      pb: 1
    }
  }, hasSearchResults ? /*#__PURE__*/React.createElement(_common_NetworkList__WEBPACK_IMPORTED_MODULE_2__.NetworkList, {
    networkList: filteredNetworks
  }) : /*#__PURE__*/React.createElement(_src_components_common_EmptyContent__WEBPACK_IMPORTED_MODULE_1__.EmptyContent, {
    text: t('There is no search result.')
  }));
}

/***/ }),

/***/ "./src/pages/Networks/common/NetworkList.tsx":
/*!***************************************************!*\
  !*** ./src/pages/Networks/common/NetworkList.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkList": () => (/* binding */ NetworkList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-transition-group */ "./node_modules/react-transition-group/esm/TransitionGroup.js");
/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-transition-group */ "./node_modules/react-transition-group/esm/CSSTransition.js");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/NetworkLogo */ "./src/components/common/NetworkLogo.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_utils_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/ipsfResolverWithFallback */ "./src/utils/ipsfResolverWithFallback.ts");
/* harmony import */ var _NetworkListItem__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NetworkListItem */ "./src/pages/Networks/common/NetworkListItem.ts");
/* harmony import */ var _NetworkLogo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./NetworkLogo */ "./src/pages/Networks/common/NetworkLogo.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");












function NetworkList({
  networkList
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const {
    network,
    setNetwork,
    removeFavoriteNetwork,
    isFavoriteNetwork,
    addFavoriteNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__.useNetworkContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_8__.useHistory)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__["default"])();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const [favoritedItem, setFavoritedItem] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  if (!networkList.length) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_11__["default"], {
    component: null
  }, networkList.map((networkItem, index) => {
    const isFavorite = isFavoriteNetwork(networkItem.chainId);
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Collapse, {
      key: networkItem.chainId,
      className: "item"
    }, index > 0 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Divider, {
      sx: {
        mx: 2
      }
    }), /*#__PURE__*/React.createElement(_NetworkListItem__WEBPACK_IMPORTED_MODULE_5__.NetworkListItem, {
      onClick: () => {
        setNetwork(networkItem);
        _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__["default"].success(t('Active Network has changed!'), {
          duration: 2000
        });
        history.push('/home');
      },
      "data-testid": `network-li-${index}`,
      isActive: networkItem.chainId === network?.chainId
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      direction: "row",
      sx: {
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement(_NetworkLogo__WEBPACK_IMPORTED_MODULE_6__.NetworkLogoContainer, null, /*#__PURE__*/React.createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_13__["default"], {
      key: networkItem.chainId,
      timeout: 500,
      classNames: "item",
      appear: true,
      in: favoritedItem === networkItem.chainId
    }, networkItem.logoUri ? /*#__PURE__*/React.createElement(_NetworkLogo__WEBPACK_IMPORTED_MODULE_6__.AnimatedNetworkLogo, {
      src: (0,_src_utils_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_4__.ipfsResolverWithFallback)(networkItem.logoUri),
      position: index + 1,
      isFavorited: index === favoritedItem
    }) : /*#__PURE__*/React.createElement(_NetworkLogo__WEBPACK_IMPORTED_MODULE_6__.AnimatedGlobeIconContainer, {
      position: index + 1,
      isFavorited: index === favoritedItem
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.GlobeIcon, {
      width: "100%",
      height: "100%",
      color: theme.palette.common.white,
      size: 32
    }))), /*#__PURE__*/React.createElement(_src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_1__.NetworkLogo, {
      src: networkItem.logoUri,
      width: "32px",
      height: "32px",
      position: "absolute",
      defaultSize: 32
    })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, {
      variant: "body1",
      sx: {
        fontWeight: 'fontWeightSemibold'
      }
    }, networkItem.chainName)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      direction: "row",
      sx: {
        flexShrink: 0,
        alignItems: 'center'
      }
    }, networkItem.chainId !== _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_14__.ChainId.AVALANCHE_MAINNET_ID && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.IconButton, {
      onClick: e => {
        e.stopPropagation();
        if (!isFavorite) {
          setFavoritedItem(networkItem.chainId);
          addFavoriteNetwork(networkItem.chainId);
        } else {
          setFavoritedItem(null);
          removeFavoriteNetwork(networkItem.chainId);
        }
      },
      "data-testid": "favorite-network"
    }, isFavorite ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.StarFilledIcon, {
      size: 24
    }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.StarIcon, {
      size: 24
    })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.IconButton, {
      onClick: e => {
        e.stopPropagation();
        capture('NetworkDetailsClicked', {
          chainId: networkItem.chainId
        });
        history.push(`/networks/details/${networkItem.chainId}`);
      },
      "data-testid": "network-details"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.InfoCircleIcon, {
      size: 24
    })))));
  })));
}

/***/ }),

/***/ "./src/pages/Networks/common/NetworkListItem.ts":
/*!******************************************************!*\
  !*** ./src/pages/Networks/common/NetworkListItem.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkListItem": () => (/* binding */ NetworkListItem)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");

const NetworkListItem = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
  shouldForwardProp: prop => prop !== 'isActive'
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.15s ease-in-out;
  background-color: ${({
  isActive,
  theme
}) => isActive ? `${theme.palette.grey[900]}80` : 'inherit'};

  :hover {
    background-color: ${({
  theme
}) => `${theme.palette.grey[900]}80`};
  }
`;

/***/ }),

/***/ "./src/pages/Networks/common/NetworkLogo.ts":
/*!**************************************************!*\
  !*** ./src/pages/Networks/common/NetworkLogo.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnimatedGlobeIconContainer": () => (/* binding */ AnimatedGlobeIconContainer),
/* harmony export */   "AnimatedNetworkLogo": () => (/* binding */ AnimatedNetworkLogo),
/* harmony export */   "NetworkLogoContainer": () => (/* binding */ NetworkLogoContainer)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");

const NetworkLogoContainer = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])('div')`
  width: 32px;
  height: 32px;
  position: relative;
`;
const AnimatedGlobeIconContainer = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])('div')`
  width: 32px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &.item-enter {
    opacity: 1;
    transform: scale(1);
    top: 0;
    left: 0;
  }
  &.item-enter-active {
    opacity: 0;
    top: ${({
  position
}) => position ? `-${position * 65}px` : 0};
    left: 40px;
    transform: scale(0);
    transition:
      top 500ms ease-in-out,
      opacity 750ms ease-in-out,
      left 500ms ease-in-out,
      transform 550ms ease-in-out;
  }
`;
const AnimatedNetworkLogo = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])('img')`
  width: 32px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &.item-enter {
    opacity: 1;
    transform: scale(1);
    top: 0;
    left: 0;
  }
  &.item-enter-active {
    opacity: 0;
    top: ${({
  position
}) => position ? `-${position * 65}px` : 0};
    left: 40px;
    transform: scale(0);
    transition:
      top 500ms ease-in-out,
      opacity 750ms ease-in-out,
      left 500ms ease-in-out,
      transform 550ms ease-in-out;
  }
`;

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX05ldHdvcmtzX05ldHdvcmtzX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBc0U7QUFNdEUsTUFBTUcscUJBQXFCLEdBQUc7RUFDNUJDLE9BQU8sRUFBRSxHQUFHO0VBQ1pDLE1BQU0sRUFBRSxhQUFhO0VBQ3JCQyxNQUFNLEVBQUU7QUFDVixDQUFDO0FBRU0sU0FBU0MsWUFBWUEsQ0FBQztFQUFFQztBQUF3QixDQUFDLEVBQUU7RUFDeEQsb0JBQ0VDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVCw2REFBSSxFQUFBVSwwRUFBQSxLQUFLUixxQkFBcUI7SUFBRVMsRUFBRTtFQUFBLGlCQUNqQ0gsS0FBQSxDQUFBQyxhQUFBLENBQUNWLDhEQUFLO0lBQ0phLEVBQUUsRUFBRTtNQUNGQyxVQUFVLEVBQUUsUUFBUTtNQUNwQkMsY0FBYyxFQUFFLFFBQVE7TUFDeEJDLFFBQVEsRUFBRSxHQUFHO01BQ2JDLE1BQU0sRUFBRTtJQUNWO0VBQUUsZ0JBRUZSLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUixtRUFBVTtJQUFDLGVBQVksaUJBQWlCO0lBQUNnQixPQUFPLEVBQUM7RUFBTyxHQUN0RFYsSUFBSSxDQUNNLENBQ1AsQ0FDSDtBQUVYOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0I2QztBQUNjO0FBRXBELE1BQU1lLGdCQUFnQixHQUFHQSxDQUM5QkMsVUFBa0IsRUFDbEJDLFFBQVEsR0FBRyxXQUFXLEtBQ25CO0VBQ0gsTUFBTTtJQUFFQyxNQUFNO0lBQUVDO0VBQVMsQ0FBQyxHQUFHTCw2REFBVyxFQUFFO0VBQzFDLE1BQU1NLE9BQU8sR0FBR1AsNERBQVUsRUFBRTtFQUU1QixNQUFNUSxVQUFVLEdBQUdULDhDQUFPLENBQUMsTUFBTTtJQUMvQixNQUFNVSxNQUFNLEdBQUcsSUFBSUMsZUFBZSxDQUFDTCxNQUFNLENBQUM7SUFDMUMsTUFBTU0sR0FBRyxHQUFHRixNQUFNLENBQUNHLEdBQUcsQ0FBQ1IsUUFBUSxDQUFDO0lBRWhDLElB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RUFBRTZFO0FBQVMsQ0FBQyxLQUFNQSxRQUFRLEdBQUksSUFBR0EsUUFBUSxHQUFHLEVBQUcsSUFBRyxHQUFHLENBQUc7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0VtcHR5Q29udGVudC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VQZXJzaXN0ZWRUYWJzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvQ3VzdG9tc1RhYi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9OZXR3b3Jrcy9GYXZvcml0ZXNUYWIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvTmV0d29ya3MudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvTmV0d29ya3NUYWIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvY29tbW9uL05ldHdvcmtMaXN0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL05ldHdvcmtzL2NvbW1vbi9OZXR3b3JrTGlzdEl0ZW0udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9OZXR3b3Jrcy9jb21tb24vTmV0d29ya0xvZ28udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIEdyb3csIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbnRlcmZhY2UgRW1wdHlDb250ZW50UHJvcHMge1xuICB0ZXh0OiBzdHJpbmc7XG59XG5cbmNvbnN0IGNvbW1vblRyYW5zaXRpb25Qcm9wcyA9IHtcbiAgdGltZW91dDogNTAwLFxuICBlYXNpbmc6ICdlYXNlLWluLW91dCcsXG4gIGFwcGVhcjogdHJ1ZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBFbXB0eUNvbnRlbnQoeyB0ZXh0IH06IEVtcHR5Q29udGVudFByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPEdyb3cgey4uLmNvbW1vblRyYW5zaXRpb25Qcm9wc30gaW4+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgZmxleEdyb3c6ICcxJyxcbiAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFR5cG9ncmFwaHkgZGF0YS10ZXN0aWQ9XCJlbXB0eS1saXN0LXRleHRcIiB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICB7dGV4dH1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPC9TdGFjaz5cbiAgICA8L0dyb3c+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUhpc3RvcnksIHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5cbmV4cG9ydCBjb25zdCB1c2VQZXJzaXN0ZWRUYWJzID0gKFxuICBkZWZhdWx0VGFiOiBudW1iZXIsXG4gIHRhYlBhcmFtID0gJ2FjdGl2ZVRhYicsXG4pID0+IHtcbiAgY29uc3QgeyBzZWFyY2gsIHBhdGhuYW1lIH0gPSB1c2VMb2NhdGlvbigpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuXG4gIGNvbnN0IHRhYkZyb21VcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHNlYXJjaCk7XG4gICAgY29uc3QgdGFiID0gcGFyYW1zLmdldCh0YWJQYXJhbSk7XG5cbiAgICBpZiAodGFiICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRhYik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sIFtzZWFyY2gsIHRhYlBhcmFtXSk7XG5cbiAgY29uc3Qgc2V0QWN0aXZlVGFiID0gdXNlQ2FsbGJhY2soXG4gICAgKHRhYjogbnVtYmVyKSA9PiB7XG4gICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSByZS1yZW5kZXJzXG4gICAgICBpZiAodGFiID09PSB0YWJGcm9tVXJsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaGlzdG9yeS5yZXBsYWNlKHtcbiAgICAgICAgcGF0aG5hbWU6IHBhdGhuYW1lLFxuICAgICAgICBzZWFyY2g6IGA/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHtcbiAgICAgICAgICBbdGFiUGFyYW1dOiBTdHJpbmcodGFiKSxcbiAgICAgICAgfSkudG9TdHJpbmcoKX1gLFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBbaGlzdG9yeSwgdGFiRnJvbVVybCwgdGFiUGFyYW0sIHBhdGhuYW1lXSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGFjdGl2ZVRhYjogdGFiRnJvbVVybCA/PyBkZWZhdWx0VGFiLFxuICAgIHNldEFjdGl2ZVRhYixcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBTdGFjayB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IEVtcHR5Q29udGVudCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRW1wdHlDb250ZW50JztcblxuaW1wb3J0IHsgTmV0d29ya0xpc3QgfSBmcm9tICcuL2NvbW1vbi9OZXR3b3JrTGlzdCc7XG5pbXBvcnQgeyBOZXR3b3JrVGFiUHJvcHMgfSBmcm9tICcuL05ldHdvcmtzJztcblxuZXhwb3J0IGZ1bmN0aW9uIEN1c3RvbXNUYWIoeyBzZWFyY2hUZXJtIH06IE5ldHdvcmtUYWJQcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY3VzdG9tTmV0d29ya3MgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG5cbiAgY29uc3QgZmlsdGVyZWRDdXN0b21OZXR3b3JrcyA9IGN1c3RvbU5ldHdvcmtzLmZpbHRlcihcbiAgICAobmV0d29ya0l0ZW0pID0+IHNlYXJjaFRlcm0gJiYgbmV0d29ya0l0ZW0uY2hhaW5OYW1lLm1hdGNoKHNlYXJjaFRlcm0pLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGhlaWdodDogMSwgcGI6IDEgfX0+XG4gICAgICB7IWZpbHRlcmVkQ3VzdG9tTmV0d29ya3MubGVuZ3RoICYmIChcbiAgICAgICAgPEVtcHR5Q29udGVudCB0ZXh0PXt0KCdUaGVyZSBpcyBubyBzZWFyY2ggcmVzdWx0LicpfSAvPlxuICAgICAgKX1cblxuICAgICAgPE5ldHdvcmtMaXN0IG5ldHdvcmtMaXN0PXtmaWx0ZXJlZEN1c3RvbU5ldHdvcmtzfSAvPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBTdGFjayB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IEVtcHR5Q29udGVudCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRW1wdHlDb250ZW50JztcblxuaW1wb3J0IHsgTmV0d29ya1RhYlByb3BzIH0gZnJvbSAnLi9OZXR3b3Jrcyc7XG5pbXBvcnQgeyBOZXR3b3JrTGlzdCB9IGZyb20gJy4vY29tbW9uL05ldHdvcmtMaXN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIEZhdm9yaXRlc1RhYih7IHNlYXJjaFRlcm0gfTogTmV0d29ya1RhYlByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBmYXZvcml0ZU5ldHdvcmtzIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuXG4gIGNvbnN0IGZpbHRlcmVkTmV0d29ya3MgPSBmYXZvcml0ZU5ldHdvcmtzLmZpbHRlcihcbiAgICAobmV0d29ya0l0ZW0pID0+IHNlYXJjaFRlcm0gJiYgbmV0d29ya0l0ZW0uY2hhaW5OYW1lLm1hdGNoKHNlYXJjaFRlcm0pLFxuICApO1xuXG4gIGNvbnN0IGhhc0Zhdm9yaXRlcyA9IGZhdm9yaXRlTmV0d29ya3MubGVuZ3RoID4gMDtcbiAgY29uc3QgaGFzU2VhcmNoUmVzdWx0cyA9IGZpbHRlcmVkTmV0d29ya3MubGVuZ3RoID4gMDtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSwgaGVpZ2h0OiAxLCBwYjogMSB9fT5cbiAgICAgIHshaGFzRmF2b3JpdGVzICYmIChcbiAgICAgICAgPEVtcHR5Q29udGVudCB0ZXh0PXt0KFwiWW91IGRvbid0IGhhdmUgYW55IGZhdm9yaXRlIGl0ZW0geWV0LlwiKX0gLz5cbiAgICAgICl9XG5cbiAgICAgIHtoYXNGYXZvcml0ZXMgJiYgIWhhc1NlYXJjaFJlc3VsdHMgJiYgKFxuICAgICAgICA8RW1wdHlDb250ZW50IHRleHQ9e3QoJ1RoZXJlIGlzIG5vIHNlYXJjaCByZXN1bHQuJyl9IC8+XG4gICAgICApfVxuXG4gICAgICA8TmV0d29ya0xpc3QgbmV0d29ya0xpc3Q9e2ZpbHRlcmVkTmV0d29ya3N9IC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IENoYW5nZUV2ZW50LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBJY29uQnV0dG9uLFxuICBQbHVzSWNvbixcbiAgU2VhcmNoQmFyLFxuICBTdGFjayxcbiAgVGFiLFxuICBUYWJQYW5lbCxcbiAgVGFicyxcbiAgc3R5bGVkLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB1c2VQZXJzaXN0ZWRUYWJzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VQZXJzaXN0ZWRUYWJzJztcblxuaW1wb3J0IHsgQ3VzdG9tc1RhYiB9IGZyb20gJy4vQ3VzdG9tc1RhYic7XG5pbXBvcnQgeyBGYXZvcml0ZXNUYWIgfSBmcm9tICcuL0Zhdm9yaXRlc1RhYic7XG5pbXBvcnQgeyBOZXR3b3Jrc1RhYiB9IGZyb20gJy4vTmV0d29ya3NUYWInO1xuXG5leHBvcnQgZW51bSBOZXR3b3JrVGFiIHtcbiAgRmF2b3JpdGVzLFxuICBBbGwsXG4gIEN1c3RvbSxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZXR3b3JrVGFiUHJvcHMge1xuICBzZWFyY2hUZXJtOiBSZWdFeHA7XG59XG5cbmNvbnN0IE5ldHdvcmtUYWJQYW5lbCA9IHN0eWxlZChUYWJQYW5lbClgXG4gIGZsZXgtZ3JvdzogMTtcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBOZXR3b3JrcygpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCBbc2VhcmNoVGVybSwgc2V0U2VhcmNoVGVybV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7IGFjdGl2ZVRhYiwgc2V0QWN0aXZlVGFiIH0gPSB1c2VQZXJzaXN0ZWRUYWJzKE5ldHdvcmtUYWIuRmF2b3JpdGVzKTtcblxuICBjb25zdCB0ZXJtID0gbmV3IFJlZ0V4cChzZWFyY2hUZXJtLCAnZ2knKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSwgZmxleEdyb3c6IDEgfX0+XG4gICAgICA8UGFnZVRpdGxlIG1hcmdpbj1cIjEycHggMFwiPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICBwcjogMSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ05ldHdvcmtzJyl9XG5cbiAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhZGQtbmV0d29yay1idXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGlzdG9yeS5wdXNoKCcvbmV0d29ya3MvYWRkJyl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFBsdXNJY29uIHNpemU9ezI0fSAvPlxuICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvUGFnZVRpdGxlPlxuICAgICAgPFN0YWNrIHN4PXt7IHB5OiAxLCBweDogMiB9fT5cbiAgICAgICAgPFNlYXJjaEJhclxuICAgICAgICAgIHN4PXt7IHdpZHRoOiAxIH19XG4gICAgICAgICAgb25DaGFuZ2U9eyhlOiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT5cbiAgICAgICAgICAgIHNldFNlYXJjaFRlcm0oZS50YXJnZXQudmFsdWUpXG4gICAgICAgICAgfVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwibmV0d29yay1zZWFyY2hcIlxuICAgICAgICAvPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxUYWJzXG4gICAgICAgIHNpemU9XCJtZWRpdW1cIlxuICAgICAgICB2YXJpYW50PVwiZnVsbFdpZHRoXCJcbiAgICAgICAgaW5kaWNhdG9yQ29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICB2YWx1ZT17YWN0aXZlVGFifVxuICAgICAgICBvbkNoYW5nZT17KF8sIHRhYikgPT4ge1xuICAgICAgICAgIGlmICh0YWIgPT09IE5ldHdvcmtUYWIuQ3VzdG9tKSB7XG4gICAgICAgICAgICBjYXB0dXJlKCdOZXR3b3JrQ3VzdG9tVGFiQ2xpY2tlZCcpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGFiID09PSBOZXR3b3JrVGFiLkZhdm9yaXRlcykge1xuICAgICAgICAgICAgY2FwdHVyZSgnTmV0d29ya0Zhdm9yaXRlc1RhYkNsaWNrZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FwdHVyZSgnTmV0d29ya05ldHdvcmtzVGFiQ2xpY2tlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRBY3RpdmVUYWIodGFiKTtcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFRhYiBsYWJlbD17dCgnRmF2b3JpdGVzJyl9IHZhbHVlPXtOZXR3b3JrVGFiLkZhdm9yaXRlc30gLz5cbiAgICAgICAgPFRhYiBsYWJlbD17dCgnTmV0d29ya3MnKX0gdmFsdWU9e05ldHdvcmtUYWIuQWxsfSAvPlxuICAgICAgICA8VGFiIGxhYmVsPXt0KCdDdXN0b20nKX0gdmFsdWU9e05ldHdvcmtUYWIuQ3VzdG9tfSAvPlxuICAgICAgPC9UYWJzPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgbXQ6IC0wLjI1LFxuICAgICAgICAgIHB0OiAxLFxuICAgICAgICAgIGJvcmRlclRvcDogMSxcbiAgICAgICAgICBib3JkZXJDb2xvcjogJ2RpdmlkZXInLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8TmV0d29ya1RhYlBhbmVsIHZhbHVlPXthY3RpdmVUYWJ9IGluZGV4PXtOZXR3b3JrVGFiLkZhdm9yaXRlc30+XG4gICAgICAgICAgPEZhdm9yaXRlc1RhYiBzZWFyY2hUZXJtPXt0ZXJtfSAvPlxuICAgICAgICA8L05ldHdvcmtUYWJQYW5lbD5cbiAgICAgICAgPE5ldHdvcmtUYWJQYW5lbCB2YWx1ZT17YWN0aXZlVGFifSBpbmRleD17TmV0d29ya1RhYi5BbGx9PlxuICAgICAgICAgIDxOZXR3b3Jrc1RhYiBzZWFyY2hUZXJtPXt0ZXJtfSAvPlxuICAgICAgICA8L05ldHdvcmtUYWJQYW5lbD5cbiAgICAgICAgPE5ldHdvcmtUYWJQYW5lbCB2YWx1ZT17YWN0aXZlVGFifSBpbmRleD17TmV0d29ya1RhYi5DdXN0b219PlxuICAgICAgICAgIDxDdXN0b21zVGFiIHNlYXJjaFRlcm09e3Rlcm19IC8+XG4gICAgICAgIDwvTmV0d29ya1RhYlBhbmVsPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyBFbXB0eUNvbnRlbnQgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0VtcHR5Q29udGVudCc7XG5cbmltcG9ydCB7IE5ldHdvcmtUYWJQcm9wcyB9IGZyb20gJy4vTmV0d29ya3MnO1xuaW1wb3J0IHsgTmV0d29ya0xpc3QgfSBmcm9tICcuL2NvbW1vbi9OZXR3b3JrTGlzdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBOZXR3b3Jrc1RhYih7IHNlYXJjaFRlcm0gfTogTmV0d29ya1RhYlByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBuZXR3b3JrcyB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcblxuICBjb25zdCBmaWx0ZXJlZE5ldHdvcmtzID0gbmV0d29ya3MuZmlsdGVyKFxuICAgIChuZXR3b3JrSXRlbSkgPT4gc2VhcmNoVGVybSAmJiBuZXR3b3JrSXRlbS5jaGFpbk5hbWUubWF0Y2goc2VhcmNoVGVybSksXG4gICk7XG5cbiAgY29uc3QgaGFzU2VhcmNoUmVzdWx0cyA9IGZpbHRlcmVkTmV0d29ya3MubGVuZ3RoID4gMDtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSwgaGVpZ2h0OiAxLCBwYjogMSB9fT5cbiAgICAgIHtoYXNTZWFyY2hSZXN1bHRzID8gKFxuICAgICAgICA8TmV0d29ya0xpc3QgbmV0d29ya0xpc3Q9e2ZpbHRlcmVkTmV0d29ya3N9IC8+XG4gICAgICApIDogKFxuICAgICAgICA8RW1wdHlDb250ZW50IHRleHQ9e3QoJ1RoZXJlIGlzIG5vIHNlYXJjaCByZXN1bHQuJyl9IC8+XG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBDU1NUcmFuc2l0aW9uLCBUcmFuc2l0aW9uR3JvdXAgfSBmcm9tICdyZWFjdC10cmFuc2l0aW9uLWdyb3VwJztcbmltcG9ydCB7IENoYWluSWQsIE5ldHdvcmsgfSBmcm9tICdAYXZhbGFicy9jb3JlLWNoYWlucy1zZGsnO1xuaW1wb3J0IHtcbiAgQ29sbGFwc2UsXG4gIERpdmlkZXIsXG4gIEdsb2JlSWNvbixcbiAgSWNvbkJ1dHRvbixcbiAgSW5mb0NpcmNsZUljb24sXG4gIFNjcm9sbGJhcnMsXG4gIFN0YWNrLFxuICBTdGFyRmlsbGVkSWNvbixcbiAgU3Rhckljb24sXG4gIFR5cG9ncmFwaHksXG4gIHRvYXN0LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgTmV0d29ya0xvZ28gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL05ldHdvcmtMb2dvJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgaXBmc1Jlc29sdmVyV2l0aEZhbGxiYWNrIH0gZnJvbSAnQHNyYy91dGlscy9pcHNmUmVzb2x2ZXJXaXRoRmFsbGJhY2snO1xuXG5pbXBvcnQgeyBOZXR3b3JrTGlzdEl0ZW0gfSBmcm9tICcuL05ldHdvcmtMaXN0SXRlbSc7XG5pbXBvcnQge1xuICBBbmltYXRlZEdsb2JlSWNvbkNvbnRhaW5lcixcbiAgQW5pbWF0ZWROZXR3b3JrTG9nbyxcbiAgTmV0d29ya0xvZ29Db250YWluZXIsXG59IGZyb20gJy4vTmV0d29ya0xvZ28nO1xuXG5pbnRlcmZhY2UgTmV0d29ya0xpc3RQcm9wcyB7XG4gIG5ldHdvcmtMaXN0OiBOZXR3b3JrW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOZXR3b3JrTGlzdCh7IG5ldHdvcmtMaXN0IH06IE5ldHdvcmtMaXN0UHJvcHMpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7XG4gICAgbmV0d29yayxcbiAgICBzZXROZXR3b3JrLFxuICAgIHJlbW92ZUZhdm9yaXRlTmV0d29yayxcbiAgICBpc0Zhdm9yaXRlTmV0d29yayxcbiAgICBhZGRGYXZvcml0ZU5ldHdvcmssXG4gIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCBbZmF2b3JpdGVkSXRlbSwgc2V0RmF2b3JpdGVkSXRlbV0gPSB1c2VTdGF0ZTxudW1iZXIgfCBudWxsPihudWxsKTtcblxuICBpZiAoIW5ldHdvcmtMaXN0Lmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8U2Nyb2xsYmFycyBzdHlsZT17eyBmbGV4R3JvdzogMSwgbWF4SGVpZ2h0OiAndW5zZXQnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgIDxUcmFuc2l0aW9uR3JvdXAgY29tcG9uZW50PXtudWxsfT5cbiAgICAgICAge25ldHdvcmtMaXN0Lm1hcCgobmV0d29ya0l0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgaXNGYXZvcml0ZSA9IGlzRmF2b3JpdGVOZXR3b3JrKG5ldHdvcmtJdGVtLmNoYWluSWQpO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Q29sbGFwc2Uga2V5PXtuZXR3b3JrSXRlbS5jaGFpbklkfSBjbGFzc05hbWU9XCJpdGVtXCI+XG4gICAgICAgICAgICAgIHtpbmRleCA+IDAgJiYgPERpdmlkZXIgc3g9e3sgbXg6IDIgfX0gLz59XG4gICAgICAgICAgICAgIDxOZXR3b3JrTGlzdEl0ZW1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXROZXR3b3JrKG5ldHdvcmtJdGVtKTtcbiAgICAgICAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3ModCgnQWN0aXZlIE5ldHdvcmsgaGFzIGNoYW5nZWQhJyksIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaCgnL2hvbWUnKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbmV0d29yay1saS0ke2luZGV4fWB9XG4gICAgICAgICAgICAgICAgaXNBY3RpdmU9e25ldHdvcmtJdGVtLmNoYWluSWQgPT09IG5ldHdvcms/LmNoYWluSWR9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3g9e3sgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogMiB9fT5cbiAgICAgICAgICAgICAgICAgIDxOZXR3b3JrTG9nb0NvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPENTU1RyYW5zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e25ldHdvcmtJdGVtLmNoYWluSWR9XG4gICAgICAgICAgICAgICAgICAgICAgdGltZW91dD17NTAwfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM9XCJpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICBhcHBlYXJcbiAgICAgICAgICAgICAgICAgICAgICBpbj17ZmF2b3JpdGVkSXRlbSA9PT0gbmV0d29ya0l0ZW0uY2hhaW5JZH1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHtuZXR3b3JrSXRlbS5sb2dvVXJpID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPEFuaW1hdGVkTmV0d29ya0xvZ29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtpcGZzUmVzb2x2ZXJXaXRoRmFsbGJhY2sobmV0d29ya0l0ZW0ubG9nb1VyaSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uPXtpbmRleCArIDF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzRmF2b3JpdGVkPXtpbmRleCA9PT0gZmF2b3JpdGVkSXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxBbmltYXRlZEdsb2JlSWNvbkNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbj17aW5kZXggKyAxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Zhdm9yaXRlZD17aW5kZXggPT09IGZhdm9yaXRlZEl0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxHbG9iZUljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjEwMCVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjEwMCVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPXt0aGVtZS5wYWxldHRlLmNvbW1vbi53aGl0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPXszMn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQW5pbWF0ZWRHbG9iZUljb25Db250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9DU1NUcmFuc2l0aW9uPlxuXG4gICAgICAgICAgICAgICAgICAgIDxOZXR3b3JrTG9nb1xuICAgICAgICAgICAgICAgICAgICAgIHNyYz17bmV0d29ya0l0ZW0ubG9nb1VyaX1cbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjMycHhcIlxuICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjMycHhcIlxuICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uPVwiYWJzb2x1dGVcIlxuICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRTaXplPXszMn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvTmV0d29ya0xvZ29Db250YWluZXI+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTFcIlxuICAgICAgICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7bmV0d29ya0l0ZW0uY2hhaW5OYW1lfVxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgICAgICAgc3g9e3sgZmxleFNocmluazogMCwgYWxpZ25JdGVtczogJ2NlbnRlcicgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7bmV0d29ya0l0ZW0uY2hhaW5JZCAhPT0gQ2hhaW5JZC5BVkFMQU5DSEVfTUFJTk5FVF9JRCAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRmF2b3JpdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RmF2b3JpdGVkSXRlbShuZXR3b3JrSXRlbS5jaGFpbklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkRmF2b3JpdGVOZXR3b3JrKG5ldHdvcmtJdGVtLmNoYWluSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RmF2b3JpdGVkSXRlbShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRmF2b3JpdGVOZXR3b3JrKG5ldHdvcmtJdGVtLmNoYWluSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJmYXZvcml0ZS1uZXR3b3JrXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHtpc0Zhdm9yaXRlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFN0YXJGaWxsZWRJY29uIHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8U3Rhckljb24gc2l6ZT17MjR9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICBjYXB0dXJlKCdOZXR3b3JrRGV0YWlsc0NsaWNrZWQnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpbklkOiBuZXR3b3JrSXRlbS5jaGFpbklkLFxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaChgL25ldHdvcmtzL2RldGFpbHMvJHtuZXR3b3JrSXRlbS5jaGFpbklkfWApO1xuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cIm5ldHdvcmstZGV0YWlsc1wiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxJbmZvQ2lyY2xlSWNvbiBzaXplPXsyNH0gLz5cbiAgICAgICAgICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8L05ldHdvcmtMaXN0SXRlbT5cbiAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L1RyYW5zaXRpb25Hcm91cD5cbiAgICA8L1Njcm9sbGJhcnM+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBTdGFjaywgc3R5bGVkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IE5ldHdvcmtMaXN0SXRlbSA9IHN0eWxlZChTdGFjaywge1xuICBzaG91bGRGb3J3YXJkUHJvcDogKHByb3ApID0+IHByb3AgIT09ICdpc0FjdGl2ZScsXG59KTx7XG4gIGlzQWN0aXZlPzogYm9vbGVhbjtcbn0+YFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHBhZGRpbmc6IDE2cHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXMgZWFzZS1pbi1vdXQ7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7KHsgaXNBY3RpdmUsIHRoZW1lIH0pID0+XG4gICAgaXNBY3RpdmUgPyBgJHt0aGVtZS5wYWxldHRlLmdyZXlbOTAwXX04MGAgOiAnaW5oZXJpdCd9O1xuXG4gIDpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmdyZXlbOTAwXX04MGB9O1xuICB9XG5gO1xuIiwiaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IE5ldHdvcmtMb2dvQ29udGFpbmVyID0gc3R5bGVkKCdkaXYnKWBcbiAgd2lkdGg6IDMycHg7XG4gIGhlaWdodDogMzJweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuYDtcblxuZXhwb3J0IGNvbnN0IEFuaW1hdGVkR2xvYmVJY29uQ29udGFpbmVyID0gc3R5bGVkKCdkaXYnKTx7XG4gIGlzRmF2b3JpdGVkOiBib29sZWFuO1xuICBwb3NpdGlvbjogbnVtYmVyO1xufT5gXG4gIHdpZHRoOiAzMnB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgb3BhY2l0eTogMDtcbiAgJi5pdGVtLWVudGVyIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gIH1cbiAgJi5pdGVtLWVudGVyLWFjdGl2ZSB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB0b3A6ICR7KHsgcG9zaXRpb24gfSkgPT4gKHBvc2l0aW9uID8gYC0ke3Bvc2l0aW9uICogNjV9cHhgIDogMCl9O1xuICAgIGxlZnQ6IDQwcHg7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwKTtcbiAgICB0cmFuc2l0aW9uOlxuICAgICAgdG9wIDUwMG1zIGVhc2UtaW4tb3V0LFxuICAgICAgb3BhY2l0eSA3NTBtcyBlYXNlLWluLW91dCxcbiAgICAgIGxlZnQgNTAwbXMgZWFzZS1pbi1vdXQsXG4gICAgICB0cmFuc2Zvcm0gNTUwbXMgZWFzZS1pbi1vdXQ7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBBbmltYXRlZE5ldHdvcmtMb2dvID0gc3R5bGVkKCdpbWcnKTx7XG4gIGlzRmF2b3JpdGVkOiBib29sZWFuO1xuICBwb3NpdGlvbjogbnVtYmVyO1xufT5gXG4gIHdpZHRoOiAzMnB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgb3BhY2l0eTogMDtcbiAgJi5pdGVtLWVudGVyIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gIH1cbiAgJi5pdGVtLWVudGVyLWFjdGl2ZSB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB0b3A6ICR7KHsgcG9zaXRpb24gfSkgPT4gKHBvc2l0aW9uID8gYC0ke3Bvc2l0aW9uICogNjV9cHhgIDogMCl9O1xuICAgIGxlZnQ6IDQwcHg7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwKTtcbiAgICB0cmFuc2l0aW9uOlxuICAgICAgdG9wIDUwMG1zIGVhc2UtaW4tb3V0LFxuICAgICAgb3BhY2l0eSA3NTBtcyBlYXNlLWluLW91dCxcbiAgICAgIGxlZnQgNTAwbXMgZWFzZS1pbi1vdXQsXG4gICAgICB0cmFuc2Zvcm0gNTUwbXMgZWFzZS1pbi1vdXQ7XG4gIH1cbmA7XG4iXSwibmFtZXMiOlsiU3RhY2siLCJHcm93IiwiVHlwb2dyYXBoeSIsImNvbW1vblRyYW5zaXRpb25Qcm9wcyIsInRpbWVvdXQiLCJlYXNpbmciLCJhcHBlYXIiLCJFbXB0eUNvbnRlbnQiLCJ0ZXh0IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiX2V4dGVuZHMiLCJpbiIsInN4IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZmxleEdyb3ciLCJoZWlnaHQiLCJ2YXJpYW50IiwidXNlQ2FsbGJhY2siLCJ1c2VNZW1vIiwidXNlSGlzdG9yeSIsInVzZUxvY2F0aW9uIiwidXNlUGVyc2lzdGVkVGFicyIsImRlZmF1bHRUYWIiLCJ0YWJQYXJhbSIsInNlYXJjaCIsInBhdGhuYW1lIiwiaGlzdG9yeSIsInRhYkZyb21VcmwiLCJwYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJ0YWIiLCJnZXQiLCJOdW1iZXIiLCJzZXRBY3RpdmVUYWIiLCJyZXBsYWNlIiwiU3RyaW5nIiwidG9TdHJpbmciLCJhY3RpdmVUYWIiLCJ1c2VUcmFuc2xhdGlvbiIsInVzZU5ldHdvcmtDb250ZXh0IiwiTmV0d29ya0xpc3QiLCJDdXN0b21zVGFiIiwic2VhcmNoVGVybSIsInQiLCJjdXN0b21OZXR3b3JrcyIsImZpbHRlcmVkQ3VzdG9tTmV0d29ya3MiLCJmaWx0ZXIiLCJuZXR3b3JrSXRlbSIsImNoYWluTmFtZSIsIm1hdGNoIiwicGIiLCJsZW5ndGgiLCJuZXR3b3JrTGlzdCIsIkZhdm9yaXRlc1RhYiIsImZhdm9yaXRlTmV0d29ya3MiLCJmaWx0ZXJlZE5ldHdvcmtzIiwiaGFzRmF2b3JpdGVzIiwiaGFzU2VhcmNoUmVzdWx0cyIsIndpZHRoIiwidXNlU3RhdGUiLCJJY29uQnV0dG9uIiwiUGx1c0ljb24iLCJTZWFyY2hCYXIiLCJUYWIiLCJUYWJQYW5lbCIsIlRhYnMiLCJzdHlsZWQiLCJ1c2VBbmFseXRpY3NDb250ZXh0IiwiUGFnZVRpdGxlIiwiTmV0d29ya3NUYWIiLCJOZXR3b3JrVGFiIiwiTmV0d29ya1RhYlBhbmVsIiwiTmV0d29ya3MiLCJzZXRTZWFyY2hUZXJtIiwiY2FwdHVyZSIsIkZhdm9yaXRlcyIsInRlcm0iLCJSZWdFeHAiLCJtYXJnaW4iLCJkaXJlY3Rpb24iLCJwciIsIm9uQ2xpY2siLCJwdXNoIiwic2l6ZSIsInB5IiwicHgiLCJvbkNoYW5nZSIsImUiLCJ0YXJnZXQiLCJ2YWx1ZSIsImluZGljYXRvckNvbG9yIiwiXyIsIkN1c3RvbSIsImxhYmVsIiwiQWxsIiwibXQiLCJwdCIsImJvcmRlclRvcCIsImJvcmRlckNvbG9yIiwiaW5kZXgiLCJuZXR3b3JrcyIsIkNTU1RyYW5zaXRpb24iLCJUcmFuc2l0aW9uR3JvdXAiLCJDaGFpbklkIiwiQ29sbGFwc2UiLCJEaXZpZGVyIiwiR2xvYmVJY29uIiwiSW5mb0NpcmNsZUljb24iLCJTY3JvbGxiYXJzIiwiU3RhckZpbGxlZEljb24iLCJTdGFySWNvbiIsInRvYXN0IiwidXNlVGhlbWUiLCJOZXR3b3JrTG9nbyIsImlwZnNSZXNvbHZlcldpdGhGYWxsYmFjayIsIk5ldHdvcmtMaXN0SXRlbSIsIkFuaW1hdGVkR2xvYmVJY29uQ29udGFpbmVyIiwiQW5pbWF0ZWROZXR3b3JrTG9nbyIsIk5ldHdvcmtMb2dvQ29udGFpbmVyIiwibmV0d29yayIsInNldE5ldHdvcmsiLCJyZW1vdmVGYXZvcml0ZU5ldHdvcmsiLCJpc0Zhdm9yaXRlTmV0d29yayIsImFkZEZhdm9yaXRlTmV0d29yayIsInRoZW1lIiwiZmF2b3JpdGVkSXRlbSIsInNldEZhdm9yaXRlZEl0ZW0iLCJzdHlsZSIsIm1heEhlaWdodCIsImNvbXBvbmVudCIsIm1hcCIsImlzRmF2b3JpdGUiLCJjaGFpbklkIiwia2V5IiwiY2xhc3NOYW1lIiwibXgiLCJzdWNjZXNzIiwiZHVyYXRpb24iLCJpc0FjdGl2ZSIsImdhcCIsImNsYXNzTmFtZXMiLCJsb2dvVXJpIiwic3JjIiwicG9zaXRpb24iLCJpc0Zhdm9yaXRlZCIsImNvbG9yIiwicGFsZXR0ZSIsImNvbW1vbiIsIndoaXRlIiwiZGVmYXVsdFNpemUiLCJmb250V2VpZ2h0IiwiZmxleFNocmluayIsIkFWQUxBTkNIRV9NQUlOTkVUX0lEIiwic3RvcFByb3BhZ2F0aW9uIiwic2hvdWxkRm9yd2FyZFByb3AiLCJwcm9wIiwiZ3JleSJdLCJzb3VyY2VSb290IjoiIn0=