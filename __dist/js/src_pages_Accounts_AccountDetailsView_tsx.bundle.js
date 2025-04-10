"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Accounts_AccountDetailsView_tsx"],{

/***/ "./src/pages/Accounts/AccountDetailsView.tsx":
/*!***************************************************!*\
  !*** ./src/pages/Accounts/AccountDetailsView.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountDetailsView": () => (/* binding */ AccountDetailsView)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useScopedToast */ "./src/hooks/useScopedToast.ts");
/* harmony import */ var _src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/background/services/accounts/utils/typeGuards */ "./src/background/services/accounts/utils/typeGuards.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/stripAddressPrefix */ "./src/utils/stripAddressPrefix.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* harmony import */ var _components_OverflowingTypography__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/OverflowingTypography */ "./src/pages/Accounts/components/OverflowingTypography.tsx");
/* harmony import */ var _components_NoAccountsFound__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/NoAccountsFound */ "./src/pages/Accounts/components/NoAccountsFound.tsx");
/* harmony import */ var _components_AccountDetailsAddressRow__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/AccountDetailsAddressRow */ "./src/pages/Accounts/components/AccountDetailsAddressRow.tsx");
/* harmony import */ var _hooks_useAccountRename__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./hooks/useAccountRename */ "./src/pages/Accounts/hooks/useAccountRename.tsx");
/* harmony import */ var _hooks_useAccountRemoval__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./hooks/useAccountRemoval */ "./src/pages/Accounts/hooks/useAccountRemoval.tsx");
/* harmony import */ var _hooks_usePrivateKeyExport__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./hooks/usePrivateKeyExport */ "./src/pages/Accounts/hooks/usePrivateKeyExport.ts");
/* harmony import */ var _components_WalletTypeIcon__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/WalletTypeIcon */ "./src/pages/Accounts/components/WalletTypeIcon.tsx");
/* harmony import */ var _hooks_useWalletTypeName__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./hooks/useWalletTypeName */ "./src/pages/Accounts/hooks/useWalletTypeName.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");























const AccountDetailsView = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_20__.useTranslation)();
  const toast = (0,_src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_4__.useScopedToast)('account-switcher');
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_21__["default"])();
  const {
    isAccountSelectable
  } = (0,_providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_11__.useAccountManager)();
  const {
    accountId
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_22__.useParams)();
  const {
    getAccountById
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_7__.useAccountsContext)();
  const {
    getWallet
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_6__.useWalletContext)();
  const account = getAccountById(accountId);
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_22__.useHistory)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_9__.useAnalyticsContext)();
  const walletDetails = (0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_5__.isPrimaryAccount)(account) ? getWallet(account.walletId) : getWallet(account?.id ?? '');
  const {
    isPrivateKeyAvailable,
    showPrivateKey
  } = (0,_hooks_usePrivateKeyExport__WEBPACK_IMPORTED_MODULE_17__.usePrivateKeyExport)(account, walletDetails?.type);
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_10__.useFeatureFlagContext)();
  const canPrimaryAccountsBeRemoved = featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_3__.FeatureGates.PRIMARY_ACCOUNT_REMOVAL];
  const onAddressCopy = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((addressToCopy, eventName) => () => {
    navigator.clipboard.writeText((0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_8__.stripAddressPrefix)(addressToCopy));
    toast.success(t('Copied!'), {
      duration: 1000
    });
    capture(eventName, {
      type: account?.type
    });
  }, [t, account?.type, capture, toast]);
  const [isContextMenuOpen, setIsContextMenuOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const contextMenuRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const toBeRemoved = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => account?.id ? [account.id] : [], [account?.id]);
  const {
    prompt: promptRename,
    renderDialog: renameDialog
  } = (0,_hooks_useAccountRename__WEBPACK_IMPORTED_MODULE_15__.useAccountRename)(account);
  const {
    prompt: promptRemove,
    renderDialog: removeDialog
  } = (0,_hooks_useAccountRemoval__WEBPACK_IMPORTED_MODULE_16__.useAccountRemoval)(toBeRemoved);
  const getWalletType = (0,_hooks_useWalletTypeName__WEBPACK_IMPORTED_MODULE_19__.useWalletTypeName)(walletDetails, account);
  if (!account) {
    return /*#__PURE__*/React.createElement(_components_NoAccountsFound__WEBPACK_IMPORTED_MODULE_13__.NoAccountsFound, {
      origin: _components_NoAccountsFound__WEBPACK_IMPORTED_MODULE_13__.Origin.Url
    });
  }
  const isDeletable = isAccountSelectable(account) && (account.type !== _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_2__.AccountType.PRIMARY || canPrimaryAccountsBeRemoved);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      background: theme.palette.background.paper
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      pl: 0.25,
      pr: 1,
      py: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.IconButton, {
    "data-testid": "account-details-back-btn",
    onClick: () => history.replace('/accounts'),
    sx: {
      padding: 0.25,
      '> svg': {
        transition: 'color .15s ease-in-out, transform .15s ease-in-out'
      },
      ':hover svg': {
        color: 'secondary.lighter',
        transform: 'translateX(-2px)'
      }
    },
    disableRipple: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.ChevronLeftIcon, {
    size: 32
  })), /*#__PURE__*/React.createElement(_components_OverflowingTypography__WEBPACK_IMPORTED_MODULE_12__.OverflowingTypography, {
    variant: "h4",
    sx: {
      mr: 2,
      fontSize: 24,
      flexGrow: 1
    },
    "data-testid": "account-details-name"
  }, account.name), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.ClickAwayListener, {
    mouseEvent: "onMouseDown",
    onClickAway: () => setIsContextMenuOpen(false)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.IconButton, {
    sx: {
      ml: 3
    },
    ref: contextMenuRef,
    "data-testid": `account-details-edit-button`,
    onClick: e => {
      e.stopPropagation();
      setIsContextMenuOpen(open => !open);
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.MoreVerticalIcon, {
    size: 24
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Popper, {
    open: isContextMenuOpen,
    anchorEl: contextMenuRef.current,
    placement: "bottom-end",
    transition: true
  }, ({
    TransitionProps
  }) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, TransitionProps, {
    timeout: 250
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.MenuList, {
    sx: {
      p: 0,
      mb: 1,
      minWidth: 180,
      overflow: 'hidden',
      backgroundColor: 'grey.850',
      color: 'text.primary',
      border: '1px solid rgba(255,255,255,0.05)'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.MenuItem, {
    onClick: promptRename,
    "data-testid": "rename-account-button",
    sx: {
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      minHeight: '40px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Typography, {
    variant: "caption",
    color: "text.primary"
  }, t('Rename'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Tooltip, {
    title: isDeletable ? '' : t('Only the last account and secondary wallets can be deleted. First account cannot be deleted (delete the wallet instead).')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.MenuItem, {
    disabled: !isDeletable,
    onClick: promptRemove,
    "data-testid": "delete-account-button",
    sx: {
      minHeight: '40px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Typography, {
    variant: "caption",
    color: "error.main"
  }, t('Delete Account')))))))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      flexGrow: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Card, {
    sx: {
      backgroundColor: 'grey.850'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.CardContent, {
    sx: {
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      gap: 1.5
    },
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Divider, null)
  }, /*#__PURE__*/React.createElement(_components_AccountDetailsAddressRow__WEBPACK_IMPORTED_MODULE_14__.AccountDetailsAddressRow, {
    "data-testid": "account-address-c",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.AvalancheColorIcon, {
      size: 32
    }),
    label: t('Avalanche C-Chain'),
    address: account.addressC,
    copyHandler: onAddressCopy(account.addressC, 'AccountDetailsCAddressCopied')
  }), account.addressPVM && /*#__PURE__*/React.createElement(_components_AccountDetailsAddressRow__WEBPACK_IMPORTED_MODULE_14__.AccountDetailsAddressRow, {
    "data-testid": "account-address-px",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.XAndPChainsIcon, {
      size: 32
    }),
    label: t('Avalanche X/P-Chain'),
    address: account.addressPVM,
    copyHandler: onAddressCopy(account.addressPVM, 'AccountDetailsXPAddressCopied')
  }), account.addressBTC && /*#__PURE__*/React.createElement(_components_AccountDetailsAddressRow__WEBPACK_IMPORTED_MODULE_14__.AccountDetailsAddressRow, {
    "data-testid": "account-address-btc",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.BitcoinColorIcon, {
      size: 32
    }),
    label: t('Bitcoin'),
    address: account.addressBTC,
    copyHandler: onAddressCopy(account.addressBTC, 'AccountDetailsBTCAddressCopied')
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Card, {
    sx: {
      backgroundColor: 'grey.850',
      mt: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.CardContent, {
    sx: {
      px: 2,
      pt: 0,
      ':last-child': {
        pb: 0.5
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Divider, null)
  }, walletDetails && /*#__PURE__*/React.createElement(DetailsRow, {
    label: t('Type')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
    sx: {
      flexDirection: 'row',
      gap: 1,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_components_WalletTypeIcon__WEBPACK_IMPORTED_MODULE_18__.WalletTypeIcon, {
    walletDetails: walletDetails,
    size: 20,
    sx: {
      color: 'text.secondary'
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Typography, {
    variant: "body1",
    color: "text.secondary"
  }, getWalletType()))), walletDetails?.derivationPath && /*#__PURE__*/React.createElement(DetailsRow, {
    label: t('Derivation Path')
  }, /*#__PURE__*/React.createElement(_components_OverflowingTypography__WEBPACK_IMPORTED_MODULE_12__.OverflowingTypography, {
    variant: "body1",
    color: "text.secondary"
  }, walletDetails.derivationPath.toUpperCase() ?? '-')), walletDetails && /*#__PURE__*/React.createElement(DetailsRow, {
    label: t('Wallet')
  }, /*#__PURE__*/React.createElement(_components_OverflowingTypography__WEBPACK_IMPORTED_MODULE_12__.OverflowingTypography, {
    variant: "body1",
    color: "text.secondary"
  }, walletDetails.name)), isPrivateKeyAvailable && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Button, {
    variant: "text",
    color: "primary",
    size: "large",
    "data-testid": "export-private-key-button",
    endIcon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.ChevronRightIcon, {
      size: 20
    }),
    sx: {
      justifyContent: 'space-between',
      pl: 0,
      pr: 0.5,
      typography: 'body1'
    },
    fullWidth: true,
    onClick: showPrivateKey
  }, t('Show Private Key'))))), isPrivateKeyAvailable && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Typography, {
    variant: "caption",
    sx: {
      color: 'text.tertiary',
      fontSize: 11,
      px: 1,
      mt: 2
    }
  }, t('A private key is like a password for this specific account. Keep it secure, anyone with this private key can access your funds.'))), renameDialog(), removeDialog());
};
const DetailsRow = ({
  label,
  children
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Stack, {
  sx: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    py: 1.5,
    gap: 2
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_23__.Typography, {
  variant: "body1",
  color: "text.primary"
}, label), children);

/***/ }),

/***/ "./src/pages/Accounts/components/AccountDetailsAddressRow.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/Accounts/components/AccountDetailsAddressRow.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountDetailsAddressRow": () => (/* binding */ AccountDetailsAddressRow)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/stripAddressPrefix */ "./src/utils/stripAddressPrefix.ts");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const AccountDetailsAddressRow = ({
  icon,
  label,
  address,
  copyHandler,
  ...props
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    direction: "row",
    sx: {
      gap: 2,
      alignItems: 'start'
    }
  }, props), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    direction: "row",
    sx: {
      gap: 1,
      flexGrow: 1
    }
  }, icon, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold',
      whiteSpace: 'nowrap'
    }
  }, label), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "caption",
    color: "text.secondary",
    monospace: true
  }, (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_2__.truncateAddress)((0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_1__.stripAddressPrefix)(address), 16)))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    color: "secondary",
    size: "small",
    onClick: copyHandler,
    sx: {
      alignSelf: 'center'
    },
    "data-testid": "address-copy-button"
  }, t('Copy')));
};

/***/ }),

/***/ "./src/pages/Accounts/components/NoAccountsFound.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/Accounts/components/NoAccountsFound.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoAccountsFound": () => (/* binding */ NoAccountsFound),
/* harmony export */   "Origin": () => (/* binding */ Origin)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useGoBack */ "./src/hooks/useGoBack.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



let Origin = /*#__PURE__*/function (Origin) {
  Origin[Origin["Search"] = 0] = "Search";
  Origin[Origin["Url"] = 1] = "Url";
  return Origin;
}({});
const NoAccountsFound = ({
  origin
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const close = (0,_src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_0__.useGoBack)('/accounts');
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      px: 4,
      width: 1,
      height: 1,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 2,
      backgroundColor: 'grey.900'
    }
  }, origin === Origin.Search && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.SearchOffIcon, {
    size: 72
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, t('No search results found')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2"
  }, t('Try typing the information again or go back to the account manager.'))), origin === Origin.Url && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AlertCircleIcon, {
    size: 72
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, t('Account not found')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t(`Looks like you got here by accident.`))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    size: "large",
    onClick: close,
    fullWidth: true,
    sx: {
      mt: 2
    }
  }, t('Close')));
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/useWalletTypeName.tsx":
/*!********************************************************!*\
  !*** ./src/pages/Accounts/hooks/useWalletTypeName.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useWalletTypeName": () => (/* binding */ useWalletTypeName)
/* harmony export */ });
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");




const useWalletTypeName = (walletDetails, account) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const getWalletType = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
    switch (walletDetails?.type) {
      case _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.Ledger:
      case _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.LedgerLive:
        return t('Ledger');
      case _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.Mnemonic:
        return t('Recovery Phrase');
      case _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.PrivateKey:
        return t('Imported Private Key');
      case _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.Fireblocks:
        return t('Fireblocks');
      case _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.WalletConnect:
        return t('WalletConnect');
      case _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.Keystone:
        return t('Keystone');
      case _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.Seedless:
        return walletDetails.authProvider ? t('Seedless ({{provider}})', {
          provider: walletDetails.authProvider
        }) : t('Seedless');
    }
    switch (account?.type) {
      case _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.AccountType.IMPORTED:
        return t('Imported Private Key');
      case _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.AccountType.FIREBLOCKS:
        return t('Fireblocks');
      case _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_0__.AccountType.WALLET_CONNECT:
        return t('WalletConnect');
    }
    return t('Unknown');
  }, [account?.type, t, walletDetails?.type, walletDetails?.authProvider]);
  return getWalletType;
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FjY291bnRzX0FjY291bnREZXRhaWxzVmlld190c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUF5RDtBQUNNO0FBQ2hCO0FBc0JWO0FBRWtDO0FBQ0s7QUFDakI7QUFDMkI7QUFDdEI7QUFDSTtBQUNEO0FBQ0c7QUFDSztBQUVKO0FBQ0k7QUFDSjtBQUNVO0FBQ3JCO0FBQ0U7QUFDSTtBQUNMO0FBQ0M7QUFFdkQsTUFBTThDLGtCQUFrQixHQUFHQSxDQUFBLEtBQU07RUFDdEMsTUFBTTtJQUFFQztFQUFFLENBQUMsR0FBR3pDLDhEQUFjLEVBQUU7RUFDOUIsTUFBTTBDLEtBQUssR0FBR25CLHlFQUFjLENBQUMsa0JBQWtCLENBQUM7RUFDaEQsTUFBTW9CLEtBQUssR0FBR3ZCLHdFQUFRLEVBQUU7RUFDeEIsTUFBTTtJQUFFd0I7RUFBb0IsQ0FBQyxHQUFHZCxxRkFBaUIsRUFBRTtFQUNuRCxNQUFNO0lBQUVlO0VBQVUsQ0FBQyxHQUFHbEQsNERBQVMsRUFBeUI7RUFDeEQsTUFBTTtJQUFFbUQ7RUFBZSxDQUFDLEdBQUdwQixrRkFBa0IsRUFBRTtFQUMvQyxNQUFNO0lBQUVxQjtFQUFVLENBQUMsR0FBR3RCLDhFQUFnQixFQUFFO0VBQ3hDLE1BQU11QixPQUFPLEdBQUdGLGNBQWMsQ0FBQ0QsU0FBUyxDQUFDO0VBQ3pDLE1BQU1JLE9BQU8sR0FBR3ZELDZEQUFVLEVBQUU7RUFDNUIsTUFBTTtJQUFFd0Q7RUFBUSxDQUFDLEdBQUd0QixvRkFBbUIsRUFBRTtFQUN6QyxNQUFNdUIsYUFBYSxHQUFHM0Isb0dBQWdCLENBQUN3QixPQUFPLENBQUMsR0FDM0NELFNBQVMsQ0FBQ0MsT0FBTyxDQUFDSSxRQUFRLENBQUMsR0FDM0JMLFNBQVMsQ0FBQ0MsT0FBTyxFQUFFSyxFQUFFLElBQUksRUFBRSxDQUFDO0VBQ2hDLE1BQU07SUFBRUMscUJBQXFCO0lBQUVDO0VBQWUsQ0FBQyxH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ZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQWNjb3VudHMvQWNjb3VudERldGFpbHNWaWV3LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2NvbXBvbmVudHMvQWNjb3VudERldGFpbHNBZGRyZXNzUm93LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2NvbXBvbmVudHMvTm9BY2NvdW50c0ZvdW5kLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2hvb2tzL3VzZVdhbGxldFR5cGVOYW1lLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VIaXN0b3J5LCB1c2VQYXJhbXMgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEF2YWxhbmNoZUNvbG9ySWNvbixcbiAgQml0Y29pbkNvbG9ySWNvbixcbiAgQnV0dG9uLFxuICBDYXJkLFxuICBDYXJkQ29udGVudCxcbiAgQ2hldnJvbkxlZnRJY29uLFxuICBDaGV2cm9uUmlnaHRJY29uLFxuICBDbGlja0F3YXlMaXN0ZW5lcixcbiAgRGl2aWRlcixcbiAgR3JvdyxcbiAgSWNvbkJ1dHRvbixcbiAgTWVudUl0ZW0sXG4gIE1lbnVMaXN0LFxuICBNb3JlVmVydGljYWxJY29uLFxuICBQb3BwZXIsXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICBYQW5kUENoYWluc0ljb24sXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyBBY2NvdW50VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgRmVhdHVyZUdhdGVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2ZlYXR1cmVGbGFncy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlU2NvcGVkVG9hc3QgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVNjb3BlZFRvYXN0JztcbmltcG9ydCB7IGlzUHJpbWFyeUFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvdXRpbHMvdHlwZUd1YXJkcyc7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgc3RyaXBBZGRyZXNzUHJlZml4IH0gZnJvbSAnQHNyYy91dGlscy9zdHJpcEFkZHJlc3NQcmVmaXgnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlRmVhdHVyZUZsYWdDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9GZWF0dXJlRmxhZ3NQcm92aWRlcic7XG5cbmltcG9ydCB7IHVzZUFjY291bnRNYW5hZ2VyIH0gZnJvbSAnLi9wcm92aWRlcnMvQWNjb3VudE1hbmFnZXJQcm92aWRlcic7XG5pbXBvcnQgeyBPdmVyZmxvd2luZ1R5cG9ncmFwaHkgfSBmcm9tICcuL2NvbXBvbmVudHMvT3ZlcmZsb3dpbmdUeXBvZ3JhcGh5JztcbmltcG9ydCB7IE5vQWNjb3VudHNGb3VuZCwgT3JpZ2luIH0gZnJvbSAnLi9jb21wb25lbnRzL05vQWNjb3VudHNGb3VuZCc7XG5pbXBvcnQgeyBBY2NvdW50RGV0YWlsc0FkZHJlc3NSb3cgfSBmcm9tICcuL2NvbXBvbmVudHMvQWNjb3VudERldGFpbHNBZGRyZXNzUm93JztcbmltcG9ydCB7IHVzZUFjY291bnRSZW5hbWUgfSBmcm9tICcuL2hvb2tzL3VzZUFjY291bnRSZW5hbWUnO1xuaW1wb3J0IHsgdXNlQWNjb3VudFJlbW92YWwgfSBmcm9tICcuL2hvb2tzL3VzZUFjY291bnRSZW1vdmFsJztcbmltcG9ydCB7IHVzZVByaXZhdGVLZXlFeHBvcnQgfSBmcm9tICcuL2hvb2tzL3VzZVByaXZhdGVLZXlFeHBvcnQnO1xuaW1wb3J0IHsgV2FsbGV0VHlwZUljb24gfSBmcm9tICcuL2NvbXBvbmVudHMvV2FsbGV0VHlwZUljb24nO1xuaW1wb3J0IHsgdXNlV2FsbGV0VHlwZU5hbWUgfSBmcm9tICcuL2hvb2tzL3VzZVdhbGxldFR5cGVOYW1lJztcblxuZXhwb3J0IGNvbnN0IEFjY291bnREZXRhaWxzVmlldyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB0b2FzdCA9IHVzZVNjb3BlZFRvYXN0KCdhY2NvdW50LXN3aXRjaGVyJyk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyBpc0FjY291bnRTZWxlY3RhYmxlIH0gPSB1c2VBY2NvdW50TWFuYWdlcigpO1xuICBjb25zdCB7IGFjY291bnRJZCB9ID0gdXNlUGFyYW1zPHsgYWNjb3VudElkOiBzdHJpbmcgfT4oKTtcbiAgY29uc3QgeyBnZXRBY2NvdW50QnlJZCB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG4gIGNvbnN0IHsgZ2V0V2FsbGV0IH0gPSB1c2VXYWxsZXRDb250ZXh0KCk7XG4gIGNvbnN0IGFjY291bnQgPSBnZXRBY2NvdW50QnlJZChhY2NvdW50SWQpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3Qgd2FsbGV0RGV0YWlscyA9IGlzUHJpbWFyeUFjY291bnQoYWNjb3VudClcbiAgICA/IGdldFdhbGxldChhY2NvdW50LndhbGxldElkKVxuICAgIDogZ2V0V2FsbGV0KGFjY291bnQ/LmlkID8/ICcnKTtcbiAgY29uc3QgeyBpc1ByaXZhdGVLZXlBdmFpbGFibGUsIHNob3dQcml2YXRlS2V5IH0gPSB1c2VQcml2YXRlS2V5RXhwb3J0KFxuICAgIGFjY291bnQsXG4gICAgd2FsbGV0RGV0YWlscz8udHlwZSxcbiAgKTtcbiAgY29uc3QgeyBmZWF0dXJlRmxhZ3MgfSA9IHVzZUZlYXR1cmVGbGFnQ29udGV4dCgpO1xuICBjb25zdCBjYW5QcmltYXJ5QWNjb3VudHNCZVJlbW92ZWQgPVxuICAgIGZlYXR1cmVGbGFnc1tGZWF0dXJlR2F0ZXMuUFJJTUFSWV9BQ0NPVU5UX1JFTU9WQUxdO1xuXG4gIGNvbnN0IG9uQWRkcmVzc0NvcHkgPSB1c2VDYWxsYmFjayhcbiAgICAoYWRkcmVzc1RvQ29weTogc3RyaW5nLCBldmVudE5hbWU6IHN0cmluZykgPT4gKCkgPT4ge1xuICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc3RyaXBBZGRyZXNzUHJlZml4KGFkZHJlc3NUb0NvcHkpKTtcbiAgICAgIHRvYXN0LnN1Y2Nlc3ModCgnQ29waWVkIScpLCB7IGR1cmF0aW9uOiAxMDAwIH0pO1xuICAgICAgY2FwdHVyZShldmVudE5hbWUsIHsgdHlwZTogYWNjb3VudD8udHlwZSB9KTtcbiAgICB9LFxuICAgIFt0LCBhY2NvdW50Py50eXBlLCBjYXB0dXJlLCB0b2FzdF0sXG4gICk7XG5cbiAgY29uc3QgW2lzQ29udGV4dE1lbnVPcGVuLCBzZXRJc0NvbnRleHRNZW51T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGNvbnRleHRNZW51UmVmID0gdXNlUmVmPEhUTUxCdXR0b25FbGVtZW50PihudWxsKTtcblxuICBjb25zdCB0b0JlUmVtb3ZlZCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKGFjY291bnQ/LmlkID8gW2FjY291bnQuaWRdIDogW10pLFxuICAgIFthY2NvdW50Py5pZF0sXG4gICk7XG4gIGNvbnN0IHsgcHJvbXB0OiBwcm9tcHRSZW5hbWUsIHJlbmRlckRpYWxvZzogcmVuYW1lRGlhbG9nIH0gPVxuICAgIHVzZUFjY291bnRSZW5hbWUoYWNjb3VudCk7XG4gIGNvbnN0IHsgcHJvbXB0OiBwcm9tcHRSZW1vdmUsIHJlbmRlckRpYWxvZzogcmVtb3ZlRGlhbG9nIH0gPVxuICAgIHVzZUFjY291bnRSZW1vdmFsKHRvQmVSZW1vdmVkKTtcblxuICBjb25zdCBnZXRXYWxsZXRUeXBlID0gdXNlV2FsbGV0VHlwZU5hbWUod2FsbGV0RGV0YWlscywgYWNjb3VudCk7XG5cbiAgaWYgKCFhY2NvdW50KSB7XG4gICAgcmV0dXJuIDxOb0FjY291bnRzRm91bmQgb3JpZ2luPXtPcmlnaW4uVXJsfSAvPjtcbiAgfVxuXG4gIGNvbnN0IGlzRGVsZXRhYmxlID1cbiAgICBpc0FjY291bnRTZWxlY3RhYmxlKGFjY291bnQpICYmXG4gICAgKGFjY291bnQudHlwZSAhPT0gQWNjb3VudFR5cGUuUFJJTUFSWSB8fCBjYW5QcmltYXJ5QWNjb3VudHNCZVJlbW92ZWQpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgIHBsOiAwLjI1LFxuICAgICAgICAgIHByOiAxLFxuICAgICAgICAgIHB5OiAzLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWNjb3VudC1kZXRhaWxzLWJhY2stYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoaXN0b3J5LnJlcGxhY2UoJy9hY2NvdW50cycpfVxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBwYWRkaW5nOiAwLjI1LFxuICAgICAgICAgICAgJz4gc3ZnJzoge1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnY29sb3IgLjE1cyBlYXNlLWluLW91dCwgdHJhbnNmb3JtIC4xNXMgZWFzZS1pbi1vdXQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aG92ZXIgc3ZnJzoge1xuICAgICAgICAgICAgICBjb2xvcjogJ3NlY29uZGFyeS5saWdodGVyJyxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMnB4KScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH19XG4gICAgICAgICAgZGlzYWJsZVJpcHBsZVxuICAgICAgICA+XG4gICAgICAgICAgPENoZXZyb25MZWZ0SWNvbiBzaXplPXszMn0gLz5cbiAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgICA8T3ZlcmZsb3dpbmdUeXBvZ3JhcGh5XG4gICAgICAgICAgdmFyaWFudD1cImg0XCJcbiAgICAgICAgICBzeD17eyBtcjogMiwgZm9udFNpemU6IDI0LCBmbGV4R3JvdzogMSB9fVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWNjb3VudC1kZXRhaWxzLW5hbWVcIlxuICAgICAgICA+XG4gICAgICAgICAge2FjY291bnQubmFtZX1cbiAgICAgICAgPC9PdmVyZmxvd2luZ1R5cG9ncmFwaHk+XG4gICAgICAgIDxDbGlja0F3YXlMaXN0ZW5lclxuICAgICAgICAgIG1vdXNlRXZlbnQ9XCJvbk1vdXNlRG93blwiXG4gICAgICAgICAgb25DbGlja0F3YXk9eygpID0+IHNldElzQ29udGV4dE1lbnVPcGVuKGZhbHNlKX1cbiAgICAgICAgPlxuICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICBzeD17eyBtbDogMyB9fVxuICAgICAgICAgICAgcmVmPXtjb250ZXh0TWVudVJlZn1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgYWNjb3VudC1kZXRhaWxzLWVkaXQtYnV0dG9uYH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIHNldElzQ29udGV4dE1lbnVPcGVuKChvcGVuKSA9PiAhb3Blbik7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxNb3JlVmVydGljYWxJY29uIHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgPFBvcHBlclxuICAgICAgICAgICAgICBvcGVuPXtpc0NvbnRleHRNZW51T3Blbn1cbiAgICAgICAgICAgICAgYW5jaG9yRWw9e2NvbnRleHRNZW51UmVmLmN1cnJlbnR9XG4gICAgICAgICAgICAgIHBsYWNlbWVudD1cImJvdHRvbS1lbmRcIlxuICAgICAgICAgICAgICB0cmFuc2l0aW9uXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHsoeyBUcmFuc2l0aW9uUHJvcHMgfSkgPT4gKFxuICAgICAgICAgICAgICAgIDxHcm93IHsuLi5UcmFuc2l0aW9uUHJvcHN9IHRpbWVvdXQ9ezI1MH0+XG4gICAgICAgICAgICAgICAgICA8TWVudUxpc3RcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBwOiAwLFxuICAgICAgICAgICAgICAgICAgICAgIG1iOiAxLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiAxODAsXG4gICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZXkuODUwJyxcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3RleHQucHJpbWFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4wNSknLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8TWVudUl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtwcm9tcHRSZW5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJyZW5hbWUtYWNjb3VudC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjEpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzQwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGNvbG9yPVwidGV4dC5wcmltYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnUmVuYW1lJyl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICA8L01lbnVJdGVtPlxuXG4gICAgICAgICAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWxldGFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICA6IHQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnT25seSB0aGUgbGFzdCBhY2NvdW50IGFuZCBzZWNvbmRhcnkgd2FsbGV0cyBjYW4gYmUgZGVsZXRlZC4gRmlyc3QgYWNjb3VudCBjYW5ub3QgYmUgZGVsZXRlZCAoZGVsZXRlIHRoZSB3YWxsZXQgaW5zdGVhZCkuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPE1lbnVJdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWlzRGVsZXRhYmxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17cHJvbXB0UmVtb3ZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWxldGUtYWNjb3VudC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnNDBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCIgY29sb3I9XCJlcnJvci5tYWluXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdEZWxldGUgQWNjb3VudCcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICAgICAgIDwvTWVudUxpc3Q+XG4gICAgICAgICAgICAgICAgPC9Hcm93PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9Qb3BwZXI+XG4gICAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgICA8L0NsaWNrQXdheUxpc3RlbmVyPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSwgcHg6IDIgfX0+XG4gICAgICAgIDxDYXJkIHN4PXt7IGJhY2tncm91bmRDb2xvcjogJ2dyZXkuODUwJyB9fT5cbiAgICAgICAgICA8Q2FyZENvbnRlbnQgc3g9e3sgcHg6IDIgfX0+XG4gICAgICAgICAgICA8U3RhY2sgc3g9e3sgZ2FwOiAxLjUgfX0gZGl2aWRlcj17PERpdmlkZXIgLz59PlxuICAgICAgICAgICAgICA8QWNjb3VudERldGFpbHNBZGRyZXNzUm93XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NvdW50LWFkZHJlc3MtY1wiXG4gICAgICAgICAgICAgICAgaWNvbj17PEF2YWxhbmNoZUNvbG9ySWNvbiBzaXplPXszMn0gLz59XG4gICAgICAgICAgICAgICAgbGFiZWw9e3QoJ0F2YWxhbmNoZSBDLUNoYWluJyl9XG4gICAgICAgICAgICAgICAgYWRkcmVzcz17YWNjb3VudC5hZGRyZXNzQ31cbiAgICAgICAgICAgICAgICBjb3B5SGFuZGxlcj17b25BZGRyZXNzQ29weShcbiAgICAgICAgICAgICAgICAgIGFjY291bnQuYWRkcmVzc0MsXG4gICAgICAgICAgICAgICAgICAnQWNjb3VudERldGFpbHNDQWRkcmVzc0NvcGllZCcsXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAge2FjY291bnQuYWRkcmVzc1BWTSAmJiAoXG4gICAgICAgICAgICAgICAgPEFjY291bnREZXRhaWxzQWRkcmVzc1Jvd1xuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NvdW50LWFkZHJlc3MtcHhcIlxuICAgICAgICAgICAgICAgICAgaWNvbj17PFhBbmRQQ2hhaW5zSWNvbiBzaXplPXszMn0gLz59XG4gICAgICAgICAgICAgICAgICBsYWJlbD17dCgnQXZhbGFuY2hlIFgvUC1DaGFpbicpfVxuICAgICAgICAgICAgICAgICAgYWRkcmVzcz17YWNjb3VudC5hZGRyZXNzUFZNfVxuICAgICAgICAgICAgICAgICAgY29weUhhbmRsZXI9e29uQWRkcmVzc0NvcHkoXG4gICAgICAgICAgICAgICAgICAgIGFjY291bnQuYWRkcmVzc1BWTSxcbiAgICAgICAgICAgICAgICAgICAgJ0FjY291bnREZXRhaWxzWFBBZGRyZXNzQ29waWVkJyxcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge2FjY291bnQuYWRkcmVzc0JUQyAmJiAoXG4gICAgICAgICAgICAgICAgPEFjY291bnREZXRhaWxzQWRkcmVzc1Jvd1xuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NvdW50LWFkZHJlc3MtYnRjXCJcbiAgICAgICAgICAgICAgICAgIGljb249ezxCaXRjb2luQ29sb3JJY29uIHNpemU9ezMyfSAvPn1cbiAgICAgICAgICAgICAgICAgIGxhYmVsPXt0KCdCaXRjb2luJyl9XG4gICAgICAgICAgICAgICAgICBhZGRyZXNzPXthY2NvdW50LmFkZHJlc3NCVEN9XG4gICAgICAgICAgICAgICAgICBjb3B5SGFuZGxlcj17b25BZGRyZXNzQ29weShcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudC5hZGRyZXNzQlRDLFxuICAgICAgICAgICAgICAgICAgICAnQWNjb3VudERldGFpbHNCVENBZGRyZXNzQ29waWVkJyxcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgICAgPC9DYXJkPlxuICAgICAgICA8Q2FyZCBzeD17eyBiYWNrZ3JvdW5kQ29sb3I6ICdncmV5Ljg1MCcsIG10OiAzIH19PlxuICAgICAgICAgIDxDYXJkQ29udGVudCBzeD17eyBweDogMiwgcHQ6IDAsICc6bGFzdC1jaGlsZCc6IHsgcGI6IDAuNSB9IH19PlxuICAgICAgICAgICAgPFN0YWNrIGRpdmlkZXI9ezxEaXZpZGVyIC8+fT5cbiAgICAgICAgICAgICAge3dhbGxldERldGFpbHMgJiYgKFxuICAgICAgICAgICAgICAgIDxEZXRhaWxzUm93IGxhYmVsPXt0KCdUeXBlJyl9PlxuICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBnYXA6IDEsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxXYWxsZXRUeXBlSWNvblxuICAgICAgICAgICAgICAgICAgICAgIHdhbGxldERldGFpbHM9e3dhbGxldERldGFpbHN9XG4gICAgICAgICAgICAgICAgICAgICAgc2l6ZT17MjB9XG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnNlY29uZGFyeScgfX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtnZXRXYWxsZXRUeXBlKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPC9EZXRhaWxzUm93PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICB7d2FsbGV0RGV0YWlscz8uZGVyaXZhdGlvblBhdGggJiYgKFxuICAgICAgICAgICAgICAgIDxEZXRhaWxzUm93IGxhYmVsPXt0KCdEZXJpdmF0aW9uIFBhdGgnKX0+XG4gICAgICAgICAgICAgICAgICA8T3ZlcmZsb3dpbmdUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MVwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAge3dhbGxldERldGFpbHMuZGVyaXZhdGlvblBhdGgudG9VcHBlckNhc2UoKSA/PyAnLSd9XG4gICAgICAgICAgICAgICAgICA8L092ZXJmbG93aW5nVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8L0RldGFpbHNSb3c+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHt3YWxsZXREZXRhaWxzICYmIChcbiAgICAgICAgICAgICAgICA8RGV0YWlsc1JvdyBsYWJlbD17dCgnV2FsbGV0Jyl9PlxuICAgICAgICAgICAgICAgICAgPE92ZXJmbG93aW5nVHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgIHt3YWxsZXREZXRhaWxzLm5hbWV9XG4gICAgICAgICAgICAgICAgICA8L092ZXJmbG93aW5nVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8L0RldGFpbHNSb3c+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHtpc1ByaXZhdGVLZXlBdmFpbGFibGUgJiYgKFxuICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJleHBvcnQtcHJpdmF0ZS1rZXktYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIGVuZEljb249ezxDaGV2cm9uUmlnaHRJY29uIHNpemU9ezIwfSAvPn1cbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgICAgIHBsOiAwLFxuICAgICAgICAgICAgICAgICAgICBwcjogMC41LFxuICAgICAgICAgICAgICAgICAgICB0eXBvZ3JhcGh5OiAnYm9keTEnLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgICAgICAgb25DbGljaz17c2hvd1ByaXZhdGVLZXl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3QoJ1Nob3cgUHJpdmF0ZSBLZXknKX1cbiAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPC9DYXJkQ29udGVudD5cbiAgICAgICAgPC9DYXJkPlxuICAgICAgICB7aXNQcml2YXRlS2V5QXZhaWxhYmxlICYmIChcbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgc3g9e3sgY29sb3I6ICd0ZXh0LnRlcnRpYXJ5JywgZm9udFNpemU6IDExLCBweDogMSwgbXQ6IDIgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dChcbiAgICAgICAgICAgICAgJ0EgcHJpdmF0ZSBrZXkgaXMgbGlrZSBhIHBhc3N3b3JkIGZvciB0aGlzIHNwZWNpZmljIGFjY291bnQuIEtlZXAgaXQgc2VjdXJlLCBhbnlvbmUgd2l0aCB0aGlzIHByaXZhdGUga2V5IGNhbiBhY2Nlc3MgeW91ciBmdW5kcy4nLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgICAge3JlbmFtZURpYWxvZygpfVxuICAgICAge3JlbW92ZURpYWxvZygpfVxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuXG5jb25zdCBEZXRhaWxzUm93ID0gKHsgbGFiZWwsIGNoaWxkcmVuIH0pID0+IChcbiAgPFN0YWNrXG4gICAgc3g9e3tcbiAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgcHk6IDEuNSxcbiAgICAgIGdhcDogMixcbiAgICB9fVxuICA+XG4gICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCIgY29sb3I9XCJ0ZXh0LnByaW1hcnlcIj5cbiAgICAgIHtsYWJlbH1cbiAgICA8L1R5cG9ncmFwaHk+XG4gICAge2NoaWxkcmVufVxuICA8L1N0YWNrPlxuKTtcbiIsImltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBCdXR0b24sIFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgc3RyaXBBZGRyZXNzUHJlZml4IH0gZnJvbSAnQHNyYy91dGlscy9zdHJpcEFkZHJlc3NQcmVmaXgnO1xuaW1wb3J0IHsgdHJ1bmNhdGVBZGRyZXNzIH0gZnJvbSAnQHNyYy91dGlscy90cnVuY2F0ZUFkZHJlc3MnO1xuXG5leHBvcnQgY29uc3QgQWNjb3VudERldGFpbHNBZGRyZXNzUm93ID0gKHtcbiAgaWNvbixcbiAgbGFiZWwsXG4gIGFkZHJlc3MsXG4gIGNvcHlIYW5kbGVyLFxuICAuLi5wcm9wc1xufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3g9e3sgZ2FwOiAyLCBhbGlnbkl0ZW1zOiAnc3RhcnQnIH19IHsuLi5wcm9wc30+XG4gICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3g9e3sgZ2FwOiAxLCBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAge2ljb259XG4gICAgICAgIDxTdGFjaz5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLFxuICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIiBtb25vc3BhY2U+XG4gICAgICAgICAgICB7dHJ1bmNhdGVBZGRyZXNzKHN0cmlwQWRkcmVzc1ByZWZpeChhZGRyZXNzKSwgMTYpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgb25DbGljaz17Y29weUhhbmRsZXJ9XG4gICAgICAgIHN4PXt7IGFsaWduU2VsZjogJ2NlbnRlcicgfX1cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJhZGRyZXNzLWNvcHktYnV0dG9uXCJcbiAgICAgID5cbiAgICAgICAge3QoJ0NvcHknKX1cbiAgICAgIDwvQnV0dG9uPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgQWxlcnRDaXJjbGVJY29uLFxuICBCdXR0b24sXG4gIFNlYXJjaE9mZkljb24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZUdvQmFjayB9IGZyb20gJ0BzcmMvaG9va3MvdXNlR29CYWNrJztcblxuZXhwb3J0IGVudW0gT3JpZ2luIHtcbiAgU2VhcmNoLFxuICBVcmwsXG59XG5cbnR5cGUgTm9BY2NvdW50c0ZvdW5kUHJvcHMgPSB7XG4gIG9yaWdpbjogT3JpZ2luO1xufTtcblxuZXhwb3J0IGNvbnN0IE5vQWNjb3VudHNGb3VuZCA9ICh7IG9yaWdpbiB9OiBOb0FjY291bnRzRm91bmRQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgY29uc3QgY2xvc2UgPSB1c2VHb0JhY2soJy9hY2NvdW50cycpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICBweDogNCxcbiAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgZ2FwOiAyLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmV5LjkwMCcsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtvcmlnaW4gPT09IE9yaWdpbi5TZWFyY2ggJiYgKFxuICAgICAgICA8PlxuICAgICAgICAgIDxTZWFyY2hPZmZJY29uIHNpemU9ezcyfSAvPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPnt0KCdObyBzZWFyY2ggcmVzdWx0cyBmb3VuZCcpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAnVHJ5IHR5cGluZyB0aGUgaW5mb3JtYXRpb24gYWdhaW4gb3IgZ28gYmFjayB0byB0aGUgYWNjb3VudCBtYW5hZ2VyLicsXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgICAge29yaWdpbiA9PT0gT3JpZ2luLlVybCAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgPEFsZXJ0Q2lyY2xlSWNvbiBzaXplPXs3Mn0gLz5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIj57dCgnQWNjb3VudCBub3QgZm91bmQnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiPlxuICAgICAgICAgICAge3QoYExvb2tzIGxpa2UgeW91IGdvdCBoZXJlIGJ5IGFjY2lkZW50LmApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgICAgPEJ1dHRvbiBzaXplPVwibGFyZ2VcIiBvbkNsaWNrPXtjbG9zZX0gZnVsbFdpZHRoIHN4PXt7IG10OiAyIH19PlxuICAgICAgICB7dCgnQ2xvc2UnKX1cbiAgICAgIDwvQnV0dG9uPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgQWNjb3VudCwgQWNjb3VudFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcbmltcG9ydCB7IFNlY3JldFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VjcmV0cy9tb2RlbHMnO1xuaW1wb3J0IHsgV2FsbGV0RGV0YWlscyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvbW9kZWxzJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuZXhwb3J0IGNvbnN0IHVzZVdhbGxldFR5cGVOYW1lID0gKFxuICB3YWxsZXREZXRhaWxzPzogV2FsbGV0RGV0YWlscyxcbiAgYWNjb3VudD86IEFjY291bnQsXG4pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IGdldFdhbGxldFR5cGUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc3dpdGNoICh3YWxsZXREZXRhaWxzPy50eXBlKSB7XG4gICAgICBjYXNlIFNlY3JldFR5cGUuTGVkZ2VyOlxuICAgICAgY2FzZSBTZWNyZXRUeXBlLkxlZGdlckxpdmU6XG4gICAgICAgIHJldHVybiB0KCdMZWRnZXInKTtcblxuICAgICAgY2FzZSBTZWNyZXRUeXBlLk1uZW1vbmljOlxuICAgICAgICByZXR1cm4gdCgnUmVjb3ZlcnkgUGhyYXNlJyk7XG5cbiAgICAgIGNhc2UgU2VjcmV0VHlwZS5Qcml2YXRlS2V5OlxuICAgICAgICByZXR1cm4gdCgnSW1wb3J0ZWQgUHJpdmF0ZSBLZXknKTtcblxuICAgICAgY2FzZSBTZWNyZXRUeXBlLkZpcmVibG9ja3M6XG4gICAgICAgIHJldHVybiB0KCdGaXJlYmxvY2tzJyk7XG5cbiAgICAgIGNhc2UgU2VjcmV0VHlwZS5XYWxsZXRDb25uZWN0OlxuICAgICAgICByZXR1cm4gdCgnV2FsbGV0Q29ubmVjdCcpO1xuXG4gICAgICBjYXNlIFNlY3JldFR5cGUuS2V5c3RvbmU6XG4gICAgICAgIHJldHVybiB0KCdLZXlzdG9uZScpO1xuXG4gICAgICBjYXNlIFNlY3JldFR5cGUuU2VlZGxlc3M6XG4gICAgICAgIHJldHVybiB3YWxsZXREZXRhaWxzLmF1dGhQcm92aWRlclxuICAgICAgICAgID8gdCgnU2VlZGxlc3MgKHt7cHJvdmlkZXJ9fSknLCB7XG4gICAgICAgICAgICAgIHByb3ZpZGVyOiB3YWxsZXREZXRhaWxzLmF1dGhQcm92aWRlcixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgOiB0KCdTZWVkbGVzcycpO1xuICAgIH1cblxuICAgIHN3aXRjaCAoYWNjb3VudD8udHlwZSkge1xuICAgICAgY2FzZSBBY2NvdW50VHlwZS5JTVBPUlRFRDpcbiAgICAgICAgcmV0dXJuIHQoJ0ltcG9ydGVkIFByaXZhdGUgS2V5Jyk7XG5cbiAgICAgIGNhc2UgQWNjb3VudFR5cGUuRklSRUJMT0NLUzpcbiAgICAgICAgcmV0dXJuIHQoJ0ZpcmVibG9ja3MnKTtcblxuICAgICAgY2FzZSBBY2NvdW50VHlwZS5XQUxMRVRfQ09OTkVDVDpcbiAgICAgICAgcmV0dXJuIHQoJ1dhbGxldENvbm5lY3QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdCgnVW5rbm93bicpO1xuICB9LCBbYWNjb3VudD8udHlwZSwgdCwgd2FsbGV0RGV0YWlscz8udHlwZSwgd2FsbGV0RGV0YWlscz8uYXV0aFByb3ZpZGVyXSk7XG5cbiAgcmV0dXJuIGdldFdhbGxldFR5cGU7XG59O1xuIl0sIm5hbWVzIjpbInVzZUhpc3RvcnkiLCJ1c2VQYXJhbXMiLCJ1c2VDYWxsYmFjayIsInVzZU1lbW8iLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsInVzZVRyYW5zbGF0aW9uIiwiQXZhbGFuY2hlQ29sb3JJY29uIiwiQml0Y29pbkNvbG9ySWNvbiIsIkJ1dHRvbiIsIkNhcmQiLCJDYXJkQ29udGVudCIsIkNoZXZyb25MZWZ0SWNvbiIsIkNoZXZyb25SaWdodEljb24iLCJDbGlja0F3YXlMaXN0ZW5lciIsIkRpdmlkZXIiLCJHcm93IiwiSWNvbkJ1dHRvbiIsIk1lbnVJdGVtIiwiTWVudUxpc3QiLCJNb3JlVmVydGljYWxJY29uIiwiUG9wcGVyIiwiU3RhY2siLCJUb29sdGlwIiwiVHlwb2dyYXBoeSIsIlhBbmRQQ2hhaW5zSWNvbiIsInVzZVRoZW1lIiwiQWNjb3VudFR5cGUiLCJGZWF0dXJlR2F0ZXMiLCJ1c2VTY29wZWRUb2FzdCIsImlzUHJpbWFyeUFjY291bnQiLCJ1c2VXYWxsZXRDb250ZXh0IiwidXNlQWNjb3VudHNDb250ZXh0Iiwic3RyaXBBZGRyZXNzUHJlZml4IiwidXNlQW5hbHl0aWNzQ29udGV4dCIsInVzZUZlYXR1cmVGbGFnQ29udGV4dCIsInVzZUFjY291bnRNYW5hZ2VyIiwiT3ZlcmZsb3dpbmdUeXBvZ3JhcGh5IiwiTm9BY2NvdW50c0ZvdW5kIiwiT3JpZ2luIiwiQWNjb3VudERldGFpbHNBZGRyZXNzUm93IiwidXNlQWNjb3VudFJlbmFtZSIsInVzZUFjY291bnRSZW1vdmFsIiwidXNlUHJpdmF0ZUtleUV4cG9ydCIsIldhbGxldFR5cGVJY29uIiwidXNlV2FsbGV0VHlwZU5hbWUiLCJBY2NvdW50RGV0YWlsc1ZpZXciLCJ0IiwidG9hc3QiLCJ0aGVtZSIsImlzQWNjb3VudFNlbGVjdGFibGUiLCJhY2NvdW50SWQiLCJnZXRBY2NvdW50QnlJZCIsImdldFdhbGxldCIsImFjY291bnQiLCJoaXN0b3J5IiwiY2FwdHVyZSIsIndhbGxldERldGFpbHMiLCJ3YWxsZXRJZCIsImlkIiwiaXNQcml2YXRlS2V5QXZhaWxhYmxlIiwic2hvd1ByaXZhdGVLZXkiLCJ0eXBlIiwiZmVhdHVyZUZsYWdzIiwiY2FuUHJpbWFyeUFjY291bnRzQmVSZW1vdmVkIiwiUFJJTUFSWV9BQ0NPVU5UX1JFTU9WQUwiLCJvbkFkZHJlc3NDb3B5IiwiYWRkcmVzc1RvQ29weSIsImV2ZW50TmFtZSIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInN1Y2Nlc3MiLCJkdXJhdGlvbiIsImlzQ29udGV4dE1lbnVPcGVuIiwic2V0SXNDb250ZXh0TWVudU9wZW4iLCJjb250ZXh0TWVudVJlZiIsInRvQmVSZW1vdmVkIiwicHJvbXB0IiwicHJvbXB0UmVuYW1lIiwicmVuZGVyRGlhbG9nIiwicmVuYW1lRGlhbG9nIiwicHJvbXB0UmVtb3ZlIiwicmVtb3ZlRGlhbG9nIiwiZ2V0V2FsbGV0VHlwZSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIm9yaWdpbiIsIlVybCIsImlzRGVsZXRhYmxlIiwiUFJJTUFSWSIsInN4Iiwid2lkdGgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kIiwicGFsZXR0ZSIsInBhcGVyIiwiZmxleERpcmVjdGlvbiIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsInBsIiwicHIiLCJweSIsIm9uQ2xpY2siLCJyZXBsYWNlIiwicGFkZGluZyIsInRyYW5zaXRpb24iLCJjb2xvciIsInRyYW5zZm9ybSIsImRpc2FibGVSaXBwbGUiLCJzaXplIiwidmFyaWFudCIsIm1yIiwiZm9udFNpemUiLCJmbGV4R3JvdyIsIm5hbWUiLCJtb3VzZUV2ZW50Iiwib25DbGlja0F3YXkiLCJtbCIsInJlZiIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJvcGVuIiwiYW5jaG9yRWwiLCJjdXJyZW50IiwicGxhY2VtZW50IiwiVHJhbnNpdGlvblByb3BzIiwiX2V4dGVuZHMiLCJ0aW1lb3V0IiwicCIsIm1iIiwibWluV2lkdGgiLCJvdmVyZmxvdyIsImJhY2tncm91bmRDb2xvciIsImJvcmRlciIsImJvcmRlckJvdHRvbSIsIm1pbkhlaWdodCIsInRpdGxlIiwiZGlzYWJsZWQiLCJweCIsImdhcCIsImRpdmlkZXIiLCJpY29uIiwibGFiZWwiLCJhZGRyZXNzIiwiYWRkcmVzc0MiLCJjb3B5SGFuZGxlciIsImFkZHJlc3NQVk0iLCJhZGRyZXNzQlRDIiwibXQiLCJwdCIsInBiIiwiRGV0YWlsc1JvdyIsImRlcml2YXRpb25QYXRoIiwidG9VcHBlckNhc2UiLCJlbmRJY29uIiwidHlwb2dyYXBoeSIsImZ1bGxXaWR0aCIsImNoaWxkcmVuIiwidHJ1bmNhdGVBZGRyZXNzIiwicHJvcHMiLCJkaXJlY3Rpb24iLCJmb250V2VpZ2h0Iiwid2hpdGVTcGFjZSIsIm1vbm9zcGFjZSIsImFsaWduU2VsZiIsIkFsZXJ0Q2lyY2xlSWNvbiIsIlNlYXJjaE9mZkljb24iLCJ1c2VHb0JhY2siLCJjbG9zZSIsInRleHRBbGlnbiIsIlNlYXJjaCIsIkZyYWdtZW50IiwiU2VjcmV0VHlwZSIsIkxlZGdlciIsIkxlZGdlckxpdmUiLCJNbmVtb25pYyIsIlByaXZhdGVLZXkiLCJGaXJlYmxvY2tzIiwiV2FsbGV0Q29ubmVjdCIsIktleXN0b25lIiwiU2VlZGxlc3MiLCJhdXRoUHJvdmlkZXIiLCJwcm92aWRlciIsIklNUE9SVEVEIiwiRklSRUJMT0NLUyIsIldBTExFVF9DT05ORUNUIl0sInNvdXJjZVJvb3QiOiIifQ==