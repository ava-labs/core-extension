"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ApproveAction_SetDeveloperMode_tsx"],{

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

/***/ "./src/pages/ApproveAction/SetDeveloperMode.tsx":
/*!******************************************************!*\
  !*** ./src/pages/ApproveAction/SetDeveloperMode.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SetDeveloperMode": () => (/* binding */ SetDeveloperMode)
/* harmony export */ });
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/SiteAvatar */ "./src/components/common/SiteAvatar.tsx");
/* harmony import */ var _src_hooks_useWillSwitchToPrimaryAccount__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/hooks/useWillSwitchToPrimaryAccount */ "./src/hooks/useWillSwitchToPrimaryAccount.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function SetDeveloperMode() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_0__.useGetRequestId)();
  const {
    action,
    updateAction: updateMessage,
    cancelHandler
  } = (0,_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_3__.useApproveAction)(requestId);
  const willSwitchToPrimaryAccount = (0,_src_hooks_useWillSwitchToPrimaryAccount__WEBPACK_IMPORTED_MODULE_5__["default"])(action?.displayData.isTestmode);
  if (!action) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
      sx: {
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.CircularProgress, null));
  }
  const network = action.displayData;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      py: 1,
      px: 2,
      width: 1,
      height: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      height: 1,
      width: 1,
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_4__.SiteAvatar, {
    sx: {
      mb: 3
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_2__.TokenIcon, {
    height: "48px",
    width: "48px",
    src: network?.logoUri
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.GlobeIcon, {
    size: 48
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    sx: {
      pb: 2
    },
    variant: "h4"
  }, action.displayData?.isTestmode ? t('Activate') : t('Deactivate'), ' ', t('Testnet Mode?')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    sx: {
      textAlign: 'center',
      maxWidth: 1,
      wordWrap: 'break-word'
    },
    variant: "body1"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_8__.Trans, {
    i18nKey: '{{domain}} is requesting to turn Testnet Mode {{mode}}',
    values: {
      mode: action.displayData?.isTestmode ? t('ON') : t('OFF'),
      domain: action.site?.domain || t('This website')
    }
  })), willSwitchToPrimaryAccount && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      mt: 3,
      color: 'warning.main'
    }
  }, t('Approving will also switch to your primary account, as Fireblocks-imported accounts are not supported in testnet mode at the moment.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-end',
      flexGrow: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    color: "secondary",
    "data-testid": "transaction-reject-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
    onClick: () => {
      cancelHandler();
      window.close();
    }
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    "data-testid": "transaction-approve-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
    onClick: () => {
      updateMessage({
        status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
        id: requestId
      });
    },
    width: "168px"
  }, t('Approve'))));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FwcHJvdmVBY3Rpb25fU2V0RGV2ZWxvcGVyTW9kZV90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUE0RDtBQUVyRCxNQUFNRSxVQUFVLEdBQUdELHVFQUFNLENBQUNELDhEQUFLLENBQXVCO0FBQzdEO0FBQ0E7QUFDQSxzQkFBc0IsQ0FBQztFQUFFRztBQUFNLENBQUMsS0FBS0EsS0FBSyxDQUFDQyxPQUFPLENBQUNDLFVBQVUsQ0FBQ0MsS0FBTTtBQUNwRTtBQUNBO0FBQ0E7QUFDQSxZQUFZLENBQUM7RUFBRUM7QUFBTyxDQUFDLEtBQUtBLE1BQU0sSUFBSSxPQUFRO0FBQzlDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWeUY7QUFRekM7QUFDc0I7QUFDQztBQUNhO0FBQzVCO0FBSWhCO0FBQzZCO0FBQ1U7QUE0QnpFLFNBQVNhLGdCQUFnQkEsQ0FDOUJDLFFBQWdCLEVBQ2hCQyxlQUF3QixHQUFHLEtBQUssRUFDNkI7RUFDN0QsTUFBTTtJQUFFQztFQUFRLENBQUMsR0FBR1osc0ZBQW9CLEVBQUU7RUFDMUMsTUFBTWEsY0FBYyxHQUFHUCw2RkFBNkIsQ0FDbERELG9GQUF3QixDQUN6QjtFQUNELE1BQU07SUFBRVU7RUFBUyxDQUFDLEdBQUdSLG9GQUFtQixFQUFFO0VBQzFDLE1BQU0sQ0FBQ1MsTUFBTSxFQUFFQyxTQUFTLENBQUMsR0FBR2IsK0NBQVEsRUFBc0M7RUFDMUUsTUFBTSxDQUFDYyxLQUFLLEVBQUVDLFFBQVEsQ0FBQyxHQUFHZiwrQ0FBUSxDQUFTLEVBQUUsQ0FBQztFQUU5QyxNQUFNZ0IsWUFBK0QsR0FDbkVsQixrREFBVyxDQUNULE9BQU9tQixNQUFNLEVBQUVDLHFCQUFxQixLQUFLO0lBQ3ZDO0lBQ0E7SUFDQUwsU0FBUyxDQUFFTSxjQUFjLElBQUs7TUFDNUIsSUFBSSxDQUFDQSxjQUFjLEVBQUU7UUFDbkI7TUFDRjs7TUFFQTtNQUNBLElBQUl6Qiw4RkFBcUIsQ0FBQ3lCLGNBQWMs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QU0sQ0FBQ1UsbUJBQW1CLENBQUMsUUFBUSxFQUFFRixPQUFPLENBQUM7SUFDL0MsQ0FBQyxDQUNGLEVBQ0RILHNEQUFnQixDQUNiRyxPQUFPLElBQUs7TUFDWFIsTUFBTSxDQUFDUyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRUQsT0FBTyxDQUFDO0lBQ3RELENBQUMsRUFDQUEsT0FBTyxJQUFLO01BQ1hSLE1BQU0sQ0FBQ1UsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUVGLE9BQU8sQ0FBQztJQUN6RCxDQUFDLENBQ0YsQ0FBQ0csSUFBSSxDQUNKUiw0Q0FBTSxDQUFDLE1BQU07TUFDWCxPQUFPUyxRQUFRLENBQUNDLGVBQWUsS0FBSyxRQUFRO0lBQzlDLENBQUMsQ0FBQyxDQUNILENBQ0YsQ0FDRUYsSUFBSSxDQUFDUCwyQ0FBSyxFQUFFLENBQUMsQ0FDYlUsU0FBUyxDQUFDLE1BQU07TUFDZjtNQUNBLElBQUkzRyxjQUFjLEVBQUU7UUFDbEJxQixhQUFhLEVBQUU7TUFDakI7SUFDRixDQUFDLENBQUM7SUFFSixPQUFPLE1BQU07TUFDWCtFLFlBQVksRUFBRVEsV0FBVyxFQUFFO0lBQzdCLENBQUM7RUFDSCxDQUFDLEVBQUUsQ0FBQ3ZGLGFBQWEsRUFBRXJCLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9TaXRlQXZhdGFyLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VXaWxsU3dpdGNoVG9QcmltYXJ5QWNjb3VudC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vU2V0RGV2ZWxvcGVyTW9kZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9hY3Rpb25zL2dldFVwZGF0ZWRBY3Rpb25EYXRhLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBzdHlsZWQgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgU2l0ZUF2YXRhciA9IHN0eWxlZChTdGFjayk8eyBtYXJnaW4/OiBzdHJpbmcgfT5gXG4gIHdpZHRoOiA4MHB4O1xuICBoZWlnaHQ6IDgwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyfTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgbWFyZ2luOiAkeyh7IG1hcmdpbiB9KSA9PiBtYXJnaW4gPz8gJzhweCAwJ307XG5gO1xuIiwiaW1wb3J0IHsgRXh0ZW5zaW9uUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9leHRlbnNpb25Db25uZWN0aW9uL21vZGVscyc7XG5pbXBvcnQgeyBHZXRBY3Rpb25IYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvaGFuZGxlcnMvZ2V0QWN0aW9ucyc7XG5pbXBvcnQgeyBVcGRhdGVBY3Rpb25IYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvaGFuZGxlcnMvdXBkYXRlQWN0aW9uJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uVXBkYXRlLFxuICBNdWx0aVR4QWN0aW9uLFxuICBpc0JhdGNoQXBwcm92YWxBY3Rpb24sXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyB1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4gfSBmcm9tICdAc3JjL3V0aWxzL3VzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbic7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIENvbnRleHRDb250YWluZXIsXG4gIHVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyLFxufSBmcm9tICcuL3VzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyJztcbmltcG9ydCB7IHVzZUFwcHJvdmFsc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FwcHJvdmFsc1Byb3ZpZGVyJztcbmltcG9ydCB7IGdldFVwZGF0ZWRTaWduaW5nRGF0YSB9IGZyb20gJ0BzcmMvdXRpbHMvYWN0aW9ucy9nZXRVcGRhdGVkQWN0aW9uRGF0YSc7XG5cbnR5cGUgQWN0aW9uVHlwZTxJc0JhdGNoQXBwcm92YWw+ID0gSXNCYXRjaEFwcHJvdmFsIGV4dGVuZHMgdHJ1ZVxuICA/IE11bHRpVHhBY3Rpb25cbiAgOiBBY3Rpb247XG5cbnR5cGUgQWN0aW9uVXBkYXRlcjxUIGV4dGVuZHMgQWN0aW9uIHwgTXVsdGlUeEFjdGlvbiB8IHVuZGVmaW5lZD4gPSAoXG4gIHBhcmFtczogQWN0aW9uVXBkYXRlPFxuICAgIFBhcnRpYWw8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gPyBUWydkaXNwbGF5RGF0YSddIDogbmV2ZXI+XG4gID4sXG4gIHNob3VsZFdhaXRGb3JSZXNwb25zZT86IGJvb2xlYW4sXG4pID0+IFByb21pc2U8Ym9vbGVhbj47XG5cbnR5cGUgSG9va1Jlc3VsdDxUIGV4dGVuZHMgQWN0aW9uIHwgTXVsdGlUeEFjdGlvbiB8IHVuZGVmaW5lZD4gPSB7XG4gIGFjdGlvbjogVDtcbiAgdXBkYXRlQWN0aW9uOiBBY3Rpb25VcGRhdGVyPFQ+O1xuICBlcnJvcjogc3RyaW5nO1xuICBjYW5jZWxIYW5kbGVyOiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb248RGlzcGxheURhdGEgPSBhbnk+KFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw/OiBmYWxzZSxcbik6IEhvb2tSZXN1bHQ8QWN0aW9uPERpc3BsYXlEYXRhPj47XG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwcm92ZUFjdGlvbihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsPzogdHJ1ZSxcbik6IEhvb2tSZXN1bHQ8TXVsdGlUeEFjdGlvbj47XG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwcm92ZUFjdGlvbjxEaXNwbGF5RGF0YSA9IGFueT4oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbDogYm9vbGVhbiA9IGZhbHNlLFxuKTogSG9va1Jlc3VsdDxBY3Rpb248RGlzcGxheURhdGE+IHwgTXVsdGlUeEFjdGlvbiB8IHVuZGVmaW5lZD4ge1xuICBjb25zdCB7IHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuICBjb25zdCB7IGFwcHJvdmFsIH0gPSB1c2VBcHByb3ZhbHNDb250ZXh0KCk7XG4gIGNvbnN0IFthY3Rpb24sIHNldEFjdGlvbl0gPSB1c2VTdGF0ZTxBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+PigpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuXG4gIGNvbnN0IHVwZGF0ZUFjdGlvbjogQWN0aW9uVXBkYXRlcjxBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+PiA9XG4gICAgdXNlQ2FsbGJhY2soXG4gICAgICBhc3luYyAocGFyYW1zLCBzaG91bGRXYWl0Rm9yUmVzcG9uc2UpID0+IHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byB1cGRhdGUgdGhlIHN0YXR1cyBhIGJpdCBmYXN0ZXIgZm9yIHNtb290aGVyIFVYLlxuICAgICAgICAvLyB1c2UgZnVuY3Rpb24gdG8gYXZvaWQgYGFjdGlvbmAgYXMgYSBkZXBlbmRlbmN5IGFuZCB0aHVzIGluZmluaXRlIGxvb3BzXG4gICAgICAgIHNldEFjdGlvbigocHJldkFjdGlvbkRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIXByZXZBY3Rpb25EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRm9yIE11bHRpVHhBY3Rpb24sIHdlIGRvbid0IGFsbG93IGFueSB1cGRhdGVzIGJlc2lkZXMgdGhlIHN0YXR1cy5cbiAgICAgICAgICBpZiAoaXNCYXRjaEFwcHJvdmFsQWN0aW9uKHByZXZBY3Rpb25EYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ucHJldkFjdGlvbkRhdGEsXG4gICAgICAgICAgICAgIHN0YXR1czogcGFyYW1zLnN0YXR1cyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiBwYXJhbXMuc3RhdHVzLFxuICAgICAgICAgICAgZGlzcGxheURhdGE6IHtcbiAgICAgICAgICAgICAgLi4ucHJldkFjdGlvbkRhdGEuZGlzcGxheURhdGEsXG4gICAgICAgICAgICAgIC4uLnBhcmFtcy5kaXNwbGF5RGF0YSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaWduaW5nRGF0YTogZ2V0VXBkYXRlZFNpZ25pbmdEYXRhKFxuICAgICAgICAgICAgICBwcmV2QWN0aW9uRGF0YS5zaWduaW5nRGF0YSxcbiAgICAgICAgICAgICAgcGFyYW1zLnNpZ25pbmdEYXRhLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzaG91bGRDbG9zZUFmdGVyVXBkYXRlID1cbiAgICAgICAgICBpc0NvbmZpcm1Qb3B1cCAmJiBwYXJhbXMuc3RhdHVzICE9PSBBY3Rpb25TdGF0dXMuUEVORElORztcblxuICAgICAgICByZXR1cm4gcmVxdWVzdDxVcGRhdGVBY3Rpb25IYW5kbGVyPih7XG4gICAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LkFDVElPTl9VUERBVEUsXG4gICAgICAgICAgcGFyYW1zOiBbcGFyYW1zLCBzaG91bGRXYWl0Rm9yUmVzcG9uc2VdLFxuICAgICAgICB9KS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICBpZiAoc2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSkge1xuICAgICAgICAgICAgZ2xvYmFsVGhpcy5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgW3JlcXVlc3QsIGlzQ29uZmlybVBvcHVwXSxcbiAgICApO1xuXG4gIGNvbnN0IGNhbmNlbEhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoKSA9PlxuICAgICAgdXBkYXRlQWN0aW9uKHtcbiAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuRVJST1JfVVNFUl9DQU5DRUxFRCxcbiAgICAgICAgaWQ6IGFjdGlvbklkLFxuICAgICAgfSksXG4gICAgW2FjdGlvbklkLCB1cGRhdGVBY3Rpb25dLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICByZXF1ZXN0PEdldEFjdGlvbkhhbmRsZXI+KHtcbiAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LkFDVElPTl9HRVQsXG4gICAgICAgIHBhcmFtczogW2FjdGlvbklkXSxcbiAgICAgIH0pLnRoZW4oKGEpID0+IHtcbiAgICAgICAgaWYgKGlzQmF0Y2hBcHByb3ZhbCAmJiAhaXNCYXRjaEFwcHJvdmFsQWN0aW9uKGEpKSB7XG4gICAgICAgICAgc2V0RXJyb3IoJ0V4cGVjdGVkIGEgYmF0Y2ggYXBwcm92YWwgYWN0aW9uJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzQmF0Y2hBcHByb3ZhbCAmJiBpc0JhdGNoQXBwcm92YWxBY3Rpb24oYSkpIHtcbiAgICAgICAgICBzZXRFcnJvcignRXhwZWN0ZWQgYSBzaW5nbGUgYXBwcm92YWwgYWN0aW9uJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0QWN0aW9uKGEgYXMgQWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoYXBwcm92YWw/LmFjdGlvbi5hY3Rpb25JZCA9PT0gYWN0aW9uSWQpIHtcbiAgICAgIHNldEFjdGlvbihhcHByb3ZhbC5hY3Rpb24gYXMgQWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPik7XG4gICAgfVxuICB9LCBbYWN0aW9uSWQsIHJlcXVlc3QsIGFwcHJvdmFsLCBpc0NvbmZpcm1Qb3B1cCwgaXNCYXRjaEFwcHJvdmFsXSk7XG5cbiAgdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuKGNhbmNlbEhhbmRsZXIpO1xuXG4gIHJldHVybiB7IGFjdGlvbiwgdXBkYXRlQWN0aW9uLCBlcnJvciwgY2FuY2VsSGFuZGxlciB9O1xufVxuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5cbi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGdldCB0aGUgaWQgb2YgYSB0cmFuc2FjdGlvbiBvciBtZXNzYWdlIHRoYXRcbiAqIGhhcyBiZWVuIHB1dCBpbnRvIGxvY2Fsc3RvcmFnZSBhbmQgdG8gYmUgdXNlZCBhY3Jvc3MgbXVsdGlwbGVcbiAqIGNvbnRleHRzLiBXZSBncmFiIHRoZSBxdWVyeSBwYXJhbSBhbmQgdXNlIHRoYXQgdG8gZ2V0IHRoZSBpdGVtIG91dCBvZiBzdG9yYWdlLlxuICpcbiAqIEByZXR1cm5zIGlkIGZyb20gdGhlIHF1ZXJ5IHBhcmFtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VHZXRSZXF1ZXN0SWQoKSB7XG4gIGNvbnN0IGxvY2F0aW9uID0gdXNlTG9jYXRpb24oKTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3Qgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2ggPz8gJycpO1xuICAgIHJldHVybiBzZWFyY2hQYXJhbXMuZ2V0KCdhY3Rpb25JZCcpID8/ICcnO1xuICB9LCBbbG9jYXRpb24uc2VhcmNoXSk7XG59XG4iLCJpbXBvcnQgeyBBY2NvdW50VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7IGlzUHJvZHVjdGlvbkJ1aWxkIH0gZnJvbSAnQHNyYy91dGlscy9lbnZpcm9ubWVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZVdpbGxTd2l0Y2hUb1ByaW1hcnlBY2NvdW50KFxuICBpc1N3aXRjaGluZ1RvVGVzdG5ldE1vZGU6IGJvb2xlYW4sXG4pIHtcbiAgY29uc3Qge1xuICAgIGFjY291bnRzOiB7IGFjdGl2ZTogYWN0aXZlQWNjb3VudCB9LFxuICB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG5cbiAgY29uc3QgaXNGaXJlYmxvY2tzQWNjb3VudCA9IGFjdGl2ZUFjY291bnQ/LnR5cGUgPT09IEFjY291bnRUeXBlLkZJUkVCTE9DS1M7XG5cbiAgcmV0dXJuIEJvb2xlYW4oXG4gICAgaXNQcm9kdWN0aW9uQnVpbGQoKSAmJiBpc1N3aXRjaGluZ1RvVGVzdG5ldE1vZGUgJiYgaXNGaXJlYmxvY2tzQWNjb3VudCxcbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZUdldFJlcXVlc3RJZCB9IGZyb20gJ0BzcmMvaG9va3MvdXNlR2V0UmVxdWVzdElkJztcbmltcG9ydCB7IEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyBUb2tlbkljb24gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1Rva2VuSWNvbic7XG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7IHVzZUFwcHJvdmVBY3Rpb24gfSBmcm9tICcuLi8uLi9ob29rcy91c2VBcHByb3ZlQWN0aW9uJztcbmltcG9ydCB7IFRyYW5zLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDaXJjdWxhclByb2dyZXNzLFxuICBHbG9iZUljb24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgU2l0ZUF2YXRhciB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vU2l0ZUF2YXRhcic7XG5pbXBvcnQgdXNlV2lsbFN3aXRjaFRvUHJpbWFyeUFjY291bnQgZnJvbSAnQHNyYy9ob29rcy91c2VXaWxsU3dpdGNoVG9QcmltYXJ5QWNjb3VudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXREZXZlbG9wZXJNb2RlKCkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHJlcXVlc3RJZCA9IHVzZUdldFJlcXVlc3RJZCgpO1xuXG4gIGNvbnN0IHtcbiAgICBhY3Rpb24sXG4gICAgdXBkYXRlQWN0aW9uOiB1cGRhdGVNZXNzYWdlLFxuICAgIGNhbmNlbEhhbmRsZXIsXG4gIH0gPSB1c2VBcHByb3ZlQWN0aW9uKHJlcXVlc3RJZCk7XG5cbiAgY29uc3Qgd2lsbFN3aXRjaFRvUHJpbWFyeUFjY291bnQgPSB1c2VXaWxsU3dpdGNoVG9QcmltYXJ5QWNjb3VudChcbiAgICBhY3Rpb24/LmRpc3BsYXlEYXRhLmlzVGVzdG1vZGUsXG4gICk7XG5cbiAgaWYgKCFhY3Rpb24pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPENpcmN1bGFyUHJvZ3Jlc3MgLz5cbiAgICAgIDwvU3RhY2s+XG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IG5ldHdvcms6IE5ldHdvcmsgPSBhY3Rpb24uZGlzcGxheURhdGE7XG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IHB5OiAxLCBweDogMiwgd2lkdGg6IDEsIGhlaWdodDogMSB9fT5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgcHg6IDIsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTaXRlQXZhdGFyIHN4PXt7IG1iOiAzIH19PlxuICAgICAgICAgIDxUb2tlbkljb24gaGVpZ2h0PVwiNDhweFwiIHdpZHRoPVwiNDhweFwiIHNyYz17bmV0d29yaz8ubG9nb1VyaX0+XG4gICAgICAgICAgICA8R2xvYmVJY29uIHNpemU9ezQ4fSAvPlxuICAgICAgICAgIDwvVG9rZW5JY29uPlxuICAgICAgICA8L1NpdGVBdmF0YXI+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHN4PXt7IHBiOiAyIH19IHZhcmlhbnQ9XCJoNFwiPlxuICAgICAgICAgIHthY3Rpb24uZGlzcGxheURhdGE/LmlzVGVzdG1vZGUgPyB0KCdBY3RpdmF0ZScpIDogdCgnRGVhY3RpdmF0ZScpfXsnICd9XG4gICAgICAgICAge3QoJ1Rlc3RuZXQgTW9kZT8nKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHN4PXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIG1heFdpZHRoOiAxLCB3b3JkV3JhcDogJ2JyZWFrLXdvcmQnIH19XG4gICAgICAgICAgdmFyaWFudD1cImJvZHkxXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxUcmFuc1xuICAgICAgICAgICAgaTE4bktleT17J3t7ZG9tYWlufX0gaXMgcmVxdWVzdGluZyB0byB0dXJuIFRlc3RuZXQgTW9kZSB7e21vZGV9fSd9XG4gICAgICAgICAgICB2YWx1ZXM9e3tcbiAgICAgICAgICAgICAgbW9kZTogYWN0aW9uLmRpc3BsYXlEYXRhPy5pc1Rlc3Rtb2RlID8gdCgnT04nKSA6IHQoJ09GRicpLFxuICAgICAgICAgICAgICBkb21haW46IGFjdGlvbi5zaXRlPy5kb21haW4gfHwgdCgnVGhpcyB3ZWJzaXRlJyksXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAge3dpbGxTd2l0Y2hUb1ByaW1hcnlBY2NvdW50ICYmIChcbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIHN4PXt7IG10OiAzLCBjb2xvcjogJ3dhcm5pbmcubWFpbicgfX0+XG4gICAgICAgICAgICB7dChcbiAgICAgICAgICAgICAgJ0FwcHJvdmluZyB3aWxsIGFsc28gc3dpdGNoIHRvIHlvdXIgcHJpbWFyeSBhY2NvdW50LCBhcyBGaXJlYmxvY2tzLWltcG9ydGVkIGFjY291bnRzIGFyZSBub3Qgc3VwcG9ydGVkIGluIHRlc3RuZXQgbW9kZSBhdCB0aGUgbW9tZW50LicsXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBnYXA6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmFuc2FjdGlvbi1yZWplY3QtYnRuXCJcbiAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgIGRpc2FibGVkPXthY3Rpb24uc3RhdHVzID09PSBBY3Rpb25TdGF0dXMuU1VCTUlUVElOR31cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBjYW5jZWxIYW5kbGVyKCk7XG4gICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ1JlamVjdCcpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwidHJhbnNhY3Rpb24tYXBwcm92ZS1idG5cIlxuICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgZGlzYWJsZWQ9e2FjdGlvbi5zdGF0dXMgPT09IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZU1lc3NhZ2Uoe1xuICAgICAgICAgICAgICBzdGF0dXM6IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HLFxuICAgICAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICB3aWR0aD1cIjE2OHB4XCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdBcHByb3ZlJyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgU2lnbmluZ0RhdGEgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhID0gKFxuICBvbGRTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuICBuZXdTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuKTogU2lnbmluZ0RhdGEgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoIW9sZFNpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG5ld1NpZ25pbmdEYXRhO1xuICB9IGVsc2UgaWYgKCFuZXdTaWduaW5nRGF0YSkge1xuICAgIHJldHVybiBvbGRTaWduaW5nRGF0YTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub2xkU2lnbmluZ0RhdGEsXG4gICAgLi4ubmV3U2lnbmluZ0RhdGEsXG4gIH07XG59O1xuIiwiaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgZnJvbUV2ZW50UGF0dGVybiwgbWVyZ2UgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICAgZnJvbUV2ZW50UGF0dGVybihcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLnBpcGUoXG4gICAgICAgIGZpbHRlcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbic7XG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIE9ubHkgY2xvc2UgZm9yIHBvcHVwIHdpbmRvd3MuIFRoZSBleHRlbnNpb24gVUkgc2hvdWxkIG5vdCByZWFjdCB0aGlzIHdheS5cbiAgICAgICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW2NhbmNlbEhhbmRsZXIsIGlzQ29uZmlybVBvcHVwXSk7XG59XG4iXSwibmFtZXMiOlsiU3RhY2siLCJzdHlsZWQiLCJTaXRlQXZhdGFyIiwidGhlbWUiLCJwYWxldHRlIiwiYmFja2dyb3VuZCIsInBhcGVyIiwibWFyZ2luIiwiRXh0ZW5zaW9uUmVxdWVzdCIsImlzQmF0Y2hBcHByb3ZhbEFjdGlvbiIsIkFjdGlvblN0YXR1cyIsInVzZUNvbm5lY3Rpb25Db250ZXh0IiwidXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuIiwidXNlQ2FsbGJhY2siLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkNvbnRleHRDb250YWluZXIiLCJ1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lciIsInVzZUFwcHJvdmFsc0NvbnRleHQiLCJnZXRVcGRhdGVkU2lnbmluZ0RhdGEiLCJ1c2VBcHByb3ZlQWN0aW9uIiwiYWN0aW9uSWQiLCJpc0JhdGNoQXBwcm92YWwiLCJyZXF1ZXN0IiwiaXNDb25maXJtUG9wdXAiLCJDT05GSVJNIiwiYXBwcm92YWwiLCJhY3Rpb24iLCJzZXRBY3Rpb24iLCJlcnJvciIsInNldEVycm9yIiwidXBkYXRlQWN0aW9uIiwicGFyYW1zIiwic2hvdWxkV2FpdEZvclJlc3BvbnNlIiwicHJldkFjdGlvbkRhdGEiLCJzdGF0dXMiLCJkaXNwbGF5RGF0YSIsInNpZ25pbmdEYXRhIiwic2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSIsIlBFTkRJTkciLCJtZXRob2QiLCJBQ1RJT05fVVBEQVRFIiwiZmluYWxseSIsImdsb2JhbFRoaXMiLCJjbG9zZSIsImNhbmNlbEhhbmRsZXIiLCJFUlJPUl9VU0VSX0NBTkNFTEVEIiwiaWQiLCJBQ1RJT05fR0VUIiwidGhlbiIsImEiLCJ1c2VNZW1vIiwidXNlTG9jYXRpb24iLCJ1c2VHZXRSZXF1ZXN0SWQiLCJsb2NhdGlvbiIsInNlYXJjaFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInNlYXJjaCIsImdldCIsIkFjY291bnRUeXBlIiwidXNlQWNjb3VudHNDb250ZXh0IiwiaXNQcm9kdWN0aW9uQnVpbGQiLCJ1c2VXaWxsU3dpdGNoVG9QcmltYXJ5QWNjb3VudCIsImlzU3dpdGNoaW5nVG9UZXN0bmV0TW9kZSIsImFjY291bnRzIiwiYWN0aXZlIiwiYWN0aXZlQWNjb3VudCIsImlzRmlyZWJsb2Nrc0FjY291bnQiLCJ0eXBlIiwiRklSRUJMT0NLUyIsIkJvb2xlYW4iLCJUb2tlbkljb24iLCJUcmFucyIsInVzZVRyYW5zbGF0aW9uIiwiQnV0dG9uIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIkdsb2JlSWNvbiIsIlR5cG9ncmFwaHkiLCJTZXREZXZlbG9wZXJNb2RlIiwidCIsInJlcXVlc3RJZCIsInVwZGF0ZU1lc3NhZ2UiLCJ3aWxsU3dpdGNoVG9QcmltYXJ5QWNjb3VudCIsImlzVGVzdG1vZGUiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzeCIsIndpZHRoIiwiaGVpZ2h0IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwibmV0d29yayIsInB5IiwicHgiLCJmbGV4R3JvdyIsIm1iIiwic3JjIiwibG9nb1VyaSIsInNpemUiLCJwYiIsInZhcmlhbnQiLCJ0ZXh0QWxpZ24iLCJtYXhXaWR0aCIsIndvcmRXcmFwIiwiaTE4bktleSIsInZhbHVlcyIsIm1vZGUiLCJkb21haW4iLCJzaXRlIiwibXQiLCJjb2xvciIsImZsZXhEaXJlY3Rpb24iLCJnYXAiLCJmdWxsV2lkdGgiLCJkaXNhYmxlZCIsIlNVQk1JVFRJTkciLCJvbkNsaWNrIiwid2luZG93Iiwib2xkU2lnbmluZ0RhdGEiLCJuZXdTaWduaW5nRGF0YSIsImZpbHRlciIsImZpcnN0IiwiZnJvbUV2ZW50UGF0dGVybiIsIm1lcmdlIiwic3Vic2NyaXB0aW9uIiwiaGFuZGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicGlwZSIsImRvY3VtZW50IiwidmlzaWJpbGl0eVN0YXRlIiwic3Vic2NyaWJlIiwidW5zdWJzY3JpYmUiXSwic291cmNlUm9vdCI6IiJ9