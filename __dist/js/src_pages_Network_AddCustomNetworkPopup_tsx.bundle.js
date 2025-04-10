"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Network_AddCustomNetworkPopup_tsx"],{

/***/ "./src/background/services/network/utils/buildGlacierAuthHeaders.ts":
/*!**************************************************************************!*\
  !*** ./src/background/services/network/utils/buildGlacierAuthHeaders.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildGlacierAuthHeaders": () => (/* binding */ buildGlacierAuthHeaders)
/* harmony export */ });
const buildGlacierAuthHeaders = apiKey => {
  if (!apiKey) {
    return {};
  }
  return {
    'X-Glacier-Api-Key': apiKey
  };
};

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

/***/ "./src/hooks/useKeyboardShortcuts.ts":
/*!*******************************************!*\
  !*** ./src/hooks/useKeyboardShortcuts.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useKeyboardShortcuts": () => (/* binding */ useKeyboardShortcuts)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const useKeyboardShortcuts = shortcuts => {
  const onKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async event => {
    const callback = shortcuts[event.key];
    if (typeof callback === 'function') {
      event.preventDefault();
      await callback();
    }
  }, [shortcuts]);
  return {
    onKeyDown
  };
};

/***/ }),

/***/ "./src/pages/Network/AddCustomNetworkPopup.tsx":
/*!*****************************************************!*\
  !*** ./src/pages/Network/AddCustomNetworkPopup.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddCustomNetworkPopup": () => (/* binding */ AddCustomNetworkPopup)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/scrollbars/Scrollbars */ "./src/components/common/scrollbars/Scrollbars.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/common/SiteAvatar */ "./src/components/common/SiteAvatar.tsx");
/* harmony import */ var _src_background_services_network_utils_buildGlacierAuthHeaders__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/background/services/network/utils/buildGlacierAuthHeaders */ "./src/background/services/network/utils/buildGlacierAuthHeaders.ts");
/* harmony import */ var _src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/hooks/useKeyboardShortcuts */ "./src/hooks/useKeyboardShortcuts.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");












function AddCustomNetworkPopup() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_1__.useGetRequestId)();
  const {
    action,
    updateAction,
    cancelHandler
  } = (0,_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_5__.useApproveAction)(requestId);
  const [apiKey, setApiKey] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const [isApiModalVisible, setIsApiModalVisible] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [isSavingApiKey, setIsSavingApiKey] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const handleApproval = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async () => updateAction({
    status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__.ActionStatus.SUBMITTING,
    id: requestId
  }), [requestId, updateAction]);
  const saveApiKey = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async () => {
    if (isSavingApiKey) {
      return;
    }
    if (!action || !action.displayData) {
      throw new Error('Network config not available');
    }
    if (!apiKey) {
      throw new Error('API Key was not provided');
    }
    setIsSavingApiKey(true);
    try {
      await updateAction({
        status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__.ActionStatus.PENDING,
        id: requestId,
        displayData: {
          ...action.displayData,
          network: {
            ...action.displayData.network,
            customRpcHeaders: (0,_src_background_services_network_utils_buildGlacierAuthHeaders__WEBPACK_IMPORTED_MODULE_8__.buildGlacierAuthHeaders)(apiKey)
          }
        }
      });
    } finally {
      setIsSavingApiKey(false);
    }
    await handleApproval();
  }, [apiKey, action, requestId, updateAction, handleApproval, isSavingApiKey]);
  const shouldPromptForApiKey = action?.displayData?.options?.requiresGlacierApiKey ? action?.displayData.options.requiresGlacierApiKey && !apiKey : false;
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    window.addEventListener('unload', cancelHandler);
    return () => {
      window.removeEventListener('unload', cancelHandler);
    };
  }, [cancelHandler]);
  const keyboardShortcuts = (0,_src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_9__.useKeyboardShortcuts)({
    Enter: saveApiKey,
    Escape: () => setIsApiModalVisible(false)
  });
  if (!action || !action.displayData) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
      sx: {
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.CircularProgress, null));
  }
  const customNetwork = action.displayData.network;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      flexGrow: 1,
      width: 1,
      px: 2,
      py: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    component: "h1",
    sx: {
      mt: 1,
      mb: 3,
      fontSize: 24,
      fontWeight: 'bold'
    }
  }, t('Add New Network?')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_7__.SiteAvatar, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_3__.TokenIcon, {
    height: "48px",
    width: "48px",
    src: customNetwork?.logoUri
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.GlobeIcon, {
    size: 48
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "h5"
  }, customNetwork.chainName), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    sx: {
      textAlign: 'center',
      maxWidth: 1,
      wordWrap: 'break-word',
      color: 'text.secondary'
    },
    variant: "caption"
  }, action?.site?.domain)), action?.displayData?.options?.requiresGlacierApiKey && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Alert, {
    color: "info",
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.AlertTitle, null, t('Glacier API key is required')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.AlertContent, null, t('In order for this network to be fully functional, you need to provide your Glacier API key. You will be prompted to do so upon approval.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Card, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_6__.Scrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Chain ID')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "subtitle2"
  }, customNetwork.chainId)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Chain Name')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "subtitle2"
  }, customNetwork.chainName)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('RPC URL')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "subtitle2"
  }, customNetwork.rpcUrl)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Explorer URL')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "subtitle2"
  }, customNetwork.explorerUrl)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Network Symbol')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "subtitle2"
  }, customNetwork.networkToken.symbol)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Token Name')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "subtitle2"
  }, customNetwork.networkToken.name)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Token Decimals')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "subtitle2"
  }, customNetwork.networkToken.decimals))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      justifyContent: 'space-between',
      pt: 3,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
    color: "secondary",
    "data-testid": "transaction-reject-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__.ActionStatus.SUBMITTING,
    onClick: () => {
      cancelHandler();
      window.close();
    }
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
    "data-testid": "transaction-approve-btn",
    size: "large",
    fullWidth: true,
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__.ActionStatus.SUBMITTING || !!action.error,
    onClick: () => {
      if (shouldPromptForApiKey) {
        setIsApiModalVisible(true);
      } else {
        handleApproval();
      }
    }
  }, t('Approve')))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Dialog, {
    open: isApiModalVisible,
    PaperProps: {
      sx: {
        mx: 2
      }
    },
    onClose: () => setIsApiModalVisible(false),
    showCloseIcon: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.DialogTitle, null, t('Provide API Key')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.DialogContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "body2"
  }, t('This network requires additional authentication to be fully functional.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "body2",
    color: "text.secondary",
    sx: {
      mt: 1
    }
  }, t('The API key can also be configured in the network settings later on.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.TextField, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    type: "password",
    placeholder: t('Glacier API Key'),
    sx: {
      mt: 2
    },
    onChange: ev => setApiKey(ev.target.value)
  }, keyboardShortcuts))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.DialogActions, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
    key: "save",
    size: "large",
    "data-testid": "api-key-save",
    disabled: action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__.ActionStatus.SUBMITTING || !!action.error || !apiKey || isSavingApiKey,
    isLoading: isSavingApiKey || action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__.ActionStatus.SUBMITTING,
    onClick: saveApiKey
  }, t('Save')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
    key: "skip",
    variant: "text",
    "data-testid": "api-key-skip",
    disabled: isSavingApiKey || action.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__.ActionStatus.SUBMITTING || !!action.error,
    onClick: () => handleApproval()
  }, t('I will configure it later')))));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX05ldHdvcmtfQWRkQ3VzdG9tTmV0d29ya1BvcHVwX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUVPLE1BQU1BLHVCQUF1QixHQUFJQyxNQUFjLElBQXVCO0VBQzNFLElBQUksQ0FBQ0EsTUFBTSxFQUFFO0lBQ1gsT0FBTyxDQUFDLENBQUM7RUFDWDtFQUVBLE9BQU87SUFDTCxtQkFBbUIsRUFBRUE7RUFDdkIsQ0FBQztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWMkQ7QUFFckQsTUFBTUcsVUFBVSxHQUFHRCx1RUFBTSxDQUFDRCw4REFBSyxDQUF1QjtBQUM3RDtBQUNBO0FBQ0Esc0JBQXNCLENBQUM7RUFBRUc7QUFBTSxDQUFDLEtBQUtBLEtBQUssQ0FBQ0MsT0FBTyxDQUFDQyxVQUFVLENBQUNDLEtBQU07QUFDcEU7QUFDQTtBQUNBO0FBQ0EsWUFBWSxDQUFDO0VBQUVDO0FBQU8sQ0FBQyxLQUFLQSxNQUFNLElBQUksT0FBUTtBQUM5QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1Y2RDtBQUNoQjtBQUNTO0FBSXZEO0FBQ0E7QUFDTyxNQUFNSSxVQUFVLGdCQUFHRixpREFBVSxDQUFDLFNBQVNFLFVBQVVBLENBQ3REQyxLQUFzQyxFQUN0Q0MsR0FBeUMsRUFDekM7RUFDQSxNQUFNVixLQUFLLEdBQUdPLHVFQUFRLEVBQUU7RUFDeEIsTUFBTUksV0FBVyxHQUFHQSxDQUFDO0lBQUVDLEtBQUs7SUFBRSxHQUFHQztFQUFLLENBQUMsS0FBSztJQUMxQyxNQUFNQyxVQUFVLEdBQUc7TUFDakJDLGVBQWUsRUFBRWYsS0FBSyxDQUFDQyxPQUFPLENBQUNlLElBQUksQ0FBQyxHQUFHLENBQUM7TUFDeENDLFlBQVksRUFBRTtJQUNoQixDQUFDO0lBQ0Qsb0JBQU9DLEtBQUEsQ0FBQUMsYUFBQSxRQUFBQywwRUFBQTtNQUFLUixLQUFLLEVBQUU7UUFBRSxHQUFHQSxLQUFLO1FBQUUsR0FBR0U7TUFBVztJQUFFLEdB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Z0IsQ0FDYkcsT0FBTyxJQUFLO01BQ1hqRSxNQUFNLENBQUNDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFZ0UsT0FBTyxDQUFDO0lBQ3RELENBQUMsRUFDQUEsT0FBTyxJQUFLO01BQ1hqRSxNQUFNLENBQUNFLG1CQUFtQixDQUFDLGtCQUFrQixFQUFFK0QsT0FBTyxDQUFDO0lBQ3pELENBQUMsQ0FDRixDQUFDQyxJQUFJLENBQ0pOLDRDQUFNLENBQUMsTUFBTTtNQUNYLE9BQU9PLFFBQVEsQ0FBQ0MsZUFBZSxLQUFLLFFBQVE7SUFDOUMsQ0FBQyxDQUFDLENBQ0gsQ0FDRixDQUNFRixJQUFJLENBQUNMLDJDQUFLLEVBQUUsQ0FBQyxDQUNiUSxTQUFTLENBQUMsTUFBTTtNQUNmO01BQ0EsSUFBSS9JLGNBQWMsRUFBRTtRQUNsQnFCLGFBQWEsRUFBRTtNQUNqQjtJQUNGLENBQUMsQ0FBQztJQUVKLE9BQU8sTUFBTTtNQUNYcUgsWUFBWSxFQUFFTSxXQUFXLEVBQUU7SUFDN0IsQ0FBQztFQUNILENBQUMsRUFBRSxDQUFDM0gsYUFBYSxFQUFFckIsY0FBYyxDQUFDLENBQUM7QUFDckMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9idWlsZEdsYWNpZXJBdXRoSGVhZGVycy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1NpdGVBdmF0YXIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2Nyb2xsYmFycy9TY3JvbGxiYXJzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VLZXlib2FyZFNob3J0Y3V0cy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL05ldHdvcmsvQWRkQ3VzdG9tTmV0d29ya1BvcHVwLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL2FjdGlvbnMvZ2V0VXBkYXRlZEFjdGlvbkRhdGEudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy91c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ3VzdG9tUnBjSGVhZGVycyB9IGZyb20gJy4uL21vZGVscyc7XG5cbmV4cG9ydCBjb25zdCBidWlsZEdsYWNpZXJBdXRoSGVhZGVycyA9IChhcGlLZXk6IHN0cmluZyk6IEN1c3RvbVJwY0hlYWRlcnMgPT4ge1xuICBpZiAoIWFwaUtleSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJ1gtR2xhY2llci1BcGktS2V5JzogYXBpS2V5LFxuICB9O1xufTtcbiIsImltcG9ydCB7IFN0YWNrLCBzdHlsZWQgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgU2l0ZUF2YXRhciA9IHN0eWxlZChTdGFjayk8eyBtYXJnaW4/OiBzdHJpbmcgfT5gXG4gIHdpZHRoOiA4MHB4O1xuICBoZWlnaHQ6IDgwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyfTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgbWFyZ2luOiAkeyh7IG1hcmdpbiB9KSA9PiBtYXJnaW4gPz8gJzhweCAwJ307XG5gO1xuIiwiaW1wb3J0ICogYXMgQ3VzdG9tU2Nyb2xsYmFycyBmcm9tICdyZWFjdC1jdXN0b20tc2Nyb2xsYmFycy0yJztcbmltcG9ydCB7IGZvcndhcmRSZWYsIExlZ2FjeVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRoZW1lIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IHR5cGUgU2Nyb2xsYmFyc1JlZiA9IEN1c3RvbVNjcm9sbGJhcnMuU2Nyb2xsYmFycztcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JQZXRoaWNrL3JlYWN0LWN1c3RvbS1zY3JvbGxiYXJzLTIvYmxvYi9tYXN0ZXIvZG9jcy9BUEkubWRcbi8vIGZvciBhdmFpbGFibGUgcHJvcHNcbmV4cG9ydCBjb25zdCBTY3JvbGxiYXJzID0gZm9yd2FyZFJlZihmdW5jdGlvbiBTY3JvbGxiYXJzKFxuICBwcm9wczogQ3VzdG9tU2Nyb2xsYmFycy5TY3JvbGxiYXJQcm9wcyxcbiAgcmVmOiBMZWdhY3lSZWY8U2Nyb2xsYmFyc1JlZj4gfCB1bmRlZmluZWQsXG4pIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCByZW5kZXJUaHVtYiA9ICh7IHN0eWxlLCAuLi5yZXN0IH0pID0+IHtcbiAgICBjb25zdCB0aHVtYlN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODAwXSxcbiAgICAgIGJvcmRlclJhZGl1czogOTk5OSxcbiAgICB9O1xuICAgIHJldHVybiA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLCAuLi50aHVtYlN0eWxlIH19IHsuLi5yZXN0fSAvPjtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxDdXN0b21TY3JvbGxiYXJzLlNjcm9sbGJhcnNcbiAgICAgIHJlbmRlclRodW1iVmVydGljYWw9e3JlbmRlclRodW1ifVxuICAgICAgcmVmPXtyZWZ9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKTtcbn0pO1xuIiwiaW1wb3J0IHsgRXh0ZW5zaW9uUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9leHRlbnNpb25Db25uZWN0aW9uL21vZGVscyc7XG5pbXBvcnQgeyBHZXRBY3Rpb25IYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvaGFuZGxlcnMvZ2V0QWN0aW9ucyc7XG5pbXBvcnQgeyBVcGRhdGVBY3Rpb25IYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvaGFuZGxlcnMvdXBkYXRlQWN0aW9uJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uVXBkYXRlLFxuICBNdWx0aVR4QWN0aW9uLFxuICBpc0JhdGNoQXBwcm92YWxBY3Rpb24sXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyB1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4gfSBmcm9tICdAc3JjL3V0aWxzL3VzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbic7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIENvbnRleHRDb250YWluZXIsXG4gIHVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyLFxufSBmcm9tICcuL3VzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyJztcbmltcG9ydCB7IHVzZUFwcHJvdmFsc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FwcHJvdmFsc1Byb3ZpZGVyJztcbmltcG9ydCB7IGdldFVwZGF0ZWRTaWduaW5nRGF0YSB9IGZyb20gJ0BzcmMvdXRpbHMvYWN0aW9ucy9nZXRVcGRhdGVkQWN0aW9uRGF0YSc7XG5cbnR5cGUgQWN0aW9uVHlwZTxJc0JhdGNoQXBwcm92YWw+ID0gSXNCYXRjaEFwcHJvdmFsIGV4dGVuZHMgdHJ1ZVxuICA/IE11bHRpVHhBY3Rpb25cbiAgOiBBY3Rpb247XG5cbnR5cGUgQWN0aW9uVXBkYXRlcjxUIGV4dGVuZHMgQWN0aW9uIHwgTXVsdGlUeEFjdGlvbiB8IHVuZGVmaW5lZD4gPSAoXG4gIHBhcmFtczogQWN0aW9uVXBkYXRlPFxuICAgIFBhcnRpYWw8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gPyBUWydkaXNwbGF5RGF0YSddIDogbmV2ZXI+XG4gID4sXG4gIHNob3VsZFdhaXRGb3JSZXNwb25zZT86IGJvb2xlYW4sXG4pID0+IFByb21pc2U8Ym9vbGVhbj47XG5cbnR5cGUgSG9va1Jlc3VsdDxUIGV4dGVuZHMgQWN0aW9uIHwgTXVsdGlUeEFjdGlvbiB8IHVuZGVmaW5lZD4gPSB7XG4gIGFjdGlvbjogVDtcbiAgdXBkYXRlQWN0aW9uOiBBY3Rpb25VcGRhdGVyPFQ+O1xuICBlcnJvcjogc3RyaW5nO1xuICBjYW5jZWxIYW5kbGVyOiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb248RGlzcGxheURhdGEgPSBhbnk+KFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw/OiBmYWxzZSxcbik6IEhvb2tSZXN1bHQ8QWN0aW9uPERpc3BsYXlEYXRhPj47XG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwcm92ZUFjdGlvbihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsPzogdHJ1ZSxcbik6IEhvb2tSZXN1bHQ8TXVsdGlUeEFjdGlvbj47XG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwcm92ZUFjdGlvbjxEaXNwbGF5RGF0YSA9IGFueT4oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbDogYm9vbGVhbiA9IGZhbHNlLFxuKTogSG9va1Jlc3VsdDxBY3Rpb248RGlzcGxheURhdGE+IHwgTXVsdGlUeEFjdGlvbiB8IHVuZGVmaW5lZD4ge1xuICBjb25zdCB7IHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuICBjb25zdCB7IGFwcHJvdmFsIH0gPSB1c2VBcHByb3ZhbHNDb250ZXh0KCk7XG4gIGNvbnN0IFthY3Rpb24sIHNldEFjdGlvbl0gPSB1c2VTdGF0ZTxBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+PigpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuXG4gIGNvbnN0IHVwZGF0ZUFjdGlvbjogQWN0aW9uVXBkYXRlcjxBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+PiA9XG4gICAgdXNlQ2FsbGJhY2soXG4gICAgICBhc3luYyAocGFyYW1zLCBzaG91bGRXYWl0Rm9yUmVzcG9uc2UpID0+IHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byB1cGRhdGUgdGhlIHN0YXR1cyBhIGJpdCBmYXN0ZXIgZm9yIHNtb290aGVyIFVYLlxuICAgICAgICAvLyB1c2UgZnVuY3Rpb24gdG8gYXZvaWQgYGFjdGlvbmAgYXMgYSBkZXBlbmRlbmN5IGFuZCB0aHVzIGluZmluaXRlIGxvb3BzXG4gICAgICAgIHNldEFjdGlvbigocHJldkFjdGlvbkRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIXByZXZBY3Rpb25EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRm9yIE11bHRpVHhBY3Rpb24sIHdlIGRvbid0IGFsbG93IGFueSB1cGRhdGVzIGJlc2lkZXMgdGhlIHN0YXR1cy5cbiAgICAgICAgICBpZiAoaXNCYXRjaEFwcHJvdmFsQWN0aW9uKHByZXZBY3Rpb25EYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ucHJldkFjdGlvbkRhdGEsXG4gICAgICAgICAgICAgIHN0YXR1czogcGFyYW1zLnN0YXR1cyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiBwYXJhbXMuc3RhdHVzLFxuICAgICAgICAgICAgZGlzcGxheURhdGE6IHtcbiAgICAgICAgICAgICAgLi4ucHJldkFjdGlvbkRhdGEuZGlzcGxheURhdGEsXG4gICAgICAgICAgICAgIC4uLnBhcmFtcy5kaXNwbGF5RGF0YSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaWduaW5nRGF0YTogZ2V0VXBkYXRlZFNpZ25pbmdEYXRhKFxuICAgICAgICAgICAgICBwcmV2QWN0aW9uRGF0YS5zaWduaW5nRGF0YSxcbiAgICAgICAgICAgICAgcGFyYW1zLnNpZ25pbmdEYXRhLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzaG91bGRDbG9zZUFmdGVyVXBkYXRlID1cbiAgICAgICAgICBpc0NvbmZpcm1Qb3B1cCAmJiBwYXJhbXMuc3RhdHVzICE9PSBBY3Rpb25TdGF0dXMuUEVORElORztcblxuICAgICAgICByZXR1cm4gcmVxdWVzdDxVcGRhdGVBY3Rpb25IYW5kbGVyPih7XG4gICAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LkFDVElPTl9VUERBVEUsXG4gICAgICAgICAgcGFyYW1zOiBbcGFyYW1zLCBzaG91bGRXYWl0Rm9yUmVzcG9uc2VdLFxuICAgICAgICB9KS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICBpZiAoc2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSkge1xuICAgICAgICAgICAgZ2xvYmFsVGhpcy5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgW3JlcXVlc3QsIGlzQ29uZmlybVBvcHVwXSxcbiAgICApO1xuXG4gIGNvbnN0IGNhbmNlbEhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoKSA9PlxuICAgICAgdXBkYXRlQWN0aW9uKHtcbiAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuRVJST1JfVVNFUl9DQU5DRUxFRCxcbiAgICAgICAgaWQ6IGFjdGlvbklkLFxuICAgICAgfSksXG4gICAgW2FjdGlvbklkLCB1cGRhdGVBY3Rpb25dLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICByZXF1ZXN0PEdldEFjdGlvbkhhbmRsZXI+KHtcbiAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LkFDVElPTl9HRVQsXG4gICAgICAgIHBhcmFtczogW2FjdGlvbklkXSxcbiAgICAgIH0pLnRoZW4oKGEpID0+IHtcbiAgICAgICAgaWYgKGlzQmF0Y2hBcHByb3ZhbCAmJiAhaXNCYXRjaEFwcHJvdmFsQWN0aW9uKGEpKSB7XG4gICAgICAgICAgc2V0RXJyb3IoJ0V4cGVjdGVkIGEgYmF0Y2ggYXBwcm92YWwgYWN0aW9uJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzQmF0Y2hBcHByb3ZhbCAmJiBpc0JhdGNoQXBwcm92YWxBY3Rpb24oYSkpIHtcbiAgICAgICAgICBzZXRFcnJvcignRXhwZWN0ZWQgYSBzaW5nbGUgYXBwcm92YWwgYWN0aW9uJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0QWN0aW9uKGEgYXMgQWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoYXBwcm92YWw/LmFjdGlvbi5hY3Rpb25JZCA9PT0gYWN0aW9uSWQpIHtcbiAgICAgIHNldEFjdGlvbihhcHByb3ZhbC5hY3Rpb24gYXMgQWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPik7XG4gICAgfVxuICB9LCBbYWN0aW9uSWQsIHJlcXVlc3QsIGFwcHJvdmFsLCBpc0NvbmZpcm1Qb3B1cCwgaXNCYXRjaEFwcHJvdmFsXSk7XG5cbiAgdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuKGNhbmNlbEhhbmRsZXIpO1xuXG4gIHJldHVybiB7IGFjdGlvbiwgdXBkYXRlQWN0aW9uLCBlcnJvciwgY2FuY2VsSGFuZGxlciB9O1xufVxuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5cbi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGdldCB0aGUgaWQgb2YgYSB0cmFuc2FjdGlvbiBvciBtZXNzYWdlIHRoYXRcbiAqIGhhcyBiZWVuIHB1dCBpbnRvIGxvY2Fsc3RvcmFnZSBhbmQgdG8gYmUgdXNlZCBhY3Jvc3MgbXVsdGlwbGVcbiAqIGNvbnRleHRzLiBXZSBncmFiIHRoZSBxdWVyeSBwYXJhbSBhbmQgdXNlIHRoYXQgdG8gZ2V0IHRoZSBpdGVtIG91dCBvZiBzdG9yYWdlLlxuICpcbiAqIEByZXR1cm5zIGlkIGZyb20gdGhlIHF1ZXJ5IHBhcmFtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VHZXRSZXF1ZXN0SWQoKSB7XG4gIGNvbnN0IGxvY2F0aW9uID0gdXNlTG9jYXRpb24oKTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3Qgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2ggPz8gJycpO1xuICAgIHJldHVybiBzZWFyY2hQYXJhbXMuZ2V0KCdhY3Rpb25JZCcpID8/ICcnO1xuICB9LCBbbG9jYXRpb24uc2VhcmNoXSk7XG59XG4iLCJpbXBvcnQgeyBLZXlib2FyZEV2ZW50SGFuZGxlciwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5cbnR5cGUgQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xudHlwZSBLZXlOYW1lcyA9ICdFbnRlcicgfCAnRXNjYXBlJztcbnR5cGUgS2V5Ym9hcmRTaG9ydGN1dHMgPSBQYXJ0aWFsPFJlY29yZDxLZXlOYW1lcywgQ2FsbGJhY2s+PjtcblxuZXhwb3J0IGNvbnN0IHVzZUtleWJvYXJkU2hvcnRjdXRzID0gKHNob3J0Y3V0czogS2V5Ym9hcmRTaG9ydGN1dHMpID0+IHtcbiAgY29uc3Qgb25LZXlEb3duOiBLZXlib2FyZEV2ZW50SGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBzaG9ydGN1dHNbZXZlbnQua2V5XTtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhd2FpdCBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3Nob3J0Y3V0c10sXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBvbktleURvd24sXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgdXNlR2V0UmVxdWVzdElkIH0gZnJvbSAnQHNyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQnO1xuaW1wb3J0IHsgQWN0aW9uU3RhdHVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IFRva2VuSWNvbiB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vVG9rZW5JY29uJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlQXBwcm92ZUFjdGlvbiB9IGZyb20gJy4uLy4uL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24nO1xuaW1wb3J0IHsgU2Nyb2xsYmFycyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vc2Nyb2xsYmFycy9TY3JvbGxiYXJzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBBbGVydCxcbiAgQWxlcnRDb250ZW50LFxuICBBbGVydFRpdGxlLFxuICBCdXR0b24sXG4gIENhcmQsXG4gIENpcmN1bGFyUHJvZ3Jlc3MsXG4gIERpYWxvZyxcbiAgRGlhbG9nQWN0aW9ucyxcbiAgRGlhbG9nQ29udGVudCxcbiAgRGlhbG9nVGl0bGUsXG4gIEdsb2JlSWNvbixcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFNpdGVBdmF0YXIgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1NpdGVBdmF0YXInO1xuaW1wb3J0IHsgYnVpbGRHbGFjaWVyQXV0aEhlYWRlcnMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9idWlsZEdsYWNpZXJBdXRoSGVhZGVycyc7XG5pbXBvcnQgeyB1c2VLZXlib2FyZFNob3J0Y3V0cyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlS2V5Ym9hcmRTaG9ydGN1dHMnO1xuaW1wb3J0IHsgQWRkRXRoZXJldW1DaGFpbkRpc3BsYXlEYXRhIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvbW9kZWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFkZEN1c3RvbU5ldHdvcmtQb3B1cCgpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCByZXF1ZXN0SWQgPSB1c2VHZXRSZXF1ZXN0SWQoKTtcbiAgY29uc3QgeyBhY3Rpb24sIHVwZGF0ZUFjdGlvbiwgY2FuY2VsSGFuZGxlciB9ID1cbiAgICB1c2VBcHByb3ZlQWN0aW9uPEFkZEV0aGVyZXVtQ2hhaW5EaXNwbGF5RGF0YT4ocmVxdWVzdElkKTtcblxuICBjb25zdCBbYXBpS2V5LCBzZXRBcGlLZXldID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbaXNBcGlNb2RhbFZpc2libGUsIHNldElzQXBpTW9kYWxWaXNpYmxlXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzU2F2aW5nQXBpS2V5LCBzZXRJc1NhdmluZ0FwaUtleV0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgaGFuZGxlQXBwcm92YWwgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoKSA9PlxuICAgICAgdXBkYXRlQWN0aW9uKHtcbiAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyxcbiAgICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgIH0pLFxuICAgIFtyZXF1ZXN0SWQsIHVwZGF0ZUFjdGlvbl0sXG4gICk7XG5cbiAgY29uc3Qgc2F2ZUFwaUtleSA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoaXNTYXZpbmdBcGlLZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWFjdGlvbiB8fCAhYWN0aW9uLmRpc3BsYXlEYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgY29uZmlnIG5vdCBhdmFpbGFibGUnKTtcbiAgICB9XG5cbiAgICBpZiAoIWFwaUtleSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBUEkgS2V5IHdhcyBub3QgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBzZXRJc1NhdmluZ0FwaUtleSh0cnVlKTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB1cGRhdGVBY3Rpb24oe1xuICAgICAgICBzdGF0dXM6IEFjdGlvblN0YXR1cy5QRU5ESU5HLFxuICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICBkaXNwbGF5RGF0YToge1xuICAgICAgICAgIC4uLmFjdGlvbi5kaXNwbGF5RGF0YSxcbiAgICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgICAuLi5hY3Rpb24uZGlzcGxheURhdGEubmV0d29yayxcbiAgICAgICAgICAgIGN1c3RvbVJwY0hlYWRlcnM6IGJ1aWxkR2xhY2llckF1dGhIZWFkZXJzKGFwaUtleSksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRJc1NhdmluZ0FwaUtleShmYWxzZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlQXBwcm92YWwoKTtcbiAgfSwgW2FwaUtleSwgYWN0aW9uLCByZXF1ZXN0SWQsIHVwZGF0ZUFjdGlvbiwgaGFuZGxlQXBwcm92YWwsIGlzU2F2aW5nQXBpS2V5XSk7XG5cbiAgY29uc3Qgc2hvdWxkUHJvbXB0Rm9yQXBpS2V5ID0gYWN0aW9uPy5kaXNwbGF5RGF0YT8ub3B0aW9uc1xuICAgID8ucmVxdWlyZXNHbGFjaWVyQXBpS2V5XG4gICAgPyBhY3Rpb24/LmRpc3BsYXlEYXRhLm9wdGlvbnMucmVxdWlyZXNHbGFjaWVyQXBpS2V5ICYmICFhcGlLZXlcbiAgICA6IGZhbHNlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3VubG9hZCcsIGNhbmNlbEhhbmRsZXIpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBjYW5jZWxIYW5kbGVyKTtcbiAgICB9O1xuICB9LCBbY2FuY2VsSGFuZGxlcl0pO1xuXG4gIGNvbnN0IGtleWJvYXJkU2hvcnRjdXRzID0gdXNlS2V5Ym9hcmRTaG9ydGN1dHMoe1xuICAgIEVudGVyOiBzYXZlQXBpS2V5LFxuICAgIEVzY2FwZTogKCkgPT4gc2V0SXNBcGlNb2RhbFZpc2libGUoZmFsc2UpLFxuICB9KTtcblxuICBpZiAoIWFjdGlvbiB8fCAhYWN0aW9uLmRpc3BsYXlEYXRhKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDaXJjdWxhclByb2dyZXNzIC8+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH1cblxuICBjb25zdCBjdXN0b21OZXR3b3JrID0gYWN0aW9uLmRpc3BsYXlEYXRhLm5ldHdvcms7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPFN0YWNrIHN4PXt7IGZsZXhHcm93OiAxLCB3aWR0aDogMSwgcHg6IDIsIHB5OiAxIH19PlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIGNvbXBvbmVudD1cImgxXCJcbiAgICAgICAgICBzeD17eyBtdDogMSwgbWI6IDMsIGZvbnRTaXplOiAyNCwgZm9udFdlaWdodDogJ2JvbGQnIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnQWRkIE5ldyBOZXR3b3JrPycpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIG1iOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8U2l0ZUF2YXRhciBzeD17eyBtYjogMiB9fT5cbiAgICAgICAgICAgIDxUb2tlbkljb24gaGVpZ2h0PVwiNDhweFwiIHdpZHRoPVwiNDhweFwiIHNyYz17Y3VzdG9tTmV0d29yaz8ubG9nb1VyaX0+XG4gICAgICAgICAgICAgIDxHbG9iZUljb24gc2l6ZT17NDh9IC8+XG4gICAgICAgICAgICA8L1Rva2VuSWNvbj5cbiAgICAgICAgICA8L1NpdGVBdmF0YXI+XG5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIj57Y3VzdG9tTmV0d29yay5jaGFpbk5hbWV9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICBtYXhXaWR0aDogMSxcbiAgICAgICAgICAgICAgd29yZFdyYXA6ICdicmVhay13b3JkJyxcbiAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHthY3Rpb24/LnNpdGU/LmRvbWFpbn1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAge2FjdGlvbj8uZGlzcGxheURhdGE/Lm9wdGlvbnM/LnJlcXVpcmVzR2xhY2llckFwaUtleSAmJiAoXG4gICAgICAgICAgPEFsZXJ0IGNvbG9yPVwiaW5mb1wiIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAgPEFsZXJ0VGl0bGU+e3QoJ0dsYWNpZXIgQVBJIGtleSBpcyByZXF1aXJlZCcpfTwvQWxlcnRUaXRsZT5cbiAgICAgICAgICAgIDxBbGVydENvbnRlbnQ+XG4gICAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAgICdJbiBvcmRlciBmb3IgdGhpcyBuZXR3b3JrIHRvIGJlIGZ1bGx5IGZ1bmN0aW9uYWwsIHlvdSBuZWVkIHRvIHByb3ZpZGUgeW91ciBHbGFjaWVyIEFQSSBrZXkuIFlvdSB3aWxsIGJlIHByb21wdGVkIHRvIGRvIHNvIHVwb24gYXBwcm92YWwuJyxcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvQWxlcnRDb250ZW50PlxuICAgICAgICAgIDwvQWxlcnQ+XG4gICAgICAgICl9XG5cbiAgICAgICAgPENhcmQgc3g9e3sgZmxleEdyb3c6IDEgfX0+XG4gICAgICAgICAgPFNjcm9sbGJhcnM+XG4gICAgICAgICAgICA8U3RhY2sgc3g9e3sgcDogMiB9fT5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICAgICAge3QoJ0NoYWluIElEJyl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuXG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cInN1YnRpdGxlMlwiPlxuICAgICAgICAgICAgICAgICAge2N1c3RvbU5ldHdvcmsuY2hhaW5JZH1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyBtYjogMiB9fT5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgICAgICAgIHt0KCdDaGFpbiBOYW1lJyl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuXG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cInN1YnRpdGxlMlwiPlxuICAgICAgICAgICAgICAgICAge2N1c3RvbU5ldHdvcmsuY2hhaW5OYW1lfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICAgICAge3QoJ1JQQyBVUkwnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwic3VidGl0bGUyXCI+XG4gICAgICAgICAgICAgICAgICB7Y3VzdG9tTmV0d29yay5ycGNVcmx9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgbWI6IDIgfX0+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAgICAgICAgICB7dCgnRXhwbG9yZXIgVVJMJyl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuXG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cInN1YnRpdGxlMlwiPlxuICAgICAgICAgICAgICAgICAge2N1c3RvbU5ldHdvcmsuZXhwbG9yZXJVcmx9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgbWI6IDIgfX0+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAgICAgICAgICB7dCgnTmV0d29yayBTeW1ib2wnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwic3VidGl0bGUyXCI+XG4gICAgICAgICAgICAgICAgICB7Y3VzdG9tTmV0d29yay5uZXR3b3JrVG9rZW4uc3ltYm9sfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IG1iOiAyIH19PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICAgICAge3QoJ1Rva2VuIE5hbWUnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwic3VidGl0bGUyXCI+XG4gICAgICAgICAgICAgICAgICB7Y3VzdG9tTmV0d29yay5uZXR3b3JrVG9rZW4ubmFtZX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyBtYjogMiB9fT5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgICAgICAgIHt0KCdUb2tlbiBEZWNpbWFscycpfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cblxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJzdWJ0aXRsZTJcIj5cbiAgICAgICAgICAgICAgICAgIHtjdXN0b21OZXR3b3JrLm5ldHdvcmtUb2tlbi5kZWNpbWFsc31cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICAgICAgPC9DYXJkPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICBwdDogMyxcbiAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmFuc2FjdGlvbi1yZWplY3QtYnRuXCJcbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIGRpc2FibGVkPXthY3Rpb24uc3RhdHVzID09PSBBY3Rpb25TdGF0dXMuU1VCTUlUVElOR31cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ1JlamVjdCcpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwidHJhbnNhY3Rpb24tYXBwcm92ZS1idG5cIlxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgZGlzYWJsZWQ9e1xuICAgICAgICAgICAgICBhY3Rpb24uc3RhdHVzID09PSBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyB8fCAhIWFjdGlvbi5lcnJvclxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoc2hvdWxkUHJvbXB0Rm9yQXBpS2V5KSB7XG4gICAgICAgICAgICAgICAgc2V0SXNBcGlNb2RhbFZpc2libGUodHJ1ZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlQXBwcm92YWwoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnQXBwcm92ZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxEaWFsb2dcbiAgICAgICAgb3Blbj17aXNBcGlNb2RhbFZpc2libGV9XG4gICAgICAgIFBhcGVyUHJvcHM9e3sgc3g6IHsgbXg6IDIgfSB9fVxuICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRJc0FwaU1vZGFsVmlzaWJsZShmYWxzZSl9XG4gICAgICAgIHNob3dDbG9zZUljb25cbiAgICAgID5cbiAgICAgICAgPERpYWxvZ1RpdGxlPnt0KCdQcm92aWRlIEFQSSBLZXknKX08L0RpYWxvZ1RpdGxlPlxuICAgICAgICA8RGlhbG9nQ29udGVudD5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAnVGhpcyBuZXR3b3JrIHJlcXVpcmVzIGFkZGl0aW9uYWwgYXV0aGVudGljYXRpb24gdG8gYmUgZnVsbHkgZnVuY3Rpb25hbC4nLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiIHN4PXt7IG10OiAxIH19PlxuICAgICAgICAgICAge3QoXG4gICAgICAgICAgICAgICdUaGUgQVBJIGtleSBjYW4gYWxzbyBiZSBjb25maWd1cmVkIGluIHRoZSBuZXR3b3JrIHNldHRpbmdzIGxhdGVyIG9uLicsXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0dsYWNpZXIgQVBJIEtleScpfVxuICAgICAgICAgICAgc3g9e3sgbXQ6IDIgfX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXYpID0+IHNldEFwaUtleShldi50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgey4uLmtleWJvYXJkU2hvcnRjdXRzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvRGlhbG9nQ29udGVudD5cbiAgICAgICAgPERpYWxvZ0FjdGlvbnMgc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGtleT1cInNhdmVcIlxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYXBpLWtleS1zYXZlXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXtcbiAgICAgICAgICAgICAgYWN0aW9uLnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcgfHxcbiAgICAgICAgICAgICAgISFhY3Rpb24uZXJyb3IgfHxcbiAgICAgICAgICAgICAgIWFwaUtleSB8fFxuICAgICAgICAgICAgICBpc1NhdmluZ0FwaUtleVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNMb2FkaW5nPXtcbiAgICAgICAgICAgICAgaXNTYXZpbmdBcGlLZXkgfHwgYWN0aW9uLnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3NhdmVBcGlLZXl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ1NhdmUnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBrZXk9XCJza2lwXCJcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYXBpLWtleS1za2lwXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXtcbiAgICAgICAgICAgICAgaXNTYXZpbmdBcGlLZXkgfHxcbiAgICAgICAgICAgICAgYWN0aW9uLnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcgfHxcbiAgICAgICAgICAgICAgISFhY3Rpb24uZXJyb3JcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZUFwcHJvdmFsKCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ0kgd2lsbCBjb25maWd1cmUgaXQgbGF0ZXInKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9EaWFsb2dBY3Rpb25zPlxuICAgICAgPC9EaWFsb2c+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBTaWduaW5nRGF0YSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBnZXRVcGRhdGVkU2lnbmluZ0RhdGEgPSAoXG4gIG9sZFNpZ25pbmdEYXRhPzogU2lnbmluZ0RhdGEsXG4gIG5ld1NpZ25pbmdEYXRhPzogU2lnbmluZ0RhdGEsXG4pOiBTaWduaW5nRGF0YSB8IHVuZGVmaW5lZCA9PiB7XG4gIGlmICghb2xkU2lnbmluZ0RhdGEpIHtcbiAgICByZXR1cm4gbmV3U2lnbmluZ0RhdGE7XG4gIH0gZWxzZSBpZiAoIW5ld1NpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG9sZFNpZ25pbmdEYXRhO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vbGRTaWduaW5nRGF0YSxcbiAgICAuLi5uZXdTaWduaW5nRGF0YSxcbiAgfTtcbn07XG4iLCJpbXBvcnQge1xuICBDb250ZXh0Q29udGFpbmVyLFxuICB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcixcbn0gZnJvbSAnQHNyYy9ob29rcy91c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcic7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBmaWx0ZXIsIGZpcnN0LCBmcm9tRXZlbnRQYXR0ZXJuLCBtZXJnZSB9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuKGNhbmNlbEhhbmRsZXI6ICgpID0+IHZvaWQpIHtcbiAgY29uc3QgaXNDb25maXJtUG9wdXAgPSB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcihcbiAgICBDb250ZXh0Q29udGFpbmVyLkNPTkZJUk0sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBtZXJnZShcbiAgICAgIGZyb21FdmVudFBhdHRlcm4oXG4gICAgICAgIChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3VubG9hZCcsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgICBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICAgIChoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICkucGlwZShcbiAgICAgICAgZmlsdGVyKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJztcbiAgICAgICAgfSksXG4gICAgICApLFxuICAgIClcbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgLy8gT25seSBjbG9zZSBmb3IgcG9wdXAgd2luZG93cy4gVGhlIGV4dGVuc2lvbiBVSSBzaG91bGQgbm90IHJlYWN0IHRoaXMgd2F5LlxuICAgICAgICBpZiAoaXNDb25maXJtUG9wdXApIHtcbiAgICAgICAgICBjYW5jZWxIYW5kbGVyKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICB9LCBbY2FuY2VsSGFuZGxlciwgaXNDb25maXJtUG9wdXBdKTtcbn1cbiJdLCJuYW1lcyI6WyJidWlsZEdsYWNpZXJBdXRoSGVhZGVycyIsImFwaUtleSIsIlN0YWNrIiwic3R5bGVkIiwiU2l0ZUF2YXRhciIsInRoZW1lIiwicGFsZXR0ZSIsImJhY2tncm91bmQiLCJwYXBlciIsIm1hcmdpbiIsIkN1c3RvbVNjcm9sbGJhcnMiLCJmb3J3YXJkUmVmIiwidXNlVGhlbWUiLCJTY3JvbGxiYXJzIiwicHJvcHMiLCJyZWYiLCJyZW5kZXJUaHVtYiIsInN0eWxlIiwicmVzdCIsInRodW1iU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJncmV5IiwiYm9yZGVyUmFkaXVzIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiX2V4dGVuZHMiLCJyZW5kZXJUaHVtYlZlcnRpY2FsIiwiRXh0ZW5zaW9uUmVxdWVzdCIsImlzQmF0Y2hBcHByb3ZhbEFjdGlvbiIsIkFjdGlvblN0YXR1cyIsInVzZUNvbm5lY3Rpb25Db250ZXh0IiwidXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuIiwidXNlQ2FsbGJhY2siLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkNvbnRleHRDb250YWluZXIiLCJ1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lciIsInVzZUFwcHJvdmFsc0NvbnRleHQiLCJnZXRVcGRhdGVkU2lnbmluZ0RhdGEiLCJ1c2VBcHByb3ZlQWN0aW9uIiwiYWN0aW9uSWQiLCJpc0JhdGNoQXBwcm92YWwiLCJyZXF1ZXN0IiwiaXNDb25maXJtUG9wdXAiLCJDT05GSVJNIiwiYXBwcm92YWwiLCJhY3Rpb24iLCJzZXRBY3Rpb24iLCJlcnJvciIsInNldEVycm9yIiwidXBkYXRlQWN0aW9uIiwicGFyYW1zIiwic2hvdWxkV2FpdEZvclJlc3BvbnNlIiwicHJldkFjdGlvbkRhdGEiLCJzdGF0dXMiLCJkaXNwbGF5RGF0YSIsInNpZ25pbmdEYXRhIiwic2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSIsIlBFTkRJTkciLCJtZXRob2QiLCJBQ1RJT05fVVBEQVRFIiwiZmluYWxseSIsImdsb2JhbFRoaXMiLCJjbG9zZSIsImNhbmNlbEhhbmRsZXIiLCJFUlJPUl9VU0VSX0NBTkNFTEVEIiwiaWQiLCJBQ1RJT05fR0VUIiwidGhlbiIsImEiLCJ1c2VNZW1vIiwidXNlTG9jYXRpb24iLCJ1c2VHZXRSZXF1ZXN0SWQiLCJsb2NhdGlvbiIsInNlYXJjaFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInNlYXJjaCIsImdldCIsInVzZUtleWJvYXJkU2hvcnRjdXRzIiwic2hvcnRjdXRzIiwib25LZXlEb3duIiwiZXZlbnQiLCJjYWxsYmFjayIsImtleSIsInByZXZlbnREZWZhdWx0IiwiVG9rZW5JY29uIiwidXNlVHJhbnNsYXRpb24iLCJBbGVydCIsIkFsZXJ0Q29udGVudCIsIkFsZXJ0VGl0bGUiLCJCdXR0b24iLCJDYXJkIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIkRpYWxvZyIsIkRpYWxvZ0FjdGlvbnMiLCJEaWFsb2dDb250ZW50IiwiRGlhbG9nVGl0bGUiLCJHbG9iZUljb24iLCJUZXh0RmllbGQiLCJUeXBvZ3JhcGh5IiwiQWRkQ3VzdG9tTmV0d29ya1BvcHVwIiwidCIsInJlcXVlc3RJZCIsInNldEFwaUtleSIsImlzQXBpTW9kYWxWaXNpYmxlIiwic2V0SXNBcGlNb2RhbFZpc2libGUiLCJpc1NhdmluZ0FwaUtleSIsInNldElzU2F2aW5nQXBpS2V5IiwiaGFuZGxlQXBwcm92YWwiLCJTVUJNSVRUSU5HIiwic2F2ZUFwaUtleSIsIkVycm9yIiwibmV0d29yayIsImN1c3RvbVJwY0hlYWRlcnMiLCJzaG91bGRQcm9tcHRGb3JBcGlLZXkiLCJvcHRpb25zIiwicmVxdWlyZXNHbGFjaWVyQXBpS2V5Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJrZXlib2FyZFNob3J0Y3V0cyIsIkVudGVyIiwiRXNjYXBlIiwic3giLCJ3aWR0aCIsImhlaWdodCIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsImN1c3RvbU5ldHdvcmsiLCJGcmFnbWVudCIsImZsZXhHcm93IiwicHgiLCJweSIsImNvbXBvbmVudCIsIm10IiwibWIiLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJzcmMiLCJsb2dvVXJpIiwic2l6ZSIsInZhcmlhbnQiLCJjaGFpbk5hbWUiLCJ0ZXh0QWxpZ24iLCJtYXhXaWR0aCIsIndvcmRXcmFwIiwiY29sb3IiLCJzaXRlIiwiZG9tYWluIiwicCIsImNoYWluSWQiLCJycGNVcmwiLCJleHBsb3JlclVybCIsIm5ldHdvcmtUb2tlbiIsInN5bWJvbCIsIm5hbWUiLCJkZWNpbWFscyIsImZsZXhEaXJlY3Rpb24iLCJwdCIsImdhcCIsImZ1bGxXaWR0aCIsImRpc2FibGVkIiwib25DbGljayIsIm9wZW4iLCJQYXBlclByb3BzIiwibXgiLCJvbkNsb3NlIiwic2hvd0Nsb3NlSWNvbiIsInR5cGUiLCJwbGFjZWhvbGRlciIsIm9uQ2hhbmdlIiwiZXYiLCJ0YXJnZXQiLCJ2YWx1ZSIsImlzTG9hZGluZyIsIm9sZFNpZ25pbmdEYXRhIiwibmV3U2lnbmluZ0RhdGEiLCJmaWx0ZXIiLCJmaXJzdCIsImZyb21FdmVudFBhdHRlcm4iLCJtZXJnZSIsInN1YnNjcmlwdGlvbiIsImhhbmRsZXIiLCJwaXBlIiwiZG9jdW1lbnQiLCJ2aXNpYmlsaXR5U3RhdGUiLCJzdWJzY3JpYmUiLCJ1bnN1YnNjcmliZSJdLCJzb3VyY2VSb290IjoiIn0=