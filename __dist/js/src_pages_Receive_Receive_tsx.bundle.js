"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Receive_Receive_tsx"],{

/***/ "./src/components/common/AddressK2.tsx":
/*!*********************************************!*\
  !*** ./src/components/common/AddressK2.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrimaryAddressK2": () => (/* binding */ PrimaryAddressK2)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");



function AddressContentK2({
  name,
  address,
  isTruncated = true,
  truncateLength = 9
}) {
  const copyAddress = e => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"].success('Copied!', {
      duration: 2000
    });
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, name && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    height: "24px",
    sx: {
      my: 0,
      mr: 1.5,
      ml: 0
    }
  }, name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flex: `${name ? 0 : 1}`,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body1",
    sx: {
      overflowWrap: 'break-word',
      width: '80%'
    }
  }, isTruncated ? (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_1__.truncateAddress)(address, truncateLength) : address), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.IconButton, {
    size: "medium",
    onClick: copyAddress
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CopyIcon, null))));
}
function PrimaryAddressK2(props) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      background: theme.palette.grey[850],
      px: 2,
      py: 1,
      mb: 5.5,
      borderRadius: `${theme.shape.borderRadius}px`,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    className: props.className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AddressContentK2, props));
}

/***/ }),

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

/***/ "./src/components/common/FunctionIsUnavailable.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/FunctionIsUnavailable.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionIsUnavailable": () => (/* binding */ FunctionIsUnavailable)
/* harmony export */ });
/* harmony import */ var _PageTitle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _FunctionIsOffline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function FunctionIsUnavailable({
  functionName,
  network,
  children
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitle, {
    variant: _PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitleVariant.PRIMARY
  }, functionName), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexGrow: 1,
      px: 4,
      alignContent: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body1",
    minHeight: 24,
    align: "center"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_4__.Trans, {
    i18nKey: "Sorry, {{functionName}} is unavailable on <br/>{{network}} network.",
    values: {
      functionName: (0,_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_1__.getTranslatedFunctionName)(functionName) ?? t('This Feature'),
      network
    }
  })), children));
}

/***/ }),

/***/ "./src/components/common/QRCodeWithLogo.tsx":
/*!**************************************************!*\
  !*** ./src/components/common/QRCodeWithLogo.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QRCodeWithLogo": () => (/* binding */ QRCodeWithLogo)
/* harmony export */ });
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qrcode.react */ "./node_modules/qrcode.react/lib/index.js");
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qrcode_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function QRCodeWithLogo({
  value,
  size = 182,
  className,
  children
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      width: 'fit-content',
      position: 'relative',
      p: 2,
      background: theme.palette.common.white,
      borderRadius: `${theme.shape.borderRadius}px`,
      alignItems: 'center',
      justifyContent: 'center'
    },
    className: className
  }, /*#__PURE__*/React.createElement((qrcode_react__WEBPACK_IMPORTED_MODULE_0___default()), {
    renderAs: "svg",
    fgColor: theme.palette.common.black,
    bgColor: theme.palette.common.white,
    value: value,
    level: "H",
    size: size - 32
  }), children);
}

/***/ }),

/***/ "./src/components/icons/QRCodeLogos.tsx":
/*!**********************************************!*\
  !*** ./src/components/icons/QRCodeLogos.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AvalancheQRCodeLogo": () => (/* binding */ AvalancheQRCodeLogo),
/* harmony export */   "BtcQRCodeLogo": () => (/* binding */ BtcQRCodeLogo),
/* harmony export */   "EthereumQRCodeLogo": () => (/* binding */ EthereumQRCodeLogo)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const innerCirclToOuterCircleRatio = 49.5 / 63;
const QRCodeLogoContainer = ({
  size = 63,
  className,
  children
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const innerCircleSize = Math.floor(size * innerCirclToOuterCircleRatio);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    className: className,
    sx: {
      position: 'absolute',
      borderRadius: '50%',
      backgroundColor: theme.palette.common.white,
      width: size,
      height: size,
      padding: 0.5,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: innerCircleSize,
    height: innerCircleSize,
    viewBox: "0 0 105 105",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, children));
};
const BtcQRCodeLogo = ({
  size,
  className
}) => /*#__PURE__*/React.createElement(QRCodeLogoContainer, {
  size: size,
  className: className
}, /*#__PURE__*/React.createElement("path", {
  d: "M103.369 64.6552C96.4241 92.5126 68.209 109.466 40.3483 102.519C12.4993 95.5744 -4.45418 67.3576 2.49385 39.5024C9.43577 11.642 37.6508 -5.31279 65.5029 1.63219C93.3616 8.57716 110.314 36.797 103.368 64.6557L103.369 64.6552H103.369Z",
  fill: "black"
}), /*#__PURE__*/React.createElement("path", {
  d: "M75.9363 44.5914C76.9713 37.6714 71.7028 33.9516 64.4986 31.4701L66.8357 22.0963L61.1296 20.6744L58.8545 29.8015C57.3544 29.4273 55.8138 29.0748 54.2827 28.7253L56.5743 19.538L50.8717 18.1162L48.5333 27.487C47.292 27.2044 46.0727 26.925 44.8898 26.6307L44.8964 26.6012L37.0275 24.6362L35.5096 30.7307C35.5096 30.7307 39.7431 31.7012 39.6539 31.7609C41.9645 32.3376 42.3824 33.8672 42.313 35.0796L39.6508 45.7586C39.8099 45.799 40.0163 45.8575 40.2441 45.949C40.0537 45.9017 39.8511 45.8501 39.6409 45.7998L35.9094 60.7595C35.627 61.4616 34.9103 62.5151 33.2948 62.115C33.3519 62.1979 29.1474 61.08 29.1474 61.08L26.3145 67.6117L33.7401 69.4629C35.1215 69.8093 36.4752 70.1717 37.8083 70.5126L35.4471 79.9939L41.1466 81.4158L43.485 72.0351C45.042 72.4578 46.5531 72.8477 48.0324 73.2152L45.7019 82.5517L51.4083 83.9735L53.7693 74.5099C63.4994 76.3514 70.8158 75.609 73.8953 66.808C76.3768 59.7223 73.7718 55.6352 68.6528 52.9699C72.3812 52.1101 75.1896 49.6578 75.9383 44.5922L75.9366 44.5909L75.9363 44.5914ZM62.8991 62.873C61.1357 69.9588 49.2054 66.1284 45.3374 65.1679L48.4708 52.6067C52.3385 53.5723 64.7421 55.4832 62.8994 62.873H62.8991ZM64.6638 44.4888C63.0552 50.934 53.1255 47.6595 49.9043 46.8566L52.7452 35.4644C55.9663 36.2673 66.3396 37.7659 64.6643 44.4888H64.6638Z",
  fill: "white"
}));
const AvalancheQRCodeLogo = ({
  size,
  className
}) => /*#__PURE__*/React.createElement(QRCodeLogoContainer, {
  size: size,
  className: className
}, /*#__PURE__*/React.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M104 52C104 80.7188 80.7188 104 52 104C23.2812 104 0 80.7188 0 52C0 23.2812 23.2812 0 52 0C80.7188 0 104 23.2812 104 52ZM37.2648 72.6923H27.1731C25.0526 72.6923 24.005 72.6923 23.3662 72.2835C22.6765 71.8363 22.2549 71.0955 22.2038 70.278C22.1655 69.5242 22.6892 68.6045 23.7368 66.7649L48.6545 22.844C49.7147 20.9789 50.2513 20.0464 50.9283 19.7015C51.6565 19.3311 52.5251 19.3311 53.2533 19.7015C53.9303 20.0464 54.4669 20.9789 55.5272 22.844L60.6497 31.7861L60.6759 31.8317C61.821 33.8326 62.4018 34.8472 62.6553 35.9121C62.9362 37.0746 62.9362 38.3009 62.6553 39.4634C62.3998 40.5365 61.8249 41.5585 60.6624 43.5897L47.5738 66.7267L47.5399 66.786C46.3871 68.8033 45.8029 69.8256 44.9933 70.5974C44.1119 71.4404 43.0517 72.0535 41.8892 72.3985C40.8289 72.6923 39.6409 72.6923 37.2648 72.6923ZM62.7498 72.6934H77.2104C79.3438 72.6934 80.4168 72.6934 81.0555 72.272C81.7453 71.8248 82.1796 71.0711 82.218 70.2535C82.255 69.5247 81.7426 68.6405 80.7384 66.908C80.7042 66.8489 80.6693 66.7889 80.6339 66.7278L73.3909 54.3367L73.3084 54.1973C72.2906 52.476 71.7766 51.6068 71.117 51.2709C70.3889 50.9004 69.5331 50.9004 68.8049 51.2709C68.1406 51.6157 67.604 52.5227 66.5438 54.3494L59.3263 66.7405L59.3015 66.7833C58.245 68.607 57.7169 69.5185 57.755 70.2664C57.8062 71.0839 58.2276 71.8376 58.9175 72.2847C59.5435 72.6934 60.6164 72.6934 62.7498 72.6934Z",
  fill: "black"
}));
const EthereumQRCodeLogo = ({
  size,
  className
}) => /*#__PURE__*/React.createElement(QRCodeLogoContainer, {
  size: size,
  className: className
}, /*#__PURE__*/React.createElement("path", {
  d: "M52 104C80.7188 104 104 80.7188 104 52C104 23.2812 80.7188 0 52 0C23.2812 0 0 23.2812 0 52C0 80.7188 23.2812 104 52 104Z",
  fill: "black"
}), /*#__PURE__*/React.createElement("path", {
  d: "M52.5711 10.9297L26.9902 53.3796L52.5711 41.7528V10.9297Z",
  fill: "#E8E8EB"
}), /*#__PURE__*/React.createElement("path", {
  d: "M52.574 41.7515L26.9932 53.3783L52.574 68.503V41.7515Z",
  fill: "#949497"
}), /*#__PURE__*/React.createElement("path", {
  d: "M78.1725 53.3796L52.5869 10.9297V41.7528L78.1725 53.3796Z",
  fill: "#949497"
}), /*#__PURE__*/React.createElement("path", {
  d: "M52.5869 68.503L78.1725 53.3783L52.5869 41.7515V68.503Z",
  fill: "#3A3A3C"
}), /*#__PURE__*/React.createElement("path", {
  d: "M26.9932 58.2466L52.574 94.2977V73.3619L26.9932 58.2466Z",
  fill: "#E8E8EB"
}), /*#__PURE__*/React.createElement("path", {
  d: "M52.5869 73.3619V94.2977L78.1867 58.2466L52.5869 73.3619Z",
  fill: "#949497"
}));

/***/ }),

/***/ "./src/pages/Receive/Receive.tsx":
/*!***************************************!*\
  !*** ./src/pages/Receive/Receive.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Receive": () => (/* binding */ Receive)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_components_common_QRCodeWithLogo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/QRCodeWithLogo */ "./src/components/common/QRCodeWithLogo.tsx");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_components_icons_QRCodeLogos__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/icons/QRCodeLogos */ "./src/components/icons/QRCodeLogos.tsx");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _src_background_services_network_utils_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/services/network/utils/isEthereumNetwork */ "./src/background/services/network/utils/isEthereumNetwork.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_AddressK2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/components/common/AddressK2 */ "./src/components/common/AddressK2.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _src_components_common_FunctionIsUnavailable__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/components/common/FunctionIsUnavailable */ "./src/components/common/FunctionIsUnavailable.tsx");
/* harmony import */ var _src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/utils/getAddressForChain */ "./src/utils/getAddressForChain.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

















const Receive = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_14__.useTranslation)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__.useNetworkContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_5__.useAccountsContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const isBitcoinActive = network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_15__.NetworkVMType.BITCOIN;
  const isPchainActive = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_9__.isPchainNetwork)(network), [network]);
  const isXchainActive = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isXchainNetwork)(network), [network]);
  const isSolanaActive = network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_15__.NetworkVMType.SVM;
  const {
    checkIsFunctionSupported
  } = (0,_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_10__.useIsFunctionAvailable)();
  const address = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_12__.getAddressForChain)(network, activeAccount), [activeAccount, network]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    capture('ReceivePageVisited');
    // the event should be captured exactly once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function getLogo() {
    if (isBitcoinActive) {
      return /*#__PURE__*/React.createElement(_src_components_icons_QRCodeLogos__WEBPACK_IMPORTED_MODULE_6__.BtcQRCodeLogo, null);
    } else if (network?.chainId && (0,_src_background_services_network_utils_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_7__.isEthereumChainId)(network.chainId)) {
      return /*#__PURE__*/React.createElement(_src_components_icons_QRCodeLogos__WEBPACK_IMPORTED_MODULE_6__.EthereumQRCodeLogo, null);
    } else {
      return /*#__PURE__*/React.createElement(_src_components_icons_QRCodeLogos__WEBPACK_IMPORTED_MODULE_6__.AvalancheQRCodeLogo, null);
    }
  }
  function getName() {
    if (isBitcoinActive) {
      return t('Bitcoin Address');
    } else if (network?.chainId && (0,_src_background_services_network_utils_isEthereumNetwork__WEBPACK_IMPORTED_MODULE_7__.isEthereumChainId)(network.chainId)) {
      return t('Ethereum Address');
    } else if (isPchainActive) {
      return t('Avalanche (P-Chain) Address');
    } else if (isXchainActive) {
      return t('Avalanche (X-Chain) Address');
    } else if (isSolanaActive) {
      return t('Solana Address');
    } else {
      return t('Avalanche (C-Chain) Address');
    }
  }
  if (network && !checkIsFunctionSupported(_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_10__.FunctionNames.RECEIVE)) {
    return /*#__PURE__*/React.createElement(_src_components_common_FunctionIsUnavailable__WEBPACK_IMPORTED_MODULE_11__.FunctionIsUnavailable, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_10__.FunctionNames.RECEIVE,
      network: network?.chainName
    });
  }
  if (!address || !network) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
      sx: {
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.CircularProgress, null));
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      width: '100%',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__.PageTitle, {
    margin: "0"
  }, t('Receive')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    "data-testid": "receive-qr-code",
    sx: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_QRCodeWithLogo__WEBPACK_IMPORTED_MODULE_1__.QRCodeWithLogo, {
    size: 256,
    value: address
  }, getLogo())), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    "data-testid": "receive-address",
    sx: {
      px: 2,
      pr: 3,
      width: '100%',
      gap: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
    variant: "button",
    sx: {
      fontSize: 14
    }
  }, getName()), /*#__PURE__*/React.createElement(_src_components_common_AddressK2__WEBPACK_IMPORTED_MODULE_8__.PrimaryAddressK2, {
    address: address,
    isTruncated: false
  })));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzdCb0IsRUFBRSxFQUFFO01BQ0ZRLEtBQUssRUFBRSxNQUFNO01BQ2JGLFVBQVUsRUFBRSxRQUFRO01BQ3BCRCxjQUFjLEVBQUU7SUFDbEI7RUFBRSxnQkFFRjdCLEtBQUEsQ0FBQXFCLGFBQUEsQ0FBQzZELGlGQUFjO0lBQUMvQyxJQUFJLEVBQUUsR0FBSTtJQUFDZ0QsS0FBSyxFQUFFekU7RUFBUSxHQUN2QzRILE9BQU8sRUFBRSxDQUNLLENBQ1gsZUFDUnRJLEtBQUEsQ0FBQXFCLGFBQUEsQ0FBQ2pCLCtEQUFLO0lBQ0osZUFBWSxpQkFBaUI7SUFDN0JvQixFQUFFLEVBQUU7TUFDRm1CLEVBQUUsRUFBRSxDQUFDO01BQ0xpRyxFQUFFLEVBQUUsQ0FBQztNQUNMNUcsS0FBSyxFQUFFLE1BQU07TUFDYjZHLEdBQUcsRUFBRTtJQUNQO0VBQUUsZ0JBR0Y3SSxLQUFBLENBQUFxQixhQUFBLENBQUNwQixvRUFBVTtJQUFDZ0MsT0FBTyxFQUFDLFFBQVE7SUFBQ1QsRUFBRSxFQUFFO01BQUVzSCxRQUFRLEVBQUU7SUFBRztFQUFFLEdBQy9DTixPQUFPLEVBQUUsQ0FDQyxlQUNieEksS0FBQSxDQUFBcUIsYUFBQSxDQUFDZ0IsOEVBQWdCO0lBQUMzQixPQUFPLEVBQUVBLE9BQVE7SUFBQ0MsV0FBVyxFQUFFO0VBQU0sRUFBRyxDQUNwRCxDQUNGO0FBRVosQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vQWRkcmVzc0syLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0Z1bmN0aW9uSXNPZmZsaW5lLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0Z1bmN0aW9uSXNVbmF2YWlsYWJsZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9RUkNvZGVXaXRoTG9nby50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2ljb25zL1FSQ29kZUxvZ29zLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1JlY2VpdmUvUmVjZWl2ZS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIFR5cG9ncmFwaHksXG4gIHRvYXN0LFxuICBDb3B5SWNvbixcbiAgU3RhY2ssXG4gIEljb25CdXR0b24sXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdHJ1bmNhdGVBZGRyZXNzIH0gZnJvbSAnQHNyYy91dGlscy90cnVuY2F0ZUFkZHJlc3MnO1xuXG5pbnRlcmZhY2UgQWRkcmVzc1Byb3BzIHtcbiAgbmFtZT86IHN0cmluZztcbiAgYWRkcmVzczogc3RyaW5nO1xuICBpc1RydW5jYXRlZD86IGJvb2xlYW47XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbiAgdHJ1bmNhdGVMZW5ndGg/OiBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIEFkZHJlc3NDb250ZW50SzIoe1xuICBuYW1lLFxuICBhZGRyZXNzLFxuICBpc1RydW5jYXRlZCA9IHRydWUsXG4gIHRydW5jYXRlTGVuZ3RoID0gOSxcbn06IEFkZHJlc3NQcm9wcykge1xuICBjb25zdCBjb3B5QWRkcmVzcyA9IChlOiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChhZGRyZXNzKTtcbiAgICB0b2FzdC5zdWNjZXNzKCdDb3BpZWQhJywgeyBkdXJhdGlvbjogMjAwMCB9KTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7bmFtZSAmJiAoXG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgaGVpZ2h0PVwiMjRweFwiXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIG15OiAwLFxuICAgICAgICAgICAgbXI6IDEuNSxcbiAgICAgICAgICAgIG1sOiAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7bmFtZX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgKX1cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXg6IGAke25hbWUgPyAwIDogMX1gLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiYm9keTFcIlxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBvdmVyZmxvd1dyYXA6ICdicmVhay13b3JkJyxcbiAgICAgICAgICAgIHdpZHRoOiAnODAlJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge2lzVHJ1bmNhdGVkID8gdHJ1bmNhdGVBZGRyZXNzKGFkZHJlc3MsIHRydW5jYXRlTGVuZ3RoKSA6IGFkZHJlc3N9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPEljb25CdXR0b24gc2l6ZT1cIm1lZGl1bVwiIG9uQ2xpY2s9e2NvcHlBZGRyZXNzfT5cbiAgICAgICAgICA8Q29weUljb24gLz5cbiAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICA8Lz5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByaW1hcnlBZGRyZXNzSzIocHJvcHM6IEFkZHJlc3NQcm9wcykge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIGJhY2tncm91bmQ6IHRoZW1lLnBhbGV0dGUuZ3JleVs4NTBdLFxuICAgICAgICBweDogMixcbiAgICAgICAgcHk6IDEsXG4gICAgICAgIG1iOiA1LjUsXG4gICAgICAgIGJvcmRlclJhZGl1czogYCR7dGhlbWUuc2hhcGUuYm9yZGVyUmFkaXVzfXB4YCxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICB9fVxuICAgICAgY2xhc3NOYW1lPXtwcm9wcy5jbGFzc05hbWV9XG4gICAgPlxuICAgICAgPEFkZHJlc3NDb250ZW50SzIgey4uLnByb3BzfSAvPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBQcm9wc1dpdGhDaGlsZHJlbiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFBhZ2VUaXRsZSwgUGFnZVRpdGxlVmFyaWFudCB9IGZyb20gJy4vUGFnZVRpdGxlJztcbmltcG9ydCB7IHQgYXMgdHJhbnNsYXRlIH0gZnJvbSAnaTE4bmV4dCc7XG5pbXBvcnQge1xuICBBbGVydENpcmNsZUljb24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IEZ1bmN0aW9uTmFtZXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUlzRnVuY3Rpb25BdmFpbGFibGUnO1xuXG5pbnRlcmZhY2UgRnVuY3Rpb25Jc09mZmxpbmVQcm9wcyB7XG4gIGZ1bmN0aW9uTmFtZTogRnVuY3Rpb25OYW1lcztcbiAgaGlkZVBhZ2VUaXRsZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUcmFuc2xhdGVkRnVuY3Rpb25OYW1lKG5hbWU6IEZ1bmN0aW9uTmFtZXMpIHtcbiAgY29uc3QgdHJhbnNsYXRpb25zID0ge1xuICAgIFtGdW5jdGlvbk5hbWVzLkJSSURHRV06IHRyYW5zbGF0ZSgnQnJpZGdlJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuU1dBUF06IHRyYW5zbGF0ZSgnU3dhcCcpLFxuICAgIFtGdW5jdGlvbk5hbWVzLlNFTkRdOiB0cmFuc2xhdGUoJ1NlbmQnKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5CVVldOiB0cmFuc2xhdGUoJ0J1eScpLFxuICAgIFtGdW5jdGlvbk5hbWVzLkRFRkldOiB0cmFuc2xhdGUoJ0RlRmknKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5LRVlTVE9ORV06IHRyYW5zbGF0ZSgnS2V5c3RvbmUnKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5UT0tFTl9ERVRBSUxTXTogdHJhbnNsYXRlKCdUb2tlbiBEZXRhaWxzJyksXG4gIH07XG5cbiAgcmV0dXJuIHRyYW5zbGF0aW9uc1tuYW1lXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZ1bmN0aW9uSXNPZmZsaW5lKHtcbiAgZnVuY3Rpb25OYW1lLFxuICBoaWRlUGFnZVRpdGxlLFxuICBjaGlsZHJlbixcbn06IFByb3BzV2l0aENoaWxkcmVuPEZ1bmN0aW9uSXNPZmZsaW5lUHJvcHM+KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBoZWlnaHQ6ICcxMDAlJywgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgIHshaGlkZVBhZ2VUaXRsZSAmJiAoXG4gICAgICAgIDxQYWdlVGl0bGUgdmFyaWFudD17UGFnZVRpdGxlVmFyaWFudC5QUklNQVJZfT57dCgnU29ycnknKX08L1BhZ2VUaXRsZT5cbiAgICAgICl9XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3sgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZmxleEdyb3c6IDEgfX1cbiAgICAgID5cbiAgICAgICAgPEFsZXJ0Q2lyY2xlSWNvbiBzaXplPXs3Mn0gc3g9e3sgbWI6IDMsIG10OiAtOSB9fSAvPlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIiBzeD17eyBtYjogMSB9fT5cbiAgICAgICAgICB7dCgnRmVhdHVyZSBEaXNhYmxlZCcpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgYWxpZ249XCJjZW50ZXJcIlxuICAgICAgICAgIGhlaWdodD1cIjI0cHhcIlxuICAgICAgICAgIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dCgne3tmdW5jdGlvbk5hbWV9fSBpcyBjdXJyZW50bHkgdW5hdmFpbGFibGUuJywge1xuICAgICAgICAgICAgZnVuY3Rpb25OYW1lOlxuICAgICAgICAgICAgICBnZXRUcmFuc2xhdGVkRnVuY3Rpb25OYW1lKGZ1bmN0aW9uTmFtZSkgPz8gdCgnVGhpcyBGZWF0dXJlJyksXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHkgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAge3QoJ1BsZWFzZSBjaGVjayBiYWNrIGxhdGVyIGFuZCB0cnkgYWdhaW4uJyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBQYWdlVGl0bGUsIFBhZ2VUaXRsZVZhcmlhbnQgfSBmcm9tICcuL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IGdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUgfSBmcm9tICcuL0Z1bmN0aW9uSXNPZmZsaW5lJztcbmltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IEZ1bmN0aW9uTmFtZXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUlzRnVuY3Rpb25BdmFpbGFibGUnO1xuaW50ZXJmYWNlIEZ1bmN0aW9uSXNPZmZsaW5lUHJvcHMge1xuICBmdW5jdGlvbk5hbWU6IEZ1bmN0aW9uTmFtZXM7XG4gIG5ldHdvcms6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZ1bmN0aW9uSXNVbmF2YWlsYWJsZSh7XG4gIGZ1bmN0aW9uTmFtZSxcbiAgbmV0d29yayxcbiAgY2hpbGRyZW4sXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxGdW5jdGlvbklzT2ZmbGluZVByb3BzPikge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8UGFnZVRpdGxlIHZhcmlhbnQ9e1BhZ2VUaXRsZVZhcmlhbnQuUFJJTUFSWX0+e2Z1bmN0aW9uTmFtZX08L1BhZ2VUaXRsZT5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgIHB4OiA0LFxuICAgICAgICAgIGFsaWduQ29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIiBtaW5IZWlnaHQ9ezI0fSBhbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgIDxUcmFuc1xuICAgICAgICAgICAgaTE4bktleT1cIlNvcnJ5LCB7e2Z1bmN0aW9uTmFtZX19IGlzIHVuYXZhaWxhYmxlIG9uIDxici8+e3tuZXR3b3JrfX0gbmV0d29yay5cIlxuICAgICAgICAgICAgdmFsdWVzPXt7XG4gICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTpcbiAgICAgICAgICAgICAgICBnZXRUcmFuc2xhdGVkRnVuY3Rpb25OYW1lKGZ1bmN0aW9uTmFtZSkgPz8gdCgnVGhpcyBGZWF0dXJlJyksXG4gICAgICAgICAgICAgIG5ldHdvcmssXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IFFSQ29kZSBmcm9tICdxcmNvZGUucmVhY3QnO1xuaW1wb3J0IHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBTdGFjaywgdXNlVGhlbWUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gUVJDb2RlV2l0aExvZ28oe1xuICB2YWx1ZSxcbiAgc2l6ZSA9IDE4MixcbiAgY2xhc3NOYW1lLFxuICBjaGlsZHJlbixcbn06IFByb3BzV2l0aENoaWxkcmVuPHtcbiAgdmFsdWU6IHN0cmluZztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICBzaXplPzogbnVtYmVyO1xufT4pIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6ICdmaXQtY29udGVudCcsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICBwOiAyLFxuICAgICAgICBiYWNrZ3JvdW5kOiB0aGVtZS5wYWxldHRlLmNvbW1vbi53aGl0ZSxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiBgJHt0aGVtZS5zaGFwZS5ib3JkZXJSYWRpdXN9cHhgLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgfX1cbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgID5cbiAgICAgIDxRUkNvZGVcbiAgICAgICAgcmVuZGVyQXM9XCJzdmdcIlxuICAgICAgICBmZ0NvbG9yPXt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja31cbiAgICAgICAgYmdDb2xvcj17dGhlbWUucGFsZXR0ZS5jb21tb24ud2hpdGV9XG4gICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgbGV2ZWw9XCJIXCJcbiAgICAgICAgc2l6ZT17c2l6ZSAtIDMyfVxuICAgICAgLz5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgU3RhY2ssIHVzZVRoZW1lIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgaW5uZXJDaXJjbFRvT3V0ZXJDaXJjbGVSYXRpbyA9IDQ5LjUgLyA2MztcblxuaW50ZXJmYWNlIFFSQ29kZUxvZ29Qcm9wcyB7XG4gIHNpemU/OiBudW1iZXI7XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFFSQ29kZUxvZ29Db250YWluZXJQcm9wcyBleHRlbmRzIFFSQ29kZUxvZ29Qcm9wcyB7XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGU7XG59XG5cbmNvbnN0IFFSQ29kZUxvZ29Db250YWluZXIgPSAoe1xuICBzaXplID0gNjMsXG4gIGNsYXNzTmFtZSxcbiAgY2hpbGRyZW4sXG59OiBRUkNvZGVMb2dvQ29udGFpbmVyUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCBpbm5lckNpcmNsZVNpemUgPSBNYXRoLmZsb29yKHNpemUgKiBpbm5lckNpcmNsVG9PdXRlckNpcmNsZVJhdGlvKTtcbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgc3g9e3tcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhlbWUucGFsZXR0ZS5jb21tb24ud2hpdGUsXG4gICAgICAgIHdpZHRoOiBzaXplLFxuICAgICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICAgIHBhZGRpbmc6IDAuNSxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPHN2Z1xuICAgICAgICB3aWR0aD17aW5uZXJDaXJjbGVTaXplfVxuICAgICAgICBoZWlnaHQ9e2lubmVyQ2lyY2xlU2l6ZX1cbiAgICAgICAgdmlld0JveD1cIjAgMCAxMDUgMTA1XCJcbiAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgID5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9zdmc+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBCdGNRUkNvZGVMb2dvID0gKHsgc2l6ZSwgY2xhc3NOYW1lIH06IFFSQ29kZUxvZ29Qcm9wcykgPT4gKFxuICA8UVJDb2RlTG9nb0NvbnRhaW5lciBzaXplPXtzaXplfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgPHBhdGhcbiAgICAgIGQ9XCJNMTAzLjM2OSA2NC42NTUyQzk2LjQyNDEgOTIuNTEyNiA2OC4yMDkgMTA5LjQ2NiA0MC4zNDgzIDEwMi41MTlDMTIuNDk5MyA5NS41NzQ0IC00LjQ1NDE4IDY3LjM1NzYgMi40OTM4NSAzOS41MDI0QzkuNDM1NzcgMTEuNjQyIDM3LjY1MDggLTUuMzEyNzkgNjUuNTAyOSAxLjYzMjE5QzkzLjM2MTYgOC41NzcxNiAxMTAuMzE0IDM2Ljc5NyAxMDMuMzY4IDY0LjY1NTdMMTAzLjM2OSA2NC42NTUySDEwMy4zNjlaXCJcbiAgICAgIGZpbGw9XCJibGFja1wiXG4gICAgLz5cbiAgICA8cGF0aFxuICAgICAgZD1cIk03NS45MzYzIDQ0LjU5MTRDNzYuOTcxMyAzNy42NzE0IDcxLjcwMjggMzMuOTUxNiA2NC40OTg2IDMxLjQ3MDFMNjYuODM1NyAyMi4wOTYzTDYxLjEyOTYgMjAuNjc0NEw1OC44NTQ1IDI5LjgwMTVDNTcuMzU0NCAyOS40MjczIDU1LjgxMzggMjkuMDc0OCA1NC4yODI3IDI4LjcyNTNMNTYuNTc0MyAxOS41MzhMNTAuODcxNyAxOC4xMTYyTDQ4LjUzMzMgMjcuNDg3QzQ3LjI5MiAyNy4yMDQ0IDQ2LjA3MjcgMjYuOTI1IDQ0Ljg4OTggMjYuNjMwN0w0NC44OTY0IDI2LjYwMTJMMzcuMDI3NSAyNC42MzYyTDM1LjUwOTYgMzAuNzMwN0MzNS41MDk2IDMwLjczMDcgMzkuNzQzMSAzMS43MDEyIDM5LjY1MzkgMzEuNzYwOUM0MS45NjQ1IDMyLjMzNzYgNDIuMzgyNCAzMy44NjcyIDQyLjMxMyAzNS4wNzk2TDM5LjY1MDggNDUuNzU4NkMzOS44MDk5IDQ1Ljc5OSA0MC4wMTYzIDQ1Ljg1NzUgNDAuMjQ0MSA0NS45NDlDNDAuMDUzNyA0NS45MDE3IDM5Ljg1MTEgNDUuODUwMSAzOS42NDA5IDQ1Ljc5OThMMzUuOTA5NCA2MC43NTk1QzM1LjYyNyA2MS40NjE2IDM0LjkxMDMgNjIuNTE1MSAzMy4yOTQ4IDYyLjExNUMzMy4zNTE5IDYyLjE5NzkgMjkuMTQ3NCA2MS4wOCAyOS4xNDc0IDYxLjA4TDI2LjMxNDUgNjcuNjExN0wzMy43NDAxIDY5LjQ2MjlDMzUuMTIxNSA2OS44MDkzIDM2LjQ3NTIgNzAuMTcxNyAzNy44MDgzIDcwLjUxMjZMMzUuNDQ3MSA3OS45OTM5TDQxLjE0NjYgODEuNDE1OEw0My40ODUgNzIuMDM1MUM0NS4wNDIgNzIuNDU3OCA0Ni41NTMxIDcyLjg0NzcgNDguMDMyNCA3My4yMTUyTDQ1LjcwMTkgODIuNTUxN0w1MS40MDgzIDgzLjk3MzVMNTMuNzY5MyA3NC41MDk5QzYzLjQ5OTQgNzYuMzUxNCA3MC44MTU4IDc1LjYwOSA3My44OTUzIDY2LjgwOEM3Ni4zNzY4IDU5LjcyMjMgNzMuNzcxOCA1NS42MzUyIDY4LjY1MjggNTIuOTY5OUM3Mi4zODEyIDUyLjExMDEgNzUuMTg5NiA0OS42NTc4IDc1LjkzODMgNDQuNTkyMkw3NS45MzY2IDQ0LjU5MDlMNzUuOTM2MyA0NC41OTE0Wk02Mi44OTkxIDYyLjg3M0M2MS4xMzU3IDY5Ljk1ODggNDkuMjA1NCA2Ni4xMjg0IDQ1LjMzNzQgNjUuMTY3OUw0OC40NzA4IDUyLjYwNjdDNTIuMzM4NSA1My41NzIzIDY0Ljc0MjEgNTUuNDgzMiA2Mi44OTk0IDYyLjg3M0g2Mi44OTkxWk02NC42NjM4IDQ0LjQ4ODhDNjMuMDU1MiA1MC45MzQgNTMuMTI1NSA0Ny42NTk1IDQ5LjkwNDMgNDYuODU2Nkw1Mi43NDUyIDM1LjQ2NDRDNTUuOTY2MyAzNi4yNjczIDY2LjMzOTYgMzcuNzY1OSA2NC42NjQzIDQ0LjQ4ODhINjQuNjYzOFpcIlxuICAgICAgZmlsbD1cIndoaXRlXCJcbiAgICAvPlxuICA8L1FSQ29kZUxvZ29Db250YWluZXI+XG4pO1xuXG5leHBvcnQgY29uc3QgQXZhbGFuY2hlUVJDb2RlTG9nbyA9ICh7IHNpemUsIGNsYXNzTmFtZSB9OiBRUkNvZGVMb2dvUHJvcHMpID0+IChcbiAgPFFSQ29kZUxvZ29Db250YWluZXIgc2l6ZT17c2l6ZX0gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgIDxwYXRoXG4gICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgIGQ9XCJNMTA0IDUyQzEwNCA4MC43MTg4IDgwLjcxODggMTA0IDUyIDEwNEMyMy4yODEyIDEwNCAwIDgwLjcxODggMCA1MkMwIDIzLjI4MTIgMjMuMjgxMiAwIDUyIDBDODAuNzE4OCAwIDEwNCAyMy4yODEyIDEwNCA1MlpNMzcuMjY0OCA3Mi42OTIzSDI3LjE3MzFDMjUuMDUyNiA3Mi42OTIzIDI0LjAwNSA3Mi42OTIzIDIzLjM2NjIgNzIuMjgzNUMyMi42NzY1IDcxLjgzNjMgMjIuMjU0OSA3MS4wOTU1IDIyLjIwMzggNzAuMjc4QzIyLjE2NTUgNjkuNTI0MiAyMi42ODkyIDY4LjYwNDUgMjMuNzM2OCA2Ni43NjQ5TDQ4LjY1NDUgMjIuODQ0QzQ5LjcxNDcgMjAuOTc4OSA1MC4yNTEzIDIwLjA0NjQgNTAuOTI4MyAxOS43MDE1QzUxLjY1NjUgMTkuMzMxMSA1Mi41MjUxIDE5LjMzMTEgNTMuMjUzMyAxOS43MDE1QzUzLjkzMDMgMjAuMDQ2NCA1NC40NjY5IDIwLjk3ODkgNTUuNTI3MiAyMi44NDRMNjAuNjQ5NyAzMS43ODYxTDYwLjY3NTkgMzEuODMxN0M2MS44MjEgMzMuODMyNiA2Mi40MDE4IDM0Ljg0NzIgNjIuNjU1MyAzNS45MTIxQzYyLjkzNjIgMzcuMDc0NiA2Mi45MzYyIDM4LjMwMDkgNjIuNjU1MyAzOS40NjM0QzYyLjM5OTggNDAuNTM2NSA2MS44MjQ5IDQxLjU1ODUgNjAuNjYyNCA0My41ODk3TDQ3LjU3MzggNjYuNzI2N0w0Ny41Mzk5IDY2Ljc4NkM0Ni4zODcxIDY4LjgwMzMgNDUuODAyOSA2OS44MjU2IDQ0Ljk5MzMgNzAuNTk3NEM0NC4xMTE5IDcxLjQ0MDQgNDMuMDUxNyA3Mi4wNTM1IDQxLjg4OTIgNzIuMzk4NUM0MC44Mjg5IDcyLjY5MjMgMzkuNjQwOSA3Mi42OTIzIDM3LjI2NDggNzIuNjkyM1pNNjIuNzQ5OCA3Mi42OTM0SDc3LjIxMDRDNzkuMzQzOCA3Mi42OTM0IDgwLjQxNjggNzIuNjkzNCA4MS4wNTU1IDcyLjI3MkM4MS43NDUzIDcxLjgyNDggODIuMTc5NiA3MS4wNzExIDgyLjIxOCA3MC4yNTM1QzgyLjI1NSA2OS41MjQ3IDgxLjc0MjYgNjguNjQwNSA4MC43Mzg0IDY2LjkwOEM4MC43MDQyIDY2Ljg0ODkgODAuNjY5MyA2Ni43ODg5IDgwLjYzMzkgNjYuNzI3OEw3My4zOTA5IDU0LjMzNjdMNzMuMzA4NCA1NC4xOTczQzcyLjI5MDYgNTIuNDc2IDcxLjc3NjYgNTEuNjA2OCA3MS4xMTcgNTEuMjcwOUM3MC4zODg5IDUwLjkwMDQgNjkuNTMzMSA1MC45MDA0IDY4LjgwNDkgNTEuMjcwOUM2OC4xNDA2IDUxLjYxNTcgNjcuNjA0IDUyLjUyMjcgNjYuNTQzOCA1NC4zNDk0TDU5LjMyNjMgNjYuNzQwNUw1OS4zMDE1IDY2Ljc4MzNDNTguMjQ1IDY4LjYwNyA1Ny43MTY5IDY5LjUxODUgNTcuNzU1IDcwLjI2NjRDNTcuODA2MiA3MS4wODM5IDU4LjIyNzYgNzEuODM3NiA1OC45MTc1IDcyLjI4NDdDNTkuNTQzNSA3Mi42OTM0IDYwLjYxNjQgNzIuNjkzNCA2Mi43NDk4IDcyLjY5MzRaXCJcbiAgICAgIGZpbGw9XCJibGFja1wiXG4gICAgLz5cbiAgPC9RUkNvZGVMb2dvQ29udGFpbmVyPlxuKTtcbmV4cG9ydCBjb25zdCBFdGhlcmV1bVFSQ29kZUxvZ28gPSAoeyBzaXplLCBjbGFzc05hbWUgfTogUVJDb2RlTG9nb1Byb3BzKSA9PiAoXG4gIDxRUkNvZGVMb2dvQ29udGFpbmVyIHNpemU9e3NpemV9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICA8cGF0aFxuICAgICAgZD1cIk01MiAxMDRDODAuNzE4OCAxMDQgMTA0IDgwLjcxODggMTA0IDUyQzEwNCAyMy4yODEyIDgwLjcxODggMCA1MiAwQzIzLjI4MTIgMCAwIDIzLjI4MTIgMCA1MkMwIDgwLjcxODggMjMuMjgxMiAxMDQgNTIgMTA0WlwiXG4gICAgICBmaWxsPVwiYmxhY2tcIlxuICAgIC8+XG4gICAgPHBhdGhcbiAgICAgIGQ9XCJNNTIuNTcxMSAxMC45Mjk3TDI2Ljk5MDIgNTMuMzc5Nkw1Mi41NzExIDQxLjc1MjhWMTAuOTI5N1pcIlxuICAgICAgZmlsbD1cIiNFOEU4RUJcIlxuICAgIC8+XG4gICAgPHBhdGhcbiAgICAgIGQ9XCJNNTIuNTc0IDQxLjc1MTVMMjYuOTkzMiA1My4zNzgzTDUyLjU3NCA2OC41MDNWNDEuNzUxNVpcIlxuICAgICAgZmlsbD1cIiM5NDk0OTdcIlxuICAgIC8+XG4gICAgPHBhdGhcbiAgICAgIGQ9XCJNNzguMTcyNSA1My4zNzk2TDUyLjU4NjkgMTAuOTI5N1Y0MS43NTI4TDc4LjE3MjUgNTMuMzc5NlpcIlxuICAgICAgZmlsbD1cIiM5NDk0OTdcIlxuICAgIC8+XG4gICAgPHBhdGhcbiAgICAgIGQ9XCJNNTIuNTg2OSA2OC41MDNMNzguMTcyNSA1My4zNzgzTDUyLjU4NjkgNDEuNzUxNVY2OC41MDNaXCJcbiAgICAgIGZpbGw9XCIjM0EzQTNDXCJcbiAgICAvPlxuICAgIDxwYXRoXG4gICAgICBkPVwiTTI2Ljk5MzIgNTguMjQ2Nkw1Mi41NzQgOTQuMjk3N1Y3My4zNjE5TDI2Ljk5MzIgNTguMjQ2NlpcIlxuICAgICAgZmlsbD1cIiNFOEU4RUJcIlxuICAgIC8+XG4gICAgPHBhdGhcbiAgICAgIGQ9XCJNNTIuNTg2OSA3My4zNjE5Vjk0LjI5NzdMNzguMTg2NyA1OC4yNDY2TDUyLjU4NjkgNzMuMzYxOVpcIlxuICAgICAgZmlsbD1cIiM5NDk0OTdcIlxuICAgIC8+XG4gIDwvUVJDb2RlTG9nb0NvbnRhaW5lcj5cbik7XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IFFSQ29kZVdpdGhMb2dvIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9RUkNvZGVXaXRoTG9nbyc7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQge1xuICBCdGNRUkNvZGVMb2dvLFxuICBFdGhlcmV1bVFSQ29kZUxvZ28sXG4gIEF2YWxhbmNoZVFSQ29kZUxvZ28sXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9pY29ucy9RUkNvZGVMb2dvcyc7XG5pbXBvcnQgeyBOZXR3b3JrVk1UeXBlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7IGlzRXRoZXJldW1DaGFpbklkIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNFdGhlcmV1bU5ldHdvcmsnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IFByaW1hcnlBZGRyZXNzSzIgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0FkZHJlc3NLMic7XG5pbXBvcnQge1xuICBDaXJjdWxhclByb2dyZXNzLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IGlzUGNoYWluTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzQXZhbGFuY2hlUGNoYWluTmV0d29yayc7XG5pbXBvcnQge1xuICBGdW5jdGlvbk5hbWVzLFxuICB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlLFxufSBmcm9tICdAc3JjL2hvb2tzL3VzZUlzRnVuY3Rpb25BdmFpbGFibGUnO1xuaW1wb3J0IHsgRnVuY3Rpb25Jc1VuYXZhaWxhYmxlIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9GdW5jdGlvbklzVW5hdmFpbGFibGUnO1xuaW1wb3J0IHsgZ2V0QWRkcmVzc0ZvckNoYWluIH0gZnJvbSAnQHNyYy91dGlscy9nZXRBZGRyZXNzRm9yQ2hhaW4nO1xuaW1wb3J0IHsgaXNYY2hhaW5OZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNBdmFsYW5jaGVYY2hhaW5OZXR3b3JrJztcblxuZXhwb3J0IGNvbnN0IFJlY2VpdmUgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCB7XG4gICAgYWNjb3VudHM6IHsgYWN0aXZlOiBhY3RpdmVBY2NvdW50IH0sXG4gIH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IGlzQml0Y29pbkFjdGl2ZSA9IG5ldHdvcms/LnZtTmFtZSA9PT0gTmV0d29ya1ZNVHlwZS5CSVRDT0lOO1xuICBjb25zdCBpc1BjaGFpbkFjdGl2ZSA9IHVzZU1lbW8oKCkgPT4gaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspLCBbbmV0d29ya10pO1xuICBjb25zdCBpc1hjaGFpbkFjdGl2ZSA9IHVzZU1lbW8oKCkgPT4gaXNYY2hhaW5OZXR3b3JrKG5ldHdvcmspLCBbbmV0d29ya10pO1xuICBjb25zdCBpc1NvbGFuYUFjdGl2ZSA9IG5ldHdvcms/LnZtTmFtZSA9PT0gTmV0d29ya1ZNVHlwZS5TVk07XG4gIGNvbnN0IHsgY2hlY2tJc0Z1bmN0aW9uU3VwcG9ydGVkIH0gPSB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlKCk7XG5cbiAgY29uc3QgYWRkcmVzcyA9IHVzZU1lbW8oXG4gICAgKCkgPT4gZ2V0QWRkcmVzc0ZvckNoYWluKG5ldHdvcmssIGFjdGl2ZUFjY291bnQpLFxuICAgIFthY3RpdmVBY2NvdW50LCBuZXR3b3JrXSxcbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNhcHR1cmUoJ1JlY2VpdmVQYWdlVmlzaXRlZCcpO1xuICAgIC8vIHRoZSBldmVudCBzaG91bGQgYmUgY2FwdHVyZWQgZXhhY3RseSBvbmNlXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbXSk7XG5cbiAgZnVuY3Rpb24gZ2V0TG9nbygpIHtcbiAgICBpZiAoaXNCaXRjb2luQWN0aXZlKSB7XG4gICAgICByZXR1cm4gPEJ0Y1FSQ29kZUxvZ28gLz47XG4gICAgfSBlbHNlIGlmIChuZXR3b3JrPy5jaGFpbklkICYmIGlzRXRoZXJldW1DaGFpbklkKG5ldHdvcmsuY2hhaW5JZCkpIHtcbiAgICAgIHJldHVybiA8RXRoZXJldW1RUkNvZGVMb2dvIC8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPEF2YWxhbmNoZVFSQ29kZUxvZ28gLz47XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmFtZSgpIHtcbiAgICBpZiAoaXNCaXRjb2luQWN0aXZlKSB7XG4gICAgICByZXR1cm4gdCgnQml0Y29pbiBBZGRyZXNzJyk7XG4gICAgfSBlbHNlIGlmIChuZXR3b3JrPy5jaGFpbklkICYmIGlzRXRoZXJldW1DaGFpbklkKG5ldHdvcmsuY2hhaW5JZCkpIHtcbiAgICAgIHJldHVybiB0KCdFdGhlcmV1bSBBZGRyZXNzJyk7XG4gICAgfSBlbHNlIGlmIChpc1BjaGFpbkFjdGl2ZSkge1xuICAgICAgcmV0dXJuIHQoJ0F2YWxhbmNoZSAoUC1DaGFpbikgQWRkcmVzcycpO1xuICAgIH0gZWxzZSBpZiAoaXNYY2hhaW5BY3RpdmUpIHtcbiAgICAgIHJldHVybiB0KCdBdmFsYW5jaGUgKFgtQ2hhaW4pIEFkZHJlc3MnKTtcbiAgICB9IGVsc2UgaWYgKGlzU29sYW5hQWN0aXZlKSB7XG4gICAgICByZXR1cm4gdCgnU29sYW5hIEFkZHJlc3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHQoJ0F2YWxhbmNoZSAoQy1DaGFpbikgQWRkcmVzcycpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChuZXR3b3JrICYmICFjaGVja0lzRnVuY3Rpb25TdXBwb3J0ZWQoRnVuY3Rpb25OYW1lcy5SRUNFSVZFKSkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnVuY3Rpb25Jc1VuYXZhaWxhYmxlXG4gICAgICAgIGZ1bmN0aW9uTmFtZT17RnVuY3Rpb25OYW1lcy5SRUNFSVZFfVxuICAgICAgICBuZXR3b3JrPXtuZXR3b3JrPy5jaGFpbk5hbWV9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBpZiAoIWFkZHJlc3MgfHwgIW5ldHdvcmspIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrIHN4PXt7IGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyB9fT5cbiAgICAgICAgPENpcmN1bGFyUHJvZ3Jlc3MgLz5cbiAgICAgIDwvU3RhY2s+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8UGFnZVRpdGxlIG1hcmdpbj1cIjBcIj57dCgnUmVjZWl2ZScpfTwvUGFnZVRpdGxlPlxuICAgICAgPFN0YWNrXG4gICAgICAgIGRhdGEtdGVzdGlkPVwicmVjZWl2ZS1xci1jb2RlXCJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFFSQ29kZVdpdGhMb2dvIHNpemU9ezI1Nn0gdmFsdWU9e2FkZHJlc3N9PlxuICAgICAgICAgIHtnZXRMb2dvKCl9XG4gICAgICAgIDwvUVJDb2RlV2l0aExvZ28+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFN0YWNrXG4gICAgICAgIGRhdGEtdGVzdGlkPVwicmVjZWl2ZS1hZGRyZXNzXCJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBweDogMixcbiAgICAgICAgICBwcjogMyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGdhcDogMS41LFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7LyogVE9ETzogcmVtb3ZlIHN4IG92ZXJyaWRlIGFzIGBidXR0b25gIHZhcmlhbnQgc2hvdWxkIGJlIDE0cHggYnkgZGVmYXVsdCwgYnV0IGN1cnJlbnRseSBpc24ndCBpbiBrMiAqL31cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJ1dHRvblwiIHN4PXt7IGZvbnRTaXplOiAxNCB9fT5cbiAgICAgICAgICB7Z2V0TmFtZSgpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxQcmltYXJ5QWRkcmVzc0syIGFkZHJlc3M9e2FkZHJlc3N9IGlzVHJ1bmNhdGVkPXtmYWxzZX0gLz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJUeXBvZ3JhcGh5IiwidG9hc3QiLCJDb3B5SWNvbiIsIlN0YWNrIiwiSWNvbkJ1dHRvbiIsInVzZVRoZW1lIiwidHJ1bmNhdGVBZGRyZXNzIiwiQWRkcmVzc0NvbnRlbnRLMiIsIm5hbWUiLCJhZGRyZXNzIiwiaXNUcnVuY2F0ZWQiLCJ0cnVuY2F0ZUxlbmd0aCIsImNvcHlBZGRyZXNzIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInN1Y2Nlc3MiLCJkdXJhdGlvbiIsImNyZWF0ZUVsZW1lbnQiLCJGcmFnbWVudCIsImhlaWdodCIsInN4IiwibXkiLCJtciIsIm1sIiwiZmxleCIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsImZsZXhEaXJlY3Rpb24iLCJ3aWR0aCIsInZhcmlhbnQiLCJvdmVyZmxvd1dyYXAiLCJzaXplIiwib25DbGljayIsIlByaW1hcnlBZGRyZXNzSzIiLCJwcm9wcyIsInRoZW1lIiwiYmFja2dyb3VuZCIsInBhbGV0dGUiLCJncmV5IiwicHgiLCJweSIsIm1iIiwiYm9yZGVyUmFkaXVzIiwic2hhcGUiLCJjbGFzc05hbWUiLCJQYWdlVGl0bGUiLCJQYWdlVGl0bGVWYXJpYW50IiwidCIsInRyYW5zbGF0ZSIsIkFsZXJ0Q2lyY2xlSWNvbiIsInVzZVRyYW5zbGF0aW9uIiwiRnVuY3Rpb25OYW1lcyIsImdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUiLCJ0cmFuc2xhdGlvbnMiLCJCUklER0UiLCJTV0FQIiwiU0VORCIsIkJVWSIsIkRFRkkiLCJLRVlTVE9ORSIsIlRPS0VOX0RFVEFJTFMiLCJGdW5jdGlvbklzT2ZmbGluZSIsImZ1bmN0aW9uTmFtZSIsImhpZGVQYWdlVGl0bGUiLCJjaGlsZHJlbiIsIlBSSU1BUlkiLCJmbGV4R3JvdyIsIm10IiwiYWxpZ24iLCJjb2xvciIsIlRyYW5zIiwiRnVuY3Rpb25Jc1VuYXZhaWxhYmxlIiwibmV0d29yayIsImFsaWduQ29udGVudCIsIm1pbkhlaWdodCIsImkxOG5LZXkiLCJ2YWx1ZXMiLCJRUkNvZGUiLCJRUkNvZGVXaXRoTG9nbyIsInZhbHVlIiwicG9zaXRpb24iLCJwIiwiY29tbW9uIiwid2hpdGUiLCJyZW5kZXJBcyIsImZnQ29sb3IiLCJibGFjayIsImJnQ29sb3IiLCJsZXZlbCIsImlubmVyQ2lyY2xUb091dGVyQ2lyY2xlUmF0aW8iLCJRUkNvZGVMb2dvQ29udGFpbmVyIiwiaW5uZXJDaXJjbGVTaXplIiwiTWF0aCIsImZsb29yIiwiYmFja2dyb3VuZENvbG9yIiwicGFkZGluZyIsInZpZXdCb3giLCJmaWxsIiwieG1sbnMiLCJCdGNRUkNvZGVMb2dvIiwiZCIsIkF2YWxhbmNoZVFSQ29kZUxvZ28iLCJmaWxsUnVsZSIsImNsaXBSdWxlIiwiRXRoZXJldW1RUkNvZGVMb2dvIiwidXNlRWZmZWN0IiwidXNlTWVtbyIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJ1c2VOZXR3b3JrQ29udGV4dCIsInVzZUFjY291bnRzQ29udGV4dCIsIk5ldHdvcmtWTVR5cGUiLCJpc0V0aGVyZXVtQ2hhaW5JZCIsIkNpcmN1bGFyUHJvZ3Jlc3MiLCJpc1BjaGFpbk5ldHdvcmsiLCJ1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlIiwiZ2V0QWRkcmVzc0ZvckNoYWluIiwiaXNYY2hhaW5OZXR3b3JrIiwiUmVjZWl2ZSIsImFjY291bnRzIiwiYWN0aXZlIiwiYWN0aXZlQWNjb3VudCIsImNhcHR1cmUiLCJpc0JpdGNvaW5BY3RpdmUiLCJ2bU5hbWUiLCJCSVRDT0lOIiwiaXNQY2hhaW5BY3RpdmUiLCJpc1hjaGFpbkFjdGl2ZSIsImlzU29sYW5hQWN0aXZlIiwiU1ZNIiwiY2hlY2tJc0Z1bmN0aW9uU3VwcG9ydGVkIiwiZ2V0TG9nbyIsImNoYWluSWQiLCJnZXROYW1lIiwiUkVDRUlWRSIsImNoYWluTmFtZSIsIm1hcmdpbiIsInByIiwiZ2FwIiwiZm9udFNpemUiXSwic291cmNlUm9vdCI6IiJ9