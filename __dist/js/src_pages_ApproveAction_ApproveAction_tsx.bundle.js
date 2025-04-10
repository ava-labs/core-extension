"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ApproveAction_ApproveAction_tsx"],{

/***/ "./src/components/common/TokenAmount.tsx":
/*!***********************************************!*\
  !*** ./src/components/common/TokenAmount.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenAmount": () => (/* binding */ TokenAmount)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const TokenAmount = ({
  token,
  amount,
  fiatValue
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();

  // FIXME: Our contract parsers are not guarded from returning NaN as USD values.
  // Until this is fixed, we'll prevent displaying NaNs here.
  const displayFiatValue = typeof fiatValue === 'string' && !fiatValue.includes('NaN');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_0__.TokenIcon, {
    src: token?.logoUri
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body1",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, token?.symbol || t('Unknown'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      textAlign: 'end',
      justifyContent: fiatValue ? 'space-between' : 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    component: "span",
    sx: {
      lineHeight: 1
    }
  }, amount, " ", token?.symbol || t('Unknown Symbol')), displayFiatValue && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary',
      lineHeight: 1
    }
  }, fiatValue)));
};

/***/ }),

/***/ "./src/components/common/approval/ApprovalSection.tsx":
/*!************************************************************!*\
  !*** ./src/components/common/approval/ApprovalSection.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApprovalSection": () => (/* binding */ ApprovalSection),
/* harmony export */   "ApprovalSectionBody": () => (/* binding */ ApprovalSectionBody),
/* harmony export */   "ApprovalSectionHeader": () => (/* binding */ ApprovalSectionHeader)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const ApprovalSectionHeader = ({
  label,
  tooltip,
  tooltipIcon = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.InfoCircleIcon, null),
  children
}) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
  sx: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
  sx: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
  component: "h6",
  sx: {
    fontWeight: 600
  }
}, label), tooltip && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
  sx: {
    cursor: 'pointer',
    ml: 1
  },
  title: tooltip
}, tooltipIcon)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Box, null, children));
const ApprovalSectionBody = ({
  sx = {},
  ...rest
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    sx: {
      width: '100%',
      backgroundColor: 'background.paper',
      borderRadius: 1,
      p: 2,
      gap: 1,
      ...(typeof sx === 'function' ? sx(theme) : sx)
    }
  }, rest));
};
const ApprovalSection = ({
  sx = {},
  ...rest
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    sx: {
      width: '100%',
      gap: 0.5,
      ...(typeof sx === 'function' ? sx(theme) : sx)
    }
  }, rest));
};

/***/ }),

/***/ "./src/components/common/approval/TxDetailsRow.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/approval/TxDetailsRow.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TxDetailsRow": () => (/* binding */ TxDetailsRow)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const TxDetailsRow = ({
  children,
  label
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 1
    }
  }, typeof label === 'string' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    color: "text.secondary"
  }, label) : label, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1,
      minHeight: theme.spacing(2),
      minWidth: '0px',
      wordWrap: 'break-word'
    }
  }, children));
};

/***/ }),

/***/ "./src/pages/ApproveAction/ApproveAction.tsx":
/*!***************************************************!*\
  !*** ./src/pages/ApproveAction/ApproveAction.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApproveAction": () => (/* binding */ ApproveAction)
/* harmony export */ });
/* harmony import */ var _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/connections/dAppConnection/models */ "./src/background/connections/dAppConnection/models.ts");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var react_custom_scrollbars_2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-custom-scrollbars-2 */ "./node_modules/react-custom-scrollbars-2/lib/index.js");
/* harmony import */ var _hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _SignTransaction_components_SignTxErrorBoundary__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../SignTransaction/components/SignTxErrorBoundary */ "./src/pages/SignTransaction/components/SignTxErrorBoundary.tsx");
/* harmony import */ var _BridgeTransferAsset__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./BridgeTransferAsset */ "./src/pages/ApproveAction/BridgeTransferAsset.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _SignTransaction_hooks_useLedgerDisconnectedDialog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../SignTransaction/hooks/useLedgerDisconnectedDialog */ "./src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog.tsx");
/* harmony import */ var _SignTransaction_components_LedgerApprovalOverlay__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../SignTransaction/components/LedgerApprovalOverlay */ "./src/pages/SignTransaction/components/LedgerApprovalOverlay.tsx");
/* harmony import */ var _src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/hooks/useIsUsingLedgerWallet */ "./src/hooks/useIsUsingLedgerWallet.ts");
/* harmony import */ var _src_hooks_useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/hooks/useIsUsingKeystoneWallet */ "./src/hooks/useIsUsingKeystoneWallet.ts");
/* harmony import */ var _SignTransaction_components_KeystoneApprovalOverlay__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../SignTransaction/components/KeystoneApprovalOverlay */ "./src/pages/SignTransaction/components/KeystoneApprovalOverlay.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_hooks_useIsUsingWalletConnectAccount__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/hooks/useIsUsingWalletConnectAccount */ "./src/hooks/useIsUsingWalletConnectAccount.ts");
/* harmony import */ var _SignTransaction_components_WalletConnectApproval_WalletConnectApprovalOverlay__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay */ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay.tsx");
/* harmony import */ var _src_hooks_useApprovalHelpers__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @src/hooks/useApprovalHelpers */ "./src/hooks/useApprovalHelpers.ts");
/* harmony import */ var _src_hooks_useIsUsingFireblocksAccount__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @src/hooks/useIsUsingFireblocksAccount */ "./src/hooks/useIsUsingFireblocksAccount.ts");
/* harmony import */ var _SignTransaction_components_FireblocksApproval_FireblocksApprovalOverlay__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay */ "./src/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay.tsx");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @src/components/common/FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");























function ApproveAction() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_21__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_22__["default"])();
  const requestId = (0,_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_4__.useGetRequestId)();
  const {
    action,
    updateAction,
    cancelHandler
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_2__.useApproveAction)(requestId);
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_7__.useNetworkContext)();
  const isUsingLedgerWallet = (0,_src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_10__["default"])();
  const isUsingKeystoneWallet = (0,_src_hooks_useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_11__["default"])();
  const isWalletConnectAccount = (0,_src_hooks_useIsUsingWalletConnectAccount__WEBPACK_IMPORTED_MODULE_14__["default"])();
  const isFireblocksAccount = (0,_src_hooks_useIsUsingFireblocksAccount__WEBPACK_IMPORTED_MODULE_17__["default"])();
  const {
    isFunctionAvailable: isSigningAvailable
  } = (0,_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_19__.useIsFunctionAvailable)(_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_19__.FunctionNames.SIGN);
  const submitHandler = async () => {
    await updateAction({
      status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
      id: requestId
    }, isUsingLedgerWallet || isUsingKeystoneWallet || isWalletConnectAccount || isFireblocksAccount // wait for the response only for device wallets
    );
  };

  const {
    handleApproval,
    handleRejection,
    isApprovalOverlayVisible
  } = (0,_src_hooks_useApprovalHelpers__WEBPACK_IMPORTED_MODULE_16__.useApprovalHelpers)({
    onApprove: submitHandler,
    onReject: cancelHandler
  });
  (0,_SignTransaction_hooks_useLedgerDisconnectedDialog__WEBPACK_IMPORTED_MODULE_8__.useLedgerDisconnectedDialog)(() => handleRejection(), undefined, network);
  if (!action) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
      sx: {
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.CircularProgress, null));
  }
  if (!isSigningAvailable) {
    return /*#__PURE__*/React.createElement(_src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_20__.FunctionIsOffline, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_19__.FunctionNames.FEATURE,
      hidePageTitle: true
    });
  }
  const renderDeviceApproval = () => {
    if (isApprovalOverlayVisible) {
      if (isUsingLedgerWallet) return /*#__PURE__*/React.createElement(_SignTransaction_components_LedgerApprovalOverlay__WEBPACK_IMPORTED_MODULE_9__.LedgerApprovalOverlay, null);else if (isUsingKeystoneWallet) return /*#__PURE__*/React.createElement(_SignTransaction_components_KeystoneApprovalOverlay__WEBPACK_IMPORTED_MODULE_12__.KeystoneApprovalOverlay, {
        onReject: handleRejection
      });else if (isWalletConnectAccount) return /*#__PURE__*/React.createElement(_SignTransaction_components_WalletConnectApproval_WalletConnectApprovalOverlay__WEBPACK_IMPORTED_MODULE_15__.WalletConnectApprovalOverlay, {
        onSubmit: handleApproval,
        onReject: handleRejection
      });else if (isFireblocksAccount) return /*#__PURE__*/React.createElement(_SignTransaction_components_FireblocksApproval_FireblocksApprovalOverlay__WEBPACK_IMPORTED_MODULE_18__.FireblocksApprovalOverlay, {
        onSubmit: handleApproval,
        onReject: handleRejection
      });
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      width: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_SignTransaction_components_SignTxErrorBoundary__WEBPACK_IMPORTED_MODULE_5__.SignTxErrorBoundary, null, renderDeviceApproval(), {
    [_src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.AVALANCHE_BRIDGE_ASSET]: /*#__PURE__*/React.createElement(_BridgeTransferAsset__WEBPACK_IMPORTED_MODULE_6__.BridgeTransferAsset, {
      action: action
    })
  }[action.method || 'unknown'], action.error && /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_13__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_13__.ApprovalSectionHeader, {
    label: t('Error')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_13__.ApprovalSectionBody, {
    sx: {
      height: '105px',
      p: 1
    }
  }, /*#__PURE__*/React.createElement(react_custom_scrollbars_2__WEBPACK_IMPORTED_MODULE_3__["default"], {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Typography, {
    variant: "caption",
    sx: {
      color: theme.palette.error.main,
      wordBreak: 'break-all'
    }
  }, action.error))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      justifyContent: 'space-between',
      pt: 3,
      pb: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Button, {
    color: "secondary",
    "data-testid": "transaction-reject-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
    onClick: handleRejection
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Button, {
    "data-testid": "transaction-approve-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING || !!action.error,
    onClick: handleApproval
  }, t('Approve'))))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/BridgeTransferAsset.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/ApproveAction/BridgeTransferAsset.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BridgeTransferAsset": () => (/* binding */ BridgeTransferAsset)
/* harmony export */ });
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/NetworkLogo */ "./src/components/common/NetworkLogo.tsx");
/* harmony import */ var _src_components_common_TokenAmount__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/TokenAmount */ "./src/components/common/TokenAmount.tsx");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/contexts/NetworkFeeProvider */ "./src/contexts/NetworkFeeProvider.tsx");
/* harmony import */ var _src_components_common_CustomFees__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/components/common/CustomFees */ "./src/components/common/CustomFees.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
















function BridgeTransferAsset({
  action
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_14__.useTranslation)();
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_7__.useSettingsContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_10__.useAnalyticsContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_11__.useNetworkContext)();
  const {
    networkFee
  } = (0,_src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_8__.useNetworkFeeContext)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_12__.useGetRequestId)();
  const {
    updateAction
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_13__.useApproveAction)(requestId);
  const {
    displayData
  } = action;
  const [gasSettings, setGasSettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [selectedGasFee, setSelectedGasFee] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(_src_components_common_CustomFees__WEBPACK_IMPORTED_MODULE_9__.GasFeeModifier.FAST);
  const tokenPrice = displayData?.token?.priceInCurrency;
  const fiatValue = typeof tokenPrice === 'number' ? new (big_js__WEBPACK_IMPORTED_MODULE_6___default())(displayData.amountStr).times(tokenPrice) : undefined;
  const onGasSettingsChanged = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(newSettings => {
    setGasSettings(currSettings => {
      const hasNewMaxFee = typeof newSettings.maxFeePerGas !== 'undefined' && newSettings.maxFeePerGas !== currSettings.maxFeePerGas;
      const hasNewMaxTip = typeof newSettings.maxPriorityFeePerGas !== 'undefined' && newSettings.maxPriorityFeePerGas !== currSettings.maxPriorityFeePerGas;
      if (hasNewMaxFee || hasNewMaxTip) {
        updateAction({
          id: action.actionId,
          status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_0__.ActionStatus.PENDING,
          displayData: {
            gasSettings: newSettings
          }
        });
        return {
          ...currSettings,
          ...newSettings
        };
      }
      return currSettings;
    });
  }, [setGasSettings, action.actionId, updateAction]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexGrow: 1,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "h4",
    sx: {
      mt: 1.5,
      mb: 3.5
    }
  }, t('Bridge Approval')), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_2__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_2__.ApprovalSectionHeader, {
    label: t('Transaction Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_2__.ApprovalSectionBody, {
    sx: {
      py: 1,
      px: 2,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__.TxDetailsRow, {
    label: t('App')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "caption",
    sx: {
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
  }, action.site?.domain ?? '')), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__.TxDetailsRow, {
    label: t('From')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "caption"
  }, displayData.sourceNetwork?.chainName), /*#__PURE__*/React.createElement(_src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_4__.NetworkLogo, {
    src: displayData.sourceNetwork?.logoUri,
    width: "16px",
    height: "16px",
    defaultSize: 16
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__.TxDetailsRow, {
    label: t('To')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "caption"
  }, displayData.targetNetwork?.chainName), /*#__PURE__*/React.createElement(_src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_4__.NetworkLogo, {
    src: displayData.targetNetwork?.logoUri,
    width: "16px",
    height: "16px",
    defaultSize: 16
  })))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_2__.ApprovalSection, {
    sx: {
      my: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_2__.ApprovalSectionHeader, {
    label: t('Balance Change')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_2__.ApprovalSectionBody, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__.TxDetailsRow, {
    label: t('Transaction Type')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "caption"
  }, t('Bridge'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Divider, {
    sx: {
      mb: 1
    }
  }), /*#__PURE__*/React.createElement(_src_components_common_TokenAmount__WEBPACK_IMPORTED_MODULE_5__.TokenAmount, {
    token: displayData.token,
    amount: displayData.amountStr,
    fiatValue: fiatValue ? currencyFormatter(fiatValue.toNumber()) : ''
  }))), /*#__PURE__*/React.createElement(_src_components_common_CustomFees__WEBPACK_IMPORTED_MODULE_9__.CustomFees, {
    isLimitReadonly: true,
    maxFeePerGas: gasSettings.maxFeePerGas || 0n,
    limit: Number(action.displayData.gasLimit) || 0,
    onChange: settings => {
      onGasSettingsChanged({
        maxFeePerGas: settings.maxFeePerGas,
        maxPriorityFeePerGas: settings.maxPriorityFeePerGas
        // do not allow changing gasLimit via the UI
      });

      if (settings.feeType) {
        setSelectedGasFee(settings.feeType);
      }
    },
    onModifierChangeCallback: modifier => {
      if (modifier) {
        setSelectedGasFee(modifier);
      }
      capture('BridgeFeeOptionChanged', {
        modifier
      });
    },
    selectedGasFeeModifier: selectedGasFee,
    network: network,
    networkFee: networkFee
  }));
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FwcHJvdmVBY3Rpb25fQXBwcm92ZUFjdGlvbl90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWdFO0FBQ2pCO0FBRWM7QUFTdEQsTUFBTUksV0FBVyxHQUFHQSxDQUFDO0VBQUVDLEtBQUs7RUFBRUMsTUFBTTtFQUFFQztBQUE0QixDQUFDLEtBQUs7RUFDN0UsTUFBTTtJQUFFQztFQUFFLENBQUMsR0FBR04sNkRBQWMsRUFBRTs7RUFFOUI7RUFDQTtFQUNBLE1BQU1PLGdCQUFnQixHQUNwQixPQUFPRixTQUFTLEtBQUssUUFBUSxJQUFJLENBQUNBLFNBQVMsQ0FBQ0csUUFBUSxDQUFDLEtBQUssQ0FBQztFQUU3RCxvQkFDRUMsS0FBQSxDQUFBQyxhQUFBLENBQUNaLDhEQUFLO0lBQUNhLEVBQUUsRUFBRTtNQUFFQyxhQUFhLEVBQUUsS0FBSztNQUFFQyxjQUFjLEVBQUU7SUFBZ0I7RUFBRSxnQkFDbkVKLEtBQUEsQ0FBQUMsYUFBQSxDQUFDWiw4REFBSztJQUFDYSxFQUFFLEVBQUU7TUFBRUMsYUFBYSxFQUFFLEtBQUs7TUFBRUUsVUFBVSxFQUFFLFFBQVE7TUFBRUMsR0FBRyxFQUFFO0lBQUU7RUFBRSxnQkFDaEVOLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVCx1RUFBUztJQUFDZSxHQUFHLEVBQUViLEtBQUssRUFBRWM7RUFBUSxFQUFHLGVBQ2xDUixLQUFBLENBQUFDLGFBQUEsQ0FBQ1gsbUVBQVU7SUFBQ21CLE9BQU8sRUFBQyxPQUFPO0lBQUNQLEVBQUUsRUFBRTtNQUFFUSxVQUFVLEVBQUU7SUFBcUI7RUFBRSxHQUNsRWhCLEtBQUssRUFBRWlCLE1BQU0sSUFBSWQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNuQixDQUNQLGVBQ1JHLEtBQUEsQ0FBQUMsYUFBQSxDQUFDWiw4REFBSztJQUNKYSxFQUFFLEVBQUU7TUFDRlUsU0FBUyxFQUFFLEtBQUs7TUFDaEJSLGNBQWMsRUFBRVIsU0FBUyxHQUFHLGVBQWUs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QVEsQ0FBQ0MsT0FBTyxFQUFFO1FBQ3BCbEMsaUJBQWlCLENBQUNpQyxRQUFRLENBQUNDLE9BQU8sQ0FBQztNQUNyQztJQUNGLENBQUU7SUFDRkMsd0JBQXdCLEVBQUdDLFFBQW9DLElBQUs7TUFDbEUsSUFBSUEsUUFBUSxFQUFFO1FBQ1pwQyxpQkFBaUIsQ0FBQ29DLFFBQVEsQ0FBQztNQUM3QjtNQUNBMUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFO1FBQUUwQztNQUFTLENBQUMsQ0FBQztJQUNqRCxDQUFFO0lBQ0ZDLHNCQUFzQixFQUFFdEMsY0FBZTtJQUN2Q3pELE9BQU8sRUFBRUEsT0FBUTtJQUNqQnFELFVBQVUsRUFBRUE7RUFBVyxFQUN2QixDQUNJO0FBRVoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1Rva2VuQW1vdW50LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL0FwcHJvdmFsU2VjdGlvbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9UeERldGFpbHNSb3cudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQXBwcm92ZUFjdGlvbi9BcHByb3ZlQWN0aW9uLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vQnJpZGdlVHJhbnNmZXJBc3NldC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuaW1wb3J0IHsgVG9rZW5JY29uIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkljb24nO1xuaW1wb3J0IHsgVG9rZW5XaXRoQmFsYW5jZSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbnR5cGUgVG9rZW5BbW91bnRQcm9wcyA9IHtcbiAgdG9rZW46IFRva2VuV2l0aEJhbGFuY2U7XG4gIGFtb3VudDogc3RyaW5nO1xuICBmaWF0VmFsdWU/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgY29uc3QgVG9rZW5BbW91bnQgPSAoeyB0b2tlbiwgYW1vdW50LCBmaWF0VmFsdWUgfTogVG9rZW5BbW91bnRQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgLy8gRklYTUU6IE91ciBjb250cmFjdCBwYXJzZXJzIGFyZSBub3QgZ3VhcmRlZCBmcm9tIHJldHVybmluZyBOYU4gYXMgVVNEIHZhbHVlcy5cbiAgLy8gVW50aWwgdGhpcyBpcyBmaXhlZCwgd2UnbGwgcHJldmVudCBkaXNwbGF5aW5nIE5hTnMgaGVyZS5cbiAgY29uc3QgZGlzcGxheUZpYXRWYWx1ZSA9XG4gICAgdHlwZW9mIGZpYXRWYWx1ZSA9PT0gJ3N0cmluZycgJiYgIWZpYXRWYWx1ZS5pbmNsdWRlcygnTmFOJyk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XG4gICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6IDIgfX0+XG4gICAgICAgIDxUb2tlbkljb24gc3JjPXt0b2tlbj8ubG9nb1VyaX0gLz5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCIgc3g9e3sgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX0+XG4gICAgICAgICAge3Rva2VuPy5zeW1ib2wgfHwgdCgnVW5rbm93bicpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgdGV4dEFsaWduOiAnZW5kJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogZmlhdFZhbHVlID8gJ3NwYWNlLWJldHdlZW4nIDogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGNvbXBvbmVudD1cInNwYW5cIiBzeD17eyBsaW5lSGVpZ2h0OiAxIH19PlxuICAgICAgICAgIHthbW91bnR9IHt0b2tlbj8uc3ltYm9sIHx8IHQoJ1Vua25vd24gU3ltYm9sJyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAge2Rpc3BsYXlGaWF0VmFsdWUgJiYgKFxuICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JywgbGluZUhlaWdodDogMSB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtmaWF0VmFsdWV9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICApfVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIEJveCxcbiAgSW5mb0NpcmNsZUljb24sXG4gIFN0YWNrLFxuICBTdGFja1Byb3BzLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbnR5cGUgQXBwcm92YWxTZWN0aW9uSGVhZGVyUHJvcHMgPSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHRvb2x0aXA/OiBzdHJpbmc7XG4gIHRvb2x0aXBJY29uPzogUmVhY3QuUmVhY3RFbGVtZW50O1xufTtcblxuZXhwb3J0IGNvbnN0IEFwcHJvdmFsU2VjdGlvbkhlYWRlcjogUmVhY3QuRkM8QXBwcm92YWxTZWN0aW9uSGVhZGVyUHJvcHM+ID0gKHtcbiAgbGFiZWwsXG4gIHRvb2x0aXAsXG4gIHRvb2x0aXBJY29uID0gPEluZm9DaXJjbGVJY29uIC8+LFxuICBjaGlsZHJlbixcbn0pID0+IChcbiAgPFN0YWNrXG4gICAgc3g9e3tcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICB9fVxuICA+XG4gICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgIDxUeXBvZ3JhcGh5IGNvbXBvbmVudD1cImg2XCIgc3g9e3sgZm9udFdlaWdodDogNjAwIH19PlxuICAgICAgICB7bGFiZWx9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICB7dG9vbHRpcCAmJiAoXG4gICAgICAgIDxUb29sdGlwIHN4PXt7IGN1cnNvcjogJ3BvaW50ZXInLCBtbDogMSB9fSB0aXRsZT17dG9vbHRpcH0+XG4gICAgICAgICAge3Rvb2x0aXBJY29ufVxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gICAgPEJveD57Y2hpbGRyZW59PC9Cb3g+XG4gIDwvU3RhY2s+XG4pO1xuXG5leHBvcnQgY29uc3QgQXBwcm92YWxTZWN0aW9uQm9keSA9ICh7IHN4ID0ge30sIC4uLnJlc3QgfTogU3RhY2tQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2JhY2tncm91bmQucGFwZXInLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgIHA6IDIsXG4gICAgICAgIGdhcDogMSxcbiAgICAgICAgLi4uKHR5cGVvZiBzeCA9PT0gJ2Z1bmN0aW9uJyA/IHN4KHRoZW1lKSA6IHN4KSxcbiAgICAgIH19XG4gICAgICB7Li4ucmVzdH1cbiAgICAvPlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IEFwcHJvdmFsU2VjdGlvbiA9ICh7IHN4ID0ge30sIC4uLnJlc3QgfTogU3RhY2tQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGdhcDogMC41LFxuICAgICAgICAuLi4odHlwZW9mIHN4ID09PSAnZnVuY3Rpb24nID8gc3godGhlbWUpIDogc3gpLFxuICAgICAgfX1cbiAgICAgIHsuLi5yZXN0fVxuICAgIC8+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgU3RhY2ssIFR5cG9ncmFwaHksIHVzZVRoZW1lIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbnR5cGUgVHhEZXRhaWxzUm93UHJvcHMgPSB7IGxhYmVsOiBzdHJpbmcgfCBSZWFjdC5SZWFjdE5vZGUgfTtcblxuZXhwb3J0IGNvbnN0IFR4RGV0YWlsc1JvdzogUmVhY3QuRkM8VHhEZXRhaWxzUm93UHJvcHM+ID0gKHtcbiAgY2hpbGRyZW4sXG4gIGxhYmVsLFxufSkgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnYmFzZWxpbmUnLFxuICAgICAgICBnYXA6IDEsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHt0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnID8gKFxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAgICB7bGFiZWx9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICkgOiAoXG4gICAgICAgIGxhYmVsXG4gICAgICApfVxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgIG1pbkhlaWdodDogdGhlbWUuc3BhY2luZygyKSxcbiAgICAgICAgICBtaW5XaWR0aDogJzBweCcsXG4gICAgICAgICAgd29yZFdyYXA6ICdicmVhay13b3JkJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7IERBcHBQcm92aWRlclJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZEFwcENvbm5lY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7IEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyB1c2VBcHByb3ZlQWN0aW9uIH0gZnJvbSAnQHNyYy9ob29rcy91c2VBcHByb3ZlQWN0aW9uJztcbmltcG9ydCBTY3JvbGxiYXJzIGZyb20gJ3JlYWN0LWN1c3RvbS1zY3JvbGxiYXJzLTInO1xuaW1wb3J0IHsgdXNlR2V0UmVxdWVzdElkIH0gZnJvbSAnLi4vLi4vaG9va3MvdXNlR2V0UmVxdWVzdElkJztcbmltcG9ydCB7IFNpZ25UeEVycm9yQm91bmRhcnkgfSBmcm9tICcuLi9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9TaWduVHhFcnJvckJvdW5kYXJ5JztcbmltcG9ydCB7IEJyaWRnZVRyYW5zZmVyQXNzZXQgfSBmcm9tICcuL0JyaWRnZVRyYW5zZmVyQXNzZXQnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTGVkZ2VyRGlzY29ubmVjdGVkRGlhbG9nIH0gZnJvbSAnLi4vU2lnblRyYW5zYWN0aW9uL2hvb2tzL3VzZUxlZGdlckRpc2Nvbm5lY3RlZERpYWxvZyc7XG5pbXBvcnQgeyBMZWRnZXJBcHByb3ZhbE92ZXJsYXkgfSBmcm9tICcuLi9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9MZWRnZXJBcHByb3ZhbE92ZXJsYXknO1xuaW1wb3J0IHVzZUlzVXNpbmdMZWRnZXJXYWxsZXQgZnJvbSAnQHNyYy9ob29rcy91c2VJc1VzaW5nTGVkZ2VyV2FsbGV0JztcbmltcG9ydCB1c2VJc1VzaW5nS2V5c3RvbmVXYWxsZXQgZnJvbSAnQHNyYy9ob29rcy91c2VJc1VzaW5nS2V5c3RvbmVXYWxsZXQnO1xuaW1wb3J0IHsgS2V5c3RvbmVBcHByb3ZhbE92ZXJsYXkgfSBmcm9tICcuLi9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9LZXlzdG9uZUFwcHJvdmFsT3ZlcmxheSc7XG5pbXBvcnQge1xuICBDaXJjdWxhclByb2dyZXNzLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgQnV0dG9uLFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7XG4gIEFwcHJvdmFsU2VjdGlvbixcbiAgQXBwcm92YWxTZWN0aW9uQm9keSxcbiAgQXBwcm92YWxTZWN0aW9uSGVhZGVyLFxufSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL0FwcHJvdmFsU2VjdGlvbic7XG5pbXBvcnQgdXNlSXNVc2luZ1dhbGxldENvbm5lY3RBY2NvdW50IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNVc2luZ1dhbGxldENvbm5lY3RBY2NvdW50JztcbmltcG9ydCB7IFdhbGxldENvbm5lY3RBcHByb3ZhbE92ZXJsYXkgfSBmcm9tICcuLi9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9XYWxsZXRDb25uZWN0QXBwcm92YWwvV2FsbGV0Q29ubmVjdEFwcHJvdmFsT3ZlcmxheSc7XG5pbXBvcnQgeyB1c2VBcHByb3ZhbEhlbHBlcnMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUFwcHJvdmFsSGVscGVycyc7XG5pbXBvcnQgdXNlSXNVc2luZ0ZpcmVibG9ja3NBY2NvdW50IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNVc2luZ0ZpcmVibG9ja3NBY2NvdW50JztcbmltcG9ydCB7IEZpcmVibG9ja3NBcHByb3ZhbE92ZXJsYXkgfSBmcm9tICcuLi9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9GaXJlYmxvY2tzQXBwcm92YWwvRmlyZWJsb2Nrc0FwcHJvdmFsT3ZlcmxheSc7XG5pbXBvcnQge1xuICBGdW5jdGlvbk5hbWVzLFxuICB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlLFxufSBmcm9tICdAc3JjL2hvb2tzL3VzZUlzRnVuY3Rpb25BdmFpbGFibGUnO1xuaW1wb3J0IHsgRnVuY3Rpb25Jc09mZmxpbmUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0Z1bmN0aW9uSXNPZmZsaW5lJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFwcHJvdmVBY3Rpb24oKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCByZXF1ZXN0SWQgPSB1c2VHZXRSZXF1ZXN0SWQoKTtcbiAgY29uc3QgeyBhY3Rpb24sIHVwZGF0ZUFjdGlvbiwgY2FuY2VsSGFuZGxlciB9ID0gdXNlQXBwcm92ZUFjdGlvbihyZXF1ZXN0SWQpO1xuICBjb25zdCB7IG5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IGlzVXNpbmdMZWRnZXJXYWxsZXQgPSB1c2VJc1VzaW5nTGVkZ2VyV2FsbGV0KCk7XG4gIGNvbnN0IGlzVXNpbmdLZXlzdG9uZVdhbGxldCA9IHVzZUlzVXNpbmdLZXlzdG9uZVdhbGxldCgpO1xuICBjb25zdCBpc1dhbGxldENvbm5lY3RBY2NvdW50ID0gdXNlSXNVc2luZ1dhbGxldENvbm5lY3RBY2NvdW50KCk7XG4gIGNvbnN0IGlzRmlyZWJsb2Nrc0FjY291bnQgPSB1c2VJc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQoKTtcbiAgY29uc3QgeyBpc0Z1bmN0aW9uQXZhaWxhYmxlOiBpc1NpZ25pbmdBdmFpbGFibGUgfSA9IHVzZUlzRnVuY3Rpb25BdmFpbGFibGUoXG4gICAgRnVuY3Rpb25OYW1lcy5TSUdOLFxuICApO1xuXG4gIGNvbnN0IHN1Ym1pdEhhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgdXBkYXRlQWN0aW9uKFxuICAgICAge1xuICAgICAgICBzdGF0dXM6IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HLFxuICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgfSxcbiAgICAgIGlzVXNpbmdMZWRnZXJXYWxsZXQgfHxcbiAgICAgICAgaXNVc2luZ0tleXN0b25lV2FsbGV0IHx8XG4gICAgICAgIGlzV2FsbGV0Q29ubmVjdEFjY291bnQgfHxcbiAgICAgICAgaXNGaXJlYmxvY2tzQWNjb3VudCwgLy8gd2FpdCBmb3IgdGhlIHJlc3BvbnNlIG9ubHkgZm9yIGRldmljZSB3YWxsZXRzXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCB7IGhhbmRsZUFwcHJvdmFsLCBoYW5kbGVSZWplY3Rpb24sIGlzQXBwcm92YWxPdmVybGF5VmlzaWJsZSB9ID1cbiAgICB1c2VBcHByb3ZhbEhlbHBlcnMoe1xuICAgICAgb25BcHByb3ZlOiBzdWJtaXRIYW5kbGVyLFxuICAgICAgb25SZWplY3Q6IGNhbmNlbEhhbmRsZXIsXG4gICAgfSk7XG5cbiAgdXNlTGVkZ2VyRGlzY29ubmVjdGVkRGlhbG9nKCgpID0+IGhhbmRsZVJlamVjdGlvbigpLCB1bmRlZmluZWQsIG5ldHdvcmspO1xuXG4gIGlmICghYWN0aW9uKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDaXJjdWxhclByb2dyZXNzIC8+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH1cblxuICBpZiAoIWlzU2lnbmluZ0F2YWlsYWJsZSkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnVuY3Rpb25Jc09mZmxpbmUgZnVuY3Rpb25OYW1lPXtGdW5jdGlvbk5hbWVzLkZFQVRVUkV9IGhpZGVQYWdlVGl0bGUgLz5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgcmVuZGVyRGV2aWNlQXBwcm92YWwgPSAoKSA9PiB7XG4gICAgaWYgKGlzQXBwcm92YWxPdmVybGF5VmlzaWJsZSkge1xuICAgICAgaWYgKGlzVXNpbmdMZWRnZXJXYWxsZXQpIHJldHVybiA8TGVkZ2VyQXBwcm92YWxPdmVybGF5IC8+O1xuICAgICAgZWxzZSBpZiAoaXNVc2luZ0tleXN0b25lV2FsbGV0KVxuICAgICAgICByZXR1cm4gPEtleXN0b25lQXBwcm92YWxPdmVybGF5IG9uUmVqZWN0PXtoYW5kbGVSZWplY3Rpb259IC8+O1xuICAgICAgZWxzZSBpZiAoaXNXYWxsZXRDb25uZWN0QWNjb3VudClcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8V2FsbGV0Q29ubmVjdEFwcHJvdmFsT3ZlcmxheVxuICAgICAgICAgICAgb25TdWJtaXQ9e2hhbmRsZUFwcHJvdmFsfVxuICAgICAgICAgICAgb25SZWplY3Q9e2hhbmRsZVJlamVjdGlvbn1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgZWxzZSBpZiAoaXNGaXJlYmxvY2tzQWNjb3VudClcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8RmlyZWJsb2Nrc0FwcHJvdmFsT3ZlcmxheVxuICAgICAgICAgICAgb25TdWJtaXQ9e2hhbmRsZUFwcHJvdmFsfVxuICAgICAgICAgICAgb25SZWplY3Q9e2hhbmRsZVJlamVjdGlvbn1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIHB4OiAyIH19PlxuICAgICAgICA8U2lnblR4RXJyb3JCb3VuZGFyeT5cbiAgICAgICAgICB7cmVuZGVyRGV2aWNlQXBwcm92YWwoKX1cblxuICAgICAgICAgIHsvKiBBY3Rpb25zICAqL31cbiAgICAgICAgICB7XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFtEQXBwUHJvdmlkZXJSZXF1ZXN0LkFWQUxBTkNIRV9CUklER0VfQVNTRVRdOiAoXG4gICAgICAgICAgICAgICAgPEJyaWRnZVRyYW5zZmVyQXNzZXQgYWN0aW9uPXthY3Rpb259IC8+XG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICB9W2FjdGlvbi5tZXRob2QgfHwgJ3Vua25vd24nXVxuICAgICAgICAgIH1cbiAgICAgICAgICB7YWN0aW9uLmVycm9yICYmIChcbiAgICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ0Vycm9yJyl9PjwvQXBwcm92YWxTZWN0aW9uSGVhZGVyPlxuICAgICAgICAgICAgICA8QXBwcm92YWxTZWN0aW9uQm9keSBzeD17eyBoZWlnaHQ6ICcxMDVweCcsIHA6IDEgfX0+XG4gICAgICAgICAgICAgICAgPFNjcm9sbGJhcnNcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZsZXhHcm93OiAxLCBtYXhIZWlnaHQ6ICd1bnNldCcsIGhlaWdodDogJzEwMCUnIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoZW1lLnBhbGV0dGUuZXJyb3IubWFpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRCcmVhazogJ2JyZWFrLWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHthY3Rpb24uZXJyb3J9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPC9TY3JvbGxiYXJzPlxuICAgICAgICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgey8qIEFjdGlvbiBCdXR0b25zICovfVxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgIHB0OiAzLFxuICAgICAgICAgICAgICBwYjogMSxcbiAgICAgICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmFuc2FjdGlvbi1yZWplY3QtYnRuXCJcbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgIGRpc2FibGVkPXthY3Rpb24uc3RhdHVzID09PSBBY3Rpb25TdGF0dXMuU1VCTUlUVElOR31cbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUmVqZWN0aW9ufVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnUmVqZWN0Jyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmFuc2FjdGlvbi1hcHByb3ZlLWJ0blwiXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICBkaXNhYmxlZD17XG4gICAgICAgICAgICAgICAgYWN0aW9uLnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcgfHwgISFhY3Rpb24uZXJyb3JcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVBcHByb3ZhbH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ0FwcHJvdmUnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU2lnblR4RXJyb3JCb3VuZGFyeT5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBBY3Rpb24sIEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgU3RhY2ssIFR5cG9ncmFwaHksIERpdmlkZXIgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcbmltcG9ydCB7IE5ldHdvcmtMb2dvIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9OZXR3b3JrTG9nbyc7XG5pbXBvcnQgeyBUb2tlbkFtb3VudCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vVG9rZW5BbW91bnQnO1xuaW1wb3J0IEJpZyBmcm9tICdiaWcuanMnO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU5ldHdvcmtGZWVDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrRmVlUHJvdmlkZXInO1xuaW1wb3J0IHsgQ3VzdG9tRmVlcywgR2FzRmVlTW9kaWZpZXIgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0N1c3RvbUZlZXMnO1xuaW1wb3J0IHtcbiAgQnJpZGdlQWN0aW9uRGlzcGxheURhdGEsXG4gIEN1c3RvbUdhc1NldHRpbmdzLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYnJpZGdlL21vZGVscyc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUdldFJlcXVlc3RJZCB9IGZyb20gJ0BzcmMvaG9va3MvdXNlR2V0UmVxdWVzdElkJztcbmltcG9ydCB7IHVzZUFwcHJvdmVBY3Rpb24gfSBmcm9tICdAc3JjL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gQnJpZGdlVHJhbnNmZXJBc3NldCh7XG4gIGFjdGlvbixcbn06IHtcbiAgYWN0aW9uOiBBY3Rpb248QnJpZGdlQWN0aW9uRGlzcGxheURhdGE+O1xufSkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY3VycmVuY3lGb3JtYXR0ZXIgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCB7IG5ldHdvcmtGZWUgfSA9IHVzZU5ldHdvcmtGZWVDb250ZXh0KCk7XG4gIGNvbnN0IHJlcXVlc3RJZCA9IHVzZUdldFJlcXVlc3RJZCgpO1xuICBjb25zdCB7IHVwZGF0ZUFjdGlvbiB9ID0gdXNlQXBwcm92ZUFjdGlvbihyZXF1ZXN0SWQpO1xuICBjb25zdCB7IGRpc3BsYXlEYXRhIH0gPSBhY3Rpb247XG4gIGNvbnN0IFtnYXNTZXR0aW5ncywgc2V0R2FzU2V0dGluZ3NdID0gdXNlU3RhdGU8Q3VzdG9tR2FzU2V0dGluZ3M+KHt9KTtcbiAgY29uc3QgW3NlbGVjdGVkR2FzRmVlLCBzZXRTZWxlY3RlZEdhc0ZlZV0gPSB1c2VTdGF0ZTxHYXNGZWVNb2RpZmllcj4oXG4gICAgR2FzRmVlTW9kaWZpZXIuRkFTVCxcbiAgKTtcblxuICBjb25zdCB0b2tlblByaWNlID0gZGlzcGxheURhdGE/LnRva2VuPy5wcmljZUluQ3VycmVuY3k7XG4gIGNvbnN0IGZpYXRWYWx1ZTogQmlnIHwgdW5kZWZpbmVkID1cbiAgICB0eXBlb2YgdG9rZW5QcmljZSA9PT0gJ251bWJlcidcbiAgICAgID8gbmV3IEJpZyhkaXNwbGF5RGF0YS5hbW91bnRTdHIpLnRpbWVzKHRva2VuUHJpY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICBjb25zdCBvbkdhc1NldHRpbmdzQ2hhbmdlZCA9IHVzZUNhbGxiYWNrKFxuICAgIChuZXdTZXR0aW5nczogQ3VzdG9tR2FzU2V0dGluZ3MpID0+IHtcbiAgICAgIHNldEdhc1NldHRpbmdzKChjdXJyU2V0dGluZ3MpID0+IHtcbiAgICAgICAgY29uc3QgaGFzTmV3TWF4RmVlID1cbiAgICAgICAgICB0eXBlb2YgbmV3U2V0dGluZ3MubWF4RmVlUGVyR2FzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgIG5ld1NldHRpbmdzLm1heEZlZVBlckdhcyAhPT0gY3VyclNldHRpbmdzLm1heEZlZVBlckdhcztcblxuICAgICAgICBjb25zdCBoYXNOZXdNYXhUaXAgPVxuICAgICAgICAgIHR5cGVvZiBuZXdTZXR0aW5ncy5tYXhQcmlvcml0eUZlZVBlckdhcyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICBuZXdTZXR0aW5ncy5tYXhQcmlvcml0eUZlZVBlckdhcyAhPT1cbiAgICAgICAgICAgIGN1cnJTZXR0aW5ncy5tYXhQcmlvcml0eUZlZVBlckdhcztcblxuICAgICAgICBpZiAoaGFzTmV3TWF4RmVlIHx8IGhhc05ld01heFRpcCkge1xuICAgICAgICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICAgICAgICBpZDogYWN0aW9uLmFjdGlvbklkLFxuICAgICAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuUEVORElORyxcbiAgICAgICAgICAgIGRpc3BsYXlEYXRhOiB7XG4gICAgICAgICAgICAgIGdhc1NldHRpbmdzOiBuZXdTZXR0aW5ncyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uY3VyclNldHRpbmdzLFxuICAgICAgICAgICAgLi4ubmV3U2V0dGluZ3MsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJyU2V0dGluZ3M7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFtzZXRHYXNTZXR0aW5ncywgYWN0aW9uLmFjdGlvbklkLCB1cGRhdGVBY3Rpb25dLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGZsZXhHcm93OiAxLCB3aWR0aDogMSB9fT5cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiIHN4PXt7IG10OiAxLjUsIG1iOiAzLjUgfX0+XG4gICAgICAgIHt0KCdCcmlkZ2UgQXBwcm92YWwnKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXJcbiAgICAgICAgICBsYWJlbD17dCgnVHJhbnNhY3Rpb24gRGV0YWlscycpfVxuICAgICAgICA+PC9BcHByb3ZhbFNlY3Rpb25IZWFkZXI+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IHB5OiAxLCBweDogMiwgZ2FwOiAxIH19PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0FwcCcpfT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgc3g9e3sgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2FjdGlvbi5zaXRlPy5kb21haW4gPz8gJyd9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnRnJvbScpfT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICAgIHtkaXNwbGF5RGF0YS5zb3VyY2VOZXR3b3JrPy5jaGFpbk5hbWV9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8TmV0d29ya0xvZ29cbiAgICAgICAgICAgICAgc3JjPXtkaXNwbGF5RGF0YS5zb3VyY2VOZXR3b3JrPy5sb2dvVXJpfVxuICAgICAgICAgICAgICB3aWR0aD1cIjE2cHhcIlxuICAgICAgICAgICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgICAgICAgICAgZGVmYXVsdFNpemU9ezE2fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdUbycpfT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICAgIHtkaXNwbGF5RGF0YS50YXJnZXROZXR3b3JrPy5jaGFpbk5hbWV9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8TmV0d29ya0xvZ29cbiAgICAgICAgICAgICAgc3JjPXtkaXNwbGF5RGF0YS50YXJnZXROZXR3b3JrPy5sb2dvVXJpfVxuICAgICAgICAgICAgICB3aWR0aD1cIjE2cHhcIlxuICAgICAgICAgICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgICAgICAgICAgZGVmYXVsdFNpemU9ezE2fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgICA8QXBwcm92YWxTZWN0aW9uIHN4PXt7IG15OiAyIH19PlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyXG4gICAgICAgICAgbGFiZWw9e3QoJ0JhbGFuY2UgQ2hhbmdlJyl9XG4gICAgICAgID48L0FwcHJvdmFsU2VjdGlvbkhlYWRlcj5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHkgc3g9e3sgcDogMiB9fT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdUcmFuc2FjdGlvbiBUeXBlJyl9PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj57dCgnQnJpZGdlJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICAgIDxEaXZpZGVyIHN4PXt7IG1iOiAxIH19IC8+XG4gICAgICAgICAgPFRva2VuQW1vdW50XG4gICAgICAgICAgICB0b2tlbj17ZGlzcGxheURhdGEudG9rZW59XG4gICAgICAgICAgICBhbW91bnQ9e2Rpc3BsYXlEYXRhLmFtb3VudFN0cn1cbiAgICAgICAgICAgIGZpYXRWYWx1ZT17ZmlhdFZhbHVlID8gY3VycmVuY3lGb3JtYXR0ZXIoZmlhdFZhbHVlLnRvTnVtYmVyKCkpIDogJyd9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG5cbiAgICAgIDxDdXN0b21GZWVzXG4gICAgICAgIGlzTGltaXRSZWFkb25seVxuICAgICAgICBtYXhGZWVQZXJHYXM9e2dhc1NldHRpbmdzLm1heEZlZVBlckdhcyB8fCAwbn1cbiAgICAgICAgbGltaXQ9e051bWJlcihhY3Rpb24uZGlzcGxheURhdGEuZ2FzTGltaXQpIHx8IDB9XG4gICAgICAgIG9uQ2hhbmdlPXsoc2V0dGluZ3MpID0+IHtcbiAgICAgICAgICBvbkdhc1NldHRpbmdzQ2hhbmdlZCh7XG4gICAgICAgICAgICBtYXhGZWVQZXJHYXM6IHNldHRpbmdzLm1heEZlZVBlckdhcyxcbiAgICAgICAgICAgIG1heFByaW9yaXR5RmVlUGVyR2FzOiBzZXR0aW5ncy5tYXhQcmlvcml0eUZlZVBlckdhcyxcbiAgICAgICAgICAgIC8vIGRvIG5vdCBhbGxvdyBjaGFuZ2luZyBnYXNMaW1pdCB2aWEgdGhlIFVJXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoc2V0dGluZ3MuZmVlVHlwZSkge1xuICAgICAgICAgICAgc2V0U2VsZWN0ZWRHYXNGZWUoc2V0dGluZ3MuZmVlVHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgICBvbk1vZGlmaWVyQ2hhbmdlQ2FsbGJhY2s9eyhtb2RpZmllcjogR2FzRmVlTW9kaWZpZXIgfCB1bmRlZmluZWQpID0+IHtcbiAgICAgICAgICBpZiAobW9kaWZpZXIpIHtcbiAgICAgICAgICAgIHNldFNlbGVjdGVkR2FzRmVlKG1vZGlmaWVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FwdHVyZSgnQnJpZGdlRmVlT3B0aW9uQ2hhbmdlZCcsIHsgbW9kaWZpZXIgfSk7XG4gICAgICAgIH19XG4gICAgICAgIHNlbGVjdGVkR2FzRmVlTW9kaWZpZXI9e3NlbGVjdGVkR2FzRmVlfVxuICAgICAgICBuZXR3b3JrPXtuZXR3b3JrfVxuICAgICAgICBuZXR3b3JrRmVlPXtuZXR3b3JrRmVlfVxuICAgICAgLz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlN0YWNrIiwiVHlwb2dyYXBoeSIsInVzZVRyYW5zbGF0aW9uIiwiVG9rZW5JY29uIiwiVG9rZW5BbW91bnQiLCJ0b2tlbiIsImFtb3VudCIsImZpYXRWYWx1ZSIsInQiLCJkaXNwbGF5RmlhdFZhbHVlIiwiaW5jbHVkZXMiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzeCIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJnYXAiLCJzcmMiLCJsb2dvVXJpIiwidmFyaWFudCIsImZvbnRXZWlnaHQiLCJzeW1ib2wiLCJ0ZXh0QWxpZ24iLCJjb21wb25lbnQiLCJsaW5lSGVpZ2h0IiwiY29sb3IiLCJCb3giLCJJbmZvQ2lyY2xlSWNvbiIsIlRvb2x0aXAiLCJ1c2VUaGVtZSIsIkFwcHJvdmFsU2VjdGlvbkhlYWRlciIsImxhYmVsIiwidG9vbHRpcCIsInRvb2x0aXBJY29uIiwiY2hpbGRyZW4iLCJ3aWR0aCIsImN1cnNvciIsIm1sIiwidGl0bGUiLCJBcHByb3ZhbFNlY3Rpb25Cb2R5IiwicmVzdCIsInRoZW1lIiwiX2V4dGVuZHMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJwIiwiQXBwcm92YWxTZWN0aW9uIiwiVHhEZXRhaWxzUm93IiwibWluSGVpZ2h0Iiwic3BhY2luZyIsIm1pbldpZHRoIiwid29yZFdyYXAiLCJEQXBwUHJvdmlkZXJSZXF1ZXN0IiwiQWN0aW9uU3RhdHVzIiwidXNlQXBwcm92ZUFjdGlvbiIsIlNjcm9sbGJhcnMiLCJ1c2VHZXRSZXF1ZXN0SWQiLCJTaWduVHhFcnJvckJvdW5kYXJ5IiwiQnJpZGdlVHJhbnNmZXJBc3NldCIsInVzZU5ldHdvcmtDb250ZXh0IiwidXNlTGVkZ2VyRGlzY29ubmVjdGVkRGlhbG9nIiwiTGVkZ2VyQXBwcm92YWxPdmVybGF5IiwidXNlSXNVc2luZ0xlZGdlcldhbGxldCIsInVzZUlzVXNpbmdLZXlzdG9uZVdhbGxldCIsIktleXN0b25lQXBwcm92YWxPdmVybGF5IiwiQ2lyY3VsYXJQcm9ncmVzcyIsIkJ1dHRvbiIsInVzZUlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCIsIldhbGxldENvbm5lY3RBcHByb3ZhbE92ZXJsYXkiLCJ1c2VBcHByb3ZhbEhlbHBlcnMiLCJ1c2VJc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQiLCJGaXJlYmxvY2tzQXBwcm92YWxPdmVybGF5IiwiRnVuY3Rpb25OYW1lcyIsInVzZUlzRnVuY3Rpb25BdmFpbGFibGUiLCJGdW5jdGlvbklzT2ZmbGluZSIsIkFwcHJvdmVBY3Rpb24iLCJyZXF1ZXN0SWQiLCJhY3Rpb24iLCJ1cGRhdGVBY3Rpb24iLCJjYW5jZWxIYW5kbGVyIiwibmV0d29yayIsImlzVXNpbmdMZWRnZXJXYWxsZXQiLCJpc1VzaW5nS2V5c3RvbmVXYWxsZXQiLCJpc1dhbGxldENvbm5lY3RBY2NvdW50IiwiaXNGaXJlYmxvY2tzQWNjb3VudCIsImlzRnVuY3Rpb25BdmFpbGFibGUiLCJpc1NpZ25pbmdBdmFpbGFibGUiLCJTSUdOIiwic3VibWl0SGFuZGxlciIsInN0YXR1cyIsIlNVQk1JVFRJTkciLCJpZCIsImhhbmRsZUFwcHJvdmFsIiwiaGFuZGxlUmVqZWN0aW9uIiwiaXNBcHByb3ZhbE92ZXJsYXlWaXNpYmxlIiwib25BcHByb3ZlIiwib25SZWplY3QiLCJ1bmRlZmluZWQiLCJoZWlnaHQiLCJmdW5jdGlvbk5hbWUiLCJGRUFUVVJFIiwiaGlkZVBhZ2VUaXRsZSIsInJlbmRlckRldmljZUFwcHJvdmFsIiwib25TdWJtaXQiLCJGcmFnbWVudCIsInB4IiwiQVZBTEFOQ0hFX0JSSURHRV9BU1NFVCIsIm1ldGhvZCIsImVycm9yIiwic3R5bGUiLCJmbGV4R3JvdyIsIm1heEhlaWdodCIsInBhbGV0dGUiLCJtYWluIiwid29yZEJyZWFrIiwicHQiLCJwYiIsInNpemUiLCJmdWxsV2lkdGgiLCJkaXNhYmxlZCIsIm9uQ2xpY2siLCJ1c2VDYWxsYmFjayIsInVzZVN0YXRlIiwiRGl2aWRlciIsIk5ldHdvcmtMb2dvIiwiQmlnIiwidXNlU2V0dGluZ3NDb250ZXh0IiwidXNlTmV0d29ya0ZlZUNvbnRleHQiLCJDdXN0b21GZWVzIiwiR2FzRmVlTW9kaWZpZXIiLCJ1c2VBbmFseXRpY3NDb250ZXh0IiwiY3VycmVuY3lGb3JtYXR0ZXIiLCJjYXB0dXJlIiwibmV0d29ya0ZlZSIsImRpc3BsYXlEYXRhIiwiZ2FzU2V0dGluZ3MiLCJzZXRHYXNTZXR0aW5ncyIsInNlbGVjdGVkR2FzRmVlIiwic2V0U2VsZWN0ZWRHYXNGZWUiLCJGQVNUIiwidG9rZW5QcmljZSIsInByaWNlSW5DdXJyZW5jeSIsImFtb3VudFN0ciIsInRpbWVzIiwib25HYXNTZXR0aW5nc0NoYW5nZWQiLCJuZXdTZXR0aW5ncyIsImN1cnJTZXR0aW5ncyIsImhhc05ld01heEZlZSIsIm1heEZlZVBlckdhcyIsImhhc05ld01heFRpcCIsIm1heFByaW9yaXR5RmVlUGVyR2FzIiwiYWN0aW9uSWQiLCJQRU5ESU5HIiwibXQiLCJtYiIsInB5IiwidGV4dE92ZXJmbG93Iiwib3ZlcmZsb3ciLCJzaXRlIiwiZG9tYWluIiwic291cmNlTmV0d29yayIsImNoYWluTmFtZSIsImRlZmF1bHRTaXplIiwidGFyZ2V0TmV0d29yayIsIm15IiwidG9OdW1iZXIiLCJpc0xpbWl0UmVhZG9ubHkiLCJsaW1pdCIsIk51bWJlciIsImdhc0xpbWl0Iiwib25DaGFuZ2UiLCJzZXR0aW5ncyIsImZlZVR5cGUiLCJvbk1vZGlmaWVyQ2hhbmdlQ2FsbGJhY2siLCJtb2RpZmllciIsInNlbGVjdGVkR2FzRmVlTW9kaWZpZXIiXSwic291cmNlUm9vdCI6IiJ9