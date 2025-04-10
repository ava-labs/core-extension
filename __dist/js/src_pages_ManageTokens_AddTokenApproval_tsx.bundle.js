"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ManageTokens_AddTokenApproval_tsx"],{

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

/***/ "./src/components/common/scrollbars/Scrollbars.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/scrollbars/Scrollbars.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scrollbars": () => (/* binding */ Scrollbars)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_custom_scrollbars_2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-custom-scrollbars-2 */ "./node_modules/react-custom-scrollbars-2/lib/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




// See https://github.com/RobPethick/react-custom-scrollbars-2/blob/master/docs/API.md
// for available props
const Scrollbars = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function Scrollbars(props, ref) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const renderThumb = ({
    style,
    ...rest
  }) => {
    const thumbStyle = {
      backgroundColor: theme.palette.grey[800],
      borderRadius: 9999
    };
    return /*#__PURE__*/React.createElement("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      style: {
        ...style,
        ...thumbStyle
      }
    }, rest));
  };
  return /*#__PURE__*/React.createElement(react_custom_scrollbars_2__WEBPACK_IMPORTED_MODULE_1__.Scrollbars, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    renderThumbVertical: renderThumb,
    ref: ref
  }, props));
});

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

/***/ "./src/pages/ManageTokens/AddTokenApproval.tsx":
/*!*****************************************************!*\
  !*** ./src/pages/ManageTokens/AddTokenApproval.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddTokenApproval": () => (/* binding */ AddTokenApproval)
/* harmony export */ });
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/SiteAvatar */ "./src/components/common/SiteAvatar.tsx");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/scrollbars/Scrollbars */ "./src/components/common/scrollbars/Scrollbars.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function AddTokenApproval() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_4__.useGetRequestId)();
  const {
    action,
    updateAction: updateMessage,
    cancelHandler
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_3__.useApproveAction)(requestId);
  if (!action || !action.displayData) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
      sx: {
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.CircularProgress, null));
  }
  const {
    token: customToken
  } = action.displayData;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexGrow: 1,
      width: 1,
      px: 2,
      py: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    component: "h1",
    sx: {
      mt: 1,
      mb: 3,
      fontSize: 24,
      fontWeight: 'bold'
    }
  }, t('Add New Asset?')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      mb: 3
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_1__.SiteAvatar, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_2__.TokenIcon, {
    height: "48px",
    width: "48px",
    src: customToken.logoUri
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.GlobeIcon, {
    size: 48
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "h5"
  }, customToken.name), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    sx: {
      textAlign: 'center',
      maxWidth: 1,
      wordWrap: 'break-word',
      color: 'text.secondary'
    },
    variant: "caption"
  }, action?.site?.domain)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Card, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_5__.Scrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      p: 2,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Name')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "subtitle2"
  }, customToken.name)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Symbol')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "subtitle2"
  }, customToken.symbol)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Address')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "subtitle2",
    sx: {
      wordBreak: 'break-all'
    }
  }, customToken.address)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Decimals')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "subtitle2"
  }, customToken.decimals)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Contract Type')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "subtitle2"
  }, customToken.contractType))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      justifyContent: 'space-between',
      pt: 3,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    color: "secondary",
    "data-testid": "transaction-reject-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_0__.ActionStatus.SUBMITTING,
    onClick: () => {
      cancelHandler();
      window.close();
    }
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    "data-testid": "transaction-approve-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_0__.ActionStatus.SUBMITTING || !!action.error,
    onClick: () => {
      updateMessage({
        status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_0__.ActionStatus.SUBMITTING,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX01hbmFnZVRva2Vuc19BZGRUb2tlbkFwcHJvdmFsX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQTREO0FBRXJELE1BQU1FLFVBQVUsR0FBR0QsdUVBQU0sQ0FBQ0QsOERBQUssQ0FBdUI7QUFDN0Q7QUFDQTtBQUNBLHNCQUFzQixDQUFDO0VBQUVHO0FBQU0sQ0FBQyxLQUFLQSxLQUFLLENBQUNDLE9BQU8sQ0FBQ0MsVUFBVSxDQUFDQyxLQUFNO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLFlBQVksQ0FBQztFQUFFQztBQUFPLENBQUMsS0FBS0EsTUFBTSxJQUFJLE9BQVE7QUFDOUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWNkQ7QUFDaEI7QUFDUztBQUl2RDtBQUNBO0FBQ08sTUFBTUksVUFBVSxnQkFBR0YsaURBQVUsQ0FBQyxTQUFTRSxVQUFVQSxDQUN0REMsS0FBc0MsRUFDdENDLEdBQXlDLEVBQ3pDO0VBQ0EsTUFBTVYsS0FBSyxHQUFHTyx1RUFBUSxFQUFFO0VBQ3hCLE1BQU1JLFdBQVcsR0FBR0EsQ0FBQztJQUFFQyxLQUFLO0lBQUUsR0FBR0M7RUFBSyxDQUFDLEtBQUs7SUFDMUMsTUFBTUMsVUFBVSxHQUFHO01BQ2pCQyxlQUFlLEVBQUVmLEtBQUssQ0FBQ0MsT0FBTyxDQUFDZSxJQUFJLENBQUMsR0FBRyxDQUFDO01BQ3hDQyxZQUFZLEVBQUU7SUFDaEIsQ0FBQztJQUNELG9CQUFPQyxLQUFBLENBQUFDLGFBQUEsUUFBQUMsMEVBQUE7TUFBS1IsS0FBSyxFQUFFO1FBQUUsR0FBR0EsS0FBSztRQUFFLEdBQUdFO01BQVc7SUFBRSxHQUFLRCxJQUFJLEVBQUk7RUFDOUQsQ0FBQztFQUVELG9CQUNFSyxLQUFBLENBQUFDLGFBQUEsQ0FBQ2QsaUVBQTJCLEVBQUFlLDBFQUFBO0lBQzFCQyxtQkFBbUIsRUFBRVYsV0FBWTtJQUNqQ0QsR0FBRyxFQUFFQTtFQUFJLEdBQ0xELEtBQUssRUFDVDtBQUVOLENB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LEVBQ0FBLE9BQU8sSUFBSztNQUNYUixNQUFNLENBQUNVLG1CQUFtQixDQUFDLFFBQVEsRUFBRUYsT0FBTyxDQUFDO0lBQy9DLENBQUMsQ0FDRixFQUNESCxzREFBZ0IsQ0FDYkcsT0FBTyxJQUFLO01BQ1hSLE1BQU0sQ0FBQ1MsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUVELE9BQU8sQ0FBQztJQUN0RCxDQUFDLEVBQ0FBLE9BQU8sSUFBSztNQUNYUixNQUFNLENBQUNVLG1CQUFtQixDQUFDLGtCQUFrQixFQUFFRixPQUFPLENBQUM7SUFDekQsQ0FBQyxDQUNGLENBQUNHLElBQUksQ0FDSlIsNENBQU0sQ0FBQyxNQUFNO01BQ1gsT0FBT1MsUUFBUSxDQUFDQyxlQUFlLEtBQUssUUFBUTtJQUM5QyxDQUFDLENBQUMsQ0FDSCxDQUNGLENBQ0VGLElBQUksQ0FBQ1AsMkNBQUssRUFBRSxDQUFDLENBQ2JVLFNBQVMsQ0FBQyxNQUFNO01BQ2Y7TUFDQSxJQUFJcEcsY0FBYyxFQUFFO1FBQ2xCcUIsYUFBYSxFQUFFO01BQ2pCO0lBQ0YsQ0FBQyxDQUFDO0lBRUosT0FBTyxNQUFNO01BQ1h3RSxZQUFZLEVBQUVRLFdBQVcsRUFBRTtJQUM3QixDQUFDO0VBQ0gsQ0FBQyxFQUFFLENBQUNoRixhQUFhLEVBQUVyQixjQUFjLENBQUMsQ0FBQztBQUNyQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vU2l0ZUF2YXRhci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zY3JvbGxiYXJzL1Njcm9sbGJhcnMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlQXBwcm92ZUFjdGlvbi50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUdldFJlcXVlc3RJZC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL01hbmFnZVRva2Vucy9BZGRUb2tlbkFwcHJvdmFsLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL2FjdGlvbnMvZ2V0VXBkYXRlZEFjdGlvbkRhdGEudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy91c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIHN0eWxlZCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmV4cG9ydCBjb25zdCBTaXRlQXZhdGFyID0gc3R5bGVkKFN0YWNrKTx7IG1hcmdpbj86IHN0cmluZyB9PmBcbiAgd2lkdGg6IDgwcHg7XG4gIGhlaWdodDogODBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5wYWxldHRlLmJhY2tncm91bmQucGFwZXJ9O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBtYXJnaW46ICR7KHsgbWFyZ2luIH0pID0+IG1hcmdpbiA/PyAnOHB4IDAnfTtcbmA7XG4iLCJpbXBvcnQgKiBhcyBDdXN0b21TY3JvbGxiYXJzIGZyb20gJ3JlYWN0LWN1c3RvbS1zY3JvbGxiYXJzLTInO1xuaW1wb3J0IHsgZm9yd2FyZFJlZiwgTGVnYWN5UmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVGhlbWUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgdHlwZSBTY3JvbGxiYXJzUmVmID0gQ3VzdG9tU2Nyb2xsYmFycy5TY3JvbGxiYXJzO1xuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1JvYlBldGhpY2svcmVhY3QtY3VzdG9tLXNjcm9sbGJhcnMtMi9ibG9iL21hc3Rlci9kb2NzL0FQSS5tZFxuLy8gZm9yIGF2YWlsYWJsZSBwcm9wc1xuZXhwb3J0IGNvbnN0IFNjcm9sbGJhcnMgPSBmb3J3YXJkUmVmKGZ1bmN0aW9uIFNjcm9sbGJhcnMoXG4gIHByb3BzOiBDdXN0b21TY3JvbGxiYXJzLlNjcm9sbGJhclByb3BzLFxuICByZWY6IExlZ2FjeVJlZjxTY3JvbGxiYXJzUmVmPiB8IHVuZGVmaW5lZCxcbikge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHJlbmRlclRodW1iID0gKHsgc3R5bGUsIC4uLnJlc3QgfSkgPT4ge1xuICAgIGNvbnN0IHRodW1iU3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuZ3JleVs4MDBdLFxuICAgICAgYm9yZGVyUmFkaXVzOiA5OTk5LFxuICAgIH07XG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3sgLi4uc3R5bGUsIC4uLnRodW1iU3R5bGUgfX0gey4uLnJlc3R9IC8+O1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEN1c3RvbVNjcm9sbGJhcnMuU2Nyb2xsYmFyc1xuICAgICAgcmVuZGVyVGh1bWJWZXJ0aWNhbD17cmVuZGVyVGh1bWJ9XG4gICAgICByZWY9e3JlZn1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAvPlxuICApO1xufSk7XG4iLCJpbXBvcnQgeyBFeHRlbnNpb25SZXF1ZXN0IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL2Nvbm5lY3Rpb25zL2V4dGVuc2lvbkNvbm5lY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7IEdldEFjdGlvbkhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9oYW5kbGVycy9nZXRBY3Rpb25zJztcbmltcG9ydCB7IFVwZGF0ZUFjdGlvbkhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9oYW5kbGVycy91cGRhdGVBY3Rpb24nO1xuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBBY3Rpb25VcGRhdGUsXG4gIE11bHRpVHhBY3Rpb24sXG4gIGlzQmF0Y2hBcHByb3ZhbEFjdGlvbixcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7IHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbiB9IGZyb20gJ0BzcmMvdXRpbHMvdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJy4vdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlQXBwcm92YWxzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQXBwcm92YWxzUHJvdmlkZXInO1xuaW1wb3J0IHsgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhIH0gZnJvbSAnQHNyYy91dGlscy9hY3Rpb25zL2dldFVwZGF0ZWRBY3Rpb25EYXRhJztcblxudHlwZSBBY3Rpb25UeXBlPElzQmF0Y2hBcHByb3ZhbD4gPSBJc0JhdGNoQXBwcm92YWwgZXh0ZW5kcyB0cnVlXG4gID8gTXVsdGlUeEFjdGlvblxuICA6IEFjdGlvbjtcblxudHlwZSBBY3Rpb25VcGRhdGVyPFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uIHwgdW5kZWZpbmVkPiA9IChcbiAgcGFyYW1zOiBBY3Rpb25VcGRhdGU8XG4gICAgUGFydGlhbDxUIGV4dGVuZHMgQWN0aW9uIHwgTXVsdGlUeEFjdGlvbiA/IFRbJ2Rpc3BsYXlEYXRhJ10gOiBuZXZlcj5cbiAgPixcbiAgc2hvdWxkV2FpdEZvclJlc3BvbnNlPzogYm9vbGVhbixcbikgPT4gUHJvbWlzZTxib29sZWFuPjtcblxudHlwZSBIb29rUmVzdWx0PFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uIHwgdW5kZWZpbmVkPiA9IHtcbiAgYWN0aW9uOiBUO1xuICB1cGRhdGVBY3Rpb246IEFjdGlvblVwZGF0ZXI8VD47XG4gIGVycm9yOiBzdHJpbmc7XG4gIGNhbmNlbEhhbmRsZXI6ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwcm92ZUFjdGlvbjxEaXNwbGF5RGF0YSA9IGFueT4oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbD86IGZhbHNlLFxuKTogSG9va1Jlc3VsdDxBY3Rpb248RGlzcGxheURhdGE+PjtcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uKFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw/OiB0cnVlLFxuKTogSG9va1Jlc3VsdDxNdWx0aVR4QWN0aW9uPjtcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uPERpc3BsYXlEYXRhID0gYW55PihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsOiBib29sZWFuID0gZmFsc2UsXG4pOiBIb29rUmVzdWx0PEFjdGlvbjxEaXNwbGF5RGF0YT4gfCBNdWx0aVR4QWN0aW9uIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IHsgcmVxdWVzdCB9ID0gdXNlQ29ubmVjdGlvbkNvbnRleHQoKTtcbiAgY29uc3QgaXNDb25maXJtUG9wdXAgPSB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcihcbiAgICBDb250ZXh0Q29udGFpbmVyLkNPTkZJUk0sXG4gICk7XG4gIGNvbnN0IHsgYXBwcm92YWwgfSA9IHVzZUFwcHJvdmFsc0NvbnRleHQoKTtcbiAgY29uc3QgW2FjdGlvbiwgc2V0QWN0aW9uXSA9IHVzZVN0YXRlPEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4+KCk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG5cbiAgY29uc3QgdXBkYXRlQWN0aW9uOiBBY3Rpb25VcGRhdGVyPEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4+ID1cbiAgICB1c2VDYWxsYmFjayhcbiAgICAgIGFzeW5jIChwYXJhbXMsIHNob3VsZFdhaXRGb3JSZXNwb25zZSkgPT4ge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIHVwZGF0ZSB0aGUgc3RhdHVzIGEgYml0IGZhc3RlciBmb3Igc21vb3RoZXIgVVguXG4gICAgICAgIC8vIHVzZSBmdW5jdGlvbiB0byBhdm9pZCBgYWN0aW9uYCBhcyBhIGRlcGVuZGVuY3kgYW5kIHRodXMgaW5maW5pdGUgbG9vcHNcbiAgICAgICAgc2V0QWN0aW9uKChwcmV2QWN0aW9uRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghcHJldkFjdGlvbkRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGb3IgTXVsdGlUeEFjdGlvbiwgd2UgZG9uJ3QgYWxsb3cgYW55IHVwZGF0ZXMgYmVzaWRlcyB0aGUgc3RhdHVzLlxuICAgICAgICAgIGlmIChpc0JhdGNoQXBwcm92YWxBY3Rpb24ocHJldkFjdGlvbkRhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YSxcbiAgICAgICAgICAgICAgc3RhdHVzOiBwYXJhbXMuc3RhdHVzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucHJldkFjdGlvbkRhdGEsXG4gICAgICAgICAgICBzdGF0dXM6IHBhcmFtcy5zdGF0dXMsXG4gICAgICAgICAgICBkaXNwbGF5RGF0YToge1xuICAgICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YS5kaXNwbGF5RGF0YSxcbiAgICAgICAgICAgICAgLi4ucGFyYW1zLmRpc3BsYXlEYXRhLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpZ25pbmdEYXRhOiBnZXRVcGRhdGVkU2lnbmluZ0RhdGEoXG4gICAgICAgICAgICAgIHByZXZBY3Rpb25EYXRhLnNpZ25pbmdEYXRhLFxuICAgICAgICAgICAgICBwYXJhbXMuc2lnbmluZ0RhdGEsXG4gICAgICAgICAgICApLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNob3VsZENsb3NlQWZ0ZXJVcGRhdGUgPVxuICAgICAgICAgIGlzQ29uZmlybVBvcHVwICYmIHBhcmFtcy5zdGF0dXMgIT09IEFjdGlvblN0YXR1cy5QRU5ESU5HO1xuXG4gICAgICAgIHJldHVybiByZXF1ZXN0PFVwZGF0ZUFjdGlvbkhhbmRsZXI+KHtcbiAgICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuQUNUSU9OX1VQREFURSxcbiAgICAgICAgICBwYXJhbXM6IFtwYXJhbXMsIHNob3VsZFdhaXRGb3JSZXNwb25zZV0sXG4gICAgICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgIGlmIChzaG91bGRDbG9zZUFmdGVyVXBkYXRlKSB7XG4gICAgICAgICAgICBnbG9iYWxUaGlzLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBbcmVxdWVzdCwgaXNDb25maXJtUG9wdXBdLFxuICAgICk7XG5cbiAgY29uc3QgY2FuY2VsSGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICgpID0+XG4gICAgICB1cGRhdGVBY3Rpb24oe1xuICAgICAgICBzdGF0dXM6IEFjdGlvblN0YXR1cy5FUlJPUl9VU0VSX0NBTkNFTEVELFxuICAgICAgICBpZDogYWN0aW9uSWQsXG4gICAgICB9KSxcbiAgICBbYWN0aW9uSWQsIHVwZGF0ZUFjdGlvbl0sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNDb25maXJtUG9wdXApIHtcbiAgICAgIHJlcXVlc3Q8R2V0QWN0aW9uSGFuZGxlcj4oe1xuICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuQUNUSU9OX0dFVCxcbiAgICAgICAgcGFyYW1zOiBbYWN0aW9uSWRdLFxuICAgICAgfSkudGhlbigoYSkgPT4ge1xuICAgICAgICBpZiAoaXNCYXRjaEFwcHJvdmFsICYmICFpc0JhdGNoQXBwcm92YWxBY3Rpb24oYSkpIHtcbiAgICAgICAgICBzZXRFcnJvcignRXhwZWN0ZWQgYSBiYXRjaCBhcHByb3ZhbCBhY3Rpb24nKTtcbiAgICAgICAgfSBlbHNlIGlmICghaXNCYXRjaEFwcHJvdmFsICYmIGlzQmF0Y2hBcHByb3ZhbEFjdGlvbihhKSkge1xuICAgICAgICAgIHNldEVycm9yKCdFeHBlY3RlZCBhIHNpbmdsZSBhcHByb3ZhbCBhY3Rpb24nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRBY3Rpb24oYSBhcyBBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChhcHByb3ZhbD8uYWN0aW9uLmFjdGlvbklkID09PSBhY3Rpb25JZCkge1xuICAgICAgc2V0QWN0aW9uKGFwcHJvdmFsLmFjdGlvbiBhcyBBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+KTtcbiAgICB9XG4gIH0sIFthY3Rpb25JZCwgcmVxdWVzdCwgYXBwcm92YWwsIGlzQ29uZmlybVBvcHVwLCBpc0JhdGNoQXBwcm92YWxdKTtcblxuICB1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4oY2FuY2VsSGFuZGxlcik7XG5cbiAgcmV0dXJuIHsgYWN0aW9uLCB1cGRhdGVBY3Rpb24sIGVycm9yLCBjYW5jZWxIYW5kbGVyIH07XG59XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTG9jYXRpb24gfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcblxuLyoqXG4gKiBUaGlzIGlzIHVzZWQgdG8gZ2V0IHRoZSBpZCBvZiBhIHRyYW5zYWN0aW9uIG9yIG1lc3NhZ2UgdGhhdFxuICogaGFzIGJlZW4gcHV0IGludG8gbG9jYWxzdG9yYWdlIGFuZCB0byBiZSB1c2VkIGFjcm9zcyBtdWx0aXBsZVxuICogY29udGV4dHMuIFdlIGdyYWIgdGhlIHF1ZXJ5IHBhcmFtIGFuZCB1c2UgdGhhdCB0byBnZXQgdGhlIGl0ZW0gb3V0IG9mIHN0b3JhZ2UuXG4gKlxuICogQHJldHVybnMgaWQgZnJvbSB0aGUgcXVlcnkgcGFyYW1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUdldFJlcXVlc3RJZCgpIHtcbiAgY29uc3QgbG9jYXRpb24gPSB1c2VMb2NhdGlvbigpO1xuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCA/PyAnJyk7XG4gICAgcmV0dXJuIHNlYXJjaFBhcmFtcy5nZXQoJ2FjdGlvbklkJykgPz8gJyc7XG4gIH0sIFtsb2NhdGlvbi5zZWFyY2hdKTtcbn1cbiIsImltcG9ydCB7IEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyBTaXRlQXZhdGFyIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9TaXRlQXZhdGFyJztcbmltcG9ydCB7IFRva2VuSWNvbiB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vVG9rZW5JY29uJztcbmltcG9ydCB7IHVzZUFwcHJvdmVBY3Rpb24gfSBmcm9tICdAc3JjL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24nO1xuaW1wb3J0IHsgdXNlR2V0UmVxdWVzdElkIH0gZnJvbSAnQHNyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQ2FyZCxcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgR2xvYmVJY29uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFNjcm9sbGJhcnMgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL3Njcm9sbGJhcnMvU2Nyb2xsYmFycyc7XG5pbXBvcnQgeyBBZGRDdXN0b21Ub2tlbkRhdGEgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2V0dGluZ3MvbW9kZWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFkZFRva2VuQXBwcm92YWwoKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgcmVxdWVzdElkID0gdXNlR2V0UmVxdWVzdElkKCk7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb24sXG4gICAgdXBkYXRlQWN0aW9uOiB1cGRhdGVNZXNzYWdlLFxuICAgIGNhbmNlbEhhbmRsZXIsXG4gIH0gPSB1c2VBcHByb3ZlQWN0aW9uPEFkZEN1c3RvbVRva2VuRGF0YT4ocmVxdWVzdElkKTtcblxuICBpZiAoIWFjdGlvbiB8fCAhYWN0aW9uLmRpc3BsYXlEYXRhKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDaXJjdWxhclByb2dyZXNzIC8+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH1cblxuICBjb25zdCB7IHRva2VuOiBjdXN0b21Ub2tlbiB9ID0gYWN0aW9uLmRpc3BsYXlEYXRhO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSwgd2lkdGg6IDEsIHB4OiAyLCBweTogMSB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICBjb21wb25lbnQ9XCJoMVwiXG4gICAgICAgICAgc3g9e3sgbXQ6IDEsIG1iOiAzLCBmb250U2l6ZTogMjQsIGZvbnRXZWlnaHQ6ICdib2xkJyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ0FkZCBOZXcgQXNzZXQ/Jyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgbWI6IDMsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTaXRlQXZhdGFyIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAgPFRva2VuSWNvbiBoZWlnaHQ9XCI0OHB4XCIgd2lkdGg9XCI0OHB4XCIgc3JjPXtjdXN0b21Ub2tlbi5sb2dvVXJpfT5cbiAgICAgICAgICAgICAgPEdsb2JlSWNvbiBzaXplPXs0OH0gLz5cbiAgICAgICAgICAgIDwvVG9rZW5JY29uPlxuICAgICAgICAgIDwvU2l0ZUF2YXRhcj5cblxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPntjdXN0b21Ub2tlbi5uYW1lfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDEsXG4gICAgICAgICAgICAgIHdvcmRXcmFwOiAnYnJlYWstd29yZCcsXG4gICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7YWN0aW9uPy5zaXRlPy5kb21haW59XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgIDxDYXJkIHN4PXt7IGZsZXhHcm93OiAxIH19PlxuICAgICAgICAgIDxTY3JvbGxiYXJzPlxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IHA6IDIsIHdpZHRoOiAxIH19PlxuICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgbWI6IDIgfX0+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAgICAgICAgICB7dCgnTmFtZScpfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cblxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJzdWJ0aXRsZTJcIj57Y3VzdG9tVG9rZW4ubmFtZX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyBtYjogMiB9fT5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgICAgICAgIHt0KCdTeW1ib2wnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwic3VidGl0bGUyXCI+XG4gICAgICAgICAgICAgICAgICB7Y3VzdG9tVG9rZW4uc3ltYm9sfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICAgICAge3QoJ0FkZHJlc3MnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwic3VidGl0bGUyXCIgc3g9e3sgd29yZEJyZWFrOiAnYnJlYWstYWxsJyB9fT5cbiAgICAgICAgICAgICAgICAgIHtjdXN0b21Ub2tlbi5hZGRyZXNzfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICAgICAge3QoJ0RlY2ltYWxzJyl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuXG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cInN1YnRpdGxlMlwiPlxuICAgICAgICAgICAgICAgICAge2N1c3RvbVRva2VuLmRlY2ltYWxzfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICAgICAge3QoJ0NvbnRyYWN0IFR5cGUnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwic3VidGl0bGUyXCI+XG4gICAgICAgICAgICAgICAgICB7Y3VzdG9tVG9rZW4uY29udHJhY3RUeXBlfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9TY3JvbGxiYXJzPlxuICAgICAgICA8L0NhcmQ+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgIHB0OiAzLFxuICAgICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInRyYW5zYWN0aW9uLXJlamVjdC1idG5cIlxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgZGlzYWJsZWQ9e2FjdGlvbi5zdGF0dXMgPT09IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBjYW5jZWxIYW5kbGVyKCk7XG4gICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnUmVqZWN0Jyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmFuc2FjdGlvbi1hcHByb3ZlLWJ0blwiXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBkaXNhYmxlZD17XG4gICAgICAgICAgICAgIGFjdGlvbi5zdGF0dXMgPT09IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HIHx8ICEhYWN0aW9uLmVycm9yXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHVwZGF0ZU1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcsXG4gICAgICAgICAgICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdBcHByb3ZlJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgU2lnbmluZ0RhdGEgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhID0gKFxuICBvbGRTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuICBuZXdTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuKTogU2lnbmluZ0RhdGEgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoIW9sZFNpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG5ld1NpZ25pbmdEYXRhO1xuICB9IGVsc2UgaWYgKCFuZXdTaWduaW5nRGF0YSkge1xuICAgIHJldHVybiBvbGRTaWduaW5nRGF0YTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub2xkU2lnbmluZ0RhdGEsXG4gICAgLi4ubmV3U2lnbmluZ0RhdGEsXG4gIH07XG59O1xuIiwiaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgZnJvbUV2ZW50UGF0dGVybiwgbWVyZ2UgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICAgZnJvbUV2ZW50UGF0dGVybihcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLnBpcGUoXG4gICAgICAgIGZpbHRlcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbic7XG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIE9ubHkgY2xvc2UgZm9yIHBvcHVwIHdpbmRvd3MuIFRoZSBleHRlbnNpb24gVUkgc2hvdWxkIG5vdCByZWFjdCB0aGlzIHdheS5cbiAgICAgICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW2NhbmNlbEhhbmRsZXIsIGlzQ29uZmlybVBvcHVwXSk7XG59XG4iXSwibmFtZXMiOlsiU3RhY2siLCJzdHlsZWQiLCJTaXRlQXZhdGFyIiwidGhlbWUiLCJwYWxldHRlIiwiYmFja2dyb3VuZCIsInBhcGVyIiwibWFyZ2luIiwiQ3VzdG9tU2Nyb2xsYmFycyIsImZvcndhcmRSZWYiLCJ1c2VUaGVtZSIsIlNjcm9sbGJhcnMiLCJwcm9wcyIsInJlZiIsInJlbmRlclRodW1iIiwic3R5bGUiLCJyZXN0IiwidGh1bWJTdHlsZSIsImJhY2tncm91bmRDb2xvciIsImdyZXkiLCJib3JkZXJSYWRpdXMiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJfZXh0ZW5kcyIsInJlbmRlclRodW1iVmVydGljYWwiLCJFeHRlbnNpb25SZXF1ZXN0IiwiaXNCYXRjaEFwcHJvdmFsQWN0aW9uIiwiQWN0aW9uU3RhdHVzIiwidXNlQ29ubmVjdGlvbkNvbnRleHQiLCJ1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4iLCJ1c2VDYWxsYmFjayIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiQ29udGV4dENvbnRhaW5lciIsInVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyIiwidXNlQXBwcm92YWxzQ29udGV4dCIsImdldFVwZGF0ZWRTaWduaW5nRGF0YSIsInVzZUFwcHJvdmVBY3Rpb24iLCJhY3Rpb25JZCIsImlzQmF0Y2hBcHByb3ZhbCIsInJlcXVlc3QiLCJpc0NvbmZpcm1Qb3B1cCIsIkNPTkZJUk0iLCJhcHByb3ZhbCIsImFjdGlvbiIsInNldEFjdGlvbiIsImVycm9yIiwic2V0RXJyb3IiLCJ1cGRhdGVBY3Rpb24iLCJwYXJhbXMiLCJzaG91bGRXYWl0Rm9yUmVzcG9uc2UiLCJwcmV2QWN0aW9uRGF0YSIsInN0YXR1cyIsImRpc3BsYXlEYXRhIiwic2lnbmluZ0RhdGEiLCJzaG91bGRDbG9zZUFmdGVyVXBkYXRlIiwiUEVORElORyIsIm1ldGhvZCIsIkFDVElPTl9VUERBVEUiLCJmaW5hbGx5IiwiZ2xvYmFsVGhpcyIsImNsb3NlIiwiY2FuY2VsSGFuZGxlciIsIkVSUk9SX1VTRVJfQ0FOQ0VMRUQiLCJpZCIsIkFDVElPTl9HRVQiLCJ0aGVuIiwiYSIsInVzZU1lbW8iLCJ1c2VMb2NhdGlvbiIsInVzZUdldFJlcXVlc3RJZCIsImxvY2F0aW9uIiwic2VhcmNoUGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwic2VhcmNoIiwiZ2V0IiwiVG9rZW5JY29uIiwidXNlVHJhbnNsYXRpb24iLCJCdXR0b24iLCJDYXJkIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIkdsb2JlSWNvbiIsIlR5cG9ncmFwaHkiLCJBZGRUb2tlbkFwcHJvdmFsIiwidCIsInJlcXVlc3RJZCIsInVwZGF0ZU1lc3NhZ2UiLCJzeCIsIndpZHRoIiwiaGVpZ2h0IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwidG9rZW4iLCJjdXN0b21Ub2tlbiIsIkZyYWdtZW50IiwiZmxleEdyb3ciLCJweCIsInB5IiwiY29tcG9uZW50IiwibXQiLCJtYiIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsInNyYyIsImxvZ29VcmkiLCJzaXplIiwidmFyaWFudCIsIm5hbWUiLCJ0ZXh0QWxpZ24iLCJtYXhXaWR0aCIsIndvcmRXcmFwIiwiY29sb3IiLCJzaXRlIiwiZG9tYWluIiwicCIsInN5bWJvbCIsIndvcmRCcmVhayIsImFkZHJlc3MiLCJkZWNpbWFscyIsImNvbnRyYWN0VHlwZSIsImZsZXhEaXJlY3Rpb24iLCJwdCIsImdhcCIsImZ1bGxXaWR0aCIsImRpc2FibGVkIiwiU1VCTUlUVElORyIsIm9uQ2xpY2siLCJ3aW5kb3ciLCJvbGRTaWduaW5nRGF0YSIsIm5ld1NpZ25pbmdEYXRhIiwiZmlsdGVyIiwiZmlyc3QiLCJmcm9tRXZlbnRQYXR0ZXJuIiwibWVyZ2UiLCJzdWJzY3JpcHRpb24iLCJoYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwaXBlIiwiZG9jdW1lbnQiLCJ2aXNpYmlsaXR5U3RhdGUiLCJzdWJzY3JpYmUiLCJ1bnN1YnNjcmliZSJdLCJzb3VyY2VSb290IjoiIn0=