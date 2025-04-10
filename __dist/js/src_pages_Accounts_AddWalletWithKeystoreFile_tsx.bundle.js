"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Accounts_AddWalletWithKeystoreFile_tsx"],{

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

/***/ "./src/pages/Accounts/AddWalletWithKeystoreFile.tsx":
/*!**********************************************************!*\
  !*** ./src/pages/Accounts/AddWalletWithKeystoreFile.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddWalletWithKeystoreFile": () => (/* binding */ AddWalletWithKeystoreFile)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/keystore/models */ "./src/utils/keystore/models.ts");
/* harmony import */ var _src_hooks_useErrorMessage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/hooks/useErrorMessage */ "./src/hooks/useErrorMessage.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useKeyboardShortcuts */ "./src/hooks/useKeyboardShortcuts.ts");
/* harmony import */ var _components_KeystoreFileError__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/KeystoreFileError */ "./src/pages/Accounts/components/KeystoreFileError.tsx");
/* harmony import */ var _components_KeystoreFileUpload__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/KeystoreFileUpload */ "./src/pages/Accounts/components/KeystoreFileUpload.tsx");
/* harmony import */ var _hooks_useKeystoreFileImport__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./hooks/useKeystoreFileImport */ "./src/pages/Accounts/hooks/useKeystoreFileImport.ts");
/* harmony import */ var _components_KeystoreFileConfirmation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/KeystoreFileConfirmation */ "./src/pages/Accounts/components/KeystoreFileConfirmation.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");














var Step = /*#__PURE__*/function (Step) {
  Step[Step["ChooseFile"] = 0] = "ChooseFile";
  Step[Step["ProvidePassword"] = 1] = "ProvidePassword";
  Step[Step["ConfirmData"] = 2] = "ConfirmData";
  Step[Step["Error"] = 3] = "Error";
  return Step;
}(Step || {});
const EMPTY_FILE_INFO = {
  seedPhrasesCount: 0,
  privateKeysCount: 0
};
function AddWalletWithKeystoreFile() {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__["default"])();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_12__.useHistory)();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_13__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__.useAnalyticsContext)();
  const getTranslatedError = (0,_src_hooks_useErrorMessage__WEBPACK_IMPORTED_MODULE_4__.useErrorMessage)();
  const [step, setStep] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(Step.ChooseFile);
  const [file, setFile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [filePassword, setFilePassword] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [fileInfo, setFileInfo] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(EMPTY_FILE_INFO);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const inputRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const {
    getKeyCounts,
    importKeystoreFile,
    isImporting,
    isReading,
    isValidKeystoreFile
  } = (0,_hooks_useKeystoreFileImport__WEBPACK_IMPORTED_MODULE_9__.useKeystoreFileImport)();
  const {
    title: errorMessage
  } = getTranslatedError(error);
  const restart = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    setError(null);
    setFile(null);
    setFileInfo(EMPTY_FILE_INFO);
    setFilePassword('');
    setStep(Step.ChooseFile);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);
  const onFileSelected = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async rawFile => {
    if (!rawFile) {
      setError(_src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_3__.KeystoreError.InvalidVersion);
      setStep(Step.Error);
      return;
    }
    setFile(rawFile);
    if (await isValidKeystoreFile(rawFile)) {
      setStep(Step.ProvidePassword);
    } else {
      capture('KeystoreFileUnsupported');
      setError(_src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_3__.KeystoreError.InvalidVersion);
      setStep(Step.Error);
    }
  }, [capture, isValidKeystoreFile]);
  const handleDrop = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async ev => {
    const item = ev.dataTransfer.items[0];
    if (!item) {
      return;
    }
    const rawFile = item.getAsFile();
    await onFileSelected(rawFile);
  }, [onFileSelected]);
  const handleImport = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async () => {
    if (!file || isReading || isImporting) {
      return;
    }
    try {
      capture('KeystoreFileImportStarted');
      await importKeystoreFile(file, filePassword);
      capture('KeystoreFileImportSuccess');
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__["default"].success(t('Successfully imported the keystore file.'));
      history.replace('/accounts');
    } catch (err) {
      capture('KeystoreFileImportFailure');
      setError(err);
      setStep(Step.Error);
    }
  }, [capture, file, filePassword, history, importKeystoreFile, isImporting, isReading, t]);
  const readKeystoreFile = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async () => {
    if (!file || isReading || isImporting) {
      return;
    }
    try {
      const info = await getKeyCounts(file, filePassword);
      setFileInfo(info);
      setStep(Step.ConfirmData);
    } catch (err) {
      // For wrong password we only highlight the text field.
      if (err !== _src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_3__.KeystoreError.InvalidPassword) {
        setStep(Step.Error);
      }
      setError(err);
      setFileInfo(EMPTY_FILE_INFO);
    }
  }, [file, filePassword, getKeyCounts, isImporting, isReading]);
  const keyboardHandlers = (0,_src_hooks_useKeyboardShortcuts__WEBPACK_IMPORTED_MODULE_6__.useKeyboardShortcuts)({
    Enter: readKeystoreFile,
    Escape: restart
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    sx: {
      width: '100%',
      height: '100%',
      background: theme.palette.background.paper
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Stack, {
    direction: "row",
    sx: {
      mt: 2.5,
      mb: 0.5,
      pr: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__.PageTitle, {
    onBackClick: () => history.replace('/accounts')
  }, t('Add Wallet with Keystore File'))), (step === Step.ChooseFile || step === Step.ProvidePassword) && /*#__PURE__*/React.createElement(_components_KeystoreFileUpload__WEBPACK_IMPORTED_MODULE_8__.KeystoreFileUpload, {
    inputRef: inputRef,
    onDrop: handleDrop,
    onFileSelected: async ev => {
      if (ev.target.files?.[0]) {
        await onFileSelected(ev.target.files[0]);
      }
    }
  }), file && step === Step.ConfirmData && /*#__PURE__*/React.createElement(_components_KeystoreFileConfirmation__WEBPACK_IMPORTED_MODULE_10__.KeystoreFileConfirmation, {
    fileName: file.name,
    fileInfo: fileInfo,
    isLoading: isReading || isImporting,
    onConfirm: handleImport,
    onCancel: restart
  }), error && step === Step.Error && /*#__PURE__*/React.createElement(_components_KeystoreFileError__WEBPACK_IMPORTED_MODULE_7__.KeystoreFileError, {
    error: error,
    onTryAgain: restart
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Dialog, {
    open: step === Step.ProvidePassword,
    fullWidth: true,
    onClose: restart,
    PaperProps: {
      sx: {
        m: 2,
        width: '100%',
        maxWidth: 'none'
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.DialogTitle, null, t('Password Required')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.DialogContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Typography, {
    variant: "body2"
  }, t('Please enter the keystore file password to continue.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.TextField, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    autoFocus: true,
    "data-testid": "keystore-file-password",
    fullWidth: true,
    label: t('Password'),
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: 'body2.fontSize',
        mb: 1,
        mt: 4
      }
    },
    helperText: error === _src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_3__.KeystoreError.InvalidPassword ? errorMessage : t('This password was set when you created the keystore file.'),
    error: error === _src_utils_keystore_models__WEBPACK_IMPORTED_MODULE_3__.KeystoreError.InvalidPassword,
    placeholder: t('Input Password'),
    value: filePassword,
    type: "password",
    onChange: ev => setFilePassword(ev.target.value)
  }, keyboardHandlers))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.DialogActions, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Button, {
    key: "continue-upload",
    size: "large",
    disabled: !filePassword || !file || isReading,
    isLoading: isReading,
    fullWidth: true,
    onClick: readKeystoreFile,
    "data-testid": "continue-upload"
  }, t('Continue Upload')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_15__.Button, {
    key: "cancel-upload",
    variant: "text",
    size: "large",
    fullWidth: true,
    onClick: restart,
    "data-testid": "back-button"
  }, t('Back'))))));
}

/***/ }),

/***/ "./src/pages/Accounts/components/KeystoreFileConfirmation.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/Accounts/components/KeystoreFileConfirmation.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeystoreFileConfirmation": () => (/* binding */ KeystoreFileConfirmation)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const KeystoreFileConfirmation = ({
  fileName,
  fileInfo,
  isLoading,
  onConfirm,
  onCancel
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_0__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      px: 2,
      pt: 1,
      flexGrow: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'semibold'
    }
  }, t('Import Details')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Card, {
    sx: {
      backgroundColor: 'grey.800',
      p: 2,
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    direction: "row",
    sx: {
      width: 1,
      mb: 2,
      gap: 2,
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    fontWeight: "semibold",
    whiteSpace: "nowrap",
    sx: {
      flexShrink: 0
    }
  }, t('File Name')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
    title: fileName,
    wrapWithSpan: false
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2",
    sx: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
  }, fileName))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      width: 1,
      px: 2,
      py: 1,
      backgroundColor: 'grey.850',
      borderRadius: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2"
  }, t('Recovery Phrases')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h5",
    "data-testid": "seed-phrase-count"
  }, fileInfo.seedPhrasesCount)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      width: 1,
      px: 2,
      py: 1,
      backgroundColor: 'grey.850',
      borderRadius: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "body2"
  }, t('Private Keys')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h5",
    "data-testid": "private-key-count"
  }, fileInfo.privateKeysCount)))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      my: 3,
      gap: 1,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    size: "large",
    fullWidth: true,
    onClick: onConfirm,
    disabled: isLoading,
    isLoading: isLoading,
    "data-testid": "import-keystore-file"
  }, t('Import Keystore File')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    size: "large",
    color: "secondary",
    fullWidth: true,
    disabled: isLoading,
    onClick: onCancel,
    "data-testid": "cancel-button"
  }, t('Cancel'))));
};

/***/ }),

/***/ "./src/pages/Accounts/components/KeystoreFileError.tsx":
/*!*************************************************************!*\
  !*** ./src/pages/Accounts/components/KeystoreFileError.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeystoreFileError": () => (/* binding */ KeystoreFileError)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_hooks_useErrorMessage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useErrorMessage */ "./src/hooks/useErrorMessage.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const KeystoreFileError = ({
  error,
  onTryAgain
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const getTranslatedError = (0,_src_hooks_useErrorMessage__WEBPACK_IMPORTED_MODULE_0__.useErrorMessage)();
  const {
    title,
    hint
  } = getTranslatedError(error);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      px: 2,
      pt: 1,
      flexGrow: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'semibold'
    }
  }, t('Upload Keystore File')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Card, {
    sx: {
      backgroundColor: 'grey.800',
      px: 4,
      py: 8
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AlertCircleIcon, {
    size: 64
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "h6"
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, hint)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    size: "medium",
    fullWidth: true,
    onClick: onTryAgain,
    "data-testid": "try-again-button"
  }, t('Try Again')))));
};

/***/ }),

/***/ "./src/pages/Accounts/components/KeystoreFileUpload.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/Accounts/components/KeystoreFileUpload.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeystoreFileUpload": () => (/* binding */ KeystoreFileUpload)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const KeystoreFileUpload = ({
  inputRef,
  onDrop,
  onFileSelected
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const [isDraggingOver, setIsDraggingOver] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      px: 2,
      pt: 1,
      flexGrow: 1,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'semibold'
    }
  }, t('Upload Keystore File')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Card, {
    sx: {
      backgroundColor: 'grey.800',
      p: 4,
      transition: theme.transitions.create(['border', 'color']),
      color: isDraggingOver ? theme.palette.info.light : 'initial',
      border: `2px dotted ${isDraggingOver ? theme.palette.info.light : 'transparent'}`
    },
    onDrop: ev => {
      ev.preventDefault();
      setIsDraggingOver(false);
      onDrop(ev);
    },
    onDragOver: ev => ev.preventDefault(),
    onDragEnter: () => {
      setIsDraggingOver(true);
    },
    onDragLeave: () => {
      setIsDraggingOver(false);
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      pointerEvents: isDraggingOver ? 'none' : 'all',
      // prevents dragLeave event from firing when dragging over child elements
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.UploadIcon, {
    size: 64
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "h6",
    color: "text.primary"
  }, t('Drop your file here to upload')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, t('Only keystore files exported from the Avalanche Wallet are supported.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "h5",
    color: "text.secondary",
    sx: {
      my: 2
    }
  }, t('Or')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    size: "medium",
    fullWidth: true,
    component: "label",
    htmlFor: "browse-files",
    "data-testid": "browse-files"
  }, t('Browse Files')), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "file",
    hidden: true,
    id: "browse-files",
    onChange: onFileSelected
  }))));
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/useImportSeedphrase.ts":
/*!*********************************************************!*\
  !*** ./src/pages/Accounts/hooks/useImportSeedphrase.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useImportSeedphrase": () => (/* binding */ useImportSeedphrase)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");



const useImportSeedphrase = () => {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__.useConnectionContext)();
  const [isImporting, setIsImporting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const importSeedphrase = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async params => {
    setIsImporting(true);
    try {
      const result = await request({
        method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_1__.ExtensionRequest.WALLET_IMPORT_SEED_PHRASE,
        params: [params]
      });
      return result;
    } finally {
      setIsImporting(false);
    }
  }, [request]);
  return {
    isImporting,
    importSeedphrase
  };
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/useJsonFileReader.ts":
/*!*******************************************************!*\
  !*** ./src/pages/Accounts/hooks/useJsonFileReader.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useJsonFileReader": () => (/* binding */ useJsonFileReader)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const readJsonFile = async jsonFile => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.onload = () => {
    try {
      resolve(JSON.parse(fr.result));
    } catch (err) {
      reject(err.toString());
    }
  };
  fr.onerror = () => {
    reject(fr.error);
  };
  fr.readAsText(jsonFile);
});
const useJsonFileReader = () => {
  const [isReading, setIsReading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const read = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async file => {
    setIsReading(true);
    try {
      return await readJsonFile(file);
    } finally {
      setIsReading(false);
    }
  }, []);
  return {
    read,
    isReading
  };
};

/***/ }),

/***/ "./src/pages/Accounts/hooks/useKeystoreFileImport.ts":
/*!***********************************************************!*\
  !*** ./src/pages/Accounts/hooks/useKeystoreFileImport.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useKeystoreFileImport": () => (/* binding */ useKeystoreFileImport)
/* harmony export */ });
/* harmony import */ var joi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! joi */ "./node_modules/joi/lib/index.js");
/* harmony import */ var joi__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(joi__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* harmony import */ var _src_utils_keystore_keystore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/keystore/keystore */ "./src/utils/keystore/keystore.ts");
/* harmony import */ var _src_background_services_wallet_handlers_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/wallet/handlers/models */ "./src/background/services/wallet/handlers/models.ts");
/* harmony import */ var _src_utils_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/errors */ "./src/utils/errors/index.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _useImportSeedphrase__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./useImportSeedphrase */ "./src/pages/Accounts/hooks/useImportSeedphrase.ts");
/* harmony import */ var _usePrivateKeyImport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./usePrivateKeyImport */ "./src/pages/Accounts/hooks/usePrivateKeyImport.ts");
/* harmony import */ var _useJsonFileReader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./useJsonFileReader */ "./src/pages/Accounts/hooks/useJsonFileReader.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js")["Buffer"];











const useKeystoreFileImport = () => {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_5__.useAnalyticsContext)();
  const {
    isReading,
    read
  } = (0,_useJsonFileReader__WEBPACK_IMPORTED_MODULE_8__.useJsonFileReader)();
  const {
    isImporting: isImportingSeedphrase,
    importSeedphrase
  } = (0,_useImportSeedphrase__WEBPACK_IMPORTED_MODULE_6__.useImportSeedphrase)();
  const {
    isImporting: isImportingPrivateKey,
    importPrivateKey
  } = (0,_usePrivateKeyImport__WEBPACK_IMPORTED_MODULE_7__.usePrivateKeyImport)();
  const {
    selectAccount
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_9__.useAccountsContext)();
  const extractKeys = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (file, password) => {
    const data = await read(file);
    capture('KeystoreFileProvided', {
      version: data.version
    });
    const decryptedFile = await (0,_src_utils_keystore_keystore__WEBPACK_IMPORTED_MODULE_2__.readKeyFile)(data, password);
    const keys = (0,_src_utils_keystore_keystore__WEBPACK_IMPORTED_MODULE_2__.extractKeysFromDecryptedFile)(decryptedFile);
    return keys;
  }, [capture, read]);
  const importKeystoreFile = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (file, password) => {
    const keys = await extractKeys(file, password);

    // We need to import all keys one by one.
    for (let i = 0; i < keys.length; i++) {
      const keyData = keys[i];
      if (!keyData) {
        continue;
      }
      const {
        key,
        type
      } = keyData;
      if (type === 'singleton') {
        // Keystore files have the private keys base58check-encoded, but
        // we need them in hex format.
        const privateKey = Buffer.from(_avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_10__.utils.base58check.decode(key.replace('PrivateKey-', ''))).toString('hex');
        const accountId = await importPrivateKey(privateKey);
        await selectAccount(accountId);
      } else if (type === 'mnemonic') {
        try {
          await importSeedphrase({
            mnemonic: key
          });
        } catch (err) {
          if ((0,_src_utils_errors__WEBPACK_IMPORTED_MODULE_4__.isWrappedError)(err) && err.data.reason === _src_background_services_wallet_handlers_models__WEBPACK_IMPORTED_MODULE_3__.SeedphraseImportError.ExistingSeedphrase) {
            // If the seedphrase was already imported, just ignore the error.
            continue;
          }
          throw err;
        }
      }
    }
  }, [extractKeys, importPrivateKey, importSeedphrase, selectAccount]);
  const getKeyCounts = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async (file, password) => {
    const keys = await extractKeys(file, password);
    return keys.reduce((counts, key) => {
      if (key.type === 'mnemonic') {
        counts.seedPhrasesCount += 1;
      } else if (key.type === 'singleton') {
        counts.privateKeysCount += 1;
      }
      return counts;
    }, {
      seedPhrasesCount: 0,
      privateKeysCount: 0
    });
  }, [extractKeys]);
  const isValidKeystoreFile = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async file => {
    try {
      const data = await read(file);
      const result = KEYSTORE_FILE_SCHEMA.validate(data);
      return !result.error;
    } catch {
      return false;
    }
  }, [read]);
  return {
    getKeyCounts,
    importKeystoreFile,
    isImporting: isImportingSeedphrase || isImportingPrivateKey,
    isReading,
    isValidKeystoreFile
  };
};
const KEYSTORE_FILE_SCHEMA = joi__WEBPACK_IMPORTED_MODULE_0___default().object({
  version: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
  salt: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
  keys: joi__WEBPACK_IMPORTED_MODULE_0___default().array().items(joi__WEBPACK_IMPORTED_MODULE_0___default().object({
    key: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required(),
    iv: joi__WEBPACK_IMPORTED_MODULE_0___default().string().required()
  }).unknown())
}).unknown();

/***/ }),

/***/ "./src/pages/Accounts/hooks/usePrivateKeyImport.ts":
/*!*********************************************************!*\
  !*** ./src/pages/Accounts/hooks/usePrivateKeyImport.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "usePrivateKeyImport": () => (/* binding */ usePrivateKeyImport)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* harmony import */ var _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/monitoring/sentryCaptureException */ "./src/monitoring/sentryCaptureException.ts");
/* harmony import */ var _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/accounts/models */ "./src/background/services/accounts/models.ts");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");





const usePrivateKeyImport = () => {
  const [isImporting, setIsImporting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    addAccount
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_3__.useAccountsContext)();
  const importPrivateKey = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async privateKey => {
    setIsImporting(true);
    try {
      const accountId = await addAccount('', {
        importType: _src_background_services_accounts_models__WEBPACK_IMPORTED_MODULE_2__.ImportType.PRIVATE_KEY,
        data: _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_4__.utils.strip0x(privateKey)
      });
      return accountId;
    } catch (err) {
      (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__["default"])(err, _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__.SentryExceptionTypes.WALLET_IMPORT);
      throw err;
    } finally {
      setIsImporting(false);
    }
  }, [addAccount]);
  return {
    isImporting,
    importPrivateKey
  };
};

/***/ }),

/***/ "./src/utils/keystore/cryptoHelpers.ts":
/*!*********************************************!*\
  !*** ./src/utils/keystore/cryptoHelpers.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calculatePasswordHash": () => (/* binding */ calculatePasswordHash),
/* harmony export */   "decrypt": () => (/* binding */ decrypt),
/* harmony export */   "getHash": () => (/* binding */ getHash)
/* harmony export */ });
/* harmony import */ var _noble_hashes_sha256__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @noble/hashes/sha256 */ "./node_modules/@noble/hashes/esm/sha256.js");
/* harmony import */ var _noble_hashes_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @noble/hashes/utils */ "./node_modules/@noble/hashes/esm/utils.js");
/**
 * Helper utilities for encryption and password hashing, browser-safe.
 * Encryption is using AES-GCM with a random public nonce.
 */



const SALT_SIZE = 16;
const AES_LENGTH = 256;
const TAG_LENGTH = 128;
const KEYGEN_ITERATIONS_V3 = 200000; // v3 and and any version above

const makeSalt = () => (0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_0__.randomBytes)(SALT_SIZE);
const getHash = (password, salt) => (0,_noble_hashes_sha256__WEBPACK_IMPORTED_MODULE_1__.sha256)((0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_0__.concatBytes)((0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_0__.utf8ToBytes)(password), salt));
const calculatePasswordHash = (password, salt) => {
  let slt;
  if (salt instanceof Uint8Array) {
    slt = salt;
  } else {
    slt = makeSalt();
  }
  const hash = getHash(password, getHash(password, slt));
  return {
    salt: slt,
    hash
  };
};
const importKey = async pwkey => crypto.subtle.importKey('raw', pwkey, {
  name: 'PBKDF2'
}, false, ['deriveKey']);
const deriveKey = async (keyMaterial, salt, iterations = KEYGEN_ITERATIONS_V3) => crypto.subtle.deriveKey({
  name: 'PBKDF2',
  salt,
  iterations,
  hash: 'SHA-256'
}, keyMaterial, {
  name: 'AES-GCM',
  length: AES_LENGTH
}, false, ['encrypt', 'decrypt']);
const decrypt = async (password, ciphertext, salt, iv, keygenIterations) => {
  const pwkey = getHash(password, salt);
  const keyMaterial = await importKey(pwkey);
  const pkey = await deriveKey(keyMaterial, salt, keygenIterations);
  const pt = await crypto.subtle.decrypt({
    name: 'AES-GCM',
    iv,
    // The initialization vector you used to encrypt
    additionalData: salt,
    // The additionalData you used to encrypt (if any)
    tagLength: TAG_LENGTH // The tagLength you used to encrypt (if any)
  }, pkey,
  // from importKey above
  ciphertext // ArrayBuffer of the data
  );

  return new Uint8Array(pt);
};

/***/ }),

/***/ "./src/utils/keystore/keystore.ts":
/*!****************************************!*\
  !*** ./src/utils/keystore/keystore.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KEYSTORE_VERSION": () => (/* binding */ KEYSTORE_VERSION),
/* harmony export */   "extractKeysFromDecryptedFile": () => (/* binding */ extractKeysFromDecryptedFile),
/* harmony export */   "readKeyFile": () => (/* binding */ readKeyFile)
/* harmony export */ });
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bip39 */ "./node_modules/bip39/src/index.js");
/* harmony import */ var _noble_hashes_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @noble/hashes/utils */ "./node_modules/@noble/hashes/esm/utils.js");
/* harmony import */ var _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/avalanchejs */ "./node_modules/@avalabs/avalanchejs/dist/es/index.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models */ "./src/utils/keystore/models.ts");
/* harmony import */ var _cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cryptoHelpers */ "./src/utils/keystore/cryptoHelpers.ts");
/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js")["Buffer"];





const KEYSTORE_VERSION = '6.0';
const KEYGEN_ITERATIONS_V2 = 100000;
async function readV2(data, pass) {
  const version = data.version;
  const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
  const checkHash = (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.getHash)(pass, salt);
  const checkHashString = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode((0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_4__.toBytes)(checkHash));
  if (checkHashString !== data.pass_hash) {
    throw _models__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
  }
  const decryptedKeys = await Promise.all(data.keys.map(async keyData => {
    const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
    const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
    const decryptedKey = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce, KEYGEN_ITERATIONS_V2);
    return {
      key: _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(decryptedKey)
    };
  }));
  return {
    version,
    activeIndex: 0,
    keys: decryptedKeys
  };
}
async function readV3(data, pass) {
  const version = data.version;
  const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
  const checkHash = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.calculatePasswordHash)(pass, salt);
  const checkHashString = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(checkHash.hash);
  if (checkHashString !== data.pass_hash) {
    throw _models__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
  }
  const decryptedKeys = await Promise.all(data.keys.map(async keyData => {
    const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
    const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
    const decryptedKey = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce);
    return {
      key: _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(decryptedKey)
    };
  }));
  return {
    version,
    activeIndex: 0,
    keys: decryptedKeys
  };
}
async function readV4(data, pass) {
  const version = data.version;
  const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
  const checkHash = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.calculatePasswordHash)(pass, salt);
  const checkHashString = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(checkHash.hash);
  if (checkHashString !== data.pass_hash) {
    throw _models__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
  }
  const decryptedKeys = await Promise.all(data.keys.map(async keyData => {
    const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
    const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
    const decryptedKey = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce);
    return {
      key: _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(decryptedKey)
    };
  }));
  return {
    version,
    activeIndex: 0,
    keys: decryptedKeys
  };
}
async function readV5(data, pass) {
  const version = data.version;
  const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
  const checkHash = await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.calculatePasswordHash)(pass, salt);
  const checkHashString = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.encode(checkHash.hash);
  if (checkHashString !== data.pass_hash) {
    throw _models__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
  }
  const decoder = new TextDecoder();
  const decryptedKeys = await Promise.all(data.keys.map(async keyData => {
    const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
    const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
    return {
      key: decoder.decode(await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce))
    };
  }));
  return {
    version,
    activeIndex: 0,
    keys: decryptedKeys
  };
}
async function readV6(data, pass) {
  const version = data.version;
  const activeIndex = data.activeIndex;
  const salt = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(data.salt);
  const decoder = new TextDecoder();
  const decryptedKeys = await Promise.all(data.keys.map(async keyData => {
    const key = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.key);
    const nonce = _avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(keyData.iv);
    try {
      return {
        key: decoder.decode(await (0,_cryptoHelpers__WEBPACK_IMPORTED_MODULE_2__.decrypt)(pass, key, salt, nonce)),
        type: keyData.type
      };
    } catch (_err) {
      throw _models__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidPassword;
    }
  }));
  return {
    version,
    activeIndex: activeIndex || 0,
    keys: decryptedKeys
  };
}
async function readKeyFile(data, pass) {
  switch (data.version) {
    case '6.0':
      return await readV6(data, pass);
    case '5.0':
      return await readV5(data, pass);
    case '4.0':
      return await readV4(data, pass);
    case '3.0':
      return await readV3(data, pass);
    case '2.0':
      return await readV2(data, pass);
    default:
      throw _models__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidVersion;
  }
}
function extractKeysV2({
  keys
}) {
  return keys.map(key => {
    const keyBuf = Buffer.from(_avalabs_avalanchejs__WEBPACK_IMPORTED_MODULE_3__.utils.base58check.decode(key.key));
    const keyHex = keyBuf.toString('hex');
    const paddedKeyHex = keyHex.padStart(64, '0');
    const mnemonic = bip39__WEBPACK_IMPORTED_MODULE_0__.entropyToMnemonic(paddedKeyHex);
    return {
      key: mnemonic,
      type: 'mnemonic'
    };
  });
}
function extractKeysV5(file) {
  return file.keys.map(key => ({
    key: key.key,
    type: 'mnemonic'
  }));
}
function extractKeysV6(file) {
  return file.keys.map(key => ({
    type: key.type,
    key: key.key
  }));
}
function extractKeysFromDecryptedFile(file) {
  switch (file.version) {
    case '6.0':
      return extractKeysV6(file);
    case '5.0':
      return extractKeysV5(file);
    case '4.0':
      return extractKeysV2(file);
    case '3.0':
      return extractKeysV2(file);
    case '2.0':
      return extractKeysV2(file);
    default:
      throw _models__WEBPACK_IMPORTED_MODULE_1__.KeystoreError.InvalidVersion;
  }
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FjY291bnRzX0FkZFdhbGxldFdpdGhLZXlzdG9yZUZpbGVfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUEwRDtBQU1uRCxNQUFNQyxvQkFBb0IsR0FBSUMsU0FBNEIsSUFBSztFQUNwRSxNQUFNQyxTQUErQixHQUFHSCxrREFBVyxDQUNqRCxNQUFPSSxLQUFLLElBQUs7SUFDZixNQUFNQyxRQUFRLEdBQUdILFNBQVMsQ0FBQ0UsS0FBSyxDQUFDRSxHQUFHLENBQUM7SUFFckMsSUFBSSxPQUFPRCxRQUFRLEtBQUssVUFBVSxFQUFFO01BQ2xDRCxLQUFLLENBQUNHLGNBQWMsRUFBRTtNQUN0QixNQUFNRixRQUFRLEVBQUU7SUFDbEI7RUFDRixDQUFDLEVBQ0QsQ0FBQ0gsU0FBUyxDQUFDLENBQ1o7RUFFRCxPQUFPO0lBQ0xDO0VBQ0YsQ0FBQztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEJ1RTtBQVluQztBQUNTO0FBQ0M7QUFFYztBQUl6QjtBQUN5QjtBQUNTO0FBQ0M7QUFFSjtBQUNFO0FBQ0M7QUFDVztBQUFBLElBRTVFMkIsSUFBSSwwQkFBSkEsSUFBSTtFQUFKQSxJQUFJLENBQUpBLElBQUk7RUFBSkEsSUFBSSxDQUFKQSxJQUFJO0VBQUpBLElBQUksQ0FBSkEsSUFBSTtFQUFKQSxJQUFJLENBQUpBLElBQUk7RUFBQSxPQUFKQSxJQUFJO0FBQUEsRUFBSkEsSUFBSTtBQU9ULE1BQU1DLGVBQXdDLEdBQUc7RUFDL0NDLGdCQUFnQixFQUFFLENBQUM7RUFDbkJDLGdCQUFnQixFQUFFO0FBQ3BCLENBQUM7QUFFTSxTQUFTQyx5QkFBeUJBLENBQUEsRUFBRztFQUMxQyxNQUFNQyxLQUFLLEdBQUdoQix3RUFBUSxFQUFFO0VBQ3hCLE1BQU1pQixPQUFPLEdBQUdoQiw2REFBVSxFQUFFO0VBQzVCLE1BQU07SUFBRWlCO0VBQUUsQ0FBQyxHQUFHaEIsOERBQWMsRUFBRTtFQUM5QixN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dEQsT0FBTztNQUNMalMsR0FBRyxFQUFFc04sUUFBUTtNQUNibEcsSUFBSSxFQUFFO0lBQ1IsQ0FBQztFQUNILENBQUMsQ0FBQztBQUNKO0FBRUEsU0FBU2dMLGFBQWFBLENBQUMvUCxJQUF3QixFQUErQjtFQUM1RSxPQUFPQSxJQUFJLENBQUN1SyxJQUFJLENBQUN1RSxHQUFHLENBQUVuUixHQUFHLEtBQU07SUFDN0JBLEdBQUcsRUFBRUEsR0FBRyxDQUFDQSxHQUFHO0lBQ1pvSCxJQUFJLEVBQUU7RUFDUixDQUFDLENBQUMsQ0FBQztBQUNMO0FBRUEsU0FBU2lMLGFBQWFBLENBQUNoUSxJQUF3QixFQUErQjtFQUM1RSxPQUFPQSxJQUFJLENBQUN1SyxJQUFJLENBQUN1RSxHQUFHLENBQUVuUixHQUFHLEtBQU07SUFDN0JvSCxJQUFJLEVBQUVwSCxHQUFHLENBQUNvSCxJQUFJO0lBQ2RwSCxHQUFHLEVBQUVBLEdBQUcsQ0FBQ0E7RUFDWCxDQUFDLENBQUMsQ0FBQztBQUNMO0FBRU8sU0FBUzZMLDRCQUE0QkEsQ0FDMUN4SixJQUE4QixFQUNEO0VBQzdCLFFBQVFBLElBQUksQ0FBQ3FLLE9BQU87SUFDbEIsS0FBSyxLQUFLO01BQ1IsT0FBTzJGLGFBQWEsQ0FBQ2hRLElBQUksQ0FBdUI7SUFDbEQsS0FBSyxLQUFLO01BQ1IsT0FBTytQLGFBQWEsQ0FBQy9QLElBQUksQ0FBdUI7SUFDbEQsS0FBSyxLQUFLO01BQ1IsT0FBT3lQLGFBQWEsQ0FBQ3pQLElBQUksQ0FBdUI7SUFDbEQsS0FBSyxLQUFLO01BQ1IsT0FBT3lQLGFBQWEsQ0FBQ3pQLElBQUksQ0FBdUI7SUFDbEQsS0FBSyxLQUFLO01BQ1IsT0FBT3lQLGFBQWEsQ0FBQ3pQLElBQUksQ0FBdUI7SUFDbEQ7TUFDRSxNQUFNcEIsaUVBQTRCO0VBQUM7QUFFekMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZUtleWJvYXJkU2hvcnRjdXRzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvQWNjb3VudHMvQWRkV2FsbGV0V2l0aEtleXN0b3JlRmlsZS50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9jb21wb25lbnRzL0tleXN0b3JlRmlsZUNvbmZpcm1hdGlvbi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9jb21wb25lbnRzL0tleXN0b3JlRmlsZUVycm9yLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2NvbXBvbmVudHMvS2V5c3RvcmVGaWxlVXBsb2FkLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2hvb2tzL3VzZUltcG9ydFNlZWRwaHJhc2UudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9ob29rcy91c2VKc29uRmlsZVJlYWRlci50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2hvb2tzL3VzZUtleXN0b3JlRmlsZUltcG9ydC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL2hvb2tzL3VzZVByaXZhdGVLZXlJbXBvcnQudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9rZXlzdG9yZS9jcnlwdG9IZWxwZXJzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMva2V5c3RvcmUva2V5c3RvcmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgS2V5Ym9hcmRFdmVudEhhbmRsZXIsIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuXG50eXBlIENhbGxiYWNrID0gKCkgPT4gdm9pZDtcbnR5cGUgS2V5TmFtZXMgPSAnRW50ZXInIHwgJ0VzY2FwZSc7XG50eXBlIEtleWJvYXJkU2hvcnRjdXRzID0gUGFydGlhbDxSZWNvcmQ8S2V5TmFtZXMsIENhbGxiYWNrPj47XG5cbmV4cG9ydCBjb25zdCB1c2VLZXlib2FyZFNob3J0Y3V0cyA9IChzaG9ydGN1dHM6IEtleWJvYXJkU2hvcnRjdXRzKSA9PiB7XG4gIGNvbnN0IG9uS2V5RG93bjogS2V5Ym9hcmRFdmVudEhhbmRsZXIgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gc2hvcnRjdXRzW2V2ZW50LmtleV07XG5cbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYXdhaXQgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtzaG9ydGN1dHNdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgb25LZXlEb3duLFxuICB9O1xufTtcbiIsImltcG9ydCB7IERyYWdFdmVudEhhbmRsZXIsIHVzZUNhbGxiYWNrLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBEaWFsb2csXG4gIERpYWxvZ0FjdGlvbnMsXG4gIERpYWxvZ0NvbnRlbnQsXG4gIERpYWxvZ1RpdGxlLFxuICBTdGFjayxcbiAgVGV4dEZpZWxkLFxuICBUeXBvZ3JhcGh5LFxuICB0b2FzdCxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQge1xuICBLZXlzdG9yZUVycm9yLFxuICBLZXlzdG9yZUZpbGVDb250ZW50SW5mbyxcbn0gZnJvbSAnQHNyYy91dGlscy9rZXlzdG9yZS9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy9ob29rcy91c2VFcnJvck1lc3NhZ2UnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlS2V5Ym9hcmRTaG9ydGN1dHMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUtleWJvYXJkU2hvcnRjdXRzJztcblxuaW1wb3J0IHsgS2V5c3RvcmVGaWxlRXJyb3IgfSBmcm9tICcuL2NvbXBvbmVudHMvS2V5c3RvcmVGaWxlRXJyb3InO1xuaW1wb3J0IHsgS2V5c3RvcmVGaWxlVXBsb2FkIH0gZnJvbSAnLi9jb21wb25lbnRzL0tleXN0b3JlRmlsZVVwbG9hZCc7XG5pbXBvcnQgeyB1c2VLZXlzdG9yZUZpbGVJbXBvcnQgfSBmcm9tICcuL2hvb2tzL3VzZUtleXN0b3JlRmlsZUltcG9ydCc7XG5pbXBvcnQgeyBLZXlzdG9yZUZpbGVDb25maXJtYXRpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvS2V5c3RvcmVGaWxlQ29uZmlybWF0aW9uJztcblxuZW51bSBTdGVwIHtcbiAgQ2hvb3NlRmlsZSxcbiAgUHJvdmlkZVBhc3N3b3JkLFxuICBDb25maXJtRGF0YSxcbiAgRXJyb3IsXG59XG5cbmNvbnN0IEVNUFRZX0ZJTEVfSU5GTzogS2V5c3RvcmVGaWxlQ29udGVudEluZm8gPSB7XG4gIHNlZWRQaHJhc2VzQ291bnQ6IDAsXG4gIHByaXZhdGVLZXlzQ291bnQ6IDAsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQWRkV2FsbGV0V2l0aEtleXN0b3JlRmlsZSgpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuICBjb25zdCBnZXRUcmFuc2xhdGVkRXJyb3IgPSB1c2VFcnJvck1lc3NhZ2UoKTtcblxuICBjb25zdCBbc3RlcCwgc2V0U3RlcF0gPSB1c2VTdGF0ZShTdGVwLkNob29zZUZpbGUpO1xuICBjb25zdCBbZmlsZSwgc2V0RmlsZV0gPSB1c2VTdGF0ZTxGaWxlIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtmaWxlUGFzc3dvcmQsIHNldEZpbGVQYXNzd29yZF0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtmaWxlSW5mbywgc2V0RmlsZUluZm9dID0gdXNlU3RhdGUoRU1QVFlfRklMRV9JTkZPKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTx1bmtub3duPigpO1xuICBjb25zdCBpbnB1dFJlZiA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50PihudWxsKTtcbiAgY29uc3Qge1xuICAgIGdldEtleUNvdW50cyxcbiAgICBpbXBvcnRLZXlzdG9yZUZpbGUsXG4gICAgaXNJbXBvcnRpbmcsXG4gICAgaXNSZWFkaW5nLFxuICAgIGlzVmFsaWRLZXlzdG9yZUZpbGUsXG4gIH0gPSB1c2VLZXlzdG9yZUZpbGVJbXBvcnQoKTtcblxuICBjb25zdCB7IHRpdGxlOiBlcnJvck1lc3NhZ2UgfSA9IGdldFRyYW5zbGF0ZWRFcnJvcihlcnJvcik7XG5cbiAgY29uc3QgcmVzdGFydCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRFcnJvcihudWxsKTtcbiAgICBzZXRGaWxlKG51bGwpO1xuICAgIHNldEZpbGVJbmZvKEVNUFRZX0ZJTEVfSU5GTyk7XG4gICAgc2V0RmlsZVBhc3N3b3JkKCcnKTtcbiAgICBzZXRTdGVwKFN0ZXAuQ2hvb3NlRmlsZSk7XG5cbiAgICBpZiAoaW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgaW5wdXRSZWYuY3VycmVudC52YWx1ZSA9ICcnO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IG9uRmlsZVNlbGVjdGVkID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHJhd0ZpbGU6IEZpbGUgfCBudWxsKSA9PiB7XG4gICAgICBpZiAoIXJhd0ZpbGUpIHtcbiAgICAgICAgc2V0RXJyb3IoS2V5c3RvcmVFcnJvci5JbnZhbGlkVmVyc2lvbik7XG4gICAgICAgIHNldFN0ZXAoU3RlcC5FcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2V0RmlsZShyYXdGaWxlKTtcblxuICAgICAgaWYgKGF3YWl0IGlzVmFsaWRLZXlzdG9yZUZpbGUocmF3RmlsZSkpIHtcbiAgICAgICAgc2V0U3RlcChTdGVwLlByb3ZpZGVQYXNzd29yZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYXB0dXJlKCdLZXlzdG9yZUZpbGVVbnN1cHBvcnRlZCcpO1xuICAgICAgICBzZXRFcnJvcihLZXlzdG9yZUVycm9yLkludmFsaWRWZXJzaW9uKTtcbiAgICAgICAgc2V0U3RlcChTdGVwLkVycm9yKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtjYXB0dXJlLCBpc1ZhbGlkS2V5c3RvcmVGaWxlXSxcbiAgKTtcblxuICBjb25zdCBoYW5kbGVEcm9wOiBEcmFnRXZlbnRIYW5kbGVyID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKGV2KSA9PiB7XG4gICAgICBjb25zdCBpdGVtID0gZXYuZGF0YVRyYW5zZmVyLml0ZW1zWzBdO1xuXG4gICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByYXdGaWxlID0gaXRlbS5nZXRBc0ZpbGUoKTtcbiAgICAgIGF3YWl0IG9uRmlsZVNlbGVjdGVkKHJhd0ZpbGUpO1xuICAgIH0sXG4gICAgW29uRmlsZVNlbGVjdGVkXSxcbiAgKTtcblxuICBjb25zdCBoYW5kbGVJbXBvcnQgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFmaWxlIHx8IGlzUmVhZGluZyB8fCBpc0ltcG9ydGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjYXB0dXJlKCdLZXlzdG9yZUZpbGVJbXBvcnRTdGFydGVkJyk7XG4gICAgICBhd2FpdCBpbXBvcnRLZXlzdG9yZUZpbGUoZmlsZSwgZmlsZVBhc3N3b3JkKTtcbiAgICAgIGNhcHR1cmUoJ0tleXN0b3JlRmlsZUltcG9ydFN1Y2Nlc3MnKTtcblxuICAgICAgdG9hc3Quc3VjY2Vzcyh0KCdTdWNjZXNzZnVsbHkgaW1wb3J0ZWQgdGhlIGtleXN0b3JlIGZpbGUuJykpO1xuXG4gICAgICBoaXN0b3J5LnJlcGxhY2UoJy9hY2NvdW50cycpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY2FwdHVyZSgnS2V5c3RvcmVGaWxlSW1wb3J0RmFpbHVyZScpO1xuICAgICAgc2V0RXJyb3IoZXJyKTtcbiAgICAgIHNldFN0ZXAoU3RlcC5FcnJvcik7XG4gICAgfVxuICB9LCBbXG4gICAgY2FwdHVyZSxcbiAgICBmaWxlLFxuICAgIGZpbGVQYXNzd29yZCxcbiAgICBoaXN0b3J5LFxuICAgIGltcG9ydEtleXN0b3JlRmlsZSxcbiAgICBpc0ltcG9ydGluZyxcbiAgICBpc1JlYWRpbmcsXG4gICAgdCxcbiAgXSk7XG5cbiAgY29uc3QgcmVhZEtleXN0b3JlRmlsZSA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWZpbGUgfHwgaXNSZWFkaW5nIHx8IGlzSW1wb3J0aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGluZm8gPSBhd2FpdCBnZXRLZXlDb3VudHMoZmlsZSwgZmlsZVBhc3N3b3JkKTtcbiAgICAgIHNldEZpbGVJbmZvKGluZm8pO1xuICAgICAgc2V0U3RlcChTdGVwLkNvbmZpcm1EYXRhKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIEZvciB3cm9uZyBwYXNzd29yZCB3ZSBvbmx5IGhpZ2hsaWdodCB0aGUgdGV4dCBmaWVsZC5cbiAgICAgIGlmIChlcnIgIT09IEtleXN0b3JlRXJyb3IuSW52YWxpZFBhc3N3b3JkKSB7XG4gICAgICAgIHNldFN0ZXAoU3RlcC5FcnJvcik7XG4gICAgICB9XG4gICAgICBzZXRFcnJvcihlcnIpO1xuICAgICAgc2V0RmlsZUluZm8oRU1QVFlfRklMRV9JTkZPKTtcbiAgICB9XG4gIH0sIFtmaWxlLCBmaWxlUGFzc3dvcmQsIGdldEtleUNvdW50cywgaXNJbXBvcnRpbmcsIGlzUmVhZGluZ10pO1xuXG4gIGNvbnN0IGtleWJvYXJkSGFuZGxlcnMgPSB1c2VLZXlib2FyZFNob3J0Y3V0cyh7XG4gICAgRW50ZXI6IHJlYWRLZXlzdG9yZUZpbGUsXG4gICAgRXNjYXBlOiByZXN0YXJ0LFxuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgIGJhY2tncm91bmQ6IHRoZW1lLnBhbGV0dGUuYmFja2dyb3VuZC5wYXBlcixcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIHN4PXt7IG10OiAyLjUsIG1iOiAwLjUsIHByOiAxIH19PlxuICAgICAgICAgIDxQYWdlVGl0bGUgb25CYWNrQ2xpY2s9eygpID0+IGhpc3RvcnkucmVwbGFjZSgnL2FjY291bnRzJyl9PlxuICAgICAgICAgICAge3QoJ0FkZCBXYWxsZXQgd2l0aCBLZXlzdG9yZSBGaWxlJyl9XG4gICAgICAgICAgPC9QYWdlVGl0bGU+XG4gICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgeyhzdGVwID09PSBTdGVwLkNob29zZUZpbGUgfHwgc3RlcCA9PT0gU3RlcC5Qcm92aWRlUGFzc3dvcmQpICYmIChcbiAgICAgICAgICA8S2V5c3RvcmVGaWxlVXBsb2FkXG4gICAgICAgICAgICBpbnB1dFJlZj17aW5wdXRSZWZ9XG4gICAgICAgICAgICBvbkRyb3A9e2hhbmRsZURyb3B9XG4gICAgICAgICAgICBvbkZpbGVTZWxlY3RlZD17YXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChldi50YXJnZXQuZmlsZXM/LlswXSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IG9uRmlsZVNlbGVjdGVkKGV2LnRhcmdldC5maWxlc1swXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgICB7ZmlsZSAmJiBzdGVwID09PSBTdGVwLkNvbmZpcm1EYXRhICYmIChcbiAgICAgICAgICA8S2V5c3RvcmVGaWxlQ29uZmlybWF0aW9uXG4gICAgICAgICAgICBmaWxlTmFtZT17ZmlsZS5uYW1lfVxuICAgICAgICAgICAgZmlsZUluZm89e2ZpbGVJbmZvfVxuICAgICAgICAgICAgaXNMb2FkaW5nPXtpc1JlYWRpbmcgfHwgaXNJbXBvcnRpbmd9XG4gICAgICAgICAgICBvbkNvbmZpcm09e2hhbmRsZUltcG9ydH1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXtyZXN0YXJ0fVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAge2Vycm9yICYmIHN0ZXAgPT09IFN0ZXAuRXJyb3IgJiYgKFxuICAgICAgICAgIDxLZXlzdG9yZUZpbGVFcnJvciBlcnJvcj17ZXJyb3J9IG9uVHJ5QWdhaW49e3Jlc3RhcnR9IC8+XG4gICAgICAgICl9XG5cbiAgICAgICAgPERpYWxvZ1xuICAgICAgICAgIG9wZW49e3N0ZXAgPT09IFN0ZXAuUHJvdmlkZVBhc3N3b3JkfVxuICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgIG9uQ2xvc2U9e3Jlc3RhcnR9XG4gICAgICAgICAgUGFwZXJQcm9wcz17e1xuICAgICAgICAgICAgc3g6IHsgbTogMiwgd2lkdGg6ICcxMDAlJywgbWF4V2lkdGg6ICdub25lJyB9LFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8RGlhbG9nVGl0bGU+e3QoJ1Bhc3N3b3JkIFJlcXVpcmVkJyl9PC9EaWFsb2dUaXRsZT5cbiAgICAgICAgICA8RGlhbG9nQ29udGVudD5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgICAgICB7dCgnUGxlYXNlIGVudGVyIHRoZSBrZXlzdG9yZSBmaWxlIHBhc3N3b3JkIHRvIGNvbnRpbnVlLicpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgICBhdXRvRm9jdXNcbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJrZXlzdG9yZS1maWxlLXBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgIGxhYmVsPXt0KCdQYXNzd29yZCcpfVxuICAgICAgICAgICAgICBpbnB1dExhYmVsUHJvcHM9e3tcbiAgICAgICAgICAgICAgICBzeDoge1xuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogJ2JvZHkyLmZvbnRTaXplJyxcbiAgICAgICAgICAgICAgICAgIG1iOiAxLFxuICAgICAgICAgICAgICAgICAgbXQ6IDQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgaGVscGVyVGV4dD17XG4gICAgICAgICAgICAgICAgZXJyb3IgPT09IEtleXN0b3JlRXJyb3IuSW52YWxpZFBhc3N3b3JkXG4gICAgICAgICAgICAgICAgICA/IGVycm9yTWVzc2FnZVxuICAgICAgICAgICAgICAgICAgOiB0KFxuICAgICAgICAgICAgICAgICAgICAgICdUaGlzIHBhc3N3b3JkIHdhcyBzZXQgd2hlbiB5b3UgY3JlYXRlZCB0aGUga2V5c3RvcmUgZmlsZS4nLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZXJyb3I9e2Vycm9yID09PSBLZXlzdG9yZUVycm9yLkludmFsaWRQYXNzd29yZH1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0lucHV0IFBhc3N3b3JkJyl9XG4gICAgICAgICAgICAgIHZhbHVlPXtmaWxlUGFzc3dvcmR9XG4gICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXYpID0+IHNldEZpbGVQYXNzd29yZChldi50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICB7Li4ua2V5Ym9hcmRIYW5kbGVyc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9EaWFsb2dDb250ZW50PlxuICAgICAgICAgIDxEaWFsb2dBY3Rpb25zPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBrZXk9XCJjb250aW51ZS11cGxvYWRcIlxuICAgICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWZpbGVQYXNzd29yZCB8fCAhZmlsZSB8fCBpc1JlYWRpbmd9XG4gICAgICAgICAgICAgIGlzTG9hZGluZz17aXNSZWFkaW5nfVxuICAgICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgICAgb25DbGljaz17cmVhZEtleXN0b3JlRmlsZX1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjb250aW51ZS11cGxvYWRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnQ29udGludWUgVXBsb2FkJyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAga2V5PVwiY2FuY2VsLXVwbG9hZFwiXG4gICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3Jlc3RhcnR9XG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYmFjay1idXR0b25cIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnQmFjaycpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9EaWFsb2dBY3Rpb25zPlxuICAgICAgICA8L0RpYWxvZz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBCdXR0b24sXG4gIENhcmQsXG4gIFN0YWNrLFxuICBUb29sdGlwLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgS2V5c3RvcmVGaWxlQ29udGVudEluZm8gfSBmcm9tICdAc3JjL3V0aWxzL2tleXN0b3JlL21vZGVscyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG50eXBlIEtleXN0b3JlRmlsZUNvbmZpcm1hdGlvblByb3BzID0ge1xuICBmaWxlTmFtZTogc3RyaW5nO1xuICBmaWxlSW5mbzogS2V5c3RvcmVGaWxlQ29udGVudEluZm87XG4gIGlzTG9hZGluZzogYm9vbGVhbjtcbiAgb25Db25maXJtOiAoKSA9PiB2b2lkO1xuICBvbkNhbmNlbDogKCkgPT4gdm9pZDtcbn07XG5cbmV4cG9ydCBjb25zdCBLZXlzdG9yZUZpbGVDb25maXJtYXRpb24gPSAoe1xuICBmaWxlTmFtZSxcbiAgZmlsZUluZm8sXG4gIGlzTG9hZGluZyxcbiAgb25Db25maXJtLFxuICBvbkNhbmNlbCxcbn06IEtleXN0b3JlRmlsZUNvbmZpcm1hdGlvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBweDogMiwgcHQ6IDEsIGZsZXhHcm93OiAxLCBnYXA6IDEgfX0+XG4gICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBmb250V2VpZ2h0OiAnc2VtaWJvbGQnIH19PlxuICAgICAgICB7dCgnSW1wb3J0IERldGFpbHMnKX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDxDYXJkXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnZ3JleS44MDAnLFxuICAgICAgICAgIHA6IDIsXG4gICAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgIG1iOiAyLFxuICAgICAgICAgICAgICBnYXA6IDIsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICB2YXJpYW50PVwiY2FwdGlvblwiXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCJzZW1pYm9sZFwiXG4gICAgICAgICAgICAgIHdoaXRlU3BhY2U9XCJub3dyYXBcIlxuICAgICAgICAgICAgICBzeD17eyBmbGV4U2hyaW5rOiAwIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0KCdGaWxlIE5hbWUnKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUb29sdGlwIHRpdGxlPXtmaWxlTmFtZX0gd3JhcFdpdGhTcGFuPXtmYWxzZX0+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtmaWxlTmFtZX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgICAgIHB5OiAxLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmV5Ljg1MCcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+e3QoJ1JlY292ZXJ5IFBocmFzZXMnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIiBkYXRhLXRlc3RpZD1cInNlZWQtcGhyYXNlLWNvdW50XCI+XG4gICAgICAgICAgICAgIHtmaWxlSW5mby5zZWVkUGhyYXNlc0NvdW50fVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICBweDogMixcbiAgICAgICAgICAgICAgcHk6IDEsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZXkuODUwJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj57dCgnUHJpdmF0ZSBLZXlzJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgZGF0YS10ZXN0aWQ9XCJwcml2YXRlLWtleS1jb3VudFwiPlxuICAgICAgICAgICAgICB7ZmlsZUluZm8ucHJpdmF0ZUtleXNDb3VudH1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9DYXJkPlxuICAgICAgPFN0YWNrIHN4PXt7IG15OiAzLCBnYXA6IDEsIHdpZHRoOiAxIH19PlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICBvbkNsaWNrPXtvbkNvbmZpcm19XG4gICAgICAgICAgZGlzYWJsZWQ9e2lzTG9hZGluZ31cbiAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImltcG9ydC1rZXlzdG9yZS1maWxlXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdJbXBvcnQgS2V5c3RvcmUgRmlsZScpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgY29sb3I9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgIGRpc2FibGVkPXtpc0xvYWRpbmd9XG4gICAgICAgICAgb25DbGljaz17b25DYW5jZWx9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjYW5jZWwtYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgQWxlcnRDaXJjbGVJY29uLFxuICBCdXR0b24sXG4gIENhcmQsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlRXJyb3JNZXNzYWdlIH0gZnJvbSAnQHNyYy9ob29rcy91c2VFcnJvck1lc3NhZ2UnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxudHlwZSBLZXlzdG9yZUZpbGVFcnJvclByb3BzID0ge1xuICBlcnJvcjogdW5rbm93bjtcbiAgb25UcnlBZ2FpbjogKCkgPT4gdm9pZDtcbn07XG5cbmV4cG9ydCBjb25zdCBLZXlzdG9yZUZpbGVFcnJvciA9ICh7XG4gIGVycm9yLFxuICBvblRyeUFnYWluLFxufTogS2V5c3RvcmVGaWxlRXJyb3JQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGdldFRyYW5zbGF0ZWRFcnJvciA9IHVzZUVycm9yTWVzc2FnZSgpO1xuXG4gIGNvbnN0IHsgdGl0bGUsIGhpbnQgfSA9IGdldFRyYW5zbGF0ZWRFcnJvcihlcnJvcik7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgcHg6IDIsIHB0OiAxLCBmbGV4R3JvdzogMSwgZ2FwOiAxIH19PlxuICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgZm9udFdlaWdodDogJ3NlbWlib2xkJyB9fT5cbiAgICAgICAge3QoJ1VwbG9hZCBLZXlzdG9yZSBGaWxlJyl9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8Q2FyZFxuICAgICAgICBzeD17e1xuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZXkuODAwJyxcbiAgICAgICAgICBweDogNCxcbiAgICAgICAgICBweTogOCxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGdhcDogMyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEFsZXJ0Q2lyY2xlSWNvbiBzaXplPXs2NH0gLz5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg2XCI+e3RpdGxlfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGNvbG9yPVwidGV4dC5zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgICAge2hpbnR9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHNpemU9XCJtZWRpdW1cIlxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBvbkNsaWNrPXtvblRyeUFnYWlufVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cnktYWdhaW4tYnV0dG9uXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnVHJ5IEFnYWluJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L0NhcmQ+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQge1xuICBCdXR0b24sXG4gIENhcmQsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICBVcGxvYWRJY29uLFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7XG4gIENoYW5nZUV2ZW50SGFuZGxlcixcbiAgRHJhZ0V2ZW50SGFuZGxlcixcbiAgUmVmT2JqZWN0LFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxudHlwZSBLZXlzdG9yZUZpbGVVcGxvYWRQcm9wcyA9IHtcbiAgaW5wdXRSZWY6IFJlZk9iamVjdDxIVE1MSW5wdXRFbGVtZW50PjtcbiAgb25Ecm9wOiBEcmFnRXZlbnRIYW5kbGVyPEhUTUxEaXZFbGVtZW50PjtcbiAgb25GaWxlU2VsZWN0ZWQ6IENoYW5nZUV2ZW50SGFuZGxlcjxIVE1MSW5wdXRFbGVtZW50Pjtcbn07XG5cbmV4cG9ydCBjb25zdCBLZXlzdG9yZUZpbGVVcGxvYWQgPSAoe1xuICBpbnB1dFJlZixcbiAgb25Ecm9wLFxuICBvbkZpbGVTZWxlY3RlZCxcbn06IEtleXN0b3JlRmlsZVVwbG9hZFByb3BzKSA9PiB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IFtpc0RyYWdnaW5nT3Zlciwgc2V0SXNEcmFnZ2luZ092ZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IHB4OiAyLCBwdDogMSwgZmxleEdyb3c6IDEsIGdhcDogMSB9fT5cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGZvbnRXZWlnaHQ6ICdzZW1pYm9sZCcgfX0+XG4gICAgICAgIHt0KCdVcGxvYWQgS2V5c3RvcmUgRmlsZScpfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgPENhcmRcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdncmV5LjgwMCcsXG4gICAgICAgICAgcDogNCxcbiAgICAgICAgICB0cmFuc2l0aW9uOiB0aGVtZS50cmFuc2l0aW9ucy5jcmVhdGUoWydib3JkZXInLCAnY29sb3InXSksXG4gICAgICAgICAgY29sb3I6IGlzRHJhZ2dpbmdPdmVyID8gdGhlbWUucGFsZXR0ZS5pbmZvLmxpZ2h0IDogJ2luaXRpYWwnLFxuICAgICAgICAgIGJvcmRlcjogYDJweCBkb3R0ZWQgJHtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdPdmVyID8gdGhlbWUucGFsZXR0ZS5pbmZvLmxpZ2h0IDogJ3RyYW5zcGFyZW50J1xuICAgICAgICAgIH1gLFxuICAgICAgICB9fVxuICAgICAgICBvbkRyb3A9eyhldikgPT4ge1xuICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICBzZXRJc0RyYWdnaW5nT3ZlcihmYWxzZSk7XG4gICAgICAgICAgb25Ecm9wKGV2KTtcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnT3Zlcj17KGV2KSA9PiBldi5wcmV2ZW50RGVmYXVsdCgpfVxuICAgICAgICBvbkRyYWdFbnRlcj17KCkgPT4ge1xuICAgICAgICAgIHNldElzRHJhZ2dpbmdPdmVyKHRydWUpO1xuICAgICAgICB9fVxuICAgICAgICBvbkRyYWdMZWF2ZT17KCkgPT4ge1xuICAgICAgICAgIHNldElzRHJhZ2dpbmdPdmVyKGZhbHNlKTtcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN0YWNrXG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6IGlzRHJhZ2dpbmdPdmVyID8gJ25vbmUnIDogJ2FsbCcsIC8vIHByZXZlbnRzIGRyYWdMZWF2ZSBldmVudCBmcm9tIGZpcmluZyB3aGVuIGRyYWdnaW5nIG92ZXIgY2hpbGQgZWxlbWVudHNcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFVwbG9hZEljb24gc2l6ZT17NjR9IC8+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg2XCIgY29sb3I9XCJ0ZXh0LnByaW1hcnlcIj5cbiAgICAgICAgICAgIHt0KCdEcm9wIHlvdXIgZmlsZSBoZXJlIHRvIHVwbG9hZCcpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICB7dChcbiAgICAgICAgICAgICAgJ09ubHkga2V5c3RvcmUgZmlsZXMgZXhwb3J0ZWQgZnJvbSB0aGUgQXZhbGFuY2hlIFdhbGxldCBhcmUgc3VwcG9ydGVkLicsXG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDVcIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCIgc3g9e3sgbXk6IDIgfX0+XG4gICAgICAgICAgICB7dCgnT3InKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgc2l6ZT1cIm1lZGl1bVwiXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIGNvbXBvbmVudD1cImxhYmVsXCJcbiAgICAgICAgICAgIGh0bWxGb3I9XCJicm93c2UtZmlsZXNcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJicm93c2UtZmlsZXNcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdCcm93c2UgRmlsZXMnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHJlZj17aW5wdXRSZWZ9XG4gICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICBoaWRkZW5cbiAgICAgICAgICAgIGlkPVwiYnJvd3NlLWZpbGVzXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkZpbGVTZWxlY3RlZH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9DYXJkPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQge1xuICBJbXBvcnRTZWVkcGhyYXNlV2FsbGV0UGFyYW1zLFxuICBJbXBvcnRXYWxsZXRSZXN1bHQsXG59IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvaGFuZGxlcnMvbW9kZWxzJztcbmltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5pbXBvcnQgeyBJbXBvcnRTZWVkUGhyYXNlSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy93YWxsZXQvaGFuZGxlcnMvaW1wb3J0U2VlZFBocmFzZSc7XG5cbnR5cGUgSW1wb3J0V2FsbGV0Rm4gPSAoXG4gIHBhcmFtczogSW1wb3J0U2VlZHBocmFzZVdhbGxldFBhcmFtcyxcbikgPT4gUHJvbWlzZTxJbXBvcnRXYWxsZXRSZXN1bHQ+O1xuXG5leHBvcnQgY29uc3QgdXNlSW1wb3J0U2VlZHBocmFzZSA9ICgpID0+IHtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBjb25zdCBbaXNJbXBvcnRpbmcsIHNldElzSW1wb3J0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBpbXBvcnRTZWVkcGhyYXNlOiBJbXBvcnRXYWxsZXRGbiA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChwYXJhbXMpID0+IHtcbiAgICAgIHNldElzSW1wb3J0aW5nKHRydWUpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXF1ZXN0PEltcG9ydFNlZWRQaHJhc2VIYW5kbGVyPih7XG4gICAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LldBTExFVF9JTVBPUlRfU0VFRF9QSFJBU0UsXG4gICAgICAgICAgcGFyYW1zOiBbcGFyYW1zXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHNldElzSW1wb3J0aW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtyZXF1ZXN0XSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGlzSW1wb3J0aW5nLFxuICAgIGltcG9ydFNlZWRwaHJhc2UsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5jb25zdCByZWFkSnNvbkZpbGUgPSBhc3luYyA8VD4oanNvbkZpbGU6IEZpbGUpID0+XG4gIG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBmciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICBmci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoZnIucmVzdWx0IGFzIHN0cmluZykpO1xuICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgcmVqZWN0KGVyci50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnIub25lcnJvciA9ICgpID0+IHtcbiAgICAgIHJlamVjdChmci5lcnJvcik7XG4gICAgfTtcblxuICAgIGZyLnJlYWRBc1RleHQoanNvbkZpbGUpO1xuICB9KTtcblxuZXhwb3J0IGNvbnN0IHVzZUpzb25GaWxlUmVhZGVyID0gPFQ+KCkgPT4ge1xuICBjb25zdCBbaXNSZWFkaW5nLCBzZXRJc1JlYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IHJlYWQgPSB1c2VDYWxsYmFjayhhc3luYyAoZmlsZTogRmlsZSk6IFByb21pc2U8VD4gfCBuZXZlciA9PiB7XG4gICAgc2V0SXNSZWFkaW5nKHRydWUpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCByZWFkSnNvbkZpbGU8VD4oZmlsZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldElzUmVhZGluZyhmYWxzZSk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHtcbiAgICByZWFkLFxuICAgIGlzUmVhZGluZyxcbiAgfTtcbn07XG4iLCJpbXBvcnQgSm9pIGZyb20gJ2pvaSc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHV0aWxzIH0gZnJvbSAnQGF2YWxhYnMvYXZhbGFuY2hlanMnO1xuXG5pbXBvcnQge1xuICBleHRyYWN0S2V5c0Zyb21EZWNyeXB0ZWRGaWxlLFxuICByZWFkS2V5RmlsZSxcbn0gZnJvbSAnQHNyYy91dGlscy9rZXlzdG9yZS9rZXlzdG9yZSc7XG5pbXBvcnQgeyBTZWVkcGhyYXNlSW1wb3J0RXJyb3IgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L2hhbmRsZXJzL21vZGVscyc7XG5pbXBvcnQgeyBpc1dyYXBwZWRFcnJvciB9IGZyb20gJ0BzcmMvdXRpbHMvZXJyb3JzJztcbmltcG9ydCB7XG4gIEFsbEtleUZpbGVUeXBlcyxcbiAgS2V5c3RvcmVGaWxlQ29udGVudEluZm8sXG59IGZyb20gJ0BzcmMvdXRpbHMva2V5c3RvcmUvbW9kZWxzJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcblxuaW1wb3J0IHsgdXNlSW1wb3J0U2VlZHBocmFzZSB9IGZyb20gJy4vdXNlSW1wb3J0U2VlZHBocmFzZSc7XG5pbXBvcnQgeyB1c2VQcml2YXRlS2V5SW1wb3J0IH0gZnJvbSAnLi91c2VQcml2YXRlS2V5SW1wb3J0JztcbmltcG9ydCB7IHVzZUpzb25GaWxlUmVhZGVyIH0gZnJvbSAnLi91c2VKc29uRmlsZVJlYWRlcic7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuXG5leHBvcnQgY29uc3QgdXNlS2V5c3RvcmVGaWxlSW1wb3J0ID0gKCkgPT4ge1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcblxuICBjb25zdCB7IGlzUmVhZGluZywgcmVhZCB9ID0gdXNlSnNvbkZpbGVSZWFkZXI8QWxsS2V5RmlsZVR5cGVzPigpO1xuICBjb25zdCB7IGlzSW1wb3J0aW5nOiBpc0ltcG9ydGluZ1NlZWRwaHJhc2UsIGltcG9ydFNlZWRwaHJhc2UgfSA9XG4gICAgdXNlSW1wb3J0U2VlZHBocmFzZSgpO1xuICBjb25zdCB7IGlzSW1wb3J0aW5nOiBpc0ltcG9ydGluZ1ByaXZhdGVLZXksIGltcG9ydFByaXZhdGVLZXkgfSA9XG4gICAgdXNlUHJpdmF0ZUtleUltcG9ydCgpO1xuICBjb25zdCB7IHNlbGVjdEFjY291bnQgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuXG4gIGNvbnN0IGV4dHJhY3RLZXlzID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKGZpbGU6IEZpbGUsIHBhc3N3b3JkOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZWFkKGZpbGUpO1xuXG4gICAgICBjYXB0dXJlKCdLZXlzdG9yZUZpbGVQcm92aWRlZCcsIHsgdmVyc2lvbjogZGF0YS52ZXJzaW9uIH0pO1xuXG4gICAgICBjb25zdCBkZWNyeXB0ZWRGaWxlID0gYXdhaXQgcmVhZEtleUZpbGUoZGF0YSwgcGFzc3dvcmQpO1xuICAgICAgY29uc3Qga2V5cyA9IGV4dHJhY3RLZXlzRnJvbURlY3J5cHRlZEZpbGUoZGVjcnlwdGVkRmlsZSk7XG5cbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG4gICAgW2NhcHR1cmUsIHJlYWRdLFxuICApO1xuXG4gIGNvbnN0IGltcG9ydEtleXN0b3JlRmlsZSA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChmaWxlOiBGaWxlLCBwYXNzd29yZDogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBrZXlzID0gYXdhaXQgZXh0cmFjdEtleXMoZmlsZSwgcGFzc3dvcmQpO1xuXG4gICAgICAvLyBXZSBuZWVkIHRvIGltcG9ydCBhbGwga2V5cyBvbmUgYnkgb25lLlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleURhdGEgPSBrZXlzW2ldO1xuXG4gICAgICAgIGlmICgha2V5RGF0YSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBrZXksIHR5cGUgfSA9IGtleURhdGE7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdzaW5nbGV0b24nKSB7XG4gICAgICAgICAgLy8gS2V5c3RvcmUgZmlsZXMgaGF2ZSB0aGUgcHJpdmF0ZSBrZXlzIGJhc2U1OGNoZWNrLWVuY29kZWQsIGJ1dFxuICAgICAgICAgIC8vIHdlIG5lZWQgdGhlbSBpbiBoZXggZm9ybWF0LlxuICAgICAgICAgIGNvbnN0IHByaXZhdGVLZXkgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgICAgIHV0aWxzLmJhc2U1OGNoZWNrLmRlY29kZShrZXkucmVwbGFjZSgnUHJpdmF0ZUtleS0nLCAnJykpLFxuICAgICAgICAgICkudG9TdHJpbmcoJ2hleCcpO1xuXG4gICAgICAgICAgY29uc3QgYWNjb3VudElkID0gYXdhaXQgaW1wb3J0UHJpdmF0ZUtleShwcml2YXRlS2V5KTtcbiAgICAgICAgICBhd2FpdCBzZWxlY3RBY2NvdW50KGFjY291bnRJZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ21uZW1vbmljJykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBpbXBvcnRTZWVkcGhyYXNlKHtcbiAgICAgICAgICAgICAgbW5lbW9uaWM6IGtleSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBpc1dyYXBwZWRFcnJvcihlcnIpICYmXG4gICAgICAgICAgICAgIGVyci5kYXRhLnJlYXNvbiA9PT0gU2VlZHBocmFzZUltcG9ydEVycm9yLkV4aXN0aW5nU2VlZHBocmFzZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSBzZWVkcGhyYXNlIHdhcyBhbHJlYWR5IGltcG9ydGVkLCBqdXN0IGlnbm9yZSB0aGUgZXJyb3IuXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBbZXh0cmFjdEtleXMsIGltcG9ydFByaXZhdGVLZXksIGltcG9ydFNlZWRwaHJhc2UsIHNlbGVjdEFjY291bnRdLFxuICApO1xuXG4gIGNvbnN0IGdldEtleUNvdW50cyA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChmaWxlOiBGaWxlLCBwYXNzd29yZDogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBrZXlzID0gYXdhaXQgZXh0cmFjdEtleXMoZmlsZSwgcGFzc3dvcmQpO1xuXG4gICAgICByZXR1cm4ga2V5cy5yZWR1Y2U8S2V5c3RvcmVGaWxlQ29udGVudEluZm8+KFxuICAgICAgICAoY291bnRzOiBLZXlzdG9yZUZpbGVDb250ZW50SW5mbywga2V5KSA9PiB7XG4gICAgICAgICAgaWYgKGtleS50eXBlID09PSAnbW5lbW9uaWMnKSB7XG4gICAgICAgICAgICBjb3VudHMuc2VlZFBocmFzZXNDb3VudCArPSAxO1xuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5LnR5cGUgPT09ICdzaW5nbGV0b24nKSB7XG4gICAgICAgICAgICBjb3VudHMucHJpdmF0ZUtleXNDb3VudCArPSAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBjb3VudHM7XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzZWVkUGhyYXNlc0NvdW50OiAwLFxuICAgICAgICAgIHByaXZhdGVLZXlzQ291bnQ6IDAsXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0sXG4gICAgW2V4dHJhY3RLZXlzXSxcbiAgKTtcblxuICBjb25zdCBpc1ZhbGlkS2V5c3RvcmVGaWxlID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKGZpbGU6IEZpbGUpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZWFkKGZpbGUpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBLRVlTVE9SRV9GSUxFX1NDSEVNQS52YWxpZGF0ZShkYXRhKTtcblxuICAgICAgICByZXR1cm4gIXJlc3VsdC5lcnJvcjtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBbcmVhZF0sXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRLZXlDb3VudHMsXG4gICAgaW1wb3J0S2V5c3RvcmVGaWxlLFxuICAgIGlzSW1wb3J0aW5nOiBpc0ltcG9ydGluZ1NlZWRwaHJhc2UgfHwgaXNJbXBvcnRpbmdQcml2YXRlS2V5LFxuICAgIGlzUmVhZGluZyxcbiAgICBpc1ZhbGlkS2V5c3RvcmVGaWxlLFxuICB9O1xufTtcblxuY29uc3QgS0VZU1RPUkVfRklMRV9TQ0hFTUEgPSBKb2kub2JqZWN0KHtcbiAgdmVyc2lvbjogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIHNhbHQ6IEpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICBrZXlzOiBKb2kuYXJyYXkoKS5pdGVtcyhcbiAgICBKb2kub2JqZWN0KHtcbiAgICAgIGtleTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgICBpdjogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gICAgfSkudW5rbm93bigpLFxuICApLFxufSkudW5rbm93bigpO1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXRpbHMgfSBmcm9tICdAYXZhbGFicy9hdmFsYW5jaGVqcyc7XG5cbmltcG9ydCBzZW50cnlDYXB0dXJlRXhjZXB0aW9uLCB7XG4gIFNlbnRyeUV4Y2VwdGlvblR5cGVzLFxufSBmcm9tICdAc3JjL21vbml0b3Jpbmcvc2VudHJ5Q2FwdHVyZUV4Y2VwdGlvbic7XG5pbXBvcnQgeyBJbXBvcnRUeXBlIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuXG5leHBvcnQgY29uc3QgdXNlUHJpdmF0ZUtleUltcG9ydCA9ICgpID0+IHtcbiAgY29uc3QgW2lzSW1wb3J0aW5nLCBzZXRJc0ltcG9ydGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgeyBhZGRBY2NvdW50IH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcblxuICBjb25zdCBpbXBvcnRQcml2YXRlS2V5ID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHByaXZhdGVLZXk6IHN0cmluZykgPT4ge1xuICAgICAgc2V0SXNJbXBvcnRpbmcodHJ1ZSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFjY291bnRJZCA9IGF3YWl0IGFkZEFjY291bnQoJycsIHtcbiAgICAgICAgICBpbXBvcnRUeXBlOiBJbXBvcnRUeXBlLlBSSVZBVEVfS0VZLFxuICAgICAgICAgIGRhdGE6IHV0aWxzLnN0cmlwMHgocHJpdmF0ZUtleSksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhY2NvdW50SWQ7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgc2VudHJ5Q2FwdHVyZUV4Y2VwdGlvbihcbiAgICAgICAgICBlcnIgYXMgRXJyb3IsXG4gICAgICAgICAgU2VudHJ5RXhjZXB0aW9uVHlwZXMuV0FMTEVUX0lNUE9SVCxcbiAgICAgICAgKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0SXNJbXBvcnRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2FkZEFjY291bnRdLFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgaXNJbXBvcnRpbmcsXG4gICAgaW1wb3J0UHJpdmF0ZUtleSxcbiAgfTtcbn07XG4iLCIvKipcbiAqIEhlbHBlciB1dGlsaXRpZXMgZm9yIGVuY3J5cHRpb24gYW5kIHBhc3N3b3JkIGhhc2hpbmcsIGJyb3dzZXItc2FmZS5cbiAqIEVuY3J5cHRpb24gaXMgdXNpbmcgQUVTLUdDTSB3aXRoIGEgcmFuZG9tIHB1YmxpYyBub25jZS5cbiAqL1xuXG5pbXBvcnQgeyBzaGEyNTYgfSBmcm9tICdAbm9ibGUvaGFzaGVzL3NoYTI1Nic7XG5pbXBvcnQgeyBjb25jYXRCeXRlcywgcmFuZG9tQnl0ZXMsIHV0ZjhUb0J5dGVzIH0gZnJvbSAnQG5vYmxlL2hhc2hlcy91dGlscyc7XG5cbmNvbnN0IFNBTFRfU0laRSA9IDE2O1xuXG5jb25zdCBBRVNfTEVOR1RIID0gMjU2O1xuXG5jb25zdCBUQUdfTEVOR1RIID0gMTI4O1xuXG5jb25zdCBLRVlHRU5fSVRFUkFUSU9OU19WMyA9IDIwMDAwMDsgLy8gdjMgYW5kIGFuZCBhbnkgdmVyc2lvbiBhYm92ZVxuXG5jb25zdCBtYWtlU2FsdCA9ICgpID0+IHJhbmRvbUJ5dGVzKFNBTFRfU0laRSk7XG5cbmV4cG9ydCBjb25zdCBnZXRIYXNoID0gKHBhc3N3b3JkOiBzdHJpbmcsIHNhbHQ6IFVpbnQ4QXJyYXkpOiBVaW50OEFycmF5ID0+XG4gIHNoYTI1Nihjb25jYXRCeXRlcyh1dGY4VG9CeXRlcyhwYXNzd29yZCksIHNhbHQpKTtcblxuZXhwb3J0IGNvbnN0IGNhbGN1bGF0ZVBhc3N3b3JkSGFzaCA9IChcbiAgcGFzc3dvcmQ6IHN0cmluZyxcbiAgc2FsdDogVWludDhBcnJheSxcbik6IHsgc2FsdDogVWludDhBcnJheTsgaGFzaDogVWludDhBcnJheSB9ID0+IHtcbiAgbGV0IHNsdDogVWludDhBcnJheTtcblxuICBpZiAoc2FsdCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICBzbHQgPSBzYWx0O1xuICB9IGVsc2Uge1xuICAgIHNsdCA9IG1ha2VTYWx0KCk7XG4gIH1cblxuICBjb25zdCBoYXNoID0gZ2V0SGFzaChwYXNzd29yZCwgZ2V0SGFzaChwYXNzd29yZCwgc2x0KSk7XG4gIHJldHVybiB7IHNhbHQ6IHNsdCwgaGFzaCB9O1xufTtcblxuY29uc3QgaW1wb3J0S2V5ID0gYXN5bmMgKHB3a2V5OiBVaW50OEFycmF5KTogUHJvbWlzZTxDcnlwdG9LZXk+ID0+XG4gIGNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KCdyYXcnLCBwd2tleSwgeyBuYW1lOiAnUEJLREYyJyB9LCBmYWxzZSwgW1xuICAgICdkZXJpdmVLZXknLFxuICBdKTtcblxuY29uc3QgZGVyaXZlS2V5ID0gYXN5bmMgKFxuICBrZXlNYXRlcmlhbDogQ3J5cHRvS2V5LFxuICBzYWx0OiBVaW50OEFycmF5LFxuICBpdGVyYXRpb25zID0gS0VZR0VOX0lURVJBVElPTlNfVjMsXG4pOiBQcm9taXNlPENyeXB0b0tleT4gPT5cbiAgY3J5cHRvLnN1YnRsZS5kZXJpdmVLZXkoXG4gICAge1xuICAgICAgbmFtZTogJ1BCS0RGMicsXG4gICAgICBzYWx0LFxuICAgICAgaXRlcmF0aW9ucyxcbiAgICAgIGhhc2g6ICdTSEEtMjU2JyxcbiAgICB9LFxuICAgIGtleU1hdGVyaWFsLFxuICAgIHsgbmFtZTogJ0FFUy1HQ00nLCBsZW5ndGg6IEFFU19MRU5HVEggfSxcbiAgICBmYWxzZSxcbiAgICBbJ2VuY3J5cHQnLCAnZGVjcnlwdCddLFxuICApO1xuXG5leHBvcnQgY29uc3QgZGVjcnlwdCA9IGFzeW5jIChcbiAgcGFzc3dvcmQ6IHN0cmluZyxcbiAgY2lwaGVydGV4dDogVWludDhBcnJheSxcbiAgc2FsdDogVWludDhBcnJheSxcbiAgaXY6IFVpbnQ4QXJyYXksXG4gIGtleWdlbkl0ZXJhdGlvbnM/OiBudW1iZXIsXG4pOiBQcm9taXNlPFVpbnQ4QXJyYXk+ID0+IHtcbiAgY29uc3QgcHdrZXkgPSBnZXRIYXNoKHBhc3N3b3JkLCBzYWx0KTtcbiAgY29uc3Qga2V5TWF0ZXJpYWwgPSBhd2FpdCBpbXBvcnRLZXkocHdrZXkpO1xuICBjb25zdCBwa2V5ID0gYXdhaXQgZGVyaXZlS2V5KGtleU1hdGVyaWFsLCBzYWx0LCBrZXlnZW5JdGVyYXRpb25zKTtcblxuICBjb25zdCBwdCA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGVjcnlwdChcbiAgICB7XG4gICAgICBuYW1lOiAnQUVTLUdDTScsXG4gICAgICBpdiwgLy8gVGhlIGluaXRpYWxpemF0aW9uIHZlY3RvciB5b3UgdXNlZCB0byBlbmNyeXB0XG4gICAgICBhZGRpdGlvbmFsRGF0YTogc2FsdCwgLy8gVGhlIGFkZGl0aW9uYWxEYXRhIHlvdSB1c2VkIHRvIGVuY3J5cHQgKGlmIGFueSlcbiAgICAgIHRhZ0xlbmd0aDogVEFHX0xFTkdUSCwgLy8gVGhlIHRhZ0xlbmd0aCB5b3UgdXNlZCB0byBlbmNyeXB0IChpZiBhbnkpXG4gICAgfSxcbiAgICBwa2V5LCAvLyBmcm9tIGltcG9ydEtleSBhYm92ZVxuICAgIGNpcGhlcnRleHQsIC8vIEFycmF5QnVmZmVyIG9mIHRoZSBkYXRhXG4gICk7XG5cbiAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHB0KTtcbn07XG4iLCJpbXBvcnQgKiBhcyBiaXAzOSBmcm9tICdiaXAzOSc7XG5pbXBvcnQgeyB0b0J5dGVzIH0gZnJvbSAnQG5vYmxlL2hhc2hlcy91dGlscyc7XG5pbXBvcnQgeyB1dGlscyB9IGZyb20gJ0BhdmFsYWJzL2F2YWxhbmNoZWpzJztcblxuaW1wb3J0IHtcbiAgQWNjZXNzV2FsbGV0TXVsdGlwbGVJbnB1dCxcbiAgQWxsS2V5RmlsZURlY3J5cHRlZFR5cGVzLFxuICBBbGxLZXlGaWxlVHlwZXMsXG4gIEtleUZpbGVEZWNyeXB0ZWRWMixcbiAgS2V5RmlsZURlY3J5cHRlZFYzLFxuICBLZXlGaWxlRGVjcnlwdGVkVjQsXG4gIEtleUZpbGVEZWNyeXB0ZWRWNSxcbiAgS2V5RmlsZURlY3J5cHRlZFY2LFxuICBLZXlGaWxlVjIsXG4gIEtleUZpbGVWMyxcbiAgS2V5RmlsZVY0LFxuICBLZXlGaWxlVjUsXG4gIEtleUZpbGVWNixcbiAgS2V5c3RvcmVFcnJvcixcbn0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgZ2V0SGFzaCwgZGVjcnlwdCwgY2FsY3VsYXRlUGFzc3dvcmRIYXNoIH0gZnJvbSAnLi9jcnlwdG9IZWxwZXJzJztcblxuZXhwb3J0IGNvbnN0IEtFWVNUT1JFX1ZFUlNJT04gPSAnNi4wJztcblxuY29uc3QgS0VZR0VOX0lURVJBVElPTlNfVjIgPSAxMDAwMDA7XG5cbmFzeW5jIGZ1bmN0aW9uIHJlYWRWMihkYXRhOiBLZXlGaWxlVjIsIHBhc3MpIHtcbiAgY29uc3QgdmVyc2lvbiA9IGRhdGEudmVyc2lvbjtcblxuICBjb25zdCBzYWx0ID0gdXRpbHMuYmFzZTU4Y2hlY2suZGVjb2RlKGRhdGEuc2FsdCk7XG5cbiAgY29uc3QgY2hlY2tIYXNoID0gZ2V0SGFzaChwYXNzLCBzYWx0KTtcbiAgY29uc3QgY2hlY2tIYXNoU3RyaW5nID0gdXRpbHMuYmFzZTU4Y2hlY2suZW5jb2RlKHRvQnl0ZXMoY2hlY2tIYXNoKSk7XG5cbiAgaWYgKGNoZWNrSGFzaFN0cmluZyAhPT0gZGF0YS5wYXNzX2hhc2gpIHtcbiAgICB0aHJvdyBLZXlzdG9yZUVycm9yLkludmFsaWRQYXNzd29yZDtcbiAgfVxuXG4gIGNvbnN0IGRlY3J5cHRlZEtleXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBkYXRhLmtleXMubWFwKGFzeW5jIChrZXlEYXRhKSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5iYXNlNThjaGVjay5kZWNvZGUoa2V5RGF0YS5rZXkpO1xuICAgICAgY29uc3Qgbm9uY2UgPSB1dGlscy5iYXNlNThjaGVjay5kZWNvZGUoa2V5RGF0YS5pdik7XG5cbiAgICAgIGNvbnN0IGRlY3J5cHRlZEtleSA9IGF3YWl0IGRlY3J5cHQoXG4gICAgICAgIHBhc3MsXG4gICAgICAgIGtleSxcbiAgICAgICAgc2FsdCxcbiAgICAgICAgbm9uY2UsXG4gICAgICAgIEtFWUdFTl9JVEVSQVRJT05TX1YyLFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiB1dGlscy5iYXNlNThjaGVjay5lbmNvZGUoZGVjcnlwdGVkS2V5KSxcbiAgICAgIH07XG4gICAgfSksXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9uLFxuICAgIGFjdGl2ZUluZGV4OiAwLFxuICAgIGtleXM6IGRlY3J5cHRlZEtleXMsXG4gIH07XG59XG5hc3luYyBmdW5jdGlvbiByZWFkVjMoZGF0YTogS2V5RmlsZVYzLCBwYXNzKSB7XG4gIGNvbnN0IHZlcnNpb24gPSBkYXRhLnZlcnNpb247XG5cbiAgY29uc3Qgc2FsdCA9IHV0aWxzLmJhc2U1OGNoZWNrLmRlY29kZShkYXRhLnNhbHQpO1xuXG4gIGNvbnN0IGNoZWNrSGFzaCA9IGF3YWl0IGNhbGN1bGF0ZVBhc3N3b3JkSGFzaChwYXNzLCBzYWx0KTtcbiAgY29uc3QgY2hlY2tIYXNoU3RyaW5nID0gdXRpbHMuYmFzZTU4Y2hlY2suZW5jb2RlKGNoZWNrSGFzaC5oYXNoKTtcblxuICBpZiAoY2hlY2tIYXNoU3RyaW5nICE9PSBkYXRhLnBhc3NfaGFzaCkge1xuICAgIHRocm93IEtleXN0b3JlRXJyb3IuSW52YWxpZFBhc3N3b3JkO1xuICB9XG5cbiAgY29uc3QgZGVjcnlwdGVkS2V5cyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgIGRhdGEua2V5cy5tYXAoYXN5bmMgKGtleURhdGEpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmJhc2U1OGNoZWNrLmRlY29kZShrZXlEYXRhLmtleSk7XG4gICAgICBjb25zdCBub25jZSA9IHV0aWxzLmJhc2U1OGNoZWNrLmRlY29kZShrZXlEYXRhLml2KTtcblxuICAgICAgY29uc3QgZGVjcnlwdGVkS2V5ID0gYXdhaXQgZGVjcnlwdChwYXNzLCBrZXksIHNhbHQsIG5vbmNlKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiB1dGlscy5iYXNlNThjaGVjay5lbmNvZGUoZGVjcnlwdGVkS2V5KSxcbiAgICAgIH07XG4gICAgfSksXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9uLFxuICAgIGFjdGl2ZUluZGV4OiAwLFxuICAgIGtleXM6IGRlY3J5cHRlZEtleXMsXG4gIH07XG59XG5hc3luYyBmdW5jdGlvbiByZWFkVjQoZGF0YTogS2V5RmlsZVY0LCBwYXNzKTogUHJvbWlzZTxLZXlGaWxlRGVjcnlwdGVkVjU+IHtcbiAgY29uc3QgdmVyc2lvbiA9IGRhdGEudmVyc2lvbjtcblxuICBjb25zdCBzYWx0ID0gdXRpbHMuYmFzZTU4Y2hlY2suZGVjb2RlKGRhdGEuc2FsdCk7XG4gIGNvbnN0IGNoZWNrSGFzaCA9IGF3YWl0IGNhbGN1bGF0ZVBhc3N3b3JkSGFzaChwYXNzLCBzYWx0KTtcbiAgY29uc3QgY2hlY2tIYXNoU3RyaW5nID0gdXRpbHMuYmFzZTU4Y2hlY2suZW5jb2RlKGNoZWNrSGFzaC5oYXNoKTtcblxuICBpZiAoY2hlY2tIYXNoU3RyaW5nICE9PSBkYXRhLnBhc3NfaGFzaCkge1xuICAgIHRocm93IEtleXN0b3JlRXJyb3IuSW52YWxpZFBhc3N3b3JkO1xuICB9XG5cbiAgY29uc3QgZGVjcnlwdGVkS2V5cyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgIGRhdGEua2V5cy5tYXAoYXN5bmMgKGtleURhdGEpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmJhc2U1OGNoZWNrLmRlY29kZShrZXlEYXRhLmtleSk7XG4gICAgICBjb25zdCBub25jZSA9IHV0aWxzLmJhc2U1OGNoZWNrLmRlY29kZShrZXlEYXRhLml2KTtcblxuICAgICAgY29uc3QgZGVjcnlwdGVkS2V5ID0gYXdhaXQgZGVjcnlwdChwYXNzLCBrZXksIHNhbHQsIG5vbmNlKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiB1dGlscy5iYXNlNThjaGVjay5lbmNvZGUoZGVjcnlwdGVkS2V5KSxcbiAgICAgIH07XG4gICAgfSksXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9uLFxuICAgIGFjdGl2ZUluZGV4OiAwLFxuICAgIGtleXM6IGRlY3J5cHRlZEtleXMsXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlYWRWNShkYXRhOiBLZXlGaWxlVjUsIHBhc3MpOiBQcm9taXNlPEtleUZpbGVEZWNyeXB0ZWRWNT4ge1xuICBjb25zdCB2ZXJzaW9uID0gZGF0YS52ZXJzaW9uO1xuXG4gIGNvbnN0IHNhbHQgPSB1dGlscy5iYXNlNThjaGVjay5kZWNvZGUoZGF0YS5zYWx0KTtcblxuICBjb25zdCBjaGVja0hhc2ggPSBhd2FpdCBjYWxjdWxhdGVQYXNzd29yZEhhc2gocGFzcywgc2FsdCk7XG4gIGNvbnN0IGNoZWNrSGFzaFN0cmluZyA9IHV0aWxzLmJhc2U1OGNoZWNrLmVuY29kZShjaGVja0hhc2guaGFzaCk7XG5cbiAgaWYgKGNoZWNrSGFzaFN0cmluZyAhPT0gZGF0YS5wYXNzX2hhc2gpIHtcbiAgICB0aHJvdyBLZXlzdG9yZUVycm9yLkludmFsaWRQYXNzd29yZDtcbiAgfVxuXG4gIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcblxuICBjb25zdCBkZWNyeXB0ZWRLZXlzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgZGF0YS5rZXlzLm1hcChhc3luYyAoa2V5RGF0YSkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuYmFzZTU4Y2hlY2suZGVjb2RlKGtleURhdGEua2V5KTtcbiAgICAgIGNvbnN0IG5vbmNlID0gdXRpbHMuYmFzZTU4Y2hlY2suZGVjb2RlKGtleURhdGEuaXYpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IGRlY29kZXIuZGVjb2RlKGF3YWl0IGRlY3J5cHQocGFzcywga2V5LCBzYWx0LCBub25jZSkpLFxuICAgICAgfTtcbiAgICB9KSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHZlcnNpb24sXG4gICAgYWN0aXZlSW5kZXg6IDAsXG4gICAga2V5czogZGVjcnlwdGVkS2V5cyxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVhZFY2KGRhdGE6IEtleUZpbGVWNiwgcGFzcyk6IFByb21pc2U8S2V5RmlsZURlY3J5cHRlZFY2PiB7XG4gIGNvbnN0IHZlcnNpb24gPSBkYXRhLnZlcnNpb247XG4gIGNvbnN0IGFjdGl2ZUluZGV4ID0gZGF0YS5hY3RpdmVJbmRleDtcblxuICBjb25zdCBzYWx0ID0gdXRpbHMuYmFzZTU4Y2hlY2suZGVjb2RlKGRhdGEuc2FsdCk7XG4gIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcblxuICBjb25zdCBkZWNyeXB0ZWRLZXlzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgZGF0YS5rZXlzLm1hcChhc3luYyAoa2V5RGF0YSkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuYmFzZTU4Y2hlY2suZGVjb2RlKGtleURhdGEua2V5KTtcbiAgICAgIGNvbnN0IG5vbmNlID0gdXRpbHMuYmFzZTU4Y2hlY2suZGVjb2RlKGtleURhdGEuaXYpO1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtleTogZGVjb2Rlci5kZWNvZGUoYXdhaXQgZGVjcnlwdChwYXNzLCBrZXksIHNhbHQsIG5vbmNlKSksXG4gICAgICAgICAgdHlwZToga2V5RGF0YS50eXBlLFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaCAoX2Vycikge1xuICAgICAgICB0aHJvdyBLZXlzdG9yZUVycm9yLkludmFsaWRQYXNzd29yZDtcbiAgICAgIH1cbiAgICB9KSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHZlcnNpb24sXG4gICAgYWN0aXZlSW5kZXg6IGFjdGl2ZUluZGV4IHx8IDAsXG4gICAga2V5czogZGVjcnlwdGVkS2V5cyxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRLZXlGaWxlKFxuICBkYXRhOiBBbGxLZXlGaWxlVHlwZXMsXG4gIHBhc3M6IHN0cmluZyxcbik6IFByb21pc2U8QWxsS2V5RmlsZURlY3J5cHRlZFR5cGVzPiB7XG4gIHN3aXRjaCAoZGF0YS52ZXJzaW9uKSB7XG4gICAgY2FzZSAnNi4wJzpcbiAgICAgIHJldHVybiBhd2FpdCByZWFkVjYoZGF0YSBhcyBLZXlGaWxlVjYsIHBhc3MpO1xuICAgIGNhc2UgJzUuMCc6XG4gICAgICByZXR1cm4gYXdhaXQgcmVhZFY1KGRhdGEgYXMgS2V5RmlsZVY1LCBwYXNzKTtcbiAgICBjYXNlICc0LjAnOlxuICAgICAgcmV0dXJuIGF3YWl0IHJlYWRWNChkYXRhIGFzIEtleUZpbGVWNCwgcGFzcyk7XG4gICAgY2FzZSAnMy4wJzpcbiAgICAgIHJldHVybiBhd2FpdCByZWFkVjMoZGF0YSBhcyBLZXlGaWxlVjMsIHBhc3MpO1xuICAgIGNhc2UgJzIuMCc6XG4gICAgICByZXR1cm4gYXdhaXQgcmVhZFYyKGRhdGEgYXMgS2V5RmlsZVYyLCBwYXNzKTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgS2V5c3RvcmVFcnJvci5JbnZhbGlkVmVyc2lvbjtcbiAgfVxufVxuXG5mdW5jdGlvbiBleHRyYWN0S2V5c1YyKHtcbiAga2V5cyxcbn06XG4gIHwgS2V5RmlsZURlY3J5cHRlZFYyXG4gIHwgS2V5RmlsZURlY3J5cHRlZFYzXG4gIHwgS2V5RmlsZURlY3J5cHRlZFY0KTogQWNjZXNzV2FsbGV0TXVsdGlwbGVJbnB1dFtdIHtcbiAgcmV0dXJuIGtleXMubWFwKChrZXkpID0+IHtcbiAgICBjb25zdCBrZXlCdWYgPSBCdWZmZXIuZnJvbSh1dGlscy5iYXNlNThjaGVjay5kZWNvZGUoa2V5LmtleSkpO1xuICAgIGNvbnN0IGtleUhleCA9IGtleUJ1Zi50b1N0cmluZygnaGV4Jyk7XG4gICAgY29uc3QgcGFkZGVkS2V5SGV4ID0ga2V5SGV4LnBhZFN0YXJ0KDY0LCAnMCcpO1xuICAgIGNvbnN0IG1uZW1vbmljID0gYmlwMzkuZW50cm9weVRvTW5lbW9uaWMocGFkZGVkS2V5SGV4KTtcblxuICAgIHJldHVybiB7XG4gICAgICBrZXk6IG1uZW1vbmljLFxuICAgICAgdHlwZTogJ21uZW1vbmljJyxcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdEtleXNWNShmaWxlOiBLZXlGaWxlRGVjcnlwdGVkVjUpOiBBY2Nlc3NXYWxsZXRNdWx0aXBsZUlucHV0W10ge1xuICByZXR1cm4gZmlsZS5rZXlzLm1hcCgoa2V5KSA9PiAoe1xuICAgIGtleToga2V5LmtleSxcbiAgICB0eXBlOiAnbW5lbW9uaWMnLFxuICB9KSk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RLZXlzVjYoZmlsZTogS2V5RmlsZURlY3J5cHRlZFY2KTogQWNjZXNzV2FsbGV0TXVsdGlwbGVJbnB1dFtdIHtcbiAgcmV0dXJuIGZpbGUua2V5cy5tYXAoKGtleSkgPT4gKHtcbiAgICB0eXBlOiBrZXkudHlwZSxcbiAgICBrZXk6IGtleS5rZXksXG4gIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RLZXlzRnJvbURlY3J5cHRlZEZpbGUoXG4gIGZpbGU6IEFsbEtleUZpbGVEZWNyeXB0ZWRUeXBlcyxcbik6IEFjY2Vzc1dhbGxldE11bHRpcGxlSW5wdXRbXSB7XG4gIHN3aXRjaCAoZmlsZS52ZXJzaW9uKSB7XG4gICAgY2FzZSAnNi4wJzpcbiAgICAgIHJldHVybiBleHRyYWN0S2V5c1Y2KGZpbGUgYXMgS2V5RmlsZURlY3J5cHRlZFY2KTtcbiAgICBjYXNlICc1LjAnOlxuICAgICAgcmV0dXJuIGV4dHJhY3RLZXlzVjUoZmlsZSBhcyBLZXlGaWxlRGVjcnlwdGVkVjUpO1xuICAgIGNhc2UgJzQuMCc6XG4gICAgICByZXR1cm4gZXh0cmFjdEtleXNWMihmaWxlIGFzIEtleUZpbGVEZWNyeXB0ZWRWNCk7XG4gICAgY2FzZSAnMy4wJzpcbiAgICAgIHJldHVybiBleHRyYWN0S2V5c1YyKGZpbGUgYXMgS2V5RmlsZURlY3J5cHRlZFYzKTtcbiAgICBjYXNlICcyLjAnOlxuICAgICAgcmV0dXJuIGV4dHJhY3RLZXlzVjIoZmlsZSBhcyBLZXlGaWxlRGVjcnlwdGVkVjIpO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBLZXlzdG9yZUVycm9yLkludmFsaWRWZXJzaW9uO1xuICB9XG59XG4iXSwibmFtZXMiOlsidXNlQ2FsbGJhY2siLCJ1c2VLZXlib2FyZFNob3J0Y3V0cyIsInNob3J0Y3V0cyIsIm9uS2V5RG93biIsImV2ZW50IiwiY2FsbGJhY2siLCJrZXkiLCJwcmV2ZW50RGVmYXVsdCIsInVzZVJlZiIsInVzZVN0YXRlIiwiQnV0dG9uIiwiRGlhbG9nIiwiRGlhbG9nQWN0aW9ucyIsIkRpYWxvZ0NvbnRlbnQiLCJEaWFsb2dUaXRsZSIsIlN0YWNrIiwiVGV4dEZpZWxkIiwiVHlwb2dyYXBoeSIsInRvYXN0IiwidXNlVGhlbWUiLCJ1c2VIaXN0b3J5IiwidXNlVHJhbnNsYXRpb24iLCJQYWdlVGl0bGUiLCJLZXlzdG9yZUVycm9yIiwidXNlRXJyb3JNZXNzYWdlIiwidXNlQW5hbHl0aWNzQ29udGV4dCIsIktleXN0b3JlRmlsZUVycm9yIiwiS2V5c3RvcmVGaWxlVXBsb2FkIiwidXNlS2V5c3RvcmVGaWxlSW1wb3J0IiwiS2V5c3RvcmVGaWxlQ29uZmlybWF0aW9uIiwiU3RlcCIsIkVNUFRZX0ZJTEVfSU5GTyIsInNlZWRQaHJhc2VzQ291bnQiLCJwcml2YXRlS2V5c0NvdW50IiwiQWRkV2FsbGV0V2l0aEtleXN0b3JlRmlsZSIsInRoZW1lIiwiaGlzdG9yeSIsInQiLCJjYXB0dXJlIiwiZ2V0VHJhbnNsYXRlZEVycm9yIiwic3RlcCIsInNldFN0ZXAiLCJDaG9vc2VGaWxlIiwiZmlsZSIsInNldEZpbGUiLCJmaWxlUGFzc3dvcmQiLCJzZXRGaWxlUGFzc3dvcmQiLCJmaWxlSW5mbyIsInNldEZpbGVJbmZvIiwiZXJyb3IiLCJzZXRFcnJvciIsImlucHV0UmVmIiwiZ2V0S2V5Q291bnRzIiwiaW1wb3J0S2V5c3RvcmVGaWxlIiwiaXNJbXBvcnRpbmciLCJpc1JlYWRpbmciLCJpc1ZhbGlkS2V5c3RvcmVGaWxlIiwidGl0bGUiLCJlcnJvck1lc3NhZ2UiLCJyZXN0YXJ0IiwiY3VycmVudCIsInZhbHVlIiwib25GaWxlU2VsZWN0ZWQiLCJyYXdGaWxlIiwiSW52YWxpZFZlcnNpb24iLCJFcnJvciIsIlByb3ZpZGVQYXNzd29yZCIsImhhbmRsZURyb3AiLCJldiIsIml0ZW0iLCJkYXRhVHJhbnNmZXIiLCJpdGVtcyIsImdldEFzRmlsZSIsImhhbmRsZUltcG9ydCIsInN1Y2Nlc3MiLCJyZXBsYWNlIiwiZXJyIiwicmVhZEtleXN0b3JlRmlsZSIsImluZm8iLCJDb25maXJtRGF0YSIsIkludmFsaWRQYXNzd29yZCIsImtleWJvYXJkSGFuZGxlcnMiLCJFbnRlciIsIkVzY2FwZSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkZyYWdtZW50Iiwic3giLCJ3aWR0aCIsImhlaWdodCIsImJhY2tncm91bmQiLCJwYWxldHRlIiwicGFwZXIiLCJkaXJlY3Rpb24iLCJtdCIsIm1iIiwicHIiLCJvbkJhY2tDbGljayIsIm9uRHJvcCIsInRhcmdldCIsImZpbGVzIiwiZmlsZU5hbWUiLCJuYW1lIiwiaXNMb2FkaW5nIiwib25Db25maXJtIiwib25DYW5jZWwiLCJvblRyeUFnYWluIiwib3BlbiIsImZ1bGxXaWR0aCIsIm9uQ2xvc2UiLCJQYXBlclByb3BzIiwibSIsIm1heFdpZHRoIiwidmFyaWFudCIsIl9leHRlbmRzIiwiYXV0b0ZvY3VzIiwibGFiZWwiLCJpbnB1dExhYmVsUHJvcHMiLCJ0cmFuc2Zvcm0iLCJmb250U2l6ZSIsImhlbHBlclRleHQiLCJwbGFjZWhvbGRlciIsInR5cGUiLCJvbkNoYW5nZSIsInNpemUiLCJkaXNhYmxlZCIsIm9uQ2xpY2siLCJDYXJkIiwiVG9vbHRpcCIsInB4IiwicHQiLCJmbGV4R3JvdyIsImdhcCIsImZvbnRXZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwid2hpdGVTcGFjZSIsImZsZXhTaHJpbmsiLCJ3cmFwV2l0aFNwYW4iLCJ0ZXh0T3ZlcmZsb3ciLCJvdmVyZmxvdyIsInB5IiwiYm9yZGVyUmFkaXVzIiwibXkiLCJjb2xvciIsIkFsZXJ0Q2lyY2xlSWNvbiIsImhpbnQiLCJ0ZXh0QWxpZ24iLCJVcGxvYWRJY29uIiwiaXNEcmFnZ2luZ092ZXIiLCJzZXRJc0RyYWdnaW5nT3ZlciIsInRyYW5zaXRpb24iLCJ0cmFuc2l0aW9ucyIsImNyZWF0ZSIsImxpZ2h0IiwiYm9yZGVyIiwib25EcmFnT3ZlciIsIm9uRHJhZ0VudGVyIiwib25EcmFnTGVhdmUiLCJwb2ludGVyRXZlbnRzIiwiY29tcG9uZW50IiwiaHRtbEZvciIsInJlZiIsImhpZGRlbiIsImlkIiwiRXh0ZW5zaW9uUmVxdWVzdCIsInVzZUNvbm5lY3Rpb25Db250ZXh0IiwidXNlSW1wb3J0U2VlZHBocmFzZSIsInJlcXVlc3QiLCJzZXRJc0ltcG9ydGluZyIsImltcG9ydFNlZWRwaHJhc2UiLCJwYXJhbXMiLCJyZXN1bHQiLCJtZXRob2QiLCJXQUxMRVRfSU1QT1JUX1NFRURfUEhSQVNFIiwicmVhZEpzb25GaWxlIiwianNvbkZpbGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsIkpTT04iLCJwYXJzZSIsInRvU3RyaW5nIiwib25lcnJvciIsInJlYWRBc1RleHQiLCJ1c2VKc29uRmlsZVJlYWRlciIsInNldElzUmVhZGluZyIsInJlYWQiLCJKb2kiLCJ1dGlscyIsImV4dHJhY3RLZXlzRnJvbURlY3J5cHRlZEZpbGUiLCJyZWFkS2V5RmlsZSIsIlNlZWRwaHJhc2VJbXBvcnRFcnJvciIsImlzV3JhcHBlZEVycm9yIiwidXNlUHJpdmF0ZUtleUltcG9ydCIsInVzZUFjY291bnRzQ29udGV4dCIsImlzSW1wb3J0aW5nU2VlZHBocmFzZSIsImlzSW1wb3J0aW5nUHJpdmF0ZUtleSIsImltcG9ydFByaXZhdGVLZXkiLCJzZWxlY3RBY2NvdW50IiwiZXh0cmFjdEtleXMiLCJwYXNzd29yZCIsImRhdGEiLCJ2ZXJzaW9uIiwiZGVjcnlwdGVkRmlsZSIsImtleXMiLCJpIiwibGVuZ3RoIiwia2V5RGF0YSIsInByaXZhdGVLZXkiLCJCdWZmZXIiLCJmcm9tIiwiYmFzZTU4Y2hlY2siLCJkZWNvZGUiLCJhY2NvdW50SWQiLCJtbmVtb25pYyIsInJlYXNvbiIsIkV4aXN0aW5nU2VlZHBocmFzZSIsInJlZHVjZSIsImNvdW50cyIsIktFWVNUT1JFX0ZJTEVfU0NIRU1BIiwidmFsaWRhdGUiLCJvYmplY3QiLCJzdHJpbmciLCJyZXF1aXJlZCIsInNhbHQiLCJhcnJheSIsIml2IiwidW5rbm93biIsInNlbnRyeUNhcHR1cmVFeGNlcHRpb24iLCJTZW50cnlFeGNlcHRpb25UeXBlcyIsIkltcG9ydFR5cGUiLCJhZGRBY2NvdW50IiwiaW1wb3J0VHlwZSIsIlBSSVZBVEVfS0VZIiwic3RyaXAweCIsIldBTExFVF9JTVBPUlQiLCJzaGEyNTYiLCJjb25jYXRCeXRlcyIsInJhbmRvbUJ5dGVzIiwidXRmOFRvQnl0ZXMiLCJTQUxUX1NJWkUiLCJBRVNfTEVOR1RIIiwiVEFHX0xFTkdUSCIsIktFWUdFTl9JVEVSQVRJT05TX1YzIiwibWFrZVNhbHQiLCJnZXRIYXNoIiwiY2FsY3VsYXRlUGFzc3dvcmRIYXNoIiwic2x0IiwiVWludDhBcnJheSIsImhhc2giLCJpbXBvcnRLZXkiLCJwd2tleSIsImNyeXB0byIsInN1YnRsZSIsImRlcml2ZUtleSIsImtleU1hdGVyaWFsIiwiaXRlcmF0aW9ucyIsImRlY3J5cHQiLCJjaXBoZXJ0ZXh0Iiwia2V5Z2VuSXRlcmF0aW9ucyIsInBrZXkiLCJhZGRpdGlvbmFsRGF0YSIsInRhZ0xlbmd0aCIsImJpcDM5IiwidG9CeXRlcyIsIktFWVNUT1JFX1ZFUlNJT04iLCJLRVlHRU5fSVRFUkFUSU9OU19WMiIsInJlYWRWMiIsInBhc3MiLCJjaGVja0hhc2giLCJjaGVja0hhc2hTdHJpbmciLCJlbmNvZGUiLCJwYXNzX2hhc2giLCJkZWNyeXB0ZWRLZXlzIiwiYWxsIiwibWFwIiwibm9uY2UiLCJkZWNyeXB0ZWRLZXkiLCJhY3RpdmVJbmRleCIsInJlYWRWMyIsInJlYWRWNCIsInJlYWRWNSIsImRlY29kZXIiLCJUZXh0RGVjb2RlciIsInJlYWRWNiIsIl9lcnIiLCJleHRyYWN0S2V5c1YyIiwia2V5QnVmIiwia2V5SGV4IiwicGFkZGVkS2V5SGV4IiwicGFkU3RhcnQiLCJlbnRyb3B5VG9NbmVtb25pYyIsImV4dHJhY3RLZXlzVjUiLCJleHRyYWN0S2V5c1Y2Il0sInNvdXJjZVJvb3QiOiIifQ==