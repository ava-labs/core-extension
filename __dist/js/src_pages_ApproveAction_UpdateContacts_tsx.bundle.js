"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ApproveAction_UpdateContacts_tsx"],{

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

/***/ "./src/pages/ApproveAction/UpdateContacts.tsx":
/*!****************************************************!*\
  !*** ./src/pages/ApproveAction/UpdateContacts.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UpdateContacts": () => (/* binding */ UpdateContacts)
/* harmony export */ });
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_components_settings_components_ContactInfo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/settings/components/ContactInfo */ "./src/components/settings/components/ContactInfo.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/SiteAvatar */ "./src/components/common/SiteAvatar.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function UpdateContacts({
  method
}) {
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
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.CircularProgress, null));
  }
  const translatedMethod = {
    create: t('Create'),
    update: t('Update'),
    remove: t('Remove')
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      py: 1,
      px: 2,
      width: 1,
      height: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      height: 1,
      width: 1,
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_4__.SiteAvatar, {
    sx: {
      mb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ContactsIcon, {
    size: 48
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      pb: 2
    },
    variant: "h4"
  }, translatedMethod[method], " ", t('Contact?')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      textAlign: 'center',
      maxWidth: 1,
      wordWrap: 'break-word'
    },
    variant: "body1"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_7__.Trans, {
    i18nKey: '{{domain}} is requesting to {{method}} a contact:',
    values: {
      domain: action.site?.domain || t('This website'),
      method: translatedMethod[method].toLowerCase()
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: 1,
      mt: 3
    }
  }, method === 'update' && action.displayData?.existing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "body1"
  }, t('From:')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Card, {
    sx: {
      width: 1,
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_settings_components_ContactInfo__WEBPACK_IMPORTED_MODULE_3__.ContactInfo, {
    contact: action.displayData?.existing
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "body1",
    sx: {
      mt: 2
    }
  }, t('To:')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Card, {
    sx: {
      width: 1,
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_settings_components_ContactInfo__WEBPACK_IMPORTED_MODULE_3__.ContactInfo, {
    contact: action.displayData?.contact
  }))) : /*#__PURE__*/React.createElement(_src_components_settings_components_ContactInfo__WEBPACK_IMPORTED_MODULE_3__.ContactInfo, {
    contact: action.displayData?.contact
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      justifyContent: 'space-between',
      pt: 3,
      pb: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    color: "secondary",
    "data-testid": "transaction-reject-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
    onClick: () => {
      cancelHandler();
      window.close();
    }
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    "data-testid": "transaction-approve-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING || !!action.error,
    onClick: () => {
      updateMessage({
        status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
        id: requestId
      });
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FwcHJvdmVBY3Rpb25fVXBkYXRlQ29udGFjdHNfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBNEQ7QUFFckQsTUFBTUUsVUFBVSxHQUFHRCx1RUFBTSxDQUFDRCw4REFBSyxDQUF1QjtBQUM3RDtBQUNBO0FBQ0Esc0JBQXNCLENBQUM7RUFBRUc7QUFBTSxDQUFDLEtBQUtBLEtBQUssQ0FBQ0MsT0FBTyxDQUFDQyxVQUFVLENBQUNDLEtBQU07QUFDcEU7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDO0VBQUVDO0FBQU8sQ0FBQyxLQUFLQSxNQUFNLElBQUksT0FBUTtBQUM5QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVnlGO0FBUXpDO0FBQ3NCO0FBQ0M7QUFDYTtBQUM1QjtBQUloQjtBQUM2QjtBQUNVO0FBNEJ6RSxTQUFTYSxnQkFBZ0JBLENBQzlCQyxRQUFnQixFQUNoQkMsZUFBd0IsR0FBRyxLQUFLLEVBQzZCO0VBQzdELE1BQU07SUFBRUM7RUFBUSxDQUFDLEdBQUdaLHNGQUFvQixFQUFFO0VBQzFDLE1BQU1hLGNBQWMsR0FBR1AsNkZBQTZCLENBQ2xERCxvRkFBd0IsQ0FDekI7RUFDRCxNQUFNO0lBQUVVO0VBQVMsQ0FBQyxHQUFHUixvRkFBbUIsRUFBRTtFQUMxQyxNQUFNLENBQUNTLE1BQU0sRUFBRUMsU0FBUyxDQUFDLEdBQUdiLCtDQUFRLEVBQXNDO0VBQzFFLE1BQU0sQ0FBQ2MsS0FBSyxFQUFFQyxRQUFRLENBQUMsR0FBR2YsK0NBQVEsQ0FBUyxFQUFFLENBQUM7RUFFOUMsTUFBTWdCLFlBQStELEdBQ25FbEIsa0RBQVcsQ0FDVCxPQUFPbUIsTUFBTSxFQUFFQyxxQkFBcUIsS0FBSztJQUN2QztJQUNBO0lBQ0FMLFNBQVMsQ0FBRU0sY0FBYyxJQUFLO01BQzVCLElBQUksQ0FBQ0EsY0FBYyxFQUFFO1FBQ25CO01BQ0Y7O01BRUE7TUFDQSxJQUFJekIsOEZBQXFCLENBQUN5QixjQUFjLENB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YUFBYSxFQUFFckIsY0FBYyxDQUFDLENBQUM7QUFDckMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1NpdGVBdmF0YXIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlQXBwcm92ZUFjdGlvbi50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUdldFJlcXVlc3RJZC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vVXBkYXRlQ29udGFjdHMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvYWN0aW9ucy9nZXRVcGRhdGVkQWN0aW9uRGF0YS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL3VzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgc3R5bGVkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IFNpdGVBdmF0YXIgPSBzdHlsZWQoU3RhY2spPHsgbWFyZ2luPzogc3RyaW5nIH0+YFxuICB3aWR0aDogODBweDtcbiAgaGVpZ2h0OiA4MHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLnBhbGV0dGUuYmFja2dyb3VuZC5wYXBlcn07XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIG1hcmdpbjogJHsoeyBtYXJnaW4gfSkgPT4gbWFyZ2luID8/ICc4cHggMCd9O1xuYDtcbiIsImltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgR2V0QWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL2hhbmRsZXJzL2dldEFjdGlvbnMnO1xuaW1wb3J0IHsgVXBkYXRlQWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL2hhbmRsZXJzL3VwZGF0ZUFjdGlvbic7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblVwZGF0ZSxcbiAgTXVsdGlUeEFjdGlvbixcbiAgaXNCYXRjaEFwcHJvdmFsQWN0aW9uLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgQWN0aW9uU3RhdHVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IHVzZUNvbm5lY3Rpb25Db250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db25uZWN0aW9uUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuIH0gZnJvbSAnQHNyYy91dGlscy91c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4nO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBDb250ZXh0Q29udGFpbmVyLFxuICB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcixcbn0gZnJvbSAnLi91c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcic7XG5pbXBvcnQgeyB1c2VBcHByb3ZhbHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BcHByb3ZhbHNQcm92aWRlcic7XG5pbXBvcnQgeyBnZXRVcGRhdGVkU2lnbmluZ0RhdGEgfSBmcm9tICdAc3JjL3V0aWxzL2FjdGlvbnMvZ2V0VXBkYXRlZEFjdGlvbkRhdGEnO1xuXG50eXBlIEFjdGlvblR5cGU8SXNCYXRjaEFwcHJvdmFsPiA9IElzQmF0Y2hBcHByb3ZhbCBleHRlbmRzIHRydWVcbiAgPyBNdWx0aVR4QWN0aW9uXG4gIDogQWN0aW9uO1xuXG50eXBlIEFjdGlvblVwZGF0ZXI8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+ID0gKFxuICBwYXJhbXM6IEFjdGlvblVwZGF0ZTxcbiAgICBQYXJ0aWFsPFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uID8gVFsnZGlzcGxheURhdGEnXSA6IG5ldmVyPlxuICA+LFxuICBzaG91bGRXYWl0Rm9yUmVzcG9uc2U/OiBib29sZWFuLFxuKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuXG50eXBlIEhvb2tSZXN1bHQ8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+ID0ge1xuICBhY3Rpb246IFQ7XG4gIHVwZGF0ZUFjdGlvbjogQWN0aW9uVXBkYXRlcjxUPjtcbiAgZXJyb3I6IHN0cmluZztcbiAgY2FuY2VsSGFuZGxlcjogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uPERpc3BsYXlEYXRhID0gYW55PihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsPzogZmFsc2UsXG4pOiBIb29rUmVzdWx0PEFjdGlvbjxEaXNwbGF5RGF0YT4+O1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb24oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbD86IHRydWUsXG4pOiBIb29rUmVzdWx0PE11bHRpVHhBY3Rpb24+O1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb248RGlzcGxheURhdGEgPSBhbnk+KFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw6IGJvb2xlYW4gPSBmYWxzZSxcbik6IEhvb2tSZXN1bHQ8QWN0aW9uPERpc3BsYXlEYXRhPiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBjb25zdCBpc0NvbmZpcm1Qb3B1cCA9IHVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyKFxuICAgIENvbnRleHRDb250YWluZXIuQ09ORklSTSxcbiAgKTtcbiAgY29uc3QgeyBhcHByb3ZhbCB9ID0gdXNlQXBwcm92YWxzQ29udGV4dCgpO1xuICBjb25zdCBbYWN0aW9uLCBzZXRBY3Rpb25dID0gdXNlU3RhdGU8QWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPj4oKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcblxuICBjb25zdCB1cGRhdGVBY3Rpb246IEFjdGlvblVwZGF0ZXI8QWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPj4gPVxuICAgIHVzZUNhbGxiYWNrKFxuICAgICAgYXN5bmMgKHBhcmFtcywgc2hvdWxkV2FpdEZvclJlc3BvbnNlKSA9PiB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gdXBkYXRlIHRoZSBzdGF0dXMgYSBiaXQgZmFzdGVyIGZvciBzbW9vdGhlciBVWC5cbiAgICAgICAgLy8gdXNlIGZ1bmN0aW9uIHRvIGF2b2lkIGBhY3Rpb25gIGFzIGEgZGVwZW5kZW5jeSBhbmQgdGh1cyBpbmZpbml0ZSBsb29wc1xuICAgICAgICBzZXRBY3Rpb24oKHByZXZBY3Rpb25EYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKCFwcmV2QWN0aW9uRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEZvciBNdWx0aVR4QWN0aW9uLCB3ZSBkb24ndCBhbGxvdyBhbnkgdXBkYXRlcyBiZXNpZGVzIHRoZSBzdGF0dXMuXG4gICAgICAgICAgaWYgKGlzQmF0Y2hBcHByb3ZhbEFjdGlvbihwcmV2QWN0aW9uRGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLFxuICAgICAgICAgICAgICBzdGF0dXM6IHBhcmFtcy5zdGF0dXMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YSxcbiAgICAgICAgICAgIHN0YXR1czogcGFyYW1zLnN0YXR1cyxcbiAgICAgICAgICAgIGRpc3BsYXlEYXRhOiB7XG4gICAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLmRpc3BsYXlEYXRhLFxuICAgICAgICAgICAgICAuLi5wYXJhbXMuZGlzcGxheURhdGEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lnbmluZ0RhdGE6IGdldFVwZGF0ZWRTaWduaW5nRGF0YShcbiAgICAgICAgICAgICAgcHJldkFjdGlvbkRhdGEuc2lnbmluZ0RhdGEsXG4gICAgICAgICAgICAgIHBhcmFtcy5zaWduaW5nRGF0YSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSA9XG4gICAgICAgICAgaXNDb25maXJtUG9wdXAgJiYgcGFyYW1zLnN0YXR1cyAhPT0gQWN0aW9uU3RhdHVzLlBFTkRJTkc7XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3Q8VXBkYXRlQWN0aW9uSGFuZGxlcj4oe1xuICAgICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5BQ1RJT05fVVBEQVRFLFxuICAgICAgICAgIHBhcmFtczogW3BhcmFtcywgc2hvdWxkV2FpdEZvclJlc3BvbnNlXSxcbiAgICAgICAgfSkuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHNob3VsZENsb3NlQWZ0ZXJVcGRhdGUpIHtcbiAgICAgICAgICAgIGdsb2JhbFRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIFtyZXF1ZXN0LCBpc0NvbmZpcm1Qb3B1cF0sXG4gICAgKTtcblxuICBjb25zdCBjYW5jZWxIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKCkgPT5cbiAgICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICAgIHN0YXR1czogQWN0aW9uU3RhdHVzLkVSUk9SX1VTRVJfQ0FOQ0VMRUQsXG4gICAgICAgIGlkOiBhY3Rpb25JZCxcbiAgICAgIH0pLFxuICAgIFthY3Rpb25JZCwgdXBkYXRlQWN0aW9uXSxcbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpc0NvbmZpcm1Qb3B1cCkge1xuICAgICAgcmVxdWVzdDxHZXRBY3Rpb25IYW5kbGVyPih7XG4gICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5BQ1RJT05fR0VULFxuICAgICAgICBwYXJhbXM6IFthY3Rpb25JZF0sXG4gICAgICB9KS50aGVuKChhKSA9PiB7XG4gICAgICAgIGlmIChpc0JhdGNoQXBwcm92YWwgJiYgIWlzQmF0Y2hBcHByb3ZhbEFjdGlvbihhKSkge1xuICAgICAgICAgIHNldEVycm9yKCdFeHBlY3RlZCBhIGJhdGNoIGFwcHJvdmFsIGFjdGlvbicpO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0JhdGNoQXBwcm92YWwgJiYgaXNCYXRjaEFwcHJvdmFsQWN0aW9uKGEpKSB7XG4gICAgICAgICAgc2V0RXJyb3IoJ0V4cGVjdGVkIGEgc2luZ2xlIGFwcHJvdmFsIGFjdGlvbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldEFjdGlvbihhIGFzIEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGFwcHJvdmFsPy5hY3Rpb24uYWN0aW9uSWQgPT09IGFjdGlvbklkKSB7XG4gICAgICBzZXRBY3Rpb24oYXBwcm92YWwuYWN0aW9uIGFzIEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4pO1xuICAgIH1cbiAgfSwgW2FjdGlvbklkLCByZXF1ZXN0LCBhcHByb3ZhbCwgaXNDb25maXJtUG9wdXAsIGlzQmF0Y2hBcHByb3ZhbF0pO1xuXG4gIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyKTtcblxuICByZXR1cm4geyBhY3Rpb24sIHVwZGF0ZUFjdGlvbiwgZXJyb3IsIGNhbmNlbEhhbmRsZXIgfTtcbn1cbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG4vKipcbiAqIFRoaXMgaXMgdXNlZCB0byBnZXQgdGhlIGlkIG9mIGEgdHJhbnNhY3Rpb24gb3IgbWVzc2FnZSB0aGF0XG4gKiBoYXMgYmVlbiBwdXQgaW50byBsb2NhbHN0b3JhZ2UgYW5kIHRvIGJlIHVzZWQgYWNyb3NzIG11bHRpcGxlXG4gKiBjb250ZXh0cy4gV2UgZ3JhYiB0aGUgcXVlcnkgcGFyYW0gYW5kIHVzZSB0aGF0IHRvIGdldCB0aGUgaXRlbSBvdXQgb2Ygc3RvcmFnZS5cbiAqXG4gKiBAcmV0dXJucyBpZCBmcm9tIHRoZSBxdWVyeSBwYXJhbVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlR2V0UmVxdWVzdElkKCkge1xuICBjb25zdCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uc2VhcmNoID8/ICcnKTtcbiAgICByZXR1cm4gc2VhcmNoUGFyYW1zLmdldCgnYWN0aW9uSWQnKSA/PyAnJztcbiAgfSwgW2xvY2F0aW9uLnNlYXJjaF0pO1xufVxuIiwiaW1wb3J0IHsgdXNlQXBwcm92ZUFjdGlvbiB9IGZyb20gJ0BzcmMvaG9va3MvdXNlQXBwcm92ZUFjdGlvbic7XG5pbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlR2V0UmVxdWVzdElkIH0gZnJvbSAnQHNyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQnO1xuaW1wb3J0IHsgQ29udGFjdEluZm8gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvc2V0dGluZ3MvY29tcG9uZW50cy9Db250YWN0SW5mbyc7XG5pbXBvcnQgeyBDb250YWN0IH0gZnJvbSAnQGF2YWxhYnMvdHlwZXMnO1xuaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIENhcmQsXG4gIENpcmN1bGFyUHJvZ3Jlc3MsXG4gIENvbnRhY3RzSWNvbixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBTaXRlQXZhdGFyIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9TaXRlQXZhdGFyJztcblxuZXhwb3J0IGZ1bmN0aW9uIFVwZGF0ZUNvbnRhY3RzKHtcbiAgbWV0aG9kLFxufToge1xuICBtZXRob2Q6ICdjcmVhdGUnIHwgJ3VwZGF0ZScgfCAncmVtb3ZlJztcbn0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCByZXF1ZXN0SWQgPSB1c2VHZXRSZXF1ZXN0SWQoKTtcblxuICBjb25zdCB7XG4gICAgYWN0aW9uLFxuICAgIHVwZGF0ZUFjdGlvbjogdXBkYXRlTWVzc2FnZSxcbiAgICBjYW5jZWxIYW5kbGVyLFxuICB9ID0gdXNlQXBwcm92ZUFjdGlvbjx7IGNvbnRhY3Q6IENvbnRhY3Q7IGV4aXN0aW5nPzogQ29udGFjdCB9PihyZXF1ZXN0SWQpO1xuXG4gIGlmICghYWN0aW9uKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDaXJjdWxhclByb2dyZXNzIC8+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH1cblxuICBjb25zdCB0cmFuc2xhdGVkTWV0aG9kID0ge1xuICAgIGNyZWF0ZTogdCgnQ3JlYXRlJyksXG4gICAgdXBkYXRlOiB0KCdVcGRhdGUnKSxcbiAgICByZW1vdmU6IHQoJ1JlbW92ZScpLFxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IHB5OiAxLCBweDogMiwgd2lkdGg6IDEsIGhlaWdodDogMSB9fT5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTaXRlQXZhdGFyIHN4PXt7IG1iOiAzIH19PlxuICAgICAgICAgIDxDb250YWN0c0ljb24gc2l6ZT17NDh9IC8+XG4gICAgICAgIDwvU2l0ZUF2YXRhcj5cbiAgICAgICAgPFR5cG9ncmFwaHkgc3g9e3sgcGI6IDIgfX0gdmFyaWFudD1cImg0XCI+XG4gICAgICAgICAge3RyYW5zbGF0ZWRNZXRob2RbbWV0aG9kXX0ge3QoJ0NvbnRhY3Q/Jyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICBzeD17eyB0ZXh0QWxpZ246ICdjZW50ZXInLCBtYXhXaWR0aDogMSwgd29yZFdyYXA6ICdicmVhay13b3JkJyB9fVxuICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MVwiXG4gICAgICAgID5cbiAgICAgICAgICA8VHJhbnNcbiAgICAgICAgICAgIGkxOG5LZXk9eyd7e2RvbWFpbn19IGlzIHJlcXVlc3RpbmcgdG8ge3ttZXRob2R9fSBhIGNvbnRhY3Q6J31cbiAgICAgICAgICAgIHZhbHVlcz17e1xuICAgICAgICAgICAgICBkb21haW46IGFjdGlvbi5zaXRlPy5kb21haW4gfHwgdCgnVGhpcyB3ZWJzaXRlJyksXG4gICAgICAgICAgICAgIG1ldGhvZDogdHJhbnNsYXRlZE1ldGhvZFttZXRob2RdLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cblxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgbXQ6IDMsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHttZXRob2QgPT09ICd1cGRhdGUnICYmIGFjdGlvbi5kaXNwbGF5RGF0YT8uZXhpc3RpbmcgPyAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIj57dCgnRnJvbTonKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxDYXJkXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgcDogMixcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPENvbnRhY3RJbmZvIGNvbnRhY3Q9e2FjdGlvbi5kaXNwbGF5RGF0YT8uZXhpc3Rpbmd9IC8+XG4gICAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCIgc3g9e3sgbXQ6IDIgfX0+XG4gICAgICAgICAgICAgICAge3QoJ1RvOicpfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxDYXJkXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgcDogMixcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPENvbnRhY3RJbmZvIGNvbnRhY3Q9e2FjdGlvbi5kaXNwbGF5RGF0YT8uY29udGFjdH0gLz5cbiAgICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxDb250YWN0SW5mbyBjb250YWN0PXthY3Rpb24uZGlzcGxheURhdGE/LmNvbnRhY3R9IC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgIHB0OiAzLFxuICAgICAgICAgIHBiOiAxLFxuICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInRyYW5zYWN0aW9uLXJlamVjdC1idG5cIlxuICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgZGlzYWJsZWQ9e2FjdGlvbi5zdGF0dXMgPT09IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGNhbmNlbEhhbmRsZXIoKTtcbiAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnUmVqZWN0Jyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmFuc2FjdGlvbi1hcHByb3ZlLWJ0blwiXG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICBkaXNhYmxlZD17YWN0aW9uLnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcgfHwgISFhY3Rpb24uZXJyb3J9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgdXBkYXRlTWVzc2FnZSh7XG4gICAgICAgICAgICAgIHN0YXR1czogQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcsXG4gICAgICAgICAgICAgIGlkOiByZXF1ZXN0SWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ0FwcHJvdmUnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBTaWduaW5nRGF0YSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBnZXRVcGRhdGVkU2lnbmluZ0RhdGEgPSAoXG4gIG9sZFNpZ25pbmdEYXRhPzogU2lnbmluZ0RhdGEsXG4gIG5ld1NpZ25pbmdEYXRhPzogU2lnbmluZ0RhdGEsXG4pOiBTaWduaW5nRGF0YSB8IHVuZGVmaW5lZCA9PiB7XG4gIGlmICghb2xkU2lnbmluZ0RhdGEpIHtcbiAgICByZXR1cm4gbmV3U2lnbmluZ0RhdGE7XG4gIH0gZWxzZSBpZiAoIW5ld1NpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG9sZFNpZ25pbmdEYXRhO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vbGRTaWduaW5nRGF0YSxcbiAgICAuLi5uZXdTaWduaW5nRGF0YSxcbiAgfTtcbn07XG4iLCJpbXBvcnQge1xuICBDb250ZXh0Q29udGFpbmVyLFxuICB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcixcbn0gZnJvbSAnQHNyYy9ob29rcy91c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcic7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBmaWx0ZXIsIGZpcnN0LCBmcm9tRXZlbnRQYXR0ZXJuLCBtZXJnZSB9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuKGNhbmNlbEhhbmRsZXI6ICgpID0+IHZvaWQpIHtcbiAgY29uc3QgaXNDb25maXJtUG9wdXAgPSB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcihcbiAgICBDb250ZXh0Q29udGFpbmVyLkNPTkZJUk0sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBtZXJnZShcbiAgICAgIGZyb21FdmVudFBhdHRlcm4oXG4gICAgICAgIChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3VubG9hZCcsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgICBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICAgIChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICkucGlwZShcbiAgICAgICAgZmlsdGVyKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJztcbiAgICAgICAgfSksXG4gICAgICApLFxuICAgIClcbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgLy8gT25seSBjbG9zZSBmb3IgcG9wdXAgd2luZG93cy4gVGhlIGV4dGVuc2lvbiBVSSBzaG91bGQgbm90IHJlYWN0IHRoaXMgd2F5LlxuICAgICAgICBpZiAoaXNDb25maXJtUG9wdXApIHtcbiAgICAgICAgICBjYW5jZWxIYW5kbGVyKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICB9LCBbY2FuY2VsSGFuZGxlciwgaXNDb25maXJtUG9wdXBdKTtcbn1cbiJdLCJuYW1lcyI6WyJTdGFjayIsInN0eWxlZCIsIlNpdGVBdmF0YXIiLCJ0aGVtZSIsInBhbGV0dGUiLCJiYWNrZ3JvdW5kIiwicGFwZXIiLCJtYXJnaW4iLCJFeHRlbnNpb25SZXF1ZXN0IiwiaXNCYXRjaEFwcHJvdmFsQWN0aW9uIiwiQWN0aW9uU3RhdHVzIiwidXNlQ29ubmVjdGlvbkNvbnRleHQiLCJ1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4iLCJ1c2VDYWxsYmFjayIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiQ29udGV4dENvbnRhaW5lciIsInVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyIiwidXNlQXBwcm92YWxzQ29udGV4dCIsImdldFVwZGF0ZWRTaWduaW5nRGF0YSIsInVzZUFwcHJvdmVBY3Rpb24iLCJhY3Rpb25JZCIsImlzQmF0Y2hBcHByb3ZhbCIsInJlcXVlc3QiLCJpc0NvbmZpcm1Qb3B1cCIsIkNPTkZJUk0iLCJhcHByb3ZhbCIsImFjdGlvbiIsInNldEFjdGlvbiIsImVycm9yIiwic2V0RXJyb3IiLCJ1cGRhdGVBY3Rpb24iLCJwYXJhbXMiLCJzaG91bGRXYWl0Rm9yUmVzcG9uc2UiLCJwcmV2QWN0aW9uRGF0YSIsInN0YXR1cyIsImRpc3BsYXlEYXRhIiwic2lnbmluZ0RhdGEiLCJzaG91bGRDbG9zZUFmdGVyVXBkYXRlIiwiUEVORElORyIsIm1ldGhvZCIsIkFDVElPTl9VUERBVEUiLCJmaW5hbGx5IiwiZ2xvYmFsVGhpcyIsImNsb3NlIiwiY2FuY2VsSGFuZGxlciIsIkVSUk9SX1VTRVJfQ0FOQ0VMRUQiLCJpZCIsIkFDVElPTl9HRVQiLCJ0aGVuIiwiYSIsInVzZU1lbW8iLCJ1c2VMb2NhdGlvbiIsInVzZUdldFJlcXVlc3RJZCIsImxvY2F0aW9uIiwic2VhcmNoUGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwic2VhcmNoIiwiZ2V0IiwiQ29udGFjdEluZm8iLCJUcmFucyIsInVzZVRyYW5zbGF0aW9uIiwiQnV0dG9uIiwiQ2FyZCIsIkNpcmN1bGFyUHJvZ3Jlc3MiLCJDb250YWN0c0ljb24iLCJUeXBvZ3JhcGh5IiwiVXBkYXRlQ29udGFjdHMiLCJ0IiwicmVxdWVzdElkIiwidXBkYXRlTWVzc2FnZSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJoZWlnaHQiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJ0cmFuc2xhdGVkTWV0aG9kIiwiY3JlYXRlIiwidXBkYXRlIiwicmVtb3ZlIiwicHkiLCJweCIsImZsZXhHcm93IiwibWIiLCJzaXplIiwicGIiLCJ2YXJpYW50IiwidGV4dEFsaWduIiwibWF4V2lkdGgiLCJ3b3JkV3JhcCIsImkxOG5LZXkiLCJ2YWx1ZXMiLCJkb21haW4iLCJzaXRlIiwidG9Mb3dlckNhc2UiLCJtdCIsImV4aXN0aW5nIiwiRnJhZ21lbnQiLCJwIiwiY29udGFjdCIsImZsZXhEaXJlY3Rpb24iLCJwdCIsImdhcCIsImNvbG9yIiwiZnVsbFdpZHRoIiwiZGlzYWJsZWQiLCJTVUJNSVRUSU5HIiwib25DbGljayIsIndpbmRvdyIsIm9sZFNpZ25pbmdEYXRhIiwibmV3U2lnbmluZ0RhdGEiLCJmaWx0ZXIiLCJmaXJzdCIsImZyb21FdmVudFBhdHRlcm4iLCJtZXJnZSIsInN1YnNjcmlwdGlvbiIsImhhbmRsZXIiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInBpcGUiLCJkb2N1bWVudCIsInZpc2liaWxpdHlTdGF0ZSIsInN1YnNjcmliZSIsInVuc3Vic2NyaWJlIl0sInNvdXJjZVJvb3QiOiIifQ==