"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Collectibles_CollectibleDetails_tsx"],{

/***/ "./src/components/common/scrollbars/Scrollbars.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/scrollbars/Scrollbars.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scrollbars": () => (/* binding */ Scrollbars)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_custom_scrollbars_2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-custom-scrollbars-2 */ "./node_modules/react-custom-scrollbars-2/lib/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




// See https://github.com/RobPethick/react-custom-scrollbars-2/blob/master/docs/API.md
// for available props
const Scrollbars = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function Scrollbars(props, ref) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const renderThumb = ({
    style,
    ...rest
  }) => {
    const thumbStyle = {
      backgroundColor: theme.palette.grey[800],
      borderRadius: 9999
    };
    return /*#__PURE__*/React.createElement("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      style: {
        ...style,
        ...thumbStyle
      }
    }, rest));
  };
  return /*#__PURE__*/React.createElement(react_custom_scrollbars_2__WEBPACK_IMPORTED_MODULE_1__.Scrollbars, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    renderThumbVertical: renderThumb,
    ref: ref
  }, props));
});

/***/ }),

/***/ "./src/pages/Collectibles/CollectibleDetails.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/Collectibles/CollectibleDetails.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CollectibleDetails": () => (/* binding */ CollectibleDetails)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/scrollbars/Scrollbars */ "./src/components/common/scrollbars/Scrollbars.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/CollectibleMedia */ "./src/pages/Collectibles/components/CollectibleMedia.tsx");
/* harmony import */ var _hooks_useCollectibleFromParams__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hooks/useCollectibleFromParams */ "./src/pages/Collectibles/hooks/useCollectibleFromParams.tsx");
/* harmony import */ var _hooks_useSetCollectibleParams__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hooks/useSetCollectibleParams */ "./src/pages/Collectibles/hooks/useSetCollectibleParams.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _Home_components_Portfolio_Portfolio__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Home/components/Portfolio/Portfolio */ "./src/pages/Home/components/Portfolio/Portfolio.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_hooks_useErrorMessage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/hooks/useErrorMessage */ "./src/hooks/useErrorMessage.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_nfts_metadataParser__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/utils/nfts/metadataParser */ "./src/utils/nfts/metadataParser.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalancheNetwork__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheNetwork */ "./src/background/services/network/utils/isAvalancheNetwork.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


















const AttributeLabel = props => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props, {
  variant: "body2"
}));
const AttributeData = props => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props, {
  variant: "h6",
  sx: {
    wordWrap: 'break-word',
    fontWeight: 'fontWeightSemibold'
  }
}));
function CollectibleDetails() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_16__.useTranslation)();
  const setCollectibleParams = (0,_hooks_useSetCollectibleParams__WEBPACK_IMPORTED_MODULE_6__.useSetCollectibleParams)();
  const {
    nft
  } = (0,_hooks_useCollectibleFromParams__WEBPACK_IMPORTED_MODULE_5__.useCollectibleFromParams)();
  const {
    refreshNftMetadata
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_10__.useBalancesContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_8__.useAnalyticsContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_9__.useNetworkContext)();
  const sendRef = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
  const [showThumbnail, setShowThumbnail] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [isRefreshing, setIsRefreshing] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [wasRefreshed, setWasRefreshed] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const getTranslatedError = (0,_src_hooks_useErrorMessage__WEBPACK_IMPORTED_MODULE_11__.useErrorMessage)();
  const canRefreshMetadata = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const refreshBackoff = 3600;
    if (!nft || wasRefreshed) {
      return false;
    }
    return !nft.updatedAt || currentTimestamp > nft.updatedAt + refreshBackoff;
  }, [nft, wasRefreshed]);
  const metadata = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    return (0,_src_utils_nfts_metadataParser__WEBPACK_IMPORTED_MODULE_13__.parseRawAttributesString)(nft?.metadata?.properties);
  }, [nft]);
  const refreshMetadata = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(async () => {
    if (!nft || !network) {
      return;
    }
    setIsRefreshing(true);
    try {
      await refreshNftMetadata(nft.address, String(network.chainId), nft.tokenId);
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__["default"].success(t('NFT metadata was refreshed successfully!'));
      setWasRefreshed(true);
    } catch (err) {
      const {
        title,
        hint
      } = getTranslatedError(err);
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__["default"].custom( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.ToastCard, {
        variant: "error"
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
        variant: "subtitle2"
      }, title), hint && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
        variant: "caption",
        color: "text.primary"
      }, hint)), {
        duration: 5000
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [getTranslatedError, network, nft, refreshNftMetadata, t]);
  if (!nft) {
    return /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_18__.Redirect, {
      to: `/home?activeTab=${_Home_components_Portfolio_Portfolio__WEBPACK_IMPORTED_MODULE_7__.PortfolioTabs.COLLECTIBLES}`
    });
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    direction: "row",
    sx: {
      mt: 2.5,
      mb: 0.5,
      pr: 1,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitle, {
    margin: "0",
    thumbnailImage: showThumbnail ? nft?.logoUri : ''
  }, nft?.name), network && (0,_src_background_services_network_utils_isAvalancheNetwork__WEBPACK_IMPORTED_MODULE_14__.isAvalancheNetwork)(network) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Tooltip, {
    title: canRefreshMetadata ? '' : t('Refresh is only available once per hour.')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Button, {
    variant: "text",
    size: "large",
    color: "primary",
    disabled: !canRefreshMetadata || isRefreshing,
    sx: {
      p: 0
    },
    onClick: refreshMetadata,
    disableRipple: true,
    "data-testid": "refresh-nft-metadata"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.RefreshIcon, {
    size: 24
  })))), /*#__PURE__*/React.createElement(_src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    },
    onScrollFrame: ({
      scrollTop
    }) => {
      // offsetTop corrected with margin
      if (sendRef.current && scrollTop >= sendRef.current.offsetTop - 24) {
        setShowThumbnail(true);
      } else {
        setShowThumbnail(false);
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      px: 2
    }
  }, isRefreshing ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Skeleton, {
    variant: "rectangular",
    width: "100%",
    height: "300px"
  }) : /*#__PURE__*/React.createElement(_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_4__.CollectibleMedia, {
    width: "343px",
    height: "auto",
    url: nft?.logoUri,
    hover: false,
    margin: "8px 0",
    controls: true,
    showPlayIcon: false,
    showBalance: _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_12__.TokenType.ERC1155 === nft.type,
    balance: nft.balance,
    showExpandOption: true
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Button, {
    size: "large",
    sx: {
      my: 3
    },
    onClick: () => {
      capture('CollectibleSendClicked', {
        chainId: network?.chainId,
        type: nft.type
      });
      setCollectibleParams({
        nft,
        options: {
          path: '/collectible/send'
        }
      });
    },
    ref: sendRef
  }, t('Send')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "h5"
  }, t('Description')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      mt: 2,
      mb: 4,
      gap: '15px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, null, /*#__PURE__*/React.createElement(AttributeLabel, null, t('Collection')), /*#__PURE__*/React.createElement(AttributeData, null, nft.collectionName)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, null, /*#__PURE__*/React.createElement(AttributeLabel, null, t('Description')), /*#__PURE__*/React.createElement(AttributeData, null, nft?.description))), metadata.length > 0 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "h5"
  }, t('Properties')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      pt: 2,
      pb: 4
    }
  }, metadata.map((attribute, i) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    key: i
  }, i !== 0 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Divider, {
    sx: {
      my: 2
    }
  }), /*#__PURE__*/React.createElement(AttributeLabel, null, attribute.name), /*#__PURE__*/React.createElement(AttributeData, null, attribute.value)))))));
}

/***/ }),

/***/ "./src/pages/Collectibles/hooks/useCollectibleFromParams.tsx":
/*!*******************************************************************!*\
  !*** ./src/pages/Collectibles/hooks/useCollectibleFromParams.tsx ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useCollectibleFromParams": () => (/* binding */ useCollectibleFromParams)
/* harmony export */ });
/* harmony import */ var _src_hooks_useNfts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useNfts */ "./src/hooks/useNfts.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var xss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! xss */ "./node_modules/xss/lib/index.js");
/* harmony import */ var xss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(xss__WEBPACK_IMPORTED_MODULE_2__);




const useCollectibleFromParams = () => {
  const {
    search
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  const nfts = (0,_src_hooks_useNfts__WEBPACK_IMPORTED_MODULE_0__.useNfts)();
  return (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    const {
      nft,
      tokenId
    } = Object.fromEntries(new URLSearchParams(search).entries());
    if (!nft || !tokenId) {
      return {
        nft: undefined,
        tokenId: xss__WEBPACK_IMPORTED_MODULE_2___default()(tokenId)
      };
    }
    const filteredAddress = xss__WEBPACK_IMPORTED_MODULE_2___default()(nft);
    return {
      nft: nfts?.find(item => item.address === filteredAddress && item.tokenId === tokenId),
      tokenId: xss__WEBPACK_IMPORTED_MODULE_2___default()(tokenId)
    };
  }, [nfts, search]);
};

/***/ }),

/***/ "./src/utils/nfts/metadataParser.ts":
/*!******************************************!*\
  !*** ./src/utils/nfts/metadataParser.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseAttributes": () => (/* binding */ parseAttributes),
/* harmony export */   "parseRawAttributesString": () => (/* binding */ parseRawAttributesString)
/* harmony export */ });
const parseAttributes = attributes => {
  return Array.isArray(attributes) ? parseRawAttributesArray(attributes) : attributes === 'string' ? parseRawAttributesString(attributes) : attributes;
};
const parseRawAttributesString = rawAttributesString => {
  if (rawAttributesString === undefined) return [];
  const rawAttributes = rawAttributesString ? JSON.parse(rawAttributesString) : [];
  const parsedAttributes = rawAttributes.reduce((acc, attr) => [...acc, {
    name: attr.name ?? attr.trait_type,
    value: attr.value
  }], []);
  return parsedAttributes;
};
const parseRawAttributesArray = rawAttributesArray => {
  if (rawAttributesArray === undefined) return [];
  const parsedAttributes = rawAttributesArray.map(attr => {
    return {
      name: attr.name ?? attr.trait_type,
      value: attr.value
    };
  });
  return parsedAttributes;
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0NvbGxlY3RpYmxlc19Db2xsZWN0aWJsZURldGFpbHNfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQThEO0FBQ2hCO0FBQ1M7QUFJdkQ7QUFDQTtBQUNPLE1BQU1HLFVBQVUsZ0JBQUdGLGlEQUFVLENBQUMsU0FBU0UsVUFBVUEsQ0FDdERDLEtBQXNDLEVBQ3RDQyxHQUF5QyxFQUN6QztFQUNBLE1BQU1DLEtBQUssR0FBR0osdUVBQVEsRUFBRTtFQUN4QixNQUFNSyxXQUFXLEdBQUdBLENBQUM7SUFBRUMsS0FBSztJQUFFLEdBQUdDO0VBQUssQ0FBQyxLQUFLO0lBQzFDLE1BQU1DLFVBQVUsR0FBRztNQUNqQkMsZUFBZSxFQUFFTCxLQUFLLENBQUNNLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDLEdBQUcsQ0FBQztNQUN4Q0MsWUFBWSxFQUFFO0lBQ2hCLENBQUM7SUFDRCxvQkFBT0MsS0FBQSxDQUFBQyxhQUFBLFFBQUFDLDBFQUFBO01BQUtULEtBQUssRUFBRTtRQUFFLEdBQUdBLEtBQUs7UUFBRSxHQUFHRTtNQUFXO0lBQUUsR0FBS0QsSUFBSSxFQUFJO0VBQzlELENBQUM7RUFFRCxvQkFDRU0sS0FBQSxDQUFBQyxhQUFBLENBQUNoQixpRUFBMkIsRUFBQWlCLDBFQUFBO0lBQzFCQyxtQkFBbUIsRUFBRVgsV0FBWTtJQUNqQ0YsR0FBRyxFQUFFQTtFQUFJLEdBQ0xELEtBQUssRUFDVDtBQUVOLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQm1DO0FBRXdCO0FBQ2E7QUFDWDtBQUNuQjtBQUNxQjtBQUNXO0FBQ0Y7QUFDM0I7QUFDd0I7QUFDRDtBQUNKO0FBQ0U7QUFDUDtBQUNSO0FBQ3FCO0FBQ3FCO0FBSS9GLE1BQU0wQyxjQUFjLEdBQUkxQyxLQUErQixpQkFDckRXLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVSxvRUFBVSxFQUFBVCwwRUFBQSxLQUFLYixLQUFLO0VBQUUy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YXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zY3JvbGxiYXJzL1Njcm9sbGJhcnMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQ29sbGVjdGlibGVzL0NvbGxlY3RpYmxlRGV0YWlscy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvaG9va3MvdXNlQ29sbGVjdGlibGVGcm9tUGFyYW1zLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL25mdHMvbWV0YWRhdGFQYXJzZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQ3VzdG9tU2Nyb2xsYmFycyBmcm9tICdyZWFjdC1jdXN0b20tc2Nyb2xsYmFycy0yJztcbmltcG9ydCB7IGZvcndhcmRSZWYsIExlZ2FjeVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRoZW1lIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IHR5cGUgU2Nyb2xsYmFyc1JlZiA9IEN1c3RvbVNjcm9sbGJhcnMuU2Nyb2xsYmFycztcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JQZXRoaWNrL3JlYWN0LWN1c3RvbS1zY3JvbGxiYXJzLTIvYmxvYi9tYXN0ZXIvZG9jcy9BUEkubWRcbi8vIGZvciBhdmFpbGFibGUgcHJvcHNcbmV4cG9ydCBjb25zdCBTY3JvbGxiYXJzID0gZm9yd2FyZFJlZihmdW5jdGlvbiBTY3JvbGxiYXJzKFxuICBwcm9wczogQ3VzdG9tU2Nyb2xsYmFycy5TY3JvbGxiYXJQcm9wcyxcbiAgcmVmOiBMZWdhY3lSZWY8U2Nyb2xsYmFyc1JlZj4gfCB1bmRlZmluZWQsXG4pIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCByZW5kZXJUaHVtYiA9ICh7IHN0eWxlLCAuLi5yZXN0IH0pID0+IHtcbiAgICBjb25zdCB0aHVtYlN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODAwXSxcbiAgICAgIGJvcmRlclJhZGl1czogOTk5OSxcbiAgICB9O1xuICAgIHJldHVybiA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLCAuLi50aHVtYlN0eWxlIH19IHsuLi5yZXN0fSAvPjtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxDdXN0b21TY3JvbGxiYXJzLlNjcm9sbGJhcnNcbiAgICAgIHJlbmRlclRodW1iVmVydGljYWw9e3JlbmRlclRodW1ifVxuICAgICAgcmVmPXtyZWZ9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKTtcbn0pO1xuIiwiaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBEaXZpZGVyLFxuICBSZWZyZXNoSWNvbixcbiAgU2tlbGV0b24sXG4gIFN0YWNrLFxuICBUb2FzdENhcmQsXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG4gIFR5cG9ncmFwaHlQcm9wcyxcbiAgdG9hc3QsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IFBhZ2VUaXRsZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vUGFnZVRpdGxlJztcbmltcG9ydCB7IFNjcm9sbGJhcnMgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL3Njcm9sbGJhcnMvU2Nyb2xsYmFycyc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFJlZGlyZWN0IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBDb2xsZWN0aWJsZU1lZGlhIH0gZnJvbSAnLi9jb21wb25lbnRzL0NvbGxlY3RpYmxlTWVkaWEnO1xuaW1wb3J0IHsgdXNlQ29sbGVjdGlibGVGcm9tUGFyYW1zIH0gZnJvbSAnLi9ob29rcy91c2VDb2xsZWN0aWJsZUZyb21QYXJhbXMnO1xuaW1wb3J0IHsgdXNlU2V0Q29sbGVjdGlibGVQYXJhbXMgfSBmcm9tICcuL2hvb2tzL3VzZVNldENvbGxlY3RpYmxlUGFyYW1zJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBQb3J0Zm9saW9UYWJzIH0gZnJvbSAnLi4vSG9tZS9jb21wb25lbnRzL1BvcnRmb2xpby9Qb3J0Zm9saW8nO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VCYWxhbmNlc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JhbGFuY2VzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy9ob29rcy91c2VFcnJvck1lc3NhZ2UnO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IHBhcnNlUmF3QXR0cmlidXRlc1N0cmluZyB9IGZyb20gJ0BzcmMvdXRpbHMvbmZ0cy9tZXRhZGF0YVBhcnNlcic7XG5pbXBvcnQgeyBpc0F2YWxhbmNoZU5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZU5ldHdvcmsnO1xuXG50eXBlIEF0dHJpYnV0ZVR5cG9ncmFwaHlQcm9wcyA9IEV4Y2x1ZGU8VHlwb2dyYXBoeVByb3BzLCAndmFyaWFudCcgfCAnc3gnPjtcblxuY29uc3QgQXR0cmlidXRlTGFiZWwgPSAocHJvcHM6IEF0dHJpYnV0ZVR5cG9ncmFwaHlQcm9wcykgPT4gKFxuICA8VHlwb2dyYXBoeSB7Li4ucHJvcHN9IHZhcmlhbnQ9XCJib2R5MlwiIC8+XG4pO1xuXG5jb25zdCBBdHRyaWJ1dGVEYXRhID0gKHByb3BzOiBBdHRyaWJ1dGVUeXBvZ3JhcGh5UHJvcHMpID0+IChcbiAgPFR5cG9ncmFwaHlcbiAgICB7Li4ucHJvcHN9XG4gICAgdmFyaWFudD1cImg2XCJcbiAgICBzeD17eyB3b3JkV3JhcDogJ2JyZWFrLXdvcmQnLCBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAvPlxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbGxlY3RpYmxlRGV0YWlscygpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCBzZXRDb2xsZWN0aWJsZVBhcmFtcyA9IHVzZVNldENvbGxlY3RpYmxlUGFyYW1zKCk7XG4gIGNvbnN0IHsgbmZ0IH0gPSB1c2VDb2xsZWN0aWJsZUZyb21QYXJhbXMoKTtcbiAgY29uc3QgeyByZWZyZXNoTmZ0TWV0YWRhdGEgfSA9IHVzZUJhbGFuY2VzQ29udGV4dCgpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuXG4gIGNvbnN0IHNlbmRSZWYgPSB1c2VSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+KG51bGwpO1xuXG4gIGNvbnN0IFtzaG93VGh1bWJuYWlsLCBzZXRTaG93VGh1bWJuYWlsXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzUmVmcmVzaGluZywgc2V0SXNSZWZyZXNoaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3dhc1JlZnJlc2hlZCwgc2V0V2FzUmVmcmVzaGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgZ2V0VHJhbnNsYXRlZEVycm9yID0gdXNlRXJyb3JNZXNzYWdlKCk7XG5cbiAgY29uc3QgY2FuUmVmcmVzaE1ldGFkYXRhID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudFRpbWVzdGFtcCA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xuICAgIGNvbnN0IHJlZnJlc2hCYWNrb2ZmID0gMzYwMDtcblxuICAgIGlmICghbmZ0IHx8IHdhc1JlZnJlc2hlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAhbmZ0LnVwZGF0ZWRBdCB8fCBjdXJyZW50VGltZXN0YW1wID4gbmZ0LnVwZGF0ZWRBdCArIHJlZnJlc2hCYWNrb2ZmO1xuICB9LCBbbmZ0LCB3YXNSZWZyZXNoZWRdKTtcblxuICBjb25zdCBtZXRhZGF0YSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBwYXJzZVJhd0F0dHJpYnV0ZXNTdHJpbmcobmZ0Py5tZXRhZGF0YT8ucHJvcGVydGllcyk7XG4gIH0sIFtuZnRdKTtcblxuICBjb25zdCByZWZyZXNoTWV0YWRhdGEgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFuZnQgfHwgIW5ldHdvcmspIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZXRJc1JlZnJlc2hpbmcodHJ1ZSk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgcmVmcmVzaE5mdE1ldGFkYXRhKFxuICAgICAgICBuZnQuYWRkcmVzcyxcbiAgICAgICAgU3RyaW5nKG5ldHdvcmsuY2hhaW5JZCksXG4gICAgICAgIG5mdC50b2tlbklkLFxuICAgICAgKTtcbiAgICAgIHRvYXN0LnN1Y2Nlc3ModCgnTkZUIG1ldGFkYXRhIHdhcyByZWZyZXNoZWQgc3VjY2Vzc2Z1bGx5IScpKTtcbiAgICAgIHNldFdhc1JlZnJlc2hlZCh0cnVlKTtcbiAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgY29uc3QgeyB0aXRsZSwgaGludCB9ID0gZ2V0VHJhbnNsYXRlZEVycm9yKGVycik7XG5cbiAgICAgIHRvYXN0LmN1c3RvbShcbiAgICAgICAgPFRvYXN0Q2FyZCB2YXJpYW50PVwiZXJyb3JcIj5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwic3VidGl0bGUyXCI+e3RpdGxlfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICB7aGludCAmJiAoXG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGNvbG9yPVwidGV4dC5wcmltYXJ5XCI+XG4gICAgICAgICAgICAgIHtoaW50fVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvVG9hc3RDYXJkPixcbiAgICAgICAgeyBkdXJhdGlvbjogNTAwMCB9LFxuICAgICAgKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0SXNSZWZyZXNoaW5nKGZhbHNlKTtcbiAgICB9XG4gIH0sIFtnZXRUcmFuc2xhdGVkRXJyb3IsIG5ldHdvcmssIG5mdCwgcmVmcmVzaE5mdE1ldGFkYXRhLCB0XSk7XG5cbiAgaWYgKCFuZnQpIHtcbiAgICByZXR1cm4gPFJlZGlyZWN0IHRvPXtgL2hvbWU/YWN0aXZlVGFiPSR7UG9ydGZvbGlvVGFicy5DT0xMRUNUSUJMRVN9YH0gLz47XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTdGFja1xuICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICBzeD17eyBtdDogMi41LCBtYjogMC41LCBwcjogMSwgYWxpZ25JdGVtczogJ2NlbnRlcicgfX1cbiAgICAgID5cbiAgICAgICAgPFBhZ2VUaXRsZVxuICAgICAgICAgIG1hcmdpbj1cIjBcIlxuICAgICAgICAgIHRodW1ibmFpbEltYWdlPXtzaG93VGh1bWJuYWlsID8gbmZ0Py5sb2dvVXJpIDogJyd9XG4gICAgICAgID5cbiAgICAgICAgICB7bmZ0Py5uYW1lfVxuICAgICAgICA8L1BhZ2VUaXRsZT5cbiAgICAgICAgey8qIFRoZSByZWZyZXNoIGlzIHRyaWdnZXJpbmcgYSBnbGFjaWVyIHJlaW5kZXguIEV0aGVyZXVtIGlzIHVzaW5nIERlQmFuaywgdGhpcyBjYWxsIGlzIGZhaWxpbmcgb24gdGhhdCBjaGFpbiAqL31cbiAgICAgICAge25ldHdvcmsgJiYgaXNBdmFsYW5jaGVOZXR3b3JrKG5ldHdvcmspICYmIChcbiAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgdGl0bGU9e1xuICAgICAgICAgICAgICBjYW5SZWZyZXNoTWV0YWRhdGFcbiAgICAgICAgICAgICAgICA/ICcnXG4gICAgICAgICAgICAgICAgOiB0KCdSZWZyZXNoIGlzIG9ubHkgYXZhaWxhYmxlIG9uY2UgcGVyIGhvdXIuJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgY29sb3I9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5SZWZyZXNoTWV0YWRhdGEgfHwgaXNSZWZyZXNoaW5nfVxuICAgICAgICAgICAgICBzeD17eyBwOiAwIH19XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3JlZnJlc2hNZXRhZGF0YX1cbiAgICAgICAgICAgICAgZGlzYWJsZVJpcHBsZVxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInJlZnJlc2gtbmZ0LW1ldGFkYXRhXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFJlZnJlc2hJY29uIHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICApfVxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTY3JvbGxiYXJzXG4gICAgICAgIHN0eWxlPXt7IGZsZXhHcm93OiAxLCBtYXhIZWlnaHQ6ICd1bnNldCcsIGhlaWdodDogJzEwMCUnIH19XG4gICAgICAgIG9uU2Nyb2xsRnJhbWU9eyh7IHNjcm9sbFRvcCB9KSA9PiB7XG4gICAgICAgICAgLy8gb2Zmc2V0VG9wIGNvcnJlY3RlZCB3aXRoIG1hcmdpblxuICAgICAgICAgIGlmIChzZW5kUmVmLmN1cnJlbnQgJiYgc2Nyb2xsVG9wID49IHNlbmRSZWYuY3VycmVudC5vZmZzZXRUb3AgLSAyNCkge1xuICAgICAgICAgICAgc2V0U2hvd1RodW1ibmFpbCh0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0U2hvd1RodW1ibmFpbChmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpc1JlZnJlc2hpbmcgPyAoXG4gICAgICAgICAgICA8U2tlbGV0b24gdmFyaWFudD1cInJlY3Rhbmd1bGFyXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMzAwcHhcIiAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8Q29sbGVjdGlibGVNZWRpYVxuICAgICAgICAgICAgICB3aWR0aD1cIjM0M3B4XCJcbiAgICAgICAgICAgICAgaGVpZ2h0PVwiYXV0b1wiXG4gICAgICAgICAgICAgIHVybD17bmZ0Py5sb2dvVXJpfVxuICAgICAgICAgICAgICBob3Zlcj17ZmFsc2V9XG4gICAgICAgICAgICAgIG1hcmdpbj1cIjhweCAwXCJcbiAgICAgICAgICAgICAgY29udHJvbHM9e3RydWV9XG4gICAgICAgICAgICAgIHNob3dQbGF5SWNvbj17ZmFsc2V9XG4gICAgICAgICAgICAgIHNob3dCYWxhbmNlPXtUb2tlblR5cGUuRVJDMTE1NSA9PT0gbmZ0LnR5cGV9XG4gICAgICAgICAgICAgIGJhbGFuY2U9e25mdC5iYWxhbmNlfVxuICAgICAgICAgICAgICBzaG93RXhwYW5kT3B0aW9uPXt0cnVlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBteTogMyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGNhcHR1cmUoJ0NvbGxlY3RpYmxlU2VuZENsaWNrZWQnLCB7XG4gICAgICAgICAgICAgICAgY2hhaW5JZDogbmV0d29yaz8uY2hhaW5JZCxcbiAgICAgICAgICAgICAgICB0eXBlOiBuZnQudHlwZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHNldENvbGxlY3RpYmxlUGFyYW1zKHtcbiAgICAgICAgICAgICAgICBuZnQsXG4gICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgcGF0aDogJy9jb2xsZWN0aWJsZS9zZW5kJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICByZWY9e3NlbmRSZWZ9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ1NlbmQnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIj57dCgnRGVzY3JpcHRpb24nKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBtdDogMixcbiAgICAgICAgICAgICAgbWI6IDQsXG4gICAgICAgICAgICAgIGdhcDogJzE1cHgnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgIDxBdHRyaWJ1dGVMYWJlbD57dCgnQ29sbGVjdGlvbicpfTwvQXR0cmlidXRlTGFiZWw+XG4gICAgICAgICAgICAgIDxBdHRyaWJ1dGVEYXRhPntuZnQuY29sbGVjdGlvbk5hbWV9PC9BdHRyaWJ1dGVEYXRhPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgPEF0dHJpYnV0ZUxhYmVsPnt0KCdEZXNjcmlwdGlvbicpfTwvQXR0cmlidXRlTGFiZWw+XG4gICAgICAgICAgICAgIDxBdHRyaWJ1dGVEYXRhPntuZnQ/LmRlc2NyaXB0aW9ufTwvQXR0cmlidXRlRGF0YT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICAgIHttZXRhZGF0YS5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPnt0KCdQcm9wZXJ0aWVzJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBwdDogMixcbiAgICAgICAgICAgICAgcGI6IDQsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHttZXRhZGF0YS5tYXAoKGF0dHJpYnV0ZSwgaSkgPT4gKFxuICAgICAgICAgICAgICA8U3RhY2sga2V5PXtpfT5cbiAgICAgICAgICAgICAgICB7aSAhPT0gMCAmJiA8RGl2aWRlciBzeD17eyBteTogMiB9fSAvPn1cbiAgICAgICAgICAgICAgICA8QXR0cmlidXRlTGFiZWw+e2F0dHJpYnV0ZS5uYW1lfTwvQXR0cmlidXRlTGFiZWw+XG4gICAgICAgICAgICAgICAgPEF0dHJpYnV0ZURhdGE+e2F0dHJpYnV0ZS52YWx1ZX08L0F0dHJpYnV0ZURhdGE+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TY3JvbGxiYXJzPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VOZnRzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VOZnRzJztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IHhzcyBmcm9tICd4c3MnO1xuXG5leHBvcnQgY29uc3QgdXNlQ29sbGVjdGlibGVGcm9tUGFyYW1zID0gKCkgPT4ge1xuICBjb25zdCB7IHNlYXJjaCB9ID0gdXNlTG9jYXRpb24oKTtcbiAgY29uc3QgbmZ0cyA9IHVzZU5mdHMoKTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgeyBuZnQsIHRva2VuSWQgfSA9IChPYmplY3QgYXMgYW55KS5mcm9tRW50cmllcyhcbiAgICAgIChuZXcgVVJMU2VhcmNoUGFyYW1zKHNlYXJjaCkgYXMgYW55KS5lbnRyaWVzKCksXG4gICAgKTtcblxuICAgIGlmICghbmZ0IHx8ICF0b2tlbklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZnQ6IHVuZGVmaW5lZCxcbiAgICAgICAgdG9rZW5JZDogeHNzKHRva2VuSWQpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXJlZEFkZHJlc3MgPSB4c3MobmZ0KTtcblxuICAgIHJldHVybiB7XG4gICAgICBuZnQ6IG5mdHM/LmZpbmQoXG4gICAgICAgIChpdGVtKSA9PiBpdGVtLmFkZHJlc3MgPT09IGZpbHRlcmVkQWRkcmVzcyAmJiBpdGVtLnRva2VuSWQgPT09IHRva2VuSWQsXG4gICAgICApLFxuICAgICAgdG9rZW5JZDogeHNzKHRva2VuSWQpLFxuICAgIH07XG4gIH0sIFtuZnRzLCBzZWFyY2hdKTtcbn07XG4iLCJpbXBvcnQge1xuICBSYXdUb2tlbkF0dHJpYnV0ZSxcbiAgVG9rZW5BdHRyaWJ1dGUsXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9iYWxhbmNlcy9tb2RlbHMnO1xuXG5leHBvcnQgY29uc3QgcGFyc2VBdHRyaWJ1dGVzID0gKGF0dHJpYnV0ZXMpID0+IHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXR0cmlidXRlcylcbiAgICA/IHBhcnNlUmF3QXR0cmlidXRlc0FycmF5KGF0dHJpYnV0ZXMpXG4gICAgOiBhdHRyaWJ1dGVzID09PSAnc3RyaW5nJ1xuICAgICAgPyBwYXJzZVJhd0F0dHJpYnV0ZXNTdHJpbmcoYXR0cmlidXRlcylcbiAgICAgIDogYXR0cmlidXRlcztcbn07XG5cbmV4cG9ydCBjb25zdCBwYXJzZVJhd0F0dHJpYnV0ZXNTdHJpbmcgPSAocmF3QXR0cmlidXRlc1N0cmluZz86IHN0cmluZykgPT4ge1xuICBpZiAocmF3QXR0cmlidXRlc1N0cmluZyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XG4gIGNvbnN0IHJhd0F0dHJpYnV0ZXM6IFJhd1Rva2VuQXR0cmlidXRlW10gPSByYXdBdHRyaWJ1dGVzU3RyaW5nXG4gICAgPyBKU09OLnBhcnNlKHJhd0F0dHJpYnV0ZXNTdHJpbmcpXG4gICAgOiBbXTtcblxuICBjb25zdCBwYXJzZWRBdHRyaWJ1dGVzID0gcmF3QXR0cmlidXRlcy5yZWR1Y2UoXG4gICAgKGFjYzogVG9rZW5BdHRyaWJ1dGVbXSwgYXR0cikgPT4gW1xuICAgICAgLi4uYWNjLFxuICAgICAge1xuICAgICAgICBuYW1lOiBhdHRyLm5hbWUgPz8gYXR0ci50cmFpdF90eXBlLFxuICAgICAgICB2YWx1ZTogYXR0ci52YWx1ZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBbXSxcbiAgKTtcblxuICByZXR1cm4gcGFyc2VkQXR0cmlidXRlcztcbn07XG5cbmNvbnN0IHBhcnNlUmF3QXR0cmlidXRlc0FycmF5ID0gKFxuICByYXdBdHRyaWJ1dGVzQXJyYXk6XG4gICAgfCB7IHRyYWl0X3R5cGU/OiBzdHJpbmc7IG5hbWU/OiBzdHJpbmc7IHZhbHVlOiBzdHJpbmcgfVtdXG4gICAgfCB1bmRlZmluZWQsXG4pID0+IHtcbiAgaWYgKHJhd0F0dHJpYnV0ZXNBcnJheSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XG5cbiAgY29uc3QgcGFyc2VkQXR0cmlidXRlcyA9IHJhd0F0dHJpYnV0ZXNBcnJheS5tYXAoKGF0dHIpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogYXR0ci5uYW1lID8/IGF0dHIudHJhaXRfdHlwZSxcbiAgICAgIHZhbHVlOiBhdHRyLnZhbHVlLFxuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWRBdHRyaWJ1dGVzO1xufTtcbiJdLCJuYW1lcyI6WyJDdXN0b21TY3JvbGxiYXJzIiwiZm9yd2FyZFJlZiIsInVzZVRoZW1lIiwiU2Nyb2xsYmFycyIsInByb3BzIiwicmVmIiwidGhlbWUiLCJyZW5kZXJUaHVtYiIsInN0eWxlIiwicmVzdCIsInRodW1iU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwYWxldHRlIiwiZ3JleSIsImJvcmRlclJhZGl1cyIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIl9leHRlbmRzIiwicmVuZGVyVGh1bWJWZXJ0aWNhbCIsIkJ1dHRvbiIsIkRpdmlkZXIiLCJSZWZyZXNoSWNvbiIsIlNrZWxldG9uIiwiU3RhY2siLCJUb2FzdENhcmQiLCJUb29sdGlwIiwiVHlwb2dyYXBoeSIsInRvYXN0IiwiUGFnZVRpdGxlIiwidXNlQ2FsbGJhY2siLCJ1c2VNZW1vIiwidXNlUmVmIiwidXNlU3RhdGUiLCJSZWRpcmVjdCIsIkNvbGxlY3RpYmxlTWVkaWEiLCJ1c2VDb2xsZWN0aWJsZUZyb21QYXJhbXMiLCJ1c2VTZXRDb2xsZWN0aWJsZVBhcmFtcyIsInVzZVRyYW5zbGF0aW9uIiwiUG9ydGZvbGlvVGFicyIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJ1c2VOZXR3b3JrQ29udGV4dCIsInVzZUJhbGFuY2VzQ29udGV4dCIsInVzZUVycm9yTWVzc2FnZSIsIlRva2VuVHlwZSIsInBhcnNlUmF3QXR0cmlidXRlc1N0cmluZyIsImlzQXZhbGFuY2hlTmV0d29yayIsIkF0dHJpYnV0ZUxhYmVsIiwidmFyaWFudCIsIkF0dHJpYnV0ZURhdGEiLCJzeCIsIndvcmRXcmFwIiwiZm9udFdlaWdodCIsIkNvbGxlY3RpYmxlRGV0YWlscyIsInQiLCJzZXRDb2xsZWN0aWJsZVBhcmFtcyIsIm5mdCIsInJlZnJlc2hOZnRNZXRhZGF0YSIsImNhcHR1cmUiLCJuZXR3b3JrIiwic2VuZFJlZiIsInNob3dUaHVtYm5haWwiLCJzZXRTaG93VGh1bWJuYWlsIiwiaXNSZWZyZXNoaW5nIiwic2V0SXNSZWZyZXNoaW5nIiwid2FzUmVmcmVzaGVkIiwic2V0V2FzUmVmcmVzaGVkIiwiZ2V0VHJhbnNsYXRlZEVycm9yIiwiY2FuUmVmcmVzaE1ldGFkYXRhIiwiY3VycmVudFRpbWVzdGFtcCIsIk1hdGgiLCJmbG9vciIsIkRhdGUiLCJub3ciLCJyZWZyZXNoQmFja29mZiIsInVwZGF0ZWRBdCIsIm1ldGFkYXRhIiwicHJvcGVydGllcyIsInJlZnJlc2hNZXRhZGF0YSIsImFkZHJlc3MiLCJTdHJpbmciLCJjaGFpbklkIiwidG9rZW5JZCIsInN1Y2Nlc3MiLCJlcnIiLCJ0aXRsZSIsImhpbnQiLCJjdXN0b20iLCJjb2xvciIsImR1cmF0aW9uIiwidG8iLCJDT0xMRUNUSUJMRVMiLCJ3aWR0aCIsImhlaWdodCIsImRpcmVjdGlvbiIsIm10IiwibWIiLCJwciIsImFsaWduSXRlbXMiLCJtYXJnaW4iLCJ0aHVtYm5haWxJbWFnZSIsImxvZ29VcmkiLCJuYW1lIiwic2l6ZSIsImRpc2FibGVkIiwicCIsIm9uQ2xpY2siLCJkaXNhYmxlUmlwcGxlIiwiZmxleEdyb3ciLCJtYXhIZWlnaHQiLCJvblNjcm9sbEZyYW1lIiwic2Nyb2xsVG9wIiwiY3VycmVudCIsIm9mZnNldFRvcCIsInB4IiwidXJsIiwiaG92ZXIiLCJjb250cm9scyIsInNob3dQbGF5SWNvbiIsInNob3dCYWxhbmNlIiwiRVJDMTE1NSIsInR5cGUiLCJiYWxhbmNlIiwic2hvd0V4cGFuZE9wdGlvbiIsIm15Iiwib3B0aW9ucyIsInBhdGgiLCJnYXAiLCJjb2xsZWN0aW9uTmFtZSIsImRlc2NyaXB0aW9uIiwibGVuZ3RoIiwicHQiLCJwYiIsIm1hcCIsImF0dHJpYnV0ZSIsImkiLCJrZXkiLCJ2YWx1ZSIsInVzZU5mdHMiLCJ1c2VMb2NhdGlvbiIsInhzcyIsInNlYXJjaCIsIm5mdHMiLCJPYmplY3QiLCJmcm9tRW50cmllcyIsIlVSTFNlYXJjaFBhcmFtcyIsImVudHJpZXMiLCJ1bmRlZmluZWQiLCJmaWx0ZXJlZEFkZHJlc3MiLCJmaW5kIiwiaXRlbSIsInBhcnNlQXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJBcnJheSIsImlzQXJyYXkiLCJwYXJzZVJhd0F0dHJpYnV0ZXNBcnJheSIsInJhd0F0dHJpYnV0ZXNTdHJpbmciLCJyYXdBdHRyaWJ1dGVzIiwiSlNPTiIsInBhcnNlIiwicGFyc2VkQXR0cmlidXRlcyIsInJlZHVjZSIsImFjYyIsImF0dHIiLCJ0cmFpdF90eXBlIiwicmF3QXR0cmlidXRlc0FycmF5Il0sInNvdXJjZVJvb3QiOiIifQ==