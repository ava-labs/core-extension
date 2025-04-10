"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Network_SwitchActiveNetwork_tsx"],{

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

/***/ "./src/hooks/useWillSwitchToPrimaryAccount.ts":
/*!****************************************************!*\
  !*** ./src/hooks/useWillSwitchToPrimaryAccount.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useWillSwitchToPrimaryAccount)
/* harmony export */ });
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_utils_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/environment */ "./src/utils/environment.ts");



function useWillSwitchToPrimaryAccount(isSwitchingToTestnetMode) {
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  const isFireblocksAccount = activeAccount?.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.AccountType.FIREBLOCKS;
  return Boolean((0,_src_utils_environment__WEBPACK_IMPORTED_MODULE_2__.isProductionBuild)() && isSwitchingToTestnetMode && isFireblocksAccount);
}

/***/ }),

/***/ "./src/pages/Network/SwitchActiveNetwork.tsx":
/*!***************************************************!*\
  !*** ./src/pages/Network/SwitchActiveNetwork.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SwitchActiveNetwork": () => (/* binding */ SwitchActiveNetwork)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_hooks_useWillSwitchToPrimaryAccount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useWillSwitchToPrimaryAccount */ "./src/hooks/useWillSwitchToPrimaryAccount.ts");
/* harmony import */ var _hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







const SiteAvatar = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack)`
  width: 88px;
  height: 88px;
  background-color: ${({
  theme
}) => theme.palette.grey[850]};
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;
function SwitchActiveNetwork() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_2__.useGetRequestId)();
  const {
    action,
    updateAction: updateMessage,
    cancelHandler
  } = (0,_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_4__.useApproveAction)(requestId);
  const isLoading = !action || !action.displayData;
  const network = action?.displayData?.network;
  const willSwitchToPrimaryAccount = (0,_src_hooks_useWillSwitchToPrimaryAccount__WEBPACK_IMPORTED_MODULE_3__["default"])(Boolean(network?.isTestnet));
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      width: 1,
      height: 1,
      px: 2,
      pb: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, isLoading && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.CircularProgress, {
    size: 100
  }), !isLoading && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      px: 2,
      pb: 3,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 3,
      maxWidth: 1
    }
  }, /*#__PURE__*/React.createElement(SiteAvatar, null, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_0__.TokenIcon, {
    height: "56px",
    width: "56px",
    src: network?.logoUri
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.GlobeIcon, {
    size: 56
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "h4"
  }, t('Switch to {{chainName}} Network?', {
    chainName: network?.chainName
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "body1",
    sx: {
      textAlign: 'center',
      maxWidth: 1,
      wordWrap: 'break-word',
      color: 'text.secondary'
    }
  }, t('{{domain}} is requesting to switch your active network to {{chainName}}', {
    chainName: network?.chainName,
    domain: action?.site?.domain || t('This website')
  })), willSwitchToPrimaryAccount && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "caption",
    sx: {
      mt: 3,
      color: 'warning.main'
    }
  }, t('Approving will also switch to your primary account, as Fireblocks-imported accounts are not supported in testnet mode at the moment.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      width: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'flex-end',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    fullWidth: true,
    color: "secondary",
    size: "large",
    onClick: () => {
      cancelHandler();
      window.close();
    }
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    fullWidth: true,
    color: "primary",
    size: "large",
    onClick: () => {
      updateMessage({
        status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
        id: requestId
      });
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX05ldHdvcmtfU3dpdGNoQWN0aXZlTmV0d29ya190c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUEwRjtBQVF6QztBQUNzQjtBQUNDO0FBQ2E7QUFDNUI7QUFJaEI7QUFDNkI7QUFDVTtBQTRCekUsU0FBU1ksZ0JBQWdCQSxDQUM5QkMsUUFBZ0IsRUFDaEJDLGVBQXdCLEdBQUcsS0FBSyxFQUM2QjtFQUM3RCxNQUFNO0lBQUVDO0VBQVEsQ0FBQyxHQUFHWixzRkFBb0IsRUFBRTtFQUMxQyxNQUFNYSxjQUFjLEdBQUdQLDZGQUE2QixDQUNsREQsb0ZBQXdCLENBQ3pCO0VBQ0QsTUFBTTtJQUFFVTtFQUFTLENBQUMsR0FBR1Isb0ZBQW1CLEVBQUU7RUFDMUMsTUFBTSxDQUFDUyxNQUFNLEVBQUVDLFNBQVMsQ0FBQyxHQUFHYiwrQ0FBUSxFQUFzQztFQUMxRSxNQUFNLENBQUNjLEtBQUssRUFBRUMsUUFBUSxDQUFDLEdBQUdmLCtDQUFRLENBQVMsRUFBRSxDQUFDO0VBRTlDLE1BQU1nQixZQUErRCxHQUNuRWxCLGtEQUFXLENBQ1QsT0FBT21CLE1BQU0sRUFBRUMscUJBQXFCLEtBQUs7SUFDdkM7SUFDQTtJQUNBTCxTQUFTLENBQUVNLGNBQWMsSUFBSztNQUM1QixJQUFJLENBQUNBLGNBQWMsRUFBRTtRQUNuQjtNQUNGOztNQUVBO01BQ0EsSUFBSXpCLDhGQUFxQixDQUFDeUIsY0FBYyxDQUFDLEVBQUU7UUFDekMsT0FBTztVQUNMLEdBQUdBLGNBQWM7VUFDakJDLE1BQU0sRUFBRUgsTUFBTSxDQUFDRztRQUNqQixDQUFDO01BQ0g7TUFFQSxPQUFPO1FBQ0wsR0FBR0QsY0FBYztRQUNqQkMsTUFBTSxFQUFFSCxNQUFNLENBQUNHLE1BQU07UUFDckJDLFdBQVcsRUFBRTtVQUNYLEdBQUdGLGNBQWMsQ0FBQ0UsV0FBVztVQUM3QixHQUFHSixNQUFNLENBQUNJO1FBQ1osQ0FBQztRQUNEQyxXQUFXLEVBQUVsQiw4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Q0FDRUYsSUFBSSxDQUFDUCwyQ0FBSyxFQUFFLENBQUMsQ0FDYlUsU0FBUyxDQUFDLE1BQU07TUFDZjtNQUNBLElBQUk5RyxjQUFjLEVBQUU7UUFDbEJxQixhQUFhLEVBQUU7TUFDakI7SUFDRixDQUFDLENBQUM7SUFFSixPQUFPLE1BQU07TUFDWGtGLFlBQVksRUFBRVEsV0FBVyxFQUFFO0lBQzdCLENBQUM7RUFDSCxDQUFDLEVBQUUsQ0FBQzFGLGFBQWEsRUFBRXJCLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VBcHByb3ZlQWN0aW9uLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlR2V0UmVxdWVzdElkLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlV2lsbFN3aXRjaFRvUHJpbWFyeUFjY291bnQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9OZXR3b3JrL1N3aXRjaEFjdGl2ZU5ldHdvcmsudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvYWN0aW9ucy9nZXRVcGRhdGVkQWN0aW9uRGF0YS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL3VzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHRlbnNpb25SZXF1ZXN0IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL2Nvbm5lY3Rpb25zL2V4dGVuc2lvbkNvbm5lY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7IEdldEFjdGlvbkhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9oYW5kbGVycy9nZXRBY3Rpb25zJztcbmltcG9ydCB7IFVwZGF0ZUFjdGlvbkhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9oYW5kbGVycy91cGRhdGVBY3Rpb24nO1xuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBBY3Rpb25VcGRhdGUsXG4gIE11bHRpVHhBY3Rpb24sXG4gIGlzQmF0Y2hBcHByb3ZhbEFjdGlvbixcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7IHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbiB9IGZyb20gJ0BzcmMvdXRpbHMvdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJy4vdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlQXBwcm92YWxzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQXBwcm92YWxzUHJvdmlkZXInO1xuaW1wb3J0IHsgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhIH0gZnJvbSAnQHNyYy91dGlscy9hY3Rpb25zL2dldFVwZGF0ZWRBY3Rpb25EYXRhJztcblxudHlwZSBBY3Rpb25UeXBlPElzQmF0Y2hBcHByb3ZhbD4gPSBJc0JhdGNoQXBwcm92YWwgZXh0ZW5kcyB0cnVlXG4gID8gTXVsdGlUeEFjdGlvblxuICA6IEFjdGlvbjtcblxudHlwZSBBY3Rpb25VcGRhdGVyPFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uIHwgdW5kZWZpbmVkPiA9IChcbiAgcGFyYW1zOiBBY3Rpb25VcGRhdGU8XG4gICAgUGFydGlhbDxUIGV4dGVuZHMgQWN0aW9uIHwgTXVsdGlUeEFjdGlvbiA/IFRbJ2Rpc3BsYXlEYXRhJ10gOiBuZXZlcj5cbiAgPixcbiAgc2hvdWxkV2FpdEZvclJlc3BvbnNlPzogYm9vbGVhbixcbikgPT4gUHJvbWlzZTxib29sZWFuPjtcblxudHlwZSBIb29rUmVzdWx0PFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uIHwgdW5kZWZpbmVkPiA9IHtcbiAgYWN0aW9uOiBUO1xuICB1cGRhdGVBY3Rpb246IEFjdGlvblVwZGF0ZXI8VD47XG4gIGVycm9yOiBzdHJpbmc7XG4gIGNhbmNlbEhhbmRsZXI6ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwcm92ZUFjdGlvbjxEaXNwbGF5RGF0YSA9IGFueT4oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbD86IGZhbHNlLFxuKTogSG9va1Jlc3VsdDxBY3Rpb248RGlzcGxheURhdGE+PjtcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uKFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw/OiB0cnVlLFxuKTogSG9va1Jlc3VsdDxNdWx0aVR4QWN0aW9uPjtcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uPERpc3BsYXlEYXRhID0gYW55PihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsOiBib29sZWFuID0gZmFsc2UsXG4pOiBIb29rUmVzdWx0PEFjdGlvbjxEaXNwbGF5RGF0YT4gfCBNdWx0aVR4QWN0aW9uIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IHsgcmVxdWVzdCB9ID0gdXNlQ29ubmVjdGlvbkNvbnRleHQoKTtcbiAgY29uc3QgaXNDb25maXJtUG9wdXAgPSB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcihcbiAgICBDb250ZXh0Q29udGFpbmVyLkNPTkZJUk0sXG4gICk7XG4gIGNvbnN0IHsgYXBwcm92YWwgfSA9IHVzZUFwcHJvdmFsc0NvbnRleHQoKTtcbiAgY29uc3QgW2FjdGlvbiwgc2V0QWN0aW9uXSA9IHVzZVN0YXRlPEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4+KCk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG5cbiAgY29uc3QgdXBkYXRlQWN0aW9uOiBBY3Rpb25VcGRhdGVyPEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4+ID1cbiAgICB1c2VDYWxsYmFjayhcbiAgICAgIGFzeW5jIChwYXJhbXMsIHNob3VsZFdhaXRGb3JSZXNwb25zZSkgPT4ge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIHVwZGF0ZSB0aGUgc3RhdHVzIGEgYml0IGZhc3RlciBmb3Igc21vb3RoZXIgVVguXG4gICAgICAgIC8vIHVzZSBmdW5jdGlvbiB0byBhdm9pZCBgYWN0aW9uYCBhcyBhIGRlcGVuZGVuY3kgYW5kIHRodXMgaW5maW5pdGUgbG9vcHNcbiAgICAgICAgc2V0QWN0aW9uKChwcmV2QWN0aW9uRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghcHJldkFjdGlvbkRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGb3IgTXVsdGlUeEFjdGlvbiwgd2UgZG9uJ3QgYWxsb3cgYW55IHVwZGF0ZXMgYmVzaWRlcyB0aGUgc3RhdHVzLlxuICAgICAgICAgIGlmIChpc0JhdGNoQXBwcm92YWxBY3Rpb24ocHJldkFjdGlvbkRhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YSxcbiAgICAgICAgICAgICAgc3RhdHVzOiBwYXJhbXMuc3RhdHVzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucHJldkFjdGlvbkRhdGEsXG4gICAgICAgICAgICBzdGF0dXM6IHBhcmFtcy5zdGF0dXMsXG4gICAgICAgICAgICBkaXNwbGF5RGF0YToge1xuICAgICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YS5kaXNwbGF5RGF0YSxcbiAgICAgICAgICAgICAgLi4ucGFyYW1zLmRpc3BsYXlEYXRhLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpZ25pbmdEYXRhOiBnZXRVcGRhdGVkU2lnbmluZ0RhdGEoXG4gICAgICAgICAgICAgIHByZXZBY3Rpb25EYXRhLnNpZ25pbmdEYXRhLFxuICAgICAgICAgICAgICBwYXJhbXMuc2lnbmluZ0RhdGEsXG4gICAgICAgICAgICApLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNob3VsZENsb3NlQWZ0ZXJVcGRhdGUgPVxuICAgICAgICAgIGlzQ29uZmlybVBvcHVwICYmIHBhcmFtcy5zdGF0dXMgIT09IEFjdGlvblN0YXR1cy5QRU5ESU5HO1xuXG4gICAgICAgIHJldHVybiByZXF1ZXN0PFVwZGF0ZUFjdGlvbkhhbmRsZXI+KHtcbiAgICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuQUNUSU9OX1VQREFURSxcbiAgICAgICAgICBwYXJhbXM6IFtwYXJhbXMsIHNob3VsZFdhaXRGb3JSZXNwb25zZV0sXG4gICAgICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgIGlmIChzaG91bGRDbG9zZUFmdGVyVXBkYXRlKSB7XG4gICAgICAgICAgICBnbG9iYWxUaGlzLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBbcmVxdWVzdCwgaXNDb25maXJtUG9wdXBdLFxuICAgICk7XG5cbiAgY29uc3QgY2FuY2VsSGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICgpID0+XG4gICAgICB1cGRhdGVBY3Rpb24oe1xuICAgICAgICBzdGF0dXM6IEFjdGlvblN0YXR1cy5FUlJPUl9VU0VSX0NBTkNFTEVELFxuICAgICAgICBpZDogYWN0aW9uSWQsXG4gICAgICB9KSxcbiAgICBbYWN0aW9uSWQsIHVwZGF0ZUFjdGlvbl0sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNDb25maXJtUG9wdXApIHtcbiAgICAgIHJlcXVlc3Q8R2V0QWN0aW9uSGFuZGxlcj4oe1xuICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuQUNUSU9OX0dFVCxcbiAgICAgICAgcGFyYW1zOiBbYWN0aW9uSWRdLFxuICAgICAgfSkudGhlbigoYSkgPT4ge1xuICAgICAgICBpZiAoaXNCYXRjaEFwcHJvdmFsICYmICFpc0JhdGNoQXBwcm92YWxBY3Rpb24oYSkpIHtcbiAgICAgICAgICBzZXRFcnJvcignRXhwZWN0ZWQgYSBiYXRjaCBhcHByb3ZhbCBhY3Rpb24nKTtcbiAgICAgICAgfSBlbHNlIGlmICghaXNCYXRjaEFwcHJvdmFsICYmIGlzQmF0Y2hBcHByb3ZhbEFjdGlvbihhKSkge1xuICAgICAgICAgIHNldEVycm9yKCdFeHBlY3RlZCBhIHNpbmdsZSBhcHByb3ZhbCBhY3Rpb24nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRBY3Rpb24oYSBhcyBBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChhcHByb3ZhbD8uYWN0aW9uLmFjdGlvbklkID09PSBhY3Rpb25JZCkge1xuICAgICAgc2V0QWN0aW9uKGFwcHJvdmFsLmFjdGlvbiBhcyBBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+KTtcbiAgICB9XG4gIH0sIFthY3Rpb25JZCwgcmVxdWVzdCwgYXBwcm92YWwsIGlzQ29uZmlybVBvcHVwLCBpc0JhdGNoQXBwcm92YWxdKTtcblxuICB1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4oY2FuY2VsSGFuZGxlcik7XG5cbiAgcmV0dXJuIHsgYWN0aW9uLCB1cGRhdGVBY3Rpb24sIGVycm9yLCBjYW5jZWxIYW5kbGVyIH07XG59XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTG9jYXRpb24gfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcblxuLyoqXG4gKiBUaGlzIGlzIHVzZWQgdG8gZ2V0IHRoZSBpZCBvZiBhIHRyYW5zYWN0aW9uIG9yIG1lc3NhZ2UgdGhhdFxuICogaGFzIGJlZW4gcHV0IGludG8gbG9jYWxzdG9yYWdlIGFuZCB0byBiZSB1c2VkIGFjcm9zcyBtdWx0aXBsZVxuICogY29udGV4dHMuIFdlIGdyYWIgdGhlIHF1ZXJ5IHBhcmFtIGFuZCB1c2UgdGhhdCB0byBnZXQgdGhlIGl0ZW0gb3V0IG9mIHN0b3JhZ2UuXG4gKlxuICogQHJldHVybnMgaWQgZnJvbSB0aGUgcXVlcnkgcGFyYW1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUdldFJlcXVlc3RJZCgpIHtcbiAgY29uc3QgbG9jYXRpb24gPSB1c2VMb2NhdGlvbigpO1xuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCA/PyAnJyk7XG4gICAgcmV0dXJuIHNlYXJjaFBhcmFtcy5nZXQoJ2FjdGlvbklkJykgPz8gJyc7XG4gIH0sIFtsb2NhdGlvbi5zZWFyY2hdKTtcbn1cbiIsImltcG9ydCB7IEFjY291bnRUeXBlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgaXNQcm9kdWN0aW9uQnVpbGQgfSBmcm9tICdAc3JjL3V0aWxzL2Vudmlyb25tZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlV2lsbFN3aXRjaFRvUHJpbWFyeUFjY291bnQoXG4gIGlzU3dpdGNoaW5nVG9UZXN0bmV0TW9kZTogYm9vbGVhbixcbikge1xuICBjb25zdCB7XG4gICAgYWNjb3VudHM6IHsgYWN0aXZlOiBhY3RpdmVBY2NvdW50IH0sXG4gIH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcblxuICBjb25zdCBpc0ZpcmVibG9ja3NBY2NvdW50ID0gYWN0aXZlQWNjb3VudD8udHlwZSA9PT0gQWNjb3VudFR5cGUuRklSRUJMT0NLUztcblxuICByZXR1cm4gQm9vbGVhbihcbiAgICBpc1Byb2R1Y3Rpb25CdWlsZCgpICYmIGlzU3dpdGNoaW5nVG9UZXN0bmV0TW9kZSAmJiBpc0ZpcmVibG9ja3NBY2NvdW50LFxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDaXJjdWxhclByb2dyZXNzLFxuICBHbG9iZUljb24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICBzdHlsZWQsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7IFRva2VuSWNvbiB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vVG9rZW5JY29uJztcbmltcG9ydCB7IEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyB1c2VHZXRSZXF1ZXN0SWQgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUdldFJlcXVlc3RJZCc7XG5pbXBvcnQgdXNlV2lsbFN3aXRjaFRvUHJpbWFyeUFjY291bnQgZnJvbSAnQHNyYy9ob29rcy91c2VXaWxsU3dpdGNoVG9QcmltYXJ5QWNjb3VudCc7XG5cbmltcG9ydCB7IHVzZUFwcHJvdmVBY3Rpb24gfSBmcm9tICcuLi8uLi9ob29rcy91c2VBcHByb3ZlQWN0aW9uJztcblxuY29uc3QgU2l0ZUF2YXRhciA9IHN0eWxlZChTdGFjaylgXG4gIHdpZHRoOiA4OHB4O1xuICBoZWlnaHQ6IDg4cHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF19O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIFN3aXRjaEFjdGl2ZU5ldHdvcmsoKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgcmVxdWVzdElkID0gdXNlR2V0UmVxdWVzdElkKCk7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb24sXG4gICAgdXBkYXRlQWN0aW9uOiB1cGRhdGVNZXNzYWdlLFxuICAgIGNhbmNlbEhhbmRsZXIsXG4gIH0gPSB1c2VBcHByb3ZlQWN0aW9uKHJlcXVlc3RJZCk7XG5cbiAgY29uc3QgaXNMb2FkaW5nID0gIWFjdGlvbiB8fCAhYWN0aW9uLmRpc3BsYXlEYXRhO1xuICBjb25zdCBuZXR3b3JrOiBOZXR3b3JrID0gYWN0aW9uPy5kaXNwbGF5RGF0YT8ubmV0d29yaztcbiAgY29uc3Qgd2lsbFN3aXRjaFRvUHJpbWFyeUFjY291bnQgPSB1c2VXaWxsU3dpdGNoVG9QcmltYXJ5QWNjb3VudChcbiAgICBCb29sZWFuKG5ldHdvcms/LmlzVGVzdG5ldCksXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAxLFxuICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBwYjogMSxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAge2lzTG9hZGluZyAmJiA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXsxMDB9IC8+fVxuICAgICAgeyFpc0xvYWRpbmcgJiYgKFxuICAgICAgICA8PlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgICAgIHBiOiAzLFxuICAgICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICBnYXA6IDMsXG4gICAgICAgICAgICAgIG1heFdpZHRoOiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U2l0ZUF2YXRhcj5cbiAgICAgICAgICAgICAgPFRva2VuSWNvbiBoZWlnaHQ9XCI1NnB4XCIgd2lkdGg9XCI1NnB4XCIgc3JjPXtuZXR3b3JrPy5sb2dvVXJpfT5cbiAgICAgICAgICAgICAgICA8R2xvYmVJY29uIHNpemU9ezU2fSAvPlxuICAgICAgICAgICAgICA8L1Rva2VuSWNvbj5cbiAgICAgICAgICAgIDwvU2l0ZUF2YXRhcj5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiPlxuICAgICAgICAgICAgICB7dCgnU3dpdGNoIHRvIHt7Y2hhaW5OYW1lfX0gTmV0d29yaz8nLCB7XG4gICAgICAgICAgICAgICAgY2hhaW5OYW1lOiBuZXR3b3JrPy5jaGFpbk5hbWUsXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkxXCJcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiAxLFxuICAgICAgICAgICAgICAgIHdvcmRXcmFwOiAnYnJlYWstd29yZCcsXG4gICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAgICd7e2RvbWFpbn19IGlzIHJlcXVlc3RpbmcgdG8gc3dpdGNoIHlvdXIgYWN0aXZlIG5ldHdvcmsgdG8ge3tjaGFpbk5hbWV9fScsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgY2hhaW5OYW1lOiBuZXR3b3JrPy5jaGFpbk5hbWUsXG4gICAgICAgICAgICAgICAgICBkb21haW46IGFjdGlvbj8uc2l0ZT8uZG9tYWluIHx8IHQoJ1RoaXMgd2Vic2l0ZScpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICB7d2lsbFN3aXRjaFRvUHJpbWFyeUFjY291bnQgJiYgKFxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICBzeD17eyBtdDogMywgY29sb3I6ICd3YXJuaW5nLm1haW4nIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dChcbiAgICAgICAgICAgICAgICAgICdBcHByb3Zpbmcgd2lsbCBhbHNvIHN3aXRjaCB0byB5b3VyIHByaW1hcnkgYWNjb3VudCwgYXMgRmlyZWJsb2Nrcy1pbXBvcnRlZCBhY2NvdW50cyBhcmUgbm90IHN1cHBvcnRlZCBpbiB0ZXN0bmV0IG1vZGUgYXQgdGhlIG1vbWVudC4nLFxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgIGFsaWduU2VsZjogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBjYW5jZWxIYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdSZWplY3QnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgICAgY29sb3I9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHVwZGF0ZU1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyxcbiAgICAgICAgICAgICAgICAgIGlkOiByZXF1ZXN0SWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdBcHByb3ZlJyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8Lz5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFNpZ25pbmdEYXRhIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuZXhwb3J0IGNvbnN0IGdldFVwZGF0ZWRTaWduaW5nRGF0YSA9IChcbiAgb2xkU2lnbmluZ0RhdGE/OiBTaWduaW5nRGF0YSxcbiAgbmV3U2lnbmluZ0RhdGE/OiBTaWduaW5nRGF0YSxcbik6IFNpZ25pbmdEYXRhIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKCFvbGRTaWduaW5nRGF0YSkge1xuICAgIHJldHVybiBuZXdTaWduaW5nRGF0YTtcbiAgfSBlbHNlIGlmICghbmV3U2lnbmluZ0RhdGEpIHtcbiAgICByZXR1cm4gb2xkU2lnbmluZ0RhdGE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm9sZFNpZ25pbmdEYXRhLFxuICAgIC4uLm5ld1NpZ25pbmdEYXRhLFxuICB9O1xufTtcbiIsImltcG9ydCB7XG4gIENvbnRleHRDb250YWluZXIsXG4gIHVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyLFxufSBmcm9tICdAc3JjL2hvb2tzL3VzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyJztcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGZpbHRlciwgZmlyc3QsIGZyb21FdmVudFBhdHRlcm4sIG1lcmdlIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4oY2FuY2VsSGFuZGxlcjogKCkgPT4gdm9pZCkge1xuICBjb25zdCBpc0NvbmZpcm1Qb3B1cCA9IHVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyKFxuICAgIENvbnRleHRDb250YWluZXIuQ09ORklSTSxcbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG1lcmdlKFxuICAgICAgZnJvbUV2ZW50UGF0dGVybihcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICAgIChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3VubG9hZCcsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgKSxcbiAgICAgIGZyb21FdmVudFBhdHRlcm4oXG4gICAgICAgIChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgKS5waXBlKFxuICAgICAgICBmaWx0ZXIoKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICdoaWRkZW4nO1xuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgKVxuICAgICAgLnBpcGUoZmlyc3QoKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBPbmx5IGNsb3NlIGZvciBwb3B1cCB3aW5kb3dzLiBUaGUgZXh0ZW5zaW9uIFVJIHNob3VsZCBub3QgcmVhY3QgdGhpcyB3YXkuXG4gICAgICAgIGlmIChpc0NvbmZpcm1Qb3B1cCkge1xuICAgICAgICAgIGNhbmNlbEhhbmRsZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgIH07XG4gIH0sIFtjYW5jZWxIYW5kbGVyLCBpc0NvbmZpcm1Qb3B1cF0pO1xufVxuIl0sIm5hbWVzIjpbIkV4dGVuc2lvblJlcXVlc3QiLCJpc0JhdGNoQXBwcm92YWxBY3Rpb24iLCJBY3Rpb25TdGF0dXMiLCJ1c2VDb25uZWN0aW9uQ29udGV4dCIsInVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbiIsInVzZUNhbGxiYWNrIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJDb250ZXh0Q29udGFpbmVyIiwidXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIiLCJ1c2VBcHByb3ZhbHNDb250ZXh0IiwiZ2V0VXBkYXRlZFNpZ25pbmdEYXRhIiwidXNlQXBwcm92ZUFjdGlvbiIsImFjdGlvbklkIiwiaXNCYXRjaEFwcHJvdmFsIiwicmVxdWVzdCIsImlzQ29uZmlybVBvcHVwIiwiQ09ORklSTSIsImFwcHJvdmFsIiwiYWN0aW9uIiwic2V0QWN0aW9uIiwiZXJyb3IiLCJzZXRFcnJvciIsInVwZGF0ZUFjdGlvbiIsInBhcmFtcyIsInNob3VsZFdhaXRGb3JSZXNwb25zZSIsInByZXZBY3Rpb25EYXRhIiwic3RhdHVzIiwiZGlzcGxheURhdGEiLCJzaWduaW5nRGF0YSIsInNob3VsZENsb3NlQWZ0ZXJVcGRhdGUiLCJQRU5ESU5HIiwibWV0aG9kIiwiQUNUSU9OX1VQREFURSIsImZpbmFsbHkiLCJnbG9iYWxUaGlzIiwiY2xvc2UiLCJjYW5jZWxIYW5kbGVyIiwiRVJST1JfVVNFUl9DQU5DRUxFRCIsImlkIiwiQUNUSU9OX0dFVCIsInRoZW4iLCJhIiwidXNlTWVtbyIsInVzZUxvY2F0aW9uIiwidXNlR2V0UmVxdWVzdElkIiwibG9jYXRpb24iLCJzZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJzZWFyY2giLCJnZXQiLCJBY2NvdW50VHlwZSIsInVzZUFjY291bnRzQ29udGV4dCIsImlzUHJvZHVjdGlvbkJ1aWxkIiwidXNlV2lsbFN3aXRjaFRvUHJpbWFyeUFjY291bnQiLCJpc1N3aXRjaGluZ1RvVGVzdG5ldE1vZGUiLCJhY2NvdW50cyIsImFjdGl2ZSIsImFjdGl2ZUFjY291bnQiLCJpc0ZpcmVibG9ja3NBY2NvdW50IiwidHlwZSIsIkZJUkVCTE9DS1MiLCJCb29sZWFuIiwiQnV0dG9uIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIkdsb2JlSWNvbiIsIlN0YWNrIiwiVHlwb2dyYXBoeSIsInN0eWxlZCIsInVzZVRyYW5zbGF0aW9uIiwiVG9rZW5JY29uIiwiU2l0ZUF2YXRhciIsInRoZW1lIiwicGFsZXR0ZSIsImdyZXkiLCJTd2l0Y2hBY3RpdmVOZXR3b3JrIiwidCIsInJlcXVlc3RJZCIsInVwZGF0ZU1lc3NhZ2UiLCJpc0xvYWRpbmciLCJuZXR3b3JrIiwid2lsbFN3aXRjaFRvUHJpbWFyeUFjY291bnQiLCJpc1Rlc3RuZXQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzeCIsIndpZHRoIiwiaGVpZ2h0IiwicHgiLCJwYiIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsInNpemUiLCJGcmFnbWVudCIsImZsZXgiLCJ0ZXh0QWxpZ24iLCJnYXAiLCJtYXhXaWR0aCIsInNyYyIsImxvZ29VcmkiLCJ2YXJpYW50IiwiY2hhaW5OYW1lIiwid29yZFdyYXAiLCJjb2xvciIsImRvbWFpbiIsInNpdGUiLCJtdCIsImRpcmVjdGlvbiIsImFsaWduU2VsZiIsImZ1bGxXaWR0aCIsIm9uQ2xpY2siLCJ3aW5kb3ciLCJTVUJNSVRUSU5HIiwib2xkU2lnbmluZ0RhdGEiLCJuZXdTaWduaW5nRGF0YSIsImZpbHRlciIsImZpcnN0IiwiZnJvbUV2ZW50UGF0dGVybiIsIm1lcmdlIiwic3Vic2NyaXB0aW9uIiwiaGFuZGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicGlwZSIsImRvY3VtZW50IiwidmlzaWJpbGl0eVN0YXRlIiwic3Vic2NyaWJlIiwidW5zdWJzY3JpYmUiXSwic291cmNlUm9vdCI6IiJ9