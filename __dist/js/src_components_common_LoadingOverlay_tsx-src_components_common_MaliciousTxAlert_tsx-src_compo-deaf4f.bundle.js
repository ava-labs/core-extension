"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_LoadingOverlay_tsx-src_components_common_MaliciousTxAlert_tsx-src_compo-deaf4f"],{

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

/***/ "./src/components/common/BNInput.tsx":
/*!*******************************************!*\
  !*** ./src/components/common/BNInput.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BNInput": () => (/* binding */ BNInput)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bigIntToString.js");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");





const InputNumber = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.TextField)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  padding: 0;
`;
function splitValue(val) {
  return val.includes('.') ? val.split('.') : [val, null];
}
function BNInput({
  value,
  denomination,
  onChange,
  min = 0n,
  max,
  isValueLoading,
  error,
  disabled,
  fullWidth,
  withMaxButton = true,
  ...props
}) {
  const [valStr, setValStr] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (value === undefined) {
      if (Number(valStr) !== 0) {
        setValStr('');
      }
      return;
    }
    if (value === 0n) {
      if (Number(valStr) !== 0) {
        setValStr('');
      }
      return;
    }
    if (value) {
      const valueAsString = (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__.bigIntToString)(value, denomination);
      const oldValue = (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_2__.stringToBigint)(valStr || '0', denomination);
      /**
       * When deleting zeros after decimal, all zeros delete without this check.
       * This also preserves zeros in the input ui.
       */

      if (!valStr || value !== oldValue) {
        setValStr(valueAsString);
      }
    }
  }, [denomination, valStr, value]);
  const onValueChanged = newValueString => {
    /**
     * Split the input and make sure the right side never exceeds
     * the denomination length
     */
    const [, endValue] = splitValue(newValueString); // renamed callback param

    if (!endValue || endValue.length <= denomination) {
      const newValue = (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_2__.stringToBigint)(newValueString || '0', denomination);
      if (newValue < min) {
        return;
      }
      const oldValue = (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_2__.stringToBigint)(valStr || '0', denomination);
      if (newValue !== oldValue) {
        onChange?.({
          amount: (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__.bigIntToString)(newValue || 0n, denomination),
          bigint: newValue
        });
      }
      setValStr(newValueString);
    }
  };
  const setMax = e => {
    e.stopPropagation();
    if (!max) {
      return;
    }
    onValueChanged((0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_5__.bigIntToString)(max, denomination));
  };
  const isMaxBtnVisible = max && max > 0n;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      position: 'relative'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(InputNumber, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    fullWidth: fullWidth,
    value: valStr.replaceAll(',', ''),
    onChange: e => onValueChanged(e.target.value),
    type: "number",
    onKeyDown: e => {
      if (e.code === 'KeyE' || e.key === '-' || e.key === '+' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
    },
    onClick: e => {
      e.stopPropagation();
    },
    onWheel: e => {
      // Prevent changing value by mouse wheel
      if (e.target === document.activeElement) {
        document.activeElement.blur();
      }
    },
    error: error,
    placeholder: "0.0",
    sx: {
      width: fullWidth ? 'auto' : '180px'
    },
    InputProps: {
      disabled,
      endAdornment: withMaxButton ? isValueLoading ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.CircularProgress, {
        size: 16,
        sx: {
          height: 'auto !important'
        }
      }) : isMaxBtnVisible ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.InputAdornment, {
        position: "end"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
        variant: "text",
        size: "small",
        onClick: setMax,
        sx: {
          p: 0,
          justifyContent: 'flex-end'
        }
      }, "Max")) : null : null,
      inputMode: 'text',
      sx: {
        py: 1,
        px: 2
      }
    }
  }, props)));
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

/***/ "./src/components/common/MaliciousTxAlert.tsx":
/*!****************************************************!*\
  !*** ./src/components/common/MaliciousTxAlert.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MaliciousTxAlert": () => (/* binding */ MaliciousTxAlert)
/* harmony export */ });
/* harmony import */ var _src_pages_Permissions_components_AlertDialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Permissions/components/AlertDialog */ "./src/pages/Permissions/components/AlertDialog.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function MaliciousTxAlert({
  showAlert,
  title,
  description,
  cancelHandler,
  actionTitles
}) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  return /*#__PURE__*/React.createElement(React.Fragment, null, showAlert && /*#__PURE__*/React.createElement(_src_pages_Permissions_components_AlertDialog__WEBPACK_IMPORTED_MODULE_0__.AlertDialog, {
    open: isAlertDialogOpen,
    cancelHandler: cancelHandler,
    onClose: () => setIsAlertDialogOpen(false),
    title: title || t('Scam Transaction'),
    text: description || t('This transaction is malicious do not proceed.'),
    proceedLabel: actionTitles?.proceed || t('Proceed Anyway'),
    rejectLabel: actionTitles?.reject || t('Reject Transaction')
  }));
}

/***/ }),

/***/ "./src/components/common/approval/TransactionDetailItem.tsx":
/*!******************************************************************!*\
  !*** ./src/components/common/approval/TransactionDetailItem.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TransactionDetailItem": () => (/* binding */ TransactionDetailItem)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _src_pages_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/pages/SignTransaction/components/ApprovalTxDetails */ "./src/pages/SignTransaction/components/ApprovalTxDetails.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _src_contexts_ContactsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/ContactsProvider */ "./src/contexts/ContactsProvider.tsx");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");











const TransactionDetailItem = ({
  item
}) => {
  if (typeof item === 'string') {
    return /*#__PURE__*/React.createElement(PlainTextInfo, {
      item: item
    });
  }
  switch (item.type) {
    case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.DetailItemType.TEXT:
      return /*#__PURE__*/React.createElement(TextInfo, {
        item: item
      });
    case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.DetailItemType.ADDRESS:
      return /*#__PURE__*/React.createElement(AddressInfo, {
        item: item
      });
    case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.DetailItemType.LINK:
      return /*#__PURE__*/React.createElement(LinkInfo, {
        item: item
      });
    case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.DetailItemType.CURRENCY:
      return /*#__PURE__*/React.createElement(CurrencyInfo, {
        item: item
      });
    case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.DetailItemType.FUNDS_RECIPIENT:
      return /*#__PURE__*/React.createElement(FundsRecipientInfo, {
        item: item
      });
    default:
      return null;
  }
};
const PlainTextInfo = ({
  item
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
  variant: "body2"
}, item);
const TextInfo = ({
  item
}) => /*#__PURE__*/React.createElement(_TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__.TxDetailsRow, {
  label: item.label
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
  variant: "caption"
}, item.value));
const LinkInfo = ({
  item
}) => {
  const url = new URL(item.value.url);
  const isLinkToExtensionItself = url.hostname === webextension_polyfill__WEBPACK_IMPORTED_MODULE_5__.runtime.id;

  // Do not link to ourselves
  if (isLinkToExtensionItself) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__.TxDetailsRow, {
    label: item.label
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Tooltip, {
    title: url.href
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    direction: "row",
    gap: 0.5
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Link, {
    href: url.href,
    target: "_blank",
    rel: "noreferrer",
    sx: {
      display: 'inline-flex',
      color: 'text.primary'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.LinkIcon, {
    size: 14
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.primary',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
  }, url.hostname))));
};
const AddressInfo = ({
  item
}) => /*#__PURE__*/React.createElement(_src_pages_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_1__.AccountDetails, {
  label: item.label,
  address: item.value
});
const FundsRecipientInfo = ({
  item
}) => {
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__.useSettingsContext)();
  const {
    getContactByAddress
  } = (0,_src_contexts_ContactsProvider__WEBPACK_IMPORTED_MODULE_6__.useContactsContext)();
  const {
    getAccount
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_8__.useAccountsContext)();
  const {
    getTokenPrice
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_4__.useBalancesContext)();
  const token = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_10__.TokenUnit(item.amount, item.maxDecimals, item.symbol);
  const tokenPrice = getTokenPrice(item.symbol);
  const contact = getAccount(item.label) ?? getContactByAddress(item.label);
  return /*#__PURE__*/React.createElement(_TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__.TxDetailsRow, {
    label: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Tooltip, {
      title: item.label
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
      variant: "caption",
      color: "text.secondary"
    }, contact?.name || (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_7__.truncateAddress)(item.label)))
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, token.toDisplay(), " ", token.getSymbol()), tokenPrice ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption",
    sx: {
      textAlign: 'right',
      color: 'text.secondary'
    }
  }, currencyFormatter(tokenPrice * token.toDisplay({
    asNumber: true
  }))) : null));
};
const CurrencyInfo = ({
  item
}) => {
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__.useSettingsContext)();
  const {
    getTokenPrice
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_4__.useBalancesContext)();
  const token = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_10__.TokenUnit(item.value, item.maxDecimals, item.symbol);
  const tokenPrice = getTokenPrice(item.symbol);
  return /*#__PURE__*/React.createElement(_TxDetailsRow__WEBPACK_IMPORTED_MODULE_3__.TxDetailsRow, {
    label: item.label
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'right',
      fontWeight: 'fontWeightSemibold'
    }
  }, token.toDisplay(), " ", token.getSymbol()), tokenPrice ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption",
    sx: {
      textAlign: 'right',
      color: 'text.secondary'
    }
  }, currencyFormatter(tokenPrice * token.toDisplay({
    asNumber: true
  }))) : null));
};

/***/ }),

/***/ "./src/pages/ApproveAction/hooks/useFeeCustomizer.tsx":
/*!************************************************************!*\
  !*** ./src/pages/ApproveAction/hooks/useFeeCustomizer.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useFeeCustomizer": () => (/* binding */ useFeeCustomizer)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkFeeProvider */ "./src/contexts/NetworkFeeProvider.tsx");
/* harmony import */ var _src_components_common_CustomFees__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/CustomFees */ "./src/components/common/CustomFees.tsx");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/hooks/useTokensWithBalances */ "./src/hooks/useTokensWithBalances.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");













const getInitialFeeRate = data => {
  if (!data) {
    return undefined;
  }
  if (isMultiTxFeeData(data)) {
    return undefined;
  }
  if (data?.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.BITCOIN_SEND_TRANSACTION) {
    return BigInt(data.data.feeRate);
  }
  if (data?.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.ETH_SEND_TRANSACTION) {
    return data.data.maxFeePerGas ? BigInt(data.data.maxFeePerGas) : undefined;
  }
};
const MultiTxSymbol = Symbol();
const isMultiTxFeeData = data => data.type === MultiTxSymbol;
function useFeeCustomizer({
  action,
  network,
  txIndex
}) {
  const {
    accounts: {
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_9__.useAccountsContext)();
  const {
    updateBalanceOnNetworks
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_10__.useBalancesContext)();
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_6__.useConnectionContext)();
  const [networkFee, setNetworkFee] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)();
  const [feeError, setFeeError] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)();
  const {
    getNetworkFee
  } = (0,_src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkFeeContext)();
  const [isCalculatingFee, setIsCalculatingFee] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [gasFeeModifier, setGasFeeModifier] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(_src_components_common_CustomFees__WEBPACK_IMPORTED_MODULE_4__.GasFeeModifier.SLOW);
  const [isBatchApprovalScreen, setIsBatchApprovalScreen] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const isFeeSelectorEnabled = Boolean(action?.displayData.networkFeeSelector);
  const tokens = (0,_src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_8__.useTokensWithBalances)({
    network
  });
  const nativeToken = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => tokens.find(({
    type
  }) => type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.NATIVE) ?? null, [tokens]);
  const signingData = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (!action || !isFeeSelectorEnabled) {
      return undefined;
    }
    if ((0,_src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_11__.isBatchApprovalAction)(action)) {
      setIsBatchApprovalScreen(true);
      if (typeof txIndex !== 'number') {
        const gasLimit = action.signingRequests.reduce((sum, req) => {
          if (req.signingData.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.ETH_SEND_TRANSACTION) {
            return sum + BigInt(req.signingData.data.gasLimit ?? 0n);
          }
          throw new Error('This transaction type is not supported in bulk approvals: ' + req.signingData.type);
        }, 0n);
        return {
          type: MultiTxSymbol,
          feeRate: action.signingRequests.reduce((sum, req) => {
            if (req.signingData.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.ETH_SEND_TRANSACTION) {
              const txGas = req.signingData.data.gasLimit;
              const maxFee = req.signingData.data.maxFeePerGas;
              if (!txGas || !maxFee) {
                return 0n;
              }
              const weight = Number(txGas) / Number(gasLimit);
              return sum + BigInt(Math.ceil(Number(maxFee) * weight));
            }
            throw new Error('This transaction type is not supported in bulk approvals: ' + req.signingData.type);
          }, 0n),
          gasLimit
        };
      }
      const signingRequest = action.signingRequests[txIndex];
      if (!signingRequest) {
        return;
      }
      return signingRequest.signingData;
    }
    switch (action?.signingData?.type) {
      // Request types that we know may require a fee
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.BITCOIN_SEND_TRANSACTION:
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.AVALANCHE_SEND_TRANSACTION:
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.ETH_SEND_TRANSACTION:
        return action.signingData;
      default:
        return undefined;
    }
  }, [action, isFeeSelectorEnabled, txIndex]);
  const updateFee = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async (maxFeeRate, maxTipRate) => {
    if (!action?.actionId || !isFeeSelectorEnabled) {
      return;
    }
    const newFeeConfig = signingData?.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.BITCOIN_SEND_TRANSACTION ? {
      feeRate: Number(maxFeeRate)
    } : {
      maxFeeRate,
      maxTipRate
    };
    await request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_7__.ExtensionRequest.ACTION_UPDATE_TX_DATA,
      params: typeof txIndex === 'undefined' ? [action.actionId, newFeeConfig] : [action.actionId, newFeeConfig, txIndex]
    });
  }, [action?.actionId, isFeeSelectorEnabled, request, signingData?.type, txIndex]);
  const getFeeInfo = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(data => {
    if (isMultiTxFeeData(data)) {
      return {
        limit: Number(data.gasLimit ?? 0n),
        feeRate: data.feeRate ?? 0n,
        maxTipRate: data.maxTipRate ?? 0n
      };
    }
    switch (data.type) {
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.AVALANCHE_SIGN_MESSAGE:
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.ETH_SIGN:
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.PERSONAL_SIGN:
        {
          throw new Error(`Unable to render fee widget for non-transaction (${data.type})`);
        }
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.BITCOIN_SEND_TRANSACTION:
        {
          return {
            feeRate: BigInt(data.data.feeRate),
            limit: Math.ceil(data.data.fee / data.data.feeRate) || 0
          };
        }
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.RpcMethod.ETH_SEND_TRANSACTION:
        {
          return {
            feeRate: data.data.maxFeePerGas ? BigInt(data.data.maxFeePerGas) : 0n,
            maxTipRate: data.data.maxPriorityFeePerGas ? BigInt(data.data.maxPriorityFeePerGas) : 0n,
            limit: Number(data.data.gasLimit ?? 0)
          };
        }
      default:
        throw new Error(`Unable to render fee widget for ${data.type}`);
    }
  }, []);
  const hasEnoughForNetworkFee = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (!nativeToken?.balance || !signingData) {
      return false;
    }
    const info = getFeeInfo(signingData);
    const need = info.feeRate * BigInt(info.limit);
    return nativeToken.balance > need;
  }, [getFeeInfo, nativeToken?.balance, signingData]);

  // Make sure we have gas token balances for the transaction's chain
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (!activeAccount || !network?.chainId) {
      return;
    }
    updateBalanceOnNetworks([activeAccount], [network.chainId]);
  }, [activeAccount, network?.chainId, updateBalanceOnNetworks]);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    const nativeBalance = nativeToken?.balance;
    if (!nativeBalance || !signingData || !isFeeSelectorEnabled) {
      return;
    }
    const info = getFeeInfo(signingData);
    const need = info.feeRate * BigInt(info.limit);
    setFeeError(nativeToken.balance >= need ? undefined : _src_utils_send_models__WEBPACK_IMPORTED_MODULE_5__.SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE);
  }, [getFeeInfo, isFeeSelectorEnabled, nativeToken?.balance, signingData]);
  const [maxFeePerGas, setMaxFeePerGas] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(getInitialFeeRate(signingData));
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(networkFee?.low?.maxPriorityFeePerGas);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (!networkFee || !isFeeSelectorEnabled) {
      return;
    }

    // Initialize fee config with default values if they are not set at all
    setMaxFeePerGas(previous => previous ?? networkFee.low.maxFeePerGas);
    setMaxPriorityFeePerGas(previous => previous ?? networkFee.low.maxPriorityFeePerGas);
  }, [networkFee, isFeeSelectorEnabled]);
  const setCustomFee = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(values => {
    setMaxFeePerGas(values.maxFeePerGas);
    setMaxPriorityFeePerGas(values.maxPriorityFeePerGas);
    setGasFeeModifier(values.feeType);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    let isMounted = true;
    if (!network || !isFeeSelectorEnabled) {
      return;
    }
    // If the request comes from a dApp, a different network may be active,
    // so we need to fetch current fees for Bitcoin specifically.
    getNetworkFee(network.caipId).then(fee => {
      if (isMounted) {
        setNetworkFee(fee);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [getNetworkFee, isFeeSelectorEnabled, network]);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (typeof maxFeePerGas === 'undefined' || !isFeeSelectorEnabled) {
      return;
    }
    let isMounted = true;
    setIsCalculatingFee(true);
    updateFee(maxFeePerGas, maxPriorityFeePerGas).catch(err => {
      console.error(err);
      if (!isMounted) {
        return;
      }
      setFeeError(err);
    }).finally(() => {
      if (!isMounted) {
        return;
      }
      setIsCalculatingFee(false);
    });
    return () => {
      isMounted = false;
    };
  }, [isFeeSelectorEnabled, maxFeePerGas, maxPriorityFeePerGas, updateFee, txIndex]);
  const renderFeeWidget = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(props => {
    if (!networkFee || !signingData) {
      return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
        sx: {
          gap: 0.5,
          justifyContent: 'flex-start'
        }
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Skeleton, {
        variant: "text",
        width: 120
      }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Skeleton, {
        variant: "rounded",
        height: 128
      }));
    }
    const {
      feeRate,
      limit
    } = getFeeInfo(signingData);
    return /*#__PURE__*/React.createElement(_src_components_common_CustomFees__WEBPACK_IMPORTED_MODULE_4__.CustomFees, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      maxFeePerGas: feeRate,
      limit: limit,
      onChange: setCustomFee,
      selectedGasFeeModifier: gasFeeModifier,
      network: network,
      networkFee: networkFee,
      isBatchApprovalScreen: isBatchApprovalScreen
    }, props));
  }, [gasFeeModifier, getFeeInfo, isBatchApprovalScreen, network, networkFee, setCustomFee, signingData]);
  return {
    isCalculatingFee,
    hasEnoughForNetworkFee,
    renderFeeWidget,
    feeError
  };
}

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

/***/ }),

/***/ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts":
/*!***************************************************************!*\
  !*** ./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useConvertedCurrencyFormatter": () => (/* binding */ useConvertedCurrencyFormatter)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_CurrenciesProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/CurrenciesProvider */ "./src/contexts/CurrenciesProvider.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_contexts_utils_getCurrencyFormatter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/utils/getCurrencyFormatter */ "./src/contexts/utils/getCurrencyFormatter.ts");




const useConvertedCurrencyFormatter = (sourceCurrency = 'USD') => {
  const {
    convert,
    hasExchangeRate
  } = (0,_src_contexts_CurrenciesProvider__WEBPACK_IMPORTED_MODULE_1__.useCurrenciesContext)();
  const {
    currency: targetCurrency,
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__.useSettingsContext)();
  const fallbackFormatter = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_src_contexts_utils_getCurrencyFormatter__WEBPACK_IMPORTED_MODULE_3__.getCurrencyFormatter)(sourceCurrency), [sourceCurrency]);
  const canConvert = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => hasExchangeRate(sourceCurrency, targetCurrency), [sourceCurrency, targetCurrency, hasExchangeRate]);
  const needsConversion = canConvert && targetCurrency !== sourceCurrency;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!needsConversion) {
      return fallbackFormatter;
    }
    return value => {
      const converted = convert({
        amount: value,
        from: sourceCurrency,
        to: targetCurrency
      });
      return currencyFormatter(converted);
    };
  }, [convert, currencyFormatter, fallbackFormatter, needsConversion, sourceCurrency, targetCurrency]);
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

/***/ "./src/pages/SignTransaction/components/NftAccordion.tsx":
/*!***************************************************************!*\
  !*** ./src/pages/SignTransaction/components/NftAccordion.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NftAccordion": () => (/* binding */ NftAccordion)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_pages_Collectibles_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Collectibles/components/CollectibleMedia */ "./src/pages/Collectibles/components/CollectibleMedia.tsx");
/* harmony import */ var _TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TransactionTokenCard */ "./src/pages/SignTransaction/components/TransactionTokenCard.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const NftAccordion = ({
  token,
  diffItems,
  variant
}) => {
  if (!diffItems.length) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Accordion, {
    sx: {
      border: 'none',
      p: 0,
      m: 0,
      mt: -1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AccordionSummary, {
    sx: {
      p: 0,
      m: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      ml: -1
    }
  }, /*#__PURE__*/React.createElement(_src_pages_Collectibles_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_0__.CollectibleMedia, {
    height: "32px",
    width: "auto",
    maxWidth: "32px",
    url: token.logoUri,
    hover: false,
    showPlayIcon: false
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h6",
    fontWeight: "fontWeightSemibold",
    sx: {
      ml: 2
    }
  }, token.name, " ", diffItems.length ? `(${diffItems.length})` : ''))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AccordionDetails, {
    sx: {
      border: 'none',
      p: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 1.5
    }
  }, diffItems.map((item, index) => /*#__PURE__*/React.createElement(_TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__.TransactionTokenCard, {
    key: `token-group-${variant}-${'address' in token ? token.address : token.symbol}-${index}`,
    token: token,
    diffItem: item,
    variant: variant,
    sx: {
      p: 0
    }
  })))));
};

/***/ }),

/***/ "./src/pages/SignTransaction/components/SpendLimitInfo/CustomSpendLimit.tsx":
/*!**********************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/SpendLimitInfo/CustomSpendLimit.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CustomSpendLimit": () => (/* binding */ CustomSpendLimit)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _src_components_common_BNInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/BNInput */ "./src/components/common/BNInput.tsx");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _TokenSpendLimit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TokenSpendLimit */ "./src/pages/SignTransaction/components/SpendLimitInfo/TokenSpendLimit.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








const SpendLimitOption = ({
  label,
  value,
  checked,
  ...props
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.FormControlLabel, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
  label: label,
  value: value,
  control: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Radio, {
    size: "medium",
    color: checked ? 'secondary' : 'primary'
  }),
  sx: {
    '.MuiFormControlLabel-label': {
      fontSize: 'body2.fontSize',
      fontWeight: checked ? 'fontWeightSemibold' : 'fontWeightRegular'
    }
  }
}, props));
function CustomSpendLimit({
  spendLimit,
  token,
  onClose,
  setSpendLimit,
  requestedApprovalLimit,
  site
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const [customSpendLimit, setCustomSpendLimit] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)({
    ...spendLimit
  });
  const handleOnSave = () => {
    setSpendLimit(customSpendLimit);
    onClose();
  };
  const isFromExtension = site?.domain === (webextension_polyfill__WEBPACK_IMPORTED_MODULE_1___default().runtime.id);
  const appName = (isFromExtension ? webextension_polyfill__WEBPACK_IMPORTED_MODULE_1___default().runtime.getManifest().short_name : site?.domain) ?? t('Unknown Site');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      width: '100%',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_4__.PageTitle, {
    onBackClick: () => onClose(),
    margin: "0"
  }, t('Edit Spending Limit')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      px: 2,
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      gap: 1.5,
      maxWidth: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      fontSize: 'body2.fontSize',
      fontWeight: 'fontWeightSemibold'
    }
  }, t('Spending limit')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "body2",
    sx: {
      textAlign: 'center',
      maxWidth: 1,
      wordWrap: 'break-word',
      color: 'text.secondary'
    }
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_9__.Trans, {
    i18nKey: "Set a limit that you will allow <b>{{domain}}</b> to automatically spend.",
    values: {
      domain: appName
    },
    components: {
      b: /*#__PURE__*/React.createElement("b", {
        style: {
          color: theme.palette.text.primary
        }
      })
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.RadioGroup, {
    sx: {
      gap: 2
    },
    onChange: (_ev, limitType) => {
      setCustomSpendLimit({
        ...customSpendLimit,
        limitType: limitType
      });
    },
    value: customSpendLimit.limitType
  }, /*#__PURE__*/React.createElement(SpendLimitOption, {
    label: t('Unlimited'),
    value: _TokenSpendLimit__WEBPACK_IMPORTED_MODULE_5__.Limit.UNLIMITED,
    checked: customSpendLimit.limitType === _TokenSpendLimit__WEBPACK_IMPORTED_MODULE_5__.Limit.UNLIMITED
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      gap: 1.5
    }
  }, /*#__PURE__*/React.createElement(SpendLimitOption, {
    label: t('Default'),
    value: _TokenSpendLimit__WEBPACK_IMPORTED_MODULE_5__.Limit.DEFAULT,
    checked: customSpendLimit.limitType === _TokenSpendLimit__WEBPACK_IMPORTED_MODULE_5__.Limit.DEFAULT
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Box, {
    sx: {
      pl: 3
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_BNInput__WEBPACK_IMPORTED_MODULE_3__.BNInput, {
    disabled: true,
    withMaxButton: false,
    value: requestedApprovalLimit ?? 0n,
    denomination: token.decimals,
    fullWidth: true
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      gap: 1.5
    }
  }, /*#__PURE__*/React.createElement(SpendLimitOption, {
    label: t('Custom Spend Limit'),
    value: _TokenSpendLimit__WEBPACK_IMPORTED_MODULE_5__.Limit.CUSTOM,
    checked: customSpendLimit.limitType === _TokenSpendLimit__WEBPACK_IMPORTED_MODULE_5__.Limit.CUSTOM
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Box, {
    sx: {
      pl: 3
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_BNInput__WEBPACK_IMPORTED_MODULE_3__.BNInput, {
    withMaxButton: false,
    onChange: value => {
      setCustomSpendLimit({
        ...customSpendLimit,
        value: value.bigint,
        limitType: _TokenSpendLimit__WEBPACK_IMPORTED_MODULE_5__.Limit.CUSTOM
      });
    },
    denomination: token.decimals,
    placeholder: t('Maximum Limit'),
    value: customSpendLimit.value ?? 0n // TODO: properly handle zero (BNInput sees zero as an empty value)
    ,
    fullWidth: true
  }))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'flex-end',
      width: '100%',
      pt: 0,
      px: 2,
      pb: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    color: "primary",
    size: "large",
    onClick: handleOnSave,
    fullWidth: true
  }, t('Save'))));
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/SpendLimitInfo/NftSpendLimit.tsx":
/*!*******************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/SpendLimitInfo/NftSpendLimit.tsx ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NftSpendLimit": () => (/* binding */ NftSpendLimit)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../TransactionTokenCard */ "./src/pages/SignTransaction/components/TransactionTokenCard.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function NftSpendLimit({
  approval
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      pb: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Spend Limit')
  })), /*#__PURE__*/React.createElement(_TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__.TransactionTokenCard, {
    token: approval.token,
    diffItem: {
      displayValue: approval.value ?? '1',
      usdPrice: approval.usdPrice
    },
    sx: {
      py: 2
    }
  })));
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/SpendLimitInfo/SpendLimitInfo.tsx":
/*!********************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/SpendLimitInfo/SpendLimitInfo.tsx ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpendLimitInfo": () => (/* binding */ SpendLimitInfo)
/* harmony export */ });
/* harmony import */ var _TokenSpendLimit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TokenSpendLimit */ "./src/pages/SignTransaction/components/SpendLimitInfo/TokenSpendLimit.tsx");
/* harmony import */ var _NftSpendLimit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NftSpendLimit */ "./src/pages/SignTransaction/components/SpendLimitInfo/NftSpendLimit.tsx");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const SpendLimitInfo = ({
  approvals,
  isEditable,
  actionId
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, approvals.map((approval, index) => {
    switch (approval.token.type) {
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TokenType.ERC721:
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TokenType.ERC1155:
        return /*#__PURE__*/React.createElement(_NftSpendLimit__WEBPACK_IMPORTED_MODULE_1__.NftSpendLimit, {
          key: index,
          approval: approval
        });
      case _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.TokenType.ERC20:
        return /*#__PURE__*/React.createElement(_TokenSpendLimit__WEBPACK_IMPORTED_MODULE_0__.TokenSpendLimit, {
          key: index,
          actionId: actionId,
          approval: approval,
          withTitle: index === 0,
          isEditable: isEditable
        });
      default:
        return null;
    }
  }));
};

/***/ }),

/***/ "./src/pages/SignTransaction/components/SpendLimitInfo/TokenSpendLimit.tsx":
/*!*********************************************************************************!*\
  !*** ./src/pages/SignTransaction/components/SpendLimitInfo/TokenSpendLimit.tsx ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Limit": () => (/* binding */ Limit),
/* harmony export */   "TokenSpendLimit": () => (/* binding */ TokenSpendLimit),
/* harmony export */   "UNLIMITED_SPEND_LIMIT_LABEL": () => (/* binding */ UNLIMITED_SPEND_LIMIT_LABEL)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _CustomSpendLimit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CustomSpendLimit */ "./src/pages/SignTransaction/components/SpendLimitInfo/CustomSpendLimit.tsx");
/* harmony import */ var _TransactionTokenCard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../TransactionTokenCard */ "./src/pages/SignTransaction/components/TransactionTokenCard.tsx");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/constants/numbers.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");











let Limit = /*#__PURE__*/function (Limit) {
  Limit["DEFAULT"] = "DEFAULT";
  Limit["UNLIMITED"] = "UNLIMITED";
  Limit["CUSTOM"] = "CUSTOM";
  return Limit;
}({});
const UNLIMITED_SPEND_LIMIT_LABEL = 'Unlimited';
function TokenSpendLimit({
  actionId,
  approval,
  isEditable,
  withTitle = true
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const {
    action
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_4__.useApproveAction)(actionId);
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_5__.useConnectionContext)();
  const [showCustomSpendLimit, setShowCustomSpendLimit] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [customSpendLimit, setCustomSpendLimit] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
    limitType: Limit.DEFAULT
  });
  const setSpendLimit = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(customSpendData => {
    let limitAmount = 0n;
    if (customSpendData.limitType === Limit.UNLIMITED) {
      setCustomSpendLimit({
        ...customSpendData,
        value: undefined
      });
      limitAmount = ethers__WEBPACK_IMPORTED_MODULE_8__.MaxUint256;
    } else {
      setCustomSpendLimit(customSpendData);
      limitAmount = customSpendData.limitType === Limit.CUSTOM ? customSpendData.value ?? 0n : BigInt(approval.value ?? 0n);
    }
    request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_6__.ExtensionRequest.ACTION_UPDATE_TX_DATA,
      params: [actionId, {
        approvalLimit: `0x${limitAmount.toString(16)}`
      }]
    });
  }, [actionId, request, approval.value]);
  const isInfinite = customSpendLimit.limitType === Limit.UNLIMITED;
  const diffItemValue = isInfinite ? null : new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_9__.TokenUnit(customSpendLimit.limitType === Limit.DEFAULT ? typeof approval.value === 'string' ? BigInt(approval.value) : approval.value ?? 0n : customSpendLimit.value ?? '0', approval.token.decimals, '');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Dialog, {
    fullScreen: true,
    open: showCustomSpendLimit
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Box, {
    sx: {
      display: 'flex',
      flexGrow: 1,
      py: 2
    }
  }, /*#__PURE__*/React.createElement(_CustomSpendLimit__WEBPACK_IMPORTED_MODULE_2__.CustomSpendLimit, {
    setSpendLimit: setSpendLimit,
    spendLimit: customSpendLimit,
    requestedApprovalLimit: BigInt(approval.value ?? '0'),
    site: action?.site,
    token: approval.token,
    onClose: () => setShowCustomSpendLimit(false)
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      width: 1
    }
  }, withTitle && /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, {
    sx: {
      pb: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Spend Limit')
  }, isEditable && approval.value && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    variant: "text",
    color: "secondary",
    size: "small",
    sx: {
      px: 0,
      minWidth: 'auto'
    },
    onClick: () => setShowCustomSpendLimit(true)
  }, t('Edit')))), /*#__PURE__*/React.createElement(_TransactionTokenCard__WEBPACK_IMPORTED_MODULE_3__.TransactionTokenCard, {
    sx: {
      py: 2
    },
    token: {
      ...approval.token,
      logoUri: approval.logoUri
    },
    diffItem: {
      displayValue: isInfinite ? t('Unlimited') : diffItemValue.toDisplay(),
      usdPrice: approval.usdPrice
    }
  })));
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/TransactionTokenCard.tsx":
/*!***********************************************************************!*\
  !*** ./src/pages/SignTransaction/components/TransactionTokenCard.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TransactionTokenCard": () => (/* binding */ TransactionTokenCard),
/* harmony export */   "TransactionTokenCardVariant": () => (/* binding */ TransactionTokenCardVariant)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_pages_Collectibles_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/pages/Collectibles/components/CollectibleMedia */ "./src/pages/Collectibles/components/CollectibleMedia.tsx");
/* harmony import */ var _src_pages_DeFi_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/pages/DeFi/hooks/useConvertedCurrencyFormatter */ "./src/pages/DeFi/hooks/useConvertedCurrencyFormatter.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






let TransactionTokenCardVariant = /*#__PURE__*/function (TransactionTokenCardVariant) {
  TransactionTokenCardVariant["SEND"] = "SEND";
  TransactionTokenCardVariant["RECEIVE"] = "RECEIVE";
  TransactionTokenCardVariant["DEFAULT"] = "DEFAULT";
  return TransactionTokenCardVariant;
}({});
const isNftToken = token => 'type' in token && (token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC1155 || token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.ERC721);
const TransactionTokenCard = ({
  token,
  diffItem,
  variant = TransactionTokenCardVariant.DEFAULT,
  sx = {}
}) => {
  const currencyFormatter = (0,_src_pages_DeFi_hooks_useConvertedCurrencyFormatter__WEBPACK_IMPORTED_MODULE_3__.useConvertedCurrencyFormatter)();
  const [hasNameOverflow, setHasNameOverflow] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const overflowingText = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (checkOverflow(overflowingText.current)) {
      setHasNameOverflow(true);
      return;
    }
    setHasNameOverflow(false);
  }, [overflowingText]);
  const checkOverflow = textContainer => {
    if (textContainer) {
      return textContainer.offsetHeight < textContainer.scrollHeight || textContainer.offsetWidth < textContainer.scrollWidth;
    }
    return false;
  };
  const amountColor = variant === TransactionTokenCardVariant.SEND ? 'error.light' : variant === TransactionTokenCardVariant.RECEIVE ? 'success.light' : 'text.primary';
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Card, {
    sx: {
      py: '10px',
      px: 2,
      borderRadius: '10px',
      ...sx
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    alignItems: "center",
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    sx: {
      flex: 0
    }
  }, isNftToken(token) ? /*#__PURE__*/React.createElement(_src_pages_Collectibles_components_CollectibleMedia__WEBPACK_IMPORTED_MODULE_2__.CollectibleMedia, {
    height: "32px",
    width: "auto",
    maxWidth: "32px",
    url: token.logoUri,
    hover: false,
    margin: "8px 0",
    showPlayIcon: false
  }) : /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_1__.TokenIcon, {
    width: "32px",
    height: "32px",
    src: token.logoUri,
    name: token.name
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    alignItems: "center",
    sx: {
      ml: 2,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Tooltip, {
    placement: "bottom",
    title: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "caption"
    }, token.name),
    disableHoverListener: !hasNameOverflow,
    disableFocusListener: !hasNameOverflow,
    sx: {
      flex: 1,
      width: 0,
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    ref: overflowingText,
    variant: "h6",
    fontWeight: "fontWeightSemibold",
    sx: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, token.name)))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    alignItems: "flex-end"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    alignItems: "flex-end"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Tooltip, {
    placement: "bottom",
    title: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "caption"
    }, variant === TransactionTokenCardVariant.SEND ? '-' : '', diffItem.displayValue, " ", token.symbol)
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2",
    sx: {
      color: amountColor,
      maxWidth: '120px',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
  }, variant === TransactionTokenCardVariant.SEND ? '-' : '', diffItem.displayValue), 'symbol' in token && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2",
    sx: {
      ml: diffItem.displayValue !== undefined ? 0.4 : 0,
      color: amountColor
    }
  }, token.symbol)))), diffItem.usdPrice && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2",
    sx: {
      color: 'text.secondary'
    }
  }, currencyFormatter ? currencyFormatter(Number(diffItem.usdPrice)) : diffItem.usdPrice)))));
};

/***/ }),

/***/ "./src/pages/SignTransaction/components/TxBalanceChange.tsx":
/*!******************************************************************!*\
  !*** ./src/pages/SignTransaction/components/TxBalanceChange.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TxBalanceChange": () => (/* binding */ TxBalanceChange)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TransactionTokenCard */ "./src/pages/SignTransaction/components/TransactionTokenCard.tsx");
/* harmony import */ var _NftAccordion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NftAccordion */ "./src/pages/SignTransaction/components/NftAccordion.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const TxBalanceChange = ({
  ins,
  outs,
  isSimulationSuccessful
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const hasSentItems = outs.length > 0;
  const hasReceivedItems = ins.length > 0;
  const showNoPreExecWarning = isSimulationSuccessful === false; // may be undefined
  const showNoDataWarning = !hasSentItems && !hasReceivedItems && !isSimulationSuccessful;
  return /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionHeader, {
    label: t('Balance Change'),
    tooltip: showNoPreExecWarning ? t('Transaction pre-exution is unavailable. The displayed token list might be incomplete.') : '',
    tooltipIcon: showNoPreExecWarning ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.AlertTriangleIcon, {
      sx: {
        color: 'warning.main',
        cursor: 'pointer'
      }
    }) : undefined
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_0__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    gap: 2
  }, outs.map(({
    token,
    items
  }) => items.length === 1 ? /*#__PURE__*/React.createElement(_TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__.TransactionTokenCard, {
    key: `send-token-${'address' in token ? token.address : token.symbol}`,
    variant: _TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__.TransactionTokenCardVariant.SEND,
    token: token,
    diffItem: items[0],
    sx: {
      p: 0
    }
  }) : /*#__PURE__*/React.createElement(_NftAccordion__WEBPACK_IMPORTED_MODULE_2__.NftAccordion, {
    key: `send-token-group-${'address' in token ? token.address : token.symbol}`,
    token: token,
    diffItems: items,
    variant: _TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__.TransactionTokenCardVariant.SEND
  })), ins.map(({
    token,
    items
  }) => items.length === 1 ? /*#__PURE__*/React.createElement(_TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__.TransactionTokenCard, {
    key: `receive-token-${'address' in token ? token.address : token.symbol}`,
    variant: _TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__.TransactionTokenCardVariant.RECEIVE,
    token: token,
    diffItem: items[0],
    sx: {
      p: 0
    }
  }) : /*#__PURE__*/React.createElement(_NftAccordion__WEBPACK_IMPORTED_MODULE_2__.NftAccordion, {
    key: `receive-token-group-${'address' in token ? token.address : token.symbol}`,
    token: token,
    diffItems: items,
    variant: _TransactionTokenCard__WEBPACK_IMPORTED_MODULE_1__.TransactionTokenCardVariant.RECEIVE
  })), showNoDataWarning && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Alert, {
    severity: "info"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.AlertTitle, null, t('Balance change info not available')), t('Please proceed with caution')))));
};

/***/ }),

/***/ "./src/utils/send/models.ts":
/*!**********************************!*\
  !*** ./src/utils/send/models.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendErrorMessage": () => (/* binding */ SendErrorMessage)
/* harmony export */ });
let SendErrorMessage = /*#__PURE__*/function (SendErrorMessage) {
  SendErrorMessage["AMOUNT_REQUIRED"] = "AMOUNT_REQUIRED";
  SendErrorMessage["AMOUNT_TOO_LOW"] = "AMOUNT_TOO_LOW";
  SendErrorMessage["ADDRESS_REQUIRED"] = "ADDRESS_REQUIRED";
  SendErrorMessage["C_CHAIN_REQUIRED"] = "C_CHAIN_REQUIRED";
  SendErrorMessage["INVALID_ADDRESS"] = "INVALID_ADDRESS";
  SendErrorMessage["INVALID_NETWORK_FEE"] = "INVALID_NETWORK_FEE";
  SendErrorMessage["INSUFFICIENT_BALANCE"] = "INSUFFICIENT_BALANCE";
  SendErrorMessage["INSUFFICIENT_BALANCE_FOR_FEE"] = "INSUFFICIENT_BALANCE_FOR_FEE";
  SendErrorMessage["EXCESSIVE_NETWORK_FEE"] = "EXCESSIVE_NETWORK_FEE";
  SendErrorMessage["TOKEN_REQUIRED"] = "TOKEN_REQUIRED";
  SendErrorMessage["UNSUPPORTED_TOKEN"] = "UNSUPPORTED_TOKEN";
  SendErrorMessage["UNABLE_TO_FETCH_UTXOS"] = "UNABLE_TO_FETCH_UTXOS";
  SendErrorMessage["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
  SendErrorMessage["UNSUPPORTED_BY_LEDGER"] = "UNSUPPORTED_BY_LEDGER";
  SendErrorMessage["SEND_NOT_AVAILABLE"] = "SEND_NOT_AVAILABLE";
  return SendErrorMessage;
}({});

/***/ }),

/***/ "./node_modules/ethers/lib.esm/constants/numbers.js":
/*!**********************************************************!*\
  !*** ./node_modules/ethers/lib.esm/constants/numbers.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MaxInt256": () => (/* binding */ MaxInt256),
/* harmony export */   "MaxUint256": () => (/* binding */ MaxUint256),
/* harmony export */   "MinInt256": () => (/* binding */ MinInt256),
/* harmony export */   "N": () => (/* binding */ N),
/* harmony export */   "WeiPerEther": () => (/* binding */ WeiPerEther)
/* harmony export */ });
/**
 *  A constant for the order N for the secp256k1 curve.
 *
 *  (**i.e.** ``0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n``)
 */
const N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
/**
 *  A constant for the number of wei in a single ether.
 *
 *  (**i.e.** ``1000000000000000000n``)
 */
const WeiPerEther = BigInt("1000000000000000000");
/**
 *  A constant for the maximum value for a ``uint256``.
 *
 *  (**i.e.** ``0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn``)
 */
const MaxUint256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
/**
 *  A constant for the minimum value for an ``int256``.
 *
 *  (**i.e.** ``-8000000000000000000000000000000000000000000000000000000000000000n``)
 */
const MinInt256 = BigInt("0x8000000000000000000000000000000000000000000000000000000000000000") * BigInt(-1);
/**
 *  A constant for the maximum value for an ``int256``.
 *
 *  (**i.e.** ``0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn``)
 */
const MaxInt256 = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
//# sourceMappingURL=numbers.js.map

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX0xvYWRpbmdPdmVybGF5X3RzeC1zcmNfY29tcG9uZW50c19jb21tb25fTWFsaWNpb3VzVHhBbGVydF90c3gtc3JjX2NvbXBvLWRlYWY0Zi5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGdCQUFnQixnQkFBZ0IsK0ZBQStGLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxJQUFnQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ExSDtBQVExQjtBQUNvQjtBQUNFO0FBZ0IzRCxNQUFNVyxXQUFXLEdBQUdKLHVFQUFNLENBQUNILGtFQUFTLENBQUU7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUVELFNBQVNRLFVBQVVBLENBQUNDLEdBQVcsRUFBRTtFQUMvQixPQUFPQSxHQUFHLENBQUNDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBR0QsR0FBRyxDQUFDRSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQ0YsR0FBRyxFQUFFLElBQUksQ0FBQztBQUN6RDtBQUVPLFNBQVNHLE9BQU9BLENBQUM7RUFDdEJDLEtBQUs7RUFDTEMsWUFBWTtFQUNaQyxRQUFRO0VBQ1JDLEdBQUcsR0FBRyxFQUFFO0VBQ1JDLEdBQUc7RUFDSEMsY0FBYztFQUNkQyxLQUFLO0VBQ0xDLFFBQVE7RUFDUkMsU0FBUztFQUNUQyxhQUFhLEdBQUcsSUFBSTtFQUNwQixHQUFHQztBQUNTLENBQUMsRUFBRTtFQUNmLE1BQU0sQ0FBQ0MsTUFBTSxFQUFFQyxTQUFTLENBQUMsR0FBRzNCLCtDQUFRLENBQUMsRUFBRSxDQUFDO0VBQ3hDRCxnREFBUyxDQUFDLE1BQU07SUFDZCxJQUFJZ0IsS0FBSyxLQUFLYSxTQUFTLEVBQUU7TUFDdkIsSUFBSUMsTUFBTSxDQUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEJDLFNBQVMsQ0FBQyxFQUFFLENBQUM7TUFDZjtNQUVBO0lBQ0Y7SUFFQSxJQUFJWixLQUFLLEtBQUssRUFBRSxFQUFFO01BQ2hCLElBQUljLE1BQU0sQ0FBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3hCQyxTQUFTLENBQUMsRUFBRSxDQUFDO01BQ2Y7TUFDQTtJQUNGO0lBRUEsSUFBSVosS0FBSyxFQUFFO01BQ1QsTUFBTWUsYUFBYSxHQUFHdkIsdUVBQWMsQ0FBQ1EsS0FBSyxFQUFFQyxZQUFZLENBQUM7TUFDekQsTUFBTWUsUUFBUSxHQUFHdkIseUVBQWMsQ0FBQ2tCLE1BQU0sSUFBSSxHQUFHLEVBQUVWLFlBQVksQ0FBQztNQUM1RDtBQUNOO0FBQ0E7QUFDQTs7TUFFTSxJQUFJLENBQUNVLE1BQU0sSUFBSVgsS0FBSyxLQUFLZ0IsUUFBUSxFQUFFO1FBQ2pDSixTQUFTLENBQUNHLGFBQWEsQ0FBQztNQUMxQjtJQUNGO0VBQ0YsQ0FBQyxFQUFFLENBQUNkLFlBQVksRUFBRVUsTUFBTSxFQUFFWCxLQUFLLENBQUMsQ0FBQztFQUVqQyxNQUFNaUIsY0FBYyxHQUFJQyxjQUFzQixJQUFLO0lBQ2pEO0FBQ0o7QUFDQTtBQUNBO0lBQ0ksTUFBTSxHQUFHQyxRQUFRLENBQUMsR0FBR3hCLFVBQVUsQ0FBQ3VCLGNBQWMsQ0FBQyxDQUFDLENBQUM7O0lBRWpELElBQUksQ0FBQ0MsUUFBUSxJQUFJQSxRQUFRLENBQUNDLE1BQU0sSUFBSW5CLFlBQVksRUFBRTtNQUNoRCxNQUFNb0IsUUFBUSxHQUFHNUIseUVBQWMsQ0FBQ3lCLGNBQWMsSUFBSSxHQUFHLEVBQUVqQixZQUFZLENBQUM7TUFFcEUsSUFBSW9CLFFBQVEsR0FBR2xCLEdBQUcsRUFBRTtRQUNsQjtNQUNGO01BRUEsTUFBTWEsUUFBUSxHQUFHdkIseUVBQWMsQ0FBQ2tCLE1BQU0sSUFBSSxHQUFHLEVBQUVWLFlBQVksQ0FBQztNQUU1RCxJQUFJb0IsUUFBUSxLQUFLTCxRQUFRLEVBQUU7UUFDekJkLFFBQVEsR0FBRztVQUNUb0IsTUFBTSxFQUFFOUIsdUVBQWMsQ0FBQzZCLFFBQVEsSUFBSSxFQUFFLEVBQUVwQixZQUFZLENBQUM7VUFDcERzQixNQUFNLEVBQUVGO1FBQ1YsQ0FBQyxDQUFDO01BQ0o7TUFDQVQsU0FBUyxDQUFDTSxjQUFjLENBQUM7SUFDM0I7RUFDRixDQUFDO0VBRUQsTUFBTU0sTUFBTSxHQUFJQyxDQUFzQyxJQUFLO0lBQ3pEQSxDQUFDLENBQUNDLGVBQWUsRUFBRTtJQUNuQixJQUFJLENBQUN0QixHQUFHLEVBQUU7TUFDUjtJQUNGO0lBRUFhLGNBQWMsQ0FBQ3pCLHVFQUFjLENBQUNZLEdBQUcsRUFBRUgsWUFBWSxDQUFDLENBQUM7RUFDbkQsQ0FBQztFQUVELE1BQU0wQixlQUFlLEdBQUd2QixHQUFHLElBQUlBLEdBQUcsR0FBRyxFQUFFO0VBRXZDLG9CQUNFckIsZ0RBQUEsQ0FBQ0csOERBQUs7SUFBQzJDLEVBQUUsRUFBRTtNQUFFQyxRQUFRLEVBQUU7SUFBVztFQUFFLGdCQUNsQy9DLGdEQUFBLENBQUNXLFdBQVcsRUFBQXFDLDBFQUFBO0lBQ1Z2QixTQUFTLEVBQUVBLFNBQVU7SUFDckJSLEtBQUssRUFBRVcsTUFBTSxDQUFDcUIsVUFBVSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUU7SUFDbEM5QixRQUFRLEVBQUd1QixDQUFDLElBQUtSLGNBQWMsQ0FBQ1EsQ0FBQyxDQUFDUSxNQUFNLENBQUNqQyxLQUFLLENBQUU7SUFDaERrQyxJQUFJLEVBQUMsUUFBUTtJQUNiQyxTQUFTLEVBQUdWLENBQUMsSUFBSztNQUNoQixJQUNFQSxDQUFDLENBQUNXLElBQUksS0FBSyxNQUFNLElBQ2pCWCxDQUFDLENBQUNZLEdBQUcsS0FBSyxHQUFHLElBQ2JaLENBQUMsQ0FBQ1ksR0FBRyxLQUFLLEdBQUcsSUFDYlosQ0FBQyxDQUFDWSxHQUFHLEtBQUssU0FBUyxJQUNuQlosQ0FBQyxDQUFDWSxHQUFHLEtBQUssV0FBVyxFQUNyQjtRQUNBWixDQUFDLENBQUNhLGNBQWMsRUFBRTtNQUNwQjtJQUNGLENBQUU7SUFDRkMsT0FBTyxFQUFHZCxDQUFDLElBQUs7TUFDZEEsQ0FBQyxDQUFDQyxlQUFlLEVBQUU7SUFDckIsQ0FBRTtJQUNGYyxPQUFPLEVBQUdmLENBQStCLElBQUs7TUFDNUM7TUFDQSxJQUFJQSxDQUFDLENBQUNRLE1BQU0sS0FBS1EsUUFBUSxDQUFDQyxhQUFhLEVBQUU7UUFDdENELFFBQVEsQ0FBQ0MsYUFBYSxDQUFzQkMsSUFBSSxFQUFFO01BQ3JEO0lBQ0YsQ0FBRTtJQUNGckMsS0FBSyxFQUFFQSxLQUFNO0lBQ2JzQyxXQUFXLEVBQUMsS0FBSztJQUNqQmYsRUFBRSxFQUFFO01BQ0ZnQixLQUFLLEVBQUVyQyxTQUFTLEdBQUcsTUFBTSxHQUFHO0lBQzlCLENBQUU7SUFDRnNDLFVBQVUsRUFBRTtNQUNWdkMsUUFBUTtNQUNSd0MsWUFBWSxFQUFFdEMsYUFBYSxHQUN6QkosY0FBYyxnQkFDWnRCLGdEQUFBLENBQUNRLHlFQUFnQjtRQUFDeUQsSUFBSSxFQUFFLEVBQUc7UUFBQ25CLEVBQUUsRUFBRTtVQUFFb0IsTUFBTSxFQUFFO1FBQWtCO01BQUUsRUFBRyxHQUMvRHRCLGVBQWUsZ0JBQ2pCNUMsZ0RBQUEsQ0FBQ0ssdUVBQWM7UUFBQzBDLFFBQVEsRUFBQztNQUFLLGdCQUM1Qi9DLGdEQUFBLENBQUNNLCtEQUFNO1FBQ0w2RCxPQUFPLEVBQUMsTUFBTTtRQUNkRixJQUFJLEVBQUMsT0FBTztRQUNaVCxPQUFPLEVBQUVmLE1BQU87UUFDaEJLLEVBQUUsRUFBRTtVQUFFc0IsQ0FBQyxFQUFFLENBQUM7VUFBRUMsY0FBYyxFQUFFO1FBQVc7TUFBRSxHQUMxQyxLQUVELENBQVMsQ0FDTSxHQUNmLElBQUksR0FDTixJQUFJO01BQ1JDLFNBQVMsRUFBRSxNQUFNO01BQ2pCeEIsRUFBRSxFQUFFO1FBQ0Z5QixFQUFFLEVBQUUsQ0FBQztRQUNMQyxFQUFFLEVBQUU7TUFDTjtJQUNGO0VBQUUsR0FDRTdDLEtBQUssRUFDVCxDQUNJO0FBRVo7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEwrRDtBQUMzQjtBQUU3QixTQUFTK0MsY0FBY0EsQ0FBQSxFQUFHO0VBQy9CLG9CQUNFMUUsS0FBQSxDQUFBNkMsYUFBQSxDQUFDNEIsNkNBQU8scUJBQ056RSxLQUFBLENBQUE2QyxhQUFBLENBQUNyQyx5RUFBZ0IsT0FBRyxDQUNaO0FBRWQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1Q0RTtBQUMzQztBQUNjO0FBYXhDLFNBQVNxRSxnQkFBZ0JBLENBQUM7RUFDL0JDLFNBQVM7RUFDVEMsS0FBSztFQUNMQyxXQUFXO0VBQ1hDLGFBQWE7RUFDYkM7QUFDcUIsQ0FBQyxFQUFFO0VBQ3hCLE1BQU0sQ0FBQ0MsaUJBQWlCLEVBQUVDLG9CQUFvQixDQUFDLEdBQUdsRiwrQ0FBUSxDQUFDLElBQUksQ0FBQztFQUNoRSxNQUFNO0lBQUVtRjtFQUFFLENBQUMsR0FBR1QsNkRBQWMsRUFBRTtFQUU5QixvQkFDRTVFLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQTdDLEtBQUEsQ0FBQXNGLFFBQUEsUUFDR1IsU0FBUyxpQkFDUjlFLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzhCLHNGQUFXO0lBQ1ZZLElBQUksRUFBRUosaUJBQWtCO0lBQ3hCRixhQUFhLEVBQUVBLGFBQWM7SUFDN0JPLE9BQU8sRUFBRUEsQ0FBQSxLQUFNSixvQkFBb0IsQ0FBQyxLQUFLLENBQUU7SUFDM0NMLEtBQUssRUFBRUEsS0FBSyxJQUFJTSxDQUFDLENBQUMsa0JBQWtCLENBQUU7SUFDdENJLElBQUksRUFDRlQsV0FBVyxJQUFJSyxDQUFDLENBQUMsK0NBQStDLENBQ2pFO0lBQ0RLLFlBQVksRUFBRVIsWUFBWSxFQUFFUyxPQUFPLElBQUlOLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBRTtJQUMzRE8sV0FBVyxFQUFFVixZQUFZLEVBQUVXLE1BQU0sSUFBSVIsQ0FBQyxDQUFDLG9CQUFvQjtFQUFFLEVBRWhFLENBQ0E7QUFFUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcENxQztBQVNIO0FBQ2tCO0FBRXFDO0FBQ3JCO0FBRXRCO0FBQ3NCO0FBQ3BCO0FBQ29CO0FBQ1A7QUFDTztBQUU3RCxNQUFNdUIscUJBQXFCLEdBQUdBLENBQUM7RUFBRUM7QUFBMkIsQ0FBQyxLQUFLO0VBQ3ZFLElBQUksT0FBT0EsSUFBSSxLQUFLLFFBQVEsRUFBRTtJQUM1QixvQkFBTzdHLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ2lFLGFBQWE7TUFBQ0QsSUFBSSxFQUFFQTtJQUFLLEVBQUc7RUFDdEM7RUFFQSxRQUFRQSxJQUFJLENBQUMxRCxJQUFJO0lBQ2YsS0FBSytDLHlFQUFtQjtNQUN0QixvQkFBT2xHLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ21FLFFBQVE7UUFBQ0gsSUFBSSxFQUFFQTtNQUFLLEVBQUc7SUFFakMsS0FBS1gsNEVBQXNCO01BQ3pCLG9CQUFPbEcsS0FBQSxDQUFBNkMsYUFBQSxDQUFDcUUsV0FBVztRQUFDTCxJQUFJLEVBQUVBO01BQUssRUFBRztJQUVwQyxLQUFLWCx5RUFBbUI7TUFDdEIsb0JBQU9sRyxLQUFBLENBQUE2QyxhQUFBLENBQUN1RSxRQUFRO1FBQUNQLElBQUksRUFBRUE7TUFBSyxFQUFHO0lBRWpDLEtBQUtYLDZFQUF1QjtNQUMxQixvQkFBT2xHLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3lFLFlBQVk7UUFBQ1QsSUFBSSxFQUFFQTtNQUFLLEVBQUc7SUFFckMsS0FBS1gsb0ZBQThCO01BQ2pDLG9CQUFPbEcsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMkUsa0JBQWtCO1FBQUNYLElBQUksRUFBRUE7TUFBSyxFQUFHO0lBRTNDO01BQ0UsT0FBTyxJQUFJO0VBQUM7QUFFbEIsQ0FBQztBQUVELE1BQU1DLGFBQWEsR0FBR0EsQ0FBQztFQUFFRDtBQUF1QixDQUFDLGtCQUMvQzdHLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ29ELG1FQUFVO0VBQUM5QixPQUFPLEVBQUM7QUFBTyxHQUFFMEMsSUFBSSxDQUNsQztBQUVELE1BQU1HLFFBQVEsR0FBR0EsQ0FBQztFQUFFSDtBQUF5QixDQUFDLGtCQUM1QzdHLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3lELHVEQUFZO0VBQUNtQixLQUFLLEVBQUVaLElBQUksQ0FBQ1k7QUFBTSxnQkFDOUJ6SCxLQUFBLENBQUE2QyxhQUFBLENBQUNvRCxtRUFBVTtFQUFDOUIsT0FBTyxFQUFDO0FBQVMsR0FBRTBDLElBQUksQ0FBQzVGLEtBQUssQ0FBYyxDQUUxRDtBQUVELE1BQU1tRyxRQUFRLEdBQUdBLENBQUM7RUFBRVA7QUFBeUIsQ0FBQyxLQUFLO0VBQ2pELE1BQU1hLEdBQUcsR0FBRyxJQUFJQyxHQUFHLENBQUNkLElBQUksQ0FBQzVGLEtBQUssQ0FBQ3lHLEdBQUcsQ0FBQztFQUVuQyxNQUFNRSx1QkFBdUIsR0FBR0YsR0FBRyxDQUFDRyxRQUFRLEtBQUtyQiw2REFBVTs7RUFFM0Q7RUFDQSxJQUFJb0IsdUJBQXVCLEVBQUU7SUFDM0IsT0FBTyxJQUFJO0VBQ2I7RUFFQSxvQkFDRTVILEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3lELHVEQUFZO0lBQUNtQixLQUFLLEVBQUVaLElBQUksQ0FBQ1k7RUFBTSxnQkFDOUJ6SCxLQUFBLENBQUE2QyxhQUFBLENBQUNtRCxnRUFBTztJQUFDakIsS0FBSyxFQUFFMkMsR0FBRyxDQUFDSztFQUFLLGdCQUN2Qi9ILEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLO0lBQUM2SCxTQUFTLEVBQUMsS0FBSztJQUFDQyxHQUFHLEVBQUU7RUFBSSxnQkFDOUJqSSxLQUFBLENBQUE2QyxhQUFBLENBQUNpRCw2REFBSTtJQUNIaUMsSUFBSSxFQUFFTCxHQUFHLENBQUNLLElBQUs7SUFDZjdFLE1BQU0sRUFBQyxRQUFRO0lBQ2ZnRixHQUFHLEVBQUMsWUFBWTtJQUNoQnBGLEVBQUUsRUFBRTtNQUNGcUYsT0FBTyxFQUFFLGFBQWE7TUFDdEJDLEtBQUssRUFBRTtJQUNUO0VBQUUsZ0JBRUZwSSxLQUFBLENBQUE2QyxhQUFBLENBQUNrRCxpRUFBUTtJQUFDOUIsSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUNqQixlQUNQakUsS0FBQSxDQUFBNkMsYUFBQSxDQUFDb0QsbUVBQVU7SUFDVDlCLE9BQU8sRUFBQyxTQUFTO0lBQ2pCckIsRUFBRSxFQUFFO01BQ0ZzRixLQUFLLEVBQUUsY0FBYztNQUNyQkMsWUFBWSxFQUFFLFVBQVU7TUFDeEJDLFFBQVEsRUFBRTtJQUNaO0VBQUUsR0FFRFosR0FBRyxDQUFDRyxRQUFRLENBQ0YsQ0FDUCxDQUNBLENBQ0c7QUFFbkIsQ0FBQztBQUVELE1BQU1YLFdBQVcsR0FBR0EsQ0FBQztFQUFFTDtBQUE0QixDQUFDLGtCQUNsRDdHLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3VELG1HQUFjO0VBQUNxQixLQUFLLEVBQUVaLElBQUksQ0FBQ1ksS0FBTTtFQUFDYyxPQUFPLEVBQUUxQixJQUFJLENBQUM1RjtBQUFNLEVBQ3hEO0FBRUQsTUFBTXVHLGtCQUFrQixHQUFHQSxDQUFDO0VBQUVYO0FBQW1DLENBQUMsS0FBSztFQUNyRSxNQUFNO0lBQUUyQjtFQUFrQixDQUFDLEdBQUduQyxrRkFBa0IsRUFBRTtFQUNsRCxNQUFNO0lBQUVvQztFQUFvQixDQUFDLEdBQUdoQyxrRkFBa0IsRUFBRTtFQUNwRCxNQUFNO0lBQUVpQztFQUFXLENBQUMsR0FBRy9CLGtGQUFrQixFQUFFO0VBQzNDLE1BQU07SUFBRWdDO0VBQWMsQ0FBQyxHQUFHcEMsa0ZBQWtCLEVBQUU7RUFFOUMsTUFBTXFDLEtBQUssR0FBRyxJQUFJekMsK0RBQVMsQ0FBQ1UsSUFBSSxDQUFDdEUsTUFBTSxFQUFFc0UsSUFBSSxDQUFDZ0MsV0FBVyxFQUFFaEMsSUFBSSxDQUFDaUMsTUFBTSxDQUFDO0VBQ3ZFLE1BQU1DLFVBQVUsR0FBR0osYUFBYSxDQUFDOUIsSUFBSSxDQUFDaUMsTUFBTSxDQUFDO0VBQzdDLE1BQU1FLE9BQU8sR0FBR04sVUFBVSxDQUFDN0IsSUFBSSxDQUFDWSxLQUFLLENBQUMsSUFBSWdCLG1CQUFtQixDQUFDNUIsSUFBSSxDQUFDWSxLQUFLLENBQUM7RUFFekUsb0JBQ0V6SCxLQUFBLENBQUE2QyxhQUFBLENBQUN5RCx1REFBWTtJQUNYbUIsS0FBSyxlQUNIekgsS0FBQSxDQUFBNkMsYUFBQSxDQUFDbUQsZ0VBQU87TUFBQ2pCLEtBQUssRUFBRThCLElBQUksQ0FBQ1k7SUFBTSxnQkFDekJ6SCxLQUFBLENBQUE2QyxhQUFBLENBQUNvRCxtRUFBVTtNQUFDOUIsT0FBTyxFQUFDLFNBQVM7TUFBQ2lFLEtBQUssRUFBQztJQUFnQixHQUNqRFksT0FBTyxFQUFFQyxJQUFJLElBQUl2QywyRUFBZSxDQUFDRyxJQUFJLENBQUNZLEtBQUssQ0FBQyxDQUNsQztFQUVoQixnQkFFRHpILEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLLHFCQUNKSCxLQUFBLENBQUE2QyxhQUFBLENBQUNvRCxtRUFBVTtJQUNUOUIsT0FBTyxFQUFDLE9BQU87SUFDZnJCLEVBQUUsRUFBRTtNQUNGb0csU0FBUyxFQUFFLE9BQU87TUFDbEJDLFVBQVUsRUFBRTtJQUNkO0VBQUUsR0FFRFAsS0FBSyxDQUFDUSxTQUFTLEVBQUUsRUFBQyxHQUFDLEVBQUNSLEtBQUssQ0FBQ1MsU0FBUyxFQUFFLENBQzNCLEVBQ1pOLFVBQVUsZ0JBQ1QvSSxLQUFBLENBQUE2QyxhQUFBLENBQUNvRCxtRUFBVTtJQUNUOUIsT0FBTyxFQUFDLFNBQVM7SUFDakJyQixFQUFFLEVBQUU7TUFDRm9HLFNBQVMsRUFBRSxPQUFPO01BQ2xCZCxLQUFLLEVBQUU7SUFDVDtFQUFFLEdBRURJLGlCQUFpQixDQUNoQk8sVUFBVSxHQUFHSCxLQUFLLENBQUNRLFNBQVMsQ0FBQztJQUFFRSxRQUFRLEVBQUU7RUFBSyxDQUFDLENBQUMsQ0FDakQsQ0FDVSxHQUNYLElBQUksQ0FDRixDQUNLO0FBRW5CLENBQUM7QUFFRCxNQUFNaEMsWUFBWSxHQUFHQSxDQUFDO0VBQUVUO0FBQTZCLENBQUMsS0FBSztFQUN6RCxNQUFNO0lBQUUyQjtFQUFrQixDQUFDLEdBQUduQyxrRkFBa0IsRUFBRTtFQUNsRCxNQUFNO0lBQUVzQztFQUFjLENBQUMsR0FBR3BDLGtGQUFrQixFQUFFO0VBQzlDLE1BQU1xQyxLQUFLLEdBQUcsSUFBSXpDLCtEQUFTLENBQUNVLElBQUksQ0FBQzVGLEtBQUssRUFBRTRGLElBQUksQ0FBQ2dDLFdBQVcsRUFBRWhDLElBQUksQ0FBQ2lDLE1BQU0sQ0FBQztFQUN0RSxNQUFNQyxVQUFVLEdBQUdKLGFBQWEsQ0FBQzlCLElBQUksQ0FBQ2lDLE1BQU0sQ0FBQztFQUU3QyxvQkFDRTlJLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3lELHVEQUFZO0lBQUNtQixLQUFLLEVBQUVaLElBQUksQ0FBQ1k7RUFBTSxnQkFDOUJ6SCxLQUFBLENBQUE2QyxhQUFBLENBQUMxQyw4REFBSyxxQkFDSkgsS0FBQSxDQUFBNkMsYUFBQSxDQUFDb0QsbUVBQVU7SUFDVDlCLE9BQU8sRUFBQyxPQUFPO0lBQ2ZyQixFQUFFLEVBQUU7TUFDRm9HLFNBQVMsRUFBRSxPQUFPO01BQ2xCQyxVQUFVLEVBQUU7SUFDZDtFQUFFLEdBRURQLEtBQUssQ0FBQ1EsU0FBUyxFQUFFLEVBQUMsR0FBQyxFQUFDUixLQUFLLENBQUNTLFNBQVMsRUFBRSxDQUMzQixFQUNaTixVQUFVLGdCQUNUL0ksS0FBQSxDQUFBNkMsYUFBQSxDQUFDb0QsbUVBQVU7SUFDVDlCLE9BQU8sRUFBQyxTQUFTO0lBQ2pCckIsRUFBRSxFQUFFO01BQ0ZvRyxTQUFTLEVBQUUsT0FBTztNQUNsQmQsS0FBSyxFQUFFO0lBQ1Q7RUFBRSxHQUVESSxpQkFBaUIsQ0FDaEJPLFVBQVUsR0FBR0gsS0FBSyxDQUFDUSxTQUFTLENBQUM7SUFBRUUsUUFBUSxFQUFFO0VBQUssQ0FBQyxDQUFDLENBQ2pELENBQ1UsR0FDWCxJQUFJLENBQ0YsQ0FDSztBQUVuQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvTDZEO0FBTTVCO0FBQ2dDO0FBS007QUFLN0I7QUFDZTtBQUNjO0FBRWtCO0FBQ2pCO0FBQ0w7QUFDQTtBQUtuQjtBQUVqRCxNQUFNYyxpQkFBaUIsR0FDckJDLElBQW1DLElBQ1o7RUFDdkIsSUFBSSxDQUFDQSxJQUFJLEVBQUU7SUFDVCxPQUFPdkksU0FBUztFQUNsQjtFQUVBLElBQUl3SSxnQkFBZ0IsQ0FBQ0QsSUFBSSxDQUFDLEVBQUU7SUFDMUIsT0FBT3ZJLFNBQVM7RUFDbEI7RUFFQSxJQUFJdUksSUFBSSxFQUFFbEgsSUFBSSxLQUFLcUcsd0ZBQWtDLEVBQUU7SUFDckQsT0FBT2dCLE1BQU0sQ0FBQ0gsSUFBSSxDQUFDQSxJQUFJLENBQUNJLE9BQU8sQ0FBQztFQUNsQztFQUVBLElBQUlKLElBQUksRUFBRWxILElBQUksS0FBS3FHLG9GQUE4QixFQUFFO0lBQ2pELE9BQU9hLElBQUksQ0FBQ0EsSUFBSSxDQUFDTSxZQUFZLEdBQUdILE1BQU0sQ0FBQ0gsSUFBSSxDQUFDQSxJQUFJLENBQUNNLFlBQVksQ0FBQyxHQUFHN0ksU0FBUztFQUM1RTtBQUNGLENBQUM7QUFFRCxNQUFNOEksYUFBNEIsR0FBR0MsTUFBTSxFQUFFO0FBUzdDLE1BQU1QLGdCQUFnQixHQUNwQkQsSUFBa0MsSUFDUEEsSUFBSSxDQUFDbEgsSUFBSSxLQUFLeUgsYUFBYTtBQUVqRCxTQUFTRSxnQkFBZ0JBLENBQUM7RUFDL0JDLE1BQU07RUFDTkMsT0FBTztFQUNQQztBQUtGLENBQUMsRUFBRTtFQUNELE1BQU07SUFDSkMsUUFBUSxFQUFFO01BQUVDLE1BQU0sRUFBRUM7SUFBYztFQUNwQyxDQUFDLEdBQUd6RSxrRkFBa0IsRUFBRTtFQUN4QixNQUFNO0lBQUUwRTtFQUF3QixDQUFDLEdBQUc5RSxtRkFBa0IsRUFBRTtFQUN4RCxNQUFNO0lBQUUrRTtFQUFRLENBQUMsR0FBR3RCLHNGQUFvQixFQUFFO0VBQzFDLE1BQU0sQ0FBQ3VCLFVBQVUsRUFBRUMsYUFBYSxDQUFDLEdBQUd0TCwrQ0FBUSxFQUFxQjtFQUVqRSxNQUFNLENBQUN1TCxRQUFRLEVBQUVDLFdBQVcsQ0FBQyxHQUFHeEwsK0NBQVEsRUFBb0I7RUFDNUQsTUFBTTtJQUFFeUw7RUFBYyxDQUFDLEdBQUcvQixzRkFBb0IsRUFBRTtFQUVoRCxNQUFNLENBQUNnQyxnQkFBZ0IsRUFBRUMsbUJBQW1CLENBQUMsR0FBRzNMLCtDQUFRLENBQUMsS0FBSyxDQUFDO0VBQy9ELE1BQU0sQ0FBQzRMLGNBQWMsRUFBRUMsaUJBQWlCLENBQUMsR0FBRzdMLCtDQUFRLENBQ2xENEosa0ZBQW1CLENBQ3BCO0VBQ0QsTUFBTSxDQUFDbUMscUJBQXFCLEVBQUVDLHdCQUF3QixDQUFDLEdBQUdoTSwrQ0FBUSxDQUFDLEtBQUssQ0FBQztFQUN6RSxNQUFNaU0sb0JBQW9CLEdBQUdDLE9BQU8sQ0FBQ3JCLE1BQU0sRUFBRXNCLFdBQVcsQ0FBQ0Msa0JBQWtCLENBQUM7RUFFNUUsTUFBTUMsTUFBTSxHQUFHckMsdUZBQXFCLENBQUM7SUFBRWM7RUFBUSxDQUFDLENBQUM7RUFFakQsTUFBTXdCLFdBQVcsR0FBRzdDLDhDQUFPLENBQ3pCLE1BQU00QyxNQUFNLENBQUNFLElBQUksQ0FBQyxDQUFDO0lBQUV0SjtFQUFLLENBQUMsS0FBS0EsSUFBSSxLQUFLc0csc0VBQWdCLENBQUMsSUFBSSxJQUFJLEVBQ2xFLENBQUM4QyxNQUFNLENBQUMsQ0FDeUI7RUFFbkMsTUFBTUksV0FBVyxHQUFHaEQsOENBQU8sQ0FBQyxNQUFNO0lBQ2hDLElBQUksQ0FBQ29CLE1BQU0sSUFBSSxDQUFDb0Isb0JBQW9CLEVBQUU7TUFDcEMsT0FBT3JLLFNBQVM7SUFDbEI7SUFFQSxJQUFJcUksK0ZBQXFCLENBQUNZLE1BQU0sQ0FBQyxFQUFFO01BQ2pDbUIsd0JBQXdCLENBQUMsSUFBSSxDQUFDO01BQzlCLElBQUksT0FBT2pCLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDL0IsTUFBTTJCLFFBQVEsR0FBRzdCLE1BQU0sQ0FBQzhCLGVBQWUsQ0FBQ0MsTUFBTSxDQUFDLENBQUNDLEdBQUcsRUFBRUMsR0FBRyxLQUFLO1VBQzNELElBQUlBLEdBQUcsQ0FBQ0wsV0FBVyxDQUFDeEosSUFBSSxLQUFLcUcsb0ZBQThCLEVBQUU7WUFDM0QsT0FBT3VELEdBQUcsR0FBR3ZDLE1BQU0sQ0FBQ3dDLEdBQUcsQ0FBQ0wsV0FBVyxDQUFDdEMsSUFBSSxDQUFDdUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztVQUMxRDtVQUVBLE1BQU0sSUFBSUssS0FBSyxDQUNiLDREQUE0RCxHQUMxREQsR0FBRyxDQUFDTCxXQUFXLENBQUN4SixJQUFJLENBQ3ZCO1FBQ0gsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUVOLE9BQU87VUFDTEEsSUFBSSxFQUFFeUgsYUFBYTtVQUNuQkgsT0FBTyxFQUFFTSxNQUFNLENBQUM4QixlQUFlLENBQUNDLE1BQU0sQ0FBQyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsS0FBSztZQUNuRCxJQUFJQSxHQUFHLENBQUNMLFdBQVcsQ0FBQ3hKLElBQUksS0FBS3FHLG9GQUE4QixFQUFFO2NBQzNELE1BQU0wRCxLQUFLLEdBQUdGLEdBQUcsQ0FBQ0wsV0FBVyxDQUFDdEMsSUFBSSxDQUFDdUMsUUFBUTtjQUMzQyxNQUFNTyxNQUFNLEdBQUdILEdBQUcsQ0FBQ0wsV0FBVyxDQUFDdEMsSUFBSSxDQUFDTSxZQUFZO2NBRWhELElBQUksQ0FBQ3VDLEtBQUssSUFBSSxDQUFDQyxNQUFNLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRTtjQUNYO2NBRUEsTUFBTUMsTUFBTSxHQUFHckwsTUFBTSxDQUFDbUwsS0FBSyxDQUFDLEdBQUduTCxNQUFNLENBQUM2SyxRQUFRLENBQUM7Y0FFL0MsT0FBT0csR0FBRyxHQUFHdkMsTUFBTSxDQUFDNkMsSUFBSSxDQUFDQyxJQUFJLENBQUN2TCxNQUFNLENBQUNvTCxNQUFNLENBQUMsR0FBR0MsTUFBTSxDQUFDLENBQUM7WUFDekQ7WUFFQSxNQUFNLElBQUlILEtBQUssQ0FDYiw0REFBNEQsR0FDMURELEdBQUcsQ0FBQ0wsV0FBVyxDQUFDeEosSUFBSSxDQUN2QjtVQUNILENBQUMsRUFBRSxFQUFFLENBQUM7VUFDTnlKO1FBQ0YsQ0FBQztNQUNIO01BRUEsTUFBTVcsY0FBYyxHQUFJeEMsTUFBTSxDQUFtQjhCLGVBQWUsQ0FBQzVCLE9BQU8sQ0FBQztNQUV6RSxJQUFJLENBQUNzQyxjQUFjLEVBQUU7UUFDbkI7TUFDRjtNQUVBLE9BQU9BLGNBQWMsQ0FBQ1osV0FBVztJQUNuQztJQUVBLFFBQVE1QixNQUFNLEVBQUU0QixXQUFXLEVBQUV4SixJQUFJO01BQy9CO01BQ0EsS0FBS3FHLHdGQUFrQztNQUN2QyxLQUFLQSwwRkFBb0M7TUFDekMsS0FBS0Esb0ZBQThCO1FBQ2pDLE9BQU91QixNQUFNLENBQUM0QixXQUFXO01BRTNCO1FBQ0UsT0FBTzdLLFNBQVM7SUFBQztFQUV2QixDQUFDLEVBQUUsQ0FBQ2lKLE1BQU0sRUFBRW9CLG9CQUFvQixFQUFFbEIsT0FBTyxDQUFDLENBQUM7RUFFM0MsTUFBTXdDLFNBQVMsR0FBRy9ELGtEQUFXLENBQzNCLE9BQU9nRSxVQUFrQixFQUFFQyxVQUFtQixLQUFLO0lBQ2pELElBQUksQ0FBQzVDLE1BQU0sRUFBRTZDLFFBQVEsSUFBSSxDQUFDekIsb0JBQW9CLEVBQUU7TUFDOUM7SUFDRjtJQUVBLE1BQU0wQixZQUFZLEdBQ2hCbEIsV0FBVyxFQUFFeEosSUFBSSxLQUFLcUcsd0ZBQWtDLEdBQ3BEO01BQUVpQixPQUFPLEVBQUUxSSxNQUFNLENBQUMyTCxVQUFVO0lBQUUsQ0FBQyxHQUMvQjtNQUFFQSxVQUFVO01BQUVDO0lBQVcsQ0FBQztJQUVoQyxNQUFNckMsT0FBTyxDQUE0QjtNQUN2Q3dDLE1BQU0sRUFBRTdELDBIQUFzQztNQUM5QytELE1BQU0sRUFDSixPQUFPL0MsT0FBTyxLQUFLLFdBQVcsR0FDMUIsQ0FBQ0YsTUFBTSxDQUFDNkMsUUFBUSxFQUFFQyxZQUFZLENBQUMsR0FDL0IsQ0FBQzlDLE1BQU0sQ0FBQzZDLFFBQVEsRUFBRUMsWUFBWSxFQUFFNUMsT0FBTztJQUMvQyxDQUFDLENBQUM7RUFDSixDQUFDLEVBQ0QsQ0FDRUYsTUFBTSxFQUFFNkMsUUFBUSxFQUNoQnpCLG9CQUFvQixFQUNwQmIsT0FBTyxFQUNQcUIsV0FBVyxFQUFFeEosSUFBSSxFQUNqQjhILE9BQU8sQ0FDUixDQUNGO0VBRUQsTUFBTWdELFVBQVUsR0FBR3ZFLGtEQUFXLENBQUVXLElBQWtDLElBQUs7SUFDckUsSUFBSUMsZ0JBQWdCLENBQUNELElBQUksQ0FBQyxFQUFFO01BQzFCLE9BQU87UUFDTDZELEtBQUssRUFBRW5NLE1BQU0sQ0FBQ3NJLElBQUksQ0FBQ3VDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDbENuQyxPQUFPLEVBQUVKLElBQUksQ0FBQ0ksT0FBTyxJQUFJLEVBQUU7UUFDM0JrRCxVQUFVLEVBQUV0RCxJQUFJLENBQUNzRCxVQUFVLElBQUk7TUFDakMsQ0FBQztJQUNIO0lBQ0EsUUFBUXRELElBQUksQ0FBQ2xILElBQUk7TUFDZixLQUFLcUcsc0ZBQWdDO01BQ3JDLEtBQUtBLHdFQUFrQjtNQUN2QixLQUFLQSw2RUFBdUI7UUFBRTtVQUM1QixNQUFNLElBQUl5RCxLQUFLLENBQ1osb0RBQW1ENUMsSUFBSSxDQUFDbEgsSUFBSyxHQUFFLENBQ2pFO1FBQ0g7TUFFQSxLQUFLcUcsd0ZBQWtDO1FBQUU7VUFDdkMsT0FBTztZQUNMaUIsT0FBTyxFQUFFRCxNQUFNLENBQUNILElBQUksQ0FBQ0EsSUFBSSxDQUFDSSxPQUFPLENBQUM7WUFDbEN5RCxLQUFLLEVBQUViLElBQUksQ0FBQ0MsSUFBSSxDQUFDakQsSUFBSSxDQUFDQSxJQUFJLENBQUNpRSxHQUFHLEdBQUdqRSxJQUFJLENBQUNBLElBQUksQ0FBQ0ksT0FBTyxDQUFDLElBQUk7VUFDekQsQ0FBQztRQUNIO01BRUEsS0FBS2pCLG9GQUE4QjtRQUFFO1VBQ25DLE9BQU87WUFDTGlCLE9BQU8sRUFBRUosSUFBSSxDQUFDQSxJQUFJLENBQUNNLFlBQVksR0FBR0gsTUFBTSxDQUFDSCxJQUFJLENBQUNBLElBQUksQ0FBQ00sWUFBWSxDQUFDLEdBQUcsRUFBRTtZQUNyRWdELFVBQVUsRUFBRXRELElBQUksQ0FBQ0EsSUFBSSxDQUFDa0Usb0JBQW9CLEdBQ3RDL0QsTUFBTSxDQUFDSCxJQUFJLENBQUNBLElBQUksQ0FBQ2tFLG9CQUFvQixDQUFDLEdBQ3RDLEVBQUU7WUFDTkwsS0FBSyxFQUFFbk0sTUFBTSxDQUFDc0ksSUFBSSxDQUFDQSxJQUFJLENBQUN1QyxRQUFRLElBQUksQ0FBQztVQUN2QyxDQUFDO1FBQ0g7TUFFQTtRQUNFLE1BQU0sSUFBSUssS0FBSyxDQUFFLG1DQUFrQzVDLElBQUksQ0FBQ2xILElBQUssRUFBQyxDQUFDO0lBQUM7RUFFdEUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztFQUVOLE1BQU1xTCxzQkFBc0IsR0FBRzdFLDhDQUFPLENBQUMsTUFBTTtJQUMzQyxJQUFJLENBQUM2QyxXQUFXLEVBQUVpQyxPQUFPLElBQUksQ0FBQzlCLFdBQVcsRUFBRTtNQUN6QyxPQUFPLEtBQUs7SUFDZDtJQUVBLE1BQU0rQixJQUFJLEdBQUdULFVBQVUsQ0FBQ3RCLFdBQVcsQ0FBQztJQUNwQyxNQUFNZ0MsSUFBSSxHQUFHRCxJQUFJLENBQUNqRSxPQUFPLEdBQUdELE1BQU0sQ0FBQ2tFLElBQUksQ0FBQ1IsS0FBSyxDQUFDO0lBRTlDLE9BQU8xQixXQUFXLENBQUNpQyxPQUFPLEdBQUdFLElBQUk7RUFDbkMsQ0FBQyxFQUFFLENBQUNWLFVBQVUsRUFBRXpCLFdBQVcsRUFBRWlDLE9BQU8sRUFBRTlCLFdBQVcsQ0FBQyxDQUFDOztFQUVuRDtFQUNBMU0sZ0RBQVMsQ0FBQyxNQUFNO0lBQ2QsSUFBSSxDQUFDbUwsYUFBYSxJQUFJLENBQUNKLE9BQU8sRUFBRTRELE9BQU8sRUFBRTtNQUN2QztJQUNGO0lBRUF2RCx1QkFBdUIsQ0FBQyxDQUFDRCxhQUFhLENBQUMsRUFBRSxDQUFDSixPQUFPLENBQUM0RCxPQUFPLENBQUMsQ0FBQztFQUM3RCxDQUFDLEVBQUUsQ0FBQ3hELGFBQWEsRUFBRUosT0FBTyxFQUFFNEQsT0FBTyxFQUFFdkQsdUJBQXVCLENBQUMsQ0FBQztFQUU5RHBMLGdEQUFTLENBQUMsTUFBTTtJQUNkLE1BQU00TyxhQUFhLEdBQUdyQyxXQUFXLEVBQUVpQyxPQUFPO0lBRTFDLElBQUksQ0FBQ0ksYUFBYSxJQUFJLENBQUNsQyxXQUFXLElBQUksQ0FBQ1Isb0JBQW9CLEVBQUU7TUFDM0Q7SUFDRjtJQUVBLE1BQU11QyxJQUFJLEdBQUdULFVBQVUsQ0FBQ3RCLFdBQVcsQ0FBQztJQUNwQyxNQUFNZ0MsSUFBSSxHQUFHRCxJQUFJLENBQUNqRSxPQUFPLEdBQUdELE1BQU0sQ0FBQ2tFLElBQUksQ0FBQ1IsS0FBSyxDQUFDO0lBRTlDeEMsV0FBVyxDQUNUYyxXQUFXLENBQUNpQyxPQUFPLElBQUlFLElBQUksR0FDdkI3TSxTQUFTLEdBQ1RpSSxpR0FBNkMsQ0FDbEQ7RUFDSCxDQUFDLEVBQUUsQ0FBQ2tFLFVBQVUsRUFBRTlCLG9CQUFvQixFQUFFSyxXQUFXLEVBQUVpQyxPQUFPLEVBQUU5QixXQUFXLENBQUMsQ0FBQztFQUV6RSxNQUFNLENBQUNoQyxZQUFZLEVBQUVvRSxlQUFlLENBQUMsR0FBRzdPLCtDQUFRLENBQzlDa0ssaUJBQWlCLENBQUN1QyxXQUFXLENBQUMsQ0FDL0I7RUFDRCxNQUFNLENBQUM0QixvQkFBb0IsRUFBRVMsdUJBQXVCLENBQUMsR0FBRzlPLCtDQUFRLENBQzlEcUwsVUFBVSxFQUFFMEQsR0FBRyxFQUFFVixvQkFBb0IsQ0FDdEM7RUFFRHRPLGdEQUFTLENBQUMsTUFBTTtJQUNkLElBQUksQ0FBQ3NMLFVBQVUsSUFBSSxDQUFDWSxvQkFBb0IsRUFBRTtNQUN4QztJQUNGOztJQUVBO0lBQ0E0QyxlQUFlLENBQUVHLFFBQVEsSUFBS0EsUUFBUSxJQUFJM0QsVUFBVSxDQUFDMEQsR0FBRyxDQUFDdEUsWUFBWSxDQUFDO0lBQ3RFcUUsdUJBQXVCLENBQ3BCRSxRQUFRLElBQUtBLFFBQVEsSUFBSTNELFVBQVUsQ0FBQzBELEdBQUcsQ0FBQ1Ysb0JBQW9CLENBQzlEO0VBQ0gsQ0FBQyxFQUFFLENBQUNoRCxVQUFVLEVBQUVZLG9CQUFvQixDQUFDLENBQUM7RUFFdEMsTUFBTWdELFlBQVksR0FBR3pGLGtEQUFXLENBQzdCMEYsTUFJQSxJQUFLO0lBQ0pMLGVBQWUsQ0FBQ0ssTUFBTSxDQUFDekUsWUFBWSxDQUFDO0lBQ3BDcUUsdUJBQXVCLENBQUNJLE1BQU0sQ0FBQ2Isb0JBQW9CLENBQUM7SUFDcER4QyxpQkFBaUIsQ0FBQ3FELE1BQU0sQ0FBQ0MsT0FBTyxDQUFDO0VBQ25DLENBQUMsRUFDRCxFQUFFLENBQ0g7RUFFRHBQLGdEQUFTLENBQUMsTUFBTTtJQUNkLElBQUlxUCxTQUFTLEdBQUcsSUFBSTtJQUVwQixJQUFJLENBQUN0RSxPQUFPLElBQUksQ0FBQ21CLG9CQUFvQixFQUFFO01BQ3JDO0lBQ0Y7SUFDQTtJQUNBO0lBQ0FSLGFBQWEsQ0FBQ1gsT0FBTyxDQUFDdUUsTUFBTSxDQUFDLENBQUNDLElBQUksQ0FBRWxCLEdBQUcsSUFBSztNQUMxQyxJQUFJZ0IsU0FBUyxFQUFFO1FBQ2I5RCxhQUFhLENBQUM4QyxHQUFHLENBQUM7TUFDcEI7SUFDRixDQUFDLENBQUM7SUFFRixPQUFPLE1BQU07TUFDWGdCLFNBQVMsR0FBRyxLQUFLO0lBQ25CLENBQUM7RUFDSCxDQUFDLEVBQUUsQ0FBQzNELGFBQWEsRUFBRVEsb0JBQW9CLEVBQUVuQixPQUFPLENBQUMsQ0FBQztFQUVsRC9LLGdEQUFTLENBQUMsTUFBTTtJQUNkLElBQUksT0FBTzBLLFlBQVksS0FBSyxXQUFXLElBQUksQ0FBQ3dCLG9CQUFvQixFQUFFO01BQ2hFO0lBQ0Y7SUFFQSxJQUFJbUQsU0FBUyxHQUFHLElBQUk7SUFFcEJ6RCxtQkFBbUIsQ0FBQyxJQUFJLENBQUM7SUFDekI0QixTQUFTLENBQUM5QyxZQUFZLEVBQUU0RCxvQkFBb0IsQ0FBQyxDQUMxQ2tCLEtBQUssQ0FBRUMsR0FBRyxJQUFLO01BQ2RDLE9BQU8sQ0FBQ3BPLEtBQUssQ0FBQ21PLEdBQUcsQ0FBQztNQUNsQixJQUFJLENBQUNKLFNBQVMsRUFBRTtRQUNkO01BQ0Y7TUFDQTVELFdBQVcsQ0FBQ2dFLEdBQUcsQ0FBQztJQUNsQixDQUFDLENBQUMsQ0FDREUsT0FBTyxDQUFDLE1BQU07TUFDYixJQUFJLENBQUNOLFNBQVMsRUFBRTtRQUNkO01BQ0Y7TUFDQXpELG1CQUFtQixDQUFDLEtBQUssQ0FBQztJQUM1QixDQUFDLENBQUM7SUFFSixPQUFPLE1BQU07TUFDWHlELFNBQVMsR0FBRyxLQUFLO0lBQ25CLENBQUM7RUFDSCxDQUFDLEVBQUUsQ0FDRG5ELG9CQUFvQixFQUNwQnhCLFlBQVksRUFDWjRELG9CQUFvQixFQUNwQmQsU0FBUyxFQUNUeEMsT0FBTyxDQUNSLENBQUM7RUFFRixNQUFNNEUsZUFBZSxHQUFHbkcsa0RBQVcsQ0FDaEMvSCxLQUFtQyxJQUFLO0lBQ3ZDLElBQUksQ0FBQzRKLFVBQVUsSUFBSSxDQUFDb0IsV0FBVyxFQUFFO01BQy9CLG9CQUNFM00sS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsK0RBQUs7UUFBQzJDLEVBQUUsRUFBRTtVQUFFbUYsR0FBRyxFQUFFLEdBQUc7VUFBRTVELGNBQWMsRUFBRTtRQUFhO01BQUUsZ0JBQ3BEckUsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMEcsa0VBQVE7UUFBQ3BGLE9BQU8sRUFBQyxNQUFNO1FBQUNMLEtBQUssRUFBRTtNQUFJLEVBQUcsZUFDdkM5RCxLQUFBLENBQUE2QyxhQUFBLENBQUMwRyxrRUFBUTtRQUFDcEYsT0FBTyxFQUFDLFNBQVM7UUFBQ0QsTUFBTSxFQUFFO01BQUksRUFBRyxDQUNyQztJQUVaO0lBRUEsTUFBTTtNQUFFdUcsT0FBTztNQUFFeUQ7SUFBTSxDQUFDLEdBQUdELFVBQVUsQ0FBQ3RCLFdBQVcsQ0FBQztJQUVsRCxvQkFDRTNNLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ2dILHlFQUFVLEVBQUE3RywwRUFBQTtNQUNUMkgsWUFBWSxFQUFFRixPQUFRO01BQ3RCeUQsS0FBSyxFQUFFQSxLQUFNO01BQ2IvTSxRQUFRLEVBQUVnTyxZQUFhO01BQ3ZCVyxzQkFBc0IsRUFBRWhFLGNBQWU7TUFDdkNkLE9BQU8sRUFBRUEsT0FBUTtNQUNqQk8sVUFBVSxFQUFFQSxVQUFXO01BQ3ZCVSxxQkFBcUIsRUFBRUE7SUFBc0IsR0FDekN0SyxLQUFLLEVBQ1Q7RUFFTixDQUFDLEVBQ0QsQ0FDRW1LLGNBQWMsRUFDZG1DLFVBQVUsRUFDVmhDLHFCQUFxQixFQUNyQmpCLE9BQU8sRUFDUE8sVUFBVSxFQUNWNEQsWUFBWSxFQUNaeEMsV0FBVyxDQUNaLENBQ0Y7RUFFRCxPQUFPO0lBQ0xmLGdCQUFnQjtJQUNoQjRDLHNCQUFzQjtJQUN0QnFCLGVBQWU7SUFDZnBFO0VBQ0YsQ0FBQztBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMVlpQztBQUNlO0FBQ0Y7QUFDK0I7QUFDRTtBQU8xQztBQUVyQyxNQUFNOEUsUUFBUSxHQUFHaFEsdUVBQU0sQ0FBQzJQLHVGQUFpQixDQVN0QztBQUNILFdBQVcsQ0FBQztFQUFFcE07QUFBTSxDQUFDLEtBQUtBLEtBQUssSUFBSSxNQUFPO0FBQzFDLFlBQVksQ0FBQztFQUFFSTtBQUFPLENBQUMsS0FBS0EsTUFBTSxJQUFJLE1BQU87QUFDN0MsZUFBZSxDQUFDO0VBQUVzTTtBQUFTLENBQUMsS0FBS0EsUUFBUSxJQUFJLE9BQVE7QUFDckQsZ0JBQWdCLENBQUM7RUFBRUM7QUFBVSxDQUFDLEtBQUtBLFNBQVMsSUFBSSxPQUFRO0FBQ3hELHNCQUFzQixDQUFDO0VBQUVDO0FBQU0sQ0FBQyxLQUFNLEdBQUVBLEtBQUssQ0FBQ0MsT0FBTyxDQUFDQyxNQUFNLENBQUNDLEtBQU0sSUFBSTtBQUN2RTtBQUNBO0FBQ0Esb0JBQW9CLENBQUM7RUFBRUg7QUFBTSxDQUFDLEtBQU0sR0FBRUEsS0FBSyxDQUFDQyxPQUFPLENBQUNDLE1BQU0sQ0FBQ0MsS0FBTSxJQUFJO0FBQ3JFO0FBQ0E7QUFDQSxtQkFBbUIsQ0FBQztFQUFFQyxlQUFlO0VBQUVDO0FBQWEsQ0FBQyxLQUNqREQsZUFBZSxHQUFJQyxZQUFZLElBQUksS0FBSyxHQUFJLE1BQU87QUFDdkQsWUFBWSxDQUFDO0VBQUVDO0FBQVksQ0FBQyxLQUFNQSxXQUFXLEdBQUcsU0FBUyxHQUFHLFNBQVc7QUFDdkUsQ0FBQztBQUVELE1BQU1DLFFBQVEsR0FBRzFRLHVFQUFNLENBQUMsT0FBTyxDQU81QjtBQUNILFdBQVcsQ0FBQztFQUFFdUQ7QUFBTSxDQUFDLEtBQUtBLEtBQUssSUFBSSxNQUFPO0FBQzFDLGVBQWUsQ0FBQztFQUFFME07QUFBUyxDQUFDLEtBQUtBLFFBQVEsSUFBSSxPQUFRO0FBQ3JELFlBQVksQ0FBQztFQUFFdE07QUFBTyxDQUFDLEtBQUtBLE1BQU0sSUFBSSxNQUFPO0FBQzdDLGdCQUFnQixDQUFDO0VBQUV1TTtBQUFVLENBQUMsS0FBS0EsU0FBUyxJQUFJLE9BQVE7QUFDeEQsc0JBQXNCLENBQUM7RUFBRUM7QUFBTSxDQUFDLEtBQU0sR0FBRUEsS0FBSyxDQUFDQyxPQUFPLENBQUNDLE1BQU0sQ0FBQ0MsS0FBTSxJQUFJO0FBQ3ZFO0FBQ0E7QUFDQSxvQkFBb0IsQ0FBQztFQUFFSDtBQUFNLENBQUMsS0FBTSxHQUFFQSxLQUFLLENBQUNDLE9BQU8sQ0FBQ0MsTUFBTSxDQUFDQyxLQUFNLElBQUk7QUFDckU7QUFDQTtBQUNBLG1CQUFtQixDQUFDO0VBQUVFO0FBQWEsQ0FBQyxLQUFLQSxZQUFZLElBQUksS0FBTTtBQUMvRCxDQUFDO0FBb0JNLFNBQVNHLGdCQUFnQkEsQ0FBQztFQUMvQnhKLEdBQUc7RUFDSDVELEtBQUs7RUFDTEksTUFBTTtFQUNOc00sUUFBUTtFQUNSQyxTQUFTO0VBQ1RVLEtBQUssR0FBRyxLQUFLO0VBQ2JDLE1BQU07RUFDTkMsWUFBWSxHQUFHLElBQUk7RUFDbkJDLFFBQVEsR0FBRyxLQUFLO0VBQ2hCQyxTQUFTO0VBQ1RSLFlBQVksR0FBRyxLQUFLO0VBQ3BCUyxXQUFXLEdBQUcsS0FBSztFQUNuQi9DLE9BQU8sR0FBRyxFQUFFO0VBQ1pnRCxnQkFBZ0IsR0FBRyxLQUFLO0VBQ3hCQyxRQUFRLEdBQUc7QUFDVSxDQUFDLEVBQUU7RUFDeEIsTUFBTSxDQUFDQyxpQkFBaUIsRUFBRUMsb0JBQW9CLENBQUMsR0FBRzFSLCtDQUFRLENBQUMsS0FBSyxDQUFDO0VBQ2pFLE1BQU0sQ0FBQzJSLGtCQUFrQixFQUFFQyxxQkFBcUIsQ0FBQyxHQUFHNVIsK0NBQVEsQ0FBQyxLQUFLLENBQUM7RUFDbkUsTUFBTSxDQUFDNlIsY0FBYyxFQUFFQyxpQkFBaUIsQ0FBQyxHQUFHOVIsK0NBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztFQUU3RCxvQkFDRUYsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsOERBQUs7SUFDSjJDLEVBQUUsRUFBRTtNQUNGc08sTUFBTTtNQUNOYSxhQUFhLEVBQUU7SUFDakIsQ0FBRTtJQUNGVixTQUFTLEVBQUVBO0VBQVUsZ0JBRXJCdlIsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsOERBQUs7SUFDSjJDLEVBQUUsRUFBRTtNQUNGbVAsYUFBYSxFQUFFLEtBQUs7TUFDcEJ6QixRQUFRLEVBQUVBLFFBQVEsR0FBR0EsUUFBUSxHQUFHLE9BQU87TUFDdkMxTSxLQUFLLEVBQUVBLEtBQUssR0FBR0EsS0FBSyxHQUFHLE1BQU07TUFDN0JmLFFBQVEsRUFBRSxVQUFVO01BQ3BCc0IsY0FBYyxFQUFFLFVBQVU7TUFDMUI2TixVQUFVLEVBQUUsVUFBVTtNQUN0QkMsU0FBUyxFQUFFLENBQUM7TUFDWkMsTUFBTSxFQUFFLENBQUM7TUFDVEMsRUFBRSxFQUFFLENBQUM7TUFDTEMsRUFBRSxFQUFFLENBQUM7TUFDTEMsRUFBRSxFQUFFO0lBQ047RUFBRSxHQUVEZixXQUFXLElBQUlPLGNBQWMsaUJBQzVCL1IsS0FBQSxDQUFBNkMsYUFBQSxDQUFDdU4sNkRBQUk7SUFDSG5NLElBQUksRUFBQyxPQUFPO0lBQ1puQixFQUFFLEVBQUU7TUFDRjBQLGVBQWUsRUFBRzlCLEtBQUssSUFDckJtQixrQkFBa0IsR0FBRyxlQUFlLEdBQUduQixLQUFLLENBQUNDLE9BQU8sQ0FBQzhCLElBQUksQ0FBQyxHQUFHLENBQUM7TUFDaEVySyxLQUFLLEVBQUV5SixrQkFBa0IsR0FDckIsc0JBQXNCLEdBQ3RCLGVBQWU7TUFDbkJyTixFQUFFLEVBQUU7SUFDTixDQUFFO0lBQ0ZpRCxLQUFLLEVBQUVnSCxPQUFPLENBQUNpRSxRQUFRO0VBQUcsRUFFN0IsRUFDQWpCLGdCQUFnQixpQkFDZnpSLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3lOLDJFQUFrQjtJQUNqQjlNLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO01BQ2JvTyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7SUFDNUIsQ0FBRTtJQUNGM04sSUFBSSxFQUFDLElBQUk7SUFDVG5CLEVBQUUsRUFBRTtNQUNGc0YsS0FBSyxFQUFFeUosa0JBQWtCLEdBQ3JCLGVBQWUsR0FDZixzQkFBc0I7TUFDMUJjLE1BQU0sRUFBRTtJQUNWO0VBQUUsRUFFTCxDQUNLLEVBQ1A1QywrQ0FBTyxDQUFDckksR0FBRyxDQUFDLGdCQUNYMUgsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsOERBQUs7SUFBQzJDLEVBQUUsRUFBRTtNQUFFQyxRQUFRLEVBQUUsVUFBVTtNQUFFa1AsYUFBYSxFQUFFO0lBQU07RUFBRSxnQkFDeERqUyxLQUFBLENBQUE2QyxhQUFBLENBQUNvTyxRQUFRO0lBQ1BuTixLQUFLLEVBQUVBLEtBQU07SUFDYkksTUFBTSxFQUFFQSxNQUFPO0lBQ2ZzTSxRQUFRLEVBQUVBLFFBQVM7SUFDbkJDLFNBQVMsRUFBRUEsU0FBVTtJQUNyQlUsS0FBSyxFQUFFQSxLQUFNO0lBQ2JHLFFBQVEsRUFBRUEsUUFBUztJQUNuQlAsWUFBWSxFQUFFQTtFQUFhLGdCQUkzQi9RLEtBQUEsQ0FBQTZDLGFBQUE7SUFDRStQLEdBQUcsRUFBRXpDLDZGQUF3QixDQUFDekksR0FBRyxDQUFFO0lBQ25DbUwsV0FBVyxFQUFFQSxDQUFBLEtBQU1iLGlCQUFpQixDQUFDLElBQUk7RUFBRSxFQUMzQyxDQUVPLEVBQ1ZYLFlBQVksaUJBQ1hyUixLQUFBLENBQUE2QyxhQUFBLENBQUN3TiwwRUFBaUI7SUFDaEJ2TixFQUFFLEVBQUU7TUFDRkMsUUFBUSxFQUFFLFVBQVU7TUFDcEIrUCxNQUFNLEVBQUUsS0FBSztNQUNiQyxLQUFLLEVBQUUsS0FBSztNQUNaM0ssS0FBSyxFQUFFO0lBQ1Q7RUFBRSxFQUVMLENBQ0ssZ0JBRVJwSSxLQUFBLENBQUE2QyxhQUFBLENBQUNvTix1REFBWTtJQUNYK0MsU0FBUyxFQUFFckIsaUJBQWtCO0lBQzdCbk8sT0FBTyxFQUFFQSxDQUFBLEtBQU07TUFDYixJQUFJLENBQUNnTyxXQUFXLElBQUksQ0FBQ0UsUUFBUSxFQUFFRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7SUFDM0QsQ0FBRTtJQUNGcE0sT0FBTyxFQUFFQSxDQUFBLEtBQU1vTSxvQkFBb0IsQ0FBQyxLQUFLLENBQUU7SUFDM0NxQixnQkFBZ0IsRUFBRXZMLEdBQUk7SUFDdEJtSyxrQkFBa0IsRUFBRUE7RUFBbUIsZ0JBRXZDN1IsS0FBQSxDQUFBNkMsYUFBQSxDQUFDME4sUUFBUTtJQUNQek0sS0FBSyxFQUFFNk4saUJBQWlCLEdBQUcsTUFBTSxHQUFHN04sS0FBTTtJQUMxQ0ksTUFBTSxFQUFFeU4saUJBQWlCLEdBQUcsTUFBTSxHQUFHek4sTUFBTztJQUM1QzBPLEdBQUcsRUFBRWxMLEdBQUk7SUFDVDhJLFFBQVEsRUFBRUEsUUFBUztJQUNuQkMsU0FBUyxFQUFFQSxTQUFVO0lBQ3JCVSxLQUFLLEVBQUVBLEtBQU07SUFDYkwsZUFBZSxFQUFFLENBQUNhLGlCQUFrQjtJQUNwQ1osWUFBWSxFQUFFQSxZQUFhO0lBQzNCQyxXQUFXLEVBQUVTLGdCQUFpQjtJQUM5QnlCLE1BQU0sRUFBR0MsS0FBSyxJQUFLO01BQ2pCLE1BQU1DLFlBQVksR0FBR0QsS0FBSyxDQUFDalEsTUFBTTtNQUNqQyxJQUFJa1EsWUFBWSxZQUFZQyxnQkFBZ0IsRUFBRTtRQUM1Q3JELG1EQUFXLENBQUNvRCxZQUFZLEVBQUdFLE1BQU0sSUFBSztVQUNwQ3hCLHFCQUFxQixDQUFDd0IsTUFBTSxDQUFDO1FBQy9CLENBQUMsQ0FBQztNQUNKO01BQ0F0QixpQkFBaUIsQ0FBQyxJQUFJLENBQUM7SUFDekIsQ0FBRTtJQUNGdUIsT0FBTyxFQUFFQSxDQUFBLEtBQU12QixpQkFBaUIsQ0FBQyxJQUFJO0VBQUUsRUFDdkMsQ0FFTCxDQUNLO0FBRVo7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbE5xQztBQUNvQjtBQVVsRCxTQUFTL0IsWUFBWUEsQ0FBQztFQUMzQitDLFNBQVM7RUFDVHhQLE9BQU87RUFDUGdDLE9BQU87RUFDUHlOLGdCQUFnQjtFQUNoQnBCLGtCQUFrQjtFQUNsQjhCO0FBQ29DLENBQUMsRUFBRTtFQUN2QyxJQUFJWCxTQUFTLEVBQUU7SUFDYixvQkFDRWhULEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzRCLG1FQUFPLHFCQUNOekUsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMlEsNERBQUc7TUFDRjFRLEVBQUUsRUFBRTtRQUNGQyxRQUFRLEVBQUUsVUFBVTtRQUNwQjZRLEdBQUcsRUFBRSxDQUFDO1FBQ05DLElBQUksRUFBRSxDQUFDO1FBQ1AvUCxLQUFLLEVBQUUsTUFBTTtRQUNiSSxNQUFNLEVBQUUsTUFBTTtRQUNkNFAsZUFBZSxFQUFHLE9BQU1iLGdCQUFpQixHQUFFO1FBQzNDYyxjQUFjLEVBQUUsT0FBTztRQUN2QkMsZ0JBQWdCLEVBQUUsV0FBVztRQUM3QkMsTUFBTSxFQUFFO01BQ1Y7SUFBRSxFQUNGLGVBQ0ZqVSxLQUFBLENBQUE2QyxhQUFBLENBQUMxQyw4REFBSztNQUNKMkMsRUFBRSxFQUFFO1FBQ0ZvQixNQUFNLEVBQUUsTUFBTTtRQUNkSixLQUFLLEVBQUU7TUFDVDtJQUFFLGdCQUVGOUQsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsOERBQUs7TUFDSjJDLEVBQUUsRUFBRTtRQUNGMEIsRUFBRSxFQUFFLENBQUM7UUFDTEQsRUFBRSxFQUFFLENBQUM7UUFDTDJOLFVBQVUsRUFBRTtNQUNkO0lBQUUsZ0JBRUZsUyxLQUFBLENBQUE2QyxhQUFBLENBQUM2USxtRUFBVTtNQUNUbFEsT0FBTyxFQUFFZ0MsT0FBUTtNQUNqQixlQUFZLHdCQUF3QjtNQUNwQzBPLGFBQWE7TUFDYnBSLEVBQUUsRUFBRTtRQUNGc0IsQ0FBQyxFQUFFO01BQ0w7SUFBRSxnQkFFRnBFLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzRRLHdFQUFlO01BQ2R4UCxJQUFJLEVBQUUsRUFBRztNQUNUbkIsRUFBRSxFQUFFO1FBQ0ZzRixLQUFLLEVBQUV5SixrQkFBa0IsR0FDckIsZUFBZSxHQUNmO01BQ047SUFBRSxFQUNGLENBQ1MsQ0FDUCxFQUNQOEIsUUFBUSxDQUNILENBQ0E7RUFFZDtFQUNBLG9CQUNFM1QsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsOERBQUs7SUFBQ3FELE9BQU8sRUFBRUEsT0FBUTtJQUFDVixFQUFFLEVBQUU7TUFBRWdCLEtBQUssRUFBRSxNQUFNO01BQUVtTyxhQUFhLEVBQUU7SUFBTTtFQUFFLEdBQ2xFMEIsUUFBUSxDQUNIO0FBRVo7Ozs7Ozs7Ozs7Ozs7OztBQ2pGTyxNQUFNNUQsT0FBTyxHQUFJckksR0FBWSxJQUNsQ0EsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzVHLFFBQVEsQ0FBQzRHLEdBQUcsQ0FBQ3lNLEtBQUssQ0FBQ3pNLEdBQUcsQ0FBQzBNLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRXJFLE1BQU1wRSxXQUFXLEdBQUdBLENBQ3pCcUUsR0FBcUIsRUFDckJDLFFBQThCLEtBQzNCO0VBQ0gsSUFBSUMsUUFBUSxHQUFHLENBQUM7RUFFaEIsSUFBSSxDQUFDRixHQUFHLEVBQUU7SUFDUjtJQUNBLE9BQU9DLFFBQVEsQ0FBQyxJQUFJLENBQUM7RUFDdkI7RUFFQSxJQUFJO0lBQ0YsTUFBTUUsTUFBTSxHQUFHOVEsUUFBUSxDQUFDYixhQUFhLENBQUMsUUFBUSxDQUFDO0lBQy9DLE1BQU00UixHQUFHLEdBQUdELE1BQU0sQ0FBQ0UsVUFBVSxDQUFDLElBQUksQ0FBQztJQUVuQyxJQUFJLENBQUNELEdBQUcsRUFBRTtNQUNSO01BQ0EsT0FBT0gsUUFBUSxDQUFDLElBQUksQ0FBQztJQUN2QjtJQUVBRyxHQUFHLENBQUNFLFNBQVMsQ0FBQ04sR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7O0lBRXhCO0lBQ0EsTUFBTW5RLE1BQU0sR0FBR21KLElBQUksQ0FBQ3VILEtBQUssQ0FBQ0osTUFBTSxDQUFDdFEsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM1QyxNQUFNSixLQUFLLEdBQUd1SixJQUFJLENBQUN1SCxLQUFLLENBQUNKLE1BQU0sQ0FBQzFRLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDMUMsTUFBTStRLFNBQVMsR0FBR0osR0FBRyxDQUFDSyxZQUFZLENBQUNoUixLQUFLLEVBQUUsQ0FBQyxFQUFFQSxLQUFLLEVBQUVJLE1BQU0sQ0FBQztJQUMzRCxNQUFNbUcsSUFBSSxHQUFHd0ssU0FBUyxDQUFDeEssSUFBSTtJQUUzQixLQUFLLElBQUkwSyxDQUFDLEdBQUcsQ0FBQyxFQUFFQyxHQUFHLEdBQUczSyxJQUFJLENBQUNoSSxNQUFNLEVBQUUwUyxDQUFDLEdBQUdDLEdBQUcsRUFBRUQsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNsRCxNQUFNRSxDQUFDLEdBQUc1SyxJQUFJLENBQUMwSyxDQUFDLENBQUM7TUFDakIsTUFBTUcsQ0FBQyxHQUFHN0ssSUFBSSxDQUFDMEssQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNyQixNQUFNSSxDQUFDLEdBQUc5SyxJQUFJLENBQUMwSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BRXJCLElBQUlFLENBQUMsS0FBS25ULFNBQVMsSUFBSW9ULENBQUMsS0FBS3BULFNBQVMsSUFBSXFULENBQUMsS0FBS3JULFNBQVMsRUFBRTtRQUN6RCxNQUFNLElBQUltTCxLQUFLLENBQUMsaUJBQWlCLENBQUM7TUFDcEM7TUFFQSxNQUFNbUksR0FBRyxHQUFHL0gsSUFBSSxDQUFDdUgsS0FBSyxDQUFDLENBQUNLLENBQUMsR0FBR0MsQ0FBQyxHQUFHQyxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ3ZDWixRQUFRLElBQUlhLEdBQUc7SUFDakI7SUFFQSxNQUFNQyxVQUFVLEdBQUdoSSxJQUFJLENBQUN1SCxLQUFLLENBQUNMLFFBQVEsSUFBSXpRLEtBQUssR0FBR0ksTUFBTSxDQUFDLENBQUM7SUFDMUQ7SUFDQSxPQUFPb1EsUUFBUSxDQUFDZSxVQUFVLEdBQUcsS0FBSyxDQUFDO0VBQ3JDLENBQUMsQ0FBQyxNQUFNO0lBQ047SUFDQSxPQUFPZixRQUFRLENBQUMsSUFBSSxDQUFDO0VBQ3ZCO0FBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkQrQjtBQUV3QztBQUNKO0FBQ1k7QUFJekUsTUFBTWtCLDZCQUE2QixHQUFHQSxDQUMzQ0MsY0FBYyxHQUFHLEtBQUssS0FDQTtFQUN0QixNQUFNO0lBQUVDLE9BQU87SUFBRUM7RUFBZ0IsQ0FBQyxHQUFHTCxzRkFBb0IsRUFBRTtFQUMzRCxNQUFNO0lBQUVNLFFBQVEsRUFBRUMsY0FBYztJQUFFck47RUFBa0IsQ0FBQyxHQUFHbkMsa0ZBQWtCLEVBQUU7RUFDNUUsTUFBTXlQLGlCQUFpQixHQUFHbk0sOENBQU8sQ0FDL0IsTUFBTTRMLDhGQUFvQixDQUFDRSxjQUFjLENBQUMsRUFDMUMsQ0FBQ0EsY0FBYyxDQUFDLENBQ2pCO0VBQ0QsTUFBTU0sVUFBVSxHQUFHcE0sOENBQU8sQ0FDeEIsTUFBTWdNLGVBQWUsQ0FBQ0YsY0FBYyxFQUFFSSxjQUFjLENBQUMsRUFDckQsQ0FBQ0osY0FBYyxFQUFFSSxjQUFjLEVBQUVGLGVBQWUsQ0FBQyxDQUNsRDtFQUNELE1BQU1LLGVBQWUsR0FBR0QsVUFBVSxJQUFJRixjQUFjLEtBQUtKLGNBQWM7RUFFdkUsT0FBTzlMLDhDQUFPLENBQUMsTUFBTTtJQUNuQixJQUFJLENBQUNxTSxlQUFlLEVBQUU7TUFDcEIsT0FBT0YsaUJBQWlCO0lBQzFCO0lBRUEsT0FBUTdVLEtBQWEsSUFBSztNQUN4QixNQUFNZ1YsU0FBUyxHQUFHUCxPQUFPLENBQUM7UUFDeEJuVCxNQUFNLEVBQUV0QixLQUFLO1FBQ2JpVixJQUFJLEVBQUVULGNBQWM7UUFDcEJVLEVBQUUsRUFBRU47TUFDTixDQUFDLENBQVc7TUFFWixPQUFPck4saUJBQWlCLENBQUN5TixTQUFTLENBQUM7SUFDckMsQ0FBQztFQUNILENBQUMsRUFBRSxDQUNEUCxPQUFPLEVBQ1BsTixpQkFBaUIsRUFDakJzTixpQkFBaUIsRUFDakJFLGVBQWUsRUFDZlAsY0FBYyxFQUNkSSxjQUFjLENBQ2YsQ0FBQztBQUNKLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkNvQztBQU85QixTQUFTVyxRQUFRQSxDQUFDO0VBQUV6UixLQUFLO0VBQUVVO0FBQW9CLENBQUMsRUFBRTtFQUN2RCxNQUFNaUwsS0FBSyxHQUFHNEYsdUVBQVEsRUFBRTtFQUV4QixvQkFDRXRXLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3VULDhEQUFLO0lBQ0pLLFFBQVEsRUFBQyxPQUFPO0lBQ2hCQyxJQUFJLGVBQ0YxVyxLQUFBLENBQUE2QyxhQUFBLENBQUMwVCw0RUFBbUI7TUFBQ3RTLElBQUksRUFBRSxFQUFHO01BQUNtRSxLQUFLLEVBQUVzSSxLQUFLLENBQUNDLE9BQU8sQ0FBQ0MsTUFBTSxDQUFDQztJQUFNLEVBQ2xFO0lBQ0QvTixFQUFFLEVBQUU7TUFDRjBQLGVBQWUsRUFBRSxhQUFhO01BQzlCbUUsV0FBVyxFQUFFLGFBQWE7TUFDMUJuUyxFQUFFLEVBQUUsQ0FBQztNQUNMNEQsS0FBSyxFQUFFLGNBQWM7TUFDckJ0RSxLQUFLLEVBQUU7SUFDVDtFQUFFLGdCQUVGOUQsS0FBQSxDQUFBNkMsYUFBQSxDQUFDd1QscUVBQVkscUJBQ1hyVyxLQUFBLENBQUE2QyxhQUFBLENBQUNvRCxtRUFBVTtJQUNUOUIsT0FBTyxFQUFDLFNBQVM7SUFDakJyQixFQUFFLEVBQUU7TUFBRXFHLFVBQVUsRUFBRSxHQUFHO01BQUVoQixPQUFPLEVBQUU7SUFBUTtFQUFFLEdBRXpDcEQsS0FBSyxDQUNLLGVBQ2IvRSxLQUFBLENBQUE2QyxhQUFBLENBQUNvRCxtRUFBVTtJQUFDOUIsT0FBTyxFQUFDLFNBQVM7SUFBQ3JCLEVBQUUsRUFBRTtNQUFFcUYsT0FBTyxFQUFFO0lBQVE7RUFBRSxHQUNwRDFDLElBQUksQ0FDTSxDQUNBLENBQ1Q7QUFFWjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQ3FDO0FBWTlCLFNBQVNkLFdBQVdBLENBQUM7RUFDMUJNLGFBQWE7RUFDYk0sSUFBSTtFQUNKQyxPQUFPO0VBQ1BULEtBQUs7RUFDTFUsSUFBSTtFQUNKRyxXQUFXO0VBQ1hGO0FBQ2dCLENBQUMsRUFBRTtFQUNuQixNQUFNZ0wsS0FBSyxHQUFHNEYsdUVBQVEsRUFBRTtFQUN4QixvQkFDRXRXLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQytULCtEQUFNO0lBQ0xyUixJQUFJLEVBQUVBLElBQUs7SUFDWHNSLGFBQWE7SUFDYnJSLE9BQU8sRUFBRUEsT0FBUTtJQUNqQnNSLFVBQVUsRUFBRTtNQUNWaFUsRUFBRSxFQUFFO1FBQ0ZpVSxDQUFDLEVBQUUsQ0FBQztRQUNKalQsS0FBSyxFQUFFLENBQUM7UUFDUkksTUFBTSxFQUFFLENBQUM7UUFDVHNNLFFBQVEsRUFBRSxNQUFNO1FBQ2hCek4sUUFBUSxFQUFFO01BQ1o7SUFDRjtFQUFFLGdCQUVGL0MsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsOERBQUs7SUFDSjJDLEVBQUUsRUFBRTtNQUNGeUIsRUFBRSxFQUFFLENBQUM7TUFDTEMsRUFBRSxFQUFFLENBQUM7TUFDTDBOLFVBQVUsRUFBRSxRQUFRO01BQ3BCN04sY0FBYyxFQUFFLGVBQWU7TUFDL0JILE1BQU0sRUFBRTtJQUNWO0VBQUUsZ0JBRUZsRSxLQUFBLENBQUE2QyxhQUFBLENBQUMxQyw4REFBSztJQUNKMkMsRUFBRSxFQUFFO01BQ0ZvUCxVQUFVLEVBQUUsUUFBUTtNQUNwQjdOLGNBQWMsRUFBRSxRQUFRO01BQ3hCNkUsU0FBUyxFQUFFLFFBQVE7TUFDbkJwRixLQUFLLEVBQUUsT0FBTztNQUNkbUUsR0FBRyxFQUFFLEdBQUc7TUFDUjFELEVBQUUsRUFBRTtJQUNOO0VBQUUsZ0JBRUZ2RSxLQUFBLENBQUE2QyxhQUFBLENBQUMwVCw0RUFBbUI7SUFDbEJ0UyxJQUFJLEVBQUUsRUFBRztJQUNUbUUsS0FBSyxFQUFFc0ksS0FBSyxDQUFDc0csYUFBYSxDQUFDQztFQUFhLEVBQ3hDLGVBQ0ZqWCxLQUFBLENBQUE2QyxhQUFBLENBQUNvRCxtRUFBVTtJQUNUbkQsRUFBRSxFQUFFO01BQUVzRixLQUFLLEVBQUVzSSxLQUFLLENBQUNzRyxhQUFhLENBQUNDLFlBQVk7TUFBRXpTLEVBQUUsRUFBRTtJQUFFLENBQUU7SUFDdkRMLE9BQU8sRUFBQztFQUFJLEdBRVhZLEtBQUssQ0FDSyxlQUNiL0UsS0FBQSxDQUFBNkMsYUFBQSxDQUFDb0QsbUVBQVU7SUFBQzlCLE9BQU8sRUFBQztFQUFPLEdBQUVzQixJQUFJLENBQWMsQ0FDekMsZUFDUnpGLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLO0lBQ0oyQyxFQUFFLEVBQUU7TUFDRm9QLFVBQVUsRUFBRSxRQUFRO01BQ3BCcE8sS0FBSyxFQUFFLE1BQU07TUFDYm1FLEdBQUcsRUFBRTtJQUNQO0VBQUUsZ0JBRUZqSSxLQUFBLENBQUE2QyxhQUFBLENBQUN2QywrREFBTTtJQUNMOEgsS0FBSyxFQUFDLFNBQVM7SUFDZixlQUFZLG9CQUFvQjtJQUNoQzVFLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO01BQ2J5QixhQUFhLEVBQUU7SUFDakIsQ0FBRTtJQUNGeEQsU0FBUztJQUNUd0MsSUFBSSxFQUFDO0VBQU8sR0FFWDJCLFdBQVcsQ0FDTCxlQUNUNUYsS0FBQSxDQUFBNkMsYUFBQSxDQUFDdkMsK0RBQU07SUFDTCxlQUFZLHFCQUFxQjtJQUNqQ2tELE9BQU8sRUFBRWdDLE9BQVE7SUFDakIvRCxTQUFTO0lBQ1R3QyxJQUFJLEVBQUMsT0FBTztJQUNabUUsS0FBSyxFQUFDO0VBQVcsR0FFaEIxQyxZQUFZLENBQ04sQ0FDSCxDQUNGLENBQ0Q7QUFFYjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwR3FDO0FBTzlCLFNBQVN5UixVQUFVQSxDQUFDO0VBQUVwUyxLQUFLO0VBQUVVO0FBQXNCLENBQUMsRUFBRTtFQUMzRCxNQUFNaUwsS0FBSyxHQUFHNEYsdUVBQVEsRUFBRTtFQUN4QixvQkFDRXRXLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3VULDhEQUFLO0lBQ0pLLFFBQVEsRUFBQyxTQUFTO0lBQ2xCQyxJQUFJLGVBQUUxVyxLQUFBLENBQUE2QyxhQUFBLENBQUNxVSxxRUFBWTtNQUFDalQsSUFBSSxFQUFFLEVBQUc7TUFBQ21FLEtBQUssRUFBRXNJLEtBQUssQ0FBQ0MsT0FBTyxDQUFDQyxNQUFNLENBQUNDO0lBQU0sRUFBSTtJQUNwRS9OLEVBQUUsRUFBRTtNQUNGMFAsZUFBZSxFQUFFLGVBQWU7TUFDaENtRSxXQUFXLEVBQUUsYUFBYTtNQUMxQm5TLEVBQUUsRUFBRSxDQUFDO01BQ0w0RCxLQUFLLEVBQUUsY0FBYztNQUNyQnRFLEtBQUssRUFBRTtJQUNUO0VBQUUsZ0JBRUY5RCxLQUFBLENBQUE2QyxhQUFBLENBQUN3VCxxRUFBWSxxQkFDWHJXLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ29ELG1FQUFVO0lBQ1Q5QixPQUFPLEVBQUMsU0FBUztJQUNqQnJCLEVBQUUsRUFBRTtNQUFFcUcsVUFBVSxFQUFFLEdBQUc7TUFBRWhCLE9BQU8sRUFBRTtJQUFRO0VBQUUsR0FFekNwRCxLQUFLLENBQ0ssZUFDYi9FLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ29ELG1FQUFVO0lBQUM5QixPQUFPLEVBQUMsU0FBUztJQUFDckIsRUFBRSxFQUFFO01BQUVxRixPQUFPLEVBQUU7SUFBUTtFQUFFLEdBQ3BEMUMsSUFBSSxDQUNNLENBQ0EsQ0FDVDtBQUVaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ3FDO0FBQ2tEO0FBSXZEO0FBYXpCLE1BQU0rUixZQUFZLEdBQUdBLENBQUM7RUFDM0I1TyxLQUFLO0VBQ0w2TyxTQUFTO0VBQ1R0VDtBQUNpQixDQUFDLEtBQUs7RUFDdkIsSUFBSSxDQUFDc1QsU0FBUyxDQUFDcFYsTUFBTSxFQUFFO0lBQ3JCLE9BQU8sSUFBSTtFQUNiO0VBRUEsb0JBQ0VyQyxLQUFBLENBQUE2QyxhQUFBLENBQUN1VSxrRUFBUztJQUFDdFUsRUFBRSxFQUFFO01BQUU0VSxNQUFNLEVBQUUsTUFBTTtNQUFFdFQsQ0FBQyxFQUFFLENBQUM7TUFBRTJTLENBQUMsRUFBRSxDQUFDO01BQUV6RSxFQUFFLEVBQUUsQ0FBQztJQUFFO0VBQUUsZ0JBQ3BEdFMsS0FBQSxDQUFBNkMsYUFBQSxDQUFDd1UseUVBQWdCO0lBQUN2VSxFQUFFLEVBQUU7TUFBRXNCLENBQUMsRUFBRSxDQUFDO01BQUUyUyxDQUFDLEVBQUU7SUFBRTtFQUFFLGdCQUNuQy9XLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLO0lBQ0oyQyxFQUFFLEVBQUU7TUFDRnVCLGNBQWMsRUFBRSxlQUFlO01BQy9CNk4sVUFBVSxFQUFFLFFBQVE7TUFDcEJELGFBQWEsRUFBRSxLQUFLO01BQ3BCMEYsRUFBRSxFQUFFLENBQUM7SUFDUDtFQUFFLGdCQUVGM1gsS0FBQSxDQUFBNkMsYUFBQSxDQUFDcU8saUdBQWdCO0lBQ2ZoTixNQUFNLEVBQUMsTUFBTTtJQUNiSixLQUFLLEVBQUMsTUFBTTtJQUNaME0sUUFBUSxFQUFDLE1BQU07SUFDZjlJLEdBQUcsRUFBRWtCLEtBQUssQ0FBQ2dQLE9BQVE7SUFDbkJ6RyxLQUFLLEVBQUUsS0FBTTtJQUNiRSxZQUFZLEVBQUU7RUFBTSxFQUNwQixlQUNGclIsS0FBQSxDQUFBNkMsYUFBQSxDQUFDb0QsbUVBQVU7SUFDVDlCLE9BQU8sRUFBQyxJQUFJO0lBQ1pnRixVQUFVLEVBQUMsb0JBQW9CO0lBQy9CckcsRUFBRSxFQUFFO01BQUU2VSxFQUFFLEVBQUU7SUFBRTtFQUFFLEdBRWIvTyxLQUFLLENBQUNLLElBQUksRUFBQyxHQUFDLEVBQUN3TyxTQUFTLENBQUNwVixNQUFNLEdBQUksSUFBR29WLFNBQVMsQ0FBQ3BWLE1BQU8sR0FBRSxHQUFHLEVBQUUsQ0FDbEQsQ0FDUCxDQUNTLGVBRW5CckMsS0FBQSxDQUFBNkMsYUFBQSxDQUFDeVUseUVBQWdCO0lBQUN4VSxFQUFFLEVBQUU7TUFBRTRVLE1BQU0sRUFBRSxNQUFNO01BQUV0VCxDQUFDLEVBQUU7SUFBRTtFQUFFLGdCQUM3Q3BFLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLO0lBQUMyQyxFQUFFLEVBQUU7TUFBRW1GLEdBQUcsRUFBRTtJQUFJO0VBQUUsR0FDckJ3UCxTQUFTLENBQUNJLEdBQUcsQ0FBQyxDQUFDaFIsSUFBSSxFQUFFaVIsS0FBSyxrQkFDekI5WCxLQUFBLENBQUE2QyxhQUFBLENBQUMwVSx1RUFBb0I7SUFDbkJqVSxHQUFHLEVBQUcsZUFBY2EsT0FBUSxJQUMxQixTQUFTLElBQUl5RSxLQUFLLEdBQUdBLEtBQUssQ0FBQ0wsT0FBTyxHQUFHSyxLQUFLLENBQUNFLE1BQzVDLElBQUdnUCxLQUFNLEVBQUU7SUFDWmxQLEtBQUssRUFBRUEsS0FBTTtJQUNibVAsUUFBUSxFQUFFbFIsSUFBSztJQUNmMUMsT0FBTyxFQUFFQSxPQUFRO0lBQ2pCckIsRUFBRSxFQUFFO01BQUVzQixDQUFDLEVBQUU7SUFBRTtFQUFFLEVBRWhCLENBQUMsQ0FDSSxDQUNTLENBQ1Q7QUFFaEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0UyQztBQUNYO0FBVUk7QUFDaUI7QUFFRztBQUNJO0FBRVA7QUFHdEQsTUFBTW1VLGdCQUFnQixHQUFHQSxDQUFDO0VBQUU5USxLQUFLO0VBQUV4RyxLQUFLO0VBQUV1WCxPQUFPO0VBQUUsR0FBRzdXO0FBQU0sQ0FBQyxrQkFDM0QzQixLQUFBLENBQUE2QyxhQUFBLENBQUNvVix5RUFBZ0IsRUFBQWpWLDBFQUFBO0VBQ2Z5RSxLQUFLLEVBQUVBLEtBQU07RUFDYnhHLEtBQUssRUFBRUEsS0FBTTtFQUNid1gsT0FBTyxlQUFFelksS0FBQSxDQUFBNkMsYUFBQSxDQUFDcVYsOERBQUs7SUFBQ2pVLElBQUksRUFBQyxRQUFRO0lBQUNtRSxLQUFLLEVBQUVvUSxPQUFPLEdBQUcsV0FBVyxHQUFHO0VBQVUsRUFBSTtFQUMzRTFWLEVBQUUsRUFBRTtJQUNGLDRCQUE0QixFQUFFO01BQzVCNFYsUUFBUSxFQUFFLGdCQUFnQjtNQUMxQnZQLFVBQVUsRUFBRXFQLE9BQU8sR0FBRyxvQkFBb0IsR0FBRztJQUMvQztFQUNGO0FBQUUsR0FDRTdXLEtBQUssRUFFWjtBQUVNLFNBQVNnWCxnQkFBZ0JBLENBQUM7RUFDL0JDLFVBQVU7RUFDVmhRLEtBQUs7RUFDTHBELE9BQU87RUFDUHFULGFBQWE7RUFDYkMsc0JBQXNCO0VBQ3RCQztBQVFGLENBQUMsRUFBRTtFQUNELE1BQU07SUFBRTFUO0VBQUUsQ0FBQyxHQUFHVCw2REFBYyxFQUFFO0VBQzlCLE1BQU04TCxLQUFLLEdBQUc0Rix1RUFBUSxFQUFFO0VBQ3hCLE1BQU0sQ0FBQzBDLGdCQUFnQixFQUFFQyxtQkFBbUIsQ0FBQyxHQUFHL1ksK0NBQVEsQ0FBYTtJQUNuRSxHQUFHMFk7RUFDTCxDQUFDLENBQUM7RUFFRixNQUFNTSxZQUFZLEdBQUdBLENBQUEsS0FBTTtJQUN6QkwsYUFBYSxDQUFDRyxnQkFBZ0IsQ0FBQztJQUMvQnhULE9BQU8sRUFBRTtFQUNYLENBQUM7RUFFRCxNQUFNMlQsZUFBZSxHQUFHSixJQUFJLEVBQUVLLE1BQU0sS0FBS3BCLHlFQUFrQjtFQUMzRCxNQUFNcUIsT0FBTyxHQUNYLENBQUNGLGVBQWUsR0FDWm5CLGdGQUEyQixFQUFFLENBQUN1QixVQUFVLEdBQ3hDUixJQUFJLEVBQUVLLE1BQU0sS0FBSy9ULENBQUMsQ0FBQyxjQUFjLENBQUM7RUFFeEMsb0JBQ0VyRixLQUFBLENBQUE2QyxhQUFBLENBQUMxQyw4REFBSztJQUFDMkMsRUFBRSxFQUFFO01BQUVnQixLQUFLLEVBQUUsTUFBTTtNQUFFbUUsR0FBRyxFQUFFO0lBQUU7RUFBRSxnQkFDbkNqSSxLQUFBLENBQUE2QyxhQUFBLENBQUN3Vix1RUFBUztJQUFDbUIsV0FBVyxFQUFFQSxDQUFBLEtBQU1oVSxPQUFPLEVBQUc7SUFBQzRMLE1BQU0sRUFBQztFQUFHLEdBQ2hEL0wsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQ2YsZUFFWnJGLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLO0lBQUMyQyxFQUFFLEVBQUU7TUFBRTBCLEVBQUUsRUFBRSxDQUFDO01BQUV5RCxHQUFHLEVBQUU7SUFBRTtFQUFFLGdCQUMzQmpJLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLO0lBQUMyQyxFQUFFLEVBQUU7TUFBRW1GLEdBQUcsRUFBRSxHQUFHO01BQUV1SSxRQUFRLEVBQUU7SUFBRTtFQUFFLGdCQUNuQ3hRLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ29ELG1FQUFVO0lBQ1RuRCxFQUFFLEVBQUU7TUFDRjRWLFFBQVEsRUFBRSxnQkFBZ0I7TUFDMUJ2UCxVQUFVLEVBQUU7SUFDZDtFQUFFLEdBRUQ5RCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FDVCxlQUNickYsS0FBQSxDQUFBNkMsYUFBQSxDQUFDb0QsbUVBQVU7SUFDVDlCLE9BQU8sRUFBQyxPQUFPO0lBQ2ZyQixFQUFFLEVBQUU7TUFDRm9HLFNBQVMsRUFBRSxRQUFRO01BQ25Cc0gsUUFBUSxFQUFFLENBQUM7TUFDWGlKLFFBQVEsRUFBRSxZQUFZO01BQ3RCclIsS0FBSyxFQUFFO0lBQ1Q7RUFBRSxnQkFFRnBJLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3VWLGdEQUFLO0lBQ0pzQixPQUFPLEVBQUMsMkVBQTJFO0lBQ25GdEssTUFBTSxFQUFFO01BQUVnSyxNQUFNLEVBQUVDO0lBQVEsQ0FBRTtJQUM1Qk0sVUFBVSxFQUFFO01BQ1Z4RSxDQUFDLGVBQUVuVixLQUFBLENBQUE2QyxhQUFBO1FBQUcrVyxLQUFLLEVBQUU7VUFBRXhSLEtBQUssRUFBRXNJLEtBQUssQ0FBQ0MsT0FBTyxDQUFDbEwsSUFBSSxDQUFDb1U7UUFBUTtNQUFFO0lBQ3JEO0VBQUUsRUFDRixDQUNTLENBQ1AsZUFDUjdaLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3NWLG1FQUFVO0lBQ1RyVixFQUFFLEVBQUU7TUFBRW1GLEdBQUcsRUFBRTtJQUFFLENBQUU7SUFDZjlHLFFBQVEsRUFBRUEsQ0FBQzJZLEdBQUcsRUFBRUMsU0FBUyxLQUFLO01BQzVCZCxtQkFBbUIsQ0FBQztRQUNsQixHQUFHRCxnQkFBZ0I7UUFDbkJlLFNBQVMsRUFBRUE7TUFDYixDQUFDLENBQUM7SUFDSixDQUFFO0lBQ0Y5WSxLQUFLLEVBQUUrWCxnQkFBZ0IsQ0FBQ2U7RUFBVSxnQkFFbEMvWixLQUFBLENBQUE2QyxhQUFBLENBQUMwVixnQkFBZ0I7SUFDZjlRLEtBQUssRUFBRXBDLENBQUMsQ0FBQyxXQUFXLENBQUU7SUFDdEJwRSxLQUFLLEVBQUVxWCw2REFBZ0I7SUFDdkJFLE9BQU8sRUFBRVEsZ0JBQWdCLENBQUNlLFNBQVMsS0FBS3pCLDZEQUFlMEI7RUFBQyxFQUN4RCxlQUNGaGEsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsOERBQUs7SUFBQzJDLEVBQUUsRUFBRTtNQUFFbUYsR0FBRyxFQUFFO0lBQUk7RUFBRSxnQkFDdEJqSSxLQUFBLENBQUE2QyxhQUFBLENBQUMwVixnQkFBZ0I7SUFDZjlRLEtBQUssRUFBRXBDLENBQUMsQ0FBQyxTQUFTLENBQUU7SUFDcEJwRSxLQUFLLEVBQUVxWCwyREFBYztJQUNyQkUsT0FBTyxFQUFFUSxnQkFBZ0IsQ0FBQ2UsU0FBUyxLQUFLekIsMkRBQWEyQjtFQUFDLEVBQ3RELGVBQ0ZqYSxLQUFBLENBQUE2QyxhQUFBLENBQUMyUSw0REFBRztJQUFDMVEsRUFBRSxFQUFFO01BQUVvWCxFQUFFLEVBQUU7SUFBRTtFQUFFLGdCQUNqQmxhLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzdCLG1FQUFPO0lBQ05RLFFBQVE7SUFDUkUsYUFBYSxFQUFFLEtBQU07SUFDckJULEtBQUssRUFBRTZYLHNCQUFzQixJQUFJLEVBQUc7SUFDcEM1WCxZQUFZLEVBQUUwSCxLQUFLLENBQUN1UixRQUFTO0lBQzdCMVksU0FBUztFQUFBLEVBQ1QsQ0FDRSxDQUNBLGVBQ1J6QixLQUFBLENBQUE2QyxhQUFBLENBQUMxQyw4REFBSztJQUFDMkMsRUFBRSxFQUFFO01BQUVtRixHQUFHLEVBQUU7SUFBSTtFQUFFLGdCQUN0QmpJLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzBWLGdCQUFnQjtJQUNmOVEsS0FBSyxFQUFFcEMsQ0FBQyxDQUFDLG9CQUFvQixDQUFFO0lBQy9CcEUsS0FBSyxFQUFFcVgsMERBQWE7SUFDcEJFLE9BQU8sRUFBRVEsZ0JBQWdCLENBQUNlLFNBQVMsS0FBS3pCLDBEQUFZOEI7RUFBQyxFQUNyRCxlQUNGcGEsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMlEsNERBQUc7SUFBQzFRLEVBQUUsRUFBRTtNQUFFb1gsRUFBRSxFQUFFO0lBQUU7RUFBRSxnQkFDakJsYSxLQUFBLENBQUE2QyxhQUFBLENBQUM3QixtRUFBTztJQUNOVSxhQUFhLEVBQUUsS0FBTTtJQUNyQlAsUUFBUSxFQUFHRixLQUFLLElBQUs7TUFDbkJnWSxtQkFBbUIsQ0FBQztRQUNsQixHQUFHRCxnQkFBZ0I7UUFDbkIvWCxLQUFLLEVBQUVBLEtBQUssQ0FBQ3VCLE1BQU07UUFDbkJ1WCxTQUFTLEVBQUV6QiwwREFBWThCO01BQ3pCLENBQUMsQ0FBQztJQUNKLENBQUU7SUFDRmxaLFlBQVksRUFBRTBILEtBQUssQ0FBQ3VSLFFBQVM7SUFDN0J0VyxXQUFXLEVBQUV3QixDQUFDLENBQUMsZUFBZSxDQUFFO0lBQ2hDcEUsS0FBSyxFQUFFK1gsZ0JBQWdCLENBQUMvWCxLQUFLLElBQUksRUFBRyxDQUFDO0lBQUE7SUFDckNRLFNBQVM7RUFBQSxFQUNULENBQ0UsQ0FDQSxDQUNHLENBQ1AsZUFDUnpCLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLO0lBQ0oyQyxFQUFFLEVBQUU7TUFDRm1QLGFBQWEsRUFBRSxLQUFLO01BQ3BCb0ksSUFBSSxFQUFFLENBQUM7TUFDUG5JLFVBQVUsRUFBRSxVQUFVO01BQ3RCcE8sS0FBSyxFQUFFLE1BQU07TUFDYndXLEVBQUUsRUFBRSxDQUFDO01BQ0w5VixFQUFFLEVBQUUsQ0FBQztNQUNMK1YsRUFBRSxFQUFFO0lBQ047RUFBRSxnQkFFRnZhLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3ZDLCtEQUFNO0lBQUM4SCxLQUFLLEVBQUMsU0FBUztJQUFDbkUsSUFBSSxFQUFDLE9BQU87SUFBQ1QsT0FBTyxFQUFFMFYsWUFBYTtJQUFDelgsU0FBUztFQUFBLEdBQ2xFNEQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUNILENBQ0gsQ0FDRjtBQUVaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUtvRDtBQUNMO0FBVVU7QUFDTTtBQUV4RCxTQUFTcVYsYUFBYUEsQ0FBQztFQUM1QkM7QUFHRixDQUFDLEVBQUU7RUFDRCxNQUFNO0lBQUV0VjtFQUFFLENBQUMsR0FBR1QsNkRBQWMsRUFBRTtFQUU5QixvQkFDRTVFLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQTdDLEtBQUEsQ0FBQXNGLFFBQUEscUJBQ0V0RixLQUFBLENBQUE2QyxhQUFBLENBQUMxQyw4REFBSyxxQkFDSkgsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMlgsNEZBQWU7SUFBQzFYLEVBQUUsRUFBRTtNQUFFeVgsRUFBRSxFQUFFO0lBQUU7RUFBRSxnQkFDN0J2YSxLQUFBLENBQUE2QyxhQUFBLENBQUM0WCxrR0FBcUI7SUFDcEJoVCxLQUFLLEVBQUVwQyxDQUFDLENBQUMsYUFBYTtFQUFFLEVBQ0QsQ0FDVCxlQUVsQnJGLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzBVLHVFQUFvQjtJQUNuQjNPLEtBQUssRUFBRStSLFFBQVEsQ0FBQy9SLEtBQU07SUFDdEJtUCxRQUFRLEVBQUU7TUFDUjZDLFlBQVksRUFBRUQsUUFBUSxDQUFDMVosS0FBSyxJQUFJLEdBQUc7TUFDbkM0WixRQUFRLEVBQUVGLFFBQVEsQ0FBQ0U7SUFDckIsQ0FBRTtJQUNGL1gsRUFBRSxFQUFFO01BQUV5QixFQUFFLEVBQUU7SUFBRTtFQUFFLEVBQ2QsQ0FDSSxDQUNQO0FBRVA7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pDb0Q7QUFDSjtBQVFkO0FBSTNCLE1BQU13VyxjQUFjLEdBQUdBLENBQUM7RUFDN0JDLFNBQVM7RUFDVEMsVUFBVTtFQUNWck47QUFDbUIsQ0FBQyxLQUFLO0VBQ3pCLG9CQUNFNU4sS0FBQSxDQUFBNkMsYUFBQSxDQUFBN0MsS0FBQSxDQUFBc0YsUUFBQSxRQUNHMFYsU0FBUyxDQUFDbkQsR0FBRyxDQUFDLENBQUM4QyxRQUFRLEVBQUU3QyxLQUFLLEtBQUs7SUFDbEMsUUFBUTZDLFFBQVEsQ0FBQy9SLEtBQUssQ0FBQ3pGLElBQUk7TUFDekIsS0FBS3NHLHNFQUFnQjtNQUNyQixLQUFLQSx1RUFBaUI7UUFDcEIsb0JBQ0V6SixLQUFBLENBQUE2QyxhQUFBLENBQUM2WCx5REFBYTtVQUNacFgsR0FBRyxFQUFFd1UsS0FBTTtVQUNYNkMsUUFBUSxFQUNOQTtRQUdELEVBQ0Q7TUFHTixLQUFLbFIscUVBQWU7UUFDbEIsb0JBQ0V6SixLQUFBLENBQUE2QyxhQUFBLENBQUNpWSw2REFBZTtVQUNkeFgsR0FBRyxFQUFFd1UsS0FBTTtVQUNYbEssUUFBUSxFQUFFQSxRQUFTO1VBQ25CK00sUUFBUSxFQUNOQSxRQUdEO1VBQ0RVLFNBQVMsRUFBRXZELEtBQUssS0FBSyxDQUFFO1VBQ3ZCbUQsVUFBVSxFQUFFQTtRQUFXLEVBQ3ZCO01BR047UUFDRSxPQUFPLElBQUk7SUFBQztFQUVsQixDQUFDLENBQUMsQ0FDRDtBQUVQLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4RHdFO0FBQzFCO0FBSVU7QUFDWDtBQUNRO0FBQ1M7QUFDM0I7QUFNZ0I7QUFDVztBQUNTO0FBQ2tCO0FBR25GLElBQUszQyxLQUFLLDBCQUFMQSxLQUFLO0VBQUxBLEtBQUs7RUFBTEEsS0FBSztFQUFMQSxLQUFLO0VBQUEsT0FBTEEsS0FBSztBQUFBO0FBS1YsTUFBTWtELDJCQUEyQixHQUFHLFdBQVc7QUFPL0MsU0FBU1YsZUFBZUEsQ0FBQztFQUM5QmxOLFFBQVE7RUFDUitNLFFBQVE7RUFDUk0sVUFBVTtFQUNWSSxTQUFTLEdBQUc7QUFNZCxDQUFDLEVBQUU7RUFDRCxNQUFNO0lBQUVoVztFQUFFLENBQUMsR0FBR1QsNkRBQWMsRUFBRTtFQUM5QixNQUFNO0lBQUVtRztFQUFPLENBQUMsR0FBR3dRLDZFQUFnQixDQUFjM04sUUFBUSxDQUFDO0VBQzFELE1BQU07SUFBRXRDO0VBQVEsQ0FBQyxHQUFHdEIsc0ZBQW9CLEVBQUU7RUFDMUMsTUFBTSxDQUFDeVIsb0JBQW9CLEVBQUVDLHVCQUF1QixDQUFDLEdBQUd4YiwrQ0FBUSxDQUFDLEtBQUssQ0FBQztFQUN2RSxNQUFNLENBQUM4WSxnQkFBZ0IsRUFBRUMsbUJBQW1CLENBQUMsR0FBRy9ZLCtDQUFRLENBQWE7SUFDbkU2WixTQUFTLEVBQUV6QixLQUFLLENBQUMyQjtFQUNuQixDQUFDLENBQUM7RUFFRixNQUFNcEIsYUFBYSxHQUFHblAsa0RBQVcsQ0FDOUJpUyxlQUEyQixJQUFLO0lBQy9CLElBQUlDLFdBQVcsR0FBRyxFQUFFO0lBRXBCLElBQUlELGVBQWUsQ0FBQzVCLFNBQVMsS0FBS3pCLEtBQUssQ0FBQzBCLFNBQVMsRUFBRTtNQUNqRGYsbUJBQW1CLENBQUM7UUFDbEIsR0FBRzBDLGVBQWU7UUFDbEIxYSxLQUFLLEVBQUVhO01BQ1QsQ0FBQyxDQUFDO01BQ0Y4WixXQUFXLEdBQUdOLDhDQUFVO0lBQzFCLENBQUMsTUFBTTtNQUNMckMsbUJBQW1CLENBQUMwQyxlQUFlLENBQUM7TUFDcENDLFdBQVcsR0FDVEQsZUFBZSxDQUFDNUIsU0FBUyxLQUFLekIsS0FBSyxDQUFDOEIsTUFBTSxHQUNyQ3VCLGVBQWUsQ0FBQzFhLEtBQUssSUFBSSxFQUFFLEdBQzVCdUosTUFBTSxDQUFDbVEsUUFBUSxDQUFDMVosS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUNwQztJQUNBcUssT0FBTyxDQUE0QjtNQUNqQ3dDLE1BQU0sRUFBRTdELDBIQUFzQztNQUM5QytELE1BQU0sRUFBRSxDQUFDSixRQUFRLEVBQUU7UUFBRWlPLGFBQWEsRUFBRyxLQUFJRCxXQUFXLENBQUNsSixRQUFRLENBQUMsRUFBRSxDQUFFO01BQUUsQ0FBQztJQUN2RSxDQUFDLENBQUM7RUFDSixDQUFDLEVBQ0QsQ0FBQzlFLFFBQVEsRUFBRXRDLE9BQU8sRUFBRXFQLFFBQVEsQ0FBQzFaLEtBQUssQ0FBQyxDQUNwQztFQUVELE1BQU02YSxVQUFVLEdBQUc5QyxnQkFBZ0IsQ0FBQ2UsU0FBUyxLQUFLekIsS0FBSyxDQUFDMEIsU0FBUztFQUNqRSxNQUFNK0IsYUFBYSxHQUFHRCxVQUFVLEdBQzVCLElBQUksR0FDSixJQUFJM1YsOERBQVMsQ0FDWDZTLGdCQUFnQixDQUFDZSxTQUFTLEtBQUt6QixLQUFLLENBQUMyQixPQUFPLEdBQ3hDLE9BQU9VLFFBQVEsQ0FBQzFaLEtBQUssS0FBSyxRQUFRLEdBQ2hDdUosTUFBTSxDQUFDbVEsUUFBUSxDQUFDMVosS0FBSyxDQUFDLEdBQ3JCMFosUUFBUSxDQUFDMVosS0FBSyxJQUFJLEVBQUcsR0FDdkIrWCxnQkFBZ0IsQ0FBQy9YLEtBQUssSUFBSSxHQUFJLEVBQ25DMFosUUFBUSxDQUFDL1IsS0FBSyxDQUFDdVIsUUFBUSxFQUN2QixFQUFFLENBQ0g7RUFFTCxvQkFDRW5hLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQTdDLEtBQUEsQ0FBQXNGLFFBQUEscUJBQ0V0RixLQUFBLENBQUE2QyxhQUFBLENBQUMrVCxnRUFBTTtJQUFDb0YsVUFBVTtJQUFDelcsSUFBSSxFQUFFa1c7RUFBcUIsZ0JBQzVDemIsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMlEsNkRBQUc7SUFDRjFRLEVBQUUsRUFBRTtNQUNGcUYsT0FBTyxFQUFFLE1BQU07TUFDZjhULFFBQVEsRUFBRSxDQUFDO01BQ1gxWCxFQUFFLEVBQUU7SUFDTjtFQUFFLGdCQUVGdkUsS0FBQSxDQUFBNkMsYUFBQSxDQUFDOFYsK0RBQWdCO0lBQ2ZFLGFBQWEsRUFBRUEsYUFBYztJQUM3QkQsVUFBVSxFQUFFSSxnQkFBaUI7SUFDN0JGLHNCQUFzQixFQUFFdE8sTUFBTSxDQUFDbVEsUUFBUSxDQUFDMVosS0FBSyxJQUFJLEdBQUcsQ0FBRTtJQUN0RDhYLElBQUksRUFBRWhPLE1BQU0sRUFBRWdPLElBQUs7SUFDbkJuUSxLQUFLLEVBQUUrUixRQUFRLENBQUMvUixLQUFNO0lBQ3RCcEQsT0FBTyxFQUFFQSxDQUFBLEtBQU1rVyx1QkFBdUIsQ0FBQyxLQUFLO0VBQUUsRUFDOUMsQ0FDRSxDQUNDLGVBRVQxYixLQUFBLENBQUE2QyxhQUFBLENBQUMxQywrREFBSztJQUFDMkMsRUFBRSxFQUFFO01BQUVnQixLQUFLLEVBQUU7SUFBRTtFQUFFLEdBQ3JCdVgsU0FBUyxpQkFDUnJiLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzJYLDRGQUFlO0lBQUMxWCxFQUFFLEVBQUU7TUFBRXlYLEVBQUUsRUFBRTtJQUFFO0VBQUUsZ0JBQzdCdmEsS0FBQSxDQUFBNkMsYUFBQSxDQUFDNFgsa0dBQXFCO0lBQUNoVCxLQUFLLEVBQUVwQyxDQUFDLENBQUMsYUFBYTtFQUFFLEdBQzVDNFYsVUFBVSxJQUFJTixRQUFRLENBQUMxWixLQUFLLGlCQUMzQmpCLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ3ZDLGdFQUFNO0lBQ0w2RCxPQUFPLEVBQUMsTUFBTTtJQUNkaUUsS0FBSyxFQUFDLFdBQVc7SUFDakJuRSxJQUFJLEVBQUMsT0FBTztJQUNabkIsRUFBRSxFQUFFO01BQUUwQixFQUFFLEVBQUUsQ0FBQztNQUFFMFgsUUFBUSxFQUFFO0lBQU8sQ0FBRTtJQUNoQzFZLE9BQU8sRUFBRUEsQ0FBQSxLQUFNa1ksdUJBQXVCLENBQUMsSUFBSTtFQUFFLEdBRTVDclcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUViLENBQ3FCLENBRTNCLGVBQ0RyRixLQUFBLENBQUE2QyxhQUFBLENBQUMwVSx1RUFBb0I7SUFDbkJ6VSxFQUFFLEVBQUU7TUFBRXlCLEVBQUUsRUFBRTtJQUFFLENBQUU7SUFDZHFFLEtBQUssRUFBRTtNQUNMLEdBQUcrUixRQUFRLENBQUMvUixLQUFLO01BQ2pCZ1AsT0FBTyxFQUFFK0MsUUFBUSxDQUFDL0M7SUFDcEIsQ0FBRTtJQUNGRyxRQUFRLEVBQUU7TUFDUjZDLFlBQVksRUFBRWtCLFVBQVUsR0FDcEJ6VyxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQ2IwVyxhQUFhLENBQWUzUyxTQUFTLEVBQUU7TUFDNUN5UixRQUFRLEVBQUVGLFFBQVEsQ0FBQ0U7SUFDckI7RUFBRSxFQUNGLENBQ0ksQ0FDUDtBQUVQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUlxQztBQVFIO0FBQzJCO0FBQzBCO0FBQ2E7QUFDaEQ7QUFFN0MsSUFBS3lCLDJCQUEyQiwwQkFBM0JBLDJCQUEyQjtFQUEzQkEsMkJBQTJCO0VBQTNCQSwyQkFBMkI7RUFBM0JBLDJCQUEyQjtFQUFBLE9BQTNCQSwyQkFBMkI7QUFBQTtBQU12QyxNQUFNQyxVQUFVLEdBQ2QzVCxLQUEwQyxJQUUxQyxNQUFNLElBQUlBLEtBQUssS0FDZEEsS0FBSyxDQUFDekYsSUFBSSxLQUFLc0csdUVBQWlCLElBQUliLEtBQUssQ0FBQ3pGLElBQUksS0FBS3NHLHNFQUFnQixDQUFDO0FBRWhFLE1BQU04TixvQkFBb0IsR0FBR0EsQ0FBQztFQUNuQzNPLEtBQUs7RUFDTG1QLFFBQVE7RUFDUjVULE9BQU8sR0FBR21ZLDJCQUEyQixDQUFDckMsT0FBTztFQUM3Q25YLEVBQUUsR0FBRyxDQUFDO0FBTVIsQ0FBQyxLQUFLO0VBQ0osTUFBTTBGLGlCQUFpQixHQUFHZ04sa0hBQTZCLEVBQUU7RUFDekQsTUFBTSxDQUFDZ0gsZUFBZSxFQUFFQyxrQkFBa0IsQ0FBQyxHQUFHdmMsK0NBQVEsQ0FBQyxLQUFLLENBQUM7RUFFN0QsTUFBTXdjLGVBQWUsR0FBR0wsNkNBQU0sQ0FBa0IsSUFBSSxDQUFDO0VBRXJEcGMsZ0RBQVMsQ0FBQyxNQUFNO0lBQ2QsSUFBSTBjLGFBQWEsQ0FBQ0QsZUFBZSxDQUFDRSxPQUFPLENBQUMsRUFBRTtNQUMxQ0gsa0JBQWtCLENBQUMsSUFBSSxDQUFDO01BQ3hCO0lBQ0Y7SUFDQUEsa0JBQWtCLENBQUMsS0FBSyxDQUFDO0VBQzNCLENBQUMsRUFBRSxDQUFDQyxlQUFlLENBQUMsQ0FBQztFQUVyQixNQUFNQyxhQUFhLEdBQUlFLGFBQXFDLElBQWM7SUFDeEUsSUFBSUEsYUFBYSxFQUFFO01BQ2pCLE9BQ0VBLGFBQWEsQ0FBQ0MsWUFBWSxHQUFHRCxhQUFhLENBQUNFLFlBQVksSUFDdkRGLGFBQWEsQ0FBQ0csV0FBVyxHQUFHSCxhQUFhLENBQUNJLFdBQVc7SUFFekQ7SUFDQSxPQUFPLEtBQUs7RUFDZCxDQUFDO0VBRUQsTUFBTUMsV0FBVyxHQUNmL1ksT0FBTyxLQUFLbVksMkJBQTJCLENBQUNhLElBQUksR0FDeEMsYUFBYSxHQUNiaFosT0FBTyxLQUFLbVksMkJBQTJCLENBQUNjLE9BQU8sR0FDN0MsZUFBZSxHQUNmLGNBQWM7RUFFdEIsb0JBQ0VwZCxLQUFBLENBQUE2QyxhQUFBLENBQUNzWiw2REFBSTtJQUNIclosRUFBRSxFQUFFO01BQ0Z5QixFQUFFLEVBQUUsTUFBTTtNQUNWQyxFQUFFLEVBQUUsQ0FBQztNQUNMdU0sWUFBWSxFQUFFLE1BQU07TUFDcEIsR0FBR2pPO0lBQ0w7RUFBRSxnQkFFRjlDLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLO0lBQUM2SCxTQUFTLEVBQUMsS0FBSztJQUFDa0ssVUFBVSxFQUFDLFFBQVE7SUFBQ3BQLEVBQUUsRUFBRTtNQUFFZ0IsS0FBSyxFQUFFO0lBQU87RUFBRSxnQkFDL0Q5RCxLQUFBLENBQUE2QyxhQUFBLENBQUMxQyw4REFBSztJQUFDNkgsU0FBUyxFQUFDLEtBQUs7SUFBQ2xGLEVBQUUsRUFBRTtNQUFFdVgsSUFBSSxFQUFFO0lBQUU7RUFBRSxHQUNwQ2tDLFVBQVUsQ0FBQzNULEtBQUssQ0FBQyxnQkFDaEI1SSxLQUFBLENBQUE2QyxhQUFBLENBQUNxTyxpR0FBZ0I7SUFDZmhOLE1BQU0sRUFBQyxNQUFNO0lBQ2JKLEtBQUssRUFBQyxNQUFNO0lBQ1owTSxRQUFRLEVBQUMsTUFBTTtJQUNmOUksR0FBRyxFQUFFa0IsS0FBSyxDQUFDZ1AsT0FBUTtJQUNuQnpHLEtBQUssRUFBRSxLQUFNO0lBQ2JDLE1BQU0sRUFBQyxPQUFPO0lBQ2RDLFlBQVksRUFBRTtFQUFNLEVBQ3BCLGdCQUVGclIsS0FBQSxDQUFBNkMsYUFBQSxDQUFDdVosdUVBQVM7SUFDUnRZLEtBQUssRUFBQyxNQUFNO0lBQ1pJLE1BQU0sRUFBQyxNQUFNO0lBQ2IwTyxHQUFHLEVBQUVoSyxLQUFLLENBQUNnUCxPQUFRO0lBQ25CM08sSUFBSSxFQUFFTCxLQUFLLENBQUNLO0VBQUssRUFFcEIsQ0FDSyxlQUNSakosS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsOERBQUs7SUFDSjZILFNBQVMsRUFBQyxLQUFLO0lBQ2ZrSyxVQUFVLEVBQUMsUUFBUTtJQUNuQnBQLEVBQUUsRUFBRTtNQUFFNlUsRUFBRSxFQUFFLENBQUM7TUFBRTdULEtBQUssRUFBRTtJQUFPO0VBQUUsZ0JBRTdCOUQsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMUMsOERBQUs7SUFDSjZILFNBQVMsRUFBQyxLQUFLO0lBQ2YzRCxjQUFjLEVBQUMsZUFBZTtJQUM5QjZOLFVBQVUsRUFBQyxRQUFRO0lBQ25CcFAsRUFBRSxFQUFFO01BQUVnQixLQUFLLEVBQUU7SUFBTztFQUFFLGdCQUV0QjlELEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ21ELGdFQUFPO0lBQ05xWCxTQUFTLEVBQUMsUUFBUTtJQUNsQnRZLEtBQUssZUFBRS9FLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ29ELG1FQUFVO01BQUM5QixPQUFPLEVBQUM7SUFBUyxHQUFFeUUsS0FBSyxDQUFDSyxJQUFJLENBQWU7SUFDL0RxVSxvQkFBb0IsRUFBRSxDQUFDZCxlQUFnQjtJQUN2Q2Usb0JBQW9CLEVBQUUsQ0FBQ2YsZUFBZ0I7SUFDdkMxWixFQUFFLEVBQUU7TUFDRnVYLElBQUksRUFBRSxDQUFDO01BQ1B2VyxLQUFLLEVBQUUsQ0FBQztNQUNSbU8sYUFBYSxFQUFFO0lBQ2pCO0VBQUUsZ0JBRUZqUyxLQUFBLENBQUE2QyxhQUFBLENBQUE3QyxLQUFBLENBQUFzRixRQUFBLHFCQUNFdEYsS0FBQSxDQUFBNkMsYUFBQSxDQUFDb0QsbUVBQVU7SUFDVHVYLEdBQUcsRUFBRWQsZUFBZ0I7SUFDckJ2WSxPQUFPLEVBQUMsSUFBSTtJQUNaZ0YsVUFBVSxFQUFDLG9CQUFvQjtJQUMvQnJHLEVBQUUsRUFBRTtNQUNGd0YsUUFBUSxFQUFFLFFBQVE7TUFDbEJELFlBQVksRUFBRSxVQUFVO01BQ3hCb1YsVUFBVSxFQUFFO0lBQ2Q7RUFBRSxHQUVEN1UsS0FBSyxDQUFDSyxJQUFJLENBQ0EsQ0FDWixDQUNLLENBQ0osZUFFUmpKLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzFDLDhEQUFLO0lBQUMrUixVQUFVLEVBQUM7RUFBVSxnQkFDMUJsUyxLQUFBLENBQUE2QyxhQUFBLENBQUMxQyw4REFBSztJQUFDNkgsU0FBUyxFQUFDLEtBQUs7SUFBQ2tLLFVBQVUsRUFBQztFQUFVLGdCQUMxQ2xTLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ21ELGdFQUFPO0lBQ05xWCxTQUFTLEVBQUMsUUFBUTtJQUNsQnRZLEtBQUssZUFDSC9FLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQ29ELG1FQUFVO01BQUM5QixPQUFPLEVBQUM7SUFBUyxHQUMxQkEsT0FBTyxLQUFLbVksMkJBQTJCLENBQUNhLElBQUksR0FBRyxHQUFHLEdBQUcsRUFBRSxFQUN2RHBGLFFBQVEsQ0FBQzZDLFlBQVksRUFBQyxHQUFDLEVBQUNoUyxLQUFLLENBQUNFLE1BQU07RUFFeEMsZ0JBRUQ5SSxLQUFBLENBQUE2QyxhQUFBLENBQUE3QyxLQUFBLENBQUFzRixRQUFBLHFCQUNFdEYsS0FBQSxDQUFBNkMsYUFBQSxDQUFDb0QsbUVBQVU7SUFDVDlCLE9BQU8sRUFBQyxPQUFPO0lBQ2ZyQixFQUFFLEVBQUU7TUFDRnNGLEtBQUssRUFBRThVLFdBQVc7TUFDbEIxTSxRQUFRLEVBQUUsT0FBTztNQUNqQm5JLFlBQVksRUFBRSxVQUFVO01BQ3hCQyxRQUFRLEVBQUU7SUFDWjtFQUFFLEdBRURuRSxPQUFPLEtBQUttWSwyQkFBMkIsQ0FBQ2EsSUFBSSxHQUFHLEdBQUcsR0FBRyxFQUFFLEVBQ3ZEcEYsUUFBUSxDQUFDNkMsWUFBWSxDQUNYLEVBQ1osUUFBUSxJQUFJaFMsS0FBSyxpQkFDaEI1SSxLQUFBLENBQUE2QyxhQUFBLENBQUNvRCxtRUFBVTtJQUNUOUIsT0FBTyxFQUFDLE9BQU87SUFDZnJCLEVBQUUsRUFBRTtNQUNGNlUsRUFBRSxFQUFFSSxRQUFRLENBQUM2QyxZQUFZLEtBQUs5WSxTQUFTLEdBQUcsR0FBRyxHQUFHLENBQUM7TUFDakRzRyxLQUFLLEVBQUU4VTtJQUNUO0VBQUUsR0FFRHRVLEtBQUssQ0FBQ0UsTUFBTSxDQUVoQixDQUNBLENBQ0ssQ0FDSixFQUVQaVAsUUFBUSxDQUFDOEMsUUFBUSxpQkFDaEI3YSxLQUFBLENBQUE2QyxhQUFBLENBQUNvRCxtRUFBVTtJQUFDOUIsT0FBTyxFQUFDLE9BQU87SUFBQ3JCLEVBQUUsRUFBRTtNQUFFc0YsS0FBSyxFQUFFO0lBQWlCO0VBQUUsR0FDekRJLGlCQUFpQixHQUNkQSxpQkFBaUIsQ0FBQ3pHLE1BQU0sQ0FBQ2dXLFFBQVEsQ0FBQzhDLFFBQVEsQ0FBQyxDQUFDLEdBQzVDOUMsUUFBUSxDQUFDOEMsUUFBUSxDQUV4QixDQUNLLENBQ0YsQ0FDRixDQUNIO0FBRVgsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3TG9DO0FBQ1U7QUFLVTtBQUl6QjtBQUNjO0FBT3ZDLE1BQU1nRCxlQUFlLEdBQUdBLENBQUM7RUFDOUJDLEdBQUc7RUFDSEMsSUFBSTtFQUNKQztBQUNvQixDQUFDLEtBQUs7RUFDMUIsTUFBTTtJQUFFM1k7RUFBRSxDQUFDLEdBQUdULDZEQUFjLEVBQUU7RUFFOUIsTUFBTXFaLFlBQVksR0FBR0YsSUFBSSxDQUFDMWIsTUFBTSxHQUFHLENBQUM7RUFDcEMsTUFBTTZiLGdCQUFnQixHQUFHSixHQUFHLENBQUN6YixNQUFNLEdBQUcsQ0FBQztFQUV2QyxNQUFNOGIsb0JBQW9CLEdBQUdILHNCQUFzQixLQUFLLEtBQUssQ0FBQyxDQUFDO0VBQy9ELE1BQU1JLGlCQUFpQixHQUNyQixDQUFDSCxZQUFZLElBQUksQ0FBQ0MsZ0JBQWdCLElBQUksQ0FBQ0Ysc0JBQXNCO0VBRS9ELG9CQUNFaGUsS0FBQSxDQUFBNkMsYUFBQSxDQUFDMlgsNEZBQWUscUJBQ2R4YSxLQUFBLENBQUE2QyxhQUFBLENBQUM0WCxrR0FBcUI7SUFDcEJoVCxLQUFLLEVBQUVwQyxDQUFDLENBQUMsZ0JBQWdCLENBQUU7SUFDM0JnWixPQUFPLEVBQ0xGLG9CQUFvQixHQUNoQjlZLENBQUMsQ0FDQyx1RkFBdUYsQ0FDeEYsR0FDRCxFQUNMO0lBQ0RpWixXQUFXLEVBQ1RILG9CQUFvQixnQkFDbEJuZSxLQUFBLENBQUE2QyxhQUFBLENBQUM4YSwwRUFBaUI7TUFDaEI3YSxFQUFFLEVBQUU7UUFBRXNGLEtBQUssRUFBRSxjQUFjO1FBQUV1SyxNQUFNLEVBQUU7TUFBVTtJQUFFLEVBQ2pELEdBQ0E3UTtFQUNMLEVBQ0QsZUFDRjlCLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQythLGdHQUFtQixxQkFDbEI1ZCxLQUFBLENBQUE2QyxhQUFBLENBQUMxQyw4REFBSztJQUFDOEgsR0FBRyxFQUFFO0VBQUUsR0FDWDhWLElBQUksQ0FBQ2xHLEdBQUcsQ0FBQyxDQUFDO0lBQUVqUCxLQUFLO0lBQUUyVjtFQUFNLENBQUMsS0FDekJBLEtBQUssQ0FBQ2xjLE1BQU0sS0FBSyxDQUFDLGdCQUNoQnJDLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzBVLHVFQUFvQjtJQUNuQmpVLEdBQUcsRUFBRyxjQUNKLFNBQVMsSUFBSXNGLEtBQUssR0FBR0EsS0FBSyxDQUFDTCxPQUFPLEdBQUdLLEtBQUssQ0FBQ0UsTUFDNUMsRUFBRTtJQUNIM0UsT0FBTyxFQUFFbVksbUZBQWlDO0lBQzFDMVQsS0FBSyxFQUFFQSxLQUFNO0lBQ2JtUCxRQUFRLEVBQUV3RyxLQUFLLENBQUMsQ0FBQyxDQUFHO0lBQ3BCemIsRUFBRSxFQUFFO01BQUVzQixDQUFDLEVBQUU7SUFBRTtFQUFFLEVBQ2IsZ0JBRUZwRSxLQUFBLENBQUE2QyxhQUFBLENBQUMyVSx1REFBWTtJQUNYbFUsR0FBRyxFQUFHLG9CQUNKLFNBQVMsSUFBSXNGLEtBQUssR0FBR0EsS0FBSyxDQUFDTCxPQUFPLEdBQUdLLEtBQUssQ0FBQ0UsTUFDNUMsRUFBRTtJQUNIRixLQUFLLEVBQUVBLEtBQU07SUFDYjZPLFNBQVMsRUFBRThHLEtBQU07SUFDakJwYSxPQUFPLEVBQUVtWSxtRkFBZ0NhO0VBQUMsRUFFN0MsQ0FDRixFQUNBVyxHQUFHLENBQUNqRyxHQUFHLENBQUMsQ0FBQztJQUFFalAsS0FBSztJQUFFMlY7RUFBTSxDQUFDLEtBQ3hCQSxLQUFLLENBQUNsYyxNQUFNLEtBQUssQ0FBQyxnQkFDaEJyQyxLQUFBLENBQUE2QyxhQUFBLENBQUMwVSx1RUFBb0I7SUFDbkJqVSxHQUFHLEVBQUcsaUJBQ0osU0FBUyxJQUFJc0YsS0FBSyxHQUFHQSxLQUFLLENBQUNMLE9BQU8sR0FBR0ssS0FBSyxDQUFDRSxNQUM1QyxFQUFFO0lBQ0gzRSxPQUFPLEVBQUVtWSxzRkFBb0M7SUFDN0MxVCxLQUFLLEVBQUVBLEtBQU07SUFDYm1QLFFBQVEsRUFBRXdHLEtBQUssQ0FBQyxDQUFDLENBQUc7SUFDcEJ6YixFQUFFLEVBQUU7TUFBRXNCLENBQUMsRUFBRTtJQUFFO0VBQUUsRUFDYixnQkFFRnBFLEtBQUEsQ0FBQTZDLGFBQUEsQ0FBQzJVLHVEQUFZO0lBQ1hsVSxHQUFHLEVBQUcsdUJBQ0osU0FBUyxJQUFJc0YsS0FBSyxHQUFHQSxLQUFLLENBQUNMLE9BQU8sR0FBR0ssS0FBSyxDQUFDRSxNQUM1QyxFQUFFO0lBQ0hGLEtBQUssRUFBRUEsS0FBTTtJQUNiNk8sU0FBUyxFQUFFOEcsS0FBTTtJQUNqQnBhLE9BQU8sRUFBRW1ZLHNGQUFtQ2M7RUFBQyxFQUVoRCxDQUNGLEVBRUFnQixpQkFBaUIsaUJBQ2hCcGUsS0FBQSxDQUFBNkMsYUFBQSxDQUFDdVQsOERBQUs7SUFBQ0ssUUFBUSxFQUFDO0VBQU0sZ0JBQ3BCelcsS0FBQSxDQUFBNkMsYUFBQSxDQUFDNmEsbUVBQVUsUUFBRXJZLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFjLEVBQ2hFQSxDQUFDLENBQUMsNkJBQTZCLENBQUMsQ0FFcEMsQ0FDSyxDQUNZLENBQ047QUFFdEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNqSE0sSUFBSzBFLGdCQUFnQiwwQkFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFBLE9BQWhCQSxnQkFBZ0I7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9AYXZhbGFicy9jb3JlLXV0aWxzLXNkay9lc20vYmlnSW50VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9CTklucHV0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0xvYWRpbmdPdmVybGF5LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL01hbGljaW91c1R4QWxlcnQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHJhbnNhY3Rpb25EZXRhaWxJdGVtLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FwcHJvdmVBY3Rpb24vaG9va3MvdXNlRmVlQ3VzdG9taXplci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvY29tcG9uZW50cy9Db2xsZWN0aWJsZU1lZGlhLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0NvbGxlY3RpYmxlcy9jb21wb25lbnRzL0ltYWdlV3JhcHBlci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9Db2xsZWN0aWJsZXMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9EZUZpL2hvb2tzL3VzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvUGVybWlzc2lvbnMvY29tcG9uZW50cy9BbGVydEJveC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9QZXJtaXNzaW9ucy9jb21wb25lbnRzL0FsZXJ0RGlhbG9nLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1Blcm1pc3Npb25zL2NvbXBvbmVudHMvV2FybmluZ0JveC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9OZnRBY2NvcmRpb24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvU3BlbmRMaW1pdEluZm8vQ3VzdG9tU3BlbmRMaW1pdC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9TcGVuZExpbWl0SW5mby9OZnRTcGVuZExpbWl0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL1NwZW5kTGltaXRJbmZvL1NwZW5kTGltaXRJbmZvLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL1NwZW5kTGltaXRJbmZvL1Rva2VuU3BlbmRMaW1pdC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9UcmFuc2FjdGlvblRva2VuQ2FyZC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9UeEJhbGFuY2VDaGFuZ2UudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvc2VuZC9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9ldGhlcnMvbGliLmVzbS9jb25zdGFudHMvbnVtYmVycy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0KHQsbil7bj1NYXRoLmZsb29yKG4pO2NvbnN0IGU9dC50b1N0cmluZygpLG89TWF0aC5tYXgoZS5sZW5ndGgtbiwwKSxyPWUuc2xpY2UobykucGFkU3RhcnQobixcIjBcIiksYT1lLnNsaWNlKDAsbyl8fFwiMFwiO3JldHVybiByLmxlbmd0aD9gJHthfS4ke3J9YDphfWV4cG9ydHt0IGFzIGJpZ0ludFRvU3RyaW5nfTtcbiIsImltcG9ydCBSZWFjdCwgeyBXaGVlbEV2ZW50LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgSW5wdXRBZG9ybm1lbnQsXG4gIEJ1dHRvbixcbiAgc3R5bGVkLFxuICBDaXJjdWxhclByb2dyZXNzLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgYmlnSW50VG9TdHJpbmcgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgeyBzdHJpbmdUb0JpZ2ludCB9IGZyb20gJ0BzcmMvdXRpbHMvc3RyaW5nVG9CaWdpbnQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJOSW5wdXRQcm9wcyB7XG4gIHZhbHVlPzogYmlnaW50O1xuICBkZW5vbWluYXRpb246IG51bWJlcjtcbiAgb25DaGFuZ2U/KHZhbDogeyBiaWdpbnQ6IGJpZ2ludDsgYW1vdW50OiBzdHJpbmcgfSk6IHZvaWQ7XG4gIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xuICBtaW4/OiBiaWdpbnQ7XG4gIG1heD86IGJpZ2ludDtcbiAgaXNWYWx1ZUxvYWRpbmc/OiBib29sZWFuO1xuICBkaXNhYmxlZD86IGJvb2xlYW47XG4gIGVycm9yPzogYm9vbGVhbjtcbiAgZnVsbFdpZHRoPzogYm9vbGVhbjtcbiAgd2l0aE1heEJ1dHRvbj86IGJvb2xlYW47XG59XG5cbmNvbnN0IElucHV0TnVtYmVyID0gc3R5bGVkKFRleHRGaWVsZClgXG4gIGlucHV0Ojotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uLFxuICBpbnB1dDo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbiB7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuICBwYWRkaW5nOiAwO1xuYDtcblxuZnVuY3Rpb24gc3BsaXRWYWx1ZSh2YWw6IHN0cmluZykge1xuICByZXR1cm4gdmFsLmluY2x1ZGVzKCcuJykgPyB2YWwuc3BsaXQoJy4nKSA6IFt2YWwsIG51bGxdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQk5JbnB1dCh7XG4gIHZhbHVlLFxuICBkZW5vbWluYXRpb24sXG4gIG9uQ2hhbmdlLFxuICBtaW4gPSAwbixcbiAgbWF4LFxuICBpc1ZhbHVlTG9hZGluZyxcbiAgZXJyb3IsXG4gIGRpc2FibGVkLFxuICBmdWxsV2lkdGgsXG4gIHdpdGhNYXhCdXR0b24gPSB0cnVlLFxuICAuLi5wcm9wc1xufTogQk5JbnB1dFByb3BzKSB7XG4gIGNvbnN0IFt2YWxTdHIsIHNldFZhbFN0cl0gPSB1c2VTdGF0ZSgnJyk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChOdW1iZXIodmFsU3RyKSAhPT0gMCkge1xuICAgICAgICBzZXRWYWxTdHIoJycpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSAwbikge1xuICAgICAgaWYgKE51bWJlcih2YWxTdHIpICE9PSAwKSB7XG4gICAgICAgIHNldFZhbFN0cignJyk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBjb25zdCB2YWx1ZUFzU3RyaW5nID0gYmlnSW50VG9TdHJpbmcodmFsdWUsIGRlbm9taW5hdGlvbik7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHN0cmluZ1RvQmlnaW50KHZhbFN0ciB8fCAnMCcsIGRlbm9taW5hdGlvbik7XG4gICAgICAvKipcbiAgICAgICAqIFdoZW4gZGVsZXRpbmcgemVyb3MgYWZ0ZXIgZGVjaW1hbCwgYWxsIHplcm9zIGRlbGV0ZSB3aXRob3V0IHRoaXMgY2hlY2suXG4gICAgICAgKiBUaGlzIGFsc28gcHJlc2VydmVzIHplcm9zIGluIHRoZSBpbnB1dCB1aS5cbiAgICAgICAqL1xuXG4gICAgICBpZiAoIXZhbFN0ciB8fCB2YWx1ZSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgc2V0VmFsU3RyKHZhbHVlQXNTdHJpbmcpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW2Rlbm9taW5hdGlvbiwgdmFsU3RyLCB2YWx1ZV0pO1xuXG4gIGNvbnN0IG9uVmFsdWVDaGFuZ2VkID0gKG5ld1ZhbHVlU3RyaW5nOiBzdHJpbmcpID0+IHtcbiAgICAvKipcbiAgICAgKiBTcGxpdCB0aGUgaW5wdXQgYW5kIG1ha2Ugc3VyZSB0aGUgcmlnaHQgc2lkZSBuZXZlciBleGNlZWRzXG4gICAgICogdGhlIGRlbm9taW5hdGlvbiBsZW5ndGhcbiAgICAgKi9cbiAgICBjb25zdCBbLCBlbmRWYWx1ZV0gPSBzcGxpdFZhbHVlKG5ld1ZhbHVlU3RyaW5nKTsgLy8gcmVuYW1lZCBjYWxsYmFjayBwYXJhbVxuXG4gICAgaWYgKCFlbmRWYWx1ZSB8fCBlbmRWYWx1ZS5sZW5ndGggPD0gZGVub21pbmF0aW9uKSB7XG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IHN0cmluZ1RvQmlnaW50KG5ld1ZhbHVlU3RyaW5nIHx8ICcwJywgZGVub21pbmF0aW9uKTtcblxuICAgICAgaWYgKG5ld1ZhbHVlIDwgbWluKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2xkVmFsdWUgPSBzdHJpbmdUb0JpZ2ludCh2YWxTdHIgfHwgJzAnLCBkZW5vbWluYXRpb24pO1xuXG4gICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgIG9uQ2hhbmdlPy4oe1xuICAgICAgICAgIGFtb3VudDogYmlnSW50VG9TdHJpbmcobmV3VmFsdWUgfHwgMG4sIGRlbm9taW5hdGlvbiksXG4gICAgICAgICAgYmlnaW50OiBuZXdWYWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBzZXRWYWxTdHIobmV3VmFsdWVTdHJpbmcpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzZXRNYXggPSAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MQnV0dG9uRWxlbWVudD4pID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICghbWF4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb25WYWx1ZUNoYW5nZWQoYmlnSW50VG9TdHJpbmcobWF4LCBkZW5vbWluYXRpb24pKTtcbiAgfTtcblxuICBjb25zdCBpc01heEJ0blZpc2libGUgPSBtYXggJiYgbWF4ID4gMG47XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XG4gICAgICA8SW5wdXROdW1iZXJcbiAgICAgICAgZnVsbFdpZHRoPXtmdWxsV2lkdGh9XG4gICAgICAgIHZhbHVlPXt2YWxTdHIucmVwbGFjZUFsbCgnLCcsICcnKX1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBvblZhbHVlQ2hhbmdlZChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICBvbktleURvd249eyhlKSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZS5jb2RlID09PSAnS2V5RScgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSAnLScgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSAnKycgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSAnQXJyb3dVcCcgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSAnQXJyb3dEb3duJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9fVxuICAgICAgICBvbldoZWVsPXsoZTogV2hlZWxFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4ge1xuICAgICAgICAgIC8vIFByZXZlbnQgY2hhbmdpbmcgdmFsdWUgYnkgbW91c2Ugd2hlZWxcbiAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmJsdXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgICAgcGxhY2Vob2xkZXI9XCIwLjBcIlxuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiBmdWxsV2lkdGggPyAnYXV0bycgOiAnMTgwcHgnLFxuICAgICAgICB9fVxuICAgICAgICBJbnB1dFByb3BzPXt7XG4gICAgICAgICAgZGlzYWJsZWQsXG4gICAgICAgICAgZW5kQWRvcm5tZW50OiB3aXRoTWF4QnV0dG9uID8gKFxuICAgICAgICAgICAgaXNWYWx1ZUxvYWRpbmcgPyAoXG4gICAgICAgICAgICAgIDxDaXJjdWxhclByb2dyZXNzIHNpemU9ezE2fSBzeD17eyBoZWlnaHQ6ICdhdXRvICFpbXBvcnRhbnQnIH19IC8+XG4gICAgICAgICAgICApIDogaXNNYXhCdG5WaXNpYmxlID8gKFxuICAgICAgICAgICAgICA8SW5wdXRBZG9ybm1lbnQgcG9zaXRpb249XCJlbmRcIj5cbiAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17c2V0TWF4fVxuICAgICAgICAgICAgICAgICAgc3g9e3sgcDogMCwganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBNYXhcbiAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgPC9JbnB1dEFkb3JubWVudD5cbiAgICAgICAgICAgICkgOiBudWxsXG4gICAgICAgICAgKSA6IG51bGwsXG4gICAgICAgICAgaW5wdXRNb2RlOiAndGV4dCcsXG4gICAgICAgICAgc3g6IHtcbiAgICAgICAgICAgIHB5OiAxLFxuICAgICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfX1cbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgLz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgQ2lyY3VsYXJQcm9ncmVzcyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPdmVybGF5IH0gZnJvbSAnLi9PdmVybGF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIExvYWRpbmdPdmVybGF5KCkge1xuICByZXR1cm4gKFxuICAgIDxPdmVybGF5PlxuICAgICAgPENpcmN1bGFyUHJvZ3Jlc3MgLz5cbiAgICA8L092ZXJsYXk+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBBbGVydERpYWxvZyB9IGZyb20gJ0BzcmMvcGFnZXMvUGVybWlzc2lvbnMvY29tcG9uZW50cy9BbGVydERpYWxvZyc7XG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmludGVyZmFjZSBNYWxpY2lvdXNUeEFsZXJ0UHJvcHMge1xuICBjYW5jZWxIYW5kbGVyOiAoKSA9PiB2b2lkO1xuICBzaG93QWxlcnQ/OiBib29sZWFuO1xuICB0aXRsZT86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIGFjdGlvblRpdGxlcz86IHtcbiAgICByZWplY3Q6IHN0cmluZztcbiAgICBwcm9jZWVkOiBzdHJpbmc7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBNYWxpY2lvdXNUeEFsZXJ0KHtcbiAgc2hvd0FsZXJ0LFxuICB0aXRsZSxcbiAgZGVzY3JpcHRpb24sXG4gIGNhbmNlbEhhbmRsZXIsXG4gIGFjdGlvblRpdGxlcyxcbn06IE1hbGljaW91c1R4QWxlcnRQcm9wcykge1xuICBjb25zdCBbaXNBbGVydERpYWxvZ09wZW4sIHNldElzQWxlcnREaWFsb2dPcGVuXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge3Nob3dBbGVydCAmJiAoXG4gICAgICAgIDxBbGVydERpYWxvZ1xuICAgICAgICAgIG9wZW49e2lzQWxlcnREaWFsb2dPcGVufVxuICAgICAgICAgIGNhbmNlbEhhbmRsZXI9e2NhbmNlbEhhbmRsZXJ9XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0SXNBbGVydERpYWxvZ09wZW4oZmFsc2UpfVxuICAgICAgICAgIHRpdGxlPXt0aXRsZSB8fCB0KCdTY2FtIFRyYW5zYWN0aW9uJyl9XG4gICAgICAgICAgdGV4dD17XG4gICAgICAgICAgICBkZXNjcmlwdGlvbiB8fCB0KCdUaGlzIHRyYW5zYWN0aW9uIGlzIG1hbGljaW91cyBkbyBub3QgcHJvY2VlZC4nKVxuICAgICAgICAgIH1cbiAgICAgICAgICBwcm9jZWVkTGFiZWw9e2FjdGlvblRpdGxlcz8ucHJvY2VlZCB8fCB0KCdQcm9jZWVkIEFueXdheScpfVxuICAgICAgICAgIHJlamVjdExhYmVsPXthY3Rpb25UaXRsZXM/LnJlamVjdCB8fCB0KCdSZWplY3QgVHJhbnNhY3Rpb24nKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBMaW5rLFxuICBMaW5rSWNvbixcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQge1xuICB0eXBlIEFkZHJlc3NJdGVtLFxuICB0eXBlIEN1cnJlbmN5SXRlbSxcbiAgdHlwZSBEZXRhaWxJdGVtLFxuICB0eXBlIExpbmtJdGVtLFxuICB0eXBlIFRleHRJdGVtLFxuICBEZXRhaWxJdGVtVHlwZSxcbiAgRnVuZHNSZWNpcGllbnRJdGVtLFxufSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgVG9rZW5Vbml0IH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuXG5pbXBvcnQgeyBBY2NvdW50RGV0YWlscyB9IGZyb20gJ0BzcmMvcGFnZXMvU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvQXBwcm92YWxUeERldGFpbHMnO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcblxuaW1wb3J0IHsgVHhEZXRhaWxzUm93IH0gZnJvbSAnLi9UeERldGFpbHNSb3cnO1xuaW1wb3J0IHsgdXNlQmFsYW5jZXNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9CYWxhbmNlc1Byb3ZpZGVyJztcbmltcG9ydCB7IHJ1bnRpbWUgfSBmcm9tICd3ZWJleHRlbnNpb24tcG9seWZpbGwnO1xuaW1wb3J0IHsgdXNlQ29udGFjdHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db250YWN0c1Byb3ZpZGVyJztcbmltcG9ydCB7IHRydW5jYXRlQWRkcmVzcyB9IGZyb20gJ0BzcmMvdXRpbHMvdHJ1bmNhdGVBZGRyZXNzJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5cbmV4cG9ydCBjb25zdCBUcmFuc2FjdGlvbkRldGFpbEl0ZW0gPSAoeyBpdGVtIH06IHsgaXRlbTogRGV0YWlsSXRlbSB9KSA9PiB7XG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gPFBsYWluVGV4dEluZm8gaXRlbT17aXRlbX0gLz47XG4gIH1cblxuICBzd2l0Y2ggKGl0ZW0udHlwZSkge1xuICAgIGNhc2UgRGV0YWlsSXRlbVR5cGUuVEVYVDpcbiAgICAgIHJldHVybiA8VGV4dEluZm8gaXRlbT17aXRlbX0gLz47XG5cbiAgICBjYXNlIERldGFpbEl0ZW1UeXBlLkFERFJFU1M6XG4gICAgICByZXR1cm4gPEFkZHJlc3NJbmZvIGl0ZW09e2l0ZW19IC8+O1xuXG4gICAgY2FzZSBEZXRhaWxJdGVtVHlwZS5MSU5LOlxuICAgICAgcmV0dXJuIDxMaW5rSW5mbyBpdGVtPXtpdGVtfSAvPjtcblxuICAgIGNhc2UgRGV0YWlsSXRlbVR5cGUuQ1VSUkVOQ1k6XG4gICAgICByZXR1cm4gPEN1cnJlbmN5SW5mbyBpdGVtPXtpdGVtfSAvPjtcblxuICAgIGNhc2UgRGV0YWlsSXRlbVR5cGUuRlVORFNfUkVDSVBJRU5UOlxuICAgICAgcmV0dXJuIDxGdW5kc1JlY2lwaWVudEluZm8gaXRlbT17aXRlbX0gLz47XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbmNvbnN0IFBsYWluVGV4dEluZm8gPSAoeyBpdGVtIH06IHsgaXRlbTogc3RyaW5nIH0pID0+IChcbiAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+e2l0ZW19PC9UeXBvZ3JhcGh5PlxuKTtcblxuY29uc3QgVGV4dEluZm8gPSAoeyBpdGVtIH06IHsgaXRlbTogVGV4dEl0ZW0gfSkgPT4gKFxuICA8VHhEZXRhaWxzUm93IGxhYmVsPXtpdGVtLmxhYmVsfT5cbiAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPntpdGVtLnZhbHVlfTwvVHlwb2dyYXBoeT5cbiAgPC9UeERldGFpbHNSb3c+XG4pO1xuXG5jb25zdCBMaW5rSW5mbyA9ICh7IGl0ZW0gfTogeyBpdGVtOiBMaW5rSXRlbSB9KSA9PiB7XG4gIGNvbnN0IHVybCA9IG5ldyBVUkwoaXRlbS52YWx1ZS51cmwpO1xuXG4gIGNvbnN0IGlzTGlua1RvRXh0ZW5zaW9uSXRzZWxmID0gdXJsLmhvc3RuYW1lID09PSBydW50aW1lLmlkO1xuXG4gIC8vIERvIG5vdCBsaW5rIHRvIG91cnNlbHZlc1xuICBpZiAoaXNMaW5rVG9FeHRlbnNpb25JdHNlbGYpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17aXRlbS5sYWJlbH0+XG4gICAgICA8VG9vbHRpcCB0aXRsZT17dXJsLmhyZWZ9PlxuICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgZ2FwPXswLjV9PlxuICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICBocmVmPXt1cmwuaHJlZn1cbiAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgICAgICAgIGNvbG9yOiAndGV4dC5wcmltYXJ5JyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPExpbmtJY29uIHNpemU9ezE0fSAvPlxuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnByaW1hcnknLFxuICAgICAgICAgICAgICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3VybC5ob3N0bmFtZX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1Rvb2x0aXA+XG4gICAgPC9UeERldGFpbHNSb3c+XG4gICk7XG59O1xuXG5jb25zdCBBZGRyZXNzSW5mbyA9ICh7IGl0ZW0gfTogeyBpdGVtOiBBZGRyZXNzSXRlbSB9KSA9PiAoXG4gIDxBY2NvdW50RGV0YWlscyBsYWJlbD17aXRlbS5sYWJlbH0gYWRkcmVzcz17aXRlbS52YWx1ZX0gLz5cbik7XG5cbmNvbnN0IEZ1bmRzUmVjaXBpZW50SW5mbyA9ICh7IGl0ZW0gfTogeyBpdGVtOiBGdW5kc1JlY2lwaWVudEl0ZW0gfSkgPT4ge1xuICBjb25zdCB7IGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgY29uc3QgeyBnZXRDb250YWN0QnlBZGRyZXNzIH0gPSB1c2VDb250YWN0c0NvbnRleHQoKTtcbiAgY29uc3QgeyBnZXRBY2NvdW50IH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcbiAgY29uc3QgeyBnZXRUb2tlblByaWNlIH0gPSB1c2VCYWxhbmNlc0NvbnRleHQoKTtcblxuICBjb25zdCB0b2tlbiA9IG5ldyBUb2tlblVuaXQoaXRlbS5hbW91bnQsIGl0ZW0ubWF4RGVjaW1hbHMsIGl0ZW0uc3ltYm9sKTtcbiAgY29uc3QgdG9rZW5QcmljZSA9IGdldFRva2VuUHJpY2UoaXRlbS5zeW1ib2wpO1xuICBjb25zdCBjb250YWN0ID0gZ2V0QWNjb3VudChpdGVtLmxhYmVsKSA/PyBnZXRDb250YWN0QnlBZGRyZXNzKGl0ZW0ubGFiZWwpO1xuXG4gIHJldHVybiAoXG4gICAgPFR4RGV0YWlsc1Jvd1xuICAgICAgbGFiZWw9e1xuICAgICAgICA8VG9vbHRpcCB0aXRsZT17aXRlbS5sYWJlbH0+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICB7Y29udGFjdD8ubmFtZSB8fCB0cnVuY2F0ZUFkZHJlc3MoaXRlbS5sYWJlbCl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICB9XG4gICAgPlxuICAgICAgPFN0YWNrPlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dG9rZW4udG9EaXNwbGF5KCl9IHt0b2tlbi5nZXRTeW1ib2woKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICB7dG9rZW5QcmljZSA/IChcbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2N1cnJlbmN5Rm9ybWF0dGVyKFxuICAgICAgICAgICAgICB0b2tlblByaWNlICogdG9rZW4udG9EaXNwbGF5KHsgYXNOdW1iZXI6IHRydWUgfSksXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L1N0YWNrPlxuICAgIDwvVHhEZXRhaWxzUm93PlxuICApO1xufTtcblxuY29uc3QgQ3VycmVuY3lJbmZvID0gKHsgaXRlbSB9OiB7IGl0ZW06IEN1cnJlbmN5SXRlbSB9KSA9PiB7XG4gIGNvbnN0IHsgY3VycmVuY3lGb3JtYXR0ZXIgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICBjb25zdCB7IGdldFRva2VuUHJpY2UgfSA9IHVzZUJhbGFuY2VzQ29udGV4dCgpO1xuICBjb25zdCB0b2tlbiA9IG5ldyBUb2tlblVuaXQoaXRlbS52YWx1ZSwgaXRlbS5tYXhEZWNpbWFscywgaXRlbS5zeW1ib2wpO1xuICBjb25zdCB0b2tlblByaWNlID0gZ2V0VG9rZW5QcmljZShpdGVtLnN5bWJvbCk7XG5cbiAgcmV0dXJuIChcbiAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXtpdGVtLmxhYmVsfT5cbiAgICAgIDxTdGFjaz5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3Rva2VuLnRvRGlzcGxheSgpfSB7dG9rZW4uZ2V0U3ltYm9sKCl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAge3Rva2VuUHJpY2UgPyAoXG4gICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtjdXJyZW5jeUZvcm1hdHRlcihcbiAgICAgICAgICAgICAgdG9rZW5QcmljZSAqIHRva2VuLnRvRGlzcGxheSh7IGFzTnVtYmVyOiB0cnVlIH0pLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBTa2VsZXRvbiwgU3RhY2sgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtcbiAgTmV0d29ya1Rva2VuV2l0aEJhbGFuY2UsXG4gIFJwY01ldGhvZCxcbiAgU2lnbmluZ0RhdGEsXG4gIFRva2VuVHlwZSxcbn0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBOZXR3b3JrV2l0aENhaXBJZCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL21vZGVscyc7XG5pbXBvcnQgeyBOZXR3b3JrRmVlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmtGZWUvbW9kZWxzJztcblxuaW1wb3J0IHsgdXNlTmV0d29ya0ZlZUNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtGZWVQcm92aWRlcic7XG5pbXBvcnQge1xuICBDdXN0b21GZWVzLFxuICBDdXN0b21HYXNGZWVzUHJvcHMsXG4gIEdhc0ZlZU1vZGlmaWVyLFxufSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0N1c3RvbUZlZXMnO1xuaW1wb3J0IHsgU2VuZEVycm9yTWVzc2FnZSB9IGZyb20gJ0BzcmMvdXRpbHMvc2VuZC9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyBVcGRhdGVBY3Rpb25UeERhdGFIYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvaGFuZGxlcnMvdXBkYXRlVHhEYXRhJztcbmltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlVG9rZW5zV2l0aEJhbGFuY2VzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VUb2tlbnNXaXRoQmFsYW5jZXMnO1xuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUJhbGFuY2VzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQmFsYW5jZXNQcm92aWRlcic7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIE11bHRpVHhBY3Rpb24sXG4gIGlzQmF0Y2hBcHByb3ZhbEFjdGlvbixcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcblxuY29uc3QgZ2V0SW5pdGlhbEZlZVJhdGUgPSAoXG4gIGRhdGE/OiBTaWduaW5nRGF0YSB8IE11bHRpVHhGZWVEYXRhLFxuKTogYmlnaW50IHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmIChpc011bHRpVHhGZWVEYXRhKGRhdGEpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmIChkYXRhPy50eXBlID09PSBScGNNZXRob2QuQklUQ09JTl9TRU5EX1RSQU5TQUNUSU9OKSB7XG4gICAgcmV0dXJuIEJpZ0ludChkYXRhLmRhdGEuZmVlUmF0ZSk7XG4gIH1cblxuICBpZiAoZGF0YT8udHlwZSA9PT0gUnBjTWV0aG9kLkVUSF9TRU5EX1RSQU5TQUNUSU9OKSB7XG4gICAgcmV0dXJuIGRhdGEuZGF0YS5tYXhGZWVQZXJHYXMgPyBCaWdJbnQoZGF0YS5kYXRhLm1heEZlZVBlckdhcykgOiB1bmRlZmluZWQ7XG4gIH1cbn07XG5cbmNvbnN0IE11bHRpVHhTeW1ib2w6IHVuaXF1ZSBzeW1ib2wgPSBTeW1ib2woKTtcblxudHlwZSBNdWx0aVR4RmVlRGF0YSA9IHtcbiAgdHlwZTogdHlwZW9mIE11bHRpVHhTeW1ib2w7XG4gIGdhc0xpbWl0OiBiaWdpbnQ7XG4gIGZlZVJhdGU/OiBiaWdpbnQ7XG4gIG1heFRpcFJhdGU/OiBiaWdpbnQ7XG59O1xuXG5jb25zdCBpc011bHRpVHhGZWVEYXRhID0gKFxuICBkYXRhOiBTaWduaW5nRGF0YSB8IE11bHRpVHhGZWVEYXRhLFxuKTogZGF0YSBpcyBNdWx0aVR4RmVlRGF0YSA9PiBkYXRhLnR5cGUgPT09IE11bHRpVHhTeW1ib2w7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VGZWVDdXN0b21pemVyKHtcbiAgYWN0aW9uLFxuICBuZXR3b3JrLFxuICB0eEluZGV4LFxufToge1xuICBhY3Rpb24/OiBBY3Rpb24gfCBNdWx0aVR4QWN0aW9uO1xuICBuZXR3b3JrPzogTmV0d29ya1dpdGhDYWlwSWQ7XG4gIHR4SW5kZXg/OiBudW1iZXI7XG59KSB7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czogeyBhY3RpdmU6IGFjdGl2ZUFjY291bnQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IHVwZGF0ZUJhbGFuY2VPbk5ldHdvcmtzIH0gPSB1c2VCYWxhbmNlc0NvbnRleHQoKTtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBjb25zdCBbbmV0d29ya0ZlZSwgc2V0TmV0d29ya0ZlZV0gPSB1c2VTdGF0ZTxOZXR3b3JrRmVlIHwgbnVsbD4oKTtcblxuICBjb25zdCBbZmVlRXJyb3IsIHNldEZlZUVycm9yXSA9IHVzZVN0YXRlPFNlbmRFcnJvck1lc3NhZ2U+KCk7XG4gIGNvbnN0IHsgZ2V0TmV0d29ya0ZlZSB9ID0gdXNlTmV0d29ya0ZlZUNvbnRleHQoKTtcblxuICBjb25zdCBbaXNDYWxjdWxhdGluZ0ZlZSwgc2V0SXNDYWxjdWxhdGluZ0ZlZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtnYXNGZWVNb2RpZmllciwgc2V0R2FzRmVlTW9kaWZpZXJdID0gdXNlU3RhdGU8R2FzRmVlTW9kaWZpZXI+KFxuICAgIEdhc0ZlZU1vZGlmaWVyLlNMT1csXG4gICk7XG4gIGNvbnN0IFtpc0JhdGNoQXBwcm92YWxTY3JlZW4sIHNldElzQmF0Y2hBcHByb3ZhbFNjcmVlbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGlzRmVlU2VsZWN0b3JFbmFibGVkID0gQm9vbGVhbihhY3Rpb24/LmRpc3BsYXlEYXRhLm5ldHdvcmtGZWVTZWxlY3Rvcik7XG5cbiAgY29uc3QgdG9rZW5zID0gdXNlVG9rZW5zV2l0aEJhbGFuY2VzKHsgbmV0d29yayB9KTtcblxuICBjb25zdCBuYXRpdmVUb2tlbiA9IHVzZU1lbW8oXG4gICAgKCkgPT4gdG9rZW5zLmZpbmQoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBUb2tlblR5cGUuTkFUSVZFKSA/PyBudWxsLFxuICAgIFt0b2tlbnNdLFxuICApIGFzIE5ldHdvcmtUb2tlbldpdGhCYWxhbmNlIHwgbnVsbDtcblxuICBjb25zdCBzaWduaW5nRGF0YSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghYWN0aW9uIHx8ICFpc0ZlZVNlbGVjdG9yRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoaXNCYXRjaEFwcHJvdmFsQWN0aW9uKGFjdGlvbikpIHtcbiAgICAgIHNldElzQmF0Y2hBcHByb3ZhbFNjcmVlbih0cnVlKTtcbiAgICAgIGlmICh0eXBlb2YgdHhJbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgY29uc3QgZ2FzTGltaXQgPSBhY3Rpb24uc2lnbmluZ1JlcXVlc3RzLnJlZHVjZSgoc3VtLCByZXEpID0+IHtcbiAgICAgICAgICBpZiAocmVxLnNpZ25pbmdEYXRhLnR5cGUgPT09IFJwY01ldGhvZC5FVEhfU0VORF9UUkFOU0FDVElPTikge1xuICAgICAgICAgICAgcmV0dXJuIHN1bSArIEJpZ0ludChyZXEuc2lnbmluZ0RhdGEuZGF0YS5nYXNMaW1pdCA/PyAwbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ1RoaXMgdHJhbnNhY3Rpb24gdHlwZSBpcyBub3Qgc3VwcG9ydGVkIGluIGJ1bGsgYXBwcm92YWxzOiAnICtcbiAgICAgICAgICAgICAgcmVxLnNpZ25pbmdEYXRhLnR5cGUsXG4gICAgICAgICAgKTtcbiAgICAgICAgfSwgMG4pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogTXVsdGlUeFN5bWJvbCxcbiAgICAgICAgICBmZWVSYXRlOiBhY3Rpb24uc2lnbmluZ1JlcXVlc3RzLnJlZHVjZSgoc3VtLCByZXEpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXEuc2lnbmluZ0RhdGEudHlwZSA9PT0gUnBjTWV0aG9kLkVUSF9TRU5EX1RSQU5TQUNUSU9OKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHR4R2FzID0gcmVxLnNpZ25pbmdEYXRhLmRhdGEuZ2FzTGltaXQ7XG4gICAgICAgICAgICAgIGNvbnN0IG1heEZlZSA9IHJlcS5zaWduaW5nRGF0YS5kYXRhLm1heEZlZVBlckdhcztcblxuICAgICAgICAgICAgICBpZiAoIXR4R2FzIHx8ICFtYXhGZWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMG47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCB3ZWlnaHQgPSBOdW1iZXIodHhHYXMpIC8gTnVtYmVyKGdhc0xpbWl0KTtcblxuICAgICAgICAgICAgICByZXR1cm4gc3VtICsgQmlnSW50KE1hdGguY2VpbChOdW1iZXIobWF4RmVlKSAqIHdlaWdodCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICdUaGlzIHRyYW5zYWN0aW9uIHR5cGUgaXMgbm90IHN1cHBvcnRlZCBpbiBidWxrIGFwcHJvdmFsczogJyArXG4gICAgICAgICAgICAgICAgcmVxLnNpZ25pbmdEYXRhLnR5cGUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sIDBuKSxcbiAgICAgICAgICBnYXNMaW1pdCxcbiAgICAgICAgfSBhcyBNdWx0aVR4RmVlRGF0YTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2lnbmluZ1JlcXVlc3QgPSAoYWN0aW9uIGFzIE11bHRpVHhBY3Rpb24pLnNpZ25pbmdSZXF1ZXN0c1t0eEluZGV4XTtcblxuICAgICAgaWYgKCFzaWduaW5nUmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzaWduaW5nUmVxdWVzdC5zaWduaW5nRGF0YTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGFjdGlvbj8uc2lnbmluZ0RhdGE/LnR5cGUpIHtcbiAgICAgIC8vIFJlcXVlc3QgdHlwZXMgdGhhdCB3ZSBrbm93IG1heSByZXF1aXJlIGEgZmVlXG4gICAgICBjYXNlIFJwY01ldGhvZC5CSVRDT0lOX1NFTkRfVFJBTlNBQ1RJT046XG4gICAgICBjYXNlIFJwY01ldGhvZC5BVkFMQU5DSEVfU0VORF9UUkFOU0FDVElPTjpcbiAgICAgIGNhc2UgUnBjTWV0aG9kLkVUSF9TRU5EX1RSQU5TQUNUSU9OOlxuICAgICAgICByZXR1cm4gYWN0aW9uLnNpZ25pbmdEYXRhO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwgW2FjdGlvbiwgaXNGZWVTZWxlY3RvckVuYWJsZWQsIHR4SW5kZXhdKTtcblxuICBjb25zdCB1cGRhdGVGZWUgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAobWF4RmVlUmF0ZTogYmlnaW50LCBtYXhUaXBSYXRlPzogYmlnaW50KSA9PiB7XG4gICAgICBpZiAoIWFjdGlvbj8uYWN0aW9uSWQgfHwgIWlzRmVlU2VsZWN0b3JFbmFibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV3RmVlQ29uZmlnID1cbiAgICAgICAgc2lnbmluZ0RhdGE/LnR5cGUgPT09IFJwY01ldGhvZC5CSVRDT0lOX1NFTkRfVFJBTlNBQ1RJT05cbiAgICAgICAgICA/IHsgZmVlUmF0ZTogTnVtYmVyKG1heEZlZVJhdGUpIH1cbiAgICAgICAgICA6IHsgbWF4RmVlUmF0ZSwgbWF4VGlwUmF0ZSB9O1xuXG4gICAgICBhd2FpdCByZXF1ZXN0PFVwZGF0ZUFjdGlvblR4RGF0YUhhbmRsZXI+KHtcbiAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LkFDVElPTl9VUERBVEVfVFhfREFUQSxcbiAgICAgICAgcGFyYW1zOlxuICAgICAgICAgIHR5cGVvZiB0eEluZGV4ID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgPyBbYWN0aW9uLmFjdGlvbklkLCBuZXdGZWVDb25maWddXG4gICAgICAgICAgICA6IFthY3Rpb24uYWN0aW9uSWQsIG5ld0ZlZUNvbmZpZywgdHhJbmRleF0sXG4gICAgICB9KTtcbiAgICB9LFxuICAgIFtcbiAgICAgIGFjdGlvbj8uYWN0aW9uSWQsXG4gICAgICBpc0ZlZVNlbGVjdG9yRW5hYmxlZCxcbiAgICAgIHJlcXVlc3QsXG4gICAgICBzaWduaW5nRGF0YT8udHlwZSxcbiAgICAgIHR4SW5kZXgsXG4gICAgXSxcbiAgKTtcblxuICBjb25zdCBnZXRGZWVJbmZvID0gdXNlQ2FsbGJhY2soKGRhdGE6IFNpZ25pbmdEYXRhIHwgTXVsdGlUeEZlZURhdGEpID0+IHtcbiAgICBpZiAoaXNNdWx0aVR4RmVlRGF0YShkYXRhKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGltaXQ6IE51bWJlcihkYXRhLmdhc0xpbWl0ID8/IDBuKSxcbiAgICAgICAgZmVlUmF0ZTogZGF0YS5mZWVSYXRlID8/IDBuLFxuICAgICAgICBtYXhUaXBSYXRlOiBkYXRhLm1heFRpcFJhdGUgPz8gMG4sXG4gICAgICB9O1xuICAgIH1cbiAgICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgICAgY2FzZSBScGNNZXRob2QuQVZBTEFOQ0hFX1NJR05fTUVTU0FHRTpcbiAgICAgIGNhc2UgUnBjTWV0aG9kLkVUSF9TSUdOOlxuICAgICAgY2FzZSBScGNNZXRob2QuUEVSU09OQUxfU0lHTjoge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFVuYWJsZSB0byByZW5kZXIgZmVlIHdpZGdldCBmb3Igbm9uLXRyYW5zYWN0aW9uICgke2RhdGEudHlwZX0pYCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY2FzZSBScGNNZXRob2QuQklUQ09JTl9TRU5EX1RSQU5TQUNUSU9OOiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZmVlUmF0ZTogQmlnSW50KGRhdGEuZGF0YS5mZWVSYXRlKSxcbiAgICAgICAgICBsaW1pdDogTWF0aC5jZWlsKGRhdGEuZGF0YS5mZWUgLyBkYXRhLmRhdGEuZmVlUmF0ZSkgfHwgMCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY2FzZSBScGNNZXRob2QuRVRIX1NFTkRfVFJBTlNBQ1RJT046IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmZWVSYXRlOiBkYXRhLmRhdGEubWF4RmVlUGVyR2FzID8gQmlnSW50KGRhdGEuZGF0YS5tYXhGZWVQZXJHYXMpIDogMG4sXG4gICAgICAgICAgbWF4VGlwUmF0ZTogZGF0YS5kYXRhLm1heFByaW9yaXR5RmVlUGVyR2FzXG4gICAgICAgICAgICA/IEJpZ0ludChkYXRhLmRhdGEubWF4UHJpb3JpdHlGZWVQZXJHYXMpXG4gICAgICAgICAgICA6IDBuLFxuICAgICAgICAgIGxpbWl0OiBOdW1iZXIoZGF0YS5kYXRhLmdhc0xpbWl0ID8/IDApLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZW5kZXIgZmVlIHdpZGdldCBmb3IgJHtkYXRhLnR5cGV9YCk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgY29uc3QgaGFzRW5vdWdoRm9yTmV0d29ya0ZlZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghbmF0aXZlVG9rZW4/LmJhbGFuY2UgfHwgIXNpZ25pbmdEYXRhKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgaW5mbyA9IGdldEZlZUluZm8oc2lnbmluZ0RhdGEpO1xuICAgIGNvbnN0IG5lZWQgPSBpbmZvLmZlZVJhdGUgKiBCaWdJbnQoaW5mby5saW1pdCk7XG5cbiAgICByZXR1cm4gbmF0aXZlVG9rZW4uYmFsYW5jZSA+IG5lZWQ7XG4gIH0sIFtnZXRGZWVJbmZvLCBuYXRpdmVUb2tlbj8uYmFsYW5jZSwgc2lnbmluZ0RhdGFdKTtcblxuICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBnYXMgdG9rZW4gYmFsYW5jZXMgZm9yIHRoZSB0cmFuc2FjdGlvbidzIGNoYWluXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFhY3RpdmVBY2NvdW50IHx8ICFuZXR3b3JrPy5jaGFpbklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdXBkYXRlQmFsYW5jZU9uTmV0d29ya3MoW2FjdGl2ZUFjY291bnRdLCBbbmV0d29yay5jaGFpbklkXSk7XG4gIH0sIFthY3RpdmVBY2NvdW50LCBuZXR3b3JrPy5jaGFpbklkLCB1cGRhdGVCYWxhbmNlT25OZXR3b3Jrc10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgbmF0aXZlQmFsYW5jZSA9IG5hdGl2ZVRva2VuPy5iYWxhbmNlO1xuXG4gICAgaWYgKCFuYXRpdmVCYWxhbmNlIHx8ICFzaWduaW5nRGF0YSB8fCAhaXNGZWVTZWxlY3RvckVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmZvID0gZ2V0RmVlSW5mbyhzaWduaW5nRGF0YSk7XG4gICAgY29uc3QgbmVlZCA9IGluZm8uZmVlUmF0ZSAqIEJpZ0ludChpbmZvLmxpbWl0KTtcblxuICAgIHNldEZlZUVycm9yKFxuICAgICAgbmF0aXZlVG9rZW4uYmFsYW5jZSA+PSBuZWVkXG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDogU2VuZEVycm9yTWVzc2FnZS5JTlNVRkZJQ0lFTlRfQkFMQU5DRV9GT1JfRkVFLFxuICAgICk7XG4gIH0sIFtnZXRGZWVJbmZvLCBpc0ZlZVNlbGVjdG9yRW5hYmxlZCwgbmF0aXZlVG9rZW4/LmJhbGFuY2UsIHNpZ25pbmdEYXRhXSk7XG5cbiAgY29uc3QgW21heEZlZVBlckdhcywgc2V0TWF4RmVlUGVyR2FzXSA9IHVzZVN0YXRlKFxuICAgIGdldEluaXRpYWxGZWVSYXRlKHNpZ25pbmdEYXRhKSxcbiAgKTtcbiAgY29uc3QgW21heFByaW9yaXR5RmVlUGVyR2FzLCBzZXRNYXhQcmlvcml0eUZlZVBlckdhc10gPSB1c2VTdGF0ZShcbiAgICBuZXR3b3JrRmVlPy5sb3c/Lm1heFByaW9yaXR5RmVlUGVyR2FzLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFuZXR3b3JrRmVlIHx8ICFpc0ZlZVNlbGVjdG9yRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEluaXRpYWxpemUgZmVlIGNvbmZpZyB3aXRoIGRlZmF1bHQgdmFsdWVzIGlmIHRoZXkgYXJlIG5vdCBzZXQgYXQgYWxsXG4gICAgc2V0TWF4RmVlUGVyR2FzKChwcmV2aW91cykgPT4gcHJldmlvdXMgPz8gbmV0d29ya0ZlZS5sb3cubWF4RmVlUGVyR2FzKTtcbiAgICBzZXRNYXhQcmlvcml0eUZlZVBlckdhcyhcbiAgICAgIChwcmV2aW91cykgPT4gcHJldmlvdXMgPz8gbmV0d29ya0ZlZS5sb3cubWF4UHJpb3JpdHlGZWVQZXJHYXMsXG4gICAgKTtcbiAgfSwgW25ldHdvcmtGZWUsIGlzRmVlU2VsZWN0b3JFbmFibGVkXSk7XG5cbiAgY29uc3Qgc2V0Q3VzdG9tRmVlID0gdXNlQ2FsbGJhY2soXG4gICAgKHZhbHVlczoge1xuICAgICAgbWF4RmVlUGVyR2FzOiBiaWdpbnQ7XG4gICAgICBmZWVUeXBlOiBHYXNGZWVNb2RpZmllcjtcbiAgICAgIG1heFByaW9yaXR5RmVlUGVyR2FzOiBiaWdpbnQ7XG4gICAgfSkgPT4ge1xuICAgICAgc2V0TWF4RmVlUGVyR2FzKHZhbHVlcy5tYXhGZWVQZXJHYXMpO1xuICAgICAgc2V0TWF4UHJpb3JpdHlGZWVQZXJHYXModmFsdWVzLm1heFByaW9yaXR5RmVlUGVyR2FzKTtcbiAgICAgIHNldEdhc0ZlZU1vZGlmaWVyKHZhbHVlcy5mZWVUeXBlKTtcbiAgICB9LFxuICAgIFtdLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XG5cbiAgICBpZiAoIW5ldHdvcmsgfHwgIWlzRmVlU2VsZWN0b3JFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIElmIHRoZSByZXF1ZXN0IGNvbWVzIGZyb20gYSBkQXBwLCBhIGRpZmZlcmVudCBuZXR3b3JrIG1heSBiZSBhY3RpdmUsXG4gICAgLy8gc28gd2UgbmVlZCB0byBmZXRjaCBjdXJyZW50IGZlZXMgZm9yIEJpdGNvaW4gc3BlY2lmaWNhbGx5LlxuICAgIGdldE5ldHdvcmtGZWUobmV0d29yay5jYWlwSWQpLnRoZW4oKGZlZSkgPT4ge1xuICAgICAgaWYgKGlzTW91bnRlZCkge1xuICAgICAgICBzZXROZXR3b3JrRmVlKGZlZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaXNNb3VudGVkID0gZmFsc2U7XG4gICAgfTtcbiAgfSwgW2dldE5ldHdvcmtGZWUsIGlzRmVlU2VsZWN0b3JFbmFibGVkLCBuZXR3b3JrXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodHlwZW9mIG1heEZlZVBlckdhcyA9PT0gJ3VuZGVmaW5lZCcgfHwgIWlzRmVlU2VsZWN0b3JFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XG5cbiAgICBzZXRJc0NhbGN1bGF0aW5nRmVlKHRydWUpO1xuICAgIHVwZGF0ZUZlZShtYXhGZWVQZXJHYXMsIG1heFByaW9yaXR5RmVlUGVyR2FzKVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICBpZiAoIWlzTW91bnRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXRGZWVFcnJvcihlcnIpO1xuICAgICAgfSlcbiAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgaWYgKCFpc01vdW50ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2V0SXNDYWxjdWxhdGluZ0ZlZShmYWxzZSk7XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9LCBbXG4gICAgaXNGZWVTZWxlY3RvckVuYWJsZWQsXG4gICAgbWF4RmVlUGVyR2FzLFxuICAgIG1heFByaW9yaXR5RmVlUGVyR2FzLFxuICAgIHVwZGF0ZUZlZSxcbiAgICB0eEluZGV4LFxuICBdKTtcblxuICBjb25zdCByZW5kZXJGZWVXaWRnZXQgPSB1c2VDYWxsYmFjayhcbiAgICAocHJvcHM/OiBQYXJ0aWFsPEN1c3RvbUdhc0ZlZXNQcm9wcz4pID0+IHtcbiAgICAgIGlmICghbmV0d29ya0ZlZSB8fCAhc2lnbmluZ0RhdGEpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8U3RhY2sgc3g9e3sgZ2FwOiAwLjUsIGp1c3RpZnlDb250ZW50OiAnZmxleC1zdGFydCcgfX0+XG4gICAgICAgICAgICA8U2tlbGV0b24gdmFyaWFudD1cInRleHRcIiB3aWR0aD17MTIwfSAvPlxuICAgICAgICAgICAgPFNrZWxldG9uIHZhcmlhbnQ9XCJyb3VuZGVkXCIgaGVpZ2h0PXsxMjh9IC8+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBmZWVSYXRlLCBsaW1pdCB9ID0gZ2V0RmVlSW5mbyhzaWduaW5nRGF0YSk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDdXN0b21GZWVzXG4gICAgICAgICAgbWF4RmVlUGVyR2FzPXtmZWVSYXRlfVxuICAgICAgICAgIGxpbWl0PXtsaW1pdH1cbiAgICAgICAgICBvbkNoYW5nZT17c2V0Q3VzdG9tRmVlfVxuICAgICAgICAgIHNlbGVjdGVkR2FzRmVlTW9kaWZpZXI9e2dhc0ZlZU1vZGlmaWVyfVxuICAgICAgICAgIG5ldHdvcms9e25ldHdvcmt9XG4gICAgICAgICAgbmV0d29ya0ZlZT17bmV0d29ya0ZlZX1cbiAgICAgICAgICBpc0JhdGNoQXBwcm92YWxTY3JlZW49e2lzQmF0Y2hBcHByb3ZhbFNjcmVlbn1cbiAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sXG4gICAgW1xuICAgICAgZ2FzRmVlTW9kaWZpZXIsXG4gICAgICBnZXRGZWVJbmZvLFxuICAgICAgaXNCYXRjaEFwcHJvdmFsU2NyZWVuLFxuICAgICAgbmV0d29yayxcbiAgICAgIG5ldHdvcmtGZWUsXG4gICAgICBzZXRDdXN0b21GZWUsXG4gICAgICBzaWduaW5nRGF0YSxcbiAgICBdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgaXNDYWxjdWxhdGluZ0ZlZSxcbiAgICBoYXNFbm91Z2hGb3JOZXR3b3JrRmVlLFxuICAgIHJlbmRlckZlZVdpZGdldCxcbiAgICBmZWVFcnJvcixcbiAgfTtcbn1cbiIsImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgaXNWaWRlbywgaXNJbWFnZURhcmsgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBJbWFnZVdyYXBwZXIgfSBmcm9tICcuL0ltYWdlV3JhcHBlcic7XG5pbXBvcnQgeyBJbWFnZVdpdGhGYWxsYmFjayB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vSW1hZ2VXaXRoRmFsbGJhY2snO1xuaW1wb3J0IHsgaXBmc1Jlc29sdmVyV2l0aEZhbGxiYWNrIH0gZnJvbSAnQHNyYy91dGlscy9pcHNmUmVzb2x2ZXJXaXRoRmFsbGJhY2snO1xuaW1wb3J0IHtcbiAgQ2hpcCxcbiAgU3RhY2ssXG4gIHN0eWxlZCxcbiAgVHJpYW5nbGVSaWdodEljb24sXG4gIEFycm93c01heGltaXplSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuY29uc3QgTmZ0SW1hZ2UgPSBzdHlsZWQoSW1hZ2VXaXRoRmFsbGJhY2spPHtcbiAgd2lkdGg/OiBzdHJpbmc7XG4gIGhlaWdodD86IHN0cmluZztcbiAgbWF4V2lkdGg/OiBzdHJpbmc7XG4gIG1heEhlaWdodD86IHN0cmluZztcbiAgaG92ZXI/OiBib29sZWFuO1xuICBoYXNCb3JkZXJSYWRpdXM/OiBib29sZWFuO1xuICBib3JkZXJSYWRpdXM/OiBzdHJpbmc7XG4gIHNob3dQb2ludGVyPzogYm9vbGVhbjtcbn0+YFxuICB3aWR0aDogJHsoeyB3aWR0aCB9KSA9PiB3aWR0aCA/PyAnMzJweCd9O1xuICBoZWlnaHQ6ICR7KHsgaGVpZ2h0IH0pID0+IGhlaWdodCA/PyAnMzJweCd9O1xuICBtYXgtd2lkdGg6ICR7KHsgbWF4V2lkdGggfSkgPT4gbWF4V2lkdGggPz8gJ3Vuc2V0J307XG4gIG1heC1oZWlnaHQ6ICR7KHsgbWF4SGVpZ2h0IH0pID0+IG1heEhlaWdodCA/PyAndW5zZXQnfTtcbiAgYm9yZGVyOiAxcHggc29saWQgJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja30xQWB9O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBmaWx0ZXI6IGRyb3Atc2hhZG93KFxuICAgIDBweCAxMHB4IDI1cHggJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja300MGB9XG4gICk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigyNXB4KTtcbiAgYm9yZGVyLXJhZGl1czogJHsoeyBoYXNCb3JkZXJSYWRpdXMsIGJvcmRlclJhZGl1cyB9KSA9PlxuICAgIGhhc0JvcmRlclJhZGl1cyA/IChib3JkZXJSYWRpdXMgPz8gJzhweCcpIDogJ25vbmUnfTtcbiAgY3Vyc29yOiAkeyh7IHNob3dQb2ludGVyIH0pID0+IChzaG93UG9pbnRlciA/ICdkZWZhdWx0JyA6ICdwb2ludGVyJyl9O1xuYDtcblxuY29uc3QgTmZ0VmlkZW8gPSBzdHlsZWQoJ3ZpZGVvJyk8e1xuICB3aWR0aD86IHN0cmluZztcbiAgaGVpZ2h0Pzogc3RyaW5nO1xuICBtYXhXaWR0aD86IHN0cmluZztcbiAgbWF4SGVpZ2h0Pzogc3RyaW5nO1xuICBob3Zlcj86IGJvb2xlYW47XG4gIGJvcmRlclJhZGl1cz86IHN0cmluZztcbn0+YFxuICB3aWR0aDogJHsoeyB3aWR0aCB9KSA9PiB3aWR0aCA/PyAnMzJweCd9O1xuICBtYXgtd2lkdGg6ICR7KHsgbWF4V2lkdGggfSkgPT4gbWF4V2lkdGggPz8gJ3Vuc2V0J307XG4gIGhlaWdodDogJHsoeyBoZWlnaHQgfSkgPT4gaGVpZ2h0ID8/ICczMnB4J307XG4gIG1heC1oZWlnaHQ6ICR7KHsgbWF4SGVpZ2h0IH0pID0+IG1heEhlaWdodCA/PyAndW5zZXQnfTtcbiAgYm9yZGVyOiAxcHggc29saWQgJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja30xQWB9O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBmaWx0ZXI6IGRyb3Atc2hhZG93KFxuICAgIDBweCAxMHB4IDI1cHggJHsoeyB0aGVtZSB9KSA9PiBgJHt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja300MGB9XG4gICk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigyNXB4KTtcbiAgYm9yZGVyLXJhZGl1czogJHsoeyBib3JkZXJSYWRpdXMgfSkgPT4gYm9yZGVyUmFkaXVzID8/ICc4cHgnfTtcbmA7XG5cbmludGVyZmFjZSBDb2xsZWN0aWJsZU1lZGlhUHJvcHMge1xuICB1cmw/OiBzdHJpbmc7XG4gIHdpZHRoPzogc3RyaW5nO1xuICBoZWlnaHQ/OiBzdHJpbmc7XG4gIG1heFdpZHRoPzogc3RyaW5nO1xuICBtYXhIZWlnaHQ/OiBzdHJpbmc7XG4gIGhvdmVyPzogYm9vbGVhbjtcbiAgbWFyZ2luPzogc3RyaW5nO1xuICBzaG93UGxheUljb24/OiBib29sZWFuO1xuICBjb250cm9scz86IGJvb2xlYW47XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbiAgYm9yZGVyUmFkaXVzPzogc3RyaW5nO1xuICBzaG93QmFsYW5jZT86IGJvb2xlYW47XG4gIGJhbGFuY2U/OiBiaWdpbnQ7XG4gIHNob3dFeHBhbmRPcHRpb24/OiBib29sZWFuO1xuICBub0FjdGlvbj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb2xsZWN0aWJsZU1lZGlhKHtcbiAgdXJsLFxuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBtYXhXaWR0aCxcbiAgbWF4SGVpZ2h0LFxuICBob3ZlciA9IGZhbHNlLFxuICBtYXJnaW4sXG4gIHNob3dQbGF5SWNvbiA9IHRydWUsXG4gIGNvbnRyb2xzID0gZmFsc2UsXG4gIGNsYXNzTmFtZSxcbiAgYm9yZGVyUmFkaXVzID0gJzhweCcsXG4gIHNob3dCYWxhbmNlID0gZmFsc2UsXG4gIGJhbGFuY2UgPSAwbixcbiAgc2hvd0V4cGFuZE9wdGlvbiA9IGZhbHNlLFxuICBub0FjdGlvbiA9IGZhbHNlLFxufTogQ29sbGVjdGlibGVNZWRpYVByb3BzKSB7XG4gIGNvbnN0IFtpc0ltYWdlRnVsbFNjcmVlbiwgc2V0SXNJbWFnZUZ1bGxTY3JlZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbc2hvdWxkVXNlTGlnaHRJY29uLCBzZXRTaG91bGRVc2VMaWdodEljb25dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNNZWRpYVNldHRsZWQsIHNldElzTWVkaWFTZXR0bGVkXSA9IHVzZVN0YXRlKGZhbHNlKTsgLy8gRWl0aGVyIGxvYWRlZCBvciBlcnJvcmVkIG91dC5cblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgbWFyZ2luLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgIH19XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICBtYXhXaWR0aDogbWF4V2lkdGggPyBtYXhXaWR0aCA6ICd1bnNldCcsXG4gICAgICAgICAgd2lkdGg6IHdpZHRoID8gd2lkdGggOiAnMzJweCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICBjb2x1bW5HYXA6IDEsXG4gICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgIG1yOiAzLFxuICAgICAgICAgIG10OiAxLFxuICAgICAgICAgIHByOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7c2hvd0JhbGFuY2UgJiYgaXNNZWRpYVNldHRsZWQgJiYgKFxuICAgICAgICAgIDxDaGlwXG4gICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAodGhlbWUpID0+XG4gICAgICAgICAgICAgICAgc2hvdWxkVXNlTGlnaHRJY29uID8gJ3ByaW1hcnkubGlnaHQnIDogdGhlbWUucGFsZXR0ZS5ncmV5WzYwMF0sXG4gICAgICAgICAgICAgIGNvbG9yOiBzaG91bGRVc2VMaWdodEljb25cbiAgICAgICAgICAgICAgICA/ICdwcmltYXJ5LmNvbnRyYXN0VGV4dCdcbiAgICAgICAgICAgICAgICA6ICdwcmltYXJ5LmxpZ2h0JyxcbiAgICAgICAgICAgICAgcHg6IDEsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgbGFiZWw9e2JhbGFuY2UudG9TdHJpbmcoKX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgICB7c2hvd0V4cGFuZE9wdGlvbiAmJiAoXG4gICAgICAgICAgPEFycm93c01heGltaXplSWNvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRJc0ltYWdlRnVsbFNjcmVlbih0cnVlKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBzaXplPVwiMjRcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgY29sb3I6IHNob3VsZFVzZUxpZ2h0SWNvblxuICAgICAgICAgICAgICAgID8gJ3ByaW1hcnkubGlnaHQnXG4gICAgICAgICAgICAgICAgOiAncHJpbWFyeS5jb250cmFzdFRleHQnLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG4gICAgICB7aXNWaWRlbyh1cmwpID8gKFxuICAgICAgICA8U3RhY2sgc3g9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIGZsZXhEaXJlY3Rpb246ICdyb3cnIH19PlxuICAgICAgICAgIDxOZnRWaWRlb1xuICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBtYXhXaWR0aD17bWF4V2lkdGh9XG4gICAgICAgICAgICBtYXhIZWlnaHQ9e21heEhlaWdodH1cbiAgICAgICAgICAgIGhvdmVyPXtob3Zlcn1cbiAgICAgICAgICAgIGNvbnRyb2xzPXtjb250cm9sc31cbiAgICAgICAgICAgIGJvcmRlclJhZGl1cz17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsvKiBpbmxpbmluZyB0aGlzIGNvbW1lbnQgcmVzdWx0cyBpbiBlc2xpbnQgcGFyc2UgZXJyb3IgKi99XG4gICAgICAgICAgICB7LyogZXNsaW50LWRpc2FibGUgcmVhY3Qvbm8tdW5rbm93bi1wcm9wZXJ0eSAqL31cbiAgICAgICAgICAgIDxzb3VyY2VcbiAgICAgICAgICAgICAgc3JjPXtpcGZzUmVzb2x2ZXJXaXRoRmFsbGJhY2sodXJsKX1cbiAgICAgICAgICAgICAgb25Mb2FkU3RhcnQ9eygpID0+IHNldElzTWVkaWFTZXR0bGVkKHRydWUpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHsvKiBlc2xpbnQtZW5hYmxlIHJlYWN0L25vLXVua25vd24tcHJvcGVydHkgKi99XG4gICAgICAgICAgPC9OZnRWaWRlbz5cbiAgICAgICAgICB7c2hvd1BsYXlJY29uICYmIChcbiAgICAgICAgICAgIDxUcmlhbmdsZVJpZ2h0SWNvblxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogJzhweCcsXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICc4cHgnLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnY29tbW9uLndoaXRlJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICkgOiAoXG4gICAgICAgIDxJbWFnZVdyYXBwZXJcbiAgICAgICAgICBpc092ZXJsYXk9e2lzSW1hZ2VGdWxsU2NyZWVufVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGlmICghc2hvd0JhbGFuY2UgJiYgIW5vQWN0aW9uKSBzZXRJc0ltYWdlRnVsbFNjcmVlbih0cnVlKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldElzSW1hZ2VGdWxsU2NyZWVuKGZhbHNlKX1cbiAgICAgICAgICBiYWNrZHJvcEltYWdlVXJsPXt1cmx9XG4gICAgICAgICAgc2hvdWxkVXNlTGlnaHRJY29uPXtzaG91bGRVc2VMaWdodEljb259XG4gICAgICAgID5cbiAgICAgICAgICA8TmZ0SW1hZ2VcbiAgICAgICAgICAgIHdpZHRoPXtpc0ltYWdlRnVsbFNjcmVlbiA/ICcxMDAlJyA6IHdpZHRofVxuICAgICAgICAgICAgaGVpZ2h0PXtpc0ltYWdlRnVsbFNjcmVlbiA/ICdhdXRvJyA6IGhlaWdodH1cbiAgICAgICAgICAgIHNyYz17dXJsfVxuICAgICAgICAgICAgbWF4V2lkdGg9e21heFdpZHRofVxuICAgICAgICAgICAgbWF4SGVpZ2h0PXttYXhIZWlnaHR9XG4gICAgICAgICAgICBob3Zlcj17aG92ZXJ9XG4gICAgICAgICAgICBoYXNCb3JkZXJSYWRpdXM9eyFpc0ltYWdlRnVsbFNjcmVlbn1cbiAgICAgICAgICAgIGJvcmRlclJhZGl1cz17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgc2hvd1BvaW50ZXI9e3Nob3dFeHBhbmRPcHRpb259XG4gICAgICAgICAgICBvbkxvYWQ9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBpbWFnZUVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICAgIGlmIChpbWFnZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaXNJbWFnZURhcmsoaW1hZ2VFbGVtZW50LCAoaXNEYXJrKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXRTaG91bGRVc2VMaWdodEljb24oaXNEYXJrKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzZXRJc01lZGlhU2V0dGxlZCh0cnVlKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkVycm9yPXsoKSA9PiBzZXRJc01lZGlhU2V0dGxlZCh0cnVlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0ltYWdlV3JhcHBlcj5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJveCxcbiAgQ2hldnJvbkxlZnRJY29uLFxuICBJY29uQnV0dG9uLFxuICBTdGFjayxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IE92ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL092ZXJsYXknO1xuaW1wb3J0IHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCc7XG5pbnRlcmZhY2UgSW1hZ2VXcmFwcGVyUHJvcHMge1xuICBpc092ZXJsYXk6IGJvb2xlYW47XG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQ7XG4gIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XG4gIGJhY2tkcm9wSW1hZ2VVcmw/OiBzdHJpbmc7XG4gIHNob3VsZFVzZUxpZ2h0SWNvbjogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEltYWdlV3JhcHBlcih7XG4gIGlzT3ZlcmxheSxcbiAgb25DbGljayxcbiAgb25DbG9zZSxcbiAgYmFja2Ryb3BJbWFnZVVybCxcbiAgc2hvdWxkVXNlTGlnaHRJY29uLFxuICBjaGlsZHJlbixcbn06IFByb3BzV2l0aENoaWxkcmVuPEltYWdlV3JhcHBlclByb3BzPikge1xuICBpZiAoaXNPdmVybGF5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxPdmVybGF5PlxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke2JhY2tkcm9wSW1hZ2VVcmx9KWAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogJ2NvdmVyJyxcbiAgICAgICAgICAgIGJhY2tncm91bmRSZXBlYXQ6ICduby1yZXBlYXQnLFxuICAgICAgICAgICAgZmlsdGVyOiAnYmx1cigxNnB4KScsXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBweDogMSxcbiAgICAgICAgICAgICAgcHk6IDQsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYWdlLXRpdGxlLWJhY2stYnV0dG9uXCJcbiAgICAgICAgICAgICAgZGlzYWJsZVJpcHBsZVxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHA6IDAsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxDaGV2cm9uTGVmdEljb25cbiAgICAgICAgICAgICAgICBzaXplPXszMn1cbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgY29sb3I6IHNob3VsZFVzZUxpZ2h0SWNvblxuICAgICAgICAgICAgICAgICAgICA/ICdwcmltYXJ5LmxpZ2h0J1xuICAgICAgICAgICAgICAgICAgICA6ICdwcmltYXJ5LmNvbnRyYXN0VGV4dCcsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvT3ZlcmxheT5cbiAgICApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPFN0YWNrIG9uQ2xpY2s9e29uQ2xpY2t9IHN4PXt7IHdpZHRoOiAnMTAwJScsIGZsZXhEaXJlY3Rpb246ICdyb3cnIH19PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJleHBvcnQgY29uc3QgaXNWaWRlbyA9ICh1cmw/OiBzdHJpbmcpID0+XG4gIHVybCAmJiBbJy5tcDQnLCAnLndlYm0nLCAnLm9nZyddLmluY2x1ZGVzKHVybC5zbGljZSh1cmwubGFzdEluZGV4T2YoJy4nKSkpO1xuXG5leHBvcnQgY29uc3QgaXNJbWFnZURhcmsgPSAoXG4gIGltZzogSFRNTEltYWdlRWxlbWVudCxcbiAgY2FsbGJhY2s6IChiOiBib29sZWFuKSA9PiB2b2lkLFxuKSA9PiB7XG4gIGxldCBjb2xvclN1bSA9IDA7XG5cbiAgaWYgKCFpbWcpIHtcbiAgICAvLyBEZWZhdWx0IHZhbHVlIGlzIHRydWUgKERhcmsgaW1hZ2UgTW9kZSlcbiAgICByZXR1cm4gY2FsbGJhY2sodHJ1ZSk7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgaWYgKCFjdHgpIHtcbiAgICAgIC8vIERlZmF1bHQgdmFsdWUgaXMgdHJ1ZSAoRGFyayBpbWFnZSBNb2RlKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRydWUpO1xuICAgIH1cblxuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcblxuICAgIC8vIHdlIG5lZWQgdG8ga25vdyB0aGUgdG9wIHJpZ2h0IHF1YXRlcidzIGF2ZXJhZ2UgY29sb3JcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmZsb29yKGNhbnZhcy5oZWlnaHQgLyAyKTtcbiAgICBjb25zdCB3aWR0aCA9IE1hdGguZmxvb3IoY2FudmFzLndpZHRoIC8gMik7XG4gICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSh3aWR0aCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgY29uc3QgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xuXG4gICAgZm9yIChsZXQgeCA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyB4IDwgbGVuOyB4ICs9IDQpIHtcbiAgICAgIGNvbnN0IHIgPSBkYXRhW3hdO1xuICAgICAgY29uc3QgZyA9IGRhdGFbeCArIDFdO1xuICAgICAgY29uc3QgYiA9IGRhdGFbeCArIDJdO1xuXG4gICAgICBpZiAociA9PT0gdW5kZWZpbmVkIHx8IGcgPT09IHVuZGVmaW5lZCB8fCBiID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmRlZmluZWQgY29sb3InKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXZnID0gTWF0aC5mbG9vcigociArIGcgKyBiKSAvIDMpO1xuICAgICAgY29sb3JTdW0gKz0gYXZnO1xuICAgIH1cblxuICAgIGNvbnN0IGJyaWdodG5lc3MgPSBNYXRoLmZsb29yKGNvbG9yU3VtIC8gKHdpZHRoICogaGVpZ2h0KSk7XG4gICAgLy9CcmlnaHRuZXNzIGlzIG91dCBvZiAyNTUuXG4gICAgcmV0dXJuIGNhbGxiYWNrKGJyaWdodG5lc3MgPCAxMjcuNSk7XG4gIH0gY2F0Y2gge1xuICAgIC8vIERlZmF1bHQgdmFsdWUgaXMgdHJ1ZSAoRGFyayBpbWFnZSBNb2RlKVxuICAgIHJldHVybiBjYWxsYmFjayh0cnVlKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHVzZUN1cnJlbmNpZXNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9DdXJyZW5jaWVzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcbmltcG9ydCB7IGdldEN1cnJlbmN5Rm9ybWF0dGVyIH0gZnJvbSAnQHNyYy9jb250ZXh0cy91dGlscy9nZXRDdXJyZW5jeUZvcm1hdHRlcic7XG5cbnR5cGUgQ3VycmVuY3lDb252ZXJ0ZXIgPSAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xuXG5leHBvcnQgY29uc3QgdXNlQ29udmVydGVkQ3VycmVuY3lGb3JtYXR0ZXIgPSAoXG4gIHNvdXJjZUN1cnJlbmN5ID0gJ1VTRCcsXG4pOiBDdXJyZW5jeUNvbnZlcnRlciA9PiB7XG4gIGNvbnN0IHsgY29udmVydCwgaGFzRXhjaGFuZ2VSYXRlIH0gPSB1c2VDdXJyZW5jaWVzQ29udGV4dCgpO1xuICBjb25zdCB7IGN1cnJlbmN5OiB0YXJnZXRDdXJyZW5jeSwgY3VycmVuY3lGb3JtYXR0ZXIgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICBjb25zdCBmYWxsYmFja0Zvcm1hdHRlciA9IHVzZU1lbW8oXG4gICAgKCkgPT4gZ2V0Q3VycmVuY3lGb3JtYXR0ZXIoc291cmNlQ3VycmVuY3kpLFxuICAgIFtzb3VyY2VDdXJyZW5jeV0sXG4gICk7XG4gIGNvbnN0IGNhbkNvbnZlcnQgPSB1c2VNZW1vKFxuICAgICgpID0+IGhhc0V4Y2hhbmdlUmF0ZShzb3VyY2VDdXJyZW5jeSwgdGFyZ2V0Q3VycmVuY3kpLFxuICAgIFtzb3VyY2VDdXJyZW5jeSwgdGFyZ2V0Q3VycmVuY3ksIGhhc0V4Y2hhbmdlUmF0ZV0sXG4gICk7XG4gIGNvbnN0IG5lZWRzQ29udmVyc2lvbiA9IGNhbkNvbnZlcnQgJiYgdGFyZ2V0Q3VycmVuY3kgIT09IHNvdXJjZUN1cnJlbmN5O1xuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIW5lZWRzQ29udmVyc2lvbikge1xuICAgICAgcmV0dXJuIGZhbGxiYWNrRm9ybWF0dGVyO1xuICAgIH1cblxuICAgIHJldHVybiAodmFsdWU6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgY29udmVydGVkID0gY29udmVydCh7XG4gICAgICAgIGFtb3VudDogdmFsdWUsXG4gICAgICAgIGZyb206IHNvdXJjZUN1cnJlbmN5LFxuICAgICAgICB0bzogdGFyZ2V0Q3VycmVuY3ksXG4gICAgICB9KSBhcyBudW1iZXI7XG5cbiAgICAgIHJldHVybiBjdXJyZW5jeUZvcm1hdHRlcihjb252ZXJ0ZWQpO1xuICAgIH07XG4gIH0sIFtcbiAgICBjb252ZXJ0LFxuICAgIGN1cnJlbmN5Rm9ybWF0dGVyLFxuICAgIGZhbGxiYWNrRm9ybWF0dGVyLFxuICAgIG5lZWRzQ29udmVyc2lvbixcbiAgICBzb3VyY2VDdXJyZW5jeSxcbiAgICB0YXJnZXRDdXJyZW5jeSxcbiAgXSk7XG59O1xuIiwiaW1wb3J0IHtcbiAgQWxlcnQsXG4gIEFsZXJ0Q29udGVudCxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG4gIFJlbW92ZU1vZGVyYXRvckljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmludGVyZmFjZSBBbGVydEJveFByb3BzIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQWxlcnRCb3goeyB0aXRsZSwgdGV4dCB9OiBBbGVydEJveFByb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxBbGVydFxuICAgICAgc2V2ZXJpdHk9XCJlcnJvclwiXG4gICAgICBpY29uPXtcbiAgICAgICAgPFJlbW92ZU1vZGVyYXRvckljb24gc2l6ZT17MjR9IGNvbG9yPXt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja30gLz5cbiAgICAgIH1cbiAgICAgIHN4PXt7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2Vycm9yLmxpZ2h0JyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBjb2xvcjogJ2NvbW1vbi5ibGFjaycsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxBbGVydENvbnRlbnQ+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6IDYwMCwgZGlzcGxheTogJ2Jsb2NrJyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3RpdGxlfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgZGlzcGxheTogJ2Jsb2NrJyB9fT5cbiAgICAgICAgICB7dGV4dH1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPC9BbGVydENvbnRlbnQ+XG4gICAgPC9BbGVydD5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJ1dHRvbixcbiAgRGlhbG9nLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG4gIFJlbW92ZU1vZGVyYXRvckljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmludGVyZmFjZSBBbGVydERpYWxvZ1Byb3BzIHtcbiAgY2FuY2VsSGFuZGxlcjogKCkgPT4gdm9pZDtcbiAgb3BlbjogYm9vbGVhbjtcbiAgb25DbG9zZTogKCkgPT4gdm9pZDtcbiAgdGl0bGU6IHN0cmluZztcbiAgdGV4dDogc3RyaW5nO1xuICByZWplY3RMYWJlbDogc3RyaW5nO1xuICBwcm9jZWVkTGFiZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFsZXJ0RGlhbG9nKHtcbiAgY2FuY2VsSGFuZGxlcixcbiAgb3BlbixcbiAgb25DbG9zZSxcbiAgdGl0bGUsXG4gIHRleHQsXG4gIHJlamVjdExhYmVsLFxuICBwcm9jZWVkTGFiZWwsXG59OiBBbGVydERpYWxvZ1Byb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgcmV0dXJuIChcbiAgICA8RGlhbG9nXG4gICAgICBvcGVuPXtvcGVufVxuICAgICAgc2hvd0Nsb3NlSWNvblxuICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgIFBhcGVyUHJvcHM9e3tcbiAgICAgICAgc3g6IHtcbiAgICAgICAgICBtOiAyLFxuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICBtYXhXaWR0aDogJ25vbmUnLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBweTogMyxcbiAgICAgICAgICBweDogNSxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgd2lkdGg6ICcyMjVweCcsXG4gICAgICAgICAgICBnYXA6IDEuNSxcbiAgICAgICAgICAgIHB5OiAxNCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFJlbW92ZU1vZGVyYXRvckljb25cbiAgICAgICAgICAgIHNpemU9ezQ4fVxuICAgICAgICAgICAgY29sb3I9e3RoZW1lLmN1c3RvbVBhbGV0dGUuYXZhbGFuY2hlUmVkfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgIHN4PXt7IGNvbG9yOiB0aGVtZS5jdXN0b21QYWxldHRlLmF2YWxhbmNoZVJlZCwgcHg6IDIgfX1cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJoNFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj57dGV4dH08L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBnYXA6IDEsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImNvbm5lY3QtcmVqZWN0LWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGNhbmNlbEhhbmRsZXIoKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3JlamVjdExhYmVsfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdC1hcHByb3ZlLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtwcm9jZWVkTGFiZWx9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvRGlhbG9nPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgQWxlcnQsXG4gIEFsZXJ0Q29udGVudCxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG4gIEdwcE1heWJlSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW50ZXJmYWNlIFdhcm5pbmdCb3hQcm9wcyB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFdhcm5pbmdCb3goeyB0aXRsZSwgdGV4dCB9OiBXYXJuaW5nQm94UHJvcHMpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICByZXR1cm4gKFxuICAgIDxBbGVydFxuICAgICAgc2V2ZXJpdHk9XCJ3YXJuaW5nXCJcbiAgICAgIGljb249ezxHcHBNYXliZUljb24gc2l6ZT17MjR9IGNvbG9yPXt0aGVtZS5wYWxldHRlLmNvbW1vbi5ibGFja30gLz59XG4gICAgICBzeD17e1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3YXJuaW5nLmxpZ2h0JyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHB4OiAyLFxuICAgICAgICBjb2xvcjogJ2NvbW1vbi5ibGFjaycsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxBbGVydENvbnRlbnQ+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6IDYwMCwgZGlzcGxheTogJ2Jsb2NrJyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3RpdGxlfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgZGlzcGxheTogJ2Jsb2NrJyB9fT5cbiAgICAgICAgICB7dGV4dH1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPC9BbGVydENvbnRlbnQ+XG4gICAgPC9BbGVydD5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEFjY29yZGlvbixcbiAgQWNjb3JkaW9uU3VtbWFyeSxcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIEFjY29yZGlvbkRldGFpbHMsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBDb2xsZWN0aWJsZU1lZGlhIH0gZnJvbSAnQHNyYy9wYWdlcy9Db2xsZWN0aWJsZXMvY29tcG9uZW50cy9Db2xsZWN0aWJsZU1lZGlhJztcbmltcG9ydCB7XG4gIFRyYW5zYWN0aW9uVG9rZW5DYXJkLFxuICBUcmFuc2FjdGlvblRva2VuQ2FyZFZhcmlhbnQsXG59IGZyb20gJy4vVHJhbnNhY3Rpb25Ub2tlbkNhcmQnO1xuaW1wb3J0IHtcbiAgTmV0d29ya0NvbnRyYWN0VG9rZW4sXG4gIE5ldHdvcmtUb2tlbixcbiAgVG9rZW5EaWZmSXRlbSxcbn0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxuaW50ZXJmYWNlIE5mdEFjY29yZGlvblByb3BzIHtcbiAgZGlmZkl0ZW1zOiBUb2tlbkRpZmZJdGVtW107XG4gIHRva2VuOiBOZXR3b3JrQ29udHJhY3RUb2tlbiB8IE5ldHdvcmtUb2tlbjtcbiAgdmFyaWFudDogVHJhbnNhY3Rpb25Ub2tlbkNhcmRWYXJpYW50O1xufVxuXG5leHBvcnQgY29uc3QgTmZ0QWNjb3JkaW9uID0gKHtcbiAgdG9rZW4sXG4gIGRpZmZJdGVtcyxcbiAgdmFyaWFudCxcbn06IE5mdEFjY29yZGlvblByb3BzKSA9PiB7XG4gIGlmICghZGlmZkl0ZW1zLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8QWNjb3JkaW9uIHN4PXt7IGJvcmRlcjogJ25vbmUnLCBwOiAwLCBtOiAwLCBtdDogLTEgfX0+XG4gICAgICA8QWNjb3JkaW9uU3VtbWFyeSBzeD17eyBwOiAwLCBtOiAwIH19PlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBtbDogLTEsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxDb2xsZWN0aWJsZU1lZGlhXG4gICAgICAgICAgICBoZWlnaHQ9XCIzMnB4XCJcbiAgICAgICAgICAgIHdpZHRoPVwiYXV0b1wiXG4gICAgICAgICAgICBtYXhXaWR0aD1cIjMycHhcIlxuICAgICAgICAgICAgdXJsPXt0b2tlbi5sb2dvVXJpfVxuICAgICAgICAgICAgaG92ZXI9e2ZhbHNlfVxuICAgICAgICAgICAgc2hvd1BsYXlJY29uPXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiaDZcIlxuICAgICAgICAgICAgZm9udFdlaWdodD1cImZvbnRXZWlnaHRTZW1pYm9sZFwiXG4gICAgICAgICAgICBzeD17eyBtbDogMiB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0b2tlbi5uYW1lfSB7ZGlmZkl0ZW1zLmxlbmd0aCA/IGAoJHtkaWZmSXRlbXMubGVuZ3RofSlgIDogJyd9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9BY2NvcmRpb25TdW1tYXJ5PlxuXG4gICAgICA8QWNjb3JkaW9uRGV0YWlscyBzeD17eyBib3JkZXI6ICdub25lJywgcDogMCB9fT5cbiAgICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMS41IH19PlxuICAgICAgICAgIHtkaWZmSXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPFRyYW5zYWN0aW9uVG9rZW5DYXJkXG4gICAgICAgICAgICAgIGtleT17YHRva2VuLWdyb3VwLSR7dmFyaWFudH0tJHtcbiAgICAgICAgICAgICAgICAnYWRkcmVzcycgaW4gdG9rZW4gPyB0b2tlbi5hZGRyZXNzIDogdG9rZW4uc3ltYm9sXG4gICAgICAgICAgICAgIH0tJHtpbmRleH1gfVxuICAgICAgICAgICAgICB0b2tlbj17dG9rZW59XG4gICAgICAgICAgICAgIGRpZmZJdGVtPXtpdGVtfVxuICAgICAgICAgICAgICB2YXJpYW50PXt2YXJpYW50fVxuICAgICAgICAgICAgICBzeD17eyBwOiAwIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9BY2NvcmRpb25EZXRhaWxzPlxuICAgIDwvQWNjb3JkaW9uPlxuICApO1xufTtcbiIsImltcG9ydCBicm93c2VyIGZyb20gJ3dlYmV4dGVuc2lvbi1wb2x5ZmlsbCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEJveCxcbiAgQnV0dG9uLFxuICBGb3JtQ29udHJvbExhYmVsLFxuICBSYWRpbyxcbiAgUmFkaW9Hcm91cCxcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7IEJOSW5wdXQgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0JOSW5wdXQnO1xuaW1wb3J0IHsgUGFnZVRpdGxlIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9QYWdlVGl0bGUnO1xuaW1wb3J0IHsgRG9tYWluTWV0YWRhdGEgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvbW9kZWxzJztcbmltcG9ydCB7IExpbWl0LCBTcGVuZExpbWl0IH0gZnJvbSAnLi9Ub2tlblNwZW5kTGltaXQnO1xuaW1wb3J0IHsgRVJDMjBUb2tlbiB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbmNvbnN0IFNwZW5kTGltaXRPcHRpb24gPSAoeyBsYWJlbCwgdmFsdWUsIGNoZWNrZWQsIC4uLnByb3BzIH0pID0+IChcbiAgPEZvcm1Db250cm9sTGFiZWxcbiAgICBsYWJlbD17bGFiZWx9XG4gICAgdmFsdWU9e3ZhbHVlfVxuICAgIGNvbnRyb2w9ezxSYWRpbyBzaXplPVwibWVkaXVtXCIgY29sb3I9e2NoZWNrZWQgPyAnc2Vjb25kYXJ5JyA6ICdwcmltYXJ5J30gLz59XG4gICAgc3g9e3tcbiAgICAgICcuTXVpRm9ybUNvbnRyb2xMYWJlbC1sYWJlbCc6IHtcbiAgICAgICAgZm9udFNpemU6ICdib2R5Mi5mb250U2l6ZScsXG4gICAgICAgIGZvbnRXZWlnaHQ6IGNoZWNrZWQgPyAnZm9udFdlaWdodFNlbWlib2xkJyA6ICdmb250V2VpZ2h0UmVndWxhcicsXG4gICAgICB9LFxuICAgIH19XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIEN1c3RvbVNwZW5kTGltaXQoe1xuICBzcGVuZExpbWl0LFxuICB0b2tlbixcbiAgb25DbG9zZSxcbiAgc2V0U3BlbmRMaW1pdCxcbiAgcmVxdWVzdGVkQXBwcm92YWxMaW1pdCxcbiAgc2l0ZSxcbn06IHtcbiAgdG9rZW46IEVSQzIwVG9rZW47XG4gIHNldFNwZW5kTGltaXQobGltaXREYXRhOiBTcGVuZExpbWl0KTogdm9pZDtcbiAgb25DbG9zZSgpOiB2b2lkO1xuICBzcGVuZExpbWl0OiBTcGVuZExpbWl0O1xuICBzaXRlPzogRG9tYWluTWV0YWRhdGE7XG4gIHJlcXVlc3RlZEFwcHJvdmFsTGltaXQ/OiBiaWdpbnQ7XG59KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCBbY3VzdG9tU3BlbmRMaW1pdCwgc2V0Q3VzdG9tU3BlbmRMaW1pdF0gPSB1c2VTdGF0ZTxTcGVuZExpbWl0Pih7XG4gICAgLi4uc3BlbmRMaW1pdCxcbiAgfSk7XG5cbiAgY29uc3QgaGFuZGxlT25TYXZlID0gKCkgPT4ge1xuICAgIHNldFNwZW5kTGltaXQoY3VzdG9tU3BlbmRMaW1pdCk7XG4gICAgb25DbG9zZSgpO1xuICB9O1xuXG4gIGNvbnN0IGlzRnJvbUV4dGVuc2lvbiA9IHNpdGU/LmRvbWFpbiA9PT0gYnJvd3Nlci5ydW50aW1lLmlkO1xuICBjb25zdCBhcHBOYW1lID1cbiAgICAoaXNGcm9tRXh0ZW5zaW9uXG4gICAgICA/IGJyb3dzZXIucnVudGltZS5nZXRNYW5pZmVzdCgpLnNob3J0X25hbWVcbiAgICAgIDogc2l0ZT8uZG9tYWluKSA/PyB0KCdVbmtub3duIFNpdGUnKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogJzEwMCUnLCBnYXA6IDMgfX0+XG4gICAgICA8UGFnZVRpdGxlIG9uQmFja0NsaWNrPXsoKSA9PiBvbkNsb3NlKCl9IG1hcmdpbj1cIjBcIj5cbiAgICAgICAge3QoJ0VkaXQgU3BlbmRpbmcgTGltaXQnKX1cbiAgICAgIDwvUGFnZVRpdGxlPlxuXG4gICAgICA8U3RhY2sgc3g9e3sgcHg6IDIsIGdhcDogMyB9fT5cbiAgICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMS41LCBtYXhXaWR0aDogMSB9fT5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZm9udFNpemU6ICdib2R5Mi5mb250U2l6ZScsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnU3BlbmRpbmcgbGltaXQnKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICBtYXhXaWR0aDogMSxcbiAgICAgICAgICAgICAgd29yZFdyYXA6ICdicmVhay13b3JkJyxcbiAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUcmFuc1xuICAgICAgICAgICAgICBpMThuS2V5PVwiU2V0IGEgbGltaXQgdGhhdCB5b3Ugd2lsbCBhbGxvdyA8Yj57e2RvbWFpbn19PC9iPiB0byBhdXRvbWF0aWNhbGx5IHNwZW5kLlwiXG4gICAgICAgICAgICAgIHZhbHVlcz17eyBkb21haW46IGFwcE5hbWUgfX1cbiAgICAgICAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgICAgICAgIGI6IDxiIHN0eWxlPXt7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnRleHQucHJpbWFyeSB9fSAvPixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8UmFkaW9Hcm91cFxuICAgICAgICAgIHN4PXt7IGdhcDogMiB9fVxuICAgICAgICAgIG9uQ2hhbmdlPXsoX2V2LCBsaW1pdFR5cGUpID0+IHtcbiAgICAgICAgICAgIHNldEN1c3RvbVNwZW5kTGltaXQoe1xuICAgICAgICAgICAgICAuLi5jdXN0b21TcGVuZExpbWl0LFxuICAgICAgICAgICAgICBsaW1pdFR5cGU6IGxpbWl0VHlwZSBhcyBMaW1pdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH19XG4gICAgICAgICAgdmFsdWU9e2N1c3RvbVNwZW5kTGltaXQubGltaXRUeXBlfVxuICAgICAgICA+XG4gICAgICAgICAgPFNwZW5kTGltaXRPcHRpb25cbiAgICAgICAgICAgIGxhYmVsPXt0KCdVbmxpbWl0ZWQnKX1cbiAgICAgICAgICAgIHZhbHVlPXtMaW1pdC5VTkxJTUlURUR9XG4gICAgICAgICAgICBjaGVja2VkPXtjdXN0b21TcGVuZExpbWl0LmxpbWl0VHlwZSA9PT0gTGltaXQuVU5MSU1JVEVEfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMS41IH19PlxuICAgICAgICAgICAgPFNwZW5kTGltaXRPcHRpb25cbiAgICAgICAgICAgICAgbGFiZWw9e3QoJ0RlZmF1bHQnKX1cbiAgICAgICAgICAgICAgdmFsdWU9e0xpbWl0LkRFRkFVTFR9XG4gICAgICAgICAgICAgIGNoZWNrZWQ9e2N1c3RvbVNwZW5kTGltaXQubGltaXRUeXBlID09PSBMaW1pdC5ERUZBVUxUfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxCb3ggc3g9e3sgcGw6IDMgfX0+XG4gICAgICAgICAgICAgIDxCTklucHV0XG4gICAgICAgICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICB3aXRoTWF4QnV0dG9uPXtmYWxzZX1cbiAgICAgICAgICAgICAgICB2YWx1ZT17cmVxdWVzdGVkQXBwcm92YWxMaW1pdCA/PyAwbn1cbiAgICAgICAgICAgICAgICBkZW5vbWluYXRpb249e3Rva2VuLmRlY2ltYWxzfVxuICAgICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgZ2FwOiAxLjUgfX0+XG4gICAgICAgICAgICA8U3BlbmRMaW1pdE9wdGlvblxuICAgICAgICAgICAgICBsYWJlbD17dCgnQ3VzdG9tIFNwZW5kIExpbWl0Jyl9XG4gICAgICAgICAgICAgIHZhbHVlPXtMaW1pdC5DVVNUT019XG4gICAgICAgICAgICAgIGNoZWNrZWQ9e2N1c3RvbVNwZW5kTGltaXQubGltaXRUeXBlID09PSBMaW1pdC5DVVNUT019XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEJveCBzeD17eyBwbDogMyB9fT5cbiAgICAgICAgICAgICAgPEJOSW5wdXRcbiAgICAgICAgICAgICAgICB3aXRoTWF4QnV0dG9uPXtmYWxzZX1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXRDdXN0b21TcGVuZExpbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgLi4uY3VzdG9tU3BlbmRMaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLmJpZ2ludCxcbiAgICAgICAgICAgICAgICAgICAgbGltaXRUeXBlOiBMaW1pdC5DVVNUT00sXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGRlbm9taW5hdGlvbj17dG9rZW4uZGVjaW1hbHN9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ01heGltdW0gTGltaXQnKX1cbiAgICAgICAgICAgICAgICB2YWx1ZT17Y3VzdG9tU3BlbmRMaW1pdC52YWx1ZSA/PyAwbn0gLy8gVE9ETzogcHJvcGVybHkgaGFuZGxlIHplcm8gKEJOSW5wdXQgc2VlcyB6ZXJvIGFzIGFuIGVtcHR5IHZhbHVlKVxuICAgICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9SYWRpb0dyb3VwPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIHB0OiAwLFxuICAgICAgICAgIHB4OiAyLFxuICAgICAgICAgIHBiOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uIGNvbG9yPVwicHJpbWFyeVwiIHNpemU9XCJsYXJnZVwiIG9uQ2xpY2s9e2hhbmRsZU9uU2F2ZX0gZnVsbFdpZHRoPlxuICAgICAgICAgIHt0KCdTYXZlJyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEVSQzExNTVUb2tlbixcbiAgRVJDNzIxVG9rZW4sXG4gIFRva2VuQXBwcm92YWwsXG59IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbmltcG9ydCB7XG4gIEFwcHJvdmFsU2VjdGlvbixcbiAgQXBwcm92YWxTZWN0aW9uSGVhZGVyLFxufSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL0FwcHJvdmFsU2VjdGlvbic7XG5pbXBvcnQgeyBUcmFuc2FjdGlvblRva2VuQ2FyZCB9IGZyb20gJy4uL1RyYW5zYWN0aW9uVG9rZW5DYXJkJztcblxuZXhwb3J0IGZ1bmN0aW9uIE5mdFNwZW5kTGltaXQoe1xuICBhcHByb3ZhbCxcbn06IHtcbiAgYXBwcm92YWw6IFRva2VuQXBwcm92YWwgJiB7IHRva2VuOiBFUkMxMTU1VG9rZW4gfCBFUkM3MjFUb2tlbiB9O1xufSkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPFN0YWNrPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uIHN4PXt7IHBiOiAxIH19PlxuICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXJcbiAgICAgICAgICAgIGxhYmVsPXt0KCdTcGVuZCBMaW1pdCcpfVxuICAgICAgICAgID48L0FwcHJvdmFsU2VjdGlvbkhlYWRlcj5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG5cbiAgICAgICAgPFRyYW5zYWN0aW9uVG9rZW5DYXJkXG4gICAgICAgICAgdG9rZW49e2FwcHJvdmFsLnRva2VufVxuICAgICAgICAgIGRpZmZJdGVtPXt7XG4gICAgICAgICAgICBkaXNwbGF5VmFsdWU6IGFwcHJvdmFsLnZhbHVlID8/ICcxJyxcbiAgICAgICAgICAgIHVzZFByaWNlOiBhcHByb3ZhbC51c2RQcmljZSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN4PXt7IHB5OiAyIH19XG4gICAgICAgIC8+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgVG9rZW5TcGVuZExpbWl0IH0gZnJvbSAnLi9Ub2tlblNwZW5kTGltaXQnO1xuaW1wb3J0IHsgTmZ0U3BlbmRMaW1pdCB9IGZyb20gJy4vTmZ0U3BlbmRMaW1pdCc7XG5pbXBvcnQge1xuICBFUkMxMTU1VG9rZW4sXG4gIEVSQzIwVG9rZW4sXG4gIEVSQzcyMVRva2VuLFxuICBUb2tlbkFwcHJvdmFsLFxuICBUb2tlbkFwcHJvdmFscyxcbiAgVG9rZW5UeXBlLFxufSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG50eXBlIFNwZW5kTGltaXRJbmZvUHJvcHMgPSBUb2tlbkFwcHJvdmFscyAmIHsgYWN0aW9uSWQ6IHN0cmluZyB9O1xuXG5leHBvcnQgY29uc3QgU3BlbmRMaW1pdEluZm8gPSAoe1xuICBhcHByb3ZhbHMsXG4gIGlzRWRpdGFibGUsXG4gIGFjdGlvbklkLFxufTogU3BlbmRMaW1pdEluZm9Qcm9wcykgPT4ge1xuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICB7YXBwcm92YWxzLm1hcCgoYXBwcm92YWwsIGluZGV4KSA9PiB7XG4gICAgICAgIHN3aXRjaCAoYXBwcm92YWwudG9rZW4udHlwZSkge1xuICAgICAgICAgIGNhc2UgVG9rZW5UeXBlLkVSQzcyMTpcbiAgICAgICAgICBjYXNlIFRva2VuVHlwZS5FUkMxMTU1OlxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPE5mdFNwZW5kTGltaXRcbiAgICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgIGFwcHJvdmFsPXtcbiAgICAgICAgICAgICAgICAgIGFwcHJvdmFsIGFzIFRva2VuQXBwcm92YWwgJiB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiBFUkMxMTU1VG9rZW4gfCBFUkM3MjFUb2tlbjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgY2FzZSBUb2tlblR5cGUuRVJDMjA6XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8VG9rZW5TcGVuZExpbWl0XG4gICAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICBhY3Rpb25JZD17YWN0aW9uSWR9XG4gICAgICAgICAgICAgICAgYXBwcm92YWw9e1xuICAgICAgICAgICAgICAgICAgYXBwcm92YWwgYXMgVG9rZW5BcHByb3ZhbCAmIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW46IEVSQzIwVG9rZW47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdpdGhUaXRsZT17aW5kZXggPT09IDB9XG4gICAgICAgICAgICAgICAgaXNFZGl0YWJsZT17aXNFZGl0YWJsZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0pfVxuICAgIDwvPlxuICApO1xufTtcbiIsImltcG9ydCB7IEJveCwgQnV0dG9uLCBEaWFsb2csIFN0YWNrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBBcHByb3ZhbFNlY3Rpb24sXG4gIEFwcHJvdmFsU2VjdGlvbkhlYWRlcixcbn0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9BcHByb3ZhbFNlY3Rpb24nO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQ3VzdG9tU3BlbmRMaW1pdCB9IGZyb20gJy4vQ3VzdG9tU3BlbmRMaW1pdCc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvblRva2VuQ2FyZCB9IGZyb20gJy4uL1RyYW5zYWN0aW9uVG9rZW5DYXJkJztcbmltcG9ydCB7IE1heFVpbnQyNTYgfSBmcm9tICdldGhlcnMnO1xuaW1wb3J0IHtcbiAgRGlzcGxheURhdGEsXG4gIEVSQzIwVG9rZW4sXG4gIFRva2VuQXBwcm92YWwsXG59IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyBUb2tlblVuaXQgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgeyB1c2VBcHByb3ZlQWN0aW9uIH0gZnJvbSAnQHNyYy9ob29rcy91c2VBcHByb3ZlQWN0aW9uJztcbmltcG9ydCB7IHVzZUNvbm5lY3Rpb25Db250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db25uZWN0aW9uUHJvdmlkZXInO1xuaW1wb3J0IHsgRXh0ZW5zaW9uUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9leHRlbnNpb25Db25uZWN0aW9uL21vZGVscyc7XG5pbXBvcnQgeyBVcGRhdGVBY3Rpb25UeERhdGFIYW5kbGVyIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvaGFuZGxlcnMvdXBkYXRlVHhEYXRhJztcblxuZXhwb3J0IGVudW0gTGltaXQge1xuICBERUZBVUxUID0gJ0RFRkFVTFQnLFxuICBVTkxJTUlURUQgPSAnVU5MSU1JVEVEJyxcbiAgQ1VTVE9NID0gJ0NVU1RPTScsXG59XG5leHBvcnQgY29uc3QgVU5MSU1JVEVEX1NQRU5EX0xJTUlUX0xBQkVMID0gJ1VubGltaXRlZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3BlbmRMaW1pdCB7XG4gIGxpbWl0VHlwZTogTGltaXQ7XG4gIHZhbHVlPzogYmlnaW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVG9rZW5TcGVuZExpbWl0KHtcbiAgYWN0aW9uSWQsXG4gIGFwcHJvdmFsLFxuICBpc0VkaXRhYmxlLFxuICB3aXRoVGl0bGUgPSB0cnVlLFxufToge1xuICBhY3Rpb25JZDogc3RyaW5nO1xuICBhcHByb3ZhbDogVG9rZW5BcHByb3ZhbCAmIHsgdG9rZW46IEVSQzIwVG9rZW4gfTtcbiAgaXNFZGl0YWJsZTogYm9vbGVhbjtcbiAgd2l0aFRpdGxlPzogYm9vbGVhbjtcbn0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGFjdGlvbiB9ID0gdXNlQXBwcm92ZUFjdGlvbjxEaXNwbGF5RGF0YT4oYWN0aW9uSWQpO1xuICBjb25zdCB7IHJlcXVlc3QgfSA9IHVzZUNvbm5lY3Rpb25Db250ZXh0KCk7XG4gIGNvbnN0IFtzaG93Q3VzdG9tU3BlbmRMaW1pdCwgc2V0U2hvd0N1c3RvbVNwZW5kTGltaXRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbY3VzdG9tU3BlbmRMaW1pdCwgc2V0Q3VzdG9tU3BlbmRMaW1pdF0gPSB1c2VTdGF0ZTxTcGVuZExpbWl0Pih7XG4gICAgbGltaXRUeXBlOiBMaW1pdC5ERUZBVUxULFxuICB9KTtcblxuICBjb25zdCBzZXRTcGVuZExpbWl0ID0gdXNlQ2FsbGJhY2soXG4gICAgKGN1c3RvbVNwZW5kRGF0YTogU3BlbmRMaW1pdCkgPT4ge1xuICAgICAgbGV0IGxpbWl0QW1vdW50ID0gMG47XG5cbiAgICAgIGlmIChjdXN0b21TcGVuZERhdGEubGltaXRUeXBlID09PSBMaW1pdC5VTkxJTUlURUQpIHtcbiAgICAgICAgc2V0Q3VzdG9tU3BlbmRMaW1pdCh7XG4gICAgICAgICAgLi4uY3VzdG9tU3BlbmREYXRhLFxuICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIH0pO1xuICAgICAgICBsaW1pdEFtb3VudCA9IE1heFVpbnQyNTY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRDdXN0b21TcGVuZExpbWl0KGN1c3RvbVNwZW5kRGF0YSk7XG4gICAgICAgIGxpbWl0QW1vdW50ID1cbiAgICAgICAgICBjdXN0b21TcGVuZERhdGEubGltaXRUeXBlID09PSBMaW1pdC5DVVNUT01cbiAgICAgICAgICAgID8gKGN1c3RvbVNwZW5kRGF0YS52YWx1ZSA/PyAwbilcbiAgICAgICAgICAgIDogQmlnSW50KGFwcHJvdmFsLnZhbHVlID8/IDBuKTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3Q8VXBkYXRlQWN0aW9uVHhEYXRhSGFuZGxlcj4oe1xuICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuQUNUSU9OX1VQREFURV9UWF9EQVRBLFxuICAgICAgICBwYXJhbXM6IFthY3Rpb25JZCwgeyBhcHByb3ZhbExpbWl0OiBgMHgke2xpbWl0QW1vdW50LnRvU3RyaW5nKDE2KX1gIH1dLFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBbYWN0aW9uSWQsIHJlcXVlc3QsIGFwcHJvdmFsLnZhbHVlXSxcbiAgKTtcblxuICBjb25zdCBpc0luZmluaXRlID0gY3VzdG9tU3BlbmRMaW1pdC5saW1pdFR5cGUgPT09IExpbWl0LlVOTElNSVRFRDtcbiAgY29uc3QgZGlmZkl0ZW1WYWx1ZSA9IGlzSW5maW5pdGVcbiAgICA/IG51bGxcbiAgICA6IG5ldyBUb2tlblVuaXQoXG4gICAgICAgIGN1c3RvbVNwZW5kTGltaXQubGltaXRUeXBlID09PSBMaW1pdC5ERUZBVUxUXG4gICAgICAgICAgPyB0eXBlb2YgYXBwcm92YWwudmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICA/IEJpZ0ludChhcHByb3ZhbC52YWx1ZSlcbiAgICAgICAgICAgIDogKGFwcHJvdmFsLnZhbHVlID8/IDBuKVxuICAgICAgICAgIDogKGN1c3RvbVNwZW5kTGltaXQudmFsdWUgPz8gJzAnKSxcbiAgICAgICAgYXBwcm92YWwudG9rZW4uZGVjaW1hbHMsXG4gICAgICAgICcnLFxuICAgICAgKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8RGlhbG9nIGZ1bGxTY3JlZW4gb3Blbj17c2hvd0N1c3RvbVNwZW5kTGltaXR9PlxuICAgICAgICA8Qm94XG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgcHk6IDIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxDdXN0b21TcGVuZExpbWl0XG4gICAgICAgICAgICBzZXRTcGVuZExpbWl0PXtzZXRTcGVuZExpbWl0fVxuICAgICAgICAgICAgc3BlbmRMaW1pdD17Y3VzdG9tU3BlbmRMaW1pdH1cbiAgICAgICAgICAgIHJlcXVlc3RlZEFwcHJvdmFsTGltaXQ9e0JpZ0ludChhcHByb3ZhbC52YWx1ZSA/PyAnMCcpfVxuICAgICAgICAgICAgc2l0ZT17YWN0aW9uPy5zaXRlfVxuICAgICAgICAgICAgdG9rZW49e2FwcHJvdmFsLnRva2VufVxuICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2hvd0N1c3RvbVNwZW5kTGltaXQoZmFsc2UpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvQm94PlxuICAgICAgPC9EaWFsb2c+XG5cbiAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSB9fT5cbiAgICAgICAge3dpdGhUaXRsZSAmJiAoXG4gICAgICAgICAgPEFwcHJvdmFsU2VjdGlvbiBzeD17eyBwYjogMSB9fT5cbiAgICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ1NwZW5kIExpbWl0Jyl9PlxuICAgICAgICAgICAgICB7aXNFZGl0YWJsZSAmJiBhcHByb3ZhbC52YWx1ZSAmJiAoXG4gICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgICAgIHN4PXt7IHB4OiAwLCBtaW5XaWR0aDogJ2F1dG8nIH19XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93Q3VzdG9tU3BlbmRMaW1pdCh0cnVlKX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dCgnRWRpdCcpfVxuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25IZWFkZXI+XG4gICAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgICl9XG4gICAgICAgIDxUcmFuc2FjdGlvblRva2VuQ2FyZFxuICAgICAgICAgIHN4PXt7IHB5OiAyIH19XG4gICAgICAgICAgdG9rZW49e3tcbiAgICAgICAgICAgIC4uLmFwcHJvdmFsLnRva2VuLFxuICAgICAgICAgICAgbG9nb1VyaTogYXBwcm92YWwubG9nb1VyaSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIGRpZmZJdGVtPXt7XG4gICAgICAgICAgICBkaXNwbGF5VmFsdWU6IGlzSW5maW5pdGVcbiAgICAgICAgICAgICAgPyB0KCdVbmxpbWl0ZWQnKVxuICAgICAgICAgICAgICA6IChkaWZmSXRlbVZhbHVlIGFzIFRva2VuVW5pdCkudG9EaXNwbGF5KCksXG4gICAgICAgICAgICB1c2RQcmljZTogYXBwcm92YWwudXNkUHJpY2UsXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBDYXJkLFxuICBTdGFjayxcbiAgU3hQcm9wcyxcbiAgVGhlbWUsXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQge1xuICBUb2tlblR5cGUsXG4gIHR5cGUgRVJDMTE1NVRva2VuLFxuICB0eXBlIEVSQzcyMVRva2VuLFxuICB0eXBlIE5ldHdvcmtDb250cmFjdFRva2VuLFxuICB0eXBlIE5ldHdvcmtUb2tlbixcbiAgdHlwZSBUb2tlbkRpZmZJdGVtLFxufSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgVG9rZW5JY29uIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkljb24nO1xuaW1wb3J0IHsgQ29sbGVjdGlibGVNZWRpYSB9IGZyb20gJ0BzcmMvcGFnZXMvQ29sbGVjdGlibGVzL2NvbXBvbmVudHMvQ29sbGVjdGlibGVNZWRpYSc7XG5pbXBvcnQgeyB1c2VDb252ZXJ0ZWRDdXJyZW5jeUZvcm1hdHRlciB9IGZyb20gJ0BzcmMvcGFnZXMvRGVGaS9ob29rcy91c2VDb252ZXJ0ZWRDdXJyZW5jeUZvcm1hdHRlcic7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBlbnVtIFRyYW5zYWN0aW9uVG9rZW5DYXJkVmFyaWFudCB7XG4gIFNFTkQgPSAnU0VORCcsXG4gIFJFQ0VJVkUgPSAnUkVDRUlWRScsXG4gIERFRkFVTFQgPSAnREVGQVVMVCcsXG59XG5cbmNvbnN0IGlzTmZ0VG9rZW4gPSAoXG4gIHRva2VuOiBOZXR3b3JrVG9rZW4gfCBOZXR3b3JrQ29udHJhY3RUb2tlbixcbik6IHRva2VuIGlzIEVSQzcyMVRva2VuIHwgRVJDMTE1NVRva2VuID0+XG4gICd0eXBlJyBpbiB0b2tlbiAmJlxuICAodG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkVSQzExNTUgfHwgdG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkVSQzcyMSk7XG5cbmV4cG9ydCBjb25zdCBUcmFuc2FjdGlvblRva2VuQ2FyZCA9ICh7XG4gIHRva2VuLFxuICBkaWZmSXRlbSxcbiAgdmFyaWFudCA9IFRyYW5zYWN0aW9uVG9rZW5DYXJkVmFyaWFudC5ERUZBVUxULFxuICBzeCA9IHt9LFxufToge1xuICB0b2tlbjogTmV0d29ya1Rva2VuIHwgTmV0d29ya0NvbnRyYWN0VG9rZW47XG4gIHZhcmlhbnQ/OiBUcmFuc2FjdGlvblRva2VuQ2FyZFZhcmlhbnQ7XG4gIGRpZmZJdGVtOiBUb2tlbkRpZmZJdGVtO1xuICBzeD86IFN4UHJvcHM8VGhlbWU+O1xufSkgPT4ge1xuICBjb25zdCBjdXJyZW5jeUZvcm1hdHRlciA9IHVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyKCk7XG4gIGNvbnN0IFtoYXNOYW1lT3ZlcmZsb3csIHNldEhhc05hbWVPdmVyZmxvd10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3Qgb3ZlcmZsb3dpbmdUZXh0ID0gdXNlUmVmPEhUTUxTcGFuRWxlbWVudD4obnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoY2hlY2tPdmVyZmxvdyhvdmVyZmxvd2luZ1RleHQuY3VycmVudCkpIHtcbiAgICAgIHNldEhhc05hbWVPdmVyZmxvdyh0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0SGFzTmFtZU92ZXJmbG93KGZhbHNlKTtcbiAgfSwgW292ZXJmbG93aW5nVGV4dF0pO1xuXG4gIGNvbnN0IGNoZWNrT3ZlcmZsb3cgPSAodGV4dENvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50IHwgbnVsbCk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICh0ZXh0Q29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0ZXh0Q29udGFpbmVyLm9mZnNldEhlaWdodCA8IHRleHRDb250YWluZXIuc2Nyb2xsSGVpZ2h0IHx8XG4gICAgICAgIHRleHRDb250YWluZXIub2Zmc2V0V2lkdGggPCB0ZXh0Q29udGFpbmVyLnNjcm9sbFdpZHRoXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgYW1vdW50Q29sb3IgPVxuICAgIHZhcmlhbnQgPT09IFRyYW5zYWN0aW9uVG9rZW5DYXJkVmFyaWFudC5TRU5EXG4gICAgICA/ICdlcnJvci5saWdodCdcbiAgICAgIDogdmFyaWFudCA9PT0gVHJhbnNhY3Rpb25Ub2tlbkNhcmRWYXJpYW50LlJFQ0VJVkVcbiAgICAgICAgPyAnc3VjY2Vzcy5saWdodCdcbiAgICAgICAgOiAndGV4dC5wcmltYXJ5JztcblxuICByZXR1cm4gKFxuICAgIDxDYXJkXG4gICAgICBzeD17e1xuICAgICAgICBweTogJzEwcHgnLFxuICAgICAgICBweDogMixcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTBweCcsXG4gICAgICAgIC4uLnN4LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIHN4PXt7IHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBmbGV4OiAwIH19PlxuICAgICAgICAgIHtpc05mdFRva2VuKHRva2VuKSA/IChcbiAgICAgICAgICAgIDxDb2xsZWN0aWJsZU1lZGlhXG4gICAgICAgICAgICAgIGhlaWdodD1cIjMycHhcIlxuICAgICAgICAgICAgICB3aWR0aD1cImF1dG9cIlxuICAgICAgICAgICAgICBtYXhXaWR0aD1cIjMycHhcIlxuICAgICAgICAgICAgICB1cmw9e3Rva2VuLmxvZ29Vcml9XG4gICAgICAgICAgICAgIGhvdmVyPXtmYWxzZX1cbiAgICAgICAgICAgICAgbWFyZ2luPVwiOHB4IDBcIlxuICAgICAgICAgICAgICBzaG93UGxheUljb249e2ZhbHNlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFRva2VuSWNvblxuICAgICAgICAgICAgICB3aWR0aD1cIjMycHhcIlxuICAgICAgICAgICAgICBoZWlnaHQ9XCIzMnB4XCJcbiAgICAgICAgICAgICAgc3JjPXt0b2tlbi5sb2dvVXJpfVxuICAgICAgICAgICAgICBuYW1lPXt0b2tlbi5uYW1lfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICAgIHN4PXt7IG1sOiAyLCB3aWR0aDogJzEwMCUnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxuICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgICBzeD17eyB3aWR0aDogJzEwMCUnIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgcGxhY2VtZW50PVwiYm90dG9tXCJcbiAgICAgICAgICAgICAgdGl0bGU9ezxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+e3Rva2VuLm5hbWV9PC9UeXBvZ3JhcGh5Pn1cbiAgICAgICAgICAgICAgZGlzYWJsZUhvdmVyTGlzdGVuZXI9eyFoYXNOYW1lT3ZlcmZsb3d9XG4gICAgICAgICAgICAgIGRpc2FibGVGb2N1c0xpc3RlbmVyPXshaGFzTmFtZU92ZXJmbG93fVxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgIHJlZj17b3ZlcmZsb3dpbmdUZXh0fVxuICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImg2XCJcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCJmb250V2VpZ2h0U2VtaWJvbGRcIlxuICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dG9rZW4ubmFtZX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICA8U3RhY2sgYWxpZ25JdGVtcz1cImZsZXgtZW5kXCI+XG4gICAgICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgYWxpZ25JdGVtcz1cImZsZXgtZW5kXCI+XG4gICAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgICAgcGxhY2VtZW50PVwiYm90dG9tXCJcbiAgICAgICAgICAgICAgICB0aXRsZT17XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICB7dmFyaWFudCA9PT0gVHJhbnNhY3Rpb25Ub2tlbkNhcmRWYXJpYW50LlNFTkQgPyAnLScgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAge2RpZmZJdGVtLmRpc3BsYXlWYWx1ZX0ge3Rva2VuLnN5bWJvbH1cbiAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYW1vdW50Q29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLFxuICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3ZhcmlhbnQgPT09IFRyYW5zYWN0aW9uVG9rZW5DYXJkVmFyaWFudC5TRU5EID8gJy0nIDogJyd9XG4gICAgICAgICAgICAgICAgICAgIHtkaWZmSXRlbS5kaXNwbGF5VmFsdWV9XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICB7J3N5bWJvbCcgaW4gdG9rZW4gJiYgKFxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIG1sOiBkaWZmSXRlbS5kaXNwbGF5VmFsdWUgIT09IHVuZGVmaW5lZCA/IDAuNCA6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYW1vdW50Q29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt0b2tlbi5zeW1ib2x9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICAgIHtkaWZmSXRlbS51c2RQcmljZSAmJiAoXG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgICAgICAgIHtjdXJyZW5jeUZvcm1hdHRlclxuICAgICAgICAgICAgICAgICAgPyBjdXJyZW5jeUZvcm1hdHRlcihOdW1iZXIoZGlmZkl0ZW0udXNkUHJpY2UpKVxuICAgICAgICAgICAgICAgICAgOiBkaWZmSXRlbS51c2RQcmljZX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L0NhcmQ+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgQWxlcnQsXG4gIEFsZXJ0VGl0bGUsXG4gIEFsZXJ0VHJpYW5nbGVJY29uLFxuICBTdGFjayxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBBcHByb3ZhbFNlY3Rpb24sXG4gIEFwcHJvdmFsU2VjdGlvbkJvZHksXG4gIEFwcHJvdmFsU2VjdGlvbkhlYWRlcixcbn0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9BcHByb3ZhbFNlY3Rpb24nO1xuaW1wb3J0IHtcbiAgVHJhbnNhY3Rpb25Ub2tlbkNhcmQsXG4gIFRyYW5zYWN0aW9uVG9rZW5DYXJkVmFyaWFudCxcbn0gZnJvbSAnLi9UcmFuc2FjdGlvblRva2VuQ2FyZCc7XG5pbXBvcnQgeyBOZnRBY2NvcmRpb24gfSBmcm9tICcuL05mdEFjY29yZGlvbic7XG5pbXBvcnQgeyBCYWxhbmNlQ2hhbmdlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcblxudHlwZSBUeEJhbGFuY2VDaGFuZ2VQcm9wcyA9IEJhbGFuY2VDaGFuZ2UgJiB7XG4gIGlzU2ltdWxhdGlvblN1Y2Nlc3NmdWw/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGNvbnN0IFR4QmFsYW5jZUNoYW5nZSA9ICh7XG4gIGlucyxcbiAgb3V0cyxcbiAgaXNTaW11bGF0aW9uU3VjY2Vzc2Z1bCxcbn06IFR4QmFsYW5jZUNoYW5nZVByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICBjb25zdCBoYXNTZW50SXRlbXMgPSBvdXRzLmxlbmd0aCA+IDA7XG4gIGNvbnN0IGhhc1JlY2VpdmVkSXRlbXMgPSBpbnMubGVuZ3RoID4gMDtcblxuICBjb25zdCBzaG93Tm9QcmVFeGVjV2FybmluZyA9IGlzU2ltdWxhdGlvblN1Y2Nlc3NmdWwgPT09IGZhbHNlOyAvLyBtYXkgYmUgdW5kZWZpbmVkXG4gIGNvbnN0IHNob3dOb0RhdGFXYXJuaW5nID1cbiAgICAhaGFzU2VudEl0ZW1zICYmICFoYXNSZWNlaXZlZEl0ZW1zICYmICFpc1NpbXVsYXRpb25TdWNjZXNzZnVsO1xuXG4gIHJldHVybiAoXG4gICAgPEFwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXJcbiAgICAgICAgbGFiZWw9e3QoJ0JhbGFuY2UgQ2hhbmdlJyl9XG4gICAgICAgIHRvb2x0aXA9e1xuICAgICAgICAgIHNob3dOb1ByZUV4ZWNXYXJuaW5nXG4gICAgICAgICAgICA/IHQoXG4gICAgICAgICAgICAgICAgJ1RyYW5zYWN0aW9uIHByZS1leHV0aW9uIGlzIHVuYXZhaWxhYmxlLiBUaGUgZGlzcGxheWVkIHRva2VuIGxpc3QgbWlnaHQgYmUgaW5jb21wbGV0ZS4nLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6ICcnXG4gICAgICAgIH1cbiAgICAgICAgdG9vbHRpcEljb249e1xuICAgICAgICAgIHNob3dOb1ByZUV4ZWNXYXJuaW5nID8gKFxuICAgICAgICAgICAgPEFsZXJ0VHJpYW5nbGVJY29uXG4gICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAnd2FybmluZy5tYWluJywgY3Vyc29yOiAncG9pbnRlcicgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICAvPlxuICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICAgIDxTdGFjayBnYXA9ezJ9PlxuICAgICAgICAgIHtvdXRzLm1hcCgoeyB0b2tlbiwgaXRlbXMgfSkgPT5cbiAgICAgICAgICAgIGl0ZW1zLmxlbmd0aCA9PT0gMSA/IChcbiAgICAgICAgICAgICAgPFRyYW5zYWN0aW9uVG9rZW5DYXJkXG4gICAgICAgICAgICAgICAga2V5PXtgc2VuZC10b2tlbi0ke1xuICAgICAgICAgICAgICAgICAgJ2FkZHJlc3MnIGluIHRva2VuID8gdG9rZW4uYWRkcmVzcyA6IHRva2VuLnN5bWJvbFxuICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9e1RyYW5zYWN0aW9uVG9rZW5DYXJkVmFyaWFudC5TRU5EfVxuICAgICAgICAgICAgICAgIHRva2VuPXt0b2tlbn1cbiAgICAgICAgICAgICAgICBkaWZmSXRlbT17aXRlbXNbMF0hfVxuICAgICAgICAgICAgICAgIHN4PXt7IHA6IDAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxOZnRBY2NvcmRpb25cbiAgICAgICAgICAgICAgICBrZXk9e2BzZW5kLXRva2VuLWdyb3VwLSR7XG4gICAgICAgICAgICAgICAgICAnYWRkcmVzcycgaW4gdG9rZW4gPyB0b2tlbi5hZGRyZXNzIDogdG9rZW4uc3ltYm9sXG4gICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgdG9rZW49e3Rva2VufVxuICAgICAgICAgICAgICAgIGRpZmZJdGVtcz17aXRlbXN9XG4gICAgICAgICAgICAgICAgdmFyaWFudD17VHJhbnNhY3Rpb25Ub2tlbkNhcmRWYXJpYW50LlNFTkR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApLFxuICAgICAgICAgICl9XG4gICAgICAgICAge2lucy5tYXAoKHsgdG9rZW4sIGl0ZW1zIH0pID0+XG4gICAgICAgICAgICBpdGVtcy5sZW5ndGggPT09IDEgPyAoXG4gICAgICAgICAgICAgIDxUcmFuc2FjdGlvblRva2VuQ2FyZFxuICAgICAgICAgICAgICAgIGtleT17YHJlY2VpdmUtdG9rZW4tJHtcbiAgICAgICAgICAgICAgICAgICdhZGRyZXNzJyBpbiB0b2tlbiA/IHRva2VuLmFkZHJlc3MgOiB0b2tlbi5zeW1ib2xcbiAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICB2YXJpYW50PXtUcmFuc2FjdGlvblRva2VuQ2FyZFZhcmlhbnQuUkVDRUlWRX1cbiAgICAgICAgICAgICAgICB0b2tlbj17dG9rZW59XG4gICAgICAgICAgICAgICAgZGlmZkl0ZW09e2l0ZW1zWzBdIX1cbiAgICAgICAgICAgICAgICBzeD17eyBwOiAwIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8TmZ0QWNjb3JkaW9uXG4gICAgICAgICAgICAgICAga2V5PXtgcmVjZWl2ZS10b2tlbi1ncm91cC0ke1xuICAgICAgICAgICAgICAgICAgJ2FkZHJlc3MnIGluIHRva2VuID8gdG9rZW4uYWRkcmVzcyA6IHRva2VuLnN5bWJvbFxuICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgIHRva2VuPXt0b2tlbn1cbiAgICAgICAgICAgICAgICBkaWZmSXRlbXM9e2l0ZW1zfVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9e1RyYW5zYWN0aW9uVG9rZW5DYXJkVmFyaWFudC5SRUNFSVZFfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSxcbiAgICAgICAgICApfVxuXG4gICAgICAgICAge3Nob3dOb0RhdGFXYXJuaW5nICYmIChcbiAgICAgICAgICAgIDxBbGVydCBzZXZlcml0eT1cImluZm9cIj5cbiAgICAgICAgICAgICAgPEFsZXJ0VGl0bGU+e3QoJ0JhbGFuY2UgY2hhbmdlIGluZm8gbm90IGF2YWlsYWJsZScpfTwvQWxlcnRUaXRsZT5cbiAgICAgICAgICAgICAge3QoJ1BsZWFzZSBwcm9jZWVkIHdpdGggY2F1dGlvbicpfVxuICAgICAgICAgICAgPC9BbGVydD5cbiAgICAgICAgICApfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICApO1xufTtcbiIsImV4cG9ydCBlbnVtIFNlbmRFcnJvck1lc3NhZ2Uge1xuICBBTU9VTlRfUkVRVUlSRUQgPSAnQU1PVU5UX1JFUVVJUkVEJyxcbiAgQU1PVU5UX1RPT19MT1cgPSAnQU1PVU5UX1RPT19MT1cnLFxuICBBRERSRVNTX1JFUVVJUkVEID0gJ0FERFJFU1NfUkVRVUlSRUQnLFxuICBDX0NIQUlOX1JFUVVJUkVEID0gJ0NfQ0hBSU5fUkVRVUlSRUQnLFxuICBJTlZBTElEX0FERFJFU1MgPSAnSU5WQUxJRF9BRERSRVNTJyxcbiAgSU5WQUxJRF9ORVRXT1JLX0ZFRSA9ICdJTlZBTElEX05FVFdPUktfRkVFJyxcbiAgSU5TVUZGSUNJRU5UX0JBTEFOQ0UgPSAnSU5TVUZGSUNJRU5UX0JBTEFOQ0UnLFxuICBJTlNVRkZJQ0lFTlRfQkFMQU5DRV9GT1JfRkVFID0gJ0lOU1VGRklDSUVOVF9CQUxBTkNFX0ZPUl9GRUUnLFxuICBFWENFU1NJVkVfTkVUV09SS19GRUUgPSAnRVhDRVNTSVZFX05FVFdPUktfRkVFJyxcbiAgVE9LRU5fUkVRVUlSRUQgPSAnVE9LRU5fUkVRVUlSRUQnLFxuICBVTlNVUFBPUlRFRF9UT0tFTiA9ICdVTlNVUFBPUlRFRF9UT0tFTicsXG4gIFVOQUJMRV9UT19GRVRDSF9VVFhPUyA9ICdVTkFCTEVfVE9fRkVUQ0hfVVRYT1MnLFxuICBVTktOT1dOX0VSUk9SID0gJ1VOS05PV05fRVJST1InLFxuICBVTlNVUFBPUlRFRF9CWV9MRURHRVIgPSAnVU5TVVBQT1JURURfQllfTEVER0VSJyxcbiAgU0VORF9OT1RfQVZBSUxBQkxFID0gJ1NFTkRfTk9UX0FWQUlMQUJMRScsXG59XG4iLCIvKipcbiAqICBBIGNvbnN0YW50IGZvciB0aGUgb3JkZXIgTiBmb3IgdGhlIHNlY3AyNTZrMSBjdXJ2ZS5cbiAqXG4gKiAgKCoqaS5lLioqIGBgMHhmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZWJhYWVkY2U2YWY0OGEwM2JiZmQyNWU4Y2QwMzY0MTQxbmBgKVxuICovXG5leHBvcnQgY29uc3QgTiA9IEJpZ0ludChcIjB4ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmViYWFlZGNlNmFmNDhhMDNiYmZkMjVlOGNkMDM2NDE0MVwiKTtcbi8qKlxuICogIEEgY29uc3RhbnQgZm9yIHRoZSBudW1iZXIgb2Ygd2VpIGluIGEgc2luZ2xlIGV0aGVyLlxuICpcbiAqICAoKippLmUuKiogYGAxMDAwMDAwMDAwMDAwMDAwMDAwbmBgKVxuICovXG5leHBvcnQgY29uc3QgV2VpUGVyRXRoZXIgPSBCaWdJbnQoXCIxMDAwMDAwMDAwMDAwMDAwMDAwXCIpO1xuLyoqXG4gKiAgQSBjb25zdGFudCBmb3IgdGhlIG1heGltdW0gdmFsdWUgZm9yIGEgYGB1aW50MjU2YGAuXG4gKlxuICogICgqKmkuZS4qKiBgYDB4ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZm5gYClcbiAqL1xuZXhwb3J0IGNvbnN0IE1heFVpbnQyNTYgPSBCaWdJbnQoXCIweGZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZcIik7XG4vKipcbiAqICBBIGNvbnN0YW50IGZvciB0aGUgbWluaW11bSB2YWx1ZSBmb3IgYW4gYGBpbnQyNTZgYC5cbiAqXG4gKiAgKCoqaS5lLioqIGBgLTgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDBuYGApXG4gKi9cbmV4cG9ydCBjb25zdCBNaW5JbnQyNTYgPSBCaWdJbnQoXCIweDgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDBcIikgKiBCaWdJbnQoLTEpO1xuLyoqXG4gKiAgQSBjb25zdGFudCBmb3IgdGhlIG1heGltdW0gdmFsdWUgZm9yIGFuIGBgaW50MjU2YGAuXG4gKlxuICogICgqKmkuZS4qKiBgYDB4N2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZm5gYClcbiAqL1xuZXhwb3J0IGNvbnN0IE1heEludDI1NiA9IEJpZ0ludChcIjB4N2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZlwiKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW51bWJlcnMuanMubWFwIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJTdGFjayIsIlRleHRGaWVsZCIsIklucHV0QWRvcm5tZW50IiwiQnV0dG9uIiwic3R5bGVkIiwiQ2lyY3VsYXJQcm9ncmVzcyIsImJpZ0ludFRvU3RyaW5nIiwic3RyaW5nVG9CaWdpbnQiLCJJbnB1dE51bWJlciIsInNwbGl0VmFsdWUiLCJ2YWwiLCJpbmNsdWRlcyIsInNwbGl0IiwiQk5JbnB1dCIsInZhbHVlIiwiZGVub21pbmF0aW9uIiwib25DaGFuZ2UiLCJtaW4iLCJtYXgiLCJpc1ZhbHVlTG9hZGluZyIsImVycm9yIiwiZGlzYWJsZWQiLCJmdWxsV2lkdGgiLCJ3aXRoTWF4QnV0dG9uIiwicHJvcHMiLCJ2YWxTdHIiLCJzZXRWYWxTdHIiLCJ1bmRlZmluZWQiLCJOdW1iZXIiLCJ2YWx1ZUFzU3RyaW5nIiwib2xkVmFsdWUiLCJvblZhbHVlQ2hhbmdlZCIsIm5ld1ZhbHVlU3RyaW5nIiwiZW5kVmFsdWUiLCJsZW5ndGgiLCJuZXdWYWx1ZSIsImFtb3VudCIsImJpZ2ludCIsInNldE1heCIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJpc01heEJ0blZpc2libGUiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJwb3NpdGlvbiIsIl9leHRlbmRzIiwicmVwbGFjZUFsbCIsInRhcmdldCIsInR5cGUiLCJvbktleURvd24iLCJjb2RlIiwia2V5IiwicHJldmVudERlZmF1bHQiLCJvbkNsaWNrIiwib25XaGVlbCIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsImJsdXIiLCJwbGFjZWhvbGRlciIsIndpZHRoIiwiSW5wdXRQcm9wcyIsImVuZEFkb3JubWVudCIsInNpemUiLCJoZWlnaHQiLCJ2YXJpYW50IiwicCIsImp1c3RpZnlDb250ZW50IiwiaW5wdXRNb2RlIiwicHkiLCJweCIsIk92ZXJsYXkiLCJMb2FkaW5nT3ZlcmxheSIsIkFsZXJ0RGlhbG9nIiwidXNlVHJhbnNsYXRpb24iLCJNYWxpY2lvdXNUeEFsZXJ0Iiwic2hvd0FsZXJ0IiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsImNhbmNlbEhhbmRsZXIiLCJhY3Rpb25UaXRsZXMiLCJpc0FsZXJ0RGlhbG9nT3BlbiIsInNldElzQWxlcnREaWFsb2dPcGVuIiwidCIsIkZyYWdtZW50Iiwib3BlbiIsIm9uQ2xvc2UiLCJ0ZXh0IiwicHJvY2VlZExhYmVsIiwicHJvY2VlZCIsInJlamVjdExhYmVsIiwicmVqZWN0IiwiTGluayIsIkxpbmtJY29uIiwiVG9vbHRpcCIsIlR5cG9ncmFwaHkiLCJEZXRhaWxJdGVtVHlwZSIsIlRva2VuVW5pdCIsIkFjY291bnREZXRhaWxzIiwidXNlU2V0dGluZ3NDb250ZXh0IiwiVHhEZXRhaWxzUm93IiwidXNlQmFsYW5jZXNDb250ZXh0IiwicnVudGltZSIsInVzZUNvbnRhY3RzQ29udGV4dCIsInRydW5jYXRlQWRkcmVzcyIsInVzZUFjY291bnRzQ29udGV4dCIsIlRyYW5zYWN0aW9uRGV0YWlsSXRlbSIsIml0ZW0iLCJQbGFpblRleHRJbmZvIiwiVEVYVCIsIlRleHRJbmZvIiwiQUREUkVTUyIsIkFkZHJlc3NJbmZvIiwiTElOSyIsIkxpbmtJbmZvIiwiQ1VSUkVOQ1kiLCJDdXJyZW5jeUluZm8iLCJGVU5EU19SRUNJUElFTlQiLCJGdW5kc1JlY2lwaWVudEluZm8iLCJsYWJlbCIsInVybCIsIlVSTCIsImlzTGlua1RvRXh0ZW5zaW9uSXRzZWxmIiwiaG9zdG5hbWUiLCJpZCIsImhyZWYiLCJkaXJlY3Rpb24iLCJnYXAiLCJyZWwiLCJkaXNwbGF5IiwiY29sb3IiLCJ0ZXh0T3ZlcmZsb3ciLCJvdmVyZmxvdyIsImFkZHJlc3MiLCJjdXJyZW5jeUZvcm1hdHRlciIsImdldENvbnRhY3RCeUFkZHJlc3MiLCJnZXRBY2NvdW50IiwiZ2V0VG9rZW5QcmljZSIsInRva2VuIiwibWF4RGVjaW1hbHMiLCJzeW1ib2wiLCJ0b2tlblByaWNlIiwiY29udGFjdCIsIm5hbWUiLCJ0ZXh0QWxpZ24iLCJmb250V2VpZ2h0IiwidG9EaXNwbGF5IiwiZ2V0U3ltYm9sIiwiYXNOdW1iZXIiLCJTa2VsZXRvbiIsIlJwY01ldGhvZCIsIlRva2VuVHlwZSIsInVzZUNhbGxiYWNrIiwidXNlTWVtbyIsInVzZU5ldHdvcmtGZWVDb250ZXh0IiwiQ3VzdG9tRmVlcyIsIkdhc0ZlZU1vZGlmaWVyIiwiU2VuZEVycm9yTWVzc2FnZSIsInVzZUNvbm5lY3Rpb25Db250ZXh0IiwiRXh0ZW5zaW9uUmVxdWVzdCIsInVzZVRva2Vuc1dpdGhCYWxhbmNlcyIsImlzQmF0Y2hBcHByb3ZhbEFjdGlvbiIsImdldEluaXRpYWxGZWVSYXRlIiwiZGF0YSIsImlzTXVsdGlUeEZlZURhdGEiLCJCSVRDT0lOX1NFTkRfVFJBTlNBQ1RJT04iLCJCaWdJbnQiLCJmZWVSYXRlIiwiRVRIX1NFTkRfVFJBTlNBQ1RJT04iLCJtYXhGZWVQZXJHYXMiLCJNdWx0aVR4U3ltYm9sIiwiU3ltYm9sIiwidXNlRmVlQ3VzdG9taXplciIsImFjdGlvbiIsIm5ldHdvcmsiLCJ0eEluZGV4IiwiYWNjb3VudHMiLCJhY3RpdmUiLCJhY3RpdmVBY2NvdW50IiwidXBkYXRlQmFsYW5jZU9uTmV0d29ya3MiLCJyZXF1ZXN0IiwibmV0d29ya0ZlZSIsInNldE5ldHdvcmtGZWUiLCJmZWVFcnJvciIsInNldEZlZUVycm9yIiwiZ2V0TmV0d29ya0ZlZSIsImlzQ2FsY3VsYXRpbmdGZWUiLCJzZXRJc0NhbGN1bGF0aW5nRmVlIiwiZ2FzRmVlTW9kaWZpZXIiLCJzZXRHYXNGZWVNb2RpZmllciIsIlNMT1ciLCJpc0JhdGNoQXBwcm92YWxTY3JlZW4iLCJzZXRJc0JhdGNoQXBwcm92YWxTY3JlZW4iLCJpc0ZlZVNlbGVjdG9yRW5hYmxlZCIsIkJvb2xlYW4iLCJkaXNwbGF5RGF0YSIsIm5ldHdvcmtGZWVTZWxlY3RvciIsInRva2VucyIsIm5hdGl2ZVRva2VuIiwiZmluZCIsIk5BVElWRSIsInNpZ25pbmdEYXRhIiwiZ2FzTGltaXQiLCJzaWduaW5nUmVxdWVzdHMiLCJyZWR1Y2UiLCJzdW0iLCJyZXEiLCJFcnJvciIsInR4R2FzIiwibWF4RmVlIiwid2VpZ2h0IiwiTWF0aCIsImNlaWwiLCJzaWduaW5nUmVxdWVzdCIsIkFWQUxBTkNIRV9TRU5EX1RSQU5TQUNUSU9OIiwidXBkYXRlRmVlIiwibWF4RmVlUmF0ZSIsIm1heFRpcFJhdGUiLCJhY3Rpb25JZCIsIm5ld0ZlZUNvbmZpZyIsIm1ldGhvZCIsIkFDVElPTl9VUERBVEVfVFhfREFUQSIsInBhcmFtcyIsImdldEZlZUluZm8iLCJsaW1pdCIsIkFWQUxBTkNIRV9TSUdOX01FU1NBR0UiLCJFVEhfU0lHTiIsIlBFUlNPTkFMX1NJR04iLCJmZWUiLCJtYXhQcmlvcml0eUZlZVBlckdhcyIsImhhc0Vub3VnaEZvck5ldHdvcmtGZWUiLCJiYWxhbmNlIiwiaW5mbyIsIm5lZWQiLCJjaGFpbklkIiwibmF0aXZlQmFsYW5jZSIsIklOU1VGRklDSUVOVF9CQUxBTkNFX0ZPUl9GRUUiLCJzZXRNYXhGZWVQZXJHYXMiLCJzZXRNYXhQcmlvcml0eUZlZVBlckdhcyIsImxvdyIsInByZXZpb3VzIiwic2V0Q3VzdG9tRmVlIiwidmFsdWVzIiwiZmVlVHlwZSIsImlzTW91bnRlZCIsImNhaXBJZCIsInRoZW4iLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJmaW5hbGx5IiwicmVuZGVyRmVlV2lkZ2V0Iiwic2VsZWN0ZWRHYXNGZWVNb2RpZmllciIsImlzVmlkZW8iLCJpc0ltYWdlRGFyayIsIkltYWdlV3JhcHBlciIsIkltYWdlV2l0aEZhbGxiYWNrIiwiaXBmc1Jlc29sdmVyV2l0aEZhbGxiYWNrIiwiQ2hpcCIsIlRyaWFuZ2xlUmlnaHRJY29uIiwiQXJyb3dzTWF4aW1pemVJY29uIiwiTmZ0SW1hZ2UiLCJtYXhXaWR0aCIsIm1heEhlaWdodCIsInRoZW1lIiwicGFsZXR0ZSIsImNvbW1vbiIsImJsYWNrIiwiaGFzQm9yZGVyUmFkaXVzIiwiYm9yZGVyUmFkaXVzIiwic2hvd1BvaW50ZXIiLCJOZnRWaWRlbyIsIkNvbGxlY3RpYmxlTWVkaWEiLCJob3ZlciIsIm1hcmdpbiIsInNob3dQbGF5SWNvbiIsImNvbnRyb2xzIiwiY2xhc3NOYW1lIiwic2hvd0JhbGFuY2UiLCJzaG93RXhwYW5kT3B0aW9uIiwibm9BY3Rpb24iLCJpc0ltYWdlRnVsbFNjcmVlbiIsInNldElzSW1hZ2VGdWxsU2NyZWVuIiwic2hvdWxkVXNlTGlnaHRJY29uIiwic2V0U2hvdWxkVXNlTGlnaHRJY29uIiwiaXNNZWRpYVNldHRsZWQiLCJzZXRJc01lZGlhU2V0dGxlZCIsImZsZXhEaXJlY3Rpb24iLCJhbGlnbkl0ZW1zIiwiY29sdW1uR2FwIiwiekluZGV4IiwibXIiLCJtdCIsInByIiwiYmFja2dyb3VuZENvbG9yIiwiZ3JleSIsInRvU3RyaW5nIiwiY3Vyc29yIiwic3JjIiwib25Mb2FkU3RhcnQiLCJib3R0b20iLCJyaWdodCIsImlzT3ZlcmxheSIsImJhY2tkcm9wSW1hZ2VVcmwiLCJvbkxvYWQiLCJldmVudCIsImltYWdlRWxlbWVudCIsIkhUTUxJbWFnZUVsZW1lbnQiLCJpc0RhcmsiLCJvbkVycm9yIiwiQm94IiwiQ2hldnJvbkxlZnRJY29uIiwiSWNvbkJ1dHRvbiIsImNoaWxkcmVuIiwidG9wIiwibGVmdCIsImJhY2tncm91bmRJbWFnZSIsImJhY2tncm91bmRTaXplIiwiYmFja2dyb3VuZFJlcGVhdCIsImZpbHRlciIsImRpc2FibGVSaXBwbGUiLCJzbGljZSIsImxhc3RJbmRleE9mIiwiaW1nIiwiY2FsbGJhY2siLCJjb2xvclN1bSIsImNhbnZhcyIsImN0eCIsImdldENvbnRleHQiLCJkcmF3SW1hZ2UiLCJmbG9vciIsImltYWdlRGF0YSIsImdldEltYWdlRGF0YSIsIngiLCJsZW4iLCJyIiwiZyIsImIiLCJhdmciLCJicmlnaHRuZXNzIiwidXNlQ3VycmVuY2llc0NvbnRleHQiLCJnZXRDdXJyZW5jeUZvcm1hdHRlciIsInVzZUNvbnZlcnRlZEN1cnJlbmN5Rm9ybWF0dGVyIiwic291cmNlQ3VycmVuY3kiLCJjb252ZXJ0IiwiaGFzRXhjaGFuZ2VSYXRlIiwiY3VycmVuY3kiLCJ0YXJnZXRDdXJyZW5jeSIsImZhbGxiYWNrRm9ybWF0dGVyIiwiY2FuQ29udmVydCIsIm5lZWRzQ29udmVyc2lvbiIsImNvbnZlcnRlZCIsImZyb20iLCJ0byIsIkFsZXJ0IiwiQWxlcnRDb250ZW50IiwidXNlVGhlbWUiLCJSZW1vdmVNb2RlcmF0b3JJY29uIiwiQWxlcnRCb3giLCJzZXZlcml0eSIsImljb24iLCJib3JkZXJDb2xvciIsIkRpYWxvZyIsInNob3dDbG9zZUljb24iLCJQYXBlclByb3BzIiwibSIsImN1c3RvbVBhbGV0dGUiLCJhdmFsYW5jaGVSZWQiLCJHcHBNYXliZUljb24iLCJXYXJuaW5nQm94IiwiQWNjb3JkaW9uIiwiQWNjb3JkaW9uU3VtbWFyeSIsIkFjY29yZGlvbkRldGFpbHMiLCJUcmFuc2FjdGlvblRva2VuQ2FyZCIsIk5mdEFjY29yZGlvbiIsImRpZmZJdGVtcyIsImJvcmRlciIsIm1sIiwibG9nb1VyaSIsIm1hcCIsImluZGV4IiwiZGlmZkl0ZW0iLCJicm93c2VyIiwiRm9ybUNvbnRyb2xMYWJlbCIsIlJhZGlvIiwiUmFkaW9Hcm91cCIsIlRyYW5zIiwiUGFnZVRpdGxlIiwiTGltaXQiLCJTcGVuZExpbWl0T3B0aW9uIiwiY2hlY2tlZCIsImNvbnRyb2wiLCJmb250U2l6ZSIsIkN1c3RvbVNwZW5kTGltaXQiLCJzcGVuZExpbWl0Iiwic2V0U3BlbmRMaW1pdCIsInJlcXVlc3RlZEFwcHJvdmFsTGltaXQiLCJzaXRlIiwiY3VzdG9tU3BlbmRMaW1pdCIsInNldEN1c3RvbVNwZW5kTGltaXQiLCJoYW5kbGVPblNhdmUiLCJpc0Zyb21FeHRlbnNpb24iLCJkb21haW4iLCJhcHBOYW1lIiwiZ2V0TWFuaWZlc3QiLCJzaG9ydF9uYW1lIiwib25CYWNrQ2xpY2siLCJ3b3JkV3JhcCIsImkxOG5LZXkiLCJjb21wb25lbnRzIiwic3R5bGUiLCJwcmltYXJ5IiwiX2V2IiwibGltaXRUeXBlIiwiVU5MSU1JVEVEIiwiREVGQVVMVCIsInBsIiwiZGVjaW1hbHMiLCJDVVNUT00iLCJmbGV4IiwicHQiLCJwYiIsIkFwcHJvdmFsU2VjdGlvbiIsIkFwcHJvdmFsU2VjdGlvbkhlYWRlciIsIk5mdFNwZW5kTGltaXQiLCJhcHByb3ZhbCIsImRpc3BsYXlWYWx1ZSIsInVzZFByaWNlIiwiVG9rZW5TcGVuZExpbWl0IiwiU3BlbmRMaW1pdEluZm8iLCJhcHByb3ZhbHMiLCJpc0VkaXRhYmxlIiwiRVJDNzIxIiwiRVJDMTE1NSIsIkVSQzIwIiwid2l0aFRpdGxlIiwiTWF4VWludDI1NiIsInVzZUFwcHJvdmVBY3Rpb24iLCJVTkxJTUlURURfU1BFTkRfTElNSVRfTEFCRUwiLCJzaG93Q3VzdG9tU3BlbmRMaW1pdCIsInNldFNob3dDdXN0b21TcGVuZExpbWl0IiwiY3VzdG9tU3BlbmREYXRhIiwibGltaXRBbW91bnQiLCJhcHByb3ZhbExpbWl0IiwiaXNJbmZpbml0ZSIsImRpZmZJdGVtVmFsdWUiLCJmdWxsU2NyZWVuIiwiZmxleEdyb3ciLCJtaW5XaWR0aCIsIkNhcmQiLCJUb2tlbkljb24iLCJ1c2VSZWYiLCJUcmFuc2FjdGlvblRva2VuQ2FyZFZhcmlhbnQiLCJpc05mdFRva2VuIiwiaGFzTmFtZU92ZXJmbG93Iiwic2V0SGFzTmFtZU92ZXJmbG93Iiwib3ZlcmZsb3dpbmdUZXh0IiwiY2hlY2tPdmVyZmxvdyIsImN1cnJlbnQiLCJ0ZXh0Q29udGFpbmVyIiwib2Zmc2V0SGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0Iiwib2Zmc2V0V2lkdGgiLCJzY3JvbGxXaWR0aCIsImFtb3VudENvbG9yIiwiU0VORCIsIlJFQ0VJVkUiLCJwbGFjZW1lbnQiLCJkaXNhYmxlSG92ZXJMaXN0ZW5lciIsImRpc2FibGVGb2N1c0xpc3RlbmVyIiwicmVmIiwid2hpdGVTcGFjZSIsIkFsZXJ0VGl0bGUiLCJBbGVydFRyaWFuZ2xlSWNvbiIsIkFwcHJvdmFsU2VjdGlvbkJvZHkiLCJUeEJhbGFuY2VDaGFuZ2UiLCJpbnMiLCJvdXRzIiwiaXNTaW11bGF0aW9uU3VjY2Vzc2Z1bCIsImhhc1NlbnRJdGVtcyIsImhhc1JlY2VpdmVkSXRlbXMiLCJzaG93Tm9QcmVFeGVjV2FybmluZyIsInNob3dOb0RhdGFXYXJuaW5nIiwidG9vbHRpcCIsInRvb2x0aXBJY29uIiwiaXRlbXMiXSwic291cmNlUm9vdCI6IiJ9