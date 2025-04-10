"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Permissions_Permissions_tsx"],{

/***/ "./src/components/common/Dropdown.tsx":
/*!********************************************!*\
  !*** ./src/components/common/Dropdown.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dropdown": () => (/* binding */ Dropdown),
/* harmony export */   "DropdownItem": () => (/* binding */ DropdownItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const TriggerIcon = ({
  ...rest
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.ChevronDownIcon, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    size: 20,
    sx: {
      '.MuiSelect-icon': {
        transition: 'transform 150ms ease-in-out',
        right: theme.spacing(2),
        top: 'calc(50% - 10px)'
      },
      '.MuiSelect-iconOpen': {
        transform: 'rotateX(180deg)'
      }
    }
  }, rest));
};
const useDropdownProps = ({
  InputProps: {
    sx: inputSx = {},
    ...otherInputProps
  } = {},
  SelectProps: {
    MenuProps: {
      PaperProps: {
        sx: paperSx = {},
        ...otherPaperProps
      } = {},
      ...otherMenuProps
    } = {},
    ...otherSelectProps
  } = {},
  ...rest
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return {
    InputProps: {
      sx: {
        padding: 0,
        height: theme.spacing(6),
        border: `1px solid ${theme.palette.grey[800]}`,
        backgroundColor: theme.palette.grey[850],
        fontSize: theme.typography.body1.fontSize,
        '&.Mui-focused': {
          backgroundColor: theme.palette.grey[850]
        },
        '.MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': {
          border: 'none'
        },
        '.MuiOutlinedInput-input': {
          padding: theme.spacing(1.5, 2)
        },
        ...inputSx
      },
      ...otherInputProps
    },
    SelectProps: {
      IconComponent: TriggerIcon,
      MenuProps: {
        PaperProps: {
          sx: {
            border: `1px solid ${theme.palette.grey[850]}`,
            maxWidth: 343,
            maxHeight: 144,
            mt: 2,
            ...paperSx
          },
          ...otherPaperProps
        },
        ...otherMenuProps
      },
      ...otherSelectProps
    },
    ...rest
  };
};
const Dropdown = ({
  children,
  ...props
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const {
    SelectProps,
    InputProps,
    ...rest
  } = useDropdownProps(props);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Select, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    variant: "outlined",
    InputProps: InputProps,
    SelectProps: SelectProps,
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: theme.typography.body2.fontSize
      }
    }
  }, rest), children);
};
const DropdownItem = ({
  sx,
  children,
  ...props
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.MenuItem, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    sx: {
      minHeight: 'auto',
      height: theme.spacing(5),
      fontSize: theme.typography.body2.fontSize,
      gap: 1,
      ...sx
    }
  }, props), children);
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

/***/ "./src/hooks/useBalanceTotalInCurrency.ts":
/*!************************************************!*\
  !*** ./src/hooks/useBalanceTotalInCurrency.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useBalanceTotalInCurrency": () => (/* binding */ useBalanceTotalInCurrency)
/* harmony export */ });
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function useBalanceTotalInCurrency(account) {
  const {
    getTotalBalance
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_0__.useBalancesContext)();
  return (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (!account?.addressC) {
      return null;
    }
    return getTotalBalance(account.addressC);
  }, [account?.addressC, getTotalBalance]);
}

/***/ }),

/***/ "./src/hooks/useDAppScan.ts":
/*!**********************************!*\
  !*** ./src/hooks/useDAppScan.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useDAppScan": () => (/* binding */ useDAppScan)
/* harmony export */ });
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/promiseResolver.js");
/* harmony import */ var _blockaid_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @blockaid/client */ "./node_modules/@blockaid/client/index.mjs");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function useDAppScan() {
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_1__.useFeatureFlagContext)();
  const dAppScanning = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async dAppURL => {
    if (!featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_0__.FeatureGates.BLOCKAID_DAPP_SCAN]) {
      return undefined;
    }
    const baseURL = "https://proxy-api-dev.avax.network" + '/proxy/blockaid/';
    const blockaid = new _blockaid_client__WEBPACK_IMPORTED_MODULE_3__["default"]({
      baseURL,
      apiKey: 'key' // Proxy API will append the actual API key, this here is just so the SDK does not complain
    });

    const [response, error] = await (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_4__.resolve)(blockaid.site.scan({
      url: dAppURL
    }));
    if (response === null || error) {
      throw new Error('There is an error during requesting the dApp data');
    }
    if (response.status === 'miss') {
      return {
        status: response.status
      };
    }
    return {
      status: response.status,
      url: response.url || dAppURL,
      isMalicious: response.is_malicious
    };
  }, [featureFlags]);
  return dAppScanning;
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

/***/ "./src/pages/Permissions/Permissions.tsx":
/*!***********************************************!*\
  !*** ./src/pages/Permissions/Permissions.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PermissionsPage": () => (/* binding */ PermissionsPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_contexts_PermissionsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/PermissionsProvider */ "./src/contexts/PermissionsProvider.tsx");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/SiteAvatar */ "./src/components/common/SiteAvatar.tsx");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_hooks_useIsSpecificContextContainer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/hooks/useIsSpecificContextContainer */ "./src/hooks/useIsSpecificContextContainer.ts");
/* harmony import */ var _components_AccountsDropdown__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/AccountsDropdown */ "./src/pages/Permissions/components/AccountsDropdown.tsx");
/* harmony import */ var _components_AlertDialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/AlertDialog */ "./src/pages/Permissions/components/AlertDialog.tsx");
/* harmony import */ var _components_AlertBox__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/AlertBox */ "./src/pages/Permissions/components/AlertBox.tsx");
/* harmony import */ var _components_WarningBox__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/WarningBox */ "./src/pages/Permissions/components/WarningBox.tsx");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_hooks_useDAppScan__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @src/hooks/useDAppScan */ "./src/hooks/useDAppScan.ts");
/* harmony import */ var _src_utils_address__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @src/utils/address */ "./src/utils/address.ts");
/* harmony import */ var _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @src/background/connections/dAppConnection/models */ "./src/background/connections/dAppConnection/models.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





















function PermissionsPage() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_19__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_7__.useGetRequestId)();
  const {
    permissions,
    isDomainConnectedToAccount
  } = (0,_src_contexts_PermissionsProvider__WEBPACK_IMPORTED_MODULE_3__.usePermissionContext)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_20__["default"])();
  const {
    accounts: {
      active: activeAccount
    },
    getAllAccountsForVM
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  const [selectedAccount, setSelectedAccount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [dAppScanningResult, setDAppScanningResult] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);
  const [displayDialog, setDisplayDialog] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const isConfirmContainer = (0,_src_hooks_useIsSpecificContextContainer__WEBPACK_IMPORTED_MODULE_8__.useIsSpecificContextContainer)(_src_hooks_useIsSpecificContextContainer__WEBPACK_IMPORTED_MODULE_8__.ContextContainer.CONFIRM);
  const dAppScanning = (0,_src_hooks_useDAppScan__WEBPACK_IMPORTED_MODULE_15__.useDAppScan)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_13__.useFeatureFlagContext)();
  const {
    action,
    cancelHandler,
    updateAction
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_4__.useApproveAction)(requestId);
  const isSubmitting = action?.status === _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_6__.ActionStatus.SUBMITTING;
  const isRequestingAccess = action?.method === _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_17__.DAppProviderRequest.CONNECT_METHOD || action?.method === _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_17__.DAppProviderRequest.WALLET_CONNECT;
  const isWalletRequestPermissions = action?.method === 'wallet_requestPermissions';
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (action?.site?.domain) {
      dAppScanning(action.site.domain).then(result => {
        setDAppScanningResult(result);
      }).catch(e => console.error(e));
    }
  }, [dAppScanning, action?.site?.domain]);
  const onApproveClicked = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!selectedAccount) {
      return;
    }
    updateAction({
      status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_6__.ActionStatus.SUBMITTING,
      id: requestId,
      result: selectedAccount.id
    });
  }, [selectedAccount, updateAction, requestId]);
  const activeAccountAddressForRequestedVM = activeAccount && action ? (0,_src_utils_address__WEBPACK_IMPORTED_MODULE_16__.mapAddressesToVMs)(activeAccount)[action?.displayData.addressVM] : null;
  const isAccountPermissionGranted = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => action && activeAccountAddressForRequestedVM && isDomainConnectedToAccount(action.displayData.domainUrl, [activeAccountAddressForRequestedVM]) && isConfirmContainer, [action, activeAccountAddressForRequestedVM, isDomainConnectedToAccount, isConfirmContainer]);

  // If the domain already has permissions for the active account, close the popup
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isAccountPermissionGranted && isRequestingAccess) {
      if (activeAccount?.id) {
        // make sure we return a response even if the site was already approved
        updateAction({
          status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_6__.ActionStatus.SUBMITTING,
          id: requestId,
          result: activeAccount.id
        });
      } else {
        window.close();
      }
    }
  }, [activeAccount?.id, isAccountPermissionGranted, isRequestingAccess, requestId, updateAction]);
  const allAccountsForRequestedVM = getAllAccountsForVM(action?.displayData?.addressVM ?? _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.EVM);

  // Must also wait for isAccountPermissionGranted since `onApproveClicked` is async
  if (!permissions || !action || allAccountsForRequestedVM.length === 0 || !activeAccount || isAccountPermissionGranted && !isWalletRequestPermissions) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.LoadingDots, {
      size: 20
    });
  }
  const isMaliciousDApp = dAppScanningResult && dAppScanningResult.isMalicious;
  const isMissingBlockaidData = dAppScanningResult && dAppScanningResult?.status === 'miss' ? true : false;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Stack, {
    sx: {
      width: '100%',
      px: 2,
      color: theme.palette.text.primary,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Stack, {
    sx: {
      gap: 3,
      py: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Box, {
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Typography, {
    variant: "h4"
  }, t('Connect Core to Dapp'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Stack, {
    sx: {
      gap: 2.5,
      alignItems: 'center'
    }
  }, featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_14__.FeatureGates.BLOCKAID_DAPP_SCAN] && isMaliciousDApp && /*#__PURE__*/React.createElement(_components_AlertBox__WEBPACK_IMPORTED_MODULE_11__.AlertBox, {
    title: t('Malicious Application'),
    text: t('This application is malicious, do not proceed.')
  }), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_14__.FeatureGates.BLOCKAID_DAPP_SCAN_WARNING] && isMissingBlockaidData && /*#__PURE__*/React.createElement(_components_WarningBox__WEBPACK_IMPORTED_MODULE_12__.WarningBox, {
    title: t('Suspicious Application'),
    text: t('Use caution, this application may be malicious.')
  }), /*#__PURE__*/React.createElement(_src_components_common_SiteAvatar__WEBPACK_IMPORTED_MODULE_5__.SiteAvatar, {
    sx: {
      m: 0
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_2__.TokenIcon, {
    height: "48px",
    width: "48px",
    src: action.displayData.domainIcon
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.GlobeIcon, {
    size: 48,
    color: theme.palette.text.secondary
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Stack, {
    sx: {
      gap: 0.5,
      textAlign: 'center',
      maxWidth: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Typography, {
    variant: "h5"
  }, action.displayData.domainName), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Typography, {
    sx: {
      fontSize: 12,
      color: theme.palette.text.secondary,
      wordWrap: 'break-word'
    }
  }, action.displayData.domainUrl))), /*#__PURE__*/React.createElement(_components_AccountsDropdown__WEBPACK_IMPORTED_MODULE_9__.AccountsDropdown, {
    allAccountsForRequestedVM: allAccountsForRequestedVM,
    activeAccount: activeAccount,
    onSelectedAccountChanged: acc => setSelectedAccount(acc),
    addressVM: action.displayData.addressVM
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Stack, {
    sx: {
      width: '100%',
      justifyContent: 'space-between',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Typography, {
    variant: "caption",
    sx: {
      mb: 2,
      color: theme.palette.text.secondary
    },
    paragraph: true
  }, t('Only connect to sites that you trust.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Button, {
    color: "secondary",
    "data-testid": "connect-reject-btn",
    onClick: () => {
      cancelHandler();
      window.close();
    },
    fullWidth: true,
    size: "large",
    disabled: isSubmitting
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__.Button, {
    "data-testid": "connect-approve-btn",
    onClick: () => onApproveClicked(),
    fullWidth: true,
    size: "large",
    isLoading: isSubmitting,
    disabled: isSubmitting
  }, isSubmitting ? '' : t('Approve'))))), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_14__.FeatureGates.BLOCKAID_DAPP_SCAN] && isMaliciousDApp && /*#__PURE__*/React.createElement(_components_AlertDialog__WEBPACK_IMPORTED_MODULE_10__.AlertDialog, {
    proceedLabel: t('Proceed Anyway'),
    cancelHandler: () => {
      cancelHandler();
      window.close();
    },
    open: displayDialog,
    onClose: () => setDisplayDialog(false),
    title: t('Scam Application'),
    text: t('This application is malicious, do not proceed.'),
    rejectLabel: t('Reject Connection')
  }));
}

/***/ }),

/***/ "./src/pages/Permissions/components/AccountsDropdown.tsx":
/*!***************************************************************!*\
  !*** ./src/pages/Permissions/components/AccountsDropdown.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountsDropdown": () => (/* binding */ AccountsDropdown)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/Dropdown */ "./src/components/common/Dropdown.tsx");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_hooks_useBalanceTotalInCurrency__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useBalanceTotalInCurrency */ "./src/hooks/useBalanceTotalInCurrency.ts");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_address__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/utils/address */ "./src/utils/address.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










const renderValue = (account, vmType) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
  component: "span",
  fontSize: "inherit",
  sx: {
    display: 'flex',
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
  component: "span",
  noWrap: true,
  fontSize: "inherit"
}, account.name), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
  component: "span",
  sx: {
    flexShrink: 0,
    pl: 0.5
  },
  fontSize: "inherit"
}, "(", (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_5__.truncateAddress)((0,_src_utils_address__WEBPACK_IMPORTED_MODULE_7__.getAddressByVMType)(account, vmType)), ")"));
const AccountsDropdown = ({
  allAccountsForRequestedVM,
  activeAccount,
  onSelectedAccountChanged,
  addressVM = _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_6__.NetworkVMType.EVM
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const [selectedAccount, setSelectedAccount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(activeAccount);
  const [isBalanceLoading, setIsBalanceLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    updateBalanceOnNetworks
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_2__.useBalancesContext)();
  const {
    currency,
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_3__.useSettingsContext)();
  const accountBalance = (0,_src_hooks_useBalanceTotalInCurrency__WEBPACK_IMPORTED_MODULE_4__.useBalanceTotalInCurrency)(selectedAccount);
  const balanceSum = accountBalance?.sum || 0;
  const hasAccountBalance = accountBalance && accountBalance !== null && accountBalance.sum !== null;

  // Set active account as default
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const getBalance = async () => {
      setIsBalanceLoading(true);
      await updateBalanceOnNetworks?.(selectedAccount);
      setIsBalanceLoading(false);
    };
    if (!selectedAccount) {
      if (activeAccount) {
        setSelectedAccount(activeAccount);
      }
      return;
    }
    if (selectedAccount) {
      getBalance();
    }
  }, [activeAccount, selectedAccount, updateBalanceOnNetworks]);

  // Update balance & notify parent component about changes when account is selected
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    onSelectedAccountChanged(selectedAccount);
  }, [onSelectedAccountChanged, selectedAccount]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      gap: 1,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_1__.Dropdown, {
    SelectProps: {
      // <Select /> expects reference equality and `activeAccount` is a different object
      // than the one in `accounts` array.
      defaultValue: allAccountsForRequestedVM.find(acc => acc.id === activeAccount?.id),
      onChange: ev => setSelectedAccount(ev.target.value),
      renderValue: value => renderValue(value, addressVM),
      // We need the @ts-ignore, because MUI's "nested props" (such as SelectProps)
      // do not allow passing data-attributes.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'data-testid': 'connect-account-dropdown'
    },
    label: t('Select Account')
  }, allAccountsForRequestedVM.map(acc => /*#__PURE__*/React.createElement(_src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_1__.DropdownItem, {
    key: acc.id,
    value: acc,
    selected: selectedAccount?.id === acc.id,
    "data-testid": "connect-account-menu-item",
    title: acc.name
  }, renderValue(acc, addressVM), selectedAccount?.id === acc.id && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.CheckIcon, null)))), isBalanceLoading && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Skeleton, {
    variant: "text",
    width: 120
  }), !isBalanceLoading && hasAccountBalance && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    variant: "caption",
    color: theme.palette.text.secondary
  }, t('Balance'), ": ", currencyFormatter(balanceSum).replace(currency, '')));
};

/***/ }),

/***/ "./src/pages/Permissions/components/AlertBox.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/Permissions/components/AlertBox.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AlertBox": () => (/* binding */ AlertBox)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function AlertBox({
  title,
  text
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Alert, {
    severity: "error",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.RemoveModeratorIcon, {
      size: 24,
      color: theme.palette.common.black
    }),
    sx: {
      backgroundColor: 'error.light',
      borderColor: 'transparent',
      px: 2,
      color: 'common.black',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AlertContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      fontWeight: 600,
      display: 'block'
    }
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      display: 'block'
    }
  }, text)));
}

/***/ }),

/***/ "./src/pages/Permissions/components/AlertDialog.tsx":
/*!**********************************************************!*\
  !*** ./src/pages/Permissions/components/AlertDialog.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AlertDialog": () => (/* binding */ AlertDialog)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function AlertDialog({
  cancelHandler,
  open,
  onClose,
  title,
  text,
  rejectLabel,
  proceedLabel
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Dialog, {
    open: open,
    showCloseIcon: true,
    onClose: onClose,
    PaperProps: {
      sx: {
        m: 2,
        width: 1,
        height: 1,
        maxWidth: 'none',
        position: 'relative'
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      py: 3,
      px: 5,
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '225px',
      gap: 1.5,
      py: 14
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.RemoveModeratorIcon, {
    size: 48,
    color: theme.customPalette.avalancheRed
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    sx: {
      color: theme.customPalette.avalancheRed,
      px: 2
    },
    variant: "h4"
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2"
  }, text)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      alignItems: 'center',
      width: '100%',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    color: "primary",
    "data-testid": "connect-reject-btn",
    onClick: () => {
      cancelHandler();
    },
    fullWidth: true,
    size: "large"
  }, rejectLabel), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    "data-testid": "connect-approve-btn",
    onClick: onClose,
    fullWidth: true,
    size: "large",
    color: "secondary"
  }, proceedLabel))));
}

/***/ }),

/***/ "./src/pages/Permissions/components/WarningBox.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/Permissions/components/WarningBox.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WarningBox": () => (/* binding */ WarningBox)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function WarningBox({
  title,
  text
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Alert, {
    severity: "warning",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.GppMaybeIcon, {
      size: 24,
      color: theme.palette.common.black
    }),
    sx: {
      backgroundColor: 'warning.light',
      borderColor: 'transparent',
      px: 2,
      color: 'common.black',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AlertContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      fontWeight: 600,
      display: 'block'
    }
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      display: 'block'
    }
  }, text)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1Blcm1pc3Npb25zX1Blcm1pc3Npb25zX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFxQztBQUVyQyxNQUFNSSxXQUFXLEdBQUdBLENBQUM7RUFBRSxHQUFHQztBQUFvQixDQUFDLEtBQUs7RUFDbEQsTUFBTUMsS0FBSyxHQUFHSCx1RUFBUSxFQUFFO0VBRXhCLG9CQUNFSSxLQUFBLENBQUFDLGFBQUEsQ0FBQ1Isd0VBQWUsRUFBQVMsMEVBQUE7SUFDZEMsSUFBSSxFQUFFLEVBQUc7SUFDVEMsRUFBRSxFQUFFO01BQ0YsaUJBQWlCLEVBQUU7UUFDakJDLFVBQVUsRUFBRSw2QkFBNkI7UUFDekNDLEtBQUssRUFBRVAsS0FBSyxDQUFDUSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCQyxHQUFHLEVBQUU7TUFDUCxDQUFDO01BQ0QscUJBQXFCLEVBQUU7UUFDckJDLFNBQVMsRUFBRTtNQUNiO0lBQ0Y7RUFBRSxHQUNFWCxJQUFJLEVBQ1I7QUFFTixDQUFDO0FBRUQsTUFBTVksZ0JBQWdCLEdBQUdBLENBQUM7RUFDeEJDLFVBQVUsRUFBRTtJQUFFUCxFQUFFLEVBQUVRLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFBRSxHQUFHQztFQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3pEQyxXQUFXLEVBQUU7SUFDWEMsU0FBUyxFQUFFO01BQ1RDLFVBQVUsRUFBRTtRQUFFWixFQUFFLEVBQUVhLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFBRSxHQUFHQztNQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3pELEdBQUdDO0lBQ0wsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNOLEdBQUdDO0VBQ0wsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNOLEdBQUd0QjtBQUNXLENBQUMsS0FBSztFQUNwQixNQUFNQyxLQUFLLEdBQUdILHVFQUFRLEVBQUU7RUFFeEIsT0FBTztJQUNMZSxVQUFVLEVBQUU7TUFDVlAsRUFBRSxFQUFFO1FB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QUFJcE4sY0FBYyxFQUFFO1FBQ2xCcUIsYUFBYSxFQUFFO01BQ2pCO0lBQ0YsQ0FBQyxDQUFDO0lBRUosT0FBTyxNQUFNO01BQ1h3TCxZQUFZLEVBQUVRLFdBQVcsRUFBRTtJQUM3QixDQUFDO0VBQ0gsQ0FBQyxFQUFFLENBQUNoTSxhQUFhLEVBQUVyQixjQUFjLENBQUMsQ0FBQztBQUNyQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vRHJvcGRvd24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vU2l0ZUF2YXRhci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VBcHByb3ZlQWN0aW9uLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlQmFsYW5jZVRvdGFsSW5DdXJyZW5jeS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZURBcHBTY2FuLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlR2V0UmVxdWVzdElkLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvUGVybWlzc2lvbnMvUGVybWlzc2lvbnMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvUGVybWlzc2lvbnMvY29tcG9uZW50cy9BY2NvdW50c0Ryb3Bkb3duLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1Blcm1pc3Npb25zL2NvbXBvbmVudHMvQWxlcnRCb3gudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvUGVybWlzc2lvbnMvY29tcG9uZW50cy9BbGVydERpYWxvZy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9QZXJtaXNzaW9ucy9jb21wb25lbnRzL1dhcm5pbmdCb3gudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvYWN0aW9ucy9nZXRVcGRhdGVkQWN0aW9uRGF0YS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL3VzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGV2cm9uRG93bkljb24sXG4gIEljb25CYXNlUHJvcHMsXG4gIE1lbnVJdGVtLFxuICBNZW51SXRlbVByb3BzLFxuICBTZWxlY3QsXG4gIFRleHRGaWVsZFByb3BzLFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuY29uc3QgVHJpZ2dlckljb24gPSAoeyAuLi5yZXN0IH06IEljb25CYXNlUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPENoZXZyb25Eb3duSWNvblxuICAgICAgc2l6ZT17MjB9XG4gICAgICBzeD17e1xuICAgICAgICAnLk11aVNlbGVjdC1pY29uJzoge1xuICAgICAgICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMTUwbXMgZWFzZS1pbi1vdXQnLFxuICAgICAgICAgIHJpZ2h0OiB0aGVtZS5zcGFjaW5nKDIpLFxuICAgICAgICAgIHRvcDogJ2NhbGMoNTAlIC0gMTBweCknLFxuICAgICAgICB9LFxuICAgICAgICAnLk11aVNlbGVjdC1pY29uT3Blbic6IHtcbiAgICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGVYKDE4MGRlZyknLFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICAgIHsuLi5yZXN0fVxuICAgIC8+XG4gICk7XG59O1xuXG5jb25zdCB1c2VEcm9wZG93blByb3BzID0gKHtcbiAgSW5wdXRQcm9wczogeyBzeDogaW5wdXRTeCA9IHt9LCAuLi5vdGhlcklucHV0UHJvcHMgfSA9IHt9LFxuICBTZWxlY3RQcm9wczoge1xuICAgIE1lbnVQcm9wczoge1xuICAgICAgUGFwZXJQcm9wczogeyBzeDogcGFwZXJTeCA9IHt9LCAuLi5vdGhlclBhcGVyUHJvcHMgfSA9IHt9LFxuICAgICAgLi4ub3RoZXJNZW51UHJvcHNcbiAgICB9ID0ge30sXG4gICAgLi4ub3RoZXJTZWxlY3RQcm9wc1xuICB9ID0ge30sXG4gIC4uLnJlc3Rcbn06IFRleHRGaWVsZFByb3BzKSA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4ge1xuICAgIElucHV0UHJvcHM6IHtcbiAgICAgIHN4OiB7XG4gICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgIGhlaWdodDogdGhlbWUuc3BhY2luZyg2KSxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7dGhlbWUucGFsZXR0ZS5ncmV5WzgwMF19YCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODUwXSxcbiAgICAgICAgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkuYm9keTEuZm9udFNpemUsXG5cbiAgICAgICAgJyYuTXVpLWZvY3VzZWQnOiB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODUwXSxcbiAgICAgICAgfSxcbiAgICAgICAgJy5NdWlPdXRsaW5lZElucHV0LW5vdGNoZWRPdXRsaW5lLCAmOmhvdmVyIC5NdWlPdXRsaW5lZElucHV0LW5vdGNoZWRPdXRsaW5lJzpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICB9LFxuICAgICAgICAnLk11aU91dGxpbmVkSW5wdXQtaW5wdXQnOiB7XG4gICAgICAgICAgcGFkZGluZzogdGhlbWUuc3BhY2luZygxLjUsIDIpLFxuICAgICAgICB9LFxuICAgICAgICAuLi5pbnB1dFN4LFxuICAgICAgfSxcbiAgICAgIC4uLm90aGVySW5wdXRQcm9wcyxcbiAgICB9LFxuICAgIFNlbGVjdFByb3BzOiB7XG4gICAgICBJY29uQ29tcG9uZW50OiBUcmlnZ2VySWNvbixcbiAgICAgIE1lbnVQcm9wczoge1xuICAgICAgICBQYXBlclByb3BzOiB7XG4gICAgICAgICAgc3g6IHtcbiAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke3RoZW1lLnBhbGV0dGUuZ3JleVs4NTBdfWAsXG4gICAgICAgICAgICBtYXhXaWR0aDogMzQzLFxuICAgICAgICAgICAgbWF4SGVpZ2h0OiAxNDQsXG4gICAgICAgICAgICBtdDogMixcbiAgICAgICAgICAgIC4uLnBhcGVyU3gsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5vdGhlclBhcGVyUHJvcHMsXG4gICAgICAgIH0sXG4gICAgICAgIC4uLm90aGVyTWVudVByb3BzLFxuICAgICAgfSxcbiAgICAgIC4uLm90aGVyU2VsZWN0UHJvcHMsXG4gICAgfSxcbiAgICAuLi5yZXN0LFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IERyb3Bkb3duID0gKHsgY2hpbGRyZW4sIC4uLnByb3BzIH06IFRleHRGaWVsZFByb3BzKSA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyBTZWxlY3RQcm9wcywgSW5wdXRQcm9wcywgLi4ucmVzdCB9ID0gdXNlRHJvcGRvd25Qcm9wcyhwcm9wcyk7XG5cbiAgcmV0dXJuIChcbiAgICA8U2VsZWN0XG4gICAgICB2YXJpYW50PVwib3V0bGluZWRcIlxuICAgICAgSW5wdXRQcm9wcz17SW5wdXRQcm9wc31cbiAgICAgIFNlbGVjdFByb3BzPXtTZWxlY3RQcm9wc31cbiAgICAgIGlucHV0TGFiZWxQcm9wcz17e1xuICAgICAgICBzeDogeyB0cmFuc2Zvcm06ICdub25lJywgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkuYm9keTIuZm9udFNpemUgfSxcbiAgICAgIH19XG4gICAgICB7Li4ucmVzdH1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9TZWxlY3Q+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgRHJvcGRvd25JdGVtID0gKHsgc3gsIGNoaWxkcmVuLCAuLi5wcm9wcyB9OiBNZW51SXRlbVByb3BzKSA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxNZW51SXRlbVxuICAgICAgc3g9e3tcbiAgICAgICAgbWluSGVpZ2h0OiAnYXV0bycsXG4gICAgICAgIGhlaWdodDogdGhlbWUuc3BhY2luZyg1KSxcbiAgICAgICAgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkuYm9keTIuZm9udFNpemUsXG4gICAgICAgIGdhcDogMSxcbiAgICAgICAgLi4uc3gsXG4gICAgICB9fVxuICAgICAgey4uLnByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L01lbnVJdGVtPlxuICApO1xufTtcbiIsImltcG9ydCB7IFN0YWNrLCBzdHlsZWQgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgU2l0ZUF2YXRhciA9IHN0eWxlZChTdGFjayk8eyBtYXJnaW4/OiBzdHJpbmcgfT5gXG4gIHdpZHRoOiA4MHB4O1xuICBoZWlnaHQ6IDgwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyfTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgbWFyZ2luOiAkeyh7IG1hcmdpbiB9KSA9PiBtYXJnaW4gPz8gJzhweCAwJ307XG5gO1xuIiwiaW1wb3J0IHsgRXh0ZW5zaW9uUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9leHRlbnNpb25Db25uZWN0aW9uL21vZGVscyc7XG5pbXBvcnQgeyBHZXRBY3Rpb25IYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvaGFuZGxlcnMvZ2V0QWN0aW9ucyc7XG5pbXBvcnQgeyBVcGRhdGVBY3Rpb25IYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvaGFuZGxlcnMvdXBkYXRlQWN0aW9uJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uVXBkYXRlLFxuICBNdWx0aVR4QWN0aW9uLFxuICBpc0JhdGNoQXBwcm92YWxBY3Rpb24sXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyB1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4gfSBmcm9tICdAc3JjL3V0aWxzL3VzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbic7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIENvbnRleHRDb250YWluZXIsXG4gIHVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyLFxufSBmcm9tICcuL3VzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyJztcbmltcG9ydCB7IHVzZUFwcHJvdmFsc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FwcHJvdmFsc1Byb3ZpZGVyJztcbmltcG9ydCB7IGdldFVwZGF0ZWRTaWduaW5nRGF0YSB9IGZyb20gJ0BzcmMvdXRpbHMvYWN0aW9ucy9nZXRVcGRhdGVkQWN0aW9uRGF0YSc7XG5cbnR5cGUgQWN0aW9uVHlwZTxJc0JhdGNoQXBwcm92YWw+ID0gSXNCYXRjaEFwcHJvdmFsIGV4dGVuZHMgdHJ1ZVxuICA/IE11bHRpVHhBY3Rpb25cbiAgOiBBY3Rpb247XG5cbnR5cGUgQWN0aW9uVXBkYXRlcjxUIGV4dGVuZHMgQWN0aW9uIHwgTXVsdGlUeEFjdGlvbiB8IHVuZGVmaW5lZD4gPSAoXG4gIHBhcmFtczogQWN0aW9uVXBkYXRlPFxuICAgIFBhcnRpYWw8VCBleHRlbmRzIEFjdGlvbiB8IE11bHRpVHhBY3Rpb24gPyBUWydkaXNwbGF5RGF0YSddIDogbmV2ZXI+XG4gID4sXG4gIHNob3VsZFdhaXRGb3JSZXNwb25zZT86IGJvb2xlYW4sXG4pID0+IFByb21pc2U8Ym9vbGVhbj47XG5cbnR5cGUgSG9va1Jlc3VsdDxUIGV4dGVuZHMgQWN0aW9uIHwgTXVsdGlUeEFjdGlvbiB8IHVuZGVmaW5lZD4gPSB7XG4gIGFjdGlvbjogVDtcbiAgdXBkYXRlQWN0aW9uOiBBY3Rpb25VcGRhdGVyPFQ+O1xuICBlcnJvcjogc3RyaW5nO1xuICBjYW5jZWxIYW5kbGVyOiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwcHJvdmVBY3Rpb248RGlzcGxheURhdGEgPSBhbnk+KFxuICBhY3Rpb25JZDogc3RyaW5nLFxuICBpc0JhdGNoQXBwcm92YWw/OiBmYWxzZSxcbik6IEhvb2tSZXN1bHQ8QWN0aW9uPERpc3BsYXlEYXRhPj47XG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwcm92ZUFjdGlvbihcbiAgYWN0aW9uSWQ6IHN0cmluZyxcbiAgaXNCYXRjaEFwcHJvdmFsPzogdHJ1ZSxcbik6IEhvb2tSZXN1bHQ8TXVsdGlUeEFjdGlvbj47XG5leHBvcnQgZnVuY3Rpb24gdXNlQXBwcm92ZUFjdGlvbjxEaXNwbGF5RGF0YSA9IGFueT4oXG4gIGFjdGlvbklkOiBzdHJpbmcsXG4gIGlzQmF0Y2hBcHByb3ZhbDogYm9vbGVhbiA9IGZhbHNlLFxuKTogSG9va1Jlc3VsdDxBY3Rpb248RGlzcGxheURhdGE+IHwgTXVsdGlUeEFjdGlvbiB8IHVuZGVmaW5lZD4ge1xuICBjb25zdCB7IHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuICBjb25zdCB7IGFwcHJvdmFsIH0gPSB1c2VBcHByb3ZhbHNDb250ZXh0KCk7XG4gIGNvbnN0IFthY3Rpb24sIHNldEFjdGlvbl0gPSB1c2VTdGF0ZTxBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+PigpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuXG4gIGNvbnN0IHVwZGF0ZUFjdGlvbjogQWN0aW9uVXBkYXRlcjxBY3Rpb25UeXBlPHR5cGVvZiBpc0JhdGNoQXBwcm92YWw+PiA9XG4gICAgdXNlQ2FsbGJhY2soXG4gICAgICBhc3luYyAocGFyYW1zLCBzaG91bGRXYWl0Rm9yUmVzcG9uc2UpID0+IHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byB1cGRhdGUgdGhlIHN0YXR1cyBhIGJpdCBmYXN0ZXIgZm9yIHNtb290aGVyIFVYLlxuICAgICAgICAvLyB1c2UgZnVuY3Rpb24gdG8gYXZvaWQgYGFjdGlvbmAgYXMgYSBkZXBlbmRlbmN5IGFuZCB0aHVzIGluZmluaXRlIGxvb3BzXG4gICAgICAgIHNldEFjdGlvbigocHJldkFjdGlvbkRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIXByZXZBY3Rpb25EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRm9yIE11bHRpVHhBY3Rpb24sIHdlIGRvbid0IGFsbG93IGFueSB1cGRhdGVzIGJlc2lkZXMgdGhlIHN0YXR1cy5cbiAgICAgICAgICBpZiAoaXNCYXRjaEFwcHJvdmFsQWN0aW9uKHByZXZBY3Rpb25EYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ucHJldkFjdGlvbkRhdGEsXG4gICAgICAgICAgICAgIHN0YXR1czogcGFyYW1zLnN0YXR1cyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnByZXZBY3Rpb25EYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiBwYXJhbXMuc3RhdHVzLFxuICAgICAgICAgICAgZGlzcGxheURhdGE6IHtcbiAgICAgICAgICAgICAgLi4ucHJldkFjdGlvbkRhdGEuZGlzcGxheURhdGEsXG4gICAgICAgICAgICAgIC4uLnBhcmFtcy5kaXNwbGF5RGF0YSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaWduaW5nRGF0YTogZ2V0VXBkYXRlZFNpZ25pbmdEYXRhKFxuICAgICAgICAgICAgICBwcmV2QWN0aW9uRGF0YS5zaWduaW5nRGF0YSxcbiAgICAgICAgICAgICAgcGFyYW1zLnNpZ25pbmdEYXRhLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzaG91bGRDbG9zZUFmdGVyVXBkYXRlID1cbiAgICAgICAgICBpc0NvbmZpcm1Qb3B1cCAmJiBwYXJhbXMuc3RhdHVzICE9PSBBY3Rpb25TdGF0dXMuUEVORElORztcblxuICAgICAgICByZXR1cm4gcmVxdWVzdDxVcGRhdGVBY3Rpb25IYW5kbGVyPih7XG4gICAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LkFDVElPTl9VUERBVEUsXG4gICAgICAgICAgcGFyYW1zOiBbcGFyYW1zLCBzaG91bGRXYWl0Rm9yUmVzcG9uc2VdLFxuICAgICAgICB9KS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICBpZiAoc2hvdWxkQ2xvc2VBZnRlclVwZGF0ZSkge1xuICAgICAgICAgICAgZ2xvYmFsVGhpcy5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgW3JlcXVlc3QsIGlzQ29uZmlybVBvcHVwXSxcbiAgICApO1xuXG4gIGNvbnN0IGNhbmNlbEhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoKSA9PlxuICAgICAgdXBkYXRlQWN0aW9uKHtcbiAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuRVJST1JfVVNFUl9DQU5DRUxFRCxcbiAgICAgICAgaWQ6IGFjdGlvbklkLFxuICAgICAgfSksXG4gICAgW2FjdGlvbklkLCB1cGRhdGVBY3Rpb25dLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICByZXF1ZXN0PEdldEFjdGlvbkhhbmRsZXI+KHtcbiAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LkFDVElPTl9HRVQsXG4gICAgICAgIHBhcmFtczogW2FjdGlvbklkXSxcbiAgICAgIH0pLnRoZW4oKGEpID0+IHtcbiAgICAgICAgaWYgKGlzQmF0Y2hBcHByb3ZhbCAmJiAhaXNCYXRjaEFwcHJvdmFsQWN0aW9uKGEpKSB7XG4gICAgICAgICAgc2V0RXJyb3IoJ0V4cGVjdGVkIGEgYmF0Y2ggYXBwcm92YWwgYWN0aW9uJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzQmF0Y2hBcHByb3ZhbCAmJiBpc0JhdGNoQXBwcm92YWxBY3Rpb24oYSkpIHtcbiAgICAgICAgICBzZXRFcnJvcignRXhwZWN0ZWQgYSBzaW5nbGUgYXBwcm92YWwgYWN0aW9uJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0QWN0aW9uKGEgYXMgQWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoYXBwcm92YWw/LmFjdGlvbi5hY3Rpb25JZCA9PT0gYWN0aW9uSWQpIHtcbiAgICAgIHNldEFjdGlvbihhcHByb3ZhbC5hY3Rpb24gYXMgQWN0aW9uVHlwZTx0eXBlb2YgaXNCYXRjaEFwcHJvdmFsPik7XG4gICAgfVxuICB9LCBbYWN0aW9uSWQsIHJlcXVlc3QsIGFwcHJvdmFsLCBpc0NvbmZpcm1Qb3B1cCwgaXNCYXRjaEFwcHJvdmFsXSk7XG5cbiAgdXNlV2luZG93R2V0c0Nsb3NlZE9ySGlkZGVuKGNhbmNlbEhhbmRsZXIpO1xuXG4gIHJldHVybiB7IGFjdGlvbiwgdXBkYXRlQWN0aW9uLCBlcnJvciwgY2FuY2VsSGFuZGxlciB9O1xufVxuIiwiaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQmFsYW5jZXNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9CYWxhbmNlc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VCYWxhbmNlVG90YWxJbkN1cnJlbmN5KGFjY291bnQ/OiBBY2NvdW50KSB7XG4gIGNvbnN0IHsgZ2V0VG90YWxCYWxhbmNlIH0gPSB1c2VCYWxhbmNlc0NvbnRleHQoKTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFhY2NvdW50Py5hZGRyZXNzQykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldFRvdGFsQmFsYW5jZShhY2NvdW50LmFkZHJlc3NDKTtcbiAgfSwgW2FjY291bnQ/LmFkZHJlc3NDLCBnZXRUb3RhbEJhbGFuY2VdKTtcbn1cbiIsImltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgQmxvY2thaWQgZnJvbSAnQGJsb2NrYWlkL2NsaWVudCc7XG5pbXBvcnQgeyBGZWF0dXJlR2F0ZXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmVhdHVyZUZsYWdzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrYWlkRGF0YSB7XG4gIHN0YXR1czogJ2hpdCcgfCAnbWlzcyc7XG4gIHVybD86IHN0cmluZztcbiAgaXNNYWxpY2lvdXM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlREFwcFNjYW4oKSB7XG4gIGNvbnN0IHsgZmVhdHVyZUZsYWdzIH0gPSB1c2VGZWF0dXJlRmxhZ0NvbnRleHQoKTtcbiAgY29uc3QgZEFwcFNjYW5uaW5nID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKGRBcHBVUkw6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLkJMT0NLQUlEX0RBUFBfU0NBTl0pIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGJhc2VVUkwgPSBwcm9jZXNzLmVudi5QUk9YWV9VUkwgKyAnL3Byb3h5L2Jsb2NrYWlkLyc7XG5cbiAgICAgIGNvbnN0IGJsb2NrYWlkID0gbmV3IEJsb2NrYWlkKHtcbiAgICAgICAgYmFzZVVSTCxcbiAgICAgICAgYXBpS2V5OiAna2V5JywgLy8gUHJveHkgQVBJIHdpbGwgYXBwZW5kIHRoZSBhY3R1YWwgQVBJIGtleSwgdGhpcyBoZXJlIGlzIGp1c3Qgc28gdGhlIFNESyBkb2VzIG5vdCBjb21wbGFpblxuICAgICAgfSk7XG4gICAgICBjb25zdCBbcmVzcG9uc2UsIGVycm9yXSA9IGF3YWl0IHJlc29sdmUoXG4gICAgICAgIGJsb2NrYWlkLnNpdGUuc2Nhbih7IHVybDogZEFwcFVSTCB9KSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChyZXNwb25zZSA9PT0gbnVsbCB8fCBlcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIGFuIGVycm9yIGR1cmluZyByZXF1ZXN0aW5nIHRoZSBkQXBwIGRhdGEnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ21pc3MnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgdXJsOiByZXNwb25zZS51cmwgfHwgZEFwcFVSTCxcbiAgICAgICAgaXNNYWxpY2lvdXM6IHJlc3BvbnNlLmlzX21hbGljaW91cyxcbiAgICAgIH07XG4gICAgfSxcbiAgICBbZmVhdHVyZUZsYWdzXSxcbiAgKTtcblxuICByZXR1cm4gZEFwcFNjYW5uaW5nO1xufVxuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5cbi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGdldCB0aGUgaWQgb2YgYSB0cmFuc2FjdGlvbiBvciBtZXNzYWdlIHRoYXRcbiAqIGhhcyBiZWVuIHB1dCBpbnRvIGxvY2Fsc3RvcmFnZSBhbmQgdG8gYmUgdXNlZCBhY3Jvc3MgbXVsdGlwbGVcbiAqIGNvbnRleHRzLiBXZSBncmFiIHRoZSBxdWVyeSBwYXJhbSBhbmQgdXNlIHRoYXQgdG8gZ2V0IHRoZSBpdGVtIG91dCBvZiBzdG9yYWdlLlxuICpcbiAqIEByZXR1cm5zIGlkIGZyb20gdGhlIHF1ZXJ5IHBhcmFtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VHZXRSZXF1ZXN0SWQoKSB7XG4gIGNvbnN0IGxvY2F0aW9uID0gdXNlTG9jYXRpb24oKTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3Qgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2ggPz8gJycpO1xuICAgIHJldHVybiBzZWFyY2hQYXJhbXMuZ2V0KCdhY3Rpb25JZCcpID8/ICcnO1xuICB9LCBbbG9jYXRpb24uc2VhcmNoXSk7XG59XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VDYWxsYmFjaywgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIFR5cG9ncmFwaHksXG4gIEJ1dHRvbixcbiAgTG9hZGluZ0RvdHMsXG4gIFN0YWNrLFxuICBCb3gsXG4gIHVzZVRoZW1lLFxuICBHbG9iZUljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgVG9rZW5JY29uIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkljb24nO1xuaW1wb3J0IHsgdXNlUGVybWlzc2lvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1Blcm1pc3Npb25zUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQXBwcm92ZUFjdGlvbiB9IGZyb20gJ0BzcmMvaG9va3MvdXNlQXBwcm92ZUFjdGlvbic7XG5pbXBvcnQgeyBTaXRlQXZhdGFyIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9TaXRlQXZhdGFyJztcbmltcG9ydCB7IEFjdGlvblN0YXR1cyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY3Rpb25zL21vZGVscyc7XG5pbXBvcnQgeyB1c2VHZXRSZXF1ZXN0SWQgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUdldFJlcXVlc3RJZCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgQWNjb3VudHNEcm9wZG93biB9IGZyb20gJy4vY29tcG9uZW50cy9BY2NvdW50c0Ryb3Bkb3duJztcbmltcG9ydCB7IEFsZXJ0RGlhbG9nIH0gZnJvbSAnLi9jb21wb25lbnRzL0FsZXJ0RGlhbG9nJztcbmltcG9ydCB7IEFsZXJ0Qm94IH0gZnJvbSAnLi9jb21wb25lbnRzL0FsZXJ0Qm94JztcbmltcG9ydCB7IFdhcm5pbmdCb3ggfSBmcm9tICcuL2NvbXBvbmVudHMvV2FybmluZ0JveCc7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB7IEZlYXR1cmVHYXRlcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9mZWF0dXJlRmxhZ3MvbW9kZWxzJztcbmltcG9ydCB7IEJsb2NrYWlkRGF0YSwgdXNlREFwcFNjYW4gfSBmcm9tICdAc3JjL2hvb2tzL3VzZURBcHBTY2FuJztcbmltcG9ydCB7IG1hcEFkZHJlc3Nlc1RvVk1zIH0gZnJvbSAnQHNyYy91dGlscy9hZGRyZXNzJztcbmltcG9ydCB7IERBcHBQcm92aWRlclJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZEFwcENvbm5lY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7IE5ldHdvcmtWTVR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gUGVybWlzc2lvbnNQYWdlKCkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHJlcXVlc3RJZCA9IHVzZUdldFJlcXVlc3RJZCgpO1xuICBjb25zdCB7IHBlcm1pc3Npb25zLCBpc0RvbWFpbkNvbm5lY3RlZFRvQWNjb3VudCB9ID0gdXNlUGVybWlzc2lvbkNvbnRleHQoKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7XG4gICAgYWNjb3VudHM6IHsgYWN0aXZlOiBhY3RpdmVBY2NvdW50IH0sXG4gICAgZ2V0QWxsQWNjb3VudHNGb3JWTSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCBbc2VsZWN0ZWRBY2NvdW50LCBzZXRTZWxlY3RlZEFjY291bnRdID0gdXNlU3RhdGU8QWNjb3VudD4oKTtcbiAgY29uc3QgW2RBcHBTY2FubmluZ1Jlc3VsdCwgc2V0REFwcFNjYW5uaW5nUmVzdWx0XSA9IHVzZVN0YXRlPFxuICAgIEJsb2NrYWlkRGF0YSB8IHVuZGVmaW5lZFxuICA+KHVuZGVmaW5lZCk7XG5cbiAgY29uc3QgW2Rpc3BsYXlEaWFsb2csIHNldERpc3BsYXlEaWFsb2ddID0gdXNlU3RhdGUodHJ1ZSk7XG5cbiAgY29uc3QgaXNDb25maXJtQ29udGFpbmVyID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuICBjb25zdCBkQXBwU2Nhbm5pbmcgPSB1c2VEQXBwU2NhbigpO1xuICBjb25zdCB7IGZlYXR1cmVGbGFncyB9ID0gdXNlRmVhdHVyZUZsYWdDb250ZXh0KCk7XG5cbiAgY29uc3QgeyBhY3Rpb24sIGNhbmNlbEhhbmRsZXIsIHVwZGF0ZUFjdGlvbiB9ID0gdXNlQXBwcm92ZUFjdGlvbihyZXF1ZXN0SWQpO1xuICBjb25zdCBpc1N1Ym1pdHRpbmcgPSBhY3Rpb24/LnN0YXR1cyA9PT0gQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkc7XG4gIGNvbnN0IGlzUmVxdWVzdGluZ0FjY2VzcyA9XG4gICAgYWN0aW9uPy5tZXRob2QgPT09IERBcHBQcm92aWRlclJlcXVlc3QuQ09OTkVDVF9NRVRIT0QgfHxcbiAgICBhY3Rpb24/Lm1ldGhvZCA9PT0gREFwcFByb3ZpZGVyUmVxdWVzdC5XQUxMRVRfQ09OTkVDVDtcbiAgY29uc3QgaXNXYWxsZXRSZXF1ZXN0UGVybWlzc2lvbnMgPVxuICAgIGFjdGlvbj8ubWV0aG9kID09PSAnd2FsbGV0X3JlcXVlc3RQZXJtaXNzaW9ucyc7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYWN0aW9uPy5zaXRlPy5kb21haW4pIHtcbiAgICAgIGRBcHBTY2FubmluZyhhY3Rpb24uc2l0ZS5kb21haW4pXG4gICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBzZXREQXBwU2Nhbm5pbmdSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAgICB9XG4gIH0sIFtkQXBwU2Nhbm5pbmcsIGFjdGlvbj8uc2l0ZT8uZG9tYWluXSk7XG5cbiAgY29uc3Qgb25BcHByb3ZlQ2xpY2tlZCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoIXNlbGVjdGVkQWNjb3VudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICBzdGF0dXM6IEFjdGlvblN0YXR1cy5TVUJNSVRUSU5HLFxuICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgIHJlc3VsdDogc2VsZWN0ZWRBY2NvdW50LmlkLFxuICAgIH0pO1xuICB9LCBbc2VsZWN0ZWRBY2NvdW50LCB1cGRhdGVBY3Rpb24sIHJlcXVlc3RJZF0pO1xuXG4gIGNvbnN0IGFjdGl2ZUFjY291bnRBZGRyZXNzRm9yUmVxdWVzdGVkVk0gPVxuICAgIGFjdGl2ZUFjY291bnQgJiYgYWN0aW9uXG4gICAgICA/IG1hcEFkZHJlc3Nlc1RvVk1zKGFjdGl2ZUFjY291bnQpW2FjdGlvbj8uZGlzcGxheURhdGEuYWRkcmVzc1ZNXVxuICAgICAgOiBudWxsO1xuXG4gIGNvbnN0IGlzQWNjb3VudFBlcm1pc3Npb25HcmFudGVkID0gdXNlTWVtbyhcbiAgICAoKSA9PlxuICAgICAgYWN0aW9uICYmXG4gICAgICBhY3RpdmVBY2NvdW50QWRkcmVzc0ZvclJlcXVlc3RlZFZNICYmXG4gICAgICBpc0RvbWFpbkNvbm5lY3RlZFRvQWNjb3VudChhY3Rpb24uZGlzcGxheURhdGEuZG9tYWluVXJsLCBbXG4gICAgICAgIGFjdGl2ZUFjY291bnRBZGRyZXNzRm9yUmVxdWVzdGVkVk0sXG4gICAgICBdKSAmJlxuICAgICAgaXNDb25maXJtQ29udGFpbmVyLFxuICAgIFtcbiAgICAgIGFjdGlvbixcbiAgICAgIGFjdGl2ZUFjY291bnRBZGRyZXNzRm9yUmVxdWVzdGVkVk0sXG4gICAgICBpc0RvbWFpbkNvbm5lY3RlZFRvQWNjb3VudCxcbiAgICAgIGlzQ29uZmlybUNvbnRhaW5lcixcbiAgICBdLFxuICApO1xuXG4gIC8vIElmIHRoZSBkb21haW4gYWxyZWFkeSBoYXMgcGVybWlzc2lvbnMgZm9yIHRoZSBhY3RpdmUgYWNjb3VudCwgY2xvc2UgdGhlIHBvcHVwXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzQWNjb3VudFBlcm1pc3Npb25HcmFudGVkICYmIGlzUmVxdWVzdGluZ0FjY2Vzcykge1xuICAgICAgaWYgKGFjdGl2ZUFjY291bnQ/LmlkKSB7XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSByZXR1cm4gYSByZXNwb25zZSBldmVuIGlmIHRoZSBzaXRlIHdhcyBhbHJlYWR5IGFwcHJvdmVkXG4gICAgICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyxcbiAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgIHJlc3VsdDogYWN0aXZlQWNjb3VudC5pZCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtcbiAgICBhY3RpdmVBY2NvdW50Py5pZCxcbiAgICBpc0FjY291bnRQZXJtaXNzaW9uR3JhbnRlZCxcbiAgICBpc1JlcXVlc3RpbmdBY2Nlc3MsXG4gICAgcmVxdWVzdElkLFxuICAgIHVwZGF0ZUFjdGlvbixcbiAgXSk7XG5cbiAgY29uc3QgYWxsQWNjb3VudHNGb3JSZXF1ZXN0ZWRWTSA9IGdldEFsbEFjY291bnRzRm9yVk0oXG4gICAgYWN0aW9uPy5kaXNwbGF5RGF0YT8uYWRkcmVzc1ZNID8/IE5ldHdvcmtWTVR5cGUuRVZNLFxuICApO1xuXG4gIC8vIE11c3QgYWxzbyB3YWl0IGZvciBpc0FjY291bnRQZXJtaXNzaW9uR3JhbnRlZCBzaW5jZSBgb25BcHByb3ZlQ2xpY2tlZGAgaXMgYXN5bmNcbiAgaWYgKFxuICAgICFwZXJtaXNzaW9ucyB8fFxuICAgICFhY3Rpb24gfHxcbiAgICBhbGxBY2NvdW50c0ZvclJlcXVlc3RlZFZNLmxlbmd0aCA9PT0gMCB8fFxuICAgICFhY3RpdmVBY2NvdW50IHx8XG4gICAgKGlzQWNjb3VudFBlcm1pc3Npb25HcmFudGVkICYmICFpc1dhbGxldFJlcXVlc3RQZXJtaXNzaW9ucylcbiAgKSB7XG4gICAgcmV0dXJuIDxMb2FkaW5nRG90cyBzaXplPXsyMH0gLz47XG4gIH1cblxuICBjb25zdCBpc01hbGljaW91c0RBcHAgPSBkQXBwU2Nhbm5pbmdSZXN1bHQgJiYgZEFwcFNjYW5uaW5nUmVzdWx0LmlzTWFsaWNpb3VzO1xuICBjb25zdCBpc01pc3NpbmdCbG9ja2FpZERhdGEgPVxuICAgIGRBcHBTY2FubmluZ1Jlc3VsdCAmJiBkQXBwU2Nhbm5pbmdSZXN1bHQ/LnN0YXR1cyA9PT0gJ21pc3MnID8gdHJ1ZSA6IGZhbHNlO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgY29sb3I6IHRoZW1lLnBhbGV0dGUudGV4dC5wcmltYXJ5LFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDMsIHB5OiAxLjUgfX0+XG4gICAgICAgICAgPEJveCBzeD17eyB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg0XCI+e3QoJ0Nvbm5lY3QgQ29yZSB0byBEYXBwJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDIuNSwgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICB7ZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5CTE9DS0FJRF9EQVBQX1NDQU5dICYmXG4gICAgICAgICAgICAgIGlzTWFsaWNpb3VzREFwcCAmJiAoXG4gICAgICAgICAgICAgICAgPEFsZXJ0Qm94XG4gICAgICAgICAgICAgICAgICB0aXRsZT17dCgnTWFsaWNpb3VzIEFwcGxpY2F0aW9uJyl9XG4gICAgICAgICAgICAgICAgICB0ZXh0PXt0KCdUaGlzIGFwcGxpY2F0aW9uIGlzIG1hbGljaW91cywgZG8gbm90IHByb2NlZWQuJyl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLkJMT0NLQUlEX0RBUFBfU0NBTl9XQVJOSU5HXSAmJlxuICAgICAgICAgICAgICBpc01pc3NpbmdCbG9ja2FpZERhdGEgJiYgKFxuICAgICAgICAgICAgICAgIDxXYXJuaW5nQm94XG4gICAgICAgICAgICAgICAgICB0aXRsZT17dCgnU3VzcGljaW91cyBBcHBsaWNhdGlvbicpfVxuICAgICAgICAgICAgICAgICAgdGV4dD17dCgnVXNlIGNhdXRpb24sIHRoaXMgYXBwbGljYXRpb24gbWF5IGJlIG1hbGljaW91cy4nKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPFNpdGVBdmF0YXIgc3g9e3sgbTogMCB9fT5cbiAgICAgICAgICAgICAgPFRva2VuSWNvblxuICAgICAgICAgICAgICAgIGhlaWdodD1cIjQ4cHhcIlxuICAgICAgICAgICAgICAgIHdpZHRoPVwiNDhweFwiXG4gICAgICAgICAgICAgICAgc3JjPXthY3Rpb24uZGlzcGxheURhdGEuZG9tYWluSWNvbn1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxHbG9iZUljb24gc2l6ZT17NDh9IGNvbG9yPXt0aGVtZS5wYWxldHRlLnRleHQuc2Vjb25kYXJ5fSAvPlxuICAgICAgICAgICAgICA8L1Rva2VuSWNvbj5cbiAgICAgICAgICAgIDwvU2l0ZUF2YXRhcj5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGdhcDogMC41LFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IDEsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPlxuICAgICAgICAgICAgICAgIHthY3Rpb24uZGlzcGxheURhdGEuZG9tYWluTmFtZX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogdGhlbWUucGFsZXR0ZS50ZXh0LnNlY29uZGFyeSxcbiAgICAgICAgICAgICAgICAgIHdvcmRXcmFwOiAnYnJlYWstd29yZCcsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHthY3Rpb24uZGlzcGxheURhdGEuZG9tYWluVXJsfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPEFjY291bnRzRHJvcGRvd25cbiAgICAgICAgICAgIGFsbEFjY291bnRzRm9yUmVxdWVzdGVkVk09e2FsbEFjY291bnRzRm9yUmVxdWVzdGVkVk19XG4gICAgICAgICAgICBhY3RpdmVBY2NvdW50PXthY3RpdmVBY2NvdW50fVxuICAgICAgICAgICAgb25TZWxlY3RlZEFjY291bnRDaGFuZ2VkPXsoYWNjKSA9PiBzZXRTZWxlY3RlZEFjY291bnQoYWNjKX1cbiAgICAgICAgICAgIGFkZHJlc3NWTT17YWN0aW9uLmRpc3BsYXlEYXRhLmFkZHJlc3NWTX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgbWI6IDIsXG4gICAgICAgICAgICAgIGNvbG9yOiB0aGVtZS5wYWxldHRlLnRleHQuc2Vjb25kYXJ5LFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHBhcmFncmFwaFxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdPbmx5IGNvbm5lY3QgdG8gc2l0ZXMgdGhhdCB5b3UgdHJ1c3QuJyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdC1yZWplY3QtYnRuXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIGNhbmNlbEhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXtpc1N1Ym1pdHRpbmd9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdSZWplY3QnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3QtYXBwcm92ZS1idG5cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkFwcHJvdmVDbGlja2VkKCl9XG4gICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICBpc0xvYWRpbmc9e2lzU3VibWl0dGluZ31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzU3VibWl0dGluZ31cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2lzU3VibWl0dGluZyA/ICcnIDogdCgnQXBwcm92ZScpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgICB7ZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5CTE9DS0FJRF9EQVBQX1NDQU5dICYmIGlzTWFsaWNpb3VzREFwcCAmJiAoXG4gICAgICAgIDxBbGVydERpYWxvZ1xuICAgICAgICAgIHByb2NlZWRMYWJlbD17dCgnUHJvY2VlZCBBbnl3YXknKX1cbiAgICAgICAgICBjYW5jZWxIYW5kbGVyPXsoKSA9PiB7XG4gICAgICAgICAgICBjYW5jZWxIYW5kbGVyKCk7XG4gICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9wZW49e2Rpc3BsYXlEaWFsb2d9XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0RGlzcGxheURpYWxvZyhmYWxzZSl9XG4gICAgICAgICAgdGl0bGU9e3QoJ1NjYW0gQXBwbGljYXRpb24nKX1cbiAgICAgICAgICB0ZXh0PXt0KCdUaGlzIGFwcGxpY2F0aW9uIGlzIG1hbGljaW91cywgZG8gbm90IHByb2NlZWQuJyl9XG4gICAgICAgICAgcmVqZWN0TGFiZWw9e3QoJ1JlamVjdCBDb25uZWN0aW9uJyl9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBDaGVja0ljb24sXG4gIFNrZWxldG9uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBEcm9wZG93bkl0ZW0sIERyb3Bkb3duIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ecm9wZG93bic7XG5pbXBvcnQgeyB1c2VCYWxhbmNlc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JhbGFuY2VzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUJhbGFuY2VUb3RhbEluQ3VycmVuY3kgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUJhbGFuY2VUb3RhbEluQ3VycmVuY3knO1xuaW1wb3J0IHsgdHJ1bmNhdGVBZGRyZXNzIH0gZnJvbSAnQHNyYy91dGlscy90cnVuY2F0ZUFkZHJlc3MnO1xuaW1wb3J0IHsgTmV0d29ya1ZNVHlwZSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyBnZXRBZGRyZXNzQnlWTVR5cGUgfSBmcm9tICdAc3JjL3V0aWxzL2FkZHJlc3MnO1xuaW1wb3J0IHsgQWNjb3VudCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuXG5jb25zdCByZW5kZXJWYWx1ZSA9IChhY2NvdW50OiBBY2NvdW50LCB2bVR5cGU6IE5ldHdvcmtWTVR5cGUpID0+IChcbiAgPFR5cG9ncmFwaHlcbiAgICBjb21wb25lbnQ9XCJzcGFuXCJcbiAgICBmb250U2l6ZT1cImluaGVyaXRcIlxuICAgIHN4PXt7XG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBmbGV4OiAxLFxuICAgICAgbWluV2lkdGg6IDAsXG4gICAgfX1cbiAgPlxuICAgIDxUeXBvZ3JhcGh5IGNvbXBvbmVudD1cInNwYW5cIiBub1dyYXAgZm9udFNpemU9XCJpbmhlcml0XCI+XG4gICAgICB7YWNjb3VudC5uYW1lfVxuICAgIDwvVHlwb2dyYXBoeT5cbiAgICA8VHlwb2dyYXBoeVxuICAgICAgY29tcG9uZW50PVwic3BhblwiXG4gICAgICBzeD17eyBmbGV4U2hyaW5rOiAwLCBwbDogMC41IH19XG4gICAgICBmb250U2l6ZT1cImluaGVyaXRcIlxuICAgID5cbiAgICAgICh7dHJ1bmNhdGVBZGRyZXNzKGdldEFkZHJlc3NCeVZNVHlwZShhY2NvdW50LCB2bVR5cGUpISl9KVxuICAgIDwvVHlwb2dyYXBoeT5cbiAgPC9UeXBvZ3JhcGh5PlxuKTtcblxuZXhwb3J0IGNvbnN0IEFjY291bnRzRHJvcGRvd24gPSAoe1xuICBhbGxBY2NvdW50c0ZvclJlcXVlc3RlZFZNLFxuICBhY3RpdmVBY2NvdW50LFxuICBvblNlbGVjdGVkQWNjb3VudENoYW5nZWQsXG4gIGFkZHJlc3NWTSA9IE5ldHdvcmtWTVR5cGUuRVZNLFxufSkgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgW3NlbGVjdGVkQWNjb3VudCwgc2V0U2VsZWN0ZWRBY2NvdW50XSA9IHVzZVN0YXRlKGFjdGl2ZUFjY291bnQpO1xuICBjb25zdCBbaXNCYWxhbmNlTG9hZGluZywgc2V0SXNCYWxhbmNlTG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IHsgdXBkYXRlQmFsYW5jZU9uTmV0d29ya3MgfSA9IHVzZUJhbGFuY2VzQ29udGV4dCgpO1xuICBjb25zdCB7IGN1cnJlbmN5LCBjdXJyZW5jeUZvcm1hdHRlciB9ID0gdXNlU2V0dGluZ3NDb250ZXh0KCk7XG4gIGNvbnN0IGFjY291bnRCYWxhbmNlID0gdXNlQmFsYW5jZVRvdGFsSW5DdXJyZW5jeShzZWxlY3RlZEFjY291bnQpO1xuXG4gIGNvbnN0IGJhbGFuY2VTdW0gPSBhY2NvdW50QmFsYW5jZT8uc3VtIHx8IDA7XG4gIGNvbnN0IGhhc0FjY291bnRCYWxhbmNlID1cbiAgICBhY2NvdW50QmFsYW5jZSAmJiBhY2NvdW50QmFsYW5jZSAhPT0gbnVsbCAmJiBhY2NvdW50QmFsYW5jZS5zdW0gIT09IG51bGw7XG5cbiAgLy8gU2V0IGFjdGl2ZSBhY2NvdW50IGFzIGRlZmF1bHRcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBnZXRCYWxhbmNlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0SXNCYWxhbmNlTG9hZGluZyh0cnVlKTtcbiAgICAgIGF3YWl0IHVwZGF0ZUJhbGFuY2VPbk5ldHdvcmtzPy4oc2VsZWN0ZWRBY2NvdW50KTtcbiAgICAgIHNldElzQmFsYW5jZUxvYWRpbmcoZmFsc2UpO1xuICAgIH07XG5cbiAgICBpZiAoIXNlbGVjdGVkQWNjb3VudCkge1xuICAgICAgaWYgKGFjdGl2ZUFjY291bnQpIHtcbiAgICAgICAgc2V0U2VsZWN0ZWRBY2NvdW50KGFjdGl2ZUFjY291bnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChzZWxlY3RlZEFjY291bnQpIHtcbiAgICAgIGdldEJhbGFuY2UoKTtcbiAgICB9XG4gIH0sIFthY3RpdmVBY2NvdW50LCBzZWxlY3RlZEFjY291bnQsIHVwZGF0ZUJhbGFuY2VPbk5ldHdvcmtzXSk7XG5cbiAgLy8gVXBkYXRlIGJhbGFuY2UgJiBub3RpZnkgcGFyZW50IGNvbXBvbmVudCBhYm91dCBjaGFuZ2VzIHdoZW4gYWNjb3VudCBpcyBzZWxlY3RlZFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIG9uU2VsZWN0ZWRBY2NvdW50Q2hhbmdlZChzZWxlY3RlZEFjY291bnQpO1xuICB9LCBbb25TZWxlY3RlZEFjY291bnRDaGFuZ2VkLCBzZWxlY3RlZEFjY291bnRdKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBnYXA6IDEsIHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICA8RHJvcGRvd25cbiAgICAgICAgU2VsZWN0UHJvcHM9e3tcbiAgICAgICAgICAvLyA8U2VsZWN0IC8+IGV4cGVjdHMgcmVmZXJlbmNlIGVxdWFsaXR5IGFuZCBgYWN0aXZlQWNjb3VudGAgaXMgYSBkaWZmZXJlbnQgb2JqZWN0XG4gICAgICAgICAgLy8gdGhhbiB0aGUgb25lIGluIGBhY2NvdW50c2AgYXJyYXkuXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiBhbGxBY2NvdW50c0ZvclJlcXVlc3RlZFZNLmZpbmQoXG4gICAgICAgICAgICAoYWNjKSA9PiBhY2MuaWQgPT09IGFjdGl2ZUFjY291bnQ/LmlkLFxuICAgICAgICAgICksXG4gICAgICAgICAgb25DaGFuZ2U6IChldikgPT4gc2V0U2VsZWN0ZWRBY2NvdW50KGV2LnRhcmdldC52YWx1ZSksXG4gICAgICAgICAgcmVuZGVyVmFsdWU6ICh2YWx1ZSkgPT4gcmVuZGVyVmFsdWUodmFsdWUgYXMgQWNjb3VudCwgYWRkcmVzc1ZNKSxcbiAgICAgICAgICAvLyBXZSBuZWVkIHRoZSBAdHMtaWdub3JlLCBiZWNhdXNlIE1VSSdzIFwibmVzdGVkIHByb3BzXCIgKHN1Y2ggYXMgU2VsZWN0UHJvcHMpXG4gICAgICAgICAgLy8gZG8gbm90IGFsbG93IHBhc3NpbmcgZGF0YS1hdHRyaWJ1dGVzLlxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgJ2RhdGEtdGVzdGlkJzogJ2Nvbm5lY3QtYWNjb3VudC1kcm9wZG93bicsXG4gICAgICAgIH19XG4gICAgICAgIGxhYmVsPXt0KCdTZWxlY3QgQWNjb3VudCcpfVxuICAgICAgPlxuICAgICAgICB7YWxsQWNjb3VudHNGb3JSZXF1ZXN0ZWRWTS5tYXAoKGFjYykgPT4gKFxuICAgICAgICAgIDxEcm9wZG93bkl0ZW1cbiAgICAgICAgICAgIGtleT17YWNjLmlkfVxuICAgICAgICAgICAgdmFsdWU9e2FjY31cbiAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZEFjY291bnQ/LmlkID09PSBhY2MuaWR9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3QtYWNjb3VudC1tZW51LWl0ZW1cIlxuICAgICAgICAgICAgdGl0bGU9e2FjYy5uYW1lfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtyZW5kZXJWYWx1ZShhY2MsIGFkZHJlc3NWTSl9XG4gICAgICAgICAgICB7c2VsZWN0ZWRBY2NvdW50Py5pZCA9PT0gYWNjLmlkICYmIDxDaGVja0ljb24gLz59XG4gICAgICAgICAgPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICkpfVxuICAgICAgPC9Ecm9wZG93bj5cbiAgICAgIHtpc0JhbGFuY2VMb2FkaW5nICYmIDxTa2VsZXRvbiB2YXJpYW50PVwidGV4dFwiIHdpZHRoPXsxMjB9IC8+fVxuICAgICAgeyFpc0JhbGFuY2VMb2FkaW5nICYmIGhhc0FjY291bnRCYWxhbmNlICYmIChcbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBjb2xvcj17dGhlbWUucGFsZXR0ZS50ZXh0LnNlY29uZGFyeX0+XG4gICAgICAgICAge3QoJ0JhbGFuY2UnKX06IHtjdXJyZW5jeUZvcm1hdHRlcihiYWxhbmNlU3VtKS5yZXBsYWNlKGN1cnJlbmN5LCAnJyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBBbGVydCxcbiAgQWxlcnRDb250ZW50LFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbiAgUmVtb3ZlTW9kZXJhdG9ySWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW50ZXJmYWNlIEFsZXJ0Qm94UHJvcHMge1xuICB0aXRsZTogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBbGVydEJveCh7IHRpdGxlLCB0ZXh0IH06IEFsZXJ0Qm94UHJvcHMpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPEFsZXJ0XG4gICAgICBzZXZlcml0eT1cImVycm9yXCJcbiAgICAgIGljb249e1xuICAgICAgICA8UmVtb3ZlTW9kZXJhdG9ySWNvbiBzaXplPXsyNH0gY29sb3I9e3RoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrfSAvPlxuICAgICAgfVxuICAgICAgc3g9e3tcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnZXJyb3IubGlnaHQnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgcHg6IDIsXG4gICAgICAgIGNvbG9yOiAnY29tbW9uLmJsYWNrJyxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEFsZXJ0Q29udGVudD5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogNjAwLCBkaXNwbGF5OiAnYmxvY2snIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBzeD17eyBkaXNwbGF5OiAnYmxvY2snIH19PlxuICAgICAgICAgIHt0ZXh0fVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L0FsZXJ0Q29udGVudD5cbiAgICA8L0FsZXJ0PlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBEaWFsb2csXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbiAgUmVtb3ZlTW9kZXJhdG9ySWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW50ZXJmYWNlIEFsZXJ0RGlhbG9nUHJvcHMge1xuICBjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkO1xuICBvcGVuOiBib29sZWFuO1xuICBvbkNsb3NlOiAoKSA9PiB2b2lkO1xuICB0aXRsZTogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIHJlamVjdExhYmVsOiBzdHJpbmc7XG4gIHByb2NlZWRMYWJlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWxlcnREaWFsb2coe1xuICBjYW5jZWxIYW5kbGVyLFxuICBvcGVuLFxuICBvbkNsb3NlLFxuICB0aXRsZSxcbiAgdGV4dCxcbiAgcmVqZWN0TGFiZWwsXG4gIHByb2NlZWRMYWJlbCxcbn06IEFsZXJ0RGlhbG9nUHJvcHMpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICByZXR1cm4gKFxuICAgIDxEaWFsb2dcbiAgICAgIG9wZW49e29wZW59XG4gICAgICBzaG93Q2xvc2VJY29uXG4gICAgICBvbkNsb3NlPXtvbkNsb3NlfVxuICAgICAgUGFwZXJQcm9wcz17e1xuICAgICAgICBzeDoge1xuICAgICAgICAgIG06IDIsXG4gICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgIG1heFdpZHRoOiAnbm9uZScsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIH0sXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHB5OiAzLFxuICAgICAgICAgIHB4OiA1LFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICB3aWR0aDogJzIyNXB4JyxcbiAgICAgICAgICAgIGdhcDogMS41LFxuICAgICAgICAgICAgcHk6IDE0LFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8UmVtb3ZlTW9kZXJhdG9ySWNvblxuICAgICAgICAgICAgc2l6ZT17NDh9XG4gICAgICAgICAgICBjb2xvcj17dGhlbWUuY3VzdG9tUGFsZXR0ZS5hdmFsYW5jaGVSZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgc3g9e3sgY29sb3I6IHRoZW1lLmN1c3RvbVBhbGV0dGUuYXZhbGFuY2hlUmVkLCBweDogMiB9fVxuICAgICAgICAgICAgdmFyaWFudD1cImg0XCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPnt0ZXh0fTwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgY29sb3I9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdC1yZWplY3QtYnRuXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cmVqZWN0TGFiZWx9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjb25uZWN0LWFwcHJvdmUtYnRuXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3Byb2NlZWRMYWJlbH1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9EaWFsb2c+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBBbGVydCxcbiAgQWxlcnRDb250ZW50LFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbiAgR3BwTWF5YmVJY29uLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbnRlcmZhY2UgV2FybmluZ0JveFByb3BzIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gV2FybmluZ0JveCh7IHRpdGxlLCB0ZXh0IH06IFdhcm5pbmdCb3hQcm9wcykge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIHJldHVybiAoXG4gICAgPEFsZXJ0XG4gICAgICBzZXZlcml0eT1cIndhcm5pbmdcIlxuICAgICAgaWNvbj17PEdwcE1heWJlSWNvbiBzaXplPXsyNH0gY29sb3I9e3RoZW1lLnBhbGV0dGUuY29tbW9uLmJsYWNrfSAvPn1cbiAgICAgIHN4PXt7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3dhcm5pbmcubGlnaHQnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgcHg6IDIsXG4gICAgICAgIGNvbG9yOiAnY29tbW9uLmJsYWNrJyxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPEFsZXJ0Q29udGVudD5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogNjAwLCBkaXNwbGF5OiAnYmxvY2snIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBzeD17eyBkaXNwbGF5OiAnYmxvY2snIH19PlxuICAgICAgICAgIHt0ZXh0fVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L0FsZXJ0Q29udGVudD5cbiAgICA8L0FsZXJ0PlxuICApO1xufVxuIiwiaW1wb3J0IHsgU2lnbmluZ0RhdGEgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0VXBkYXRlZFNpZ25pbmdEYXRhID0gKFxuICBvbGRTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuICBuZXdTaWduaW5nRGF0YT86IFNpZ25pbmdEYXRhLFxuKTogU2lnbmluZ0RhdGEgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoIW9sZFNpZ25pbmdEYXRhKSB7XG4gICAgcmV0dXJuIG5ld1NpZ25pbmdEYXRhO1xuICB9IGVsc2UgaWYgKCFuZXdTaWduaW5nRGF0YSkge1xuICAgIHJldHVybiBvbGRTaWduaW5nRGF0YTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub2xkU2lnbmluZ0RhdGEsXG4gICAgLi4ubmV3U2lnbmluZ0RhdGEsXG4gIH07XG59O1xuIiwiaW1wb3J0IHtcbiAgQ29udGV4dENvbnRhaW5lcixcbiAgdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIsXG59IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXInO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgZnJvbUV2ZW50UGF0dGVybiwgbWVyZ2UgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdpbmRvd0dldHNDbG9zZWRPckhpZGRlbihjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkKSB7XG4gIGNvbnN0IGlzQ29uZmlybVBvcHVwID0gdXNlSXNTcGVjaWZpY0NvbnRleHRDb250YWluZXIoXG4gICAgQ29udGV4dENvbnRhaW5lci5DT05GSVJNLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICAgZnJvbUV2ZW50UGF0dGVybihcbiAgICAgICAgKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICAoaGFuZGxlcikgPT4ge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gICAgICApLnBpcGUoXG4gICAgICAgIGZpbHRlcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbic7XG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIE9ubHkgY2xvc2UgZm9yIHBvcHVwIHdpbmRvd3MuIFRoZSBleHRlbnNpb24gVUkgc2hvdWxkIG5vdCByZWFjdCB0aGlzIHdheS5cbiAgICAgICAgaWYgKGlzQ29uZmlybVBvcHVwKSB7XG4gICAgICAgICAgY2FuY2VsSGFuZGxlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW2NhbmNlbEhhbmRsZXIsIGlzQ29uZmlybVBvcHVwXSk7XG59XG4iXSwibmFtZXMiOlsiQ2hldnJvbkRvd25JY29uIiwiTWVudUl0ZW0iLCJTZWxlY3QiLCJ1c2VUaGVtZSIsIlRyaWdnZXJJY29uIiwicmVzdCIsInRoZW1lIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiX2V4dGVuZHMiLCJzaXplIiwic3giLCJ0cmFuc2l0aW9uIiwicmlnaHQiLCJzcGFjaW5nIiwidG9wIiwidHJhbnNmb3JtIiwidXNlRHJvcGRvd25Qcm9wcyIsIklucHV0UHJvcHMiLCJpbnB1dFN4Iiwib3RoZXJJbnB1dFByb3BzIiwiU2VsZWN0UHJvcHMiLCJNZW51UHJvcHMiLCJQYXBlclByb3BzIiwicGFwZXJTeCIsIm90aGVyUGFwZXJQcm9wcyIsIm90aGVyTWVudVByb3BzIiwib3RoZXJTZWxlY3RQcm9wcyIsInBhZGRpbmciLCJoZWlnaHQiLCJib3JkZXIiLCJwYWxldHRlIiwiZ3JleSIsImJhY2tncm91bmRDb2xvciIsImZvbnRTaXplIiwidHlwb2dyYXBoeSIsImJvZHkxIiwiSWNvbkNvbXBvbmVudCIsIm1heFdpZHRoIiwibWF4SGVpZ2h0IiwibXQiLCJEcm9wZG93biIsImNoaWxkcmVuIiwicHJvcHMiLCJ2YXJpYW50IiwiaW5wdXRMYWJlbFByb3BzIiwiYm9keTIiLCJEcm9wZG93bkl0ZW0iLCJtaW5IZWlnaHQiLCJnYXAiLCJTdGFjayIsInN0eWxlZCIsIlNpdGVBdmF0YXIiLCJiYWNrZ3JvdW5kIiwicGFwZXIiLCJtYXJnaW4iLCJFeHRlbnNpb25SZXF1ZXN0IiwiaXNCYXRjaEFwcHJvdmFsQWN0aW9uIiwiQWN0aW9uU3RhdHVzIiwidXNlQ29ubmVjdGlvbkNvbnRleHQiLCJ1c2VXaW5kb3dHZXRzQ2xvc2VkT3JIaWRkZW4iLCJ1c2VDYWxsYmFjayIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiQ29udGV4dENvbnRhaW5lciIsInVzZUlzU3BlY2lmaWNDb250ZXh0Q29udGFpbmVyIiwidXNlQXBwcm92YWxzQ29udGV4dCIsImdldFVwZGF0ZWRTaWduaW5nRGF0YSIsInVzZUFwcHJvdmVBY3Rpb24iLCJhY3Rpb25JZCIsImlzQmF0Y2hBcHByb3ZhbCIsInJlcXVlc3QiLCJpc0NvbmZpcm1Qb3B1cCIsIkNPTkZJUk0iLCJhcHByb3ZhbCIsImFjdGlvbiIsInNldEFjdGlvbiIsImVycm9yIiwic2V0RXJyb3IiLCJ1cGRhdGVBY3Rpb24iLCJwYXJhbXMiLCJzaG91bGRXYWl0Rm9yUmVzcG9uc2UiLCJwcmV2QWN0aW9uRGF0YSIsInN0YXR1cyIsImRpc3BsYXlEYXRhIiwic2lnbmluZ0RhdGEiLCJzaG91bGRDbG9zZUFmdGVyVXBkYXRlIiwiUEVORElORyIsIm1ldGhvZCIsIkFDVElPTl9VUERBVEUiLCJmaW5hbGx5IiwiZ2xvYmFsVGhpcyIsImNsb3NlIiwiY2FuY2VsSGFuZGxlciIsIkVSUk9SX1VTRVJfQ0FOQ0VMRUQiLCJpZCIsIkFDVElPTl9HRVQiLCJ0aGVuIiwiYSIsInVzZUJhbGFuY2VzQ29udGV4dCIsInVzZU1lbW8iLCJ1c2VCYWxhbmNlVG90YWxJbkN1cnJlbmN5IiwiYWNjb3VudCIsImdldFRvdGFsQmFsYW5jZSIsImFkZHJlc3NDIiwicmVzb2x2ZSIsIkJsb2NrYWlkIiwiRmVhdHVyZUdhdGVzIiwidXNlRmVhdHVyZUZsYWdDb250ZXh0IiwidXNlREFwcFNjYW4iLCJmZWF0dXJlRmxhZ3MiLCJkQXBwU2Nhbm5pbmciLCJkQXBwVVJMIiwiQkxPQ0tBSURfREFQUF9TQ0FOIiwidW5kZWZpbmVkIiwiYmFzZVVSTCIsInByb2Nlc3MiLCJlbnYiLCJQUk9YWV9VUkwiLCJibG9ja2FpZCIsImFwaUtleSIsInJlc3BvbnNlIiwic2l0ZSIsInNjYW4iLCJ1cmwiLCJFcnJvciIsImlzTWFsaWNpb3VzIiwiaXNfbWFsaWNpb3VzIiwidXNlTG9jYXRpb24iLCJ1c2VHZXRSZXF1ZXN0SWQiLCJsb2NhdGlvbiIsInNlYXJjaFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInNlYXJjaCIsImdldCIsIlR5cG9ncmFwaHkiLCJCdXR0b24iLCJMb2FkaW5nRG90cyIsIkJveCIsIkdsb2JlSWNvbiIsInVzZUFjY291bnRzQ29udGV4dCIsIlRva2VuSWNvbiIsInVzZVBlcm1pc3Npb25Db250ZXh0IiwidXNlVHJhbnNsYXRpb24iLCJBY2NvdW50c0Ryb3Bkb3duIiwiQWxlcnREaWFsb2ciLCJBbGVydEJveCIsIldhcm5pbmdCb3giLCJtYXBBZGRyZXNzZXNUb1ZNcyIsIkRBcHBQcm92aWRlclJlcXVlc3QiLCJOZXR3b3JrVk1UeXBlIiwiUGVybWlzc2lvbnNQYWdlIiwidCIsInJlcXVlc3RJZCIsInBlcm1pc3Npb25zIiwiaXNEb21haW5Db25uZWN0ZWRUb0FjY291bnQiLCJhY2NvdW50cyIsImFjdGl2ZSIsImFjdGl2ZUFjY291bnQiLCJnZXRBbGxBY2NvdW50c0ZvclZNIiwic2VsZWN0ZWRBY2NvdW50Iiwic2V0U2VsZWN0ZWRBY2NvdW50IiwiZEFwcFNjYW5uaW5nUmVzdWx0Iiwic2V0REFwcFNjYW5uaW5nUmVzdWx0IiwiZGlzcGxheURpYWxvZyIsInNldERpc3BsYXlEaWFsb2ciLCJpc0NvbmZpcm1Db250YWluZXIiLCJpc1N1Ym1pdHRpbmciLCJTVUJNSVRUSU5HIiwiaXNSZXF1ZXN0aW5nQWNjZXNzIiwiQ09OTkVDVF9NRVRIT0QiLCJXQUxMRVRfQ09OTkVDVCIsImlzV2FsbGV0UmVxdWVzdFBlcm1pc3Npb25zIiwiZG9tYWluIiwicmVzdWx0IiwiY2F0Y2giLCJlIiwiY29uc29sZSIsIm9uQXBwcm92ZUNsaWNrZWQiLCJhY3RpdmVBY2NvdW50QWRkcmVzc0ZvclJlcXVlc3RlZFZNIiwiYWRkcmVzc1ZNIiwiaXNBY2NvdW50UGVybWlzc2lvbkdyYW50ZWQiLCJkb21haW5VcmwiLCJ3aW5kb3ciLCJhbGxBY2NvdW50c0ZvclJlcXVlc3RlZFZNIiwiRVZNIiwibGVuZ3RoIiwiaXNNYWxpY2lvdXNEQXBwIiwiaXNNaXNzaW5nQmxvY2thaWREYXRhIiwiRnJhZ21lbnQiLCJ3aWR0aCIsInB4IiwiY29sb3IiLCJ0ZXh0IiwicHJpbWFyeSIsImp1c3RpZnlDb250ZW50IiwicHkiLCJhbGlnbkl0ZW1zIiwidGl0bGUiLCJCTE9DS0FJRF9EQVBQX1NDQU5fV0FSTklORyIsIm0iLCJzcmMiLCJkb21haW5JY29uIiwic2Vjb25kYXJ5IiwidGV4dEFsaWduIiwiZG9tYWluTmFtZSIsIndvcmRXcmFwIiwib25TZWxlY3RlZEFjY291bnRDaGFuZ2VkIiwiYWNjIiwibWIiLCJwYXJhZ3JhcGgiLCJmbGV4RGlyZWN0aW9uIiwib25DbGljayIsImZ1bGxXaWR0aCIsImRpc2FibGVkIiwiaXNMb2FkaW5nIiwicHJvY2VlZExhYmVsIiwib3BlbiIsIm9uQ2xvc2UiLCJyZWplY3RMYWJlbCIsIkNoZWNrSWNvbiIsIlNrZWxldG9uIiwidXNlU2V0dGluZ3NDb250ZXh0IiwidHJ1bmNhdGVBZGRyZXNzIiwiZ2V0QWRkcmVzc0J5Vk1UeXBlIiwicmVuZGVyVmFsdWUiLCJ2bVR5cGUiLCJjb21wb25lbnQiLCJkaXNwbGF5IiwiZmxleCIsIm1pbldpZHRoIiwibm9XcmFwIiwibmFtZSIsImZsZXhTaHJpbmsiLCJwbCIsImlzQmFsYW5jZUxvYWRpbmciLCJzZXRJc0JhbGFuY2VMb2FkaW5nIiwidXBkYXRlQmFsYW5jZU9uTmV0d29ya3MiLCJjdXJyZW5jeSIsImN1cnJlbmN5Rm9ybWF0dGVyIiwiYWNjb3VudEJhbGFuY2UiLCJiYWxhbmNlU3VtIiwic3VtIiwiaGFzQWNjb3VudEJhbGFuY2UiLCJnZXRCYWxhbmNlIiwiZGVmYXVsdFZhbHVlIiwiZmluZCIsIm9uQ2hhbmdlIiwiZXYiLCJ0YXJnZXQiLCJ2YWx1ZSIsImxhYmVsIiwibWFwIiwia2V5Iiwic2VsZWN0ZWQiLCJyZXBsYWNlIiwiQWxlcnQiLCJBbGVydENvbnRlbnQiLCJSZW1vdmVNb2RlcmF0b3JJY29uIiwic2V2ZXJpdHkiLCJpY29uIiwiY29tbW9uIiwiYmxhY2siLCJib3JkZXJDb2xvciIsImZvbnRXZWlnaHQiLCJEaWFsb2ciLCJzaG93Q2xvc2VJY29uIiwicG9zaXRpb24iLCJjdXN0b21QYWxldHRlIiwiYXZhbGFuY2hlUmVkIiwiR3BwTWF5YmVJY29uIiwib2xkU2lnbmluZ0RhdGEiLCJuZXdTaWduaW5nRGF0YSIsImZpbHRlciIsImZpcnN0IiwiZnJvbUV2ZW50UGF0dGVybiIsIm1lcmdlIiwic3Vic2NyaXB0aW9uIiwiaGFuZGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicGlwZSIsImRvY3VtZW50IiwidmlzaWJpbGl0eVN0YXRlIiwic3Vic2NyaWJlIiwidW5zdWJzY3JpYmUiXSwic291cmNlUm9vdCI6IiJ9