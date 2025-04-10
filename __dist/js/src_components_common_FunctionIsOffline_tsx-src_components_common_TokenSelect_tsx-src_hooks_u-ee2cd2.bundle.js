"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_FunctionIsOffline_tsx-src_components_common_TokenSelect_tsx-src_hooks_u-ee2cd2"],{

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

/***/ "./src/components/common/BalanceColumn.tsx":
/*!*************************************************!*\
  !*** ./src/components/common/BalanceColumn.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BalanceColumn": () => (/* binding */ BalanceColumn)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");

const BalanceColumn = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack)`
  align-items: end;
  padding-left: 8px;
  line-height: 14px;
`;

/***/ }),

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

/***/ "./src/components/common/TokenEllipsis.tsx":
/*!*************************************************!*\
  !*** ./src/components/common/TokenEllipsis.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenEllipsis": () => (/* binding */ TokenEllipsis)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/trunateAddress.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function isTruncated(maxLength, text) {
  return text.length > maxLength;
}
function TokenEllipsis({
  maxLength,
  text,
  className,
  sx
}) {
  const name = text.length <= maxLength ? text : (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_0__.truncateAddress)(text, maxLength / 2);
  return /*#__PURE__*/React.createElement("span", {
    className: className
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
    placement: "bottom",
    title: text,
    disableHoverListener: !isTruncated(maxLength, text),
    disableFocusListener: !isTruncated(maxLength, text),
    sx: sx ?? {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(React.Fragment, null, name)));
}

/***/ }),

/***/ "./src/components/common/TokenSelect.tsx":
/*!***********************************************!*\
  !*** ./src/components/common/TokenSelect.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenSelect": () => (/* binding */ TokenSelect)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_components_common_ContainedDropdown__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/ContainedDropdown */ "./src/components/common/ContainedDropdown.tsx");
/* harmony import */ var _src_images_tokens_eth_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/images/tokens/eth.png */ "./src/images/tokens/eth.png");
/* harmony import */ var _src_background_services_balances_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/balances/models */ "./src/background/services/balances/models.ts");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/tokenUnit.js");
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bigToLocaleString.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_BalanceColumn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/BalanceColumn */ "./src/components/common/BalanceColumn.tsx");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-virtualized */ "./node_modules/react-virtualized/dist/es/index.js");
/* harmony import */ var _VirtualizedList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./VirtualizedList */ "./src/components/common/VirtualizedList.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_BNInput__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/components/common/BNInput */ "./src/components/common/BNInput.tsx");
/* harmony import */ var _TokenSelector__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./TokenSelector */ "./src/components/common/TokenSelector.tsx");
/* harmony import */ var _TokenEllipsis__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./TokenEllipsis */ "./src/components/common/TokenEllipsis.tsx");
/* harmony import */ var _Dropdown__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Dropdown */ "./src/components/common/Dropdown.tsx");
/* harmony import */ var _src_hooks_useDisplayTokenList__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/hooks/useDisplayTokenList */ "./src/hooks/useDisplayTokenList.ts");
/* harmony import */ var _TokenIcon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/utils/bigintToBig */ "./src/utils/bigintToBig.ts");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



















const InputContainer = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Card)`
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: ${({
  theme
}) => theme.palette.grey[850]};
  display: flex;
`;
const SelectContainer = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack)`
  position: relative;
`;
const DropdownContents = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack)`
  flex-grow: 1;
  background: ${({
  theme
}) => theme.palette.grey[850]};
  border-radius: 0 0 8px 8px;
  z-index: 2;
`;
const SearchInputContainer = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack)`
  padding-left: 16px;
  padding-right: 16px;
`;
const StyledDropdownMenuItem = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__["default"])(_Dropdown__WEBPACK_IMPORTED_MODULE_11__.DropdownItem)`
  padding: 8px 16px;
`;
function TokenSelect({
  selectedToken,
  onTokenChange,
  tokensList,
  maxAmount,
  inputAmount,
  onInputAmountChange,
  onSelectToggle,
  isOpen,
  error,
  padding,
  label,
  selectorLabel,
  isValueLoading,
  hideErrorMessage,
  skipHandleMaxAmount,
  setIsOpen,
  containerRef,
  withMaxButton = true,
  withOnlyTokenPreselect = true
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_18__.useTranslation)();
  const {
    currencyFormatter,
    currency
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__.useSettingsContext)();
  const selectButtonRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [amountInCurrency, setAmountInCurrency] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const decimals = selectedToken && 'decimals' in selectedToken ? selectedToken.decimals : 18;

  // Stringify maxAmount for referential equality in useEffect
  const maxAmountString = maxAmount ? new _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_19__.TokenUnit(maxAmount, decimals, '').toDisplay() : null;
  const [isMaxAmount, setIsMaxAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const handleAmountChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({
    amount,
    bigint
  }) => {
    onInputAmountChange?.({
      amount,
      bigint
    });
    if (!maxAmountString) {
      return;
    }
    setIsMaxAmount(maxAmountString === amount);
  }, [onInputAmountChange, maxAmountString]);
  const hideTokenDropdown = tokensList && tokensList.length < 2;
  const displayTokenList = (0,_src_hooks_useDisplayTokenList__WEBPACK_IMPORTED_MODULE_12__.useDisplaytokenlist)({
    tokensList,
    searchQuery
  });
  const formattedAmount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const price = selectedToken?.priceInCurrency;
    const amount = inputAmount && inputAmount !== 0n && price ? currencyFormatter(parseFloat((0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_20__.bigToLocaleString)((0,_src_utils_bigintToBig__WEBPACK_IMPORTED_MODULE_14__.bigintToBig)(inputAmount, decimals)).replace(/,/g, '')) * price) : undefined;
    return amount;
  }, [currencyFormatter, decimals, inputAmount, selectedToken]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setAmountInCurrency(formattedAmount);
  }, [formattedAmount]);

  // When setting to the max, pin the input value to the max value
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isMaxAmount || !maxAmountString || skipHandleMaxAmount) return;
    handleAmountChange({
      amount: maxAmountString,
      bigint: (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_15__.stringToBigint)(maxAmountString, decimals)
    });
  }, [maxAmountString, handleAmountChange, isMaxAmount, skipHandleMaxAmount, decimals]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // when only one token is present, auto select it
    const hasOnlyOneToken = tokensList?.length === 1;
    const theOnlyToken = hasOnlyOneToken ? tokensList[0] : undefined;
    const isOnlyTokenNotSelected = theOnlyToken && theOnlyToken?.symbol !== selectedToken?.symbol;
    if (withOnlyTokenPreselect && isOnlyTokenNotSelected) {
      onTokenChange(theOnlyToken);
      return;
    }
    // when selected token is not supported, clear it
    const supportedSymbols = tokensList?.flatMap(tok => tok.symbol) ?? [];
    if (selectedToken && tokensList?.[0] && !supportedSymbols.includes(selectedToken.symbol)) {
      onTokenChange(tokensList[0]);
    }
  }, [withOnlyTokenPreselect, tokensList, onTokenChange, selectedToken]);
  const rowRenderer = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({
    key,
    index,
    style
  }) => {
    const token = displayTokenList[index];
    if (!token) {
      // Token should be truthy and should not get here. Just adding this to not break the list if this happens. This will make the row just empty.
      return /*#__PURE__*/React.createElement("div", {
        style: style,
        key: key
      });
    }
    return /*#__PURE__*/React.createElement(StyledDropdownMenuItem, {
      style: style,
      "data-testid": `token-search-menu-item-${index}`,
      key: key,
      onClick: () => {
        onTokenChange(token.token);
        onSelectToggle?.();
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
      sx: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexGrow: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
      sx: {
        flexDirection: 'row',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_TokenIcon__WEBPACK_IMPORTED_MODULE_13__.TokenIcon, {
      width: "32px",
      height: "32px",
      src: token.symbol === 'ETH' ? _src_images_tokens_eth_png__WEBPACK_IMPORTED_MODULE_3__["default"] : token.token.logoUri,
      name: token.symbol
    }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Typography, {
      variant: "h6",
      sx: {
        ml: 2
      }
    }, /*#__PURE__*/React.createElement(_TokenEllipsis__WEBPACK_IMPORTED_MODULE_10__.TokenEllipsis, {
      text: token.name,
      maxLength: 14
    }))), /*#__PURE__*/React.createElement(_src_components_common_BalanceColumn__WEBPACK_IMPORTED_MODULE_5__.BalanceColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Typography, {
      variant: "body1"
    }, token.displayValue, ' ', /*#__PURE__*/React.createElement(_TokenEllipsis__WEBPACK_IMPORTED_MODULE_10__.TokenEllipsis, {
      text: token.symbol,
      maxLength: 8
    })))));
  }, [displayTokenList, onSelectToggle, onTokenChange]);
  const renderTokenLabel = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!selectedToken || !(0,_src_background_services_balances_models__WEBPACK_IMPORTED_MODULE_4__.hasUnconfirmedBTCBalance)(selectedToken) && !(0,_src_background_services_balances_models__WEBPACK_IMPORTED_MODULE_4__.isAvaxWithUnavailableBalance)(selectedToken)) {
      return `${t('Balance')}: ${selectedToken?.balanceDisplayValue ?? '0'}`;
    }
    if ((0,_src_background_services_balances_models__WEBPACK_IMPORTED_MODULE_4__.hasUnconfirmedBTCBalance)(selectedToken)) {
      return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
        sx: {
          flexDirection: 'row',
          alignItems: 'center'
        }
      }, !!selectedToken?.unconfirmedBalance && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Tooltip, {
        placement: "top",
        title: `${t('Unavailable')}: ${selectedToken?.unconfirmedBalanceDisplayValue} ${selectedToken?.symbol}`
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.InfoCircleIcon, {
        sx: {
          mr: 0.5,
          cursor: 'pointer'
        }
      })), t('Available Balance'), ": ", selectedToken?.balanceDisplayValue ?? '0');
    }
    if ((0,_src_background_services_balances_models__WEBPACK_IMPORTED_MODULE_4__.isAvaxWithUnavailableBalance)(selectedToken)) {
      return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
        sx: {
          flexDirection: 'row',
          alignItems: 'center'
        }
      }, !!selectedToken?.balance && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Tooltip, {
        placement: "top",
        title: `${t('Total Balance')}: ${selectedToken?.balanceDisplayValue} ${selectedToken?.symbol}`
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.InfoCircleIcon, {
        sx: {
          mr: 0.5,
          cursor: 'pointer'
        }
      })), t('Spendable Balance'), ":", ' ', selectedToken?.availableDisplayValue ?? '0');
    }
  }, [selectedToken, t]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      flexDirection: 'row',
      padding,
      m: () => !padding ? '0 0 8px' : '0'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Typography, {
    variant: "body2",
    fontWeight: "fontWeightSemibold"
  }, label ?? t('Token')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, renderTokenLabel())), /*#__PURE__*/React.createElement(SelectContainer, null, /*#__PURE__*/React.createElement(InputContainer, {
    "data-testid": "token-selector-dropdown",
    ref: selectButtonRef,
    sx: {
      flexDirection: 'row',
      padding,
      borderRadius: isOpen ? '8px 8px 0 0' : '8px'
    }
  }, /*#__PURE__*/React.createElement(_TokenSelector__WEBPACK_IMPORTED_MODULE_9__.TokenSelector, {
    onClick: onSelectToggle,
    isOpen: isOpen,
    token: selectedToken ? {
      name: selectedToken?.symbol,
      icon: /*#__PURE__*/React.createElement(_TokenIcon__WEBPACK_IMPORTED_MODULE_13__.TokenIcon, {
        width: "32px",
        height: "32px",
        src: selectedToken?.logoUri,
        name: selectedToken?.name
      })
    } : null,
    hideCaretIcon: hideTokenDropdown,
    label: selectorLabel ?? t('Select Token')
  }), /*#__PURE__*/React.createElement(_src_components_common_BNInput__WEBPACK_IMPORTED_MODULE_8__.BNInput, {
    value: isMaxAmount && !skipHandleMaxAmount ? maxAmount || inputAmount : inputAmount,
    denomination: decimals,
    onChange: handleAmountChange,
    isValueLoading: isValueLoading,
    "data-testid": "token-amount-input",
    max: !isValueLoading ? maxAmount || selectedToken?.balance : undefined,
    withMaxButton: withMaxButton
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding,
      m: () => !padding ? '4px 0 0 0' : '0'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Typography, {
    variant: "caption",
    sx: {
      color: theme => theme.palette.error.main
    }
  }, hideErrorMessage ? '' : error), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      minHeight: '14px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.secondary'
    }
  }, amountInCurrency ? `${amountInCurrency.replace(currency, '')} ${currency}` : `${currencyFormatter(0).replace(currency, '')} ${currency}`))), !hideTokenDropdown && /*#__PURE__*/React.createElement(_src_components_common_ContainedDropdown__WEBPACK_IMPORTED_MODULE_2__.ContainedDropdown, {
    anchorEl: selectButtonRef,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    containerRef: containerRef
  }, /*#__PURE__*/React.createElement(DropdownContents, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Divider, {
    sx: {
      mx: 2,
      mt: 1
    }
  }), /*#__PURE__*/React.createElement(SearchInputContainer, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.SearchBar, {
    onChange: e => setSearchQuery(e.currentTarget.value),
    placeholder: t('Search'),
    sx: {
      my: 2
    },
    "data-testid": "search-input"
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      flexDirection: 'column',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_6__.AutoSizer, null, ({
    height,
    width
  }) => /*#__PURE__*/React.createElement(_VirtualizedList__WEBPACK_IMPORTED_MODULE_7__["default"], {
    height: height,
    rowCount: displayTokenList.length,
    rowHeight: 48,
    rowRenderer: rowRenderer,
    width: width
  })))))));
}

/***/ }),

/***/ "./src/components/common/TokenSelector.tsx":
/*!*************************************************!*\
  !*** ./src/components/common/TokenSelector.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenSelector": () => (/* binding */ TokenSelector)
/* harmony export */ });
/* harmony import */ var _TokenEllipsis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TokenEllipsis */ "./src/components/common/TokenEllipsis.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function TokenSelector({
  token,
  onClick,
  isOpen,
  hideCaretIcon,
  label
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    onClick: hideCaretIcon ? undefined : onClick,
    sx: {
      alignItems: 'center',
      width: '100%',
      flexDirection: 'row',
      cursor: hideCaretIcon ? 'default' : 'pointer',
      pr: 2
    }
  }, !token && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      mr: 1
    },
    fontWeight: 600
  }, label || t('Select')), isOpen ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.ChevronUpIcon, null) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.ChevronDownIcon, null)), token && /*#__PURE__*/React.createElement(React.Fragment, null, token.icon, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      mx: 1
    },
    fontWeight: 600
  }, /*#__PURE__*/React.createElement(_TokenEllipsis__WEBPACK_IMPORTED_MODULE_0__.TokenEllipsis, {
    maxLength: 7,
    text: token.name || '',
    sx: {
      cursor: hideCaretIcon ? 'default' : 'pointer'
    }
  })), !hideCaretIcon ? isOpen ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.ChevronUpIcon, null) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.ChevronDownIcon, null) : null));
}

/***/ }),

/***/ "./src/components/common/VirtualizedList.tsx":
/*!***************************************************!*\
  !*** ./src/components/common/VirtualizedList.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-virtualized */ "./node_modules/react-virtualized/dist/es/index.js");


const VirtualizedList = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])(react_virtualized__WEBPACK_IMPORTED_MODULE_0__.List)`
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({
  theme
}) => theme.palette.divider};
    border-radius: 3px;
  }
`;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VirtualizedList);

/***/ }),

/***/ "./src/hooks/useDisplayTokenList.ts":
/*!******************************************!*\
  !*** ./src/hooks/useDisplayTokenList.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useDisplaytokenlist": () => (/* binding */ useDisplaytokenlist)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_utils_normalizeBalance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/normalizeBalance */ "./src/utils/normalizeBalance.ts");
/* harmony import */ var _src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/balances/nft/utils/isNFT */ "./src/background/services/balances/nft/utils/isNFT.ts");





const useDisplaytokenlist = ({
  tokensList,
  searchQuery
}) => {
  const displayTokenList = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const initialList = (tokensList ?? []).filter(token => searchQuery.length ? token.name.toLowerCase().includes(searchQuery.toLowerCase()) || token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) : true).map(token => {
      return {
        name: token.name,
        symbol: token.symbol,
        displayValue: token.balanceDisplayValue ?? '',
        token,
        decimals: (0,_src_background_services_balances_nft_utils_isNFT__WEBPACK_IMPORTED_MODULE_4__.isNFT)(token) ? 0 : token.decimals
      };
    });
    const [tokensWithBalance, tokensWithoutBalance] = (0,lodash__WEBPACK_IMPORTED_MODULE_2__.partition)(initialList, token => {
      const balance = (0,_src_utils_normalizeBalance__WEBPACK_IMPORTED_MODULE_3__.normalizeBalance)(token.token.balance, token.decimals);
      return balance ? balance.gt(new (big_js__WEBPACK_IMPORTED_MODULE_1___default())(0)) : false;
    });

    // Sorting specification per: https://ava-labs.atlassian.net/browse/CP-7768
    // First part of the list should be tokens with a balance sorted by balance (descending)
    // Second part of the list should be all no balance assets in order alphabetically
    return [...tokensWithBalance.sort((tokenOne, tokenTwo) => {
      const firstBalance = (0,_src_utils_normalizeBalance__WEBPACK_IMPORTED_MODULE_3__.normalizeBalance)(tokenOne.token.balance, tokenOne.decimals) ?? new (big_js__WEBPACK_IMPORTED_MODULE_1___default())(0);
      const secondBalance = (0,_src_utils_normalizeBalance__WEBPACK_IMPORTED_MODULE_3__.normalizeBalance)(tokenTwo.token.balance, tokenTwo.decimals) ?? new (big_js__WEBPACK_IMPORTED_MODULE_1___default())(0);
      const comparison = firstBalance.cmp(secondBalance);
      if (comparison) {
        return comparison * -1;
      }
      return tokenOne.name.localeCompare(tokenTwo.name);
    }), ...tokensWithoutBalance.sort((tokenOne, tokenTwo) => {
      return tokenOne.name.localeCompare(tokenTwo.name);
    })];
  }, [tokensList, searchQuery]);
  return displayTokenList;
};

/***/ }),

/***/ "./src/hooks/useSendAnalyticsData.ts":
/*!*******************************************!*\
  !*** ./src/hooks/useSendAnalyticsData.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useSendAnalyticsData": () => (/* binding */ useSendAnalyticsData)
/* harmony export */ });
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function useSendAnalyticsData() {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_0__.useAnalyticsContext)();
  const sendTokenSelectedAnalytics = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(functionality => {
    capture(`${functionality}_TokenSelected`);
  }, [capture]);
  const sendAmountEnteredAnalytics = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(functionality => {
    capture(`${functionality}_AmountEntered`);
  }, [capture]);
  return {
    sendTokenSelectedAnalytics,
    sendAmountEnteredAnalytics
  };
}

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

/***/ "./src/utils/normalizeBalance.ts":
/*!***************************************!*\
  !*** ./src/utils/normalizeBalance.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalizeBalance": () => (/* binding */ normalizeBalance)
/* harmony export */ });
/* harmony import */ var _avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-utils-sdk */ "./node_modules/@avalabs/core-utils-sdk/esm/bnToBig.js");
/* harmony import */ var bn_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bn.js */ "./node_modules/bn.js/lib/bn.js");
/* harmony import */ var bn_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bn_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bigintToBig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bigintToBig */ "./src/utils/bigintToBig.ts");



function normalizeBalance(balance, decimals) {
  if ((0,bn_js__WEBPACK_IMPORTED_MODULE_0__.isBN)(balance)) {
    return (0,_avalabs_core_utils_sdk__WEBPACK_IMPORTED_MODULE_2__.bnToBig)(balance, decimals);
  }
  if (typeof balance === 'bigint') {
    return (0,_bigintToBig__WEBPACK_IMPORTED_MODULE_1__.bigintToBig)(balance, decimals);
  }
  return balance;
}

/***/ }),

/***/ "./src/images/tokens/eth.png":
/*!***********************************!*\
  !*** ./src/images/tokens/eth.png ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/ded72d1ea95e9c1cff1193ff74d59bf3.png");

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX0Z1bmN0aW9uSXNPZmZsaW5lX3RzeC1zcmNfY29tcG9uZW50c19jb21tb25fVG9rZW5TZWxlY3RfdHN4LXNyY19ob29rc191LWVlMmNkMi5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBSWtDO0FBRTNCLFNBQVNDLGNBQWNBLENBQUNDLElBQWUsRUFBRTtFQUM5QyxPQUFPQSxJQUFJLEtBQUtGLHNFQUFnQixJQUFJRSxJQUFJLEtBQUtGLHVFQUFpQjtBQUNoRTtBQUVPLFNBQVNLLEtBQUtBLENBQUNDLEtBQXVCLEVBQWdDO0VBQzNFLE9BQU9MLGNBQWMsQ0FBQ0ssS0FBSyxDQUFDSixJQUFJLENBQUM7QUFDbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1orRDtBQVExQjtBQUNvQjtBQUNFO0FBZ0IzRCxNQUFNZ0IsV0FBVyxHQUFHSix1RUFBTSxDQUFDSCxrRUFBUyxDQUFFO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFFRCxTQUFTUSxVQUFVQSxDQUFDQyxHQUFXLEVBQUU7RUFDL0IsT0FBT0EsR0FBRyxDQUFDQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUdELEdBQUcsQ0FBQ0UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUNGLEdBQUcsRUFBRSxJQUFJLENBQUM7QUFDekQ7QUFFTyxTQUFTRyxPQUFPQSxDQUFDO0VBQ3RCQyxLQUFLO0VBQ0xDLFlBQVk7RUFDWkMsUUFBUTtFQUNSQyxHQUFHLEdBQUcsRUFBRTtFQUNSQyxHQUFHO0VBQ0hDLGNBQWM7RUFDZEMsS0FBSztFQUNMQyxRQUFRO0VBQ1JDLFNBQVM7RUFDVEMsYUFBYSxHQUFHLElBQUk7RUFDcEIsR0FBR0M7QUFDUyxDQUFDLEVBQUU7RUFDZixNQUFNLENBQUNDLE1BQU0sRUFBRUMsU0FBUyxDQUFDLEdBQUczQiwrQ0FBUSxDQUFDLEVBQUUsQ0FBQztFQUN4Q0QsZ0RBQVMsQ0FBQyxNQUFNO0lBQ2Qs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akMsUUFBUSxDQUFDO0VBQ25DO0VBRUEsSUFBSSxPQUFPaUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtJQUMvQixPQUFPM0QseURBQVcsQ0FBQzJELE9BQU8sRUFBRWpDLFFBQVEsQ0FBQztFQUN2QztFQUVBLE9BQU9pQyxPQUFPO0FBQ2hCOzs7Ozs7Ozs7Ozs7OztBQ3BCQSxpRUFBZSxxQkFBdUIsZ0RBQWdEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2JhbGFuY2VzL25mdC91dGlscy9pc05GVC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0JOSW5wdXQudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vQmFsYW5jZUNvbHVtbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9Db250YWluZWREcm9wZG93bi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9Ecm9wZG93bi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9GdW5jdGlvbklzT2ZmbGluZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9Ub2tlbkVsbGlwc2lzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1Rva2VuU2VsZWN0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1Rva2VuU2VsZWN0b3IudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vVmlydHVhbGl6ZWRMaXN0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZURpc3BsYXlUb2tlbkxpc3QudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9ob29rcy91c2VTZW5kQW5hbHl0aWNzRGF0YS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL2JpZ2ludFRvQmlnLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvbm9ybWFsaXplQmFsYW5jZS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2ltYWdlcy90b2tlbnMvZXRoLnBuZyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBOZnRUb2tlbldpdGhCYWxhbmNlLFxuICBUb2tlblR5cGUsXG4gIFRva2VuV2l0aEJhbGFuY2UsXG59IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05mdFRva2VuVHlwZSh0eXBlOiBUb2tlblR5cGUpIHtcbiAgcmV0dXJuIHR5cGUgPT09IFRva2VuVHlwZS5FUkM3MjEgfHwgdHlwZSA9PT0gVG9rZW5UeXBlLkVSQzExNTU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05GVCh0b2tlbjogVG9rZW5XaXRoQmFsYW5jZSk6IHRva2VuIGlzIE5mdFRva2VuV2l0aEJhbGFuY2Uge1xuICByZXR1cm4gaXNOZnRUb2tlblR5cGUodG9rZW4udHlwZSk7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgV2hlZWxFdmVudCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIFN0YWNrLFxuICBUZXh0RmllbGQsXG4gIElucHV0QWRvcm5tZW50LFxuICBCdXR0b24sXG4gIHN0eWxlZCxcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IGJpZ0ludFRvU3RyaW5nIH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IHsgc3RyaW5nVG9CaWdpbnQgfSBmcm9tICdAc3JjL3V0aWxzL3N0cmluZ1RvQmlnaW50JztcblxuZXhwb3J0IGludGVyZmFjZSBCTklucHV0UHJvcHMge1xuICB2YWx1ZT86IGJpZ2ludDtcbiAgZGVub21pbmF0aW9uOiBudW1iZXI7XG4gIG9uQ2hhbmdlPyh2YWw6IHsgYmlnaW50OiBiaWdpbnQ7IGFtb3VudDogc3RyaW5nIH0pOiB2b2lkO1xuICBwbGFjZWhvbGRlcj86IHN0cmluZztcbiAgbWluPzogYmlnaW50O1xuICBtYXg/OiBiaWdpbnQ7XG4gIGlzVmFsdWVMb2FkaW5nPzogYm9vbGVhbjtcbiAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICBlcnJvcj86IGJvb2xlYW47XG4gIGZ1bGxXaWR0aD86IGJvb2xlYW47XG4gIHdpdGhNYXhCdXR0b24/OiBib29sZWFuO1xufVxuXG5jb25zdCBJbnB1dE51bWJlciA9IHN0eWxlZChUZXh0RmllbGQpYFxuICBpbnB1dDo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbixcbiAgaW5wdXQ6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24ge1xuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgICBtYXJnaW46IDA7XG4gIH1cbiAgcGFkZGluZzogMDtcbmA7XG5cbmZ1bmN0aW9uIHNwbGl0VmFsdWUodmFsOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHZhbC5pbmNsdWRlcygnLicpID8gdmFsLnNwbGl0KCcuJykgOiBbdmFsLCBudWxsXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJOSW5wdXQoe1xuICB2YWx1ZSxcbiAgZGVub21pbmF0aW9uLFxuICBvbkNoYW5nZSxcbiAgbWluID0gMG4sXG4gIG1heCxcbiAgaXNWYWx1ZUxvYWRpbmcsXG4gIGVycm9yLFxuICBkaXNhYmxlZCxcbiAgZnVsbFdpZHRoLFxuICB3aXRoTWF4QnV0dG9uID0gdHJ1ZSxcbiAgLi4ucHJvcHNcbn06IEJOSW5wdXRQcm9wcykge1xuICBjb25zdCBbdmFsU3RyLCBzZXRWYWxTdHJdID0gdXNlU3RhdGUoJycpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoTnVtYmVyKHZhbFN0cikgIT09IDApIHtcbiAgICAgICAgc2V0VmFsU3RyKCcnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gMG4pIHtcbiAgICAgIGlmIChOdW1iZXIodmFsU3RyKSAhPT0gMCkge1xuICAgICAgICBzZXRWYWxTdHIoJycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgY29uc3QgdmFsdWVBc1N0cmluZyA9IGJpZ0ludFRvU3RyaW5nKHZhbHVlLCBkZW5vbWluYXRpb24pO1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSBzdHJpbmdUb0JpZ2ludCh2YWxTdHIgfHwgJzAnLCBkZW5vbWluYXRpb24pO1xuICAgICAgLyoqXG4gICAgICAgKiBXaGVuIGRlbGV0aW5nIHplcm9zIGFmdGVyIGRlY2ltYWwsIGFsbCB6ZXJvcyBkZWxldGUgd2l0aG91dCB0aGlzIGNoZWNrLlxuICAgICAgICogVGhpcyBhbHNvIHByZXNlcnZlcyB6ZXJvcyBpbiB0aGUgaW5wdXQgdWkuXG4gICAgICAgKi9cblxuICAgICAgaWYgKCF2YWxTdHIgfHwgdmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgIHNldFZhbFN0cih2YWx1ZUFzU3RyaW5nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtkZW5vbWluYXRpb24sIHZhbFN0ciwgdmFsdWVdKTtcblxuICBjb25zdCBvblZhbHVlQ2hhbmdlZCA9IChuZXdWYWx1ZVN0cmluZzogc3RyaW5nKSA9PiB7XG4gICAgLyoqXG4gICAgICogU3BsaXQgdGhlIGlucHV0IGFuZCBtYWtlIHN1cmUgdGhlIHJpZ2h0IHNpZGUgbmV2ZXIgZXhjZWVkc1xuICAgICAqIHRoZSBkZW5vbWluYXRpb24gbGVuZ3RoXG4gICAgICovXG4gICAgY29uc3QgWywgZW5kVmFsdWVdID0gc3BsaXRWYWx1ZShuZXdWYWx1ZVN0cmluZyk7IC8vIHJlbmFtZWQgY2FsbGJhY2sgcGFyYW1cblxuICAgIGlmICghZW5kVmFsdWUgfHwgZW5kVmFsdWUubGVuZ3RoIDw9IGRlbm9taW5hdGlvbikge1xuICAgICAgY29uc3QgbmV3VmFsdWUgPSBzdHJpbmdUb0JpZ2ludChuZXdWYWx1ZVN0cmluZyB8fCAnMCcsIGRlbm9taW5hdGlvbik7XG5cbiAgICAgIGlmIChuZXdWYWx1ZSA8IG1pbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gc3RyaW5nVG9CaWdpbnQodmFsU3RyIHx8ICcwJywgZGVub21pbmF0aW9uKTtcblxuICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICBvbkNoYW5nZT8uKHtcbiAgICAgICAgICBhbW91bnQ6IGJpZ0ludFRvU3RyaW5nKG5ld1ZhbHVlIHx8IDBuLCBkZW5vbWluYXRpb24pLFxuICAgICAgICAgIGJpZ2ludDogbmV3VmFsdWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgc2V0VmFsU3RyKG5ld1ZhbHVlU3RyaW5nKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc2V0TWF4ID0gKGU6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIW1heCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9uVmFsdWVDaGFuZ2VkKGJpZ0ludFRvU3RyaW5nKG1heCwgZGVub21pbmF0aW9uKSk7XG4gIH07XG5cbiAgY29uc3QgaXNNYXhCdG5WaXNpYmxlID0gbWF4ICYmIG1heCA+IDBuO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgPElucHV0TnVtYmVyXG4gICAgICAgIGZ1bGxXaWR0aD17ZnVsbFdpZHRofVxuICAgICAgICB2YWx1ZT17dmFsU3RyLnJlcGxhY2VBbGwoJywnLCAnJyl9XG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25WYWx1ZUNoYW5nZWQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgb25LZXlEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGUuY29kZSA9PT0gJ0tleUUnIHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gJy0nIHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gJysnIHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gJ0Fycm93VXAnIHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gJ0Fycm93RG93bidcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfX1cbiAgICAgICAgb25XaGVlbD17KGU6IFdoZWVsRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICAgICAgICAvLyBQcmV2ZW50IGNoYW5naW5nIHZhbHVlIGJ5IG1vdXNlIHdoZWVsXG4gICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS5ibHVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICAgIHBsYWNlaG9sZGVyPVwiMC4wXCJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogZnVsbFdpZHRoID8gJ2F1dG8nIDogJzE4MHB4JyxcbiAgICAgICAgfX1cbiAgICAgICAgSW5wdXRQcm9wcz17e1xuICAgICAgICAgIGRpc2FibGVkLFxuICAgICAgICAgIGVuZEFkb3JubWVudDogd2l0aE1heEJ1dHRvbiA/IChcbiAgICAgICAgICAgIGlzVmFsdWVMb2FkaW5nID8gKFxuICAgICAgICAgICAgICA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXsxNn0gc3g9e3sgaGVpZ2h0OiAnYXV0byAhaW1wb3J0YW50JyB9fSAvPlxuICAgICAgICAgICAgKSA6IGlzTWF4QnRuVmlzaWJsZSA/IChcbiAgICAgICAgICAgICAgPElucHV0QWRvcm5tZW50IHBvc2l0aW9uPVwiZW5kXCI+XG4gICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3NldE1heH1cbiAgICAgICAgICAgICAgICAgIHN4PXt7IHA6IDAsIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgTWF4XG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgIDwvSW5wdXRBZG9ybm1lbnQ+XG4gICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICkgOiBudWxsLFxuICAgICAgICAgIGlucHV0TW9kZTogJ3RleHQnLFxuICAgICAgICAgIHN4OiB7XG4gICAgICAgICAgICBweTogMSxcbiAgICAgICAgICAgIHB4OiAyLFxuICAgICAgICAgIH0sXG4gICAgICAgIH19XG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFN0YWNrLCBzdHlsZWQgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgQmFsYW5jZUNvbHVtbiA9IHN0eWxlZChTdGFjaylgXG4gIGFsaWduLWl0ZW1zOiBlbmQ7XG4gIHBhZGRpbmctbGVmdDogOHB4O1xuICBsaW5lLWhlaWdodDogMTRweDtcbmA7XG4iLCJpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcywgdXNlVGhlbWUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtcbiAgZm9yd2FyZFJlZixcbiAgTXV0YWJsZVJlZk9iamVjdCxcbiAgUHJvcHNXaXRoQ2hpbGRyZW4sXG4gIHVzZUVmZmVjdCxcbiAgdXNlUmVmLFxufSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEJPVFRPTV9QQURESU5HID0gMTY7XG5cbi8vIERyb3Bkb3duIGlzIGFic29sdXRlbHkgcG9zaXRpb25lZCwgYW5kIGZpbGxzIHRoZSB2aWV3cG9ydCBiZW5lYXRoIHRoZSBzZWxlY3QgZWxlbWVudFxuY29uc3QgZ2V0RHJvcGRvd25IZWlnaHQgPSAoXG4gIGFuY2hvckVsOiBNdXRhYmxlUmVmT2JqZWN0PEhUTUxFbGVtZW50IHwgbnVsbD4sXG4gIGNvbnRhaW5lclJlZj86IE11dGFibGVSZWZPYmplY3Q8SFRNTEVsZW1lbnQgfCBudWxsPixcbik6IG51bWJlciA9PiB7XG4gIGlmICghYW5jaG9yRWwuY3VycmVudCB8fCAhd2luZG93LnZpc3VhbFZpZXdwb3J0KSByZXR1cm4gMDsgLy8gRGVmYXVsdCBoZWlnaHRcblxuICBjb25zdCBhbmNob3JUb3AgPVxuICAgIGFuY2hvckVsLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC1cbiAgICBhbmNob3JFbC5jdXJyZW50Lm9mZnNldEhlaWdodDtcblxuICBpZiAoY29udGFpbmVyUmVmPy5jdXJyZW50KSB7XG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSAtIGFuY2hvclRvcDtcbiAgfVxuXG4gIHJldHVybiB3aW5kb3cudmlzdWFsVmlld3BvcnQuaGVpZ2h0IC0gYW5jaG9yVG9wIC0gQk9UVE9NX1BBRERJTkc7XG59O1xuXG5jb25zdCBnZXRPZmZzZXRUb3AgPSAoYW5jaG9yRWw6IE11dGFibGVSZWZPYmplY3Q8SFRNTEVsZW1lbnQgfCBudWxsPikgPT5cbiAgYW5jaG9yRWw/LmN1cnJlbnRcbiAgICA/IGFuY2hvckVsPy5jdXJyZW50Py5vZmZzZXRUb3AgKyBhbmNob3JFbD8uY3VycmVudD8ub2Zmc2V0SGVpZ2h0XG4gICAgOiAwO1xuXG5jb25zdCBEcm9wZG93biA9IGZvcndhcmRSZWY8SFRNTERpdkVsZW1lbnQsIFN0YWNrUHJvcHM+KFxuICAoeyBzeCA9IHt9LCAuLi5wcm9wcyB9LCByZWYpID0+IChcbiAgICA8U3RhY2tcbiAgICAgIHJlZj17cmVmfVxuICAgICAgc3g9e3tcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgIG92ZXJmbG93WTogJ2hpZGRlbicsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2NvbW1vbi5ibGFjaycsXG4gICAgICAgIHpJbmRleDogMixcbiAgICAgICAgdHJhbnNpdGlvbjogJ2hlaWdodCAwLjE1cyBlYXNlLCBvcGFjaXR5IDAuMTVzIGVhc2UnLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgLi4uc3gsXG4gICAgICB9fVxuICAgICAgey4uLnByb3BzfVxuICAgIC8+XG4gICksXG4pO1xuRHJvcGRvd24uZGlzcGxheU5hbWUgPSAnRHJvcGRvd24nO1xuXG50eXBlIENvbnRhaW5lZERyb3Bkb3duUHJvcHMgPSB7XG4gIGFuY2hvckVsOiBNdXRhYmxlUmVmT2JqZWN0PEhUTUxFbGVtZW50IHwgbnVsbD47XG4gIGlzT3Blbj86IGJvb2xlYW47XG4gIHRvcD86IG51bWJlcjtcbiAgcmlnaHQ/OiBudW1iZXI7XG4gIHdpZHRoPzogc3RyaW5nO1xuICBoZWlnaHQ/OiBzdHJpbmc7XG4gIG1hcmdpbj86IHN0cmluZztcbiAgYm9yZGVyUmFkaXVzPzogc3RyaW5nO1xuICBzZXRJc09wZW46IChpc09wZW46IGJvb2xlYW4pID0+IHZvaWQ7XG4gIGNvbnRhaW5lclJlZj86IE11dGFibGVSZWZPYmplY3Q8SFRNTEVsZW1lbnQgfCBudWxsPjtcbn07XG5cbi8qKlxuICogV3JhcHBlciBmb3IgZHJvcGRvd24gY29udGVudCBvbiB0aGUgYnJvd3Nlci1leHRlbnNpb24gd2FsbGV0LlxuICogUHJvdmlkZXMgYSBmdWxsLXdpZHRoIGNvbnRhaW5lciBzcGFubmluZyB0aGUgc3BhY2UgYmVuZWF0aCB0aGUgYW5jaG9yRWwsIHdpdGhpbiB0aGUgdmlld3BvcnQuXG4gKi9cbmV4cG9ydCBjb25zdCBDb250YWluZWREcm9wZG93biA9ICh7XG4gIGFuY2hvckVsLCAvLyBSZWYgb2YgdGhlIGVsZW1lbnQgYWJvdmUgd2hlcmUgdGhlIGRyb3Bkb3duIHNob3VsZCBhcHBlYXJcbiAgY2hpbGRyZW4sXG4gIGlzT3BlbiA9IGZhbHNlLFxuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBtYXJnaW4sXG4gIGJvcmRlclJhZGl1cyxcbiAgc2V0SXNPcGVuLFxuICBjb250YWluZXJSZWYsXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxDb250YWluZWREcm9wZG93blByb3BzPikgPT4ge1xuICBjb25zdCBjYWxjdWxhdGVkSGVpZ2h0ID0gZ2V0RHJvcGRvd25IZWlnaHQoYW5jaG9yRWwsIGNvbnRhaW5lclJlZik7XG4gIGNvbnN0IHRvcCA9IGdldE9mZnNldFRvcChhbmNob3JFbCk7XG4gIGNvbnN0IGNvbnRhaW5lciA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IHsgc3BhY2luZyB9ID0gdXNlVGhlbWUoKTtcblxuICAvLyBXZSBuZWVkIHRvIGRldGVjdCB0aGUgd2hlcmUgdGhlIHVzZXIgY2xpY2tlZC4gSWYgb3V0c2lkZSBvZiB0aGUgYW5jaG9yICh0aGF0IGlzIHRoZSBidXR0b24gd2hpY2ggb3BlbnMgdGhlIGRyb3Bkb3duKSBhbmQgdGhlIGxpc3QsIGl0IHNob3VsZCBjbG9zZSB0aGUgZHJvcGRvd25cbiAgLy8gaWYgdGhlIHVzZXIgY2xpY2sgdGhlIGFuY2hvciAodGhlIGJ1dHRvbikgaXQgd2lsbCBoYW5kbGUgdGhhdCBvbiBpdHMgb3duXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlQ2xpY2tPdXRzaWRlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGFuY2hvckVsZW1lbnRDbGlja2VkID0gYW5jaG9yRWwuY3VycmVudD8uY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSk7XG4gICAgICBjb25zdCBjb250YWluZXJDbGlja2VkID0gY29udGFpbmVyLmN1cnJlbnQ/LmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpO1xuICAgICAgaWYgKCFhbmNob3JFbGVtZW50Q2xpY2tlZCAmJiAhY29udGFpbmVyQ2xpY2tlZCkge1xuICAgICAgICBzZXRJc09wZW4oZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlQ2xpY2tPdXRzaWRlKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVDbGlja091dHNpZGUpO1xuICAgIH07XG4gIH0sIFthbmNob3JFbCwgc2V0SXNPcGVuXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8RHJvcGRvd25cbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiB3aWR0aCA/PyAnMTAwJScsXG4gICAgICAgIGJvcmRlclJhZGl1czogYm9yZGVyUmFkaXVzID8/IHNwYWNpbmcoMCwgMCwgMSwgMSksXG4gICAgICAgIG1hcmdpbjogbWFyZ2luID8/ICcwJyxcbiAgICAgICAgaGVpZ2h0OiBpc09wZW4gPyBgJHtoZWlnaHQgfHwgY2FsY3VsYXRlZEhlaWdodCAtIHRvcH1weGAgOiAwLFxuICAgICAgICB0b3AsXG4gICAgICAgIG9wYWNpdHk6IGlzT3BlbiA/IDEgOiAwLFxuICAgICAgfX1cbiAgICAgIHJlZj17Y29udGFpbmVyfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0Ryb3Bkb3duPlxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIENoZXZyb25Eb3duSWNvbixcbiAgSWNvbkJhc2VQcm9wcyxcbiAgTWVudUl0ZW0sXG4gIE1lbnVJdGVtUHJvcHMsXG4gIFNlbGVjdCxcbiAgVGV4dEZpZWxkUHJvcHMsXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5jb25zdCBUcmlnZ2VySWNvbiA9ICh7IC4uLnJlc3QgfTogSWNvbkJhc2VQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8Q2hldnJvbkRvd25JY29uXG4gICAgICBzaXplPXsyMH1cbiAgICAgIHN4PXt7XG4gICAgICAgICcuTXVpU2VsZWN0LWljb24nOiB7XG4gICAgICAgICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxNTBtcyBlYXNlLWluLW91dCcsXG4gICAgICAgICAgcmlnaHQ6IHRoZW1lLnNwYWNpbmcoMiksXG4gICAgICAgICAgdG9wOiAnY2FsYyg1MCUgLSAxMHB4KScsXG4gICAgICAgIH0sXG4gICAgICAgICcuTXVpU2VsZWN0LWljb25PcGVuJzoge1xuICAgICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZVgoMTgwZGVnKScsXG4gICAgICAgIH0sXG4gICAgICB9fVxuICAgICAgey4uLnJlc3R9XG4gICAgLz5cbiAgKTtcbn07XG5cbmNvbnN0IHVzZURyb3Bkb3duUHJvcHMgPSAoe1xuICBJbnB1dFByb3BzOiB7IHN4OiBpbnB1dFN4ID0ge30sIC4uLm90aGVySW5wdXRQcm9wcyB9ID0ge30sXG4gIFNlbGVjdFByb3BzOiB7XG4gICAgTWVudVByb3BzOiB7XG4gICAgICBQYXBlclByb3BzOiB7IHN4OiBwYXBlclN4ID0ge30sIC4uLm90aGVyUGFwZXJQcm9wcyB9ID0ge30sXG4gICAgICAuLi5vdGhlck1lbnVQcm9wc1xuICAgIH0gPSB7fSxcbiAgICAuLi5vdGhlclNlbGVjdFByb3BzXG4gIH0gPSB7fSxcbiAgLi4ucmVzdFxufTogVGV4dEZpZWxkUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiB7XG4gICAgSW5wdXRQcm9wczoge1xuICAgICAgc3g6IHtcbiAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDYpLFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHt0aGVtZS5wYWxldHRlLmdyZXlbODAwXX1gLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuZ3JleVs4NTBdLFxuICAgICAgICBmb250U2l6ZTogdGhlbWUudHlwb2dyYXBoeS5ib2R5MS5mb250U2l6ZSxcblxuICAgICAgICAnJi5NdWktZm9jdXNlZCc6IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuZ3JleVs4NTBdLFxuICAgICAgICB9LFxuICAgICAgICAnLk11aU91dGxpbmVkSW5wdXQtbm90Y2hlZE91dGxpbmUsICY6aG92ZXIgLk11aU91dGxpbmVkSW5wdXQtbm90Y2hlZE91dGxpbmUnOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICcuTXVpT3V0bGluZWRJbnB1dC1pbnB1dCc6IHtcbiAgICAgICAgICBwYWRkaW5nOiB0aGVtZS5zcGFjaW5nKDEuNSwgMiksXG4gICAgICAgIH0sXG4gICAgICAgIC4uLmlucHV0U3gsXG4gICAgICB9LFxuICAgICAgLi4ub3RoZXJJbnB1dFByb3BzLFxuICAgIH0sXG4gICAgU2VsZWN0UHJvcHM6IHtcbiAgICAgIEljb25Db21wb25lbnQ6IFRyaWdnZXJJY29uLFxuICAgICAgTWVudVByb3BzOiB7XG4gICAgICAgIFBhcGVyUHJvcHM6IHtcbiAgICAgICAgICBzeDoge1xuICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7dGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF19YCxcbiAgICAgICAgICAgIG1heFdpZHRoOiAzNDMsXG4gICAgICAgICAgICBtYXhIZWlnaHQ6IDE0NCxcbiAgICAgICAgICAgIG10OiAyLFxuICAgICAgICAgICAgLi4ucGFwZXJTeCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLm90aGVyUGFwZXJQcm9wcyxcbiAgICAgICAgfSxcbiAgICAgICAgLi4ub3RoZXJNZW51UHJvcHMsXG4gICAgICB9LFxuICAgICAgLi4ub3RoZXJTZWxlY3RQcm9wcyxcbiAgICB9LFxuICAgIC4uLnJlc3QsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgRHJvcGRvd24gPSAoeyBjaGlsZHJlbiwgLi4ucHJvcHMgfTogVGV4dEZpZWxkUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IFNlbGVjdFByb3BzLCBJbnB1dFByb3BzLCAuLi5yZXN0IH0gPSB1c2VEcm9wZG93blByb3BzKHByb3BzKTtcblxuICByZXR1cm4gKFxuICAgIDxTZWxlY3RcbiAgICAgIHZhcmlhbnQ9XCJvdXRsaW5lZFwiXG4gICAgICBJbnB1dFByb3BzPXtJbnB1dFByb3BzfVxuICAgICAgU2VsZWN0UHJvcHM9e1NlbGVjdFByb3BzfVxuICAgICAgaW5wdXRMYWJlbFByb3BzPXt7XG4gICAgICAgIHN4OiB7IHRyYW5zZm9ybTogJ25vbmUnLCBmb250U2l6ZTogdGhlbWUudHlwb2dyYXBoeS5ib2R5Mi5mb250U2l6ZSB9LFxuICAgICAgfX1cbiAgICAgIHsuLi5yZXN0fVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1NlbGVjdD5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBEcm9wZG93bkl0ZW0gPSAoeyBzeCwgY2hpbGRyZW4sIC4uLnByb3BzIH06IE1lbnVJdGVtUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPE1lbnVJdGVtXG4gICAgICBzeD17e1xuICAgICAgICBtaW5IZWlnaHQ6ICdhdXRvJyxcbiAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDUpLFxuICAgICAgICBmb250U2l6ZTogdGhlbWUudHlwb2dyYXBoeS5ib2R5Mi5mb250U2l6ZSxcbiAgICAgICAgZ2FwOiAxLFxuICAgICAgICAuLi5zeCxcbiAgICAgIH19XG4gICAgICB7Li4ucHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvTWVudUl0ZW0+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBQYWdlVGl0bGUsIFBhZ2VUaXRsZVZhcmlhbnQgfSBmcm9tICcuL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB0IGFzIHRyYW5zbGF0ZSB9IGZyb20gJ2kxOG5leHQnO1xuaW1wb3J0IHtcbiAgQWxlcnRDaXJjbGVJY29uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBGdW5jdGlvbk5hbWVzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VJc0Z1bmN0aW9uQXZhaWxhYmxlJztcblxuaW50ZXJmYWNlIEZ1bmN0aW9uSXNPZmZsaW5lUHJvcHMge1xuICBmdW5jdGlvbk5hbWU6IEZ1bmN0aW9uTmFtZXM7XG4gIGhpZGVQYWdlVGl0bGU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNsYXRlZEZ1bmN0aW9uTmFtZShuYW1lOiBGdW5jdGlvbk5hbWVzKSB7XG4gIGNvbnN0IHRyYW5zbGF0aW9ucyA9IHtcbiAgICBbRnVuY3Rpb25OYW1lcy5CUklER0VdOiB0cmFuc2xhdGUoJ0JyaWRnZScpLFxuICAgIFtGdW5jdGlvbk5hbWVzLlNXQVBdOiB0cmFuc2xhdGUoJ1N3YXAnKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5TRU5EXTogdHJhbnNsYXRlKCdTZW5kJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuQlVZXTogdHJhbnNsYXRlKCdCdXknKSxcbiAgICBbRnVuY3Rpb25OYW1lcy5ERUZJXTogdHJhbnNsYXRlKCdEZUZpJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuS0VZU1RPTkVdOiB0cmFuc2xhdGUoJ0tleXN0b25lJyksXG4gICAgW0Z1bmN0aW9uTmFtZXMuVE9LRU5fREVUQUlMU106IHRyYW5zbGF0ZSgnVG9rZW4gRGV0YWlscycpLFxuICB9O1xuXG4gIHJldHVybiB0cmFuc2xhdGlvbnNbbmFtZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBGdW5jdGlvbklzT2ZmbGluZSh7XG4gIGZ1bmN0aW9uTmFtZSxcbiAgaGlkZVBhZ2VUaXRsZSxcbiAgY2hpbGRyZW4sXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxGdW5jdGlvbklzT2ZmbGluZVByb3BzPikge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgaGVpZ2h0OiAnMTAwJScsIHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICB7IWhpZGVQYWdlVGl0bGUgJiYgKFxuICAgICAgICA8UGFnZVRpdGxlIHZhcmlhbnQ9e1BhZ2VUaXRsZVZhcmlhbnQuUFJJTUFSWX0+e3QoJ1NvcnJ5Jyl9PC9QYWdlVGl0bGU+XG4gICAgICApfVxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7IGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGZsZXhHcm93OiAxIH19XG4gICAgICA+XG4gICAgICAgIDxBbGVydENpcmNsZUljb24gc2l6ZT17NzJ9IHN4PXt7IG1iOiAzLCBtdDogLTkgfX0gLz5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgc3g9e3sgbWI6IDEgfX0+XG4gICAgICAgICAge3QoJ0ZlYXR1cmUgRGlzYWJsZWQnKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHNpemU9ezE2fVxuICAgICAgICAgIGFsaWduPVwiY2VudGVyXCJcbiAgICAgICAgICBoZWlnaHQ9XCIyNHB4XCJcbiAgICAgICAgICBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ3t7ZnVuY3Rpb25OYW1lfX0gaXMgY3VycmVudGx5IHVuYXZhaWxhYmxlLicsIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTpcbiAgICAgICAgICAgICAgZ2V0VHJhbnNsYXRlZEZ1bmN0aW9uTmFtZShmdW5jdGlvbk5hbWUpID8/IHQoJ1RoaXMgRmVhdHVyZScpLFxuICAgICAgICAgIH0pfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgIHt0KCdQbGVhc2UgY2hlY2sgYmFjayBsYXRlciBhbmQgdHJ5IGFnYWluLicpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgU3hQcm9wcywgVG9vbHRpcCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5cbmludGVyZmFjZSBUb2tlbkVsbGlwc2lzUHJvcHMge1xuICBtYXhMZW5ndGg6IG51bWJlcjtcbiAgdGV4dDogc3RyaW5nO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIHN4PzogU3hQcm9wcztcbn1cblxuZnVuY3Rpb24gaXNUcnVuY2F0ZWQobWF4TGVuZ3RoLCB0ZXh0KSB7XG4gIHJldHVybiB0ZXh0Lmxlbmd0aCA+IG1heExlbmd0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRva2VuRWxsaXBzaXMoe1xuICBtYXhMZW5ndGgsXG4gIHRleHQsXG4gIGNsYXNzTmFtZSxcbiAgc3gsXG59OiBQcm9wc1dpdGhDaGlsZHJlbjxUb2tlbkVsbGlwc2lzUHJvcHM+KSB7XG4gIGNvbnN0IG5hbWUgPVxuICAgIHRleHQubGVuZ3RoIDw9IG1heExlbmd0aCA/IHRleHQgOiB0cnVuY2F0ZUFkZHJlc3ModGV4dCwgbWF4TGVuZ3RoIC8gMik7XG4gIHJldHVybiAoXG4gICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgPFRvb2x0aXBcbiAgICAgICAgcGxhY2VtZW50PVwiYm90dG9tXCJcbiAgICAgICAgdGl0bGU9e3RleHR9XG4gICAgICAgIGRpc2FibGVIb3Zlckxpc3RlbmVyPXshaXNUcnVuY2F0ZWQobWF4TGVuZ3RoLCB0ZXh0KX1cbiAgICAgICAgZGlzYWJsZUZvY3VzTGlzdGVuZXI9eyFpc1RydW5jYXRlZChtYXhMZW5ndGgsIHRleHQpfVxuICAgICAgICBzeD17c3ggPz8geyBjdXJzb3I6ICdwb2ludGVyJyB9fVxuICAgICAgPlxuICAgICAgICA8PntuYW1lfTwvPlxuICAgICAgPC9Ub29sdGlwPlxuICAgIDwvc3Bhbj5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIENoYW5nZUV2ZW50LFxuICBNdXRhYmxlUmVmT2JqZWN0LFxuICB1c2VDYWxsYmFjayxcbiAgdXNlRWZmZWN0LFxuICB1c2VNZW1vLFxuICB1c2VSZWYsXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgQ29udGFpbmVkRHJvcGRvd24gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0NvbnRhaW5lZERyb3Bkb3duJztcbmltcG9ydCBFdGhMb2dvIGZyb20gJ0BzcmMvaW1hZ2VzL3Rva2Vucy9ldGgucG5nJztcbmltcG9ydCB7XG4gIGhhc1VuY29uZmlybWVkQlRDQmFsYW5jZSxcbiAgaXNBdmF4V2l0aFVuYXZhaWxhYmxlQmFsYW5jZSxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2JhbGFuY2VzL21vZGVscyc7XG5pbXBvcnQgeyBiaWdUb0xvY2FsZVN0cmluZywgVG9rZW5Vbml0IH0gZnJvbSAnQGF2YWxhYnMvY29yZS11dGlscy1zZGsnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IEJhbGFuY2VDb2x1bW4gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0JhbGFuY2VDb2x1bW4nO1xuaW1wb3J0IHsgQXV0b1NpemVyIH0gZnJvbSAncmVhY3QtdmlydHVhbGl6ZWQnO1xuaW1wb3J0IFZpcnR1YWxpemVkTGlzdCBmcm9tICcuL1ZpcnR1YWxpemVkTGlzdCc7XG5pbXBvcnQge1xuICBJbmZvQ2lyY2xlSWNvbixcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIHN0eWxlZCxcbiAgVHlwb2dyYXBoeSxcbiAgRGl2aWRlcixcbiAgQ2FyZCxcbiAgU2VhcmNoQmFyLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgQk5JbnB1dCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vQk5JbnB1dCc7XG5pbXBvcnQgeyBUb2tlblNlbGVjdG9yIH0gZnJvbSAnLi9Ub2tlblNlbGVjdG9yJztcbmltcG9ydCB7IFRva2VuRWxsaXBzaXMgfSBmcm9tICcuL1Rva2VuRWxsaXBzaXMnO1xuaW1wb3J0IHsgRHJvcGRvd25JdGVtIH0gZnJvbSAnLi9Ecm9wZG93bic7XG5pbXBvcnQgeyB1c2VEaXNwbGF5dG9rZW5saXN0IH0gZnJvbSAnQHNyYy9ob29rcy91c2VEaXNwbGF5VG9rZW5MaXN0JztcbmltcG9ydCB7IFRva2VuSWNvbiB9IGZyb20gJy4vVG9rZW5JY29uJztcbmltcG9ydCB7IFRva2VuV2l0aEJhbGFuY2UgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgYmlnaW50VG9CaWcgfSBmcm9tICdAc3JjL3V0aWxzL2JpZ2ludFRvQmlnJztcbmltcG9ydCB7IHN0cmluZ1RvQmlnaW50IH0gZnJvbSAnQHNyYy91dGlscy9zdHJpbmdUb0JpZ2ludCc7XG5cbmNvbnN0IElucHV0Q29udGFpbmVyID0gc3R5bGVkKENhcmQpYFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDhweCAxNnB4O1xuICBiYWNrZ3JvdW5kOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLnBhbGV0dGUuZ3JleVs4NTBdfTtcbiAgZGlzcGxheTogZmxleDtcbmA7XG5cbmNvbnN0IFNlbGVjdENvbnRhaW5lciA9IHN0eWxlZChTdGFjaylgXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbmA7XG5cbmNvbnN0IERyb3Bkb3duQ29udGVudHMgPSBzdHlsZWQoU3RhY2spYFxuICBmbGV4LWdyb3c6IDE7XG4gIGJhY2tncm91bmQ6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF19O1xuICBib3JkZXItcmFkaXVzOiAwIDAgOHB4IDhweDtcbiAgei1pbmRleDogMjtcbmA7XG5cbmNvbnN0IFNlYXJjaElucHV0Q29udGFpbmVyID0gc3R5bGVkKFN0YWNrKWBcbiAgcGFkZGluZy1sZWZ0OiAxNnB4O1xuICBwYWRkaW5nLXJpZ2h0OiAxNnB4O1xuYDtcblxuY29uc3QgU3R5bGVkRHJvcGRvd25NZW51SXRlbSA9IHN0eWxlZChEcm9wZG93bkl0ZW0pYFxuICBwYWRkaW5nOiA4cHggMTZweDtcbmA7XG5cbmludGVyZmFjZSBUb2tlblNlbGVjdFByb3BzIHtcbiAgc2VsZWN0ZWRUb2tlbj86IFRva2VuV2l0aEJhbGFuY2UgfCBudWxsO1xuICBvblRva2VuQ2hhbmdlKHRva2VuOiBUb2tlbldpdGhCYWxhbmNlKTogdm9pZDtcbiAgbWF4QW1vdW50PzogYmlnaW50O1xuICBpbnB1dEFtb3VudD86IGJpZ2ludDtcbiAgb25JbnB1dEFtb3VudENoYW5nZT8oZGF0YTogeyBhbW91bnQ6IHN0cmluZzsgYmlnaW50OiBiaWdpbnQgfSk6IHZvaWQ7XG4gIG9uU2VsZWN0VG9nZ2xlPygpOiB2b2lkO1xuICBpc09wZW46IGJvb2xlYW47XG4gIHNldElzT3BlbjogKGlzT3BlbjogYm9vbGVhbikgPT4gdm9pZDtcbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHBhZGRpbmc/OiBzdHJpbmc7XG4gIGxhYmVsPzogc3RyaW5nO1xuICBzZWxlY3RvckxhYmVsPzogc3RyaW5nO1xuICB0b2tlbnNMaXN0PzogVG9rZW5XaXRoQmFsYW5jZVtdO1xuICBpc1ZhbHVlTG9hZGluZz86IGJvb2xlYW47XG4gIGhpZGVFcnJvck1lc3NhZ2U/OiBib29sZWFuO1xuICBza2lwSGFuZGxlTWF4QW1vdW50PzogYm9vbGVhbjtcbiAgY29udGFpbmVyUmVmPzogTXV0YWJsZVJlZk9iamVjdDxIVE1MRWxlbWVudCB8IG51bGw+O1xuICB3aXRoTWF4QnV0dG9uPzogYm9vbGVhbjtcbiAgd2l0aE9ubHlUb2tlblByZXNlbGVjdD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUb2tlblNlbGVjdCh7XG4gIHNlbGVjdGVkVG9rZW4sXG4gIG9uVG9rZW5DaGFuZ2UsXG4gIHRva2Vuc0xpc3QsXG4gIG1heEFtb3VudCxcbiAgaW5wdXRBbW91bnQsXG4gIG9uSW5wdXRBbW91bnRDaGFuZ2UsXG4gIG9uU2VsZWN0VG9nZ2xlLFxuICBpc09wZW4sXG4gIGVycm9yLFxuICBwYWRkaW5nLFxuICBsYWJlbCxcbiAgc2VsZWN0b3JMYWJlbCxcbiAgaXNWYWx1ZUxvYWRpbmcsXG4gIGhpZGVFcnJvck1lc3NhZ2UsXG4gIHNraXBIYW5kbGVNYXhBbW91bnQsXG4gIHNldElzT3BlbixcbiAgY29udGFpbmVyUmVmLFxuICB3aXRoTWF4QnV0dG9uID0gdHJ1ZSxcbiAgd2l0aE9ubHlUb2tlblByZXNlbGVjdCA9IHRydWUsXG59OiBUb2tlblNlbGVjdFByb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBjdXJyZW5jeUZvcm1hdHRlciwgY3VycmVuY3kgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuXG4gIGNvbnN0IHNlbGVjdEJ1dHRvblJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IFtzZWFyY2hRdWVyeSwgc2V0U2VhcmNoUXVlcnldID0gdXNlU3RhdGUoJycpO1xuXG4gIGNvbnN0IFthbW91bnRJbkN1cnJlbmN5LCBzZXRBbW91bnRJbkN1cnJlbmN5XSA9IHVzZVN0YXRlPHN0cmluZz4oKTtcblxuICBjb25zdCBkZWNpbWFscyA9XG4gICAgc2VsZWN0ZWRUb2tlbiAmJiAnZGVjaW1hbHMnIGluIHNlbGVjdGVkVG9rZW4gPyBzZWxlY3RlZFRva2VuLmRlY2ltYWxzIDogMTg7XG5cbiAgLy8gU3RyaW5naWZ5IG1heEFtb3VudCBmb3IgcmVmZXJlbnRpYWwgZXF1YWxpdHkgaW4gdXNlRWZmZWN0XG4gIGNvbnN0IG1heEFtb3VudFN0cmluZyA9IG1heEFtb3VudFxuICAgID8gbmV3IFRva2VuVW5pdChtYXhBbW91bnQsIGRlY2ltYWxzLCAnJykudG9EaXNwbGF5KClcbiAgICA6IG51bGw7XG4gIGNvbnN0IFtpc01heEFtb3VudCwgc2V0SXNNYXhBbW91bnRdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGhhbmRsZUFtb3VudENoYW5nZSA9IHVzZUNhbGxiYWNrKFxuICAgICh7IGFtb3VudCwgYmlnaW50IH06IHsgYW1vdW50OiBzdHJpbmc7IGJpZ2ludDogYmlnaW50IH0pID0+IHtcbiAgICAgIG9uSW5wdXRBbW91bnRDaGFuZ2U/Lih7IGFtb3VudCwgYmlnaW50IH0pO1xuICAgICAgaWYgKCFtYXhBbW91bnRTdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2V0SXNNYXhBbW91bnQobWF4QW1vdW50U3RyaW5nID09PSBhbW91bnQpO1xuICAgIH0sXG4gICAgW29uSW5wdXRBbW91bnRDaGFuZ2UsIG1heEFtb3VudFN0cmluZ10sXG4gICk7XG4gIGNvbnN0IGhpZGVUb2tlbkRyb3Bkb3duID0gdG9rZW5zTGlzdCAmJiB0b2tlbnNMaXN0Lmxlbmd0aCA8IDI7XG5cbiAgY29uc3QgZGlzcGxheVRva2VuTGlzdCA9IHVzZURpc3BsYXl0b2tlbmxpc3Qoe1xuICAgIHRva2Vuc0xpc3QsXG4gICAgc2VhcmNoUXVlcnksXG4gIH0pO1xuXG4gIGNvbnN0IGZvcm1hdHRlZEFtb3VudCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHByaWNlID0gc2VsZWN0ZWRUb2tlbj8ucHJpY2VJbkN1cnJlbmN5O1xuICAgIGNvbnN0IGFtb3VudCA9XG4gICAgICBpbnB1dEFtb3VudCAmJiBpbnB1dEFtb3VudCAhPT0gMG4gJiYgcHJpY2VcbiAgICAgICAgPyBjdXJyZW5jeUZvcm1hdHRlcihcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoXG4gICAgICAgICAgICAgIGJpZ1RvTG9jYWxlU3RyaW5nKGJpZ2ludFRvQmlnKGlucHV0QW1vdW50LCBkZWNpbWFscykpLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgLywvZyxcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICkgKiBwcmljZSxcbiAgICAgICAgICApXG4gICAgICAgIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBhbW91bnQ7XG4gIH0sIFtjdXJyZW5jeUZvcm1hdHRlciwgZGVjaW1hbHMsIGlucHV0QW1vdW50LCBzZWxlY3RlZFRva2VuXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRBbW91bnRJbkN1cnJlbmN5KGZvcm1hdHRlZEFtb3VudCk7XG4gIH0sIFtmb3JtYXR0ZWRBbW91bnRdKTtcblxuICAvLyBXaGVuIHNldHRpbmcgdG8gdGhlIG1heCwgcGluIHRoZSBpbnB1dCB2YWx1ZSB0byB0aGUgbWF4IHZhbHVlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFpc01heEFtb3VudCB8fCAhbWF4QW1vdW50U3RyaW5nIHx8IHNraXBIYW5kbGVNYXhBbW91bnQpIHJldHVybjtcbiAgICBoYW5kbGVBbW91bnRDaGFuZ2Uoe1xuICAgICAgYW1vdW50OiBtYXhBbW91bnRTdHJpbmcsXG4gICAgICBiaWdpbnQ6IHN0cmluZ1RvQmlnaW50KG1heEFtb3VudFN0cmluZywgZGVjaW1hbHMpLFxuICAgIH0pO1xuICB9LCBbXG4gICAgbWF4QW1vdW50U3RyaW5nLFxuICAgIGhhbmRsZUFtb3VudENoYW5nZSxcbiAgICBpc01heEFtb3VudCxcbiAgICBza2lwSGFuZGxlTWF4QW1vdW50LFxuICAgIGRlY2ltYWxzLFxuICBdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIHdoZW4gb25seSBvbmUgdG9rZW4gaXMgcHJlc2VudCwgYXV0byBzZWxlY3QgaXRcbiAgICBjb25zdCBoYXNPbmx5T25lVG9rZW4gPSB0b2tlbnNMaXN0Py5sZW5ndGggPT09IDE7XG4gICAgY29uc3QgdGhlT25seVRva2VuID0gaGFzT25seU9uZVRva2VuID8gdG9rZW5zTGlzdFswXSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBpc09ubHlUb2tlbk5vdFNlbGVjdGVkID1cbiAgICAgIHRoZU9ubHlUb2tlbiAmJiB0aGVPbmx5VG9rZW4/LnN5bWJvbCAhPT0gc2VsZWN0ZWRUb2tlbj8uc3ltYm9sO1xuXG4gICAgaWYgKHdpdGhPbmx5VG9rZW5QcmVzZWxlY3QgJiYgaXNPbmx5VG9rZW5Ob3RTZWxlY3RlZCkge1xuICAgICAgb25Ub2tlbkNoYW5nZSh0aGVPbmx5VG9rZW4pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyB3aGVuIHNlbGVjdGVkIHRva2VuIGlzIG5vdCBzdXBwb3J0ZWQsIGNsZWFyIGl0XG4gICAgY29uc3Qgc3VwcG9ydGVkU3ltYm9scyA9IHRva2Vuc0xpc3Q/LmZsYXRNYXAoKHRvaykgPT4gdG9rLnN5bWJvbCkgPz8gW107XG5cbiAgICBpZiAoXG4gICAgICBzZWxlY3RlZFRva2VuICYmXG4gICAgICB0b2tlbnNMaXN0Py5bMF0gJiZcbiAgICAgICFzdXBwb3J0ZWRTeW1ib2xzLmluY2x1ZGVzKHNlbGVjdGVkVG9rZW4uc3ltYm9sKVxuICAgICkge1xuICAgICAgb25Ub2tlbkNoYW5nZSh0b2tlbnNMaXN0WzBdKTtcbiAgICB9XG4gIH0sIFt3aXRoT25seVRva2VuUHJlc2VsZWN0LCB0b2tlbnNMaXN0LCBvblRva2VuQ2hhbmdlLCBzZWxlY3RlZFRva2VuXSk7XG5cbiAgY29uc3Qgcm93UmVuZGVyZXIgPSB1c2VDYWxsYmFjayhcbiAgICAoeyBrZXksIGluZGV4LCBzdHlsZSB9KSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IGRpc3BsYXlUb2tlbkxpc3RbaW5kZXhdO1xuXG4gICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgIC8vIFRva2VuIHNob3VsZCBiZSB0cnV0aHkgYW5kIHNob3VsZCBub3QgZ2V0IGhlcmUuIEp1c3QgYWRkaW5nIHRoaXMgdG8gbm90IGJyZWFrIHRoZSBsaXN0IGlmIHRoaXMgaGFwcGVucy4gVGhpcyB3aWxsIG1ha2UgdGhlIHJvdyBqdXN0IGVtcHR5LlxuICAgICAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGtleT17a2V5fT48L2Rpdj47XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkRHJvcGRvd25NZW51SXRlbVxuICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICBkYXRhLXRlc3RpZD17YHRva2VuLXNlYXJjaC1tZW51LWl0ZW0tJHtpbmRleH1gfVxuICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIG9uVG9rZW5DaGFuZ2UodG9rZW4udG9rZW4pO1xuICAgICAgICAgICAgb25TZWxlY3RUb2dnbGU/LigpO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8VG9rZW5JY29uXG4gICAgICAgICAgICAgICAgd2lkdGg9XCIzMnB4XCJcbiAgICAgICAgICAgICAgICBoZWlnaHQ9XCIzMnB4XCJcbiAgICAgICAgICAgICAgICBzcmM9e3Rva2VuLnN5bWJvbCA9PT0gJ0VUSCcgPyBFdGhMb2dvIDogdG9rZW4udG9rZW4ubG9nb1VyaX1cbiAgICAgICAgICAgICAgICBuYW1lPXt0b2tlbi5zeW1ib2x9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNlwiIHN4PXt7IG1sOiAyIH19PlxuICAgICAgICAgICAgICAgIDxUb2tlbkVsbGlwc2lzIHRleHQ9e3Rva2VuLm5hbWV9IG1heExlbmd0aD17MTR9IC8+XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8QmFsYW5jZUNvbHVtbj5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCI+XG4gICAgICAgICAgICAgICAge3Rva2VuLmRpc3BsYXlWYWx1ZX17JyAnfVxuICAgICAgICAgICAgICAgIDxUb2tlbkVsbGlwc2lzIHRleHQ9e3Rva2VuLnN5bWJvbH0gbWF4TGVuZ3RoPXs4fSAvPlxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L0JhbGFuY2VDb2x1bW4+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdHlsZWREcm9wZG93bk1lbnVJdGVtPlxuICAgICAgKTtcbiAgICB9LFxuICAgIFtkaXNwbGF5VG9rZW5MaXN0LCBvblNlbGVjdFRvZ2dsZSwgb25Ub2tlbkNoYW5nZV0sXG4gICk7XG5cbiAgY29uc3QgcmVuZGVyVG9rZW5MYWJlbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoXG4gICAgICAhc2VsZWN0ZWRUb2tlbiB8fFxuICAgICAgKCFoYXNVbmNvbmZpcm1lZEJUQ0JhbGFuY2Uoc2VsZWN0ZWRUb2tlbikgJiZcbiAgICAgICAgIWlzQXZheFdpdGhVbmF2YWlsYWJsZUJhbGFuY2Uoc2VsZWN0ZWRUb2tlbikpXG4gICAgKSB7XG4gICAgICByZXR1cm4gYCR7dCgnQmFsYW5jZScpfTogJHtzZWxlY3RlZFRva2VuPy5iYWxhbmNlRGlzcGxheVZhbHVlID8/ICcwJ31gO1xuICAgIH1cblxuICAgIGlmIChoYXNVbmNvbmZpcm1lZEJUQ0JhbGFuY2Uoc2VsZWN0ZWRUb2tlbikpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgeyEhc2VsZWN0ZWRUb2tlbj8udW5jb25maXJtZWRCYWxhbmNlICYmIChcbiAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcFwiXG4gICAgICAgICAgICAgIHRpdGxlPXtgJHt0KCdVbmF2YWlsYWJsZScpfTogJHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFRva2VuPy51bmNvbmZpcm1lZEJhbGFuY2VEaXNwbGF5VmFsdWVcbiAgICAgICAgICAgICAgfSAke3NlbGVjdGVkVG9rZW4/LnN5bWJvbH1gfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8SW5mb0NpcmNsZUljb24gc3g9e3sgbXI6IDAuNSwgY3Vyc29yOiAncG9pbnRlcicgfX0gLz5cbiAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHt0KCdBdmFpbGFibGUgQmFsYW5jZScpfToge3NlbGVjdGVkVG9rZW4/LmJhbGFuY2VEaXNwbGF5VmFsdWUgPz8gJzAnfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoaXNBdmF4V2l0aFVuYXZhaWxhYmxlQmFsYW5jZShzZWxlY3RlZFRva2VuKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICB7ISFzZWxlY3RlZFRva2VuPy5iYWxhbmNlICYmIChcbiAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcFwiXG4gICAgICAgICAgICAgIHRpdGxlPXtgJHt0KCdUb3RhbCBCYWxhbmNlJyl9OiAke1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkVG9rZW4/LmJhbGFuY2VEaXNwbGF5VmFsdWVcbiAgICAgICAgICAgICAgfSAke3NlbGVjdGVkVG9rZW4/LnN5bWJvbH1gfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8SW5mb0NpcmNsZUljb24gc3g9e3sgbXI6IDAuNSwgY3Vyc29yOiAncG9pbnRlcicgfX0gLz5cbiAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHt0KCdTcGVuZGFibGUgQmFsYW5jZScpfTp7JyAnfVxuICAgICAgICAgIHtzZWxlY3RlZFRva2VuPy5hdmFpbGFibGVEaXNwbGF5VmFsdWUgPz8gJzAnfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgKTtcbiAgICB9XG4gIH0sIFtzZWxlY3RlZFRva2VuLCB0XSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcsXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICBwYWRkaW5nLFxuICAgICAgICAgIG06ICgpID0+ICghcGFkZGluZyA/ICcwIDAgOHB4JyA6ICcwJyksXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGZvbnRXZWlnaHQ9XCJmb250V2VpZ2h0U2VtaWJvbGRcIj5cbiAgICAgICAgICB7bGFiZWwgPz8gdCgnVG9rZW4nKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIHN4PXt7IGNvbG9yOiAndGV4dC5zZWNvbmRhcnknIH19PlxuICAgICAgICAgIHtyZW5kZXJUb2tlbkxhYmVsKCl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvU3RhY2s+XG4gICAgICA8U2VsZWN0Q29udGFpbmVyPlxuICAgICAgICA8SW5wdXRDb250YWluZXJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInRva2VuLXNlbGVjdG9yLWRyb3Bkb3duXCJcbiAgICAgICAgICByZWY9e3NlbGVjdEJ1dHRvblJlZn1cbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBwYWRkaW5nLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBpc09wZW4gPyAnOHB4IDhweCAwIDAnIDogJzhweCcsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUb2tlblNlbGVjdG9yXG4gICAgICAgICAgICBvbkNsaWNrPXtvblNlbGVjdFRvZ2dsZX1cbiAgICAgICAgICAgIGlzT3Blbj17aXNPcGVufVxuICAgICAgICAgICAgdG9rZW49e1xuICAgICAgICAgICAgICBzZWxlY3RlZFRva2VuXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHNlbGVjdGVkVG9rZW4/LnN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogKFxuICAgICAgICAgICAgICAgICAgICAgIDxUb2tlbkljb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMzJweFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIzMnB4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17c2VsZWN0ZWRUb2tlbj8ubG9nb1VyaX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e3NlbGVjdGVkVG9rZW4/Lm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhpZGVDYXJldEljb249e2hpZGVUb2tlbkRyb3Bkb3dufVxuICAgICAgICAgICAgbGFiZWw9e3NlbGVjdG9yTGFiZWwgPz8gdCgnU2VsZWN0IFRva2VuJyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Qk5JbnB1dFxuICAgICAgICAgICAgdmFsdWU9e1xuICAgICAgICAgICAgICBpc01heEFtb3VudCAmJiAhc2tpcEhhbmRsZU1heEFtb3VudFxuICAgICAgICAgICAgICAgID8gbWF4QW1vdW50IHx8IGlucHV0QW1vdW50XG4gICAgICAgICAgICAgICAgOiBpbnB1dEFtb3VudFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVub21pbmF0aW9uPXtkZWNpbWFsc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVBbW91bnRDaGFuZ2V9XG4gICAgICAgICAgICBpc1ZhbHVlTG9hZGluZz17aXNWYWx1ZUxvYWRpbmd9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInRva2VuLWFtb3VudC1pbnB1dFwiXG4gICAgICAgICAgICBtYXg9e1xuICAgICAgICAgICAgICAhaXNWYWx1ZUxvYWRpbmcgPyBtYXhBbW91bnQgfHwgc2VsZWN0ZWRUb2tlbj8uYmFsYW5jZSA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2l0aE1heEJ1dHRvbj17d2l0aE1heEJ1dHRvbn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0lucHV0Q29udGFpbmVyPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgcGFkZGluZyxcbiAgICAgICAgICAgIG06ICgpID0+ICghcGFkZGluZyA/ICc0cHggMCAwIDAnIDogJzAnKSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAodGhlbWUpID0+IHRoZW1lLnBhbGV0dGUuZXJyb3IubWFpbiB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtoaWRlRXJyb3JNZXNzYWdlID8gJycgOiBlcnJvcn1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IG1pbkhlaWdodDogJzE0cHgnIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIiBzeD17eyBjb2xvcjogJ3RleHQuc2Vjb25kYXJ5JyB9fT5cbiAgICAgICAgICAgICAge2Ftb3VudEluQ3VycmVuY3lcbiAgICAgICAgICAgICAgICA/IGAke2Ftb3VudEluQ3VycmVuY3kucmVwbGFjZShjdXJyZW5jeSwgJycpfSAke2N1cnJlbmN5fWBcbiAgICAgICAgICAgICAgICA6IGAke2N1cnJlbmN5Rm9ybWF0dGVyKDApLnJlcGxhY2UoY3VycmVuY3ksICcnKX0gJHtjdXJyZW5jeX1gfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgeyFoaWRlVG9rZW5Ecm9wZG93biAmJiAoXG4gICAgICAgICAgPENvbnRhaW5lZERyb3Bkb3duXG4gICAgICAgICAgICBhbmNob3JFbD17c2VsZWN0QnV0dG9uUmVmfVxuICAgICAgICAgICAgaXNPcGVuPXtpc09wZW59XG4gICAgICAgICAgICBzZXRJc09wZW49e3NldElzT3Blbn1cbiAgICAgICAgICAgIGNvbnRhaW5lclJlZj17Y29udGFpbmVyUmVmfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxEcm9wZG93bkNvbnRlbnRzPlxuICAgICAgICAgICAgICA8RGl2aWRlciBzeD17eyBteDogMiwgbXQ6IDEgfX0gLz5cbiAgICAgICAgICAgICAgPFNlYXJjaElucHV0Q29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxTZWFyY2hCYXJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZTogQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+XG4gICAgICAgICAgICAgICAgICAgIHNldFNlYXJjaFF1ZXJ5KGUuY3VycmVudFRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0KCdTZWFyY2gnKX1cbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIG15OiAyLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VhcmNoLWlucHV0XCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L1NlYXJjaElucHV0Q29udGFpbmVyPlxuICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGZsZXhHcm93OiAxIH19PlxuICAgICAgICAgICAgICAgIDxBdXRvU2l6ZXI+XG4gICAgICAgICAgICAgICAgICB7KHsgaGVpZ2h0LCB3aWR0aCB9KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxWaXJ0dWFsaXplZExpc3RcbiAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgICAgICAgICAgICByb3dDb3VudD17ZGlzcGxheVRva2VuTGlzdC5sZW5ndGh9XG4gICAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0PXs0OH1cbiAgICAgICAgICAgICAgICAgICAgICByb3dSZW5kZXJlcj17cm93UmVuZGVyZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L0F1dG9TaXplcj5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDwvRHJvcGRvd25Db250ZW50cz5cbiAgICAgICAgICA8L0NvbnRhaW5lZERyb3Bkb3duPlxuICAgICAgICApfVxuICAgICAgPC9TZWxlY3RDb250YWluZXI+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IFRva2VuRWxsaXBzaXMgfSBmcm9tICcuL1Rva2VuRWxsaXBzaXMnO1xuaW1wb3J0IHtcbiAgVHlwb2dyYXBoeSxcbiAgQ2hldnJvbkRvd25JY29uLFxuICBTdGFjayxcbiAgQ2hldnJvblVwSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW4ge1xuICBpY29uPzogSlNYLkVsZW1lbnQ7XG4gIG5hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW5TZWxlY3RvclByb3BzIHtcbiAgdG9rZW4/OiBUb2tlbiB8IG51bGw7XG4gIG9uQ2xpY2s/OiAoKSA9PiB2b2lkO1xuICBpc09wZW4/OiBib29sZWFuO1xuICBoaWRlQ2FyZXRJY29uPzogYm9vbGVhbjtcbiAgbGFiZWw/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUb2tlblNlbGVjdG9yKHtcbiAgdG9rZW4sXG4gIG9uQ2xpY2ssXG4gIGlzT3BlbixcbiAgaGlkZUNhcmV0SWNvbixcbiAgbGFiZWwsXG59OiBUb2tlblNlbGVjdG9yUHJvcHMpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgb25DbGljaz17aGlkZUNhcmV0SWNvbiA/IHVuZGVmaW5lZCA6IG9uQ2xpY2t9XG4gICAgICBzeD17e1xuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgIGN1cnNvcjogaGlkZUNhcmV0SWNvbiA/ICdkZWZhdWx0JyA6ICdwb2ludGVyJyxcbiAgICAgICAgcHI6IDIsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHshdG9rZW4gJiYgKFxuICAgICAgICA8PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IG1yOiAxIH19IGZvbnRXZWlnaHQ9ezYwMH0+XG4gICAgICAgICAgICB7bGFiZWwgfHwgdCgnU2VsZWN0Jyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIHtpc09wZW4gPyA8Q2hldnJvblVwSWNvbiAvPiA6IDxDaGV2cm9uRG93bkljb24gLz59XG4gICAgICAgIDwvPlxuICAgICAgKX1cbiAgICAgIHt0b2tlbiAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAge3Rva2VuLmljb259XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgbXg6IDEgfX0gZm9udFdlaWdodD17NjAwfT5cbiAgICAgICAgICAgIDxUb2tlbkVsbGlwc2lzXG4gICAgICAgICAgICAgIG1heExlbmd0aD17N31cbiAgICAgICAgICAgICAgdGV4dD17dG9rZW4ubmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgc3g9e3sgY3Vyc29yOiBoaWRlQ2FyZXRJY29uID8gJ2RlZmF1bHQnIDogJ3BvaW50ZXInIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICB7IWhpZGVDYXJldEljb24gPyAoXG4gICAgICAgICAgICBpc09wZW4gPyAoXG4gICAgICAgICAgICAgIDxDaGV2cm9uVXBJY29uIC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8Q2hldnJvbkRvd25JY29uIC8+XG4gICAgICAgICAgICApXG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvPlxuICAgICAgKX1cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IExpc3QgfSBmcm9tICdyZWFjdC12aXJ0dWFsaXplZCc7XG5cbmNvbnN0IFZpcnR1YWxpemVkTGlzdCA9IHN0eWxlZChMaXN0KWBcbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIHdpZHRoOiA2cHg7XG4gIH1cbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJhY2tncm91bmQ6ICR7KHsgdGhlbWUgfSkgPT4gdGhlbWUucGFsZXR0ZS5kaXZpZGVyfTtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIH1cbmA7XG5leHBvcnQgZGVmYXVsdCBWaXJ0dWFsaXplZExpc3Q7XG4iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEJpZyBmcm9tICdiaWcuanMnO1xuaW1wb3J0IHsgcGFydGl0aW9uIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IG5vcm1hbGl6ZUJhbGFuY2UgfSBmcm9tICdAc3JjL3V0aWxzL25vcm1hbGl6ZUJhbGFuY2UnO1xuaW1wb3J0IHsgVG9rZW5XaXRoQmFsYW5jZSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyBpc05GVCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9iYWxhbmNlcy9uZnQvdXRpbHMvaXNORlQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIERpc3BsYXlUb2tlbiB7XG4gIG5hbWU6IHN0cmluZztcbiAgc3ltYm9sOiBzdHJpbmc7XG4gIGRpc3BsYXlWYWx1ZTogc3RyaW5nO1xuICB0b2tlbjogVG9rZW5XaXRoQmFsYW5jZTtcbiAgZGVjaW1hbHM6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURpc3BsYXl0b2tlbmxpc3QgPSAoe1xuICB0b2tlbnNMaXN0LFxuICBzZWFyY2hRdWVyeSxcbn06IHtcbiAgdG9rZW5zTGlzdD86IFRva2VuV2l0aEJhbGFuY2VbXTtcbiAgc2VhcmNoUXVlcnk6IHN0cmluZztcbn0pID0+IHtcbiAgY29uc3QgZGlzcGxheVRva2VuTGlzdDogRGlzcGxheVRva2VuW10gPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBpbml0aWFsTGlzdCA9ICh0b2tlbnNMaXN0ID8/IFtdKVxuICAgICAgLmZpbHRlcigodG9rZW4pID0+XG4gICAgICAgIHNlYXJjaFF1ZXJ5Lmxlbmd0aFxuICAgICAgICAgID8gdG9rZW4ubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFF1ZXJ5LnRvTG93ZXJDYXNlKCkpIHx8XG4gICAgICAgICAgICB0b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgIDogdHJ1ZSxcbiAgICAgIClcbiAgICAgIC5tYXAoKHRva2VuKTogRGlzcGxheVRva2VuID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiB0b2tlbi5uYW1lLFxuICAgICAgICAgIHN5bWJvbDogdG9rZW4uc3ltYm9sLFxuICAgICAgICAgIGRpc3BsYXlWYWx1ZTogdG9rZW4uYmFsYW5jZURpc3BsYXlWYWx1ZSA/PyAnJyxcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICBkZWNpbWFsczogaXNORlQodG9rZW4pID8gMCA6IHRva2VuLmRlY2ltYWxzLFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICBjb25zdCBbdG9rZW5zV2l0aEJhbGFuY2UsIHRva2Vuc1dpdGhvdXRCYWxhbmNlXTogRGlzcGxheVRva2VuW11bXSA9XG4gICAgICBwYXJ0aXRpb24oaW5pdGlhbExpc3QsICh0b2tlbikgPT4ge1xuICAgICAgICBjb25zdCBiYWxhbmNlID0gbm9ybWFsaXplQmFsYW5jZSh0b2tlbi50b2tlbi5iYWxhbmNlLCB0b2tlbi5kZWNpbWFscyk7XG5cbiAgICAgICAgcmV0dXJuIGJhbGFuY2UgPyBiYWxhbmNlLmd0KG5ldyBCaWcoMCkpIDogZmFsc2U7XG4gICAgICB9KTtcblxuICAgIC8vIFNvcnRpbmcgc3BlY2lmaWNhdGlvbiBwZXI6IGh0dHBzOi8vYXZhLWxhYnMuYXRsYXNzaWFuLm5ldC9icm93c2UvQ1AtNzc2OFxuICAgIC8vIEZpcnN0IHBhcnQgb2YgdGhlIGxpc3Qgc2hvdWxkIGJlIHRva2VucyB3aXRoIGEgYmFsYW5jZSBzb3J0ZWQgYnkgYmFsYW5jZSAoZGVzY2VuZGluZylcbiAgICAvLyBTZWNvbmQgcGFydCBvZiB0aGUgbGlzdCBzaG91bGQgYmUgYWxsIG5vIGJhbGFuY2UgYXNzZXRzIGluIG9yZGVyIGFscGhhYmV0aWNhbGx5XG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLnRva2Vuc1dpdGhCYWxhbmNlLnNvcnQoKHRva2VuT25lLCB0b2tlblR3bykgPT4ge1xuICAgICAgICBjb25zdCBmaXJzdEJhbGFuY2UgPVxuICAgICAgICAgIG5vcm1hbGl6ZUJhbGFuY2UodG9rZW5PbmUudG9rZW4uYmFsYW5jZSwgdG9rZW5PbmUuZGVjaW1hbHMpID8/XG4gICAgICAgICAgbmV3IEJpZygwKTtcblxuICAgICAgICBjb25zdCBzZWNvbmRCYWxhbmNlID1cbiAgICAgICAgICBub3JtYWxpemVCYWxhbmNlKHRva2VuVHdvLnRva2VuLmJhbGFuY2UsIHRva2VuVHdvLmRlY2ltYWxzKSA/P1xuICAgICAgICAgIG5ldyBCaWcoMCk7XG5cbiAgICAgICAgY29uc3QgY29tcGFyaXNvbiA9IGZpcnN0QmFsYW5jZS5jbXAoc2Vjb25kQmFsYW5jZSk7XG4gICAgICAgIGlmIChjb21wYXJpc29uKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbXBhcmlzb24gKiAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9rZW5PbmUubmFtZS5sb2NhbGVDb21wYXJlKHRva2VuVHdvLm5hbWUpO1xuICAgICAgfSksXG4gICAgICAuLi50b2tlbnNXaXRob3V0QmFsYW5jZS5zb3J0KCh0b2tlbk9uZSwgdG9rZW5Ud28pID0+IHtcbiAgICAgICAgcmV0dXJuIHRva2VuT25lLm5hbWUubG9jYWxlQ29tcGFyZSh0b2tlblR3by5uYW1lKTtcbiAgICAgIH0pLFxuICAgIF07XG4gIH0sIFt0b2tlbnNMaXN0LCBzZWFyY2hRdWVyeV0pO1xuICByZXR1cm4gZGlzcGxheVRva2VuTGlzdDtcbn07XG4iLCJpbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNlbmRBbmFseXRpY3NEYXRhKCkge1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3Qgc2VuZFRva2VuU2VsZWN0ZWRBbmFseXRpY3MgPSB1c2VDYWxsYmFjayhcbiAgICAoZnVuY3Rpb25hbGl0eTogc3RyaW5nKSA9PiB7XG4gICAgICBjYXB0dXJlKGAke2Z1bmN0aW9uYWxpdHl9X1Rva2VuU2VsZWN0ZWRgKTtcbiAgICB9LFxuICAgIFtjYXB0dXJlXSxcbiAgKTtcbiAgY29uc3Qgc2VuZEFtb3VudEVudGVyZWRBbmFseXRpY3MgPSB1c2VDYWxsYmFjayhcbiAgICAoZnVuY3Rpb25hbGl0eTogc3RyaW5nKSA9PiB7XG4gICAgICBjYXB0dXJlKGAke2Z1bmN0aW9uYWxpdHl9X0Ftb3VudEVudGVyZWRgKTtcbiAgICB9LFxuICAgIFtjYXB0dXJlXSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHNlbmRUb2tlblNlbGVjdGVkQW5hbHl0aWNzLFxuICAgIHNlbmRBbW91bnRFbnRlcmVkQW5hbHl0aWNzLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgYm5Ub0JpZyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtdXRpbHMtc2RrJztcbmltcG9ydCBCaWcgZnJvbSAnYmlnLmpzJztcbmltcG9ydCB7IEJOIH0gZnJvbSAnYm4uanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYmlnaW50VG9CaWcoYW1vdW50OiBiaWdpbnQsIGRlbm9taW5hdGlvbjogbnVtYmVyKTogQmlnIHtcbiAgcmV0dXJuIGJuVG9CaWcobmV3IEJOKGFtb3VudC50b1N0cmluZygpKSwgZGVub21pbmF0aW9uKTtcbn1cbiIsImltcG9ydCB7IGJuVG9CaWcgfSBmcm9tICdAYXZhbGFicy9jb3JlLXV0aWxzLXNkayc7XG5pbXBvcnQgdHlwZSBCaWcgZnJvbSAnYmlnLmpzJztcbmltcG9ydCB7IGlzQk4gfSBmcm9tICdibi5qcyc7XG5pbXBvcnQgdHlwZSBCTiBmcm9tICdibi5qcyc7XG5cbmltcG9ydCB7IGJpZ2ludFRvQmlnIH0gZnJvbSAnLi9iaWdpbnRUb0JpZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVCYWxhbmNlKFxuICBiYWxhbmNlOiBCTiB8IEJpZyB8IGJpZ2ludCB8IHVuZGVmaW5lZCxcbiAgZGVjaW1hbHM6IG51bWJlcixcbik6IEJpZyB8IHVuZGVmaW5lZCB7XG4gIGlmIChpc0JOKGJhbGFuY2UpKSB7XG4gICAgcmV0dXJuIGJuVG9CaWcoYmFsYW5jZSwgZGVjaW1hbHMpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBiYWxhbmNlID09PSAnYmlnaW50Jykge1xuICAgIHJldHVybiBiaWdpbnRUb0JpZyhiYWxhbmNlLCBkZWNpbWFscyk7XG4gIH1cblxuICByZXR1cm4gYmFsYW5jZTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJhc3NldHMvZGVkNzJkMWVhOTVlOWMxY2ZmMTE5M2ZmNzRkNTliZjMucG5nXCI7Il0sIm5hbWVzIjpbIlRva2VuVHlwZSIsImlzTmZ0VG9rZW5UeXBlIiwidHlwZSIsIkVSQzcyMSIsIkVSQzExNTUiLCJpc05GVCIsInRva2VuIiwiUmVhY3QiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIlN0YWNrIiwiVGV4dEZpZWxkIiwiSW5wdXRBZG9ybm1lbnQiLCJCdXR0b24iLCJzdHlsZWQiLCJDaXJjdWxhclByb2dyZXNzIiwiYmlnSW50VG9TdHJpbmciLCJzdHJpbmdUb0JpZ2ludCIsIklucHV0TnVtYmVyIiwic3BsaXRWYWx1ZSIsInZhbCIsImluY2x1ZGVzIiwic3BsaXQiLCJCTklucHV0IiwidmFsdWUiLCJkZW5vbWluYXRpb24iLCJvbkNoYW5nZSIsIm1pbiIsIm1heCIsImlzVmFsdWVMb2FkaW5nIiwiZXJyb3IiLCJkaXNhYmxlZCIsImZ1bGxXaWR0aCIsIndpdGhNYXhCdXR0b24iLCJwcm9wcyIsInZhbFN0ciIsInNldFZhbFN0ciIsInVuZGVmaW5lZCIsIk51bWJlciIsInZhbHVlQXNTdHJpbmciLCJvbGRWYWx1ZSIsIm9uVmFsdWVDaGFuZ2VkIiwibmV3VmFsdWVTdHJpbmciLCJlbmRWYWx1ZSIsImxlbmd0aCIsIm5ld1ZhbHVlIiwiYW1vdW50IiwiYmlnaW50Iiwic2V0TWF4IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsImlzTWF4QnRuVmlzaWJsZSIsImNyZWF0ZUVsZW1lbnQiLCJzeCIsInBvc2l0aW9uIiwiX2V4dGVuZHMiLCJyZXBsYWNlQWxsIiwidGFyZ2V0Iiwib25LZXlEb3duIiwiY29kZSIsImtleSIsInByZXZlbnREZWZhdWx0Iiwib25DbGljayIsIm9uV2hlZWwiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJibHVyIiwicGxhY2Vob2xkZXIiLCJ3aWR0aCIsIklucHV0UHJvcHMiLCJlbmRBZG9ybm1lbnQiLCJzaXplIiwiaGVpZ2h0IiwidmFyaWFudCIsInAiLCJqdXN0aWZ5Q29udGVudCIsImlucHV0TW9kZSIsInB5IiwicHgiLCJCYWxhbmNlQ29sdW1uIiwidXNlVGhlbWUiLCJmb3J3YXJkUmVmIiwidXNlUmVmIiwiQk9UVE9NX1BBRERJTkciLCJnZXREcm9wZG93bkhlaWdodCIsImFuY2hvckVsIiwiY29udGFpbmVyUmVmIiwiY3VycmVudCIsIndpbmRvdyIsInZpc3VhbFZpZXdwb3J0IiwiYW5jaG9yVG9wIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwib2Zmc2V0SGVpZ2h0IiwiYm90dG9tIiwiZ2V0T2Zmc2V0VG9wIiwib2Zmc2V0VG9wIiwiRHJvcGRvd24iLCJyZWYiLCJvdmVyZmxvd1kiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ6SW5kZXgiLCJ0cmFuc2l0aW9uIiwicmlnaHQiLCJkaXNwbGF5TmFtZSIsIkNvbnRhaW5lZERyb3Bkb3duIiwiY2hpbGRyZW4iLCJpc09wZW4iLCJtYXJnaW4iLCJib3JkZXJSYWRpdXMiLCJzZXRJc09wZW4iLCJjYWxjdWxhdGVkSGVpZ2h0IiwiY29udGFpbmVyIiwic3BhY2luZyIsImhhbmRsZUNsaWNrT3V0c2lkZSIsImFuY2hvckVsZW1lbnRDbGlja2VkIiwiY29udGFpbnMiLCJjb250YWluZXJDbGlja2VkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvcGFjaXR5IiwiQ2hldnJvbkRvd25JY29uIiwiTWVudUl0ZW0iLCJTZWxlY3QiLCJUcmlnZ2VySWNvbiIsInJlc3QiLCJ0aGVtZSIsInRyYW5zZm9ybSIsInVzZURyb3Bkb3duUHJvcHMiLCJpbnB1dFN4Iiwib3RoZXJJbnB1dFByb3BzIiwiU2VsZWN0UHJvcHMiLCJNZW51UHJvcHMiLCJQYXBlclByb3BzIiwicGFwZXJTeCIsIm90aGVyUGFwZXJQcm9wcyIsIm90aGVyTWVudVByb3BzIiwib3RoZXJTZWxlY3RQcm9wcyIsInBhZGRpbmciLCJib3JkZXIiLCJwYWxldHRlIiwiZ3JleSIsImZvbnRTaXplIiwidHlwb2dyYXBoeSIsImJvZHkxIiwiSWNvbkNvbXBvbmVudCIsIm1heFdpZHRoIiwibWF4SGVpZ2h0IiwibXQiLCJpbnB1dExhYmVsUHJvcHMiLCJib2R5MiIsIkRyb3Bkb3duSXRlbSIsIm1pbkhlaWdodCIsImdhcCIsIlBhZ2VUaXRsZSIsIlBhZ2VUaXRsZVZhcmlhbnQiLCJ0IiwidHJhbnNsYXRlIiwiQWxlcnRDaXJjbGVJY29uIiwiVHlwb2dyYXBoeSIsInVzZVRyYW5zbGF0aW9uIiwiRnVuY3Rpb25OYW1lcyIsImdldFRyYW5zbGF0ZWRGdW5jdGlvbk5hbWUiLCJuYW1lIiwidHJhbnNsYXRpb25zIiwiQlJJREdFIiwiU1dBUCIsIlNFTkQiLCJCVVkiLCJERUZJIiwiS0VZU1RPTkUiLCJUT0tFTl9ERVRBSUxTIiwiRnVuY3Rpb25Jc09mZmxpbmUiLCJmdW5jdGlvbk5hbWUiLCJoaWRlUGFnZVRpdGxlIiwiUFJJTUFSWSIsImFsaWduSXRlbXMiLCJmbGV4R3JvdyIsIm1iIiwiYWxpZ24iLCJjb2xvciIsIlRvb2x0aXAiLCJ0cnVuY2F0ZUFkZHJlc3MiLCJpc1RydW5jYXRlZCIsIm1heExlbmd0aCIsInRleHQiLCJUb2tlbkVsbGlwc2lzIiwiY2xhc3NOYW1lIiwicGxhY2VtZW50IiwidGl0bGUiLCJkaXNhYmxlSG92ZXJMaXN0ZW5lciIsImRpc2FibGVGb2N1c0xpc3RlbmVyIiwiY3Vyc29yIiwiRnJhZ21lbnQiLCJ1c2VDYWxsYmFjayIsInVzZU1lbW8iLCJ1c2VTZXR0aW5nc0NvbnRleHQiLCJFdGhMb2dvIiwiaGFzVW5jb25maXJtZWRCVENCYWxhbmNlIiwiaXNBdmF4V2l0aFVuYXZhaWxhYmxlQmFsYW5jZSIsImJpZ1RvTG9jYWxlU3RyaW5nIiwiVG9rZW5Vbml0IiwiQXV0b1NpemVyIiwiVmlydHVhbGl6ZWRMaXN0IiwiSW5mb0NpcmNsZUljb24iLCJEaXZpZGVyIiwiQ2FyZCIsIlNlYXJjaEJhciIsIlRva2VuU2VsZWN0b3IiLCJ1c2VEaXNwbGF5dG9rZW5saXN0IiwiVG9rZW5JY29uIiwiYmlnaW50VG9CaWciLCJJbnB1dENvbnRhaW5lciIsIlNlbGVjdENvbnRhaW5lciIsIkRyb3Bkb3duQ29udGVudHMiLCJTZWFyY2hJbnB1dENvbnRhaW5lciIsIlN0eWxlZERyb3Bkb3duTWVudUl0ZW0iLCJUb2tlblNlbGVjdCIsInNlbGVjdGVkVG9rZW4iLCJvblRva2VuQ2hhbmdlIiwidG9rZW5zTGlzdCIsIm1heEFtb3VudCIsImlucHV0QW1vdW50Iiwib25JbnB1dEFtb3VudENoYW5nZSIsIm9uU2VsZWN0VG9nZ2xlIiwibGFiZWwiLCJzZWxlY3RvckxhYmVsIiwiaGlkZUVycm9yTWVzc2FnZSIsInNraXBIYW5kbGVNYXhBbW91bnQiLCJ3aXRoT25seVRva2VuUHJlc2VsZWN0IiwiY3VycmVuY3lGb3JtYXR0ZXIiLCJjdXJyZW5jeSIsInNlbGVjdEJ1dHRvblJlZiIsInNlYXJjaFF1ZXJ5Iiwic2V0U2VhcmNoUXVlcnkiLCJhbW91bnRJbkN1cnJlbmN5Iiwic2V0QW1vdW50SW5DdXJyZW5jeSIsImRlY2ltYWxzIiwibWF4QW1vdW50U3RyaW5nIiwidG9EaXNwbGF5IiwiaXNNYXhBbW91bnQiLCJzZXRJc01heEFtb3VudCIsImhhbmRsZUFtb3VudENoYW5nZSIsImhpZGVUb2tlbkRyb3Bkb3duIiwiZGlzcGxheVRva2VuTGlzdCIsImZvcm1hdHRlZEFtb3VudCIsInByaWNlIiwicHJpY2VJbkN1cnJlbmN5IiwicGFyc2VGbG9hdCIsInJlcGxhY2UiLCJoYXNPbmx5T25lVG9rZW4iLCJ0aGVPbmx5VG9rZW4iLCJpc09ubHlUb2tlbk5vdFNlbGVjdGVkIiwic3ltYm9sIiwic3VwcG9ydGVkU3ltYm9scyIsImZsYXRNYXAiLCJ0b2siLCJyb3dSZW5kZXJlciIsImluZGV4Iiwic3R5bGUiLCJmbGV4RGlyZWN0aW9uIiwic3JjIiwibG9nb1VyaSIsIm1sIiwiZGlzcGxheVZhbHVlIiwicmVuZGVyVG9rZW5MYWJlbCIsImJhbGFuY2VEaXNwbGF5VmFsdWUiLCJ1bmNvbmZpcm1lZEJhbGFuY2UiLCJ1bmNvbmZpcm1lZEJhbGFuY2VEaXNwbGF5VmFsdWUiLCJtciIsImJhbGFuY2UiLCJhdmFpbGFibGVEaXNwbGF5VmFsdWUiLCJtIiwiZm9udFdlaWdodCIsImljb24iLCJoaWRlQ2FyZXRJY29uIiwibWFpbiIsIm14IiwiY3VycmVudFRhcmdldCIsIm15Iiwicm93Q291bnQiLCJyb3dIZWlnaHQiLCJDaGV2cm9uVXBJY29uIiwicHIiLCJMaXN0IiwiZGl2aWRlciIsIkJpZyIsInBhcnRpdGlvbiIsIm5vcm1hbGl6ZUJhbGFuY2UiLCJpbml0aWFsTGlzdCIsImZpbHRlciIsInRvTG93ZXJDYXNlIiwibWFwIiwidG9rZW5zV2l0aEJhbGFuY2UiLCJ0b2tlbnNXaXRob3V0QmFsYW5jZSIsImd0Iiwic29ydCIsInRva2VuT25lIiwidG9rZW5Ud28iLCJmaXJzdEJhbGFuY2UiLCJzZWNvbmRCYWxhbmNlIiwiY29tcGFyaXNvbiIsImNtcCIsImxvY2FsZUNvbXBhcmUiLCJ1c2VBbmFseXRpY3NDb250ZXh0IiwidXNlU2VuZEFuYWx5dGljc0RhdGEiLCJjYXB0dXJlIiwic2VuZFRva2VuU2VsZWN0ZWRBbmFseXRpY3MiLCJmdW5jdGlvbmFsaXR5Iiwic2VuZEFtb3VudEVudGVyZWRBbmFseXRpY3MiLCJiblRvQmlnIiwiQk4iLCJ0b1N0cmluZyIsImlzQk4iXSwic291cmNlUm9vdCI6IiJ9