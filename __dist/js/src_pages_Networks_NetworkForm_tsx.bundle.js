"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Networks_NetworkForm_tsx"],{

/***/ "./src/background/services/network/utils/isValidHttpHeader.ts":
/*!********************************************************************!*\
  !*** ./src/background/services/network/utils/isValidHttpHeader.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isValidHttpHeader": () => (/* binding */ isValidHttpHeader)
/* harmony export */ });
const isValidHttpHeader = (name, value) => {
  try {
    new Headers({
      [name]: value
    });
    return true;
  } catch {
    return false;
  }
};

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

/***/ "./src/pages/Networks/NetworkForm.tsx":
/*!********************************************!*\
  !*** ./src/pages/Networks/NetworkForm.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkForm": () => (/* binding */ NetworkForm),
/* harmony export */   "NetworkFormAction": () => (/* binding */ NetworkFormAction)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/TextFieldLabel */ "./src/components/common/TextFieldLabel.tsx");
/* harmony import */ var _NetworkRpcHeadersManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NetworkRpcHeadersManager */ "./src/pages/Networks/NetworkRpcHeadersManager.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






let NetworkFormAction = /*#__PURE__*/function (NetworkFormAction) {
  NetworkFormAction["Add"] = "add";
  NetworkFormAction["Edit"] = "edit";
  return NetworkFormAction;
}({});
const InputContainer = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack)`
  position: relative;
  overflow: hidden;
  width: 100%;
  gap: 4px;
  min-height: 92px;
`;
const isValidURL = text => {
  let url;
  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }
  if (url.protocol === 'https:' || url.protocol === 'ipfs:' || url.protocol === 'http:') {
    return true;
  }
};
const NetworkForm = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({
  customNetwork,
  handleChange,
  handleRpcHeadersChange,
  readOnly = false,
  showErrors = false,
  action,
  isCustomNetwork = false,
  handleResetUrl
}, ref) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    isChainIdExist
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_1__.useNetworkContext)();
  const [rpcError, setRpcError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [chainNameError, setChainNameError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [chainIdError, setChainIdError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [tokenSymbolError, setTokenSymbolError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [explorerUrlError, setExplorerUrlError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [tokenNameError, setTokenNameError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle)(ref, () => {
    return {
      resetFormErrors: resetErrors
    };
  }, []);
  const FormErrors = {
    RPC_ERROR: t('RPC required'),
    CHAIN_NAME_ERROR: t('Network Name is required'),
    CHAIN_ID_ERROR: t('Chain ID is required'),
    TOKEN_SYMBOL_ERROR: t('Network Token Symbol is required'),
    CHAIN_ID_EXISTS: t('This Chain ID has been added already'),
    INVALID_URL: t('This URL is invalid'),
    TOKEN_NAME_ERROR: t('Network Token Name is required')
  };
  const validateForm = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(updatedNetwork => {
    let valid = true;
    if (!updatedNetwork.rpcUrl) {
      setRpcError(FormErrors.RPC_ERROR);
      valid = false;
    }
    if (updatedNetwork.rpcUrl && !isValidURL(updatedNetwork.rpcUrl)) {
      setRpcError(FormErrors.INVALID_URL);
      valid = false;
    }
    if (!updatedNetwork.chainName) {
      setChainNameError(FormErrors.CHAIN_NAME_ERROR);
      valid = false;
    }
    if (!updatedNetwork.chainId || updatedNetwork.chainId === 0) {
      setChainIdError(FormErrors.CHAIN_ID_ERROR);
      valid = false;
    }
    if (action === NetworkFormAction.Add && isChainIdExist(updatedNetwork.chainId)) {
      setChainIdError(FormErrors.CHAIN_ID_EXISTS);
      valid = false;
    }
    if (!updatedNetwork.networkToken.symbol) {
      setTokenSymbolError(FormErrors.TOKEN_SYMBOL_ERROR);
      valid = false;
    }
    if (!updatedNetwork.networkToken.name) {
      setTokenNameError(FormErrors.TOKEN_NAME_ERROR);
      valid = false;
    }
    return valid;
  }, [FormErrors.CHAIN_ID_ERROR, FormErrors.CHAIN_ID_EXISTS, FormErrors.CHAIN_NAME_ERROR, FormErrors.INVALID_URL, FormErrors.RPC_ERROR, FormErrors.TOKEN_NAME_ERROR, FormErrors.TOKEN_SYMBOL_ERROR, action, isChainIdExist]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (showErrors) {
      validateForm(customNetwork);
    }
  }, [showErrors, customNetwork, validateForm]);
  const resetErrors = () => {
    setRpcError('');
    setChainNameError('');
    setChainIdError('');
    setTokenSymbolError('');
    setExplorerUrlError('');
    setTokenNameError('');
  };
  const handleUpdate = updatedNetwork => {
    resetErrors();
    handleChange?.(updatedNetwork, validateForm(updatedNetwork));
  };
  const canResetRpcUrl = handleResetUrl && !isCustomNetwork;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(InputContainer, null, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_2__.TextFieldLabel, {
    label: t('Network RPC URL')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TextField, {
    size: "small",
    onChange: e => {
      e.stopPropagation();
      handleUpdate({
        ...customNetwork,
        rpcUrl: e.target.value
      });
    },
    "data-testid": "network-rpc-url",
    value: customNetwork.rpcUrl,
    placeholder: "http(s)://URL",
    InputProps: {
      readOnly,
      fullWidth: true,
      endAdornment: canResetRpcUrl ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.InputAdornment, {
        position: "end"
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
        variant: "text",
        size: "small",
        onClick: handleResetUrl
      }, t('Reset'))) : null
    },
    error: !!rpcError,
    helperText: rpcError
  })), /*#__PURE__*/React.createElement(InputContainer, null, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_2__.TextFieldLabel, {
    label: t('Network Name')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TextField, {
    size: "small",
    onChange: e => {
      e.stopPropagation();
      handleUpdate({
        ...customNetwork,
        chainName: e.target.value
      });
    },
    "data-testid": "network-name",
    value: customNetwork.chainName,
    placeholder: t('Enter Name'),
    fullWidth: true,
    InputProps: {
      readOnly: readOnly || !isCustomNetwork && action === NetworkFormAction.Edit
    },
    error: !!chainNameError,
    helperText: chainNameError
  })), /*#__PURE__*/React.createElement(InputContainer, null, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_2__.TextFieldLabel, {
    label: t('Chain ID')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TextField, {
    size: "small",
    onChange: e => {
      e.stopPropagation();
      handleUpdate({
        ...customNetwork,
        chainId: parseInt(e.target.value)
      });
    },
    disabled: action === NetworkFormAction.Edit,
    "data-testid": "chain-id",
    value: isNaN(customNetwork.chainId) ? '' : customNetwork.chainId,
    placeholder: t('Enter Chain ID'),
    fullWidth: true,
    InputProps: {
      readOnly: readOnly || !isCustomNetwork && action === NetworkFormAction.Edit
    },
    type: "number",
    error: !!chainIdError,
    helperText: chainIdError
  })), /*#__PURE__*/React.createElement(InputContainer, null, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_2__.TextFieldLabel, {
    label: t('Network Token Symbol')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TextField, {
    size: "small",
    onChange: e => {
      e.stopPropagation();
      handleUpdate({
        ...customNetwork,
        networkToken: {
          ...customNetwork.networkToken,
          symbol: e.target.value
        }
      });
    },
    "data-testid": "network-token-symbol",
    value: customNetwork.networkToken.symbol,
    placeholder: t('Enter Token Symbol'),
    fullWidth: true,
    InputProps: {
      readOnly: readOnly || !isCustomNetwork && action === NetworkFormAction.Edit
    },
    error: !!tokenSymbolError,
    helperText: tokenSymbolError
  })), /*#__PURE__*/React.createElement(InputContainer, null, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_2__.TextFieldLabel, {
    label: t('Network Token Name')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TextField, {
    size: "small",
    onChange: e => {
      e.stopPropagation();
      handleUpdate({
        ...customNetwork,
        networkToken: {
          ...customNetwork.networkToken,
          name: e.target.value
        }
      });
    },
    "data-testid": "network-token-name",
    value: customNetwork.networkToken.name,
    placeholder: t('Enter Token'),
    fullWidth: true,
    InputProps: {
      readOnly: readOnly || !isCustomNetwork && action === NetworkFormAction.Edit
    },
    error: !!tokenNameError,
    helperText: tokenNameError
  })), /*#__PURE__*/React.createElement(InputContainer, null, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_2__.TextFieldLabel, {
    label: t('Explorer URL (Optional)')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TextField, {
    size: "small",
    onChange: e => {
      e.stopPropagation();
      handleUpdate({
        ...customNetwork,
        explorerUrl: e.target.value
      });
    },
    "data-testid": "explorer-url",
    value: customNetwork.explorerUrl,
    placeholder: t('Enter URL'),
    fullWidth: true,
    InputProps: {
      readOnly: readOnly || !isCustomNetwork && action === NetworkFormAction.Edit
    },
    error: !!explorerUrlError,
    helperText: explorerUrlError
  })), /*#__PURE__*/React.createElement(InputContainer, null, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_2__.TextFieldLabel, {
    label: t('Logo URL (Optional)')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TextField, {
    size: "small",
    onChange: e => {
      e.stopPropagation();
      handleUpdate({
        ...customNetwork,
        logoUri: e.target.value
      });
    },
    "data-testid": "logo-url",
    value: customNetwork.logoUri,
    placeholder: t('Enter URL'),
    fullWidth: true,
    InputProps: {
      readOnly: readOnly || !isCustomNetwork && action === NetworkFormAction.Edit
    }
  })), /*#__PURE__*/React.createElement(InputContainer, null, /*#__PURE__*/React.createElement(_src_components_common_TextFieldLabel__WEBPACK_IMPORTED_MODULE_2__.TextFieldLabel, {
    label: t('Custom RPC Headers')
  }), /*#__PURE__*/React.createElement(_NetworkRpcHeadersManager__WEBPACK_IMPORTED_MODULE_3__.NetworkRpcHeadersManager, {
    isReadOnly: readOnly,
    network: customNetwork,
    onChange: handleRpcHeadersChange
  })));
});
NetworkForm.displayName = 'NetworkForm';

/***/ }),

/***/ "./src/pages/Networks/NetworkRpcHeaders.tsx":
/*!**************************************************!*\
  !*** ./src/pages/Networks/NetworkRpcHeaders.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkRpcHeaders": () => (/* binding */ NetworkRpcHeaders)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_background_services_network_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/network/models */ "./src/background/services/network/models.ts");
/* harmony import */ var _src_background_services_network_utils_isValidHttpHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/network/utils/isValidHttpHeader */ "./src/background/services/network/utils/isValidHttpHeader.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






const NetworkRpcHeaders = ({
  isReadOnly,
  rpcHeaders,
  setRpcHeaders
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const updateHeader = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((keyIndex, {
    newName,
    newValue
  }) => {
    setRpcHeaders?.(previous => Object.fromEntries(Object.entries(previous).map(([name, value], index) => {
      if (index === keyIndex) {
        return [newName ?? name, newValue ?? value];
      }
      return [name, value];
    })));
  }, [setRpcHeaders]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 1
    }
  }, Object.entries(rpcHeaders).map(([headerName, headerValue], index) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Grow, {
    in: true,
    key: `rpc-header-${index}`
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    sx: {
      gap: 0.5,
      mb: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TextField, {
    size: "small",
    value: headerName,
    InputProps: {
      readOnly: isReadOnly
    },
    placeholder: t('Header Name'),
    onChange: ev => {
      if (!ev.target.value || (0,_src_background_services_network_utils_isValidHttpHeader__WEBPACK_IMPORTED_MODULE_3__.isValidHttpHeader)(ev.target.value, headerValue)) {
        updateHeader(index, {
          newName: ev.target.value
        });
      }
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TextField, {
    size: "small",
    value: headerValue,
    InputProps: {
      readOnly: isReadOnly
    },
    placeholder: t('Value'),
    onChange: ev => {
      if ((0,_src_background_services_network_utils_isValidHttpHeader__WEBPACK_IMPORTED_MODULE_3__.isValidHttpHeader)(headerName, ev.target.value)) {
        updateHeader(index, {
          newValue: ev.target.value
        });
      }
    }
  }), !isReadOnly && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.IconButton, {
    disabled: headerName === '',
    onClick: () => setRpcHeaders?.(existing => {
      if (Object.keys(existing).length === 1) {
        return _src_background_services_network_models__WEBPACK_IMPORTED_MODULE_2__.PLACEHOLDER_RPC_HEADERS;
      }
      return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.omit)(existing, headerName);
    })
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.TrashIcon, null))))));
};

/***/ }),

/***/ "./src/pages/Networks/NetworkRpcHeadersManager.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/Networks/NetworkRpcHeadersManager.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkRpcHeadersManager": () => (/* binding */ NetworkRpcHeadersManager)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_network_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/network/models */ "./src/background/services/network/models.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _NetworkRpcHeaders__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NetworkRpcHeaders */ "./src/pages/Networks/NetworkRpcHeaders.tsx");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






const NetworkRpcHeadersManager = ({
  isReadOnly,
  network,
  onChange
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const [rpcHeaders, setRpcHeaders] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(network.customRpcHeaders ?? _src_background_services_network_models__WEBPACK_IMPORTED_MODULE_0__.PLACEHOLDER_RPC_HEADERS);
  const [isRpcHeadersManagerVisible, setIsRpcHeadersManagerVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const hasHeadersConfigured = Object.keys(network.customRpcHeaders ?? {}).length > 0;
  const hasEmptyHeader = ('' in rpcHeaders);
  const hasChanged = JSON.stringify(network.customRpcHeaders ?? _src_background_services_network_models__WEBPACK_IMPORTED_MODULE_0__.PLACEHOLDER_RPC_HEADERS) !== JSON.stringify(rpcHeaders);
  return /*#__PURE__*/React.createElement(React.Fragment, null, hasHeadersConfigured && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_NetworkRpcHeaders__WEBPACK_IMPORTED_MODULE_2__.NetworkRpcHeaders, {
    rpcHeaders: rpcHeaders,
    isReadOnly: true
  }), !isReadOnly && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    variant: "text",
    onClick: () => setIsRpcHeadersManagerVisible(true)
  }, t('Edit Custom RPC Headers'))), !hasHeadersConfigured && (isReadOnly ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2",
    color: "text.secondary",
    sx: {
      display: 'flex'
    }
  }, t('No custom headers are configured.')) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2",
    color: "text.secondary",
    sx: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_6__.Trans, {
    i18nKey: 'No custom headers are configured. <button>Edit</button>',
    components: {
      button: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
        variant: "text",
        onClick: () => setIsRpcHeadersManagerVisible(true),
        sx: {
          p: 0
        }
      })
    }
  }))), !isReadOnly && isRpcHeadersManagerVisible && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Dialog, {
    open: isRpcHeadersManagerVisible,
    PaperProps: {
      sx: {
        mx: 2
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.DialogTitle, {
    sx: {
      px: 2
    }
  }, t('Custom RPC Headers')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.DialogContent, {
    sx: {
      pl: 2,
      pr: 1
    }
  }, /*#__PURE__*/React.createElement(_NetworkRpcHeaders__WEBPACK_IMPORTED_MODULE_2__.NetworkRpcHeaders, {
    isReadOnly: false,
    rpcHeaders: rpcHeaders,
    setRpcHeaders: setRpcHeaders
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      pr: 5,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    variant: "text",
    fullWidth: true,
    size: "small",
    onClick: () => setRpcHeaders(existing => ({
      ...existing,
      '': ''
    })),
    disabled: hasEmptyHeader
  }, t('Add Next')))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    direction: "row",
    sx: {
      flexDirection: 'row',
      gap: 1,
      px: 2,
      pb: 3,
      pt: 4,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    key: "cancel",
    color: "secondary",
    onClick: () => {
      setRpcHeaders(network.customRpcHeaders ?? _src_background_services_network_models__WEBPACK_IMPORTED_MODULE_0__.PLACEHOLDER_RPC_HEADERS);
      setIsRpcHeadersManagerVisible(false);
    },
    fullWidth: true
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    key: "save",
    disabled: !hasChanged,
    onClick: () => {
      onChange?.((0,lodash__WEBPACK_IMPORTED_MODULE_3__.omit)(rpcHeaders, ''));
      setIsRpcHeadersManagerVisible(false);
    },
    fullWidth: true
  }, t('Save')))));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX05ldHdvcmtzX05ldHdvcmtGb3JtX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFPLE1BQU1BLGlCQUFpQixHQUFHQSxDQUFDQyxJQUFZLEVBQUVDLEtBQWEsS0FBSztFQUNoRSxJQUFJO0lBQ0YsSUFBSUMsT0FBTyxDQUFDO01BQ1YsQ0FBQ0YsSUFBSSxHQUFHQztJQUNWLENBQUMsQ0FBQztJQUNGLE9BQU8sSUFBSTtFQUNiLENBQUMsQ0FBQyxNQUFNO0lBQ04sT0FBTyxLQUFLO0VBQ2Q7QUFDRixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDSm9DO0FBTzlCLE1BQU1NLGNBQWMsR0FBR0EsQ0FBQztFQUFFQyxLQUFLO0VBQUVDO0FBQTZCLENBQUMsa0JBQ3BFQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ1AsOERBQUs7RUFBQ1EsRUFBRSxFQUFFO0lBQUVDLGFBQWEsRUFBRSxLQUFLO0lBQUVDLFVBQVUsRUFBRSxRQUFRO0lBQUVDLEdBQUcsRUFBRTtFQUFFO0FBQUUsZ0JBQ2hFTCxLQUFBLENBQUFDLGFBQUEsQ0FBQ0wsbUVBQVU7RUFBQ1UsT0FBTyxFQUFDLE9BQU87RUFBQ0osRUFBRSxFQUFFO0lBQUVLLFVBQVUsRUFBRTtFQUFXO0FBQUUsR0FDeERULEtBQUssQ0FDSyxFQUNaQyxPQUFPLGlCQUNOQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ04sZ0VBQU87RUFBQ2EsS0FBSyxFQUFFVDtBQUFRLGdCQUN0QkMsS0FBQSxDQUFBQyxhQUFBLENBQUNSLHVFQUFjO0VBQUNnQixJQUFJLEVBQUU7QUFBRyxFQUFHLENBRS9CLENBRUo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakJjO0FBQ2dDO0FBT1Y7QUFFNkI7QUFDSztBQUtEO0FBTS9ELElBQUthLGlCQUFpQiwwQkFBakJBLGlCQUFpQjtFQUFqQkEsaUJBQWlCO0VBQWpCQSxpQkFBaUI7RUFBQSxPQUFqQkEsaUJBQWlCO0FBQUE7QUFlN0IsTUFBTUMsY0FBYyxHQUFHSix1RUFB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ZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzVmFsaWRIdHRwSGVhZGVyLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vVGV4dEZpZWxkTGFiZWwudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvTmV0d29ya0Zvcm0udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvTmV0d29ya1JwY0hlYWRlcnMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvTmV0d29ya1JwY0hlYWRlcnNNYW5hZ2VyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgaXNWYWxpZEh0dHBIZWFkZXIgPSAobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSA9PiB7XG4gIHRyeSB7XG4gICAgbmV3IEhlYWRlcnMoe1xuICAgICAgW25hbWVdOiB2YWx1ZSxcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgSW5mb0NpcmNsZUljb24sXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbnRlcmZhY2UgVGV4dEZpZWxkTGFiZWxQcm9wcyB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHRvb2x0aXA/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBUZXh0RmllbGRMYWJlbCA9ICh7IGxhYmVsLCB0b29sdGlwIH06IFRleHRGaWVsZExhYmVsUHJvcHMpID0+IChcbiAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxIH19PlxuICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGZvbnRXZWlnaHQ6ICdzZW1pYm9sZCcgfX0+XG4gICAgICB7bGFiZWx9XG4gICAgPC9UeXBvZ3JhcGh5PlxuICAgIHt0b29sdGlwICYmIChcbiAgICAgIDxUb29sdGlwIHRpdGxlPXt0b29sdGlwfT5cbiAgICAgICAgPEluZm9DaXJjbGVJY29uIHNpemU9ezE2fSAvPlxuICAgICAgPC9Ub29sdGlwPlxuICAgICl9XG4gIDwvU3RhY2s+XG4pO1xuIiwiaW1wb3J0IHtcbiAgZm9yd2FyZFJlZixcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUVmZmVjdCxcbiAgdXNlU3RhdGUsXG4gIHVzZUltcGVyYXRpdmVIYW5kbGUsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIElucHV0QWRvcm5tZW50LFxuICBTdGFjayxcbiAgVGV4dEZpZWxkLFxuICBzdHlsZWQsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgVGV4dEZpZWxkTGFiZWwgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1RleHRGaWVsZExhYmVsJztcbmltcG9ydCB7XG4gIEN1c3RvbVJwY0hlYWRlcnMsXG4gIE5ldHdvcmssXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL21vZGVscyc7XG5pbXBvcnQgeyBOZXR3b3JrUnBjSGVhZGVyc01hbmFnZXIgfSBmcm9tICcuL05ldHdvcmtScGNIZWFkZXJzTWFuYWdlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0Zvcm1BY3Rpb25zIHtcbiAgcmVzZXRGb3JtRXJyb3JzOiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZW51bSBOZXR3b3JrRm9ybUFjdGlvbiB7XG4gIEFkZCA9ICdhZGQnLFxuICBFZGl0ID0gJ2VkaXQnLFxufVxuaW50ZXJmYWNlIE5ldHdvcmtGb3JtUHJvcHMge1xuICBjdXN0b21OZXR3b3JrOiBOZXR3b3JrO1xuICBoYW5kbGVDaGFuZ2U/OiAobmV0d29yazogTmV0d29yaywgZm9ybVZhbGlkOiBib29sZWFuKSA9PiB2b2lkO1xuICByZWFkT25seT86IGJvb2xlYW47XG4gIHNob3dFcnJvcnM/OiBib29sZWFuO1xuICBhY3Rpb24/OiBOZXR3b3JrRm9ybUFjdGlvbjtcbiAgaXNDdXN0b21OZXR3b3JrPzogYm9vbGVhbjtcbiAgaGFuZGxlUnBjSGVhZGVyc0NoYW5nZT86IChoZWFkZXJzOiBDdXN0b21ScGNIZWFkZXJzKSA9PiB2b2lkO1xuICBoYW5kbGVSZXNldFVybD86ICgpID0+IHZvaWQ7XG59XG5cbmNvbnN0IElucHV0Q29udGFpbmVyID0gc3R5bGVkKFN0YWNrKWBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB3aWR0aDogMTAwJTtcbiAgZ2FwOiA0cHg7XG4gIG1pbi1oZWlnaHQ6IDkycHg7XG5gO1xuXG5jb25zdCBpc1ZhbGlkVVJMID0gKHRleHQ6IHN0cmluZykgPT4ge1xuICBsZXQgdXJsO1xuXG4gIHRyeSB7XG4gICAgdXJsID0gbmV3IFVSTCh0ZXh0KTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoXG4gICAgdXJsLnByb3RvY29sID09PSAnaHR0cHM6JyB8fFxuICAgIHVybC5wcm90b2NvbCA9PT0gJ2lwZnM6JyB8fFxuICAgIHVybC5wcm90b2NvbCA9PT0gJ2h0dHA6J1xuICApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IE5ldHdvcmtGb3JtID0gZm9yd2FyZFJlZjxOZXR3b3JrRm9ybUFjdGlvbnMsIE5ldHdvcmtGb3JtUHJvcHM+KFxuICAoXG4gICAge1xuICAgICAgY3VzdG9tTmV0d29yayxcbiAgICAgIGhhbmRsZUNoYW5nZSxcbiAgICAgIGhhbmRsZVJwY0hlYWRlcnNDaGFuZ2UsXG4gICAgICByZWFkT25seSA9IGZhbHNlLFxuICAgICAgc2hvd0Vycm9ycyA9IGZhbHNlLFxuICAgICAgYWN0aW9uLFxuICAgICAgaXNDdXN0b21OZXR3b3JrID0gZmFsc2UsXG4gICAgICBoYW5kbGVSZXNldFVybCxcbiAgICB9LFxuICAgIHJlZixcbiAgKSA9PiB7XG4gICAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IHsgaXNDaGFpbklkRXhpc3QgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gICAgY29uc3QgW3JwY0Vycm9yLCBzZXRScGNFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmc+KCk7XG4gICAgY29uc3QgW2NoYWluTmFtZUVycm9yLCBzZXRDaGFpbk5hbWVFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmc+KCk7XG4gICAgY29uc3QgW2NoYWluSWRFcnJvciwgc2V0Q2hhaW5JZEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZz4oKTtcbiAgICBjb25zdCBbdG9rZW5TeW1ib2xFcnJvciwgc2V0VG9rZW5TeW1ib2xFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmc+KCk7XG4gICAgY29uc3QgW2V4cGxvcmVyVXJsRXJyb3IsIHNldEV4cGxvcmVyVXJsRXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nPigpO1xuICAgIGNvbnN0IFt0b2tlbk5hbWVFcnJvciwgc2V0VG9rZW5OYW1lRXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nPigpO1xuXG4gICAgdXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc2V0Rm9ybUVycm9yczogcmVzZXRFcnJvcnMsXG4gICAgICB9O1xuICAgIH0sIFtdKTtcblxuICAgIGNvbnN0IEZvcm1FcnJvcnMgPSB7XG4gICAgICBSUENfRVJST1I6IHQoJ1JQQyByZXF1aXJlZCcpLFxuICAgICAgQ0hBSU5fTkFNRV9FUlJPUjogdCgnTmV0d29yayBOYW1lIGlzIHJlcXVpcmVkJyksXG4gICAgICBDSEFJTl9JRF9FUlJPUjogdCgnQ2hhaW4gSUQgaXMgcmVxdWlyZWQnKSxcbiAgICAgIFRPS0VOX1NZTUJPTF9FUlJPUjogdCgnTmV0d29yayBUb2tlbiBTeW1ib2wgaXMgcmVxdWlyZWQnKSxcbiAgICAgIENIQUlOX0lEX0VYSVNUUzogdCgnVGhpcyBDaGFpbiBJRCBoYXMgYmVlbiBhZGRlZCBhbHJlYWR5JyksXG4gICAgICBJTlZBTElEX1VSTDogdCgnVGhpcyBVUkwgaXMgaW52YWxpZCcpLFxuICAgICAgVE9LRU5fTkFNRV9FUlJPUjogdCgnTmV0d29yayBUb2tlbiBOYW1lIGlzIHJlcXVpcmVkJyksXG4gICAgfTtcblxuICAgIGNvbnN0IHZhbGlkYXRlRm9ybSA9IHVzZUNhbGxiYWNrKFxuICAgICAgKHVwZGF0ZWROZXR3b3JrOiBOZXR3b3JrKSA9PiB7XG4gICAgICAgIGxldCB2YWxpZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKCF1cGRhdGVkTmV0d29yay5ycGNVcmwpIHtcbiAgICAgICAgICBzZXRScGNFcnJvcihGb3JtRXJyb3JzLlJQQ19FUlJPUik7XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZE5ldHdvcmsucnBjVXJsICYmICFpc1ZhbGlkVVJMKHVwZGF0ZWROZXR3b3JrLnJwY1VybCkpIHtcbiAgICAgICAgICBzZXRScGNFcnJvcihGb3JtRXJyb3JzLklOVkFMSURfVVJMKTtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1cGRhdGVkTmV0d29yay5jaGFpbk5hbWUpIHtcbiAgICAgICAgICBzZXRDaGFpbk5hbWVFcnJvcihGb3JtRXJyb3JzLkNIQUlOX05BTUVfRVJST1IpO1xuICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXVwZGF0ZWROZXR3b3JrLmNoYWluSWQgfHwgdXBkYXRlZE5ldHdvcmsuY2hhaW5JZCA9PT0gMCkge1xuICAgICAgICAgIHNldENoYWluSWRFcnJvcihGb3JtRXJyb3JzLkNIQUlOX0lEX0VSUk9SKTtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFjdGlvbiA9PT0gTmV0d29ya0Zvcm1BY3Rpb24uQWRkICYmXG4gICAgICAgICAgaXNDaGFpbklkRXhpc3QodXBkYXRlZE5ldHdvcmsuY2hhaW5JZClcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0Q2hhaW5JZEVycm9yKEZvcm1FcnJvcnMuQ0hBSU5fSURfRVhJU1RTKTtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1cGRhdGVkTmV0d29yay5uZXR3b3JrVG9rZW4uc3ltYm9sKSB7XG4gICAgICAgICAgc2V0VG9rZW5TeW1ib2xFcnJvcihGb3JtRXJyb3JzLlRPS0VOX1NZTUJPTF9FUlJPUik7XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXVwZGF0ZWROZXR3b3JrLm5ldHdvcmtUb2tlbi5uYW1lKSB7XG4gICAgICAgICAgc2V0VG9rZW5OYW1lRXJyb3IoRm9ybUVycm9ycy5UT0tFTl9OQU1FX0VSUk9SKTtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgICAgfSxcbiAgICAgIFtcbiAgICAgICAgRm9ybUVycm9ycy5DSEFJTl9JRF9FUlJPUixcbiAgICAgICAgRm9ybUVycm9ycy5DSEFJTl9JRF9FWElTVFMsXG4gICAgICAgIEZvcm1FcnJvcnMuQ0hBSU5fTkFNRV9FUlJPUixcbiAgICAgICAgRm9ybUVycm9ycy5JTlZBTElEX1VSTCxcbiAgICAgICAgRm9ybUVycm9ycy5SUENfRVJST1IsXG4gICAgICAgIEZvcm1FcnJvcnMuVE9LRU5fTkFNRV9FUlJPUixcbiAgICAgICAgRm9ybUVycm9ycy5UT0tFTl9TWU1CT0xfRVJST1IsXG4gICAgICAgIGFjdGlvbixcbiAgICAgICAgaXNDaGFpbklkRXhpc3QsXG4gICAgICBdLFxuICAgICk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgaWYgKHNob3dFcnJvcnMpIHtcbiAgICAgICAgdmFsaWRhdGVGb3JtKGN1c3RvbU5ldHdvcmspO1xuICAgICAgfVxuICAgIH0sIFtzaG93RXJyb3JzLCBjdXN0b21OZXR3b3JrLCB2YWxpZGF0ZUZvcm1dKTtcblxuICAgIGNvbnN0IHJlc2V0RXJyb3JzID0gKCkgPT4ge1xuICAgICAgc2V0UnBjRXJyb3IoJycpO1xuICAgICAgc2V0Q2hhaW5OYW1lRXJyb3IoJycpO1xuICAgICAgc2V0Q2hhaW5JZEVycm9yKCcnKTtcbiAgICAgIHNldFRva2VuU3ltYm9sRXJyb3IoJycpO1xuICAgICAgc2V0RXhwbG9yZXJVcmxFcnJvcignJyk7XG4gICAgICBzZXRUb2tlbk5hbWVFcnJvcignJyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZVVwZGF0ZSA9ICh1cGRhdGVkTmV0d29yazogTmV0d29yaykgPT4ge1xuICAgICAgcmVzZXRFcnJvcnMoKTtcbiAgICAgIGhhbmRsZUNoYW5nZT8uKHVwZGF0ZWROZXR3b3JrLCB2YWxpZGF0ZUZvcm0odXBkYXRlZE5ldHdvcmspKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY2FuUmVzZXRScGNVcmwgPSBoYW5kbGVSZXNldFVybCAmJiAhaXNDdXN0b21OZXR3b3JrO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSB9fT5cbiAgICAgICAgPElucHV0Q29udGFpbmVyPlxuICAgICAgICAgIDxUZXh0RmllbGRMYWJlbCBsYWJlbD17dCgnTmV0d29yayBSUEMgVVJMJyl9IC8+XG4gICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICBoYW5kbGVVcGRhdGUoe1xuICAgICAgICAgICAgICAgIC4uLmN1c3RvbU5ldHdvcmssXG4gICAgICAgICAgICAgICAgcnBjVXJsOiBlLnRhcmdldC52YWx1ZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJuZXR3b3JrLXJwYy11cmxcIlxuICAgICAgICAgICAgdmFsdWU9e2N1c3RvbU5ldHdvcmsucnBjVXJsfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJodHRwKHMpOi8vVVJMXCJcbiAgICAgICAgICAgIElucHV0UHJvcHM9e3tcbiAgICAgICAgICAgICAgcmVhZE9ubHksXG4gICAgICAgICAgICAgIGZ1bGxXaWR0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgZW5kQWRvcm5tZW50OiBjYW5SZXNldFJwY1VybCA/IChcbiAgICAgICAgICAgICAgICA8SW5wdXRBZG9ybm1lbnQgcG9zaXRpb249XCJlbmRcIj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInRleHRcIiBzaXplPVwic21hbGxcIiBvbkNsaWNrPXtoYW5kbGVSZXNldFVybH0+XG4gICAgICAgICAgICAgICAgICAgIHt0KCdSZXNldCcpfVxuICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgPC9JbnB1dEFkb3JubWVudD5cbiAgICAgICAgICAgICAgKSA6IG51bGwsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZXJyb3I9eyEhcnBjRXJyb3J9XG4gICAgICAgICAgICBoZWxwZXJUZXh0PXtycGNFcnJvcn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0lucHV0Q29udGFpbmVyPlxuICAgICAgICA8SW5wdXRDb250YWluZXI+XG4gICAgICAgICAgPFRleHRGaWVsZExhYmVsIGxhYmVsPXt0KCdOZXR3b3JrIE5hbWUnKX0gLz5cbiAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGhhbmRsZVVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgLi4uY3VzdG9tTmV0d29yayxcbiAgICAgICAgICAgICAgICBjaGFpbk5hbWU6IGUudGFyZ2V0LnZhbHVlLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cIm5ldHdvcmstbmFtZVwiXG4gICAgICAgICAgICB2YWx1ZT17Y3VzdG9tTmV0d29yay5jaGFpbk5hbWV9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnRW50ZXIgTmFtZScpfVxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBJbnB1dFByb3BzPXt7XG4gICAgICAgICAgICAgIHJlYWRPbmx5OlxuICAgICAgICAgICAgICAgIHJlYWRPbmx5IHx8XG4gICAgICAgICAgICAgICAgKCFpc0N1c3RvbU5ldHdvcmsgJiYgYWN0aW9uID09PSBOZXR3b3JrRm9ybUFjdGlvbi5FZGl0KSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBlcnJvcj17ISFjaGFpbk5hbWVFcnJvcn1cbiAgICAgICAgICAgIGhlbHBlclRleHQ9e2NoYWluTmFtZUVycm9yfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvSW5wdXRDb250YWluZXI+XG4gICAgICAgIDxJbnB1dENvbnRhaW5lcj5cbiAgICAgICAgICA8VGV4dEZpZWxkTGFiZWwgbGFiZWw9e3QoJ0NoYWluIElEJyl9IC8+XG4gICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICBoYW5kbGVVcGRhdGUoe1xuICAgICAgICAgICAgICAgIC4uLmN1c3RvbU5ldHdvcmssXG4gICAgICAgICAgICAgICAgY2hhaW5JZDogcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkaXNhYmxlZD17YWN0aW9uID09PSBOZXR3b3JrRm9ybUFjdGlvbi5FZGl0fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjaGFpbi1pZFwiXG4gICAgICAgICAgICB2YWx1ZT17aXNOYU4oY3VzdG9tTmV0d29yay5jaGFpbklkKSA/ICcnIDogY3VzdG9tTmV0d29yay5jaGFpbklkfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0VudGVyIENoYWluIElEJyl9XG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIElucHV0UHJvcHM9e3tcbiAgICAgICAgICAgICAgcmVhZE9ubHk6XG4gICAgICAgICAgICAgICAgcmVhZE9ubHkgfHxcbiAgICAgICAgICAgICAgICAoIWlzQ3VzdG9tTmV0d29yayAmJiBhY3Rpb24gPT09IE5ldHdvcmtGb3JtQWN0aW9uLkVkaXQpLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgZXJyb3I9eyEhY2hhaW5JZEVycm9yfVxuICAgICAgICAgICAgaGVscGVyVGV4dD17Y2hhaW5JZEVycm9yfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvSW5wdXRDb250YWluZXI+XG4gICAgICAgIDxJbnB1dENvbnRhaW5lcj5cbiAgICAgICAgICA8VGV4dEZpZWxkTGFiZWwgbGFiZWw9e3QoJ05ldHdvcmsgVG9rZW4gU3ltYm9sJyl9IC8+XG4gICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICBoYW5kbGVVcGRhdGUoe1xuICAgICAgICAgICAgICAgIC4uLmN1c3RvbU5ldHdvcmssXG4gICAgICAgICAgICAgICAgbmV0d29ya1Rva2VuOiB7XG4gICAgICAgICAgICAgICAgICAuLi5jdXN0b21OZXR3b3JrLm5ldHdvcmtUb2tlbixcbiAgICAgICAgICAgICAgICAgIHN5bWJvbDogZS50YXJnZXQudmFsdWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJuZXR3b3JrLXRva2VuLXN5bWJvbFwiXG4gICAgICAgICAgICB2YWx1ZT17Y3VzdG9tTmV0d29yay5uZXR3b3JrVG9rZW4uc3ltYm9sfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0VudGVyIFRva2VuIFN5bWJvbCcpfVxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBJbnB1dFByb3BzPXt7XG4gICAgICAgICAgICAgIHJlYWRPbmx5OlxuICAgICAgICAgICAgICAgIHJlYWRPbmx5IHx8XG4gICAgICAgICAgICAgICAgKCFpc0N1c3RvbU5ldHdvcmsgJiYgYWN0aW9uID09PSBOZXR3b3JrRm9ybUFjdGlvbi5FZGl0KSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBlcnJvcj17ISF0b2tlblN5bWJvbEVycm9yfVxuICAgICAgICAgICAgaGVscGVyVGV4dD17dG9rZW5TeW1ib2xFcnJvcn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0lucHV0Q29udGFpbmVyPlxuICAgICAgICA8SW5wdXRDb250YWluZXI+XG4gICAgICAgICAgPFRleHRGaWVsZExhYmVsIGxhYmVsPXt0KCdOZXR3b3JrIFRva2VuIE5hbWUnKX0gLz5cbiAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGhhbmRsZVVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgLi4uY3VzdG9tTmV0d29yayxcbiAgICAgICAgICAgICAgICBuZXR3b3JrVG9rZW46IHtcbiAgICAgICAgICAgICAgICAgIC4uLmN1c3RvbU5ldHdvcmsubmV0d29ya1Rva2VuLFxuICAgICAgICAgICAgICAgICAgbmFtZTogZS50YXJnZXQudmFsdWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJuZXR3b3JrLXRva2VuLW5hbWVcIlxuICAgICAgICAgICAgdmFsdWU9e2N1c3RvbU5ldHdvcmsubmV0d29ya1Rva2VuLm5hbWV9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnRW50ZXIgVG9rZW4nKX1cbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgSW5wdXRQcm9wcz17e1xuICAgICAgICAgICAgICByZWFkT25seTpcbiAgICAgICAgICAgICAgICByZWFkT25seSB8fFxuICAgICAgICAgICAgICAgICghaXNDdXN0b21OZXR3b3JrICYmIGFjdGlvbiA9PT0gTmV0d29ya0Zvcm1BY3Rpb24uRWRpdCksXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZXJyb3I9eyEhdG9rZW5OYW1lRXJyb3J9XG4gICAgICAgICAgICBoZWxwZXJUZXh0PXt0b2tlbk5hbWVFcnJvcn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0lucHV0Q29udGFpbmVyPlxuICAgICAgICA8SW5wdXRDb250YWluZXI+XG4gICAgICAgICAgPFRleHRGaWVsZExhYmVsIGxhYmVsPXt0KCdFeHBsb3JlciBVUkwgKE9wdGlvbmFsKScpfSAvPlxuICAgICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgaGFuZGxlVXBkYXRlKHtcbiAgICAgICAgICAgICAgICAuLi5jdXN0b21OZXR3b3JrLFxuICAgICAgICAgICAgICAgIGV4cGxvcmVyVXJsOiBlLnRhcmdldC52YWx1ZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJleHBsb3Jlci11cmxcIlxuICAgICAgICAgICAgdmFsdWU9e2N1c3RvbU5ldHdvcmsuZXhwbG9yZXJVcmx9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnRW50ZXIgVVJMJyl9XG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIElucHV0UHJvcHM9e3tcbiAgICAgICAgICAgICAgcmVhZE9ubHk6XG4gICAgICAgICAgICAgICAgcmVhZE9ubHkgfHxcbiAgICAgICAgICAgICAgICAoIWlzQ3VzdG9tTmV0d29yayAmJiBhY3Rpb24gPT09IE5ldHdvcmtGb3JtQWN0aW9uLkVkaXQpLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGVycm9yPXshIWV4cGxvcmVyVXJsRXJyb3J9XG4gICAgICAgICAgICBoZWxwZXJUZXh0PXtleHBsb3JlclVybEVycm9yfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvSW5wdXRDb250YWluZXI+XG4gICAgICAgIDxJbnB1dENvbnRhaW5lcj5cbiAgICAgICAgICA8VGV4dEZpZWxkTGFiZWwgbGFiZWw9e3QoJ0xvZ28gVVJMIChPcHRpb25hbCknKX0gLz5cbiAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGhhbmRsZVVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgLi4uY3VzdG9tTmV0d29yayxcbiAgICAgICAgICAgICAgICBsb2dvVXJpOiBlLnRhcmdldC52YWx1ZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2dvLXVybFwiXG4gICAgICAgICAgICB2YWx1ZT17Y3VzdG9tTmV0d29yay5sb2dvVXJpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0VudGVyIFVSTCcpfVxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBJbnB1dFByb3BzPXt7XG4gICAgICAgICAgICAgIHJlYWRPbmx5OlxuICAgICAgICAgICAgICAgIHJlYWRPbmx5IHx8XG4gICAgICAgICAgICAgICAgKCFpc0N1c3RvbU5ldHdvcmsgJiYgYWN0aW9uID09PSBOZXR3b3JrRm9ybUFjdGlvbi5FZGl0KSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9JbnB1dENvbnRhaW5lcj5cbiAgICAgICAgPElucHV0Q29udGFpbmVyPlxuICAgICAgICAgIDxUZXh0RmllbGRMYWJlbCBsYWJlbD17dCgnQ3VzdG9tIFJQQyBIZWFkZXJzJyl9IC8+XG4gICAgICAgICAgPE5ldHdvcmtScGNIZWFkZXJzTWFuYWdlclxuICAgICAgICAgICAgaXNSZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgICBuZXR3b3JrPXtjdXN0b21OZXR3b3JrfVxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVJwY0hlYWRlcnNDaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9JbnB1dENvbnRhaW5lcj5cbiAgICAgIDwvU3RhY2s+XG4gICAgKTtcbiAgfSxcbik7XG5cbk5ldHdvcmtGb3JtLmRpc3BsYXlOYW1lID0gJ05ldHdvcmtGb3JtJztcbiIsImltcG9ydCB7IG9taXQgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgRGlzcGF0Y2gsIFNldFN0YXRlQWN0aW9uLCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEdyb3csXG4gIEljb25CdXR0b24sXG4gIFN0YWNrLFxuICBUZXh0RmllbGQsXG4gIFRyYXNoSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7XG4gIEN1c3RvbVJwY0hlYWRlcnMsXG4gIFBMQUNFSE9MREVSX1JQQ19IRUFERVJTLFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay9tb2RlbHMnO1xuaW1wb3J0IHsgaXNWYWxpZEh0dHBIZWFkZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc1ZhbGlkSHR0cEhlYWRlcic7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIGlzUmVhZE9ubHk6IGJvb2xlYW47XG4gIHJwY0hlYWRlcnM6IEN1c3RvbVJwY0hlYWRlcnM7XG4gIHNldFJwY0hlYWRlcnM/OiBEaXNwYXRjaDxTZXRTdGF0ZUFjdGlvbjxDdXN0b21ScGNIZWFkZXJzPj47XG59O1xuXG5leHBvcnQgY29uc3QgTmV0d29ya1JwY0hlYWRlcnMgPSAoe1xuICBpc1JlYWRPbmx5LFxuICBycGNIZWFkZXJzLFxuICBzZXRScGNIZWFkZXJzLFxufTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IHVwZGF0ZUhlYWRlciA9IHVzZUNhbGxiYWNrKFxuICAgIChcbiAgICAgIGtleUluZGV4OiBudW1iZXIsXG4gICAgICB7IG5ld05hbWUsIG5ld1ZhbHVlIH06IHsgbmV3TmFtZT86IHN0cmluZzsgbmV3VmFsdWU/OiBzdHJpbmcgfSxcbiAgICApID0+IHtcbiAgICAgIHNldFJwY0hlYWRlcnM/LigocHJldmlvdXMpID0+XG4gICAgICAgIE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgICBPYmplY3QuZW50cmllcyhwcmV2aW91cykubWFwKChbbmFtZSwgdmFsdWVdLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBrZXlJbmRleCkge1xuICAgICAgICAgICAgICByZXR1cm4gW25ld05hbWUgPz8gbmFtZSwgbmV3VmFsdWUgPz8gdmFsdWVdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW25hbWUsIHZhbHVlXTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICk7XG4gICAgfSxcbiAgICBbc2V0UnBjSGVhZGVyc10sXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEgfX0+XG4gICAgICB7T2JqZWN0LmVudHJpZXMocnBjSGVhZGVycykubWFwKChbaGVhZGVyTmFtZSwgaGVhZGVyVmFsdWVdLCBpbmRleCkgPT4gKFxuICAgICAgICA8R3JvdyBpbiBrZXk9e2BycGMtaGVhZGVyLSR7aW5kZXh9YH0+XG4gICAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIHN4PXt7IGdhcDogMC41LCBtYjogMSB9fT5cbiAgICAgICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgdmFsdWU9e2hlYWRlck5hbWV9XG4gICAgICAgICAgICAgIElucHV0UHJvcHM9e3tcbiAgICAgICAgICAgICAgICByZWFkT25seTogaXNSZWFkT25seSxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0hlYWRlciBOYW1lJyl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXYpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAhZXYudGFyZ2V0LnZhbHVlIHx8XG4gICAgICAgICAgICAgICAgICBpc1ZhbGlkSHR0cEhlYWRlcihldi50YXJnZXQudmFsdWUsIGhlYWRlclZhbHVlKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgdXBkYXRlSGVhZGVyKGluZGV4LCB7IG5ld05hbWU6IGV2LnRhcmdldC52YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICB2YWx1ZT17aGVhZGVyVmFsdWV9XG4gICAgICAgICAgICAgIElucHV0UHJvcHM9e3tcbiAgICAgICAgICAgICAgICByZWFkT25seTogaXNSZWFkT25seSxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ1ZhbHVlJyl9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXYpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZEh0dHBIZWFkZXIoaGVhZGVyTmFtZSwgZXYudGFyZ2V0LnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgdXBkYXRlSGVhZGVyKGluZGV4LCB7IG5ld1ZhbHVlOiBldi50YXJnZXQudmFsdWUgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIHshaXNSZWFkT25seSAmJiAoXG4gICAgICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2hlYWRlck5hbWUgPT09ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICBzZXRScGNIZWFkZXJzPy4oKGV4aXN0aW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhleGlzdGluZykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFBMQUNFSE9MREVSX1JQQ19IRUFERVJTO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9taXQoZXhpc3RpbmcsIGhlYWRlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8VHJhc2hJY29uIC8+XG4gICAgICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9Hcm93PlxuICAgICAgKSl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBCdXR0b24sXG4gIERpYWxvZyxcbiAgRGlhbG9nQ29udGVudCxcbiAgRGlhbG9nVGl0bGUsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtcbiAgQ3VzdG9tUnBjSGVhZGVycyxcbiAgTmV0d29yayxcbiAgUExBQ0VIT0xERVJfUlBDX0hFQURFUlMsXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL21vZGVscyc7XG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFRyYW5zLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgTmV0d29ya1JwY0hlYWRlcnMgfSBmcm9tICcuL05ldHdvcmtScGNIZWFkZXJzJztcbmltcG9ydCB7IG9taXQgfSBmcm9tICdsb2Rhc2gnO1xuXG50eXBlIFByb3BzID0ge1xuICBpc1JlYWRPbmx5OiBib29sZWFuO1xuICBuZXR3b3JrOiBOZXR3b3JrO1xuICBvbkNoYW5nZT86IChuZXdIZWFkZXJzOiBDdXN0b21ScGNIZWFkZXJzKSA9PiB2b2lkO1xufTtcblxuZXhwb3J0IGNvbnN0IE5ldHdvcmtScGNIZWFkZXJzTWFuYWdlciA9ICh7XG4gIGlzUmVhZE9ubHksXG4gIG5ldHdvcmssXG4gIG9uQ2hhbmdlLFxufTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IFtycGNIZWFkZXJzLCBzZXRScGNIZWFkZXJzXSA9IHVzZVN0YXRlKFxuICAgIG5ldHdvcmsuY3VzdG9tUnBjSGVhZGVycyA/PyBQTEFDRUhPTERFUl9SUENfSEVBREVSUyxcbiAgKTtcbiAgY29uc3QgW2lzUnBjSGVhZGVyc01hbmFnZXJWaXNpYmxlLCBzZXRJc1JwY0hlYWRlcnNNYW5hZ2VyVmlzaWJsZV0gPVxuICAgIHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBoYXNIZWFkZXJzQ29uZmlndXJlZCA9XG4gICAgT2JqZWN0LmtleXMobmV0d29yay5jdXN0b21ScGNIZWFkZXJzID8/IHt9KS5sZW5ndGggPiAwO1xuICBjb25zdCBoYXNFbXB0eUhlYWRlciA9ICcnIGluIHJwY0hlYWRlcnM7XG4gIGNvbnN0IGhhc0NoYW5nZWQgPVxuICAgIEpTT04uc3RyaW5naWZ5KG5ldHdvcmsuY3VzdG9tUnBjSGVhZGVycyA/PyBQTEFDRUhPTERFUl9SUENfSEVBREVSUykgIT09XG4gICAgSlNPTi5zdHJpbmdpZnkocnBjSGVhZGVycyk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge2hhc0hlYWRlcnNDb25maWd1cmVkICYmIChcbiAgICAgICAgPD5cbiAgICAgICAgICA8TmV0d29ya1JwY0hlYWRlcnMgcnBjSGVhZGVycz17cnBjSGVhZGVyc30gaXNSZWFkT25seSAvPlxuICAgICAgICAgIHshaXNSZWFkT25seSAmJiAoXG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNScGNIZWFkZXJzTWFuYWdlclZpc2libGUodHJ1ZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdFZGl0IEN1c3RvbSBSUEMgSGVhZGVycycpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgICAgeyFoYXNIZWFkZXJzQ29uZmlndXJlZCAmJlxuICAgICAgICAoaXNSZWFkT25seSA/IChcbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIlxuICAgICAgICAgICAgc3g9e3sgZGlzcGxheTogJ2ZsZXgnIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ05vIGN1c3RvbSBoZWFkZXJzIGFyZSBjb25maWd1cmVkLicpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIlxuICAgICAgICAgICAgc3g9e3sgZGlzcGxheTogJ2ZsZXgnIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgIGkxOG5LZXk9e1xuICAgICAgICAgICAgICAgICdObyBjdXN0b20gaGVhZGVycyBhcmUgY29uZmlndXJlZC4gPGJ1dHRvbj5FZGl0PC9idXR0b24+J1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgICBidXR0b246IChcbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc1JwY0hlYWRlcnNNYW5hZ2VyVmlzaWJsZSh0cnVlKX1cbiAgICAgICAgICAgICAgICAgICAgc3g9e3sgcDogMCB9fVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICkpfVxuXG4gICAgICB7IWlzUmVhZE9ubHkgJiYgaXNScGNIZWFkZXJzTWFuYWdlclZpc2libGUgJiYgKFxuICAgICAgICA8RGlhbG9nXG4gICAgICAgICAgb3Blbj17aXNScGNIZWFkZXJzTWFuYWdlclZpc2libGV9XG4gICAgICAgICAgUGFwZXJQcm9wcz17eyBzeDogeyBteDogMiB9IH19XG4gICAgICAgID5cbiAgICAgICAgICA8RGlhbG9nVGl0bGUgc3g9e3sgcHg6IDIgfX0+e3QoJ0N1c3RvbSBSUEMgSGVhZGVycycpfTwvRGlhbG9nVGl0bGU+XG4gICAgICAgICAgPERpYWxvZ0NvbnRlbnQgc3g9e3sgcGw6IDIsIHByOiAxIH19PlxuICAgICAgICAgICAgPE5ldHdvcmtScGNIZWFkZXJzXG4gICAgICAgICAgICAgIGlzUmVhZE9ubHk9e2ZhbHNlfVxuICAgICAgICAgICAgICBycGNIZWFkZXJzPXtycGNIZWFkZXJzfVxuICAgICAgICAgICAgICBzZXRScGNIZWFkZXJzPXtzZXRScGNIZWFkZXJzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTdGFjayBzeD17eyBwcjogNSwgd2lkdGg6IDEgfX0+XG4gICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgICAgICAgICAgc2V0UnBjSGVhZGVycygoZXhpc3RpbmcpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIC4uLmV4aXN0aW5nLFxuICAgICAgICAgICAgICAgICAgICAnJzogJycsXG4gICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2hhc0VtcHR5SGVhZGVyfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoJ0FkZCBOZXh0Jyl9XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L0RpYWxvZ0NvbnRlbnQ+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgICAgIHBiOiAzLFxuICAgICAgICAgICAgICBwdDogNCxcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAga2V5PVwiY2FuY2VsXCJcbiAgICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0UnBjSGVhZGVycyhcbiAgICAgICAgICAgICAgICAgIG5ldHdvcmsuY3VzdG9tUnBjSGVhZGVycyA/PyBQTEFDRUhPTERFUl9SUENfSEVBREVSUyxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHNldElzUnBjSGVhZGVyc01hbmFnZXJWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBrZXk9XCJzYXZlXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFoYXNDaGFuZ2VkfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U/LihvbWl0KHJwY0hlYWRlcnMsICcnKSk7XG4gICAgICAgICAgICAgICAgc2V0SXNScGNIZWFkZXJzTWFuYWdlclZpc2libGUoZmFsc2UpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1NhdmUnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvRGlhbG9nPlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn07XG4iXSwibmFtZXMiOlsiaXNWYWxpZEh0dHBIZWFkZXIiLCJuYW1lIiwidmFsdWUiLCJIZWFkZXJzIiwiSW5mb0NpcmNsZUljb24iLCJTdGFjayIsIlRvb2x0aXAiLCJUeXBvZ3JhcGh5IiwiVGV4dEZpZWxkTGFiZWwiLCJsYWJlbCIsInRvb2x0aXAiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzeCIsImZsZXhEaXJlY3Rpb24iLCJhbGlnbkl0ZW1zIiwiZ2FwIiwidmFyaWFudCIsImZvbnRXZWlnaHQiLCJ0aXRsZSIsInNpemUiLCJmb3J3YXJkUmVmIiwidXNlQ2FsbGJhY2siLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsInVzZUltcGVyYXRpdmVIYW5kbGUiLCJ1c2VUcmFuc2xhdGlvbiIsIkJ1dHRvbiIsIklucHV0QWRvcm5tZW50IiwiVGV4dEZpZWxkIiwic3R5bGVkIiwidXNlTmV0d29ya0NvbnRleHQiLCJOZXR3b3JrUnBjSGVhZGVyc01hbmFnZXIiLCJOZXR3b3JrRm9ybUFjdGlvbiIsIklucHV0Q29udGFpbmVyIiwiaXNWYWxpZFVSTCIsInRleHQiLCJ1cmwiLCJVUkwiLCJfIiwicHJvdG9jb2wiLCJOZXR3b3JrRm9ybSIsImN1c3RvbU5ldHdvcmsiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVScGNIZWFkZXJzQ2hhbmdlIiwicmVhZE9ubHkiLCJzaG93RXJyb3JzIiwiYWN0aW9uIiwiaXNDdXN0b21OZXR3b3JrIiwiaGFuZGxlUmVzZXRVcmwiLCJyZWYiLCJ0IiwiaXNDaGFpbklkRXhpc3QiLCJycGNFcnJvciIsInNldFJwY0Vycm9yIiwiY2hhaW5OYW1lRXJyb3IiLCJzZXRDaGFpbk5hbWVFcnJvciIsImNoYWluSWRFcnJvciIsInNldENoYWluSWRFcnJvciIsInRva2VuU3ltYm9sRXJyb3IiLCJzZXRUb2tlblN5bWJvbEVycm9yIiwiZXhwbG9yZXJVcmxFcnJvciIsInNldEV4cGxvcmVyVXJsRXJyb3IiLCJ0b2tlbk5hbWVFcnJvciIsInNldFRva2VuTmFtZUVycm9yIiwicmVzZXRGb3JtRXJyb3JzIiwicmVzZXRFcnJvcnMiLCJGb3JtRXJyb3JzIiwiUlBDX0VSUk9SIiwiQ0hBSU5fTkFNRV9FUlJPUiIsIkNIQUlOX0lEX0VSUk9SIiwiVE9LRU5fU1lNQk9MX0VSUk9SIiwiQ0hBSU5fSURfRVhJU1RTIiwiSU5WQUxJRF9VUkwiLCJUT0tFTl9OQU1FX0VSUk9SIiwidmFsaWRhdGVGb3JtIiwidXBkYXRlZE5ldHdvcmsiLCJ2YWxpZCIsInJwY1VybCIsImNoYWluTmFtZSIsImNoYWluSWQiLCJBZGQiLCJuZXR3b3JrVG9rZW4iLCJzeW1ib2wiLCJoYW5kbGVVcGRhdGUiLCJjYW5SZXNldFJwY1VybCIsIndpZHRoIiwib25DaGFuZ2UiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwidGFyZ2V0IiwicGxhY2Vob2xkZXIiLCJJbnB1dFByb3BzIiwiZnVsbFdpZHRoIiwiZW5kQWRvcm5tZW50IiwicG9zaXRpb24iLCJvbkNsaWNrIiwiZXJyb3IiLCJoZWxwZXJUZXh0IiwiRWRpdCIsInBhcnNlSW50IiwiZGlzYWJsZWQiLCJpc05hTiIsInR5cGUiLCJleHBsb3JlclVybCIsImxvZ29VcmkiLCJpc1JlYWRPbmx5IiwibmV0d29yayIsImRpc3BsYXlOYW1lIiwib21pdCIsIkdyb3ciLCJJY29uQnV0dG9uIiwiVHJhc2hJY29uIiwiUExBQ0VIT0xERVJfUlBDX0hFQURFUlMiLCJOZXR3b3JrUnBjSGVhZGVycyIsInJwY0hlYWRlcnMiLCJzZXRScGNIZWFkZXJzIiwidXBkYXRlSGVhZGVyIiwia2V5SW5kZXgiLCJuZXdOYW1lIiwibmV3VmFsdWUiLCJwcmV2aW91cyIsIk9iamVjdCIsImZyb21FbnRyaWVzIiwiZW50cmllcyIsIm1hcCIsImluZGV4IiwiaGVhZGVyTmFtZSIsImhlYWRlclZhbHVlIiwiaW4iLCJrZXkiLCJkaXJlY3Rpb24iLCJtYiIsImV2IiwiZXhpc3RpbmciLCJrZXlzIiwibGVuZ3RoIiwiRGlhbG9nIiwiRGlhbG9nQ29udGVudCIsIkRpYWxvZ1RpdGxlIiwiVHJhbnMiLCJjdXN0b21ScGNIZWFkZXJzIiwiaXNScGNIZWFkZXJzTWFuYWdlclZpc2libGUiLCJzZXRJc1JwY0hlYWRlcnNNYW5hZ2VyVmlzaWJsZSIsImhhc0hlYWRlcnNDb25maWd1cmVkIiwiaGFzRW1wdHlIZWFkZXIiLCJoYXNDaGFuZ2VkIiwiSlNPTiIsInN0cmluZ2lmeSIsIkZyYWdtZW50IiwiY29sb3IiLCJkaXNwbGF5IiwiaTE4bktleSIsImNvbXBvbmVudHMiLCJidXR0b24iLCJwIiwib3BlbiIsIlBhcGVyUHJvcHMiLCJteCIsInB4IiwicGwiLCJwciIsInBiIiwicHQiXSwic291cmNlUm9vdCI6IiJ9