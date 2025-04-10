"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ApproveAction_GenericApprovalScreen_tsx"],{

/***/ "./node_modules/@avalabs/core-bridge-sdk/esm/lib/btc/utils.js":
/*!********************************************************************!*\
  !*** ./node_modules/@avalabs/core-bridge-sdk/esm/lib/btc/utils.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "btcToSatoshi": () => (/* binding */ e),
/* harmony export */   "satoshiToBtc": () => (/* binding */ n)
/* harmony export */ });
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_0__);
function e(r){return r.mul(1e8).toNumber()}function n(e){return new (big_js__WEBPACK_IMPORTED_MODULE_0___default())(e).div(1e8)}


/***/ }),

/***/ "./src/pages/ApproveAction/GenericApprovalScreen.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/ApproveAction/GenericApprovalScreen.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GenericApprovalScreen": () => (/* binding */ GenericApprovalScreen)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/common/LoadingOverlay */ "./src/components/common/LoadingOverlay.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_pages_SignTransaction_hooks_useLedgerDisconnectedDialog__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog */ "./src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog.tsx");
/* harmony import */ var _src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/hooks/useIsUsingLedgerWallet */ "./src/hooks/useIsUsingLedgerWallet.ts");
/* harmony import */ var _src_hooks_useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/hooks/useIsUsingKeystoneWallet */ "./src/hooks/useIsUsingKeystoneWallet.ts");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _Send_utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../Send/utils/sendErrorMessages */ "./src/pages/Send/utils/sendErrorMessages.ts");
/* harmony import */ var _src_components_common_approval_TransactionDetailItem__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/components/common/approval/TransactionDetailItem */ "./src/components/common/approval/TransactionDetailItem.tsx");
/* harmony import */ var _hooks_useFeeCustomizer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./hooks/useFeeCustomizer */ "./src/pages/ApproveAction/hooks/useFeeCustomizer.tsx");
/* harmony import */ var _components_DeviceApproval__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/DeviceApproval */ "./src/pages/ApproveAction/components/DeviceApproval.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _SignTransaction_components_TxBalanceChange__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../SignTransaction/components/TxBalanceChange */ "./src/pages/SignTransaction/components/TxBalanceChange.tsx");
/* harmony import */ var _Permissions_components_AlertBox__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../Permissions/components/AlertBox */ "./src/pages/Permissions/components/AlertBox.tsx");
/* harmony import */ var _Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../Permissions/components/WarningBox */ "./src/pages/Permissions/components/WarningBox.tsx");
/* harmony import */ var _src_components_common_MaliciousTxAlert__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @src/components/common/MaliciousTxAlert */ "./src/components/common/MaliciousTxAlert.tsx");
/* harmony import */ var _SignTransaction_components_SpendLimitInfo_SpendLimitInfo__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../SignTransaction/components/SpendLimitInfo/SpendLimitInfo */ "./src/pages/SignTransaction/components/SpendLimitInfo/SpendLimitInfo.tsx");
/* harmony import */ var _SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../SignTransaction/components/ApprovalTxDetails */ "./src/pages/SignTransaction/components/ApprovalTxDetails.tsx");
/* harmony import */ var _src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @src/contexts/NetworkFeeProvider */ "./src/contexts/NetworkFeeProvider.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @src/background/services/gasless/model */ "./src/background/services/gasless/model.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



























function hasContextInfo(context) {
  return typeof context === 'object' && context !== null && 'alert' in context && Boolean(context.alert);
}
function GenericApprovalScreen() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_25__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_3__.useGetRequestId)();
  const {
    action,
    updateAction,
    cancelHandler
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_2__.useApproveAction)(requestId);
  const isUsingLedgerWallet = (0,_src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const isUsingKeystoneWallet = (0,_src_hooks_useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_9__["default"])();
  const [network, setNetwork] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)();
  const {
    getNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_15__.useNetworkContext)();
  const {
    isCalculatingFee,
    feeError,
    hasEnoughForNetworkFee,
    renderFeeWidget
  } = (0,_hooks_useFeeCustomizer__WEBPACK_IMPORTED_MODULE_13__.useFeeCustomizer)({
    action,
    network
  });
  const {
    isGaslessOn,
    gaslessFundTx,
    fundTxHex,
    setGaslessDefaultValues,
    gaslessPhase,
    setGaslessEligibility,
    fetchAndSolveGaslessChallange,
    isGaslessEligible
  } = (0,_src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_22__.useNetworkFeeContext)();
  const {
    captureEncrypted
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_23__.useAnalyticsContext)();
  const {
    displayData,
    context,
    signingData
  } = action ?? {};
  const hasFeeSelector = action?.displayData.networkFeeSelector;
  const isFeeValid = isGaslessOn && isGaslessEligible || !hasFeeSelector || !feeError && !isCalculatingFee && hasEnoughForNetworkFee;
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!displayData?.network?.chainId) {
      return;
    }
    setNetwork(getNetwork(displayData.network.chainId));
    if (signingData && signingData.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_6__.RpcMethod.ETH_SEND_TRANSACTION) {
      setGaslessEligibility(displayData.network.chainId, signingData?.data?.from, signingData?.data?.nonce);
      return;
    }
    setGaslessEligibility(displayData.network.chainId);
  }, [displayData, displayData?.network?.chainId, fetchAndSolveGaslessChallange, getNetwork, setGaslessEligibility, signingData]);
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.NOT_READY && isGaslessEligible) {
      fetchAndSolveGaslessChallange();
    }
  }, [fetchAndSolveGaslessChallange, gaslessPhase, isGaslessEligible]);
  const handleRejection = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => {
    setGaslessDefaultValues();
    cancelHandler();
  }, [cancelHandler, setGaslessDefaultValues]);
  const signTx = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async () => {
    if (isGaslessOn && isGaslessEligible) {
      return await gaslessFundTx(action?.signingData);
    }
    updateAction({
      status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
      id: requestId
    }, isUsingLedgerWallet || isUsingKeystoneWallet);
  }, [action?.signingData, gaslessFundTx, isGaslessEligible, isGaslessOn, isUsingKeystoneWallet, isUsingLedgerWallet, requestId, updateAction]);
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.ERROR) {
      captureEncrypted('GaslessFundFailed');
    }
    if (gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.FUNDED && fundTxHex) {
      captureEncrypted('GaslessFundSuccessful', {
        fundTxHex
      });
      updateAction({
        status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
        id: requestId
      }, isUsingLedgerWallet || isUsingKeystoneWallet);
      setGaslessDefaultValues();
    }
  }, [captureEncrypted, fundTxHex, gaslessPhase, isUsingKeystoneWallet, isUsingLedgerWallet, network, requestId, setGaslessDefaultValues, t, updateAction]);

  // Make the user switch to the correct app or close the window
  (0,_src_pages_SignTransaction_hooks_useLedgerDisconnectedDialog__WEBPACK_IMPORTED_MODULE_7__.useLedgerDisconnectedDialog)(handleRejection, undefined, network);
  if (!action || !displayData) {
    return /*#__PURE__*/React.createElement(_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_5__.LoadingOverlay, null);
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Stack, {
    sx: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Box, {
    sx: {
      width: '100%',
      pt: 1,
      pb: 2,
      px: 2,
      zIndex: 1,
      height: '56px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Typography, {
    variant: "h4"
  }, context?.customApprovalScreenTitle || displayData.title)), displayData.alert && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Stack, {
    sx: {
      width: 1,
      px: 2,
      mb: 1
    }
  }, displayData.alert.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_6__.AlertType.DANGER ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_MaliciousTxAlert__WEBPACK_IMPORTED_MODULE_19__.MaliciousTxAlert, {
    showAlert: true,
    cancelHandler: handleRejection,
    actionTitles: displayData.alert.details.actionTitles,
    title: displayData.alert.details.title,
    description: displayData.alert.details.description
  }), /*#__PURE__*/React.createElement(_Permissions_components_AlertBox__WEBPACK_IMPORTED_MODULE_17__.AlertBox, {
    title: displayData.alert.details.title,
    text: displayData.alert.details.description
  })) : /*#__PURE__*/React.createElement(_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_18__.WarningBox, {
    title: displayData.alert.details.title,
    text: displayData.alert.details.description
  })), gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.ERROR && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Stack, {
    sx: {
      width: 1,
      px: 2,
      mb: 1
    }
  }, /*#__PURE__*/React.createElement(_Permissions_components_AlertBox__WEBPACK_IMPORTED_MODULE_17__.AlertBox, {
    title: t('Gasless Error'),
    text: t(`We're unable to cover the gas fees for your transaction at this time. As a result, this feature has been disabled.`)
  })), hasContextInfo(context) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Stack, {
    sx: {
      width: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Alert, {
    severity: context.alert.type,
    sx: {
      width: 1,
      py: 0,
      mb: 1,
      mt: -1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.AlertTitle, null, context.alert.title), context.alert.notice && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.AlertContent, null, context.alert.notice))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Scrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Stack, {
    sx: {
      flex: 1,
      width: 1,
      px: 2,
      gap: 2,
      pb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Stack, {
    sx: {
      width: '100%',
      gap: 3,
      pt: 1
    }
  }, displayData.details.map((section, sectionIndex) => /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_10__.ApprovalSection, {
    key: `tx-detail-section-${sectionIndex}`
  }, section.title && /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_10__.ApprovalSectionHeader, {
    label: section.title
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_10__.ApprovalSectionBody, {
    sx: {
      py: 1
    }
  }, sectionIndex === 0 && network && /*#__PURE__*/React.createElement(_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_21__.NetworkDetails, {
    network: network
  }), section.items.map((item, index) => /*#__PURE__*/React.createElement(_src_components_common_approval_TransactionDetailItem__WEBPACK_IMPORTED_MODULE_12__.TransactionDetailItem, {
    key: `tx-detail.${sectionIndex}.${index}`,
    item: item
  }))))), displayData.balanceChange && /*#__PURE__*/React.createElement(_SignTransaction_components_TxBalanceChange__WEBPACK_IMPORTED_MODULE_16__.TxBalanceChange, {
    ins: displayData.balanceChange.ins,
    outs: displayData.balanceChange.outs,
    isSimulationSuccessful: displayData.isSimulationSuccessful
  }), displayData.tokenApprovals && /*#__PURE__*/React.createElement(_SignTransaction_components_SpendLimitInfo_SpendLimitInfo__WEBPACK_IMPORTED_MODULE_20__.SpendLimitInfo, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, displayData.tokenApprovals, {
    actionId: requestId
  }))), isGaslessEligible === null ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Stack, {
    sx: {
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Skeleton, {
    sx: {
      width: '100%',
      height: 140
    }
  })) : displayData.networkFeeSelector && renderFeeWidget())), feeError && !isGaslessOn && isGaslessEligible !== null && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Typography, {
    variant: "caption",
    color: "error.main",
    sx: {
      mt: -1
    }
  }, (0,_Send_utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_11__.getSendErrorMessage)(feeError))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      justifyContent: 'space-between',
      pt: 1.5,
      px: 2,
      pb: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Button, {
    color: "secondary",
    "data-testid": "transaction-reject-btn",
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING || gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.FUNDING_IN_PROGRESS,
    size: "large",
    fullWidth: true,
    onClick: handleRejection
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Tooltip, {
    title: gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.NOT_READY && isGaslessOn && t(`If you're looking to approve the transaction despite the gasless feature, please turn it off to proceed.`),
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_26__.Button, {
    "data-testid": "transaction-approve-btn",
    disabled: !displayData || action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING || !isFeeValid || isGaslessOn && (gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.FUNDING_IN_PROGRESS || gaslessPhase !== _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.READY),
    isLoading: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING || isCalculatingFee || gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.FUNDING_IN_PROGRESS,
    size: "large",
    fullWidth: true,
    onClick: signTx
  }, gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_24__.GaslessPhase.FUNDING_IN_PROGRESS ? t('Approving') : context?.customApprovalButtonText || t('Approve')))), /*#__PURE__*/React.createElement(_components_DeviceApproval__WEBPACK_IMPORTED_MODULE_14__.DeviceApproval, {
    action: action,
    handleRejection: handleRejection,
    network: network
  }));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/DeviceApproval.tsx":
/*!***************************************************************!*\
  !*** ./src/pages/ApproveAction/components/DeviceApproval.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeviceApproval": () => (/* binding */ DeviceApproval)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/lib/btc/utils.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_hooks_useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useIsUsingKeystoneWallet */ "./src/hooks/useIsUsingKeystoneWallet.ts");
/* harmony import */ var _src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useIsUsingLedgerWallet */ "./src/hooks/useIsUsingLedgerWallet.ts");
/* harmony import */ var _src_pages_SignTransaction_components_LedgerApprovalOverlay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/pages/SignTransaction/components/LedgerApprovalOverlay */ "./src/pages/SignTransaction/components/LedgerApprovalOverlay.tsx");
/* harmony import */ var _src_pages_SignTransaction_components_KeystoneApprovalOverlay__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/pages/SignTransaction/components/KeystoneApprovalOverlay */ "./src/pages/SignTransaction/components/KeystoneApprovalOverlay.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








const getTxInfoForLedger = (signingData, network) => {
  if (signingData.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.RpcMethod.BITCOIN_SEND_TRANSACTION) {
    return {
      amount: (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_6__.satoshiToBtc)(signingData.data.amount).toFixed(8),
      fee: (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_6__.satoshiToBtc)(signingData.data.fee).toFixed(8),
      to: signingData.data.to,
      symbol: signingData.data.balance.symbol,
      feeSymbol: network.networkToken.symbol
    };
  }
  if (signingData.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.RpcMethod.ETH_SEND_TRANSACTION) {
    const {
      maxFeePerGas,
      gasPrice,
      gasLimit
    } = signingData.data;
    const pricePerGas = maxFeePerGas ?? gasPrice ?? 0;
    const feeBigInt = gasLimit ? BigInt(pricePerGas) * BigInt(gasLimit) : 0;
    const fee = feeBigInt ? new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_7__.TokenUnit(feeBigInt, network.networkToken.decimals, network.networkToken.symbol) : undefined;
    return {
      fee: fee?.toString(),
      feeSymbol: network.networkToken.symbol,
      to: signingData.data.to
    };
  }
  return null;
};
const DeviceApproval = ({
  action,
  network,
  handleRejection
}) => {
  const isUsingLedgerWallet = (0,_src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const isUsingKeystoneWallet = (0,_src_hooks_useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_2__["default"])();
  if (!action || !network || !action.signingData) {
    return null;
  }
  if (action.status !== _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING) {
    return null;
  }
  if (isUsingLedgerWallet) {
    return /*#__PURE__*/React.createElement(_src_pages_SignTransaction_components_LedgerApprovalOverlay__WEBPACK_IMPORTED_MODULE_4__.LedgerApprovalOverlay, getTxInfoForLedger(action.signingData, network));
  }
  if (isUsingKeystoneWallet) {
    return /*#__PURE__*/React.createElement(_src_pages_SignTransaction_components_KeystoneApprovalOverlay__WEBPACK_IMPORTED_MODULE_5__.KeystoneApprovalOverlay, {
      onReject: handleRejection
    });
  }
  return null;
};

/***/ }),

/***/ "./src/pages/Send/utils/sendErrorMessages.ts":
/*!***************************************************!*\
  !*** ./src/pages/Send/utils/sendErrorMessages.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getSendErrorMessage": () => (/* binding */ getSendErrorMessage)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");


function getSendErrorMessage(key, details) {
  if (key === _src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.AMOUNT_TOO_LOW) {
    return details?.minAmount ? (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('At least {{minAmount}} is required', details) : (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Amount too low');
  }
  const translations = {
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.AMOUNT_REQUIRED]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Amount required'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.ADDRESS_REQUIRED]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Address required'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INVALID_ADDRESS]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Address is invalid'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INVALID_NETWORK_FEE]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Network Fee is invalid'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Insufficient balance.'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Insufficient balance for fee'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.TOKEN_REQUIRED]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Token is required'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.UNABLE_TO_FETCH_UTXOS]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Internal error. Please try again'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.UNSUPPORTED_TOKEN]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Unsupported token'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.UNKNOWN_ERROR]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Unknown error'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.EXCESSIVE_NETWORK_FEE]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Selected fee is too high')
  };
  return translations[key] ?? key;
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FwcHJvdmVBY3Rpb25fR2VuZXJpY0FwcHJvdmFsU2NyZWVuX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFzQixjQUFjLDZCQUE2QixjQUFjLFdBQVcsK0NBQUMsYUFBeUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTdFO0FBQ1I7QUFDRjtBQUNKO0FBQ2U7QUFDekI7QUFDOEI7QUFZeEM7QUFDc0U7QUFDcEM7QUFDSTtBQUtsQjtBQUNhO0FBQ3dCO0FBQ2xDO0FBQ0M7QUFFSztBQUNjO0FBQ2xCO0FBQ0k7QUFDUztBQUNrQjtBQUNaO0FBQ1Q7QUFDRjtBQUNBO0FBTXRFLFNBQVN3QyxjQUFjQSxDQUNyQkMsT0FBaUMsRUFDSjtFQUM3QixPQUNFLE9BQU9BLE9BQU8sS0FBSyxRQUFRLElBQzNCQSxPQUFPLEtBQUssSUFBSSxJQUNoQixPQUFPLElBQUlBLE9BQU8sSUFDbEJDLE9BQU8sQ0FBQ0QsT0FBTyxDQUFDRSxLQUFLLENBQUM7QUFFMUI7QUFFTyxTQUFTQyxxQkFBcUJBLENBQUEsRUFBRztFQUN0QyxNQUFNO0lBQUVDO0VBQUUsQ0FBQyxHQUFHdEMsOERBQWMsRUFBRTtFQUM5QixNQUFNdUMsU0FBUyxHQUFHNUMsMkVBQWUsRUFBRTtFQUNuQyxNQUFNO0lBQUU2QyxNQUFNO0lBQUVDLFlBQVk7SUFBRUM7RUFBYyxDQUFDLEdBQzNDaEQsNkVBQWdCLENBQWM2QyxTQUFTLENBQUM7RUFDMUMsTUFBTUksbUJBQW1CLEdBQUc3Qiw2RUFBc0IsRUFBRTtFQUNwRCxNQUFNOEIscUJBQXFCLEdBQUc3QiwrRUFBd0IsRUFBRTtFQUN4RCxNQUFNLENBQUM4QixPQUFPLEVBQUVDLFVBQVUsQ0FBQyxHQUFHaEQsK0NBQVEsRUFBcUI7RUFDM0QsTUFBTTtJQUFFaUQ7RUFBVyxDQUFDLEdBQUd4QixpRkFBaUIsRUFBRTtFQUMxQyxNQUFNO0lBQ0p5QixnQkFBZ0I7SUFDaEJDLFFBQVE7SUFDUkMsc0JBQXNCO0lBQ3RCQztFQUNGLENBQUMsR0FBRzlCLDBFQUFnQixDQUFDO0lBQ25CbUIsTUFBTTtJQUNOSztFQUNGLENBQUMsQ0FBQztFQUNGLE1BQU07SUFDSk8sV0FBVztJQUNYQyxhQUFhO0lBQ2JDLFNBQVM7SUFDVEMsdUJBQXVCO0lBQ3ZCQyxZQUFZO0lBQ1pDLHFCQUFxQjtJQUNyQkMsNkJBQTZCO0lBQzdCQztFQUNGLENBQUMsR0FBRzdCLHVGQUFvQixFQUFFO0VBRTFCLE1BQU07SUFBRThCO0VBQWlCLENBQUMsR0FBRzdCLHFGQUFtQixFQUFFO0VBRWxELE1BQU07SUFBRThCLFdBQVc7SUFBRTNCLE9BQU87SUFBRTRCO0VBQVksQ0FBQyxHQUFHdEIsTUFBTSxJQUFJLENBQUMsQ0FBQztFQUMxRCxNQUFNdUIsY0FBYyxHQUFHdkIsTUFBTSxFQUFFcUIsV0FBVyxDQUFDRyxrQkFBa0I7RUFDN0QsTUFBTUMsVUFBVSxHQUNiYixXQUFXLElBQUlPLGlCQUFpQixJQUNqQyxDQUFDSSxjQUFjLElBQ2QsQ0FBQ2QsUUFBUSxJQUFJLENBQUNELGdCQUFnQixJQUFJRSxzQkFBdUI7RUFFNURyRCxnREFBUyxDQUFDLE1BQU07SUFDZCxJQUFJLENBQUNnRSxXQUFXLEVBQUVoQixPQUFPLEVBQUVxQixPQUFPLEVBQUU7TUFDbEM7SUFDRjtJQUVBcEIsVUFBVSxDQUFDQyxVQUFVLENBQUNjLFdBQVcsQ0FBQ2hCLE9BQU8sQ0FBQ3FCLE9BQU8sQ0FBQyxDQUFDO0lBRW5ELElBQUlKLFdBQVcsSUFBSUEsV0FBVyxDQUFDSyxJQUFJLEtBQUtqRSxvRkFBOEIsRUFBRTtNQUN0RXVELHFCQUFxQixDQUNuQkksV0FBVyxDQUFDaEIsT0FBTyxDQUFDcUIsT0FBTyxFQUMzQkosV0FBVyxFQUFFTyxJQUFJLEVBQUVDLElBQUksRUFDdkJSLFdBQVcsRUFBRU8sSUFBSSxFQUFFRSxLQUFLLENBQ3pCO01BQ0Q7SUFDRjtJQUNBZCxxQkFBcUIsQ0FBQ0ksV0FBVyxDQUFDaEIsT0FBTyxDQUFDcUIsT0FBTyxDQUFDO0VBQ3BELENBQUMsRUFBRSxDQUNETCxXQUFXLEVBQ1hBLFdBQVcsRUFBRWhCLE9BQU8sRUFBRXFCLE9BQU8sRUFDN0JSLDZCQUE2QixFQUM3QlgsVUFBVSxFQUNWVSxxQkFBcUIsRUFDckJLLFdBQVcsQ0FDWixDQUFDO0VBRUZqRSxnREFBUyxDQUFDLE1BQU07SUFDZCxJQUFJMkQsWUFBWSxLQUFLeEIsMkZBQXNCLElBQUkyQixpQkFBaUIsRUFBRTtNQUNoRUQsNkJBQTZCLEVBQUU7SUFDakM7RUFDRixDQUFDLEVBQUUsQ0FBQ0EsNkJBQTZCLEVBQUVGLFlBQVksRUFBRUcsaUJBQWlCLENBQUMsQ0FBQztFQUVwRSxNQUFNYyxlQUFlLEdBQUc3RSxrREFBVyxDQUFDLE1BQU07SUFDeEMyRCx1QkFBdUIsRUFBRTtJQUN6QmIsYUFBYSxFQUFFO0VBQ2pCLENBQUMsRUFBRSxDQUFDQSxhQUFhLEVBQUVhLHVCQUF1QixDQUFDLENBQUM7RUFFNUMsTUFBTW1CLE1BQU0sR0FBRzlFLGtEQUFXLENBQUMsWUFBWTtJQUNyQyxJQUFJd0QsV0FBVyxJQUFJTyxpQkFBaUIsRUFBRTtNQUNwQyxPQUFPLE1BQU1OLGFBQWEsQ0FBQ2IsTUFBTSxFQUFFc0IsV0FBVyxDQUFDO0lBQ2pEO0lBQ0FyQixZQUFZLENBQ1Y7TUFDRWtDLE1BQU0sRUFBRWxGLDRGQUF1QjtNQUMvQm9GLEVBQUUsRUFBRXRDO0lBQ04sQ0FBQyxFQUNESSxtQkFBbUIsSUFBSUMscUJBQXFCLENBQzdDO0VBQ0gsQ0FBQyxFQUFFLENBQ0RKLE1BQU0sRUFBRXNCLFdBQVcsRUFDbkJULGFBQWEsRUFDYk0saUJBQWlCLEVBQ2pCUCxXQUFXLEVBQ1hSLHFCQUFxQixFQUNyQkQsbUJBQW1CLEVBQ25CSixTQUFTLEVBQ1RFLFlBQVksQ0FDYixDQUFDO0VBRUY1QyxnREFBUyxDQUFDLE1BQU07SUFDZCxJQUFJMkQsWUFBWSxLQUFLeEIsdUZBQWtCLEVBQUU7TUFDdkM0QixnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQztJQUN2QztJQUNBLElBQUlKLFlBQVksS0FBS3hCLHdGQUFtQixJQUFJc0IsU0FBUyxFQUFFO01BQ3JETSxnQkFBZ0IsQ0FBQyx1QkFBdUIsRUFBRTtRQUN4Q047TUFDRixDQUFDLENBQUM7TUFDRmIsWUFBWSxDQUNWO1FBQ0VrQyxNQUFNLEVBQUVsRiw0RkFBdUI7UUFDL0JvRixFQUFFLEVBQUV0QztNQUNOLENBQUMsRUFDREksbUJBQW1CLElBQUlDLHFCQUFxQixDQUM3QztNQUNEVyx1QkFBdUIsRUFBRTtJQUMzQjtFQUNGLENBQUMsRUFBRSxDQUNESyxnQkFBZ0IsRUFDaEJOLFNBQVMsRUFDVEUsWUFBWSxFQUNaWixxQkFBcUIsRUFDckJELG1CQUFtQixFQUNuQkUsT0FBTyxFQUNQTixTQUFTLEVBQ1RnQix1QkFBdUIsRUFDdkJqQixDQUFDLEVBQ0RHLFlBQVksQ0FDYixDQUFDOztFQUVGO0VBQ0E1Qix5SEFBMkIsQ0FBQzRELGVBQWUsRUFBRU8sU0FBUyxFQUFFbkMsT0FBTyxDQUFDO0VBRWhFLElBQUksQ0FBQ0wsTUFBTSxJQUFJLENBQUNxQixXQUFXLEVBQUU7SUFDM0Isb0JBQU9vQixLQUFBLENBQUFDLGFBQUEsQ0FBQ25GLDZFQUFjLE9BQUc7RUFDM0I7RUFFQSxvQkFDRWtGLEtBQUEsQ0FBQUMsYUFBQSxDQUFDeEUsK0RBQUs7SUFDSnlFLEVBQUUsRUFBRTtNQUNGQyxLQUFLLEVBQUUsTUFBTTtNQUNiQyxNQUFNLEVBQUU7SUFDVjtFQUFFLGdCQUVGSixLQUFBLENBQUFDLGFBQUEsQ0FBQ3hFLCtEQUFLO0lBQ0p5RSxFQUFFLEVBQUU7TUFDRkMsS0FBSyxFQUFFLE1BQU07TUFDYkMsTUFBTSxFQUFFLE1BQU07TUFDZEMsVUFBVSxFQUFFO0lBQ2Q7RUFBRSxnQkFHRkwsS0FBQSxDQUFBQyxhQUFBLENBQUM1RSw2REFBRztJQUNGNkUsRUFBRSxFQUFFO01BQ0ZDLEtBQUssRUFBRSxNQUFNO01BQ2JHLEVBQUUsRUFBRSxDQUFDO01BQ0xDLEVBQUUsRUFBRSxDQUFDO01BQ0xDLEVBQUUsRUFBRSxDQUFDO01BQ0xDLE1BQU0sRUFBRSxDQUFDO01BQ1RMLE1BQU0sRUFBRTtJQUNWO0VBQUUsZ0JBRUZKLEtBQUEsQ0FBQUMsYUFBQSxDQUFDdEUsb0VBQVU7SUFBQytFLE9BQU8sRUFBQztFQUFJLEdBQ3JCekQsT0FBTyxFQUFFMEQseUJBQXlCLElBQUkvQixXQUFXLENBQUNnQyxLQUFLLENBQzdDLENBQ1QsRUFFTGhDLFdBQVcsQ0FBQ3pCLEtBQUssaUJBQ2hCNkMsS0FBQSxDQUFBQyxhQUFBLENBQUN4RSwrREFBSztJQUFDeUUsRUFBRSxFQUFFO01BQUVDLEtBQUssRUFBRSxDQUFDO01BQUVLLEVBQUUsRUFBRSxDQUFDO01BQUVLLEVBQUUsRUFBRTtJQUFFO0VBQUUsR0FDbkNqQyxXQUFXLENBQUN6QixLQUFLLENBQUMrQixJQUFJLEtBQUtsRSxzRUFBZ0IsZ0JBQzFDZ0YsS0FBQSxDQUFBQyxhQUFBLENBQUFELEtBQUEsQ0FBQWUsUUFBQSxxQkFDRWYsS0FBQSxDQUFBQyxhQUFBLENBQUN2RCxzRkFBZ0I7SUFDZnNFLFNBQVM7SUFDVHZELGFBQWEsRUFBRStCLGVBQWdCO0lBQy9CeUIsWUFBWSxFQUFFckMsV0FBVyxDQUFDekIsS0FBSyxDQUFDK0QsT0FBTyxDQUFDRCxZQUFhO0lBQ3JETCxLQUFLLEVBQUVoQyxXQUFXLENBQUN6QixLQUFLLENBQUMrRCxPQUFPLENBQUNOLEtBQU07SUFDdkNPLFdBQVcsRUFBRXZDLFdBQVcsQ0FBQ3pCLEtBQUssQ0FBQytELE9BQU8sQ0FBQ0M7RUFBWSxFQUNuRCxlQUNGbkIsS0FBQSxDQUFBQyxhQUFBLENBQUN6RCx1RUFBUTtJQUNQb0UsS0FBSyxFQUFFaEMsV0FBVyxDQUFDekIsS0FBSyxDQUFDK0QsT0FBTyxDQUFDTixLQUFNO0lBQ3ZDUSxJQUFJLEVBQUV4QyxXQUFXLENBQUN6QixLQUFLLENBQUMrRCxPQUFPLENBQUNDO0VBQVksRUFDNUMsQ0FDRCxnQkFFSG5CLEtBQUEsQ0FBQUMsYUFBQSxDQUFDeEQsMkVBQVU7SUFDVG1FLEtBQUssRUFBRWhDLFdBQVcsQ0FBQ3pCLEtBQUssQ0FBQytELE9BQU8sQ0FBQ04sS0FBTTtJQUN2Q1EsSUFBSSxFQUFFeEMsV0FBVyxDQUFDekIsS0FBSyxDQUFDK0QsT0FBTyxDQUFDQztFQUFZLEVBRS9DLENBRUosRUFFQTVDLFlBQVksS0FBS3hCLHVGQUFrQixpQkFDbENpRCxLQUFBLENBQUFDLGFBQUEsQ0FBQ3hFLCtEQUFLO0lBQUN5RSxFQUFFLEVBQUU7TUFBRUMsS0FBSyxFQUFFLENBQUM7TUFBRUssRUFBRSxFQUFFLENBQUM7TUFBRUssRUFBRSxFQUFFO0lBQUU7RUFBRSxnQkFDcENiLEtBQUEsQ0FBQUMsYUFBQSxDQUFDekQsdUVBQVE7SUFDUG9FLEtBQUssRUFBRXZELENBQUMsQ0FBQyxlQUFlLENBQUU7SUFDMUIrRCxJQUFJLEVBQUUvRCxDQUFDLENBQ0osb0hBQW1IO0VBQ3BILEVBQ0YsQ0FFTCxFQUVBTCxjQUFjLENBQUNDLE9BQU8sQ0FBQyxpQkFDdEIrQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ3hFLCtEQUFLO0lBQUN5RSxFQUFFLEVBQUU7TUFBRUMsS0FBSyxFQUFFLENBQUM7TUFBRUssRUFBRSxFQUFFO0lBQUU7RUFBRSxnQkFDN0JSLEtBQUEsQ0FBQUMsYUFBQSxDQUFDL0UsK0RBQUs7SUFDSm1HLFFBQVEsRUFBRXBFLE9BQU8sQ0FBQ0UsS0FBSyxDQUFDK0IsSUFBSztJQUM3QmdCLEVBQUUsRUFBRTtNQUFFQyxLQUFLLEVBQUUsQ0FBQztNQUFFbUIsRUFBRSxFQUFFLENBQUM7TUFBRVQsRUFBRSxFQUFFLENBQUM7TUFBRVUsRUFBRSxFQUFFLENBQUM7SUFBRTtFQUFFLGdCQUV2Q3ZCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDN0Usb0VBQVUsUUFBRTZCLE9BQU8sQ0FBQ0UsS0FBSyxDQUFDeUQsS0FBSyxDQUFjLEVBQzdDM0QsT0FBTyxDQUFDRSxLQUFLLENBQUNxRSxNQUFNLGlCQUNuQnhCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDOUUsc0VBQVksUUFBRThCLE9BQU8sQ0FBQ0UsS0FBSyxDQUFDcUUsTUFBTSxDQUNwQyxDQUNLLENBRVgsZUFFRHhCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMUUsb0VBQVUscUJBQ1R5RSxLQUFBLENBQUFDLGFBQUEsQ0FBQ3hFLCtEQUFLO0lBQUN5RSxFQUFFLEVBQUU7TUFBRXVCLElBQUksRUFBRSxDQUFDO01BQUV0QixLQUFLLEVBQUUsQ0FBQztNQUFFSyxFQUFFLEVBQUUsQ0FBQztNQUFFa0IsR0FBRyxFQUFFLENBQUM7TUFBRW5CLEVBQUUsRUFBRTtJQUFFO0VBQUUsZ0JBQ3JEUCxLQUFBLENBQUFDLGFBQUEsQ0FBQ3hFLCtEQUFLO0lBQUN5RSxFQUFFLEVBQUU7TUFBRUMsS0FBSyxFQUFFLE1BQU07TUFBRXVCLEdBQUcsRUFBRSxDQUFDO01BQUVwQixFQUFFLEVBQUU7SUFBRTtFQUFFLEdBQ3pDMUIsV0FBVyxDQUFDc0MsT0FBTyxDQUFDUyxHQUFHLENBQUMsQ0FBQ0MsT0FBTyxFQUFFQyxZQUFZLGtCQUM3QzdCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbEUsNkZBQWU7SUFBQytGLEdBQUcsRUFBRyxxQkFBb0JELFlBQWE7RUFBRSxHQUN2REQsT0FBTyxDQUFDaEIsS0FBSyxpQkFDWlosS0FBQSxDQUFBQyxhQUFBLENBQUNoRSxtR0FBcUI7SUFBQzhGLEtBQUssRUFBRUgsT0FBTyxDQUFDaEI7RUFBTSxFQUM3QyxlQUNEWixLQUFBLENBQUFDLGFBQUEsQ0FBQ2pFLGlHQUFtQjtJQUFDa0UsRUFBRSxFQUFFO01BQUVvQixFQUFFLEVBQUU7SUFBRTtFQUFFLEdBQ2hDTyxZQUFZLEtBQUssQ0FBQyxJQUFJakUsT0FBTyxpQkFDNUJvQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ3JELDBGQUFjO0lBQUNnQixPQUFPLEVBQUVBO0VBQVEsRUFDbEMsRUFDQWdFLE9BQU8sQ0FBQ0ksS0FBSyxDQUFDTCxHQUFHLENBQUMsQ0FBQ00sSUFBSSxFQUFFQyxLQUFLLGtCQUM3QmxDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDOUQseUdBQXFCO0lBQ3BCMkYsR0FBRyxFQUFHLGFBQVlELFlBQWEsSUFBR0ssS0FBTSxFQUFFO0lBQzFDRCxJQUFJLEVBQUVBO0VBQUssRUFFZCxDQUFDLENBQ2tCLENBRXpCLENBQUMsRUFDRHJELFdBQVcsQ0FBQ3VELGFBQWEsaUJBQ3hCbkMsS0FBQSxDQUFBQyxhQUFBLENBQUMxRCx5RkFBZTtJQUNkNkYsR0FBRyxFQUFFeEQsV0FBVyxDQUFDdUQsYUFBYSxDQUFDQyxHQUFJO0lBQ25DQyxJQUFJLEVBQUV6RCxXQUFXLENBQUN1RCxhQUFhLENBQUNFLElBQUs7SUFDckNDLHNCQUFzQixFQUFFMUQsV0FBVyxDQUFDMEQ7RUFBdUIsRUFFOUQsRUFDQTFELFdBQVcsQ0FBQzJELGNBQWMsaUJBQ3pCdkMsS0FBQSxDQUFBQyxhQUFBLENBQUN0RCxzR0FBYyxFQUFBNkYsMEVBQUEsS0FDVDVELFdBQVcsQ0FBQzJELGNBQWM7SUFDOUJFLFFBQVEsRUFBRW5GO0VBQVUsR0FFdkIsQ0FDSyxFQUNQb0IsaUJBQWlCLEtBQUssSUFBSSxnQkFDekJzQixLQUFBLENBQUFDLGFBQUEsQ0FBQ3hFLCtEQUFLO0lBQ0p5RSxFQUFFLEVBQUU7TUFDRndDLGNBQWMsRUFBRSxRQUFRO01BQ3hCckMsVUFBVSxFQUFFO0lBQ2Q7RUFBRSxnQkFFRkwsS0FBQSxDQUFBQyxhQUFBLENBQUN6RSxrRUFBUTtJQUFDMEUsRUFBRSxFQUFFO01BQUVDLEtBQUssRUFBRSxNQUFNO01BQUVDLE1BQU0sRUFBRTtJQUFJO0VBQUUsRUFBRyxDQUMxQyxHQUVSeEIsV0FBVyxDQUFDRyxrQkFBa0IsSUFBSWIsZUFBZSxFQUNsRCxDQUNLLENBQ0csRUFDWkYsUUFBUSxJQUFJLENBQUNHLFdBQVcsSUFBSU8saUJBQWlCLEtBQUssSUFBSSxpQkFDckRzQixLQUFBLENBQUFDLGFBQUEsQ0FBQ3RFLG9FQUFVO0lBQUMrRSxPQUFPLEVBQUMsU0FBUztJQUFDaUMsS0FBSyxFQUFDLFlBQVk7SUFBQ3pDLEVBQUUsRUFBRTtNQUFFcUIsRUFBRSxFQUFFLENBQUM7SUFBRTtFQUFFLEdBQzdEckYsbUZBQW1CLENBQUM4QixRQUFRLENBQUMsQ0FFakMsQ0FDSyxlQUVSZ0MsS0FBQSxDQUFBQyxhQUFBLENBQUN4RSwrREFBSztJQUNKeUUsRUFBRSxFQUFFO01BQ0YwQyxhQUFhLEVBQUUsS0FBSztNQUNwQnZDLFVBQVUsRUFBRSxVQUFVO01BQ3RCRixLQUFLLEVBQUUsTUFBTTtNQUNidUMsY0FBYyxFQUFFLGVBQWU7TUFDL0JwQyxFQUFFLEVBQUUsR0FBRztNQUNQRSxFQUFFLEVBQUUsQ0FBQztNQUNMRCxFQUFFLEVBQUUsQ0FBQztNQUNMbUIsR0FBRyxFQUFFO0lBQ1A7RUFBRSxnQkFFRjFCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0UsZ0VBQU07SUFDTHFILEtBQUssRUFBQyxXQUFXO0lBQ2pCLGVBQVksd0JBQXdCO0lBQ3BDRSxRQUFRLEVBQ050RixNQUFNLENBQUNtQyxNQUFNLEtBQUtsRiw0RkFBdUIsSUFDekMrRCxZQUFZLEtBQUt4QixxR0FDbEI7SUFDRGdHLElBQUksRUFBQyxPQUFPO0lBQ1pDLFNBQVM7SUFDVEMsT0FBTyxFQUFFekQ7RUFBZ0IsR0FFeEJuQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ0wsZUFDVDJDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDdkUsaUVBQU87SUFDTmtGLEtBQUssRUFDSHJDLFlBQVksS0FBS3hCLDJGQUFzQixJQUN2Q29CLFdBQVcsSUFDWGQsQ0FBQyxDQUNFLDBHQUF5RyxDQUU3RztJQUNENkMsRUFBRSxFQUFFO01BQUVDLEtBQUssRUFBRTtJQUFPO0VBQUUsZ0JBRXRCSCxLQUFBLENBQUFDLGFBQUEsQ0FBQzNFLGdFQUFNO0lBQ0wsZUFBWSx5QkFBeUI7SUFDckN1SCxRQUFRLEVBQ04sQ0FBQ2pFLFdBQVcsSUFDWnJCLE1BQU0sQ0FBQ21DLE1BQU0sS0FBS2xGLDRGQUF1QixJQUN6QyxDQUFDd0UsVUFBVSxJQUNWYixXQUFXLEtBQ1RJLFlBQVksS0FBS3hCLHFHQUFnQyxJQUNoRHdCLFlBQVksS0FBS3hCLHVGQUFrQixDQUN4QztJQUNEb0csU0FBUyxFQUNQNUYsTUFBTSxDQUFDbUMsTUFBTSxLQUFLbEYsNEZBQXVCLElBQ3pDdUQsZ0JBQWdCLElBQ2hCUSxZQUFZLEtBQUt4QixxR0FDbEI7SUFDRGdHLElBQUksRUFBQyxPQUFPO0lBQ1pDLFNBQVM7SUFDVEMsT0FBTyxFQUFFeEQ7RUFBTyxHQUVmbEIsWUFBWSxLQUFLeEIscUdBQWdDLEdBQzlDTSxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQ2RKLE9BQU8sRUFBRW1HLHdCQUF3QixJQUFJL0YsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUM5QyxDQUNELENBQ0osZUFDUjJDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNUQsdUVBQWM7SUFDYmtCLE1BQU0sRUFBRUEsTUFBTztJQUNmaUMsZUFBZSxFQUFFQSxlQUFnQjtJQUNqQzVCLE9BQU8sRUFBRUE7RUFBUSxFQUNqQixDQUNJO0FBRVo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMVl3RDtBQUNVO0FBQ2Q7QUFFMkI7QUFFSjtBQUNKO0FBRTZCO0FBQ0k7QUFFeEcsTUFBTTZGLGtCQUFrQixHQUFHQSxDQUN6QjVFLFdBQXdCLEVBQ3hCakIsT0FBMEIsS0FDdkI7RUFDSCxJQUFJaUIsV0FBVyxDQUFDSyxJQUFJLEtBQUtqRSx3RkFBa0MsRUFBRTtJQUMzRCxPQUFPO01BQ0wwSSxNQUFNLEVBQUVOLHNFQUFZLENBQUN4RSxXQUFXLENBQUNPLElBQUksQ0FBQ3VFLE1BQU0sQ0FBQyxDQUFDQyxPQUFPLENBQUMsQ0FBQyxDQUFDO01BQ3hEQyxHQUFHLEVBQUVSLHNFQUFZLENBQUN4RSxXQUFXLENBQUNPLElBQUksQ0FBQ3lFLEdBQUcsQ0FBQyxDQUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDO01BQ2xERSxFQUFFLEVBQUVqRixXQUFXLENBQUNPLElBQUksQ0FBQzBFLEVBQUU7TUFDdkJDLE1BQU0sRUFBRWxGLFdBQVcsQ0FBQ08sSUFBSSxDQUFDNEUsT0FBTyxDQUFDRCxNQUFNO01BQ3ZDRSxTQUFTLEVBQUVyRyxPQUFPLENBQUNzRyxZQUFZLENBQUNIO0lBQ2xDLENBQUM7RUFDSDtFQUVBLElBQUlsRixXQUFXLENBQUNLLElBQUksS0FBS2pFLG9GQUE4QixFQUFFO0lBQ3ZELE1BQU07TUFBRWtKLFlBQVk7TUFBRUMsUUFBUTtNQUFFQztJQUFTLENBQUMsR0FBR3hGLFdBQVcsQ0FBQ08sSUFBSTtJQUM3RCxNQUFNa0YsV0FBVyxHQUFHSCxZQUFZLElBQUlDLFFBQVEsSUFBSSxDQUFDO0lBQ2pELE1BQU1HLFNBQVMsR0FBR0YsUUFBUSxHQUFHRyxNQUFNLENBQUNGLFdBQVcsQ0FBQyxHQUFHRSxNQUFNLENBQUNILFFBQVEsQ0FBQyxHQUFHLENBQUM7SUFDdkUsTUFBTVIsR0FBRyxHQUFHVSxTQUFTLEdBQ2pCLElBQUlqQiw4REFBUyxDQUNYaUIsU0FBUyxFQUNUM0csT0FBTyxDQUFDc0csWUFBWSxDQUFDTyxRQUFRLEVBQzdCN0csT0FBTyxDQUFDc0csWUFBWSxDQUFDSCxNQUFNLENBQzVCLEdBQ0RoRSxTQUFTO0lBRWIsT0FBTztNQUNMOEQsR0FBRyxFQUFFQSxHQUFHLEVBQUVhLFFBQVEsRUFBRTtNQUNwQlQsU0FBUyxFQUFFckcsT0FBTyxDQUFDc0csWUFBWSxDQUFDSCxNQUFNO01BQ3RDRCxFQUFFLEVBQUVqRixXQUFXLENBQUNPLElBQUksQ0FBQzBFO0lBQ3ZCLENBQUM7RUFDSDtFQUVBLE9BQU8sSUFBSTtBQUNiLENBQUM7QUFFTSxNQUFNekgsY0FBYyxHQUFHQSxDQUFDO0VBQzdCa0IsTUFBTTtFQUNOSyxPQUFPO0VBQ1A0QjtBQUtGLENBQUMsS0FBSztFQUNKLE1BQU05QixtQkFBbUIsR0FBRzdCLDZFQUFzQixFQUFFO0VBQ3BELE1BQU04QixxQkFBcUIsR0FBRzdCLCtFQUF3QixFQUFFO0VBRXhELElBQUksQ0FBQ3lCLE1BQU0sSUFBSSxDQUFDSyxPQUFPLElBQUksQ0FBQ0wsTUFBTSxDQUFDc0IsV0FBVyxFQUFFO0lBQzlDLE9BQU8sSUFBSTtFQUNiO0VBRUEsSUFBSXRCLE1BQU0sQ0FBQ21DLE1BQU0sS0FBS2xGLDRGQUF1QixFQUFFO0lBQzdDLE9BQU8sSUFBSTtFQUNiO0VBRUEsSUFBSWtELG1CQUFtQixFQUFFO0lBQ3ZCLG9CQUNFc0MsS0FBQSxDQUFBQyxhQUFBLENBQUNzRCw4R0FBcUIsRUFDaEJFLGtCQUFrQixDQUFDbEcsTUFBTSxDQUFDc0IsV0FBVyxFQUFFakIsT0FBTyxDQUFDLENBQ25EO0VBRU47RUFFQSxJQUFJRCxxQkFBcUIsRUFBRTtJQUN6QixvQkFBT3FDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDdUQsa0hBQXVCO01BQUNtQixRQUFRLEVBQUVuRjtJQUFnQixFQUFHO0VBQy9EO0VBRUEsT0FBTyxJQUFJO0FBQ2IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ2pGMkI7QUFFOEI7QUFFbkQsU0FBU3RELG1CQUFtQkEsQ0FDakM0RixHQUFxQixFQUNyQlosT0FBNEMsRUFDcEM7RUFDUixJQUFJWSxHQUFHLEtBQUs4QyxtRkFBK0IsRUFBRTtJQUMzQyxPQUFPMUQsT0FBTyxFQUFFNEQsU0FBUyxHQUNyQnpILDBDQUFDLENBQUMsb0NBQW9DLEVBQUU2RCxPQUFPLENBQUMsR0FDaEQ3RCwwQ0FBQyxDQUFDLGdCQUFnQixDQUFDO0VBQ3pCO0VBRUEsTUFBTTBILFlBQVksR0FBRztJQUNuQixDQUFDSCxvRkFBZ0MsR0FBR3ZILDBDQUFDLENBQUMsaUJBQWlCLENBQUM7SUFDeEQsQ0FBQ3VILHFGQUFpQyxHQUFHdkgsMENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztJQUMxRCxDQUFDdUgsb0ZBQWdDLEdBQUd2SCwwQ0FBQyxDQUFDLG9CQUFvQixDQUFDO0lBQzNELENBQUN1SCx3RkFBb0MsR0FBR3ZILDBDQUFDLENBQUMsd0JBQXdCLENBQUM7SUFDbkUsQ0FBQ3VILHlGQUFxQyxHQUFHdkgsMENBQUMsQ0FBQyx1QkFBdUIsQ0FBQztJQUNuRSxDQUFDdUgsaUdBQTZDLEdBQUd2SCwwQ0FBQyxDQUNoRCw4QkFBOEIsQ0FDL0I7SUFDRCxDQUFDdUgsbUZBQStCLEdBQUd2SCwwQ0FBQyxDQUFDLG1CQUFtQixDQUFDO0lBQ3pELENBQUN1SCwwRkFBc0MsR0FBR3ZILDBDQUFDLENBQ3pDLGtDQUFrQyxDQUNuQztJQUNELENBQUN1SCxzRkFBa0MsR0FBR3ZILDBDQUFDLENBQUMsbUJBQW1CLENBQUM7SUFDNUQsQ0FBQ3VILGtGQUE4QixHQUFHdkgsMENBQUMsQ0FBQyxlQUFlLENBQUM7SUFDcEQsQ0FBQ3VILDBGQUFzQyxHQUFHdkgsMENBQUMsQ0FBQywwQkFBMEI7RUFDeEUsQ0FBQztFQUVELE9BQU8wSCxZQUFZLENBQUNqRCxHQUFHLENBQUMsSUFBSUEsR0FBRztBQUNqQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF2YWxhYnMvY29yZS1icmlkZ2Utc2RrL2VzbS9saWIvYnRjL3V0aWxzLmpzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQXBwcm92ZUFjdGlvbi9HZW5lcmljQXBwcm92YWxTY3JlZW4udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQXBwcm92ZUFjdGlvbi9jb21wb25lbnRzL0RldmljZUFwcHJvdmFsLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvdXRpbHMvc2VuZEVycm9yTWVzc2FnZXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHIgZnJvbVwiYmlnLmpzXCI7ZnVuY3Rpb24gZShyKXtyZXR1cm4gci5tdWwoMWU4KS50b051bWJlcigpfWZ1bmN0aW9uIG4oZSl7cmV0dXJuIG5ldyByKGUpLmRpdigxZTgpfWV4cG9ydHtlIGFzIGJ0Y1RvU2F0b3NoaSxuIGFzIHNhdG9zaGlUb0J0Y307XG4iLCJpbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQXBwcm92ZUFjdGlvbiB9IGZyb20gJ0BzcmMvaG9va3MvdXNlQXBwcm92ZUFjdGlvbic7XG5pbXBvcnQgeyB1c2VHZXRSZXF1ZXN0SWQgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUdldFJlcXVlc3RJZCc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IExvYWRpbmdPdmVybGF5IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb21tb24vTG9hZGluZ092ZXJsYXknO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IEFsZXJ0VHlwZSwgRGlzcGxheURhdGEsIFJwY01ldGhvZCB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQge1xuICBBbGVydCxcbiAgQWxlcnRDb250ZW50LFxuICBBbGVydFRpdGxlLFxuICBCb3gsXG4gIEJ1dHRvbixcbiAgU2Nyb2xsYmFycyxcbiAgU2tlbGV0b24sXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlTGVkZ2VyRGlzY29ubmVjdGVkRGlhbG9nIH0gZnJvbSAnQHNyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vaG9va3MvdXNlTGVkZ2VyRGlzY29ubmVjdGVkRGlhbG9nJztcbmltcG9ydCB1c2VJc1VzaW5nTGVkZ2VyV2FsbGV0IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNVc2luZ0xlZGdlcldhbGxldCc7XG5pbXBvcnQgdXNlSXNVc2luZ0tleXN0b25lV2FsbGV0IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNVc2luZ0tleXN0b25lV2FsbGV0JztcbmltcG9ydCB7XG4gIEFwcHJvdmFsU2VjdGlvbixcbiAgQXBwcm92YWxTZWN0aW9uQm9keSxcbiAgQXBwcm92YWxTZWN0aW9uSGVhZGVyLFxufSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL0FwcHJvdmFsU2VjdGlvbic7XG5pbXBvcnQgeyBnZXRTZW5kRXJyb3JNZXNzYWdlIH0gZnJvbSAnLi4vU2VuZC91dGlscy9zZW5kRXJyb3JNZXNzYWdlcyc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbkRldGFpbEl0ZW0gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL1RyYW5zYWN0aW9uRGV0YWlsSXRlbSc7XG5pbXBvcnQgeyB1c2VGZWVDdXN0b21pemVyIH0gZnJvbSAnLi9ob29rcy91c2VGZWVDdXN0b21pemVyJztcbmltcG9ydCB7IERldmljZUFwcHJvdmFsIH0gZnJvbSAnLi9jb21wb25lbnRzL0RldmljZUFwcHJvdmFsJztcbmltcG9ydCB7IE5ldHdvcmtXaXRoQ2FpcElkIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvbW9kZWxzJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgVHhCYWxhbmNlQ2hhbmdlIH0gZnJvbSAnLi4vU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvVHhCYWxhbmNlQ2hhbmdlJztcbmltcG9ydCB7IEFsZXJ0Qm94IH0gZnJvbSAnLi4vUGVybWlzc2lvbnMvY29tcG9uZW50cy9BbGVydEJveCc7XG5pbXBvcnQgeyBXYXJuaW5nQm94IH0gZnJvbSAnLi4vUGVybWlzc2lvbnMvY29tcG9uZW50cy9XYXJuaW5nQm94JztcbmltcG9ydCB7IE1hbGljaW91c1R4QWxlcnQgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL01hbGljaW91c1R4QWxlcnQnO1xuaW1wb3J0IHsgU3BlbmRMaW1pdEluZm8gfSBmcm9tICcuLi9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9TcGVuZExpbWl0SW5mby9TcGVuZExpbWl0SW5mbyc7XG5pbXBvcnQgeyBOZXR3b3JrRGV0YWlscyB9IGZyb20gJy4uL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL0FwcHJvdmFsVHhEZXRhaWxzJztcbmltcG9ydCB7IHVzZU5ldHdvcmtGZWVDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrRmVlUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgR2FzbGVzc1BoYXNlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2dhc2xlc3MvbW9kZWwnO1xuXG50eXBlIFdpdGhDb250ZXh0QWxlcnQgPSB7XG4gIGFsZXJ0OiB7IHR5cGU6ICdpbmZvJzsgdGl0bGU6IHN0cmluZzsgbm90aWNlOiBzdHJpbmcgfTtcbn07XG5cbmZ1bmN0aW9uIGhhc0NvbnRleHRJbmZvKFxuICBjb250ZXh0PzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4pOiBjb250ZXh0IGlzIFdpdGhDb250ZXh0QWxlcnQge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0JyAmJlxuICAgIGNvbnRleHQgIT09IG51bGwgJiZcbiAgICAnYWxlcnQnIGluIGNvbnRleHQgJiZcbiAgICBCb29sZWFuKGNvbnRleHQuYWxlcnQpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBHZW5lcmljQXBwcm92YWxTY3JlZW4oKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgcmVxdWVzdElkID0gdXNlR2V0UmVxdWVzdElkKCk7XG4gIGNvbnN0IHsgYWN0aW9uLCB1cGRhdGVBY3Rpb24sIGNhbmNlbEhhbmRsZXIgfSA9XG4gICAgdXNlQXBwcm92ZUFjdGlvbjxEaXNwbGF5RGF0YT4ocmVxdWVzdElkKTtcbiAgY29uc3QgaXNVc2luZ0xlZGdlcldhbGxldCA9IHVzZUlzVXNpbmdMZWRnZXJXYWxsZXQoKTtcbiAgY29uc3QgaXNVc2luZ0tleXN0b25lV2FsbGV0ID0gdXNlSXNVc2luZ0tleXN0b25lV2FsbGV0KCk7XG4gIGNvbnN0IFtuZXR3b3JrLCBzZXROZXR3b3JrXSA9IHVzZVN0YXRlPE5ldHdvcmtXaXRoQ2FpcElkPigpO1xuICBjb25zdCB7IGdldE5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBpc0NhbGN1bGF0aW5nRmVlLFxuICAgIGZlZUVycm9yLFxuICAgIGhhc0Vub3VnaEZvck5ldHdvcmtGZWUsXG4gICAgcmVuZGVyRmVlV2lkZ2V0LFxuICB9ID0gdXNlRmVlQ3VzdG9taXplcih7XG4gICAgYWN0aW9uLFxuICAgIG5ldHdvcmssXG4gIH0pO1xuICBjb25zdCB7XG4gICAgaXNHYXNsZXNzT24sXG4gICAgZ2FzbGVzc0Z1bmRUeCxcbiAgICBmdW5kVHhIZXgsXG4gICAgc2V0R2FzbGVzc0RlZmF1bHRWYWx1ZXMsXG4gICAgZ2FzbGVzc1BoYXNlLFxuICAgIHNldEdhc2xlc3NFbGlnaWJpbGl0eSxcbiAgICBmZXRjaEFuZFNvbHZlR2FzbGVzc0NoYWxsYW5nZSxcbiAgICBpc0dhc2xlc3NFbGlnaWJsZSxcbiAgfSA9IHVzZU5ldHdvcmtGZWVDb250ZXh0KCk7XG5cbiAgY29uc3QgeyBjYXB0dXJlRW5jcnlwdGVkIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG5cbiAgY29uc3QgeyBkaXNwbGF5RGF0YSwgY29udGV4dCwgc2lnbmluZ0RhdGEgfSA9IGFjdGlvbiA/PyB7fTtcbiAgY29uc3QgaGFzRmVlU2VsZWN0b3IgPSBhY3Rpb24/LmRpc3BsYXlEYXRhLm5ldHdvcmtGZWVTZWxlY3RvcjtcbiAgY29uc3QgaXNGZWVWYWxpZCA9XG4gICAgKGlzR2FzbGVzc09uICYmIGlzR2FzbGVzc0VsaWdpYmxlKSB8fFxuICAgICFoYXNGZWVTZWxlY3RvciB8fFxuICAgICghZmVlRXJyb3IgJiYgIWlzQ2FsY3VsYXRpbmdGZWUgJiYgaGFzRW5vdWdoRm9yTmV0d29ya0ZlZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWRpc3BsYXlEYXRhPy5uZXR3b3JrPy5jaGFpbklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2V0TmV0d29yayhnZXROZXR3b3JrKGRpc3BsYXlEYXRhLm5ldHdvcmsuY2hhaW5JZCkpO1xuXG4gICAgaWYgKHNpZ25pbmdEYXRhICYmIHNpZ25pbmdEYXRhLnR5cGUgPT09IFJwY01ldGhvZC5FVEhfU0VORF9UUkFOU0FDVElPTikge1xuICAgICAgc2V0R2FzbGVzc0VsaWdpYmlsaXR5KFxuICAgICAgICBkaXNwbGF5RGF0YS5uZXR3b3JrLmNoYWluSWQsXG4gICAgICAgIHNpZ25pbmdEYXRhPy5kYXRhPy5mcm9tLFxuICAgICAgICBzaWduaW5nRGF0YT8uZGF0YT8ubm9uY2UsXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRHYXNsZXNzRWxpZ2liaWxpdHkoZGlzcGxheURhdGEubmV0d29yay5jaGFpbklkKTtcbiAgfSwgW1xuICAgIGRpc3BsYXlEYXRhLFxuICAgIGRpc3BsYXlEYXRhPy5uZXR3b3JrPy5jaGFpbklkLFxuICAgIGZldGNoQW5kU29sdmVHYXNsZXNzQ2hhbGxhbmdlLFxuICAgIGdldE5ldHdvcmssXG4gICAgc2V0R2FzbGVzc0VsaWdpYmlsaXR5LFxuICAgIHNpZ25pbmdEYXRhLFxuICBdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChnYXNsZXNzUGhhc2UgPT09IEdhc2xlc3NQaGFzZS5OT1RfUkVBRFkgJiYgaXNHYXNsZXNzRWxpZ2libGUpIHtcbiAgICAgIGZldGNoQW5kU29sdmVHYXNsZXNzQ2hhbGxhbmdlKCk7XG4gICAgfVxuICB9LCBbZmV0Y2hBbmRTb2x2ZUdhc2xlc3NDaGFsbGFuZ2UsIGdhc2xlc3NQaGFzZSwgaXNHYXNsZXNzRWxpZ2libGVdKTtcblxuICBjb25zdCBoYW5kbGVSZWplY3Rpb24gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0R2FzbGVzc0RlZmF1bHRWYWx1ZXMoKTtcbiAgICBjYW5jZWxIYW5kbGVyKCk7XG4gIH0sIFtjYW5jZWxIYW5kbGVyLCBzZXRHYXNsZXNzRGVmYXVsdFZhbHVlc10pO1xuXG4gIGNvbnN0IHNpZ25UeCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoaXNHYXNsZXNzT24gJiYgaXNHYXNsZXNzRWxpZ2libGUpIHtcbiAgICAgIHJldHVybiBhd2FpdCBnYXNsZXNzRnVuZFR4KGFjdGlvbj8uc2lnbmluZ0RhdGEpO1xuICAgIH1cbiAgICB1cGRhdGVBY3Rpb24oXG4gICAgICB7XG4gICAgICAgIHN0YXR1czogQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcsXG4gICAgICAgIGlkOiByZXF1ZXN0SWQsXG4gICAgICB9LFxuICAgICAgaXNVc2luZ0xlZGdlcldhbGxldCB8fCBpc1VzaW5nS2V5c3RvbmVXYWxsZXQsXG4gICAgKTtcbiAgfSwgW1xuICAgIGFjdGlvbj8uc2lnbmluZ0RhdGEsXG4gICAgZ2FzbGVzc0Z1bmRUeCxcbiAgICBpc0dhc2xlc3NFbGlnaWJsZSxcbiAgICBpc0dhc2xlc3NPbixcbiAgICBpc1VzaW5nS2V5c3RvbmVXYWxsZXQsXG4gICAgaXNVc2luZ0xlZGdlcldhbGxldCxcbiAgICByZXF1ZXN0SWQsXG4gICAgdXBkYXRlQWN0aW9uLFxuICBdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChnYXNsZXNzUGhhc2UgPT09IEdhc2xlc3NQaGFzZS5FUlJPUikge1xuICAgICAgY2FwdHVyZUVuY3J5cHRlZCgnR2FzbGVzc0Z1bmRGYWlsZWQnKTtcbiAgICB9XG4gICAgaWYgKGdhc2xlc3NQaGFzZSA9PT0gR2FzbGVzc1BoYXNlLkZVTkRFRCAmJiBmdW5kVHhIZXgpIHtcbiAgICAgIGNhcHR1cmVFbmNyeXB0ZWQoJ0dhc2xlc3NGdW5kU3VjY2Vzc2Z1bCcsIHtcbiAgICAgICAgZnVuZFR4SGV4LFxuICAgICAgfSk7XG4gICAgICB1cGRhdGVBY3Rpb24oXG4gICAgICAgIHtcbiAgICAgICAgICBzdGF0dXM6IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HLFxuICAgICAgICAgIGlkOiByZXF1ZXN0SWQsXG4gICAgICAgIH0sXG4gICAgICAgIGlzVXNpbmdMZWRnZXJXYWxsZXQgfHwgaXNVc2luZ0tleXN0b25lV2FsbGV0LFxuICAgICAgKTtcbiAgICAgIHNldEdhc2xlc3NEZWZhdWx0VmFsdWVzKCk7XG4gICAgfVxuICB9LCBbXG4gICAgY2FwdHVyZUVuY3J5cHRlZCxcbiAgICBmdW5kVHhIZXgsXG4gICAgZ2FzbGVzc1BoYXNlLFxuICAgIGlzVXNpbmdLZXlzdG9uZVdhbGxldCxcbiAgICBpc1VzaW5nTGVkZ2VyV2FsbGV0LFxuICAgIG5ldHdvcmssXG4gICAgcmVxdWVzdElkLFxuICAgIHNldEdhc2xlc3NEZWZhdWx0VmFsdWVzLFxuICAgIHQsXG4gICAgdXBkYXRlQWN0aW9uLFxuICBdKTtcblxuICAvLyBNYWtlIHRoZSB1c2VyIHN3aXRjaCB0byB0aGUgY29ycmVjdCBhcHAgb3IgY2xvc2UgdGhlIHdpbmRvd1xuICB1c2VMZWRnZXJEaXNjb25uZWN0ZWREaWFsb2coaGFuZGxlUmVqZWN0aW9uLCB1bmRlZmluZWQsIG5ldHdvcmspO1xuXG4gIGlmICghYWN0aW9uIHx8ICFkaXNwbGF5RGF0YSkge1xuICAgIHJldHVybiA8TG9hZGluZ092ZXJsYXkgLz47XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHsvKiBIZWFkZXIgKi99XG4gICAgICAgIDxCb3hcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIHB0OiAxLFxuICAgICAgICAgICAgcGI6IDIsXG4gICAgICAgICAgICBweDogMixcbiAgICAgICAgICAgIHpJbmRleDogMSxcbiAgICAgICAgICAgIGhlaWdodDogJzU2cHgnLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDRcIj5cbiAgICAgICAgICAgIHtjb250ZXh0Py5jdXN0b21BcHByb3ZhbFNjcmVlblRpdGxlIHx8IGRpc3BsYXlEYXRhLnRpdGxlfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAge2Rpc3BsYXlEYXRhLmFsZXJ0ICYmIChcbiAgICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIHB4OiAyLCBtYjogMSB9fT5cbiAgICAgICAgICAgIHtkaXNwbGF5RGF0YS5hbGVydC50eXBlID09PSBBbGVydFR5cGUuREFOR0VSID8gKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxNYWxpY2lvdXNUeEFsZXJ0XG4gICAgICAgICAgICAgICAgICBzaG93QWxlcnRcbiAgICAgICAgICAgICAgICAgIGNhbmNlbEhhbmRsZXI9e2hhbmRsZVJlamVjdGlvbn1cbiAgICAgICAgICAgICAgICAgIGFjdGlvblRpdGxlcz17ZGlzcGxheURhdGEuYWxlcnQuZGV0YWlscy5hY3Rpb25UaXRsZXN9XG4gICAgICAgICAgICAgICAgICB0aXRsZT17ZGlzcGxheURhdGEuYWxlcnQuZGV0YWlscy50aXRsZX1cbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPXtkaXNwbGF5RGF0YS5hbGVydC5kZXRhaWxzLmRlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPEFsZXJ0Qm94XG4gICAgICAgICAgICAgICAgICB0aXRsZT17ZGlzcGxheURhdGEuYWxlcnQuZGV0YWlscy50aXRsZX1cbiAgICAgICAgICAgICAgICAgIHRleHQ9e2Rpc3BsYXlEYXRhLmFsZXJ0LmRldGFpbHMuZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8V2FybmluZ0JveFxuICAgICAgICAgICAgICAgIHRpdGxlPXtkaXNwbGF5RGF0YS5hbGVydC5kZXRhaWxzLnRpdGxlfVxuICAgICAgICAgICAgICAgIHRleHQ9e2Rpc3BsYXlEYXRhLmFsZXJ0LmRldGFpbHMuZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICl9XG5cbiAgICAgICAge2dhc2xlc3NQaGFzZSA9PT0gR2FzbGVzc1BoYXNlLkVSUk9SICYmIChcbiAgICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIHB4OiAyLCBtYjogMSB9fT5cbiAgICAgICAgICAgIDxBbGVydEJveFxuICAgICAgICAgICAgICB0aXRsZT17dCgnR2FzbGVzcyBFcnJvcicpfVxuICAgICAgICAgICAgICB0ZXh0PXt0KFxuICAgICAgICAgICAgICAgIGBXZSdyZSB1bmFibGUgdG8gY292ZXIgdGhlIGdhcyBmZWVzIGZvciB5b3VyIHRyYW5zYWN0aW9uIGF0IHRoaXMgdGltZS4gQXMgYSByZXN1bHQsIHRoaXMgZmVhdHVyZSBoYXMgYmVlbiBkaXNhYmxlZC5gLFxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICApfVxuXG4gICAgICAgIHtoYXNDb250ZXh0SW5mbyhjb250ZXh0KSAmJiAoXG4gICAgICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxLCBweDogMiB9fT5cbiAgICAgICAgICAgIDxBbGVydFxuICAgICAgICAgICAgICBzZXZlcml0eT17Y29udGV4dC5hbGVydC50eXBlfVxuICAgICAgICAgICAgICBzeD17eyB3aWR0aDogMSwgcHk6IDAsIG1iOiAxLCBtdDogLTEgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEFsZXJ0VGl0bGU+e2NvbnRleHQuYWxlcnQudGl0bGV9PC9BbGVydFRpdGxlPlxuICAgICAgICAgICAgICB7Y29udGV4dC5hbGVydC5ub3RpY2UgJiYgKFxuICAgICAgICAgICAgICAgIDxBbGVydENvbnRlbnQ+e2NvbnRleHQuYWxlcnQubm90aWNlfTwvQWxlcnRDb250ZW50PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9BbGVydD5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICApfVxuXG4gICAgICAgIDxTY3JvbGxiYXJzPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4OiAxLCB3aWR0aDogMSwgcHg6IDIsIGdhcDogMiwgcGI6IDMgfX0+XG4gICAgICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6ICcxMDAlJywgZ2FwOiAzLCBwdDogMSB9fT5cbiAgICAgICAgICAgICAge2Rpc3BsYXlEYXRhLmRldGFpbHMubWFwKChzZWN0aW9uLCBzZWN0aW9uSW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICA8QXBwcm92YWxTZWN0aW9uIGtleT17YHR4LWRldGFpbC1zZWN0aW9uLSR7c2VjdGlvbkluZGV4fWB9PlxuICAgICAgICAgICAgICAgICAge3NlY3Rpb24udGl0bGUgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXtzZWN0aW9uLnRpdGxlfSAvPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IHB5OiAxIH19PlxuICAgICAgICAgICAgICAgICAgICB7c2VjdGlvbkluZGV4ID09PSAwICYmIG5ldHdvcmsgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxOZXR3b3JrRGV0YWlscyBuZXR3b3JrPXtuZXR3b3JrfSAvPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICB7c2VjdGlvbi5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRyYW5zYWN0aW9uRGV0YWlsSXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtgdHgtZGV0YWlsLiR7c2VjdGlvbkluZGV4fS4ke2luZGV4fWB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICAgICAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAge2Rpc3BsYXlEYXRhLmJhbGFuY2VDaGFuZ2UgJiYgKFxuICAgICAgICAgICAgICAgIDxUeEJhbGFuY2VDaGFuZ2VcbiAgICAgICAgICAgICAgICAgIGlucz17ZGlzcGxheURhdGEuYmFsYW5jZUNoYW5nZS5pbnN9XG4gICAgICAgICAgICAgICAgICBvdXRzPXtkaXNwbGF5RGF0YS5iYWxhbmNlQ2hhbmdlLm91dHN9XG4gICAgICAgICAgICAgICAgICBpc1NpbXVsYXRpb25TdWNjZXNzZnVsPXtkaXNwbGF5RGF0YS5pc1NpbXVsYXRpb25TdWNjZXNzZnVsfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHtkaXNwbGF5RGF0YS50b2tlbkFwcHJvdmFscyAmJiAoXG4gICAgICAgICAgICAgICAgPFNwZW5kTGltaXRJbmZvXG4gICAgICAgICAgICAgICAgICB7Li4uZGlzcGxheURhdGEudG9rZW5BcHByb3ZhbHN9XG4gICAgICAgICAgICAgICAgICBhY3Rpb25JZD17cmVxdWVzdElkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAge2lzR2FzbGVzc0VsaWdpYmxlID09PSBudWxsID8gKFxuICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxTa2VsZXRvbiBzeD17eyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6IDE0MCB9fSAvPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgZGlzcGxheURhdGEubmV0d29ya0ZlZVNlbGVjdG9yICYmIHJlbmRlckZlZVdpZGdldCgpXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICAgICAge2ZlZUVycm9yICYmICFpc0dhc2xlc3NPbiAmJiBpc0dhc2xlc3NFbGlnaWJsZSAhPT0gbnVsbCAmJiAoXG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBjb2xvcj1cImVycm9yLm1haW5cIiBzeD17eyBtdDogLTEgfX0+XG4gICAgICAgICAgICB7Z2V0U2VuZEVycm9yTWVzc2FnZShmZWVFcnJvcil9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICApfVxuICAgICAgPC9TdGFjaz5cbiAgICAgIHsvKiBBY3Rpb24gQnV0dG9ucyAqL31cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgIHB0OiAxLjUsXG4gICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgcGI6IDEsXG4gICAgICAgICAgZ2FwOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwidHJhbnNhY3Rpb24tcmVqZWN0LWJ0blwiXG4gICAgICAgICAgZGlzYWJsZWQ9e1xuICAgICAgICAgICAgYWN0aW9uLnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcgfHxcbiAgICAgICAgICAgIGdhc2xlc3NQaGFzZSA9PT0gR2FzbGVzc1BoYXNlLkZVTkRJTkdfSU5fUFJPR1JFU1NcbiAgICAgICAgICB9XG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZWplY3Rpb259XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnUmVqZWN0Jyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgIHRpdGxlPXtcbiAgICAgICAgICAgIGdhc2xlc3NQaGFzZSA9PT0gR2FzbGVzc1BoYXNlLk5PVF9SRUFEWSAmJlxuICAgICAgICAgICAgaXNHYXNsZXNzT24gJiZcbiAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgIGBJZiB5b3UncmUgbG9va2luZyB0byBhcHByb3ZlIHRoZSB0cmFuc2FjdGlvbiBkZXNwaXRlIHRoZSBnYXNsZXNzIGZlYXR1cmUsIHBsZWFzZSB0dXJuIGl0IG9mZiB0byBwcm9jZWVkLmAsXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICAgIHN4PXt7IHdpZHRoOiAnMTAwJScgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwidHJhbnNhY3Rpb24tYXBwcm92ZS1idG5cIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e1xuICAgICAgICAgICAgICAhZGlzcGxheURhdGEgfHxcbiAgICAgICAgICAgICAgYWN0aW9uLnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcgfHxcbiAgICAgICAgICAgICAgIWlzRmVlVmFsaWQgfHxcbiAgICAgICAgICAgICAgKGlzR2FzbGVzc09uICYmXG4gICAgICAgICAgICAgICAgKGdhc2xlc3NQaGFzZSA9PT0gR2FzbGVzc1BoYXNlLkZVTkRJTkdfSU5fUFJPR1JFU1MgfHxcbiAgICAgICAgICAgICAgICAgIGdhc2xlc3NQaGFzZSAhPT0gR2FzbGVzc1BoYXNlLlJFQURZKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzTG9hZGluZz17XG4gICAgICAgICAgICAgIGFjdGlvbi5zdGF0dXMgPT09IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HIHx8XG4gICAgICAgICAgICAgIGlzQ2FsY3VsYXRpbmdGZWUgfHxcbiAgICAgICAgICAgICAgZ2FzbGVzc1BoYXNlID09PSBHYXNsZXNzUGhhc2UuRlVORElOR19JTl9QUk9HUkVTU1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgb25DbGljaz17c2lnblR4fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtnYXNsZXNzUGhhc2UgPT09IEdhc2xlc3NQaGFzZS5GVU5ESU5HX0lOX1BST0dSRVNTXG4gICAgICAgICAgICAgID8gdCgnQXBwcm92aW5nJylcbiAgICAgICAgICAgICAgOiBjb250ZXh0Py5jdXN0b21BcHByb3ZhbEJ1dHRvblRleHQgfHwgdCgnQXBwcm92ZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPERldmljZUFwcHJvdmFsXG4gICAgICAgIGFjdGlvbj17YWN0aW9ufVxuICAgICAgICBoYW5kbGVSZWplY3Rpb249e2hhbmRsZVJlamVjdGlvbn1cbiAgICAgICAgbmV0d29yaz17bmV0d29ya31cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHNhdG9zaGlUb0J0YyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBScGNNZXRob2QsIFNpZ25pbmdEYXRhIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IFRva2VuVW5pdCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtdXRpbHMtc2RrJztcblxuaW1wb3J0IHsgQWN0aW9uLCBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgTmV0d29ya1dpdGhDYWlwSWQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay9tb2RlbHMnO1xuaW1wb3J0IHVzZUlzVXNpbmdLZXlzdG9uZVdhbGxldCBmcm9tICdAc3JjL2hvb2tzL3VzZUlzVXNpbmdLZXlzdG9uZVdhbGxldCc7XG5pbXBvcnQgdXNlSXNVc2luZ0xlZGdlcldhbGxldCBmcm9tICdAc3JjL2hvb2tzL3VzZUlzVXNpbmdMZWRnZXJXYWxsZXQnO1xuXG5pbXBvcnQgeyBMZWRnZXJBcHByb3ZhbE92ZXJsYXkgfSBmcm9tICdAc3JjL3BhZ2VzL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL0xlZGdlckFwcHJvdmFsT3ZlcmxheSc7XG5pbXBvcnQgeyBLZXlzdG9uZUFwcHJvdmFsT3ZlcmxheSB9IGZyb20gJ0BzcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvS2V5c3RvbmVBcHByb3ZhbE92ZXJsYXknO1xuXG5jb25zdCBnZXRUeEluZm9Gb3JMZWRnZXIgPSAoXG4gIHNpZ25pbmdEYXRhOiBTaWduaW5nRGF0YSxcbiAgbmV0d29yazogTmV0d29ya1dpdGhDYWlwSWQsXG4pID0+IHtcbiAgaWYgKHNpZ25pbmdEYXRhLnR5cGUgPT09IFJwY01ldGhvZC5CSVRDT0lOX1NFTkRfVFJBTlNBQ1RJT04pIHtcbiAgICByZXR1cm4ge1xuICAgICAgYW1vdW50OiBzYXRvc2hpVG9CdGMoc2lnbmluZ0RhdGEuZGF0YS5hbW91bnQpLnRvRml4ZWQoOCksXG4gICAgICBmZWU6IHNhdG9zaGlUb0J0YyhzaWduaW5nRGF0YS5kYXRhLmZlZSkudG9GaXhlZCg4KSxcbiAgICAgIHRvOiBzaWduaW5nRGF0YS5kYXRhLnRvLFxuICAgICAgc3ltYm9sOiBzaWduaW5nRGF0YS5kYXRhLmJhbGFuY2Uuc3ltYm9sLFxuICAgICAgZmVlU3ltYm9sOiBuZXR3b3JrLm5ldHdvcmtUb2tlbi5zeW1ib2wsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChzaWduaW5nRGF0YS50eXBlID09PSBScGNNZXRob2QuRVRIX1NFTkRfVFJBTlNBQ1RJT04pIHtcbiAgICBjb25zdCB7IG1heEZlZVBlckdhcywgZ2FzUHJpY2UsIGdhc0xpbWl0IH0gPSBzaWduaW5nRGF0YS5kYXRhO1xuICAgIGNvbnN0IHByaWNlUGVyR2FzID0gbWF4RmVlUGVyR2FzID8/IGdhc1ByaWNlID8/IDA7XG4gICAgY29uc3QgZmVlQmlnSW50ID0gZ2FzTGltaXQgPyBCaWdJbnQocHJpY2VQZXJHYXMpICogQmlnSW50KGdhc0xpbWl0KSA6IDA7XG4gICAgY29uc3QgZmVlID0gZmVlQmlnSW50XG4gICAgICA/IG5ldyBUb2tlblVuaXQoXG4gICAgICAgICAgZmVlQmlnSW50LFxuICAgICAgICAgIG5ldHdvcmsubmV0d29ya1Rva2VuLmRlY2ltYWxzLFxuICAgICAgICAgIG5ldHdvcmsubmV0d29ya1Rva2VuLnN5bWJvbCxcbiAgICAgICAgKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZmVlOiBmZWU/LnRvU3RyaW5nKCksXG4gICAgICBmZWVTeW1ib2w6IG5ldHdvcmsubmV0d29ya1Rva2VuLnN5bWJvbCxcbiAgICAgIHRvOiBzaWduaW5nRGF0YS5kYXRhLnRvIGFzIHN0cmluZyxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5leHBvcnQgY29uc3QgRGV2aWNlQXBwcm92YWwgPSAoe1xuICBhY3Rpb24sXG4gIG5ldHdvcmssXG4gIGhhbmRsZVJlamVjdGlvbixcbn06IHtcbiAgYWN0aW9uOiBBY3Rpb247XG4gIG5ldHdvcms/OiBOZXR3b3JrV2l0aENhaXBJZDtcbiAgaGFuZGxlUmVqZWN0aW9uOiAoKSA9PiB2b2lkO1xufSkgPT4ge1xuICBjb25zdCBpc1VzaW5nTGVkZ2VyV2FsbGV0ID0gdXNlSXNVc2luZ0xlZGdlcldhbGxldCgpO1xuICBjb25zdCBpc1VzaW5nS2V5c3RvbmVXYWxsZXQgPSB1c2VJc1VzaW5nS2V5c3RvbmVXYWxsZXQoKTtcblxuICBpZiAoIWFjdGlvbiB8fCAhbmV0d29yayB8fCAhYWN0aW9uLnNpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoYWN0aW9uLnN0YXR1cyAhPT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChpc1VzaW5nTGVkZ2VyV2FsbGV0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxMZWRnZXJBcHByb3ZhbE92ZXJsYXlcbiAgICAgICAgey4uLmdldFR4SW5mb0ZvckxlZGdlcihhY3Rpb24uc2lnbmluZ0RhdGEsIG5ldHdvcmspfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgaWYgKGlzVXNpbmdLZXlzdG9uZVdhbGxldCkge1xuICAgIHJldHVybiA8S2V5c3RvbmVBcHByb3ZhbE92ZXJsYXkgb25SZWplY3Q9e2hhbmRsZVJlamVjdGlvbn0gLz47XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG4iLCJpbXBvcnQgeyB0IH0gZnJvbSAnaTE4bmV4dCc7XG5cbmltcG9ydCB7IFNlbmRFcnJvck1lc3NhZ2UgfSBmcm9tICdAc3JjL3V0aWxzL3NlbmQvbW9kZWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbmRFcnJvck1lc3NhZ2UoXG4gIGtleTogU2VuZEVycm9yTWVzc2FnZSxcbiAgZGV0YWlscz86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHVuZGVmaW5lZD4sXG4pOiBzdHJpbmcge1xuICBpZiAoa2V5ID09PSBTZW5kRXJyb3JNZXNzYWdlLkFNT1VOVF9UT09fTE9XKSB7XG4gICAgcmV0dXJuIGRldGFpbHM/Lm1pbkFtb3VudFxuICAgICAgPyB0KCdBdCBsZWFzdCB7e21pbkFtb3VudH19IGlzIHJlcXVpcmVkJywgZGV0YWlscylcbiAgICAgIDogdCgnQW1vdW50IHRvbyBsb3cnKTtcbiAgfVxuXG4gIGNvbnN0IHRyYW5zbGF0aW9ucyA9IHtcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5BTU9VTlRfUkVRVUlSRURdOiB0KCdBbW91bnQgcmVxdWlyZWQnKSxcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5BRERSRVNTX1JFUVVJUkVEXTogdCgnQWRkcmVzcyByZXF1aXJlZCcpLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLklOVkFMSURfQUREUkVTU106IHQoJ0FkZHJlc3MgaXMgaW52YWxpZCcpLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLklOVkFMSURfTkVUV09SS19GRUVdOiB0KCdOZXR3b3JrIEZlZSBpcyBpbnZhbGlkJyksXG4gICAgW1NlbmRFcnJvck1lc3NhZ2UuSU5TVUZGSUNJRU5UX0JBTEFOQ0VdOiB0KCdJbnN1ZmZpY2llbnQgYmFsYW5jZS4nKSxcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5JTlNVRkZJQ0lFTlRfQkFMQU5DRV9GT1JfRkVFXTogdChcbiAgICAgICdJbnN1ZmZpY2llbnQgYmFsYW5jZSBmb3IgZmVlJyxcbiAgICApLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLlRPS0VOX1JFUVVJUkVEXTogdCgnVG9rZW4gaXMgcmVxdWlyZWQnKSxcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5VTkFCTEVfVE9fRkVUQ0hfVVRYT1NdOiB0KFxuICAgICAgJ0ludGVybmFsIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluJyxcbiAgICApLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLlVOU1VQUE9SVEVEX1RPS0VOXTogdCgnVW5zdXBwb3J0ZWQgdG9rZW4nKSxcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5VTktOT1dOX0VSUk9SXTogdCgnVW5rbm93biBlcnJvcicpLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLkVYQ0VTU0lWRV9ORVRXT1JLX0ZFRV06IHQoJ1NlbGVjdGVkIGZlZSBpcyB0b28gaGlnaCcpLFxuICB9O1xuXG4gIHJldHVybiB0cmFuc2xhdGlvbnNba2V5XSA/PyBrZXk7XG59XG4iXSwibmFtZXMiOlsiQWN0aW9uU3RhdHVzIiwidXNlQXBwcm92ZUFjdGlvbiIsInVzZUdldFJlcXVlc3RJZCIsInVzZUNhbGxiYWNrIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJMb2FkaW5nT3ZlcmxheSIsInVzZVRyYW5zbGF0aW9uIiwiQWxlcnRUeXBlIiwiUnBjTWV0aG9kIiwiQWxlcnQiLCJBbGVydENvbnRlbnQiLCJBbGVydFRpdGxlIiwiQm94IiwiQnV0dG9uIiwiU2Nyb2xsYmFycyIsIlNrZWxldG9uIiwiU3RhY2siLCJUb29sdGlwIiwiVHlwb2dyYXBoeSIsInVzZUxlZGdlckRpc2Nvbm5lY3RlZERpYWxvZyIsInVzZUlzVXNpbmdMZWRnZXJXYWxsZXQiLCJ1c2VJc1VzaW5nS2V5c3RvbmVXYWxsZXQiLCJBcHByb3ZhbFNlY3Rpb24iLCJBcHByb3ZhbFNlY3Rpb25Cb2R5IiwiQXBwcm92YWxTZWN0aW9uSGVhZGVyIiwiZ2V0U2VuZEVycm9yTWVzc2FnZSIsIlRyYW5zYWN0aW9uRGV0YWlsSXRlbSIsInVzZUZlZUN1c3RvbWl6ZXIiLCJEZXZpY2VBcHByb3ZhbCIsInVzZU5ldHdvcmtDb250ZXh0IiwiVHhCYWxhbmNlQ2hhbmdlIiwiQWxlcnRCb3giLCJXYXJuaW5nQm94IiwiTWFsaWNpb3VzVHhBbGVydCIsIlNwZW5kTGltaXRJbmZvIiwiTmV0d29ya0RldGFpbHMiLCJ1c2VOZXR3b3JrRmVlQ29udGV4dCIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJHYXNsZXNzUGhhc2UiLCJoYXNDb250ZXh0SW5mbyIsImNvbnRleHQiLCJCb29sZWFuIiwiYWxlcnQiLCJHZW5lcmljQXBwcm92YWxTY3JlZW4iLCJ0IiwicmVxdWVzdElkIiwiYWN0aW9uIiwidXBkYXRlQWN0aW9uIiwiY2FuY2VsSGFuZGxlciIsImlzVXNpbmdMZWRnZXJXYWxsZXQiLCJpc1VzaW5nS2V5c3RvbmVXYWxsZXQiLCJuZXR3b3JrIiwic2V0TmV0d29yayIsImdldE5ldHdvcmsiLCJpc0NhbGN1bGF0aW5nRmVlIiwiZmVlRXJyb3IiLCJoYXNFbm91Z2hGb3JOZXR3b3JrRmVlIiwicmVuZGVyRmVlV2lkZ2V0IiwiaXNHYXNsZXNzT24iLCJnYXNsZXNzRnVuZFR4IiwiZnVuZFR4SGV4Iiwic2V0R2FzbGVzc0RlZmF1bHRWYWx1ZXMiLCJnYXNsZXNzUGhhc2UiLCJzZXRHYXNsZXNzRWxpZ2liaWxpdHkiLCJmZXRjaEFuZFNvbHZlR2FzbGVzc0NoYWxsYW5nZSIsImlzR2FzbGVzc0VsaWdpYmxlIiwiY2FwdHVyZUVuY3J5cHRlZCIsImRpc3BsYXlEYXRhIiwic2lnbmluZ0RhdGEiLCJoYXNGZWVTZWxlY3RvciIsIm5ldHdvcmtGZWVTZWxlY3RvciIsImlzRmVlVmFsaWQiLCJjaGFpbklkIiwidHlwZSIsIkVUSF9TRU5EX1RSQU5TQUNUSU9OIiwiZGF0YSIsImZyb20iLCJub25jZSIsIk5PVF9SRUFEWSIsImhhbmRsZVJlamVjdGlvbiIsInNpZ25UeCIsInN0YXR1cyIsIlNVQk1JVFRJTkciLCJpZCIsIkVSUk9SIiwiRlVOREVEIiwidW5kZWZpbmVkIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJ3aWR0aCIsImhlaWdodCIsImFsaWduSXRlbXMiLCJwdCIsInBiIiwicHgiLCJ6SW5kZXgiLCJ2YXJpYW50IiwiY3VzdG9tQXBwcm92YWxTY3JlZW5UaXRsZSIsInRpdGxlIiwibWIiLCJEQU5HRVIiLCJGcmFnbWVudCIsInNob3dBbGVydCIsImFjdGlvblRpdGxlcyIsImRldGFpbHMiLCJkZXNjcmlwdGlvbiIsInRleHQiLCJzZXZlcml0eSIsInB5IiwibXQiLCJub3RpY2UiLCJmbGV4IiwiZ2FwIiwibWFwIiwic2VjdGlvbiIsInNlY3Rpb25JbmRleCIsImtleSIsImxhYmVsIiwiaXRlbXMiLCJpdGVtIiwiaW5kZXgiLCJiYWxhbmNlQ2hhbmdlIiwiaW5zIiwib3V0cyIsImlzU2ltdWxhdGlvblN1Y2Nlc3NmdWwiLCJ0b2tlbkFwcHJvdmFscyIsIl9leHRlbmRzIiwiYWN0aW9uSWQiLCJqdXN0aWZ5Q29udGVudCIsImNvbG9yIiwiZmxleERpcmVjdGlvbiIsImRpc2FibGVkIiwiRlVORElOR19JTl9QUk9HUkVTUyIsInNpemUiLCJmdWxsV2lkdGgiLCJvbkNsaWNrIiwiUkVBRFkiLCJpc0xvYWRpbmciLCJjdXN0b21BcHByb3ZhbEJ1dHRvblRleHQiLCJzYXRvc2hpVG9CdGMiLCJUb2tlblVuaXQiLCJMZWRnZXJBcHByb3ZhbE92ZXJsYXkiLCJLZXlzdG9uZUFwcHJvdmFsT3ZlcmxheSIsImdldFR4SW5mb0ZvckxlZGdlciIsIkJJVENPSU5fU0VORF9UUkFOU0FDVElPTiIsImFtb3VudCIsInRvRml4ZWQiLCJmZWUiLCJ0byIsInN5bWJvbCIsImJhbGFuY2UiLCJmZWVTeW1ib2wiLCJuZXR3b3JrVG9rZW4iLCJtYXhGZWVQZXJHYXMiLCJnYXNQcmljZSIsImdhc0xpbWl0IiwicHJpY2VQZXJHYXMiLCJmZWVCaWdJbnQiLCJCaWdJbnQiLCJkZWNpbWFscyIsInRvU3RyaW5nIiwib25SZWplY3QiLCJTZW5kRXJyb3JNZXNzYWdlIiwiQU1PVU5UX1RPT19MT1ciLCJtaW5BbW91bnQiLCJ0cmFuc2xhdGlvbnMiLCJBTU9VTlRfUkVRVUlSRUQiLCJBRERSRVNTX1JFUVVJUkVEIiwiSU5WQUxJRF9BRERSRVNTIiwiSU5WQUxJRF9ORVRXT1JLX0ZFRSIsIklOU1VGRklDSUVOVF9CQUxBTkNFIiwiSU5TVUZGSUNJRU5UX0JBTEFOQ0VfRk9SX0ZFRSIsIlRPS0VOX1JFUVVJUkVEIiwiVU5BQkxFX1RPX0ZFVENIX1VUWE9TIiwiVU5TVVBQT1JURURfVE9LRU4iLCJVTktOT1dOX0VSUk9SIiwiRVhDRVNTSVZFX05FVFdPUktfRkVFIl0sInNvdXJjZVJvb3QiOiIifQ==