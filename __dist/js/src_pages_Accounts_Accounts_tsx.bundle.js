"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Accounts_Accounts_tsx"],{

/***/ "./src/background/services/balances/handlers/getTotalBalanceForWallet/models.ts":
/*!**************************************************************************************!*\
  !*** ./src/background/services/balances/handlers/getTotalBalanceForWallet/models.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ADDRESS_GAP_LIMIT": () => (/* binding */ ADDRESS_GAP_LIMIT),
/* harmony export */   "GLACIER_ADDRESS_FETCH_LIMIT": () => (/* binding */ GLACIER_ADDRESS_FETCH_LIMIT),
/* harmony export */   "IMPORTED_ACCOUNTS_WALLET_ID": () => (/* binding */ IMPORTED_ACCOUNTS_WALLET_ID),
/* harmony export */   "ITERATION_LIMIT": () => (/* binding */ ITERATION_LIMIT),
/* harmony export */   "isImportedAccountsRequest": () => (/* binding */ isImportedAccountsRequest)
/* harmony export */ });
const ITERATION_LIMIT = 10; // Abitrary number to avoid an infinite loop.
const ADDRESS_GAP_LIMIT = 20;
const GLACIER_ADDRESS_FETCH_LIMIT = 64; // Requested addresses are encoded as query params, and Glacier enforces URI length limits
const IMPORTED_ACCOUNTS_WALLET_ID = '__IMPORTED__';
const isImportedAccountsRequest = walletId => walletId === IMPORTED_ACCOUNTS_WALLET_ID;

/***/ }),

/***/ "./src/hooks/useBalanceTotalInCurrency.ts":
/*!************************************************!*\
  !*** ./src/hooks/useBalanceTotalInCurrency.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useBalanceTotalInCurrency": () => (/* binding */ useBalanceTotalInCurrency)
/* harmony export */ });
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");


function useBalanceTotalInCurrency(account) {
  const {
    getTotalBalance
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_0__.useBalancesContext)();
  return (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (!account?.addressC) {
      return null;
    }
    return getTotalBalance(account.addressC);
  }, [account?.addressC, getTotalBalance]);
}

/***/ }),

/***/ "./src/pages/Accounts/AccountBalance.tsx":
/*!***********************************************!*\
  !*** ./src/pages/Accounts/AccountBalance.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountBalance": () => (/* binding */ AccountBalance)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







const AnimatedRefreshIcon = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.RefreshIcon, {
  shouldForwardProp: prop => prop !== 'isSpinning'
})`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    75% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  animation: ${({
  isSpinning
}) => isSpinning ? '1.5s ease-in-out spin infinite' : 'none'};
`;
const commonTransitionProps = {
  timeout: 200,
  easing: 'ease-in-out',
  appear: false
};
function AccountBalance({
  refreshBalance,
  balanceTotalUSD,
  isBalanceLoading,
  accountType,
  isActive,
  isHovered
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const {
    isManageMode
  } = (0,_providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_4__.useAccountManager)();
  const {
    currency,
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_2__.useSettingsContext)();
  const [skeletonWidth, setSkeletonWidth] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(30);
  const balanceTextRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const hasBalance = balanceTotalUSD !== null;
  const handleClick = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async e => {
    e.stopPropagation();

    // Match the skeleton width to the old balance's width (or the "View Balance" button)
    if (balanceTextRef.current) {
      setSkeletonWidth(balanceTextRef.current?.offsetWidth);
    }
    await refreshBalance();

    // Match the skeleton width to the fresh balance's width.
    if (balanceTextRef.current) {
      setSkeletonWidth(balanceTextRef.current?.offsetWidth);
    }
  }, [refreshBalance]);
  const onRefreshClicked = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(e => {
    handleClick(e);
    capture('AccountSelectorRefreshBalanceClicked', {
      type: accountType
    });
  }, [handleClick, capture, accountType]);
  const onViewBalanceClicked = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(e => {
    handleClick(e);
    capture('AccountSelectorViewBalanceClicked', {
      type: accountType
    });
  }, [handleClick, capture, accountType]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      minHeight: '16px',
      gap: 0.4
    },
    style: {
      minWidth: skeletonWidth
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonTransitionProps, {
    in: isBalanceLoading
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Skeleton, {
    height: 16,
    width: isBalanceLoading ? skeletonWidth : 0,
    sx: {
      position: 'absolute',
      right: 0,
      transition: 'all ease-in-out 0.2s'
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonTransitionProps, {
    in: !hasBalance && !isBalanceLoading,
    mountOnEnter: true,
    unmountOnExit: true
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    ref: balanceTextRef,
    variant: "text",
    "data-testid": "view-balance-button",
    size: "small",
    disableRipple: true,
    onClick: onViewBalanceClicked
  }, t('View Balance'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonTransitionProps, {
    in: hasBalance && isHovered && !isBalanceLoading && !isManageMode,
    mountOnEnter: true,
    unmountOnExit: true
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
    size: "small",
    onClick: onRefreshClicked,
    "data-testid": "account-balance-refresh",
    sx: {
      p: 0.25
    }
  }, /*#__PURE__*/React.createElement(AnimatedRefreshIcon, {
    size: 16,
    isSpinning: isBalanceLoading
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonTransitionProps, {
    in: hasBalance && !isBalanceLoading,
    mountOnEnter: true,
    unmountOnExit: true
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    ref: balanceTextRef,
    variant: "body1",
    color: isActive ? 'text.primary' : 'text.secondary'
  }, currencyFormatter(balanceTotalUSD ?? 0).replace(currency, ''))));
}

/***/ }),

/***/ "./src/pages/Accounts/Accounts.tsx":
/*!*****************************************!*\
  !*** ./src/pages/Accounts/Accounts.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Accounts": () => (/* binding */ Accounts)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/LedgerProvider */ "./src/contexts/LedgerProvider.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_pages_SignTransaction_components_LedgerApprovalDialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/pages/SignTransaction/components/LedgerApprovalDialog */ "./src/pages/SignTransaction/components/LedgerApprovalDialog.tsx");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/hooks/useScopedToast */ "./src/hooks/useScopedToast.ts");
/* harmony import */ var _src_components_common_header_NetworkSwitcher__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/components/common/header/NetworkSwitcher */ "./src/components/common/header/NetworkSwitcher/index.ts");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var _src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/background/services/accounts/utils/typeGuards */ "./src/background/services/accounts/utils/typeGuards.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* harmony import */ var _hooks_useAccountRemoval__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./hooks/useAccountRemoval */ "./src/pages/Accounts/hooks/useAccountRemoval.tsx");
/* harmony import */ var _components_AccountListPrimary__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/AccountListPrimary */ "./src/pages/Accounts/components/AccountListPrimary.tsx");
/* harmony import */ var _components_AccountListImported__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/AccountListImported */ "./src/pages/Accounts/components/AccountListImported.tsx");
/* harmony import */ var _components_AccountsActionButton__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/AccountsActionButton */ "./src/pages/Accounts/components/AccountsActionButton.tsx");
/* harmony import */ var _components_OverflowingTypography__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/OverflowingTypography */ "./src/pages/Accounts/components/OverflowingTypography.tsx");
/* harmony import */ var _hooks_useWalletTotalBalance__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./hooks/useWalletTotalBalance */ "./src/pages/Accounts/hooks/useWalletTotalBalance.ts");
/* harmony import */ var _providers_WalletTotalBalanceProvider__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./providers/WalletTotalBalanceProvider */ "./src/pages/Accounts/providers/WalletTotalBalanceProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
























function Accounts() {
  const {
    selectAccount,
    addAccount,
    accounts: {
      imported: importedAccounts,
      primary: primaryAccounts,
      active
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const {
    isManageMode,
    toggleManageMode,
    selectedAccounts
  } = (0,_providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_14__.useAccountManager)();
  const toast = (0,_src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_7__.useScopedToast)('account-switcher');
  const [addAccountLoading, setAddAccountLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    hasLedgerTransport
  } = (0,_src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_3__.useLedgerContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__.useAnalyticsContext)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_22__["default"])();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_23__.useHistory)();
  const {
    walletDetails
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_11__.useWalletContext)();
  const {
    isLoading,
    totalBalanceInCurrency: activeWalletTotalBalance
  } = (0,_hooks_useWalletTotalBalance__WEBPACK_IMPORTED_MODULE_20__.useWalletTotalBalance)((0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_10__.isPrimaryAccount)(active) ? active.walletId : undefined);
  const {
    fetchBalanceForWallet
  } = (0,_providers_WalletTotalBalanceProvider__WEBPACK_IMPORTED_MODULE_21__.useWalletTotalBalanceContext)();
  const canCreateAccount = active?.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_6__.AccountType.PRIMARY;
  const {
    getTotalBalance
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_12__.useBalancesContext)();
  const activeAccountBalance = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => active?.addressC ? getTotalBalance(active.addressC) : null, [active?.addressC, getTotalBalance]);
  const addAccountAndFocus = async () => {
    setAddAccountLoading(true);
    try {
      const id = await addAccount();
      capture('CreatedANewAccountSuccessfully', {
        walletType: walletDetails?.type
      });
      await selectAccount(id);

      // Refresh total balance of the wallet after adding an account
      if (walletDetails?.id) {
        fetchBalanceForWallet(walletDetails.id);
      }
    } catch (_err) {
      toast.error((0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('An error occurred, please try again later'));
    }
    setAddAccountLoading(false);
  };
  const hasImportedAccounts = Object.keys(importedAccounts).length > 0;
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_13__.useSettingsContext)();
  const {
    prompt: promptRemoval,
    renderDialog: confirmRemovalDialog
  } = (0,_hooks_useAccountRemoval__WEBPACK_IMPORTED_MODULE_15__.useAccountRemoval)(selectedAccounts);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      background: theme.palette.background.paper
    }
  }, addAccountLoading && hasLedgerTransport && /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_9__.Overlay, null, /*#__PURE__*/React.createElement(_src_pages_SignTransaction_components_LedgerApprovalDialog__WEBPACK_IMPORTED_MODULE_5__.LedgerApprovalDialog, {
    header: (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Waiting for Ledger')
  })), confirmRemovalDialog(), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      pl: 0.25,
      pt: 1,
      pb: 0.5,
      pr: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.IconButton, {
    onClick: () => history.replace('/home'),
    sx: {
      padding: 0.25,
      '> svg': {
        transition: 'color .15s ease-in-out, transform .15s ease-in-out'
      },
      ':hover svg': {
        color: theme.palette.secondary.lighter,
        transform: 'translateX(-2px)'
      }
    },
    disableRipple: true,
    "data-testid": "accounts-back-btn"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.ChevronLeftIcon, {
    size: 32
  })), /*#__PURE__*/React.createElement(_src_components_common_header_NetworkSwitcher__WEBPACK_IMPORTED_MODULE_8__.NetworkSwitcher, null)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Stack, {
    sx: {
      px: 2,
      py: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(_components_OverflowingTypography__WEBPACK_IMPORTED_MODULE_19__.OverflowingTypography, {
    variant: "caption",
    color: "text.secondary",
    "data-testid": "account-management-active-wallet"
  }, (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Currently using {{walletName}}', {
    walletName: (0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_10__.isPrimaryAccount)(active) ? walletDetails?.name : (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('an imported account')
  })), (0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_10__.isPrimaryAccount)(active) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Typography, {
    variant: "caption",
    fontWeight: 500,
    textAlign: "end",
    color: "text.secondary"
    // Prevents UI from jumping due to LoadingDotsIcon being larger than they appear
    ,
    sx: isLoading ? {
      height: 15,
      overflow: 'hidden'
    } : null
  }, isLoading ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.LoadingDotsIcon, {
    size: 20,
    orientation: "horizontal"
  }) : typeof activeWalletTotalBalance === 'number' ? currencyFormatter(activeWalletTotalBalance) : null)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(_components_OverflowingTypography__WEBPACK_IMPORTED_MODULE_19__.OverflowingTypography, {
    variant: "h5",
    fontSize: 18,
    "data-testid": "account-management-active-account"
  }, active?.name), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Typography, {
    variant: "h5",
    fontSize: 18
  }, typeof activeAccountBalance?.sum === 'number' ? currencyFormatter(activeAccountBalance.sum) : ''))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Divider, {
    sx: {
      borderColor: '#fff',
      opacity: 0.2
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Stack, {
    sx: {
      flexDirection: 'row',
      width: 1,
      py: 0.75,
      pr: 1.5,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Button, {
    variant: "text",
    size: "small",
    onClick: toggleManageMode,
    "data-testid": "manage-accounts-button"
  }, isManageMode ? (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Cancel') : (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Manage'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Divider, {
    sx: {
      borderColor: theme.palette.grey[800]
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Scrollbars, null, /*#__PURE__*/React.createElement(_components_AccountListPrimary__WEBPACK_IMPORTED_MODULE_16__.AccountListPrimary, {
    primaryAccounts: primaryAccounts
  }), hasImportedAccounts && /*#__PURE__*/React.createElement(_components_AccountListImported__WEBPACK_IMPORTED_MODULE_17__.AccountListImported, {
    accounts: Object.values(importedAccounts)
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Stack, {
    direction: "row",
    sx: {
      py: 3,
      px: 2,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, isManageMode && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.Button, {
    fullWidth: true,
    size: "large",
    disabled: selectedAccounts.length === 0,
    "data-testid": "delete-imported-account-button",
    onClick: () => {
      capture('ImportedAccountDeleteClicked');
      promptRemoval();
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_24__.TrashIcon, {
    size: 14,
    sx: {
      mr: 1
    }
  }), selectedAccounts.length <= 1 ? (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Delete Account') : (0,i18next__WEBPACK_IMPORTED_MODULE_1__.t)('Delete Accounts')), !isManageMode && /*#__PURE__*/React.createElement(_components_AccountsActionButton__WEBPACK_IMPORTED_MODULE_18__.AccountsActionButton, {
    isLoading: addAccountLoading,
    canCreateAccount: canCreateAccount,
    onAddNewAccount: addAccountAndFocus
  })));
}

/***/ }),

/***/ "./src/pages/Accounts/components/AccountItem.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/Accounts/components/AccountItem.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountItem": () => (/* binding */ AccountItem)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/BalancesProvider */ "./src/contexts/BalancesProvider.tsx");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_hooks_useBalanceTotalInCurrency__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/hooks/useBalanceTotalInCurrency */ "./src/hooks/useBalanceTotalInCurrency.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");
/* harmony import */ var _src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/utils/getAddressForChain */ "./src/utils/getAddressForChain.ts");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* harmony import */ var _src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/hooks/useScopedToast */ "./src/hooks/useScopedToast.ts");
/* harmony import */ var _hooks_useAccountRename__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../hooks/useAccountRename */ "./src/pages/Accounts/hooks/useAccountRename.tsx");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* harmony import */ var _AccountBalance__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../AccountBalance */ "./src/pages/Accounts/AccountBalance.tsx");
/* harmony import */ var _AccountItemMenu__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./AccountItemMenu */ "./src/pages/Accounts/components/AccountItemMenu.tsx");
/* harmony import */ var _AccountName__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./AccountName */ "./src/pages/Accounts/components/AccountName.tsx");
/* harmony import */ var _hooks_useAccountRemoval__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../hooks/useAccountRemoval */ "./src/pages/Accounts/hooks/useAccountRemoval.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




















const AccountItem = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({
  account,
  walletType,
  selectionMode
}, ref) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_17__.useTranslation)();
  const toast = (0,_src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_10__.useScopedToast)('account-switcher');
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_18__["default"])();
  const {
    isManageMode,
    selectAccount,
    deselectAccount,
    isAccountSelectable,
    selectedAccounts
  } = (0,_providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_12__.useAccountManager)();
  const {
    isActiveAccount,
    selectAccount: activateAccount
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_3__.useAnalyticsContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_6__.useNetworkContext)();
  const isActive = isActiveAccount(account.id);
  const isSelected = selectedAccounts.includes(account.id);
  const isSelectable = walletType === _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_7__.SecretType.Seedless ? false : isManageMode && isAccountSelectable(account);
  const balanceTotalUSD = (0,_src_hooks_useBalanceTotalInCurrency__WEBPACK_IMPORTED_MODULE_5__.useBalanceTotalInCurrency)(account);
  const totalBalance = (balanceTotalUSD && balanceTotalUSD.sum) ?? null;
  const address = (0,_src_utils_getAddressForChain__WEBPACK_IMPORTED_MODULE_8__.getAddressForChain)(network, account);
  const [cardHovered, setCardHovered] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const itemRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const firstPageload = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isActive) {
      const behavior = firstPageload.current ? 'instant' : 'smooth';
      itemRef?.current?.scrollIntoView({
        block: 'nearest',
        behavior
      });
    }
    firstPageload.current = false;
  }, [isActive]);
  const toggle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(accountId => {
    if (isSelected) {
      deselectAccount(accountId, selectionMode === _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_12__.SelectionMode.Consecutive);
    } else {
      selectAccount(accountId);
    }
  }, [deselectAccount, isSelected, selectAccount, selectionMode]);
  const handleAccountClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (isSelectable) {
      toggle(account.id);
    } else if (!isManageMode) {
      await activateAccount(account.id);
      toast.success(t(`Account "{{accountName}}" is now active`, {
        accountName: account.name
      }), {
        duration: 1000
      });
      await capture('AccountSelectorAccountSwitched', {
        type: account.type
      });
    }
  }, [account.id, account.type, account.name, activateAccount, capture, isManageMode, isSelectable, t, toggle, toast]);
  const nonSelectableHint = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (isSelectable) {
      return '';
    }
    if (walletType === _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_7__.SecretType.Seedless) {
      return t('You cannot delete a seedless account.');
    }
    if (!isSelectable && account.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_4__.AccountType.PRIMARY && account.index === 0) {
      return t('Removing the last account is not possible.');
    }
    return t('To remove this account, you must also remove all accounts that follow.');
  }, [account, isSelectable, t, walletType]);
  const [isBalanceLoading, setIsBalanceLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    updateBalanceOnNetworks
  } = (0,_src_contexts_BalancesProvider__WEBPACK_IMPORTED_MODULE_1__.useBalancesContext)();
  const getBalance = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    setIsBalanceLoading(true);
    await updateBalanceOnNetworks([account]);
    setIsBalanceLoading(false);
  }, [account, updateBalanceOnNetworks]);
  const toBeRemoved = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [account.id], [account.id]);
  const {
    prompt: promptRename,
    renderDialog: renameDialog
  } = (0,_hooks_useAccountRename__WEBPACK_IMPORTED_MODULE_11__.useAccountRename)(account);
  const {
    prompt: promptRemove,
    renderDialog: removeDialog
  } = (0,_hooks_useAccountRemoval__WEBPACK_IMPORTED_MODULE_16__.useAccountRemoval)(toBeRemoved);
  const handleCopyClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(ev => {
    ev.stopPropagation();
    if (!address || !network?.vmName) {
      return;
    }
    const eventName = getCopyEventNameByNetworkType(network.vmName);
    navigator.clipboard.writeText(address);
    toast.success('Copied!', {
      duration: 1000
    });
    capture(eventName, {
      type: account.type
    });
  }, [address, account.type, capture, network?.vmName, toast]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    key: account.id,
    ref: ref,
    direction: "row",
    sx: {
      width: 1,
      cursor: 'pointer',
      opacity: isManageMode ? isSelectable ? 1 : 0.6 : 1,
      transition: theme.transitions.create('opacity'),
      ':hover': {
        opacity: isManageMode ? isSelectable ? 1 : 0.6 : 1
      }
    },
    onClick: isManageMode ? undefined : handleAccountClick,
    onClickCapture: isManageMode ? handleAccountClick : undefined,
    "data-testid": `account-li-item-${account.id}`,
    onMouseEnter: () => setCardHovered(true),
    onMouseLeave: () => setCardHovered(false)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Collapse, {
    in: isManageMode,
    orientation: "horizontal"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    sx: {
      height: 1,
      ml: -1,
      pr: 0.25,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Tooltip, {
    title: nonSelectableHint,
    sx: {
      cursor: isSelectable ? 'pointer' : 'not-allowed'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Checkbox, {
    disableRipple: true,
    disabled: !isSelectable,
    onChange: () => toggle(account.id),
    checked: selectedAccounts.includes(account.id)
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    ref: itemRef,
    sx: {
      flexGrow: 1,
      width: 1,
      // maxWidth is needed due to potentially long account name stopping the container from shrinking
      maxWidth: isManageMode ? 'calc(100% - 32px)' : '100%',
      borderRadius: 1,
      transition: 'color .2s ease-in-out, background-color .2s ease-in-out, max-width .2s ease-in-out',
      backgroundColor: isActive ? 'grey.700' : 'grey.850',
      color: isActive ? 'grey.50' : 'text.primary',
      ':hover': {
        backgroundColor: isActive ? 'grey.700' : 'grey.800',
        color: 'grey.50'
      },
      py: 0.75,
      pl: 2,
      pr: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    sx: {
      flexDirection: 'row',
      minWidth: 0,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    sx: {
      minWidth: 0,
      justifyContent: 'space-between',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_AccountName__WEBPACK_IMPORTED_MODULE_15__["default"], {
    accountName: account.name,
    promptRename: promptRename,
    cardHovered: cardHovered,
    isActive: isActive
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    sx: {
      flexDirection: 'row',
      gap: 1,
      alignItems: 'center'
    }
  }, address ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Tooltip, {
    title: address,
    slotProps: {
      popper: {
        onClick: ev => ev.stopPropagation()
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Typography, {
    variant: "caption",
    color: isActive ? 'text.primary' : 'text.secondary',
    fontStyle: address ? 'normal' : 'italic'
  }, (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_9__.truncateAddress)(address))) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Typography, {
    variant: "caption",
    color: isActive ? 'text.primary' : 'text.secondary',
    fontStyle: "italic"
  }, t('Active network is not supported')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Grow, {
    in: cardHovered || isActive
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.IconButton, {
    color: "primary",
    size: "small",
    sx: {
      p: 0.5
    },
    onClick: handleCopyClick
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.CopyIcon, {
    size: 12
  }))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      pl: 2,
      pr: 1,
      pt: 0.25,
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_AccountBalance__WEBPACK_IMPORTED_MODULE_13__.AccountBalance, {
    refreshBalance: getBalance,
    balanceTotalUSD: totalBalance,
    isBalanceLoading: isBalanceLoading,
    accountType: account.type,
    isActive: isActive,
    isHovered: cardHovered
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_19__.Collapse, {
    orientation: "horizontal",
    in: !isManageMode && cardHovered
  }, /*#__PURE__*/React.createElement(_AccountItemMenu__WEBPACK_IMPORTED_MODULE_14__.AccountItemMenu, {
    account: account,
    isActive: isActive,
    handleRemove: promptRemove,
    promptRename: promptRename,
    activateAccount: handleAccountClick,
    walletType: walletType,
    menuAnchor: itemRef
  })))))), renameDialog(), removeDialog());
});
AccountItem.displayName = 'AccountItem';
const getCopyEventNameByNetworkType = type => {
  // We remap BTC and EVM because we used those in older event names
  const normalizedType = type === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_20__.NetworkVMType.BITCOIN ? 'Btc' : type === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_20__.NetworkVMType.EVM ? 'Eth' : type;
  return `AccountSelector${normalizedType}AddressCopied`;
};

/***/ }),

/***/ "./src/pages/Accounts/components/AccountItemMenu.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/Accounts/components/AccountItemMenu.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountItemMenu": () => (/* binding */ AccountItemMenu)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _hooks_usePrivateKeyExport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/usePrivateKeyExport */ "./src/pages/Accounts/hooks/usePrivateKeyExport.ts");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







const AccountItemMenu = ({
  account,
  activateAccount,
  promptRename,
  handleRemove,
  isActive,
  walletType,
  menuAnchor
}) => {
  const {
    isAccountSelectable
  } = (0,_providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_3__.useAccountManager)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useHistory)();
  const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const {
    isPrivateKeyAvailable,
    showPrivateKey
  } = (0,_hooks_usePrivateKeyExport__WEBPACK_IMPORTED_MODULE_2__.usePrivateKeyExport)(account, walletType);
  const isDeletable = isAccountSelectable(account);
  const goToDetails = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(e => {
    e.stopPropagation();
    history.push(`/accounts/${account.id}`);
  }, [history, account.id]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ClickAwayListener, {
    mouseEvent: "onMouseDown",
    onClickAway: () => setIsOpen(false)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.IconButton, {
    sx: {
      p: 0,
      mr: -0.5
    },
    "data-testid": `${isActive ? 'active' : 'inactive'}-account-item-menu`,
    onClick: e => {
      e.stopPropagation();
      setIsOpen(open => !open);
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.MoreVerticalIcon, {
    size: 24
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Popper, {
    open: isOpen,
    anchorEl: menuAnchor.current,
    placement: "bottom",
    transition: true
  }, ({
    TransitionProps
  }) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, TransitionProps, {
    timeout: 250
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.MenuList, {
    sx: {
      m: 1,
      p: 0,
      minWidth: 270,
      overflow: 'hidden',
      backgroundColor: 'grey.800',
      color: 'text.primary',
      border: '1px solid rgba(255,255,255,0.05)'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.MenuItem, {
    onClick: goToDetails,
    "data-testid": "show-account-details-button",
    sx: {
      minHeight: '40px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ListItemText, null, t('View Details'))), !isActive && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.MenuItem, {
    onClick: e => {
      e.stopPropagation();
      activateAccount();
    },
    "data-testid": "activate-account-button",
    sx: {
      borderTop: '1px solid rgba(255,255,255,0.1)',
      minHeight: '40px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ListItemText, null, t('Select this wallet'))), isPrivateKeyAvailable && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.MenuItem, {
    onClick: showPrivateKey,
    "data-testid": "export-private-key-button",
    sx: {
      borderTop: '1px solid rgba(255,255,255,0.1)',
      minHeight: '40px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ListItemText, null, t('Show private key'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.MenuItem, {
    onClick: promptRename,
    "data-testid": "export-private-key-button",
    sx: {
      borderTop: '1px solid rgba(255,255,255,0.1)',
      minHeight: '40px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ListItemText, null, t('Edit name'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {
    sx: {
      width: 1
    },
    disableInteractive: true,
    title: isDeletable ? '' : t('Only the last account of the wallet can be removed')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.MenuItem, {
    disabled: !isDeletable,
    onClick: handleRemove,
    "data-testid": "remove-account-button",
    sx: {
      width: 1,
      borderTop: '5px solid rgba(255,255,255,0.1)',
      minHeight: '40px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ListItemText, {
    sx: {
      color: 'error.main'
    }
  }, t('Remove Account')))))))));
};

/***/ }),

/***/ "./src/pages/Accounts/components/AccountListImported.tsx":
/*!***************************************************************!*\
  !*** ./src/pages/Accounts/components/AccountListImported.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountListImported": () => (/* binding */ AccountListImported)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/accounts/utils/typeGuards */ "./src/background/services/accounts/utils/typeGuards.ts");
/* harmony import */ var _src_background_services_balances_handlers_getTotalBalanceForWallet_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/balances/handlers/getTotalBalanceForWallet/models */ "./src/background/services/balances/handlers/getTotalBalanceForWallet/models.ts");
/* harmony import */ var _hooks_useWalletTotalBalance__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hooks/useWalletTotalBalance */ "./src/pages/Accounts/hooks/useWalletTotalBalance.ts");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* harmony import */ var _AccountItem__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./AccountItem */ "./src/pages/Accounts/components/AccountItem.tsx");
/* harmony import */ var _WalletHeader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./WalletHeader */ "./src/pages/Accounts/components/WalletHeader.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










const AccountListImported = ({
  accounts
}) => {
  const {
    accounts: {
      active
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const [isExpanded, setIsExpanded] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency
  } = (0,_hooks_useWalletTotalBalance__WEBPACK_IMPORTED_MODULE_5__.useWalletTotalBalance)(_src_background_services_balances_handlers_getTotalBalanceForWallet_models__WEBPACK_IMPORTED_MODULE_4__.IMPORTED_ACCOUNTS_WALLET_ID);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      pt: 0.75,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_WalletHeader__WEBPACK_IMPORTED_MODULE_8__["default"], {
    name: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Imported'),
    isLoading: isLoading,
    hasBalanceError: hasErrorOccurred,
    totalBalance: totalBalanceInCurrency,
    isActive: (0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_3__.isImportedAccount)(active),
    isExpanded: isExpanded,
    toggle: () => setIsExpanded(e => !e)
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Collapse, {
    timeout: 200,
    in: isExpanded
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      width: 1,
      gap: 1,
      px: 2
    }
  }, accounts.map(account => /*#__PURE__*/React.createElement(_AccountItem__WEBPACK_IMPORTED_MODULE_7__.AccountItem, {
    key: account.id,
    account: account,
    selectionMode: _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_6__.SelectionMode.Any
  })))));
};

/***/ }),

/***/ "./src/pages/Accounts/components/AccountListPrimary.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/Accounts/components/AccountListPrimary.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountListPrimary": () => (/* binding */ AccountListPrimary)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _WalletContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WalletContainer */ "./src/pages/Accounts/components/WalletContainer.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const AccountListPrimary = ({
  primaryAccounts,
  sx
}) => {
  const {
    walletDetails: activeWalletDetails,
    wallets
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_0__.useWalletContext)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 1,
      width: 1,
      ...sx
    }
  }, Object.keys(primaryAccounts).map(walletId => {
    const walletAccounts = primaryAccounts[walletId];
    const walletDetails = wallets.find(wallet => wallet.id === walletId);
    if (!walletDetails) {
      return;
    }
    const isActive = activeWalletDetails?.id === walletId;
    if (walletAccounts && walletAccounts.length > 0) {
      return /*#__PURE__*/React.createElement(_WalletContainer__WEBPACK_IMPORTED_MODULE_1__.WalletContainer, {
        key: walletId,
        walletDetails: walletDetails,
        isActive: isActive,
        accounts: walletAccounts
      });
    }
  }));
};

/***/ }),

/***/ "./src/pages/Accounts/components/AccountName.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/Accounts/components/AccountName.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AccountName)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* harmony import */ var _OverflowingTypography__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OverflowingTypography */ "./src/pages/Accounts/components/OverflowingTypography.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const commonTransitionProps = {
  timeout: 200,
  easing: 'ease-in-out',
  appear: true
};
function AccountName({
  accountName,
  cardHovered,
  isActive,
  promptRename
}) {
  const {
    isManageMode
  } = (0,_providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountManager)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Box, {
    sx: {
      flexShrink: 0,
      width: isActive ? 6 : 0,
      height: isActive ? 6 : 0,
      marginRight: isActive ? 0.5 : 0,
      borderRadius: 1,
      position: 'relative',
      backgroundColor: 'success.main',
      transitionDuration: '200ms',
      transitionTimingFunction: 'ease-in-out',
      transitionProperty: 'width, height, margin-right'
    }
  }), /*#__PURE__*/React.createElement(_OverflowingTypography__WEBPACK_IMPORTED_MODULE_2__.OverflowingTypography, {
    "data-testid": "account-name",
    variant: "caption",
    fontWeight: 600,
    lineHeight: "16px",
    sx: {
      mr: 1
    }
  }, accountName), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonTransitionProps, {
    in: cardHovered && !isManageMode
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.IconButton, {
    size: "small",
    sx: {
      p: 0.25
    },
    onClick: e => {
      e.stopPropagation();
      promptRename();
    },
    "data-testid": "rename-account-btn"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.PencilRoundIcon, {
    size: 16
  }))));
}

/***/ }),

/***/ "./src/pages/Accounts/components/AccountsActionButton.tsx":
/*!****************************************************************!*\
  !*** ./src/pages/Accounts/components/AccountsActionButton.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountsActionButton": () => (/* binding */ AccountsActionButton)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_utils_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/utils/environment */ "./src/utils/environment.ts");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");












const MenuItemColumn = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack)`
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid
    ${({
  theme,
  hasNoBorder
}) => hasNoBorder ? 'transparent' : theme.palette.grey[800]};
  padding-top: ${({
  theme
}) => theme.spacing(1.5)};
  padding-bottom: ${({
  theme
}) => theme.spacing(1.5)};
`;
const StyledMenuItem = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.MenuItem)`
  cursor: pointer;
  padding: 0;
  width: 100%;
`;
const IconColumn = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack)`
  padding-right: ${({
  theme
}) => theme.spacing(2)};
  padding-left: ${({
  theme
}) => theme.spacing(2)};
`;
const AccountsActionButton = ({
  isLoading,
  onAddNewAccount,
  canCreateAccount
}) => {
  const [isMenuOpen, setIsMenuOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useHistory)();
  const toggleButtonRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_11__.useTranslation)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_3__.useFeatureFlagContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_7__.useAnalyticsContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__.useNetworkContext)();
  const goToImportScreen = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    capture('ImportPrivateKey_Clicked');
    history.push('/import-private-key');
  }, [history, capture]);
  const goToAddSeedphraseScreen = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    capture('AddWalletWithSeedphrase_Clicked');
    history.push('/accounts/add-wallet/seedphrase');
  }, [history, capture]);
  const goToAddKeystoreFileScreen = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    capture('AddWalletWithKeystoreFile_Clicked');
    history.push('/accounts/add-wallet/keystore');
  }, [history, capture]);
  const goToAddLedgerScreen = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    capture('AddWalletWithLedger_Clicked');

    // Open in a full screen tab to avoid popup hell
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_2___default().tabs.create({
      url: `/fullscreen.html#/accounts/add-wallet/ledger`
    });
  }, [capture]);
  const goToWalletConnectScreen = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    capture('ImportWithWalletConnect_Clicked');
    history.push('/import-with-walletconnect');
  }, [history, capture]);
  const goToFireblocksWalletConnectScreen = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    capture('ImportWithFireblocks_Clicked');
    history.push('/fireblocks/import-with-walletconnect');
  }, [history, capture]);
  const fireblocksDisabledReason = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if ((0,_src_utils_environment__WEBPACK_IMPORTED_MODULE_6__.isProductionBuild)() && network?.chainId !== _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_12__.ChainId.AVALANCHE_MAINNET_ID) {
      return t('Please switch to Avalanche C-Chain to import your Fireblocks account.');
    }
    return '';
  }, [t, network]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ClickAwayListener, {
    onClickAway: () => setIsMenuOpen(false)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, {
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    onClick: () => setIsMenuOpen(open => !open),
    isLoading: isLoading,
    disabled: isLoading,
    endIcon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ChevronDownIcon, {
      sx: {
        transition: 'transform ease-in-out .15s',
        transform: isMenuOpen ? 'rotateX(180deg)' : 'none'
      }
    }),
    fullWidth: true,
    "data-testid": "account-options",
    size: "xlarge",
    sx: {
      fontSize: 14
    },
    ref: toggleButtonRef
  }, t('Add or Connect Wallet')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Popper, {
    open: isMenuOpen,
    anchorEl: toggleButtonRef.current,
    placement: "top-end",
    transition: true
  }, ({
    TransitionProps
  }) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, TransitionProps, {
    timeout: 250
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.MenuList, {
    dense: true,
    sx: {
      p: 0,
      py: 1,
      mb: 2,
      overflow: 'hidden',
      backgroundColor: 'grey.850',
      width: '343px',
      height: '468px',
      boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.60)'
    }
  }, /*#__PURE__*/React.createElement(StyledMenuItem, {
    onClick: goToImportScreen,
    "data-testid": "add-import-account"
  }, /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.KeyIcon, {
    size: 24
  })), /*#__PURE__*/React.createElement(MenuItemColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'bold'
    }
  }, t('Import Private Key'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, t('Import a single-chain account')))), /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ChevronRightIcon, {
    size: 24,
    sx: {
      color: 'grey.500'
    }
  })))), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.IMPORT_WALLET_CONNECT] && /*#__PURE__*/React.createElement(StyledMenuItem, {
    "data-testid": "import-wallet-connect",
    onClick: goToWalletConnectScreen
  }, /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.WalletConnectIcon, {
    size: 24
  })), /*#__PURE__*/React.createElement(MenuItemColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'bold'
    }
  }, t('Connect using Wallet Connect'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, t('Import account with Wallet Connect')))), /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ChevronRightIcon, {
    size: 24,
    sx: {
      color: 'grey.500'
    }
  })))), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.IMPORT_FIREBLOCKS] && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Tooltip, {
    title: fireblocksDisabledReason,
    sx: {
      cursor: fireblocksDisabledReason ? 'not-allowed' : 'pointer'
    }
  }, /*#__PURE__*/React.createElement(StyledMenuItem, {
    "data-testid": "import-wallet-connect",
    onClick: goToFireblocksWalletConnectScreen,
    disabled: Boolean(fireblocksDisabledReason)
  }, /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.FireblocksIcon, {
    size: 24
  })), /*#__PURE__*/React.createElement(MenuItemColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'bold'
    }
  }, t('Import Fireblocks Account'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, t('Use Fireblocks application')))), /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ChevronRightIcon, {
    size: 24,
    sx: {
      color: 'grey.500'
    }
  }))))), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.ADD_WALLET_WITH_SEEDPHRASE] && /*#__PURE__*/React.createElement(StyledMenuItem, {
    onClick: goToAddSeedphraseScreen,
    "data-testid": "add-wallet-seed-phrase"
  }, /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ListIcon, {
    size: 24
  })), /*#__PURE__*/React.createElement(MenuItemColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'bold'
    }
  }, t('Import Recovery Phrase'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, t('Import accounts from another wallet')))), /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ChevronRightIcon, {
    size: 24,
    sx: {
      color: 'grey.500'
    }
  })))), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.ADD_WALLET_WITH_LEDGER] && /*#__PURE__*/React.createElement(StyledMenuItem, {
    onClick: goToAddLedgerScreen,
    "data-testid": "add-wallet-ledger"
  }, /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.LedgerIcon, {
    size: 24
  })), /*#__PURE__*/React.createElement(MenuItemColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'bold'
    }
  }, t('Import Ledger Wallet'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, t('Use your Ledger hardware wallet')))), /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ChevronRightIcon, {
    size: 24,
    sx: {
      color: 'grey.500'
    }
  })))), featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_4__.FeatureGates.ADD_WALLET_WITH_KEYSTORE_FILE] && /*#__PURE__*/React.createElement(StyledMenuItem, {
    onClick: goToAddKeystoreFileScreen,
    "data-testid": "add-wallet-keystore-file"
  }, /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.KeystoreIcon, {
    size: 24
  })), /*#__PURE__*/React.createElement(MenuItemColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'bold'
    }
  }, t('Import Keystore File'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, t('Use a keystore from the Avalanche Wallet')))), /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ChevronRightIcon, {
    size: 24,
    sx: {
      color: 'grey.500'
    }
  })))), canCreateAccount && /*#__PURE__*/React.createElement(StyledMenuItem, {
    onClick: () => {
      onAddNewAccount();
      setIsMenuOpen(false);
    },
    "data-testid": 'add-primary-account'
  }, /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.PlusIcon, {
    size: 24
  })), /*#__PURE__*/React.createElement(MenuItemColumn, {
    hasNoBorder: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'bold'
    }
  }, t('Create New Account '))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, t('Add a new account to your active wallet')))), /*#__PURE__*/React.createElement(IconColumn, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.ChevronRightIcon, {
    size: 24,
    sx: {
      color: 'grey.500'
    }
  })))))))));
};

/***/ }),

/***/ "./src/pages/Accounts/components/WalletContainer.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/Accounts/components/WalletContainer.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletContainer": () => (/* binding */ WalletContainer)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _hooks_useWalletTotalBalance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useWalletTotalBalance */ "./src/pages/Accounts/hooks/useWalletTotalBalance.ts");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* harmony import */ var _AccountItem__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AccountItem */ "./src/pages/Accounts/components/AccountItem.tsx");
/* harmony import */ var _WalletHeader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./WalletHeader */ "./src/pages/Accounts/components/WalletHeader.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");









const WalletContainer = ({
  walletDetails,
  isActive,
  accounts
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const {
    isDeveloperMode
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__.useNetworkContext)();
  const [isExpanded, setIsExpanded] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    hasBalanceOnUnderivedAccounts
  } = (0,_hooks_useWalletTotalBalance__WEBPACK_IMPORTED_MODULE_3__.useWalletTotalBalance)(walletDetails.id);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      pt: 0.75,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_WalletHeader__WEBPACK_IMPORTED_MODULE_6__["default"], {
    walletDetails: walletDetails,
    isActive: isActive,
    isExpanded: isExpanded,
    isLoading: isLoading,
    hasBalanceError: hasErrorOccurred,
    totalBalance: totalBalanceInCurrency,
    toggle: () => setIsExpanded(e => !e)
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Collapse, {
    timeout: 200,
    in: isExpanded
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      width: 1,
      gap: 1,
      px: 2
    }
  }, accounts.map(account => /*#__PURE__*/React.createElement(_AccountItem__WEBPACK_IMPORTED_MODULE_5__.AccountItem, {
    key: account.id,
    account: account,
    selectionMode: walletDetails.type === _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_1__.SecretType.Seedless ? _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_4__.SelectionMode.None : _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_4__.SelectionMode.Consecutive,
    walletType: walletDetails?.type
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Grow, {
    in: isActive && hasBalanceOnUnderivedAccounts
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      px: 2,
      mt: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Button, {
    size: "small",
    variant: "text",
    onClick: () => {
      window.open(`https://${isDeveloperMode ? 'test.' : ''}core.app/tools/utxo-manager`, '_blank', 'noreferrer');
    },
    endIcon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.OutboundIcon, null)
  }, t('View P-Chain Details'))))));
};

/***/ }),

/***/ "./src/pages/Accounts/components/WalletHeader.tsx":
/*!********************************************************!*\
  !*** ./src/pages/Accounts/components/WalletHeader.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WalletHeader)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* harmony import */ var _OverflowingTypography__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./OverflowingTypography */ "./src/pages/Accounts/components/OverflowingTypography.tsx");
/* harmony import */ var _hooks_useWalletRename__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hooks/useWalletRename */ "./src/pages/Accounts/hooks/useWalletRename.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");









const commonTransitionProps = {
  timeout: 200,
  easing: 'ease-in-out',
  appear: true
};
function WalletHeader({
  walletDetails,
  name,
  isActive,
  isExpanded,
  isLoading,
  totalBalance,
  toggle
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const {
    isManageMode
  } = (0,_providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_3__.useAccountManager)();
  const {
    currencyFormatter
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_6__.useSettingsContext)();
  const [isHovered, setIsHovered] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const {
    prompt: promptRename,
    renderDialog: renameDialog
  } = (0,_hooks_useWalletRename__WEBPACK_IMPORTED_MODULE_5__.useWalletRename)(walletDetails);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      pl: 2,
      pr: 1,
      py: 1,
      gap: 2
    },
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      gap: 1,
      alignItems: 'center',
      flexDirection: 'row',
      minWidth: 0
    }
  }, (walletDetails?.type === _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_2__.SecretType.Ledger || walletDetails?.type == _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_2__.SecretType.LedgerLive) && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.LedgerIcon, {
    size: 16
  }), /*#__PURE__*/React.createElement(_OverflowingTypography__WEBPACK_IMPORTED_MODULE_4__.OverflowingTypography, {
    variant: "h6",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "16px",
    "data-testid": "wallet-name"
  }, walletDetails?.name ?? name), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Grow, {
    in: isActive,
    unmountOnExit: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Chip, {
    size: "small",
    sx: {
      fontSize: 10,
      height: 16
    },
    color: "success",
    label: t('Active'),
    "data-testid": "wallet-active-chip"
  })), walletDetails && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, commonTransitionProps, {
    in: isHovered && !isManageMode
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
    size: "small",
    onClick: promptRename
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.PencilRoundIcon, {
    size: 16
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    variant: "caption",
    fontWeight: 500,
    fontSize: 14,
    textAlign: "end",
    color: "text.secondary"
  }, isLoading ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.LoadingDotsIcon, {
    size: 20,
    orientation: "horizontal"
  }) : typeof totalBalance === 'number' ? currencyFormatter(totalBalance) : null), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
    size: "small",
    onClick: toggle
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.ChevronUpIcon, {
    size: 16,
    sx: {
      transition: 'transform .2s ease-in-out',
      transform: isExpanded ? 'rotateX(0deg)' : 'rotateX(180deg)'
    }
  }))), walletDetails && renameDialog());
}

/***/ }),

/***/ "./src/pages/Accounts/hooks/useWalletRename.tsx":
/*!******************************************************!*\
  !*** ./src/pages/Accounts/hooks/useWalletRename.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useWalletRename": () => (/* binding */ useWalletRename)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useScopedToast */ "./src/hooks/useScopedToast.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _useEntityRename__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useEntityRename */ "./src/pages/Accounts/hooks/useEntityRename.tsx");





const useWalletRename = wallet => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    renameWallet
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_2__.useWalletContext)();
  const toast = (0,_src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_1__.useScopedToast)('account-switcher');
  const onFailure = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => toast.success(t('Renaming failed'), {
    duration: 1000
  }), [toast, t]);
  const onSuccess = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => toast.success(t('Wallet renamed'), {
    duration: 1000
  }), [toast, t]);
  const updateFn = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(newName => {
    if (!wallet?.id) {
      toast.error(t('This wallet cannot be renamed'), {
        duration: 1000
      });
      return;
    }
    return renameWallet(wallet.id, newName.trim());
  }, [renameWallet, wallet?.id, t, toast]);
  return (0,_useEntityRename__WEBPACK_IMPORTED_MODULE_3__.useEntityRename)({
    currentName: wallet?.name ?? '',
    dialogTitle: t('Rename Wallet'),
    updateFn,
    onFailure,
    onSuccess
  });
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/useWalletTotalBalance.ts":
/*!***********************************************************!*\
  !*** ./src/pages/Accounts/hooks/useWalletTotalBalance.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useWalletTotalBalance": () => (/* binding */ useWalletTotalBalance)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _providers_WalletTotalBalanceProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../providers/WalletTotalBalanceProvider */ "./src/pages/Accounts/providers/WalletTotalBalanceProvider.tsx");


const useWalletTotalBalance = walletId => {
  const {
    walletBalances
  } = (0,_providers_WalletTotalBalanceProvider__WEBPACK_IMPORTED_MODULE_1__.useWalletTotalBalanceContext)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => walletId && walletBalances[walletId] || {
    isLoading: false,
    hasErrorOccurred: false
  }, [walletBalances, walletId]);
};

/***/ }),

/***/ "./src/pages/Accounts/providers/WalletTotalBalanceProvider.tsx":
/*!*********************************************************************!*\
  !*** ./src/pages/Accounts/providers/WalletTotalBalanceProvider.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletTotalBalanceContext": () => (/* binding */ WalletTotalBalanceContext),
/* harmony export */   "WalletTotalBalanceProvider": () => (/* binding */ WalletTotalBalanceProvider),
/* harmony export */   "useWalletTotalBalanceContext": () => (/* binding */ useWalletTotalBalanceContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_background_services_balances_handlers_getTotalBalanceForWallet_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/balances/handlers/getTotalBalanceForWallet/models */ "./src/background/services/balances/handlers/getTotalBalanceForWallet/models.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







const WalletTotalBalanceContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  walletBalances: {},
  fetchBalanceForWallet: () => Promise.resolve()
});
const WalletTotalBalanceProvider = ({
  children
}) => {
  const {
    accounts: {
      imported
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const {
    wallets
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_4__.useWalletContext)();
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_5__.useConnectionContext)();
  const hasImportedAccounts = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Object.keys(imported).length > 0, [imported]);
  const [walletBalances, setWalletBalances] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const fetchBalanceForWallet = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async walletId => {
    setWalletBalances(prevState => ({
      ...prevState,
      [walletId]: {
        ...prevState[walletId],
        hasErrorOccurred: false,
        isLoading: true
      }
    }));
    request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_6__.ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET,
      params: {
        walletId
      }
    }).then(walletBalanceInfo => {
      setWalletBalances(prevState => ({
        ...prevState,
        [walletId]: {
          ...walletBalanceInfo,
          hasErrorOccurred: false,
          isLoading: false
        }
      }));
    }).catch(err => {
      console.log('Error while fetching total balance for wallet', err);
      setWalletBalances(prevState => ({
        ...prevState,
        [walletId]: {
          ...prevState[walletId],
          hasErrorOccurred: true,
          isLoading: false
        }
      }));
    });
  }, [request]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let isMounted = true;
    const fetchWalletBalancesSequentially = async walletIds => {
      for (const walletId of walletIds) {
        await fetchBalanceForWallet(walletId);
        if (!isMounted) {
          return;
        }
      }
    };
    const walletIds = [...wallets.map(({
      id
    }) => id), hasImportedAccounts ? _src_background_services_balances_handlers_getTotalBalanceForWallet_models__WEBPACK_IMPORTED_MODULE_3__.IMPORTED_ACCOUNTS_WALLET_ID : undefined].filter(lodash__WEBPACK_IMPORTED_MODULE_1__.isString);
    fetchWalletBalancesSequentially(walletIds);
    return () => {
      isMounted = false;
    };
  }, [wallets, hasImportedAccounts, fetchBalanceForWallet]);
  return /*#__PURE__*/React.createElement(WalletTotalBalanceContext.Provider, {
    value: {
      walletBalances,
      fetchBalanceForWallet
    }
  }, children);
};
function useWalletTotalBalanceContext() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(WalletTotalBalanceContext);
}

/***/ }),

/***/ "./src/pages/SignTransaction/components/LedgerApprovalDialog.tsx":
/*!***********************************************************************!*\
  !*** ./src/pages/SignTransaction/components/LedgerApprovalDialog.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerApprovalDialog": () => (/* binding */ LedgerApprovalDialog)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



function LedgerApprovalDialog({
  address,
  amount,
  symbol,
  fee,
  feeSymbol,
  header,
  nftName,
  currentSignature,
  requiredSignatures
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const title = header ?? t('Approve on your Ledger');
  const hasSignaturesInfo = typeof requiredSignatures === 'number' && typeof currentSignature === 'number';
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: '337px',
      alignItems: 'center',
      p: 2,
      borderRadius: 2,
      background: theme.palette.background.paper
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "h5",
    sx: {
      mb: 2
    }
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Box, {
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: '100%'
    }
  }, address && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    margin: "0 0 4px 0",
    variant: "body2",
    sx: {
      color: theme.palette.text.secondary
    }
  }, t('To')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body1"
  }, (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__.truncateAddress)(address, 12))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Divider, {
    sx: {
      my: 2
    }
  }), amount && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    margin: "0 0 4px 0",
    sx: {
      color: theme.palette.text.secondary
    }
  }, t('Amount')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body1"
  }, amount, " ", symbol)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Divider, {
    sx: {
      my: 2
    }
  })), fee && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    margin: "0 0 4px 0",
    sx: {
      color: theme.palette.text.secondary
    }
  }, t('Fee')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body1"
  }, fee, " ", feeSymbol)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Divider, {
    sx: {
      my: 2
    }
  })), nftName && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    margin: "0 0 4px 0"
  }, t('Collectible')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body1"
  }, nftName)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Divider, {
    sx: {
      my: 2
    }
  })), hasSignaturesInfo && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    margin: "0 0 4px 0"
  }, t('Current signature')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body1"
  }, t('{{current}} out of {{total}}', {
    current: currentSignature,
    total: requiredSignatures
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Divider, {
    sx: {
      my: 2
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    margin: "0 0 4px 0"
  }, t('Status')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      mt: 1,
      flexDirection: 'row',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CircularProgress, {
    size: 24
  }))))));
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FjY291bnRzX0FjY291bnRzX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlTyxNQUFNQSxlQUFlLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDNUIsTUFBTUMsaUJBQWlCLEdBQUcsRUFBRTtBQUM1QixNQUFNQywyQkFBMkIsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN4QyxNQUFNQywyQkFBMkIsR0FBRyxjQUFjO0FBRWxELE1BQU1DLHlCQUF5QixHQUFJQyxRQUFnQixJQUN4REEsUUFBUSxLQUFLRiwyQkFBMkI7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQjBCO0FBQ3BDO0FBRXpCLFNBQVNLLHlCQUF5QkEsQ0FBQ0MsT0FBaUIsRUFBRTtFQUMzRCxNQUFNO0lBQUVDO0VBQWdCLENBQUMsR0FBR0osa0ZBQWtCLEVBQUU7RUFFaEQsT0FBT0MsOENBQU8sQ0FBQyxNQUFNO0lBQ25CLElBQUksQ0FBQ0UsT0FBTyxFQUFFRSxRQUFRLEVBQUU7TUFDdEIsT0FBTyxJQUFJO0lBQ2I7SUFFQSxPQUFPRCxlQUFlLENBQUNELE9BQU8sQ0FBQ0UsUUFBUSxDQUFDO0VBQzFDLENBQUMsRUFBRSxDQUFDRixPQUFPLEVBQUVFLFFBQVEsRUFBRUQsZUFBZSxDQUFDLENBQUM7QUFDMUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2RzRDtBQVVqQjtBQUNVO0FBRXFCO0FBQ0U7QUFFQztBQVd2RSxNQUFNaUIsbUJBQW1CLEdBQUdSLHVFQUFNLENBQUNKLG9FQUFXLEVBQUU7RUFDOUNhLGlCQUFpQixFQUFHQyxJQUFJLElBQUtBLElBQUksS0FBSztBQUN4QyxDQUFDLENBQTJCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsQ0FBQztFQUFFQztBQUFXLENBQUMsS0FDMUJBLFVBQVUsR0FBRyxnQ0FBZ0MsR0FBRyxNQUFPO0FBQzNELENBQUM7QUFFRCxNQUFNQyxxQkFBcUIsR0FBRztFQUM1QkMsT0FBTyxFQUFFLEdBQUc7RUFDWkMsTUFBTSxFQUFFLGFBQWE7RUFDckJDLE1BQU0sRUFBRTtBQUNWLENBQUM7QUFFTSxTQUFTQyxjQUFjQSxDQUFDO0VBQzdCQyxjQUFjO0VBQ2RDLGVBQWU7RUFDZkMsZ0JBQWdCO0VBQ2hCQyxXQUFXO0VBQ1hDLFFBQVE7RUFDUkM7QUFDbUIsQ0FBQyxFQUFFO0VBQ3RCLE1BQU07SUFBRUM7RUFBRSxDQUFDLEdBQUduQiw2REFBYyxFQUFFO0VBQzlCLE1BQU07SUFBRW9CO0VBQWEsQ0FBQyxHQUFHakIsb0ZBQWlCLEVBQUU7RUFDNUMsTUFBTTtJQUFFa0IsUUFBUTtJQUFFQztFQUFrQixDQUFDLEdBQUdyQixrRkFBa0IsRUFBRTtFQUM1RCxNQUFNLENBQUNzQixhQUFhLEVBQUVDLGdCQUFnQixDQUFDLEdBQUdqQywrQ0FBUSxDQUFDLEVBQUUsQ0FBQztFQUN0RCxNQUFNa0MsY0FBYyxHQUFHbkMsNkNBQU0sRUFBbUI7RUFDaEQsTUFBTTtJQUFFb0M7RUFBUSxDQUFDLEdBQUd4QixvRkFBbUIsRUFBRTtFQUV6QyxNQUFNeUIsVUFBVSxHQUFHYixlQUFlLEtBQUssSUFBSTtFQUUzQyxNQUFNYyxXQUFXLEdBQUd2QyxrREFBVyxDQUM3QixNQUFPd0MsQ0FBbUIsSUFBSztJQUM3QkEsQ0FBQyxDQUFDQyxlQUFlLEVBQUU7O0lBRW5CO0lBQ0EsSUFBSUwsY0FBYyxDQUFDTSxPQUFPLEVBQUU7TUFDMUJQLGdCQUFnQixDQUFDQyxjQUFjLENBQUNNLE9BQU8sRUFBRUMsV0FBVyxDQUFDO0lBQ3ZEO0lBRUEsTUFBTW5CLGNBQWMsRUFBRTs7SUFFdEI7SUFDQSxJQUFJWSxjQUFjLENBQUNNLE9BQU8sRUFBRTtNQUMxQlAsZ0JBQWdCLENBQUNDLGNBQWMsQ0FBQ00sT0FBTyxFQUFFQyxXQUFXLENBQUM7SUFDdkQ7RUFDRixDQUFDLEVBQ0QsQ0FBQ25CLGNBQWMsQ0FBQyxDQUNqQjtFQUVELE1BQU1vQixnQkFBZ0IsR0FBRzVDLGtEQUFXLENBQ2pDd0MsQ0FBbUIsSUFBSztJQUN2QkQsV0FBVyxDQUFDQyxDQUFDLENBQUM7SUFDZEgsT0FBTyxDQUFDLHNDQUFzQyxFQUFFO01BQzlDUSxJQUFJLEVBQUVsQjtJQUNSLENBQUMsQ0FBQztFQUNKLENBQUMsRUFDRCxDQUFDWSxXQUFXLEVBQUVGLE9BQU8sRUFBRVYsV0FBVyxDQUFDLENBQ3BDO0VBRUQsTUFBTW1CLG9CQUFvQixHQUFHOUMsa0RBQVcsQ0FDckN3QyxDQUFtQixJQUFLO0lBQ3ZCRCxXQUFXLENBQUNDLENBQUMsQ0FBQztJQUNkSCxPQUFPLENBQUMsbUNBQW1DLEVBQUU7TUFDM0NRLElBQUksRUFBRWxCO0lBQ1IsQ0FBQyxDQUFDO0VBQ0osQ0FBQyxFQUNELENBQUNZLFdBQVcsRUFBRUYsT0FBTyxFQUFFVixXQUFXLENBQUMsQ0FDcEM7RUFFRCxvQkFDRW9CLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsOERBQUs7SUFDSjRDLFNBQVMsRUFBQyxLQUFLO0lBQ2ZDLEVBQUUsRUFBRTtNQUNGQyxVQUFVLEVBQUUsUUFBUTtNQUNwQkMsUUFBUSxFQUFFLFFBQVE7TUFDbEJDLFFBQVEsRUFBRSxVQUFVO01BQ3BCQyxTQUFTLEVBQUUsTUFBTTtNQUNqQkMsR0FBRyxFQUFFO0lBQ1AsQ0FBRTtJQUNGQyxLQUFLLEVBQUU7TUFBRUMsUUFBUSxFQUFFdkI7SUFBYztFQUFFLGdCQUVuQ2EsS0FBQSxDQUFBQyxhQUFBLENBQUN0Qyw2REFBSSxFQUFBZ0QsMEVBQUEsS0FBS3ZDLHFCQUFxQjtJQUFFd0MsRUFBRSxFQUFFakM7RUFBaUIsaUJBQ3BEcUIsS0FBQSxDQUFBQyxhQUFBLENBQUM1QyxpRUFBUTtJQUNQd0QsTUFBTSxFQUFFLEVBQUc7SUFDWEMsS0FBSyxFQUFFbkMsZ0JBQWdCLEdBQUdRLGFBQWEsR0FBRyxDQUFFO0lBQzVDZ0IsRUFBRSxFQUFFO01BQ0ZHLFFBQVEsRUFBRSxVQUFVO01BQ3BCUyxLQUFLLEVBQUUsQ0FBQztNQUNSQyxVQUFVLEVBQUU7SUFDZDtFQUFFLEVBQ0YsQ0FDRyxlQUNQaEIsS0FBQSxDQUFBQyxhQUFBLENBQUN0Qyw2REFBSSxFQUFBZ0QsMEVBQUEsS0FDQ3ZDLHFCQUFxQjtJQUN6QndDLEVBQUUsRUFBRSxDQUFDckIsVUFBVSxJQUFJLENBQUNaLGdCQUFpQjtJQUNyQ3NDLFlBQVk7SUFDWkMsYUFBYTtFQUFBLGlCQUVibEIsS0FBQSxDQUFBQyxhQUFBLENBQUN2QywrREFBTTtJQUNMeUQsR0FBRyxFQUFFOUIsY0FBZTtJQUNwQitCLE9BQU8sRUFBQyxNQUFNO0lBQ2QsZUFBWSxxQkFBcUI7SUFDakNDLElBQUksRUFBQyxPQUFPO0lBQ1pDLGFBQWE7SUFDYkMsT0FBTyxFQUFFeEI7RUFBcUIsR0FFN0JoQixDQUFDLENBQUMsY0FBYyxDQUFDLENBQ1gsQ0FDSixlQUVQaUIsS0FBQSxDQUFBQyxhQUFBLENBQUN0Qyw2REFBSSxFQUFBZ0QsMEVBQUEsS0FDQ3ZDLHFCQUFxQjtJQUN6QndDLEVBQUUsRUFBRXJCLFVBQVUsSUFBSVQsU0FBUyxJQUFJLENBQUNILGdCQUFnQixJQUFJLENBQUNLLFlBQWE7SUFDbEVpQyxZQUFZO0lBQ1pDLGFBQWE7RUFBQSxpQkFFYmxCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDeEMsbUVBQVU7SUFDVDRELElBQUksRUFBQyxPQUFPO0lBQ1pFLE9BQU8sRUFBRTFCLGdCQUFpQjtJQUMxQixlQUFZLHlCQUF5QjtJQUNyQ00sRUFBRSxFQUFFO01BQUVxQixDQUFDLEVBQUU7SUFBSztFQUFFLGdCQUVoQnhCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDakMsbUJBQW1CO0lBQUNxRCxJQUFJLEVBQUUsRUFBRztJQUFDbEQsVUFBVSxFQUFFUTtFQUFpQixFQUFHLENBQ3BELENBQ1IsZUFFUHFCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDdEMsNkRBQUksRUFBQWdELDBFQUFBLEtBQ0N2QyxxQkFBcUI7SUFDekJ3QyxFQUFFLEVBQUVyQixVQUFVLElBQUksQ0FBQ1osZ0JBQWlCO0lBQ3BDc0MsWUFBWTtJQUNaQyxhQUFhO0VBQUEsaUJBRWJsQixLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQ1Q0RCxHQUFHLEVBQUU5QixjQUFlO0lBQ3BCK0IsT0FBTyxFQUFDLE9BQU87SUFDZkssS0FBSyxFQUFFNUMsUUFBUSxHQUFHLGNBQWMsR0FBRztFQUFpQixHQUVuREssaUJBQWlCLENBQUNSLGVBQWUsSUFBSSxDQUFDLENBQUMsQ0FBQ2dELE9BQU8sQ0FBQ3pDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FDbkQsQ0FDUixDQUNEO0FBRVo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyTDBDO0FBWUw7QUFDVDtBQUNrQjtBQUVzQjtBQUNKO0FBQ007QUFDNEI7QUFFM0I7QUFDWjtBQUNxQjtBQUN2QjtBQUM2QjtBQUN0QjtBQUNJO0FBQ0E7QUFFRztBQUNUO0FBQ087QUFDRTtBQUNFO0FBQ0U7QUFDTDtBQUNnQjtBQUUvRSxTQUFTaUUsUUFBUUEsQ0FBQSxFQUFHO0VBQ3pCLE1BQU07SUFDSkMsYUFBYTtJQUNiQyxVQUFVO0lBQ1ZDLFFBQVEsRUFBRTtNQUFFQyxRQUFRLEVBQUVDLGdCQUFnQjtNQUFFQyxPQUFPLEVBQUVDLGVBQWU7TUFBRUM7SUFBTztFQUMzRSxDQUFDLEdBQUd4QixrRkFBa0IsRUFBRTtFQUN4QixNQUFNO0lBQUVsRCxZQUFZO0lBQUUyRSxnQkFBZ0I7SUFBRUM7RUFBaUIsQ0FBQyxHQUN4RDdGLHFGQUFpQixFQUFFO0VBRXJCLE1BQU04RixLQUFLLEdBQUd2Qix5RUFBYyxDQUFDLGtCQUFrQixDQUFDO0VBRWhELE1BQU0sQ0FBQ3dCLGlCQUFpQixFQUFFQyxvQkFBb0IsQ0FBQyxHQUFHNUcsK0NBQVEsQ0FBQyxLQUFLLENBQUM7RUFDakUsTUFBTTtJQUFFNkc7RUFBbUIsQ0FBQyxHQUFHN0IsOEVBQWdCLEVBQUU7RUFDakQsTUFBTTtJQUFFN0M7RUFBUSxDQUFDLEdBQUd4QixvRkFBbUIsRUFBRTtFQUN6QyxNQUFNbUcsS0FBSyxHQUFHakMsd0VBQVEsRUFBRTtFQUN4QixNQUFNa0MsT0FBTyxHQUFHakMsNkRBQVUsRUFBRTtFQUM1QixNQUFNO0lBQUVrQztFQUFjLENBQUMsR0FBR3pCLCtFQUFnQixFQUFFO0VBQzVDLE1BQU07SUFBRTBCLFNBQVM7SUFBRUMsc0JBQXNCLEVBQUVDO0VBQXlCLENBQUMsR0FDbkV0QixvRkFBcUIsQ0FDbkJQLHFHQUFnQixDQUFDaUIsTUFBTSxDQUFDLEdBQUdBLE1BQU0sQ0FBQ2hILFFBQVEsR0FBRzZILFNBQVMsQ0FDdkQ7RUFDSCxNQUFNO0lBQUVDO0VBQXNCLENBQUMsR0FBR3ZCLG9HQUE0QixFQUFFO0VBRWhFLE1BQU13QixnQkFBZ0IsR0FBR2YsTUFBTSxFQUFFNUQsSUFBSSxLQUFLdUMseUZBQW1CO0VBQzdELE1BQU07SUFBRXRGO0VBQWdCLENBQUMsR0FBR0osbUZBQWtCLEVBQUU7RUFFaEQsTUFBTWdJLG9CQUFvQixHQUFHL0gsOENBQU8sQ0FDbEMsTUFBTzhHLE1BQU0sRUFBRTFHLFFBQVEsR0FBR0QsZUFBZSxDQUFDMkcsTUFBTSxDQUFDMUcsUUFBUSxDQUFDLEdBQUcsSUFBSyxFQUNsRSxDQUFDMEcsTUFBTSxFQUFFMUcsUUFBUSxFQUFFRCxlQUFlLENBQUMsQ0FDcEM7RUFFRCxNQUFNNkgsa0JBQWtCLEdBQUcsTUFBQUEsQ0FBQSxLQUFZO0lBQ3JDYixvQkFBb0IsQ0FBQyxJQUFJLENBQUM7SUFFMUIsSUFBSTtNQUNGLE1BQU1jLEVBQUUsR0FBRyxNQUFNekIsVUFBVSxFQUFFO01BQzdCOUQsT0FBTyxDQUFDLGdDQUFnQyxFQUFFO1FBQ3hDd0YsVUFBVSxFQUFFWCxhQUFhLEVBQUVyRTtNQUM3QixDQUFDLENBQUM7TUFDRixNQUFNcUQsYUFBYSxDQUFDMEIsRUFBRSxDQUFDOztNQUV2QjtNQUNBLElBQUlWLGFBQWEsRUFBRVUsRUFBRSxFQUFFO1FBQ3JCTCxxQkFBcUIsQ0FBQ0wsYUFBYSxDQUFDVSxFQUFFLENBQUM7TUFDekM7SUFDRixDQUFDLENBQUMsT0FBT0UsSUFBSSxFQUFFO01BQ2JsQixLQUFLLENBQUNtQixLQUFLLENBQUNqRywwQ0FBQyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDN0Q7SUFFQWdGLG9CQUFvQixDQUFDLEtBQUssQ0FBQztFQUM3QixDQUFDO0VBRUQsTUFBTWtCLG1CQUFtQixHQUFHQyxNQUFNLENBQUNDLElBQUksQ0FBQzVCLGdCQUFnQixDQUFDLENBQUM2QixNQUFNLEdBQUcsQ0FBQztFQUVwRSxNQUFNO0lBQUVsRztFQUFrQixDQUFDLEdBQUdyQixtRkFBa0IsRUFBRTtFQUNsRCxNQUFNO0lBQUV3SCxNQUFNLEVBQUVDLGFBQWE7SUFBRUMsWUFBWSxFQUFFQztFQUFxQixDQUFDLEdBQ2pFN0MsNEVBQWlCLENBQUNpQixnQkFBZ0IsQ0FBQztFQUVyQyxvQkFDRTVELEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsK0RBQUs7SUFDSjZDLEVBQUUsRUFBRTtNQUNGVyxLQUFLLEVBQUUsTUFBTTtNQUNiRCxNQUFNLEVBQUUsTUFBTTtNQUNkNEUsVUFBVSxFQUFFeEIsS0FBSyxDQUFDeUIsT0FBTyxDQUFDRCxVQUFVLENBQUNFO0lBQ3ZDO0VBQUUsR0FFRDdCLGlCQUFpQixJQUFJRSxrQkFBa0IsaUJBQ3RDaEUsS0FBQSxDQUFBQyxhQUFBLENBQUN1QyxtRUFBTyxxQkFDTnhDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbUMsNEdBQW9CO0lBQUN3RCxNQUFNLEVBQUU3RywwQ0FBQyxDQUFDLG9CQUFvQjtFQUFFLEVBQUcsQ0FFNUQsRUFDQXlHLG9CQUFvQixFQUFFLGVBQ3ZCeEYsS0FBQSxDQUFBQyxhQUFBLENBQUMzQywrREFBSztJQUNKNkMsRUFBRSxFQUFFO01BQ0YwRixhQUFhLEVBQUUsS0FBSztNQUNwQkMsY0FBYyxFQUFFLGVBQWU7TUFDL0IxRixVQUFVLEVBQUUsUUFBUTtNQUNwQjJGLEVBQUUsRUFBRSxJQUFJO01BQ1JDLEVBQUUsRUFBRSxDQUFDO01BQ0xDLEVBQUUsRUFBRSxHQUFHO01BQ1BDLEVBQUUsRUFBRTtJQUNOO0VBQUUsZ0JBRUZsRyxLQUFBLENBQUFDLGFBQUEsQ0FBQ3hDLG9FQUFVO0lBQ1Q4RCxPQUFPLEVBQUVBLENBQUEsS0FBTTJDLE9BQU8sQ0FBQ3hDLE9BQU8sQ0FBQyxPQUFPLENBQUU7SUFDeEN2QixFQUFFLEVBQUU7TUFDRmdHLE9BQU8sRUFBRSxJQUFJO01BQ2IsT0FBTyxFQUFFO1FBQ1BuRixVQUFVLEVBQUU7TUFDZCxDQUFDO01BQ0QsWUFBWSxFQUFFO1FBQ1pTLEtBQUssRUFBRXdDLEtBQUssQ0FBQ3lCLE9BQU8sQ0FBQ1UsU0FBUyxDQUFDQyxPQUFPO1FBQ3RDQyxTQUFTLEVBQUU7TUFDYjtJQUNGLENBQUU7SUFDRmhGLGFBQWE7SUFDYixlQUFZO0VBQW1CLGdCQUUvQnRCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMEIseUVBQWU7SUFBQ04sSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUNsQixlQUNickIsS0FBQSxDQUFBQyxhQUFBLENBQUNzQywwRkFBZSxPQUFHLENBQ2IsZUFDUnZDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsK0RBQUs7SUFDSjZDLEVBQUUsRUFBRTtNQUNGb0csRUFBRSxFQUFFLENBQUM7TUFDTEMsRUFBRSxFQUFFO0lBQ047RUFBRSxnQkFFRnhHLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsK0RBQUs7SUFDSjZDLEVBQUUsRUFBRTtNQUNGMEYsYUFBYSxFQUFFLEtBQUs7TUFDcEJDLGNBQWMsRUFBRSxlQUFlO01BQy9CdEYsR0FBRyxFQUFFO0lBQ1A7RUFBRSxnQkFFRlIsS0FBQSxDQUFBQyxhQUFBLENBQUM4QyxxRkFBcUI7SUFDcEIzQixPQUFPLEVBQUMsU0FBUztJQUNqQkssS0FBSyxFQUFDLGdCQUFnQjtJQUN0QixlQUFZO0VBQWtDLEdBRTdDMUMsMENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRTtJQUNuQzBILFVBQVUsRUFBRWhFLHFHQUFnQixDQUFDaUIsTUFBTSxDQUFDLEdBQ2hDUyxhQUFhLEVBQUV1QyxJQUFJLEdBQ25CM0gsMENBQUMsQ0FBQyxxQkFBcUI7RUFDN0IsQ0FBQyxDQUFDLENBQ29CLEVBQ3ZCMEQscUdBQWdCLENBQUNpQixNQUFNLENBQUMsaUJBQ3ZCMUQsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxvRUFBVTtJQUNUNkQsT0FBTyxFQUFDLFNBQVM7SUFDakJ1RixVQUFVLEVBQUUsR0FBSTtJQUNoQkMsU0FBUyxFQUFDLEtBQUs7SUFDZm5GLEtBQUssRUFBQztJQUNOO0lBQUE7SUFDQXRCLEVBQUUsRUFBRWlFLFNBQVMsR0FBRztNQUFFdkQsTUFBTSxFQUFFLEVBQUU7TUFBRVIsUUFBUSxFQUFFO0lBQVMsQ0FBQyxHQUFHO0VBQUssR0FFekQrRCxTQUFTLGdCQUNScEUsS0FBQSxDQUFBQyxhQUFBLENBQUM0Qix5RUFBZTtJQUFDUixJQUFJLEVBQUUsRUFBRztJQUFDd0YsV0FBVyxFQUFDO0VBQVksRUFBRyxHQUNwRCxPQUFPdkMsd0JBQXdCLEtBQUssUUFBUSxHQUM5Q3BGLGlCQUFpQixDQUFDb0Ysd0JBQXdCLENBQUMsR0FDekMsSUFBSSxDQUVYLENBQ0ssZUFDUnRFLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsK0RBQUs7SUFDSjZDLEVBQUUsRUFBRTtNQUNGMEYsYUFBYSxFQUFFLEtBQUs7TUFDcEJDLGNBQWMsRUFBRSxlQUFlO01BQy9CdEYsR0FBRyxFQUFFO0lBQ1A7RUFBRSxnQkFFRlIsS0FBQSxDQUFBQyxhQUFBLENBQUM4QyxxRkFBcUI7SUFDcEIzQixPQUFPLEVBQUMsSUFBSTtJQUNaMEYsUUFBUSxFQUFFLEVBQUc7SUFDYixlQUFZO0VBQW1DLEdBRTlDcEQsTUFBTSxFQUFFZ0QsSUFBSSxDQUNTLGVBQ3hCMUcsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxvRUFBVTtJQUFDNkQsT0FBTyxFQUFDLElBQUk7SUFBQzBGLFFBQVEsRUFBRTtFQUFHLEdBQ25DLE9BQU9uQyxvQkFBb0IsRUFBRW9DLEdBQUcsS0FBSyxRQUFRLEdBQzFDN0gsaUJBQWlCLENBQUN5RixvQkFBb0IsQ0FBQ29DLEdBQUcsQ0FBQyxHQUMzQyxFQUFFLENBQ0ssQ0FDUCxDQUNGLGVBQ1IvRyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLGlFQUFPO0lBQUN6QixFQUFFLEVBQUU7TUFBRTZHLFdBQVcsRUFBRSxNQUFNO01BQUVDLE9BQU8sRUFBRTtJQUFJO0VBQUUsRUFBRyxlQUN0RGpILEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsK0RBQUs7SUFDSjZDLEVBQUUsRUFBRTtNQUNGMEYsYUFBYSxFQUFFLEtBQUs7TUFDcEIvRSxLQUFLLEVBQUUsQ0FBQztNQUNSMEYsRUFBRSxFQUFFLElBQUk7TUFDUk4sRUFBRSxFQUFFLEdBQUc7TUFDUEosY0FBYyxFQUFFO0lBQ2xCO0VBQUUsZ0JBRUY5RixLQUFBLENBQUFDLGFBQUEsQ0FBQ3ZDLGdFQUFNO0lBQ0wwRCxPQUFPLEVBQUMsTUFBTTtJQUNkQyxJQUFJLEVBQUMsT0FBTztJQUNaRSxPQUFPLEVBQUVvQyxnQkFBaUI7SUFDMUIsZUFBWTtFQUF3QixHQUVuQzNFLFlBQVksR0FBR0QsMENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBR0EsMENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDbEMsQ0FDSCxlQUNSaUIsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixpRUFBTztJQUFDekIsRUFBRSxFQUFFO01BQUU2RyxXQUFXLEVBQUUvQyxLQUFLLENBQUN5QixPQUFPLENBQUN3QixJQUFJLENBQUMsR0FBRztJQUFFO0VBQUUsRUFBRyxlQUV6RGxILEtBQUEsQ0FBQUMsYUFBQSxDQUFDNkIsb0VBQVUscUJBQ1Q5QixLQUFBLENBQUFDLGFBQUEsQ0FBQzJDLCtFQUFrQjtJQUFDYSxlQUFlLEVBQUVBO0VBQWdCLEVBQUcsRUFFdkR3QixtQkFBbUIsaUJBQ2xCakYsS0FBQSxDQUFBQyxhQUFBLENBQUM0QyxpRkFBbUI7SUFBQ1EsUUFBUSxFQUFFNkIsTUFBTSxDQUFDaUMsTUFBTSxDQUFDNUQsZ0JBQWdCO0VBQUUsRUFDaEUsQ0FDVSxlQUNidkQsS0FBQSxDQUFBQyxhQUFBLENBQUMzQywrREFBSztJQUNKNEMsU0FBUyxFQUFDLEtBQUs7SUFDZkMsRUFBRSxFQUFFO01BQUVxRyxFQUFFLEVBQUUsQ0FBQztNQUFFRCxFQUFFLEVBQUUsQ0FBQztNQUFFVCxjQUFjLEVBQUUsUUFBUTtNQUFFMUYsVUFBVSxFQUFFO0lBQVM7RUFBRSxHQUVwRXBCLFlBQVksaUJBQ1hnQixLQUFBLENBQUFDLGFBQUEsQ0FBQ3ZDLGdFQUFNO0lBQ0wwSixTQUFTO0lBQ1QvRixJQUFJLEVBQUMsT0FBTztJQUNaZ0csUUFBUSxFQUFFekQsZ0JBQWdCLENBQUN3QixNQUFNLEtBQUssQ0FBRTtJQUN4QyxlQUFZLGdDQUFnQztJQUM1QzdELE9BQU8sRUFBRUEsQ0FBQSxLQUFNO01BQ2JqQyxPQUFPLENBQUMsOEJBQThCLENBQUM7TUFDdkNnRyxhQUFhLEVBQUU7SUFDakI7RUFBRSxnQkFFRnRGLEtBQUEsQ0FBQUMsYUFBQSxDQUFDOEIsbUVBQVM7SUFBQ1YsSUFBSSxFQUFFLEVBQUc7SUFBQ2xCLEVBQUUsRUFBRTtNQUFFbUgsRUFBRSxFQUFFO0lBQUU7RUFBRSxFQUFHLEVBQ3JDMUQsZ0JBQWdCLENBQUN3QixNQUFNLElBQUksQ0FBQyxHQUN6QnJHLDBDQUFDLENBQUMsZ0JBQWdCLENBQUMsR0FDbkJBLDBDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FFM0IsRUFDQSxDQUFDQyxZQUFZLGlCQUNaZ0IsS0FBQSxDQUFBQyxhQUFBLENBQUM2QyxtRkFBb0I7SUFDbkJzQixTQUFTLEVBQUVOLGlCQUFrQjtJQUM3QlcsZ0JBQWdCLEVBQUVBLGdCQUFpQjtJQUNuQzhDLGVBQWUsRUFBRTNDO0VBQW1CLEVBRXZDLENBQ0ssQ0FDRjtBQUVaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1UHFDO0FBU3RCO0FBQ2dDO0FBQ1U7QUFFVztBQUNBO0FBQ0U7QUFDVTtBQUNDO0FBQ2Y7QUFDRztBQUNGO0FBQ047QUFDRjtBQUVFO0FBSWhCO0FBQ007QUFDQztBQUNUO0FBQ29CO0FBUXhELE1BQU0yRCxXQUFXLGdCQUFHWCxpREFBVSxDQUNuQyxDQUNFO0VBQUU5SyxPQUFPO0VBQUVnSSxVQUFVO0VBQUUwRDtBQUFnQyxDQUFDLEVBQ3hEckgsR0FBaUMsS0FDOUI7RUFDSCxNQUFNO0lBQUVwQztFQUFFLENBQUMsR0FBR25CLDhEQUFjLEVBQUU7RUFDOUIsTUFBTWlHLEtBQUssR0FBR3ZCLDBFQUFjLENBQUMsa0JBQWtCLENBQUM7RUFDaEQsTUFBTTJCLEtBQUssR0FBR2pDLHdFQUFRLEVBQUU7RUFDeEIsTUFBTTtJQUNKaEQsWUFBWTtJQUNabUUsYUFBYTtJQUNic0YsZUFBZTtJQUNmQyxtQkFBbUI7SUFDbkI5RTtFQUNGLENBQUMsR0FBRzdGLHFGQUFpQixFQUFFO0VBQ3ZCLE1BQU07SUFBRTRLLGVBQWU7SUFBRXhGLGFBQWEsRUFBRXlGO0VBQWdCLENBQUMsR0FDdkQxRyxrRkFBa0IsRUFBRTtFQUN0QixNQUFNO0lBQUU1QztFQUFRLENBQUMsR0FBR3hCLG9GQUFtQixFQUFFO0VBQ3pDLE1BQU07SUFBRStLO0VBQVEsQ0FBQyxHQUFHZCxnRkFBaUIsRUFBRTtFQUV2QyxNQUFNbEosUUFBUSxHQUFHOEosZUFBZSxDQUFDN0wsT0FBTyxDQUFDK0gsRUFBRSxDQUFDO0VBQzVDLE1BQU1pRSxVQUFVLEdBQUdsRixnQkFBZ0IsQ0FBQ21GLFFBQVEsQ0FBQ2pNLE9BQU8sQ0FBQytILEVBQUUsQ0FBQztFQUV4RCxNQUFNbUUsWUFBWSxHQUNoQmxFLFVBQVUsS0FBS2tELHdGQUFtQixHQUM5QixLQUFLLEdBQ0xoSixZQUFZLElBQUkwSixtQkFBbUIsQ0FBQzVMLE9BQU8sQ0FBQztFQUNsRCxNQUFNNEIsZUFBZSxHQUFHN0IsK0ZBQXlCLENBQUNDLE9BQU8sQ0FBQztFQUMxRCxNQUFNb00sWUFBWSxHQUFHLENBQUN4SyxlQUFlLElBQUlBLGVBQWUsQ0FBQ3FJLEdBQUcsS0FBSyxJQUFJO0VBQ3JFLE1BQU1vQyxPQUFPLEdBQUdsQixpRkFBa0IsQ0FBQ1ksT0FBTyxFQUFFL0wsT0FBTyxDQUFDO0VBQ3BELE1BQU0sQ0FBQ3NNLFdBQVcsRUFBRUMsY0FBYyxDQUFDLEdBQUdsTSwrQ0FBUSxDQUFDLEtBQUssQ0FBQztFQUNyRCxNQUFNbU0sT0FBTyxHQUFHcE0sNkNBQU0sQ0FBaUIsSUFBSSxDQUFDO0VBQzVDLE1BQU1xTSxhQUFhLEdBQUdyTSw2Q0FBTSxDQUFDLElBQUksQ0FBQztFQUVsQzJLLGdEQUFTLENBQUMsTUFBTTtJQUNkLElBQUloSixRQUFRLEVBQUU7TUFDWixNQUFNMkssUUFBUSxHQUFHRCxhQUFhLENBQUM1SixPQUFPLEdBQUcsU0FBUyxHQUFHLFFBQVE7TUFDN0QySixPQUFPLEVBQUUzSixPQUFPLEVBQUU4SixjQUFjLENBQUM7UUFDL0JDLEtBQUssRUFBRSxTQUFTO1FBQ2hCRjtNQUNGLENBQUMsQ0FBQztJQUNKO0lBQ0FELGFBQWEsQ0FBQzVKLE9BQU8sR0FBRyxLQUFLO0VBQy9CLENBQUMsRUFBRSxDQUFDZCxRQUFRLENBQUMsQ0FBQztFQUVkLE1BQU04SyxNQUFNLEdBQUcxTSxrREFBVyxDQUN2QjJNLFNBQWlCLElBQUs7SUFDckIsSUFBSWQsVUFBVSxFQUFFO01BQ2RMLGVBQWUsQ0FDYm1CLFNBQVMsRUFDVHBCLGFBQWEsS0FBS0oseUZBQXlCLENBQzVDO0lBQ0gsQ0FBQyxNQUFNO01BQ0xqRixhQUFhLENBQUN5RyxTQUFTLENBQUM7SUFDMUI7RUFDRixDQUFDLEVBQ0QsQ0FBQ25CLGVBQWUsRUFBRUssVUFBVSxFQUFFM0YsYUFBYSxFQUFFcUYsYUFBYSxDQUFDLENBQzVEO0VBRUQsTUFBTXNCLGtCQUFrQixHQUFHN00sa0RBQVcsQ0FBQyxZQUFZO0lBQ2pELElBQUkrTCxZQUFZLEVBQUU7TUFDaEJXLE1BQU0sQ0FBQzdNLE9BQU8sQ0FBQytILEVBQUUsQ0FBQztJQUNwQixDQUFDLE1BQU0sSUFBSSxDQUFDN0YsWUFBWSxFQUFFO01BQ3hCLE1BQU00SixlQUFlLENBQUM5TCxPQUFPLENBQUMrSCxFQUFFLENBQUM7TUFDakNoQixLQUFLLENBQUNrRyxPQUFPLENBQ1hoTCxDQUFDLENBQUUseUNBQXdDLEVBQUU7UUFDM0NpTCxXQUFXLEVBQUVsTixPQUFPLENBQUM0SjtNQUN2QixDQUFDLENBQUMsRUFDRjtRQUFFdUQsUUFBUSxFQUFFO01BQUssQ0FBQyxDQUNuQjtNQUNELE1BQU0zSyxPQUFPLENBQUMsZ0NBQWdDLEVBQUU7UUFDOUNRLElBQUksRUFBRWhELE9BQU8sQ0FBQ2dEO01BQ2hCLENBQUMsQ0FBQztJQUNKO0VBQ0YsQ0FBQyxFQUFFLENBQ0RoRCxPQUFPLENBQUMrSCxFQUFFLEVBQ1YvSCxPQUFPLENBQUNnRCxJQUFJLEVBQ1poRCxPQUFPLENBQUM0SixJQUFJLEVBQ1prQyxlQUFlLEVBQ2Z0SixPQUFPLEVBQ1BOLFlBQVksRUFDWmdLLFlBQVksRUFDWmpLLENBQUMsRUFDRDRLLE1BQU0sRUFDTjlGLEtBQUssQ0FDTixDQUFDO0VBRUYsTUFBTXFHLGlCQUFpQixHQUFHdE4sOENBQU8sQ0FBQyxNQUFNO0lBQ3RDLElBQUlvTSxZQUFZLEVBQUU7TUFDaEIsT0FBTyxFQUFFO0lBQ1g7SUFFQSxJQUFJbEUsVUFBVSxLQUFLa0Qsd0ZBQW1CLEVBQUU7TUFDdEMsT0FBT2pKLENBQUMsQ0FBQyx1Q0FBdUMsQ0FBQztJQUNuRDtJQUVBLElBQ0UsQ0FBQ2lLLFlBQVksSUFDYmxNLE9BQU8sQ0FBQ2dELElBQUksS0FBS3VDLHlGQUFtQixJQUNwQ3ZGLE9BQU8sQ0FBQ3FOLEtBQUssS0FBSyxDQUFDLEVBQ25CO01BQ0EsT0FBT3BMLENBQUMsQ0FBQyw0Q0FBNEMsQ0FBQztJQUN4RDtJQUVBLE9BQU9BLENBQUMsQ0FDTix3RUFBd0UsQ0FDekU7RUFDSCxDQUFDLEVBQUUsQ0FBQ2pDLE9BQU8sRUFBRWtNLFlBQVksRUFBRWpLLENBQUMsRUFBRStGLFVBQVUsQ0FBQyxDQUFDO0VBRTFDLE1BQU0sQ0FBQ25HLGdCQUFnQixFQUFFeUwsbUJBQW1CLENBQUMsR0FBR2pOLCtDQUFRLENBQUMsS0FBSyxDQUFDO0VBQy9ELE1BQU07SUFBRWtOO0VBQXdCLENBQUMsR0FBRzFOLGtGQUFrQixFQUFFO0VBRXhELE1BQU0yTixVQUFVLEdBQUdyTixrREFBVyxDQUFDLFlBQVk7SUFDekNtTixtQkFBbUIsQ0FBQyxJQUFJLENBQUM7SUFDekIsTUFBTUMsdUJBQXVCLENBQUMsQ0FBQ3ZOLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDc04sbUJBQW1CLENBQUMsS0FBSyxDQUFDO0VBQzVCLENBQUMsRUFBRSxDQUFDdE4sT0FBTyxFQUFFdU4sdUJBQXVCLENBQUMsQ0FBQztFQUV0QyxNQUFNRSxXQUFXLEdBQUczTiw4Q0FBTyxDQUFDLE1BQU0sQ0FBQ0UsT0FBTyxDQUFDK0gsRUFBRSxDQUFDLEVBQUUsQ0FBQy9ILE9BQU8sQ0FBQytILEVBQUUsQ0FBQyxDQUFDO0VBQzdELE1BQU07SUFBRVEsTUFBTSxFQUFFbUYsWUFBWTtJQUFFakYsWUFBWSxFQUFFa0Y7RUFBYSxDQUFDLEdBQ3hEdEMsMEVBQWdCLENBQUNyTCxPQUFPLENBQUM7RUFDM0IsTUFBTTtJQUFFdUksTUFBTSxFQUFFcUYsWUFBWTtJQUFFbkYsWUFBWSxFQUFFb0Y7RUFBYSxDQUFDLEdBQ3hEaEksNEVBQWlCLENBQUM0SCxXQUFXLENBQUM7RUFDaEMsTUFBTUssZUFBZSxHQUFHM04sa0RBQVcsQ0FDaEM0TixFQUFFLElBQUs7SUFDTkEsRUFBRSxDQUFDbkwsZUFBZSxFQUFFO0lBQ3BCLElBQUksQ0FBQ3lKLE9BQU8sSUFBSSxDQUFDTixPQUFPLEVBQUVpQyxNQUFNLEVBQUU7TUFDaEM7SUFDRjtJQUNBLE1BQU1DLFNBQVMsR0FBR0MsNkJBQTZCLENBQUNuQyxPQUFPLENBQUNpQyxNQUFNLENBQUM7SUFFL0RHLFNBQVMsQ0FBQ0MsU0FBUyxDQUFDQyxTQUFTLENBQUNoQyxPQUFPLENBQUM7SUFDdEN0RixLQUFLLENBQUNrRyxPQUFPLENBQUMsU0FBUyxFQUFFO01BQUVFLFFBQVEsRUFBRTtJQUFLLENBQUMsQ0FBQztJQUM1QzNLLE9BQU8sQ0FBQ3lMLFNBQVMsRUFBRTtNQUNqQmpMLElBQUksRUFBRWhELE9BQU8sQ0FBQ2dEO0lBQ2hCLENBQUMsQ0FBQztFQUNKLENBQUMsRUFDRCxDQUFDcUosT0FBTyxFQUFFck0sT0FBTyxDQUFDZ0QsSUFBSSxFQUFFUixPQUFPLEVBQUV1SixPQUFPLEVBQUVpQyxNQUFNLEVBQUVqSCxLQUFLLENBQUMsQ0FDekQ7RUFFRCxvQkFDRTdELEtBQUEsQ0FBQUMsYUFBQSxDQUFBRCxLQUFBLENBQUFvTCxRQUFBLHFCQUNFcEwsS0FBQSxDQUFBQyxhQUFBLENBQUMzQywrREFBSztJQUNKK04sR0FBRyxFQUFFdk8sT0FBTyxDQUFDK0gsRUFBRztJQUNoQjFELEdBQUcsRUFBRUEsR0FBSTtJQUNUakIsU0FBUyxFQUFDLEtBQUs7SUFDZkMsRUFBRSxFQUFFO01BQ0ZXLEtBQUssRUFBRSxDQUFDO01BQ1J3SyxNQUFNLEVBQUUsU0FBUztNQUVqQnJFLE9BQU8sRUFBRWpJLFlBQVksR0FBSWdLLFlBQVksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFJLENBQUM7TUFDcERoSSxVQUFVLEVBQUVpRCxLQUFLLENBQUNzSCxXQUFXLENBQUNDLE1BQU0sQ0FBQyxTQUFTLENBQUM7TUFDL0MsUUFBUSxFQUFFO1FBQ1J2RSxPQUFPLEVBQUVqSSxZQUFZLEdBQUlnSyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBSTtNQUNyRDtJQUNGLENBQUU7SUFDRnpILE9BQU8sRUFBRXZDLFlBQVksR0FBR3VGLFNBQVMsR0FBR3VGLGtCQUFtQjtJQUN2RDJCLGNBQWMsRUFBRXpNLFlBQVksR0FBRzhLLGtCQUFrQixHQUFHdkYsU0FBVTtJQUM5RCxlQUFjLG1CQUFrQnpILE9BQU8sQ0FBQytILEVBQUcsRUFBRTtJQUM3QzZHLFlBQVksRUFBRUEsQ0FBQSxLQUFNckMsY0FBYyxDQUFDLElBQUksQ0FBRTtJQUN6Q3NDLFlBQVksRUFBRUEsQ0FBQSxLQUFNdEMsY0FBYyxDQUFDLEtBQUs7RUFBRSxnQkFFMUNySixLQUFBLENBQUFDLGFBQUEsQ0FBQ3dILGtFQUFRO0lBQUM3RyxFQUFFLEVBQUU1QixZQUFhO0lBQUM2SCxXQUFXLEVBQUM7RUFBWSxnQkFDbEQ3RyxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLCtEQUFLO0lBQ0o2QyxFQUFFLEVBQUU7TUFDRlUsTUFBTSxFQUFFLENBQUM7TUFDVCtLLEVBQUUsRUFBRSxDQUFDLENBQUM7TUFDTjFGLEVBQUUsRUFBRSxJQUFJO01BQ1I5RixVQUFVLEVBQUUsUUFBUTtNQUNwQjBGLGNBQWMsRUFBRTtJQUNsQjtFQUFFLGdCQUVGOUYsS0FBQSxDQUFBQyxhQUFBLENBQUMwSCxpRUFBTztJQUNOa0UsS0FBSyxFQUFFM0IsaUJBQWtCO0lBQ3pCL0osRUFBRSxFQUFFO01BQUVtTCxNQUFNLEVBQUV0QyxZQUFZLEdBQUcsU0FBUyxHQUFHO0lBQWM7RUFBRSxnQkFFekRoSixLQUFBLENBQUFDLGFBQUEsQ0FBQ3VILGtFQUFRO0lBQ1BsRyxhQUFhO0lBQ2IrRixRQUFRLEVBQUUsQ0FBQzJCLFlBQWE7SUFDeEI4QyxRQUFRLEVBQUVBLENBQUEsS0FBTW5DLE1BQU0sQ0FBQzdNLE9BQU8sQ0FBQytILEVBQUUsQ0FBRTtJQUNuQ2tILE9BQU8sRUFBRW5JLGdCQUFnQixDQUFDbUYsUUFBUSxDQUFDak0sT0FBTyxDQUFDK0gsRUFBRTtFQUFFLEVBQy9DLENBQ00sQ0FDSixDQUNDLGVBQ1g3RSxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLCtEQUFLO0lBQ0o2RCxHQUFHLEVBQUVtSSxPQUFRO0lBQ2JuSixFQUFFLEVBQUU7TUFDRjZMLFFBQVEsRUFBRSxDQUFDO01BQ1hsTCxLQUFLLEVBQUUsQ0FBQztNQUNSO01BQ0FtTCxRQUFRLEVBQUVqTixZQUFZLEdBQUcsbUJBQW1CLEdBQUcsTUFBTTtNQUNyRGtOLFlBQVksRUFBRSxDQUFDO01BQ2ZsTCxVQUFVLEVBQ1Isb0ZBQW9GO01BQ3RGbUwsZUFBZSxFQUFFdE4sUUFBUSxHQUFHLFVBQVUsR0FBRyxVQUFVO01BQ25ENEMsS0FBSyxFQUFFNUMsUUFBUSxHQUFHLFNBQVMsR0FBRyxjQUFjO01BQzVDLFFBQVEsRUFBRTtRQUNSc04sZUFBZSxFQUFFdE4sUUFBUSxHQUFHLFVBQVUsR0FBRyxVQUFVO1FBQ25ENEMsS0FBSyxFQUFFO01BQ1QsQ0FBQztNQUNEK0UsRUFBRSxFQUFFLElBQUk7TUFDUlQsRUFBRSxFQUFFLENBQUM7TUFDTEcsRUFBRSxFQUFFO0lBQ047RUFBRSxnQkFFRmxHLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsK0RBQUs7SUFDSjZDLEVBQUUsRUFBRTtNQUNGMEYsYUFBYSxFQUFFLEtBQUs7TUFDcEJuRixRQUFRLEVBQUUsQ0FBQztNQUNYb0YsY0FBYyxFQUFFO0lBQ2xCO0VBQUUsZ0JBRUY5RixLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLCtEQUFLO0lBQ0o2QyxFQUFFLEVBQUU7TUFDRk8sUUFBUSxFQUFFLENBQUM7TUFDWG9GLGNBQWMsRUFBRSxlQUFlO01BQy9Ca0csUUFBUSxFQUFFO0lBQ1o7RUFBRSxnQkFFRmhNLEtBQUEsQ0FBQUMsYUFBQSxDQUFDcUkscURBQWM7SUFDYjBCLFdBQVcsRUFBRWxOLE9BQU8sQ0FBQzRKLElBQUs7SUFDMUI4RCxZQUFZLEVBQUVBLFlBQWE7SUFDM0JwQixXQUFXLEVBQUVBLFdBQVk7SUFDekJ2SyxRQUFRLEVBQUVBO0VBQVMsRUFDbkIsZUFDRm1CLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsK0RBQUs7SUFDSjZDLEVBQUUsRUFBRTtNQUNGMEYsYUFBYSxFQUFFLEtBQUs7TUFDcEJyRixHQUFHLEVBQUUsQ0FBQztNQUNOSixVQUFVLEVBQUU7SUFDZDtFQUFFLEdBRUQrSSxPQUFPLGdCQUNObkosS0FBQSxDQUFBQyxhQUFBLENBQUMwSCxpRUFBTztJQUNOa0UsS0FBSyxFQUFFMUMsT0FBUTtJQUNmaUQsU0FBUyxFQUFFO01BQ1RDLE1BQU0sRUFBRTtRQUNOOUssT0FBTyxFQUFHc0osRUFBRSxJQUFLQSxFQUFFLENBQUNuTCxlQUFlO01BQ3JDO0lBQ0Y7RUFBRSxnQkFFRk0sS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxvRUFBVTtJQUNUNkQsT0FBTyxFQUFDLFNBQVM7SUFDakJLLEtBQUssRUFBRTVDLFFBQVEsR0FBRyxjQUFjLEdBQUcsZ0JBQWlCO0lBQ3BEeU4sU0FBUyxFQUFFbkQsT0FBTyxHQUFHLFFBQVEsR0FBRztFQUFTLEdBRXhDakIsMkVBQWUsQ0FBQ2lCLE9BQU8sQ0FBQyxDQUNkLENBQ0wsZ0JBRVZuSixLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG9FQUFVO0lBQ1Q2RCxPQUFPLEVBQUMsU0FBUztJQUNqQkssS0FBSyxFQUFFNUMsUUFBUSxHQUFHLGNBQWMsR0FBRyxnQkFBaUI7SUFDcER5TixTQUFTLEVBQUM7RUFBUSxHQUVqQnZOLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUV4QyxlQUNEaUIsS0FBQSxDQUFBQyxhQUFBLENBQUN0Qyw4REFBSTtJQUFDaUQsRUFBRSxFQUFFd0ksV0FBVyxJQUFJdks7RUFBUyxnQkFDaENtQixLQUFBLENBQUFDLGFBQUEsQ0FBQ3hDLG9FQUFVO0lBQ1RnRSxLQUFLLEVBQUMsU0FBUztJQUNmSixJQUFJLEVBQUMsT0FBTztJQUNabEIsRUFBRSxFQUFFO01BQUVxQixDQUFDLEVBQUU7SUFBSSxDQUFFO0lBQ2ZELE9BQU8sRUFBRXFKO0VBQWdCLGdCQUV6QjVLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDeUgsa0VBQVE7SUFBQ3JHLElBQUksRUFBRTtFQUFHLEVBQUcsQ0FDWCxDQUNSLENBQ0QsQ0FDRixlQUNSckIsS0FBQSxDQUFBQyxhQUFBLENBQUMzQywrREFBSztJQUNKNkMsRUFBRSxFQUFFO01BQ0YwRixhQUFhLEVBQUUsS0FBSztNQUNwQnpGLFVBQVUsRUFBRSxRQUFRO01BQ3BCMkYsRUFBRSxFQUFFLENBQUM7TUFDTEcsRUFBRSxFQUFFLENBQUM7TUFDTEYsRUFBRSxFQUFFLElBQUk7TUFDUnhGLEdBQUcsRUFBRTtJQUNQO0VBQUUsZ0JBRUZSLEtBQUEsQ0FBQUMsYUFBQSxDQUFDekIsNERBQWM7SUFDYkMsY0FBYyxFQUFFNkwsVUFBVztJQUMzQjVMLGVBQWUsRUFBRXdLLFlBQWE7SUFDOUJ2SyxnQkFBZ0IsRUFBRUEsZ0JBQWlCO0lBQ25DQyxXQUFXLEVBQUU5QixPQUFPLENBQUNnRCxJQUFLO0lBQzFCakIsUUFBUSxFQUFFQSxRQUFTO0lBQ25CQyxTQUFTLEVBQUVzSztFQUFZLEVBQ3ZCLGVBQ0ZwSixLQUFBLENBQUFDLGFBQUEsQ0FBQ3dILGtFQUFRO0lBQ1BaLFdBQVcsRUFBQyxZQUFZO0lBQ3hCakcsRUFBRSxFQUFFLENBQUM1QixZQUFZLElBQUlvSztFQUFZLGdCQUVqQ3BKLEtBQUEsQ0FBQUMsYUFBQSxDQUFDb0ksOERBQWU7SUFDZHZMLE9BQU8sRUFBRUEsT0FBUTtJQUNqQitCLFFBQVEsRUFBRUEsUUFBUztJQUNuQjBOLFlBQVksRUFBRTdCLFlBQWE7SUFDM0JGLFlBQVksRUFBRUEsWUFBYTtJQUMzQjVCLGVBQWUsRUFBRWtCLGtCQUFtQjtJQUNwQ2hGLFVBQVUsRUFBRUEsVUFBVztJQUN2QjBILFVBQVUsRUFBRWxEO0VBQVEsRUFDcEIsQ0FDTyxDQUNMLENBQ0YsQ0FDRixDQUNGLEVBQ1BtQixZQUFZLEVBQUUsRUFDZEUsWUFBWSxFQUFFLENBQ2Q7QUFFUCxDQUFDLENBQ0Y7QUFFRHBDLFdBQVcsQ0FBQ2tFLFdBQVcsR0FBRyxhQUFhO0FBRXZDLE1BQU16Qiw2QkFBNkIsR0FBSWxMLElBQW1CLElBQUs7RUFDN0Q7RUFDQSxNQUFNNE0sY0FBYyxHQUNsQjVNLElBQUksS0FBS2dJLDRFQUFxQixHQUMxQixLQUFLLEdBQ0xoSSxJQUFJLEtBQUtnSSx3RUFBaUIsR0FDeEIsS0FBSyxHQUNMaEksSUFBSTtFQUVaLE9BQVEsa0JBQWlCNE0sY0FBZSxlQUFjO0FBQ3hELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeFh3RDtBQVdwQjtBQUNTO0FBQ0M7QUFLb0I7QUFDSztBQVlqRSxNQUFNckUsZUFBZSxHQUFHQSxDQUFDO0VBQzlCdkwsT0FBTztFQUNQOEwsZUFBZTtFQUNmNEIsWUFBWTtFQUNaK0IsWUFBWTtFQUNaMU4sUUFBUTtFQUNSaUcsVUFBVTtFQUNWMEg7QUFDb0IsQ0FBQyxLQUFLO0VBQzFCLE1BQU07SUFBRTlEO0VBQW9CLENBQUMsR0FBRzNLLG9GQUFpQixFQUFFO0VBQ25ELE1BQU07SUFBRWdCO0VBQUUsQ0FBQyxHQUFHbkIsNkRBQWMsRUFBRTtFQUM5QixNQUFNc0csT0FBTyxHQUFHakMsNERBQVUsRUFBRTtFQUU1QixNQUFNLENBQUNtTCxNQUFNLEVBQUVDLFNBQVMsQ0FBQyxHQUFHbFEsK0NBQVEsQ0FBQyxLQUFLLENBQUM7RUFDM0MsTUFBTTtJQUFFbVEscUJBQXFCO0lBQUVDO0VBQWUsQ0FBQyxHQUFHSiwrRUFBbUIsQ0FDbkVyUSxPQUFPLEVBQ1BnSSxVQUFVLENBQ1g7RUFDRCxNQUFNMEksV0FBVyxHQUFHOUUsbUJBQW1CLENBQUM1TCxPQUFPLENBQUM7RUFFaEQsTUFBTTJRLFdBQVcsR0FBR3hRLGtEQUFXLENBQzVCd0MsQ0FBUSxJQUFLO0lBQ1pBLENBQUMsQ0FBQ0MsZUFBZSxFQUFFO0lBQ25Cd0UsT0FBTyxDQUFDd0osSUFBSSxDQUFFLGFBQVk1USxPQUFPLENBQUMrSCxFQUFHLEVBQUMsQ0FBQztFQUN6QyxDQUFDLEVBQ0QsQ0FBQ1gsT0FBTyxFQUFFcEgsT0FBTyxDQUFDK0gsRUFBRSxDQUFDLENBQ3RCO0VBRUQsb0JBQ0U3RSxLQUFBLENBQUFDLGFBQUEsQ0FBQzRNLDBFQUFpQjtJQUNoQmMsVUFBVSxFQUFDLGFBQWE7SUFDeEJDLFdBQVcsRUFBRUEsQ0FBQSxLQUFNUCxTQUFTLENBQUMsS0FBSztFQUFFLGdCQUVwQ3JOLEtBQUEsQ0FBQUMsYUFBQSxDQUFDeEMsbUVBQVU7SUFDVDBDLEVBQUUsRUFBRTtNQUFFcUIsQ0FBQyxFQUFFLENBQUM7TUFBRThGLEVBQUUsRUFBRSxDQUFDO0lBQUksQ0FBRTtJQUN2QixlQUFjLEdBQUV6SSxRQUFRLEdBQUcsUUFBUSxHQUFHLFVBQVcsb0JBQW9CO0lBQ3JFMEMsT0FBTyxFQUFHOUIsQ0FBQyxJQUFLO01BQ2RBLENBQUMsQ0FBQ0MsZUFBZSxFQUFFO01BQ25CMk4sU0FBUyxDQUFFUSxJQUFJLElBQUssQ0FBQ0EsSUFBSSxDQUFDO0lBQzVCO0VBQUUsZ0JBRUY3TixLQUFBLENBQUFDLGFBQUEsQ0FBQ2dOLHlFQUFnQjtJQUFDNUwsSUFBSSxFQUFFO0VBQUcsRUFBRyxlQUU5QnJCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDaU4sK0RBQU07SUFDTFcsSUFBSSxFQUFFVCxNQUFPO0lBQ2JVLFFBQVEsRUFBRXRCLFVBQVUsQ0FBQzdNLE9BQVE7SUFDN0JvTyxTQUFTLEVBQUMsUUFBUTtJQUNsQi9NLFVBQVU7RUFBQSxHQUVULENBQUM7SUFBRWdOO0VBQWdCLENBQUMsa0JBQ25CaE8sS0FBQSxDQUFBQyxhQUFBLENBQUN0Qyw2REFBSSxFQUFBZ0QsMEVBQUEsS0FBS3FOLGVBQWU7SUFBRTNQLE9BQU8sRUFBRTtFQUFJLGlCQUN0QzJCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDK00saUVBQVE7SUFDUDdNLEVBQUUsRUFBRTtNQUNGOE4sQ0FBQyxFQUFFLENBQUM7TUFDSnpNLENBQUMsRUFBRSxDQUFDO01BQ0pkLFFBQVEsRUFBRSxHQUFHO01BQ2JMLFFBQVEsRUFBRSxRQUFRO01BQ2xCOEwsZUFBZSxFQUFFLFVBQVU7TUFDM0IxSyxLQUFLLEVBQUUsY0FBYztNQUNyQnlNLE1BQU0sRUFBRTtJQUNWO0VBQUUsZ0JBRUZsTyxLQUFBLENBQUFDLGFBQUEsQ0FBQzhNLGlFQUFRO0lBQ1B4TCxPQUFPLEVBQUVrTSxXQUFZO0lBQ3JCLGVBQVksNkJBQTZCO0lBQ3pDdE4sRUFBRSxFQUFFO01BQUVJLFNBQVMsRUFBRTtJQUFPO0VBQUUsZ0JBRTFCUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzZNLHFFQUFZLFFBQUUvTixDQUFDLENBQUMsY0FBYyxDQUFDLENBQWdCLENBQ3ZDLEVBQ1YsQ0FBQ0YsUUFBUSxpQkFDUm1CLEtBQUEsQ0FBQUMsYUFBQSxDQUFDOE0saUVBQVE7SUFDUHhMLE9BQU8sRUFBRzlCLENBQUMsSUFBSztNQUNkQSxDQUFDLENBQUNDLGVBQWUsRUFBRTtNQUNuQmtKLGVBQWUsRUFBRTtJQUNuQixDQUFFO0lBQ0YsZUFBWSx5QkFBeUI7SUFDckN6SSxFQUFFLEVBQUU7TUFDRmdPLFNBQVMsRUFBRSxpQ0FBaUM7TUFDNUM1TixTQUFTLEVBQUU7SUFDYjtFQUFFLGdCQUVGUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzZNLHFFQUFZLFFBQUUvTixDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBZ0IsQ0FFekQsRUFDQXVPLHFCQUFxQixpQkFDcEJ0TixLQUFBLENBQUFDLGFBQUEsQ0FBQzhNLGlFQUFRO0lBQ1B4TCxPQUFPLEVBQUVnTSxjQUFlO0lBQ3hCLGVBQVksMkJBQTJCO0lBQ3ZDcE4sRUFBRSxFQUFFO01BQ0ZnTyxTQUFTLEVBQUUsaUNBQWlDO01BQzVDNU4sU0FBUyxFQUFFO0lBQ2I7RUFBRSxnQkFFRlAsS0FBQSxDQUFBQyxhQUFBLENBQUM2TSxxRUFBWSxRQUFFL04sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQWdCLENBRXZELGVBQ0RpQixLQUFBLENBQUFDLGFBQUEsQ0FBQzhNLGlFQUFRO0lBQ1B4TCxPQUFPLEVBQUVpSixZQUFhO0lBQ3RCLGVBQVksMkJBQTJCO0lBQ3ZDckssRUFBRSxFQUFFO01BQ0ZnTyxTQUFTLEVBQUUsaUNBQWlDO01BQzVDNU4sU0FBUyxFQUFFO0lBQ2I7RUFBRSxnQkFFRlAsS0FBQSxDQUFBQyxhQUFBLENBQUM2TSxxRUFBWSxRQUFFL04sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFnQixDQUNwQyxlQUNYaUIsS0FBQSxDQUFBQyxhQUFBLENBQUMwSCxnRUFBTztJQUNOeEgsRUFBRSxFQUFFO01BQUVXLEtBQUssRUFBRTtJQUFFLENBQUU7SUFDakJzTixrQkFBa0I7SUFDbEJ2QyxLQUFLLEVBQ0gyQixXQUFXLEdBQ1AsRUFBRSxHQUNGek8sQ0FBQyxDQUFDLG9EQUFvRDtFQUMzRCxnQkFFRGlCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDOE0saUVBQVE7SUFDUDFGLFFBQVEsRUFBRSxDQUFDbUcsV0FBWTtJQUN2QmpNLE9BQU8sRUFBRWdMLFlBQWE7SUFDdEIsZUFBWSx1QkFBdUI7SUFDbkNwTSxFQUFFLEVBQUU7TUFDRlcsS0FBSyxFQUFFLENBQUM7TUFDUnFOLFNBQVMsRUFBRSxpQ0FBaUM7TUFDNUM1TixTQUFTLEVBQUU7SUFDYjtFQUFFLGdCQUVGUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzZNLHFFQUFZO0lBQUMzTSxFQUFFLEVBQUU7TUFBRXNCLEtBQUssRUFBRTtJQUFhO0VBQUUsR0FDdkMxQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FDUCxDQUNOLENBQ0gsQ0FDRCxDQUVkLENBQ00sQ0FDRSxDQUNLO0FBRXhCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4SzJCO0FBQ0s7QUFDNkI7QUFHTTtBQUNtQjtBQUNrQztBQUVsRDtBQUNIO0FBQ3hCO0FBQ0Y7QUFNbkMsTUFBTThELG1CQUFtQixHQUFHQSxDQUFDO0VBQUVRO0FBQTJCLENBQUMsS0FBSztFQUNyRSxNQUFNO0lBQ0pBLFFBQVEsRUFBRTtNQUFFSztJQUFPO0VBQ3JCLENBQUMsR0FBR3hCLGtGQUFrQixFQUFFO0VBQ3hCLE1BQU0sQ0FBQ3FNLFVBQVUsRUFBRUMsYUFBYSxDQUFDLEdBQUdyUiwrQ0FBUSxDQUFDLElBQUksQ0FBQztFQUNsRCxNQUFNO0lBQUVpSCxTQUFTO0lBQUVxSyxnQkFBZ0I7SUFBRXBLO0VBQXVCLENBQUMsR0FDM0RyQixtRkFBcUIsQ0FBQ3hHLG1JQUEyQixDQUFDO0VBRXBELG9CQUNFd0QsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSztJQUFDNkMsRUFBRSxFQUFFO01BQUU2RixFQUFFLEVBQUUsSUFBSTtNQUFFbEYsS0FBSyxFQUFFO0lBQUU7RUFBRSxnQkFDaENkLEtBQUEsQ0FBQUMsYUFBQSxDQUFDcU8scURBQVk7SUFDWDVILElBQUksRUFBRTNILDBDQUFDLENBQUMsVUFBVSxDQUFFO0lBQ3BCcUYsU0FBUyxFQUFFQSxTQUFVO0lBQ3JCc0ssZUFBZSxFQUFFRCxnQkFBaUI7SUFDbEN2RixZQUFZLEVBQUU3RSxzQkFBdUI7SUFDckN4RixRQUFRLEVBQUV3UCxxR0FBaUIsQ0FBQzNLLE1BQU0sQ0FBRTtJQUNwQzZLLFVBQVUsRUFBRUEsVUFBVztJQUN2QjVFLE1BQU0sRUFBRUEsQ0FBQSxLQUFNNkUsYUFBYSxDQUFFL08sQ0FBQyxJQUFLLENBQUNBLENBQUM7RUFBRSxFQUN2QyxlQUNGTyxLQUFBLENBQUFDLGFBQUEsQ0FBQ3dILGlFQUFRO0lBQUNwSixPQUFPLEVBQUUsR0FBSTtJQUFDdUMsRUFBRSxFQUFFMk47RUFBVyxnQkFDckN2TyxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLDhEQUFLO0lBQUM2QyxFQUFFLEVBQUU7TUFBRVcsS0FBSyxFQUFFLENBQUM7TUFBRU4sR0FBRyxFQUFFLENBQUM7TUFBRStGLEVBQUUsRUFBRTtJQUFFO0VBQUUsR0FDcENsRCxRQUFRLENBQUNzTCxHQUFHLENBQUU3UixPQUFPLGlCQUNwQmtELEtBQUEsQ0FBQUMsYUFBQSxDQUFDc0kscURBQVc7SUFDVjhDLEdBQUcsRUFBRXZPLE9BQU8sQ0FBQytILEVBQUc7SUFDaEIvSCxPQUFPLEVBQUVBLE9BQVE7SUFDakIwTCxhQUFhLEVBQUVKLGdGQUFpQndHO0VBQUMsRUFFcEMsQ0FBQyxDQUNJLENBQ0MsQ0FDTDtBQUVaLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xENEQ7QUFNRztBQUVaO0FBTzdDLE1BQU1oTSxrQkFBa0IsR0FBR0EsQ0FBQztFQUNqQ2EsZUFBZTtFQUNmdEQ7QUFDZ0IsQ0FBQyxLQUFLO0VBQ3RCLE1BQU07SUFBRWdFLGFBQWEsRUFBRTJLLG1CQUFtQjtJQUFFQztFQUFRLENBQUMsR0FBR3JNLDhFQUFnQixFQUFFO0VBRTFFLG9CQUNFMUMsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSztJQUFDNkMsRUFBRSxFQUFFO01BQUVLLEdBQUcsRUFBRSxDQUFDO01BQUVNLEtBQUssRUFBRSxDQUFDO01BQUUsR0FBR1g7SUFBRztFQUFFLEdBQ3BDK0UsTUFBTSxDQUFDQyxJQUFJLENBQUMxQixlQUFlLENBQUMsQ0FBQ2tMLEdBQUcsQ0FBRWpTLFFBQVEsSUFBSztJQUM5QyxNQUFNc1MsY0FBYyxHQUFHdkwsZUFBZSxDQUFDL0csUUFBUSxDQUFDO0lBQ2hELE1BQU15SCxhQUFhLEdBQUc0SyxPQUFPLENBQUNFLElBQUksQ0FBRUMsTUFBTSxJQUFLQSxNQUFNLENBQUNySyxFQUFFLEtBQUtuSSxRQUFRLENBQUM7SUFFdEUsSUFBSSxDQUFDeUgsYUFBYSxFQUFFO01BQ2xCO0lBQ0Y7SUFFQSxNQUFNdEYsUUFBUSxHQUFHaVEsbUJBQW1CLEVBQUVqSyxFQUFFLEtBQUtuSSxRQUFRO0lBRXJELElBQUlzUyxjQUFjLElBQUlBLGNBQWMsQ0FBQzVKLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDL0Msb0JBQ0VwRixLQUFBLENBQUFDLGFBQUEsQ0FBQzRPLDZEQUFlO1FBQ2R4RCxHQUFHLEVBQUUzTyxRQUFTO1FBQ2R5SCxhQUFhLEVBQUVBLGFBQWM7UUFDN0J0RixRQUFRLEVBQUVBLFFBQVM7UUFDbkJ3RSxRQUFRLEVBQUUyTDtNQUFlLEVBQ3pCO0lBRU47RUFDRixDQUFDLENBQUMsQ0FDSTtBQUVaLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeENvQztBQUVtQztBQUNSO0FBU2hFLE1BQU01USxxQkFBcUIsR0FBRztFQUM1QkMsT0FBTyxFQUFFLEdBQUc7RUFDWkMsTUFBTSxFQUFFLGFBQWE7RUFDckJDLE1BQU0sRUFBRTtBQUNWLENBQUM7QUFFYyxTQUFTOFEsV0FBV0EsQ0FBQztFQUNsQ3JGLFdBQVc7RUFDWFosV0FBVztFQUNYdkssUUFBUTtFQUNSMkw7QUFDZ0IsQ0FBQyxFQUFFO0VBQ25CLE1BQU07SUFBRXhMO0VBQWEsQ0FBQyxHQUFHakIsb0ZBQWlCLEVBQUU7RUFFNUMsb0JBQ0VpQyxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLDhEQUFLO0lBQ0o2QyxFQUFFLEVBQUU7TUFDRjBGLGFBQWEsRUFBRSxLQUFLO01BQ3BCekYsVUFBVSxFQUFFLFFBQVE7TUFDcEJNLFFBQVEsRUFBRTtJQUNaO0VBQUUsZ0JBRUZWLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1AsNERBQUc7SUFDRmhQLEVBQUUsRUFBRTtNQUNGbVAsVUFBVSxFQUFFLENBQUM7TUFDYnhPLEtBQUssRUFBRWpDLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQztNQUN2QmdDLE1BQU0sRUFBRWhDLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQztNQUN4QjBRLFdBQVcsRUFBRTFRLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQztNQUMvQnFOLFlBQVksRUFBRSxDQUFDO01BQ2Y1TCxRQUFRLEVBQUUsVUFBVTtNQUNwQjZMLGVBQWUsRUFBRSxjQUFjO01BQy9CcUQsa0JBQWtCLEVBQUUsT0FBTztNQUMzQkMsd0JBQXdCLEVBQUUsYUFBYTtNQUN2Q0Msa0JBQWtCLEVBQUU7SUFDdEI7RUFBRSxFQUNGLGVBQ0YxUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzhDLHlFQUFxQjtJQUNwQixlQUFZLGNBQWM7SUFDMUIzQixPQUFPLEVBQUMsU0FBUztJQUNqQnVGLFVBQVUsRUFBRSxHQUFJO0lBQ2hCZ0osVUFBVSxFQUFDLE1BQU07SUFDakJ4UCxFQUFFLEVBQUU7TUFBRW1ILEVBQUUsRUFBRTtJQUFFO0VBQUUsR0FFYjBDLFdBQVcsQ0FDVSxlQUN4QmhLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDdEMsNkRBQUksRUFBQWdELDBFQUFBLEtBQUt2QyxxQkFBcUI7SUFBRXdDLEVBQUUsRUFBRXdJLFdBQVcsSUFBSSxDQUFDcEs7RUFBYSxpQkFDaEVnQixLQUFBLENBQUFDLGFBQUEsQ0FBQ3hDLG1FQUFVO0lBQ1Q0RCxJQUFJLEVBQUMsT0FBTztJQUNabEIsRUFBRSxFQUFFO01BQUVxQixDQUFDLEVBQUU7SUFBSyxDQUFFO0lBQ2hCRCxPQUFPLEVBQUc5QixDQUFDLElBQUs7TUFDZEEsQ0FBQyxDQUFDQyxlQUFlLEVBQUU7TUFDbkI4SyxZQUFZLEVBQUU7SUFDaEIsQ0FBRTtJQUNGLGVBQVk7RUFBb0IsZ0JBRWhDeEssS0FBQSxDQUFBQyxhQUFBLENBQUNtUCx3RUFBZTtJQUFDL04sSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUNsQixDQUNSLENBQ0Q7QUFFWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekRxQztBQUMwQjtBQUNoQjtBQUNEO0FBQ0Y7QUFFK0I7QUFDQztBQUNWO0FBQ1A7QUFDUjtBQUNtQjtBQVF0RSxNQUFNcVAsY0FBYyxHQUFHbFQsdUVBQU0sQ0FBQ0YsOERBQUssQ0FBRTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxDQUFDO0VBQUUyRyxLQUFLO0VBQUUwTTtBQUFZLENBQUMsS0FDdkJBLFdBQVcsR0FBRyxhQUFhLEdBQUcxTSxLQUFLLENBQUN5QixPQUFPLENBQUN3QixJQUFJLENBQUMsR0FBRyxDQUFFO0FBQzVELGlCQUFpQixDQUFDO0VBQUVqRDtBQUFNLENBQUMsS0FBS0EsS0FBSyxDQUFDMk0sT0FBTyxDQUFDLEdBQUcsQ0FBRTtBQUNuRCxvQkFBb0IsQ0FBQztFQUFFM007QUFBTSxDQUFDLEtBQUtBLEtBQUssQ0FBQzJNLE9BQU8sQ0FBQyxHQUFHLENBQUU7QUFDdEQsQ0FBQztBQUVELE1BQU1DLGNBQWMsR0FBR3JULHVFQUFNLENBQUN1UCxpRUFBUSxDQUFFO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFFRCxNQUFNK0QsVUFBVSxHQUFHdFQsdUVBQU0sQ0FBQ0YsOERBQUssQ0FBRTtBQUNqQyxtQkFBbUIsQ0FBQztFQUFFMkc7QUFBTSxDQUFDLEtBQUtBLEtBQUssQ0FBQzJNLE9BQU8sQ0FBQyxDQUFDLENBQUU7QUFDbkQsa0JBQWtCLENBQUM7RUFBRTNNO0FBQU0sQ0FBQyxLQUFLQSxLQUFLLENBQUMyTSxPQUFPLENBQUMsQ0FBQyxDQUFFO0FBQ2xELENBQUM7QUFFTSxNQUFNOU4sb0JBQW9CLEdBQUdBLENBQUM7RUFDbkNzQixTQUFTO0VBQ1RtRCxlQUFlO0VBQ2Y5QztBQUN5QixDQUFDLEtBQUs7RUFDL0IsTUFBTSxDQUFDc00sVUFBVSxFQUFFQyxhQUFhLENBQUMsR0FBRzdULCtDQUFRLENBQUMsS0FBSyxDQUFDO0VBQ25ELE1BQU0rRyxPQUFPLEdBQUdqQyw2REFBVSxFQUFFO0VBQzVCLE1BQU1nUCxlQUFlLEdBQUcvVCw2Q0FBTSxFQUFFO0VBQ2hDLE1BQU07SUFBRTZCO0VBQUUsQ0FBQyxHQUFHbkIsOERBQWMsRUFBRTtFQUM5QixNQUFNO0lBQUVzVDtFQUFhLENBQUMsR0FBR1oseUZBQXFCLEVBQUU7RUFDaEQsTUFBTTtJQUFFaFI7RUFBUSxDQUFDLEdBQUd4QixvRkFBbUIsRUFBRTtFQUN6QyxNQUFNO0lBQUUrSztFQUFRLENBQUMsR0FBR2QsZ0ZBQWlCLEVBQUU7RUFFdkMsTUFBTW9KLGdCQUFnQixHQUFHbFUsa0RBQVcsQ0FBQyxNQUFNO0lBQ3pDcUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDO0lBQ25DNEUsT0FBTyxDQUFDd0osSUFBSSxDQUFDLHFCQUFxQixDQUFDO0VBQ3JDLENBQUMsRUFBRSxDQUFDeEosT0FBTyxFQUFFNUUsT0FBTyxDQUFDLENBQUM7RUFFdEIsTUFBTThSLHVCQUF1QixHQUFHblUsa0RBQVcsQ0FBQyxNQUFNO0lBQ2hEcUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDO0lBQzFDNEUsT0FBTyxDQUFDd0osSUFBSSxDQUFDLGlDQUFpQyxDQUFDO0VBQ2pELENBQUMsRUFBRSxDQUFDeEosT0FBTyxFQUFFNUUsT0FBTyxDQUFDLENBQUM7RUFFdEIsTUFBTStSLHlCQUF5QixHQUFHcFUsa0RBQVcsQ0FBQyxNQUFNO0lBQ2xEcUMsT0FBTyxDQUFDLG1DQUFtQyxDQUFDO0lBQzVDNEUsT0FBTyxDQUFDd0osSUFBSSxDQUFDLCtCQUErQixDQUFDO0VBQy9DLENBQUMsRUFBRSxDQUFDeEosT0FBTyxFQUFFNUUsT0FBTyxDQUFDLENBQUM7RUFFdEIsTUFBTWdTLG1CQUFtQixHQUFHclUsa0RBQVcsQ0FBQyxNQUFNO0lBQzVDcUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDOztJQUV0QztJQUNBK1Esd0VBQW1CLENBQUM7TUFDbEJtQixHQUFHLEVBQUc7SUFDUixDQUFDLENBQUM7RUFDSixDQUFDLEVBQUUsQ0FBQ2xTLE9BQU8sQ0FBQyxDQUFDO0VBRWIsTUFBTW1TLHVCQUF1QixHQUFHeFUsa0RBQVcsQ0FBQyxNQUFNO0lBQ2hEcUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDO0lBQzFDNEUsT0FBTyxDQUFDd0osSUFBSSxDQUFDLDRCQUE0QixDQUFDO0VBQzVDLENBQUMsRUFBRSxDQUFDeEosT0FBTyxFQUFFNUUsT0FBTyxDQUFDLENBQUM7RUFFdEIsTUFBTW9TLGlDQUFpQyxHQUFHelUsa0RBQVcsQ0FBQyxNQUFNO0lBQzFEcUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO0lBQ3ZDNEUsT0FBTyxDQUFDd0osSUFBSSxDQUFDLHVDQUF1QyxDQUFDO0VBQ3ZELENBQUMsRUFBRSxDQUFDeEosT0FBTyxFQUFFNUUsT0FBTyxDQUFDLENBQUM7RUFFdEIsTUFBTXFTLHdCQUF3QixHQUFHL1UsOENBQU8sQ0FBQyxNQUFNO0lBQzdDLElBQ0U0VCx5RUFBaUIsRUFBRSxJQUNuQjNILE9BQU8sRUFBRStJLE9BQU8sS0FBS25CLG1GQUE0QixFQUNqRDtNQUNBLE9BQU8xUixDQUFDLENBQ04sdUVBQXVFLENBQ3hFO0lBQ0g7SUFFQSxPQUFPLEVBQUU7RUFDWCxDQUFDLEVBQUUsQ0FBQ0EsQ0FBQyxFQUFFOEosT0FBTyxDQUFDLENBQUM7RUFFaEIsb0JBQ0U3SSxLQUFBLENBQUFDLGFBQUEsQ0FBQzRNLDBFQUFpQjtJQUFDZSxXQUFXLEVBQUVBLENBQUEsS0FBTW9ELGFBQWEsQ0FBQyxLQUFLO0VBQUUsZ0JBQ3pEaFIsS0FBQSxDQUFBQyxhQUFBLENBQUNrUCw0REFBRztJQUNGaFAsRUFBRSxFQUFFO01BQ0ZXLEtBQUssRUFBRTtJQUNUO0VBQUUsZ0JBRUZkLEtBQUEsQ0FBQUMsYUFBQSxDQUFDdkMsK0RBQU07SUFDTDZELE9BQU8sRUFBRUEsQ0FBQSxLQUFNeVAsYUFBYSxDQUFFbkQsSUFBSSxJQUFLLENBQUNBLElBQUksQ0FBRTtJQUM5Q3pKLFNBQVMsRUFBRUEsU0FBVTtJQUNyQmlELFFBQVEsRUFBRWpELFNBQVU7SUFDcEIwTixPQUFPLGVBQ0w5UixLQUFBLENBQUFDLGFBQUEsQ0FBQzJQLHdFQUFlO01BQ2R6UCxFQUFFLEVBQUU7UUFDRmEsVUFBVSxFQUFFLDRCQUE0QjtRQUN4Q3NGLFNBQVMsRUFBRXlLLFVBQVUsR0FBRyxpQkFBaUIsR0FBRztNQUM5QztJQUFFLEVBRUw7SUFDRDNKLFNBQVM7SUFDVCxlQUFZLGlCQUFpQjtJQUM3Qi9GLElBQUksRUFBQyxRQUFRO0lBQ2JsQixFQUFFLEVBQUU7TUFDRjJHLFFBQVEsRUFBRTtJQUNaLENBQUU7SUFDRjNGLEdBQUcsRUFBRThQO0VBQWdCLEdBRXBCbFMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQ3BCLGVBRVRpQixLQUFBLENBQUFDLGFBQUEsQ0FBQ2lOLCtEQUFNO0lBQ0xXLElBQUksRUFBRWtELFVBQVc7SUFDakJqRCxRQUFRLEVBQUVtRCxlQUFlLENBQUN0UixPQUFRO0lBQ2xDb08sU0FBUyxFQUFDLFNBQVM7SUFDbkIvTSxVQUFVO0VBQUEsR0FFVCxDQUFDO0lBQUVnTjtFQUFnQixDQUFDLGtCQUNuQmhPLEtBQUEsQ0FBQUMsYUFBQSxDQUFDdEMsNkRBQUksRUFBQWdELDBFQUFBLEtBQUtxTixlQUFlO0lBQUUzUCxPQUFPLEVBQUU7RUFBSSxpQkFDdEMyQixLQUFBLENBQUFDLGFBQUEsQ0FBQytNLGlFQUFRO0lBQ1ArRSxLQUFLO0lBQ0w1UixFQUFFLEVBQUU7TUFDRnFCLENBQUMsRUFBRSxDQUFDO01BQ0pnRixFQUFFLEVBQUUsQ0FBQztNQUNMd0wsRUFBRSxFQUFFLENBQUM7TUFDTDNSLFFBQVEsRUFBRSxRQUFRO01BQ2xCOEwsZUFBZSxFQUFFLFVBQVU7TUFDM0JyTCxLQUFLLEVBQUUsT0FBTztNQUNkRCxNQUFNLEVBQUUsT0FBTztNQUNmb1IsU0FBUyxFQUFFO0lBQ2I7RUFBRSxnQkFFRmpTLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNFEsY0FBYztJQUNidFAsT0FBTyxFQUFFNFAsZ0JBQWlCO0lBQzFCLGVBQVk7RUFBb0IsZ0JBRWhDblIsS0FBQSxDQUFBQyxhQUFBLENBQUM2USxVQUFVLHFCQUNUOVEsS0FBQSxDQUFBQyxhQUFBLENBQUM0UCxnRUFBTztJQUFDeE8sSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUNWLGVBQ2JyQixLQUFBLENBQUFDLGFBQUEsQ0FBQ3lRLGNBQWMscUJBQ2IxUSxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLDhEQUFLLHFCQUNKMEMsS0FBQSxDQUFBQyxhQUFBLENBQUNrUCw0REFBRyxxQkFDRm5QLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMUMsbUVBQVU7SUFBQzZELE9BQU8sRUFBQyxPQUFPO0lBQUNqQixFQUFFLEVBQUU7TUFBRXdHLFVBQVUsRUFBRTtJQUFPO0VBQUUsR0FDcEQ1SCxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FDYixDQUNULGVBQ05pQixLQUFBLENBQUFDLGFBQUEsQ0FBQ2tQLDREQUFHLHFCQUNGblAsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxtRUFBVTtJQUFDNkQsT0FBTyxFQUFDO0VBQVMsR0FDMUJyQyxDQUFDLENBQUMsK0JBQStCLENBQUMsQ0FDeEIsQ0FDVCxDQUNBLGVBQ1JpQixLQUFBLENBQUFDLGFBQUEsQ0FBQzZRLFVBQVUscUJBQ1Q5USxLQUFBLENBQUFDLGFBQUEsQ0FBQ2tRLHlFQUFnQjtJQUFDOU8sSUFBSSxFQUFFLEVBQUc7SUFBQ2xCLEVBQUUsRUFBRTtNQUFFc0IsS0FBSyxFQUFFO0lBQVc7RUFBRSxFQUFHLENBQzlDLENBQ0UsQ0FDRixFQUNoQnlQLFlBQVksQ0FBQ1gsNEdBQWtDLENBQUMsaUJBQy9DdlEsS0FBQSxDQUFBQyxhQUFBLENBQUM0USxjQUFjO0lBQ2IsZUFBWSx1QkFBdUI7SUFDbkN0UCxPQUFPLEVBQUVrUTtFQUF3QixnQkFFakN6UixLQUFBLENBQUFDLGFBQUEsQ0FBQzZRLFVBQVUscUJBQ1Q5USxLQUFBLENBQUFDLGFBQUEsQ0FBQzZQLDBFQUFpQjtJQUFDek8sSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUNwQixlQUNickIsS0FBQSxDQUFBQyxhQUFBLENBQUN5USxjQUFjLHFCQUNiMVEsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSyxxQkFDSjBDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1AsNERBQUcscUJBQ0ZuUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQ1Q2RCxPQUFPLEVBQUMsT0FBTztJQUNmakIsRUFBRSxFQUFFO01BQUV3RyxVQUFVLEVBQUU7SUFBTztFQUFFLEdBRTFCNUgsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQ3ZCLENBQ1QsZUFDTmlCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1AsNERBQUcscUJBQ0ZuUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQUM2RCxPQUFPLEVBQUM7RUFBUyxHQUMxQnJDLENBQUMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUM3QixDQUNULENBQ0EsZUFDUmlCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNlEsVUFBVSxxQkFDVDlRLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1EseUVBQWdCO0lBQ2Y5TyxJQUFJLEVBQUUsRUFBRztJQUNUbEIsRUFBRSxFQUFFO01BQUVzQixLQUFLLEVBQUU7SUFBVztFQUFFLEVBQzFCLENBQ1MsQ0FDRSxDQUVwQixFQUNBeVAsWUFBWSxDQUFDWCx3R0FBOEIsQ0FBQyxpQkFDM0N2USxLQUFBLENBQUFDLGFBQUEsQ0FBQzBILGdFQUFPO0lBQ05rRSxLQUFLLEVBQUU4Rix3QkFBeUI7SUFDaEN4UixFQUFFLEVBQUU7TUFDRm1MLE1BQU0sRUFBRXFHLHdCQUF3QixHQUM1QixhQUFhLEdBQ2I7SUFDTjtFQUFFLGdCQUVGM1IsS0FBQSxDQUFBQyxhQUFBLENBQUM0USxjQUFjO0lBQ2IsZUFBWSx1QkFBdUI7SUFDbkN0UCxPQUFPLEVBQUVtUSxpQ0FBa0M7SUFDM0NySyxRQUFRLEVBQUUrSyxPQUFPLENBQUNULHdCQUF3QjtFQUFFLGdCQUU1QzNSLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNlEsVUFBVSxxQkFDVDlRLEtBQUEsQ0FBQUMsYUFBQSxDQUFDOFAsdUVBQWM7SUFBQzFPLElBQUksRUFBRTtFQUFHLEVBQUcsQ0FDakIsZUFDYnJCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDeVEsY0FBYyxxQkFDYjFRLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsOERBQUsscUJBQ0owQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ2tQLDREQUFHLHFCQUNGblAsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxtRUFBVTtJQUNUNkQsT0FBTyxFQUFDLE9BQU87SUFDZmpCLEVBQUUsRUFBRTtNQUFFd0csVUFBVSxFQUFFO0lBQU87RUFBRSxHQUUxQjVILENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUNwQixDQUNULGVBQ05pQixLQUFBLENBQUFDLGFBQUEsQ0FBQ2tQLDREQUFHLHFCQUNGblAsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxtRUFBVTtJQUFDNkQsT0FBTyxFQUFDO0VBQVMsR0FDMUJyQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FDckIsQ0FDVCxDQUNBLGVBQ1JpQixLQUFBLENBQUFDLGFBQUEsQ0FBQzZRLFVBQVUscUJBQ1Q5USxLQUFBLENBQUFDLGFBQUEsQ0FBQ2tRLHlFQUFnQjtJQUNmOU8sSUFBSSxFQUFFLEVBQUc7SUFDVGxCLEVBQUUsRUFBRTtNQUFFc0IsS0FBSyxFQUFFO0lBQVc7RUFBRSxFQUMxQixDQUNTLENBQ0UsQ0FDRixDQUVwQixFQUVBeVAsWUFBWSxDQUFDWCxpSEFBdUMsQ0FBQyxpQkFDcER2USxLQUFBLENBQUFDLGFBQUEsQ0FBQzRRLGNBQWM7SUFDYnRQLE9BQU8sRUFBRTZQLHVCQUF3QjtJQUNqQyxlQUFZO0VBQXdCLGdCQUVwQ3BSLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNlEsVUFBVSxxQkFDVDlRLEtBQUEsQ0FBQUMsYUFBQSxDQUFDK1AsaUVBQVE7SUFBQzNPLElBQUksRUFBRTtFQUFHLEVBQUcsQ0FDWCxlQUNickIsS0FBQSxDQUFBQyxhQUFBLENBQUN5USxjQUFjLHFCQUNiMVEsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSyxxQkFDSjBDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1AsNERBQUcscUJBQ0ZuUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQ1Q2RCxPQUFPLEVBQUMsT0FBTztJQUNmakIsRUFBRSxFQUFFO01BQUV3RyxVQUFVLEVBQUU7SUFBTztFQUFFLEdBRTFCNUgsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQ2pCLENBQ1QsZUFDTmlCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1AsNERBQUcscUJBQ0ZuUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQUM2RCxPQUFPLEVBQUM7RUFBUyxHQUMxQnJDLENBQUMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUM5QixDQUNULENBQ0EsZUFDUmlCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNlEsVUFBVSxxQkFDVDlRLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1EseUVBQWdCO0lBQ2Y5TyxJQUFJLEVBQUUsRUFBRztJQUNUbEIsRUFBRSxFQUFFO01BQUVzQixLQUFLLEVBQUU7SUFBVztFQUFFLEVBQzFCLENBQ1MsQ0FDRSxDQUVwQixFQUNBeVAsWUFBWSxDQUFDWCw2R0FBbUMsQ0FBQyxpQkFDaER2USxLQUFBLENBQUFDLGFBQUEsQ0FBQzRRLGNBQWM7SUFDYnRQLE9BQU8sRUFBRStQLG1CQUFvQjtJQUM3QixlQUFZO0VBQW1CLGdCQUUvQnRSLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNlEsVUFBVSxxQkFDVDlRLEtBQUEsQ0FBQUMsYUFBQSxDQUFDZ1EsbUVBQVU7SUFBQzVPLElBQUksRUFBRTtFQUFHLEVBQUcsQ0FDYixlQUNickIsS0FBQSxDQUFBQyxhQUFBLENBQUN5USxjQUFjLHFCQUNiMVEsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSyxxQkFDSjBDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1AsNERBQUcscUJBQ0ZuUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQ1Q2RCxPQUFPLEVBQUMsT0FBTztJQUNmakIsRUFBRSxFQUFFO01BQUV3RyxVQUFVLEVBQUU7SUFBTztFQUFFLEdBRTFCNUgsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQ2YsQ0FDVCxlQUNOaUIsS0FBQSxDQUFBQyxhQUFBLENBQUNrUCw0REFBRyxxQkFDRm5QLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMUMsbUVBQVU7SUFBQzZELE9BQU8sRUFBQztFQUFTLEdBQzFCckMsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQzFCLENBQ1QsQ0FDQSxlQUNSaUIsS0FBQSxDQUFBQyxhQUFBLENBQUM2USxVQUFVLHFCQUNUOVEsS0FBQSxDQUFBQyxhQUFBLENBQUNrUSx5RUFBZ0I7SUFDZjlPLElBQUksRUFBRSxFQUFHO0lBQ1RsQixFQUFFLEVBQUU7TUFBRXNCLEtBQUssRUFBRTtJQUFXO0VBQUUsRUFDMUIsQ0FDUyxDQUNFLENBRXBCLEVBQ0F5UCxZQUFZLENBQUNYLG9IQUEwQyxDQUFDLGlCQUN2RHZRLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNFEsY0FBYztJQUNidFAsT0FBTyxFQUFFOFAseUJBQTBCO0lBQ25DLGVBQVk7RUFBMEIsZ0JBRXRDclIsS0FBQSxDQUFBQyxhQUFBLENBQUM2USxVQUFVLHFCQUNUOVEsS0FBQSxDQUFBQyxhQUFBLENBQUNpUSxxRUFBWTtJQUFDN08sSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUNmLGVBQ2JyQixLQUFBLENBQUFDLGFBQUEsQ0FBQ3lRLGNBQWMscUJBQ2IxUSxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLDhEQUFLLHFCQUNKMEMsS0FBQSxDQUFBQyxhQUFBLENBQUNrUCw0REFBRyxxQkFDRm5QLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMUMsbUVBQVU7SUFDVDZELE9BQU8sRUFBQyxPQUFPO0lBQ2ZqQixFQUFFLEVBQUU7TUFBRXdHLFVBQVUsRUFBRTtJQUFPO0VBQUUsR0FFMUI1SCxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FDZixDQUNULGVBQ05pQixLQUFBLENBQUFDLGFBQUEsQ0FBQ2tQLDREQUFHLHFCQUNGblAsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxtRUFBVTtJQUFDNkQsT0FBTyxFQUFDO0VBQVMsR0FDMUJyQyxDQUFDLENBQUMsMENBQTBDLENBQUMsQ0FDbkMsQ0FDVCxDQUNBLGVBQ1JpQixLQUFBLENBQUFDLGFBQUEsQ0FBQzZRLFVBQVUscUJBQ1Q5USxLQUFBLENBQUFDLGFBQUEsQ0FBQ2tRLHlFQUFnQjtJQUNmOU8sSUFBSSxFQUFFLEVBQUc7SUFDVGxCLEVBQUUsRUFBRTtNQUFFc0IsS0FBSyxFQUFFO0lBQVc7RUFBRSxFQUMxQixDQUNTLENBQ0UsQ0FFcEIsRUFDQWdELGdCQUFnQixpQkFDZnpFLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNFEsY0FBYztJQUNidFAsT0FBTyxFQUFFQSxDQUFBLEtBQU07TUFDYmdHLGVBQWUsRUFBRTtNQUNqQnlKLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBRTtJQUNGLGVBQWE7RUFBc0IsZ0JBRW5DaFIsS0FBQSxDQUFBQyxhQUFBLENBQUM2USxVQUFVLHFCQUNUOVEsS0FBQSxDQUFBQyxhQUFBLENBQUNtUSxpRUFBUTtJQUFDL08sSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUNYLGVBQ2JyQixLQUFBLENBQUFDLGFBQUEsQ0FBQ3lRLGNBQWM7SUFBQ0MsV0FBVztFQUFBLGdCQUN6QjNRLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsOERBQUsscUJBQ0owQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ2tQLDREQUFHLHFCQUNGblAsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxtRUFBVTtJQUNUNkQsT0FBTyxFQUFDLE9BQU87SUFDZmpCLEVBQUUsRUFBRTtNQUFFd0csVUFBVSxFQUFFO0lBQU87RUFBRSxHQUUxQjVILENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUNkLENBQ1QsZUFDTmlCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1AsNERBQUcscUJBQ0ZuUCxLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQUM2RCxPQUFPLEVBQUM7RUFBUyxHQUMxQnJDLENBQUMsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUNsQyxDQUNULENBQ0EsZUFDUmlCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDNlEsVUFBVSxxQkFDVDlRLEtBQUEsQ0FBQUMsYUFBQSxDQUFDa1EseUVBQWdCO0lBQ2Y5TyxJQUFJLEVBQUUsRUFBRztJQUNUbEIsRUFBRSxFQUFFO01BQUVzQixLQUFLLEVBQUU7SUFBVztFQUFFLEVBQzFCLENBQ1MsQ0FDRSxDQUVwQixDQUNRLENBRWQsQ0FDTSxDQUNMLENBQ1k7QUFFeEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbGFnQztBQU9JO0FBQ1U7QUFFc0I7QUFHSDtBQUVLO0FBQ0g7QUFDeEI7QUFDRjtBQUVuQyxNQUFNb04sZUFBZSxHQUFHQSxDQUFDO0VBQzlCMUssYUFBYTtFQUNidEYsUUFBUTtFQUNSd0U7QUFNRixDQUFDLEtBQUs7RUFDSixNQUFNO0lBQUV0RTtFQUFFLENBQUMsR0FBR25CLDZEQUFjLEVBQUU7RUFDOUIsTUFBTTtJQUFFNlU7RUFBZ0IsQ0FBQyxHQUFHMUssZ0ZBQWlCLEVBQUU7RUFDL0MsTUFBTSxDQUFDd0csVUFBVSxFQUFFQyxhQUFhLENBQUMsR0FBR3JSLCtDQUFRLENBQUMsSUFBSSxDQUFDO0VBQ2xELE1BQU07SUFDSmlILFNBQVM7SUFDVHFLLGdCQUFnQjtJQUNoQnBLLHNCQUFzQjtJQUN0QnFPO0VBQ0YsQ0FBQyxHQUFHMVAsbUZBQXFCLENBQUNtQixhQUFhLENBQUNVLEVBQUUsQ0FBQztFQUUzQyxvQkFDRTdFLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsOERBQUs7SUFBQzZDLEVBQUUsRUFBRTtNQUFFNkYsRUFBRSxFQUFFLElBQUk7TUFBRWxGLEtBQUssRUFBRTtJQUFFO0VBQUUsZ0JBQ2hDZCxLQUFBLENBQUFDLGFBQUEsQ0FBQ3FPLHFEQUFZO0lBQ1huSyxhQUFhLEVBQUVBLGFBQWM7SUFDN0J0RixRQUFRLEVBQUVBLFFBQVM7SUFDbkIwUCxVQUFVLEVBQUVBLFVBQVc7SUFDdkJuSyxTQUFTLEVBQUVBLFNBQVU7SUFDckJzSyxlQUFlLEVBQUVELGdCQUFpQjtJQUNsQ3ZGLFlBQVksRUFBRTdFLHNCQUF1QjtJQUNyQ3NGLE1BQU0sRUFBRUEsQ0FBQSxLQUFNNkUsYUFBYSxDQUFFL08sQ0FBQyxJQUFLLENBQUNBLENBQUM7RUFBRSxFQUN2QyxlQUNGTyxLQUFBLENBQUFDLGFBQUEsQ0FBQ3dILGlFQUFRO0lBQUNwSixPQUFPLEVBQUUsR0FBSTtJQUFDdUMsRUFBRSxFQUFFMk47RUFBVyxnQkFDckN2TyxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLDhEQUFLO0lBQUM2QyxFQUFFLEVBQUU7TUFBRVcsS0FBSyxFQUFFLENBQUM7TUFBRU4sR0FBRyxFQUFFLENBQUM7TUFBRStGLEVBQUUsRUFBRTtJQUFFO0VBQUUsR0FDcENsRCxRQUFRLENBQUNzTCxHQUFHLENBQUU3UixPQUFPLGlCQUNwQmtELEtBQUEsQ0FBQUMsYUFBQSxDQUFDc0kscURBQVc7SUFDVjhDLEdBQUcsRUFBRXZPLE9BQU8sQ0FBQytILEVBQUc7SUFDaEIvSCxPQUFPLEVBQUVBLE9BQVE7SUFDakIwTCxhQUFhLEVBQ1hyRSxhQUFhLENBQUNyRSxJQUFJLEtBQUtrSSx3RkFBbUIsR0FDdENJLGlGQUFrQixHQUNsQkEsd0ZBQ0w7SUFDRHRELFVBQVUsRUFBRVgsYUFBYSxFQUFFckU7RUFBSyxFQUVuQyxDQUFDLENBQ0ksZUFDUkUsS0FBQSxDQUFBQyxhQUFBLENBQUN0Qyw2REFBSTtJQUFDaUQsRUFBRSxFQUFFL0IsUUFBUSxJQUFJNlQ7RUFBOEIsZ0JBQ2xEMVMsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSztJQUNKNkMsRUFBRSxFQUFFO01BQ0YwRixhQUFhLEVBQUUsS0FBSztNQUNwQkMsY0FBYyxFQUFFLFVBQVU7TUFDMUJTLEVBQUUsRUFBRSxDQUFDO01BQ0xxTSxFQUFFLEVBQUU7SUFDTjtFQUFFLGdCQUVGNVMsS0FBQSxDQUFBQyxhQUFBLENBQUN2QywrREFBTTtJQUNMMkQsSUFBSSxFQUFDLE9BQU87SUFDWkQsT0FBTyxFQUFDLE1BQU07SUFDZEcsT0FBTyxFQUFFQSxDQUFBLEtBQU07TUFDYnNSLE1BQU0sQ0FBQ2hGLElBQUksQ0FDUixXQUNDNEUsZUFBZSxHQUFHLE9BQU8sR0FBRyxFQUM3Qiw2QkFBNEIsRUFDN0IsUUFBUSxFQUNSLFlBQVksQ0FDYjtJQUNILENBQUU7SUFDRlgsT0FBTyxlQUFFOVIsS0FBQSxDQUFBQyxhQUFBLENBQUN1UyxxRUFBWTtFQUFJLEdBRXpCelQsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQ25CLENBQ0gsQ0FDSCxDQUNFLENBQ0w7QUFFWixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEdnQztBQVdJO0FBQ1U7QUFFc0I7QUFHRztBQUNSO0FBQ0w7QUFDUztBQUVwRSxNQUFNWCxxQkFBcUIsR0FBRztFQUM1QkMsT0FBTyxFQUFFLEdBQUc7RUFDWkMsTUFBTSxFQUFFLGFBQWE7RUFDckJDLE1BQU0sRUFBRTtBQUNWLENBQUM7QUFnQmMsU0FBUytQLFlBQVlBLENBQUM7RUFDbkNuSyxhQUFhO0VBQ2J1QyxJQUFJO0VBQ0o3SCxRQUFRO0VBQ1IwUCxVQUFVO0VBQ1ZuSyxTQUFTO0VBQ1Q4RSxZQUFZO0VBQ1pTO0FBQ2lCLENBQUMsRUFBRTtFQUNwQixNQUFNO0lBQUU1SztFQUFFLENBQUMsR0FBR25CLDZEQUFjLEVBQUU7RUFDOUIsTUFBTTtJQUFFb0I7RUFBYSxDQUFDLEdBQUdqQixvRkFBaUIsRUFBRTtFQUM1QyxNQUFNO0lBQUVtQjtFQUFrQixDQUFDLEdBQUdyQixrRkFBa0IsRUFBRTtFQUNsRCxNQUFNLENBQUNpQixTQUFTLEVBQUVtVSxZQUFZLENBQUMsR0FBRzlWLCtDQUFRLENBQUMsS0FBSyxDQUFDO0VBRWpELE1BQU07SUFBRWtJLE1BQU0sRUFBRW1GLFlBQVk7SUFBRWpGLFlBQVksRUFBRWtGO0VBQWEsQ0FBQyxHQUN4RHVJLHVFQUFlLENBQUM3TyxhQUFhLENBQUM7RUFFaEMsb0JBQ0VuRSxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLDhEQUFLO0lBQ0o2QyxFQUFFLEVBQUU7TUFDRjBGLGFBQWEsRUFBRSxLQUFLO01BQ3BCQyxjQUFjLEVBQUUsZUFBZTtNQUMvQjFGLFVBQVUsRUFBRSxRQUFRO01BQ3BCMkYsRUFBRSxFQUFFLENBQUM7TUFDTEcsRUFBRSxFQUFFLENBQUM7TUFDTE0sRUFBRSxFQUFFLENBQUM7TUFDTGhHLEdBQUcsRUFBRTtJQUNQLENBQUU7SUFDRmtMLFlBQVksRUFBRUEsQ0FBQSxLQUFNdUgsWUFBWSxDQUFDLElBQUksQ0FBRTtJQUN2Q3RILFlBQVksRUFBRUEsQ0FBQSxLQUFNc0gsWUFBWSxDQUFDLEtBQUs7RUFBRSxnQkFFeENqVCxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLDhEQUFLO0lBQ0o2QyxFQUFFLEVBQUU7TUFDRkssR0FBRyxFQUFFLENBQUM7TUFDTkosVUFBVSxFQUFFLFFBQVE7TUFDcEJ5RixhQUFhLEVBQUUsS0FBSztNQUNwQm5GLFFBQVEsRUFBRTtJQUNaO0VBQUUsR0FFRCxDQUFDeUQsYUFBYSxFQUFFckUsSUFBSSxLQUFLa0ksc0ZBQWlCLElBQ3pDN0QsYUFBYSxFQUFFckUsSUFBSSxJQUFJa0ksMEZBQXFCLGtCQUM1Q2hJLEtBQUEsQ0FBQUMsYUFBQSxDQUFDZ1EsbUVBQVU7SUFBQzVPLElBQUksRUFBRTtFQUFHLEVBQ3RCLGVBQ0RyQixLQUFBLENBQUFDLGFBQUEsQ0FBQzhDLHlFQUFxQjtJQUNwQjNCLE9BQU8sRUFBQyxJQUFJO0lBQ1owRixRQUFRLEVBQUUsRUFBRztJQUNiSCxVQUFVLEVBQUUsR0FBSTtJQUNoQmdKLFVBQVUsRUFBQyxNQUFNO0lBQ2pCLGVBQVk7RUFBYSxHQUV4QnhMLGFBQWEsRUFBRXVDLElBQUksSUFBSUEsSUFBSSxDQUNOLGVBQ3hCMUcsS0FBQSxDQUFBQyxhQUFBLENBQUN0Qyw2REFBSTtJQUFDaUQsRUFBRSxFQUFFL0IsUUFBUztJQUFDcUMsYUFBYTtFQUFBLGdCQUMvQmxCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDOFMsNkRBQUk7SUFDSDFSLElBQUksRUFBQyxPQUFPO0lBQ1psQixFQUFFLEVBQUU7TUFBRTJHLFFBQVEsRUFBRSxFQUFFO01BQUVqRyxNQUFNLEVBQUU7SUFBRyxDQUFFO0lBQ2pDWSxLQUFLLEVBQUMsU0FBUztJQUNmMlIsS0FBSyxFQUFFclUsQ0FBQyxDQUFDLFFBQVEsQ0FBRTtJQUNuQixlQUFZO0VBQW9CLEVBQ2hDLENBQ0csRUFFTm9GLGFBQWEsaUJBQ1puRSxLQUFBLENBQUFDLGFBQUEsQ0FBQ3RDLDZEQUFJLEVBQUFnRCwwRUFBQSxLQUFLdkMscUJBQXFCO0lBQUV3QyxFQUFFLEVBQUU5QixTQUFTLElBQUksQ0FBQ0U7RUFBYSxpQkFDOURnQixLQUFBLENBQUFDLGFBQUEsQ0FBQ3hDLG1FQUFVO0lBQUM0RCxJQUFJLEVBQUMsT0FBTztJQUFDRSxPQUFPLEVBQUVpSjtFQUFhLGdCQUM3Q3hLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbVAsd0VBQWU7SUFBQy9OLElBQUksRUFBRTtFQUFHLEVBQUcsQ0FDbEIsQ0FFaEIsQ0FDSyxlQUVSckIsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSztJQUFDNkMsRUFBRSxFQUFFO01BQUUwRixhQUFhLEVBQUUsS0FBSztNQUFFekYsVUFBVSxFQUFFLFFBQVE7TUFBRUksR0FBRyxFQUFFO0lBQUk7RUFBRSxnQkFDbEVSLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMUMsbUVBQVU7SUFDVDZELE9BQU8sRUFBQyxTQUFTO0lBQ2pCdUYsVUFBVSxFQUFFLEdBQUk7SUFDaEJHLFFBQVEsRUFBRSxFQUFHO0lBQ2JGLFNBQVMsRUFBQyxLQUFLO0lBQ2ZuRixLQUFLLEVBQUM7RUFBZ0IsR0FFckIyQyxTQUFTLGdCQUNScEUsS0FBQSxDQUFBQyxhQUFBLENBQUM0Qix3RUFBZTtJQUFDUixJQUFJLEVBQUUsRUFBRztJQUFDd0YsV0FBVyxFQUFDO0VBQVksRUFBRyxHQUNwRCxPQUFPcUMsWUFBWSxLQUFLLFFBQVEsR0FDbENoSyxpQkFBaUIsQ0FBQ2dLLFlBQVksQ0FBQyxHQUM3QixJQUFJLENBQ0csZUFDYmxKLEtBQUEsQ0FBQUMsYUFBQSxDQUFDeEMsbUVBQVU7SUFBQzRELElBQUksRUFBQyxPQUFPO0lBQUNFLE9BQU8sRUFBRW9JO0VBQU8sZ0JBQ3ZDM0osS0FBQSxDQUFBQyxhQUFBLENBQUM2UyxzRUFBYTtJQUNaelIsSUFBSSxFQUFFLEVBQUc7SUFDVGxCLEVBQUUsRUFBRTtNQUNGYSxVQUFVLEVBQUUsMkJBQTJCO01BQ3ZDc0YsU0FBUyxFQUFFaUksVUFBVSxHQUFHLGVBQWUsR0FBRztJQUM1QztFQUFFLEVBQ0YsQ0FDUyxDQUNQLEVBQ1BwSyxhQUFhLElBQUlzRyxZQUFZLEVBQUUsQ0FDMUI7QUFFWjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVJb0M7QUFDVztBQUVZO0FBQ0s7QUFHWjtBQUU3QyxNQUFNdUksZUFBZSxHQUFJOUQsTUFBc0IsSUFBSztFQUN6RCxNQUFNO0lBQUVuUTtFQUFFLENBQUMsR0FBR25CLDZEQUFjLEVBQUU7RUFDOUIsTUFBTTtJQUFFMFY7RUFBYSxDQUFDLEdBQUc1USw4RUFBZ0IsRUFBRTtFQUMzQyxNQUFNbUIsS0FBSyxHQUFHdkIseUVBQWMsQ0FBQyxrQkFBa0IsQ0FBQztFQUVoRCxNQUFNaVIsU0FBUyxHQUFHdFcsa0RBQVcsQ0FDM0IsTUFBTTRHLEtBQUssQ0FBQ2tHLE9BQU8sQ0FBQ2hMLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0lBQUVrTCxRQUFRLEVBQUU7RUFBSyxDQUFDLENBQUMsRUFDN0QsQ0FBQ3BHLEtBQUssRUFBRTlFLENBQUMsQ0FBQyxDQUNYO0VBQ0QsTUFBTXlVLFNBQVMsR0FBR3ZXLGtEQUFXLENBQzNCLE1BQU00RyxLQUFLLENBQUNrRyxPQUFPLENBQUNoTCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtJQUFFa0wsUUFBUSxFQUFFO0VBQUssQ0FBQyxDQUFDLEVBQzVELENBQUNwRyxLQUFLLEVBQUU5RSxDQUFDLENBQUMsQ0FDWDtFQUNELE1BQU0wVSxRQUFRLEdBQUd4VyxrREFBVyxDQUN6QnlXLE9BQWUsSUFBSztJQUNuQixJQUFJLENBQUN4RSxNQUFNLEVBQUVySyxFQUFFLEVBQUU7TUFDZmhCLEtBQUssQ0FBQ21CLEtBQUssQ0FBQ2pHLENBQUMsQ0FBQywrQkFBK0IsQ0FBQyxFQUFFO1FBQUVrTCxRQUFRLEVBQUU7TUFBSyxDQUFDLENBQUM7TUFDbkU7SUFDRjtJQUVBLE9BQU9xSixZQUFZLENBQUNwRSxNQUFNLENBQUNySyxFQUFFLEVBQUU2TyxPQUFPLENBQUNDLElBQUksRUFBRSxDQUFDO0VBQ2hELENBQUMsRUFDRCxDQUFDTCxZQUFZLEVBQUVwRSxNQUFNLEVBQUVySyxFQUFFLEVBQUU5RixDQUFDLEVBQUU4RSxLQUFLLENBQUMsQ0FDckM7RUFFRCxPQUFPd1AsaUVBQWUsQ0FBQztJQUNyQk8sV0FBVyxFQUFFMUUsTUFBTSxFQUFFeEksSUFBSSxJQUFJLEVBQUU7SUFDL0JtTixXQUFXLEVBQUU5VSxDQUFDLENBQUMsZUFBZSxDQUFDO0lBQy9CMFUsUUFBUTtJQUNSRixTQUFTO0lBQ1RDO0VBQ0YsQ0FBQyxDQUFDO0FBQ0osQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3pDK0I7QUFLaUI7QUFFMUMsTUFBTXhRLHFCQUFxQixHQUFJdEcsUUFBaUIsSUFBSztFQUMxRCxNQUFNO0lBQUVvWDtFQUFlLENBQUMsR0FBRzdRLG1HQUE0QixFQUFFO0VBRXpELE9BQU9yRyw4Q0FBTyxDQUNaLE1BQ0dGLFFBQVEsSUFBSW9YLGNBQWMsQ0FBQ3BYLFFBQVEsQ0FBQyxJQUFLO0lBQ3hDMEgsU0FBUyxFQUFFLEtBQUs7SUFDaEJxSyxnQkFBZ0IsRUFBRTtFQUNwQixDQUFDLEVBQ0gsQ0FBQ3FGLGNBQWMsRUFBRXBYLFFBQVEsQ0FBQyxDQUMzQjtBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWGM7QUFDbUI7QUFFa0M7QUFJZ0I7QUFDcEI7QUFDUTtBQUVrQjtBQVduRixNQUFNMFgseUJBQXlCLGdCQUFHTCxvREFBYSxDQUduRDtFQUNERCxjQUFjLEVBQUUsQ0FBQyxDQUFDO0VBQ2xCdFAscUJBQXFCLEVBQUVBLENBQUEsS0FBTTZQLE9BQU8sQ0FBQ0MsT0FBTztBQUM5QyxDQUFDLENBQUM7QUFFSyxNQUFNQywwQkFBMEIsR0FBR0EsQ0FBQztFQUN6Q0M7QUFDOEIsQ0FBQyxLQUFLO0VBQ3BDLE1BQU07SUFDSm5SLFFBQVEsRUFBRTtNQUFFQztJQUFTO0VBQ3ZCLENBQUMsR0FBR3BCLGtGQUFrQixFQUFFO0VBQ3hCLE1BQU07SUFBRTZNO0VBQVEsQ0FBQyxHQUFHck0sOEVBQWdCLEVBQUU7RUFDdEMsTUFBTTtJQUFFK1I7RUFBUSxDQUFDLEdBQUdQLHNGQUFvQixFQUFFO0VBRTFDLE1BQU1qUCxtQkFBbUIsR0FBR3JJLDhDQUFPLENBQ2pDLE1BQU1zSSxNQUFNLENBQUNDLElBQUksQ0FBQzdCLFFBQVEsQ0FBQyxDQUFDOEIsTUFBTSxHQUFHLENBQUMsRUFDdEMsQ0FBQzlCLFFBQVEsQ0FBQyxDQUNYO0VBRUQsTUFBTSxDQUFDd1EsY0FBYyxFQUFFWSxpQkFBaUIsQ0FBQyxHQUFHdlgsK0NBQVEsQ0FFbEQsQ0FBQyxDQUFDLENBQUM7RUFFTCxNQUFNcUgscUJBQXFCLEdBQUd2SCxrREFBVyxDQUN2QyxNQUFPUCxRQUFnQixJQUFLO0lBQzFCZ1ksaUJBQWlCLENBQUVDLFNBQVMsS0FBTTtNQUNoQyxHQUFHQSxTQUFTO01BQ1osQ0FBQ2pZLFFBQVEsR0FBRztRQUNWLEdBQUdpWSxTQUFTLENBQUNqWSxRQUFRLENBQUM7UUFDdEIrUixnQkFBZ0IsRUFBRSxLQUFLO1FBQ3ZCckssU0FBUyxFQUFFO01BQ2I7SUFDRixDQUFDLENBQUMsQ0FBQztJQUVIcVEsT0FBTyxDQUFrQztNQUN2Q0csTUFBTSxFQUFFVCxrSUFBOEM7TUFDdERXLE1BQU0sRUFBRTtRQUNOcFk7TUFDRjtJQUNGLENBQUMsQ0FBQyxDQUNDcVksSUFBSSxDQUFFQyxpQkFBaUIsSUFBSztNQUMzQk4saUJBQWlCLENBQUVDLFNBQVMsS0FBTTtRQUNoQyxHQUFHQSxTQUFTO1FBQ1osQ0FBQ2pZLFFBQVEsR0FBRztVQUNWLEdBQUdzWSxpQkFBaUI7VUFDcEJ2RyxnQkFBZ0IsRUFBRSxLQUFLO1VBQ3ZCckssU0FBUyxFQUFFO1FBQ2I7TUFDRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUNENlEsS0FBSyxDQUFFQyxHQUFHLElBQUs7TUFDZEMsT0FBTyxDQUFDQyxHQUFHLENBQUMsK0NBQStDLEVBQUVGLEdBQUcsQ0FBQztNQUNqRVIsaUJBQWlCLENBQUVDLFNBQVMsS0FBTTtRQUNoQyxHQUFHQSxTQUFTO1FBQ1osQ0FBQ2pZLFFBQVEsR0FBRztVQUNWLEdBQUdpWSxTQUFTLENBQUNqWSxRQUFRLENBQUM7VUFDdEIrUixnQkFBZ0IsRUFBRSxJQUFJO1VBQ3RCckssU0FBUyxFQUFFO1FBQ2I7TUFDRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztFQUNOLENBQUMsRUFDRCxDQUFDcVEsT0FBTyxDQUFDLENBQ1Y7RUFDRDVNLGdEQUFTLENBQUMsTUFBTTtJQUNkLElBQUl3TixTQUFTLEdBQUcsSUFBSTtJQUVwQixNQUFNQywrQkFBK0IsR0FBRyxNQUFPQyxTQUFtQixJQUFLO01BQ3JFLEtBQUssTUFBTTdZLFFBQVEsSUFBSTZZLFNBQVMsRUFBRTtRQUNoQyxNQUFNL1EscUJBQXFCLENBQUM5SCxRQUFRLENBQUM7UUFDckMsSUFBSSxDQUFDMlksU0FBUyxFQUFFO1VBQ2Q7UUFDRjtNQUNGO0lBQ0YsQ0FBQztJQUVELE1BQU1FLFNBQVMsR0FBRyxDQUNoQixHQUFHeEcsT0FBTyxDQUFDSixHQUFHLENBQUMsQ0FBQztNQUFFOUo7SUFBRyxDQUFDLEtBQUtBLEVBQUUsQ0FBQyxFQUM5QkksbUJBQW1CLEdBQUd6SSxtSUFBMkIsR0FBRytILFNBQVMsQ0FDOUQsQ0FBQ2lSLE1BQU0sQ0FBQ3ZCLDRDQUFRLENBQUM7SUFFbEJxQiwrQkFBK0IsQ0FBQ0MsU0FBUyxDQUFDO0lBRTFDLE9BQU8sTUFBTTtNQUNYRixTQUFTLEdBQUcsS0FBSztJQUNuQixDQUFDO0VBQ0gsQ0FBQyxFQUFFLENBQUN0RyxPQUFPLEVBQUU5SixtQkFBbUIsRUFBRVQscUJBQXFCLENBQUMsQ0FBQztFQUV6RCxvQkFDRXhFLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbVUseUJBQXlCLENBQUNxQixRQUFRO0lBQ2pDQyxLQUFLLEVBQUU7TUFDTDVCLGNBQWM7TUFDZHRQO0lBQ0Y7RUFBRSxHQUVEZ1EsUUFBUSxDQUMwQjtBQUV6QyxDQUFDO0FBRU0sU0FBU3ZSLDRCQUE0QkEsQ0FBQSxFQUFHO0VBQzdDLE9BQU8rUSxpREFBVSxDQUFDSSx5QkFBeUIsQ0FBQztBQUM5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RJK0M7QUFRVjtBQUN3QjtBQWN0RCxTQUFTaFMsb0JBQW9CQSxDQUFDO0VBQ25DK0csT0FBTztFQUNQeU0sTUFBTTtFQUNOQyxNQUFNO0VBQ05DLEdBQUc7RUFDSEMsU0FBUztFQUNUblEsTUFBTTtFQUNOb1EsT0FBTztFQUNQQyxnQkFBZ0I7RUFDaEJDO0FBQ3lCLENBQUMsRUFBRTtFQUM1QixNQUFNO0lBQUVuWDtFQUFFLENBQUMsR0FBR25CLDZEQUFjLEVBQUU7RUFDOUIsTUFBTXFHLEtBQUssR0FBR2pDLHVFQUFRLEVBQUU7RUFDeEIsTUFBTTZKLEtBQUssR0FBR2pHLE1BQU0sSUFBSTdHLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQztFQUVuRCxNQUFNb1gsaUJBQWlCLEdBQ3JCLE9BQU9ELGtCQUFrQixLQUFLLFFBQVEsSUFDdEMsT0FBT0QsZ0JBQWdCLEtBQUssUUFBUTtFQUV0QyxvQkFDRWpXLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsOERBQUs7SUFDSjZDLEVBQUUsRUFBRTtNQUNGVyxLQUFLLEVBQUUsT0FBTztNQUNkVixVQUFVLEVBQUUsUUFBUTtNQUNwQm9CLENBQUMsRUFBRSxDQUFDO01BQ0owSyxZQUFZLEVBQUUsQ0FBQztNQUNmekcsVUFBVSxFQUFFeEIsS0FBSyxDQUFDeUIsT0FBTyxDQUFDRCxVQUFVLENBQUNFO0lBQ3ZDO0VBQUUsZ0JBRUYzRixLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQUM2RCxPQUFPLEVBQUMsSUFBSTtJQUFDakIsRUFBRSxFQUFFO01BQUU2UixFQUFFLEVBQUU7SUFBRTtFQUFFLEdBQ3BDbkcsS0FBSyxDQUNLLGVBQ2I3TCxLQUFBLENBQUFDLGFBQUEsQ0FBQ2tQLDREQUFHO0lBQUNoUCxFQUFFLEVBQUU7TUFBRVcsS0FBSyxFQUFFO0lBQU87RUFBRSxnQkFDekJkLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsOERBQUs7SUFBQzZDLEVBQUUsRUFBRTtNQUFFVyxLQUFLLEVBQUU7SUFBTztFQUFFLEdBQzFCcUksT0FBTyxpQkFDTm5KLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsOERBQUsscUJBQ0owQyxLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQ1Q2WSxNQUFNLEVBQUMsV0FBVztJQUNsQmhWLE9BQU8sRUFBQyxPQUFPO0lBQ2ZqQixFQUFFLEVBQUU7TUFBRXNCLEtBQUssRUFBRXdDLEtBQUssQ0FBQ3lCLE9BQU8sQ0FBQzJRLElBQUksQ0FBQ2pRO0lBQVU7RUFBRSxHQUUzQ3JILENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDRyxlQUNiaUIsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxtRUFBVTtJQUFDNkQsT0FBTyxFQUFDO0VBQU8sR0FDeEI4RywyRUFBZSxDQUFDaUIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUNsQixDQUVoQixlQUNEbkosS0FBQSxDQUFBQyxhQUFBLENBQUMyQixnRUFBTztJQUFDekIsRUFBRSxFQUFFO01BQUVtVyxFQUFFLEVBQUU7SUFBRTtFQUFFLEVBQUcsRUFDekJWLE1BQU0saUJBQ0w1VixLQUFBLENBQUFDLGFBQUEsQ0FBQUQsS0FBQSxDQUFBb0wsUUFBQSxxQkFDRXBMLEtBQUEsQ0FBQUMsYUFBQSxDQUFDM0MsOERBQUsscUJBQ0owQyxLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQ1Q2RCxPQUFPLEVBQUMsT0FBTztJQUNmZ1YsTUFBTSxFQUFDLFdBQVc7SUFDbEJqVyxFQUFFLEVBQUU7TUFBRXNCLEtBQUssRUFBRXdDLEtBQUssQ0FBQ3lCLE9BQU8sQ0FBQzJRLElBQUksQ0FBQ2pRO0lBQVU7RUFBRSxHQUUzQ3JILENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDRCxlQUNiaUIsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxtRUFBVTtJQUFDNkQsT0FBTyxFQUFDO0VBQU8sR0FDeEJ3VSxNQUFNLEVBQUMsR0FBQyxFQUFDQyxNQUFNLENBQ0wsQ0FDUCxlQUNSN1YsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixnRUFBTztJQUFDekIsRUFBRSxFQUFFO01BQUVtVyxFQUFFLEVBQUU7SUFBRTtFQUFFLEVBQUcsQ0FFN0IsRUFDQVIsR0FBRyxpQkFDRjlWLEtBQUEsQ0FBQUMsYUFBQSxDQUFBRCxLQUFBLENBQUFvTCxRQUFBLHFCQUNFcEwsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSyxxQkFDSjBDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMUMsbUVBQVU7SUFDVDZELE9BQU8sRUFBQyxPQUFPO0lBQ2ZnVixNQUFNLEVBQUMsV0FBVztJQUNsQmpXLEVBQUUsRUFBRTtNQUFFc0IsS0FBSyxFQUFFd0MsS0FBSyxDQUFDeUIsT0FBTyxDQUFDMlEsSUFBSSxDQUFDalE7SUFBVTtFQUFFLEdBRTNDckgsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNFLGVBQ2JpQixLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQUM2RCxPQUFPLEVBQUM7RUFBTyxHQUN4QjBVLEdBQUcsRUFBQyxHQUFDLEVBQUNDLFNBQVMsQ0FDTCxDQUNQLGVBQ1IvVixLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLGdFQUFPO0lBQUN6QixFQUFFLEVBQUU7TUFBRW1XLEVBQUUsRUFBRTtJQUFFO0VBQUUsRUFBRyxDQUU3QixFQUNBTixPQUFPLGlCQUNOaFcsS0FBQSxDQUFBQyxhQUFBLENBQUFELEtBQUEsQ0FBQW9MLFFBQUEscUJBQ0VwTCxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLDhEQUFLLHFCQUNKMEMsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxtRUFBVTtJQUFDNkQsT0FBTyxFQUFDLE9BQU87SUFBQ2dWLE1BQU0sRUFBQztFQUFXLEdBQzNDclgsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUNOLGVBQ2JpQixLQUFBLENBQUFDLGFBQUEsQ0FBQzFDLG1FQUFVO0lBQUM2RCxPQUFPLEVBQUM7RUFBTyxHQUFFNFUsT0FBTyxDQUFjLENBQzVDLGVBQ1JoVyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLGdFQUFPO0lBQUN6QixFQUFFLEVBQUU7TUFBRW1XLEVBQUUsRUFBRTtJQUFFO0VBQUUsRUFBRyxDQUU3QixFQUNBSCxpQkFBaUIsaUJBQ2hCblcsS0FBQSxDQUFBQyxhQUFBLENBQUFELEtBQUEsQ0FBQW9MLFFBQUEscUJBQ0VwTCxLQUFBLENBQUFDLGFBQUEsQ0FBQzNDLDhEQUFLLHFCQUNKMEMsS0FBQSxDQUFBQyxhQUFBLENBQUMxQyxtRUFBVTtJQUFDNkQsT0FBTyxFQUFDLE9BQU87SUFBQ2dWLE1BQU0sRUFBQztFQUFXLEdBQzNDclgsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQ1osZUFDYmlCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMUMsbUVBQVU7SUFBQzZELE9BQU8sRUFBQztFQUFPLEdBQ3hCckMsQ0FBQyxDQUFDLDhCQUE4QixFQUFFO0lBQ2pDWSxPQUFPLEVBQUVzVyxnQkFBZ0I7SUFDekJNLEtBQUssRUFBRUw7RUFDVCxDQUFDLENBQUMsQ0FDUyxDQUNQLGVBQ1JsVyxLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLGdFQUFPO0lBQUN6QixFQUFFLEVBQUU7TUFBRW1XLEVBQUUsRUFBRTtJQUFFO0VBQUUsRUFBRyxDQUU3QixlQUNEdFcsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSyxxQkFDSjBDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMUMsbUVBQVU7SUFBQzZELE9BQU8sRUFBQyxPQUFPO0lBQUNnVixNQUFNLEVBQUM7RUFBVyxHQUMzQ3JYLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDRCxlQUNiaUIsS0FBQSxDQUFBQyxhQUFBLENBQUMzQyw4REFBSztJQUFDNkMsRUFBRSxFQUFFO01BQUV5UyxFQUFFLEVBQUUsQ0FBQztNQUFFL00sYUFBYSxFQUFFLEtBQUs7TUFBRXJGLEdBQUcsRUFBRTtJQUFFO0VBQUUsZ0JBQ2pEUixLQUFBLENBQUFDLGFBQUEsQ0FBQzBWLHlFQUFnQjtJQUFDdFUsSUFBSSxFQUFFO0VBQUcsRUFBRyxDQUN4QixDQUNGLENBQ0YsQ0FDSixDQUNBO0FBRVoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvaGFuZGxlcnMvZ2V0VG90YWxCYWxhbmNlRm9yV2FsbGV0L21vZGVscy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUJhbGFuY2VUb3RhbEluQ3VycmVuY3kudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9BY2NvdW50QmFsYW5jZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9BY2NvdW50cy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9jb21wb25lbnRzL0FjY291bnRJdGVtLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2NvbXBvbmVudHMvQWNjb3VudEl0ZW1NZW51LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2NvbXBvbmVudHMvQWNjb3VudExpc3RJbXBvcnRlZC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9jb21wb25lbnRzL0FjY291bnRMaXN0UHJpbWFyeS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9jb21wb25lbnRzL0FjY291bnROYW1lLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2NvbXBvbmVudHMvQWNjb3VudHNBY3Rpb25CdXR0b24udHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQWNjb3VudHMvY29tcG9uZW50cy9XYWxsZXRDb250YWluZXIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQWNjb3VudHMvY29tcG9uZW50cy9XYWxsZXRIZWFkZXIudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQWNjb3VudHMvaG9va3MvdXNlV2FsbGV0UmVuYW1lLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2hvb2tzL3VzZVdhbGxldFRvdGFsQmFsYW5jZS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL3Byb3ZpZGVycy9XYWxsZXRUb3RhbEJhbGFuY2VQcm92aWRlci50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9MZWRnZXJBcHByb3ZhbERpYWxvZy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhaW5BZGRyZXNzQ2hhaW5JZE1hcExpc3RSZXNwb25zZSB9IGZyb20gJ0BhdmFsYWJzL2dsYWNpZXItc2RrJztcblxuZXhwb3J0IHR5cGUgR2V0VG90YWxCYWxhbmNlRm9yV2FsbGV0UGFyYW1zID0ge1xuICB3YWxsZXRJZDogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgVG90YWxCYWxhbmNlRm9yV2FsbGV0ID0ge1xuICB0b3RhbEJhbGFuY2VJbkN1cnJlbmN5PzogbnVtYmVyO1xuICBoYXNCYWxhbmNlT25VbmRlcml2ZWRBY2NvdW50czogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIEFkZHJlc3NBY3Rpdml0eUZldGNoZXIgPSAoXG4gIGFkZHJlc3Nlczogc3RyaW5nW10sXG4pID0+IFByb21pc2U8Q2hhaW5BZGRyZXNzQ2hhaW5JZE1hcExpc3RSZXNwb25zZT47XG5cbmV4cG9ydCBjb25zdCBJVEVSQVRJT05fTElNSVQgPSAxMDsgLy8gQWJpdHJhcnkgbnVtYmVyIHRvIGF2b2lkIGFuIGluZmluaXRlIGxvb3AuXG5leHBvcnQgY29uc3QgQUREUkVTU19HQVBfTElNSVQgPSAyMDtcbmV4cG9ydCBjb25zdCBHTEFDSUVSX0FERFJFU1NfRkVUQ0hfTElNSVQgPSA2NDsgLy8gUmVxdWVzdGVkIGFkZHJlc3NlcyBhcmUgZW5jb2RlZCBhcyBxdWVyeSBwYXJhbXMsIGFuZCBHbGFjaWVyIGVuZm9yY2VzIFVSSSBsZW5ndGggbGltaXRzXG5leHBvcnQgY29uc3QgSU1QT1JURURfQUNDT1VOVFNfV0FMTEVUX0lEID0gJ19fSU1QT1JURURfXyc7XG5cbmV4cG9ydCBjb25zdCBpc0ltcG9ydGVkQWNjb3VudHNSZXF1ZXN0ID0gKHdhbGxldElkOiBzdHJpbmcpID0+XG4gIHdhbGxldElkID09PSBJTVBPUlRFRF9BQ0NPVU5UU19XQUxMRVRfSUQ7XG4iLCJpbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VCYWxhbmNlc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JhbGFuY2VzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUJhbGFuY2VUb3RhbEluQ3VycmVuY3koYWNjb3VudD86IEFjY291bnQpIHtcbiAgY29uc3QgeyBnZXRUb3RhbEJhbGFuY2UgfSA9IHVzZUJhbGFuY2VzQ29udGV4dCgpO1xuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWFjY291bnQ/LmFkZHJlc3NDKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0VG90YWxCYWxhbmNlKGFjY291bnQuYWRkcmVzc0MpO1xuICB9LCBbYWNjb3VudD8uYWRkcmVzc0MsIGdldFRvdGFsQmFsYW5jZV0pO1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBSZWZyZXNoSWNvbixcbiAgU2tlbGV0b24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICBzdHlsZWQsXG4gIEljb25CdXR0b24sXG4gIEJ1dHRvbixcbiAgR3Jvdyxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7IHVzZVNldHRpbmdzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvU2V0dGluZ3NQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyBBY2NvdW50VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQWNjb3VudE1hbmFnZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9BY2NvdW50TWFuYWdlclByb3ZpZGVyJztcblxuaW50ZXJmYWNlIEFjY291bnRCYWxhbmNlUHJvcHMge1xuICByZWZyZXNoQmFsYW5jZTogKCkgPT4gdm9pZDtcbiAgYmFsYW5jZVRvdGFsVVNEOiBudW1iZXIgfCBudWxsO1xuICBpc0JhbGFuY2VMb2FkaW5nOiBib29sZWFuO1xuICBhY2NvdW50VHlwZTogQWNjb3VudFR5cGU7XG4gIGlzQWN0aXZlOiBib29sZWFuO1xuICBpc0hvdmVyZWQ6IGJvb2xlYW47XG59XG5cbmNvbnN0IEFuaW1hdGVkUmVmcmVzaEljb24gPSBzdHlsZWQoUmVmcmVzaEljb24sIHtcbiAgc2hvdWxkRm9yd2FyZFByb3A6IChwcm9wKSA9PiBwcm9wICE9PSAnaXNTcGlubmluZycsXG59KTx7IGlzU3Bpbm5pbmc6IGJvb2xlYW4gfT5gXG4gIEBrZXlmcmFtZXMgc3BpbiB7XG4gICAgMCUge1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gICAgfVxuICAgIDc1JSB7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICAgIH1cbiAgICAxMDAlIHtcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gICAgfVxuICB9XG5cbiAgYW5pbWF0aW9uOiAkeyh7IGlzU3Bpbm5pbmcgfSkgPT5cbiAgICBpc1NwaW5uaW5nID8gJzEuNXMgZWFzZS1pbi1vdXQgc3BpbiBpbmZpbml0ZScgOiAnbm9uZSd9O1xuYDtcblxuY29uc3QgY29tbW9uVHJhbnNpdGlvblByb3BzID0ge1xuICB0aW1lb3V0OiAyMDAsXG4gIGVhc2luZzogJ2Vhc2UtaW4tb3V0JyxcbiAgYXBwZWFyOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBBY2NvdW50QmFsYW5jZSh7XG4gIHJlZnJlc2hCYWxhbmNlLFxuICBiYWxhbmNlVG90YWxVU0QsXG4gIGlzQmFsYW5jZUxvYWRpbmcsXG4gIGFjY291bnRUeXBlLFxuICBpc0FjdGl2ZSxcbiAgaXNIb3ZlcmVkLFxufTogQWNjb3VudEJhbGFuY2VQcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgaXNNYW5hZ2VNb2RlIH0gPSB1c2VBY2NvdW50TWFuYWdlcigpO1xuICBjb25zdCB7IGN1cnJlbmN5LCBjdXJyZW5jeUZvcm1hdHRlciB9ID0gdXNlU2V0dGluZ3NDb250ZXh0KCk7XG4gIGNvbnN0IFtza2VsZXRvbldpZHRoLCBzZXRTa2VsZXRvbldpZHRoXSA9IHVzZVN0YXRlKDMwKTtcbiAgY29uc3QgYmFsYW5jZVRleHRSZWYgPSB1c2VSZWY8SFRNTFNwYW5FbGVtZW50PigpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcblxuICBjb25zdCBoYXNCYWxhbmNlID0gYmFsYW5jZVRvdGFsVVNEICE9PSBudWxsO1xuXG4gIGNvbnN0IGhhbmRsZUNsaWNrID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKGU6IFJlYWN0Lk1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIC8vIE1hdGNoIHRoZSBza2VsZXRvbiB3aWR0aCB0byB0aGUgb2xkIGJhbGFuY2UncyB3aWR0aCAob3IgdGhlIFwiVmlldyBCYWxhbmNlXCIgYnV0dG9uKVxuICAgICAgaWYgKGJhbGFuY2VUZXh0UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgc2V0U2tlbGV0b25XaWR0aChiYWxhbmNlVGV4dFJlZi5jdXJyZW50Py5vZmZzZXRXaWR0aCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHJlZnJlc2hCYWxhbmNlKCk7XG5cbiAgICAgIC8vIE1hdGNoIHRoZSBza2VsZXRvbiB3aWR0aCB0byB0aGUgZnJlc2ggYmFsYW5jZSdzIHdpZHRoLlxuICAgICAgaWYgKGJhbGFuY2VUZXh0UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgc2V0U2tlbGV0b25XaWR0aChiYWxhbmNlVGV4dFJlZi5jdXJyZW50Py5vZmZzZXRXaWR0aCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbcmVmcmVzaEJhbGFuY2VdLFxuICApO1xuXG4gIGNvbnN0IG9uUmVmcmVzaENsaWNrZWQgPSB1c2VDYWxsYmFjayhcbiAgICAoZTogUmVhY3QuTW91c2VFdmVudCkgPT4ge1xuICAgICAgaGFuZGxlQ2xpY2soZSk7XG4gICAgICBjYXB0dXJlKCdBY2NvdW50U2VsZWN0b3JSZWZyZXNoQmFsYW5jZUNsaWNrZWQnLCB7XG4gICAgICAgIHR5cGU6IGFjY291bnRUeXBlLFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBbaGFuZGxlQ2xpY2ssIGNhcHR1cmUsIGFjY291bnRUeXBlXSxcbiAgKTtcblxuICBjb25zdCBvblZpZXdCYWxhbmNlQ2xpY2tlZCA9IHVzZUNhbGxiYWNrKFxuICAgIChlOiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICBoYW5kbGVDbGljayhlKTtcbiAgICAgIGNhcHR1cmUoJ0FjY291bnRTZWxlY3RvclZpZXdCYWxhbmNlQ2xpY2tlZCcsIHtcbiAgICAgICAgdHlwZTogYWNjb3VudFR5cGUsXG4gICAgICB9KTtcbiAgICB9LFxuICAgIFtoYW5kbGVDbGljaywgY2FwdHVyZSwgYWNjb3VudFR5cGVdLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgc3g9e3tcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIG1pbkhlaWdodDogJzE2cHgnLFxuICAgICAgICBnYXA6IDAuNCxcbiAgICAgIH19XG4gICAgICBzdHlsZT17eyBtaW5XaWR0aDogc2tlbGV0b25XaWR0aCB9fVxuICAgID5cbiAgICAgIDxHcm93IHsuLi5jb21tb25UcmFuc2l0aW9uUHJvcHN9IGluPXtpc0JhbGFuY2VMb2FkaW5nfT5cbiAgICAgICAgPFNrZWxldG9uXG4gICAgICAgICAgaGVpZ2h0PXsxNn1cbiAgICAgICAgICB3aWR0aD17aXNCYWxhbmNlTG9hZGluZyA/IHNrZWxldG9uV2lkdGggOiAwfVxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCBlYXNlLWluLW91dCAwLjJzJyxcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgPC9Hcm93PlxuICAgICAgPEdyb3dcbiAgICAgICAgey4uLmNvbW1vblRyYW5zaXRpb25Qcm9wc31cbiAgICAgICAgaW49eyFoYXNCYWxhbmNlICYmICFpc0JhbGFuY2VMb2FkaW5nfVxuICAgICAgICBtb3VudE9uRW50ZXJcbiAgICAgICAgdW5tb3VudE9uRXhpdFxuICAgICAgPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgcmVmPXtiYWxhbmNlVGV4dFJlZn1cbiAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ2aWV3LWJhbGFuY2UtYnV0dG9uXCJcbiAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgIGRpc2FibGVSaXBwbGVcbiAgICAgICAgICBvbkNsaWNrPXtvblZpZXdCYWxhbmNlQ2xpY2tlZH1cbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdWaWV3IEJhbGFuY2UnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L0dyb3c+XG5cbiAgICAgIDxHcm93XG4gICAgICAgIHsuLi5jb21tb25UcmFuc2l0aW9uUHJvcHN9XG4gICAgICAgIGluPXtoYXNCYWxhbmNlICYmIGlzSG92ZXJlZCAmJiAhaXNCYWxhbmNlTG9hZGluZyAmJiAhaXNNYW5hZ2VNb2RlfVxuICAgICAgICBtb3VudE9uRW50ZXJcbiAgICAgICAgdW5tb3VudE9uRXhpdFxuICAgICAgPlxuICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgb25DbGljaz17b25SZWZyZXNoQ2xpY2tlZH1cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImFjY291bnQtYmFsYW5jZS1yZWZyZXNoXCJcbiAgICAgICAgICBzeD17eyBwOiAwLjI1IH19XG4gICAgICAgID5cbiAgICAgICAgICA8QW5pbWF0ZWRSZWZyZXNoSWNvbiBzaXplPXsxNn0gaXNTcGlubmluZz17aXNCYWxhbmNlTG9hZGluZ30gLz5cbiAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgPC9Hcm93PlxuXG4gICAgICA8R3Jvd1xuICAgICAgICB7Li4uY29tbW9uVHJhbnNpdGlvblByb3BzfVxuICAgICAgICBpbj17aGFzQmFsYW5jZSAmJiAhaXNCYWxhbmNlTG9hZGluZ31cbiAgICAgICAgbW91bnRPbkVudGVyXG4gICAgICAgIHVubW91bnRPbkV4aXRcbiAgICAgID5cbiAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICByZWY9e2JhbGFuY2VUZXh0UmVmfVxuICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MVwiXG4gICAgICAgICAgY29sb3I9e2lzQWN0aXZlID8gJ3RleHQucHJpbWFyeScgOiAndGV4dC5zZWNvbmRhcnknfVxuICAgICAgICA+XG4gICAgICAgICAge2N1cnJlbmN5Rm9ybWF0dGVyKGJhbGFuY2VUb3RhbFVTRCA/PyAwKS5yZXBsYWNlKGN1cnJlbmN5LCAnJyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvR3Jvdz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIENoZXZyb25MZWZ0SWNvbixcbiAgRGl2aWRlcixcbiAgSWNvbkJ1dHRvbixcbiAgTG9hZGluZ0RvdHNJY29uLFxuICBTY3JvbGxiYXJzLFxuICBTdGFjayxcbiAgVHJhc2hJY29uLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHQgfSBmcm9tICdpMThuZXh0JztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcblxuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUxlZGdlckNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0xlZGdlclByb3ZpZGVyJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IExlZGdlckFwcHJvdmFsRGlhbG9nIH0gZnJvbSAnQHNyYy9wYWdlcy9TaWduVHJhbnNhY3Rpb24vY29tcG9uZW50cy9MZWRnZXJBcHByb3ZhbERpYWxvZyc7XG5cbmltcG9ydCB7IEFjY291bnRUeXBlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VTY29wZWRUb2FzdCB9IGZyb20gJ0BzcmMvaG9va3MvdXNlU2NvcGVkVG9hc3QnO1xuaW1wb3J0IHsgTmV0d29ya1N3aXRjaGVyIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9oZWFkZXIvTmV0d29ya1N3aXRjaGVyJztcbmltcG9ydCB7IE92ZXJsYXkgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL092ZXJsYXknO1xuaW1wb3J0IHsgaXNQcmltYXJ5QWNjb3VudCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy91dGlscy90eXBlR3VhcmRzJztcbmltcG9ydCB7IHVzZVdhbGxldENvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1dhbGxldFByb3ZpZGVyJztcbmltcG9ydCB7IHVzZUJhbGFuY2VzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQmFsYW5jZXNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuXG5pbXBvcnQgeyB1c2VBY2NvdW50TWFuYWdlciB9IGZyb20gJy4vcHJvdmlkZXJzL0FjY291bnRNYW5hZ2VyUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQWNjb3VudFJlbW92YWwgfSBmcm9tICcuL2hvb2tzL3VzZUFjY291bnRSZW1vdmFsJztcbmltcG9ydCB7IEFjY291bnRMaXN0UHJpbWFyeSB9IGZyb20gJy4vY29tcG9uZW50cy9BY2NvdW50TGlzdFByaW1hcnknO1xuaW1wb3J0IHsgQWNjb3VudExpc3RJbXBvcnRlZCB9IGZyb20gJy4vY29tcG9uZW50cy9BY2NvdW50TGlzdEltcG9ydGVkJztcbmltcG9ydCB7IEFjY291bnRzQWN0aW9uQnV0dG9uIH0gZnJvbSAnLi9jb21wb25lbnRzL0FjY291bnRzQWN0aW9uQnV0dG9uJztcbmltcG9ydCB7IE92ZXJmbG93aW5nVHlwb2dyYXBoeSB9IGZyb20gJy4vY29tcG9uZW50cy9PdmVyZmxvd2luZ1R5cG9ncmFwaHknO1xuaW1wb3J0IHsgdXNlV2FsbGV0VG90YWxCYWxhbmNlIH0gZnJvbSAnLi9ob29rcy91c2VXYWxsZXRUb3RhbEJhbGFuY2UnO1xuaW1wb3J0IHsgdXNlV2FsbGV0VG90YWxCYWxhbmNlQ29udGV4dCB9IGZyb20gJy4vcHJvdmlkZXJzL1dhbGxldFRvdGFsQmFsYW5jZVByb3ZpZGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFjY291bnRzKCkge1xuICBjb25zdCB7XG4gICAgc2VsZWN0QWNjb3VudCxcbiAgICBhZGRBY2NvdW50LFxuICAgIGFjY291bnRzOiB7IGltcG9ydGVkOiBpbXBvcnRlZEFjY291bnRzLCBwcmltYXJ5OiBwcmltYXJ5QWNjb3VudHMsIGFjdGl2ZSB9LFxuICB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG4gIGNvbnN0IHsgaXNNYW5hZ2VNb2RlLCB0b2dnbGVNYW5hZ2VNb2RlLCBzZWxlY3RlZEFjY291bnRzIH0gPVxuICAgIHVzZUFjY291bnRNYW5hZ2VyKCk7XG5cbiAgY29uc3QgdG9hc3QgPSB1c2VTY29wZWRUb2FzdCgnYWNjb3VudC1zd2l0Y2hlcicpO1xuXG4gIGNvbnN0IFthZGRBY2NvdW50TG9hZGluZywgc2V0QWRkQWNjb3VudExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCB7IGhhc0xlZGdlclRyYW5zcG9ydCB9ID0gdXNlTGVkZ2VyQ29udGV4dCgpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7IHdhbGxldERldGFpbHMgfSA9IHVzZVdhbGxldENvbnRleHQoKTtcbiAgY29uc3QgeyBpc0xvYWRpbmcsIHRvdGFsQmFsYW5jZUluQ3VycmVuY3k6IGFjdGl2ZVdhbGxldFRvdGFsQmFsYW5jZSB9ID1cbiAgICB1c2VXYWxsZXRUb3RhbEJhbGFuY2UoXG4gICAgICBpc1ByaW1hcnlBY2NvdW50KGFjdGl2ZSkgPyBhY3RpdmUud2FsbGV0SWQgOiB1bmRlZmluZWQsXG4gICAgKTtcbiAgY29uc3QgeyBmZXRjaEJhbGFuY2VGb3JXYWxsZXQgfSA9IHVzZVdhbGxldFRvdGFsQmFsYW5jZUNvbnRleHQoKTtcblxuICBjb25zdCBjYW5DcmVhdGVBY2NvdW50ID0gYWN0aXZlPy50eXBlID09PSBBY2NvdW50VHlwZS5QUklNQVJZO1xuICBjb25zdCB7IGdldFRvdGFsQmFsYW5jZSB9ID0gdXNlQmFsYW5jZXNDb250ZXh0KCk7XG5cbiAgY29uc3QgYWN0aXZlQWNjb3VudEJhbGFuY2UgPSB1c2VNZW1vKFxuICAgICgpID0+IChhY3RpdmU/LmFkZHJlc3NDID8gZ2V0VG90YWxCYWxhbmNlKGFjdGl2ZS5hZGRyZXNzQykgOiBudWxsKSxcbiAgICBbYWN0aXZlPy5hZGRyZXNzQywgZ2V0VG90YWxCYWxhbmNlXSxcbiAgKTtcblxuICBjb25zdCBhZGRBY2NvdW50QW5kRm9jdXMgPSBhc3luYyAoKSA9PiB7XG4gICAgc2V0QWRkQWNjb3VudExvYWRpbmcodHJ1ZSk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgaWQgPSBhd2FpdCBhZGRBY2NvdW50KCk7XG4gICAgICBjYXB0dXJlKCdDcmVhdGVkQU5ld0FjY291bnRTdWNjZXNzZnVsbHknLCB7XG4gICAgICAgIHdhbGxldFR5cGU6IHdhbGxldERldGFpbHM/LnR5cGUsXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHNlbGVjdEFjY291bnQoaWQpO1xuXG4gICAgICAvLyBSZWZyZXNoIHRvdGFsIGJhbGFuY2Ugb2YgdGhlIHdhbGxldCBhZnRlciBhZGRpbmcgYW4gYWNjb3VudFxuICAgICAgaWYgKHdhbGxldERldGFpbHM/LmlkKSB7XG4gICAgICAgIGZldGNoQmFsYW5jZUZvcldhbGxldCh3YWxsZXREZXRhaWxzLmlkKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChfZXJyKSB7XG4gICAgICB0b2FzdC5lcnJvcih0KCdBbiBlcnJvciBvY2N1cnJlZCwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpKTtcbiAgICB9XG5cbiAgICBzZXRBZGRBY2NvdW50TG9hZGluZyhmYWxzZSk7XG4gIH07XG5cbiAgY29uc3QgaGFzSW1wb3J0ZWRBY2NvdW50cyA9IE9iamVjdC5rZXlzKGltcG9ydGVkQWNjb3VudHMpLmxlbmd0aCA+IDA7XG5cbiAgY29uc3QgeyBjdXJyZW5jeUZvcm1hdHRlciB9ID0gdXNlU2V0dGluZ3NDb250ZXh0KCk7XG4gIGNvbnN0IHsgcHJvbXB0OiBwcm9tcHRSZW1vdmFsLCByZW5kZXJEaWFsb2c6IGNvbmZpcm1SZW1vdmFsRGlhbG9nIH0gPVxuICAgIHVzZUFjY291bnRSZW1vdmFsKHNlbGVjdGVkQWNjb3VudHMpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7YWRkQWNjb3VudExvYWRpbmcgJiYgaGFzTGVkZ2VyVHJhbnNwb3J0ICYmIChcbiAgICAgICAgPE92ZXJsYXk+XG4gICAgICAgICAgPExlZGdlckFwcHJvdmFsRGlhbG9nIGhlYWRlcj17dCgnV2FpdGluZyBmb3IgTGVkZ2VyJyl9IC8+XG4gICAgICAgIDwvT3ZlcmxheT5cbiAgICAgICl9XG4gICAgICB7Y29uZmlybVJlbW92YWxEaWFsb2coKX1cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgcGw6IDAuMjUsXG4gICAgICAgICAgcHQ6IDEsXG4gICAgICAgICAgcGI6IDAuNSxcbiAgICAgICAgICBwcjogMixcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoaXN0b3J5LnJlcGxhY2UoJy9ob21lJyl9XG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHBhZGRpbmc6IDAuMjUsXG4gICAgICAgICAgICAnPiBzdmcnOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb246ICdjb2xvciAuMTVzIGVhc2UtaW4tb3V0LCB0cmFuc2Zvcm0gLjE1cyBlYXNlLWluLW91dCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzpob3ZlciBzdmcnOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiB0aGVtZS5wYWxldHRlLnNlY29uZGFyeS5saWdodGVyLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0ycHgpJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkaXNhYmxlUmlwcGxlXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NvdW50cy1iYWNrLWJ0blwiXG4gICAgICAgID5cbiAgICAgICAgICA8Q2hldnJvbkxlZnRJY29uIHNpemU9ezMyfSAvPlxuICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgIDxOZXR3b3JrU3dpdGNoZXIgLz5cbiAgICAgIDwvU3RhY2s+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBweDogMixcbiAgICAgICAgICBweTogMC41LFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgZ2FwOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8T3ZlcmZsb3dpbmdUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWNjb3VudC1tYW5hZ2VtZW50LWFjdGl2ZS13YWxsZXRcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdDdXJyZW50bHkgdXNpbmcge3t3YWxsZXROYW1lfX0nLCB7XG4gICAgICAgICAgICAgIHdhbGxldE5hbWU6IGlzUHJpbWFyeUFjY291bnQoYWN0aXZlKVxuICAgICAgICAgICAgICAgID8gd2FsbGV0RGV0YWlscz8ubmFtZVxuICAgICAgICAgICAgICAgIDogdCgnYW4gaW1wb3J0ZWQgYWNjb3VudCcpLFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9PdmVyZmxvd2luZ1R5cG9ncmFwaHk+XG4gICAgICAgICAge2lzUHJpbWFyeUFjY291bnQoYWN0aXZlKSAmJiAoXG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ9ezUwMH1cbiAgICAgICAgICAgICAgdGV4dEFsaWduPVwiZW5kXCJcbiAgICAgICAgICAgICAgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIC8vIFByZXZlbnRzIFVJIGZyb20ganVtcGluZyBkdWUgdG8gTG9hZGluZ0RvdHNJY29uIGJlaW5nIGxhcmdlciB0aGFuIHRoZXkgYXBwZWFyXG4gICAgICAgICAgICAgIHN4PXtpc0xvYWRpbmcgPyB7IGhlaWdodDogMTUsIG92ZXJmbG93OiAnaGlkZGVuJyB9IDogbnVsbH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2lzTG9hZGluZyA/IChcbiAgICAgICAgICAgICAgICA8TG9hZGluZ0RvdHNJY29uIHNpemU9ezIwfSBvcmllbnRhdGlvbj1cImhvcml6b250YWxcIiAvPlxuICAgICAgICAgICAgICApIDogdHlwZW9mIGFjdGl2ZVdhbGxldFRvdGFsQmFsYW5jZSA9PT0gJ251bWJlcicgPyAoXG4gICAgICAgICAgICAgICAgY3VycmVuY3lGb3JtYXR0ZXIoYWN0aXZlV2FsbGV0VG90YWxCYWxhbmNlKVxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICApfVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgZ2FwOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8T3ZlcmZsb3dpbmdUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiaDVcIlxuICAgICAgICAgICAgZm9udFNpemU9ezE4fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY2NvdW50LW1hbmFnZW1lbnQtYWN0aXZlLWFjY291bnRcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHthY3RpdmU/Lm5hbWV9XG4gICAgICAgICAgPC9PdmVyZmxvd2luZ1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgZm9udFNpemU9ezE4fT5cbiAgICAgICAgICAgIHt0eXBlb2YgYWN0aXZlQWNjb3VudEJhbGFuY2U/LnN1bSA9PT0gJ251bWJlcidcbiAgICAgICAgICAgICAgPyBjdXJyZW5jeUZvcm1hdHRlcihhY3RpdmVBY2NvdW50QmFsYW5jZS5zdW0pXG4gICAgICAgICAgICAgIDogJyd9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxEaXZpZGVyIHN4PXt7IGJvcmRlckNvbG9yOiAnI2ZmZicsIG9wYWNpdHk6IDAuMiB9fSAvPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgcHk6IDAuNzUsXG4gICAgICAgICAgcHI6IDEuNSxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZU1hbmFnZU1vZGV9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJtYW5hZ2UtYWNjb3VudHMtYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIHtpc01hbmFnZU1vZGUgPyB0KCdDYW5jZWwnKSA6IHQoJ01hbmFnZScpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvU3RhY2s+XG4gICAgICA8RGl2aWRlciBzeD17eyBib3JkZXJDb2xvcjogdGhlbWUucGFsZXR0ZS5ncmV5WzgwMF0gfX0gLz5cblxuICAgICAgPFNjcm9sbGJhcnM+XG4gICAgICAgIDxBY2NvdW50TGlzdFByaW1hcnkgcHJpbWFyeUFjY291bnRzPXtwcmltYXJ5QWNjb3VudHN9IC8+XG5cbiAgICAgICAge2hhc0ltcG9ydGVkQWNjb3VudHMgJiYgKFxuICAgICAgICAgIDxBY2NvdW50TGlzdEltcG9ydGVkIGFjY291bnRzPXtPYmplY3QudmFsdWVzKGltcG9ydGVkQWNjb3VudHMpfSAvPlxuICAgICAgICApfVxuICAgICAgPC9TY3JvbGxiYXJzPlxuICAgICAgPFN0YWNrXG4gICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgIHN4PXt7IHB5OiAzLCBweDogMiwganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fVxuICAgICAgPlxuICAgICAgICB7aXNNYW5hZ2VNb2RlICYmIChcbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICBkaXNhYmxlZD17c2VsZWN0ZWRBY2NvdW50cy5sZW5ndGggPT09IDB9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlbGV0ZS1pbXBvcnRlZC1hY2NvdW50LWJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGNhcHR1cmUoJ0ltcG9ydGVkQWNjb3VudERlbGV0ZUNsaWNrZWQnKTtcbiAgICAgICAgICAgICAgcHJvbXB0UmVtb3ZhbCgpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VHJhc2hJY29uIHNpemU9ezE0fSBzeD17eyBtcjogMSB9fSAvPlxuICAgICAgICAgICAge3NlbGVjdGVkQWNjb3VudHMubGVuZ3RoIDw9IDFcbiAgICAgICAgICAgICAgPyB0KCdEZWxldGUgQWNjb3VudCcpXG4gICAgICAgICAgICAgIDogdCgnRGVsZXRlIEFjY291bnRzJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICl9XG4gICAgICAgIHshaXNNYW5hZ2VNb2RlICYmIChcbiAgICAgICAgICA8QWNjb3VudHNBY3Rpb25CdXR0b25cbiAgICAgICAgICAgIGlzTG9hZGluZz17YWRkQWNjb3VudExvYWRpbmd9XG4gICAgICAgICAgICBjYW5DcmVhdGVBY2NvdW50PXtjYW5DcmVhdGVBY2NvdW50fVxuICAgICAgICAgICAgb25BZGROZXdBY2NvdW50PXthZGRBY2NvdW50QW5kRm9jdXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIENoZWNrYm94LFxuICBDb2xsYXBzZSxcbiAgQ29weUljb24sXG4gIEdyb3csXG4gIEljb25CdXR0b24sXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7XG4gIEZvcndhcmRlZFJlZixcbiAgZm9yd2FyZFJlZixcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVmLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IE5ldHdvcmtWTVR5cGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWNoYWlucy1zZGsnO1xuXG5pbXBvcnQgeyB1c2VCYWxhbmNlc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0JhbGFuY2VzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IEFjY291bnQsIEFjY291bnRUeXBlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VCYWxhbmNlVG90YWxJbkN1cnJlbmN5IH0gZnJvbSAnQHNyYy9ob29rcy91c2VCYWxhbmNlVG90YWxJbkN1cnJlbmN5JztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgU2VjcmV0VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9zZWNyZXRzL21vZGVscyc7XG5pbXBvcnQgeyBnZXRBZGRyZXNzRm9yQ2hhaW4gfSBmcm9tICdAc3JjL3V0aWxzL2dldEFkZHJlc3NGb3JDaGFpbic7XG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAc3JjL3V0aWxzL3RydW5jYXRlQWRkcmVzcyc7XG5pbXBvcnQgeyB1c2VTY29wZWRUb2FzdCB9IGZyb20gJ0BzcmMvaG9va3MvdXNlU2NvcGVkVG9hc3QnO1xuXG5pbXBvcnQgeyB1c2VBY2NvdW50UmVuYW1lIH0gZnJvbSAnLi4vaG9va3MvdXNlQWNjb3VudFJlbmFtZSc7XG5pbXBvcnQge1xuICBTZWxlY3Rpb25Nb2RlLFxuICB1c2VBY2NvdW50TWFuYWdlcixcbn0gZnJvbSAnLi4vcHJvdmlkZXJzL0FjY291bnRNYW5hZ2VyUHJvdmlkZXInO1xuaW1wb3J0IHsgQWNjb3VudEJhbGFuY2UgfSBmcm9tICcuLi9BY2NvdW50QmFsYW5jZSc7XG5pbXBvcnQgeyBBY2NvdW50SXRlbU1lbnUgfSBmcm9tICcuL0FjY291bnRJdGVtTWVudSc7XG5pbXBvcnQgQWNjb3VudE5hbWVOZXcgZnJvbSAnLi9BY2NvdW50TmFtZSc7XG5pbXBvcnQgeyB1c2VBY2NvdW50UmVtb3ZhbCB9IGZyb20gJy4uL2hvb2tzL3VzZUFjY291bnRSZW1vdmFsJztcblxudHlwZSBBY2NvdW50SXRlbVByb3BzID0ge1xuICBhY2NvdW50OiBBY2NvdW50O1xuICB3YWxsZXRUeXBlPzogU2VjcmV0VHlwZTtcbiAgc2VsZWN0aW9uTW9kZTogU2VsZWN0aW9uTW9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBBY2NvdW50SXRlbSA9IGZvcndhcmRSZWYoXG4gIChcbiAgICB7IGFjY291bnQsIHdhbGxldFR5cGUsIHNlbGVjdGlvbk1vZGUgfTogQWNjb3VudEl0ZW1Qcm9wcyxcbiAgICByZWY6IEZvcndhcmRlZFJlZjxIVE1MRGl2RWxlbWVudD4sXG4gICkgPT4ge1xuICAgIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICBjb25zdCB0b2FzdCA9IHVzZVNjb3BlZFRvYXN0KCdhY2NvdW50LXN3aXRjaGVyJyk7XG4gICAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICAgIGNvbnN0IHtcbiAgICAgIGlzTWFuYWdlTW9kZSxcbiAgICAgIHNlbGVjdEFjY291bnQsXG4gICAgICBkZXNlbGVjdEFjY291bnQsXG4gICAgICBpc0FjY291bnRTZWxlY3RhYmxlLFxuICAgICAgc2VsZWN0ZWRBY2NvdW50cyxcbiAgICB9ID0gdXNlQWNjb3VudE1hbmFnZXIoKTtcbiAgICBjb25zdCB7IGlzQWN0aXZlQWNjb3VudCwgc2VsZWN0QWNjb3VudDogYWN0aXZhdGVBY2NvdW50IH0gPVxuICAgICAgdXNlQWNjb3VudHNDb250ZXh0KCk7XG4gICAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gICAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuXG4gICAgY29uc3QgaXNBY3RpdmUgPSBpc0FjdGl2ZUFjY291bnQoYWNjb3VudC5pZCk7XG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IHNlbGVjdGVkQWNjb3VudHMuaW5jbHVkZXMoYWNjb3VudC5pZCk7XG5cbiAgICBjb25zdCBpc1NlbGVjdGFibGUgPVxuICAgICAgd2FsbGV0VHlwZSA9PT0gU2VjcmV0VHlwZS5TZWVkbGVzc1xuICAgICAgICA/IGZhbHNlXG4gICAgICAgIDogaXNNYW5hZ2VNb2RlICYmIGlzQWNjb3VudFNlbGVjdGFibGUoYWNjb3VudCk7XG4gICAgY29uc3QgYmFsYW5jZVRvdGFsVVNEID0gdXNlQmFsYW5jZVRvdGFsSW5DdXJyZW5jeShhY2NvdW50KTtcbiAgICBjb25zdCB0b3RhbEJhbGFuY2UgPSAoYmFsYW5jZVRvdGFsVVNEICYmIGJhbGFuY2VUb3RhbFVTRC5zdW0pID8/IG51bGw7XG4gICAgY29uc3QgYWRkcmVzcyA9IGdldEFkZHJlc3NGb3JDaGFpbihuZXR3b3JrLCBhY2NvdW50KTtcbiAgICBjb25zdCBbY2FyZEhvdmVyZWQsIHNldENhcmRIb3ZlcmVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBpdGVtUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgICBjb25zdCBmaXJzdFBhZ2Vsb2FkID0gdXNlUmVmKHRydWUpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgIGlmIChpc0FjdGl2ZSkge1xuICAgICAgICBjb25zdCBiZWhhdmlvciA9IGZpcnN0UGFnZWxvYWQuY3VycmVudCA/ICdpbnN0YW50JyA6ICdzbW9vdGgnO1xuICAgICAgICBpdGVtUmVmPy5jdXJyZW50Py5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgICAgYmxvY2s6ICduZWFyZXN0JyxcbiAgICAgICAgICBiZWhhdmlvcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBmaXJzdFBhZ2Vsb2FkLmN1cnJlbnQgPSBmYWxzZTtcbiAgICB9LCBbaXNBY3RpdmVdKTtcblxuICAgIGNvbnN0IHRvZ2dsZSA9IHVzZUNhbGxiYWNrKFxuICAgICAgKGFjY291bnRJZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgZGVzZWxlY3RBY2NvdW50KFxuICAgICAgICAgICAgYWNjb3VudElkLFxuICAgICAgICAgICAgc2VsZWN0aW9uTW9kZSA9PT0gU2VsZWN0aW9uTW9kZS5Db25zZWN1dGl2ZSxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGVjdEFjY291bnQoYWNjb3VudElkKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFtkZXNlbGVjdEFjY291bnQsIGlzU2VsZWN0ZWQsIHNlbGVjdEFjY291bnQsIHNlbGVjdGlvbk1vZGVdLFxuICAgICk7XG5cbiAgICBjb25zdCBoYW5kbGVBY2NvdW50Q2xpY2sgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoaXNTZWxlY3RhYmxlKSB7XG4gICAgICAgIHRvZ2dsZShhY2NvdW50LmlkKTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzTWFuYWdlTW9kZSkge1xuICAgICAgICBhd2FpdCBhY3RpdmF0ZUFjY291bnQoYWNjb3VudC5pZCk7XG4gICAgICAgIHRvYXN0LnN1Y2Nlc3MoXG4gICAgICAgICAgdChgQWNjb3VudCBcInt7YWNjb3VudE5hbWV9fVwiIGlzIG5vdyBhY3RpdmVgLCB7XG4gICAgICAgICAgICBhY2NvdW50TmFtZTogYWNjb3VudC5uYW1lLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHsgZHVyYXRpb246IDEwMDAgfSxcbiAgICAgICAgKTtcbiAgICAgICAgYXdhaXQgY2FwdHVyZSgnQWNjb3VudFNlbGVjdG9yQWNjb3VudFN3aXRjaGVkJywge1xuICAgICAgICAgIHR5cGU6IGFjY291bnQudHlwZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgW1xuICAgICAgYWNjb3VudC5pZCxcbiAgICAgIGFjY291bnQudHlwZSxcbiAgICAgIGFjY291bnQubmFtZSxcbiAgICAgIGFjdGl2YXRlQWNjb3VudCxcbiAgICAgIGNhcHR1cmUsXG4gICAgICBpc01hbmFnZU1vZGUsXG4gICAgICBpc1NlbGVjdGFibGUsXG4gICAgICB0LFxuICAgICAgdG9nZ2xlLFxuICAgICAgdG9hc3QsXG4gICAgXSk7XG5cbiAgICBjb25zdCBub25TZWxlY3RhYmxlSGludCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgICAgaWYgKGlzU2VsZWN0YWJsZSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIGlmICh3YWxsZXRUeXBlID09PSBTZWNyZXRUeXBlLlNlZWRsZXNzKSB7XG4gICAgICAgIHJldHVybiB0KCdZb3UgY2Fubm90IGRlbGV0ZSBhIHNlZWRsZXNzIGFjY291bnQuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgIWlzU2VsZWN0YWJsZSAmJlxuICAgICAgICBhY2NvdW50LnR5cGUgPT09IEFjY291bnRUeXBlLlBSSU1BUlkgJiZcbiAgICAgICAgYWNjb3VudC5pbmRleCA9PT0gMFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0KCdSZW1vdmluZyB0aGUgbGFzdCBhY2NvdW50IGlzIG5vdCBwb3NzaWJsZS4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHQoXG4gICAgICAgICdUbyByZW1vdmUgdGhpcyBhY2NvdW50LCB5b3UgbXVzdCBhbHNvIHJlbW92ZSBhbGwgYWNjb3VudHMgdGhhdCBmb2xsb3cuJyxcbiAgICAgICk7XG4gICAgfSwgW2FjY291bnQsIGlzU2VsZWN0YWJsZSwgdCwgd2FsbGV0VHlwZV0pO1xuXG4gICAgY29uc3QgW2lzQmFsYW5jZUxvYWRpbmcsIHNldElzQmFsYW5jZUxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHsgdXBkYXRlQmFsYW5jZU9uTmV0d29ya3MgfSA9IHVzZUJhbGFuY2VzQ29udGV4dCgpO1xuXG4gICAgY29uc3QgZ2V0QmFsYW5jZSA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICAgIHNldElzQmFsYW5jZUxvYWRpbmcodHJ1ZSk7XG4gICAgICBhd2FpdCB1cGRhdGVCYWxhbmNlT25OZXR3b3JrcyhbYWNjb3VudF0pO1xuICAgICAgc2V0SXNCYWxhbmNlTG9hZGluZyhmYWxzZSk7XG4gICAgfSwgW2FjY291bnQsIHVwZGF0ZUJhbGFuY2VPbk5ldHdvcmtzXSk7XG5cbiAgICBjb25zdCB0b0JlUmVtb3ZlZCA9IHVzZU1lbW8oKCkgPT4gW2FjY291bnQuaWRdLCBbYWNjb3VudC5pZF0pO1xuICAgIGNvbnN0IHsgcHJvbXB0OiBwcm9tcHRSZW5hbWUsIHJlbmRlckRpYWxvZzogcmVuYW1lRGlhbG9nIH0gPVxuICAgICAgdXNlQWNjb3VudFJlbmFtZShhY2NvdW50KTtcbiAgICBjb25zdCB7IHByb21wdDogcHJvbXB0UmVtb3ZlLCByZW5kZXJEaWFsb2c6IHJlbW92ZURpYWxvZyB9ID1cbiAgICAgIHVzZUFjY291bnRSZW1vdmFsKHRvQmVSZW1vdmVkKTtcbiAgICBjb25zdCBoYW5kbGVDb3B5Q2xpY2sgPSB1c2VDYWxsYmFjayhcbiAgICAgIChldikgPT4ge1xuICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKCFhZGRyZXNzIHx8ICFuZXR3b3JrPy52bU5hbWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gZ2V0Q29weUV2ZW50TmFtZUJ5TmV0d29ya1R5cGUobmV0d29yay52bU5hbWUpO1xuXG4gICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGFkZHJlc3MpO1xuICAgICAgICB0b2FzdC5zdWNjZXNzKCdDb3BpZWQhJywgeyBkdXJhdGlvbjogMTAwMCB9KTtcbiAgICAgICAgY2FwdHVyZShldmVudE5hbWUsIHtcbiAgICAgICAgICB0eXBlOiBhY2NvdW50LnR5cGUsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIFthZGRyZXNzLCBhY2NvdW50LnR5cGUsIGNhcHR1cmUsIG5ldHdvcms/LnZtTmFtZSwgdG9hc3RdLFxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPD5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAga2V5PXthY2NvdW50LmlkfVxuICAgICAgICAgIHJlZj17cmVmfVxuICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG5cbiAgICAgICAgICAgIG9wYWNpdHk6IGlzTWFuYWdlTW9kZSA/IChpc1NlbGVjdGFibGUgPyAxIDogMC42KSA6IDEsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB0aGVtZS50cmFuc2l0aW9ucy5jcmVhdGUoJ29wYWNpdHknKSxcbiAgICAgICAgICAgICc6aG92ZXInOiB7XG4gICAgICAgICAgICAgIG9wYWNpdHk6IGlzTWFuYWdlTW9kZSA/IChpc1NlbGVjdGFibGUgPyAxIDogMC42KSA6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25DbGljaz17aXNNYW5hZ2VNb2RlID8gdW5kZWZpbmVkIDogaGFuZGxlQWNjb3VudENsaWNrfVxuICAgICAgICAgIG9uQ2xpY2tDYXB0dXJlPXtpc01hbmFnZU1vZGUgPyBoYW5kbGVBY2NvdW50Q2xpY2sgOiB1bmRlZmluZWR9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9e2BhY2NvdW50LWxpLWl0ZW0tJHthY2NvdW50LmlkfWB9XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRDYXJkSG92ZXJlZCh0cnVlKX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldENhcmRIb3ZlcmVkKGZhbHNlKX1cbiAgICAgICAgPlxuICAgICAgICAgIDxDb2xsYXBzZSBpbj17aXNNYW5hZ2VNb2RlfSBvcmllbnRhdGlvbj1cImhvcml6b250YWxcIj5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICAgICAgICBtbDogLTEsXG4gICAgICAgICAgICAgICAgcHI6IDAuMjUsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgIHRpdGxlPXtub25TZWxlY3RhYmxlSGludH1cbiAgICAgICAgICAgICAgICBzeD17eyBjdXJzb3I6IGlzU2VsZWN0YWJsZSA/ICdwb2ludGVyJyA6ICdub3QtYWxsb3dlZCcgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgICAgICAgZGlzYWJsZVJpcHBsZVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFpc1NlbGVjdGFibGV9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gdG9nZ2xlKGFjY291bnQuaWQpfVxuICAgICAgICAgICAgICAgICAgY2hlY2tlZD17c2VsZWN0ZWRBY2NvdW50cy5pbmNsdWRlcyhhY2NvdW50LmlkKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICByZWY9e2l0ZW1SZWZ9XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgIC8vIG1heFdpZHRoIGlzIG5lZWRlZCBkdWUgdG8gcG90ZW50aWFsbHkgbG9uZyBhY2NvdW50IG5hbWUgc3RvcHBpbmcgdGhlIGNvbnRhaW5lciBmcm9tIHNocmlua2luZ1xuICAgICAgICAgICAgICBtYXhXaWR0aDogaXNNYW5hZ2VNb2RlID8gJ2NhbGMoMTAwJSAtIDMycHgpJyA6ICcxMDAlJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgICAgICdjb2xvciAuMnMgZWFzZS1pbi1vdXQsIGJhY2tncm91bmQtY29sb3IgLjJzIGVhc2UtaW4tb3V0LCBtYXgtd2lkdGggLjJzIGVhc2UtaW4tb3V0JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBpc0FjdGl2ZSA/ICdncmV5LjcwMCcgOiAnZ3JleS44NTAnLFxuICAgICAgICAgICAgICBjb2xvcjogaXNBY3RpdmUgPyAnZ3JleS41MCcgOiAndGV4dC5wcmltYXJ5JyxcbiAgICAgICAgICAgICAgJzpob3Zlcic6IHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGlzQWN0aXZlID8gJ2dyZXkuNzAwJyA6ICdncmV5LjgwMCcsXG4gICAgICAgICAgICAgICAgY29sb3I6ICdncmV5LjUwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcHk6IDAuNzUsXG4gICAgICAgICAgICAgIHBsOiAyLFxuICAgICAgICAgICAgICBwcjogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgbWluV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8QWNjb3VudE5hbWVOZXdcbiAgICAgICAgICAgICAgICAgIGFjY291bnROYW1lPXthY2NvdW50Lm5hbWV9XG4gICAgICAgICAgICAgICAgICBwcm9tcHRSZW5hbWU9e3Byb21wdFJlbmFtZX1cbiAgICAgICAgICAgICAgICAgIGNhcmRIb3ZlcmVkPXtjYXJkSG92ZXJlZH1cbiAgICAgICAgICAgICAgICAgIGlzQWN0aXZlPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHthZGRyZXNzID8gKFxuICAgICAgICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXthZGRyZXNzfVxuICAgICAgICAgICAgICAgICAgICAgIHNsb3RQcm9wcz17e1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9wcGVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6IChldikgPT4gZXYuc3RvcFByb3BhZ2F0aW9uKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I9e2lzQWN0aXZlID8gJ3RleHQucHJpbWFyeScgOiAndGV4dC5zZWNvbmRhcnknfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFN0eWxlPXthZGRyZXNzID8gJ25vcm1hbCcgOiAnaXRhbGljJ31cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dHJ1bmNhdGVBZGRyZXNzKGFkZHJlc3MpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I9e2lzQWN0aXZlID8gJ3RleHQucHJpbWFyeScgOiAndGV4dC5zZWNvbmRhcnknfVxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZT1cIml0YWxpY1wiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7dCgnQWN0aXZlIG5ldHdvcmsgaXMgbm90IHN1cHBvcnRlZCcpfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPEdyb3cgaW49e2NhcmRIb3ZlcmVkIHx8IGlzQWN0aXZlfT5cbiAgICAgICAgICAgICAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3g9e3sgcDogMC41IH19XG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQ29weUNsaWNrfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPENvcHlJY29uIHNpemU9ezEyfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgICAgICAgICAgICA8L0dyb3c+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICBwbDogMixcbiAgICAgICAgICAgICAgICAgIHByOiAxLFxuICAgICAgICAgICAgICAgICAgcHQ6IDAuMjUsXG4gICAgICAgICAgICAgICAgICBnYXA6IDAuNSxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEFjY291bnRCYWxhbmNlXG4gICAgICAgICAgICAgICAgICByZWZyZXNoQmFsYW5jZT17Z2V0QmFsYW5jZX1cbiAgICAgICAgICAgICAgICAgIGJhbGFuY2VUb3RhbFVTRD17dG90YWxCYWxhbmNlfVxuICAgICAgICAgICAgICAgICAgaXNCYWxhbmNlTG9hZGluZz17aXNCYWxhbmNlTG9hZGluZ31cbiAgICAgICAgICAgICAgICAgIGFjY291bnRUeXBlPXthY2NvdW50LnR5cGV9XG4gICAgICAgICAgICAgICAgICBpc0FjdGl2ZT17aXNBY3RpdmV9XG4gICAgICAgICAgICAgICAgICBpc0hvdmVyZWQ9e2NhcmRIb3ZlcmVkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPENvbGxhcHNlXG4gICAgICAgICAgICAgICAgICBvcmllbnRhdGlvbj1cImhvcml6b250YWxcIlxuICAgICAgICAgICAgICAgICAgaW49eyFpc01hbmFnZU1vZGUgJiYgY2FyZEhvdmVyZWR9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPEFjY291bnRJdGVtTWVudVxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50PXthY2NvdW50fVxuICAgICAgICAgICAgICAgICAgICBpc0FjdGl2ZT17aXNBY3RpdmV9XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVJlbW92ZT17cHJvbXB0UmVtb3ZlfVxuICAgICAgICAgICAgICAgICAgICBwcm9tcHRSZW5hbWU9e3Byb21wdFJlbmFtZX1cbiAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVBY2NvdW50PXtoYW5kbGVBY2NvdW50Q2xpY2t9XG4gICAgICAgICAgICAgICAgICAgIHdhbGxldFR5cGU9e3dhbGxldFR5cGV9XG4gICAgICAgICAgICAgICAgICAgIG1lbnVBbmNob3I9e2l0ZW1SZWZ9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIHtyZW5hbWVEaWFsb2coKX1cbiAgICAgICAge3JlbW92ZURpYWxvZygpfVxuICAgICAgPC8+XG4gICAgKTtcbiAgfSxcbik7XG5cbkFjY291bnRJdGVtLmRpc3BsYXlOYW1lID0gJ0FjY291bnRJdGVtJztcblxuY29uc3QgZ2V0Q29weUV2ZW50TmFtZUJ5TmV0d29ya1R5cGUgPSAodHlwZTogTmV0d29ya1ZNVHlwZSkgPT4ge1xuICAvLyBXZSByZW1hcCBCVEMgYW5kIEVWTSBiZWNhdXNlIHdlIHVzZWQgdGhvc2UgaW4gb2xkZXIgZXZlbnQgbmFtZXNcbiAgY29uc3Qgbm9ybWFsaXplZFR5cGUgPVxuICAgIHR5cGUgPT09IE5ldHdvcmtWTVR5cGUuQklUQ09JTlxuICAgICAgPyAnQnRjJ1xuICAgICAgOiB0eXBlID09PSBOZXR3b3JrVk1UeXBlLkVWTVxuICAgICAgICA/ICdFdGgnXG4gICAgICAgIDogdHlwZTtcblxuICByZXR1cm4gYEFjY291bnRTZWxlY3RvciR7bm9ybWFsaXplZFR5cGV9QWRkcmVzc0NvcGllZGA7XG59O1xuIiwiaW1wb3J0IHsgUmVmT2JqZWN0LCB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBDbGlja0F3YXlMaXN0ZW5lcixcbiAgR3JvdyxcbiAgSWNvbkJ1dHRvbixcbiAgTGlzdEl0ZW1UZXh0LFxuICBNZW51SXRlbSxcbiAgTWVudUxpc3QsXG4gIE1vcmVWZXJ0aWNhbEljb24sXG4gIFBvcHBlcixcbiAgVG9vbHRpcCxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcbmltcG9ydCB7IFNlY3JldFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VjcmV0cy9tb2RlbHMnO1xuXG5pbXBvcnQgeyB1c2VQcml2YXRlS2V5RXhwb3J0IH0gZnJvbSAnLi4vaG9va3MvdXNlUHJpdmF0ZUtleUV4cG9ydCc7XG5pbXBvcnQgeyB1c2VBY2NvdW50TWFuYWdlciB9IGZyb20gJy4uL3Byb3ZpZGVycy9BY2NvdW50TWFuYWdlclByb3ZpZGVyJztcblxudHlwZSBBY2NvdW50SXRlbU1lbnVQcm9wcyA9IHtcbiAgYWNjb3VudDogQWNjb3VudDtcbiAgaXNBY3RpdmU6IGJvb2xlYW47XG4gIGFjdGl2YXRlQWNjb3VudCgpOiBQcm9taXNlPHZvaWQ+O1xuICBwcm9tcHRSZW5hbWUoKTogdm9pZDtcbiAgaGFuZGxlUmVtb3ZlKCk6IHZvaWQ7XG4gIHdhbGxldFR5cGU/OiBTZWNyZXRUeXBlO1xuICBtZW51QW5jaG9yOiBSZWZPYmplY3Q8SFRNTEVsZW1lbnQ+O1xufTtcblxuZXhwb3J0IGNvbnN0IEFjY291bnRJdGVtTWVudSA9ICh7XG4gIGFjY291bnQsXG4gIGFjdGl2YXRlQWNjb3VudCxcbiAgcHJvbXB0UmVuYW1lLFxuICBoYW5kbGVSZW1vdmUsXG4gIGlzQWN0aXZlLFxuICB3YWxsZXRUeXBlLFxuICBtZW51QW5jaG9yLFxufTogQWNjb3VudEl0ZW1NZW51UHJvcHMpID0+IHtcbiAgY29uc3QgeyBpc0FjY291bnRTZWxlY3RhYmxlIH0gPSB1c2VBY2NvdW50TWFuYWdlcigpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG5cbiAgY29uc3QgW2lzT3Blbiwgc2V0SXNPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgeyBpc1ByaXZhdGVLZXlBdmFpbGFibGUsIHNob3dQcml2YXRlS2V5IH0gPSB1c2VQcml2YXRlS2V5RXhwb3J0KFxuICAgIGFjY291bnQsXG4gICAgd2FsbGV0VHlwZSxcbiAgKTtcbiAgY29uc3QgaXNEZWxldGFibGUgPSBpc0FjY291bnRTZWxlY3RhYmxlKGFjY291bnQpO1xuXG4gIGNvbnN0IGdvVG9EZXRhaWxzID0gdXNlQ2FsbGJhY2soXG4gICAgKGU6IEV2ZW50KSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaGlzdG9yeS5wdXNoKGAvYWNjb3VudHMvJHthY2NvdW50LmlkfWApO1xuICAgIH0sXG4gICAgW2hpc3RvcnksIGFjY291bnQuaWRdLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPENsaWNrQXdheUxpc3RlbmVyXG4gICAgICBtb3VzZUV2ZW50PVwib25Nb3VzZURvd25cIlxuICAgICAgb25DbGlja0F3YXk9eygpID0+IHNldElzT3BlbihmYWxzZSl9XG4gICAgPlxuICAgICAgPEljb25CdXR0b25cbiAgICAgICAgc3g9e3sgcDogMCwgbXI6IC0wLjUgfX1cbiAgICAgICAgZGF0YS10ZXN0aWQ9e2Ake2lzQWN0aXZlID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnfS1hY2NvdW50LWl0ZW0tbWVudWB9XG4gICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBzZXRJc09wZW4oKG9wZW4pID0+ICFvcGVuKTtcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPE1vcmVWZXJ0aWNhbEljb24gc2l6ZT17MjR9IC8+XG5cbiAgICAgICAgPFBvcHBlclxuICAgICAgICAgIG9wZW49e2lzT3Blbn1cbiAgICAgICAgICBhbmNob3JFbD17bWVudUFuY2hvci5jdXJyZW50fVxuICAgICAgICAgIHBsYWNlbWVudD1cImJvdHRvbVwiXG4gICAgICAgICAgdHJhbnNpdGlvblxuICAgICAgICA+XG4gICAgICAgICAgeyh7IFRyYW5zaXRpb25Qcm9wcyB9KSA9PiAoXG4gICAgICAgICAgICA8R3JvdyB7Li4uVHJhbnNpdGlvblByb3BzfSB0aW1lb3V0PXsyNTB9PlxuICAgICAgICAgICAgICA8TWVudUxpc3RcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgbTogMSxcbiAgICAgICAgICAgICAgICAgIHA6IDAsXG4gICAgICAgICAgICAgICAgICBtaW5XaWR0aDogMjcwLFxuICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnZ3JleS44MDAnLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICd0ZXh0LnByaW1hcnknLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4wNSknLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8TWVudUl0ZW1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2dvVG9EZXRhaWxzfVxuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzaG93LWFjY291bnQtZGV0YWlscy1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgc3g9e3sgbWluSGVpZ2h0OiAnNDBweCcgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8TGlzdEl0ZW1UZXh0Pnt0KCdWaWV3IERldGFpbHMnKX08L0xpc3RJdGVtVGV4dD5cbiAgICAgICAgICAgICAgICA8L01lbnVJdGVtPlxuICAgICAgICAgICAgICAgIHshaXNBY3RpdmUgJiYgKFxuICAgICAgICAgICAgICAgICAgPE1lbnVJdGVtXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZUFjY291bnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhY3RpdmF0ZS1hY2NvdW50LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4xKScsXG4gICAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnNDBweCcsXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxMaXN0SXRlbVRleHQ+e3QoJ1NlbGVjdCB0aGlzIHdhbGxldCcpfTwvTGlzdEl0ZW1UZXh0PlxuICAgICAgICAgICAgICAgICAgPC9NZW51SXRlbT5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHtpc1ByaXZhdGVLZXlBdmFpbGFibGUgJiYgKFxuICAgICAgICAgICAgICAgICAgPE1lbnVJdGVtXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3Nob3dQcml2YXRlS2V5fVxuICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImV4cG9ydC1wcml2YXRlLWtleS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclRvcDogJzFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMSknLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzQwcHgnLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8TGlzdEl0ZW1UZXh0Pnt0KCdTaG93IHByaXZhdGUga2V5Jyl9PC9MaXN0SXRlbVRleHQ+XG4gICAgICAgICAgICAgICAgICA8L01lbnVJdGVtPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPE1lbnVJdGVtXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtwcm9tcHRSZW5hbWV9XG4gICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImV4cG9ydC1wcml2YXRlLWtleS1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4xKScsXG4gICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzQwcHgnLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8TGlzdEl0ZW1UZXh0Pnt0KCdFZGl0IG5hbWUnKX08L0xpc3RJdGVtVGV4dD5cbiAgICAgICAgICAgICAgICA8L01lbnVJdGVtPlxuICAgICAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgICAgICBzeD17eyB3aWR0aDogMSB9fVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZUludGVyYWN0aXZlXG4gICAgICAgICAgICAgICAgICB0aXRsZT17XG4gICAgICAgICAgICAgICAgICAgIGlzRGVsZXRhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgICAgICAgICAgIDogdCgnT25seSB0aGUgbGFzdCBhY2NvdW50IG9mIHRoZSB3YWxsZXQgY2FuIGJlIHJlbW92ZWQnKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxNZW51SXRlbVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWlzRGVsZXRhYmxlfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZW1vdmV9XG4gICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwicmVtb3ZlLWFjY291bnQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgICBib3JkZXJUb3A6ICc1cHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjEpJyxcbiAgICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICc0MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPExpc3RJdGVtVGV4dCBzeD17eyBjb2xvcjogJ2Vycm9yLm1haW4nIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdSZW1vdmUgQWNjb3VudCcpfVxuICAgICAgICAgICAgICAgICAgICA8L0xpc3RJdGVtVGV4dD5cbiAgICAgICAgICAgICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICAgICA8L01lbnVMaXN0PlxuICAgICAgICAgICAgPC9Hcm93PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvUG9wcGVyPlxuICAgICAgPC9JY29uQnV0dG9uPlxuICAgIDwvQ2xpY2tBd2F5TGlzdGVuZXI+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgdCB9IGZyb20gJ2kxOG5leHQnO1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBDb2xsYXBzZSwgU3RhY2sgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgaXNJbXBvcnRlZEFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvdXRpbHMvdHlwZUd1YXJkcyc7XG5pbXBvcnQgeyBJTVBPUlRFRF9BQ0NPVU5UU19XQUxMRVRfSUQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvaGFuZGxlcnMvZ2V0VG90YWxCYWxhbmNlRm9yV2FsbGV0L21vZGVscyc7XG5cbmltcG9ydCB7IHVzZVdhbGxldFRvdGFsQmFsYW5jZSB9IGZyb20gJy4uL2hvb2tzL3VzZVdhbGxldFRvdGFsQmFsYW5jZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25Nb2RlIH0gZnJvbSAnLi4vcHJvdmlkZXJzL0FjY291bnRNYW5hZ2VyUHJvdmlkZXInO1xuaW1wb3J0IHsgQWNjb3VudEl0ZW0gfSBmcm9tICcuL0FjY291bnRJdGVtJztcbmltcG9ydCBXYWxsZXRIZWFkZXIgZnJvbSAnLi9XYWxsZXRIZWFkZXInO1xuXG50eXBlIEFjY291bnRMaXN0UHJvcHMgPSB7XG4gIGFjY291bnRzOiBBY2NvdW50W107XG59O1xuXG5leHBvcnQgY29uc3QgQWNjb3VudExpc3RJbXBvcnRlZCA9ICh7IGFjY291bnRzIH06IEFjY291bnRMaXN0UHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGFjY291bnRzOiB7IGFjdGl2ZSB9LFxuICB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG4gIGNvbnN0IFtpc0V4cGFuZGVkLCBzZXRJc0V4cGFuZGVkXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCB7IGlzTG9hZGluZywgaGFzRXJyb3JPY2N1cnJlZCwgdG90YWxCYWxhbmNlSW5DdXJyZW5jeSB9ID1cbiAgICB1c2VXYWxsZXRUb3RhbEJhbGFuY2UoSU1QT1JURURfQUNDT1VOVFNfV0FMTEVUX0lEKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBwdDogMC43NSwgd2lkdGg6IDEgfX0+XG4gICAgICA8V2FsbGV0SGVhZGVyXG4gICAgICAgIG5hbWU9e3QoJ0ltcG9ydGVkJyl9XG4gICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICBoYXNCYWxhbmNlRXJyb3I9e2hhc0Vycm9yT2NjdXJyZWR9XG4gICAgICAgIHRvdGFsQmFsYW5jZT17dG90YWxCYWxhbmNlSW5DdXJyZW5jeX1cbiAgICAgICAgaXNBY3RpdmU9e2lzSW1wb3J0ZWRBY2NvdW50KGFjdGl2ZSl9XG4gICAgICAgIGlzRXhwYW5kZWQ9e2lzRXhwYW5kZWR9XG4gICAgICAgIHRvZ2dsZT17KCkgPT4gc2V0SXNFeHBhbmRlZCgoZSkgPT4gIWUpfVxuICAgICAgLz5cbiAgICAgIDxDb2xsYXBzZSB0aW1lb3V0PXsyMDB9IGluPXtpc0V4cGFuZGVkfT5cbiAgICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxLCBnYXA6IDEsIHB4OiAyIH19PlxuICAgICAgICAgIHthY2NvdW50cy5tYXAoKGFjY291bnQpID0+IChcbiAgICAgICAgICAgIDxBY2NvdW50SXRlbVxuICAgICAgICAgICAgICBrZXk9e2FjY291bnQuaWR9XG4gICAgICAgICAgICAgIGFjY291bnQ9e2FjY291bnR9XG4gICAgICAgICAgICAgIHNlbGVjdGlvbk1vZGU9e1NlbGVjdGlvbk1vZGUuQW55fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvQ29sbGFwc2U+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBTdGFjaywgU3hQcm9wcyB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7XG4gIFByaW1hcnlBY2NvdW50LFxuICBXYWxsZXRJZCxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRQcm92aWRlcic7XG5cbmltcG9ydCB7IFdhbGxldENvbnRhaW5lciB9IGZyb20gJy4vV2FsbGV0Q29udGFpbmVyJztcblxudHlwZSBBY2NvdW50TGlzdFByb3BzID0ge1xuICBwcmltYXJ5QWNjb3VudHM6IFJlY29yZDxXYWxsZXRJZCwgUHJpbWFyeUFjY291bnRbXT47XG4gIHN4PzogU3hQcm9wcztcbn07XG5cbmV4cG9ydCBjb25zdCBBY2NvdW50TGlzdFByaW1hcnkgPSAoe1xuICBwcmltYXJ5QWNjb3VudHMsXG4gIHN4LFxufTogQWNjb3VudExpc3RQcm9wcykgPT4ge1xuICBjb25zdCB7IHdhbGxldERldGFpbHM6IGFjdGl2ZVdhbGxldERldGFpbHMsIHdhbGxldHMgfSA9IHVzZVdhbGxldENvbnRleHQoKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBnYXA6IDEsIHdpZHRoOiAxLCAuLi5zeCB9fT5cbiAgICAgIHtPYmplY3Qua2V5cyhwcmltYXJ5QWNjb3VudHMpLm1hcCgod2FsbGV0SWQpID0+IHtcbiAgICAgICAgY29uc3Qgd2FsbGV0QWNjb3VudHMgPSBwcmltYXJ5QWNjb3VudHNbd2FsbGV0SWRdO1xuICAgICAgICBjb25zdCB3YWxsZXREZXRhaWxzID0gd2FsbGV0cy5maW5kKCh3YWxsZXQpID0+IHdhbGxldC5pZCA9PT0gd2FsbGV0SWQpO1xuXG4gICAgICAgIGlmICghd2FsbGV0RGV0YWlscykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gYWN0aXZlV2FsbGV0RGV0YWlscz8uaWQgPT09IHdhbGxldElkO1xuXG4gICAgICAgIGlmICh3YWxsZXRBY2NvdW50cyAmJiB3YWxsZXRBY2NvdW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxXYWxsZXRDb250YWluZXJcbiAgICAgICAgICAgICAga2V5PXt3YWxsZXRJZH1cbiAgICAgICAgICAgICAgd2FsbGV0RGV0YWlscz17d2FsbGV0RGV0YWlsc31cbiAgICAgICAgICAgICAgaXNBY3RpdmU9e2lzQWN0aXZlfVxuICAgICAgICAgICAgICBhY2NvdW50cz17d2FsbGV0QWNjb3VudHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pfVxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgQm94LFxuICBHcm93LFxuICBJY29uQnV0dG9uLFxuICBQZW5jaWxSb3VuZEljb24sXG4gIFN0YWNrLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgeyB1c2VBY2NvdW50TWFuYWdlciB9IGZyb20gJy4uL3Byb3ZpZGVycy9BY2NvdW50TWFuYWdlclByb3ZpZGVyJztcbmltcG9ydCB7IE92ZXJmbG93aW5nVHlwb2dyYXBoeSB9IGZyb20gJy4vT3ZlcmZsb3dpbmdUeXBvZ3JhcGh5JztcblxuaW50ZXJmYWNlIEFjY291bnROYW1lUHJvcHMge1xuICBhY2NvdW50TmFtZTogc3RyaW5nO1xuICBjYXJkSG92ZXJlZDogYm9vbGVhbjtcbiAgcHJvbXB0UmVuYW1lKCk6IHZvaWQ7XG4gIGlzQWN0aXZlPzogYm9vbGVhbjtcbn1cblxuY29uc3QgY29tbW9uVHJhbnNpdGlvblByb3BzID0ge1xuICB0aW1lb3V0OiAyMDAsXG4gIGVhc2luZzogJ2Vhc2UtaW4tb3V0JyxcbiAgYXBwZWFyOiB0cnVlLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWNjb3VudE5hbWUoe1xuICBhY2NvdW50TmFtZSxcbiAgY2FyZEhvdmVyZWQsXG4gIGlzQWN0aXZlLFxuICBwcm9tcHRSZW5hbWUsXG59OiBBY2NvdW50TmFtZVByb3BzKSB7XG4gIGNvbnN0IHsgaXNNYW5hZ2VNb2RlIH0gPSB1c2VBY2NvdW50TWFuYWdlcigpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIG1pbldpZHRoOiAwLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8Qm94XG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgZmxleFNocmluazogMCxcbiAgICAgICAgICB3aWR0aDogaXNBY3RpdmUgPyA2IDogMCxcbiAgICAgICAgICBoZWlnaHQ6IGlzQWN0aXZlID8gNiA6IDAsXG4gICAgICAgICAgbWFyZ2luUmlnaHQ6IGlzQWN0aXZlID8gMC41IDogMCxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnc3VjY2Vzcy5tYWluJyxcbiAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246ICcyMDBtcycsXG4gICAgICAgICAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiAnZWFzZS1pbi1vdXQnLFxuICAgICAgICAgIHRyYW5zaXRpb25Qcm9wZXJ0eTogJ3dpZHRoLCBoZWlnaHQsIG1hcmdpbi1yaWdodCcsXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICAgPE92ZXJmbG93aW5nVHlwb2dyYXBoeVxuICAgICAgICBkYXRhLXRlc3RpZD1cImFjY291bnQtbmFtZVwiXG4gICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgZm9udFdlaWdodD17NjAwfVxuICAgICAgICBsaW5lSGVpZ2h0PVwiMTZweFwiXG4gICAgICAgIHN4PXt7IG1yOiAxIH19XG4gICAgICA+XG4gICAgICAgIHthY2NvdW50TmFtZX1cbiAgICAgIDwvT3ZlcmZsb3dpbmdUeXBvZ3JhcGh5PlxuICAgICAgPEdyb3cgey4uLmNvbW1vblRyYW5zaXRpb25Qcm9wc30gaW49e2NhcmRIb3ZlcmVkICYmICFpc01hbmFnZU1vZGV9PlxuICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgc3g9e3sgcDogMC4yNSB9fVxuICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgcHJvbXB0UmVuYW1lKCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInJlbmFtZS1hY2NvdW50LWJ0blwiXG4gICAgICAgID5cbiAgICAgICAgICA8UGVuY2lsUm91bmRJY29uIHNpemU9ezE2fSAvPlxuICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICA8L0dyb3c+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQ2hldnJvbkRvd25JY29uLFxuICBDbGlja0F3YXlMaXN0ZW5lcixcbiAgR3JvdyxcbiAgS2V5SWNvbixcbiAgTWVudUl0ZW0sXG4gIE1lbnVMaXN0LFxuICBQb3BwZXIsXG4gIFdhbGxldENvbm5lY3RJY29uLFxuICBzdHlsZWQsXG4gIEZpcmVibG9ja3NJY29uLFxuICBUb29sdGlwLFxuICBMaXN0SWNvbixcbiAgVHlwb2dyYXBoeSxcbiAgTGVkZ2VySWNvbixcbiAgS2V5c3RvcmVJY29uLFxuICBCb3gsXG4gIENoZXZyb25SaWdodEljb24sXG4gIFN0YWNrLFxuICBQbHVzSWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCBicm93c2VyIGZyb20gJ3dlYmV4dGVuc2lvbi1wb2x5ZmlsbCc7XG5cbmltcG9ydCB7IHVzZUZlYXR1cmVGbGFnQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvRmVhdHVyZUZsYWdzUHJvdmlkZXInO1xuaW1wb3J0IHsgRmVhdHVyZUdhdGVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2ZlYXR1cmVGbGFncy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlTmV0d29ya0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL05ldHdvcmtQcm92aWRlcic7XG5pbXBvcnQgeyBpc1Byb2R1Y3Rpb25CdWlsZCB9IGZyb20gJ0BzcmMvdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgQ2hhaW5JZCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtY2hhaW5zLXNkayc7XG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5cbnR5cGUgQWNjb3VudHNBY3Rpb25CdXR0b25Qcm9wcyA9IHtcbiAgaXNMb2FkaW5nOiBib29sZWFuO1xuICBjYW5DcmVhdGVBY2NvdW50OiBib29sZWFuO1xuICBvbkFkZE5ld0FjY291bnQ6ICgpID0+IHZvaWQ7XG59O1xuXG5jb25zdCBNZW51SXRlbUNvbHVtbiA9IHN0eWxlZChTdGFjaylgXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHdpZHRoOiAxMDAlO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZFxuICAgICR7KHsgdGhlbWUsIGhhc05vQm9yZGVyIH0pID0+XG4gICAgICBoYXNOb0JvcmRlciA/ICd0cmFuc3BhcmVudCcgOiB0aGVtZS5wYWxldHRlLmdyZXlbODAwXX07XG4gIHBhZGRpbmctdG9wOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLnNwYWNpbmcoMS41KX07XG4gIHBhZGRpbmctYm90dG9tOiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLnNwYWNpbmcoMS41KX07XG5gO1xuXG5jb25zdCBTdHlsZWRNZW51SXRlbSA9IHN0eWxlZChNZW51SXRlbSlgXG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgcGFkZGluZzogMDtcbiAgd2lkdGg6IDEwMCU7XG5gO1xuXG5jb25zdCBJY29uQ29sdW1uID0gc3R5bGVkKFN0YWNrKWBcbiAgcGFkZGluZy1yaWdodDogJHsoeyB0aGVtZSB9KSA9PiB0aGVtZS5zcGFjaW5nKDIpfTtcbiAgcGFkZGluZy1sZWZ0OiAkeyh7IHRoZW1lIH0pID0+IHRoZW1lLnNwYWNpbmcoMil9O1xuYDtcblxuZXhwb3J0IGNvbnN0IEFjY291bnRzQWN0aW9uQnV0dG9uID0gKHtcbiAgaXNMb2FkaW5nLFxuICBvbkFkZE5ld0FjY291bnQsXG4gIGNhbkNyZWF0ZUFjY291bnQsXG59OiBBY2NvdW50c0FjdGlvbkJ1dHRvblByb3BzKSA9PiB7XG4gIGNvbnN0IFtpc01lbnVPcGVuLCBzZXRJc01lbnVPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcbiAgY29uc3QgdG9nZ2xlQnV0dG9uUmVmID0gdXNlUmVmKCk7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBmZWF0dXJlRmxhZ3MgfSA9IHVzZUZlYXR1cmVGbGFnQ29udGV4dCgpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuXG4gIGNvbnN0IGdvVG9JbXBvcnRTY3JlZW4gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY2FwdHVyZSgnSW1wb3J0UHJpdmF0ZUtleV9DbGlja2VkJyk7XG4gICAgaGlzdG9yeS5wdXNoKCcvaW1wb3J0LXByaXZhdGUta2V5Jyk7XG4gIH0sIFtoaXN0b3J5LCBjYXB0dXJlXSk7XG5cbiAgY29uc3QgZ29Ub0FkZFNlZWRwaHJhc2VTY3JlZW4gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY2FwdHVyZSgnQWRkV2FsbGV0V2l0aFNlZWRwaHJhc2VfQ2xpY2tlZCcpO1xuICAgIGhpc3RvcnkucHVzaCgnL2FjY291bnRzL2FkZC13YWxsZXQvc2VlZHBocmFzZScpO1xuICB9LCBbaGlzdG9yeSwgY2FwdHVyZV0pO1xuXG4gIGNvbnN0IGdvVG9BZGRLZXlzdG9yZUZpbGVTY3JlZW4gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY2FwdHVyZSgnQWRkV2FsbGV0V2l0aEtleXN0b3JlRmlsZV9DbGlja2VkJyk7XG4gICAgaGlzdG9yeS5wdXNoKCcvYWNjb3VudHMvYWRkLXdhbGxldC9rZXlzdG9yZScpO1xuICB9LCBbaGlzdG9yeSwgY2FwdHVyZV0pO1xuXG4gIGNvbnN0IGdvVG9BZGRMZWRnZXJTY3JlZW4gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY2FwdHVyZSgnQWRkV2FsbGV0V2l0aExlZGdlcl9DbGlja2VkJyk7XG5cbiAgICAvLyBPcGVuIGluIGEgZnVsbCBzY3JlZW4gdGFiIHRvIGF2b2lkIHBvcHVwIGhlbGxcbiAgICBicm93c2VyLnRhYnMuY3JlYXRlKHtcbiAgICAgIHVybDogYC9mdWxsc2NyZWVuLmh0bWwjL2FjY291bnRzL2FkZC13YWxsZXQvbGVkZ2VyYCxcbiAgICB9KTtcbiAgfSwgW2NhcHR1cmVdKTtcblxuICBjb25zdCBnb1RvV2FsbGV0Q29ubmVjdFNjcmVlbiA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjYXB0dXJlKCdJbXBvcnRXaXRoV2FsbGV0Q29ubmVjdF9DbGlja2VkJyk7XG4gICAgaGlzdG9yeS5wdXNoKCcvaW1wb3J0LXdpdGgtd2FsbGV0Y29ubmVjdCcpO1xuICB9LCBbaGlzdG9yeSwgY2FwdHVyZV0pO1xuXG4gIGNvbnN0IGdvVG9GaXJlYmxvY2tzV2FsbGV0Q29ubmVjdFNjcmVlbiA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjYXB0dXJlKCdJbXBvcnRXaXRoRmlyZWJsb2Nrc19DbGlja2VkJyk7XG4gICAgaGlzdG9yeS5wdXNoKCcvZmlyZWJsb2Nrcy9pbXBvcnQtd2l0aC13YWxsZXRjb25uZWN0Jyk7XG4gIH0sIFtoaXN0b3J5LCBjYXB0dXJlXSk7XG5cbiAgY29uc3QgZmlyZWJsb2Nrc0Rpc2FibGVkUmVhc29uID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKFxuICAgICAgaXNQcm9kdWN0aW9uQnVpbGQoKSAmJlxuICAgICAgbmV0d29yaz8uY2hhaW5JZCAhPT0gQ2hhaW5JZC5BVkFMQU5DSEVfTUFJTk5FVF9JRFxuICAgICkge1xuICAgICAgcmV0dXJuIHQoXG4gICAgICAgICdQbGVhc2Ugc3dpdGNoIHRvIEF2YWxhbmNoZSBDLUNoYWluIHRvIGltcG9ydCB5b3VyIEZpcmVibG9ja3MgYWNjb3VudC4nLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0sIFt0LCBuZXR3b3JrXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8Q2xpY2tBd2F5TGlzdGVuZXIgb25DbGlja0F3YXk9eygpID0+IHNldElzTWVudU9wZW4oZmFsc2UpfT5cbiAgICAgIDxCb3hcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNNZW51T3Blbigob3BlbikgPT4gIW9wZW4pfVxuICAgICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICAgIGRpc2FibGVkPXtpc0xvYWRpbmd9XG4gICAgICAgICAgZW5kSWNvbj17XG4gICAgICAgICAgICA8Q2hldnJvbkRvd25JY29uXG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSBlYXNlLWluLW91dCAuMTVzJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGlzTWVudU9wZW4gPyAncm90YXRlWCgxODBkZWcpJyA6ICdub25lJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWNjb3VudC1vcHRpb25zXCJcbiAgICAgICAgICBzaXplPVwieGxhcmdlXCJcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgIH19XG4gICAgICAgICAgcmVmPXt0b2dnbGVCdXR0b25SZWZ9XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnQWRkIG9yIENvbm5lY3QgV2FsbGV0Jyl9XG4gICAgICAgIDwvQnV0dG9uPlxuXG4gICAgICAgIDxQb3BwZXJcbiAgICAgICAgICBvcGVuPXtpc01lbnVPcGVufVxuICAgICAgICAgIGFuY2hvckVsPXt0b2dnbGVCdXR0b25SZWYuY3VycmVudH1cbiAgICAgICAgICBwbGFjZW1lbnQ9XCJ0b3AtZW5kXCJcbiAgICAgICAgICB0cmFuc2l0aW9uXG4gICAgICAgID5cbiAgICAgICAgICB7KHsgVHJhbnNpdGlvblByb3BzIH0pID0+IChcbiAgICAgICAgICAgIDxHcm93IHsuLi5UcmFuc2l0aW9uUHJvcHN9IHRpbWVvdXQ9ezI1MH0+XG4gICAgICAgICAgICAgIDxNZW51TGlzdFxuICAgICAgICAgICAgICAgIGRlbnNlXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHA6IDAsXG4gICAgICAgICAgICAgICAgICBweTogMSxcbiAgICAgICAgICAgICAgICAgIG1iOiAyLFxuICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnZ3JleS44NTAnLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6ICczNDNweCcsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0NjhweCcsXG4gICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwcHggNHB4IDI0cHggMHB4IHJnYmEoMCwgMCwgMCwgMC42MCknLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8U3R5bGVkTWVudUl0ZW1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2dvVG9JbXBvcnRTY3JlZW59XG4gICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFkZC1pbXBvcnQtYWNjb3VudFwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPEljb25Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxLZXlJY29uIHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgICAgICAgPC9JY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgPE1lbnVJdGVtQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ0ltcG9ydCBQcml2YXRlIEtleScpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgICAgIDxCb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dCgnSW1wb3J0IGEgc2luZ2xlLWNoYWluIGFjY291bnQnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICAgICAgPEljb25Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25SaWdodEljb24gc2l6ZT17MjR9IHN4PXt7IGNvbG9yOiAnZ3JleS41MDAnIH19IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvSWNvbkNvbHVtbj5cbiAgICAgICAgICAgICAgICAgIDwvTWVudUl0ZW1Db2x1bW4+XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRNZW51SXRlbT5cbiAgICAgICAgICAgICAgICB7ZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5JTVBPUlRfV0FMTEVUX0NPTk5FQ1RdICYmIChcbiAgICAgICAgICAgICAgICAgIDxTdHlsZWRNZW51SXRlbVxuICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImltcG9ydC13YWxsZXQtY29ubmVjdFwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2dvVG9XYWxsZXRDb25uZWN0U2NyZWVufVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8SWNvbkNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgICA8V2FsbGV0Q29ubmVjdEljb24gc2l6ZT17MjR9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvSWNvbkNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPE1lbnVJdGVtQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxCb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdDb25uZWN0IHVzaW5nIFdhbGxldCBDb25uZWN0Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dCgnSW1wb3J0IGFjY291bnQgd2l0aCBXYWxsZXQgQ29ubmVjdCcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgICAgIDxJY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25SaWdodEljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT17MjR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAnZ3JleS41MDAnIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvSWNvbkNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPC9NZW51SXRlbUNvbHVtbj5cbiAgICAgICAgICAgICAgICAgIDwvU3R5bGVkTWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICB7ZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5JTVBPUlRfRklSRUJMT0NLU10gJiYgKFxuICAgICAgICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9e2ZpcmVibG9ja3NEaXNhYmxlZFJlYXNvbn1cbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IGZpcmVibG9ja3NEaXNhYmxlZFJlYXNvblxuICAgICAgICAgICAgICAgICAgICAgICAgPyAnbm90LWFsbG93ZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPFN0eWxlZE1lbnVJdGVtXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJpbXBvcnQtd2FsbGV0LWNvbm5lY3RcIlxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2dvVG9GaXJlYmxvY2tzV2FsbGV0Q29ubmVjdFNjcmVlbn1cbiAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihmaXJlYmxvY2tzRGlzYWJsZWRSZWFzb24pfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPEljb25Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8RmlyZWJsb2Nrc0ljb24gc2l6ZT17MjR9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9JY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbUNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdJbXBvcnQgRmlyZWJsb2NrcyBBY2NvdW50Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ1VzZSBGaXJlYmxvY2tzIGFwcGxpY2F0aW9uJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICAgICAgICA8SWNvbkNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25SaWdodEljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPXsyNH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBjb2xvcjogJ2dyZXkuNTAwJyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9JY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICAgIDwvTWVudUl0ZW1Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDwvU3R5bGVkTWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgIHtmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLkFERF9XQUxMRVRfV0lUSF9TRUVEUEhSQVNFXSAmJiAoXG4gICAgICAgICAgICAgICAgICA8U3R5bGVkTWVudUl0ZW1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17Z29Ub0FkZFNlZWRwaHJhc2VTY3JlZW59XG4gICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWRkLXdhbGxldC1zZWVkLXBocmFzZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxJY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICAgIDxMaXN0SWNvbiBzaXplPXsyNH0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9JY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8TWVudUl0ZW1Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ0ltcG9ydCBSZWNvdmVyeSBQaHJhc2UnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdJbXBvcnQgYWNjb3VudHMgZnJvbSBhbm90aGVyIHdhbGxldCcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgICAgIDxJY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25SaWdodEljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZT17MjR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiAnZ3JleS41MDAnIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvSWNvbkNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPC9NZW51SXRlbUNvbHVtbj5cbiAgICAgICAgICAgICAgICAgIDwvU3R5bGVkTWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICB7ZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5BRERfV0FMTEVUX1dJVEhfTEVER0VSXSAmJiAoXG4gICAgICAgICAgICAgICAgICA8U3R5bGVkTWVudUl0ZW1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17Z29Ub0FkZExlZGdlclNjcmVlbn1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhZGQtd2FsbGV0LWxlZGdlclwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxJY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICAgIDxMZWRnZXJJY29uIHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgICAgICAgICA8L0ljb25Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbUNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dCgnSW1wb3J0IExlZGdlciBXYWxsZXQnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdVc2UgeW91ciBMZWRnZXIgaGFyZHdhcmUgd2FsbGV0Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICAgICAgPEljb25Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2hldnJvblJpZ2h0SWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPXsyNH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICdncmV5LjUwMCcgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9JY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8L01lbnVJdGVtQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgPC9TdHlsZWRNZW51SXRlbT5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHtmZWF0dXJlRmxhZ3NbRmVhdHVyZUdhdGVzLkFERF9XQUxMRVRfV0lUSF9LRVlTVE9SRV9GSUxFXSAmJiAoXG4gICAgICAgICAgICAgICAgICA8U3R5bGVkTWVudUl0ZW1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17Z29Ub0FkZEtleXN0b3JlRmlsZVNjcmVlbn1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhZGQtd2FsbGV0LWtleXN0b3JlLWZpbGVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8SWNvbkNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgICA8S2V5c3RvcmVJY29uIHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgICAgICAgICA8L0ljb25Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbUNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dCgnSW1wb3J0IEtleXN0b3JlIEZpbGUnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdVc2UgYSBrZXlzdG9yZSBmcm9tIHRoZSBBdmFsYW5jaGUgV2FsbGV0Jyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICAgICAgPEljb25Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2hldnJvblJpZ2h0SWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPXsyNH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6ICdncmV5LjUwMCcgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9JY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8L01lbnVJdGVtQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgPC9TdHlsZWRNZW51SXRlbT5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHtjYW5DcmVhdGVBY2NvdW50ICYmIChcbiAgICAgICAgICAgICAgICAgIDxTdHlsZWRNZW51SXRlbVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgb25BZGROZXdBY2NvdW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0SXNNZW51T3BlbihmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXsnYWRkLXByaW1hcnktYWNjb3VudCd9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxJY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICAgIDxQbHVzSWNvbiBzaXplPXsyNH0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9JY29uQ29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8TWVudUl0ZW1Db2x1bW4gaGFzTm9Cb3JkZXI+XG4gICAgICAgICAgICAgICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ0NyZWF0ZSBOZXcgQWNjb3VudCAnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdBZGQgYSBuZXcgYWNjb3VudCB0byB5b3VyIGFjdGl2ZSB3YWxsZXQnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICAgICAgICA8SWNvbkNvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaGV2cm9uUmlnaHRJY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU9ezI0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBjb2xvcjogJ2dyZXkuNTAwJyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L0ljb25Db2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDwvTWVudUl0ZW1Db2x1bW4+XG4gICAgICAgICAgICAgICAgICA8L1N0eWxlZE1lbnVJdGVtPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvTWVudUxpc3Q+XG4gICAgICAgICAgICA8L0dyb3c+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9Qb3BwZXI+XG4gICAgICA8L0JveD5cbiAgICA8L0NsaWNrQXdheUxpc3RlbmVyPlxuICApO1xufTtcbiIsImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDb2xsYXBzZSxcbiAgR3JvdyxcbiAgT3V0Ym91bmRJY29uLFxuICBTdGFjayxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7IFNlY3JldFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VjcmV0cy9tb2RlbHMnO1xuaW1wb3J0IHsgV2FsbGV0RGV0YWlscyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvbW9kZWxzJztcbmltcG9ydCB7IFByaW1hcnlBY2NvdW50IH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcblxuaW1wb3J0IHsgdXNlV2FsbGV0VG90YWxCYWxhbmNlIH0gZnJvbSAnLi4vaG9va3MvdXNlV2FsbGV0VG90YWxCYWxhbmNlJztcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGUgfSBmcm9tICcuLi9wcm92aWRlcnMvQWNjb3VudE1hbmFnZXJQcm92aWRlcic7XG5pbXBvcnQgeyBBY2NvdW50SXRlbSB9IGZyb20gJy4vQWNjb3VudEl0ZW0nO1xuaW1wb3J0IFdhbGxldEhlYWRlciBmcm9tICcuL1dhbGxldEhlYWRlcic7XG5cbmV4cG9ydCBjb25zdCBXYWxsZXRDb250YWluZXIgPSAoe1xuICB3YWxsZXREZXRhaWxzLFxuICBpc0FjdGl2ZSxcbiAgYWNjb3VudHMsXG59OiB7XG4gIGFjdGl2ZUFjY291bnRJZD86IHN0cmluZztcbiAgd2FsbGV0RGV0YWlsczogV2FsbGV0RGV0YWlscztcbiAgaXNBY3RpdmU6IGJvb2xlYW47XG4gIGFjY291bnRzOiBQcmltYXJ5QWNjb3VudFtdO1xufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgaXNEZXZlbG9wZXJNb2RlIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCBbaXNFeHBhbmRlZCwgc2V0SXNFeHBhbmRlZF0gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3Qge1xuICAgIGlzTG9hZGluZyxcbiAgICBoYXNFcnJvck9jY3VycmVkLFxuICAgIHRvdGFsQmFsYW5jZUluQ3VycmVuY3ksXG4gICAgaGFzQmFsYW5jZU9uVW5kZXJpdmVkQWNjb3VudHMsXG4gIH0gPSB1c2VXYWxsZXRUb3RhbEJhbGFuY2Uod2FsbGV0RGV0YWlscy5pZCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgcHQ6IDAuNzUsIHdpZHRoOiAxIH19PlxuICAgICAgPFdhbGxldEhlYWRlclxuICAgICAgICB3YWxsZXREZXRhaWxzPXt3YWxsZXREZXRhaWxzfVxuICAgICAgICBpc0FjdGl2ZT17aXNBY3RpdmV9XG4gICAgICAgIGlzRXhwYW5kZWQ9e2lzRXhwYW5kZWR9XG4gICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICBoYXNCYWxhbmNlRXJyb3I9e2hhc0Vycm9yT2NjdXJyZWR9XG4gICAgICAgIHRvdGFsQmFsYW5jZT17dG90YWxCYWxhbmNlSW5DdXJyZW5jeX1cbiAgICAgICAgdG9nZ2xlPXsoKSA9PiBzZXRJc0V4cGFuZGVkKChlKSA9PiAhZSl9XG4gICAgICAvPlxuICAgICAgPENvbGxhcHNlIHRpbWVvdXQ9ezIwMH0gaW49e2lzRXhwYW5kZWR9PlxuICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIGdhcDogMSwgcHg6IDIgfX0+XG4gICAgICAgICAge2FjY291bnRzLm1hcCgoYWNjb3VudCkgPT4gKFxuICAgICAgICAgICAgPEFjY291bnRJdGVtXG4gICAgICAgICAgICAgIGtleT17YWNjb3VudC5pZH1cbiAgICAgICAgICAgICAgYWNjb3VudD17YWNjb3VudH1cbiAgICAgICAgICAgICAgc2VsZWN0aW9uTW9kZT17XG4gICAgICAgICAgICAgICAgd2FsbGV0RGV0YWlscy50eXBlID09PSBTZWNyZXRUeXBlLlNlZWRsZXNzXG4gICAgICAgICAgICAgICAgICA/IFNlbGVjdGlvbk1vZGUuTm9uZVxuICAgICAgICAgICAgICAgICAgOiBTZWxlY3Rpb25Nb2RlLkNvbnNlY3V0aXZlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgd2FsbGV0VHlwZT17d2FsbGV0RGV0YWlscz8udHlwZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDxHcm93IGluPXtpc0FjdGl2ZSAmJiBoYXNCYWxhbmNlT25VbmRlcml2ZWRBY2NvdW50c30+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsXG4gICAgICAgICAgICAgIHB4OiAyLFxuICAgICAgICAgICAgICBtdDogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihcbiAgICAgICAgICAgICAgICAgIGBodHRwczovLyR7XG4gICAgICAgICAgICAgICAgICAgIGlzRGV2ZWxvcGVyTW9kZSA/ICd0ZXN0LicgOiAnJ1xuICAgICAgICAgICAgICAgICAgfWNvcmUuYXBwL3Rvb2xzL3V0eG8tbWFuYWdlcmAsXG4gICAgICAgICAgICAgICAgICAnX2JsYW5rJyxcbiAgICAgICAgICAgICAgICAgICdub3JlZmVycmVyJyxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBlbmRJY29uPXs8T3V0Ym91bmRJY29uIC8+fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnVmlldyBQLUNoYWluIERldGFpbHMnKX1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvR3Jvdz5cbiAgICAgIDwvQ29sbGFwc2U+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIENoZXZyb25VcEljb24sXG4gIENoaXAsXG4gIEdyb3csXG4gIEljb25CdXR0b24sXG4gIExlZGdlckljb24sXG4gIExvYWRpbmdEb3RzSWNvbixcbiAgUGVuY2lsUm91bmRJY29uLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5cbmltcG9ydCB7IFNlY3JldFR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VjcmV0cy9tb2RlbHMnO1xuaW1wb3J0IHsgV2FsbGV0RGV0YWlscyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvbW9kZWxzJztcblxuaW1wb3J0IHsgdXNlQWNjb3VudE1hbmFnZXIgfSBmcm9tICcuLi9wcm92aWRlcnMvQWNjb3VudE1hbmFnZXJQcm92aWRlcic7XG5pbXBvcnQgeyBPdmVyZmxvd2luZ1R5cG9ncmFwaHkgfSBmcm9tICcuL092ZXJmbG93aW5nVHlwb2dyYXBoeSc7XG5pbXBvcnQgeyB1c2VXYWxsZXRSZW5hbWUgfSBmcm9tICcuLi9ob29rcy91c2VXYWxsZXRSZW5hbWUnO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcblxuY29uc3QgY29tbW9uVHJhbnNpdGlvblByb3BzID0ge1xuICB0aW1lb3V0OiAyMDAsXG4gIGVhc2luZzogJ2Vhc2UtaW4tb3V0JyxcbiAgYXBwZWFyOiB0cnVlLFxufTtcbnR5cGUgV2FsbGV0SGVhZGVyUHJvcHMgPSB7XG4gIGlzQWN0aXZlOiBib29sZWFuO1xuICBpc0V4cGFuZGVkOiBib29sZWFuO1xuICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gIHRvdGFsQmFsYW5jZT86IG51bWJlcjtcbiAgaGFzQmFsYW5jZUVycm9yOiBib29sZWFuO1xuICB0b2dnbGU6ICgpID0+IHZvaWQ7XG59ICYgKFxuICB8IHtcbiAgICAgIHdhbGxldERldGFpbHM6IFdhbGxldERldGFpbHM7XG4gICAgICBuYW1lPzogbmV2ZXI7XG4gICAgfVxuICB8IHsgbmFtZTogc3RyaW5nOyB3YWxsZXREZXRhaWxzPzogbmV2ZXIgfVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gV2FsbGV0SGVhZGVyKHtcbiAgd2FsbGV0RGV0YWlscyxcbiAgbmFtZSxcbiAgaXNBY3RpdmUsXG4gIGlzRXhwYW5kZWQsXG4gIGlzTG9hZGluZyxcbiAgdG90YWxCYWxhbmNlLFxuICB0b2dnbGUsXG59OiBXYWxsZXRIZWFkZXJQcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgaXNNYW5hZ2VNb2RlIH0gPSB1c2VBY2NvdW50TWFuYWdlcigpO1xuICBjb25zdCB7IGN1cnJlbmN5Rm9ybWF0dGVyIH0gPSB1c2VTZXR0aW5nc0NvbnRleHQoKTtcbiAgY29uc3QgW2lzSG92ZXJlZCwgc2V0SXNIb3ZlcmVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCB7IHByb21wdDogcHJvbXB0UmVuYW1lLCByZW5kZXJEaWFsb2c6IHJlbmFtZURpYWxvZyB9ID1cbiAgICB1c2VXYWxsZXRSZW5hbWUod2FsbGV0RGV0YWlscyk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIHN4PXt7XG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgcGw6IDIsXG4gICAgICAgIHByOiAxLFxuICAgICAgICBweTogMSxcbiAgICAgICAgZ2FwOiAyLFxuICAgICAgfX1cbiAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SXNIb3ZlcmVkKHRydWUpfVxuICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRJc0hvdmVyZWQoZmFsc2UpfVxuICAgID5cbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICBtaW5XaWR0aDogMCxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgeyh3YWxsZXREZXRhaWxzPy50eXBlID09PSBTZWNyZXRUeXBlLkxlZGdlciB8fFxuICAgICAgICAgIHdhbGxldERldGFpbHM/LnR5cGUgPT0gU2VjcmV0VHlwZS5MZWRnZXJMaXZlKSAmJiAoXG4gICAgICAgICAgPExlZGdlckljb24gc2l6ZT17MTZ9IC8+XG4gICAgICAgICl9XG4gICAgICAgIDxPdmVyZmxvd2luZ1R5cG9ncmFwaHlcbiAgICAgICAgICB2YXJpYW50PVwiaDZcIlxuICAgICAgICAgIGZvbnRTaXplPXsxNH1cbiAgICAgICAgICBmb250V2VpZ2h0PXs2MDB9XG4gICAgICAgICAgbGluZUhlaWdodD1cIjE2cHhcIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwid2FsbGV0LW5hbWVcIlxuICAgICAgICA+XG4gICAgICAgICAge3dhbGxldERldGFpbHM/Lm5hbWUgPz8gbmFtZX1cbiAgICAgICAgPC9PdmVyZmxvd2luZ1R5cG9ncmFwaHk+XG4gICAgICAgIDxHcm93IGluPXtpc0FjdGl2ZX0gdW5tb3VudE9uRXhpdD5cbiAgICAgICAgICA8Q2hpcFxuICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgIHN4PXt7IGZvbnRTaXplOiAxMCwgaGVpZ2h0OiAxNiB9fVxuICAgICAgICAgICAgY29sb3I9XCJzdWNjZXNzXCJcbiAgICAgICAgICAgIGxhYmVsPXt0KCdBY3RpdmUnKX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwid2FsbGV0LWFjdGl2ZS1jaGlwXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L0dyb3c+XG4gICAgICAgIHsvKiBTZWN0aW9uIGZvciB0aGUgaW1wb3J0ZWQgYWNjb3VudHMgaGFzIG5vIFdhbGxldERldGFpbHMsIHRoZXJlZm9yZSBjYW5ub3QgYmUgcmVuYW1lZCAqL31cbiAgICAgICAge3dhbGxldERldGFpbHMgJiYgKFxuICAgICAgICAgIDxHcm93IHsuLi5jb21tb25UcmFuc2l0aW9uUHJvcHN9IGluPXtpc0hvdmVyZWQgJiYgIWlzTWFuYWdlTW9kZX0+XG4gICAgICAgICAgICA8SWNvbkJ1dHRvbiBzaXplPVwic21hbGxcIiBvbkNsaWNrPXtwcm9tcHRSZW5hbWV9PlxuICAgICAgICAgICAgICA8UGVuY2lsUm91bmRJY29uIHNpemU9ezE2fSAvPlxuICAgICAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgICAgIDwvR3Jvdz5cbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG5cbiAgICAgIDxTdGFjayBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogMC41IH19PlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICBmb250V2VpZ2h0PXs1MDB9XG4gICAgICAgICAgZm9udFNpemU9ezE0fVxuICAgICAgICAgIHRleHRBbGlnbj1cImVuZFwiXG4gICAgICAgICAgY29sb3I9XCJ0ZXh0LnNlY29uZGFyeVwiXG4gICAgICAgID5cbiAgICAgICAgICB7aXNMb2FkaW5nID8gKFxuICAgICAgICAgICAgPExvYWRpbmdEb3RzSWNvbiBzaXplPXsyMH0gb3JpZW50YXRpb249XCJob3Jpem9udGFsXCIgLz5cbiAgICAgICAgICApIDogdHlwZW9mIHRvdGFsQmFsYW5jZSA9PT0gJ251bWJlcicgPyAoXG4gICAgICAgICAgICBjdXJyZW5jeUZvcm1hdHRlcih0b3RhbEJhbGFuY2UpXG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPEljb25CdXR0b24gc2l6ZT1cInNtYWxsXCIgb25DbGljaz17dG9nZ2xlfT5cbiAgICAgICAgICA8Q2hldnJvblVwSWNvblxuICAgICAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIC4ycyBlYXNlLWluLW91dCcsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogaXNFeHBhbmRlZCA/ICdyb3RhdGVYKDBkZWcpJyA6ICdyb3RhdGVYKDE4MGRlZyknLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICA8L1N0YWNrPlxuICAgICAge3dhbGxldERldGFpbHMgJiYgcmVuYW1lRGlhbG9nKCl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuaW1wb3J0IHsgdXNlU2NvcGVkVG9hc3QgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVNjb3BlZFRvYXN0JztcbmltcG9ydCB7IHVzZVdhbGxldENvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1dhbGxldFByb3ZpZGVyJztcbmltcG9ydCB7IFdhbGxldERldGFpbHMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L21vZGVscyc7XG5cbmltcG9ydCB7IHVzZUVudGl0eVJlbmFtZSB9IGZyb20gJy4vdXNlRW50aXR5UmVuYW1lJztcblxuZXhwb3J0IGNvbnN0IHVzZVdhbGxldFJlbmFtZSA9ICh3YWxsZXQ/OiBXYWxsZXREZXRhaWxzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyByZW5hbWVXYWxsZXQgfSA9IHVzZVdhbGxldENvbnRleHQoKTtcbiAgY29uc3QgdG9hc3QgPSB1c2VTY29wZWRUb2FzdCgnYWNjb3VudC1zd2l0Y2hlcicpO1xuXG4gIGNvbnN0IG9uRmFpbHVyZSA9IHVzZUNhbGxiYWNrKFxuICAgICgpID0+IHRvYXN0LnN1Y2Nlc3ModCgnUmVuYW1pbmcgZmFpbGVkJyksIHsgZHVyYXRpb246IDEwMDAgfSksXG4gICAgW3RvYXN0LCB0XSxcbiAgKTtcbiAgY29uc3Qgb25TdWNjZXNzID0gdXNlQ2FsbGJhY2soXG4gICAgKCkgPT4gdG9hc3Quc3VjY2Vzcyh0KCdXYWxsZXQgcmVuYW1lZCcpLCB7IGR1cmF0aW9uOiAxMDAwIH0pLFxuICAgIFt0b2FzdCwgdF0sXG4gICk7XG4gIGNvbnN0IHVwZGF0ZUZuID0gdXNlQ2FsbGJhY2soXG4gICAgKG5ld05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCF3YWxsZXQ/LmlkKSB7XG4gICAgICAgIHRvYXN0LmVycm9yKHQoJ1RoaXMgd2FsbGV0IGNhbm5vdCBiZSByZW5hbWVkJyksIHsgZHVyYXRpb246IDEwMDAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlbmFtZVdhbGxldCh3YWxsZXQuaWQsIG5ld05hbWUudHJpbSgpKTtcbiAgICB9LFxuICAgIFtyZW5hbWVXYWxsZXQsIHdhbGxldD8uaWQsIHQsIHRvYXN0XSxcbiAgKTtcblxuICByZXR1cm4gdXNlRW50aXR5UmVuYW1lKHtcbiAgICBjdXJyZW50TmFtZTogd2FsbGV0Py5uYW1lID8/ICcnLFxuICAgIGRpYWxvZ1RpdGxlOiB0KCdSZW5hbWUgV2FsbGV0JyksXG4gICAgdXBkYXRlRm4sXG4gICAgb25GYWlsdXJlLFxuICAgIG9uU3VjY2VzcyxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHtcbiAgV2FsbGV0VG90YWxCYWxhbmNlU3RhdGUsXG4gIHVzZVdhbGxldFRvdGFsQmFsYW5jZUNvbnRleHQsXG59IGZyb20gJy4uL3Byb3ZpZGVycy9XYWxsZXRUb3RhbEJhbGFuY2VQcm92aWRlcic7XG5cbmV4cG9ydCBjb25zdCB1c2VXYWxsZXRUb3RhbEJhbGFuY2UgPSAod2FsbGV0SWQ/OiBzdHJpbmcpID0+IHtcbiAgY29uc3QgeyB3YWxsZXRCYWxhbmNlcyB9ID0gdXNlV2FsbGV0VG90YWxCYWxhbmNlQ29udGV4dCgpO1xuXG4gIHJldHVybiB1c2VNZW1vKFxuICAgICgpOiBXYWxsZXRUb3RhbEJhbGFuY2VTdGF0ZSA9PlxuICAgICAgKHdhbGxldElkICYmIHdhbGxldEJhbGFuY2VzW3dhbGxldElkXSkgfHwge1xuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICBoYXNFcnJvck9jY3VycmVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgW3dhbGxldEJhbGFuY2VzLCB3YWxsZXRJZF0sXG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgY3JlYXRlQ29udGV4dCxcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUNvbnRleHQsXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlU3RhdGUsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIElNUE9SVEVEX0FDQ09VTlRTX1dBTExFVF9JRCxcbiAgVG90YWxCYWxhbmNlRm9yV2FsbGV0LFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvaGFuZGxlcnMvZ2V0VG90YWxCYWxhbmNlRm9yV2FsbGV0L21vZGVscyc7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7IEdldFRvdGFsQmFsYW5jZUZvcldhbGxldEhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvaGFuZGxlcnMvZ2V0VG90YWxCYWxhbmNlRm9yV2FsbGV0JztcbmltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuXG5pbnRlcmZhY2UgV2FsbGV0VG90YWxCYWxhbmNlQ29udGV4dFByb3BzIHtcbiAgY2hpbGRyZW4/OiBSZWFjdC5SZWFjdE5vZGU7XG59XG5cbmV4cG9ydCB0eXBlIFdhbGxldFRvdGFsQmFsYW5jZVN0YXRlID0gUGFydGlhbDxUb3RhbEJhbGFuY2VGb3JXYWxsZXQ+ICYge1xuICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gIGhhc0Vycm9yT2NjdXJyZWQ6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgY29uc3QgV2FsbGV0VG90YWxCYWxhbmNlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8e1xuICBmZXRjaEJhbGFuY2VGb3JXYWxsZXQod2FsbGV0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG4gIHdhbGxldEJhbGFuY2VzOiBSZWNvcmQ8c3RyaW5nLCBXYWxsZXRUb3RhbEJhbGFuY2VTdGF0ZT47XG59Pih7XG4gIHdhbGxldEJhbGFuY2VzOiB7fSxcbiAgZmV0Y2hCYWxhbmNlRm9yV2FsbGV0OiAoKSA9PiBQcm9taXNlLnJlc29sdmUoKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgV2FsbGV0VG90YWxCYWxhbmNlUHJvdmlkZXIgPSAoe1xuICBjaGlsZHJlbixcbn06IFdhbGxldFRvdGFsQmFsYW5jZUNvbnRleHRQcm9wcykgPT4ge1xuICBjb25zdCB7XG4gICAgYWNjb3VudHM6IHsgaW1wb3J0ZWQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IHdhbGxldHMgfSA9IHVzZVdhbGxldENvbnRleHQoKTtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuXG4gIGNvbnN0IGhhc0ltcG9ydGVkQWNjb3VudHMgPSB1c2VNZW1vKFxuICAgICgpID0+IE9iamVjdC5rZXlzKGltcG9ydGVkKS5sZW5ndGggPiAwLFxuICAgIFtpbXBvcnRlZF0sXG4gICk7XG5cbiAgY29uc3QgW3dhbGxldEJhbGFuY2VzLCBzZXRXYWxsZXRCYWxhbmNlc10gPSB1c2VTdGF0ZTxcbiAgICBSZWNvcmQ8c3RyaW5nLCBXYWxsZXRUb3RhbEJhbGFuY2VTdGF0ZT5cbiAgPih7fSk7XG5cbiAgY29uc3QgZmV0Y2hCYWxhbmNlRm9yV2FsbGV0ID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHdhbGxldElkOiBzdHJpbmcpID0+IHtcbiAgICAgIHNldFdhbGxldEJhbGFuY2VzKChwcmV2U3RhdGUpID0+ICh7XG4gICAgICAgIC4uLnByZXZTdGF0ZSxcbiAgICAgICAgW3dhbGxldElkXToge1xuICAgICAgICAgIC4uLnByZXZTdGF0ZVt3YWxsZXRJZF0sXG4gICAgICAgICAgaGFzRXJyb3JPY2N1cnJlZDogZmFsc2UsXG4gICAgICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuXG4gICAgICByZXF1ZXN0PEdldFRvdGFsQmFsYW5jZUZvcldhbGxldEhhbmRsZXI+KHtcbiAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LkJBTEFOQ0VTX0dFVF9UT1RBTF9GT1JfV0FMTEVULFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICB3YWxsZXRJZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKCh3YWxsZXRCYWxhbmNlSW5mbykgPT4ge1xuICAgICAgICAgIHNldFdhbGxldEJhbGFuY2VzKChwcmV2U3RhdGUpID0+ICh7XG4gICAgICAgICAgICAuLi5wcmV2U3RhdGUsXG4gICAgICAgICAgICBbd2FsbGV0SWRdOiB7XG4gICAgICAgICAgICAgIC4uLndhbGxldEJhbGFuY2VJbmZvLFxuICAgICAgICAgICAgICBoYXNFcnJvck9jY3VycmVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBmZXRjaGluZyB0b3RhbCBiYWxhbmNlIGZvciB3YWxsZXQnLCBlcnIpO1xuICAgICAgICAgIHNldFdhbGxldEJhbGFuY2VzKChwcmV2U3RhdGUpID0+ICh7XG4gICAgICAgICAgICAuLi5wcmV2U3RhdGUsXG4gICAgICAgICAgICBbd2FsbGV0SWRdOiB7XG4gICAgICAgICAgICAgIC4uLnByZXZTdGF0ZVt3YWxsZXRJZF0sXG4gICAgICAgICAgICAgIGhhc0Vycm9yT2NjdXJyZWQ6IHRydWUsXG4gICAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBbcmVxdWVzdF0sXG4gICk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBmZXRjaFdhbGxldEJhbGFuY2VzU2VxdWVudGlhbGx5ID0gYXN5bmMgKHdhbGxldElkczogc3RyaW5nW10pID0+IHtcbiAgICAgIGZvciAoY29uc3Qgd2FsbGV0SWQgb2Ygd2FsbGV0SWRzKSB7XG4gICAgICAgIGF3YWl0IGZldGNoQmFsYW5jZUZvcldhbGxldCh3YWxsZXRJZCk7XG4gICAgICAgIGlmICghaXNNb3VudGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHdhbGxldElkcyA9IFtcbiAgICAgIC4uLndhbGxldHMubWFwKCh7IGlkIH0pID0+IGlkKSxcbiAgICAgIGhhc0ltcG9ydGVkQWNjb3VudHMgPyBJTVBPUlRFRF9BQ0NPVU5UU19XQUxMRVRfSUQgOiB1bmRlZmluZWQsXG4gICAgXS5maWx0ZXIoaXNTdHJpbmcpO1xuXG4gICAgZmV0Y2hXYWxsZXRCYWxhbmNlc1NlcXVlbnRpYWxseSh3YWxsZXRJZHMpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlzTW91bnRlZCA9IGZhbHNlO1xuICAgIH07XG4gIH0sIFt3YWxsZXRzLCBoYXNJbXBvcnRlZEFjY291bnRzLCBmZXRjaEJhbGFuY2VGb3JXYWxsZXRdKTtcblxuICByZXR1cm4gKFxuICAgIDxXYWxsZXRUb3RhbEJhbGFuY2VDb250ZXh0LlByb3ZpZGVyXG4gICAgICB2YWx1ZT17e1xuICAgICAgICB3YWxsZXRCYWxhbmNlcyxcbiAgICAgICAgZmV0Y2hCYWxhbmNlRm9yV2FsbGV0LFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9XYWxsZXRUb3RhbEJhbGFuY2VDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdhbGxldFRvdGFsQmFsYW5jZUNvbnRleHQoKSB7XG4gIHJldHVybiB1c2VDb250ZXh0KFdhbGxldFRvdGFsQmFsYW5jZUNvbnRleHQpO1xufVxuIiwiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIERpdmlkZXIsXG4gIFR5cG9ncmFwaHksXG4gIEJveCxcbiAgU3RhY2ssXG4gIENpcmN1bGFyUHJvZ3Jlc3MsXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdHJ1bmNhdGVBZGRyZXNzIH0gZnJvbSAnQHNyYy91dGlscy90cnVuY2F0ZUFkZHJlc3MnO1xuXG5pbnRlcmZhY2UgTGVkZ2VyQXBwcm92YWxEaWFsb2dQcm9wcyB7XG4gIGFkZHJlc3M/OiBzdHJpbmc7XG4gIGFtb3VudD86IHN0cmluZztcbiAgc3ltYm9sPzogc3RyaW5nO1xuICBmZWU/OiBzdHJpbmc7XG4gIGZlZVN5bWJvbD86IHN0cmluZztcbiAgaGVhZGVyPzogc3RyaW5nO1xuICBuZnROYW1lPzogc3RyaW5nO1xuICBjdXJyZW50U2lnbmF0dXJlPzogbnVtYmVyO1xuICByZXF1aXJlZFNpZ25hdHVyZXM/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBMZWRnZXJBcHByb3ZhbERpYWxvZyh7XG4gIGFkZHJlc3MsXG4gIGFtb3VudCxcbiAgc3ltYm9sLFxuICBmZWUsXG4gIGZlZVN5bWJvbCxcbiAgaGVhZGVyLFxuICBuZnROYW1lLFxuICBjdXJyZW50U2lnbmF0dXJlLFxuICByZXF1aXJlZFNpZ25hdHVyZXMsXG59OiBMZWRnZXJBcHByb3ZhbERpYWxvZ1Byb3BzKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB0aXRsZSA9IGhlYWRlciA/PyB0KCdBcHByb3ZlIG9uIHlvdXIgTGVkZ2VyJyk7XG5cbiAgY29uc3QgaGFzU2lnbmF0dXJlc0luZm8gPVxuICAgIHR5cGVvZiByZXF1aXJlZFNpZ25hdHVyZXMgPT09ICdudW1iZXInICYmXG4gICAgdHlwZW9mIGN1cnJlbnRTaWduYXR1cmUgPT09ICdudW1iZXInO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzMzN3B4JyxcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIHA6IDIsXG4gICAgICAgIGJvcmRlclJhZGl1czogMixcbiAgICAgICAgYmFja2dyb3VuZDogdGhlbWUucGFsZXR0ZS5iYWNrZ3JvdW5kLnBhcGVyLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIiBzeD17eyBtYjogMiB9fT5cbiAgICAgICAge3RpdGxlfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPEJveCBzeD17eyB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgICB7YWRkcmVzcyAmJiAoXG4gICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgbWFyZ2luPVwiMCAwIDRweCAwXCJcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnRleHQuc2Vjb25kYXJ5IH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dCgnVG8nKX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIj5cbiAgICAgICAgICAgICAgICB7dHJ1bmNhdGVBZGRyZXNzKGFkZHJlc3MsIDEyKX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxEaXZpZGVyIHN4PXt7IG15OiAyIH19IC8+XG4gICAgICAgICAge2Ftb3VudCAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICBtYXJnaW49XCIwIDAgNHB4IDBcIlxuICAgICAgICAgICAgICAgICAgc3g9e3sgY29sb3I6IHRoZW1lLnBhbGV0dGUudGV4dC5zZWNvbmRhcnkgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dCgnQW1vdW50Jyl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MVwiPlxuICAgICAgICAgICAgICAgICAge2Ftb3VudH0ge3N5bWJvbH1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDxEaXZpZGVyIHN4PXt7IG15OiAyIH19IC8+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtmZWUgJiYgKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgICAgICAgbWFyZ2luPVwiMCAwIDRweCAwXCJcbiAgICAgICAgICAgICAgICAgIHN4PXt7IGNvbG9yOiB0aGVtZS5wYWxldHRlLnRleHQuc2Vjb25kYXJ5IH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3QoJ0ZlZScpfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIj5cbiAgICAgICAgICAgICAgICAgIHtmZWV9IHtmZWVTeW1ib2x9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8RGl2aWRlciBzeD17eyBteTogMiB9fSAvPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7bmZ0TmFtZSAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8U3RhY2s+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgbWFyZ2luPVwiMCAwIDRweCAwXCI+XG4gICAgICAgICAgICAgICAgICB7dCgnQ29sbGVjdGlibGUnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCI+e25mdE5hbWV9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICA8RGl2aWRlciBzeD17eyBteTogMiB9fSAvPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7aGFzU2lnbmF0dXJlc0luZm8gJiYgKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPFN0YWNrPlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIG1hcmdpbj1cIjAgMCA0cHggMFwiPlxuICAgICAgICAgICAgICAgICAge3QoJ0N1cnJlbnQgc2lnbmF0dXJlJyl9XG4gICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MVwiPlxuICAgICAgICAgICAgICAgICAge3QoJ3t7Y3VycmVudH19IG91dCBvZiB7e3RvdGFsfX0nLCB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGN1cnJlbnRTaWduYXR1cmUsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiByZXF1aXJlZFNpZ25hdHVyZXMsXG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDxEaXZpZGVyIHN4PXt7IG15OiAyIH19IC8+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIG1hcmdpbj1cIjAgMCA0cHggMFwiPlxuICAgICAgICAgICAgICB7dCgnU3RhdHVzJyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8U3RhY2sgc3g9e3sgbXQ6IDEsIGZsZXhEaXJlY3Rpb246ICdyb3cnLCBnYXA6IDEgfX0+XG4gICAgICAgICAgICAgIDxDaXJjdWxhclByb2dyZXNzIHNpemU9ezI0fSAvPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9Cb3g+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJJVEVSQVRJT05fTElNSVQiLCJBRERSRVNTX0dBUF9MSU1JVCIsIkdMQUNJRVJfQUREUkVTU19GRVRDSF9MSU1JVCIsIklNUE9SVEVEX0FDQ09VTlRTX1dBTExFVF9JRCIsImlzSW1wb3J0ZWRBY2NvdW50c1JlcXVlc3QiLCJ3YWxsZXRJZCIsInVzZUJhbGFuY2VzQ29udGV4dCIsInVzZU1lbW8iLCJ1c2VCYWxhbmNlVG90YWxJbkN1cnJlbmN5IiwiYWNjb3VudCIsImdldFRvdGFsQmFsYW5jZSIsImFkZHJlc3NDIiwidXNlQ2FsbGJhY2siLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsIlJlZnJlc2hJY29uIiwiU2tlbGV0b24iLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJzdHlsZWQiLCJJY29uQnV0dG9uIiwiQnV0dG9uIiwiR3JvdyIsInVzZVRyYW5zbGF0aW9uIiwidXNlU2V0dGluZ3NDb250ZXh0IiwidXNlQW5hbHl0aWNzQ29udGV4dCIsInVzZUFjY291bnRNYW5hZ2VyIiwiQW5pbWF0ZWRSZWZyZXNoSWNvbiIsInNob3VsZEZvcndhcmRQcm9wIiwicHJvcCIsImlzU3Bpbm5pbmciLCJjb21tb25UcmFuc2l0aW9uUHJvcHMiLCJ0aW1lb3V0IiwiZWFzaW5nIiwiYXBwZWFyIiwiQWNjb3VudEJhbGFuY2UiLCJyZWZyZXNoQmFsYW5jZSIsImJhbGFuY2VUb3RhbFVTRCIsImlzQmFsYW5jZUxvYWRpbmciLCJhY2NvdW50VHlwZSIsImlzQWN0aXZlIiwiaXNIb3ZlcmVkIiwidCIsImlzTWFuYWdlTW9kZSIsImN1cnJlbmN5IiwiY3VycmVuY3lGb3JtYXR0ZXIiLCJza2VsZXRvbldpZHRoIiwic2V0U2tlbGV0b25XaWR0aCIsImJhbGFuY2VUZXh0UmVmIiwiY2FwdHVyZSIsImhhc0JhbGFuY2UiLCJoYW5kbGVDbGljayIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJjdXJyZW50Iiwib2Zmc2V0V2lkdGgiLCJvblJlZnJlc2hDbGlja2VkIiwidHlwZSIsIm9uVmlld0JhbGFuY2VDbGlja2VkIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiZGlyZWN0aW9uIiwic3giLCJhbGlnbkl0ZW1zIiwib3ZlcmZsb3ciLCJwb3NpdGlvbiIsIm1pbkhlaWdodCIsImdhcCIsInN0eWxlIiwibWluV2lkdGgiLCJfZXh0ZW5kcyIsImluIiwiaGVpZ2h0Iiwid2lkdGgiLCJyaWdodCIsInRyYW5zaXRpb24iLCJtb3VudE9uRW50ZXIiLCJ1bm1vdW50T25FeGl0IiwicmVmIiwidmFyaWFudCIsInNpemUiLCJkaXNhYmxlUmlwcGxlIiwib25DbGljayIsInAiLCJjb2xvciIsInJlcGxhY2UiLCJDaGV2cm9uTGVmdEljb24iLCJEaXZpZGVyIiwiTG9hZGluZ0RvdHNJY29uIiwiU2Nyb2xsYmFycyIsIlRyYXNoSWNvbiIsInVzZVRoZW1lIiwidXNlSGlzdG9yeSIsInVzZUFjY291bnRzQ29udGV4dCIsInVzZUxlZGdlckNvbnRleHQiLCJMZWRnZXJBcHByb3ZhbERpYWxvZyIsIkFjY291bnRUeXBlIiwidXNlU2NvcGVkVG9hc3QiLCJOZXR3b3JrU3dpdGNoZXIiLCJPdmVybGF5IiwiaXNQcmltYXJ5QWNjb3VudCIsInVzZVdhbGxldENvbnRleHQiLCJ1c2VBY2NvdW50UmVtb3ZhbCIsIkFjY291bnRMaXN0UHJpbWFyeSIsIkFjY291bnRMaXN0SW1wb3J0ZWQiLCJBY2NvdW50c0FjdGlvbkJ1dHRvbiIsIk92ZXJmbG93aW5nVHlwb2dyYXBoeSIsInVzZVdhbGxldFRvdGFsQmFsYW5jZSIsInVzZVdhbGxldFRvdGFsQmFsYW5jZUNvbnRleHQiLCJBY2NvdW50cyIsInNlbGVjdEFjY291bnQiLCJhZGRBY2NvdW50IiwiYWNjb3VudHMiLCJpbXBvcnRlZCIsImltcG9ydGVkQWNjb3VudHMiLCJwcmltYXJ5IiwicHJpbWFyeUFjY291bnRzIiwiYWN0aXZlIiwidG9nZ2xlTWFuYWdlTW9kZSIsInNlbGVjdGVkQWNjb3VudHMiLCJ0b2FzdCIsImFkZEFjY291bnRMb2FkaW5nIiwic2V0QWRkQWNjb3VudExvYWRpbmciLCJoYXNMZWRnZXJUcmFuc3BvcnQiLCJ0aGVtZSIsImhpc3RvcnkiLCJ3YWxsZXREZXRhaWxzIiwiaXNMb2FkaW5nIiwidG90YWxCYWxhbmNlSW5DdXJyZW5jeSIsImFjdGl2ZVdhbGxldFRvdGFsQmFsYW5jZSIsInVuZGVmaW5lZCIsImZldGNoQmFsYW5jZUZvcldhbGxldCIsImNhbkNyZWF0ZUFjY291bnQiLCJQUklNQVJZIiwiYWN0aXZlQWNjb3VudEJhbGFuY2UiLCJhZGRBY2NvdW50QW5kRm9jdXMiLCJpZCIsIndhbGxldFR5cGUiLCJfZXJyIiwiZXJyb3IiLCJoYXNJbXBvcnRlZEFjY291bnRzIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsInByb21wdCIsInByb21wdFJlbW92YWwiLCJyZW5kZXJEaWFsb2ciLCJjb25maXJtUmVtb3ZhbERpYWxvZyIsImJhY2tncm91bmQiLCJwYWxldHRlIiwicGFwZXIiLCJoZWFkZXIiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJwbCIsInB0IiwicGIiLCJwciIsInBhZGRpbmciLCJzZWNvbmRhcnkiLCJsaWdodGVyIiwidHJhbnNmb3JtIiwicHgiLCJweSIsIndhbGxldE5hbWUiLCJuYW1lIiwiZm9udFdlaWdodCIsInRleHRBbGlnbiIsIm9yaWVudGF0aW9uIiwiZm9udFNpemUiLCJzdW0iLCJib3JkZXJDb2xvciIsIm9wYWNpdHkiLCJncmV5IiwidmFsdWVzIiwiZnVsbFdpZHRoIiwiZGlzYWJsZWQiLCJtciIsIm9uQWRkTmV3QWNjb3VudCIsIkNoZWNrYm94IiwiQ29sbGFwc2UiLCJDb3B5SWNvbiIsIlRvb2x0aXAiLCJmb3J3YXJkUmVmIiwidXNlRWZmZWN0IiwiTmV0d29ya1ZNVHlwZSIsInVzZU5ldHdvcmtDb250ZXh0IiwiU2VjcmV0VHlwZSIsImdldEFkZHJlc3NGb3JDaGFpbiIsInRydW5jYXRlQWRkcmVzcyIsInVzZUFjY291bnRSZW5hbWUiLCJTZWxlY3Rpb25Nb2RlIiwiQWNjb3VudEl0ZW1NZW51IiwiQWNjb3VudE5hbWVOZXciLCJBY2NvdW50SXRlbSIsInNlbGVjdGlvbk1vZGUiLCJkZXNlbGVjdEFjY291bnQiLCJpc0FjY291bnRTZWxlY3RhYmxlIiwiaXNBY3RpdmVBY2NvdW50IiwiYWN0aXZhdGVBY2NvdW50IiwibmV0d29yayIsImlzU2VsZWN0ZWQiLCJpbmNsdWRlcyIsImlzU2VsZWN0YWJsZSIsIlNlZWRsZXNzIiwidG90YWxCYWxhbmNlIiwiYWRkcmVzcyIsImNhcmRIb3ZlcmVkIiwic2V0Q2FyZEhvdmVyZWQiLCJpdGVtUmVmIiwiZmlyc3RQYWdlbG9hZCIsImJlaGF2aW9yIiwic2Nyb2xsSW50b1ZpZXciLCJibG9jayIsInRvZ2dsZSIsImFjY291bnRJZCIsIkNvbnNlY3V0aXZlIiwiaGFuZGxlQWNjb3VudENsaWNrIiwic3VjY2VzcyIsImFjY291bnROYW1lIiwiZHVyYXRpb24iLCJub25TZWxlY3RhYmxlSGludCIsImluZGV4Iiwic2V0SXNCYWxhbmNlTG9hZGluZyIsInVwZGF0ZUJhbGFuY2VPbk5ldHdvcmtzIiwiZ2V0QmFsYW5jZSIsInRvQmVSZW1vdmVkIiwicHJvbXB0UmVuYW1lIiwicmVuYW1lRGlhbG9nIiwicHJvbXB0UmVtb3ZlIiwicmVtb3ZlRGlhbG9nIiwiaGFuZGxlQ29weUNsaWNrIiwiZXYiLCJ2bU5hbWUiLCJldmVudE5hbWUiLCJnZXRDb3B5RXZlbnROYW1lQnlOZXR3b3JrVHlwZSIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsIkZyYWdtZW50Iiwia2V5IiwiY3Vyc29yIiwidHJhbnNpdGlvbnMiLCJjcmVhdGUiLCJvbkNsaWNrQ2FwdHVyZSIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VMZWF2ZSIsIm1sIiwidGl0bGUiLCJvbkNoYW5nZSIsImNoZWNrZWQiLCJmbGV4R3JvdyIsIm1heFdpZHRoIiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwic2xvdFByb3BzIiwicG9wcGVyIiwiZm9udFN0eWxlIiwiaGFuZGxlUmVtb3ZlIiwibWVudUFuY2hvciIsImRpc3BsYXlOYW1lIiwibm9ybWFsaXplZFR5cGUiLCJCSVRDT0lOIiwiRVZNIiwiQ2xpY2tBd2F5TGlzdGVuZXIiLCJMaXN0SXRlbVRleHQiLCJNZW51SXRlbSIsIk1lbnVMaXN0IiwiTW9yZVZlcnRpY2FsSWNvbiIsIlBvcHBlciIsInVzZVByaXZhdGVLZXlFeHBvcnQiLCJpc09wZW4iLCJzZXRJc09wZW4iLCJpc1ByaXZhdGVLZXlBdmFpbGFibGUiLCJzaG93UHJpdmF0ZUtleSIsImlzRGVsZXRhYmxlIiwiZ29Ub0RldGFpbHMiLCJwdXNoIiwibW91c2VFdmVudCIsIm9uQ2xpY2tBd2F5Iiwib3BlbiIsImFuY2hvckVsIiwicGxhY2VtZW50IiwiVHJhbnNpdGlvblByb3BzIiwibSIsImJvcmRlciIsImJvcmRlclRvcCIsImRpc2FibGVJbnRlcmFjdGl2ZSIsImlzSW1wb3J0ZWRBY2NvdW50IiwiV2FsbGV0SGVhZGVyIiwiaXNFeHBhbmRlZCIsInNldElzRXhwYW5kZWQiLCJoYXNFcnJvck9jY3VycmVkIiwiaGFzQmFsYW5jZUVycm9yIiwibWFwIiwiQW55IiwiV2FsbGV0Q29udGFpbmVyIiwiYWN0aXZlV2FsbGV0RGV0YWlscyIsIndhbGxldHMiLCJ3YWxsZXRBY2NvdW50cyIsImZpbmQiLCJ3YWxsZXQiLCJCb3giLCJQZW5jaWxSb3VuZEljb24iLCJBY2NvdW50TmFtZSIsImZsZXhTaHJpbmsiLCJtYXJnaW5SaWdodCIsInRyYW5zaXRpb25EdXJhdGlvbiIsInRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbiIsInRyYW5zaXRpb25Qcm9wZXJ0eSIsImxpbmVIZWlnaHQiLCJDaGV2cm9uRG93bkljb24iLCJLZXlJY29uIiwiV2FsbGV0Q29ubmVjdEljb24iLCJGaXJlYmxvY2tzSWNvbiIsIkxpc3RJY29uIiwiTGVkZ2VySWNvbiIsIktleXN0b3JlSWNvbiIsIkNoZXZyb25SaWdodEljb24iLCJQbHVzSWNvbiIsImJyb3dzZXIiLCJ1c2VGZWF0dXJlRmxhZ0NvbnRleHQiLCJGZWF0dXJlR2F0ZXMiLCJpc1Byb2R1Y3Rpb25CdWlsZCIsIkNoYWluSWQiLCJNZW51SXRlbUNvbHVtbiIsImhhc05vQm9yZGVyIiwic3BhY2luZyIsIlN0eWxlZE1lbnVJdGVtIiwiSWNvbkNvbHVtbiIsImlzTWVudU9wZW4iLCJzZXRJc01lbnVPcGVuIiwidG9nZ2xlQnV0dG9uUmVmIiwiZmVhdHVyZUZsYWdzIiwiZ29Ub0ltcG9ydFNjcmVlbiIsImdvVG9BZGRTZWVkcGhyYXNlU2NyZWVuIiwiZ29Ub0FkZEtleXN0b3JlRmlsZVNjcmVlbiIsImdvVG9BZGRMZWRnZXJTY3JlZW4iLCJ0YWJzIiwidXJsIiwiZ29Ub1dhbGxldENvbm5lY3RTY3JlZW4iLCJnb1RvRmlyZWJsb2Nrc1dhbGxldENvbm5lY3RTY3JlZW4iLCJmaXJlYmxvY2tzRGlzYWJsZWRSZWFzb24iLCJjaGFpbklkIiwiQVZBTEFOQ0hFX01BSU5ORVRfSUQiLCJlbmRJY29uIiwiZGVuc2UiLCJtYiIsImJveFNoYWRvdyIsIklNUE9SVF9XQUxMRVRfQ09OTkVDVCIsIklNUE9SVF9GSVJFQkxPQ0tTIiwiQm9vbGVhbiIsIkFERF9XQUxMRVRfV0lUSF9TRUVEUEhSQVNFIiwiQUREX1dBTExFVF9XSVRIX0xFREdFUiIsIkFERF9XQUxMRVRfV0lUSF9LRVlTVE9SRV9GSUxFIiwiT3V0Ym91bmRJY29uIiwiaXNEZXZlbG9wZXJNb2RlIiwiaGFzQmFsYW5jZU9uVW5kZXJpdmVkQWNjb3VudHMiLCJOb25lIiwibXQiLCJ3aW5kb3ciLCJDaGV2cm9uVXBJY29uIiwiQ2hpcCIsInVzZVdhbGxldFJlbmFtZSIsInNldElzSG92ZXJlZCIsIkxlZGdlciIsIkxlZGdlckxpdmUiLCJsYWJlbCIsInVzZUVudGl0eVJlbmFtZSIsInJlbmFtZVdhbGxldCIsIm9uRmFpbHVyZSIsIm9uU3VjY2VzcyIsInVwZGF0ZUZuIiwibmV3TmFtZSIsInRyaW0iLCJjdXJyZW50TmFtZSIsImRpYWxvZ1RpdGxlIiwid2FsbGV0QmFsYW5jZXMiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsImlzU3RyaW5nIiwidXNlQ29ubmVjdGlvbkNvbnRleHQiLCJFeHRlbnNpb25SZXF1ZXN0IiwiV2FsbGV0VG90YWxCYWxhbmNlQ29udGV4dCIsIlByb21pc2UiLCJyZXNvbHZlIiwiV2FsbGV0VG90YWxCYWxhbmNlUHJvdmlkZXIiLCJjaGlsZHJlbiIsInJlcXVlc3QiLCJzZXRXYWxsZXRCYWxhbmNlcyIsInByZXZTdGF0ZSIsIm1ldGhvZCIsIkJBTEFOQ0VTX0dFVF9UT1RBTF9GT1JfV0FMTEVUIiwicGFyYW1zIiwidGhlbiIsIndhbGxldEJhbGFuY2VJbmZvIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiaXNNb3VudGVkIiwiZmV0Y2hXYWxsZXRCYWxhbmNlc1NlcXVlbnRpYWxseSIsIndhbGxldElkcyIsImZpbHRlciIsIlByb3ZpZGVyIiwidmFsdWUiLCJDaXJjdWxhclByb2dyZXNzIiwiYW1vdW50Iiwic3ltYm9sIiwiZmVlIiwiZmVlU3ltYm9sIiwibmZ0TmFtZSIsImN1cnJlbnRTaWduYXR1cmUiLCJyZXF1aXJlZFNpZ25hdHVyZXMiLCJoYXNTaWduYXR1cmVzSW5mbyIsIm1hcmdpbiIsInRleHQiLCJteSIsInRvdGFsIl0sInNvdXJjZVJvb3QiOiIifQ==