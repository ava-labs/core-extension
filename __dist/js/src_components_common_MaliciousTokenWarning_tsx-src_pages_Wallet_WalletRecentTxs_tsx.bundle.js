"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_MaliciousTokenWarning_tsx-src_pages_Wallet_WalletRecentTxs_tsx"],{

/***/ "./src/background/services/balances/nft/utils/isNFT.ts":
/*!*************************************************************!*\
  !*** ./src/background/services/balances/nft/utils/isNFT.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNFT": () => (/* binding */ isNFT),
/* harmony export */   "isNftTokenType": () => (/* binding */ isNftTokenType)
/* harmony export */ });
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");

function isNftTokenType(type) {
  return type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC721 || type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC1155;
}
function isNFT(token) {
  return isNftTokenType(token.type);
}

/***/ }),

/***/ "./src/background/services/history/utils/isTxHistoryItem.ts":
/*!******************************************************************!*\
  !*** ./src/background/services/history/utils/isTxHistoryItem.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNonXPHistoryItem": () => (/* binding */ isNonXPHistoryItem),
/* harmony export */   "isPchainTxHistoryItem": () => (/* binding */ isPchainTxHistoryItem)
/* harmony export */ });
function isNonXPHistoryItem(tx) {
  return tx.vmType !== 'AVM' && tx.vmType !== 'PVM';
}
function isPchainTxHistoryItem(tx) {
  return tx.vmType === 'PVM';
}

/***/ }),

/***/ "./src/background/services/network/utils/isSolanaNetwork.ts":
/*!******************************************************************!*\
  !*** ./src/background/services/network/utils/isSolanaNetwork.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isSolanaChainId": () => (/* binding */ isSolanaChainId),
/* harmony export */   "isSolanaNetwork": () => (/* binding */ isSolanaNetwork)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isSolanaNetwork(network) {
  return network ? isSolanaChainId(network.chainId) : false;
}
function isSolanaChainId(chainId) {
  return _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SOLANA_DEVNET_ID === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SOLANA_MAINNET_ID === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SOLANA_TESTNET_ID === chainId;
}

/***/ }),

/***/ "./src/components/common/MaliciousTokenWarning.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/MaliciousTokenWarning.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MaliciousTokenWarningBox": () => (/* binding */ MaliciousTokenWarningBox),
/* harmony export */   "MaliciousTokenWarningIcon": () => (/* binding */ MaliciousTokenWarningIcon)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Permissions/components/WarningBox */ "./src/pages/Permissions/components/WarningBox.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const MaliciousTokenWarningBox = props => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Box, props, /*#__PURE__*/React.createElement(_src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_0__.WarningBox, {
    title: t('Malicious Token'),
    text: t('This token has been flagged as malicious. Use caution when interacting with it.')
  }));
};
const MaliciousTokenWarningIcon = ({
  size
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    title: t('This token has been flagged as malicious')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AlertTriangleIcon, {
    color: theme.palette.warning.main,
    size: size ?? 16
  }));
};

/***/ }),

/***/ "./src/components/common/TruncateFeeAmount.tsx":
/*!*****************************************************!*\
  !*** ./src/components/common/TruncateFeeAmount.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TruncateFeeAmount": () => (/* binding */ TruncateFeeAmount)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function TruncateFeeAmount({
  amount
}) {
  const [integer, fraction] = amount.split('.');
  if (!fraction || fraction && fraction.length <= 5) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
      variant: "body2",
      component: "span",
      color: "text.primary",
      sx: {
        fontWeight: 'fontWeightSemibold'
      }
    }, amount);
  }
  const indexOfNonZero = fraction?.search(/[1-9]/);
  if (indexOfNonZero == -1) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
      variant: "body2",
      component: "span",
      color: "text.primary",
      sx: {
        fontWeight: 'fontWeightSemibold'
      }
    }, integer);
  }
  const zeroCount = fraction.slice(0, indexOfNonZero).length;
  if (fraction && indexOfNonZero) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Stack, {
      sx: {
        flexDirection: 'row',
        columnGap: 0
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
      variant: "body2",
      component: "span",
      color: "text.primary",
      sx: {
        fontWeight: 'fontWeightSemibold'
      }
    }, integer, ".0"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
      variant: "overline",
      component: "span",
      color: "text.primary",
      sx: {
        mt: 1,
        fontWeight: 'fontWeightSemibold'
      }
    }, zeroCount), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
      variant: "body2",
      component: "span",
      color: "text.primary",
      sx: {
        fontWeight: 'fontWeightSemibold'
      }
    }, fraction.slice(indexOfNonZero, indexOfNonZero + 2)));
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
    variant: "body2",
    component: "span",
    color: "text.primary",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, amount);
}

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

/***/ "./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts":
/*!***********************************************************!*\
  !*** ./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isUnifiedBridgeTransfer": () => (/* binding */ isUnifiedBridgeTransfer)
/* harmony export */ });
const isUnifiedBridgeTransfer = transfer => {
  return transfer !== undefined && 'type' in transfer;
};

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

/***/ "./src/pages/Wallet/WalletRecentTxs.tsx":
/*!**********************************************!*\
  !*** ./src/pages/Wallet/WalletRecentTxs.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FilterType": () => (/* binding */ FilterType),
/* harmony export */   "WalletRecentTxs": () => (/* binding */ WalletRecentTxs)
/* harmony export */ });
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/scrollbars/Scrollbars */ "./src/components/common/scrollbars/Scrollbars.tsx");
/* harmony import */ var _components_NoTransactions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/NoTransactions */ "./src/pages/Wallet/components/NoTransactions.tsx");
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/endOfYesterday/index.js");
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/endOfToday/index.js");
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/isSameDay/index.js");
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/format/index.js");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/utils/getExplorerAddress */ "./src/utils/getExplorerAddress.ts");
/* harmony import */ var _components_History_components_ActivityCard_ActivityCard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/History/components/ActivityCard/ActivityCard */ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCard.tsx");
/* harmony import */ var _components_History_components_InProgressBridge_InProgressBridgeActivityCard__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/History/components/InProgressBridge/InProgressBridgeActivityCard */ "./src/pages/Wallet/components/History/components/InProgressBridge/InProgressBridgeActivityCard.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/background/services/balances/nft/utils/isNFT */ "./src/background/services/balances/nft/utils/isNFT.ts");
/* harmony import */ var _Bridge_hooks_usePendingBridgeTransactions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Bridge/hooks/usePendingBridgeTransactions */ "./src/pages/Bridge/hooks/usePendingBridgeTransactions.ts");
/* harmony import */ var _src_background_services_history_utils_isTxHistoryItem__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/background/services/history/utils/isTxHistoryItem */ "./src/background/services/history/utils/isTxHistoryItem.ts");
/* harmony import */ var _components_History_components_ActivityCard_PchainActivityCard__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/History/components/ActivityCard/PchainActivityCard */ "./src/pages/Wallet/components/History/components/ActivityCard/PchainActivityCard.tsx");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./models */ "./src/pages/Wallet/models.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* harmony import */ var _src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @src/utils/getAddressForChain */ "./src/utils/getAddressForChain.ts");
/* harmony import */ var _components_History_components_ActivityCard_XchainActivityCard__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/History/components/ActivityCard/XchainActivityCard */ "./src/pages/Wallet/components/History/components/ActivityCard/XchainActivityCard.tsx");
/* harmony import */ var _src_utils_bridge_getBridgedAssetSymbol__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @src/utils/bridge/getBridgedAssetSymbol */ "./src/utils/bridge/getBridgedAssetSymbol.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");























let FilterType = /*#__PURE__*/function (FilterType) {
  FilterType["ALL"] = "All";
  FilterType["BRIDGE"] = "Bridge";
  FilterType["INCOMING"] = "Incoming";
  FilterType["OUTGOING"] = "Outgoing";
  FilterType["CONTRACT_CALL"] = "Contract Call";
  FilterType["SWAP"] = "Swap";
  FilterType["NFTS"] = "NFTs";
  return FilterType;
}({});
function WalletRecentTxs({
  isEmbedded = false,
  tokenSymbolFilter
}) {
  const {
    t,
    i18n
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_20__.useTranslation)();
  const FilterItems = {
    [FilterType.ALL]: t('All'),
    [FilterType.BRIDGE]: t('Bridge'),
    [FilterType.SWAP]: t('Swap'),
    [FilterType.NFTS]: t('NFTs'),
    [FilterType.CONTRACT_CALL]: t('Contract Call'),
    [FilterType.INCOMING]: t('Incoming'),
    [FilterType.OUTGOING]: t('Outgoing')
  };
  const PchainFilterItems = {
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.ALL]: t('All'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.INCOMING]: t('Incoming'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.OUTGOING]: t('Outgoing'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.ADD_DELEGATOR_TX]: t('Add Delegator'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.ADD_SUBNET_VALIDATOR_TX]: t('Add Subnet Validator'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.ADD_PERMISSIONLESS_VALIDATOR_TX]: t('Add Permissionless Validator'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.ADD_PERMISSIONLESS_DELEGATOR_TX]: t('Add Permissionless Delegator'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.ADD_VALIDATOR_TX]: t('Add Validator'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.ADVANCE_TIME_TX]: t('Advance Time'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.BASE_TX]: t('BaseTx'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.CREATE_CHAIN_TX]: t('Create Chain'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.CREATE_SUBNET_TX]: t('Create Subnet'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.EXPORT_TX]: t('Export'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.IMPORT_TX]: t('Import'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.REWARD_VALIDATOR_TX]: t('Reward Validator'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.REMOVE_SUBNET_VALIDATOR_TX]: t('Remove Subnet Validator'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.TRANSFER_SUBNET_OWNERSHIP_TX]: t('Transfer Subnet Ownership'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.TRANSFORM_SUBNET_TX]: t('Transform Subnet')
  };
  const XchainFilterItems = {
    [_models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.ALL]: t('All'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.INCOMING]: t('Incoming'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.OUTGOING]: t('Outgoing'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.BASE_TX]: t('BaseTx'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.CREATE_ASSET_TX]: t('Create Asset'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.OPERATION_TX]: t('Operation'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.IMPORT_TX]: t('Import'),
    [_models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.EXPORT_TX]: t('Export')
  };
  const {
    getTransactionHistory
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_0__.useWalletContext)();
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_5__.useAccountsContext)();
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [showFilterMenu, setShowFilterMenu] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const yesterday = (0,date_fns__WEBPACK_IMPORTED_MODULE_21__["default"])();
  const today = (0,date_fns__WEBPACK_IMPORTED_MODULE_22__["default"])();
  const [unfilteredTxHistory, setUnfilteredTxHistory] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__.useNetworkContext)();
  const [selectedFilter, setSelectedFilter] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)((0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isPchainNetwork)(network) ? _models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.ALL : (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_15__.isXchainNetwork)(network) ? _models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.ALL : FilterType.ALL);

  /*
   * If a tokenSymbolFilter exists, we need to filter out the bridge
   * transactions to only show the bridge transactions for the token being viewed.
   * If there is no tokenSymbolFilter, then we just return all the current bridge transactions
   * because its probably being rendered in the all activity list.
   */
  const bridgeTransactions = (0,_Bridge_hooks_usePendingBridgeTransactions__WEBPACK_IMPORTED_MODULE_10__.usePendingBridgeTransactions)();
  const filteredBridgeTransactions = tokenSymbolFilter ? Object.values(bridgeTransactions).filter(tx => (0,_src_utils_bridge_getBridgedAssetSymbol__WEBPACK_IMPORTED_MODULE_18__.getBridgedAssetSymbol)(tx) === tokenSymbolFilter) : bridgeTransactions;

  /**
   * When network, addresses, or recentTxHistory changes, new history gets fetched.
   * But recentTxHistory will be removed soon.
   * TODO: Replace recentTxHistory with data we will be getting from balance service
   */
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    setLoading(true);
    getTransactionHistory().then(result => {
      setUnfilteredTxHistory(result);
    }).catch(() => {
      setUnfilteredTxHistory([]);
    }).finally(() => {
      setLoading(false);
    });
  }, [network, activeAccount, getTransactionHistory]);
  const explorerUrl = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (!network || !activeAccount) {
      return undefined;
    }
    const address = (0,_src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_16__.getAddressForChain)(network, activeAccount);

    // Some WalletConnect accounts may come without the BTC address.
    if (!address) {
      return undefined;
    }
    return (0,_src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_6__.getExplorerAddressByNetwork)(network, address, 'address');
  }, [network, activeAccount]);
  const baseFilteredTxHistory = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    function isPendingBridge(tx) {
      return Object.values(bridgeTransactions).some(bridge => bridge.sourceTxHash === tx.hash || !!bridge.targetTxHash && bridge.targetTxHash === tx.hash);
    }
    function shouldTxBeKept(tx) {
      if ((0,_src_background_services_history_utils_isTxHistoryItem__WEBPACK_IMPORTED_MODULE_11__.isNonXPHistoryItem)(tx) && tx.bridgeAnalysis.isBridgeTx && isPendingBridge(tx)) {
        return false;
      }
      return true;
    }
    return unfilteredTxHistory.filter(tx => {
      if (tokenSymbolFilter && (0,_src_background_services_history_utils_isTxHistoryItem__WEBPACK_IMPORTED_MODULE_11__.isNonXPHistoryItem)(tx)) {
        return tokenSymbolFilter === tx.tokens?.[0]?.symbol;
      } else {
        return true;
      }
    }).filter(tx => shouldTxBeKept(tx));
  }, [unfilteredTxHistory, bridgeTransactions, tokenSymbolFilter]);
  function txHistoryItemFilter(tx, filter) {
    if (filter === FilterType.ALL) {
      return true;
    } else if (filter === FilterType.BRIDGE) {
      return tx.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__.TransactionType.BRIDGE || tx.bridgeAnalysis.isBridgeTx;
    } else if (filter === FilterType.SWAP) {
      return tx.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__.TransactionType.SWAP;
    } else if (filter === FilterType.CONTRACT_CALL) {
      return tx.isContractCall && !tx.bridgeAnalysis.isBridgeTx && tx.txType !== _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__.TransactionType.SWAP;
    } else if (filter === FilterType.INCOMING) {
      return tx.isIncoming;
    } else if (filter === FilterType.OUTGOING) {
      return tx.isOutgoing;
    } else if (filter === FilterType.NFTS) {
      return tx.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__.TransactionType.NFT_BUY || (tx.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__.TransactionType.TRANSFER || tx.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__.TransactionType.NFT_RECEIVE || tx.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_19__.TransactionType.UNKNOWN) && tx.tokens[0] && (0,_src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_9__.isNftTokenType)(tx.tokens[0].type);
    } else {
      return false;
    }
  }
  function pchainTxHistoryItemFilter(tx, filter) {
    if (filter === _models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.ALL) {
      return true;
    }
    if (filter === _models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.INCOMING) {
      return !tx.isSender;
    }
    if (filter === _models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterType.OUTGOING) {
      return tx.isSender;
    }
    const typeBasedOnFilter = _models__WEBPACK_IMPORTED_MODULE_14__.PchainFilterTxTypeMap[filter];
    if (typeBasedOnFilter) {
      return tx.txType === typeBasedOnFilter;
    }
    return false;
  }
  function xchainTxHistoryItemFilter(tx, filter) {
    if (filter === _models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.ALL) {
      return true;
    }
    if (filter === _models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.INCOMING) {
      return !tx.isSender;
    }
    if (filter === _models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterType.OUTGOING) {
      return tx.isSender;
    }
    const typeBasedOnFilter = _models__WEBPACK_IMPORTED_MODULE_14__.XchainFilterTxTypeMap[filter];
    if (typeBasedOnFilter) {
      return tx.txType === typeBasedOnFilter;
    }
    return false;
  }
  const filteredTxHistory = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    function shouldTxBeKept(tx, filter) {
      if ((0,_src_background_services_history_utils_isTxHistoryItem__WEBPACK_IMPORTED_MODULE_11__.isNonXPHistoryItem)(tx)) {
        return txHistoryItemFilter(tx, filter);
      } else if ((0,_src_background_services_history_utils_isTxHistoryItem__WEBPACK_IMPORTED_MODULE_11__.isPchainTxHistoryItem)(tx)) {
        return pchainTxHistoryItemFilter(tx, filter);
      } else {
        return xchainTxHistoryItemFilter(tx, filter);
      }
    }
    return baseFilteredTxHistory.filter(tx => shouldTxBeKept(tx, selectedFilter));
  }, [baseFilteredTxHistory, selectedFilter]);
  const getDayString = timestamp => {
    const date = new Date(timestamp);
    const isToday = (0,date_fns__WEBPACK_IMPORTED_MODULE_23__["default"])(today, date);
    const isYesterday = (0,date_fns__WEBPACK_IMPORTED_MODULE_23__["default"])(yesterday, date);
    return isToday ? t('Today') : isYesterday ? t('Yesterday') : i18n.language === 'en' ? (0,date_fns__WEBPACK_IMPORTED_MODULE_24__["default"])(date, 'MMMM do') : new Intl.DateTimeFormat(i18n.language, {
      month: 'long',
      day: '2-digit'
    }).format(date);
  };
  const FilterItem = ({
    keyName,
    onClick
  }) => {
    function onClickHandler() {
      onClick(keyName);
    }
    const label = (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isPchainNetwork)(network) ? PchainFilterItems[keyName] : (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_15__.isXchainNetwork)(network) ? XchainFilterItems[keyName] : FilterItems[keyName];
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.MenuItem, {
      disableRipple: true,
      onClick: onClickHandler,
      sx: {
        height: 32,
        minHeight: 32
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Stack, {
      sx: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Typography, {
      variant: "body2",
      sx: {
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      title: label
    }, label), selectedFilter === keyName && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.CheckIcon, {
      size: 12
    })));
  };
  function handleFilterChange(keyName) {
    setSelectedFilter(keyName);
    setShowFilterMenu(false);
  }
  return /*#__PURE__*/React.createElement(_src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Stack, {
    sx: {
      flexGrow: 1,
      p: isEmbedded ? '0' : '4px 16px 68px',
      rowGap: 1
    }
  }, baseFilteredTxHistory.length > 0 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Stack, {
    sx: theme => ({
      position: 'absolute',
      right: theme.spacing(2),
      top: theme.spacing(1)
    })
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      justifyContent: 'flex-end'
    },
    onClick: () => {
      setShowFilterMenu(!showFilterMenu);
    },
    "data-testid": "filter-activity-menu"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Typography, {
    variant: "caption",
    sx: {
      m: '0 8px 0 5px',
      fontWeight: 'fontWeightMedium'
    }
  }, t('Display'), ":", ' ', (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isPchainNetwork)(network) ? PchainFilterItems[selectedFilter] : (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_15__.isXchainNetwork)(network) ? XchainFilterItems[selectedFilter] : FilterItems[selectedFilter]), showFilterMenu ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.ChevronUpIcon, {
    size: 20
  }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.ChevronDownIcon, {
    size: 20
  })), showFilterMenu && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.MenuList, {
    "data-testid": "filter-activity-options",
    sx: {
      width: 240,
      justifyContent: 'flex-start',
      zIndex: 1,
      height: 200
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    }
  }, Object.keys((0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isPchainNetwork)(network) ? PchainFilterItems : (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_15__.isXchainNetwork)(network) ? XchainFilterItems : FilterItems).map(filterItem => /*#__PURE__*/React.createElement(FilterItem, {
    key: filterItem,
    keyName: filterItem,
    onClick: handleFilterChange
  }))))), filteredTxHistory.length === 0 ? /*#__PURE__*/React.createElement(_components_NoTransactions__WEBPACK_IMPORTED_MODULE_3__.NoTransactions, {
    loading: loading
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, bridgeTransactions && Object.values(filteredBridgeTransactions).length > 0 && (selectedFilter === 'All' || selectedFilter === 'Bridge') && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      m: '8px 0 13px'
    }
  }, t('Pending')), Object.values(filteredBridgeTransactions).map((tx, i) => /*#__PURE__*/React.createElement(_components_History_components_InProgressBridge_InProgressBridgeActivityCard__WEBPACK_IMPORTED_MODULE_8__.InProgressBridgeActivityCard, {
    key: `${tx.sourceTxHash}-${i}`,
    tx: tx
  }))), filteredTxHistory.map((tx, index) => {
    const previousTx = filteredTxHistory[index - 1];
    const isNewDay = index === 0 || !previousTx || !(0,date_fns__WEBPACK_IMPORTED_MODULE_23__["default"])(new Date(tx.timestamp), new Date(previousTx.timestamp));
    return /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
      key: index
    }, isNewDay && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Typography, {
      variant: "body2",
      sx: {
        fontWeight: 'fontWeightSemibold'
      },
      margin: index === 0 ? '8px 0 13px' : '8px 0'
    }, getDayString(tx.timestamp)), (0,_src_background_services_history_utils_isTxHistoryItem__WEBPACK_IMPORTED_MODULE_11__.isNonXPHistoryItem)(tx) ? /*#__PURE__*/React.createElement(_components_History_components_ActivityCard_ActivityCard__WEBPACK_IMPORTED_MODULE_7__.ActivityCard, {
      historyItem: tx
    }) : (0,_src_background_services_history_utils_isTxHistoryItem__WEBPACK_IMPORTED_MODULE_11__.isPchainTxHistoryItem)(tx) ? /*#__PURE__*/React.createElement(_components_History_components_ActivityCard_PchainActivityCard__WEBPACK_IMPORTED_MODULE_12__.PchainActivityCard, {
      historyItem: tx
    }) : /*#__PURE__*/React.createElement(_components_History_components_ActivityCard_XchainActivityCard__WEBPACK_IMPORTED_MODULE_17__.XchainActivityCard, {
      historyItem: tx
    }));
  })), explorerUrl && !loading && !!filteredTxHistory.length && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Stack, {
    sx: {
      flexDirection: 'row',
      width: '100%',
      px: 2,
      my: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_25__.Button, {
    "data-testid": "add-account-button",
    fullWidth: true,
    width: "100%",
    onClick: () => {
      window.open(explorerUrl, '_blank', 'noreferrer');
    }
  }, t('View on explorer')))));
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCard.tsx":
/*!**************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/ActivityCard/ActivityCard.tsx ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActivityCard": () => (/* binding */ ActivityCard)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/lib/btc/utils.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/weiToAvax.js");
/* harmony import */ var _src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/balances/nft/utils/isNFT */ "./src/background/services/balances/nft/utils/isNFT.ts");
/* harmony import */ var _src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/network/utils/isSolanaNetwork */ "./src/background/services/network/utils/isSolanaNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/network/utils/isBitcoinNetwork */ "./src/background/services/network/utils/isBitcoinNetwork.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _ActivityCardAmount__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ActivityCardAmount */ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardAmount.tsx");
/* harmony import */ var _ActivityCardDetails__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ActivityCardDetails */ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardDetails.tsx");
/* harmony import */ var _ActivityCardIcon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ActivityCardIcon */ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardIcon.tsx");
/* harmony import */ var _ActivityCardSummary__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ActivityCardSummary */ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardSummary.tsx");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_components_common_TruncateFeeAmount__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/components/common/TruncateFeeAmount */ "./src/components/common/TruncateFeeAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

















function ActivityCard({
  historyItem
}) {
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_4__.useNetworkContext)();
  const [showDetails, setShowDetails] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(false);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_13__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"])();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const showDetailsOption = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => {
    if (historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.SWAP || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.NFT_BUY || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.NFT_RECEIVE || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.NFT_SEND || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.SEND && historyItem.tokens[0]?.type === 'ERC1155' || (historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.TRANSFER || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.UNKNOWN) && historyItem.tokens[0] && (0,_src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_0__.isNftTokenType)(historyItem.tokens[0].type)) {
      return true;
    }
    return false;
  }, [historyItem]);
  const gasDisplayAmount = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => {
    if (network && (0,_src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_2__.isBitcoinNetwork)(network)) {
      return (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_15__.satoshiToBtc)(Number(historyItem.gasUsed)).toFixed(6).toString();
    }
    if (network && (0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_1__.isSolanaNetwork)(network)) {
      const unit = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_16__.TokenUnit(Number(historyItem.gasUsed) * Number(historyItem.gasPrice ?? 1), 9, '');
      return unit.toDisplay();
    }
    return (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_17__.weiToAvax)(new (big_js__WEBPACK_IMPORTED_MODULE_5___default())(Number(historyItem.gasUsed) * Number(historyItem.gasPrice === undefined ? 1 : historyItem.gasPrice))).toFixed(6).toString();
  }, [network, historyItem]);
  const optionalDetailsButton = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => {
    if (showDetailsOption) {
      if (showDetails) {
        return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.ChevronUpIcon, null);
      } else {
        return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.ChevronDownIcon, null);
      }
    } else {
      return undefined;
    }
  }, [showDetailsOption, showDetails]);
  const txTitle = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => {
    if (network) {
      if (historyItem.bridgeAnalysis.isBridgeTx) {
        return t('Bridge');
      }
      if (historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.SEND && historyItem.tokens[0]?.type === 'ERC1155') {
        return t('NFT Sent');
      }
      switch (historyItem.txType) {
        case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.BRIDGE:
          return t('Bridge');
        case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.SWAP:
          return t('Swap');
        case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.SEND:
          return t('Sent');
        case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.RECEIVE:
          return t('Received');
        case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.NFT_BUY:
          return t('NFT Buy');
        case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.NFT_SEND:
          return t('NFT Sent');
        case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.TRANSFER:
        case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.UNKNOWN:
        case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_11__.TransactionType.NFT_RECEIVE:
          if (historyItem.tokens[0] && (0,_src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_0__.isNftTokenType)(historyItem.tokens[0]?.type)) {
            return historyItem.isSender ? t('NFT Sent') : t('NFT Received');
          } else {
            return t('Transfer');
          }
        default:
          if (historyItem.isContractCall) {
            return t('Contract Call');
          }
          return historyItem.tokens[0]?.symbol;
      }
    }
  }, [network, t, historyItem]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Card, {
    "data-testid": historyItem.isContractCall ? 'Contract-call-activity-card' : historyItem.txType + '-activity-card',
    sx: {
      p: 2,
      backgroundImage: 'none'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Divider, {
      orientation: "vertical",
      flexItem: true,
      style: {
        borderBottomWidth: 1
      }
    }),
    sx: {
      rowGap: 1.5,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    sx: {
      cursor: showDetailsOption ? 'pointer' : 'default'
    },
    onClick: () => {
      const isToggledOnNow = !showDetails;
      if (showDetailsOption) {
        if (isToggledOnNow) {
          // We only want to know when it's being shown
          capture('ActivityCardDetailShown', {
            chainId: network?.chainId,
            type: historyItem.txType
          });
        }
        setShowDetails(isToggledOnNow);
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 2,
      width: '100%',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_ActivityCardIcon__WEBPACK_IMPORTED_MODULE_9__.ActivityCardIcon, {
    historyItem: historyItem
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    sx: {
      rowGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: theme.spacing(32)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Typography, {
    variant: "h6"
  }, txTitle), /*#__PURE__*/React.createElement(_ActivityCardAmount__WEBPACK_IMPORTED_MODULE_7__.ActivityCardAmount, {
    historyItem: historyItem
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_ActivityCardSummary__WEBPACK_IMPORTED_MODULE_10__.ActivityCardSummary, {
    historyItem: historyItem
  }), optionalDetailsButton)))), showDetails && /*#__PURE__*/React.createElement(_ActivityCardDetails__WEBPACK_IMPORTED_MODULE_8__.ActivityCardDetails, {
    historyItem: historyItem
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Typography, null, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Tooltip, {
    title: t('View in Explorer'),
    arrow: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 0.5,
      cursor: 'pointer'
    },
    onClick: async () => {
      await capture('ActivityCardLinkClicked', {
        chainId: network?.chainId,
        type: historyItem.txType
      });
      window.open(historyItem.explorerLink, '_blank', 'noreferrer');
    },
    "data-testid": "explorer-link"
  }, /*#__PURE__*/React.createElement(_src_components_common_TruncateFeeAmount__WEBPACK_IMPORTED_MODULE_12__.TruncateFeeAmount, {
    amount: gasDisplayAmount
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.Typography, null, network?.networkToken.symbol), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__.ExternalLinkIcon, {
    size: 16,
    sx: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
    }
  }))))));
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardAmount.tsx":
/*!********************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardAmount.tsx ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActivityCardAmount": () => (/* binding */ ActivityCardAmount)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/balances/nft/utils/isNFT */ "./src/background/services/balances/nft/utils/isNFT.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_components_common_TruncateFeeAmount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/TruncateFeeAmount */ "./src/components/common/TruncateFeeAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function ActivityCardAmount({
  historyItem
}) {
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  function getSourceToken(tx) {
    const userAddress = activeAccount?.addressC;
    if (!userAddress) {
      return undefined;
    }
    return tx.tokens.find(token => token.from?.address === userAddress);
  }
  function getTargetToken(tx) {
    const userAddress = activeAccount?.addressC;
    if (!userAddress) {
      return undefined;
    }
    return tx.tokens.find(token => token.to?.address === userAddress);
  }
  if (historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TransactionType.SWAP && activeAccount?.addressC) {
    const source = getSourceToken(historyItem);
    const target = getTargetToken(historyItem);
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
      sx: {
        flexDirection: 'row',
        columnGap: 0.5
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
      variant: "body2",
      sx: {
        fontWeight: 'fontWeightSemibold'
      }
    }, source?.amount), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
      variant: "body2",
      sx: theme => ({
        color: theme.palette.primary.dark
      })
    }, source?.symbol, " ->"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
      variant: "body2",
      sx: {
        fontWeight: 'fontWeightSemibold'
      }
    }, target?.amount), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
      variant: "body2",
      sx: theme => ({
        color: theme.palette.primary.dark
      })
    }, target?.symbol));
  } else if (historyItem.tokens[0] && (0,_src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_0__.isNftTokenType)(historyItem.tokens[0]?.type)) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, null, "#", historyItem.tokens?.[0]?.collectableTokenId);
  }
  const amount = historyItem.tokens?.[0]?.amount;
  const symbol = historyItem.tokens?.[0]?.symbol;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 0.5
    }
  }, amount && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Tooltip, {
    title: amount
  }, /*#__PURE__*/React.createElement(_src_components_common_TruncateFeeAmount__WEBPACK_IMPORTED_MODULE_3__.TruncateFeeAmount, {
    amount: amount
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: theme => ({
      color: theme.palette.primary.dark
    })
  }, symbol));
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardDetails.tsx":
/*!*********************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardDetails.tsx ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActivityCardDetails": () => (/* binding */ ActivityCardDetails)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/avalanche.chain.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/balances/nft/utils/isNFT */ "./src/background/services/balances/nft/utils/isNFT.ts");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function ActivityCardDetails({
  historyItem
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  if (historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TransactionType.SWAP) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      sx: {
        mt: 1,
        rowGap: 1
      }
    }, historyItem.tokens.map((token, i) => {
      return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
        key: i,
        sx: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          rowGap: 1
        }
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
        sx: {
          flexDirection: 'row',
          columnGap: 1
        }
      }, token.symbol === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_6__.AVAX_TOKEN.symbol ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.AvalancheColorIcon, {
        size: 16
      }) : /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_1__.TokenIcon, {
        width: theme.spacing(2),
        height: theme.spacing(2),
        src: token.imageUri,
        name: token.name
      }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
        variant: "caption"
      }, token.symbol)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
        sx: {
          flexDirection: 'row',
          columnGap: 1
        }
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
        variant: "caption"
      }, " ", token.amount), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
        variant: "caption"
      }, token.symbol)));
    }));
  } else if ((historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TransactionType.TRANSFER || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TransactionType.UNKNOWN) && historyItem.tokens[0]?.type && (0,_src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_0__.isNftTokenType)(historyItem.tokens[0].type) || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TransactionType.NFT_BUY || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TransactionType.NFT_RECEIVE || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TransactionType.NFT_SEND || historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TransactionType.SEND && historyItem.tokens[0]?.type === 'ERC1155') {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      sx: {
        flexDirection: 'row',
        mt: 1,
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, null, t('Collection')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, null, historyItem.tokens?.[0]?.name));
  } else {
    return /*#__PURE__*/React.createElement(React.Fragment, null);
  }
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardIcon.tsx":
/*!******************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardIcon.tsx ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActivityCardIcon": () => (/* binding */ ActivityCardIcon)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/balances/nft/utils/isNFT */ "./src/background/services/balances/nft/utils/isNFT.ts");
/* harmony import */ var _src_pages_Collectibles_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/pages/Collectibles/components/CollectibleMedia */ "./src/pages/Collectibles/components/CollectibleMedia.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function ActivityCardIcon({
  historyItem
}) {
  const [txIcon, setTxIcon] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    const getNftIcon = tx => /*#__PURE__*/React.createElement(_src_pages_Collectibles_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_2__.CollectibleMedia, {
      height: theme.spacing(4),
      maxHeight: theme.spacing(4),
      width: "auto",
      maxWidth: theme.spacing(4),
      url: tx.tokens?.[0]?.imageUri,
      hover: false,
      margin: "8px 0",
      showPlayIcon: false,
      borderRadius: "50%"
    });
    const iconSize = theme.spacing(2);
    const defaultIcon = historyItem.isSender ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ArrowUpIcon, {
      size: iconSize
    }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ArrowDownIcon, {
      size: iconSize
    });
    if (historyItem.bridgeAnalysis.isBridgeTx) {
      setTxIcon( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.BridgeIcon, {
        size: iconSize
      }));
      return;
    }
    if (historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.SEND && historyItem.tokens[0]?.type === 'ERC1155') {
      setTxIcon(getNftIcon(historyItem));
      return;
    }
    switch (historyItem.txType) {
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.BRIDGE:
        setTxIcon( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.BridgeIcon, {
          size: iconSize
        }));
        break;
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.SWAP:
        setTxIcon( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.SwapIcon, {
          size: iconSize
        }));
        break;
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.SEND:
        setTxIcon( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ArrowUpRightIcon, {
          size: iconSize
        }));
        break;
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.RECEIVE:
        setTxIcon( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ArrowDownLeftIcon, {
          size: iconSize
        }));
        break;
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.NFT_BUY:
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.NFT_SEND:
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.NFT_RECEIVE:
        setTxIcon(getNftIcon(historyItem));
        break;
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.TRANSFER:
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TransactionType.UNKNOWN:
        if (historyItem.tokens[0] && (0,_src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_1__.isNftTokenType)(historyItem.tokens[0]?.type)) {
          setTxIcon(getNftIcon(historyItem));
        } else {
          setTxIcon(defaultIcon);
        }
        break;
      default:
        if (historyItem.isContractCall) {
          setTxIcon( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.NotesIcon, {
            size: iconSize
          }));
          break;
        }
        setTxIcon(defaultIcon);
    }
  }, [t, theme, historyItem]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      height: theme.spacing(4),
      width: theme.spacing(4),
      borderRadius: '50%',
      backgroundColor: theme.palette.grey[800],
      justifyContent: 'center',
      alignItems: 'center',
      color: 'secondary.main'
    }
  }, txIcon);
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardSummary.tsx":
/*!*********************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/ActivityCard/ActivityCardSummary.tsx ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActivityCardSummary": () => (/* binding */ ActivityCardSummary)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _useBlockchainNames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../useBlockchainNames */ "./src/pages/Wallet/components/History/useBlockchainNames.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function ActivityCardSummary({
  historyItem
}) {
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_0__.useAccountsContext)();
  const {
    sourceBlockchain,
    targetBlockchain
  } = (0,_useBlockchainNames__WEBPACK_IMPORTED_MODULE_2__.useBlockchainNames)(historyItem);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  if (historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__.TransactionType.BRIDGE || historyItem.bridgeAnalysis.isBridgeTx) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "caption",
      sx: theme => ({
        color: theme.palette.primary.dark
      })
    }, sourceBlockchain ?? t('Unknown'), " ->", ' ', targetBlockchain ?? t('Unknown'));
  } else if (historyItem.txType === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__.TransactionType.SWAP) {
    const sourceToken = historyItem.tokens.find(token => token.from?.address === activeAccount?.addressC);
    const targetToken = historyItem.tokens.find(token => token.to?.address === activeAccount?.addressC);
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "caption",
      sx: theme => ({
        color: theme.palette.primary.dark
      })
    }, sourceToken?.symbol, " -> ", targetToken?.symbol);
  }
  const txDirection = historyItem.isSender ? t('To') : t('From');
  const txAddress = historyItem.isSender ? historyItem.to : historyItem.from;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "caption",
    sx: theme => ({
      color: theme.palette.primary.dark
    })
  }, txDirection, ": ", (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_1__.truncateAddress)(txAddress));
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/ActivityCard/PchainActivityCard.tsx":
/*!********************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/ActivityCard/PchainActivityCard.tsx ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PchainActivityCard": () => (/* binding */ PchainActivityCard)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _PrimaryNetworkMethodIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrimaryNetworkMethodIcon */ "./src/pages/Wallet/components/History/components/ActivityCard/PrimaryNetworkMethodIcon.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/glacier-sdk */ "./node_modules/@avalabs/glacier-sdk/esm/generated/models/PChainTransactionType.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/trunateAddress.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function PchainActivityCard({
  historyItem
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__.useNetworkContext)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const txTitle = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (network) {
      switch (historyItem.txType) {
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.ADD_DELEGATOR_TX:
          return t('Add Delegator');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.ADD_SUBNET_VALIDATOR_TX:
          return t('Add Subnet Validator');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.ADD_PERMISSIONLESS_VALIDATOR_TX:
          return t('Add Permissionless Validator');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.ADD_PERMISSIONLESS_DELEGATOR_TX:
          return t('Add Permissionless Delegator');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.ADD_VALIDATOR_TX:
          return t('Add Validator');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.ADVANCE_TIME_TX:
          return t('Advance Time');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.BASE_TX:
          return t('BaseTx');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.CREATE_CHAIN_TX:
          return t('Create Chain');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.CREATE_SUBNET_TX:
          return t('Create Subnet');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.EXPORT_TX:
          return t('Export');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.IMPORT_TX:
          return t('Import');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.REWARD_VALIDATOR_TX:
          return t('Reward Validator');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.REMOVE_SUBNET_VALIDATOR_TX:
          return t('Remove Subnet Validator');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.TRANSFER_SUBNET_OWNERSHIP_TX:
          return t('Transfer Subnet Ownership');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.PChainTransactionType.TRANSFORM_SUBNET_TX:
          return t('Transform Subnet');
        default:
          return t('Unknown');
      }
    }
  }, [network, t, historyItem]);
  const txDirection = historyItem.isSender ? t('To') : t('From');
  const txAddressesToShow = historyItem.isSender ? historyItem.to : historyItem.from;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Card, {
    "data-testid": historyItem.txType + '-activity-card',
    sx: {
      p: 2,
      backgroundImage: 'none'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Divider, {
      orientation: "vertical",
      flexItem: true,
      style: {
        borderBottomWidth: 1
      }
    }),
    sx: {
      rowGap: 1.5,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      cursor: 'default'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 2,
      width: '100%',
      alignItems: 'center'
    }
  }, historyItem.txType && /*#__PURE__*/React.createElement(_PrimaryNetworkMethodIcon__WEBPACK_IMPORTED_MODULE_0__.PrimaryNetworkMethodIcon, {
    methodName: historyItem.txType
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      rowGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: theme.spacing(32)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "h6"
  }, txTitle), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, historyItem.tokens[0]?.amount), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      color: theme.palette.primary.dark
    }
  }, historyItem.tokens[0]?.symbol))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: theme.palette.primary.dark
    }
  }, txDirection, ":"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, Array.isArray(txAddressesToShow) && Array.from(txAddressesToShow).map((address, i) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    key: `${address}-${i}`,
    variant: "caption",
    sx: {
      color: theme.palette.primary.dark
    }
  }, (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_8__.truncateAddress)(address))), !Array.isArray(txAddressesToShow) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    key: `${txAddressesToShow}`,
    variant: "caption",
    sx: {
      color: theme.palette.primary.dark
    }
  }, (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_8__.truncateAddress)(txAddressesToShow)))))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, null, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tooltip, {
    title: t('View in Explorer'),
    arrow: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 0.5,
      alignItems: 'center',
      cursor: 'pointer'
    },
    onClick: async () => {
      capture('PchainActivityCardLinkClicked', {
        chainId: network?.chainId,
        type: historyItem.txType
      });
      window.open(historyItem.explorerLink, '_blank', 'noreferrer');
    },
    "data-testid": "explorer-link"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, null, historyItem.gasUsed), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, null, network?.networkToken.symbol), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.ExternalLinkIcon, {
    size: 16,
    sx: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
    }
  }))))));
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/ActivityCard/PrimaryNetworkMethodIcon.tsx":
/*!**************************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/ActivityCard/PrimaryNetworkMethodIcon.tsx ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrimaryNetworkMethodIcon": () => (/* binding */ PrimaryNetworkMethodIcon)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/glacier-sdk */ "./node_modules/@avalabs/glacier-sdk/esm/generated/models/PChainTransactionType.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const METHOD_NAME_TO_ICON = {
  // Both
  ImportTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ArrowDownLeftIcon,
  ExportTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ArrowUpRightIcon,
  BaseTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ArrowRightIcon,
  // X-Chain
  CreateAssetTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AirdropIcon,
  OperationTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AirdropIcon,
  // P-Chain
  AddPermissionlessDelegatorTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AddUserIcon,
  AddValidatorTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AddUserIcon,
  AddSubnetValidatorTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AddUserIcon,
  TransferSubnetOwnershipTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AddUserIcon,
  AddDelegatorTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AddUserIcon,
  CreateSubnetTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ShareIcon,
  CreateChainTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.BlockchainIcon,
  TransformSubnetTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.BlockchainIcon,
  AddPermissionlessValidatorTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AddUserIcon,
  RemoveSubnetValidatorTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.MinusCircleIcon,
  RewardValidatorTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AirdropIcon,
  AdvanceTimeTx: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ClockIcon,
  [_avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_2__.PChainTransactionType.CONVERT_SUBNET_TO_L1TX]: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.RefreshIcon,
  [_avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_2__.PChainTransactionType.REGISTER_L1VALIDATOR_TX]: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ValidatorIcon,
  [_avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_2__.PChainTransactionType.SET_L1VALIDATOR_WEIGHT_TX]: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.BuildIcon,
  [_avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_2__.PChainTransactionType.DISABLE_L1VALIDATOR_TX]: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.DownloadIcon,
  [_avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_2__.PChainTransactionType.INCREASE_L1VALIDATOR_BALANCE_TX]: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.ChevronDoubleUpIcon,
  UNKNOWN: _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.HelpCircleIcon
};
function PrimaryNetworkMethodIcon({
  methodName
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const Icon = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => methodName ? METHOD_NAME_TO_ICON[methodName] || METHOD_NAME_TO_ICON.UNKNOWN : METHOD_NAME_TO_ICON.UNKNOWN, [methodName]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      height: theme.spacing(4),
      width: theme.spacing(4),
      borderRadius: '50%',
      backgroundColor: theme.palette.grey[800],
      justifyContent: 'center',
      alignItems: 'center',
      color: 'secondary.main'
    }
  }, /*#__PURE__*/React.createElement(Icon, null));
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/ActivityCard/XchainActivityCard.tsx":
/*!********************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/ActivityCard/XchainActivityCard.tsx ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "XchainActivityCard": () => (/* binding */ XchainActivityCard)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _PrimaryNetworkMethodIcon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrimaryNetworkMethodIcon */ "./src/pages/Wallet/components/History/components/ActivityCard/PrimaryNetworkMethodIcon.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/glacier-sdk */ "./node_modules/@avalabs/glacier-sdk/esm/generated/models/XChainTransactionType.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/trunateAddress.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function XchainActivityCard({
  historyItem
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__.useNetworkContext)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const txTitle = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (network) {
      switch (historyItem.txType) {
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.XChainTransactionType.BASE_TX:
          return t('BaseTx');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.XChainTransactionType.CREATE_ASSET_TX:
          return t('Create Asset');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.XChainTransactionType.OPERATION_TX:
          return t('Operation');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.XChainTransactionType.IMPORT_TX:
          return t('Import');
        case _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_6__.XChainTransactionType.EXPORT_TX:
          return t('Export');
        default:
          return t('Unknown');
      }
    }
  }, [network, t, historyItem]);
  const txDirection = historyItem.isSender ? t('To') : t('From');
  const txAddressesToShow = historyItem.isSender ? historyItem.to : historyItem.from;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Card, {
    "data-testid": historyItem.txType + '-activity-card',
    sx: {
      p: 2,
      backgroundImage: 'none'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Divider, {
      orientation: "vertical",
      flexItem: true,
      style: {
        borderBottomWidth: 1
      }
    }),
    sx: {
      rowGap: 1.5,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      cursor: 'default'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 2,
      width: '100%',
      alignItems: 'center'
    }
  }, historyItem.txType && /*#__PURE__*/React.createElement(_PrimaryNetworkMethodIcon__WEBPACK_IMPORTED_MODULE_0__.PrimaryNetworkMethodIcon, {
    methodName: historyItem.txType
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      rowGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: theme.spacing(32)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "h6"
  }, txTitle), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, historyItem.tokens[0]?.amount), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      color: theme.palette.primary.dark
    }
  }, historyItem.tokens[0]?.symbol))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: theme.palette.primary.dark
    }
  }, txDirection, ":"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, Array.isArray(txAddressesToShow) && Array.from(txAddressesToShow).map((address, i) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    key: `${address}-${i}`,
    variant: "caption",
    sx: {
      color: theme.palette.primary.dark
    }
  }, (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_8__.truncateAddress)(address))), !Array.isArray(txAddressesToShow) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    key: `${txAddressesToShow}`,
    variant: "caption",
    sx: {
      color: theme.palette.primary.dark
    }
  }, (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_8__.truncateAddress)(txAddressesToShow)))))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, null, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tooltip, {
    title: t('View in Explorer'),
    arrow: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 0.5,
      alignItems: 'center',
      cursor: 'pointer'
    },
    onClick: async () => {
      capture('XchainActivityCardLinkClicked', {
        chainId: network?.chainId,
        type: historyItem.txType
      });
      window.open(historyItem.explorerLink, '_blank', 'noreferrer');
    },
    "data-testid": "explorer-link"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, null, historyItem.gasUsed), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, null, network?.networkToken.symbol), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.ExternalLinkIcon, {
    size: 16,
    sx: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
    }
  }))))));
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/InProgressBridge/InProgressBridgeActivityCard.tsx":
/*!**********************************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/InProgressBridge/InProgressBridgeActivityCard.tsx ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InProgressBridgeActivityCard": () => (/* binding */ InProgressBridgeActivityCard)
/* harmony export */ });
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/contexts/BridgeSDKProvider.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_BridgeProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/BridgeProvider */ "./src/contexts/BridgeProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_pages_Bridge_utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/pages/Bridge/utils/blockchainConversion */ "./src/pages/Bridge/utils/blockchainConversion.ts");
/* harmony import */ var _src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/getExplorerAddress */ "./src/utils/getExplorerAddress.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _useBlockchainNames__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../useBlockchainNames */ "./src/pages/Wallet/components/History/useBlockchainNames.ts");
/* harmony import */ var _InProgressBridgeIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./InProgressBridgeIcon */ "./src/pages/Wallet/components/History/components/InProgressBridge/InProgressBridgeIcon.tsx");
/* harmony import */ var _src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/pages/Bridge/utils/isUnifiedBridgeTransfer */ "./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts");
/* harmony import */ var _src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/bigintToBig */ "./src/utils/bigintToBig.ts");
/* harmony import */ var _src_contexts_UnifiedBridgeProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/UnifiedBridgeProvider */ "./src/contexts/UnifiedBridgeProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");














function InProgressBridgeActivityCard({
  tx
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__["default"])();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_12__.useHistory)();
  const {
    networks
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__.useNetworkContext)();
  const {
    bridgeConfig
  } = (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_13__.useBridgeSDK)();
  const {
    sourceBlockchain,
    targetBlockchain
  } = (0,_useBlockchainNames__WEBPACK_IMPORTED_MODULE_5__.useBlockchainNames)(tx);
  const [toastShown, setToastShown] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const {
    removeBridgeTransaction
  } = (0,_src_contexts_BridgeProvider__WEBPACK_IMPORTED_MODULE_0__.useBridgeContext)();
  const {
    getErrorMessage
  } = (0,_src_contexts_UnifiedBridgeProvider__WEBPACK_IMPORTED_MODULE_9__.useUnifiedBridgeContext)();
  const explorerUrl = (0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const networkData = (0,_src_pages_Bridge_utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_2__.blockchainToNetwork)(tx.sourceChain, networks, bridgeConfig);
    if (networkData) {
      return (0,_src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_3__.getExplorerAddressByNetwork)(networkData, tx.sourceTxHash);
    }
    return undefined;
  }, [tx.sourceChain, tx.sourceTxHash, networks, bridgeConfig]);
  const inProgressValue = (0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    if (!tx) {
      return 0;
    }
    if ((0,_src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_7__.isUnifiedBridgeTransfer)(tx)) {
      const totalConfirmationsRequired = tx.sourceRequiredConfirmationCount + tx.targetRequiredConfirmationCount;
      const totalConfirmationsObtained = tx.sourceConfirmationCount + tx.targetConfirmationCount;
      return Math.min(100, totalConfirmationsObtained / totalConfirmationsRequired * 100);
    }
    const confirmationCount = tx.requiredConfirmationCount + 1; // 1 is added for target network

    const currentCount = tx.confirmationCount > tx.requiredConfirmationCount ? tx.requiredConfirmationCount : tx.confirmationCount;
    return currentCount / confirmationCount * 100;
  }, [tx]);
  const symbol = (0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => (0,_src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_7__.isUnifiedBridgeTransfer)(tx) ? tx.asset.symbol : tx?.symbol, [tx]);
  const amount = (0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    if ((0,_src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_7__.isUnifiedBridgeTransfer)(tx)) {
      return (0,_src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_8__.bigintToBig)(tx.amount, tx.asset.decimals);
    }
    return tx.amount;
  }, [tx]);
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!tx.completedAt) {
      return;
    }
    if (!toastShown) {
      setToastShown(true);
      const isSuccessful = !(0,_src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_7__.isUnifiedBridgeTransfer)(tx) || !tx.errorCode;
      const toastId = _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"].custom( /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.ToastCard, {
        variant: isSuccessful ? 'success' : 'error',
        title: isSuccessful ? t('Bridge Successful') : t('Bridge Failed'),
        onDismiss: () => {
          _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"].remove(toastId);
        }
      }, isSuccessful ? t(`You transferred {{amount}} {{symbol}}`, {
        amount,
        symbol
      }) : tx.errorCode ? getErrorMessage(tx.errorCode) : ''), {
        duration: Infinity
      });
    }
    removeBridgeTransaction(tx.sourceTxHash);
  }, [removeBridgeTransaction, t, toastShown, tx, amount, getErrorMessage, symbol]);
  const errorCode = (0,_src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_7__.isUnifiedBridgeTransfer)(tx) ? tx.errorCode : undefined;
  const hasError = typeof errorCode !== 'undefined';
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Card, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Divider, {
      orientation: "vertical",
      flexItem: true,
      style: {
        borderBottomWidth: 1
      }
    }),
    sx: {
      rowGap: 1.5,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 2,
      width: '100%',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_InProgressBridgeIcon__WEBPACK_IMPORTED_MODULE_6__.InProgressBridgeIcon, {
    value: inProgressValue,
    hasError: hasError
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: theme.spacing(32)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "h6"
  }, t('Bridge')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, amount.toString()), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "body2",
    sx: {
      color: theme.palette.primary.dark
    }
  }, symbol))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "caption",
    sx: {
      color: theme.palette.primary.dark
    }
  }, sourceBlockchain, " -> ", targetBlockchain), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Button, {
    variant: "text",
    disableRipple: true,
    sx: {
      p: 0
    },
    onClick: () => {
      const chainName = typeof tx.sourceChain === 'string' ? tx.sourceChain : (0,_src_pages_Bridge_utils_blockchainConversion__WEBPACK_IMPORTED_MODULE_2__.networkToBlockchain)(tx.sourceChain);
      history.push(`/bridge/transaction-status/${chainName}/${tx.sourceTxHash}/${tx.sourceStartedAt}`);
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "caption",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, t('View Status')))))))), !hasError && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, null, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexDirection: 'row',
      columnGap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, null, t('Pending')), explorerUrl && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.ExternalLinkIcon, {
    size: 16,
    sx: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
    },
    onClick: () => {
      window.open(explorerUrl, '_blank', 'noreferrer');
    }
  })))));
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/components/InProgressBridge/InProgressBridgeIcon.tsx":
/*!**************************************************************************************************!*\
  !*** ./src/pages/Wallet/components/History/components/InProgressBridge/InProgressBridgeIcon.tsx ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InProgressBridgeIcon": () => (/* binding */ InProgressBridgeIcon)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function InProgressBridgeIcon({
  value,
  hasError
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      position: 'relative',
      display: 'inline-flex',
      borderRadius: '50%',
      backgroundColor: theme.palette.grey[800],
      height: 32,
      width: 32
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, {
    variant: "determinate",
    size: 32,
    thickness: 2,
    value: hasError ? 100 : value,
    disableShrink: false,
    color: hasError ? 'error' : 'secondary'
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 32,
      width: 32
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.BridgeIcon, {
    size: theme.spacing(2),
    sx: {
      color: hasError ? theme.palette.error.main : theme.palette.secondary.main
    }
  })));
}

/***/ }),

/***/ "./src/pages/Wallet/components/History/useBlockchainNames.ts":
/*!*******************************************************************!*\
  !*** ./src/pages/Wallet/components/History/useBlockchainNames.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useBlockchainNames": () => (/* binding */ useBlockchainNames)
/* harmony export */ });
/* harmony import */ var _src_utils_bridgeTransactionUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/utils/bridgeTransactionUtils */ "./src/utils/bridgeTransactionUtils.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");


function useBlockchainNames(item) {
  const pending = (0,_src_utils_bridgeTransactionUtils__WEBPACK_IMPORTED_MODULE_0__.isPendingBridgeTransaction)(item);
  const {
    getNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__.useNetworkContext)();
  if (pending) {
    return {
      sourceBlockchain: titleCase(typeof item.sourceChain === 'object' ? item.sourceChain.chainName : item.sourceChain),
      targetBlockchain: titleCase(typeof item.targetChain === 'object' ? item.targetChain.chainName : item.targetChain)
    };
  }
  if (!item.bridgeAnalysis.isBridgeTx) {
    return {
      sourceBlockchain: undefined,
      targetBlockchain: undefined
    };
  }
  const {
    sourceChainId,
    targetChainId
  } = item.bridgeAnalysis;
  return {
    sourceBlockchain: sourceChainId ? getNetwork(sourceChainId)?.chainName ?? sourceChainId : undefined,
    targetBlockchain: targetChainId ? getNetwork(targetChainId)?.chainName ?? targetChainId : undefined
  };
}
function titleCase(name) {
  return (name[0] || '').toUpperCase() + name.slice(1);
}

/***/ }),

/***/ "./src/pages/Wallet/components/NoTransactions.tsx":
/*!********************************************************!*\
  !*** ./src/pages/Wallet/components/NoTransactions.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoTransactions": () => (/* binding */ NoTransactions)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function NoTransactions({
  loading = false
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_0__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      alignItems: 'center',
      flexGrow: 1,
      mt: 9
    }
  }, loading ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.CircularProgress, {
    size: 32
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, t('No Activity')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      my: 1,
      color: theme.palette.primary.dark
    }
  }, t('Add assets by Buying or Receiving'))));
}

/***/ }),

/***/ "./src/pages/Wallet/models.ts":
/*!************************************!*\
  !*** ./src/pages/Wallet/models.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PchainFilterTxTypeMap": () => (/* binding */ PchainFilterTxTypeMap),
/* harmony export */   "PchainFilterType": () => (/* binding */ PchainFilterType),
/* harmony export */   "XchainFilterTxTypeMap": () => (/* binding */ XchainFilterTxTypeMap),
/* harmony export */   "XchainFilterType": () => (/* binding */ XchainFilterType)
/* harmony export */ });
/* harmony import */ var _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/glacier-sdk */ "./node_modules/@avalabs/glacier-sdk/esm/generated/models/PChainTransactionType.js");
/* harmony import */ var _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/glacier-sdk */ "./node_modules/@avalabs/glacier-sdk/esm/generated/models/XChainTransactionType.js");

let PchainFilterType = /*#__PURE__*/function (PchainFilterType) {
  PchainFilterType["ALL"] = "All";
  PchainFilterType["INCOMING"] = "Incoming";
  PchainFilterType["OUTGOING"] = "Outgoing";
  PchainFilterType["ADD_DELEGATOR_TX"] = "Add Delegator";
  PchainFilterType["ADD_SUBNET_VALIDATOR_TX"] = "Add Subnet Validator";
  PchainFilterType["ADD_PERMISSIONLESS_VALIDATOR_TX"] = "Add Permissionless Validator";
  PchainFilterType["ADD_PERMISSIONLESS_DELEGATOR_TX"] = "Add Permissionless Delegator";
  PchainFilterType["ADD_VALIDATOR_TX"] = "Add Validator";
  PchainFilterType["ADVANCE_TIME_TX"] = "Advance Time";
  PchainFilterType["BASE_TX"] = "BaseTx";
  PchainFilterType["CREATE_CHAIN_TX"] = "Create Chain";
  PchainFilterType["CREATE_SUBNET_TX"] = "Create Subnet";
  PchainFilterType["EXPORT_TX"] = "Export";
  PchainFilterType["IMPORT_TX"] = "Import";
  PchainFilterType["REWARD_VALIDATOR_TX"] = "Reward Validator";
  PchainFilterType["REMOVE_SUBNET_VALIDATOR_TX"] = "Remove Subnet Validator";
  PchainFilterType["TRANSFER_SUBNET_OWNERSHIP_TX"] = "Transfer Subnet Ownership";
  PchainFilterType["TRANSFORM_SUBNET_TX"] = "Transform Subnet";
  return PchainFilterType;
}({});
const PchainFilterTxTypeMap = {
  [PchainFilterType.ADD_DELEGATOR_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.ADD_DELEGATOR_TX,
  [PchainFilterType.ADD_SUBNET_VALIDATOR_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.ADD_SUBNET_VALIDATOR_TX,
  [PchainFilterType.ADD_PERMISSIONLESS_VALIDATOR_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.ADD_PERMISSIONLESS_VALIDATOR_TX,
  [PchainFilterType.ADD_PERMISSIONLESS_DELEGATOR_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.ADD_PERMISSIONLESS_DELEGATOR_TX,
  [PchainFilterType.ADD_VALIDATOR_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.ADD_VALIDATOR_TX,
  [PchainFilterType.ADVANCE_TIME_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.ADVANCE_TIME_TX,
  [PchainFilterType.BASE_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.BASE_TX,
  [PchainFilterType.CREATE_CHAIN_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.CREATE_CHAIN_TX,
  [PchainFilterType.CREATE_SUBNET_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.CREATE_SUBNET_TX,
  [PchainFilterType.EXPORT_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.EXPORT_TX,
  [PchainFilterType.IMPORT_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.IMPORT_TX,
  [PchainFilterType.REWARD_VALIDATOR_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.REWARD_VALIDATOR_TX,
  [PchainFilterType.REMOVE_SUBNET_VALIDATOR_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.REMOVE_SUBNET_VALIDATOR_TX,
  [PchainFilterType.TRANSFER_SUBNET_OWNERSHIP_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.TRANSFER_SUBNET_OWNERSHIP_TX,
  [PchainFilterType.TRANSFORM_SUBNET_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_0__.PChainTransactionType.TRANSFORM_SUBNET_TX
};
let XchainFilterType = /*#__PURE__*/function (XchainFilterType) {
  XchainFilterType["ALL"] = "All";
  XchainFilterType["INCOMING"] = "Incoming";
  XchainFilterType["OUTGOING"] = "Outgoing";
  XchainFilterType["BASE_TX"] = "BaseTx";
  XchainFilterType["CREATE_ASSET_TX"] = "Create Asset";
  XchainFilterType["OPERATION_TX"] = "Operation";
  XchainFilterType["IMPORT_TX"] = "Import";
  XchainFilterType["EXPORT_TX"] = "Export";
  return XchainFilterType;
}({});
const XchainFilterTxTypeMap = {
  [XchainFilterType.BASE_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_1__.XChainTransactionType.BASE_TX,
  [XchainFilterType.CREATE_ASSET_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_1__.XChainTransactionType.CREATE_ASSET_TX,
  [XchainFilterType.OPERATION_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_1__.XChainTransactionType.OPERATION_TX,
  [XchainFilterType.IMPORT_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_1__.XChainTransactionType.IMPORT_TX,
  [XchainFilterType.EXPORT_TX]: _avalabs_glacier_sdk__WEBPACK_IMPORTED_MODULE_1__.XChainTransactionType.EXPORT_TX
};

/***/ }),

/***/ "./src/utils/bridge/getBridgedAssetSymbol.ts":
/*!***************************************************!*\
  !*** ./src/utils/bridge/getBridgedAssetSymbol.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getBridgedAssetSymbol": () => (/* binding */ getBridgedAssetSymbol)
/* harmony export */ });
/* harmony import */ var _src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Bridge/utils/isUnifiedBridgeTransfer */ "./src/pages/Bridge/utils/isUnifiedBridgeTransfer.ts");

const getBridgedAssetSymbol = tx => {
  if ((0,_src_pages_Bridge_utils_isUnifiedBridgeTransfer__WEBPACK_IMPORTED_MODULE_0__.isUnifiedBridgeTransfer)(tx)) {
    return tx.asset.symbol;
  }
  return tx.symbol;
};

/***/ }),

/***/ "./src/utils/bridgeTransactionUtils.ts":
/*!*********************************************!*\
  !*** ./src/utils/bridgeTransactionUtils.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ETHEREUM_ADDRESS": () => (/* binding */ ETHEREUM_ADDRESS),
/* harmony export */   "isPendingBridgeTransaction": () => (/* binding */ isPendingBridgeTransaction)
/* harmony export */ });
const ETHEREUM_ADDRESS = '0x0000000000000000000000000000000000000000';
function isPendingBridgeTransaction(item) {
  return 'addressBTC' in item || 'sourceChain' in item;
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX01hbGljaW91c1Rva2VuV2FybmluZ190c3gtc3JjX3BhZ2VzX1dhbGxldF9XYWxsZXRSZWNlbnRUeHNfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFJa0M7QUFFM0IsU0FBU0MsY0FBY0EsQ0FBQ0MsSUFBZSxFQUFFO0VBQzlDLE9BQU9BLElBQUksS0FBS0Ysc0VBQWdCLElBQUlFLElBQUksS0FBS0YsdUVBQWlCO0FBQ2hFO0FBRU8sU0FBU0ssS0FBS0EsQ0FBQ0MsS0FBdUIsRUFBZ0M7RUFDM0UsT0FBT0wsY0FBYyxDQUFDSyxLQUFLLENBQUNKLElBQUksQ0FBQztBQUNuQzs7Ozs7Ozs7Ozs7Ozs7O0FDVE8sU0FBU0ssa0JBQWtCQSxDQUNoQ0MsRUFBaUIsRUFHakI7RUFDQSxPQUFPQSxFQUFFLENBQUNDLE1BQU0sS0FBSyxLQUFLLElBQUlELEVBQUUsQ0FBQ0MsTUFBTSxLQUFLLEtBQUs7QUFDbkQ7QUFFTyxTQUFTQyxxQkFBcUJBLENBQ25DRixFQUFpQixFQUN1QjtFQUN4QyxPQUFPQSxFQUFFLENBQUNDLE1BQU0sS0FBSyxLQUFLO0FBQzVCOzs7Ozs7Ozs7Ozs7Ozs7O0FDZjREO0FBRXJELFNBQVNHLGVBQWVBLENBQUNDLE9BQWlCLEVBQUU7RUFDakQsT0FBT0EsT0FBTyxHQUFHQyxlQUFlLENBQUNELE9BQU8sQ0FBQ0UsT0FBTyxDQUFDLEdBQUcsS0FBSztBQUMzRDtBQUVPLFNBQVNELGVBQWVBLENBQUNDLE9BQWUsRUFBRTtFQUMvQyxPQUNFSiw4RUFBd0IsS0FBS0ksT0FBTyxJQUNwQ0osK0VBQXlCLEtBQUtJLE9BQU8sSUFDckNKLCtFQUF5QixLQUFLSSxPQUFPO0FBRXpDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05xQztBQUNVO0FBRTJCO0FBRW5FLE1BQU1VLHdCQUF3QixHQUFJQyxLQUFlLElBQUs7RUFDM0QsTUFBTTtJQUFFQztFQUFFLENBQUMsR0FBR0osNkRBQWMsRUFBRTtF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TTJQLGdCQUFnQixHQUFHLDRDQUE0QztBQUVyRSxTQUFTVCwwQkFBMEJBLENBQ3hDQyxJQUF3RCxFQUNaO0VBQzVDLE9BQU8sWUFBWSxJQUFJQSxJQUFJLElBQUksYUFBYSxJQUFJQSxJQUFJO0FBQ3REIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2JhbGFuY2VzL25mdC91dGlscy9pc05GVC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvaGlzdG9yeS91dGlscy9pc1R4SGlzdG9yeUl0ZW0udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNTb2xhbmFOZXR3b3JrLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vTWFsaWNpb3VzVG9rZW5XYXJuaW5nLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1RydW5jYXRlRmVlQW1vdW50LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3Njcm9sbGJhcnMvU2Nyb2xsYmFycy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9CcmlkZ2UvdXRpbHMvaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9QZXJtaXNzaW9ucy9jb21wb25lbnRzL1dhcm5pbmdCb3gudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvV2FsbGV0L1dhbGxldFJlY2VudFR4cy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvY29tcG9uZW50cy9IaXN0b3J5L2NvbXBvbmVudHMvQWN0aXZpdHlDYXJkL0FjdGl2aXR5Q2FyZC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvY29tcG9uZW50cy9IaXN0b3J5L2NvbXBvbmVudHMvQWN0aXZpdHlDYXJkL0FjdGl2aXR5Q2FyZEFtb3VudC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvY29tcG9uZW50cy9IaXN0b3J5L2NvbXBvbmVudHMvQWN0aXZpdHlDYXJkL0FjdGl2aXR5Q2FyZERldGFpbHMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvV2FsbGV0L2NvbXBvbmVudHMvSGlzdG9yeS9jb21wb25lbnRzL0FjdGl2aXR5Q2FyZC9BY3Rpdml0eUNhcmRJY29uLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1dhbGxldC9jb21wb25lbnRzL0hpc3RvcnkvY29tcG9uZW50cy9BY3Rpdml0eUNhcmQvQWN0aXZpdHlDYXJkU3VtbWFyeS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvY29tcG9uZW50cy9IaXN0b3J5L2NvbXBvbmVudHMvQWN0aXZpdHlDYXJkL1BjaGFpbkFjdGl2aXR5Q2FyZC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvY29tcG9uZW50cy9IaXN0b3J5L2NvbXBvbmVudHMvQWN0aXZpdHlDYXJkL1ByaW1hcnlOZXR3b3JrTWV0aG9kSWNvbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvY29tcG9uZW50cy9IaXN0b3J5L2NvbXBvbmVudHMvQWN0aXZpdHlDYXJkL1hjaGFpbkFjdGl2aXR5Q2FyZC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvY29tcG9uZW50cy9IaXN0b3J5L2NvbXBvbmVudHMvSW5Qcm9ncmVzc0JyaWRnZS9JblByb2dyZXNzQnJpZGdlQWN0aXZpdHlDYXJkLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1dhbGxldC9jb21wb25lbnRzL0hpc3RvcnkvY29tcG9uZW50cy9JblByb2dyZXNzQnJpZGdlL0luUHJvZ3Jlc3NCcmlkZ2VJY29uLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1dhbGxldC9jb21wb25lbnRzL0hpc3RvcnkvdXNlQmxvY2tjaGFpbk5hbWVzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvV2FsbGV0L2NvbXBvbmVudHMvTm9UcmFuc2FjdGlvbnMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvV2FsbGV0L21vZGVscy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL2JyaWRnZS9nZXRCcmlkZ2VkQXNzZXRTeW1ib2wudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9icmlkZ2VUcmFuc2FjdGlvblV0aWxzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIE5mdFRva2VuV2l0aEJhbGFuY2UsXG4gIFRva2VuVHlwZSxcbiAgVG9rZW5XaXRoQmFsYW5jZSxcbn0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTmZ0VG9rZW5UeXBlKHR5cGU6IFRva2VuVHlwZSkge1xuICByZXR1cm4gdHlwZSA9PT0gVG9rZW5UeXBlLkVSQzcyMSB8fCB0eXBlID09PSBUb2tlblR5cGUuRVJDMTE1NTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTkZUKHRva2VuOiBUb2tlbldpdGhCYWxhbmNlKTogdG9rZW4gaXMgTmZ0VG9rZW5XaXRoQmFsYW5jZSB7XG4gIHJldHVybiBpc05mdFRva2VuVHlwZSh0b2tlbi50eXBlKTtcbn1cbiIsImltcG9ydCB7IE5ldHdvcmtWTVR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgVHhIaXN0b3J5SXRlbSB9IGZyb20gJy4uL21vZGVscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05vblhQSGlzdG9yeUl0ZW0oXG4gIHR4OiBUeEhpc3RvcnlJdGVtLFxuKTogdHggaXMgVHhIaXN0b3J5SXRlbTxcbiAgRXhjbHVkZTxOZXR3b3JrVk1UeXBlLCBOZXR3b3JrVk1UeXBlLkFWTSB8IE5ldHdvcmtWTVR5cGUuUFZNPlxuPiB7XG4gIHJldHVybiB0eC52bVR5cGUgIT09ICdBVk0nICYmIHR4LnZtVHlwZSAhPT0gJ1BWTSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BjaGFpblR4SGlzdG9yeUl0ZW0oXG4gIHR4OiBUeEhpc3RvcnlJdGVtLFxuKTogdHggaXMgVHhIaXN0b3J5SXRlbTxOZXR3b3JrVk1UeXBlLlBWTT4ge1xuICByZXR1cm4gdHgudm1UeXBlID09PSAnUFZNJztcbn1cbiIsImltcG9ydCB7IE5ldHdvcmssIENoYWluSWQgfSBmcm9tICdAYXZhbGFicy9jb3JlLWNoYWlucy1zZGsnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTb2xhbmFOZXR3b3JrKG5ldHdvcms/OiBOZXR3b3JrKSB7XG4gIHJldHVybiBuZXR3b3JrID8gaXNTb2xhbmFDaGFpbklkKG5ldHdvcmsuY2hhaW5JZCkgOiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU29sYW5hQ2hhaW5JZChjaGFpbklkOiBudW1iZXIpIHtcbiAgcmV0dXJuIChcbiAgICBDaGFpbklkLlNPTEFOQV9ERVZORVRfSUQgPT09IGNoYWluSWQgfHxcbiAgICBDaGFpbklkLlNPTEFOQV9NQUlOTkVUX0lEID09PSBjaGFpbklkIHx8XG4gICAgQ2hhaW5JZC5TT0xBTkFfVEVTVE5FVF9JRCA9PT0gY2hhaW5JZFxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQWxlcnRUcmlhbmdsZUljb24sXG4gIEJveCxcbiAgQm94UHJvcHMsXG4gIFRvb2x0aXAsXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuaW1wb3J0IHsgV2FybmluZ0JveCB9IGZyb20gJ0BzcmMvcGFnZXMvUGVybWlzc2lvbnMvY29tcG9uZW50cy9XYXJuaW5nQm94JztcblxuZXhwb3J0IGNvbnN0IE1hbGljaW91c1Rva2VuV2FybmluZ0JveCA9IChwcm9wczogQm94UHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPEJveCB7Li4ucHJvcHN9PlxuICAgICAgPFdhcm5pbmdCb3hcbiAgICAgICAgdGl0bGU9e3QoJ01hbGljaW91cyBUb2tlbicpfVxuICAgICAgICB0ZXh0PXt0KFxuICAgICAgICAgICdUaGlzIHRva2VuIGhhcyBiZWVuIGZsYWdnZWQgYXMgbWFsaWNpb3VzLiBVc2UgY2F1dGlvbiB3aGVuIGludGVyYWN0aW5nIHdpdGggaXQuJyxcbiAgICAgICAgKX1cbiAgICAgIC8+XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgTWFsaWNpb3VzVG9rZW5XYXJuaW5nSWNvbiA9ICh7IHNpemUgfTogeyBzaXplPzogbnVtYmVyIH0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8VG9vbHRpcCB0aXRsZT17dCgnVGhpcyB0b2tlbiBoYXMgYmVlbiBmbGFnZ2VkIGFzIG1hbGljaW91cycpfT5cbiAgICAgIDxBbGVydFRyaWFuZ2xlSWNvbiBjb2xvcj17dGhlbWUucGFsZXR0ZS53YXJuaW5nLm1haW59IHNpemU9e3NpemUgPz8gMTZ9IC8+XG4gICAgPC9Ub29sdGlwPlxuICApO1xufTtcbiIsImltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIFRydW5jYXRlRmVlQW1vdW50KHsgYW1vdW50IH06IHsgYW1vdW50OiBzdHJpbmcgfSkge1xuICBjb25zdCBbaW50ZWdlciwgZnJhY3Rpb25dID0gYW1vdW50LnNwbGl0KCcuJyk7XG4gIGlmICghZnJhY3Rpb24gfHwgKGZyYWN0aW9uICYmIGZyYWN0aW9uLmxlbmd0aCA8PSA1KSkge1xuICAgIHJldHVybiAoXG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICBjb21wb25lbnQ9XCJzcGFuXCJcbiAgICAgICAgY29sb3I9XCJ0ZXh0LnByaW1hcnlcIlxuICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgPlxuICAgICAgICB7YW1vdW50fVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICk7XG4gIH1cblxuICBjb25zdCBpbmRleE9mTm9uWmVybyA9IGZyYWN0aW9uPy5zZWFyY2goL1sxLTldLyk7XG4gIGlmIChpbmRleE9mTm9uWmVybyA9PSAtMSkge1xuICAgIHJldHVybiAoXG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICBjb21wb25lbnQ9XCJzcGFuXCJcbiAgICAgICAgY29sb3I9XCJ0ZXh0LnByaW1hcnlcIlxuICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgPlxuICAgICAgICB7aW50ZWdlcn1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICApO1xuICB9XG4gIGNvbnN0IHplcm9Db3VudCA9IGZyYWN0aW9uLnNsaWNlKDAsIGluZGV4T2ZOb25aZXJvKS5sZW5ndGg7XG4gIGlmIChmcmFjdGlvbiAmJiBpbmRleE9mTm9uWmVybykge1xuICAgIHJldHVybiAoXG4gICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGNvbHVtbkdhcDogMCB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgIGNvbXBvbmVudD1cInNwYW5cIlxuICAgICAgICAgIGNvbG9yPVwidGV4dC5wcmltYXJ5XCJcbiAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgICA+XG4gICAgICAgICAge2ludGVnZXJ9LjBcbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHZhcmlhbnQ9XCJvdmVybGluZVwiXG4gICAgICAgICAgY29tcG9uZW50PVwic3BhblwiXG4gICAgICAgICAgY29sb3I9XCJ0ZXh0LnByaW1hcnlcIlxuICAgICAgICAgIHN4PXt7IG10OiAxLCBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3plcm9Db3VudH1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgY29tcG9uZW50PVwic3BhblwiXG4gICAgICAgICAgY29sb3I9XCJ0ZXh0LnByaW1hcnlcIlxuICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnIH19XG4gICAgICAgID5cbiAgICAgICAgICB7ZnJhY3Rpb24uc2xpY2UoaW5kZXhPZk5vblplcm8sIGluZGV4T2ZOb25aZXJvICsgMil9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvU3RhY2s+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxUeXBvZ3JhcGh5XG4gICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgY29tcG9uZW50PVwic3BhblwiXG4gICAgICBjb2xvcj1cInRleHQucHJpbWFyeVwiXG4gICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgID5cbiAgICAgIHthbW91bnR9XG4gICAgPC9UeXBvZ3JhcGh5PlxuICApO1xufVxuIiwiaW1wb3J0ICogYXMgQ3VzdG9tU2Nyb2xsYmFycyBmcm9tICdyZWFjdC1jdXN0b20tc2Nyb2xsYmFycy0yJztcbmltcG9ydCB7IGZvcndhcmRSZWYsIExlZ2FjeVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRoZW1lIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IHR5cGUgU2Nyb2xsYmFyc1JlZiA9IEN1c3RvbVNjcm9sbGJhcnMuU2Nyb2xsYmFycztcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JQZXRoaWNrL3JlYWN0LWN1c3RvbS1zY3JvbGxiYXJzLTIvYmxvYi9tYXN0ZXIvZG9jcy9BUEkubWRcbi8vIGZvciBhdmFpbGFibGUgcHJvcHNcbmV4cG9ydCBjb25zdCBTY3JvbGxiYXJzID0gZm9yd2FyZFJlZihmdW5jdGlvbiBTY3JvbGxiYXJzKFxuICBwcm9wczogQ3VzdG9tU2Nyb2xsYmFycy5TY3JvbGxiYXJQcm9wcyxcbiAgcmVmOiBMZWdhY3lSZWY8U2Nyb2xsYmFyc1JlZj4gfCB1bmRlZmluZWQsXG4pIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCByZW5kZXJUaHVtYiA9ICh7IHN0eWxlLCAuLi5yZXN0IH0pID0+IHtcbiAgICBjb25zdCB0aHVtYlN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODAwXSxcbiAgICAgIGJvcmRlclJhZGl1czogOTk5OSxcbiAgICB9O1xuICAgIHJldHVybiA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLCAuLi50aHVtYlN0eWxlIH19IHsuLi5yZXN0fSAvPjtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxDdXN0b21TY3JvbGxiYXJzLlNjcm9sbGJhcnNcbiAgICAgIHJlbmRlclRodW1iVmVydGljYWw9e3JlbmRlclRodW1ifVxuICAgICAgcmVmPXtyZWZ9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKTtcbn0pO1xuIiwiaW1wb3J0IHsgQnJpZGdlVHJhbnNhY3Rpb24gfSBmcm9tICdAYXZhbGFicy9jb3JlLWJyaWRnZS1zZGsnO1xuaW1wb3J0IHsgQnJpZGdlVHJhbnNmZXIgfSBmcm9tICdAYXZhbGFicy9icmlkZ2UtdW5pZmllZCc7XG5cbmV4cG9ydCBjb25zdCBpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlciA9IChcbiAgdHJhbnNmZXI/OiBCcmlkZ2VUcmFuc2FjdGlvbiB8IEJyaWRnZVRyYW5zZmVyLFxuKTogdHJhbnNmZXIgaXMgQnJpZGdlVHJhbnNmZXIgPT4ge1xuICByZXR1cm4gdHJhbnNmZXIgIT09IHVuZGVmaW5lZCAmJiAndHlwZScgaW4gdHJhbnNmZXI7XG59O1xuIiwiaW1wb3J0IHtcbiAgQWxlcnQsXG4gIEFsZXJ0Q29udGVudCxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG4gIEdwcE1heWJlSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW50ZXJmYWNlIFdhcm5pbmdCb3hQcm9wcyB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdhcm5pbmdCb3goeyB0aXRsZSwgdGV4dCB9OiBXYXJuaW5nQm94UHJvcHMpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICByZXR1cm4gKFxuICAgIDxBbGVydFxuICAgICAgc2V2ZXJpdHk9XCJ3YXJuaW5nXCJcbiAgICAgIGljb249ezxHcHBNYXliZUljb24gc2l6ZT17MjR9IGNvbG9yPXt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja30gLz59XG4gICAgICBzeD17e1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3YXJuaW5nLmxpZ2h0JyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBjb2xvcjogJ2NvbW1vbi5ibGFjaycsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxBbGVydENvbnRlbnQ+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6IDYwMCwgZGlzcGxheTogJ2Jsb2NrJyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3RpdGxlfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgZGlzcGxheTogJ2Jsb2NrJyB9fT5cbiAgICAgICAgICB7dGV4dH1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPC9BbGVydENvbnRlbnQ+XG4gICAgPC9BbGVydD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZVdhbGxldENvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1dhbGxldFByb3ZpZGVyJztcbmltcG9ydCB7IEZyYWdtZW50LCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgU2Nyb2xsYmFycyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vc2Nyb2xsYmFycy9TY3JvbGxiYXJzJztcbmltcG9ydCB7IE5vVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi9jb21wb25lbnRzL05vVHJhbnNhY3Rpb25zJztcbmltcG9ydCB7IGlzU2FtZURheSwgZW5kT2ZZZXN0ZXJkYXksIGVuZE9mVG9kYXksIGZvcm1hdCB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgVHhIaXN0b3J5SXRlbSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9oaXN0b3J5L21vZGVscyc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IGdldEV4cGxvcmVyQWRkcmVzc0J5TmV0d29yayB9IGZyb20gJ0BzcmMvdXRpbHMvZ2V0RXhwbG9yZXJBZGRyZXNzJztcbmltcG9ydCB7IEFjdGl2aXR5Q2FyZCB9IGZyb20gJy4vY29tcG9uZW50cy9IaXN0b3J5L2NvbXBvbmVudHMvQWN0aXZpdHlDYXJkL0FjdGl2aXR5Q2FyZCc7XG5pbXBvcnQgeyBJblByb2dyZXNzQnJpZGdlQWN0aXZpdHlDYXJkIH0gZnJvbSAnLi9jb21wb25lbnRzL0hpc3RvcnkvY29tcG9uZW50cy9JblByb2dyZXNzQnJpZGdlL0luUHJvZ3Jlc3NCcmlkZ2VBY3Rpdml0eUNhcmQnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDaGVja0ljb24sXG4gIENoZXZyb25Eb3duSWNvbixcbiAgQ2hldnJvblVwSWNvbixcbiAgTWVudUl0ZW0sXG4gIE1lbnVMaXN0LFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IGlzTmZ0VG9rZW5UeXBlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2JhbGFuY2VzL25mdC91dGlscy9pc05GVCc7XG5pbXBvcnQgeyB1c2VQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb25zIH0gZnJvbSAnLi4vQnJpZGdlL2hvb2tzL3VzZVBlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgaXNQY2hhaW5UeEhpc3RvcnlJdGVtLFxuICBpc05vblhQSGlzdG9yeUl0ZW0sXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9oaXN0b3J5L3V0aWxzL2lzVHhIaXN0b3J5SXRlbSc7XG5pbXBvcnQgeyBQY2hhaW5BY3Rpdml0eUNhcmQgfSBmcm9tICcuL2NvbXBvbmVudHMvSGlzdG9yeS9jb21wb25lbnRzL0FjdGl2aXR5Q2FyZC9QY2hhaW5BY3Rpdml0eUNhcmQnO1xuaW1wb3J0IHsgaXNQY2hhaW5OZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNBdmFsYW5jaGVQY2hhaW5OZXR3b3JrJztcbmltcG9ydCB7XG4gIFBjaGFpbkZpbHRlclR4VHlwZU1hcCxcbiAgUGNoYWluRmlsdGVyVHlwZSxcbiAgWGNoYWluRmlsdGVyVHhUeXBlTWFwLFxuICBYY2hhaW5GaWx0ZXJUeXBlLFxufSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBpc1hjaGFpbk5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZVhjaGFpbk5ldHdvcmsnO1xuaW1wb3J0IHsgZ2V0QWRkcmVzc0ZvckNoYWluIH0gZnJvbSAnQHNyYy91dGlscy9nZXRBZGRyZXNzRm9yQ2hhaW4nO1xuaW1wb3J0IHsgWGNoYWluQWN0aXZpdHlDYXJkIH0gZnJvbSAnLi9jb21wb25lbnRzL0hpc3RvcnkvY29tcG9uZW50cy9BY3Rpdml0eUNhcmQvWGNoYWluQWN0aXZpdHlDYXJkJztcbmltcG9ydCB7IGdldEJyaWRnZWRBc3NldFN5bWJvbCB9IGZyb20gJ0BzcmMvdXRpbHMvYnJpZGdlL2dldEJyaWRnZWRBc3NldFN5bWJvbCc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbiwgVHJhbnNhY3Rpb25UeXBlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxudHlwZSBXYWxsZXRSZWNlbnRUeHNQcm9wcyA9IHtcbiAgaXNFbWJlZGRlZD86IGJvb2xlYW47XG4gIHRva2VuU3ltYm9sRmlsdGVyPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IGVudW0gRmlsdGVyVHlwZSB7XG4gIEFMTCA9ICdBbGwnLFxuICBCUklER0UgPSAnQnJpZGdlJyxcbiAgSU5DT01JTkcgPSAnSW5jb21pbmcnLFxuICBPVVRHT0lORyA9ICdPdXRnb2luZycsXG4gIENPTlRSQUNUX0NBTEwgPSAnQ29udHJhY3QgQ2FsbCcsXG4gIFNXQVAgPSAnU3dhcCcsXG4gIE5GVFMgPSAnTkZUcycsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXYWxsZXRSZWNlbnRUeHMoe1xuICBpc0VtYmVkZGVkID0gZmFsc2UsXG4gIHRva2VuU3ltYm9sRmlsdGVyLFxufTogV2FsbGV0UmVjZW50VHhzUHJvcHMpIHtcbiAgY29uc3QgeyB0LCBpMThuIH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCBGaWx0ZXJJdGVtcyA9IHtcbiAgICBbRmlsdGVyVHlwZS5BTExdOiB0KCdBbGwnKSxcbiAgICBbRmlsdGVyVHlwZS5CUklER0VdOiB0KCdCcmlkZ2UnKSxcbiAgICBbRmlsdGVyVHlwZS5TV0FQXTogdCgnU3dhcCcpLFxuICAgIFtGaWx0ZXJUeXBlLk5GVFNdOiB0KCdORlRzJyksXG4gICAgW0ZpbHRlclR5cGUuQ09OVFJBQ1RfQ0FMTF06IHQoJ0NvbnRyYWN0IENhbGwnKSxcbiAgICBbRmlsdGVyVHlwZS5JTkNPTUlOR106IHQoJ0luY29taW5nJyksXG4gICAgW0ZpbHRlclR5cGUuT1VUR09JTkddOiB0KCdPdXRnb2luZycpLFxuICB9O1xuXG4gIGNvbnN0IFBjaGFpbkZpbHRlckl0ZW1zID0ge1xuICAgIFtQY2hhaW5GaWx0ZXJUeXBlLkFMTF06IHQoJ0FsbCcpLFxuICAgIFtQY2hhaW5GaWx0ZXJUeXBlLklOQ09NSU5HXTogdCgnSW5jb21pbmcnKSxcbiAgICBbUGNoYWluRmlsdGVyVHlwZS5PVVRHT0lOR106IHQoJ091dGdvaW5nJyksXG4gICAgW1BjaGFpbkZpbHRlclR5cGUuQUREX0RFTEVHQVRPUl9UWF06IHQoJ0FkZCBEZWxlZ2F0b3InKSxcbiAgICBbUGNoYWluRmlsdGVyVHlwZS5BRERfU1VCTkVUX1ZBTElEQVRPUl9UWF06IHQoJ0FkZCBTdWJuZXQgVmFsaWRhdG9yJyksXG4gICAgW1BjaGFpbkZpbHRlclR5cGUuQUREX1BFUk1JU1NJT05MRVNTX1ZBTElEQVRPUl9UWF06IHQoXG4gICAgICAnQWRkIFBlcm1pc3Npb25sZXNzIFZhbGlkYXRvcicsXG4gICAgKSxcbiAgICBbUGNoYWluRmlsdGVyVHlwZS5BRERfUEVSTUlTU0lPTkxFU1NfREVMRUdBVE9SX1RYXTogdChcbiAgICAgICdBZGQgUGVybWlzc2lvbmxlc3MgRGVsZWdhdG9yJyxcbiAgICApLFxuICAgIFtQY2hhaW5GaWx0ZXJUeXBlLkFERF9WQUxJREFUT1JfVFhdOiB0KCdBZGQgVmFsaWRhdG9yJyksXG4gICAgW1BjaGFpbkZpbHRlclR5cGUuQURWQU5DRV9USU1FX1RYXTogdCgnQWR2YW5jZSBUaW1lJyksXG4gICAgW1BjaGFpbkZpbHRlclR5cGUuQkFTRV9UWF06IHQoJ0Jhc2VUeCcpLFxuICAgIFtQY2hhaW5GaWx0ZXJUeXBlLkNSRUFURV9DSEFJTl9UWF06IHQoJ0NyZWF0ZSBDaGFpbicpLFxuICAgIFtQY2hhaW5GaWx0ZXJUeXBlLkNSRUFURV9TVUJORVRfVFhdOiB0KCdDcmVhdGUgU3VibmV0JyksXG4gICAgW1BjaGFpbkZpbHRlclR5cGUuRVhQT1JUX1RYXTogdCgnRXhwb3J0JyksXG4gICAgW1BjaGFpbkZpbHRlclR5cGUuSU1QT1JUX1RYXTogdCgnSW1wb3J0JyksXG4gICAgW1BjaGFpbkZpbHRlclR5cGUuUkVXQVJEX1ZBTElEQVRPUl9UWF06IHQoJ1Jld2FyZCBWYWxpZGF0b3InKSxcbiAgICBbUGNoYWluRmlsdGVyVHlwZS5SRU1PVkVfU1VCTkVUX1ZBTElEQVRPUl9UWF06IHQoJ1JlbW92ZSBTdWJuZXQgVmFsaWRhdG9yJyksXG4gICAgW1BjaGFpbkZpbHRlclR5cGUuVFJBTlNGRVJfU1VCTkVUX09XTkVSU0hJUF9UWF06IHQoXG4gICAgICAnVHJhbnNmZXIgU3VibmV0IE93bmVyc2hpcCcsXG4gICAgKSxcbiAgICBbUGNoYWluRmlsdGVyVHlwZS5UUkFOU0ZPUk1fU1VCTkVUX1RYXTogdCgnVHJhbnNmb3JtIFN1Ym5ldCcpLFxuICB9O1xuXG4gIGNvbnN0IFhjaGFpbkZpbHRlckl0ZW1zID0ge1xuICAgIFtYY2hhaW5GaWx0ZXJUeXBlLkFMTF06IHQoJ0FsbCcpLFxuICAgIFtYY2hhaW5GaWx0ZXJUeXBlLklOQ09NSU5HXTogdCgnSW5jb21pbmcnKSxcbiAgICBbWGNoYWluRmlsdGVyVHlwZS5PVVRHT0lOR106IHQoJ091dGdvaW5nJyksXG4gICAgW1hjaGFpbkZpbHRlclR5cGUuQkFTRV9UWF06IHQoJ0Jhc2VUeCcpLFxuICAgIFtYY2hhaW5GaWx0ZXJUeXBlLkNSRUFURV9BU1NFVF9UWF06IHQoJ0NyZWF0ZSBBc3NldCcpLFxuICAgIFtYY2hhaW5GaWx0ZXJUeXBlLk9QRVJBVElPTl9UWF06IHQoJ09wZXJhdGlvbicpLFxuICAgIFtYY2hhaW5GaWx0ZXJUeXBlLklNUE9SVF9UWF06IHQoJ0ltcG9ydCcpLFxuICAgIFtYY2hhaW5GaWx0ZXJUeXBlLkVYUE9SVF9UWF06IHQoJ0V4cG9ydCcpLFxuICB9O1xuXG4gIGNvbnN0IHsgZ2V0VHJhbnNhY3Rpb25IaXN0b3J5IH0gPSB1c2VXYWxsZXRDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IFtzaG93RmlsdGVyTWVudSwgc2V0U2hvd0ZpbHRlck1lbnVdID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIGNvbnN0IHllc3RlcmRheSA9IGVuZE9mWWVzdGVyZGF5KCk7XG4gIGNvbnN0IHRvZGF5ID0gZW5kT2ZUb2RheSgpO1xuICBjb25zdCBbdW5maWx0ZXJlZFR4SGlzdG9yeSwgc2V0VW5maWx0ZXJlZFR4SGlzdG9yeV0gPSB1c2VTdGF0ZTxcbiAgICBUeEhpc3RvcnlJdGVtW11cbiAgPihbXSk7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcblxuICBjb25zdCBbc2VsZWN0ZWRGaWx0ZXIsIHNldFNlbGVjdGVkRmlsdGVyXSA9IHVzZVN0YXRlPFxuICAgIEZpbHRlclR5cGUgfCBQY2hhaW5GaWx0ZXJUeXBlIHwgWGNoYWluRmlsdGVyVHlwZVxuICA+KFxuICAgIGlzUGNoYWluTmV0d29yayhuZXR3b3JrKVxuICAgICAgPyBQY2hhaW5GaWx0ZXJUeXBlLkFMTFxuICAgICAgOiBpc1hjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgPyBYY2hhaW5GaWx0ZXJUeXBlLkFMTFxuICAgICAgICA6IEZpbHRlclR5cGUuQUxMLFxuICApO1xuXG4gIC8qXG4gICAqIElmIGEgdG9rZW5TeW1ib2xGaWx0ZXIgZXhpc3RzLCB3ZSBuZWVkIHRvIGZpbHRlciBvdXQgdGhlIGJyaWRnZVxuICAgKiB0cmFuc2FjdGlvbnMgdG8gb25seSBzaG93IHRoZSBicmlkZ2UgdHJhbnNhY3Rpb25zIGZvciB0aGUgdG9rZW4gYmVpbmcgdmlld2VkLlxuICAgKiBJZiB0aGVyZSBpcyBubyB0b2tlblN5bWJvbEZpbHRlciwgdGhlbiB3ZSBqdXN0IHJldHVybiBhbGwgdGhlIGN1cnJlbnQgYnJpZGdlIHRyYW5zYWN0aW9uc1xuICAgKiBiZWNhdXNlIGl0cyBwcm9iYWJseSBiZWluZyByZW5kZXJlZCBpbiB0aGUgYWxsIGFjdGl2aXR5IGxpc3QuXG4gICAqL1xuICBjb25zdCBicmlkZ2VUcmFuc2FjdGlvbnMgPSB1c2VQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb25zKCk7XG5cbiAgY29uc3QgZmlsdGVyZWRCcmlkZ2VUcmFuc2FjdGlvbnMgPSB0b2tlblN5bWJvbEZpbHRlclxuICAgID8gT2JqZWN0LnZhbHVlcyhicmlkZ2VUcmFuc2FjdGlvbnMpLmZpbHRlcihcbiAgICAgICAgKHR4KSA9PiBnZXRCcmlkZ2VkQXNzZXRTeW1ib2wodHgpID09PSB0b2tlblN5bWJvbEZpbHRlcixcbiAgICAgIClcbiAgICA6IGJyaWRnZVRyYW5zYWN0aW9ucztcblxuICAvKipcbiAgICogV2hlbiBuZXR3b3JrLCBhZGRyZXNzZXMsIG9yIHJlY2VudFR4SGlzdG9yeSBjaGFuZ2VzLCBuZXcgaGlzdG9yeSBnZXRzIGZldGNoZWQuXG4gICAqIEJ1dCByZWNlbnRUeEhpc3Rvcnkgd2lsbCBiZSByZW1vdmVkIHNvb24uXG4gICAqIFRPRE86IFJlcGxhY2UgcmVjZW50VHhIaXN0b3J5IHdpdGggZGF0YSB3ZSB3aWxsIGJlIGdldHRpbmcgZnJvbSBiYWxhbmNlIHNlcnZpY2VcbiAgICovXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICBnZXRUcmFuc2FjdGlvbkhpc3RvcnkoKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICBzZXRVbmZpbHRlcmVkVHhIaXN0b3J5KHJlc3VsdCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgc2V0VW5maWx0ZXJlZFR4SGlzdG9yeShbXSk7XG4gICAgICB9KVxuICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgIH0pO1xuICB9LCBbbmV0d29yaywgYWN0aXZlQWNjb3VudCwgZ2V0VHJhbnNhY3Rpb25IaXN0b3J5XSk7XG5cbiAgY29uc3QgZXhwbG9yZXJVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIW5ldHdvcmsgfHwgIWFjdGl2ZUFjY291bnQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgYWRkcmVzcyA9IGdldEFkZHJlc3NGb3JDaGFpbihuZXR3b3JrLCBhY3RpdmVBY2NvdW50KTtcblxuICAgIC8vIFNvbWUgV2FsbGV0Q29ubmVjdCBhY2NvdW50cyBtYXkgY29tZSB3aXRob3V0IHRoZSBCVEMgYWRkcmVzcy5cbiAgICBpZiAoIWFkZHJlc3MpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldEV4cGxvcmVyQWRkcmVzc0J5TmV0d29yayhuZXR3b3JrLCBhZGRyZXNzLCAnYWRkcmVzcycpO1xuICB9LCBbbmV0d29yaywgYWN0aXZlQWNjb3VudF0pO1xuXG4gIGNvbnN0IGJhc2VGaWx0ZXJlZFR4SGlzdG9yeSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGZ1bmN0aW9uIGlzUGVuZGluZ0JyaWRnZSh0eDogVHhIaXN0b3J5SXRlbSkge1xuICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYnJpZGdlVHJhbnNhY3Rpb25zKS5zb21lKFxuICAgICAgICAoYnJpZGdlKSA9PlxuICAgICAgICAgIGJyaWRnZS5zb3VyY2VUeEhhc2ggPT09IHR4Lmhhc2ggfHxcbiAgICAgICAgICAoISFicmlkZ2UudGFyZ2V0VHhIYXNoICYmIGJyaWRnZS50YXJnZXRUeEhhc2ggPT09IHR4Lmhhc2gpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG91bGRUeEJlS2VwdCh0eDogVHhIaXN0b3J5SXRlbSkge1xuICAgICAgaWYgKFxuICAgICAgICBpc05vblhQSGlzdG9yeUl0ZW0odHgpICYmXG4gICAgICAgIHR4LmJyaWRnZUFuYWx5c2lzLmlzQnJpZGdlVHggJiZcbiAgICAgICAgaXNQZW5kaW5nQnJpZGdlKHR4KVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiB1bmZpbHRlcmVkVHhIaXN0b3J5XG4gICAgICAuZmlsdGVyKCh0eCkgPT4ge1xuICAgICAgICBpZiAodG9rZW5TeW1ib2xGaWx0ZXIgJiYgaXNOb25YUEhpc3RvcnlJdGVtKHR4KSkge1xuICAgICAgICAgIHJldHVybiB0b2tlblN5bWJvbEZpbHRlciA9PT0gdHgudG9rZW5zPy5bMF0/LnN5bWJvbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoKHR4KSA9PiBzaG91bGRUeEJlS2VwdCh0eCkpO1xuICB9LCBbdW5maWx0ZXJlZFR4SGlzdG9yeSwgYnJpZGdlVHJhbnNhY3Rpb25zLCB0b2tlblN5bWJvbEZpbHRlcl0pO1xuXG4gIGZ1bmN0aW9uIHR4SGlzdG9yeUl0ZW1GaWx0ZXIoXG4gICAgdHg6IFR4SGlzdG9yeUl0ZW0sXG4gICAgZmlsdGVyOiBGaWx0ZXJUeXBlIHwgUGNoYWluRmlsdGVyVHlwZSB8IFhjaGFpbkZpbHRlclR5cGUsXG4gICkge1xuICAgIGlmIChmaWx0ZXIgPT09IEZpbHRlclR5cGUuQUxMKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpbHRlciA9PT0gRmlsdGVyVHlwZS5CUklER0UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHR4LnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkJSSURHRSB8fCB0eC5icmlkZ2VBbmFseXNpcy5pc0JyaWRnZVR4XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyID09PSBGaWx0ZXJUeXBlLlNXQVApIHtcbiAgICAgIHJldHVybiB0eC50eFR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5TV0FQO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyID09PSBGaWx0ZXJUeXBlLkNPTlRSQUNUX0NBTEwpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHR4LmlzQ29udHJhY3RDYWxsICYmXG4gICAgICAgICF0eC5icmlkZ2VBbmFseXNpcy5pc0JyaWRnZVR4ICYmXG4gICAgICAgIHR4LnR4VHlwZSAhPT0gVHJhbnNhY3Rpb25UeXBlLlNXQVBcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIgPT09IEZpbHRlclR5cGUuSU5DT01JTkcpIHtcbiAgICAgIHJldHVybiB0eC5pc0luY29taW5nO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyID09PSBGaWx0ZXJUeXBlLk9VVEdPSU5HKSB7XG4gICAgICByZXR1cm4gdHguaXNPdXRnb2luZztcbiAgICB9IGVsc2UgaWYgKGZpbHRlciA9PT0gRmlsdGVyVHlwZS5ORlRTKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0eC50eFR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5ORlRfQlVZIHx8XG4gICAgICAgICgodHgudHhUeXBlID09PSBUcmFuc2FjdGlvblR5cGUuVFJBTlNGRVIgfHxcbiAgICAgICAgICB0eC50eFR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5ORlRfUkVDRUlWRSB8fFxuICAgICAgICAgIHR4LnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlVOS05PV04pICYmXG4gICAgICAgICAgdHgudG9rZW5zWzBdICYmXG4gICAgICAgICAgaXNOZnRUb2tlblR5cGUodHgudG9rZW5zWzBdLnR5cGUpKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBjaGFpblR4SGlzdG9yeUl0ZW1GaWx0ZXIoXG4gICAgdHg6IFR4SGlzdG9yeUl0ZW0sXG4gICAgZmlsdGVyOiBGaWx0ZXJUeXBlIHwgUGNoYWluRmlsdGVyVHlwZSB8IFhjaGFpbkZpbHRlclR5cGUsXG4gICkge1xuICAgIGlmIChmaWx0ZXIgPT09IFBjaGFpbkZpbHRlclR5cGUuQUxMKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpbHRlciA9PT0gUGNoYWluRmlsdGVyVHlwZS5JTkNPTUlORykge1xuICAgICAgcmV0dXJuICF0eC5pc1NlbmRlcjtcbiAgICB9XG4gICAgaWYgKGZpbHRlciA9PT0gUGNoYWluRmlsdGVyVHlwZS5PVVRHT0lORykge1xuICAgICAgcmV0dXJuIHR4LmlzU2VuZGVyO1xuICAgIH1cbiAgICBjb25zdCB0eXBlQmFzZWRPbkZpbHRlciA9IFBjaGFpbkZpbHRlclR4VHlwZU1hcFtmaWx0ZXJdO1xuXG4gICAgaWYgKHR5cGVCYXNlZE9uRmlsdGVyKSB7XG4gICAgICByZXR1cm4gdHgudHhUeXBlID09PSB0eXBlQmFzZWRPbkZpbHRlcjtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiB4Y2hhaW5UeEhpc3RvcnlJdGVtRmlsdGVyKFxuICAgIHR4OiBUcmFuc2FjdGlvbixcbiAgICBmaWx0ZXI6IEZpbHRlclR5cGUgfCBQY2hhaW5GaWx0ZXJUeXBlIHwgWGNoYWluRmlsdGVyVHlwZSxcbiAgKSB7XG4gICAgaWYgKGZpbHRlciA9PT0gWGNoYWluRmlsdGVyVHlwZS5BTEwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmlsdGVyID09PSBYY2hhaW5GaWx0ZXJUeXBlLklOQ09NSU5HKSB7XG4gICAgICByZXR1cm4gIXR4LmlzU2VuZGVyO1xuICAgIH1cbiAgICBpZiAoZmlsdGVyID09PSBYY2hhaW5GaWx0ZXJUeXBlLk9VVEdPSU5HKSB7XG4gICAgICByZXR1cm4gdHguaXNTZW5kZXI7XG4gICAgfVxuICAgIGNvbnN0IHR5cGVCYXNlZE9uRmlsdGVyID0gWGNoYWluRmlsdGVyVHhUeXBlTWFwW2ZpbHRlcl07XG5cbiAgICBpZiAodHlwZUJhc2VkT25GaWx0ZXIpIHtcbiAgICAgIHJldHVybiB0eC50eFR5cGUgPT09IHR5cGVCYXNlZE9uRmlsdGVyO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGZpbHRlcmVkVHhIaXN0b3J5ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgZnVuY3Rpb24gc2hvdWxkVHhCZUtlcHQoXG4gICAgICB0eDogVHhIaXN0b3J5SXRlbSxcbiAgICAgIGZpbHRlcjogRmlsdGVyVHlwZSB8IFBjaGFpbkZpbHRlclR5cGUgfCBYY2hhaW5GaWx0ZXJUeXBlLFxuICAgICkge1xuICAgICAgaWYgKGlzTm9uWFBIaXN0b3J5SXRlbSh0eCkpIHtcbiAgICAgICAgcmV0dXJuIHR4SGlzdG9yeUl0ZW1GaWx0ZXIodHgsIGZpbHRlcik7XG4gICAgICB9IGVsc2UgaWYgKGlzUGNoYWluVHhIaXN0b3J5SXRlbSh0eCkpIHtcbiAgICAgICAgcmV0dXJuIHBjaGFpblR4SGlzdG9yeUl0ZW1GaWx0ZXIodHgsIGZpbHRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geGNoYWluVHhIaXN0b3J5SXRlbUZpbHRlcih0eCwgZmlsdGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmFzZUZpbHRlcmVkVHhIaXN0b3J5LmZpbHRlcigodHgpID0+XG4gICAgICBzaG91bGRUeEJlS2VwdCh0eCwgc2VsZWN0ZWRGaWx0ZXIpLFxuICAgICk7XG4gIH0sIFtiYXNlRmlsdGVyZWRUeEhpc3RvcnksIHNlbGVjdGVkRmlsdGVyXSk7XG5cbiAgY29uc3QgZ2V0RGF5U3RyaW5nID0gKHRpbWVzdGFtcDogc3RyaW5nIHwgbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG4gICAgY29uc3QgaXNUb2RheSA9IGlzU2FtZURheSh0b2RheSwgZGF0ZSk7XG4gICAgY29uc3QgaXNZZXN0ZXJkYXkgPSBpc1NhbWVEYXkoeWVzdGVyZGF5LCBkYXRlKTtcblxuICAgIHJldHVybiBpc1RvZGF5XG4gICAgICA/IHQoJ1RvZGF5JylcbiAgICAgIDogaXNZZXN0ZXJkYXlcbiAgICAgICAgPyB0KCdZZXN0ZXJkYXknKVxuICAgICAgICA6IGkxOG4ubGFuZ3VhZ2UgPT09ICdlbidcbiAgICAgICAgICA/IGZvcm1hdChkYXRlLCAnTU1NTSBkbycpXG4gICAgICAgICAgOiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChpMThuLmxhbmd1YWdlLCB7XG4gICAgICAgICAgICAgIG1vbnRoOiAnbG9uZycsXG4gICAgICAgICAgICAgIGRheTogJzItZGlnaXQnLFxuICAgICAgICAgICAgfSkuZm9ybWF0KGRhdGUpO1xuICB9O1xuXG4gIGNvbnN0IEZpbHRlckl0ZW0gPSAoeyBrZXlOYW1lLCBvbkNsaWNrIH0pID0+IHtcbiAgICBmdW5jdGlvbiBvbkNsaWNrSGFuZGxlcigpIHtcbiAgICAgIG9uQ2xpY2soa2V5TmFtZSk7XG4gICAgfVxuICAgIGNvbnN0IGxhYmVsID0gaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspXG4gICAgICA/IFBjaGFpbkZpbHRlckl0ZW1zW2tleU5hbWVdXG4gICAgICA6IGlzWGNoYWluTmV0d29yayhuZXR3b3JrKVxuICAgICAgICA/IFhjaGFpbkZpbHRlckl0ZW1zW2tleU5hbWVdXG4gICAgICAgIDogRmlsdGVySXRlbXNba2V5TmFtZV07XG4gICAgcmV0dXJuIChcbiAgICAgIDxNZW51SXRlbVxuICAgICAgICBkaXNhYmxlUmlwcGxlXG4gICAgICAgIG9uQ2xpY2s9e29uQ2xpY2tIYW5kbGVyfVxuICAgICAgICBzeD17eyBoZWlnaHQ6IDMyLCBtaW5IZWlnaHQ6IDMyIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgc3g9e3sgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX1cbiAgICAgICAgICAgIHRpdGxlPXtsYWJlbH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIHtzZWxlY3RlZEZpbHRlciA9PT0ga2V5TmFtZSAmJiA8Q2hlY2tJY29uIHNpemU9ezEyfSAvPn1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvTWVudUl0ZW0+XG4gICAgKTtcbiAgfTtcblxuICBmdW5jdGlvbiBoYW5kbGVGaWx0ZXJDaGFuZ2Uoa2V5TmFtZSkge1xuICAgIHNldFNlbGVjdGVkRmlsdGVyKGtleU5hbWUpO1xuICAgIHNldFNob3dGaWx0ZXJNZW51KGZhbHNlKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFNjcm9sbGJhcnMgc3R5bGU9e3sgZmxleEdyb3c6IDEsIG1heEhlaWdodDogJ3Vuc2V0JywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3sgZmxleEdyb3c6IDEsIHA6IGlzRW1iZWRkZWQgPyAnMCcgOiAnNHB4IDE2cHggNjhweCcsIHJvd0dhcDogMSB9fVxuICAgICAgPlxuICAgICAgICB7YmFzZUZpbHRlcmVkVHhIaXN0b3J5Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9eyh0aGVtZSkgPT4gKHtcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHJpZ2h0OiB0aGVtZS5zcGFjaW5nKDIpLFxuICAgICAgICAgICAgICB0b3A6IHRoZW1lLnNwYWNpbmcoMSksXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFNob3dGaWx0ZXJNZW51KCFzaG93RmlsdGVyTWVudSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZmlsdGVyLWFjdGl2aXR5LW1lbnVcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgbTogJzAgOHB4IDAgNXB4JyxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0TWVkaXVtJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoJ0Rpc3BsYXknKX06eycgJ31cbiAgICAgICAgICAgICAgICB7aXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspXG4gICAgICAgICAgICAgICAgICA/IFBjaGFpbkZpbHRlckl0ZW1zW3NlbGVjdGVkRmlsdGVyXVxuICAgICAgICAgICAgICAgICAgOiBpc1hjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgICAgICAgICAgICAgPyBYY2hhaW5GaWx0ZXJJdGVtc1tzZWxlY3RlZEZpbHRlcl1cbiAgICAgICAgICAgICAgICAgICAgOiBGaWx0ZXJJdGVtc1tzZWxlY3RlZEZpbHRlcl19XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAge3Nob3dGaWx0ZXJNZW51ID8gKFxuICAgICAgICAgICAgICAgIDxDaGV2cm9uVXBJY29uIHNpemU9ezIwfSAvPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxDaGV2cm9uRG93bkljb24gc2l6ZT17MjB9IC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAge3Nob3dGaWx0ZXJNZW51ICYmIChcbiAgICAgICAgICAgICAgPE1lbnVMaXN0XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJmaWx0ZXItYWN0aXZpdHktb3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAyNDAsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtc3RhcnQnLFxuICAgICAgICAgICAgICAgICAgekluZGV4OiAxLFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxTY3JvbGxiYXJzXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBmbGV4R3JvdzogMSwgbWF4SGVpZ2h0OiAndW5zZXQnLCBoZWlnaHQ6ICcxMDAlJyB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtPYmplY3Qua2V5cyhcbiAgICAgICAgICAgICAgICAgICAgaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspXG4gICAgICAgICAgICAgICAgICAgICAgPyBQY2hhaW5GaWx0ZXJJdGVtc1xuICAgICAgICAgICAgICAgICAgICAgIDogaXNYY2hhaW5OZXR3b3JrKG5ldHdvcmspXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFhjaGFpbkZpbHRlckl0ZW1zXG4gICAgICAgICAgICAgICAgICAgICAgICA6IEZpbHRlckl0ZW1zLFxuICAgICAgICAgICAgICAgICAgKS5tYXAoKGZpbHRlckl0ZW0pID0+IChcbiAgICAgICAgICAgICAgICAgICAgPEZpbHRlckl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e2ZpbHRlckl0ZW19XG4gICAgICAgICAgICAgICAgICAgICAga2V5TmFtZT17ZmlsdGVySXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVGaWx0ZXJDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L1Njcm9sbGJhcnM+XG4gICAgICAgICAgICAgIDwvTWVudUxpc3Q+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICl9XG5cbiAgICAgICAge2ZpbHRlcmVkVHhIaXN0b3J5Lmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICA8Tm9UcmFuc2FjdGlvbnMgbG9hZGluZz17bG9hZGluZ30gLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAge2JyaWRnZVRyYW5zYWN0aW9ucyAmJlxuICAgICAgICAgICAgICBPYmplY3QudmFsdWVzKGZpbHRlcmVkQnJpZGdlVHJhbnNhY3Rpb25zKS5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgIChzZWxlY3RlZEZpbHRlciA9PT0gJ0FsbCcgfHwgc2VsZWN0ZWRGaWx0ZXIgPT09ICdCcmlkZ2UnKSAmJiAoXG4gICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgbTogJzhweCAwIDEzcHgnLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dCgnUGVuZGluZycpfVxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuXG4gICAgICAgICAgICAgICAgICB7T2JqZWN0LnZhbHVlcyhmaWx0ZXJlZEJyaWRnZVRyYW5zYWN0aW9ucykubWFwKCh0eCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8SW5Qcm9ncmVzc0JyaWRnZUFjdGl2aXR5Q2FyZFxuICAgICAgICAgICAgICAgICAgICAgIGtleT17YCR7dHguc291cmNlVHhIYXNofS0ke2l9YH1cbiAgICAgICAgICAgICAgICAgICAgICB0eD17dHh9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAge2ZpbHRlcmVkVHhIaXN0b3J5Lm1hcCgodHgsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzVHggPSBmaWx0ZXJlZFR4SGlzdG9yeVtpbmRleCAtIDFdO1xuICAgICAgICAgICAgICBjb25zdCBpc05ld0RheSA9XG4gICAgICAgICAgICAgICAgaW5kZXggPT09IDAgfHxcbiAgICAgICAgICAgICAgICAhcHJldmlvdXNUeCB8fFxuICAgICAgICAgICAgICAgICFpc1NhbWVEYXkoXG4gICAgICAgICAgICAgICAgICBuZXcgRGF0ZSh0eC50aW1lc3RhbXApLFxuICAgICAgICAgICAgICAgICAgbmV3IERhdGUocHJldmlvdXNUeC50aW1lc3RhbXApLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEZyYWdtZW50IGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICAgICAge2lzTmV3RGF5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbj17aW5kZXggPT09IDAgPyAnOHB4IDAgMTNweCcgOiAnOHB4IDAnfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge2dldERheVN0cmluZyh0eC50aW1lc3RhbXApfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAge2lzTm9uWFBIaXN0b3J5SXRlbSh0eCkgPyAoXG4gICAgICAgICAgICAgICAgICAgIDxBY3Rpdml0eUNhcmQgaGlzdG9yeUl0ZW09e3R4fSAvPlxuICAgICAgICAgICAgICAgICAgKSA6IGlzUGNoYWluVHhIaXN0b3J5SXRlbSh0eCkgPyAoXG4gICAgICAgICAgICAgICAgICAgIDxQY2hhaW5BY3Rpdml0eUNhcmQgaGlzdG9yeUl0ZW09e3R4fSAvPlxuICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgPFhjaGFpbkFjdGl2aXR5Q2FyZCBoaXN0b3J5SXRlbT17dHh9IC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cbiAgICAgICAge2V4cGxvcmVyVXJsICYmICFsb2FkaW5nICYmICEhZmlsdGVyZWRUeEhpc3RvcnkubGVuZ3RoICYmIChcbiAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIHdpZHRoOiAnMTAwJScsIHB4OiAyLCBteTogMiB9fT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhZGQtYWNjb3VudC1idXR0b25cIlxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGV4cGxvcmVyVXJsLCAnX2JsYW5rJywgJ25vcmVmZXJyZXInKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1ZpZXcgb24gZXhwbG9yZXInKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU2Nyb2xsYmFycz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHNhdG9zaGlUb0J0YyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQge1xuICBDYXJkLFxuICBDaGV2cm9uRG93bkljb24sXG4gIENoZXZyb25VcEljb24sXG4gIERpdmlkZXIsXG4gIEV4dGVybmFsTGlua0ljb24sXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFRva2VuVW5pdCwgd2VpVG9BdmF4IH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IHsgaXNOZnRUb2tlblR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvbmZ0L3V0aWxzL2lzTkZUJztcbmltcG9ydCB7IFR4SGlzdG9yeUl0ZW0gfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvaGlzdG9yeS9tb2RlbHMnO1xuaW1wb3J0IHsgaXNTb2xhbmFOZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNTb2xhbmFOZXR3b3JrJztcbmltcG9ydCB7IGlzQml0Y29pbk5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0JpdGNvaW5OZXR3b3JrJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IEJpZyBmcm9tICdiaWcuanMnO1xuaW1wb3J0IHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgQWN0aXZpdHlDYXJkQW1vdW50IH0gZnJvbSAnLi9BY3Rpdml0eUNhcmRBbW91bnQnO1xuaW1wb3J0IHsgQWN0aXZpdHlDYXJkRGV0YWlscyB9IGZyb20gJy4vQWN0aXZpdHlDYXJkRGV0YWlscyc7XG5pbXBvcnQgeyBBY3Rpdml0eUNhcmRJY29uIH0gZnJvbSAnLi9BY3Rpdml0eUNhcmRJY29uJztcbmltcG9ydCB7IEFjdGl2aXR5Q2FyZFN1bW1hcnkgfSBmcm9tICcuL0FjdGl2aXR5Q2FyZFN1bW1hcnknO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb25UeXBlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IFRydW5jYXRlRmVlQW1vdW50IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9UcnVuY2F0ZUZlZUFtb3VudCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0aXZpdHlDYXJkUHJvcCB7XG4gIGhpc3RvcnlJdGVtOiBUeEhpc3RvcnlJdGVtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWN0aXZpdHlDYXJkKHsgaGlzdG9yeUl0ZW0gfTogQWN0aXZpdHlDYXJkUHJvcCkge1xuICBjb25zdCB7IG5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IFtzaG93RGV0YWlscywgc2V0U2hvd0RldGFpbHNdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcblxuICBjb25zdCBzaG93RGV0YWlsc09wdGlvbiA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChcbiAgICAgIGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlNXQVAgfHxcbiAgICAgIGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLk5GVF9CVVkgfHxcbiAgICAgIGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLk5GVF9SRUNFSVZFIHx8XG4gICAgICBoaXN0b3J5SXRlbS50eFR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5ORlRfU0VORCB8fFxuICAgICAgKGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlNFTkQgJiZcbiAgICAgICAgaGlzdG9yeUl0ZW0udG9rZW5zWzBdPy50eXBlID09PSAnRVJDMTE1NScpIHx8XG4gICAgICAoKGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlRSQU5TRkVSIHx8XG4gICAgICAgIGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlVOS05PV04pICYmXG4gICAgICAgIGhpc3RvcnlJdGVtLnRva2Vuc1swXSAmJlxuICAgICAgICBpc05mdFRva2VuVHlwZShoaXN0b3J5SXRlbS50b2tlbnNbMF0udHlwZSkpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LCBbaGlzdG9yeUl0ZW1dKTtcblxuICBjb25zdCBnYXNEaXNwbGF5QW1vdW50ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKG5ldHdvcmsgJiYgaXNCaXRjb2luTmV0d29yayhuZXR3b3JrKSkge1xuICAgICAgcmV0dXJuIHNhdG9zaGlUb0J0YyhOdW1iZXIoaGlzdG9yeUl0ZW0uZ2FzVXNlZCkpLnRvRml4ZWQoNikudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKG5ldHdvcmsgJiYgaXNTb2xhbmFOZXR3b3JrKG5ldHdvcmspKSB7XG4gICAgICBjb25zdCB1bml0ID0gbmV3IFRva2VuVW5pdChcbiAgICAgICAgTnVtYmVyKGhpc3RvcnlJdGVtLmdhc1VzZWQpICogTnVtYmVyKGhpc3RvcnlJdGVtLmdhc1ByaWNlID8/IDEpLFxuICAgICAgICA5LFxuICAgICAgICAnJyxcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiB1bml0LnRvRGlzcGxheSgpO1xuICAgIH1cbiAgICByZXR1cm4gd2VpVG9BdmF4KFxuICAgICAgbmV3IEJpZyhcbiAgICAgICAgTnVtYmVyKGhpc3RvcnlJdGVtLmdhc1VzZWQpICpcbiAgICAgICAgICBOdW1iZXIoaGlzdG9yeUl0ZW0uZ2FzUHJpY2UgPT09IHVuZGVmaW5lZCA/IDEgOiBoaXN0b3J5SXRlbS5nYXNQcmljZSksXG4gICAgICApLFxuICAgIClcbiAgICAgIC50b0ZpeGVkKDYpXG4gICAgICAudG9TdHJpbmcoKTtcbiAgfSwgW25ldHdvcmssIGhpc3RvcnlJdGVtXSk7XG5cbiAgY29uc3Qgb3B0aW9uYWxEZXRhaWxzQnV0dG9uID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKHNob3dEZXRhaWxzT3B0aW9uKSB7XG4gICAgICBpZiAoc2hvd0RldGFpbHMpIHtcbiAgICAgICAgcmV0dXJuIDxDaGV2cm9uVXBJY29uIC8+O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxDaGV2cm9uRG93bkljb24gLz47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9LCBbc2hvd0RldGFpbHNPcHRpb24sIHNob3dEZXRhaWxzXSk7XG5cbiAgY29uc3QgdHhUaXRsZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChuZXR3b3JrKSB7XG4gICAgICBpZiAoaGlzdG9yeUl0ZW0uYnJpZGdlQW5hbHlzaXMuaXNCcmlkZ2VUeCkge1xuICAgICAgICByZXR1cm4gdCgnQnJpZGdlJyk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlNFTkQgJiZcbiAgICAgICAgaGlzdG9yeUl0ZW0udG9rZW5zWzBdPy50eXBlID09PSAnRVJDMTE1NSdcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdCgnTkZUIFNlbnQnKTtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoaGlzdG9yeUl0ZW0udHhUeXBlKSB7XG4gICAgICAgIGNhc2UgVHJhbnNhY3Rpb25UeXBlLkJSSURHRTpcbiAgICAgICAgICByZXR1cm4gdCgnQnJpZGdlJyk7XG4gICAgICAgIGNhc2UgVHJhbnNhY3Rpb25UeXBlLlNXQVA6XG4gICAgICAgICAgcmV0dXJuIHQoJ1N3YXAnKTtcbiAgICAgICAgY2FzZSBUcmFuc2FjdGlvblR5cGUuU0VORDpcbiAgICAgICAgICByZXR1cm4gdCgnU2VudCcpO1xuICAgICAgICBjYXNlIFRyYW5zYWN0aW9uVHlwZS5SRUNFSVZFOlxuICAgICAgICAgIHJldHVybiB0KCdSZWNlaXZlZCcpO1xuICAgICAgICBjYXNlIFRyYW5zYWN0aW9uVHlwZS5ORlRfQlVZOlxuICAgICAgICAgIHJldHVybiB0KCdORlQgQnV5Jyk7XG4gICAgICAgIGNhc2UgVHJhbnNhY3Rpb25UeXBlLk5GVF9TRU5EOlxuICAgICAgICAgIHJldHVybiB0KCdORlQgU2VudCcpO1xuICAgICAgICBjYXNlIFRyYW5zYWN0aW9uVHlwZS5UUkFOU0ZFUjpcbiAgICAgICAgY2FzZSBUcmFuc2FjdGlvblR5cGUuVU5LTk9XTjpcbiAgICAgICAgY2FzZSBUcmFuc2FjdGlvblR5cGUuTkZUX1JFQ0VJVkU6XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaGlzdG9yeUl0ZW0udG9rZW5zWzBdICYmXG4gICAgICAgICAgICBpc05mdFRva2VuVHlwZShoaXN0b3J5SXRlbS50b2tlbnNbMF0/LnR5cGUpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gaGlzdG9yeUl0ZW0uaXNTZW5kZXIgPyB0KCdORlQgU2VudCcpIDogdCgnTkZUIFJlY2VpdmVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0KCdUcmFuc2ZlcicpO1xuICAgICAgICAgIH1cblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmIChoaXN0b3J5SXRlbS5pc0NvbnRyYWN0Q2FsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHQoJ0NvbnRyYWN0IENhbGwnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGhpc3RvcnlJdGVtLnRva2Vuc1swXT8uc3ltYm9sO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW25ldHdvcmssIHQsIGhpc3RvcnlJdGVtXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8Q2FyZFxuICAgICAgZGF0YS10ZXN0aWQ9e1xuICAgICAgICBoaXN0b3J5SXRlbS5pc0NvbnRyYWN0Q2FsbFxuICAgICAgICAgID8gJ0NvbnRyYWN0LWNhbGwtYWN0aXZpdHktY2FyZCdcbiAgICAgICAgICA6IGhpc3RvcnlJdGVtLnR4VHlwZSArICctYWN0aXZpdHktY2FyZCdcbiAgICAgIH1cbiAgICAgIHN4PXt7IHA6IDIsIGJhY2tncm91bmRJbWFnZTogJ25vbmUnIH19XG4gICAgPlxuICAgICAgPFN0YWNrXG4gICAgICAgIGRpdmlkZXI9e1xuICAgICAgICAgIDxEaXZpZGVyXG4gICAgICAgICAgICBvcmllbnRhdGlvbj1cInZlcnRpY2FsXCJcbiAgICAgICAgICAgIGZsZXhJdGVtXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXJCb3R0b21XaWR0aDogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgfVxuICAgICAgICBzeD17eyByb3dHYXA6IDEuNSwgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgY3Vyc29yOiBzaG93RGV0YWlsc09wdGlvbiA/ICdwb2ludGVyJyA6ICdkZWZhdWx0JyxcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzVG9nZ2xlZE9uTm93ID0gIXNob3dEZXRhaWxzO1xuICAgICAgICAgICAgaWYgKHNob3dEZXRhaWxzT3B0aW9uKSB7XG4gICAgICAgICAgICAgIGlmIChpc1RvZ2dsZWRPbk5vdykge1xuICAgICAgICAgICAgICAgIC8vIFdlIG9ubHkgd2FudCB0byBrbm93IHdoZW4gaXQncyBiZWluZyBzaG93blxuICAgICAgICAgICAgICAgIGNhcHR1cmUoJ0FjdGl2aXR5Q2FyZERldGFpbFNob3duJywge1xuICAgICAgICAgICAgICAgICAgY2hhaW5JZDogbmV0d29yaz8uY2hhaW5JZCxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IGhpc3RvcnlJdGVtLnR4VHlwZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzZXRTaG93RGV0YWlscyhpc1RvZ2dsZWRPbk5vdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgIGNvbHVtbkdhcDogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8QWN0aXZpdHlDYXJkSWNvbiBoaXN0b3J5SXRlbT17aGlzdG9yeUl0ZW19IC8+XG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyByb3dHYXA6IDAuNSB9fT5cbiAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoZW1lLnNwYWNpbmcoMzIpLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDZcIj57dHhUaXRsZX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8QWN0aXZpdHlDYXJkQW1vdW50IGhpc3RvcnlJdGVtPXtoaXN0b3J5SXRlbX0gLz5cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxBY3Rpdml0eUNhcmRTdW1tYXJ5IGhpc3RvcnlJdGVtPXtoaXN0b3J5SXRlbX0gLz5cbiAgICAgICAgICAgICAgICAgIHtvcHRpb25hbERldGFpbHNCdXR0b259XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICB7c2hvd0RldGFpbHMgJiYgPEFjdGl2aXR5Q2FyZERldGFpbHMgaGlzdG9yeUl0ZW09e2hpc3RvcnlJdGVtfSAvPn1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5Pnt0KCdOZXR3b3JrIEZlZScpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VG9vbHRpcCB0aXRsZT17dCgnVmlldyBpbiBFeHBsb3JlcicpfSBhcnJvdz5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgY29sdW1uR2FwOiAwLjUsIGN1cnNvcjogJ3BvaW50ZXInIH19XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2FzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBjYXB0dXJlKCdBY3Rpdml0eUNhcmRMaW5rQ2xpY2tlZCcsIHtcbiAgICAgICAgICAgICAgICAgIGNoYWluSWQ6IG5ldHdvcms/LmNoYWluSWQsXG4gICAgICAgICAgICAgICAgICB0eXBlOiBoaXN0b3J5SXRlbS50eFR5cGUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oaGlzdG9yeUl0ZW0uZXhwbG9yZXJMaW5rLCAnX2JsYW5rJywgJ25vcmVmZXJyZXInKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJleHBsb3Jlci1saW5rXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFRydW5jYXRlRmVlQW1vdW50IGFtb3VudD17Z2FzRGlzcGxheUFtb3VudH0gLz5cblxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeT57bmV0d29yaz8ubmV0d29ya1Rva2VuLnN5bWJvbH08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxFeHRlcm5hbExpbmtJY29uXG4gICAgICAgICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5tYWluLCBjdXJzb3I6ICdwb2ludGVyJyB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvQ2FyZD5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFN0YWNrLCBUb29sdGlwLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IGlzTmZ0VG9rZW5UeXBlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2JhbGFuY2VzL25mdC91dGlscy9pc05GVCc7XG5pbXBvcnQgeyBUeEhpc3RvcnlJdGVtIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2hpc3RvcnkvbW9kZWxzJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyBBY3Rpdml0eUNhcmRQcm9wIH0gZnJvbSAnLi9BY3Rpdml0eUNhcmQnO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb25UeXBlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IFRydW5jYXRlRmVlQW1vdW50IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9UcnVuY2F0ZUZlZUFtb3VudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBY3Rpdml0eUNhcmRBbW91bnQoeyBoaXN0b3J5SXRlbSB9OiBBY3Rpdml0eUNhcmRQcm9wKSB7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuXG4gIGZ1bmN0aW9uIGdldFNvdXJjZVRva2VuKHR4OiBUeEhpc3RvcnlJdGVtKSB7XG4gICAgY29uc3QgdXNlckFkZHJlc3MgPSBhY3RpdmVBY2NvdW50Py5hZGRyZXNzQztcbiAgICBpZiAoIXVzZXJBZGRyZXNzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdHgudG9rZW5zLmZpbmQoKHRva2VuKSA9PiB0b2tlbi5mcm9tPy5hZGRyZXNzID09PSB1c2VyQWRkcmVzcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUYXJnZXRUb2tlbih0eDogVHhIaXN0b3J5SXRlbSkge1xuICAgIGNvbnN0IHVzZXJBZGRyZXNzID0gYWN0aXZlQWNjb3VudD8uYWRkcmVzc0M7XG4gICAgaWYgKCF1c2VyQWRkcmVzcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHR4LnRva2Vucy5maW5kKCh0b2tlbikgPT4gdG9rZW4udG8/LmFkZHJlc3MgPT09IHVzZXJBZGRyZXNzKTtcbiAgfVxuXG4gIGlmIChoaXN0b3J5SXRlbS50eFR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5TV0FQICYmIGFjdGl2ZUFjY291bnQ/LmFkZHJlc3NDKSB7XG4gICAgY29uc3Qgc291cmNlID0gZ2V0U291cmNlVG9rZW4oaGlzdG9yeUl0ZW0pO1xuICAgIGNvbnN0IHRhcmdldCA9IGdldFRhcmdldFRva2VuKGhpc3RvcnlJdGVtKTtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBjb2x1bW5HYXA6IDAuNSB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX0+XG4gICAgICAgICAge3NvdXJjZT8uYW1vdW50fVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICBzeD17KHRoZW1lKSA9PiAoeyBjb2xvcjogdGhlbWUucGFsZXR0ZS5wcmltYXJ5LmRhcmsgfSl9XG4gICAgICAgID5cbiAgICAgICAgICB7c291cmNlPy5zeW1ib2x9IC0mZ3Q7XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cblxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fT5cbiAgICAgICAgICB7dGFyZ2V0Py5hbW91bnR9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgIHN4PXsodGhlbWUpID0+ICh7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnByaW1hcnkuZGFyayB9KX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0YXJnZXQ/LnN5bWJvbH1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPC9TdGFjaz5cbiAgICApO1xuICB9IGVsc2UgaWYgKFxuICAgIGhpc3RvcnlJdGVtLnRva2Vuc1swXSAmJlxuICAgIGlzTmZ0VG9rZW5UeXBlKGhpc3RvcnlJdGVtLnRva2Vuc1swXT8udHlwZSlcbiAgKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUeXBvZ3JhcGh5PiN7aGlzdG9yeUl0ZW0udG9rZW5zPy5bMF0/LmNvbGxlY3RhYmxlVG9rZW5JZH08L1R5cG9ncmFwaHk+XG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGFtb3VudCA9IGhpc3RvcnlJdGVtLnRva2Vucz8uWzBdPy5hbW91bnQ7XG4gIGNvbnN0IHN5bWJvbCA9IGhpc3RvcnlJdGVtLnRva2Vucz8uWzBdPy5zeW1ib2w7XG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBjb2x1bW5HYXA6IDAuNSB9fT5cbiAgICAgIHthbW91bnQgJiYgKFxuICAgICAgICA8VG9vbHRpcCB0aXRsZT17YW1vdW50fT5cbiAgICAgICAgICA8VHJ1bmNhdGVGZWVBbW91bnQgYW1vdW50PXthbW91bnR9IC8+XG4gICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICl9XG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICBzeD17KHRoZW1lKSA9PiAoeyBjb2xvcjogdGhlbWUucGFsZXR0ZS5wcmltYXJ5LmRhcmsgfSl9XG4gICAgICA+XG4gICAgICAgIHtzeW1ib2x9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IEFWQVhfVE9LRU4gfSBmcm9tICdAYXZhbGFicy9jb3JlLWNoYWlucy1zZGsnO1xuaW1wb3J0IHtcbiAgQXZhbGFuY2hlQ29sb3JJY29uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBpc05mdFRva2VuVHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9iYWxhbmNlcy9uZnQvdXRpbHMvaXNORlQnO1xuaW1wb3J0IHsgVG9rZW5JY29uIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkljb24nO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IEFjdGl2aXR5Q2FyZFByb3AgfSBmcm9tICcuL0FjdGl2aXR5Q2FyZCc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvblR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWN0aXZpdHlDYXJkRGV0YWlscyh7IGhpc3RvcnlJdGVtIH06IEFjdGl2aXR5Q2FyZFByb3ApIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgaWYgKGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlNXQVApIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrIHN4PXt7IG10OiAxLCByb3dHYXA6IDEgfX0+XG4gICAgICAgIHtoaXN0b3J5SXRlbS50b2tlbnMubWFwKCh0b2tlbiwgaSkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgcm93R2FwOiAxLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGNvbHVtbkdhcDogMSB9fT5cbiAgICAgICAgICAgICAgICB7dG9rZW4uc3ltYm9sID09PSBBVkFYX1RPS0VOLnN5bWJvbCA/IChcbiAgICAgICAgICAgICAgICAgIDxBdmFsYW5jaGVDb2xvckljb24gc2l6ZT17MTZ9IC8+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxUb2tlbkljb25cbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9e3RoZW1lLnNwYWNpbmcoMil9XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD17dGhlbWUuc3BhY2luZygyKX1cbiAgICAgICAgICAgICAgICAgICAgc3JjPXt0b2tlbi5pbWFnZVVyaX1cbiAgICAgICAgICAgICAgICAgICAgbmFtZT17dG9rZW4ubmFtZX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPnt0b2tlbi5zeW1ib2x9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGNvbHVtbkdhcDogMSB9fT5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPiB7dG9rZW4uYW1vdW50fTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPnt0b2tlbi5zeW1ib2x9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgIDwvU3RhY2s+XG4gICAgKTtcbiAgfSBlbHNlIGlmIChcbiAgICAoKGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlRSQU5TRkVSIHx8XG4gICAgICBoaXN0b3J5SXRlbS50eFR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5VTktOT1dOKSAmJlxuICAgICAgaGlzdG9yeUl0ZW0udG9rZW5zWzBdPy50eXBlICYmXG4gICAgICBpc05mdFRva2VuVHlwZShoaXN0b3J5SXRlbS50b2tlbnNbMF0udHlwZSkpIHx8XG4gICAgaGlzdG9yeUl0ZW0udHhUeXBlID09PSBUcmFuc2FjdGlvblR5cGUuTkZUX0JVWSB8fFxuICAgIGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLk5GVF9SRUNFSVZFIHx8XG4gICAgaGlzdG9yeUl0ZW0udHhUeXBlID09PSBUcmFuc2FjdGlvblR5cGUuTkZUX1NFTkQgfHxcbiAgICAoaGlzdG9yeUl0ZW0udHhUeXBlID09PSBUcmFuc2FjdGlvblR5cGUuU0VORCAmJlxuICAgICAgaGlzdG9yeUl0ZW0udG9rZW5zWzBdPy50eXBlID09PSAnRVJDMTE1NScpXG4gICkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIG10OiAxLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH19XG4gICAgICA+XG4gICAgICAgIDxUeXBvZ3JhcGh5Pnt0KCdDb2xsZWN0aW9uJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeT57aGlzdG9yeUl0ZW0udG9rZW5zPy5bMF0/Lm5hbWV9PC9UeXBvZ3JhcGh5PlxuICAgICAgPC9TdGFjaz5cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiA8PjwvPjtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgQXJyb3dEb3duSWNvbixcbiAgQXJyb3dEb3duTGVmdEljb24sXG4gIEFycm93VXBJY29uLFxuICBBcnJvd1VwUmlnaHRJY29uLFxuICBCcmlkZ2VJY29uLFxuICBOb3Rlc0ljb24sXG4gIFN0YWNrLFxuICBTd2FwSWNvbixcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvblR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgaXNOZnRUb2tlblR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvbmZ0L3V0aWxzL2lzTkZUJztcbmltcG9ydCB7IFR4SGlzdG9yeUl0ZW0gfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvaGlzdG9yeS9tb2RlbHMnO1xuaW1wb3J0IHsgQ29sbGVjdGlibGVNZWRpYSB9IGZyb20gJ0BzcmMvcGFnZXMvQ29sbGVjdGlibGVzL2NvbXBvbmVudHMvQ29sbGVjdGlibGVNZWRpYSc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuZXhwb3J0IGludGVyZmFjZSBBY3Rpdml0eUNhcmRQcm9wIHtcbiAgaGlzdG9yeUl0ZW06IFR4SGlzdG9yeUl0ZW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBY3Rpdml0eUNhcmRJY29uKHsgaGlzdG9yeUl0ZW0gfTogQWN0aXZpdHlDYXJkUHJvcCkge1xuICBjb25zdCBbdHhJY29uLCBzZXRUeEljb25dID0gdXNlU3RhdGU8SlNYLkVsZW1lbnQ+KCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgZ2V0TmZ0SWNvbiA9ICh0eDogVHhIaXN0b3J5SXRlbSkgPT4gKFxuICAgICAgPENvbGxlY3RpYmxlTWVkaWFcbiAgICAgICAgaGVpZ2h0PXt0aGVtZS5zcGFjaW5nKDQpfVxuICAgICAgICBtYXhIZWlnaHQ9e3RoZW1lLnNwYWNpbmcoNCl9XG4gICAgICAgIHdpZHRoPVwiYXV0b1wiXG4gICAgICAgIG1heFdpZHRoPXt0aGVtZS5zcGFjaW5nKDQpfVxuICAgICAgICB1cmw9e3R4LnRva2Vucz8uWzBdPy5pbWFnZVVyaX1cbiAgICAgICAgaG92ZXI9e2ZhbHNlfVxuICAgICAgICBtYXJnaW49XCI4cHggMFwiXG4gICAgICAgIHNob3dQbGF5SWNvbj17ZmFsc2V9XG4gICAgICAgIGJvcmRlclJhZGl1cz1cIjUwJVwiXG4gICAgICAvPlxuICAgICk7XG5cbiAgICBjb25zdCBpY29uU2l6ZSA9IHRoZW1lLnNwYWNpbmcoMik7XG5cbiAgICBjb25zdCBkZWZhdWx0SWNvbiA9IGhpc3RvcnlJdGVtLmlzU2VuZGVyID8gKFxuICAgICAgPEFycm93VXBJY29uIHNpemU9e2ljb25TaXplfSAvPlxuICAgICkgOiAoXG4gICAgICA8QXJyb3dEb3duSWNvbiBzaXplPXtpY29uU2l6ZX0gLz5cbiAgICApO1xuXG4gICAgaWYgKGhpc3RvcnlJdGVtLmJyaWRnZUFuYWx5c2lzLmlzQnJpZGdlVHgpIHtcbiAgICAgIHNldFR4SWNvbig8QnJpZGdlSWNvbiBzaXplPXtpY29uU2l6ZX0gLz4pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlNFTkQgJiZcbiAgICAgIGhpc3RvcnlJdGVtLnRva2Vuc1swXT8udHlwZSA9PT0gJ0VSQzExNTUnXG4gICAgKSB7XG4gICAgICBzZXRUeEljb24oZ2V0TmZ0SWNvbihoaXN0b3J5SXRlbSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzd2l0Y2ggKGhpc3RvcnlJdGVtLnR4VHlwZSkge1xuICAgICAgY2FzZSBUcmFuc2FjdGlvblR5cGUuQlJJREdFOlxuICAgICAgICBzZXRUeEljb24oPEJyaWRnZUljb24gc2l6ZT17aWNvblNpemV9IC8+KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRyYW5zYWN0aW9uVHlwZS5TV0FQOlxuICAgICAgICBzZXRUeEljb24oPFN3YXBJY29uIHNpemU9e2ljb25TaXplfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUcmFuc2FjdGlvblR5cGUuU0VORDpcbiAgICAgICAgc2V0VHhJY29uKDxBcnJvd1VwUmlnaHRJY29uIHNpemU9e2ljb25TaXplfSAvPik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUcmFuc2FjdGlvblR5cGUuUkVDRUlWRTpcbiAgICAgICAgc2V0VHhJY29uKDxBcnJvd0Rvd25MZWZ0SWNvbiBzaXplPXtpY29uU2l6ZX0gLz4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHJhbnNhY3Rpb25UeXBlLk5GVF9CVVk6XG4gICAgICBjYXNlIFRyYW5zYWN0aW9uVHlwZS5ORlRfU0VORDpcbiAgICAgIGNhc2UgVHJhbnNhY3Rpb25UeXBlLk5GVF9SRUNFSVZFOlxuICAgICAgICBzZXRUeEljb24oZ2V0TmZ0SWNvbihoaXN0b3J5SXRlbSkpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBUcmFuc2FjdGlvblR5cGUuVFJBTlNGRVI6XG4gICAgICBjYXNlIFRyYW5zYWN0aW9uVHlwZS5VTktOT1dOOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgaGlzdG9yeUl0ZW0udG9rZW5zWzBdICYmXG4gICAgICAgICAgaXNOZnRUb2tlblR5cGUoaGlzdG9yeUl0ZW0udG9rZW5zWzBdPy50eXBlKVxuICAgICAgICApIHtcbiAgICAgICAgICBzZXRUeEljb24oZ2V0TmZ0SWNvbihoaXN0b3J5SXRlbSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFR4SWNvbihkZWZhdWx0SWNvbik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChoaXN0b3J5SXRlbS5pc0NvbnRyYWN0Q2FsbCkge1xuICAgICAgICAgIHNldFR4SWNvbig8Tm90ZXNJY29uIHNpemU9e2ljb25TaXplfSAvPik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUeEljb24oZGVmYXVsdEljb24pO1xuICAgIH1cbiAgfSwgW3QsIHRoZW1lLCBoaXN0b3J5SXRlbV0pO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICBoZWlnaHQ6IHRoZW1lLnNwYWNpbmcoNCksXG4gICAgICAgIHdpZHRoOiB0aGVtZS5zcGFjaW5nKDQpLFxuICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuZ3JleVs4MDBdLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBjb2xvcjogJ3NlY29uZGFyeS5tYWluJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAge3R4SWNvbn1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdHJ1bmNhdGVBZGRyZXNzIH0gZnJvbSAnQHNyYy91dGlscy90cnVuY2F0ZUFkZHJlc3MnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZUJsb2NrY2hhaW5OYW1lcyB9IGZyb20gJy4uLy4uL3VzZUJsb2NrY2hhaW5OYW1lcyc7XG5pbXBvcnQgeyBBY3Rpdml0eUNhcmRQcm9wIH0gZnJvbSAnLi9BY3Rpdml0eUNhcmQnO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb25UeXBlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFjdGl2aXR5Q2FyZFN1bW1hcnkoeyBoaXN0b3J5SXRlbSB9OiBBY3Rpdml0eUNhcmRQcm9wKSB7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IHNvdXJjZUJsb2NrY2hhaW4sIHRhcmdldEJsb2NrY2hhaW4gfSA9XG4gICAgdXNlQmxvY2tjaGFpbk5hbWVzKGhpc3RvcnlJdGVtKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGlmIChcbiAgICBoaXN0b3J5SXRlbS50eFR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5CUklER0UgfHxcbiAgICBoaXN0b3J5SXRlbS5icmlkZ2VBbmFseXNpcy5pc0JyaWRnZVR4XG4gICkge1xuICAgIHJldHVybiAoXG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgIHN4PXsodGhlbWUpID0+ICh7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnByaW1hcnkuZGFyayB9KX1cbiAgICAgID5cbiAgICAgICAge3NvdXJjZUJsb2NrY2hhaW4gPz8gdCgnVW5rbm93bicpfSAtJmd0O3snICd9XG4gICAgICAgIHt0YXJnZXRCbG9ja2NoYWluID8/IHQoJ1Vua25vd24nKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICApO1xuICB9IGVsc2UgaWYgKGhpc3RvcnlJdGVtLnR4VHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlNXQVApIHtcbiAgICBjb25zdCBzb3VyY2VUb2tlbiA9IGhpc3RvcnlJdGVtLnRva2Vucy5maW5kKFxuICAgICAgKHRva2VuKSA9PiB0b2tlbi5mcm9tPy5hZGRyZXNzID09PSBhY3RpdmVBY2NvdW50Py5hZGRyZXNzQyxcbiAgICApO1xuXG4gICAgY29uc3QgdGFyZ2V0VG9rZW4gPSBoaXN0b3J5SXRlbS50b2tlbnMuZmluZChcbiAgICAgICh0b2tlbikgPT4gdG9rZW4udG8/LmFkZHJlc3MgPT09IGFjdGl2ZUFjY291bnQ/LmFkZHJlc3NDLFxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICBzeD17KHRoZW1lKSA9PiAoeyBjb2xvcjogdGhlbWUucGFsZXR0ZS5wcmltYXJ5LmRhcmsgfSl9XG4gICAgICA+XG4gICAgICAgIHtzb3VyY2VUb2tlbj8uc3ltYm9sfSAtJmd0OyB7dGFyZ2V0VG9rZW4/LnN5bWJvbH1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgdHhEaXJlY3Rpb24gPSBoaXN0b3J5SXRlbS5pc1NlbmRlciA/IHQoJ1RvJykgOiB0KCdGcm9tJyk7XG4gIGNvbnN0IHR4QWRkcmVzcyA9IGhpc3RvcnlJdGVtLmlzU2VuZGVyID8gaGlzdG9yeUl0ZW0udG8gOiBoaXN0b3J5SXRlbS5mcm9tO1xuXG4gIHJldHVybiAoXG4gICAgPFR5cG9ncmFwaHlcbiAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgIHN4PXsodGhlbWUpID0+ICh7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnByaW1hcnkuZGFyayB9KX1cbiAgICA+XG4gICAgICB7dHhEaXJlY3Rpb259OiB7dHJ1bmNhdGVBZGRyZXNzKHR4QWRkcmVzcyl9XG4gICAgPC9UeXBvZ3JhcGh5PlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQ2FyZCxcbiAgRGl2aWRlcixcbiAgRXh0ZXJuYWxMaW5rSWNvbixcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgUHJpbWFyeU5ldHdvcmtNZXRob2RJY29uIH0gZnJvbSAnLi9QcmltYXJ5TmV0d29ya01ldGhvZEljb24nO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyBQQ2hhaW5UcmFuc2FjdGlvblR5cGUgfSBmcm9tICdAYXZhbGFicy9nbGFjaWVyLXNkayc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IHRydW5jYXRlQWRkcmVzcyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtdXRpbHMtc2RrJztcbmltcG9ydCB7IFRyYW5zYWN0aW9uIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBQY2hhaW5BY3Rpdml0eUNhcmRQcm9wIHtcbiAgaGlzdG9yeUl0ZW06IFRyYW5zYWN0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUGNoYWluQWN0aXZpdHlDYXJkKHsgaGlzdG9yeUl0ZW0gfTogUGNoYWluQWN0aXZpdHlDYXJkUHJvcCkge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcblxuICBjb25zdCB0eFRpdGxlID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKG5ldHdvcmspIHtcbiAgICAgIHN3aXRjaCAoaGlzdG9yeUl0ZW0udHhUeXBlKSB7XG4gICAgICAgIGNhc2UgUENoYWluVHJhbnNhY3Rpb25UeXBlLkFERF9ERUxFR0FUT1JfVFg6XG4gICAgICAgICAgcmV0dXJuIHQoJ0FkZCBEZWxlZ2F0b3InKTtcbiAgICAgICAgY2FzZSBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuQUREX1NVQk5FVF9WQUxJREFUT1JfVFg6XG4gICAgICAgICAgcmV0dXJuIHQoJ0FkZCBTdWJuZXQgVmFsaWRhdG9yJyk7XG4gICAgICAgIGNhc2UgUENoYWluVHJhbnNhY3Rpb25UeXBlLkFERF9QRVJNSVNTSU9OTEVTU19WQUxJREFUT1JfVFg6XG4gICAgICAgICAgcmV0dXJuIHQoJ0FkZCBQZXJtaXNzaW9ubGVzcyBWYWxpZGF0b3InKTtcbiAgICAgICAgY2FzZSBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuQUREX1BFUk1JU1NJT05MRVNTX0RFTEVHQVRPUl9UWDpcbiAgICAgICAgICByZXR1cm4gdCgnQWRkIFBlcm1pc3Npb25sZXNzIERlbGVnYXRvcicpO1xuICAgICAgICBjYXNlIFBDaGFpblRyYW5zYWN0aW9uVHlwZS5BRERfVkFMSURBVE9SX1RYOlxuICAgICAgICAgIHJldHVybiB0KCdBZGQgVmFsaWRhdG9yJyk7XG4gICAgICAgIGNhc2UgUENoYWluVHJhbnNhY3Rpb25UeXBlLkFEVkFOQ0VfVElNRV9UWDpcbiAgICAgICAgICByZXR1cm4gdCgnQWR2YW5jZSBUaW1lJyk7XG4gICAgICAgIGNhc2UgUENoYWluVHJhbnNhY3Rpb25UeXBlLkJBU0VfVFg6XG4gICAgICAgICAgcmV0dXJuIHQoJ0Jhc2VUeCcpO1xuICAgICAgICBjYXNlIFBDaGFpblRyYW5zYWN0aW9uVHlwZS5DUkVBVEVfQ0hBSU5fVFg6XG4gICAgICAgICAgcmV0dXJuIHQoJ0NyZWF0ZSBDaGFpbicpO1xuICAgICAgICBjYXNlIFBDaGFpblRyYW5zYWN0aW9uVHlwZS5DUkVBVEVfU1VCTkVUX1RYOlxuICAgICAgICAgIHJldHVybiB0KCdDcmVhdGUgU3VibmV0Jyk7XG4gICAgICAgIGNhc2UgUENoYWluVHJhbnNhY3Rpb25UeXBlLkVYUE9SVF9UWDpcbiAgICAgICAgICByZXR1cm4gdCgnRXhwb3J0Jyk7XG4gICAgICAgIGNhc2UgUENoYWluVHJhbnNhY3Rpb25UeXBlLklNUE9SVF9UWDpcbiAgICAgICAgICByZXR1cm4gdCgnSW1wb3J0Jyk7XG4gICAgICAgIGNhc2UgUENoYWluVHJhbnNhY3Rpb25UeXBlLlJFV0FSRF9WQUxJREFUT1JfVFg6XG4gICAgICAgICAgcmV0dXJuIHQoJ1Jld2FyZCBWYWxpZGF0b3InKTtcbiAgICAgICAgY2FzZSBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuUkVNT1ZFX1NVQk5FVF9WQUxJREFUT1JfVFg6XG4gICAgICAgICAgcmV0dXJuIHQoJ1JlbW92ZSBTdWJuZXQgVmFsaWRhdG9yJyk7XG4gICAgICAgIGNhc2UgUENoYWluVHJhbnNhY3Rpb25UeXBlLlRSQU5TRkVSX1NVQk5FVF9PV05FUlNISVBfVFg6XG4gICAgICAgICAgcmV0dXJuIHQoJ1RyYW5zZmVyIFN1Ym5ldCBPd25lcnNoaXAnKTtcbiAgICAgICAgY2FzZSBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuVFJBTlNGT1JNX1NVQk5FVF9UWDpcbiAgICAgICAgICByZXR1cm4gdCgnVHJhbnNmb3JtIFN1Ym5ldCcpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiB0KCdVbmtub3duJyk7XG4gICAgICB9XG4gICAgfVxuICB9LCBbbmV0d29yaywgdCwgaGlzdG9yeUl0ZW1dKTtcblxuICBjb25zdCB0eERpcmVjdGlvbiA9IGhpc3RvcnlJdGVtLmlzU2VuZGVyID8gdCgnVG8nKSA6IHQoJ0Zyb20nKTtcbiAgY29uc3QgdHhBZGRyZXNzZXNUb1Nob3cgPSBoaXN0b3J5SXRlbS5pc1NlbmRlclxuICAgID8gaGlzdG9yeUl0ZW0udG9cbiAgICA6IGhpc3RvcnlJdGVtLmZyb207XG5cbiAgcmV0dXJuIChcbiAgICA8Q2FyZFxuICAgICAgZGF0YS10ZXN0aWQ9e2hpc3RvcnlJdGVtLnR4VHlwZSArICctYWN0aXZpdHktY2FyZCd9XG4gICAgICBzeD17eyBwOiAyLCBiYWNrZ3JvdW5kSW1hZ2U6ICdub25lJyB9fVxuICAgID5cbiAgICAgIDxTdGFja1xuICAgICAgICBkaXZpZGVyPXtcbiAgICAgICAgICA8RGl2aWRlclxuICAgICAgICAgICAgb3JpZW50YXRpb249XCJ2ZXJ0aWNhbFwiXG4gICAgICAgICAgICBmbGV4SXRlbVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYm9yZGVyQm90dG9tV2lkdGg6IDEsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgIH1cbiAgICAgICAgc3g9e3sgcm93R2FwOiAxLjUsIHdpZHRoOiAnMTAwJScgfX1cbiAgICAgID5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICBjb2x1bW5HYXA6IDIsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2hpc3RvcnlJdGVtLnR4VHlwZSAmJiAoXG4gICAgICAgICAgICAgICAgPFByaW1hcnlOZXR3b3JrTWV0aG9kSWNvbiBtZXRob2ROYW1lPXtoaXN0b3J5SXRlbS50eFR5cGV9IC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxTdGFjayBzeD17eyByb3dHYXA6IDAuNSB9fT5cbiAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoZW1lLnNwYWNpbmcoMzIpLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDZcIj57dHhUaXRsZX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGNvbHVtbkdhcDogMC41IH19PlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHtoaXN0b3J5SXRlbS50b2tlbnNbMF0/LmFtb3VudH1cbiAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5kYXJrIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7aGlzdG9yeUl0ZW0udG9rZW5zWzBdPy5zeW1ib2x9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5HYXA6IDEsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5kYXJrIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHt0eERpcmVjdGlvbn06XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgICAgICAgIHtBcnJheS5pc0FycmF5KHR4QWRkcmVzc2VzVG9TaG93KSAmJlxuICAgICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20odHhBZGRyZXNzZXNUb1Nob3cpLm1hcCgoYWRkcmVzcywgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtgJHthZGRyZXNzfS0ke2l9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBjb2xvcjogdGhlbWUucGFsZXR0ZS5wcmltYXJ5LmRhcmsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RydW5jYXRlQWRkcmVzcyhhZGRyZXNzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cblxuICAgICAgICAgICAgICAgICAgICB7IUFycmF5LmlzQXJyYXkodHhBZGRyZXNzZXNUb1Nob3cpICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtgJHt0eEFkZHJlc3Nlc1RvU2hvd31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5kYXJrIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RydW5jYXRlQWRkcmVzcyh0eEFkZHJlc3Nlc1RvU2hvdyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFR5cG9ncmFwaHk+e3QoJ05ldHdvcmsgRmVlJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxUb29sdGlwIHRpdGxlPXt0KCdWaWV3IGluIEV4cGxvcmVyJyl9IGFycm93PlxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgY29sdW1uR2FwOiAwLjUsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2FzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjYXB0dXJlKCdQY2hhaW5BY3Rpdml0eUNhcmRMaW5rQ2xpY2tlZCcsIHtcbiAgICAgICAgICAgICAgICAgIGNoYWluSWQ6IG5ldHdvcms/LmNoYWluSWQsXG4gICAgICAgICAgICAgICAgICB0eXBlOiBoaXN0b3J5SXRlbS50eFR5cGUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oaGlzdG9yeUl0ZW0uZXhwbG9yZXJMaW5rLCAnX2JsYW5rJywgJ25vcmVmZXJyZXInKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJleHBsb3Jlci1saW5rXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHk+e2hpc3RvcnlJdGVtLmdhc1VzZWR9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeT57bmV0d29yaz8ubmV0d29ya1Rva2VuLnN5bWJvbH08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxFeHRlcm5hbExpbmtJY29uXG4gICAgICAgICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5tYWluLCBjdXJzb3I6ICdwb2ludGVyJyB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvQ2FyZD5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEFkZFVzZXJJY29uLFxuICBBaXJkcm9wSWNvbixcbiAgQXJyb3dEb3duTGVmdEljb24sXG4gIEFycm93UmlnaHRJY29uLFxuICBBcnJvd1VwUmlnaHRJY29uLFxuICBCbG9ja2NoYWluSWNvbixcbiAgQnVpbGRJY29uLFxuICBDaGV2cm9uRG91YmxlVXBJY29uLFxuICBDbG9ja0ljb24sXG4gIERvd25sb2FkSWNvbixcbiAgSGVscENpcmNsZUljb24sXG4gIE1pbnVzQ2lyY2xlSWNvbixcbiAgUmVmcmVzaEljb24sXG4gIFNoYXJlSWNvbixcbiAgU3RhY2ssXG4gIFZhbGlkYXRvckljb24sXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIFBDaGFpblRyYW5zYWN0aW9uVHlwZSxcbiAgWENoYWluVHJhbnNhY3Rpb25UeXBlLFxufSBmcm9tICdAYXZhbGFicy9nbGFjaWVyLXNkayc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvblR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuZXhwb3J0IGludGVyZmFjZSBQcmltYXJ5TmV0d29ya01ldGhvZEljb25Qcm9wIHtcbiAgbWV0aG9kTmFtZTpcbiAgICB8IFRyYW5zYWN0aW9uVHlwZVxuICAgIHwgUENoYWluVHJhbnNhY3Rpb25UeXBlXG4gICAgfCBYQ2hhaW5UcmFuc2FjdGlvblR5cGVcbiAgICB8ICdDcmVhdGVBc3NldFR4J1xuICAgIHwgJ09wZXJhdGlvblR4Jztcbn1cblxuY29uc3QgTUVUSE9EX05BTUVfVE9fSUNPTjogUmVjb3JkPFxuICB8IFBDaGFpblRyYW5zYWN0aW9uVHlwZVxuICB8IFhDaGFpblRyYW5zYWN0aW9uVHlwZVxuICB8ICdDcmVhdGVBc3NldFR4J1xuICB8ICdPcGVyYXRpb25UeCcsXG4gIHR5cGVvZiBBcnJvd0Rvd25MZWZ0SWNvblxuPiA9IHtcbiAgLy8gQm90aFxuICBJbXBvcnRUeDogQXJyb3dEb3duTGVmdEljb24sXG4gIEV4cG9ydFR4OiBBcnJvd1VwUmlnaHRJY29uLFxuICBCYXNlVHg6IEFycm93UmlnaHRJY29uLFxuICAvLyBYLUNoYWluXG4gIENyZWF0ZUFzc2V0VHg6IEFpcmRyb3BJY29uLFxuICBPcGVyYXRpb25UeDogQWlyZHJvcEljb24sXG4gIC8vIFAtQ2hhaW5cbiAgQWRkUGVybWlzc2lvbmxlc3NEZWxlZ2F0b3JUeDogQWRkVXNlckljb24sXG4gIEFkZFZhbGlkYXRvclR4OiBBZGRVc2VySWNvbixcbiAgQWRkU3VibmV0VmFsaWRhdG9yVHg6IEFkZFVzZXJJY29uLFxuICBUcmFuc2ZlclN1Ym5ldE93bmVyc2hpcFR4OiBBZGRVc2VySWNvbixcbiAgQWRkRGVsZWdhdG9yVHg6IEFkZFVzZXJJY29uLFxuICBDcmVhdGVTdWJuZXRUeDogU2hhcmVJY29uLFxuICBDcmVhdGVDaGFpblR4OiBCbG9ja2NoYWluSWNvbixcbiAgVHJhbnNmb3JtU3VibmV0VHg6IEJsb2NrY2hhaW5JY29uLFxuICBBZGRQZXJtaXNzaW9ubGVzc1ZhbGlkYXRvclR4OiBBZGRVc2VySWNvbixcbiAgUmVtb3ZlU3VibmV0VmFsaWRhdG9yVHg6IE1pbnVzQ2lyY2xlSWNvbixcbiAgUmV3YXJkVmFsaWRhdG9yVHg6IEFpcmRyb3BJY29uLFxuICBBZHZhbmNlVGltZVR4OiBDbG9ja0ljb24sXG4gIFtQQ2hhaW5UcmFuc2FjdGlvblR5cGUuQ09OVkVSVF9TVUJORVRfVE9fTDFUWF06IFJlZnJlc2hJY29uLFxuICBbUENoYWluVHJhbnNhY3Rpb25UeXBlLlJFR0lTVEVSX0wxVkFMSURBVE9SX1RYXTogVmFsaWRhdG9ySWNvbixcbiAgW1BDaGFpblRyYW5zYWN0aW9uVHlwZS5TRVRfTDFWQUxJREFUT1JfV0VJR0hUX1RYXTogQnVpbGRJY29uLFxuICBbUENoYWluVHJhbnNhY3Rpb25UeXBlLkRJU0FCTEVfTDFWQUxJREFUT1JfVFhdOiBEb3dubG9hZEljb24sXG4gIFtQQ2hhaW5UcmFuc2FjdGlvblR5cGUuSU5DUkVBU0VfTDFWQUxJREFUT1JfQkFMQU5DRV9UWF06IENoZXZyb25Eb3VibGVVcEljb24sXG4gIFVOS05PV046IEhlbHBDaXJjbGVJY29uLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIFByaW1hcnlOZXR3b3JrTWV0aG9kSWNvbih7XG4gIG1ldGhvZE5hbWUsXG59OiBQcmltYXJ5TmV0d29ya01ldGhvZEljb25Qcm9wKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICBjb25zdCBJY29uID0gdXNlTWVtbyhcbiAgICAoKSA9PlxuICAgICAgbWV0aG9kTmFtZVxuICAgICAgICA/IE1FVEhPRF9OQU1FX1RPX0lDT05bbWV0aG9kTmFtZV0gfHwgTUVUSE9EX05BTUVfVE9fSUNPTi5VTktOT1dOXG4gICAgICAgIDogTUVUSE9EX05BTUVfVE9fSUNPTi5VTktOT1dOLFxuICAgIFttZXRob2ROYW1lXSxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDQpLFxuICAgICAgICB3aWR0aDogdGhlbWUuc3BhY2luZyg0KSxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODAwXSxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgY29sb3I6ICdzZWNvbmRhcnkubWFpbicsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxJY29uIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIENhcmQsXG4gIERpdmlkZXIsXG4gIEV4dGVybmFsTGlua0ljb24sXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFByaW1hcnlOZXR3b3JrTWV0aG9kSWNvbiB9IGZyb20gJy4vUHJpbWFyeU5ldHdvcmtNZXRob2RJY29uJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgWENoYWluVHJhbnNhY3Rpb25UeXBlIH0gZnJvbSAnQGF2YWxhYnMvZ2xhY2llci1zZGsnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbiB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgWGNoYWluQWN0aXZpdHlDYXJkUHJvcCB7XG4gIGhpc3RvcnlJdGVtOiBUcmFuc2FjdGlvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFhjaGFpbkFjdGl2aXR5Q2FyZCh7IGhpc3RvcnlJdGVtIH06IFhjaGFpbkFjdGl2aXR5Q2FyZFByb3ApIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IG5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG5cbiAgY29uc3QgdHhUaXRsZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChuZXR3b3JrKSB7XG4gICAgICBzd2l0Y2ggKGhpc3RvcnlJdGVtLnR4VHlwZSkge1xuICAgICAgICBjYXNlIFhDaGFpblRyYW5zYWN0aW9uVHlwZS5CQVNFX1RYOlxuICAgICAgICAgIHJldHVybiB0KCdCYXNlVHgnKTtcbiAgICAgICAgY2FzZSBYQ2hhaW5UcmFuc2FjdGlvblR5cGUuQ1JFQVRFX0FTU0VUX1RYOlxuICAgICAgICAgIHJldHVybiB0KCdDcmVhdGUgQXNzZXQnKTtcbiAgICAgICAgY2FzZSBYQ2hhaW5UcmFuc2FjdGlvblR5cGUuT1BFUkFUSU9OX1RYOlxuICAgICAgICAgIHJldHVybiB0KCdPcGVyYXRpb24nKTtcbiAgICAgICAgY2FzZSBYQ2hhaW5UcmFuc2FjdGlvblR5cGUuSU1QT1JUX1RYOlxuICAgICAgICAgIHJldHVybiB0KCdJbXBvcnQnKTtcbiAgICAgICAgY2FzZSBYQ2hhaW5UcmFuc2FjdGlvblR5cGUuRVhQT1JUX1RYOlxuICAgICAgICAgIHJldHVybiB0KCdFeHBvcnQnKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdCgnVW5rbm93bicpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW25ldHdvcmssIHQsIGhpc3RvcnlJdGVtXSk7XG5cbiAgY29uc3QgdHhEaXJlY3Rpb24gPSBoaXN0b3J5SXRlbS5pc1NlbmRlciA/IHQoJ1RvJykgOiB0KCdGcm9tJyk7XG4gIGNvbnN0IHR4QWRkcmVzc2VzVG9TaG93ID0gaGlzdG9yeUl0ZW0uaXNTZW5kZXJcbiAgICA/IGhpc3RvcnlJdGVtLnRvXG4gICAgOiBoaXN0b3J5SXRlbS5mcm9tO1xuXG4gIHJldHVybiAoXG4gICAgPENhcmRcbiAgICAgIGRhdGEtdGVzdGlkPXtoaXN0b3J5SXRlbS50eFR5cGUgKyAnLWFjdGl2aXR5LWNhcmQnfVxuICAgICAgc3g9e3sgcDogMiwgYmFja2dyb3VuZEltYWdlOiAnbm9uZScgfX1cbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgZGl2aWRlcj17XG4gICAgICAgICAgPERpdmlkZXJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uPVwidmVydGljYWxcIlxuICAgICAgICAgICAgZmxleEl0ZW1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJvcmRlckJvdHRvbVdpZHRoOiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICB9XG4gICAgICAgIHN4PXt7IHJvd0dhcDogMS41LCB3aWR0aDogJzEwMCUnIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgY29sdW1uR2FwOiAyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtoaXN0b3J5SXRlbS50eFR5cGUgJiYgKFxuICAgICAgICAgICAgICAgIDxQcmltYXJ5TmV0d29ya01ldGhvZEljb24gbWV0aG9kTmFtZT17aGlzdG9yeUl0ZW0udHhUeXBlfSAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgcm93R2FwOiAwLjUgfX0+XG4gICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGVtZS5zcGFjaW5nKDMyKSxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg2XCI+e3R4VGl0bGV9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBjb2x1bW5HYXA6IDAuNSB9fT5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7aGlzdG9yeUl0ZW0udG9rZW5zWzBdPy5hbW91bnR9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnByaW1hcnkuZGFyayB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge2hpc3RvcnlJdGVtLnRva2Vuc1swXT8uc3ltYm9sfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uR2FwOiAxLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnByaW1hcnkuZGFyayB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dHhEaXJlY3Rpb259OlxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgICAgICAgICB7QXJyYXkuaXNBcnJheSh0eEFkZHJlc3Nlc1RvU2hvdykgJiZcbiAgICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKHR4QWRkcmVzc2VzVG9TaG93KS5tYXAoKGFkZHJlc3MsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17YCR7YWRkcmVzc30tJHtpfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5kYXJrIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0cnVuY2F0ZUFkZHJlc3MoYWRkcmVzcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG5cbiAgICAgICAgICAgICAgICAgICAgeyFBcnJheS5pc0FycmF5KHR4QWRkcmVzc2VzVG9TaG93KSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17YCR7dHhBZGRyZXNzZXNUb1Nob3d9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnByaW1hcnkuZGFyayB9fVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0cnVuY2F0ZUFkZHJlc3ModHhBZGRyZXNzZXNUb1Nob3cpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5Pnt0KCdOZXR3b3JrIEZlZScpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VG9vbHRpcCB0aXRsZT17dCgnVmlldyBpbiBFeHBsb3JlcicpfSBhcnJvdz5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgIGNvbHVtbkdhcDogMC41LFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbkNsaWNrPXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FwdHVyZSgnWGNoYWluQWN0aXZpdHlDYXJkTGlua0NsaWNrZWQnLCB7XG4gICAgICAgICAgICAgICAgICBjaGFpbklkOiBuZXR3b3JrPy5jaGFpbklkLFxuICAgICAgICAgICAgICAgICAgdHlwZTogaGlzdG9yeUl0ZW0udHhUeXBlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGhpc3RvcnlJdGVtLmV4cGxvcmVyTGluaywgJ19ibGFuaycsICdub3JlZmVycmVyJyk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZXhwbG9yZXItbGlua1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5PntoaXN0b3J5SXRlbS5nYXNVc2VkfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHk+e25ldHdvcms/Lm5ldHdvcmtUb2tlbi5zeW1ib2x9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8RXh0ZXJuYWxMaW5rSWNvblxuICAgICAgICAgICAgICAgIHNpemU9ezE2fVxuICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnByaW1hcnkubWFpbiwgY3Vyc29yOiAncG9pbnRlcicgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L0NhcmQ+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBCcmlkZ2VUcmFuc2FjdGlvbiwgdXNlQnJpZGdlU0RLIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1icmlkZ2Utc2RrJztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQ2FyZCxcbiAgRGl2aWRlcixcbiAgRXh0ZXJuYWxMaW5rSWNvbixcbiAgU3RhY2ssXG4gIHRvYXN0LFxuICBUb2FzdENhcmQsXG4gIFR5cG9ncmFwaHksXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlQnJpZGdlQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQnJpZGdlUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQge1xuICBibG9ja2NoYWluVG9OZXR3b3JrLFxuICBuZXR3b3JrVG9CbG9ja2NoYWluLFxufSBmcm9tICdAc3JjL3BhZ2VzL0JyaWRnZS91dGlscy9ibG9ja2NoYWluQ29udmVyc2lvbic7XG5pbXBvcnQgeyBnZXRFeHBsb3JlckFkZHJlc3NCeU5ldHdvcmsgfSBmcm9tICdAc3JjL3V0aWxzL2dldEV4cGxvcmVyQWRkcmVzcyc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZUJsb2NrY2hhaW5OYW1lcyB9IGZyb20gJy4uLy4uL3VzZUJsb2NrY2hhaW5OYW1lcyc7XG5pbXBvcnQgeyBJblByb2dyZXNzQnJpZGdlSWNvbiB9IGZyb20gJy4vSW5Qcm9ncmVzc0JyaWRnZUljb24nO1xuaW1wb3J0IHsgQnJpZGdlVHJhbnNmZXIgfSBmcm9tICdAYXZhbGFicy9icmlkZ2UtdW5pZmllZCc7XG5pbXBvcnQgeyBpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlciB9IGZyb20gJ0BzcmMvcGFnZXMvQnJpZGdlL3V0aWxzL2lzVW5pZmllZEJyaWRnZVRyYW5zZmVyJztcbmltcG9ydCB7IGJpZ2ludFRvQmlnIH0gZnJvbSAnQHNyYy91dGlscy9iaWdpbnRUb0JpZyc7XG5pbXBvcnQgeyB1c2VVbmlmaWVkQnJpZGdlQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvVW5pZmllZEJyaWRnZVByb3ZpZGVyJztcblxuZXhwb3J0IGludGVyZmFjZSBJblByb2dyZXNzQnJpZGdlQWN0aXZpdHlDYXJkUHJvcCB7XG4gIHR4OiBCcmlkZ2VUcmFuc2FjdGlvbiB8IEJyaWRnZVRyYW5zZmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSW5Qcm9ncmVzc0JyaWRnZUFjdGl2aXR5Q2FyZCh7XG4gIHR4LFxufTogSW5Qcm9ncmVzc0JyaWRnZUFjdGl2aXR5Q2FyZFByb3ApIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IHsgbmV0d29ya3MgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IHsgYnJpZGdlQ29uZmlnIH0gPSB1c2VCcmlkZ2VTREsoKTtcblxuICBjb25zdCB7IHNvdXJjZUJsb2NrY2hhaW4sIHRhcmdldEJsb2NrY2hhaW4gfSA9IHVzZUJsb2NrY2hhaW5OYW1lcyh0eCk7XG4gIGNvbnN0IFt0b2FzdFNob3duLCBzZXRUb2FzdFNob3duXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcblxuICBjb25zdCB7IHJlbW92ZUJyaWRnZVRyYW5zYWN0aW9uIH0gPSB1c2VCcmlkZ2VDb250ZXh0KCk7XG4gIGNvbnN0IHsgZ2V0RXJyb3JNZXNzYWdlIH0gPSB1c2VVbmlmaWVkQnJpZGdlQ29udGV4dCgpO1xuXG4gIGNvbnN0IGV4cGxvcmVyVXJsID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgbmV0d29ya0RhdGEgPSBibG9ja2NoYWluVG9OZXR3b3JrKFxuICAgICAgdHguc291cmNlQ2hhaW4sXG4gICAgICBuZXR3b3JrcyxcbiAgICAgIGJyaWRnZUNvbmZpZyxcbiAgICApO1xuICAgIGlmIChuZXR3b3JrRGF0YSkge1xuICAgICAgcmV0dXJuIGdldEV4cGxvcmVyQWRkcmVzc0J5TmV0d29yayhuZXR3b3JrRGF0YSwgdHguc291cmNlVHhIYXNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSwgW3R4LnNvdXJjZUNoYWluLCB0eC5zb3VyY2VUeEhhc2gsIG5ldHdvcmtzLCBicmlkZ2VDb25maWddKTtcblxuICBjb25zdCBpblByb2dyZXNzVmFsdWUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIXR4KSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBpZiAoaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIodHgpKSB7XG4gICAgICBjb25zdCB0b3RhbENvbmZpcm1hdGlvbnNSZXF1aXJlZCA9XG4gICAgICAgIHR4LnNvdXJjZVJlcXVpcmVkQ29uZmlybWF0aW9uQ291bnQgKyB0eC50YXJnZXRSZXF1aXJlZENvbmZpcm1hdGlvbkNvdW50O1xuICAgICAgY29uc3QgdG90YWxDb25maXJtYXRpb25zT2J0YWluZWQgPVxuICAgICAgICB0eC5zb3VyY2VDb25maXJtYXRpb25Db3VudCArIHR4LnRhcmdldENvbmZpcm1hdGlvbkNvdW50O1xuXG4gICAgICByZXR1cm4gTWF0aC5taW4oXG4gICAgICAgIDEwMCxcbiAgICAgICAgKHRvdGFsQ29uZmlybWF0aW9uc09idGFpbmVkIC8gdG90YWxDb25maXJtYXRpb25zUmVxdWlyZWQpICogMTAwLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb25maXJtYXRpb25Db3VudCA9IHR4LnJlcXVpcmVkQ29uZmlybWF0aW9uQ291bnQgKyAxOyAvLyAxIGlzIGFkZGVkIGZvciB0YXJnZXQgbmV0d29ya1xuXG4gICAgY29uc3QgY3VycmVudENvdW50ID1cbiAgICAgIHR4LmNvbmZpcm1hdGlvbkNvdW50ID4gdHgucmVxdWlyZWRDb25maXJtYXRpb25Db3VudFxuICAgICAgICA/IHR4LnJlcXVpcmVkQ29uZmlybWF0aW9uQ291bnRcbiAgICAgICAgOiB0eC5jb25maXJtYXRpb25Db3VudDtcblxuICAgIHJldHVybiAoY3VycmVudENvdW50IC8gY29uZmlybWF0aW9uQ291bnQpICogMTAwO1xuICB9LCBbdHhdKTtcblxuICBjb25zdCBzeW1ib2wgPSB1c2VNZW1vKFxuICAgICgpID0+IChpc1VuaWZpZWRCcmlkZ2VUcmFuc2Zlcih0eCkgPyB0eC5hc3NldC5zeW1ib2wgOiB0eD8uc3ltYm9sKSxcbiAgICBbdHhdLFxuICApO1xuICBjb25zdCBhbW91bnQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIodHgpKSB7XG4gICAgICByZXR1cm4gYmlnaW50VG9CaWcodHguYW1vdW50LCB0eC5hc3NldC5kZWNpbWFscyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHR4LmFtb3VudDtcbiAgfSwgW3R4XSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXR4LmNvbXBsZXRlZEF0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0b2FzdFNob3duKSB7XG4gICAgICBzZXRUb2FzdFNob3duKHRydWUpO1xuXG4gICAgICBjb25zdCBpc1N1Y2Nlc3NmdWwgPSAhaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXIodHgpIHx8ICF0eC5lcnJvckNvZGU7XG5cbiAgICAgIGNvbnN0IHRvYXN0SWQgPSB0b2FzdC5jdXN0b20oXG4gICAgICAgIDxUb2FzdENhcmRcbiAgICAgICAgICB2YXJpYW50PXtpc1N1Y2Nlc3NmdWwgPyAnc3VjY2VzcycgOiAnZXJyb3InfVxuICAgICAgICAgIHRpdGxlPXtpc1N1Y2Nlc3NmdWwgPyB0KCdCcmlkZ2UgU3VjY2Vzc2Z1bCcpIDogdCgnQnJpZGdlIEZhaWxlZCcpfVxuICAgICAgICAgIG9uRGlzbWlzcz17KCkgPT4ge1xuICAgICAgICAgICAgdG9hc3QucmVtb3ZlKHRvYXN0SWQpO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7aXNTdWNjZXNzZnVsXG4gICAgICAgICAgICA/IHQoYFlvdSB0cmFuc2ZlcnJlZCB7e2Ftb3VudH19IHt7c3ltYm9sfX1gLCB7XG4gICAgICAgICAgICAgICAgYW1vdW50LFxuICAgICAgICAgICAgICAgIHN5bWJvbCxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogdHguZXJyb3JDb2RlXG4gICAgICAgICAgICAgID8gZ2V0RXJyb3JNZXNzYWdlKHR4LmVycm9yQ29kZSlcbiAgICAgICAgICAgICAgOiAnJ31cbiAgICAgICAgPC9Ub2FzdENhcmQ+LFxuICAgICAgICB7XG4gICAgICAgICAgZHVyYXRpb246IEluZmluaXR5LFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZW1vdmVCcmlkZ2VUcmFuc2FjdGlvbih0eC5zb3VyY2VUeEhhc2gpO1xuICB9LCBbXG4gICAgcmVtb3ZlQnJpZGdlVHJhbnNhY3Rpb24sXG4gICAgdCxcbiAgICB0b2FzdFNob3duLFxuICAgIHR4LFxuICAgIGFtb3VudCxcbiAgICBnZXRFcnJvck1lc3NhZ2UsXG4gICAgc3ltYm9sLFxuICBdKTtcblxuICBjb25zdCBlcnJvckNvZGUgPSBpc1VuaWZpZWRCcmlkZ2VUcmFuc2Zlcih0eCkgPyB0eC5lcnJvckNvZGUgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IGhhc0Vycm9yID0gdHlwZW9mIGVycm9yQ29kZSAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgcmV0dXJuIChcbiAgICA8Q2FyZFxuICAgICAgc3g9e3tcbiAgICAgICAgcDogMixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFN0YWNrXG4gICAgICAgIGRpdmlkZXI9e1xuICAgICAgICAgIDxEaXZpZGVyXG4gICAgICAgICAgICBvcmllbnRhdGlvbj1cInZlcnRpY2FsXCJcbiAgICAgICAgICAgIGZsZXhJdGVtXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBib3JkZXJCb3R0b21XaWR0aDogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgfVxuICAgICAgICBzeD17eyByb3dHYXA6IDEuNSwgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgIGNvbHVtbkdhcDogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8SW5Qcm9ncmVzc0JyaWRnZUljb25cbiAgICAgICAgICAgICAgICB2YWx1ZT17aW5Qcm9ncmVzc1ZhbHVlfVxuICAgICAgICAgICAgICAgIGhhc0Vycm9yPXtoYXNFcnJvcn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGVtZS5zcGFjaW5nKDMyKSxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg2XCI+e3QoJ0JyaWRnZScpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgY29sdW1uR2FwOiAwLjUgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge2Ftb3VudC50b1N0cmluZygpfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzeD17eyBjb2xvcjogdGhlbWUucGFsZXR0ZS5wcmltYXJ5LmRhcmsgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHtzeW1ib2x9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnByaW1hcnkuZGFyayB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7c291cmNlQmxvY2tjaGFpbn0gLSZndDsge3RhcmdldEJsb2NrY2hhaW59XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgcDogMCxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoYWluTmFtZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdHguc291cmNlQ2hhaW4gPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gdHguc291cmNlQ2hhaW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXR3b3JrVG9CbG9ja2NoYWluKHR4LnNvdXJjZUNoYWluKTtcblxuICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIGAvYnJpZGdlL3RyYW5zYWN0aW9uLXN0YXR1cy8ke2NoYWluTmFtZX0vJHt0eC5zb3VyY2VUeEhhc2h9LyR7dHguc291cmNlU3RhcnRlZEF0fWAsXG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdWaWV3IFN0YXR1cycpfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICB7IWhhc0Vycm9yICYmIChcbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeT57dCgnTmV0d29yayBGZWUnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGNvbHVtbkdhcDogMSB9fT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHk+e3QoJ1BlbmRpbmcnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIHtleHBsb3JlclVybCAmJiAoXG4gICAgICAgICAgICAgICAgPEV4dGVybmFsTGlua0ljb25cbiAgICAgICAgICAgICAgICAgIHNpemU9ezE2fVxuICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5tYWluLCBjdXJzb3I6ICdwb2ludGVyJyB9fVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihleHBsb3JlclVybCwgJ19ibGFuaycsICdub3JlZmVycmVyJyk7XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgIDwvQ2FyZD5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJyaWRnZUljb24sXG4gIENpcmN1bGFyUHJvZ3Jlc3MsXG4gIFN0YWNrLFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmV4cG9ydCBpbnRlcmZhY2UgSW5Qcm9ncmVzc0JyaWRnZUljb25Qcm9wIHtcbiAgdmFsdWU6IG51bWJlcjtcbiAgaGFzRXJyb3I/OiBib29sZWFuO1xufVxuZXhwb3J0IGZ1bmN0aW9uIEluUHJvZ3Jlc3NCcmlkZ2VJY29uKHtcbiAgdmFsdWUsXG4gIGhhc0Vycm9yLFxufTogSW5Qcm9ncmVzc0JyaWRnZUljb25Qcm9wKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhlbWUucGFsZXR0ZS5ncmV5WzgwMF0sXG4gICAgICAgIGhlaWdodDogMzIsXG4gICAgICAgIHdpZHRoOiAzMixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPENpcmN1bGFyUHJvZ3Jlc3NcbiAgICAgICAgdmFyaWFudD1cImRldGVybWluYXRlXCJcbiAgICAgICAgc2l6ZT17MzJ9XG4gICAgICAgIHRoaWNrbmVzcz17Mn1cbiAgICAgICAgdmFsdWU9e2hhc0Vycm9yID8gMTAwIDogdmFsdWV9XG4gICAgICAgIGRpc2FibGVTaHJpbms9e2ZhbHNlfVxuICAgICAgICBjb2xvcj17aGFzRXJyb3IgPyAnZXJyb3InIDogJ3NlY29uZGFyeSd9XG4gICAgICAvPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICBoZWlnaHQ6IDMyLFxuICAgICAgICAgIHdpZHRoOiAzMixcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEJyaWRnZUljb25cbiAgICAgICAgICBzaXplPXt0aGVtZS5zcGFjaW5nKDIpfVxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBjb2xvcjogaGFzRXJyb3JcbiAgICAgICAgICAgICAgPyB0aGVtZS5wYWxldHRlLmVycm9yLm1haW5cbiAgICAgICAgICAgICAgOiB0aGVtZS5wYWxldHRlLnNlY29uZGFyeS5tYWluLFxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBCcmlkZ2VUcmFuc2FjdGlvbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBCcmlkZ2VUcmFuc2ZlciB9IGZyb20gJ0BhdmFsYWJzL2JyaWRnZS11bmlmaWVkJztcblxuaW1wb3J0IHsgVHhIaXN0b3J5SXRlbSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9oaXN0b3J5L21vZGVscyc7XG5pbXBvcnQgeyBpc1BlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbiB9IGZyb20gJ0BzcmMvdXRpbHMvYnJpZGdlVHJhbnNhY3Rpb25VdGlscyc7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUJsb2NrY2hhaW5OYW1lcyhcbiAgaXRlbTogVHhIaXN0b3J5SXRlbSB8IEJyaWRnZVRyYW5zYWN0aW9uIHwgQnJpZGdlVHJhbnNmZXIsXG4pIHtcbiAgY29uc3QgcGVuZGluZyA9IGlzUGVuZGluZ0JyaWRnZVRyYW5zYWN0aW9uKGl0ZW0pO1xuICBjb25zdCB7IGdldE5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG5cbiAgaWYgKHBlbmRpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc291cmNlQmxvY2tjaGFpbjogdGl0bGVDYXNlKFxuICAgICAgICB0eXBlb2YgaXRlbS5zb3VyY2VDaGFpbiA9PT0gJ29iamVjdCdcbiAgICAgICAgICA/IGl0ZW0uc291cmNlQ2hhaW4uY2hhaW5OYW1lXG4gICAgICAgICAgOiBpdGVtLnNvdXJjZUNoYWluLFxuICAgICAgKSxcbiAgICAgIHRhcmdldEJsb2NrY2hhaW46IHRpdGxlQ2FzZShcbiAgICAgICAgdHlwZW9mIGl0ZW0udGFyZ2V0Q2hhaW4gPT09ICdvYmplY3QnXG4gICAgICAgICAgPyBpdGVtLnRhcmdldENoYWluLmNoYWluTmFtZVxuICAgICAgICAgIDogaXRlbS50YXJnZXRDaGFpbixcbiAgICAgICksXG4gICAgfTtcbiAgfVxuXG4gIGlmICghaXRlbS5icmlkZ2VBbmFseXNpcy5pc0JyaWRnZVR4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZUJsb2NrY2hhaW46IHVuZGVmaW5lZCxcbiAgICAgIHRhcmdldEJsb2NrY2hhaW46IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgeyBzb3VyY2VDaGFpbklkLCB0YXJnZXRDaGFpbklkIH0gPSBpdGVtLmJyaWRnZUFuYWx5c2lzO1xuXG4gIHJldHVybiB7XG4gICAgc291cmNlQmxvY2tjaGFpbjogc291cmNlQ2hhaW5JZFxuICAgICAgPyAoZ2V0TmV0d29yayhzb3VyY2VDaGFpbklkKT8uY2hhaW5OYW1lID8/IHNvdXJjZUNoYWluSWQpXG4gICAgICA6IHVuZGVmaW5lZCxcbiAgICB0YXJnZXRCbG9ja2NoYWluOiB0YXJnZXRDaGFpbklkXG4gICAgICA/IChnZXROZXR3b3JrKHRhcmdldENoYWluSWQpPy5jaGFpbk5hbWUgPz8gdGFyZ2V0Q2hhaW5JZClcbiAgICAgIDogdW5kZWZpbmVkLFxuICB9O1xufVxuXG5mdW5jdGlvbiB0aXRsZUNhc2UobmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiAobmFtZVswXSB8fCAnJykudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG59XG4iLCJpbXBvcnQge1xuICBDaXJjdWxhclByb2dyZXNzLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5leHBvcnQgZnVuY3Rpb24gTm9UcmFuc2FjdGlvbnMoeyBsb2FkaW5nID0gZmFsc2UgfTogeyBsb2FkaW5nOiBib29sZWFuIH0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGFsaWduSXRlbXM6ICdjZW50ZXInLCBmbGV4R3JvdzogMSwgbXQ6IDkgfX0+XG4gICAgICB7bG9hZGluZyA/IChcbiAgICAgICAgPENpcmN1bGFyUHJvZ3Jlc3Mgc2l6ZT17MzJ9IC8+XG4gICAgICApIDogKFxuICAgICAgICA8PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPnt0KCdObyBBY3Rpdml0eScpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgIHN4PXt7IG15OiAxLCBjb2xvcjogdGhlbWUucGFsZXR0ZS5wcmltYXJ5LmRhcmsgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnQWRkIGFzc2V0cyBieSBCdXlpbmcgb3IgUmVjZWl2aW5nJyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8Lz5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIFBDaGFpblRyYW5zYWN0aW9uVHlwZSxcbiAgWENoYWluVHJhbnNhY3Rpb25UeXBlLFxufSBmcm9tICdAYXZhbGFicy9nbGFjaWVyLXNkayc7XG5cbmV4cG9ydCBlbnVtIFBjaGFpbkZpbHRlclR5cGUge1xuICBBTEwgPSAnQWxsJyxcbiAgSU5DT01JTkcgPSAnSW5jb21pbmcnLFxuICBPVVRHT0lORyA9ICdPdXRnb2luZycsXG4gIEFERF9ERUxFR0FUT1JfVFggPSAnQWRkIERlbGVnYXRvcicsXG4gIEFERF9TVUJORVRfVkFMSURBVE9SX1RYID0gJ0FkZCBTdWJuZXQgVmFsaWRhdG9yJyxcbiAgQUREX1BFUk1JU1NJT05MRVNTX1ZBTElEQVRPUl9UWCA9ICdBZGQgUGVybWlzc2lvbmxlc3MgVmFsaWRhdG9yJyxcbiAgQUREX1BFUk1JU1NJT05MRVNTX0RFTEVHQVRPUl9UWCA9ICdBZGQgUGVybWlzc2lvbmxlc3MgRGVsZWdhdG9yJyxcbiAgQUREX1ZBTElEQVRPUl9UWCA9ICdBZGQgVmFsaWRhdG9yJyxcbiAgQURWQU5DRV9USU1FX1RYID0gJ0FkdmFuY2UgVGltZScsXG4gIEJBU0VfVFggPSAnQmFzZVR4JyxcbiAgQ1JFQVRFX0NIQUlOX1RYID0gJ0NyZWF0ZSBDaGFpbicsXG4gIENSRUFURV9TVUJORVRfVFggPSAnQ3JlYXRlIFN1Ym5ldCcsXG4gIEVYUE9SVF9UWCA9ICdFeHBvcnQnLFxuICBJTVBPUlRfVFggPSAnSW1wb3J0JyxcbiAgUkVXQVJEX1ZBTElEQVRPUl9UWCA9ICdSZXdhcmQgVmFsaWRhdG9yJyxcbiAgUkVNT1ZFX1NVQk5FVF9WQUxJREFUT1JfVFggPSAnUmVtb3ZlIFN1Ym5ldCBWYWxpZGF0b3InLFxuICBUUkFOU0ZFUl9TVUJORVRfT1dORVJTSElQX1RYID0gJ1RyYW5zZmVyIFN1Ym5ldCBPd25lcnNoaXAnLFxuICBUUkFOU0ZPUk1fU1VCTkVUX1RYID0gJ1RyYW5zZm9ybSBTdWJuZXQnLFxufVxuXG5leHBvcnQgY29uc3QgUGNoYWluRmlsdGVyVHhUeXBlTWFwID0ge1xuICBbUGNoYWluRmlsdGVyVHlwZS5BRERfREVMRUdBVE9SX1RYXTogUENoYWluVHJhbnNhY3Rpb25UeXBlLkFERF9ERUxFR0FUT1JfVFgsXG4gIFtQY2hhaW5GaWx0ZXJUeXBlLkFERF9TVUJORVRfVkFMSURBVE9SX1RYXTpcbiAgICBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuQUREX1NVQk5FVF9WQUxJREFUT1JfVFgsXG4gIFtQY2hhaW5GaWx0ZXJUeXBlLkFERF9QRVJNSVNTSU9OTEVTU19WQUxJREFUT1JfVFhdOlxuICAgIFBDaGFpblRyYW5zYWN0aW9uVHlwZS5BRERfUEVSTUlTU0lPTkxFU1NfVkFMSURBVE9SX1RYLFxuICBbUGNoYWluRmlsdGVyVHlwZS5BRERfUEVSTUlTU0lPTkxFU1NfREVMRUdBVE9SX1RYXTpcbiAgICBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuQUREX1BFUk1JU1NJT05MRVNTX0RFTEVHQVRPUl9UWCxcbiAgW1BjaGFpbkZpbHRlclR5cGUuQUREX1ZBTElEQVRPUl9UWF06IFBDaGFpblRyYW5zYWN0aW9uVHlwZS5BRERfVkFMSURBVE9SX1RYLFxuICBbUGNoYWluRmlsdGVyVHlwZS5BRFZBTkNFX1RJTUVfVFhdOiBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuQURWQU5DRV9USU1FX1RYLFxuICBbUGNoYWluRmlsdGVyVHlwZS5CQVNFX1RYXTogUENoYWluVHJhbnNhY3Rpb25UeXBlLkJBU0VfVFgsXG4gIFtQY2hhaW5GaWx0ZXJUeXBlLkNSRUFURV9DSEFJTl9UWF06IFBDaGFpblRyYW5zYWN0aW9uVHlwZS5DUkVBVEVfQ0hBSU5fVFgsXG4gIFtQY2hhaW5GaWx0ZXJUeXBlLkNSRUFURV9TVUJORVRfVFhdOiBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuQ1JFQVRFX1NVQk5FVF9UWCxcbiAgW1BjaGFpbkZpbHRlclR5cGUuRVhQT1JUX1RYXTogUENoYWluVHJhbnNhY3Rpb25UeXBlLkVYUE9SVF9UWCxcbiAgW1BjaGFpbkZpbHRlclR5cGUuSU1QT1JUX1RYXTogUENoYWluVHJhbnNhY3Rpb25UeXBlLklNUE9SVF9UWCxcbiAgW1BjaGFpbkZpbHRlclR5cGUuUkVXQVJEX1ZBTElEQVRPUl9UWF06XG4gICAgUENoYWluVHJhbnNhY3Rpb25UeXBlLlJFV0FSRF9WQUxJREFUT1JfVFgsXG4gIFtQY2hhaW5GaWx0ZXJUeXBlLlJFTU9WRV9TVUJORVRfVkFMSURBVE9SX1RYXTpcbiAgICBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuUkVNT1ZFX1NVQk5FVF9WQUxJREFUT1JfVFgsXG4gIFtQY2hhaW5GaWx0ZXJUeXBlLlRSQU5TRkVSX1NVQk5FVF9PV05FUlNISVBfVFhdOlxuICAgIFBDaGFpblRyYW5zYWN0aW9uVHlwZS5UUkFOU0ZFUl9TVUJORVRfT1dORVJTSElQX1RYLFxuICBbUGNoYWluRmlsdGVyVHlwZS5UUkFOU0ZPUk1fU1VCTkVUX1RYXTpcbiAgICBQQ2hhaW5UcmFuc2FjdGlvblR5cGUuVFJBTlNGT1JNX1NVQk5FVF9UWCxcbn07XG5cbmV4cG9ydCBlbnVtIFhjaGFpbkZpbHRlclR5cGUge1xuICBBTEwgPSAnQWxsJyxcbiAgSU5DT01JTkcgPSAnSW5jb21pbmcnLFxuICBPVVRHT0lORyA9ICdPdXRnb2luZycsXG4gIEJBU0VfVFggPSAnQmFzZVR4JyxcbiAgQ1JFQVRFX0FTU0VUX1RYID0gJ0NyZWF0ZSBBc3NldCcsXG4gIE9QRVJBVElPTl9UWCA9ICdPcGVyYXRpb24nLFxuICBJTVBPUlRfVFggPSAnSW1wb3J0JyxcbiAgRVhQT1JUX1RYID0gJ0V4cG9ydCcsXG59XG5cbmV4cG9ydCBjb25zdCBYY2hhaW5GaWx0ZXJUeFR5cGVNYXAgPSB7XG4gIFtYY2hhaW5GaWx0ZXJUeXBlLkJBU0VfVFhdOiBYQ2hhaW5UcmFuc2FjdGlvblR5cGUuQkFTRV9UWCxcbiAgW1hjaGFpbkZpbHRlclR5cGUuQ1JFQVRFX0FTU0VUX1RYXTogWENoYWluVHJhbnNhY3Rpb25UeXBlLkNSRUFURV9BU1NFVF9UWCxcbiAgW1hjaGFpbkZpbHRlclR5cGUuT1BFUkFUSU9OX1RYXTogWENoYWluVHJhbnNhY3Rpb25UeXBlLk9QRVJBVElPTl9UWCxcbiAgW1hjaGFpbkZpbHRlclR5cGUuSU1QT1JUX1RYXTogWENoYWluVHJhbnNhY3Rpb25UeXBlLklNUE9SVF9UWCxcbiAgW1hjaGFpbkZpbHRlclR5cGUuRVhQT1JUX1RYXTogWENoYWluVHJhbnNhY3Rpb25UeXBlLkVYUE9SVF9UWCxcbn07XG4iLCJpbXBvcnQgeyBCcmlkZ2VUcmFuc2ZlciB9IGZyb20gJ0BhdmFsYWJzL2JyaWRnZS11bmlmaWVkJztcbmltcG9ydCB7IEJyaWRnZVRyYW5zYWN0aW9uIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1icmlkZ2Utc2RrJztcbmltcG9ydCB7IGlzVW5pZmllZEJyaWRnZVRyYW5zZmVyIH0gZnJvbSAnQHNyYy9wYWdlcy9CcmlkZ2UvdXRpbHMvaXNVbmlmaWVkQnJpZGdlVHJhbnNmZXInO1xuXG5leHBvcnQgY29uc3QgZ2V0QnJpZGdlZEFzc2V0U3ltYm9sID0gKFxuICB0eDogQnJpZGdlVHJhbnNmZXIgfCBCcmlkZ2VUcmFuc2FjdGlvbixcbik6IHN0cmluZyA9PiB7XG4gIGlmIChpc1VuaWZpZWRCcmlkZ2VUcmFuc2Zlcih0eCkpIHtcbiAgICByZXR1cm4gdHguYXNzZXQuc3ltYm9sO1xuICB9XG5cbiAgcmV0dXJuIHR4LnN5bWJvbDtcbn07XG4iLCJpbXBvcnQgeyBCcmlkZ2VUcmFuc2FjdGlvbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBCcmlkZ2VUcmFuc2ZlciB9IGZyb20gJ0BhdmFsYWJzL2JyaWRnZS11bmlmaWVkJztcbmltcG9ydCB7IFR4SGlzdG9yeUl0ZW0gfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvaGlzdG9yeS9tb2RlbHMnO1xuXG5leHBvcnQgY29uc3QgRVRIRVJFVU1fQUREUkVTUyA9ICcweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb24oXG4gIGl0ZW06IFR4SGlzdG9yeUl0ZW0gfCBCcmlkZ2VUcmFuc2FjdGlvbiB8IEJyaWRnZVRyYW5zZmVyLFxuKTogaXRlbSBpcyBCcmlkZ2VUcmFuc2FjdGlvbiB8IEJyaWRnZVRyYW5zZmVyIHtcbiAgcmV0dXJuICdhZGRyZXNzQlRDJyBpbiBpdGVtIHx8ICdzb3VyY2VDaGFpbicgaW4gaXRlbTtcbn1cbiJdLCJuYW1lcyI6WyJUb2tlblR5cGUiLCJpc05mdFRva2VuVHlwZSIsInR5cGUiLCJFUkM3MjEiLCJFUkMxMTU1IiwiaXNORlQiLCJ0b2tlbiIsImlzTm9uWFBIaXN0b3J5SXRlbSIsInR4Iiwidm1UeXBlIiwiaXNQY2hhaW5UeEhpc3RvcnlJdGVtIiwiQ2hhaW5JZCIsImlzU29sYW5hTmV0d29yayIsIm5ldHdvcmsiLCJpc1NvbGFuYUNoYWluSWQiLCJjaGFpbklkIiwiU09MQU5BX0RFVk5FVF9JRCIsIlNPTEFOQV9NQUlOTkVUX0lEIiwiU09MQU5BX1RFU1RORVRfSUQiLCJBbGVydFRyaWFuZ2xlSWNvbiIsIkJveCIsIlRvb2x0aXAiLCJ1c2VUaGVtZSIsInVzZVRyYW5zbGF0aW9uIiwiV2FybmluZ0JveCIsIk1hbGljaW91c1Rva2VuV2FybmluZ0JveCIsInByb3BzIiwidCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInRpdGxlIiwidGV4dCIsIk1hbGljaW91c1Rva2VuV2FybmluZ0ljb24iLCJzaXplIiwidGhlbWUiLCJjb2xvciIsInBhbGV0dGUiLCJ3YXJuaW5nIiwibWFpbiIsIlN0YWNrIiwiVHlwb2dyYXBoeSIsIlRydW5jYXRlRmVlQW1vdW50IiwiYW1vdW50IiwiaW50ZWdlciIsImZyYWN0aW9uIiwic3BsaXQiLCJsZW5ndGgiLCJ2YXJpYW50IiwiY29tcG9uZW50Iiwic3giLCJmb250V2VpZ2h0IiwiaW5kZXhPZk5vblplcm8iLCJzZWFyY2giLCJ6ZXJvQ291bnQiLCJzbGljZSIsImZsZXhEaXJlY3Rpb24iLCJjb2x1bW5HYXAiLCJtdCIsIkN1c3RvbVNjcm9sbGJhcnMiLCJmb3J3YXJkUmVmIiwiU2Nyb2xsYmFycyIsInJlZiIsInJlbmRlclRodW1iIiwic3R5bGUiLCJyZXN0IiwidGh1bWJTdHlsZSIsImJhY2tncm91bmRDb2xvciIsImdyZXkiLCJib3JkZXJSYWRpdXMiLCJfZXh0ZW5kcyIsInJlbmRlclRodW1iVmVydGljYWwiLCJpc1VuaWZpZWRCcmlkZ2VUcmFuc2ZlciIsInRyYW5zZmVyIiwidW5kZWZpbmVkIiwiQWxlcnQiLCJBbGVydENvbnRlbnQiLCJHcHBNYXliZUljb24iLCJzZXZlcml0eSIsImljb24iLCJjb21tb24iLCJibGFjayIsImJvcmRlckNvbG9yIiwicHgiLCJ3aWR0aCIsImRpc3BsYXkiLCJ1c2VXYWxsZXRDb250ZXh0IiwiRnJhZ21lbnQiLCJ1c2VFZmZlY3QiLCJ1c2VNZW1vIiwidXNlU3RhdGUiLCJOb1RyYW5zYWN0aW9ucyIsImlzU2FtZURheSIsImVuZE9mWWVzdGVyZGF5IiwiZW5kT2ZUb2RheSIsImZvcm1hdCIsInVzZU5ldHdvcmtDb250ZXh0IiwidXNlQWNjb3VudHNDb250ZXh0IiwiZ2V0RXhwbG9yZXJBZGRyZXNzQnlOZXR3b3JrIiwiQWN0aXZpdHlDYXJkIiwiSW5Qcm9ncmVzc0JyaWRnZUFjdGl2aXR5Q2FyZCIsIkJ1dHRvbiIsIkNoZWNrSWNvbiIsIkNoZXZyb25Eb3duSWNvbiIsIkNoZXZyb25VcEljb24iLCJNZW51SXRlbSIsIk1lbnVMaXN0IiwidXNlUGVuZGluZ0JyaWRnZVRyYW5zYWN0aW9ucyIsIlBjaGFpbkFjdGl2aXR5Q2FyZCIsImlzUGNoYWluTmV0d29yayIsIlBjaGFpbkZpbHRlclR4VHlwZU1hcCIsIlBjaGFpbkZpbHRlclR5cGUiLCJYY2hhaW5GaWx0ZXJUeFR5cGVNYXAiLCJYY2hhaW5GaWx0ZXJUeXBlIiwiaXNYY2hhaW5OZXR3b3JrIiwiZ2V0QWRkcmVzc0ZvckNoYWluIiwiWGNoYWluQWN0aXZpdHlDYXJkIiwiZ2V0QnJpZGdlZEFzc2V0U3ltYm9sIiwiVHJhbnNhY3Rpb25UeXBlIiwiRmlsdGVyVHlwZSIsIldhbGxldFJlY2VudFR4cyIsImlzRW1iZWRkZWQiLCJ0b2tlblN5bWJvbEZpbHRlciIsImkxOG4iLCJGaWx0ZXJJdGVtcyIsIkFMTCIsIkJSSURHRSIsIlNXQVAiLCJORlRTIiwiQ09OVFJBQ1RfQ0FMTCIsIklOQ09NSU5HIiwiT1VUR09JTkciLCJQY2hhaW5GaWx0ZXJJdGVtcyIsIkFERF9ERUxFR0FUT1JfVFgiLCJBRERfU1VCTkVUX1ZBTElEQVRPUl9UWCIsIkFERF9QRVJNSVNTSU9OTEVTU19WQUxJREFUT1JfVFgiLCJBRERfUEVSTUlTU0lPTkxFU1NfREVMRUdBVE9SX1RYIiwiQUREX1ZBTElEQVRPUl9UWCIsIkFEVkFOQ0VfVElNRV9UWCIsIkJBU0VfVFgiLCJDUkVBVEVfQ0hBSU5fVFgiLCJDUkVBVEVfU1VCTkVUX1RYIiwiRVhQT1JUX1RYIiwiSU1QT1JUX1RYIiwiUkVXQVJEX1ZBTElEQVRPUl9UWCIsIlJFTU9WRV9TVUJORVRfVkFMSURBVE9SX1RYIiwiVFJBTlNGRVJfU1VCTkVUX09XTkVSU0hJUF9UWCIsIlRSQU5TRk9STV9TVUJORVRfVFgiLCJYY2hhaW5GaWx0ZXJJdGVtcyIsIkNSRUFURV9BU1NFVF9UWCIsIk9QRVJBVElPTl9UWCIsImdldFRyYW5zYWN0aW9uSGlzdG9yeSIsImFjY291bnRzIiwiYWN0aXZlIiwiYWN0aXZlQWNjb3VudCIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwic2hvd0ZpbHRlck1lbnUiLCJzZXRTaG93RmlsdGVyTWVudSIsInllc3RlcmRheSIsInRvZGF5IiwidW5maWx0ZXJlZFR4SGlzdG9yeSIsInNldFVuZmlsdGVyZWRUeEhpc3RvcnkiLCJzZWxlY3RlZEZpbHRlciIsInNldFNlbGVjdGVkRmlsdGVyIiwiYnJpZGdlVHJhbnNhY3Rpb25zIiwiZmlsdGVyZWRCcmlkZ2VUcmFuc2FjdGlvbnMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmaWx0ZXIiLCJ0aGVuIiwicmVzdWx0IiwiY2F0Y2giLCJmaW5hbGx5IiwiZXhwbG9yZXJVcmwiLCJhZGRyZXNzIiwiYmFzZUZpbHRlcmVkVHhIaXN0b3J5IiwiaXNQZW5kaW5nQnJpZGdlIiwic29tZSIsImJyaWRnZSIsInNvdXJjZVR4SGFzaCIsImhhc2giLCJ0YXJnZXRUeEhhc2giLCJzaG91bGRUeEJlS2VwdCIsImJyaWRnZUFuYWx5c2lzIiwiaXNCcmlkZ2VUeCIsInRva2VucyIsInN5bWJvbCIsInR4SGlzdG9yeUl0ZW1GaWx0ZXIiLCJ0eFR5cGUiLCJpc0NvbnRyYWN0Q2FsbCIsImlzSW5jb21pbmciLCJpc091dGdvaW5nIiwiTkZUX0JVWSIsIlRSQU5TRkVSIiwiTkZUX1JFQ0VJVkUiLCJVTktOT1dOIiwicGNoYWluVHhIaXN0b3J5SXRlbUZpbHRlciIsImlzU2VuZGVyIiwidHlwZUJhc2VkT25GaWx0ZXIiLCJ4Y2hhaW5UeEhpc3RvcnlJdGVtRmlsdGVyIiwiZmlsdGVyZWRUeEhpc3RvcnkiLCJnZXREYXlTdHJpbmciLCJ0aW1lc3RhbXAiLCJkYXRlIiwiRGF0ZSIsImlzVG9kYXkiLCJpc1llc3RlcmRheSIsImxhbmd1YWdlIiwiSW50bCIsIkRhdGVUaW1lRm9ybWF0IiwibW9udGgiLCJkYXkiLCJGaWx0ZXJJdGVtIiwia2V5TmFtZSIsIm9uQ2xpY2siLCJvbkNsaWNrSGFuZGxlciIsImxhYmVsIiwiZGlzYWJsZVJpcHBsZSIsImhlaWdodCIsIm1pbkhlaWdodCIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsInRleHRPdmVyZmxvdyIsIm92ZXJmbG93IiwiaGFuZGxlRmlsdGVyQ2hhbmdlIiwiZmxleEdyb3ciLCJtYXhIZWlnaHQiLCJwIiwicm93R2FwIiwicG9zaXRpb24iLCJyaWdodCIsInNwYWNpbmciLCJ0b3AiLCJjdXJzb3IiLCJtIiwiekluZGV4Iiwia2V5cyIsIm1hcCIsImZpbHRlckl0ZW0iLCJrZXkiLCJpIiwiaW5kZXgiLCJwcmV2aW91c1R4IiwiaXNOZXdEYXkiLCJtYXJnaW4iLCJoaXN0b3J5SXRlbSIsIm15IiwiZnVsbFdpZHRoIiwid2luZG93Iiwib3BlbiIsInNhdG9zaGlUb0J0YyIsIkNhcmQiLCJEaXZpZGVyIiwiRXh0ZXJuYWxMaW5rSWNvbiIsIlRva2VuVW5pdCIsIndlaVRvQXZheCIsImlzQml0Y29pbk5ldHdvcmsiLCJ1c2VBbmFseXRpY3NDb250ZXh0IiwiQmlnIiwiQWN0aXZpdHlDYXJkQW1vdW50IiwiQWN0aXZpdHlDYXJkRGV0YWlscyIsIkFjdGl2aXR5Q2FyZEljb24iLCJBY3Rpdml0eUNhcmRTdW1tYXJ5Iiwic2hvd0RldGFpbHMiLCJzZXRTaG93RGV0YWlscyIsImNhcHR1cmUiLCJzaG93RGV0YWlsc09wdGlvbiIsIk5GVF9TRU5EIiwiU0VORCIsImdhc0Rpc3BsYXlBbW91bnQiLCJOdW1iZXIiLCJnYXNVc2VkIiwidG9GaXhlZCIsInRvU3RyaW5nIiwidW5pdCIsImdhc1ByaWNlIiwidG9EaXNwbGF5Iiwib3B0aW9uYWxEZXRhaWxzQnV0dG9uIiwidHhUaXRsZSIsIlJFQ0VJVkUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJkaXZpZGVyIiwib3JpZW50YXRpb24iLCJmbGV4SXRlbSIsImJvcmRlckJvdHRvbVdpZHRoIiwiaXNUb2dnbGVkT25Ob3ciLCJhcnJvdyIsImV4cGxvcmVyTGluayIsIm5ldHdvcmtUb2tlbiIsInByaW1hcnkiLCJnZXRTb3VyY2VUb2tlbiIsInVzZXJBZGRyZXNzIiwiYWRkcmVzc0MiLCJmaW5kIiwiZnJvbSIsImdldFRhcmdldFRva2VuIiwidG8iLCJzb3VyY2UiLCJ0YXJnZXQiLCJkYXJrIiwiY29sbGVjdGFibGVUb2tlbklkIiwiQVZBWF9UT0tFTiIsIkF2YWxhbmNoZUNvbG9ySWNvbiIsIlRva2VuSWNvbiIsInNyYyIsImltYWdlVXJpIiwibmFtZSIsIkFycm93RG93bkljb24iLCJBcnJvd0Rvd25MZWZ0SWNvbiIsIkFycm93VXBJY29uIiwiQXJyb3dVcFJpZ2h0SWNvbiIsIkJyaWRnZUljb24iLCJOb3Rlc0ljb24iLCJTd2FwSWNvbiIsIkNvbGxlY3RpYmxlTWVkaWEiLCJ0eEljb24iLCJzZXRUeEljb24iLCJnZXROZnRJY29uIiwibWF4V2lkdGgiLCJ1cmwiLCJob3ZlciIsInNob3dQbGF5SWNvbiIsImljb25TaXplIiwiZGVmYXVsdEljb24iLCJ0cnVuY2F0ZUFkZHJlc3MiLCJ1c2VCbG9ja2NoYWluTmFtZXMiLCJzb3VyY2VCbG9ja2NoYWluIiwidGFyZ2V0QmxvY2tjaGFpbiIsInNvdXJjZVRva2VuIiwidGFyZ2V0VG9rZW4iLCJ0eERpcmVjdGlvbiIsInR4QWRkcmVzcyIsIlByaW1hcnlOZXR3b3JrTWV0aG9kSWNvbiIsIlBDaGFpblRyYW5zYWN0aW9uVHlwZSIsInR4QWRkcmVzc2VzVG9TaG93IiwibWV0aG9kTmFtZSIsIkFycmF5IiwiaXNBcnJheSIsIkFkZFVzZXJJY29uIiwiQWlyZHJvcEljb24iLCJBcnJvd1JpZ2h0SWNvbiIsIkJsb2NrY2hhaW5JY29uIiwiQnVpbGRJY29uIiwiQ2hldnJvbkRvdWJsZVVwSWNvbiIsIkNsb2NrSWNvbiIsIkRvd25sb2FkSWNvbiIsIkhlbHBDaXJjbGVJY29uIiwiTWludXNDaXJjbGVJY29uIiwiUmVmcmVzaEljb24iLCJTaGFyZUljb24iLCJWYWxpZGF0b3JJY29uIiwiTUVUSE9EX05BTUVfVE9fSUNPTiIsIkltcG9ydFR4IiwiRXhwb3J0VHgiLCJCYXNlVHgiLCJDcmVhdGVBc3NldFR4IiwiT3BlcmF0aW9uVHgiLCJBZGRQZXJtaXNzaW9ubGVzc0RlbGVnYXRvclR4IiwiQWRkVmFsaWRhdG9yVHgiLCJBZGRTdWJuZXRWYWxpZGF0b3JUeCIsIlRyYW5zZmVyU3VibmV0T3duZXJzaGlwVHgiLCJBZGREZWxlZ2F0b3JUeCIsIkNyZWF0ZVN1Ym5ldFR4IiwiQ3JlYXRlQ2hhaW5UeCIsIlRyYW5zZm9ybVN1Ym5ldFR4IiwiQWRkUGVybWlzc2lvbmxlc3NWYWxpZGF0b3JUeCIsIlJlbW92ZVN1Ym5ldFZhbGlkYXRvclR4IiwiUmV3YXJkVmFsaWRhdG9yVHgiLCJBZHZhbmNlVGltZVR4IiwiQ09OVkVSVF9TVUJORVRfVE9fTDFUWCIsIlJFR0lTVEVSX0wxVkFMSURBVE9SX1RYIiwiU0VUX0wxVkFMSURBVE9SX1dFSUdIVF9UWCIsIkRJU0FCTEVfTDFWQUxJREFUT1JfVFgiLCJJTkNSRUFTRV9MMVZBTElEQVRPUl9CQUxBTkNFX1RYIiwiSWNvbiIsIlhDaGFpblRyYW5zYWN0aW9uVHlwZSIsInVzZUJyaWRnZVNESyIsInRvYXN0IiwiVG9hc3RDYXJkIiwidXNlQnJpZGdlQ29udGV4dCIsImJsb2NrY2hhaW5Ub05ldHdvcmsiLCJuZXR3b3JrVG9CbG9ja2NoYWluIiwidXNlSGlzdG9yeSIsIkluUHJvZ3Jlc3NCcmlkZ2VJY29uIiwiYmlnaW50VG9CaWciLCJ1c2VVbmlmaWVkQnJpZGdlQ29udGV4dCIsImhpc3RvcnkiLCJuZXR3b3JrcyIsImJyaWRnZUNvbmZpZyIsInRvYXN0U2hvd24iLCJzZXRUb2FzdFNob3duIiwicmVtb3ZlQnJpZGdlVHJhbnNhY3Rpb24iLCJnZXRFcnJvck1lc3NhZ2UiLCJuZXR3b3JrRGF0YSIsInNvdXJjZUNoYWluIiwiaW5Qcm9ncmVzc1ZhbHVlIiwidG90YWxDb25maXJtYXRpb25zUmVxdWlyZWQiLCJzb3VyY2VSZXF1aXJlZENvbmZpcm1hdGlvbkNvdW50IiwidGFyZ2V0UmVxdWlyZWRDb25maXJtYXRpb25Db3VudCIsInRvdGFsQ29uZmlybWF0aW9uc09idGFpbmVkIiwic291cmNlQ29uZmlybWF0aW9uQ291bnQiLCJ0YXJnZXRDb25maXJtYXRpb25Db3VudCIsIk1hdGgiLCJtaW4iLCJjb25maXJtYXRpb25Db3VudCIsInJlcXVpcmVkQ29uZmlybWF0aW9uQ291bnQiLCJjdXJyZW50Q291bnQiLCJhc3NldCIsImRlY2ltYWxzIiwiY29tcGxldGVkQXQiLCJpc1N1Y2Nlc3NmdWwiLCJlcnJvckNvZGUiLCJ0b2FzdElkIiwiY3VzdG9tIiwib25EaXNtaXNzIiwicmVtb3ZlIiwiZHVyYXRpb24iLCJJbmZpbml0eSIsImhhc0Vycm9yIiwidmFsdWUiLCJjaGFpbk5hbWUiLCJwdXNoIiwic291cmNlU3RhcnRlZEF0IiwiQ2lyY3VsYXJQcm9ncmVzcyIsInRoaWNrbmVzcyIsImRpc2FibGVTaHJpbmsiLCJlcnJvciIsInNlY29uZGFyeSIsImlzUGVuZGluZ0JyaWRnZVRyYW5zYWN0aW9uIiwiaXRlbSIsInBlbmRpbmciLCJnZXROZXR3b3JrIiwidGl0bGVDYXNlIiwidGFyZ2V0Q2hhaW4iLCJzb3VyY2VDaGFpbklkIiwidGFyZ2V0Q2hhaW5JZCIsInRvVXBwZXJDYXNlIiwiRVRIRVJFVU1fQUREUkVTUyJdLCJzb3VyY2VSb290IjoiIn0=