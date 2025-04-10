"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ManageCollectibles_ManageCollectibles_tsx"],{

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

/***/ "./src/hooks/useNfts.ts":
/*!******************************!*\
  !*** ./src/hooks/useNfts.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useNfts": () => (/* binding */ useNfts)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/getAddressForChain */ "./src/utils/getAddressForChain.ts");





const useNfts = () => {
  const {
    balances
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__.useBalancesContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!network || !balances.nfts || !activeAccount) {
      return [];
    }
    const userAddress = (0,_src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_4__.getAddressForChain)(network, activeAccount);
    if (!userAddress) {
      return [];
    }
    return Object.values(balances.nfts?.[network.chainId]?.[userAddress] ?? {});
  }, [network, balances.nfts, activeAccount]);
};

/***/ }),

/***/ "./src/pages/Collectibles/components/CollectibleListEmpty.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/Collectibles/components/CollectibleListEmpty.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CollectibleListEmpty": () => (/* binding */ CollectibleListEmpty)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function CollectibleListEmpty() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_0__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      alignItems: 'center',
      flexGrow: '1',
      rowGap: 1,
      mt: 7
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h5"
  }, t('No Collectibles')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('You don’t have any NFTs yet!')));
}

/***/ }),

/***/ "./src/pages/Collectibles/components/CollectibleMedia.tsx":
/*!****************************************************************!*\
  !*** ./src/pages/Collectibles/components/CollectibleMedia.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CollectibleMedia": () => (/* binding */ CollectibleMedia)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/pages/Collectibles/utils.ts");
/* harmony import */ var _ImageWrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ImageWrapper */ "./src/pages/Collectibles/components/ImageWrapper.tsx");
/* harmony import */ var _src_components_common_ImageWithFallback__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/ImageWithFallback */ "./src/components/common/ImageWithFallback.tsx");
/* harmony import */ var _src_utils_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/ipsfResolverWithFallback */ "./src/utils/ipsfResolverWithFallback.ts");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






const NftImage = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"])(_src_components_common_ImageWithFallback__WEBPACK_IMPORTED_MODULE_3__.ImageWithFallback)`
  width: ${({
  width
}) => width ?? '32px'};
  height: ${({
  height
}) => height ?? '32px'};
  max-width: ${({
  maxWidth
}) => maxWidth ?? 'unset'};
  max-height: ${({
  maxHeight
}) => maxHeight ?? 'unset'};
  border: 1px solid ${({
  theme
}) => `${theme.palette.common.black}1A`};
  box-sizing: border-box;
  filter: drop-shadow(
    0px 10px 25px ${({
  theme
}) => `${theme.palette.common.black}40`}
  );
  backdrop-filter: blur(25px);
  border-radius: ${({
  hasBorderRadius,
  borderRadius
}) => hasBorderRadius ? borderRadius ?? '8px' : 'none'};
  cursor: ${({
  showPointer
}) => showPointer ? 'default' : 'pointer'};
`;
const NftVideo = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"])('video')`
  width: ${({
  width
}) => width ?? '32px'};
  max-width: ${({
  maxWidth
}) => maxWidth ?? 'unset'};
  height: ${({
  height
}) => height ?? '32px'};
  max-height: ${({
  maxHeight
}) => maxHeight ?? 'unset'};
  border: 1px solid ${({
  theme
}) => `${theme.palette.common.black}1A`};
  box-sizing: border-box;
  filter: drop-shadow(
    0px 10px 25px ${({
  theme
}) => `${theme.palette.common.black}40`}
  );
  backdrop-filter: blur(25px);
  border-radius: ${({
  borderRadius
}) => borderRadius ?? '8px'};
`;
function CollectibleMedia({
  url,
  width,
  height,
  maxWidth,
  maxHeight,
  hover = false,
  margin,
  showPlayIcon = true,
  controls = false,
  className,
  borderRadius = '8px',
  showBalance = false,
  balance = 0n,
  showExpandOption = false,
  noAction = false
}) {
  const [isImageFullScreen, setIsImageFullScreen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [shouldUseLightIcon, setShouldUseLightIcon] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isMediaSettled, setIsMediaSettled] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false); // Either loaded or errored out.

  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      margin,
      flexDirection: 'row'
    },
    className: className
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexDirection: 'row',
      maxWidth: maxWidth ? maxWidth : 'unset',
      width: width ? width : '32px',
      position: 'absolute',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      columnGap: 1,
      zIndex: 3,
      mr: 3,
      mt: 1,
      pr: 1
    }
  }, showBalance && isMediaSettled && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Chip, {
    size: "small",
    sx: {
      backgroundColor: theme => shouldUseLightIcon ? 'primary.light' : theme.palette.grey[600],
      color: shouldUseLightIcon ? 'primary.contrastText' : 'primary.light',
      px: 1
    },
    label: balance.toString()
  }), showExpandOption && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ArrowsMaximizeIcon, {
    onClick: () => {
      setIsImageFullScreen(true);
    },
    size: "24",
    sx: {
      color: shouldUseLightIcon ? 'primary.light' : 'primary.contrastText',
      cursor: 'pointer'
    }
  })), (0,_utils__WEBPACK_IMPORTED_MODULE_1__.isVideo)(url) ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      position: 'relative',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(NftVideo, {
    width: width,
    height: height,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
    hover: hover,
    controls: controls,
    borderRadius: borderRadius
  }, /*#__PURE__*/React.createElement("source", {
    src: (0,_src_utils_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_4__.ipfsResolverWithFallback)(url),
    onLoadStart: () => setIsMediaSettled(true)
  })), showPlayIcon && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.TriangleRightIcon, {
    sx: {
      position: 'absolute',
      bottom: '8px',
      right: '8px',
      color: 'common.white'
    }
  })) : /*#__PURE__*/React.createElement(_ImageWrapper__WEBPACK_IMPORTED_MODULE_2__.ImageWrapper, {
    isOverlay: isImageFullScreen,
    onClick: () => {
      if (!showBalance && !noAction) setIsImageFullScreen(true);
    },
    onClose: () => setIsImageFullScreen(false),
    backdropImageUrl: url,
    shouldUseLightIcon: shouldUseLightIcon
  }, /*#__PURE__*/React.createElement(NftImage, {
    width: isImageFullScreen ? '100%' : width,
    height: isImageFullScreen ? 'auto' : height,
    src: url,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
    hover: hover,
    hasBorderRadius: !isImageFullScreen,
    borderRadius: borderRadius,
    showPointer: showExpandOption,
    onLoad: event => {
      const imageElement = event.target;
      if (imageElement instanceof HTMLImageElement) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.isImageDark)(imageElement, isDark => {
          setShouldUseLightIcon(isDark);
        });
      }
      setIsMediaSettled(true);
    },
    onError: () => setIsMediaSettled(true)
  })));
}

/***/ }),

/***/ "./src/pages/Collectibles/components/ImageWrapper.tsx":
/*!************************************************************!*\
  !*** ./src/pages/Collectibles/components/ImageWrapper.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageWrapper": () => (/* binding */ ImageWrapper)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function ImageWrapper({
  isOverlay,
  onClick,
  onClose,
  backdropImageUrl,
  shouldUseLightIcon,
  children
}) {
  if (isOverlay) {
    return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__.Overlay, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Box, {
      sx: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backdropImageUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(16px)'
      }
    }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
      sx: {
        height: '100%',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
      sx: {
        px: 1,
        py: 4,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
      onClick: onClose,
      "data-testid": "page-title-back-button",
      disableRipple: true,
      sx: {
        p: 0
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ChevronLeftIcon, {
      size: 32,
      sx: {
        color: shouldUseLightIcon ? 'primary.light' : 'primary.contrastText'
      }
    }))), children));
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    onClick: onClick,
    sx: {
      width: '100%',
      flexDirection: 'row'
    }
  }, children);
}

/***/ }),

/***/ "./src/pages/Collectibles/utils.ts":
/*!*****************************************!*\
  !*** ./src/pages/Collectibles/utils.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isImageDark": () => (/* binding */ isImageDark),
/* harmony export */   "isVideo": () => (/* binding */ isVideo)
/* harmony export */ });
const isVideo = url => url && ['.mp4', '.webm', '.ogg'].includes(url.slice(url.lastIndexOf('.')));
const isImageDark = (img, callback) => {
  let colorSum = 0;
  if (!img) {
    // Default value is true (Dark image Mode)
    return callback(true);
  }
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // Default value is true (Dark image Mode)
      return callback(true);
    }
    ctx.drawImage(img, 0, 0);

    // we need to know the top right quater's average color
    const height = Math.floor(canvas.height / 2);
    const width = Math.floor(canvas.width / 2);
    const imageData = ctx.getImageData(width, 0, width, height);
    const data = imageData.data;
    for (let x = 0, len = data.length; x < len; x += 4) {
      const r = data[x];
      const g = data[x + 1];
      const b = data[x + 2];
      if (r === undefined || g === undefined || b === undefined) {
        throw new Error('Undefined color');
      }
      const avg = Math.floor((r + g + b) / 3);
      colorSum += avg;
    }
    const brightness = Math.floor(colorSum / (width * height));
    //Brightness is out of 255.
    return callback(brightness < 127.5);
  } catch {
    // Default value is true (Dark image Mode)
    return callback(true);
  }
};

/***/ }),

/***/ "./src/pages/ManageCollectibles/ManageCollectibles.tsx":
/*!*************************************************************!*\
  !*** ./src/pages/ManageCollectibles/ManageCollectibles.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ManageCollectibles": () => (/* binding */ ManageCollectibles)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/scrollbars/Scrollbars */ "./src/components/common/scrollbars/Scrollbars.tsx");
/* harmony import */ var _ManageCollectiblesList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ManageCollectiblesList */ "./src/pages/ManageCollectibles/ManageCollectiblesList.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






const ManageCollectibles = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitle, null, t('Manage Collectibles')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      flexGrow: 1,
      width: '100%',
      py: 1,
      px: 2,
      rowGap: '30px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.SearchBar, {
    "data-testid": "search-collectibles-list-input",
    placeholder: t('Search'),
    onChange: event => {
      setSearchQuery(event.target.value);
    },
    autoFocus: true
  }), /*#__PURE__*/React.createElement(_src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__.Scrollbars, {
    style: {
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement(_ManageCollectiblesList__WEBPACK_IMPORTED_MODULE_3__.ManageCollectiblesList, {
    searchQuery: searchQuery
  }))));
};

/***/ }),

/***/ "./src/pages/ManageCollectibles/ManageCollectiblesList.tsx":
/*!*****************************************************************!*\
  !*** ./src/pages/ManageCollectibles/ManageCollectiblesList.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ManageCollectiblesList": () => (/* binding */ ManageCollectiblesList),
/* harmony export */   "ManageCollectiblesListItem": () => (/* binding */ ManageCollectiblesListItem)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_pages_Collectibles_components_CollectibleListEmpty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Collectibles/components/CollectibleListEmpty */ "./src/pages/Collectibles/components/CollectibleListEmpty.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_pages_Collectibles_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/pages/Collectibles/components/CollectibleMedia */ "./src/pages/Collectibles/components/CollectibleMedia.tsx");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_hooks_useNfts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useNfts */ "./src/hooks/useNfts.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






const ManageCollectiblesList = ({
  searchQuery
}) => {
  const nfts = (0,_src_hooks_useNfts__WEBPACK_IMPORTED_MODULE_4__.useNfts)();
  if (nfts?.length === 0) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      sx: {
        flexGrow: 1,
        pb: 9,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(_src_pages_Collectibles_components_CollectibleListEmpty__WEBPACK_IMPORTED_MODULE_0__.CollectibleListEmpty, null));
  }
  const displayableNfts = nfts?.filter(nft => {
    if (!searchQuery.length) {
      return true;
    }
    return nft.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      rowGap: '10px'
    },
    "data-testid": "manage-collectibles-list",
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Divider, {
      flexItem: true,
      sx: {
        borderColor: 'grey.800'
      }
    })
  }, displayableNfts?.map(nft => /*#__PURE__*/React.createElement(ManageCollectiblesListItem, {
    nft: nft,
    key: `collectible-${nft.address}-${nft.tokenId}`
  })));
};
const ManageCollectiblesListItem = ({
  nft
}) => {
  const {
    getCollectibleVisibility,
    toggleCollectibleVisibility
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__.useSettingsContext)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    "data-testid": `${nft.name.toLowerCase()}-collectible-list-item`,
    justifyContent: "space-between",
    alignItems: "center",
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(_src_pages_Collectibles_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_2__.CollectibleMedia, {
    height: "32px",
    width: "auto",
    maxWidth: "32px",
    url: nft?.logoSmall,
    hover: false,
    margin: "8px 0",
    showPlayIcon: false,
    noAction: true
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      mx: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    sx: {
      mb: 0.5
    },
    fontWeight: "fontWeightSemibold"
  }, nft.name), nft.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__.TokenType.ERC1155 ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    sx: {
      mb: 0.5
    }
  }, nft.balance.toString()) : null)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Switch, {
    size: "small",
    checked: getCollectibleVisibility(nft),
    onChange: () => toggleCollectibleVisibility(nft)
  }));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX01hbmFnZUNvbGxlY3RpYmxlc19NYW5hZ2VDb2xsZWN0aWJsZXNfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQThEO0FBQ2hCO0FBQ1M7QUFJdkQ7QUFDQTtBQUNPLE1BQU1HLFVBQVUsZ0JBQUdGLGlEQUFVLENBQUMsU0FBU0UsVUFBVUEsQ0FDdERDLEtBQXNDLEVBQ3RDQyxHQUF5QyxFQUN6QztFQUNBLE1BQU1DLEtBQUssR0FBR0osdUVBQVEsRUFBRTtFQUN4QixNQUFNSyxXQUFXLEdBQUdBLENBQUM7SUFBRUMsS0FBSztJQUFFLEdBQUdDO0VBQUssQ0FBQyxLQUFLO0lBQzFDLE1BQU1DLFVBQVUsR0FBRztNQUNqQkMsZUFBZSxFQUFFTCxLQUFLLENBQUNNLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDLEdBQUcsQ0FBQztNQUN4Q0MsWUFBWSxFQUFFO0lBQ2hCLENBQUM7SUFDRCxvQkFBT0MsS0FBQSxDQUFBQyxhQUFBLFFBQUFDLDBFQUFBO01BQUtULEtBQUssRUFBRTtRQUFFLEdBQUdBLEtBQUs7UUFBRSxHQUFHRTtNQUFXO0lBQUUsR0FBS0QsSUFBSSxFQUFJO0VBQzlELENBQUM7RUFFRCxvQkFDRU0sS0FBQSxDQUFBQyxhQUFBLENBQUNoQixpRUFBMkIsRUFBQWlCLDBFQUFBO0lBQzFCQyxtQkFBbUIsRUFBRVgsV0FBWTtJQUNqQ0YsR0FBRyxFQUFFQTtFQUFJLEdBQ0xELEtBQUssRUFDVDtBQUVOLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCOEI7QUFDb0M7QUFDQTtBQUNGO0FBQ0M7QUFHNUQsTUFBTW9CLE9BQU8sR0FBR0EsQ0FBQSxLQUFNO0VBQzNCLE1BQU07SUFBRUM7RUFBUyxDQUFDLEdBQUdMLGtGQUFrQixFQUFFO0VBQ3pDLE1BQU07SUFDSk0sUUFBUSxFQUFFO01BQUVDLE1BQU0sRUFBRUM7SUFBYztFQUNwQyxDQUFDLEdBQUdQLGtGQUFrQixFQUFFO0VBQ3hCLE1BQU07SUFB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LGFBQUEsQ0FBQ21CLG1FQUFVO0lBQUNLLEVBQUUsRUFBRTtNQUFFaUosRUFBRSxFQUFFO0lBQUk7RUFBRSxHQUFFaEIsR0FBRyxDQUFDOUYsT0FBTyxDQUFDbUIsUUFBUSxFQUFFLENBQWMsR0FDaEUsSUFBSSxDQUNGLENBQ0YsZUFDUi9FLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbUosK0RBQU07SUFDTHhFLElBQUksRUFBQyxPQUFPO0lBQ1prRyxPQUFPLEVBQUVULHdCQUF3QixDQUFDWCxHQUFHLENBQUU7SUFDdkNWLFFBQVEsRUFBRUEsQ0FBQSxLQUFNc0IsMkJBQTJCLENBQUNaLEdBQUc7RUFBRSxFQUNqRCxDQUNJO0FBRVosQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2Nyb2xsYmFycy9TY3JvbGxiYXJzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZU5mdHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvY29tcG9uZW50cy9Db2xsZWN0aWJsZUxpc3RFbXB0eS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvY29tcG9uZW50cy9Db2xsZWN0aWJsZU1lZGlhLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0NvbGxlY3RpYmxlcy9jb21wb25lbnRzL0ltYWdlV3JhcHBlci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9NYW5hZ2VDb2xsZWN0aWJsZXMvTWFuYWdlQ29sbGVjdGlibGVzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL01hbmFnZUNvbGxlY3RpYmxlcy9NYW5hZ2VDb2xsZWN0aWJsZXNMaXN0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBDdXN0b21TY3JvbGxiYXJzIGZyb20gJ3JlYWN0LWN1c3RvbS1zY3JvbGxiYXJzLTInO1xuaW1wb3J0IHsgZm9yd2FyZFJlZiwgTGVnYWN5UmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVGhlbWUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgdHlwZSBTY3JvbGxiYXJzUmVmID0gQ3VzdG9tU2Nyb2xsYmFycy5TY3JvbGxiYXJzO1xuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JvYlBldGhpY2svcmVhY3QtY3VzdG9tLXNjcm9sbGJhcnMtMi9ibG9iL21hc3Rlci9kb2NzL0FQSS5tZFxuLy8gZm9yIGF2YWlsYWJsZSBwcm9wc1xuZXhwb3J0IGNvbnN0IFNjcm9sbGJhcnMgPSBmb3J3YXJkUmVmKGZ1bmN0aW9uIFNjcm9sbGJhcnMoXG4gIHByb3BzOiBDdXN0b21TY3JvbGxiYXJzLlNjcm9sbGJhclByb3BzLFxuICByZWY6IExlZ2FjeVJlZjxTY3JvbGxiYXJzUmVmPiB8IHVuZGVmaW5lZCxcbikge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHJlbmRlclRodW1iID0gKHsgc3R5bGUsIC4uLnJlc3QgfSkgPT4ge1xuICAgIGNvbnN0IHRodW1iU3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuZ3JleVs4MDBdLFxuICAgICAgYm9yZGVyUmFkaXVzOiA5OTk5LFxuICAgIH07XG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3sgLi4uc3R5bGUsIC4uLnRodW1iU3R5bGUgfX0gey4uLnJlc3R9IC8+O1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEN1c3RvbVNjcm9sbGJhcnMuU2Nyb2xsYmFyc1xuICAgICAgcmVuZGVyVGh1bWJWZXJ0aWNhbD17cmVuZGVyVGh1bWJ9XG4gICAgICByZWY9e3JlZn1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApO1xufSk7XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlQmFsYW5jZXNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9CYWxhbmNlc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IGdldEFkZHJlc3NGb3JDaGFpbiB9IGZyb20gJ0BzcmMvdXRpbHMvZ2V0QWRkcmVzc0ZvckNoYWluJztcbmltcG9ydCB7IE5mdFRva2VuV2l0aEJhbGFuY2UgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgdXNlTmZ0cyA9ICgpID0+IHtcbiAgY29uc3QgeyBiYWxhbmNlcyB9ID0gdXNlQmFsYW5jZXNDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IG5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG5cbiAgcmV0dXJuIHVzZU1lbW88TmZ0VG9rZW5XaXRoQmFsYW5jZVtdPigoKSA9PiB7XG4gICAgaWYgKCFuZXR3b3JrIHx8ICFiYWxhbmNlcy5uZnRzIHx8ICFhY3RpdmVBY2NvdW50KSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IHVzZXJBZGRyZXNzID0gZ2V0QWRkcmVzc0ZvckNoYWluKG5ldHdvcmssIGFjdGl2ZUFjY291bnQpO1xuXG4gICAgaWYgKCF1c2VyQWRkcmVzcykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGJhbGFuY2VzLm5mdHM/LltuZXR3b3JrLmNoYWluSWRdPy5bdXNlckFkZHJlc3NdID8/IHt9KTtcbiAgfSwgW25ldHdvcmssIGJhbGFuY2VzLm5mdHMsIGFjdGl2ZUFjY291bnRdKTtcbn07XG4iLCJpbXBvcnQgeyBUeXBvZ3JhcGh5LCBTdGFjayB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5leHBvcnQgZnVuY3Rpb24gQ29sbGVjdGlibGVMaXN0RW1wdHkoKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBmbGV4R3JvdzogJzEnLFxuICAgICAgICByb3dHYXA6IDEsXG4gICAgICAgIG10OiA3LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIj57dCgnTm8gQ29sbGVjdGlibGVzJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgIHt0KCdZb3UgZG9u4oCZdCBoYXZlIGFueSBORlRzIHlldCEnKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBpc1ZpZGVvLCBpc0ltYWdlRGFyayB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEltYWdlV3JhcHBlciB9IGZyb20gJy4vSW1hZ2VXcmFwcGVyJztcbmltcG9ydCB7IEltYWdlV2l0aEZhbGxiYWNrIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9JbWFnZVdpdGhGYWxsYmFjayc7XG5pbXBvcnQgeyBpcGZzUmVzb2x2ZXJXaXRoRmFsbGJhY2sgfSBmcm9tICdAc3JjL3V0aWxzL2lwc2ZSZXNvbHZlcldpdGhGYWxsYmFjayc7XG5pbXBvcnQge1xuICBDaGlwLFxuICBTdGFjayxcbiAgc3R5bGVkLFxuICBUcmlhbmdsZVJpZ2h0SWNvbixcbiAgQXJyb3dzTWF4aW1pemVJY29uLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5jb25zdCBOZnRJbWFnZSA9IHN0eWxlZChJbWFnZVdpdGhGYWxsYmFjayk8e1xuICB3aWR0aD86IHN0cmluZztcbiAgaGVpZ2h0Pzogc3RyaW5nO1xuICBtYXhXaWR0aD86IHN0cmluZztcbiAgbWF4SGVpZ2h0Pzogc3RyaW5nO1xuICBob3Zlcj86IGJvb2xlYW47XG4gIGhhc0JvcmRlclJhZGl1cz86IGJvb2xlYW47XG4gIGJvcmRlclJhZGl1cz86IHN0cmluZztcbiAgc2hvd1BvaW50ZXI/OiBib29sZWFuO1xufT5gXG4gIHdpZHRoOiAkeyh7IHdpZHRoIH0pID0+IHdpZHRoID8/ICczMnB4J307XG4gIGhlaWdodDogJHsoeyBoZWlnaHQgfSkgPT4gaGVpZ2h0ID8/ICczMnB4J307XG4gIG1heC13aWR0aDogJHsoeyBtYXhXaWR0aCB9KSA9PiBtYXhXaWR0aCA/PyAndW5zZXQnfTtcbiAgbWF4LWhlaWdodDogJHsoeyBtYXhIZWlnaHQgfSkgPT4gbWF4SGVpZ2h0ID8/ICd1bnNldCd9O1xuICBib3JkZXI6IDFweCBzb2xpZCAkeyh7IHRoZW1lIH0pID0+IGAke3RoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrfTFBYH07XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGZpbHRlcjogZHJvcC1zaGFkb3coXG4gICAgMHB4IDEwcHggMjVweCAkeyh7IHRoZW1lIH0pID0+IGAke3RoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrfTQwYH1cbiAgKTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDI1cHgpO1xuICBib3JkZXItcmFkaXVzOiAkeyh7IGhhc0JvcmRlclJhZGl1cywgYm9yZGVyUmFkaXVzIH0pID0+XG4gICAgaGFzQm9yZGVyUmFkaXVzID8gKGJvcmRlclJhZGl1cyA/PyAnOHB4JykgOiAnbm9uZSd9O1xuICBjdXJzb3I6ICR7KHsgc2hvd1BvaW50ZXIgfSkgPT4gKHNob3dQb2ludGVyID8gJ2RlZmF1bHQnIDogJ3BvaW50ZXInKX07XG5gO1xuXG5jb25zdCBOZnRWaWRlbyA9IHN0eWxlZCgndmlkZW8nKTx7XG4gIHdpZHRoPzogc3RyaW5nO1xuICBoZWlnaHQ/OiBzdHJpbmc7XG4gIG1heFdpZHRoPzogc3RyaW5nO1xuICBtYXhIZWlnaHQ/OiBzdHJpbmc7XG4gIGhvdmVyPzogYm9vbGVhbjtcbiAgYm9yZGVyUmFkaXVzPzogc3RyaW5nO1xufT5gXG4gIHdpZHRoOiAkeyh7IHdpZHRoIH0pID0+IHdpZHRoID8/ICczMnB4J307XG4gIG1heC13aWR0aDogJHsoeyBtYXhXaWR0aCB9KSA9PiBtYXhXaWR0aCA/PyAndW5zZXQnfTtcbiAgaGVpZ2h0OiAkeyh7IGhlaWdodCB9KSA9PiBoZWlnaHQgPz8gJzMycHgnfTtcbiAgbWF4LWhlaWdodDogJHsoeyBtYXhIZWlnaHQgfSkgPT4gbWF4SGVpZ2h0ID8/ICd1bnNldCd9O1xuICBib3JkZXI6IDFweCBzb2xpZCAkeyh7IHRoZW1lIH0pID0+IGAke3RoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrfTFBYH07XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGZpbHRlcjogZHJvcC1zaGFkb3coXG4gICAgMHB4IDEwcHggMjVweCAkeyh7IHRoZW1lIH0pID0+IGAke3RoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrfTQwYH1cbiAgKTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDI1cHgpO1xuICBib3JkZXItcmFkaXVzOiAkeyh7IGJvcmRlclJhZGl1cyB9KSA9PiBib3JkZXJSYWRpdXMgPz8gJzhweCd9O1xuYDtcblxuaW50ZXJmYWNlIENvbGxlY3RpYmxlTWVkaWFQcm9wcyB7XG4gIHVybD86IHN0cmluZztcbiAgd2lkdGg/OiBzdHJpbmc7XG4gIGhlaWdodD86IHN0cmluZztcbiAgbWF4V2lkdGg/OiBzdHJpbmc7XG4gIG1heEhlaWdodD86IHN0cmluZztcbiAgaG92ZXI/OiBib29sZWFuO1xuICBtYXJnaW4/OiBzdHJpbmc7XG4gIHNob3dQbGF5SWNvbj86IGJvb2xlYW47XG4gIGNvbnRyb2xzPzogYm9vbGVhbjtcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICBib3JkZXJSYWRpdXM/OiBzdHJpbmc7XG4gIHNob3dCYWxhbmNlPzogYm9vbGVhbjtcbiAgYmFsYW5jZT86IGJpZ2ludDtcbiAgc2hvd0V4cGFuZE9wdGlvbj86IGJvb2xlYW47XG4gIG5vQWN0aW9uPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvbGxlY3RpYmxlTWVkaWEoe1xuICB1cmwsXG4gIHdpZHRoLFxuICBoZWlnaHQsXG4gIG1heFdpZHRoLFxuICBtYXhIZWlnaHQsXG4gIGhvdmVyID0gZmFsc2UsXG4gIG1hcmdpbixcbiAgc2hvd1BsYXlJY29uID0gdHJ1ZSxcbiAgY29udHJvbHMgPSBmYWxzZSxcbiAgY2xhc3NOYW1lLFxuICBib3JkZXJSYWRpdXMgPSAnOHB4JyxcbiAgc2hvd0JhbGFuY2UgPSBmYWxzZSxcbiAgYmFsYW5jZSA9IDBuLFxuICBzaG93RXhwYW5kT3B0aW9uID0gZmFsc2UsXG4gIG5vQWN0aW9uID0gZmFsc2UsXG59OiBDb2xsZWN0aWJsZU1lZGlhUHJvcHMpIHtcbiAgY29uc3QgW2lzSW1hZ2VGdWxsU2NyZWVuLCBzZXRJc0ltYWdlRnVsbFNjcmVlbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG91bGRVc2VMaWdodEljb24sIHNldFNob3VsZFVzZUxpZ2h0SWNvbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc01lZGlhU2V0dGxlZCwgc2V0SXNNZWRpYVNldHRsZWRdID0gdXNlU3RhdGUoZmFsc2UpOyAvLyBFaXRoZXIgbG9hZGVkIG9yIGVycm9yZWQgb3V0LlxuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICBtYXJnaW4sXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgfX1cbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgID5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgIG1heFdpZHRoOiBtYXhXaWR0aCA/IG1heFdpZHRoIDogJ3Vuc2V0JyxcbiAgICAgICAgICB3aWR0aDogd2lkdGggPyB3aWR0aCA6ICczMnB4JyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLFxuICAgICAgICAgIGNvbHVtbkdhcDogMSxcbiAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgbXI6IDMsXG4gICAgICAgICAgbXQ6IDEsXG4gICAgICAgICAgcHI6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtzaG93QmFsYW5jZSAmJiBpc01lZGlhU2V0dGxlZCAmJiAoXG4gICAgICAgICAgPENoaXBcbiAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICh0aGVtZSkgPT5cbiAgICAgICAgICAgICAgICBzaG91bGRVc2VMaWdodEljb24gPyAncHJpbWFyeS5saWdodCcgOiB0aGVtZS5wYWxldHRlLmdyZXlbNjAwXSxcbiAgICAgICAgICAgICAgY29sb3I6IHNob3VsZFVzZUxpZ2h0SWNvblxuICAgICAgICAgICAgICAgID8gJ3ByaW1hcnkuY29udHJhc3RUZXh0J1xuICAgICAgICAgICAgICAgIDogJ3ByaW1hcnkubGlnaHQnLFxuICAgICAgICAgICAgICBweDogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBsYWJlbD17YmFsYW5jZS50b1N0cmluZygpfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIHtzaG93RXhwYW5kT3B0aW9uICYmIChcbiAgICAgICAgICA8QXJyb3dzTWF4aW1pemVJY29uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldElzSW1hZ2VGdWxsU2NyZWVuKHRydWUpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHNpemU9XCIyNFwiXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBjb2xvcjogc2hvdWxkVXNlTGlnaHRJY29uXG4gICAgICAgICAgICAgICAgPyAncHJpbWFyeS5saWdodCdcbiAgICAgICAgICAgICAgICA6ICdwcmltYXJ5LmNvbnRyYXN0VGV4dCcsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9TdGFjaz5cbiAgICAgIHtpc1ZpZGVvKHVybCkgPyAoXG4gICAgICAgIDxTdGFjayBzeD17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgZmxleERpcmVjdGlvbjogJ3JvdycgfX0+XG4gICAgICAgICAgPE5mdFZpZGVvXG4gICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIG1heFdpZHRoPXttYXhXaWR0aH1cbiAgICAgICAgICAgIG1heEhlaWdodD17bWF4SGVpZ2h0fVxuICAgICAgICAgICAgaG92ZXI9e2hvdmVyfVxuICAgICAgICAgICAgY29udHJvbHM9e2NvbnRyb2xzfVxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzPXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgey8qIGlubGluaW5nIHRoaXMgY29tbWVudCByZXN1bHRzIGluIGVzbGludCBwYXJzZSBlcnJvciAqL31cbiAgICAgICAgICAgIHsvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby11bmtub3duLXByb3BlcnR5ICovfVxuICAgICAgICAgICAgPHNvdXJjZVxuICAgICAgICAgICAgICBzcmM9e2lwZnNSZXNvbHZlcldpdGhGYWxsYmFjayh1cmwpfVxuICAgICAgICAgICAgICBvbkxvYWRTdGFydD17KCkgPT4gc2V0SXNNZWRpYVNldHRsZWQodHJ1ZSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgey8qIGVzbGludC1lbmFibGUgcmVhY3Qvbm8tdW5rbm93bi1wcm9wZXJ0eSAqL31cbiAgICAgICAgICA8L05mdFZpZGVvPlxuICAgICAgICAgIHtzaG93UGxheUljb24gJiYgKFxuICAgICAgICAgICAgPFRyaWFuZ2xlUmlnaHRJY29uXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnOHB4JyxcbiAgICAgICAgICAgICAgICByaWdodDogJzhweCcsXG4gICAgICAgICAgICAgICAgY29sb3I6ICdjb21tb24ud2hpdGUnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgKSA6IChcbiAgICAgICAgPEltYWdlV3JhcHBlclxuICAgICAgICAgIGlzT3ZlcmxheT17aXNJbWFnZUZ1bGxTY3JlZW59XG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFzaG93QmFsYW5jZSAmJiAhbm9BY3Rpb24pIHNldElzSW1hZ2VGdWxsU2NyZWVuKHRydWUpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0SXNJbWFnZUZ1bGxTY3JlZW4oZmFsc2UpfVxuICAgICAgICAgIGJhY2tkcm9wSW1hZ2VVcmw9e3VybH1cbiAgICAgICAgICBzaG91bGRVc2VMaWdodEljb249e3Nob3VsZFVzZUxpZ2h0SWNvbn1cbiAgICAgICAgPlxuICAgICAgICAgIDxOZnRJbWFnZVxuICAgICAgICAgICAgd2lkdGg9e2lzSW1hZ2VGdWxsU2NyZWVuID8gJzEwMCUnIDogd2lkdGh9XG4gICAgICAgICAgICBoZWlnaHQ9e2lzSW1hZ2VGdWxsU2NyZWVuID8gJ2F1dG8nIDogaGVpZ2h0fVxuICAgICAgICAgICAgc3JjPXt1cmx9XG4gICAgICAgICAgICBtYXhXaWR0aD17bWF4V2lkdGh9XG4gICAgICAgICAgICBtYXhIZWlnaHQ9e21heEhlaWdodH1cbiAgICAgICAgICAgIGhvdmVyPXtob3Zlcn1cbiAgICAgICAgICAgIGhhc0JvcmRlclJhZGl1cz17IWlzSW1hZ2VGdWxsU2NyZWVufVxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzPXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICBzaG93UG9pbnRlcj17c2hvd0V4cGFuZE9wdGlvbn1cbiAgICAgICAgICAgIG9uTG9hZD17KGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGltYWdlRWxlbWVudCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgICAgaWYgKGltYWdlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpc0ltYWdlRGFyayhpbWFnZUVsZW1lbnQsIChpc0RhcmspID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldFNob3VsZFVzZUxpZ2h0SWNvbihpc0RhcmspO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNldElzTWVkaWFTZXR0bGVkKHRydWUpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uRXJyb3I9eygpID0+IHNldElzTWVkaWFTZXR0bGVkKHRydWUpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvSW1hZ2VXcmFwcGVyPlxuICAgICAgKX1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQm94LFxuICBDaGV2cm9uTGVmdEljb24sXG4gIEljb25CdXR0b24sXG4gIFN0YWNrLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vT3ZlcmxheSc7XG5pbXBvcnQgeyBQcm9wc1dpdGhDaGlsZHJlbiB9IGZyb20gJ3JlYWN0JztcbmludGVyZmFjZSBJbWFnZVdyYXBwZXJQcm9wcyB7XG4gIGlzT3ZlcmxheTogYm9vbGVhbjtcbiAgb25DbGljazogKCkgPT4gdm9pZDtcbiAgb25DbG9zZTogKCkgPT4gdm9pZDtcbiAgYmFja2Ryb3BJbWFnZVVybD86IHN0cmluZztcbiAgc2hvdWxkVXNlTGlnaHRJY29uOiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSW1hZ2VXcmFwcGVyKHtcbiAgaXNPdmVybGF5LFxuICBvbkNsaWNrLFxuICBvbkNsb3NlLFxuICBiYWNrZHJvcEltYWdlVXJsLFxuICBzaG91bGRVc2VMaWdodEljb24sXG4gIGNoaWxkcmVuLFxufTogUHJvcHNXaXRoQ2hpbGRyZW48SW1hZ2VXcmFwcGVyUHJvcHM+KSB7XG4gIGlmIChpc092ZXJsYXkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE92ZXJsYXk+XG4gICAgICAgIDxCb3hcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7YmFja2Ryb3BJbWFnZVVybH0pYCxcbiAgICAgICAgICAgIGJhY2tncm91bmRTaXplOiAnY292ZXInLFxuICAgICAgICAgICAgYmFja2dyb3VuZFJlcGVhdDogJ25vLXJlcGVhdCcsXG4gICAgICAgICAgICBmaWx0ZXI6ICdibHVyKDE2cHgpJyxcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHB4OiAxLFxuICAgICAgICAgICAgICBweTogNCxcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBhZ2UtdGl0bGUtYmFjay1idXR0b25cIlxuICAgICAgICAgICAgICBkaXNhYmxlUmlwcGxlXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgcDogMCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPENoZXZyb25MZWZ0SWNvblxuICAgICAgICAgICAgICAgIHNpemU9ezMyfVxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICBjb2xvcjogc2hvdWxkVXNlTGlnaHRJY29uXG4gICAgICAgICAgICAgICAgICAgID8gJ3ByaW1hcnkubGlnaHQnXG4gICAgICAgICAgICAgICAgICAgIDogJ3ByaW1hcnkuY29udHJhc3RUZXh0JyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9PdmVybGF5PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgb25DbGljaz17b25DbGlja30gc3g9e3sgd2lkdGg6ICcxMDAlJywgZmxleERpcmVjdGlvbjogJ3JvdycgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImV4cG9ydCBjb25zdCBpc1ZpZGVvID0gKHVybD86IHN0cmluZykgPT5cbiAgdXJsICYmIFsnLm1wNCcsICcud2VibScsICcub2dnJ10uaW5jbHVkZXModXJsLnNsaWNlKHVybC5sYXN0SW5kZXhPZignLicpKSk7XG5cbmV4cG9ydCBjb25zdCBpc0ltYWdlRGFyayA9IChcbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LFxuICBjYWxsYmFjazogKGI6IGJvb2xlYW4pID0+IHZvaWQsXG4pID0+IHtcbiAgbGV0IGNvbG9yU3VtID0gMDtcblxuICBpZiAoIWltZykge1xuICAgIC8vIERlZmF1bHQgdmFsdWUgaXMgdHJ1ZSAoRGFyayBpbWFnZSBNb2RlKVxuICAgIHJldHVybiBjYWxsYmFjayh0cnVlKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICBpZiAoIWN0eCkge1xuICAgICAgLy8gRGVmYXVsdCB2YWx1ZSBpcyB0cnVlIChEYXJrIGltYWdlIE1vZGUpXG4gICAgICByZXR1cm4gY2FsbGJhY2sodHJ1ZSk7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xuXG4gICAgLy8gd2UgbmVlZCB0byBrbm93IHRoZSB0b3AgcmlnaHQgcXVhdGVyJ3MgYXZlcmFnZSBjb2xvclxuICAgIGNvbnN0IGhlaWdodCA9IE1hdGguZmxvb3IoY2FudmFzLmhlaWdodCAvIDIpO1xuICAgIGNvbnN0IHdpZHRoID0gTWF0aC5mbG9vcihjYW52YXMud2lkdGggLyAyKTtcbiAgICBjb25zdCBpbWFnZURhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKHdpZHRoLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjb25zdCBkYXRhID0gaW1hZ2VEYXRhLmRhdGE7XG5cbiAgICBmb3IgKGxldCB4ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IHggPCBsZW47IHggKz0gNCkge1xuICAgICAgY29uc3QgciA9IGRhdGFbeF07XG4gICAgICBjb25zdCBnID0gZGF0YVt4ICsgMV07XG4gICAgICBjb25zdCBiID0gZGF0YVt4ICsgMl07XG5cbiAgICAgIGlmIChyID09PSB1bmRlZmluZWQgfHwgZyA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBjb2xvcicpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhdmcgPSBNYXRoLmZsb29yKChyICsgZyArIGIpIC8gMyk7XG4gICAgICBjb2xvclN1bSArPSBhdmc7XG4gICAgfVxuXG4gICAgY29uc3QgYnJpZ2h0bmVzcyA9IE1hdGguZmxvb3IoY29sb3JTdW0gLyAod2lkdGggKiBoZWlnaHQpKTtcbiAgICAvL0JyaWdodG5lc3MgaXMgb3V0IG9mIDI1NS5cbiAgICByZXR1cm4gY2FsbGJhY2soYnJpZ2h0bmVzcyA8IDEyNy41KTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gRGVmYXVsdCB2YWx1ZSBpcyB0cnVlIChEYXJrIGltYWdlIE1vZGUpXG4gICAgcmV0dXJuIGNhbGxiYWNrKHRydWUpO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgU2VhcmNoQmFyLCBTdGFjayB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyBTY3JvbGxiYXJzIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9zY3JvbGxiYXJzL1Njcm9sbGJhcnMnO1xuaW1wb3J0IHsgTWFuYWdlQ29sbGVjdGlibGVzTGlzdCB9IGZyb20gJy4vTWFuYWdlQ29sbGVjdGlibGVzTGlzdCc7XG5cbmV4cG9ydCBjb25zdCBNYW5hZ2VDb2xsZWN0aWJsZXMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgW3NlYXJjaFF1ZXJ5LCBzZXRTZWFyY2hRdWVyeV0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBmbGV4OiAxIH19PlxuICAgICAgPFBhZ2VUaXRsZT57dCgnTWFuYWdlIENvbGxlY3RpYmxlcycpfTwvUGFnZVRpdGxlPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBweTogMSxcbiAgICAgICAgICBweDogMixcbiAgICAgICAgICByb3dHYXA6ICczMHB4JyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFNlYXJjaEJhclxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoLWNvbGxlY3RpYmxlcy1saXN0LWlucHV0XCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnU2VhcmNoJyl9XG4gICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgc2V0U2VhcmNoUXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIGF1dG9Gb2N1cz17dHJ1ZX1cbiAgICAgICAgLz5cbiAgICAgICAgPFNjcm9sbGJhcnMgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMTZweCcgfX0+XG4gICAgICAgICAgPE1hbmFnZUNvbGxlY3RpYmxlc0xpc3Qgc2VhcmNoUXVlcnk9e3NlYXJjaFF1ZXJ5fSAvPlxuICAgICAgICA8L1Njcm9sbGJhcnM+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgU3RhY2ssXG4gIFN3aXRjaCxcbiAgVHlwb2dyYXBoeSxcbiAgRGl2aWRlcixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IENvbGxlY3RpYmxlTGlzdEVtcHR5IH0gZnJvbSAnQHNyYy9wYWdlcy9Db2xsZWN0aWJsZXMvY29tcG9uZW50cy9Db2xsZWN0aWJsZUxpc3RFbXB0eSc7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgQ29sbGVjdGlibGVNZWRpYSB9IGZyb20gJ0BzcmMvcGFnZXMvQ29sbGVjdGlibGVzL2NvbXBvbmVudHMvQ29sbGVjdGlibGVNZWRpYSc7XG5pbXBvcnQgeyBOZnRUb2tlbldpdGhCYWxhbmNlLCBUb2tlblR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgdXNlTmZ0cyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlTmZ0cyc7XG5cbnR5cGUgTWFuYWdlVG9rZW5zTGlzdFByb3BzID0ge1xuICBzZWFyY2hRdWVyeTogc3RyaW5nO1xufTtcblxuZXhwb3J0IGNvbnN0IE1hbmFnZUNvbGxlY3RpYmxlc0xpc3QgPSAoe1xuICBzZWFyY2hRdWVyeSxcbn06IE1hbmFnZVRva2Vuc0xpc3RQcm9wcykgPT4ge1xuICBjb25zdCBuZnRzID0gdXNlTmZ0cygpO1xuXG4gIGlmIChuZnRzPy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgcGI6IDksXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDb2xsZWN0aWJsZUxpc3RFbXB0eSAvPlxuICAgICAgPC9TdGFjaz5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgZGlzcGxheWFibGVOZnRzID0gbmZ0cz8uZmlsdGVyKChuZnQpID0+IHtcbiAgICBpZiAoIXNlYXJjaFF1ZXJ5Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5mdC5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKSk7XG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17eyByb3dHYXA6ICcxMHB4JyB9fVxuICAgICAgZGF0YS10ZXN0aWQ9XCJtYW5hZ2UtY29sbGVjdGlibGVzLWxpc3RcIlxuICAgICAgZGl2aWRlcj17PERpdmlkZXIgZmxleEl0ZW0gc3g9e3sgYm9yZGVyQ29sb3I6ICdncmV5LjgwMCcgfX0gLz59XG4gICAgPlxuICAgICAge2Rpc3BsYXlhYmxlTmZ0cz8ubWFwKChuZnQpID0+IChcbiAgICAgICAgPE1hbmFnZUNvbGxlY3RpYmxlc0xpc3RJdGVtXG4gICAgICAgICAgbmZ0PXtuZnR9XG4gICAgICAgICAga2V5PXtgY29sbGVjdGlibGUtJHtuZnQuYWRkcmVzc30tJHtuZnQudG9rZW5JZH1gfVxuICAgICAgICAvPlxuICAgICAgKSl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG5cbnR5cGUgTWFuYWdlQ29sbGVjdGlibGVzTGlzdEl0ZW1Qcm9wcyA9IHtcbiAgbmZ0OiBOZnRUb2tlbldpdGhCYWxhbmNlO1xufTtcblxuZXhwb3J0IGNvbnN0IE1hbmFnZUNvbGxlY3RpYmxlc0xpc3RJdGVtID0gKHtcbiAgbmZ0LFxufTogTWFuYWdlQ29sbGVjdGlibGVzTGlzdEl0ZW1Qcm9wcykgPT4ge1xuICBjb25zdCB7IGdldENvbGxlY3RpYmxlVmlzaWJpbGl0eSwgdG9nZ2xlQ29sbGVjdGlibGVWaXNpYmlsaXR5IH0gPVxuICAgIHVzZVNldHRpbmdzQ29udGV4dCgpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgZGF0YS10ZXN0aWQ9e2Ake25mdC5uYW1lLnRvTG93ZXJDYXNlKCl9LWNvbGxlY3RpYmxlLWxpc3QtaXRlbWB9XG4gICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxuICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICBzeD17eyB3aWR0aDogJzEwMCUnIH19XG4gICAgPlxuICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIGFsaWduSXRlbXM9XCJjZW50ZXJcIj5cbiAgICAgICAgPENvbGxlY3RpYmxlTWVkaWFcbiAgICAgICAgICBoZWlnaHQ9XCIzMnB4XCJcbiAgICAgICAgICB3aWR0aD1cImF1dG9cIlxuICAgICAgICAgIG1heFdpZHRoPVwiMzJweFwiXG4gICAgICAgICAgdXJsPXtuZnQ/LmxvZ29TbWFsbH1cbiAgICAgICAgICBob3Zlcj17ZmFsc2V9XG4gICAgICAgICAgbWFyZ2luPVwiOHB4IDBcIlxuICAgICAgICAgIHNob3dQbGF5SWNvbj17ZmFsc2V9XG4gICAgICAgICAgbm9BY3Rpb249e3RydWV9XG4gICAgICAgIC8+XG4gICAgICAgIDxTdGFjayBzeD17eyBteDogMiB9fT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtYjogMC41IH19IGZvbnRXZWlnaHQ9XCJmb250V2VpZ2h0U2VtaWJvbGRcIj5cbiAgICAgICAgICAgIHtuZnQubmFtZX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAge25mdC50eXBlID09PSBUb2tlblR5cGUuRVJDMTE1NSA/IChcbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHN4PXt7IG1iOiAwLjUgfX0+e25mdC5iYWxhbmNlLnRvU3RyaW5nKCl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTd2l0Y2hcbiAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgY2hlY2tlZD17Z2V0Q29sbGVjdGlibGVWaXNpYmlsaXR5KG5mdCl9XG4gICAgICAgIG9uQ2hhbmdlPXsoKSA9PiB0b2dnbGVDb2xsZWN0aWJsZVZpc2liaWxpdHkobmZ0KX1cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iXSwibmFtZXMiOlsiQ3VzdG9tU2Nyb2xsYmFycyIsImZvcndhcmRSZWYiLCJ1c2VUaGVtZSIsIlNjcm9sbGJhcnMiLCJwcm9wcyIsInJlZiIsInRoZW1lIiwicmVuZGVyVGh1bWIiLCJzdHlsZSIsInJlc3QiLCJ0aHVtYlN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwicGFsZXR0ZSIsImdyZXkiLCJib3JkZXJSYWRpdXMiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJfZXh0ZW5kcyIsInJlbmRlclRodW1iVmVydGljYWwiLCJ1c2VNZW1vIiwidXNlQmFsYW5jZXNDb250ZXh0IiwidXNlQWNjb3VudHNDb250ZXh0IiwidXNlTmV0d29ya0NvbnRleHQiLCJnZXRBZGRyZXNzRm9yQ2hhaW4iLCJ1c2VOZnRzIiwiYmFsYW5jZXMiLCJhY2NvdW50cyIsImFjdGl2ZSIsImFjdGl2ZUFjY291bnQiLCJuZXR3b3JrIiwibmZ0cyIsInVzZXJBZGRyZXNzIiwiT2JqZWN0IiwidmFsdWVzIiwiY2hhaW5JZCIsIlR5cG9ncmFwaHkiLCJTdGFjayIsInVzZVRyYW5zbGF0aW9uIiwiQ29sbGVjdGlibGVMaXN0RW1wdHkiLCJ0Iiwic3giLCJhbGlnbkl0ZW1zIiwiZmxleEdyb3ciLCJyb3dHYXAiLCJtdCIsInZhcmlhbnQiLCJjb2xvciIsInVzZVN0YXRlIiwiaXNWaWRlbyIsImlzSW1hZ2VEYXJrIiwiSW1hZ2VXcmFwcGVyIiwiSW1hZ2VXaXRoRmFsbGJhY2siLCJpcGZzUmVzb2x2ZXJXaXRoRmFsbGJhY2siLCJDaGlwIiwic3R5bGVkIiwiVHJpYW5nbGVSaWdodEljb24iLCJBcnJvd3NNYXhpbWl6ZUljb24iLCJOZnRJbWFnZSIsIndpZHRoIiwiaGVpZ2h0IiwibWF4V2lkdGgiLCJtYXhIZWlnaHQiLCJjb21tb24iLCJibGFjayIsImhhc0JvcmRlclJhZGl1cyIsInNob3dQb2ludGVyIiwiTmZ0VmlkZW8iLCJDb2xsZWN0aWJsZU1lZGlhIiwidXJsIiwiaG92ZXIiLCJtYXJnaW4iLCJzaG93UGxheUljb24iLCJjb250cm9scyIsImNsYXNzTmFtZSIsInNob3dCYWxhbmNlIiwiYmFsYW5jZSIsInNob3dFeHBhbmRPcHRpb24iLCJub0FjdGlvbiIsImlzSW1hZ2VGdWxsU2NyZWVuIiwic2V0SXNJbWFnZUZ1bGxTY3JlZW4iLCJzaG91bGRVc2VMaWdodEljb24iLCJzZXRTaG91bGRVc2VMaWdodEljb24iLCJpc01lZGlhU2V0dGxlZCIsInNldElzTWVkaWFTZXR0bGVkIiwiZmxleERpcmVjdGlvbiIsInBvc2l0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJjb2x1bW5HYXAiLCJ6SW5kZXgiLCJtciIsInByIiwic2l6ZSIsInB4IiwibGFiZWwiLCJ0b1N0cmluZyIsIm9uQ2xpY2siLCJjdXJzb3IiLCJzcmMiLCJvbkxvYWRTdGFydCIsImJvdHRvbSIsInJpZ2h0IiwiaXNPdmVybGF5Iiwib25DbG9zZSIsImJhY2tkcm9wSW1hZ2VVcmwiLCJvbkxvYWQiLCJldmVudCIsImltYWdlRWxlbWVudCIsInRhcmdldCIsIkhUTUxJbWFnZUVsZW1lbnQiLCJpc0RhcmsiLCJvbkVycm9yIiwiQm94IiwiQ2hldnJvbkxlZnRJY29uIiwiSWNvbkJ1dHRvbiIsIk92ZXJsYXkiLCJjaGlsZHJlbiIsInRvcCIsImxlZnQiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kU2l6ZSIsImJhY2tncm91bmRSZXBlYXQiLCJmaWx0ZXIiLCJweSIsImRpc2FibGVSaXBwbGUiLCJwIiwiaW5jbHVkZXMiLCJzbGljZSIsImxhc3RJbmRleE9mIiwiaW1nIiwiY2FsbGJhY2siLCJjb2xvclN1bSIsImNhbnZhcyIsImRvY3VtZW50IiwiY3R4IiwiZ2V0Q29udGV4dCIsImRyYXdJbWFnZSIsIk1hdGgiLCJmbG9vciIsImltYWdlRGF0YSIsImdldEltYWdlRGF0YSIsImRhdGEiLCJ4IiwibGVuIiwibGVuZ3RoIiwiciIsImciLCJiIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJhdmciLCJicmlnaHRuZXNzIiwiU2VhcmNoQmFyIiwiUGFnZVRpdGxlIiwiTWFuYWdlQ29sbGVjdGlibGVzTGlzdCIsIk1hbmFnZUNvbGxlY3RpYmxlcyIsInNlYXJjaFF1ZXJ5Iiwic2V0U2VhcmNoUXVlcnkiLCJmbGV4IiwicGxhY2Vob2xkZXIiLCJvbkNoYW5nZSIsInZhbHVlIiwiYXV0b0ZvY3VzIiwibWFyZ2luQm90dG9tIiwiU3dpdGNoIiwiRGl2aWRlciIsInVzZVNldHRpbmdzQ29udGV4dCIsIlRva2VuVHlwZSIsInBiIiwiZGlzcGxheWFibGVOZnRzIiwibmZ0IiwibmFtZSIsInRvTG93ZXJDYXNlIiwiZGl2aWRlciIsImZsZXhJdGVtIiwiYm9yZGVyQ29sb3IiLCJtYXAiLCJNYW5hZ2VDb2xsZWN0aWJsZXNMaXN0SXRlbSIsImtleSIsImFkZHJlc3MiLCJ0b2tlbklkIiwiZ2V0Q29sbGVjdGlibGVWaXNpYmlsaXR5IiwidG9nZ2xlQ29sbGVjdGlibGVWaXNpYmlsaXR5IiwiZGlyZWN0aW9uIiwibG9nb1NtYWxsIiwibXgiLCJtYiIsImZvbnRXZWlnaHQiLCJ0eXBlIiwiRVJDMTE1NSIsImNoZWNrZWQiXSwic291cmNlUm9vdCI6IiJ9