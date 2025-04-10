"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_approval_ApprovalSection_tsx-src_pages_Send_Send_tsx"],{

/***/ "./src/components/common/NotSupportedByWallet.tsx":
/*!********************************************************!*\
  !*** ./src/components/common/NotSupportedByWallet.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NotSupportedByWallet": () => (/* binding */ NotSupportedByWallet)
/* harmony export */ });
/* harmony import */ var _PageTitle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _FunctionIsOffline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function NotSupportedByWallet({
  functionName,
  network,
  children
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const functionNameLabel = (0,_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_1__.getTranslatedFunctionName)(functionName) ?? t('This Feature');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitle, {
    variant: _PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitleVariant.PRIMARY
  }, functionNameLabel), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexGrow: 1,
      px: 4,
      alignContent: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body1",
    minHeight: 24,
    align: "center"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_4__.Trans, {
    i18nKey: "Sorry, {{functionName}} on<br/>{{network}} network<br/>is not supported by this account.",
    values: {
      functionName: functionNameLabel,
      network
    }
  })), children));
}

/***/ }),

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

/***/ "./src/hooks/useSetSendDataInParams.ts":
/*!*********************************************!*\
  !*** ./src/hooks/useSetSendDataInParams.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useSetSendDataInParams": () => (/* binding */ useSetSendDataInParams)
/* harmony export */ });
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");




function useSetSendDataInParams() {
  const {
    pathname
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__.useNetworkContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useHistory)();
  const setSendDataInParams = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(({
    token,
    address,
    options,
    amount
  }) => {
    const pushOrReplace = options?.replace ? history.replace : history.push;
    pushOrReplace({
      pathname: options?.path ?? pathname,
      search: `?${new URLSearchParams({
        tokenSymbol: token?.symbol || network?.networkToken.symbol || '',
        tokenAddress: token?.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC20 ? token?.address : '',
        amount: amount ?? '',
        address: address ?? ''
      }).toString()}`
    });
  }, [history, network?.networkToken.symbol, pathname]);
  return setSendDataInParams;
}

/***/ }),

/***/ "./src/pages/Send/Send.tsx":
/*!*********************************!*\
  !*** ./src/pages/Send/Send.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendPage": () => (/* binding */ SendPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useTokensWithBalances */ "./src/hooks/useTokensWithBalances.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _src_components_common_FunctionIsUnavailable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/common/FunctionIsUnavailable */ "./src/components/common/FunctionIsUnavailable.tsx");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/NetworkFeeProvider */ "./src/contexts/NetworkFeeProvider.tsx");
/* harmony import */ var _src_utils_network_getProviderForNetwork__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/utils/network/getProviderForNetwork */ "./src/utils/network/getProviderForNetwork.ts");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/SolanaVM/utils/solanaProvider.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/jsonRpcBatchProvider.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/providers/JsonRpcProvider.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/providers/BitcoinProvider.js");
/* harmony import */ var _components_SendEVM__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/SendEVM */ "./src/pages/Send/components/SendEVM.tsx");
/* harmony import */ var _src_utils_toastCardWithLink__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/utils/toastCardWithLink */ "./src/utils/toastCardWithLink.tsx");
/* harmony import */ var _src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/utils/getExplorerAddress */ "./src/utils/getExplorerAddress.ts");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _components_SendBTC__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/SendBTC */ "./src/pages/Send/components/SendBTC.tsx");
/* harmony import */ var _components_LoadingSendForm__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/LoadingSendForm */ "./src/pages/Send/components/LoadingSendForm.tsx");
/* harmony import */ var _components_SendPVM__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/SendPVM */ "./src/pages/Send/components/SendPVM.tsx");
/* harmony import */ var _components_SendAVM__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/SendAVM */ "./src/pages/Send/components/SendAVM.tsx");
/* harmony import */ var _hooks_useSend_models__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./hooks/useSend/models */ "./src/pages/Send/hooks/useSend/models.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _components_SendSVM__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/SendSVM */ "./src/pages/Send/components/SendSVM.tsx");
/* harmony import */ var _src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @src/utils/getAddressForChain */ "./src/utils/getAddressForChain.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



























function SendPage() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_22__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_23__.useHistory)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__.useNetworkContext)();
  const {
    networkFee
  } = (0,_src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_9__.useNetworkFeeContext)();
  const {
    accounts: {
      active
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_8__.useAccountsContext)();
  const {
    captureEncrypted
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const tokens = (0,_src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_2__.useTokensWithBalances)();
  const {
    isFunctionAvailable,
    isFunctionSupported
  } = (0,_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.useIsFunctionAvailable)(_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.FunctionNames.SEND);
  const nativeToken = tokens.find(({
    type
  }) => type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__.TokenType.NATIVE);
  const [provider, setProvider] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!network) {
      setProvider(undefined);
    } else {
      let isMounted = true;
      (0,_src_utils_network_getProviderForNetwork__WEBPACK_IMPORTED_MODULE_10__.getProviderForNetwork)(network).then(p => {
        if (isMounted) {
          setProvider(p);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [network]);
  const fromAddress = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_21__.getAddressForChain)(network, active), [active, network]);
  const onSuccess = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(txHash => {
    captureEncrypted('SendSuccessful', {
      address: fromAddress,
      txHash,
      chainId: network?.chainId
    });
    (0,_src_utils_toastCardWithLink__WEBPACK_IMPORTED_MODULE_12__.toastCardWithLink)({
      title: t('Send Successful'),
      url: (0,_src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_13__.getExplorerAddressByNetwork)(network, txHash),
      label: t('View in Explorer')
    });
    history.push('/home');
  }, [fromAddress, network, captureEncrypted, history, t]);
  const onFailure = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__["default"].error(t('Transaction Failed'));
    captureEncrypted('SendFailed', {
      address: fromAddress,
      chainId: network?.chainId
    });
  }, [captureEncrypted, fromAddress, network?.chainId, t]);
  const onApproved = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    captureEncrypted('SendApproved', {
      address: fromAddress,
      chainId: network?.chainId
    });
  }, [captureEncrypted, fromAddress, network?.chainId]);
  if (!isFunctionSupported) {
    return /*#__PURE__*/React.createElement(_src_components_common_FunctionIsUnavailable__WEBPACK_IMPORTED_MODULE_7__.FunctionIsUnavailable, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.FunctionNames.SEND,
      network: network?.chainName || 'Testnet'
    });
  }
  if (!isFunctionAvailable) {
    return /*#__PURE__*/React.createElement(_src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_4__.FunctionIsOffline, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.FunctionNames.SEND
    });
  }
  const isNetworkFeeReady = typeof networkFee?.low?.maxFeePerGas !== 'undefined';
  const isProviderReady = doesProviderMatchTheNetwork(network, provider);
  const isLoading = !active || !network || !fromAddress || !provider || !isNetworkFeeReady || !nativeToken || !isProviderReady;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Stack, {
    sx: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitle, null, t('Send')), isLoading && /*#__PURE__*/React.createElement(_components_LoadingSendForm__WEBPACK_IMPORTED_MODULE_15__.LoadingSendForm, null), !isLoading && network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.EVM && networkFee && /*#__PURE__*/React.createElement(_components_SendEVM__WEBPACK_IMPORTED_MODULE_11__.SendEVM, {
    network: network,
    fromAddress: fromAddress,
    maxFee: networkFee.low.maxFeePerGas,
    nativeToken: nativeToken,
    provider: provider,
    tokenList: tokens,
    onSuccess: onSuccess,
    onFailure: onFailure,
    onApproved: onApproved
  }), !isLoading && network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.BITCOIN && networkFee && /*#__PURE__*/React.createElement(_components_SendBTC__WEBPACK_IMPORTED_MODULE_14__.SendBTC, {
    network: network,
    fromAddress: fromAddress,
    maxFee: networkFee.low.maxFeePerGas,
    nativeToken: nativeToken,
    provider: provider,
    tokenList: tokens,
    onSuccess: onSuccess,
    onFailure: onFailure,
    onApproved: onApproved
  }), !isLoading && networkFee && network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.PVM && (0,_hooks_useSend_models__WEBPACK_IMPORTED_MODULE_18__.isPvmCapableAccount)(active) && /*#__PURE__*/React.createElement(_components_SendPVM__WEBPACK_IMPORTED_MODULE_16__.SendPVM, {
    network: network,
    fromAddress: fromAddress,
    maxFee: networkFee.low.maxFeePerGas,
    networkFee: networkFee,
    nativeToken: nativeToken,
    provider: provider,
    tokenList: tokens,
    account: active,
    onSuccess: onSuccess,
    onFailure: onFailure,
    onApproved: onApproved
  }), !isLoading && network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.AVM && (0,_hooks_useSend_models__WEBPACK_IMPORTED_MODULE_18__.isAvmCapableAccount)(active) && /*#__PURE__*/React.createElement(_components_SendAVM__WEBPACK_IMPORTED_MODULE_17__.SendAVM, {
    network: network,
    fromAddress: fromAddress,
    maxFee: provider.getContext().baseTxFee,
    nativeToken: nativeToken,
    provider: provider,
    tokenList: tokens,
    account: active,
    onSuccess: onSuccess,
    onFailure: onFailure,
    onApproved: onApproved
  }), !isLoading && network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.SVM && (0,_hooks_useSend_models__WEBPACK_IMPORTED_MODULE_18__.isSvmCapableAccount)(active) && /*#__PURE__*/React.createElement(_components_SendSVM__WEBPACK_IMPORTED_MODULE_20__.SendSVM, {
    network: network,
    fromAddress: fromAddress,
    maxFee: 0n // Irrelevant for Solana at the moment, since we're only using the fixed, base fee (no priority fees).
    ,
    nativeToken: nativeToken,
    provider: provider,
    tokenList: tokens,
    account: active,
    onSuccess: onSuccess,
    onFailure: onFailure,
    onApproved: onApproved
  }));
}

// Helper utility for checking if the provider network & provider match.
// This is useful, since updates of `network` and `provider` may come
// in different render runs, in which case we should still wait.
const doesProviderMatchTheNetwork = (network, provider) => {
  if (!network || !provider) {
    return false;
  }
  switch (network.vmName) {
    case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.SVM:
      return (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_27__.isSolanaProvider)(provider);
    case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.EVM:
      return provider instanceof _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_28__.JsonRpcBatchInternal;
    case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.AVM:
    case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.PVM:
      return provider instanceof _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_29__.JsonRpcProvider;
    case _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_26__.NetworkVMType.BITCOIN:
      return provider instanceof _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_30__.BitcoinProvider;
    default:
      return false;
  }
};

/***/ }),

/***/ "./src/pages/Send/components/SendAVM.tsx":
/*!***********************************************!*\
  !*** ./src/pages/Send/components/SendAVM.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendAVM": () => (/* binding */ SendAVM)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/handleTxOutcome */ "./src/utils/handleTxOutcome.ts");
/* harmony import */ var _SendForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SendForm */ "./src/pages/Send/components/SendForm.tsx");
/* harmony import */ var _src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useSetSendDataInParams */ "./src/hooks/useSetSendDataInParams.ts");
/* harmony import */ var _src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useQueryParams */ "./src/hooks/useQueryParams.ts");
/* harmony import */ var _src_components_common_NotSupportedByWallet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/NotSupportedByWallet */ "./src/components/common/NotSupportedByWallet.tsx");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _hooks_useSend__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../hooks/useSend */ "./src/pages/Send/hooks/useSend/index.ts");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");









const SendAVM = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  provider,
  tokenList,
  account,
  onSuccess,
  onFailure,
  onApproved
}) => {
  const setStateInParams = (0,_src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_3__.useSetSendDataInParams)();
  const params = (0,_src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_4__.useQueryParams)();
  const [address, setAddress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(params.get('address') ?? '');
  const [amount, setAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    error,
    isSending,
    isValid,
    isValidating,
    maxAmount,
    send,
    validate
  } = (0,_hooks_useSend__WEBPACK_IMPORTED_MODULE_7__.useAvmSend)({
    network,
    from: fromAddress,
    maxFee,
    provider,
    nativeToken,
    account
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    validate({
      address,
      token: nativeToken,
      amount
    });
    if (address) {
      setStateInParams({
        token: nativeToken,
        address,
        options: {
          replace: true
        }
      });
    }
  }, [address, amount, validate, setStateInParams, nativeToken, account]);
  const onSend = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!isValid) {
      return;
    }
    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError
    } = await (0,_src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_1__.handleTxOutcome)(send({
      address,
      token: nativeToken,
      amount
    }));
    if (isApproved) {
      onApproved();
      if (hasError) {
        onFailure(txError);
      } else {
        onSuccess(txHash);
      }
    }
  }, [address, amount, isValid, nativeToken, onApproved, onFailure, onSuccess, send]);
  const inputAmount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => amount ? (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_8__.stringToBigint)(amount, nativeToken?.decimals ?? 9) : undefined, [nativeToken, amount]);
  if (account && !account.addressAVM) {
    return /*#__PURE__*/React.createElement(_src_components_common_NotSupportedByWallet__WEBPACK_IMPORTED_MODULE_5__.NotSupportedByWallet, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.FunctionNames.TOKEN_DETAILS,
      network: network?.chainName || 'Testnet'
    });
  }
  return /*#__PURE__*/React.createElement(_SendForm__WEBPACK_IMPORTED_MODULE_2__.SendForm, {
    address: address,
    inputAmount: inputAmount,
    token: nativeToken,
    tokenList: tokenList,
    onContactChanged: contact => {
      setAddress(contact?.addressXP ?? '');
    },
    onAmountChanged: newAmount => setAmount(newAmount),
    onTokenChanged: () => {} // noop, AVAX has only one token
    ,
    isSending: isSending,
    isValid: isValid,
    isValidating: isValidating,
    error: error,
    maxAmount: maxAmount,
    onSend: onSend
  });
};

/***/ }),

/***/ "./src/pages/Send/components/SendBTC.tsx":
/*!***********************************************!*\
  !*** ./src/pages/Send/components/SendBTC.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendBTC": () => (/* binding */ SendBTC)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/handleTxOutcome */ "./src/utils/handleTxOutcome.ts");
/* harmony import */ var _src_utils_isBtcAddressInNetwork__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/isBtcAddressInNetwork */ "./src/utils/isBtcAddressInNetwork.ts");
/* harmony import */ var _hooks_useSend__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useSend */ "./src/pages/Send/hooks/useSend/index.ts");
/* harmony import */ var _hooks_useValidAddressFromParams__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useValidAddressFromParams */ "./src/pages/Send/hooks/useValidAddressFromParams.ts");
/* harmony import */ var _SendForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SendForm */ "./src/pages/Send/components/SendForm.tsx");
/* harmony import */ var _src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useSetSendDataInParams */ "./src/hooks/useSetSendDataInParams.ts");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








const SendBTC = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  provider,
  tokenList,
  onSuccess,
  onFailure,
  onApproved
}) => {
  const setStateInParams = (0,_src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_6__.useSetSendDataInParams)();
  const addressValidator = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(add => (0,_src_utils_isBtcAddressInNetwork__WEBPACK_IMPORTED_MODULE_2__.isBtcAddressInNetwork)(add, !network.isTestnet), [network.isTestnet]);
  const addressFromParams = (0,_hooks_useValidAddressFromParams__WEBPACK_IMPORTED_MODULE_4__.useValidAddressFromParams)(addressValidator);
  const [address, setAddress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(addressFromParams);
  const [amount, setAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    error,
    isSending,
    isValid,
    isValidating,
    maxAmount,
    send,
    validate
  } = (0,_hooks_useSend__WEBPACK_IMPORTED_MODULE_3__.useBtcSend)({
    isMainnet: !network.isTestnet,
    from: fromAddress,
    maxFee,
    provider,
    nativeToken
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!nativeToken) {
      return;
    }
    validate({
      address,
      amount
    });
    if (address) {
      setStateInParams({
        token: nativeToken,
        address,
        amount,
        options: {
          replace: true
        }
      });
    }
  }, [address, amount, validate, setStateInParams, nativeToken]);
  const onSend = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!isValid) {
      return;
    }
    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError
    } = await (0,_src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_1__.handleTxOutcome)(send({
      address,
      amount
    }));
    if (isApproved) {
      onApproved();
      if (hasError) {
        onFailure(txError);
      } else {
        onSuccess(txHash);
      }
    }
  }, [address, amount, isValid, onApproved, onFailure, onSuccess, send]);
  const inputAmount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => amount ? (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_7__.stringToBigint)(amount, nativeToken?.decimals ?? 8) : undefined, [nativeToken, amount]);
  return /*#__PURE__*/React.createElement(_SendForm__WEBPACK_IMPORTED_MODULE_5__.SendForm, {
    address: address,
    inputAmount: inputAmount,
    token: nativeToken,
    tokenList: tokenList,
    onContactChanged: contact => setAddress(contact?.addressBTC ?? ''),
    onAmountChanged: newAmount => setAmount(newAmount),
    onTokenChanged: () => {} // noop, BTC has only one token
    ,
    isSending: isSending,
    isValid: isValid,
    isValidating: isValidating,
    error: error,
    maxAmount: maxAmount,
    onSend: onSend
  });
};

/***/ }),

/***/ "./src/pages/Send/components/SendEVM.tsx":
/*!***********************************************!*\
  !*** ./src/pages/Send/components/SendEVM.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendEVM": () => (/* binding */ SendEVM)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useQueryParams */ "./src/hooks/useQueryParams.ts");
/* harmony import */ var _src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/isAddressValid */ "./src/utils/isAddressValid.ts");
/* harmony import */ var _src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/handleTxOutcome */ "./src/utils/handleTxOutcome.ts");
/* harmony import */ var _src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useSetSendDataInParams */ "./src/hooks/useSetSendDataInParams.ts");
/* harmony import */ var _hooks_useValidAddressFromParams__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hooks/useValidAddressFromParams */ "./src/pages/Send/hooks/useValidAddressFromParams.ts");
/* harmony import */ var _hooks_useSend__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../hooks/useSend */ "./src/pages/Send/hooks/useSend/index.ts");
/* harmony import */ var _SendForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./SendForm */ "./src/pages/Send/components/SendForm.tsx");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










const SendEVM = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  provider,
  tokenList,
  onSuccess,
  onFailure,
  onApproved
}) => {
  const setStateInParams = (0,_src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_4__.useSetSendDataInParams)();
  const params = (0,_src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_1__.useQueryParams)();
  const tokenFromParams = tokenList.find(t => {
    if (t.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_8__.TokenType.ERC20) {
      return t.address === params.get('tokenAddress');
    } else if (t.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_8__.TokenType.NATIVE) {
      return t.symbol === params.get('tokenSymbol');
    }
  });
  const addressFromParams = (0,_hooks_useValidAddressFromParams__WEBPACK_IMPORTED_MODULE_5__.useValidAddressFromParams)(_src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_2__.isValidAddress);
  const [address, setAddress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(addressFromParams);
  const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(tokenFromParams);
  const [amount, setAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(params.get('amount') ?? '');
  const {
    error,
    isSending,
    isValid,
    isValidating,
    maxAmount,
    send,
    validate
  } = (0,_hooks_useSend__WEBPACK_IMPORTED_MODULE_6__.useEVMSend)({
    chainId: `0x${network.chainId.toString(16)}`,
    from: fromAddress,
    maxFee,
    nativeToken,
    provider
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    validate({
      address,
      token,
      amount
    });
    if (address || token || amount) {
      setStateInParams({
        address,
        token,
        amount,
        options: {
          replace: true
        }
      });
    }
  }, [address, amount, token, validate, setStateInParams]);
  const onSend = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!isValid) {
      return;
    }
    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError
    } = await (0,_src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_3__.handleTxOutcome)(send({
      address,
      token,
      amount
    }));
    if (isApproved) {
      onApproved();
      if (hasError) {
        onFailure(txError);
      } else {
        onSuccess(txHash);
      }
    }
  }, [address, amount, isValid, onApproved, onFailure, onSuccess, send, token]);
  const inputAmount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => amount ? (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_9__.stringToBigint)(amount, token?.decimals ?? 18) : undefined, [token, amount]);
  return /*#__PURE__*/React.createElement(_SendForm__WEBPACK_IMPORTED_MODULE_7__.SendForm, {
    address: address,
    inputAmount: inputAmount,
    token: token,
    tokenList: tokenList,
    onContactChanged: contact => setAddress(contact?.address ?? ''),
    onAmountChanged: newAmount => setAmount(newAmount),
    onTokenChanged: newToken => setToken(newToken),
    isSending: isSending,
    isValid: isValid,
    isValidating: isValidating,
    error: error,
    maxAmount: maxAmount,
    onSend: onSend
  });
};

/***/ }),

/***/ "./src/pages/Send/components/SendForm.tsx":
/*!************************************************!*\
  !*** ./src/pages/Send/components/SendForm.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendForm": () => (/* binding */ SendForm)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_TokenSelect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/TokenSelect */ "./src/components/common/TokenSelect.tsx");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_hooks_useSendAnalyticsData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useSendAnalyticsData */ "./src/hooks/useSendAnalyticsData.ts");
/* harmony import */ var _ContactInput__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ContactInput */ "./src/pages/Send/components/ContactInput.tsx");
/* harmony import */ var _hooks_useIdentifyAddress__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../hooks/useIdentifyAddress */ "./src/pages/Send/hooks/useIdentifyAddress.ts");
/* harmony import */ var _utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/sendErrorMessages */ "./src/pages/Send/utils/sendErrorMessages.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










const generalErrors = [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE, _src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.EXCESSIVE_NETWORK_FEE, _src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INVALID_NETWORK_FEE, _src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.UNABLE_TO_FETCH_UTXOS];
const errorsToExcludeForTokenSelect = [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.ADDRESS_REQUIRED, _src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INVALID_ADDRESS, ...generalErrors];
const FlexScrollbars = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Scrollbars)`
	> div {
		display: flex;
	}
}`;
const SendForm = ({
  address,
  inputAmount,
  token,
  isValid,
  isValidating,
  isSending,
  minAmount,
  maxAmount,
  error,
  onAmountChanged,
  onContactChanged,
  onTokenChanged,
  onSend,
  tokenList,
  children
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const identifyAddress = (0,_hooks_useIdentifyAddress__WEBPACK_IMPORTED_MODULE_6__.useIdentifyAddress)();
  const contact = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => address ? identifyAddress(address) : undefined, [address, identifyAddress]);
  const [isContactsOpen, setIsContactsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isTokenSelectOpen, setIsTokenSelectOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const {
    sendTokenSelectedAnalytics,
    sendAmountEnteredAnalytics
  } = (0,_src_hooks_useSendAnalyticsData__WEBPACK_IMPORTED_MODULE_4__.useSendAnalyticsData)();
  const formRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      flexGrow: 1,
      alignItems: 'center',
      width: '100%',
      pt: 1
    }
  }, /*#__PURE__*/React.createElement(FlexScrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    ref: formRef,
    sx: {
      display: 'flex',
      flexGrow: 1,
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_ContactInput__WEBPACK_IMPORTED_MODULE_5__.ContactInput, {
    contact: contact,
    onChange: (newContact, tab) => {
      onContactChanged(newContact);
      capture('SendContactSelected', {
        contactSource: tab
      });
    },
    isContactsOpen: isContactsOpen,
    setIsOpen: open => setIsContactsOpen(open),
    containerRef: formRef
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      pl: 2,
      mt: 0.5,
      width: '100%',
      height: 2
    }
  }, (error === _src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.ADDRESS_REQUIRED || error === _src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INVALID_ADDRESS) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption",
    sx: {
      color: theme => theme.palette.error.main
    }
  }, (0,_utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_7__.getSendErrorMessage)(error))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      py: 0,
      px: 2,
      mt: 4,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenSelect__WEBPACK_IMPORTED_MODULE_1__.TokenSelect, {
    maxAmount: maxAmount ? BigInt(maxAmount) : undefined,
    tokensList: tokenList,
    selectedToken: token,
    onTokenChange: newToken => {
      onTokenChanged(newToken);
      sendTokenSelectedAnalytics('Send');
    },
    inputAmount: inputAmount,
    onInputAmountChange: ({
      amount: newAmount
    }) => {
      onAmountChanged(newAmount);
      sendAmountEnteredAnalytics('Send');
    },
    onSelectToggle: () => {
      setIsTokenSelectOpen(open => !open);
    },
    isOpen: isTokenSelectOpen,
    error: error && (errorsToExcludeForTokenSelect.includes(error) ? undefined : (0,_utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_7__.getSendErrorMessage)(error, {
      minAmount
    })),
    setIsOpen: open => setIsTokenSelectOpen(open)
  })), children, error && generalErrors.includes(error) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      py: 0,
      px: 2,
      mt: 2,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption",
    color: "error.main"
  }, (0,_utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_7__.getSendErrorMessage)(error, {
    minAmount
  }))))), !isContactsOpen && !isTokenSelectOpen && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      pt: 3,
      px: 2,
      pb: 3,
      width: '100%',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Tooltip, {
    placement: "top",
    sx: {
      width: '100%'
    },
    title: error ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
      variant: "body2"
    }, (0,_utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_7__.getSendErrorMessage)(error, {
      minAmount
    })) : ''
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    "data-testid": "send-next-button",
    variant: "contained",
    size: "large",
    onClick: onSend,
    disabled: isValidating || !isValid || isSending,
    isLoading: isSending,
    fullWidth: true
  }, t('Next')))));
};

/***/ }),

/***/ "./src/pages/Send/components/SendPVM.tsx":
/*!***********************************************!*\
  !*** ./src/pages/Send/components/SendPVM.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendPVM": () => (/* binding */ SendPVM)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/handleTxOutcome */ "./src/utils/handleTxOutcome.ts");
/* harmony import */ var _SendForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SendForm */ "./src/pages/Send/components/SendForm.tsx");
/* harmony import */ var _src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useSetSendDataInParams */ "./src/hooks/useSetSendDataInParams.ts");
/* harmony import */ var _src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useQueryParams */ "./src/hooks/useQueryParams.ts");
/* harmony import */ var _hooks_useSend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hooks/useSend */ "./src/pages/Send/hooks/useSend/index.ts");
/* harmony import */ var _src_components_common_NotSupportedByWallet__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/NotSupportedByWallet */ "./src/components/common/NotSupportedByWallet.tsx");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");
/* harmony import */ var _src_components_common_CustomFees__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/components/common/CustomFees */ "./src/components/common/CustomFees.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");











const SendPVM = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  networkFee,
  provider,
  tokenList,
  account,
  onSuccess,
  onFailure,
  onApproved
}) => {
  const setStateInParams = (0,_src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_3__.useSetSendDataInParams)();
  const params = (0,_src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_4__.useQueryParams)();
  const [address, setAddress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(params.get('address') ?? '');
  const [amount, setAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [gasPrice, setGasPrice] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(networkFee.low.maxFeePerGas);
  const {
    error,
    isSending,
    isValid,
    isValidating,
    maxAmount,
    send,
    validate,
    estimatedFee
  } = (0,_hooks_useSend__WEBPACK_IMPORTED_MODULE_5__.usePvmSend)({
    network,
    from: fromAddress,
    maxFee,
    provider,
    nativeToken,
    account
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    validate({
      address,
      amount,
      gasPrice,
      token: nativeToken
    });
    if (address || amount) {
      setStateInParams({
        address,
        token: nativeToken,
        amount,
        options: {
          replace: true
        }
      });
    }
  }, [address, amount, validate, setStateInParams, nativeToken, account, tokenList, gasPrice]);
  const onSend = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!isValid) {
      return;
    }
    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError
    } = await (0,_src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_1__.handleTxOutcome)(send({
      address,
      amount,
      gasPrice,
      token: nativeToken
    }));
    if (isApproved) {
      onApproved();
      if (hasError) {
        onFailure(txError);
      } else {
        onSuccess(txHash);
      }
    }
  }, [address, amount, isValid, onApproved, onFailure, onSuccess, send, gasPrice, nativeToken]);
  const inputAmount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => amount ? (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_8__.stringToBigint)(amount, nativeToken?.decimals ?? 18) : undefined, [nativeToken, amount]);
  const onFeeCustomized = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(values => {
    setGasPrice(values.maxFeePerGas);
  }, []);
  if (account && !account.addressPVM) {
    return /*#__PURE__*/React.createElement(_src_components_common_NotSupportedByWallet__WEBPACK_IMPORTED_MODULE_6__.NotSupportedByWallet, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_7__.FunctionNames.TOKEN_DETAILS,
      network: network?.chainName || 'Testnet'
    });
  }
  return /*#__PURE__*/React.createElement(_SendForm__WEBPACK_IMPORTED_MODULE_2__.SendForm, {
    address: address,
    inputAmount: inputAmount,
    token: nativeToken,
    tokenList: tokenList,
    onContactChanged: contact => {
      setAddress(contact?.addressXP ?? '');
    },
    onAmountChanged: newAmount => setAmount(newAmount),
    onTokenChanged: () => {} // noop, AVAX has only one token
    ,
    isSending: isSending,
    isValid: isValid,
    isValidating: isValidating,
    error: error,
    maxAmount: maxAmount,
    onSend: onSend
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Grow, {
    in: Boolean(estimatedFee),
    mountOnEnter: true,
    unmountOnExit: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      py: 0,
      px: 2,
      mt: 2,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_CustomFees__WEBPACK_IMPORTED_MODULE_9__.CustomFees, {
    isCollapsible: true,
    network: network,
    networkFee: networkFee,
    maxFeePerGas: gasPrice,
    maxGasPrice: (networkFee.baseFee ?? 0n) * 2n,
    estimatedFee: estimatedFee,
    limit: 0,
    onChange: onFeeCustomized
  }))));
};

/***/ }),

/***/ "./src/pages/Send/components/SendSVM.tsx":
/*!***********************************************!*\
  !*** ./src/pages/Send/components/SendSVM.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendSVM": () => (/* binding */ SendSVM)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/handleTxOutcome */ "./src/utils/handleTxOutcome.ts");
/* harmony import */ var _SendForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SendForm */ "./src/pages/Send/components/SendForm.tsx");
/* harmony import */ var _src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useSetSendDataInParams */ "./src/hooks/useSetSendDataInParams.ts");
/* harmony import */ var _src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useQueryParams */ "./src/hooks/useQueryParams.ts");
/* harmony import */ var _src_components_common_NotSupportedByWallet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/NotSupportedByWallet */ "./src/components/common/NotSupportedByWallet.tsx");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");
/* harmony import */ var _hooks_useSend_useSVMSend__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../hooks/useSend/useSVMSend */ "./src/pages/Send/hooks/useSend/useSVMSend.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










const SendSVM = ({
  network,
  fromAddress,
  maxFee,
  nativeToken,
  provider,
  tokenList,
  account,
  onSuccess,
  onFailure,
  onApproved
}) => {
  const setStateInParams = (0,_src_hooks_useSetSendDataInParams__WEBPACK_IMPORTED_MODULE_3__.useSetSendDataInParams)();
  const params = (0,_src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_4__.useQueryParams)();
  const tokenFromParams = tokenList.find(t => {
    if (t.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_7__.TokenType.SPL) {
      return t.address === params.get('tokenAddress');
    } else if (t.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_7__.TokenType.NATIVE) {
      return t.symbol === params.get('tokenSymbol');
    }
  });
  const [address, setAddress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(params.get('address') ?? '');
  const [amount, setAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(params.get('amount') ?? '');
  const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(tokenFromParams);
  const {
    error,
    isSending,
    isValid,
    isValidating,
    minAmount,
    maxAmount,
    send,
    validate
  } = (0,_hooks_useSend_useSVMSend__WEBPACK_IMPORTED_MODULE_9__.useSvmSend)({
    from: fromAddress,
    maxFee,
    provider,
    nativeToken,
    account
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    validate({
      address,
      amount,
      token
    });
    if (address || amount || token) {
      setStateInParams({
        address,
        token,
        amount,
        options: {
          replace: true
        }
      });
    }
  }, [address, amount, validate, setStateInParams, account, token, tokenList]);
  const onSend = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!isValid) {
      return;
    }
    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError
    } = await (0,_src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_1__.handleTxOutcome)(send({
      address,
      amount,
      token
    }));
    if (isApproved) {
      onApproved();
      if (hasError) {
        onFailure(txError);
      } else {
        onSuccess(txHash);
      }
    }
  }, [address, amount, isValid, onApproved, onFailure, onSuccess, send, token]);
  const inputAmount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => amount ? (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_8__.stringToBigint)(amount, token?.decimals ?? 9) : undefined, [token?.decimals, amount]);
  if (account && !account.addressSVM) {
    return /*#__PURE__*/React.createElement(_src_components_common_NotSupportedByWallet__WEBPACK_IMPORTED_MODULE_5__.NotSupportedByWallet, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.FunctionNames.TOKEN_DETAILS,
      network: network?.chainName || 'Testnet'
    });
  }
  return /*#__PURE__*/React.createElement(_SendForm__WEBPACK_IMPORTED_MODULE_2__.SendForm, {
    address: address,
    inputAmount: inputAmount,
    token: token,
    tokenList: tokenList,
    onContactChanged: contact => {
      setAddress(contact?.addressSVM ?? '');
    },
    onAmountChanged: newAmount => setAmount(newAmount),
    onTokenChanged: newToken => setToken(newToken),
    isSending: isSending,
    isValid: isValid,
    isValidating: isValidating,
    error: error,
    minAmount: minAmount,
    maxAmount: maxAmount,
    onSend: onSend
  });
};

/***/ }),

/***/ "./src/pages/Send/hooks/useSend/index.ts":
/*!***********************************************!*\
  !*** ./src/pages/Send/hooks/useSend/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isAvmCapableAccount": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_0__.isAvmCapableAccount),
/* harmony export */   "isPvmCapableAccount": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_0__.isPvmCapableAccount),
/* harmony export */   "isSvmCapableAccount": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_0__.isSvmCapableAccount),
/* harmony export */   "useAvmSend": () => (/* reexport safe */ _useAVMSend__WEBPACK_IMPORTED_MODULE_1__.useAvmSend),
/* harmony export */   "useBtcSend": () => (/* reexport safe */ _useBTCSend__WEBPACK_IMPORTED_MODULE_4__.useBtcSend),
/* harmony export */   "useEVMSend": () => (/* reexport safe */ _useEVMSend__WEBPACK_IMPORTED_MODULE_2__.useEVMSend),
/* harmony export */   "usePvmSend": () => (/* reexport safe */ _usePVMSend__WEBPACK_IMPORTED_MODULE_3__.usePvmSend)
/* harmony export */ });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ "./src/pages/Send/hooks/useSend/models.ts");
/* harmony import */ var _useAVMSend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useAVMSend */ "./src/pages/Send/hooks/useSend/useAVMSend.ts");
/* harmony import */ var _useEVMSend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useEVMSend */ "./src/pages/Send/hooks/useSend/useEVMSend.ts");
/* harmony import */ var _usePVMSend__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./usePVMSend */ "./src/pages/Send/hooks/useSend/usePVMSend.ts");
/* harmony import */ var _useBTCSend__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./useBTCSend */ "./src/pages/Send/hooks/useSend/useBTCSend.ts");






/***/ }),

/***/ "./src/pages/Send/hooks/useSend/models.ts":
/*!************************************************!*\
  !*** ./src/pages/Send/hooks/useSend/models.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isAvmCapableAccount": () => (/* binding */ isAvmCapableAccount),
/* harmony export */   "isPvmCapableAccount": () => (/* binding */ isPvmCapableAccount),
/* harmony export */   "isSvmCapableAccount": () => (/* binding */ isSvmCapableAccount)
/* harmony export */ });
const isAvmCapableAccount = account => Boolean(account && account.addressAVM && account.addressCoreEth);
const isPvmCapableAccount = account => Boolean(account && account.addressPVM && account.addressCoreEth);
const isSvmCapableAccount = account => Boolean(account && account.addressSVM);

/***/ }),

/***/ "./src/pages/Send/hooks/useSend/useAVMSend.ts":
/*!****************************************************!*\
  !*** ./src/pages/Send/hooks/useSend/useAVMSend.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useAvmSend": () => (/* binding */ useAvmSend)
/* harmony export */ });
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/wallets/AddressWallet.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/promiseResolver.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bigToBigInt.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");
/* harmony import */ var _src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/isAddressValid */ "./src/utils/isAddressValid.ts");
/* harmony import */ var _src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/utils/stripAddressPrefix */ "./src/utils/stripAddressPrefix.ts");
/* harmony import */ var _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/connections/dAppConnection/models */ "./src/background/connections/dAppConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _utils_getMaxUtxos__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../utils/getMaxUtxos */ "./src/pages/Send/utils/getMaxUtxos.ts");
/* harmony import */ var _utils_correctAddressByPrefix__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/correctAddressByPrefix */ "./src/pages/Send/utils/correctAddressByPrefix.ts");
/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js")["Buffer"];















const XCHAIN_ALIAS = 'X';
const useAvmSend = ({
  network,
  provider,
  account,
  maxFee
}) => {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_8__.useConnectionContext)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_9__.useFeatureFlagContext)();
  const {
    isLedgerWallet
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_3__.useWalletContext)();
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const [isValidating, setIsValidating] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isSending, setIsSending] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [maxAmount, setMaxAmount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('0');
  const wallet = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    return new _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_12__.AddressWallet(account.addressC, (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_6__.stripAddressPrefix)(account.addressCoreEth), [(0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_6__.stripAddressPrefix)(account.addressAVM)], (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_6__.stripAddressPrefix)(account.addressAVM), provider);
  }, [account, provider]);
  const checkFunctionAvailability = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    if (!featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_2__.FeatureGates.SEND_X_CHAIN]) {
      return _src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__.SendErrorMessage.SEND_NOT_AVAILABLE;
    }
  }, [featureFlags]);
  function setErrorAndEndValidating(message) {
    setError(message);
    setIsValidating(false);
  }
  const validate = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async options => {
    const {
      address,
      token,
      amount
    } = options;
    const amountToUse = amount ? amount : '0';
    setIsValidating(true);
    setError(undefined);
    const errorReason = checkFunctionAvailability();
    if (errorReason) {
      return setErrorAndEndValidating(errorReason);
    }

    // using filtered UTXOs because there is size limit
    const [utxos, utxosError] = await (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_13__.resolve)((0,_utils_getMaxUtxos__WEBPACK_IMPORTED_MODULE_10__.getMaxUtxoSet)(isLedgerWallet, provider, wallet, network));
    if (utxosError) {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__.SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
    }

    // maxMount calculation
    const available = utxos?.balance.available ?? BigInt(0);
    const maxAvailable = available - maxFee;
    const amountBigInt = (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_14__.bigToBigInt)(big_js__WEBPACK_IMPORTED_MODULE_0___default()(amountToUse), token.decimals);
    const mavValue = maxAvailable.toString();
    setMaxAmount(mavValue);
    if (!address) {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__.SendErrorMessage.ADDRESS_REQUIRED);
    }
    if (!(0,_src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_5__.isValidAvmAddress)(address)) {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__.SendErrorMessage.INVALID_ADDRESS);
    }
    if (!amount || amount === '0') {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__.SendErrorMessage.AMOUNT_REQUIRED);
    }
    if (maxAvailable < BigInt(0) || amountBigInt > maxAvailable) {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__.SendErrorMessage.INSUFFICIENT_BALANCE);
    }
    setError(undefined);
    setIsValidating(false);
  }, [checkFunctionAvailability, isLedgerWallet, maxFee, network, provider, wallet]);
  const send = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async ({
    address,
    token,
    amount
  }) => {
    checkFunctionAvailability();
    setIsSending(true);
    try {
      const utxos = await (0,_utils_getMaxUtxos__WEBPACK_IMPORTED_MODULE_10__.getMaxUtxoSet)(isLedgerWallet, provider, wallet, network);
      const avax = provider.getAvaxID();
      const amountBigInt = (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_14__.bigToBigInt)(big_js__WEBPACK_IMPORTED_MODULE_0___default()(amount), token.decimals);
      const changeAddress = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_15__.utils.parse(account.addressAVM)[2];
      const unsignedTx = wallet.baseTX({
        utxoSet: utxos.utxos,
        chain: XCHAIN_ALIAS,
        toAddress: (0,_utils_correctAddressByPrefix__WEBPACK_IMPORTED_MODULE_11__.correctAddressByPrefix)(address, 'X-'),
        amountsPerAsset: {
          [avax]: amountBigInt
        },
        options: {
          changeAddresses: [changeAddress]
        }
      });
      const manager = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_15__.utils.getManagerForVM(unsignedTx.getVM());
      const [codec] = manager.getCodecFromBuffer(unsignedTx.toBytes());
      const params = {
        transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
        chainAlias: XCHAIN_ALIAS,
        utxos: unsignedTx.utxos.map(utxo => _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_15__.utils.bufferToHex(utxo.toBytes(codec)))
      };
      return await request({
        method: _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_7__.DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
        params
      });
    } finally {
      setIsSending(false);
    }
  }, [account, checkFunctionAvailability, isLedgerWallet, network, provider, request, wallet]);
  return {
    error,
    isSending,
    isValid: !error,
    isValidating,
    maxAmount,
    send,
    validate
  };
};

/***/ }),

/***/ "./src/pages/Send/hooks/useSend/useBTCSend.ts":
/*!****************************************************!*\
  !*** ./src/pages/Send/hooks/useSend/useBTCSend.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useBtcSend": () => (/* binding */ useBtcSend)
/* harmony export */ });
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/stringToBN.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/utils/getMaxTransferAmount.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_utils_send_btcSendUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/send/btcSendUtils */ "./src/utils/send/btcSendUtils.ts");







const useBtcSend = ({
  isMainnet,
  from,
  provider,
  maxFee,
  nativeToken
}) => {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_3__.useConnectionContext)();
  const [isSending, setIsSending] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isValidating, setIsValidating] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [utxos, setUtxos] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [maxAmount, setMaxAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('0');
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let isMounted = true;
    (0,_src_utils_send_btcSendUtils__WEBPACK_IMPORTED_MODULE_4__.getBtcInputUtxos)(provider, nativeToken, Number(maxFee)).then(_utxos => {
      if (isMounted) {
        setUtxos(_utxos);
      }
    }).catch(() => {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
    });
    return () => {
      isMounted = false;
    };
  }, [provider, nativeToken, maxFee]);
  const validate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async options => {
    const {
      address,
      amount
    } = options;
    setIsValidating(true);
    setError(undefined);
    try {
      const amountBN = (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__.stringToBN)(amount || '0', nativeToken.decimals);
      const amountInSatoshis = amountBN.toNumber();
      const maxTransferAmount = Math.max((0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_6__.getMaxTransferAmount)(utxos, address, from, Number(maxFee)), 0);
      setMaxAmount(maxTransferAmount.toString());
      const validationError = (0,_src_utils_send_btcSendUtils__WEBPACK_IMPORTED_MODULE_4__.validateBtcSend)(from, {
        address,
        amount: amountInSatoshis,
        feeRate: Number(maxFee),
        token: nativeToken
      }, utxos, isMainnet);
      if (validationError) {
        setError(validationError);
        return;
      } else {
        setError(undefined);
      }
    } finally {
      setIsValidating(false);
    }
  }, [utxos, maxFee, from, isMainnet, nativeToken]);
  const send = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async ({
    address,
    amount
  }) => {
    setIsSending(true);
    try {
      const amountBN = (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__.stringToBN)(amount || '0', nativeToken.decimals);
      const amountInSatoshis = amountBN.toNumber();
      return await request({
        method: _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.BITCOIN_SEND_TRANSACTION,
        params: {
          from,
          to: address,
          amount: amountInSatoshis,
          feeRate: Number(maxFee)
        }
      });
    } finally {
      setIsSending(false);
    }
  }, [from, maxFee, nativeToken.decimals, request]);
  return {
    error,
    isSending,
    isValid: !error,
    isValidating,
    maxAmount,
    send,
    validate
  };
};

/***/ }),

/***/ "./src/pages/Send/hooks/useSend/usePVMSend.ts":
/*!****************************************************!*\
  !*** ./src/pages/Send/hooks/useSend/usePVMSend.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "usePvmSend": () => (/* binding */ usePvmSend)
/* harmony export */ });
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/wallets/AddressWallet.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/utils/parseAvalancheTx.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bigToBigInt.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_utils_promiseResolver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/promiseResolver */ "./src/utils/promiseResolver.ts");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");
/* harmony import */ var _src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/utils/isAddressValid */ "./src/utils/isAddressValid.ts");
/* harmony import */ var _src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/utils/stripAddressPrefix */ "./src/utils/stripAddressPrefix.ts");
/* harmony import */ var _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/background/connections/dAppConnection/models */ "./src/background/connections/dAppConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _utils_getMaxUtxos__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/getMaxUtxos */ "./src/pages/Send/utils/getMaxUtxos.ts");
/* harmony import */ var _utils_correctAddressByPrefix__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../utils/correctAddressByPrefix */ "./src/pages/Send/utils/correctAddressByPrefix.ts");
/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js")["Buffer"];
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
















const PCHAIN_ALIAS = 'P';
const usePvmSend = ({
  network,
  provider,
  account,
  maxFee
}) => {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_9__.useConnectionContext)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_10__.useFeatureFlagContext)();
  const {
    isLedgerWallet
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_4__.useWalletContext)();
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const [isValidating, setIsValidating] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isSending, setIsSending] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [maxAmount, setMaxAmount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('0');
  const [estimatedFee, setEstimatedFee] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0n);
  const [feeState, setFeeState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const [utxoSet, setUtxoSet] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const wallet = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    return new _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_13__.AddressWallet(account.addressC, (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_7__.stripAddressPrefix)(account.addressCoreEth), [(0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_7__.stripAddressPrefix)(account.addressPVM)], (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_7__.stripAddressPrefix)(account.addressPVM), provider);
  }, [account, provider]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    let isMounted = true;
    wallet.getUTXOs('P').then(u => {
      if (!isMounted) {
        return;
      }
      setUtxoSet(u);
    }).catch(() => {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
    });
    return () => {
      isMounted = false;
    };
  }, [wallet]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    let isMounted = true;
    provider.getApiP().getFeeState().then(state => {
      if (!isMounted) {
        return;
      }
      setFeeState(state);
    }).catch(() => {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.INVALID_NETWORK_FEE);
    });
    return () => {
      isMounted = false;
    };
  }, [provider]);
  const checkFunctionAvailability = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    if (!featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_3__.FeatureGates.SEND_P_CHAIN]) {
      return _src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.SEND_NOT_AVAILABLE;
    }
  }, [featureFlags]);
  function setErrorAndEndValidating(message) {
    setError(message);
    setIsValidating(false);
  }
  const getFeeState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(gasPrice => {
    if (!gasPrice || !feeState) {
      return feeState;
    }
    return {
      ...feeState,
      price: gasPrice
    };
  }, [feeState]);
  const buildTransaction = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async ({
    address,
    amount,
    gasPrice,
    token
  }) => {
    const avax = provider.getAvaxID();
    const amountBigInt = (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_14__.bigToBigInt)(big_js__WEBPACK_IMPORTED_MODULE_0___default()(amount), token.decimals);
    const changeAddress = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_15__.utils.parse(account.addressPVM)[2];
    const {
      utxos
    } = await (0,_utils_getMaxUtxos__WEBPACK_IMPORTED_MODULE_11__.getMaxUtxoSet)(isLedgerWallet, provider, wallet, network, getFeeState(gasPrice), utxoSet);
    return wallet.baseTX({
      utxoSet: utxos,
      chain: PCHAIN_ALIAS,
      toAddress: (0,_utils_correctAddressByPrefix__WEBPACK_IMPORTED_MODULE_12__.correctAddressByPrefix)(address, 'P-'),
      amountsPerAsset: {
        [avax]: amountBigInt
      },
      options: {
        changeAddresses: [changeAddress]
      },
      feeState: feeState && gasPrice ? {
        ...feeState,
        price: gasPrice
      } : feeState
    });
  }, [account.addressPVM, provider, wallet, feeState, isLedgerWallet, network, getFeeState, utxoSet]);
  const parseTx = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async ({
    address,
    amount,
    gasPrice,
    token
  }) => {
    const unsignedTx = await buildTransaction({
      address,
      amount,
      gasPrice,
      token
    });
    const feeTolerance = getFeeTolerance(gasPrice, feeState);
    const parsedTx = await _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_16__.parseAvalancheTx(unsignedTx, provider, account.addressPVM, {
      feeTolerance
    });
    return parsedTx;
  }, [buildTransaction, provider, account.addressPVM, feeState]);
  const validate = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async options => {
    const {
      address,
      amount,
      gasPrice,
      token
    } = options;
    const amountToUse = amount ? amount : '0';
    setIsValidating(true);
    setError(undefined);
    const errorReason = checkFunctionAvailability();
    if (errorReason) {
      return setErrorAndEndValidating(errorReason);
    }
    if (typeof gasPrice === 'bigint' && feeState) {
      if (feeState.price > gasPrice) {
        return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.INVALID_NETWORK_FEE);
      } else if (gasPrice > feeState.price * 2n) {
        return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.EXCESSIVE_NETWORK_FEE);
      }
    }
    if (!feeState) {
      // Fee state has not been fetched yet, we can't proceed with other validations.
      // If there is an error with fetching the fee state when it's required,
      // that error is captured outside of the validate() function.
      return;
    }

    // using filtered UTXOs because there is size limit
    const [utxos, utxosError] = await (0,_src_utils_promiseResolver__WEBPACK_IMPORTED_MODULE_2__.resolve)((0,_utils_getMaxUtxos__WEBPACK_IMPORTED_MODULE_11__.getMaxUtxoSet)(isLedgerWallet, provider, wallet, network, getFeeState(gasPrice), utxoSet));
    if (utxosError) {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
    }
    const amountBigInt = (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_14__.bigToBigInt)(big_js__WEBPACK_IMPORTED_MODULE_0___default()(amountToUse), token.decimals);
    // maxMount calculation
    const available = utxos?.balance.available ?? BigInt(0);
    const maxAvailable = available - maxFee;
    setMaxAmount(maxAvailable.toString());
    if (!address) {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.ADDRESS_REQUIRED);
    }
    if (!(0,_src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_6__.isValidPvmAddress)(address)) {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.INVALID_ADDRESS);
    }
    if (!amount || amount === '0') {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.AMOUNT_REQUIRED);
    }
    if (maxAvailable < BigInt(0) || amountBigInt > maxAvailable) {
      return setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.INSUFFICIENT_BALANCE);
    }
    setIsValidating(false);
    setError(undefined);
    const parsedTx = await parseTx({
      address,
      amount,
      gasPrice,
      token
    });
    setEstimatedFee(parsedTx.txFee);
  }, [checkFunctionAvailability, isLedgerWallet, maxFee, network, provider, wallet, getFeeState, parseTx, feeState, utxoSet]);
  const send = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async ({
    address,
    amount,
    gasPrice,
    token
  }) => {
    checkFunctionAvailability();
    setIsSending(true);
    try {
      const unsignedTx = await buildTransaction({
        address,
        amount,
        token,
        gasPrice
      });
      const manager = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_15__.utils.getManagerForVM(unsignedTx.getVM());
      const [codec] = manager.getCodecFromBuffer(unsignedTx.toBytes());
      const feeTolerance = getFeeTolerance(gasPrice, feeState);
      const params = {
        transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
        chainAlias: PCHAIN_ALIAS,
        utxos: unsignedTx.utxos.map(utxo => _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_15__.utils.bufferToHex(utxo.toBytes(codec))),
        feeTolerance
      };
      return await request({
        method: _src_background_connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_8__.DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
        params
      });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [buildTransaction, checkFunctionAvailability, request, feeState]);
  return {
    error,
    isSending,
    isValid: !isValidating && !error,
    isValidating,
    maxAmount,
    send,
    validate,
    estimatedFee
  };
};
const getFeeTolerance = (chosenGasPrice, feeState) => {
  if (!chosenGasPrice || !feeState) {
    return;
  }
  const marketGasPrice = feeState.price;
  // Technically this should never be negative, but let's safe-guard
  const difference = Math.abs(Number(chosenGasPrice - marketGasPrice));

  // Cap between 1 and 100
  return Math.min(100, Math.max(1, Math.ceil(difference / Number(marketGasPrice) * 100)));
};

/***/ }),

/***/ "./src/pages/Send/hooks/useSend/useSVMSend.ts":
/*!****************************************************!*\
  !*** ./src/pages/Send/hooks/useSend/useSVMSend.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useSvmSend": () => (/* binding */ useSvmSend)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/SolanaVM/utils/transferSol.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/SolanaVM/utils/transferToken.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/SolanaVM/utils/compileSolanaTx.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/SolanaVM/utils/serializeSolanaTx.js");
/* harmony import */ var _solana_kit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @solana/kit */ "./node_modules/@solana/addresses/dist/index.browser.mjs");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bigIntToString.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../models */ "./src/pages/Send/models.ts");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");









const RENT_EXEMPT_CACHE = new Map();
const ACCOUNT_SPACE_CACHE = new Map();
const useSvmSend = ({
  nativeToken,
  provider,
  account
}) => {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_3__.useConnectionContext)();
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [isValidating, setIsValidating] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isSending, setIsSending] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [maxAmount, setMaxAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('0');
  const [minAmount, setMinAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  function setErrorAndEndValidating(message) {
    setError(message);
    setIsValidating(false);
  }
  const buildTransaction = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async ({
    address,
    amount,
    token
  }) => {
    if (token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.NATIVE) {
      return (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_6__.transferSol)({
        from: account.addressSVM,
        to: address,
        amount: BigInt((0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_5__.stringToBigint)(amount, nativeToken.decimals)),
        provider
      });
    }
    return (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_7__.transferToken)({
      from: account.addressSVM,
      to: address,
      mint: token.address,
      amount: BigInt((0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_5__.stringToBigint)(amount, token.decimals)),
      provider
    });
  }, [account.addressSVM, nativeToken.decimals, provider]);
  const validate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async ({
    address,
    amount,
    token
  }) => {
    setIsValidating(true);
    const amountBigInt = (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_5__.stringToBigint)(amount || '0', token.decimals);
    if (!amountBigInt || amountBigInt < 0) {
      setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.AMOUNT_REQUIRED);
      return;
    }
    const remainingBalance = token.balance - amountBigInt;

    // Handle max amount first
    if (token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.NATIVE) {
      setMaxAmount((nativeToken.balance - _models__WEBPACK_IMPORTED_MODULE_4__.SOLANA_FIXED_BASE_FEE).toString());
      if (remainingBalance < _models__WEBPACK_IMPORTED_MODULE_4__.SOLANA_FIXED_BASE_FEE) {
        setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INSUFFICIENT_BALANCE);
        return;
      }
    } else {
      setMaxAmount(nativeToken.balance.toString());
      if (remainingBalance < 0n) {
        setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INSUFFICIENT_BALANCE);
        return;
      }
    }
    if (!address) {
      setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.ADDRESS_REQUIRED);
      return;
    }
    if (!(0,_solana_kit__WEBPACK_IMPORTED_MODULE_8__.isAddress)(address)) {
      setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INVALID_ADDRESS);
      return;
    }
    if (token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.NATIVE) {
      const spaceOccupied = await getAccountOccupiedSpace(address, provider);

      // If the recipient account does not hold any data, the first transfer
      // must be greater than the rent-exempt minimum.
      if (spaceOccupied === 0n) {
        const minimum = await getRentExemptMinimum(0n, provider);
        setMinAmount((0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_9__.bigIntToString)(minimum, token.decimals));
        if (amountBigInt < minimum) {
          setErrorAndEndValidating(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.AMOUNT_TOO_LOW);
          return;
        }
      } else {
        setMinAmount(undefined);
      }
    } else {
      setMinAmount(undefined);
    }
    setError(undefined);
    setIsValidating(false);
  }, [provider, nativeToken.balance]);
  const send = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async options => {
    try {
      setIsSending(true);
      const tx = await buildTransaction(options);
      const compiledTx = (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_10__.compileSolanaTx)(tx);
      const hash = await request({
        method: _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION,
        params: [{
          account: account.addressSVM,
          serializedTx: (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_11__.serializeSolanaTx)(compiledTx)
        }]
      });
      return hash;
    } catch (err) {
      console.error(err);
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.UNKNOWN_ERROR);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [buildTransaction, request, account.addressSVM]);
  return {
    error,
    isSending,
    isValid: !isValidating && !error,
    isValidating,
    minAmount,
    maxAmount,
    send,
    validate
  };
};
const getAccountOccupiedSpace = async (address, provider) => {
  if (ACCOUNT_SPACE_CACHE.has(address)) {
    return ACCOUNT_SPACE_CACHE.get(address);
  }
  const accountInfo = await provider.getAccountInfo(address).send();
  const space = accountInfo.value?.space ?? 0n;
  ACCOUNT_SPACE_CACHE.set(address, space);
  return space;
};
const getRentExemptMinimum = async (space, provider) => {
  if (RENT_EXEMPT_CACHE.has(space)) {
    return RENT_EXEMPT_CACHE.get(space);
  }
  const rentExemptMinimum = await provider.getMinimumBalanceForRentExemption(0n).send();
  RENT_EXEMPT_CACHE.set(0n, rentExemptMinimum);
  return rentExemptMinimum;
};

/***/ }),

/***/ "./src/pages/Send/models.ts":
/*!**********************************!*\
  !*** ./src/pages/Send/models.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SOLANA_FIXED_BASE_FEE": () => (/* binding */ SOLANA_FIXED_BASE_FEE)
/* harmony export */ });
const SOLANA_FIXED_BASE_FEE = 5000n;

/***/ }),

/***/ "./src/pages/Send/utils/getMaxUtxos.ts":
/*!*********************************************!*\
  !*** ./src/pages/Send/utils/getMaxUtxos.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getMaxUtxoSet": () => (/* binding */ getMaxUtxoSet)
/* harmony export */ });
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/utils/sortUTXOs.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/utils/txSizeLimits.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/utils/getAssetBalance.js");
/* harmony import */ var _src_background_services_ledger_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/ledger/models */ "./src/background/services/ledger/models.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _src_utils_assertions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/assertions */ "./src/utils/assertions.ts");
/* harmony import */ var _src_utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/errors */ "./src/utils/errors/index.ts");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");






const MAX_LEDGER_OUTPUTS = 64;
var CHAIN_ALIAS = /*#__PURE__*/function (CHAIN_ALIAS) {
  CHAIN_ALIAS["P"] = "P";
  CHAIN_ALIAS["X"] = "X";
  return CHAIN_ALIAS;
}(CHAIN_ALIAS || {});
async function getMaxUtxoSet(isLedgerWallet, provider, wallet, network, feeState, preloadedUtxoSet) {
  const chainAliasToUse = (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_1__.isPchainNetwork)(network) ? CHAIN_ALIAS.P : CHAIN_ALIAS.X;
  const utxos = preloadedUtxoSet ?? (await wallet.getUTXOs(chainAliasToUse));
  let filteredUtxos = _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.sortUTXOsByAmount(utxos.getUTXOs(), true);
  if ((0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_1__.isPchainNetwork)(network)) {
    (0,_src_utils_assertions__WEBPACK_IMPORTED_MODULE_2__.assert)(feeState, _src_utils_errors__WEBPACK_IMPORTED_MODULE_3__.CommonError.UnknownNetworkFee);
    try {
      filteredUtxos = _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_5__.getMaximumUtxoSet({
        wallet,
        utxos: utxos.getUTXOs(),
        sizeSupportedTx: _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_5__.SizeSupportedTx.BaseP,
        limit: isLedgerWallet ? _src_background_services_ledger_models__WEBPACK_IMPORTED_MODULE_0__.LEDGER_TX_SIZE_LIMIT_BYTES : undefined,
        feeState
      });
    } catch (error) {
      console.error('Error calculating maximum utxo set', {
        e: error,
        txType: _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_5__.SizeSupportedTx.BaseP,
        utxos
      });
    }
  }
  filteredUtxos = isLedgerWallet ? filteredUtxos.slice(0, MAX_LEDGER_OUTPUTS) : filteredUtxos;
  const utxoSet = new _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_6__.utils.UtxoSet(filteredUtxos);
  const avax = provider.getAvaxID();
  return {
    utxos: utxoSet,
    balance: _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_7__.getAssetBalance(utxoSet, avax)
  };
}

/***/ }),

/***/ "./src/utils/isBtcAddressInNetwork.ts":
/*!********************************************!*\
  !*** ./src/utils/isBtcAddressInNetwork.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBtcAddressInNetwork": () => (/* binding */ isBtcAddressInNetwork)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/lib/btc/address.js");


/**
 * Check if the given address is a valid Bitcoin address
 * @param address Bitcoin address, bech32 or b58
 * @param isMainnet Verify address against mainnet or testnet
 */
function isBtcAddressInNetwork(address, isMainnet) {
  return (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.isBech32AddressInNetwork)(address, isMainnet) || (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_0__.isBase58AddressInNetwork)(address, isMainnet);
}

/***/ }),

/***/ "./src/utils/send/btcSendUtils.ts":
/*!****************************************!*\
  !*** ./src/utils/send/btcSendUtils.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildBtcTx": () => (/* binding */ buildBtcTx),
/* harmony export */   "getBtcInputUtxos": () => (/* binding */ getBtcInputUtxos),
/* harmony export */   "validateBtcSend": () => (/* binding */ validateBtcSend)
/* harmony export */ });
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/utils/createTransferTx.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/BitcoinVM/utils/getMaxTransferAmount.js");
/* harmony import */ var coinselect_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! coinselect/utils */ "./node_modules/coinselect/utils.js");
/* harmony import */ var coinselect_utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(coinselect_utils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _isBtcAddressInNetwork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../isBtcAddressInNetwork */ "./src/utils/isBtcAddressInNetwork.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ "./src/utils/send/models.ts");




const getBtcInputUtxos = async (provider, token, feeRate) => {
  const utxos = await provider.getScriptsForUtxos(token.utxos ?? []);
  if (typeof feeRate === 'number') {
    // Filter out UTXOs that would not be used with the current fee rate,
    // that is those for which fee to use the UTXO would be higher than its value.
    return utxos.filter(utxo => {
      const utxoFee = (0,coinselect_utils__WEBPACK_IMPORTED_MODULE_0__.inputBytes)(utxo) * feeRate;
      return utxoFee < utxo.value;
    });
  }
  return utxos;
};
const buildBtcTx = async (from, provider, {
  amount,
  address,
  token,
  feeRate
}) => {
  const utxos = await getBtcInputUtxos(provider, token);
  return (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_3__.createTransferTx)(address, from, amount, feeRate, utxos, provider.getNetwork());
};
const validateBtcSend = (from, {
  address,
  amount,
  feeRate
}, utxos, isMainnet) => {
  if (!address) {
    return _models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.ADDRESS_REQUIRED;
  }
  if (!feeRate) {
    return _models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INVALID_NETWORK_FEE;
  }
  if (!(0,_isBtcAddressInNetwork__WEBPACK_IMPORTED_MODULE_1__.isBtcAddressInNetwork)(address, isMainnet)) {
    return _models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INVALID_ADDRESS;
  }
  if (!amount || amount <= 0) {
    return _models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.AMOUNT_REQUIRED;
  }
  const maxTransferAmount = Math.max((0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.getMaxTransferAmount)(utxos, address, from, feeRate), 0);
  if (amount > maxTransferAmount) {
    return _models__WEBPACK_IMPORTED_MODULE_2__.SendErrorMessage.INSUFFICIENT_BALANCE;
  }
  return null;
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX2FwcHJvdmFsX0FwcHJvdmFsU2VjdGlvbl90c3gtc3JjX3BhZ2VzX1NlbmRfU2VuZF90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDMEQ7QUFDSjtBQUNVO0FBQ0E7QUFPekQsU0FBU08sb0JBQW9CQSxDQUFDO0VBQ25DQyxZQUFZO0VBQ1pDLE9BQU87RUFDUEM7QUFDNkMsQ0FBQyxFQUFFO0VBQ2hELE1BQU07SUFBRUM7RUFBRSxDQUFDLEdBQUdSLDZEQUFjLEVBQUU7RUFFOUIsTUFBTVMsaUJBQWlCLEdBQ3JCUiw2RUFBeUIsQ0FBQ0ksWUFBWSxDQUFDLElBQUlHLENBQUMsQ0FBQyxjQUFjLENBQUM7RUFFOUQsb0JBQ0VFLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVCw4REFBSztJQUNKVSxFQUFFLEVBQUU7TUFDRkMsS0FBSyxFQUFFLE1BQU07TUFDYkMsTUFBTSxFQUFFO0lBQ1Y7RUFBRSxnQkFFRkosS0FBQSxDQUFBQyxhQUFBLENBQUNkLGlEQUFTO0lBQUNrQixPQUFPLEVBQUVqQixnRUFBd0JrQjtFQUFDLEdBQzFDUCxpQkFBaUIsQ0FDUixlQUNaQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ1QsOERBQUs7SUFDSlUsRUFBRSxFQUFFO01BQ0ZLLFFBQVEsRUFBRSxDQUFDO01BQ1hDLEVBQUUsRUFBRSxDQUFDO01BQ0xDLFlBQVksRUFBRSxRQUFRO01BQ3RCQyxjQUFjLEVBQUU7SUFDbEI7RUFBRSxnQkFFRlYsS0FBQSxDQUFBQyxhQUFBLENBQUNSLG1FQUFVO0lBQUNZLE9BQU8sRUFBQyxPQUFPO0lBQUNNLFNBQVMsRUFBRSxFQUFHO0lBQUNDLEtBQUssRUFBQztFQUFRLGdCQUN2RFosS0FBQSxDQUFBQyxhQUFBLENBQUNaLGdEQUFLO0lBQ0p3QixPQUFPLEVBQUMsMEZBQTBGO0lBQ2xHQyxNQUFNLEVBQUU7TUFDTm5CLFlBQVksRUFBRUksaUJBQWlCO01BQy9CSDtJQUNGO0VBQUUsRUFD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QUU7SUFDWixPQUFPOUoseUVBQW9DO0VBQzdDO0VBRUEsSUFBSSxDQUFDbkIsNkVBQXFCLENBQUMxSCxPQUFPLEVBQUVpSSxTQUFTLENBQUMsRUFBRTtJQUM5QyxPQUFPWSxxRUFBZ0M7RUFDekM7RUFFQSxJQUFJLENBQUMzSSxNQUFNLElBQUlBLE1BQU0sSUFBSSxDQUFDLEVBQUU7SUFDMUIsT0FBTzJJLHFFQUFnQztFQUN6QztFQUVBLE1BQU0wSixpQkFBaUIsR0FBR0MsSUFBSSxDQUFDQyxHQUFHLENBQ2hDYiwrRUFBb0IsQ0FBQ25DLEtBQUssRUFBRXpQLE9BQU8sRUFBRTBHLElBQUksRUFBRWlNLE9BQU8sQ0FBQyxFQUNuRCxDQUFDLENBQ0Y7RUFFRCxJQUFJelMsTUFBTSxHQUFHcVMsaUJBQWlCLEVBQUU7SUFDOUIsT0FBTzFKLDBFQUFxQztFQUM5QztFQUVBLE9BQU8sSUFBSTtBQUNiLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL05vdFN1cHBvcnRlZEJ5V2FsbGV0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL0FwcHJvdmFsU2VjdGlvbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VTZXRTZW5kRGF0YUluUGFyYW1zLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2VuZC9TZW5kLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvY29tcG9uZW50cy9TZW5kQVZNLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvY29tcG9uZW50cy9TZW5kQlRDLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvY29tcG9uZW50cy9TZW5kRVZNLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvY29tcG9uZW50cy9TZW5kRm9ybS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZW5kL2NvbXBvbmVudHMvU2VuZFBWTS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZW5kL2NvbXBvbmVudHMvU2VuZFNWTS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZW5kL2hvb2tzL3VzZVNlbmQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZW5kL2hvb2tzL3VzZVNlbmQvbW9kZWxzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2VuZC9ob29rcy91c2VTZW5kL3VzZUFWTVNlbmQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZW5kL2hvb2tzL3VzZVNlbmQvdXNlQlRDU2VuZC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvaG9va3MvdXNlU2VuZC91c2VQVk1TZW5kLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2VuZC9ob29rcy91c2VTZW5kL3VzZVNWTVNlbmQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZW5kL21vZGVscy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvdXRpbHMvZ2V0TWF4VXR4b3MudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9pc0J0Y0FkZHJlc3NJbk5ldHdvcmsudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9zZW5kL2J0Y1NlbmRVdGlscy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcm9wc1dpdGhDaGlsZHJlbiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFBhZ2VUaXRsZSwgUGFnZVRpdGxlVmFyaWFudCB9IGZyb20gJy4vUGFnZVRpdGxlJztcbmltcG9ydCB7IFRyYW5zLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgZ2V0VHJhbnNsYXRlZEZ1bmN0aW9uTmFtZSB9IGZyb20gJy4vRnVuY3Rpb25Jc09mZmxpbmUnO1xuaW1wb3J0IHsgU3RhY2ssIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgRnVuY3Rpb25OYW1lcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNGdW5jdGlvbkF2YWlsYWJsZSc7XG5pbnRlcmZhY2UgTm90U3VwcG9ydGVkQnlXYWxsZXRlUHJvcHMge1xuICBmdW5jdGlvbk5hbWU6IEZ1bmN0aW9uTmFtZXM7XG4gIG5ldHdvcms6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE5vdFN1cHBvcnRlZEJ5V2FsbGV0KHtcbiAgZnVuY3Rpb25OYW1lLFxuICBuZXR3b3JrLFxuICBjaGlsZHJlbixcbn06IFByb3BzV2l0aENoaWxkcmVuPE5vdFN1cHBvcnRlZEJ5V2FsbGV0ZVByb3BzPikge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgY29uc3QgZnVuY3Rpb25OYW1lTGFiZWwgPVxuICAgIGdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUoZnVuY3Rpb25OYW1lKSA/PyB0KCdUaGlzIEZlYXR1cmUnKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxQYWdlVGl0bGUgdmFyaWFudD17UGFnZVRpdGxlVmFyaWFudC5QUklNQVJZfT5cbiAgICAgICAge2Z1bmN0aW9uTmFtZUxhYmVsfVxuICAgICAgPC9QYWdlVGl0bGU+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBweDogNCxcbiAgICAgICAgICBhbGlnbkNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCIgbWluSGVpZ2h0PXsyNH0gYWxpZ249XCJjZW50ZXJcIj5cbiAgICAgICAgICA8VHJhbnNcbiAgICAgICAgICAgIGkxOG5LZXk9XCJTb3JyeSwge3tmdW5jdGlvbk5hbWV9fSBvbjxici8+e3tuZXR3b3JrfX0gbmV0d29yazxici8+aXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGFjY291bnQuXCJcbiAgICAgICAgICAgIHZhbHVlcz17e1xuICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZUxhYmVsLFxuICAgICAgICAgICAgICBuZXR3b3JrLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJveCxcbiAgSW5mb0NpcmNsZUljb24sXG4gIFN0YWNrLFxuICBTdGFja1Byb3BzLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbnR5cGUgQXBwcm92YWxTZWN0aW9uSGVhZGVyUHJvcHMgPSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHRvb2x0aXA/OiBzdHJpbmc7XG4gIHRvb2x0aXBJY29uPzogUmVhY3QuUmVhY3RFbGVtZW50O1xufTtcblxuZXhwb3J0IGNvbnN0IEFwcHJvdmFsU2VjdGlvbkhlYWRlcjogUmVhY3QuRkM8QXBwcm92YWxTZWN0aW9uSGVhZGVyUHJvcHM+ID0gKHtcbiAgbGFiZWwsXG4gIHRvb2x0aXAsXG4gIHRvb2x0aXBJY29uID0gPEluZm9DaXJjbGVJY29uIC8+LFxuICBjaGlsZHJlbixcbn0pID0+IChcbiAgPFN0YWNrXG4gICAgc3g9e3tcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICB9fVxuICA+XG4gICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgIDxUeXBvZ3JhcGh5IGNvbXBvbmVudD1cImg2XCIgc3g9e3sgZm9udFdlaWdodDogNjAwIH19PlxuICAgICAgICB7bGFiZWx9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICB7dG9vbHRpcCAmJiAoXG4gICAgICAgIDxUb29sdGlwIHN4PXt7IGN1cnNvcjogJ3BvaW50ZXInLCBtbDogMSB9fSB0aXRsZT17dG9vbHRpcH0+XG4gICAgICAgICAge3Rvb2x0aXBJY29ufVxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gICAgPEJveD57Y2hpbGRyZW59PC9Cb3g+XG4gIDwvU3RhY2s+XG4pO1xuXG5leHBvcnQgY29uc3QgQXBwcm92YWxTZWN0aW9uQm9keSA9ICh7IHN4ID0ge30sIC4uLnJlc3QgfTogU3RhY2tQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2JhY2tncm91bmQucGFwZXInLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgIHA6IDIsXG4gICAgICAgIGdhcDogMSxcbiAgICAgICAgLi4uKHR5cGVvZiBzeCA9PT0gJ2Z1bmN0aW9uJyA/IHN4KHRoZW1lKSA6IHN4KSxcbiAgICAgIH19XG4gICAgICB7Li4ucmVzdH1cbiAgICAvPlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IEFwcHJvdmFsU2VjdGlvbiA9ICh7IHN4ID0ge30sIC4uLnJlc3QgfTogU3RhY2tQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGdhcDogMC41LFxuICAgICAgICAuLi4odHlwZW9mIHN4ID09PSAnZnVuY3Rpb24nID8gc3godGhlbWUpIDogc3gpLFxuICAgICAgfX1cbiAgICAgIHsuLi5yZXN0fVxuICAgIC8+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgVG9rZW5UeXBlLCBUb2tlbldpdGhCYWxhbmNlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5LCB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG50eXBlIFNldFNlbmREYXRhSW5QYXJhbXMgPSB7XG4gIHRva2VuPzogVG9rZW5XaXRoQmFsYW5jZTtcbiAgYWRkcmVzcz86IHN0cmluZztcbiAgYW1vdW50Pzogc3RyaW5nO1xuICBvcHRpb25zPzoge1xuICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgcmVwbGFjZT86IGJvb2xlYW47XG4gIH07XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlU2V0U2VuZERhdGFJblBhcmFtcygpIHtcbiAgY29uc3QgeyBwYXRobmFtZSB9ID0gdXNlTG9jYXRpb24oKTtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuXG4gIGNvbnN0IHNldFNlbmREYXRhSW5QYXJhbXMgPSB1c2VDYWxsYmFjayhcbiAgICAoeyB0b2tlbiwgYWRkcmVzcywgb3B0aW9ucywgYW1vdW50IH06IFNldFNlbmREYXRhSW5QYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IHB1c2hPclJlcGxhY2UgPSBvcHRpb25zPy5yZXBsYWNlID8gaGlzdG9yeS5yZXBsYWNlIDogaGlzdG9yeS5wdXNoO1xuICAgICAgcHVzaE9yUmVwbGFjZSh7XG4gICAgICAgIHBhdGhuYW1lOiBvcHRpb25zPy5wYXRoID8/IHBhdGhuYW1lLFxuICAgICAgICBzZWFyY2g6IGA/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHtcbiAgICAgICAgICB0b2tlblN5bWJvbDogdG9rZW4/LnN5bWJvbCB8fCBuZXR3b3JrPy5uZXR3b3JrVG9rZW4uc3ltYm9sIHx8ICcnLFxuICAgICAgICAgIHRva2VuQWRkcmVzczogdG9rZW4/LnR5cGUgPT09IFRva2VuVHlwZS5FUkMyMCA/IHRva2VuPy5hZGRyZXNzIDogJycsXG4gICAgICAgICAgYW1vdW50OiBhbW91bnQgPz8gJycsXG4gICAgICAgICAgYWRkcmVzczogYWRkcmVzcyA/PyAnJyxcbiAgICAgICAgfSkudG9TdHJpbmcoKX1gLFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBbaGlzdG9yeSwgbmV0d29yaz8ubmV0d29ya1Rva2VuLnN5bWJvbCwgcGF0aG5hbWVdLFxuICApO1xuXG4gIHJldHVybiBzZXRTZW5kRGF0YUluUGFyYW1zO1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB1c2VUb2tlbnNXaXRoQmFsYW5jZXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVRva2Vuc1dpdGhCYWxhbmNlcyc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyBGdW5jdGlvbklzT2ZmbGluZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRnVuY3Rpb25Jc09mZmxpbmUnO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyBOZXR3b3JrVk1UeXBlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBTdGFjaywgdG9hc3QgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtcbiAgRnVuY3Rpb25OYW1lcyxcbiAgdXNlSXNGdW5jdGlvbkF2YWlsYWJsZSxcbn0gZnJvbSAnQHNyYy9ob29rcy91c2VJc0Z1bmN0aW9uQXZhaWxhYmxlJztcbmltcG9ydCB7IEZ1bmN0aW9uSXNVbmF2YWlsYWJsZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRnVuY3Rpb25Jc1VuYXZhaWxhYmxlJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VOZXR3b3JrRmVlQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya0ZlZVByb3ZpZGVyJztcbmltcG9ydCB7XG4gIFN1cHBvcnRlZFByb3ZpZGVyLFxuICBnZXRQcm92aWRlckZvck5ldHdvcmssXG59IGZyb20gJ0BzcmMvdXRpbHMvbmV0d29yay9nZXRQcm92aWRlckZvck5ldHdvcmsnO1xuaW1wb3J0IHtcbiAgQXZhbGFuY2hlLFxuICBCaXRjb2luUHJvdmlkZXIsXG4gIEpzb25ScGNCYXRjaEludGVybmFsLFxuICBTb2xhbmFQcm92aWRlcixcbiAgaXNTb2xhbmFQcm92aWRlcixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5pbXBvcnQgeyBTZW5kRVZNIH0gZnJvbSAnLi9jb21wb25lbnRzL1NlbmRFVk0nO1xuaW1wb3J0IHsgdG9hc3RDYXJkV2l0aExpbmsgfSBmcm9tICdAc3JjL3V0aWxzL3RvYXN0Q2FyZFdpdGhMaW5rJztcbmltcG9ydCB7IGdldEV4cGxvcmVyQWRkcmVzc0J5TmV0d29yayB9IGZyb20gJ0BzcmMvdXRpbHMvZ2V0RXhwbG9yZXJBZGRyZXNzJztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay9tb2RlbHMnO1xuaW1wb3J0IHsgU2VuZEJUQyB9IGZyb20gJy4vY29tcG9uZW50cy9TZW5kQlRDJztcbmltcG9ydCB7IExvYWRpbmdTZW5kRm9ybSB9IGZyb20gJy4vY29tcG9uZW50cy9Mb2FkaW5nU2VuZEZvcm0nO1xuaW1wb3J0IHsgU2VuZFBWTSB9IGZyb20gJy4vY29tcG9uZW50cy9TZW5kUFZNJztcbmltcG9ydCB7IFNlbmRBVk0gfSBmcm9tICcuL2NvbXBvbmVudHMvU2VuZEFWTSc7XG5pbXBvcnQge1xuICBpc0F2bUNhcGFibGVBY2NvdW50LFxuICBpc1B2bUNhcGFibGVBY2NvdW50LFxuICBpc1N2bUNhcGFibGVBY2NvdW50LFxufSBmcm9tICcuL2hvb2tzL3VzZVNlbmQvbW9kZWxzJztcbmltcG9ydCB7XG4gIE5ldHdvcmtUb2tlbldpdGhCYWxhbmNlLFxuICBOZnRUb2tlbldpdGhCYWxhbmNlLFxuICBUb2tlblR5cGUsXG4gIFRva2VuV2l0aEJhbGFuY2VBVk0sXG4gIFRva2VuV2l0aEJhbGFuY2VCVEMsXG4gIFRva2VuV2l0aEJhbGFuY2VFVk0sXG4gIFRva2VuV2l0aEJhbGFuY2VQVk0sXG4gIFRva2VuV2l0aEJhbGFuY2VTUEwsXG4gIFRva2VuV2l0aEJhbGFuY2VTVk0sXG59IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyBTZW5kU1ZNIH0gZnJvbSAnLi9jb21wb25lbnRzL1NlbmRTVk0nO1xuaW1wb3J0IHsgZ2V0QWRkcmVzc0ZvckNoYWluIH0gZnJvbSAnQHNyYy91dGlscy9nZXRBZGRyZXNzRm9yQ2hhaW4nO1xuXG5leHBvcnQgZnVuY3Rpb24gU2VuZFBhZ2UoKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCB7IG5ldHdvcmtGZWUgfSA9IHVzZU5ldHdvcmtGZWVDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmUgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IGNhcHR1cmVFbmNyeXB0ZWQgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgdG9rZW5zID0gdXNlVG9rZW5zV2l0aEJhbGFuY2VzKCk7XG5cbiAgY29uc3QgeyBpc0Z1bmN0aW9uQXZhaWxhYmxlLCBpc0Z1bmN0aW9uU3VwcG9ydGVkIH0gPSB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlKFxuICAgIEZ1bmN0aW9uTmFtZXMuU0VORCxcbiAgKTtcblxuICBjb25zdCBuYXRpdmVUb2tlbiA9IHRva2Vucy5maW5kKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gVG9rZW5UeXBlLk5BVElWRSk7XG5cbiAgY29uc3QgW3Byb3ZpZGVyLCBzZXRQcm92aWRlcl0gPSB1c2VTdGF0ZTxTdXBwb3J0ZWRQcm92aWRlcj4oKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbmV0d29yaykge1xuICAgICAgc2V0UHJvdmlkZXIodW5kZWZpbmVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XG5cbiAgICAgIGdldFByb3ZpZGVyRm9yTmV0d29yayhuZXR3b3JrKS50aGVuKChwKSA9PiB7XG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcbiAgICAgICAgICBzZXRQcm92aWRlcihwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlzTW91bnRlZCA9IGZhbHNlO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIFtuZXR3b3JrXSk7XG5cbiAgY29uc3QgZnJvbUFkZHJlc3MgPSB1c2VNZW1vKFxuICAgICgpID0+IGdldEFkZHJlc3NGb3JDaGFpbihuZXR3b3JrLCBhY3RpdmUpLFxuICAgIFthY3RpdmUsIG5ldHdvcmtdLFxuICApO1xuXG4gIGNvbnN0IG9uU3VjY2VzcyA9IHVzZUNhbGxiYWNrKFxuICAgICh0eEhhc2g6IHN0cmluZykgPT4ge1xuICAgICAgY2FwdHVyZUVuY3J5cHRlZCgnU2VuZFN1Y2Nlc3NmdWwnLCB7XG4gICAgICAgIGFkZHJlc3M6IGZyb21BZGRyZXNzLFxuICAgICAgICB0eEhhc2gsXG4gICAgICAgIGNoYWluSWQ6IG5ldHdvcms/LmNoYWluSWQsXG4gICAgICB9KTtcblxuICAgICAgdG9hc3RDYXJkV2l0aExpbmsoe1xuICAgICAgICB0aXRsZTogdCgnU2VuZCBTdWNjZXNzZnVsJyksXG4gICAgICAgIHVybDogZ2V0RXhwbG9yZXJBZGRyZXNzQnlOZXR3b3JrKG5ldHdvcmsgYXMgTmV0d29yaywgdHhIYXNoKSxcbiAgICAgICAgbGFiZWw6IHQoJ1ZpZXcgaW4gRXhwbG9yZXInKSxcbiAgICAgIH0pO1xuXG4gICAgICBoaXN0b3J5LnB1c2goJy9ob21lJyk7XG4gICAgfSxcbiAgICBbZnJvbUFkZHJlc3MsIG5ldHdvcmssIGNhcHR1cmVFbmNyeXB0ZWQsIGhpc3RvcnksIHRdLFxuICApO1xuXG4gIGNvbnN0IG9uRmFpbHVyZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICB0b2FzdC5lcnJvcih0KCdUcmFuc2FjdGlvbiBGYWlsZWQnKSk7XG5cbiAgICBjYXB0dXJlRW5jcnlwdGVkKCdTZW5kRmFpbGVkJywge1xuICAgICAgYWRkcmVzczogZnJvbUFkZHJlc3MsXG4gICAgICBjaGFpbklkOiBuZXR3b3JrPy5jaGFpbklkLFxuICAgIH0pO1xuICB9LCBbY2FwdHVyZUVuY3J5cHRlZCwgZnJvbUFkZHJlc3MsIG5ldHdvcms/LmNoYWluSWQsIHRdKTtcblxuICBjb25zdCBvbkFwcHJvdmVkID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNhcHR1cmVFbmNyeXB0ZWQoJ1NlbmRBcHByb3ZlZCcsIHtcbiAgICAgIGFkZHJlc3M6IGZyb21BZGRyZXNzLFxuICAgICAgY2hhaW5JZDogbmV0d29yaz8uY2hhaW5JZCxcbiAgICB9KTtcbiAgfSwgW2NhcHR1cmVFbmNyeXB0ZWQsIGZyb21BZGRyZXNzLCBuZXR3b3JrPy5jaGFpbklkXSk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uU3VwcG9ydGVkKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGdW5jdGlvbklzVW5hdmFpbGFibGVcbiAgICAgICAgZnVuY3Rpb25OYW1lPXtGdW5jdGlvbk5hbWVzLlNFTkR9XG4gICAgICAgIG5ldHdvcms9e25ldHdvcms/LmNoYWluTmFtZSB8fCAnVGVzdG5ldCd9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBpZiAoIWlzRnVuY3Rpb25BdmFpbGFibGUpIHtcbiAgICByZXR1cm4gPEZ1bmN0aW9uSXNPZmZsaW5lIGZ1bmN0aW9uTmFtZT17RnVuY3Rpb25OYW1lcy5TRU5EfSAvPjtcbiAgfVxuXG4gIGNvbnN0IGlzTmV0d29ya0ZlZVJlYWR5ID1cbiAgICB0eXBlb2YgbmV0d29ya0ZlZT8ubG93Py5tYXhGZWVQZXJHYXMgIT09ICd1bmRlZmluZWQnO1xuICBjb25zdCBpc1Byb3ZpZGVyUmVhZHkgPSBkb2VzUHJvdmlkZXJNYXRjaFRoZU5ldHdvcmsobmV0d29yaywgcHJvdmlkZXIpO1xuXG4gIGNvbnN0IGlzTG9hZGluZyA9XG4gICAgIWFjdGl2ZSB8fFxuICAgICFuZXR3b3JrIHx8XG4gICAgIWZyb21BZGRyZXNzIHx8XG4gICAgIXByb3ZpZGVyIHx8XG4gICAgIWlzTmV0d29ya0ZlZVJlYWR5IHx8XG4gICAgIW5hdGl2ZVRva2VuIHx8XG4gICAgIWlzUHJvdmlkZXJSZWFkeTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgIDxQYWdlVGl0bGU+e3QoJ1NlbmQnKX08L1BhZ2VUaXRsZT5cbiAgICAgIHtpc0xvYWRpbmcgJiYgPExvYWRpbmdTZW5kRm9ybSAvPn1cbiAgICAgIHshaXNMb2FkaW5nICYmIG5ldHdvcmsudm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkVWTSAmJiBuZXR3b3JrRmVlICYmIChcbiAgICAgICAgPFNlbmRFVk1cbiAgICAgICAgICBuZXR3b3JrPXtuZXR3b3JrfVxuICAgICAgICAgIGZyb21BZGRyZXNzPXtmcm9tQWRkcmVzc31cbiAgICAgICAgICBtYXhGZWU9e25ldHdvcmtGZWUubG93Lm1heEZlZVBlckdhc31cbiAgICAgICAgICBuYXRpdmVUb2tlbj17bmF0aXZlVG9rZW4gYXMgTmV0d29ya1Rva2VuV2l0aEJhbGFuY2V9XG4gICAgICAgICAgcHJvdmlkZXI9e3Byb3ZpZGVyIGFzIEpzb25ScGNCYXRjaEludGVybmFsfVxuICAgICAgICAgIHRva2VuTGlzdD17XG4gICAgICAgICAgICB0b2tlbnMgYXMgRXhjbHVkZTxUb2tlbldpdGhCYWxhbmNlRVZNLCBOZnRUb2tlbldpdGhCYWxhbmNlPltdXG4gICAgICAgICAgfVxuICAgICAgICAgIG9uU3VjY2Vzcz17b25TdWNjZXNzfVxuICAgICAgICAgIG9uRmFpbHVyZT17b25GYWlsdXJlfVxuICAgICAgICAgIG9uQXBwcm92ZWQ9e29uQXBwcm92ZWR9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAgeyFpc0xvYWRpbmcgJiYgbmV0d29yay52bU5hbWUgPT09IE5ldHdvcmtWTVR5cGUuQklUQ09JTiAmJiBuZXR3b3JrRmVlICYmIChcbiAgICAgICAgPFNlbmRCVENcbiAgICAgICAgICBuZXR3b3JrPXtuZXR3b3JrfVxuICAgICAgICAgIGZyb21BZGRyZXNzPXtmcm9tQWRkcmVzc31cbiAgICAgICAgICBtYXhGZWU9e25ldHdvcmtGZWUubG93Lm1heEZlZVBlckdhc31cbiAgICAgICAgICBuYXRpdmVUb2tlbj17bmF0aXZlVG9rZW4gYXMgVG9rZW5XaXRoQmFsYW5jZUJUQ31cbiAgICAgICAgICBwcm92aWRlcj17cHJvdmlkZXIgYXMgQml0Y29pblByb3ZpZGVyfVxuICAgICAgICAgIHRva2VuTGlzdD17dG9rZW5zIGFzIFtUb2tlbldpdGhCYWxhbmNlQlRDXX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e29uU3VjY2Vzc31cbiAgICAgICAgICBvbkZhaWx1cmU9e29uRmFpbHVyZX1cbiAgICAgICAgICBvbkFwcHJvdmVkPXtvbkFwcHJvdmVkfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHshaXNMb2FkaW5nICYmXG4gICAgICAgIG5ldHdvcmtGZWUgJiZcbiAgICAgICAgbmV0d29yay52bU5hbWUgPT09IE5ldHdvcmtWTVR5cGUuUFZNICYmXG4gICAgICAgIGlzUHZtQ2FwYWJsZUFjY291bnQoYWN0aXZlKSAmJiAoXG4gICAgICAgICAgPFNlbmRQVk1cbiAgICAgICAgICAgIG5ldHdvcms9e25ldHdvcmt9XG4gICAgICAgICAgICBmcm9tQWRkcmVzcz17ZnJvbUFkZHJlc3N9XG4gICAgICAgICAgICBtYXhGZWU9e25ldHdvcmtGZWUubG93Lm1heEZlZVBlckdhc31cbiAgICAgICAgICAgIG5ldHdvcmtGZWU9e25ldHdvcmtGZWV9XG4gICAgICAgICAgICBuYXRpdmVUb2tlbj17bmF0aXZlVG9rZW4gYXMgVG9rZW5XaXRoQmFsYW5jZVBWTX1cbiAgICAgICAgICAgIHByb3ZpZGVyPXtwcm92aWRlciBhcyBBdmFsYW5jaGUuSnNvblJwY1Byb3ZpZGVyfVxuICAgICAgICAgICAgdG9rZW5MaXN0PXt0b2tlbnMgYXMgW1Rva2VuV2l0aEJhbGFuY2VQVk1dfVxuICAgICAgICAgICAgYWNjb3VudD17YWN0aXZlfVxuICAgICAgICAgICAgb25TdWNjZXNzPXtvblN1Y2Nlc3N9XG4gICAgICAgICAgICBvbkZhaWx1cmU9e29uRmFpbHVyZX1cbiAgICAgICAgICAgIG9uQXBwcm92ZWQ9e29uQXBwcm92ZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIHshaXNMb2FkaW5nICYmXG4gICAgICAgIG5ldHdvcmsudm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkFWTSAmJlxuICAgICAgICBpc0F2bUNhcGFibGVBY2NvdW50KGFjdGl2ZSkgJiYgKFxuICAgICAgICAgIDxTZW5kQVZNXG4gICAgICAgICAgICBuZXR3b3JrPXtuZXR3b3JrfVxuICAgICAgICAgICAgZnJvbUFkZHJlc3M9e2Zyb21BZGRyZXNzfVxuICAgICAgICAgICAgbWF4RmVlPXtcbiAgICAgICAgICAgICAgKHByb3ZpZGVyIGFzIEF2YWxhbmNoZS5Kc29uUnBjUHJvdmlkZXIpLmdldENvbnRleHQoKS5iYXNlVHhGZWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5hdGl2ZVRva2VuPXtuYXRpdmVUb2tlbiBhcyBUb2tlbldpdGhCYWxhbmNlQVZNfVxuICAgICAgICAgICAgcHJvdmlkZXI9e3Byb3ZpZGVyIGFzIEF2YWxhbmNoZS5Kc29uUnBjUHJvdmlkZXJ9XG4gICAgICAgICAgICB0b2tlbkxpc3Q9e3Rva2VucyBhcyBbVG9rZW5XaXRoQmFsYW5jZUFWTV19XG4gICAgICAgICAgICBhY2NvdW50PXthY3RpdmV9XG4gICAgICAgICAgICBvblN1Y2Nlc3M9e29uU3VjY2Vzc31cbiAgICAgICAgICAgIG9uRmFpbHVyZT17b25GYWlsdXJlfVxuICAgICAgICAgICAgb25BcHByb3ZlZD17b25BcHByb3ZlZH1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgeyFpc0xvYWRpbmcgJiZcbiAgICAgICAgbmV0d29yay52bU5hbWUgPT09IE5ldHdvcmtWTVR5cGUuU1ZNICYmXG4gICAgICAgIGlzU3ZtQ2FwYWJsZUFjY291bnQoYWN0aXZlKSAmJiAoXG4gICAgICAgICAgPFNlbmRTVk1cbiAgICAgICAgICAgIG5ldHdvcms9e25ldHdvcmt9XG4gICAgICAgICAgICBmcm9tQWRkcmVzcz17ZnJvbUFkZHJlc3N9XG4gICAgICAgICAgICBtYXhGZWU9ezBufSAvLyBJcnJlbGV2YW50IGZvciBTb2xhbmEgYXQgdGhlIG1vbWVudCwgc2luY2Ugd2UncmUgb25seSB1c2luZyB0aGUgZml4ZWQsIGJhc2UgZmVlIChubyBwcmlvcml0eSBmZWVzKS5cbiAgICAgICAgICAgIG5hdGl2ZVRva2VuPXtuYXRpdmVUb2tlbiBhcyBUb2tlbldpdGhCYWxhbmNlU1ZNfVxuICAgICAgICAgICAgcHJvdmlkZXI9e3Byb3ZpZGVyIGFzIFNvbGFuYVByb3ZpZGVyfVxuICAgICAgICAgICAgdG9rZW5MaXN0PXt0b2tlbnMgYXMgW1Rva2VuV2l0aEJhbGFuY2VTUExdfVxuICAgICAgICAgICAgYWNjb3VudD17YWN0aXZlfVxuICAgICAgICAgICAgb25TdWNjZXNzPXtvblN1Y2Nlc3N9XG4gICAgICAgICAgICBvbkZhaWx1cmU9e29uRmFpbHVyZX1cbiAgICAgICAgICAgIG9uQXBwcm92ZWQ9e29uQXBwcm92ZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuXG4vLyBIZWxwZXIgdXRpbGl0eSBmb3IgY2hlY2tpbmcgaWYgdGhlIHByb3ZpZGVyIG5ldHdvcmsgJiBwcm92aWRlciBtYXRjaC5cbi8vIFRoaXMgaXMgdXNlZnVsLCBzaW5jZSB1cGRhdGVzIG9mIGBuZXR3b3JrYCBhbmQgYHByb3ZpZGVyYCBtYXkgY29tZVxuLy8gaW4gZGlmZmVyZW50IHJlbmRlciBydW5zLCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZCBzdGlsbCB3YWl0LlxuY29uc3QgZG9lc1Byb3ZpZGVyTWF0Y2hUaGVOZXR3b3JrID0gKFxuICBuZXR3b3JrPzogTmV0d29yayxcbiAgcHJvdmlkZXI/OiBTdXBwb3J0ZWRQcm92aWRlcixcbikgPT4ge1xuICBpZiAoIW5ldHdvcmsgfHwgIXByb3ZpZGVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3dpdGNoIChuZXR3b3JrLnZtTmFtZSkge1xuICAgIGNhc2UgTmV0d29ya1ZNVHlwZS5TVk06XG4gICAgICByZXR1cm4gaXNTb2xhbmFQcm92aWRlcihwcm92aWRlcik7XG4gICAgY2FzZSBOZXR3b3JrVk1UeXBlLkVWTTpcbiAgICAgIHJldHVybiBwcm92aWRlciBpbnN0YW5jZW9mIEpzb25ScGNCYXRjaEludGVybmFsO1xuXG4gICAgY2FzZSBOZXR3b3JrVk1UeXBlLkFWTTpcbiAgICBjYXNlIE5ldHdvcmtWTVR5cGUuUFZNOlxuICAgICAgcmV0dXJuIHByb3ZpZGVyIGluc3RhbmNlb2YgQXZhbGFuY2hlLkpzb25ScGNQcm92aWRlcjtcblxuICAgIGNhc2UgTmV0d29ya1ZNVHlwZS5CSVRDT0lOOlxuICAgICAgcmV0dXJuIHByb3ZpZGVyIGluc3RhbmNlb2YgQml0Y29pblByb3ZpZGVyO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcbiIsImltcG9ydCB7IEF2YWxhbmNoZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGhhbmRsZVR4T3V0Y29tZSB9IGZyb20gJ0BzcmMvdXRpbHMvaGFuZGxlVHhPdXRjb21lJztcblxuaW1wb3J0IHsgU2VuZFBhZ2VQcm9wc1dpdGhXYWxsZXRBVk0gfSBmcm9tICcuLi9tb2RlbHMnO1xuaW1wb3J0IHsgU2VuZEZvcm0gfSBmcm9tICcuL1NlbmRGb3JtJztcbmltcG9ydCB7IHVzZVNldFNlbmREYXRhSW5QYXJhbXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVNldFNlbmREYXRhSW5QYXJhbXMnO1xuaW1wb3J0IHsgdXNlUXVlcnlQYXJhbXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVF1ZXJ5UGFyYW1zJztcbmltcG9ydCB7IE5vdFN1cHBvcnRlZEJ5V2FsbGV0IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ob3RTdXBwb3J0ZWRCeVdhbGxldCc7XG5pbXBvcnQgeyBGdW5jdGlvbk5hbWVzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VJc0Z1bmN0aW9uQXZhaWxhYmxlJztcbmltcG9ydCB7IHVzZUF2bVNlbmQgfSBmcm9tICcuLi9ob29rcy91c2VTZW5kJztcbmltcG9ydCB7IFRva2VuV2l0aEJhbGFuY2VBVk0gfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgc3RyaW5nVG9CaWdpbnQgfSBmcm9tICdAc3JjL3V0aWxzL3N0cmluZ1RvQmlnaW50JztcblxuZXhwb3J0IGNvbnN0IFNlbmRBVk0gPSAoe1xuICBuZXR3b3JrLFxuICBmcm9tQWRkcmVzcyxcbiAgbWF4RmVlLFxuICBuYXRpdmVUb2tlbixcbiAgcHJvdmlkZXIsXG4gIHRva2VuTGlzdCxcbiAgYWNjb3VudCxcbiAgb25TdWNjZXNzLFxuICBvbkZhaWx1cmUsXG4gIG9uQXBwcm92ZWQsXG59OiBTZW5kUGFnZVByb3BzV2l0aFdhbGxldEFWTTxcbiAgQXZhbGFuY2hlLkpzb25ScGNQcm92aWRlcixcbiAgVG9rZW5XaXRoQmFsYW5jZUFWTSxcbiAgW1Rva2VuV2l0aEJhbGFuY2VBVk1dXG4+KSA9PiB7XG4gIGNvbnN0IHNldFN0YXRlSW5QYXJhbXMgPSB1c2VTZXRTZW5kRGF0YUluUGFyYW1zKCk7XG4gIGNvbnN0IHBhcmFtcyA9IHVzZVF1ZXJ5UGFyYW1zKCk7XG4gIGNvbnN0IFthZGRyZXNzLCBzZXRBZGRyZXNzXSA9IHVzZVN0YXRlPHN0cmluZz4ocGFyYW1zLmdldCgnYWRkcmVzcycpID8/ICcnKTtcbiAgY29uc3QgW2Ftb3VudCwgc2V0QW1vdW50XSA9IHVzZVN0YXRlKCcnKTtcblxuICBjb25zdCB7IGVycm9yLCBpc1NlbmRpbmcsIGlzVmFsaWQsIGlzVmFsaWRhdGluZywgbWF4QW1vdW50LCBzZW5kLCB2YWxpZGF0ZSB9ID1cbiAgICB1c2VBdm1TZW5kKHtcbiAgICAgIG5ldHdvcmssXG4gICAgICBmcm9tOiBmcm9tQWRkcmVzcyxcbiAgICAgIG1heEZlZSxcbiAgICAgIHByb3ZpZGVyLFxuICAgICAgbmF0aXZlVG9rZW4sXG4gICAgICBhY2NvdW50LFxuICAgIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgdmFsaWRhdGUoeyBhZGRyZXNzLCB0b2tlbjogbmF0aXZlVG9rZW4sIGFtb3VudCB9KTtcblxuICAgIGlmIChhZGRyZXNzKSB7XG4gICAgICBzZXRTdGF0ZUluUGFyYW1zKHtcbiAgICAgICAgdG9rZW46IG5hdGl2ZVRva2VuLFxuICAgICAgICBhZGRyZXNzLFxuICAgICAgICBvcHRpb25zOiB7IHJlcGxhY2U6IHRydWUgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgW2FkZHJlc3MsIGFtb3VudCwgdmFsaWRhdGUsIHNldFN0YXRlSW5QYXJhbXMsIG5hdGl2ZVRva2VuLCBhY2NvdW50XSk7XG5cbiAgY29uc3Qgb25TZW5kID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIGlzQXBwcm92ZWQsXG4gICAgICBoYXNFcnJvcixcbiAgICAgIHJlc3VsdDogdHhIYXNoLFxuICAgICAgZXJyb3I6IHR4RXJyb3IsXG4gICAgfSA9IGF3YWl0IGhhbmRsZVR4T3V0Y29tZShzZW5kKHsgYWRkcmVzcywgdG9rZW46IG5hdGl2ZVRva2VuLCBhbW91bnQgfSkpO1xuXG4gICAgaWYgKGlzQXBwcm92ZWQpIHtcbiAgICAgIG9uQXBwcm92ZWQoKTtcblxuICAgICAgaWYgKGhhc0Vycm9yKSB7XG4gICAgICAgIG9uRmFpbHVyZSh0eEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uU3VjY2Vzcyh0eEhhc2gpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW1xuICAgIGFkZHJlc3MsXG4gICAgYW1vdW50LFxuICAgIGlzVmFsaWQsXG4gICAgbmF0aXZlVG9rZW4sXG4gICAgb25BcHByb3ZlZCxcbiAgICBvbkZhaWx1cmUsXG4gICAgb25TdWNjZXNzLFxuICAgIHNlbmQsXG4gIF0pO1xuXG4gIGNvbnN0IGlucHV0QW1vdW50ID0gdXNlTWVtbyhcbiAgICAoKSA9PlxuICAgICAgYW1vdW50ID8gc3RyaW5nVG9CaWdpbnQoYW1vdW50LCBuYXRpdmVUb2tlbj8uZGVjaW1hbHMgPz8gOSkgOiB1bmRlZmluZWQsXG4gICAgW25hdGl2ZVRva2VuLCBhbW91bnRdLFxuICApO1xuXG4gIGlmIChhY2NvdW50ICYmICFhY2NvdW50LmFkZHJlc3NBVk0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE5vdFN1cHBvcnRlZEJ5V2FsbGV0XG4gICAgICAgIGZ1bmN0aW9uTmFtZT17RnVuY3Rpb25OYW1lcy5UT0tFTl9ERVRBSUxTfVxuICAgICAgICBuZXR3b3JrPXtuZXR3b3JrPy5jaGFpbk5hbWUgfHwgJ1Rlc3RuZXQnfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8U2VuZEZvcm1cbiAgICAgIGFkZHJlc3M9e2FkZHJlc3N9XG4gICAgICBpbnB1dEFtb3VudD17aW5wdXRBbW91bnR9XG4gICAgICB0b2tlbj17bmF0aXZlVG9rZW59XG4gICAgICB0b2tlbkxpc3Q9e3Rva2VuTGlzdH1cbiAgICAgIG9uQ29udGFjdENoYW5nZWQ9eyhjb250YWN0KSA9PiB7XG4gICAgICAgIHNldEFkZHJlc3MoY29udGFjdD8uYWRkcmVzc1hQID8/ICcnKTtcbiAgICAgIH19XG4gICAgICBvbkFtb3VudENoYW5nZWQ9eyhuZXdBbW91bnQpID0+IHNldEFtb3VudChuZXdBbW91bnQpfVxuICAgICAgb25Ub2tlbkNoYW5nZWQ9eygpID0+IHt9fSAvLyBub29wLCBBVkFYIGhhcyBvbmx5IG9uZSB0b2tlblxuICAgICAgaXNTZW5kaW5nPXtpc1NlbmRpbmd9XG4gICAgICBpc1ZhbGlkPXtpc1ZhbGlkfVxuICAgICAgaXNWYWxpZGF0aW5nPXtpc1ZhbGlkYXRpbmd9XG4gICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICBtYXhBbW91bnQ9e21heEFtb3VudH1cbiAgICAgIG9uU2VuZD17b25TZW5kfVxuICAgIC8+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgQml0Y29pblByb3ZpZGVyIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgaGFuZGxlVHhPdXRjb21lIH0gZnJvbSAnQHNyYy91dGlscy9oYW5kbGVUeE91dGNvbWUnO1xuaW1wb3J0IHsgaXNCdGNBZGRyZXNzSW5OZXR3b3JrIH0gZnJvbSAnQHNyYy91dGlscy9pc0J0Y0FkZHJlc3NJbk5ldHdvcmsnO1xuXG5pbXBvcnQgeyB1c2VCdGNTZW5kIH0gZnJvbSAnLi4vaG9va3MvdXNlU2VuZCc7XG5pbXBvcnQgeyB1c2VWYWxpZEFkZHJlc3NGcm9tUGFyYW1zIH0gZnJvbSAnLi4vaG9va3MvdXNlVmFsaWRBZGRyZXNzRnJvbVBhcmFtcyc7XG5pbXBvcnQgeyBTZW5kUGFnZVByb3BzIH0gZnJvbSAnLi4vbW9kZWxzJztcbmltcG9ydCB7IFNlbmRGb3JtIH0gZnJvbSAnLi9TZW5kRm9ybSc7XG5pbXBvcnQgeyB1c2VTZXRTZW5kRGF0YUluUGFyYW1zIH0gZnJvbSAnQHNyYy9ob29rcy91c2VTZXRTZW5kRGF0YUluUGFyYW1zJztcbmltcG9ydCB7IFRva2VuV2l0aEJhbGFuY2VCVEMgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgc3RyaW5nVG9CaWdpbnQgfSBmcm9tICdAc3JjL3V0aWxzL3N0cmluZ1RvQmlnaW50JztcblxuZXhwb3J0IGNvbnN0IFNlbmRCVEMgPSAoe1xuICBuZXR3b3JrLFxuICBmcm9tQWRkcmVzcyxcbiAgbWF4RmVlLFxuICBuYXRpdmVUb2tlbixcbiAgcHJvdmlkZXIsXG4gIHRva2VuTGlzdCxcblxuICBvblN1Y2Nlc3MsXG4gIG9uRmFpbHVyZSxcbiAgb25BcHByb3ZlZCxcbn06IFNlbmRQYWdlUHJvcHM8XG4gIEJpdGNvaW5Qcm92aWRlcixcbiAgVG9rZW5XaXRoQmFsYW5jZUJUQyxcbiAgW1Rva2VuV2l0aEJhbGFuY2VCVENdXG4+KSA9PiB7XG4gIGNvbnN0IHNldFN0YXRlSW5QYXJhbXMgPSB1c2VTZXRTZW5kRGF0YUluUGFyYW1zKCk7XG4gIGNvbnN0IGFkZHJlc3NWYWxpZGF0b3IgPSB1c2VDYWxsYmFjayhcbiAgICAoYWRkOiBzdHJpbmcpID0+IGlzQnRjQWRkcmVzc0luTmV0d29yayhhZGQsICFuZXR3b3JrLmlzVGVzdG5ldCksXG4gICAgW25ldHdvcmsuaXNUZXN0bmV0XSxcbiAgKTtcbiAgY29uc3QgYWRkcmVzc0Zyb21QYXJhbXMgPSB1c2VWYWxpZEFkZHJlc3NGcm9tUGFyYW1zKGFkZHJlc3NWYWxpZGF0b3IpO1xuICBjb25zdCBbYWRkcmVzcywgc2V0QWRkcmVzc10gPSB1c2VTdGF0ZShhZGRyZXNzRnJvbVBhcmFtcyk7XG4gIGNvbnN0IFthbW91bnQsIHNldEFtb3VudF0gPSB1c2VTdGF0ZSgnJyk7XG5cbiAgY29uc3QgeyBlcnJvciwgaXNTZW5kaW5nLCBpc1ZhbGlkLCBpc1ZhbGlkYXRpbmcsIG1heEFtb3VudCwgc2VuZCwgdmFsaWRhdGUgfSA9XG4gICAgdXNlQnRjU2VuZCh7XG4gICAgICBpc01haW5uZXQ6ICFuZXR3b3JrLmlzVGVzdG5ldCxcbiAgICAgIGZyb206IGZyb21BZGRyZXNzLFxuICAgICAgbWF4RmVlLFxuICAgICAgcHJvdmlkZXIsXG4gICAgICBuYXRpdmVUb2tlbixcbiAgICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbmF0aXZlVG9rZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZSh7IGFkZHJlc3MsIGFtb3VudCB9KTtcblxuICAgIGlmIChhZGRyZXNzKSB7XG4gICAgICBzZXRTdGF0ZUluUGFyYW1zKHtcbiAgICAgICAgdG9rZW46IG5hdGl2ZVRva2VuLFxuICAgICAgICBhZGRyZXNzLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIG9wdGlvbnM6IHsgcmVwbGFjZTogdHJ1ZSB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9LCBbYWRkcmVzcywgYW1vdW50LCB2YWxpZGF0ZSwgc2V0U3RhdGVJblBhcmFtcywgbmF0aXZlVG9rZW5dKTtcblxuICBjb25zdCBvblNlbmQgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgaXNBcHByb3ZlZCxcbiAgICAgIGhhc0Vycm9yLFxuICAgICAgcmVzdWx0OiB0eEhhc2gsXG4gICAgICBlcnJvcjogdHhFcnJvcixcbiAgICB9ID0gYXdhaXQgaGFuZGxlVHhPdXRjb21lKHNlbmQoeyBhZGRyZXNzLCBhbW91bnQgfSkpO1xuXG4gICAgaWYgKGlzQXBwcm92ZWQpIHtcbiAgICAgIG9uQXBwcm92ZWQoKTtcblxuICAgICAgaWYgKGhhc0Vycm9yKSB7XG4gICAgICAgIG9uRmFpbHVyZSh0eEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uU3VjY2Vzcyh0eEhhc2gpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW2FkZHJlc3MsIGFtb3VudCwgaXNWYWxpZCwgb25BcHByb3ZlZCwgb25GYWlsdXJlLCBvblN1Y2Nlc3MsIHNlbmRdKTtcblxuICBjb25zdCBpbnB1dEFtb3VudCA9IHVzZU1lbW8oXG4gICAgKCkgPT5cbiAgICAgIGFtb3VudCA/IHN0cmluZ1RvQmlnaW50KGFtb3VudCwgbmF0aXZlVG9rZW4/LmRlY2ltYWxzID8/IDgpIDogdW5kZWZpbmVkLFxuICAgIFtuYXRpdmVUb2tlbiwgYW1vdW50XSxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxTZW5kRm9ybVxuICAgICAgYWRkcmVzcz17YWRkcmVzc31cbiAgICAgIGlucHV0QW1vdW50PXtpbnB1dEFtb3VudH1cbiAgICAgIHRva2VuPXtuYXRpdmVUb2tlbn1cbiAgICAgIHRva2VuTGlzdD17dG9rZW5MaXN0fVxuICAgICAgb25Db250YWN0Q2hhbmdlZD17KGNvbnRhY3QpID0+IHNldEFkZHJlc3MoY29udGFjdD8uYWRkcmVzc0JUQyA/PyAnJyl9XG4gICAgICBvbkFtb3VudENoYW5nZWQ9eyhuZXdBbW91bnQpID0+IHNldEFtb3VudChuZXdBbW91bnQpfVxuICAgICAgb25Ub2tlbkNoYW5nZWQ9eygpID0+IHt9fSAvLyBub29wLCBCVEMgaGFzIG9ubHkgb25lIHRva2VuXG4gICAgICBpc1NlbmRpbmc9e2lzU2VuZGluZ31cbiAgICAgIGlzVmFsaWQ9e2lzVmFsaWR9XG4gICAgICBpc1ZhbGlkYXRpbmc9e2lzVmFsaWRhdGluZ31cbiAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgIG1heEFtb3VudD17bWF4QW1vdW50fVxuICAgICAgb25TZW5kPXtvblNlbmR9XG4gICAgLz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBKc29uUnBjQmF0Y2hJbnRlcm5hbCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHVzZVF1ZXJ5UGFyYW1zIH0gZnJvbSAnQHNyYy9ob29rcy91c2VRdWVyeVBhcmFtcyc7XG5pbXBvcnQgeyBpc1ZhbGlkQWRkcmVzcyB9IGZyb20gJ0BzcmMvdXRpbHMvaXNBZGRyZXNzVmFsaWQnO1xuaW1wb3J0IHsgaGFuZGxlVHhPdXRjb21lIH0gZnJvbSAnQHNyYy91dGlscy9oYW5kbGVUeE91dGNvbWUnO1xuaW1wb3J0IHsgdXNlU2V0U2VuZERhdGFJblBhcmFtcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlU2V0U2VuZERhdGFJblBhcmFtcyc7XG5pbXBvcnQgeyB1c2VWYWxpZEFkZHJlc3NGcm9tUGFyYW1zIH0gZnJvbSAnLi4vaG9va3MvdXNlVmFsaWRBZGRyZXNzRnJvbVBhcmFtcyc7XG5cbmltcG9ydCB7IHVzZUVWTVNlbmQgfSBmcm9tICcuLi9ob29rcy91c2VTZW5kJztcbmltcG9ydCB7IFNlbmRPcHRpb25zLCBTZW5kUGFnZVByb3BzIH0gZnJvbSAnLi4vbW9kZWxzJztcbmltcG9ydCB7IFNlbmRGb3JtIH0gZnJvbSAnLi9TZW5kRm9ybSc7XG5pbXBvcnQge1xuICBOZXR3b3JrVG9rZW5XaXRoQmFsYW5jZSxcbiAgTmZ0VG9rZW5XaXRoQmFsYW5jZSxcbiAgVG9rZW5UeXBlLFxuICBUb2tlbldpdGhCYWxhbmNlRVZNLFxufSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgc3RyaW5nVG9CaWdpbnQgfSBmcm9tICdAc3JjL3V0aWxzL3N0cmluZ1RvQmlnaW50JztcblxudHlwZSBQcm9wcyA9IFNlbmRQYWdlUHJvcHM8XG4gIEpzb25ScGNCYXRjaEludGVybmFsLFxuICBOZXR3b3JrVG9rZW5XaXRoQmFsYW5jZSxcbiAgRXhjbHVkZTxUb2tlbldpdGhCYWxhbmNlRVZNLCBOZnRUb2tlbldpdGhCYWxhbmNlPltdXG4+O1xuXG5leHBvcnQgY29uc3QgU2VuZEVWTSA9ICh7XG4gIG5ldHdvcmssXG4gIGZyb21BZGRyZXNzLFxuICBtYXhGZWUsXG4gIG5hdGl2ZVRva2VuLFxuICBwcm92aWRlcixcbiAgdG9rZW5MaXN0LFxuXG4gIG9uU3VjY2VzcyxcbiAgb25GYWlsdXJlLFxuICBvbkFwcHJvdmVkLFxufTogUHJvcHMpID0+IHtcbiAgY29uc3Qgc2V0U3RhdGVJblBhcmFtcyA9IHVzZVNldFNlbmREYXRhSW5QYXJhbXMoKTtcbiAgY29uc3QgcGFyYW1zID0gdXNlUXVlcnlQYXJhbXMoKTtcbiAgY29uc3QgdG9rZW5Gcm9tUGFyYW1zID0gdG9rZW5MaXN0LmZpbmQoKHQpID0+IHtcbiAgICBpZiAodC50eXBlID09PSBUb2tlblR5cGUuRVJDMjApIHtcbiAgICAgIHJldHVybiB0LmFkZHJlc3MgPT09IHBhcmFtcy5nZXQoJ3Rva2VuQWRkcmVzcycpO1xuICAgIH0gZWxzZSBpZiAodC50eXBlID09PSBUb2tlblR5cGUuTkFUSVZFKSB7XG4gICAgICByZXR1cm4gdC5zeW1ib2wgPT09IHBhcmFtcy5nZXQoJ3Rva2VuU3ltYm9sJyk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBhZGRyZXNzRnJvbVBhcmFtcyA9IHVzZVZhbGlkQWRkcmVzc0Zyb21QYXJhbXMoaXNWYWxpZEFkZHJlc3MpO1xuICBjb25zdCBbYWRkcmVzcywgc2V0QWRkcmVzc10gPSB1c2VTdGF0ZShhZGRyZXNzRnJvbVBhcmFtcyk7XG4gIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGUodG9rZW5Gcm9tUGFyYW1zKTtcbiAgY29uc3QgW2Ftb3VudCwgc2V0QW1vdW50XSA9IHVzZVN0YXRlKHBhcmFtcy5nZXQoJ2Ftb3VudCcpID8/ICcnKTtcblxuICBjb25zdCB7IGVycm9yLCBpc1NlbmRpbmcsIGlzVmFsaWQsIGlzVmFsaWRhdGluZywgbWF4QW1vdW50LCBzZW5kLCB2YWxpZGF0ZSB9ID1cbiAgICB1c2VFVk1TZW5kKHtcbiAgICAgIGNoYWluSWQ6IGAweCR7bmV0d29yay5jaGFpbklkLnRvU3RyaW5nKDE2KX1gLFxuICAgICAgZnJvbTogZnJvbUFkZHJlc3MsXG4gICAgICBtYXhGZWUsXG4gICAgICBuYXRpdmVUb2tlbixcbiAgICAgIHByb3ZpZGVyLFxuICAgIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgdmFsaWRhdGUoeyBhZGRyZXNzLCB0b2tlbiwgYW1vdW50IH0gYXMgU2VuZE9wdGlvbnMpO1xuXG4gICAgaWYgKGFkZHJlc3MgfHwgdG9rZW4gfHwgYW1vdW50KSB7XG4gICAgICBzZXRTdGF0ZUluUGFyYW1zKHtcbiAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgdG9rZW4sXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgb3B0aW9uczogeyByZXBsYWNlOiB0cnVlIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH0sIFthZGRyZXNzLCBhbW91bnQsIHRva2VuLCB2YWxpZGF0ZSwgc2V0U3RhdGVJblBhcmFtc10pO1xuXG4gIGNvbnN0IG9uU2VuZCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBpc0FwcHJvdmVkLFxuICAgICAgaGFzRXJyb3IsXG4gICAgICByZXN1bHQ6IHR4SGFzaCxcbiAgICAgIGVycm9yOiB0eEVycm9yLFxuICAgIH0gPSBhd2FpdCBoYW5kbGVUeE91dGNvbWUoc2VuZCh7IGFkZHJlc3MsIHRva2VuLCBhbW91bnQgfSBhcyBTZW5kT3B0aW9ucykpO1xuXG4gICAgaWYgKGlzQXBwcm92ZWQpIHtcbiAgICAgIG9uQXBwcm92ZWQoKTtcblxuICAgICAgaWYgKGhhc0Vycm9yKSB7XG4gICAgICAgIG9uRmFpbHVyZSh0eEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uU3VjY2Vzcyh0eEhhc2gpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW2FkZHJlc3MsIGFtb3VudCwgaXNWYWxpZCwgb25BcHByb3ZlZCwgb25GYWlsdXJlLCBvblN1Y2Nlc3MsIHNlbmQsIHRva2VuXSk7XG5cbiAgY29uc3QgaW5wdXRBbW91bnQgPSB1c2VNZW1vKFxuICAgICgpID0+IChhbW91bnQgPyBzdHJpbmdUb0JpZ2ludChhbW91bnQsIHRva2VuPy5kZWNpbWFscyA/PyAxOCkgOiB1bmRlZmluZWQpLFxuICAgIFt0b2tlbiwgYW1vdW50XSxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxTZW5kRm9ybVxuICAgICAgYWRkcmVzcz17YWRkcmVzc31cbiAgICAgIGlucHV0QW1vdW50PXtpbnB1dEFtb3VudH1cbiAgICAgIHRva2VuPXt0b2tlbn1cbiAgICAgIHRva2VuTGlzdD17dG9rZW5MaXN0fVxuICAgICAgb25Db250YWN0Q2hhbmdlZD17KGNvbnRhY3QpID0+IHNldEFkZHJlc3MoY29udGFjdD8uYWRkcmVzcyA/PyAnJyl9XG4gICAgICBvbkFtb3VudENoYW5nZWQ9eyhuZXdBbW91bnQpID0+IHNldEFtb3VudChuZXdBbW91bnQpfVxuICAgICAgb25Ub2tlbkNoYW5nZWQ9eyhuZXdUb2tlbikgPT5cbiAgICAgICAgc2V0VG9rZW4obmV3VG9rZW4gYXMgRXhjbHVkZTxUb2tlbldpdGhCYWxhbmNlRVZNLCBOZnRUb2tlbldpdGhCYWxhbmNlPilcbiAgICAgIH1cbiAgICAgIGlzU2VuZGluZz17aXNTZW5kaW5nfVxuICAgICAgaXNWYWxpZD17aXNWYWxpZH1cbiAgICAgIGlzVmFsaWRhdGluZz17aXNWYWxpZGF0aW5nfVxuICAgICAgZXJyb3I9e2Vycm9yfVxuICAgICAgbWF4QW1vdW50PXttYXhBbW91bnR9XG4gICAgICBvblNlbmQ9e29uU2VuZH1cbiAgICAvPlxuICApO1xufTtcbiIsImltcG9ydCB7IFByb3BzV2l0aENoaWxkcmVuLCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgVHlwb2dyYXBoeSxcbiAgQnV0dG9uLFxuICBTdGFjayxcbiAgU2Nyb2xsYmFycyxcbiAgVG9vbHRpcCxcbiAgc3R5bGVkLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgQ29udGFjdCB9IGZyb20gJ0BhdmFsYWJzL3R5cGVzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7IFRva2VuU2VsZWN0IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlblNlbGVjdCc7XG5pbXBvcnQgeyBTZW5kRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy91dGlscy9zZW5kL21vZGVscyc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VTZW5kQW5hbHl0aWNzRGF0YSB9IGZyb20gJ0BzcmMvaG9va3MvdXNlU2VuZEFuYWx5dGljc0RhdGEnO1xuXG5pbXBvcnQgeyBDb250YWN0SW5wdXQgfSBmcm9tICcuL0NvbnRhY3RJbnB1dCc7XG5pbXBvcnQgeyB1c2VJZGVudGlmeUFkZHJlc3MgfSBmcm9tICcuLi9ob29rcy91c2VJZGVudGlmeUFkZHJlc3MnO1xuaW1wb3J0IHsgZ2V0U2VuZEVycm9yTWVzc2FnZSB9IGZyb20gJy4uL3V0aWxzL3NlbmRFcnJvck1lc3NhZ2VzJztcbmltcG9ydCB7IFRva2VuV2l0aEJhbGFuY2UgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG50eXBlIFNlbmRGb3JtUHJvcHMgPSB7XG4gIGFkZHJlc3M/OiBzdHJpbmc7XG4gIGlucHV0QW1vdW50PzogYmlnaW50O1xuICB0b2tlbkxpc3Q6IFRva2VuV2l0aEJhbGFuY2VbXTtcbiAgdG9rZW4/OiBUb2tlbldpdGhCYWxhbmNlO1xuICBpc1ZhbGlkOiBib29sZWFuO1xuICBpc1ZhbGlkYXRpbmc6IGJvb2xlYW47XG4gIGlzU2VuZGluZzogYm9vbGVhbjtcbiAgbWluQW1vdW50Pzogc3RyaW5nO1xuICBtYXhBbW91bnQ6IHN0cmluZztcbiAgZXJyb3I/OiBTZW5kRXJyb3JNZXNzYWdlO1xuICBvbkFtb3VudENoYW5nZWQobmV3QW1vdW50OiBzdHJpbmcpOiB2b2lkO1xuICBvbkNvbnRhY3RDaGFuZ2VkKG5ld0NvbnRhY3Q/OiBDb250YWN0KTogdm9pZDtcbiAgb25Ub2tlbkNoYW5nZWQobmV3VG9rZW46IFRva2VuV2l0aEJhbGFuY2UpOiB2b2lkO1xuICBvblNlbmQoKTogdm9pZDtcbn07XG5cbmNvbnN0IGdlbmVyYWxFcnJvcnM6IHN0cmluZ1tdID0gW1xuICBTZW5kRXJyb3JNZXNzYWdlLklOU1VGRklDSUVOVF9CQUxBTkNFX0ZPUl9GRUUsXG4gIFNlbmRFcnJvck1lc3NhZ2UuRVhDRVNTSVZFX05FVFdPUktfRkVFLFxuICBTZW5kRXJyb3JNZXNzYWdlLklOVkFMSURfTkVUV09SS19GRUUsXG4gIFNlbmRFcnJvck1lc3NhZ2UuVU5BQkxFX1RPX0ZFVENIX1VUWE9TLFxuXTtcblxuY29uc3QgZXJyb3JzVG9FeGNsdWRlRm9yVG9rZW5TZWxlY3Q6IHN0cmluZ1tdID0gW1xuICBTZW5kRXJyb3JNZXNzYWdlLkFERFJFU1NfUkVRVUlSRUQsXG4gIFNlbmRFcnJvck1lc3NhZ2UuSU5WQUxJRF9BRERSRVNTLFxuICAuLi5nZW5lcmFsRXJyb3JzLFxuXTtcblxuY29uc3QgRmxleFNjcm9sbGJhcnMgPSBzdHlsZWQoU2Nyb2xsYmFycylgXG5cdD4gZGl2IHtcblx0XHRkaXNwbGF5OiBmbGV4O1xuXHR9XG59YDtcblxuZXhwb3J0IGNvbnN0IFNlbmRGb3JtID0gKHtcbiAgYWRkcmVzcyxcbiAgaW5wdXRBbW91bnQsXG4gIHRva2VuLFxuICBpc1ZhbGlkLFxuICBpc1ZhbGlkYXRpbmcsXG4gIGlzU2VuZGluZyxcbiAgbWluQW1vdW50LFxuICBtYXhBbW91bnQsXG4gIGVycm9yLFxuICBvbkFtb3VudENoYW5nZWQsXG4gIG9uQ29udGFjdENoYW5nZWQsXG4gIG9uVG9rZW5DaGFuZ2VkLFxuICBvblNlbmQsXG4gIHRva2VuTGlzdCxcbiAgY2hpbGRyZW4sXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxTZW5kRm9ybVByb3BzPikgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGlkZW50aWZ5QWRkcmVzcyA9IHVzZUlkZW50aWZ5QWRkcmVzcygpO1xuICBjb25zdCBjb250YWN0ID0gdXNlTWVtbyhcbiAgICAoKSA9PiAoYWRkcmVzcyA/IGlkZW50aWZ5QWRkcmVzcyhhZGRyZXNzKSA6IHVuZGVmaW5lZCksXG4gICAgW2FkZHJlc3MsIGlkZW50aWZ5QWRkcmVzc10sXG4gICk7XG4gIGNvbnN0IFtpc0NvbnRhY3RzT3Blbiwgc2V0SXNDb250YWN0c09wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNUb2tlblNlbGVjdE9wZW4sIHNldElzVG9rZW5TZWxlY3RPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgeyBzZW5kVG9rZW5TZWxlY3RlZEFuYWx5dGljcywgc2VuZEFtb3VudEVudGVyZWRBbmFseXRpY3MgfSA9XG4gICAgdXNlU2VuZEFuYWx5dGljc0RhdGEoKTtcblxuICBjb25zdCBmb3JtUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSwgYWxpZ25JdGVtczogJ2NlbnRlcicsIHdpZHRoOiAnMTAwJScsIHB0OiAxIH19PlxuICAgICAgPEZsZXhTY3JvbGxiYXJzXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgbWF4SGVpZ2h0OiAndW5zZXQnLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN0YWNrIHJlZj17Zm9ybVJlZn0gc3g9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4R3JvdzogMSwgbWI6IDIgfX0+XG4gICAgICAgICAgPENvbnRhY3RJbnB1dFxuICAgICAgICAgICAgY29udGFjdD17Y29udGFjdH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV3Q29udGFjdCwgdGFiKSA9PiB7XG4gICAgICAgICAgICAgIG9uQ29udGFjdENoYW5nZWQobmV3Q29udGFjdCk7XG4gICAgICAgICAgICAgIGNhcHR1cmUoJ1NlbmRDb250YWN0U2VsZWN0ZWQnLCB7IGNvbnRhY3RTb3VyY2U6IHRhYiB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBpc0NvbnRhY3RzT3Blbj17aXNDb250YWN0c09wZW59XG4gICAgICAgICAgICBzZXRJc09wZW49eyhvcGVuKSA9PiBzZXRJc0NvbnRhY3RzT3BlbihvcGVuKX1cbiAgICAgICAgICAgIGNvbnRhaW5lclJlZj17Zm9ybVJlZn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgcGw6IDIsXG4gICAgICAgICAgICAgIG10OiAwLjUsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgeyhlcnJvciA9PT0gU2VuZEVycm9yTWVzc2FnZS5BRERSRVNTX1JFUVVJUkVEIHx8XG4gICAgICAgICAgICAgIGVycm9yID09PSBTZW5kRXJyb3JNZXNzYWdlLklOVkFMSURfQUREUkVTUykgJiYgKFxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICBzeD17eyBjb2xvcjogKHRoZW1lKSA9PiB0aGVtZS5wYWxldHRlLmVycm9yLm1haW4gfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtnZXRTZW5kRXJyb3JNZXNzYWdlKGVycm9yKX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgICAgPFN0YWNrIHN4PXt7IHB5OiAwLCBweDogMiwgbXQ6IDQsIHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICAgICAgICA8VG9rZW5TZWxlY3RcbiAgICAgICAgICAgICAgbWF4QW1vdW50PXttYXhBbW91bnQgPyBCaWdJbnQobWF4QW1vdW50KSA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgdG9rZW5zTGlzdD17dG9rZW5MaXN0fVxuICAgICAgICAgICAgICBzZWxlY3RlZFRva2VuPXt0b2tlbn1cbiAgICAgICAgICAgICAgb25Ub2tlbkNoYW5nZT17KG5ld1Rva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgb25Ub2tlbkNoYW5nZWQobmV3VG9rZW4gYXMgVG9rZW5XaXRoQmFsYW5jZSk7XG4gICAgICAgICAgICAgICAgc2VuZFRva2VuU2VsZWN0ZWRBbmFseXRpY3MoJ1NlbmQnKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgaW5wdXRBbW91bnQ9e2lucHV0QW1vdW50fVxuICAgICAgICAgICAgICBvbklucHV0QW1vdW50Q2hhbmdlPXsoeyBhbW91bnQ6IG5ld0Ftb3VudCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgb25BbW91bnRDaGFuZ2VkKG5ld0Ftb3VudCk7XG4gICAgICAgICAgICAgICAgc2VuZEFtb3VudEVudGVyZWRBbmFseXRpY3MoJ1NlbmQnKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25TZWxlY3RUb2dnbGU9eygpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRJc1Rva2VuU2VsZWN0T3Blbigob3BlbikgPT4gIW9wZW4pO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBpc09wZW49e2lzVG9rZW5TZWxlY3RPcGVufVxuICAgICAgICAgICAgICBlcnJvcj17XG4gICAgICAgICAgICAgICAgZXJyb3IgJiZcbiAgICAgICAgICAgICAgICAoZXJyb3JzVG9FeGNsdWRlRm9yVG9rZW5TZWxlY3QuaW5jbHVkZXMoZXJyb3IpXG4gICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgOiBnZXRTZW5kRXJyb3JNZXNzYWdlKGVycm9yLCB7IG1pbkFtb3VudCB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzZXRJc09wZW49eyhvcGVuKSA9PiBzZXRJc1Rva2VuU2VsZWN0T3BlbihvcGVuKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAge2Vycm9yICYmIGdlbmVyYWxFcnJvcnMuaW5jbHVkZXMoZXJyb3IpICYmIChcbiAgICAgICAgICAgIDxTdGFjayBzeD17eyBweTogMCwgcHg6IDIsIG10OiAyLCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGNvbG9yPVwiZXJyb3IubWFpblwiPlxuICAgICAgICAgICAgICAgIHtnZXRTZW5kRXJyb3JNZXNzYWdlKGVycm9yLCB7IG1pbkFtb3VudCB9KX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9GbGV4U2Nyb2xsYmFycz5cbiAgICAgIHshaXNDb250YWN0c09wZW4gJiYgIWlzVG9rZW5TZWxlY3RPcGVuICYmIChcbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICBwdDogMyxcbiAgICAgICAgICAgIHB4OiAyLFxuICAgICAgICAgICAgcGI6IDMsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICBwbGFjZW1lbnQ9XCJ0b3BcIlxuICAgICAgICAgICAgc3g9e3sgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgICAgICAgdGl0bGU9e1xuICAgICAgICAgICAgICBlcnJvciA/IChcbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgICAgICAgIHtnZXRTZW5kRXJyb3JNZXNzYWdlKGVycm9yLCB7IG1pbkFtb3VudCB9KX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZW5kLW5leHQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNvbnRhaW5lZFwiXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uU2VuZH1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzVmFsaWRhdGluZyB8fCAhaXNWYWxpZCB8fCBpc1NlbmRpbmd9XG4gICAgICAgICAgICAgIGlzTG9hZGluZz17aXNTZW5kaW5nfVxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ05leHQnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgR3JvdywgU3RhY2sgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyBoYW5kbGVUeE91dGNvbWUgfSBmcm9tICdAc3JjL3V0aWxzL2hhbmRsZVR4T3V0Y29tZSc7XG5cbmltcG9ydCB7IFNlbmRQYWdlUHJvcHNXaXRoV2FsbGV0UFZNIH0gZnJvbSAnLi4vbW9kZWxzJztcbmltcG9ydCB7IFNlbmRGb3JtIH0gZnJvbSAnLi9TZW5kRm9ybSc7XG5pbXBvcnQgeyB1c2VTZXRTZW5kRGF0YUluUGFyYW1zIH0gZnJvbSAnQHNyYy9ob29rcy91c2VTZXRTZW5kRGF0YUluUGFyYW1zJztcbmltcG9ydCB7IHVzZVF1ZXJ5UGFyYW1zIH0gZnJvbSAnQHNyYy9ob29rcy91c2VRdWVyeVBhcmFtcyc7XG5pbXBvcnQgeyB1c2VQdm1TZW5kIH0gZnJvbSAnLi4vaG9va3MvdXNlU2VuZCc7XG5pbXBvcnQgeyBOb3RTdXBwb3J0ZWRCeVdhbGxldCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vTm90U3VwcG9ydGVkQnlXYWxsZXQnO1xuaW1wb3J0IHsgRnVuY3Rpb25OYW1lcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNGdW5jdGlvbkF2YWlsYWJsZSc7XG5pbXBvcnQgeyBUb2tlbldpdGhCYWxhbmNlUFZNIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IHN0cmluZ1RvQmlnaW50IH0gZnJvbSAnQHNyYy91dGlscy9zdHJpbmdUb0JpZ2ludCc7XG5pbXBvcnQgeyBDdXN0b21GZWVzIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9DdXN0b21GZWVzJztcblxuZXhwb3J0IGNvbnN0IFNlbmRQVk0gPSAoe1xuICBuZXR3b3JrLFxuICBmcm9tQWRkcmVzcyxcbiAgbWF4RmVlLFxuICBuYXRpdmVUb2tlbixcbiAgbmV0d29ya0ZlZSxcbiAgcHJvdmlkZXIsXG4gIHRva2VuTGlzdCxcbiAgYWNjb3VudCxcbiAgb25TdWNjZXNzLFxuICBvbkZhaWx1cmUsXG4gIG9uQXBwcm92ZWQsXG59OiBTZW5kUGFnZVByb3BzV2l0aFdhbGxldFBWTTxcbiAgQXZhbGFuY2hlLkpzb25ScGNQcm92aWRlcixcbiAgVG9rZW5XaXRoQmFsYW5jZVBWTSxcbiAgW1Rva2VuV2l0aEJhbGFuY2VQVk1dXG4+KSA9PiB7XG4gIGNvbnN0IHNldFN0YXRlSW5QYXJhbXMgPSB1c2VTZXRTZW5kRGF0YUluUGFyYW1zKCk7XG4gIGNvbnN0IHBhcmFtcyA9IHVzZVF1ZXJ5UGFyYW1zKCk7XG4gIGNvbnN0IFthZGRyZXNzLCBzZXRBZGRyZXNzXSA9IHVzZVN0YXRlPHN0cmluZz4ocGFyYW1zLmdldCgnYWRkcmVzcycpID8/ICcnKTtcbiAgY29uc3QgW2Ftb3VudCwgc2V0QW1vdW50XSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2dhc1ByaWNlLCBzZXRHYXNQcmljZV0gPSB1c2VTdGF0ZShuZXR3b3JrRmVlLmxvdy5tYXhGZWVQZXJHYXMpO1xuXG4gIGNvbnN0IHtcbiAgICBlcnJvcixcbiAgICBpc1NlbmRpbmcsXG4gICAgaXNWYWxpZCxcbiAgICBpc1ZhbGlkYXRpbmcsXG4gICAgbWF4QW1vdW50LFxuICAgIHNlbmQsXG4gICAgdmFsaWRhdGUsXG4gICAgZXN0aW1hdGVkRmVlLFxuICB9ID0gdXNlUHZtU2VuZCh7XG4gICAgbmV0d29yayxcbiAgICBmcm9tOiBmcm9tQWRkcmVzcyxcbiAgICBtYXhGZWUsXG4gICAgcHJvdmlkZXIsXG4gICAgbmF0aXZlVG9rZW4sXG4gICAgYWNjb3VudCxcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB2YWxpZGF0ZSh7IGFkZHJlc3MsIGFtb3VudCwgZ2FzUHJpY2UsIHRva2VuOiBuYXRpdmVUb2tlbiB9KTtcblxuICAgIGlmIChhZGRyZXNzIHx8IGFtb3VudCkge1xuICAgICAgc2V0U3RhdGVJblBhcmFtcyh7XG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgIHRva2VuOiBuYXRpdmVUb2tlbixcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBvcHRpb25zOiB7IHJlcGxhY2U6IHRydWUgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgW1xuICAgIGFkZHJlc3MsXG4gICAgYW1vdW50LFxuICAgIHZhbGlkYXRlLFxuICAgIHNldFN0YXRlSW5QYXJhbXMsXG4gICAgbmF0aXZlVG9rZW4sXG4gICAgYWNjb3VudCxcbiAgICB0b2tlbkxpc3QsXG4gICAgZ2FzUHJpY2UsXG4gIF0pO1xuXG4gIGNvbnN0IG9uU2VuZCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBpc0FwcHJvdmVkLFxuICAgICAgaGFzRXJyb3IsXG4gICAgICByZXN1bHQ6IHR4SGFzaCxcbiAgICAgIGVycm9yOiB0eEVycm9yLFxuICAgIH0gPSBhd2FpdCBoYW5kbGVUeE91dGNvbWUoXG4gICAgICBzZW5kKHsgYWRkcmVzcywgYW1vdW50LCBnYXNQcmljZSwgdG9rZW46IG5hdGl2ZVRva2VuIH0pLFxuICAgICk7XG5cbiAgICBpZiAoaXNBcHByb3ZlZCkge1xuICAgICAgb25BcHByb3ZlZCgpO1xuXG4gICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgb25GYWlsdXJlKHR4RXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25TdWNjZXNzKHR4SGFzaCk7XG4gICAgICB9XG4gICAgfVxuICB9LCBbXG4gICAgYWRkcmVzcyxcbiAgICBhbW91bnQsXG4gICAgaXNWYWxpZCxcbiAgICBvbkFwcHJvdmVkLFxuICAgIG9uRmFpbHVyZSxcbiAgICBvblN1Y2Nlc3MsXG4gICAgc2VuZCxcbiAgICBnYXNQcmljZSxcbiAgICBuYXRpdmVUb2tlbixcbiAgXSk7XG5cbiAgY29uc3QgaW5wdXRBbW91bnQgPSB1c2VNZW1vKFxuICAgICgpID0+XG4gICAgICBhbW91bnQgPyBzdHJpbmdUb0JpZ2ludChhbW91bnQsIG5hdGl2ZVRva2VuPy5kZWNpbWFscyA/PyAxOCkgOiB1bmRlZmluZWQsXG4gICAgW25hdGl2ZVRva2VuLCBhbW91bnRdLFxuICApO1xuXG4gIGNvbnN0IG9uRmVlQ3VzdG9taXplZCA9IHVzZUNhbGxiYWNrKCh2YWx1ZXM6IHsgbWF4RmVlUGVyR2FzOiBiaWdpbnQgfSkgPT4ge1xuICAgIHNldEdhc1ByaWNlKHZhbHVlcy5tYXhGZWVQZXJHYXMpO1xuICB9LCBbXSk7XG5cbiAgaWYgKGFjY291bnQgJiYgIWFjY291bnQuYWRkcmVzc1BWTSkge1xuICAgIHJldHVybiAoXG4gICAgICA8Tm90U3VwcG9ydGVkQnlXYWxsZXRcbiAgICAgICAgZnVuY3Rpb25OYW1lPXtGdW5jdGlvbk5hbWVzLlRPS0VOX0RFVEFJTFN9XG4gICAgICAgIG5ldHdvcms9e25ldHdvcms/LmNoYWluTmFtZSB8fCAnVGVzdG5ldCd9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxTZW5kRm9ybVxuICAgICAgYWRkcmVzcz17YWRkcmVzc31cbiAgICAgIGlucHV0QW1vdW50PXtpbnB1dEFtb3VudH1cbiAgICAgIHRva2VuPXtuYXRpdmVUb2tlbn1cbiAgICAgIHRva2VuTGlzdD17dG9rZW5MaXN0fVxuICAgICAgb25Db250YWN0Q2hhbmdlZD17KGNvbnRhY3QpID0+IHtcbiAgICAgICAgc2V0QWRkcmVzcyhjb250YWN0Py5hZGRyZXNzWFAgPz8gJycpO1xuICAgICAgfX1cbiAgICAgIG9uQW1vdW50Q2hhbmdlZD17KG5ld0Ftb3VudCkgPT4gc2V0QW1vdW50KG5ld0Ftb3VudCl9XG4gICAgICBvblRva2VuQ2hhbmdlZD17KCkgPT4ge319IC8vIG5vb3AsIEFWQVggaGFzIG9ubHkgb25lIHRva2VuXG4gICAgICBpc1NlbmRpbmc9e2lzU2VuZGluZ31cbiAgICAgIGlzVmFsaWQ9e2lzVmFsaWR9XG4gICAgICBpc1ZhbGlkYXRpbmc9e2lzVmFsaWRhdGluZ31cbiAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgIG1heEFtb3VudD17bWF4QW1vdW50fVxuICAgICAgb25TZW5kPXtvblNlbmR9XG4gICAgPlxuICAgICAgPEdyb3cgaW49e0Jvb2xlYW4oZXN0aW1hdGVkRmVlKX0gbW91bnRPbkVudGVyIHVubW91bnRPbkV4aXQ+XG4gICAgICAgIDxTdGFjayBzeD17eyBweTogMCwgcHg6IDIsIG10OiAyLCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgIDxDdXN0b21GZWVzXG4gICAgICAgICAgICBpc0NvbGxhcHNpYmxlXG4gICAgICAgICAgICBuZXR3b3JrPXtuZXR3b3JrfVxuICAgICAgICAgICAgbmV0d29ya0ZlZT17bmV0d29ya0ZlZX1cbiAgICAgICAgICAgIG1heEZlZVBlckdhcz17Z2FzUHJpY2V9XG4gICAgICAgICAgICBtYXhHYXNQcmljZT17KG5ldHdvcmtGZWUuYmFzZUZlZSA/PyAwbikgKiAybn1cbiAgICAgICAgICAgIGVzdGltYXRlZEZlZT17ZXN0aW1hdGVkRmVlfVxuICAgICAgICAgICAgbGltaXQ9ezB9XG4gICAgICAgICAgICBvbkNoYW5nZT17b25GZWVDdXN0b21pemVkfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L0dyb3c+XG4gICAgPC9TZW5kRm9ybT5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgaGFuZGxlVHhPdXRjb21lIH0gZnJvbSAnQHNyYy91dGlscy9oYW5kbGVUeE91dGNvbWUnO1xuXG5pbXBvcnQgeyBTZW5kUGFnZVByb3BzV2l0aFdhbGxldFNWTSwgU29sYW5hU2VuZE9wdGlvbnMgfSBmcm9tICcuLi9tb2RlbHMnO1xuaW1wb3J0IHsgU2VuZEZvcm0gfSBmcm9tICcuL1NlbmRGb3JtJztcbmltcG9ydCB7IHVzZVNldFNlbmREYXRhSW5QYXJhbXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVNldFNlbmREYXRhSW5QYXJhbXMnO1xuaW1wb3J0IHsgdXNlUXVlcnlQYXJhbXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVF1ZXJ5UGFyYW1zJztcbmltcG9ydCB7IE5vdFN1cHBvcnRlZEJ5V2FsbGV0IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ob3RTdXBwb3J0ZWRCeVdhbGxldCc7XG5pbXBvcnQgeyBGdW5jdGlvbk5hbWVzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VJc0Z1bmN0aW9uQXZhaWxhYmxlJztcbmltcG9ydCB7XG4gIFRva2VuVHlwZSxcbiAgVG9rZW5XaXRoQmFsYW5jZVNQTCxcbiAgVG9rZW5XaXRoQmFsYW5jZVNWTSxcbn0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IHN0cmluZ1RvQmlnaW50IH0gZnJvbSAnQHNyYy91dGlscy9zdHJpbmdUb0JpZ2ludCc7XG5pbXBvcnQgeyB1c2VTdm1TZW5kIH0gZnJvbSAnLi4vaG9va3MvdXNlU2VuZC91c2VTVk1TZW5kJztcbmltcG9ydCB7IFNvbGFuYVByb3ZpZGVyIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5cbnR5cGUgU29sYW5hVG9rZW4gPSBUb2tlbldpdGhCYWxhbmNlU1ZNIHwgVG9rZW5XaXRoQmFsYW5jZVNQTDtcblxuZXhwb3J0IGNvbnN0IFNlbmRTVk0gPSAoe1xuICBuZXR3b3JrLFxuICBmcm9tQWRkcmVzcyxcbiAgbWF4RmVlLFxuICBuYXRpdmVUb2tlbixcbiAgcHJvdmlkZXIsXG4gIHRva2VuTGlzdCxcbiAgYWNjb3VudCxcbiAgb25TdWNjZXNzLFxuICBvbkZhaWx1cmUsXG4gIG9uQXBwcm92ZWQsXG59OiBTZW5kUGFnZVByb3BzV2l0aFdhbGxldFNWTTxcbiAgU29sYW5hUHJvdmlkZXIsXG4gIFRva2VuV2l0aEJhbGFuY2VTVk0sXG4gIFNvbGFuYVRva2VuW11cbj4pID0+IHtcbiAgY29uc3Qgc2V0U3RhdGVJblBhcmFtcyA9IHVzZVNldFNlbmREYXRhSW5QYXJhbXMoKTtcbiAgY29uc3QgcGFyYW1zID0gdXNlUXVlcnlQYXJhbXMoKTtcbiAgY29uc3QgdG9rZW5Gcm9tUGFyYW1zID0gdG9rZW5MaXN0LmZpbmQoKHQpID0+IHtcbiAgICBpZiAodC50eXBlID09PSBUb2tlblR5cGUuU1BMKSB7XG4gICAgICByZXR1cm4gdC5hZGRyZXNzID09PSBwYXJhbXMuZ2V0KCd0b2tlbkFkZHJlc3MnKTtcbiAgICB9IGVsc2UgaWYgKHQudHlwZSA9PT0gVG9rZW5UeXBlLk5BVElWRSkge1xuICAgICAgcmV0dXJuIHQuc3ltYm9sID09PSBwYXJhbXMuZ2V0KCd0b2tlblN5bWJvbCcpO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IFthZGRyZXNzLCBzZXRBZGRyZXNzXSA9IHVzZVN0YXRlPHN0cmluZz4ocGFyYW1zLmdldCgnYWRkcmVzcycpID8/ICcnKTtcbiAgY29uc3QgW2Ftb3VudCwgc2V0QW1vdW50XSA9IHVzZVN0YXRlKHBhcmFtcy5nZXQoJ2Ftb3VudCcpID8/ICcnKTtcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZTxTb2xhbmFUb2tlbiB8IHVuZGVmaW5lZD4odG9rZW5Gcm9tUGFyYW1zKTtcblxuICBjb25zdCB7XG4gICAgZXJyb3IsXG4gICAgaXNTZW5kaW5nLFxuICAgIGlzVmFsaWQsXG4gICAgaXNWYWxpZGF0aW5nLFxuICAgIG1pbkFtb3VudCxcbiAgICBtYXhBbW91bnQsXG4gICAgc2VuZCxcbiAgICB2YWxpZGF0ZSxcbiAgfSA9IHVzZVN2bVNlbmQoe1xuICAgIGZyb206IGZyb21BZGRyZXNzLFxuICAgIG1heEZlZSxcbiAgICBwcm92aWRlcixcbiAgICBuYXRpdmVUb2tlbixcbiAgICBhY2NvdW50LFxuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHZhbGlkYXRlKHsgYWRkcmVzcywgYW1vdW50LCB0b2tlbiB9IGFzIFNvbGFuYVNlbmRPcHRpb25zKTtcblxuICAgIGlmIChhZGRyZXNzIHx8IGFtb3VudCB8fCB0b2tlbikge1xuICAgICAgc2V0U3RhdGVJblBhcmFtcyh7XG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgIHRva2VuLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIG9wdGlvbnM6IHsgcmVwbGFjZTogdHJ1ZSB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9LCBbYWRkcmVzcywgYW1vdW50LCB2YWxpZGF0ZSwgc2V0U3RhdGVJblBhcmFtcywgYWNjb3VudCwgdG9rZW4sIHRva2VuTGlzdF0pO1xuXG4gIGNvbnN0IG9uU2VuZCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBpc0FwcHJvdmVkLFxuICAgICAgaGFzRXJyb3IsXG4gICAgICByZXN1bHQ6IHR4SGFzaCxcbiAgICAgIGVycm9yOiB0eEVycm9yLFxuICAgIH0gPSBhd2FpdCBoYW5kbGVUeE91dGNvbWUoXG4gICAgICBzZW5kKHsgYWRkcmVzcywgYW1vdW50LCB0b2tlbiB9IGFzIFNvbGFuYVNlbmRPcHRpb25zKSxcbiAgICApO1xuXG4gICAgaWYgKGlzQXBwcm92ZWQpIHtcbiAgICAgIG9uQXBwcm92ZWQoKTtcblxuICAgICAgaWYgKGhhc0Vycm9yKSB7XG4gICAgICAgIG9uRmFpbHVyZSh0eEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uU3VjY2Vzcyh0eEhhc2gpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW2FkZHJlc3MsIGFtb3VudCwgaXNWYWxpZCwgb25BcHByb3ZlZCwgb25GYWlsdXJlLCBvblN1Y2Nlc3MsIHNlbmQsIHRva2VuXSk7XG5cbiAgY29uc3QgaW5wdXRBbW91bnQgPSB1c2VNZW1vKFxuICAgICgpID0+IChhbW91bnQgPyBzdHJpbmdUb0JpZ2ludChhbW91bnQsIHRva2VuPy5kZWNpbWFscyA/PyA5KSA6IHVuZGVmaW5lZCksXG4gICAgW3Rva2VuPy5kZWNpbWFscywgYW1vdW50XSxcbiAgKTtcblxuICBpZiAoYWNjb3VudCAmJiAhYWNjb3VudC5hZGRyZXNzU1ZNKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxOb3RTdXBwb3J0ZWRCeVdhbGxldFxuICAgICAgICBmdW5jdGlvbk5hbWU9e0Z1bmN0aW9uTmFtZXMuVE9LRU5fREVUQUlMU31cbiAgICAgICAgbmV0d29yaz17bmV0d29yaz8uY2hhaW5OYW1lIHx8ICdUZXN0bmV0J31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFNlbmRGb3JtXG4gICAgICBhZGRyZXNzPXthZGRyZXNzfVxuICAgICAgaW5wdXRBbW91bnQ9e2lucHV0QW1vdW50fVxuICAgICAgdG9rZW49e3Rva2VufVxuICAgICAgdG9rZW5MaXN0PXt0b2tlbkxpc3R9XG4gICAgICBvbkNvbnRhY3RDaGFuZ2VkPXsoY29udGFjdCkgPT4ge1xuICAgICAgICBzZXRBZGRyZXNzKGNvbnRhY3Q/LmFkZHJlc3NTVk0gPz8gJycpO1xuICAgICAgfX1cbiAgICAgIG9uQW1vdW50Q2hhbmdlZD17KG5ld0Ftb3VudCkgPT4gc2V0QW1vdW50KG5ld0Ftb3VudCl9XG4gICAgICBvblRva2VuQ2hhbmdlZD17KG5ld1Rva2VuKSA9PiBzZXRUb2tlbihuZXdUb2tlbiBhcyBTb2xhbmFUb2tlbil9XG4gICAgICBpc1NlbmRpbmc9e2lzU2VuZGluZ31cbiAgICAgIGlzVmFsaWQ9e2lzVmFsaWR9XG4gICAgICBpc1ZhbGlkYXRpbmc9e2lzVmFsaWRhdGluZ31cbiAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgIG1pbkFtb3VudD17bWluQW1vdW50fVxuICAgICAgbWF4QW1vdW50PXttYXhBbW91bnR9XG4gICAgICBvblNlbmQ9e29uU2VuZH1cbiAgICAvPlxuICApO1xufTtcbiIsImV4cG9ydCAqIGZyb20gJy4vbW9kZWxzJztcbmV4cG9ydCAqIGZyb20gJy4vdXNlQVZNU2VuZCc7XG5leHBvcnQgKiBmcm9tICcuL3VzZUVWTVNlbmQnO1xuZXhwb3J0ICogZnJvbSAnLi91c2VQVk1TZW5kJztcbmV4cG9ydCAqIGZyb20gJy4vdXNlQlRDU2VuZCc7XG4iLCJpbXBvcnQge1xuICBBdmFsYW5jaGUsXG4gIEJpdGNvaW5Qcm92aWRlcixcbiAgSnNvblJwY0JhdGNoSW50ZXJuYWwsXG4gIFNvbGFuYVByb3ZpZGVyLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tICdAYXZhbGFicy9jb3JlLWNoYWlucy1zZGsnO1xuXG5pbXBvcnQge1xuICBCYXNlU2VuZE9wdGlvbnMsXG4gIE5hdGl2ZVNlbmRPcHRpb25zLFxuICBQVk1TZW5kT3B0aW9ucyxcbiAgU2VuZE9wdGlvbnMsXG4gIFNvbGFuYVNlbmRPcHRpb25zLFxufSBmcm9tICcuLi8uLi9tb2RlbHMnO1xuXG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyBFbnN1cmVEZWZpbmVkIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL21vZGVscyc7XG5pbXBvcnQgeyBTZW5kRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy91dGlscy9zZW5kL21vZGVscyc7XG5pbXBvcnQge1xuICBOZXR3b3JrVG9rZW5XaXRoQmFsYW5jZSxcbiAgVG9rZW5XaXRoQmFsYW5jZUFWTSxcbiAgVG9rZW5XaXRoQmFsYW5jZUJUQyxcbiAgVG9rZW5XaXRoQmFsYW5jZVBWTSxcbn0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IFRva2VuV2l0aEJhbGFuY2VTVk0gfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG50eXBlIENvbW1vbkFkYXB0ZXJPcHRpb25zPFByb3ZpZGVyLCBUb2tlbj4gPSB7XG4gIGZyb206IHN0cmluZztcbiAgcHJvdmlkZXI6IFByb3ZpZGVyO1xuICBtYXhGZWU6IGJpZ2ludDtcbiAgbmF0aXZlVG9rZW46IFRva2VuO1xufTtcblxuZXhwb3J0IHR5cGUgQWRhcHRlck9wdGlvbnNFVk0gPSB7XG4gIGNoYWluSWQ6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEFkYXB0ZXJPcHRpb25zQlRDID0ge1xuICBpc01haW5uZXQ6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBBZGFwdGVyT3B0aW9uc1NWTSA9IHtcbiAgYWNjb3VudDogU3ZtQ2FwYWJsZUFjY291bnQ7XG59O1xuXG5leHBvcnQgdHlwZSBBdm1DYXBhYmxlQWNjb3VudCA9IEVuc3VyZURlZmluZWQ8XG4gIEFjY291bnQsXG4gICdhZGRyZXNzQVZNJyB8ICdhZGRyZXNzQ29yZUV0aCdcbj47XG5cbmV4cG9ydCBjb25zdCBpc0F2bUNhcGFibGVBY2NvdW50ID0gKFxuICBhY2NvdW50PzogQWNjb3VudCxcbik6IGFjY291bnQgaXMgQXZtQ2FwYWJsZUFjY291bnQgPT5cbiAgQm9vbGVhbihhY2NvdW50ICYmIGFjY291bnQuYWRkcmVzc0FWTSAmJiBhY2NvdW50LmFkZHJlc3NDb3JlRXRoKTtcblxuZXhwb3J0IHR5cGUgUHZtQ2FwYWJsZUFjY291bnQgPSBFbnN1cmVEZWZpbmVkPFxuICBBY2NvdW50LFxuICAnYWRkcmVzc1BWTScgfCAnYWRkcmVzc0NvcmVFdGgnXG4+O1xuXG5leHBvcnQgdHlwZSBTdm1DYXBhYmxlQWNjb3VudCA9IEVuc3VyZURlZmluZWQ8QWNjb3VudCwgJ2FkZHJlc3NTVk0nPjtcblxuZXhwb3J0IGNvbnN0IGlzUHZtQ2FwYWJsZUFjY291bnQgPSAoXG4gIGFjY291bnQ/OiBBY2NvdW50LFxuKTogYWNjb3VudCBpcyBQdm1DYXBhYmxlQWNjb3VudCA9PlxuICBCb29sZWFuKGFjY291bnQgJiYgYWNjb3VudC5hZGRyZXNzUFZNICYmIGFjY291bnQuYWRkcmVzc0NvcmVFdGgpO1xuXG5leHBvcnQgY29uc3QgaXNTdm1DYXBhYmxlQWNjb3VudCA9IChcbiAgYWNjb3VudD86IEFjY291bnQsXG4pOiBhY2NvdW50IGlzIFN2bUNhcGFibGVBY2NvdW50ID0+IEJvb2xlYW4oYWNjb3VudCAmJiBhY2NvdW50LmFkZHJlc3NTVk0pO1xuXG5leHBvcnQgdHlwZSBBZGFwdGVyT3B0aW9uc1AgPSB7XG4gIG5ldHdvcms6IE5ldHdvcms7XG4gIGFjY291bnQ6IFB2bUNhcGFibGVBY2NvdW50O1xufTtcblxuZXhwb3J0IHR5cGUgQWRhcHRlck9wdGlvbnNYID0ge1xuICBuZXR3b3JrOiBOZXR3b3JrO1xuICBhY2NvdW50OiBBdm1DYXBhYmxlQWNjb3VudDtcbn07XG5cbnR5cGUgU2VuZEFkYXB0ZXI8XG4gIFByb3ZpZGVyID0gdW5rbm93bixcbiAgTmV0d29ya1NlbmRPcHRpb25zID0gdW5rbm93bixcbiAgQ3VzdG9tT3B0aW9ucyA9IHVua25vd24sXG4gIFRva2VuID0gTmV0d29ya1Rva2VuV2l0aEJhbGFuY2UsXG4gIEFkZGl0aW9uYWxPdXRwdXQgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbj4gPSAob3B0aW9uczogQ29tbW9uQWRhcHRlck9wdGlvbnM8UHJvdmlkZXIsIFRva2VuPiAmIEN1c3RvbU9wdGlvbnMpID0+IHtcbiAgaXNTZW5kaW5nOiBib29sZWFuO1xuICBpc1ZhbGlkYXRpbmc6IGJvb2xlYW47XG4gIGlzVmFsaWQ6IGJvb2xlYW47XG4gIG1heEFtb3VudDogc3RyaW5nO1xuICBlcnJvcj86IFNlbmRFcnJvck1lc3NhZ2U7XG5cbiAgc2VuZChvcHRpb25zOiBOZXR3b3JrU2VuZE9wdGlvbnMpOiBQcm9taXNlPHN0cmluZz47XG4gIHZhbGlkYXRlKG9wdGlvbnM6IFBhcnRpYWw8TmV0d29ya1NlbmRPcHRpb25zPik6IFByb21pc2U8dm9pZD47XG59ICYgQWRkaXRpb25hbE91dHB1dDtcblxuZXhwb3J0IHR5cGUgU2VuZEFkYXB0ZXJFVk0gPSBTZW5kQWRhcHRlcjxcbiAgSnNvblJwY0JhdGNoSW50ZXJuYWwsXG4gIFNlbmRPcHRpb25zLFxuICBBZGFwdGVyT3B0aW9uc0VWTSxcbiAgTmV0d29ya1Rva2VuV2l0aEJhbGFuY2Vcbj47XG5cbmV4cG9ydCB0eXBlIFNlbmRBZGFwdGVyQlRDID0gU2VuZEFkYXB0ZXI8XG4gIEJpdGNvaW5Qcm92aWRlcixcbiAgQmFzZVNlbmRPcHRpb25zLFxuICBBZGFwdGVyT3B0aW9uc0JUQyxcbiAgVG9rZW5XaXRoQmFsYW5jZUJUQ1xuPjtcblxuZXhwb3J0IHR5cGUgU2VuZEFkYXB0ZXJTVk0gPSBTZW5kQWRhcHRlcjxcbiAgU29sYW5hUHJvdmlkZXIsXG4gIFNvbGFuYVNlbmRPcHRpb25zLFxuICBBZGFwdGVyT3B0aW9uc1NWTSxcbiAgVG9rZW5XaXRoQmFsYW5jZVNWTSxcbiAge1xuICAgIG1pbkFtb3VudD86IHN0cmluZztcbiAgfVxuPjtcblxuZXhwb3J0IHR5cGUgU2VuZEFkYXB0ZXJQVk0gPSBTZW5kQWRhcHRlcjxcbiAgQXZhbGFuY2hlLkpzb25ScGNQcm92aWRlcixcbiAgUFZNU2VuZE9wdGlvbnMsXG4gIEFkYXB0ZXJPcHRpb25zUCxcbiAgVG9rZW5XaXRoQmFsYW5jZVBWTSxcbiAge1xuICAgIGVzdGltYXRlZEZlZTogYmlnaW50O1xuICB9XG4+O1xuXG5leHBvcnQgdHlwZSBTZW5kQWRhcHRlckFWTSA9IFNlbmRBZGFwdGVyPFxuICBBdmFsYW5jaGUuSnNvblJwY1Byb3ZpZGVyLFxuICBOYXRpdmVTZW5kT3B0aW9ucyxcbiAgQWRhcHRlck9wdGlvbnNYLFxuICBUb2tlbldpdGhCYWxhbmNlQVZNXG4+O1xuIiwiaW1wb3J0IEJpZyBmcm9tICdiaWcuanMnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICdAYXZhbGFicy9hdmFsYW5jaGVqcyc7XG5pbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcbmltcG9ydCB7IGJpZ1RvQmlnSW50LCByZXNvbHZlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBGZWF0dXJlR2F0ZXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmVhdHVyZUZsYWdzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRQcm92aWRlcic7XG5pbXBvcnQgeyBTZW5kRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy91dGlscy9zZW5kL21vZGVscyc7XG5pbXBvcnQgeyBpc1ZhbGlkQXZtQWRkcmVzcyB9IGZyb20gJ0BzcmMvdXRpbHMvaXNBZGRyZXNzVmFsaWQnO1xuaW1wb3J0IHsgc3RyaXBBZGRyZXNzUHJlZml4IH0gZnJvbSAnQHNyYy91dGlscy9zdHJpcEFkZHJlc3NQcmVmaXgnO1xuaW1wb3J0IHsgREFwcFByb3ZpZGVyUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9kQXBwQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB0eXBlIHsgQXZhbGFuY2hlU2VuZFRyYW5zYWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvaGFuZGxlcnMvYXZhbGFuY2hlX3NlbmRUcmFuc2FjdGlvbic7XG5cbmltcG9ydCB7IGdldE1heFV0eG9TZXQgfSBmcm9tICcuLi8uLi91dGlscy9nZXRNYXhVdHhvcyc7XG5pbXBvcnQgeyBTZW5kQWRhcHRlckFWTSB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IEFWTVNlbmRPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzJztcbmltcG9ydCB7IGNvcnJlY3RBZGRyZXNzQnlQcmVmaXggfSBmcm9tICcuLi8uLi91dGlscy9jb3JyZWN0QWRkcmVzc0J5UHJlZml4JztcblxuY29uc3QgWENIQUlOX0FMSUFTID0gJ1gnIGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgdXNlQXZtU2VuZDogU2VuZEFkYXB0ZXJBVk0gPSAoe1xuICBuZXR3b3JrLFxuICBwcm92aWRlcixcbiAgYWNjb3VudCxcbiAgbWF4RmVlLFxufSkgPT4ge1xuICBjb25zdCB7IHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG5cbiAgY29uc3QgeyBmZWF0dXJlRmxhZ3MgfSA9IHVzZUZlYXR1cmVGbGFnQ29udGV4dCgpO1xuICBjb25zdCB7IGlzTGVkZ2VyV2FsbGV0IH0gPSB1c2VXYWxsZXRDb250ZXh0KCk7XG5cbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxTZW5kRXJyb3JNZXNzYWdlPigpO1xuICBjb25zdCBbaXNWYWxpZGF0aW5nLCBzZXRJc1ZhbGlkYXRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNTZW5kaW5nLCBzZXRJc1NlbmRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IFttYXhBbW91bnQsIHNldE1heEFtb3VudF0gPSB1c2VTdGF0ZSgnMCcpO1xuXG4gIGNvbnN0IHdhbGxldCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBuZXcgQXZhbGFuY2hlLkFkZHJlc3NXYWxsZXQoXG4gICAgICBhY2NvdW50LmFkZHJlc3NDLFxuICAgICAgc3RyaXBBZGRyZXNzUHJlZml4KGFjY291bnQuYWRkcmVzc0NvcmVFdGgpLFxuICAgICAgW3N0cmlwQWRkcmVzc1ByZWZpeChhY2NvdW50LmFkZHJlc3NBVk0pXSxcbiAgICAgIHN0cmlwQWRkcmVzc1ByZWZpeChhY2NvdW50LmFkZHJlc3NBVk0pLFxuICAgICAgcHJvdmlkZXIgYXMgQXZhbGFuY2hlLkpzb25ScGNQcm92aWRlcixcbiAgICApO1xuICB9LCBbYWNjb3VudCwgcHJvdmlkZXJdKTtcblxuICBjb25zdCBjaGVja0Z1bmN0aW9uQXZhaWxhYmlsaXR5ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICghZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5TRU5EX1hfQ0hBSU5dKSB7XG4gICAgICByZXR1cm4gU2VuZEVycm9yTWVzc2FnZS5TRU5EX05PVF9BVkFJTEFCTEU7XG4gICAgfVxuICB9LCBbZmVhdHVyZUZsYWdzXSk7XG5cbiAgZnVuY3Rpb24gc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKG1lc3NhZ2U6IFNlbmRFcnJvck1lc3NhZ2UpIHtcbiAgICBzZXRFcnJvcihtZXNzYWdlKTtcbiAgICBzZXRJc1ZhbGlkYXRpbmcoZmFsc2UpO1xuICB9XG5cbiAgY29uc3QgdmFsaWRhdGUgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAob3B0aW9uczogQVZNU2VuZE9wdGlvbnMpID0+IHtcbiAgICAgIGNvbnN0IHsgYWRkcmVzcywgdG9rZW4sIGFtb3VudCB9ID0gb3B0aW9ucztcblxuICAgICAgY29uc3QgYW1vdW50VG9Vc2UgPSBhbW91bnQgPyBhbW91bnQgOiAnMCc7XG5cbiAgICAgIHNldElzVmFsaWRhdGluZyh0cnVlKTtcbiAgICAgIHNldEVycm9yKHVuZGVmaW5lZCk7XG5cbiAgICAgIGNvbnN0IGVycm9yUmVhc29uID0gY2hlY2tGdW5jdGlvbkF2YWlsYWJpbGl0eSgpO1xuXG4gICAgICBpZiAoZXJyb3JSZWFzb24pIHtcbiAgICAgICAgcmV0dXJuIHNldEVycm9yQW5kRW5kVmFsaWRhdGluZyhlcnJvclJlYXNvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIHVzaW5nIGZpbHRlcmVkIFVUWE9zIGJlY2F1c2UgdGhlcmUgaXMgc2l6ZSBsaW1pdFxuICAgICAgY29uc3QgW3V0eG9zLCB1dHhvc0Vycm9yXSA9IGF3YWl0IHJlc29sdmUoXG4gICAgICAgIGdldE1heFV0eG9TZXQoaXNMZWRnZXJXYWxsZXQsIHByb3ZpZGVyLCB3YWxsZXQsIG5ldHdvcmspLFxuICAgICAgKTtcblxuICAgICAgaWYgKHV0eG9zRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHNldEVycm9yQW5kRW5kVmFsaWRhdGluZyhTZW5kRXJyb3JNZXNzYWdlLlVOQUJMRV9UT19GRVRDSF9VVFhPUyk7XG4gICAgICB9XG5cbiAgICAgIC8vIG1heE1vdW50IGNhbGN1bGF0aW9uXG4gICAgICBjb25zdCBhdmFpbGFibGUgPSB1dHhvcz8uYmFsYW5jZS5hdmFpbGFibGUgPz8gQmlnSW50KDApO1xuICAgICAgY29uc3QgbWF4QXZhaWxhYmxlID0gYXZhaWxhYmxlIC0gbWF4RmVlO1xuICAgICAgY29uc3QgYW1vdW50QmlnSW50ID0gYmlnVG9CaWdJbnQoQmlnKGFtb3VudFRvVXNlKSwgdG9rZW4uZGVjaW1hbHMpO1xuICAgICAgY29uc3QgbWF2VmFsdWUgPSBtYXhBdmFpbGFibGUudG9TdHJpbmcoKTtcbiAgICAgIHNldE1heEFtb3VudChtYXZWYWx1ZSk7XG5cbiAgICAgIGlmICghYWRkcmVzcykge1xuICAgICAgICByZXR1cm4gc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuQUREUkVTU19SRVFVSVJFRCk7XG4gICAgICB9XG4gICAgICBpZiAoIWlzVmFsaWRBdm1BZGRyZXNzKGFkZHJlc3MpKSB7XG4gICAgICAgIHJldHVybiBzZXRFcnJvckFuZEVuZFZhbGlkYXRpbmcoU2VuZEVycm9yTWVzc2FnZS5JTlZBTElEX0FERFJFU1MpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWFtb3VudCB8fCBhbW91bnQgPT09ICcwJykge1xuICAgICAgICByZXR1cm4gc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuQU1PVU5UX1JFUVVJUkVEKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1heEF2YWlsYWJsZSA8IEJpZ0ludCgwKSB8fCBhbW91bnRCaWdJbnQgPiBtYXhBdmFpbGFibGUpIHtcbiAgICAgICAgcmV0dXJuIHNldEVycm9yQW5kRW5kVmFsaWRhdGluZyhTZW5kRXJyb3JNZXNzYWdlLklOU1VGRklDSUVOVF9CQUxBTkNFKTtcbiAgICAgIH1cbiAgICAgIHNldEVycm9yKHVuZGVmaW5lZCk7XG4gICAgICBzZXRJc1ZhbGlkYXRpbmcoZmFsc2UpO1xuICAgIH0sXG4gICAgW1xuICAgICAgY2hlY2tGdW5jdGlvbkF2YWlsYWJpbGl0eSxcbiAgICAgIGlzTGVkZ2VyV2FsbGV0LFxuICAgICAgbWF4RmVlLFxuICAgICAgbmV0d29yayxcbiAgICAgIHByb3ZpZGVyLFxuICAgICAgd2FsbGV0LFxuICAgIF0sXG4gICk7XG5cbiAgY29uc3Qgc2VuZCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh7IGFkZHJlc3MsIHRva2VuLCBhbW91bnQgfTogQVZNU2VuZE9wdGlvbnMpID0+IHtcbiAgICAgIGNoZWNrRnVuY3Rpb25BdmFpbGFiaWxpdHkoKTtcblxuICAgICAgc2V0SXNTZW5kaW5nKHRydWUpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdXR4b3MgPSBhd2FpdCBnZXRNYXhVdHhvU2V0KFxuICAgICAgICAgIGlzTGVkZ2VyV2FsbGV0LFxuICAgICAgICAgIHByb3ZpZGVyLFxuICAgICAgICAgIHdhbGxldCxcbiAgICAgICAgICBuZXR3b3JrLFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBhdmF4ID0gcHJvdmlkZXIuZ2V0QXZheElEKCk7XG4gICAgICAgIGNvbnN0IGFtb3VudEJpZ0ludCA9IGJpZ1RvQmlnSW50KEJpZyhhbW91bnQpLCB0b2tlbi5kZWNpbWFscyk7XG4gICAgICAgIGNvbnN0IGNoYW5nZUFkZHJlc3MgPSB1dGlscy5wYXJzZShhY2NvdW50LmFkZHJlc3NBVk0pWzJdO1xuXG4gICAgICAgIGNvbnN0IHVuc2lnbmVkVHggPSB3YWxsZXQuYmFzZVRYKHtcbiAgICAgICAgICB1dHhvU2V0OiB1dHhvcy51dHhvcyxcbiAgICAgICAgICBjaGFpbjogWENIQUlOX0FMSUFTLFxuICAgICAgICAgIHRvQWRkcmVzczogY29ycmVjdEFkZHJlc3NCeVByZWZpeChhZGRyZXNzLCAnWC0nKSxcbiAgICAgICAgICBhbW91bnRzUGVyQXNzZXQ6IHtcbiAgICAgICAgICAgIFthdmF4XTogYW1vdW50QmlnSW50LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgY2hhbmdlQWRkcmVzc2VzOiBbY2hhbmdlQWRkcmVzc10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbWFuYWdlciA9IHV0aWxzLmdldE1hbmFnZXJGb3JWTSh1bnNpZ25lZFR4LmdldFZNKCkpO1xuICAgICAgICBjb25zdCBbY29kZWNdID0gbWFuYWdlci5nZXRDb2RlY0Zyb21CdWZmZXIodW5zaWduZWRUeC50b0J5dGVzKCkpO1xuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICB0cmFuc2FjdGlvbkhleDogQnVmZmVyLmZyb20odW5zaWduZWRUeC50b0J5dGVzKCkpLnRvU3RyaW5nKCdoZXgnKSxcbiAgICAgICAgICBjaGFpbkFsaWFzOiBYQ0hBSU5fQUxJQVMsXG4gICAgICAgICAgdXR4b3M6IHVuc2lnbmVkVHgudXR4b3MubWFwKCh1dHhvKSA9PlxuICAgICAgICAgICAgdXRpbHMuYnVmZmVyVG9IZXgodXR4by50b0J5dGVzKGNvZGVjKSksXG4gICAgICAgICAgKSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgcmVxdWVzdDxBdmFsYW5jaGVTZW5kVHJhbnNhY3Rpb25IYW5kbGVyPih7XG4gICAgICAgICAgbWV0aG9kOiBEQXBwUHJvdmlkZXJSZXF1ZXN0LkFWQUxBTkNIRV9TRU5EX1RSQU5TQUNUSU9OLFxuICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgfSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRJc1NlbmRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW1xuICAgICAgYWNjb3VudCxcbiAgICAgIGNoZWNrRnVuY3Rpb25BdmFpbGFiaWxpdHksXG4gICAgICBpc0xlZGdlcldhbGxldCxcbiAgICAgIG5ldHdvcmssXG4gICAgICBwcm92aWRlcixcbiAgICAgIHJlcXVlc3QsXG4gICAgICB3YWxsZXQsXG4gICAgXSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGVycm9yLFxuICAgIGlzU2VuZGluZyxcbiAgICBpc1ZhbGlkOiAhZXJyb3IsXG4gICAgaXNWYWxpZGF0aW5nLFxuICAgIG1heEFtb3VudCxcbiAgICBzZW5kLFxuICAgIHZhbGlkYXRlLFxuICB9O1xufTtcbiIsImltcG9ydCB7IHN0cmluZ1RvQk4gfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEJpdGNvaW5JbnB1dFVUWE8sXG4gIGdldE1heFRyYW5zZmVyQW1vdW50LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcbmltcG9ydCB7IFJwY01ldGhvZCB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyBCaXRjb2luU2VuZFRyYW5zYWN0aW9uUGFyYW1zIH0gZnJvbSAnQGF2YWxhYnMvYml0Y29pbi1tb2R1bGUnO1xuXG5pbXBvcnQgeyBTZW5kRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy91dGlscy9zZW5kL21vZGVscyc7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7XG4gIGdldEJ0Y0lucHV0VXR4b3MsXG4gIHZhbGlkYXRlQnRjU2VuZCxcbn0gZnJvbSAnQHNyYy91dGlscy9zZW5kL2J0Y1NlbmRVdGlscyc7XG5cbmltcG9ydCB7IFNlbmRBZGFwdGVyQlRDIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgQmFzZVNlbmRPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzJztcblxuZXhwb3J0IGNvbnN0IHVzZUJ0Y1NlbmQ6IFNlbmRBZGFwdGVyQlRDID0gKHtcbiAgaXNNYWlubmV0LFxuICBmcm9tLFxuICBwcm92aWRlcixcbiAgbWF4RmVlLFxuICBuYXRpdmVUb2tlbixcbn0pID0+IHtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuXG4gIGNvbnN0IFtpc1NlbmRpbmcsIHNldElzU2VuZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc1ZhbGlkYXRpbmcsIHNldElzVmFsaWRhdGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFt1dHhvcywgc2V0VXR4b3NdID0gdXNlU3RhdGU8Qml0Y29pbklucHV0VVRYT1tdPihbXSk7XG4gIGNvbnN0IFttYXhBbW91bnQsIHNldE1heEFtb3VudF0gPSB1c2VTdGF0ZSgnMCcpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPFNlbmRFcnJvck1lc3NhZ2U+KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcblxuICAgIGdldEJ0Y0lucHV0VXR4b3MocHJvdmlkZXIsIG5hdGl2ZVRva2VuLCBOdW1iZXIobWF4RmVlKSlcbiAgICAgIC50aGVuKChfdXR4b3MpID0+IHtcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xuICAgICAgICAgIHNldFV0eG9zKF91dHhvcyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBzZXRFcnJvcihTZW5kRXJyb3JNZXNzYWdlLlVOQUJMRV9UT19GRVRDSF9VVFhPUyk7XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9LCBbcHJvdmlkZXIsIG5hdGl2ZVRva2VuLCBtYXhGZWVdKTtcblxuICBjb25zdCB2YWxpZGF0ZSA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChvcHRpb25zOiBCYXNlU2VuZE9wdGlvbnMpID0+IHtcbiAgICAgIGNvbnN0IHsgYWRkcmVzcywgYW1vdW50IH0gPSBvcHRpb25zO1xuXG4gICAgICBzZXRJc1ZhbGlkYXRpbmcodHJ1ZSk7XG4gICAgICBzZXRFcnJvcih1bmRlZmluZWQpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBhbW91bnRCTiA9IHN0cmluZ1RvQk4oYW1vdW50IHx8ICcwJywgbmF0aXZlVG9rZW4uZGVjaW1hbHMpO1xuICAgICAgICBjb25zdCBhbW91bnRJblNhdG9zaGlzID0gYW1vdW50Qk4udG9OdW1iZXIoKTtcbiAgICAgICAgY29uc3QgbWF4VHJhbnNmZXJBbW91bnQgPSBNYXRoLm1heChcbiAgICAgICAgICBnZXRNYXhUcmFuc2ZlckFtb3VudCh1dHhvcywgYWRkcmVzcywgZnJvbSwgTnVtYmVyKG1heEZlZSkpLFxuICAgICAgICAgIDAsXG4gICAgICAgICk7XG5cbiAgICAgICAgc2V0TWF4QW1vdW50KG1heFRyYW5zZmVyQW1vdW50LnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvciA9IHZhbGlkYXRlQnRjU2VuZChcbiAgICAgICAgICBmcm9tLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFkZHJlc3MsXG4gICAgICAgICAgICBhbW91bnQ6IGFtb3VudEluU2F0b3NoaXMsXG4gICAgICAgICAgICBmZWVSYXRlOiBOdW1iZXIobWF4RmVlKSxcbiAgICAgICAgICAgIHRva2VuOiBuYXRpdmVUb2tlbixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHV0eG9zLFxuICAgICAgICAgIGlzTWFpbm5ldCxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICAgICAgc2V0RXJyb3IodmFsaWRhdGlvbkVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0RXJyb3IodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0SXNWYWxpZGF0aW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFt1dHhvcywgbWF4RmVlLCBmcm9tLCBpc01haW5uZXQsIG5hdGl2ZVRva2VuXSxcbiAgKTtcblxuICBjb25zdCBzZW5kID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHsgYWRkcmVzcywgYW1vdW50IH06IEJhc2VTZW5kT3B0aW9ucykgPT4ge1xuICAgICAgc2V0SXNTZW5kaW5nKHRydWUpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBhbW91bnRCTiA9IHN0cmluZ1RvQk4oYW1vdW50IHx8ICcwJywgbmF0aXZlVG9rZW4uZGVjaW1hbHMpO1xuICAgICAgICBjb25zdCBhbW91bnRJblNhdG9zaGlzID0gYW1vdW50Qk4udG9OdW1iZXIoKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgcmVxdWVzdDxCaXRjb2luU2VuZFRyYW5zYWN0aW9uUGFyYW1zPih7XG4gICAgICAgICAgbWV0aG9kOiBScGNNZXRob2QuQklUQ09JTl9TRU5EX1RSQU5TQUNUSU9OLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgIHRvOiBhZGRyZXNzLFxuICAgICAgICAgICAgYW1vdW50OiBhbW91bnRJblNhdG9zaGlzLFxuICAgICAgICAgICAgZmVlUmF0ZTogTnVtYmVyKG1heEZlZSksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRJc1NlbmRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2Zyb20sIG1heEZlZSwgbmF0aXZlVG9rZW4uZGVjaW1hbHMsIHJlcXVlc3RdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgZXJyb3IsXG4gICAgaXNTZW5kaW5nLFxuICAgIGlzVmFsaWQ6ICFlcnJvcixcbiAgICBpc1ZhbGlkYXRpbmcsXG4gICAgbWF4QW1vdW50LFxuICAgIHNlbmQsXG4gICAgdmFsaWRhdGUsXG4gIH07XG59O1xuIiwiaW1wb3J0IEJpZyBmcm9tICdiaWcuanMnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICdAYXZhbGFicy9hdmFsYW5jaGVqcyc7XG5pbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcbmltcG9ydCB7IGJpZ1RvQmlnSW50IH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdAc3JjL3V0aWxzL3Byb21pc2VSZXNvbHZlcic7XG5pbXBvcnQgeyBGZWF0dXJlR2F0ZXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmVhdHVyZUZsYWdzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRQcm92aWRlcic7XG5pbXBvcnQgeyBTZW5kRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy91dGlscy9zZW5kL21vZGVscyc7XG5pbXBvcnQgeyBpc1ZhbGlkUHZtQWRkcmVzcyB9IGZyb20gJ0BzcmMvdXRpbHMvaXNBZGRyZXNzVmFsaWQnO1xuaW1wb3J0IHsgc3RyaXBBZGRyZXNzUHJlZml4IH0gZnJvbSAnQHNyYy91dGlscy9zdHJpcEFkZHJlc3NQcmVmaXgnO1xuaW1wb3J0IHsgREFwcFByb3ZpZGVyUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9kQXBwQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB0eXBlIHsgQXZhbGFuY2hlU2VuZFRyYW5zYWN0aW9uSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvaGFuZGxlcnMvYXZhbGFuY2hlX3NlbmRUcmFuc2FjdGlvbic7XG5cbmltcG9ydCB7IGdldE1heFV0eG9TZXQgfSBmcm9tICcuLi8uLi91dGlscy9nZXRNYXhVdHhvcyc7XG5pbXBvcnQgeyBQVk1TZW5kT3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscyc7XG5pbXBvcnQgeyBTZW5kQWRhcHRlclBWTSB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IGNvcnJlY3RBZGRyZXNzQnlQcmVmaXggfSBmcm9tICcuLi8uLi91dGlscy9jb3JyZWN0QWRkcmVzc0J5UHJlZml4JztcbmltcG9ydCB7IEZlZVN0YXRlIH0gZnJvbSAnQGF2YWxhYnMvYXZhbGFuY2hlanMvZGlzdC92bXMvcHZtJztcblxuY29uc3QgUENIQUlOX0FMSUFTID0gJ1AnIGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgdXNlUHZtU2VuZDogU2VuZEFkYXB0ZXJQVk0gPSAoe1xuICBuZXR3b3JrLFxuICBwcm92aWRlcixcbiAgYWNjb3VudCxcbiAgbWF4RmVlLFxufSkgPT4ge1xuICBjb25zdCB7IHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG5cbiAgY29uc3QgeyBmZWF0dXJlRmxhZ3MgfSA9IHVzZUZlYXR1cmVGbGFnQ29udGV4dCgpO1xuICBjb25zdCB7IGlzTGVkZ2VyV2FsbGV0IH0gPSB1c2VXYWxsZXRDb250ZXh0KCk7XG5cbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxTZW5kRXJyb3JNZXNzYWdlPigpO1xuICBjb25zdCBbaXNWYWxpZGF0aW5nLCBzZXRJc1ZhbGlkYXRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNTZW5kaW5nLCBzZXRJc1NlbmRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbbWF4QW1vdW50LCBzZXRNYXhBbW91bnRdID0gdXNlU3RhdGUoJzAnKTtcbiAgY29uc3QgW2VzdGltYXRlZEZlZSwgc2V0RXN0aW1hdGVkRmVlXSA9IHVzZVN0YXRlKDBuKTtcbiAgY29uc3QgW2ZlZVN0YXRlLCBzZXRGZWVTdGF0ZV0gPSB1c2VTdGF0ZTxGZWVTdGF0ZT4oKTtcbiAgY29uc3QgW3V0eG9TZXQsIHNldFV0eG9TZXRdID0gdXNlU3RhdGU8dXRpbHMuVXR4b1NldD4oKTtcblxuICBjb25zdCB3YWxsZXQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gbmV3IEF2YWxhbmNoZS5BZGRyZXNzV2FsbGV0KFxuICAgICAgYWNjb3VudC5hZGRyZXNzQyxcbiAgICAgIHN0cmlwQWRkcmVzc1ByZWZpeChhY2NvdW50LmFkZHJlc3NDb3JlRXRoKSxcbiAgICAgIFtzdHJpcEFkZHJlc3NQcmVmaXgoYWNjb3VudC5hZGRyZXNzUFZNKV0sXG4gICAgICBzdHJpcEFkZHJlc3NQcmVmaXgoYWNjb3VudC5hZGRyZXNzUFZNKSxcbiAgICAgIHByb3ZpZGVyIGFzIEF2YWxhbmNoZS5Kc29uUnBjUHJvdmlkZXIsXG4gICAgKTtcbiAgfSwgW2FjY291bnQsIHByb3ZpZGVyXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcblxuICAgIHdhbGxldFxuICAgICAgLmdldFVUWE9zKCdQJylcbiAgICAgIC50aGVuKCh1KSA9PiB7XG4gICAgICAgIGlmICghaXNNb3VudGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0VXR4b1NldCh1KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBzZXRFcnJvcihTZW5kRXJyb3JNZXNzYWdlLlVOQUJMRV9UT19GRVRDSF9VVFhPUyk7XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9LCBbd2FsbGV0XSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcblxuICAgIHByb3ZpZGVyXG4gICAgICAuZ2V0QXBpUCgpXG4gICAgICAuZ2V0RmVlU3RhdGUoKVxuICAgICAgLnRoZW4oKHN0YXRlKSA9PiB7XG4gICAgICAgIGlmICghaXNNb3VudGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0RmVlU3RhdGUoc3RhdGUpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIHNldEVycm9yKFNlbmRFcnJvck1lc3NhZ2UuSU5WQUxJRF9ORVRXT1JLX0ZFRSk7XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9LCBbcHJvdmlkZXJdKTtcblxuICBjb25zdCBjaGVja0Z1bmN0aW9uQXZhaWxhYmlsaXR5ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICghZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5TRU5EX1BfQ0hBSU5dKSB7XG4gICAgICByZXR1cm4gU2VuZEVycm9yTWVzc2FnZS5TRU5EX05PVF9BVkFJTEFCTEU7XG4gICAgfVxuICB9LCBbZmVhdHVyZUZsYWdzXSk7XG5cbiAgZnVuY3Rpb24gc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKG1lc3NhZ2U6IFNlbmRFcnJvck1lc3NhZ2UpIHtcbiAgICBzZXRFcnJvcihtZXNzYWdlKTtcbiAgICBzZXRJc1ZhbGlkYXRpbmcoZmFsc2UpO1xuICB9XG5cbiAgY29uc3QgZ2V0RmVlU3RhdGUgPSB1c2VDYWxsYmFjayhcbiAgICAoZ2FzUHJpY2U/OiBiaWdpbnQpID0+IHtcbiAgICAgIGlmICghZ2FzUHJpY2UgfHwgIWZlZVN0YXRlKSB7XG4gICAgICAgIHJldHVybiBmZWVTdGF0ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmVlU3RhdGUsXG4gICAgICAgIHByaWNlOiBnYXNQcmljZSxcbiAgICAgIH07XG4gICAgfSxcbiAgICBbZmVlU3RhdGVdLFxuICApO1xuXG4gIGNvbnN0IGJ1aWxkVHJhbnNhY3Rpb24gPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoeyBhZGRyZXNzLCBhbW91bnQsIGdhc1ByaWNlLCB0b2tlbiB9OiBQVk1TZW5kT3B0aW9ucykgPT4ge1xuICAgICAgY29uc3QgYXZheCA9IHByb3ZpZGVyLmdldEF2YXhJRCgpO1xuICAgICAgY29uc3QgYW1vdW50QmlnSW50ID0gYmlnVG9CaWdJbnQoQmlnKGFtb3VudCksIHRva2VuLmRlY2ltYWxzKTtcbiAgICAgIGNvbnN0IGNoYW5nZUFkZHJlc3MgPSB1dGlscy5wYXJzZShhY2NvdW50LmFkZHJlc3NQVk0pWzJdO1xuICAgICAgY29uc3QgeyB1dHhvcyB9ID0gYXdhaXQgZ2V0TWF4VXR4b1NldChcbiAgICAgICAgaXNMZWRnZXJXYWxsZXQsXG4gICAgICAgIHByb3ZpZGVyLFxuICAgICAgICB3YWxsZXQsXG4gICAgICAgIG5ldHdvcmssXG4gICAgICAgIGdldEZlZVN0YXRlKGdhc1ByaWNlKSxcbiAgICAgICAgdXR4b1NldCxcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiB3YWxsZXQuYmFzZVRYKHtcbiAgICAgICAgdXR4b1NldDogdXR4b3MsXG4gICAgICAgIGNoYWluOiBQQ0hBSU5fQUxJQVMsXG4gICAgICAgIHRvQWRkcmVzczogY29ycmVjdEFkZHJlc3NCeVByZWZpeChhZGRyZXNzLCAnUC0nKSxcbiAgICAgICAgYW1vdW50c1BlckFzc2V0OiB7XG4gICAgICAgICAgW2F2YXhdOiBhbW91bnRCaWdJbnQsXG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBjaGFuZ2VBZGRyZXNzZXM6IFtjaGFuZ2VBZGRyZXNzXSxcbiAgICAgICAgfSxcbiAgICAgICAgZmVlU3RhdGU6XG4gICAgICAgICAgZmVlU3RhdGUgJiYgZ2FzUHJpY2UgPyB7IC4uLmZlZVN0YXRlLCBwcmljZTogZ2FzUHJpY2UgfSA6IGZlZVN0YXRlLFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBbXG4gICAgICBhY2NvdW50LmFkZHJlc3NQVk0sXG4gICAgICBwcm92aWRlcixcbiAgICAgIHdhbGxldCxcbiAgICAgIGZlZVN0YXRlLFxuICAgICAgaXNMZWRnZXJXYWxsZXQsXG4gICAgICBuZXR3b3JrLFxuICAgICAgZ2V0RmVlU3RhdGUsXG4gICAgICB1dHhvU2V0LFxuICAgIF0sXG4gICk7XG5cbiAgY29uc3QgcGFyc2VUeCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh7IGFkZHJlc3MsIGFtb3VudCwgZ2FzUHJpY2UsIHRva2VuIH06IFBWTVNlbmRPcHRpb25zKSA9PiB7XG4gICAgICBjb25zdCB1bnNpZ25lZFR4ID0gYXdhaXQgYnVpbGRUcmFuc2FjdGlvbih7XG4gICAgICAgIGFkZHJlc3MsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgZ2FzUHJpY2UsXG4gICAgICAgIHRva2VuLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGZlZVRvbGVyYW5jZSA9IGdldEZlZVRvbGVyYW5jZShnYXNQcmljZSwgZmVlU3RhdGUpO1xuICAgICAgY29uc3QgcGFyc2VkVHggPSBhd2FpdCBBdmFsYW5jaGUucGFyc2VBdmFsYW5jaGVUeChcbiAgICAgICAgdW5zaWduZWRUeCxcbiAgICAgICAgcHJvdmlkZXIsXG4gICAgICAgIGFjY291bnQuYWRkcmVzc1BWTSxcbiAgICAgICAgeyBmZWVUb2xlcmFuY2UgfSxcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBwYXJzZWRUeDtcbiAgICB9LFxuICAgIFtidWlsZFRyYW5zYWN0aW9uLCBwcm92aWRlciwgYWNjb3VudC5hZGRyZXNzUFZNLCBmZWVTdGF0ZV0sXG4gICk7XG5cbiAgY29uc3QgdmFsaWRhdGUgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAob3B0aW9uczogUFZNU2VuZE9wdGlvbnMpID0+IHtcbiAgICAgIGNvbnN0IHsgYWRkcmVzcywgYW1vdW50LCBnYXNQcmljZSwgdG9rZW4gfSA9IG9wdGlvbnM7XG4gICAgICBjb25zdCBhbW91bnRUb1VzZSA9IGFtb3VudCA/IGFtb3VudCA6ICcwJztcblxuICAgICAgc2V0SXNWYWxpZGF0aW5nKHRydWUpO1xuICAgICAgc2V0RXJyb3IodW5kZWZpbmVkKTtcblxuICAgICAgY29uc3QgZXJyb3JSZWFzb24gPSBjaGVja0Z1bmN0aW9uQXZhaWxhYmlsaXR5KCk7XG5cbiAgICAgIGlmIChlcnJvclJlYXNvbikge1xuICAgICAgICByZXR1cm4gc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKGVycm9yUmVhc29uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBnYXNQcmljZSA9PT0gJ2JpZ2ludCcgJiYgZmVlU3RhdGUpIHtcbiAgICAgICAgaWYgKGZlZVN0YXRlLnByaWNlID4gZ2FzUHJpY2UpIHtcbiAgICAgICAgICByZXR1cm4gc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuSU5WQUxJRF9ORVRXT1JLX0ZFRSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZ2FzUHJpY2UgPiBmZWVTdGF0ZS5wcmljZSAqIDJuKSB7XG4gICAgICAgICAgcmV0dXJuIHNldEVycm9yQW5kRW5kVmFsaWRhdGluZyhcbiAgICAgICAgICAgIFNlbmRFcnJvck1lc3NhZ2UuRVhDRVNTSVZFX05FVFdPUktfRkVFLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmZWVTdGF0ZSkge1xuICAgICAgICAvLyBGZWUgc3RhdGUgaGFzIG5vdCBiZWVuIGZldGNoZWQgeWV0LCB3ZSBjYW4ndCBwcm9jZWVkIHdpdGggb3RoZXIgdmFsaWRhdGlvbnMuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yIHdpdGggZmV0Y2hpbmcgdGhlIGZlZSBzdGF0ZSB3aGVuIGl0J3MgcmVxdWlyZWQsXG4gICAgICAgIC8vIHRoYXQgZXJyb3IgaXMgY2FwdHVyZWQgb3V0c2lkZSBvZiB0aGUgdmFsaWRhdGUoKSBmdW5jdGlvbi5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyB1c2luZyBmaWx0ZXJlZCBVVFhPcyBiZWNhdXNlIHRoZXJlIGlzIHNpemUgbGltaXRcbiAgICAgIGNvbnN0IFt1dHhvcywgdXR4b3NFcnJvcl0gPSBhd2FpdCByZXNvbHZlKFxuICAgICAgICBnZXRNYXhVdHhvU2V0KFxuICAgICAgICAgIGlzTGVkZ2VyV2FsbGV0LFxuICAgICAgICAgIHByb3ZpZGVyLFxuICAgICAgICAgIHdhbGxldCxcbiAgICAgICAgICBuZXR3b3JrLFxuICAgICAgICAgIGdldEZlZVN0YXRlKGdhc1ByaWNlKSxcbiAgICAgICAgICB1dHhvU2V0LFxuICAgICAgICApLFxuICAgICAgKTtcblxuICAgICAgaWYgKHV0eG9zRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHNldEVycm9yQW5kRW5kVmFsaWRhdGluZyhTZW5kRXJyb3JNZXNzYWdlLlVOQUJMRV9UT19GRVRDSF9VVFhPUyk7XG4gICAgICB9XG4gICAgICBjb25zdCBhbW91bnRCaWdJbnQgPSBiaWdUb0JpZ0ludChCaWcoYW1vdW50VG9Vc2UpLCB0b2tlbi5kZWNpbWFscyk7XG4gICAgICAvLyBtYXhNb3VudCBjYWxjdWxhdGlvblxuICAgICAgY29uc3QgYXZhaWxhYmxlID0gdXR4b3M/LmJhbGFuY2UuYXZhaWxhYmxlID8/IEJpZ0ludCgwKTtcbiAgICAgIGNvbnN0IG1heEF2YWlsYWJsZSA9IGF2YWlsYWJsZSAtIG1heEZlZTtcbiAgICAgIHNldE1heEFtb3VudChtYXhBdmFpbGFibGUudG9TdHJpbmcoKSk7XG5cbiAgICAgIGlmICghYWRkcmVzcykge1xuICAgICAgICByZXR1cm4gc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuQUREUkVTU19SRVFVSVJFRCk7XG4gICAgICB9XG4gICAgICBpZiAoIWlzVmFsaWRQdm1BZGRyZXNzKGFkZHJlc3MpKSB7XG4gICAgICAgIHJldHVybiBzZXRFcnJvckFuZEVuZFZhbGlkYXRpbmcoU2VuZEVycm9yTWVzc2FnZS5JTlZBTElEX0FERFJFU1MpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWFtb3VudCB8fCBhbW91bnQgPT09ICcwJykge1xuICAgICAgICByZXR1cm4gc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuQU1PVU5UX1JFUVVJUkVEKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhBdmFpbGFibGUgPCBCaWdJbnQoMCkgfHwgYW1vdW50QmlnSW50ID4gbWF4QXZhaWxhYmxlKSB7XG4gICAgICAgIHJldHVybiBzZXRFcnJvckFuZEVuZFZhbGlkYXRpbmcoU2VuZEVycm9yTWVzc2FnZS5JTlNVRkZJQ0lFTlRfQkFMQU5DRSk7XG4gICAgICB9XG5cbiAgICAgIHNldElzVmFsaWRhdGluZyhmYWxzZSk7XG4gICAgICBzZXRFcnJvcih1bmRlZmluZWQpO1xuXG4gICAgICBjb25zdCBwYXJzZWRUeCA9IGF3YWl0IHBhcnNlVHgoeyBhZGRyZXNzLCBhbW91bnQsIGdhc1ByaWNlLCB0b2tlbiB9KTtcblxuICAgICAgc2V0RXN0aW1hdGVkRmVlKHBhcnNlZFR4LnR4RmVlKTtcbiAgICB9LFxuICAgIFtcbiAgICAgIGNoZWNrRnVuY3Rpb25BdmFpbGFiaWxpdHksXG4gICAgICBpc0xlZGdlcldhbGxldCxcbiAgICAgIG1heEZlZSxcbiAgICAgIG5ldHdvcmssXG4gICAgICBwcm92aWRlcixcbiAgICAgIHdhbGxldCxcbiAgICAgIGdldEZlZVN0YXRlLFxuICAgICAgcGFyc2VUeCxcbiAgICAgIGZlZVN0YXRlLFxuICAgICAgdXR4b1NldCxcbiAgICBdLFxuICApO1xuXG4gIGNvbnN0IHNlbmQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoeyBhZGRyZXNzLCBhbW91bnQsIGdhc1ByaWNlLCB0b2tlbiB9OiBQVk1TZW5kT3B0aW9ucykgPT4ge1xuICAgICAgY2hlY2tGdW5jdGlvbkF2YWlsYWJpbGl0eSgpO1xuICAgICAgc2V0SXNTZW5kaW5nKHRydWUpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB1bnNpZ25lZFR4ID0gYXdhaXQgYnVpbGRUcmFuc2FjdGlvbih7XG4gICAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgICBhbW91bnQsXG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgZ2FzUHJpY2UsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBtYW5hZ2VyID0gdXRpbHMuZ2V0TWFuYWdlckZvclZNKHVuc2lnbmVkVHguZ2V0Vk0oKSk7XG4gICAgICAgIGNvbnN0IFtjb2RlY10gPSBtYW5hZ2VyLmdldENvZGVjRnJvbUJ1ZmZlcih1bnNpZ25lZFR4LnRvQnl0ZXMoKSk7XG4gICAgICAgIGNvbnN0IGZlZVRvbGVyYW5jZSA9IGdldEZlZVRvbGVyYW5jZShnYXNQcmljZSwgZmVlU3RhdGUpO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgdHJhbnNhY3Rpb25IZXg6IEJ1ZmZlci5mcm9tKHVuc2lnbmVkVHgudG9CeXRlcygpKS50b1N0cmluZygnaGV4JyksXG4gICAgICAgICAgY2hhaW5BbGlhczogUENIQUlOX0FMSUFTLFxuICAgICAgICAgIHV0eG9zOiB1bnNpZ25lZFR4LnV0eG9zLm1hcCgodXR4bykgPT5cbiAgICAgICAgICAgIHV0aWxzLmJ1ZmZlclRvSGV4KHV0eG8udG9CeXRlcyhjb2RlYykpLFxuICAgICAgICAgICksXG4gICAgICAgICAgZmVlVG9sZXJhbmNlLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYXdhaXQgcmVxdWVzdDxBdmFsYW5jaGVTZW5kVHJhbnNhY3Rpb25IYW5kbGVyPih7XG4gICAgICAgICAgbWV0aG9kOiBEQXBwUHJvdmlkZXJSZXF1ZXN0LkFWQUxBTkNIRV9TRU5EX1RSQU5TQUNUSU9OLFxuICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRJc1NlbmRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2J1aWxkVHJhbnNhY3Rpb24sIGNoZWNrRnVuY3Rpb25BdmFpbGFiaWxpdHksIHJlcXVlc3QsIGZlZVN0YXRlXSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGVycm9yLFxuICAgIGlzU2VuZGluZyxcbiAgICBpc1ZhbGlkOiAhaXNWYWxpZGF0aW5nICYmICFlcnJvcixcbiAgICBpc1ZhbGlkYXRpbmcsXG4gICAgbWF4QW1vdW50LFxuICAgIHNlbmQsXG4gICAgdmFsaWRhdGUsXG4gICAgZXN0aW1hdGVkRmVlLFxuICB9O1xufTtcblxuY29uc3QgZ2V0RmVlVG9sZXJhbmNlID0gKGNob3Nlbkdhc1ByaWNlPzogYmlnaW50LCBmZWVTdGF0ZT86IEZlZVN0YXRlKSA9PiB7XG4gIGlmICghY2hvc2VuR2FzUHJpY2UgfHwgIWZlZVN0YXRlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbWFya2V0R2FzUHJpY2UgPSBmZWVTdGF0ZS5wcmljZTtcbiAgLy8gVGVjaG5pY2FsbHkgdGhpcyBzaG91bGQgbmV2ZXIgYmUgbmVnYXRpdmUsIGJ1dCBsZXQncyBzYWZlLWd1YXJkXG4gIGNvbnN0IGRpZmZlcmVuY2UgPSBNYXRoLmFicyhOdW1iZXIoY2hvc2VuR2FzUHJpY2UgLSBtYXJrZXRHYXNQcmljZSkpO1xuXG4gIC8vIENhcCBiZXR3ZWVuIDEgYW5kIDEwMFxuICByZXR1cm4gTWF0aC5taW4oXG4gICAgMTAwLFxuICAgIE1hdGgubWF4KDEsIE1hdGguY2VpbCgoZGlmZmVyZW5jZSAvIE51bWJlcihtYXJrZXRHYXNQcmljZSkpICogMTAwKSksXG4gICk7XG59O1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgdHJhbnNmZXJTb2wsXG4gIGNvbXBpbGVTb2xhbmFUeCxcbiAgc2VyaWFsaXplU29sYW5hVHgsXG4gIHRyYW5zZmVyVG9rZW4sXG4gIFNvbGFuYVByb3ZpZGVyLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcbmltcG9ydCB7IGlzQWRkcmVzcywgQWRkcmVzcyB9IGZyb20gJ0Bzb2xhbmEva2l0JztcbmltcG9ydCB7IGJpZ0ludFRvU3RyaW5nIH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IHsgUnBjTWV0aG9kLCBUb2tlblR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5pbXBvcnQgeyBTZW5kRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy91dGlscy9zZW5kL21vZGVscyc7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcblxuaW1wb3J0IHsgU2VuZEFkYXB0ZXJTVk0gfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBTT0xBTkFfRklYRURfQkFTRV9GRUUsIFNvbGFuYVNlbmRPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzJztcbmltcG9ydCB7IHN0cmluZ1RvQmlnaW50IH0gZnJvbSAnQHNyYy91dGlscy9zdHJpbmdUb0JpZ2ludCc7XG5cbmNvbnN0IFJFTlRfRVhFTVBUX0NBQ0hFID0gbmV3IE1hcDxiaWdpbnQsIGJpZ2ludD4oKTtcbmNvbnN0IEFDQ09VTlRfU1BBQ0VfQ0FDSEUgPSBuZXcgTWFwPEFkZHJlc3MsIGJpZ2ludD4oKTtcblxuZXhwb3J0IGNvbnN0IHVzZVN2bVNlbmQ6IFNlbmRBZGFwdGVyU1ZNID0gKHtcbiAgbmF0aXZlVG9rZW4sXG4gIHByb3ZpZGVyLFxuICBhY2NvdW50LFxufSkgPT4ge1xuICBjb25zdCB7IHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG5cbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxTZW5kRXJyb3JNZXNzYWdlPigpO1xuICBjb25zdCBbaXNWYWxpZGF0aW5nLCBzZXRJc1ZhbGlkYXRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNTZW5kaW5nLCBzZXRJc1NlbmRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbbWF4QW1vdW50LCBzZXRNYXhBbW91bnRdID0gdXNlU3RhdGUoJzAnKTtcbiAgY29uc3QgW21pbkFtb3VudCwgc2V0TWluQW1vdW50XSA9IHVzZVN0YXRlPHN0cmluZz4oKTtcblxuICBmdW5jdGlvbiBzZXRFcnJvckFuZEVuZFZhbGlkYXRpbmcobWVzc2FnZTogU2VuZEVycm9yTWVzc2FnZSkge1xuICAgIHNldEVycm9yKG1lc3NhZ2UpO1xuICAgIHNldElzVmFsaWRhdGluZyhmYWxzZSk7XG4gIH1cblxuICBjb25zdCBidWlsZFRyYW5zYWN0aW9uID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHsgYWRkcmVzcywgYW1vdW50LCB0b2tlbiB9OiBTb2xhbmFTZW5kT3B0aW9ucykgPT4ge1xuICAgICAgaWYgKHRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5OQVRJVkUpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZmVyU29sKHtcbiAgICAgICAgICBmcm9tOiBhY2NvdW50LmFkZHJlc3NTVk0sXG4gICAgICAgICAgdG86IGFkZHJlc3MsXG4gICAgICAgICAgYW1vdW50OiBCaWdJbnQoc3RyaW5nVG9CaWdpbnQoYW1vdW50LCBuYXRpdmVUb2tlbi5kZWNpbWFscykpLFxuICAgICAgICAgIHByb3ZpZGVyLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRyYW5zZmVyVG9rZW4oe1xuICAgICAgICBmcm9tOiBhY2NvdW50LmFkZHJlc3NTVk0sXG4gICAgICAgIHRvOiBhZGRyZXNzLFxuICAgICAgICBtaW50OiB0b2tlbi5hZGRyZXNzLFxuICAgICAgICBhbW91bnQ6IEJpZ0ludChzdHJpbmdUb0JpZ2ludChhbW91bnQsIHRva2VuLmRlY2ltYWxzKSksXG4gICAgICAgIHByb3ZpZGVyLFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBbYWNjb3VudC5hZGRyZXNzU1ZNLCBuYXRpdmVUb2tlbi5kZWNpbWFscywgcHJvdmlkZXJdLFxuICApO1xuXG4gIGNvbnN0IHZhbGlkYXRlID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHsgYWRkcmVzcywgYW1vdW50LCB0b2tlbiB9OiBTb2xhbmFTZW5kT3B0aW9ucykgPT4ge1xuICAgICAgc2V0SXNWYWxpZGF0aW5nKHRydWUpO1xuXG4gICAgICBjb25zdCBhbW91bnRCaWdJbnQgPSBzdHJpbmdUb0JpZ2ludChhbW91bnQgfHwgJzAnLCB0b2tlbi5kZWNpbWFscyk7XG5cbiAgICAgIGlmICghYW1vdW50QmlnSW50IHx8IGFtb3VudEJpZ0ludCA8IDApIHtcbiAgICAgICAgc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuQU1PVU5UX1JFUVVJUkVEKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZW1haW5pbmdCYWxhbmNlID0gdG9rZW4uYmFsYW5jZSAtIGFtb3VudEJpZ0ludDtcblxuICAgICAgLy8gSGFuZGxlIG1heCBhbW91bnQgZmlyc3RcbiAgICAgIGlmICh0b2tlbi50eXBlID09PSBUb2tlblR5cGUuTkFUSVZFKSB7XG4gICAgICAgIHNldE1heEFtb3VudCgobmF0aXZlVG9rZW4uYmFsYW5jZSAtIFNPTEFOQV9GSVhFRF9CQVNFX0ZFRSkudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgaWYgKHJlbWFpbmluZ0JhbGFuY2UgPCBTT0xBTkFfRklYRURfQkFTRV9GRUUpIHtcbiAgICAgICAgICBzZXRFcnJvckFuZEVuZFZhbGlkYXRpbmcoU2VuZEVycm9yTWVzc2FnZS5JTlNVRkZJQ0lFTlRfQkFMQU5DRSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRNYXhBbW91bnQobmF0aXZlVG9rZW4uYmFsYW5jZS50b1N0cmluZygpKTtcblxuICAgICAgICBpZiAocmVtYWluaW5nQmFsYW5jZSA8IDBuKSB7XG4gICAgICAgICAgc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuSU5TVUZGSUNJRU5UX0JBTEFOQ0UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWFkZHJlc3MpIHtcbiAgICAgICAgc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuQUREUkVTU19SRVFVSVJFRCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0FkZHJlc3MoYWRkcmVzcykpIHtcbiAgICAgICAgc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuSU5WQUxJRF9BRERSRVNTKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLk5BVElWRSkge1xuICAgICAgICBjb25zdCBzcGFjZU9jY3VwaWVkID0gYXdhaXQgZ2V0QWNjb3VudE9jY3VwaWVkU3BhY2UoYWRkcmVzcywgcHJvdmlkZXIpO1xuXG4gICAgICAgIC8vIElmIHRoZSByZWNpcGllbnQgYWNjb3VudCBkb2VzIG5vdCBob2xkIGFueSBkYXRhLCB0aGUgZmlyc3QgdHJhbnNmZXJcbiAgICAgICAgLy8gbXVzdCBiZSBncmVhdGVyIHRoYW4gdGhlIHJlbnQtZXhlbXB0IG1pbmltdW0uXG4gICAgICAgIGlmIChzcGFjZU9jY3VwaWVkID09PSAwbikge1xuICAgICAgICAgIGNvbnN0IG1pbmltdW0gPSBhd2FpdCBnZXRSZW50RXhlbXB0TWluaW11bSgwbiwgcHJvdmlkZXIpO1xuXG4gICAgICAgICAgc2V0TWluQW1vdW50KGJpZ0ludFRvU3RyaW5nKG1pbmltdW0sIHRva2VuLmRlY2ltYWxzKSk7XG5cbiAgICAgICAgICBpZiAoYW1vdW50QmlnSW50IDwgbWluaW11bSkge1xuICAgICAgICAgICAgc2V0RXJyb3JBbmRFbmRWYWxpZGF0aW5nKFNlbmRFcnJvck1lc3NhZ2UuQU1PVU5UX1RPT19MT1cpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRNaW5BbW91bnQodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0TWluQW1vdW50KHVuZGVmaW5lZCk7XG4gICAgICB9XG5cbiAgICAgIHNldEVycm9yKHVuZGVmaW5lZCk7XG4gICAgICBzZXRJc1ZhbGlkYXRpbmcoZmFsc2UpO1xuICAgIH0sXG4gICAgW3Byb3ZpZGVyLCBuYXRpdmVUb2tlbi5iYWxhbmNlXSxcbiAgKTtcblxuICBjb25zdCBzZW5kID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKG9wdGlvbnM6IFNvbGFuYVNlbmRPcHRpb25zKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBzZXRJc1NlbmRpbmcodHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgdHggPSBhd2FpdCBidWlsZFRyYW5zYWN0aW9uKG9wdGlvbnMpO1xuICAgICAgICBjb25zdCBjb21waWxlZFR4ID0gY29tcGlsZVNvbGFuYVR4KHR4KTtcblxuICAgICAgICBjb25zdCBoYXNoID0gYXdhaXQgcmVxdWVzdCh7XG4gICAgICAgICAgbWV0aG9kOiBScGNNZXRob2QuU09MQU5BX1NJR05fQU5EX1NFTkRfVFJBTlNBQ1RJT04sXG4gICAgICAgICAgcGFyYW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGFjY291bnQ6IGFjY291bnQuYWRkcmVzc1NWTSxcbiAgICAgICAgICAgICAgc2VyaWFsaXplZFR4OiBzZXJpYWxpemVTb2xhbmFUeChjb21waWxlZFR4KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICBzZXRFcnJvcihTZW5kRXJyb3JNZXNzYWdlLlVOS05PV05fRVJST1IpO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRJc1NlbmRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2J1aWxkVHJhbnNhY3Rpb24sIHJlcXVlc3QsIGFjY291bnQuYWRkcmVzc1NWTV0sXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBlcnJvcixcbiAgICBpc1NlbmRpbmcsXG4gICAgaXNWYWxpZDogIWlzVmFsaWRhdGluZyAmJiAhZXJyb3IsXG4gICAgaXNWYWxpZGF0aW5nLFxuICAgIG1pbkFtb3VudCxcbiAgICBtYXhBbW91bnQsXG4gICAgc2VuZCxcbiAgICB2YWxpZGF0ZSxcbiAgfTtcbn07XG5cbmNvbnN0IGdldEFjY291bnRPY2N1cGllZFNwYWNlID0gYXN5bmMgKFxuICBhZGRyZXNzOiBBZGRyZXNzLFxuICBwcm92aWRlcjogU29sYW5hUHJvdmlkZXIsXG4pOiBQcm9taXNlPGJpZ2ludD4gPT4ge1xuICBpZiAoQUNDT1VOVF9TUEFDRV9DQUNIRS5oYXMoYWRkcmVzcykpIHtcbiAgICByZXR1cm4gQUNDT1VOVF9TUEFDRV9DQUNIRS5nZXQoYWRkcmVzcykhO1xuICB9XG5cbiAgY29uc3QgYWNjb3VudEluZm8gPSBhd2FpdCBwcm92aWRlci5nZXRBY2NvdW50SW5mbyhhZGRyZXNzKS5zZW5kKCk7XG4gIGNvbnN0IHNwYWNlID0gYWNjb3VudEluZm8udmFsdWU/LnNwYWNlID8/IDBuO1xuICBBQ0NPVU5UX1NQQUNFX0NBQ0hFLnNldChhZGRyZXNzLCBzcGFjZSk7XG5cbiAgcmV0dXJuIHNwYWNlO1xufTtcblxuY29uc3QgZ2V0UmVudEV4ZW1wdE1pbmltdW0gPSBhc3luYyAoXG4gIHNwYWNlOiBiaWdpbnQsXG4gIHByb3ZpZGVyOiBTb2xhbmFQcm92aWRlcixcbik6IFByb21pc2U8YmlnaW50PiA9PiB7XG4gIGlmIChSRU5UX0VYRU1QVF9DQUNIRS5oYXMoc3BhY2UpKSB7XG4gICAgcmV0dXJuIFJFTlRfRVhFTVBUX0NBQ0hFLmdldChzcGFjZSkhO1xuICB9XG5cbiAgY29uc3QgcmVudEV4ZW1wdE1pbmltdW0gPSBhd2FpdCBwcm92aWRlclxuICAgIC5nZXRNaW5pbXVtQmFsYW5jZUZvclJlbnRFeGVtcHRpb24oMG4pXG4gICAgLnNlbmQoKTtcblxuICBSRU5UX0VYRU1QVF9DQUNIRS5zZXQoMG4sIHJlbnRFeGVtcHRNaW5pbXVtKTtcblxuICByZXR1cm4gcmVudEV4ZW1wdE1pbmltdW07XG59O1xuIiwiaW1wb3J0IHsgTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL21vZGVscyc7XG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQge1xuICBBdm1DYXBhYmxlQWNjb3VudCxcbiAgUHZtQ2FwYWJsZUFjY291bnQsXG4gIFN2bUNhcGFibGVBY2NvdW50LFxufSBmcm9tICcuL2hvb2tzL3VzZVNlbmQvbW9kZWxzJztcbmltcG9ydCB7XG4gIE5ldHdvcmtUb2tlbldpdGhCYWxhbmNlLFxuICBOZnRUb2tlbldpdGhCYWxhbmNlLFxuICBUb2tlbldpdGhCYWxhbmNlQVZNLFxuICBUb2tlbldpdGhCYWxhbmNlQlRDLFxuICBUb2tlbldpdGhCYWxhbmNlRVJDMjAsXG4gIFRva2VuV2l0aEJhbGFuY2VQVk0sXG4gIFRva2VuV2l0aEJhbGFuY2VTUEwsXG4gIFRva2VuV2l0aEJhbGFuY2VTVk0sXG59IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyBOZXR3b3JrRmVlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmtGZWUvbW9kZWxzJztcblxuZXhwb3J0IHR5cGUgU2VuZFBhZ2VQcm9wczxQcm92aWRlciwgVG9rZW4sIFRva2Vucz4gPSB7XG4gIG5ldHdvcms6IE5ldHdvcms7XG4gIHRva2VuTGlzdDogVG9rZW5zO1xuICBmcm9tQWRkcmVzczogc3RyaW5nO1xuICBuYXRpdmVUb2tlbjogVG9rZW47XG4gIG1heEZlZTogYmlnaW50O1xuICBwcm92aWRlcjogUHJvdmlkZXI7XG4gIG9uU3VjY2VzczogKHR4SGFzaDogc3RyaW5nKSA9PiB2b2lkO1xuICBvbkZhaWx1cmU6IChlcnI6IHVua25vd24pID0+IHZvaWQ7XG4gIG9uQXBwcm92ZWQ6ICgpID0+IHZvaWQ7XG59O1xuXG5leHBvcnQgdHlwZSBTZW5kUGFnZVByb3BzV2l0aFdhbGxldDxQcm92aWRlciwgVG9rZW4sIFRva2Vucz4gPSBTZW5kUGFnZVByb3BzPFxuICBQcm92aWRlcixcbiAgVG9rZW4sXG4gIFRva2Vuc1xuPiAmIHtcbiAgYWNjb3VudDogQWNjb3VudDtcbn07XG5cbmV4cG9ydCB0eXBlIFNlbmRQYWdlUHJvcHNXaXRoV2FsbGV0UFZNPFByb3ZpZGVyLCBUb2tlbiwgVG9rZW5zPiA9IFNlbmRQYWdlUHJvcHM8XG4gIFByb3ZpZGVyLFxuICBUb2tlbixcbiAgVG9rZW5zXG4+ICYge1xuICBhY2NvdW50OiBQdm1DYXBhYmxlQWNjb3VudDtcbiAgbmV0d29ya0ZlZTogTmV0d29ya0ZlZTtcbn07XG5cbmV4cG9ydCB0eXBlIFNlbmRQYWdlUHJvcHNXaXRoV2FsbGV0U1ZNPFByb3ZpZGVyLCBUb2tlbiwgVG9rZW5zPiA9IFNlbmRQYWdlUHJvcHM8XG4gIFByb3ZpZGVyLFxuICBUb2tlbixcbiAgVG9rZW5zXG4+ICYge1xuICBhY2NvdW50OiBTdm1DYXBhYmxlQWNjb3VudDtcbn07XG5cbmV4cG9ydCB0eXBlIFNlbmRQYWdlUHJvcHNXaXRoV2FsbGV0QVZNPFByb3ZpZGVyLCBUb2tlbiwgVG9rZW5zPiA9IFNlbmRQYWdlUHJvcHM8XG4gIFByb3ZpZGVyLFxuICBUb2tlbixcbiAgVG9rZW5zXG4+ICYge1xuICBhY2NvdW50OiBBdm1DYXBhYmxlQWNjb3VudDtcbn07XG5cbmV4cG9ydCB0eXBlIEJhc2VTZW5kT3B0aW9ucyA9IHtcbiAgYWRkcmVzczogc3RyaW5nO1xuICBhbW91bnQ6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFNvbFNlbmRPcHRpb25zID0gQmFzZVNlbmRPcHRpb25zICYge1xuICB0b2tlbjogVG9rZW5XaXRoQmFsYW5jZVNWTTtcbn07XG5cbmV4cG9ydCB0eXBlIE5hdGl2ZVNlbmRPcHRpb25zID0gQmFzZVNlbmRPcHRpb25zICYge1xuICB0b2tlbjogTmV0d29ya1Rva2VuV2l0aEJhbGFuY2U7XG59O1xuXG5leHBvcnQgdHlwZSBBVk1TZW5kT3B0aW9ucyA9IEJhc2VTZW5kT3B0aW9ucyAmIHtcbiAgdG9rZW46IFRva2VuV2l0aEJhbGFuY2VBVk07XG59O1xuXG5leHBvcnQgdHlwZSBQVk1TZW5kT3B0aW9ucyA9IEJhc2VTZW5kT3B0aW9ucyAmIHtcbiAgdG9rZW46IFRva2VuV2l0aEJhbGFuY2VQVk07XG4gIGdhc1ByaWNlPzogYmlnaW50O1xufTtcblxuZXhwb3J0IHR5cGUgRXJjMjBTZW5kT3B0aW9ucyA9IEJhc2VTZW5kT3B0aW9ucyAmIHtcbiAgdG9rZW46IFRva2VuV2l0aEJhbGFuY2VFUkMyMDtcbn07XG5cbmV4cG9ydCB0eXBlIFNwbFNlbmRPcHRpb25zID0gQmFzZVNlbmRPcHRpb25zICYge1xuICB0b2tlbjogVG9rZW5XaXRoQmFsYW5jZVNQTDtcbn07XG5cbmV4cG9ydCB0eXBlIE5mdFNlbmRPcHRpb25zID0gQmFzZVNlbmRPcHRpb25zICYge1xuICB0b2tlbjogTmZ0VG9rZW5XaXRoQmFsYW5jZTtcbiAgYW1vdW50OiBuZXZlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEJ0Y1NlbmRPcHRpb25zID0ge1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIGFtb3VudDogbnVtYmVyO1xuICB0b2tlbjogVG9rZW5XaXRoQmFsYW5jZUJUQztcbiAgZmVlUmF0ZTogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgU2VuZE9wdGlvbnMgPSBOYXRpdmVTZW5kT3B0aW9ucyB8IEVyYzIwU2VuZE9wdGlvbnMgfCBOZnRTZW5kT3B0aW9ucztcblxuZXhwb3J0IHR5cGUgU29sYW5hU2VuZE9wdGlvbnMgPSBTb2xTZW5kT3B0aW9ucyB8IFNwbFNlbmRPcHRpb25zO1xuXG5leHBvcnQgY29uc3QgU09MQU5BX0ZJWEVEX0JBU0VfRkVFID0gNTAwMG47XG4iLCJpbXBvcnQgeyB1dGlscyB9IGZyb20gJ0BhdmFsYWJzL2F2YWxhbmNoZWpzJztcbmltcG9ydCB7IEZlZVN0YXRlIH0gZnJvbSAnQGF2YWxhYnMvYXZhbGFuY2hlanMvZGlzdC92bXMvcHZtJztcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tICdAYXZhbGFicy9jb3JlLWNoYWlucy1zZGsnO1xuaW1wb3J0IHsgQXZhbGFuY2hlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5pbXBvcnQgeyBMRURHRVJfVFhfU0laRV9MSU1JVF9CWVRFUyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9sZWRnZXIvbW9kZWxzJztcbmltcG9ydCB7IGlzUGNoYWluTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzQXZhbGFuY2hlUGNoYWluTmV0d29yayc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdAc3JjL3V0aWxzL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQ29tbW9uRXJyb3IgfSBmcm9tICdAc3JjL3V0aWxzL2Vycm9ycyc7XG5jb25zdCBNQVhfTEVER0VSX09VVFBVVFMgPSA2NDtcbmVudW0gQ0hBSU5fQUxJQVMge1xuICBQID0gJ1AnLFxuICBYID0gJ1gnLFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TWF4VXR4b1NldChcbiAgaXNMZWRnZXJXYWxsZXQ6IGJvb2xlYW4sXG4gIHByb3ZpZGVyOiBBdmFsYW5jaGUuSnNvblJwY1Byb3ZpZGVyLFxuICB3YWxsZXQ6IEF2YWxhbmNoZS5BZGRyZXNzV2FsbGV0LFxuICBuZXR3b3JrOiBOZXR3b3JrLFxuICBmZWVTdGF0ZT86IEZlZVN0YXRlLFxuICBwcmVsb2FkZWRVdHhvU2V0PzogdXRpbHMuVXR4b1NldCxcbikge1xuICBjb25zdCBjaGFpbkFsaWFzVG9Vc2UgPSBpc1BjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICA/IENIQUlOX0FMSUFTLlBcbiAgICA6IENIQUlOX0FMSUFTLlg7XG4gIGNvbnN0IHV0eG9zID0gcHJlbG9hZGVkVXR4b1NldCA/PyAoYXdhaXQgd2FsbGV0LmdldFVUWE9zKGNoYWluQWxpYXNUb1VzZSkpO1xuICBsZXQgZmlsdGVyZWRVdHhvcyA9IEF2YWxhbmNoZS5zb3J0VVRYT3NCeUFtb3VudCh1dHhvcy5nZXRVVFhPcygpLCB0cnVlKTtcblxuICBpZiAoaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspKSB7XG4gICAgYXNzZXJ0KGZlZVN0YXRlLCBDb21tb25FcnJvci5Vbmtub3duTmV0d29ya0ZlZSk7XG5cbiAgICB0cnkge1xuICAgICAgZmlsdGVyZWRVdHhvcyA9IEF2YWxhbmNoZS5nZXRNYXhpbXVtVXR4b1NldCh7XG4gICAgICAgIHdhbGxldCxcbiAgICAgICAgdXR4b3M6IHV0eG9zLmdldFVUWE9zKCksXG4gICAgICAgIHNpemVTdXBwb3J0ZWRUeDogQXZhbGFuY2hlLlNpemVTdXBwb3J0ZWRUeC5CYXNlUCxcbiAgICAgICAgbGltaXQ6IGlzTGVkZ2VyV2FsbGV0ID8gTEVER0VSX1RYX1NJWkVfTElNSVRfQllURVMgOiB1bmRlZmluZWQsXG4gICAgICAgIGZlZVN0YXRlLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNhbGN1bGF0aW5nIG1heGltdW0gdXR4byBzZXQnLCB7XG4gICAgICAgIGU6IGVycm9yLFxuICAgICAgICB0eFR5cGU6IEF2YWxhbmNoZS5TaXplU3VwcG9ydGVkVHguQmFzZVAsXG4gICAgICAgIHV0eG9zLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZmlsdGVyZWRVdHhvcyA9IGlzTGVkZ2VyV2FsbGV0XG4gICAgPyBmaWx0ZXJlZFV0eG9zLnNsaWNlKDAsIE1BWF9MRURHRVJfT1VUUFVUUylcbiAgICA6IGZpbHRlcmVkVXR4b3M7XG5cbiAgY29uc3QgdXR4b1NldCA9IG5ldyB1dGlscy5VdHhvU2V0KGZpbHRlcmVkVXR4b3MpO1xuICBjb25zdCBhdmF4ID0gcHJvdmlkZXIuZ2V0QXZheElEKCk7XG4gIHJldHVybiB7XG4gICAgdXR4b3M6IHV0eG9TZXQsXG4gICAgYmFsYW5jZTogQXZhbGFuY2hlLmdldEFzc2V0QmFsYW5jZSh1dHhvU2V0LCBhdmF4KSxcbiAgfTtcbn1cbiIsImltcG9ydCB7XG4gIGlzQmFzZTU4QWRkcmVzc0luTmV0d29yayxcbiAgaXNCZWNoMzJBZGRyZXNzSW5OZXR3b3JrLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWJyaWRnZS1zZGsnO1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiBhZGRyZXNzIGlzIGEgdmFsaWQgQml0Y29pbiBhZGRyZXNzXG4gKiBAcGFyYW0gYWRkcmVzcyBCaXRjb2luIGFkZHJlc3MsIGJlY2gzMiBvciBiNThcbiAqIEBwYXJhbSBpc01haW5uZXQgVmVyaWZ5IGFkZHJlc3MgYWdhaW5zdCBtYWlubmV0IG9yIHRlc3RuZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQnRjQWRkcmVzc0luTmV0d29yayhhZGRyZXNzOiBzdHJpbmcsIGlzTWFpbm5ldDogYm9vbGVhbikge1xuICByZXR1cm4gKFxuICAgIGlzQmVjaDMyQWRkcmVzc0luTmV0d29yayhhZGRyZXNzLCBpc01haW5uZXQpIHx8XG4gICAgaXNCYXNlNThBZGRyZXNzSW5OZXR3b3JrKGFkZHJlc3MsIGlzTWFpbm5ldClcbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJpdGNvaW5JbnB1dFVUWE8sXG4gIEJpdGNvaW5Qcm92aWRlcixcbiAgY3JlYXRlVHJhbnNmZXJUeCxcbiAgZ2V0TWF4VHJhbnNmZXJBbW91bnQsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgaW5wdXRCeXRlcyB9IGZyb20gJ2NvaW5zZWxlY3QvdXRpbHMnO1xuXG5pbXBvcnQgeyBCdGNTZW5kT3B0aW9ucyB9IGZyb20gJ0BzcmMvcGFnZXMvU2VuZC9tb2RlbHMnO1xuXG5pbXBvcnQgeyBpc0J0Y0FkZHJlc3NJbk5ldHdvcmsgfSBmcm9tICcuLi9pc0J0Y0FkZHJlc3NJbk5ldHdvcmsnO1xuaW1wb3J0IHsgU2VuZEVycm9yTWVzc2FnZSB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFRva2VuV2l0aEJhbGFuY2VCVEMgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgZ2V0QnRjSW5wdXRVdHhvcyA9IGFzeW5jIChcbiAgcHJvdmlkZXI6IEJpdGNvaW5Qcm92aWRlcixcbiAgdG9rZW46IFRva2VuV2l0aEJhbGFuY2VCVEMsXG4gIGZlZVJhdGU/OiBudW1iZXIsXG4pID0+IHtcbiAgY29uc3QgdXR4b3MgPSBhd2FpdCBwcm92aWRlci5nZXRTY3JpcHRzRm9yVXR4b3ModG9rZW4udXR4b3MgPz8gW10pO1xuXG4gIGlmICh0eXBlb2YgZmVlUmF0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBGaWx0ZXIgb3V0IFVUWE9zIHRoYXQgd291bGQgbm90IGJlIHVzZWQgd2l0aCB0aGUgY3VycmVudCBmZWUgcmF0ZSxcbiAgICAvLyB0aGF0IGlzIHRob3NlIGZvciB3aGljaCBmZWUgdG8gdXNlIHRoZSBVVFhPIHdvdWxkIGJlIGhpZ2hlciB0aGFuIGl0cyB2YWx1ZS5cbiAgICByZXR1cm4gdXR4b3MuZmlsdGVyKCh1dHhvKSA9PiB7XG4gICAgICBjb25zdCB1dHhvRmVlID0gaW5wdXRCeXRlcyh1dHhvKSAqIGZlZVJhdGU7XG5cbiAgICAgIHJldHVybiB1dHhvRmVlIDwgdXR4by52YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB1dHhvcztcbn07XG5cbmV4cG9ydCBjb25zdCBidWlsZEJ0Y1R4ID0gYXN5bmMgKFxuICBmcm9tOiBzdHJpbmcsXG4gIHByb3ZpZGVyOiBCaXRjb2luUHJvdmlkZXIsXG4gIHsgYW1vdW50LCBhZGRyZXNzLCB0b2tlbiwgZmVlUmF0ZSB9OiBCdGNTZW5kT3B0aW9ucyxcbikgPT4ge1xuICBjb25zdCB1dHhvcyA9IGF3YWl0IGdldEJ0Y0lucHV0VXR4b3MocHJvdmlkZXIsIHRva2VuKTtcblxuICByZXR1cm4gY3JlYXRlVHJhbnNmZXJUeChcbiAgICBhZGRyZXNzLFxuICAgIGZyb20sXG4gICAgYW1vdW50LFxuICAgIGZlZVJhdGUsXG4gICAgdXR4b3MsXG4gICAgcHJvdmlkZXIuZ2V0TmV0d29yaygpLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQnRjU2VuZCA9IChcbiAgZnJvbTogc3RyaW5nLFxuICB7IGFkZHJlc3MsIGFtb3VudCwgZmVlUmF0ZSB9OiBCdGNTZW5kT3B0aW9ucyxcbiAgdXR4b3M6IEJpdGNvaW5JbnB1dFVUWE9bXSxcbiAgaXNNYWlubmV0OiBib29sZWFuLFxuKSA9PiB7XG4gIGlmICghYWRkcmVzcykge1xuICAgIHJldHVybiBTZW5kRXJyb3JNZXNzYWdlLkFERFJFU1NfUkVRVUlSRUQ7XG4gIH1cblxuICBpZiAoIWZlZVJhdGUpIHtcbiAgICByZXR1cm4gU2VuZEVycm9yTWVzc2FnZS5JTlZBTElEX05FVFdPUktfRkVFO1xuICB9XG5cbiAgaWYgKCFpc0J0Y0FkZHJlc3NJbk5ldHdvcmsoYWRkcmVzcywgaXNNYWlubmV0KSkge1xuICAgIHJldHVybiBTZW5kRXJyb3JNZXNzYWdlLklOVkFMSURfQUREUkVTUztcbiAgfVxuXG4gIGlmICghYW1vdW50IHx8IGFtb3VudCA8PSAwKSB7XG4gICAgcmV0dXJuIFNlbmRFcnJvck1lc3NhZ2UuQU1PVU5UX1JFUVVJUkVEO1xuICB9XG5cbiAgY29uc3QgbWF4VHJhbnNmZXJBbW91bnQgPSBNYXRoLm1heChcbiAgICBnZXRNYXhUcmFuc2ZlckFtb3VudCh1dHhvcywgYWRkcmVzcywgZnJvbSwgZmVlUmF0ZSksXG4gICAgMCxcbiAgKTtcblxuICBpZiAoYW1vdW50ID4gbWF4VHJhbnNmZXJBbW91bnQpIHtcbiAgICByZXR1cm4gU2VuZEVycm9yTWVzc2FnZS5JTlNVRkZJQ0lFTlRfQkFMQU5DRTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcbiJdLCJuYW1lcyI6WyJQYWdlVGl0bGUiLCJQYWdlVGl0bGVWYXJpYW50IiwiVHJhbnMiLCJ1c2VUcmFuc2xhdGlvbiIsImdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUiLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJOb3RTdXBwb3J0ZWRCeVdhbGxldCIsImZ1bmN0aW9uTmFtZSIsIm5ldHdvcmsiLCJjaGlsZHJlbiIsInQiLCJmdW5jdGlvbk5hbWVMYWJlbCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJoZWlnaHQiLCJ2YXJpYW50IiwiUFJJTUFSWSIsImZsZXhHcm93IiwicHgiLCJhbGlnbkNvbnRlbnQiLCJqdXN0aWZ5Q29udGVudCIsIm1pbkhlaWdodCIsImFsaWduIiwiaTE4bktleSIsInZhbHVlcyIsIkJveCIsIkluZm9DaXJjbGVJY29uIiwiVG9vbHRpcCIsInVzZVRoZW1lIiwiQXBwcm92YWxTZWN0aW9uSGVhZGVyIiwibGFiZWwiLCJ0b29sdGlwIiwidG9vbHRpcEljb24iLCJmbGV4RGlyZWN0aW9uIiwiYWxpZ25JdGVtcyIsImNvbXBvbmVudCIsImZvbnRXZWlnaHQiLCJjdXJzb3IiLCJtbCIsInRpdGxlIiwiQXBwcm92YWxTZWN0aW9uQm9keSIsInJlc3QiLCJ0aGVtZSIsIl9leHRlbmRzIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyUmFkaXVzIiwicCIsImdhcCIsIkFwcHJvdmFsU2VjdGlvbiIsIlRva2VuVHlwZSIsInVzZU5ldHdvcmtDb250ZXh0IiwidXNlQ2FsbGJhY2siLCJ1c2VIaXN0b3J5IiwidXNlTG9jYXRpb24iLCJ1c2VTZXRTZW5kRGF0YUluUGFyYW1zIiwicGF0aG5hbWUiLCJoaXN0b3J5Iiwic2V0U2VuZERhdGFJblBhcmFtcyIsInRva2VuIiwiYWRkcmVzcyIsIm9wdGlvbnMiLCJhbW91bnQiLCJwdXNoT3JSZXBsYWNlIiwicmVwbGFjZSIsInB1c2giLCJwYXRoIiwic2VhcmNoIiwiVVJMU2VhcmNoUGFyYW1zIiwidG9rZW5TeW1ib2wiLCJzeW1ib2wiLCJuZXR3b3JrVG9rZW4iLCJ0b2tlbkFkZHJlc3MiLCJ0eXBlIiwiRVJDMjAiLCJ0b1N0cmluZyIsInVzZUVmZmVjdCIsInVzZU1lbW8iLCJ1c2VTdGF0ZSIsInVzZVRva2Vuc1dpdGhCYWxhbmNlcyIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJGdW5jdGlvbklzT2ZmbGluZSIsIk5ldHdvcmtWTVR5cGUiLCJ0b2FzdCIsIkZ1bmN0aW9uTmFtZXMiLCJ1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlIiwiRnVuY3Rpb25Jc1VuYXZhaWxhYmxlIiwidXNlQWNjb3VudHNDb250ZXh0IiwidXNlTmV0d29ya0ZlZUNvbnRleHQiLCJnZXRQcm92aWRlckZvck5ldHdvcmsiLCJBdmFsYW5jaGUiLCJCaXRjb2luUHJvdmlkZXIiLCJKc29uUnBjQmF0Y2hJbnRlcm5hbCIsImlzU29sYW5hUHJvdmlkZXIiLCJTZW5kRVZNIiwidG9hc3RDYXJkV2l0aExpbmsiLCJnZXRFeHBsb3JlckFkZHJlc3NCeU5ldHdvcmsiLCJTZW5kQlRDIiwiTG9hZGluZ1NlbmRGb3JtIiwiU2VuZFBWTSIsIlNlbmRBVk0iLCJpc0F2bUNhcGFibGVBY2NvdW50IiwiaXNQdm1DYXBhYmxlQWNjb3VudCIsImlzU3ZtQ2FwYWJsZUFjY291bnQiLCJTZW5kU1ZNIiwiZ2V0QWRkcmVzc0ZvckNoYWluIiwiU2VuZFBhZ2UiLCJuZXR3b3JrRmVlIiwiYWNjb3VudHMiLCJhY3RpdmUiLCJjYXB0dXJlRW5jcnlwdGVkIiwidG9rZW5zIiwiaXNGdW5jdGlvbkF2YWlsYWJsZSIsImlzRnVuY3Rpb25TdXBwb3J0ZWQiLCJTRU5EIiwibmF0aXZlVG9rZW4iLCJmaW5kIiwiTkFUSVZFIiwicHJvdmlkZXIiLCJzZXRQcm92aWRlciIsInVuZGVmaW5lZCIsImlzTW91bnRlZCIsInRoZW4iLCJmcm9tQWRkcmVzcyIsIm9uU3VjY2VzcyIsInR4SGFzaCIsImNoYWluSWQiLCJ1cmwiLCJvbkZhaWx1cmUiLCJlcnJvciIsIm9uQXBwcm92ZWQiLCJjaGFpbk5hbWUiLCJpc05ldHdvcmtGZWVSZWFkeSIsImxvdyIsIm1heEZlZVBlckdhcyIsImlzUHJvdmlkZXJSZWFkeSIsImRvZXNQcm92aWRlck1hdGNoVGhlTmV0d29yayIsImlzTG9hZGluZyIsInZtTmFtZSIsIkVWTSIsIm1heEZlZSIsInRva2VuTGlzdCIsIkJJVENPSU4iLCJQVk0iLCJhY2NvdW50IiwiQVZNIiwiZ2V0Q29udGV4dCIsImJhc2VUeEZlZSIsIlNWTSIsIkpzb25ScGNQcm92aWRlciIsImhhbmRsZVR4T3V0Y29tZSIsIlNlbmRGb3JtIiwidXNlUXVlcnlQYXJhbXMiLCJ1c2VBdm1TZW5kIiwic3RyaW5nVG9CaWdpbnQiLCJzZXRTdGF0ZUluUGFyYW1zIiwicGFyYW1zIiwic2V0QWRkcmVzcyIsImdldCIsInNldEFtb3VudCIsImlzU2VuZGluZyIsImlzVmFsaWQiLCJpc1ZhbGlkYXRpbmciLCJtYXhBbW91bnQiLCJzZW5kIiwidmFsaWRhdGUiLCJmcm9tIiwib25TZW5kIiwiaXNBcHByb3ZlZCIsImhhc0Vycm9yIiwicmVzdWx0IiwidHhFcnJvciIsImlucHV0QW1vdW50IiwiZGVjaW1hbHMiLCJhZGRyZXNzQVZNIiwiVE9LRU5fREVUQUlMUyIsIm9uQ29udGFjdENoYW5nZWQiLCJjb250YWN0IiwiYWRkcmVzc1hQIiwib25BbW91bnRDaGFuZ2VkIiwibmV3QW1vdW50Iiwib25Ub2tlbkNoYW5nZWQiLCJpc0J0Y0FkZHJlc3NJbk5ldHdvcmsiLCJ1c2VCdGNTZW5kIiwidXNlVmFsaWRBZGRyZXNzRnJvbVBhcmFtcyIsImFkZHJlc3NWYWxpZGF0b3IiLCJhZGQiLCJpc1Rlc3RuZXQiLCJhZGRyZXNzRnJvbVBhcmFtcyIsImlzTWFpbm5ldCIsImFkZHJlc3NCVEMiLCJpc1ZhbGlkQWRkcmVzcyIsInVzZUVWTVNlbmQiLCJ0b2tlbkZyb21QYXJhbXMiLCJzZXRUb2tlbiIsIm5ld1Rva2VuIiwidXNlUmVmIiwiQnV0dG9uIiwiU2Nyb2xsYmFycyIsInN0eWxlZCIsIlRva2VuU2VsZWN0IiwiU2VuZEVycm9yTWVzc2FnZSIsInVzZVNlbmRBbmFseXRpY3NEYXRhIiwiQ29udGFjdElucHV0IiwidXNlSWRlbnRpZnlBZGRyZXNzIiwiZ2V0U2VuZEVycm9yTWVzc2FnZSIsImdlbmVyYWxFcnJvcnMiLCJJTlNVRkZJQ0lFTlRfQkFMQU5DRV9GT1JfRkVFIiwiRVhDRVNTSVZFX05FVFdPUktfRkVFIiwiSU5WQUxJRF9ORVRXT1JLX0ZFRSIsIlVOQUJMRV9UT19GRVRDSF9VVFhPUyIsImVycm9yc1RvRXhjbHVkZUZvclRva2VuU2VsZWN0IiwiQUREUkVTU19SRVFVSVJFRCIsIklOVkFMSURfQUREUkVTUyIsIkZsZXhTY3JvbGxiYXJzIiwibWluQW1vdW50IiwiaWRlbnRpZnlBZGRyZXNzIiwiaXNDb250YWN0c09wZW4iLCJzZXRJc0NvbnRhY3RzT3BlbiIsImlzVG9rZW5TZWxlY3RPcGVuIiwic2V0SXNUb2tlblNlbGVjdE9wZW4iLCJjYXB0dXJlIiwic2VuZFRva2VuU2VsZWN0ZWRBbmFseXRpY3MiLCJzZW5kQW1vdW50RW50ZXJlZEFuYWx5dGljcyIsImZvcm1SZWYiLCJwdCIsInN0eWxlIiwibWF4SGVpZ2h0IiwiZGlzcGxheSIsInJlZiIsIm1iIiwib25DaGFuZ2UiLCJuZXdDb250YWN0IiwidGFiIiwiY29udGFjdFNvdXJjZSIsInNldElzT3BlbiIsIm9wZW4iLCJjb250YWluZXJSZWYiLCJwbCIsIm10IiwiY29sb3IiLCJwYWxldHRlIiwibWFpbiIsInB5IiwiQmlnSW50IiwidG9rZW5zTGlzdCIsInNlbGVjdGVkVG9rZW4iLCJvblRva2VuQ2hhbmdlIiwib25JbnB1dEFtb3VudENoYW5nZSIsIm9uU2VsZWN0VG9nZ2xlIiwiaXNPcGVuIiwiaW5jbHVkZXMiLCJwYiIsInBsYWNlbWVudCIsInNpemUiLCJvbkNsaWNrIiwiZGlzYWJsZWQiLCJmdWxsV2lkdGgiLCJHcm93IiwidXNlUHZtU2VuZCIsIkN1c3RvbUZlZXMiLCJnYXNQcmljZSIsInNldEdhc1ByaWNlIiwiZXN0aW1hdGVkRmVlIiwib25GZWVDdXN0b21pemVkIiwiYWRkcmVzc1BWTSIsImluIiwiQm9vbGVhbiIsIm1vdW50T25FbnRlciIsInVubW91bnRPbkV4aXQiLCJpc0NvbGxhcHNpYmxlIiwibWF4R2FzUHJpY2UiLCJiYXNlRmVlIiwibGltaXQiLCJ1c2VTdm1TZW5kIiwiU1BMIiwiYWRkcmVzc1NWTSIsImFkZHJlc3NDb3JlRXRoIiwiQmlnIiwidXRpbHMiLCJiaWdUb0JpZ0ludCIsInJlc29sdmUiLCJGZWF0dXJlR2F0ZXMiLCJ1c2VXYWxsZXRDb250ZXh0IiwiaXNWYWxpZEF2bUFkZHJlc3MiLCJzdHJpcEFkZHJlc3NQcmVmaXgiLCJEQXBwUHJvdmlkZXJSZXF1ZXN0IiwidXNlQ29ubmVjdGlvbkNvbnRleHQiLCJ1c2VGZWF0dXJlRmxhZ0NvbnRleHQiLCJnZXRNYXhVdHhvU2V0IiwiY29ycmVjdEFkZHJlc3NCeVByZWZpeCIsIlhDSEFJTl9BTElBUyIsInJlcXVlc3QiLCJmZWF0dXJlRmxhZ3MiLCJpc0xlZGdlcldhbGxldCIsInNldEVycm9yIiwic2V0SXNWYWxpZGF0aW5nIiwic2V0SXNTZW5kaW5nIiwic2V0TWF4QW1vdW50Iiwid2FsbGV0IiwiQWRkcmVzc1dhbGxldCIsImFkZHJlc3NDIiwiY2hlY2tGdW5jdGlvbkF2YWlsYWJpbGl0eSIsIlNFTkRfWF9DSEFJTiIsIlNFTkRfTk9UX0FWQUlMQUJMRSIsInNldEVycm9yQW5kRW5kVmFsaWRhdGluZyIsIm1lc3NhZ2UiLCJhbW91bnRUb1VzZSIsImVycm9yUmVhc29uIiwidXR4b3MiLCJ1dHhvc0Vycm9yIiwiYXZhaWxhYmxlIiwiYmFsYW5jZSIsIm1heEF2YWlsYWJsZSIsImFtb3VudEJpZ0ludCIsIm1hdlZhbHVlIiwiQU1PVU5UX1JFUVVJUkVEIiwiSU5TVUZGSUNJRU5UX0JBTEFOQ0UiLCJhdmF4IiwiZ2V0QXZheElEIiwiY2hhbmdlQWRkcmVzcyIsInBhcnNlIiwidW5zaWduZWRUeCIsImJhc2VUWCIsInV0eG9TZXQiLCJjaGFpbiIsInRvQWRkcmVzcyIsImFtb3VudHNQZXJBc3NldCIsImNoYW5nZUFkZHJlc3NlcyIsIm1hbmFnZXIiLCJnZXRNYW5hZ2VyRm9yVk0iLCJnZXRWTSIsImNvZGVjIiwiZ2V0Q29kZWNGcm9tQnVmZmVyIiwidG9CeXRlcyIsInRyYW5zYWN0aW9uSGV4IiwiQnVmZmVyIiwiY2hhaW5BbGlhcyIsIm1hcCIsInV0eG8iLCJidWZmZXJUb0hleCIsIm1ldGhvZCIsIkFWQUxBTkNIRV9TRU5EX1RSQU5TQUNUSU9OIiwic3RyaW5nVG9CTiIsImdldE1heFRyYW5zZmVyQW1vdW50IiwiUnBjTWV0aG9kIiwiZ2V0QnRjSW5wdXRVdHhvcyIsInZhbGlkYXRlQnRjU2VuZCIsInNldFV0eG9zIiwiTnVtYmVyIiwiX3V0eG9zIiwiY2F0Y2giLCJhbW91bnRCTiIsImFtb3VudEluU2F0b3NoaXMiLCJ0b051bWJlciIsIm1heFRyYW5zZmVyQW1vdW50IiwiTWF0aCIsIm1heCIsInZhbGlkYXRpb25FcnJvciIsImZlZVJhdGUiLCJCSVRDT0lOX1NFTkRfVFJBTlNBQ1RJT04iLCJ0byIsImlzVmFsaWRQdm1BZGRyZXNzIiwiUENIQUlOX0FMSUFTIiwic2V0RXN0aW1hdGVkRmVlIiwiZmVlU3RhdGUiLCJzZXRGZWVTdGF0ZSIsInNldFV0eG9TZXQiLCJnZXRVVFhPcyIsInUiLCJnZXRBcGlQIiwiZ2V0RmVlU3RhdGUiLCJzdGF0ZSIsIlNFTkRfUF9DSEFJTiIsInByaWNlIiwiYnVpbGRUcmFuc2FjdGlvbiIsInBhcnNlVHgiLCJmZWVUb2xlcmFuY2UiLCJnZXRGZWVUb2xlcmFuY2UiLCJwYXJzZWRUeCIsInBhcnNlQXZhbGFuY2hlVHgiLCJ0eEZlZSIsImVyciIsImNvbnNvbGUiLCJjaG9zZW5HYXNQcmljZSIsIm1hcmtldEdhc1ByaWNlIiwiZGlmZmVyZW5jZSIsImFicyIsIm1pbiIsImNlaWwiLCJ0cmFuc2ZlclNvbCIsImNvbXBpbGVTb2xhbmFUeCIsInNlcmlhbGl6ZVNvbGFuYVR4IiwidHJhbnNmZXJUb2tlbiIsImlzQWRkcmVzcyIsImJpZ0ludFRvU3RyaW5nIiwiU09MQU5BX0ZJWEVEX0JBU0VfRkVFIiwiUkVOVF9FWEVNUFRfQ0FDSEUiLCJNYXAiLCJBQ0NPVU5UX1NQQUNFX0NBQ0hFIiwic2V0TWluQW1vdW50IiwibWludCIsInJlbWFpbmluZ0JhbGFuY2UiLCJzcGFjZU9jY3VwaWVkIiwiZ2V0QWNjb3VudE9jY3VwaWVkU3BhY2UiLCJtaW5pbXVtIiwiZ2V0UmVudEV4ZW1wdE1pbmltdW0iLCJBTU9VTlRfVE9PX0xPVyIsInR4IiwiY29tcGlsZWRUeCIsImhhc2giLCJTT0xBTkFfU0lHTl9BTkRfU0VORF9UUkFOU0FDVElPTiIsInNlcmlhbGl6ZWRUeCIsIlVOS05PV05fRVJST1IiLCJoYXMiLCJhY2NvdW50SW5mbyIsImdldEFjY291bnRJbmZvIiwic3BhY2UiLCJ2YWx1ZSIsInNldCIsInJlbnRFeGVtcHRNaW5pbXVtIiwiZ2V0TWluaW11bUJhbGFuY2VGb3JSZW50RXhlbXB0aW9uIiwiTEVER0VSX1RYX1NJWkVfTElNSVRfQllURVMiLCJpc1BjaGFpbk5ldHdvcmsiLCJhc3NlcnQiLCJDb21tb25FcnJvciIsIk1BWF9MRURHRVJfT1VUUFVUUyIsIkNIQUlOX0FMSUFTIiwicHJlbG9hZGVkVXR4b1NldCIsImNoYWluQWxpYXNUb1VzZSIsIlAiLCJYIiwiZmlsdGVyZWRVdHhvcyIsInNvcnRVVFhPc0J5QW1vdW50IiwiVW5rbm93bk5ldHdvcmtGZWUiLCJnZXRNYXhpbXVtVXR4b1NldCIsInNpemVTdXBwb3J0ZWRUeCIsIlNpemVTdXBwb3J0ZWRUeCIsIkJhc2VQIiwiZSIsInR4VHlwZSIsInNsaWNlIiwiVXR4b1NldCIsImdldEFzc2V0QmFsYW5jZSIsImlzQmFzZTU4QWRkcmVzc0luTmV0d29yayIsImlzQmVjaDMyQWRkcmVzc0luTmV0d29yayIsImNyZWF0ZVRyYW5zZmVyVHgiLCJpbnB1dEJ5dGVzIiwiZ2V0U2NyaXB0c0ZvclV0eG9zIiwiZmlsdGVyIiwidXR4b0ZlZSIsImJ1aWxkQnRjVHgiLCJnZXROZXR3b3JrIl0sInNvdXJjZVJvb3QiOiIifQ==