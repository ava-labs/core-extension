"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ApproveAction_SelectWallet_tsx"],{

/***/ "./src/components/common/LoadingOverlay.tsx":
/*!**************************************************!*\
  !*** ./src/components/common/LoadingOverlay.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoadingOverlay": () => (/* binding */ LoadingOverlay)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _Overlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Overlay */ "./src/components/common/Overlay.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function LoadingOverlay() {
  return /*#__PURE__*/React.createElement(_Overlay__WEBPACK_IMPORTED_MODULE_0__.Overlay, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, null));
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

/***/ "./src/pages/ApproveAction/SelectWallet.tsx":
/*!**************************************************!*\
  !*** ./src/pages/ApproveAction/SelectWallet.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectWallet": () => (/* binding */ SelectWallet)
/* harmony export */ });
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/SiteAvatar */ "./src/components/common/SiteAvatar.tsx");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/common/LoadingOverlay */ "./src/components/common/LoadingOverlay.tsx");
/* harmony import */ var _Wallet_components_WalletExtensionButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Wallet/components/WalletExtensionButton */ "./src/pages/Wallet/components/WalletExtensionButton.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");









function SelectWallet() {
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_3__.useGetRequestId)();
  const {
    action: request,
    updateAction
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_2__.useApproveAction)(requestId);
  const selectWallet = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async index => updateAction({
    status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_0__.ActionStatus.SUBMITTING,
    id: requestId,
    result: index
  }), [requestId, updateAction]);
  if (!request) {
    return /*#__PURE__*/React.createElement(_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_5__.LoadingOverlay, null);
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      px: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_1__.SiteAvatar, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.WalletIcon, {
    size: 48
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "h4",
    sx: {
      textAlign: 'center',
      mt: 3,
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_8__.Trans, {
    i18nKey: "Which wallet would <br /> you like to use?"
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    sx: {
      textAlign: 'center'
    },
    variant: "body1"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_8__.Trans, {
    i18nKey: "It looks like multiple wallets are installed. <br /> Select which one you would like to connect."
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, request.displayData.info.map((info, index) => {
    if (info.rdns === 'app.core.extension') {
      return /*#__PURE__*/React.createElement(_Wallet_components_WalletExtensionButton__WEBPACK_IMPORTED_MODULE_6__.CoreExtensionButton, {
        key: index,
        onClick: () => {
          selectWallet(index);
        },
        info: info
      });
    }
    return;
  }), request.displayData.info.length > 1 && /*#__PURE__*/React.createElement(_Wallet_components_WalletExtensionButton__WEBPACK_IMPORTED_MODULE_6__.WalletExtensionButton, {
    onClick: index => {
      selectWallet(index);
    },
    wallets: request.displayData.info
  })));
}

/***/ }),

/***/ "./src/pages/Wallet/components/WalletExtensionButton.tsx":
/*!***************************************************************!*\
  !*** ./src/pages/Wallet/components/WalletExtensionButton.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CoreExtensionButton": () => (/* binding */ CoreExtensionButton),
/* harmony export */   "WalletExtensionButton": () => (/* binding */ WalletExtensionButton)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@emotion/react/dist/emotion-react.browser.esm.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const flip = _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.keyframes`
  from {
    transform: rotateX(0deg);
  }

  to {
    transform: rotateX(360deg);
  }
`;
const StyledMenuItem = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.MenuItem)`
  img {
    transition: transform 0.3s ease-in-out;
  }
  color: ${({
  theme
}) => theme.palette.text.secondary};
  &:hover {
    color: ${({
  theme
}) => theme.palette.text.primary};
    img {
      animation: ${flip} 0.5s ease-in-out;
    }
  }
`;
const CoreButton = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button)`
  img {
    transition: transform 0.3s ease-in-out;
    border-radius: 50%;
  }
  color: ${({
  theme
}) => theme.palette.text.secondary};
  &:hover {
    color: ${({
  theme
}) => theme.palette.text.primary};
    img {
      animation: ${flip} 0.5s ease-in-out;
    }
  }
`;
const StyledButtonGroup = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.ButtonGroup)`
  border-radius: 999px;
`;
function CoreExtensionButton({
  info,
  onClick
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  return /*#__PURE__*/React.createElement(CoreButton, {
    color: "secondary",
    size: "large",
    sx: {
      gap: 1,
      my: 2
    },
    onClick: onClick,
    fullWidth: true
  }, /*#__PURE__*/React.createElement("img", {
    src: info?.icon,
    width: 24,
    height: 24
  }), info?.name || t('Unknown'));
}
function WalletExtensionButton({
  wallets,
  onClick
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const toggleButtonRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();
  const [isMenuOpen, setIsMenuOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  return /*#__PURE__*/React.createElement(StyledButtonGroup, {
    color: "secondary",
    variant: "contained",
    fullWidth: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.ClickAwayListener, {
    onClickAway: () => setIsMenuOpen(false)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    ref: toggleButtonRef,
    onClick: () => setIsMenuOpen(open => !open),
    sx: {
      gap: 1,
      borderTopLeftRadius: '999px !important',
      borderBottomLeftRadius: '999px !important'
    },
    "data-testid": 'add-primary-account'
  }, t('Other Wallets')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    ref: toggleButtonRef,
    onClick: () => setIsMenuOpen(open => !open),
    sx: {
      width: '56px',
      borderTopRightRadius: '999px !important',
      borderBottomRightRadius: '999px !important'
    },
    "data-testid": "account-options"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.ChevronDownIcon, {
    size: 24,
    sx: {
      transition: 'transform ease-in-out .15s',
      transform: isMenuOpen ? 'rotateX(180deg)' : 'none'
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Popper, {
    open: isMenuOpen,
    anchorEl: toggleButtonRef.current,
    placement: "top-end",
    transition: true
  }, ({
    TransitionProps
  }) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, TransitionProps, {
    timeout: 250
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.MenuList, {
    dense: true,
    sx: {
      p: 0,
      py: 0.5,
      mb: 1,
      overflow: 'hidden',
      backgroundColor: 'grey.800',
      width: '180px'
    }
  }, wallets && wallets.map((wallet, index) => {
    if (wallet.rdns === 'app.core.extension') {
      return;
    }
    return /*#__PURE__*/React.createElement(StyledMenuItem, {
      onClick: () => onClick(index),
      "data-testid": "add-import-account",
      key: wallet.name,
      sx: {
        py: 1
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: wallet.icon,
      height: 24,
      style: {
        paddingRight: '16px'
      }
    }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, null, wallet.name));
  }))))))));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FwcHJvdmVBY3Rpb25fU2VsZWN0V2FsbGV0X3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUErRDtBQUMzQjtBQUU3QixTQUFTRSxjQUFjQSxDQUFBLEVBQUc7RUFDL0Isb0JBQ0VDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDSCw2Q0FBTyxxQkFDTkUsS0FBQSxDQUFBQyxhQUFBLENBQUNKLHlFQUFnQixPQUFHLENBQ1o7QUFFZDs7Ozs7Ozs7Ozs7Ozs7OztBQ1Q0RDtBQUVyRCxNQUFNTyxVQUFVLEdBQUdELHVFQUFNLENBQUNELDhEQUFLLENBQXVCO0FBQzdEO0FBQ0E7QUFDQSxzQkFBc0IsQ0FBQztFQUFFRztBQUFNLENBQUMsS0FBS0EsS0FBSyxDQUFDQyxPQUFPLENBQUNDLFVBQVUsQ0FBQ0MsS0FBTTtBQUNwRTtBQUNBO0FBQ0E7QUFDQSxZQUFZLENBQUM7RUFBRUM7QUFBTyxDQUFDLEtBQUtBLE1BQU0sSUFBSSxPQUFRO0FBQzlDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWeUY7QUFRekM7QUFDc0I7QUFDQztBQUNhO0FBQzVCO0FBSWhCO0FBQzZCO0FBQ1U7QUE0QnpFLFNBQVNhLGdCQUFnQkEsQ0FDOUJDLFFBQWdCLEVBQ2hCQyxlQUF3QixHQUFHLEtBQUssRUFDNkI7RUFDN0QsTUFBTTtJQUFFQztFQUFRLENBQUMsR0FBR1osc0ZBQW9CLEVBQUU7RUFDMUMsTUFBTWEsY0FBYyxHQUFHUCw2RkFBNkIsQ0FDbERELG9GQUF3QixDQUN6QjtFQUNELE1BQU07SUFBRVU7RUFBUyxDQUFDLEdBQUdSLG9GQUFtQixFQUFFO0VBQzFDLE1BQU0sQ0FBQ1MsTUFBTSxFQUFFQyxTQUFTLENBQUMsR0FBR2IsK0NBQVEsRUFBc0M7RUFDMUUsTUFBTSxDQUFDYyxLQUFLLEVBQUVDLFFBQVEsQ0FBQyxHQUFHZiwrQ0FBUSxDQUFTLEVBQUUsQ0FBQztFQUU5QyxNQUFNZ0IsWUFBK0QsR0FDbkVsQixrREFBVyxDQUNU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QixDQUFDO0VBQ0gsQ0FBQyxFQUFFLENBQUNqSCxhQUFhLEVBQUVyQixjQUFjLENBQUMsQ0FBQztBQUNyQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vTG9hZGluZ092ZXJsYXkudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vU2l0ZUF2YXRhci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VBcHByb3ZlQWN0aW9uLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlR2V0UmVxdWVzdElkLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQXBwcm92ZUFjdGlvbi9TZWxlY3RXYWxsZXQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvV2FsbGV0L2NvbXBvbmVudHMvV2FsbGV0RXh0ZW5zaW9uQnV0dG9uLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL2FjdGlvbnMvZ2V0VXBkYXRlZEFjdGlvbkRhdGEudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy91c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2lyY3VsYXJQcm9ncmVzcyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPdmVybGF5IH0gZnJvbSAnLi9PdmVybGF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIExvYWRpbmdPdmVybGF5KCkge1xuICByZXR1cm4gKFxuICAgIDxPdmVybGF5PlxuICAgICAgPENpcmN1bGFyUHJvZ3Jlc3MgLz5cbiAgICA8L092ZXJsYXk+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBTdGFjaywgc3R5bGVkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IFNpdGVBdmF0YXIgPSBzdHlsZWQoU3RhY2spPHsgbWFyZ2luPzogc3RyaW5nIH0+YFxuICB3aWR0aDogODBweDtcbiAgaGVpZ2h0OiA4MHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLnBhbGV0dGUuYmFja2dyb3VuZC5wYXBlcn07XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIG1hcmdpbjogJHsoeyBtYXJnaW4gfSkgPT4gbWFyZ2luID8/ICc4cHggMCd9O1xuYDtcbiIsImltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgR2V0QWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL2hhbmRsZXJzL2dldEFjdGlvbnMnO1xuaW1wb3J0IHsgVXBkYXRlQWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL2hhbmRsZXJzL3VwZGF0ZUFjdGlvbic7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblVwZGF0ZSxcbiAgTXVsdGlUeEFjdGlvbixcbiAgaXNCYXRjaEFwcHJvdmFsQWN0aW9uLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgQWN0aW9uU3RhdHVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IHVzZUNvbm5lY3Rpb25Db250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db25uZWN0aW9uUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuIH0gZnJvbSAnQHNyYy91dGlscy91c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4nO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBDb250ZXh0Q29udGFpbmVyLFxuICB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcixcbn0gZnJvbSAnLi91c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcic7XG5pbXBvcnQgeyB1c2VBcHByb3ZhbHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BcHByb3ZhbHNQcm92aWRlcic7XG5pbXBvcnQgeyBnZXRVcGRhdGVkU2lnbmluZ0RhdGEgfSBmcm9tICdAc3JjL3V0aWxzL2FjdGlvbnMvZ2V0VXBkYXRlZEFjdGlvbkRhdGEnO1xuXG50eXBlIEFjdGlvblR5cGU8SXNCYXRjaEFwcHJvdmFsPiA9IElzQmF0Y2hBcHByb3ZhbCBleHRlbmRzIHRydWVcbiAgPyBNdWx0aVR4QWN0aW9uXG4gIDogQWN0aW9uO1xuXG50eXBlIEFjdGlvblVwZGF0ZXI8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+ID0gKFxuICBwYXJhbXM6IEFjdGlvblVwZGF0ZTxcbiAgICBQYXJ0aWFsPFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uID8gVFsnZGlzcGxheURhdGEnXSA6IG5ldmVyPlxuICA+LFxuICBzaG91bGRXYWl0Rm9yUmVzcG9uc2U/OiBib29sZWFuLFxuKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuXG50eXBlIEhvb2tSZXN1bHQ8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+ID0ge1xuICBhY3Rpb246IFQ7XG4gIHVwZGF0ZUFjdGlvbjogQWN0aW9uVXBkYXRlcjxUPjtcbiAgZXJyb3I6IHN0cmluZztcbiAgY2FuY2VsSGFuZGxlcjogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uPERpc3BsYXlEYXRhID0gYW55PihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsPzogZmFsc2UsXG4pOiBIb29rUmVzdWx0PEFjdGlvbjxEaXNwbGF5RGF0YT4+O1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb24oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbD86IHRydWUsXG4pOiBIb29rUmVzdWx0PE11bHRpVHhBY3Rpb24+O1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb248RGlzcGxheURhdGEgPSBhbnk+KFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw6IGJvb2xlYW4gPSBmYWxzZSxcbik6IEhvb2tSZXN1bHQ8QWN0aW9uPERpc3BsYXlEYXRhPiB8IE11bHRpVHhBY3Rpb24gfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBjb25zdCBpc0NvbmZpcm1Qb3B1cCA9IHVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyKFxuICAgIENvbnRleHRDb250YWluZXIuQ09ORklSTSxcbiAgKTtcbiAgY29uc3QgeyBhcHByb3ZhbCB9ID0gdXNlQXBwcm92YWxzQ29udGV4dCgpO1xuICBjb25zdCBbYWN0aW9uLCBzZXRBY3Rpb25dID0gdXNlU3RhdGU8QWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPj4oKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcblxuICBjb25zdCB1cGRhdGVBY3Rpb246IEFjdGlvblVwZGF0ZXI8QWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPj4gPVxuICAgIHVzZUNhbGxiYWNrKFxuICAgICAgYXN5bmMgKHBhcmFtcywgc2hvdWxkV2FpdEZvclJlc3BvbnNlKSA9PiB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gdXBkYXRlIHRoZSBzdGF0dXMgYSBiaXQgZmFzdGVyIGZvciBzbW9vdGhlciBVWC5cbiAgICAgICAgLy8gdXNlIGZ1bmN0aW9uIHRvIGF2b2lkIGBhY3Rpb25gIGFzIGEgZGVwZW5kZW5jeSBhbmQgdGh1cyBpbmZpbml0ZSBsb29wc1xuICAgICAgICBzZXRBY3Rpb24oKHByZXZBY3Rpb25EYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKCFwcmV2QWN0aW9uRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEZvciBNdWx0aVR4QWN0aW9uLCB3ZSBkb24ndCBhbGxvdyBhbnkgdXBkYXRlcyBiZXNpZGVzIHRoZSBzdGF0dXMuXG4gICAgICAgICAgaWYgKGlzQmF0Y2hBcHByb3ZhbEFjdGlvbihwcmV2QWN0aW9uRGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLFxuICAgICAgICAgICAgICBzdGF0dXM6IHBhcmFtcy5zdGF0dXMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YSxcbiAgICAgICAgICAgIHN0YXR1czogcGFyYW1zLnN0YXR1cyxcbiAgICAgICAgICAgIGRpc3BsYXlEYXRhOiB7XG4gICAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLmRpc3BsYXlEYXRhLFxuICAgICAgICAgICAgICAuLi5wYXJhbXMuZGlzcGxheURhdGEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lnbmluZ0RhdGE6IGdldFVwZGF0ZWRTaWduaW5nRGF0YShcbiAgICAgICAgICAgICAgcHJldkFjdGlvbkRhdGEuc2lnbmluZ0RhdGEsXG4gICAgICAgICAgICAgIHBhcmFtcy5zaWduaW5nRGF0YSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSA9XG4gICAgICAgICAgaXNDb25maXJtUG9wdXAgJiYgcGFyYW1zLnN0YXR1cyAhPT0gQWN0aW9uU3RhdHVzLlBFTkRJTkc7XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3Q8VXBkYXRlQWN0aW9uSGFuZGxlcj4oe1xuICAgICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5BQ1RJT05fVVBEQVRFLFxuICAgICAgICAgIHBhcmFtczogW3BhcmFtcywgc2hvdWxkV2FpdEZvclJlc3BvbnNlXSxcbiAgICAgICAgfSkuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHNob3VsZENsb3NlQWZ0ZXJVcGRhdGUpIHtcbiAgICAgICAgICAgIGdsb2JhbFRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIFtyZXF1ZXN0LCBpc0NvbmZpcm1Qb3B1cF0sXG4gICAgKTtcblxuICBjb25zdCBjYW5jZWxIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKCkgPT5cbiAgICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICAgIHN0YXR1czogQWN0aW9uU3RhdHVzLkVSUk9SX1VTRVJfQ0FOQ0VMRUQsXG4gICAgICAgIGlkOiBhY3Rpb25JZCxcbiAgICAgIH0pLFxuICAgIFthY3Rpb25JZCwgdXBkYXRlQWN0aW9uXSxcbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpc0NvbmZpcm1Qb3B1cCkge1xuICAgICAgcmVxdWVzdDxHZXRBY3Rpb25IYW5kbGVyPih7XG4gICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5BQ1RJT05fR0VULFxuICAgICAgICBwYXJhbXM6IFthY3Rpb25JZF0sXG4gICAgICB9KS50aGVuKChhKSA9PiB7XG4gICAgICAgIGlmIChpc0JhdGNoQXBwcm92YWwgJiYgIWlzQmF0Y2hBcHByb3ZhbEFjdGlvbihhKSkge1xuICAgICAgICAgIHNldEVycm9yKCdFeHBlY3RlZCBhIGJhdGNoIGFwcHJvdmFsIGFjdGlvbicpO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0JhdGNoQXBwcm92YWwgJiYgaXNCYXRjaEFwcHJvdmFsQWN0aW9uKGEpKSB7XG4gICAgICAgICAgc2V0RXJyb3IoJ0V4cGVjdGVkIGEgc2luZ2xlIGFwcHJvdmFsIGFjdGlvbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldEFjdGlvbihhIGFzIEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGFwcHJvdmFsPy5hY3Rpb24uYWN0aW9uSWQgPT09IGFjdGlvbklkKSB7XG4gICAgICBzZXRBY3Rpb24oYXBwcm92YWwuYWN0aW9uIGFzIEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4pO1xuICAgIH1cbiAgfSwgW2FjdGlvbklkLCByZXF1ZXN0LCBhcHByb3ZhbCwgaXNDb25maXJtUG9wdXAsIGlzQmF0Y2hBcHByb3ZhbF0pO1xuXG4gIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyKTtcblxuICByZXR1cm4geyBhY3Rpb24sIHVwZGF0ZUFjdGlvbiwgZXJyb3IsIGNhbmNlbEhhbmRsZXIgfTtcbn1cbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG4vKipcbiAqIFRoaXMgaXMgdXNlZCB0byBnZXQgdGhlIGlkIG9mIGEgdHJhbnNhY3Rpb24gb3IgbWVzc2FnZSB0aGF0XG4gKiBoYXMgYmVlbiBwdXQgaW50byBsb2NhbHN0b3JhZ2UgYW5kIHRvIGJlIHVzZWQgYWNyb3NzIG11bHRpcGxlXG4gKiBjb250ZXh0cy4gV2UgZ3JhYiB0aGUgcXVlcnkgcGFyYW0gYW5kIHVzZSB0aGF0IHRvIGdldCB0aGUgaXRlbSBvdXQgb2Ygc3RvcmFnZS5cbiAqXG4gKiBAcmV0dXJucyBpZCBmcm9tIHRoZSBxdWVyeSBwYXJhbVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlR2V0UmVxdWVzdElkKCkge1xuICBjb25zdCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uc2VhcmNoID8/ICcnKTtcbiAgICByZXR1cm4gc2VhcmNoUGFyYW1zLmdldCgnYWN0aW9uSWQnKSA/PyAnJztcbiAgfSwgW2xvY2F0aW9uLnNlYXJjaF0pO1xufVxuIiwiaW1wb3J0IHsgQWN0aW9uU3RhdHVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IFNpdGVBdmF0YXIgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1NpdGVBdmF0YXInO1xuaW1wb3J0IHsgdXNlQXBwcm92ZUFjdGlvbiB9IGZyb20gJ0BzcmMvaG9va3MvdXNlQXBwcm92ZUFjdGlvbic7XG5pbXBvcnQgeyB1c2VHZXRSZXF1ZXN0SWQgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUdldFJlcXVlc3RJZCc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IExvYWRpbmdPdmVybGF5IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb21tb24vTG9hZGluZ092ZXJsYXknO1xuaW1wb3J0IHtcbiAgV2FsbGV0RXh0ZW5zaW9uQnV0dG9uLFxuICBDb3JlRXh0ZW5zaW9uQnV0dG9uLFxufSBmcm9tICcuLi9XYWxsZXQvY29tcG9uZW50cy9XYWxsZXRFeHRlbnNpb25CdXR0b24nO1xuaW1wb3J0IHsgVHJhbnMgfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5LCBXYWxsZXRJY29uIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIFNlbGVjdFdhbGxldCgpIHtcbiAgY29uc3QgcmVxdWVzdElkID0gdXNlR2V0UmVxdWVzdElkKCk7XG4gIGNvbnN0IHsgYWN0aW9uOiByZXF1ZXN0LCB1cGRhdGVBY3Rpb24gfSA9IHVzZUFwcHJvdmVBY3Rpb24ocmVxdWVzdElkKTtcblxuICBjb25zdCBzZWxlY3RXYWxsZXQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoaW5kZXg6IG51bWJlciB8IHN0cmluZykgPT5cbiAgICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICAgIHN0YXR1czogQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcsXG4gICAgICAgIGlkOiByZXF1ZXN0SWQsXG4gICAgICAgIHJlc3VsdDogaW5kZXgsXG4gICAgICB9KSxcbiAgICBbcmVxdWVzdElkLCB1cGRhdGVBY3Rpb25dLFxuICApO1xuXG4gIGlmICghcmVxdWVzdCkge1xuICAgIHJldHVybiA8TG9hZGluZ092ZXJsYXkgLz47XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8U3RhY2s+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgcHg6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTaXRlQXZhdGFyPlxuICAgICAgICAgIDxXYWxsZXRJY29uIHNpemU9ezQ4fSAvPlxuICAgICAgICA8L1NpdGVBdmF0YXI+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiIHN4PXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIG10OiAzLCBtYjogMiB9fT5cbiAgICAgICAgICA8VHJhbnMgaTE4bktleT1cIldoaWNoIHdhbGxldCB3b3VsZCA8YnIgLz4geW91IGxpa2UgdG8gdXNlP1wiIC8+XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHkgc3g9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fSB2YXJpYW50PVwiYm9keTFcIj5cbiAgICAgICAgICA8VHJhbnMgaTE4bktleT1cIkl0IGxvb2tzIGxpa2UgbXVsdGlwbGUgd2FsbGV0cyBhcmUgaW5zdGFsbGVkLiA8YnIgLz4gU2VsZWN0IHdoaWNoIG9uZSB5b3Ugd291bGQgbGlrZSB0byBjb25uZWN0LlwiIC8+XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvU3RhY2s+XG4gICAgICA8U3RhY2s+XG4gICAgICAgIHtyZXF1ZXN0LmRpc3BsYXlEYXRhLmluZm8ubWFwKChpbmZvLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChpbmZvLnJkbnMgPT09ICdhcHAuY29yZS5leHRlbnNpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8Q29yZUV4dGVuc2lvbkJ1dHRvblxuICAgICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgc2VsZWN0V2FsbGV0KGluZGV4KTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGluZm89e2luZm99XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0pfVxuICAgICAgICB7cmVxdWVzdC5kaXNwbGF5RGF0YS5pbmZvLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgIDxXYWxsZXRFeHRlbnNpb25CdXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9eyhpbmRleCkgPT4ge1xuICAgICAgICAgICAgICBzZWxlY3RXYWxsZXQoaW5kZXgpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHdhbGxldHM9e3JlcXVlc3QuZGlzcGxheURhdGEuaW5mb31cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQnV0dG9uR3JvdXAsXG4gIENoZXZyb25Eb3duSWNvbixcbiAgQ2xpY2tBd2F5TGlzdGVuZXIsXG4gIEdyb3csXG4gIGtleWZyYW1lcyxcbiAgTWVudUl0ZW0sXG4gIE1lbnVMaXN0LFxuICBQb3BwZXIsXG4gIFN0YWNrLFxuICBzdHlsZWQsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IFdhbGxldEV4dGVuc2lvblR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2ViMy9tb2RlbHMnO1xuaW1wb3J0IHsgRUlQNjk2M1Byb3ZpZGVySW5mbyB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbnRlcmZhY2UgV2FsbGV0RXh0ZW5zaW9uQnV0dG9uUHJvcHMge1xuICB0eXBlPzogV2FsbGV0RXh0ZW5zaW9uVHlwZTtcbiAgaW5mbz86IEVJUDY5NjNQcm92aWRlckluZm87XG4gIG9uQ2xpY2s6IChpbmRleDogbnVtYmVyKSA9PiB2b2lkO1xuICB3YWxsZXRzPzogRUlQNjk2M1Byb3ZpZGVySW5mb1tdO1xufVxuXG5jb25zdCBmbGlwID0ga2V5ZnJhbWVzYFxuICBmcm9tIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoMGRlZyk7XG4gIH1cblxuICB0byB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDM2MGRlZyk7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZE1lbnVJdGVtID0gc3R5bGVkKE1lbnVJdGVtKWBcbiAgaW1nIHtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlLWluLW91dDtcbiAgfVxuICBjb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5wYWxldHRlLnRleHQuc2Vjb25kYXJ5fTtcbiAgJjpob3ZlciB7XG4gICAgY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUucGFsZXR0ZS50ZXh0LnByaW1hcnl9O1xuICAgIGltZyB7XG4gICAgICBhbmltYXRpb246ICR7ZmxpcH0gMC41cyBlYXNlLWluLW91dDtcbiAgICB9XG4gIH1cbmA7XG5jb25zdCBDb3JlQnV0dG9uID0gc3R5bGVkKEJ1dHRvbilgXG4gIGltZyB7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZS1pbi1vdXQ7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICB9XG4gIGNvbG9yOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLnBhbGV0dGUudGV4dC5zZWNvbmRhcnl9O1xuICAmOmhvdmVyIHtcbiAgICBjb2xvcjogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5wYWxldHRlLnRleHQucHJpbWFyeX07XG4gICAgaW1nIHtcbiAgICAgIGFuaW1hdGlvbjogJHtmbGlwfSAwLjVzIGVhc2UtaW4tb3V0O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkQnV0dG9uR3JvdXAgPSBzdHlsZWQoQnV0dG9uR3JvdXApYFxuICBib3JkZXItcmFkaXVzOiA5OTlweDtcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBDb3JlRXh0ZW5zaW9uQnV0dG9uKHtcbiAgaW5mbyxcbiAgb25DbGljayxcbn06IFdhbGxldEV4dGVuc2lvbkJ1dHRvblByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICByZXR1cm4gKFxuICAgIDxDb3JlQnV0dG9uXG4gICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgc3g9e3sgZ2FwOiAxLCBteTogMiB9fVxuICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgIGZ1bGxXaWR0aFxuICAgID5cbiAgICAgIDxpbWcgc3JjPXtpbmZvPy5pY29ufSB3aWR0aD17MjR9IGhlaWdodD17MjR9IC8+XG4gICAgICB7aW5mbz8ubmFtZSB8fCB0KCdVbmtub3duJyl9XG4gICAgPC9Db3JlQnV0dG9uPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gV2FsbGV0RXh0ZW5zaW9uQnV0dG9uKHtcbiAgd2FsbGV0cyxcbiAgb25DbGljayxcbn06IFdhbGxldEV4dGVuc2lvbkJ1dHRvblByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdG9nZ2xlQnV0dG9uUmVmID0gdXNlUmVmKCk7XG4gIGNvbnN0IFtpc01lbnVPcGVuLCBzZXRJc01lbnVPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgcmV0dXJuIChcbiAgICA8U3R5bGVkQnV0dG9uR3JvdXAgY29sb3I9XCJzZWNvbmRhcnlcIiB2YXJpYW50PVwiY29udGFpbmVkXCIgZnVsbFdpZHRoPlxuICAgICAgPENsaWNrQXdheUxpc3RlbmVyIG9uQ2xpY2tBd2F5PXsoKSA9PiBzZXRJc01lbnVPcGVuKGZhbHNlKX0+XG4gICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93Jywgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICByZWY9e3RvZ2dsZUJ1dHRvblJlZn1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzTWVudU9wZW4oKG9wZW4pID0+ICFvcGVuKX1cbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wTGVmdFJhZGl1czogJzk5OXB4ICFpbXBvcnRhbnQnLFxuICAgICAgICAgICAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiAnOTk5cHggIWltcG9ydGFudCcsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9eydhZGQtcHJpbWFyeS1hY2NvdW50J31cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnT3RoZXIgV2FsbGV0cycpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuXG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgcmVmPXt0b2dnbGVCdXR0b25SZWZ9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc01lbnVPcGVuKChvcGVuKSA9PiAhb3Blbil9XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB3aWR0aDogJzU2cHgnLFxuICAgICAgICAgICAgICBib3JkZXJUb3BSaWdodFJhZGl1czogJzk5OXB4ICFpbXBvcnRhbnQnLFxuICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogJzk5OXB4ICFpbXBvcnRhbnQnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWNjb3VudC1vcHRpb25zXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Q2hldnJvbkRvd25JY29uXG4gICAgICAgICAgICAgIHNpemU9ezI0fVxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gZWFzZS1pbi1vdXQgLjE1cycsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc01lbnVPcGVuID8gJ3JvdGF0ZVgoMTgwZGVnKScgOiAnbm9uZScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFBvcHBlclxuICAgICAgICAgICAgICBvcGVuPXtpc01lbnVPcGVufVxuICAgICAgICAgICAgICBhbmNob3JFbD17dG9nZ2xlQnV0dG9uUmVmLmN1cnJlbnR9XG4gICAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcC1lbmRcIlxuICAgICAgICAgICAgICB0cmFuc2l0aW9uXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHsoeyBUcmFuc2l0aW9uUHJvcHMgfSkgPT4gKFxuICAgICAgICAgICAgICAgIDxHcm93IHsuLi5UcmFuc2l0aW9uUHJvcHN9IHRpbWVvdXQ9ezI1MH0+XG4gICAgICAgICAgICAgICAgICA8TWVudUxpc3RcbiAgICAgICAgICAgICAgICAgICAgZGVuc2VcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBwOiAwLFxuICAgICAgICAgICAgICAgICAgICAgIHB5OiAwLjUsXG4gICAgICAgICAgICAgICAgICAgICAgbWI6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZXkuODAwJyxcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzE4MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3dhbGxldHMgJiZcbiAgICAgICAgICAgICAgICAgICAgICB3YWxsZXRzLm1hcCgod2FsbGV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdhbGxldC5yZG5zID09PSAnYXBwLmNvcmUuZXh0ZW5zaW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8U3R5bGVkTWVudUl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKGluZGV4KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFkZC1pbXBvcnQtYWNjb3VudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXt3YWxsZXQubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBweTogMSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXt3YWxsZXQuaWNvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD17MjR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6ICcxNnB4JyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHk+e3dhbGxldC5uYW1lfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9TdHlsZWRNZW51SXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICA8L01lbnVMaXN0PlxuICAgICAgICAgICAgICAgIDwvR3Jvdz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvUG9wcGVyPlxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9DbGlja0F3YXlMaXN0ZW5lcj5cbiAgICA8L1N0eWxlZEJ1dHRvbkdyb3VwPlxuICApO1xufVxuIiwiaW1wb3J0IHsgU2lnbmluZ0RhdGEgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhID0gKFxuICBvbGRTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuICBuZXdTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuKTogU2lnbmluZ0RhdGEgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoIW9sZFNpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG5ld1NpZ25pbmdEYXRhO1xuICB9IGVsc2UgaWYgKCFuZXdTaWduaW5nRGF0YSkge1xuICAgIHJldHVybiBvbGRTaWduaW5nRGF0YTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub2xkU2lnbmluZ0RhdGEsXG4gICAgLi4ubmV3U2lnbmluZ0RhdGEsXG4gIH07XG59O1xuIiwiaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgZnJvbUV2ZW50UGF0dGVybiwgbWVyZ2UgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICAgZnJvbUV2ZW50UGF0dGVybihcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLnBpcGUoXG4gICAgICAgIGZpbHRlcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbic7XG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIE9ubHkgY2xvc2UgZm9yIHBvcHVwIHdpbmRvd3MuIFRoZSBleHRlbnNpb24gVUkgc2hvdWxkIG5vdCByZWFjdCB0aGlzIHdheS5cbiAgICAgICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW2NhbmNlbEhhbmRsZXIsIGlzQ29uZmlybVBvcHVwXSk7XG59XG4iXSwibmFtZXMiOlsiQ2lyY3VsYXJQcm9ncmVzcyIsIk92ZXJsYXkiLCJMb2FkaW5nT3ZlcmxheSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIlN0YWNrIiwic3R5bGVkIiwiU2l0ZUF2YXRhciIsInRoZW1lIiwicGFsZXR0ZSIsImJhY2tncm91bmQiLCJwYXBlciIsIm1hcmdpbiIsIkV4dGVuc2lvblJlcXVlc3QiLCJpc0JhdGNoQXBwcm92YWxBY3Rpb24iLCJBY3Rpb25TdGF0dXMiLCJ1c2VDb25uZWN0aW9uQ29udGV4dCIsInVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbiIsInVzZUNhbGxiYWNrIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJDb250ZXh0Q29udGFpbmVyIiwidXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIiLCJ1c2VBcHByb3ZhbHNDb250ZXh0IiwiZ2V0VXBkYXRlZFNpZ25pbmdEYXRhIiwidXNlQXBwcm92ZUFjdGlvbiIsImFjdGlvbklkIiwiaXNCYXRjaEFwcHJvdmFsIiwicmVxdWVzdCIsImlzQ29uZmlybVBvcHVwIiwiQ09ORklSTSIsImFwcHJvdmFsIiwiYWN0aW9uIiwic2V0QWN0aW9uIiwiZXJyb3IiLCJzZXRFcnJvciIsInVwZGF0ZUFjdGlvbiIsInBhcmFtcyIsInNob3VsZFdhaXRGb3JSZXNwb25zZSIsInByZXZBY3Rpb25EYXRhIiwic3RhdHVzIiwiZGlzcGxheURhdGEiLCJzaWduaW5nRGF0YSIsInNob3VsZENsb3NlQWZ0ZXJVcGRhdGUiLCJQRU5ESU5HIiwibWV0aG9kIiwiQUNUSU9OX1VQREFURSIsImZpbmFsbHkiLCJnbG9iYWxUaGlzIiwiY2xvc2UiLCJjYW5jZWxIYW5kbGVyIiwiRVJST1JfVVNFUl9DQU5DRUxFRCIsImlkIiwiQUNUSU9OX0dFVCIsInRoZW4iLCJhIiwidXNlTWVtbyIsInVzZUxvY2F0aW9uIiwidXNlR2V0UmVxdWVzdElkIiwibG9jYXRpb24iLCJzZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJzZWFyY2giLCJnZXQiLCJXYWxsZXRFeHRlbnNpb25CdXR0b24iLCJDb3JlRXh0ZW5zaW9uQnV0dG9uIiwiVHJhbnMiLCJUeXBvZ3JhcGh5IiwiV2FsbGV0SWNvbiIsIlNlbGVjdFdhbGxldCIsInJlcXVlc3RJZCIsInNlbGVjdFdhbGxldCIsImluZGV4IiwiU1VCTUlUVElORyIsInJlc3VsdCIsInN4IiwiZmxleEdyb3ciLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJweCIsInNpemUiLCJ2YXJpYW50IiwidGV4dEFsaWduIiwibXQiLCJtYiIsImkxOG5LZXkiLCJpbmZvIiwibWFwIiwicmRucyIsImtleSIsIm9uQ2xpY2siLCJsZW5ndGgiLCJ3YWxsZXRzIiwidXNlVHJhbnNsYXRpb24iLCJCdXR0b24iLCJCdXR0b25Hcm91cCIsIkNoZXZyb25Eb3duSWNvbiIsIkNsaWNrQXdheUxpc3RlbmVyIiwiR3JvdyIsImtleWZyYW1lcyIsIk1lbnVJdGVtIiwiTWVudUxpc3QiLCJQb3BwZXIiLCJ1c2VSZWYiLCJmbGlwIiwiU3R5bGVkTWVudUl0ZW0iLCJ0ZXh0Iiwic2Vjb25kYXJ5IiwicHJpbWFyeSIsIkNvcmVCdXR0b24iLCJTdHlsZWRCdXR0b25Hcm91cCIsInQiLCJjb2xvciIsImdhcCIsIm15IiwiZnVsbFdpZHRoIiwic3JjIiwiaWNvbiIsIndpZHRoIiwiaGVpZ2h0IiwibmFtZSIsInRvZ2dsZUJ1dHRvblJlZiIsImlzTWVudU9wZW4iLCJzZXRJc01lbnVPcGVuIiwib25DbGlja0F3YXkiLCJmbGV4RGlyZWN0aW9uIiwicmVmIiwib3BlbiIsImJvcmRlclRvcExlZnRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwiYm9yZGVyVG9wUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21SaWdodFJhZGl1cyIsInRyYW5zaXRpb24iLCJ0cmFuc2Zvcm0iLCJhbmNob3JFbCIsImN1cnJlbnQiLCJwbGFjZW1lbnQiLCJUcmFuc2l0aW9uUHJvcHMiLCJfZXh0ZW5kcyIsInRpbWVvdXQiLCJkZW5zZSIsInAiLCJweSIsIm92ZXJmbG93IiwiYmFja2dyb3VuZENvbG9yIiwid2FsbGV0Iiwic3R5bGUiLCJwYWRkaW5nUmlnaHQiLCJvbGRTaWduaW5nRGF0YSIsIm5ld1NpZ25pbmdEYXRhIiwiZmlsdGVyIiwiZmlyc3QiLCJmcm9tRXZlbnRQYXR0ZXJuIiwibWVyZ2UiLCJzdWJzY3JpcHRpb24iLCJoYW5kbGVyIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwaXBlIiwiZG9jdW1lbnQiLCJ2aXNpYmlsaXR5U3RhdGUiLCJzdWJzY3JpYmUiLCJ1bnN1YnNjcmliZSJdLCJzb3VyY2VSb290IjoiIn0=