"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ImportWithWalletConnect_ImportWithWalletConnect_tsx"],{

/***/ "./src/pages/ImportWithWalletConnect/ImportWithWalletConnect.tsx":
/*!***********************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/ImportWithWalletConnect.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImportWithWalletConnect)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _components_WalletConnectCircledIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/WalletConnectCircledIcon */ "./src/pages/ImportWithWalletConnect/components/WalletConnectCircledIcon.tsx");
/* harmony import */ var _components_WalletConnectConnector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/WalletConnectConnector */ "./src/pages/ImportWithWalletConnect/components/WalletConnectConnector.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function ImportWithWalletConnect({
  onConnect,
  appIcon
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    goBack,
    replace
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useHistory)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__.useAnalyticsContext)();
  const handleSuccessfulConnection = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(result => {
    if (typeof onConnect === 'function') {
      onConnect(result);
    } else {
      capture('ImportWithWalletConnect_Success');
      replace('/accounts');
    }
  }, [replace, onConnect, capture]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      background: theme.palette.background.paper
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitle, {
    margin: "20px 0 4px",
    onBackClick: goBack
  }, t('Connect your Wallet')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      gap: 2.5,
      px: 5,
      mt: 3,
      height: '100%',
      alignItems: 'center'
    }
  }, appIcon ?? /*#__PURE__*/React.createElement(_components_WalletConnectCircledIcon__WEBPACK_IMPORTED_MODULE_2__.WalletConnectCircledIcon, null), /*#__PURE__*/React.createElement(_components_WalletConnectConnector__WEBPACK_IMPORTED_MODULE_3__["default"], {
    onConnect: handleSuccessfulConnection
  })));
}

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectCircledIcon.tsx":
/*!***********************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectCircledIcon.tsx ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectCircledIcon": () => (/* binding */ WalletConnectCircledIcon)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const WalletConnectCircledIcon = () => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Avatar, {
  sx: {
    width: '64px',
    height: '64px',
    border: '1px solid',
    borderColor: 'info.dark'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.WalletConnectIcon, {
  size: 42
}));

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectConnector.tsx":
/*!*********************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectConnector.tsx ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WalletConnectConnector)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_WalletConnectContextProvider_WalletConnectContextProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/WalletConnectContextProvider/WalletConnectContextProvider */ "./src/contexts/WalletConnectContextProvider/WalletConnectContextProvider.tsx");
/* harmony import */ var _WalletConnectQRCode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WalletConnectQRCode */ "./src/pages/ImportWithWalletConnect/components/WalletConnectQRCode.tsx");
/* harmony import */ var _WalletConnectStatusMessage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WalletConnectStatusMessage */ "./src/pages/ImportWithWalletConnect/components/WalletConnectStatusMessage.tsx");
/* harmony import */ var _WalletConnectURIField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WalletConnectURIField */ "./src/pages/ImportWithWalletConnect/components/WalletConnectURIField.tsx");
/* harmony import */ var _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/WalletConnectContextProvider/models */ "./src/contexts/WalletConnectContextProvider/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








var WalletConnectTabs = /*#__PURE__*/function (WalletConnectTabs) {
  WalletConnectTabs[WalletConnectTabs["QR"] = 0] = "QR";
  WalletConnectTabs[WalletConnectTabs["URI"] = 1] = "URI";
  return WalletConnectTabs;
}(WalletConnectTabs || {});
function WalletConnectConnector({
  reconnectionAddress,
  customMessage,
  onConnect
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const [tab, setTab] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(WalletConnectTabs.QR);
  const {
    importState,
    reset,
    initiateImport
  } = (0,_src_contexts_WalletConnectContextProvider_WalletConnectContextProvider__WEBPACK_IMPORTED_MODULE_1__.useWalletConnectContext)();
  const hasConnectionUri = ('uri' in importState);
  const showRegenerateButton = importState.status === _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_5__.AccountImportStatus.Failed;

  // Reset import state on mount
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(reset, [reset]);

  // Initiate account import as soon as this page is displayed,
  // as long as it wasn't already initiated.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (importState.status === _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_5__.AccountImportStatus.NotInitiated) {
      initiateImport(reconnectionAddress, onConnect);
    }
  }, [initiateImport, reconnectionAddress, importState.status, onConnect]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      gap: 2.5,
      px: 2,
      height: '100%',
      width: '100%',
      alignItems: 'center'
    }
  }, hasConnectionUri && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tabs, {
    size: "medium",
    value: tab,
    onChange: (_, chosenTab) => setTab(chosenTab),
    isContained: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tab, {
    label: t('QR Code'),
    value: WalletConnectTabs.QR,
    "data-testid": "wc-tab-qr",
    sx: {
      mr: 0.5
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tab, {
    label: t('URI'),
    value: WalletConnectTabs.URI,
    "data-testid": "wc-tab-uri"
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.TabPanel, {
    value: tab,
    index: WalletConnectTabs.QR,
    sx: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      gap: 1.5,
      width: '200px',
      marginX: 'auto'
    }
  }, /*#__PURE__*/React.createElement(_WalletConnectQRCode__WEBPACK_IMPORTED_MODULE_2__.WalletConnectQRCode, {
    uri: importState.uri,
    status: importState.status
  }), /*#__PURE__*/React.createElement(_WalletConnectStatusMessage__WEBPACK_IMPORTED_MODULE_3__.WalletConnectStatusMessage, {
    importState: importState
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.TabPanel, {
    value: tab,
    index: WalletConnectTabs.URI
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      gap: 1.5,
      width: 220,
      marginX: 'auto'
    }
  }, /*#__PURE__*/React.createElement(_WalletConnectURIField__WEBPACK_IMPORTED_MODULE_4__.WalletConnectURIField, {
    uri: importState.uri,
    status: importState.status
  }), /*#__PURE__*/React.createElement(_WalletConnectStatusMessage__WEBPACK_IMPORTED_MODULE_3__.WalletConnectStatusMessage, {
    importState: importState
  })))), showRegenerateButton && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    sx: {
      mb: 4
    },
    onClick: () => initiateImport(reconnectionAddress, onConnect)
  }, t('Regenerate QR code')), !showRegenerateButton && tab === WalletConnectTabs.QR && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      mb: 4,
      width: '280px'
    }
  }, customMessage ?? t('Scan the QR code with your mobile wallet.'))), !hasConnectionUri && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      pt: 5.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Skeleton, {
    variant: "rectangular",
    width: "200px",
    height: "200px"
  })));
}

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectQRCode.tsx":
/*!******************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectQRCode.tsx ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectQRCode": () => (/* binding */ WalletConnectQRCode)
/* harmony export */ });
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qrcode.react */ "./node_modules/qrcode.react/lib/index.js");
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qrcode_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/getColorForStatus */ "./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const WalletConnectQRCode = ({
  uri,
  status
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Box, {
    sx: {
      display: 'inline-block',
      background: theme.palette.common.white,
      p: 0.5,
      borderRadius: 1,
      width: 200,
      height: 200,
      border: '2px solid transparent',
      transition: theme.transitions.create('border-color'),
      borderColor: (0,_utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__.getColorForStatus)(status)
    }
  }, /*#__PURE__*/React.createElement((qrcode_react__WEBPACK_IMPORTED_MODULE_0___default()), {
    renderAs: "svg",
    fgColor: theme.palette.common.black,
    bgColor: theme.palette.common.white,
    value: uri,
    level: "H",
    size: 188
  }));
};

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectStatusMessage.tsx":
/*!*************************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectStatusMessage.tsx ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectStatusMessage": () => (/* binding */ WalletConnectStatusMessage)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/WalletConnectContextProvider/models */ "./src/contexts/WalletConnectContextProvider/models.ts");
/* harmony import */ var _utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/getColorForStatus */ "./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const WalletConnectStatusMessage = ({
  importState,
  reconnectionAddress
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const hasConnectionFailed = importState.status === _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__.AccountImportStatus.Failed;
  const hasConnectionSucceeded = importState.status === _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__.AccountImportStatus.Successful;
  if (!hasConnectionFailed && !hasConnectionSucceeded) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    direction: "row",
    sx: {
      gap: 1,
      color: (0,_utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__.getColorForStatus)(importState.status),
      textAlign: 'start',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Box, {
    sx: {
      display: 'flex',
      marginTop: '-1px'
    }
  }, hasConnectionFailed ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.AlertCircleIcon, {
    size: 16
  }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CheckCircleIcon, {
    size: 16
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "caption"
  }, hasConnectionFailed ? importState.error : reconnectionAddress ? t('Scan successful. Waiting to be confirmed...') : t('Scan successful. Importing accounts...')));
};

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectURIField.tsx":
/*!********************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectURIField.tsx ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectURIField": () => (/* binding */ WalletConnectURIField)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/getColorForStatus */ "./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const WalletConnectURIField = ({
  uri,
  status
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const onCopyClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    navigator.clipboard.writeText(uri);
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"].success(t('Copied!'), {
      duration: 2000
    });
  }, [uri, t]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 224,
      height: 212,
      background: theme.palette.grey[850],
      wordWrap: 'break-word',
      px: 2,
      pt: 1.5,
      pb: 1,
      borderRadius: 1,
      fontSize: 14,
      userSelect: 'all',
      border: '1px solid transparent',
      transition: theme.transitions.create('border-color'),
      borderColor: (0,_utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__.getColorForStatus)(status)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Scrollbars, null, uri), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 1,
      mt: -1,
      alignItems: 'flex-end',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.IconButton, {
    size: "small",
    sx: {
      opacity: 0.6,
      mr: -0.5
    },
    onClick: onCopyClick
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.CopyIcon, {
    size: 14
  }))));
};

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts":
/*!*********************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getColorForStatus": () => (/* binding */ getColorForStatus)
/* harmony export */ });
/* harmony import */ var _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/WalletConnectContextProvider/models */ "./src/contexts/WalletConnectContextProvider/models.ts");

const getColorForStatus = status => {
  switch (status) {
    case _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__.AccountImportStatus.Failed:
      return 'error.main';
    case _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__.AccountImportStatus.Successful:
      return 'success.main';
  }
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0ltcG9ydFdpdGhXYWxsZXRDb25uZWN0X0ltcG9ydFdpdGhXYWxsZXRDb25uZWN0X3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBb0M7QUFDVTtBQUNDO0FBQ2U7QUFFRDtBQUNvQjtBQUNSO0FBR0g7QUFPdkQsU0FBU1MsdUJBQXVCQSxDQUFDO0VBQzlDQyxTQUFTO0VBQ1RDO0FBQzRCLENBQUMsRUFBRTtFQUMvQixNQUFNQyxLQUFLLEdBQUdSLHVFQUFRLEVBQUU7RUFDeEIsTUFBTTtJQUFFUztFQUFFLENBQUMsR0FBR1gsNkRBQWMsRUFBRTtFQUM5QixNQUFNO0lBQUVZLE1BQU07SUFBRUM7RUFBUSxDQUFDLEdBQUdkLDREQUFVLEVBQUU7RUFDeEMsTUFBTTtJQUFFZTtFQUFRLENBQUMsR0FBR1Isb0ZBQW1CLEVBQUU7RUFFekMsTUFBTVMsMEJBQTZDLEdBQUdqQixrREFBVyxDQUM5RGtCLE1BQU0sSUFBSztJQUNWLElBQUksT0FBT1IsU0FBUyxLQUFLLFVBQVUsRUFBRTtNQUNuQ0EsU0FBUyxDQUFDUSxNQUFNLENBQUM7SUFDbkIsQ0FBQyxNQUFNO01BQ0xGLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQztNQUMxQ0QsT0FBTyxDQUFDLFdBQVcsQ0FBQztJQUN0QjtFQUNGLENBQUMsRUFDRCxDQUFDQSxPQUFPLEVBQUVMLFNBQVMsRUFBRU0sT0FBTyxDQUFDLENBQzlCO0VBRUQsb0JBQ0VHLEtBQUEsQ0FBQUMsYUFBQSxDQUFDakIsOERBQUs7SUFDSmtCLEVBQUUsRUFBRTtNQUNGQyxLQUFLLEVBQUUsTUFBTTtNQUNiQyxNQUFNLEVBQUUsTUFBTTtNQUNkQyxVQUFVLEVBQUVaLEtBQUssQ0FBQ2EsT0FBTyxDQUFDRCxVQUFVLENBQUNFO0lBQ3ZDO0VBQUUsZ0JBRUZQLEtBQUEsQ0FBQUMsYUFBQSxDQUFDZix1RUFBUztJQUFDc0IsTUFBTSxFQUFDLFlBQVk7SUFBQ0MsV0FBVyxFQUFFZDtFQUFPLEdB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LEVBQUVuRixLQUFLLENBQUNvRixXQUFXLENBQUNDLE1BQU0sQ0FBQyxjQUFjLENBQUM7TUFDcEQ3RCxXQUFXLEVBQUVxRCwyRUFBaUIsQ0FBQzFCLE1BQU07SUFDdkM7RUFBRSxnQkFFRjVDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDcUIsbUVBQVUsUUFBRXlDLEdBQUcsQ0FBYyxlQUM5Qi9ELEtBQUEsQ0FBQUMsYUFBQSxDQUFDakIsOERBQUs7SUFBQ2tCLEVBQUUsRUFBRTtNQUFFQyxLQUFLLEVBQUUsQ0FBQztNQUFFUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQUVDLFVBQVUsRUFBRSxVQUFVO01BQUU4RixVQUFVLEVBQUU7SUFBRTtFQUFFLGdCQUNyRTNHLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNkYsbUVBQVU7SUFDVDVFLElBQUksRUFBQyxPQUFPO0lBQ1poQixFQUFFLEVBQUU7TUFBRTBHLE9BQU8sRUFBRSxHQUFHO01BQUV0RCxFQUFFLEVBQUUsQ0FBQztJQUFJLENBQUU7SUFDL0JXLE9BQU8sRUFBRStCO0VBQVksZ0JBRXJCaEcsS0FBQSxDQUFBQyxhQUFBLENBQUM0RixpRUFBUTtJQUFDM0UsSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUNYLENBQ1AsQ0FDRjtBQUVaLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQzNEdUY7QUFFakYsTUFBTW9ELGlCQUFpQixHQUFJMUIsTUFBMkIsSUFBSztFQUNoRSxRQUFRQSxNQUFNO0lBQ1osS0FBS1oseUdBQTBCO01BQzdCLE9BQU8sWUFBWTtJQUVyQixLQUFLQSw2R0FBOEI7TUFDakMsT0FBTyxjQUFjO0VBQUM7QUFFNUIsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSW1wb3J0V2l0aFdhbGxldENvbm5lY3QvSW1wb3J0V2l0aFdhbGxldENvbm5lY3QudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSW1wb3J0V2l0aFdhbGxldENvbm5lY3QvY29tcG9uZW50cy9XYWxsZXRDb25uZWN0Q2lyY2xlZEljb24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSW1wb3J0V2l0aFdhbGxldENvbm5lY3QvY29tcG9uZW50cy9XYWxsZXRDb25uZWN0Q29ubmVjdG9yLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0ltcG9ydFdpdGhXYWxsZXRDb25uZWN0L2NvbXBvbmVudHMvV2FsbGV0Q29ubmVjdFFSQ29kZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9JbXBvcnRXaXRoV2FsbGV0Q29ubmVjdC9jb21wb25lbnRzL1dhbGxldENvbm5lY3RTdGF0dXNNZXNzYWdlLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0ltcG9ydFdpdGhXYWxsZXRDb25uZWN0L2NvbXBvbmVudHMvV2FsbGV0Q29ubmVjdFVSSUZpZWxkLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0ltcG9ydFdpdGhXYWxsZXRDb25uZWN0L2NvbXBvbmVudHMvdXRpbHMvZ2V0Q29sb3JGb3JTdGF0dXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgU3RhY2ssIHVzZVRoZW1lIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgUGFnZVRpdGxlIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9QYWdlVGl0bGUnO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdENpcmNsZWRJY29uIH0gZnJvbSAnLi9jb21wb25lbnRzL1dhbGxldENvbm5lY3RDaXJjbGVkSWNvbic7XG5pbXBvcnQgV2FsbGV0Q29ubmVjdENvbm5lY3RvciBmcm9tICcuL2NvbXBvbmVudHMvV2FsbGV0Q29ubmVjdENvbm5lY3Rvcic7XG5cbmltcG9ydCB7IE9uQ29ubmVjdENhbGxiYWNrIH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRDb25uZWN0Q29udGV4dFByb3ZpZGVyL21vZGVscyc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5cbnR5cGUgSW1wb3J0V2l0aFdhbGxldENvbm5lY3RQcm9wcyA9IHtcbiAgb25Db25uZWN0PzogT25Db25uZWN0Q2FsbGJhY2s7XG4gIGFwcEljb24/OiBSZWFjdC5SZWFjdEVsZW1lbnQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbXBvcnRXaXRoV2FsbGV0Q29ubmVjdCh7XG4gIG9uQ29ubmVjdCxcbiAgYXBwSWNvbixcbn06IEltcG9ydFdpdGhXYWxsZXRDb25uZWN0UHJvcHMpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgZ29CYWNrLCByZXBsYWNlIH0gPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuXG4gIGNvbnN0IGhhbmRsZVN1Y2Nlc3NmdWxDb25uZWN0aW9uOiBPbkNvbm5lY3RDYWxsYmFjayA9IHVzZUNhbGxiYWNrKFxuICAgIChyZXN1bHQpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygb25Db25uZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9uQ29ubmVjdChyZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FwdHVyZSgnSW1wb3J0V2l0aFdhbGxldENvbm5lY3RfU3VjY2VzcycpO1xuICAgICAgICByZXBsYWNlKCcvYWNjb3VudHMnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtyZXBsYWNlLCBvbkNvbm5lY3QsIGNhcHR1cmVdLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8UGFnZVRpdGxlIG1hcmdpbj1cIjIwcHggMCA0cHhcIiBvbkJhY2tDbGljaz17Z29CYWNrfT5cbiAgICAgICAge3QoJ0Nvbm5lY3QgeW91ciBXYWxsZXQnKX1cbiAgICAgIDwvUGFnZVRpdGxlPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZ2FwOiAyLjUsXG4gICAgICAgICAgcHg6IDUsXG4gICAgICAgICAgbXQ6IDMsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHthcHBJY29uID8/IDxXYWxsZXRDb25uZWN0Q2lyY2xlZEljb24gLz59XG4gICAgICAgIDxXYWxsZXRDb25uZWN0Q29ubmVjdG9yIG9uQ29ubmVjdD17aGFuZGxlU3VjY2Vzc2Z1bENvbm5lY3Rpb259IC8+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBXYWxsZXRDb25uZWN0SWNvbiwgQXZhdGFyIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IFdhbGxldENvbm5lY3RDaXJjbGVkSWNvbiA9ICgpID0+IChcbiAgPEF2YXRhclxuICAgIHN4PXt7XG4gICAgICB3aWR0aDogJzY0cHgnLFxuICAgICAgaGVpZ2h0OiAnNjRweCcsXG4gICAgICBib3JkZXI6ICcxcHggc29saWQnLFxuICAgICAgYm9yZGVyQ29sb3I6ICdpbmZvLmRhcmsnLFxuICAgIH19XG4gID5cbiAgICA8V2FsbGV0Q29ubmVjdEljb24gc2l6ZT17NDJ9IC8+XG4gIDwvQXZhdGFyPlxuKTtcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIFNjcm9sbGJhcnMsXG4gIFNrZWxldG9uLFxuICBTdGFjayxcbiAgVGFiLFxuICBUYWJQYW5lbCxcbiAgVGFicyxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb25uZWN0Q29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvV2FsbGV0Q29ubmVjdENvbnRleHRQcm92aWRlci9XYWxsZXRDb25uZWN0Q29udGV4dFByb3ZpZGVyJztcbmltcG9ydCB7IFdhbGxldENvbm5lY3RRUkNvZGUgfSBmcm9tICcuL1dhbGxldENvbm5lY3RRUkNvZGUnO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdFN0YXR1c01lc3NhZ2UgfSBmcm9tICcuL1dhbGxldENvbm5lY3RTdGF0dXNNZXNzYWdlJztcbmltcG9ydCB7IFdhbGxldENvbm5lY3RVUklGaWVsZCB9IGZyb20gJy4vV2FsbGV0Q29ubmVjdFVSSUZpZWxkJztcbmltcG9ydCB7XG4gIEFjY291bnRJbXBvcnRTdGF0dXMsXG4gIE9uQ29ubmVjdENhbGxiYWNrLFxufSBmcm9tICdAc3JjL2NvbnRleHRzL1dhbGxldENvbm5lY3RDb250ZXh0UHJvdmlkZXIvbW9kZWxzJztcblxuZW51bSBXYWxsZXRDb25uZWN0VGFicyB7XG4gIFFSLFxuICBVUkksXG59XG5cbmludGVyZmFjZSBXYWxsZXRDb25uZWN0Q29ubmVjdG9yUHJvcHMge1xuICByZWNvbm5lY3Rpb25BZGRyZXNzPzogc3RyaW5nO1xuICBjdXN0b21NZXNzYWdlPzogc3RyaW5nO1xuICBvbkNvbm5lY3Q6IE9uQ29ubmVjdENhbGxiYWNrO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXYWxsZXRDb25uZWN0Q29ubmVjdG9yKHtcbiAgcmVjb25uZWN0aW9uQWRkcmVzcyxcbiAgY3VzdG9tTWVzc2FnZSxcbiAgb25Db25uZWN0LFxufTogV2FsbGV0Q29ubmVjdENvbm5lY3RvclByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgW3RhYiwgc2V0VGFiXSA9IHVzZVN0YXRlKFdhbGxldENvbm5lY3RUYWJzLlFSKTtcbiAgY29uc3QgeyBpbXBvcnRTdGF0ZSwgcmVzZXQsIGluaXRpYXRlSW1wb3J0IH0gPSB1c2VXYWxsZXRDb25uZWN0Q29udGV4dCgpO1xuICBjb25zdCBoYXNDb25uZWN0aW9uVXJpID0gJ3VyaScgaW4gaW1wb3J0U3RhdGU7XG4gIGNvbnN0IHNob3dSZWdlbmVyYXRlQnV0dG9uID1cbiAgICBpbXBvcnRTdGF0ZS5zdGF0dXMgPT09IEFjY291bnRJbXBvcnRTdGF0dXMuRmFpbGVkO1xuXG4gIC8vIFJlc2V0IGltcG9ydCBzdGF0ZSBvbiBtb3VudFxuICB1c2VFZmZlY3QocmVzZXQsIFtyZXNldF0pO1xuXG4gIC8vIEluaXRpYXRlIGFjY291bnQgaW1wb3J0IGFzIHNvb24gYXMgdGhpcyBwYWdlIGlzIGRpc3BsYXllZCxcbiAgLy8gYXMgbG9uZyBhcyBpdCB3YXNuJ3QgYWxyZWFkeSBpbml0aWF0ZWQuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGltcG9ydFN0YXRlLnN0YXR1cyA9PT0gQWNjb3VudEltcG9ydFN0YXR1cy5Ob3RJbml0aWF0ZWQpIHtcbiAgICAgIGluaXRpYXRlSW1wb3J0KHJlY29ubmVjdGlvbkFkZHJlc3MsIG9uQ29ubmVjdCk7XG4gICAgfVxuICB9LCBbaW5pdGlhdGVJbXBvcnQsIHJlY29ubmVjdGlvbkFkZHJlc3MsIGltcG9ydFN0YXRlLnN0YXR1cywgb25Db25uZWN0XSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIGdhcDogMi41LFxuICAgICAgICBweDogMixcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7aGFzQ29ubmVjdGlvblVyaSAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgPFRhYnNcbiAgICAgICAgICAgIHNpemU9XCJtZWRpdW1cIlxuICAgICAgICAgICAgdmFsdWU9e3RhYn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoXywgY2hvc2VuVGFiKSA9PiBzZXRUYWIoY2hvc2VuVGFiKX1cbiAgICAgICAgICAgIGlzQ29udGFpbmVkXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFRhYlxuICAgICAgICAgICAgICBsYWJlbD17dCgnUVIgQ29kZScpfVxuICAgICAgICAgICAgICB2YWx1ZT17V2FsbGV0Q29ubmVjdFRhYnMuUVJ9XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwid2MtdGFiLXFyXCJcbiAgICAgICAgICAgICAgc3g9e3sgbXI6IDAuNSB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxUYWJcbiAgICAgICAgICAgICAgbGFiZWw9e3QoJ1VSSScpfVxuICAgICAgICAgICAgICB2YWx1ZT17V2FsbGV0Q29ubmVjdFRhYnMuVVJJfVxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cIndjLXRhYi11cmlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1RhYnM+XG4gICAgICAgICAgPFNjcm9sbGJhcnNcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgICBtYXhIZWlnaHQ6ICd1bnNldCcsXG4gICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUYWJQYW5lbFxuICAgICAgICAgICAgICB2YWx1ZT17dGFifVxuICAgICAgICAgICAgICBpbmRleD17V2FsbGV0Q29ubmVjdFRhYnMuUVJ9XG4gICAgICAgICAgICAgIHN4PXt7IHRleHRBbGlnbjogJ2NlbnRlcicgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIGdhcDogMS41LFxuICAgICAgICAgICAgICAgICAgd2lkdGg6ICcyMDBweCcsXG4gICAgICAgICAgICAgICAgICBtYXJnaW5YOiAnYXV0bycsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxXYWxsZXRDb25uZWN0UVJDb2RlXG4gICAgICAgICAgICAgICAgICB1cmk9e2ltcG9ydFN0YXRlLnVyaX1cbiAgICAgICAgICAgICAgICAgIHN0YXR1cz17aW1wb3J0U3RhdGUuc3RhdHVzfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPFdhbGxldENvbm5lY3RTdGF0dXNNZXNzYWdlIGltcG9ydFN0YXRlPXtpbXBvcnRTdGF0ZX0gLz5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgICA8VGFiUGFuZWwgdmFsdWU9e3RhYn0gaW5kZXg9e1dhbGxldENvbm5lY3RUYWJzLlVSSX0+XG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDEuNSwgd2lkdGg6IDIyMCwgbWFyZ2luWDogJ2F1dG8nIH19PlxuICAgICAgICAgICAgICAgIDxXYWxsZXRDb25uZWN0VVJJRmllbGRcbiAgICAgICAgICAgICAgICAgIHVyaT17aW1wb3J0U3RhdGUudXJpfVxuICAgICAgICAgICAgICAgICAgc3RhdHVzPXtpbXBvcnRTdGF0ZS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8V2FsbGV0Q29ubmVjdFN0YXR1c01lc3NhZ2UgaW1wb3J0U3RhdGU9e2ltcG9ydFN0YXRlfSAvPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICA8L1Njcm9sbGJhcnM+XG4gICAgICAgICAge3Nob3dSZWdlbmVyYXRlQnV0dG9uICYmIChcbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgc3g9e3sgbWI6IDQgfX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaW5pdGlhdGVJbXBvcnQocmVjb25uZWN0aW9uQWRkcmVzcywgb25Db25uZWN0KX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1JlZ2VuZXJhdGUgUVIgY29kZScpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7IXNob3dSZWdlbmVyYXRlQnV0dG9uICYmIHRhYiA9PT0gV2FsbGV0Q29ubmVjdFRhYnMuUVIgJiYgKFxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgbWI6IDQsIHdpZHRoOiAnMjgwcHgnIH19PlxuICAgICAgICAgICAgICB7Y3VzdG9tTWVzc2FnZSA/PyB0KCdTY2FuIHRoZSBRUiBjb2RlIHdpdGggeW91ciBtb2JpbGUgd2FsbGV0LicpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvPlxuICAgICAgKX1cblxuICAgICAgeyFoYXNDb25uZWN0aW9uVXJpICYmIChcbiAgICAgICAgPFN0YWNrIHN4PXt7IHB0OiA1LjUgfX0+XG4gICAgICAgICAgPFNrZWxldG9uIHZhcmlhbnQ9XCJyZWN0YW5ndWxhclwiIHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiIC8+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgUVJDb2RlIGZyb20gJ3FyY29kZS5yZWFjdCc7XG5pbXBvcnQgeyBCb3gsIHVzZVRoZW1lIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgQWNjb3VudEltcG9ydFN0YXR1cyB9IGZyb20gJ0BzcmMvY29udGV4dHMvV2FsbGV0Q29ubmVjdENvbnRleHRQcm92aWRlci9tb2RlbHMnO1xuXG5pbXBvcnQgeyBnZXRDb2xvckZvclN0YXR1cyB9IGZyb20gJy4vdXRpbHMvZ2V0Q29sb3JGb3JTdGF0dXMnO1xuXG50eXBlIFByb3BzID0ge1xuICB1cmk6IHN0cmluZztcbiAgc3RhdHVzOiBBY2NvdW50SW1wb3J0U3RhdHVzO1xufTtcblxuZXhwb3J0IGNvbnN0IFdhbGxldENvbm5lY3RRUkNvZGUgPSAoeyB1cmksIHN0YXR1cyB9OiBQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94XG4gICAgICBzeD17e1xuICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5jb21tb24ud2hpdGUsXG4gICAgICAgIHA6IDAuNSxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAxLFxuICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgYm9yZGVyOiAnMnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgdHJhbnNpdGlvbjogdGhlbWUudHJhbnNpdGlvbnMuY3JlYXRlKCdib3JkZXItY29sb3InKSxcbiAgICAgICAgYm9yZGVyQ29sb3I6IGdldENvbG9yRm9yU3RhdHVzKHN0YXR1cyksXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxRUkNvZGVcbiAgICAgICAgcmVuZGVyQXM9XCJzdmdcIlxuICAgICAgICBmZ0NvbG9yPXt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja31cbiAgICAgICAgYmdDb2xvcj17dGhlbWUucGFsZXR0ZS5jb21tb24ud2hpdGV9XG4gICAgICAgIHZhbHVlPXt1cml9XG4gICAgICAgIGxldmVsPVwiSFwiXG4gICAgICAgIHNpemU9ezE4OH1cbiAgICAgIC8+XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgQWxlcnRDaXJjbGVJY29uLFxuICBCb3gsXG4gIENoZWNrQ2lyY2xlSWNvbixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQge1xuICBBY2NvdW50SW1wb3J0U3RhdGUsXG4gIEFjY291bnRJbXBvcnRTdGF0dXMsXG59IGZyb20gJ0BzcmMvY29udGV4dHMvV2FsbGV0Q29ubmVjdENvbnRleHRQcm92aWRlci9tb2RlbHMnO1xuXG5pbXBvcnQgeyBnZXRDb2xvckZvclN0YXR1cyB9IGZyb20gJy4vdXRpbHMvZ2V0Q29sb3JGb3JTdGF0dXMnO1xuXG50eXBlIFByb3BzID0ge1xuICBpbXBvcnRTdGF0ZTogQWNjb3VudEltcG9ydFN0YXRlO1xuICByZWNvbm5lY3Rpb25BZGRyZXNzPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IGNvbnN0IFdhbGxldENvbm5lY3RTdGF0dXNNZXNzYWdlID0gKHtcbiAgaW1wb3J0U3RhdGUsXG4gIHJlY29ubmVjdGlvbkFkZHJlc3MsXG59OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgY29uc3QgaGFzQ29ubmVjdGlvbkZhaWxlZCA9IGltcG9ydFN0YXRlLnN0YXR1cyA9PT0gQWNjb3VudEltcG9ydFN0YXR1cy5GYWlsZWQ7XG4gIGNvbnN0IGhhc0Nvbm5lY3Rpb25TdWNjZWVkZWQgPVxuICAgIGltcG9ydFN0YXRlLnN0YXR1cyA9PT0gQWNjb3VudEltcG9ydFN0YXR1cy5TdWNjZXNzZnVsO1xuXG4gIGlmICghaGFzQ29ubmVjdGlvbkZhaWxlZCAmJiAhaGFzQ29ubmVjdGlvblN1Y2NlZWRlZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICBzeD17e1xuICAgICAgICBnYXA6IDEsXG4gICAgICAgIGNvbG9yOiBnZXRDb2xvckZvclN0YXR1cyhpbXBvcnRTdGF0ZS5zdGF0dXMpLFxuICAgICAgICB0ZXh0QWxpZ246ICdzdGFydCcsXG4gICAgICAgIGFsaWduSXRlbXM6ICdzdGFydCcsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxCb3ggc3g9e3sgZGlzcGxheTogJ2ZsZXgnLCBtYXJnaW5Ub3A6ICctMXB4JyB9fT5cbiAgICAgICAge2hhc0Nvbm5lY3Rpb25GYWlsZWQgPyAoXG4gICAgICAgICAgPEFsZXJ0Q2lyY2xlSWNvbiBzaXplPXsxNn0gLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8Q2hlY2tDaXJjbGVJY29uIHNpemU9ezE2fSAvPlxuICAgICAgICApfVxuICAgICAgPC9Cb3g+XG4gICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICB7aGFzQ29ubmVjdGlvbkZhaWxlZFxuICAgICAgICAgID8gaW1wb3J0U3RhdGUuZXJyb3JcbiAgICAgICAgICA6IHJlY29ubmVjdGlvbkFkZHJlc3NcbiAgICAgICAgICAgID8gdCgnU2NhbiBzdWNjZXNzZnVsLiBXYWl0aW5nIHRvIGJlIGNvbmZpcm1lZC4uLicpXG4gICAgICAgICAgICA6IHQoJ1NjYW4gc3VjY2Vzc2Z1bC4gSW1wb3J0aW5nIGFjY291bnRzLi4uJyl9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBDb3B5SWNvbixcbiAgSWNvbkJ1dHRvbixcbiAgU2Nyb2xsYmFycyxcbiAgU3RhY2ssXG4gIHRvYXN0LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuaW1wb3J0IHsgQWNjb3VudEltcG9ydFN0YXR1cyB9IGZyb20gJ0BzcmMvY29udGV4dHMvV2FsbGV0Q29ubmVjdENvbnRleHRQcm92aWRlci9tb2RlbHMnO1xuXG5pbXBvcnQgeyBnZXRDb2xvckZvclN0YXR1cyB9IGZyb20gJy4vdXRpbHMvZ2V0Q29sb3JGb3JTdGF0dXMnO1xuXG50eXBlIFByb3BzID0ge1xuICB1cmk6IHN0cmluZztcbiAgc3RhdHVzOiBBY2NvdW50SW1wb3J0U3RhdHVzO1xufTtcblxuZXhwb3J0IGNvbnN0IFdhbGxldENvbm5lY3RVUklGaWVsZCA9ICh7IHVyaSwgc3RhdHVzIH06IFByb3BzKSA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IG9uQ29weUNsaWNrID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHVyaSk7XG4gICAgdG9hc3Quc3VjY2Vzcyh0KCdDb3BpZWQhJyksIHsgZHVyYXRpb246IDIwMDAgfSk7XG4gIH0sIFt1cmksIHRdKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6IDIyNCxcbiAgICAgICAgaGVpZ2h0OiAyMTIsXG4gICAgICAgIGJhY2tncm91bmQ6IHRoZW1lLnBhbGV0dGUuZ3JleVs4NTBdLFxuICAgICAgICB3b3JkV3JhcDogJ2JyZWFrLXdvcmQnLFxuICAgICAgICBweDogMixcbiAgICAgICAgcHQ6IDEuNSxcbiAgICAgICAgcGI6IDEsXG4gICAgICAgIGJvcmRlclJhZGl1czogMSxcbiAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICB1c2VyU2VsZWN0OiAnYWxsJyxcbiAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgdHJhbnNpdGlvbjogdGhlbWUudHJhbnNpdGlvbnMuY3JlYXRlKCdib3JkZXItY29sb3InKSxcbiAgICAgICAgYm9yZGVyQ29sb3I6IGdldENvbG9yRm9yU3RhdHVzKHN0YXR1cyksXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTY3JvbGxiYXJzPnt1cml9PC9TY3JvbGxiYXJzPlxuICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxLCBtdDogLTEsIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsIGZsZXhTaHJpbms6IDAgfX0+XG4gICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICBzeD17eyBvcGFjaXR5OiAwLjYsIG1yOiAtMC41IH19XG4gICAgICAgICAgb25DbGljaz17b25Db3B5Q2xpY2t9XG4gICAgICAgID5cbiAgICAgICAgICA8Q29weUljb24gc2l6ZT17MTR9IC8+XG4gICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBBY2NvdW50SW1wb3J0U3RhdHVzIH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRDb25uZWN0Q29udGV4dFByb3ZpZGVyL21vZGVscyc7XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xvckZvclN0YXR1cyA9IChzdGF0dXM6IEFjY291bnRJbXBvcnRTdGF0dXMpID0+IHtcbiAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICBjYXNlIEFjY291bnRJbXBvcnRTdGF0dXMuRmFpbGVkOlxuICAgICAgcmV0dXJuICdlcnJvci5tYWluJztcblxuICAgIGNhc2UgQWNjb3VudEltcG9ydFN0YXR1cy5TdWNjZXNzZnVsOlxuICAgICAgcmV0dXJuICdzdWNjZXNzLm1haW4nO1xuICB9XG59O1xuIl0sIm5hbWVzIjpbInVzZUNhbGxiYWNrIiwidXNlSGlzdG9yeSIsInVzZVRyYW5zbGF0aW9uIiwiU3RhY2siLCJ1c2VUaGVtZSIsIlBhZ2VUaXRsZSIsIldhbGxldENvbm5lY3RDaXJjbGVkSWNvbiIsIldhbGxldENvbm5lY3RDb25uZWN0b3IiLCJ1c2VBbmFseXRpY3NDb250ZXh0IiwiSW1wb3J0V2l0aFdhbGxldENvbm5lY3QiLCJvbkNvbm5lY3QiLCJhcHBJY29uIiwidGhlbWUiLCJ0IiwiZ29CYWNrIiwicmVwbGFjZSIsImNhcHR1cmUiLCJoYW5kbGVTdWNjZXNzZnVsQ29ubmVjdGlvbiIsInJlc3VsdCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kIiwicGFsZXR0ZSIsInBhcGVyIiwibWFyZ2luIiwib25CYWNrQ2xpY2siLCJnYXAiLCJweCIsIm10IiwiYWxpZ25JdGVtcyIsIldhbGxldENvbm5lY3RJY29uIiwiQXZhdGFyIiwiYm9yZGVyIiwiYm9yZGVyQ29sb3IiLCJzaXplIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJCdXR0b24iLCJTY3JvbGxiYXJzIiwiU2tlbGV0b24iLCJUYWIiLCJUYWJQYW5lbCIsIlRhYnMiLCJUeXBvZ3JhcGh5IiwidXNlV2FsbGV0Q29ubmVjdENvbnRleHQiLCJXYWxsZXRDb25uZWN0UVJDb2RlIiwiV2FsbGV0Q29ubmVjdFN0YXR1c01lc3NhZ2UiLCJXYWxsZXRDb25uZWN0VVJJRmllbGQiLCJBY2NvdW50SW1wb3J0U3RhdHVzIiwiV2FsbGV0Q29ubmVjdFRhYnMiLCJyZWNvbm5lY3Rpb25BZGRyZXNzIiwiY3VzdG9tTWVzc2FnZSIsInRhYiIsInNldFRhYiIsIlFSIiwiaW1wb3J0U3RhdGUiLCJyZXNldCIsImluaXRpYXRlSW1wb3J0IiwiaGFzQ29ubmVjdGlvblVyaSIsInNob3dSZWdlbmVyYXRlQnV0dG9uIiwic3RhdHVzIiwiRmFpbGVkIiwiTm90SW5pdGlhdGVkIiwiRnJhZ21lbnQiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwiXyIsImNob3NlblRhYiIsImlzQ29udGFpbmVkIiwibGFiZWwiLCJtciIsIlVSSSIsInN0eWxlIiwiZmxleEdyb3ciLCJtYXhIZWlnaHQiLCJqdXN0aWZ5Q29udGVudCIsImluZGV4IiwidGV4dEFsaWduIiwibWFyZ2luWCIsInVyaSIsIm1iIiwib25DbGljayIsInZhcmlhbnQiLCJwdCIsIlFSQ29kZSIsIkJveCIsImdldENvbG9yRm9yU3RhdHVzIiwiZGlzcGxheSIsImNvbW1vbiIsIndoaXRlIiwicCIsImJvcmRlclJhZGl1cyIsInRyYW5zaXRpb24iLCJ0cmFuc2l0aW9ucyIsImNyZWF0ZSIsInJlbmRlckFzIiwiZmdDb2xvciIsImJsYWNrIiwiYmdDb2xvciIsImxldmVsIiwiQWxlcnRDaXJjbGVJY29uIiwiQ2hlY2tDaXJjbGVJY29uIiwiaGFzQ29ubmVjdGlvbkZhaWxlZCIsImhhc0Nvbm5lY3Rpb25TdWNjZWVkZWQiLCJTdWNjZXNzZnVsIiwiZGlyZWN0aW9uIiwiY29sb3IiLCJtYXJnaW5Ub3AiLCJlcnJvciIsIkNvcHlJY29uIiwiSWNvbkJ1dHRvbiIsInRvYXN0Iiwib25Db3B5Q2xpY2siLCJuYXZpZ2F0b3IiLCJjbGlwYm9hcmQiLCJ3cml0ZVRleHQiLCJzdWNjZXNzIiwiZHVyYXRpb24iLCJncmV5Iiwid29yZFdyYXAiLCJwYiIsImZvbnRTaXplIiwidXNlclNlbGVjdCIsImZsZXhTaHJpbmsiLCJvcGFjaXR5Il0sInNvdXJjZVJvb3QiOiIifQ==