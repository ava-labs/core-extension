"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_SignMessage_SignMessage_tsx"],{

/***/ "./src/background/services/messages/models.ts":
/*!****************************************************!*\
  !*** ./src/background/services/messages/models.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MessageType": () => (/* binding */ MessageType)
/* harmony export */ });
/* harmony import */ var _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/connections/dAppConnection/models */ "./src/background/connections/dAppConnection/models.ts");

let MessageType = function (MessageType) {
  MessageType[MessageType["SIGN_TYPED_DATA_V1"] = _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN_TYPED_DATA_V1] = "SIGN_TYPED_DATA_V1";
  MessageType[MessageType["SIGN_TYPED_DATA_V3"] = _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3] = "SIGN_TYPED_DATA_V3";
  MessageType[MessageType["SIGN_TYPED_DATA_V4"] = _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4] = "SIGN_TYPED_DATA_V4";
  MessageType[MessageType["SIGN_TYPED_DATA"] = _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN_TYPED_DATA] = "SIGN_TYPED_DATA";
  MessageType[MessageType["PERSONAL_SIGN"] = _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.PERSONAL_SIGN] = "PERSONAL_SIGN";
  MessageType[MessageType["ETH_SIGN"] = _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.ETH_SIGN] = "ETH_SIGN";
  MessageType[MessageType["AVALANCHE_SIGN"] = _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_0__.DAppProviderRequest.AVALANCHE_SIGN_MESSAGE] = "AVALANCHE_SIGN";
  return MessageType;
}({});

/***/ }),

/***/ "./src/components/common/MaliciousTxAlert.tsx":
/*!****************************************************!*\
  !*** ./src/components/common/MaliciousTxAlert.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MaliciousTxAlert": () => (/* binding */ MaliciousTxAlert)
/* harmony export */ });
/* harmony import */ var _src_pages_Permissions_components_AlertDialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Permissions/components/AlertDialog */ "./src/pages/Permissions/components/AlertDialog.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function MaliciousTxAlert({
  showAlert,
  title,
  description,
  cancelHandler,
  actionTitles
}) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  return /*#__PURE__*/React.createElement(React.Fragment, null, showAlert && /*#__PURE__*/React.createElement(_src_pages_Permissions_components_AlertDialog__WEBPACK_IMPORTED_MODULE_0__.AlertDialog, {
    open: isAlertDialogOpen,
    cancelHandler: cancelHandler,
    onClose: () => setIsAlertDialogOpen(false),
    title: title || t('Scam Transaction'),
    text: description || t('This transaction is malicious do not proceed.'),
    proceedLabel: actionTitles?.proceed || t('Proceed Anyway'),
    rejectLabel: actionTitles?.reject || t('Reject Transaction')
  }));
}

/***/ }),

/***/ "./src/components/common/SiteAvatar.tsx":
/*!**********************************************!*\
  !*** ./src/components/common/SiteAvatar.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SiteAvatar": () => (/* binding */ SiteAvatar)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");

const SiteAvatar = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack)`
  width: 80px;
  height: 80px;
  background-color: ${({
  theme
}) => theme.palette.background.paper};
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: ${({
  margin
}) => margin ?? '8px 0'};
`;

/***/ }),

/***/ "./src/components/common/TxWarningBox.tsx":
/*!************************************************!*\
  !*** ./src/components/common/TxWarningBox.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TxWarningBox": () => (/* binding */ TxWarningBox)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_pages_Permissions_components_AlertBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Permissions/components/AlertBox */ "./src/pages/Permissions/components/AlertBox.tsx");
/* harmony import */ var _src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/pages/Permissions/components/WarningBox */ "./src/pages/Permissions/components/WarningBox.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function TxWarningBox({
  isMalicious,
  isSuspicious
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  return /*#__PURE__*/React.createElement(React.Fragment, null, isMalicious && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Box, {
    sx: {
      mb: 3
    }
  }, /*#__PURE__*/React.createElement(_src_pages_Permissions_components_AlertBox__WEBPACK_IMPORTED_MODULE_0__.AlertBox, {
    title: t('Scam Transaction'),
    text: t('This transaction is malicious do not proceed.')
  })), isSuspicious && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Box, {
    sx: {
      mb: 3
    }
  }, /*#__PURE__*/React.createElement(_src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_1__.WarningBox, {
    title: t('Suspicious Transaction'),
    text: t('Use caution, this transaction may be malicious.')
  })));
}

/***/ }),

/***/ "./src/pages/Permissions/components/AlertBox.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/Permissions/components/AlertBox.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AlertBox": () => (/* binding */ AlertBox)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function AlertBox({
  title,
  text
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Alert, {
    severity: "error",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.RemoveModeratorIcon, {
      size: 24,
      color: theme.palette.common.black
    }),
    sx: {
      backgroundColor: 'error.light',
      borderColor: 'transparent',
      px: 2,
      color: 'common.black',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AlertContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      fontWeight: 600,
      display: 'block'
    }
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      display: 'block'
    }
  }, text)));
}

/***/ }),

/***/ "./src/pages/Permissions/components/AlertDialog.tsx":
/*!**********************************************************!*\
  !*** ./src/pages/Permissions/components/AlertDialog.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AlertDialog": () => (/* binding */ AlertDialog)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function AlertDialog({
  cancelHandler,
  open,
  onClose,
  title,
  text,
  rejectLabel,
  proceedLabel
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Dialog, {
    open: open,
    showCloseIcon: true,
    onClose: onClose,
    PaperProps: {
      sx: {
        m: 2,
        width: 1,
        height: 1,
        maxWidth: 'none',
        position: 'relative'
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      py: 3,
      px: 5,
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '225px',
      gap: 1.5,
      py: 14
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.RemoveModeratorIcon, {
    size: 48,
    color: theme.customPalette.avalancheRed
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    sx: {
      color: theme.customPalette.avalancheRed,
      px: 2
    },
    variant: "h4"
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2"
  }, text)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      alignItems: 'center',
      width: '100%',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    color: "primary",
    "data-testid": "connect-reject-btn",
    onClick: () => {
      cancelHandler();
    },
    fullWidth: true,
    size: "large"
  }, rejectLabel), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    "data-testid": "connect-approve-btn",
    onClick: onClose,
    fullWidth: true,
    size: "large",
    color: "secondary"
  }, proceedLabel))));
}

/***/ }),

/***/ "./src/pages/Permissions/components/WarningBox.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/Permissions/components/WarningBox.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WarningBox": () => (/* binding */ WarningBox)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function WarningBox({
  title,
  text
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Alert, {
    severity: "warning",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.GppMaybeIcon, {
      size: 24,
      color: theme.palette.common.black
    }),
    sx: {
      backgroundColor: 'warning.light',
      borderColor: 'transparent',
      px: 2,
      color: 'common.black',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AlertContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      fontWeight: 600,
      display: 'block'
    }
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      display: 'block'
    }
  }, text)));
}

/***/ }),

/***/ "./src/pages/SignMessage/SignMessage.tsx":
/*!***********************************************!*\
  !*** ./src/pages/SignMessage/SignMessage.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SignMessage": () => (/* binding */ SignMessage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_background_services_messages_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/messages/models */ "./src/background/services/messages/models.ts");
/* harmony import */ var _src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/SiteAvatar */ "./src/components/common/SiteAvatar.tsx");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/hooks/useIsUsingLedgerWallet */ "./src/hooks/useIsUsingLedgerWallet.ts");
/* harmony import */ var _components_EthSign__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/EthSign */ "./src/pages/SignMessage/components/EthSign.tsx");
/* harmony import */ var _components_PersonalSign__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/PersonalSign */ "./src/pages/SignMessage/components/PersonalSign.tsx");
/* harmony import */ var _components_SignData__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/SignData */ "./src/pages/SignMessage/components/SignData.tsx");
/* harmony import */ var _components_SignDataV3__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/SignDataV3 */ "./src/pages/SignMessage/components/SignDataV3.tsx");
/* harmony import */ var _components_SignDataV4__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/SignDataV4 */ "./src/pages/SignMessage/components/SignDataV4.tsx");
/* harmony import */ var _SignTransaction_components_SignTxErrorBoundary__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../SignTransaction/components/SignTxErrorBoundary */ "./src/pages/SignTransaction/components/SignTxErrorBoundary.tsx");
/* harmony import */ var _hooks_useIsIntersecting__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./hooks/useIsIntersecting */ "./src/pages/SignMessage/hooks/useIsIntersecting.ts");
/* harmony import */ var _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @src/background/connections/dAppConnection/models */ "./src/background/connections/dAppConnection/models.ts");
/* harmony import */ var _src_pages_SignTransaction_hooks_useLedgerDisconnectedDialog__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog */ "./src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog.tsx");
/* harmony import */ var _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @src/contexts/LedgerProvider */ "./src/contexts/LedgerProvider.tsx");
/* harmony import */ var _src_pages_SignTransaction_components_LedgerApprovalOverlay__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @src/pages/SignTransaction/components/LedgerApprovalOverlay */ "./src/pages/SignTransaction/components/LedgerApprovalOverlay.tsx");
/* harmony import */ var _SignTransaction_components_WalletConnectApproval_WalletConnectApprovalOverlay__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay */ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay.tsx");
/* harmony import */ var _src_hooks_useIsUsingWalletConnectAccount__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @src/hooks/useIsUsingWalletConnectAccount */ "./src/hooks/useIsUsingWalletConnectAccount.ts");
/* harmony import */ var _src_hooks_useApprovalHelpers__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @src/hooks/useApprovalHelpers */ "./src/hooks/useApprovalHelpers.ts");
/* harmony import */ var _src_hooks_useIsUsingFireblocksAccount__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @src/hooks/useIsUsingFireblocksAccount */ "./src/hooks/useIsUsingFireblocksAccount.ts");
/* harmony import */ var _SignTransaction_components_FireblocksApproval_FireblocksApprovalOverlay__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay */ "./src/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay.tsx");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @src/components/common/FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* harmony import */ var _src_components_common_MaliciousTxAlert__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @src/components/common/MaliciousTxAlert */ "./src/components/common/MaliciousTxAlert.tsx");
/* harmony import */ var _src_components_common_TxWarningBox__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @src/components/common/TxWarningBox */ "./src/components/common/TxWarningBox.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

































function SignMessage() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_31__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_5__.useGetRequestId)();
  const {
    action,
    updateAction: updateMessage,
    cancelHandler
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_6__.useApproveAction)(requestId);
  const isUsingLedgerWallet = (0,_src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const isUsingWalletConnectAccount = (0,_src_hooks_useIsUsingWalletConnectAccount__WEBPACK_IMPORTED_MODULE_20__["default"])();
  const isFireblocksAccount = (0,_src_hooks_useIsUsingFireblocksAccount__WEBPACK_IMPORTED_MODULE_22__["default"])();
  const {
    isFunctionAvailable: isSigningAvailable
  } = (0,_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_24__.useIsFunctionAvailable)(_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_24__.FunctionNames.SIGN);
  const {
    accounts: {
      active: activeAccount,
      primary: primaryAccounts
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_26__.useAccountsContext)();
  const [disableSubmitButton, setDisableSubmitButton] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [messageAlertClosed, setMessageAlertClosed] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const endContentRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const isIntersecting = (0,_hooks_useIsIntersecting__WEBPACK_IMPORTED_MODULE_14__.useIsIntersecting)({
    ref: endContentRef
  });
  const signingAccountAddress = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!action || !activeAccount) {
      return;
    }
    const accountIndex = action.displayData.messageParams.accountIndex;
    if (accountIndex === undefined || activeAccount.type !== _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_27__.AccountType.PRIMARY) {
      return action.method === _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_15__.DAppProviderRequest.AVALANCHE_SIGN_MESSAGE ? activeAccount.addressAVM?.slice(2) : activeAccount.addressC;
    }
    const accountToUse = primaryAccounts[activeAccount.walletId]?.find(account => account.index === accountIndex);
    return action.method === _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_15__.DAppProviderRequest.AVALANCHE_SIGN_MESSAGE ? accountToUse?.addressAVM?.slice(2) : accountToUse?.addressC;
  }, [action, activeAccount, primaryAccounts]);
  const signMessage = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    await updateMessage({
      status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
      id: requestId
    }, isUsingLedgerWallet || isUsingWalletConnectAccount || isFireblocksAccount // wait for the response only for device wallets
    );
  }, [updateMessage, requestId, isUsingWalletConnectAccount, isFireblocksAccount, isUsingLedgerWallet]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isIntersecting) {
      viewCompleteHandler();
    }
  }, [isIntersecting]);
  function viewCompleteHandler() {
    setDisableSubmitButton(false);
  }
  function updateHandler(values) {
    // when these 2 values are the same, the content fit in the view without scroller
    if (values.scrollHeight === values.clientHeight) {
      setDisableSubmitButton(false);
    }
  }
  const {
    handleApproval,
    handleRejection,
    isApprovalOverlayVisible
  } = (0,_src_hooks_useApprovalHelpers__WEBPACK_IMPORTED_MODULE_21__.useApprovalHelpers)({
    onApprove: signMessage,
    onReject: cancelHandler
  });
  const renderDeviceApproval = () => {
    if (isApprovalOverlayVisible) {
      if (isUsingWalletConnectAccount) {
        return /*#__PURE__*/React.createElement(_SignTransaction_components_WalletConnectApproval_WalletConnectApprovalOverlay__WEBPACK_IMPORTED_MODULE_19__.WalletConnectApprovalOverlay, {
          onReject: handleRejection,
          onSubmit: handleApproval
        });
      } else if (isFireblocksAccount) {
        return /*#__PURE__*/React.createElement(_SignTransaction_components_FireblocksApproval_FireblocksApprovalOverlay__WEBPACK_IMPORTED_MODULE_23__.FireblocksApprovalOverlay, {
          onReject: handleRejection,
          onSubmit: handleApproval
        });
      }
    }
    if (isUsingLedgerWallet && action?.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING) {
      return /*#__PURE__*/React.createElement(_src_pages_SignTransaction_components_LedgerApprovalOverlay__WEBPACK_IMPORTED_MODULE_18__.LedgerApprovalOverlay, null);
    }
    return null;
  };
  (0,_src_pages_SignTransaction_hooks_useLedgerDisconnectedDialog__WEBPACK_IMPORTED_MODULE_16__.useLedgerDisconnectedDialog)(() => handleRejection(), action?.method === _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_15__.DAppProviderRequest.AVALANCHE_SIGN_MESSAGE ? _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_17__.LedgerAppType.AVALANCHE : _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_17__.LedgerAppType.ETHEREUM);
  if (!action) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
      direction: "row",
      sx: {
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.CircularProgress, {
      size: 60
    }));
  }
  if (!isSigningAvailable) {
    return /*#__PURE__*/React.createElement(_src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_25__.FunctionIsOffline, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_24__.FunctionNames.FEATURE,
      hidePageTitle: true
    });
  }
  const isTransactionMalicious = action?.displayData?.isMalicious;
  const isTransactionSuspicious = action?.displayData?.isSuspicious;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_MaliciousTxAlert__WEBPACK_IMPORTED_MODULE_29__.MaliciousTxAlert, {
    showAlert: isTransactionMalicious,
    cancelHandler: cancelHandler
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      px: 2,
      width: 1,
      height: 1
    }
  }, renderDeviceApproval(), /*#__PURE__*/React.createElement(_SignTransaction_components_SignTxErrorBoundary__WEBPACK_IMPORTED_MODULE_13__.SignTxErrorBoundary, {
    variant: "RenderError"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      width: 1,
      height: 1,
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Scrollbars, null, !action.displayData.isMessageValid && !messageAlertClosed ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Alert, {
    sx: {
      backgroundColor: 'common.black'
    },
    onClose: () => {
      setMessageAlertClosed(true);
    },
    severity: "warning"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.AlertTitle, null, t('Warning: Verify Message Content')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Tooltip, {
    title: action.displayData.validationError ?? ''
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.AlertContent, {
    sx: {
      cursor: 'pointer'
    }
  }, t('This message contains non-standard elements.')))) : null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      pt: 1,
      pb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "h4"
  }, action.error ? t('Signing Failed') : t('Sign Message'))), /*#__PURE__*/React.createElement(_src_components_common_TxWarningBox__WEBPACK_IMPORTED_MODULE_30__.TxWarningBox, {
    isMalicious: isTransactionMalicious,
    isSuspicious: isTransactionSuspicious
  }), action.site?.domain !== location.hostname && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      alignItems: 'center',
      pb: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_3__.SiteAvatar, null, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_4__.TokenIcon, {
    height: "48px",
    width: "48px",
    src: action.site?.icon
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.GlobeIcon, {
    size: 48
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "h5"
  }, action.site?.name ?? t('Unknown')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary',
      maxWidth: 1,
      wordWrap: 'break-word'
    }
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_33__.Trans, {
    i18nKey: "{{domain}} requests you to sign the following message",
    values: {
      domain: action.site?.domain || 'A site'
    }
  })), signingAccountAddress && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      justifyContent: 'space-between',
      alignItems: 'center',
      mt: 1,
      px: 2,
      flexDirection: 'row',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body1",
    sx: {
      color: 'text.secondary',
      fontWeight: 'fontWeightSemibold'
    }
  }, t('Active Wallet:')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Tooltip, {
    title: signingAccountAddress
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "body1",
    sx: {
      pl: 1,
      fontWeight: 'fontWeightSemibold'
    }
  }, (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_28__.truncateAddress)(signingAccountAddress))))), {
    [_src_background_services_messages_models__WEBPACK_IMPORTED_MODULE_2__.MessageType.ETH_SIGN]: /*#__PURE__*/React.createElement(_components_EthSign__WEBPACK_IMPORTED_MODULE_8__.EthSign, {
      message: action.displayData.messageParams,
      updateHandler: updateHandler,
      ref: endContentRef
    }),
    [_src_background_services_messages_models__WEBPACK_IMPORTED_MODULE_2__.MessageType.PERSONAL_SIGN]: /*#__PURE__*/React.createElement(_components_PersonalSign__WEBPACK_IMPORTED_MODULE_9__.PersonalSign, {
      message: action.displayData.messageParams,
      updateHandler: updateHandler,
      ref: endContentRef
    }),
    [_src_background_services_messages_models__WEBPACK_IMPORTED_MODULE_2__.MessageType.AVALANCHE_SIGN]: /*#__PURE__*/React.createElement(_components_PersonalSign__WEBPACK_IMPORTED_MODULE_9__.PersonalSign, {
      message: action.displayData.messageParams,
      updateHandler: updateHandler,
      ref: endContentRef
    }),
    [_src_background_services_messages_models__WEBPACK_IMPORTED_MODULE_2__.MessageType.SIGN_TYPED_DATA]: /*#__PURE__*/React.createElement(_components_SignData__WEBPACK_IMPORTED_MODULE_10__.SignData, {
      message: action.displayData.messageParams,
      updateHandler: updateHandler,
      ref: endContentRef
    }),
    [_src_background_services_messages_models__WEBPACK_IMPORTED_MODULE_2__.MessageType.SIGN_TYPED_DATA_V1]: /*#__PURE__*/React.createElement(_components_SignData__WEBPACK_IMPORTED_MODULE_10__.SignData, {
      message: action.displayData.messageParams,
      updateHandler: updateHandler,
      ref: endContentRef
    }),
    [_src_background_services_messages_models__WEBPACK_IMPORTED_MODULE_2__.MessageType.SIGN_TYPED_DATA_V3]: /*#__PURE__*/React.createElement(_components_SignDataV3__WEBPACK_IMPORTED_MODULE_11__.SignDataV3, {
      message: action.displayData.messageParams,
      updateHandler: updateHandler,
      ref: endContentRef
    }),
    [_src_background_services_messages_models__WEBPACK_IMPORTED_MODULE_2__.MessageType.SIGN_TYPED_DATA_V4]: /*#__PURE__*/React.createElement(_components_SignDataV4__WEBPACK_IMPORTED_MODULE_12__.SignDataV4, {
      message: action.displayData.messageParams,
      updateHandler: updateHandler,
      ref: endContentRef
    }),
    ['unknown']: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
      color: "error.main",
      sx: {
        my: 1
      }
    }, t('Unknown sign type'))
  }[action.method || 'unknown'], action.error && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      mt: 2,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "caption",
    color: "error.main",
    sx: {
      mb: 1
    }
  }, t('Error:')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Card, {
    sx: {
      height: 105
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    sx: {
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "caption",
    sx: {
      wordBreak: 'break-all'
    }
  }, action.error))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    direction: "row",
    sx: {
      my: 2,
      width: 1,
      columnGap: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.InfoCircleIcon, {
    size: 14
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Typography, {
    variant: "overline"
  }, t('Scroll the message contents above to the very bottom to be able to continue'))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Stack, {
    direction: "row",
    sx: {
      flexGrow: 1,
      alignItems: 'flex-end',
      width: 1,
      justifyContent: 'space-between',
      pb: 1,
      pt: 2,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Button, {
    color: "secondary",
    size: "large",
    fullWidth: true,
    onClick: handleRejection
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_32__.Button, {
    color: "primary",
    size: "large",
    disabled: disableSubmitButton,
    onClick: handleApproval,
    fullWidth: true
  }, t('Approve'))))));
}

/***/ }),

/***/ "./src/pages/SignMessage/components/EthSign.tsx":
/*!******************************************************!*\
  !*** ./src/pages/SignMessage/components/EthSign.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EthSign": () => (/* binding */ EthSign)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




// ref(ForwardedRef) is used to track if the whole content has been viewed by the parent component

const EthSign = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function EthSign({
  message,
  updateHandler
}, ref) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    color: "warning.main",
    sx: {
      textAlign: 'center',
      mx: 1,
      mb: 2
    }
  }, t("Signing this message can be dangerous. This signature could potentially perform any operation on your account's behalf, including granting complete control of your account and all of its assets to the requesting site. Only sign this message if you know what you're doing or completely trust the requesting site")), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    size: 12,
    height: "15px",
    margin: "0 0 8px 0"
  }, t('Message:')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Card, {
    sx: {
      py: 2,
      height: 105
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    },
    onUpdate: updateHandler
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    sx: {
      wordBreak: 'break-all'
    }
  }, message.data)), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      height: '1px'
    }
  }))));
});

/***/ }),

/***/ "./src/pages/SignMessage/components/PersonalSign.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/SignMessage/components/PersonalSign.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PersonalSign": () => (/* binding */ PersonalSign)
/* harmony export */ });
/* harmony import */ var ethereumjs_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ethereumjs-util */ "./node_modules/ethereumjs-util/dist.browser/index.js");
/* harmony import */ var ethereumjs_util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ethereumjs_util__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





// ref(ForwardedRef) is used to track if the whole content has been viewed by the parent component

const PersonalSign = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function PersonalSign({
  message,
  updateHandler
}, ref) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "caption"
  }, t('Message:')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Card, {
    sx: {
      height: 250,
      py: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    },
    onUpdate: updateHandler
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "caption",
    sx: {
      wordBreak: 'break-all'
    }
  }, (0,ethereumjs_util__WEBPACK_IMPORTED_MODULE_0__.toUtf8)(message.data))), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      height: '1px'
    }
  }))));
});

/***/ }),

/***/ "./src/pages/SignMessage/components/ScrollableMessageCard.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/SignMessage/components/ScrollableMessageCard.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScrollableMessageCard": () => (/* binding */ ScrollableMessageCard)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");


const ScrollableMessageCard = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function ScrollableMessageCard({
  children,
  scrollUpdateHandler
}, ref) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Card, {
    sx: {
      height: 250,
      pt: 2,
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        width: 1,
        bottom: 0,
        height: '20px',
        backgroundImage: `linear-gradient(0deg, ${theme.palette.background.paper}, transparent)`
      }
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    },
    onUpdate: scrollUpdateHandler
  }, children, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    style: {
      height: '20px'
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    ref: ref,
    style: {
      height: '1px'
    }
  })));
});

/***/ }),

/***/ "./src/pages/SignMessage/components/SignData.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/SignMessage/components/SignData.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SignData": () => (/* binding */ SignData)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ScrollableMessageCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ScrollableMessageCard */ "./src/pages/SignMessage/components/ScrollableMessageCard.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





/**
 * This is in support of of EIP-712
 * @link https://eips.ethereum.org/EIPS/eip-712
 *
 * Here is metamasks docs on this @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v1
 * ref(ForwardedRef) is used to track if the whole content has been viewed by the parent component
 *
 * @param param0
 * @returns
 */
const SignData = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function SignData({
  message,
  updateHandler
}, ref) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const data = message.data;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "caption"
  }, t('Message:')), /*#__PURE__*/React.createElement(_ScrollableMessageCard__WEBPACK_IMPORTED_MODULE_1__.ScrollableMessageCard, {
    ref: ref,
    scrollUpdateHandler: updateHandler
  }, data?.map((x, i) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    key: i,
    sx: {
      px: 2,
      pb: 3,
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, x.name, ":"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "caption",
    color: "text.primary",
    sx: {
      fontWeight: 'fontWeightBold',
      wordBreak: 'break-all'
    }
  }, x.value))), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      height: '1px'
    }
  })));
});

/***/ }),

/***/ "./src/pages/SignMessage/components/SignDataV3.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/SignMessage/components/SignDataV3.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SignDataV3": () => (/* binding */ SignDataV3)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ScrollableMessageCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ScrollableMessageCard */ "./src/pages/SignMessage/components/ScrollableMessageCard.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





/**
 * @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v3
 * @param param0
 * @returns
 * ref(ForwardedRef) is used to track if the whole content has been viewed by the parent component
 */
const SignDataV3 = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function SignDataV3({
  message,
  updateHandler
}, ref) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const renderRow = rowData => {
    if (!rowData) {
      return null;
    }
    return Object.keys(rowData).map(key => {
      if (typeof rowData[key] === 'object') {
        return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
          key: key,
          sx: {
            px: 2
          }
        }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
          variant: "body2",
          color: "text.secondary"
        }, key, ":"), renderRow(rowData[key]));
      }
      return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        key: key,
        direction: "row",
        sx: {
          px: 2,
          gap: 0.5,
          alignItems: 'flex-start'
        }
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
        variant: "body2",
        color: "text.secondary",
        sx: {
          lineHeight: '17px'
        }
      }, key, ":", ' '), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
        variant: "caption",
        color: "text.primary",
        sx: {
          wordBreak: 'break-all',
          fontWeight: 'fontWeightBold',
          lineHeight: '17px'
        }
      }, rowData[key]));
    });
  };

  // remove type fields from data we don't want to render

  const {
    types,
    primaryType,
    ...dataWithoutTypes
  } = message.data;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "caption"
  }, t('Message:')), /*#__PURE__*/React.createElement(_ScrollableMessageCard__WEBPACK_IMPORTED_MODULE_1__.ScrollableMessageCard, {
    ref: ref,
    scrollUpdateHandler: updateHandler
  }, renderRow(dataWithoutTypes)));
});

/***/ }),

/***/ "./src/pages/SignMessage/components/SignDataV4.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/SignMessage/components/SignDataV4.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SignDataV4": () => (/* binding */ SignDataV4)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ScrollableMessageCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ScrollableMessageCard */ "./src/pages/SignMessage/components/ScrollableMessageCard.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





/**
 * @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v4
 * @param param0
 * @returns
 * ref(ForwardedRef) is used to track if the whole content has been viewed by the parent component
 */
const SignDataV4 = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function SignDataV4({
  message,
  updateHandler
}, ref) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const renderRow = rowData => {
    return Object.keys(rowData).map(key => {
      if (typeof rowData[key] === 'object') {
        return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
          key: key,
          sx: {
            px: 2
          }
        }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
          variant: "body2",
          color: "text.secondary"
        }, key, ":"), renderRow(rowData[key]));
      }
      return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        key: key,
        direction: "row",
        sx: {
          px: 2,
          gap: 0.5,
          alignItems: 'flex-start'
        }
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
        variant: "body2",
        color: "text.secondary",
        sx: {
          lineHeight: '17px'
        }
      }, key, ":", ' '), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
        variant: "caption",
        color: "text.primary",
        sx: {
          wordBreak: 'break-all',
          fontWeight: 'fontWeightBold',
          lineHeight: '17px'
        }
      }, rowData[key]));
    });
  };

  // remove type fields from data we don't want to render

  const {
    types,
    primaryType,
    ...dataWithoutTypes
  } = message.data;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "caption"
  }, t('Message:')), /*#__PURE__*/React.createElement(_ScrollableMessageCard__WEBPACK_IMPORTED_MODULE_1__.ScrollableMessageCard, {
    ref: ref,
    scrollUpdateHandler: updateHandler
  }, renderRow(dataWithoutTypes)));
});

/***/ }),

/***/ "./src/pages/SignMessage/hooks/useIsIntersecting.ts":
/*!**********************************************************!*\
  !*** ./src/pages/SignMessage/hooks/useIsIntersecting.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useIsIntersecting": () => (/* binding */ useIsIntersecting)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const useIsIntersecting = options => {
  const [isIntersecting, setIsIntersecting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const isIntersectingCallback = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(entries => {
    const [entry] = entries;
    setIsIntersecting(entry?.isIntersecting ?? false);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const {
      ref
    } = options;
    let observerRefValue = null;
    const observer = new IntersectionObserver(isIntersectingCallback);
    if (ref.current) {
      observerRefValue = ref.current;
      observer.observe(ref.current);
    }
    return () => {
      if (observerRefValue) observer.unobserve(observerRefValue);
    };
  }, [isIntersectingCallback, options]);
  return isIntersecting;
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1NpZ25NZXNzYWdlX1NpZ25NZXNzYWdlX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBd0Y7QUFFakYsSUFBS0MsV0FBVyxhQUFYQSxXQUFXO0VBQVhBLFdBQVcsQ0FBWEEsV0FBVyx5QkFDQUQseUhBQTBDO0VBRHJEQyxXQUFXLENBQVhBLFdBQVcseUJBRUFELHlIQUEwQztFQUZyREMsV0FBVyxDQUFYQSxXQUFXLHlCQUdBRCx5SEFBMEM7RUFIckRDLFdBQVcsQ0FBWEEsV0FBVyxzQkFJSEQsc0hBQXVDO0VBSi9DQyxXQUFXLENBQVhBLFdBQVcsb0JBS0xELGdIQUFpQztFQUx2Q0MsV0FBVyxDQUFYQSxXQUFXLGVBTVZELDJHQUE0QjtFQU43QkMsV0FBVyxDQUFYQSxXQUFXLHFCQU9KRCx5SEFBMEM7RUFBQSxPQVBqREMsV0FBVztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGcUQ7QUFDM0M7QUFDYztBQWF4QyxTQUFTVyxnQkFBZ0JBLENBQUM7RUFDL0JDLFNBQVM7RUFDVEMsS0FBSztFQUNMQyxXQUFXO0VBQ1hDLGFBQWE7RUFDYkM7QUFDcUIsQ0FBQyxFQUFFO0VBQ3hCLE1BQU0sQ0FBQ0MsaUJBQWlCLEVBQUVDLG9CQUFvQixDQUFDLEdBQUdULCtDQUFRLENBQUMsSUFBSSxDQUFDO0VBQ2hFLE1BQU07SUFBRVU7RUFBRSxDQUFDLEdBQUdULDZEQUFjLEVBQUU7RUFFOUIsb0JBQ0VVLEtBQUEsQ0FBQUMsYUFBQSxDQUFBRCxLQUFBLENBQUFFLFFBQUEsUUFDR1YsU0FBUyxpQkFDUlEsS0FBQSxDQUFBQyxhQUFBLENBQUNiLHNGQUFXO0lBQ1ZlLElBQUksRUFBRU4saUJBQWtCO0lBQ3hCRixhQUFhLEVBQUVBLGFBQWM7SUFDN0JTLE9BQU8sRUFBRUEsQ0FBQSxLQUFNTixvQkFBb0IsQ0FBQyxLQUFLLENBQUU7SUFDM0NMLEtBQUssRUFBRUEsS0FBSyxJQUFJTSxDQUFDLENBQUMsa0JBQWtCLENBQUU7SUFDdENNLElBQUksRUFDRlgsV0FBVyxJQUFJSyxDQUFDLENBQUMsK0NBQStDLENBQ2pFO0lBQ0RPLFlBQVksRUFBRVYsWUFBWSxFQUFFVyxPQUFPLElBQUlSLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBRTtJQUMzRFMsV0FBVyxFQUFFWixZQUFZLEVBQUVhLE1BQU0sSUFBSVYsQ0FBQyxDQUFDLG9CQUFvQjtFQUFFLEVBRWhFLENBQ0E7QUFFUDs7Ozs7Ozs7Ozs7Ozs7OztBQzFDNEQ7QUFFckQsTUFBTWEsVUFBVSxHQUFHRCx1RUFBTSxDQUFDRCw4REFBSyxDQUF1QjtBQUM3RDtBQUNBO0FBQ0Esc0JBQXNCLENBQUM7RUFBRUc7QUFBTSxDQUFDLEtBQUtBLEtBQUssQ0FBQ0MsT0FBTyxDQUFDQyxVQUFVLENBQUNDLEtBQU07QUFDcEU7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDO0VBQUVDO0FBQU8sQ0FBQyxLQUFLQSxNQUFNLElBQUksT0FBUTtBQUM5QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVmlEO0FBQ29CO0FBQ0k7QUFDM0I7QUFPeEMsU0FBU0ksWUFBWUEsQ0FBQztFQUFFQyxXQUFXO0VBQUVDO0FBQWdDLENBQUMsRUFBRTtFQUM3RSxNQUFNO0lBQUV4QjtFQUFFLENBQUMsR0FBR1QsNkRBQWMsRUFBRTtFQUM5QixvQkFDRVUsS0FBQSxDQUFBQyxhQUFBLENBQUFELEtBQUEsQ0FBQUUsUUFBQSxRQUNHb0IsV0FBVyxpQkFDVnRCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDaUIsNERBQUc7SUFBQ00sRUFBRSxFQUFFO01BQUVDLEVBQUUsRUFBRTtJQUFFO0VBQUUsZ0JBQ2pCekIsS0FBQSxDQUFBQyxhQUFBLENBQUNrQixnRkFBUTtJQUNQMUIsS0FBSyxFQUFFTSxDQUFDLENBQUMsa0JBQWtCLENBQUU7SUFDN0JNLElBQUksRUFBRU4sQ0FBQyxDQUFDLCtDQUErQztFQUFFLEVBQ3pELENBRUwsRUFDQXdCLFlBQVksaUJBQ1h2QixLQUFBLENBQUFDLGFBQUEsQ0FBQ2lCLDREQUFHO0lBQUNNLEVBQUUsRUFBRTtNQUFFQyxFQUFFLEVBQUU7SUFBRTtFQUFFLGdCQUNqQnpCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbUIsb0ZBQVU7SUFDVDNCLEtBQUssRUFBRU0sQ0FBQyxDQUFDLHdCQUF3QixDQUFFO0lBQ25DTSxJQUFJLEVBQUVOLENBQUMsQ0FBQyxpREFBaUQ7RUFBRSxFQUMzRCxDQUVMLENBQ0E7QUFFUDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQnFDO0FBTzlCLFNBQVNvQixRQUFRQSxDQUFDO0VBQUUxQixLQUFLO0VBQUVZO0FBQW9CLENBQUMsRUFBRTtFQUN2RCxNQUFNUSxLQUFLLEdBQUdnQix1RUFBUSxFQUFFO0VBRXhCLG9CQUNFN0IsS0FBQSxDQUFBQyxhQUFBLENBQUN5Qiw4REFBSztJQUNKSyxRQUFRLEVBQUMsT0FBTztJQUNoQkMsSUFBSSxlQUNGaEMsS0FBQSxDQUFBQyxhQUFBLENBQUM2Qiw0RUFBbUI7TUFBQ0csSUFBSSxFQUFFLEVBQUc7TUFBQ0MsS0FBSyxFQUFFckIsS0FBSyxDQUFDQyxPQUFPLENBQUNxQixNQUFNLENBQUNDO0lBQU0sRUFDbEU7SUFDRFosRUFBRSxFQUFFO01BQ0ZhLGVBQWUsRUFBRSxhQUFhO01BQzlCQyxXQUFXLEVBQUUsYUFBYTtNQUMxQkMsRUFBRSxFQUFFLENBQUM7TUFDTEwsS0FBSyxFQUFFLGNBQWM7TUFDckJNLEtBQUssRUFBRTtJQUNUO0VBQUUsZ0JBRUZ4QyxLQUFBLENBQUFDLGFBQUEsQ0FBQzBCLHFFQUFZLHFCQUNYM0IsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixtRUFBVTtJQUNUYSxPQUFPLEVBQUMsU0FBUztJQUNqQmpCLEVBQUUsRUFBRTtNQUFFa0IsVUFBVSxFQUFFLEdBQUc7TUFBRUMsT0FBTyxFQUFFO0lBQVE7RUFBRSxHQUV6Q2xELEtBQUssQ0FDSyxlQUNiTyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG1FQUFVO0lBQUNhLE9BQU8sRUFBQyxTQUFTO0lBQUNqQixFQUFFLEVBQUU7TUFBRW1CLE9BQU8sRUFBRTtJQUFRO0VBQUUsR0FDcER0QyxJQUFJLENBQ00sQ0FDQSxDQUNUO0FBRVo7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcENxQztBQVk5QixTQUFTakIsV0FBV0EsQ0FBQztFQUMxQk8sYUFBYTtFQUNiUSxJQUFJO0VBQ0pDLE9BQU87RUFDUFgsS0FBSztFQUNMWSxJQUFJO0VBQ0pHLFdBQVc7RUFDWEY7QUFDZ0IsQ0FBQyxFQUFFO0VBQ25CLE1BQU1PLEtBQUssR0FBR2dCLHVFQUFRLEVBQUU7RUFDeEIsb0JBQ0U3QixLQUFBLENBQUFDLGFBQUEsQ0FBQzRDLCtEQUFNO0lBQ0wxQyxJQUFJLEVBQUVBLElBQUs7SUFDWDJDLGFBQWE7SUFDYjFDLE9BQU8sRUFBRUEsT0FBUTtJQUNqQjJDLFVBQVUsRUFBRTtNQUNWdkIsRUFBRSxFQUFFO1FBQ0Z3QixDQUFDLEVBQUUsQ0FBQztRQUNKUixLQUFLLEVBQUUsQ0FBQztRQUNSUyxNQUFNLEVBQUUsQ0FBQztRQUNUQyxRQUFRLEVBQUUsTUFBTTtRQUNoQkMsUUFBUSxFQUFFO01BQ1o7SUFDRjtFQUFFLGdCQUVGbkQsS0FBQSxDQUFBQyxhQUFBLENBQUNTLDhEQUFLO0lBQ0pjLEVBQUUsRUFBRTtNQUNGNEIsRUFBRSxFQUFFLENBQUM7TUFDTGIsRUFBRSxFQUFFLENBQUM7TUFDTGMsVUFBVSxFQUFFLFFBQVE7TUFDcEJDLGNBQWMsRUFBRSxlQUFlO01BQy9CTCxNQUFNLEVBQUU7SUFDVjtFQUFFLGdCQUVGakQsS0FBQSxDQUFBQyxhQUFBLENBQUNTLDhEQUFLO0lBQ0pjLEVBQUUsRUFBRTtNQUNGNkIsVUFBVSxFQUFFLFFBQVE7TUFDcEJDLGNBQWMsRUFBRSxRQUFRO01BQ3hCQyxTQUFTLEVBQUUsUUFBUTtNQUNuQmYsS0FBSyxFQUFFLE9BQU87TUFDZGdCLEdBQUcsRUFBRSxHQUFHO01BQ1JKLEVBQUUsRUFBRTtJQUNOO0VBQUUsZ0JBRUZwRCxLQUFBLENBQUFDLGFBQUEsQ0FBQzZCLDRFQUFtQjtJQUNsQkcsSUFBSSxFQUFFLEVBQUc7SUFDVEMsS0FBSyxFQUFFckIsS0FBSyxDQUFDNEMsYUFBYSxDQUFDQztFQUFhLEVBQ3hDLGVBQ0YxRCxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG1FQUFVO0lBQ1RKLEVBQUUsRUFBRTtNQUFFVSxLQUFLLEVBQUVyQixLQUFLLENBQUM0QyxhQUFhLENBQUNDLFlBQVk7TUFBRW5CLEVBQUUsRUFBRTtJQUFFLENBQUU7SUFDdkRFLE9BQU8sRUFBQztFQUFJLEdBRVhoRCxLQUFLLENBQ0ssZUFDYk8sS0FBQSxDQUFBQyxhQUFBLENBQUMyQixtRUFBVTtJQUFDYSxPQUFPLEVBQUM7RUFBTyxHQUFFcEMsSUFBSSxDQUFjLENBQ3pDLGVBQ1JMLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUyw4REFBSztJQUNKYyxFQUFFLEVBQUU7TUFDRjZCLFVBQVUsRUFBRSxRQUFRO01BQ3BCYixLQUFLLEVBQUUsTUFBTTtNQUNiZ0IsR0FBRyxFQUFFO0lBQ1A7RUFBRSxnQkFFRnhELEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkMsK0RBQU07SUFDTFYsS0FBSyxFQUFDLFNBQVM7SUFDZixlQUFZLG9CQUFvQjtJQUNoQ3lCLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO01BQ2JoRSxhQUFhLEVBQUU7SUFDakIsQ0FBRTtJQUNGaUUsU0FBUztJQUNUM0IsSUFBSSxFQUFDO0VBQU8sR0FFWHpCLFdBQVcsQ0FDTCxlQUNUUixLQUFBLENBQUFDLGFBQUEsQ0FBQzJDLCtEQUFNO0lBQ0wsZUFBWSxxQkFBcUI7SUFDakNlLE9BQU8sRUFBRXZELE9BQVE7SUFDakJ3RCxTQUFTO0lBQ1QzQixJQUFJLEVBQUMsT0FBTztJQUNaQyxLQUFLLEVBQUM7RUFBVyxHQUVoQjVCLFlBQVksQ0FDTixDQUNILENBQ0YsQ0FDRDtBQUViOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3BHcUM7QUFPOUIsU0FBU2MsVUFBVUEsQ0FBQztFQUFFM0IsS0FBSztFQUFFWTtBQUFzQixDQUFDLEVBQUU7RUFDM0QsTUFBTVEsS0FBSyxHQUFHZ0IsdUVBQVEsRUFBRTtFQUN4QixvQkFDRTdCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDeUIsOERBQUs7SUFDSkssUUFBUSxFQUFDLFNBQVM7SUFDbEJDLElBQUksZUFBRWhDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNEQscUVBQVk7TUFBQzVCLElBQUksRUFBRSxFQUFHO01BQUNDLEtBQUssRUFBRXJCLEtBQUssQ0FBQ0MsT0FBTyxDQUFDcUIsTUFBTSxDQUFDQztJQUFNLEVBQUk7SUFDcEVaLEVBQUUsRUFBRTtNQUNGYSxlQUFlLEVBQUUsZUFBZTtNQUNoQ0MsV0FBVyxFQUFFLGFBQWE7TUFDMUJDLEVBQUUsRUFBRSxDQUFDO01BQ0xMLEtBQUssRUFBRSxjQUFjO01BQ3JCTSxLQUFLLEVBQUU7SUFDVDtFQUFFLGdCQUVGeEMsS0FBQSxDQUFBQyxhQUFBLENBQUMwQixxRUFBWSxxQkFDWDNCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkIsbUVBQVU7SUFDVGEsT0FBTyxFQUFDLFNBQVM7SUFDakJqQixFQUFFLEVBQUU7TUFBRWtCLFVBQVUsRUFBRSxHQUFHO01BQUVDLE9BQU8sRUFBRTtJQUFRO0VBQUUsR0FFekNsRCxLQUFLLENBQ0ssZUFDYk8sS0FBQSxDQUFBQyxhQUFBLENBQUMyQixtRUFBVTtJQUFDYSxPQUFPLEVBQUMsU0FBUztJQUFDakIsRUFBRSxFQUFFO01BQUVtQixPQUFPLEVBQUU7SUFBUTtFQUFFLEdBQ3BEdEMsSUFBSSxDQUNNLENBQ0EsQ0FDVDtBQUVaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEMwRTtBQUNwQjtBQWNqQjtBQUVrQztBQUNBO0FBQ1I7QUFDRjtBQUNBO0FBQ0U7QUFDUTtBQUV4QjtBQUNVO0FBQ1I7QUFDSTtBQUNBO0FBQ21DO0FBQzFCO0FBQzBCO0FBQ21CO0FBQzlDO0FBQ3VDO0FBQzRCO0FBQ3pDO0FBQ3BCO0FBQ2M7QUFDc0M7QUFJNUU7QUFDa0M7QUFDVDtBQUNHO0FBQ1Y7QUFDYztBQUNSO0FBRTVELFNBQVMrRixXQUFXQSxDQUFBLEVBQUc7RUFDNUIsTUFBTTtJQUFFckc7RUFBRSxDQUFDLEdBQUdULDhEQUFjLEVBQUU7RUFDOUIsTUFBTStHLFNBQVMsR0FBR3pCLDJFQUFlLEVBQUU7RUFDbkMsTUFBTTtJQUNKMEIsTUFBTTtJQUNOQyxZQUFZLEVBQUVDLGFBQWE7SUFDM0I3RztFQUNGLENBQUMsR0FBR2tGLDZFQUFnQixDQUFDd0IsU0FBUyxDQUFDO0VBRS9CLE1BQU1JLG1CQUFtQixHQUFHM0IsNkVBQXNCLEVBQUU7RUFDcEQsTUFBTTRCLDJCQUEyQixHQUFHaEIsc0ZBQThCLEVBQUU7RUFDcEUsTUFBTWlCLG1CQUFtQixHQUFHZixtRkFBMkIsRUFBRTtFQUN6RCxNQUFNO0lBQUVnQixtQkFBbUIsRUFBRUM7RUFBbUIsQ0FBQyxHQUFHZCwwRkFBc0IsQ0FDeEVELGtGQUFrQixDQUNuQjtFQUNELE1BQU07SUFDSmlCLFFBQVEsRUFBRTtNQUFFQyxNQUFNLEVBQUVDLGFBQWE7TUFBRUMsT0FBTyxFQUFFQztJQUFnQjtFQUM5RCxDQUFDLEdBQUdsQixtRkFBa0IsRUFBRTtFQUV4QixNQUFNLENBQUNtQixtQkFBbUIsRUFBRUMsc0JBQXNCLENBQUMsR0FBR2hJLCtDQUFRLENBQUMsSUFBSSxDQUFDO0VBQ3BFLE1BQU0sQ0FBQ2lJLGtCQUFrQixFQUFFQyxxQkFBcUIsQ0FBQyxHQUFHbEksK0NBQVEsQ0FBQyxLQUFLLENBQUM7RUFDbkUsTUFBTW1JLGFBQWEsR0FBR3ZELDZDQUFNLENBQUMsSUFBSSxDQUFDO0VBQ2xDLE1BQU13RCxjQUFjLEdBQUdwQyw0RUFBaUIsQ0FBQztJQUFFcUMsR0FBRyxFQUFFRjtFQUFjLENBQUMsQ0FBQztFQUVoRSxNQUFNRyxxQkFBcUIsR0FBRzNELDhDQUFPLENBQUMsTUFBTTtJQUMxQyxJQUFJLENBQUNzQyxNQUFNLElBQUksQ0FBQ1csYUFBYSxFQUFFO01BQzdCO0lBQ0Y7SUFDQSxNQUFNVyxZQUFZLEdBQUd0QixNQUFNLENBQUN1QixXQUFXLENBQUNDLGFBQWEsQ0FBQ0YsWUFBWTtJQUNsRSxJQUNFQSxZQUFZLEtBQUtHLFNBQVMsSUFDMUJkLGFBQWEsQ0FBQ2UsSUFBSSxLQUFLOUIsMEZBQW1CLEVBQzFDO01BQ0EsT0FBT0ksTUFBTSxDQUFDNEIsTUFBTSxLQUFLdkosMEhBQTBDLEdBQy9Ec0ksYUFBYSxDQUFDa0IsVUFBVSxFQUFFQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQ2xDbkIsYUFBYSxDQUFDb0IsUUFBUTtJQUM1QjtJQUVBLE1BQU1DLFlBQVksR0FBR25CLGVBQWUsQ0FBQ0YsYUFBYSxDQUFDc0IsUUFBUSxDQUFDLEVBQUVDLElBQUksQ0FDL0RDLE9BQU8sSUFBS0EsT0FBTyxDQUFDQyxLQUFLLEtBQUtkLFlBQVksQ0FDNUM7SUFFRCxPQUFPdEIsTUFBTSxDQUFDNEIsTUFBTSxLQUFLdkosMEhBQTBDLEdBQy9EMkosWUFBWSxFQUFFSCxVQUFVLEVBQUVDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FDbENFLFlBQVksRUFBRUQsUUFBUTtFQUM1QixDQUFDLEVBQUUsQ0FBQy9CLE1BQU0sRUFBRVcsYUFBYSxFQUFFRSxlQUFlLENBQUMsQ0FBQztFQUU1QyxNQUFNd0IsV0FBVyxHQUFHN0Usa0RBQVcsQ0FBQyxZQUFZO0lBQzFDLE1BQU0wQyxhQUFhLENBQ2pCO01BQ0VvQyxNQUFNLEVBQUVsRSw0RkFBdUI7TUFDL0JvRSxFQUFFLEVBQUV6QztJQUNOLENBQUMsRUFDREksbUJBQW1CLElBQUlDLDJCQUEyQixJQUFJQyxtQkFBbUIsQ0FBRTtJQUFBLENBQzVFO0VBQ0gsQ0FBQyxFQUFFLENBQ0RILGFBQWEsRUFDYkgsU0FBUyxFQUNUSywyQkFBMkIsRUFDM0JDLG1CQUFtQixFQUNuQkYsbUJBQW1CLENBQ3BCLENBQUM7RUFFRjFDLGdEQUFTLENBQUMsTUFBTTtJQUNkLElBQUkwRCxjQUFjLEVBQUU7TUFDbEJzQixtQkFBbUIsRUFBRTtJQUN2QjtFQUNGLENBQUMsRUFBRSxDQUFDdEIsY0FBYyxDQUFDLENBQUM7RUFDcEIsU0FBU3NCLG1CQUFtQkEsQ0FBQSxFQUFHO0lBQzdCMUIsc0JBQXNCLENBQUMsS0FBSyxDQUFDO0VBQy9CO0VBRUEsU0FBUzJCLGFBQWFBLENBQUNDLE1BR3RCLEVBQUU7SUFDRDtJQUNBLElBQUlBLE1BQU0sQ0FBQ0MsWUFBWSxLQUFLRCxNQUFNLENBQUNFLFlBQVksRUFBRTtNQUMvQzlCLHNCQUFzQixDQUFDLEtBQUssQ0FBQztJQUMvQjtFQUNGO0VBRUEsTUFBTTtJQUFFK0IsY0FBYztJQUFFQyxlQUFlO0lBQUVDO0VBQXlCLENBQUMsR0FDakUzRCxrRkFBa0IsQ0FBQztJQUNqQjRELFNBQVMsRUFBRVosV0FBVztJQUN0QmEsUUFBUSxFQUFFN0o7RUFDWixDQUFDLENBQUM7RUFFSixNQUFNOEosb0JBQW9CLEdBQUdBLENBQUEsS0FBTTtJQUNqQyxJQUFJSCx3QkFBd0IsRUFBRTtNQUM1QixJQUFJNUMsMkJBQTJCLEVBQUU7UUFDL0Isb0JBQ0UxRyxLQUFBLENBQUFDLGFBQUEsQ0FBQ3dGLHlJQUE0QjtVQUMzQitELFFBQVEsRUFBRUgsZUFBZ0I7VUFDMUJLLFFBQVEsRUFBRU47UUFBZSxFQUN6QjtNQUVOLENBQUMsTUFBTSxJQUFJekMsbUJBQW1CLEVBQUU7UUFDOUIsb0JBQ0UzRyxLQUFBLENBQUFDLGFBQUEsQ0FBQzRGLGdJQUF5QjtVQUN4QjJELFFBQVEsRUFBRUgsZUFBZ0I7VUFDMUJLLFFBQVEsRUFBRU47UUFBZSxFQUN6QjtNQUVOO0lBQ0Y7SUFFQSxJQUFJM0MsbUJBQW1CLElBQUlILE1BQU0sRUFBRXNDLE1BQU0sS0FBS2xFLDRGQUF1QixFQUFFO01BQ3JFLG9CQUFPMUUsS0FBQSxDQUFBQyxhQUFBLENBQUN1RiwrR0FBcUIsT0FBRztJQUNsQztJQUVBLE9BQU8sSUFBSTtFQUNiLENBQUM7RUFFREYsMEhBQTJCLENBQ3pCLE1BQU0rRCxlQUFlLEVBQUUsRUFDdkIvQyxNQUFNLEVBQUU0QixNQUFNLEtBQUt2SiwwSEFBMEMsR0FDekQ0RyxrRkFBdUIsR0FDdkJBLGlGQUFzQixDQUMzQjtFQUVELElBQUksQ0FBQ2UsTUFBTSxFQUFFO0lBQ1gsb0JBQ0V0RyxLQUFBLENBQUFDLGFBQUEsQ0FBQ1MsK0RBQUs7TUFDSm1KLFNBQVMsRUFBQyxLQUFLO01BQ2ZySSxFQUFFLEVBQUU7UUFDRmdCLEtBQUssRUFBRSxDQUFDO1FBQ1JTLE1BQU0sRUFBRSxDQUFDO1FBQ1RLLGNBQWMsRUFBRSxRQUFRO1FBQ3hCRCxVQUFVLEVBQUU7TUFDZDtJQUFFLGdCQUVGckQsS0FBQSxDQUFBQyxhQUFBLENBQUNvRSwwRUFBZ0I7TUFBQ3BDLElBQUksRUFBRTtJQUFHLEVBQUcsQ0FDeEI7RUFFWjtFQUVBLElBQUksQ0FBQzRFLGtCQUFrQixFQUFFO0lBQ3ZCLG9CQUNFN0csS0FBQSxDQUFBQyxhQUFBLENBQUMrRix3RkFBaUI7TUFBQzhELFlBQVksRUFBRWhFLHFGQUFzQjtNQUFDa0UsYUFBYTtJQUFBLEVBQUc7RUFFNUU7RUFFQSxNQUFNQyxzQkFBc0IsR0FBRzNELE1BQU0sRUFBRXVCLFdBQVcsRUFBRXZHLFdBQVc7RUFDL0QsTUFBTTRJLHVCQUF1QixHQUFHNUQsTUFBTSxFQUFFdUIsV0FBVyxFQUFFdEcsWUFBWTtFQUVqRSxvQkFDRXZCLEtBQUEsQ0FBQUMsYUFBQSxDQUFBRCxLQUFBLENBQUFFLFFBQUEscUJBQ0VGLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVixzRkFBZ0I7SUFDZkMsU0FBUyxFQUFFeUssc0JBQXVCO0lBQ2xDdEssYUFBYSxFQUFFQTtFQUFjLEVBQzdCLGVBQ0ZLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUywrREFBSztJQUFDYyxFQUFFLEVBQUU7TUFBRWUsRUFBRSxFQUFFLENBQUM7TUFBRUMsS0FBSyxFQUFFLENBQUM7TUFBRVMsTUFBTSxFQUFFO0lBQUU7RUFBRSxHQUN2Q3dHLG9CQUFvQixFQUFFLGVBRXZCekosS0FBQSxDQUFBQyxhQUFBLENBQUNtRixpR0FBbUI7SUFBQzNDLE9BQU8sRUFBQztFQUFhLGdCQUN4Q3pDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUywrREFBSztJQUFDYyxFQUFFLEVBQUU7TUFBRWdCLEtBQUssRUFBRSxDQUFDO01BQUVTLE1BQU0sRUFBRSxDQUFDO01BQUVrSCxRQUFRLEVBQUU7SUFBRTtFQUFFLGdCQUM5Q25LLEtBQUEsQ0FBQUMsYUFBQSxDQUFDdUUsb0VBQVUsUUFDUixDQUFDOEIsTUFBTSxDQUFDdUIsV0FBVyxDQUFDdUMsY0FBYyxJQUFJLENBQUM5QyxrQkFBa0IsZ0JBQ3hEdEgsS0FBQSxDQUFBQyxhQUFBLENBQUN5QiwrREFBSztJQUNKRixFQUFFLEVBQUU7TUFDRmEsZUFBZSxFQUFFO0lBQ25CLENBQUU7SUFDRmpDLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO01BQ2JtSCxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7SUFDN0IsQ0FBRTtJQUNGeEYsUUFBUSxFQUFDO0VBQVMsZ0JBRWxCL0IsS0FBQSxDQUFBQyxhQUFBLENBQUNrRSxvRUFBVSxRQUNScEUsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQzFCLGVBQ2JDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDd0UsaUVBQU87SUFBQ2hGLEtBQUssRUFBRTZHLE1BQU0sQ0FBQ3VCLFdBQVcsQ0FBQ3dDLGVBQWUsSUFBSTtFQUFHLGdCQUN2RHJLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMEIsc0VBQVk7SUFBQ0gsRUFBRSxFQUFFO01BQUU4SSxNQUFNLEVBQUU7SUFBVTtFQUFFLEdBQ3JDdkssQ0FBQyxDQUFDLDhDQUE4QyxDQUFDLENBQ3JDLENBQ1AsQ0FDSixHQUNOLElBQUksZUFFUkMsS0FBQSxDQUFBQyxhQUFBLENBQUNTLCtEQUFLO0lBQUNjLEVBQUUsRUFBRTtNQUFFK0ksRUFBRSxFQUFFLENBQUM7TUFBRUMsRUFBRSxFQUFFO0lBQUU7RUFBRSxnQkFDMUJ4SyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG9FQUFVO0lBQUNhLE9BQU8sRUFBQztFQUFJLEdBQ3JCNkQsTUFBTSxDQUFDbUUsS0FBSyxHQUFHMUssQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUdBLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FDNUMsQ0FDUCxlQUVSQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ29CLDhFQUFZO0lBQ1hDLFdBQVcsRUFBRTJJLHNCQUF1QjtJQUNwQzFJLFlBQVksRUFBRTJJO0VBQXdCLEVBQ3RDLEVBR0Q1RCxNQUFNLENBQUNvRSxJQUFJLEVBQUVDLE1BQU0sS0FBS0MsUUFBUSxDQUFDQyxRQUFRLGlCQUN4QzdLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUywrREFBSztJQUFDYyxFQUFFLEVBQUU7TUFBRTZCLFVBQVUsRUFBRSxRQUFRO01BQUVtSCxFQUFFLEVBQUU7SUFBRTtFQUFFLGdCQUN6Q3hLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVyx5RUFBVSxxQkFDVFosS0FBQSxDQUFBQyxhQUFBLENBQUMwRSx1RUFBUztJQUNSMUIsTUFBTSxFQUFDLE1BQU07SUFDYlQsS0FBSyxFQUFDLE1BQU07SUFDWnNJLEdBQUcsRUFBRXhFLE1BQU0sQ0FBQ29FLElBQUksRUFBRTFJO0VBQUssZ0JBRXZCaEMsS0FBQSxDQUFBQyxhQUFBLENBQUNxRSxtRUFBUztJQUFDckMsSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUNiLENBQ0QsZUFDYmpDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkIsb0VBQVU7SUFBQ2EsT0FBTyxFQUFDO0VBQUksR0FDckI2RCxNQUFNLENBQUNvRSxJQUFJLEVBQUVLLElBQUksSUFBSWhMLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDdkIsZUFDYkMsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixvRUFBVTtJQUNUYSxPQUFPLEVBQUMsU0FBUztJQUNqQmpCLEVBQUUsRUFBRTtNQUNGVSxLQUFLLEVBQUUsZ0JBQWdCO01BQ3ZCZ0IsUUFBUSxFQUFFLENBQUM7TUFDWDhILFFBQVEsRUFBRTtJQUNaO0VBQUUsZ0JBRUZoTCxLQUFBLENBQUFDLGFBQUEsQ0FBQ2lFLGlEQUFLO0lBQ0orRyxPQUFPLEVBQUMsdURBQXVEO0lBQy9EaEMsTUFBTSxFQUFFO01BQ04wQixNQUFNLEVBQUVyRSxNQUFNLENBQUNvRSxJQUFJLEVBQUVDLE1BQU0sSUFBSTtJQUNqQztFQUFFLEVBQ0YsQ0FDUyxFQUNaaEQscUJBQXFCLGlCQUNwQjNILEtBQUEsQ0FBQUMsYUFBQSxDQUFDUywrREFBSztJQUNKYyxFQUFFLEVBQUU7TUFDRjhCLGNBQWMsRUFBRSxlQUFlO01BQy9CRCxVQUFVLEVBQUUsUUFBUTtNQUNwQjZILEVBQUUsRUFBRSxDQUFDO01BQ0wzSSxFQUFFLEVBQUUsQ0FBQztNQUNMNEksYUFBYSxFQUFFLEtBQUs7TUFDcEIzSSxLQUFLLEVBQUU7SUFDVDtFQUFFLGdCQUVGeEMsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixvRUFBVTtJQUNUYSxPQUFPLEVBQUMsT0FBTztJQUNmakIsRUFBRSxFQUFFO01BQ0ZVLEtBQUssRUFBRSxnQkFBZ0I7TUFDdkJRLFVBQVUsRUFBRTtJQUNkO0VBQUUsR0FFRDNDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUNULGVBQ2JDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDd0UsaUVBQU87SUFBQ2hGLEtBQUssRUFBRWtJO0VBQXNCLGdCQUNwQzNILEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkIsb0VBQVU7SUFDVGEsT0FBTyxFQUFDLE9BQU87SUFDZmpCLEVBQUUsRUFBRTtNQUNGNEosRUFBRSxFQUFFLENBQUM7TUFDTDFJLFVBQVUsRUFBRTtJQUNkO0VBQUUsR0FFRHlELDRFQUFlLENBQUN3QixxQkFBcUIsQ0FBQyxDQUM1QixDQUNMLENBRWIsQ0FFSixFQUlDO0lBQ0UsQ0FBQy9JLDBGQUFvQixnQkFDbkJvQixLQUFBLENBQUFDLGFBQUEsQ0FBQzhFLHdEQUFPO01BQ05zRyxPQUFPLEVBQUUvRSxNQUFNLENBQUN1QixXQUFXLENBQUNDLGFBQWM7TUFDMUNrQixhQUFhLEVBQUVBLGFBQWM7TUFDN0J0QixHQUFHLEVBQUVGO0lBQWMsRUFFdEI7SUFDRCxDQUFDNUksK0ZBQXlCLGdCQUN4Qm9CLEtBQUEsQ0FBQUMsYUFBQSxDQUFDK0Usa0VBQVk7TUFDWHFHLE9BQU8sRUFBRS9FLE1BQU0sQ0FBQ3VCLFdBQVcsQ0FBQ0MsYUFBYztNQUMxQ2tCLGFBQWEsRUFBRUEsYUFBYztNQUM3QnRCLEdBQUcsRUFBRUY7SUFBYyxFQUV0QjtJQUNELENBQUM1SSxnR0FBMEIsZ0JBQ3pCb0IsS0FBQSxDQUFBQyxhQUFBLENBQUMrRSxrRUFBWTtNQUNYcUcsT0FBTyxFQUFFL0UsTUFBTSxDQUFDdUIsV0FBVyxDQUFDQyxhQUFjO01BQzFDa0IsYUFBYSxFQUFFQSxhQUFjO01BQzdCdEIsR0FBRyxFQUFFRjtJQUFjLEVBRXRCO0lBQ0QsQ0FBQzVJLGlHQUEyQixnQkFDMUJvQixLQUFBLENBQUFDLGFBQUEsQ0FBQ2dGLDJEQUFRO01BQ1BvRyxPQUFPLEVBQUUvRSxNQUFNLENBQUN1QixXQUFXLENBQUNDLGFBQWM7TUFDMUNrQixhQUFhLEVBQUVBLGFBQWM7TUFDN0J0QixHQUFHLEVBQUVGO0lBQWMsRUFFdEI7SUFDRCxDQUFDNUksb0dBQThCLGdCQUM3Qm9CLEtBQUEsQ0FBQUMsYUFBQSxDQUFDZ0YsMkRBQVE7TUFDUG9HLE9BQU8sRUFBRS9FLE1BQU0sQ0FBQ3VCLFdBQVcsQ0FBQ0MsYUFBYztNQUMxQ2tCLGFBQWEsRUFBRUEsYUFBYztNQUM3QnRCLEdBQUcsRUFBRUY7SUFBYyxFQUV0QjtJQUNELENBQUM1SSxvR0FBOEIsZ0JBQzdCb0IsS0FBQSxDQUFBQyxhQUFBLENBQUNpRiwrREFBVTtNQUNUbUcsT0FBTyxFQUFFL0UsTUFBTSxDQUFDdUIsV0FBVyxDQUFDQyxhQUFjO01BQzFDa0IsYUFBYSxFQUFFQSxhQUFjO01BQzdCdEIsR0FBRyxFQUFFRjtJQUFjLEVBRXRCO0lBQ0QsQ0FBQzVJLG9HQUE4QixnQkFDN0JvQixLQUFBLENBQUFDLGFBQUEsQ0FBQ2tGLCtEQUFVO01BQ1RrRyxPQUFPLEVBQUUvRSxNQUFNLENBQUN1QixXQUFXLENBQUNDLGFBQWM7TUFDMUNrQixhQUFhLEVBQUVBLGFBQWM7TUFDN0J0QixHQUFHLEVBQUVGO0lBQWMsRUFFdEI7SUFDRCxDQUFDLFNBQVMsZ0JBQ1J4SCxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG9FQUFVO01BQUNNLEtBQUssRUFBQyxZQUFZO01BQUNWLEVBQUUsRUFBRTtRQUFFbUssRUFBRSxFQUFFO01BQUU7SUFBRSxHQUMxQzVMLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztFQUc3QixDQUFDLENBQUN1RyxNQUFNLENBQUM0QixNQUFNLElBQUksU0FBUyxDQUFDLEVBRzlCNUIsTUFBTSxDQUFDbUUsS0FBSyxpQkFDWHpLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUywrREFBSztJQUFDYyxFQUFFLEVBQUU7TUFBRTBKLEVBQUUsRUFBRSxDQUFDO01BQUUxSSxLQUFLLEVBQUU7SUFBRTtFQUFFLGdCQUM3QnhDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkIsb0VBQVU7SUFDVGEsT0FBTyxFQUFDLFNBQVM7SUFDakJQLEtBQUssRUFBQyxZQUFZO0lBQ2xCVixFQUFFLEVBQUU7TUFBRUMsRUFBRSxFQUFFO0lBQUU7RUFBRSxHQUViMUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUNELGVBQ2JDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbUUsOERBQUk7SUFBQzVDLEVBQUUsRUFBRTtNQUFFeUIsTUFBTSxFQUFFO0lBQUk7RUFBRSxnQkFDeEJqRCxLQUFBLENBQUFDLGFBQUEsQ0FBQ3VFLG9FQUFVO0lBQ1RvSCxLQUFLLEVBQUU7TUFDTHpCLFFBQVEsRUFBRSxDQUFDO01BQ1gwQixTQUFTLEVBQUUsT0FBTztNQUNsQjVJLE1BQU0sRUFBRTtJQUNWO0VBQUUsZ0JBRUZqRCxLQUFBLENBQUFDLGFBQUEsQ0FBQ1MsK0RBQUs7SUFBQ2MsRUFBRSxFQUFFO01BQUVlLEVBQUUsRUFBRTtJQUFFO0VBQUUsZ0JBQ25CdkMsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixvRUFBVTtJQUNUYSxPQUFPLEVBQUMsU0FBUztJQUNqQmpCLEVBQUUsRUFBRTtNQUFFc0ssU0FBUyxFQUFFO0lBQVk7RUFBRSxHQUU5QnhGLE1BQU0sQ0FBQ21FLEtBQUssQ0FDRixDQUNQLENBQ0csQ0FDUixDQUVWLGVBRUR6SyxLQUFBLENBQUFDLGFBQUEsQ0FBQ1MsK0RBQUs7SUFDSm1KLFNBQVMsRUFBQyxLQUFLO0lBQ2ZySSxFQUFFLEVBQUU7TUFDRm1LLEVBQUUsRUFBRSxDQUFDO01BQ0xuSixLQUFLLEVBQUUsQ0FBQztNQUNSdUosU0FBUyxFQUFFLENBQUM7TUFDWnpJLGNBQWMsRUFBRSxRQUFRO01BQ3hCRCxVQUFVLEVBQUU7SUFDZDtFQUFFLGdCQUVGckQsS0FBQSxDQUFBQyxhQUFBLENBQUNzRSx3RUFBYztJQUFDdEMsSUFBSSxFQUFFO0VBQUcsRUFBRyxlQUM1QmpDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkIsb0VBQVU7SUFBQ2EsT0FBTyxFQUFDO0VBQVUsR0FDM0IxQyxDQUFDLENBQ0EsNkVBQTZFLENBQzlFLENBQ1UsQ0FDUCxDQUNHLENBQ1AsZUFHUkMsS0FBQSxDQUFBQyxhQUFBLENBQUNTLCtEQUFLO0lBQ0ptSixTQUFTLEVBQUMsS0FBSztJQUNmckksRUFBRSxFQUFFO01BQ0YySSxRQUFRLEVBQUUsQ0FBQztNQUNYOUcsVUFBVSxFQUFFLFVBQVU7TUFDdEJiLEtBQUssRUFBRSxDQUFDO01BQ1JjLGNBQWMsRUFBRSxlQUFlO01BQy9Ca0gsRUFBRSxFQUFFLENBQUM7TUFDTEQsRUFBRSxFQUFFLENBQUM7TUFDTC9HLEdBQUcsRUFBRTtJQUNQO0VBQUUsZ0JBRUZ4RCxLQUFBLENBQUFDLGFBQUEsQ0FBQzJDLGdFQUFNO0lBQ0xWLEtBQUssRUFBQyxXQUFXO0lBQ2pCRCxJQUFJLEVBQUMsT0FBTztJQUNaMkIsU0FBUztJQUNURCxPQUFPLEVBQUUwRjtFQUFnQixHQUV4QnRKLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDTCxlQUNUQyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJDLGdFQUFNO0lBQ0xWLEtBQUssRUFBQyxTQUFTO0lBQ2ZELElBQUksRUFBQyxPQUFPO0lBQ1orSixRQUFRLEVBQUU1RSxtQkFBb0I7SUFDOUJ6RCxPQUFPLEVBQUV5RixjQUFlO0lBQ3hCeEYsU0FBUztFQUFBLEdBRVI3RCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQ04sQ0FDSCxDQUNZLENBQ2hCLENBQ1A7QUFFUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaGNxQztBQUNVO0FBR0U7O0FBRWpEOztBQUVPLE1BQU1nRixPQUFPLGdCQUFHa0gsaURBQVUsQ0FBQyxTQUFTbEgsT0FBT0EsQ0FDaEQ7RUFDRXNHLE9BQU87RUFDUHJDO0FBSUYsQ0FBQyxFQUNEdEIsR0FBd0MsRUFDeEM7RUFDQSxNQUFNO0lBQUUzSDtFQUFFLENBQUMsR0FBR1QsNkRBQWMsRUFBRTtFQUU5QixvQkFDRVUsS0FBQSxDQUFBQyxhQUFBLENBQUNTLDhEQUFLO0lBQUNjLEVBQUUsRUFBRTtNQUFFZ0IsS0FBSyxFQUFFO0lBQUU7RUFBRSxnQkFDdEJ4QyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG1FQUFVO0lBQ1RhLE9BQU8sRUFBQyxPQUFPO0lBQ2ZQLEtBQUssRUFBQyxjQUFjO0lBQ3BCVixFQUFFLEVBQUU7TUFBRStCLFNBQVMsRUFBRSxRQUFRO01BQUUySSxFQUFFLEVBQUUsQ0FBQztNQUFFekssRUFBRSxFQUFFO0lBQUU7RUFBRSxHQUV6QzFCLENBQUMsQ0FDQSx3VEFBd1QsQ0FDelQsQ0FDVSxlQUNiQyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG1FQUFVO0lBQUNLLElBQUksRUFBRSxFQUFHO0lBQUNnQixNQUFNLEVBQUMsTUFBTTtJQUFDaEMsTUFBTSxFQUFDO0VBQVcsR0FDbkRsQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQ0gsZUFDYkMsS0FBQSxDQUFBQyxhQUFBLENBQUNtRSw2REFBSTtJQUFDNUMsRUFBRSxFQUFFO01BQUU0QixFQUFFLEVBQUUsQ0FBQztNQUFFSCxNQUFNLEVBQUU7SUFBSTtFQUFFLGdCQUMvQmpELEtBQUEsQ0FBQUMsYUFBQSxDQUFDdUUsbUVBQVU7SUFDVG9ILEtBQUssRUFBRTtNQUFFekIsUUFBUSxFQUFFLENBQUM7TUFBRTBCLFNBQVMsRUFBRSxPQUFPO01BQUU1SSxNQUFNLEVBQUU7SUFBTyxDQUFFO0lBQzNEa0osUUFBUSxFQUFFbkQ7RUFBYyxnQkFFeEJoSixLQUFBLENBQUFDLGFBQUEsQ0FBQ1MsOERBQUs7SUFBQ2MsRUFBRSxFQUFFO01BQUVlLEVBQUUsRUFBRTtJQUFFO0VBQUUsZ0JBQ25CdkMsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixtRUFBVTtJQUFDYSxPQUFPLEVBQUMsU0FBUztJQUFDakIsRUFBRSxFQUFFO01BQUVzSyxTQUFTLEVBQUU7SUFBWTtFQUFFLEdBQzFEVCxPQUFPLENBQUNlLElBQUksQ0FDRixDQUNQLGVBQ1JwTSxLQUFBLENBQUFDLGFBQUE7SUFBS3lILEdBQUcsRUFBRUEsR0FBSTtJQUFDa0UsS0FBSyxFQUFFO01BQUUzSSxNQUFNLEVBQUU7SUFBTTtFQUFFLEVBQUcsQ0FDaEMsQ0FDUixDQUNEO0FBRVosQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3REdUM7QUFFTTtBQU1WO0FBR1k7O0FBRWpEOztBQUVPLE1BQU0rQixZQUFZLGdCQUFHaUgsaURBQVUsQ0FBQyxTQUFTakgsWUFBWUEsQ0FDMUQ7RUFDRXFHLE9BQU87RUFDUHJDO0FBSUYsQ0FBQyxFQUNEdEIsR0FBd0MsRUFDeEM7RUFDQSxNQUFNO0lBQUUzSDtFQUFFLENBQUMsR0FBR1QsNkRBQWMsRUFBRTtFQUU5QixvQkFDRVUsS0FBQSxDQUFBQyxhQUFBLENBQUNTLDhEQUFLO0lBQUNjLEVBQUUsRUFBRTtNQUFFZ0IsS0FBSyxFQUFFLENBQUM7TUFBRWdCLEdBQUcsRUFBRTtJQUFFO0VBQUUsZ0JBQzlCeEQsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixtRUFBVTtJQUFDYSxPQUFPLEVBQUM7RUFBUyxHQUFFMUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFjLGVBQzFEQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ21FLDZEQUFJO0lBQUM1QyxFQUFFLEVBQUU7TUFBRXlCLE1BQU0sRUFBRSxHQUFHO01BQUVHLEVBQUUsRUFBRTtJQUFFO0VBQUUsZ0JBQy9CcEQsS0FBQSxDQUFBQyxhQUFBLENBQUN1RSxtRUFBVTtJQUNUb0gsS0FBSyxFQUFFO01BQUV6QixRQUFRLEVBQUUsQ0FBQztNQUFFMEIsU0FBUyxFQUFFLE9BQU87TUFBRTVJLE1BQU0sRUFBRTtJQUFPLENBQUU7SUFDM0RrSixRQUFRLEVBQUVuRDtFQUFjLGdCQUV4QmhKLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUyw4REFBSztJQUFDYyxFQUFFLEVBQUU7TUFBRWUsRUFBRSxFQUFFO0lBQUU7RUFBRSxnQkFDbkJ2QyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG1FQUFVO0lBQUNhLE9BQU8sRUFBQyxTQUFTO0lBQUNqQixFQUFFLEVBQUU7TUFBRXNLLFNBQVMsRUFBRTtJQUFZO0VBQUUsR0FDMURPLHVEQUFNLENBQUNoQixPQUFPLENBQUNlLElBQUksQ0FBQyxDQUNWLENBQ1AsZUFDUnBNLEtBQUEsQ0FBQUMsYUFBQTtJQUFLeUgsR0FBRyxFQUFFQSxHQUFJO0lBQUNrRSxLQUFLLEVBQUU7TUFBRTNJLE1BQU0sRUFBRTtJQUFNO0VBQUUsRUFBRyxDQUNoQyxDQUNSLENBQ0Q7QUFFWixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0NzRDtBQUVpQjtBQU9sRSxNQUFNcUoscUJBQXFCLGdCQUFHTCxpREFBVSxDQUFDLFNBQVNLLHFCQUFxQkEsQ0FDNUU7RUFBRUMsUUFBUTtFQUFFQztBQUEyQixDQUFDLEVBQ3hDOUUsR0FBd0MsRUFDeEM7RUFDQSxNQUFNN0csS0FBSyxHQUFHZ0IsdUVBQVEsRUFBRTtFQUV4QixvQkFDRTdCLGdEQUFBLENBQUNvRSw2REFBSTtJQUNINUMsRUFBRSxFQUFFO01BQ0Z5QixNQUFNLEVBQUUsR0FBRztNQUNYc0gsRUFBRSxFQUFFLENBQUM7TUFDTHBILFFBQVEsRUFBRSxVQUFVO01BQ3BCLFVBQVUsRUFBRTtRQUNWc0osT0FBTyxFQUFFLElBQUk7UUFDYnRKLFFBQVEsRUFBRSxVQUFVO1FBQ3BCWCxLQUFLLEVBQUUsQ0FBQztRQUNSa0ssTUFBTSxFQUFFLENBQUM7UUFDVHpKLE1BQU0sRUFBRSxNQUFNO1FBQ2QwSixlQUFlLEVBQUcseUJBQXdCOUwsS0FBSyxDQUFDQyxPQUFPLENBQUNDLFVBQVUsQ0FBQ0MsS0FBTTtNQUMzRTtJQUNGO0VBQUUsZ0JBRUZoQixnREFBQSxDQUFDd0UsbUVBQVU7SUFDVG9ILEtBQUssRUFBRTtNQUFFekIsUUFBUSxFQUFFLENBQUM7TUFBRTBCLFNBQVMsRUFBRSxPQUFPO01BQUU1SSxNQUFNLEVBQUU7SUFBTyxDQUFFO0lBQzNEa0osUUFBUSxFQUFFSztFQUFvQixHQUU3QkQsUUFBUSxlQUVUdk0sZ0RBQUE7SUFBSzRMLEtBQUssRUFBRTtNQUFFM0ksTUFBTSxFQUFFO0lBQU87RUFBRSxFQUFHLGVBQ2xDakQsZ0RBQUE7SUFBSzBILEdBQUcsRUFBRUEsR0FBSTtJQUFDa0UsS0FBSyxFQUFFO01BQUUzSSxNQUFNLEVBQUU7SUFBTTtFQUFFLEVBQUcsQ0FDaEMsQ0FDUjtBQUVYLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFDNkM7QUFDaUI7QUFJZjtBQUNlOztBQUVoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1nQyxRQUFRLGdCQUFHZ0gsaURBQVUsQ0FBQyxTQUFTaEgsUUFBUUEsQ0FDbEQ7RUFDRW9HLE9BQU87RUFDUHJDO0FBSUYsQ0FBQyxFQUNEdEIsR0FBd0MsRUFDeEM7RUFDQSxNQUFNO0lBQUUzSDtFQUFFLENBQUMsR0FBR1QsNkRBQWMsRUFBRTtFQUU5QixNQUFNOE0sSUFBSSxHQUFHZixPQUFPLENBQUNlLElBQUk7RUFFekIsb0JBQ0VwTSxLQUFBLENBQUFDLGFBQUEsQ0FBQ1MsOERBQUs7SUFBQ2MsRUFBRSxFQUFFO01BQUVnQixLQUFLLEVBQUUsQ0FBQztNQUFFZ0IsR0FBRyxFQUFFO0lBQUU7RUFBRSxnQkFDOUJ4RCxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG1FQUFVO0lBQUNhLE9BQU8sRUFBQztFQUFTLEdBQUUxQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQWMsZUFDMURDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDcU0seUVBQXFCO0lBQUM1RSxHQUFHLEVBQUVBLEdBQUk7SUFBQzhFLG1CQUFtQixFQUFFeEQ7RUFBYyxHQUNqRW9ELElBQUksRUFBRVEsR0FBRyxDQUFDLENBQUNDLENBQUMsRUFBRUMsQ0FBQyxrQkFDZDlNLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUyw4REFBSztJQUFDcU0sR0FBRyxFQUFFRCxDQUFFO0lBQUN0TCxFQUFFLEVBQUU7TUFBRWUsRUFBRSxFQUFFLENBQUM7TUFBRWlJLEVBQUUsRUFBRSxDQUFDO01BQUVoSCxHQUFHLEVBQUU7SUFBSTtFQUFFLGdCQUM1Q3hELEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkIsbUVBQVU7SUFBQ2EsT0FBTyxFQUFDLE9BQU87SUFBQ1AsS0FBSyxFQUFDO0VBQWdCLEdBQy9DMkssQ0FBQyxDQUFDOUIsSUFBSSxFQUFDLEdBQ1YsQ0FBYSxlQUNiL0ssS0FBQSxDQUFBQyxhQUFBLENBQUMyQixtRUFBVTtJQUNUYSxPQUFPLEVBQUMsU0FBUztJQUNqQlAsS0FBSyxFQUFDLGNBQWM7SUFDcEJWLEVBQUUsRUFBRTtNQUFFa0IsVUFBVSxFQUFFLGdCQUFnQjtNQUFFb0osU0FBUyxFQUFFO0lBQVk7RUFBRSxHQUU1RGUsQ0FBQyxDQUFDRyxLQUFLLENBQ0csQ0FFaEIsQ0FBQyxlQUNGaE4sS0FBQSxDQUFBQyxhQUFBO0lBQUt5SCxHQUFHLEVBQUVBLEdBQUk7SUFBQ2tFLEtBQUssRUFBRTtNQUFFM0ksTUFBTSxFQUFFO0lBQU07RUFBRSxFQUFHLENBQ3JCLENBQ2xCO0FBRVosQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEQ2QztBQUNpQjtBQUdmO0FBQ2U7O0FBRWhFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1pQyxVQUFVLGdCQUFHK0csaURBQVUsQ0FBQyxTQUFTL0csVUFBVUEsQ0FDdEQ7RUFDRW1HLE9BQU87RUFDUHJDO0FBSUYsQ0FBQyxFQUNEdEIsR0FBd0MsRUFDeEM7RUFDQSxNQUFNO0lBQUUzSDtFQUFFLENBQUMsR0FBR1QsNkRBQWMsRUFBRTtFQUU5QixNQUFNMk4sU0FBUyxHQUFJQyxPQUFZLElBQUs7SUFDbEMsSUFBSSxDQUFDQSxPQUFPLEVBQUU7TUFDWixPQUFPLElBQUk7SUFDYjtJQUVBLE9BQU9DLE1BQU0sQ0FBQ0MsSUFBSSxDQUFDRixPQUFPLENBQUMsQ0FBQ04sR0FBRyxDQUFFRyxHQUFHLElBQUs7TUFDdkMsSUFBSSxPQUFPRyxPQUFPLENBQUNILEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUNwQyxvQkFDRS9NLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUyw4REFBSztVQUFDcU0sR0FBRyxFQUFFQSxHQUFJO1VBQUN2TCxFQUFFLEVBQUU7WUFBRWUsRUFBRSxFQUFFO1VBQUU7UUFBRSxnQkFDN0J2QyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG1FQUFVO1VBQUNhLE9BQU8sRUFBQyxPQUFPO1VBQUNQLEtBQUssRUFBQztRQUFnQixHQUMvQzZLLEdBQUcsRUFBQyxHQUNQLENBQWEsRUFDWkUsU0FBUyxDQUFDQyxPQUFPLENBQUNILEdBQUcsQ0FBQyxDQUFDLENBQ2xCO01BRVo7TUFFQSxvQkFDRS9NLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUyw4REFBSztRQUNKcU0sR0FBRyxFQUFFQSxHQUFJO1FBQ1RsRCxTQUFTLEVBQUMsS0FBSztRQUNmckksRUFBRSxFQUFFO1VBQUVlLEVBQUUsRUFBRSxDQUFDO1VBQUVpQixHQUFHLEVBQUUsR0FBRztVQUFFSCxVQUFVLEVBQUU7UUFBYTtNQUFFLGdCQUVsRHJELEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkIsbUVBQVU7UUFDVGEsT0FBTyxFQUFDLE9BQU87UUFDZlAsS0FBSyxFQUFDLGdCQUFnQjtRQUN0QlYsRUFBRSxFQUFFO1VBQUU2TCxVQUFVLEVBQUU7UUFBTztNQUFFLEdBRTFCTixHQUFHLEVBQUMsR0FBQyxFQUFDLEdBQUcsQ0FDQyxlQUNiL00sS0FBQSxDQUFBQyxhQUFBLENBQUMyQixtRUFBVTtRQUNUYSxPQUFPLEVBQUMsU0FBUztRQUNqQlAsS0FBSyxFQUFDLGNBQWM7UUFDcEJWLEVBQUUsRUFBRTtVQUNGc0ssU0FBUyxFQUFFLFdBQVc7VUFDdEJwSixVQUFVLEVBQUUsZ0JBQWdCO1VBQzVCMkssVUFBVSxFQUFFO1FBQ2Q7TUFBRSxHQUVESCxPQUFPLENBQUNILEdBQUcsQ0FBQyxDQUNGLENBQ1A7SUFFWixDQUFDLENBQUM7RUFDSixDQUFDOztFQUVEOztFQUVBLE1BQU07SUFBRU8sS0FBSztJQUFFQyxXQUFXO0lBQUUsR0FBR0M7RUFBaUIsQ0FBQyxHQUFHbkMsT0FBTyxDQUFDZSxJQUFJO0VBQ2hFLG9CQUNFcE0sS0FBQSxDQUFBQyxhQUFBLENBQUNTLDhEQUFLO0lBQUNjLEVBQUUsRUFBRTtNQUFFZ0IsS0FBSyxFQUFFLENBQUM7TUFBRWdCLEdBQUcsRUFBRTtJQUFFO0VBQUUsZ0JBQzlCeEQsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixtRUFBVTtJQUFDYSxPQUFPLEVBQUM7RUFBUyxHQUFFMUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFjLGVBQzFEQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ3FNLHlFQUFxQjtJQUFDNUUsR0FBRyxFQUFFQSxHQUFJO0lBQUM4RSxtQkFBbUIsRUFBRXhEO0VBQWMsR0FDakVpRSxTQUFTLENBQUNPLGdCQUFnQixDQUFDLENBQ04sQ0FDbEI7QUFFWixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRjhEO0FBRWpCO0FBR0U7QUFDZTs7QUFFaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTXJJLFVBQVUsZ0JBQUc4RyxpREFBVSxDQUFDLFNBQVM5RyxVQUFVQSxDQUN0RDtFQUNFa0csT0FBTztFQUNQckM7QUFJRixDQUFDLEVBQ0R0QixHQUF3QyxFQUN4QztFQUNBLE1BQU07SUFBRTNIO0VBQUUsQ0FBQyxHQUFHVCw2REFBYyxFQUFFO0VBRTlCLE1BQU0yTixTQUFTLEdBQUlDLE9BQVksSUFBSztJQUNsQyxPQUFPQyxNQUFNLENBQUNDLElBQUksQ0FBQ0YsT0FBTyxDQUFDLENBQUNOLEdBQUcsQ0FBRUcsR0FBRyxJQUFLO01BQ3ZDLElBQUksT0FBT0csT0FBTyxDQUFDSCxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDcEMsb0JBQ0UvTSxLQUFBLENBQUFDLGFBQUEsQ0FBQ1MsOERBQUs7VUFBQ3FNLEdBQUcsRUFBRUEsR0FBSTtVQUFDdkwsRUFBRSxFQUFFO1lBQUVlLEVBQUUsRUFBRTtVQUFFO1FBQUUsZ0JBQzdCdkMsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixtRUFBVTtVQUFDYSxPQUFPLEVBQUMsT0FBTztVQUFDUCxLQUFLLEVBQUM7UUFBZ0IsR0FDL0M2SyxHQUFHLEVBQUMsR0FDUCxDQUFhLEVBQ1pFLFNBQVMsQ0FBQ0MsT0FBTyxDQUFDSCxHQUFHLENBQUMsQ0FBQyxDQUNsQjtNQUVaO01BRUEsb0JBQ0UvTSxLQUFBLENBQUFDLGFBQUEsQ0FBQ1MsOERBQUs7UUFDSnFNLEdBQUcsRUFBRUEsR0FBSTtRQUNUbEQsU0FBUyxFQUFDLEtBQUs7UUFDZnJJLEVBQUUsRUFBRTtVQUFFZSxFQUFFLEVBQUUsQ0FBQztVQUFFaUIsR0FBRyxFQUFFLEdBQUc7VUFBRUgsVUFBVSxFQUFFO1FBQWE7TUFBRSxnQkFFbERyRCxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLG1FQUFVO1FBQ1RhLE9BQU8sRUFBQyxPQUFPO1FBQ2ZQLEtBQUssRUFBQyxnQkFBZ0I7UUFDdEJWLEVBQUUsRUFBRTtVQUFFNkwsVUFBVSxFQUFFO1FBQU87TUFBRSxHQUUxQk4sR0FBRyxFQUFDLEdBQUMsRUFBQyxHQUFHLENBQ0MsZUFDYi9NLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkIsbUVBQVU7UUFDVGEsT0FBTyxFQUFDLFNBQVM7UUFDakJQLEtBQUssRUFBQyxjQUFjO1FBQ3BCVixFQUFFLEVBQUU7VUFDRnNLLFNBQVMsRUFBRSxXQUFXO1VBQ3RCcEosVUFBVSxFQUFFLGdCQUFnQjtVQUM1QjJLLFVBQVUsRUFBRTtRQUNkO01BQUUsR0FFREgsT0FBTyxDQUFDSCxHQUFHLENBQUMsQ0FDRixDQUNQO0lBRVosQ0FBQyxDQUFDO0VBQ0osQ0FBQzs7RUFFRDs7RUFFQSxNQUFNO0lBQUVPLEtBQUs7SUFBRUMsV0FBVztJQUFFLEdBQUdDO0VBQWlCLENBQUMsR0FBR25DLE9BQU8sQ0FBQ2UsSUFBSTtFQUNoRSxvQkFDRXBNLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUyw4REFBSztJQUFDYyxFQUFFLEVBQUU7TUFBRWdCLEtBQUssRUFBRSxDQUFDO01BQUVnQixHQUFHLEVBQUU7SUFBRTtFQUFFLGdCQUM5QnhELEtBQUEsQ0FBQUMsYUFBQSxDQUFDMkIsbUVBQVU7SUFBQ2EsT0FBTyxFQUFDO0VBQVMsR0FBRTFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBYyxlQUMxREMsS0FBQSxDQUFBQyxhQUFBLENBQUNxTSx5RUFBcUI7SUFBQzVFLEdBQUcsRUFBRUEsR0FBSTtJQUFDOEUsbUJBQW1CLEVBQUV4RDtFQUFjLEdBQ2pFaUUsU0FBUyxDQUFDTyxnQkFBZ0IsQ0FBQyxDQUNOLENBQ2xCO0FBRVosQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUMvRXVEO0FBRWxELE1BQU1uSSxpQkFBaUIsR0FBSW9JLE9BQU8sSUFBSztFQUM1QyxNQUFNLENBQUNoRyxjQUFjLEVBQUVpRyxpQkFBaUIsQ0FBQyxHQUFHck8sK0NBQVEsQ0FBVSxLQUFLLENBQUM7RUFFcEUsTUFBTXNPLHNCQUFzQixHQUFHN0osa0RBQVcsQ0FDdkM4SixPQUFvQyxJQUFLO0lBQ3hDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDLEdBQUdELE9BQU87SUFDdkJGLGlCQUFpQixDQUFDRyxLQUFLLEVBQUVwRyxjQUFjLElBQUksS0FBSyxDQUFDO0VBQ25ELENBQUMsRUFDRCxFQUFFLENBQ0g7RUFFRDFELGdEQUFTLENBQUMsTUFBTTtJQUNkLE1BQU07TUFBRTJEO0lBQUksQ0FBQyxHQUFHK0YsT0FBTztJQUN2QixJQUFJSyxnQkFBZ0IsR0FBRyxJQUFJO0lBRTNCLE1BQU1DLFFBQVEsR0FBRyxJQUFJQyxvQkFBb0IsQ0FBQ0wsc0JBQXNCLENBQUM7SUFFakUsSUFBSWpHLEdBQUcsQ0FBQ3VHLE9BQU8sRUFBRTtNQUNmSCxnQkFBZ0IsR0FBR3BHLEdBQUcsQ0FBQ3VHLE9BQU87TUFDOUJGLFFBQVEsQ0FBQ0csT0FBTyxDQUFDeEcsR0FBRyxDQUFDdUcsT0FBTyxDQUFDO0lBQy9CO0lBRUEsT0FBTyxNQUFNO01BQ1gsSUFBSUgsZ0JBQWdCLEVBQUVDLFFBQVEsQ0FBQ0ksU0FBUyxDQUFDTCxnQkFBZ0IsQ0FBQztJQUM1RCxDQUFDO0VBQ0gsQ0FBQyxFQUFFLENBQUNILHNCQUFzQixFQUFFRixPQUFPLENBQUMsQ0FBQztFQUVyQyxPQUFPaEcsY0FBYztBQUN2QixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL21lc3NhZ2VzL21vZGVscy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL01hbGljaW91c1R4QWxlcnQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vU2l0ZUF2YXRhci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9UeFdhcm5pbmdCb3gudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvUGVybWlzc2lvbnMvY29tcG9uZW50cy9BbGVydEJveC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9QZXJtaXNzaW9ucy9jb21wb25lbnRzL0FsZXJ0RGlhbG9nLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1Blcm1pc3Npb25zL2NvbXBvbmVudHMvV2FybmluZ0JveC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduTWVzc2FnZS9TaWduTWVzc2FnZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduTWVzc2FnZS9jb21wb25lbnRzL0V0aFNpZ24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnbk1lc3NhZ2UvY29tcG9uZW50cy9QZXJzb25hbFNpZ24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnbk1lc3NhZ2UvY29tcG9uZW50cy9TY3JvbGxhYmxlTWVzc2FnZUNhcmQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnbk1lc3NhZ2UvY29tcG9uZW50cy9TaWduRGF0YS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduTWVzc2FnZS9jb21wb25lbnRzL1NpZ25EYXRhVjMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnbk1lc3NhZ2UvY29tcG9uZW50cy9TaWduRGF0YVY0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NpZ25NZXNzYWdlL2hvb2tzL3VzZUlzSW50ZXJzZWN0aW5nLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERBcHBQcm92aWRlclJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZEFwcENvbm5lY3Rpb24vbW9kZWxzJztcblxuZXhwb3J0IGVudW0gTWVzc2FnZVR5cGUge1xuICBTSUdOX1RZUEVEX0RBVEFfVjEgPSBEQXBwUHJvdmlkZXJSZXF1ZXN0LkVUSF9TSUdOX1RZUEVEX0RBVEFfVjEsXG4gIFNJR05fVFlQRURfREFUQV9WMyA9IERBcHBQcm92aWRlclJlcXVlc3QuRVRIX1NJR05fVFlQRURfREFUQV9WMyxcbiAgU0lHTl9UWVBFRF9EQVRBX1Y0ID0gREFwcFByb3ZpZGVyUmVxdWVzdC5FVEhfU0lHTl9UWVBFRF9EQVRBX1Y0LFxuICBTSUdOX1RZUEVEX0RBVEEgPSBEQXBwUHJvdmlkZXJSZXF1ZXN0LkVUSF9TSUdOX1RZUEVEX0RBVEEsXG4gIFBFUlNPTkFMX1NJR04gPSBEQXBwUHJvdmlkZXJSZXF1ZXN0LlBFUlNPTkFMX1NJR04sXG4gIEVUSF9TSUdOID0gREFwcFByb3ZpZGVyUmVxdWVzdC5FVEhfU0lHTixcbiAgQVZBTEFOQ0hFX1NJR04gPSBEQXBwUHJvdmlkZXJSZXF1ZXN0LkFWQUxBTkNIRV9TSUdOX01FU1NBR0UsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZURpc3BsYXlEYXRhIHtcbiAgZGF0YT86IGFueTtcbiAgZnJvbT86IGFueTtcbiAgcGFzc3dvcmQ/OiBhbnk7XG59XG5cbmV4cG9ydCB0eXBlIE1lc3NhZ2VQYXJhbXMgPSB7XG4gIGRhdGE6IGFueTtcbiAgZnJvbTogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbiAgYWNjb3VudEluZGV4PzogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgU2lnbk1lc3NhZ2VEYXRhID0ge1xuICBtZXNzYWdlUGFyYW1zOiBNZXNzYWdlUGFyYW1zO1xuICBpc01lc3NhZ2VWYWxpZDogYm9vbGVhbjtcbiAgdmFsaWRhdGlvbkVycm9yPzogc3RyaW5nO1xufTtcbiIsImltcG9ydCB7IEFsZXJ0RGlhbG9nIH0gZnJvbSAnQHNyYy9wYWdlcy9QZXJtaXNzaW9ucy9jb21wb25lbnRzL0FsZXJ0RGlhbG9nJztcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuaW50ZXJmYWNlIE1hbGljaW91c1R4QWxlcnRQcm9wcyB7XG4gIGNhbmNlbEhhbmRsZXI6ICgpID0+IHZvaWQ7XG4gIHNob3dBbGVydD86IGJvb2xlYW47XG4gIHRpdGxlPzogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgYWN0aW9uVGl0bGVzPzoge1xuICAgIHJlamVjdDogc3RyaW5nO1xuICAgIHByb2NlZWQ6IHN0cmluZztcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE1hbGljaW91c1R4QWxlcnQoe1xuICBzaG93QWxlcnQsXG4gIHRpdGxlLFxuICBkZXNjcmlwdGlvbixcbiAgY2FuY2VsSGFuZGxlcixcbiAgYWN0aW9uVGl0bGVzLFxufTogTWFsaWNpb3VzVHhBbGVydFByb3BzKSB7XG4gIGNvbnN0IFtpc0FsZXJ0RGlhbG9nT3Blbiwgc2V0SXNBbGVydERpYWxvZ09wZW5dID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7c2hvd0FsZXJ0ICYmIChcbiAgICAgICAgPEFsZXJ0RGlhbG9nXG4gICAgICAgICAgb3Blbj17aXNBbGVydERpYWxvZ09wZW59XG4gICAgICAgICAgY2FuY2VsSGFuZGxlcj17Y2FuY2VsSGFuZGxlcn1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRJc0FsZXJ0RGlhbG9nT3BlbihmYWxzZSl9XG4gICAgICAgICAgdGl0bGU9e3RpdGxlIHx8IHQoJ1NjYW0gVHJhbnNhY3Rpb24nKX1cbiAgICAgICAgICB0ZXh0PXtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uIHx8IHQoJ1RoaXMgdHJhbnNhY3Rpb24gaXMgbWFsaWNpb3VzIGRvIG5vdCBwcm9jZWVkLicpXG4gICAgICAgICAgfVxuICAgICAgICAgIHByb2NlZWRMYWJlbD17YWN0aW9uVGl0bGVzPy5wcm9jZWVkIHx8IHQoJ1Byb2NlZWQgQW55d2F5Jyl9XG4gICAgICAgICAgcmVqZWN0TGFiZWw9e2FjdGlvblRpdGxlcz8ucmVqZWN0IHx8IHQoJ1JlamVjdCBUcmFuc2FjdGlvbicpfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFN0YWNrLCBzdHlsZWQgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgU2l0ZUF2YXRhciA9IHN0eWxlZChTdGFjayk8eyBtYXJnaW4/OiBzdHJpbmcgfT5gXG4gIHdpZHRoOiA4MHB4O1xuICBoZWlnaHQ6IDgwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyfTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgbWFyZ2luOiAkeyh7IG1hcmdpbiB9KSA9PiBtYXJnaW4gPz8gJzhweCAwJ307XG5gO1xuIiwiaW1wb3J0IHsgQm94IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IEFsZXJ0Qm94IH0gZnJvbSAnQHNyYy9wYWdlcy9QZXJtaXNzaW9ucy9jb21wb25lbnRzL0FsZXJ0Qm94JztcbmltcG9ydCB7IFdhcm5pbmdCb3ggfSBmcm9tICdAc3JjL3BhZ2VzL1Blcm1pc3Npb25zL2NvbXBvbmVudHMvV2FybmluZ0JveCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbnRlcmZhY2UgVHhXYXJuaW5nQm94UHJvcHMge1xuICBpc01hbGljaW91cz86IGJvb2xlYW47XG4gIGlzU3VzcGljaW91cz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUeFdhcm5pbmdCb3goeyBpc01hbGljaW91cywgaXNTdXNwaWNpb3VzIH06IFR4V2FybmluZ0JveFByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge2lzTWFsaWNpb3VzICYmIChcbiAgICAgICAgPEJveCBzeD17eyBtYjogMyB9fT5cbiAgICAgICAgICA8QWxlcnRCb3hcbiAgICAgICAgICAgIHRpdGxlPXt0KCdTY2FtIFRyYW5zYWN0aW9uJyl9XG4gICAgICAgICAgICB0ZXh0PXt0KCdUaGlzIHRyYW5zYWN0aW9uIGlzIG1hbGljaW91cyBkbyBub3QgcHJvY2VlZC4nKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0JveD5cbiAgICAgICl9XG4gICAgICB7aXNTdXNwaWNpb3VzICYmIChcbiAgICAgICAgPEJveCBzeD17eyBtYjogMyB9fT5cbiAgICAgICAgICA8V2FybmluZ0JveFxuICAgICAgICAgICAgdGl0bGU9e3QoJ1N1c3BpY2lvdXMgVHJhbnNhY3Rpb24nKX1cbiAgICAgICAgICAgIHRleHQ9e3QoJ1VzZSBjYXV0aW9uLCB0aGlzIHRyYW5zYWN0aW9uIG1heSBiZSBtYWxpY2lvdXMuJyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQWxlcnQsXG4gIEFsZXJ0Q29udGVudCxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG4gIFJlbW92ZU1vZGVyYXRvckljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmludGVyZmFjZSBBbGVydEJveFByb3BzIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWxlcnRCb3goeyB0aXRsZSwgdGV4dCB9OiBBbGVydEJveFByb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxBbGVydFxuICAgICAgc2V2ZXJpdHk9XCJlcnJvclwiXG4gICAgICBpY29uPXtcbiAgICAgICAgPFJlbW92ZU1vZGVyYXRvckljb24gc2l6ZT17MjR9IGNvbG9yPXt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja30gLz5cbiAgICAgIH1cbiAgICAgIHN4PXt7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2Vycm9yLmxpZ2h0JyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBjb2xvcjogJ2NvbW1vbi5ibGFjaycsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxBbGVydENvbnRlbnQ+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6IDYwMCwgZGlzcGxheTogJ2Jsb2NrJyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3RpdGxlfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgZGlzcGxheTogJ2Jsb2NrJyB9fT5cbiAgICAgICAgICB7dGV4dH1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPC9BbGVydENvbnRlbnQ+XG4gICAgPC9BbGVydD5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJ1dHRvbixcbiAgRGlhbG9nLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG4gIFJlbW92ZU1vZGVyYXRvckljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmludGVyZmFjZSBBbGVydERpYWxvZ1Byb3BzIHtcbiAgY2FuY2VsSGFuZGxlcjogKCkgPT4gdm9pZDtcbiAgb3BlbjogYm9vbGVhbjtcbiAgb25DbG9zZTogKCkgPT4gdm9pZDtcbiAgdGl0bGU6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICByZWplY3RMYWJlbDogc3RyaW5nO1xuICBwcm9jZWVkTGFiZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFsZXJ0RGlhbG9nKHtcbiAgY2FuY2VsSGFuZGxlcixcbiAgb3BlbixcbiAgb25DbG9zZSxcbiAgdGl0bGUsXG4gIHRleHQsXG4gIHJlamVjdExhYmVsLFxuICBwcm9jZWVkTGFiZWwsXG59OiBBbGVydERpYWxvZ1Byb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgcmV0dXJuIChcbiAgICA8RGlhbG9nXG4gICAgICBvcGVuPXtvcGVufVxuICAgICAgc2hvd0Nsb3NlSWNvblxuICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgIFBhcGVyUHJvcHM9e3tcbiAgICAgICAgc3g6IHtcbiAgICAgICAgICBtOiAyLFxuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICBtYXhXaWR0aDogJ25vbmUnLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBweTogMyxcbiAgICAgICAgICBweDogNSxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgd2lkdGg6ICcyMjVweCcsXG4gICAgICAgICAgICBnYXA6IDEuNSxcbiAgICAgICAgICAgIHB5OiAxNCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFJlbW92ZU1vZGVyYXRvckljb25cbiAgICAgICAgICAgIHNpemU9ezQ4fVxuICAgICAgICAgICAgY29sb3I9e3RoZW1lLmN1c3RvbVBhbGV0dGUuYXZhbGFuY2hlUmVkfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgIHN4PXt7IGNvbG9yOiB0aGVtZS5jdXN0b21QYWxldHRlLmF2YWxhbmNoZVJlZCwgcHg6IDIgfX1cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJoNFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj57dGV4dH08L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBnYXA6IDEsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3QtcmVqZWN0LWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGNhbmNlbEhhbmRsZXIoKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3JlamVjdExhYmVsfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdC1hcHByb3ZlLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtwcm9jZWVkTGFiZWx9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvRGlhbG9nPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQWxlcnQsXG4gIEFsZXJ0Q29udGVudCxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG4gIEdwcE1heWJlSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW50ZXJmYWNlIFdhcm5pbmdCb3hQcm9wcyB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdhcm5pbmdCb3goeyB0aXRsZSwgdGV4dCB9OiBXYXJuaW5nQm94UHJvcHMpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICByZXR1cm4gKFxuICAgIDxBbGVydFxuICAgICAgc2V2ZXJpdHk9XCJ3YXJuaW5nXCJcbiAgICAgIGljb249ezxHcHBNYXliZUljb24gc2l6ZT17MjR9IGNvbG9yPXt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja30gLz59XG4gICAgICBzeD17e1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3YXJuaW5nLmxpZ2h0JyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBjb2xvcjogJ2NvbW1vbi5ibGFjaycsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxBbGVydENvbnRlbnQ+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6IDYwMCwgZGlzcGxheTogJ2Jsb2NrJyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3RpdGxlfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgZGlzcGxheTogJ2Jsb2NrJyB9fT5cbiAgICAgICAgICB7dGV4dH1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPC9BbGVydENvbnRlbnQ+XG4gICAgPC9BbGVydD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEFsZXJ0LFxuICBBbGVydENvbnRlbnQsXG4gIEFsZXJ0VGl0bGUsXG4gIEJ1dHRvbixcbiAgQ2FyZCxcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgR2xvYmVJY29uLFxuICBJbmZvQ2lyY2xlSWNvbixcbiAgU2Nyb2xsYmFycyxcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9tZXNzYWdlcy9tb2RlbHMnO1xuaW1wb3J0IHsgU2l0ZUF2YXRhciB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vU2l0ZUF2YXRhcic7XG5pbXBvcnQgeyBUb2tlbkljb24gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1Rva2VuSWNvbic7XG5pbXBvcnQgeyB1c2VHZXRSZXF1ZXN0SWQgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUdldFJlcXVlc3RJZCc7XG5pbXBvcnQgeyB1c2VBcHByb3ZlQWN0aW9uIH0gZnJvbSAnQHNyYy9ob29rcy91c2VBcHByb3ZlQWN0aW9uJztcbmltcG9ydCB1c2VJc1VzaW5nTGVkZ2VyV2FsbGV0IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNVc2luZ0xlZGdlcldhbGxldCc7XG5cbmltcG9ydCB7IEV0aFNpZ24gfSBmcm9tICcuL2NvbXBvbmVudHMvRXRoU2lnbic7XG5pbXBvcnQgeyBQZXJzb25hbFNpZ24gfSBmcm9tICcuL2NvbXBvbmVudHMvUGVyc29uYWxTaWduJztcbmltcG9ydCB7IFNpZ25EYXRhIH0gZnJvbSAnLi9jb21wb25lbnRzL1NpZ25EYXRhJztcbmltcG9ydCB7IFNpZ25EYXRhVjMgfSBmcm9tICcuL2NvbXBvbmVudHMvU2lnbkRhdGFWMyc7XG5pbXBvcnQgeyBTaWduRGF0YVY0IH0gZnJvbSAnLi9jb21wb25lbnRzL1NpZ25EYXRhVjQnO1xuaW1wb3J0IHsgU2lnblR4RXJyb3JCb3VuZGFyeSB9IGZyb20gJy4uL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL1NpZ25UeEVycm9yQm91bmRhcnknO1xuaW1wb3J0IHsgdXNlSXNJbnRlcnNlY3RpbmcgfSBmcm9tICcuL2hvb2tzL3VzZUlzSW50ZXJzZWN0aW5nJztcbmltcG9ydCB7IERBcHBQcm92aWRlclJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZEFwcENvbm5lY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7IHVzZUxlZGdlckRpc2Nvbm5lY3RlZERpYWxvZyB9IGZyb20gJ0BzcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2hvb2tzL3VzZUxlZGdlckRpc2Nvbm5lY3RlZERpYWxvZyc7XG5pbXBvcnQgeyBMZWRnZXJBcHBUeXBlIH0gZnJvbSAnQHNyYy9jb250ZXh0cy9MZWRnZXJQcm92aWRlcic7XG5pbXBvcnQgeyBMZWRnZXJBcHByb3ZhbE92ZXJsYXkgfSBmcm9tICdAc3JjL3BhZ2VzL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL0xlZGdlckFwcHJvdmFsT3ZlcmxheSc7XG5pbXBvcnQgeyBXYWxsZXRDb25uZWN0QXBwcm92YWxPdmVybGF5IH0gZnJvbSAnLi4vU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvV2FsbGV0Q29ubmVjdEFwcHJvdmFsL1dhbGxldENvbm5lY3RBcHByb3ZhbE92ZXJsYXknO1xuaW1wb3J0IHVzZUlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCBmcm9tICdAc3JjL2hvb2tzL3VzZUlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCc7XG5pbXBvcnQgeyB1c2VBcHByb3ZhbEhlbHBlcnMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUFwcHJvdmFsSGVscGVycyc7XG5pbXBvcnQgdXNlSXNVc2luZ0ZpcmVibG9ja3NBY2NvdW50IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNVc2luZ0ZpcmVibG9ja3NBY2NvdW50JztcbmltcG9ydCB7IEZpcmVibG9ja3NBcHByb3ZhbE92ZXJsYXkgfSBmcm9tICcuLi9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9GaXJlYmxvY2tzQXBwcm92YWwvRmlyZWJsb2Nrc0FwcHJvdmFsT3ZlcmxheSc7XG5pbXBvcnQge1xuICBGdW5jdGlvbk5hbWVzLFxuICB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlLFxufSBmcm9tICdAc3JjL2hvb2tzL3VzZUlzRnVuY3Rpb25BdmFpbGFibGUnO1xuaW1wb3J0IHsgRnVuY3Rpb25Jc09mZmxpbmUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0Z1bmN0aW9uSXNPZmZsaW5lJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyBBY2NvdW50VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgdHJ1bmNhdGVBZGRyZXNzIH0gZnJvbSAnQHNyYy91dGlscy90cnVuY2F0ZUFkZHJlc3MnO1xuaW1wb3J0IHsgTWFsaWNpb3VzVHhBbGVydCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vTWFsaWNpb3VzVHhBbGVydCc7XG5pbXBvcnQgeyBUeFdhcm5pbmdCb3ggfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1R4V2FybmluZ0JveCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTaWduTWVzc2FnZSgpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCByZXF1ZXN0SWQgPSB1c2VHZXRSZXF1ZXN0SWQoKTtcbiAgY29uc3Qge1xuICAgIGFjdGlvbixcbiAgICB1cGRhdGVBY3Rpb246IHVwZGF0ZU1lc3NhZ2UsXG4gICAgY2FuY2VsSGFuZGxlcixcbiAgfSA9IHVzZUFwcHJvdmVBY3Rpb24ocmVxdWVzdElkKTtcblxuICBjb25zdCBpc1VzaW5nTGVkZ2VyV2FsbGV0ID0gdXNlSXNVc2luZ0xlZGdlcldhbGxldCgpO1xuICBjb25zdCBpc1VzaW5nV2FsbGV0Q29ubmVjdEFjY291bnQgPSB1c2VJc1VzaW5nV2FsbGV0Q29ubmVjdEFjY291bnQoKTtcbiAgY29uc3QgaXNGaXJlYmxvY2tzQWNjb3VudCA9IHVzZUlzVXNpbmdGaXJlYmxvY2tzQWNjb3VudCgpO1xuICBjb25zdCB7IGlzRnVuY3Rpb25BdmFpbGFibGU6IGlzU2lnbmluZ0F2YWlsYWJsZSB9ID0gdXNlSXNGdW5jdGlvbkF2YWlsYWJsZShcbiAgICBGdW5jdGlvbk5hbWVzLlNJR04sXG4gICk7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQsIHByaW1hcnk6IHByaW1hcnlBY2NvdW50cyB9LFxuICB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG5cbiAgY29uc3QgW2Rpc2FibGVTdWJtaXRCdXR0b24sIHNldERpc2FibGVTdWJtaXRCdXR0b25dID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFttZXNzYWdlQWxlcnRDbG9zZWQsIHNldE1lc3NhZ2VBbGVydENsb3NlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGVuZENvbnRlbnRSZWYgPSB1c2VSZWYobnVsbCk7XG4gIGNvbnN0IGlzSW50ZXJzZWN0aW5nID0gdXNlSXNJbnRlcnNlY3RpbmcoeyByZWY6IGVuZENvbnRlbnRSZWYgfSk7XG5cbiAgY29uc3Qgc2lnbmluZ0FjY291bnRBZGRyZXNzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFhY3Rpb24gfHwgIWFjdGl2ZUFjY291bnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgYWNjb3VudEluZGV4ID0gYWN0aW9uLmRpc3BsYXlEYXRhLm1lc3NhZ2VQYXJhbXMuYWNjb3VudEluZGV4O1xuICAgIGlmIChcbiAgICAgIGFjY291bnRJbmRleCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICBhY3RpdmVBY2NvdW50LnR5cGUgIT09IEFjY291bnRUeXBlLlBSSU1BUllcbiAgICApIHtcbiAgICAgIHJldHVybiBhY3Rpb24ubWV0aG9kID09PSBEQXBwUHJvdmlkZXJSZXF1ZXN0LkFWQUxBTkNIRV9TSUdOX01FU1NBR0VcbiAgICAgICAgPyBhY3RpdmVBY2NvdW50LmFkZHJlc3NBVk0/LnNsaWNlKDIpXG4gICAgICAgIDogYWN0aXZlQWNjb3VudC5hZGRyZXNzQztcbiAgICB9XG5cbiAgICBjb25zdCBhY2NvdW50VG9Vc2UgPSBwcmltYXJ5QWNjb3VudHNbYWN0aXZlQWNjb3VudC53YWxsZXRJZF0/LmZpbmQoXG4gICAgICAoYWNjb3VudCkgPT4gYWNjb3VudC5pbmRleCA9PT0gYWNjb3VudEluZGV4LFxuICAgICk7XG5cbiAgICByZXR1cm4gYWN0aW9uLm1ldGhvZCA9PT0gREFwcFByb3ZpZGVyUmVxdWVzdC5BVkFMQU5DSEVfU0lHTl9NRVNTQUdFXG4gICAgICA/IGFjY291bnRUb1VzZT8uYWRkcmVzc0FWTT8uc2xpY2UoMilcbiAgICAgIDogYWNjb3VudFRvVXNlPy5hZGRyZXNzQztcbiAgfSwgW2FjdGlvbiwgYWN0aXZlQWNjb3VudCwgcHJpbWFyeUFjY291bnRzXSk7XG5cbiAgY29uc3Qgc2lnbk1lc3NhZ2UgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgdXBkYXRlTWVzc2FnZShcbiAgICAgIHtcbiAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyxcbiAgICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgIH0sXG4gICAgICBpc1VzaW5nTGVkZ2VyV2FsbGV0IHx8IGlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCB8fCBpc0ZpcmVibG9ja3NBY2NvdW50LCAvLyB3YWl0IGZvciB0aGUgcmVzcG9uc2Ugb25seSBmb3IgZGV2aWNlIHdhbGxldHNcbiAgICApO1xuICB9LCBbXG4gICAgdXBkYXRlTWVzc2FnZSxcbiAgICByZXF1ZXN0SWQsXG4gICAgaXNVc2luZ1dhbGxldENvbm5lY3RBY2NvdW50LFxuICAgIGlzRmlyZWJsb2Nrc0FjY291bnQsXG4gICAgaXNVc2luZ0xlZGdlcldhbGxldCxcbiAgXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgIHZpZXdDb21wbGV0ZUhhbmRsZXIoKTtcbiAgICB9XG4gIH0sIFtpc0ludGVyc2VjdGluZ10pO1xuICBmdW5jdGlvbiB2aWV3Q29tcGxldGVIYW5kbGVyKCkge1xuICAgIHNldERpc2FibGVTdWJtaXRCdXR0b24oZmFsc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlSGFuZGxlcih2YWx1ZXM6IHtcbiAgICBzY3JvbGxIZWlnaHQ6IG51bWJlcjtcbiAgICBjbGllbnRIZWlnaHQ6IG51bWJlcjtcbiAgfSkge1xuICAgIC8vIHdoZW4gdGhlc2UgMiB2YWx1ZXMgYXJlIHRoZSBzYW1lLCB0aGUgY29udGVudCBmaXQgaW4gdGhlIHZpZXcgd2l0aG91dCBzY3JvbGxlclxuICAgIGlmICh2YWx1ZXMuc2Nyb2xsSGVpZ2h0ID09PSB2YWx1ZXMuY2xpZW50SGVpZ2h0KSB7XG4gICAgICBzZXREaXNhYmxlU3VibWl0QnV0dG9uKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCB7IGhhbmRsZUFwcHJvdmFsLCBoYW5kbGVSZWplY3Rpb24sIGlzQXBwcm92YWxPdmVybGF5VmlzaWJsZSB9ID1cbiAgICB1c2VBcHByb3ZhbEhlbHBlcnMoe1xuICAgICAgb25BcHByb3ZlOiBzaWduTWVzc2FnZSxcbiAgICAgIG9uUmVqZWN0OiBjYW5jZWxIYW5kbGVyLFxuICAgIH0pO1xuXG4gIGNvbnN0IHJlbmRlckRldmljZUFwcHJvdmFsID0gKCkgPT4ge1xuICAgIGlmIChpc0FwcHJvdmFsT3ZlcmxheVZpc2libGUpIHtcbiAgICAgIGlmIChpc1VzaW5nV2FsbGV0Q29ubmVjdEFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8V2FsbGV0Q29ubmVjdEFwcHJvdmFsT3ZlcmxheVxuICAgICAgICAgICAgb25SZWplY3Q9e2hhbmRsZVJlamVjdGlvbn1cbiAgICAgICAgICAgIG9uU3VibWl0PXtoYW5kbGVBcHByb3ZhbH1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChpc0ZpcmVibG9ja3NBY2NvdW50KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEZpcmVibG9ja3NBcHByb3ZhbE92ZXJsYXlcbiAgICAgICAgICAgIG9uUmVqZWN0PXtoYW5kbGVSZWplY3Rpb259XG4gICAgICAgICAgICBvblN1Ym1pdD17aGFuZGxlQXBwcm92YWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNVc2luZ0xlZGdlcldhbGxldCAmJiBhY3Rpb24/LnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcpIHtcbiAgICAgIHJldHVybiA8TGVkZ2VyQXBwcm92YWxPdmVybGF5IC8+O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIHVzZUxlZGdlckRpc2Nvbm5lY3RlZERpYWxvZyhcbiAgICAoKSA9PiBoYW5kbGVSZWplY3Rpb24oKSxcbiAgICBhY3Rpb24/Lm1ldGhvZCA9PT0gREFwcFByb3ZpZGVyUmVxdWVzdC5BVkFMQU5DSEVfU0lHTl9NRVNTQUdFXG4gICAgICA/IExlZGdlckFwcFR5cGUuQVZBTEFOQ0hFXG4gICAgICA6IExlZGdlckFwcFR5cGUuRVRIRVJFVU0sXG4gICk7XG5cbiAgaWYgKCFhY3Rpb24pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrXG4gICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPENpcmN1bGFyUHJvZ3Jlc3Mgc2l6ZT17NjB9IC8+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH1cblxuICBpZiAoIWlzU2lnbmluZ0F2YWlsYWJsZSkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnVuY3Rpb25Jc09mZmxpbmUgZnVuY3Rpb25OYW1lPXtGdW5jdGlvbk5hbWVzLkZFQVRVUkV9IGhpZGVQYWdlVGl0bGUgLz5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgaXNUcmFuc2FjdGlvbk1hbGljaW91cyA9IGFjdGlvbj8uZGlzcGxheURhdGE/LmlzTWFsaWNpb3VzO1xuICBjb25zdCBpc1RyYW5zYWN0aW9uU3VzcGljaW91cyA9IGFjdGlvbj8uZGlzcGxheURhdGE/LmlzU3VzcGljaW91cztcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8TWFsaWNpb3VzVHhBbGVydFxuICAgICAgICBzaG93QWxlcnQ9e2lzVHJhbnNhY3Rpb25NYWxpY2lvdXN9XG4gICAgICAgIGNhbmNlbEhhbmRsZXI9e2NhbmNlbEhhbmRsZXJ9XG4gICAgICAvPlxuICAgICAgPFN0YWNrIHN4PXt7IHB4OiAyLCB3aWR0aDogMSwgaGVpZ2h0OiAxIH19PlxuICAgICAgICB7cmVuZGVyRGV2aWNlQXBwcm92YWwoKX1cblxuICAgICAgICA8U2lnblR4RXJyb3JCb3VuZGFyeSB2YXJpYW50PVwiUmVuZGVyRXJyb3JcIj5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIGhlaWdodDogMSwgZmxleEdyb3c6IDEgfX0+XG4gICAgICAgICAgICA8U2Nyb2xsYmFycz5cbiAgICAgICAgICAgICAgeyFhY3Rpb24uZGlzcGxheURhdGEuaXNNZXNzYWdlVmFsaWQgJiYgIW1lc3NhZ2VBbGVydENsb3NlZCA/IChcbiAgICAgICAgICAgICAgICA8QWxlcnRcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2NvbW1vbi5ibGFjaycsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZXRNZXNzYWdlQWxlcnRDbG9zZWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgc2V2ZXJpdHk9XCJ3YXJuaW5nXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8QWxlcnRUaXRsZT5cbiAgICAgICAgICAgICAgICAgICAge3QoJ1dhcm5pbmc6IFZlcmlmeSBNZXNzYWdlIENvbnRlbnQnKX1cbiAgICAgICAgICAgICAgICAgIDwvQWxlcnRUaXRsZT5cbiAgICAgICAgICAgICAgICAgIDxUb29sdGlwIHRpdGxlPXthY3Rpb24uZGlzcGxheURhdGEudmFsaWRhdGlvbkVycm9yID8/ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgPEFsZXJ0Q29udGVudCBzeD17eyBjdXJzb3I6ICdwb2ludGVyJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnVGhpcyBtZXNzYWdlIGNvbnRhaW5zIG5vbi1zdGFuZGFyZCBlbGVtZW50cy4nKX1cbiAgICAgICAgICAgICAgICAgICAgPC9BbGVydENvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICAgICAgPC9BbGVydD5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IHB0OiAxLCBwYjogMyB9fT5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDRcIj5cbiAgICAgICAgICAgICAgICAgIHthY3Rpb24uZXJyb3IgPyB0KCdTaWduaW5nIEZhaWxlZCcpIDogdCgnU2lnbiBNZXNzYWdlJyl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgICAgICAgIDxUeFdhcm5pbmdCb3hcbiAgICAgICAgICAgICAgICBpc01hbGljaW91cz17aXNUcmFuc2FjdGlvbk1hbGljaW91c31cbiAgICAgICAgICAgICAgICBpc1N1c3BpY2lvdXM9e2lzVHJhbnNhY3Rpb25TdXNwaWNpb3VzfVxuICAgICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICAgIHsvKiBObyBuZWVkIHRvIHNob3cgZG9tYWluIG1ldGFkYXRhIHdoZW4gcmVxdWVzdCBjb21lcyBmcm9tIHRoZSBleHRlbnNpb24gaXRzZWxmICovfVxuICAgICAgICAgICAgICB7YWN0aW9uLnNpdGU/LmRvbWFpbiAhPT0gbG9jYXRpb24uaG9zdG5hbWUgJiYgKFxuICAgICAgICAgICAgICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywgcGI6IDEgfX0+XG4gICAgICAgICAgICAgICAgICA8U2l0ZUF2YXRhcj5cbiAgICAgICAgICAgICAgICAgICAgPFRva2VuSWNvblxuICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjQ4cHhcIlxuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiNDhweFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3JjPXthY3Rpb24uc2l0ZT8uaWNvbn1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxHbG9iZUljb24gc2l6ZT17NDh9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvVG9rZW5JY29uPlxuICAgICAgICAgICAgICAgICAgPC9TaXRlQXZhdGFyPlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+XG4gICAgICAgICAgICAgICAgICAgIHthY3Rpb24uc2l0ZT8ubmFtZSA/PyB0KCdVbmtub3duJyl9XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgd29yZFdyYXA6ICdicmVhay13b3JkJyxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgICAgICAgICAgaTE4bktleT1cInt7ZG9tYWlufX0gcmVxdWVzdHMgeW91IHRvIHNpZ24gdGhlIGZvbGxvd2luZyBtZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbWFpbjogYWN0aW9uLnNpdGU/LmRvbWFpbiB8fCAnQSBzaXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAge3NpZ25pbmdBY2NvdW50QWRkcmVzcyAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBtdDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB4OiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3QoJ0FjdGl2ZSBXYWxsZXQ6Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIDxUb29sdGlwIHRpdGxlPXtzaWduaW5nQWNjb3VudEFkZHJlc3N9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RydW5jYXRlQWRkcmVzcyhzaWduaW5nQWNjb3VudEFkZHJlc3MpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICB7LyogQWN0aW9ucyAgKi99XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBbTWVzc2FnZVR5cGUuRVRIX1NJR05dOiAoXG4gICAgICAgICAgICAgICAgICAgIDxFdGhTaWduXG4gICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZT17YWN0aW9uLmRpc3BsYXlEYXRhLm1lc3NhZ2VQYXJhbXN9XG4gICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSGFuZGxlcj17dXBkYXRlSGFuZGxlcn1cbiAgICAgICAgICAgICAgICAgICAgICByZWY9e2VuZENvbnRlbnRSZWZ9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgW01lc3NhZ2VUeXBlLlBFUlNPTkFMX1NJR05dOiAoXG4gICAgICAgICAgICAgICAgICAgIDxQZXJzb25hbFNpZ25cbiAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlPXthY3Rpb24uZGlzcGxheURhdGEubWVzc2FnZVBhcmFtc31cbiAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVIYW5kbGVyPXt1cGRhdGVIYW5kbGVyfVxuICAgICAgICAgICAgICAgICAgICAgIHJlZj17ZW5kQ29udGVudFJlZn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBbTWVzc2FnZVR5cGUuQVZBTEFOQ0hFX1NJR05dOiAoXG4gICAgICAgICAgICAgICAgICAgIDxQZXJzb25hbFNpZ25cbiAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlPXthY3Rpb24uZGlzcGxheURhdGEubWVzc2FnZVBhcmFtc31cbiAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVIYW5kbGVyPXt1cGRhdGVIYW5kbGVyfVxuICAgICAgICAgICAgICAgICAgICAgIHJlZj17ZW5kQ29udGVudFJlZn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBbTWVzc2FnZVR5cGUuU0lHTl9UWVBFRF9EQVRBXTogKFxuICAgICAgICAgICAgICAgICAgICA8U2lnbkRhdGFcbiAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlPXthY3Rpb24uZGlzcGxheURhdGEubWVzc2FnZVBhcmFtc31cbiAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVIYW5kbGVyPXt1cGRhdGVIYW5kbGVyfVxuICAgICAgICAgICAgICAgICAgICAgIHJlZj17ZW5kQ29udGVudFJlZn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBbTWVzc2FnZVR5cGUuU0lHTl9UWVBFRF9EQVRBX1YxXTogKFxuICAgICAgICAgICAgICAgICAgICA8U2lnbkRhdGFcbiAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlPXthY3Rpb24uZGlzcGxheURhdGEubWVzc2FnZVBhcmFtc31cbiAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVIYW5kbGVyPXt1cGRhdGVIYW5kbGVyfVxuICAgICAgICAgICAgICAgICAgICAgIHJlZj17ZW5kQ29udGVudFJlZn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBbTWVzc2FnZVR5cGUuU0lHTl9UWVBFRF9EQVRBX1YzXTogKFxuICAgICAgICAgICAgICAgICAgICA8U2lnbkRhdGFWM1xuICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U9e2FjdGlvbi5kaXNwbGF5RGF0YS5tZXNzYWdlUGFyYW1zfVxuICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUhhbmRsZXI9e3VwZGF0ZUhhbmRsZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgcmVmPXtlbmRDb250ZW50UmVmfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIFtNZXNzYWdlVHlwZS5TSUdOX1RZUEVEX0RBVEFfVjRdOiAoXG4gICAgICAgICAgICAgICAgICAgIDxTaWduRGF0YVY0XG4gICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZT17YWN0aW9uLmRpc3BsYXlEYXRhLm1lc3NhZ2VQYXJhbXN9XG4gICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSGFuZGxlcj17dXBkYXRlSGFuZGxlcn1cbiAgICAgICAgICAgICAgICAgICAgICByZWY9e2VuZENvbnRlbnRSZWZ9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgWyd1bmtub3duJ106IChcbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgY29sb3I9XCJlcnJvci5tYWluXCIgc3g9e3sgbXk6IDEgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3QoJ1Vua25vd24gc2lnbiB0eXBlJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgfVthY3Rpb24ubWV0aG9kIHx8ICd1bmtub3duJ11cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHthY3Rpb24uZXJyb3IgJiYgKFxuICAgICAgICAgICAgICAgIDxTdGFjayBzeD17eyBtdDogMiwgd2lkdGg6IDEgfX0+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yPVwiZXJyb3IubWFpblwiXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7IG1iOiAxIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHt0KCdFcnJvcjonKX1cbiAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDxDYXJkIHN4PXt7IGhlaWdodDogMTA1IH19PlxuICAgICAgICAgICAgICAgICAgICA8U2Nyb2xsYmFyc1xuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEhlaWdodDogJ3Vuc2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgcHg6IDIgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IHdvcmRCcmVhazogJ2JyZWFrLWFsbCcgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2FjdGlvbi5lcnJvcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgICA8L1Njcm9sbGJhcnM+XG4gICAgICAgICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICBteTogMixcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgY29sdW1uR2FwOiAxLFxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxJbmZvQ2lyY2xlSWNvbiBzaXplPXsxNH0gLz5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwib3ZlcmxpbmVcIj5cbiAgICAgICAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAgICAgICAnU2Nyb2xsIHRoZSBtZXNzYWdlIGNvbnRlbnRzIGFib3ZlIHRvIHRoZSB2ZXJ5IGJvdHRvbSB0byBiZSBhYmxlIHRvIGNvbnRpbnVlJyxcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9TY3JvbGxiYXJzPlxuICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICB7LyogQWN0aW9uIEJ1dHRvbnMgKi99XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICBwYjogMSxcbiAgICAgICAgICAgICAgcHQ6IDIsXG4gICAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZWplY3Rpb259XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdSZWplY3QnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZVN1Ym1pdEJ1dHRvbn1cbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQXBwcm92YWx9XG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnQXBwcm92ZScpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TaWduVHhFcnJvckJvdW5kYXJ5PlxuICAgICAgPC9TdGFjaz5cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIENhcmQsXG4gIFNjcm9sbGJhcnMsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHBvc2l0aW9uVmFsdWVzIH0gZnJvbSAncmVhY3QtY3VzdG9tLXNjcm9sbGJhcnMtMic7XG5pbXBvcnQgeyBNZXNzYWdlUGFyYW1zIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL21lc3NhZ2VzL21vZGVscyc7XG5pbXBvcnQgeyBmb3J3YXJkUmVmLCBGb3J3YXJkZWRSZWYgfSBmcm9tICdyZWFjdCc7XG5cbi8vIHJlZihGb3J3YXJkZWRSZWYpIGlzIHVzZWQgdG8gdHJhY2sgaWYgdGhlIHdob2xlIGNvbnRlbnQgaGFzIGJlZW4gdmlld2VkIGJ5IHRoZSBwYXJlbnQgY29tcG9uZW50XG5cbmV4cG9ydCBjb25zdCBFdGhTaWduID0gZm9yd2FyZFJlZihmdW5jdGlvbiBFdGhTaWduKFxuICB7XG4gICAgbWVzc2FnZSxcbiAgICB1cGRhdGVIYW5kbGVyLFxuICB9OiB7XG4gICAgbWVzc2FnZTogTWVzc2FnZVBhcmFtcztcbiAgICB1cGRhdGVIYW5kbGVyOiAodmFsdWVzOiBwb3NpdGlvblZhbHVlcykgPT4gdm9pZDtcbiAgfSxcbiAgcmVmOiBGb3J3YXJkZWRSZWY8SFRNTERpdkVsZW1lbnQgfCBudWxsPixcbikge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEgfX0+XG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICBjb2xvcj1cIndhcm5pbmcubWFpblwiXG4gICAgICAgIHN4PXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIG14OiAxLCBtYjogMiB9fVxuICAgICAgPlxuICAgICAgICB7dChcbiAgICAgICAgICBcIlNpZ25pbmcgdGhpcyBtZXNzYWdlIGNhbiBiZSBkYW5nZXJvdXMuIFRoaXMgc2lnbmF0dXJlIGNvdWxkIHBvdGVudGlhbGx5IHBlcmZvcm0gYW55IG9wZXJhdGlvbiBvbiB5b3VyIGFjY291bnQncyBiZWhhbGYsIGluY2x1ZGluZyBncmFudGluZyBjb21wbGV0ZSBjb250cm9sIG9mIHlvdXIgYWNjb3VudCBhbmQgYWxsIG9mIGl0cyBhc3NldHMgdG8gdGhlIHJlcXVlc3Rpbmcgc2l0ZS4gT25seSBzaWduIHRoaXMgbWVzc2FnZSBpZiB5b3Uga25vdyB3aGF0IHlvdSdyZSBkb2luZyBvciBjb21wbGV0ZWx5IHRydXN0IHRoZSByZXF1ZXN0aW5nIHNpdGVcIixcbiAgICAgICAgKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDxUeXBvZ3JhcGh5IHNpemU9ezEyfSBoZWlnaHQ9XCIxNXB4XCIgbWFyZ2luPVwiMCAwIDhweCAwXCI+XG4gICAgICAgIHt0KCdNZXNzYWdlOicpfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPENhcmQgc3g9e3sgcHk6IDIsIGhlaWdodDogMTA1IH19PlxuICAgICAgICA8U2Nyb2xsYmFyc1xuICAgICAgICAgIHN0eWxlPXt7IGZsZXhHcm93OiAxLCBtYXhIZWlnaHQ6ICd1bnNldCcsIGhlaWdodDogJzEwMCUnIH19XG4gICAgICAgICAgb25VcGRhdGU9e3VwZGF0ZUhhbmRsZXJ9XG4gICAgICAgID5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgcHg6IDIgfX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIHN4PXt7IHdvcmRCcmVhazogJ2JyZWFrLWFsbCcgfX0+XG4gICAgICAgICAgICAgIHttZXNzYWdlLmRhdGF9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8ZGl2IHJlZj17cmVmfSBzdHlsZT17eyBoZWlnaHQ6ICcxcHgnIH19IC8+XG4gICAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICAgIDwvQ2FyZD5cbiAgICA8L1N0YWNrPlxuICApO1xufSk7XG4iLCJpbXBvcnQgeyB0b1V0ZjggfSBmcm9tICdldGhlcmV1bWpzLXV0aWwnO1xuaW1wb3J0IHsgcG9zaXRpb25WYWx1ZXMgfSBmcm9tICdyZWFjdC1jdXN0b20tc2Nyb2xsYmFycy0yJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBDYXJkLFxuICBTY3JvbGxiYXJzLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgTWVzc2FnZVBhcmFtcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9tZXNzYWdlcy9tb2RlbHMnO1xuaW1wb3J0IHsgZm9yd2FyZFJlZiwgRm9yd2FyZGVkUmVmIH0gZnJvbSAncmVhY3QnO1xuXG4vLyByZWYoRm9yd2FyZGVkUmVmKSBpcyB1c2VkIHRvIHRyYWNrIGlmIHRoZSB3aG9sZSBjb250ZW50IGhhcyBiZWVuIHZpZXdlZCBieSB0aGUgcGFyZW50IGNvbXBvbmVudFxuXG5leHBvcnQgY29uc3QgUGVyc29uYWxTaWduID0gZm9yd2FyZFJlZihmdW5jdGlvbiBQZXJzb25hbFNpZ24oXG4gIHtcbiAgICBtZXNzYWdlLFxuICAgIHVwZGF0ZUhhbmRsZXIsXG4gIH06IHtcbiAgICBtZXNzYWdlOiBNZXNzYWdlUGFyYW1zO1xuICAgIHVwZGF0ZUhhbmRsZXI6ICh2YWx1ZXM6IHBvc2l0aW9uVmFsdWVzKSA9PiB2b2lkO1xuICB9LFxuICByZWY6IEZvcndhcmRlZFJlZjxIVE1MRGl2RWxlbWVudCB8IG51bGw+LFxuKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSwgZ2FwOiAxIH19PlxuICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj57dCgnTWVzc2FnZTonKX08L1R5cG9ncmFwaHk+XG4gICAgICA8Q2FyZCBzeD17eyBoZWlnaHQ6IDI1MCwgcHk6IDIgfX0+XG4gICAgICAgIDxTY3JvbGxiYXJzXG4gICAgICAgICAgc3R5bGU9e3sgZmxleEdyb3c6IDEsIG1heEhlaWdodDogJ3Vuc2V0JywgaGVpZ2h0OiAnMTAwJScgfX1cbiAgICAgICAgICBvblVwZGF0ZT17dXBkYXRlSGFuZGxlcn1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBweDogMiB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgd29yZEJyZWFrOiAnYnJlYWstYWxsJyB9fT5cbiAgICAgICAgICAgICAge3RvVXRmOChtZXNzYWdlLmRhdGEpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPGRpdiByZWY9e3JlZn0gc3R5bGU9e3sgaGVpZ2h0OiAnMXB4JyB9fSAvPlxuICAgICAgICA8L1Njcm9sbGJhcnM+XG4gICAgICA8L0NhcmQ+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn0pO1xuIiwiaW1wb3J0IFJlYWN0LCB7IEZvcndhcmRlZFJlZiwgZm9yd2FyZFJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHBvc2l0aW9uVmFsdWVzIH0gZnJvbSAncmVhY3QtY3VzdG9tLXNjcm9sbGJhcnMtMic7XG5pbXBvcnQgeyBDYXJkLCBTY3JvbGxiYXJzLCB1c2VUaGVtZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIHNjcm9sbFVwZGF0ZUhhbmRsZXI6ICh2YWx1ZXM6IHBvc2l0aW9uVmFsdWVzKSA9PiB2b2lkO1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3RFbGVtZW50IHwgUmVhY3QuUmVhY3RFbGVtZW50W10gfCBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IFNjcm9sbGFibGVNZXNzYWdlQ2FyZCA9IGZvcndhcmRSZWYoZnVuY3Rpb24gU2Nyb2xsYWJsZU1lc3NhZ2VDYXJkKFxuICB7IGNoaWxkcmVuLCBzY3JvbGxVcGRhdGVIYW5kbGVyIH06IFByb3BzLFxuICByZWY6IEZvcndhcmRlZFJlZjxIVE1MRGl2RWxlbWVudCB8IG51bGw+LFxuKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxDYXJkXG4gICAgICBzeD17e1xuICAgICAgICBoZWlnaHQ6IDI1MCxcbiAgICAgICAgcHQ6IDIsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAnJjo6YWZ0ZXInOiB7XG4gICAgICAgICAgY29udGVudDogJ1wiXCInLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICBoZWlnaHQ6ICcyMHB4JyxcbiAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGBsaW5lYXItZ3JhZGllbnQoMGRlZywgJHt0aGVtZS5wYWxldHRlLmJhY2tncm91bmQucGFwZXJ9LCB0cmFuc3BhcmVudClgLFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8U2Nyb2xsYmFyc1xuICAgICAgICBzdHlsZT17eyBmbGV4R3JvdzogMSwgbWF4SGVpZ2h0OiAndW5zZXQnLCBoZWlnaHQ6ICcxMDAlJyB9fVxuICAgICAgICBvblVwZGF0ZT17c2Nyb2xsVXBkYXRlSGFuZGxlcn1cbiAgICAgID5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgICB7LyogdG8gZ2l2ZSBzcGFjZSBiZWxvdyB0aGUgc2hhZG93IGdyYWRpZW50ICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzIwcHgnIH19IC8+XG4gICAgICAgIDxkaXYgcmVmPXtyZWZ9IHN0eWxlPXt7IGhlaWdodDogJzFweCcgfX0gLz5cbiAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICA8L0NhcmQ+XG4gICk7XG59KTtcbiIsImltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBTdGFjaywgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBwb3NpdGlvblZhbHVlcyB9IGZyb20gJ3JlYWN0LWN1c3RvbS1zY3JvbGxiYXJzLTInO1xuXG5pbXBvcnQgeyBNZXNzYWdlUGFyYW1zIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL21lc3NhZ2VzL21vZGVscyc7XG5pbXBvcnQgeyBGb3J3YXJkZWRSZWYsIGZvcndhcmRSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBTY3JvbGxhYmxlTWVzc2FnZUNhcmQgfSBmcm9tICcuL1Njcm9sbGFibGVNZXNzYWdlQ2FyZCc7XG5cbi8qKlxuICogVGhpcyBpcyBpbiBzdXBwb3J0IG9mIG9mIEVJUC03MTJcbiAqIEBsaW5rIGh0dHBzOi8vZWlwcy5ldGhlcmV1bS5vcmcvRUlQUy9laXAtNzEyXG4gKlxuICogSGVyZSBpcyBtZXRhbWFza3MgZG9jcyBvbiB0aGlzIEBsaW5rIGh0dHBzOi8vZG9jcy5tZXRhbWFzay5pby9ndWlkZS9zaWduaW5nLWRhdGEuaHRtbCNzaWduLXR5cGVkLWRhdGEtdjFcbiAqIHJlZihGb3J3YXJkZWRSZWYpIGlzIHVzZWQgdG8gdHJhY2sgaWYgdGhlIHdob2xlIGNvbnRlbnQgaGFzIGJlZW4gdmlld2VkIGJ5IHRoZSBwYXJlbnQgY29tcG9uZW50XG4gKlxuICogQHBhcmFtIHBhcmFtMFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGNvbnN0IFNpZ25EYXRhID0gZm9yd2FyZFJlZihmdW5jdGlvbiBTaWduRGF0YShcbiAge1xuICAgIG1lc3NhZ2UsXG4gICAgdXBkYXRlSGFuZGxlcixcbiAgfToge1xuICAgIG1lc3NhZ2U6IE1lc3NhZ2VQYXJhbXM7XG4gICAgdXBkYXRlSGFuZGxlcjogKHZhbHVlczogcG9zaXRpb25WYWx1ZXMpID0+IHZvaWQ7XG4gIH0sXG4gIHJlZjogRm9yd2FyZGVkUmVmPEhUTUxEaXZFbGVtZW50IHwgbnVsbD4sXG4pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IGRhdGEgPSBtZXNzYWdlLmRhdGE7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIGdhcDogMSB9fT5cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+e3QoJ01lc3NhZ2U6Jyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgPFNjcm9sbGFibGVNZXNzYWdlQ2FyZCByZWY9e3JlZn0gc2Nyb2xsVXBkYXRlSGFuZGxlcj17dXBkYXRlSGFuZGxlcn0+XG4gICAgICAgIHtkYXRhPy5tYXAoKHgsIGkpID0+IChcbiAgICAgICAgICA8U3RhY2sga2V5PXtpfSBzeD17eyBweDogMiwgcGI6IDMsIGdhcDogMC41IH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICB7eC5uYW1lfTpcbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgY29sb3I9XCJ0ZXh0LnByaW1hcnlcIlxuICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodEJvbGQnLCB3b3JkQnJlYWs6ICdicmVhay1hbGwnIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt4LnZhbHVlfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICkpfVxuICAgICAgICA8ZGl2IHJlZj17cmVmfSBzdHlsZT17eyBoZWlnaHQ6ICcxcHgnIH19IC8+XG4gICAgICA8L1Njcm9sbGFibGVNZXNzYWdlQ2FyZD5cbiAgICA8L1N0YWNrPlxuICApO1xufSk7XG4iLCJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgU3RhY2ssIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgcG9zaXRpb25WYWx1ZXMgfSBmcm9tICdyZWFjdC1jdXN0b20tc2Nyb2xsYmFycy0yJztcbmltcG9ydCB7IE1lc3NhZ2VQYXJhbXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbWVzc2FnZXMvbW9kZWxzJztcbmltcG9ydCB7IEZvcndhcmRlZFJlZiwgZm9yd2FyZFJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFNjcm9sbGFibGVNZXNzYWdlQ2FyZCB9IGZyb20gJy4vU2Nyb2xsYWJsZU1lc3NhZ2VDYXJkJztcblxuLyoqXG4gKiBAbGluayBodHRwczovL2RvY3MubWV0YW1hc2suaW8vZ3VpZGUvc2lnbmluZy1kYXRhLmh0bWwjc2lnbi10eXBlZC1kYXRhLXYzXG4gKiBAcGFyYW0gcGFyYW0wXG4gKiBAcmV0dXJuc1xuICogcmVmKEZvcndhcmRlZFJlZikgaXMgdXNlZCB0byB0cmFjayBpZiB0aGUgd2hvbGUgY29udGVudCBoYXMgYmVlbiB2aWV3ZWQgYnkgdGhlIHBhcmVudCBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGNvbnN0IFNpZ25EYXRhVjMgPSBmb3J3YXJkUmVmKGZ1bmN0aW9uIFNpZ25EYXRhVjMoXG4gIHtcbiAgICBtZXNzYWdlLFxuICAgIHVwZGF0ZUhhbmRsZXIsXG4gIH06IHtcbiAgICBtZXNzYWdlOiBNZXNzYWdlUGFyYW1zO1xuICAgIHVwZGF0ZUhhbmRsZXI6ICh2YWx1ZXM6IHBvc2l0aW9uVmFsdWVzKSA9PiB2b2lkO1xuICB9LFxuICByZWY6IEZvcndhcmRlZFJlZjxIVE1MRGl2RWxlbWVudCB8IG51bGw+LFxuKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCByZW5kZXJSb3cgPSAocm93RGF0YTogYW55KSA9PiB7XG4gICAgaWYgKCFyb3dEYXRhKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMocm93RGF0YSkubWFwKChrZXkpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygcm93RGF0YVtrZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxTdGFjayBrZXk9e2tleX0gc3g9e3sgcHg6IDIgfX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgIHtrZXl9OlxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAge3JlbmRlclJvdyhyb3dEYXRhW2tleV0pfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgc3g9e3sgcHg6IDIsIGdhcDogMC41LCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiXG4gICAgICAgICAgICBzeD17eyBsaW5lSGVpZ2h0OiAnMTdweCcgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7a2V5fTp7JyAnfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgY29sb3I9XCJ0ZXh0LnByaW1hcnlcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgd29yZEJyZWFrOiAnYnJlYWstYWxsJyxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRCb2xkJyxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogJzE3cHgnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cm93RGF0YVtrZXldfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gcmVtb3ZlIHR5cGUgZmllbGRzIGZyb20gZGF0YSB3ZSBkb24ndCB3YW50IHRvIHJlbmRlclxuXG4gIGNvbnN0IHsgdHlwZXMsIHByaW1hcnlUeXBlLCAuLi5kYXRhV2l0aG91dFR5cGVzIH0gPSBtZXNzYWdlLmRhdGE7XG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxLCBnYXA6IDEgfX0+XG4gICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPnt0KCdNZXNzYWdlOicpfTwvVHlwb2dyYXBoeT5cbiAgICAgIDxTY3JvbGxhYmxlTWVzc2FnZUNhcmQgcmVmPXtyZWZ9IHNjcm9sbFVwZGF0ZUhhbmRsZXI9e3VwZGF0ZUhhbmRsZXJ9PlxuICAgICAgICB7cmVuZGVyUm93KGRhdGFXaXRob3V0VHlwZXMpfVxuICAgICAgPC9TY3JvbGxhYmxlTWVzc2FnZUNhcmQ+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn0pO1xuIiwiaW1wb3J0IHsgU3RhY2ssIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgcG9zaXRpb25WYWx1ZXMgfSBmcm9tICdyZWFjdC1jdXN0b20tc2Nyb2xsYmFycy0yJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7IE1lc3NhZ2VQYXJhbXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbWVzc2FnZXMvbW9kZWxzJztcbmltcG9ydCB7IEZvcndhcmRlZFJlZiwgZm9yd2FyZFJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFNjcm9sbGFibGVNZXNzYWdlQ2FyZCB9IGZyb20gJy4vU2Nyb2xsYWJsZU1lc3NhZ2VDYXJkJztcblxuLyoqXG4gKiBAbGluayBodHRwczovL2RvY3MubWV0YW1hc2suaW8vZ3VpZGUvc2lnbmluZy1kYXRhLmh0bWwjc2lnbi10eXBlZC1kYXRhLXY0XG4gKiBAcGFyYW0gcGFyYW0wXG4gKiBAcmV0dXJuc1xuICogcmVmKEZvcndhcmRlZFJlZikgaXMgdXNlZCB0byB0cmFjayBpZiB0aGUgd2hvbGUgY29udGVudCBoYXMgYmVlbiB2aWV3ZWQgYnkgdGhlIHBhcmVudCBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGNvbnN0IFNpZ25EYXRhVjQgPSBmb3J3YXJkUmVmKGZ1bmN0aW9uIFNpZ25EYXRhVjQoXG4gIHtcbiAgICBtZXNzYWdlLFxuICAgIHVwZGF0ZUhhbmRsZXIsXG4gIH06IHtcbiAgICBtZXNzYWdlOiBNZXNzYWdlUGFyYW1zO1xuICAgIHVwZGF0ZUhhbmRsZXI6ICh2YWx1ZXM6IHBvc2l0aW9uVmFsdWVzKSA9PiB2b2lkO1xuICB9LFxuICByZWY6IEZvcndhcmRlZFJlZjxIVE1MRGl2RWxlbWVudCB8IG51bGw+LFxuKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCByZW5kZXJSb3cgPSAocm93RGF0YTogYW55KSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHJvd0RhdGEpLm1hcCgoa2V5KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHJvd0RhdGFba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8U3RhY2sga2V5PXtrZXl9IHN4PXt7IHB4OiAyIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICB7a2V5fTpcbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIHtyZW5kZXJSb3cocm93RGF0YVtrZXldKX1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgIHN4PXt7IHB4OiAyLCBnYXA6IDAuNSwgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIlxuICAgICAgICAgICAgc3g9e3sgbGluZUhlaWdodDogJzE3cHgnIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2tleX06eycgJ31cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgIGNvbG9yPVwidGV4dC5wcmltYXJ5XCJcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHdvcmRCcmVhazogJ2JyZWFrLWFsbCcsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0Qm9sZCcsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6ICcxN3B4JyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3Jvd0RhdGFba2V5XX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIHJlbW92ZSB0eXBlIGZpZWxkcyBmcm9tIGRhdGEgd2UgZG9uJ3Qgd2FudCB0byByZW5kZXJcblxuICBjb25zdCB7IHR5cGVzLCBwcmltYXJ5VHlwZSwgLi4uZGF0YVdpdGhvdXRUeXBlcyB9ID0gbWVzc2FnZS5kYXRhO1xuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSwgZ2FwOiAxIH19PlxuICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj57dCgnTWVzc2FnZTonKX08L1R5cG9ncmFwaHk+XG4gICAgICA8U2Nyb2xsYWJsZU1lc3NhZ2VDYXJkIHJlZj17cmVmfSBzY3JvbGxVcGRhdGVIYW5kbGVyPXt1cGRhdGVIYW5kbGVyfT5cbiAgICAgICAge3JlbmRlclJvdyhkYXRhV2l0aG91dFR5cGVzKX1cbiAgICAgIDwvU2Nyb2xsYWJsZU1lc3NhZ2VDYXJkPlxuICAgIDwvU3RhY2s+XG4gICk7XG59KTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgY29uc3QgdXNlSXNJbnRlcnNlY3RpbmcgPSAob3B0aW9ucykgPT4ge1xuICBjb25zdCBbaXNJbnRlcnNlY3RpbmcsIHNldElzSW50ZXJzZWN0aW5nXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcblxuICBjb25zdCBpc0ludGVyc2VjdGluZ0NhbGxiYWNrID0gdXNlQ2FsbGJhY2soXG4gICAgKGVudHJpZXM6IEludGVyc2VjdGlvbk9ic2VydmVyRW50cnlbXSkgPT4ge1xuICAgICAgY29uc3QgW2VudHJ5XSA9IGVudHJpZXM7XG4gICAgICBzZXRJc0ludGVyc2VjdGluZyhlbnRyeT8uaXNJbnRlcnNlY3RpbmcgPz8gZmFsc2UpO1xuICAgIH0sXG4gICAgW10sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB7IHJlZiB9ID0gb3B0aW9ucztcbiAgICBsZXQgb2JzZXJ2ZXJSZWZWYWx1ZSA9IG51bGw7XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihpc0ludGVyc2VjdGluZ0NhbGxiYWNrKTtcblxuICAgIGlmIChyZWYuY3VycmVudCkge1xuICAgICAgb2JzZXJ2ZXJSZWZWYWx1ZSA9IHJlZi5jdXJyZW50O1xuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShyZWYuY3VycmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChvYnNlcnZlclJlZlZhbHVlKSBvYnNlcnZlci51bm9ic2VydmUob2JzZXJ2ZXJSZWZWYWx1ZSk7XG4gICAgfTtcbiAgfSwgW2lzSW50ZXJzZWN0aW5nQ2FsbGJhY2ssIG9wdGlvbnNdKTtcblxuICByZXR1cm4gaXNJbnRlcnNlY3Rpbmc7XG59O1xuIl0sIm5hbWVzIjpbIkRBcHBQcm92aWRlclJlcXVlc3QiLCJNZXNzYWdlVHlwZSIsIkVUSF9TSUdOX1RZUEVEX0RBVEFfVjEiLCJFVEhfU0lHTl9UWVBFRF9EQVRBX1YzIiwiRVRIX1NJR05fVFlQRURfREFUQV9WNCIsIkVUSF9TSUdOX1RZUEVEX0RBVEEiLCJQRVJTT05BTF9TSUdOIiwiRVRIX1NJR04iLCJBVkFMQU5DSEVfU0lHTl9NRVNTQUdFIiwiQWxlcnREaWFsb2ciLCJ1c2VTdGF0ZSIsInVzZVRyYW5zbGF0aW9uIiwiTWFsaWNpb3VzVHhBbGVydCIsInNob3dBbGVydCIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJjYW5jZWxIYW5kbGVyIiwiYWN0aW9uVGl0bGVzIiwiaXNBbGVydERpYWxvZ09wZW4iLCJzZXRJc0FsZXJ0RGlhbG9nT3BlbiIsInQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJGcmFnbWVudCIsIm9wZW4iLCJvbkNsb3NlIiwidGV4dCIsInByb2NlZWRMYWJlbCIsInByb2NlZWQiLCJyZWplY3RMYWJlbCIsInJlamVjdCIsIlN0YWNrIiwic3R5bGVkIiwiU2l0ZUF2YXRhciIsInRoZW1lIiwicGFsZXR0ZSIsImJhY2tncm91bmQiLCJwYXBlciIsIm1hcmdpbiIsIkJveCIsIkFsZXJ0Qm94IiwiV2FybmluZ0JveCIsIlR4V2FybmluZ0JveCIsImlzTWFsaWNpb3VzIiwiaXNTdXNwaWNpb3VzIiwic3giLCJtYiIsIkFsZXJ0IiwiQWxlcnRDb250ZW50IiwiVHlwb2dyYXBoeSIsInVzZVRoZW1lIiwiUmVtb3ZlTW9kZXJhdG9ySWNvbiIsInNldmVyaXR5IiwiaWNvbiIsInNpemUiLCJjb2xvciIsImNvbW1vbiIsImJsYWNrIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyQ29sb3IiLCJweCIsIndpZHRoIiwidmFyaWFudCIsImZvbnRXZWlnaHQiLCJkaXNwbGF5IiwiQnV0dG9uIiwiRGlhbG9nIiwic2hvd0Nsb3NlSWNvbiIsIlBhcGVyUHJvcHMiLCJtIiwiaGVpZ2h0IiwibWF4V2lkdGgiLCJwb3NpdGlvbiIsInB5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwidGV4dEFsaWduIiwiZ2FwIiwiY3VzdG9tUGFsZXR0ZSIsImF2YWxhbmNoZVJlZCIsIm9uQ2xpY2siLCJmdWxsV2lkdGgiLCJHcHBNYXliZUljb24iLCJ1c2VDYWxsYmFjayIsInVzZUVmZmVjdCIsInVzZU1lbW8iLCJ1c2VSZWYiLCJUcmFucyIsIkFsZXJ0VGl0bGUiLCJDYXJkIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIkdsb2JlSWNvbiIsIkluZm9DaXJjbGVJY29uIiwiU2Nyb2xsYmFycyIsIlRvb2x0aXAiLCJBY3Rpb25TdGF0dXMiLCJUb2tlbkljb24iLCJ1c2VHZXRSZXF1ZXN0SWQiLCJ1c2VBcHByb3ZlQWN0aW9uIiwidXNlSXNVc2luZ0xlZGdlcldhbGxldCIsIkV0aFNpZ24iLCJQZXJzb25hbFNpZ24iLCJTaWduRGF0YSIsIlNpZ25EYXRhVjMiLCJTaWduRGF0YVY0IiwiU2lnblR4RXJyb3JCb3VuZGFyeSIsInVzZUlzSW50ZXJzZWN0aW5nIiwidXNlTGVkZ2VyRGlzY29ubmVjdGVkRGlhbG9nIiwiTGVkZ2VyQXBwVHlwZSIsIkxlZGdlckFwcHJvdmFsT3ZlcmxheSIsIldhbGxldENvbm5lY3RBcHByb3ZhbE92ZXJsYXkiLCJ1c2VJc1VzaW5nV2FsbGV0Q29ubmVjdEFjY291bnQiLCJ1c2VBcHByb3ZhbEhlbHBlcnMiLCJ1c2VJc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQiLCJGaXJlYmxvY2tzQXBwcm92YWxPdmVybGF5IiwiRnVuY3Rpb25OYW1lcyIsInVzZUlzRnVuY3Rpb25BdmFpbGFibGUiLCJGdW5jdGlvbklzT2ZmbGluZSIsInVzZUFjY291bnRzQ29udGV4dCIsIkFjY291bnRUeXBlIiwidHJ1bmNhdGVBZGRyZXNzIiwiU2lnbk1lc3NhZ2UiLCJyZXF1ZXN0SWQiLCJhY3Rpb24iLCJ1cGRhdGVBY3Rpb24iLCJ1cGRhdGVNZXNzYWdlIiwiaXNVc2luZ0xlZGdlcldhbGxldCIsImlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCIsImlzRmlyZWJsb2Nrc0FjY291bnQiLCJpc0Z1bmN0aW9uQXZhaWxhYmxlIiwiaXNTaWduaW5nQXZhaWxhYmxlIiwiU0lHTiIsImFjY291bnRzIiwiYWN0aXZlIiwiYWN0aXZlQWNjb3VudCIsInByaW1hcnkiLCJwcmltYXJ5QWNjb3VudHMiLCJkaXNhYmxlU3VibWl0QnV0dG9uIiwic2V0RGlzYWJsZVN1Ym1pdEJ1dHRvbiIsIm1lc3NhZ2VBbGVydENsb3NlZCIsInNldE1lc3NhZ2VBbGVydENsb3NlZCIsImVuZENvbnRlbnRSZWYiLCJpc0ludGVyc2VjdGluZyIsInJlZiIsInNpZ25pbmdBY2NvdW50QWRkcmVzcyIsImFjY291bnRJbmRleCIsImRpc3BsYXlEYXRhIiwibWVzc2FnZVBhcmFtcyIsInVuZGVmaW5lZCIsInR5cGUiLCJQUklNQVJZIiwibWV0aG9kIiwiYWRkcmVzc0FWTSIsInNsaWNlIiwiYWRkcmVzc0MiLCJhY2NvdW50VG9Vc2UiLCJ3YWxsZXRJZCIsImZpbmQiLCJhY2NvdW50IiwiaW5kZXgiLCJzaWduTWVzc2FnZSIsInN0YXR1cyIsIlNVQk1JVFRJTkciLCJpZCIsInZpZXdDb21wbGV0ZUhhbmRsZXIiLCJ1cGRhdGVIYW5kbGVyIiwidmFsdWVzIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiaGFuZGxlQXBwcm92YWwiLCJoYW5kbGVSZWplY3Rpb24iLCJpc0FwcHJvdmFsT3ZlcmxheVZpc2libGUiLCJvbkFwcHJvdmUiLCJvblJlamVjdCIsInJlbmRlckRldmljZUFwcHJvdmFsIiwib25TdWJtaXQiLCJBVkFMQU5DSEUiLCJFVEhFUkVVTSIsImRpcmVjdGlvbiIsImZ1bmN0aW9uTmFtZSIsIkZFQVRVUkUiLCJoaWRlUGFnZVRpdGxlIiwiaXNUcmFuc2FjdGlvbk1hbGljaW91cyIsImlzVHJhbnNhY3Rpb25TdXNwaWNpb3VzIiwiZmxleEdyb3ciLCJpc01lc3NhZ2VWYWxpZCIsInZhbGlkYXRpb25FcnJvciIsImN1cnNvciIsInB0IiwicGIiLCJlcnJvciIsInNpdGUiLCJkb21haW4iLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwic3JjIiwibmFtZSIsIndvcmRXcmFwIiwiaTE4bktleSIsIm10IiwiZmxleERpcmVjdGlvbiIsInBsIiwibWVzc2FnZSIsIkFWQUxBTkNIRV9TSUdOIiwiU0lHTl9UWVBFRF9EQVRBIiwiU0lHTl9UWVBFRF9EQVRBX1YxIiwiU0lHTl9UWVBFRF9EQVRBX1YzIiwiU0lHTl9UWVBFRF9EQVRBX1Y0IiwibXkiLCJzdHlsZSIsIm1heEhlaWdodCIsIndvcmRCcmVhayIsImNvbHVtbkdhcCIsImRpc2FibGVkIiwiZm9yd2FyZFJlZiIsIm14Iiwib25VcGRhdGUiLCJkYXRhIiwidG9VdGY4IiwiU2Nyb2xsYWJsZU1lc3NhZ2VDYXJkIiwiY2hpbGRyZW4iLCJzY3JvbGxVcGRhdGVIYW5kbGVyIiwiY29udGVudCIsImJvdHRvbSIsImJhY2tncm91bmRJbWFnZSIsIm1hcCIsIngiLCJpIiwia2V5IiwidmFsdWUiLCJyZW5kZXJSb3ciLCJyb3dEYXRhIiwiT2JqZWN0Iiwia2V5cyIsImxpbmVIZWlnaHQiLCJ0eXBlcyIsInByaW1hcnlUeXBlIiwiZGF0YVdpdGhvdXRUeXBlcyIsIm9wdGlvbnMiLCJzZXRJc0ludGVyc2VjdGluZyIsImlzSW50ZXJzZWN0aW5nQ2FsbGJhY2siLCJlbnRyaWVzIiwiZW50cnkiLCJvYnNlcnZlclJlZlZhbHVlIiwib2JzZXJ2ZXIiLCJJbnRlcnNlY3Rpb25PYnNlcnZlciIsImN1cnJlbnQiLCJvYnNlcnZlIiwidW5vYnNlcnZlIl0sInNvdXJjZVJvb3QiOiIifQ==