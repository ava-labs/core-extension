"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ApproveAction_TxBatchApprovalScreen_tsx"],{

/***/ "./src/components/common/FlexScrollbars.tsx":
/*!**************************************************!*\
  !*** ./src/components/common/FlexScrollbars.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FlexScrollbars": () => (/* binding */ FlexScrollbars)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");

const FlexScrollbars = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Scrollbars)`
  flex-grow: 1;
  max-height: unset;
  height: 100%;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;

/***/ }),

/***/ "./src/pages/ApproveAction/TxBatchApprovalScreen.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/ApproveAction/TxBatchApprovalScreen.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TxBatchApprovalScreen": () => (/* binding */ TxBatchApprovalScreen)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TransactionDetailItem__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/components/common/approval/TransactionDetailItem */ "./src/components/common/approval/TransactionDetailItem.tsx");
/* harmony import */ var _src_utils_useWindowGetsClosedOrHidden__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/utils/useWindowGetsClosedOrHidden */ "./src/utils/useWindowGetsClosedOrHidden.ts");
/* harmony import */ var _components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../components/common/LoadingOverlay */ "./src/components/common/LoadingOverlay.tsx");
/* harmony import */ var _SignTransaction_components_TxBalanceChange__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../SignTransaction/components/TxBalanceChange */ "./src/pages/SignTransaction/components/TxBalanceChange.tsx");
/* harmony import */ var _SignTransaction_components_SpendLimitInfo_SpendLimitInfo__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../SignTransaction/components/SpendLimitInfo/SpendLimitInfo */ "./src/pages/SignTransaction/components/SpendLimitInfo/SpendLimitInfo.tsx");
/* harmony import */ var _SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../SignTransaction/components/ApprovalTxDetails */ "./src/pages/SignTransaction/components/ApprovalTxDetails.tsx");
/* harmony import */ var _hooks_useFeeCustomizer__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./hooks/useFeeCustomizer */ "./src/pages/ApproveAction/hooks/useFeeCustomizer.tsx");
/* harmony import */ var _components_TransactionDetailsCardContent__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/TransactionDetailsCardContent */ "./src/pages/ApproveAction/components/TransactionDetailsCardContent.tsx");
/* harmony import */ var _components_DetailedCardWrapper__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/DetailedCardWrapper */ "./src/pages/ApproveAction/components/DetailedCardWrapper.tsx");
/* harmony import */ var _src_components_common_FlexScrollbars__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @src/components/common/FlexScrollbars */ "./src/components/common/FlexScrollbars.tsx");
/* harmony import */ var _src_utils_object__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @src/utils/object */ "./src/utils/object.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





















function TxBatchApprovalScreen() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_19__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_6__.useGetRequestId)();
  const {
    action,
    updateAction,
    cancelHandler,
    error: actionError
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_5__.useApproveAction)(requestId, true);
  const [network, setNetwork] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const {
    getNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__.useNetworkContext)();
  const {
    isCalculatingFee,
    feeError,
    hasEnoughForNetworkFee
  } = (0,_hooks_useFeeCustomizer__WEBPACK_IMPORTED_MODULE_14__.useFeeCustomizer)({
    action,
    network
  });
  const {
    displayData,
    context
  } = action ?? {};
  const isFeeValid = !actionError && !feeError && !isCalculatingFee && hasEnoughForNetworkFee;
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!action?.caipId) {
      return;
    }
    setNetwork(getNetwork(action.caipId));
  }, [getNetwork, action?.caipId]);
  const handleRejection = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    cancelHandler();
  }, [cancelHandler]);
  const signTx = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    updateAction({
      status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_3__.ActionStatus.SUBMITTING,
      id: requestId
    });
  }, [requestId, updateAction]);
  (0,_src_utils_useWindowGetsClosedOrHidden__WEBPACK_IMPORTED_MODULE_9__.useWindowGetsClosedOrHidden)(cancelHandler);
  const [index, setIndex] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(-1);
  const [isDetailedView, setIsDetailedView] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  if (!action || !action.signingRequests || !action.displayData || !(0,_src_utils_object__WEBPACK_IMPORTED_MODULE_18__.hasDefined)(action, 'actionId')) {
    return /*#__PURE__*/React.createElement(_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_10__.LoadingOverlay, null);
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      flex: 1,
      width: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Box, {
    sx: {
      width: '100%',
      pt: 1,
      pb: 2,
      height: '56px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Typography, {
    variant: "h4"
  }, t('Approve {{count}} transactions', {
    count: action.signingRequests.length
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_FlexScrollbars__WEBPACK_IMPORTED_MODULE_17__.FlexScrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      width: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      width: '100%',
      gap: 3,
      pt: 1
    }
  }, displayData.details.map((section, sectionIndex) => /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_7__.ApprovalSection, {
    key: `tx-detail-section-${sectionIndex}`
  }, section.title && /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_7__.ApprovalSectionHeader, {
    label: section.title
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_7__.ApprovalSectionBody, {
    sx: {
      py: 1
    }
  }, sectionIndex === 0 && network && /*#__PURE__*/React.createElement(_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_13__.NetworkDetails, {
    network: network
  }), section.items.map((item, itemIndex) => /*#__PURE__*/React.createElement(_src_components_common_approval_TransactionDetailItem__WEBPACK_IMPORTED_MODULE_8__.TransactionDetailItem, {
    key: `tx-detail.${sectionIndex}.${itemIndex}`,
    item: item
  }))))), action.displayData.balanceChange && /*#__PURE__*/React.createElement(_SignTransaction_components_TxBalanceChange__WEBPACK_IMPORTED_MODULE_11__.TxBalanceChange, {
    ins: action.displayData.balanceChange.ins,
    outs: action.displayData.balanceChange.outs,
    isSimulationSuccessful: action.displayData.isSimulationSuccessful
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'center',
      mt: -2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Tooltip, {
    title: t('Shows details of each transaction on its own')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Button, {
    color: "secondary",
    size: "medium",
    onClick: () => {
      if (isDetailedView) {
        setIndex(-1);
        setIsDetailedView(false);
      } else {
        setIndex(0);
        setIsDetailedView(true);
      }
    }
  }, t('See Details')))), action.displayData.tokenApprovals && /*#__PURE__*/React.createElement(_SignTransaction_components_SpendLimitInfo_SpendLimitInfo__WEBPACK_IMPORTED_MODULE_12__.SpendLimitInfo, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, action.displayData.tokenApprovals, {
    isEditable: false,
    actionId: requestId
  })))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    direction: "row",
    sx: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      justifyContent: 'space-between',
      pt: 1.5,
      pb: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Button, {
    color: "secondary",
    "data-testid": "batch-reject-btn",
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_3__.ActionStatus.SUBMITTING,
    size: "large",
    fullWidth: true,
    onClick: handleRejection
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Button, {
    "data-testid": "batch-approve-btn",
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_3__.ActionStatus.SUBMITTING || !isFeeValid || !displayData,
    isLoading: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_3__.ActionStatus.SUBMITTING || !displayData || isCalculatingFee,
    size: "large",
    fullWidth: true,
    onClick: signTx
  }, t('Approve All')))), /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_2__.Overlay, {
    in: isDetailedView,
    isBackgroundFilled: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      pt: 1,
      pl: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.IconButton, {
    size: "small",
    onClick: () => {
      setIndex(-1);
      setIsDetailedView(false);
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.ChevronLeftIcon, {
    size: 32
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      width: 1,
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: 2,
      flexGrow: 1,
      transition: 'transform .2s ease-in-out',
      transform: `translateX(-${index * 336}px)`
    }
  }, action.signingRequests.map((currentTx, txIndex) => /*#__PURE__*/React.createElement(_components_DetailedCardWrapper__WEBPACK_IMPORTED_MODULE_16__.DetailedCardWrapper, {
    key: `card-${txIndex}`,
    isFirst: txIndex === 0,
    isLast: false,
    onClick: txIndex === index ? undefined : () => setIndex(txIndex)
  }, /*#__PURE__*/React.createElement(_components_TransactionDetailsCardContent__WEBPACK_IMPORTED_MODULE_15__.TransactionDetailsCardContent, {
    tx: currentTx,
    handleRejection: handleRejection,
    network: network,
    action: action,
    index: txIndex,
    setIndex: setIndex,
    isFirst: txIndex === 0,
    isLast: false,
    hasEnoughForFee: hasEnoughForNetworkFee
  }))), /*#__PURE__*/React.createElement(_components_DetailedCardWrapper__WEBPACK_IMPORTED_MODULE_16__.DetailedCardWrapper, {
    isFirst: false,
    isLast: true,
    onClick: index === action.signingRequests.length ? undefined : () => setIndex(action.signingRequests.length)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      width: 1,
      flexGrow: 1,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      pt: 6,
      pb: 3,
      px: 5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.HelpCircleIcon, {
    size: 54
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Typography, {
    variant: "h5"
  }, t('Approve all transactions?'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Stack, {
    sx: {
      alignItems: 'flex-end',
      width: '100%',
      justifyContent: 'space-between',
      px: 3,
      pb: 2,
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Button, {
    "data-testid": "transaction-approve-btn",
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_3__.ActionStatus.SUBMITTING || !isFeeValid,
    isLoading: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_3__.ActionStatus.SUBMITTING || isCalculatingFee,
    size: "medium",
    fullWidth: true,
    onClick: signTx
  }, context?.customApprovalButtonText || t('Approve All')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.Button, {
    color: "secondary",
    "data-testid": "transaction-reject-btn",
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_3__.ActionStatus.SUBMITTING,
    size: "medium",
    fullWidth: true,
    onClick: handleRejection
  }, t('Reject'))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__.MobileStepper, {
    position: "static",
    variant: "dots",
    steps: action.signingRequests.length + 1,
    activeStep: index,
    backButton: null,
    nextButton: null,
    sx: {
      pb: 3,
      justifyContent: 'center'
    }
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/DetailedCardWrapper.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/ApproveAction/components/DetailedCardWrapper.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DetailedCardWrapper": () => (/* binding */ DetailedCardWrapper)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const DetailedCardWrapper = ({
  onClick,
  children,
  isFirst,
  isLast
}) => {
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Card, {
    sx: {
      display: 'flex',
      width: 320,
      flex: '0 0 auto',
      backgroundColor: 'grey.850',
      ml: isFirst ? 3.5 : 0,
      mr: isLast ? 3.5 : 0,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Stack, {
    sx: {
      width: 1,
      flexGrow: 1,
      backgroundColor: '#00000000',
      // background completely transparent
      transition: 'background-color .15s ease-in-out',
      ':hover': onClick ? {
        backgroundColor: '#ffffff19',
        cursor: 'pointer'
      } : undefined // a bit ligher background on hover if clickable
    },

    role: onClick ? 'button' : undefined,
    onClick: onClick
  }, children));
};

/***/ }),

/***/ "./src/pages/ApproveAction/components/TransactionDetailsCardContent.tsx":
/*!******************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/TransactionDetailsCardContent.tsx ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TransactionDetailsCardContent": () => (/* binding */ TransactionDetailsCardContent)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_pages_Permissions_components_AlertBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/pages/Permissions/components/AlertBox */ "./src/pages/Permissions/components/AlertBox.tsx");
/* harmony import */ var _src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/pages/Permissions/components/WarningBox */ "./src/pages/Permissions/components/WarningBox.tsx");
/* harmony import */ var _src_pages_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/pages/SignTransaction/components/ApprovalTxDetails */ "./src/pages/SignTransaction/components/ApprovalTxDetails.tsx");
/* harmony import */ var _src_pages_SignTransaction_components_SpendLimitInfo_SpendLimitInfo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/pages/SignTransaction/components/SpendLimitInfo/SpendLimitInfo */ "./src/pages/SignTransaction/components/SpendLimitInfo/SpendLimitInfo.tsx");
/* harmony import */ var _src_pages_SignTransaction_components_TxBalanceChange__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/pages/SignTransaction/components/TxBalanceChange */ "./src/pages/SignTransaction/components/TxBalanceChange.tsx");
/* harmony import */ var _src_components_common_FlexScrollbars__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/common/FlexScrollbars */ "./src/components/common/FlexScrollbars.tsx");
/* harmony import */ var _src_components_common_MaliciousTxAlert__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/components/common/MaliciousTxAlert */ "./src/components/common/MaliciousTxAlert.tsx");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TransactionDetailItem__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/components/common/approval/TransactionDetailItem */ "./src/components/common/approval/TransactionDetailItem.tsx");
/* harmony import */ var _hooks_useFeeCustomizer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../hooks/useFeeCustomizer */ "./src/pages/ApproveAction/hooks/useFeeCustomizer.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");














const TransactionDetailsCardContent = ({
  tx,
  handleRejection,
  network,
  action,
  index,
  setIndex,
  isFirst,
  isLast,
  hasEnoughForFee
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_12__.useTranslation)();
  const {
    renderFeeWidget
  } = (0,_hooks_useFeeCustomizer__WEBPACK_IMPORTED_MODULE_11__.useFeeCustomizer)({
    action,
    network,
    txIndex: index
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "caption",
    sx: {
      position: 'absolute',
      top: 8,
      right: 8,
      opacity: 0.6
    }
  }, `#${index + 1}`), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: 1,
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Box, {
    sx: {
      width: '100%',
      py: 2,
      px: 2,
      zIndex: 1,
      height: '56px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Typography, {
    variant: "h4"
  }, tx.displayData.title)), /*#__PURE__*/React.createElement(_src_components_common_FlexScrollbars__WEBPACK_IMPORTED_MODULE_7__.FlexScrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      flex: 1,
      width: 1,
      px: 2,
      gap: 2,
      pb: 3
    }
  }, tx.displayData.alert && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: 1,
      px: 2,
      mb: 1
    }
  }, tx.displayData.alert.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.AlertType.DANGER ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_MaliciousTxAlert__WEBPACK_IMPORTED_MODULE_8__.MaliciousTxAlert, {
    showAlert: true,
    cancelHandler: handleRejection,
    actionTitles: tx.displayData.alert.details.actionTitles,
    title: tx.displayData.alert.details.title,
    description: tx.displayData.alert.details.description
  }), /*#__PURE__*/React.createElement(_src_pages_Permissions_components_AlertBox__WEBPACK_IMPORTED_MODULE_2__.AlertBox, {
    title: tx.displayData.alert.details.title,
    text: tx.displayData.alert.details.description
  })) : /*#__PURE__*/React.createElement(_src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_3__.WarningBox, {
    title: tx.displayData.alert.details.title,
    text: tx.displayData.alert.details.description
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: '100%',
      gap: 2,
      pt: 1
    }
  }, tx.displayData.details.map((section, sectionIndex) => /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_9__.ApprovalSection, {
    key: `tx-detail-section-${sectionIndex}`
  }, section.title && /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_9__.ApprovalSectionHeader, {
    label: section.title
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_9__.ApprovalSectionBody, {
    sx: {
      py: 1
    }
  }, sectionIndex === 0 && network && /*#__PURE__*/React.createElement(_src_pages_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_4__.NetworkDetails, {
    network: network
  }), section.items.map((item, itemIndex) => /*#__PURE__*/React.createElement(_src_components_common_approval_TransactionDetailItem__WEBPACK_IMPORTED_MODULE_10__.TransactionDetailItem, {
    key: `tx-detail.${sectionIndex}.${itemIndex}`,
    item: item
  }))))), tx.displayData.balanceChange && /*#__PURE__*/React.createElement(_src_pages_SignTransaction_components_TxBalanceChange__WEBPACK_IMPORTED_MODULE_6__.TxBalanceChange, {
    ins: tx.displayData.balanceChange.ins,
    outs: tx.displayData.balanceChange.outs,
    isSimulationSuccessful: tx.displayData.isSimulationSuccessful
  }), tx.displayData.tokenApprovals && /*#__PURE__*/React.createElement(_src_pages_SignTransaction_components_SpendLimitInfo_SpendLimitInfo__WEBPACK_IMPORTED_MODULE_5__.SpendLimitInfo, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, tx.displayData.tokenApprovals, {
    actionId: action.actionId
  })), tx.displayData.networkFeeSelector && renderFeeWidget({
    size: 'small',
    isCollapsible: true,
    hasEnoughForFee
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: 1,
      gap: 1,
      px: 2,
      pb: 2,
      pt: 1,
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    size: "medium",
    color: "secondary",
    fullWidth: true,
    onClick: () => {
      setIndex(index - 1);
    },
    sx: {
      visibility: isFirst ? 'hidden' : 'visible'
    }
  }, t('Previous')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    size: "medium",
    color: "primary",
    fullWidth: true,
    onClick: () => {
      setIndex(index + 1);
    },
    sx: {
      visibility: isLast ? 'hidden' : 'visible'
    }
  }, t('Next')))));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FwcHJvdmVBY3Rpb25fVHhCYXRjaEFwcHJvdmFsU2NyZWVuX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQWlFO0FBRTFELE1BQU1FLGNBQWMsR0FBR0QsdUVBQU0sQ0FBQ0QsbUVBQVUsQ0FBRTtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWjhDO0FBQ1U7QUFXcEI7QUFFb0I7QUFDYztBQUVMO0FBQ0g7QUFDRjtBQUtKO0FBQ3FDO0FBQ1Q7QUFFYjtBQUNRO0FBQ2E7QUFDWjtBQUNyQjtBQUMrQjtBQUNwQjtBQUNBO0FBQ3hCO0FBRXhDLFNBQVNrQyxxQkFBcUJBLENBQUEsRUFBRztFQUN0QyxNQUFNO0lBQUVDO0VBQUUsQ0FBQyxHQUFHaEMsOERBQWMsRUFBRTtFQUM5QixNQUFNaUMsU0FBUyxHQUFHaEIsMkVBQWUsRUFBRTtFQUNuQyxNQUFNO0lBQ0ppQixNQUFNO0lBQ05DLFlBQVk7SUFDWkMsYUFBYTtJQUNiQyxLQUFLLEVBQUVDO0VBQ1QsQ0FBQyxHQUFHdEIsNkVBQWdCLENBQUNpQixTQUFTLEVBQUUsSUFBSSxDQUFDO0VBQ3JDLE1BQU0sQ0FBQ00sT0FBTyxFQUFFQyxVQUFVLENBQUMsR0FBR3JDLCtDQUFRLEVBQXFCO0VBQzNELE1BQU07SUFBRXNDO0VBQVcsQ0FBQyxHQUFHMUIsZ0ZBQWlCLEVBQUU7RUFDMUMsTUFBTTtJQUFFMkIsZ0JBQWdCO0lBQUVDLFFBQVE7SUFBRUM7RUFBdUIsQ0FBQyxHQUMxRGpCLDBFQUFnQixDQUFDO0lBQ2ZPLE1BQU07SUFDTks7RUFDRixDQUFDLENBQUM7RUFFSixNQUFNO0lBQUVNLFdBQVc7SUFBRUM7RUFBUSxDQUFDLEdBQUdaLE1BQU0sSUFBSSxDQUFDLENBQUM7RUFDN0MsTUFBTWEsVUFBVSxHQUNkLENBQUNULFdBQVcsSUFBSSxDQUFD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QUFLLEVBQUMsV0FBVztJQUNqQlMsU0FBUztJQUNUUCxPQUFPLEVBQUVBLENBQUEsS0FBTTtNQUNieEMsUUFBUSxDQUFDRCxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUU7SUFDRk8sRUFBRSxFQUFFO01BQ0YwRixVQUFVLEVBQUV2QyxPQUFPLEdBQUcsUUFBUSxHQUFHO0lBQ25DO0VBQUUsR0FFRGhGLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FDUCxlQUNUMkIsS0FBQSxDQUFBQyxhQUFBLENBQUN2RCxnRUFBTTtJQUNMeUYsSUFBSSxFQUFDLFFBQVE7SUFDYkQsS0FBSyxFQUFDLFNBQVM7SUFDZlMsU0FBUztJQUNUUCxPQUFPLEVBQUVBLENBQUEsS0FBTTtNQUNieEMsUUFBUSxDQUFDRCxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUU7SUFDRk8sRUFBRSxFQUFFO01BQ0YwRixVQUFVLEVBQUV0QyxNQUFNLEdBQUcsUUFBUSxHQUFHO0lBQ2xDO0VBQUUsR0FFRGpGLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDSCxDQUNILENBQ0YsQ0FDUDtBQUVQLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0ZsZXhTY3JvbGxiYXJzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vVHhCYXRjaEFwcHJvdmFsU2NyZWVuLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vY29tcG9uZW50cy9EZXRhaWxlZENhcmRXcmFwcGVyLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vY29tcG9uZW50cy9UcmFuc2FjdGlvbkRldGFpbHNDYXJkQ29udGVudC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2Nyb2xsYmFycywgc3R5bGVkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IEZsZXhTY3JvbGxiYXJzID0gc3R5bGVkKFNjcm9sbGJhcnMpYFxuICBmbGV4LWdyb3c6IDE7XG4gIG1heC1oZWlnaHQ6IHVuc2V0O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xuXG4gICYgPiBkaXYge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgfVxuYDtcbiIsImltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEJveCxcbiAgQnV0dG9uLFxuICBDaGV2cm9uTGVmdEljb24sXG4gIEhlbHBDaXJjbGVJY29uLFxuICBJY29uQnV0dG9uLFxuICBNb2JpbGVTdGVwcGVyLFxuICBTdGFjayxcbiAgVG9vbHRpcCxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vT3ZlcmxheSc7XG5pbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgTmV0d29ya1dpdGhDYWlwSWQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBcHByb3ZlQWN0aW9uIH0gZnJvbSAnQHNyYy9ob29rcy91c2VBcHByb3ZlQWN0aW9uJztcbmltcG9ydCB7IHVzZUdldFJlcXVlc3RJZCB9IGZyb20gJ0BzcmMvaG9va3MvdXNlR2V0UmVxdWVzdElkJztcbmltcG9ydCB7XG4gIEFwcHJvdmFsU2VjdGlvbixcbiAgQXBwcm92YWxTZWN0aW9uQm9keSxcbiAgQXBwcm92YWxTZWN0aW9uSGVhZGVyLFxufSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL0FwcHJvdmFsU2VjdGlvbic7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbkRldGFpbEl0ZW0gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL1RyYW5zYWN0aW9uRGV0YWlsSXRlbSc7XG5pbXBvcnQgeyB1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4gfSBmcm9tICdAc3JjL3V0aWxzL3VzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbic7XG5cbmltcG9ydCB7IExvYWRpbmdPdmVybGF5IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb21tb24vTG9hZGluZ092ZXJsYXknO1xuaW1wb3J0IHsgVHhCYWxhbmNlQ2hhbmdlIH0gZnJvbSAnLi4vU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvVHhCYWxhbmNlQ2hhbmdlJztcbmltcG9ydCB7IFNwZW5kTGltaXRJbmZvIH0gZnJvbSAnLi4vU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvU3BlbmRMaW1pdEluZm8vU3BlbmRMaW1pdEluZm8nO1xuaW1wb3J0IHsgTmV0d29ya0RldGFpbHMgfSBmcm9tICcuLi9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9BcHByb3ZhbFR4RGV0YWlscyc7XG5pbXBvcnQgeyB1c2VGZWVDdXN0b21pemVyIH0gZnJvbSAnLi9ob29rcy91c2VGZWVDdXN0b21pemVyJztcbmltcG9ydCB7IFRyYW5zYWN0aW9uRGV0YWlsc0NhcmRDb250ZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL1RyYW5zYWN0aW9uRGV0YWlsc0NhcmRDb250ZW50JztcbmltcG9ydCB7IERldGFpbGVkQ2FyZFdyYXBwZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvRGV0YWlsZWRDYXJkV3JhcHBlcic7XG5pbXBvcnQgeyBGbGV4U2Nyb2xsYmFycyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRmxleFNjcm9sbGJhcnMnO1xuaW1wb3J0IHsgaGFzRGVmaW5lZCB9IGZyb20gJ0BzcmMvdXRpbHMvb2JqZWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIFR4QmF0Y2hBcHByb3ZhbFNjcmVlbigpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCByZXF1ZXN0SWQgPSB1c2VHZXRSZXF1ZXN0SWQoKTtcbiAgY29uc3Qge1xuICAgIGFjdGlvbixcbiAgICB1cGRhdGVBY3Rpb24sXG4gICAgY2FuY2VsSGFuZGxlcixcbiAgICBlcnJvcjogYWN0aW9uRXJyb3IsXG4gIH0gPSB1c2VBcHByb3ZlQWN0aW9uKHJlcXVlc3RJZCwgdHJ1ZSk7XG4gIGNvbnN0IFtuZXR3b3JrLCBzZXROZXR3b3JrXSA9IHVzZVN0YXRlPE5ldHdvcmtXaXRoQ2FpcElkPigpO1xuICBjb25zdCB7IGdldE5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IHsgaXNDYWxjdWxhdGluZ0ZlZSwgZmVlRXJyb3IsIGhhc0Vub3VnaEZvck5ldHdvcmtGZWUgfSA9XG4gICAgdXNlRmVlQ3VzdG9taXplcih7XG4gICAgICBhY3Rpb24sXG4gICAgICBuZXR3b3JrLFxuICAgIH0pO1xuXG4gIGNvbnN0IHsgZGlzcGxheURhdGEsIGNvbnRleHQgfSA9IGFjdGlvbiA/PyB7fTtcbiAgY29uc3QgaXNGZWVWYWxpZCA9XG4gICAgIWFjdGlvbkVycm9yICYmICFmZWVFcnJvciAmJiAhaXNDYWxjdWxhdGluZ0ZlZSAmJiBoYXNFbm91Z2hGb3JOZXR3b3JrRmVlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFhY3Rpb24/LmNhaXBJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldE5ldHdvcmsoZ2V0TmV0d29yayhhY3Rpb24uY2FpcElkKSk7XG4gIH0sIFtnZXROZXR3b3JrLCBhY3Rpb24/LmNhaXBJZF0pO1xuXG4gIGNvbnN0IGhhbmRsZVJlamVjdGlvbiA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjYW5jZWxIYW5kbGVyKCk7XG4gIH0sIFtjYW5jZWxIYW5kbGVyXSk7XG5cbiAgY29uc3Qgc2lnblR4ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICBzdGF0dXM6IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HLFxuICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICB9KTtcbiAgfSwgW3JlcXVlc3RJZCwgdXBkYXRlQWN0aW9uXSk7XG5cbiAgdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuKGNhbmNlbEhhbmRsZXIpO1xuXG4gIGNvbnN0IFtpbmRleCwgc2V0SW5kZXhdID0gdXNlU3RhdGUoLTEpO1xuICBjb25zdCBbaXNEZXRhaWxlZFZpZXcsIHNldElzRGV0YWlsZWRWaWV3XSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBpZiAoXG4gICAgIWFjdGlvbiB8fFxuICAgICFhY3Rpb24uc2lnbmluZ1JlcXVlc3RzIHx8XG4gICAgIWFjdGlvbi5kaXNwbGF5RGF0YSB8fFxuICAgICFoYXNEZWZpbmVkKGFjdGlvbiwgJ2FjdGlvbklkJylcbiAgKSB7XG4gICAgcmV0dXJuIDxMb2FkaW5nT3ZlcmxheSAvPjtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFjayBzeD17eyBmbGV4OiAxLCB3aWR0aDogMSwgcHg6IDIgfX0+XG4gICAgICAgICAgPEJveFxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgcHQ6IDEsXG4gICAgICAgICAgICAgIHBiOiAyLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICc1NnB4JyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg0XCI+XG4gICAgICAgICAgICAgIHt0KCdBcHByb3ZlIHt7Y291bnR9fSB0cmFuc2FjdGlvbnMnLCB7XG4gICAgICAgICAgICAgICAgY291bnQ6IGFjdGlvbi5zaWduaW5nUmVxdWVzdHMubGVuZ3RoLFxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L0JveD5cblxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAgICAgIDxGbGV4U2Nyb2xsYmFycz5cbiAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICBnYXA6IDIsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogJzEwMCUnLCBnYXA6IDMsIHB0OiAxIH19PlxuICAgICAgICAgICAgICAgICAge2Rpc3BsYXlEYXRhLmRldGFpbHMubWFwKChzZWN0aW9uLCBzZWN0aW9uSW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPEFwcHJvdmFsU2VjdGlvbiBrZXk9e2B0eC1kZXRhaWwtc2VjdGlvbi0ke3NlY3Rpb25JbmRleH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICB7c2VjdGlvbi50aXRsZSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXtzZWN0aW9uLnRpdGxlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHkgc3g9e3sgcHk6IDEgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VjdGlvbkluZGV4ID09PSAwICYmIG5ldHdvcmsgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8TmV0d29ya0RldGFpbHMgbmV0d29yaz17bmV0d29ya30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VjdGlvbi5pdGVtcy5tYXAoKGl0ZW0sIGl0ZW1JbmRleCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHJhbnNhY3Rpb25EZXRhaWxJdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtgdHgtZGV0YWlsLiR7c2VjdGlvbkluZGV4fS4ke2l0ZW1JbmRleH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICAgICAgICAgICAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgKSl9XG5cbiAgICAgICAgICAgICAgICAgIHthY3Rpb24uZGlzcGxheURhdGEuYmFsYW5jZUNoYW5nZSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxUeEJhbGFuY2VDaGFuZ2VcbiAgICAgICAgICAgICAgICAgICAgICBpbnM9e2FjdGlvbi5kaXNwbGF5RGF0YS5iYWxhbmNlQ2hhbmdlLmluc31cbiAgICAgICAgICAgICAgICAgICAgICBvdXRzPXthY3Rpb24uZGlzcGxheURhdGEuYmFsYW5jZUNoYW5nZS5vdXRzfVxuICAgICAgICAgICAgICAgICAgICAgIGlzU2ltdWxhdGlvblN1Y2Nlc3NmdWw9e1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmRpc3BsYXlEYXRhLmlzU2ltdWxhdGlvblN1Y2Nlc3NmdWxcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgbXQ6IC0yLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXt0KCdTaG93cyBkZXRhaWxzIG9mIGVhY2ggdHJhbnNhY3Rpb24gb24gaXRzIG93bicpfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT1cIm1lZGl1bVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0RldGFpbGVkVmlldykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEluZGV4KC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRJc0RldGFpbGVkVmlldyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SW5kZXgoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SXNEZXRhaWxlZFZpZXcodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3QoJ1NlZSBEZXRhaWxzJyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICAgICAgICAgIHthY3Rpb24uZGlzcGxheURhdGEudG9rZW5BcHByb3ZhbHMgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8U3BlbmRMaW1pdEluZm9cbiAgICAgICAgICAgICAgICAgICAgICB7Li4uYWN0aW9uLmRpc3BsYXlEYXRhLnRva2VuQXBwcm92YWxzfVxuICAgICAgICAgICAgICAgICAgICAgIGlzRWRpdGFibGU9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbklkPXtyZXF1ZXN0SWR9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8L0ZsZXhTY3JvbGxiYXJzPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgIHB0OiAxLjUsXG4gICAgICAgICAgICAgIHBiOiAxLFxuICAgICAgICAgICAgICBnYXA6IDEsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImJhdGNoLXJlamVjdC1idG5cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17YWN0aW9uLnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkd9XG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZWplY3Rpb259XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdSZWplY3QnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImJhdGNoLWFwcHJvdmUtYnRuXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e1xuICAgICAgICAgICAgICAgIGFjdGlvbi5zdGF0dXMgPT09IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HIHx8XG4gICAgICAgICAgICAgICAgIWlzRmVlVmFsaWQgfHxcbiAgICAgICAgICAgICAgICAhZGlzcGxheURhdGFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpc0xvYWRpbmc9e1xuICAgICAgICAgICAgICAgIGFjdGlvbi5zdGF0dXMgPT09IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HIHx8XG4gICAgICAgICAgICAgICAgIWRpc3BsYXlEYXRhIHx8XG4gICAgICAgICAgICAgICAgaXNDYWxjdWxhdGluZ0ZlZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICBvbkNsaWNrPXtzaWduVHh9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdBcHByb3ZlIEFsbCcpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPE92ZXJsYXkgaW49e2lzRGV0YWlsZWRWaWV3fSBpc0JhY2tncm91bmRGaWxsZWQ+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBnYXA6IDEgfX0+XG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBwdDogMSxcbiAgICAgICAgICAgICAgICBwbDogMSxcbiAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtc3RhcnQnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgc2V0SW5kZXgoLTEpO1xuICAgICAgICAgICAgICAgICAgc2V0SXNEZXRhaWxlZFZpZXcoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8Q2hldnJvbkxlZnRJY29uIHNpemU9ezMyfSAvPlxuICAgICAgICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgZmxleFdyYXA6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgIGdhcDogMixcbiAgICAgICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIC4ycyBlYXNlLWluLW91dCcsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlWCgtJHtpbmRleCAqIDMzNn1weClgLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7YWN0aW9uLnNpZ25pbmdSZXF1ZXN0cy5tYXAoKGN1cnJlbnRUeCwgdHhJbmRleCkgPT4gKFxuICAgICAgICAgICAgICAgIDxEZXRhaWxlZENhcmRXcmFwcGVyXG4gICAgICAgICAgICAgICAgICBrZXk9e2BjYXJkLSR7dHhJbmRleH1gfVxuICAgICAgICAgICAgICAgICAgaXNGaXJzdD17dHhJbmRleCA9PT0gMH1cbiAgICAgICAgICAgICAgICAgIGlzTGFzdD17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtcbiAgICAgICAgICAgICAgICAgICAgdHhJbmRleCA9PT0gaW5kZXggPyB1bmRlZmluZWQgOiAoKSA9PiBzZXRJbmRleCh0eEluZGV4KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxUcmFuc2FjdGlvbkRldGFpbHNDYXJkQ29udGVudFxuICAgICAgICAgICAgICAgICAgICB0eD17Y3VycmVudFR4fVxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVSZWplY3Rpb249e2hhbmRsZVJlamVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgbmV0d29yaz17bmV0d29ya31cbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uPXthY3Rpb259XG4gICAgICAgICAgICAgICAgICAgIGluZGV4PXt0eEluZGV4fVxuICAgICAgICAgICAgICAgICAgICBzZXRJbmRleD17c2V0SW5kZXh9XG4gICAgICAgICAgICAgICAgICAgIGlzRmlyc3Q9e3R4SW5kZXggPT09IDB9XG4gICAgICAgICAgICAgICAgICAgIGlzTGFzdD17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgIGhhc0Vub3VnaEZvckZlZT17aGFzRW5vdWdoRm9yTmV0d29ya0ZlZX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9EZXRhaWxlZENhcmRXcmFwcGVyPlxuICAgICAgICAgICAgICApKX1cblxuICAgICAgICAgICAgICA8RGV0YWlsZWRDYXJkV3JhcHBlclxuICAgICAgICAgICAgICAgIGlzRmlyc3Q9e2ZhbHNlfVxuICAgICAgICAgICAgICAgIGlzTGFzdD17dHJ1ZX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtcbiAgICAgICAgICAgICAgICAgIGluZGV4ID09PSBhY3Rpb24uc2lnbmluZ1JlcXVlc3RzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA6ICgpID0+IHNldEluZGV4KGFjdGlvbi5zaWduaW5nUmVxdWVzdHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBnYXA6IDMsXG4gICAgICAgICAgICAgICAgICAgIHB0OiA2LFxuICAgICAgICAgICAgICAgICAgICBwYjogMyxcbiAgICAgICAgICAgICAgICAgICAgcHg6IDUsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxIZWxwQ2lyY2xlSWNvbiBzaXplPXs1NH0gLz5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPlxuICAgICAgICAgICAgICAgICAgICB7dCgnQXBwcm92ZSBhbGwgdHJhbnNhY3Rpb25zPycpfVxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICBweDogMyxcbiAgICAgICAgICAgICAgICAgICAgcGI6IDIsXG4gICAgICAgICAgICAgICAgICAgIGdhcDogMixcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInRyYW5zYWN0aW9uLWFwcHJvdmUtYnRuXCJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e1xuICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5zdGF0dXMgPT09IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HIHx8ICFpc0ZlZVZhbGlkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXNMb2FkaW5nPXtcbiAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24uc3RhdHVzID09PSBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyB8fFxuICAgICAgICAgICAgICAgICAgICAgIGlzQ2FsY3VsYXRpbmdGZWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzaXplPVwibWVkaXVtXCJcbiAgICAgICAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3NpZ25UeH1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2NvbnRleHQ/LmN1c3RvbUFwcHJvdmFsQnV0dG9uVGV4dCB8fCB0KCdBcHByb3ZlIEFsbCcpfVxuICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmFuc2FjdGlvbi1yZWplY3QtYnRuXCJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2FjdGlvbi5zdGF0dXMgPT09IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HfVxuICAgICAgICAgICAgICAgICAgICBzaXplPVwibWVkaXVtXCJcbiAgICAgICAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlamVjdGlvbn1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3QoJ1JlamVjdCcpfVxuICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPC9EZXRhaWxlZENhcmRXcmFwcGVyPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDxNb2JpbGVTdGVwcGVyXG4gICAgICAgICAgICAgIHBvc2l0aW9uPVwic3RhdGljXCJcbiAgICAgICAgICAgICAgdmFyaWFudD1cImRvdHNcIlxuICAgICAgICAgICAgICBzdGVwcz17YWN0aW9uLnNpZ25pbmdSZXF1ZXN0cy5sZW5ndGggKyAxfVxuICAgICAgICAgICAgICBhY3RpdmVTdGVwPXtpbmRleH1cbiAgICAgICAgICAgICAgYmFja0J1dHRvbj17bnVsbH1cbiAgICAgICAgICAgICAgbmV4dEJ1dHRvbj17bnVsbH1cbiAgICAgICAgICAgICAgc3g9e3sgcGI6IDMsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L092ZXJsYXk+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBQcm9wc1dpdGhDaGlsZHJlbiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IENhcmQsIFN0YWNrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IERldGFpbGVkQ2FyZFdyYXBwZXIgPSAoe1xuICBvbkNsaWNrLFxuICBjaGlsZHJlbixcbiAgaXNGaXJzdCxcbiAgaXNMYXN0LFxufTogUHJvcHNXaXRoQ2hpbGRyZW48e1xuICBvbkNsaWNrPzogKCkgPT4gdm9pZDtcbiAgaXNMYXN0OiBib29sZWFuO1xuICBpc0ZpcnN0OiBib29sZWFuO1xufT4pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8Q2FyZFxuICAgICAgc3g9e3tcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICB3aWR0aDogMzIwLFxuICAgICAgICBmbGV4OiAnMCAwIGF1dG8nLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmV5Ljg1MCcsXG4gICAgICAgIG1sOiBpc0ZpcnN0ID8gMy41IDogMCxcbiAgICAgICAgbXI6IGlzTGFzdCA/IDMuNSA6IDAsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwMDAwMDAnLCAvLyBiYWNrZ3JvdW5kIGNvbXBsZXRlbHkgdHJhbnNwYXJlbnRcbiAgICAgICAgICB0cmFuc2l0aW9uOiAnYmFja2dyb3VuZC1jb2xvciAuMTVzIGVhc2UtaW4tb3V0JyxcbiAgICAgICAgICAnOmhvdmVyJzogb25DbGlja1xuICAgICAgICAgICAgPyB7IGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYxOScsIGN1cnNvcjogJ3BvaW50ZXInIH1cbiAgICAgICAgICAgIDogdW5kZWZpbmVkLCAvLyBhIGJpdCBsaWdoZXIgYmFja2dyb3VuZCBvbiBob3ZlciBpZiBjbGlja2FibGVcbiAgICAgICAgfX1cbiAgICAgICAgcm9sZT17b25DbGljayA/ICdidXR0b24nIDogdW5kZWZpbmVkfVxuICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L1N0YWNrPlxuICAgIDwvQ2FyZD5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7XG4gIEFsZXJ0VHlwZSxcbiAgU2lnbmluZ0RhdGFfRXRoU2VuZFR4LFxuICBTaWduaW5nUmVxdWVzdCxcbn0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuaW1wb3J0IHsgQWxlcnRCb3ggfSBmcm9tICdAc3JjL3BhZ2VzL1Blcm1pc3Npb25zL2NvbXBvbmVudHMvQWxlcnRCb3gnO1xuaW1wb3J0IHsgV2FybmluZ0JveCB9IGZyb20gJ0BzcmMvcGFnZXMvUGVybWlzc2lvbnMvY29tcG9uZW50cy9XYXJuaW5nQm94JztcbmltcG9ydCB7IE5ldHdvcmtEZXRhaWxzIH0gZnJvbSAnQHNyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9BcHByb3ZhbFR4RGV0YWlscyc7XG5pbXBvcnQgeyBTcGVuZExpbWl0SW5mbyB9IGZyb20gJ0BzcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvU3BlbmRMaW1pdEluZm8vU3BlbmRMaW1pdEluZm8nO1xuaW1wb3J0IHsgVHhCYWxhbmNlQ2hhbmdlIH0gZnJvbSAnQHNyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9UeEJhbGFuY2VDaGFuZ2UnO1xuaW1wb3J0IHsgTmV0d29ya1dpdGhDYWlwSWQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay9tb2RlbHMnO1xuaW1wb3J0IHsgRmxleFNjcm9sbGJhcnMgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0ZsZXhTY3JvbGxiYXJzJztcbmltcG9ydCB7IE1hbGljaW91c1R4QWxlcnQgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL01hbGljaW91c1R4QWxlcnQnO1xuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFRyYW5zYWN0aW9uRGV0YWlsSXRlbSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHJhbnNhY3Rpb25EZXRhaWxJdGVtJztcbmltcG9ydCB7IHVzZUZlZUN1c3RvbWl6ZXIgfSBmcm9tICcuLi9ob29rcy91c2VGZWVDdXN0b21pemVyJztcbmltcG9ydCB7IE11bHRpVHhBY3Rpb24gfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgRW5zdXJlRGVmaW5lZCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9tb2RlbHMnO1xuXG5leHBvcnQgY29uc3QgVHJhbnNhY3Rpb25EZXRhaWxzQ2FyZENvbnRlbnQgPSAoe1xuICB0eCxcbiAgaGFuZGxlUmVqZWN0aW9uLFxuICBuZXR3b3JrLFxuICBhY3Rpb24sXG4gIGluZGV4LFxuICBzZXRJbmRleCxcbiAgaXNGaXJzdCxcbiAgaXNMYXN0LFxuICBoYXNFbm91Z2hGb3JGZWUsXG59OiB7XG4gIHR4OiBTaWduaW5nUmVxdWVzdDxTaWduaW5nRGF0YV9FdGhTZW5kVHg+O1xuICBoYW5kbGVSZWplY3Rpb246ICgpID0+IHZvaWQ7XG4gIG5ldHdvcms/OiBOZXR3b3JrV2l0aENhaXBJZDtcbiAgYWN0aW9uOiBFbnN1cmVEZWZpbmVkPE11bHRpVHhBY3Rpb24sICdhY3Rpb25JZCc+O1xuICBpbmRleDogbnVtYmVyO1xuICBzZXRJbmRleDogKGluZGV4OiBudW1iZXIpID0+IHZvaWQ7XG4gIGlzRmlyc3Q6IGJvb2xlYW47XG4gIGlzTGFzdDogYm9vbGVhbjtcbiAgaGFzRW5vdWdoRm9yRmVlOiBib29sZWFuO1xufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgcmVuZGVyRmVlV2lkZ2V0IH0gPSB1c2VGZWVDdXN0b21pemVyKHtcbiAgICBhY3Rpb24sXG4gICAgbmV0d29yayxcbiAgICB0eEluZGV4OiBpbmRleCxcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICBzeD17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICByaWdodDogOCxcbiAgICAgICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtgIyR7aW5kZXggKyAxfWB9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgey8qIEhlYWRlciAqL31cbiAgICAgICAgPEJveFxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgcHk6IDIsXG4gICAgICAgICAgICBweDogMixcbiAgICAgICAgICAgIHpJbmRleDogMSxcbiAgICAgICAgICAgIGhlaWdodDogJzU2cHgnLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDRcIj57dHguZGlzcGxheURhdGEudGl0bGV9PC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L0JveD5cbiAgICAgICAgPEZsZXhTY3JvbGxiYXJzPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4OiAxLCB3aWR0aDogMSwgcHg6IDIsIGdhcDogMiwgcGI6IDMgfX0+XG4gICAgICAgICAgICB7dHguZGlzcGxheURhdGEuYWxlcnQgJiYgKFxuICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIHB4OiAyLCBtYjogMSB9fT5cbiAgICAgICAgICAgICAgICB7dHguZGlzcGxheURhdGEuYWxlcnQudHlwZSA9PT0gQWxlcnRUeXBlLkRBTkdFUiA/IChcbiAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgIDxNYWxpY2lvdXNUeEFsZXJ0XG4gICAgICAgICAgICAgICAgICAgICAgc2hvd0FsZXJ0XG4gICAgICAgICAgICAgICAgICAgICAgY2FuY2VsSGFuZGxlcj17aGFuZGxlUmVqZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblRpdGxlcz17dHguZGlzcGxheURhdGEuYWxlcnQuZGV0YWlscy5hY3Rpb25UaXRsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e3R4LmRpc3BsYXlEYXRhLmFsZXJ0LmRldGFpbHMudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb249e3R4LmRpc3BsYXlEYXRhLmFsZXJ0LmRldGFpbHMuZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxBbGVydEJveFxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXt0eC5kaXNwbGF5RGF0YS5hbGVydC5kZXRhaWxzLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e3R4LmRpc3BsYXlEYXRhLmFsZXJ0LmRldGFpbHMuZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPFdhcm5pbmdCb3hcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9e3R4LmRpc3BsYXlEYXRhLmFsZXJ0LmRldGFpbHMudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIHRleHQ9e3R4LmRpc3BsYXlEYXRhLmFsZXJ0LmRldGFpbHMuZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAnMTAwJScsIGdhcDogMiwgcHQ6IDEgfX0+XG4gICAgICAgICAgICAgIHt0eC5kaXNwbGF5RGF0YS5kZXRhaWxzLm1hcCgoc2VjdGlvbiwgc2VjdGlvbkluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgPEFwcHJvdmFsU2VjdGlvbiBrZXk9e2B0eC1kZXRhaWwtc2VjdGlvbi0ke3NlY3Rpb25JbmRleH1gfT5cbiAgICAgICAgICAgICAgICAgIHtzZWN0aW9uLnRpdGxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkhlYWRlciBsYWJlbD17c2VjdGlvbi50aXRsZX0gLz5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8QXBwcm92YWxTZWN0aW9uQm9keSBzeD17eyBweTogMSB9fT5cbiAgICAgICAgICAgICAgICAgICAge3NlY3Rpb25JbmRleCA9PT0gMCAmJiBuZXR3b3JrICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8TmV0d29ya0RldGFpbHMgbmV0d29yaz17bmV0d29ya30gLz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAge3NlY3Rpb24uaXRlbXMubWFwKChpdGVtLCBpdGVtSW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8VHJhbnNhY3Rpb25EZXRhaWxJdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2B0eC1kZXRhaWwuJHtzZWN0aW9uSW5kZXh9LiR7aXRlbUluZGV4fWB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICAgICAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAge3R4LmRpc3BsYXlEYXRhLmJhbGFuY2VDaGFuZ2UgJiYgKFxuICAgICAgICAgICAgICAgIDxUeEJhbGFuY2VDaGFuZ2VcbiAgICAgICAgICAgICAgICAgIGlucz17dHguZGlzcGxheURhdGEuYmFsYW5jZUNoYW5nZS5pbnN9XG4gICAgICAgICAgICAgICAgICBvdXRzPXt0eC5kaXNwbGF5RGF0YS5iYWxhbmNlQ2hhbmdlLm91dHN9XG4gICAgICAgICAgICAgICAgICBpc1NpbXVsYXRpb25TdWNjZXNzZnVsPXt0eC5kaXNwbGF5RGF0YS5pc1NpbXVsYXRpb25TdWNjZXNzZnVsfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHt0eC5kaXNwbGF5RGF0YS50b2tlbkFwcHJvdmFscyAmJiAoXG4gICAgICAgICAgICAgICAgPFNwZW5kTGltaXRJbmZvXG4gICAgICAgICAgICAgICAgICB7Li4udHguZGlzcGxheURhdGEudG9rZW5BcHByb3ZhbHN9XG4gICAgICAgICAgICAgICAgICBhY3Rpb25JZD17YWN0aW9uLmFjdGlvbklkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHt0eC5kaXNwbGF5RGF0YS5uZXR3b3JrRmVlU2VsZWN0b3IgJiZcbiAgICAgICAgICAgICAgICByZW5kZXJGZWVXaWRnZXQoe1xuICAgICAgICAgICAgICAgICAgc2l6ZTogJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgIGlzQ29sbGFwc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICBoYXNFbm91Z2hGb3JGZWUsXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvRmxleFNjcm9sbGJhcnM+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICAgIHB4OiAyLFxuICAgICAgICAgICAgcGI6IDIsXG4gICAgICAgICAgICBwdDogMSxcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBzaXplPVwibWVkaXVtXCJcbiAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRJbmRleChpbmRleCAtIDEpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHZpc2liaWxpdHk6IGlzRmlyc3QgPyAnaGlkZGVuJyA6ICd2aXNpYmxlJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ1ByZXZpb3VzJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgc2l6ZT1cIm1lZGl1bVwiXG4gICAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldEluZGV4KGluZGV4ICsgMSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgdmlzaWJpbGl0eTogaXNMYXN0ID8gJ2hpZGRlbicgOiAndmlzaWJsZScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdOZXh0Jyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvPlxuICApO1xufTtcbiJdLCJuYW1lcyI6WyJTY3JvbGxiYXJzIiwic3R5bGVkIiwiRmxleFNjcm9sbGJhcnMiLCJ1c2VUcmFuc2xhdGlvbiIsInVzZUNhbGxiYWNrIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJCb3giLCJCdXR0b24iLCJDaGV2cm9uTGVmdEljb24iLCJIZWxwQ2lyY2xlSWNvbiIsIkljb25CdXR0b24iLCJNb2JpbGVTdGVwcGVyIiwiU3RhY2siLCJUb29sdGlwIiwiVHlwb2dyYXBoeSIsIk92ZXJsYXkiLCJBY3Rpb25TdGF0dXMiLCJ1c2VOZXR3b3JrQ29udGV4dCIsInVzZUFwcHJvdmVBY3Rpb24iLCJ1c2VHZXRSZXF1ZXN0SWQiLCJBcHByb3ZhbFNlY3Rpb24iLCJBcHByb3ZhbFNlY3Rpb25Cb2R5IiwiQXBwcm92YWxTZWN0aW9uSGVhZGVyIiwiVHJhbnNhY3Rpb25EZXRhaWxJdGVtIiwidXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuIiwiTG9hZGluZ092ZXJsYXkiLCJUeEJhbGFuY2VDaGFuZ2UiLCJTcGVuZExpbWl0SW5mbyIsIk5ldHdvcmtEZXRhaWxzIiwidXNlRmVlQ3VzdG9taXplciIsIlRyYW5zYWN0aW9uRGV0YWlsc0NhcmRDb250ZW50IiwiRGV0YWlsZWRDYXJkV3JhcHBlciIsImhhc0RlZmluZWQiLCJUeEJhdGNoQXBwcm92YWxTY3JlZW4iLCJ0IiwicmVxdWVzdElkIiwiYWN0aW9uIiwidXBkYXRlQWN0aW9uIiwiY2FuY2VsSGFuZGxlciIsImVycm9yIiwiYWN0aW9uRXJyb3IiLCJuZXR3b3JrIiwic2V0TmV0d29yayIsImdldE5ldHdvcmsiLCJpc0NhbGN1bGF0aW5nRmVlIiwiZmVlRXJyb3IiLCJoYXNFbm91Z2hGb3JOZXR3b3JrRmVlIiwiZGlzcGxheURhdGEiLCJjb250ZXh0IiwiaXNGZWVWYWxpZCIsImNhaXBJZCIsImhhbmRsZVJlamVjdGlvbiIsInNpZ25UeCIsInN0YXR1cyIsIlNVQk1JVFRJTkciLCJpZCIsImluZGV4Iiwic2V0SW5kZXgiLCJpc0RldGFpbGVkVmlldyIsInNldElzRGV0YWlsZWRWaWV3Iiwic2lnbmluZ1JlcXVlc3RzIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJ3aWR0aCIsImhlaWdodCIsInBvc2l0aW9uIiwiYWxpZ25JdGVtcyIsImZsZXgiLCJweCIsInB0IiwicGIiLCJ2YXJpYW50IiwiY291bnQiLCJsZW5ndGgiLCJmbGV4R3JvdyIsImp1c3RpZnlDb250ZW50IiwiZ2FwIiwiZGV0YWlscyIsIm1hcCIsInNlY3Rpb24iLCJzZWN0aW9uSW5kZXgiLCJrZXkiLCJ0aXRsZSIsImxhYmVsIiwicHkiLCJpdGVtcyIsIml0ZW0iLCJpdGVtSW5kZXgiLCJiYWxhbmNlQ2hhbmdlIiwiaW5zIiwib3V0cyIsImlzU2ltdWxhdGlvblN1Y2Nlc3NmdWwiLCJmbGV4RGlyZWN0aW9uIiwibXQiLCJjb2xvciIsInNpemUiLCJvbkNsaWNrIiwidG9rZW5BcHByb3ZhbHMiLCJfZXh0ZW5kcyIsImlzRWRpdGFibGUiLCJhY3Rpb25JZCIsImRpcmVjdGlvbiIsImRpc2FibGVkIiwiZnVsbFdpZHRoIiwiaXNMb2FkaW5nIiwiaW4iLCJpc0JhY2tncm91bmRGaWxsZWQiLCJwbCIsImZsZXhXcmFwIiwidHJhbnNpdGlvbiIsInRyYW5zZm9ybSIsImN1cnJlbnRUeCIsInR4SW5kZXgiLCJpc0ZpcnN0IiwiaXNMYXN0IiwidW5kZWZpbmVkIiwidHgiLCJoYXNFbm91Z2hGb3JGZWUiLCJ0ZXh0QWxpZ24iLCJjdXN0b21BcHByb3ZhbEJ1dHRvblRleHQiLCJzdGVwcyIsImFjdGl2ZVN0ZXAiLCJiYWNrQnV0dG9uIiwibmV4dEJ1dHRvbiIsIkNhcmQiLCJjaGlsZHJlbiIsImRpc3BsYXkiLCJiYWNrZ3JvdW5kQ29sb3IiLCJtbCIsIm1yIiwiY3Vyc29yIiwicm9sZSIsIkFsZXJ0VHlwZSIsIkFsZXJ0Qm94IiwiV2FybmluZ0JveCIsIk1hbGljaW91c1R4QWxlcnQiLCJyZW5kZXJGZWVXaWRnZXQiLCJGcmFnbWVudCIsInRvcCIsInJpZ2h0Iiwib3BhY2l0eSIsInpJbmRleCIsImFsZXJ0IiwibWIiLCJ0eXBlIiwiREFOR0VSIiwic2hvd0FsZXJ0IiwiYWN0aW9uVGl0bGVzIiwiZGVzY3JpcHRpb24iLCJ0ZXh0IiwibmV0d29ya0ZlZVNlbGVjdG9yIiwiaXNDb2xsYXBzaWJsZSIsInZpc2liaWxpdHkiXSwic291cmNlUm9vdCI6IiJ9