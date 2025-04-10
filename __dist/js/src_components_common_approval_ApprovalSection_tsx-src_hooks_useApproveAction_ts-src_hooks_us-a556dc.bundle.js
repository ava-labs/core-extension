"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_approval_ApprovalSection_tsx-src_hooks_useApproveAction_ts-src_hooks_us-a556dc"],{

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

/***/ "./src/hooks/useApproveAction.ts":
/*!***************************************!*\
  !*** ./src/hooks/useApproveAction.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useApproveAction": () => (/* binding */ useApproveAction)
/* harmony export */ });
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_utils_useWindowGetsClosedOrHidden__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/useWindowGetsClosedOrHidden */ "./src/utils/useWindowGetsClosedOrHidden.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _useIsSpecificContextContainer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./useIsSpecificContextContainer */ "./src/hooks/useIsSpecificContextContainer.ts");
/* harmony import */ var _src_contexts_ApprovalsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/ApprovalsProvider */ "./src/contexts/ApprovalsProvider.tsx");
/* harmony import */ var _src_utils_actions_getUpdatedActionData__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/utils/actions/getUpdatedActionData */ "./src/utils/actions/getUpdatedActionData.ts");









function useApproveAction(actionId, isBatchApproval = false) {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__.useConnectionContext)();
  const isConfirmPopup = (0,_useIsSpecificContextContainer__WEBPACK_IMPORTED_MODULE_5__.useIsSpecificContextContainer)(_useIsSpecificContextContainer__WEBPACK_IMPORTED_MODULE_5__.ContextContainer.CONFIRM);
  const {
    approval
  } = (0,_src_contexts_ApprovalsProvider__WEBPACK_IMPORTED_MODULE_6__.useApprovalsContext)();
  const [action, setAction] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)();
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const updateAction = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async (params, shouldWaitForResponse) => {
    // We need to update the status a bit faster for smoother UX.
    // use function to avoid `action` as a dependency and thus infinite loops
    setAction(prevActionData => {
      if (!prevActionData) {
        return;
      }

      // For MultiTxAction, we don't allow any updates besides the status.
      if ((0,_src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.isBatchApprovalAction)(prevActionData)) {
        return {
          ...prevActionData,
          status: params.status
        };
      }
      return {
        ...prevActionData,
        status: params.status,
        displayData: {
          ...prevActionData.displayData,
          ...params.displayData
        },
        signingData: (0,_src_utils_actions_getUpdatedActionData__WEBPACK_IMPORTED_MODULE_7__.getUpdatedSigningData)(prevActionData.signingData, params.signingData)
      };
    });
    const shouldCloseAfterUpdate = isConfirmPopup && params.status !== _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.PENDING;
    return request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__.ExtensionRequest.ACTION_UPDATE,
      params: [params, shouldWaitForResponse]
    }).finally(() => {
      if (shouldCloseAfterUpdate) {
        globalThis.close();
      }
    });
  }, [request, isConfirmPopup]);
  const cancelHandler = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async () => updateAction({
    status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.ERROR_USER_CANCELED,
    id: actionId
  }), [actionId, updateAction]);
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (isConfirmPopup) {
      request({
        method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__.ExtensionRequest.ACTION_GET,
        params: [actionId]
      }).then(a => {
        if (isBatchApproval && !(0,_src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.isBatchApprovalAction)(a)) {
          setError('Expected a batch approval action');
        } else if (!isBatchApproval && (0,_src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.isBatchApprovalAction)(a)) {
          setError('Expected a single approval action');
        } else {
          setAction(a);
        }
      });
    } else if (approval?.action.actionId === actionId) {
      setAction(approval.action);
    }
  }, [actionId, request, approval, isConfirmPopup, isBatchApproval]);
  (0,_src_utils_useWindowGetsClosedOrHidden__WEBPACK_IMPORTED_MODULE_3__.useWindowGetsClosedOrHidden)(cancelHandler);
  return {
    action,
    updateAction,
    error,
    cancelHandler
  };
}

/***/ }),

/***/ "./src/hooks/useGetRequestId.ts":
/*!**************************************!*\
  !*** ./src/hooks/useGetRequestId.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useGetRequestId": () => (/* binding */ useGetRequestId)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");



/**
 * This is used to get the id of a transaction or message that
 * has been put into localstorage and to be used across multiple
 * contexts. We grab the query param and use that to get the item out of storage.
 *
 * @returns id from the query param
 */
function useGetRequestId() {
  const location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const searchParams = new URLSearchParams(location.search ?? '');
    return searchParams.get('actionId') ?? '';
  }, [location.search]);
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/ApprovalTxDetails.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/SignTransaction/components/ApprovalTxDetails.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountDetails": () => (/* binding */ AccountDetails),
/* harmony export */   "ContractDetails": () => (/* binding */ ContractDetails),
/* harmony export */   "NetworkDetails": () => (/* binding */ NetworkDetails),
/* harmony export */   "WebsiteDetails": () => (/* binding */ WebsiteDetails)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* harmony import */ var _src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/getExplorerAddress */ "./src/utils/getExplorerAddress.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_utils_extensionUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/extensionUtils */ "./src/utils/extensionUtils.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








const ContractDetails = ({
  contractAddress,
  network
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  return /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_5__.TxDetailsRow, {
    label: t('Contract')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    sx: {
      p: 0,
      minWidth: 'auto',
      display: 'inline-flex'
    },
    variant: "text",
    color: "primary",
    onClick: () => network && (0,_src_utils_extensionUtils__WEBPACK_IMPORTED_MODULE_3__.openNewTab)({
      url: (0,_src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_1__.getExplorerAddressByNetwork)(network, contractAddress, 'address')
    })
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.ExternalLinkIcon, {
    size: 14
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tooltip, {
    placement: "top",
    title: contractAddress
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption"
  }, (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__.truncateAddress)(contractAddress))));
};
const AccountDetails = ({
  address,
  label
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    getAccount
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const account = getAccount(address);
  return /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_5__.TxDetailsRow, {
    label: label || t('Account')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tooltip, {
    title: address
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption"
  }, account?.name ?? (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__.truncateAddress)(address))));
};
const WebsiteDetails = ({
  site
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();

  // Do not show if request originated from the extension itself
  if (site.domain === location.hostname) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_5__.TxDetailsRow, {
    label: t('Website')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Link, {
    href: `https://${site.domain}`,
    target: "_blank",
    rel: "noreferrer",
    sx: {
      display: 'inline-flex',
      color: 'text.primary'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.LinkIcon, {
    size: 14
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.primary',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
  }, site.domain));
};
const NetworkDetails = ({
  network
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    network: activeNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__.useNetworkContext)();
  const showDifferentNetworkWarning = activeNetwork?.chainId !== network.chainId;
  return /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_5__.TxDetailsRow, {
    label: t('Network')
  }, showDifferentNetworkWarning && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tooltip, {
    placement: "bottom",
    title: t('Current network is different from this network')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.AlertTriangleIcon, {
    sx: {
      color: 'warning.main',
      cursor: 'pointer'
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.primary'
    }
  }, network.chainName));
};

/***/ }),

/***/ "./src/utils/actions/getUpdatedActionData.ts":
/*!***************************************************!*\
  !*** ./src/utils/actions/getUpdatedActionData.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUpdatedSigningData": () => (/* binding */ getUpdatedSigningData)
/* harmony export */ });
const getUpdatedSigningData = (oldSigningData, newSigningData) => {
  if (!oldSigningData) {
    return newSigningData;
  } else if (!newSigningData) {
    return oldSigningData;
  }
  return {
    ...oldSigningData,
    ...newSigningData
  };
};

/***/ }),

/***/ "./src/utils/useWindowGetsClosedOrHidden.ts":
/*!**************************************************!*\
  !*** ./src/utils/useWindowGetsClosedOrHidden.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useWindowGetsClosedOrHidden": () => (/* binding */ useWindowGetsClosedOrHidden)
/* harmony export */ });
/* harmony import */ var _src_hooks_useIsSpecificContextContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useIsSpecificContextContainer */ "./src/hooks/useIsSpecificContextContainer.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/merge.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/fromEventPattern.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/operators/filter.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/operators/first.js");



function useWindowGetsClosedOrHidden(cancelHandler) {
  const isConfirmPopup = (0,_src_hooks_useIsSpecificContextContainer__WEBPACK_IMPORTED_MODULE_0__.useIsSpecificContextContainer)(_src_hooks_useIsSpecificContextContainer__WEBPACK_IMPORTED_MODULE_0__.ContextContainer.CONFIRM);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const subscription = (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.fromEventPattern)(handler => {
      window.addEventListener('unload', handler);
    }, handler => {
      window.removeEventListener('unload', handler);
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.fromEventPattern)(handler => {
      window.addEventListener('visibilitychange', handler);
    }, handler => {
      window.removeEventListener('visibilitychange', handler);
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.filter)(() => {
      return document.visibilityState === 'hidden';
    }))).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.first)()).subscribe(() => {
      // Only close for popup windows. The extension UI should not react this way.
      if (isConfirmPopup) {
        cancelHandler();
      }
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, [cancelHandler, isConfirmPopup]);
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX2FwcHJvdmFsX0FwcHJvdmFsU2VjdGlvbl90c3gtc3JjX2hvb2tzX3VzZUFwcHJvdmVBY3Rpb25fdHMtc3JjX2hvb2tzX3VzLWE1NTZkYy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRcUM7QUFDWDtBQVFuQixNQUFNTyxxQkFBMkQsR0FBR0EsQ0FBQztFQUMxRUMsS0FBSztFQUNMQyxPQUFPO0VBQ1BDLFdBQVcsZ0JBQUdKLGdEQUFBLENBQUNMLHVFQUFjLE9BQUc7RUFDaENXO0FBQ0YsQ0FBQyxrQkFDQ04sZ0RBQUEsQ0FBQ0osOERBQUs7RUFDSlcsRUFBRSxFQUFFO0lBQ0ZDLEtBQUssRUFBRSxNQUFNO0lBQ2JDLGFBQWEsRUFBRSxLQUFLO0lBQ3BCQyxjQUFjLEVBQUUsZUFBZTtJQUMvQkMsVUFBVSxFQUFFO0VBQ2Q7QUFBRSxnQkFFRlgsZ0RBQUEsQ0FBQ0osOERBQUs7RUFBQ1csRUFBRSxFQUFFO0lBQUVFLGFBQWEsRUFBRSxLQUFLO0lBQUVFLFVBQVUsRUFBRTtFQUFTO0FBQUUsZ0JBQ3hEWCxnREFBQSxDQUFDRixtRUFBVTtFQUFDYyxTQUFTLEVBQUMsSUFBSTtFQUFDTCxFQUFFLEVBQUU7SUFBRU0sVUFBVSxFQUFFO0VBQUk7QUFBRSxHQUNoRFgsS0FBSyxDQUNLLEVBQ1pDLE9BQU8saUJBQ05ILGdEQUFBLENBQUNILGdFQUFPO0VBQUNVLEVBQUUsRUFBRTtJQUFFTyxNQUFNLEVBQUUsU0FBUztJQUFFQyxFQUFFLEVBQUU7RUFBRSxDQUFFO0VBQUNDLEtBQUssRUFBRWI7QUFBUSxHQUN2REMsV0FBVyxDQUVmLENBQ0ssZUFDUkosZ0RBQUEsQ0FBQ04sNERBQUcsUUFBRVksUUFBUSxDQUFPLENBRXhCO0FBRU0sTUFBTVcsbUJBQW1CLEdBQUdBLENBQUM7RUFBRVYsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUFFLEdBQUdXO0FBQWlCLENBQUMsS0FBSztFQUN2RSxNQUFNQyxLQUFLLEdBQUdwQix1RUFBUSxFQUFFO0VBRXhCLG9CQUNFQyxnREFBQSxDQUFDSiw4REFBSyxFQUFBd0IsMEVBQUE7SUFDSmIsRUFBRSxFQUFFO01BQ0ZDLEtBQUssRUFBRSxNQUFNO01BQ2JhLGVBQWUsRUFBRSxrQkFBa0I7TUFDbkNDLFlBQVksRUFBRSxDQUFDO01BQ2ZDLENBQUMsRUFBRSxDQUFDO01BQ0pDLEdBQUcsRUFBRSxDQUFDO01BQ04sSUFBSSxPQUFPakIsRUFBRSxLQUFLLFVBQVUsR0FBR0EsRUFBRSxDQUFDWSxLQUFLLENBQUMsR0FBR1osRUFBRTtJQUMvQztFQUFFLEdBQ0VXLElBQUksRUFDUjtBQUVOLENBQUM7QUFFTSxNQUFNTyxlQUFlLEdBQUdBLENBQUM7RUFBRWxCLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFBRSxHQUFHVztBQUFpQixDQUFDLEtBQUs7RUFDbkUsTUFBTUMsS0FBSyxHQUFHcEIsdUVBQVEsRUFBRTtFQUV4QixvQkFDRUMsZ0RBQUEsQ0FBQ0osOERBQUssRUFBQXdCLDBFQUFBO0lBQ0piLEVBQUUsRUFBRTtNQUNGQyxLQUFLLEVBQUUsTUFBTTtNQUNiZ0IsR0FBRyxFQUFFLEdBQUc7TUFDUixJQUFJLE9BQU9qQixFQUFFLEtBQUssVUFBVSxHQUFHQSxFQUFFLENBQUNZLEtBQUssQ0FBQyxHQUFHWixFQUFFO0lBQy9DO0VBQUUsR0FDRVcsSUFBSSxFQUNSO0FBRU4sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1RXlFO0FBQ2hEO0FBSW5CLE1BQU1RLFlBQXlDLEdBQUdBLENBQUM7RUFDeERwQixRQUFRO0VBQ1JKO0FBQ0YsQ0FBQyxLQUFLO0VBQ0osTUFBTWlCLEtBQUssR0FBR3BCLHVFQUFRLEVBQUU7RUFFeEIsb0JBQ0VDLGdEQUFBLENBQUNKLDhEQUFLO0lBQ0pXLEVBQUUsRUFBRTtNQUNGRSxhQUFhLEVBQUUsS0FBSztNQUNwQkMsY0FBYyxFQUFFLGVBQWU7TUFDL0JDLFVBQVUsRUFBRSxVQUFVO01BQ3RCYSxHQUFHLEVBQUU7SUFDUDtFQUFFLEdBRUQsT0FBT3RCLEtBQUssS0FBSyxRQUFRLGdCQUN4QkYsZ0RBQUEsQ0FBQ0YsbUVBQVU7SUFBQzZCLE9BQU8sRUFBQyxTQUFTO0lBQUNDLEtBQUssRUFBQztFQUFnQixHQUNqRDFCLEtBQUssQ0FDSyxHQUViQSxLQUNELGVBQ0RGLGdEQUFBLENBQUNKLDhEQUFLO0lBQ0pXLEVBQUUsRUFBRTtNQUNGRSxhQUFhLEVBQUUsS0FBSztNQUNwQkUsVUFBVSxFQUFFLFFBQVE7TUFDcEJhLEdBQUcsRUFBRSxDQUFDO01BQ05LLFNBQVMsRUFBRVYsS0FBSyxDQUFDVyxPQUFPLENBQUMsQ0FBQyxDQUFDO01BQzNCQyxRQUFRLEVBQUUsS0FBSztNQUNmQyxRQUFRLEVBQUU7SUFDWjtFQUFFLEdBRUQxQixRQUFRLENBQ0gsQ0FDRjtBQUVaLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6Q3lGO0FBUXpDO0FBQ3NCO0FBQ0M7QUFDYTtBQUM1QjtBQUloQjtBQUM2QjtBQUNVO0FBNEJ6RSxTQUFTdUMsZ0JBQWdCQSxDQUM5QkMsUUFBZ0IsRUFDaEJDLGVBQXdCLEdBQUcsS0FBSyxFQUM2QjtFQUM3RCxNQUFNO0lBQUVDO0VBQVEsQ0FBQyxHQUFHWixzRkFBb0IsRUFBRTtFQUMxQyxNQUFNYSxjQUFjLEdBQUdQLDZGQUE2QixDQUNsREQsb0ZBQXdCLENBQ3pCO0VBQ0QsTUFBTTtJQUFFVTtFQUFTLENBQUMsR0FBR1Isb0ZBQW1CLEVBQUU7RUFDMUMsTUFBTSxDQUFDUyxNQUFNLEVBQUVDLFNBQVMsQ0FBQyxHQUFHYiwrQ0FBUSxFQUFzQztFQUMxRSxNQUFNLENBQUNjLEtBQUssRUFBRUMsUUFBUSxDQUFDLEdBQUdmLCtDQUFRLENBQVMsRUFBRSxDQUFDO0VBRTlDLE1BQU1nQixZQUErRCxHQUNuRWxCLGtEQUFXLENBQ1QsT0FBT21CLE1BQU0sRUFBRUMscUJBQXFCLEtBQUs7SUFDdkM7SUFDQTtJQUNBTCxTQUFTLENBQUVNLGNBQWMsSUFBSztNQUM1QixJQUFJLENBQUNBLGNBQWMsRUFBRTtRQUNuQjtNQUNGOztNQUVBO01BQ0EsSUFBSXpCLDhGQUFxQixDQUFDeUIsY0FBYyxDQUFDLEVBQUU7UUFDekMsT0FBTztVQUNMLEdBQUdBLGNBQWM7VUFDakJDLE1BQU0sRUFBRUgsTUFBTSxDQUFDRztRQUNqQixDQUFDO01BQ0g7TUFFQSxPQUFPO1FBQ0wsR0FBR0QsY0FBYztRQUNqQkMsTUFBTSxFQUFFSCxNQUFNLENBQUNHLE1BQU07UUFDckJDLFdBQVcsRUFBRTtVQUNYLEdBQUdGLGNBQWMsQ0FBQ0UsV0FBVztVQUM3QixHQUFHSixNQUFNLENBQUNJO1FBQ1osQ0FBQztRQUNEQyxXQUFXLEVBQUVsQiw4RkFBcUIsQ0FDaENlLGNBQWMsQ0FBQ0csV0FBVyxFQUMxQkwsTUFBTSxDQUFDSyxXQUFXO01BRXRCLENBQUM7SUFDSCxDQUFDLENBQUM7SUFFRixNQUFNQyxzQkFBc0IsR0FDMUJkLGNBQWMsSUFBSVEsTUFBTSxDQUFDRyxNQUFNLEtBQUt6Qix5RkFBb0I7SUFFMUQsT0FBT2EsT0FBTyxDQUFzQjtNQUNsQ2lCLE1BQU0sRUFBRWhDLGtIQUE4QjtNQUN0Q3dCLE1BQU0sRUFBRSxDQUFDQSxNQUFNLEVBQUVDLHFCQUFxQjtJQUN4QyxDQUFDLENBQUMsQ0FBQ1MsT0FBTyxDQUFDLE1BQU07TUFDZixJQUFJSixzQkFBc0IsRUFBRTtRQUMxQkssVUFBVSxDQUFDQyxLQUFLLEVBQUU7TUFDcEI7SUFDRixDQUFDLENBQUM7RUFDSixDQUFDLEVBQ0QsQ0FBQ3JCLE9BQU8sRUFBRUMsY0FBYyxDQUFDLENBQzFCO0VBRUgsTUFBTXFCLGFBQWEsR0FBR2hDLGtEQUFXLENBQy9CLFlBQ0VrQixZQUFZLENBQUM7SUFDWEksTUFBTSxFQUFFekIscUdBQWdDO0lBQ3hDcUMsRUFBRSxFQUFFMUI7RUFDTixDQUFDLENBQUMsRUFDSixDQUFDQSxRQUFRLEVBQUVVLFlBQVksQ0FBQyxDQUN6QjtFQUVEakIsZ0RBQVMsQ0FBQyxNQUFNO0lBQ2QsSUFBSVUsY0FBYyxFQUFFO01BQ2xCRCxPQUFPLENBQW1CO1FBQ3hCaUIsTUFBTSxFQUFFaEMsK0dBQTJCO1FBQ25Dd0IsTUFBTSxFQUFFLENBQUNYLFFBQVE7TUFDbkIsQ0FBQyxDQUFDLENBQUM0QixJQUFJLENBQUVDLENBQUMsSUFBSztRQUNiLElBQUk1QixlQUFlLElBQUksQ0FBQ2IsOEZBQXFCLENBQUN5QyxDQUFDLENBQUMsRUFBRTtVQUNoRHBCLFFBQVEsQ0FBQyxrQ0FBa0MsQ0FBQztRQUM5QyxDQUFDLE1BQU0sSUFBSSxDQUFDUixlQUFlLElBQUliLDhGQUFxQixDQUFDeUMsQ0FBQyxDQUFDLEVBQUU7VUFDdkRwQixRQUFRLENBQUMsbUNBQW1DLENBQUM7UUFDL0MsQ0FBQyxNQUFNO1VBQ0xGLFNBQVMsQ0FBQ3NCLENBQUMsQ0FBdUM7UUFDcEQ7TUFDRixDQUFDLENBQUM7SUFDSixDQUFDLE1BQU0sSUFBSXhCLFFBQVEsRUFBRUMsTUFBTSxDQUFDTixRQUFRLEtBQUtBLFFBQVEsRUFBRTtNQUNqRE8sU0FBUyxDQUFDRixRQUFRLENBQUNDLE1BQU0sQ0FBdUM7SUFDbEU7RUFDRixDQUFDLEVBQUUsQ0FBQ04sUUFBUSxFQUFFRSxPQUFPLEVBQUVHLFFBQVEsRUFBRUYsY0FBYyxFQUFFRixlQUFlLENBQUMsQ0FBQztFQUVsRVYsbUdBQTJCLENBQUNpQyxhQUFhLENBQUM7RUFFMUMsT0FBTztJQUFFbEIsTUFBTTtJQUFFSSxZQUFZO0lBQUVGLEtBQUs7SUFBRWdCO0VBQWMsQ0FBQztBQUN2RDs7Ozs7Ozs7Ozs7Ozs7OztBQ3hJZ0M7QUFDZTs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTUSxlQUFlQSxDQUFBLEVBQUc7RUFDaEMsTUFBTUMsUUFBUSxHQUFHRiw2REFBVyxFQUFFO0VBRTlCLE9BQU9ELDhDQUFPLENBQUMsTUFBTTtJQUNuQixNQUFNSSxZQUFZLEdBQUcsSUFBSUMsZUFBZSxDQUFDRixRQUFRLENBQUNHLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDL0QsT0FBT0YsWUFBWSxDQUFDRyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtFQUMzQyxDQUFDLEVBQUUsQ0FBQ0osUUFBUSxDQUFDRyxNQUFNLENBQUMsQ0FBQztBQUN2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUcUM7QUFFVTtBQUNjO0FBQ2U7QUFDUjtBQUNiO0FBRVc7QUFDVTtBQU1yRSxNQUFNYSxlQUFlLEdBQUdBLENBQUM7RUFDOUJDLGVBQWU7RUFDZkM7QUFDb0IsQ0FBQyxLQUFLO0VBQzFCLE1BQU07SUFBRUM7RUFBRSxDQUFDLEdBQUdULDZEQUFjLEVBQUU7RUFFOUIsb0JBQ0V6RixLQUFBLENBQUFLLGFBQUEsQ0FBQ3FCLHNGQUFZO0lBQUN4QixLQUFLLEVBQUVnRyxDQUFDLENBQUMsVUFBVTtFQUFFLGdCQUNqQ2xHLEtBQUEsQ0FBQUssYUFBQSxDQUFDK0UsK0RBQU07SUFDTDdFLEVBQUUsRUFBRTtNQUNGZ0IsQ0FBQyxFQUFFLENBQUM7TUFDSlEsUUFBUSxFQUFFLE1BQU07TUFDaEJvRSxPQUFPLEVBQUU7SUFDWCxDQUFFO0lBQ0Z4RSxPQUFPLEVBQUMsTUFBTTtJQUNkQyxLQUFLLEVBQUMsU0FBUztJQUNmd0UsT0FBTyxFQUFFQSxDQUFBLEtBQ1BILE9BQU8sSUFDUEoscUVBQVUsQ0FBQztNQUNUUSxHQUFHLEVBQUVWLDBGQUEyQixDQUM5Qk0sT0FBTyxFQUNQRCxlQUFlLEVBQ2YsU0FBUztJQUViLENBQUM7RUFDRixnQkFFRGhHLEtBQUEsQ0FBQUssYUFBQSxDQUFDa0YseUVBQWdCO0lBQUNlLElBQUksRUFBRTtFQUFHLEVBQUcsQ0FDdkIsZUFDVHRHLEtBQUEsQ0FBQUssYUFBQSxDQUFDUixnRUFBTztJQUFDMEcsU0FBUyxFQUFDLEtBQUs7SUFBQ3ZGLEtBQUssRUFBRWdGO0VBQWdCLGdCQUM5Q2hHLEtBQUEsQ0FBQUssYUFBQSxDQUFDUCxtRUFBVTtJQUFDNkIsT0FBTyxFQUFDO0VBQVMsR0FDMUIrRCwyRUFBZSxDQUFDTSxlQUFlLENBQUMsQ0FDdEIsQ0FDTCxDQUNHO0FBRW5CLENBQUM7QUFNTSxNQUFNUSxjQUFjLEdBQUdBLENBQUM7RUFBRUMsT0FBTztFQUFFdkc7QUFBMkIsQ0FBQyxLQUFLO0VBQ3pFLE1BQU07SUFBRWdHO0VBQUUsQ0FBQyxHQUFHVCw2REFBYyxFQUFFO0VBQzlCLE1BQU07SUFBRWlCO0VBQVcsQ0FBQyxHQUFHZCxrRkFBa0IsRUFBRTtFQUMzQyxNQUFNZSxPQUFPLEdBQUdELFVBQVUsQ0FBQ0QsT0FBTyxDQUFDO0VBRW5DLG9CQUNFekcsS0FBQSxDQUFBSyxhQUFBLENBQUNxQixzRkFBWTtJQUFDeEIsS0FBSyxFQUFFQSxLQUFLLElBQUlnRyxDQUFDLENBQUMsU0FBUztFQUFFLGdCQUN6Q2xHLEtBQUEsQ0FBQUssYUFBQSxDQUFDUixnRUFBTztJQUFDbUIsS0FBSyxFQUFFeUY7RUFBUSxnQkFDdEJ6RyxLQUFBLENBQUFLLGFBQUEsQ0FBQ1AsbUVBQVU7SUFBQzZCLE9BQU8sRUFBQztFQUFTLEdBQzFCZ0YsT0FBTyxFQUFFQyxJQUFJLElBQUlsQiwyRUFBZSxDQUFDZSxPQUFPLENBQUMsQ0FDL0IsQ0FDTCxDQUNHO0FBRW5CLENBQUM7QUFLTSxNQUFNSSxjQUFjLEdBQUdBLENBQUM7RUFBRUM7QUFBMEIsQ0FBQyxLQUFLO0VBQy9ELE1BQU07SUFBRVo7RUFBRSxDQUFDLEdBQUdULDZEQUFjLEVBQUU7O0VBRTlCO0VBQ0EsSUFBSXFCLElBQUksQ0FBQ0MsTUFBTSxLQUFLaEMsUUFBUSxDQUFDaUMsUUFBUSxFQUFFO0lBQ3JDLE9BQU8sSUFBSTtFQUNiO0VBRUEsb0JBQ0VoSCxLQUFBLENBQUFLLGFBQUEsQ0FBQ3FCLHNGQUFZO0lBQUN4QixLQUFLLEVBQUVnRyxDQUFDLENBQUMsU0FBUztFQUFFLGdCQUNoQ2xHLEtBQUEsQ0FBQUssYUFBQSxDQUFDbUYsNkRBQUk7SUFDSHlCLElBQUksRUFBRyxXQUFVSCxJQUFJLENBQUNDLE1BQU8sRUFBRTtJQUMvQkcsTUFBTSxFQUFDLFFBQVE7SUFDZkMsR0FBRyxFQUFDLFlBQVk7SUFDaEI1RyxFQUFFLEVBQUU7TUFBRTRGLE9BQU8sRUFBRSxhQUFhO01BQUV2RSxLQUFLLEVBQUU7SUFBZTtFQUFFLGdCQUV0RDVCLEtBQUEsQ0FBQUssYUFBQSxDQUFDZ0YsaUVBQVE7SUFBQ2lCLElBQUksRUFBRTtFQUFHLEVBQUcsQ0FDakIsZUFDUHRHLEtBQUEsQ0FBQUssYUFBQSxDQUFDUCxtRUFBVTtJQUNUNkIsT0FBTyxFQUFDLFNBQVM7SUFDakJwQixFQUFFLEVBQUU7TUFDRnFCLEtBQUssRUFBRSxjQUFjO01BQ3JCd0YsWUFBWSxFQUFFLFVBQVU7TUFDeEJDLFFBQVEsRUFBRTtJQUNaO0VBQUUsR0FFRFAsSUFBSSxDQUFDQyxNQUFNLENBQ0QsQ0FDQTtBQUVuQixDQUFDO0FBS00sTUFBTU8sY0FBYyxHQUFHQSxDQUFDO0VBQUVyQjtBQUE2QixDQUFDLEtBQUs7RUFDbEUsTUFBTTtJQUFFQztFQUFFLENBQUMsR0FBR1QsNkRBQWMsRUFBRTtFQUM5QixNQUFNO0lBQUVRLE9BQU8sRUFBRXNCO0VBQWMsQ0FBQyxHQUFHekIsZ0ZBQWlCLEVBQUU7RUFFdEQsTUFBTTBCLDJCQUEyQixHQUMvQkQsYUFBYSxFQUFFRSxPQUFPLEtBQUt4QixPQUFPLENBQUN3QixPQUFPO0VBRTVDLG9CQUNFekgsS0FBQSxDQUFBSyxhQUFBLENBQUNxQixzRkFBWTtJQUFDeEIsS0FBSyxFQUFFZ0csQ0FBQyxDQUFDLFNBQVM7RUFBRSxHQUMvQnNCLDJCQUEyQixpQkFDMUJ4SCxLQUFBLENBQUFLLGFBQUEsQ0FBQ1IsZ0VBQU87SUFDTjBHLFNBQVMsRUFBQyxRQUFRO0lBQ2xCdkYsS0FBSyxFQUFFa0YsQ0FBQyxDQUFDLGdEQUFnRDtFQUFFLGdCQUUzRGxHLEtBQUEsQ0FBQUssYUFBQSxDQUFDaUYsMEVBQWlCO0lBQ2hCL0UsRUFBRSxFQUFFO01BQUVxQixLQUFLLEVBQUUsY0FBYztNQUFFZCxNQUFNLEVBQUU7SUFBVTtFQUFFLEVBQ2pELENBRUwsZUFDRGQsS0FBQSxDQUFBSyxhQUFBLENBQUNQLG1FQUFVO0lBQUM2QixPQUFPLEVBQUMsU0FBUztJQUFDcEIsRUFBRSxFQUFFO01BQUVxQixLQUFLLEVBQUU7SUFBZTtFQUFFLEdBQ3pEcUUsT0FBTyxDQUFDeUIsU0FBUyxDQUNQLENBQ0E7QUFFbkIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUM3SU0sTUFBTTlFLHFCQUFxQixHQUFHQSxDQUNuQytFLGNBQTRCLEVBQzVCQyxjQUE0QixLQUNBO0VBQzVCLElBQUksQ0FBQ0QsY0FBYyxFQUFFO0lBQ25CLE9BQU9DLGNBQWM7RUFDdkIsQ0FBQyxNQUFNLElBQUksQ0FBQ0EsY0FBYyxFQUFFO0lBQzFCLE9BQU9ELGNBQWM7RUFDdkI7RUFFQSxPQUFPO0lBQ0wsR0FBR0EsY0FBYztJQUNqQixHQUFHQztFQUNMLENBQUM7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2JpRDtBQUNoQjtBQUM0QjtBQUV2RCxTQUFTdkYsMkJBQTJCQSxDQUFDaUMsYUFBeUIsRUFBRTtFQUNyRSxNQUFNckIsY0FBYyxHQUFHUCx1R0FBNkIsQ0FDbERELDhGQUF3QixDQUN6QjtFQUVERixnREFBUyxDQUFDLE1BQU07SUFDZCxNQUFNMEYsWUFBWSxHQUFHRCwyQ0FBSyxDQUN4QkQsc0RBQWdCLENBQ2JHLE9BQU8sSUFBSztNQUNYQyxNQUFNLENBQUNDLGdCQUFnQixDQUFDLFFBQVEsRUFBRUYsT0FBTyxDQUFDO0lBQzVDLENBQUMsRUFDQUEsT0FBTyxJQUFLO01BQ1hDLE1BQU0sQ0FBQ0UsbUJBQW1CLENBQUMsUUFBUSxFQUFFSCxPQUFPLENBQUM7SUFDL0MsQ0FBQyxDQUNGLEVBQ0RILHNEQUFnQixDQUNiRyxPQUFPLElBQUs7TUFDWEMsTUFBTSxDQUFDQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRUYsT0FBTyxDQUFDO0lBQ3RELENBQUMsRUFDQUEsT0FBTyxJQUFLO01BQ1hDLE1BQU0sQ0FBQ0UsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUVILE9BQU8sQ0FBQztJQUN6RCxDQUFDLENBQ0YsQ0FBQ0ksSUFBSSxDQUNKVCw0Q0FBTSxDQUFDLE1BQU07TUFDWCxPQUFPVSxRQUFRLENBQUNDLGVBQWUsS0FBSyxRQUFRO0lBQzlDLENBQUMsQ0FBQyxDQUNILENBQ0YsQ0FDRUYsSUFBSSxDQUFDUiwyQ0FBSyxFQUFFLENBQUMsQ0FDYlcsU0FBUyxDQUFDLE1BQU07TUFDZjtNQUNBLElBQUl4RixjQUFjLEVBQUU7UUFDbEJxQixhQUFhLEVBQUU7TUFDakI7SUFDRixDQUFDLENBQUM7SUFFSixPQUFPLE1BQU07TUFDWDJELFlBQVksRUFBRVMsV0FBVyxFQUFFO0lBQzdCLENBQUM7RUFDSCxDQUFDLEVBQUUsQ0FBQ3BFLGFBQWEsRUFBRXJCLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9BcHByb3ZhbFNlY3Rpb24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9BcHByb3ZhbFR4RGV0YWlscy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9hY3Rpb25zL2dldFVwZGF0ZWRBY3Rpb25EYXRhLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEJveCxcbiAgSW5mb0NpcmNsZUljb24sXG4gIFN0YWNrLFxuICBTdGFja1Byb3BzLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbnR5cGUgQXBwcm92YWxTZWN0aW9uSGVhZGVyUHJvcHMgPSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHRvb2x0aXA/OiBzdHJpbmc7XG4gIHRvb2x0aXBJY29uPzogUmVhY3QuUmVhY3RFbGVtZW50O1xufTtcblxuZXhwb3J0IGNvbnN0IEFwcHJvdmFsU2VjdGlvbkhlYWRlcjogUmVhY3QuRkM8QXBwcm92YWxTZWN0aW9uSGVhZGVyUHJvcHM+ID0gKHtcbiAgbGFiZWwsXG4gIHRvb2x0aXAsXG4gIHRvb2x0aXBJY29uID0gPEluZm9DaXJjbGVJY29uIC8+LFxuICBjaGlsZHJlbixcbn0pID0+IChcbiAgPFN0YWNrXG4gICAgc3g9e3tcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICB9fVxuICA+XG4gICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgIDxUeXBvZ3JhcGh5IGNvbXBvbmVudD1cImg2XCIgc3g9e3sgZm9udFdlaWdodDogNjAwIH19PlxuICAgICAgICB7bGFiZWx9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICB7dG9vbHRpcCAmJiAoXG4gICAgICAgIDxUb29sdGlwIHN4PXt7IGN1cnNvcjogJ3BvaW50ZXInLCBtbDogMSB9fSB0aXRsZT17dG9vbHRpcH0+XG4gICAgICAgICAge3Rvb2x0aXBJY29ufVxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gICAgPEJveD57Y2hpbGRyZW59PC9Cb3g+XG4gIDwvU3RhY2s+XG4pO1xuXG5leHBvcnQgY29uc3QgQXBwcm92YWxTZWN0aW9uQm9keSA9ICh7IHN4ID0ge30sIC4uLnJlc3QgfTogU3RhY2tQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2JhY2tncm91bmQucGFwZXInLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgIHA6IDIsXG4gICAgICAgIGdhcDogMSxcbiAgICAgICAgLi4uKHR5cGVvZiBzeCA9PT0gJ2Z1bmN0aW9uJyA/IHN4KHRoZW1lKSA6IHN4KSxcbiAgICAgIH19XG4gICAgICB7Li4ucmVzdH1cbiAgICAvPlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IEFwcHJvdmFsU2VjdGlvbiA9ICh7IHN4ID0ge30sIC4uLnJlc3QgfTogU3RhY2tQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGdhcDogMC41LFxuICAgICAgICAuLi4odHlwZW9mIHN4ID09PSAnZnVuY3Rpb24nID8gc3godGhlbWUpIDogc3gpLFxuICAgICAgfX1cbiAgICAgIHsuLi5yZXN0fVxuICAgIC8+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgU3RhY2ssIFR5cG9ncmFwaHksIHVzZVRoZW1lIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbnR5cGUgVHhEZXRhaWxzUm93UHJvcHMgPSB7IGxhYmVsOiBzdHJpbmcgfCBSZWFjdC5SZWFjdE5vZGUgfTtcblxuZXhwb3J0IGNvbnN0IFR4RGV0YWlsc1JvdzogUmVhY3QuRkM8VHhEZXRhaWxzUm93UHJvcHM+ID0gKHtcbiAgY2hpbGRyZW4sXG4gIGxhYmVsLFxufSkgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnYmFzZWxpbmUnLFxuICAgICAgICBnYXA6IDEsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHt0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnID8gKFxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAgICB7bGFiZWx9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICkgOiAoXG4gICAgICAgIGxhYmVsXG4gICAgICApfVxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgIG1pbkhlaWdodDogdGhlbWUuc3BhY2luZygyKSxcbiAgICAgICAgICBtaW5XaWR0aDogJzBweCcsXG4gICAgICAgICAgd29yZFdyYXA6ICdicmVhay13b3JkJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgR2V0QWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL2hhbmRsZXJzL2dldEFjdGlvbnMnO1xuaW1wb3J0IHsgVXBkYXRlQWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL2hhbmRsZXJzL3VwZGF0ZUFjdGlvbic7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblVwZGF0ZSxcbiAgTXVsdGlUeEFjdGlvbixcbiAgaXNCYXRjaEFwcHJvdmFsQWN0aW9uLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgQWN0aW9uU3RhdHVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IHVzZUNvbm5lY3Rpb25Db250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db25uZWN0aW9uUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuIH0gZnJvbSAnQHNyYy91dGlscy91c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4nO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBDb250ZXh0Q29udGFpbmVyLFxuICB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcixcbn0gZnJvbSAnLi91c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcic7XG5pbXBvcnQgeyB1c2VBcHByb3ZhbHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BcHByb3ZhbHNQcm92aWRlcic7XG5pbXBvcnQgeyBnZXRVcGRhdGVkU2lnbmluZ0RhdGEgfSBmcm9tICdAc3JjL3V0aWxzL2FjdGlvbnMvZ2V0VXBkYXRlZEFjdGlvbkRhdGEnO1xuXG50eXBlIEFjdGlvblR5cGU8SXNCYXRjaEFwcHJvdmFsPiA9IElzQmF0Y2hBcHByb3ZhbCBleHRlbmRzIHRydWVcbiAgPyBNdWx0aVR4QWN0aW9uXG4gIDogQWN0aW9uO1xuXG50eXBlIEFjdGlvblVwZGF0ZXI8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+ID0gKFxuICBwYXJhbXM6IEFjdGlvblVwZGF0ZTxcbiAgICBQYXJ0aWFsPFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uID8gVFsnZGlzcGxheURhdGEnXSA6IG5ldmVyPlxuICA+LFxuICBzaG91bGRXYWl0Rm9yUmVzcG9uc2U/OiBib29sZWFuLFxuKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuXG50eXBlIEhvb2tSZXN1bHQ8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+ID0ge1xuICBhY3Rpb246IFQ7XG4gIHVwZGF0ZUFjdGlvbjogQWN0aW9uVXBkYXRlcjxUPjtcbiAgZXJyb3I6IHN0cmluZztcbiAgY2FuY2VsSGFuZGxlcjogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uPERpc3BsYXlEYXRhID0gYW55PihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsPzogZmFsc2UsXG4pOiBIb29rUmVzdWx0PEFjdGlvbjxEaXNwbGF5RGF0YT4+O1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb24oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbD86IHRydWUsXG4pOiBIb29rUmVzdWx0PE11bHRpVHhBY3Rpb24+O1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb248RGlzcGxheURhdGEgPSBhbnk+KFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw6IGJvb2xlYW4gPSBmYWxzZSxcbik6IEhvb2tSZXN1bHQ8QWN0aW9uPERpc3BsYXlEYXRhPiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBjb25zdCBpc0NvbmZpcm1Qb3B1cCA9IHVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyKFxuICAgIENvbnRleHRDb250YWluZXIuQ09ORklSTSxcbiAgKTtcbiAgY29uc3QgeyBhcHByb3ZhbCB9ID0gdXNlQXBwcm92YWxzQ29udGV4dCgpO1xuICBjb25zdCBbYWN0aW9uLCBzZXRBY3Rpb25dID0gdXNlU3RhdGU8QWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPj4oKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcblxuICBjb25zdCB1cGRhdGVBY3Rpb246IEFjdGlvblVwZGF0ZXI8QWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPj4gPVxuICAgIHVzZUNhbGxiYWNrKFxuICAgICAgYXN5bmMgKHBhcmFtcywgc2hvdWxkV2FpdEZvclJlc3BvbnNlKSA9PiB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gdXBkYXRlIHRoZSBzdGF0dXMgYSBiaXQgZmFzdGVyIGZvciBzbW9vdGhlciBVWC5cbiAgICAgICAgLy8gdXNlIGZ1bmN0aW9uIHRvIGF2b2lkIGBhY3Rpb25gIGFzIGEgZGVwZW5kZW5jeSBhbmQgdGh1cyBpbmZpbml0ZSBsb29wc1xuICAgICAgICBzZXRBY3Rpb24oKHByZXZBY3Rpb25EYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKCFwcmV2QWN0aW9uRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEZvciBNdWx0aVR4QWN0aW9uLCB3ZSBkb24ndCBhbGxvdyBhbnkgdXBkYXRlcyBiZXNpZGVzIHRoZSBzdGF0dXMuXG4gICAgICAgICAgaWYgKGlzQmF0Y2hBcHByb3ZhbEFjdGlvbihwcmV2QWN0aW9uRGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLFxuICAgICAgICAgICAgICBzdGF0dXM6IHBhcmFtcy5zdGF0dXMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YSxcbiAgICAgICAgICAgIHN0YXR1czogcGFyYW1zLnN0YXR1cyxcbiAgICAgICAgICAgIGRpc3BsYXlEYXRhOiB7XG4gICAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLmRpc3BsYXlEYXRhLFxuICAgICAgICAgICAgICAuLi5wYXJhbXMuZGlzcGxheURhdGEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lnbmluZ0RhdGE6IGdldFVwZGF0ZWRTaWduaW5nRGF0YShcbiAgICAgICAgICAgICAgcHJldkFjdGlvbkRhdGEuc2lnbmluZ0RhdGEsXG4gICAgICAgICAgICAgIHBhcmFtcy5zaWduaW5nRGF0YSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSA9XG4gICAgICAgICAgaXNDb25maXJtUG9wdXAgJiYgcGFyYW1zLnN0YXR1cyAhPT0gQWN0aW9uU3RhdHVzLlBFTkRJTkc7XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3Q8VXBkYXRlQWN0aW9uSGFuZGxlcj4oe1xuICAgICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5BQ1RJT05fVVBEQVRFLFxuICAgICAgICAgIHBhcmFtczogW3BhcmFtcywgc2hvdWxkV2FpdEZvclJlc3BvbnNlXSxcbiAgICAgICAgfSkuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHNob3VsZENsb3NlQWZ0ZXJVcGRhdGUpIHtcbiAgICAgICAgICAgIGdsb2JhbFRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIFtyZXF1ZXN0LCBpc0NvbmZpcm1Qb3B1cF0sXG4gICAgKTtcblxuICBjb25zdCBjYW5jZWxIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKCkgPT5cbiAgICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICAgIHN0YXR1czogQWN0aW9uU3RhdHVzLkVSUk9SX1VTRVJfQ0FOQ0VMRUQsXG4gICAgICAgIGlkOiBhY3Rpb25JZCxcbiAgICAgIH0pLFxuICAgIFthY3Rpb25JZCwgdXBkYXRlQWN0aW9uXSxcbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpc0NvbmZpcm1Qb3B1cCkge1xuICAgICAgcmVxdWVzdDxHZXRBY3Rpb25IYW5kbGVyPih7XG4gICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5BQ1RJT05fR0VULFxuICAgICAgICBwYXJhbXM6IFthY3Rpb25JZF0sXG4gICAgICB9KS50aGVuKChhKSA9PiB7XG4gICAgICAgIGlmIChpc0JhdGNoQXBwcm92YWwgJiYgIWlzQmF0Y2hBcHByb3ZhbEFjdGlvbihhKSkge1xuICAgICAgICAgIHNldEVycm9yKCdFeHBlY3RlZCBhIGJhdGNoIGFwcHJvdmFsIGFjdGlvbicpO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0JhdGNoQXBwcm92YWwgJiYgaXNCYXRjaEFwcHJvdmFsQWN0aW9uKGEpKSB7XG4gICAgICAgICAgc2V0RXJyb3IoJ0V4cGVjdGVkIGEgc2luZ2xlIGFwcHJvdmFsIGFjdGlvbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldEFjdGlvbihhIGFzIEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGFwcHJvdmFsPy5hY3Rpb24uYWN0aW9uSWQgPT09IGFjdGlvbklkKSB7XG4gICAgICBzZXRBY3Rpb24oYXBwcm92YWwuYWN0aW9uIGFzIEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4pO1xuICAgIH1cbiAgfSwgW2FjdGlvbklkLCByZXF1ZXN0LCBhcHByb3ZhbCwgaXNDb25maXJtUG9wdXAsIGlzQmF0Y2hBcHByb3ZhbF0pO1xuXG4gIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyKTtcblxuICByZXR1cm4geyBhY3Rpb24sIHVwZGF0ZUFjdGlvbiwgZXJyb3IsIGNhbmNlbEhhbmRsZXIgfTtcbn1cbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG4vKipcbiAqIFRoaXMgaXMgdXNlZCB0byBnZXQgdGhlIGlkIG9mIGEgdHJhbnNhY3Rpb24gb3IgbWVzc2FnZSB0aGF0XG4gKiBoYXMgYmVlbiBwdXQgaW50byBsb2NhbHN0b3JhZ2UgYW5kIHRvIGJlIHVzZWQgYWNyb3NzIG11bHRpcGxlXG4gKiBjb250ZXh0cy4gV2UgZ3JhYiB0aGUgcXVlcnkgcGFyYW0gYW5kIHVzZSB0aGF0IHRvIGdldCB0aGUgaXRlbSBvdXQgb2Ygc3RvcmFnZS5cbiAqXG4gKiBAcmV0dXJucyBpZCBmcm9tIHRoZSBxdWVyeSBwYXJhbVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlR2V0UmVxdWVzdElkKCkge1xuICBjb25zdCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uc2VhcmNoID8/ICcnKTtcbiAgICByZXR1cm4gc2VhcmNoUGFyYW1zLmdldCgnYWN0aW9uSWQnKSA/PyAnJztcbiAgfSwgW2xvY2F0aW9uLnNlYXJjaF0pO1xufVxuIiwiaW1wb3J0IHtcbiAgVHlwb2dyYXBoeSxcbiAgQnV0dG9uLFxuICBMaW5rSWNvbixcbiAgQWxlcnRUcmlhbmdsZUljb24sXG4gIEV4dGVybmFsTGlua0ljb24sXG4gIExpbmssXG4gIFRvb2x0aXAsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAc3JjL3V0aWxzL3RydW5jYXRlQWRkcmVzcyc7XG5pbXBvcnQgeyBnZXRFeHBsb3JlckFkZHJlc3NCeU5ldHdvcmsgfSBmcm9tICdAc3JjL3V0aWxzL2dldEV4cGxvcmVyQWRkcmVzcyc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgb3Blbk5ld1RhYiB9IGZyb20gJ0BzcmMvdXRpbHMvZXh0ZW5zaW9uVXRpbHMnO1xuaW1wb3J0IHsgRG9tYWluTWV0YWRhdGEgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvbW9kZWxzJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgVHhEZXRhaWxzUm93IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9UeERldGFpbHNSb3cnO1xuXG50eXBlIENvbnRyYWN0RGV0YWlsc1Byb3BzID0ge1xuICBjb250cmFjdEFkZHJlc3M6IHN0cmluZztcbiAgbmV0d29yaz86IE5ldHdvcms7XG59O1xuZXhwb3J0IGNvbnN0IENvbnRyYWN0RGV0YWlscyA9ICh7XG4gIGNvbnRyYWN0QWRkcmVzcyxcbiAgbmV0d29yayxcbn06IENvbnRyYWN0RGV0YWlsc1Byb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICByZXR1cm4gKFxuICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0NvbnRyYWN0Jyl9PlxuICAgICAgPEJ1dHRvblxuICAgICAgICBzeD17e1xuICAgICAgICAgIHA6IDAsXG4gICAgICAgICAgbWluV2lkdGg6ICdhdXRvJyxcbiAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICB9fVxuICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgbmV0d29yayAmJlxuICAgICAgICAgIG9wZW5OZXdUYWIoe1xuICAgICAgICAgICAgdXJsOiBnZXRFeHBsb3JlckFkZHJlc3NCeU5ldHdvcmsoXG4gICAgICAgICAgICAgIG5ldHdvcmssXG4gICAgICAgICAgICAgIGNvbnRyYWN0QWRkcmVzcyxcbiAgICAgICAgICAgICAgJ2FkZHJlc3MnLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICA+XG4gICAgICAgIDxFeHRlcm5hbExpbmtJY29uIHNpemU9ezE0fSAvPlxuICAgICAgPC9CdXR0b24+XG4gICAgICA8VG9vbHRpcCBwbGFjZW1lbnQ9XCJ0b3BcIiB0aXRsZT17Y29udHJhY3RBZGRyZXNzfT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICB7dHJ1bmNhdGVBZGRyZXNzKGNvbnRyYWN0QWRkcmVzcyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvVG9vbHRpcD5cbiAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgKTtcbn07XG5cbnR5cGUgQWNjb3VudERldGFpbHNQcm9wcyA9IHtcbiAgYWRkcmVzczogc3RyaW5nO1xuICBsYWJlbD86IHN0cmluZztcbn07XG5leHBvcnQgY29uc3QgQWNjb3VudERldGFpbHMgPSAoeyBhZGRyZXNzLCBsYWJlbCB9OiBBY2NvdW50RGV0YWlsc1Byb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBnZXRBY2NvdW50IH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcbiAgY29uc3QgYWNjb3VudCA9IGdldEFjY291bnQoYWRkcmVzcyk7XG5cbiAgcmV0dXJuIChcbiAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXtsYWJlbCB8fCB0KCdBY2NvdW50Jyl9PlxuICAgICAgPFRvb2x0aXAgdGl0bGU9e2FkZHJlc3N9PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgIHthY2NvdW50Py5uYW1lID8/IHRydW5jYXRlQWRkcmVzcyhhZGRyZXNzKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPC9Ub29sdGlwPlxuICAgIDwvVHhEZXRhaWxzUm93PlxuICApO1xufTtcblxudHlwZSBXZWJzaXRlRGV0YWlsc1Byb3BzID0ge1xuICBzaXRlOiBEb21haW5NZXRhZGF0YTtcbn07XG5leHBvcnQgY29uc3QgV2Vic2l0ZURldGFpbHMgPSAoeyBzaXRlIH06IFdlYnNpdGVEZXRhaWxzUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIC8vIERvIG5vdCBzaG93IGlmIHJlcXVlc3Qgb3JpZ2luYXRlZCBmcm9tIHRoZSBleHRlbnNpb24gaXRzZWxmXG4gIGlmIChzaXRlLmRvbWFpbiA9PT0gbG9jYXRpb24uaG9zdG5hbWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnV2Vic2l0ZScpfT5cbiAgICAgIDxMaW5rXG4gICAgICAgIGhyZWY9e2BodHRwczovLyR7c2l0ZS5kb21haW59YH1cbiAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXG4gICAgICAgIHN4PXt7IGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsIGNvbG9yOiAndGV4dC5wcmltYXJ5JyB9fVxuICAgICAgPlxuICAgICAgICA8TGlua0ljb24gc2l6ZT17MTR9IC8+XG4gICAgICA8L0xpbms+XG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgY29sb3I6ICd0ZXh0LnByaW1hcnknLFxuICAgICAgICAgIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcbiAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtzaXRlLmRvbWFpbn1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgKTtcbn07XG5cbnR5cGUgTmV0d29ya0RldGFpbHNQcm9wcyA9IHtcbiAgbmV0d29yazogTmV0d29yaztcbn07XG5leHBvcnQgY29uc3QgTmV0d29ya0RldGFpbHMgPSAoeyBuZXR3b3JrIH06IE5ldHdvcmtEZXRhaWxzUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IG5ldHdvcms6IGFjdGl2ZU5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG5cbiAgY29uc3Qgc2hvd0RpZmZlcmVudE5ldHdvcmtXYXJuaW5nID1cbiAgICBhY3RpdmVOZXR3b3JrPy5jaGFpbklkICE9PSBuZXR3b3JrLmNoYWluSWQ7XG5cbiAgcmV0dXJuIChcbiAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdOZXR3b3JrJyl9PlxuICAgICAge3Nob3dEaWZmZXJlbnROZXR3b3JrV2FybmluZyAmJiAoXG4gICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgcGxhY2VtZW50PVwiYm90dG9tXCJcbiAgICAgICAgICB0aXRsZT17dCgnQ3VycmVudCBuZXR3b3JrIGlzIGRpZmZlcmVudCBmcm9tIHRoaXMgbmV0d29yaycpfVxuICAgICAgICA+XG4gICAgICAgICAgPEFsZXJ0VHJpYW5nbGVJY29uXG4gICAgICAgICAgICBzeD17eyBjb2xvcjogJ3dhcm5pbmcubWFpbicsIGN1cnNvcjogJ3BvaW50ZXInIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgKX1cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgY29sb3I6ICd0ZXh0LnByaW1hcnknIH19PlxuICAgICAgICB7bmV0d29yay5jaGFpbk5hbWV9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgPC9UeERldGFpbHNSb3c+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgU2lnbmluZ0RhdGEgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhID0gKFxuICBvbGRTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuICBuZXdTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuKTogU2lnbmluZ0RhdGEgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoIW9sZFNpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG5ld1NpZ25pbmdEYXRhO1xuICB9IGVsc2UgaWYgKCFuZXdTaWduaW5nRGF0YSkge1xuICAgIHJldHVybiBvbGRTaWduaW5nRGF0YTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub2xkU2lnbmluZ0RhdGEsXG4gICAgLi4ubmV3U2lnbmluZ0RhdGEsXG4gIH07XG59O1xuIiwiaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgZnJvbUV2ZW50UGF0dGVybiwgbWVyZ2UgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICAgZnJvbUV2ZW50UGF0dGVybihcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLnBpcGUoXG4gICAgICAgIGZpbHRlcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbic7XG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIE9ubHkgY2xvc2UgZm9yIHBvcHVwIHdpbmRvd3MuIFRoZSBleHRlbnNpb24gVUkgc2hvdWxkIG5vdCByZWFjdCB0aGlzIHdheS5cbiAgICAgICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW2NhbmNlbEhhbmRsZXIsIGlzQ29uZmlybVBvcHVwXSk7XG59XG4iXSwibmFtZXMiOlsiQm94IiwiSW5mb0NpcmNsZUljb24iLCJTdGFjayIsIlRvb2x0aXAiLCJUeXBvZ3JhcGh5IiwidXNlVGhlbWUiLCJSZWFjdCIsIkFwcHJvdmFsU2VjdGlvbkhlYWRlciIsImxhYmVsIiwidG9vbHRpcCIsInRvb2x0aXBJY29uIiwiY3JlYXRlRWxlbWVudCIsImNoaWxkcmVuIiwic3giLCJ3aWR0aCIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJjb21wb25lbnQiLCJmb250V2VpZ2h0IiwiY3Vyc29yIiwibWwiLCJ0aXRsZSIsIkFwcHJvdmFsU2VjdGlvbkJvZHkiLCJyZXN0IiwidGhlbWUiLCJfZXh0ZW5kcyIsImJhY2tncm91bmRDb2xvciIsImJvcmRlclJhZGl1cyIsInAiLCJnYXAiLCJBcHByb3ZhbFNlY3Rpb24iLCJUeERldGFpbHNSb3ciLCJ2YXJpYW50IiwiY29sb3IiLCJtaW5IZWlnaHQiLCJzcGFjaW5nIiwibWluV2lkdGgiLCJ3b3JkV3JhcCIsIkV4dGVuc2lvblJlcXVlc3QiLCJpc0JhdGNoQXBwcm92YWxBY3Rpb24iLCJBY3Rpb25TdGF0dXMiLCJ1c2VDb25uZWN0aW9uQ29udGV4dCIsInVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbiIsInVzZUNhbGxiYWNrIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJDb250ZXh0Q29udGFpbmVyIiwidXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIiLCJ1c2VBcHByb3ZhbHNDb250ZXh0IiwiZ2V0VXBkYXRlZFNpZ25pbmdEYXRhIiwidXNlQXBwcm92ZUFjdGlvbiIsImFjdGlvbklkIiwiaXNCYXRjaEFwcHJvdmFsIiwicmVxdWVzdCIsImlzQ29uZmlybVBvcHVwIiwiQ09ORklSTSIsImFwcHJvdmFsIiwiYWN0aW9uIiwic2V0QWN0aW9uIiwiZXJyb3IiLCJzZXRFcnJvciIsInVwZGF0ZUFjdGlvbiIsInBhcmFtcyIsInNob3VsZFdhaXRGb3JSZXNwb25zZSIsInByZXZBY3Rpb25EYXRhIiwic3RhdHVzIiwiZGlzcGxheURhdGEiLCJzaWduaW5nRGF0YSIsInNob3VsZENsb3NlQWZ0ZXJVcGRhdGUiLCJQRU5ESU5HIiwibWV0aG9kIiwiQUNUSU9OX1VQREFURSIsImZpbmFsbHkiLCJnbG9iYWxUaGlzIiwiY2xvc2UiLCJjYW5jZWxIYW5kbGVyIiwiRVJST1JfVVNFUl9DQU5DRUxFRCIsImlkIiwiQUNUSU9OX0dFVCIsInRoZW4iLCJhIiwidXNlTWVtbyIsInVzZUxvY2F0aW9uIiwidXNlR2V0UmVxdWVzdElkIiwibG9jYXRpb24iLCJzZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJzZWFyY2giLCJnZXQiLCJCdXR0b24iLCJMaW5rSWNvbiIsIkFsZXJ0VHJpYW5nbGVJY29uIiwiRXh0ZXJuYWxMaW5rSWNvbiIsIkxpbmsiLCJ1c2VUcmFuc2xhdGlvbiIsInRydW5jYXRlQWRkcmVzcyIsImdldEV4cGxvcmVyQWRkcmVzc0J5TmV0d29yayIsInVzZUFjY291bnRzQ29udGV4dCIsIm9wZW5OZXdUYWIiLCJ1c2VOZXR3b3JrQ29udGV4dCIsIkNvbnRyYWN0RGV0YWlscyIsImNvbnRyYWN0QWRkcmVzcyIsIm5ldHdvcmsiLCJ0IiwiZGlzcGxheSIsIm9uQ2xpY2siLCJ1cmwiLCJzaXplIiwicGxhY2VtZW50IiwiQWNjb3VudERldGFpbHMiLCJhZGRyZXNzIiwiZ2V0QWNjb3VudCIsImFjY291bnQiLCJuYW1lIiwiV2Vic2l0ZURldGFpbHMiLCJzaXRlIiwiZG9tYWluIiwiaG9zdG5hbWUiLCJocmVmIiwidGFyZ2V0IiwicmVsIiwidGV4dE92ZXJmbG93Iiwib3ZlcmZsb3ciLCJOZXR3b3JrRGV0YWlscyIsImFjdGl2ZU5ldHdvcmsiLCJzaG93RGlmZmVyZW50TmV0d29ya1dhcm5pbmciLCJjaGFpbklkIiwiY2hhaW5OYW1lIiwib2xkU2lnbmluZ0RhdGEiLCJuZXdTaWduaW5nRGF0YSIsImZpbHRlciIsImZpcnN0IiwiZnJvbUV2ZW50UGF0dGVybiIsIm1lcmdlIiwic3Vic2NyaXB0aW9uIiwiaGFuZGxlciIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicGlwZSIsImRvY3VtZW50IiwidmlzaWJpbGl0eVN0YXRlIiwic3Vic2NyaWJlIiwidW5zdWJzY3JpYmUiXSwic291cmNlUm9vdCI6IiJ9