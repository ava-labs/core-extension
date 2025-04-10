"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ExportPrivateKey_ExportPrivateKey_tsx"],{

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

/***/ "./src/pages/ExportPrivateKey/EnterPassword.tsx":
/*!******************************************************!*\
  !*** ./src/pages/ExportPrivateKey/EnterPassword.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EnterPassword": () => (/* binding */ EnterPassword),
/* harmony export */   "IconWrapper": () => (/* binding */ IconWrapper)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");
/* harmony import */ var _src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/Dropdown */ "./src/components/common/Dropdown.tsx");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useGoBack */ "./src/hooks/useGoBack.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










const IconWrapper = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack)`
  background: ${({
  theme
}) => theme.palette.grey[850]};
  border-radius: 50%;
  border: 1px solid white;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  margin-top: 24px;
`;
function EnterPassword({
  accountType,
  errorMessage,
  isLoading,
  onSubmit
}) {
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_9__.useHistory)();
  const goBack = (0,_src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_6__.useGoBack)('/accounts');
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__.useAnalyticsContext)();
  const [privateKeyChain, setPrivateKeyChain] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(_src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.PrivateKeyChain.C);
  const [password, setPassword] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)('');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, null, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__.PageTitle, {
    margin: '22px 0 4px 0',
    onBackClick: () => {
      capture('ExportPrivateKeyCancelled');
      goBack();
    }
  }, t('Enter Password')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconWrapper, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.KeyIcon, {
    size: 32
  }))), accountType === _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.Mnemonic && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      px: 2,
      mt: 3
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_2__.Dropdown, {
    SelectProps: {
      defaultValue: _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.PrivateKeyChain.C,
      native: false,
      displayEmpty: false,
      renderValue: () => {
        switch (privateKeyChain) {
          case _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.PrivateKeyChain.C:
            return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, null, t('C-Chain'));
          case _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.PrivateKeyChain.XP:
            return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, null, t('X/P-Chain'));
        }
      },
      onChange: e => {
        const chain = e.target.value;
        if (chain && chain !== privateKeyChain) {
          setPrivateKeyChain(chain);
        }
      },
      // We need the @ts-ignore, because MUI's "nested props" (such as SelectProps)
      // do not allow passing data-attributes.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'data-testid': 'private-key-chain-dropdown'
    },
    label: t('Select chain')
  }, /*#__PURE__*/React.createElement(_src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_2__.DropdownItem, {
    value: _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.PrivateKeyChain.C,
    selected: privateKeyChain === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.PrivateKeyChain.C,
    "data-testid": "private-key-chain-dropdown-item-c"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, null, t('C-Chain'))), /*#__PURE__*/React.createElement(_src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_2__.DropdownItem, {
    value: _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.PrivateKeyChain.XP,
    selected: privateKeyChain === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.PrivateKeyChain.XP,
    "data-testid": "private-key-chain-dropdown-item-xp"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, null, t('X/P-Chain'))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      px: 2,
      mt: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.TextField, {
    "data-testid": "password-input",
    type: "password",
    label: t('Password'),
    onChange: e => setPassword(e.currentTarget.value.trim()),
    placeholder: t('Enter Password'),
    error: !!errorMessage,
    helperText: errorMessage,
    size: "medium",
    fullWidth: true,
    autoFocus: true,
    onKeyPress: e => {
      if (e.key === 'Enter') {
        onSubmit(password, privateKeyChain);
      }
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      width: '100%',
      flexDirection: 'row',
      flexGrow: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Button, {
    size: "large",
    "data-testid": "export-private-key-enter-password-cancel",
    fullWidth: true,
    variant: "contained",
    color: "secondary",
    onClick: () => {
      capture('ExportPrivateKeyCancelled');
      history.replace('/accounts');
    }
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Button, {
    color: "primary",
    size: "large",
    onClick: () => {
      onSubmit(password, privateKeyChain);
    },
    "data-testid": "export-private-key-enter-password-next",
    type: "primary",
    fullWidth: true,
    variant: "contained",
    disabled: !password,
    isLoading: isLoading
  }, t('Next')))));
}

/***/ }),

/***/ "./src/pages/ExportPrivateKey/ExportPrivateKey.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/ExportPrivateKey/ExportPrivateKey.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExportPrivateKey": () => (/* binding */ ExportPrivateKey)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _EnterPassword__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EnterPassword */ "./src/pages/ExportPrivateKey/EnterPassword.tsx");
/* harmony import */ var _ShowPrivateKey__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ShowPrivateKey */ "./src/pages/ExportPrivateKey/ShowPrivateKey.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");













function ExportPrivateKey() {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__["default"])();
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_4__.useConnectionContext)();
  const {
    search
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_11__.useLocation)();
  const {
    accounts
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_5__.useAccountsContext)();
  const {
    wallets
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_7__.useWalletContext)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_12__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_8__.useAnalyticsContext)();
  const [type, setType] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [index, setIndex] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [id, setId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [privateKey, setPrivateKey] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const onSubmit = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((password, chain) => {
    if (!type) {
      capture('ExportPrivateKeyErrorInvalidType');
      throw new Error('Invalid type!');
    }
    setIsLoading(true);
    request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_3__.ExtensionRequest.ACCOUNT_GET_PRIVATEKEY,
      params: [{
        type,
        index,
        id,
        password,
        chain
      }]
    }).then(res => {
      setPrivateKey(res);
      capture('ExportPrivateKeySuccessful', {
        chain
      });
    }).catch(e => {
      if (e.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_6__.GetPrivateKeyErrorTypes.Password) {
        setError(t('Invalid Password'));
        capture('ExportPrivateKeyErrorInvalidPassword');
        return;
      } else if (e.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_6__.GetPrivateKeyErrorTypes.Chain) {
        setError(t('Invalid Chain'));
        capture('ExportPrivateKeyErrorInvalidChain');
        return;
      }
      setError(t('Something bad happened please try again later!'));
      capture('ExportPrivateKeyFailed');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [capture, id, index, request, t, type]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const url = new URLSearchParams(search);
    const accountId = url.get('accountId');
    setId(accountId || '');
    const isImported = !!(accountId && accounts.imported[accountId]) || false;
    if (isImported) {
      setType(_src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_6__.AccountType.IMPORTED);
      return;
    }
    const account = Object.values(accounts.primary).flat().find(primaryAccount => {
      return primaryAccount.id === accountId;
    });
    if (!account) {
      return;
    }
    const wallet = wallets.find(w => w.id === account.walletId);
    if (wallet?.type === _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_9__.SecretType.Mnemonic) {
      setIndex(account.index);
      setType(_src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_9__.SecretType.Mnemonic);
    }
  }, [accounts, index, search, wallets]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      background: theme.palette.background.paper,
      justifyContent: 'space-between'
    }
  }, !privateKey && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_EnterPassword__WEBPACK_IMPORTED_MODULE_1__.EnterPassword, {
    accountType: type,
    errorMessage: error,
    isLoading: isLoading,
    onSubmit: onSubmit
  })), privateKey && /*#__PURE__*/React.createElement(_ShowPrivateKey__WEBPACK_IMPORTED_MODULE_2__.ShowPrivateKey, {
    privateKey: privateKey
  })));
}

/***/ }),

/***/ "./src/pages/ExportPrivateKey/ShowPrivateKey.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/ExportPrivateKey/ShowPrivateKey.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShowPrivateKey": () => (/* binding */ ShowPrivateKey)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _EnterPassword__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EnterPassword */ "./src/pages/ExportPrivateKey/EnterPassword.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useGoBack */ "./src/hooks/useGoBack.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function ShowPrivateKey({
  privateKey
}) {
  const goBack = (0,_src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_4__.useGoBack)('/accounts');
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useHistory)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const onCopy = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
    navigator.clipboard.writeText(privateKey || '');
    capture('ExportPrivateKeyCopied');
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__["default"].success(t('Copied!'), {
      duration: 2000
    });
  }, [capture, privateKey, t]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitle, {
    margin: '22px 0 4px 0',
    onBackClick: goBack
  }, t('Your Private Key')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      px: 2,
      rowGap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_EnterPassword__WEBPACK_IMPORTED_MODULE_1__.IconWrapper, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.KeyIcon, {
    size: 32
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Alert, {
    severity: "warning"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.AlertTitle, null, t('Protect your Private Key')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.AlertContent, null, t('Do not share your Private Key with anyone including Core Support'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    onClick: onCopy,
    sx: {
      backgroundColor: theme.palette.grey[850],
      flexDirection: 'row',
      columnGap: 2,
      p: 2,
      width: '100%',
      cursor: 'pointer',
      borderRadius: 1,
      alignItems: 'center'
    },
    "data-testid": "copy-private-key"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      wordBreak: 'break-all'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body1"
  }, privateKey)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      rowGap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.CopyIcon, {
    size: 24
  }))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      p: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      width: '100%',
      flexDirection: 'row',
      flexGrow: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    size: "large",
    onClick: () => history.replace('/accounts'),
    "data-testid": "export-private-key-cancel",
    fullWidth: true,
    variant: "contained",
    color: "secondary"
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    color: "primary",
    size: "large",
    "data-testid": "export-private-key-done",
    type: "primary",
    fullWidth: true,
    variant: "contained",
    onClick: () => history.replace('/accounts')
  }, t('Done')))));
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0V4cG9ydFByaXZhdGVLZXlfRXhwb3J0UHJpdmF0ZUtleV90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRcUM7QUFFckMsTUFBTUksV0FBVyxHQUFHQSxDQUFDO0VBQUUsR0FBR0M7QUFBb0IsQ0FBQyxLQUFLO0VBQ2xELE1BQU1DLEtBQUssR0FBR0gsdUVBQVEsRUFBRTtFQUV4QixvQkFDRUksS0FBQSxDQUFBQyxhQUFBLENBQUNSLHdFQUFlLEVBQUFTLDBFQUFBO0lBQ2RDLElBQUksRUFBRSxFQUFHO0lBQ1RDLEVBQUUsRUFBRTtNQUNGLGlCQUFpQixFQUFFO1FBQ2pCQyxVQUFVLEVBQUUsNkJBQTZCO1FBQ3pDQyxLQUFLLEVBQUVQLEtBQUssQ0FBQ1EsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN2QkMsR0FBRyxFQUFFO01BQ1AsQ0FBQztNQUNELHFCQUFxQixFQUFFO1FBQ3JCQyxTQUFTLEVBQUU7TUFDYjtJQUNGO0VBQUUsR0FDRVgsSUFBSSxFQUNSO0FBRU4sQ0FBQztBQUVELE1BQU1ZLGdCQUFnQixHQUFHQSxDQUFDO0VBQ3hCQyxVQUFVLEVBQUU7SUFBRVAsRUFBRSxFQUFFUSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQUUsR0FBR0M7RUFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN6REMsV0FBVyxFQUFFO0lBQ1hDLFNBQVMsRUFBRTtNQUNUQyxVQUFVLEVBQUU7UUFBRVosRUFBRSxFQUFFYSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQUUsR0FBR0M7TUFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN6RCxHQUFHQztJQUNMLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDTixHQUFHQztFQUNMLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDTixHQUFHdEI7QUFDVyxDQUFDLEtBQUs7RUFDcEIsTUFBTUMsS0FBSyxHQUFHSCx1RUFBUSxFQUFFO0VBRXhCLE9BQU87SUFDTGUsVUFBVSxFQUFFO01BQ1ZQLEVB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QUUsZ0JBRUZ0RyxLQUFBLENBQUFDLGFBQUEsQ0FBQzRDLDhEQUFLO0lBQ0p6QyxFQUFFLEVBQUU7TUFDRm1HLEtBQUssRUFBRSxNQUFNO01BQ2JILGFBQWEsRUFBRSxLQUFLO01BQ3BCSSxRQUFRLEVBQUUsQ0FBQztNQUNYOUQsR0FBRyxFQUFFO0lBQ1A7RUFBRSxnQkFFRjFDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMEMsK0RBQU07SUFDTHhDLElBQUksRUFBQyxPQUFPO0lBQ1p1RyxPQUFPLEVBQUVBLENBQUEsS0FBTTNDLE9BQU8sQ0FBQzRDLE9BQU8sQ0FBQyxXQUFXLENBQUU7SUFDNUMsZUFBWSwyQkFBMkI7SUFDdkNYLFNBQVM7SUFDVDNELE9BQU8sRUFBQyxXQUFXO0lBQ25Cb0UsS0FBSyxFQUFDO0VBQVcsR0FFaEJ4QyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ0wsZUFDVGpFLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMEMsK0RBQU07SUFDTDhELEtBQUssRUFBQyxTQUFTO0lBQ2Z0RyxJQUFJLEVBQUMsT0FBTztJQUNaLGVBQVkseUJBQXlCO0lBQ3JDdUYsSUFBSSxFQUFDLFNBQVM7SUFDZE0sU0FBUztJQUNUM0QsT0FBTyxFQUFDLFdBQVc7SUFDbkJxRSxPQUFPLEVBQUVBLENBQUEsS0FBTTNDLE9BQU8sQ0FBQzRDLE9BQU8sQ0FBQyxXQUFXO0VBQUUsR0FFM0MxQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQ0gsQ0FDSCxDQUNGLENBQ1A7QUFFUCIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vRHJvcGRvd24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvRXhwb3J0UHJpdmF0ZUtleS9FbnRlclBhc3N3b3JkLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0V4cG9ydFByaXZhdGVLZXkvRXhwb3J0UHJpdmF0ZUtleS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9FeHBvcnRQcml2YXRlS2V5L1Nob3dQcml2YXRlS2V5LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGV2cm9uRG93bkljb24sXG4gIEljb25CYXNlUHJvcHMsXG4gIE1lbnVJdGVtLFxuICBNZW51SXRlbVByb3BzLFxuICBTZWxlY3QsXG4gIFRleHRGaWVsZFByb3BzLFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuY29uc3QgVHJpZ2dlckljb24gPSAoeyAuLi5yZXN0IH06IEljb25CYXNlUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPENoZXZyb25Eb3duSWNvblxuICAgICAgc2l6ZT17MjB9XG4gICAgICBzeD17e1xuICAgICAgICAnLk11aVNlbGVjdC1pY29uJzoge1xuICAgICAgICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMTUwbXMgZWFzZS1pbi1vdXQnLFxuICAgICAgICAgIHJpZ2h0OiB0aGVtZS5zcGFjaW5nKDIpLFxuICAgICAgICAgIHRvcDogJ2NhbGMoNTAlIC0gMTBweCknLFxuICAgICAgICB9LFxuICAgICAgICAnLk11aVNlbGVjdC1pY29uT3Blbic6IHtcbiAgICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGVYKDE4MGRlZyknLFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICAgIHsuLi5yZXN0fVxuICAgIC8+XG4gICk7XG59O1xuXG5jb25zdCB1c2VEcm9wZG93blByb3BzID0gKHtcbiAgSW5wdXRQcm9wczogeyBzeDogaW5wdXRTeCA9IHt9LCAuLi5vdGhlcklucHV0UHJvcHMgfSA9IHt9LFxuICBTZWxlY3RQcm9wczoge1xuICAgIE1lbnVQcm9wczoge1xuICAgICAgUGFwZXJQcm9wczogeyBzeDogcGFwZXJTeCA9IHt9LCAuLi5vdGhlclBhcGVyUHJvcHMgfSA9IHt9LFxuICAgICAgLi4ub3RoZXJNZW51UHJvcHNcbiAgICB9ID0ge30sXG4gICAgLi4ub3RoZXJTZWxlY3RQcm9wc1xuICB9ID0ge30sXG4gIC4uLnJlc3Rcbn06IFRleHRGaWVsZFByb3BzKSA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4ge1xuICAgIElucHV0UHJvcHM6IHtcbiAgICAgIHN4OiB7XG4gICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgIGhlaWdodDogdGhlbWUuc3BhY2luZyg2KSxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7dGhlbWUucGFsZXR0ZS5ncmV5WzgwMF19YCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODUwXSxcbiAgICAgICAgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkuYm9keTEuZm9udFNpemUsXG5cbiAgICAgICAgJyYuTXVpLWZvY3VzZWQnOiB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODUwXSxcbiAgICAgICAgfSxcbiAgICAgICAgJy5NdWlPdXRsaW5lZElucHV0LW5vdGNoZWRPdXRsaW5lLCAmOmhvdmVyIC5NdWlPdXRsaW5lZElucHV0LW5vdGNoZWRPdXRsaW5lJzpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICB9LFxuICAgICAgICAnLk11aU91dGxpbmVkSW5wdXQtaW5wdXQnOiB7XG4gICAgICAgICAgcGFkZGluZzogdGhlbWUuc3BhY2luZygxLjUsIDIpLFxuICAgICAgICB9LFxuICAgICAgICAuLi5pbnB1dFN4LFxuICAgICAgfSxcbiAgICAgIC4uLm90aGVySW5wdXRQcm9wcyxcbiAgICB9LFxuICAgIFNlbGVjdFByb3BzOiB7XG4gICAgICBJY29uQ29tcG9uZW50OiBUcmlnZ2VySWNvbixcbiAgICAgIE1lbnVQcm9wczoge1xuICAgICAgICBQYXBlclByb3BzOiB7XG4gICAgICAgICAgc3g6IHtcbiAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke3RoZW1lLnBhbGV0dGUuZ3JleVs4NTBdfWAsXG4gICAgICAgICAgICBtYXhXaWR0aDogMzQzLFxuICAgICAgICAgICAgbWF4SGVpZ2h0OiAxNDQsXG4gICAgICAgICAgICBtdDogMixcbiAgICAgICAgICAgIC4uLnBhcGVyU3gsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5vdGhlclBhcGVyUHJvcHMsXG4gICAgICAgIH0sXG4gICAgICAgIC4uLm90aGVyTWVudVByb3BzLFxuICAgICAgfSxcbiAgICAgIC4uLm90aGVyU2VsZWN0UHJvcHMsXG4gICAgfSxcbiAgICAuLi5yZXN0LFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IERyb3Bkb3duID0gKHsgY2hpbGRyZW4sIC4uLnByb3BzIH06IFRleHRGaWVsZFByb3BzKSA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyBTZWxlY3RQcm9wcywgSW5wdXRQcm9wcywgLi4ucmVzdCB9ID0gdXNlRHJvcGRvd25Qcm9wcyhwcm9wcyk7XG5cbiAgcmV0dXJuIChcbiAgICA8U2VsZWN0XG4gICAgICB2YXJpYW50PVwib3V0bGluZWRcIlxuICAgICAgSW5wdXRQcm9wcz17SW5wdXRQcm9wc31cbiAgICAgIFNlbGVjdFByb3BzPXtTZWxlY3RQcm9wc31cbiAgICAgIGlucHV0TGFiZWxQcm9wcz17e1xuICAgICAgICBzeDogeyB0cmFuc2Zvcm06ICdub25lJywgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkuYm9keTIuZm9udFNpemUgfSxcbiAgICAgIH19XG4gICAgICB7Li4ucmVzdH1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9TZWxlY3Q+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgRHJvcGRvd25JdGVtID0gKHsgc3gsIGNoaWxkcmVuLCAuLi5wcm9wcyB9OiBNZW51SXRlbVByb3BzKSA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxNZW51SXRlbVxuICAgICAgc3g9e3tcbiAgICAgICAgbWluSGVpZ2h0OiAnYXV0bycsXG4gICAgICAgIGhlaWdodDogdGhlbWUuc3BhY2luZyg1KSxcbiAgICAgICAgZm9udFNpemU6IHRoZW1lLnR5cG9ncmFwaHkuYm9keTIuZm9udFNpemUsXG4gICAgICAgIGdhcDogMSxcbiAgICAgICAgLi4uc3gsXG4gICAgICB9fVxuICAgICAgey4uLnByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L01lbnVJdGVtPlxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIEJ1dHRvbixcbiAgS2V5SWNvbixcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgVHlwb2dyYXBoeSxcbiAgc3R5bGVkLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtcbiAgQWNjb3VudFR5cGUsXG4gIFByaXZhdGVLZXlDaGFpbixcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyBTZWNyZXRUeXBlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3NlY3JldHMvbW9kZWxzJztcbmltcG9ydCB7IERyb3Bkb3duLCBEcm9wZG93bkl0ZW0gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0Ryb3Bkb3duJztcbmltcG9ydCB7IFBhZ2VUaXRsZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vUGFnZVRpdGxlJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZUdvQmFjayB9IGZyb20gJ0BzcmMvaG9va3MvdXNlR29CYWNrJztcblxuZXhwb3J0IGNvbnN0IEljb25XcmFwcGVyID0gc3R5bGVkKFN0YWNrKWBcbiAgYmFja2dyb3VuZDogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5wYWxldHRlLmdyZXlbODUwXX07XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB3aWR0aDogNjRweDtcbiAgaGVpZ2h0OiA2NHB4O1xuICBtYXJnaW4tdG9wOiAyNHB4O1xuYDtcblxuaW50ZXJmYWNlIEVudGVyUGFzc3dvcmQge1xuICBhY2NvdW50VHlwZTogU2VjcmV0VHlwZS5NbmVtb25pYyB8IEFjY291bnRUeXBlLklNUE9SVEVEIHwgbnVsbDtcbiAgb25TdWJtaXQ6IChwYXNzd29yZDogc3RyaW5nLCBjaGFpbjogUHJpdmF0ZUtleUNoYWluKSA9PiB2b2lkO1xuICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gIGVycm9yTWVzc2FnZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVudGVyUGFzc3dvcmQoe1xuICBhY2NvdW50VHlwZSxcbiAgZXJyb3JNZXNzYWdlLFxuICBpc0xvYWRpbmcsXG4gIG9uU3VibWl0LFxufTogRW50ZXJQYXNzd29yZCkge1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCBnb0JhY2sgPSB1c2VHb0JhY2soJy9hY2NvdW50cycpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCBbcHJpdmF0ZUtleUNoYWluLCBzZXRQcml2YXRlS2V5Q2hhaW5dID0gdXNlU3RhdGU8UHJpdmF0ZUtleUNoYWluPihcbiAgICBQcml2YXRlS2V5Q2hhaW4uQyxcbiAgKTtcbiAgY29uc3QgW3Bhc3N3b3JkLCBzZXRQYXNzd29yZF0gPSB1c2VTdGF0ZSgnJyk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPFN0YWNrPlxuICAgICAgICA8UGFnZVRpdGxlXG4gICAgICAgICAgbWFyZ2luPXsnMjJweCAwIDRweCAwJ31cbiAgICAgICAgICBvbkJhY2tDbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgY2FwdHVyZSgnRXhwb3J0UHJpdmF0ZUtleUNhbmNlbGxlZCcpO1xuICAgICAgICAgICAgZ29CYWNrKCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdFbnRlciBQYXNzd29yZCcpfVxuICAgICAgICA8L1BhZ2VUaXRsZT5cbiAgICAgICAgPFN0YWNrIHN4PXt7IGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgIDxJY29uV3JhcHBlcj5cbiAgICAgICAgICAgIDxLZXlJY29uIHNpemU9ezMyfSAvPlxuICAgICAgICAgIDwvSWNvbldyYXBwZXI+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIHthY2NvdW50VHlwZSA9PT0gU2VjcmV0VHlwZS5NbmVtb25pYyAmJiAoXG4gICAgICAgICAgPFN0YWNrIHN4PXt7IHB4OiAyLCBtdDogMyB9fT5cbiAgICAgICAgICAgIDxEcm9wZG93blxuICAgICAgICAgICAgICBTZWxlY3RQcm9wcz17e1xuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogUHJpdmF0ZUtleUNoYWluLkMsXG4gICAgICAgICAgICAgICAgbmF0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5RW1wdHk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlbmRlclZhbHVlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzd2l0Y2ggKHByaXZhdGVLZXlDaGFpbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFByaXZhdGVLZXlDaGFpbi5DOlxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8VHlwb2dyYXBoeT57dCgnQy1DaGFpbicpfTwvVHlwb2dyYXBoeT47XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgUHJpdmF0ZUtleUNoYWluLlhQOlxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8VHlwb2dyYXBoeT57dCgnWC9QLUNoYWluJyl9PC9UeXBvZ3JhcGh5PjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgY2hhaW4gPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgIGlmIChjaGFpbiAmJiBjaGFpbiAhPT0gcHJpdmF0ZUtleUNoYWluKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFByaXZhdGVLZXlDaGFpbihjaGFpbiBhcyBQcml2YXRlS2V5Q2hhaW4pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0aGUgQHRzLWlnbm9yZSwgYmVjYXVzZSBNVUkncyBcIm5lc3RlZCBwcm9wc1wiIChzdWNoIGFzIFNlbGVjdFByb3BzKVxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBhbGxvdyBwYXNzaW5nIGRhdGEtYXR0cmlidXRlcy5cbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICdkYXRhLXRlc3RpZCc6ICdwcml2YXRlLWtleS1jaGFpbi1kcm9wZG93bicsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGxhYmVsPXt0KCdTZWxlY3QgY2hhaW4nKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPERyb3Bkb3duSXRlbVxuICAgICAgICAgICAgICAgIHZhbHVlPXtQcml2YXRlS2V5Q2hhaW4uQ31cbiAgICAgICAgICAgICAgICBzZWxlY3RlZD17cHJpdmF0ZUtleUNoYWluID09PSBQcml2YXRlS2V5Q2hhaW4uQ31cbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInByaXZhdGUta2V5LWNoYWluLWRyb3Bkb3duLWl0ZW0tY1wiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeT57dCgnQy1DaGFpbicpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICAgIDxEcm9wZG93bkl0ZW1cbiAgICAgICAgICAgICAgICB2YWx1ZT17UHJpdmF0ZUtleUNoYWluLlhQfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtwcml2YXRlS2V5Q2hhaW4gPT09IFByaXZhdGVLZXlDaGFpbi5YUH1cbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInByaXZhdGUta2V5LWNoYWluLWRyb3Bkb3duLWl0ZW0teHBcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHk+e3QoJ1gvUC1DaGFpbicpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgPC9Ecm9wZG93bkl0ZW0+XG4gICAgICAgICAgICA8L0Ryb3Bkb3duPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICl9XG4gICAgICAgIDxTdGFjayBzeD17eyBweDogMiwgbXQ6IDIgfX0+XG4gICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYXNzd29yZC1pbnB1dFwiXG4gICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICAgICAgbGFiZWw9e3QoJ1Bhc3N3b3JkJyl9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFBhc3N3b3JkKGUuY3VycmVudFRhcmdldC52YWx1ZS50cmltKCkpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0VudGVyIFBhc3N3b3JkJyl9XG4gICAgICAgICAgICBlcnJvcj17ISFlcnJvck1lc3NhZ2V9XG4gICAgICAgICAgICBoZWxwZXJUZXh0PXtlcnJvck1lc3NhZ2V9XG4gICAgICAgICAgICBzaXplPVwibWVkaXVtXCJcbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgICBvbktleVByZXNzPXsoZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICBvblN1Ym1pdChwYXNzd29yZCwgcHJpdmF0ZUtleUNoYWluKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIHA6IDIsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZXhwb3J0LXByaXZhdGUta2V5LWVudGVyLXBhc3N3b3JkLWNhbmNlbFwiXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJjb250YWluZWRcIlxuICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBjYXB0dXJlKCdFeHBvcnRQcml2YXRlS2V5Q2FuY2VsbGVkJyk7XG4gICAgICAgICAgICAgIGhpc3RvcnkucmVwbGFjZSgnL2FjY291bnRzJyk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgb25TdWJtaXQocGFzc3dvcmQsIHByaXZhdGVLZXlDaGFpbik7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJleHBvcnQtcHJpdmF0ZS1rZXktZW50ZXItcGFzc3dvcmQtbmV4dFwiXG4gICAgICAgICAgICB0eXBlPVwicHJpbWFyeVwiXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJjb250YWluZWRcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFwYXNzd29yZH1cbiAgICAgICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdOZXh0Jyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBFbnRlclBhc3N3b3JkIH0gZnJvbSAnLi9FbnRlclBhc3N3b3JkJztcbmltcG9ydCB7IFNob3dQcml2YXRlS2V5IH0gZnJvbSAnLi9TaG93UHJpdmF0ZUtleSc7XG5pbXBvcnQgeyBTdGFjaywgdXNlVGhlbWUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgR2V0UHJpdmF0ZUtleUhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvaGFuZGxlcnMvZ2V0UHJpdmF0ZUtleSc7XG5pbXBvcnQgeyBFeHRlbnNpb25SZXF1ZXN0IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL2Nvbm5lY3Rpb25zL2V4dGVuc2lvbkNvbm5lY3Rpb24vbW9kZWxzJztcbmltcG9ydCB7IHVzZUNvbm5lY3Rpb25Db250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db25uZWN0aW9uUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTG9jYXRpb24gfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQge1xuICBBY2NvdW50VHlwZSxcbiAgR2V0UHJpdmF0ZUtleUVycm9yVHlwZXMsXG4gIFByaXZhdGVLZXlDaGFpbixcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgU2VjcmV0VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9zZWNyZXRzL21vZGVscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBFeHBvcnRQcml2YXRlS2V5KCkge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHsgcmVxdWVzdCB9ID0gdXNlQ29ubmVjdGlvbkNvbnRleHQoKTtcbiAgY29uc3QgeyBzZWFyY2ggfSA9IHVzZUxvY2F0aW9uKCk7XG4gIGNvbnN0IHsgYWNjb3VudHMgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IHdhbGxldHMgfSA9IHVzZVdhbGxldENvbnRleHQoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcblxuICBjb25zdCBbdHlwZSwgc2V0VHlwZV0gPSB1c2VTdGF0ZTxcbiAgICBTZWNyZXRUeXBlLk1uZW1vbmljIHwgQWNjb3VudFR5cGUuSU1QT1JURUQgfCBudWxsXG4gID4obnVsbCk7XG4gIGNvbnN0IFtpbmRleCwgc2V0SW5kZXhdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtpZCwgc2V0SWRdID0gdXNlU3RhdGUoJycpO1xuXG4gIGNvbnN0IFtwcml2YXRlS2V5LCBzZXRQcml2YXRlS2V5XSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBvblN1Ym1pdCA9IHVzZUNhbGxiYWNrKFxuICAgIChwYXNzd29yZDogc3RyaW5nLCBjaGFpbjogUHJpdmF0ZUtleUNoYWluKSA9PiB7XG4gICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgY2FwdHVyZSgnRXhwb3J0UHJpdmF0ZUtleUVycm9ySW52YWxpZFR5cGUnKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHR5cGUhJyk7XG4gICAgICB9XG4gICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgICByZXF1ZXN0PEdldFByaXZhdGVLZXlIYW5kbGVyPih7XG4gICAgICAgIG1ldGhvZDogRXh0ZW5zaW9uUmVxdWVzdC5BQ0NPVU5UX0dFVF9QUklWQVRFS0VZLFxuICAgICAgICBwYXJhbXM6IFt7IHR5cGUsIGluZGV4LCBpZCwgcGFzc3dvcmQsIGNoYWluIH1dLFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgIHNldFByaXZhdGVLZXkocmVzKTtcbiAgICAgICAgICBjYXB0dXJlKCdFeHBvcnRQcml2YXRlS2V5U3VjY2Vzc2Z1bCcsIHsgY2hhaW4gfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZTogeyB0eXBlOiBHZXRQcml2YXRlS2V5RXJyb3JUeXBlczsgbWVzc2FnZTogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICBpZiAoZS50eXBlID09PSBHZXRQcml2YXRlS2V5RXJyb3JUeXBlcy5QYXNzd29yZCkge1xuICAgICAgICAgICAgc2V0RXJyb3IodCgnSW52YWxpZCBQYXNzd29yZCcpKTtcbiAgICAgICAgICAgIGNhcHR1cmUoJ0V4cG9ydFByaXZhdGVLZXlFcnJvckludmFsaWRQYXNzd29yZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZS50eXBlID09PSBHZXRQcml2YXRlS2V5RXJyb3JUeXBlcy5DaGFpbikge1xuICAgICAgICAgICAgc2V0RXJyb3IodCgnSW52YWxpZCBDaGFpbicpKTtcbiAgICAgICAgICAgIGNhcHR1cmUoJ0V4cG9ydFByaXZhdGVLZXlFcnJvckludmFsaWRDaGFpbicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRFcnJvcih0KCdTb21ldGhpbmcgYmFkIGhhcHBlbmVkIHBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIhJykpO1xuICAgICAgICAgIGNhcHR1cmUoJ0V4cG9ydFByaXZhdGVLZXlGYWlsZWQnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgW2NhcHR1cmUsIGlkLCBpbmRleCwgcmVxdWVzdCwgdCwgdHlwZV0sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHNlYXJjaCk7XG4gICAgY29uc3QgYWNjb3VudElkID0gdXJsLmdldCgnYWNjb3VudElkJyk7XG5cbiAgICBzZXRJZChhY2NvdW50SWQgfHwgJycpO1xuXG4gICAgY29uc3QgaXNJbXBvcnRlZCA9ICEhKGFjY291bnRJZCAmJiBhY2NvdW50cy5pbXBvcnRlZFthY2NvdW50SWRdKSB8fCBmYWxzZTtcblxuICAgIGlmIChpc0ltcG9ydGVkKSB7XG4gICAgICBzZXRUeXBlKEFjY291bnRUeXBlLklNUE9SVEVEKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhY2NvdW50ID0gT2JqZWN0LnZhbHVlcyhhY2NvdW50cy5wcmltYXJ5KVxuICAgICAgLmZsYXQoKVxuICAgICAgLmZpbmQoKHByaW1hcnlBY2NvdW50KSA9PiB7XG4gICAgICAgIHJldHVybiBwcmltYXJ5QWNjb3VudC5pZCA9PT0gYWNjb3VudElkO1xuICAgICAgfSk7XG5cbiAgICBpZiAoIWFjY291bnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3YWxsZXQgPSB3YWxsZXRzLmZpbmQoKHcpID0+IHcuaWQgPT09IGFjY291bnQud2FsbGV0SWQpO1xuICAgIGlmICh3YWxsZXQ/LnR5cGUgPT09IFNlY3JldFR5cGUuTW5lbW9uaWMpIHtcbiAgICAgIHNldEluZGV4KGFjY291bnQuaW5kZXgpO1xuICAgICAgc2V0VHlwZShTZWNyZXRUeXBlLk1uZW1vbmljKTtcbiAgICB9XG4gIH0sIFthY2NvdW50cywgaW5kZXgsIHNlYXJjaCwgd2FsbGV0c10pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHshcHJpdmF0ZUtleSAmJiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxFbnRlclBhc3N3b3JkXG4gICAgICAgICAgICAgIGFjY291bnRUeXBlPXt0eXBlfVxuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U9e2Vycm9yfVxuICAgICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgICAgICAgICAgb25TdWJtaXQ9e29uU3VibWl0fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cbiAgICAgICAge3ByaXZhdGVLZXkgJiYgPFNob3dQcml2YXRlS2V5IHByaXZhdGVLZXk9e3ByaXZhdGVLZXl9IC8+fVxuICAgICAgPC9TdGFjaz5cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEFsZXJ0LFxuICBBbGVydFRpdGxlLFxuICBBbGVydENvbnRlbnQsXG4gIEJ1dHRvbixcbiAgS2V5SWNvbixcbiAgU3RhY2ssXG4gIHVzZVRoZW1lLFxuICBUeXBvZ3JhcGh5LFxuICBDb3B5SWNvbixcbiAgdG9hc3QsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IHsgSWNvbldyYXBwZXIgfSBmcm9tICcuL0VudGVyUGFzc3dvcmQnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VHb0JhY2sgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUdvQmFjayc7XG5cbmludGVyZmFjZSBTaG93UHJpdmF0ZUtleVByb3BzIHtcbiAgcHJpdmF0ZUtleTogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2hvd1ByaXZhdGVLZXkoeyBwcml2YXRlS2V5IH06IFNob3dQcml2YXRlS2V5UHJvcHMpIHtcbiAgY29uc3QgZ29CYWNrID0gdXNlR29CYWNrKCcvYWNjb3VudHMnKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCBvbkNvcHkgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocHJpdmF0ZUtleSB8fCAnJyk7XG4gICAgY2FwdHVyZSgnRXhwb3J0UHJpdmF0ZUtleUNvcGllZCcpO1xuICAgIHRvYXN0LnN1Y2Nlc3ModCgnQ29waWVkIScpLCB7IGR1cmF0aW9uOiAyMDAwIH0pO1xuICB9LCBbY2FwdHVyZSwgcHJpdmF0ZUtleSwgdF0pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxTdGFjaz5cbiAgICAgICAgPFBhZ2VUaXRsZSBtYXJnaW49eycyMnB4IDAgNHB4IDAnfSBvbkJhY2tDbGljaz17Z29CYWNrfT5cbiAgICAgICAgICB7dCgnWW91ciBQcml2YXRlIEtleScpfVxuICAgICAgICA8L1BhZ2VUaXRsZT5cbiAgICAgICAgPFN0YWNrIHN4PXt7IHB4OiAyLCByb3dHYXA6IDMgfX0+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgPEljb25XcmFwcGVyPlxuICAgICAgICAgICAgICA8S2V5SWNvbiBzaXplPXszMn0gLz5cbiAgICAgICAgICAgIDwvSWNvbldyYXBwZXI+XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8QWxlcnQgc2V2ZXJpdHk9XCJ3YXJuaW5nXCI+XG4gICAgICAgICAgICA8QWxlcnRUaXRsZT57dCgnUHJvdGVjdCB5b3VyIFByaXZhdGUgS2V5Jyl9PC9BbGVydFRpdGxlPlxuICAgICAgICAgICAgPEFsZXJ0Q29udGVudD5cbiAgICAgICAgICAgICAge3QoXG4gICAgICAgICAgICAgICAgJ0RvIG5vdCBzaGFyZSB5b3VyIFByaXZhdGUgS2V5IHdpdGggYW55b25lIGluY2x1ZGluZyBDb3JlIFN1cHBvcnQnLFxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9BbGVydENvbnRlbnQ+XG4gICAgICAgICAgPC9BbGVydD5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ29weX1cbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF0sXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICBjb2x1bW5HYXA6IDIsXG4gICAgICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY29weS1wcml2YXRlLWtleVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0YWNrIHN4PXt7IHdvcmRCcmVhazogJ2JyZWFrLWFsbCcgfX0+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MVwiPntwcml2YXRlS2V5fTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8U3RhY2sgc3g9e3sgcm93R2FwOiAxIH19PlxuICAgICAgICAgICAgICA8Q29weUljb24gc2l6ZT17MjR9IC8+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgcDogMixcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGlzdG9yeS5yZXBsYWNlKCcvYWNjb3VudHMnKX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZXhwb3J0LXByaXZhdGUta2V5LWNhbmNlbFwiXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJjb250YWluZWRcIlxuICAgICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiZXhwb3J0LXByaXZhdGUta2V5LWRvbmVcIlxuICAgICAgICAgICAgdHlwZT1cInByaW1hcnlcIlxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICB2YXJpYW50PVwiY29udGFpbmVkXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhpc3RvcnkucmVwbGFjZSgnL2FjY291bnRzJyl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ0RvbmUnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC8+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiQ2hldnJvbkRvd25JY29uIiwiTWVudUl0ZW0iLCJTZWxlY3QiLCJ1c2VUaGVtZSIsIlRyaWdnZXJJY29uIiwicmVzdCIsInRoZW1lIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiX2V4dGVuZHMiLCJzaXplIiwic3giLCJ0cmFuc2l0aW9uIiwicmlnaHQiLCJzcGFjaW5nIiwidG9wIiwidHJhbnNmb3JtIiwidXNlRHJvcGRvd25Qcm9wcyIsIklucHV0UHJvcHMiLCJpbnB1dFN4Iiwib3RoZXJJbnB1dFByb3BzIiwiU2VsZWN0UHJvcHMiLCJNZW51UHJvcHMiLCJQYXBlclByb3BzIiwicGFwZXJTeCIsIm90aGVyUGFwZXJQcm9wcyIsIm90aGVyTWVudVByb3BzIiwib3RoZXJTZWxlY3RQcm9wcyIsInBhZGRpbmciLCJoZWlnaHQiLCJib3JkZXIiLCJwYWxldHRlIiwiZ3JleSIsImJhY2tncm91bmRDb2xvciIsImZvbnRTaXplIiwidHlwb2dyYXBoeSIsImJvZHkxIiwiSWNvbkNvbXBvbmVudCIsIm1heFdpZHRoIiwibWF4SGVpZ2h0IiwibXQiLCJEcm9wZG93biIsImNoaWxkcmVuIiwicHJvcHMiLCJ2YXJpYW50IiwiaW5wdXRMYWJlbFByb3BzIiwiYm9keTIiLCJEcm9wZG93bkl0ZW0iLCJtaW5IZWlnaHQiLCJnYXAiLCJCdXR0b24iLCJLZXlJY29uIiwiU3RhY2siLCJUZXh0RmllbGQiLCJUeXBvZ3JhcGh5Iiwic3R5bGVkIiwiUHJpdmF0ZUtleUNoYWluIiwiU2VjcmV0VHlwZSIsIlBhZ2VUaXRsZSIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZVRyYW5zbGF0aW9uIiwidXNlSGlzdG9yeSIsInVzZUdvQmFjayIsIkljb25XcmFwcGVyIiwiRW50ZXJQYXNzd29yZCIsImFjY291bnRUeXBlIiwiZXJyb3JNZXNzYWdlIiwiaXNMb2FkaW5nIiwib25TdWJtaXQiLCJoaXN0b3J5IiwiZ29CYWNrIiwidCIsImNhcHR1cmUiLCJwcml2YXRlS2V5Q2hhaW4iLCJzZXRQcml2YXRlS2V5Q2hhaW4iLCJDIiwicGFzc3dvcmQiLCJzZXRQYXNzd29yZCIsIkZyYWdtZW50IiwibWFyZ2luIiwib25CYWNrQ2xpY2siLCJhbGlnbkl0ZW1zIiwiTW5lbW9uaWMiLCJweCIsImRlZmF1bHRWYWx1ZSIsIm5hdGl2ZSIsImRpc3BsYXlFbXB0eSIsInJlbmRlclZhbHVlIiwiWFAiLCJvbkNoYW5nZSIsImUiLCJjaGFpbiIsInRhcmdldCIsInZhbHVlIiwibGFiZWwiLCJzZWxlY3RlZCIsInR5cGUiLCJjdXJyZW50VGFyZ2V0IiwidHJpbSIsInBsYWNlaG9sZGVyIiwiZXJyb3IiLCJoZWxwZXJUZXh0IiwiZnVsbFdpZHRoIiwiYXV0b0ZvY3VzIiwib25LZXlQcmVzcyIsImtleSIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsInAiLCJ3aWR0aCIsImZsZXhHcm93IiwiY29sb3IiLCJvbkNsaWNrIiwicmVwbGFjZSIsImRpc2FibGVkIiwidXNlQ2FsbGJhY2siLCJ1c2VFZmZlY3QiLCJTaG93UHJpdmF0ZUtleSIsIkV4dGVuc2lvblJlcXVlc3QiLCJ1c2VDb25uZWN0aW9uQ29udGV4dCIsInVzZUxvY2F0aW9uIiwidXNlQWNjb3VudHNDb250ZXh0IiwiQWNjb3VudFR5cGUiLCJHZXRQcml2YXRlS2V5RXJyb3JUeXBlcyIsInVzZVdhbGxldENvbnRleHQiLCJFeHBvcnRQcml2YXRlS2V5IiwicmVxdWVzdCIsInNlYXJjaCIsImFjY291bnRzIiwid2FsbGV0cyIsInNldFR5cGUiLCJpbmRleCIsInNldEluZGV4IiwiaWQiLCJzZXRJZCIsInByaXZhdGVLZXkiLCJzZXRQcml2YXRlS2V5Iiwic2V0RXJyb3IiLCJzZXRJc0xvYWRpbmciLCJFcnJvciIsIm1ldGhvZCIsIkFDQ09VTlRfR0VUX1BSSVZBVEVLRVkiLCJwYXJhbXMiLCJ0aGVuIiwicmVzIiwiY2F0Y2giLCJQYXNzd29yZCIsIkNoYWluIiwiZmluYWxseSIsInVybCIsIlVSTFNlYXJjaFBhcmFtcyIsImFjY291bnRJZCIsImdldCIsImlzSW1wb3J0ZWQiLCJpbXBvcnRlZCIsIklNUE9SVEVEIiwiYWNjb3VudCIsIk9iamVjdCIsInZhbHVlcyIsInByaW1hcnkiLCJmbGF0IiwiZmluZCIsInByaW1hcnlBY2NvdW50Iiwid2FsbGV0IiwidyIsIndhbGxldElkIiwiYmFja2dyb3VuZCIsInBhcGVyIiwiQWxlcnQiLCJBbGVydFRpdGxlIiwiQWxlcnRDb250ZW50IiwiQ29weUljb24iLCJ0b2FzdCIsIm9uQ29weSIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInN1Y2Nlc3MiLCJkdXJhdGlvbiIsInJvd0dhcCIsInNldmVyaXR5IiwiY29sdW1uR2FwIiwiY3Vyc29yIiwiYm9yZGVyUmFkaXVzIiwid29yZEJyZWFrIl0sInNvdXJjZVJvb3QiOiIifQ==