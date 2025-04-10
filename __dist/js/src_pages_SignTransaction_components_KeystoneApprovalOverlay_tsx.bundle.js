(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_SignTransaction_components_KeystoneApprovalOverlay_tsx"],{

/***/ "./src/components/common/CameraAccessDeniedDialog.tsx":
/*!************************************************************!*\
  !*** ./src/components/common/CameraAccessDeniedDialog.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CameraAccessDeniedDialog": () => (/* binding */ CameraAccessDeniedDialog)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _icons_CameraAccessDeniedIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../icons/CameraAccessDeniedIcon */ "./src/components/icons/CameraAccessDeniedIcon.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const CameraAccessDeniedDialog = ({
  refreshPermissions
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Dialog, {
    open: true,
    showCloseIcon: false,
    fullWidth: true,
    maxWidth: false,
    sx: {
      textAlign: 'center'
    },
    PaperProps: {
      sx: {
        m: 2,
        width: '100%',
        maxWidth: 'none'
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'center',
      gap: 3,
      py: 3,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h4"
  }, t('Access Blocked')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body1"
  }, t(`You've blocked access to your camera. Please allow access to continue.`)), /*#__PURE__*/React.createElement(_icons_CameraAccessDeniedIcon__WEBPACK_IMPORTED_MODULE_0__["default"], null), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t('If you block access, look in the top right corner of your browser to enable camera access'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 2,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    color: "primary",
    size: "medium",
    fullWidth: true,
    onClick: refreshPermissions
  }, t('Done')))));
};

/***/ }),

/***/ "./src/components/common/CameraAccessPromptDialog.tsx":
/*!************************************************************!*\
  !*** ./src/components/common/CameraAccessPromptDialog.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CameraAccessPromptDialog": () => (/* binding */ CameraAccessPromptDialog)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const CameraAccessPromptDialog = ({
  QRScanner
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_0__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Dialog, {
    open: true,
    showCloseIcon: false,
    fullWidth: true,
    maxWidth: false,
    sx: {
      textAlign: 'center'
    },
    PaperProps: {
      sx: {
        m: 2,
        width: '100%',
        maxWidth: 'none'
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'center',
      gap: 3,
      py: 3,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h4"
  }, t('Camera Access')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body1"
  }, t(`Allow Chrome access to your camera to scan the QR Code`)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, {
    size: 64,
    sx: {
      my: 6
    }
  }), /*#__PURE__*/React.createElement(QRScanner, null), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t('If you block access, look in the top right corner of your browser to enable camera access'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      gap: 2,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    fullWidth: true,
    size: "medium"
  }, t('Close')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "text",
    onClick: () => {
      window.open('https://keyst.one', '_blank', 'noreferrer');
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ExternalLinkIcon, {
    size: 16,
    sx: {
      color: 'secondary.main',
      marginRight: 1
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      color: 'secondary.main',
      fontWeight: 600
    }
  }, t('Keystone Support'))))));
};

/***/ }),

/***/ "./src/components/common/InvalidQRCodeDialog.tsx":
/*!*******************************************************!*\
  !*** ./src/components/common/InvalidQRCodeDialog.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InvalidQRCodeDialog": () => (/* binding */ InvalidQRCodeDialog)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _icons_InvalidQRCodeIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../icons/InvalidQRCodeIcon */ "./src/components/icons/InvalidQRCodeIcon.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const InvalidQRCodeDialog = ({
  onRetry
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Dialog, {
    open: true,
    showCloseIcon: false,
    fullWidth: true,
    maxWidth: false,
    sx: {
      textAlign: 'center'
    },
    PaperProps: {
      sx: {
        m: 2,
        width: '100%',
        maxWidth: 'none'
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'center',
      gap: 3,
      py: 3,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h4"
  }, t('Invalid QR Code')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body1"
  }, t(`Please ensure you have selected a valid QR code from your Keystone device`)), /*#__PURE__*/React.createElement(_icons_InvalidQRCodeIcon__WEBPACK_IMPORTED_MODULE_0__["default"], null)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 2,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    color: "primary",
    size: "medium",
    fullWidth: true,
    onClick: onRetry
  }, t('Retry')))));
};

/***/ }),

/***/ "./src/components/icons/CameraAccessDeniedIcon.tsx":
/*!*********************************************************!*\
  !*** ./src/components/icons/CameraAccessDeniedIcon.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CameraAccessDeniedIcon)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function CameraAccessDeniedIcon(props) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.CameraBlockedIcon, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    size: 38,
    sx: {
      outline: `2px solid ${theme.palette.error.main}`,
      outlineOffset: 3,
      backgroundColor: 'error.main',
      m: 1,
      p: 2,
      borderRadius: 999,
      border: 1,
      borderColor: 'error.main'
    }
  }, props));
}

/***/ }),

/***/ "./src/components/icons/InvalidQRCodeIcon.tsx":
/*!****************************************************!*\
  !*** ./src/components/icons/InvalidQRCodeIcon.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InvalidQRCodeIcon)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function InvalidQRCodeIcon(props) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.QRCodeIcon, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    size: 38,
    sx: {
      outline: `2px solid ${theme.palette.error.main}`,
      outlineOffset: 3,
      backgroundColor: 'error.main',
      m: 1,
      p: 2,
      borderRadius: 999,
      border: 1,
      borderColor: 'error.main'
    }
  }, props));
}

/***/ }),

/***/ "./src/hooks/useCameraPermissions.ts":
/*!*******************************************!*\
  !*** ./src/hooks/useCameraPermissions.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useCameraPermissions)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function useCameraPermissions() {
  const [observer, setObserver] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [permissions, setPermissions] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const getPermissions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    const permissionsObserver = await navigator.permissions.query({
      name: 'camera'
    });
    permissionsObserver.onchange = () => setPermissions(permissionsObserver.state);
    setPermissions(permissionsObserver.state);
    setObserver(permissionsObserver);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    getPermissions();
  }, [getPermissions]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const savedObserver = observer;
    return () => {
      if (savedObserver) {
        savedObserver.onchange = null;
      }
    };
  }, [observer]);
  return {
    permissions,
    refreshPermissions: getPermissions
  };
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/KeystoneApprovalOverlay.tsx":
/*!**************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/KeystoneApprovalOverlay.tsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeystoneApprovalOverlay": () => (/* binding */ KeystoneApprovalOverlay)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _keystonehq_animated_qr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @keystonehq/animated-qr */ "./node_modules/@keystonehq/animated-qr/dist/index.js");
/* harmony import */ var _keystonehq_bc_ur_registry_eth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @keystonehq/bc-ur-registry-eth */ "./node_modules/@keystonehq/bc-ur-registry-eth/dist/index.js");
/* harmony import */ var _keystonehq_bc_ur_registry_eth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_keystonehq_bc_ur_registry_eth__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_hooks_useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/hooks/useIsUsingKeystoneWallet */ "./src/hooks/useIsUsingKeystoneWallet.ts");
/* harmony import */ var _src_hooks_useCameraPermissions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useCameraPermissions */ "./src/hooks/useCameraPermissions.ts");
/* harmony import */ var _src_contexts_KeystoneProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/KeystoneProvider */ "./src/contexts/KeystoneProvider.tsx");
/* harmony import */ var _src_components_common_CameraAccessDeniedDialog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/components/common/CameraAccessDeniedDialog */ "./src/components/common/CameraAccessDeniedDialog.tsx");
/* harmony import */ var _src_components_common_CameraAccessPromptDialog__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/components/common/CameraAccessPromptDialog */ "./src/components/common/CameraAccessPromptDialog.tsx");
/* harmony import */ var _src_components_common_InvalidQRCodeDialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/components/common/InvalidQRCodeDialog */ "./src/components/common/InvalidQRCodeDialog.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");













var KeystoneApprovalStep = /*#__PURE__*/function (KeystoneApprovalStep) {
  KeystoneApprovalStep[KeystoneApprovalStep["SCAN_WITH_KEYSTONE"] = 0] = "SCAN_WITH_KEYSTONE";
  KeystoneApprovalStep[KeystoneApprovalStep["SCAN_FROM_KEYSTONE"] = -1] = "SCAN_FROM_KEYSTONE";
  return KeystoneApprovalStep;
}(KeystoneApprovalStep || {});
function KeystoneApprovalOverlay({
  onReject
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_11__.useTranslation)();
  const isUsingKeystoneWallet = (0,_src_hooks_useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const [step, setStep] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(KeystoneApprovalStep.SCAN_WITH_KEYSTONE);
  const [isSubmitting, setIsSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [hasSubmitted, setHasSubmitted] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    txRequest,
    submitSignature
  } = (0,_src_contexts_KeystoneProvider__WEBPACK_IMPORTED_MODULE_7__.useKeystoneContext)();
  const [hasQRError, setHasQRError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showAlert, setShowAlert] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (txRequest) {
      setStep(KeystoneApprovalStep.SCAN_WITH_KEYSTONE);
      setIsSubmitting(false);
    }
  }, [txRequest]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isSubmitting && hasSubmitted) {
      setShowAlert(true);
    }
  }, [hasSubmitted, isSubmitting]);
  const onBackClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (step === KeystoneApprovalStep.SCAN_WITH_KEYSTONE) {
      onReject?.();
    } else {
      setStep(KeystoneApprovalStep.SCAN_WITH_KEYSTONE);
    }
  }, [step, onReject]);
  const submitTx = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (cbor, type) => {
    if (!txRequest) {
      return;
    }
    await submitSignature({
      requestId: txRequest.requestId,
      cbor,
      type
    });
  }, [submitSignature, txRequest]);
  const handleScan = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async ({
    cbor,
    type
  }) => {
    // Prevent scanning too early, or more than once
    if (step !== KeystoneApprovalStep.SCAN_FROM_KEYSTONE || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setHasSubmitted(true);
    try {
      await submitTx(cbor, type);
    } catch (_err) {
      setHasQRError(true);
      setIsSubmitting(false);
    }
  }, [submitTx, isSubmitting, step]);
  const handleError = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(error => {
    if (!error || error.includes('Dimensions')) {
      // The component continously scans and raises an undefined error
      // when it's not able to find the QR code.
      return;
    }
    setHasQRError(true);
  }, []);
  const {
    permissions,
    refreshPermissions
  } = (0,_src_hooks_useCameraPermissions__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const scannerProps = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    urTypes: [_keystonehq_animated_qr__WEBPACK_IMPORTED_MODULE_1__.URType.EVM_SIGNATURE, _keystonehq_animated_qr__WEBPACK_IMPORTED_MODULE_1__.URType.ETH_SIGNATURE, _keystonehq_bc_ur_registry_eth__WEBPACK_IMPORTED_MODULE_2__.RegistryTypes.CRYPTO_PSBT.getType()],
    handleError,
    handleScan,
    options: {
      width: !isSubmitting && permissions === 'granted' ? 220 : 1,
      height: !isSubmitting && permissions === 'granted' ? 220 : 1
    }
  }), [handleError, handleScan, isSubmitting, permissions]);
  const QRScanner = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const Scanner = () => /*#__PURE__*/React.createElement(_keystonehq_animated_qr__WEBPACK_IMPORTED_MODULE_1__.AnimatedQRScanner, scannerProps);
    return Scanner;
  }, [scannerProps]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setShowAccessDeniedDialog(permissions === 'denied');
  }, [permissions]);
  if (!isUsingKeystoneWallet || !txRequest) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_3__.Overlay, {
    isBackgroundFilled: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      pt: 2,
      pb: 3,
      gap: showAlert ? 1.5 : 2
    }
  }, showAlert && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Alert, {
    severity: "info",
    onClose: () => setShowAlert(false),
    sx: {
      mx: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.AlertTitle, null, t('This is a new approval')), t('This transaction requires multiple approvals.')), /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_4__.PageTitle, {
    onBackClick: onBackClick,
    margin: "0"
  }, t('Scan QR Code')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Box, {
    sx: {
      width: '100%',
      overflowX: 'hidden',
      overflowY: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      width: '200%',
      flexDirection: 'row',
      transition: 'transform 0.1s ease-in-out',
      transform: `translateX(calc(50% * ${step}))`
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      gap: showAlert ? 2.5 : 5,
      alignItems: 'center',
      flex: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_13__.Trans, {
    i18nKey: "Scan the QR code with your <deviceName>Keystone device</deviceName>",
    components: {
      deviceName: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Typography, {
        variant: "h6",
        component: "span"
      })
    }
  })), txRequest ? /*#__PURE__*/React.createElement(_keystonehq_animated_qr__WEBPACK_IMPORTED_MODULE_1__.AnimatedQRCode, {
    cbor: txRequest.cbor,
    type: txRequest.type,
    options: {
      size: 220
    }
  }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.CircularProgress, {
    size: 100
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Typography, {
    variant: "body2",
    color: "text.secondary",
    textAlign: "center"
  }, t(`Click on the 'Get Signature' button after signing the transaction with your Keystone device.`))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      gap: 5,
      alignItems: 'center',
      flex: 1,
      px: showAlert ? 1.5 : 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_13__.Trans, {
    i18nKey: "Scan the QR code displayed on your <deviceName>Keystone device</deviceName>",
    components: {
      deviceName: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Typography, {
        variant: "h6",
        component: "span"
      })
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      minHeight: 220,
      justifyContent: 'center'
    }
  }, isSubmitting && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.CircularProgress, {
    size: 100
  }), /*#__PURE__*/React.createElement(QRScanner, null)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t('Position the QR code in front of your camera.'))), step === KeystoneApprovalStep.SCAN_FROM_KEYSTONE && /*#__PURE__*/React.createElement(React.Fragment, null, hasQRError && /*#__PURE__*/React.createElement(_src_components_common_InvalidQRCodeDialog__WEBPACK_IMPORTED_MODULE_10__.InvalidQRCodeDialog, {
    onRetry: () => {
      setHasQRError(false);
      setIsSubmitting(false);
    }
  }), showAccessDeniedDialog && /*#__PURE__*/React.createElement(_src_components_common_CameraAccessDeniedDialog__WEBPACK_IMPORTED_MODULE_8__.CameraAccessDeniedDialog, {
    refreshPermissions: refreshPermissions
  }), !permissions || permissions === 'prompt' && /*#__PURE__*/React.createElement(_src_components_common_CameraAccessPromptDialog__WEBPACK_IMPORTED_MODULE_9__.CameraAccessPromptDialog, {
    QRScanner: QRScanner
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      flexGrow: 1,
      justifyContent: 'space-between',
      px: 2,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Button, {
    color: "secondary",
    "data-testid": "transaction-keystone-reject-btn",
    size: "large",
    onClick: onReject,
    fullWidth: true,
    disabled: isSubmitting
  }, t('Reject')), step === KeystoneApprovalStep.SCAN_WITH_KEYSTONE && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Button, {
    "data-testid": "transaction-keystone-approve-btn",
    size: "large",
    onClick: () => setStep(KeystoneApprovalStep.SCAN_FROM_KEYSTONE),
    fullWidth: true
  }, t('Get Signature')))));
}

/***/ }),

/***/ "?0b7d":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1NpZ25UcmFuc2FjdGlvbl9jb21wb25lbnRzX0tleXN0b25lQXBwcm92YWxPdmVybGF5X3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZ0Y7QUFDakM7QUFDaUI7QUFFekQsTUFBTU0sd0JBQXdCLEdBQUdBLENBQUM7RUFBRUM7QUFBbUIsQ0FBQyxLQUFLO0VBQ2xFLE1BQU07SUFBRUM7RUFBRSxDQUFDLEdBQUdKLDZEQUFjLEVBQUU7RUFFOUIsb0JBQ0VLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUiwrREFBTTtJQUNMUyxJQUFJO0lBQ0pDLGFBQWEsRUFBRSxLQUFNO0lBQ3JCQyxTQUFTO0lBQ1RDLFFBQVEsRUFBRSxLQUFNO0lBQ2hCQyxFQUFFLEVBQUU7TUFBRUMsU0FBUyxFQUFFO0lBQVMsQ0FBRTtJQUM1QkMsVUFBVSxFQUFFO01BQ1ZGLEVBQUUsRUFBRTtRQUFFRyxDQUFDLEVBQUUsQ0FBQztRQUFFQyxLQUFLLEVBQUUsTUFBTTtRQUFFTCxRQUFRLEVBQUU7TUFBTztJQUM5QztFQUFFLGdCQUVGTCxLQUFBLENBQUFDLGFBQUEsQ0FBQ1YsOERBQUs7SUFDSmUsRUFBRSxFQUFFO01BQ0ZLLFVBQVUsRUFBRSxRQUFRO01BQ3BCQyxNQUFNLEVBQUUsTUFBTTtNQUNkQyxjQUFjLEVBQUUsUUFBUTtNQUN4QkMsR0FBRyxFQUFFLENBQUM7TUFDTkMsRUFBRSxFQUFFLENBQUM7TUFDTEMsRUFBRSxFQUFFO0lBQ047RUFBRSxnQkFFRmhCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVCxtRUFBVTtJQUFDeUIsT0FBTyxFQUFDO0VBQUksR0FBRWxCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFjLGVBQzNEQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ1YsOERBQUs7SUFBQ2UsRUFBRSxFQUFFO01BQUVLLFVBQVUsRUFBRSxRQUFRO01BQUVHLEdBQUcsRUFBRTtJQUFFO0VBQUUsZ0JBQzFDZCxLQUFBLENBQUFDLGFBQUEsQ0FBQ1Qs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Q3ZCQyxrQkFBa0IsRUFBRUE7RUFBbUIsRUFFMUMsRUFDQSxDQUFDd0QsV0FBVyxJQUNWQSxXQUFXLEtBQUssUUFBUSxpQkFDdkJ0RCxLQUFBLENBQUFDLGFBQUEsQ0FBQ3NCLHFHQUF3QjtJQUFDQyxTQUFTLEVBQUVBO0VBQVUsRUFDL0MsQ0FFUCxDQUNLLENBQ0osZUFDTnhCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDViwrREFBSztJQUNKZSxFQUFFLEVBQUU7TUFDRnFILGFBQWEsRUFBRSxLQUFLO01BQ3BCaEgsVUFBVSxFQUFFLFVBQVU7TUFDdEJELEtBQUssRUFBRSxNQUFNO01BQ2IySCxRQUFRLEVBQUUsQ0FBQztNQUNYeEgsY0FBYyxFQUFFLGVBQWU7TUFDL0JHLEVBQUUsRUFBRSxDQUFDO01BQ0xGLEdBQUcsRUFBRTtJQUNQO0VBQUUsZ0JBRUZkLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUCxnRUFBTTtJQUNMd0IsS0FBSyxFQUFDLFdBQVc7SUFDakIsZUFBWSxpQ0FBaUM7SUFDN0NDLElBQUksRUFBQyxPQUFPO0lBQ1pDLE9BQU8sRUFBRTJELFFBQVM7SUFDbEIzRSxTQUFTO0lBQ1RrSSxRQUFRLEVBQUVsRDtFQUFhLEdBRXRCckYsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUNMLEVBQ1JrRixJQUFJLEtBQUtKLG9CQUFvQixDQUFDTSxrQkFBa0IsaUJBQy9DbkYsS0FBQSxDQUFBQyxhQUFBLENBQUNQLGdFQUFNO0lBQ0wsZUFBWSxrQ0FBa0M7SUFDOUN5QixJQUFJLEVBQUMsT0FBTztJQUNaQyxPQUFPLEVBQUVBLENBQUEsS0FBTThELE9BQU8sQ0FBQ0wsb0JBQW9CLENBQUN5QixrQkFBa0IsQ0FBRTtJQUNoRWxHLFNBQVM7RUFBQSxHQUVSTCxDQUFDLENBQUMsZUFBZSxDQUFDLENBRXRCLENBQ0ssQ0FDRixDQUNBO0FBRWQ7Ozs7Ozs7Ozs7QUNoVEEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0NhbWVyYUFjY2Vzc0RlbmllZERpYWxvZy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9DYW1lcmFBY2Nlc3NQcm9tcHREaWFsb2cudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vSW52YWxpZFFSQ29kZURpYWxvZy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2ljb25zL0NhbWVyYUFjY2Vzc0RlbmllZEljb24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9pY29ucy9JbnZhbGlkUVJDb2RlSWNvbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VDYW1lcmFQZXJtaXNzaW9ucy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL0tleXN0b25lQXBwcm92YWxPdmVybGF5LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uL2lnbm9yZWR8L1VzZXJzL2NzYWJhLnZhbHlpL3Byai9jb3JlLWV4dGVuc2lvbi9ub2RlX21vZHVsZXMvQG5vYmxlL3NlY3AyNTZrMS9saWJ8Y3J5cHRvIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5LCBEaWFsb2csIEJ1dHRvbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IENhbWVyYUJsb2NrZWRJY29uIGZyb20gJy4uL2ljb25zL0NhbWVyYUFjY2Vzc0RlbmllZEljb24nO1xuXG5leHBvcnQgY29uc3QgQ2FtZXJhQWNjZXNzRGVuaWVkRGlhbG9nID0gKHsgcmVmcmVzaFBlcm1pc3Npb25zIH0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPERpYWxvZ1xuICAgICAgb3BlblxuICAgICAgc2hvd0Nsb3NlSWNvbj17ZmFsc2V9XG4gICAgICBmdWxsV2lkdGhcbiAgICAgIG1heFdpZHRoPXtmYWxzZX1cbiAgICAgIHN4PXt7IHRleHRBbGlnbjogJ2NlbnRlcicgfX1cbiAgICAgIFBhcGVyUHJvcHM9e3tcbiAgICAgICAgc3g6IHsgbTogMiwgd2lkdGg6ICcxMDAlJywgbWF4V2lkdGg6ICdub25lJyB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgZ2FwOiAzLFxuICAgICAgICAgIHB5OiAzLFxuICAgICAgICAgIHB4OiAyLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDRcIj57dCgnQWNjZXNzIEJsb2NrZWQnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAzIH19PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MVwiPlxuICAgICAgICAgICAge3QoXG4gICAgICAgICAgICAgIGBZb3UndmUgYmxvY2tlZCBhY2Nlc3MgdG8geW91ciBjYW1lcmEuIFBsZWFzZSBhbGxvdyBhY2Nlc3MgdG8gY29udGludWUuYCxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxDYW1lcmFCbG9ja2VkSWNvbiAvPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAnSWYgeW91IGJsb2NrIGFjY2VzcywgbG9vayBpbiB0aGUgdG9wIHJpZ2h0IGNvcm5lciBvZiB5b3VyIGJyb3dzZXIgdG8gZW5hYmxlIGNhbWVyYSBhY2Nlc3MnLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDIsIHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgY29sb3I9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgIHNpemU9XCJtZWRpdW1cIlxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBvbkNsaWNrPXtyZWZyZXNoUGVybWlzc2lvbnN9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ0RvbmUnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9EaWFsb2c+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIERpYWxvZyxcbiAgQnV0dG9uLFxuICBFeHRlcm5hbExpbmtJY29uLFxuICBDaXJjdWxhclByb2dyZXNzLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuZXhwb3J0IGNvbnN0IENhbWVyYUFjY2Vzc1Byb21wdERpYWxvZyA9ICh7IFFSU2Nhbm5lciB9KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICByZXR1cm4gKFxuICAgIDxEaWFsb2dcbiAgICAgIG9wZW5cbiAgICAgIHNob3dDbG9zZUljb249e2ZhbHNlfVxuICAgICAgZnVsbFdpZHRoXG4gICAgICBtYXhXaWR0aD17ZmFsc2V9XG4gICAgICBzeD17eyB0ZXh0QWxpZ246ICdjZW50ZXInIH19XG4gICAgICBQYXBlclByb3BzPXt7XG4gICAgICAgIHN4OiB7IG06IDIsIHdpZHRoOiAnMTAwJScsIG1heFdpZHRoOiAnbm9uZScgfSxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgIGdhcDogMyxcbiAgICAgICAgICBweTogMyxcbiAgICAgICAgICBweDogMixcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg0XCI+e3QoJ0NhbWVyYSBBY2Nlc3MnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAzIH19PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MVwiPlxuICAgICAgICAgICAge3QoYEFsbG93IENocm9tZSBhY2Nlc3MgdG8geW91ciBjYW1lcmEgdG8gc2NhbiB0aGUgUVIgQ29kZWApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXs2NH0gc3g9e3sgbXk6IDYgfX0gLz5cbiAgICAgICAgICA8UVJTY2FubmVyIC8+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiPlxuICAgICAgICAgICAge3QoXG4gICAgICAgICAgICAgICdJZiB5b3UgYmxvY2sgYWNjZXNzLCBsb29rIGluIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHlvdXIgYnJvd3NlciB0byBlbmFibGUgY2FtZXJhIGFjY2VzcycsXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMiwgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgICA8QnV0dG9uIGZ1bGxXaWR0aCBzaXplPVwibWVkaXVtXCI+XG4gICAgICAgICAgICB7dCgnQ2xvc2UnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuKCdodHRwczovL2tleXN0Lm9uZScsICdfYmxhbmsnLCAnbm9yZWZlcnJlcicpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8RXh0ZXJuYWxMaW5rSWNvblxuICAgICAgICAgICAgICBzaXplPXsxNn1cbiAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICdzZWNvbmRhcnkubWFpbicsIG1hcmdpblJpZ2h0OiAxIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGNvbG9yOiAnc2Vjb25kYXJ5Lm1haW4nLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ0tleXN0b25lIFN1cHBvcnQnKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9EaWFsb2c+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgU3RhY2ssIFR5cG9ncmFwaHksIERpYWxvZywgQnV0dG9uIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgSW52YWxpZFFSQ29kZUljb24gZnJvbSAnLi4vaWNvbnMvSW52YWxpZFFSQ29kZUljb24nO1xuXG5leHBvcnQgY29uc3QgSW52YWxpZFFSQ29kZURpYWxvZyA9ICh7IG9uUmV0cnkgfSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8RGlhbG9nXG4gICAgICBvcGVuXG4gICAgICBzaG93Q2xvc2VJY29uPXtmYWxzZX1cbiAgICAgIGZ1bGxXaWR0aFxuICAgICAgbWF4V2lkdGg9e2ZhbHNlfVxuICAgICAgc3g9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fVxuICAgICAgUGFwZXJQcm9wcz17e1xuICAgICAgICBzeDogeyBtOiAyLCB3aWR0aDogJzEwMCUnLCBtYXhXaWR0aDogJ25vbmUnIH0sXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICBnYXA6IDMsXG4gICAgICAgICAgcHk6IDMsXG4gICAgICAgICAgcHg6IDIsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiPnt0KCdJbnZhbGlkIFFSIENvZGUnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAzIH19PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MVwiPlxuICAgICAgICAgICAge3QoXG4gICAgICAgICAgICAgIGBQbGVhc2UgZW5zdXJlIHlvdSBoYXZlIHNlbGVjdGVkIGEgdmFsaWQgUVIgY29kZSBmcm9tIHlvdXIgS2V5c3RvbmUgZGV2aWNlYCxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxJbnZhbGlkUVJDb2RlSWNvbiAvPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2sgc3g9e3sgZ2FwOiAyLCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgIDxCdXR0b24gY29sb3I9XCJwcmltYXJ5XCIgc2l6ZT1cIm1lZGl1bVwiIGZ1bGxXaWR0aCBvbkNsaWNrPXtvblJldHJ5fT5cbiAgICAgICAgICAgIHt0KCdSZXRyeScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L0RpYWxvZz5cbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBDYW1lcmFCbG9ja2VkSWNvbixcbiAgSWNvbkJhc2VQcm9wcyxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENhbWVyYUFjY2Vzc0RlbmllZEljb24ocHJvcHM6IEljb25CYXNlUHJvcHMpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPENhbWVyYUJsb2NrZWRJY29uXG4gICAgICBzaXplPXszOH1cbiAgICAgIHN4PXt7XG4gICAgICAgIG91dGxpbmU6IGAycHggc29saWQgJHt0aGVtZS5wYWxldHRlLmVycm9yLm1haW59YCxcbiAgICAgICAgb3V0bGluZU9mZnNldDogMyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnZXJyb3IubWFpbicsXG4gICAgICAgIG06IDEsXG4gICAgICAgIHA6IDIsXG4gICAgICAgIGJvcmRlclJhZGl1czogOTk5LFxuICAgICAgICBib3JkZXI6IDEsXG4gICAgICAgIGJvcmRlckNvbG9yOiAnZXJyb3IubWFpbicsXG4gICAgICB9fVxuICAgICAgey4uLnByb3BzfVxuICAgIC8+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBJY29uQmFzZVByb3BzLFxuICBRUkNvZGVJY29uLFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSW52YWxpZFFSQ29kZUljb24ocHJvcHM6IEljb25CYXNlUHJvcHMpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPFFSQ29kZUljb25cbiAgICAgIHNpemU9ezM4fVxuICAgICAgc3g9e3tcbiAgICAgICAgb3V0bGluZTogYDJweCBzb2xpZCAke3RoZW1lLnBhbGV0dGUuZXJyb3IubWFpbn1gLFxuICAgICAgICBvdXRsaW5lT2Zmc2V0OiAzLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdlcnJvci5tYWluJyxcbiAgICAgICAgbTogMSxcbiAgICAgICAgcDogMixcbiAgICAgICAgYm9yZGVyUmFkaXVzOiA5OTksXG4gICAgICAgIGJvcmRlcjogMSxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICdlcnJvci5tYWluJyxcbiAgICAgIH19XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VDYW1lcmFQZXJtaXNzaW9ucygpIHtcbiAgY29uc3QgW29ic2VydmVyLCBzZXRPYnNlcnZlcl0gPSB1c2VTdGF0ZTxQZXJtaXNzaW9uU3RhdHVzPigpO1xuICBjb25zdCBbcGVybWlzc2lvbnMsIHNldFBlcm1pc3Npb25zXSA9IHVzZVN0YXRlPFBlcm1pc3Npb25TdGF0ZT4oKTtcblxuICBjb25zdCBnZXRQZXJtaXNzaW9ucyA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwZXJtaXNzaW9uc09ic2VydmVyID0gYXdhaXQgbmF2aWdhdG9yLnBlcm1pc3Npb25zLnF1ZXJ5KHtcbiAgICAgIG5hbWU6ICdjYW1lcmEnIGFzIFBlcm1pc3Npb25OYW1lLFxuICAgIH0pO1xuICAgIHBlcm1pc3Npb25zT2JzZXJ2ZXIub25jaGFuZ2UgPSAoKSA9PlxuICAgICAgc2V0UGVybWlzc2lvbnMocGVybWlzc2lvbnNPYnNlcnZlci5zdGF0ZSk7XG5cbiAgICBzZXRQZXJtaXNzaW9ucyhwZXJtaXNzaW9uc09ic2VydmVyLnN0YXRlKTtcbiAgICBzZXRPYnNlcnZlcihwZXJtaXNzaW9uc09ic2VydmVyKTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZ2V0UGVybWlzc2lvbnMoKTtcbiAgfSwgW2dldFBlcm1pc3Npb25zXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzYXZlZE9ic2VydmVyID0gb2JzZXJ2ZXI7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHNhdmVkT2JzZXJ2ZXIpIHtcbiAgICAgICAgc2F2ZWRPYnNlcnZlci5vbmNoYW5nZSA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW29ic2VydmVyXSk7XG5cbiAgcmV0dXJuIHtcbiAgICBwZXJtaXNzaW9ucyxcbiAgICByZWZyZXNoUGVybWlzc2lvbnM6IGdldFBlcm1pc3Npb25zLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEFsZXJ0LFxuICBBbGVydFRpdGxlLFxuICBCb3gsXG4gIEJ1dHRvbixcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQge1xuICBBbmltYXRlZFFSQ29kZSxcbiAgQW5pbWF0ZWRRUlNjYW5uZXIsXG4gIFVSVHlwZSxcbn0gZnJvbSAnQGtleXN0b25laHEvYW5pbWF0ZWQtcXInO1xuaW1wb3J0IHsgUmVnaXN0cnlUeXBlcyB9IGZyb20gJ0BrZXlzdG9uZWhxL2JjLXVyLXJlZ2lzdHJ5LWV0aCc7XG5cbmltcG9ydCB7IE92ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL092ZXJsYXknO1xuaW1wb3J0IHsgUGFnZVRpdGxlIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9QYWdlVGl0bGUnO1xuaW1wb3J0IHVzZUlzVXNpbmdLZXlzdG9uZVdhbGxldCBmcm9tICdAc3JjL2hvb2tzL3VzZUlzVXNpbmdLZXlzdG9uZVdhbGxldCc7XG5pbXBvcnQgdXNlQ2FtZXJhUGVybWlzc2lvbnMgZnJvbSAnQHNyYy9ob29rcy91c2VDYW1lcmFQZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyB1c2VLZXlzdG9uZUNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0tleXN0b25lUHJvdmlkZXInO1xuaW1wb3J0IHsgQ2FtZXJhQWNjZXNzRGVuaWVkRGlhbG9nIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9DYW1lcmFBY2Nlc3NEZW5pZWREaWFsb2cnO1xuaW1wb3J0IHsgQ2FtZXJhQWNjZXNzUHJvbXB0RGlhbG9nIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9DYW1lcmFBY2Nlc3NQcm9tcHREaWFsb2cnO1xuaW1wb3J0IHsgSW52YWxpZFFSQ29kZURpYWxvZyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vSW52YWxpZFFSQ29kZURpYWxvZyc7XG5cbmludGVyZmFjZSBLZXlzdG9uZUFwcHJvdmFsT3ZlcmxheVByb3BzIHtcbiAgb25SZWplY3Q/OiAoKSA9PiB2b2lkO1xufVxuXG5lbnVtIEtleXN0b25lQXBwcm92YWxTdGVwIHtcbiAgU0NBTl9XSVRIX0tFWVNUT05FID0gMCxcbiAgU0NBTl9GUk9NX0tFWVNUT05FID0gLTEsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBLZXlzdG9uZUFwcHJvdmFsT3ZlcmxheSh7XG4gIG9uUmVqZWN0LFxufTogS2V5c3RvbmVBcHByb3ZhbE92ZXJsYXlQcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGlzVXNpbmdLZXlzdG9uZVdhbGxldCA9IHVzZUlzVXNpbmdLZXlzdG9uZVdhbGxldCgpO1xuICBjb25zdCBbc3RlcCwgc2V0U3RlcF0gPSB1c2VTdGF0ZShLZXlzdG9uZUFwcHJvdmFsU3RlcC5TQ0FOX1dJVEhfS0VZU1RPTkUpO1xuICBjb25zdCBbaXNTdWJtaXR0aW5nLCBzZXRJc1N1Ym1pdHRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaGFzU3VibWl0dGVkLCBzZXRIYXNTdWJtaXR0ZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCB7IHR4UmVxdWVzdCwgc3VibWl0U2lnbmF0dXJlIH0gPSB1c2VLZXlzdG9uZUNvbnRleHQoKTtcbiAgY29uc3QgW2hhc1FSRXJyb3IsIHNldEhhc1FSRXJyb3JdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbc2hvd0FjY2Vzc0RlbmllZERpYWxvZywgc2V0U2hvd0FjY2Vzc0RlbmllZERpYWxvZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG93QWxlcnQsIHNldFNob3dBbGVydF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodHhSZXF1ZXN0KSB7XG4gICAgICBzZXRTdGVwKEtleXN0b25lQXBwcm92YWxTdGVwLlNDQU5fV0lUSF9LRVlTVE9ORSk7XG4gICAgICBzZXRJc1N1Ym1pdHRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfSwgW3R4UmVxdWVzdF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFpc1N1Ym1pdHRpbmcgJiYgaGFzU3VibWl0dGVkKSB7XG4gICAgICBzZXRTaG93QWxlcnQodHJ1ZSk7XG4gICAgfVxuICB9LCBbaGFzU3VibWl0dGVkLCBpc1N1Ym1pdHRpbmddKTtcblxuICBjb25zdCBvbkJhY2tDbGljayA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoc3RlcCA9PT0gS2V5c3RvbmVBcHByb3ZhbFN0ZXAuU0NBTl9XSVRIX0tFWVNUT05FKSB7XG4gICAgICBvblJlamVjdD8uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFN0ZXAoS2V5c3RvbmVBcHByb3ZhbFN0ZXAuU0NBTl9XSVRIX0tFWVNUT05FKTtcbiAgICB9XG4gIH0sIFtzdGVwLCBvblJlamVjdF0pO1xuXG4gIGNvbnN0IHN1Ym1pdFR4ID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKGNib3I6IHN0cmluZywgdHlwZTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoIXR4UmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHN1Ym1pdFNpZ25hdHVyZSh7XG4gICAgICAgIHJlcXVlc3RJZDogdHhSZXF1ZXN0LnJlcXVlc3RJZCxcbiAgICAgICAgY2JvcixcbiAgICAgICAgdHlwZSxcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgW3N1Ym1pdFNpZ25hdHVyZSwgdHhSZXF1ZXN0XSxcbiAgKTtcblxuICBjb25zdCBoYW5kbGVTY2FuID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHsgY2JvciwgdHlwZSB9KSA9PiB7XG4gICAgICAvLyBQcmV2ZW50IHNjYW5uaW5nIHRvbyBlYXJseSwgb3IgbW9yZSB0aGFuIG9uY2VcbiAgICAgIGlmIChzdGVwICE9PSBLZXlzdG9uZUFwcHJvdmFsU3RlcC5TQ0FOX0ZST01fS0VZU1RPTkUgfHwgaXNTdWJtaXR0aW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2V0SXNTdWJtaXR0aW5nKHRydWUpO1xuICAgICAgc2V0SGFzU3VibWl0dGVkKHRydWUpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBzdWJtaXRUeChjYm9yLCB0eXBlKTtcbiAgICAgIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICAgICAgc2V0SGFzUVJFcnJvcih0cnVlKTtcbiAgICAgICAgc2V0SXNTdWJtaXR0aW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtzdWJtaXRUeCwgaXNTdWJtaXR0aW5nLCBzdGVwXSxcbiAgKTtcblxuICBjb25zdCBoYW5kbGVFcnJvciA9IHVzZUNhbGxiYWNrKChlcnJvcjogc3RyaW5nKSA9PiB7XG4gICAgaWYgKCFlcnJvciB8fCBlcnJvci5pbmNsdWRlcygnRGltZW5zaW9ucycpKSB7XG4gICAgICAvLyBUaGUgY29tcG9uZW50IGNvbnRpbm91c2x5IHNjYW5zIGFuZCByYWlzZXMgYW4gdW5kZWZpbmVkIGVycm9yXG4gICAgICAvLyB3aGVuIGl0J3Mgbm90IGFibGUgdG8gZmluZCB0aGUgUVIgY29kZS5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZXRIYXNRUkVycm9yKHRydWUpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgeyBwZXJtaXNzaW9ucywgcmVmcmVzaFBlcm1pc3Npb25zIH0gPSB1c2VDYW1lcmFQZXJtaXNzaW9ucygpO1xuICBjb25zdCBzY2FubmVyUHJvcHMgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICB1clR5cGVzOiBbXG4gICAgICAgIFVSVHlwZS5FVk1fU0lHTkFUVVJFLFxuICAgICAgICBVUlR5cGUuRVRIX1NJR05BVFVSRSxcbiAgICAgICAgUmVnaXN0cnlUeXBlcy5DUllQVE9fUFNCVC5nZXRUeXBlKCksXG4gICAgICBdLFxuICAgICAgaGFuZGxlRXJyb3IsXG4gICAgICBoYW5kbGVTY2FuLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICB3aWR0aDogIWlzU3VibWl0dGluZyAmJiBwZXJtaXNzaW9ucyA9PT0gJ2dyYW50ZWQnID8gMjIwIDogMSxcbiAgICAgICAgaGVpZ2h0OiAhaXNTdWJtaXR0aW5nICYmIHBlcm1pc3Npb25zID09PSAnZ3JhbnRlZCcgPyAyMjAgOiAxLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBbaGFuZGxlRXJyb3IsIGhhbmRsZVNjYW4sIGlzU3VibWl0dGluZywgcGVybWlzc2lvbnNdLFxuICApO1xuXG4gIGNvbnN0IFFSU2Nhbm5lciA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IFNjYW5uZXIgPSAoKSA9PiA8QW5pbWF0ZWRRUlNjYW5uZXIgey4uLnNjYW5uZXJQcm9wc30gLz47XG5cbiAgICByZXR1cm4gU2Nhbm5lcjtcbiAgfSwgW3NjYW5uZXJQcm9wc10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0U2hvd0FjY2Vzc0RlbmllZERpYWxvZyhwZXJtaXNzaW9ucyA9PT0gJ2RlbmllZCcpO1xuICB9LCBbcGVybWlzc2lvbnNdKTtcblxuICBpZiAoIWlzVXNpbmdLZXlzdG9uZVdhbGxldCB8fCAhdHhSZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxPdmVybGF5IGlzQmFja2dyb3VuZEZpbGxlZD5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgcHQ6IDIsXG4gICAgICAgICAgcGI6IDMsXG4gICAgICAgICAgZ2FwOiBzaG93QWxlcnQgPyAxLjUgOiAyLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7c2hvd0FsZXJ0ICYmIChcbiAgICAgICAgICA8QWxlcnRcbiAgICAgICAgICAgIHNldmVyaXR5PVwiaW5mb1wiXG4gICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRTaG93QWxlcnQoZmFsc2UpfVxuICAgICAgICAgICAgc3g9e3sgbXg6IDIgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QWxlcnRUaXRsZT57dCgnVGhpcyBpcyBhIG5ldyBhcHByb3ZhbCcpfTwvQWxlcnRUaXRsZT5cbiAgICAgICAgICAgIHt0KCdUaGlzIHRyYW5zYWN0aW9uIHJlcXVpcmVzIG11bHRpcGxlIGFwcHJvdmFscy4nKX1cbiAgICAgICAgICA8L0FsZXJ0PlxuICAgICAgICApfVxuXG4gICAgICAgIDxQYWdlVGl0bGUgb25CYWNrQ2xpY2s9e29uQmFja0NsaWNrfSBtYXJnaW49XCIwXCI+XG4gICAgICAgICAge3QoJ1NjYW4gUVIgQ29kZScpfVxuICAgICAgICA8L1BhZ2VUaXRsZT5cbiAgICAgICAgPEJveCBzeD17eyB3aWR0aDogJzEwMCUnLCBvdmVyZmxvd1g6ICdoaWRkZW4nLCBvdmVyZmxvd1k6ICdoaWRkZW4nIH19PlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgd2lkdGg6ICcyMDAlJyxcbiAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMC4xcyBlYXNlLWluLW91dCcsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZVgoY2FsYyg1MCUgKiAke3N0ZXB9KSlgLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBnYXA6IHNob3dBbGVydCA/IDIuNSA6IDUsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICAgICAgICBweDogMixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCI+XG4gICAgICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgICAgICBpMThuS2V5PVwiU2NhbiB0aGUgUVIgY29kZSB3aXRoIHlvdXIgPGRldmljZU5hbWU+S2V5c3RvbmUgZGV2aWNlPC9kZXZpY2VOYW1lPlwiXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRzPXt7XG4gICAgICAgICAgICAgICAgICAgIGRldmljZU5hbWU6IDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNlwiIGNvbXBvbmVudD1cInNwYW5cIiAvPixcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICB7dHhSZXF1ZXN0ID8gKFxuICAgICAgICAgICAgICAgIDxBbmltYXRlZFFSQ29kZVxuICAgICAgICAgICAgICAgICAgY2Jvcj17dHhSZXF1ZXN0LmNib3J9XG4gICAgICAgICAgICAgICAgICB0eXBlPXt0eFJlcXVlc3QudHlwZX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e3sgc2l6ZTogMjIwIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXsxMDB9IC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ249XCJjZW50ZXJcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoXG4gICAgICAgICAgICAgICAgICBgQ2xpY2sgb24gdGhlICdHZXQgU2lnbmF0dXJlJyBidXR0b24gYWZ0ZXIgc2lnbmluZyB0aGUgdHJhbnNhY3Rpb24gd2l0aCB5b3VyIEtleXN0b25lIGRldmljZS5gLFxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBnYXA6IDUsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICAgICAgICBweDogc2hvd0FsZXJ0ID8gMS41IDogMixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCI+XG4gICAgICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgICAgICBpMThuS2V5PVwiU2NhbiB0aGUgUVIgY29kZSBkaXNwbGF5ZWQgb24geW91ciA8ZGV2aWNlTmFtZT5LZXlzdG9uZSBkZXZpY2U8L2RldmljZU5hbWU+XCJcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlTmFtZTogPFR5cG9ncmFwaHkgdmFyaWFudD1cImg2XCIgY29tcG9uZW50PVwic3BhblwiIC8+LFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIHsvKiBTYXZlIHNwYWNlIGZvciB0aGUgc2Nhbm5lciBmZWVkICovfVxuICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAyMjAsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtpc1N1Ym1pdHRpbmcgJiYgPENpcmN1bGFyUHJvZ3Jlc3Mgc2l6ZT17MTAwfSAvPn1cbiAgICAgICAgICAgICAgICA8UVJTY2FubmVyIC8+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgICAgICB7dCgnUG9zaXRpb24gdGhlIFFSIGNvZGUgaW4gZnJvbnQgb2YgeW91ciBjYW1lcmEuJyl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICB7c3RlcCA9PT0gS2V5c3RvbmVBcHByb3ZhbFN0ZXAuU0NBTl9GUk9NX0tFWVNUT05FICYmIChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICB7aGFzUVJFcnJvciAmJiAoXG4gICAgICAgICAgICAgICAgICA8SW52YWxpZFFSQ29kZURpYWxvZ1xuICAgICAgICAgICAgICAgICAgICBvblJldHJ5PXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0SGFzUVJFcnJvcihmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0SXNTdWJtaXR0aW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICB7c2hvd0FjY2Vzc0RlbmllZERpYWxvZyAmJiAoXG4gICAgICAgICAgICAgICAgICA8Q2FtZXJhQWNjZXNzRGVuaWVkRGlhbG9nXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hQZXJtaXNzaW9ucz17cmVmcmVzaFBlcm1pc3Npb25zfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHshcGVybWlzc2lvbnMgfHxcbiAgICAgICAgICAgICAgICAgIChwZXJtaXNzaW9ucyA9PT0gJ3Byb21wdCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8Q2FtZXJhQWNjZXNzUHJvbXB0RGlhbG9nIFFSU2Nhbm5lcj17UVJTY2FubmVyfSAvPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICBweDogMixcbiAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmFuc2FjdGlvbi1rZXlzdG9uZS1yZWplY3QtYnRuXCJcbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvblJlamVjdH1cbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzU3VibWl0dGluZ31cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnUmVqZWN0Jyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAge3N0ZXAgPT09IEtleXN0b25lQXBwcm92YWxTdGVwLlNDQU5fV0lUSF9LRVlTVE9ORSAmJiAoXG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwidHJhbnNhY3Rpb24ta2V5c3RvbmUtYXBwcm92ZS1idG5cIlxuICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTdGVwKEtleXN0b25lQXBwcm92YWxTdGVwLlNDQU5fRlJPTV9LRVlTVE9ORSl9XG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnR2V0IFNpZ25hdHVyZScpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9PdmVybGF5PlxuICApO1xufVxuIiwiLyogKGlnbm9yZWQpICovIl0sIm5hbWVzIjpbIlN0YWNrIiwiVHlwb2dyYXBoeSIsIkRpYWxvZyIsIkJ1dHRvbiIsInVzZVRyYW5zbGF0aW9uIiwiQ2FtZXJhQmxvY2tlZEljb24iLCJDYW1lcmFBY2Nlc3NEZW5pZWREaWFsb2ciLCJyZWZyZXNoUGVybWlzc2lvbnMiLCJ0IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwib3BlbiIsInNob3dDbG9zZUljb24iLCJmdWxsV2lkdGgiLCJtYXhXaWR0aCIsInN4IiwidGV4dEFsaWduIiwiUGFwZXJQcm9wcyIsIm0iLCJ3aWR0aCIsImFsaWduSXRlbXMiLCJoZWlnaHQiLCJqdXN0aWZ5Q29udGVudCIsImdhcCIsInB5IiwicHgiLCJ2YXJpYW50IiwiY29sb3IiLCJzaXplIiwib25DbGljayIsIkV4dGVybmFsTGlua0ljb24iLCJDaXJjdWxhclByb2dyZXNzIiwiQ2FtZXJhQWNjZXNzUHJvbXB0RGlhbG9nIiwiUVJTY2FubmVyIiwibXkiLCJ3aW5kb3ciLCJtYXJnaW5SaWdodCIsImZvbnRXZWlnaHQiLCJJbnZhbGlkUVJDb2RlSWNvbiIsIkludmFsaWRRUkNvZGVEaWFsb2ciLCJvblJldHJ5IiwidXNlVGhlbWUiLCJDYW1lcmFBY2Nlc3NEZW5pZWRJY29uIiwicHJvcHMiLCJ0aGVtZSIsIl9leHRlbmRzIiwib3V0bGluZSIsInBhbGV0dGUiLCJlcnJvciIsIm1haW4iLCJvdXRsaW5lT2Zmc2V0IiwiYmFja2dyb3VuZENvbG9yIiwicCIsImJvcmRlclJhZGl1cyIsImJvcmRlciIsImJvcmRlckNvbG9yIiwiUVJDb2RlSWNvbiIsInVzZUNhbGxiYWNrIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJ1c2VDYW1lcmFQZXJtaXNzaW9ucyIsIm9ic2VydmVyIiwic2V0T2JzZXJ2ZXIiLCJwZXJtaXNzaW9ucyIsInNldFBlcm1pc3Npb25zIiwiZ2V0UGVybWlzc2lvbnMiLCJwZXJtaXNzaW9uc09ic2VydmVyIiwibmF2aWdhdG9yIiwicXVlcnkiLCJuYW1lIiwib25jaGFuZ2UiLCJzdGF0ZSIsInNhdmVkT2JzZXJ2ZXIiLCJ1c2VNZW1vIiwiVHJhbnMiLCJBbGVydCIsIkFsZXJ0VGl0bGUiLCJCb3giLCJBbmltYXRlZFFSQ29kZSIsIkFuaW1hdGVkUVJTY2FubmVyIiwiVVJUeXBlIiwiUmVnaXN0cnlUeXBlcyIsIk92ZXJsYXkiLCJQYWdlVGl0bGUiLCJ1c2VJc1VzaW5nS2V5c3RvbmVXYWxsZXQiLCJ1c2VLZXlzdG9uZUNvbnRleHQiLCJLZXlzdG9uZUFwcHJvdmFsU3RlcCIsIktleXN0b25lQXBwcm92YWxPdmVybGF5Iiwib25SZWplY3QiLCJpc1VzaW5nS2V5c3RvbmVXYWxsZXQiLCJzdGVwIiwic2V0U3RlcCIsIlNDQU5fV0lUSF9LRVlTVE9ORSIsImlzU3VibWl0dGluZyIsInNldElzU3VibWl0dGluZyIsImhhc1N1Ym1pdHRlZCIsInNldEhhc1N1Ym1pdHRlZCIsInR4UmVxdWVzdCIsInN1Ym1pdFNpZ25hdHVyZSIsImhhc1FSRXJyb3IiLCJzZXRIYXNRUkVycm9yIiwic2hvd0FjY2Vzc0RlbmllZERpYWxvZyIsInNldFNob3dBY2Nlc3NEZW5pZWREaWFsb2ciLCJzaG93QWxlcnQiLCJzZXRTaG93QWxlcnQiLCJvbkJhY2tDbGljayIsInN1Ym1pdFR4IiwiY2JvciIsInR5cGUiLCJyZXF1ZXN0SWQiLCJoYW5kbGVTY2FuIiwiU0NBTl9GUk9NX0tFWVNUT05FIiwiX2VyciIsImhhbmRsZUVycm9yIiwiaW5jbHVkZXMiLCJzY2FubmVyUHJvcHMiLCJ1clR5cGVzIiwiRVZNX1NJR05BVFVSRSIsIkVUSF9TSUdOQVRVUkUiLCJDUllQVE9fUFNCVCIsImdldFR5cGUiLCJvcHRpb25zIiwiU2Nhbm5lciIsImlzQmFja2dyb3VuZEZpbGxlZCIsInB0IiwicGIiLCJzZXZlcml0eSIsIm9uQ2xvc2UiLCJteCIsIm1hcmdpbiIsIm92ZXJmbG93WCIsIm92ZXJmbG93WSIsImZsZXhEaXJlY3Rpb24iLCJ0cmFuc2l0aW9uIiwidHJhbnNmb3JtIiwiZmxleCIsImkxOG5LZXkiLCJjb21wb25lbnRzIiwiZGV2aWNlTmFtZSIsImNvbXBvbmVudCIsIm1pbkhlaWdodCIsIkZyYWdtZW50IiwiZmxleEdyb3ciLCJkaXNhYmxlZCJdLCJzb3VyY2VSb290IjoiIn0=