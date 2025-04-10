"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_ContainedDropdown_tsx-src_pages_Collectibles_CollectibleSend_tsx"],{

/***/ "./src/components/common/ContainedDropdown.tsx":
/*!*****************************************************!*\
  !*** ./src/components/common/ContainedDropdown.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContainedDropdown": () => (/* binding */ ContainedDropdown)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const BOTTOM_PADDING = 16;

// Dropdown is absolutely positioned, and fills the viewport beneath the select element
const getDropdownHeight = (anchorEl, containerRef) => {
  if (!anchorEl.current || !window.visualViewport) return 0; // Default height

  const anchorTop = anchorEl.current.getBoundingClientRect().top - anchorEl.current.offsetHeight;
  if (containerRef?.current) {
    return containerRef.current.getBoundingClientRect().bottom - anchorTop;
  }
  return window.visualViewport.height - anchorTop - BOTTOM_PADDING;
};
const getOffsetTop = anchorEl => anchorEl?.current ? anchorEl?.current?.offsetTop + anchorEl?.current?.offsetHeight : 0;
const Dropdown = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({
  sx = {},
  ...props
}, ref) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
  ref: ref,
  sx: {
    position: 'absolute',
    overflowY: 'hidden',
    backgroundColor: 'common.black',
    zIndex: 2,
    transition: 'height 0.15s ease, opacity 0.15s ease',
    right: 0,
    ...sx
  }
}, props)));
Dropdown.displayName = 'Dropdown';
/**
 * Wrapper for dropdown content on the browser-extension wallet.
 * Provides a full-width container spanning the space beneath the anchorEl, within the viewport.
 */
const ContainedDropdown = ({
  anchorEl,
  // Ref of the element above where the dropdown should appear
  children,
  isOpen = false,
  width,
  height,
  margin,
  borderRadius,
  setIsOpen,
  containerRef
}) => {
  const calculatedHeight = getDropdownHeight(anchorEl, containerRef);
  const top = getOffsetTop(anchorEl);
  const container = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const {
    spacing
  } = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();

  // We need to detect the where the user clicked. If outside of the anchor (that is the button which opens the dropdown) and the list, it should close the dropdown
  // if the user click the anchor (the button) it will handle that on its own
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const handleClickOutside = e => {
      const anchorElementClicked = anchorEl.current?.contains(e.target);
      const containerClicked = container.current?.contains(e.target);
      if (!anchorElementClicked && !containerClicked) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorEl, setIsOpen]);
  return /*#__PURE__*/React.createElement(Dropdown, {
    sx: {
      width: width ?? '100%',
      borderRadius: borderRadius ?? spacing(0, 0, 1, 1),
      margin: margin ?? '0',
      height: isOpen ? `${height || calculatedHeight - top}px` : 0,
      top,
      opacity: isOpen ? 1 : 0
    },
    ref: container
  }, children);
};

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

/***/ "./src/hooks/useNfts.ts":
/*!******************************!*\
  !*** ./src/hooks/useNfts.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useNfts": () => (/* binding */ useNfts)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/getAddressForChain */ "./src/utils/getAddressForChain.ts");





const useNfts = () => {
  const {
    balances
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__.useBalancesContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!network || !balances.nfts || !activeAccount) {
      return [];
    }
    const userAddress = (0,_src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_4__.getAddressForChain)(network, activeAccount);
    if (!userAddress) {
      return [];
    }
    return Object.values(balances.nfts?.[network.chainId]?.[userAddress] ?? {});
  }, [network, balances.nfts, activeAccount]);
};

/***/ }),

/***/ "./src/pages/Collectibles/CollectibleSend.tsx":
/*!****************************************************!*\
  !*** ./src/pages/Collectibles/CollectibleSend.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CollectibleSend": () => (/* binding */ CollectibleSend)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/jsonRpcBatchProvider.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useTokensWithBalances */ "./src/hooks/useTokensWithBalances.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _src_components_common_FunctionIsUnavailable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/components/common/FunctionIsUnavailable */ "./src/components/common/FunctionIsUnavailable.tsx");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_utils_network_getProviderForNetwork__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/utils/network/getProviderForNetwork */ "./src/utils/network/getProviderForNetwork.ts");
/* harmony import */ var _src_utils_toastCardWithLink__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/utils/toastCardWithLink */ "./src/utils/toastCardWithLink.tsx");
/* harmony import */ var _src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/utils/getExplorerAddress */ "./src/utils/getExplorerAddress.ts");
/* harmony import */ var _src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/contexts/NetworkFeeProvider */ "./src/contexts/NetworkFeeProvider.tsx");
/* harmony import */ var _Send_components_LoadingSendForm__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../Send/components/LoadingSendForm */ "./src/pages/Send/components/LoadingSendForm.tsx");
/* harmony import */ var _hooks_useCollectibleFromParams__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./hooks/useCollectibleFromParams */ "./src/pages/Collectibles/hooks/useCollectibleFromParams.tsx");
/* harmony import */ var _SendEVMCollectible__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./SendEVMCollectible */ "./src/pages/Collectibles/SendEVMCollectible.tsx");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






















function CollectibleSend() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_17__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_18__.useHistory)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__.useNetworkContext)();
  const {
    networkFee
  } = (0,_src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_12__.useNetworkFeeContext)();
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
    nft
  } = (0,_hooks_useCollectibleFromParams__WEBPACK_IMPORTED_MODULE_14__.useCollectibleFromParams)();
  const {
    isFunctionAvailable,
    isFunctionSupported
  } = (0,_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.useIsFunctionAvailable)(_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.FunctionNames.COLLECTIBLES);
  const nativeToken = tokens.find(({
    type
  }) => type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_16__.TokenType.NATIVE);
  const [provider, setProvider] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!network) {
      setProvider(undefined);
    } else {
      let isMounted = true;
      (0,_src_utils_network_getProviderForNetwork__WEBPACK_IMPORTED_MODULE_9__.getProviderForNetwork)(network).then(p => {
        if (isMounted && p instanceof _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_19__.JsonRpcBatchInternal) {
          setProvider(p);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [network]);
  const fromAddress = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_20__.NetworkVMType.EVM) {
      return active?.addressC ?? '';
    }
    return '';
  }, [active?.addressC, network?.vmName]);
  const onSuccess = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(txHash => {
    captureEncrypted('NftSendSucceeded', {
      address: fromAddress,
      txHash,
      chainId: network?.chainId,
      type: nft?.type
    });
    (0,_src_utils_toastCardWithLink__WEBPACK_IMPORTED_MODULE_10__.toastCardWithLink)({
      title: t('Send Successful'),
      url: (0,_src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_11__.getExplorerAddressByNetwork)(network, txHash),
      label: t('View in Explorer')
    });
    history.push('/home');
  }, [fromAddress, network, captureEncrypted, history, t, nft?.type]);
  const onFailure = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__["default"].error(t('Transaction Failed'));
    captureEncrypted('NftSendFailed', {
      address: fromAddress,
      chainId: network?.chainId,
      type: nft?.type
    });
  }, [captureEncrypted, fromAddress, network?.chainId, t, nft?.type]);
  const onApproved = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    captureEncrypted('NftSendStarted', {
      address: fromAddress,
      chainId: network?.chainId,
      type: nft?.type
    });
  }, [captureEncrypted, fromAddress, network?.chainId, nft?.type]);
  const tokenList = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [nft], [nft]);
  if (!isFunctionSupported) {
    return /*#__PURE__*/React.createElement(_src_components_common_FunctionIsUnavailable__WEBPACK_IMPORTED_MODULE_7__.FunctionIsUnavailable, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.FunctionNames.COLLECTIBLES,
      network: network?.chainName || 'Testnet'
    });
  }
  if (!isFunctionAvailable) {
    return /*#__PURE__*/React.createElement(_src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_4__.FunctionIsOffline, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.FunctionNames.COLLECTIBLES
    });
  }
  const isLoading = !nft || !active || !network || !fromAddress || !provider || !networkFee?.low?.maxFeePerGas || !nativeToken || !tokenList.length;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_22__.Stack, {
    sx: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitle, null, t('Send')), isLoading && /*#__PURE__*/React.createElement(_Send_components_LoadingSendForm__WEBPACK_IMPORTED_MODULE_13__.LoadingSendForm, null), !isLoading && network.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_20__.NetworkVMType.EVM && /*#__PURE__*/React.createElement(_SendEVMCollectible__WEBPACK_IMPORTED_MODULE_15__.SendEVMCollectible, {
    fromAddress: fromAddress,
    network: network,
    maxFee: networkFee.low.maxFeePerGas,
    nativeToken: nativeToken,
    provider: provider,
    tokenList: tokenList,
    onApproved: onApproved,
    onFailure: onFailure,
    onSuccess: onSuccess
  }), !isLoading && network.vmName !== _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_20__.NetworkVMType.EVM && /*#__PURE__*/React.createElement(_src_components_common_FunctionIsUnavailable__WEBPACK_IMPORTED_MODULE_7__.FunctionIsUnavailable, {
    functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_6__.FunctionNames.COLLECTIBLES,
    network: network?.chainName || 'Testnet'
  }));
}

/***/ }),

/***/ "./src/pages/Collectibles/SendEVMCollectible.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/Collectibles/SendEVMCollectible.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendEVMCollectible": () => (/* binding */ SendEVMCollectible)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useQueryParams */ "./src/hooks/useQueryParams.ts");
/* harmony import */ var _src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/isAddressValid */ "./src/utils/isAddressValid.ts");
/* harmony import */ var _src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/handleTxOutcome */ "./src/utils/handleTxOutcome.ts");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _Send_hooks_useSend_useEVMSend__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Send/hooks/useSend/useEVMSend */ "./src/pages/Send/hooks/useSend/useEVMSend.ts");
/* harmony import */ var _Send_components_ContactInput__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Send/components/ContactInput */ "./src/pages/Send/components/ContactInput.tsx");
/* harmony import */ var _Send_hooks_useIdentifyAddress__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Send/hooks/useIdentifyAddress */ "./src/pages/Send/hooks/useIdentifyAddress.ts");
/* harmony import */ var _Send_utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Send/utils/sendErrorMessages */ "./src/pages/Send/utils/sendErrorMessages.ts");
/* harmony import */ var _Send_hooks_useValidAddressFromParams__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Send/hooks/useValidAddressFromParams */ "./src/pages/Send/hooks/useValidAddressFromParams.ts");
/* harmony import */ var _components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/CollectibleMedia */ "./src/pages/Collectibles/components/CollectibleMedia.tsx");
/* harmony import */ var _hooks_useSetCollectibleParams__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./hooks/useSetCollectibleParams */ "./src/pages/Collectibles/hooks/useSetCollectibleParams.tsx");
/* harmony import */ var _src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/contexts/NetworkFeeProvider */ "./src/contexts/NetworkFeeProvider.tsx");
/* harmony import */ var _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/background/services/gasless/model */ "./src/background/services/gasless/model.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

















const FlexScrollbars = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Scrollbars)`
	> div {
		display: flex;
	}
}`;
const SendEVMCollectible = ({
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
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_17__.useTranslation)();
  const params = (0,_src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_1__.useQueryParams)();
  const identifyAddress = (0,_Send_hooks_useIdentifyAddress__WEBPACK_IMPORTED_MODULE_8__.useIdentifyAddress)();
  const addressFromParams = (0,_Send_hooks_useValidAddressFromParams__WEBPACK_IMPORTED_MODULE_10__.useValidAddressFromParams)(_src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_2__.isValidAddress);
  const [address, setAddress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(addressFromParams);
  const contact = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => address ? identifyAddress(address) : undefined, [address, identifyAddress]);
  const [isContactsOpen, setIsContactsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const setCollectibleParams = (0,_hooks_useSetCollectibleParams__WEBPACK_IMPORTED_MODULE_12__.useSetCollectibleParams)();
  const [token] = tokenList;
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__.useAnalyticsContext)();
  const {
    gaslessPhase
  } = (0,_src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_13__.useNetworkFeeContext)();
  const {
    error,
    isSending,
    isValid,
    isValidating,
    send,
    validate
  } = (0,_Send_hooks_useSend_useEVMSend__WEBPACK_IMPORTED_MODULE_6__.useEVMSend)({
    chainId: `0x${network.chainId.toString(16)}`,
    from: fromAddress,
    maxFee,
    nativeToken,
    provider
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    validate({
      address,
      token
    });
    if (address !== params.get('address') || token.address !== params.get('nft') || token.tokenId !== params.get('tokenId')) {
      setCollectibleParams({
        address,
        nft: token,
        options: {
          replace: true
        }
      });
    }
  }, [address, token, validate, setCollectibleParams, params]);
  const isSendAvailableWithGasless = gaslessPhase !== _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_14__.GaslessPhase.NOT_ELIGIBLE && error === _src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__.SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE;
  const onSend = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!isValid && !isSendAvailableWithGasless) {
      return;
    }
    const {
      isApproved,
      hasError,
      result: txHash,
      error: txError
    } = await (0,_src_utils_handleTxOutcome__WEBPACK_IMPORTED_MODULE_3__.handleTxOutcome)(send({
      address,
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
  }, [address, isSendAvailableWithGasless, isValid, onApproved, onFailure, onSuccess, send, token]);
  const formRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
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
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    ref: formRef,
    sx: {
      display: 'flex',
      flexGrow: 1,
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_Send_components_ContactInput__WEBPACK_IMPORTED_MODULE_7__.ContactInput, {
    contact: contact,
    onChange: newContact => {
      setAddress(newContact?.address ?? '');
      capture('NftSendContactSelected', {
        chainId: network?.chainId,
        type: token.type
      });
    },
    isContactsOpen: isContactsOpen,
    setIsOpen: open => setIsContactsOpen(open),
    containerRef: formRef
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      pl: 2,
      mt: 0.5,
      width: '100%',
      height: 2
    }
  }, (error === _src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__.SendErrorMessage.ADDRESS_REQUIRED || error === _src_utils_send_models__WEBPACK_IMPORTED_MODULE_4__.SendErrorMessage.INVALID_ADDRESS) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
    variant: "caption",
    sx: {
      color: theme => theme.palette.error.main
    }
  }, (0,_Send_utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_9__.getSendErrorMessage)(error))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      py: 0,
      px: 2,
      mt: 4,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
    component: "h2",
    variant: "body2",
    sx: {
      fontWeight: 'semibold',
      pb: 1
    }
  }, t('Collectible')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Card, {
    sx: {
      height: 'auto',
      p: 2,
      mt: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_11__.CollectibleMedia, {
    width: "80px",
    height: "auto",
    url: token.logoSmall || token.logoUri,
    hover: false
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
    component: "h2",
    variant: "body2",
    sx: {
      ml: 2
    }
  }, token.name)))))), !isContactsOpen && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      pt: 3,
      px: 2,
      pb: 3,
      width: '100%',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Tooltip, {
    placement: "top",
    sx: {
      width: '100%'
    },
    title: error && !isSendAvailableWithGasless ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
      variant: "body2"
    }, (0,_Send_utils_sendErrorMessages__WEBPACK_IMPORTED_MODULE_9__.getSendErrorMessage)(error)) : ''
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Button, {
    "data-testid": "send-next-button",
    variant: "contained",
    size: "large",
    onClick: onSend,
    disabled: !isSendAvailableWithGasless && (isValidating || !isValid || isSending),
    isLoading: isSending,
    fullWidth: true
  }, t('Next')))));
};

/***/ }),

/***/ "./src/pages/Collectibles/components/CollectibleMedia.tsx":
/*!****************************************************************!*\
  !*** ./src/pages/Collectibles/components/CollectibleMedia.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CollectibleMedia": () => (/* binding */ CollectibleMedia)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/pages/Collectibles/utils.ts");
/* harmony import */ var _ImageWrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ImageWrapper */ "./src/pages/Collectibles/components/ImageWrapper.tsx");
/* harmony import */ var _src_components_common_ImageWithFallback__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/ImageWithFallback */ "./src/components/common/ImageWithFallback.tsx");
/* harmony import */ var _src_utils_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/ipsfResolverWithFallback */ "./src/utils/ipsfResolverWithFallback.ts");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






const NftImage = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"])(_src_components_common_ImageWithFallback__WEBPACK_IMPORTED_MODULE_3__.ImageWithFallback)`
  width: ${({
  width
}) => width ?? '32px'};
  height: ${({
  height
}) => height ?? '32px'};
  max-width: ${({
  maxWidth
}) => maxWidth ?? 'unset'};
  max-height: ${({
  maxHeight
}) => maxHeight ?? 'unset'};
  border: 1px solid ${({
  theme
}) => `${theme.palette.common.black}1A`};
  box-sizing: border-box;
  filter: drop-shadow(
    0px 10px 25px ${({
  theme
}) => `${theme.palette.common.black}40`}
  );
  backdrop-filter: blur(25px);
  border-radius: ${({
  hasBorderRadius,
  borderRadius
}) => hasBorderRadius ? borderRadius ?? '8px' : 'none'};
  cursor: ${({
  showPointer
}) => showPointer ? 'default' : 'pointer'};
`;
const NftVideo = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"])('video')`
  width: ${({
  width
}) => width ?? '32px'};
  max-width: ${({
  maxWidth
}) => maxWidth ?? 'unset'};
  height: ${({
  height
}) => height ?? '32px'};
  max-height: ${({
  maxHeight
}) => maxHeight ?? 'unset'};
  border: 1px solid ${({
  theme
}) => `${theme.palette.common.black}1A`};
  box-sizing: border-box;
  filter: drop-shadow(
    0px 10px 25px ${({
  theme
}) => `${theme.palette.common.black}40`}
  );
  backdrop-filter: blur(25px);
  border-radius: ${({
  borderRadius
}) => borderRadius ?? '8px'};
`;
function CollectibleMedia({
  url,
  width,
  height,
  maxWidth,
  maxHeight,
  hover = false,
  margin,
  showPlayIcon = true,
  controls = false,
  className,
  borderRadius = '8px',
  showBalance = false,
  balance = 0n,
  showExpandOption = false,
  noAction = false
}) {
  const [isImageFullScreen, setIsImageFullScreen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [shouldUseLightIcon, setShouldUseLightIcon] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isMediaSettled, setIsMediaSettled] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false); // Either loaded or errored out.

  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      margin,
      flexDirection: 'row'
    },
    className: className
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexDirection: 'row',
      maxWidth: maxWidth ? maxWidth : 'unset',
      width: width ? width : '32px',
      position: 'absolute',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      columnGap: 1,
      zIndex: 3,
      mr: 3,
      mt: 1,
      pr: 1
    }
  }, showBalance && isMediaSettled && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Chip, {
    size: "small",
    sx: {
      backgroundColor: theme => shouldUseLightIcon ? 'primary.light' : theme.palette.grey[600],
      color: shouldUseLightIcon ? 'primary.contrastText' : 'primary.light',
      px: 1
    },
    label: balance.toString()
  }), showExpandOption && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ArrowsMaximizeIcon, {
    onClick: () => {
      setIsImageFullScreen(true);
    },
    size: "24",
    sx: {
      color: shouldUseLightIcon ? 'primary.light' : 'primary.contrastText',
      cursor: 'pointer'
    }
  })), (0,_utils__WEBPACK_IMPORTED_MODULE_1__.isVideo)(url) ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      position: 'relative',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(NftVideo, {
    width: width,
    height: height,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
    hover: hover,
    controls: controls,
    borderRadius: borderRadius
  }, /*#__PURE__*/React.createElement("source", {
    src: (0,_src_utils_ipsfResolverWithFallback__WEBPACK_IMPORTED_MODULE_4__.ipfsResolverWithFallback)(url),
    onLoadStart: () => setIsMediaSettled(true)
  })), showPlayIcon && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.TriangleRightIcon, {
    sx: {
      position: 'absolute',
      bottom: '8px',
      right: '8px',
      color: 'common.white'
    }
  })) : /*#__PURE__*/React.createElement(_ImageWrapper__WEBPACK_IMPORTED_MODULE_2__.ImageWrapper, {
    isOverlay: isImageFullScreen,
    onClick: () => {
      if (!showBalance && !noAction) setIsImageFullScreen(true);
    },
    onClose: () => setIsImageFullScreen(false),
    backdropImageUrl: url,
    shouldUseLightIcon: shouldUseLightIcon
  }, /*#__PURE__*/React.createElement(NftImage, {
    width: isImageFullScreen ? '100%' : width,
    height: isImageFullScreen ? 'auto' : height,
    src: url,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
    hover: hover,
    hasBorderRadius: !isImageFullScreen,
    borderRadius: borderRadius,
    showPointer: showExpandOption,
    onLoad: event => {
      const imageElement = event.target;
      if (imageElement instanceof HTMLImageElement) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.isImageDark)(imageElement, isDark => {
          setShouldUseLightIcon(isDark);
        });
      }
      setIsMediaSettled(true);
    },
    onError: () => setIsMediaSettled(true)
  })));
}

/***/ }),

/***/ "./src/pages/Collectibles/components/ImageWrapper.tsx":
/*!************************************************************!*\
  !*** ./src/pages/Collectibles/components/ImageWrapper.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageWrapper": () => (/* binding */ ImageWrapper)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function ImageWrapper({
  isOverlay,
  onClick,
  onClose,
  backdropImageUrl,
  shouldUseLightIcon,
  children
}) {
  if (isOverlay) {
    return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__.Overlay, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Box, {
      sx: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backdropImageUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(16px)'
      }
    }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
      sx: {
        height: '100%',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
      sx: {
        px: 1,
        py: 4,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
      onClick: onClose,
      "data-testid": "page-title-back-button",
      disableRipple: true,
      sx: {
        p: 0
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ChevronLeftIcon, {
      size: 32,
      sx: {
        color: shouldUseLightIcon ? 'primary.light' : 'primary.contrastText'
      }
    }))), children));
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    onClick: onClick,
    sx: {
      width: '100%',
      flexDirection: 'row'
    }
  }, children);
}

/***/ }),

/***/ "./src/pages/Collectibles/hooks/useCollectibleFromParams.tsx":
/*!*******************************************************************!*\
  !*** ./src/pages/Collectibles/hooks/useCollectibleFromParams.tsx ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useCollectibleFromParams": () => (/* binding */ useCollectibleFromParams)
/* harmony export */ });
/* harmony import */ var _src_hooks_useNfts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useNfts */ "./src/hooks/useNfts.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var xss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! xss */ "./node_modules/xss/lib/index.js");
/* harmony import */ var xss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(xss__WEBPACK_IMPORTED_MODULE_2__);




const useCollectibleFromParams = () => {
  const {
    search
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useLocation)();
  const nfts = (0,_src_hooks_useNfts__WEBPACK_IMPORTED_MODULE_0__.useNfts)();
  return (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    const {
      nft,
      tokenId
    } = Object.fromEntries(new URLSearchParams(search).entries());
    if (!nft || !tokenId) {
      return {
        nft: undefined,
        tokenId: xss__WEBPACK_IMPORTED_MODULE_2___default()(tokenId)
      };
    }
    const filteredAddress = xss__WEBPACK_IMPORTED_MODULE_2___default()(nft);
    return {
      nft: nfts?.find(item => item.address === filteredAddress && item.tokenId === tokenId),
      tokenId: xss__WEBPACK_IMPORTED_MODULE_2___default()(tokenId)
    };
  }, [nfts, search]);
};

/***/ }),

/***/ "./src/pages/Collectibles/hooks/useSetCollectibleParams.tsx":
/*!******************************************************************!*\
  !*** ./src/pages/Collectibles/hooks/useSetCollectibleParams.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useSetCollectibleParams": () => (/* binding */ useSetCollectibleParams)
/* harmony export */ });
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");

function useSetCollectibleParams() {
  const {
    pathname
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_0__.useLocation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_0__.useHistory)();
  return ({
    nft,
    address,
    options
  }) => {
    const pushOrReplace = options?.replace ? history.replace : history.push;
    pushOrReplace({
      pathname: options?.path ?? pathname,
      search: `?${new URLSearchParams({
        nft: nft?.address ?? '',
        tokenId: nft?.tokenId ?? '',
        address: address ?? ''
      }).toString()}`
    });
  };
}

/***/ }),

/***/ "./src/pages/Collectibles/utils.ts":
/*!*****************************************!*\
  !*** ./src/pages/Collectibles/utils.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isImageDark": () => (/* binding */ isImageDark),
/* harmony export */   "isVideo": () => (/* binding */ isVideo)
/* harmony export */ });
const isVideo = url => url && ['.mp4', '.webm', '.ogg'].includes(url.slice(url.lastIndexOf('.')));
const isImageDark = (img, callback) => {
  let colorSum = 0;
  if (!img) {
    // Default value is true (Dark image Mode)
    return callback(true);
  }
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // Default value is true (Dark image Mode)
      return callback(true);
    }
    ctx.drawImage(img, 0, 0);

    // we need to know the top right quater's average color
    const height = Math.floor(canvas.height / 2);
    const width = Math.floor(canvas.width / 2);
    const imageData = ctx.getImageData(width, 0, width, height);
    const data = imageData.data;
    for (let x = 0, len = data.length; x < len; x += 4) {
      const r = data[x];
      const g = data[x + 1];
      const b = data[x + 2];
      if (r === undefined || g === undefined || b === undefined) {
        throw new Error('Undefined color');
      }
      const avg = Math.floor((r + g + b) / 3);
      colorSum += avg;
    }
    const brightness = Math.floor(colorSum / (width * height));
    //Brightness is out of 255.
    return callback(brightness < 127.5);
  } catch {
    // Default value is true (Dark image Mode)
    return callback(true);
  }
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX0NvbnRhaW5lZERyb3Bkb3duX3RzeC1zcmNfcGFnZXNfQ29sbGVjdGlibGVzX0NvbGxlY3RpYmxlU2VuZF90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMEU7QUFPM0Q7QUFFZixNQUFNSyxjQUFjLEdBQUcsRUFBRTs7QUFFekI7QUFDQSxNQUFNQyxpQkFBaUIsR0FBR0EsQ0FDeEJDLFFBQThDLEVBQzlDQyxZQUFtRCxLQUN4QztFQUNYLElBQUksQ0FBQ0QsUUFBUSxDQUFDRSxPQUFPLElBQUksQ0FBQ0MsTUFBTSxDQUFDQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzs7RUFFM0QsTUFBTUMsU0FBUyxHQUNiTCxRQUFRLENBQUNFLE9BQU8sQ0FBQ0kscUJBQXFCLEVBQUUsQ0FBQ0MsR0FBRyxHQUM1Q1AsUUFBUSxDQUFDRSxPQUFPLENBQUNNLFlBQVk7RUFFL0IsSUFBSVAsWUFBWSxFQUFFQyxPQUFPLEVBQUU7SUFDekIsT0FBT0QsWUFBWSxDQUFDQyxPQUFPLENBQUNJLHFCQUFxQixFQUFFLENBQUNHLE1BQU0sR0FBR0osU0FBUztFQUN4RTtFQUVBLE9BQU9GLE1BQU0sQ0FBQ0MsY0FBYyxDQUFDTSxNQUFNLEdBQUdMLFNBQVMsR0FBR1AsY0FBYztBQUNsRSxDQUFDO0FBRUQsTUFBTWEsWUFBWSxHQUFJWCxRQUE4QyxJQUNsRUEsUUFBUSxFQUFFRSxPQUFPLEdBQ2JGLFFBQVEsRUFBRUUsT0FBTyxFQUFFVSxTQUFTLEdBQUdaLFFBQVEsRUFBRUUsT0FBTyxFQUFFTSxZQUFZLEdBQzlELENBQUM7QUFFUCxNQUFNSyxRQUFRLGdCQUFHbEIsaURBQVUsQ0FDekIsQ0FBQztFQUFFbUIsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUFFLEdBQUdDO0FBQU0sQ0FBQyxFQUFFQyxHQUFHLGtCQUN6QkMsS0FBQSxDQUFBQyxhQUFBLENBQUN6Qiw4REFBSyxFQUFBMEIsMEVBQUE7RUFDSkgs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Q0FBQyxLQUFLekwsU0FBUyxFQUFFO1FBQ3pELE1BQU0sSUFBSTBMLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztNQUNwQztNQUVBLE1BQU1DLEdBQUcsR0FBR1gsSUFBSSxDQUFDQyxLQUFLLENBQUMsQ0FBQ00sQ0FBQyxHQUFHQyxDQUFDLEdBQUdDLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdkNkLFFBQVEsSUFBSWdCLEdBQUc7SUFDakI7SUFFQSxNQUFNQyxVQUFVLEdBQUdaLElBQUksQ0FBQ0MsS0FBSyxDQUFDTixRQUFRLElBQUk1USxLQUFLLEdBQUdwQixNQUFNLENBQUMsQ0FBQztJQUMxRDtJQUNBLE9BQU8rUixRQUFRLENBQUNrQixVQUFVLEdBQUcsS0FBSyxDQUFDO0VBQ3JDLENBQUMsQ0FBQyxNQUFNO0lBQ047SUFDQSxPQUFPbEIsUUFBUSxDQUFDLElBQUksQ0FBQztFQUN2QjtBQUNGLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0NvbnRhaW5lZERyb3Bkb3duLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0Z1bmN0aW9uSXNPZmZsaW5lLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZU5mdHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvQ29sbGVjdGlibGVTZW5kLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0NvbGxlY3RpYmxlcy9TZW5kRVZNQ29sbGVjdGlibGUudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQ29sbGVjdGlibGVzL2NvbXBvbmVudHMvQ29sbGVjdGlibGVNZWRpYS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvY29tcG9uZW50cy9JbWFnZVdyYXBwZXIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQ29sbGVjdGlibGVzL2hvb2tzL3VzZUNvbGxlY3RpYmxlRnJvbVBhcmFtcy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvaG9va3MvdXNlU2V0Q29sbGVjdGlibGVQYXJhbXMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQ29sbGVjdGlibGVzL3V0aWxzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzLCB1c2VUaGVtZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQge1xuICBmb3J3YXJkUmVmLFxuICBNdXRhYmxlUmVmT2JqZWN0LFxuICBQcm9wc1dpdGhDaGlsZHJlbixcbiAgdXNlRWZmZWN0LFxuICB1c2VSZWYsXG59IGZyb20gJ3JlYWN0JztcblxuY29uc3QgQk9UVE9NX1BBRERJTkcgPSAxNjtcblxuLy8gRHJvcGRvd24gaXMgYWJzb2x1dGVseSBwb3NpdGlvbmVkLCBhbmQgZmlsbHMgdGhlIHZpZXdwb3J0IGJlbmVhdGggdGhlIHNlbGVjdCBlbGVtZW50XG5jb25zdCBnZXREcm9wZG93bkhlaWdodCA9IChcbiAgYW5jaG9yRWw6IE11dGFibGVSZWZPYmplY3Q8SFRNTEVsZW1lbnQgfCBudWxsPixcbiAgY29udGFpbmVyUmVmPzogTXV0YWJsZVJlZk9iamVjdDxIVE1MRWxlbWVudCB8IG51bGw+LFxuKTogbnVtYmVyID0+IHtcbiAgaWYgKCFhbmNob3JFbC5jdXJyZW50IHx8ICF3aW5kb3cudmlzdWFsVmlld3BvcnQpIHJldHVybiAwOyAvLyBEZWZhdWx0IGhlaWdodFxuXG4gIGNvbnN0IGFuY2hvclRvcCA9XG4gICAgYW5jaG9yRWwuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLVxuICAgIGFuY2hvckVsLmN1cnJlbnQub2Zmc2V0SGVpZ2h0O1xuXG4gIGlmIChjb250YWluZXJSZWY/LmN1cnJlbnQpIHtcbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tIC0gYW5jaG9yVG9wO1xuICB9XG5cbiAgcmV0dXJuIHdpbmRvdy52aXN1YWxWaWV3cG9ydC5oZWlnaHQgLSBhbmNob3JUb3AgLSBCT1RUT01fUEFERElORztcbn07XG5cbmNvbnN0IGdldE9mZnNldFRvcCA9IChhbmNob3JFbDogTXV0YWJsZVJlZk9iamVjdDxIVE1MRWxlbWVudCB8IG51bGw+KSA9PlxuICBhbmNob3JFbD8uY3VycmVudFxuICAgID8gYW5jaG9yRWw/LmN1cnJlbnQ/Lm9mZnNldFRvcCArIGFuY2hvckVsPy5jdXJyZW50Py5vZmZzZXRIZWlnaHRcbiAgICA6IDA7XG5cbmNvbnN0IERyb3Bkb3duID0gZm9yd2FyZFJlZjxIVE1MRGl2RWxlbWVudCwgU3RhY2tQcm9wcz4oXG4gICh7IHN4ID0ge30sIC4uLnByb3BzIH0sIHJlZikgPT4gKFxuICAgIDxTdGFja1xuICAgICAgcmVmPXtyZWZ9XG4gICAgICBzeD17e1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgb3ZlcmZsb3dZOiAnaGlkZGVuJyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnY29tbW9uLmJsYWNrJyxcbiAgICAgICAgekluZGV4OiAyLFxuICAgICAgICB0cmFuc2l0aW9uOiAnaGVpZ2h0IDAuMTVzIGVhc2UsIG9wYWNpdHkgMC4xNXMgZWFzZScsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAuLi5zeCxcbiAgICAgIH19XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKSxcbik7XG5Ecm9wZG93bi5kaXNwbGF5TmFtZSA9ICdEcm9wZG93bic7XG5cbnR5cGUgQ29udGFpbmVkRHJvcGRvd25Qcm9wcyA9IHtcbiAgYW5jaG9yRWw6IE11dGFibGVSZWZPYmplY3Q8SFRNTEVsZW1lbnQgfCBudWxsPjtcbiAgaXNPcGVuPzogYm9vbGVhbjtcbiAgdG9wPzogbnVtYmVyO1xuICByaWdodD86IG51bWJlcjtcbiAgd2lkdGg/OiBzdHJpbmc7XG4gIGhlaWdodD86IHN0cmluZztcbiAgbWFyZ2luPzogc3RyaW5nO1xuICBib3JkZXJSYWRpdXM/OiBzdHJpbmc7XG4gIHNldElzT3BlbjogKGlzT3BlbjogYm9vbGVhbikgPT4gdm9pZDtcbiAgY29udGFpbmVyUmVmPzogTXV0YWJsZVJlZk9iamVjdDxIVE1MRWxlbWVudCB8IG51bGw+O1xufTtcblxuLyoqXG4gKiBXcmFwcGVyIGZvciBkcm9wZG93biBjb250ZW50IG9uIHRoZSBicm93c2VyLWV4dGVuc2lvbiB3YWxsZXQuXG4gKiBQcm92aWRlcyBhIGZ1bGwtd2lkdGggY29udGFpbmVyIHNwYW5uaW5nIHRoZSBzcGFjZSBiZW5lYXRoIHRoZSBhbmNob3JFbCwgd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAqL1xuZXhwb3J0IGNvbnN0IENvbnRhaW5lZERyb3Bkb3duID0gKHtcbiAgYW5jaG9yRWwsIC8vIFJlZiBvZiB0aGUgZWxlbWVudCBhYm92ZSB3aGVyZSB0aGUgZHJvcGRvd24gc2hvdWxkIGFwcGVhclxuICBjaGlsZHJlbixcbiAgaXNPcGVuID0gZmFsc2UsXG4gIHdpZHRoLFxuICBoZWlnaHQsXG4gIG1hcmdpbixcbiAgYm9yZGVyUmFkaXVzLFxuICBzZXRJc09wZW4sXG4gIGNvbnRhaW5lclJlZixcbn06IFByb3BzV2l0aENoaWxkcmVuPENvbnRhaW5lZERyb3Bkb3duUHJvcHM+KSA9PiB7XG4gIGNvbnN0IGNhbGN1bGF0ZWRIZWlnaHQgPSBnZXREcm9wZG93bkhlaWdodChhbmNob3JFbCwgY29udGFpbmVyUmVmKTtcbiAgY29uc3QgdG9wID0gZ2V0T2Zmc2V0VG9wKGFuY2hvckVsKTtcbiAgY29uc3QgY29udGFpbmVyID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgY29uc3QgeyBzcGFjaW5nIH0gPSB1c2VUaGVtZSgpO1xuXG4gIC8vIFdlIG5lZWQgdG8gZGV0ZWN0IHRoZSB3aGVyZSB0aGUgdXNlciBjbGlja2VkLiBJZiBvdXRzaWRlIG9mIHRoZSBhbmNob3IgKHRoYXQgaXMgdGhlIGJ1dHRvbiB3aGljaCBvcGVucyB0aGUgZHJvcGRvd24pIGFuZCB0aGUgbGlzdCwgaXQgc2hvdWxkIGNsb3NlIHRoZSBkcm9wZG93blxuICAvLyBpZiB0aGUgdXNlciBjbGljayB0aGUgYW5jaG9yICh0aGUgYnV0dG9uKSBpdCB3aWxsIGhhbmRsZSB0aGF0IG9uIGl0cyBvd25cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVDbGlja091dHNpZGUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgY29uc3QgYW5jaG9yRWxlbWVudENsaWNrZWQgPSBhbmNob3JFbC5jdXJyZW50Py5jb250YWlucyhlLnRhcmdldCBhcyBOb2RlKTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lckNsaWNrZWQgPSBjb250YWluZXIuY3VycmVudD8uY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSk7XG4gICAgICBpZiAoIWFuY2hvckVsZW1lbnRDbGlja2VkICYmICFjb250YWluZXJDbGlja2VkKSB7XG4gICAgICAgIHNldElzT3BlbihmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVDbGlja091dHNpZGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZUNsaWNrT3V0c2lkZSk7XG4gICAgfTtcbiAgfSwgW2FuY2hvckVsLCBzZXRJc09wZW5dKTtcblxuICByZXR1cm4gKFxuICAgIDxEcm9wZG93blxuICAgICAgc3g9e3tcbiAgICAgICAgd2lkdGg6IHdpZHRoID8/ICcxMDAlJyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiBib3JkZXJSYWRpdXMgPz8gc3BhY2luZygwLCAwLCAxLCAxKSxcbiAgICAgICAgbWFyZ2luOiBtYXJnaW4gPz8gJzAnLFxuICAgICAgICBoZWlnaHQ6IGlzT3BlbiA/IGAke2hlaWdodCB8fCBjYWxjdWxhdGVkSGVpZ2h0IC0gdG9wfXB4YCA6IDAsXG4gICAgICAgIHRvcCxcbiAgICAgICAgb3BhY2l0eTogaXNPcGVuID8gMSA6IDAsXG4gICAgICB9fVxuICAgICAgcmVmPXtjb250YWluZXJ9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvRHJvcGRvd24+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBQYWdlVGl0bGUsIFBhZ2VUaXRsZVZhcmlhbnQgfSBmcm9tICcuL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB0IGFzIHRyYW5zbGF0ZSB9IGZyb20gJ2kxOG5leHQnO1xuaW1wb3J0IHtcbiAgQWxlcnRDaXJjbGVJY29uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBGdW5jdGlvbk5hbWVzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VJc0Z1bmN0aW9uQXZhaWxhYmxlJztcblxuaW50ZXJmYWNlIEZ1bmN0aW9uSXNPZmZsaW5lUHJvcHMge1xuICBmdW5jdGlvbk5hbWU6IEZ1bmN0aW9uTmFtZXM7XG4gIGhpZGVQYWdlVGl0bGU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNsYXRlZEZ1bmN0aW9uTmFtZShuYW1lOiBGdW5jdGlvbk5hbWVzKSB7XG4gIGNvbnN0IHRyYW5zbGF0aW9ucyA9IHtcbiAgICBbRnVuY3Rpb25OYW1lcy5CUklER0VdOiB0cmFuc2xhdGUoJ0JyaWRnZScpLFxuICAgIFtGdW5jdGlvbk5hbWVzLlNXQVBdOiB0cmFuc2xhdGUoJ1N3YXAnKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5TRU5EXTogdHJhbnNsYXRlKCdTZW5kJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuQlVZXTogdHJhbnNsYXRlKCdCdXknKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5ERUZJXTogdHJhbnNsYXRlKCdEZUZpJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuS0VZU1RPTkVdOiB0cmFuc2xhdGUoJ0tleXN0b25lJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuVE9LRU5fREVUQUlMU106IHRyYW5zbGF0ZSgnVG9rZW4gRGV0YWlscycpLFxuICB9O1xuXG4gIHJldHVybiB0cmFuc2xhdGlvbnNbbmFtZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBGdW5jdGlvbklzT2ZmbGluZSh7XG4gIGZ1bmN0aW9uTmFtZSxcbiAgaGlkZVBhZ2VUaXRsZSxcbiAgY2hpbGRyZW4sXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxGdW5jdGlvbklzT2ZmbGluZVByb3BzPikge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgaGVpZ2h0OiAnMTAwJScsIHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICB7IWhpZGVQYWdlVGl0bGUgJiYgKFxuICAgICAgICA8UGFnZVRpdGxlIHZhcmlhbnQ9e1BhZ2VUaXRsZVZhcmlhbnQuUFJJTUFSWX0+e3QoJ1NvcnJ5Jyl9PC9QYWdlVGl0bGU+XG4gICAgICApfVxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7IGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGZsZXhHcm93OiAxIH19XG4gICAgICA+XG4gICAgICAgIDxBbGVydENpcmNsZUljb24gc2l6ZT17NzJ9IHN4PXt7IG1iOiAzLCBtdDogLTkgfX0gLz5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgc3g9e3sgbWI6IDEgfX0+XG4gICAgICAgICAge3QoJ0ZlYXR1cmUgRGlzYWJsZWQnKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHNpemU9ezE2fVxuICAgICAgICAgIGFsaWduPVwiY2VudGVyXCJcbiAgICAgICAgICBoZWlnaHQ9XCIyNHB4XCJcbiAgICAgICAgICBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ3t7ZnVuY3Rpb25OYW1lfX0gaXMgY3VycmVudGx5IHVuYXZhaWxhYmxlLicsIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTpcbiAgICAgICAgICAgICAgZ2V0VHJhbnNsYXRlZEZ1bmN0aW9uTmFtZShmdW5jdGlvbk5hbWUpID8/IHQoJ1RoaXMgRmVhdHVyZScpLFxuICAgICAgICAgIH0pfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgIHt0KCdQbGVhc2UgY2hlY2sgYmFjayBsYXRlciBhbmQgdHJ5IGFnYWluLicpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VCYWxhbmNlc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JhbGFuY2VzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgZ2V0QWRkcmVzc0ZvckNoYWluIH0gZnJvbSAnQHNyYy91dGlscy9nZXRBZGRyZXNzRm9yQ2hhaW4nO1xuaW1wb3J0IHsgTmZ0VG9rZW5XaXRoQmFsYW5jZSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbmV4cG9ydCBjb25zdCB1c2VOZnRzID0gKCkgPT4ge1xuICBjb25zdCB7IGJhbGFuY2VzIH0gPSB1c2VCYWxhbmNlc0NvbnRleHQoKTtcbiAgY29uc3Qge1xuICAgIGFjY291bnRzOiB7IGFjdGl2ZTogYWN0aXZlQWNjb3VudCB9LFxuICB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcblxuICByZXR1cm4gdXNlTWVtbzxOZnRUb2tlbldpdGhCYWxhbmNlW10+KCgpID0+IHtcbiAgICBpZiAoIW5ldHdvcmsgfHwgIWJhbGFuY2VzLm5mdHMgfHwgIWFjdGl2ZUFjY291bnQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgdXNlckFkZHJlc3MgPSBnZXRBZGRyZXNzRm9yQ2hhaW4obmV0d29yaywgYWN0aXZlQWNjb3VudCk7XG5cbiAgICBpZiAoIXVzZXJBZGRyZXNzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYmFsYW5jZXMubmZ0cz8uW25ldHdvcmsuY2hhaW5JZF0/Llt1c2VyQWRkcmVzc10gPz8ge30pO1xuICB9LCBbbmV0d29yaywgYmFsYW5jZXMubmZ0cywgYWN0aXZlQWNjb3VudF0pO1xufTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IHsgTmV0d29ya1ZNVHlwZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtY2hhaW5zLXNkayc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgU3RhY2ssIHRvYXN0IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IEpzb25ScGNCYXRjaEludGVybmFsIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5cbmltcG9ydCB7IFBhZ2VUaXRsZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vUGFnZVRpdGxlJztcbmltcG9ydCB7IHVzZVRva2Vuc1dpdGhCYWxhbmNlcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlVG9rZW5zV2l0aEJhbGFuY2VzJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IEZ1bmN0aW9uSXNPZmZsaW5lIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9GdW5jdGlvbklzT2ZmbGluZSc7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIEZ1bmN0aW9uTmFtZXMsXG4gIHVzZUlzRnVuY3Rpb25BdmFpbGFibGUsXG59IGZyb20gJ0BzcmMvaG9va3MvdXNlSXNGdW5jdGlvbkF2YWlsYWJsZSc7XG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvbW9kZWxzJztcbmltcG9ydCB7IEZ1bmN0aW9uSXNVbmF2YWlsYWJsZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRnVuY3Rpb25Jc1VuYXZhaWxhYmxlJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyBnZXRQcm92aWRlckZvck5ldHdvcmsgfSBmcm9tICdAc3JjL3V0aWxzL25ldHdvcmsvZ2V0UHJvdmlkZXJGb3JOZXR3b3JrJztcbmltcG9ydCB7IHRvYXN0Q2FyZFdpdGhMaW5rIH0gZnJvbSAnQHNyYy91dGlscy90b2FzdENhcmRXaXRoTGluayc7XG5pbXBvcnQgeyBnZXRFeHBsb3JlckFkZHJlc3NCeU5ldHdvcmsgfSBmcm9tICdAc3JjL3V0aWxzL2dldEV4cGxvcmVyQWRkcmVzcyc7XG5pbXBvcnQgeyB1c2VOZXR3b3JrRmVlQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya0ZlZVByb3ZpZGVyJztcblxuaW1wb3J0IHsgTG9hZGluZ1NlbmRGb3JtIH0gZnJvbSAnLi4vU2VuZC9jb21wb25lbnRzL0xvYWRpbmdTZW5kRm9ybSc7XG5pbXBvcnQgeyB1c2VDb2xsZWN0aWJsZUZyb21QYXJhbXMgfSBmcm9tICcuL2hvb2tzL3VzZUNvbGxlY3RpYmxlRnJvbVBhcmFtcyc7XG5pbXBvcnQgeyBTZW5kRVZNQ29sbGVjdGlibGUgfSBmcm9tICcuL1NlbmRFVk1Db2xsZWN0aWJsZSc7XG5pbXBvcnQge1xuICBOZXR3b3JrVG9rZW5XaXRoQmFsYW5jZSxcbiAgTmZ0VG9rZW5XaXRoQmFsYW5jZSxcbiAgVG9rZW5UeXBlLFxufSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gQ29sbGVjdGlibGVTZW5kKCkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgeyBuZXR3b3JrRmVlIH0gPSB1c2VOZXR3b3JrRmVlQ29udGV4dCgpO1xuICBjb25zdCB7XG4gICAgYWNjb3VudHM6IHsgYWN0aXZlIH0sXG4gIH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcbiAgY29uc3QgeyBjYXB0dXJlRW5jcnlwdGVkIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IHRva2VucyA9IHVzZVRva2Vuc1dpdGhCYWxhbmNlcygpO1xuICBjb25zdCB7IG5mdCB9ID0gdXNlQ29sbGVjdGlibGVGcm9tUGFyYW1zKCk7XG5cbiAgY29uc3QgeyBpc0Z1bmN0aW9uQXZhaWxhYmxlLCBpc0Z1bmN0aW9uU3VwcG9ydGVkIH0gPSB1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlKFxuICAgIEZ1bmN0aW9uTmFtZXMuQ09MTEVDVElCTEVTLFxuICApO1xuXG4gIGNvbnN0IG5hdGl2ZVRva2VuID0gdG9rZW5zLmZpbmQoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBUb2tlblR5cGUuTkFUSVZFKTtcblxuICBjb25zdCBbcHJvdmlkZXIsIHNldFByb3ZpZGVyXSA9IHVzZVN0YXRlPEpzb25ScGNCYXRjaEludGVybmFsPigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFuZXR3b3JrKSB7XG4gICAgICBzZXRQcm92aWRlcih1bmRlZmluZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcblxuICAgICAgZ2V0UHJvdmlkZXJGb3JOZXR3b3JrKG5ldHdvcmspLnRoZW4oKHApID0+IHtcbiAgICAgICAgaWYgKGlzTW91bnRlZCAmJiBwIGluc3RhbmNlb2YgSnNvblJwY0JhdGNoSW50ZXJuYWwpIHtcbiAgICAgICAgICBzZXRQcm92aWRlcihwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlzTW91bnRlZCA9IGZhbHNlO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIFtuZXR3b3JrXSk7XG5cbiAgY29uc3QgZnJvbUFkZHJlc3MgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAobmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkVWTSkge1xuICAgICAgcmV0dXJuIGFjdGl2ZT8uYWRkcmVzc0MgPz8gJyc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfSwgW2FjdGl2ZT8uYWRkcmVzc0MsIG5ldHdvcms/LnZtTmFtZV0pO1xuXG4gIGNvbnN0IG9uU3VjY2VzcyA9IHVzZUNhbGxiYWNrKFxuICAgICh0eEhhc2g6IHN0cmluZykgPT4ge1xuICAgICAgY2FwdHVyZUVuY3J5cHRlZCgnTmZ0U2VuZFN1Y2NlZWRlZCcsIHtcbiAgICAgICAgYWRkcmVzczogZnJvbUFkZHJlc3MsXG4gICAgICAgIHR4SGFzaCxcbiAgICAgICAgY2hhaW5JZDogbmV0d29yaz8uY2hhaW5JZCxcbiAgICAgICAgdHlwZTogbmZ0Py50eXBlLFxuICAgICAgfSk7XG5cbiAgICAgIHRvYXN0Q2FyZFdpdGhMaW5rKHtcbiAgICAgICAgdGl0bGU6IHQoJ1NlbmQgU3VjY2Vzc2Z1bCcpLFxuICAgICAgICB1cmw6IGdldEV4cGxvcmVyQWRkcmVzc0J5TmV0d29yayhuZXR3b3JrIGFzIE5ldHdvcmssIHR4SGFzaCksXG4gICAgICAgIGxhYmVsOiB0KCdWaWV3IGluIEV4cGxvcmVyJyksXG4gICAgICB9KTtcblxuICAgICAgaGlzdG9yeS5wdXNoKCcvaG9tZScpO1xuICAgIH0sXG4gICAgW2Zyb21BZGRyZXNzLCBuZXR3b3JrLCBjYXB0dXJlRW5jcnlwdGVkLCBoaXN0b3J5LCB0LCBuZnQ/LnR5cGVdLFxuICApO1xuXG4gIGNvbnN0IG9uRmFpbHVyZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICB0b2FzdC5lcnJvcih0KCdUcmFuc2FjdGlvbiBGYWlsZWQnKSk7XG5cbiAgICBjYXB0dXJlRW5jcnlwdGVkKCdOZnRTZW5kRmFpbGVkJywge1xuICAgICAgYWRkcmVzczogZnJvbUFkZHJlc3MsXG4gICAgICBjaGFpbklkOiBuZXR3b3JrPy5jaGFpbklkLFxuICAgICAgdHlwZTogbmZ0Py50eXBlLFxuICAgIH0pO1xuICB9LCBbY2FwdHVyZUVuY3J5cHRlZCwgZnJvbUFkZHJlc3MsIG5ldHdvcms/LmNoYWluSWQsIHQsIG5mdD8udHlwZV0pO1xuXG4gIGNvbnN0IG9uQXBwcm92ZWQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY2FwdHVyZUVuY3J5cHRlZCgnTmZ0U2VuZFN0YXJ0ZWQnLCB7XG4gICAgICBhZGRyZXNzOiBmcm9tQWRkcmVzcyxcbiAgICAgIGNoYWluSWQ6IG5ldHdvcms/LmNoYWluSWQsXG4gICAgICB0eXBlOiBuZnQ/LnR5cGUsXG4gICAgfSk7XG4gIH0sIFtjYXB0dXJlRW5jcnlwdGVkLCBmcm9tQWRkcmVzcywgbmV0d29yaz8uY2hhaW5JZCwgbmZ0Py50eXBlXSk7XG5cbiAgY29uc3QgdG9rZW5MaXN0ID0gdXNlTWVtbygoKSA9PiBbbmZ0XSwgW25mdF0pO1xuXG4gIGlmICghaXNGdW5jdGlvblN1cHBvcnRlZCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnVuY3Rpb25Jc1VuYXZhaWxhYmxlXG4gICAgICAgIGZ1bmN0aW9uTmFtZT17RnVuY3Rpb25OYW1lcy5DT0xMRUNUSUJMRVN9XG4gICAgICAgIG5ldHdvcms9e25ldHdvcms/LmNoYWluTmFtZSB8fCAnVGVzdG5ldCd9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBpZiAoIWlzRnVuY3Rpb25BdmFpbGFibGUpIHtcbiAgICByZXR1cm4gPEZ1bmN0aW9uSXNPZmZsaW5lIGZ1bmN0aW9uTmFtZT17RnVuY3Rpb25OYW1lcy5DT0xMRUNUSUJMRVN9IC8+O1xuICB9XG5cbiAgY29uc3QgaXNMb2FkaW5nID1cbiAgICAhbmZ0IHx8XG4gICAgIWFjdGl2ZSB8fFxuICAgICFuZXR3b3JrIHx8XG4gICAgIWZyb21BZGRyZXNzIHx8XG4gICAgIXByb3ZpZGVyIHx8XG4gICAgIW5ldHdvcmtGZWU/Lmxvdz8ubWF4RmVlUGVyR2FzIHx8XG4gICAgIW5hdGl2ZVRva2VuIHx8XG4gICAgIXRva2VuTGlzdC5sZW5ndGg7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICA8UGFnZVRpdGxlPnt0KCdTZW5kJyl9PC9QYWdlVGl0bGU+XG4gICAgICB7aXNMb2FkaW5nICYmIDxMb2FkaW5nU2VuZEZvcm0gLz59XG4gICAgICB7IWlzTG9hZGluZyAmJiBuZXR3b3JrLnZtTmFtZSA9PT0gTmV0d29ya1ZNVHlwZS5FVk0gJiYgKFxuICAgICAgICA8U2VuZEVWTUNvbGxlY3RpYmxlXG4gICAgICAgICAgZnJvbUFkZHJlc3M9e2Zyb21BZGRyZXNzfVxuICAgICAgICAgIG5ldHdvcms9e25ldHdvcmt9XG4gICAgICAgICAgbWF4RmVlPXtuZXR3b3JrRmVlLmxvdy5tYXhGZWVQZXJHYXN9XG4gICAgICAgICAgbmF0aXZlVG9rZW49e25hdGl2ZVRva2VuIGFzIE5ldHdvcmtUb2tlbldpdGhCYWxhbmNlfVxuICAgICAgICAgIHByb3ZpZGVyPXtwcm92aWRlciBhcyBKc29uUnBjQmF0Y2hJbnRlcm5hbH1cbiAgICAgICAgICB0b2tlbkxpc3Q9e3Rva2VuTGlzdCBhcyBbTmZ0VG9rZW5XaXRoQmFsYW5jZV19XG4gICAgICAgICAgb25BcHByb3ZlZD17b25BcHByb3ZlZH1cbiAgICAgICAgICBvbkZhaWx1cmU9e29uRmFpbHVyZX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e29uU3VjY2Vzc31cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7IWlzTG9hZGluZyAmJiBuZXR3b3JrLnZtTmFtZSAhPT0gTmV0d29ya1ZNVHlwZS5FVk0gJiYgKFxuICAgICAgICA8RnVuY3Rpb25Jc1VuYXZhaWxhYmxlXG4gICAgICAgICAgZnVuY3Rpb25OYW1lPXtGdW5jdGlvbk5hbWVzLkNPTExFQ1RJQkxFU31cbiAgICAgICAgICBuZXR3b3JrPXtuZXR3b3JrPy5jaGFpbk5hbWUgfHwgJ1Rlc3RuZXQnfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IEpzb25ScGNCYXRjaEludGVybmFsIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDYXJkLFxuICBTY3JvbGxiYXJzLFxuICBTdGFjayxcbiAgVG9vbHRpcCxcbiAgVHlwb2dyYXBoeSxcbiAgc3R5bGVkLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyB1c2VRdWVyeVBhcmFtcyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlUXVlcnlQYXJhbXMnO1xuaW1wb3J0IHsgaXNWYWxpZEFkZHJlc3MgfSBmcm9tICdAc3JjL3V0aWxzL2lzQWRkcmVzc1ZhbGlkJztcbmltcG9ydCB7IGhhbmRsZVR4T3V0Y29tZSB9IGZyb20gJ0BzcmMvdXRpbHMvaGFuZGxlVHhPdXRjb21lJztcbmltcG9ydCB7IFNlbmRFcnJvck1lc3NhZ2UgfSBmcm9tICdAc3JjL3V0aWxzL3NlbmQvbW9kZWxzJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcblxuaW1wb3J0IHsgdXNlRVZNU2VuZCB9IGZyb20gJy4uL1NlbmQvaG9va3MvdXNlU2VuZC91c2VFVk1TZW5kJztcbmltcG9ydCB7IENvbnRhY3RJbnB1dCB9IGZyb20gJy4uL1NlbmQvY29tcG9uZW50cy9Db250YWN0SW5wdXQnO1xuaW1wb3J0IHsgdXNlSWRlbnRpZnlBZGRyZXNzIH0gZnJvbSAnLi4vU2VuZC9ob29rcy91c2VJZGVudGlmeUFkZHJlc3MnO1xuaW1wb3J0IHsgZ2V0U2VuZEVycm9yTWVzc2FnZSB9IGZyb20gJy4uL1NlbmQvdXRpbHMvc2VuZEVycm9yTWVzc2FnZXMnO1xuaW1wb3J0IHsgdXNlVmFsaWRBZGRyZXNzRnJvbVBhcmFtcyB9IGZyb20gJy4uL1NlbmQvaG9va3MvdXNlVmFsaWRBZGRyZXNzRnJvbVBhcmFtcyc7XG5pbXBvcnQgeyBTZW5kT3B0aW9ucywgU2VuZFBhZ2VQcm9wcyB9IGZyb20gJy4uL1NlbmQvbW9kZWxzJztcblxuaW1wb3J0IHsgQ29sbGVjdGlibGVNZWRpYSB9IGZyb20gJy4vY29tcG9uZW50cy9Db2xsZWN0aWJsZU1lZGlhJztcbmltcG9ydCB7IHVzZVNldENvbGxlY3RpYmxlUGFyYW1zIH0gZnJvbSAnLi9ob29rcy91c2VTZXRDb2xsZWN0aWJsZVBhcmFtcyc7XG5pbXBvcnQge1xuICBOZXR3b3JrVG9rZW5XaXRoQmFsYW5jZSxcbiAgTmZ0VG9rZW5XaXRoQmFsYW5jZSxcbn0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IHVzZU5ldHdvcmtGZWVDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrRmVlUHJvdmlkZXInO1xuaW1wb3J0IHsgR2FzbGVzc1BoYXNlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2dhc2xlc3MvbW9kZWwnO1xuXG50eXBlIFByb3BzID0gU2VuZFBhZ2VQcm9wczxcbiAgSnNvblJwY0JhdGNoSW50ZXJuYWwsXG4gIE5ldHdvcmtUb2tlbldpdGhCYWxhbmNlLFxuICBbTmZ0VG9rZW5XaXRoQmFsYW5jZV1cbj47XG5cbmNvbnN0IEZsZXhTY3JvbGxiYXJzID0gc3R5bGVkKFNjcm9sbGJhcnMpYFxuXHQ+IGRpdiB7XG5cdFx0ZGlzcGxheTogZmxleDtcblx0fVxufWA7XG5cbmV4cG9ydCBjb25zdCBTZW5kRVZNQ29sbGVjdGlibGUgPSAoe1xuICBuZXR3b3JrLFxuICBmcm9tQWRkcmVzcyxcbiAgbWF4RmVlLFxuICBuYXRpdmVUb2tlbixcbiAgcHJvdmlkZXIsXG4gIHRva2VuTGlzdCxcbiAgb25TdWNjZXNzLFxuICBvbkZhaWx1cmUsXG4gIG9uQXBwcm92ZWQsXG59OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHBhcmFtcyA9IHVzZVF1ZXJ5UGFyYW1zKCk7XG4gIGNvbnN0IGlkZW50aWZ5QWRkcmVzcyA9IHVzZUlkZW50aWZ5QWRkcmVzcygpO1xuICBjb25zdCBhZGRyZXNzRnJvbVBhcmFtcyA9IHVzZVZhbGlkQWRkcmVzc0Zyb21QYXJhbXMoaXNWYWxpZEFkZHJlc3MpO1xuICBjb25zdCBbYWRkcmVzcywgc2V0QWRkcmVzc10gPSB1c2VTdGF0ZShhZGRyZXNzRnJvbVBhcmFtcyk7XG4gIGNvbnN0IGNvbnRhY3QgPSB1c2VNZW1vKFxuICAgICgpID0+IChhZGRyZXNzID8gaWRlbnRpZnlBZGRyZXNzKGFkZHJlc3MpIDogdW5kZWZpbmVkKSxcbiAgICBbYWRkcmVzcywgaWRlbnRpZnlBZGRyZXNzXSxcbiAgKTtcbiAgY29uc3QgW2lzQ29udGFjdHNPcGVuLCBzZXRJc0NvbnRhY3RzT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IHNldENvbGxlY3RpYmxlUGFyYW1zID0gdXNlU2V0Q29sbGVjdGlibGVQYXJhbXMoKTtcbiAgY29uc3QgW3Rva2VuXSA9IHRva2VuTGlzdDtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IHsgZ2FzbGVzc1BoYXNlIH0gPSB1c2VOZXR3b3JrRmVlQ29udGV4dCgpO1xuXG4gIGNvbnN0IHsgZXJyb3IsIGlzU2VuZGluZywgaXNWYWxpZCwgaXNWYWxpZGF0aW5nLCBzZW5kLCB2YWxpZGF0ZSB9ID1cbiAgICB1c2VFVk1TZW5kKHtcbiAgICAgIGNoYWluSWQ6IGAweCR7bmV0d29yay5jaGFpbklkLnRvU3RyaW5nKDE2KX1gLFxuICAgICAgZnJvbTogZnJvbUFkZHJlc3MsXG4gICAgICBtYXhGZWUsXG4gICAgICBuYXRpdmVUb2tlbixcbiAgICAgIHByb3ZpZGVyLFxuICAgIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgdmFsaWRhdGUoeyBhZGRyZXNzLCB0b2tlbiB9KTtcblxuICAgIGlmIChcbiAgICAgIGFkZHJlc3MgIT09IHBhcmFtcy5nZXQoJ2FkZHJlc3MnKSB8fFxuICAgICAgdG9rZW4uYWRkcmVzcyAhPT0gcGFyYW1zLmdldCgnbmZ0JykgfHxcbiAgICAgIHRva2VuLnRva2VuSWQgIT09IHBhcmFtcy5nZXQoJ3Rva2VuSWQnKVxuICAgICkge1xuICAgICAgc2V0Q29sbGVjdGlibGVQYXJhbXMoe1xuICAgICAgICBhZGRyZXNzLFxuICAgICAgICBuZnQ6IHRva2VuLFxuICAgICAgICBvcHRpb25zOiB7IHJlcGxhY2U6IHRydWUgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgW2FkZHJlc3MsIHRva2VuLCB2YWxpZGF0ZSwgc2V0Q29sbGVjdGlibGVQYXJhbXMsIHBhcmFtc10pO1xuXG4gIGNvbnN0IGlzU2VuZEF2YWlsYWJsZVdpdGhHYXNsZXNzID1cbiAgICBnYXNsZXNzUGhhc2UgIT09IEdhc2xlc3NQaGFzZS5OT1RfRUxJR0lCTEUgJiZcbiAgICBlcnJvciA9PT0gU2VuZEVycm9yTWVzc2FnZS5JTlNVRkZJQ0lFTlRfQkFMQU5DRV9GT1JfRkVFO1xuXG4gIGNvbnN0IG9uU2VuZCA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWlzVmFsaWQgJiYgIWlzU2VuZEF2YWlsYWJsZVdpdGhHYXNsZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgaXNBcHByb3ZlZCxcbiAgICAgIGhhc0Vycm9yLFxuICAgICAgcmVzdWx0OiB0eEhhc2gsXG4gICAgICBlcnJvcjogdHhFcnJvcixcbiAgICB9ID0gYXdhaXQgaGFuZGxlVHhPdXRjb21lKHNlbmQoeyBhZGRyZXNzLCB0b2tlbiB9IGFzIFNlbmRPcHRpb25zKSk7XG5cbiAgICBpZiAoaXNBcHByb3ZlZCkge1xuICAgICAgb25BcHByb3ZlZCgpO1xuXG4gICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgb25GYWlsdXJlKHR4RXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25TdWNjZXNzKHR4SGFzaCk7XG4gICAgICB9XG4gICAgfVxuICB9LCBbXG4gICAgYWRkcmVzcyxcbiAgICBpc1NlbmRBdmFpbGFibGVXaXRoR2FzbGVzcyxcbiAgICBpc1ZhbGlkLFxuICAgIG9uQXBwcm92ZWQsXG4gICAgb25GYWlsdXJlLFxuICAgIG9uU3VjY2VzcyxcbiAgICBzZW5kLFxuICAgIHRva2VuLFxuICBdKTtcblxuICBjb25zdCBmb3JtUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSwgYWxpZ25JdGVtczogJ2NlbnRlcicsIHdpZHRoOiAnMTAwJScsIHB0OiAxIH19PlxuICAgICAgPEZsZXhTY3JvbGxiYXJzXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgbWF4SGVpZ2h0OiAndW5zZXQnLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN0YWNrIHJlZj17Zm9ybVJlZn0gc3g9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4R3JvdzogMSwgbWI6IDIgfX0+XG4gICAgICAgICAgPENvbnRhY3RJbnB1dFxuICAgICAgICAgICAgY29udGFjdD17Y29udGFjdH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsobmV3Q29udGFjdCkgPT4ge1xuICAgICAgICAgICAgICBzZXRBZGRyZXNzKG5ld0NvbnRhY3Q/LmFkZHJlc3MgPz8gJycpO1xuICAgICAgICAgICAgICBjYXB0dXJlKCdOZnRTZW5kQ29udGFjdFNlbGVjdGVkJywge1xuICAgICAgICAgICAgICAgIGNoYWluSWQ6IG5ldHdvcms/LmNoYWluSWQsXG4gICAgICAgICAgICAgICAgdHlwZTogdG9rZW4udHlwZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgaXNDb250YWN0c09wZW49e2lzQ29udGFjdHNPcGVufVxuICAgICAgICAgICAgc2V0SXNPcGVuPXsob3BlbikgPT4gc2V0SXNDb250YWN0c09wZW4ob3Blbil9XG4gICAgICAgICAgICBjb250YWluZXJSZWY9e2Zvcm1SZWZ9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHBsOiAyLFxuICAgICAgICAgICAgICBtdDogMC41LFxuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsoZXJyb3IgPT09IFNlbmRFcnJvck1lc3NhZ2UuQUREUkVTU19SRVFVSVJFRCB8fFxuICAgICAgICAgICAgICBlcnJvciA9PT0gU2VuZEVycm9yTWVzc2FnZS5JTlZBTElEX0FERFJFU1MpICYmIChcbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICh0aGVtZSkgPT4gdGhlbWUucGFsZXR0ZS5lcnJvci5tYWluIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Z2V0U2VuZEVycm9yTWVzc2FnZShlcnJvcil9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICAgIDxTdGFjayBzeD17eyBweTogMCwgcHg6IDIsIG10OiA0LCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgY29tcG9uZW50PVwiaDJcIlxuICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnc2VtaWJvbGQnLCBwYjogMSB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnQ29sbGVjdGlibGUnKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxDYXJkIHN4PXt7IGhlaWdodDogJ2F1dG8nLCBwOiAyLCBtdDogMSB9fT5cbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnIH19PlxuICAgICAgICAgICAgICAgIDxDb2xsZWN0aWJsZU1lZGlhXG4gICAgICAgICAgICAgICAgICB3aWR0aD1cIjgwcHhcIlxuICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiYXV0b1wiXG4gICAgICAgICAgICAgICAgICB1cmw9e3Rva2VuLmxvZ29TbWFsbCB8fCB0b2tlbi5sb2dvVXJpfVxuICAgICAgICAgICAgICAgICAgaG92ZXI9e2ZhbHNlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgY29tcG9uZW50PVwiaDJcIiB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBtbDogMiB9fT5cbiAgICAgICAgICAgICAgICAgIHt0b2tlbi5uYW1lfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9GbGV4U2Nyb2xsYmFycz5cbiAgICAgIHshaXNDb250YWN0c09wZW4gJiYgKFxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgIHB0OiAzLFxuICAgICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgICBwYjogMyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcFwiXG4gICAgICAgICAgICBzeD17eyB3aWR0aDogJzEwMCUnIH19XG4gICAgICAgICAgICB0aXRsZT17XG4gICAgICAgICAgICAgIGVycm9yICYmICFpc1NlbmRBdmFpbGFibGVXaXRoR2FzbGVzcyA/IChcbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgICAgICAgIHtnZXRTZW5kRXJyb3JNZXNzYWdlKGVycm9yKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZW5kLW5leHQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNvbnRhaW5lZFwiXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uU2VuZH1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e1xuICAgICAgICAgICAgICAgICFpc1NlbmRBdmFpbGFibGVXaXRoR2FzbGVzcyAmJlxuICAgICAgICAgICAgICAgIChpc1ZhbGlkYXRpbmcgfHwgIWlzVmFsaWQgfHwgaXNTZW5kaW5nKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlzTG9hZGluZz17aXNTZW5kaW5nfVxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ05leHQnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGlzVmlkZW8sIGlzSW1hZ2VEYXJrIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgSW1hZ2VXcmFwcGVyIH0gZnJvbSAnLi9JbWFnZVdyYXBwZXInO1xuaW1wb3J0IHsgSW1hZ2VXaXRoRmFsbGJhY2sgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0ltYWdlV2l0aEZhbGxiYWNrJztcbmltcG9ydCB7IGlwZnNSZXNvbHZlcldpdGhGYWxsYmFjayB9IGZyb20gJ0BzcmMvdXRpbHMvaXBzZlJlc29sdmVyV2l0aEZhbGxiYWNrJztcbmltcG9ydCB7XG4gIENoaXAsXG4gIFN0YWNrLFxuICBzdHlsZWQsXG4gIFRyaWFuZ2xlUmlnaHRJY29uLFxuICBBcnJvd3NNYXhpbWl6ZUljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmNvbnN0IE5mdEltYWdlID0gc3R5bGVkKEltYWdlV2l0aEZhbGxiYWNrKTx7XG4gIHdpZHRoPzogc3RyaW5nO1xuICBoZWlnaHQ/OiBzdHJpbmc7XG4gIG1heFdpZHRoPzogc3RyaW5nO1xuICBtYXhIZWlnaHQ/OiBzdHJpbmc7XG4gIGhvdmVyPzogYm9vbGVhbjtcbiAgaGFzQm9yZGVyUmFkaXVzPzogYm9vbGVhbjtcbiAgYm9yZGVyUmFkaXVzPzogc3RyaW5nO1xuICBzaG93UG9pbnRlcj86IGJvb2xlYW47XG59PmBcbiAgd2lkdGg6ICR7KHsgd2lkdGggfSkgPT4gd2lkdGggPz8gJzMycHgnfTtcbiAgaGVpZ2h0OiAkeyh7IGhlaWdodCB9KSA9PiBoZWlnaHQgPz8gJzMycHgnfTtcbiAgbWF4LXdpZHRoOiAkeyh7IG1heFdpZHRoIH0pID0+IG1heFdpZHRoID8/ICd1bnNldCd9O1xuICBtYXgtaGVpZ2h0OiAkeyh7IG1heEhlaWdodCB9KSA9PiBtYXhIZWlnaHQgPz8gJ3Vuc2V0J307XG4gIGJvcmRlcjogMXB4IHNvbGlkICR7KHsgdGhlbWUgfSkgPT4gYCR7dGhlbWUucGFsZXR0ZS5jb21tb24uYmxhY2t9MUFgfTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZmlsdGVyOiBkcm9wLXNoYWRvdyhcbiAgICAwcHggMTBweCAyNXB4ICR7KHsgdGhlbWUgfSkgPT4gYCR7dGhlbWUucGFsZXR0ZS5jb21tb24uYmxhY2t9NDBgfVxuICApO1xuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMjVweCk7XG4gIGJvcmRlci1yYWRpdXM6ICR7KHsgaGFzQm9yZGVyUmFkaXVzLCBib3JkZXJSYWRpdXMgfSkgPT5cbiAgICBoYXNCb3JkZXJSYWRpdXMgPyAoYm9yZGVyUmFkaXVzID8/ICc4cHgnKSA6ICdub25lJ307XG4gIGN1cnNvcjogJHsoeyBzaG93UG9pbnRlciB9KSA9PiAoc2hvd1BvaW50ZXIgPyAnZGVmYXVsdCcgOiAncG9pbnRlcicpfTtcbmA7XG5cbmNvbnN0IE5mdFZpZGVvID0gc3R5bGVkKCd2aWRlbycpPHtcbiAgd2lkdGg/OiBzdHJpbmc7XG4gIGhlaWdodD86IHN0cmluZztcbiAgbWF4V2lkdGg/OiBzdHJpbmc7XG4gIG1heEhlaWdodD86IHN0cmluZztcbiAgaG92ZXI/OiBib29sZWFuO1xuICBib3JkZXJSYWRpdXM/OiBzdHJpbmc7XG59PmBcbiAgd2lkdGg6ICR7KHsgd2lkdGggfSkgPT4gd2lkdGggPz8gJzMycHgnfTtcbiAgbWF4LXdpZHRoOiAkeyh7IG1heFdpZHRoIH0pID0+IG1heFdpZHRoID8/ICd1bnNldCd9O1xuICBoZWlnaHQ6ICR7KHsgaGVpZ2h0IH0pID0+IGhlaWdodCA/PyAnMzJweCd9O1xuICBtYXgtaGVpZ2h0OiAkeyh7IG1heEhlaWdodCB9KSA9PiBtYXhIZWlnaHQgPz8gJ3Vuc2V0J307XG4gIGJvcmRlcjogMXB4IHNvbGlkICR7KHsgdGhlbWUgfSkgPT4gYCR7dGhlbWUucGFsZXR0ZS5jb21tb24uYmxhY2t9MUFgfTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZmlsdGVyOiBkcm9wLXNoYWRvdyhcbiAgICAwcHggMTBweCAyNXB4ICR7KHsgdGhlbWUgfSkgPT4gYCR7dGhlbWUucGFsZXR0ZS5jb21tb24uYmxhY2t9NDBgfVxuICApO1xuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMjVweCk7XG4gIGJvcmRlci1yYWRpdXM6ICR7KHsgYm9yZGVyUmFkaXVzIH0pID0+IGJvcmRlclJhZGl1cyA/PyAnOHB4J307XG5gO1xuXG5pbnRlcmZhY2UgQ29sbGVjdGlibGVNZWRpYVByb3BzIHtcbiAgdXJsPzogc3RyaW5nO1xuICB3aWR0aD86IHN0cmluZztcbiAgaGVpZ2h0Pzogc3RyaW5nO1xuICBtYXhXaWR0aD86IHN0cmluZztcbiAgbWF4SGVpZ2h0Pzogc3RyaW5nO1xuICBob3Zlcj86IGJvb2xlYW47XG4gIG1hcmdpbj86IHN0cmluZztcbiAgc2hvd1BsYXlJY29uPzogYm9vbGVhbjtcbiAgY29udHJvbHM/OiBib29sZWFuO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIGJvcmRlclJhZGl1cz86IHN0cmluZztcbiAgc2hvd0JhbGFuY2U/OiBib29sZWFuO1xuICBiYWxhbmNlPzogYmlnaW50O1xuICBzaG93RXhwYW5kT3B0aW9uPzogYm9vbGVhbjtcbiAgbm9BY3Rpb24/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29sbGVjdGlibGVNZWRpYSh7XG4gIHVybCxcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgbWF4V2lkdGgsXG4gIG1heEhlaWdodCxcbiAgaG92ZXIgPSBmYWxzZSxcbiAgbWFyZ2luLFxuICBzaG93UGxheUljb24gPSB0cnVlLFxuICBjb250cm9scyA9IGZhbHNlLFxuICBjbGFzc05hbWUsXG4gIGJvcmRlclJhZGl1cyA9ICc4cHgnLFxuICBzaG93QmFsYW5jZSA9IGZhbHNlLFxuICBiYWxhbmNlID0gMG4sXG4gIHNob3dFeHBhbmRPcHRpb24gPSBmYWxzZSxcbiAgbm9BY3Rpb24gPSBmYWxzZSxcbn06IENvbGxlY3RpYmxlTWVkaWFQcm9wcykge1xuICBjb25zdCBbaXNJbWFnZUZ1bGxTY3JlZW4sIHNldElzSW1hZ2VGdWxsU2NyZWVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3Nob3VsZFVzZUxpZ2h0SWNvbiwgc2V0U2hvdWxkVXNlTGlnaHRJY29uXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzTWVkaWFTZXR0bGVkLCBzZXRJc01lZGlhU2V0dGxlZF0gPSB1c2VTdGF0ZShmYWxzZSk7IC8vIEVpdGhlciBsb2FkZWQgb3IgZXJyb3JlZCBvdXQuXG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIG1hcmdpbixcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICB9fVxuICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgbWF4V2lkdGg6IG1heFdpZHRoID8gbWF4V2lkdGggOiAndW5zZXQnLFxuICAgICAgICAgIHdpZHRoOiB3aWR0aCA/IHdpZHRoIDogJzMycHgnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgY29sdW1uR2FwOiAxLFxuICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICBtcjogMyxcbiAgICAgICAgICBtdDogMSxcbiAgICAgICAgICBwcjogMSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge3Nob3dCYWxhbmNlICYmIGlzTWVkaWFTZXR0bGVkICYmIChcbiAgICAgICAgICA8Q2hpcFxuICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKHRoZW1lKSA9PlxuICAgICAgICAgICAgICAgIHNob3VsZFVzZUxpZ2h0SWNvbiA/ICdwcmltYXJ5LmxpZ2h0JyA6IHRoZW1lLnBhbGV0dGUuZ3JleVs2MDBdLFxuICAgICAgICAgICAgICBjb2xvcjogc2hvdWxkVXNlTGlnaHRJY29uXG4gICAgICAgICAgICAgICAgPyAncHJpbWFyeS5jb250cmFzdFRleHQnXG4gICAgICAgICAgICAgICAgOiAncHJpbWFyeS5saWdodCcsXG4gICAgICAgICAgICAgIHB4OiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGxhYmVsPXtiYWxhbmNlLnRvU3RyaW5nKCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAge3Nob3dFeHBhbmRPcHRpb24gJiYgKFxuICAgICAgICAgIDxBcnJvd3NNYXhpbWl6ZUljb25cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0SXNJbWFnZUZ1bGxTY3JlZW4odHJ1ZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgc2l6ZT1cIjI0XCJcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGNvbG9yOiBzaG91bGRVc2VMaWdodEljb25cbiAgICAgICAgICAgICAgICA/ICdwcmltYXJ5LmxpZ2h0J1xuICAgICAgICAgICAgICAgIDogJ3ByaW1hcnkuY29udHJhc3RUZXh0JyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgICAge2lzVmlkZW8odXJsKSA/IChcbiAgICAgICAgPFN0YWNrIHN4PXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBmbGV4RGlyZWN0aW9uOiAncm93JyB9fT5cbiAgICAgICAgICA8TmZ0VmlkZW9cbiAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgbWF4V2lkdGg9e21heFdpZHRofVxuICAgICAgICAgICAgbWF4SGVpZ2h0PXttYXhIZWlnaHR9XG4gICAgICAgICAgICBob3Zlcj17aG92ZXJ9XG4gICAgICAgICAgICBjb250cm9scz17Y29udHJvbHN9XG4gICAgICAgICAgICBib3JkZXJSYWRpdXM9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7LyogaW5saW5pbmcgdGhpcyBjb21tZW50IHJlc3VsdHMgaW4gZXNsaW50IHBhcnNlIGVycm9yICovfVxuICAgICAgICAgICAgey8qIGVzbGludC1kaXNhYmxlIHJlYWN0L25vLXVua25vd24tcHJvcGVydHkgKi99XG4gICAgICAgICAgICA8c291cmNlXG4gICAgICAgICAgICAgIHNyYz17aXBmc1Jlc29sdmVyV2l0aEZhbGxiYWNrKHVybCl9XG4gICAgICAgICAgICAgIG9uTG9hZFN0YXJ0PXsoKSA9PiBzZXRJc01lZGlhU2V0dGxlZCh0cnVlKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7LyogZXNsaW50LWVuYWJsZSByZWFjdC9uby11bmtub3duLXByb3BlcnR5ICovfVxuICAgICAgICAgIDwvTmZ0VmlkZW8+XG4gICAgICAgICAge3Nob3dQbGF5SWNvbiAmJiAoXG4gICAgICAgICAgICA8VHJpYW5nbGVSaWdodEljb25cbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICBib3R0b206ICc4cHgnLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAnOHB4JyxcbiAgICAgICAgICAgICAgICBjb2xvcjogJ2NvbW1vbi53aGl0ZScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICApIDogKFxuICAgICAgICA8SW1hZ2VXcmFwcGVyXG4gICAgICAgICAgaXNPdmVybGF5PXtpc0ltYWdlRnVsbFNjcmVlbn1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXNob3dCYWxhbmNlICYmICFub0FjdGlvbikgc2V0SXNJbWFnZUZ1bGxTY3JlZW4odHJ1ZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRJc0ltYWdlRnVsbFNjcmVlbihmYWxzZSl9XG4gICAgICAgICAgYmFja2Ryb3BJbWFnZVVybD17dXJsfVxuICAgICAgICAgIHNob3VsZFVzZUxpZ2h0SWNvbj17c2hvdWxkVXNlTGlnaHRJY29ufVxuICAgICAgICA+XG4gICAgICAgICAgPE5mdEltYWdlXG4gICAgICAgICAgICB3aWR0aD17aXNJbWFnZUZ1bGxTY3JlZW4gPyAnMTAwJScgOiB3aWR0aH1cbiAgICAgICAgICAgIGhlaWdodD17aXNJbWFnZUZ1bGxTY3JlZW4gPyAnYXV0bycgOiBoZWlnaHR9XG4gICAgICAgICAgICBzcmM9e3VybH1cbiAgICAgICAgICAgIG1heFdpZHRoPXttYXhXaWR0aH1cbiAgICAgICAgICAgIG1heEhlaWdodD17bWF4SGVpZ2h0fVxuICAgICAgICAgICAgaG92ZXI9e2hvdmVyfVxuICAgICAgICAgICAgaGFzQm9yZGVyUmFkaXVzPXshaXNJbWFnZUZ1bGxTY3JlZW59XG4gICAgICAgICAgICBib3JkZXJSYWRpdXM9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIHNob3dQb2ludGVyPXtzaG93RXhwYW5kT3B0aW9ufVxuICAgICAgICAgICAgb25Mb2FkPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgaW1hZ2VFbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgICBpZiAoaW1hZ2VFbGVtZW50IGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlzSW1hZ2VEYXJrKGltYWdlRWxlbWVudCwgKGlzRGFyaykgPT4ge1xuICAgICAgICAgICAgICAgICAgc2V0U2hvdWxkVXNlTGlnaHRJY29uKGlzRGFyayk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2V0SXNNZWRpYVNldHRsZWQodHJ1ZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25FcnJvcj17KCkgPT4gc2V0SXNNZWRpYVNldHRsZWQodHJ1ZSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9JbWFnZVdyYXBwZXI+XG4gICAgICApfVxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBCb3gsXG4gIENoZXZyb25MZWZ0SWNvbixcbiAgSWNvbkJ1dHRvbixcbiAgU3RhY2ssXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPdmVybGF5IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9PdmVybGF5JztcbmltcG9ydCB7IFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuaW50ZXJmYWNlIEltYWdlV3JhcHBlclByb3BzIHtcbiAgaXNPdmVybGF5OiBib29sZWFuO1xuICBvbkNsaWNrOiAoKSA9PiB2b2lkO1xuICBvbkNsb3NlOiAoKSA9PiB2b2lkO1xuICBiYWNrZHJvcEltYWdlVXJsPzogc3RyaW5nO1xuICBzaG91bGRVc2VMaWdodEljb246IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJbWFnZVdyYXBwZXIoe1xuICBpc092ZXJsYXksXG4gIG9uQ2xpY2ssXG4gIG9uQ2xvc2UsXG4gIGJhY2tkcm9wSW1hZ2VVcmwsXG4gIHNob3VsZFVzZUxpZ2h0SWNvbixcbiAgY2hpbGRyZW4sXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxJbWFnZVdyYXBwZXJQcm9wcz4pIHtcbiAgaWYgKGlzT3ZlcmxheSkge1xuICAgIHJldHVybiAoXG4gICAgICA8T3ZlcmxheT5cbiAgICAgICAgPEJveFxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGB1cmwoJHtiYWNrZHJvcEltYWdlVXJsfSlgLFxuICAgICAgICAgICAgYmFja2dyb3VuZFNpemU6ICdjb3ZlcicsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kUmVwZWF0OiAnbm8tcmVwZWF0JyxcbiAgICAgICAgICAgIGZpbHRlcjogJ2JsdXIoMTZweCknLFxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgcHg6IDEsXG4gICAgICAgICAgICAgIHB5OiA0LFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwicGFnZS10aXRsZS1iYWNrLWJ1dHRvblwiXG4gICAgICAgICAgICAgIGRpc2FibGVSaXBwbGVcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBwOiAwLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8Q2hldnJvbkxlZnRJY29uXG4gICAgICAgICAgICAgICAgc2l6ZT17MzJ9XG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBzaG91bGRVc2VMaWdodEljb25cbiAgICAgICAgICAgICAgICAgICAgPyAncHJpbWFyeS5saWdodCdcbiAgICAgICAgICAgICAgICAgICAgOiAncHJpbWFyeS5jb250cmFzdFRleHQnLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L092ZXJsYXk+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxTdGFjayBvbkNsaWNrPXtvbkNsaWNrfSBzeD17eyB3aWR0aDogJzEwMCUnLCBmbGV4RGlyZWN0aW9uOiAncm93JyB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlTmZ0cyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlTmZ0cyc7XG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTG9jYXRpb24gfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB4c3MgZnJvbSAneHNzJztcblxuZXhwb3J0IGNvbnN0IHVzZUNvbGxlY3RpYmxlRnJvbVBhcmFtcyA9ICgpID0+IHtcbiAgY29uc3QgeyBzZWFyY2ggfSA9IHVzZUxvY2F0aW9uKCk7XG4gIGNvbnN0IG5mdHMgPSB1c2VOZnRzKCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHsgbmZ0LCB0b2tlbklkIH0gPSAoT2JqZWN0IGFzIGFueSkuZnJvbUVudHJpZXMoXG4gICAgICAobmV3IFVSTFNlYXJjaFBhcmFtcyhzZWFyY2gpIGFzIGFueSkuZW50cmllcygpLFxuICAgICk7XG5cbiAgICBpZiAoIW5mdCB8fCAhdG9rZW5JZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmZ0OiB1bmRlZmluZWQsXG4gICAgICAgIHRva2VuSWQ6IHhzcyh0b2tlbklkKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgZmlsdGVyZWRBZGRyZXNzID0geHNzKG5mdCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmZ0OiBuZnRzPy5maW5kKFxuICAgICAgICAoaXRlbSkgPT4gaXRlbS5hZGRyZXNzID09PSBmaWx0ZXJlZEFkZHJlc3MgJiYgaXRlbS50b2tlbklkID09PSB0b2tlbklkLFxuICAgICAgKSxcbiAgICAgIHRva2VuSWQ6IHhzcyh0b2tlbklkKSxcbiAgICB9O1xuICB9LCBbbmZ0cywgc2VhcmNoXSk7XG59O1xuIiwiaW1wb3J0IHsgTmZ0VG9rZW5XaXRoQmFsYW5jZSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5LCB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG50eXBlIFNldENvbGxlY3RpYmxlUGFyYW1zID0ge1xuICBuZnQ/OiBOZnRUb2tlbldpdGhCYWxhbmNlO1xuICBhZGRyZXNzPzogc3RyaW5nO1xuICBvcHRpb25zPzoge1xuICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgcmVwbGFjZT86IGJvb2xlYW47XG4gIH07XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlU2V0Q29sbGVjdGlibGVQYXJhbXMoKSB7XG4gIGNvbnN0IHsgcGF0aG5hbWUgfSA9IHVzZUxvY2F0aW9uKCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG5cbiAgcmV0dXJuICh7IG5mdCwgYWRkcmVzcywgb3B0aW9ucyB9OiBTZXRDb2xsZWN0aWJsZVBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHB1c2hPclJlcGxhY2UgPSBvcHRpb25zPy5yZXBsYWNlID8gaGlzdG9yeS5yZXBsYWNlIDogaGlzdG9yeS5wdXNoO1xuICAgIHB1c2hPclJlcGxhY2Uoe1xuICAgICAgcGF0aG5hbWU6IG9wdGlvbnM/LnBhdGggPz8gcGF0aG5hbWUsXG4gICAgICBzZWFyY2g6IGA/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHtcbiAgICAgICAgbmZ0OiBuZnQ/LmFkZHJlc3MgPz8gJycsXG4gICAgICAgIHRva2VuSWQ6IG5mdD8udG9rZW5JZCA/PyAnJyxcbiAgICAgICAgYWRkcmVzczogYWRkcmVzcyA/PyAnJyxcbiAgICAgIH0pLnRvU3RyaW5nKCl9YCxcbiAgICB9KTtcbiAgfTtcbn1cbiIsImV4cG9ydCBjb25zdCBpc1ZpZGVvID0gKHVybD86IHN0cmluZykgPT5cbiAgdXJsICYmIFsnLm1wNCcsICcud2VibScsICcub2dnJ10uaW5jbHVkZXModXJsLnNsaWNlKHVybC5sYXN0SW5kZXhPZignLicpKSk7XG5cbmV4cG9ydCBjb25zdCBpc0ltYWdlRGFyayA9IChcbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LFxuICBjYWxsYmFjazogKGI6IGJvb2xlYW4pID0+IHZvaWQsXG4pID0+IHtcbiAgbGV0IGNvbG9yU3VtID0gMDtcblxuICBpZiAoIWltZykge1xuICAgIC8vIERlZmF1bHQgdmFsdWUgaXMgdHJ1ZSAoRGFyayBpbWFnZSBNb2RlKVxuICAgIHJldHVybiBjYWxsYmFjayh0cnVlKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICBpZiAoIWN0eCkge1xuICAgICAgLy8gRGVmYXVsdCB2YWx1ZSBpcyB0cnVlIChEYXJrIGltYWdlIE1vZGUpXG4gICAgICByZXR1cm4gY2FsbGJhY2sodHJ1ZSk7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xuXG4gICAgLy8gd2UgbmVlZCB0byBrbm93IHRoZSB0b3AgcmlnaHQgcXVhdGVyJ3MgYXZlcmFnZSBjb2xvclxuICAgIGNvbnN0IGhlaWdodCA9IE1hdGguZmxvb3IoY2FudmFzLmhlaWdodCAvIDIpO1xuICAgIGNvbnN0IHdpZHRoID0gTWF0aC5mbG9vcihjYW52YXMud2lkdGggLyAyKTtcbiAgICBjb25zdCBpbWFnZURhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKHdpZHRoLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjb25zdCBkYXRhID0gaW1hZ2VEYXRhLmRhdGE7XG5cbiAgICBmb3IgKGxldCB4ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IHggPCBsZW47IHggKz0gNCkge1xuICAgICAgY29uc3QgciA9IGRhdGFbeF07XG4gICAgICBjb25zdCBnID0gZGF0YVt4ICsgMV07XG4gICAgICBjb25zdCBiID0gZGF0YVt4ICsgMl07XG5cbiAgICAgIGlmIChyID09PSB1bmRlZmluZWQgfHwgZyA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBjb2xvcicpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhdmcgPSBNYXRoLmZsb29yKChyICsgZyArIGIpIC8gMyk7XG4gICAgICBjb2xvclN1bSArPSBhdmc7XG4gICAgfVxuXG4gICAgY29uc3QgYnJpZ2h0bmVzcyA9IE1hdGguZmxvb3IoY29sb3JTdW0gLyAod2lkdGggKiBoZWlnaHQpKTtcbiAgICAvL0JyaWdodG5lc3MgaXMgb3V0IG9mIDI1NS5cbiAgICByZXR1cm4gY2FsbGJhY2soYnJpZ2h0bmVzcyA8IDEyNy41KTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gRGVmYXVsdCB2YWx1ZSBpcyB0cnVlIChEYXJrIGltYWdlIE1vZGUpXG4gICAgcmV0dXJuIGNhbGxiYWNrKHRydWUpO1xuICB9XG59O1xuIl0sIm5hbWVzIjpbIlN0YWNrIiwidXNlVGhlbWUiLCJmb3J3YXJkUmVmIiwidXNlRWZmZWN0IiwidXNlUmVmIiwiQk9UVE9NX1BBRERJTkciLCJnZXREcm9wZG93bkhlaWdodCIsImFuY2hvckVsIiwiY29udGFpbmVyUmVmIiwiY3VycmVudCIsIndpbmRvdyIsInZpc3VhbFZpZXdwb3J0IiwiYW5jaG9yVG9wIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwib2Zmc2V0SGVpZ2h0IiwiYm90dG9tIiwiaGVpZ2h0IiwiZ2V0T2Zmc2V0VG9wIiwib2Zmc2V0VG9wIiwiRHJvcGRvd24iLCJzeCIsInByb3BzIiwicmVmIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiX2V4dGVuZHMiLCJwb3NpdGlvbiIsIm92ZXJmbG93WSIsImJhY2tncm91bmRDb2xvciIsInpJbmRleCIsInRyYW5zaXRpb24iLCJyaWdodCIsImRpc3BsYXlOYW1lIiwiQ29udGFpbmVkRHJvcGRvd24iLCJjaGlsZHJlbiIsImlzT3BlbiIsIndpZHRoIiwibWFyZ2luIiwiYm9yZGVyUmFkaXVzIiwic2V0SXNPcGVuIiwiY2FsY3VsYXRlZEhlaWdodCIsImNvbnRhaW5lciIsInNwYWNpbmciLCJoYW5kbGVDbGlja091dHNpZGUiLCJlIiwiYW5jaG9yRWxlbWVudENsaWNrZWQiLCJjb250YWlucyIsInRhcmdldCIsImNvbnRhaW5lckNsaWNrZWQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwib3BhY2l0eSIsIlBhZ2VUaXRsZSIsIlBhZ2VUaXRsZVZhcmlhbnQiLCJ0IiwidHJhbnNsYXRlIiwiQWxlcnRDaXJjbGVJY29uIiwiVHlwb2dyYXBoeSIsInVzZVRyYW5zbGF0aW9uIiwiRnVuY3Rpb25OYW1lcyIsImdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUiLCJuYW1lIiwidHJhbnNsYXRpb25zIiwiQlJJREdFIiwiU1dBUCIsIlNFTkQiLCJCVVkiLCJERUZJIiwiS0VZU1RPTkUiLCJUT0tFTl9ERVRBSUxTIiwiRnVuY3Rpb25Jc09mZmxpbmUiLCJmdW5jdGlvbk5hbWUiLCJoaWRlUGFnZVRpdGxlIiwidmFyaWFudCIsIlBSSU1BUlkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJmbGV4R3JvdyIsInNpemUiLCJtYiIsIm10IiwiYWxpZ24iLCJjb2xvciIsInVzZU1lbW8iLCJ1c2VCYWxhbmNlc0NvbnRleHQiLCJ1c2VBY2NvdW50c0NvbnRleHQiLCJ1c2VOZXR3b3JrQ29udGV4dCIsImdldEFkZHJlc3NGb3JDaGFpbiIsInVzZU5mdHMiLCJiYWxhbmNlcyIsImFjY291bnRzIiwiYWN0aXZlIiwiYWN0aXZlQWNjb3VudCIsIm5ldHdvcmsiLCJuZnRzIiwidXNlckFkZHJlc3MiLCJPYmplY3QiLCJ2YWx1ZXMiLCJjaGFpbklkIiwidXNlQ2FsbGJhY2siLCJ1c2VTdGF0ZSIsInVzZUhpc3RvcnkiLCJOZXR3b3JrVk1UeXBlIiwidG9hc3QiLCJKc29uUnBjQmF0Y2hJbnRlcm5hbCIsInVzZVRva2Vuc1dpdGhCYWxhbmNlcyIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJ1c2VJc0Z1bmN0aW9uQXZhaWxhYmxlIiwiRnVuY3Rpb25Jc1VuYXZhaWxhYmxlIiwiZ2V0UHJvdmlkZXJGb3JOZXR3b3JrIiwidG9hc3RDYXJkV2l0aExpbmsiLCJnZXRFeHBsb3JlckFkZHJlc3NCeU5ldHdvcmsiLCJ1c2VOZXR3b3JrRmVlQ29udGV4dCIsIkxvYWRpbmdTZW5kRm9ybSIsInVzZUNvbGxlY3RpYmxlRnJvbVBhcmFtcyIsIlNlbmRFVk1Db2xsZWN0aWJsZSIsIlRva2VuVHlwZSIsIkNvbGxlY3RpYmxlU2VuZCIsImhpc3RvcnkiLCJuZXR3b3JrRmVlIiwiY2FwdHVyZUVuY3J5cHRlZCIsInRva2VucyIsIm5mdCIsImlzRnVuY3Rpb25BdmFpbGFibGUiLCJpc0Z1bmN0aW9uU3VwcG9ydGVkIiwiQ09MTEVDVElCTEVTIiwibmF0aXZlVG9rZW4iLCJmaW5kIiwidHlwZSIsIk5BVElWRSIsInByb3ZpZGVyIiwic2V0UHJvdmlkZXIiLCJ1bmRlZmluZWQiLCJpc01vdW50ZWQiLCJ0aGVuIiwicCIsImZyb21BZGRyZXNzIiwidm1OYW1lIiwiRVZNIiwiYWRkcmVzc0MiLCJvblN1Y2Nlc3MiLCJ0eEhhc2giLCJhZGRyZXNzIiwidGl0bGUiLCJ1cmwiLCJsYWJlbCIsInB1c2giLCJvbkZhaWx1cmUiLCJlcnJvciIsIm9uQXBwcm92ZWQiLCJ0b2tlbkxpc3QiLCJjaGFpbk5hbWUiLCJpc0xvYWRpbmciLCJsb3ciLCJtYXhGZWVQZXJHYXMiLCJsZW5ndGgiLCJtYXhGZWUiLCJCdXR0b24iLCJDYXJkIiwiU2Nyb2xsYmFycyIsIlRvb2x0aXAiLCJzdHlsZWQiLCJ1c2VRdWVyeVBhcmFtcyIsImlzVmFsaWRBZGRyZXNzIiwiaGFuZGxlVHhPdXRjb21lIiwiU2VuZEVycm9yTWVzc2FnZSIsInVzZUVWTVNlbmQiLCJDb250YWN0SW5wdXQiLCJ1c2VJZGVudGlmeUFkZHJlc3MiLCJnZXRTZW5kRXJyb3JNZXNzYWdlIiwidXNlVmFsaWRBZGRyZXNzRnJvbVBhcmFtcyIsIkNvbGxlY3RpYmxlTWVkaWEiLCJ1c2VTZXRDb2xsZWN0aWJsZVBhcmFtcyIsIkdhc2xlc3NQaGFzZSIsIkZsZXhTY3JvbGxiYXJzIiwicGFyYW1zIiwiaWRlbnRpZnlBZGRyZXNzIiwiYWRkcmVzc0Zyb21QYXJhbXMiLCJzZXRBZGRyZXNzIiwiY29udGFjdCIsImlzQ29udGFjdHNPcGVuIiwic2V0SXNDb250YWN0c09wZW4iLCJzZXRDb2xsZWN0aWJsZVBhcmFtcyIsInRva2VuIiwiY2FwdHVyZSIsImdhc2xlc3NQaGFzZSIsImlzU2VuZGluZyIsImlzVmFsaWQiLCJpc1ZhbGlkYXRpbmciLCJzZW5kIiwidmFsaWRhdGUiLCJ0b1N0cmluZyIsImZyb20iLCJnZXQiLCJ0b2tlbklkIiwib3B0aW9ucyIsInJlcGxhY2UiLCJpc1NlbmRBdmFpbGFibGVXaXRoR2FzbGVzcyIsIk5PVF9FTElHSUJMRSIsIklOU1VGRklDSUVOVF9CQUxBTkNFX0ZPUl9GRUUiLCJvblNlbmQiLCJpc0FwcHJvdmVkIiwiaGFzRXJyb3IiLCJyZXN1bHQiLCJ0eEVycm9yIiwiZm9ybVJlZiIsInB0Iiwic3R5bGUiLCJtYXhIZWlnaHQiLCJkaXNwbGF5Iiwib25DaGFuZ2UiLCJuZXdDb250YWN0Iiwib3BlbiIsInBsIiwiQUREUkVTU19SRVFVSVJFRCIsIklOVkFMSURfQUREUkVTUyIsInRoZW1lIiwicGFsZXR0ZSIsIm1haW4iLCJweSIsInB4IiwiY29tcG9uZW50IiwiZm9udFdlaWdodCIsInBiIiwiZmxleERpcmVjdGlvbiIsImxvZ29TbWFsbCIsImxvZ29VcmkiLCJob3ZlciIsIm1sIiwicGxhY2VtZW50Iiwib25DbGljayIsImRpc2FibGVkIiwiZnVsbFdpZHRoIiwiaXNWaWRlbyIsImlzSW1hZ2VEYXJrIiwiSW1hZ2VXcmFwcGVyIiwiSW1hZ2VXaXRoRmFsbGJhY2siLCJpcGZzUmVzb2x2ZXJXaXRoRmFsbGJhY2siLCJDaGlwIiwiVHJpYW5nbGVSaWdodEljb24iLCJBcnJvd3NNYXhpbWl6ZUljb24iLCJOZnRJbWFnZSIsIm1heFdpZHRoIiwiY29tbW9uIiwiYmxhY2siLCJoYXNCb3JkZXJSYWRpdXMiLCJzaG93UG9pbnRlciIsIk5mdFZpZGVvIiwic2hvd1BsYXlJY29uIiwiY29udHJvbHMiLCJjbGFzc05hbWUiLCJzaG93QmFsYW5jZSIsImJhbGFuY2UiLCJzaG93RXhwYW5kT3B0aW9uIiwibm9BY3Rpb24iLCJpc0ltYWdlRnVsbFNjcmVlbiIsInNldElzSW1hZ2VGdWxsU2NyZWVuIiwic2hvdWxkVXNlTGlnaHRJY29uIiwic2V0U2hvdWxkVXNlTGlnaHRJY29uIiwiaXNNZWRpYVNldHRsZWQiLCJzZXRJc01lZGlhU2V0dGxlZCIsImNvbHVtbkdhcCIsIm1yIiwicHIiLCJncmV5IiwiY3Vyc29yIiwic3JjIiwib25Mb2FkU3RhcnQiLCJpc092ZXJsYXkiLCJvbkNsb3NlIiwiYmFja2Ryb3BJbWFnZVVybCIsIm9uTG9hZCIsImV2ZW50IiwiaW1hZ2VFbGVtZW50IiwiSFRNTEltYWdlRWxlbWVudCIsImlzRGFyayIsIm9uRXJyb3IiLCJCb3giLCJDaGV2cm9uTGVmdEljb24iLCJJY29uQnV0dG9uIiwiT3ZlcmxheSIsImxlZnQiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kU2l6ZSIsImJhY2tncm91bmRSZXBlYXQiLCJmaWx0ZXIiLCJkaXNhYmxlUmlwcGxlIiwidXNlTG9jYXRpb24iLCJ4c3MiLCJzZWFyY2giLCJmcm9tRW50cmllcyIsIlVSTFNlYXJjaFBhcmFtcyIsImVudHJpZXMiLCJmaWx0ZXJlZEFkZHJlc3MiLCJpdGVtIiwicGF0aG5hbWUiLCJwdXNoT3JSZXBsYWNlIiwicGF0aCIsImluY2x1ZGVzIiwic2xpY2UiLCJsYXN0SW5kZXhPZiIsImltZyIsImNhbGxiYWNrIiwiY29sb3JTdW0iLCJjYW52YXMiLCJjdHgiLCJnZXRDb250ZXh0IiwiZHJhd0ltYWdlIiwiTWF0aCIsImZsb29yIiwiaW1hZ2VEYXRhIiwiZ2V0SW1hZ2VEYXRhIiwiZGF0YSIsIngiLCJsZW4iLCJyIiwiZyIsImIiLCJFcnJvciIsImF2ZyIsImJyaWdodG5lc3MiXSwic291cmNlUm9vdCI6IiJ9