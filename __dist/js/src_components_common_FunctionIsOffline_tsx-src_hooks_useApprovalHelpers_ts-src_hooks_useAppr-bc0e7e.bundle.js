"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_FunctionIsOffline_tsx-src_hooks_useApprovalHelpers_ts-src_hooks_useAppr-bc0e7e"],{

/***/ "./node_modules/@avalabs/core-utils-sdk/esm/trunateAddress.js":
/*!********************************************************************!*\
  !*** ./node_modules/@avalabs/core-utils-sdk/esm/trunateAddress.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "truncateAddress": () => (/* binding */ s)
/* harmony export */ });
const s=(s,t=6)=>`${s.substring(0,t)}…${s.slice(-t/2)}`;


/***/ }),

/***/ "./src/components/common/FunctionIsOffline.tsx":
/*!*****************************************************!*\
  !*** ./src/components/common/FunctionIsOffline.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionIsOffline": () => (/* binding */ FunctionIsOffline),
/* harmony export */   "getTranslatedFunctionName": () => (/* binding */ getTranslatedFunctionName)
/* harmony export */ });
/* harmony import */ var _PageTitle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function getTranslatedFunctionName(name) {
  const translations = {
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.BRIDGE]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Bridge'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.SWAP]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Swap'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.SEND]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Send'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.BUY]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Buy'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.DEFI]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('DeFi'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.KEYSTONE]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Keystone'),
    [_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_2__.FunctionNames.TOKEN_DETAILS]: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Token Details')
  };
  return translations[name];
}
function FunctionIsOffline({
  functionName,
  hidePageTitle,
  children
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      height: '100%',
      width: '100%'
    }
  }, !hidePageTitle && /*#__PURE__*/React.createElement(_PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitle, {
    variant: _PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitleVariant.PRIMARY
  }, t('Sorry')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.AlertCircleIcon, {
    size: 72,
    sx: {
      mb: 3,
      mt: -9
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "h5",
    sx: {
      mb: 1
    }
  }, t('Feature Disabled')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    size: 16,
    align: "center",
    height: "24px",
    sx: {
      color: 'text.secondary'
    }
  }, t('{{functionName}} is currently unavailable.', {
    functionName: getTranslatedFunctionName(functionName) ?? t('This Feature')
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    sx: {
      color: 'text.secondary'
    }
  }, t('Please check back later and try again.')), children));
}

/***/ }),

/***/ "./src/components/common/walletConnect/useRequiredSession.ts":
/*!*******************************************************************!*\
  !*** ./src/components/common/walletConnect/useRequiredSession.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useRequiredSession": () => (/* binding */ useRequiredSession)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/operators/filter.js");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_background_services_walletConnect_events_eventFilters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/walletConnect/events/eventFilters */ "./src/background/services/walletConnect/events/eventFilters.ts");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");





const useRequiredSession = () => {
  const {
    tabId,
    events,
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_1__.useConnectionContext)();
  const [isValidSession, setIsValidSession] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [activeSession, setActiveSession] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [isNewConnectionRequired, setIsNewConnectionRequired] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const establishRequiredSession = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (address, chainId) => {
    setIsNewConnectionRequired(false);
    setIsLoading(true);
    const sessionSubscription = events().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.filter)(_src_background_services_walletConnect_events_eventFilters__WEBPACK_IMPORTED_MODULE_2__.isWalletConnectEvent)).subscribe(async event => {
      if (event.value.tabId !== tabId) {
        return;
      }

      // If any of the events came already, loading state is over.
      setIsLoading(false);

      // If a QR code came, we know we need to establish a new connection.
      if ((0,_src_background_services_walletConnect_events_eventFilters__WEBPACK_IMPORTED_MODULE_2__.isUriGeneratedEvent)(event)) {
        setIsNewConnectionRequired(true);
      }

      // If we have a session to the device, but it does not permit us to
      // send the request we need, we'll notify the user.
      if ((0,_src_background_services_walletConnect_events_eventFilters__WEBPACK_IMPORTED_MODULE_2__.isSessionPermissionsMismatchEvent)(event)) {
        setActiveSession(event.value.activeSession);
        setIsValidSession(false);
      }
    });
    request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_3__.ExtensionRequest.WALLET_CONNECT_ESTABLISH_REQUIRED_SESSION,
      params: [address, chainId]
    }).then(session => {
      setActiveSession(session);
      setIsValidSession(true);
    }).catch(() => {
      // This will be most likely triggered by the user rejecting our request
      // to switch the network automatically. If that happens, we'll fallback
      // to establishing a brand new connection.
      setActiveSession(null);
      setIsValidSession(false);
      setIsNewConnectionRequired(true);
    }).finally(() => {
      sessionSubscription.unsubscribe();
    });
  }, [events, tabId, request]);
  return {
    isLoading,
    isValidSession,
    isNewConnectionRequired,
    establishRequiredSession,
    activeSession
  };
};

/***/ }),

/***/ "./src/hooks/useApprovalHelpers.ts":
/*!*****************************************!*\
  !*** ./src/hooks/useApprovalHelpers.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useApprovalHelpers": () => (/* binding */ useApprovalHelpers)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useIsUsingLedgerWallet */ "./src/hooks/useIsUsingLedgerWallet.ts");
/* harmony import */ var _useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useIsUsingKeystoneWallet */ "./src/hooks/useIsUsingKeystoneWallet.ts");
/* harmony import */ var _useIsUsingWalletConnectAccount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useIsUsingWalletConnectAccount */ "./src/hooks/useIsUsingWalletConnectAccount.ts");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _useIsUsingFireblocksAccount__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./useIsUsingFireblocksAccount */ "./src/hooks/useIsUsingFireblocksAccount.ts");






function useApprovalHelpers({
  onApprove,
  onReject,
  pendingMessage,
  showPending
}) {
  const isUsingLedgerWallet = (0,_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const isUsingKeystoneWallet = (0,_useIsUsingKeystoneWallet__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const isUsingWalletConnectAccount = (0,_useIsUsingWalletConnectAccount__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const isUsingFireblocksAccount = (0,_useIsUsingFireblocksAccount__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const isTwoStepApproval = isUsingWalletConnectAccount || isUsingFireblocksAccount;
  const isUsingExternalSigner = isUsingLedgerWallet || isUsingKeystoneWallet || isUsingWalletConnectAccount || isUsingFireblocksAccount;
  const [isReadyToSign, setIsReadyToSign] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!isTwoStepApproval);
  const [isApprovalOverlayVisible, setIsApprovalOverlayVisible] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const pendingToastIdRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)('');
  const handleApproval = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    setIsApprovalOverlayVisible(isUsingExternalSigner);

    // If it's a two-step approval, do not call `onApprove` yet.
    // Instead, just toggle the isReadyToSign flag so that it's
    // called on a 2nd click.
    if (isTwoStepApproval && !isReadyToSign) {
      setIsReadyToSign(true);
      return;
    }
    if (pendingMessage && !isUsingExternalSigner && showPending) {
      const toastId = _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"].loading(pendingMessage);
      pendingToastIdRef.current = toastId;
    }

    // This has to be awaited, otherwise the overlay would disappear immediately.
    await onApprove();
    if (pendingToastIdRef.current) {
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"].dismiss(pendingToastIdRef.current);
    }
    setIsApprovalOverlayVisible(false);
  }, [isUsingExternalSigner, isTwoStepApproval, isReadyToSign, pendingMessage, showPending, onApprove]);
  const handleRejection = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    setIsApprovalOverlayVisible(false);
    if (isTwoStepApproval) {
      setIsReadyToSign(false);
    }
    await onReject();
  }, [isTwoStepApproval, onReject]);
  return {
    isApprovalOverlayVisible,
    handleApproval,
    handleRejection
  };
}

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

/***/ "./src/hooks/useIsUsingFireblocksAccount.ts":
/*!**************************************************!*\
  !*** ./src/hooks/useIsUsingFireblocksAccount.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");


const useIsUsingFireblocksAccount = () => {
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  return activeAccount?.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.AccountType.FIREBLOCKS;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useIsUsingFireblocksAccount);

/***/ }),

/***/ "./src/hooks/useIsUsingWalletConnectAccount.ts":
/*!*****************************************************!*\
  !*** ./src/hooks/useIsUsingWalletConnectAccount.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");


const useIsUsingWalletConnectAccount = () => {
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  return activeAccount?.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.AccountType.WALLET_CONNECT;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useIsUsingWalletConnectAccount);

/***/ }),

/***/ "./src/pages/Fireblocks/components/FireblocksAvatar.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/Fireblocks/components/FireblocksAvatar.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FireblocksAvatar": () => (/* binding */ FireblocksAvatar)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const FireblocksAvatar = ({
  badgeIcon = 'walletConnect'
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Badge, {
  overlap: "circular",
  badgeContent: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Avatar, {
    sx: {
      width: '24px',
      height: '24px',
      backgroundColor: badgeIcon === 'walletConnect' ? 'info.dark' : 'transparent',
      border: '1px solid',
      borderColor: 'background.paper'
    }
  }, badgeIcon === 'walletConnect' && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.WalletConnectIcon, {
    size: 16
  }), badgeIcon === 'bitcoin' && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.BitcoinColorIcon, {
    size: 24
  })),
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Avatar, {
  sx: {
    width: '64px',
    height: '64px',
    background: 'transparent',
    border: '1px solid',
    borderColor: 'primary.main'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.FireblocksIcon, {
  size: 32
})));

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectCircledIcon.tsx":
/*!***********************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectCircledIcon.tsx ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectCircledIcon": () => (/* binding */ WalletConnectCircledIcon)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const WalletConnectCircledIcon = () => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Avatar, {
  sx: {
    width: '64px',
    height: '64px',
    border: '1px solid',
    borderColor: 'info.dark'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.WalletConnectIcon, {
  size: 42
}));

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectConnector.tsx":
/*!*********************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectConnector.tsx ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WalletConnectConnector)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_WalletConnectContextProvider_WalletConnectContextProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/WalletConnectContextProvider/WalletConnectContextProvider */ "./src/contexts/WalletConnectContextProvider/WalletConnectContextProvider.tsx");
/* harmony import */ var _WalletConnectQRCode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WalletConnectQRCode */ "./src/pages/ImportWithWalletConnect/components/WalletConnectQRCode.tsx");
/* harmony import */ var _WalletConnectStatusMessage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WalletConnectStatusMessage */ "./src/pages/ImportWithWalletConnect/components/WalletConnectStatusMessage.tsx");
/* harmony import */ var _WalletConnectURIField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WalletConnectURIField */ "./src/pages/ImportWithWalletConnect/components/WalletConnectURIField.tsx");
/* harmony import */ var _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/WalletConnectContextProvider/models */ "./src/contexts/WalletConnectContextProvider/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








var WalletConnectTabs = /*#__PURE__*/function (WalletConnectTabs) {
  WalletConnectTabs[WalletConnectTabs["QR"] = 0] = "QR";
  WalletConnectTabs[WalletConnectTabs["URI"] = 1] = "URI";
  return WalletConnectTabs;
}(WalletConnectTabs || {});
function WalletConnectConnector({
  reconnectionAddress,
  customMessage,
  onConnect
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const [tab, setTab] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(WalletConnectTabs.QR);
  const {
    importState,
    reset,
    initiateImport
  } = (0,_src_contexts_WalletConnectContextProvider_WalletConnectContextProvider__WEBPACK_IMPORTED_MODULE_1__.useWalletConnectContext)();
  const hasConnectionUri = ('uri' in importState);
  const showRegenerateButton = importState.status === _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_5__.AccountImportStatus.Failed;

  // Reset import state on mount
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(reset, [reset]);

  // Initiate account import as soon as this page is displayed,
  // as long as it wasn't already initiated.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (importState.status === _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_5__.AccountImportStatus.NotInitiated) {
      initiateImport(reconnectionAddress, onConnect);
    }
  }, [initiateImport, reconnectionAddress, importState.status, onConnect]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      gap: 2.5,
      px: 2,
      height: '100%',
      width: '100%',
      alignItems: 'center'
    }
  }, hasConnectionUri && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tabs, {
    size: "medium",
    value: tab,
    onChange: (_, chosenTab) => setTab(chosenTab),
    isContained: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tab, {
    label: t('QR Code'),
    value: WalletConnectTabs.QR,
    "data-testid": "wc-tab-qr",
    sx: {
      mr: 0.5
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tab, {
    label: t('URI'),
    value: WalletConnectTabs.URI,
    "data-testid": "wc-tab-uri"
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.TabPanel, {
    value: tab,
    index: WalletConnectTabs.QR,
    sx: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      gap: 1.5,
      width: '200px',
      marginX: 'auto'
    }
  }, /*#__PURE__*/React.createElement(_WalletConnectQRCode__WEBPACK_IMPORTED_MODULE_2__.WalletConnectQRCode, {
    uri: importState.uri,
    status: importState.status
  }), /*#__PURE__*/React.createElement(_WalletConnectStatusMessage__WEBPACK_IMPORTED_MODULE_3__.WalletConnectStatusMessage, {
    importState: importState
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.TabPanel, {
    value: tab,
    index: WalletConnectTabs.URI
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      gap: 1.5,
      width: 220,
      marginX: 'auto'
    }
  }, /*#__PURE__*/React.createElement(_WalletConnectURIField__WEBPACK_IMPORTED_MODULE_4__.WalletConnectURIField, {
    uri: importState.uri,
    status: importState.status
  }), /*#__PURE__*/React.createElement(_WalletConnectStatusMessage__WEBPACK_IMPORTED_MODULE_3__.WalletConnectStatusMessage, {
    importState: importState
  })))), showRegenerateButton && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    sx: {
      mb: 4
    },
    onClick: () => initiateImport(reconnectionAddress, onConnect)
  }, t('Regenerate QR code')), !showRegenerateButton && tab === WalletConnectTabs.QR && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      mb: 4,
      width: '280px'
    }
  }, customMessage ?? t('Scan the QR code with your mobile wallet.'))), !hasConnectionUri && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      pt: 5.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Skeleton, {
    variant: "rectangular",
    width: "200px",
    height: "200px"
  })));
}

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectQRCode.tsx":
/*!******************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectQRCode.tsx ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectQRCode": () => (/* binding */ WalletConnectQRCode)
/* harmony export */ });
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qrcode.react */ "./node_modules/qrcode.react/lib/index.js");
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qrcode_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/getColorForStatus */ "./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const WalletConnectQRCode = ({
  uri,
  status
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Box, {
    sx: {
      display: 'inline-block',
      background: theme.palette.common.white,
      p: 0.5,
      borderRadius: 1,
      width: 200,
      height: 200,
      border: '2px solid transparent',
      transition: theme.transitions.create('border-color'),
      borderColor: (0,_utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__.getColorForStatus)(status)
    }
  }, /*#__PURE__*/React.createElement((qrcode_react__WEBPACK_IMPORTED_MODULE_0___default()), {
    renderAs: "svg",
    fgColor: theme.palette.common.black,
    bgColor: theme.palette.common.white,
    value: uri,
    level: "H",
    size: 188
  }));
};

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectStatusMessage.tsx":
/*!*************************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectStatusMessage.tsx ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectStatusMessage": () => (/* binding */ WalletConnectStatusMessage)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/WalletConnectContextProvider/models */ "./src/contexts/WalletConnectContextProvider/models.ts");
/* harmony import */ var _utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/getColorForStatus */ "./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const WalletConnectStatusMessage = ({
  importState,
  reconnectionAddress
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const hasConnectionFailed = importState.status === _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__.AccountImportStatus.Failed;
  const hasConnectionSucceeded = importState.status === _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__.AccountImportStatus.Successful;
  if (!hasConnectionFailed && !hasConnectionSucceeded) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    direction: "row",
    sx: {
      gap: 1,
      color: (0,_utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__.getColorForStatus)(importState.status),
      textAlign: 'start',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Box, {
    sx: {
      display: 'flex',
      marginTop: '-1px'
    }
  }, hasConnectionFailed ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.AlertCircleIcon, {
    size: 16
  }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CheckCircleIcon, {
    size: 16
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "caption"
  }, hasConnectionFailed ? importState.error : reconnectionAddress ? t('Scan successful. Waiting to be confirmed...') : t('Scan successful. Importing accounts...')));
};

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/WalletConnectURIField.tsx":
/*!********************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/WalletConnectURIField.tsx ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectURIField": () => (/* binding */ WalletConnectURIField)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/getColorForStatus */ "./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const WalletConnectURIField = ({
  uri,
  status
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const onCopyClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    navigator.clipboard.writeText(uri);
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"].success(t('Copied!'), {
      duration: 2000
    });
  }, [uri, t]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 224,
      height: 212,
      background: theme.palette.grey[850],
      wordWrap: 'break-word',
      px: 2,
      pt: 1.5,
      pb: 1,
      borderRadius: 1,
      fontSize: 14,
      userSelect: 'all',
      border: '1px solid transparent',
      transition: theme.transitions.create('border-color'),
      borderColor: (0,_utils_getColorForStatus__WEBPACK_IMPORTED_MODULE_1__.getColorForStatus)(status)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Scrollbars, null, uri), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 1,
      mt: -1,
      alignItems: 'flex-end',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.IconButton, {
    size: "small",
    sx: {
      opacity: 0.6,
      mr: -0.5
    },
    onClick: onCopyClick
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.CopyIcon, {
    size: 14
  }))));
};

/***/ }),

/***/ "./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts":
/*!*********************************************************************************!*\
  !*** ./src/pages/ImportWithWalletConnect/components/utils/getColorForStatus.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getColorForStatus": () => (/* binding */ getColorForStatus)
/* harmony export */ });
/* harmony import */ var _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/WalletConnectContextProvider/models */ "./src/contexts/WalletConnectContextProvider/models.ts");

const getColorForStatus = status => {
  switch (status) {
    case _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__.AccountImportStatus.Failed:
      return 'error.main';
    case _src_contexts_WalletConnectContextProvider_models__WEBPACK_IMPORTED_MODULE_0__.AccountImportStatus.Successful:
      return 'success.main';
  }
};

/***/ }),

/***/ "./src/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay.tsx":
/*!***********************************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay.tsx ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FireblocksApprovalOverlay": () => (/* binding */ FireblocksApprovalOverlay)
/* harmony export */ });
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_components_common_walletConnect_useRequiredSession__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/walletConnect/useRequiredSession */ "./src/components/common/walletConnect/useRequiredSession.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _WalletConnectApproval_WalletConnectApprovalConnect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../WalletConnectApproval/WalletConnectApprovalConnect */ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalConnect.tsx");
/* harmony import */ var _src_utils_shouldUseWalletConnectApproval__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/shouldUseWalletConnectApproval */ "./src/utils/shouldUseWalletConnectApproval.ts");
/* harmony import */ var _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/getActiveStepForRemoteApproval */ "./src/pages/SignTransaction/utils/getActiveStepForRemoteApproval.ts");
/* harmony import */ var _RemoteApproval_RemoteApprovalDialog__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../RemoteApproval/RemoteApprovalDialog */ "./src/pages/SignTransaction/components/RemoteApproval/RemoteApprovalDialog.tsx");
/* harmony import */ var _FireblocksApprovalReview__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./FireblocksApprovalReview */ "./src/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalReview.tsx");
/* harmony import */ var _Fireblocks_components_FireblocksAvatar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../Fireblocks/components/FireblocksAvatar */ "./src/pages/Fireblocks/components/FireblocksAvatar.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");












function FireblocksApprovalOverlay({
  onReject,
  onSubmit
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const {
    network: activeNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_0__.useNetworkContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_3__.useAccountsContext)();
  const [requestSent, setRequestSent] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const {
    activeSession,
    isValidSession,
    isNewConnectionRequired,
    establishRequiredSession
  } = (0,_src_components_common_walletConnect_useRequiredSession__WEBPACK_IMPORTED_MODULE_2__.useRequiredSession)();
  const shouldUseWalletConnectToApprove = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (!activeNetwork || !activeAccount) {
      return undefined;
    }
    return (0,_src_utils_shouldUseWalletConnectApproval__WEBPACK_IMPORTED_MODULE_5__["default"])(activeNetwork, activeAccount);
  }, [activeAccount, activeNetwork]);
  const activeStep = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (shouldUseWalletConnectToApprove === undefined) {
      return _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.ApprovalStep.LOADING;
    }
    if (shouldUseWalletConnectToApprove) {
      return (0,_utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.getActiveStep)(requestSent, activeSession, isNewConnectionRequired);
    } else {
      if (requestSent) {
        return _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.ApprovalStep.SENT;
      }
      return _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.ApprovalStep.APPROVAL;
    }
  }, [requestSent, isNewConnectionRequired, activeSession, shouldUseWalletConnectToApprove]);
  const pageTitle = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    switch (activeStep) {
      case _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.ApprovalStep.APPROVAL:
        return t('Fireblocks Approval');
      case _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.ApprovalStep.CONNECT:
        return t('Scan QR Code to Connect');
      default:
        return '';
    }
  }, [activeStep, t]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (activeAccount && activeNetwork) {
      establishRequiredSession(activeAccount.addressC, activeNetwork.chainId);
    }
  }, [activeAccount, activeNetwork, establishRequiredSession]);
  return /*#__PURE__*/React.createElement(_RemoteApproval_RemoteApprovalDialog__WEBPACK_IMPORTED_MODULE_7__.RemoteApprovalDialog, {
    onReject: onReject,
    pageTitle: pageTitle
  }, activeStep === _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.ApprovalStep.LOADING && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      mt: 20
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.CircularProgress, {
    size: 80
  })), (activeStep === _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.ApprovalStep.APPROVAL || activeStep === _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.ApprovalStep.SENT) && /*#__PURE__*/React.createElement(_FireblocksApprovalReview__WEBPACK_IMPORTED_MODULE_8__.FireblocksApprovalReview, {
    account: activeAccount,
    useWalletConnectApproval: shouldUseWalletConnectToApprove === undefined ? false : shouldUseWalletConnectToApprove,
    activeStep: activeStep,
    session: activeSession,
    isValidSession: isValidSession,
    onReject: onReject,
    onSign: () => {
      setRequestSent(true);
      onSubmit();
    }
  }), activeStep === _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_6__.ApprovalStep.CONNECT && /*#__PURE__*/React.createElement(_WalletConnectApproval_WalletConnectApprovalConnect__WEBPACK_IMPORTED_MODULE_4__.WalletConnectApprovalConnect, {
    appIcon: /*#__PURE__*/React.createElement(_Fireblocks_components_FireblocksAvatar__WEBPACK_IMPORTED_MODULE_9__.FireblocksAvatar, null),
    reconnectionAddress: activeAccount?.addressC,
    customMessage: t('Please reconnect using Wallet Connect to add this network to authorized networks.'),
    onConnect: () => {
      establishRequiredSession(activeAccount?.addressC, activeNetwork?.chainId);
    }
  }));
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalReview.tsx":
/*!**********************************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalReview.tsx ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FireblocksApprovalReview": () => (/* binding */ FireblocksApprovalReview)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/getActiveStepForRemoteApproval */ "./src/pages/SignTransaction/utils/getActiveStepForRemoteApproval.ts");
/* harmony import */ var _RemoteApproval_RemoteApprovalConfirmation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../RemoteApproval/RemoteApprovalConfirmation */ "./src/pages/SignTransaction/components/RemoteApproval/RemoteApprovalConfirmation.tsx");
/* harmony import */ var _src_pages_Fireblocks_components_FireblocksAvatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/pages/Fireblocks/components/FireblocksAvatar */ "./src/pages/Fireblocks/components/FireblocksAvatar.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/background/services/network/utils/isBitcoinNetwork */ "./src/background/services/network/utils/isBitcoinNetwork.ts");
/* harmony import */ var _src_background_services_fireblocks_utils_isFireblocksApiSupported__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/fireblocks/utils/isFireblocksApiSupported */ "./src/background/services/fireblocks/utils/isFireblocksApiSupported.ts");
/* harmony import */ var _src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/services/accounts/utils/typeGuards */ "./src/background/services/accounts/utils/typeGuards.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










function FireblocksApprovalReview({
  account,
  activeStep,
  useWalletConnectApproval,
  onReject,
  onSign,
  session,
  isValidSession
}) {
  const {
    network: activeNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__.useNetworkContext)();
  const status = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (activeStep === _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_1__.ApprovalStep.SENT) {
      return /*#__PURE__*/React.createElement(RequestPending, null);
    }
    if (useWalletConnectApproval) {
      return isValidSession ? /*#__PURE__*/React.createElement(ReadyToSign, null) : /*#__PURE__*/React.createElement(WrongNetwork, null);
    }
    return /*#__PURE__*/React.createElement(ReadyToSign, null);
  }, [activeStep, isValidSession, useWalletConnectApproval]);
  const isSessionValid = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (useWalletConnectApproval) {
      return isValidSession;
    }
    return (0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_7__.isFireblocksAccount)(account) && (0,_src_background_services_fireblocks_utils_isFireblocksApiSupported__WEBPACK_IMPORTED_MODULE_6__["default"])(account);
  }, [account, isValidSession, useWalletConnectApproval]);
  const isBtcNetwork = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => activeNetwork ? (0,_src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_5__.isBitcoinNetwork)(activeNetwork) : false, [activeNetwork]);
  return /*#__PURE__*/React.createElement(_RemoteApproval_RemoteApprovalConfirmation__WEBPACK_IMPORTED_MODULE_2__.RemoteApprovalConfirmation, {
    logo: /*#__PURE__*/React.createElement(_src_pages_Fireblocks_components_FireblocksAvatar__WEBPACK_IMPORTED_MODULE_3__.FireblocksAvatar, {
      badgeIcon: isBtcNetwork ? 'bitcoin' : 'walletConnect'
    }),
    status: status,
    isValidSession: isSessionValid,
    connectingToIcon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.FireblocksIcon, null),
    useRetryButton: true,
    useWalletConnectApproval: useWalletConnectApproval,
    account: account,
    session: session,
    onReject: onReject,
    onSign: onSign
  });
}
const RequestPending = () => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
  sx: {
    columnGap: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.CircularProgress, {
  size: 16
}), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
  variant: "body1"
}, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_9__.Trans, {
  i18nKey: "Signing request sent"
})));
const ReadyToSign = () => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
  sx: {
    columnGap: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.CheckCircleIcon, {
  sx: {
    color: 'success.main'
  }
}), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
  variant: "body1"
}, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_9__.Trans, {
  i18nKey: "Connected and ready to sign"
})));
const WrongNetwork = () => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
  sx: {
    columnGap: 1,
    flexDirection: 'row',
    alignItems: 'start'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.AlertTriangleIcon, {
  sx: {
    color: 'warning.main',
    pt: 0.5
  }
}), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
  variant: "body1"
}, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_9__.Trans, {
  i18nKey: "Wrong network. Please switch networks on your mobile device."
})));

/***/ }),

/***/ "./src/pages/SignTransaction/components/RemoteApproval/RemoteApprovalConfirmation.tsx":
/*!********************************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/RemoteApproval/RemoteApprovalConfirmation.tsx ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RemoteApprovalConfirmation": () => (/* binding */ RemoteApprovalConfirmation)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/trunateAddress.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function RemoteApprovalConfirmation({
  logo,
  status,
  isValidSession,
  connectingToIcon,
  useRetryButton,
  useWalletConnectApproval,
  onReject,
  onSign,
  account,
  session
}) {
  const [submitted, setSubmitted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [enableSubmitButton, setEnableSubmitButton] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const showRetryButton = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (!useRetryButton) {
      return false;
    }
    if (submitted) {
      return true;
    }
    return false;
  }, [submitted, useRetryButton]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      alignItems: 'center'
    }
  }, logo, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Divider, null),
    sx: {
      rowGap: 2,
      width: '100%',
      px: 3
    }
  }, account && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      rowGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Wallet')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body1"
  }, account.name), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__.truncateAddress)(account.addressC))), session && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      rowGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Connecting to')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 1,
      alignItems: 'center'
    }
  }, connectingToIcon, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body1"
  }, session?.walletApp?.name))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      rowGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Status')), status)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexDirection: 'row',
      width: '100%',
      columnGap: 1,
      mt: 10,
      pb: 3,
      px: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    size: "large",
    color: "secondary",
    fullWidth: true,
    onClick: () => {
      setSubmitted(false);
      onReject();
    },
    disabled: submitted
  }, (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    size: "large",
    fullWidth: true,
    onClick: () => {
      setSubmitted(true);
      setEnableSubmitButton(false);
      if (useWalletConnectApproval) {
        setTimeout(() => setEnableSubmitButton(true), 5000);
      }
      onSign();
    },
    disabled: !isValidSession || !enableSubmitButton
  }, showRetryButton && submitted ? (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Retry') : (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Sign'))));
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/RemoteApproval/RemoteApprovalDialog.tsx":
/*!**************************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/RemoteApproval/RemoteApprovalDialog.tsx ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RemoteApprovalDialog": () => (/* binding */ RemoteApprovalDialog)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function RemoteApprovalDialog({
  onReject,
  pageTitle,
  children
}) {
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Dialog, {
    open: true,
    showCloseIcon: false,
    PaperProps: {
      sx: {
        m: 2,
        width: 1,
        height: 1,
        maxWidth: 'none',
        position: 'relative'
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.IconButton, {
    onClick: onReject,
    sx: {
      position: 'absolute',
      top: 8,
      right: 8,
      p: 1
    },
    disableRipple: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.XIcon, {
    size: 24
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
    variant: "h4",
    sx: {
      py: 3,
      pl: 3,
      pr: 6
    }
  }, pageTitle), children);
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalConnect.tsx":
/*!*****************************************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalConnect.tsx ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectApprovalConnect": () => (/* binding */ WalletConnectApprovalConnect)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _ImportWithWalletConnect_components_WalletConnectCircledIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../ImportWithWalletConnect/components/WalletConnectCircledIcon */ "./src/pages/ImportWithWalletConnect/components/WalletConnectCircledIcon.tsx");
/* harmony import */ var _src_pages_ImportWithWalletConnect_components_WalletConnectConnector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/pages/ImportWithWalletConnect/components/WalletConnectConnector */ "./src/pages/ImportWithWalletConnect/components/WalletConnectConnector.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function WalletConnectApprovalConnect({
  reconnectionAddress,
  customMessage,
  onConnect,
  appIcon
}) {
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      alignItems: 'center',
      height: '100%',
      gap: 2
    }
  }, appIcon ?? /*#__PURE__*/React.createElement(_ImportWithWalletConnect_components_WalletConnectCircledIcon__WEBPACK_IMPORTED_MODULE_0__.WalletConnectCircledIcon, null), /*#__PURE__*/React.createElement(_src_pages_ImportWithWalletConnect_components_WalletConnectConnector__WEBPACK_IMPORTED_MODULE_1__["default"], {
    reconnectionAddress: reconnectionAddress,
    customMessage: customMessage,
    onConnect: onConnect
  }));
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay.tsx":
/*!*****************************************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay.tsx ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectApprovalOverlay": () => (/* binding */ WalletConnectApprovalOverlay)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_components_common_walletConnect_useRequiredSession__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/walletConnect/useRequiredSession */ "./src/components/common/walletConnect/useRequiredSession.ts");
/* harmony import */ var _WalletConnectApprovalReview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WalletConnectApprovalReview */ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalReview.tsx");
/* harmony import */ var _WalletConnectApprovalConnect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./WalletConnectApprovalConnect */ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalConnect.tsx");
/* harmony import */ var _WalletConnectApprovalSent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./WalletConnectApprovalSent */ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalSent.tsx");
/* harmony import */ var _RemoteApproval_RemoteApprovalDialog__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../RemoteApproval/RemoteApprovalDialog */ "./src/pages/SignTransaction/components/RemoteApproval/RemoteApprovalDialog.tsx");
/* harmony import */ var _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/getActiveStepForRemoteApproval */ "./src/pages/SignTransaction/utils/getActiveStepForRemoteApproval.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");











function WalletConnectApprovalOverlay({
  onReject,
  onSubmit,
  requiredSignatures = 1,
  currentSignature = 1
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_9__.useTranslation)();
  const {
    network: activeNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__.useNetworkContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  const {
    activeSession,
    isValidSession,
    isNewConnectionRequired,
    establishRequiredSession
  } = (0,_src_components_common_walletConnect_useRequiredSession__WEBPACK_IMPORTED_MODULE_3__.useRequiredSession)();
  const [requestSent, setRequestSent] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const activeStep = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_8__.getActiveStep)(requestSent, activeSession, isNewConnectionRequired), [requestSent, isNewConnectionRequired, activeSession]);
  const pageTitle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    switch (activeStep) {
      case _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_8__.ApprovalStep.APPROVAL:
        return t('Wallet Connect Approval');
      case _utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_8__.ApprovalStep.CONNECT:
        return t('Scan QR Code to Connect');
      default:
        return '';
    }
  }, [activeStep, t]);
  function submitHandler() {
    setRequestSent(true);
    onSubmit();
  }
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (activeAccount && activeNetwork) {
      establishRequiredSession(activeAccount.addressC, activeNetwork.chainId);
    }
  }, [activeAccount, activeNetwork, establishRequiredSession]);
  return /*#__PURE__*/React.createElement(_RemoteApproval_RemoteApprovalDialog__WEBPACK_IMPORTED_MODULE_7__.RemoteApprovalDialog, {
    onReject: onReject,
    pageTitle: pageTitle
  }, {
    [_utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_8__.ApprovalStep.LOADING]: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
      sx: {
        alignItems: 'center',
        justifyContent: 'center',
        mt: 20
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.CircularProgress, {
      size: 80
    })),
    [_utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_8__.ApprovalStep.APPROVAL]: /*#__PURE__*/React.createElement(_WalletConnectApprovalReview__WEBPACK_IMPORTED_MODULE_4__.WalletConnectApprovalReview, {
      account: activeAccount,
      session: activeSession,
      isValidSession: isValidSession,
      onReject: onReject,
      onSign: submitHandler
    }),
    [_utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_8__.ApprovalStep.CONNECT]: /*#__PURE__*/React.createElement(_WalletConnectApprovalConnect__WEBPACK_IMPORTED_MODULE_5__.WalletConnectApprovalConnect, {
      reconnectionAddress: activeAccount?.addressC,
      customMessage: t('Please reconnect using Wallet Connect to add this network to authorized networks.'),
      onConnect: () => {
        establishRequiredSession(activeAccount?.addressC, activeNetwork?.chainId);
      }
    }),
    [_utils_getActiveStepForRemoteApproval__WEBPACK_IMPORTED_MODULE_8__.ApprovalStep.SENT]: /*#__PURE__*/React.createElement(_WalletConnectApprovalSent__WEBPACK_IMPORTED_MODULE_6__.WalletConnectApprovalSent, {
      onResend: submitHandler,
      requiredSignatures: requiredSignatures,
      currentSignature: currentSignature
    })
  }[activeStep]);
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalReview.tsx":
/*!****************************************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalReview.tsx ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectApprovalReview": () => (/* binding */ WalletConnectApprovalReview)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _ImportWithWalletConnect_components_WalletConnectCircledIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../ImportWithWalletConnect/components/WalletConnectCircledIcon */ "./src/pages/ImportWithWalletConnect/components/WalletConnectCircledIcon.tsx");
/* harmony import */ var _src_components_common_ImageWithFallback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/ImageWithFallback */ "./src/components/common/ImageWithFallback.tsx");
/* harmony import */ var _RemoteApproval_RemoteApprovalConfirmation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../RemoteApproval/RemoteApprovalConfirmation */ "./src/pages/SignTransaction/components/RemoteApproval/RemoteApprovalConfirmation.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const WalletImage = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(_src_components_common_ImageWithFallback__WEBPACK_IMPORTED_MODULE_1__.ImageWithFallback)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
`;
function WalletConnectApprovalReview({
  account,
  session,
  onReject,
  onSign,
  isValidSession
}) {
  return /*#__PURE__*/React.createElement(_RemoteApproval_RemoteApprovalConfirmation__WEBPACK_IMPORTED_MODULE_2__.RemoteApprovalConfirmation, {
    logo: /*#__PURE__*/React.createElement(_ImportWithWalletConnect_components_WalletConnectCircledIcon__WEBPACK_IMPORTED_MODULE_0__.WalletConnectCircledIcon, null),
    status: isValidSession ? /*#__PURE__*/React.createElement(ReadyToSign, null) : /*#__PURE__*/React.createElement(WrongNetwork, null),
    isValidSession: isValidSession,
    connectingToIcon: /*#__PURE__*/React.createElement(WalletImage, {
      src: session?.walletApp?.icons[0]
    }),
    useRetryButton: false,
    useWalletConnectApproval: true,
    account: account,
    session: session,
    onReject: onReject,
    onSign: onSign
  });
}
const ReadyToSign = () => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
  sx: {
    columnGap: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CheckCircleIcon, {
  sx: {
    color: 'success.main'
  }
}), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
  variant: "body1"
}, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_5__.Trans, {
  i18nKey: "Connected and ready to sign"
})));
const WrongNetwork = () => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
  sx: {
    columnGap: 1,
    flexDirection: 'row',
    alignItems: 'start'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.AlertTriangleIcon, {
  sx: {
    color: 'warning.main',
    pt: 0.5
  }
}), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
  variant: "body1"
}, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_5__.Trans, {
  i18nKey: "Wrong network. Please switch networks on your mobile device."
})));

/***/ }),

/***/ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalSent.tsx":
/*!**************************************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalSent.tsx ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletConnectApprovalSent": () => (/* binding */ WalletConnectApprovalSent)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function WalletConnectApprovalSent({
  onResend,
  currentSignature,
  requiredSignatures
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const [disableButton, setDisableButton] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const resendButtonTimer = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const requiresMultipleSignatures = requiredSignatures > 1;
  const enableButtonAfterDelay = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (typeof resendButtonTimer.current !== 'undefined') {
      clearTimeout(resendButtonTimer.current);
    }
    resendButtonTimer.current = setTimeout(() => {
      setDisableButton(false);
      resendButtonTimer.current = undefined;
    }, 7500);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    enableButtonAfterDelay();
    return () => {
      if (typeof resendButtonTimer.current !== 'undefined') {
        clearTimeout(resendButtonTimer.current);
      }
    };
  });
  function resend() {
    setDisableButton(true);
    onResend();
    enableButtonAfterDelay();
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      justifyContent: 'start',
      width: '100%',
      height: '100%',
      px: 3
    }
  }, requiresMultipleSignatures && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Alert, {
    severity: "info"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AlertTitle, null, t('This transaction requires two approvals')), t('Please pay attention to your mobile device')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 1,
      alignItems: 'center',
      mt: requiresMultipleSignatures ? 5 : 10,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.CheckCircleIcon, {
    size: 72,
    sx: {
      color: 'success.main'
    }
  }), !requiresMultipleSignatures && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, t('Request Successfully Sent!')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, t('Please sign on your mobile wallet.'))), requiresMultipleSignatures && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, currentSignature === 1 ? t('First Request Sent!') : t('Almost done!')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, currentSignature === 1 ? t('Please approve it on your mobile wallet.') : t('Please approve the second request, too.'))), currentSignature === 1 &&
  /*#__PURE__*/
  // We can't resend just the 2nd signature request.
  // Clicking "Resend" in this situation would start the whole operation from scratch.
  React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      px: 3,
      mt: 1,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    fullWidth: true,
    onClick: resend,
    size: "xlarge",
    disabled: disableButton,
    isLoading: disableButton
  }, t('Resend')))));
}

/***/ }),

/***/ "./src/pages/SignTransaction/utils/getActiveStepForRemoteApproval.ts":
/*!***************************************************************************!*\
  !*** ./src/pages/SignTransaction/utils/getActiveStepForRemoteApproval.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApprovalStep": () => (/* binding */ ApprovalStep),
/* harmony export */   "getActiveStep": () => (/* binding */ getActiveStep)
/* harmony export */ });
let ApprovalStep = /*#__PURE__*/function (ApprovalStep) {
  ApprovalStep[ApprovalStep["APPROVAL"] = 0] = "APPROVAL";
  ApprovalStep[ApprovalStep["CONNECT"] = 1] = "CONNECT";
  ApprovalStep[ApprovalStep["SENT"] = 2] = "SENT";
  ApprovalStep[ApprovalStep["LOADING"] = 3] = "LOADING";
  return ApprovalStep;
}({});
const getActiveStep = (requestSent, activeSession, isNewConnectionRequired) => {
  if (requestSent) {
    return ApprovalStep.SENT;
  }
  if (activeSession && !isNewConnectionRequired) {
    return ApprovalStep.APPROVAL;
  }
  if (isNewConnectionRequired) {
    return ApprovalStep.CONNECT;
  }
  return ApprovalStep.LOADING;
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

/***/ "./src/utils/shouldUseWalletConnectApproval.ts":
/*!*****************************************************!*\
  !*** ./src/utils/shouldUseWalletConnectApproval.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");


function shouldUseWalletConnectApproval(network, account) {
  // We are not supporting CoreEth as a network
  if (network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.CoreEth) {
    return false;
  }
  if (account.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.AccountType.FIREBLOCKS || account.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.AccountType.WALLET_CONNECT) {
    return network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.NetworkVMType.BITCOIN ? false : true;
  }
  return false;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shouldUseWalletConnectApproval);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX0Z1bmN0aW9uSXNPZmZsaW5lX3RzeC1zcmNfaG9va3NfdXNlQXBwcm92YWxIZWxwZXJzX3RzLXNyY19ob29rc191c2VBcHByLWJjMGU3ZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLG9CQUFvQixpQkFBaUIsR0FBRyxjQUFjLEVBQStCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQzNCO0FBQ2pCO0FBS0o7QUFDVTtBQUNtQjtBQU8zRCxTQUFTUyx5QkFBeUJBLENBQUNDLElBQW1CLEVBQUU7RUFDN0QsTUFBTUMsWUFBWSxHQUFHO0lBQ25CLENBQUNILG1GQUFvQixHQUFHTCwwQ0FBUyxDQUFDLFFBQVEsQ0FBQztJQUMzQyxDQUFDSyxpRkFBa0IsR0FBR0wsMENBQVMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQ0ssaUZBQWtCLEdBQUdMLDBDQUFTLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLENBQUNLLGdGQUFpQixHQUFHTCwwQ0FBUyxDQUFDLEtBQUssQ0FBQztJQUNyQyxDQUFDSyxpRkFBa0IsR0FBR0wsMENBQVMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQ0sscUZBQXNCLEdBQUdMLDBDQUFTLENBQUMsVUFBVSxDQUFDO0lBQy9DLENBQUNLLDBGQUEyQixHQUFHTCwwQ0FBUyxDQUFDLGVBQWU7RUFDMUQsQ0FBQztFQUVELE9BQU9RLFlBQVksQ0FBQ0QsSUFBSSxDQUFDO0FBQzNCO0FBRU8sU0FBU1MsaUJBQWlCQSxDQUFDO0VBQ2hDQyxZQUFZO0VBQ1pDLGFBQWE7RUFDYkM7QUFDeUMsQ0FBQyxFQUFFO0VBQzVDLE1BQU07SUFBRXBCO0VBQUUsQ0FBQyxHQUFHSyw2REFBYyxFQUFFO0VBRTlCLG9CQUNFZ0IsS0FBQSxDQUFBQyxhQUFBLENBQUNuQiw4REFBSztJQUFDb0IsRUFBRSxFQUFFO01BQUVDLE1BQU0sRUFBRSxNQUFNO01BQUVDLEtBQUssRUFBRTtJQUFPO0VBQUUsR0FDMUMsQ0FBQ04s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QUFTLENBQUMsTUFBTTtJQUNkLE1BQU0wUCxZQUFZLEdBQUdELDJDQUFLLENBQ3hCRCxzREFBZ0IsQ0FDYkcsT0FBTyxJQUFLO01BQ1hDLE1BQU0sQ0FBQ0MsZ0JBQWdCLENBQUMsUUFBUSxFQUFFRixPQUFPLENBQUM7SUFDNUMsQ0FBQyxFQUNBQSxPQUFPLElBQUs7TUFDWEMsTUFBTSxDQUFDRSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUVILE9BQU8sQ0FBQztJQUMvQyxDQUFDLENBQ0YsRUFDREgsc0RBQWdCLENBQ2JHLE9BQU8sSUFBSztNQUNYQyxNQUFNLENBQUNDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFRixPQUFPLENBQUM7SUFDdEQsQ0FBQyxFQUNBQSxPQUFPLElBQUs7TUFDWEMsTUFBTSxDQUFDRSxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRUgsT0FBTyxDQUFDO0lBQ3pELENBQUMsQ0FDRixDQUFDdFMsSUFBSSxDQUNKdEIsNENBQU0sQ0FBQyxNQUFNO01BQ1gsT0FBT2dVLFFBQVEsQ0FBQ0MsZUFBZSxLQUFLLFFBQVE7SUFDOUMsQ0FBQyxDQUFDLENBQ0gsQ0FDRixDQUNFM1MsSUFBSSxDQUFDa1MsMkNBQUssRUFBRSxDQUFDLENBQ2JqUyxTQUFTLENBQUMsTUFBTTtNQUNmO01BQ0EsSUFBSWtELGNBQWMsRUFBRTtRQUNsQmtCLGFBQWEsRUFBRTtNQUNqQjtJQUNGLENBQUMsQ0FBQztJQUVKLE9BQU8sTUFBTTtNQUNYZ08sWUFBWSxFQUFFMVIsV0FBVyxFQUFFO0lBQzdCLENBQUM7RUFDSCxDQUFDLEVBQUUsQ0FBQzBELGFBQWEsRUFBRWxCLGNBQWMsQ0FBQyxDQUFDO0FBQ3JDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXZhbGFicy9jb3JlLXV0aWxzLXNkay9lc20vdHJ1bmF0ZUFkZHJlc3MuanMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9GdW5jdGlvbklzT2ZmbGluZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi93YWxsZXRDb25uZWN0L3VzZVJlcXVpcmVkU2Vzc2lvbi50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUFwcHJvdmFsSGVscGVycy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VJc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VJc1VzaW5nV2FsbGV0Q29ubmVjdEFjY291bnQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9GaXJlYmxvY2tzL2NvbXBvbmVudHMvRmlyZWJsb2Nrc0F2YXRhci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9JbXBvcnRXaXRoV2FsbGV0Q29ubmVjdC9jb21wb25lbnRzL1dhbGxldENvbm5lY3RDaXJjbGVkSWNvbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9JbXBvcnRXaXRoV2FsbGV0Q29ubmVjdC9jb21wb25lbnRzL1dhbGxldENvbm5lY3RDb25uZWN0b3IudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSW1wb3J0V2l0aFdhbGxldENvbm5lY3QvY29tcG9uZW50cy9XYWxsZXRDb25uZWN0UVJDb2RlLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0ltcG9ydFdpdGhXYWxsZXRDb25uZWN0L2NvbXBvbmVudHMvV2FsbGV0Q29ubmVjdFN0YXR1c01lc3NhZ2UudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSW1wb3J0V2l0aFdhbGxldENvbm5lY3QvY29tcG9uZW50cy9XYWxsZXRDb25uZWN0VVJJRmllbGQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvSW1wb3J0V2l0aFdhbGxldENvbm5lY3QvY29tcG9uZW50cy91dGlscy9nZXRDb2xvckZvclN0YXR1cy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL0ZpcmVibG9ja3NBcHByb3ZhbC9GaXJlYmxvY2tzQXBwcm92YWxPdmVybGF5LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL0ZpcmVibG9ja3NBcHByb3ZhbC9GaXJlYmxvY2tzQXBwcm92YWxSZXZpZXcudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvUmVtb3RlQXBwcm92YWwvUmVtb3RlQXBwcm92YWxDb25maXJtYXRpb24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvUmVtb3RlQXBwcm92YWwvUmVtb3RlQXBwcm92YWxEaWFsb2cudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvV2FsbGV0Q29ubmVjdEFwcHJvdmFsL1dhbGxldENvbm5lY3RBcHByb3ZhbENvbm5lY3QudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvV2FsbGV0Q29ubmVjdEFwcHJvdmFsL1dhbGxldENvbm5lY3RBcHByb3ZhbE92ZXJsYXkudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvV2FsbGV0Q29ubmVjdEFwcHJvdmFsL1dhbGxldENvbm5lY3RBcHByb3ZhbFJldmlldy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9XYWxsZXRDb25uZWN0QXBwcm92YWwvV2FsbGV0Q29ubmVjdEFwcHJvdmFsU2VudC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vdXRpbHMvZ2V0QWN0aXZlU3RlcEZvclJlbW90ZUFwcHJvdmFsLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvYWN0aW9ucy9nZXRVcGRhdGVkQWN0aW9uRGF0YS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL3Nob3VsZFVzZVdhbGxldENvbm5lY3RBcHByb3ZhbC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL3VzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzPShzLHQ9Nik9PmAke3Muc3Vic3RyaW5nKDAsdCl94oCmJHtzLnNsaWNlKC10LzIpfWA7ZXhwb3J0e3MgYXMgdHJ1bmNhdGVBZGRyZXNzfTtcbiIsImltcG9ydCB7IFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgUGFnZVRpdGxlLCBQYWdlVGl0bGVWYXJpYW50IH0gZnJvbSAnLi9QYWdlVGl0bGUnO1xuaW1wb3J0IHsgdCBhcyB0cmFuc2xhdGUgfSBmcm9tICdpMThuZXh0JztcbmltcG9ydCB7XG4gIEFsZXJ0Q2lyY2xlSWNvbixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgRnVuY3Rpb25OYW1lcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNGdW5jdGlvbkF2YWlsYWJsZSc7XG5cbmludGVyZmFjZSBGdW5jdGlvbklzT2ZmbGluZVByb3BzIHtcbiAgZnVuY3Rpb25OYW1lOiBGdW5jdGlvbk5hbWVzO1xuICBoaWRlUGFnZVRpdGxlPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUobmFtZTogRnVuY3Rpb25OYW1lcykge1xuICBjb25zdCB0cmFuc2xhdGlvbnMgPSB7XG4gICAgW0Z1bmN0aW9uTmFtZXMuQlJJREdFXTogdHJhbnNsYXRlKCdCcmlkZ2UnKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5TV0FQXTogdHJhbnNsYXRlKCdTd2FwJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuU0VORF06IHRyYW5zbGF0ZSgnU2VuZCcpLFxuICAgIFtGdW5jdGlvbk5hbWVzLkJVWV06IHRyYW5zbGF0ZSgnQnV5JyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuREVGSV06IHRyYW5zbGF0ZSgnRGVGaScpLFxuICAgIFtGdW5jdGlvbk5hbWVzLktFWVNUT05FXTogdHJhbnNsYXRlKCdLZXlzdG9uZScpLFxuICAgIFtGdW5jdGlvbk5hbWVzLlRPS0VOX0RFVEFJTFNdOiB0cmFuc2xhdGUoJ1Rva2VuIERldGFpbHMnKSxcbiAgfTtcblxuICByZXR1cm4gdHJhbnNsYXRpb25zW25hbWVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRnVuY3Rpb25Jc09mZmxpbmUoe1xuICBmdW5jdGlvbk5hbWUsXG4gIGhpZGVQYWdlVGl0bGUsXG4gIGNoaWxkcmVuLFxufTogUHJvcHNXaXRoQ2hpbGRyZW48RnVuY3Rpb25Jc09mZmxpbmVQcm9wcz4pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGhlaWdodDogJzEwMCUnLCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgeyFoaWRlUGFnZVRpdGxlICYmIChcbiAgICAgICAgPFBhZ2VUaXRsZSB2YXJpYW50PXtQYWdlVGl0bGVWYXJpYW50LlBSSU1BUll9Pnt0KCdTb3JyeScpfTwvUGFnZVRpdGxlPlxuICAgICAgKX1cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBmbGV4R3JvdzogMSB9fVxuICAgICAgPlxuICAgICAgICA8QWxlcnRDaXJjbGVJY29uIHNpemU9ezcyfSBzeD17eyBtYjogMywgbXQ6IC05IH19IC8+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiIHN4PXt7IG1iOiAxIH19PlxuICAgICAgICAgIHt0KCdGZWF0dXJlIERpc2FibGVkJyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICBzaXplPXsxNn1cbiAgICAgICAgICBhbGlnbj1cImNlbnRlclwiXG4gICAgICAgICAgaGVpZ2h0PVwiMjRweFwiXG4gICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0KCd7e2Z1bmN0aW9uTmFtZX19IGlzIGN1cnJlbnRseSB1bmF2YWlsYWJsZS4nLCB7XG4gICAgICAgICAgICBmdW5jdGlvbk5hbWU6XG4gICAgICAgICAgICAgIGdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUoZnVuY3Rpb25OYW1lKSA/PyB0KCdUaGlzIEZlYXR1cmUnKSxcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICB7dCgnUGxlYXNlIGNoZWNrIGJhY2sgbGF0ZXIgYW5kIHRyeSBhZ2Fpbi4nKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQge1xuICBpc1Nlc3Npb25QZXJtaXNzaW9uc01pc21hdGNoRXZlbnQsXG4gIGlzVXJpR2VuZXJhdGVkRXZlbnQsXG4gIGlzV2FsbGV0Q29ubmVjdEV2ZW50LFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0Q29ubmVjdC9ldmVudHMvZXZlbnRGaWx0ZXJzJztcbmltcG9ydCB7IEVzdGFibGlzaFJlcXVpcmVkU2Vzc2lvbiB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXRDb25uZWN0L2hhbmRsZXJzL2VzdGFibGlzaFJlcXVpcmVkU2Vzc2lvbic7XG5pbXBvcnQgeyBFeHRlbnNpb25SZXF1ZXN0IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL2Nvbm5lY3Rpb25zL2V4dGVuc2lvbkNvbm5lY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7XG4gIFdhbGxldENvbm5lY3RFdmVudFR5cGUsXG4gIFdhbGxldENvbm5lY3RTZXNzaW9uSW5mbyxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3dhbGxldENvbm5lY3QvbW9kZWxzJztcblxuZXhwb3J0IGNvbnN0IHVzZVJlcXVpcmVkU2Vzc2lvbiA9ICgpID0+IHtcbiAgY29uc3QgeyB0YWJJZCwgZXZlbnRzLCByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuXG4gIGNvbnN0IFtpc1ZhbGlkU2Vzc2lvbiwgc2V0SXNWYWxpZFNlc3Npb25dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbYWN0aXZlU2Vzc2lvbiwgc2V0QWN0aXZlU2Vzc2lvbl0gPVxuICAgIHVzZVN0YXRlPFdhbGxldENvbm5lY3RTZXNzaW9uSW5mbyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbaXNOZXdDb25uZWN0aW9uUmVxdWlyZWQsIHNldElzTmV3Q29ubmVjdGlvblJlcXVpcmVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBlc3RhYmxpc2hSZXF1aXJlZFNlc3Npb24gPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoYWRkcmVzczogc3RyaW5nLCBjaGFpbklkOiBudW1iZXIpID0+IHtcbiAgICAgIHNldElzTmV3Q29ubmVjdGlvblJlcXVpcmVkKGZhbHNlKTtcbiAgICAgIHNldElzTG9hZGluZyh0cnVlKTtcblxuICAgICAgY29uc3Qgc2Vzc2lvblN1YnNjcmlwdGlvbiA9IGV2ZW50czxXYWxsZXRDb25uZWN0RXZlbnRUeXBlPigpXG4gICAgICAgIC5waXBlKGZpbHRlcihpc1dhbGxldENvbm5lY3RFdmVudCkpXG4gICAgICAgIC5zdWJzY3JpYmUoYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LnZhbHVlLnRhYklkICE9PSB0YWJJZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIGFueSBvZiB0aGUgZXZlbnRzIGNhbWUgYWxyZWFkeSwgbG9hZGluZyBzdGF0ZSBpcyBvdmVyLlxuICAgICAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG5cbiAgICAgICAgICAvLyBJZiBhIFFSIGNvZGUgY2FtZSwgd2Uga25vdyB3ZSBuZWVkIHRvIGVzdGFibGlzaCBhIG5ldyBjb25uZWN0aW9uLlxuICAgICAgICAgIGlmIChpc1VyaUdlbmVyYXRlZEV2ZW50KGV2ZW50KSkge1xuICAgICAgICAgICAgc2V0SXNOZXdDb25uZWN0aW9uUmVxdWlyZWQodHJ1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIHNlc3Npb24gdG8gdGhlIGRldmljZSwgYnV0IGl0IGRvZXMgbm90IHBlcm1pdCB1cyB0b1xuICAgICAgICAgIC8vIHNlbmQgdGhlIHJlcXVlc3Qgd2UgbmVlZCwgd2UnbGwgbm90aWZ5IHRoZSB1c2VyLlxuICAgICAgICAgIGlmIChpc1Nlc3Npb25QZXJtaXNzaW9uc01pc21hdGNoRXZlbnQoZXZlbnQpKSB7XG4gICAgICAgICAgICBzZXRBY3RpdmVTZXNzaW9uKGV2ZW50LnZhbHVlLmFjdGl2ZVNlc3Npb24pO1xuICAgICAgICAgICAgc2V0SXNWYWxpZFNlc3Npb24oZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHJlcXVlc3Q8RXN0YWJsaXNoUmVxdWlyZWRTZXNzaW9uPih7XG4gICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5XQUxMRVRfQ09OTkVDVF9FU1RBQkxJU0hfUkVRVUlSRURfU0VTU0lPTixcbiAgICAgICAgcGFyYW1zOiBbYWRkcmVzcywgY2hhaW5JZF0sXG4gICAgICB9KVxuICAgICAgICAudGhlbigoc2Vzc2lvbikgPT4ge1xuICAgICAgICAgIHNldEFjdGl2ZVNlc3Npb24oc2Vzc2lvbik7XG4gICAgICAgICAgc2V0SXNWYWxpZFNlc3Npb24odHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgLy8gVGhpcyB3aWxsIGJlIG1vc3QgbGlrZWx5IHRyaWdnZXJlZCBieSB0aGUgdXNlciByZWplY3Rpbmcgb3VyIHJlcXVlc3RcbiAgICAgICAgICAvLyB0byBzd2l0Y2ggdGhlIG5ldHdvcmsgYXV0b21hdGljYWxseS4gSWYgdGhhdCBoYXBwZW5zLCB3ZSdsbCBmYWxsYmFja1xuICAgICAgICAgIC8vIHRvIGVzdGFibGlzaGluZyBhIGJyYW5kIG5ldyBjb25uZWN0aW9uLlxuICAgICAgICAgIHNldEFjdGl2ZVNlc3Npb24obnVsbCk7XG4gICAgICAgICAgc2V0SXNWYWxpZFNlc3Npb24oZmFsc2UpO1xuICAgICAgICAgIHNldElzTmV3Q29ubmVjdGlvblJlcXVpcmVkKHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgc2Vzc2lvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFtldmVudHMsIHRhYklkLCByZXF1ZXN0XSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGlzTG9hZGluZyxcbiAgICBpc1ZhbGlkU2Vzc2lvbixcbiAgICBpc05ld0Nvbm5lY3Rpb25SZXF1aXJlZCxcbiAgICBlc3RhYmxpc2hSZXF1aXJlZFNlc3Npb24sXG4gICAgYWN0aXZlU2Vzc2lvbixcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHVzZUlzVXNpbmdMZWRnZXJXYWxsZXQgZnJvbSAnLi91c2VJc1VzaW5nTGVkZ2VyV2FsbGV0JztcbmltcG9ydCB1c2VJc1VzaW5nS2V5c3RvbmVXYWxsZXQgZnJvbSAnLi91c2VJc1VzaW5nS2V5c3RvbmVXYWxsZXQnO1xuaW1wb3J0IHVzZUlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCBmcm9tICcuL3VzZUlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCc7XG5pbXBvcnQgeyB0b2FzdCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgdXNlSXNVc2luZ0ZpcmVibG9ja3NBY2NvdW50IGZyb20gJy4vdXNlSXNVc2luZ0ZpcmVibG9ja3NBY2NvdW50JztcblxudHlwZSBVc2VBcHByb3ZhbEhlbHBlcnNQcm9wcyA9IHtcbiAgb25BcHByb3ZlOiAoKSA9PiBQcm9taXNlPHVua25vd24+O1xuICBvblJlamVjdDogKCkgPT4gdW5rbm93bjtcbiAgcGVuZGluZ01lc3NhZ2U/OiBzdHJpbmc7XG4gIHNob3dQZW5kaW5nPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZhbEhlbHBlcnMoe1xuICBvbkFwcHJvdmUsXG4gIG9uUmVqZWN0LFxuICBwZW5kaW5nTWVzc2FnZSxcbiAgc2hvd1BlbmRpbmcsXG59OiBVc2VBcHByb3ZhbEhlbHBlcnNQcm9wcykge1xuICBjb25zdCBpc1VzaW5nTGVkZ2VyV2FsbGV0ID0gdXNlSXNVc2luZ0xlZGdlcldhbGxldCgpO1xuICBjb25zdCBpc1VzaW5nS2V5c3RvbmVXYWxsZXQgPSB1c2VJc1VzaW5nS2V5c3RvbmVXYWxsZXQoKTtcbiAgY29uc3QgaXNVc2luZ1dhbGxldENvbm5lY3RBY2NvdW50ID0gdXNlSXNVc2luZ1dhbGxldENvbm5lY3RBY2NvdW50KCk7XG4gIGNvbnN0IGlzVXNpbmdGaXJlYmxvY2tzQWNjb3VudCA9IHVzZUlzVXNpbmdGaXJlYmxvY2tzQWNjb3VudCgpO1xuXG4gIGNvbnN0IGlzVHdvU3RlcEFwcHJvdmFsID1cbiAgICBpc1VzaW5nV2FsbGV0Q29ubmVjdEFjY291bnQgfHwgaXNVc2luZ0ZpcmVibG9ja3NBY2NvdW50O1xuICBjb25zdCBpc1VzaW5nRXh0ZXJuYWxTaWduZXIgPVxuICAgIGlzVXNpbmdMZWRnZXJXYWxsZXQgfHxcbiAgICBpc1VzaW5nS2V5c3RvbmVXYWxsZXQgfHxcbiAgICBpc1VzaW5nV2FsbGV0Q29ubmVjdEFjY291bnQgfHxcbiAgICBpc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQ7XG5cbiAgY29uc3QgW2lzUmVhZHlUb1NpZ24sIHNldElzUmVhZHlUb1NpZ25dID0gdXNlU3RhdGUoIWlzVHdvU3RlcEFwcHJvdmFsKTtcbiAgY29uc3QgW2lzQXBwcm92YWxPdmVybGF5VmlzaWJsZSwgc2V0SXNBcHByb3ZhbE92ZXJsYXlWaXNpYmxlXSA9XG4gICAgdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IHBlbmRpbmdUb2FzdElkUmVmID0gdXNlUmVmPHN0cmluZz4oJycpO1xuICBjb25zdCBoYW5kbGVBcHByb3ZhbCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBzZXRJc0FwcHJvdmFsT3ZlcmxheVZpc2libGUoaXNVc2luZ0V4dGVybmFsU2lnbmVyKTtcblxuICAgIC8vIElmIGl0J3MgYSB0d28tc3RlcCBhcHByb3ZhbCwgZG8gbm90IGNhbGwgYG9uQXBwcm92ZWAgeWV0LlxuICAgIC8vIEluc3RlYWQsIGp1c3QgdG9nZ2xlIHRoZSBpc1JlYWR5VG9TaWduIGZsYWcgc28gdGhhdCBpdCdzXG4gICAgLy8gY2FsbGVkIG9uIGEgMm5kIGNsaWNrLlxuICAgIGlmIChpc1R3b1N0ZXBBcHByb3ZhbCAmJiAhaXNSZWFkeVRvU2lnbikge1xuICAgICAgc2V0SXNSZWFkeVRvU2lnbih0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGVuZGluZ01lc3NhZ2UgJiYgIWlzVXNpbmdFeHRlcm5hbFNpZ25lciAmJiBzaG93UGVuZGluZykge1xuICAgICAgY29uc3QgdG9hc3RJZCA9IHRvYXN0LmxvYWRpbmcocGVuZGluZ01lc3NhZ2UpO1xuICAgICAgcGVuZGluZ1RvYXN0SWRSZWYuY3VycmVudCA9IHRvYXN0SWQ7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBoYXMgdG8gYmUgYXdhaXRlZCwgb3RoZXJ3aXNlIHRoZSBvdmVybGF5IHdvdWxkIGRpc2FwcGVhciBpbW1lZGlhdGVseS5cbiAgICBhd2FpdCBvbkFwcHJvdmUoKTtcbiAgICBpZiAocGVuZGluZ1RvYXN0SWRSZWYuY3VycmVudCkge1xuICAgICAgdG9hc3QuZGlzbWlzcyhwZW5kaW5nVG9hc3RJZFJlZi5jdXJyZW50KTtcbiAgICB9XG4gICAgc2V0SXNBcHByb3ZhbE92ZXJsYXlWaXNpYmxlKGZhbHNlKTtcbiAgfSwgW1xuICAgIGlzVXNpbmdFeHRlcm5hbFNpZ25lcixcbiAgICBpc1R3b1N0ZXBBcHByb3ZhbCxcbiAgICBpc1JlYWR5VG9TaWduLFxuICAgIHBlbmRpbmdNZXNzYWdlLFxuICAgIHNob3dQZW5kaW5nLFxuICAgIG9uQXBwcm92ZSxcbiAgXSk7XG5cbiAgY29uc3QgaGFuZGxlUmVqZWN0aW9uID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIHNldElzQXBwcm92YWxPdmVybGF5VmlzaWJsZShmYWxzZSk7XG5cbiAgICBpZiAoaXNUd29TdGVwQXBwcm92YWwpIHtcbiAgICAgIHNldElzUmVhZHlUb1NpZ24oZmFsc2UpO1xuICAgIH1cblxuICAgIGF3YWl0IG9uUmVqZWN0KCk7XG4gIH0sIFtpc1R3b1N0ZXBBcHByb3ZhbCwgb25SZWplY3RdKTtcblxuICByZXR1cm4ge1xuICAgIGlzQXBwcm92YWxPdmVybGF5VmlzaWJsZSxcbiAgICBoYW5kbGVBcHByb3ZhbCxcbiAgICBoYW5kbGVSZWplY3Rpb24sXG4gIH07XG59XG4iLCJpbXBvcnQgeyBFeHRlbnNpb25SZXF1ZXN0IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL2Nvbm5lY3Rpb25zL2V4dGVuc2lvbkNvbm5lY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7IEdldEFjdGlvbkhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9oYW5kbGVycy9nZXRBY3Rpb25zJztcbmltcG9ydCB7IFVwZGF0ZUFjdGlvbkhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9oYW5kbGVycy91cGRhdGVBY3Rpb24nO1xuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBBY3Rpb25VcGRhdGUsXG4gIE11bHRpVHhBY3Rpb24sXG4gIGlzQmF0Y2hBcHByb3ZhbEFjdGlvbixcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7IHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbiB9IGZyb20gJ0BzcmMvdXRpbHMvdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJy4vdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlQXBwcm92YWxzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQXBwcm92YWxzUHJvdmlkZXInO1xuaW1wb3J0IHsgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhIH0gZnJvbSAnQHNyYy91dGlscy9hY3Rpb25zL2dldFVwZGF0ZWRBY3Rpb25EYXRhJztcblxudHlwZSBBY3Rpb25UeXBlPElzQmF0Y2hBcHByb3ZhbD4gPSBJc0JhdGNoQXBwcm92YWwgZXh0ZW5kcyB0cnVlXG4gID8gTXVsdGlUeEFjdGlvblxuICA6IEFjdGlvbjtcblxudHlwZSBBY3Rpb25VcGRhdGVyPFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uIHwgdW5kZWZpbmVkPiA9IChcbiAgcGFyYW1zOiBBY3Rpb25VcGRhdGU8XG4gICAgUGFydGlhbDxUIGV4dGVuZHMgQWN0aW9uIHwgTXVsdGlUeEFjdGlvbiA/IFRbJ2Rpc3BsYXlEYXRhJ10gOiBuZXZlcj5cbiAgPixcbiAgc2hvdWxkV2FpdEZvclJlc3BvbnNlPzogYm9vbGVhbixcbikgPT4gUHJvbWlzZTxib29sZWFuPjtcblxudHlwZSBIb29rUmVzdWx0PFQgZXh0ZW5kcyBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uIHwgdW5kZWZpbmVkPiA9IHtcbiAgYWN0aW9uOiBUO1xuICB1cGRhdGVBY3Rpb246IEFjdGlvblVwZGF0ZXI8VD47XG4gIGVycm9yOiBzdHJpbmc7XG4gIGNhbmNlbEhhbmRsZXI6ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwcm92ZUFjdGlvbjxEaXNwbGF5RGF0YSA9IGFueT4oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbD86IGZhbHNlLFxuKTogSG9va1Jlc3VsdDxBY3Rpb248RGlzcGxheURhdGE+PjtcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uKFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw/OiB0cnVlLFxuKTogSG9va1Jlc3VsdDxNdWx0aVR4QWN0aW9uPjtcbmV4cG9ydCBmdW5jdGlvbiB1c2VBcHByb3ZlQWN0aW9uPERpc3BsYXlEYXRhID0gYW55PihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsOiBib29sZWFuID0gZmFsc2UsXG4pOiBIb29rUmVzdWx0PEFjdGlvbjxEaXNwbGF5RGF0YT4gfCBNdWx0aVR4QWN0aW9uIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0IHsgcmVxdWVzdCB9ID0gdXNlQ29ubmVjdGlvbkNvbnRleHQoKTtcbiAgY29uc3QgaXNDb25maXJtUG9wdXAgPSB1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lcihcbiAgICBDb250ZXh0Q29udGFpbmVyLkNPTkZJUk0sXG4gICk7XG4gIGNvbnN0IHsgYXBwcm92YWwgfSA9IHVzZUFwcHJvdmFsc0NvbnRleHQoKTtcbiAgY29uc3QgW2FjdGlvbiwgc2V0QWN0aW9uXSA9IHVzZVN0YXRlPEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4+KCk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG5cbiAgY29uc3QgdXBkYXRlQWN0aW9uOiBBY3Rpb25VcGRhdGVyPEFjdGlvblR5cGU8dHlwZW9mIGlzQmF0Y2hBcHByb3ZhbD4+ID1cbiAgICB1c2VDYWxsYmFjayhcbiAgICAgIGFzeW5jIChwYXJhbXMsIHNob3VsZFdhaXRGb3JSZXNwb25zZSkgPT4ge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIHVwZGF0ZSB0aGUgc3RhdHVzIGEgYml0IGZhc3RlciBmb3Igc21vb3RoZXIgVVguXG4gICAgICAgIC8vIHVzZSBmdW5jdGlvbiB0byBhdm9pZCBgYWN0aW9uYCBhcyBhIGRlcGVuZGVuY3kgYW5kIHRodXMgaW5maW5pdGUgbG9vcHNcbiAgICAgICAgc2V0QWN0aW9uKChwcmV2QWN0aW9uRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghcHJldkFjdGlvbkRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGb3IgTXVsdGlUeEFjdGlvbiwgd2UgZG9uJ3QgYWxsb3cgYW55IHVwZGF0ZXMgYmVzaWRlcyB0aGUgc3RhdHVzLlxuICAgICAgICAgIGlmIChpc0JhdGNoQXBwcm92YWxBY3Rpb24ocHJldkFjdGlvbkRhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YSxcbiAgICAgICAgICAgICAgc3RhdHVzOiBwYXJhbXMuc3RhdHVzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucHJldkFjdGlvbkRhdGEsXG4gICAgICAgICAgICBzdGF0dXM6IHBhcmFtcy5zdGF0dXMsXG4gICAgICAgICAgICBkaXNwbGF5RGF0YToge1xuICAgICAgICAgICAgICAuLi5wcmV2QWN0aW9uRGF0YS5kaXNwbGF5RGF0YSxcbiAgICAgICAgICAgICAgLi4ucGFyYW1zLmRpc3BsYXlEYXRhLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpZ25pbmdEYXRhOiBnZXRVcGRhdGVkU2lnbmluZ0RhdGEoXG4gICAgICAgICAgICAgIHByZXZBY3Rpb25EYXRhLnNpZ25pbmdEYXRhLFxuICAgICAgICAgICAgICBwYXJhbXMuc2lnbmluZ0RhdGEsXG4gICAgICAgICAgICApLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNob3VsZENsb3NlQWZ0ZXJVcGRhdGUgPVxuICAgICAgICAgIGlzQ29uZmlybVBvcHVwICYmIHBhcmFtcy5zdGF0dXMgIT09IEFjdGlvblN0YXR1cy5QRU5ESU5HO1xuXG4gICAgICAgIHJldHVybiByZXF1ZXN0PFVwZGF0ZUFjdGlvbkhhbmRsZXI+KHtcbiAgICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuQUNUSU9OX1VQREFURSxcbiAgICAgICAgICBwYXJhbXM6IFtwYXJhbXMsIHNob3VsZFdhaXRGb3JSZXNwb25zZV0sXG4gICAgICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgIGlmIChzaG91bGRDbG9zZUFmdGVyVXBkYXRlKSB7XG4gICAgICAgICAgICBnbG9iYWxUaGlzLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBbcmVxdWVzdCwgaXNDb25maXJtUG9wdXBdLFxuICAgICk7XG5cbiAgY29uc3QgY2FuY2VsSGFuZGxlciA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICgpID0+XG4gICAgICB1cGRhdGVBY3Rpb24oe1xuICAgICAgICBzdGF0dXM6IEFjdGlvblN0YXR1cy5FUlJPUl9VU0VSX0NBTkNFTEVELFxuICAgICAgICBpZDogYWN0aW9uSWQsXG4gICAgICB9KSxcbiAgICBbYWN0aW9uSWQsIHVwZGF0ZUFjdGlvbl0sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNDb25maXJtUG9wdXApIHtcbiAgICAgIHJlcXVlc3Q8R2V0QWN0aW9uSGFuZGxlcj4oe1xuICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuQUNUSU9OX0dFVCxcbiAgICAgICAgcGFyYW1zOiBbYWN0aW9uSWRdLFxuICAgICAgfSkudGhlbigoYSkgPT4ge1xuICAgICAgICBpZiAoaXNCYXRjaEFwcHJvdmFsICYmICFpc0JhdGNoQXBwcm92YWxBY3Rpb24oYSkpIHtcbiAgICAgICAgICBzZXRFcnJvcignRXhwZWN0ZWQgYSBiYXRjaCBhcHByb3ZhbCBhY3Rpb24nKTtcbiAgICAgICAgfSBlbHNlIGlmICghaXNCYXRjaEFwcHJvdmFsICYmIGlzQmF0Y2hBcHByb3ZhbEFjdGlvbihhKSkge1xuICAgICAgICAgIHNldEVycm9yKCdFeHBlY3RlZCBhIHNpbmdsZSBhcHByb3ZhbCBhY3Rpb24nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRBY3Rpb24oYSBhcyBBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChhcHByb3ZhbD8uYWN0aW9uLmFjdGlvbklkID09PSBhY3Rpb25JZCkge1xuICAgICAgc2V0QWN0aW9uKGFwcHJvdmFsLmFjdGlvbiBhcyBBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+KTtcbiAgICB9XG4gIH0sIFthY3Rpb25JZCwgcmVxdWVzdCwgYXBwcm92YWwsIGlzQ29uZmlybVBvcHVwLCBpc0JhdGNoQXBwcm92YWxdKTtcblxuICB1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4oY2FuY2VsSGFuZGxlcik7XG5cbiAgcmV0dXJuIHsgYWN0aW9uLCB1cGRhdGVBY3Rpb24sIGVycm9yLCBjYW5jZWxIYW5kbGVyIH07XG59XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTG9jYXRpb24gfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcblxuLyoqXG4gKiBUaGlzIGlzIHVzZWQgdG8gZ2V0IHRoZSBpZCBvZiBhIHRyYW5zYWN0aW9uIG9yIG1lc3NhZ2UgdGhhdFxuICogaGFzIGJlZW4gcHV0IGludG8gbG9jYWxzdG9yYWdlIGFuZCB0byBiZSB1c2VkIGFjcm9zcyBtdWx0aXBsZVxuICogY29udGV4dHMuIFdlIGdyYWIgdGhlIHF1ZXJ5IHBhcmFtIGFuZCB1c2UgdGhhdCB0byBnZXQgdGhlIGl0ZW0gb3V0IG9mIHN0b3JhZ2UuXG4gKlxuICogQHJldHVybnMgaWQgZnJvbSB0aGUgcXVlcnkgcGFyYW1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUdldFJlcXVlc3RJZCgpIHtcbiAgY29uc3QgbG9jYXRpb24gPSB1c2VMb2NhdGlvbigpO1xuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCA/PyAnJyk7XG4gICAgcmV0dXJuIHNlYXJjaFBhcmFtcy5nZXQoJ2FjdGlvbklkJykgPz8gJyc7XG4gIH0sIFtsb2NhdGlvbi5zZWFyY2hdKTtcbn1cbiIsImltcG9ydCB7IEFjY291bnRUeXBlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuXG5jb25zdCB1c2VJc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQgPSAoKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuXG4gIHJldHVybiBhY3RpdmVBY2NvdW50Py50eXBlID09PSBBY2NvdW50VHlwZS5GSVJFQkxPQ0tTO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgdXNlSXNVc2luZ0ZpcmVibG9ja3NBY2NvdW50O1xuIiwiaW1wb3J0IHsgQWNjb3VudFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5cbmNvbnN0IHVzZUlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCA9ICgpID0+IHtcbiAgY29uc3Qge1xuICAgIGFjY291bnRzOiB7IGFjdGl2ZTogYWN0aXZlQWNjb3VudCB9LFxuICB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG5cbiAgcmV0dXJuIGFjdGl2ZUFjY291bnQ/LnR5cGUgPT09IEFjY291bnRUeXBlLldBTExFVF9DT05ORUNUO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgdXNlSXNVc2luZ1dhbGxldENvbm5lY3RBY2NvdW50O1xuIiwiaW1wb3J0IHtcbiAgQXZhdGFyLFxuICBCYWRnZSxcbiAgQml0Y29pbkNvbG9ySWNvbixcbiAgRmlyZWJsb2Nrc0ljb24sXG4gIFdhbGxldENvbm5lY3RJY29uLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbnRlcmZhY2UgRmlyZWJsb2Nrc0F2YXRhclByb3BzIHtcbiAgYmFkZ2VJY29uPzogJ3dhbGxldENvbm5lY3QnIHwgJ2JpdGNvaW4nO1xufVxuXG5leHBvcnQgY29uc3QgRmlyZWJsb2Nrc0F2YXRhciA9ICh7XG4gIGJhZGdlSWNvbiA9ICd3YWxsZXRDb25uZWN0Jyxcbn06IEZpcmVibG9ja3NBdmF0YXJQcm9wcykgPT4gKFxuICA8QmFkZ2VcbiAgICBvdmVybGFwPVwiY2lyY3VsYXJcIlxuICAgIGJhZGdlQ29udGVudD17XG4gICAgICA8QXZhdGFyXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6ICcyNHB4JyxcbiAgICAgICAgICBoZWlnaHQ6ICcyNHB4JyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6XG4gICAgICAgICAgICBiYWRnZUljb24gPT09ICd3YWxsZXRDb25uZWN0JyA/ICdpbmZvLmRhcmsnIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQnLFxuICAgICAgICAgIGJvcmRlckNvbG9yOiAnYmFja2dyb3VuZC5wYXBlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtiYWRnZUljb24gPT09ICd3YWxsZXRDb25uZWN0JyAmJiA8V2FsbGV0Q29ubmVjdEljb24gc2l6ZT17MTZ9IC8+fVxuICAgICAgICB7YmFkZ2VJY29uID09PSAnYml0Y29pbicgJiYgPEJpdGNvaW5Db2xvckljb24gc2l6ZT17MjR9IC8+fVxuICAgICAgPC9BdmF0YXI+XG4gICAgfVxuICAgIGFuY2hvck9yaWdpbj17e1xuICAgICAgdmVydGljYWw6ICdib3R0b20nLFxuICAgICAgaG9yaXpvbnRhbDogJ3JpZ2h0JyxcbiAgICB9fVxuICA+XG4gICAgPEF2YXRhclxuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6ICc2NHB4JyxcbiAgICAgICAgaGVpZ2h0OiAnNjRweCcsXG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCcsXG4gICAgICAgIGJvcmRlckNvbG9yOiAncHJpbWFyeS5tYWluJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEZpcmVibG9ja3NJY29uIHNpemU9ezMyfSAvPlxuICAgIDwvQXZhdGFyPlxuICA8L0JhZGdlPlxuKTtcbiIsImltcG9ydCB7IFdhbGxldENvbm5lY3RJY29uLCBBdmF0YXIgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgV2FsbGV0Q29ubmVjdENpcmNsZWRJY29uID0gKCkgPT4gKFxuICA8QXZhdGFyXG4gICAgc3g9e3tcbiAgICAgIHdpZHRoOiAnNjRweCcsXG4gICAgICBoZWlnaHQ6ICc2NHB4JyxcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCcsXG4gICAgICBib3JkZXJDb2xvcjogJ2luZm8uZGFyaycsXG4gICAgfX1cbiAgPlxuICAgIDxXYWxsZXRDb25uZWN0SWNvbiBzaXplPXs0Mn0gLz5cbiAgPC9BdmF0YXI+XG4pO1xuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgU2Nyb2xsYmFycyxcbiAgU2tlbGV0b24sXG4gIFN0YWNrLFxuICBUYWIsXG4gIFRhYlBhbmVsLFxuICBUYWJzLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZVdhbGxldENvbm5lY3RDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRDb25uZWN0Q29udGV4dFByb3ZpZGVyL1dhbGxldENvbm5lY3RDb250ZXh0UHJvdmlkZXInO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdFFSQ29kZSB9IGZyb20gJy4vV2FsbGV0Q29ubmVjdFFSQ29kZSc7XG5pbXBvcnQgeyBXYWxsZXRDb25uZWN0U3RhdHVzTWVzc2FnZSB9IGZyb20gJy4vV2FsbGV0Q29ubmVjdFN0YXR1c01lc3NhZ2UnO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdFVSSUZpZWxkIH0gZnJvbSAnLi9XYWxsZXRDb25uZWN0VVJJRmllbGQnO1xuaW1wb3J0IHtcbiAgQWNjb3VudEltcG9ydFN0YXR1cyxcbiAgT25Db25uZWN0Q2FsbGJhY2ssXG59IGZyb20gJ0BzcmMvY29udGV4dHMvV2FsbGV0Q29ubmVjdENvbnRleHRQcm92aWRlci9tb2RlbHMnO1xuXG5lbnVtIFdhbGxldENvbm5lY3RUYWJzIHtcbiAgUVIsXG4gIFVSSSxcbn1cblxuaW50ZXJmYWNlIFdhbGxldENvbm5lY3RDb25uZWN0b3JQcm9wcyB7XG4gIHJlY29ubmVjdGlvbkFkZHJlc3M/OiBzdHJpbmc7XG4gIGN1c3RvbU1lc3NhZ2U/OiBzdHJpbmc7XG4gIG9uQ29ubmVjdDogT25Db25uZWN0Q2FsbGJhY2s7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdhbGxldENvbm5lY3RDb25uZWN0b3Ioe1xuICByZWNvbm5lY3Rpb25BZGRyZXNzLFxuICBjdXN0b21NZXNzYWdlLFxuICBvbkNvbm5lY3QsXG59OiBXYWxsZXRDb25uZWN0Q29ubmVjdG9yUHJvcHMpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCBbdGFiLCBzZXRUYWJdID0gdXNlU3RhdGUoV2FsbGV0Q29ubmVjdFRhYnMuUVIpO1xuICBjb25zdCB7IGltcG9ydFN0YXRlLCByZXNldCwgaW5pdGlhdGVJbXBvcnQgfSA9IHVzZVdhbGxldENvbm5lY3RDb250ZXh0KCk7XG4gIGNvbnN0IGhhc0Nvbm5lY3Rpb25VcmkgPSAndXJpJyBpbiBpbXBvcnRTdGF0ZTtcbiAgY29uc3Qgc2hvd1JlZ2VuZXJhdGVCdXR0b24gPVxuICAgIGltcG9ydFN0YXRlLnN0YXR1cyA9PT0gQWNjb3VudEltcG9ydFN0YXR1cy5GYWlsZWQ7XG5cbiAgLy8gUmVzZXQgaW1wb3J0IHN0YXRlIG9uIG1vdW50XG4gIHVzZUVmZmVjdChyZXNldCwgW3Jlc2V0XSk7XG5cbiAgLy8gSW5pdGlhdGUgYWNjb3VudCBpbXBvcnQgYXMgc29vbiBhcyB0aGlzIHBhZ2UgaXMgZGlzcGxheWVkLFxuICAvLyBhcyBsb25nIGFzIGl0IHdhc24ndCBhbHJlYWR5IGluaXRpYXRlZC5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaW1wb3J0U3RhdGUuc3RhdHVzID09PSBBY2NvdW50SW1wb3J0U3RhdHVzLk5vdEluaXRpYXRlZCkge1xuICAgICAgaW5pdGlhdGVJbXBvcnQocmVjb25uZWN0aW9uQWRkcmVzcywgb25Db25uZWN0KTtcbiAgICB9XG4gIH0sIFtpbml0aWF0ZUltcG9ydCwgcmVjb25uZWN0aW9uQWRkcmVzcywgaW1wb3J0U3RhdGUuc3RhdHVzLCBvbkNvbm5lY3RdKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgZ2FwOiAyLjUsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtoYXNDb25uZWN0aW9uVXJpICYmIChcbiAgICAgICAgPD5cbiAgICAgICAgICA8VGFic1xuICAgICAgICAgICAgc2l6ZT1cIm1lZGl1bVwiXG4gICAgICAgICAgICB2YWx1ZT17dGFifVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhfLCBjaG9zZW5UYWIpID0+IHNldFRhYihjaG9zZW5UYWIpfVxuICAgICAgICAgICAgaXNDb250YWluZWRcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VGFiXG4gICAgICAgICAgICAgIGxhYmVsPXt0KCdRUiBDb2RlJyl9XG4gICAgICAgICAgICAgIHZhbHVlPXtXYWxsZXRDb25uZWN0VGFicy5RUn1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ3Yy10YWItcXJcIlxuICAgICAgICAgICAgICBzeD17eyBtcjogMC41IH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFRhYlxuICAgICAgICAgICAgICBsYWJlbD17dCgnVVJJJyl9XG4gICAgICAgICAgICAgIHZhbHVlPXtXYWxsZXRDb25uZWN0VGFicy5VUkl9XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwid2MtdGFiLXVyaVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvVGFicz5cbiAgICAgICAgICA8U2Nyb2xsYmFyc1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICAgIG1heEhlaWdodDogJ3Vuc2V0JyxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFRhYlBhbmVsXG4gICAgICAgICAgICAgIHZhbHVlPXt0YWJ9XG4gICAgICAgICAgICAgIGluZGV4PXtXYWxsZXRDb25uZWN0VGFicy5RUn1cbiAgICAgICAgICAgICAgc3g9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgZ2FwOiAxLjUsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogJzIwMHB4JyxcbiAgICAgICAgICAgICAgICAgIG1hcmdpblg6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFdhbGxldENvbm5lY3RRUkNvZGVcbiAgICAgICAgICAgICAgICAgIHVyaT17aW1wb3J0U3RhdGUudXJpfVxuICAgICAgICAgICAgICAgICAgc3RhdHVzPXtpbXBvcnRTdGF0ZS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8V2FsbGV0Q29ubmVjdFN0YXR1c01lc3NhZ2UgaW1wb3J0U3RhdGU9e2ltcG9ydFN0YXRlfSAvPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgIDxUYWJQYW5lbCB2YWx1ZT17dGFifSBpbmRleD17V2FsbGV0Q29ubmVjdFRhYnMuVVJJfT5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMS41LCB3aWR0aDogMjIwLCBtYXJnaW5YOiAnYXV0bycgfX0+XG4gICAgICAgICAgICAgICAgPFdhbGxldENvbm5lY3RVUklGaWVsZFxuICAgICAgICAgICAgICAgICAgdXJpPXtpbXBvcnRTdGF0ZS51cml9XG4gICAgICAgICAgICAgICAgICBzdGF0dXM9e2ltcG9ydFN0YXRlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxXYWxsZXRDb25uZWN0U3RhdHVzTWVzc2FnZSBpbXBvcnRTdGF0ZT17aW1wb3J0U3RhdGV9IC8+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8L1RhYlBhbmVsPlxuICAgICAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICAgICAgICB7c2hvd1JlZ2VuZXJhdGVCdXR0b24gJiYgKFxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBzeD17eyBtYjogNCB9fVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBpbml0aWF0ZUltcG9ydChyZWNvbm5lY3Rpb25BZGRyZXNzLCBvbkNvbm5lY3QpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnUmVnZW5lcmF0ZSBRUiBjb2RlJyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHshc2hvd1JlZ2VuZXJhdGVCdXR0b24gJiYgdGFiID09PSBXYWxsZXRDb25uZWN0VGFicy5RUiAmJiAoXG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBtYjogNCwgd2lkdGg6ICcyODBweCcgfX0+XG4gICAgICAgICAgICAgIHtjdXN0b21NZXNzYWdlID8/IHQoJ1NjYW4gdGhlIFFSIGNvZGUgd2l0aCB5b3VyIG1vYmlsZSB3YWxsZXQuJyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC8+XG4gICAgICApfVxuXG4gICAgICB7IWhhc0Nvbm5lY3Rpb25VcmkgJiYgKFxuICAgICAgICA8U3RhY2sgc3g9e3sgcHQ6IDUuNSB9fT5cbiAgICAgICAgICA8U2tlbGV0b24gdmFyaWFudD1cInJlY3Rhbmd1bGFyXCIgd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIgLz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCBRUkNvZGUgZnJvbSAncXJjb2RlLnJlYWN0JztcbmltcG9ydCB7IEJveCwgdXNlVGhlbWUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyBBY2NvdW50SW1wb3J0U3RhdHVzIH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRDb25uZWN0Q29udGV4dFByb3ZpZGVyL21vZGVscyc7XG5cbmltcG9ydCB7IGdldENvbG9yRm9yU3RhdHVzIH0gZnJvbSAnLi91dGlscy9nZXRDb2xvckZvclN0YXR1cyc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIHVyaTogc3RyaW5nO1xuICBzdGF0dXM6IEFjY291bnRJbXBvcnRTdGF0dXM7XG59O1xuXG5leHBvcnQgY29uc3QgV2FsbGV0Q29ubmVjdFFSQ29kZSA9ICh7IHVyaSwgc3RhdHVzIH06IFByb3BzKSA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIHN4PXt7XG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICBiYWNrZ3JvdW5kOiB0aGVtZS5wYWxldHRlLmNvbW1vbi53aGl0ZSxcbiAgICAgICAgcDogMC41LFxuICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgIGhlaWdodDogMjAwLFxuICAgICAgICBib3JkZXI6ICcycHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICB0cmFuc2l0aW9uOiB0aGVtZS50cmFuc2l0aW9ucy5jcmVhdGUoJ2JvcmRlci1jb2xvcicpLFxuICAgICAgICBib3JkZXJDb2xvcjogZ2V0Q29sb3JGb3JTdGF0dXMoc3RhdHVzKSxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFFSQ29kZVxuICAgICAgICByZW5kZXJBcz1cInN2Z1wiXG4gICAgICAgIGZnQ29sb3I9e3RoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrfVxuICAgICAgICBiZ0NvbG9yPXt0aGVtZS5wYWxldHRlLmNvbW1vbi53aGl0ZX1cbiAgICAgICAgdmFsdWU9e3VyaX1cbiAgICAgICAgbGV2ZWw9XCJIXCJcbiAgICAgICAgc2l6ZT17MTg4fVxuICAgICAgLz5cbiAgICA8L0JveD5cbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBBbGVydENpcmNsZUljb24sXG4gIEJveCxcbiAgQ2hlY2tDaXJjbGVJY29uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7XG4gIEFjY291bnRJbXBvcnRTdGF0ZSxcbiAgQWNjb3VudEltcG9ydFN0YXR1cyxcbn0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRDb25uZWN0Q29udGV4dFByb3ZpZGVyL21vZGVscyc7XG5cbmltcG9ydCB7IGdldENvbG9yRm9yU3RhdHVzIH0gZnJvbSAnLi91dGlscy9nZXRDb2xvckZvclN0YXR1cyc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIGltcG9ydFN0YXRlOiBBY2NvdW50SW1wb3J0U3RhdGU7XG4gIHJlY29ubmVjdGlvbkFkZHJlc3M/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgY29uc3QgV2FsbGV0Q29ubmVjdFN0YXR1c01lc3NhZ2UgPSAoe1xuICBpbXBvcnRTdGF0ZSxcbiAgcmVjb25uZWN0aW9uQWRkcmVzcyxcbn06IFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCBoYXNDb25uZWN0aW9uRmFpbGVkID0gaW1wb3J0U3RhdGUuc3RhdHVzID09PSBBY2NvdW50SW1wb3J0U3RhdHVzLkZhaWxlZDtcbiAgY29uc3QgaGFzQ29ubmVjdGlvblN1Y2NlZWRlZCA9XG4gICAgaW1wb3J0U3RhdGUuc3RhdHVzID09PSBBY2NvdW50SW1wb3J0U3RhdHVzLlN1Y2Nlc3NmdWw7XG5cbiAgaWYgKCFoYXNDb25uZWN0aW9uRmFpbGVkICYmICFoYXNDb25uZWN0aW9uU3VjY2VlZGVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgZGlyZWN0aW9uPVwicm93XCJcbiAgICAgIHN4PXt7XG4gICAgICAgIGdhcDogMSxcbiAgICAgICAgY29sb3I6IGdldENvbG9yRm9yU3RhdHVzKGltcG9ydFN0YXRlLnN0YXR1cyksXG4gICAgICAgIHRleHRBbGlnbjogJ3N0YXJ0JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ3N0YXJ0JyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEJveCBzeD17eyBkaXNwbGF5OiAnZmxleCcsIG1hcmdpblRvcDogJy0xcHgnIH19PlxuICAgICAgICB7aGFzQ29ubmVjdGlvbkZhaWxlZCA/IChcbiAgICAgICAgICA8QWxlcnRDaXJjbGVJY29uIHNpemU9ezE2fSAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxDaGVja0NpcmNsZUljb24gc2l6ZT17MTZ9IC8+XG4gICAgICAgICl9XG4gICAgICA8L0JveD5cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgIHtoYXNDb25uZWN0aW9uRmFpbGVkXG4gICAgICAgICAgPyBpbXBvcnRTdGF0ZS5lcnJvclxuICAgICAgICAgIDogcmVjb25uZWN0aW9uQWRkcmVzc1xuICAgICAgICAgICAgPyB0KCdTY2FuIHN1Y2Nlc3NmdWwuIFdhaXRpbmcgdG8gYmUgY29uZmlybWVkLi4uJylcbiAgICAgICAgICAgIDogdCgnU2NhbiBzdWNjZXNzZnVsLiBJbXBvcnRpbmcgYWNjb3VudHMuLi4nKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIENvcHlJY29uLFxuICBJY29uQnV0dG9uLFxuICBTY3JvbGxiYXJzLFxuICBTdGFjayxcbiAgdG9hc3QsXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyBBY2NvdW50SW1wb3J0U3RhdHVzIH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRDb25uZWN0Q29udGV4dFByb3ZpZGVyL21vZGVscyc7XG5cbmltcG9ydCB7IGdldENvbG9yRm9yU3RhdHVzIH0gZnJvbSAnLi91dGlscy9nZXRDb2xvckZvclN0YXR1cyc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIHVyaTogc3RyaW5nO1xuICBzdGF0dXM6IEFjY291bnRJbXBvcnRTdGF0dXM7XG59O1xuXG5leHBvcnQgY29uc3QgV2FsbGV0Q29ubmVjdFVSSUZpZWxkID0gKHsgdXJpLCBzdGF0dXMgfTogUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgY29uc3Qgb25Db3B5Q2xpY2sgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodXJpKTtcbiAgICB0b2FzdC5zdWNjZXNzKHQoJ0NvcGllZCEnKSwgeyBkdXJhdGlvbjogMjAwMCB9KTtcbiAgfSwgW3VyaSwgdF0pO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogMjI0LFxuICAgICAgICBoZWlnaHQ6IDIxMixcbiAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF0sXG4gICAgICAgIHdvcmRXcmFwOiAnYnJlYWstd29yZCcsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBwdDogMS41LFxuICAgICAgICBwYjogMSxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAxLFxuICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgIHVzZXJTZWxlY3Q6ICdhbGwnLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICB0cmFuc2l0aW9uOiB0aGVtZS50cmFuc2l0aW9ucy5jcmVhdGUoJ2JvcmRlci1jb2xvcicpLFxuICAgICAgICBib3JkZXJDb2xvcjogZ2V0Q29sb3JGb3JTdGF0dXMoc3RhdHVzKSxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFNjcm9sbGJhcnM+e3VyaX08L1Njcm9sbGJhcnM+XG4gICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIG10OiAtMSwgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJywgZmxleFNocmluazogMCB9fT5cbiAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgIHN4PXt7IG9wYWNpdHk6IDAuNiwgbXI6IC0wLjUgfX1cbiAgICAgICAgICBvbkNsaWNrPXtvbkNvcHlDbGlja31cbiAgICAgICAgPlxuICAgICAgICAgIDxDb3B5SWNvbiBzaXplPXsxNH0gLz5cbiAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7IEFjY291bnRJbXBvcnRTdGF0dXMgfSBmcm9tICdAc3JjL2NvbnRleHRzL1dhbGxldENvbm5lY3RDb250ZXh0UHJvdmlkZXIvbW9kZWxzJztcblxuZXhwb3J0IGNvbnN0IGdldENvbG9yRm9yU3RhdHVzID0gKHN0YXR1czogQWNjb3VudEltcG9ydFN0YXR1cykgPT4ge1xuICBzd2l0Y2ggKHN0YXR1cykge1xuICAgIGNhc2UgQWNjb3VudEltcG9ydFN0YXR1cy5GYWlsZWQ6XG4gICAgICByZXR1cm4gJ2Vycm9yLm1haW4nO1xuXG4gICAgY2FzZSBBY2NvdW50SW1wb3J0U3RhdHVzLlN1Y2Nlc3NmdWw6XG4gICAgICByZXR1cm4gJ3N1Y2Nlc3MubWFpbic7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSZXF1aXJlZFNlc3Npb24gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL3dhbGxldENvbm5lY3QvdXNlUmVxdWlyZWRTZXNzaW9uJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyBDaXJjdWxhclByb2dyZXNzLCBTdGFjayB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdEFwcHJvdmFsQ29ubmVjdCB9IGZyb20gJy4uL1dhbGxldENvbm5lY3RBcHByb3ZhbC9XYWxsZXRDb25uZWN0QXBwcm92YWxDb25uZWN0JztcbmltcG9ydCBzaG91bGRVc2VXYWxsZXRDb25uZWN0QXBwcm92YWwgZnJvbSAnQHNyYy91dGlscy9zaG91bGRVc2VXYWxsZXRDb25uZWN0QXBwcm92YWwnO1xuaW1wb3J0IHtcbiAgQXBwcm92YWxTdGVwLFxuICBnZXRBY3RpdmVTdGVwLFxufSBmcm9tICcuLi8uLi91dGlscy9nZXRBY3RpdmVTdGVwRm9yUmVtb3RlQXBwcm92YWwnO1xuaW1wb3J0IHsgUmVtb3RlQXBwcm92YWxEaWFsb2cgfSBmcm9tICcuLi9SZW1vdGVBcHByb3ZhbC9SZW1vdGVBcHByb3ZhbERpYWxvZyc7XG5pbXBvcnQgeyBGaXJlYmxvY2tzQXBwcm92YWxSZXZpZXcgfSBmcm9tICcuL0ZpcmVibG9ja3NBcHByb3ZhbFJldmlldyc7XG5pbXBvcnQgeyBGaXJlYmxvY2tzQXZhdGFyIH0gZnJvbSAnLi4vLi4vLi4vRmlyZWJsb2Nrcy9jb21wb25lbnRzL0ZpcmVibG9ja3NBdmF0YXInO1xuXG5pbnRlcmZhY2UgRmlyZWJsb2Nrc0FwcHJvdmFsT3ZlcmxheVByb3BzIHtcbiAgb25SZWplY3Q6ICgpID0+IHZvaWQ7XG4gIG9uU3VibWl0OiAoKSA9PiB2b2lkO1xuICBhZGRyZXNzPzogc3RyaW5nO1xuICBhbW91bnQ/OiBzdHJpbmc7XG4gIHN5bWJvbD86IHN0cmluZztcbiAgZmVlPzogc3RyaW5nO1xuICBmZWVTeW1ib2w/OiBzdHJpbmc7XG4gIG5mdE5hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBGaXJlYmxvY2tzQXBwcm92YWxPdmVybGF5KHtcbiAgb25SZWplY3QsXG4gIG9uU3VibWl0LFxufTogRmlyZWJsb2Nrc0FwcHJvdmFsT3ZlcmxheVByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBuZXR3b3JrOiBhY3RpdmVOZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCB7XG4gICAgYWNjb3VudHM6IHsgYWN0aXZlOiBhY3RpdmVBY2NvdW50IH0sXG4gIH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcbiAgY29uc3QgW3JlcXVlc3RTZW50LCBzZXRSZXF1ZXN0U2VudF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IHtcbiAgICBhY3RpdmVTZXNzaW9uLFxuICAgIGlzVmFsaWRTZXNzaW9uLFxuICAgIGlzTmV3Q29ubmVjdGlvblJlcXVpcmVkLFxuICAgIGVzdGFibGlzaFJlcXVpcmVkU2Vzc2lvbixcbiAgfSA9IHVzZVJlcXVpcmVkU2Vzc2lvbigpO1xuXG4gIGNvbnN0IHNob3VsZFVzZVdhbGxldENvbm5lY3RUb0FwcHJvdmUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWFjdGl2ZU5ldHdvcmsgfHwgIWFjdGl2ZUFjY291bnQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNob3VsZFVzZVdhbGxldENvbm5lY3RBcHByb3ZhbChhY3RpdmVOZXR3b3JrLCBhY3RpdmVBY2NvdW50KTtcbiAgfSwgW2FjdGl2ZUFjY291bnQsIGFjdGl2ZU5ldHdvcmtdKTtcblxuICBjb25zdCBhY3RpdmVTdGVwID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKHNob3VsZFVzZVdhbGxldENvbm5lY3RUb0FwcHJvdmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIEFwcHJvdmFsU3RlcC5MT0FESU5HO1xuICAgIH1cblxuICAgIGlmIChzaG91bGRVc2VXYWxsZXRDb25uZWN0VG9BcHByb3ZlKSB7XG4gICAgICByZXR1cm4gZ2V0QWN0aXZlU3RlcChyZXF1ZXN0U2VudCwgYWN0aXZlU2Vzc2lvbiwgaXNOZXdDb25uZWN0aW9uUmVxdWlyZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVxdWVzdFNlbnQpIHtcbiAgICAgICAgcmV0dXJuIEFwcHJvdmFsU3RlcC5TRU5UO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEFwcHJvdmFsU3RlcC5BUFBST1ZBTDtcbiAgICB9XG4gIH0sIFtcbiAgICByZXF1ZXN0U2VudCxcbiAgICBpc05ld0Nvbm5lY3Rpb25SZXF1aXJlZCxcbiAgICBhY3RpdmVTZXNzaW9uLFxuICAgIHNob3VsZFVzZVdhbGxldENvbm5lY3RUb0FwcHJvdmUsXG4gIF0pO1xuXG4gIGNvbnN0IHBhZ2VUaXRsZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHN3aXRjaCAoYWN0aXZlU3RlcCkge1xuICAgICAgY2FzZSBBcHByb3ZhbFN0ZXAuQVBQUk9WQUw6XG4gICAgICAgIHJldHVybiB0KCdGaXJlYmxvY2tzIEFwcHJvdmFsJyk7XG4gICAgICBjYXNlIEFwcHJvdmFsU3RlcC5DT05ORUNUOlxuICAgICAgICByZXR1cm4gdCgnU2NhbiBRUiBDb2RlIHRvIENvbm5lY3QnKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0sIFthY3RpdmVTdGVwLCB0XSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYWN0aXZlQWNjb3VudCAmJiBhY3RpdmVOZXR3b3JrKSB7XG4gICAgICBlc3RhYmxpc2hSZXF1aXJlZFNlc3Npb24oYWN0aXZlQWNjb3VudC5hZGRyZXNzQywgYWN0aXZlTmV0d29yay5jaGFpbklkKTtcbiAgICB9XG4gIH0sIFthY3RpdmVBY2NvdW50LCBhY3RpdmVOZXR3b3JrLCBlc3RhYmxpc2hSZXF1aXJlZFNlc3Npb25dKTtcblxuICByZXR1cm4gKFxuICAgIDxSZW1vdGVBcHByb3ZhbERpYWxvZyBvblJlamVjdD17b25SZWplY3R9IHBhZ2VUaXRsZT17cGFnZVRpdGxlfT5cbiAgICAgIHthY3RpdmVTdGVwID09PSBBcHByb3ZhbFN0ZXAuTE9BRElORyAmJiAoXG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIG10OiAyMCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPENpcmN1bGFyUHJvZ3Jlc3Mgc2l6ZT17ODB9IC8+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApfVxuICAgICAgeyhhY3RpdmVTdGVwID09PSBBcHByb3ZhbFN0ZXAuQVBQUk9WQUwgfHxcbiAgICAgICAgYWN0aXZlU3RlcCA9PT0gQXBwcm92YWxTdGVwLlNFTlQpICYmIChcbiAgICAgICAgPEZpcmVibG9ja3NBcHByb3ZhbFJldmlld1xuICAgICAgICAgIGFjY291bnQ9e2FjdGl2ZUFjY291bnR9XG4gICAgICAgICAgdXNlV2FsbGV0Q29ubmVjdEFwcHJvdmFsPXtcbiAgICAgICAgICAgIHNob3VsZFVzZVdhbGxldENvbm5lY3RUb0FwcHJvdmUgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA/IGZhbHNlXG4gICAgICAgICAgICAgIDogc2hvdWxkVXNlV2FsbGV0Q29ubmVjdFRvQXBwcm92ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBhY3RpdmVTdGVwPXthY3RpdmVTdGVwfVxuICAgICAgICAgIHNlc3Npb249e2FjdGl2ZVNlc3Npb259XG4gICAgICAgICAgaXNWYWxpZFNlc3Npb249e2lzVmFsaWRTZXNzaW9ufVxuICAgICAgICAgIG9uUmVqZWN0PXtvblJlamVjdH1cbiAgICAgICAgICBvblNpZ249eygpID0+IHtcbiAgICAgICAgICAgIHNldFJlcXVlc3RTZW50KHRydWUpO1xuICAgICAgICAgICAgb25TdWJtaXQoKTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHthY3RpdmVTdGVwID09PSBBcHByb3ZhbFN0ZXAuQ09OTkVDVCAmJiAoXG4gICAgICAgIDxXYWxsZXRDb25uZWN0QXBwcm92YWxDb25uZWN0XG4gICAgICAgICAgYXBwSWNvbj17PEZpcmVibG9ja3NBdmF0YXIgLz59XG4gICAgICAgICAgcmVjb25uZWN0aW9uQWRkcmVzcz17YWN0aXZlQWNjb3VudD8uYWRkcmVzc0MgYXMgc3RyaW5nfVxuICAgICAgICAgIGN1c3RvbU1lc3NhZ2U9e3QoXG4gICAgICAgICAgICAnUGxlYXNlIHJlY29ubmVjdCB1c2luZyBXYWxsZXQgQ29ubmVjdCB0byBhZGQgdGhpcyBuZXR3b3JrIHRvIGF1dGhvcml6ZWQgbmV0d29ya3MuJyxcbiAgICAgICAgICApfVxuICAgICAgICAgIG9uQ29ubmVjdD17KCkgPT4ge1xuICAgICAgICAgICAgZXN0YWJsaXNoUmVxdWlyZWRTZXNzaW9uKFxuICAgICAgICAgICAgICBhY3RpdmVBY2NvdW50Py5hZGRyZXNzQyBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgIGFjdGl2ZU5ldHdvcms/LmNoYWluSWQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8L1JlbW90ZUFwcHJvdmFsRGlhbG9nPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQWxlcnRUcmlhbmdsZUljb24sXG4gIENoZWNrQ2lyY2xlSWNvbixcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgRmlyZWJsb2Nrc0ljb24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgVHJhbnMgfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IFdhbGxldENvbm5lY3RTZXNzaW9uSW5mbyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXRDb25uZWN0L21vZGVscyc7XG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQXBwcm92YWxTdGVwIH0gZnJvbSAnLi4vLi4vdXRpbHMvZ2V0QWN0aXZlU3RlcEZvclJlbW90ZUFwcHJvdmFsJztcbmltcG9ydCB7IFJlbW90ZUFwcHJvdmFsQ29uZmlybWF0aW9uIH0gZnJvbSAnLi4vUmVtb3RlQXBwcm92YWwvUmVtb3RlQXBwcm92YWxDb25maXJtYXRpb24nO1xuaW1wb3J0IHsgRmlyZWJsb2Nrc0F2YXRhciB9IGZyb20gJ0BzcmMvcGFnZXMvRmlyZWJsb2Nrcy9jb21wb25lbnRzL0ZpcmVibG9ja3NBdmF0YXInO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyBpc0JpdGNvaW5OZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNCaXRjb2luTmV0d29yayc7XG5pbXBvcnQgaXNGaXJlYmxvY2tzQXBpU3VwcG9ydGVkIGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9maXJlYmxvY2tzL3V0aWxzL2lzRmlyZWJsb2Nrc0FwaVN1cHBvcnRlZCc7XG5pbXBvcnQgeyBpc0ZpcmVibG9ja3NBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL3V0aWxzL3R5cGVHdWFyZHMnO1xuXG5pbnRlcmZhY2UgRmlyZWJsb2Nrc0FwcHJvdmFsUmV2aWV3UHJvcHMge1xuICBpc1ZhbGlkU2Vzc2lvbjogYm9vbGVhbjtcbiAgYWN0aXZlU3RlcDogQXBwcm92YWxTdGVwO1xuICB1c2VXYWxsZXRDb25uZWN0QXBwcm92YWw6IGJvb2xlYW47XG4gIG9uUmVqZWN0OiAoKSA9PiB2b2lkO1xuICBvblNpZ246ICgpID0+IHZvaWQ7XG4gIGFjY291bnQ/OiBBY2NvdW50O1xuICBzZXNzaW9uPzogV2FsbGV0Q29ubmVjdFNlc3Npb25JbmZvIHwgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZpcmVibG9ja3NBcHByb3ZhbFJldmlldyh7XG4gIGFjY291bnQsXG4gIGFjdGl2ZVN0ZXAsXG4gIHVzZVdhbGxldENvbm5lY3RBcHByb3ZhbCxcbiAgb25SZWplY3QsXG4gIG9uU2lnbixcbiAgc2Vzc2lvbixcblxuICBpc1ZhbGlkU2Vzc2lvbixcbn06IEZpcmVibG9ja3NBcHByb3ZhbFJldmlld1Byb3BzKSB7XG4gIGNvbnN0IHsgbmV0d29yazogYWN0aXZlTmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcblxuICBjb25zdCBzdGF0dXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoYWN0aXZlU3RlcCA9PT0gQXBwcm92YWxTdGVwLlNFTlQpIHtcbiAgICAgIHJldHVybiA8UmVxdWVzdFBlbmRpbmcgLz47XG4gICAgfVxuICAgIGlmICh1c2VXYWxsZXRDb25uZWN0QXBwcm92YWwpIHtcbiAgICAgIHJldHVybiBpc1ZhbGlkU2Vzc2lvbiA/IDxSZWFkeVRvU2lnbiAvPiA6IDxXcm9uZ05ldHdvcmsgLz47XG4gICAgfVxuICAgIHJldHVybiA8UmVhZHlUb1NpZ24gLz47XG4gIH0sIFthY3RpdmVTdGVwLCBpc1ZhbGlkU2Vzc2lvbiwgdXNlV2FsbGV0Q29ubmVjdEFwcHJvdmFsXSk7XG5cbiAgY29uc3QgaXNTZXNzaW9uVmFsaWQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAodXNlV2FsbGV0Q29ubmVjdEFwcHJvdmFsKSB7XG4gICAgICByZXR1cm4gaXNWYWxpZFNlc3Npb247XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzRmlyZWJsb2Nrc0FjY291bnQoYWNjb3VudCkgJiYgaXNGaXJlYmxvY2tzQXBpU3VwcG9ydGVkKGFjY291bnQpO1xuICB9LCBbYWNjb3VudCwgaXNWYWxpZFNlc3Npb24sIHVzZVdhbGxldENvbm5lY3RBcHByb3ZhbF0pO1xuXG4gIGNvbnN0IGlzQnRjTmV0d29yayA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKGFjdGl2ZU5ldHdvcmsgPyBpc0JpdGNvaW5OZXR3b3JrKGFjdGl2ZU5ldHdvcmspIDogZmFsc2UpLFxuICAgIFthY3RpdmVOZXR3b3JrXSxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxSZW1vdGVBcHByb3ZhbENvbmZpcm1hdGlvblxuICAgICAgbG9nbz17XG4gICAgICAgIDxGaXJlYmxvY2tzQXZhdGFyXG4gICAgICAgICAgYmFkZ2VJY29uPXtpc0J0Y05ldHdvcmsgPyAnYml0Y29pbicgOiAnd2FsbGV0Q29ubmVjdCd9XG4gICAgICAgIC8+XG4gICAgICB9XG4gICAgICBzdGF0dXM9e3N0YXR1c31cbiAgICAgIGlzVmFsaWRTZXNzaW9uPXtpc1Nlc3Npb25WYWxpZH1cbiAgICAgIGNvbm5lY3RpbmdUb0ljb249ezxGaXJlYmxvY2tzSWNvbiAvPn1cbiAgICAgIHVzZVJldHJ5QnV0dG9uPXt0cnVlfVxuICAgICAgdXNlV2FsbGV0Q29ubmVjdEFwcHJvdmFsPXt1c2VXYWxsZXRDb25uZWN0QXBwcm92YWx9XG4gICAgICBhY2NvdW50PXthY2NvdW50fVxuICAgICAgc2Vzc2lvbj17c2Vzc2lvbn1cbiAgICAgIG9uUmVqZWN0PXtvblJlamVjdH1cbiAgICAgIG9uU2lnbj17b25TaWdufVxuICAgIC8+XG4gICk7XG59XG5cbmNvbnN0IFJlcXVlc3RQZW5kaW5nID0gKCkgPT4gKFxuICA8U3RhY2tcbiAgICBzeD17e1xuICAgICAgY29sdW1uR2FwOiAxLFxuICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICB9fVxuICA+XG4gICAgPENpcmN1bGFyUHJvZ3Jlc3Mgc2l6ZT17MTZ9IC8+XG4gICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCI+XG4gICAgICA8VHJhbnMgaTE4bktleT1cIlNpZ25pbmcgcmVxdWVzdCBzZW50XCIgLz5cbiAgICA8L1R5cG9ncmFwaHk+XG4gIDwvU3RhY2s+XG4pO1xuXG5jb25zdCBSZWFkeVRvU2lnbiA9ICgpID0+IChcbiAgPFN0YWNrIHN4PXt7IGNvbHVtbkdhcDogMSwgZmxleERpcmVjdGlvbjogJ3JvdycsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgIDxDaGVja0NpcmNsZUljb24gc3g9e3sgY29sb3I6ICdzdWNjZXNzLm1haW4nIH19IC8+XG4gICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCI+XG4gICAgICA8VHJhbnMgaTE4bktleT1cIkNvbm5lY3RlZCBhbmQgcmVhZHkgdG8gc2lnblwiIC8+XG4gICAgPC9UeXBvZ3JhcGh5PlxuICA8L1N0YWNrPlxuKTtcblxuY29uc3QgV3JvbmdOZXR3b3JrID0gKCkgPT4gKFxuICA8U3RhY2sgc3g9e3sgY29sdW1uR2FwOiAxLCBmbGV4RGlyZWN0aW9uOiAncm93JywgYWxpZ25JdGVtczogJ3N0YXJ0JyB9fT5cbiAgICA8QWxlcnRUcmlhbmdsZUljb24gc3g9e3sgY29sb3I6ICd3YXJuaW5nLm1haW4nLCBwdDogMC41IH19IC8+XG4gICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCI+XG4gICAgICA8VHJhbnMgaTE4bktleT1cIldyb25nIG5ldHdvcmsuIFBsZWFzZSBzd2l0Y2ggbmV0d29ya3Mgb24geW91ciBtb2JpbGUgZGV2aWNlLlwiIC8+XG4gICAgPC9UeXBvZ3JhcGh5PlxuICA8L1N0YWNrPlxuKTtcbiIsImltcG9ydCB7XG4gIERpdmlkZXIsXG4gIFR5cG9ncmFwaHksXG4gIEJ1dHRvbixcbiAgU3RhY2ssXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyBXYWxsZXRDb25uZWN0U2Vzc2lvbkluZm8gfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0Q29ubmVjdC9tb2RlbHMnO1xuaW1wb3J0IHsgdCB9IGZyb20gJ2kxOG5leHQnO1xuaW1wb3J0IHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmludGVyZmFjZSBBZGRpdGlvbmFsQ29uZmlybWF0aW9uRm9yUmVtb3RlQXBwcm92YWxQcm9wcyB7XG4gIGxvZ286IEpTWC5FbGVtZW50O1xuICBzdGF0dXM6IEpTWC5FbGVtZW50O1xuICBpc1ZhbGlkU2Vzc2lvbjogYm9vbGVhbjtcbiAgY29ubmVjdGluZ1RvSWNvbjogSlNYLkVsZW1lbnQ7XG4gIHVzZVJldHJ5QnV0dG9uOiBib29sZWFuO1xuICB1c2VXYWxsZXRDb25uZWN0QXBwcm92YWw6IGJvb2xlYW47XG4gIG9uUmVqZWN0OiAoKSA9PiB2b2lkO1xuICBvblNpZ246ICgpID0+IHZvaWQ7XG4gIGFjY291bnQ/OiBBY2NvdW50O1xuICBzZXNzaW9uPzogV2FsbGV0Q29ubmVjdFNlc3Npb25JbmZvIHwgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlbW90ZUFwcHJvdmFsQ29uZmlybWF0aW9uKHtcbiAgbG9nbyxcbiAgc3RhdHVzLFxuICBpc1ZhbGlkU2Vzc2lvbixcbiAgY29ubmVjdGluZ1RvSWNvbixcbiAgdXNlUmV0cnlCdXR0b24sXG4gIHVzZVdhbGxldENvbm5lY3RBcHByb3ZhbCxcbiAgb25SZWplY3QsXG4gIG9uU2lnbixcbiAgYWNjb3VudCxcbiAgc2Vzc2lvbixcbn06IEFkZGl0aW9uYWxDb25maXJtYXRpb25Gb3JSZW1vdGVBcHByb3ZhbFByb3BzKSB7XG4gIGNvbnN0IFtzdWJtaXR0ZWQsIHNldFN1Ym1pdHRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtlbmFibGVTdWJtaXRCdXR0b24sIHNldEVuYWJsZVN1Ym1pdEJ1dHRvbl0gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICBjb25zdCBzaG93UmV0cnlCdXR0b24gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXVzZVJldHJ5QnV0dG9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChzdWJtaXR0ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sIFtzdWJtaXR0ZWQsIHVzZVJldHJ5QnV0dG9uXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICB7bG9nb31cbiAgICAgIDxTdGFjayBkaXZpZGVyPXs8RGl2aWRlciAvPn0gc3g9e3sgcm93R2FwOiAyLCB3aWR0aDogJzEwMCUnLCBweDogMyB9fT5cbiAgICAgICAge2FjY291bnQgJiYgKFxuICAgICAgICAgIDxTdGFjayBzeD17eyByb3dHYXA6IDAuNSB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICB7dCgnV2FsbGV0Jyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIj57YWNjb3VudC5uYW1lfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICB7dHJ1bmNhdGVBZGRyZXNzKGFjY291bnQuYWRkcmVzc0MpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICl9XG4gICAgICAgIHtzZXNzaW9uICYmIChcbiAgICAgICAgICA8U3RhY2sgc3g9e3sgcm93R2FwOiAwLjUgfX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgICAge3QoJ0Nvbm5lY3RpbmcgdG8nKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgIGNvbHVtbkdhcDogMSxcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2Nvbm5lY3RpbmdUb0ljb259XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MVwiPlxuICAgICAgICAgICAgICAgIHtzZXNzaW9uPy53YWxsZXRBcHA/Lm5hbWV9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgKX1cblxuICAgICAgICA8U3RhY2sgc3g9e3sgcm93R2FwOiAwLjUgfX0+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAgICB7dCgnU3RhdHVzJyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIHtzdGF0dXN9XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBjb2x1bW5HYXA6IDEsXG4gICAgICAgICAgbXQ6IDEwLFxuICAgICAgICAgIHBiOiAzLFxuICAgICAgICAgIHB4OiAzLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgc2V0U3VibWl0dGVkKGZhbHNlKTtcbiAgICAgICAgICAgIG9uUmVqZWN0KCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGVkfVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ1JlamVjdCcpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgc2V0U3VibWl0dGVkKHRydWUpO1xuICAgICAgICAgICAgc2V0RW5hYmxlU3VibWl0QnV0dG9uKGZhbHNlKTtcbiAgICAgICAgICAgIGlmICh1c2VXYWxsZXRDb25uZWN0QXBwcm92YWwpIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzZXRFbmFibGVTdWJtaXRCdXR0b24odHJ1ZSksIDUwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25TaWduKCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBkaXNhYmxlZD17IWlzVmFsaWRTZXNzaW9uIHx8ICFlbmFibGVTdWJtaXRCdXR0b259XG4gICAgICAgID5cbiAgICAgICAgICB7c2hvd1JldHJ5QnV0dG9uICYmIHN1Ym1pdHRlZCA/IHQoJ1JldHJ5JykgOiB0KCdTaWduJyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgRGlhbG9nLFxuICBJY29uQnV0dG9uLFxuICBUeXBvZ3JhcGh5LFxuICBYSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuXG5pbnRlcmZhY2UgUmVtb3RlQXBwcm92YWxEaWFsb2dQcm9wcyB7XG4gIG9uUmVqZWN0OiAoKSA9PiB2b2lkO1xuICBwYWdlVGl0bGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlbW90ZUFwcHJvdmFsRGlhbG9nKHtcbiAgb25SZWplY3QsXG4gIHBhZ2VUaXRsZSxcbiAgY2hpbGRyZW4sXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxSZW1vdGVBcHByb3ZhbERpYWxvZ1Byb3BzPikge1xuICByZXR1cm4gKFxuICAgIDxEaWFsb2dcbiAgICAgIG9wZW5cbiAgICAgIHNob3dDbG9zZUljb249e2ZhbHNlfVxuICAgICAgUGFwZXJQcm9wcz17e1xuICAgICAgICBzeDoge1xuICAgICAgICAgIG06IDIsXG4gICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgIG1heFdpZHRoOiAnbm9uZScsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIH0sXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgIG9uQ2xpY2s9e29uUmVqZWN0fVxuICAgICAgICBzeD17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiA4LCByaWdodDogOCwgcDogMSB9fVxuICAgICAgICBkaXNhYmxlUmlwcGxlXG4gICAgICA+XG4gICAgICAgIDxYSWNvbiBzaXplPXsyNH0gLz5cbiAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiIHN4PXt7IHB5OiAzLCBwbDogMywgcHI6IDYgfX0+XG4gICAgICAgIHtwYWdlVGl0bGV9XG4gICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0RpYWxvZz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFdhbGxldENvbm5lY3RDaXJjbGVkSWNvbiB9IGZyb20gJy4uLy4uLy4uL0ltcG9ydFdpdGhXYWxsZXRDb25uZWN0L2NvbXBvbmVudHMvV2FsbGV0Q29ubmVjdENpcmNsZWRJY29uJztcbmltcG9ydCBXYWxsZXRDb25uZWN0Q29ubmVjdG9yIGZyb20gJ0BzcmMvcGFnZXMvSW1wb3J0V2l0aFdhbGxldENvbm5lY3QvY29tcG9uZW50cy9XYWxsZXRDb25uZWN0Q29ubmVjdG9yJztcblxuaW50ZXJmYWNlIFdhbGxldENvbm5lY3RBcHByb3ZhbENvbm5lY3RQcm9wcyB7XG4gIHJlY29ubmVjdGlvbkFkZHJlc3M6IHN0cmluZztcbiAgY3VzdG9tTWVzc2FnZT86IHN0cmluZztcbiAgb25Db25uZWN0OiAoKSA9PiB2b2lkO1xuICBhcHBJY29uPzogUmVhY3QuUmVhY3RFbGVtZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gV2FsbGV0Q29ubmVjdEFwcHJvdmFsQ29ubmVjdCh7XG4gIHJlY29ubmVjdGlvbkFkZHJlc3MsXG4gIGN1c3RvbU1lc3NhZ2UsXG4gIG9uQ29ubmVjdCxcbiAgYXBwSWNvbixcbn06IFdhbGxldENvbm5lY3RBcHByb3ZhbENvbm5lY3RQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywgaGVpZ2h0OiAnMTAwJScsIGdhcDogMiB9fT5cbiAgICAgIHthcHBJY29uID8/IDxXYWxsZXRDb25uZWN0Q2lyY2xlZEljb24gLz59XG4gICAgICA8V2FsbGV0Q29ubmVjdENvbm5lY3RvclxuICAgICAgICByZWNvbm5lY3Rpb25BZGRyZXNzPXtyZWNvbm5lY3Rpb25BZGRyZXNzfVxuICAgICAgICBjdXN0b21NZXNzYWdlPXtjdXN0b21NZXNzYWdlfVxuICAgICAgICBvbkNvbm5lY3Q9e29uQ29ubmVjdH1cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IENpcmN1bGFyUHJvZ3Jlc3MsIFN0YWNrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VSZXF1aXJlZFNlc3Npb24gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL3dhbGxldENvbm5lY3QvdXNlUmVxdWlyZWRTZXNzaW9uJztcblxuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdEFwcHJvdmFsUmV2aWV3IH0gZnJvbSAnLi9XYWxsZXRDb25uZWN0QXBwcm92YWxSZXZpZXcnO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdEFwcHJvdmFsQ29ubmVjdCB9IGZyb20gJy4vV2FsbGV0Q29ubmVjdEFwcHJvdmFsQ29ubmVjdCc7XG5pbXBvcnQgeyBXYWxsZXRDb25uZWN0QXBwcm92YWxTZW50IH0gZnJvbSAnLi9XYWxsZXRDb25uZWN0QXBwcm92YWxTZW50JztcbmltcG9ydCB7IFJlbW90ZUFwcHJvdmFsRGlhbG9nIH0gZnJvbSAnLi4vUmVtb3RlQXBwcm92YWwvUmVtb3RlQXBwcm92YWxEaWFsb2cnO1xuaW1wb3J0IHtcbiAgQXBwcm92YWxTdGVwLFxuICBnZXRBY3RpdmVTdGVwLFxufSBmcm9tICcuLi8uLi91dGlscy9nZXRBY3RpdmVTdGVwRm9yUmVtb3RlQXBwcm92YWwnO1xuXG5pbnRlcmZhY2UgV2FsbGV0Q29ubmVjdEFwcHJvdmFsT3ZlcmxheVByb3BzIHtcbiAgb25SZWplY3Q6ICgpID0+IHZvaWQ7XG4gIG9uU3VibWl0OiAoKSA9PiBQcm9taXNlPHVua25vd24+O1xuICByZXF1aXJlZFNpZ25hdHVyZXM/OiBudW1iZXI7XG4gIGN1cnJlbnRTaWduYXR1cmU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXYWxsZXRDb25uZWN0QXBwcm92YWxPdmVybGF5KHtcbiAgb25SZWplY3QsXG4gIG9uU3VibWl0LFxuICByZXF1aXJlZFNpZ25hdHVyZXMgPSAxLFxuICBjdXJyZW50U2lnbmF0dXJlID0gMSxcbn06IFdhbGxldENvbm5lY3RBcHByb3ZhbE92ZXJsYXlQcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgbmV0d29yazogYWN0aXZlTmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3Qge1xuICAgIGFjY291bnRzOiB7IGFjdGl2ZTogYWN0aXZlQWNjb3VudCB9LFxuICB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBhY3RpdmVTZXNzaW9uLFxuICAgIGlzVmFsaWRTZXNzaW9uLFxuICAgIGlzTmV3Q29ubmVjdGlvblJlcXVpcmVkLFxuICAgIGVzdGFibGlzaFJlcXVpcmVkU2Vzc2lvbixcbiAgfSA9IHVzZVJlcXVpcmVkU2Vzc2lvbigpO1xuICBjb25zdCBbcmVxdWVzdFNlbnQsIHNldFJlcXVlc3RTZW50XSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBhY3RpdmVTdGVwID0gdXNlTWVtbyhcbiAgICAoKSA9PiBnZXRBY3RpdmVTdGVwKHJlcXVlc3RTZW50LCBhY3RpdmVTZXNzaW9uLCBpc05ld0Nvbm5lY3Rpb25SZXF1aXJlZCksXG5cbiAgICBbcmVxdWVzdFNlbnQsIGlzTmV3Q29ubmVjdGlvblJlcXVpcmVkLCBhY3RpdmVTZXNzaW9uXSxcbiAgKTtcblxuICBjb25zdCBwYWdlVGl0bGUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBzd2l0Y2ggKGFjdGl2ZVN0ZXApIHtcbiAgICAgIGNhc2UgQXBwcm92YWxTdGVwLkFQUFJPVkFMOlxuICAgICAgICByZXR1cm4gdCgnV2FsbGV0IENvbm5lY3QgQXBwcm92YWwnKTtcbiAgICAgIGNhc2UgQXBwcm92YWxTdGVwLkNPTk5FQ1Q6XG4gICAgICAgIHJldHVybiB0KCdTY2FuIFFSIENvZGUgdG8gQ29ubmVjdCcpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSwgW2FjdGl2ZVN0ZXAsIHRdKTtcblxuICBmdW5jdGlvbiBzdWJtaXRIYW5kbGVyKCkge1xuICAgIHNldFJlcXVlc3RTZW50KHRydWUpO1xuICAgIG9uU3VibWl0KCk7XG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhY3RpdmVBY2NvdW50ICYmIGFjdGl2ZU5ldHdvcmspIHtcbiAgICAgIGVzdGFibGlzaFJlcXVpcmVkU2Vzc2lvbihhY3RpdmVBY2NvdW50LmFkZHJlc3NDLCBhY3RpdmVOZXR3b3JrLmNoYWluSWQpO1xuICAgIH1cbiAgfSwgW2FjdGl2ZUFjY291bnQsIGFjdGl2ZU5ldHdvcmssIGVzdGFibGlzaFJlcXVpcmVkU2Vzc2lvbl0pO1xuXG4gIHJldHVybiAoXG4gICAgPFJlbW90ZUFwcHJvdmFsRGlhbG9nIG9uUmVqZWN0PXtvblJlamVjdH0gcGFnZVRpdGxlPXtwYWdlVGl0bGV9PlxuICAgICAge1xuICAgICAgICB7XG4gICAgICAgICAgW0FwcHJvdmFsU3RlcC5MT0FESU5HXTogKFxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIG10OiAyMCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPENpcmN1bGFyUHJvZ3Jlc3Mgc2l6ZT17ODB9IC8+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICksXG4gICAgICAgICAgW0FwcHJvdmFsU3RlcC5BUFBST1ZBTF06IChcbiAgICAgICAgICAgIDxXYWxsZXRDb25uZWN0QXBwcm92YWxSZXZpZXdcbiAgICAgICAgICAgICAgYWNjb3VudD17YWN0aXZlQWNjb3VudH1cbiAgICAgICAgICAgICAgc2Vzc2lvbj17YWN0aXZlU2Vzc2lvbn1cbiAgICAgICAgICAgICAgaXNWYWxpZFNlc3Npb249e2lzVmFsaWRTZXNzaW9ufVxuICAgICAgICAgICAgICBvblJlamVjdD17b25SZWplY3R9XG4gICAgICAgICAgICAgIG9uU2lnbj17c3VibWl0SGFuZGxlcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSxcbiAgICAgICAgICBbQXBwcm92YWxTdGVwLkNPTk5FQ1RdOiAoXG4gICAgICAgICAgICA8V2FsbGV0Q29ubmVjdEFwcHJvdmFsQ29ubmVjdFxuICAgICAgICAgICAgICByZWNvbm5lY3Rpb25BZGRyZXNzPXthY3RpdmVBY2NvdW50Py5hZGRyZXNzQyBhcyBzdHJpbmd9XG4gICAgICAgICAgICAgIGN1c3RvbU1lc3NhZ2U9e3QoXG4gICAgICAgICAgICAgICAgJ1BsZWFzZSByZWNvbm5lY3QgdXNpbmcgV2FsbGV0IENvbm5lY3QgdG8gYWRkIHRoaXMgbmV0d29yayB0byBhdXRob3JpemVkIG5ldHdvcmtzLicsXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIG9uQ29ubmVjdD17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGVzdGFibGlzaFJlcXVpcmVkU2Vzc2lvbihcbiAgICAgICAgICAgICAgICAgIGFjdGl2ZUFjY291bnQ/LmFkZHJlc3NDIGFzIHN0cmluZyxcbiAgICAgICAgICAgICAgICAgIGFjdGl2ZU5ldHdvcms/LmNoYWluSWQgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICksXG4gICAgICAgICAgW0FwcHJvdmFsU3RlcC5TRU5UXTogKFxuICAgICAgICAgICAgPFdhbGxldENvbm5lY3RBcHByb3ZhbFNlbnRcbiAgICAgICAgICAgICAgb25SZXNlbmQ9e3N1Ym1pdEhhbmRsZXJ9XG4gICAgICAgICAgICAgIHJlcXVpcmVkU2lnbmF0dXJlcz17cmVxdWlyZWRTaWduYXR1cmVzfVxuICAgICAgICAgICAgICBjdXJyZW50U2lnbmF0dXJlPXtjdXJyZW50U2lnbmF0dXJlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApLFxuICAgICAgICB9W2FjdGl2ZVN0ZXBdXG4gICAgICB9XG4gICAgPC9SZW1vdGVBcHByb3ZhbERpYWxvZz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEFsZXJ0VHJpYW5nbGVJY29uLFxuICBDaGVja0NpcmNsZUljb24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICBzdHlsZWQsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBUcmFucyB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdENpcmNsZWRJY29uIH0gZnJvbSAnLi4vLi4vLi4vSW1wb3J0V2l0aFdhbGxldENvbm5lY3QvY29tcG9uZW50cy9XYWxsZXRDb25uZWN0Q2lyY2xlZEljb24nO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdFNlc3Npb25JbmZvIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3dhbGxldENvbm5lY3QvbW9kZWxzJztcbmltcG9ydCB7IEltYWdlV2l0aEZhbGxiYWNrIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9JbWFnZVdpdGhGYWxsYmFjayc7XG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyBSZW1vdGVBcHByb3ZhbENvbmZpcm1hdGlvbiB9IGZyb20gJy4uL1JlbW90ZUFwcHJvdmFsL1JlbW90ZUFwcHJvdmFsQ29uZmlybWF0aW9uJztcblxuaW50ZXJmYWNlIFdhbGxldENvbm5lY3RBcHByb3ZhbFJldmlld1Byb3BzIHtcbiAgaXNWYWxpZFNlc3Npb246IGJvb2xlYW47XG4gIG9uUmVqZWN0OiAoKSA9PiB2b2lkO1xuICBvblNpZ246ICgpID0+IHZvaWQ7XG4gIGFjY291bnQ/OiBBY2NvdW50O1xuICBzZXNzaW9uPzogV2FsbGV0Q29ubmVjdFNlc3Npb25JbmZvIHwgbnVsbDtcbn1cblxuY29uc3QgV2FsbGV0SW1hZ2UgPSBzdHlsZWQoSW1hZ2VXaXRoRmFsbGJhY2spYFxuICB3aWR0aDogMjRweDtcbiAgaGVpZ2h0OiAyNHB4O1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIFdhbGxldENvbm5lY3RBcHByb3ZhbFJldmlldyh7XG4gIGFjY291bnQsXG4gIHNlc3Npb24sXG4gIG9uUmVqZWN0LFxuICBvblNpZ24sXG4gIGlzVmFsaWRTZXNzaW9uLFxufTogV2FsbGV0Q29ubmVjdEFwcHJvdmFsUmV2aWV3UHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8UmVtb3RlQXBwcm92YWxDb25maXJtYXRpb25cbiAgICAgIGxvZ289ezxXYWxsZXRDb25uZWN0Q2lyY2xlZEljb24gLz59XG4gICAgICBzdGF0dXM9e2lzVmFsaWRTZXNzaW9uID8gPFJlYWR5VG9TaWduIC8+IDogPFdyb25nTmV0d29yayAvPn1cbiAgICAgIGlzVmFsaWRTZXNzaW9uPXtpc1ZhbGlkU2Vzc2lvbn1cbiAgICAgIGNvbm5lY3RpbmdUb0ljb249ezxXYWxsZXRJbWFnZSBzcmM9e3Nlc3Npb24/LndhbGxldEFwcD8uaWNvbnNbMF19IC8+fVxuICAgICAgdXNlUmV0cnlCdXR0b249e2ZhbHNlfVxuICAgICAgdXNlV2FsbGV0Q29ubmVjdEFwcHJvdmFsPXt0cnVlfVxuICAgICAgYWNjb3VudD17YWNjb3VudH1cbiAgICAgIHNlc3Npb249e3Nlc3Npb259XG4gICAgICBvblJlamVjdD17b25SZWplY3R9XG4gICAgICBvblNpZ249e29uU2lnbn1cbiAgICAvPlxuICApO1xufVxuXG5jb25zdCBSZWFkeVRvU2lnbiA9ICgpID0+IChcbiAgPFN0YWNrIHN4PXt7IGNvbHVtbkdhcDogMSwgZmxleERpcmVjdGlvbjogJ3JvdycsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgIDxDaGVja0NpcmNsZUljb24gc3g9e3sgY29sb3I6ICdzdWNjZXNzLm1haW4nIH19IC8+XG4gICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCI+XG4gICAgICA8VHJhbnMgaTE4bktleT1cIkNvbm5lY3RlZCBhbmQgcmVhZHkgdG8gc2lnblwiIC8+XG4gICAgPC9UeXBvZ3JhcGh5PlxuICA8L1N0YWNrPlxuKTtcblxuY29uc3QgV3JvbmdOZXR3b3JrID0gKCkgPT4gKFxuICA8U3RhY2sgc3g9e3sgY29sdW1uR2FwOiAxLCBmbGV4RGlyZWN0aW9uOiAncm93JywgYWxpZ25JdGVtczogJ3N0YXJ0JyB9fT5cbiAgICA8QWxlcnRUcmlhbmdsZUljb24gc3g9e3sgY29sb3I6ICd3YXJuaW5nLm1haW4nLCBwdDogMC41IH19IC8+XG4gICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCI+XG4gICAgICA8VHJhbnMgaTE4bktleT1cIldyb25nIG5ldHdvcmsuIFBsZWFzZSBzd2l0Y2ggbmV0d29ya3Mgb24geW91ciBtb2JpbGUgZGV2aWNlLlwiIC8+XG4gICAgPC9UeXBvZ3JhcGh5PlxuICA8L1N0YWNrPlxuKTtcbiIsImltcG9ydCB7XG4gIEFsZXJ0LFxuICBBbGVydFRpdGxlLFxuICBCdXR0b24sXG4gIENoZWNrQ2lyY2xlSWNvbixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuaW50ZXJmYWNlIFdhbGxldENvbm5lY3RBcHByb3ZhbFNlbnRQcm9wcyB7XG4gIG9uUmVzZW5kOiAoKSA9PiB2b2lkO1xuICBjdXJyZW50U2lnbmF0dXJlOiBudW1iZXI7XG4gIHJlcXVpcmVkU2lnbmF0dXJlczogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gV2FsbGV0Q29ubmVjdEFwcHJvdmFsU2VudCh7XG4gIG9uUmVzZW5kLFxuICBjdXJyZW50U2lnbmF0dXJlLFxuICByZXF1aXJlZFNpZ25hdHVyZXMsXG59OiBXYWxsZXRDb25uZWN0QXBwcm92YWxTZW50UHJvcHMpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCBbZGlzYWJsZUJ1dHRvbiwgc2V0RGlzYWJsZUJ1dHRvbl0gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgcmVzZW5kQnV0dG9uVGltZXIgPSB1c2VSZWY8UmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4+KCk7XG4gIGNvbnN0IHJlcXVpcmVzTXVsdGlwbGVTaWduYXR1cmVzID0gcmVxdWlyZWRTaWduYXR1cmVzID4gMTtcblxuICBjb25zdCBlbmFibGVCdXR0b25BZnRlckRlbGF5ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzZW5kQnV0dG9uVGltZXIuY3VycmVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNsZWFyVGltZW91dChyZXNlbmRCdXR0b25UaW1lci5jdXJyZW50KTtcbiAgICB9XG5cbiAgICByZXNlbmRCdXR0b25UaW1lci5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXREaXNhYmxlQnV0dG9uKGZhbHNlKTtcbiAgICAgIHJlc2VuZEJ1dHRvblRpbWVyLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgfSwgNzUwMCk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGVuYWJsZUJ1dHRvbkFmdGVyRGVsYXkoKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHJlc2VuZEJ1dHRvblRpbWVyLmN1cnJlbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChyZXNlbmRCdXR0b25UaW1lci5jdXJyZW50KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxuICBmdW5jdGlvbiByZXNlbmQoKTogdm9pZCB7XG4gICAgc2V0RGlzYWJsZUJ1dHRvbih0cnVlKTtcbiAgICBvblJlc2VuZCgpO1xuICAgIGVuYWJsZUJ1dHRvbkFmdGVyRGVsYXkoKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3N0YXJ0JyxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgIHB4OiAzLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7cmVxdWlyZXNNdWx0aXBsZVNpZ25hdHVyZXMgJiYgKFxuICAgICAgICA8QWxlcnQgc2V2ZXJpdHk9XCJpbmZvXCI+XG4gICAgICAgICAgPEFsZXJ0VGl0bGU+XG4gICAgICAgICAgICB7dCgnVGhpcyB0cmFuc2FjdGlvbiByZXF1aXJlcyB0d28gYXBwcm92YWxzJyl9XG4gICAgICAgICAgPC9BbGVydFRpdGxlPlxuICAgICAgICAgIHt0KCdQbGVhc2UgcGF5IGF0dGVudGlvbiB0byB5b3VyIG1vYmlsZSBkZXZpY2UnKX1cbiAgICAgICAgPC9BbGVydD5cbiAgICAgICl9XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBnYXA6IDEsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgbXQ6IHJlcXVpcmVzTXVsdGlwbGVTaWduYXR1cmVzID8gNSA6IDEwLFxuICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDaGVja0NpcmNsZUljb24gc2l6ZT17NzJ9IHN4PXt7IGNvbG9yOiAnc3VjY2Vzcy5tYWluJyB9fSAvPlxuICAgICAgICB7IXJlcXVpcmVzTXVsdGlwbGVTaWduYXR1cmVzICYmIChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+XG4gICAgICAgICAgICAgIHt0KCdSZXF1ZXN0IFN1Y2Nlc3NmdWxseSBTZW50IScpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX0+XG4gICAgICAgICAgICAgIHt0KCdQbGVhc2Ugc2lnbiBvbiB5b3VyIG1vYmlsZSB3YWxsZXQuJyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC8+XG4gICAgICAgICl9XG4gICAgICAgIHtyZXF1aXJlc011bHRpcGxlU2lnbmF0dXJlcyAmJiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPlxuICAgICAgICAgICAgICB7Y3VycmVudFNpZ25hdHVyZSA9PT0gMVxuICAgICAgICAgICAgICAgID8gdCgnRmlyc3QgUmVxdWVzdCBTZW50IScpXG4gICAgICAgICAgICAgICAgOiB0KCdBbG1vc3QgZG9uZSEnKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICB7Y3VycmVudFNpZ25hdHVyZSA9PT0gMVxuICAgICAgICAgICAgICAgID8gdCgnUGxlYXNlIGFwcHJvdmUgaXQgb24geW91ciBtb2JpbGUgd2FsbGV0LicpXG4gICAgICAgICAgICAgICAgOiB0KCdQbGVhc2UgYXBwcm92ZSB0aGUgc2Vjb25kIHJlcXVlc3QsIHRvby4nKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cbiAgICAgICAge2N1cnJlbnRTaWduYXR1cmUgPT09IDEgJiYgKFxuICAgICAgICAgIC8vIFdlIGNhbid0IHJlc2VuZCBqdXN0IHRoZSAybmQgc2lnbmF0dXJlIHJlcXVlc3QuXG4gICAgICAgICAgLy8gQ2xpY2tpbmcgXCJSZXNlbmRcIiBpbiB0aGlzIHNpdHVhdGlvbiB3b3VsZCBzdGFydCB0aGUgd2hvbGUgb3BlcmF0aW9uIGZyb20gc2NyYXRjaC5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgcHg6IDMsIG10OiAxLCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgICAgb25DbGljaz17cmVzZW5kfVxuICAgICAgICAgICAgICBzaXplPVwieGxhcmdlXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVCdXR0b259XG4gICAgICAgICAgICAgIGlzTG9hZGluZz17ZGlzYWJsZUJ1dHRvbn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1Jlc2VuZCcpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFdhbGxldENvbm5lY3RTZXNzaW9uSW5mbyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXRDb25uZWN0L21vZGVscyc7XG5cbmV4cG9ydCBlbnVtIEFwcHJvdmFsU3RlcCB7XG4gIEFQUFJPVkFMLFxuICBDT05ORUNULFxuICBTRU5ULFxuICBMT0FESU5HLFxufVxuXG5leHBvcnQgY29uc3QgZ2V0QWN0aXZlU3RlcCA9IChcbiAgcmVxdWVzdFNlbnQ6IGJvb2xlYW4sXG4gIGFjdGl2ZVNlc3Npb246IFdhbGxldENvbm5lY3RTZXNzaW9uSW5mbyB8IG51bGwsXG4gIGlzTmV3Q29ubmVjdGlvblJlcXVpcmVkOiBib29sZWFuLFxuKSA9PiB7XG4gIGlmIChyZXF1ZXN0U2VudCkge1xuICAgIHJldHVybiBBcHByb3ZhbFN0ZXAuU0VOVDtcbiAgfVxuICBpZiAoYWN0aXZlU2Vzc2lvbiAmJiAhaXNOZXdDb25uZWN0aW9uUmVxdWlyZWQpIHtcbiAgICByZXR1cm4gQXBwcm92YWxTdGVwLkFQUFJPVkFMO1xuICB9XG4gIGlmIChpc05ld0Nvbm5lY3Rpb25SZXF1aXJlZCkge1xuICAgIHJldHVybiBBcHByb3ZhbFN0ZXAuQ09OTkVDVDtcbiAgfVxuICByZXR1cm4gQXBwcm92YWxTdGVwLkxPQURJTkc7XG59O1xuIiwiaW1wb3J0IHsgU2lnbmluZ0RhdGEgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhID0gKFxuICBvbGRTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuICBuZXdTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuKTogU2lnbmluZ0RhdGEgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoIW9sZFNpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG5ld1NpZ25pbmdEYXRhO1xuICB9IGVsc2UgaWYgKCFuZXdTaWduaW5nRGF0YSkge1xuICAgIHJldHVybiBvbGRTaWduaW5nRGF0YTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub2xkU2lnbmluZ0RhdGEsXG4gICAgLi4ubmV3U2lnbmluZ0RhdGEsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgTmV0d29yaywgTmV0d29ya1ZNVHlwZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtY2hhaW5zLXNkayc7XG5pbXBvcnQgeyBBY2NvdW50LCBBY2NvdW50VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuXG5mdW5jdGlvbiBzaG91bGRVc2VXYWxsZXRDb25uZWN0QXBwcm92YWwobmV0d29yazogTmV0d29yaywgYWNjb3VudDogQWNjb3VudCkge1xuICAvLyBXZSBhcmUgbm90IHN1cHBvcnRpbmcgQ29yZUV0aCBhcyBhIG5ldHdvcmtcbiAgaWYgKG5ldHdvcmsudm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkNvcmVFdGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoXG4gICAgYWNjb3VudC50eXBlID09PSBBY2NvdW50VHlwZS5GSVJFQkxPQ0tTIHx8XG4gICAgYWNjb3VudC50eXBlID09PSBBY2NvdW50VHlwZS5XQUxMRVRfQ09OTkVDVFxuICApIHtcbiAgICByZXR1cm4gbmV0d29yay52bU5hbWUgPT09IE5ldHdvcmtWTVR5cGUuQklUQ09JTiA/IGZhbHNlIDogdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hvdWxkVXNlV2FsbGV0Q29ubmVjdEFwcHJvdmFsO1xuIiwiaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgZnJvbUV2ZW50UGF0dGVybiwgbWVyZ2UgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICAgZnJvbUV2ZW50UGF0dGVybihcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLnBpcGUoXG4gICAgICAgIGZpbHRlcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbic7XG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIE9ubHkgY2xvc2UgZm9yIHBvcHVwIHdpbmRvd3MuIFRoZSBleHRlbnNpb24gVUkgc2hvdWxkIG5vdCByZWFjdCB0aGlzIHdheS5cbiAgICAgICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW2NhbmNlbEhhbmRsZXIsIGlzQ29uZmlybVBvcHVwXSk7XG59XG4iXSwibmFtZXMiOlsiUGFnZVRpdGxlIiwiUGFnZVRpdGxlVmFyaWFudCIsInQiLCJ0cmFuc2xhdGUiLCJBbGVydENpcmNsZUljb24iLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJ1c2VUcmFuc2xhdGlvbiIsIkZ1bmN0aW9uTmFtZXMiLCJnZXRUcmFuc2xhdGVkRnVuY3Rpb25OYW1lIiwibmFtZSIsInRyYW5zbGF0aW9ucyIsIkJSSURHRSIsIlNXQVAiLCJTRU5EIiwiQlVZIiwiREVGSSIsIktFWVNUT05FIiwiVE9LRU5fREVUQUlMUyIsIkZ1bmN0aW9uSXNPZmZsaW5lIiwiZnVuY3Rpb25OYW1lIiwiaGlkZVBhZ2VUaXRsZSIsImNoaWxkcmVuIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJoZWlnaHQiLCJ3aWR0aCIsInZhcmlhbnQiLCJQUklNQVJZIiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZmxleEdyb3ciLCJzaXplIiwibWIiLCJtdCIsImFsaWduIiwiY29sb3IiLCJ1c2VDYWxsYmFjayIsInVzZVN0YXRlIiwiZmlsdGVyIiwidXNlQ29ubmVjdGlvbkNvbnRleHQiLCJpc1Nlc3Npb25QZXJtaXNzaW9uc01pc21hdGNoRXZlbnQiLCJpc1VyaUdlbmVyYXRlZEV2ZW50IiwiaXNXYWxsZXRDb25uZWN0RXZlbnQiLCJFeHRlbnNpb25SZXF1ZXN0IiwidXNlUmVxdWlyZWRTZXNzaW9uIiwidGFiSWQiLCJldmVudHMiLCJyZXF1ZXN0IiwiaXNWYWxpZFNlc3Npb24iLCJzZXRJc1ZhbGlkU2Vzc2lvbiIsImlzTG9hZGluZyIsInNldElzTG9hZGluZyIsImFjdGl2ZVNlc3Npb24iLCJzZXRBY3RpdmVTZXNzaW9uIiwiaXNOZXdDb25uZWN0aW9uUmVxdWlyZWQiLCJzZXRJc05ld0Nvbm5lY3Rpb25SZXF1aXJlZCIsImVzdGFibGlzaFJlcXVpcmVkU2Vzc2lvbiIsImFkZHJlc3MiLCJjaGFpbklkIiwic2Vzc2lvblN1YnNjcmlwdGlvbiIsInBpcGUiLCJzdWJzY3JpYmUiLCJldmVudCIsInZhbHVlIiwibWV0aG9kIiwiV0FMTEVUX0NPTk5FQ1RfRVNUQUJMSVNIX1JFUVVJUkVEX1NFU1NJT04iLCJwYXJhbXMiLCJ0aGVuIiwic2Vzc2lvbiIsImNhdGNoIiwiZmluYWxseSIsInVuc3Vic2NyaWJlIiwidXNlUmVmIiwidXNlSXNVc2luZ0xlZGdlcldhbGxldCIsInVzZUlzVXNpbmdLZXlzdG9uZVdhbGxldCIsInVzZUlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCIsInRvYXN0IiwidXNlSXNVc2luZ0ZpcmVibG9ja3NBY2NvdW50IiwidXNlQXBwcm92YWxIZWxwZXJzIiwib25BcHByb3ZlIiwib25SZWplY3QiLCJwZW5kaW5nTWVzc2FnZSIsInNob3dQZW5kaW5nIiwiaXNVc2luZ0xlZGdlcldhbGxldCIsImlzVXNpbmdLZXlzdG9uZVdhbGxldCIsImlzVXNpbmdXYWxsZXRDb25uZWN0QWNjb3VudCIsImlzVXNpbmdGaXJlYmxvY2tzQWNjb3VudCIsImlzVHdvU3RlcEFwcHJvdmFsIiwiaXNVc2luZ0V4dGVybmFsU2lnbmVyIiwiaXNSZWFkeVRvU2lnbiIsInNldElzUmVhZHlUb1NpZ24iLCJpc0FwcHJvdmFsT3ZlcmxheVZpc2libGUiLCJzZXRJc0FwcHJvdmFsT3ZlcmxheVZpc2libGUiLCJwZW5kaW5nVG9hc3RJZFJlZiIsImhhbmRsZUFwcHJvdmFsIiwidG9hc3RJZCIsImxvYWRpbmciLCJjdXJyZW50IiwiZGlzbWlzcyIsImhhbmRsZVJlamVjdGlvbiIsImlzQmF0Y2hBcHByb3ZhbEFjdGlvbiIsIkFjdGlvblN0YXR1cyIsInVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbiIsInVzZUVmZmVjdCIsIkNvbnRleHRDb250YWluZXIiLCJ1c2VJc1NwZWNpZmljQ29udGV4dENvbnRhaW5lciIsInVzZUFwcHJvdmFsc0NvbnRleHQiLCJnZXRVcGRhdGVkU2lnbmluZ0RhdGEiLCJ1c2VBcHByb3ZlQWN0aW9uIiwiYWN0aW9uSWQiLCJpc0JhdGNoQXBwcm92YWwiLCJpc0NvbmZpcm1Qb3B1cCIsIkNPTkZJUk0iLCJhcHByb3ZhbCIsImFjdGlvbiIsInNldEFjdGlvbiIsImVycm9yIiwic2V0RXJyb3IiLCJ1cGRhdGVBY3Rpb24iLCJzaG91bGRXYWl0Rm9yUmVzcG9uc2UiLCJwcmV2QWN0aW9uRGF0YSIsInN0YXR1cyIsImRpc3BsYXlEYXRhIiwic2lnbmluZ0RhdGEiLCJzaG91bGRDbG9zZUFmdGVyVXBkYXRlIiwiUEVORElORyIsIkFDVElPTl9VUERBVEUiLCJnbG9iYWxUaGlzIiwiY2xvc2UiLCJjYW5jZWxIYW5kbGVyIiwiRVJST1JfVVNFUl9DQU5DRUxFRCIsImlkIiwiQUNUSU9OX0dFVCIsImEiLCJ1c2VNZW1vIiwidXNlTG9jYXRpb24iLCJ1c2VHZXRSZXF1ZXN0SWQiLCJsb2NhdGlvbiIsInNlYXJjaFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInNlYXJjaCIsImdldCIsIkFjY291bnRUeXBlIiwidXNlQWNjb3VudHNDb250ZXh0IiwiYWNjb3VudHMiLCJhY3RpdmUiLCJhY3RpdmVBY2NvdW50IiwidHlwZSIsIkZJUkVCTE9DS1MiLCJXQUxMRVRfQ09OTkVDVCIsIkF2YXRhciIsIkJhZGdlIiwiQml0Y29pbkNvbG9ySWNvbiIsIkZpcmVibG9ja3NJY29uIiwiV2FsbGV0Q29ubmVjdEljb24iLCJGaXJlYmxvY2tzQXZhdGFyIiwiYmFkZ2VJY29uIiwib3ZlcmxhcCIsImJhZGdlQ29udGVudCIsImJhY2tncm91bmRDb2xvciIsImJvcmRlciIsImJvcmRlckNvbG9yIiwiYW5jaG9yT3JpZ2luIiwidmVydGljYWwiLCJob3Jpem9udGFsIiwiYmFja2dyb3VuZCIsIldhbGxldENvbm5lY3RDaXJjbGVkSWNvbiIsIkJ1dHRvbiIsIlNjcm9sbGJhcnMiLCJTa2VsZXRvbiIsIlRhYiIsIlRhYlBhbmVsIiwiVGFicyIsInVzZVdhbGxldENvbm5lY3RDb250ZXh0IiwiV2FsbGV0Q29ubmVjdFFSQ29kZSIsIldhbGxldENvbm5lY3RTdGF0dXNNZXNzYWdlIiwiV2FsbGV0Q29ubmVjdFVSSUZpZWxkIiwiQWNjb3VudEltcG9ydFN0YXR1cyIsIldhbGxldENvbm5lY3RUYWJzIiwiV2FsbGV0Q29ubmVjdENvbm5lY3RvciIsInJlY29ubmVjdGlvbkFkZHJlc3MiLCJjdXN0b21NZXNzYWdlIiwib25Db25uZWN0IiwidGFiIiwic2V0VGFiIiwiUVIiLCJpbXBvcnRTdGF0ZSIsInJlc2V0IiwiaW5pdGlhdGVJbXBvcnQiLCJoYXNDb25uZWN0aW9uVXJpIiwic2hvd1JlZ2VuZXJhdGVCdXR0b24iLCJGYWlsZWQiLCJOb3RJbml0aWF0ZWQiLCJnYXAiLCJweCIsIkZyYWdtZW50Iiwib25DaGFuZ2UiLCJfIiwiY2hvc2VuVGFiIiwiaXNDb250YWluZWQiLCJsYWJlbCIsIm1yIiwiVVJJIiwic3R5bGUiLCJtYXhIZWlnaHQiLCJpbmRleCIsInRleHRBbGlnbiIsIm1hcmdpblgiLCJ1cmkiLCJvbkNsaWNrIiwicHQiLCJRUkNvZGUiLCJCb3giLCJ1c2VUaGVtZSIsImdldENvbG9yRm9yU3RhdHVzIiwidGhlbWUiLCJkaXNwbGF5IiwicGFsZXR0ZSIsImNvbW1vbiIsIndoaXRlIiwicCIsImJvcmRlclJhZGl1cyIsInRyYW5zaXRpb24iLCJ0cmFuc2l0aW9ucyIsImNyZWF0ZSIsInJlbmRlckFzIiwiZmdDb2xvciIsImJsYWNrIiwiYmdDb2xvciIsImxldmVsIiwiQ2hlY2tDaXJjbGVJY29uIiwiaGFzQ29ubmVjdGlvbkZhaWxlZCIsImhhc0Nvbm5lY3Rpb25TdWNjZWVkZWQiLCJTdWNjZXNzZnVsIiwiZGlyZWN0aW9uIiwibWFyZ2luVG9wIiwiQ29weUljb24iLCJJY29uQnV0dG9uIiwib25Db3B5Q2xpY2siLCJuYXZpZ2F0b3IiLCJjbGlwYm9hcmQiLCJ3cml0ZVRleHQiLCJzdWNjZXNzIiwiZHVyYXRpb24iLCJncmV5Iiwid29yZFdyYXAiLCJwYiIsImZvbnRTaXplIiwidXNlclNlbGVjdCIsImZsZXhTaHJpbmsiLCJvcGFjaXR5IiwidXNlTmV0d29ya0NvbnRleHQiLCJDaXJjdWxhclByb2dyZXNzIiwiV2FsbGV0Q29ubmVjdEFwcHJvdmFsQ29ubmVjdCIsInNob3VsZFVzZVdhbGxldENvbm5lY3RBcHByb3ZhbCIsIkFwcHJvdmFsU3RlcCIsImdldEFjdGl2ZVN0ZXAiLCJSZW1vdGVBcHByb3ZhbERpYWxvZyIsIkZpcmVibG9ja3NBcHByb3ZhbFJldmlldyIsIkZpcmVibG9ja3NBcHByb3ZhbE92ZXJsYXkiLCJvblN1Ym1pdCIsIm5ldHdvcmsiLCJhY3RpdmVOZXR3b3JrIiwicmVxdWVzdFNlbnQiLCJzZXRSZXF1ZXN0U2VudCIsInNob3VsZFVzZVdhbGxldENvbm5lY3RUb0FwcHJvdmUiLCJ1bmRlZmluZWQiLCJhY3RpdmVTdGVwIiwiTE9BRElORyIsIlNFTlQiLCJBUFBST1ZBTCIsInBhZ2VUaXRsZSIsIkNPTk5FQ1QiLCJhZGRyZXNzQyIsImFjY291bnQiLCJ1c2VXYWxsZXRDb25uZWN0QXBwcm92YWwiLCJvblNpZ24iLCJhcHBJY29uIiwiQWxlcnRUcmlhbmdsZUljb24iLCJUcmFucyIsIlJlbW90ZUFwcHJvdmFsQ29uZmlybWF0aW9uIiwiaXNCaXRjb2luTmV0d29yayIsImlzRmlyZWJsb2Nrc0FwaVN1cHBvcnRlZCIsImlzRmlyZWJsb2Nrc0FjY291bnQiLCJSZXF1ZXN0UGVuZGluZyIsIlJlYWR5VG9TaWduIiwiV3JvbmdOZXR3b3JrIiwiaXNTZXNzaW9uVmFsaWQiLCJpc0J0Y05ldHdvcmsiLCJsb2dvIiwiY29ubmVjdGluZ1RvSWNvbiIsInVzZVJldHJ5QnV0dG9uIiwiY29sdW1uR2FwIiwiZmxleERpcmVjdGlvbiIsImkxOG5LZXkiLCJEaXZpZGVyIiwidHJ1bmNhdGVBZGRyZXNzIiwic3VibWl0dGVkIiwic2V0U3VibWl0dGVkIiwiZW5hYmxlU3VibWl0QnV0dG9uIiwic2V0RW5hYmxlU3VibWl0QnV0dG9uIiwic2hvd1JldHJ5QnV0dG9uIiwiZGl2aWRlciIsInJvd0dhcCIsIndhbGxldEFwcCIsImZ1bGxXaWR0aCIsImRpc2FibGVkIiwic2V0VGltZW91dCIsIkRpYWxvZyIsIlhJY29uIiwib3BlbiIsInNob3dDbG9zZUljb24iLCJQYXBlclByb3BzIiwibSIsIm1heFdpZHRoIiwicG9zaXRpb24iLCJ0b3AiLCJyaWdodCIsImRpc2FibGVSaXBwbGUiLCJweSIsInBsIiwicHIiLCJXYWxsZXRDb25uZWN0QXBwcm92YWxSZXZpZXciLCJXYWxsZXRDb25uZWN0QXBwcm92YWxTZW50IiwiV2FsbGV0Q29ubmVjdEFwcHJvdmFsT3ZlcmxheSIsInJlcXVpcmVkU2lnbmF0dXJlcyIsImN1cnJlbnRTaWduYXR1cmUiLCJzdWJtaXRIYW5kbGVyIiwib25SZXNlbmQiLCJzdHlsZWQiLCJJbWFnZVdpdGhGYWxsYmFjayIsIldhbGxldEltYWdlIiwic3JjIiwiaWNvbnMiLCJBbGVydCIsIkFsZXJ0VGl0bGUiLCJkaXNhYmxlQnV0dG9uIiwic2V0RGlzYWJsZUJ1dHRvbiIsInJlc2VuZEJ1dHRvblRpbWVyIiwicmVxdWlyZXNNdWx0aXBsZVNpZ25hdHVyZXMiLCJlbmFibGVCdXR0b25BZnRlckRlbGF5IiwiY2xlYXJUaW1lb3V0IiwicmVzZW5kIiwic2V2ZXJpdHkiLCJvbGRTaWduaW5nRGF0YSIsIm5ld1NpZ25pbmdEYXRhIiwiTmV0d29ya1ZNVHlwZSIsInZtTmFtZSIsIkNvcmVFdGgiLCJCSVRDT0lOIiwiZmlyc3QiLCJmcm9tRXZlbnRQYXR0ZXJuIiwibWVyZ2UiLCJzdWJzY3JpcHRpb24iLCJoYW5kbGVyIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkb2N1bWVudCIsInZpc2liaWxpdHlTdGF0ZSJdLCJzb3VyY2VSb290IjoiIn0=