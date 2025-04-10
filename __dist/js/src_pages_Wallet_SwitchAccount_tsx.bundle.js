"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Wallet_SwitchAccount_tsx"],{

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

/***/ "./src/pages/Wallet/SwitchAccount.tsx":
/*!********************************************!*\
  !*** ./src/pages/Wallet/SwitchAccount.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SwitchAccount": () => (/* binding */ SwitchAccount)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function SwitchAccount() {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_2__.useGetRequestId)();
  const {
    action,
    updateAction: updateMessage,
    cancelHandler
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_0__.useApproveAction)(requestId);
  if (!action) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
      sx: {
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.CircularProgress, {
      size: 60
    }));
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      width: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 2,
      maxWidth: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Avatar, {
    sx: {
      width: 80,
      height: 80,
      backgroundColor: theme.palette.grey[850]
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.WalletIcon, {
    size: 48
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "h4"
  }, t('Switch to {{name}}?', {
    name: action.displayData.selectedAccount?.name
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'center',
      maxWidth: 1,
      wordWrap: 'break-word',
      color: 'text.secondary'
    }
  }, t('{{domain}} is requesting to switch your active account.', {
    domain: action.site?.domain || 'This website'
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      gap: 1,
      py: 1,
      pl: 2,
      pr: 1,
      alignItems: 'center',
      background: theme.palette.grey[850],
      borderRadius: 1,
      height: 48,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 1,
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {
    title: action.displayData.selectedAccount?.name,
    wrapWithSpan: false
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "body1",
    sx: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, action.displayData.selectedAccount?.name)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      alignItems: 'center',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {
    title: action.displayData.selectedAccount?.addressC
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "body2"
  }, (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_3__.truncateAddress)(action.displayData.selectedAccount?.addressC))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
    onClick: () => {
      navigator.clipboard.writeText(action.displayData.selectedAccount.addressC);
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__["default"].success(t('Copied!'), {
        duration: 2000
      });
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.CopyIcon, {
    size: 16
  })))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      width: 1,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    color: "secondary",
    size: "large",
    "data-testid": "switch-account-reject-btn",
    onClick: () => {
      cancelHandler();
      window.close();
    },
    fullWidth: true
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    "data-testid": "switch-account-approve-btn",
    size: "large",
    color: "primary",
    onClick: () => {
      updateMessage({
        status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
        id: requestId
      });
    },
    fullWidth: true
  }, t('Approve')))));
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1dhbGxldF9Td2l0Y2hBY2NvdW50X3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQTBGO0FBUXpDO0FBQ3NCO0FBQ0M7QUFDYTtBQUM1QjtBQUloQjtBQUM2QjtBQUNVO0FBNEJ6RSxTQUFTWSxnQkFBZ0JBLENBQzlCQyxRQUFnQixFQUNoQkMsZUFBd0IsR0FBRyxLQUFLLEVBQzZCO0VBQzdELE1BQU07SUFBRUM7RUFBUSxDQUFDLEdBQUdaLHNGQUFvQixFQUFFO0VBQzFDLE1BQU1hLGNBQWMsR0FBR1AsNkZBQTZCLENBQ2xERCxvRkFBd0IsQ0FDekI7RUFDRCxNQUFNO0lBQUVVO0VBQVMsQ0FBQyxHQUFHUixvRkFBbUIsRUFBRTtFQUMxQyxNQUFNLENBQUNTLE1BQU0sRUFBRUMsU0FBUyxDQUFDLEdBQUdiLCtDQUFRLEVBQXNDO0VBQzFFLE1BQU0sQ0FBQ2MsS0FBSyxFQUFFQyxRQUFRLENBQUMsR0FBR2YsK0NBQVEsQ0FBUyxFQUFFLENBQUM7RUFFOUMsTUFBTWdCLFlBQStELEdBQ25FbEIsa0RBQVcsQ0FDVCxPQUFPbUIsTUFBTSxFQUFFQyxxQkFBcUIsS0FBSztJQUN2QztJQUNBO0lBQ0FMLFNBQVMsQ0FBRU0sY0FBYyxJQUFLO01BQzVCLElBQUksQ0FBQ0EsY0FBYyxFQUFFO1FBQ25CO01BQ0Y7O01BRUE7TUFDQSxJQUFJekIsOEZBQXFCLENBQUN5QixjQUFjLENBQUMsRUFBRTtRQUN6QyxPQUFPO1VBQ0wsR0FBR0EsY0FBYztVQUNqQkMsTUFBTSxFQUFFSCxNQUFNLENBQUNHO1FBQ2pCLENBQUM7TUFDSDtNQUVBLE9BQU87UUFDTCxHQUFHRCxjQUFjO1FBQ2pCQyxNQUFNLEVBQUVILE1BQU0sQ0FBQ0csTUFBTTtRQUNyQkMsV0FBVyxFQUFFO1VBQ1gsR0FBR0YsY0FBYyxDQUFDRSxXQUFXO1VBQzdCLEdBQUdKLE1BQU0sQ0FBQ0k7UUFDWixDQUFDO1FBQ0RDLFdBQVcsRUFBRWxCLDhGQUFxQixD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QUNILENBQUMsRUFBRSxDQUFDM0YsYUFBYSxFQUFFckIsY0FBYyxDQUFDLENBQUM7QUFDckMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvU3dpdGNoQWNjb3VudC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9hY3Rpb25zL2dldFVwZGF0ZWRBY3Rpb25EYXRhLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgR2V0QWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL2hhbmRsZXJzL2dldEFjdGlvbnMnO1xuaW1wb3J0IHsgVXBkYXRlQWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL2hhbmRsZXJzL3VwZGF0ZUFjdGlvbic7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblVwZGF0ZSxcbiAgTXVsdGlUeEFjdGlvbixcbiAgaXNCYXRjaEFwcHJvdmFsQWN0aW9uLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgQWN0aW9uU3RhdHVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IHVzZUNvbm5lY3Rpb25Db250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db25uZWN0aW9uUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuIH0gZnJvbSAnQHNyYy91dGlscy91c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4nO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBDb250ZXh0Q29udGFpbmVyLFxuICB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcixcbn0gZnJvbSAnLi91c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcic7XG5pbXBvcnQgeyB1c2VBcHByb3ZhbHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BcHByb3ZhbHNQcm92aWRlcic7XG5pbXBvcnQgeyBnZXRVcGRhdGVkU2lnbmluZ0RhdGEgfSBmcm9tICdAc3JjL3V0aWxzL2FjdGlvbnMvZ2V0VXBkYXRlZEFjdGlvbkRhdGEnO1xuXG50eXBlIEFjdGlvblR5cGU8SXNCYXRjaEFwcHJvdmFsPiA9IElzQmF0Y2hBcHByb3ZhbCBleHRlbmRzIHRydWVcbiAgPyBNdWx0aVR4QWN0aW9uXG4gIDogQWN0aW9uO1xuXG50eXBlIEFjdGlvblVwZGF0ZXI8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+ID0gKFxuICBwYXJhbXM6IEFjdGlvblVwZGF0ZTxcbiAgICBQYXJ0aWFsPFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uID8gVFsnZGlzcGxheURhdGEnXSA6IG5ldmVyPlxuICA+LFxuICBzaG91bGRXYWl0Rm9yUmVzcG9uc2U/OiBib29sZWFuLFxuKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuXG50eXBlIEhvb2tSZXN1bHQ8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+ID0ge1xuICBhY3Rpb246IFQ7XG4gIHVwZGF0ZUFjdGlvbjogQWN0aW9uVXBkYXRlcjxUPjtcbiAgZXJyb3I6IHN0cmluZztcbiAgY2FuY2VsSGFuZGxlcjogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uPERpc3BsYXlEYXRhID0gYW55PihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsPzogZmFsc2UsXG4pOiBIb29rUmVzdWx0PEFjdGlvbjxEaXNwbGF5RGF0YT4+O1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb24oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbD86IHRydWUsXG4pOiBIb29rUmVzdWx0PE11bHRpVHhBY3Rpb24+O1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb248RGlzcGxheURhdGEgPSBhbnk+KFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw6IGJvb2xlYW4gPSBmYWxzZSxcbik6IEhvb2tSZXN1bHQ8QWN0aW9uPERpc3BsYXlEYXRhPiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBjb25zdCBpc0NvbmZpcm1Qb3B1cCA9IHVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyKFxuICAgIENvbnRleHRDb250YWluZXIuQ09ORklSTSxcbiAgKTtcbiAgY29uc3QgeyBhcHByb3ZhbCB9ID0gdXNlQXBwcm92YWxzQ29udGV4dCgpO1xuICBjb25zdCBbYWN0aW9uLCBzZXRBY3Rpb25dID0gdXNlU3RhdGU8QWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPj4oKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcblxuICBjb25zdCB1cGRhdGVBY3Rpb246IEFjdGlvblVwZGF0ZXI8QWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPj4gPVxuICAgIHVzZUNhbGxiYWNrKFxuICAgICAgYXN5bmMgKHBhcmFtcywgc2hvdWxkV2FpdEZvclJlc3BvbnNlKSA9PiB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gdXBkYXRlIHRoZSBzdGF0dXMgYSBiaXQgZmFzdGVyIGZvciBzbW9vdGhlciBVWC5cbiAgICAgICAgLy8gdXNlIGZ1bmN0aW9uIHRvIGF2b2lkIGBhY3Rpb25gIGFzIGEgZGVwZW5kZW5jeSBhbmQgdGh1cyBpbmZpbml0ZSBsb29wc1xuICAgICAgICBzZXRBY3Rpb24oKHByZXZBY3Rpb25EYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKCFwcmV2QWN0aW9uRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEZvciBNdWx0aVR4QWN0aW9uLCB3ZSBkb24ndCBhbGxvdyBhbnkgdXBkYXRlcyBiZXNpZGVzIHRoZSBzdGF0dXMuXG4gICAgICAgICAgaWYgKGlzQmF0Y2hBcHByb3ZhbEFjdGlvbihwcmV2QWN0aW9uRGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLFxuICAgICAgICAgICAgICBzdGF0dXM6IHBhcmFtcy5zdGF0dXMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YSxcbiAgICAgICAgICAgIHN0YXR1czogcGFyYW1zLnN0YXR1cyxcbiAgICAgICAgICAgIGRpc3BsYXlEYXRhOiB7XG4gICAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLmRpc3BsYXlEYXRhLFxuICAgICAgICAgICAgICAuLi5wYXJhbXMuZGlzcGxheURhdGEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lnbmluZ0RhdGE6IGdldFVwZGF0ZWRTaWduaW5nRGF0YShcbiAgICAgICAgICAgICAgcHJldkFjdGlvbkRhdGEuc2lnbmluZ0RhdGEsXG4gICAgICAgICAgICAgIHBhcmFtcy5zaWduaW5nRGF0YSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSA9XG4gICAgICAgICAgaXNDb25maXJtUG9wdXAgJiYgcGFyYW1zLnN0YXR1cyAhPT0gQWN0aW9uU3RhdHVzLlBFTkRJTkc7XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3Q8VXBkYXRlQWN0aW9uSGFuZGxlcj4oe1xuICAgICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5BQ1RJT05fVVBEQVRFLFxuICAgICAgICAgIHBhcmFtczogW3BhcmFtcywgc2hvdWxkV2FpdEZvclJlc3BvbnNlXSxcbiAgICAgICAgfSkuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHNob3VsZENsb3NlQWZ0ZXJVcGRhdGUpIHtcbiAgICAgICAgICAgIGdsb2JhbFRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIFtyZXF1ZXN0LCBpc0NvbmZpcm1Qb3B1cF0sXG4gICAgKTtcblxuICBjb25zdCBjYW5jZWxIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKCkgPT5cbiAgICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICAgIHN0YXR1czogQWN0aW9uU3RhdHVzLkVSUk9SX1VTRVJfQ0FOQ0VMRUQsXG4gICAgICAgIGlkOiBhY3Rpb25JZCxcbiAgICAgIH0pLFxuICAgIFthY3Rpb25JZCwgdXBkYXRlQWN0aW9uXSxcbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpc0NvbmZpcm1Qb3B1cCkge1xuICAgICAgcmVxdWVzdDxHZXRBY3Rpb25IYW5kbGVyPih7XG4gICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5BQ1RJT05fR0VULFxuICAgICAgICBwYXJhbXM6IFthY3Rpb25JZF0sXG4gICAgICB9KS50aGVuKChhKSA9PiB7XG4gICAgICAgIGlmIChpc0JhdGNoQXBwcm92YWwgJiYgIWlzQmF0Y2hBcHByb3ZhbEFjdGlvbihhKSkge1xuICAgICAgICAgIHNldEVycm9yKCdFeHBlY3RlZCBhIGJhdGNoIGFwcHJvdmFsIGFjdGlvbicpO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0JhdGNoQXBwcm92YWwgJiYgaXNCYXRjaEFwcHJvdmFsQWN0aW9uKGEpKSB7XG4gICAgICAgICAgc2V0RXJyb3IoJ0V4cGVjdGVkIGEgc2luZ2xlIGFwcHJvdmFsIGFjdGlvbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldEFjdGlvbihhIGFzIEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGFwcHJvdmFsPy5hY3Rpb24uYWN0aW9uSWQgPT09IGFjdGlvbklkKSB7XG4gICAgICBzZXRBY3Rpb24oYXBwcm92YWwuYWN0aW9uIGFzIEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4pO1xuICAgIH1cbiAgfSwgW2FjdGlvbklkLCByZXF1ZXN0LCBhcHByb3ZhbCwgaXNDb25maXJtUG9wdXAsIGlzQmF0Y2hBcHByb3ZhbF0pO1xuXG4gIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyKTtcblxuICByZXR1cm4geyBhY3Rpb24sIHVwZGF0ZUFjdGlvbiwgZXJyb3IsIGNhbmNlbEhhbmRsZXIgfTtcbn1cbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG4vKipcbiAqIFRoaXMgaXMgdXNlZCB0byBnZXQgdGhlIGlkIG9mIGEgdHJhbnNhY3Rpb24gb3IgbWVzc2FnZSB0aGF0XG4gKiBoYXMgYmVlbiBwdXQgaW50byBsb2NhbHN0b3JhZ2UgYW5kIHRvIGJlIHVzZWQgYWNyb3NzIG11bHRpcGxlXG4gKiBjb250ZXh0cy4gV2UgZ3JhYiB0aGUgcXVlcnkgcGFyYW0gYW5kIHVzZSB0aGF0IHRvIGdldCB0aGUgaXRlbSBvdXQgb2Ygc3RvcmFnZS5cbiAqXG4gKiBAcmV0dXJucyBpZCBmcm9tIHRoZSBxdWVyeSBwYXJhbVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlR2V0UmVxdWVzdElkKCkge1xuICBjb25zdCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uc2VhcmNoID8/ICcnKTtcbiAgICByZXR1cm4gc2VhcmNoUGFyYW1zLmdldCgnYWN0aW9uSWQnKSA/PyAnJztcbiAgfSwgW2xvY2F0aW9uLnNlYXJjaF0pO1xufVxuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEF2YXRhcixcbiAgQnV0dG9uLFxuICBDaXJjdWxhclByb2dyZXNzLFxuICBDb3B5SWNvbixcbiAgSWNvbkJ1dHRvbixcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG4gIFdhbGxldEljb24sXG4gIHRvYXN0LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQXBwcm92ZUFjdGlvbiB9IGZyb20gJ0BzcmMvaG9va3MvdXNlQXBwcm92ZUFjdGlvbic7XG5pbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlR2V0UmVxdWVzdElkIH0gZnJvbSAnQHNyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQnO1xuaW1wb3J0IHsgdHJ1bmNhdGVBZGRyZXNzIH0gZnJvbSAnQHNyYy91dGlscy90cnVuY2F0ZUFkZHJlc3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gU3dpdGNoQWNjb3VudCgpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHJlcXVlc3RJZCA9IHVzZUdldFJlcXVlc3RJZCgpO1xuXG4gIGNvbnN0IHtcbiAgICBhY3Rpb24sXG4gICAgdXBkYXRlQWN0aW9uOiB1cGRhdGVNZXNzYWdlLFxuICAgIGNhbmNlbEhhbmRsZXIsXG4gIH0gPSB1c2VBcHByb3ZlQWN0aW9uPHsgc2VsZWN0ZWRBY2NvdW50OiBBY2NvdW50IH0+KHJlcXVlc3RJZCk7XG5cbiAgaWYgKCFhY3Rpb24pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPENpcmN1bGFyUHJvZ3Jlc3Mgc2l6ZT17NjB9IC8+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSwgcHg6IDIgfX0+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICBnYXA6IDIsXG4gICAgICAgICAgbWF4V2lkdGg6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxBdmF0YXJcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgd2lkdGg6IDgwLFxuICAgICAgICAgICAgaGVpZ2h0OiA4MCxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF0sXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxXYWxsZXRJY29uIHNpemU9ezQ4fSAvPlxuICAgICAgICA8L0F2YXRhcj5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg0XCI+XG4gICAgICAgICAge3QoJ1N3aXRjaCB0byB7e25hbWV9fT8nLCB7XG4gICAgICAgICAgICBuYW1lOiBhY3Rpb24uZGlzcGxheURhdGEuc2VsZWN0ZWRBY2NvdW50Py5uYW1lLFxuICAgICAgICAgIH0pfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgbWF4V2lkdGg6IDEsXG4gICAgICAgICAgICB3b3JkV3JhcDogJ2JyZWFrLXdvcmQnLFxuICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0KCd7e2RvbWFpbn19IGlzIHJlcXVlc3RpbmcgdG8gc3dpdGNoIHlvdXIgYWN0aXZlIGFjY291bnQuJywge1xuICAgICAgICAgICAgZG9tYWluOiBhY3Rpb24uc2l0ZT8uZG9tYWluIHx8ICdUaGlzIHdlYnNpdGUnLFxuICAgICAgICAgIH0pfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICAgIHB5OiAxLFxuICAgICAgICAgICAgcGw6IDIsXG4gICAgICAgICAgICBwcjogMSxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF0sXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDQ4LFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgZGlyZWN0aW9uPVwicm93XCJcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgZ2FwOiAzLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICB0aXRsZT17YWN0aW9uLmRpc3BsYXlEYXRhLnNlbGVjdGVkQWNjb3VudD8ubmFtZX1cbiAgICAgICAgICAgICAgd3JhcFdpdGhTcGFuPXtmYWxzZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTFcIlxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2FjdGlvbi5kaXNwbGF5RGF0YS5zZWxlY3RlZEFjY291bnQ/Lm5hbWV9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxIH19PlxuICAgICAgICAgICAgICA8VG9vbHRpcCB0aXRsZT17YWN0aW9uLmRpc3BsYXlEYXRhLnNlbGVjdGVkQWNjb3VudD8uYWRkcmVzc0N9PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgICAgICAgICAge3RydW5jYXRlQWRkcmVzcyhcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmRpc3BsYXlEYXRhLnNlbGVjdGVkQWNjb3VudD8uYWRkcmVzc0MsXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uZGlzcGxheURhdGEuc2VsZWN0ZWRBY2NvdW50LmFkZHJlc3NDLFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIHRvYXN0LnN1Y2Nlc3ModCgnQ29waWVkIScpLCB7IGR1cmF0aW9uOiAyMDAwIH0pO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8Q29weUljb24gc2l6ZT17MTZ9IC8+XG4gICAgICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG5cbiAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSwganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIHN4PXt7IGdhcDogMSB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzd2l0Y2gtYWNjb3VudC1yZWplY3QtYnRuXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnUmVqZWN0Jyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzd2l0Y2gtYWNjb3VudC1hcHByb3ZlLWJ0blwiXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgY29sb3I9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgdXBkYXRlTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyxcbiAgICAgICAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnQXBwcm92ZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgU2lnbmluZ0RhdGEgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhID0gKFxuICBvbGRTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuICBuZXdTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuKTogU2lnbmluZ0RhdGEgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoIW9sZFNpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG5ld1NpZ25pbmdEYXRhO1xuICB9IGVsc2UgaWYgKCFuZXdTaWduaW5nRGF0YSkge1xuICAgIHJldHVybiBvbGRTaWduaW5nRGF0YTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub2xkU2lnbmluZ0RhdGEsXG4gICAgLi4ubmV3U2lnbmluZ0RhdGEsXG4gIH07XG59O1xuIiwiaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgZnJvbUV2ZW50UGF0dGVybiwgbWVyZ2UgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICAgZnJvbUV2ZW50UGF0dGVybihcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLnBpcGUoXG4gICAgICAgIGZpbHRlcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbic7XG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIE9ubHkgY2xvc2UgZm9yIHBvcHVwIHdpbmRvd3MuIFRoZSBleHRlbnNpb24gVUkgc2hvdWxkIG5vdCByZWFjdCB0aGlzIHdheS5cbiAgICAgICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW2NhbmNlbEhhbmRsZXIsIGlzQ29uZmlybVBvcHVwXSk7XG59XG4iXSwibmFtZXMiOlsiRXh0ZW5zaW9uUmVxdWVzdCIsImlzQmF0Y2hBcHByb3ZhbEFjdGlvbiIsIkFjdGlvblN0YXR1cyIsInVzZUNvbm5lY3Rpb25Db250ZXh0IiwidXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuIiwidXNlQ2FsbGJhY2siLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkNvbnRleHRDb250YWluZXIiLCJ1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lciIsInVzZUFwcHJvdmFsc0NvbnRleHQiLCJnZXRVcGRhdGVkU2lnbmluZ0RhdGEiLCJ1c2VBcHByb3ZlQWN0aW9uIiwiYWN0aW9uSWQiLCJpc0JhdGNoQXBwcm92YWwiLCJyZXF1ZXN0IiwiaXNDb25maXJtUG9wdXAiLCJDT05GSVJNIiwiYXBwcm92YWwiLCJhY3Rpb24iLCJzZXRBY3Rpb24iLCJlcnJvciIsInNldEVycm9yIiwidXBkYXRlQWN0aW9uIiwicGFyYW1zIiwic2hvdWxkV2FpdEZvclJlc3BvbnNlIiwicHJldkFjdGlvbkRhdGEiLCJzdGF0dXMiLCJkaXNwbGF5RGF0YSIsInNpZ25pbmdEYXRhIiwic2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSIsIlBFTkRJTkciLCJtZXRob2QiLCJBQ1RJT05fVVBEQVRFIiwiZmluYWxseSIsImdsb2JhbFRoaXMiLCJjbG9zZSIsImNhbmNlbEhhbmRsZXIiLCJFUlJPUl9VU0VSX0NBTkNFTEVEIiwiaWQiLCJBQ1RJT05fR0VUIiwidGhlbiIsImEiLCJ1c2VNZW1vIiwidXNlTG9jYXRpb24iLCJ1c2VHZXRSZXF1ZXN0SWQiLCJsb2NhdGlvbiIsInNlYXJjaFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInNlYXJjaCIsImdldCIsInVzZVRyYW5zbGF0aW9uIiwiQXZhdGFyIiwiQnV0dG9uIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIkNvcHlJY29uIiwiSWNvbkJ1dHRvbiIsIlN0YWNrIiwiVG9vbHRpcCIsIlR5cG9ncmFwaHkiLCJXYWxsZXRJY29uIiwidG9hc3QiLCJ1c2VUaGVtZSIsInRydW5jYXRlQWRkcmVzcyIsIlN3aXRjaEFjY291bnQiLCJ0aGVtZSIsInQiLCJyZXF1ZXN0SWQiLCJ1cGRhdGVNZXNzYWdlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJ3aWR0aCIsImhlaWdodCIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsInNpemUiLCJweCIsImZsZXhHcm93IiwidGV4dEFsaWduIiwiZ2FwIiwibWF4V2lkdGgiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwYWxldHRlIiwiZ3JleSIsInZhcmlhbnQiLCJuYW1lIiwic2VsZWN0ZWRBY2NvdW50Iiwid29yZFdyYXAiLCJjb2xvciIsImRvbWFpbiIsInNpdGUiLCJkaXJlY3Rpb24iLCJweSIsInBsIiwicHIiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyUmFkaXVzIiwiZmxleCIsInRpdGxlIiwid3JhcFdpdGhTcGFuIiwib3ZlcmZsb3ciLCJ0ZXh0T3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwiYWRkcmVzc0MiLCJvbkNsaWNrIiwibmF2aWdhdG9yIiwiY2xpcGJvYXJkIiwid3JpdGVUZXh0Iiwic3VjY2VzcyIsImR1cmF0aW9uIiwid2luZG93IiwiZnVsbFdpZHRoIiwiU1VCTUlUVElORyIsIm9sZFNpZ25pbmdEYXRhIiwibmV3U2lnbmluZ0RhdGEiLCJmaWx0ZXIiLCJmaXJzdCIsImZyb21FdmVudFBhdHRlcm4iLCJtZXJnZSIsInN1YnNjcmlwdGlvbiIsImhhbmRsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBpcGUiLCJkb2N1bWVudCIsInZpc2liaWxpdHlTdGF0ZSIsInN1YnNjcmliZSIsInVuc3Vic2NyaWJlIl0sInNvdXJjZVJvb3QiOiIifQ==