"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_SeedlessPopups_SeedlessExportPopup_tsx"],{

/***/ "./src/components/common/seedless/components/PhraseReadyToExport.tsx":
/*!***************************************************************************!*\
  !*** ./src/components/common/seedless/components/PhraseReadyToExport.tsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhraseReadyToExport": () => (/* binding */ PhraseReadyToExport)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_background_services_seedless_seedlessAnalytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/seedless/seedlessAnalytics */ "./src/background/services/seedless/seedlessAnalytics.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const PLACEHOLDER_MNEMONIC = 'west mention cat frog interest lighter ponder vast west book tree pen health dupa chip moral enroll chair hub book pioneer fortune can beautiful';
const PhraseReadyToExport = ({
  completeExport,
  mnemonic,
  isDecrypting
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const [showCloseWarning, setShowCloseWarning] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const handleCopy = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    navigator.clipboard.writeText(mnemonic);
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"].success('Copied!', {
      duration: 2000
    });
    capture(_src_background_services_seedless_seedlessAnalytics__WEBPACK_IMPORTED_MODULE_1__.SeedlessExportAnalytics.PhraseCopied);
  }, [mnemonic, capture]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 1,
      px: 2,
      mt: -2,
      gap: 1,
      justifyContent: 'space-between',
      flexGrow: 1,
      pb: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Alert, {
    severity: "warning",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.AlertTriangleIcon, null),
    sx: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      px: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.AlertContent, {
    sx: {
      pl: 0.5,
      pr: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2"
  }, t('Do not share this phrase with anyone! These words can be used to steal all your accounts.')))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'fontWeightSemibold'
    }
  }, t('Recovery Phrase')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Card, {
    sx: {
      backgroundColor: 'grey.850'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.CardContent, {
    sx: {
      px: 2,
      filter: mnemonic ? 'none' : 'blur(5px)'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2"
  }, mnemonic || PLACEHOLDER_MNEMONIC))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Box, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    size: "small",
    variant: "text",
    disabled: isDecrypting,
    isLoading: isDecrypting,
    "data-testid": `seedless-export-recovery-phrase-${mnemonic ? 'close' : 'decrypt'}`,
    onClick: async () => {
      if (mnemonic) {
        setShowCloseWarning(true);
      } else {
        await completeExport();
      }
    }
  }, mnemonic ? t('Hide Recovery Phrase') : t('Show Recovery Phrase')))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      gap: 1,
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    color: "primary",
    size: "large",
    fullWidth: true,
    disabled: !mnemonic,
    onClick: handleCopy,
    "data-testid": "seedless-export-recovery-phrase-copy-mnemonic"
  }, t('Copy Recovery Phrase')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    variant: "text",
    size: "large",
    fullWidth: true,
    onClick: () => setShowCloseWarning(true)
  }, t('Close'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Dialog, {
    open: showCloseWarning
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.DialogTitle, null, t('Confirm Close?')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.DialogContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2"
  }, t('Closing the settings menu will require you to restart the 2 day waiting period.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.DialogActions, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    size: "large",
    color: "primary",
    onClick: window.close,
    "data-testid": "seedless-export-recovery-phrase-confirm-close"
  }, t('Confirm')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    variant: "text",
    size: "large",
    onClick: () => setShowCloseWarning(false),
    "data-testid": "seedless-export-recovery-phrase-cancel-close"
  }, t('Cancel')))));
};

/***/ }),

/***/ "./src/pages/SeedlessPopups/SeedlessExportPopup.tsx":
/*!**********************************************************!*\
  !*** ./src/pages/SeedlessPopups/SeedlessExportPopup.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SeedlessExportPopup": () => (/* binding */ SeedlessExportPopup)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useSeedlessMnemonicExport */ "./src/hooks/useSeedlessMnemonicExport.ts");
/* harmony import */ var _src_hooks_useSeedlessMfa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useSeedlessMfa */ "./src/hooks/useSeedlessMfa.tsx");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_components_common_seedless_components_ExportPending__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/seedless/components/ExportPending */ "./src/components/common/seedless/components/ExportPending.tsx");
/* harmony import */ var _src_components_common_seedless_components_PhraseReadyToExport__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/components/common/seedless/components/PhraseReadyToExport */ "./src/components/common/seedless/components/PhraseReadyToExport.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_background_services_seedless_seedlessAnalytics__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/services/seedless/seedlessAnalytics */ "./src/background/services/seedless/seedlessAnalytics.ts");
/* harmony import */ var _src_components_common_seedless_components_ExportError__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/components/common/seedless/components/ExportError */ "./src/components/common/seedless/components/ExportError.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");











const SeedlessExportPopup = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_9__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__.useAnalyticsContext)();
  const {
    renderMfaPrompt
  } = (0,_src_hooks_useSeedlessMfa__WEBPACK_IMPORTED_MODULE_2__.useSeedlessMfa)();
  const {
    state,
    error,
    initExport,
    cancelExport,
    completeExport,
    progress,
    timeLeft,
    mnemonic
  } = (0,_src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.useSeedlessMnemonicExport)();
  const handleResignation = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    capture(_src_background_services_seedless_seedlessAnalytics__WEBPACK_IMPORTED_MODULE_7__.SeedlessExportAnalytics.Resigned).finally(window.close);
  }, [capture]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Error && /*#__PURE__*/React.createElement(_src_components_common_seedless_components_ExportError__WEBPACK_IMPORTED_MODULE_8__.ExportError, {
    error: error,
    onRetry: initExport,
    onClose: window.close
  }), state !== _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Error && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      width: 1,
      height: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__.PageTitle, {
    variant: _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__.PageTitleVariant.PRIMARY,
    showBackButton: false
  }, t('Export Recovery Phrase')), (state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Pending || state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Cancelling) && /*#__PURE__*/React.createElement(_src_components_common_seedless_components_ExportPending__WEBPACK_IMPORTED_MODULE_4__.ExportPending, {
    progress: progress,
    timeLeft: timeLeft,
    cancelExport: async () => {
      await cancelExport();
      window.close();
    },
    isCancelling: state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Cancelling,
    showCloseWindowButton: true
  }), (state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.ReadyToExport || state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Exporting || state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Exported) && /*#__PURE__*/React.createElement(_src_components_common_seedless_components_PhraseReadyToExport__WEBPACK_IMPORTED_MODULE_5__.PhraseReadyToExport, {
    completeExport: completeExport,
    isDecrypting: state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Exporting,
    mnemonic: mnemonic
  })), (state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Initiating || state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.Exporting) && renderMfaPrompt(), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Dialog, {
    open: state === _src_hooks_useSeedlessMnemonicExport__WEBPACK_IMPORTED_MODULE_1__.ExportState.NotInitiated,
    PaperProps: {
      sx: {
        m: 2,
        textAlign: 'center'
      }
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.DialogTitle, null, t('Waiting Period')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.DialogContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, {
    variant: "body2"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_11__.Trans, {
    i18nKey: "It will take <b>2 days</b> to retrieve your recovery phrase. You will only have <b>48 hours</b> to copy your recovery phrase once the 2 day waiting period is over.",
    components: {
      b: /*#__PURE__*/React.createElement("b", null)
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.DialogActions, {
    sx: {
      pt: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    color: "primary",
    size: "large",
    fullWidth: true,
    onClick: initExport,
    "data-testid": "seedless-export-recovery-phrase-confirm-export"
  }, t('Next')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    variant: "text",
    size: "large",
    onClick: handleResignation,
    "data-testid": "seedless-export-recovery-phrase-resign"
  }, t('Cancel'))))));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1NlZWRsZXNzUG9wdXBzX1NlZWRsZXNzRXhwb3J0UG9wdXBfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUE4QztBQUNDO0FBZ0JWO0FBRXlEO0FBQ3hCO0FBUXRFLE1BQU1tQixvQkFBb0IsR0FDeEIsa0pBQWtKO0FBRTdJLE1BQU1DLG1CQUFtQixHQUFHQSxDQUFDO0VBQ2xDQyxjQUFjO0VBQ2RDLFFBQVE7RUFDUkM7QUFDSyxDQUFDLEtBQUs7RUFDWCxNQUFNO0lBQUVDO0VBQUUsQ0FBQyxHQUFHdEIsNkRBQWMsRUFBRTtFQUM5QixNQUFNO0lBQUV1QjtFQUFRLENBQUMsR0FBR1Asb0ZBQW1CLEVBQUU7RUFFekMsTUFBTSxDQUFDUSxnQkFBZ0IsRUFBRUMsbUJBQW1CLENBQUMsR0FBRzFCLCtDQUFRLENBQUMsS0FBSyxDQUFDO0VBRS9ELE1BQU0yQixVQUFVLEdBQUc1QixrREFBVyxDQUFDLE1BQU07SUFDbkM2QixTQUFTLENBQUNDLFNBQVMsQ0FBQ0MsU0FBUyxDQUFDVCxRQUFRLENBQUM7SUFDdkNOLDJFQUFhLENBQUMsU0FBUyxFQUFFO01BQUVpQixRQUFRLEVBQUU7SUFBSyxDQUFDLENBQUM7SUFDNUNSLE9BQU8sQ0FBQ1IscUhBQW9DLENBQUM7RUFDL0MsQ0FBQyxFQUFFLENBQUNLLFFBQVEsRUFBRUcsT0FBTyxDQUFDLENBQUM7RUFFdkIsb0JBQ0VVLEtBQUEsQ0FBQUMsYUFBQSxDQUFDdEIsOERBQUs7SUFDSnVCLEVBQUUsRUFBRTtNQUNGQyxLQUFLLEVBQUUsQ0FBQztNQUNSQyxFQUFFLEVBQUUsQ0FBQztNQUNMQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ05DLEdBQUcsRUFBRSxDQUFDO01BQ05DLGNBQWMsRUFBRSxlQUFlO01BQy9CQyxRQUFRLEVBQUUsQ0FBQztNQUNYQyxFQUFFLEVBQUU7SUFDTjtFQUFFLGdCQUVGVCxLQUFBLENBQUFDLGFBQUEsQ0FBQ3RCLDhEQUFLO0lBQUN1QixF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QUMsZUFBRXBFLEtBQUEsQ0FBQUMsYUFBQTtJQUNMO0VBQUUsRUFDRixDQUNTLENBQ0MsZUFDaEJELEtBQUEsQ0FBQUMsYUFBQSxDQUFDekIsdUVBQWE7SUFBQzBCLEVBQUUsRUFBRTtNQUFFbUUsRUFBRSxFQUFFO0lBQUU7RUFBRSxnQkFDM0JyRSxLQUFBLENBQUFDLGFBQUEsQ0FBQzdCLGdFQUFNO0lBQ0xtRCxLQUFLLEVBQUMsU0FBUztJQUNmSixJQUFJLEVBQUMsT0FBTztJQUNaSyxTQUFTO0lBQ1RGLE9BQU8sRUFBRWtCLFVBQVc7SUFDcEIsZUFBWTtFQUFnRCxHQUUzRG5ELENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDSCxlQUNUVyxLQUFBLENBQUFDLGFBQUEsQ0FBQzdCLGdFQUFNO0lBQ0w0QyxPQUFPLEVBQUMsTUFBTTtJQUNkRyxJQUFJLEVBQUMsT0FBTztJQUNaRyxPQUFPLEVBQUVzQixpQkFBa0I7SUFDM0IsZUFBWTtFQUF3QyxHQUVuRHZELENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDTCxDQUNLLENBQ1QsQ0FFWixDQUNBO0FBRVAsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2VlZGxlc3MvY29tcG9uZW50cy9QaHJhc2VSZWFkeVRvRXhwb3J0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlZWRsZXNzUG9wdXBzL1NlZWRsZXNzRXhwb3J0UG9wdXAudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBBbGVydCxcbiAgQWxlcnRDb250ZW50LFxuICBBbGVydFRyaWFuZ2xlSWNvbixcbiAgQm94LFxuICBCdXR0b24sXG4gIENhcmQsXG4gIENhcmRDb250ZW50LFxuICBEaWFsb2csXG4gIERpYWxvZ0FjdGlvbnMsXG4gIERpYWxvZ0NvbnRlbnQsXG4gIERpYWxvZ1RpdGxlLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdG9hc3QsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IFNlZWRsZXNzRXhwb3J0QW5hbHl0aWNzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3NlZWRsZXNzL3NlZWRsZXNzQW5hbHl0aWNzJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcblxudHlwZSBQcm9wcyA9IHtcbiAgaXNEZWNyeXB0aW5nOiBib29sZWFuO1xuICBjb21wbGV0ZUV4cG9ydDogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgbW5lbW9uaWM6IHN0cmluZztcbn07XG5cbmNvbnN0IFBMQUNFSE9MREVSX01ORU1PTklDID1cbiAgJ3dlc3QgbWVudGlvbiBjYXQgZnJvZyBpbnRlcmVzdCBsaWdodGVyIHBvbmRlciB2YXN0IHdlc3QgYm9vayB0cmVlIHBlbiBoZWFsdGggZHVwYSBjaGlwIG1vcmFsIGVucm9sbCBjaGFpciBodWIgYm9vayBwaW9uZWVyIGZvcnR1bmUgY2FuIGJlYXV0aWZ1bCc7XG5cbmV4cG9ydCBjb25zdCBQaHJhc2VSZWFkeVRvRXhwb3J0ID0gKHtcbiAgY29tcGxldGVFeHBvcnQsXG4gIG1uZW1vbmljLFxuICBpc0RlY3J5cHRpbmcsXG59OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgY2FwdHVyZSB9ID0gdXNlQW5hbHl0aWNzQ29udGV4dCgpO1xuXG4gIGNvbnN0IFtzaG93Q2xvc2VXYXJuaW5nLCBzZXRTaG93Q2xvc2VXYXJuaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBoYW5kbGVDb3B5ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KG1uZW1vbmljKTtcbiAgICB0b2FzdC5zdWNjZXNzKCdDb3BpZWQhJywgeyBkdXJhdGlvbjogMjAwMCB9KTtcbiAgICBjYXB0dXJlKFNlZWRsZXNzRXhwb3J0QW5hbHl0aWNzLlBocmFzZUNvcGllZCk7XG4gIH0sIFttbmVtb25pYywgY2FwdHVyZV0pO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgcHg6IDIsXG4gICAgICAgIG10OiAtMixcbiAgICAgICAgZ2FwOiAxLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgcGI6IDMsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTdGFjayBzeD17eyBnYXA6IDEgfX0+XG4gICAgICAgIDxBbGVydFxuICAgICAgICAgIHNldmVyaXR5PVwid2FybmluZ1wiXG4gICAgICAgICAgaWNvbj17PEFsZXJ0VHJpYW5nbGVJY29uIC8+fVxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIHB4OiAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8QWxlcnRDb250ZW50IHN4PXt7IHBsOiAwLjUsIHByOiAwIH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAgICdEbyBub3Qgc2hhcmUgdGhpcyBwaHJhc2Ugd2l0aCBhbnlvbmUhIFRoZXNlIHdvcmRzIGNhbiBiZSB1c2VkIHRvIHN0ZWFsIGFsbCB5b3VyIGFjY291bnRzLicsXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPC9BbGVydENvbnRlbnQ+XG4gICAgICAgIDwvQWxlcnQ+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIHN4PXt7IGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnIH19PlxuICAgICAgICAgIHt0KCdSZWNvdmVyeSBQaHJhc2UnKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8Q2FyZCBzeD17eyBiYWNrZ3JvdW5kQ29sb3I6ICdncmV5Ljg1MCcgfX0+XG4gICAgICAgICAgPENhcmRDb250ZW50IHN4PXt7IHB4OiAyLCBmaWx0ZXI6IG1uZW1vbmljID8gJ25vbmUnIDogJ2JsdXIoNXB4KScgfX0+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgICAge21uZW1vbmljIHx8IFBMQUNFSE9MREVSX01ORU1PTklDfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICAgIDwvQ2FyZD5cbiAgICAgICAgPEJveD5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzRGVjcnlwdGluZ31cbiAgICAgICAgICAgIGlzTG9hZGluZz17aXNEZWNyeXB0aW5nfVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZWVkbGVzcy1leHBvcnQtcmVjb3ZlcnktcGhyYXNlLSR7XG4gICAgICAgICAgICAgIG1uZW1vbmljID8gJ2Nsb3NlJyA6ICdkZWNyeXB0J1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICBvbkNsaWNrPXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChtbmVtb25pYykge1xuICAgICAgICAgICAgICAgIHNldFNob3dDbG9zZVdhcm5pbmcodHJ1ZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgY29tcGxldGVFeHBvcnQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bW5lbW9uaWMgPyB0KCdIaWRlIFJlY292ZXJ5IFBocmFzZScpIDogdCgnU2hvdyBSZWNvdmVyeSBQaHJhc2UnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFN0YWNrIHN4PXt7IGdhcDogMSwgd2lkdGg6IDEgfX0+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgZGlzYWJsZWQ9eyFtbmVtb25pY31cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDb3B5fVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VlZGxlc3MtZXhwb3J0LXJlY292ZXJ5LXBocmFzZS1jb3B5LW1uZW1vbmljXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdDb3B5IFJlY292ZXJ5IFBocmFzZScpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNob3dDbG9zZVdhcm5pbmcodHJ1ZSl9XG4gICAgICAgID5cbiAgICAgICAgICB7dCgnQ2xvc2UnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPERpYWxvZyBvcGVuPXtzaG93Q2xvc2VXYXJuaW5nfT5cbiAgICAgICAgPERpYWxvZ1RpdGxlPnt0KCdDb25maXJtIENsb3NlPycpfTwvRGlhbG9nVGl0bGU+XG4gICAgICAgIDxEaWFsb2dDb250ZW50PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgICAge3QoXG4gICAgICAgICAgICAgICdDbG9zaW5nIHRoZSBzZXR0aW5ncyBtZW51IHdpbGwgcmVxdWlyZSB5b3UgdG8gcmVzdGFydCB0aGUgMiBkYXkgd2FpdGluZyBwZXJpb2QuJyxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L0RpYWxvZ0NvbnRlbnQ+XG4gICAgICAgIDxEaWFsb2dBY3Rpb25zPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgICAgb25DbGljaz17d2luZG93LmNsb3NlfVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWVkbGVzcy1leHBvcnQtcmVjb3ZlcnktcGhyYXNlLWNvbmZpcm0tY2xvc2VcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdDb25maXJtJyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNob3dDbG9zZVdhcm5pbmcoZmFsc2UpfVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWVkbGVzcy1leHBvcnQtcmVjb3ZlcnktcGhyYXNlLWNhbmNlbC1jbG9zZVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ0NhbmNlbCcpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0RpYWxvZ0FjdGlvbnM+XG4gICAgICA8L0RpYWxvZz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIERpYWxvZyxcbiAgRGlhbG9nQWN0aW9ucyxcbiAgRGlhbG9nQ29udGVudCxcbiAgRGlhbG9nVGl0bGUsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQge1xuICBFeHBvcnRTdGF0ZSxcbiAgdXNlU2VlZGxlc3NNbmVtb25pY0V4cG9ydCxcbn0gZnJvbSAnQHNyYy9ob29rcy91c2VTZWVkbGVzc01uZW1vbmljRXhwb3J0JztcbmltcG9ydCB7IHVzZVNlZWRsZXNzTWZhIH0gZnJvbSAnQHNyYy9ob29rcy91c2VTZWVkbGVzc01mYSc7XG5pbXBvcnQgeyBQYWdlVGl0bGUsIFBhZ2VUaXRsZVZhcmlhbnQgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyBFeHBvcnRQZW5kaW5nIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9zZWVkbGVzcy9jb21wb25lbnRzL0V4cG9ydFBlbmRpbmcnO1xuaW1wb3J0IHsgUGhyYXNlUmVhZHlUb0V4cG9ydCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vc2VlZGxlc3MvY29tcG9uZW50cy9QaHJhc2VSZWFkeVRvRXhwb3J0JztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IFNlZWRsZXNzRXhwb3J0QW5hbHl0aWNzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3NlZWRsZXNzL3NlZWRsZXNzQW5hbHl0aWNzJztcbmltcG9ydCB7IEV4cG9ydEVycm9yIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9zZWVkbGVzcy9jb21wb25lbnRzL0V4cG9ydEVycm9yJztcblxuZXhwb3J0IGNvbnN0IFNlZWRsZXNzRXhwb3J0UG9wdXAgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IHsgcmVuZGVyTWZhUHJvbXB0IH0gPSB1c2VTZWVkbGVzc01mYSgpO1xuICBjb25zdCB7XG4gICAgc3RhdGUsXG4gICAgZXJyb3IsXG4gICAgaW5pdEV4cG9ydCxcbiAgICBjYW5jZWxFeHBvcnQsXG4gICAgY29tcGxldGVFeHBvcnQsXG4gICAgcHJvZ3Jlc3MsXG4gICAgdGltZUxlZnQsXG4gICAgbW5lbW9uaWMsXG4gIH0gPSB1c2VTZWVkbGVzc01uZW1vbmljRXhwb3J0KCk7XG5cbiAgY29uc3QgaGFuZGxlUmVzaWduYXRpb24gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY2FwdHVyZShTZWVkbGVzc0V4cG9ydEFuYWx5dGljcy5SZXNpZ25lZCkuZmluYWxseSh3aW5kb3cuY2xvc2UpO1xuICB9LCBbY2FwdHVyZV0pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtzdGF0ZSA9PT0gRXhwb3J0U3RhdGUuRXJyb3IgJiYgKFxuICAgICAgICA8RXhwb3J0RXJyb3JcbiAgICAgICAgICBlcnJvcj17ZXJyb3J9XG4gICAgICAgICAgb25SZXRyeT17aW5pdEV4cG9ydH1cbiAgICAgICAgICBvbkNsb3NlPXt3aW5kb3cuY2xvc2V9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge3N0YXRlICE9PSBFeHBvcnRTdGF0ZS5FcnJvciAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxLCBoZWlnaHQ6IDEsIHB4OiAyIH19PlxuICAgICAgICAgICAgPFBhZ2VUaXRsZVxuICAgICAgICAgICAgICB2YXJpYW50PXtQYWdlVGl0bGVWYXJpYW50LlBSSU1BUll9XG4gICAgICAgICAgICAgIHNob3dCYWNrQnV0dG9uPXtmYWxzZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ0V4cG9ydCBSZWNvdmVyeSBQaHJhc2UnKX1cbiAgICAgICAgICAgIDwvUGFnZVRpdGxlPlxuICAgICAgICAgICAgeyhzdGF0ZSA9PT0gRXhwb3J0U3RhdGUuUGVuZGluZyB8fFxuICAgICAgICAgICAgICBzdGF0ZSA9PT0gRXhwb3J0U3RhdGUuQ2FuY2VsbGluZykgJiYgKFxuICAgICAgICAgICAgICA8RXhwb3J0UGVuZGluZ1xuICAgICAgICAgICAgICAgIHByb2dyZXNzPXtwcm9ncmVzc31cbiAgICAgICAgICAgICAgICB0aW1lTGVmdD17dGltZUxlZnR9XG4gICAgICAgICAgICAgICAgY2FuY2VsRXhwb3J0PXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBhd2FpdCBjYW5jZWxFeHBvcnQoKTtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgaXNDYW5jZWxsaW5nPXtzdGF0ZSA9PT0gRXhwb3J0U3RhdGUuQ2FuY2VsbGluZ31cbiAgICAgICAgICAgICAgICBzaG93Q2xvc2VXaW5kb3dCdXR0b25cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7KHN0YXRlID09PSBFeHBvcnRTdGF0ZS5SZWFkeVRvRXhwb3J0IHx8XG4gICAgICAgICAgICAgIHN0YXRlID09PSBFeHBvcnRTdGF0ZS5FeHBvcnRpbmcgfHxcbiAgICAgICAgICAgICAgc3RhdGUgPT09IEV4cG9ydFN0YXRlLkV4cG9ydGVkKSAmJiAoXG4gICAgICAgICAgICAgIDxQaHJhc2VSZWFkeVRvRXhwb3J0XG4gICAgICAgICAgICAgICAgY29tcGxldGVFeHBvcnQ9e2NvbXBsZXRlRXhwb3J0fVxuICAgICAgICAgICAgICAgIGlzRGVjcnlwdGluZz17c3RhdGUgPT09IEV4cG9ydFN0YXRlLkV4cG9ydGluZ31cbiAgICAgICAgICAgICAgICBtbmVtb25pYz17bW5lbW9uaWN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgeyhzdGF0ZSA9PT0gRXhwb3J0U3RhdGUuSW5pdGlhdGluZyB8fFxuICAgICAgICAgICAgc3RhdGUgPT09IEV4cG9ydFN0YXRlLkV4cG9ydGluZykgJiZcbiAgICAgICAgICAgIHJlbmRlck1mYVByb21wdCgpfVxuICAgICAgICAgIDxEaWFsb2dcbiAgICAgICAgICAgIG9wZW49e3N0YXRlID09PSBFeHBvcnRTdGF0ZS5Ob3RJbml0aWF0ZWR9XG4gICAgICAgICAgICBQYXBlclByb3BzPXt7IHN4OiB7IG06IDIsIHRleHRBbGlnbjogJ2NlbnRlcicgfSB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxEaWFsb2dUaXRsZT57dCgnV2FpdGluZyBQZXJpb2QnKX08L0RpYWxvZ1RpdGxlPlxuICAgICAgICAgICAgPERpYWxvZ0NvbnRlbnQ+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgICAgICAgIDxUcmFuc1xuICAgICAgICAgICAgICAgICAgaTE4bktleT1cIkl0IHdpbGwgdGFrZSA8Yj4yIGRheXM8L2I+IHRvIHJldHJpZXZlIHlvdXIgcmVjb3ZlcnkgcGhyYXNlLiBZb3Ugd2lsbCBvbmx5IGhhdmUgPGI+NDggaG91cnM8L2I+IHRvIGNvcHkgeW91ciByZWNvdmVyeSBwaHJhc2Ugb25jZSB0aGUgMiBkYXkgd2FpdGluZyBwZXJpb2QgaXMgb3Zlci5cIlxuICAgICAgICAgICAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgICAgICAgICAgICBiOiA8YiAvPixcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9EaWFsb2dDb250ZW50PlxuICAgICAgICAgICAgPERpYWxvZ0FjdGlvbnMgc3g9e3sgcHQ6IDAgfX0+XG4gICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICAgICAgb25DbGljaz17aW5pdEV4cG9ydH1cbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlZWRsZXNzLWV4cG9ydC1yZWNvdmVyeS1waHJhc2UtY29uZmlybS1leHBvcnRcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoJ05leHQnKX1cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZXNpZ25hdGlvbn1cbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlZWRsZXNzLWV4cG9ydC1yZWNvdmVyeS1waHJhc2UtcmVzaWduXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8L0RpYWxvZ0FjdGlvbnM+XG4gICAgICAgICAgPC9EaWFsb2c+XG4gICAgICAgIDwvPlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn07XG4iXSwibmFtZXMiOlsidXNlQ2FsbGJhY2siLCJ1c2VTdGF0ZSIsInVzZVRyYW5zbGF0aW9uIiwiQWxlcnQiLCJBbGVydENvbnRlbnQiLCJBbGVydFRyaWFuZ2xlSWNvbiIsIkJveCIsIkJ1dHRvbiIsIkNhcmQiLCJDYXJkQ29udGVudCIsIkRpYWxvZyIsIkRpYWxvZ0FjdGlvbnMiLCJEaWFsb2dDb250ZW50IiwiRGlhbG9nVGl0bGUiLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJ0b2FzdCIsIlNlZWRsZXNzRXhwb3J0QW5hbHl0aWNzIiwidXNlQW5hbHl0aWNzQ29udGV4dCIsIlBMQUNFSE9MREVSX01ORU1PTklDIiwiUGhyYXNlUmVhZHlUb0V4cG9ydCIsImNvbXBsZXRlRXhwb3J0IiwibW5lbW9uaWMiLCJpc0RlY3J5cHRpbmciLCJ0IiwiY2FwdHVyZSIsInNob3dDbG9zZVdhcm5pbmciLCJzZXRTaG93Q2xvc2VXYXJuaW5nIiwiaGFuZGxlQ29weSIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInN1Y2Nlc3MiLCJkdXJhdGlvbiIsIlBocmFzZUNvcGllZCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJweCIsIm10IiwiZ2FwIiwianVzdGlmeUNvbnRlbnQiLCJmbGV4R3JvdyIsInBiIiwic2V2ZXJpdHkiLCJpY29uIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyQ29sb3IiLCJwbCIsInByIiwidmFyaWFudCIsImZvbnRXZWlnaHQiLCJmaWx0ZXIiLCJzaXplIiwiZGlzYWJsZWQiLCJpc0xvYWRpbmciLCJvbkNsaWNrIiwiY29sb3IiLCJmdWxsV2lkdGgiLCJvcGVuIiwid2luZG93IiwiY2xvc2UiLCJUcmFucyIsIkV4cG9ydFN0YXRlIiwidXNlU2VlZGxlc3NNbmVtb25pY0V4cG9ydCIsInVzZVNlZWRsZXNzTWZhIiwiUGFnZVRpdGxlIiwiUGFnZVRpdGxlVmFyaWFudCIsIkV4cG9ydFBlbmRpbmciLCJFeHBvcnRFcnJvciIsIlNlZWRsZXNzRXhwb3J0UG9wdXAiLCJyZW5kZXJNZmFQcm9tcHQiLCJzdGF0ZSIsImVycm9yIiwiaW5pdEV4cG9ydCIsImNhbmNlbEV4cG9ydCIsInByb2dyZXNzIiwidGltZUxlZnQiLCJoYW5kbGVSZXNpZ25hdGlvbiIsIlJlc2lnbmVkIiwiZmluYWxseSIsIkZyYWdtZW50IiwiRXJyb3IiLCJvblJldHJ5Iiwib25DbG9zZSIsImhlaWdodCIsIlBSSU1BUlkiLCJzaG93QmFja0J1dHRvbiIsIlBlbmRpbmciLCJDYW5jZWxsaW5nIiwiaXNDYW5jZWxsaW5nIiwic2hvd0Nsb3NlV2luZG93QnV0dG9uIiwiUmVhZHlUb0V4cG9ydCIsIkV4cG9ydGluZyIsIkV4cG9ydGVkIiwiSW5pdGlhdGluZyIsIk5vdEluaXRpYXRlZCIsIlBhcGVyUHJvcHMiLCJtIiwidGV4dEFsaWduIiwiaTE4bktleSIsImNvbXBvbmVudHMiLCJiIiwicHQiXSwic291cmNlUm9vdCI6IiJ9