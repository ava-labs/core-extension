"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_CustomFees_tsx"],{

/***/ "./src/components/common/CustomFees.tsx":
/*!**********************************************!*\
  !*** ./src/components/common/CustomFees.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CustomFees": () => (/* binding */ CustomFees),
/* harmony export */   "GasFeeModifier": () => (/* binding */ GasFeeModifier),
/* harmony export */   "getGasFeeToDisplay": () => (/* binding */ getGasFeeToDisplay)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _src_utils_calculateGasAndFees__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/calculateGasAndFees */ "./src/utils/calculateGasAndFees.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_hooks_useTokenPrice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useTokenPrice */ "./src/hooks/useTokenPrice.ts");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_hooks_useLiveBalance__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/hooks/useLiveBalance */ "./src/hooks/useLiveBalance.ts");
/* harmony import */ var _CustomGasSettings__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./CustomGasSettings */ "./src/components/common/CustomGasSettings.tsx");
/* harmony import */ var _src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/NetworkFeeProvider */ "./src/contexts/NetworkFeeProvider.tsx");
/* harmony import */ var _GaslessFee__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./GaslessFee */ "./src/components/common/GaslessFee.tsx");
/* harmony import */ var _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/background/services/gasless/model */ "./src/background/services/gasless/model.ts");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _TruncateFeeAmount__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./TruncateFeeAmount */ "./src/components/common/TruncateFeeAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



















let GasFeeModifier = /*#__PURE__*/function (GasFeeModifier) {
  GasFeeModifier["SLOW"] = "SLOW";
  GasFeeModifier["NORMAL"] = "NORMAL";
  GasFeeModifier["FAST"] = "FAST";
  GasFeeModifier["CUSTOM"] = "CUSTOM";
  return GasFeeModifier;
}({});
const FeeButton = ({
  sx = {},
  ...props
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Button, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
  sx: {
    width: '65px',
    maxHeight: '54px',
    height: '54px',
    py: 1.5,
    px: 1,
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 0.25,
    justifyContent: 'center',
    borderRadius: 1,
    // Disable hover for selected option - looks weird with the "Custom" option.
    '&.MuiButton-containedPrimary:hover': {
      backgroundColor: 'primary.main'
    },
    ...sx
  }
}, props));
const CustomGasLimitDialog = ({
  sx = {},
  ...props
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Dialog, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
  fullScreen: true,
  PaperProps: {
    sx: theme => ({
      maxWidth: 375,
      maxHeight: 640,
      backgroundColor: `${theme.palette.background.default} !important`
    })
  },
  sx: {
    '	.MuiDialog-container': {
      alignItems: 'flex-start'
    },
    ...sx
  }
}, props));
const getGasFeeToDisplay = (fee, networkFee) => {
  if (fee === '') {
    return fee;
  }
  // strings coming in are already decimal formatted from our getUpToTwoDecimals function
  // If there is no network fee, return undefined
  if (!networkFee) return undefined;
  // If network fees are all the same, return decimals (fee arg)
  if (networkFee.high === networkFee.low && networkFee.high === networkFee?.medium) {
    return fee;
  }
  // else if fee is less than or equal to 1, return decimals
  else if (parseFloat(fee) <= 1) {
    return fee;
  }
  // else, return rounded fee
  else {
    return Math.round(parseFloat(fee));
  }
};
const POLLED_BALANCES = [_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_5__.TokenType.NATIVE];
function CustomFees({
  maxFeePerGas,
  limit,
  estimatedFee,
  onChange,
  onModifierChangeCallback,
  gasPriceEditDisabled = false,
  maxGasPrice,
  selectedGasFeeModifier,
  network,
  networkFee,
  isLimitReadonly,
  isCollapsible,
  size = 'normal',
  hasEnoughForFee = true,
  isBatchApprovalScreen
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_16__.useTranslation)();
  const tokenPrice = (0,_src_hooks_useTokenPrice__WEBPACK_IMPORTED_MODULE_4__.useNativeTokenPrice)(network);
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_3__.useSettingsContext)();
  const [customGasLimit, setCustomGasLimit] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)();
  const gasLimit = customGasLimit || limit;
  const [customFee, setCustomFee] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(networkFee?.medium);
  const [newFees, setNewFees] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)((0,_src_utils_calculateGasAndFees__WEBPACK_IMPORTED_MODULE_1__.calculateGasAndFees)({
    maxFeePerGas,
    tokenPrice,
    tokenDecimals: network?.networkToken.decimals,
    gasLimit
  }));
  const [isCollapsed, setIsCollapsed] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(isCollapsible);
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_13__.useFeatureFlagContext)();
  const customInputRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
  const [showEditGasLimit, setShowEditGasLimit] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [selectedFee, setSelectedFee] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(networkFee?.isFixedFee ? GasFeeModifier.SLOW : selectedGasFeeModifier || GasFeeModifier.SLOW);
  const {
    isGaslessOn,
    setIsGaslessOn,
    gaslessPhase,
    isGaslessEligible
  } = (0,_src_contexts_NetworkFeeProvider__WEBPACK_IMPORTED_MODULE_9__.useNetworkFeeContext)();
  (0,_src_hooks_useLiveBalance__WEBPACK_IMPORTED_MODULE_7__.useLiveBalance)(POLLED_BALANCES); // Make sure we always use the latest native balance.

  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (!customFee && networkFee) {
      setCustomFee(networkFee?.low);
    }
  }, [customFee, networkFee]);
  const handleGasChange = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)((rate, modifier) => {
    if (modifier === GasFeeModifier.CUSTOM) {
      setCustomFee(rate);
    }
    const isTooHigh = maxGasPrice ? rate.maxFeePerGas > maxGasPrice : false;

    // update
    const updatedFees = (0,_src_utils_calculateGasAndFees__WEBPACK_IMPORTED_MODULE_1__.calculateGasAndFees)({
      maxFeePerGas: rate.maxFeePerGas,
      tokenPrice,
      tokenDecimals: network?.networkToken.decimals,
      gasLimit
    });
    onChange({
      customGasLimit: customGasLimit,
      maxFeePerGas: rate.maxFeePerGas,
      maxPriorityFeePerGas: rate.maxPriorityFeePerGas,
      feeType: modifier
    });
    if (!isTooHigh) {
      setNewFees(updatedFees);
    }
  }, [tokenPrice, network?.networkToken.decimals, gasLimit, customGasLimit, maxGasPrice, onChange]);
  const updateGasFee = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(modifier => {
    if (!modifier || !networkFee) {
      return;
    }
    setSelectedFee(modifier);
    switch (modifier) {
      case GasFeeModifier.NORMAL:
        {
          handleGasChange(networkFee.medium, modifier);
          break;
        }
      case GasFeeModifier.FAST:
        {
          handleGasChange(networkFee.high, modifier);
          break;
        }
      case GasFeeModifier.CUSTOM:
        if (customFee) {
          handleGasChange(customFee, modifier);
        }
        break;
      default:
        handleGasChange(networkFee.low, GasFeeModifier.SLOW);
    }
  }, [handleGasChange, networkFee, customFee]);
  const handleModifierClick = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(modifier => {
    updateGasFee(modifier);
    if (onModifierChangeCallback) {
      onModifierChangeCallback(modifier);
    }
  }, [updateGasFee, onModifierChangeCallback]);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    // 1. Update selected fees when data is loaded loaded.
    // 2. Make sure Normal preset is selected if the network fee is fixed.
    if (typeof networkFee?.isFixedFee !== 'boolean') {
      return;
    }
    if (networkFee.isFixedFee) {
      updateGasFee(GasFeeModifier.SLOW);
    } else {
      updateGasFee(selectedGasFeeModifier);
    }
  }, [networkFee?.isFixedFee, selectedGasFeeModifier, updateGasFee]);
  const feeAmount = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (!network?.networkToken) {
      return {
        rounded: '-',
        precise: ''
      };
    }
    if (typeof estimatedFee === 'bigint') {
      const unit = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_17__.TokenUnit(estimatedFee, network?.networkToken.decimals, network?.networkToken.symbol);
      return {
        rounded: unit.toDisplay(),
        precise: unit.toString()
      };
    }
    return {
      rounded: newFees.feeUnit.toDisplay(),
      precise: newFees.feeUnit.toString()
    };
  }, [network?.networkToken, estimatedFee, newFees.feeUnit]);
  const onGaslessSwitch = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(async () => {
    handleModifierClick(GasFeeModifier.NORMAL);
    setIsGaslessOn(!isGaslessOn);
  }, [handleModifierClick, isGaslessOn, setIsGaslessOn]);
  if (!networkFee) {
    return null;
  }
  const isMaxFeeUsed = network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.EVM && !networkFee.isFixedFee;
  return /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_6__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_6__.ApprovalSectionHeader, {
    label: t(isMaxFeeUsed ? 'Maximum Network Fee' : 'Network Fee'),
    tooltip: isMaxFeeUsed ? t('Core estimates the maximum gas (maxFeePerGas) a transaction could consume based on network conditions. This transaction will likely consume less gas than estimated.') : undefined
  }, isCollapsible && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.IconButton, {
    size: "small",
    "data-testid": "customize-fee-button",
    onClick: () => setIsCollapsed(wasCollapsed => !wasCollapsed)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.ChevronDownIcon, {
    sx: {
      transform: isCollapsed ? 'rotateX(0deg)' : 'rotateX(180deg)'
    }
  }))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_6__.ApprovalSectionBody, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Collapse, {
    in: !isCollapsible || !isCollapsed,
    mountOnEnter: true,
    unmountOnExit: true
  }, !isBatchApprovalScreen && isGaslessEligible && gaslessPhase !== _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_11__.GaslessPhase.ERROR && featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_12__.FeatureGates.GASLESS] && /*#__PURE__*/React.createElement(_GaslessFee__WEBPACK_IMPORTED_MODULE_10__["default"], {
    onSwitch: () => {
      onGaslessSwitch();
    },
    isTurnedOn: isGaslessOn,
    disabled: gaslessPhase === _src_background_services_gasless_model__WEBPACK_IMPORTED_MODULE_11__.GaslessPhase.FUNDING_IN_PROGRESS
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Collapse, {
    in: !isGaslessOn || !isGaslessEligible,
    mountOnEnter: true,
    unmountOnExit: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: size === 'small' ? 0.5 : 0
    }
  }, /*#__PURE__*/React.createElement(FeeButton, {
    "data-testid": "gas-fee-slow-button",
    disabled: gasPriceEditDisabled,
    color: selectedFee === GasFeeModifier.SLOW ? 'primary' : 'secondary',
    onClick: () => {
      handleModifierClick(GasFeeModifier.SLOW);
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: size === 'small' ? 'caption' : 'body2',
    sx: {
      fontWeight: 'semibold'
    }
  }, t('Slow'))), !networkFee.isFixedFee && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FeeButton, {
    "data-testid": "gas-fee-normal-button",
    disabled: gasPriceEditDisabled,
    color: selectedFee === GasFeeModifier.NORMAL ? 'primary' : 'secondary',
    onClick: () => {
      handleModifierClick(GasFeeModifier.NORMAL);
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: size === 'small' ? 'caption' : 'body2',
    sx: {
      fontWeight: 'semibold'
    }
  }, t('Normal'))), /*#__PURE__*/React.createElement(FeeButton, {
    "data-testid": "gas-fee-fast-button",
    disabled: gasPriceEditDisabled,
    color: selectedFee === GasFeeModifier.FAST ? 'primary' : 'secondary',
    onClick: () => {
      handleModifierClick(GasFeeModifier.FAST);
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: size === 'small' ? 'caption' : 'body2',
    sx: {
      fontWeight: 'semibold'
    }
  }, t('Fast'))), /*#__PURE__*/React.createElement(FeeButton, {
    "data-testid": "gas-fee-custom-button",
    disabled: gasPriceEditDisabled,
    color: selectedFee === GasFeeModifier.CUSTOM ? 'primary' : 'secondary',
    onClick: () => {
      handleModifierClick(GasFeeModifier.CUSTOM);
      customInputRef?.current?.focus();
      setShowEditGasLimit(true);
    },
    disableRipple: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: size === 'small' ? 'caption' : 'body2',
    sx: {
      fontWeight: 'semibold'
    }
  }, t('Custom'))))))), !isGaslessOn && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    component: "span",
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, t('Fee Amount')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    direction: "row"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Tooltip, {
    title: feeAmount.precise
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_TruncateFeeAmount__WEBPACK_IMPORTED_MODULE_14__.TruncateFeeAmount, {
    "data-testid": "network-fee-token-amount",
    amount: feeAmount.precise
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      color: hasEnoughForFee ? undefined : 'error.main'
    }
  }, network?.networkToken.symbol))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    "data-testid": "network-fee-currency-amount",
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, !isNaN(Number(newFees.feeUSD)) ? `${currencyFormatter(Number(newFees.feeUSD))}` : '')))), /*#__PURE__*/React.createElement(CustomGasLimitDialog, {
    open: Boolean(network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.EVM && showEditGasLimit && customFee?.maxFeePerGas)
  }, /*#__PURE__*/React.createElement(_CustomGasSettings__WEBPACK_IMPORTED_MODULE_8__.CustomGasSettings, {
    isLimitReadonly: isLimitReadonly,
    feeDisplayDecimals: networkFee.displayDecimals,
    gasLimit: gasLimit ?? 0,
    maxFeePerGas: customFee?.maxFeePerGas || 0n,
    maxPriorityFeePerGas: customFee?.maxPriorityFeePerGas || 0n,
    onCancel: () => setShowEditGasLimit(false),
    onSave: data => {
      setCustomGasLimit(data.customGasLimit);
      setCustomFee({
        maxFeePerGas: data.maxFeePerGas,
        maxPriorityFeePerGas: data.maxPriorityFeePerGas
      });
      setSelectedFee(GasFeeModifier.CUSTOM);
      setShowEditGasLimit(false);
      setNewFees((0,_src_utils_calculateGasAndFees__WEBPACK_IMPORTED_MODULE_1__.calculateGasAndFees)({
        maxFeePerGas: data.maxFeePerGas,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
        gasLimit: data.customGasLimit
      }));
      onChange({
        customGasLimit: data.customGasLimit,
        maxFeePerGas: data.maxFeePerGas,
        maxPriorityFeePerGas: data.maxPriorityFeePerGas,
        feeType: GasFeeModifier.CUSTOM
      });
    },
    network: network
  })));
}

/***/ }),

/***/ "./src/components/common/CustomGasSettings.tsx":
/*!*****************************************************!*\
  !*** ./src/components/common/CustomGasSettings.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CustomGasSettings": () => (/* binding */ CustomGasSettings)
/* harmony export */ });
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/utils/units.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _src_hooks_useTokenPrice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useTokenPrice */ "./src/hooks/useTokenPrice.ts");
/* harmony import */ var _src_utils_calculateGasAndFees__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/calculateGasAndFees */ "./src/utils/calculateGasAndFees.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _PageTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _TextFieldLabel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TextFieldLabel */ "./src/components/common/TextFieldLabel.tsx");
/* harmony import */ var _TruncateFeeAmount__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TruncateFeeAmount */ "./src/components/common/TruncateFeeAmount.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");











const ErrorMessage = ({
  message
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
  variant: "caption",
  sx: {
    color: 'error.light'
  }
}, message);
const FiatValue = ({
  value
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Box, {
  sx: {
    width: '100%',
    pt: 0.5,
    minHeight: '16px'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
  variant: "caption",
  component: "p",
  sx: {
    textAlign: 'end'
  }
}, value));
const FeeAmount = ({
  decimals,
  value,
  fiatValue,
  tokenSymbol
}) => {
  const unit = new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_8__.TokenUnit(value, decimals, tokenSymbol);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      textAlign: 'end',
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      textAlign: 'end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      gap: 0.5,
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tooltip, {
    title: unit.toString()
  }, /*#__PURE__*/React.createElement(_TruncateFeeAmount__WEBPACK_IMPORTED_MODULE_6__.TruncateFeeAmount, {
    amount: unit.toDisplay()
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "subtitle2",
    component: "span",
    color: "text.primary"
  }, tokenSymbol)), fiatValue && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, fiatValue)));
};
function CustomGasSettings({
  feeDisplayDecimals,
  gasLimit,
  isLimitReadonly,
  maxFeePerGas,
  maxPriorityFeePerGas,
  onSave,
  onCancel,
  network
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_9__.useTranslation)();
  const tokenPrice = (0,_src_hooks_useTokenPrice__WEBPACK_IMPORTED_MODULE_0__.useNativeTokenPrice)(network);
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__.useSettingsContext)();
  const tokenDecimals = network?.networkToken.decimals ?? 18;
  const [customGasLimit, setCustomGasLimit] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(gasLimit);
  const [customMaxFeePerGas, setCustomMaxFeePerGas] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(maxFeePerGas);
  const [customMaxPriorityFeePerGas, setCustomMaxPriorityFeePerGas] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(maxPriorityFeePerGas);
  const [errors, setErrors] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)({});
  const [newFees, setNewFees] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)((0,_src_utils_calculateGasAndFees__WEBPACK_IMPORTED_MODULE_1__.calculateGasAndFees)({
    maxFeePerGas,
    tokenPrice,
    tokenDecimals,
    gasLimit
  }));
  function handleOnSave() {
    if (customGasLimit) {
      onSave({
        customGasLimit: customGasLimit,
        maxFeePerGas: customMaxFeePerGas,
        maxPriorityFeePerGas: customMaxPriorityFeePerGas
      });
    }
  }
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    let hasErrors = false;
    if (customGasLimit <= 0) {
      setErrors(existingErrors => ({
        ...existingErrors,
        gasLimit: t('Gas Limit too low')
      }));
      hasErrors = true;
    } else {
      setErrors(existingErrors => ({
        ...existingErrors,
        gasLimit: undefined
      }));
    }
    if (customMaxPriorityFeePerGas > customMaxFeePerGas) {
      setErrors(existingErrors => ({
        ...existingErrors,
        maxPriorityFee: t('Maximum priority fee cannot be greater than maximum fee')
      }));
      hasErrors = true;
    } else {
      setErrors(existingErrors => ({
        ...existingErrors,
        maxPriorityFee: undefined
      }));
    }
    if (hasErrors) {
      return;
    }
    try {
      const calculatedGasAndFees = (0,_src_utils_calculateGasAndFees__WEBPACK_IMPORTED_MODULE_1__.calculateGasAndFees)({
        maxFeePerGas: customMaxFeePerGas,
        maxPriorityFeePerGas: customMaxPriorityFeePerGas,
        tokenPrice,
        tokenDecimals,
        gasLimit: customGasLimit
      });
      setErrors({});
      setNewFees(calculatedGasAndFees);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('overflow')) {
          // https://links.ethers.org/v5-errors-NUMERIC_FAULT-overflow
          setErrors(existingErrors => ({
            ...existingErrors,
            gasLimit: t('Gas Limit is too much')
          }));
        } else if (error.message === 'Please provide gasPrice or maxFeePerGas parameters') {
          setErrors(existingErrors => ({
            ...existingErrors,
            maxFee: t('Provide valid numerical value for maximum fee')
          }));
        }
      }
    }
  }, [customGasLimit, customMaxFeePerGas, customMaxPriorityFeePerGas, maxFeePerGas, t, tokenPrice, tokenDecimals]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_PageTitle__WEBPACK_IMPORTED_MODULE_3__.PageTitle, {
    margin: "16px 0 0",
    onBackClick: onCancel
  }, t('Edit Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      padding: 2,
      gap: 2.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '100%',
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_TextFieldLabel__WEBPACK_IMPORTED_MODULE_5__.TextFieldLabel, {
    label: t('Max Base Fee'),
    tooltip: t('The Base Fee is set by the network and changes frequently. Any difference between the set Max Base Fee and the actual Base Fee will be refunded.')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.TextField, {
    fullWidth: true,
    type: 'number',
    value: (0,ethers__WEBPACK_IMPORTED_MODULE_10__.formatUnits)(customMaxFeePerGas, feeDisplayDecimals),
    onChange: evt => {
      setCustomMaxFeePerGas((0,ethers__WEBPACK_IMPORTED_MODULE_10__.parseUnits)(evt.currentTarget.value || '0', feeDisplayDecimals));
    },
    error: !!errors.maxFee,
    "data-testid": "max-base-fee"
  }), errors.maxFee ? /*#__PURE__*/React.createElement(ErrorMessage, {
    message: errors.maxFee
  }) : /*#__PURE__*/React.createElement(FiatValue, {
    value: newFees.feeUSD ? currencyFormatter(newFees.feeUSD) : ''
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '100%',
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_TextFieldLabel__WEBPACK_IMPORTED_MODULE_5__.TextFieldLabel, {
    label: t('Max Priority Fee'),
    tooltip: t('The Priority Fee is an incentive paid to network operators to prioritize processing of this transaction.')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.TextField, {
    autoFocus: true,
    fullWidth: true,
    type: 'number',
    value: (0,ethers__WEBPACK_IMPORTED_MODULE_10__.formatUnits)(customMaxPriorityFeePerGas, feeDisplayDecimals),
    onChange: evt => {
      setCustomMaxPriorityFeePerGas((0,ethers__WEBPACK_IMPORTED_MODULE_10__.parseUnits)(evt.currentTarget.value || '0', feeDisplayDecimals));
    },
    error: !!errors.maxPriorityFee,
    "data-testid": "max-priority-fee"
  }), errors.maxPriorityFee ? /*#__PURE__*/React.createElement(ErrorMessage, {
    message: errors.maxPriorityFee
  }) : /*#__PURE__*/React.createElement(FiatValue, {
    value: newFees.tipUSD ? currencyFormatter(newFees.tipUSD) : ''
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: '100%',
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_TextFieldLabel__WEBPACK_IMPORTED_MODULE_5__.TextFieldLabel, {
    label: t('Gas Limit'),
    tooltip: isLimitReadonly ? t('Estimated gas units needed to complete the transaction. Includes a small buffer. Not editable for this transaction.') : t('Total units of gas needed to complete the transaction. Do not edit unless necessary.')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.TextField, {
    fullWidth: true,
    InputProps: {
      readOnly: isLimitReadonly
    },
    disabled: isLimitReadonly,
    type: 'number',
    value: customGasLimit?.toString(),
    onChange: isLimitReadonly ? undefined : evt => setCustomGasLimit(parseInt(evt.currentTarget.value)),
    error: !!errors.gasLimit,
    "data-testid": "gas-limit"
  }), errors.gasLimit && /*#__PURE__*/React.createElement(ErrorMessage, {
    message: errors.gasLimit
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Divider, {
    sx: {
      mt: 2,
      mb: 1
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexDirection: 'row',
      gap: 1,
      alignItems: 'center',
      pt: 0.75
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption"
  }, t('Total Network Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Tooltip, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, t('Total Network Fee = (Current Base Fee + Max Priority Fee) * Gas Limit.')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, t('It will never be higher than Max Base Fee * Gas Limit.')))
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.InfoCircleIcon, null))), /*#__PURE__*/React.createElement(FeeAmount, {
    value: newFees.bnFee,
    decimals: network?.networkToken.decimals,
    fiatValue: newFees.feeUSD ? currencyFormatter(newFees.feeUSD) : null,
    tokenSymbol: network?.networkToken.symbol
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingX: 2,
      paddingBottom: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    "data-testid": "save-gas-limit-button",
    size: "large",
    variant: "contained",
    onClick: handleOnSave,
    disabled: Object.keys(errors).length > 0,
    fullWidth: true
  }, t('Save'))));
}

/***/ }),

/***/ "./src/components/common/GaslessFee.tsx":
/*!**********************************************!*\
  !*** ./src/components/common/GaslessFee.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GaslessFee)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function GaslessFee({
  onSwitch,
  isTurnedOn,
  disabled
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_0__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      mb: isTurnedOn ? 0 : 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, null, t('Get Free Gas')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
    placement: "bottom",
    title: t('When enabled Core will pay the network fee associated with this transaction.')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.InfoCircleIcon, {
    sx: {
      mx: 0.5,
      cursor: 'pointer'
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Switch, {
    onChange: onSwitch,
    checked: isTurnedOn,
    disabled: disabled,
    size: "small"
  }));
}

/***/ }),

/***/ "./src/components/common/TextFieldLabel.tsx":
/*!**************************************************!*\
  !*** ./src/components/common/TextFieldLabel.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextFieldLabel": () => (/* binding */ TextFieldLabel)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const TextFieldLabel = ({
  label,
  tooltip
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Stack, {
  sx: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Typography, {
  variant: "body2",
  sx: {
    fontWeight: 'semibold'
  }
}, label), tooltip && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Tooltip, {
  title: tooltip
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.InfoCircleIcon, {
  size: 16
})));

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

/***/ "./src/hooks/useLiveBalance.ts":
/*!*************************************!*\
  !*** ./src/hooks/useLiveBalance.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useLiveBalance": () => (/* binding */ useLiveBalance)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");


const useLiveBalance = tokenTypes => {
  const {
    registerSubscriber,
    unregisterSubscriber
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__.useBalancesContext)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    registerSubscriber(tokenTypes);
    return () => {
      unregisterSubscriber(tokenTypes);
    };
  }, [registerSubscriber, unregisterSubscriber, tokenTypes]);
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

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX0N1c3RvbUZlZXNfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUU7QUFDSztBQUNOO0FBQ0w7QUFDRztBQUNuQjtBQUNNO0FBQ0Q7QUFlZjtBQUtvQjtBQUNFO0FBQ0g7QUFDZ0I7QUFDbEM7QUFDZ0M7QUFDTTtBQUNEO0FBQ25CO0FBeUJqRCxJQUFLK0IsY0FBYywwQkFBZEEsY0FBYztFQUFkQSxjQUFjO0VBQWRBLGNBQWM7RUFBZEEsY0FBYztFQUFkQSxjQUFjO0VBQUEsT0FBZEEsY0FBYztBQUFBO0FBTzFCLE1BQU1DLFNBQVMsR0FBR0EsQ0FBQztFQUFFQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQUUsR0FBR0M7QUFBTSxDQUFDLGtCQUN0Q0MsS0FBQSxDQUFBQyxhQUFBLENBQUN4QixnRUFBTSxFQUFBeUIsMEVBQUE7RUFDTEosRUFBRSxFQUFFO0lBQ0ZLLEtBQUssRUFBRSxNQUFNO0lBQ2JDLFNBQVMsRUFBRSxNQUFNO0lBQ2pCQyxNQUFNLEVBQUUsTUFBTTtJQUNkQyxFQUFFLEVBQUUsR0FBRztJQUNQQyxFQUFFLEVBQUUsQ0FBQztJQUNMQyxPQUFPLEVBQUUsYUFBYTtJQUN0QkMsYUFBYSxFQUFFLFFBQVE7SUFDdkJDLEdBQUcsRUFBRSxJQUFJO0lBQ1RDLGNBQWMsRUFBRSxRQUFRO0lBQ3hCQyxZQUFZLEVBQUUsQ0FBQztJQUVmO0lBQ0Esb0NBQW9DLEVBQUU7TUFDcENDLGVBQWUsRUFBRTtJQUNuQixDQUFDO0lBQ0QsR0FBR2Y7RUFDTDtBQUFFLEdBQ0VDLEtBQUssRUFFWjtBQUVELE1BQU1lLG9CQUFvQixHQUFHQSxDQUFDO0VBQUVoQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQUUsR0FBR0M7QUFBbUIsQ0FBQyxrQkFDOURDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDckIsZ0VBQU0sRUFBQXNCLDBFQUFBO0VBQ0xhLFVBQVU7RUFDVkMsVUFB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SUFBSSxDQUFFQyxDQUFDLElBQUtULFFBQVEsQ0FBQ1MsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQzdCQyxLQUFLLENBQUMsTUFBTVYsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUMsTUFBTTtNQUNMQSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2I7RUFDRixDQUFDLEVBQUUsQ0FBQ3ZLLE9BQU8sRUFBRXFLLE9BQU8sQ0FBQyxDQUFDO0VBRXRCLE9BQU9DLEtBQUs7QUFDZCIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vQ3VzdG9tRmVlcy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9DdXN0b21HYXNTZXR0aW5ncy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9HYXNsZXNzRmVlLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1RleHRGaWVsZExhYmVsLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1RydW5jYXRlRmVlQW1vdW50LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUxpdmVCYWxhbmNlLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlVG9rZW5QcmljZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjYWxjdWxhdGVHYXNBbmRGZWVzIH0gZnJvbSAnQHNyYy91dGlscy9jYWxjdWxhdGVHYXNBbmRGZWVzJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTmF0aXZlVG9rZW5QcmljZSB9IGZyb20gJ0BzcmMvaG9va3MvdXNlVG9rZW5QcmljZSc7XG5pbXBvcnQgeyBOZXR3b3JrLCBOZXR3b3JrVk1UeXBlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgVG9rZW5Vbml0IH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IHtcbiAgRmVlUmF0ZSxcbiAgTmV0d29ya0ZlZSxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmtGZWUvbW9kZWxzJztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQ2hldnJvbkRvd25JY29uLFxuICBDb2xsYXBzZSxcbiAgRGlhbG9nLFxuICBEaWFsb2dQcm9wcyxcbiAgSWNvbkJ1dHRvbixcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQge1xuICBBcHByb3ZhbFNlY3Rpb24sXG4gIEFwcHJvdmFsU2VjdGlvbkJvZHksXG4gIEFwcHJvdmFsU2VjdGlvbkhlYWRlcixcbn0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9hcHByb3ZhbC9BcHByb3ZhbFNlY3Rpb24nO1xuaW1wb3J0IHsgdXNlTGl2ZUJhbGFuY2UgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUxpdmVCYWxhbmNlJztcbmltcG9ydCB7IEN1c3RvbUdhc1NldHRpbmdzIH0gZnJvbSAnLi9DdXN0b21HYXNTZXR0aW5ncyc7XG5pbXBvcnQgeyB1c2VOZXR3b3JrRmVlQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya0ZlZVByb3ZpZGVyJztcbmltcG9ydCBHYXNsZXNzRmVlIGZyb20gJy4vR2FzbGVzc0ZlZSc7XG5pbXBvcnQgeyBHYXNsZXNzUGhhc2UgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZ2FzbGVzcy9tb2RlbCc7XG5pbXBvcnQgeyBGZWF0dXJlR2F0ZXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvZmVhdHVyZUZsYWdzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB7IFRydW5jYXRlRmVlQW1vdW50IH0gZnJvbSAnLi9UcnVuY2F0ZUZlZUFtb3VudCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tR2FzRmVlc1Byb3BzIHtcbiAgbWF4RmVlUGVyR2FzOiBiaWdpbnQ7XG4gIGxpbWl0OiBudW1iZXI7XG4gIGVzdGltYXRlZEZlZT86IGJpZ2ludDtcbiAgb25DaGFuZ2UodmFsdWVzOiB7XG4gICAgY3VzdG9tR2FzTGltaXQ/OiBudW1iZXI7XG4gICAgbWF4RmVlUGVyR2FzOiBiaWdpbnQ7XG4gICAgbWF4UHJpb3JpdHlGZWVQZXJHYXM/OiBiaWdpbnQ7XG4gICAgZmVlVHlwZTogR2FzRmVlTW9kaWZpZXI7XG4gIH0pOiB2b2lkO1xuICBvbk1vZGlmaWVyQ2hhbmdlQ2FsbGJhY2s/OiAoZmVlVHlwZT86IEdhc0ZlZU1vZGlmaWVyKSA9PiB2b2lkO1xuICBnYXNQcmljZUVkaXREaXNhYmxlZD86IGJvb2xlYW47XG4gIG1heEdhc1ByaWNlPzogYmlnaW50O1xuICBzZWxlY3RlZEdhc0ZlZU1vZGlmaWVyPzogR2FzRmVlTW9kaWZpZXI7XG4gIG5ldHdvcms/OiBOZXR3b3JrO1xuICBuZXR3b3JrRmVlOiBOZXR3b3JrRmVlIHwgbnVsbDtcbiAgaXNMaW1pdFJlYWRvbmx5PzogYm9vbGVhbjtcbiAgaXNDb2xsYXBzaWJsZT86IGJvb2xlYW47XG4gIHNpemU/OiAnc21hbGwnIHwgJ25vcm1hbCc7XG4gIGhhc0Vub3VnaEZvckZlZT86IGJvb2xlYW47XG4gIGlzQmF0Y2hBcHByb3ZhbFNjcmVlbj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBlbnVtIEdhc0ZlZU1vZGlmaWVyIHtcbiAgU0xPVyA9ICdTTE9XJyxcbiAgTk9STUFMID0gJ05PUk1BTCcsXG4gIEZBU1QgPSAnRkFTVCcsXG4gIENVU1RPTSA9ICdDVVNUT00nLFxufVxuXG5jb25zdCBGZWVCdXR0b24gPSAoeyBzeCA9IHt9LCAuLi5wcm9wcyB9KSA9PiAoXG4gIDxCdXR0b25cbiAgICBzeD17e1xuICAgICAgd2lkdGg6ICc2NXB4JyxcbiAgICAgIG1heEhlaWdodDogJzU0cHgnLFxuICAgICAgaGVpZ2h0OiAnNTRweCcsXG4gICAgICBweTogMS41LFxuICAgICAgcHg6IDEsXG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICBnYXA6IDAuMjUsXG4gICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICBib3JkZXJSYWRpdXM6IDEsXG5cbiAgICAgIC8vIERpc2FibGUgaG92ZXIgZm9yIHNlbGVjdGVkIG9wdGlvbiAtIGxvb2tzIHdlaXJkIHdpdGggdGhlIFwiQ3VzdG9tXCIgb3B0aW9uLlxuICAgICAgJyYuTXVpQnV0dG9uLWNvbnRhaW5lZFByaW1hcnk6aG92ZXInOiB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3ByaW1hcnkubWFpbicsXG4gICAgICB9LFxuICAgICAgLi4uc3gsXG4gICAgfX1cbiAgICB7Li4ucHJvcHN9XG4gIC8+XG4pO1xuXG5jb25zdCBDdXN0b21HYXNMaW1pdERpYWxvZyA9ICh7IHN4ID0ge30sIC4uLnByb3BzIH06IERpYWxvZ1Byb3BzKSA9PiAoXG4gIDxEaWFsb2dcbiAgICBmdWxsU2NyZWVuXG4gICAgUGFwZXJQcm9wcz17e1xuICAgICAgc3g6ICh0aGVtZSkgPT4gKHtcbiAgICAgICAgbWF4V2lkdGg6IDM3NSxcbiAgICAgICAgbWF4SGVpZ2h0OiA2NDAsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogYCR7dGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLmRlZmF1bHR9ICFpbXBvcnRhbnRgLFxuICAgICAgfSksXG4gICAgfX1cbiAgICBzeD17e1xuICAgICAgJ1x0Lk11aURpYWxvZy1jb250YWluZXInOiB7XG4gICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JyxcbiAgICAgIH0sXG4gICAgICAuLi5zeCxcbiAgICB9fVxuICAgIHsuLi5wcm9wc31cbiAgLz5cbik7XG5cbmV4cG9ydCBjb25zdCBnZXRHYXNGZWVUb0Rpc3BsYXkgPSAoZmVlOiBzdHJpbmcsIG5ldHdvcmtGZWU6IE5ldHdvcmtGZWUpID0+IHtcbiAgaWYgKGZlZSA9PT0gJycpIHtcbiAgICByZXR1cm4gZmVlO1xuICB9XG4gIC8vIHN0cmluZ3MgY29taW5nIGluIGFyZSBhbHJlYWR5IGRlY2ltYWwgZm9ybWF0dGVkIGZyb20gb3VyIGdldFVwVG9Ud29EZWNpbWFscyBmdW5jdGlvblxuICAvLyBJZiB0aGVyZSBpcyBubyBuZXR3b3JrIGZlZSwgcmV0dXJuIHVuZGVmaW5lZFxuICBpZiAoIW5ldHdvcmtGZWUpIHJldHVybiB1bmRlZmluZWQ7XG4gIC8vIElmIG5ldHdvcmsgZmVlcyBhcmUgYWxsIHRoZSBzYW1lLCByZXR1cm4gZGVjaW1hbHMgKGZlZSBhcmcpXG4gIGlmIChcbiAgICBuZXR3b3JrRmVlLmhpZ2ggPT09IG5ldHdvcmtGZWUubG93ICYmXG4gICAgbmV0d29ya0ZlZS5oaWdoID09PSBuZXR3b3JrRmVlPy5tZWRpdW1cbiAgKSB7XG4gICAgcmV0dXJuIGZlZTtcbiAgfVxuICAvLyBlbHNlIGlmIGZlZSBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gMSwgcmV0dXJuIGRlY2ltYWxzXG4gIGVsc2UgaWYgKHBhcnNlRmxvYXQoZmVlKSA8PSAxKSB7XG4gICAgcmV0dXJuIGZlZTtcbiAgfVxuICAvLyBlbHNlLCByZXR1cm4gcm91bmRlZCBmZWVcbiAgZWxzZSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQocGFyc2VGbG9hdChmZWUpKTtcbiAgfVxufTtcblxuY29uc3QgUE9MTEVEX0JBTEFOQ0VTID0gW1Rva2VuVHlwZS5OQVRJVkVdO1xuXG5leHBvcnQgZnVuY3Rpb24gQ3VzdG9tRmVlcyh7XG4gIG1heEZlZVBlckdhcyxcbiAgbGltaXQsXG4gIGVzdGltYXRlZEZlZSxcbiAgb25DaGFuZ2UsXG4gIG9uTW9kaWZpZXJDaGFuZ2VDYWxsYmFjayxcbiAgZ2FzUHJpY2VFZGl0RGlzYWJsZWQgPSBmYWxzZSxcbiAgbWF4R2FzUHJpY2UsXG4gIHNlbGVjdGVkR2FzRmVlTW9kaWZpZXIsXG4gIG5ldHdvcmssXG4gIG5ldHdvcmtGZWUsXG4gIGlzTGltaXRSZWFkb25seSxcbiAgaXNDb2xsYXBzaWJsZSxcbiAgc2l6ZSA9ICdub3JtYWwnLFxuICBoYXNFbm91Z2hGb3JGZWUgPSB0cnVlLFxuICBpc0JhdGNoQXBwcm92YWxTY3JlZW4sXG59OiBDdXN0b21HYXNGZWVzUHJvcHMpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB0b2tlblByaWNlID0gdXNlTmF0aXZlVG9rZW5QcmljZShuZXR3b3JrKTtcbiAgY29uc3QgeyBjdXJyZW5jeUZvcm1hdHRlciB9ID0gdXNlU2V0dGluZ3NDb250ZXh0KCk7XG4gIGNvbnN0IFtjdXN0b21HYXNMaW1pdCwgc2V0Q3VzdG9tR2FzTGltaXRdID0gdXNlU3RhdGU8bnVtYmVyIHwgdW5kZWZpbmVkPigpO1xuICBjb25zdCBnYXNMaW1pdCA9IGN1c3RvbUdhc0xpbWl0IHx8IGxpbWl0O1xuICBjb25zdCBbY3VzdG9tRmVlLCBzZXRDdXN0b21GZWVdID0gdXNlU3RhdGU8RmVlUmF0ZSB8IHVuZGVmaW5lZD4oXG4gICAgbmV0d29ya0ZlZT8ubWVkaXVtLFxuICApO1xuICBjb25zdCBbbmV3RmVlcywgc2V0TmV3RmVlc10gPSB1c2VTdGF0ZTxcbiAgICBSZXR1cm5UeXBlPHR5cGVvZiBjYWxjdWxhdGVHYXNBbmRGZWVzPlxuICA+KFxuICAgIGNhbGN1bGF0ZUdhc0FuZEZlZXMoe1xuICAgICAgbWF4RmVlUGVyR2FzLFxuICAgICAgdG9rZW5QcmljZSxcbiAgICAgIHRva2VuRGVjaW1hbHM6IG5ldHdvcms/Lm5ldHdvcmtUb2tlbi5kZWNpbWFscyxcbiAgICAgIGdhc0xpbWl0LFxuICAgIH0pLFxuICApO1xuICBjb25zdCBbaXNDb2xsYXBzZWQsIHNldElzQ29sbGFwc2VkXSA9IHVzZVN0YXRlKGlzQ29sbGFwc2libGUpO1xuICBjb25zdCB7IGZlYXR1cmVGbGFncyB9ID0gdXNlRmVhdHVyZUZsYWdDb250ZXh0KCk7XG4gIGNvbnN0IGN1c3RvbUlucHV0UmVmID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCBbc2hvd0VkaXRHYXNMaW1pdCwgc2V0U2hvd0VkaXRHYXNMaW1pdF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzZWxlY3RlZEZlZSwgc2V0U2VsZWN0ZWRGZWVdID0gdXNlU3RhdGU8R2FzRmVlTW9kaWZpZXI+KFxuICAgIG5ldHdvcmtGZWU/LmlzRml4ZWRGZWVcbiAgICAgID8gR2FzRmVlTW9kaWZpZXIuU0xPV1xuICAgICAgOiBzZWxlY3RlZEdhc0ZlZU1vZGlmaWVyIHx8IEdhc0ZlZU1vZGlmaWVyLlNMT1csXG4gICk7XG5cbiAgY29uc3QgeyBpc0dhc2xlc3NPbiwgc2V0SXNHYXNsZXNzT24sIGdhc2xlc3NQaGFzZSwgaXNHYXNsZXNzRWxpZ2libGUgfSA9XG4gICAgdXNlTmV0d29ya0ZlZUNvbnRleHQoKTtcblxuICB1c2VMaXZlQmFsYW5jZShQT0xMRURfQkFMQU5DRVMpOyAvLyBNYWtlIHN1cmUgd2UgYWx3YXlzIHVzZSB0aGUgbGF0ZXN0IG5hdGl2ZSBiYWxhbmNlLlxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFjdXN0b21GZWUgJiYgbmV0d29ya0ZlZSkge1xuICAgICAgc2V0Q3VzdG9tRmVlKG5ldHdvcmtGZWU/Lmxvdyk7XG4gICAgfVxuICB9LCBbY3VzdG9tRmVlLCBuZXR3b3JrRmVlXSk7XG5cbiAgY29uc3QgaGFuZGxlR2FzQ2hhbmdlID0gdXNlQ2FsbGJhY2soXG4gICAgKHJhdGU6IEZlZVJhdGUsIG1vZGlmaWVyOiBHYXNGZWVNb2RpZmllcik6IHZvaWQgPT4ge1xuICAgICAgaWYgKG1vZGlmaWVyID09PSBHYXNGZWVNb2RpZmllci5DVVNUT00pIHtcbiAgICAgICAgc2V0Q3VzdG9tRmVlKHJhdGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1Rvb0hpZ2ggPSBtYXhHYXNQcmljZSA/IHJhdGUubWF4RmVlUGVyR2FzID4gbWF4R2FzUHJpY2UgOiBmYWxzZTtcblxuICAgICAgLy8gdXBkYXRlXG4gICAgICBjb25zdCB1cGRhdGVkRmVlcyA9IGNhbGN1bGF0ZUdhc0FuZEZlZXMoe1xuICAgICAgICBtYXhGZWVQZXJHYXM6IHJhdGUubWF4RmVlUGVyR2FzLFxuICAgICAgICB0b2tlblByaWNlLFxuICAgICAgICB0b2tlbkRlY2ltYWxzOiBuZXR3b3JrPy5uZXR3b3JrVG9rZW4uZGVjaW1hbHMsXG4gICAgICAgIGdhc0xpbWl0LFxuICAgICAgfSk7XG5cbiAgICAgIG9uQ2hhbmdlKHtcbiAgICAgICAgY3VzdG9tR2FzTGltaXQ6IGN1c3RvbUdhc0xpbWl0LFxuICAgICAgICBtYXhGZWVQZXJHYXM6IHJhdGUubWF4RmVlUGVyR2FzLFxuICAgICAgICBtYXhQcmlvcml0eUZlZVBlckdhczogcmF0ZS5tYXhQcmlvcml0eUZlZVBlckdhcyxcbiAgICAgICAgZmVlVHlwZTogbW9kaWZpZXIsXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFpc1Rvb0hpZ2gpIHtcbiAgICAgICAgc2V0TmV3RmVlcyh1cGRhdGVkRmVlcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbXG4gICAgICB0b2tlblByaWNlLFxuICAgICAgbmV0d29yaz8ubmV0d29ya1Rva2VuLmRlY2ltYWxzLFxuICAgICAgZ2FzTGltaXQsXG4gICAgICBjdXN0b21HYXNMaW1pdCxcbiAgICAgIG1heEdhc1ByaWNlLFxuICAgICAgb25DaGFuZ2UsXG4gICAgXSxcbiAgKTtcblxuICBjb25zdCB1cGRhdGVHYXNGZWUgPSB1c2VDYWxsYmFjayhcbiAgICAobW9kaWZpZXI/OiBHYXNGZWVNb2RpZmllcikgPT4ge1xuICAgICAgaWYgKCFtb2RpZmllciB8fCAhbmV0d29ya0ZlZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZXRTZWxlY3RlZEZlZShtb2RpZmllcik7XG4gICAgICBzd2l0Y2ggKG1vZGlmaWVyKSB7XG4gICAgICAgIGNhc2UgR2FzRmVlTW9kaWZpZXIuTk9STUFMOiB7XG4gICAgICAgICAgaGFuZGxlR2FzQ2hhbmdlKG5ldHdvcmtGZWUubWVkaXVtLCBtb2RpZmllcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBHYXNGZWVNb2RpZmllci5GQVNUOiB7XG4gICAgICAgICAgaGFuZGxlR2FzQ2hhbmdlKG5ldHdvcmtGZWUuaGlnaCwgbW9kaWZpZXIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgR2FzRmVlTW9kaWZpZXIuQ1VTVE9NOlxuICAgICAgICAgIGlmIChjdXN0b21GZWUpIHtcbiAgICAgICAgICAgIGhhbmRsZUdhc0NoYW5nZShjdXN0b21GZWUsIG1vZGlmaWVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaGFuZGxlR2FzQ2hhbmdlKG5ldHdvcmtGZWUubG93LCBHYXNGZWVNb2RpZmllci5TTE9XKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtoYW5kbGVHYXNDaGFuZ2UsIG5ldHdvcmtGZWUsIGN1c3RvbUZlZV0sXG4gICk7XG5cbiAgY29uc3QgaGFuZGxlTW9kaWZpZXJDbGljayA9IHVzZUNhbGxiYWNrKFxuICAgIChtb2RpZmllcj86IEdhc0ZlZU1vZGlmaWVyKSA9PiB7XG4gICAgICB1cGRhdGVHYXNGZWUobW9kaWZpZXIpO1xuXG4gICAgICBpZiAob25Nb2RpZmllckNoYW5nZUNhbGxiYWNrKSB7XG4gICAgICAgIG9uTW9kaWZpZXJDaGFuZ2VDYWxsYmFjayhtb2RpZmllcik7XG4gICAgICB9XG4gICAgfSxcbiAgICBbdXBkYXRlR2FzRmVlLCBvbk1vZGlmaWVyQ2hhbmdlQ2FsbGJhY2tdLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gMS4gVXBkYXRlIHNlbGVjdGVkIGZlZXMgd2hlbiBkYXRhIGlzIGxvYWRlZCBsb2FkZWQuXG4gICAgLy8gMi4gTWFrZSBzdXJlIE5vcm1hbCBwcmVzZXQgaXMgc2VsZWN0ZWQgaWYgdGhlIG5ldHdvcmsgZmVlIGlzIGZpeGVkLlxuICAgIGlmICh0eXBlb2YgbmV0d29ya0ZlZT8uaXNGaXhlZEZlZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5ldHdvcmtGZWUuaXNGaXhlZEZlZSkge1xuICAgICAgdXBkYXRlR2FzRmVlKEdhc0ZlZU1vZGlmaWVyLlNMT1cpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVHYXNGZWUoc2VsZWN0ZWRHYXNGZWVNb2RpZmllcik7XG4gICAgfVxuICB9LCBbbmV0d29ya0ZlZT8uaXNGaXhlZEZlZSwgc2VsZWN0ZWRHYXNGZWVNb2RpZmllciwgdXBkYXRlR2FzRmVlXSk7XG5cbiAgY29uc3QgZmVlQW1vdW50ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFuZXR3b3JrPy5uZXR3b3JrVG9rZW4pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJvdW5kZWQ6ICctJyxcbiAgICAgICAgcHJlY2lzZTogJycsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZXN0aW1hdGVkRmVlID09PSAnYmlnaW50Jykge1xuICAgICAgY29uc3QgdW5pdCA9IG5ldyBUb2tlblVuaXQoXG4gICAgICAgIGVzdGltYXRlZEZlZSxcbiAgICAgICAgbmV0d29yaz8ubmV0d29ya1Rva2VuLmRlY2ltYWxzLFxuICAgICAgICBuZXR3b3JrPy5uZXR3b3JrVG9rZW4uc3ltYm9sLFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcm91bmRlZDogdW5pdC50b0Rpc3BsYXkoKSxcbiAgICAgICAgcHJlY2lzZTogdW5pdC50b1N0cmluZygpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcm91bmRlZDogbmV3RmVlcy5mZWVVbml0LnRvRGlzcGxheSgpLFxuICAgICAgcHJlY2lzZTogbmV3RmVlcy5mZWVVbml0LnRvU3RyaW5nKCksXG4gICAgfTtcbiAgfSwgW25ldHdvcms/Lm5ldHdvcmtUb2tlbiwgZXN0aW1hdGVkRmVlLCBuZXdGZWVzLmZlZVVuaXRdKTtcblxuICBjb25zdCBvbkdhc2xlc3NTd2l0Y2ggPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgaGFuZGxlTW9kaWZpZXJDbGljayhHYXNGZWVNb2RpZmllci5OT1JNQUwpO1xuICAgIHNldElzR2FzbGVzc09uKCFpc0dhc2xlc3NPbik7XG4gIH0sIFtoYW5kbGVNb2RpZmllckNsaWNrLCBpc0dhc2xlc3NPbiwgc2V0SXNHYXNsZXNzT25dKTtcblxuICBpZiAoIW5ldHdvcmtGZWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGlzTWF4RmVlVXNlZCA9XG4gICAgbmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkVWTSAmJiAhbmV0d29ya0ZlZS5pc0ZpeGVkRmVlO1xuXG4gIHJldHVybiAoXG4gICAgPEFwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXJcbiAgICAgICAgbGFiZWw9e3QoaXNNYXhGZWVVc2VkID8gJ01heGltdW0gTmV0d29yayBGZWUnIDogJ05ldHdvcmsgRmVlJyl9XG4gICAgICAgIHRvb2x0aXA9e1xuICAgICAgICAgIGlzTWF4RmVlVXNlZFxuICAgICAgICAgICAgPyB0KFxuICAgICAgICAgICAgICAgICdDb3JlIGVzdGltYXRlcyB0aGUgbWF4aW11bSBnYXMgKG1heEZlZVBlckdhcykgYSB0cmFuc2FjdGlvbiBjb3VsZCBjb25zdW1lIGJhc2VkIG9uIG5ldHdvcmsgY29uZGl0aW9ucy4gVGhpcyB0cmFuc2FjdGlvbiB3aWxsIGxpa2VseSBjb25zdW1lIGxlc3MgZ2FzIHRoYW4gZXN0aW1hdGVkLicsXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgID5cbiAgICAgICAge2lzQ29sbGFwc2libGUgJiYgKFxuICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjdXN0b21pemUtZmVlLWJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc0NvbGxhcHNlZCgod2FzQ29sbGFwc2VkKSA9PiAhd2FzQ29sbGFwc2VkKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Q2hldnJvbkRvd25JY29uXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc0NvbGxhcHNlZCA/ICdyb3RhdGVYKDBkZWcpJyA6ICdyb3RhdGVYKDE4MGRlZyknLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgICl9XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbkhlYWRlcj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICA8Q29sbGFwc2VcbiAgICAgICAgICBpbj17IWlzQ29sbGFwc2libGUgfHwgIWlzQ29sbGFwc2VkfVxuICAgICAgICAgIG1vdW50T25FbnRlclxuICAgICAgICAgIHVubW91bnRPbkV4aXRcbiAgICAgICAgPlxuICAgICAgICAgIHshaXNCYXRjaEFwcHJvdmFsU2NyZWVuICYmXG4gICAgICAgICAgICBpc0dhc2xlc3NFbGlnaWJsZSAmJlxuICAgICAgICAgICAgZ2FzbGVzc1BoYXNlICE9PSBHYXNsZXNzUGhhc2UuRVJST1IgJiZcbiAgICAgICAgICAgIGZlYXR1cmVGbGFnc1tGZWF0dXJlR2F0ZXMuR0FTTEVTU10gJiYgKFxuICAgICAgICAgICAgICA8R2FzbGVzc0ZlZVxuICAgICAgICAgICAgICAgIG9uU3dpdGNoPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBvbkdhc2xlc3NTd2l0Y2goKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGlzVHVybmVkT249e2lzR2FzbGVzc09ufVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtnYXNsZXNzUGhhc2UgPT09IEdhc2xlc3NQaGFzZS5GVU5ESU5HX0lOX1BST0dSRVNTfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8Q29sbGFwc2VcbiAgICAgICAgICAgIGluPXshaXNHYXNsZXNzT24gfHwgIWlzR2FzbGVzc0VsaWdpYmxlfVxuICAgICAgICAgICAgbW91bnRPbkVudGVyXG4gICAgICAgICAgICB1bm1vdW50T25FeGl0XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICBnYXA6IHNpemUgPT09ICdzbWFsbCcgPyAwLjUgOiAwLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8RmVlQnV0dG9uXG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJnYXMtZmVlLXNsb3ctYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17Z2FzUHJpY2VFZGl0RGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgY29sb3I9e1xuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGZWUgPT09IEdhc0ZlZU1vZGlmaWVyLlNMT1cgPyAncHJpbWFyeScgOiAnc2Vjb25kYXJ5J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBoYW5kbGVNb2RpZmllckNsaWNrKEdhc0ZlZU1vZGlmaWVyLlNMT1cpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgdmFyaWFudD17c2l6ZSA9PT0gJ3NtYWxsJyA/ICdjYXB0aW9uJyA6ICdib2R5Mid9XG4gICAgICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnc2VtaWJvbGQnIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3QoJ1Nsb3cnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvRmVlQnV0dG9uPlxuICAgICAgICAgICAgICB7IW5ldHdvcmtGZWUuaXNGaXhlZEZlZSAmJiAoXG4gICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgIDxGZWVCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJnYXMtZmVlLW5vcm1hbC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Z2FzUHJpY2VFZGl0RGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yPXtcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEZlZSA9PT0gR2FzRmVlTW9kaWZpZXIuTk9STUFMXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdwcmltYXJ5J1xuICAgICAgICAgICAgICAgICAgICAgICAgOiAnc2Vjb25kYXJ5J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVNb2RpZmllckNsaWNrKEdhc0ZlZU1vZGlmaWVyLk5PUk1BTCk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD17c2l6ZSA9PT0gJ3NtYWxsJyA/ICdjYXB0aW9uJyA6ICdib2R5Mid9XG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ3NlbWlib2xkJyB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3QoJ05vcm1hbCcpfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8L0ZlZUJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxGZWVCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJnYXMtZmVlLWZhc3QtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2dhc1ByaWNlRWRpdERpc2FibGVkfVxuICAgICAgICAgICAgICAgICAgICBjb2xvcj17XG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGZWUgPT09IEdhc0ZlZU1vZGlmaWVyLkZBU1RcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ3ByaW1hcnknXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICdzZWNvbmRhcnknXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZU1vZGlmaWVyQ2xpY2soR2FzRmVlTW9kaWZpZXIuRkFTVCk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD17c2l6ZSA9PT0gJ3NtYWxsJyA/ICdjYXB0aW9uJyA6ICdib2R5Mid9XG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ3NlbWlib2xkJyB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3QoJ0Zhc3QnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgPC9GZWVCdXR0b24+XG4gICAgICAgICAgICAgICAgICA8RmVlQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZ2FzLWZlZS1jdXN0b20tYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2dhc1ByaWNlRWRpdERpc2FibGVkfVxuICAgICAgICAgICAgICAgICAgICBjb2xvcj17XG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGZWUgPT09IEdhc0ZlZU1vZGlmaWVyLkNVU1RPTVxuICAgICAgICAgICAgICAgICAgICAgICAgPyAncHJpbWFyeSdcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJ3NlY29uZGFyeSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTW9kaWZpZXJDbGljayhHYXNGZWVNb2RpZmllci5DVVNUT00pO1xuICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbUlucHV0UmVmPy5jdXJyZW50Py5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgIHNldFNob3dFZGl0R2FzTGltaXQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVSaXBwbGVcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PXtzaXplID09PSAnc21hbGwnID8gJ2NhcHRpb24nIDogJ2JvZHkyJ31cbiAgICAgICAgICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnc2VtaWJvbGQnIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnQ3VzdG9tJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDwvRmVlQnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICB7IWlzR2FzbGVzc09uICYmIChcbiAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIGNvbXBvbmVudD1cInNwYW5cIlxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0KCdGZWUgQW1vdW50Jyl9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cblxuICAgICAgICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPFRvb2x0aXAgdGl0bGU9e2ZlZUFtb3VudC5wcmVjaXNlfT5cbiAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgIDxUcnVuY2F0ZUZlZUFtb3VudFxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibmV0d29yay1mZWUtdG9rZW4tYW1vdW50XCJcbiAgICAgICAgICAgICAgICAgICAgICBhbW91bnQ9e2ZlZUFtb3VudC5wcmVjaXNlfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGhhc0Vub3VnaEZvckZlZSA/IHVuZGVmaW5lZCA6ICdlcnJvci5tYWluJyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge25ldHdvcms/Lm5ldHdvcmtUb2tlbi5zeW1ib2x9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibmV0d29yay1mZWUtY3VycmVuY3ktYW1vdW50XCJcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHshaXNOYU4oTnVtYmVyKG5ld0ZlZXMuZmVlVVNEKSlcbiAgICAgICAgICAgICAgICAgID8gYCR7Y3VycmVuY3lGb3JtYXR0ZXIoTnVtYmVyKG5ld0ZlZXMuZmVlVVNEKSl9YFxuICAgICAgICAgICAgICAgICAgOiAnJ31cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICApfVxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgPEN1c3RvbUdhc0xpbWl0RGlhbG9nXG4gICAgICAgIG9wZW49e0Jvb2xlYW4oXG4gICAgICAgICAgbmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkVWTSAmJlxuICAgICAgICAgICAgc2hvd0VkaXRHYXNMaW1pdCAmJlxuICAgICAgICAgICAgY3VzdG9tRmVlPy5tYXhGZWVQZXJHYXMsXG4gICAgICAgICl9XG4gICAgICA+XG4gICAgICAgIDxDdXN0b21HYXNTZXR0aW5nc1xuICAgICAgICAgIGlzTGltaXRSZWFkb25seT17aXNMaW1pdFJlYWRvbmx5fVxuICAgICAgICAgIGZlZURpc3BsYXlEZWNpbWFscz17bmV0d29ya0ZlZS5kaXNwbGF5RGVjaW1hbHN9XG4gICAgICAgICAgZ2FzTGltaXQ9e2dhc0xpbWl0ID8/IDB9XG4gICAgICAgICAgbWF4RmVlUGVyR2FzPXtjdXN0b21GZWU/Lm1heEZlZVBlckdhcyB8fCAwbn1cbiAgICAgICAgICBtYXhQcmlvcml0eUZlZVBlckdhcz17Y3VzdG9tRmVlPy5tYXhQcmlvcml0eUZlZVBlckdhcyB8fCAwbn1cbiAgICAgICAgICBvbkNhbmNlbD17KCkgPT4gc2V0U2hvd0VkaXRHYXNMaW1pdChmYWxzZSl9XG4gICAgICAgICAgb25TYXZlPXsoZGF0YSkgPT4ge1xuICAgICAgICAgICAgc2V0Q3VzdG9tR2FzTGltaXQoZGF0YS5jdXN0b21HYXNMaW1pdCk7XG4gICAgICAgICAgICBzZXRDdXN0b21GZWUoe1xuICAgICAgICAgICAgICBtYXhGZWVQZXJHYXM6IGRhdGEubWF4RmVlUGVyR2FzLFxuICAgICAgICAgICAgICBtYXhQcmlvcml0eUZlZVBlckdhczogZGF0YS5tYXhQcmlvcml0eUZlZVBlckdhcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2V0U2VsZWN0ZWRGZWUoR2FzRmVlTW9kaWZpZXIuQ1VTVE9NKTtcbiAgICAgICAgICAgIHNldFNob3dFZGl0R2FzTGltaXQoZmFsc2UpO1xuICAgICAgICAgICAgc2V0TmV3RmVlcyhcbiAgICAgICAgICAgICAgY2FsY3VsYXRlR2FzQW5kRmVlcyh7XG4gICAgICAgICAgICAgICAgbWF4RmVlUGVyR2FzOiBkYXRhLm1heEZlZVBlckdhcyxcbiAgICAgICAgICAgICAgICB0b2tlblByaWNlLFxuICAgICAgICAgICAgICAgIHRva2VuRGVjaW1hbHM6IG5ldHdvcms/Lm5ldHdvcmtUb2tlbi5kZWNpbWFscyxcbiAgICAgICAgICAgICAgICBnYXNMaW1pdDogZGF0YS5jdXN0b21HYXNMaW1pdCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgb25DaGFuZ2Uoe1xuICAgICAgICAgICAgICBjdXN0b21HYXNMaW1pdDogZGF0YS5jdXN0b21HYXNMaW1pdCxcbiAgICAgICAgICAgICAgbWF4RmVlUGVyR2FzOiBkYXRhLm1heEZlZVBlckdhcyxcbiAgICAgICAgICAgICAgbWF4UHJpb3JpdHlGZWVQZXJHYXM6IGRhdGEubWF4UHJpb3JpdHlGZWVQZXJHYXMsXG4gICAgICAgICAgICAgIGZlZVR5cGU6IEdhc0ZlZU1vZGlmaWVyLkNVU1RPTSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH19XG4gICAgICAgICAgbmV0d29yaz17bmV0d29ya31cbiAgICAgICAgLz5cbiAgICAgIDwvQ3VzdG9tR2FzTGltaXREaWFsb2c+XG4gICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBmb3JtYXRVbml0cywgcGFyc2VVbml0cyB9IGZyb20gJ2V0aGVycyc7XG5pbXBvcnQgeyBUb2tlblVuaXQgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgeyB1c2VOYXRpdmVUb2tlblByaWNlIH0gZnJvbSAnQHNyYy9ob29rcy91c2VUb2tlblByaWNlJztcbmltcG9ydCB7IGNhbGN1bGF0ZUdhc0FuZEZlZXMgfSBmcm9tICdAc3JjL3V0aWxzL2NhbGN1bGF0ZUdhc0FuZEZlZXMnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFBhZ2VUaXRsZSB9IGZyb20gJy4vUGFnZVRpdGxlJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcbmltcG9ydCB7XG4gIEJveCxcbiAgQnV0dG9uLFxuICBEaXZpZGVyLFxuICBJbmZvQ2lyY2xlSWNvbixcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgVG9vbHRpcCxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVNldHRpbmdzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvU2V0dGluZ3NQcm92aWRlcic7XG5pbXBvcnQgeyBUZXh0RmllbGRMYWJlbCB9IGZyb20gJy4vVGV4dEZpZWxkTGFiZWwnO1xuaW1wb3J0IHsgVHJ1bmNhdGVGZWVBbW91bnQgfSBmcm9tICcuL1RydW5jYXRlRmVlQW1vdW50JztcblxudHlwZSBHYXNTZXR0aW5ncyA9IHtcbiAgY3VzdG9tR2FzTGltaXQ6IG51bWJlcjtcbiAgbWF4RmVlUGVyR2FzOiBiaWdpbnQ7XG4gIG1heFByaW9yaXR5RmVlUGVyR2FzOiBiaWdpbnQ7XG59O1xuXG50eXBlIE9uU2F2ZSA9IChkYXRhOiBHYXNTZXR0aW5ncykgPT4gdm9pZDtcblxuaW50ZXJmYWNlIEN1c3RvbUdhc1NldHRpbmdzUHJvcHMge1xuICBmZWVEaXNwbGF5RGVjaW1hbHM6IG51bWJlcjtcbiAgZ2FzTGltaXQ6IG51bWJlcjtcbiAgaXNMaW1pdFJlYWRvbmx5PzogYm9vbGVhbjtcbiAgbWF4RmVlUGVyR2FzOiBiaWdpbnQ7XG4gIG1heFByaW9yaXR5RmVlUGVyR2FzOiBiaWdpbnQ7XG4gIG9uU2F2ZTogT25TYXZlO1xuICBvbkNhbmNlbCgpOiB2b2lkO1xuICBuZXR3b3JrPzogTmV0d29yaztcbn1cblxuY29uc3QgRXJyb3JNZXNzYWdlID0gKHsgbWVzc2FnZSB9KSA9PiAoXG4gIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgc3g9e3sgY29sb3I6ICdlcnJvci5saWdodCcgfX0+XG4gICAge21lc3NhZ2V9XG4gIDwvVHlwb2dyYXBoeT5cbik7XG5cbmNvbnN0IEZpYXRWYWx1ZSA9ICh7IHZhbHVlIH0pID0+IChcbiAgPEJveCBzeD17eyB3aWR0aDogJzEwMCUnLCBwdDogMC41LCBtaW5IZWlnaHQ6ICcxNnB4JyB9fT5cbiAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGNvbXBvbmVudD1cInBcIiBzeD17eyB0ZXh0QWxpZ246ICdlbmQnIH19PlxuICAgICAge3ZhbHVlfVxuICAgIDwvVHlwb2dyYXBoeT5cbiAgPC9Cb3g+XG4pO1xuXG5jb25zdCBGZWVBbW91bnQgPSAoeyBkZWNpbWFscywgdmFsdWUsIGZpYXRWYWx1ZSwgdG9rZW5TeW1ib2wgfSkgPT4ge1xuICBjb25zdCB1bml0ID0gbmV3IFRva2VuVW5pdCh2YWx1ZSwgZGVjaW1hbHMsIHRva2VuU3ltYm9sKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB0ZXh0QWxpZ246ICdlbmQnLCBnYXA6IDAuNSB9fT5cbiAgICAgIDxTdGFjayBzeD17eyB0ZXh0QWxpZ246ICdlbmQnIH19PlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBnYXA6IDAuNSxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUb29sdGlwIHRpdGxlPXt1bml0LnRvU3RyaW5nKCl9PlxuICAgICAgICAgICAgPFRydW5jYXRlRmVlQW1vdW50IGFtb3VudD17dW5pdC50b0Rpc3BsYXkoKX0gLz5cbiAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cInN1YnRpdGxlMlwiIGNvbXBvbmVudD1cInNwYW5cIiBjb2xvcj1cInRleHQucHJpbWFyeVwiPlxuICAgICAgICAgICAge3Rva2VuU3ltYm9sfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICAge2ZpYXRWYWx1ZSAmJiAoXG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiPlxuICAgICAgICAgICAge2ZpYXRWYWx1ZX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQ3VzdG9tR2FzU2V0dGluZ3Moe1xuICBmZWVEaXNwbGF5RGVjaW1hbHMsXG4gIGdhc0xpbWl0LFxuICBpc0xpbWl0UmVhZG9ubHksXG4gIG1heEZlZVBlckdhcyxcbiAgbWF4UHJpb3JpdHlGZWVQZXJHYXMsXG4gIG9uU2F2ZSxcbiAgb25DYW5jZWwsXG4gIG5ldHdvcmssXG59OiBDdXN0b21HYXNTZXR0aW5nc1Byb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdG9rZW5QcmljZSA9IHVzZU5hdGl2ZVRva2VuUHJpY2UobmV0d29yayk7XG4gIGNvbnN0IHsgY3VycmVuY3lGb3JtYXR0ZXIgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICBjb25zdCB0b2tlbkRlY2ltYWxzID0gbmV0d29yaz8ubmV0d29ya1Rva2VuLmRlY2ltYWxzID8/IDE4O1xuICBjb25zdCBbY3VzdG9tR2FzTGltaXQsIHNldEN1c3RvbUdhc0xpbWl0XSA9IHVzZVN0YXRlPG51bWJlcj4oZ2FzTGltaXQpO1xuICBjb25zdCBbY3VzdG9tTWF4RmVlUGVyR2FzLCBzZXRDdXN0b21NYXhGZWVQZXJHYXNdID1cbiAgICB1c2VTdGF0ZTxiaWdpbnQ+KG1heEZlZVBlckdhcyk7XG4gIGNvbnN0IFtjdXN0b21NYXhQcmlvcml0eUZlZVBlckdhcywgc2V0Q3VzdG9tTWF4UHJpb3JpdHlGZWVQZXJHYXNdID1cbiAgICB1c2VTdGF0ZTxiaWdpbnQ+KG1heFByaW9yaXR5RmVlUGVyR2FzKTtcbiAgY29uc3QgW2Vycm9ycywgc2V0RXJyb3JzXSA9IHVzZVN0YXRlPHtcbiAgICBnYXNMaW1pdD86IHN0cmluZztcbiAgICBtYXhGZWU/OiBzdHJpbmc7XG4gICAgbWF4UHJpb3JpdHlGZWU/OiBzdHJpbmc7XG4gIH0+KHt9KTtcbiAgY29uc3QgW25ld0ZlZXMsIHNldE5ld0ZlZXNdID0gdXNlU3RhdGU8XG4gICAgUmV0dXJuVHlwZTx0eXBlb2YgY2FsY3VsYXRlR2FzQW5kRmVlcz5cbiAgPihcbiAgICBjYWxjdWxhdGVHYXNBbmRGZWVzKHtcbiAgICAgIG1heEZlZVBlckdhcyxcbiAgICAgIHRva2VuUHJpY2UsXG4gICAgICB0b2tlbkRlY2ltYWxzLFxuICAgICAgZ2FzTGltaXQsXG4gICAgfSksXG4gICk7XG4gIGZ1bmN0aW9uIGhhbmRsZU9uU2F2ZSgpOiB2b2lkIHtcbiAgICBpZiAoY3VzdG9tR2FzTGltaXQpIHtcbiAgICAgIG9uU2F2ZSh7XG4gICAgICAgIGN1c3RvbUdhc0xpbWl0OiBjdXN0b21HYXNMaW1pdCxcbiAgICAgICAgbWF4RmVlUGVyR2FzOiBjdXN0b21NYXhGZWVQZXJHYXMsXG4gICAgICAgIG1heFByaW9yaXR5RmVlUGVyR2FzOiBjdXN0b21NYXhQcmlvcml0eUZlZVBlckdhcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGhhc0Vycm9ycyA9IGZhbHNlO1xuXG4gICAgaWYgKGN1c3RvbUdhc0xpbWl0IDw9IDApIHtcbiAgICAgIHNldEVycm9ycygoZXhpc3RpbmdFcnJvcnMpID0+ICh7XG4gICAgICAgIC4uLmV4aXN0aW5nRXJyb3JzLFxuICAgICAgICBnYXNMaW1pdDogdCgnR2FzIExpbWl0IHRvbyBsb3cnKSxcbiAgICAgIH0pKTtcbiAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldEVycm9ycygoZXhpc3RpbmdFcnJvcnMpID0+ICh7XG4gICAgICAgIC4uLmV4aXN0aW5nRXJyb3JzLFxuICAgICAgICBnYXNMaW1pdDogdW5kZWZpbmVkLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGlmIChjdXN0b21NYXhQcmlvcml0eUZlZVBlckdhcyA+IGN1c3RvbU1heEZlZVBlckdhcykge1xuICAgICAgc2V0RXJyb3JzKChleGlzdGluZ0Vycm9ycykgPT4gKHtcbiAgICAgICAgLi4uZXhpc3RpbmdFcnJvcnMsXG4gICAgICAgIG1heFByaW9yaXR5RmVlOiB0KFxuICAgICAgICAgICdNYXhpbXVtIHByaW9yaXR5IGZlZSBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIG1heGltdW0gZmVlJyxcbiAgICAgICAgKSxcbiAgICAgIH0pKTtcbiAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldEVycm9ycygoZXhpc3RpbmdFcnJvcnMpID0+ICh7XG4gICAgICAgIC4uLmV4aXN0aW5nRXJyb3JzLFxuICAgICAgICBtYXhQcmlvcml0eUZlZTogdW5kZWZpbmVkLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGlmIChoYXNFcnJvcnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgY2FsY3VsYXRlZEdhc0FuZEZlZXMgPSBjYWxjdWxhdGVHYXNBbmRGZWVzKHtcbiAgICAgICAgbWF4RmVlUGVyR2FzOiBjdXN0b21NYXhGZWVQZXJHYXMsXG4gICAgICAgIG1heFByaW9yaXR5RmVlUGVyR2FzOiBjdXN0b21NYXhQcmlvcml0eUZlZVBlckdhcyxcbiAgICAgICAgdG9rZW5QcmljZSxcbiAgICAgICAgdG9rZW5EZWNpbWFscyxcbiAgICAgICAgZ2FzTGltaXQ6IGN1c3RvbUdhc0xpbWl0LFxuICAgICAgfSk7XG4gICAgICBzZXRFcnJvcnMoe30pO1xuICAgICAgc2V0TmV3RmVlcyhjYWxjdWxhdGVkR2FzQW5kRmVlcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdvdmVyZmxvdycpKSB7XG4gICAgICAgICAgLy8gaHR0cHM6Ly9saW5rcy5ldGhlcnMub3JnL3Y1LWVycm9ycy1OVU1FUklDX0ZBVUxULW92ZXJmbG93XG4gICAgICAgICAgc2V0RXJyb3JzKChleGlzdGluZ0Vycm9ycykgPT4gKHtcbiAgICAgICAgICAgIC4uLmV4aXN0aW5nRXJyb3JzLFxuICAgICAgICAgICAgZ2FzTGltaXQ6IHQoJ0dhcyBMaW1pdCBpcyB0b28gbXVjaCcpLFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID09PSAnUGxlYXNlIHByb3ZpZGUgZ2FzUHJpY2Ugb3IgbWF4RmVlUGVyR2FzIHBhcmFtZXRlcnMnXG4gICAgICAgICkge1xuICAgICAgICAgIHNldEVycm9ycygoZXhpc3RpbmdFcnJvcnMpID0+ICh7XG4gICAgICAgICAgICAuLi5leGlzdGluZ0Vycm9ycyxcbiAgICAgICAgICAgIG1heEZlZTogdCgnUHJvdmlkZSB2YWxpZCBudW1lcmljYWwgdmFsdWUgZm9yIG1heGltdW0gZmVlJyksXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCBbXG4gICAgY3VzdG9tR2FzTGltaXQsXG4gICAgY3VzdG9tTWF4RmVlUGVyR2FzLFxuICAgIGN1c3RvbU1heFByaW9yaXR5RmVlUGVyR2FzLFxuICAgIG1heEZlZVBlckdhcyxcbiAgICB0LFxuICAgIHRva2VuUHJpY2UsXG4gICAgdG9rZW5EZWNpbWFscyxcbiAgXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICA8UGFnZVRpdGxlIG1hcmdpbj1cIjE2cHggMCAwXCIgb25CYWNrQ2xpY2s9e29uQ2FuY2VsfT5cbiAgICAgICAge3QoJ0VkaXQgTmV0d29yayBGZWUnKX1cbiAgICAgIDwvUGFnZVRpdGxlPlxuICAgICAgPFN0YWNrIHN4PXt7IHBhZGRpbmc6IDIsIGdhcDogMi41IH19PlxuICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6ICcxMDAlJywgZ2FwOiAwLjUgfX0+XG4gICAgICAgICAgPFRleHRGaWVsZExhYmVsXG4gICAgICAgICAgICBsYWJlbD17dCgnTWF4IEJhc2UgRmVlJyl9XG4gICAgICAgICAgICB0b29sdGlwPXt0KFxuICAgICAgICAgICAgICAnVGhlIEJhc2UgRmVlIGlzIHNldCBieSB0aGUgbmV0d29yayBhbmQgY2hhbmdlcyBmcmVxdWVudGx5LiBBbnkgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBzZXQgTWF4IEJhc2UgRmVlIGFuZCB0aGUgYWN0dWFsIEJhc2UgRmVlIHdpbGwgYmUgcmVmdW5kZWQuJyxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHR5cGU9eydudW1iZXInfVxuICAgICAgICAgICAgdmFsdWU9e2Zvcm1hdFVuaXRzKGN1c3RvbU1heEZlZVBlckdhcywgZmVlRGlzcGxheURlY2ltYWxzKX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgIHNldEN1c3RvbU1heEZlZVBlckdhcyhcbiAgICAgICAgICAgICAgICBwYXJzZVVuaXRzKGV2dC5jdXJyZW50VGFyZ2V0LnZhbHVlIHx8ICcwJywgZmVlRGlzcGxheURlY2ltYWxzKSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBlcnJvcj17ISFlcnJvcnMubWF4RmVlfVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJtYXgtYmFzZS1mZWVcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAge2Vycm9ycy5tYXhGZWUgPyAoXG4gICAgICAgICAgICA8RXJyb3JNZXNzYWdlIG1lc3NhZ2U9e2Vycm9ycy5tYXhGZWV9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxGaWF0VmFsdWVcbiAgICAgICAgICAgICAgdmFsdWU9e25ld0ZlZXMuZmVlVVNEID8gY3VycmVuY3lGb3JtYXR0ZXIobmV3RmVlcy5mZWVVU0QpIDogJyd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogJzEwMCUnLCBnYXA6IDAuNSB9fT5cbiAgICAgICAgICA8VGV4dEZpZWxkTGFiZWxcbiAgICAgICAgICAgIGxhYmVsPXt0KCdNYXggUHJpb3JpdHkgRmVlJyl9XG4gICAgICAgICAgICB0b29sdGlwPXt0KFxuICAgICAgICAgICAgICAnVGhlIFByaW9yaXR5IEZlZSBpcyBhbiBpbmNlbnRpdmUgcGFpZCB0byBuZXR3b3JrIG9wZXJhdG9ycyB0byBwcmlvcml0aXplIHByb2Nlc3Npbmcgb2YgdGhpcyB0cmFuc2FjdGlvbi4nLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICB0eXBlPXsnbnVtYmVyJ31cbiAgICAgICAgICAgIHZhbHVlPXtmb3JtYXRVbml0cyhjdXN0b21NYXhQcmlvcml0eUZlZVBlckdhcywgZmVlRGlzcGxheURlY2ltYWxzKX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgIHNldEN1c3RvbU1heFByaW9yaXR5RmVlUGVyR2FzKFxuICAgICAgICAgICAgICAgIHBhcnNlVW5pdHMoZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUgfHwgJzAnLCBmZWVEaXNwbGF5RGVjaW1hbHMpLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGVycm9yPXshIWVycm9ycy5tYXhQcmlvcml0eUZlZX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibWF4LXByaW9yaXR5LWZlZVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICB7ZXJyb3JzLm1heFByaW9yaXR5RmVlID8gKFxuICAgICAgICAgICAgPEVycm9yTWVzc2FnZSBtZXNzYWdlPXtlcnJvcnMubWF4UHJpb3JpdHlGZWV9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxGaWF0VmFsdWVcbiAgICAgICAgICAgICAgdmFsdWU9e25ld0ZlZXMudGlwVVNEID8gY3VycmVuY3lGb3JtYXR0ZXIobmV3RmVlcy50aXBVU0QpIDogJyd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogJzEwMCUnLCBnYXA6IDAuNSB9fT5cbiAgICAgICAgICA8VGV4dEZpZWxkTGFiZWxcbiAgICAgICAgICAgIGxhYmVsPXt0KCdHYXMgTGltaXQnKX1cbiAgICAgICAgICAgIHRvb2x0aXA9e1xuICAgICAgICAgICAgICBpc0xpbWl0UmVhZG9ubHlcbiAgICAgICAgICAgICAgICA/IHQoXG4gICAgICAgICAgICAgICAgICAgICdFc3RpbWF0ZWQgZ2FzIHVuaXRzIG5lZWRlZCB0byBjb21wbGV0ZSB0aGUgdHJhbnNhY3Rpb24uIEluY2x1ZGVzIGEgc21hbGwgYnVmZmVyLiBOb3QgZWRpdGFibGUgZm9yIHRoaXMgdHJhbnNhY3Rpb24uJyxcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICA6IHQoXG4gICAgICAgICAgICAgICAgICAgICdUb3RhbCB1bml0cyBvZiBnYXMgbmVlZGVkIHRvIGNvbXBsZXRlIHRoZSB0cmFuc2FjdGlvbi4gRG8gbm90IGVkaXQgdW5sZXNzIG5lY2Vzc2FyeS4nLFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBJbnB1dFByb3BzPXt7XG4gICAgICAgICAgICAgIHJlYWRPbmx5OiBpc0xpbWl0UmVhZG9ubHksXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzTGltaXRSZWFkb25seX1cbiAgICAgICAgICAgIHR5cGU9eydudW1iZXInfVxuICAgICAgICAgICAgdmFsdWU9e2N1c3RvbUdhc0xpbWl0Py50b1N0cmluZygpfVxuICAgICAgICAgICAgb25DaGFuZ2U9e1xuICAgICAgICAgICAgICBpc0xpbWl0UmVhZG9ubHlcbiAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIDogKGV2dCkgPT4gc2V0Q3VzdG9tR2FzTGltaXQocGFyc2VJbnQoZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXJyb3I9eyEhZXJyb3JzLmdhc0xpbWl0fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJnYXMtbGltaXRcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAge2Vycm9ycy5nYXNMaW1pdCAmJiA8RXJyb3JNZXNzYWdlIG1lc3NhZ2U9e2Vycm9ycy5nYXNMaW1pdH0gLz59XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxEaXZpZGVyIHN4PXt7IG10OiAyLCBtYjogMSB9fSAvPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ3N0YXJ0JyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgcHQ6IDAuNzUsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+e3QoJ1RvdGFsIE5ldHdvcmsgRmVlJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgdGl0bGU9e1xuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICB7dChcbiAgICAgICAgICAgICAgICAgICAgICAnVG90YWwgTmV0d29yayBGZWUgPSAoQ3VycmVudCBCYXNlIEZlZSArIE1heCBQcmlvcml0eSBGZWUpICogR2FzIExpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAge3QoXG4gICAgICAgICAgICAgICAgICAgICAgJ0l0IHdpbGwgbmV2ZXIgYmUgaGlnaGVyIHRoYW4gTWF4IEJhc2UgRmVlICogR2FzIExpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8SW5mb0NpcmNsZUljb24gLz5cbiAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDxGZWVBbW91bnRcbiAgICAgICAgICAgIHZhbHVlPXtuZXdGZWVzLmJuRmVlfVxuICAgICAgICAgICAgZGVjaW1hbHM9e25ldHdvcms/Lm5ldHdvcmtUb2tlbi5kZWNpbWFsc31cbiAgICAgICAgICAgIGZpYXRWYWx1ZT17XG4gICAgICAgICAgICAgIG5ld0ZlZXMuZmVlVVNEID8gY3VycmVuY3lGb3JtYXR0ZXIobmV3RmVlcy5mZWVVU0QpIDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9rZW5TeW1ib2w9e25ldHdvcms/Lm5ldHdvcmtUb2tlbi5zeW1ib2x9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICAgICAgICAgIHBhZGRpbmdYOiAyLFxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IDMsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNhdmUtZ2FzLWxpbWl0LWJ1dHRvblwiXG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICB2YXJpYW50PVwiY29udGFpbmVkXCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVPblNhdmV9XG4gICAgICAgICAgZGlzYWJsZWQ9e09iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID4gMH1cbiAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdTYXZlJyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHtcbiAgVG9vbHRpcCxcbiAgVHlwb2dyYXBoeSxcbiAgU3RhY2ssXG4gIFN3aXRjaCxcbiAgSW5mb0NpcmNsZUljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbnRlcmZhY2UgR2FzbGVzc1Byb3BzIHtcbiAgb25Td2l0Y2g6ICgpID0+IHZvaWQ7XG4gIGlzVHVybmVkT246IGJvb2xlYW47XG4gIGRpc2FibGVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHYXNsZXNzRmVlKHtcbiAgb25Td2l0Y2gsXG4gIGlzVHVybmVkT24sXG4gIGRpc2FibGVkLFxufTogR2FzbGVzc1Byb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgbWI6IGlzVHVybmVkT24gPyAwIDogMixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHk+e3QoJ0dldCBGcmVlIEdhcycpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICBwbGFjZW1lbnQ9XCJib3R0b21cIlxuICAgICAgICAgIHRpdGxlPXt0KFxuICAgICAgICAgICAgJ1doZW4gZW5hYmxlZCBDb3JlIHdpbGwgcGF5IHRoZSBuZXR3b3JrIGZlZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB0cmFuc2FjdGlvbi4nLFxuICAgICAgICAgICl9XG4gICAgICAgID5cbiAgICAgICAgICA8SW5mb0NpcmNsZUljb24gc3g9e3sgbXg6IDAuNSwgY3Vyc29yOiAncG9pbnRlcicgfX0gLz5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTd2l0Y2hcbiAgICAgICAgb25DaGFuZ2U9e29uU3dpdGNofVxuICAgICAgICBjaGVja2VkPXtpc1R1cm5lZE9ufVxuICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAvPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBJbmZvQ2lyY2xlSWNvbixcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmludGVyZmFjZSBUZXh0RmllbGRMYWJlbFByb3BzIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdG9vbHRpcD86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IFRleHRGaWVsZExhYmVsID0gKHsgbGFiZWwsIHRvb2x0aXAgfTogVGV4dEZpZWxkTGFiZWxQcm9wcykgPT4gKFxuICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ3JvdycsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6IDEgfX0+XG4gICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgZm9udFdlaWdodDogJ3NlbWlib2xkJyB9fT5cbiAgICAgIHtsYWJlbH1cbiAgICA8L1R5cG9ncmFwaHk+XG4gICAge3Rvb2x0aXAgJiYgKFxuICAgICAgPFRvb2x0aXAgdGl0bGU9e3Rvb2x0aXB9PlxuICAgICAgICA8SW5mb0NpcmNsZUljb24gc2l6ZT17MTZ9IC8+XG4gICAgICA8L1Rvb2x0aXA+XG4gICAgKX1cbiAgPC9TdGFjaz5cbik7XG4iLCJpbXBvcnQgeyBTdGFjaywgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBUcnVuY2F0ZUZlZUFtb3VudCh7IGFtb3VudCB9OiB7IGFtb3VudDogc3RyaW5nIH0pIHtcbiAgY29uc3QgW2ludGVnZXIsIGZyYWN0aW9uXSA9IGFtb3VudC5zcGxpdCgnLicpO1xuICBpZiAoIWZyYWN0aW9uIHx8IChmcmFjdGlvbiAmJiBmcmFjdGlvbi5sZW5ndGggPD0gNSkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgY29tcG9uZW50PVwic3BhblwiXG4gICAgICAgIGNvbG9yPVwidGV4dC5wcmltYXJ5XCJcbiAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX1cbiAgICAgID5cbiAgICAgICAge2Ftb3VudH1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgaW5kZXhPZk5vblplcm8gPSBmcmFjdGlvbj8uc2VhcmNoKC9bMS05XS8pO1xuICBpZiAoaW5kZXhPZk5vblplcm8gPT0gLTEpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgY29tcG9uZW50PVwic3BhblwiXG4gICAgICAgIGNvbG9yPVwidGV4dC5wcmltYXJ5XCJcbiAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX1cbiAgICAgID5cbiAgICAgICAge2ludGVnZXJ9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgKTtcbiAgfVxuICBjb25zdCB6ZXJvQ291bnQgPSBmcmFjdGlvbi5zbGljZSgwLCBpbmRleE9mTm9uWmVybykubGVuZ3RoO1xuICBpZiAoZnJhY3Rpb24gJiYgaW5kZXhPZk5vblplcm8pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBjb2x1bW5HYXA6IDAgfX0+XG4gICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICBjb21wb25lbnQ9XCJzcGFuXCJcbiAgICAgICAgICBjb2xvcj1cInRleHQucHJpbWFyeVwiXG4gICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpbnRlZ2VyfS4wXG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwib3ZlcmxpbmVcIlxuICAgICAgICAgIGNvbXBvbmVudD1cInNwYW5cIlxuICAgICAgICAgIGNvbG9yPVwidGV4dC5wcmltYXJ5XCJcbiAgICAgICAgICBzeD17eyBtdDogMSwgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt6ZXJvQ291bnR9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgIGNvbXBvbmVudD1cInNwYW5cIlxuICAgICAgICAgIGNvbG9yPVwidGV4dC5wcmltYXJ5XCJcbiAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgICA+XG4gICAgICAgICAge2ZyYWN0aW9uLnNsaWNlKGluZGV4T2ZOb25aZXJvLCBpbmRleE9mTm9uWmVybyArIDIpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8VHlwb2dyYXBoeVxuICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgIGNvbXBvbmVudD1cInNwYW5cIlxuICAgICAgY29sb3I9XCJ0ZXh0LnByaW1hcnlcIlxuICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRTZW1pYm9sZCcgfX1cbiAgICA+XG4gICAgICB7YW1vdW50fVxuICAgIDwvVHlwb2dyYXBoeT5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUJhbGFuY2VzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQmFsYW5jZXNQcm92aWRlcic7XG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgdXNlTGl2ZUJhbGFuY2UgPSAodG9rZW5UeXBlczogVG9rZW5UeXBlW10pID0+IHtcbiAgY29uc3QgeyByZWdpc3RlclN1YnNjcmliZXIsIHVucmVnaXN0ZXJTdWJzY3JpYmVyIH0gPSB1c2VCYWxhbmNlc0NvbnRleHQoKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJlZ2lzdGVyU3Vic2NyaWJlcih0b2tlblR5cGVzKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB1bnJlZ2lzdGVyU3Vic2NyaWJlcih0b2tlblR5cGVzKTtcbiAgICB9O1xuICB9LCBbcmVnaXN0ZXJTdWJzY3JpYmVyLCB1bnJlZ2lzdGVyU3Vic2NyaWJlciwgdG9rZW5UeXBlc10pO1xufTtcbiIsImltcG9ydCB7IE5ldHdvcmsgfSBmcm9tICdAYXZhbGFicy9jb3JlLWNoYWlucy1zZGsnO1xuaW1wb3J0IHsgRXh0ZW5zaW9uUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9leHRlbnNpb25Db25uZWN0aW9uL21vZGVscyc7XG5pbXBvcnQgeyBHZXRUb2tlblByaWNlSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9iYWxhbmNlcy9oYW5kbGVycy9nZXRUb2tlblByaWNlJztcbmltcG9ydCB7IHVzZUNvbm5lY3Rpb25Db250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db25uZWN0aW9uUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZU5hdGl2ZVRva2VuUHJpY2UobmV0d29yaz86IE5ldHdvcmspIHtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBjb25zdCBbcHJpY2UsIHNldFByaWNlXSA9IHVzZVN0YXRlPG51bWJlcj4oMCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB0b2tlbklkID0gbmV0d29yaz8ucHJpY2luZ1Byb3ZpZGVycz8uY29pbmdlY2tvLm5hdGl2ZVRva2VuSWQ7XG5cbiAgICBpZiAodG9rZW5JZCkge1xuICAgICAgcmVxdWVzdDxHZXRUb2tlblByaWNlSGFuZGxlcj4oe1xuICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuVE9LRU5fUFJJQ0VfR0VULFxuICAgICAgICBwYXJhbXM6IFt0b2tlbklkXSxcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKChwKSA9PiBzZXRQcmljZShwIHx8IDApKVxuICAgICAgICAuY2F0Y2goKCkgPT4gc2V0UHJpY2UoMCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRQcmljZSgwKTtcbiAgICB9XG4gIH0sIFtuZXR3b3JrLCByZXF1ZXN0XSk7XG5cbiAgcmV0dXJuIHByaWNlO1xufVxuIl0sIm5hbWVzIjpbImNhbGN1bGF0ZUdhc0FuZEZlZXMiLCJ1c2VDYWxsYmFjayIsInVzZUVmZmVjdCIsInVzZU1lbW8iLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsInVzZVNldHRpbmdzQ29udGV4dCIsInVzZU5hdGl2ZVRva2VuUHJpY2UiLCJOZXR3b3JrVk1UeXBlIiwidXNlVHJhbnNsYXRpb24iLCJUb2tlblR5cGUiLCJUb2tlblVuaXQiLCJCdXR0b24iLCJDaGV2cm9uRG93bkljb24iLCJDb2xsYXBzZSIsIkRpYWxvZyIsIkljb25CdXR0b24iLCJTdGFjayIsIlRvb2x0aXAiLCJUeXBvZ3JhcGh5IiwiQXBwcm92YWxTZWN0aW9uIiwiQXBwcm92YWxTZWN0aW9uQm9keSIsIkFwcHJvdmFsU2VjdGlvbkhlYWRlciIsInVzZUxpdmVCYWxhbmNlIiwiQ3VzdG9tR2FzU2V0dGluZ3MiLCJ1c2VOZXR3b3JrRmVlQ29udGV4dCIsIkdhc2xlc3NGZWUiLCJHYXNsZXNzUGhhc2UiLCJGZWF0dXJlR2F0ZXMiLCJ1c2VGZWF0dXJlRmxhZ0NvbnRleHQiLCJUcnVuY2F0ZUZlZUFtb3VudCIsIkdhc0ZlZU1vZGlmaWVyIiwiRmVlQnV0dG9uIiwic3giLCJwcm9wcyIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIl9leHRlbmRzIiwid2lkdGgiLCJtYXhIZWlnaHQiLCJoZWlnaHQiLCJweSIsInB4IiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJnYXAiLCJqdXN0aWZ5Q29udGVudCIsImJvcmRlclJhZGl1cyIsImJhY2tncm91bmRDb2xvciIsIkN1c3RvbUdhc0xpbWl0RGlhbG9nIiwiZnVsbFNjcmVlbiIsIlBhcGVyUHJvcHMiLCJ0aGVtZSIsIm1heFdpZHRoIiwicGFsZXR0ZSIsImJhY2tncm91bmQiLCJkZWZhdWx0IiwiYWxpZ25JdGVtcyIsImdldEdhc0ZlZVRvRGlzcGxheSIsImZlZSIsIm5ldHdvcmtGZWUiLCJ1bmRlZmluZWQiLCJoaWdoIiwibG93IiwibWVkaXVtIiwicGFyc2VGbG9hdCIsIk1hdGgiLCJyb3VuZCIsIlBPTExFRF9CQUxBTkNFUyIsIk5BVElWRSIsIkN1c3RvbUZlZXMiLCJtYXhGZWVQZXJHYXMiLCJsaW1pdCIsImVzdGltYXRlZEZlZSIsIm9uQ2hhbmdlIiwib25Nb2RpZmllckNoYW5nZUNhbGxiYWNrIiwiZ2FzUHJpY2VFZGl0RGlzYWJsZWQiLCJtYXhHYXNQcmljZSIsInNlbGVjdGVkR2FzRmVlTW9kaWZpZXIiLCJuZXR3b3JrIiwiaXNMaW1pdFJlYWRvbmx5IiwiaXNDb2xsYXBzaWJsZSIsInNpemUiLCJoYXNFbm91Z2hGb3JGZWUiLCJpc0JhdGNoQXBwcm92YWxTY3JlZW4iLCJ0IiwidG9rZW5QcmljZSIsImN1cnJlbmN5Rm9ybWF0dGVyIiwiY3VzdG9tR2FzTGltaXQiLCJzZXRDdXN0b21HYXNMaW1pdCIsImdhc0xpbWl0IiwiY3VzdG9tRmVlIiwic2V0Q3VzdG9tRmVlIiwibmV3RmVlcyIsInNldE5ld0ZlZXMiLCJ0b2tlbkRlY2ltYWxzIiwibmV0d29ya1Rva2VuIiwiZGVjaW1hbHMiLCJpc0NvbGxhcHNlZCIsInNldElzQ29sbGFwc2VkIiwiZmVhdHVyZUZsYWdzIiwiY3VzdG9tSW5wdXRSZWYiLCJzaG93RWRpdEdhc0xpbWl0Iiwic2V0U2hvd0VkaXRHYXNMaW1pdCIsInNlbGVjdGVkRmVlIiwic2V0U2VsZWN0ZWRGZWUiLCJpc0ZpeGVkRmVlIiwiU0xPVyIsImlzR2FzbGVzc09uIiwic2V0SXNHYXNsZXNzT24iLCJnYXNsZXNzUGhhc2UiLCJpc0dhc2xlc3NFbGlnaWJsZSIsImhhbmRsZUdhc0NoYW5nZSIsInJhdGUiLCJtb2RpZmllciIsIkNVU1RPTSIsImlzVG9vSGlnaCIsInVwZGF0ZWRGZWVzIiwibWF4UHJpb3JpdHlGZWVQZXJHYXMiLCJmZWVUeXBlIiwidXBkYXRlR2FzRmVlIiwiTk9STUFMIiwiRkFTVCIsImhhbmRsZU1vZGlmaWVyQ2xpY2siLCJmZWVBbW91bnQiLCJyb3VuZGVkIiwicHJlY2lzZSIsInVuaXQiLCJzeW1ib2wiLCJ0b0Rpc3BsYXkiLCJ0b1N0cmluZyIsImZlZVVuaXQiLCJvbkdhc2xlc3NTd2l0Y2giLCJpc01heEZlZVVzZWQiLCJ2bU5hbWUiLCJFVk0iLCJsYWJlbCIsInRvb2x0aXAiLCJvbkNsaWNrIiwid2FzQ29sbGFwc2VkIiwidHJhbnNmb3JtIiwiaW4iLCJtb3VudE9uRW50ZXIiLCJ1bm1vdW50T25FeGl0IiwiRVJST1IiLCJHQVNMRVNTIiwib25Td2l0Y2giLCJpc1R1cm5lZE9uIiwiZGlzYWJsZWQiLCJGVU5ESU5HX0lOX1BST0dSRVNTIiwiY29sb3IiLCJ2YXJpYW50IiwiZm9udFdlaWdodCIsIkZyYWdtZW50IiwiY3VycmVudCIsImZvY3VzIiwiZGlzYWJsZVJpcHBsZSIsImNvbXBvbmVudCIsImRpcmVjdGlvbiIsInRpdGxlIiwiYW1vdW50IiwiaXNOYU4iLCJOdW1iZXIiLCJmZWVVU0QiLCJvcGVuIiwiQm9vbGVhbiIsImZlZURpc3BsYXlEZWNpbWFscyIsImRpc3BsYXlEZWNpbWFscyIsIm9uQ2FuY2VsIiwib25TYXZlIiwiZGF0YSIsImZvcm1hdFVuaXRzIiwicGFyc2VVbml0cyIsIlBhZ2VUaXRsZSIsIkJveCIsIkRpdmlkZXIiLCJJbmZvQ2lyY2xlSWNvbiIsIlRleHRGaWVsZCIsIlRleHRGaWVsZExhYmVsIiwiRXJyb3JNZXNzYWdlIiwibWVzc2FnZSIsIkZpYXRWYWx1ZSIsInZhbHVlIiwicHQiLCJtaW5IZWlnaHQiLCJ0ZXh0QWxpZ24iLCJGZWVBbW91bnQiLCJmaWF0VmFsdWUiLCJ0b2tlblN5bWJvbCIsImN1c3RvbU1heEZlZVBlckdhcyIsInNldEN1c3RvbU1heEZlZVBlckdhcyIsImN1c3RvbU1heFByaW9yaXR5RmVlUGVyR2FzIiwic2V0Q3VzdG9tTWF4UHJpb3JpdHlGZWVQZXJHYXMiLCJlcnJvcnMiLCJzZXRFcnJvcnMiLCJoYW5kbGVPblNhdmUiLCJoYXNFcnJvcnMiLCJleGlzdGluZ0Vycm9ycyIsIm1heFByaW9yaXR5RmVlIiwiY2FsY3VsYXRlZEdhc0FuZEZlZXMiLCJlcnJvciIsIkVycm9yIiwiaW5jbHVkZXMiLCJtYXhGZWUiLCJtYXJnaW4iLCJvbkJhY2tDbGljayIsInBhZGRpbmciLCJmdWxsV2lkdGgiLCJ0eXBlIiwiZXZ0IiwiY3VycmVudFRhcmdldCIsImF1dG9Gb2N1cyIsInRpcFVTRCIsIklucHV0UHJvcHMiLCJyZWFkT25seSIsInBhcnNlSW50IiwibXQiLCJtYiIsImJuRmVlIiwiZmxleCIsInBhZGRpbmdYIiwicGFkZGluZ0JvdHRvbSIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJTd2l0Y2giLCJwbGFjZW1lbnQiLCJteCIsImN1cnNvciIsImNoZWNrZWQiLCJpbnRlZ2VyIiwiZnJhY3Rpb24iLCJzcGxpdCIsImluZGV4T2ZOb25aZXJvIiwic2VhcmNoIiwiemVyb0NvdW50Iiwic2xpY2UiLCJjb2x1bW5HYXAiLCJ1c2VCYWxhbmNlc0NvbnRleHQiLCJ0b2tlblR5cGVzIiwicmVnaXN0ZXJTdWJzY3JpYmVyIiwidW5yZWdpc3RlclN1YnNjcmliZXIiLCJFeHRlbnNpb25SZXF1ZXN0IiwidXNlQ29ubmVjdGlvbkNvbnRleHQiLCJyZXF1ZXN0IiwicHJpY2UiLCJzZXRQcmljZSIsInRva2VuSWQiLCJwcmljaW5nUHJvdmlkZXJzIiwiY29pbmdlY2tvIiwibmF0aXZlVG9rZW5JZCIsIm1ldGhvZCIsIlRPS0VOX1BSSUNFX0dFVCIsInBhcmFtcyIsInRoZW4iLCJwIiwiY2F0Y2giXSwic291cmNlUm9vdCI6IiJ9