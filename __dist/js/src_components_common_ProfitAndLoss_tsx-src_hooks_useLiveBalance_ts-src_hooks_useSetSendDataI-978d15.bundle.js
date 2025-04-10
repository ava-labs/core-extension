"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_ProfitAndLoss_tsx-src_hooks_useLiveBalance_ts-src_hooks_useSetSendDataI-978d15"],{

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

/***/ "./src/hooks/useLiveBalance.ts":
/*!*************************************!*\
  !*** ./src/hooks/useLiveBalance.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useLiveBalance": () => (/* binding */ useLiveBalance)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");


const useLiveBalance = tokenTypes => {
  const {
    registerSubscriber,
    unregisterSubscriber
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__.useBalancesContext)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    registerSubscriber(tokenTypes);
    return () => {
      unregisterSubscriber(tokenTypes);
    };
  }, [registerSubscriber, unregisterSubscriber, tokenTypes]);
};

/***/ }),

/***/ "./src/hooks/useSetSendDataInParams.ts":
/*!*********************************************!*\
  !*** ./src/hooks/useSetSendDataInParams.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useSetSendDataInParams": () => (/* binding */ useSetSendDataInParams)
/* harmony export */ });
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");




function useSetSendDataInParams() {
  const {
    pathname
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__.useNetworkContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useHistory)();
  const setSendDataInParams = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(({
    token,
    address,
    options,
    amount
  }) => {
    const pushOrReplace = options?.replace ? history.replace : history.push;
    pushOrReplace({
      pathname: options?.path ?? pathname,
      search: `?${new URLSearchParams({
        tokenSymbol: token?.symbol || network?.networkToken.symbol || '',
        tokenAddress: token?.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC20 ? token?.address : '',
        amount: amount ?? '',
        address: address ?? ''
      }).toString()}`
    });
  }, [history, network?.networkToken.symbol, pathname]);
  return setSendDataInParams;
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

/***/ "./src/utils/hasUnconfirmedBalance.ts":
/*!********************************************!*\
  !*** ./src/utils/hasUnconfirmedBalance.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hasUnconfirmedBalance": () => (/* binding */ hasUnconfirmedBalance)
/* harmony export */ });
const hasUnconfirmedBalance = token => {
  return 'unconfirmedBalance' in token && Boolean(token.unconfirmedBalance);
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX1Byb2ZpdEFuZExvc3NfdHN4LXNyY19ob29rc191c2VMaXZlQmFsYW5jZV90cy1zcmNfaG9va3NfdXNlU2V0U2VuZERhdGFJLTk3OGQxNS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUEwRTtBQUNOO0FBU3BFLE1BQU1JLGdCQUFnQixHQUFHLENBQUM7QUFFbkIsTUFBTUMsS0FBSyxHQUFHQSxDQUFDO0VBQ3BCQyxLQUFLO0VBQ0xDLFVBQVU7RUFDVkMsSUFBSTtFQUNKQztBQUNVLENBQUMsS0FBSztFQUNoQixNQUFNO0lBQUVDO0VBQWtCLENBQUMsR0FBR1Asa0ZBQWtCLEVBQUU7RUFDbEQsSUFBSSxDQUFDSSxVQUFVLElBQUksQ0FBQ0QsS0FBSyxFQUFFO0lBQ3pCLG9CQUFPSyxLQUFBLENBQUFDLGFBQUEsQ0FBQUQsS0FBQSxDQUFBRSxRQUFBLE9BQUs7RUFDZDtFQUNBLE1BQU1DLEtBQUssR0FBR1AsVUFBVSxHQUFHLENBQUMsR0FBR04saUVBQVEsR0FBR0EsbUVBQVU7RUFFcEQsb0JBQ0VVLEtBQUEsQ0FBQUMsYUFBQSxDQUFDWiw4REFBSyxxQkFDSlcsS0FBQSxDQUFBQyxhQUFBLENBQUNWLHNFQUFhO0lBQ1pJLEtBQUssRUFBRUksaUJBQWlCLENBQUNKLEtBQUssQ0FBRTtJQUNoQ0MsVUFBVSxFQUNSRSxjQUFjLEdBQ1QsR0FBRUYsVUFBVSxDQUFDVSxPQUFPLENBQUNiLGdCQUFnQixDQUFFLEdBQUUsR0FDMUNjLFNBQ0w7SUFDREosS0FBSyxFQUFFQSxLQUFNO0lBQ2JOLElBQUksRUFBRUE7RUFBSyxFQUNYLENBQ0k7QUFFWixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdENpQztBQUNrQztBQUc3RCxNQUFNYSxjQUFjLEdBQUlDLFVBQXVCLElBQUs7RUFDekQsTUFBTTtJQUFFQyxrQkFBa0I7SUFBRUM7RUFBcUIsQ0FBQyxHQUFHSixrRkFBa0IsRUFBRTtFQUV6RUQsZ0RBQVMsQ0FBQyxN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c291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9Qcm9maXRBbmRMb3NzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUxpdmVCYWxhbmNlLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlU2V0U2VuZERhdGFJblBhcmFtcy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0JyaWRnZS9ob29rcy91c2VQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb25zLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQ29sbGVjdGlibGVzL2NvbXBvbmVudHMvQ29sbGVjdGlibGVNZWRpYS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvY29tcG9uZW50cy9JbWFnZVdyYXBwZXIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQ29sbGVjdGlibGVzL3V0aWxzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvYmlnaW50VG9CaWcudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9oYXNVbmNvbmZpcm1lZEJhbGFuY2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFRyZW5kLCBQcm9maXRBbmRMb3NzIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVNldHRpbmdzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvU2V0dGluZ3NQcm92aWRlcic7XG5cbmludGVyZmFjZSBQYW5kTFByb3BzIHtcbiAgdmFsdWU/OiBudW1iZXI7XG4gIHBlcmNlbnRhZ2U/OiBudW1iZXI7XG4gIHNob3dQZXJjZW50YWdlPzogYm9vbGVhbjtcbiAgc2l6ZT86ICdiaWcnO1xufVxuXG5jb25zdCBERUZBVUxUX0RFQ0lNQUxTID0gMjtcblxuZXhwb3J0IGNvbnN0IFBBbmRMID0gKHtcbiAgdmFsdWUsXG4gIHBlcmNlbnRhZ2UsXG4gIHNpemUsXG4gIHNob3dQZXJjZW50YWdlLFxufTogUGFuZExQcm9wcykgPT4ge1xuICBjb25zdCB7IGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgaWYgKCFwZXJjZW50YWdlIHx8ICF2YWx1ZSkge1xuICAgIHJldHVybiA8PjwvPjtcbiAgfVxuICBjb25zdCB0cmVuZCA9IHBlcmNlbnRhZ2UgPiAwID8gVHJlbmQuVXAgOiBUcmVuZC5Eb3duO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrPlxuICAgICAgPFByb2ZpdEFuZExvc3NcbiAgICAgICAgdmFsdWU9e2N1cnJlbmN5Rm9ybWF0dGVyKHZhbHVlKX1cbiAgICAgICAgcGVyY2VudGFnZT17XG4gICAgICAgICAgc2hvd1BlcmNlbnRhZ2VcbiAgICAgICAgICAgID8gYCR7cGVyY2VudGFnZS50b0ZpeGVkKERFRkFVTFRfREVDSU1BTFMpfSVgXG4gICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICAgIHRyZW5kPXt0cmVuZH1cbiAgICAgICAgc2l6ZT17c2l6ZX1cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VCYWxhbmNlc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JhbGFuY2VzUHJvdmlkZXInO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuZXhwb3J0IGNvbnN0IHVzZUxpdmVCYWxhbmNlID0gKHRva2VuVHlwZXM6IFRva2VuVHlwZVtdKSA9PiB7XG4gIGNvbnN0IHsgcmVnaXN0ZXJTdWJzY3JpYmVyLCB1bnJlZ2lzdGVyU3Vic2NyaWJlciB9ID0gdXNlQmFsYW5jZXNDb250ZXh0KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZWdpc3RlclN1YnNjcmliZXIodG9rZW5UeXBlcyk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5yZWdpc3RlclN1YnNjcmliZXIodG9rZW5UeXBlcyk7XG4gICAgfTtcbiAgfSwgW3JlZ2lzdGVyU3Vic2NyaWJlciwgdW5yZWdpc3RlclN1YnNjcmliZXIsIHRva2VuVHlwZXNdKTtcbn07XG4iLCJpbXBvcnQgeyBUb2tlblR5cGUsIFRva2VuV2l0aEJhbGFuY2UgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUhpc3RvcnksIHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5cbnR5cGUgU2V0U2VuZERhdGFJblBhcmFtcyA9IHtcbiAgdG9rZW4/OiBUb2tlbldpdGhCYWxhbmNlO1xuICBhZGRyZXNzPzogc3RyaW5nO1xuICBhbW91bnQ/OiBzdHJpbmc7XG4gIG9wdGlvbnM/OiB7XG4gICAgcGF0aD86IHN0cmluZztcbiAgICByZXBsYWNlPzogYm9vbGVhbjtcbiAgfTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTZXRTZW5kRGF0YUluUGFyYW1zKCkge1xuICBjb25zdCB7IHBhdGhuYW1lIH0gPSB1c2VMb2NhdGlvbigpO1xuICBjb25zdCB7IG5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG5cbiAgY29uc3Qgc2V0U2VuZERhdGFJblBhcmFtcyA9IHVzZUNhbGxiYWNrKFxuICAgICh7IHRva2VuLCBhZGRyZXNzLCBvcHRpb25zLCBhbW91bnQgfTogU2V0U2VuZERhdGFJblBhcmFtcykgPT4ge1xuICAgICAgY29uc3QgcHVzaE9yUmVwbGFjZSA9IG9wdGlvbnM/LnJlcGxhY2UgPyBoaXN0b3J5LnJlcGxhY2UgOiBoaXN0b3J5LnB1c2g7XG4gICAgICBwdXNoT3JSZXBsYWNlKHtcbiAgICAgICAgcGF0aG5hbWU6IG9wdGlvbnM/LnBhdGggPz8gcGF0aG5hbWUsXG4gICAgICAgIHNlYXJjaDogYD8ke25ldyBVUkxTZWFyY2hQYXJhbXMoe1xuICAgICAgICAgIHRva2VuU3ltYm9sOiB0b2tlbj8uc3ltYm9sIHx8IG5ldHdvcms/Lm5ldHdvcmtUb2tlbi5zeW1ib2wgfHwgJycsXG4gICAgICAgICAgdG9rZW5BZGRyZXNzOiB0b2tlbj8udHlwZSA9PT0gVG9rZW5UeXBlLkVSQzIwID8gdG9rZW4/LmFkZHJlc3MgOiAnJyxcbiAgICAgICAgICBhbW91bnQ6IGFtb3VudCA/PyAnJyxcbiAgICAgICAgICBhZGRyZXNzOiBhZGRyZXNzID8/ICcnLFxuICAgICAgICB9KS50b1N0cmluZygpfWAsXG4gICAgICB9KTtcbiAgICB9LFxuICAgIFtoaXN0b3J5LCBuZXR3b3JrPy5uZXR3b3JrVG9rZW4uc3ltYm9sLCBwYXRobmFtZV0sXG4gICk7XG5cbiAgcmV0dXJuIHNldFNlbmREYXRhSW5QYXJhbXM7XG59XG4iLCJpbXBvcnQgeyB1c2VCcmlkZ2VDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9CcmlkZ2VQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZVVuaWZpZWRCcmlkZ2VDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9VbmlmaWVkQnJpZGdlUHJvdmlkZXInO1xuaW1wb3J0IHsgY2FpcFRvQ2hhaW5JZCB9IGZyb20gJ0BzcmMvdXRpbHMvY2FpcENvbnZlcnNpb24nO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGNvbnN0IHVzZVBlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbnMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgeyBicmlkZ2VUcmFuc2FjdGlvbnM6IGxlZ2FjeUJyaWRnZVRyYW5zZmVycyB9ID0gdXNlQnJpZGdlQ29udGV4dCgpO1xuICBjb25zdCB7XG4gICAgc3RhdGU6IHsgcGVuZGluZ1RyYW5zZmVyczogdW5pZmllZEJyaWRnZVRyYW5zZmVycyB9LFxuICB9ID0gdXNlVW5pZmllZEJyaWRnZUNvbnRleHQoKTtcbiAgY29uc3QgYnJpZGdlVHJhbnNhY3Rpb25zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLk9iamVjdC52YWx1ZXMobGVnYWN5QnJpZGdlVHJhbnNmZXJzKSxcbiAgICAgIC4uLk9iamVjdC52YWx1ZXModW5pZmllZEJyaWRnZVRyYW5zZmVycykuZmlsdGVyKFxuICAgICAgICAodHgpID0+XG4gICAgICAgICAgLy8gZmlsdGVyIHBlbmRpbmcgdHJhbnNhY3Rpb25zIHRoYXQgZG9uJ3QgYmVsb25nIHRvIHRoZSBnaXZlbiBuZXR3b3JrXG4gICAgICAgICAgbmV0d29yaz8uY2hhaW5JZCA9PT0gY2FpcFRvQ2hhaW5JZCh0eC5zb3VyY2VDaGFpbi5jaGFpbklkKSB8fFxuICAgICAgICAgIG5ldHdvcms/LmNoYWluSWQgPT09IGNhaXBUb0NoYWluSWQodHgudGFyZ2V0Q2hhaW4uY2hhaW5JZCksXG4gICAgICApLFxuICAgIF07XG4gIH0sIFt1bmlmaWVkQnJpZGdlVHJhbnNmZXJzLCBsZWdhY3lCcmlkZ2VUcmFuc2ZlcnMsIG5ldHdvcmtdKTtcblxuICByZXR1cm4gYnJpZGdlVHJhbnNhY3Rpb25zO1xufTtcbiIsImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgaXNWaWRlbywgaXNJbWFnZURhcmsgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBJbWFnZVdyYXBwZXIgfSBmcm9tICcuL0ltYWdlV3JhcHBlcic7XG5pbXBvcnQgeyBJbWFnZVdpdGhGYWxsYmFjayB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vSW1hZ2VXaXRoRmFsbGJhY2snO1xuaW1wb3J0IHsgaXBmc1Jlc29sdmVyV2l0aEZhbGxiYWNrIH0gZnJvbSAnQHNyYy91dGlscy9pcHNmUmVzb2x2ZXJXaXRoRmFsbGJhY2snO1xuaW1wb3J0IHtcbiAgQ2hpcCxcbiAgU3RhY2ssXG4gIHN0eWxlZCxcbiAgVHJpYW5nbGVSaWdodEljb24sXG4gIEFycm93c01heGltaXplSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuY29uc3QgTmZ0SW1hZ2UgPSBzdHlsZWQoSW1hZ2VXaXRoRmFsbGJhY2spPHtcbiAgd2lkdGg/OiBzdHJpbmc7XG4gIGhlaWdodD86IHN0cmluZztcbiAgbWF4V2lkdGg/OiBzdHJpbmc7XG4gIG1heEhlaWdodD86IHN0cmluZztcbiAgaG92ZXI/OiBib29sZWFuO1xuICBoYXNCb3JkZXJSYWRpdXM/OiBib29sZWFuO1xuICBib3JkZXJSYWRpdXM/OiBzdHJpbmc7XG4gIHNob3dQb2ludGVyPzogYm9vbGVhbjtcbn0+YFxuICB3aWR0aDogJHsoeyB3aWR0aCB9KSA9PiB3aWR0aCA/PyAnMzJweCd9O1xuICBoZWlnaHQ6ICR7KHsgaGVpZ2h0IH0pID0+IGhlaWdodCA/PyAnMzJweCd9O1xuICBtYXgtd2lkdGg6ICR7KHsgbWF4V2lkdGggfSkgPT4gbWF4V2lkdGggPz8gJ3Vuc2V0J307XG4gIG1heC1oZWlnaHQ6ICR7KHsgbWF4SGVpZ2h0IH0pID0+IG1heEhlaWdodCA/PyAndW5zZXQnfTtcbiAgYm9yZGVyOiAxcHggc29saWQgJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja30xQWB9O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBmaWx0ZXI6IGRyb3Atc2hhZG93KFxuICAgIDBweCAxMHB4IDI1cHggJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja300MGB9XG4gICk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigyNXB4KTtcbiAgYm9yZGVyLXJhZGl1czogJHsoeyBoYXNCb3JkZXJSYWRpdXMsIGJvcmRlclJhZGl1cyB9KSA9PlxuICAgIGhhc0JvcmRlclJhZGl1cyA/IChib3JkZXJSYWRpdXMgPz8gJzhweCcpIDogJ25vbmUnfTtcbiAgY3Vyc29yOiAkeyh7IHNob3dQb2ludGVyIH0pID0+IChzaG93UG9pbnRlciA/ICdkZWZhdWx0JyA6ICdwb2ludGVyJyl9O1xuYDtcblxuY29uc3QgTmZ0VmlkZW8gPSBzdHlsZWQoJ3ZpZGVvJyk8e1xuICB3aWR0aD86IHN0cmluZztcbiAgaGVpZ2h0Pzogc3RyaW5nO1xuICBtYXhXaWR0aD86IHN0cmluZztcbiAgbWF4SGVpZ2h0Pzogc3RyaW5nO1xuICBob3Zlcj86IGJvb2xlYW47XG4gIGJvcmRlclJhZGl1cz86IHN0cmluZztcbn0+YFxuICB3aWR0aDogJHsoeyB3aWR0aCB9KSA9PiB3aWR0aCA/PyAnMzJweCd9O1xuICBtYXgtd2lkdGg6ICR7KHsgbWF4V2lkdGggfSkgPT4gbWF4V2lkdGggPz8gJ3Vuc2V0J307XG4gIGhlaWdodDogJHsoeyBoZWlnaHQgfSkgPT4gaGVpZ2h0ID8/ICczMnB4J307XG4gIG1heC1oZWlnaHQ6ICR7KHsgbWF4SGVpZ2h0IH0pID0+IG1heEhlaWdodCA/PyAndW5zZXQnfTtcbiAgYm9yZGVyOiAxcHggc29saWQgJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja30xQWB9O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBmaWx0ZXI6IGRyb3Atc2hhZG93KFxuICAgIDBweCAxMHB4IDI1cHggJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja300MGB9XG4gICk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigyNXB4KTtcbiAgYm9yZGVyLXJhZGl1czogJHsoeyBib3JkZXJSYWRpdXMgfSkgPT4gYm9yZGVyUmFkaXVzID8/ICc4cHgnfTtcbmA7XG5cbmludGVyZmFjZSBDb2xsZWN0aWJsZU1lZGlhUHJvcHMge1xuICB1cmw/OiBzdHJpbmc7XG4gIHdpZHRoPzogc3RyaW5nO1xuICBoZWlnaHQ/OiBzdHJpbmc7XG4gIG1heFdpZHRoPzogc3RyaW5nO1xuICBtYXhIZWlnaHQ/OiBzdHJpbmc7XG4gIGhvdmVyPzogYm9vbGVhbjtcbiAgbWFyZ2luPzogc3RyaW5nO1xuICBzaG93UGxheUljb24/OiBib29sZWFuO1xuICBjb250cm9scz86IGJvb2xlYW47XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbiAgYm9yZGVyUmFkaXVzPzogc3RyaW5nO1xuICBzaG93QmFsYW5jZT86IGJvb2xlYW47XG4gIGJhbGFuY2U/OiBiaWdpbnQ7XG4gIHNob3dFeHBhbmRPcHRpb24/OiBib29sZWFuO1xuICBub0FjdGlvbj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb2xsZWN0aWJsZU1lZGlhKHtcbiAgdXJsLFxuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBtYXhXaWR0aCxcbiAgbWF4SGVpZ2h0LFxuICBob3ZlciA9IGZhbHNlLFxuICBtYXJnaW4sXG4gIHNob3dQbGF5SWNvbiA9IHRydWUsXG4gIGNvbnRyb2xzID0gZmFsc2UsXG4gIGNsYXNzTmFtZSxcbiAgYm9yZGVyUmFkaXVzID0gJzhweCcsXG4gIHNob3dCYWxhbmNlID0gZmFsc2UsXG4gIGJhbGFuY2UgPSAwbixcbiAgc2hvd0V4cGFuZE9wdGlvbiA9IGZhbHNlLFxuICBub0FjdGlvbiA9IGZhbHNlLFxufTogQ29sbGVjdGlibGVNZWRpYVByb3BzKSB7XG4gIGNvbnN0IFtpc0ltYWdlRnVsbFNjcmVlbiwgc2V0SXNJbWFnZUZ1bGxTY3JlZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbc2hvdWxkVXNlTGlnaHRJY29uLCBzZXRTaG91bGRVc2VMaWdodEljb25dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNNZWRpYVNldHRsZWQsIHNldElzTWVkaWFTZXR0bGVkXSA9IHVzZVN0YXRlKGZhbHNlKTsgLy8gRWl0aGVyIGxvYWRlZCBvciBlcnJvcmVkIG91dC5cblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgbWFyZ2luLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgIH19XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICBtYXhXaWR0aDogbWF4V2lkdGggPyBtYXhXaWR0aCA6ICd1bnNldCcsXG4gICAgICAgICAgd2lkdGg6IHdpZHRoID8gd2lkdGggOiAnMzJweCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICBjb2x1bW5HYXA6IDEsXG4gICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgIG1yOiAzLFxuICAgICAgICAgIG10OiAxLFxuICAgICAgICAgIHByOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7c2hvd0JhbGFuY2UgJiYgaXNNZWRpYVNldHRsZWQgJiYgKFxuICAgICAgICAgIDxDaGlwXG4gICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAodGhlbWUpID0+XG4gICAgICAgICAgICAgICAgc2hvdWxkVXNlTGlnaHRJY29uID8gJ3ByaW1hcnkubGlnaHQnIDogdGhlbWUucGFsZXR0ZS5ncmV5WzYwMF0sXG4gICAgICAgICAgICAgIGNvbG9yOiBzaG91bGRVc2VMaWdodEljb25cbiAgICAgICAgICAgICAgICA/ICdwcmltYXJ5LmNvbnRyYXN0VGV4dCdcbiAgICAgICAgICAgICAgICA6ICdwcmltYXJ5LmxpZ2h0JyxcbiAgICAgICAgICAgICAgcHg6IDEsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgbGFiZWw9e2JhbGFuY2UudG9TdHJpbmcoKX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgICB7c2hvd0V4cGFuZE9wdGlvbiAmJiAoXG4gICAgICAgICAgPEFycm93c01heGltaXplSWNvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRJc0ltYWdlRnVsbFNjcmVlbih0cnVlKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBzaXplPVwiMjRcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgY29sb3I6IHNob3VsZFVzZUxpZ2h0SWNvblxuICAgICAgICAgICAgICAgID8gJ3ByaW1hcnkubGlnaHQnXG4gICAgICAgICAgICAgICAgOiAncHJpbWFyeS5jb250cmFzdFRleHQnLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG4gICAgICB7aXNWaWRlbyh1cmwpID8gKFxuICAgICAgICA8U3RhY2sgc3g9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIGZsZXhEaXJlY3Rpb246ICdyb3cnIH19PlxuICAgICAgICAgIDxOZnRWaWRlb1xuICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBtYXhXaWR0aD17bWF4V2lkdGh9XG4gICAgICAgICAgICBtYXhIZWlnaHQ9e21heEhlaWdodH1cbiAgICAgICAgICAgIGhvdmVyPXtob3Zlcn1cbiAgICAgICAgICAgIGNvbnRyb2xzPXtjb250cm9sc31cbiAgICAgICAgICAgIGJvcmRlclJhZGl1cz17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsvKiBpbmxpbmluZyB0aGlzIGNvbW1lbnQgcmVzdWx0cyBpbiBlc2xpbnQgcGFyc2UgZXJyb3IgKi99XG4gICAgICAgICAgICB7LyogZXNsaW50LWRpc2FibGUgcmVhY3Qvbm8tdW5rbm93bi1wcm9wZXJ0eSAqL31cbiAgICAgICAgICAgIDxzb3VyY2VcbiAgICAgICAgICAgICAgc3JjPXtpcGZzUmVzb2x2ZXJXaXRoRmFsbGJhY2sodXJsKX1cbiAgICAgICAgICAgICAgb25Mb2FkU3RhcnQ9eygpID0+IHNldElzTWVkaWFTZXR0bGVkKHRydWUpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHsvKiBlc2xpbnQtZW5hYmxlIHJlYWN0L25vLXVua25vd24tcHJvcGVydHkgKi99XG4gICAgICAgICAgPC9OZnRWaWRlbz5cbiAgICAgICAgICB7c2hvd1BsYXlJY29uICYmIChcbiAgICAgICAgICAgIDxUcmlhbmdsZVJpZ2h0SWNvblxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogJzhweCcsXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICc4cHgnLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnY29tbW9uLndoaXRlJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICkgOiAoXG4gICAgICAgIDxJbWFnZVdyYXBwZXJcbiAgICAgICAgICBpc092ZXJsYXk9e2lzSW1hZ2VGdWxsU2NyZWVufVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGlmICghc2hvd0JhbGFuY2UgJiYgIW5vQWN0aW9uKSBzZXRJc0ltYWdlRnVsbFNjcmVlbih0cnVlKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldElzSW1hZ2VGdWxsU2NyZWVuKGZhbHNlKX1cbiAgICAgICAgICBiYWNrZHJvcEltYWdlVXJsPXt1cmx9XG4gICAgICAgICAgc2hvdWxkVXNlTGlnaHRJY29uPXtzaG91bGRVc2VMaWdodEljb259XG4gICAgICAgID5cbiAgICAgICAgICA8TmZ0SW1hZ2VcbiAgICAgICAgICAgIHdpZHRoPXtpc0ltYWdlRnVsbFNjcmVlbiA/ICcxMDAlJyA6IHdpZHRofVxuICAgICAgICAgICAgaGVpZ2h0PXtpc0ltYWdlRnVsbFNjcmVlbiA/ICdhdXRvJyA6IGhlaWdodH1cbiAgICAgICAgICAgIHNyYz17dXJsfVxuICAgICAgICAgICAgbWF4V2lkdGg9e21heFdpZHRofVxuICAgICAgICAgICAgbWF4SGVpZ2h0PXttYXhIZWlnaHR9XG4gICAgICAgICAgICBob3Zlcj17aG92ZXJ9XG4gICAgICAgICAgICBoYXNCb3JkZXJSYWRpdXM9eyFpc0ltYWdlRnVsbFNjcmVlbn1cbiAgICAgICAgICAgIGJvcmRlclJhZGl1cz17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgc2hvd1BvaW50ZXI9e3Nob3dFeHBhbmRPcHRpb259XG4gICAgICAgICAgICBvbkxvYWQ9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBpbWFnZUVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICAgIGlmIChpbWFnZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaXNJbWFnZURhcmsoaW1hZ2VFbGVtZW50LCAoaXNEYXJrKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXRTaG91bGRVc2VMaWdodEljb24oaXNEYXJrKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzZXRJc01lZGlhU2V0dGxlZCh0cnVlKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkVycm9yPXsoKSA9PiBzZXRJc01lZGlhU2V0dGxlZCh0cnVlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0ltYWdlV3JhcHBlcj5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJveCxcbiAgQ2hldnJvbkxlZnRJY29uLFxuICBJY29uQnV0dG9uLFxuICBTdGFjayxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IE92ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL092ZXJsYXknO1xuaW1wb3J0IHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCc7XG5pbnRlcmZhY2UgSW1hZ2VXcmFwcGVyUHJvcHMge1xuICBpc092ZXJsYXk6IGJvb2xlYW47XG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQ7XG4gIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XG4gIGJhY2tkcm9wSW1hZ2VVcmw/OiBzdHJpbmc7XG4gIHNob3VsZFVzZUxpZ2h0SWNvbjogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEltYWdlV3JhcHBlcih7XG4gIGlzT3ZlcmxheSxcbiAgb25DbGljayxcbiAgb25DbG9zZSxcbiAgYmFja2Ryb3BJbWFnZVVybCxcbiAgc2hvdWxkVXNlTGlnaHRJY29uLFxuICBjaGlsZHJlbixcbn06IFByb3BzV2l0aENoaWxkcmVuPEltYWdlV3JhcHBlclByb3BzPikge1xuICBpZiAoaXNPdmVybGF5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxPdmVybGF5PlxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke2JhY2tkcm9wSW1hZ2VVcmx9KWAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogJ2NvdmVyJyxcbiAgICAgICAgICAgIGJhY2tncm91bmRSZXBlYXQ6ICduby1yZXBlYXQnLFxuICAgICAgICAgICAgZmlsdGVyOiAnYmx1cigxNnB4KScsXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBweDogMSxcbiAgICAgICAgICAgICAgcHk6IDQsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYWdlLXRpdGxlLWJhY2stYnV0dG9uXCJcbiAgICAgICAgICAgICAgZGlzYWJsZVJpcHBsZVxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHA6IDAsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxDaGV2cm9uTGVmdEljb25cbiAgICAgICAgICAgICAgICBzaXplPXszMn1cbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgY29sb3I6IHNob3VsZFVzZUxpZ2h0SWNvblxuICAgICAgICAgICAgICAgICAgICA/ICdwcmltYXJ5LmxpZ2h0J1xuICAgICAgICAgICAgICAgICAgICA6ICdwcmltYXJ5LmNvbnRyYXN0VGV4dCcsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvT3ZlcmxheT5cbiAgICApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPFN0YWNrIG9uQ2xpY2s9e29uQ2xpY2t9IHN4PXt7IHdpZHRoOiAnMTAwJScsIGZsZXhEaXJlY3Rpb246ICdyb3cnIH19PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJleHBvcnQgY29uc3QgaXNWaWRlbyA9ICh1cmw/OiBzdHJpbmcpID0+XG4gIHVybCAmJiBbJy5tcDQnLCAnLndlYm0nLCAnLm9nZyddLmluY2x1ZGVzKHVybC5zbGljZSh1cmwubGFzdEluZGV4T2YoJy4nKSkpO1xuXG5leHBvcnQgY29uc3QgaXNJbWFnZURhcmsgPSAoXG4gIGltZzogSFRNTEltYWdlRWxlbWVudCxcbiAgY2FsbGJhY2s6IChiOiBib29sZWFuKSA9PiB2b2lkLFxuKSA9PiB7XG4gIGxldCBjb2xvclN1bSA9IDA7XG5cbiAgaWYgKCFpbWcpIHtcbiAgICAvLyBEZWZhdWx0IHZhbHVlIGlzIHRydWUgKERhcmsgaW1hZ2UgTW9kZSlcbiAgICByZXR1cm4gY2FsbGJhY2sodHJ1ZSk7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgaWYgKCFjdHgpIHtcbiAgICAgIC8vIERlZmF1bHQgdmFsdWUgaXMgdHJ1ZSAoRGFyayBpbWFnZSBNb2RlKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRydWUpO1xuICAgIH1cblxuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcblxuICAgIC8vIHdlIG5lZWQgdG8ga25vdyB0aGUgdG9wIHJpZ2h0IHF1YXRlcidzIGF2ZXJhZ2UgY29sb3JcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmZsb29yKGNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgICBjb25zdCB3aWR0aCA9IE1hdGguZmxvb3IoY2FudmFzLndpZHRoIC8gMik7XG4gICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSh3aWR0aCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgY29uc3QgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xuXG4gICAgZm9yIChsZXQgeCA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyB4IDwgbGVuOyB4ICs9IDQpIHtcbiAgICAgIGNvbnN0IHIgPSBkYXRhW3hdO1xuICAgICAgY29uc3QgZyA9IGRhdGFbeCArIDFdO1xuICAgICAgY29uc3QgYiA9IGRhdGFbeCArIDJdO1xuXG4gICAgICBpZiAociA9PT0gdW5kZWZpbmVkIHx8IGcgPT09IHVuZGVmaW5lZCB8fCBiID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmRlZmluZWQgY29sb3InKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXZnID0gTWF0aC5mbG9vcigociArIGcgKyBiKSAvIDMpO1xuICAgICAgY29sb3JTdW0gKz0gYXZnO1xuICAgIH1cblxuICAgIGNvbnN0IGJyaWdodG5lc3MgPSBNYXRoLmZsb29yKGNvbG9yU3VtIC8gKHdpZHRoICogaGVpZ2h0KSk7XG4gICAgLy9CcmlnaHRuZXNzIGlzIG91dCBvZiAyNTUuXG4gICAgcmV0dXJuIGNhbGxiYWNrKGJyaWdodG5lc3MgPCAxMjcuNSk7XG4gIH0gY2F0Y2gge1xuICAgIC8vIERlZmF1bHQgdmFsdWUgaXMgdHJ1ZSAoRGFyayBpbWFnZSBNb2RlKVxuICAgIHJldHVybiBjYWxsYmFjayh0cnVlKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IGJuVG9CaWcgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgQmlnIGZyb20gJ2JpZy5qcyc7XG5pbXBvcnQgeyBCTiB9IGZyb20gJ2JuLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJpZ2ludFRvQmlnKGFtb3VudDogYmlnaW50LCBkZW5vbWluYXRpb246IG51bWJlcik6IEJpZyB7XG4gIHJldHVybiBiblRvQmlnKG5ldyBCTihhbW91bnQudG9TdHJpbmcoKSksIGRlbm9taW5hdGlvbik7XG59XG4iLCJpbXBvcnQgQk4gZnJvbSAnYm4uanMnO1xuXG5pbXBvcnQge1xuICBUb2tlbldpdGhCYWxhbmNlLFxuICBUb2tlbldpdGhCYWxhbmNlQlRDLFxufSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgaGFzVW5jb25maXJtZWRCYWxhbmNlID0gKFxuICB0b2tlbjogVG9rZW5XaXRoQmFsYW5jZSxcbik6IHRva2VuIGlzIFRva2VuV2l0aEJhbGFuY2VCVEMgJiB7IHVuY29uZmlybWVkQmFsYW5jZTogQk4gfSA9PiB7XG4gIHJldHVybiAndW5jb25maXJtZWRCYWxhbmNlJyBpbiB0b2tlbiAmJiBCb29sZWFuKHRva2VuLnVuY29uZmlybWVkQmFsYW5jZSk7XG59O1xuIl0sIm5hbWVzIjpbIlN0YWNrIiwiVHJlbmQiLCJQcm9maXRBbmRMb3NzIiwidXNlU2V0dGluZ3NDb250ZXh0IiwiREVGQVVMVF9ERUNJTUFMUyIsIlBBbmRMIiwidmFsdWUiLCJwZXJjZW50YWdlIiwic2l6ZSIsInNob3dQZXJjZW50YWdlIiwiY3VycmVuY3lGb3JtYXR0ZXIiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJGcmFnbWVudCIsInRyZW5kIiwiVXAiLCJEb3duIiwidG9GaXhlZCIsInVuZGVmaW5lZCIsInVzZUVmZmVjdCIsInVzZUJhbGFuY2VzQ29udGV4dCIsInVzZUxpdmVCYWxhbmNlIiwidG9rZW5UeXBlcyIsInJlZ2lzdGVyU3Vic2NyaWJlciIsInVucmVnaXN0ZXJTdWJzY3JpYmVyIiwiVG9rZW5UeXBlIiwidXNlTmV0d29ya0NvbnRleHQiLCJ1c2VDYWxsYmFjayIsInVzZUhpc3RvcnkiLCJ1c2VMb2NhdGlvbiIsInVzZVNldFNlbmREYXRhSW5QYXJhbXMiLCJwYXRobmFtZSIsIm5ldHdvcmsiLCJoaXN0b3J5Iiwic2V0U2VuZERhdGFJblBhcmFtcyIsInRva2VuIiwiYWRkcmVzcyIsIm9wdGlvbnMiLCJhbW91bnQiLCJwdXNoT3JSZXBsYWNlIiwicmVwbGFjZSIsInB1c2giLCJwYXRoIiwic2VhcmNoIiwiVVJMU2VhcmNoUGFyYW1zIiwidG9rZW5TeW1ib2wiLCJzeW1ib2wiLCJuZXR3b3JrVG9rZW4iLCJ0b2tlbkFkZHJlc3MiLCJ0eXBlIiwiRVJDMjAiLCJ0b1N0cmluZyIsInVzZUJyaWRnZUNvbnRleHQiLCJ1c2VVbmlmaWVkQnJpZGdlQ29udGV4dCIsImNhaXBUb0NoYWluSWQiLCJ1c2VNZW1vIiwidXNlUGVuZGluZ0JyaWRnZVRyYW5zYWN0aW9ucyIsImJyaWRnZVRyYW5zYWN0aW9ucyIsImxlZ2FjeUJyaWRnZVRyYW5zZmVycyIsInN0YXRlIiwicGVuZGluZ1RyYW5zZmVycyIsInVuaWZpZWRCcmlkZ2VUcmFuc2ZlcnMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmaWx0ZXIiLCJ0eCIsImNoYWluSWQiLCJzb3VyY2VDaGFpbiIsInRhcmdldENoYWluIiwidXNlU3RhdGUiLCJpc1ZpZGVvIiwiaXNJbWFnZURhcmsiLCJJbWFnZVdyYXBwZXIiLCJJbWFnZVdpdGhGYWxsYmFjayIsImlwZnNSZXNvbHZlcldpdGhGYWxsYmFjayIsIkNoaXAiLCJzdHlsZWQiLCJUcmlhbmdsZVJpZ2h0SWNvbiIsIkFycm93c01heGltaXplSWNvbiIsIk5mdEltYWdlIiwid2lkdGgiLCJoZWlnaHQiLCJtYXhXaWR0aCIsIm1heEhlaWdodCIsInRoZW1lIiwicGFsZXR0ZSIsImNvbW1vbiIsImJsYWNrIiwiaGFzQm9yZGVyUmFkaXVzIiwiYm9yZGVyUmFkaXVzIiwic2hvd1BvaW50ZXIiLCJOZnRWaWRlbyIsIkNvbGxlY3RpYmxlTWVkaWEiLCJ1cmwiLCJob3ZlciIsIm1hcmdpbiIsInNob3dQbGF5SWNvbiIsImNvbnRyb2xzIiwiY2xhc3NOYW1lIiwic2hvd0JhbGFuY2UiLCJiYWxhbmNlIiwic2hvd0V4cGFuZE9wdGlvbiIsIm5vQWN0aW9uIiwiaXNJbWFnZUZ1bGxTY3JlZW4iLCJzZXRJc0ltYWdlRnVsbFNjcmVlbiIsInNob3VsZFVzZUxpZ2h0SWNvbiIsInNldFNob3VsZFVzZUxpZ2h0SWNvbiIsImlzTWVkaWFTZXR0bGVkIiwic2V0SXNNZWRpYVNldHRsZWQiLCJzeCIsImZsZXhEaXJlY3Rpb24iLCJwb3NpdGlvbiIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsImNvbHVtbkdhcCIsInpJbmRleCIsIm1yIiwibXQiLCJwciIsImJhY2tncm91bmRDb2xvciIsImdyZXkiLCJjb2xvciIsInB4IiwibGFiZWwiLCJvbkNsaWNrIiwiY3Vyc29yIiwic3JjIiwib25Mb2FkU3RhcnQiLCJib3R0b20iLCJyaWdodCIsImlzT3ZlcmxheSIsIm9uQ2xvc2UiLCJiYWNrZHJvcEltYWdlVXJsIiwib25Mb2FkIiwiZXZlbnQiLCJpbWFnZUVsZW1lbnQiLCJ0YXJnZXQiLCJIVE1MSW1hZ2VFbGVtZW50IiwiaXNEYXJrIiwib25FcnJvciIsIkJveCIsIkNoZXZyb25MZWZ0SWNvbiIsIkljb25CdXR0b24iLCJPdmVybGF5IiwiY2hpbGRyZW4iLCJ0b3AiLCJsZWZ0IiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFNpemUiLCJiYWNrZ3JvdW5kUmVwZWF0IiwicHkiLCJkaXNhYmxlUmlwcGxlIiwicCIsImluY2x1ZGVzIiwic2xpY2UiLCJsYXN0SW5kZXhPZiIsImltZyIsImNhbGxiYWNrIiwiY29sb3JTdW0iLCJjYW52YXMiLCJkb2N1bWVudCIsImN0eCIsImdldENvbnRleHQiLCJkcmF3SW1hZ2UiLCJNYXRoIiwiZmxvb3IiLCJpbWFnZURhdGEiLCJnZXRJbWFnZURhdGEiLCJkYXRhIiwieCIsImxlbiIsImxlbmd0aCIsInIiLCJnIiwiYiIsIkVycm9yIiwiYXZnIiwiYnJpZ2h0bmVzcyIsImJuVG9CaWciLCJCTiIsImJpZ2ludFRvQmlnIiwiZGVub21pbmF0aW9uIiwiaGFzVW5jb25maXJtZWRCYWxhbmNlIiwiQm9vbGVhbiIsInVuY29uZmlybWVkQmFsYW5jZSJdLCJzb3VyY2VSb290IjoiIn0=