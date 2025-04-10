"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ApproveAction_AvalancheSignTx_tsx"],{

/***/ "./node_modules/@avalabs/core-utils-sdk/esm/bigIntToString.js":
/*!********************************************************************!*\
  !*** ./node_modules/@avalabs/core-utils-sdk/esm/bigIntToString.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bigIntToString": () => (/* binding */ t)
/* harmony export */ });
function t(t,n){n=Math.floor(n);const e=t.toString(),o=Math.max(e.length-n,0),r=e.slice(o).padStart(n,"0"),a=e.slice(0,o)||"0";return r.length?`${a}.${r}`:a}


/***/ }),

/***/ "./node_modules/@avalabs/core-utils-sdk/esm/bigToLocaleString.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@avalabs/core-utils-sdk/esm/bigToLocaleString.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bigToLocaleString": () => (/* binding */ t)
/* harmony export */ });
function t(t,n=9){const e=t.toFixed(n).split("."),r=parseInt(e[0]).toLocaleString("en-US");if(1===e.length)return r;{let t=e[1],o=t.charAt(t.length-1);for(;"0"===o;)t=t.substring(0,t.length-1),o=t.charAt(t.length-1);const s=t.substring(0,n);return s?`${r}.${s}`:r}}


/***/ }),

/***/ "./node_modules/@avalabs/core-utils-sdk/esm/bnToBig.js":
/*!*************************************************************!*\
  !*** ./node_modules/@avalabs/core-utils-sdk/esm/bnToBig.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bnToBig": () => (/* binding */ t)
/* harmony export */ });
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_0__);
function t(t,n=0){const r=big_js__WEBPACK_IMPORTED_MODULE_0___default()(10).pow(n);return new (big_js__WEBPACK_IMPORTED_MODULE_0___default())(t.toString()).div(r)}


/***/ }),

/***/ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/models.js":
/*!************************************************************************!*\
  !*** ./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/models.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TxType": () => (/* binding */ e),
/* harmony export */   "isAddDelegatorTx": () => (/* binding */ r),
/* harmony export */   "isAddPermissionlessDelegatorTx": () => (/* binding */ v),
/* harmony export */   "isAddPermissionlessValidatorTx": () => (/* binding */ f),
/* harmony export */   "isAddSubnetValidatorTx": () => (/* binding */ p),
/* harmony export */   "isAddValidatorTx": () => (/* binding */ t),
/* harmony export */   "isBaseTx": () => (/* binding */ o),
/* harmony export */   "isConvertSubnetToL1Tx": () => (/* binding */ i),
/* harmony export */   "isCreateChainTx": () => (/* binding */ c),
/* harmony export */   "isCreateSubnetTx": () => (/* binding */ l),
/* harmony export */   "isDisableL1ValidatorTx": () => (/* binding */ _),
/* harmony export */   "isExportTx": () => (/* binding */ n),
/* harmony export */   "isImportTx": () => (/* binding */ a),
/* harmony export */   "isIncreaseL1ValidatorBalance": () => (/* binding */ u),
/* harmony export */   "isRegisterL1ValidatorTx": () => (/* binding */ d),
/* harmony export */   "isRemoveSubnetValidatorTx": () => (/* binding */ b),
/* harmony export */   "isSetL1ValidatorWeightTx": () => (/* binding */ s),
/* harmony export */   "isTransferSubnetOwnershipTx": () => (/* binding */ m),
/* harmony export */   "isTransformSubnetTx": () => (/* binding */ y)
/* harmony export */ });
var e=(e=>(e.Base="base",e.AddValidator="add_validator",e.AddDelegator="add_delegator",e.Export="export",e.Import="import",e.CreateSubnet="create_subnet",e.CreateChain="create_chain",e.ConvertSubnetToL1="convert_subnet_to_l1",e.RegisterL1Validator="register_l1_validator",e.SetL1ValidatorWeight="set_l1_validator_weight",e.IncreaseL1ValidatorBalance="increase_l1_validator_balance",e.DisableL1Validator="disable_l1_validator",e.AddSubnetValidator="add_subnet_validator",e.RemoveSubnetValidator="remove_subnet_validator",e.AddPermissionlessValidator="add_permissionless_validator",e.AddPermissionlessDelegator="add_permissionless_delegator",e.TransformSubnet="transform_subnet",e.TransferSubnetOwnership="transfer_subnet_ownership",e.Unknown="unknown",e))(e||{});function t(e){return"add_validator"===e.type}function r(e){return"add_delegator"===e.type}function n(e){return"export"===e.type}function a(e){return"import"===e.type}function o(e){return"base"===e.type}function i(e){return"convert_subnet_to_l1"===e.type}function d(e){return"register_l1_validator"===e.type}function s(e){return"set_l1_validator_weight"===e.type}function _(e){return"disable_l1_validator"===e.type}function u(e){return"increase_l1_validator_balance"===e.type}function l(e){return"create_subnet"===e.type}function c(e){return"create_chain"===e.type}function p(e){return"add_subnet_validator"===e.type}function b(e){return"remove_subnet_validator"===e.type}function f(e){return"add_permissionless_validator"===e.type}function v(e){return"add_permissionless_delegator"===e.type}function y(e){return"transform_subnet"===e.type}function m(e){return"transfer_subnet_ownership"===e.type}


/***/ }),

/***/ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/utils/getUnixNow.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/utils/getUnixNow.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUnixNow": () => (/* binding */ t)
/* harmony export */ });
function t(){return BigInt(Math.floor(Date.now()/1e3))}


/***/ }),

/***/ "./src/background/services/wallet/handlers/eth_sendTransaction/models.ts":
/*!*******************************************************************************!*\
  !*** ./src/background/services/wallet/handlers/eth_sendTransaction/models.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AvalancheChainStrings": () => (/* binding */ AvalancheChainStrings),
/* harmony export */   "TransactionType": () => (/* binding */ TransactionType),
/* harmony export */   "isTxParams": () => (/* binding */ isTxParams)
/* harmony export */ });
let AvalancheChainStrings = /*#__PURE__*/function (AvalancheChainStrings) {
  AvalancheChainStrings["AVM"] = "X Chain";
  AvalancheChainStrings["PVM"] = "P Chain";
  AvalancheChainStrings["EVM"] = "C Chain";
  return AvalancheChainStrings;
}({});
let TransactionType = /*#__PURE__*/function (TransactionType) {
  TransactionType["SEND_TOKEN"] = "send_token";
  TransactionType["SEND_NFT"] = "send_nft";
  TransactionType["APPROVE_TOKEN"] = "approve_token";
  TransactionType["APPROVE_NFT"] = "approve_nft";
  TransactionType["APPROVE_NFT_COLLECTION"] = "approve_nft_collection";
  TransactionType["REVOKE_TOKEN_APPROVAL"] = "revoke_token_approval";
  TransactionType["REVOKE_NFT_APPROVAL"] = "revoke_nft_approval";
  TransactionType["REVOKE_NFT_COLLECTION_APPROVAL"] = "revoke_nft_collection_approval";
  TransactionType["CANCEL_TX"] = "cancel_tx";
  TransactionType["DEPLOY_CONTRACT"] = "deploy_contract";
  TransactionType["SWAP"] = "swap";
  TransactionType["ADD_LIQUIDITY"] = "add_liquidity";
  TransactionType["CALL"] = "call";
  return TransactionType;
}({});
function isTxParams(params) {
  return !!params.from;
}

/***/ }),

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

/***/ "./src/components/common/approval/TxDetailsRow.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/approval/TxDetailsRow.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TxDetailsRow": () => (/* binding */ TxDetailsRow)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const TxDetailsRow = ({
  children,
  label
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 1
    }
  }, typeof label === 'string' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    color: "text.secondary"
  }, label) : label, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1,
      minHeight: theme.spacing(2),
      minWidth: '0px',
      wordWrap: 'break-word'
    }
  }, children));
};

/***/ }),

/***/ "./src/hooks/useTokenPrice.ts":
/*!************************************!*\
  !*** ./src/hooks/useTokenPrice.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useNativeTokenPrice": () => (/* binding */ useNativeTokenPrice)
/* harmony export */ });
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function useNativeTokenPrice(network) {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_1__.useConnectionContext)();
  const [price, setPrice] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    const tokenId = network?.pricingProviders?.coingecko.nativeTokenId;
    if (tokenId) {
      request({
        method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__.ExtensionRequest.TOKEN_PRICE_GET,
        params: [tokenId]
      }).then(p => setPrice(p || 0)).catch(() => setPrice(0));
    } else {
      setPrice(0);
    }
  }, [network, request]);
  return price;
}

/***/ }),

/***/ "./src/pages/ApproveAction/AvalancheSignTx.tsx":
/*!*****************************************************!*\
  !*** ./src/pages/ApproveAction/AvalancheSignTx.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AvalancheSignTx": () => (/* binding */ AvalancheSignTx)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/models.js");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/common/LoadingOverlay */ "./src/components/common/LoadingOverlay.tsx");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _components_ApproveImportTx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/ApproveImportTx */ "./src/pages/ApproveAction/components/ApproveImportTx.tsx");
/* harmony import */ var _components_ApproveExportTx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/ApproveExportTx */ "./src/pages/ApproveAction/components/ApproveExportTx.tsx");
/* harmony import */ var _components_ApproveAddValidator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/ApproveAddValidator */ "./src/pages/ApproveAction/components/ApproveAddValidator.tsx");
/* harmony import */ var _components_ApproveAddDelegator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/ApproveAddDelegator */ "./src/pages/ApproveAction/components/ApproveAddDelegator.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_hooks_useTokenPrice__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/hooks/useTokenPrice */ "./src/hooks/useTokenPrice.ts");
/* harmony import */ var _components_ApproveBaseTx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/ApproveBaseTx */ "./src/pages/ApproveAction/components/ApproveBaseTx.tsx");
/* harmony import */ var _SignTransaction_hooks_useLedgerDisconnectedDialog__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../SignTransaction/hooks/useLedgerDisconnectedDialog */ "./src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog.tsx");
/* harmony import */ var _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/contexts/LedgerProvider */ "./src/contexts/LedgerProvider.tsx");
/* harmony import */ var _SignTransaction_components_LedgerApprovalOverlay__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../SignTransaction/components/LedgerApprovalOverlay */ "./src/pages/SignTransaction/components/LedgerApprovalOverlay.tsx");
/* harmony import */ var _src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @src/hooks/useIsUsingLedgerWallet */ "./src/hooks/useIsUsingLedgerWallet.ts");
/* harmony import */ var _components_ApproveCreateSubnet__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/ApproveCreateSubnet */ "./src/pages/ApproveAction/components/ApproveCreateSubnet.tsx");
/* harmony import */ var _components_ApproveCreateChain__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/ApproveCreateChain */ "./src/pages/ApproveAction/components/ApproveCreateChain.tsx");
/* harmony import */ var _components_ApproveAddSubnetValidator__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/ApproveAddSubnetValidator */ "./src/pages/ApproveAction/components/ApproveAddSubnetValidator.tsx");
/* harmony import */ var _components_AvalancheTxHeader__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/AvalancheTxHeader */ "./src/pages/ApproveAction/components/AvalancheTxHeader.tsx");
/* harmony import */ var _components_ExcessiveBurnWarningDialog__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/ExcessiveBurnWarningDialog */ "./src/pages/ApproveAction/components/ExcessiveBurnWarningDialog.tsx");
/* harmony import */ var _src_hooks_useIsUsingWalletConnectAccount__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @src/hooks/useIsUsingWalletConnectAccount */ "./src/hooks/useIsUsingWalletConnectAccount.ts");
/* harmony import */ var _SignTransaction_components_WalletConnectApproval_WalletConnectApprovalOverlay__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay */ "./src/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay.tsx");
/* harmony import */ var _src_hooks_useApprovalHelpers__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @src/hooks/useApprovalHelpers */ "./src/hooks/useApprovalHelpers.ts");
/* harmony import */ var _src_pages_ApproveAction_components_ApproveAddPermissionlessValidator__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @src/pages/ApproveAction/components/ApproveAddPermissionlessValidator */ "./src/pages/ApproveAction/components/ApproveAddPermissionlessValidator.tsx");
/* harmony import */ var _src_pages_ApproveAction_components_ApproveAddPermissionlessDelegator__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @src/pages/ApproveAction/components/ApproveAddPermissionlessDelegator */ "./src/pages/ApproveAction/components/ApproveAddPermissionlessDelegator.tsx");
/* harmony import */ var _src_hooks_useIsUsingFireblocksAccount__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @src/hooks/useIsUsingFireblocksAccount */ "./src/hooks/useIsUsingFireblocksAccount.ts");
/* harmony import */ var _SignTransaction_components_FireblocksApproval_FireblocksApprovalOverlay__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay */ "./src/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay.tsx");
/* harmony import */ var _components_ApproveRemoveSubnetValidator__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./components/ApproveRemoveSubnetValidator */ "./src/pages/ApproveAction/components/ApproveRemoveSubnetValidator.tsx");
/* harmony import */ var _src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @src/components/common/FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* harmony import */ var _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @src/hooks/useIsFunctionAvailable */ "./src/hooks/useIsFunctionAvailable.ts");
/* harmony import */ var _components_ApproveConvertSubnetToL1__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./components/ApproveConvertSubnetToL1 */ "./src/pages/ApproveAction/components/ApproveConvertSubnetToL1.tsx");
/* harmony import */ var _components_ApproveRegisterL1Validator__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./components/ApproveRegisterL1Validator */ "./src/pages/ApproveAction/components/ApproveRegisterL1Validator.tsx");
/* harmony import */ var _components_ApproveIncreaseL1ValidatorBalance__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./components/ApproveIncreaseL1ValidatorBalance */ "./src/pages/ApproveAction/components/ApproveIncreaseL1ValidatorBalance.tsx");
/* harmony import */ var _components_ApproveDisableL1Validator__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./components/ApproveDisableL1Validator */ "./src/pages/ApproveAction/components/ApproveDisableL1Validator.tsx");
/* harmony import */ var _components_ApproveSetL1ValidatorWeight__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./components/ApproveSetL1ValidatorWeight */ "./src/pages/ApproveAction/components/ApproveSetL1ValidatorWeight.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







































function AvalancheSignTx() {
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_2__.useGetRequestId)();
  const {
    action,
    updateAction,
    cancelHandler
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_1__.useApproveAction)(requestId);
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_9__.useNetworkContext)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_36__.useTranslation)();
  const {
    isFunctionAvailable: isSigningAvailable
  } = (0,_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_30__.useIsFunctionAvailable)(_src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_30__.FunctionNames.SIGN);
  const tokenPrice = (0,_src_hooks_useTokenPrice__WEBPACK_IMPORTED_MODULE_10__.useNativeTokenPrice)(network);
  const isUsingLedgerWallet = (0,_src_hooks_useIsUsingLedgerWallet__WEBPACK_IMPORTED_MODULE_15__["default"])();
  const isWalletConnectAccount = (0,_src_hooks_useIsUsingWalletConnectAccount__WEBPACK_IMPORTED_MODULE_21__["default"])();
  const isFireblocksAccount = (0,_src_hooks_useIsUsingFireblocksAccount__WEBPACK_IMPORTED_MODULE_26__["default"])();
  const [showBurnWarning, setShowBurnWarning] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const txData = action?.displayData.txData;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // When the transaction details are loading, `txData` may be undefined,
    // so we need to listen for it to be populated and then make sure
    // `isValidAvaxBurnedAmount` is false (not just falsey).
    const couldBurnExcessAmount = txData?.isValidAvaxBurnedAmount === false;
    if (couldBurnExcessAmount) {
      setShowBurnWarning(true);
    }
  }, [txData?.isValidAvaxBurnedAmount]);
  (0,_SignTransaction_hooks_useLedgerDisconnectedDialog__WEBPACK_IMPORTED_MODULE_12__.useLedgerDisconnectedDialog)(() => handleRejection(), _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_13__.LedgerAppType.AVALANCHE, network);
  const signTx = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    await updateAction({
      status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_4__.ActionStatus.SUBMITTING,
      id: requestId
    }, isUsingLedgerWallet || isWalletConnectAccount || isFireblocksAccount);
  }, [updateAction, requestId, isUsingLedgerWallet, isWalletConnectAccount, isFireblocksAccount]);
  const {
    handleApproval,
    handleRejection,
    isApprovalOverlayVisible
  } = (0,_src_hooks_useApprovalHelpers__WEBPACK_IMPORTED_MODULE_23__.useApprovalHelpers)({
    onApprove: signTx,
    onReject: cancelHandler
  });
  const renderDeviceApproval = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (isApprovalOverlayVisible) {
      if (isUsingLedgerWallet) {
        return /*#__PURE__*/React.createElement(_SignTransaction_components_LedgerApprovalOverlay__WEBPACK_IMPORTED_MODULE_14__.LedgerApprovalOverlay, null);
      }
      if (isWalletConnectAccount) {
        return /*#__PURE__*/React.createElement(_SignTransaction_components_WalletConnectApproval_WalletConnectApprovalOverlay__WEBPACK_IMPORTED_MODULE_22__.WalletConnectApprovalOverlay, {
          onReject: handleRejection,
          onSubmit: handleApproval
        });
      }
      if (isFireblocksAccount) {
        return /*#__PURE__*/React.createElement(_SignTransaction_components_FireblocksApproval_FireblocksApprovalOverlay__WEBPACK_IMPORTED_MODULE_27__.FireblocksApprovalOverlay, {
          onReject: handleRejection,
          onSubmit: handleApproval
        });
      }
    }
  }, [isApprovalOverlayVisible, isUsingLedgerWallet, isWalletConnectAccount, isFireblocksAccount, handleRejection, handleApproval]);
  const renderSignTxDetails = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(tx => {
    if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isAddValidatorTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveAddValidator__WEBPACK_IMPORTED_MODULE_7__.AddValidator, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isAddDelegatorTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveAddDelegator__WEBPACK_IMPORTED_MODULE_8__.AddDelegator, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isExportTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveExportTx__WEBPACK_IMPORTED_MODULE_6__.ExportTxView, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isImportTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveImportTx__WEBPACK_IMPORTED_MODULE_5__.ImportTxView, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isBaseTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveBaseTx__WEBPACK_IMPORTED_MODULE_11__.BaseTxView, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isConvertSubnetToL1Tx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveConvertSubnetToL1__WEBPACK_IMPORTED_MODULE_31__.ApproveConvertSubnetToL1, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isRegisterL1ValidatorTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveRegisterL1Validator__WEBPACK_IMPORTED_MODULE_32__.ApproveRegisterL1Validator, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isDisableL1ValidatorTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveDisableL1Validator__WEBPACK_IMPORTED_MODULE_34__.ApproveDisableL1Validator, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isSetL1ValidatorWeightTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveSetL1ValidatorWeight__WEBPACK_IMPORTED_MODULE_35__.ApproveSetL1ValidatorWeight, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isIncreaseL1ValidatorBalance(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveIncreaseL1ValidatorBalance__WEBPACK_IMPORTED_MODULE_33__.ApproveIncreaseL1ValidatorBalance, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isCreateSubnetTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveCreateSubnet__WEBPACK_IMPORTED_MODULE_16__.ApproveCreateSubnet, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isCreateChainTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveCreateChain__WEBPACK_IMPORTED_MODULE_17__.ApproveCreateChain, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isAddSubnetValidatorTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveAddSubnetValidator__WEBPACK_IMPORTED_MODULE_18__.AddSubnetValidatorView, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isRemoveSubnetValidatorTx(tx)) {
      return /*#__PURE__*/React.createElement(_components_ApproveRemoveSubnetValidator__WEBPACK_IMPORTED_MODULE_28__.RemoveSubnetValidatorView, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isAddPermissionlessValidatorTx(tx)) {
      return /*#__PURE__*/React.createElement(_src_pages_ApproveAction_components_ApproveAddPermissionlessValidator__WEBPACK_IMPORTED_MODULE_24__.AddPermissionlessValidator, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    } else if (_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_37__.isAddPermissionlessDelegatorTx(tx)) {
      return /*#__PURE__*/React.createElement(_src_pages_ApproveAction_components_ApproveAddPermissionlessDelegator__WEBPACK_IMPORTED_MODULE_25__.AddPermissionlessDelegator, {
        tx: tx,
        avaxPrice: tokenPrice
      });
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, "UNKNOWN TX");
  }, [tokenPrice]);
  if (!action) {
    return /*#__PURE__*/React.createElement(_components_common_LoadingOverlay__WEBPACK_IMPORTED_MODULE_3__.LoadingOverlay, null);
  }
  if (!isSigningAvailable) {
    return /*#__PURE__*/React.createElement(_src_components_common_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_29__.FunctionIsOffline, {
      functionName: _src_hooks_useIsFunctionAvailable__WEBPACK_IMPORTED_MODULE_30__.FunctionNames.FEATURE,
      hidePageTitle: true
    });
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_38__.Stack, {
    sx: {
      px: 2,
      width: 1,
      height: 1
    }
  }, renderDeviceApproval(), /*#__PURE__*/React.createElement(_components_AvalancheTxHeader__WEBPACK_IMPORTED_MODULE_19__.AvalancheTxHeader, {
    tx: txData
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_38__.Scrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_38__.Stack, {
    sx: {
      gap: 3.5
    }
  }, renderSignTxDetails(txData))), /*#__PURE__*/React.createElement(_components_ExcessiveBurnWarningDialog__WEBPACK_IMPORTED_MODULE_20__.ExcessiveBurnWarningDialog, {
    open: showBurnWarning,
    onContinue: () => setShowBurnWarning(false),
    onReject: handleRejection
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_38__.Stack, {
    sx: {
      pt: 3,
      pb: 1,
      flexDirection: 'row',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_38__.Button, {
    fullWidth: true,
    size: "large",
    color: "secondary",
    onClick: handleRejection
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_38__.Button, {
    fullWidth: true,
    size: "large",
    onClick: handleApproval
  }, t('Approve'))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveAddDelegator.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveAddDelegator.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddDelegator": () => (/* binding */ AddDelegator)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bigToLocaleString.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/bigintToBig */ "./src/utils/bigintToBig.ts");
/* harmony import */ var _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/wallet/handlers/eth_sendTransaction/models */ "./src/background/services/wallet/handlers/eth_sendTransaction/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function AddDelegator({
  tx,
  avaxPrice
}) {
  const {
    nodeID,
    start,
    end,
    stake,
    chain,
    txFee
  } = tx;
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__.useSettingsContext)();
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);
  const fee = (0,_src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_1__.bigintToBig)(txFee, 9);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 2,
      mb: 1,
      mx: 0
    }
  }, t('Chain'), ": ", _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_2__.AvalancheChainStrings[chain]), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Node ID'), ":"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption"
  }, nodeID)))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 3,
      mb: 1,
      mx: 0
    }
  }, t('Details')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Stake Amount'), ":"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__.bigToLocaleString)((0,_src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_1__.bigintToBig)(stake, 9), 4), " AVAX"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, currencyFormatter((0,_src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_1__.bigintToBig)(stake, 9).times(avaxPrice).toNumber())))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Start Date'), ":"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, startDate.toLocaleString())), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('End Date:')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, endDate.toLocaleString())), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Fee Amount'), ":"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__.bigToLocaleString)(fee, 4), " AVAX"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, currencyFormatter(fee.times(avaxPrice).toNumber())))))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveAddPermissionlessDelegator.tsx":
/*!**********************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveAddPermissionlessDelegator.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddPermissionlessDelegator": () => (/* binding */ AddPermissionlessDelegator)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* harmony import */ var _src_utils_isPrimarySubnet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/isPrimarySubnet */ "./src/utils/isPrimarySubnet.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function AddPermissionlessDelegator({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const {
    nodeID,
    txFee,
    start,
    end,
    stake,
    subnetID
  } = tx;
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);
  const isPrimaryNetwork = (0,_src_utils_isPrimarySubnet__WEBPACK_IMPORTED_MODULE_4__.isPrimarySubnet)(subnetID);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Staking Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Node ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: nodeID
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Subnet ID')
  }, isPrimaryNetwork ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "caption"
  }, t('Primary Network')) : /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: subnetID
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Stake Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: stake,
    avaxPrice: avaxPrice
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Divider, {
    sx: {
      my: 1.25
    }
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Start Date')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "caption"
  }, startDate.toLocaleString())), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('End Date')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "caption"
  }, endDate.toLocaleString())))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveAddPermissionlessValidator.tsx":
/*!**********************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveAddPermissionlessValidator.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddPermissionlessValidator": () => (/* binding */ AddPermissionlessValidator)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* harmony import */ var _src_utils_isPrimarySubnet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/isPrimarySubnet */ "./src/utils/isPrimarySubnet.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function AddPermissionlessValidator({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const {
    nodeID,
    txFee,
    start,
    end,
    stake,
    delegationFee,
    subnetID,
    publicKey,
    signature
  } = tx;
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);
  const isPrimaryNetwork = (0,_src_utils_isPrimarySubnet__WEBPACK_IMPORTED_MODULE_4__.isPrimarySubnet)(subnetID);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Staking Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Node ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: nodeID
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Subnet ID')
  }, isPrimaryNetwork ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "caption",
    sx: {
      mr: 2.8
    }
  }, t('Primary Network')) : /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: subnetID
  })), publicKey && signature && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Public Key')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: publicKey
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Proof')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: signature
  }))), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Stake Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: stake,
    avaxPrice: avaxPrice
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Delegation Fee')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "caption"
  }, delegationFee / 10000, "%")), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Divider, {
    sx: {
      my: 1.25
    }
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Start Date')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "caption"
  }, startDate.toLocaleString())), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('End Date')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "caption"
  }, endDate.toLocaleString())))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveAddSubnetValidator.tsx":
/*!**************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveAddSubnetValidator.tsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddSubnetValidatorView": () => (/* binding */ AddSubnetValidatorView)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function AddSubnetValidatorView({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    txFee,
    nodeID,
    start,
    end,
    subnetID,
    stake
  } = tx;
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Staking Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Subnet ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: subnetID
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Node ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: nodeID
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Stake Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: stake,
    avaxPrice: avaxPrice
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Divider, {
    sx: {
      my: 1.25
    }
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Start Date')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "caption"
  }, startDate.toLocaleString())), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('End Date')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "caption"
  }, endDate.toLocaleString())))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveAddValidator.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveAddValidator.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddValidator": () => (/* binding */ AddValidator)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function AddValidator({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    nodeID,
    txFee,
    start,
    end,
    stake,
    delegationFee
  } = tx;
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Staking Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Node ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: nodeID
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Stake Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: stake,
    avaxPrice: avaxPrice
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Delegation Fee')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "caption"
  }, delegationFee / 10000, "%")), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Divider, {
    sx: {
      my: 1.25
    }
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Start Date')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "caption"
  }, startDate.toLocaleString())), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('End Date')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "caption"
  }, endDate.toLocaleString())))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveBaseTx.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveBaseTx.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseTxView": () => (/* binding */ BaseTxView)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bigIntToString.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/utils/getUnixNow.js");
/* harmony import */ var _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/wallet/handlers/eth_sendTransaction/models */ "./src/background/services/wallet/handlers/eth_sendTransaction/models.ts");
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function BaseTxView({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__.useSettingsContext)();
  const {
    chain,
    txFee,
    outputs,
    memo
  } = tx;
  const defaultDenomination = chain === _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.PVM ? 9 : 0;
  const isDateFuture = date => {
    const now = _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.getUnixNow();
    return date > now;
  };
  const unixToLocaleString = date => {
    return new Date(Number(date.toString()) * 1000).toLocaleString();
  };
  const getDisplayAmount = (value, decimals) => {
    return Number((0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__.bigIntToString)(value, decimals).replace(/,/g, '') // Remove thousand separators which makes Number to return NaN
    );
  };

  const fee = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_6__.TokenUnit(txFee, 9, 'AVAX');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Source Chain')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption"
  }, _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__.AvalancheChainStrings[chain]))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 2,
      mb: 1,
      mx: 0
    }
  }, t('Details')), outputs.map(out => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Card, {
    key: out.assetDescription?.assetID,
    sx: {
      width: 1,
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, out.isAvax && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.AvalancheColorIcon, {
    size: '32px',
    sx: {
      mr: 1
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "h6"
  }, out.assetDescription?.symbol ?? (out.isAvax && 'AVAX'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, getDisplayAmount(out.amount, out.assetDescription?.denomination || defaultDenomination), ' ', out.assetDescription?.symbol ?? (out.isAvax ? 'AVAX' : '')), out.isAvax && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      textAlign: 'right',
      color: 'text.secondary'
    }
  }, currencyFormatter(getDisplayAmount(out.amount, out.assetDescription?.denomination || defaultDenomination) * avaxPrice)))), isDateFuture(out.locktime) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      mt: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Locktime')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, unixToLocaleString(out.locktime))), out.owners.length > 1 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      mt: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Threshold')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, out.threshold.toString())), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      mt: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, null, t('Recipients')), out.owners.map(address => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    key: address,
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, address)))))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 1,
      mb: 1,
      mx: 0
    }
  }, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Fee Amount')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, fee.toDisplay(), " AVAX"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      textAlign: 'right',
      color: 'text.secondary'
    }
  }, currencyFormatter(fee.toDisplay({
    asNumber: true
  }) * avaxPrice))))))), chain !== _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.PVM && memo && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 3,
      mb: 1,
      mx: 0
    }
  }, t('Memo')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, memo)))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveConvertSubnetToL1.tsx":
/*!*************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveConvertSubnetToL1.tsx ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApproveConvertSubnetToL1": () => (/* binding */ ApproveConvertSubnetToL1)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function ApproveConvertSubnetToL1({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    txFee,
    chainID,
    managerAddress,
    subnetID,
    validators
  } = tx;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Subnet Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Subnet ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: subnetID,
    size: 14
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Chain ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: chainID,
    size: 14
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Manager Address')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: managerAddress,
    size: 14
  })))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Validators')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    },
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Divider, {
      sx: {
        my: 1.5
      }
    })
  }, validators.map(({
    balance,
    stake,
    nodeId,
    remainingBalanceOwners,
    deactivationOwners
  }) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    key: nodeId,
    sx: {
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Node ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: nodeId,
    size: 14
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Balance')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: balance,
    avaxPrice: avaxPrice
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Stake')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: stake,
    avaxPrice: avaxPrice
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      gap: 1,
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "caption",
    color: "text.secondary"
  }, t('Owners Able to Deactivate')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      pl: 2,
      gap: 0.5
    }
  }, deactivationOwners.map(address => /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    key: address,
    identifier: address,
    size: 14
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "caption",
    color: "text.secondary"
  }, t('Owners of the Remaining Balance')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      pl: 2,
      gap: 0.5
    }
  }, remainingBalanceOwners.map(address => /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    key: address,
    identifier: address,
    size: 14
  })))))))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveCreateChain.tsx":
/*!*******************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveCreateChain.tsx ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApproveCreateChain": () => (/* binding */ ApproveCreateChain)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* harmony import */ var _BlockchainGenesisFile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BlockchainGenesisFile */ "./src/pages/ApproveAction/components/BlockchainGenesisFile.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function ApproveCreateChain({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    chainID,
    chainName,
    vmID,
    genesisData,
    txFee
  } = tx;
  const [isGenesisFileShown, setIsGenesisFileShown] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, isGenesisFileShown && /*#__PURE__*/React.createElement(_BlockchainGenesisFile__WEBPACK_IMPORTED_MODULE_5__.BlockchainGenesisFile, {
    data: genesisData,
    onClose: () => setIsGenesisFileShown(false)
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_1__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_1__.ApprovalSectionHeader, {
    label: t('Blockchain Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_1__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_2__.TxDetailsRow, {
    label: t('Blockchain Name')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption"
  }, chainName)), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_2__.TxDetailsRow, {
    label: t('Blockchain ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_4__.TruncatedIdentifier, {
    identifier: chainID
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_2__.TxDetailsRow, {
    label: t('Genesis File')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    variant: "text",
    size: "small",
    onClick: () => setIsGenesisFileShown(true)
  }, t('View'))), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_2__.TxDetailsRow, {
    label: t('Virtual Machine ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_4__.TruncatedIdentifier, {
    identifier: vmID
  })))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_1__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_1__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_1__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_2__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveCreateSubnet.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveCreateSubnet.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApproveCreateSubnet": () => (/* binding */ ApproveCreateSubnet)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






function ApproveCreateSubnet({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    threshold,
    controlKeys,
    txFee
  } = tx;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Subnet Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: controlKeys.length > 1 ? t('Owners') : t('Owner')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      gap: 0.5
    }
  }, controlKeys.map(key => /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    key: key,
    identifier: key,
    size: 14
  })))), controlKeys.length > 1 && /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Signature Threshold')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "caption"
  }, threshold, "/", controlKeys.length)))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveDisableL1Validator.tsx":
/*!**************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveDisableL1Validator.tsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApproveDisableL1Validator": () => (/* binding */ ApproveDisableL1Validator)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function ApproveDisableL1Validator({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    txFee,
    validationId
  } = tx;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Validation ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_3__.TruncatedIdentifier, {
    identifier: validationId
  })))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_2__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveExportTx.tsx":
/*!****************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveExportTx.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExportTxView": () => (/* binding */ ExportTxView)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/wallet/handlers/eth_sendTransaction/models */ "./src/background/services/wallet/handlers/eth_sendTransaction/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function ExportTxView({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__.useSettingsContext)();
  const {
    amount: amountRaw,
    chain,
    destination,
    type,
    txFee
  } = tx;
  const amount = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__.TokenUnit(amountRaw, 9, 'AVAX');
  const fee = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__.TokenUnit(txFee, 9, 'AVAX');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 2,
      mb: 1,
      mx: 0
    }
  }, t('Chain'), ": ", _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__.AvalancheChainStrings[chain]), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary',
      mb: 1
    }
  }, t('Source Chain')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption"
  }, _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__.AvalancheChainStrings[chain])), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Target Chain')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption"
  }, _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__.AvalancheChainStrings[destination])))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 2,
      mb: 1,
      mx: 0
    }
  }, t('Token')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      mb: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Transaction Type')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption"
  }, type ? (type[0] || '').toUpperCase() + type.slice(1) : '')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Divider, null), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      mt: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.AvalancheColorIcon, {
    size: '32px'
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    sx: {
      ml: 1
    },
    variant: "h6"
  }, "AVAX")), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, amount.toDisplay(), " AVAX"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      textAlign: 'right',
      color: 'text.secondary'
    }
  }, currencyFormatter(amount.toDisplay({
    asNumber: true
  }) * avaxPrice)))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 3,
      mb: 1,
      mx: 0
    }
  }, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Fee Amount')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, fee.toString(), " AVAX"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      textAlign: 'right',
      color: 'text.secondary'
    }
  }, currencyFormatter(fee.toDisplay({
    asNumber: true
  }) * avaxPrice)))))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveImportTx.tsx":
/*!****************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveImportTx.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImportTxView": () => (/* binding */ ImportTxView)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/wallet/handlers/eth_sendTransaction/models */ "./src/background/services/wallet/handlers/eth_sendTransaction/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function ImportTxView({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__.useSettingsContext)();
  const {
    amount: amountRaw,
    chain,
    source,
    type,
    txFee
  } = tx;
  const amount = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__.TokenUnit(amountRaw, 9, 'AVAX');
  const fee = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_3__.TokenUnit(txFee, 9, 'AVAX');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 2,
      mb: 1,
      mx: 0
    }
  }, t('Chain'), ": ", _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__.AvalancheChainStrings[chain]), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary',
      mb: 1
    }
  }, t('Source Chain')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption"
  }, _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__.AvalancheChainStrings[source])), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Target Chain')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption"
  }, _src_background_services_wallet_handlers_eth_sendTransaction_models__WEBPACK_IMPORTED_MODULE_1__.AvalancheChainStrings[chain])))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 2,
      mb: 1,
      mx: 0
    }
  }, t('Token')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      mb: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Transaction Type')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption"
  }, type ? (type[0] || '').toUpperCase() + type.slice(1) : '')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Divider, null), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      mt: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.AvalancheColorIcon, {
    size: '32px'
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    sx: {
      ml: 1
    },
    variant: "h6"
  }, "AVAX")), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, amount.toDisplay(), " AVAX"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      textAlign: 'right',
      color: 'text.secondary'
    }
  }, currencyFormatter(amount.toDisplay({
    asNumber: true
  }) * avaxPrice)))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      mt: 3,
      mb: 1,
      mx: 0
    }
  }, t('Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Card, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CardContent, {
    sx: {
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Fee Amount')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, fee.toString(), " AVAX"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    sx: {
      textAlign: 'right',
      color: 'text.secondary'
    }
  }, currencyFormatter(fee.toDisplay({
    asNumber: true
  }) * avaxPrice)))))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveIncreaseL1ValidatorBalance.tsx":
/*!**********************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveIncreaseL1ValidatorBalance.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApproveIncreaseL1ValidatorBalance": () => (/* binding */ ApproveIncreaseL1ValidatorBalance)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function ApproveIncreaseL1ValidatorBalance({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    txFee,
    balance,
    validationId
  } = tx;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Validation ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_3__.TruncatedIdentifier, {
    identifier: validationId
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Increase by amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_2__.AvaxAmount, {
    amount: balance,
    avaxPrice: avaxPrice
  })))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_2__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveRegisterL1Validator.tsx":
/*!***************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveRegisterL1Validator.tsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApproveRegisterL1Validator": () => (/* binding */ ApproveRegisterL1Validator)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function ApproveRegisterL1Validator({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const {
    txFee,
    balance
  } = tx;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Initial balance')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_2__.AvaxAmount, {
    amount: balance,
    avaxPrice: avaxPrice
  })))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_2__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveRemoveSubnetValidator.tsx":
/*!*****************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveRemoveSubnetValidator.tsx ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RemoveSubnetValidatorView": () => (/* binding */ RemoveSubnetValidatorView)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TruncatedIdentifier */ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function RemoveSubnetValidatorView({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    txFee,
    nodeID,
    subnetID
  } = tx;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Staking Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, {
    sx: {
      justifyContent: 'start',
      py: 2.25
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Subnet ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: subnetID
  })), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Node ID')
  }, /*#__PURE__*/React.createElement(_TruncatedIdentifier__WEBPACK_IMPORTED_MODULE_2__.TruncatedIdentifier, {
    identifier: nodeID
  })))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_3__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/ApproveSetL1ValidatorWeight.tsx":
/*!****************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ApproveSetL1ValidatorWeight.tsx ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApproveSetL1ValidatorWeight": () => (/* binding */ ApproveSetL1ValidatorWeight)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _AvaxAmount__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AvaxAmount */ "./src/pages/ApproveAction/components/AvaxAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function ApproveSetL1ValidatorWeight({
  tx,
  avaxPrice
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const {
    txFee
  } = tx;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Network Fee')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_1__.TxDetailsRow, {
    label: t('Fee Amount')
  }, /*#__PURE__*/React.createElement(_AvaxAmount__WEBPACK_IMPORTED_MODULE_2__.AvaxAmount, {
    amount: txFee,
    avaxPrice: avaxPrice
  })))));
}

/***/ }),

/***/ "./src/pages/ApproveAction/components/AvalancheTxHeader.tsx":
/*!******************************************************************!*\
  !*** ./src/pages/ApproveAction/components/AvalancheTxHeader.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AvalancheTxHeader": () => (/* binding */ AvalancheTxHeader)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/models.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const useAvalancheTxHeader = tx => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_0__.useTranslation)();
  switch (tx.type) {
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.AddPermissionlessValidator:
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.AddValidator:
      return t('Add Validator');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.AddPermissionlessDelegator:
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.AddDelegator:
      return t('Add Delegator');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.AddSubnetValidator:
      return t('Add Subnet Validator');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.RemoveSubnetValidator:
      return t('Remove Subnet Validator');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.CreateChain:
      return t('Create Blockchain');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.CreateSubnet:
      return t('Create Subnet');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.Export:
      return t('Approve Export');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.Import:
      return t('Approve Import');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.Base:
      return t('Approve Transaction');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.ConvertSubnetToL1:
      return t('Convert Subnet to L1');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.DisableL1Validator:
      return t('Disable L1 Validator');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.IncreaseL1ValidatorBalance:
      return t('Increase L1 Validator Balance');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.RegisterL1Validator:
      return t('Register L1 Validator');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.SetL1ValidatorWeight:
      return t('Set L1 Validator Weight');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.TransformSubnet:
      return t('Transform Subnet');
    case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_1__.TxType.TransferSubnetOwnership:
      return t('Transfer Subnet Ownership');
    default:
      return t('Unknown Transaction');
  }
};
const AvalancheTxHeader = ({
  tx
}) => {
  const header = useAvalancheTxHeader(tx);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Box, {
    sx: {
      width: '100%',
      py: 1.5,
      mb: 2,
      zIndex: 1,
      height: '56px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h4",
    component: "h1"
  }, header));
};

/***/ }),

/***/ "./src/pages/ApproveAction/components/AvaxAmount.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/ApproveAction/components/AvaxAmount.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AvaxAmount": () => (/* binding */ AvaxAmount)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const AvaxAmount = ({
  amount: amountRaw,
  avaxPrice
}) => {
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_0__.useSettingsContext)();
  const amount = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_1__.TokenUnit(amountRaw, 9, 'AVAX');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      textAlign: 'end',
      gap: 0.5,
      pb: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "subtitle2"
  }, amount.toDisplay(), " AVAX"), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "caption",
    color: "text.secondary"
  }, currencyFormatter(amount.toDisplay({
    asNumber: true
  }) * avaxPrice)));
};

/***/ }),

/***/ "./src/pages/ApproveAction/components/BlockchainGenesisFile.tsx":
/*!**********************************************************************!*\
  !*** ./src/pages/ApproveAction/components/BlockchainGenesisFile.tsx ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BlockchainGenesisFile": () => (/* binding */ BlockchainGenesisFile)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






const BlockchainGenesisFile = ({
  onClose,
  data
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const handleCopyClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    navigator.clipboard.writeText(data);
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"].success(t('Copied!'), {
      duration: 1000
    });
  }, [data, t]);
  return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_2__.Overlay, {
    isBackgroundFilled: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      height: '100%',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitle, {
    variant: _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitleVariant.PRIMARY,
    onBackClick: onClose,
    margin: "0"
  }, t('Genesis Information')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      p: 2,
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSection, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionHeader, {
    label: t('Code')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
    size: "small",
    "data-testid": "copy-genesis-information",
    onClick: handleCopyClick
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.CopyIcon, null))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionBody, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Scrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    component: "pre",
    variant: "caption",
    monospace: true
  }, data)))))));
};

/***/ }),

/***/ "./src/pages/ApproveAction/components/ExcessiveBurnWarningDialog.tsx":
/*!***************************************************************************!*\
  !*** ./src/pages/ApproveAction/components/ExcessiveBurnWarningDialog.tsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExcessiveBurnWarningDialog": () => (/* binding */ ExcessiveBurnWarningDialog)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const ExcessiveBurnWarningDialog = ({
  open,
  onReject,
  onContinue
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_0__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Dialog, {
    open: open,
    showCloseIcon: false,
    PaperProps: {
      sx: {
        m: 2
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.DialogTitle, {
    align: "center"
  }, t('Caution!')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.DialogContent, {
    sx: {
      px: 2,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2"
  }, t('The inputs of this transaction are greater than the output. Continuing will cause you to lose funds associated with this UTXO.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.DialogActions, {
    sx: {
      px: 2,
      pt: 1,
      pb: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    color: "primary",
    size: "large",
    fullWidth: true,
    onClick: onReject
  }, t('Reject Transaction')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "text",
    size: "large",
    onClick: onContinue
  }, t('Continue'))));
};

/***/ }),

/***/ "./src/pages/ApproveAction/components/TruncatedIdentifier.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/ApproveAction/components/TruncatedIdentifier.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TruncatedIdentifier": () => (/* binding */ TruncatedIdentifier)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const TruncatedIdentifier = ({
  identifier,
  size = 10
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
  direction: "row",
  sx: {
    gap: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
  variant: "caption"
}, (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__.truncateAddress)(identifier, size)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
  title: identifier
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.InfoCircleIcon, {
  size: 14,
  sx: {
    color: 'text.secondary'
  }
})));

/***/ }),

/***/ "./src/utils/bigintToBig.ts":
/*!**********************************!*\
  !*** ./src/utils/bigintToBig.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bigintToBig": () => (/* binding */ bigintToBig)
/* harmony export */ });
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bnToBig.js");
/* harmony import */ var bn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bn.js */ "./node_modules/bn.js/lib/bn.js");
/* harmony import */ var bn_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bn_js__WEBPACK_IMPORTED_MODULE_0__);


function bigintToBig(amount, denomination) {
  return (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_1__.bnToBig)(new bn_js__WEBPACK_IMPORTED_MODULE_0__.BN(amount.toString()), denomination);
}

/***/ }),

/***/ "./src/utils/isPrimarySubnet.ts":
/*!**************************************!*\
  !*** ./src/utils/isPrimarySubnet.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPrimarySubnet": () => (/* binding */ isPrimarySubnet)
/* harmony export */ });
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/providers/constants.js");

function isPrimarySubnet(subnetId) {
  return subnetId === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_0__.MainnetContext.pBlockchainID;
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FwcHJvdmVBY3Rpb25fQXZhbGFuY2hlU2lnblR4X3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGdCQUFnQixnQkFBZ0IsK0ZBQStGLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxJQUFnQzs7Ozs7Ozs7Ozs7Ozs7O0FDQXpMLGtCQUFrQix5RUFBeUUsMEJBQTBCLGtDQUFrQyxLQUFLLFFBQVEsb0RBQW9ELHlCQUF5QixZQUFZLEVBQUUsR0FBRyxFQUFFLEtBQW9DOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FsUixrQkFBa0IsUUFBUSw2Q0FBQyxZQUFZLFdBQVcsK0NBQUMsc0JBQTJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBcEgsd3ZCQUF3dkIsRUFBRSxjQUFjLCtCQUErQixjQUFjLCtCQUErQixjQUFjLHdCQUF3QixjQUFjLHdCQUF3QixjQUFjLHNCQUFzQixjQUFjLHNDQUFzQyxjQUFjLHVDQUF1QyxjQUFjLHlDQUF5QyxjQUFjLHNDQUFzQyxjQUFjLCtDQUErQyxjQUFjLCtCQUErQixjQUFjLDhCQUE4QixjQUFjLHNDQUFzQyxjQUFjLHlDQUF5QyxjQUFjLDhDQUE4QyxjQUFjLDhDQUE4QyxjQUFjLGtDQUFrQyxjQUFjLDJDQUFxaEI7Ozs7Ozs7Ozs7Ozs7OztBQ0FwbUUsYUFBYSwwQ0FBa0U7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSXhFLElBQUtBLHFCQUFxQiwwQkFBckJBLHFCQUFxQjtFQUFyQkEscUJBQXFCO0VBQXJCQSxxQkFBcUI7RUFBckJBLHFCQUFxQjtFQUFBLE9BQXJCQSxxQkFBcUI7QUFBQTtBQU0xQixJQUFLQyxlQUFlLDBCQUFmQSxlQUFlO0VBQWZBLGVBQWU7RUFBZkEsZUFBZTtFQUFmQSxlQUFlO0VBQWZBLGVBQWU7RUFBZkEsZUFBZTtFQUFmQSxlQUFlO0VBQWZBLGVBQWU7RUFBZkEsZUFBZTtFQUFmQSxlQUFlO0VBQWZBLGVBQWU7RUFBZkEsZUFBZTtFQUFmQSxlQUFlO0VBQWZB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Q3JELENBRWI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUJpRDtBQUV2QjtBQUVwQixTQUFTZ0ksV0FBV0EsQ0FBQzRCLE1BQWMsRUFBRStCLFlBQW9CLEVBQU87RUFDckUsT0FBTzhFLGdFQUFPLENBQUMsSUFBSUMscUNBQUUsQ0FBQzlHLE1BQU0sQ0FBQ21CLFFBQVEsRUFBRSxDQUFDLEVBQUVZLFlBQVksQ0FBQztBQUN6RDs7Ozs7Ozs7Ozs7Ozs7O0FDTnNEO0FBRS9DLFNBQVNwQyxlQUFlQSxDQUFDb0gsUUFBZ0IsRUFBRTtFQUNoRCxPQUFPQSxRQUFRLEtBQUtqUCxtRkFBc0M7QUFDNUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhdmFsYWJzL2NvcmUtdXRpbHMtc2RrL2VzbS9iaWdJbnRUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhdmFsYWJzL2NvcmUtdXRpbHMtc2RrL2VzbS9iaWdUb0xvY2FsZVN0cmluZy5qcyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhdmFsYWJzL2NvcmUtdXRpbHMtc2RrL2VzbS9iblRvQmlnLmpzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkay9lc20vQXZhbGFuY2hlL21vZGVscy5qcyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsvZXNtL0F2YWxhbmNoZS91dGlscy9nZXRVbml4Tm93LmpzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvaGFuZGxlcnMvZXRoX3NlbmRUcmFuc2FjdGlvbi9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9Mb2FkaW5nT3ZlcmxheS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9BcHByb3ZhbFNlY3Rpb24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZVRva2VuUHJpY2UudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL0F2YWxhbmNoZVNpZ25UeC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQXBwcm92ZUFkZERlbGVnYXRvci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQXBwcm92ZUFkZFBlcm1pc3Npb25sZXNzRGVsZWdhdG9yLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vY29tcG9uZW50cy9BcHByb3ZlQWRkUGVybWlzc2lvbmxlc3NWYWxpZGF0b3IudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQXBwcm92ZUFjdGlvbi9jb21wb25lbnRzL0FwcHJvdmVBZGRTdWJuZXRWYWxpZGF0b3IudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQXBwcm92ZUFjdGlvbi9jb21wb25lbnRzL0FwcHJvdmVBZGRWYWxpZGF0b3IudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQXBwcm92ZUFjdGlvbi9jb21wb25lbnRzL0FwcHJvdmVCYXNlVHgudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQXBwcm92ZUFjdGlvbi9jb21wb25lbnRzL0FwcHJvdmVDb252ZXJ0U3VibmV0VG9MMS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQXBwcm92ZUNyZWF0ZUNoYWluLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vY29tcG9uZW50cy9BcHByb3ZlQ3JlYXRlU3VibmV0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vY29tcG9uZW50cy9BcHByb3ZlRGlzYWJsZUwxVmFsaWRhdG9yLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vY29tcG9uZW50cy9BcHByb3ZlRXhwb3J0VHgudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQXBwcm92ZUFjdGlvbi9jb21wb25lbnRzL0FwcHJvdmVJbXBvcnRUeC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQXBwcm92ZUluY3JlYXNlTDFWYWxpZGF0b3JCYWxhbmNlLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vY29tcG9uZW50cy9BcHByb3ZlUmVnaXN0ZXJMMVZhbGlkYXRvci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQXBwcm92ZVJlbW92ZVN1Ym5ldFZhbGlkYXRvci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQXBwcm92ZVNldEwxVmFsaWRhdG9yV2VpZ2h0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vY29tcG9uZW50cy9BdmFsYW5jaGVUeEhlYWRlci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQXZheEFtb3VudC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQmxvY2tjaGFpbkdlbmVzaXNGaWxlLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vY29tcG9uZW50cy9FeGNlc3NpdmVCdXJuV2FybmluZ0RpYWxvZy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvVHJ1bmNhdGVkSWRlbnRpZmllci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9iaWdpbnRUb0JpZy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL2lzUHJpbWFyeVN1Ym5ldC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0KHQsbil7bj1NYXRoLmZsb29yKG4pO2NvbnN0IGU9dC50b1N0cmluZygpLG89TWF0aC5tYXgoZS5sZW5ndGgtbiwwKSxyPWUuc2xpY2UobykucGFkU3RhcnQobixcIjBcIiksYT1lLnNsaWNlKDAsbyl8fFwiMFwiO3JldHVybiByLmxlbmd0aD9gJHthfS4ke3J9YDphfWV4cG9ydHt0IGFzIGJpZ0ludFRvU3RyaW5nfTtcbiIsImZ1bmN0aW9uIHQodCxuPTkpe2NvbnN0IGU9dC50b0ZpeGVkKG4pLnNwbGl0KFwiLlwiKSxyPXBhcnNlSW50KGVbMF0pLnRvTG9jYWxlU3RyaW5nKFwiZW4tVVNcIik7aWYoMT09PWUubGVuZ3RoKXJldHVybiByO3tsZXQgdD1lWzFdLG89dC5jaGFyQXQodC5sZW5ndGgtMSk7Zm9yKDtcIjBcIj09PW87KXQ9dC5zdWJzdHJpbmcoMCx0Lmxlbmd0aC0xKSxvPXQuY2hhckF0KHQubGVuZ3RoLTEpO2NvbnN0IHM9dC5zdWJzdHJpbmcoMCxuKTtyZXR1cm4gcz9gJHtyfS4ke3N9YDpyfX1leHBvcnR7dCBhcyBiaWdUb0xvY2FsZVN0cmluZ307XG4iLCJpbXBvcnQgbyBmcm9tXCJiaWcuanNcIjtmdW5jdGlvbiB0KHQsbj0wKXtjb25zdCByPW8oMTApLnBvdyhuKTtyZXR1cm4gbmV3IG8odC50b1N0cmluZygpKS5kaXYocil9ZXhwb3J0e3QgYXMgYm5Ub0JpZ307XG4iLCJ2YXIgZT0oZT0+KGUuQmFzZT1cImJhc2VcIixlLkFkZFZhbGlkYXRvcj1cImFkZF92YWxpZGF0b3JcIixlLkFkZERlbGVnYXRvcj1cImFkZF9kZWxlZ2F0b3JcIixlLkV4cG9ydD1cImV4cG9ydFwiLGUuSW1wb3J0PVwiaW1wb3J0XCIsZS5DcmVhdGVTdWJuZXQ9XCJjcmVhdGVfc3VibmV0XCIsZS5DcmVhdGVDaGFpbj1cImNyZWF0ZV9jaGFpblwiLGUuQ29udmVydFN1Ym5ldFRvTDE9XCJjb252ZXJ0X3N1Ym5ldF90b19sMVwiLGUuUmVnaXN0ZXJMMVZhbGlkYXRvcj1cInJlZ2lzdGVyX2wxX3ZhbGlkYXRvclwiLGUuU2V0TDFWYWxpZGF0b3JXZWlnaHQ9XCJzZXRfbDFfdmFsaWRhdG9yX3dlaWdodFwiLGUuSW5jcmVhc2VMMVZhbGlkYXRvckJhbGFuY2U9XCJpbmNyZWFzZV9sMV92YWxpZGF0b3JfYmFsYW5jZVwiLGUuRGlzYWJsZUwxVmFsaWRhdG9yPVwiZGlzYWJsZV9sMV92YWxpZGF0b3JcIixlLkFkZFN1Ym5ldFZhbGlkYXRvcj1cImFkZF9zdWJuZXRfdmFsaWRhdG9yXCIsZS5SZW1vdmVTdWJuZXRWYWxpZGF0b3I9XCJyZW1vdmVfc3VibmV0X3ZhbGlkYXRvclwiLGUuQWRkUGVybWlzc2lvbmxlc3NWYWxpZGF0b3I9XCJhZGRfcGVybWlzc2lvbmxlc3NfdmFsaWRhdG9yXCIsZS5BZGRQZXJtaXNzaW9ubGVzc0RlbGVnYXRvcj1cImFkZF9wZXJtaXNzaW9ubGVzc19kZWxlZ2F0b3JcIixlLlRyYW5zZm9ybVN1Ym5ldD1cInRyYW5zZm9ybV9zdWJuZXRcIixlLlRyYW5zZmVyU3VibmV0T3duZXJzaGlwPVwidHJhbnNmZXJfc3VibmV0X293bmVyc2hpcFwiLGUuVW5rbm93bj1cInVua25vd25cIixlKSkoZXx8e30pO2Z1bmN0aW9uIHQoZSl7cmV0dXJuXCJhZGRfdmFsaWRhdG9yXCI9PT1lLnR5cGV9ZnVuY3Rpb24gcihlKXtyZXR1cm5cImFkZF9kZWxlZ2F0b3JcIj09PWUudHlwZX1mdW5jdGlvbiBuKGUpe3JldHVyblwiZXhwb3J0XCI9PT1lLnR5cGV9ZnVuY3Rpb24gYShlKXtyZXR1cm5cImltcG9ydFwiPT09ZS50eXBlfWZ1bmN0aW9uIG8oZSl7cmV0dXJuXCJiYXNlXCI9PT1lLnR5cGV9ZnVuY3Rpb24gaShlKXtyZXR1cm5cImNvbnZlcnRfc3VibmV0X3RvX2wxXCI9PT1lLnR5cGV9ZnVuY3Rpb24gZChlKXtyZXR1cm5cInJlZ2lzdGVyX2wxX3ZhbGlkYXRvclwiPT09ZS50eXBlfWZ1bmN0aW9uIHMoZSl7cmV0dXJuXCJzZXRfbDFfdmFsaWRhdG9yX3dlaWdodFwiPT09ZS50eXBlfWZ1bmN0aW9uIF8oZSl7cmV0dXJuXCJkaXNhYmxlX2wxX3ZhbGlkYXRvclwiPT09ZS50eXBlfWZ1bmN0aW9uIHUoZSl7cmV0dXJuXCJpbmNyZWFzZV9sMV92YWxpZGF0b3JfYmFsYW5jZVwiPT09ZS50eXBlfWZ1bmN0aW9uIGwoZSl7cmV0dXJuXCJjcmVhdGVfc3VibmV0XCI9PT1lLnR5cGV9ZnVuY3Rpb24gYyhlKXtyZXR1cm5cImNyZWF0ZV9jaGFpblwiPT09ZS50eXBlfWZ1bmN0aW9uIHAoZSl7cmV0dXJuXCJhZGRfc3VibmV0X3ZhbGlkYXRvclwiPT09ZS50eXBlfWZ1bmN0aW9uIGIoZSl7cmV0dXJuXCJyZW1vdmVfc3VibmV0X3ZhbGlkYXRvclwiPT09ZS50eXBlfWZ1bmN0aW9uIGYoZSl7cmV0dXJuXCJhZGRfcGVybWlzc2lvbmxlc3NfdmFsaWRhdG9yXCI9PT1lLnR5cGV9ZnVuY3Rpb24gdihlKXtyZXR1cm5cImFkZF9wZXJtaXNzaW9ubGVzc19kZWxlZ2F0b3JcIj09PWUudHlwZX1mdW5jdGlvbiB5KGUpe3JldHVyblwidHJhbnNmb3JtX3N1Ym5ldFwiPT09ZS50eXBlfWZ1bmN0aW9uIG0oZSl7cmV0dXJuXCJ0cmFuc2Zlcl9zdWJuZXRfb3duZXJzaGlwXCI9PT1lLnR5cGV9ZXhwb3J0e2UgYXMgVHhUeXBlLHIgYXMgaXNBZGREZWxlZ2F0b3JUeCx2IGFzIGlzQWRkUGVybWlzc2lvbmxlc3NEZWxlZ2F0b3JUeCxmIGFzIGlzQWRkUGVybWlzc2lvbmxlc3NWYWxpZGF0b3JUeCxwIGFzIGlzQWRkU3VibmV0VmFsaWRhdG9yVHgsdCBhcyBpc0FkZFZhbGlkYXRvclR4LG8gYXMgaXNCYXNlVHgsaSBhcyBpc0NvbnZlcnRTdWJuZXRUb0wxVHgsYyBhcyBpc0NyZWF0ZUNoYWluVHgsbCBhcyBpc0NyZWF0ZVN1Ym5ldFR4LF8gYXMgaXNEaXNhYmxlTDFWYWxpZGF0b3JUeCxuIGFzIGlzRXhwb3J0VHgsYSBhcyBpc0ltcG9ydFR4LHUgYXMgaXNJbmNyZWFzZUwxVmFsaWRhdG9yQmFsYW5jZSxkIGFzIGlzUmVnaXN0ZXJMMVZhbGlkYXRvclR4LGIgYXMgaXNSZW1vdmVTdWJuZXRWYWxpZGF0b3JUeCxzIGFzIGlzU2V0TDFWYWxpZGF0b3JXZWlnaHRUeCxtIGFzIGlzVHJhbnNmZXJTdWJuZXRPd25lcnNoaXBUeCx5IGFzIGlzVHJhbnNmb3JtU3VibmV0VHh9O1xuIiwiZnVuY3Rpb24gdCgpe3JldHVybiBCaWdJbnQoTWF0aC5mbG9vcihEYXRlLm5vdygpLzFlMykpfWV4cG9ydHt0IGFzIGdldFVuaXhOb3d9O1xuIiwiaW1wb3J0IHsgRG9tYWluTWV0YWRhdGEsIEVuc3VyZURlZmluZWQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvbW9kZWxzJztcbmltcG9ydCB7IFR4RGlzcGxheU9wdGlvbnMgfSBmcm9tICcuLi9tb2RlbHMnO1xuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuZXhwb3J0IGVudW0gQXZhbGFuY2hlQ2hhaW5TdHJpbmdzIHtcbiAgQVZNID0gJ1ggQ2hhaW4nLFxuICBQVk0gPSAnUCBDaGFpbicsXG4gIEVWTSA9ICdDIENoYWluJyxcbn1cblxuZXhwb3J0IGVudW0gVHJhbnNhY3Rpb25UeXBlIHtcbiAgU0VORF9UT0tFTiA9ICdzZW5kX3Rva2VuJyxcbiAgU0VORF9ORlQgPSAnc2VuZF9uZnQnLFxuICBBUFBST1ZFX1RPS0VOID0gJ2FwcHJvdmVfdG9rZW4nLFxuICBBUFBST1ZFX05GVCA9ICdhcHByb3ZlX25mdCcsXG4gIEFQUFJPVkVfTkZUX0NPTExFQ1RJT04gPSAnYXBwcm92ZV9uZnRfY29sbGVjdGlvbicsXG4gIFJFVk9LRV9UT0tFTl9BUFBST1ZBTCA9ICdyZXZva2VfdG9rZW5fYXBwcm92YWwnLFxuICBSRVZPS0VfTkZUX0FQUFJPVkFMID0gJ3Jldm9rZV9uZnRfYXBwcm92YWwnLFxuICBSRVZPS0VfTkZUX0NPTExFQ1RJT05fQVBQUk9WQUwgPSAncmV2b2tlX25mdF9jb2xsZWN0aW9uX2FwcHJvdmFsJyxcbiAgQ0FOQ0VMX1RYID0gJ2NhbmNlbF90eCcsXG4gIERFUExPWV9DT05UUkFDVCA9ICdkZXBsb3lfY29udHJhY3QnLFxuICBTV0FQID0gJ3N3YXAnLFxuICBBRERfTElRVUlESVRZID0gJ2FkZF9saXF1aWRpdHknLFxuICBDQUxMID0gJ2NhbGwnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zYWN0aW9uVG9rZW4ge1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIGRlY2ltYWxzOiBudW1iZXI7XG4gIHN5bWJvbDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGxvZ29Vcmk/OiBzdHJpbmc7XG5cbiAgYW1vdW50PzogYmlnaW50O1xuICB1c2RWYWx1ZT86IG51bWJlcjtcbiAgdXNkUHJpY2U/OiBudW1iZXI7XG5cbiAgaXNTY2FtPzogYm9vbGVhbjtcbiAgaXNJbmZpbml0eT86IGJvb2xlYW47XG4gIGlzU3VzcGljaW91cz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNhY3Rpb25OZnQge1xuICB0eXBlOiBUb2tlblR5cGUuRVJDNzIxIHwgVG9rZW5UeXBlLkVSQzExNTU7XG4gIGFkZHJlc3M6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBsb2dvVXJpPzogc3RyaW5nO1xuICBzeW1ib2w/OiBzdHJpbmc7XG5cbiAgYW1vdW50OiBiaWdpbnQ7XG5cbiAgY29sbGVjdGlvbj86IHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZGVzY3JpcHRpb246IHN0cmluZyB8IG51bGw7XG4gICAgbG9nb1VyaTogc3RyaW5nO1xuICB9O1xuXG4gIGlzU2NhbT86IGJvb2xlYW47XG4gIGlzU3VzcGljaW91cz86IGJvb2xlYW47XG4gIHNpemU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCB0eXBlIFRyYW5zYWN0aW9uQWN0aW9uID1cbiAgfCB7XG4gICAgICB0eXBlOiBUcmFuc2FjdGlvblR5cGUuU0VORF9UT0tFTjtcbiAgICAgIGZyb21BZGRyZXNzOiBzdHJpbmc7XG4gICAgICB0b0FkZHJlc3M6IHN0cmluZztcbiAgICAgIHRva2VuOiBUcmFuc2FjdGlvblRva2VuO1xuICAgIH1cbiAgfCB7XG4gICAgICB0eXBlOiBUcmFuc2FjdGlvblR5cGUuU0VORF9ORlQ7XG4gICAgICBmcm9tQWRkcmVzczogc3RyaW5nO1xuICAgICAgdG9BZGRyZXNzOiBzdHJpbmc7XG4gICAgICBuZnQ6IFRyYW5zYWN0aW9uTmZ0O1xuICAgIH1cbiAgfCB7XG4gICAgICB0eXBlOlxuICAgICAgICB8IFRyYW5zYWN0aW9uVHlwZS5BUFBST1ZFX1RPS0VOXG4gICAgICAgIHwgVHJhbnNhY3Rpb25UeXBlLlJFVk9LRV9UT0tFTl9BUFBST1ZBTDtcbiAgICAgIHNwZW5kZXI6IHtcbiAgICAgICAgYWRkcmVzczogc3RyaW5nO1xuICAgICAgICBwcm90b2NvbD86IHtcbiAgICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICBsb2dvVXJpOiBzdHJpbmc7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgdG9rZW46IFRyYW5zYWN0aW9uVG9rZW47XG4gICAgICBjdXN0b21TcGVuZExpbWl0PzogYmlnaW50O1xuICAgIH1cbiAgfCB7XG4gICAgICB0eXBlOiBUcmFuc2FjdGlvblR5cGUuQVBQUk9WRV9ORlQgfCBUcmFuc2FjdGlvblR5cGUuUkVWT0tFX05GVF9BUFBST1ZBTDtcbiAgICAgIG93bmVyOiBzdHJpbmc7XG4gICAgICBzcGVuZGVyOiB7XG4gICAgICAgIGFkZHJlc3M6IHN0cmluZztcbiAgICAgICAgcHJvdG9jb2w/OiB7XG4gICAgICAgICAgaWQ6IHN0cmluZztcbiAgICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgbG9nb1VyaTogc3RyaW5nO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIHRva2VuOiBUcmFuc2FjdGlvbk5mdDtcbiAgICB9XG4gIHwge1xuICAgICAgdHlwZTpcbiAgICAgICAgfCBUcmFuc2FjdGlvblR5cGUuQVBQUk9WRV9ORlRfQ09MTEVDVElPTlxuICAgICAgICB8IFRyYW5zYWN0aW9uVHlwZS5SRVZPS0VfTkZUX0NPTExFQ1RJT05fQVBQUk9WQUw7XG4gICAgICBvd25lcjogc3RyaW5nO1xuICAgICAgc3BlbmRlcjoge1xuICAgICAgICBhZGRyZXNzOiBzdHJpbmc7XG4gICAgICAgIHByb3RvY29sPzoge1xuICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgIGxvZ29Vcmk6IHN0cmluZztcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICBjb2xsZWN0aW9uOiB7XG4gICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICAgICAgYWRkcmVzczogc3RyaW5nO1xuICAgICAgICBsb2dvVXJpOiBzdHJpbmc7XG4gICAgICAgIHR5cGU6IFRva2VuVHlwZS5FUkM3MjEgfCBUb2tlblR5cGUuRVJDMTE1NTtcblxuICAgICAgICBpc1NjYW0/OiBib29sZWFuO1xuICAgICAgICBpc1N1c3BpY2lvdXM/OiBib29sZWFuO1xuICAgICAgfTtcbiAgICB9XG4gIHwge1xuICAgICAgdHlwZTogVHJhbnNhY3Rpb25UeXBlLkNBTkNFTF9UWDtcbiAgICAgIGZyb21BZGRyZXNzOiBzdHJpbmc7XG4gICAgfVxuICB8IHtcbiAgICAgIHR5cGU6IFRyYW5zYWN0aW9uVHlwZS5ERVBMT1lfQ09OVFJBQ1Q7XG4gICAgICBmcm9tQWRkcmVzczogc3RyaW5nO1xuICAgIH1cbiAgfCB7XG4gICAgICB0eXBlOiBUcmFuc2FjdGlvblR5cGUuQ0FMTDtcbiAgICAgIGZyb21BZGRyZXNzOiBzdHJpbmc7XG4gICAgICBjb250cmFjdD86IHtcbiAgICAgICAgYWRkcmVzczogc3RyaW5nO1xuICAgICAgICBwcm90b2NvbD86IHtcbiAgICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICBsb2dvVXJpOiBzdHJpbmc7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgIH1cbiAgfCB7XG4gICAgICB0eXBlOiBUcmFuc2FjdGlvblR5cGUuQUREX0xJUVVJRElUWSB8IFRyYW5zYWN0aW9uVHlwZS5TV0FQO1xuICAgICAgZnJvbUFkZHJlc3M6IHN0cmluZztcbiAgICAgIGNvbnRyYWN0Pzoge1xuICAgICAgICBhZGRyZXNzOiBzdHJpbmc7XG4gICAgICB9O1xuICAgIH07XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNhY3Rpb25EaXNwbGF5VmFsdWVzIHtcbiAgZnJvbUFkZHJlc3M6IHN0cmluZztcblxuICBhYmk/OiB7XG4gICAgZnVuYzogc3RyaW5nO1xuICAgIHBhcmFtczogdW5rbm93bltdO1xuICB9O1xuXG4gIGFjdGlvbnM6IFRyYW5zYWN0aW9uQWN0aW9uW107XG5cbiAgZ2FzOiB7XG4gICAgbWF4UHJpb3JpdHlGZWVQZXJHYXM/OiBiaWdpbnQ7XG4gICAgbWF4RmVlUGVyR2FzOiBiaWdpbnQ7XG4gICAgZ2FzTGltaXQ6IG51bWJlcjtcbiAgICByZWNvbW1lbmRlZEdhc0xpbWl0PzogbnVtYmVyO1xuICB9O1xuXG4gIGJhbGFuY2VDaGFuZ2U/OiB7XG4gICAgdXNkVmFsdWVDaGFuZ2U/OiBudW1iZXI7XG4gICAgc2VuZFRva2VuTGlzdDogVHJhbnNhY3Rpb25Ub2tlbltdO1xuICAgIHJlY2VpdmVUb2tlbkxpc3Q6IFRyYW5zYWN0aW9uVG9rZW5bXTtcbiAgICBzZW5kTmZ0TGlzdDogVHJhbnNhY3Rpb25OZnRbXTtcbiAgICByZWNlaXZlTmZ0TGlzdDogVHJhbnNhY3Rpb25OZnRbXTtcbiAgfTtcblxuICBwcmVFeGVjU3VjY2Vzcz86IGJvb2xlYW47XG4gIGlzTWFsaWNpb3VzPzogYm9vbGVhbjtcbiAgaXNTdXNwaWNpb3VzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2FjdGlvbiB7XG4gIHNpdGU/OiBEb21haW5NZXRhZGF0YTtcbiAgbWV0aG9kOiBzdHJpbmc7XG4gIGNoYWluSWQ6IHN0cmluZztcbiAgdHhQYXJhbXM6IEVuc3VyZURlZmluZWQ8RXRoU2VuZFRyYW5zYWN0aW9uUGFyYW1zV2l0aEdhcywgJ2NoYWluSWQnPjtcbiAgZGlzcGxheVZhbHVlczogVHJhbnNhY3Rpb25EaXNwbGF5VmFsdWVzO1xuICBkaXNwbGF5T3B0aW9ucz86IFR4RGlzcGxheU9wdGlvbnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXRoU2VuZFRyYW5zYWN0aW9uUGFyYW1zIHtcbiAgZnJvbTogc3RyaW5nO1xuICB0bz86IHN0cmluZztcbiAgdmFsdWU/OiBzdHJpbmcgfCBiaWdpbnQ7XG4gIGRhdGE/OiBzdHJpbmc7XG4gIGdhcz86IG51bWJlcjtcbiAgZ2FzUHJpY2U/OiBzdHJpbmc7XG4gIG1heEZlZVBlckdhcz86IHN0cmluZztcbiAgbWF4UHJpb3JpdHlGZWVQZXJHYXM/OiBzdHJpbmc7XG4gIGNoYWluSWQ/OiBzdHJpbmc7XG4gIGdhc0xpbWl0Pzogc3RyaW5nO1xuICBub25jZT86IHN0cmluZztcbiAgdHlwZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVHhQYXJhbXMoXG4gIHBhcmFtczogUGFydGlhbDxFdGhTZW5kVHJhbnNhY3Rpb25QYXJhbXM+LFxuKTogcGFyYW1zIGlzIEV0aFNlbmRUcmFuc2FjdGlvblBhcmFtcyB7XG4gIHJldHVybiAhIXBhcmFtcy5mcm9tO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV0aFNlbmRUcmFuc2FjdGlvblBhcmFtc1dpdGhHYXNcbiAgZXh0ZW5kcyBFdGhTZW5kVHJhbnNhY3Rpb25QYXJhbXMge1xuICB0eXBlOiBudW1iZXI7XG4gIGdhc0xpbWl0OiBzdHJpbmc7XG4gIG1heEZlZVBlckdhczogc3RyaW5nO1xufVxuIiwiaW1wb3J0IHsgQ2lyY3VsYXJQcm9ncmVzcyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPdmVybGF5IH0gZnJvbSAnLi9PdmVybGF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIExvYWRpbmdPdmVybGF5KCkge1xuICByZXR1cm4gKFxuICAgIDxPdmVybGF5PlxuICAgICAgPENpcmN1bGFyUHJvZ3Jlc3MgLz5cbiAgICA8L092ZXJsYXk+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBCb3gsXG4gIEluZm9DaXJjbGVJY29uLFxuICBTdGFjayxcbiAgU3RhY2tQcm9wcyxcbiAgVG9vbHRpcCxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG50eXBlIEFwcHJvdmFsU2VjdGlvbkhlYWRlclByb3BzID0ge1xuICBsYWJlbDogc3RyaW5nO1xuICB0b29sdGlwPzogc3RyaW5nO1xuICB0b29sdGlwSWNvbj86IFJlYWN0LlJlYWN0RWxlbWVudDtcbn07XG5cbmV4cG9ydCBjb25zdCBBcHByb3ZhbFNlY3Rpb25IZWFkZXI6IFJlYWN0LkZDPEFwcHJvdmFsU2VjdGlvbkhlYWRlclByb3BzPiA9ICh7XG4gIGxhYmVsLFxuICB0b29sdGlwLFxuICB0b29sdGlwSWNvbiA9IDxJbmZvQ2lyY2xlSWNvbiAvPixcbiAgY2hpbGRyZW4sXG59KSA9PiAoXG4gIDxTdGFja1xuICAgIHN4PXt7XG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgfX1cbiAgPlxuICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICA8VHlwb2dyYXBoeSBjb21wb25lbnQ9XCJoNlwiIHN4PXt7IGZvbnRXZWlnaHQ6IDYwMCB9fT5cbiAgICAgICAge2xhYmVsfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAge3Rvb2x0aXAgJiYgKFxuICAgICAgICA8VG9vbHRpcCBzeD17eyBjdXJzb3I6ICdwb2ludGVyJywgbWw6IDEgfX0gdGl0bGU9e3Rvb2x0aXB9PlxuICAgICAgICAgIHt0b29sdGlwSWNvbn1cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgKX1cbiAgICA8L1N0YWNrPlxuICAgIDxCb3g+e2NoaWxkcmVufTwvQm94PlxuICA8L1N0YWNrPlxuKTtcblxuZXhwb3J0IGNvbnN0IEFwcHJvdmFsU2VjdGlvbkJvZHkgPSAoeyBzeCA9IHt9LCAuLi5yZXN0IH06IFN0YWNrUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdiYWNrZ3JvdW5kLnBhcGVyJyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAxLFxuICAgICAgICBwOiAyLFxuICAgICAgICBnYXA6IDEsXG4gICAgICAgIC4uLih0eXBlb2Ygc3ggPT09ICdmdW5jdGlvbicgPyBzeCh0aGVtZSkgOiBzeCksXG4gICAgICB9fVxuICAgICAgey4uLnJlc3R9XG4gICAgLz5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBBcHByb3ZhbFNlY3Rpb24gPSAoeyBzeCA9IHt9LCAuLi5yZXN0IH06IFN0YWNrUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBnYXA6IDAuNSxcbiAgICAgICAgLi4uKHR5cGVvZiBzeCA9PT0gJ2Z1bmN0aW9uJyA/IHN4KHRoZW1lKSA6IHN4KSxcbiAgICAgIH19XG4gICAgICB7Li4ucmVzdH1cbiAgICAvPlxuICApO1xufTtcbiIsImltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5LCB1c2VUaGVtZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG50eXBlIFR4RGV0YWlsc1Jvd1Byb3BzID0geyBsYWJlbDogc3RyaW5nIHwgUmVhY3QuUmVhY3ROb2RlIH07XG5cbmV4cG9ydCBjb25zdCBUeERldGFpbHNSb3c6IFJlYWN0LkZDPFR4RGV0YWlsc1Jvd1Byb3BzPiA9ICh7XG4gIGNoaWxkcmVuLFxuICBsYWJlbCxcbn0pID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2Jhc2VsaW5lJyxcbiAgICAgICAgZ2FwOiAxLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7dHlwZW9mIGxhYmVsID09PSAnc3RyaW5nJyA/IChcbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgICAge2xhYmVsfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICApIDogKFxuICAgICAgICBsYWJlbFxuICAgICAgKX1cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICBtaW5IZWlnaHQ6IHRoZW1lLnNwYWNpbmcoMiksXG4gICAgICAgICAgbWluV2lkdGg6ICcwcHgnLFxuICAgICAgICAgIHdvcmRXcmFwOiAnYnJlYWstd29yZCcsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgR2V0VG9rZW5QcmljZUhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvaGFuZGxlcnMvZ2V0VG9rZW5QcmljZSc7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VOYXRpdmVUb2tlblByaWNlKG5ldHdvcms/OiBOZXR3b3JrKSB7XG4gIGNvbnN0IHsgcmVxdWVzdCB9ID0gdXNlQ29ubmVjdGlvbkNvbnRleHQoKTtcbiAgY29uc3QgW3ByaWNlLCBzZXRQcmljZV0gPSB1c2VTdGF0ZTxudW1iZXI+KDApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgdG9rZW5JZCA9IG5ldHdvcms/LnByaWNpbmdQcm92aWRlcnM/LmNvaW5nZWNrby5uYXRpdmVUb2tlbklkO1xuXG4gICAgaWYgKHRva2VuSWQpIHtcbiAgICAgIHJlcXVlc3Q8R2V0VG9rZW5QcmljZUhhbmRsZXI+KHtcbiAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LlRPS0VOX1BSSUNFX0dFVCxcbiAgICAgICAgcGFyYW1zOiBbdG9rZW5JZF0sXG4gICAgICB9KVxuICAgICAgICAudGhlbigocCkgPT4gc2V0UHJpY2UocCB8fCAwKSlcbiAgICAgICAgLmNhdGNoKCgpID0+IHNldFByaWNlKDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0UHJpY2UoMCk7XG4gICAgfVxuICB9LCBbbmV0d29yaywgcmVxdWVzdF0pO1xuXG4gIHJldHVybiBwcmljZTtcbn1cbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IEJ1dHRvbiwgU2Nyb2xsYmFycywgU3RhY2sgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgQXZhbGFuY2hlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5cbmltcG9ydCB7IHVzZUFwcHJvdmVBY3Rpb24gfSBmcm9tICdAc3JjL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24nO1xuaW1wb3J0IHsgdXNlR2V0UmVxdWVzdElkIH0gZnJvbSAnQHNyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQnO1xuaW1wb3J0IHsgTG9hZGluZ092ZXJsYXkgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NvbW1vbi9Mb2FkaW5nT3ZlcmxheSc7XG5pbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuXG5pbXBvcnQgeyBJbXBvcnRUeFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvQXBwcm92ZUltcG9ydFR4JztcbmltcG9ydCB7IEV4cG9ydFR4VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9BcHByb3ZlRXhwb3J0VHgnO1xuaW1wb3J0IHsgQWRkVmFsaWRhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL0FwcHJvdmVBZGRWYWxpZGF0b3InO1xuaW1wb3J0IHsgQWRkRGVsZWdhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL0FwcHJvdmVBZGREZWxlZ2F0b3InO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VOYXRpdmVUb2tlblByaWNlIH0gZnJvbSAnQHNyYy9ob29rcy91c2VUb2tlblByaWNlJztcbmltcG9ydCB7IEJhc2VUeFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvQXBwcm92ZUJhc2VUeCc7XG5pbXBvcnQgeyB1c2VMZWRnZXJEaXNjb25uZWN0ZWREaWFsb2cgfSBmcm9tICcuLi9TaWduVHJhbnNhY3Rpb24vaG9va3MvdXNlTGVkZ2VyRGlzY29ubmVjdGVkRGlhbG9nJztcbmltcG9ydCB7IExlZGdlckFwcFR5cGUgfSBmcm9tICdAc3JjL2NvbnRleHRzL0xlZGdlclByb3ZpZGVyJztcbmltcG9ydCB7IExlZGdlckFwcHJvdmFsT3ZlcmxheSB9IGZyb20gJy4uL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL0xlZGdlckFwcHJvdmFsT3ZlcmxheSc7XG5pbXBvcnQgdXNlSXNVc2luZ0xlZGdlcldhbGxldCBmcm9tICdAc3JjL2hvb2tzL3VzZUlzVXNpbmdMZWRnZXJXYWxsZXQnO1xuaW1wb3J0IHsgQXBwcm92ZUNyZWF0ZVN1Ym5ldCB9IGZyb20gJy4vY29tcG9uZW50cy9BcHByb3ZlQ3JlYXRlU3VibmV0JztcbmltcG9ydCB7IEFwcHJvdmVDcmVhdGVDaGFpbiB9IGZyb20gJy4vY29tcG9uZW50cy9BcHByb3ZlQ3JlYXRlQ2hhaW4nO1xuaW1wb3J0IHsgQWRkU3VibmV0VmFsaWRhdG9yVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9BcHByb3ZlQWRkU3VibmV0VmFsaWRhdG9yJztcbmltcG9ydCB7IEF2YWxhbmNoZVR4SGVhZGVyIH0gZnJvbSAnLi9jb21wb25lbnRzL0F2YWxhbmNoZVR4SGVhZGVyJztcbmltcG9ydCB7IEV4Y2Vzc2l2ZUJ1cm5XYXJuaW5nRGlhbG9nIH0gZnJvbSAnLi9jb21wb25lbnRzL0V4Y2Vzc2l2ZUJ1cm5XYXJuaW5nRGlhbG9nJztcbmltcG9ydCB1c2VJc1VzaW5nV2FsbGV0Q29ubmVjdEFjY291bnQgZnJvbSAnQHNyYy9ob29rcy91c2VJc1VzaW5nV2FsbGV0Q29ubmVjdEFjY291bnQnO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdEFwcHJvdmFsT3ZlcmxheSB9IGZyb20gJy4uL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL1dhbGxldENvbm5lY3RBcHByb3ZhbC9XYWxsZXRDb25uZWN0QXBwcm92YWxPdmVybGF5JztcbmltcG9ydCB7IHVzZUFwcHJvdmFsSGVscGVycyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlQXBwcm92YWxIZWxwZXJzJztcbmltcG9ydCB7IEFkZFBlcm1pc3Npb25sZXNzVmFsaWRhdG9yIH0gZnJvbSAnQHNyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQXBwcm92ZUFkZFBlcm1pc3Npb25sZXNzVmFsaWRhdG9yJztcbmltcG9ydCB7IEFkZFBlcm1pc3Npb25sZXNzRGVsZWdhdG9yIH0gZnJvbSAnQHNyYy9wYWdlcy9BcHByb3ZlQWN0aW9uL2NvbXBvbmVudHMvQXBwcm92ZUFkZFBlcm1pc3Npb25sZXNzRGVsZWdhdG9yJztcbmltcG9ydCB1c2VJc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQgZnJvbSAnQHNyYy9ob29rcy91c2VJc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQnO1xuaW1wb3J0IHsgRmlyZWJsb2Nrc0FwcHJvdmFsT3ZlcmxheSB9IGZyb20gJy4uL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL0ZpcmVibG9ja3NBcHByb3ZhbC9GaXJlYmxvY2tzQXBwcm92YWxPdmVybGF5JztcbmltcG9ydCB7IFJlbW92ZVN1Ym5ldFZhbGlkYXRvclZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvQXBwcm92ZVJlbW92ZVN1Ym5ldFZhbGlkYXRvcic7XG5pbXBvcnQgeyBGdW5jdGlvbklzT2ZmbGluZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRnVuY3Rpb25Jc09mZmxpbmUnO1xuaW1wb3J0IHtcbiAgRnVuY3Rpb25OYW1lcyxcbiAgdXNlSXNGdW5jdGlvbkF2YWlsYWJsZSxcbn0gZnJvbSAnQHNyYy9ob29rcy91c2VJc0Z1bmN0aW9uQXZhaWxhYmxlJztcbmltcG9ydCB7IEFwcHJvdmVDb252ZXJ0U3VibmV0VG9MMSB9IGZyb20gJy4vY29tcG9uZW50cy9BcHByb3ZlQ29udmVydFN1Ym5ldFRvTDEnO1xuaW1wb3J0IHsgQXBwcm92ZVJlZ2lzdGVyTDFWYWxpZGF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvQXBwcm92ZVJlZ2lzdGVyTDFWYWxpZGF0b3InO1xuaW1wb3J0IHsgQXBwcm92ZUluY3JlYXNlTDFWYWxpZGF0b3JCYWxhbmNlIH0gZnJvbSAnLi9jb21wb25lbnRzL0FwcHJvdmVJbmNyZWFzZUwxVmFsaWRhdG9yQmFsYW5jZSc7XG5pbXBvcnQgeyBBcHByb3ZlRGlzYWJsZUwxVmFsaWRhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL0FwcHJvdmVEaXNhYmxlTDFWYWxpZGF0b3InO1xuaW1wb3J0IHsgQXBwcm92ZVNldEwxVmFsaWRhdG9yV2VpZ2h0IH0gZnJvbSAnLi9jb21wb25lbnRzL0FwcHJvdmVTZXRMMVZhbGlkYXRvcldlaWdodCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBdmFsYW5jaGVTaWduVHgoKSB7XG4gIGNvbnN0IHJlcXVlc3RJZCA9IHVzZUdldFJlcXVlc3RJZCgpO1xuICBjb25zdCB7IGFjdGlvbiwgdXBkYXRlQWN0aW9uLCBjYW5jZWxIYW5kbGVyIH0gPSB1c2VBcHByb3ZlQWN0aW9uKHJlcXVlc3RJZCk7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGlzRnVuY3Rpb25BdmFpbGFibGU6IGlzU2lnbmluZ0F2YWlsYWJsZSB9ID0gdXNlSXNGdW5jdGlvbkF2YWlsYWJsZShcbiAgICBGdW5jdGlvbk5hbWVzLlNJR04sXG4gICk7XG4gIGNvbnN0IHRva2VuUHJpY2UgPSB1c2VOYXRpdmVUb2tlblByaWNlKG5ldHdvcmspO1xuICBjb25zdCBpc1VzaW5nTGVkZ2VyV2FsbGV0ID0gdXNlSXNVc2luZ0xlZGdlcldhbGxldCgpO1xuICBjb25zdCBpc1dhbGxldENvbm5lY3RBY2NvdW50ID0gdXNlSXNVc2luZ1dhbGxldENvbm5lY3RBY2NvdW50KCk7XG4gIGNvbnN0IGlzRmlyZWJsb2Nrc0FjY291bnQgPSB1c2VJc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQoKTtcbiAgY29uc3QgW3Nob3dCdXJuV2FybmluZywgc2V0U2hvd0J1cm5XYXJuaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgdHhEYXRhID0gYWN0aW9uPy5kaXNwbGF5RGF0YS50eERhdGE7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBXaGVuIHRoZSB0cmFuc2FjdGlvbiBkZXRhaWxzIGFyZSBsb2FkaW5nLCBgdHhEYXRhYCBtYXkgYmUgdW5kZWZpbmVkLFxuICAgIC8vIHNvIHdlIG5lZWQgdG8gbGlzdGVuIGZvciBpdCB0byBiZSBwb3B1bGF0ZWQgYW5kIHRoZW4gbWFrZSBzdXJlXG4gICAgLy8gYGlzVmFsaWRBdmF4QnVybmVkQW1vdW50YCBpcyBmYWxzZSAobm90IGp1c3QgZmFsc2V5KS5cbiAgICBjb25zdCBjb3VsZEJ1cm5FeGNlc3NBbW91bnQgPSB0eERhdGE/LmlzVmFsaWRBdmF4QnVybmVkQW1vdW50ID09PSBmYWxzZTtcblxuICAgIGlmIChjb3VsZEJ1cm5FeGNlc3NBbW91bnQpIHtcbiAgICAgIHNldFNob3dCdXJuV2FybmluZyh0cnVlKTtcbiAgICB9XG4gIH0sIFt0eERhdGE/LmlzVmFsaWRBdmF4QnVybmVkQW1vdW50XSk7XG5cbiAgdXNlTGVkZ2VyRGlzY29ubmVjdGVkRGlhbG9nKFxuICAgICgpID0+IGhhbmRsZVJlamVjdGlvbigpLFxuICAgIExlZGdlckFwcFR5cGUuQVZBTEFOQ0hFLFxuICAgIG5ldHdvcmssXG4gICk7XG5cbiAgY29uc3Qgc2lnblR4ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHVwZGF0ZUFjdGlvbihcbiAgICAgIHtcbiAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyxcbiAgICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgIH0sXG4gICAgICBpc1VzaW5nTGVkZ2VyV2FsbGV0IHx8IGlzV2FsbGV0Q29ubmVjdEFjY291bnQgfHwgaXNGaXJlYmxvY2tzQWNjb3VudCxcbiAgICApO1xuICB9LCBbXG4gICAgdXBkYXRlQWN0aW9uLFxuICAgIHJlcXVlc3RJZCxcbiAgICBpc1VzaW5nTGVkZ2VyV2FsbGV0LFxuICAgIGlzV2FsbGV0Q29ubmVjdEFjY291bnQsXG4gICAgaXNGaXJlYmxvY2tzQWNjb3VudCxcbiAgXSk7XG5cbiAgY29uc3QgeyBoYW5kbGVBcHByb3ZhbCwgaGFuZGxlUmVqZWN0aW9uLCBpc0FwcHJvdmFsT3ZlcmxheVZpc2libGUgfSA9XG4gICAgdXNlQXBwcm92YWxIZWxwZXJzKHtcbiAgICAgIG9uQXBwcm92ZTogc2lnblR4LFxuICAgICAgb25SZWplY3Q6IGNhbmNlbEhhbmRsZXIsXG4gICAgfSk7XG5cbiAgY29uc3QgcmVuZGVyRGV2aWNlQXBwcm92YWwgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKGlzQXBwcm92YWxPdmVybGF5VmlzaWJsZSkge1xuICAgICAgaWYgKGlzVXNpbmdMZWRnZXJXYWxsZXQpIHtcbiAgICAgICAgcmV0dXJuIDxMZWRnZXJBcHByb3ZhbE92ZXJsYXkgLz47XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1dhbGxldENvbm5lY3RBY2NvdW50KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPFdhbGxldENvbm5lY3RBcHByb3ZhbE92ZXJsYXlcbiAgICAgICAgICAgIG9uUmVqZWN0PXtoYW5kbGVSZWplY3Rpb259XG4gICAgICAgICAgICBvblN1Ym1pdD17aGFuZGxlQXBwcm92YWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0ZpcmVibG9ja3NBY2NvdW50KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEZpcmVibG9ja3NBcHByb3ZhbE92ZXJsYXlcbiAgICAgICAgICAgIG9uUmVqZWN0PXtoYW5kbGVSZWplY3Rpb259XG4gICAgICAgICAgICBvblN1Ym1pdD17aGFuZGxlQXBwcm92YWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtcbiAgICBpc0FwcHJvdmFsT3ZlcmxheVZpc2libGUsXG4gICAgaXNVc2luZ0xlZGdlcldhbGxldCxcbiAgICBpc1dhbGxldENvbm5lY3RBY2NvdW50LFxuICAgIGlzRmlyZWJsb2Nrc0FjY291bnQsXG4gICAgaGFuZGxlUmVqZWN0aW9uLFxuICAgIGhhbmRsZUFwcHJvdmFsLFxuICBdKTtcblxuICBjb25zdCByZW5kZXJTaWduVHhEZXRhaWxzID0gdXNlQ2FsbGJhY2soXG4gICAgKHR4OiBBdmFsYW5jaGUuVHgpID0+IHtcbiAgICAgIGlmIChBdmFsYW5jaGUuaXNBZGRWYWxpZGF0b3JUeCh0eCkpIHtcbiAgICAgICAgcmV0dXJuIDxBZGRWYWxpZGF0b3IgdHg9e3R4fSBhdmF4UHJpY2U9e3Rva2VuUHJpY2V9PjwvQWRkVmFsaWRhdG9yPjtcbiAgICAgIH0gZWxzZSBpZiAoQXZhbGFuY2hlLmlzQWRkRGVsZWdhdG9yVHgodHgpKSB7XG4gICAgICAgIHJldHVybiA8QWRkRGVsZWdhdG9yIHR4PXt0eH0gYXZheFByaWNlPXt0b2tlblByaWNlfT48L0FkZERlbGVnYXRvcj47XG4gICAgICB9IGVsc2UgaWYgKEF2YWxhbmNoZS5pc0V4cG9ydFR4KHR4KSkge1xuICAgICAgICByZXR1cm4gPEV4cG9ydFR4VmlldyB0eD17dHh9IGF2YXhQcmljZT17dG9rZW5QcmljZX0+PC9FeHBvcnRUeFZpZXc+O1xuICAgICAgfSBlbHNlIGlmIChBdmFsYW5jaGUuaXNJbXBvcnRUeCh0eCkpIHtcbiAgICAgICAgcmV0dXJuIDxJbXBvcnRUeFZpZXcgdHg9e3R4fSBhdmF4UHJpY2U9e3Rva2VuUHJpY2V9PjwvSW1wb3J0VHhWaWV3PjtcbiAgICAgIH0gZWxzZSBpZiAoQXZhbGFuY2hlLmlzQmFzZVR4KHR4KSkge1xuICAgICAgICByZXR1cm4gPEJhc2VUeFZpZXcgdHg9e3R4fSBhdmF4UHJpY2U9e3Rva2VuUHJpY2V9PjwvQmFzZVR4Vmlldz47XG4gICAgICB9IGVsc2UgaWYgKEF2YWxhbmNoZS5pc0NvbnZlcnRTdWJuZXRUb0wxVHgodHgpKSB7XG4gICAgICAgIHJldHVybiA8QXBwcm92ZUNvbnZlcnRTdWJuZXRUb0wxIHR4PXt0eH0gYXZheFByaWNlPXt0b2tlblByaWNlfSAvPjtcbiAgICAgIH0gZWxzZSBpZiAoQXZhbGFuY2hlLmlzUmVnaXN0ZXJMMVZhbGlkYXRvclR4KHR4KSkge1xuICAgICAgICByZXR1cm4gPEFwcHJvdmVSZWdpc3RlckwxVmFsaWRhdG9yIHR4PXt0eH0gYXZheFByaWNlPXt0b2tlblByaWNlfSAvPjtcbiAgICAgIH0gZWxzZSBpZiAoQXZhbGFuY2hlLmlzRGlzYWJsZUwxVmFsaWRhdG9yVHgodHgpKSB7XG4gICAgICAgIHJldHVybiA8QXBwcm92ZURpc2FibGVMMVZhbGlkYXRvciB0eD17dHh9IGF2YXhQcmljZT17dG9rZW5QcmljZX0gLz47XG4gICAgICB9IGVsc2UgaWYgKEF2YWxhbmNoZS5pc1NldEwxVmFsaWRhdG9yV2VpZ2h0VHgodHgpKSB7XG4gICAgICAgIHJldHVybiA8QXBwcm92ZVNldEwxVmFsaWRhdG9yV2VpZ2h0IHR4PXt0eH0gYXZheFByaWNlPXt0b2tlblByaWNlfSAvPjtcbiAgICAgIH0gZWxzZSBpZiAoQXZhbGFuY2hlLmlzSW5jcmVhc2VMMVZhbGlkYXRvckJhbGFuY2UodHgpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEFwcHJvdmVJbmNyZWFzZUwxVmFsaWRhdG9yQmFsYW5jZSB0eD17dHh9IGF2YXhQcmljZT17dG9rZW5QcmljZX0gLz5cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoQXZhbGFuY2hlLmlzQ3JlYXRlU3VibmV0VHgodHgpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEFwcHJvdmVDcmVhdGVTdWJuZXRcbiAgICAgICAgICAgIHR4PXt0eH1cbiAgICAgICAgICAgIGF2YXhQcmljZT17dG9rZW5QcmljZX1cbiAgICAgICAgICA+PC9BcHByb3ZlQ3JlYXRlU3VibmV0PlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChBdmFsYW5jaGUuaXNDcmVhdGVDaGFpblR4KHR4KSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxBcHByb3ZlQ3JlYXRlQ2hhaW5cbiAgICAgICAgICAgIHR4PXt0eH1cbiAgICAgICAgICAgIGF2YXhQcmljZT17dG9rZW5QcmljZX1cbiAgICAgICAgICA+PC9BcHByb3ZlQ3JlYXRlQ2hhaW4+XG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKEF2YWxhbmNoZS5pc0FkZFN1Ym5ldFZhbGlkYXRvclR4KHR4KSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxBZGRTdWJuZXRWYWxpZGF0b3JWaWV3XG4gICAgICAgICAgICB0eD17dHh9XG4gICAgICAgICAgICBhdmF4UHJpY2U9e3Rva2VuUHJpY2V9XG4gICAgICAgICAgPjwvQWRkU3VibmV0VmFsaWRhdG9yVmlldz5cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoQXZhbGFuY2hlLmlzUmVtb3ZlU3VibmV0VmFsaWRhdG9yVHgodHgpKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPFJlbW92ZVN1Ym5ldFZhbGlkYXRvclZpZXdcbiAgICAgICAgICAgIHR4PXt0eH1cbiAgICAgICAgICAgIGF2YXhQcmljZT17dG9rZW5QcmljZX1cbiAgICAgICAgICA+PC9SZW1vdmVTdWJuZXRWYWxpZGF0b3JWaWV3PlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChBdmFsYW5jaGUuaXNBZGRQZXJtaXNzaW9ubGVzc1ZhbGlkYXRvclR4KHR4KSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxBZGRQZXJtaXNzaW9ubGVzc1ZhbGlkYXRvclxuICAgICAgICAgICAgdHg9e3R4fVxuICAgICAgICAgICAgYXZheFByaWNlPXt0b2tlblByaWNlfVxuICAgICAgICAgID48L0FkZFBlcm1pc3Npb25sZXNzVmFsaWRhdG9yPlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChBdmFsYW5jaGUuaXNBZGRQZXJtaXNzaW9ubGVzc0RlbGVnYXRvclR4KHR4KSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxBZGRQZXJtaXNzaW9ubGVzc0RlbGVnYXRvclxuICAgICAgICAgICAgdHg9e3R4fVxuICAgICAgICAgICAgYXZheFByaWNlPXt0b2tlblByaWNlfVxuICAgICAgICAgID48L0FkZFBlcm1pc3Npb25sZXNzRGVsZWdhdG9yPlxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gPD5VTktOT1dOIFRYPC8+O1xuICAgIH0sXG4gICAgW3Rva2VuUHJpY2VdLFxuICApO1xuXG4gIGlmICghYWN0aW9uKSB7XG4gICAgcmV0dXJuIDxMb2FkaW5nT3ZlcmxheSAvPjtcbiAgfVxuXG4gIGlmICghaXNTaWduaW5nQXZhaWxhYmxlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGdW5jdGlvbklzT2ZmbGluZSBmdW5jdGlvbk5hbWU9e0Z1bmN0aW9uTmFtZXMuRkVBVFVSRX0gaGlkZVBhZ2VUaXRsZSAvPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBweDogMiwgd2lkdGg6IDEsIGhlaWdodDogMSB9fT5cbiAgICAgIHtyZW5kZXJEZXZpY2VBcHByb3ZhbCgpfVxuICAgICAgPEF2YWxhbmNoZVR4SGVhZGVyIHR4PXt0eERhdGF9IC8+XG5cbiAgICAgIDxTY3JvbGxiYXJzPlxuICAgICAgICA8U3RhY2sgc3g9e3sgZ2FwOiAzLjUgfX0+e3JlbmRlclNpZ25UeERldGFpbHModHhEYXRhKX08L1N0YWNrPlxuICAgICAgPC9TY3JvbGxiYXJzPlxuXG4gICAgICA8RXhjZXNzaXZlQnVybldhcm5pbmdEaWFsb2dcbiAgICAgICAgb3Blbj17c2hvd0J1cm5XYXJuaW5nfVxuICAgICAgICBvbkNvbnRpbnVlPXsoKSA9PiBzZXRTaG93QnVybldhcm5pbmcoZmFsc2UpfVxuICAgICAgICBvblJlamVjdD17aGFuZGxlUmVqZWN0aW9ufVxuICAgICAgLz5cblxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgcHQ6IDMsXG4gICAgICAgICAgcGI6IDEsXG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgZ2FwOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlUmVqZWN0aW9ufVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ1JlamVjdCcpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvbiBmdWxsV2lkdGggc2l6ZT1cImxhcmdlXCIgb25DbGljaz17aGFuZGxlQXBwcm92YWx9PlxuICAgICAgICAgIHt0KCdBcHByb3ZlJyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQ2FyZCxcbiAgQ2FyZENvbnRlbnQsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IGJpZ1RvTG9jYWxlU3RyaW5nIH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcbmltcG9ydCB7IEF2YWxhbmNoZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgYmlnaW50VG9CaWcgfSBmcm9tICdAc3JjL3V0aWxzL2JpZ2ludFRvQmlnJztcbmltcG9ydCB7IEF2YWxhbmNoZUNoYWluU3RyaW5ncyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvaGFuZGxlcnMvZXRoX3NlbmRUcmFuc2FjdGlvbi9tb2RlbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWRkRGVsZWdhdG9yKHtcbiAgdHgsXG4gIGF2YXhQcmljZSxcbn06IHtcbiAgdHg6IEF2YWxhbmNoZS5BZGREZWxlZ2F0b3JUeDtcbiAgYXZheFByaWNlOiBudW1iZXI7XG59KSB7XG4gIGNvbnN0IHsgbm9kZUlELCBzdGFydCwgZW5kLCBzdGFrZSwgY2hhaW4sIHR4RmVlIH0gPSB0eDtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgY29uc3Qgc3RhcnREYXRlID0gbmV3IERhdGUocGFyc2VJbnQoc3RhcnQpICogMTAwMCk7XG4gIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZShwYXJzZUludChlbmQpICogMTAwMCk7XG4gIGNvbnN0IGZlZSA9IGJpZ2ludFRvQmlnKHR4RmVlLCA5KTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjaz5cbiAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgbXQ6IDIsXG4gICAgICAgICAgbWI6IDEsXG4gICAgICAgICAgbXg6IDAsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHt0KCdDaGFpbicpfToge0F2YWxhbmNoZUNoYWluU3RyaW5nc1tjaGFpbl19XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8Q2FyZFxuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8Q2FyZENvbnRlbnRcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgcDogMixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnTm9kZSBJRCcpfTpcbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+e25vZGVJRH08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgIDwvQ2FyZD5cbiAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLCBtdDogMywgbWI6IDEsIG14OiAwIH19XG4gICAgICA+XG4gICAgICAgIHt0KCdEZXRhaWxzJyl9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8Q2FyZFxuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8Q2FyZENvbnRlbnRcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgcDogMixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnU3Rha2UgQW1vdW50Jyl9OlxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7YmlnVG9Mb2NhbGVTdHJpbmcoYmlnaW50VG9CaWcoc3Rha2UsIDkpLCA0KX0gQVZBWFxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtjdXJyZW5jeUZvcm1hdHRlcihcbiAgICAgICAgICAgICAgICAgIGJpZ2ludFRvQmlnKHN0YWtlLCA5KS50aW1lcyhhdmF4UHJpY2UpLnRvTnVtYmVyKCksXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1N0YXJ0IERhdGUnKX06XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3N0YXJ0RGF0ZS50b0xvY2FsZVN0cmluZygpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnRW5kIERhdGU6Jyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2VuZERhdGUudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ0ZlZSBBbW91bnQnKX06XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtiaWdUb0xvY2FsZVN0cmluZyhmZWUsIDQpfSBBVkFYXG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2N1cnJlbmN5Rm9ybWF0dGVyKGZlZS50aW1lcyhhdmF4UHJpY2UpLnRvTnVtYmVyKCkpfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBEaXZpZGVyLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcblxuaW1wb3J0IHsgVHJ1bmNhdGVkSWRlbnRpZmllciB9IGZyb20gJy4vVHJ1bmNhdGVkSWRlbnRpZmllcic7XG5pbXBvcnQgeyBBdmF4QW1vdW50IH0gZnJvbSAnLi9BdmF4QW1vdW50JztcbmltcG9ydCB7IEF2YWxhbmNoZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgaXNQcmltYXJ5U3VibmV0IH0gZnJvbSAnQHNyYy91dGlscy9pc1ByaW1hcnlTdWJuZXQnO1xuXG50eXBlIEFkZFBlcm1zc2lvbmxlc3NEZWxlZ2F0b3JQcm9wcyA9IHtcbiAgdHg6IEF2YWxhbmNoZS5BZGRQZXJtaXNzaW9ubGVzc0RlbGVnYXRvclR4O1xuICBhdmF4UHJpY2U6IG51bWJlcjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGRQZXJtaXNzaW9ubGVzc0RlbGVnYXRvcih7XG4gIHR4LFxuICBhdmF4UHJpY2UsXG59OiBBZGRQZXJtc3Npb25sZXNzRGVsZWdhdG9yUHJvcHMpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IG5vZGVJRCwgdHhGZWUsIHN0YXJ0LCBlbmQsIHN0YWtlLCBzdWJuZXRJRCB9ID0gdHg7XG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHN0YXJ0KSAqIDEwMDApO1xuICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUocGFyc2VJbnQoZW5kKSAqIDEwMDApO1xuXG4gIGNvbnN0IGlzUHJpbWFyeU5ldHdvcmsgPSBpc1ByaW1hcnlTdWJuZXQoc3VibmV0SUQpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24gc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdTdGFraW5nIERldGFpbHMnKX0gLz5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHkgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzdGFydCcsIHB5OiAyLjI1IH19PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ05vZGUgSUQnKX0+XG4gICAgICAgICAgICA8VHJ1bmNhdGVkSWRlbnRpZmllciBpZGVudGlmaWVyPXtub2RlSUR9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnU3VibmV0IElEJyl9PlxuICAgICAgICAgICAge2lzUHJpbWFyeU5ldHdvcmsgPyAoXG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+e3QoJ1ByaW1hcnkgTmV0d29yaycpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxUcnVuY2F0ZWRJZGVudGlmaWVyIGlkZW50aWZpZXI9e3N1Ym5ldElEfSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdTdGFrZSBBbW91bnQnKX0+XG4gICAgICAgICAgICA8QXZheEFtb3VudCBhbW91bnQ9e3N0YWtlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cblxuICAgICAgICAgIDxEaXZpZGVyIHN4PXt7IG15OiAxLjI1IH19IC8+XG5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdTdGFydCBEYXRlJyl9PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAge3N0YXJ0RGF0ZS50b0xvY2FsZVN0cmluZygpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuXG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnRW5kIERhdGUnKX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICB7ZW5kRGF0ZS50b0xvY2FsZVN0cmluZygpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ05ldHdvcmsgRmVlJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0ZlZSBBbW91bnQnKX0+XG4gICAgICAgICAgICA8QXZheEFtb3VudCBhbW91bnQ9e3R4RmVlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgRGl2aWRlciwgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7XG4gIEFwcHJvdmFsU2VjdGlvbixcbiAgQXBwcm92YWxTZWN0aW9uQm9keSxcbiAgQXBwcm92YWxTZWN0aW9uSGVhZGVyLFxufSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL0FwcHJvdmFsU2VjdGlvbic7XG5pbXBvcnQgeyBUeERldGFpbHNSb3cgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL1R4RGV0YWlsc1Jvdyc7XG5cbmltcG9ydCB7IFRydW5jYXRlZElkZW50aWZpZXIgfSBmcm9tICcuL1RydW5jYXRlZElkZW50aWZpZXInO1xuaW1wb3J0IHsgQXZheEFtb3VudCB9IGZyb20gJy4vQXZheEFtb3VudCc7XG5pbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcbmltcG9ydCB7IGlzUHJpbWFyeVN1Ym5ldCB9IGZyb20gJ0BzcmMvdXRpbHMvaXNQcmltYXJ5U3VibmV0JztcblxudHlwZSBBZGRQZXJtc3Npb25sZXNzVmFsaWRhdG9yUHJvcHMgPSB7XG4gIHR4OiBBdmFsYW5jaGUuQWRkUGVybWlzc2lvbmxlc3NWYWxpZGF0b3JUeDtcbiAgYXZheFByaWNlOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQWRkUGVybWlzc2lvbmxlc3NWYWxpZGF0b3Ioe1xuICB0eCxcbiAgYXZheFByaWNlLFxufTogQWRkUGVybXNzaW9ubGVzc1ZhbGlkYXRvclByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3Qge1xuICAgIG5vZGVJRCxcbiAgICB0eEZlZSxcbiAgICBzdGFydCxcbiAgICBlbmQsXG4gICAgc3Rha2UsXG4gICAgZGVsZWdhdGlvbkZlZSxcbiAgICBzdWJuZXRJRCxcbiAgICBwdWJsaWNLZXksXG4gICAgc2lnbmF0dXJlLFxuICB9ID0gdHg7XG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHN0YXJ0KSAqIDEwMDApO1xuICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUocGFyc2VJbnQoZW5kKSAqIDEwMDApO1xuXG4gIGNvbnN0IGlzUHJpbWFyeU5ldHdvcmsgPSBpc1ByaW1hcnlTdWJuZXQoc3VibmV0SUQpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24gc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdTdGFraW5nIERldGFpbHMnKX0gLz5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHkgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzdGFydCcsIHB5OiAyLjI1IH19PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ05vZGUgSUQnKX0+XG4gICAgICAgICAgICA8VHJ1bmNhdGVkSWRlbnRpZmllciBpZGVudGlmaWVyPXtub2RlSUR9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnU3VibmV0IElEJyl9PlxuICAgICAgICAgICAge2lzUHJpbWFyeU5ldHdvcmsgPyAoXG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgbXI6IDIuOCB9fT5cbiAgICAgICAgICAgICAgICB7dCgnUHJpbWFyeSBOZXR3b3JrJyl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxUcnVuY2F0ZWRJZGVudGlmaWVyIGlkZW50aWZpZXI9e3N1Ym5ldElEfSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICB7cHVibGljS2V5ICYmIHNpZ25hdHVyZSAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdQdWJsaWMgS2V5Jyl9PlxuICAgICAgICAgICAgICAgIDxUcnVuY2F0ZWRJZGVudGlmaWVyIGlkZW50aWZpZXI9e3B1YmxpY0tleX0gLz5cbiAgICAgICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ1Byb29mJyl9PlxuICAgICAgICAgICAgICAgIDxUcnVuY2F0ZWRJZGVudGlmaWVyIGlkZW50aWZpZXI9e3NpZ25hdHVyZX0gLz5cbiAgICAgICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ1N0YWtlIEFtb3VudCcpfT5cbiAgICAgICAgICAgIDxBdmF4QW1vdW50IGFtb3VudD17c3Rha2V9IGF2YXhQcmljZT17YXZheFByaWNlfSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0RlbGVnYXRpb24gRmVlJyl9PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj57ZGVsZWdhdGlvbkZlZSAvIDEwMDAwfSU8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG5cbiAgICAgICAgICA8RGl2aWRlciBzeD17eyBteTogMS4yNSB9fSAvPlxuXG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnU3RhcnQgRGF0ZScpfT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICAgIHtzdGFydERhdGUudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cblxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0VuZCBEYXRlJyl9PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAge2VuZERhdGUudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgICA8QXBwcm92YWxTZWN0aW9uPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdOZXR3b3JrIEZlZScpfSAvPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdGZWUgQW1vdW50Jyl9PlxuICAgICAgICAgICAgPEF2YXhBbW91bnQgYW1vdW50PXt0eEZlZX0gYXZheFByaWNlPXthdmF4UHJpY2V9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgIDwvQXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgRGl2aWRlciwgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcbmltcG9ydCB7IFRydW5jYXRlZElkZW50aWZpZXIgfSBmcm9tICcuL1RydW5jYXRlZElkZW50aWZpZXInO1xuaW1wb3J0IHsgQXZheEFtb3VudCB9IGZyb20gJy4vQXZheEFtb3VudCc7XG5pbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFkZFN1Ym5ldFZhbGlkYXRvclZpZXcoe1xuICB0eCxcbiAgYXZheFByaWNlLFxufToge1xuICB0eDogQXZhbGFuY2hlLkFkZFN1Ym5ldFZhbGlkYXRvclR4O1xuICBhdmF4UHJpY2U6IG51bWJlcjtcbn0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IHR4RmVlLCBub2RlSUQsIHN0YXJ0LCBlbmQsIHN1Ym5ldElELCBzdGFrZSB9ID0gdHg7XG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHN0YXJ0KSAqIDEwMDApO1xuICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUocGFyc2VJbnQoZW5kKSAqIDEwMDApO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24gc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdTdGFraW5nIERldGFpbHMnKX0gLz5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHkgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzdGFydCcsIHB5OiAyLjI1IH19PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ1N1Ym5ldCBJRCcpfT5cbiAgICAgICAgICAgIDxUcnVuY2F0ZWRJZGVudGlmaWVyIGlkZW50aWZpZXI9e3N1Ym5ldElEfSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ05vZGUgSUQnKX0+XG4gICAgICAgICAgICA8VHJ1bmNhdGVkSWRlbnRpZmllciBpZGVudGlmaWVyPXtub2RlSUR9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnU3Rha2UgQW1vdW50Jyl9PlxuICAgICAgICAgICAgPEF2YXhBbW91bnQgYW1vdW50PXtzdGFrZX0gYXZheFByaWNlPXthdmF4UHJpY2V9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG5cbiAgICAgICAgICA8RGl2aWRlciBzeD17eyBteTogMS4yNSB9fSAvPlxuXG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnU3RhcnQgRGF0ZScpfT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICAgIHtzdGFydERhdGUudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cblxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0VuZCBEYXRlJyl9PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAge2VuZERhdGUudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgICA8QXBwcm92YWxTZWN0aW9uPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdOZXR3b3JrIEZlZScpfSAvPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdGZWUgQW1vdW50Jyl9PlxuICAgICAgICAgICAgPEF2YXhBbW91bnQgYW1vdW50PXt0eEZlZX0gYXZheFByaWNlPXthdmF4UHJpY2V9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgIDwvQXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IERpdmlkZXIsIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQge1xuICBBcHByb3ZhbFNlY3Rpb24sXG4gIEFwcHJvdmFsU2VjdGlvbkJvZHksXG4gIEFwcHJvdmFsU2VjdGlvbkhlYWRlcixcbn0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9BcHByb3ZhbFNlY3Rpb24nO1xuaW1wb3J0IHsgVHhEZXRhaWxzUm93IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9UeERldGFpbHNSb3cnO1xuXG5pbXBvcnQgeyBUcnVuY2F0ZWRJZGVudGlmaWVyIH0gZnJvbSAnLi9UcnVuY2F0ZWRJZGVudGlmaWVyJztcbmltcG9ydCB7IEF2YXhBbW91bnQgfSBmcm9tICcuL0F2YXhBbW91bnQnO1xuaW1wb3J0IHsgQXZhbGFuY2hlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5cbnR5cGUgQWRkVmFsaWRhdG9yUHJvcHMgPSB7XG4gIHR4OiBBdmFsYW5jaGUuQWRkVmFsaWRhdG9yVHg7XG4gIGF2YXhQcmljZTogbnVtYmVyO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEFkZFZhbGlkYXRvcih7IHR4LCBhdmF4UHJpY2UgfTogQWRkVmFsaWRhdG9yUHJvcHMpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IG5vZGVJRCwgdHhGZWUsIHN0YXJ0LCBlbmQsIHN0YWtlLCBkZWxlZ2F0aW9uRmVlIH0gPSB0eDtcbiAgY29uc3Qgc3RhcnREYXRlID0gbmV3IERhdGUocGFyc2VJbnQoc3RhcnQpICogMTAwMCk7XG4gIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZShwYXJzZUludChlbmQpICogMTAwMCk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEFwcHJvdmFsU2VjdGlvbiBzeD17eyBnYXA6IDEgfX0+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ1N0YWtpbmcgRGV0YWlscycpfSAvPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uQm9keSBzeD17eyBqdXN0aWZ5Q29udGVudDogJ3N0YXJ0JywgcHk6IDIuMjUgfX0+XG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnTm9kZSBJRCcpfT5cbiAgICAgICAgICAgIDxUcnVuY2F0ZWRJZGVudGlmaWVyIGlkZW50aWZpZXI9e25vZGVJRH0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdTdGFrZSBBbW91bnQnKX0+XG4gICAgICAgICAgICA8QXZheEFtb3VudCBhbW91bnQ9e3N0YWtlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdEZWxlZ2F0aW9uIEZlZScpfT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+e2RlbGVnYXRpb25GZWUgLyAxMDAwMH0lPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuXG4gICAgICAgICAgPERpdmlkZXIgc3g9e3sgbXk6IDEuMjUgfX0gLz5cblxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ1N0YXJ0IERhdGUnKX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICB7c3RhcnREYXRlLnRvTG9jYWxlU3RyaW5nKCl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdFbmQgRGF0ZScpfT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICAgIHtlbmREYXRlLnRvTG9jYWxlU3RyaW5nKCl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgIDwvQXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgICAgPEFwcHJvdmFsU2VjdGlvbj5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkhlYWRlciBsYWJlbD17dCgnTmV0d29yayBGZWUnKX0gLz5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnRmVlIEFtb3VudCcpfT5cbiAgICAgICAgICAgIDxBdmF4QW1vdW50IGFtb3VudD17dHhGZWV9IGF2YXhQcmljZT17YXZheFByaWNlfSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEF2YWxhbmNoZUNvbG9ySWNvbixcbiAgQ2FyZCxcbiAgQ2FyZENvbnRlbnQsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IFRva2VuVW5pdCwgYmlnSW50VG9TdHJpbmcgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgQXZhbGFuY2hlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5pbXBvcnQgeyBBdmFsYW5jaGVDaGFpblN0cmluZ3MgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L2hhbmRsZXJzL2V0aF9zZW5kVHJhbnNhY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7IFBWTSB9IGZyb20gJ0BhdmFsYWJzL2F2YWxhbmNoZWpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIEJhc2VUeFZpZXcoe1xuICB0eCxcbiAgYXZheFByaWNlLFxufToge1xuICB0eDogQXZhbGFuY2hlLkJhc2VUeDtcbiAgYXZheFByaWNlOiBudW1iZXI7XG59KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBjdXJyZW5jeUZvcm1hdHRlciB9ID0gdXNlU2V0dGluZ3NDb250ZXh0KCk7XG4gIGNvbnN0IHsgY2hhaW4sIHR4RmVlLCBvdXRwdXRzLCBtZW1vIH0gPSB0eDtcblxuICBjb25zdCBkZWZhdWx0RGVub21pbmF0aW9uID0gY2hhaW4gPT09IFBWTSA/IDkgOiAwO1xuXG4gIGNvbnN0IGlzRGF0ZUZ1dHVyZSA9IChkYXRlOiBiaWdpbnQpID0+IHtcbiAgICBjb25zdCBub3cgPSBBdmFsYW5jaGUuZ2V0VW5peE5vdygpO1xuICAgIHJldHVybiBkYXRlID4gbm93O1xuICB9O1xuXG4gIGNvbnN0IHVuaXhUb0xvY2FsZVN0cmluZyA9IChkYXRlOiBiaWdpbnQpID0+IHtcbiAgICByZXR1cm4gbmV3IERhdGUoTnVtYmVyKGRhdGUudG9TdHJpbmcoKSkgKiAxMDAwKS50b0xvY2FsZVN0cmluZygpO1xuICB9O1xuXG4gIGNvbnN0IGdldERpc3BsYXlBbW91bnQgPSAodmFsdWU6IGJpZ2ludCwgZGVjaW1hbHM6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiBOdW1iZXIoXG4gICAgICBiaWdJbnRUb1N0cmluZyh2YWx1ZSwgZGVjaW1hbHMpLnJlcGxhY2UoLywvZywgJycpLCAvLyBSZW1vdmUgdGhvdXNhbmQgc2VwYXJhdG9ycyB3aGljaCBtYWtlcyBOdW1iZXIgdG8gcmV0dXJuIE5hTlxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZmVlID0gbmV3IFRva2VuVW5pdCh0eEZlZSwgOSwgJ0FWQVgnKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjaz5cbiAgICAgIHsvKiBzb3VyY2UgY2hhaW4gKi99XG4gICAgICA8U3RhY2s+XG4gICAgICAgIDxDYXJkXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8Q2FyZENvbnRlbnRcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0KCdTb3VyY2UgQ2hhaW4nKX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgIHtBdmFsYW5jaGVDaGFpblN0cmluZ3NbY2hhaW5dfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICAgIDwvQ2FyZD5cbiAgICAgIDwvU3RhY2s+XG5cbiAgICAgIHsvKiBkZXRhaWxzICovfVxuICAgICAgPFN0YWNrPlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgICAgbXQ6IDIsXG4gICAgICAgICAgICBtYjogMSxcbiAgICAgICAgICAgIG14OiAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnRGV0YWlscycpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIHtvdXRwdXRzLm1hcCgob3V0KSA9PiAoXG4gICAgICAgICAgPENhcmRcbiAgICAgICAgICAgIGtleT17b3V0LmFzc2V0RGVzY3JpcHRpb24/LmFzc2V0SUR9XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgbWI6IDIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxDYXJkQ29udGVudFxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7b3V0LmlzQXZheCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPEF2YWxhbmNoZUNvbG9ySWNvbiBzaXplPXsnMzJweCd9IHN4PXt7IG1yOiAxIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNlwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtvdXQuYXNzZXREZXNjcmlwdGlvbj8uc3ltYm9sID8/IChvdXQuaXNBdmF4ICYmICdBVkFYJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHtnZXREaXNwbGF5QW1vdW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0LmFtb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dC5hc3NldERlc2NyaXB0aW9uPy5kZW5vbWluYXRpb24gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdERlbm9taW5hdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICApfXsnICd9XG4gICAgICAgICAgICAgICAgICAgICAge291dC5hc3NldERlc2NyaXB0aW9uPy5zeW1ib2wgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgIChvdXQuaXNBdmF4ID8gJ0FWQVgnIDogJycpfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgIHtvdXQuaXNBdmF4ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge2N1cnJlbmN5Rm9ybWF0dGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnZXREaXNwbGF5QW1vdW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dC5hbW91bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0LmFzc2V0RGVzY3JpcHRpb24/LmRlbm9taW5hdGlvbiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdERlbm9taW5hdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSAqIGF2YXhQcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgIHtpc0RhdGVGdXR1cmUob3V0LmxvY2t0aW1lKSAmJiAoXG4gICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIG10OiAwLjUsXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3QoJ0xvY2t0aW1lJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3VuaXhUb0xvY2FsZVN0cmluZyhvdXQubG9ja3RpbWUpfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAge291dC5vd25lcnMubGVuZ3RoID4gMSAmJiAoXG4gICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIG10OiAwLjUsXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3QoJ1RocmVzaG9sZCcpfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHtvdXQudGhyZXNob2xkLnRvU3RyaW5nKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgbXQ6IDAuNSB9fT5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5Pnt0KCdSZWNpcGllbnRzJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAge291dC5vd25lcnMubWFwKChhZGRyZXNzKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAga2V5PXthZGRyZXNzfVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHthZGRyZXNzfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICkpfVxuICAgICAgPC9TdGFjaz5cblxuICAgICAgey8qIG5ldHdvcmsgZmVlICovfVxuICAgICAgPFN0YWNrPlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgICAgbXQ6IDEsXG4gICAgICAgICAgICBtYjogMSxcbiAgICAgICAgICAgIG14OiAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnTmV0d29yayBGZWUnKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8Q2FyZFxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPENhcmRDb250ZW50XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBwOiAyLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dCgnRmVlIEFtb3VudCcpfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtmZWUudG9EaXNwbGF5KCl9IEFWQVhcbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtjdXJyZW5jeUZvcm1hdHRlcihcbiAgICAgICAgICAgICAgICAgICAgZmVlLnRvRGlzcGxheSh7IGFzTnVtYmVyOiB0cnVlIH0pICogYXZheFByaWNlLFxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICAgIDwvQ2FyZD5cbiAgICAgIDwvU3RhY2s+XG5cbiAgICAgIHsvKiBtZW1vICovfVxuICAgICAge2NoYWluICE9PSBQVk0gJiYgbWVtbyAmJiAoXG4gICAgICAgIDxTdGFjaz5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgICAgICBtdDogMyxcbiAgICAgICAgICAgICAgbWI6IDEsXG4gICAgICAgICAgICAgIG14OiAwLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnTWVtbycpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8Q2FyZFxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxDYXJkQ29udGVudFxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge21lbW99XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICAgICAgPC9DYXJkPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgKX1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IERpdmlkZXIsIFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcblxuaW1wb3J0IHsgVHJ1bmNhdGVkSWRlbnRpZmllciB9IGZyb20gJy4vVHJ1bmNhdGVkSWRlbnRpZmllcic7XG5pbXBvcnQgeyBBdmF4QW1vdW50IH0gZnJvbSAnLi9BdmF4QW1vdW50JztcbmltcG9ydCB7IEF2YWxhbmNoZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXBwcm92ZUNvbnZlcnRTdWJuZXRUb0wxKHtcbiAgdHgsXG4gIGF2YXhQcmljZSxcbn06IHtcbiAgdHg6IEF2YWxhbmNoZS5Db252ZXJ0U3VibmV0VG9MMVR4O1xuICBhdmF4UHJpY2U6IG51bWJlcjtcbn0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IHR4RmVlLCBjaGFpbklELCBtYW5hZ2VyQWRkcmVzcywgc3VibmV0SUQsIHZhbGlkYXRvcnMgfSA9IHR4O1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24gc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdTdWJuZXQgRGV0YWlscycpfSAvPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uQm9keSBzeD17eyBqdXN0aWZ5Q29udGVudDogJ3N0YXJ0JywgcHk6IDIuMjUgfX0+XG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnU3VibmV0IElEJyl9PlxuICAgICAgICAgICAgPFRydW5jYXRlZElkZW50aWZpZXIgaWRlbnRpZmllcj17c3VibmV0SUR9IHNpemU9ezE0fSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0NoYWluIElEJyl9PlxuICAgICAgICAgICAgPFRydW5jYXRlZElkZW50aWZpZXIgaWRlbnRpZmllcj17Y2hhaW5JRH0gc2l6ZT17MTR9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnTWFuYWdlciBBZGRyZXNzJyl9PlxuICAgICAgICAgICAgPFRydW5jYXRlZElkZW50aWZpZXIgaWRlbnRpZmllcj17bWFuYWdlckFkZHJlc3N9IHNpemU9ezE0fSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24gc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdWYWxpZGF0b3JzJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5XG4gICAgICAgICAgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzdGFydCcsIHB5OiAyLjI1IH19XG4gICAgICAgICAgZGl2aWRlcj17PERpdmlkZXIgc3g9e3sgbXk6IDEuNSB9fSAvPn1cbiAgICAgICAgPlxuICAgICAgICAgIHt2YWxpZGF0b3JzLm1hcChcbiAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgIGJhbGFuY2UsXG4gICAgICAgICAgICAgIHN0YWtlLFxuICAgICAgICAgICAgICBub2RlSWQsXG4gICAgICAgICAgICAgIHJlbWFpbmluZ0JhbGFuY2VPd25lcnMsXG4gICAgICAgICAgICAgIGRlYWN0aXZhdGlvbk93bmVycyxcbiAgICAgICAgICAgIH0pID0+IChcbiAgICAgICAgICAgICAgPFN0YWNrIGtleT17bm9kZUlkfSBzeD17eyBnYXA6IDAuNSB9fT5cbiAgICAgICAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdOb2RlIElEJyl9PlxuICAgICAgICAgICAgICAgICAgPFRydW5jYXRlZElkZW50aWZpZXIgaWRlbnRpZmllcj17bm9kZUlkfSBzaXplPXsxNH0gLz5cbiAgICAgICAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdCYWxhbmNlJyl9PlxuICAgICAgICAgICAgICAgICAgPEF2YXhBbW91bnQgYW1vdW50PXtiYWxhbmNlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdTdGFrZScpfT5cbiAgICAgICAgICAgICAgICAgIDxBdmF4QW1vdW50IGFtb3VudD17c3Rha2V9IGF2YXhQcmljZT17YXZheFByaWNlfSAvPlxuICAgICAgICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICAgICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDEsIG1iOiAyIH19PlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgIHt0KCdPd25lcnMgQWJsZSB0byBEZWFjdGl2YXRlJyl9XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgcGw6IDIsIGdhcDogMC41IH19PlxuICAgICAgICAgICAgICAgICAgICB7ZGVhY3RpdmF0aW9uT3duZXJzLm1hcCgoYWRkcmVzcykgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxUcnVuY2F0ZWRJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2FkZHJlc3N9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyPXthZGRyZXNzfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT17MTR9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMSB9fT5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICB7dCgnT3duZXJzIG9mIHRoZSBSZW1haW5pbmcgQmFsYW5jZScpfVxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IHBsOiAyLCBnYXA6IDAuNSB9fT5cbiAgICAgICAgICAgICAgICAgICAge3JlbWFpbmluZ0JhbGFuY2VPd25lcnMubWFwKChhZGRyZXNzKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRydW5jYXRlZElkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17YWRkcmVzc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI9e2FkZHJlc3N9XG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplPXsxNH1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICksXG4gICAgICAgICAgKX1cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgICA8QXBwcm92YWxTZWN0aW9uPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdOZXR3b3JrIEZlZScpfSAvPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdGZWUgQW1vdW50Jyl9PlxuICAgICAgICAgICAgPEF2YXhBbW91bnQgYW1vdW50PXt0eEZlZX0gYXZheFByaWNlPXthdmF4UHJpY2V9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgIDwvQXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgQnV0dG9uLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcblxuaW1wb3J0IHsgQXZheEFtb3VudCB9IGZyb20gJy4vQXZheEFtb3VudCc7XG5pbXBvcnQgeyBUcnVuY2F0ZWRJZGVudGlmaWVyIH0gZnJvbSAnLi9UcnVuY2F0ZWRJZGVudGlmaWVyJztcbmltcG9ydCB7IEJsb2NrY2hhaW5HZW5lc2lzRmlsZSB9IGZyb20gJy4vQmxvY2tjaGFpbkdlbmVzaXNGaWxlJztcbmltcG9ydCB7IEF2YWxhbmNoZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXBwcm92ZUNyZWF0ZUNoYWluKHtcbiAgdHgsXG4gIGF2YXhQcmljZSxcbn06IHtcbiAgdHg6IEF2YWxhbmNoZS5DcmVhdGVDaGFpblR4O1xuICBhdmF4UHJpY2U6IG51bWJlcjtcbn0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGNoYWluSUQsIGNoYWluTmFtZSwgdm1JRCwgZ2VuZXNpc0RhdGEsIHR4RmVlIH0gPSB0eDtcblxuICBjb25zdCBbaXNHZW5lc2lzRmlsZVNob3duLCBzZXRJc0dlbmVzaXNGaWxlU2hvd25dID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtpc0dlbmVzaXNGaWxlU2hvd24gJiYgKFxuICAgICAgICA8QmxvY2tjaGFpbkdlbmVzaXNGaWxlXG4gICAgICAgICAgZGF0YT17Z2VuZXNpc0RhdGF9XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0SXNHZW5lc2lzRmlsZVNob3duKGZhbHNlKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICA8QXBwcm92YWxTZWN0aW9uIHN4PXt7IGdhcDogMSB9fT5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkhlYWRlciBsYWJlbD17dCgnQmxvY2tjaGFpbiBEZXRhaWxzJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IGp1c3RpZnlDb250ZW50OiAnc3RhcnQnLCBweTogMi4yNSB9fT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdCbG9ja2NoYWluIE5hbWUnKX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPntjaGFpbk5hbWV9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0Jsb2NrY2hhaW4gSUQnKX0+XG4gICAgICAgICAgICA8VHJ1bmNhdGVkSWRlbnRpZmllciBpZGVudGlmaWVyPXtjaGFpbklEfSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0dlbmVzaXMgRmlsZScpfT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc0dlbmVzaXNGaWxlU2hvd24odHJ1ZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdWaWV3Jyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdWaXJ0dWFsIE1hY2hpbmUgSUQnKX0+XG4gICAgICAgICAgICA8VHJ1bmNhdGVkSWRlbnRpZmllciBpZGVudGlmaWVyPXt2bUlEfSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ05ldHdvcmsgRmVlJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0ZlZSBBbW91bnQnKX0+XG4gICAgICAgICAgICA8QXZheEFtb3VudCBhbW91bnQ9e3R4RmVlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgU3RhY2ssIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQge1xuICBBcHByb3ZhbFNlY3Rpb24sXG4gIEFwcHJvdmFsU2VjdGlvbkJvZHksXG4gIEFwcHJvdmFsU2VjdGlvbkhlYWRlcixcbn0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9BcHByb3ZhbFNlY3Rpb24nO1xuaW1wb3J0IHsgVHhEZXRhaWxzUm93IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9UeERldGFpbHNSb3cnO1xuXG5pbXBvcnQgeyBUcnVuY2F0ZWRJZGVudGlmaWVyIH0gZnJvbSAnLi9UcnVuY2F0ZWRJZGVudGlmaWVyJztcbmltcG9ydCB7IEF2YXhBbW91bnQgfSBmcm9tICcuL0F2YXhBbW91bnQnO1xuaW1wb3J0IHsgQXZhbGFuY2hlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcHByb3ZlQ3JlYXRlU3VibmV0KHtcbiAgdHgsXG4gIGF2YXhQcmljZSxcbn06IHtcbiAgdHg6IEF2YWxhbmNoZS5DcmVhdGVTdWJuZXRUeDtcbiAgYXZheFByaWNlOiBudW1iZXI7XG59KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyB0aHJlc2hvbGQsIGNvbnRyb2xLZXlzLCB0eEZlZSB9ID0gdHg7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEFwcHJvdmFsU2VjdGlvbiBzeD17eyBnYXA6IDEgfX0+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ1N1Ym5ldCBEZXRhaWxzJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IGp1c3RpZnlDb250ZW50OiAnc3RhcnQnLCBweTogMi4yNSB9fT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93XG4gICAgICAgICAgICBsYWJlbD17Y29udHJvbEtleXMubGVuZ3RoID4gMSA/IHQoJ093bmVycycpIDogdCgnT3duZXInKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3RhY2sgc3g9e3sgZ2FwOiAwLjUgfX0+XG4gICAgICAgICAgICAgIHtjb250cm9sS2V5cy5tYXAoKGtleSkgPT4gKFxuICAgICAgICAgICAgICAgIDxUcnVuY2F0ZWRJZGVudGlmaWVyIGtleT17a2V5fSBpZGVudGlmaWVyPXtrZXl9IHNpemU9ezE0fSAvPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAge2NvbnRyb2xLZXlzLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnU2lnbmF0dXJlIFRocmVzaG9sZCcpfT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAgICB7dGhyZXNob2xkfS97Y29udHJvbEtleXMubGVuZ3RofVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICApfVxuICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ05ldHdvcmsgRmVlJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0ZlZSBBbW91bnQnKX0+XG4gICAgICAgICAgICA8QXZheEFtb3VudCBhbW91bnQ9e3R4RmVlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQge1xuICBBcHByb3ZhbFNlY3Rpb24sXG4gIEFwcHJvdmFsU2VjdGlvbkJvZHksXG4gIEFwcHJvdmFsU2VjdGlvbkhlYWRlcixcbn0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9BcHByb3ZhbFNlY3Rpb24nO1xuaW1wb3J0IHsgVHhEZXRhaWxzUm93IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9UeERldGFpbHNSb3cnO1xuXG5pbXBvcnQgeyBBdmF4QW1vdW50IH0gZnJvbSAnLi9BdmF4QW1vdW50JztcbmltcG9ydCB7IEF2YWxhbmNoZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgVHJ1bmNhdGVkSWRlbnRpZmllciB9IGZyb20gJy4vVHJ1bmNhdGVkSWRlbnRpZmllcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcHByb3ZlRGlzYWJsZUwxVmFsaWRhdG9yKHtcbiAgdHgsXG4gIGF2YXhQcmljZSxcbn06IHtcbiAgdHg6IEF2YWxhbmNoZS5EaXNhYmxlTDFWYWxpZGF0b3JUeDtcbiAgYXZheFByaWNlOiBudW1iZXI7XG59KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCB7IHR4RmVlLCB2YWxpZGF0aW9uSWQgfSA9IHR4O1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24gc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdEZXRhaWxzJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IGp1c3RpZnlDb250ZW50OiAnc3RhcnQnLCBweTogMi4yNSB9fT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdWYWxpZGF0aW9uIElEJyl9PlxuICAgICAgICAgICAgPFRydW5jYXRlZElkZW50aWZpZXIgaWRlbnRpZmllcj17dmFsaWRhdGlvbklkfSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ05ldHdvcmsgRmVlJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0ZlZSBBbW91bnQnKX0+XG4gICAgICAgICAgICA8QXZheEFtb3VudCBhbW91bnQ9e3R4RmVlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBBdmFsYW5jaGVDb2xvckljb24sXG4gIENhcmQsXG4gIENhcmRDb250ZW50LFxuICBEaXZpZGVyLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBUb2tlblVuaXQgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgQXZhbGFuY2hlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5pbXBvcnQgeyBBdmFsYW5jaGVDaGFpblN0cmluZ3MgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L2hhbmRsZXJzL2V0aF9zZW5kVHJhbnNhY3Rpb24vbW9kZWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIEV4cG9ydFR4Vmlldyh7XG4gIHR4LFxuICBhdmF4UHJpY2UsXG59OiB7XG4gIHR4OiBBdmFsYW5jaGUuRXhwb3J0VHg7XG4gIGF2YXhQcmljZTogbnVtYmVyO1xufSkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY3VycmVuY3lGb3JtYXR0ZXIgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICBjb25zdCB7IGFtb3VudDogYW1vdW50UmF3LCBjaGFpbiwgZGVzdGluYXRpb24sIHR5cGUsIHR4RmVlIH0gPSB0eDtcbiAgY29uc3QgYW1vdW50ID0gbmV3IFRva2VuVW5pdChhbW91bnRSYXcsIDksICdBVkFYJyk7XG4gIGNvbnN0IGZlZSA9IG5ldyBUb2tlblVuaXQodHhGZWUsIDksICdBVkFYJyk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2s+XG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICBzeD17e1xuICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgIG10OiAyLFxuICAgICAgICAgIG1iOiAxLFxuICAgICAgICAgIG14OiAwLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dCgnQ2hhaW4nKX06IHtBdmFsYW5jaGVDaGFpblN0cmluZ3NbY2hhaW5dfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPENhcmRcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPENhcmRDb250ZW50XG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgICBtYjogMSxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1NvdXJjZSBDaGFpbicpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAge0F2YWxhbmNoZUNoYWluU3RyaW5nc1tjaGFpbl19XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdUYXJnZXQgQ2hhaW4nKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICAgIHtBdmFsYW5jaGVDaGFpblN0cmluZ3NbZGVzdGluYXRpb25dfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICBzeD17e1xuICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgIG10OiAyLFxuICAgICAgICAgIG1iOiAxLFxuICAgICAgICAgIG14OiAwLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dCgnVG9rZW4nKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDxDYXJkXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDYXJkQ29udGVudFxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBwOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICBtYjogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnVHJhbnNhY3Rpb24gVHlwZScpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAge3R5cGUgPyAodHlwZVswXSB8fCAnJykudG9VcHBlckNhc2UoKSArIHR5cGUuc2xpY2UoMSkgOiAnJ31cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxEaXZpZGVyIC8+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgbXQ6IDEuNSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEF2YWxhbmNoZUNvbG9ySWNvbiBzaXplPXsnMzJweCd9IC8+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHN4PXt7IG1sOiAxIH19IHZhcmlhbnQ9XCJoNlwiPlxuICAgICAgICAgICAgICAgIEFWQVhcbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2Ftb3VudC50b0Rpc3BsYXkoKX0gQVZBWFxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2N1cnJlbmN5Rm9ybWF0dGVyKFxuICAgICAgICAgICAgICAgICAgYW1vdW50LnRvRGlzcGxheSh7IGFzTnVtYmVyOiB0cnVlIH0pICogYXZheFByaWNlLFxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgIDwvQ2FyZD5cbiAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgbXQ6IDMsXG4gICAgICAgICAgbWI6IDEsXG4gICAgICAgICAgbXg6IDAsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHt0KCdOZXR3b3JrIEZlZScpfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPENhcmRcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPENhcmRDb250ZW50XG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ0ZlZSBBbW91bnQnKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2ZlZS50b1N0cmluZygpfSBBVkFYXG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Y3VycmVuY3lGb3JtYXR0ZXIoXG4gICAgICAgICAgICAgICAgICBmZWUudG9EaXNwbGF5KHsgYXNOdW1iZXI6IHRydWUgfSkgKiBhdmF4UHJpY2UsXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L0NhcmRDb250ZW50PlxuICAgICAgPC9DYXJkPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBBdmFsYW5jaGVDb2xvckljb24sXG4gIENhcmQsXG4gIENhcmRDb250ZW50LFxuICBEaXZpZGVyLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBUb2tlblVuaXQgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgQXZhbGFuY2hlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5pbXBvcnQgeyBBdmFsYW5jaGVDaGFpblN0cmluZ3MgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L2hhbmRsZXJzL2V0aF9zZW5kVHJhbnNhY3Rpb24vbW9kZWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIEltcG9ydFR4Vmlldyh7XG4gIHR4LFxuICBhdmF4UHJpY2UsXG59OiB7XG4gIHR4OiBBdmFsYW5jaGUuSW1wb3J0VHg7XG4gIGF2YXhQcmljZTogbnVtYmVyO1xufSkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY3VycmVuY3lGb3JtYXR0ZXIgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuXG4gIGNvbnN0IHsgYW1vdW50OiBhbW91bnRSYXcsIGNoYWluLCBzb3VyY2UsIHR5cGUsIHR4RmVlIH0gPSB0eDtcbiAgY29uc3QgYW1vdW50ID0gbmV3IFRva2VuVW5pdChhbW91bnRSYXcsIDksICdBVkFYJyk7XG4gIGNvbnN0IGZlZSA9IG5ldyBUb2tlblVuaXQodHhGZWUsIDksICdBVkFYJyk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2s+XG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICBzeD17e1xuICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgIG10OiAyLFxuICAgICAgICAgIG1iOiAxLFxuICAgICAgICAgIG14OiAwLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dCgnQ2hhaW4nKX06IHtBdmFsYW5jaGVDaGFpblN0cmluZ3NbY2hhaW5dfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPENhcmRcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPENhcmRDb250ZW50XG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgICBtYjogMSxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1NvdXJjZSBDaGFpbicpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAge0F2YWxhbmNoZUNoYWluU3RyaW5nc1tzb3VyY2VdfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5zZWNvbmRhcnknLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnVGFyZ2V0IENoYWluJyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICB7QXZhbGFuY2hlQ2hhaW5TdHJpbmdzW2NoYWluXX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L0NhcmRDb250ZW50PlxuICAgICAgPC9DYXJkPlxuICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICBtdDogMixcbiAgICAgICAgICBtYjogMSxcbiAgICAgICAgICBteDogMCxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge3QoJ1Rva2VuJyl9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8Q2FyZFxuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8Q2FyZENvbnRlbnRcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgcDogMixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgbWI6IDEsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1RyYW5zYWN0aW9uIFR5cGUnKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICAgIHt0eXBlID8gKHR5cGVbMF0gfHwgJycpLnRvVXBwZXJDYXNlKCkgKyB0eXBlLnNsaWNlKDEpIDogJyd9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8RGl2aWRlciAvPlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgIG10OiAxLjUsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxBdmFsYW5jaGVDb2xvckljb24gc2l6ZT17JzMycHgnfSAvPlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtbDogMSB9fSB2YXJpYW50PVwiaDZcIj5cbiAgICAgICAgICAgICAgICBBVkFYXG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHthbW91bnQudG9EaXNwbGF5KCl9IEFWQVhcbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtjdXJyZW5jeUZvcm1hdHRlcihcbiAgICAgICAgICAgICAgICAgIGFtb3VudC50b0Rpc3BsYXkoeyBhc051bWJlcjogdHJ1ZSB9KSAqIGF2YXhQcmljZSxcbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICBzeD17e1xuICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgIG10OiAzLFxuICAgICAgICAgIG1iOiAxLFxuICAgICAgICAgIG14OiAwLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dCgnTmV0d29yayBGZWUnKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDxDYXJkXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDYXJkQ29udGVudFxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBwOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdGZWUgQW1vdW50Jyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtmZWUudG9TdHJpbmcoKX0gQVZBWFxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2N1cnJlbmN5Rm9ybWF0dGVyKFxuICAgICAgICAgICAgICAgICAgZmVlLnRvRGlzcGxheSh7IGFzTnVtYmVyOiB0cnVlIH0pICogYXZheFByaWNlLFxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgIDwvQ2FyZD5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcblxuaW1wb3J0IHsgQXZheEFtb3VudCB9IGZyb20gJy4vQXZheEFtb3VudCc7XG5pbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcbmltcG9ydCB7IFRydW5jYXRlZElkZW50aWZpZXIgfSBmcm9tICcuL1RydW5jYXRlZElkZW50aWZpZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gQXBwcm92ZUluY3JlYXNlTDFWYWxpZGF0b3JCYWxhbmNlKHtcbiAgdHgsXG4gIGF2YXhQcmljZSxcbn06IHtcbiAgdHg6IEF2YWxhbmNoZS5JbmNyZWFzZUwxVmFsaWRhdG9yQmFsYW5jZVR4O1xuICBhdmF4UHJpY2U6IG51bWJlcjtcbn0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IHsgdHhGZWUsIGJhbGFuY2UsIHZhbGlkYXRpb25JZCB9ID0gdHg7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEFwcHJvdmFsU2VjdGlvbiBzeD17eyBnYXA6IDEgfX0+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ0RldGFpbHMnKX0gLz5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHkgc3g9e3sganVzdGlmeUNvbnRlbnQ6ICdzdGFydCcsIHB5OiAyLjI1IH19PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ1ZhbGlkYXRpb24gSUQnKX0+XG4gICAgICAgICAgICA8VHJ1bmNhdGVkSWRlbnRpZmllciBpZGVudGlmaWVyPXt2YWxpZGF0aW9uSWR9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnSW5jcmVhc2UgYnkgYW1vdW50Jyl9PlxuICAgICAgICAgICAgPEF2YXhBbW91bnQgYW1vdW50PXtiYWxhbmNlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgICA8QXBwcm92YWxTZWN0aW9uPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdOZXR3b3JrIEZlZScpfSAvPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdGZWUgQW1vdW50Jyl9PlxuICAgICAgICAgICAgPEF2YXhBbW91bnQgYW1vdW50PXt0eEZlZX0gYXZheFByaWNlPXthdmF4UHJpY2V9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgIDwvQXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcblxuaW1wb3J0IHsgQXZheEFtb3VudCB9IGZyb20gJy4vQXZheEFtb3VudCc7XG5pbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFwcHJvdmVSZWdpc3RlckwxVmFsaWRhdG9yKHtcbiAgdHgsXG4gIGF2YXhQcmljZSxcbn06IHtcbiAgdHg6IEF2YWxhbmNoZS5SZWdpc3RlckwxVmFsaWRhdG9yVHg7XG4gIGF2YXhQcmljZTogbnVtYmVyO1xufSkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgdHhGZWUsIGJhbGFuY2UgfSA9IHR4O1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24gc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdEZXRhaWxzJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IGp1c3RpZnlDb250ZW50OiAnc3RhcnQnLCBweTogMi4yNSB9fT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdJbml0aWFsIGJhbGFuY2UnKX0+XG4gICAgICAgICAgICA8QXZheEFtb3VudCBhbW91bnQ9e2JhbGFuY2V9IGF2YXhQcmljZT17YXZheFByaWNlfSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ05ldHdvcmsgRmVlJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0ZlZSBBbW91bnQnKX0+XG4gICAgICAgICAgICA8QXZheEFtb3VudCBhbW91bnQ9e3R4RmVlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcbmltcG9ydCB7IFRydW5jYXRlZElkZW50aWZpZXIgfSBmcm9tICcuL1RydW5jYXRlZElkZW50aWZpZXInO1xuaW1wb3J0IHsgQXZheEFtb3VudCB9IGZyb20gJy4vQXZheEFtb3VudCc7XG5pbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlbW92ZVN1Ym5ldFZhbGlkYXRvclZpZXcoe1xuICB0eCxcbiAgYXZheFByaWNlLFxufToge1xuICB0eDogQXZhbGFuY2hlLlJlbW92ZVN1Ym5ldFZhbGlkYXRvclR4O1xuICBhdmF4UHJpY2U6IG51bWJlcjtcbn0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IHR4RmVlLCBub2RlSUQsIHN1Ym5ldElEIH0gPSB0eDtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8QXBwcm92YWxTZWN0aW9uIHN4PXt7IGdhcDogMSB9fT5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkhlYWRlciBsYWJlbD17dCgnU3Rha2luZyBEZXRhaWxzJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IGp1c3RpZnlDb250ZW50OiAnc3RhcnQnLCBweTogMi4yNSB9fT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdTdWJuZXQgSUQnKX0+XG4gICAgICAgICAgICA8VHJ1bmNhdGVkSWRlbnRpZmllciBpZGVudGlmaWVyPXtzdWJuZXRJRH0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdOb2RlIElEJyl9PlxuICAgICAgICAgICAgPFRydW5jYXRlZElkZW50aWZpZXIgaWRlbnRpZmllcj17bm9kZUlEfSAvPlxuICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ05ldHdvcmsgRmVlJyl9IC8+XG4gICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ0ZlZSBBbW91bnQnKX0+XG4gICAgICAgICAgICA8QXZheEFtb3VudCBhbW91bnQ9e3R4RmVlfSBhdmF4UHJpY2U9e2F2YXhQcmljZX0gLz5cbiAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQge1xuICBBcHByb3ZhbFNlY3Rpb24sXG4gIEFwcHJvdmFsU2VjdGlvbkJvZHksXG4gIEFwcHJvdmFsU2VjdGlvbkhlYWRlcixcbn0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9BcHByb3ZhbFNlY3Rpb24nO1xuaW1wb3J0IHsgVHhEZXRhaWxzUm93IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9UeERldGFpbHNSb3cnO1xuXG5pbXBvcnQgeyBBdmF4QW1vdW50IH0gZnJvbSAnLi9BdmF4QW1vdW50JztcbmltcG9ydCB7IEF2YWxhbmNoZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXBwcm92ZVNldEwxVmFsaWRhdG9yV2VpZ2h0KHtcbiAgdHgsXG4gIGF2YXhQcmljZSxcbn06IHtcbiAgdHg6IEF2YWxhbmNoZS5TZXRMMVZhbGlkYXRvcldlaWdodFR4O1xuICBhdmF4UHJpY2U6IG51bWJlcjtcbn0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IHR4RmVlIH0gPSB0eDtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8QXBwcm92YWxTZWN0aW9uPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdOZXR3b3JrIEZlZScpfSAvPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdGZWUgQW1vdW50Jyl9PlxuICAgICAgICAgICAgPEF2YXhBbW91bnQgYW1vdW50PXt0eEZlZX0gYXZheFByaWNlPXthdmF4UHJpY2V9IC8+XG4gICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgIDwvQXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgQm94LCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IEF2YWxhbmNoZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxudHlwZSBBdmFsYW5jaGVUeEhlYWRlclByb3BzID0ge1xuICB0eDogQXZhbGFuY2hlLlR4O1xufTtcblxuY29uc3QgdXNlQXZhbGFuY2hlVHhIZWFkZXIgPSAodHg6IEF2YWxhbmNoZS5UeCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgc3dpdGNoICh0eC50eXBlKSB7XG4gICAgY2FzZSBBdmFsYW5jaGUuVHhUeXBlLkFkZFBlcm1pc3Npb25sZXNzVmFsaWRhdG9yOlxuICAgIGNhc2UgQXZhbGFuY2hlLlR4VHlwZS5BZGRWYWxpZGF0b3I6XG4gICAgICByZXR1cm4gdCgnQWRkIFZhbGlkYXRvcicpO1xuXG4gICAgY2FzZSBBdmFsYW5jaGUuVHhUeXBlLkFkZFBlcm1pc3Npb25sZXNzRGVsZWdhdG9yOlxuICAgIGNhc2UgQXZhbGFuY2hlLlR4VHlwZS5BZGREZWxlZ2F0b3I6XG4gICAgICByZXR1cm4gdCgnQWRkIERlbGVnYXRvcicpO1xuXG4gICAgY2FzZSBBdmFsYW5jaGUuVHhUeXBlLkFkZFN1Ym5ldFZhbGlkYXRvcjpcbiAgICAgIHJldHVybiB0KCdBZGQgU3VibmV0IFZhbGlkYXRvcicpO1xuXG4gICAgY2FzZSBBdmFsYW5jaGUuVHhUeXBlLlJlbW92ZVN1Ym5ldFZhbGlkYXRvcjpcbiAgICAgIHJldHVybiB0KCdSZW1vdmUgU3VibmV0IFZhbGlkYXRvcicpO1xuXG4gICAgY2FzZSBBdmFsYW5jaGUuVHhUeXBlLkNyZWF0ZUNoYWluOlxuICAgICAgcmV0dXJuIHQoJ0NyZWF0ZSBCbG9ja2NoYWluJyk7XG5cbiAgICBjYXNlIEF2YWxhbmNoZS5UeFR5cGUuQ3JlYXRlU3VibmV0OlxuICAgICAgcmV0dXJuIHQoJ0NyZWF0ZSBTdWJuZXQnKTtcblxuICAgIGNhc2UgQXZhbGFuY2hlLlR4VHlwZS5FeHBvcnQ6XG4gICAgICByZXR1cm4gdCgnQXBwcm92ZSBFeHBvcnQnKTtcblxuICAgIGNhc2UgQXZhbGFuY2hlLlR4VHlwZS5JbXBvcnQ6XG4gICAgICByZXR1cm4gdCgnQXBwcm92ZSBJbXBvcnQnKTtcblxuICAgIGNhc2UgQXZhbGFuY2hlLlR4VHlwZS5CYXNlOlxuICAgICAgcmV0dXJuIHQoJ0FwcHJvdmUgVHJhbnNhY3Rpb24nKTtcblxuICAgIGNhc2UgQXZhbGFuY2hlLlR4VHlwZS5Db252ZXJ0U3VibmV0VG9MMTpcbiAgICAgIHJldHVybiB0KCdDb252ZXJ0IFN1Ym5ldCB0byBMMScpO1xuXG4gICAgY2FzZSBBdmFsYW5jaGUuVHhUeXBlLkRpc2FibGVMMVZhbGlkYXRvcjpcbiAgICAgIHJldHVybiB0KCdEaXNhYmxlIEwxIFZhbGlkYXRvcicpO1xuXG4gICAgY2FzZSBBdmFsYW5jaGUuVHhUeXBlLkluY3JlYXNlTDFWYWxpZGF0b3JCYWxhbmNlOlxuICAgICAgcmV0dXJuIHQoJ0luY3JlYXNlIEwxIFZhbGlkYXRvciBCYWxhbmNlJyk7XG5cbiAgICBjYXNlIEF2YWxhbmNoZS5UeFR5cGUuUmVnaXN0ZXJMMVZhbGlkYXRvcjpcbiAgICAgIHJldHVybiB0KCdSZWdpc3RlciBMMSBWYWxpZGF0b3InKTtcblxuICAgIGNhc2UgQXZhbGFuY2hlLlR4VHlwZS5TZXRMMVZhbGlkYXRvcldlaWdodDpcbiAgICAgIHJldHVybiB0KCdTZXQgTDEgVmFsaWRhdG9yIFdlaWdodCcpO1xuXG4gICAgY2FzZSBBdmFsYW5jaGUuVHhUeXBlLlRyYW5zZm9ybVN1Ym5ldDpcbiAgICAgIHJldHVybiB0KCdUcmFuc2Zvcm0gU3VibmV0Jyk7XG5cbiAgICBjYXNlIEF2YWxhbmNoZS5UeFR5cGUuVHJhbnNmZXJTdWJuZXRPd25lcnNoaXA6XG4gICAgICByZXR1cm4gdCgnVHJhbnNmZXIgU3VibmV0IE93bmVyc2hpcCcpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB0KCdVbmtub3duIFRyYW5zYWN0aW9uJyk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBBdmFsYW5jaGVUeEhlYWRlcjogUmVhY3QuRkM8QXZhbGFuY2hlVHhIZWFkZXJQcm9wcz4gPSAoeyB0eCB9KSA9PiB7XG4gIGNvbnN0IGhlYWRlciA9IHVzZUF2YWxhbmNoZVR4SGVhZGVyKHR4KTtcblxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIHB5OiAxLjUsXG4gICAgICAgIG1iOiAyLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgIGhlaWdodDogJzU2cHgnLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDRcIiBjb21wb25lbnQ9XCJoMVwiPlxuICAgICAgICB7aGVhZGVyfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgIDwvQm94PlxuICApO1xufTtcbiIsImltcG9ydCB7IFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFRva2VuVW5pdCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtdXRpbHMtc2RrJztcbmltcG9ydCB7IHVzZVNldHRpbmdzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvU2V0dGluZ3NQcm92aWRlcic7XG5cbnR5cGUgQXZheEFtb3VudFByb3BzID0ge1xuICBhbW91bnQ6IGJpZ2ludDtcbiAgYXZheFByaWNlOiBudW1iZXI7XG59O1xuXG5leHBvcnQgY29uc3QgQXZheEFtb3VudCA9ICh7XG4gIGFtb3VudDogYW1vdW50UmF3LFxuICBhdmF4UHJpY2UsXG59OiBBdmF4QW1vdW50UHJvcHMpID0+IHtcbiAgY29uc3QgeyBjdXJyZW5jeUZvcm1hdHRlciB9ID0gdXNlU2V0dGluZ3NDb250ZXh0KCk7XG4gIGNvbnN0IGFtb3VudCA9IG5ldyBUb2tlblVuaXQoYW1vdW50UmF3LCA5LCAnQVZBWCcpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IHRleHRBbGlnbjogJ2VuZCcsIGdhcDogMC41LCBwYjogMC41IH19PlxuICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cInN1YnRpdGxlMlwiPnthbW91bnQudG9EaXNwbGF5KCl9IEFWQVg8L1R5cG9ncmFwaHk+XG4gICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAge2N1cnJlbmN5Rm9ybWF0dGVyKGFtb3VudC50b0Rpc3BsYXkoeyBhc051bWJlcjogdHJ1ZSB9KSAqIGF2YXhQcmljZSl9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBDb3B5SWNvbixcbiAgSWNvbkJ1dHRvbixcbiAgU2Nyb2xsYmFycyxcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIHRvYXN0LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyBQYWdlVGl0bGUsIFBhZ2VUaXRsZVZhcmlhbnQgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyBPdmVybGF5IH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9PdmVybGF5JztcbmltcG9ydCB7XG4gIEFwcHJvdmFsU2VjdGlvbixcbiAgQXBwcm92YWxTZWN0aW9uQm9keSxcbiAgQXBwcm92YWxTZWN0aW9uSGVhZGVyLFxufSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL0FwcHJvdmFsU2VjdGlvbic7XG5cbmV4cG9ydCBjb25zdCBCbG9ja2NoYWluR2VuZXNpc0ZpbGUgPSAoeyBvbkNsb3NlLCBkYXRhIH0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IGhhbmRsZUNvcHlDbGljayA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChkYXRhKTtcbiAgICB0b2FzdC5zdWNjZXNzKHQoJ0NvcGllZCEnKSwgeyBkdXJhdGlvbjogMTAwMCB9KTtcbiAgfSwgW2RhdGEsIHRdKTtcblxuICByZXR1cm4gKFxuICAgIDxPdmVybGF5IGlzQmFja2dyb3VuZEZpbGxlZD5cbiAgICAgIDxTdGFjayBzeD17eyBoZWlnaHQ6ICcxMDAlJywgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgPFBhZ2VUaXRsZVxuICAgICAgICAgIHZhcmlhbnQ9e1BhZ2VUaXRsZVZhcmlhbnQuUFJJTUFSWX1cbiAgICAgICAgICBvbkJhY2tDbGljaz17b25DbG9zZX1cbiAgICAgICAgICBtYXJnaW49XCIwXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdHZW5lc2lzIEluZm9ybWF0aW9uJyl9XG4gICAgICAgIDwvUGFnZVRpdGxlPlxuICAgICAgICA8U3RhY2sgc3g9e3sgcDogMiwgZmxleEdyb3c6IDEgfX0+XG4gICAgICAgICAgPEFwcHJvdmFsU2VjdGlvbiBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ0NvZGUnKX0+XG4gICAgICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImNvcHktZ2VuZXNpcy1pbmZvcm1hdGlvblwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQ29weUNsaWNrfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPENvcHlJY29uIC8+XG4gICAgICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgICAgIDwvQXBwcm92YWxTZWN0aW9uSGVhZGVyPlxuICAgICAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHkgc3g9e3sgZmxleEdyb3c6IDEgfX0+XG4gICAgICAgICAgICAgIDxTY3JvbGxiYXJzPlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IGNvbXBvbmVudD1cInByZVwiIHZhcmlhbnQ9XCJjYXB0aW9uXCIgbW9ub3NwYWNlPlxuICAgICAgICAgICAgICAgICAge2RhdGF9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1Njcm9sbGJhcnM+XG4gICAgICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvT3ZlcmxheT5cbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBCdXR0b24sXG4gIERpYWxvZyxcbiAgRGlhbG9nQWN0aW9ucyxcbiAgRGlhbG9nQ29udGVudCxcbiAgRGlhbG9nVGl0bGUsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG50eXBlIFByb3BzID0ge1xuICBvcGVuOiBib29sZWFuO1xuICBvblJlamVjdDogKCkgPT4gdm9pZDtcbiAgb25Db250aW51ZTogKCkgPT4gdm9pZDtcbn07XG5cbmV4cG9ydCBjb25zdCBFeGNlc3NpdmVCdXJuV2FybmluZ0RpYWxvZyA9ICh7XG4gIG9wZW4sXG4gIG9uUmVqZWN0LFxuICBvbkNvbnRpbnVlLFxufTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPERpYWxvZ1xuICAgICAgb3Blbj17b3Blbn1cbiAgICAgIHNob3dDbG9zZUljb249e2ZhbHNlfVxuICAgICAgUGFwZXJQcm9wcz17e1xuICAgICAgICBzeDogeyBtOiAyIH0sXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxEaWFsb2dUaXRsZSBhbGlnbj1cImNlbnRlclwiPnt0KCdDYXV0aW9uIScpfTwvRGlhbG9nVGl0bGU+XG4gICAgICA8RGlhbG9nQ29udGVudCBzeD17eyBweDogMiwgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAge3QoXG4gICAgICAgICAgICAnVGhlIGlucHV0cyBvZiB0aGlzIHRyYW5zYWN0aW9uIGFyZSBncmVhdGVyIHRoYW4gdGhlIG91dHB1dC4gQ29udGludWluZyB3aWxsIGNhdXNlIHlvdSB0byBsb3NlIGZ1bmRzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIFVUWE8uJyxcbiAgICAgICAgICApfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L0RpYWxvZ0NvbnRlbnQ+XG4gICAgICA8RGlhbG9nQWN0aW9ucyBzeD17eyBweDogMiwgcHQ6IDEsIHBiOiAyIH19PlxuICAgICAgICA8QnV0dG9uIGNvbG9yPVwicHJpbWFyeVwiIHNpemU9XCJsYXJnZVwiIGZ1bGxXaWR0aCBvbkNsaWNrPXtvblJlamVjdH0+XG4gICAgICAgICAge3QoJ1JlamVjdCBUcmFuc2FjdGlvbicpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwidGV4dFwiIHNpemU9XCJsYXJnZVwiIG9uQ2xpY2s9e29uQ29udGludWV9PlxuICAgICAgICAgIHt0KCdDb250aW51ZScpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvRGlhbG9nQWN0aW9ucz5cbiAgICA8L0RpYWxvZz5cbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBJbmZvQ2lyY2xlSWNvbixcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAc3JjL3V0aWxzL3RydW5jYXRlQWRkcmVzcyc7XG5cbnR5cGUgVHJ1bmNhdGVkSWRlbnRpZmllclByb3BzID0ge1xuICBpZGVudGlmaWVyOiBzdHJpbmc7XG4gIHNpemU/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgY29uc3QgVHJ1bmNhdGVkSWRlbnRpZmllciA9ICh7XG4gIGlkZW50aWZpZXIsXG4gIHNpemUgPSAxMCxcbn06IFRydW5jYXRlZElkZW50aWZpZXJQcm9wcykgPT4gKFxuICA8U3RhY2tcbiAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgIHN4PXt7IGdhcDogMSwgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfX1cbiAgPlxuICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICB7dHJ1bmNhdGVBZGRyZXNzKGlkZW50aWZpZXIsIHNpemUpfVxuICAgIDwvVHlwb2dyYXBoeT5cbiAgICA8VG9vbHRpcCB0aXRsZT17aWRlbnRpZmllcn0+XG4gICAgICA8SW5mb0NpcmNsZUljb24gc2l6ZT17MTR9IHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19IC8+XG4gICAgPC9Ub29sdGlwPlxuICA8L1N0YWNrPlxuKTtcbiIsImltcG9ydCB7IGJuVG9CaWcgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgQmlnIGZyb20gJ2JpZy5qcyc7XG5pbXBvcnQgeyBCTiB9IGZyb20gJ2JuLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJpZ2ludFRvQmlnKGFtb3VudDogYmlnaW50LCBkZW5vbWluYXRpb246IG51bWJlcik6IEJpZyB7XG4gIHJldHVybiBiblRvQmlnKG5ldyBCTihhbW91bnQudG9TdHJpbmcoKSksIGRlbm9taW5hdGlvbik7XG59XG4iLCJpbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLXdhbGxldHMtc2RrJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJpbWFyeVN1Ym5ldChzdWJuZXRJZDogc3RyaW5nKSB7XG4gIHJldHVybiBzdWJuZXRJZCA9PT0gQXZhbGFuY2hlLk1haW5uZXRDb250ZXh0LnBCbG9ja2NoYWluSUQ7XG59XG4iXSwibmFtZXMiOlsiQXZhbGFuY2hlQ2hhaW5TdHJpbmdzIiwiVHJhbnNhY3Rpb25UeXBlIiwiaXNUeFBhcmFtcyIsInBhcmFtcyIsImZyb20iLCJDaXJjdWxhclByb2dyZXNzIiwiT3ZlcmxheSIsIkxvYWRpbmdPdmVybGF5IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiQm94IiwiSW5mb0NpcmNsZUljb24iLCJTdGFjayIsIlRvb2x0aXAiLCJUeXBvZ3JhcGh5IiwidXNlVGhlbWUiLCJBcHByb3ZhbFNlY3Rpb25IZWFkZXIiLCJsYWJlbCIsInRvb2x0aXAiLCJ0b29sdGlwSWNvbiIsImNoaWxkcmVuIiwic3giLCJ3aWR0aCIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJjb21wb25lbnQiLCJmb250V2VpZ2h0IiwiY3Vyc29yIiwibWwiLCJ0aXRsZSIsIkFwcHJvdmFsU2VjdGlvbkJvZHkiLCJyZXN0IiwidGhlbWUiLCJfZXh0ZW5kcyIsImJhY2tncm91bmRDb2xvciIsImJvcmRlclJhZGl1cyIsInAiLCJnYXAiLCJBcHByb3ZhbFNlY3Rpb24iLCJUeERldGFpbHNSb3ciLCJ2YXJpYW50IiwiY29sb3IiLCJtaW5IZWlnaHQiLCJzcGFjaW5nIiwibWluV2lkdGgiLCJ3b3JkV3JhcCIsIkV4dGVuc2lvblJlcXVlc3QiLCJ1c2VDb25uZWN0aW9uQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwidXNlTmF0aXZlVG9rZW5QcmljZSIsIm5ldHdvcmsiLCJyZXF1ZXN0IiwicHJpY2UiLCJzZXRQcmljZSIsInRva2VuSWQiLCJwcmljaW5nUHJvdmlkZXJzIiwiY29pbmdlY2tvIiwibmF0aXZlVG9rZW5JZCIsIm1ldGhvZCIsIlRPS0VOX1BSSUNFX0dFVCIsInRoZW4iLCJjYXRjaCIsInVzZUNhbGxiYWNrIiwidXNlVHJhbnNsYXRpb24iLCJCdXR0b24iLCJTY3JvbGxiYXJzIiwiQXZhbGFuY2hlIiwidXNlQXBwcm92ZUFjdGlvbiIsInVzZUdldFJlcXVlc3RJZCIsIkFjdGlvblN0YXR1cyIsIkltcG9ydFR4VmlldyIsIkV4cG9ydFR4VmlldyIsIkFkZFZhbGlkYXRvciIsIkFkZERlbGVnYXRvciIsInVzZU5ldHdvcmtDb250ZXh0IiwiQmFzZVR4VmlldyIsInVzZUxlZGdlckRpc2Nvbm5lY3RlZERpYWxvZyIsIkxlZGdlckFwcFR5cGUiLCJMZWRnZXJBcHByb3ZhbE92ZXJsYXkiLCJ1c2VJc1VzaW5nTGVkZ2VyV2FsbGV0IiwiQXBwcm92ZUNyZWF0ZVN1Ym5ldCIsIkFwcHJvdmVDcmVhdGVDaGFpbiIsIkFkZFN1Ym5ldFZhbGlkYXRvclZpZXciLCJBdmFsYW5jaGVUeEhlYWRlciIsIkV4Y2Vzc2l2ZUJ1cm5XYXJuaW5nRGlhbG9nIiwidXNlSXNVc2luZ1dhbGxldENvbm5lY3RBY2NvdW50IiwiV2FsbGV0Q29ubmVjdEFwcHJvdmFsT3ZlcmxheSIsInVzZUFwcHJvdmFsSGVscGVycyIsIkFkZFBlcm1pc3Npb25sZXNzVmFsaWRhdG9yIiwiQWRkUGVybWlzc2lvbmxlc3NEZWxlZ2F0b3IiLCJ1c2VJc1VzaW5nRmlyZWJsb2Nrc0FjY291bnQiLCJGaXJlYmxvY2tzQXBwcm92YWxPdmVybGF5IiwiUmVtb3ZlU3VibmV0VmFsaWRhdG9yVmlldyIsIkZ1bmN0aW9uSXNPZmZsaW5lIiwiRnVuY3Rpb25OYW1lcyIsInVzZUlzRnVuY3Rpb25BdmFpbGFibGUiLCJBcHByb3ZlQ29udmVydFN1Ym5ldFRvTDEiLCJBcHByb3ZlUmVnaXN0ZXJMMVZhbGlkYXRvciIsIkFwcHJvdmVJbmNyZWFzZUwxVmFsaWRhdG9yQmFsYW5jZSIsIkFwcHJvdmVEaXNhYmxlTDFWYWxpZGF0b3IiLCJBcHByb3ZlU2V0TDFWYWxpZGF0b3JXZWlnaHQiLCJBdmFsYW5jaGVTaWduVHgiLCJyZXF1ZXN0SWQiLCJhY3Rpb24iLCJ1cGRhdGVBY3Rpb24iLCJjYW5jZWxIYW5kbGVyIiwidCIsImlzRnVuY3Rpb25BdmFpbGFibGUiLCJpc1NpZ25pbmdBdmFpbGFibGUiLCJTSUdOIiwidG9rZW5QcmljZSIsImlzVXNpbmdMZWRnZXJXYWxsZXQiLCJpc1dhbGxldENvbm5lY3RBY2NvdW50IiwiaXNGaXJlYmxvY2tzQWNjb3VudCIsInNob3dCdXJuV2FybmluZyIsInNldFNob3dCdXJuV2FybmluZyIsInR4RGF0YSIsImRpc3BsYXlEYXRhIiwiY291bGRCdXJuRXhjZXNzQW1vdW50IiwiaXNWYWxpZEF2YXhCdXJuZWRBbW91bnQiLCJoYW5kbGVSZWplY3Rpb24iLCJBVkFMQU5DSEUiLCJzaWduVHgiLCJzdGF0dXMiLCJTVUJNSVRUSU5HIiwiaWQiLCJoYW5kbGVBcHByb3ZhbCIsImlzQXBwcm92YWxPdmVybGF5VmlzaWJsZSIsIm9uQXBwcm92ZSIsIm9uUmVqZWN0IiwicmVuZGVyRGV2aWNlQXBwcm92YWwiLCJvblN1Ym1pdCIsInJlbmRlclNpZ25UeERldGFpbHMiLCJ0eCIsImlzQWRkVmFsaWRhdG9yVHgiLCJhdmF4UHJpY2UiLCJpc0FkZERlbGVnYXRvclR4IiwiaXNFeHBvcnRUeCIsImlzSW1wb3J0VHgiLCJpc0Jhc2VUeCIsImlzQ29udmVydFN1Ym5ldFRvTDFUeCIsImlzUmVnaXN0ZXJMMVZhbGlkYXRvclR4IiwiaXNEaXNhYmxlTDFWYWxpZGF0b3JUeCIsImlzU2V0TDFWYWxpZGF0b3JXZWlnaHRUeCIsImlzSW5jcmVhc2VMMVZhbGlkYXRvckJhbGFuY2UiLCJpc0NyZWF0ZVN1Ym5ldFR4IiwiaXNDcmVhdGVDaGFpblR4IiwiaXNBZGRTdWJuZXRWYWxpZGF0b3JUeCIsImlzUmVtb3ZlU3VibmV0VmFsaWRhdG9yVHgiLCJpc0FkZFBlcm1pc3Npb25sZXNzVmFsaWRhdG9yVHgiLCJpc0FkZFBlcm1pc3Npb25sZXNzRGVsZWdhdG9yVHgiLCJGcmFnbWVudCIsImZ1bmN0aW9uTmFtZSIsIkZFQVRVUkUiLCJoaWRlUGFnZVRpdGxlIiwicHgiLCJoZWlnaHQiLCJvcGVuIiwib25Db250aW51ZSIsInB0IiwicGIiLCJmdWxsV2lkdGgiLCJzaXplIiwib25DbGljayIsIkNhcmQiLCJDYXJkQ29udGVudCIsImJpZ1RvTG9jYWxlU3RyaW5nIiwidXNlU2V0dGluZ3NDb250ZXh0IiwiYmlnaW50VG9CaWciLCJub2RlSUQiLCJzdGFydCIsImVuZCIsInN0YWtlIiwiY2hhaW4iLCJ0eEZlZSIsImN1cnJlbmN5Rm9ybWF0dGVyIiwic3RhcnREYXRlIiwiRGF0ZSIsInBhcnNlSW50IiwiZW5kRGF0ZSIsImZlZSIsIm10IiwibWIiLCJteCIsInRleHRBbGlnbiIsInRpbWVzIiwidG9OdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsIkRpdmlkZXIiLCJUcnVuY2F0ZWRJZGVudGlmaWVyIiwiQXZheEFtb3VudCIsImlzUHJpbWFyeVN1Ym5ldCIsInN1Ym5ldElEIiwiaXNQcmltYXJ5TmV0d29yayIsInB5IiwiaWRlbnRpZmllciIsImFtb3VudCIsIm15IiwiZGVsZWdhdGlvbkZlZSIsInB1YmxpY0tleSIsInNpZ25hdHVyZSIsIm1yIiwiQXZhbGFuY2hlQ29sb3JJY29uIiwiVG9rZW5Vbml0IiwiYmlnSW50VG9TdHJpbmciLCJQVk0iLCJvdXRwdXRzIiwibWVtbyIsImRlZmF1bHREZW5vbWluYXRpb24iLCJpc0RhdGVGdXR1cmUiLCJkYXRlIiwibm93IiwiZ2V0VW5peE5vdyIsInVuaXhUb0xvY2FsZVN0cmluZyIsIk51bWJlciIsInRvU3RyaW5nIiwiZ2V0RGlzcGxheUFtb3VudCIsInZhbHVlIiwiZGVjaW1hbHMiLCJyZXBsYWNlIiwibWFwIiwib3V0Iiwia2V5IiwiYXNzZXREZXNjcmlwdGlvbiIsImFzc2V0SUQiLCJpc0F2YXgiLCJzeW1ib2wiLCJkZW5vbWluYXRpb24iLCJsb2NrdGltZSIsIm93bmVycyIsImxlbmd0aCIsInRocmVzaG9sZCIsImFkZHJlc3MiLCJ0b0Rpc3BsYXkiLCJhc051bWJlciIsImNoYWluSUQiLCJtYW5hZ2VyQWRkcmVzcyIsInZhbGlkYXRvcnMiLCJkaXZpZGVyIiwiYmFsYW5jZSIsIm5vZGVJZCIsInJlbWFpbmluZ0JhbGFuY2VPd25lcnMiLCJkZWFjdGl2YXRpb25Pd25lcnMiLCJwbCIsIkJsb2NrY2hhaW5HZW5lc2lzRmlsZSIsImNoYWluTmFtZSIsInZtSUQiLCJnZW5lc2lzRGF0YSIsImlzR2VuZXNpc0ZpbGVTaG93biIsInNldElzR2VuZXNpc0ZpbGVTaG93biIsImRhdGEiLCJvbkNsb3NlIiwiY29udHJvbEtleXMiLCJ2YWxpZGF0aW9uSWQiLCJhbW91bnRSYXciLCJkZXN0aW5hdGlvbiIsInR5cGUiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwic291cmNlIiwidXNlQXZhbGFuY2hlVHhIZWFkZXIiLCJUeFR5cGUiLCJBZGRTdWJuZXRWYWxpZGF0b3IiLCJSZW1vdmVTdWJuZXRWYWxpZGF0b3IiLCJDcmVhdGVDaGFpbiIsIkNyZWF0ZVN1Ym5ldCIsIkV4cG9ydCIsIkltcG9ydCIsIkJhc2UiLCJDb252ZXJ0U3VibmV0VG9MMSIsIkRpc2FibGVMMVZhbGlkYXRvciIsIkluY3JlYXNlTDFWYWxpZGF0b3JCYWxhbmNlIiwiUmVnaXN0ZXJMMVZhbGlkYXRvciIsIlNldEwxVmFsaWRhdG9yV2VpZ2h0IiwiVHJhbnNmb3JtU3VibmV0IiwiVHJhbnNmZXJTdWJuZXRPd25lcnNoaXAiLCJoZWFkZXIiLCJ6SW5kZXgiLCJDb3B5SWNvbiIsIkljb25CdXR0b24iLCJ0b2FzdCIsIlBhZ2VUaXRsZSIsIlBhZ2VUaXRsZVZhcmlhbnQiLCJoYW5kbGVDb3B5Q2xpY2siLCJuYXZpZ2F0b3IiLCJjbGlwYm9hcmQiLCJ3cml0ZVRleHQiLCJzdWNjZXNzIiwiZHVyYXRpb24iLCJpc0JhY2tncm91bmRGaWxsZWQiLCJQUklNQVJZIiwib25CYWNrQ2xpY2siLCJtYXJnaW4iLCJmbGV4R3JvdyIsIm1vbm9zcGFjZSIsIkRpYWxvZyIsIkRpYWxvZ0FjdGlvbnMiLCJEaWFsb2dDb250ZW50IiwiRGlhbG9nVGl0bGUiLCJzaG93Q2xvc2VJY29uIiwiUGFwZXJQcm9wcyIsIm0iLCJhbGlnbiIsInRydW5jYXRlQWRkcmVzcyIsImRpcmVjdGlvbiIsImJuVG9CaWciLCJCTiIsInN1Ym5ldElkIiwiTWFpbm5ldENvbnRleHQiLCJwQmxvY2tjaGFpbklEIl0sInNvdXJjZVJvb3QiOiIifQ==