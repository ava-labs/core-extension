"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Accounts_components_OverflowingTypography_tsx-src_pages_Accounts_hooks_useAccountRe-c6d206"],{

/***/ "./src/background/services/accounts/utils/typeGuards.ts":
/*!**************************************************************!*\
  !*** ./src/background/services/accounts/utils/typeGuards.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isFireblocksAccount": () => (/* binding */ isFireblocksAccount),
/* harmony export */   "isImportedAccount": () => (/* binding */ isImportedAccount),
/* harmony export */   "isPrimaryAccount": () => (/* binding */ isPrimaryAccount),
/* harmony export */   "isWalletConnectAccount": () => (/* binding */ isWalletConnectAccount)
/* harmony export */ });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ "./src/background/services/accounts/models.ts");

const isFireblocksAccount = account => account?.type === _models__WEBPACK_IMPORTED_MODULE_0__.AccountType.FIREBLOCKS;
const isWalletConnectAccount = account => account?.type === _models__WEBPACK_IMPORTED_MODULE_0__.AccountType.WALLET_CONNECT;
const isPrimaryAccount = account => account?.type === _models__WEBPACK_IMPORTED_MODULE_0__.AccountType.PRIMARY;
const isImportedAccount = account => Boolean(account) && !isPrimaryAccount(account);

/***/ }),

/***/ "./src/hooks/useKeyboardShortcuts.ts":
/*!*******************************************!*\
  !*** ./src/hooks/useKeyboardShortcuts.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useKeyboardShortcuts": () => (/* binding */ useKeyboardShortcuts)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const useKeyboardShortcuts = shortcuts => {
  const onKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async event => {
    const callback = shortcuts[event.key];
    if (typeof callback === 'function') {
      event.preventDefault();
      await callback();
    }
  }, [shortcuts]);
  return {
    onKeyDown
  };
};

/***/ }),

/***/ "./src/hooks/useScopedToast.ts":
/*!*************************************!*\
  !*** ./src/hooks/useScopedToast.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useScopedToast": () => (/* binding */ useScopedToast)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");


const useScopedToast = id => {
  const success = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((...[message, opts]) => {
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"].dismiss(id);
    return _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"].success(message, {
      ...opts,
      id: id
    });
  }, [id]);
  const error = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((...[message, opts]) => {
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"].dismiss(id);
    return _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"].error(message, {
      ...opts,
      id: id
    });
  }, [id]);
  return {
    success,
    error
  };
};

/***/ }),

/***/ "./src/pages/Accounts/components/ConfirmAccountRemovalDialog.tsx":
/*!***********************************************************************!*\
  !*** ./src/pages/Accounts/components/ConfirmAccountRemovalDialog.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConfirmAccountRemovalDialog": () => (/* binding */ ConfirmAccountRemovalDialog)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const ConfirmAccountRemovalDialog = ({
  onClose,
  onConfirm,
  isMultiple,
  isDeleting,
  ...props
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Dialog, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    PaperProps: {
      sx: {
        m: 2
      }
    },
    sx: {
      textAlign: 'center'
    }
  }, props), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.DialogTitle, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h5"
  }, isMultiple ? t('Delete Accounts?') : t('Delete Account?'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.DialogContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2"
  }, isMultiple ? t('Removing the accounts will delete all local accounts information stored on this computer. Your assets on chain will remain on chain.') : t('Removing the account will delete all local  account information stored on this computer. Your assets on chain will remain on chain.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.DialogActions, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    onClick: e => {
      e.stopPropagation();
      onConfirm();
    },
    variant: "contained",
    size: "large",
    disabled: isDeleting,
    isLoading: isDeleting,
    "data-testid": "delete-account-confirm-button"
  }, t('Delete')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    onClick: e => {
      e.stopPropagation();
      onClose?.(e, 'backdropClick');
    },
    variant: "text",
    disabled: isDeleting,
    "data-testid": "delete-account-cancel-button"
  }, t('Cancel'))));
};

/***/ }),

/***/ "./src/pages/Accounts/components/OverflowingTypography.tsx":
/*!*****************************************************************!*\
  !*** ./src/pages/Accounts/components/OverflowingTypography.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OverflowingTypography": () => (/* binding */ OverflowingTypography)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const OverflowingTypography = ({
  children,
  disableInteractive,
  sx,
  ...props
}) => {
  const [isOverflowing, setIsOverflowing] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const onTypographyMounted = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(node => {
    if (node) {
      setIsOverflowing(node.scrollWidth > node.offsetWidth);
    }
  }, []);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    title: isOverflowing ? children : '',
    placement: "top",
    wrapWithSpan: false,
    disableInteractive: disableInteractive ?? true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    ref: onTypographyMounted
  }, props, {
    sx: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      ...sx
    }
  }), children));
};

/***/ }),

/***/ "./src/pages/Accounts/components/RenameDialog.tsx":
/*!********************************************************!*\
  !*** ./src/pages/Accounts/components/RenameDialog.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RenameDialog": () => (/* binding */ RenameDialog)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useKeyboardShortcuts */ "./src/hooks/useKeyboardShortcuts.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const RenameDialog = ({
  isOpen,
  isSaving,
  onClose,
  title,
  currentName,
  onSave
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const [newName, setNewName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const keyboardShortcuts = (0,_src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_2__.useKeyboardShortcuts)({
    Enter: () => onSave(newName),
    Escape: onClose
  });
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Dialog, {
    open: isOpen,
    onClose: onClose,
    showCloseIcon: false,
    PaperProps: {
      sx: {
        m: 2,
        width: 1
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.DialogTitle, {
    typographyProps: {
      fontSize: 20
    }
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.DialogContent, {
    sx: {
      pt: 1.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.TextField, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    size: "small",
    placeholder: currentName,
    onChange: ev => setNewName(ev.target.value),
    value: newName,
    autoFocus: true,
    InputProps: {
      endAdornment: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
        size: "small",
        onClick: e => {
          e.stopPropagation();
          setNewName('');
        },
        sx: {
          color: 'grey.500',
          visibility: newName.trim() ? 'visible' : 'hidden'
        }
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.XCircleFilledIcon, {
        size: 20
      }))
    }
  }, keyboardShortcuts, {
    "data-testid": "rename-account-input"
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      px: 3,
      py: 2,
      mt: 5.5,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    color: "secondary",
    size: "large",
    fullWidth: true,
    disabled: isSaving,
    onClick: e => {
      e.stopPropagation();
      setNewName('');
      onClose();
    },
    "data-testid": "abort-renaming"
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    color: "primary",
    disabled: isSaving || newName.trim().length === 0,
    isLoading: isSaving,
    size: "large",
    fullWidth: true,
    onClick: e => {
      e.stopPropagation();
      onSave(newName);
    },
    "data-testid": "confirm-renaming"
  }, t('Save'))));
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/useAccountRemoval.tsx":
/*!********************************************************!*\
  !*** ./src/pages/Accounts/hooks/useAccountRemoval.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useAccountRemoval": () => (/* binding */ useAccountRemoval)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useScopedToast */ "./src/hooks/useScopedToast.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _components_ConfirmAccountRemovalDialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/ConfirmAccountRemovalDialog */ "./src/pages/Accounts/components/ConfirmAccountRemovalDialog.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../providers/AccountManagerProvider */ "./src/pages/Accounts/providers/AccountManagerProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








const useAccountRemoval = accountIds => {
  const [isPrompted, setIsPrompted] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isDeleting, setIsDeleting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const {
    exitManageMode
  } = (0,_providers_AccountManagerProvider__WEBPACK_IMPORTED_MODULE_5__.useAccountManager)();
  const {
    deleteAccounts
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__.useAnalyticsContext)();
  const toast = (0,_src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_1__.useScopedToast)('account-switcher');
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.useHistory)();
  const confirm = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    setIsDeleting(true);
    deleteAccounts(accountIds).then(() => {
      capture('AccountDeleteSucceeded');
      setIsPrompted(false);
      exitManageMode();
      history.replace('/accounts');
      toast.success(t('Successfully deleted {{number}} account(s)', {
        number: accountIds.length
      }));
    }).catch(() => {
      toast.error(t('Account(s) removal has failed!'), {
        duration: 2000
      });
      capture('AccountDeleteFailed');
    }).finally(() => {
      setIsDeleting(false);
    });
  }, [accountIds, capture, deleteAccounts, exitManageMode, history, t, toast]);
  const prompt = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => setIsPrompted(true), []);
  const cancel = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => setIsPrompted(false), []);
  const renderDialog = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => /*#__PURE__*/React.createElement(_components_ConfirmAccountRemovalDialog__WEBPACK_IMPORTED_MODULE_3__.ConfirmAccountRemovalDialog, {
    isDeleting: isDeleting,
    open: isPrompted,
    isMultiple: accountIds.length > 1,
    onConfirm: confirm,
    onClose: cancel
  }), [isDeleting, isPrompted, accountIds, cancel, confirm]);
  return {
    prompt,
    renderDialog
  };
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/useAccountRename.tsx":
/*!*******************************************************!*\
  !*** ./src/pages/Accounts/hooks/useAccountRename.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useAccountRename": () => (/* binding */ useAccountRename)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useScopedToast */ "./src/hooks/useScopedToast.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _useEntityRename__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useEntityRename */ "./src/pages/Accounts/hooks/useEntityRename.tsx");





const useAccountRename = account => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    renameAccount
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const toast = (0,_src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_1__.useScopedToast)('account-switcher');
  const onFailure = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => toast.success(t('Renaming failed'), {
    duration: 1000
  }), [toast, t]);
  const onSuccess = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => toast.success(t('Account renamed'), {
    duration: 1000
  }), [toast, t]);
  const updateFn = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(newName => account?.id ? renameAccount(account.id, newName.trim()) : undefined, [renameAccount, account?.id]);
  return (0,_useEntityRename__WEBPACK_IMPORTED_MODULE_3__.useEntityRename)({
    currentName: account?.name ?? '',
    dialogTitle: t('Rename Account'),
    updateFn,
    onFailure,
    onSuccess
  });
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/useEntityRename.tsx":
/*!******************************************************!*\
  !*** ./src/pages/Accounts/hooks/useEntityRename.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useEntityRename": () => (/* binding */ useEntityRename)
/* harmony export */ });
/* harmony import */ var _src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useScopedToast */ "./src/hooks/useScopedToast.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _components_RenameDialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/RenameDialog */ "./src/pages/Accounts/components/RenameDialog.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const useEntityRename = ({
  updateFn,
  currentName,
  dialogTitle,
  onSuccess,
  onFailure
}) => {
  const [isSaving, setIsSaving] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isRenaming, setIsRenaming] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const toast = (0,_src_hooks_useScopedToast__WEBPACK_IMPORTED_MODULE_0__.useScopedToast)('account-switcher');
  const prompt = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => setIsRenaming(true), []);
  const cancel = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => setIsRenaming(false), []);
  const confirm = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(newName => {
    if (newName === currentName) {
      setIsRenaming(false);
      return;
    }
    if (newName.trim().length === 0) {
      toast.error(t('New name is required'), {
        duration: 1000
      });
      return;
    }
    setIsSaving(true);
    updateFn(newName.trim()).then(() => {
      setIsRenaming(false);
      onSuccess();
    }).catch(onFailure).finally(() => {
      setIsSaving(false);
    });
  }, [updateFn, currentName, onSuccess, onFailure, t, toast]);
  const renderDialog = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => /*#__PURE__*/React.createElement(_components_RenameDialog__WEBPACK_IMPORTED_MODULE_2__.RenameDialog, {
    title: dialogTitle,
    currentName: currentName,
    isOpen: isRenaming,
    isSaving: isSaving,
    onClose: cancel,
    onSave: confirm
  }), [currentName, dialogTitle, cancel, confirm, isRenaming, isSaving]);
  return {
    prompt,
    renderDialog
  };
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/usePrivateKeyExport.ts":
/*!*********************************************************!*\
  !*** ./src/pages/Accounts/hooks/usePrivateKeyExport.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "usePrivateKeyExport": () => (/* binding */ usePrivateKeyExport)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");





const usePrivateKeyExport = (account, walletType) => {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_1__.useAnalyticsContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useHistory)();
  const isPrivateKeyAvailable = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => account?.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_2__.AccountType.IMPORTED || account?.type === _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_2__.AccountType.PRIMARY && walletType === _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_3__.SecretType.Mnemonic, [account?.type, walletType]);
  const showPrivateKey = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    capture('ExportPrivateKeyClicked');
    e.stopPropagation();
    history.push(`/export-private-key?accountId=${account?.id}`);
  }, [account?.id, capture, history]);
  return {
    showPrivateKey,
    isPrivateKeyAvailable
  };
};

/***/ }),

/***/ "./src/pages/Accounts/providers/AccountManagerProvider.tsx":
/*!*****************************************************************!*\
  !*** ./src/pages/Accounts/providers/AccountManagerProvider.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountManagerContext": () => (/* binding */ AccountManagerContext),
/* harmony export */   "AccountManagerProvider": () => (/* binding */ AccountManagerProvider),
/* harmony export */   "SelectionMode": () => (/* binding */ SelectionMode),
/* harmony export */   "useAccountManager": () => (/* binding */ useAccountManager)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/accounts/utils/typeGuards */ "./src/background/services/accounts/utils/typeGuards.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const AccountManagerContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  exitManageMode() {},
  isManageMode: false,
  isAccountSelectable() {
    return false;
  },
  selectedAccounts: [],
  selectAccount() {},
  deselectAccount() {},
  toggleManageMode() {}
});
let SelectionMode = /*#__PURE__*/function (SelectionMode) {
  SelectionMode[SelectionMode["None"] = 0] = "None";
  SelectionMode[SelectionMode["Any"] = 1] = "Any";
  SelectionMode[SelectionMode["Consecutive"] = 2] = "Consecutive";
  return SelectionMode;
}({});
const AccountManagerProvider = ({
  children
}) => {
  const {
    accounts
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_2__.useFeatureFlagContext)();
  const [selectedAccounts, setSelectedAccounts] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isManageMode, setIsManageMode] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const isAccountSelectable = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(account => {
    if (!featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_3__.FeatureGates.PRIMARY_ACCOUNT_REMOVAL] || !(0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_4__.isPrimaryAccount)(account)) {
      return account.id in accounts.imported;
    }
    const {
      id: accountId,
      walletId
    } = account;
    if (selectedAccounts.includes(accountId)) {
      return true;
    }
    const walletPrimaryAccounts = accounts.primary[walletId];
    if (!walletPrimaryAccounts) {
      return false;
    }
    const allAccountsCount = Object.values(accounts.primary).flat().length;
    if (allAccountsCount - 1 === selectedAccounts.length) {
      return false;
    }
    return walletPrimaryAccounts.slice(walletPrimaryAccounts.indexOf(account) + 1).every(({
      id
    }) => selectedAccounts.includes(id));
    return false;
  }, [featureFlags, selectedAccounts, accounts.primary, accounts.imported]);
  const selectAccount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(accountId => {
    setSelectedAccounts(currentSet => {
      return [...currentSet, accountId];
    });
  }, []);
  const deselectAccount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((accountId, deselectPrevious = false) => {
    setSelectedAccounts(currentSet => {
      const index = currentSet.indexOf(accountId);
      if (index === -1) {
        return currentSet;
      }
      currentSet.splice(index, deselectPrevious ? currentSet.length - index : 1);
      return Array.from(currentSet);
    });
  }, []);
  const toggleManageMode = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setIsManageMode(wasManageModeEnabled => !wasManageModeEnabled);
  }, []);
  const exitManageMode = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setIsManageMode(false);
    setSelectedAccounts([]);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setSelectedAccounts([]);
  }, [isManageMode]);
  return /*#__PURE__*/React.createElement(AccountManagerContext.Provider, {
    value: {
      exitManageMode,
      isAccountSelectable,
      isManageMode,
      selectedAccounts,
      selectAccount,
      deselectAccount,
      toggleManageMode
    }
  }, children);
};
function useAccountManager() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(AccountManagerContext);
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FjY291bnRzX2NvbXBvbmVudHNfT3ZlcmZsb3dpbmdUeXBvZ3JhcGh5X3RzeC1zcmNfcGFnZXNfQWNjb3VudHNfaG9va3NfdXNlQWNjb3VudFJlLWM2ZDIwNi5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPbUI7QUFFWixNQUFNQyxtQkFBbUIsR0FDOUJDLE9BQWlCLElBQ2dCQSxPQUFPLEVBQUVDLElBQUksS0FBS0gsMkRBQXNCO0FBRXBFLE1BQU1LLHNCQUFzQixHQUNqQ0gsT0FBaUIsSUFFakJBLE9BQU8sRUFBRUMsSUFBSSxLQUFLSCwrREFBMEI7QUFFdkMsTUFBTU8sZ0JBQWdCLEdBQzNCTCxPQUErQixJQUNEQSxPQUFPLEVBQUVDLElBQUksS0FBS0gsd0RBQW1CO0FBRTlELE1BQU1TLGlCQUFpQixHQUM1QlAsT0FBaUIsSUFDY1EsT0FBTyxDQUFDUixPQUFPLENBQUMsSUFBSSxDQUFDSyxnQkFBZ0IsQ0FBQ0wsT0FBTyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN4QnJCO0FBTW5ELE1BQU1VLG9CQUFvQixHQUFJQyxTQUE0QixJQUFLO0VBQ3BFLE1BQU1DLFNBQStCLEdBQUdILGtEQUFXLENBQ2pELE1BQU9JLEtBQUssSUFBSztJQUNmLE1BQU1DLFFBQVEsR0FBR0gsU0FBUyxDQUFDRSxLQUFLLENBQUNFLEdBQUcsQ0FBQztJQUVyQyxJQUFJLE9BQU9ELFFBQVEsS0FBSyxVQUFVLEVBQUU7TUFDbENELEtBQUssQ0FBQ0csY0FBYyxFQUFFO01BQ3RCLE1BQU1GLFFBQVEsRUFBRTtJQUNsQjtFQUNGLENBQUMsRUFDRCxDQUFDSCxTQUFTLENBQUMsQ0FDWjtFQUVELE9BQU87SUFDTEM7RUFDRixDQUFDO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCbUM7QUFDZ0I7QUFFN0MsTUFBTU0sY0FBYyxHQUFJQyxFQUFVLElBQUs7RUFDNUMsTUFBTUMsT0FBTyxHQUFHWCxrREFBVyxDQUN6QixDQUFDLEdBQUcsQ0FB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QztFQUNsRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0VBRU4sTUFBTXpFLGNBQWMsR0FBRzlHLGtEQUFXLENBQUMsTUFBTTtJQUN2Q2tLLGVBQWUsQ0FBQyxLQUFLLENBQUM7SUFDdEJELG1CQUFtQixDQUFDLEVBQUUsQ0FBQztFQUN6QixDQUFDLEVBQUUsRUFBRSxDQUFDO0VBRU5kLGdEQUFTLENBQUMsTUFBTTtJQUNkYyxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7RUFDekIsQ0FBQyxFQUFFLENBQUNWLFlBQVksQ0FBQyxDQUFDO0VBRWxCLG9CQUNFekgsS0FBQSxDQUFBQyxhQUFBLENBQUN1SCxxQkFBcUIsQ0FBQ2tDLFFBQVE7SUFDN0JqRyxLQUFLLEVBQUU7TUFDTHVCLGNBQWM7TUFDZDBDLG1CQUFtQjtNQUNuQkQsWUFBWTtNQUNaRSxnQkFBZ0I7TUFDaEJDLGFBQWE7TUFDYkMsZUFBZTtNQUNmQztJQUNGO0VBQUUsR0FFRDVHLFFBQVEsQ0FDc0I7QUFFckMsQ0FBQztBQUVNLFNBQVN3RCxpQkFBaUJBLENBQUEsRUFBRztFQUNsQyxPQUFPMEMsaURBQVUsQ0FBQ0kscUJBQXFCLENBQUM7QUFDMUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvdXRpbHMvdHlwZUd1YXJkcy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUtleWJvYXJkU2hvcnRjdXRzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlU2NvcGVkVG9hc3QudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9jb21wb25lbnRzL0NvbmZpcm1BY2NvdW50UmVtb3ZhbERpYWxvZy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9jb21wb25lbnRzL092ZXJmbG93aW5nVHlwb2dyYXBoeS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9jb21wb25lbnRzL1JlbmFtZURpYWxvZy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9ob29rcy91c2VBY2NvdW50UmVtb3ZhbC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9ob29rcy91c2VBY2NvdW50UmVuYW1lLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2hvb2tzL3VzZUVudGl0eVJlbmFtZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9ob29rcy91c2VQcml2YXRlS2V5RXhwb3J0LnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQWNjb3VudHMvcHJvdmlkZXJzL0FjY291bnRNYW5hZ2VyUHJvdmlkZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFjY291bnQsXG4gIEFjY291bnRUeXBlLFxuICBGaXJlYmxvY2tzQWNjb3VudCxcbiAgSW1wb3J0ZWRBY2NvdW50LFxuICBQcmltYXJ5QWNjb3VudCxcbiAgV2FsbGV0Q29ubmVjdEFjY291bnQsXG59IGZyb20gJy4uL21vZGVscyc7XG5cbmV4cG9ydCBjb25zdCBpc0ZpcmVibG9ja3NBY2NvdW50ID0gKFxuICBhY2NvdW50PzogQWNjb3VudCxcbik6IGFjY291bnQgaXMgRmlyZWJsb2Nrc0FjY291bnQgPT4gYWNjb3VudD8udHlwZSA9PT0gQWNjb3VudFR5cGUuRklSRUJMT0NLUztcblxuZXhwb3J0IGNvbnN0IGlzV2FsbGV0Q29ubmVjdEFjY291bnQgPSAoXG4gIGFjY291bnQ/OiBBY2NvdW50LFxuKTogYWNjb3VudCBpcyBXYWxsZXRDb25uZWN0QWNjb3VudCA9PlxuICBhY2NvdW50Py50eXBlID09PSBBY2NvdW50VHlwZS5XQUxMRVRfQ09OTkVDVDtcblxuZXhwb3J0IGNvbnN0IGlzUHJpbWFyeUFjY291bnQgPSAoXG4gIGFjY291bnQ/OiBQaWNrPEFjY291bnQsICd0eXBlJz4sXG4pOiBhY2NvdW50IGlzIFByaW1hcnlBY2NvdW50ID0+IGFjY291bnQ/LnR5cGUgPT09IEFjY291bnRUeXBlLlBSSU1BUlk7XG5cbmV4cG9ydCBjb25zdCBpc0ltcG9ydGVkQWNjb3VudCA9IChcbiAgYWNjb3VudD86IEFjY291bnQsXG4pOiBhY2NvdW50IGlzIEltcG9ydGVkQWNjb3VudCA9PiBCb29sZWFuKGFjY291bnQpICYmICFpc1ByaW1hcnlBY2NvdW50KGFjY291bnQpO1xuIiwiaW1wb3J0IHsgS2V5Ym9hcmRFdmVudEhhbmRsZXIsIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuXG50eXBlIENhbGxiYWNrID0gKCkgPT4gdm9pZDtcbnR5cGUgS2V5TmFtZXMgPSAnRW50ZXInIHwgJ0VzY2FwZSc7XG50eXBlIEtleWJvYXJkU2hvcnRjdXRzID0gUGFydGlhbDxSZWNvcmQ8S2V5TmFtZXMsIENhbGxiYWNrPj47XG5cbmV4cG9ydCBjb25zdCB1c2VLZXlib2FyZFNob3J0Y3V0cyA9IChzaG9ydGN1dHM6IEtleWJvYXJkU2hvcnRjdXRzKSA9PiB7XG4gIGNvbnN0IG9uS2V5RG93bjogS2V5Ym9hcmRFdmVudEhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gc2hvcnRjdXRzW2V2ZW50LmtleV07XG5cbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYXdhaXQgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtzaG9ydGN1dHNdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgb25LZXlEb3duLFxuICB9O1xufTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdG9hc3QgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgdXNlU2NvcGVkVG9hc3QgPSAoaWQ6IHN0cmluZykgPT4ge1xuICBjb25zdCBzdWNjZXNzID0gdXNlQ2FsbGJhY2soXG4gICAgKC4uLlttZXNzYWdlLCBvcHRzXTogUGFyYW1ldGVyczx0eXBlb2YgdG9hc3Quc3VjY2Vzcz4pID0+IHtcbiAgICAgIHRvYXN0LmRpc21pc3MoaWQpO1xuXG4gICAgICByZXR1cm4gdG9hc3Quc3VjY2VzcyhtZXNzYWdlLCB7IC4uLm9wdHMsIGlkOiBpZCB9KTtcbiAgICB9LFxuICAgIFtpZF0sXG4gICk7XG5cbiAgY29uc3QgZXJyb3IgPSB1c2VDYWxsYmFjayhcbiAgICAoLi4uW21lc3NhZ2UsIG9wdHNdOiBQYXJhbWV0ZXJzPHR5cGVvZiB0b2FzdC5lcnJvcj4pID0+IHtcbiAgICAgIHRvYXN0LmRpc21pc3MoaWQpO1xuXG4gICAgICByZXR1cm4gdG9hc3QuZXJyb3IobWVzc2FnZSwgeyAuLi5vcHRzLCBpZDogaWQgfSk7XG4gICAgfSxcbiAgICBbaWRdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc3VjY2VzcyxcbiAgICBlcnJvcixcbiAgfTtcbn07XG4iLCJpbXBvcnQge1xuICBCdXR0b24sXG4gIERpYWxvZyxcbiAgRGlhbG9nQWN0aW9ucyxcbiAgRGlhbG9nQ29udGVudCxcbiAgRGlhbG9nUHJvcHMsXG4gIERpYWxvZ1RpdGxlLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxudHlwZSBDb25maXJtQWNjb3VudFJlbW92YWxEaWFsb2dQcm9wcyA9IERpYWxvZ1Byb3BzICYge1xuICBvbkNvbmZpcm0oKTogdm9pZDtcbiAgaXNNdWx0aXBsZTogYm9vbGVhbjtcbiAgaXNEZWxldGluZzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBjb25zdCBDb25maXJtQWNjb3VudFJlbW92YWxEaWFsb2cgPSAoe1xuICBvbkNsb3NlLFxuICBvbkNvbmZpcm0sXG4gIGlzTXVsdGlwbGUsXG4gIGlzRGVsZXRpbmcsXG4gIC4uLnByb3BzXG59OiBDb25maXJtQWNjb3VudFJlbW92YWxEaWFsb2dQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8RGlhbG9nXG4gICAgICBQYXBlclByb3BzPXt7XG4gICAgICAgIHN4OiB7IG06IDIgfSxcbiAgICAgIH19XG4gICAgICBzeD17eyB0ZXh0QWxpZ246ICdjZW50ZXInIH19XG4gICAgICB7Li4ucHJvcHN9XG4gICAgPlxuICAgICAgPERpYWxvZ1RpdGxlPlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIj5cbiAgICAgICAgICB7aXNNdWx0aXBsZSA/IHQoJ0RlbGV0ZSBBY2NvdW50cz8nKSA6IHQoJ0RlbGV0ZSBBY2NvdW50PycpfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L0RpYWxvZ1RpdGxlPlxuICAgICAgPERpYWxvZ0NvbnRlbnQ+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgIHtpc011bHRpcGxlXG4gICAgICAgICAgICA/IHQoXG4gICAgICAgICAgICAgICAgJ1JlbW92aW5nIHRoZSBhY2NvdW50cyB3aWxsIGRlbGV0ZSBhbGwgbG9jYWwgYWNjb3VudHMgaW5mb3JtYXRpb24gc3RvcmVkIG9uIHRoaXMgY29tcHV0ZXIuIFlvdXIgYXNzZXRzIG9uIGNoYWluIHdpbGwgcmVtYWluIG9uIGNoYWluLicsXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogdChcbiAgICAgICAgICAgICAgICAnUmVtb3ZpbmcgdGhlIGFjY291bnQgd2lsbCBkZWxldGUgYWxsIGxvY2FsICBhY2NvdW50IGluZm9ybWF0aW9uIHN0b3JlZCBvbiB0aGlzIGNvbXB1dGVyLiBZb3VyIGFzc2V0cyBvbiBjaGFpbiB3aWxsIHJlbWFpbiBvbiBjaGFpbi4nLFxuICAgICAgICAgICAgICApfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L0RpYWxvZ0NvbnRlbnQ+XG4gICAgICA8RGlhbG9nQWN0aW9ucyBzeD17eyBnYXA6IDEgfX0+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIG9uQ29uZmlybSgpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgdmFyaWFudD1cImNvbnRhaW5lZFwiXG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBkaXNhYmxlZD17aXNEZWxldGluZ31cbiAgICAgICAgICBpc0xvYWRpbmc9e2lzRGVsZXRpbmd9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJkZWxldGUtYWNjb3VudC1jb25maXJtLWJ1dHRvblwiXG4gICAgICAgID5cbiAgICAgICAgICB7dCgnRGVsZXRlJyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBvbkNsb3NlPy4oZSwgJ2JhY2tkcm9wQ2xpY2snKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICBkaXNhYmxlZD17aXNEZWxldGluZ31cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImRlbGV0ZS1hY2NvdW50LWNhbmNlbC1idXR0b25cIlxuICAgICAgICA+XG4gICAgICAgICAge3QoJ0NhbmNlbCcpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvRGlhbG9nQWN0aW9ucz5cbiAgICA8L0RpYWxvZz5cbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxuICBUeXBvZ3JhcGh5UHJvcHMsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUsIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcblxudHlwZSBPdmVyZmxvd2luZ1R5cG9ncmFwaHlQcm9wcyA9IE9taXQ8VHlwb2dyYXBoeVByb3BzLCAnY2hpbGRyZW4nPiAmIHtcbiAgY2hpbGRyZW4/OiBSZWFjdE5vZGU7XG4gIGRpc2FibGVJbnRlcmFjdGl2ZT86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgY29uc3QgT3ZlcmZsb3dpbmdUeXBvZ3JhcGh5ID0gKHtcbiAgY2hpbGRyZW4sXG4gIGRpc2FibGVJbnRlcmFjdGl2ZSxcbiAgc3gsXG4gIC4uLnByb3BzXG59OiBPdmVyZmxvd2luZ1R5cG9ncmFwaHlQcm9wcykgPT4ge1xuICBjb25zdCBbaXNPdmVyZmxvd2luZywgc2V0SXNPdmVyZmxvd2luZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IG9uVHlwb2dyYXBoeU1vdW50ZWQgPSB1c2VDYWxsYmFjaygobm9kZTogSFRNTFNwYW5FbGVtZW50KSA9PiB7XG4gICAgaWYgKG5vZGUpIHtcbiAgICAgIHNldElzT3ZlcmZsb3dpbmcobm9kZS5zY3JvbGxXaWR0aCA+IG5vZGUub2Zmc2V0V2lkdGgpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPFRvb2x0aXBcbiAgICAgIHRpdGxlPXtpc092ZXJmbG93aW5nID8gY2hpbGRyZW4gOiAnJ31cbiAgICAgIHBsYWNlbWVudD1cInRvcFwiXG4gICAgICB3cmFwV2l0aFNwYW49e2ZhbHNlfVxuICAgICAgZGlzYWJsZUludGVyYWN0aXZlPXtkaXNhYmxlSW50ZXJhY3RpdmUgPz8gdHJ1ZX1cbiAgICA+XG4gICAgICA8VHlwb2dyYXBoeVxuICAgICAgICByZWY9e29uVHlwb2dyYXBoeU1vdW50ZWR9XG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgIC4uLnN4LFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgPC9Ub29sdGlwPlxuICApO1xufTtcbiIsImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgRGlhbG9nLFxuICBEaWFsb2dDb250ZW50LFxuICBEaWFsb2dUaXRsZSxcbiAgSWNvbkJ1dHRvbixcbiAgU3RhY2ssXG4gIFRleHRGaWVsZCxcbiAgWENpcmNsZUZpbGxlZEljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VLZXlib2FyZFNob3J0Y3V0cyB9IGZyb20gJ0BzcmMvaG9va3MvdXNlS2V5Ym9hcmRTaG9ydGN1dHMnO1xuXG5leHBvcnQgY29uc3QgUmVuYW1lRGlhbG9nID0gKHtcbiAgaXNPcGVuLFxuICBpc1NhdmluZyxcbiAgb25DbG9zZSxcbiAgdGl0bGUsXG4gIGN1cnJlbnROYW1lLFxuICBvblNhdmUsXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgW25ld05hbWUsIHNldE5ld05hbWVdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBrZXlib2FyZFNob3J0Y3V0cyA9IHVzZUtleWJvYXJkU2hvcnRjdXRzKHtcbiAgICBFbnRlcjogKCkgPT4gb25TYXZlKG5ld05hbWUpLFxuICAgIEVzY2FwZTogb25DbG9zZSxcbiAgfSk7XG4gIHJldHVybiAoXG4gICAgPERpYWxvZ1xuICAgICAgb3Blbj17aXNPcGVufVxuICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgIHNob3dDbG9zZUljb249e2ZhbHNlfVxuICAgICAgUGFwZXJQcm9wcz17e1xuICAgICAgICBzeDogeyBtOiAyLCB3aWR0aDogMSB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8RGlhbG9nVGl0bGUgdHlwb2dyYXBoeVByb3BzPXt7IGZvbnRTaXplOiAyMCB9fT57dGl0bGV9PC9EaWFsb2dUaXRsZT5cbiAgICAgIDxEaWFsb2dDb250ZW50IHN4PXt7IHB0OiAxLjUgfX0+XG4gICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtjdXJyZW50TmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17KGV2KSA9PiBzZXROZXdOYW1lKGV2LnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgdmFsdWU9e25ld05hbWV9XG4gICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgSW5wdXRQcm9wcz17e1xuICAgICAgICAgICAgZW5kQWRvcm5tZW50OiAoXG4gICAgICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgIHNldE5ld05hbWUoJycpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnZ3JleS41MDAnLFxuICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogbmV3TmFtZS50cmltKCkgPyAndmlzaWJsZScgOiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFhDaXJjbGVGaWxsZWRJY29uIHNpemU9ezIwfSAvPlxuICAgICAgICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgICAgICApLFxuICAgICAgICAgIH19XG4gICAgICAgICAgey4uLmtleWJvYXJkU2hvcnRjdXRzfVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwicmVuYW1lLWFjY291bnQtaW5wdXRcIlxuICAgICAgICAvPlxuICAgICAgPC9EaWFsb2dDb250ZW50PlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgcHg6IDMsXG4gICAgICAgICAgcHk6IDIsXG4gICAgICAgICAgbXQ6IDUuNSxcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgZ2FwOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgZGlzYWJsZWQ9e2lzU2F2aW5nfVxuICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgc2V0TmV3TmFtZSgnJyk7XG4gICAgICAgICAgICBvbkNsb3NlKCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImFib3J0LXJlbmFtaW5nXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgIGRpc2FibGVkPXtpc1NhdmluZyB8fCBuZXdOYW1lLnRyaW0oKS5sZW5ndGggPT09IDB9XG4gICAgICAgICAgaXNMb2FkaW5nPXtpc1NhdmluZ31cbiAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgb25TYXZlKG5ld05hbWUpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjb25maXJtLXJlbmFtaW5nXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdTYXZlJyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L0RpYWxvZz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG5pbXBvcnQgeyB1c2VTY29wZWRUb2FzdCB9IGZyb20gJ0BzcmMvaG9va3MvdXNlU2NvcGVkVG9hc3QnO1xuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcblxuaW1wb3J0IHsgQ29uZmlybUFjY291bnRSZW1vdmFsRGlhbG9nIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Db25maXJtQWNjb3VudFJlbW92YWxEaWFsb2cnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQWNjb3VudE1hbmFnZXIgfSBmcm9tICcuLi9wcm92aWRlcnMvQWNjb3VudE1hbmFnZXJQcm92aWRlcic7XG5cbmV4cG9ydCBjb25zdCB1c2VBY2NvdW50UmVtb3ZhbCA9IChhY2NvdW50SWRzOiBzdHJpbmdbXSkgPT4ge1xuICBjb25zdCBbaXNQcm9tcHRlZCwgc2V0SXNQcm9tcHRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc0RlbGV0aW5nLCBzZXRJc0RlbGV0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgZXhpdE1hbmFnZU1vZGUgfSA9IHVzZUFjY291bnRNYW5hZ2VyKCk7XG4gIGNvbnN0IHsgZGVsZXRlQWNjb3VudHMgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgdG9hc3QgPSB1c2VTY29wZWRUb2FzdCgnYWNjb3VudC1zd2l0Y2hlcicpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuXG4gIGNvbnN0IGNvbmZpcm0gPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgc2V0SXNEZWxldGluZyh0cnVlKTtcbiAgICBkZWxldGVBY2NvdW50cyhhY2NvdW50SWRzKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBjYXB0dXJlKCdBY2NvdW50RGVsZXRlU3VjY2VlZGVkJyk7XG4gICAgICAgIHNldElzUHJvbXB0ZWQoZmFsc2UpO1xuICAgICAgICBleGl0TWFuYWdlTW9kZSgpO1xuICAgICAgICBoaXN0b3J5LnJlcGxhY2UoJy9hY2NvdW50cycpO1xuICAgICAgICB0b2FzdC5zdWNjZXNzKFxuICAgICAgICAgIHQoJ1N1Y2Nlc3NmdWxseSBkZWxldGVkIHt7bnVtYmVyfX0gYWNjb3VudChzKScsIHtcbiAgICAgICAgICAgIG51bWJlcjogYWNjb3VudElkcy5sZW5ndGgsXG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgdG9hc3QuZXJyb3IodCgnQWNjb3VudChzKSByZW1vdmFsIGhhcyBmYWlsZWQhJyksIHsgZHVyYXRpb246IDIwMDAgfSk7XG4gICAgICAgIGNhcHR1cmUoJ0FjY291bnREZWxldGVGYWlsZWQnKTtcbiAgICAgIH0pXG4gICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgIHNldElzRGVsZXRpbmcoZmFsc2UpO1xuICAgICAgfSk7XG4gIH0sIFthY2NvdW50SWRzLCBjYXB0dXJlLCBkZWxldGVBY2NvdW50cywgZXhpdE1hbmFnZU1vZGUsIGhpc3RvcnksIHQsIHRvYXN0XSk7XG5cbiAgY29uc3QgcHJvbXB0ID0gdXNlQ2FsbGJhY2soKCkgPT4gc2V0SXNQcm9tcHRlZCh0cnVlKSwgW10pO1xuICBjb25zdCBjYW5jZWwgPSB1c2VDYWxsYmFjaygoKSA9PiBzZXRJc1Byb21wdGVkKGZhbHNlKSwgW10pO1xuXG4gIGNvbnN0IHJlbmRlckRpYWxvZyA9IHVzZUNhbGxiYWNrKFxuICAgICgpID0+IChcbiAgICAgIDxDb25maXJtQWNjb3VudFJlbW92YWxEaWFsb2dcbiAgICAgICAgaXNEZWxldGluZz17aXNEZWxldGluZ31cbiAgICAgICAgb3Blbj17aXNQcm9tcHRlZH1cbiAgICAgICAgaXNNdWx0aXBsZT17YWNjb3VudElkcy5sZW5ndGggPiAxfVxuICAgICAgICBvbkNvbmZpcm09e2NvbmZpcm19XG4gICAgICAgIG9uQ2xvc2U9e2NhbmNlbH1cbiAgICAgIC8+XG4gICAgKSxcbiAgICBbaXNEZWxldGluZywgaXNQcm9tcHRlZCwgYWNjb3VudElkcywgY2FuY2VsLCBjb25maXJtXSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHByb21wdCxcbiAgICByZW5kZXJEaWFsb2csXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyB1c2VTY29wZWRUb2FzdCB9IGZyb20gJ0BzcmMvaG9va3MvdXNlU2NvcGVkVG9hc3QnO1xuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcblxuaW1wb3J0IHsgdXNlRW50aXR5UmVuYW1lIH0gZnJvbSAnLi91c2VFbnRpdHlSZW5hbWUnO1xuXG5leHBvcnQgY29uc3QgdXNlQWNjb3VudFJlbmFtZSA9IChhY2NvdW50PzogQWNjb3VudCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgcmVuYW1lQWNjb3VudCB9ID0gdXNlQWNjb3VudHNDb250ZXh0KCk7XG4gIGNvbnN0IHRvYXN0ID0gdXNlU2NvcGVkVG9hc3QoJ2FjY291bnQtc3dpdGNoZXInKTtcblxuICBjb25zdCBvbkZhaWx1cmUgPSB1c2VDYWxsYmFjayhcbiAgICAoKSA9PiB0b2FzdC5zdWNjZXNzKHQoJ1JlbmFtaW5nIGZhaWxlZCcpLCB7IGR1cmF0aW9uOiAxMDAwIH0pLFxuICAgIFt0b2FzdCwgdF0sXG4gICk7XG4gIGNvbnN0IG9uU3VjY2VzcyA9IHVzZUNhbGxiYWNrKFxuICAgICgpID0+IHRvYXN0LnN1Y2Nlc3ModCgnQWNjb3VudCByZW5hbWVkJyksIHsgZHVyYXRpb246IDEwMDAgfSksXG4gICAgW3RvYXN0LCB0XSxcbiAgKTtcbiAgY29uc3QgdXBkYXRlRm4gPSB1c2VDYWxsYmFjayhcbiAgICAobmV3TmFtZTogc3RyaW5nKSA9PlxuICAgICAgYWNjb3VudD8uaWQgPyByZW5hbWVBY2NvdW50KGFjY291bnQuaWQsIG5ld05hbWUudHJpbSgpKSA6IHVuZGVmaW5lZCxcbiAgICBbcmVuYW1lQWNjb3VudCwgYWNjb3VudD8uaWRdLFxuICApO1xuXG4gIHJldHVybiB1c2VFbnRpdHlSZW5hbWUoe1xuICAgIGN1cnJlbnROYW1lOiBhY2NvdW50Py5uYW1lID8/ICcnLFxuICAgIGRpYWxvZ1RpdGxlOiB0KCdSZW5hbWUgQWNjb3VudCcpLFxuICAgIHVwZGF0ZUZuLFxuICAgIG9uRmFpbHVyZSxcbiAgICBvblN1Y2Nlc3MsXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IHVzZVNjb3BlZFRvYXN0IH0gZnJvbSAnQHNyYy9ob29rcy91c2VTY29wZWRUb2FzdCc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgUmVuYW1lRGlhbG9nIH0gZnJvbSAnLi4vY29tcG9uZW50cy9SZW5hbWVEaWFsb2cnO1xuXG5leHBvcnQgY29uc3QgdXNlRW50aXR5UmVuYW1lID0gKHtcbiAgdXBkYXRlRm4sXG4gIGN1cnJlbnROYW1lLFxuICBkaWFsb2dUaXRsZSxcbiAgb25TdWNjZXNzLFxuICBvbkZhaWx1cmUsXG59KSA9PiB7XG4gIGNvbnN0IFtpc1NhdmluZywgc2V0SXNTYXZpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNSZW5hbWluZywgc2V0SXNSZW5hbWluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB0b2FzdCA9IHVzZVNjb3BlZFRvYXN0KCdhY2NvdW50LXN3aXRjaGVyJyk7XG5cbiAgY29uc3QgcHJvbXB0ID0gdXNlQ2FsbGJhY2soKCkgPT4gc2V0SXNSZW5hbWluZyh0cnVlKSwgW10pO1xuICBjb25zdCBjYW5jZWwgPSB1c2VDYWxsYmFjaygoKSA9PiBzZXRJc1JlbmFtaW5nKGZhbHNlKSwgW10pO1xuICBjb25zdCBjb25maXJtID0gdXNlQ2FsbGJhY2soXG4gICAgKG5ld05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKG5ld05hbWUgPT09IGN1cnJlbnROYW1lKSB7XG4gICAgICAgIHNldElzUmVuYW1pbmcoZmFsc2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdOYW1lLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdG9hc3QuZXJyb3IodCgnTmV3IG5hbWUgaXMgcmVxdWlyZWQnKSwgeyBkdXJhdGlvbjogMTAwMCB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXRJc1NhdmluZyh0cnVlKTtcbiAgICAgIHVwZGF0ZUZuKG5ld05hbWUudHJpbSgpKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgc2V0SXNSZW5hbWluZyhmYWxzZSk7XG4gICAgICAgICAgb25TdWNjZXNzKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChvbkZhaWx1cmUpXG4gICAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICBzZXRJc1NhdmluZyhmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgW3VwZGF0ZUZuLCBjdXJyZW50TmFtZSwgb25TdWNjZXNzLCBvbkZhaWx1cmUsIHQsIHRvYXN0XSxcbiAgKTtcblxuICBjb25zdCByZW5kZXJEaWFsb2cgPSB1c2VDYWxsYmFjayhcbiAgICAoKSA9PiAoXG4gICAgICA8UmVuYW1lRGlhbG9nXG4gICAgICAgIHRpdGxlPXtkaWFsb2dUaXRsZX1cbiAgICAgICAgY3VycmVudE5hbWU9e2N1cnJlbnROYW1lfVxuICAgICAgICBpc09wZW49e2lzUmVuYW1pbmd9XG4gICAgICAgIGlzU2F2aW5nPXtpc1NhdmluZ31cbiAgICAgICAgb25DbG9zZT17Y2FuY2VsfVxuICAgICAgICBvblNhdmU9e2NvbmZpcm19XG4gICAgICAvPlxuICAgICksXG4gICAgW2N1cnJlbnROYW1lLCBkaWFsb2dUaXRsZSwgY2FuY2VsLCBjb25maXJtLCBpc1JlbmFtaW5nLCBpc1NhdmluZ10sXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9tcHQsXG4gICAgcmVuZGVyRGlhbG9nLFxuICB9O1xufTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG5pbXBvcnQgeyB1c2VBbmFseXRpY3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BbmFseXRpY3NQcm92aWRlcic7XG5pbXBvcnQgeyBBY2NvdW50LCBBY2NvdW50VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgU2VjcmV0VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9zZWNyZXRzL21vZGVscyc7XG5cbmV4cG9ydCBjb25zdCB1c2VQcml2YXRlS2V5RXhwb3J0ID0gKFxuICBhY2NvdW50PzogQWNjb3VudCxcbiAgd2FsbGV0VHlwZT86IFNlY3JldFR5cGUsXG4pID0+IHtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG5cbiAgY29uc3QgaXNQcml2YXRlS2V5QXZhaWxhYmxlID0gdXNlTWVtbyhcbiAgICAoKSA9PlxuICAgICAgYWNjb3VudD8udHlwZSA9PT0gQWNjb3VudFR5cGUuSU1QT1JURUQgfHxcbiAgICAgIChhY2NvdW50Py50eXBlID09PSBBY2NvdW50VHlwZS5QUklNQVJZICYmXG4gICAgICAgIHdhbGxldFR5cGUgPT09IFNlY3JldFR5cGUuTW5lbW9uaWMpLFxuICAgIFthY2NvdW50Py50eXBlLCB3YWxsZXRUeXBlXSxcbiAgKTtcblxuICBjb25zdCBzaG93UHJpdmF0ZUtleSA9IHVzZUNhbGxiYWNrKFxuICAgIChlOiBFdmVudCkgPT4ge1xuICAgICAgY2FwdHVyZSgnRXhwb3J0UHJpdmF0ZUtleUNsaWNrZWQnKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBoaXN0b3J5LnB1c2goYC9leHBvcnQtcHJpdmF0ZS1rZXk/YWNjb3VudElkPSR7YWNjb3VudD8uaWR9YCk7XG4gICAgfSxcbiAgICBbYWNjb3VudD8uaWQsIGNhcHR1cmUsIGhpc3RvcnldLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc2hvd1ByaXZhdGVLZXksXG4gICAgaXNQcml2YXRlS2V5QXZhaWxhYmxlLFxuICB9O1xufTtcbiIsImltcG9ydCB7XG4gIGNyZWF0ZUNvbnRleHQsXG4gIHVzZUNhbGxiYWNrLFxuICB1c2VDb250ZXh0LFxuICB1c2VFZmZlY3QsXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB7IEZlYXR1cmVHYXRlcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9mZWF0dXJlRmxhZ3MvbW9kZWxzJztcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcbmltcG9ydCB7IGlzUHJpbWFyeUFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvdXRpbHMvdHlwZUd1YXJkcyc7XG5cbmludGVyZmFjZSBBY2NvdW50TWFuYWdlckNvbnRleHRQcm9wcyB7XG4gIGNoaWxkcmVuPzogUmVhY3QuUmVhY3ROb2RlO1xufVxuXG5leHBvcnQgY29uc3QgQWNjb3VudE1hbmFnZXJDb250ZXh0ID0gY3JlYXRlQ29udGV4dDx7XG4gIGV4aXRNYW5hZ2VNb2RlKCk6IHZvaWQ7XG4gIGlzTWFuYWdlTW9kZTogYm9vbGVhbjtcbiAgaXNBY2NvdW50U2VsZWN0YWJsZShhY2NvdW50OiBBY2NvdW50KTogYm9vbGVhbjtcbiAgc2VsZWN0ZWRBY2NvdW50czogc3RyaW5nW107XG4gIHNlbGVjdEFjY291bnQoYWNjb3VudElkOiBzdHJpbmcpOiB2b2lkO1xuICBkZXNlbGVjdEFjY291bnQoYWNjb3VudElkOiBzdHJpbmcsIGRlc2VsZWN0UHJldmlvdXM/OiBib29sZWFuKTogdm9pZDtcbiAgdG9nZ2xlTWFuYWdlTW9kZShuZXdWYWx1ZT86IGJvb2xlYW4pOiB2b2lkO1xufT4oe1xuICBleGl0TWFuYWdlTW9kZSgpIHt9LFxuICBpc01hbmFnZU1vZGU6IGZhbHNlLFxuICBpc0FjY291bnRTZWxlY3RhYmxlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgc2VsZWN0ZWRBY2NvdW50czogW10sXG4gIHNlbGVjdEFjY291bnQoKSB7fSxcbiAgZGVzZWxlY3RBY2NvdW50KCkge30sXG4gIHRvZ2dsZU1hbmFnZU1vZGUoKSB7fSxcbn0pO1xuXG5leHBvcnQgZW51bSBTZWxlY3Rpb25Nb2RlIHtcbiAgTm9uZSwgLy8gUmVzZXJ2ZWQgZm9yIFNlZWRsZXNzXG4gIEFueSxcbiAgQ29uc2VjdXRpdmUsXG59XG5cbmV4cG9ydCBjb25zdCBBY2NvdW50TWFuYWdlclByb3ZpZGVyID0gKHtcbiAgY2hpbGRyZW4sXG59OiBBY2NvdW50TWFuYWdlckNvbnRleHRQcm9wcykgPT4ge1xuICBjb25zdCB7IGFjY291bnRzIH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcbiAgY29uc3QgeyBmZWF0dXJlRmxhZ3MgfSA9IHVzZUZlYXR1cmVGbGFnQ29udGV4dCgpO1xuICBjb25zdCBbc2VsZWN0ZWRBY2NvdW50cywgc2V0U2VsZWN0ZWRBY2NvdW50c10gPSB1c2VTdGF0ZTxzdHJpbmdbXT4oW10pO1xuICBjb25zdCBbaXNNYW5hZ2VNb2RlLCBzZXRJc01hbmFnZU1vZGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGlzQWNjb3VudFNlbGVjdGFibGUgPSB1c2VDYWxsYmFjayhcbiAgICAoYWNjb3VudDogQWNjb3VudCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICAhZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5QUklNQVJZX0FDQ09VTlRfUkVNT1ZBTF0gfHxcbiAgICAgICAgIWlzUHJpbWFyeUFjY291bnQoYWNjb3VudClcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gYWNjb3VudC5pZCBpbiBhY2NvdW50cy5pbXBvcnRlZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBpZDogYWNjb3VudElkLCB3YWxsZXRJZCB9ID0gYWNjb3VudDtcblxuICAgICAgaWYgKHNlbGVjdGVkQWNjb3VudHMuaW5jbHVkZXMoYWNjb3VudElkKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgd2FsbGV0UHJpbWFyeUFjY291bnRzID0gYWNjb3VudHMucHJpbWFyeVt3YWxsZXRJZF07XG5cbiAgICAgIGlmICghd2FsbGV0UHJpbWFyeUFjY291bnRzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWxsQWNjb3VudHNDb3VudCA9IE9iamVjdC52YWx1ZXMoYWNjb3VudHMucHJpbWFyeSkuZmxhdCgpLmxlbmd0aDtcbiAgICAgIGlmIChhbGxBY2NvdW50c0NvdW50IC0gMSA9PT0gc2VsZWN0ZWRBY2NvdW50cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gd2FsbGV0UHJpbWFyeUFjY291bnRzXG4gICAgICAgIC5zbGljZSh3YWxsZXRQcmltYXJ5QWNjb3VudHMuaW5kZXhPZihhY2NvdW50KSArIDEpXG4gICAgICAgIC5ldmVyeSgoeyBpZCB9KSA9PiBzZWxlY3RlZEFjY291bnRzLmluY2x1ZGVzKGlkKSk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIFtmZWF0dXJlRmxhZ3MsIHNlbGVjdGVkQWNjb3VudHMsIGFjY291bnRzLnByaW1hcnksIGFjY291bnRzLmltcG9ydGVkXSxcbiAgKTtcblxuICBjb25zdCBzZWxlY3RBY2NvdW50ID0gdXNlQ2FsbGJhY2soKGFjY291bnRJZDogc3RyaW5nKSA9PiB7XG4gICAgc2V0U2VsZWN0ZWRBY2NvdW50cygoY3VycmVudFNldCkgPT4ge1xuICAgICAgcmV0dXJuIFsuLi5jdXJyZW50U2V0LCBhY2NvdW50SWRdO1xuICAgIH0pO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgZGVzZWxlY3RBY2NvdW50ID0gdXNlQ2FsbGJhY2soXG4gICAgKGFjY291bnRJZDogc3RyaW5nLCBkZXNlbGVjdFByZXZpb3VzID0gZmFsc2UpID0+IHtcbiAgICAgIHNldFNlbGVjdGVkQWNjb3VudHMoKGN1cnJlbnRTZXQpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBjdXJyZW50U2V0LmluZGV4T2YoYWNjb3VudElkKTtcblxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRTZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50U2V0LnNwbGljZShcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBkZXNlbGVjdFByZXZpb3VzID8gY3VycmVudFNldC5sZW5ndGggLSBpbmRleCA6IDEsXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oY3VycmVudFNldCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFtdLFxuICApO1xuXG4gIGNvbnN0IHRvZ2dsZU1hbmFnZU1vZGUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0SXNNYW5hZ2VNb2RlKCh3YXNNYW5hZ2VNb2RlRW5hYmxlZCkgPT4gIXdhc01hbmFnZU1vZGVFbmFibGVkKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGV4aXRNYW5hZ2VNb2RlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldElzTWFuYWdlTW9kZShmYWxzZSk7XG4gICAgc2V0U2VsZWN0ZWRBY2NvdW50cyhbXSk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFNlbGVjdGVkQWNjb3VudHMoW10pO1xuICB9LCBbaXNNYW5hZ2VNb2RlXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8QWNjb3VudE1hbmFnZXJDb250ZXh0LlByb3ZpZGVyXG4gICAgICB2YWx1ZT17e1xuICAgICAgICBleGl0TWFuYWdlTW9kZSxcbiAgICAgICAgaXNBY2NvdW50U2VsZWN0YWJsZSxcbiAgICAgICAgaXNNYW5hZ2VNb2RlLFxuICAgICAgICBzZWxlY3RlZEFjY291bnRzLFxuICAgICAgICBzZWxlY3RBY2NvdW50LFxuICAgICAgICBkZXNlbGVjdEFjY291bnQsXG4gICAgICAgIHRvZ2dsZU1hbmFnZU1vZGUsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0FjY291bnRNYW5hZ2VyQ29udGV4dC5Qcm92aWRlcj5cbiAgKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBY2NvdW50TWFuYWdlcigpIHtcbiAgcmV0dXJuIHVzZUNvbnRleHQoQWNjb3VudE1hbmFnZXJDb250ZXh0KTtcbn1cbiJdLCJuYW1lcyI6WyJBY2NvdW50VHlwZSIsImlzRmlyZWJsb2Nrc0FjY291bnQiLCJhY2NvdW50IiwidHlwZSIsIkZJUkVCTE9DS1MiLCJpc1dhbGxldENvbm5lY3RBY2NvdW50IiwiV0FMTEVUX0NPTk5FQ1QiLCJpc1ByaW1hcnlBY2NvdW50IiwiUFJJTUFSWSIsImlzSW1wb3J0ZWRBY2NvdW50IiwiQm9vbGVhbiIsInVzZUNhbGxiYWNrIiwidXNlS2V5Ym9hcmRTaG9ydGN1dHMiLCJzaG9ydGN1dHMiLCJvbktleURvd24iLCJldmVudCIsImNhbGxiYWNrIiwia2V5IiwicHJldmVudERlZmF1bHQiLCJ0b2FzdCIsInVzZVNjb3BlZFRvYXN0IiwiaWQiLCJzdWNjZXNzIiwibWVzc2FnZSIsIm9wdHMiLCJkaXNtaXNzIiwiZXJyb3IiLCJCdXR0b24iLCJEaWFsb2ciLCJEaWFsb2dBY3Rpb25zIiwiRGlhbG9nQ29udGVudCIsIkRpYWxvZ1RpdGxlIiwiVHlwb2dyYXBoeSIsInVzZVRyYW5zbGF0aW9uIiwiQ29uZmlybUFjY291bnRSZW1vdmFsRGlhbG9nIiwib25DbG9zZSIsIm9uQ29uZmlybSIsImlzTXVsdGlwbGUiLCJpc0RlbGV0aW5nIiwicHJvcHMiLCJ0IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiX2V4dGVuZHMiLCJQYXBlclByb3BzIiwic3giLCJtIiwidGV4dEFsaWduIiwidmFyaWFudCIsImdhcCIsIm9uQ2xpY2siLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwic2l6ZSIsImRpc2FibGVkIiwiaXNMb2FkaW5nIiwiVG9vbHRpcCIsInVzZVN0YXRlIiwiT3ZlcmZsb3dpbmdUeXBvZ3JhcGh5IiwiY2hpbGRyZW4iLCJkaXNhYmxlSW50ZXJhY3RpdmUiLCJpc092ZXJmbG93aW5nIiwic2V0SXNPdmVyZmxvd2luZyIsIm9uVHlwb2dyYXBoeU1vdW50ZWQiLCJub2RlIiwic2Nyb2xsV2lkdGgiLCJvZmZzZXRXaWR0aCIsInRpdGxlIiwicGxhY2VtZW50Iiwid3JhcFdpdGhTcGFuIiwicmVmIiwidGV4dE92ZXJmbG93Iiwib3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwiSWNvbkJ1dHRvbiIsIlN0YWNrIiwiVGV4dEZpZWxkIiwiWENpcmNsZUZpbGxlZEljb24iLCJSZW5hbWVEaWFsb2ciLCJpc09wZW4iLCJpc1NhdmluZyIsImN1cnJlbnROYW1lIiwib25TYXZlIiwibmV3TmFtZSIsInNldE5ld05hbWUiLCJrZXlib2FyZFNob3J0Y3V0cyIsIkVudGVyIiwiRXNjYXBlIiwib3BlbiIsInNob3dDbG9zZUljb24iLCJ3aWR0aCIsInR5cG9ncmFwaHlQcm9wcyIsImZvbnRTaXplIiwicHQiLCJwbGFjZWhvbGRlciIsIm9uQ2hhbmdlIiwiZXYiLCJ0YXJnZXQiLCJ2YWx1ZSIsImF1dG9Gb2N1cyIsIklucHV0UHJvcHMiLCJlbmRBZG9ybm1lbnQiLCJjb2xvciIsInZpc2liaWxpdHkiLCJ0cmltIiwicHgiLCJweSIsIm10IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiZnVsbFdpZHRoIiwibGVuZ3RoIiwidXNlSGlzdG9yeSIsInVzZUFjY291bnRzQ29udGV4dCIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJ1c2VBY2NvdW50TWFuYWdlciIsInVzZUFjY291bnRSZW1vdmFsIiwiYWNjb3VudElkcyIsImlzUHJvbXB0ZWQiLCJzZXRJc1Byb21wdGVkIiwic2V0SXNEZWxldGluZyIsImV4aXRNYW5hZ2VNb2RlIiwiZGVsZXRlQWNjb3VudHMiLCJjYXB0dXJlIiwiaGlzdG9yeSIsImNvbmZpcm0iLCJ0aGVuIiwicmVwbGFjZSIsIm51bWJlciIsImNhdGNoIiwiZHVyYXRpb24iLCJmaW5hbGx5IiwicHJvbXB0IiwiY2FuY2VsIiwicmVuZGVyRGlhbG9nIiwidXNlRW50aXR5UmVuYW1lIiwidXNlQWNjb3VudFJlbmFtZSIsInJlbmFtZUFjY291bnQiLCJvbkZhaWx1cmUiLCJvblN1Y2Nlc3MiLCJ1cGRhdGVGbiIsInVuZGVmaW5lZCIsIm5hbWUiLCJkaWFsb2dUaXRsZSIsInNldElzU2F2aW5nIiwiaXNSZW5hbWluZyIsInNldElzUmVuYW1pbmciLCJ1c2VNZW1vIiwiU2VjcmV0VHlwZSIsInVzZVByaXZhdGVLZXlFeHBvcnQiLCJ3YWxsZXRUeXBlIiwiaXNQcml2YXRlS2V5QXZhaWxhYmxlIiwiSU1QT1JURUQiLCJNbmVtb25pYyIsInNob3dQcml2YXRlS2V5IiwicHVzaCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlRWZmZWN0IiwidXNlRmVhdHVyZUZsYWdDb250ZXh0IiwiRmVhdHVyZUdhdGVzIiwiQWNjb3VudE1hbmFnZXJDb250ZXh0IiwiaXNNYW5hZ2VNb2RlIiwiaXNBY2NvdW50U2VsZWN0YWJsZSIsInNlbGVjdGVkQWNjb3VudHMiLCJzZWxlY3RBY2NvdW50IiwiZGVzZWxlY3RBY2NvdW50IiwidG9nZ2xlTWFuYWdlTW9kZSIsIlNlbGVjdGlvbk1vZGUiLCJBY2NvdW50TWFuYWdlclByb3ZpZGVyIiwiYWNjb3VudHMiLCJmZWF0dXJlRmxhZ3MiLCJzZXRTZWxlY3RlZEFjY291bnRzIiwic2V0SXNNYW5hZ2VNb2RlIiwiUFJJTUFSWV9BQ0NPVU5UX1JFTU9WQUwiLCJpbXBvcnRlZCIsImFjY291bnRJZCIsIndhbGxldElkIiwiaW5jbHVkZXMiLCJ3YWxsZXRQcmltYXJ5QWNjb3VudHMiLCJwcmltYXJ5IiwiYWxsQWNjb3VudHNDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZsYXQiLCJzbGljZSIsImluZGV4T2YiLCJldmVyeSIsImN1cnJlbnRTZXQiLCJkZXNlbGVjdFByZXZpb3VzIiwiaW5kZXgiLCJzcGxpY2UiLCJBcnJheSIsImZyb20iLCJ3YXNNYW5hZ2VNb2RlRW5hYmxlZCIsIlByb3ZpZGVyIl0sInNvdXJjZVJvb3QiOiIifQ==