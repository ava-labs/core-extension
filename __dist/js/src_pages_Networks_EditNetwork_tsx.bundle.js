"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Networks_EditNetwork_tsx"],{

/***/ "./src/pages/Networks/EditNetwork.tsx":
/*!********************************************!*\
  !*** ./src/pages/Networks/EditNetwork.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EditNetwork": () => (/* binding */ EditNetwork)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _NetworkForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NetworkForm */ "./src/pages/Networks/NetworkForm.tsx");
/* harmony import */ var _NetworkDetailsDialogs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NetworkDetailsDialogs */ "./src/pages/Networks/NetworkDetailsDialogs.tsx");
/* harmony import */ var _src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/hooks/useGoBack */ "./src/hooks/useGoBack.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










const EditNetwork = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__.useTranslation)();
  const {
    networkId
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_8__.useParams)();
  const goBack = (0,_src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_6__.useGoBack)(`/networks/details/${networkId}`);
  const selectedChainId = parseInt(networkId, 10);
  const {
    networks,
    isCustomNetwork,
    saveCustomNetwork,
    updateDefaultNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  const [isFormValid, setIsFormValid] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [errorMessage, setErrorMessage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const scrollbarRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const childRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [networkState, setNetworkState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [isResetRpcUrlDialog, setIsResetRpcUrlDialog] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isUpdateRpcUrlDialog, setIsUpdateRpcUrlDialog] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isSaving, setIsSaving] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const networkData = networks.find(networkItem => networkItem.chainId === selectedChainId);
    setNetworkState(networkData);
  }, [networks, setNetworkState, selectedChainId]);
  const isCustom = networkState && isCustomNetwork(networkState.chainId);
  const handleChange = (newNetworkState, isValid) => {
    setIsFormValid(isValid);
    setNetworkState({
      ...newNetworkState
    });
  };
  const onEditSuccess = () => {
    capture('CustomNetworkEdited');
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__["default"].success(t('Custom Network Edited!'), {
      duration: 2000
    });
    setErrorMessage('');
    goBack();
  };
  const onUpdateURLSuccess = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    capture('DefaultNetworkRPCEdited');
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__["default"].success(t('RPC URL Updated!'), {
      duration: 2000
    });
    setErrorMessage('');
  }, [capture, t]);
  const onResetURLSuccess = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    capture('DefaultNetworkRPCReset');
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__["default"].success(t('RPC URL Reset!'), {
      duration: 2000
    });
    setErrorMessage('');
  }, [capture, t]);
  const handleEdit = () => {
    if (!isCustom) {
      onUpdateRpcUrl();
    } else {
      setIsSaving(true);
      saveCustomNetwork(networkState).then(() => {
        onEditSuccess();
      }).catch(onError).finally(() => {
        setIsSaving(false);
      });
    }
  };
  const onError = e => {
    setErrorMessage(e);
    scrollbarRef?.current?.scrollToTop();
  };
  const resetRpcUrl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!networkState) {
      return;
    }
    //  We're resetting the RPC url, so we want to send it as undefined to the backend.

    const {
      rpcUrl,
      ...networkWithoutRpcUrl
    } = networkState;
    updateDefaultNetwork(networkWithoutRpcUrl).then(() => {
      goBack();
      onResetURLSuccess();
    }).catch(e => {
      hideDialogs();
      onError(e);
    }).finally(() => {
      setIsSaving(false);
    });
  }, [goBack, networkState, onResetURLSuccess, updateDefaultNetwork]);
  const updateHeaders = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(headers => {
    if (!networkState) {
      return;
    }
    setIsSaving(true);
    updateDefaultNetwork({
      ...networkState,
      customRpcHeaders: headers
    }).then(() => {
      goBack();
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__["default"].success(t('RPC Headers Updated'), {
        duration: 2000
      });
      setErrorMessage('');
    }).catch(onError).finally(() => {
      setIsSaving(false);
    });
  }, [goBack, networkState, t, updateDefaultNetwork]);
  const hideDialogs = () => {
    setIsResetRpcUrlDialog(false);
    setIsUpdateRpcUrlDialog(false);
  };
  const handleDialogPrimaryClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(dialog => {
    if (!networkState) {
      return;
    }
    setIsSaving(true);
    switch (dialog) {
      case _NetworkDetailsDialogs__WEBPACK_IMPORTED_MODULE_5__.NetworkDetailsDialogOptions.RESET_RPC_URL_DIALOG:
        resetRpcUrl();
        break;
      case _NetworkDetailsDialogs__WEBPACK_IMPORTED_MODULE_5__.NetworkDetailsDialogOptions.UPDATE_RPC_URL_DIALOG:
        updateDefaultNetwork(networkState).then(() => {
          goBack();
          onUpdateURLSuccess();
        }).catch(e => {
          hideDialogs();
          onError(e);
        });
        break;
      default:
        return null;
    }
  }, [goBack, networkState, onUpdateURLSuccess, resetRpcUrl, updateDefaultNetwork]);
  const onUpdateRpcUrl = () => {
    setIsUpdateRpcUrlDialog(true);
  };
  const handleResetUrl = () => {
    setIsResetRpcUrlDialog(true);
  };
  if (!networkState) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitle, null, t('Edit Network')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      px: 2,
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Scrollbars, {
    ref: scrollbarRef
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    sx: {
      width: 1,
      gap: 3,
      mt: 1,
      alignItems: 'center'
    }
  }, errorMessage && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Typography, {
    variant: "body2",
    color: "error.main"
  }, errorMessage), networkState && /*#__PURE__*/React.createElement(_NetworkForm__WEBPACK_IMPORTED_MODULE_4__.NetworkForm, {
    customNetwork: networkState,
    handleChange: handleChange,
    handleRpcHeadersChange: updateHeaders,
    action: _NetworkForm__WEBPACK_IMPORTED_MODULE_4__.NetworkFormAction.Edit,
    isCustomNetwork: isCustom,
    handleResetUrl: handleResetUrl,
    ref: childRef
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Stack, {
    direction: "row",
    sx: {
      px: 2,
      py: 3,
      alignItems: 'center',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    fullWidth: true,
    size: "large",
    color: "secondary",
    onClick: goBack
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    fullWidth: true,
    size: "large",
    onClick: handleEdit,
    disabled: !isFormValid || isSaving,
    isLoading: isSaving
  }, t('Save'))), /*#__PURE__*/React.createElement(_NetworkDetailsDialogs__WEBPACK_IMPORTED_MODULE_5__.NetworkDetailsDialogs, {
    isPrimaryButtonLoading: isSaving,
    isResetRpcUrl: isResetRpcUrlDialog,
    isUpdateRpcUrl: isUpdateRpcUrlDialog,
    handlePrimaryClick: handleDialogPrimaryClick,
    hideDialog: () => hideDialogs()
  }));
};

/***/ }),

/***/ "./src/pages/Networks/NetworkDetailsDialogs.tsx":
/*!******************************************************!*\
  !*** ./src/pages/Networks/NetworkDetailsDialogs.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkDetailsDialogOptions": () => (/* binding */ NetworkDetailsDialogOptions),
/* harmony export */   "NetworkDetailsDialogs": () => (/* binding */ NetworkDetailsDialogs)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/Dialog */ "./src/components/common/Dialog.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



let NetworkDetailsDialogOptions = /*#__PURE__*/function (NetworkDetailsDialogOptions) {
  NetworkDetailsDialogOptions["DELETE_DIALOG"] = "deleteDialog";
  NetworkDetailsDialogOptions["RESET_RPC_URL_DIALOG"] = "resetRpcUrlDialog";
  NetworkDetailsDialogOptions["UPDATE_RPC_URL_DIALOG"] = "updateRpcUrlDialog";
  return NetworkDetailsDialogOptions;
}({});
const NetworkDetailsDialogs = ({
  isDelete,
  isResetRpcUrl,
  isUpdateRpcUrl,
  isPrimaryButtonLoading,
  handlePrimaryClick,
  hideDialog
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const renderDialogContent = (title, bodyText, primaryButtonFn, primaryButtonText, secondaryButtonText) => {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
      sx: {
        justifyContent: 'center',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
      variant: "h5",
      sx: {
        textAlign: 'center'
      }
    }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Typography, {
      variant: "body2",
      sx: {
        textAlign: 'center',
        mt: 1
      }
    }, bodyText), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
      sx: {
        mt: 3
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      sx: {
        mb: 1
      },
      onClick: () => {
        handlePrimaryClick(primaryButtonFn);
      },
      disabled: isPrimaryButtonLoading,
      isLoading: isPrimaryButtonLoading
    }, primaryButtonText), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "text",
      onClick: () => hideDialog()
    }, secondaryButtonText)));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, isDelete && /*#__PURE__*/React.createElement(_src_components_common_Dialog__WEBPACK_IMPORTED_MODULE_0__["default"], {
    open: isDelete,
    onClose: hideDialog,
    content: renderDialogContent(t('Delete Network?'), t('Are you sure you want to delete this network?'), NetworkDetailsDialogOptions.DELETE_DIALOG, t('Delete'), t('Cancel')),
    bgColorDefault: true
  }), isResetRpcUrl && /*#__PURE__*/React.createElement(_src_components_common_Dialog__WEBPACK_IMPORTED_MODULE_0__["default"], {
    open: isResetRpcUrl,
    onClose: hideDialog,
    content: renderDialogContent(t('Reset RPC?'), t("Resetting the RPC URL will put it back to it's default URL."), NetworkDetailsDialogOptions.RESET_RPC_URL_DIALOG, t('Reset Url'), t('Back')),
    bgColorDefault: true
  }), isUpdateRpcUrl && /*#__PURE__*/React.createElement(_src_components_common_Dialog__WEBPACK_IMPORTED_MODULE_0__["default"], {
    open: isUpdateRpcUrl,
    onClose: hideDialog,
    content: renderDialogContent(t('Warning'), t('Core functionality may be unstable with custom RPC URLs.'), NetworkDetailsDialogOptions.UPDATE_RPC_URL_DIALOG, t('Confirm Save'), t('Back')),
    bgColorDefault: true
  }));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX05ldHdvcmtzX0VkaXROZXR3b3JrX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFpRTtBQUNwQjtBQUNFO0FBUVY7QUFFd0I7QUFDUztBQUNKO0FBVTNDO0FBSVU7QUFDZ0I7QUFFMUMsTUFBTW1CLFdBQVcsR0FBR0EsQ0FBQSxLQUFNO0VBQy9CLE1BQU07SUFBRUM7RUFBRSxDQUFDLEdBQUdmLDZEQUFjLEVBQUU7RUFDOUIsTUFBTTtJQUFFZ0I7RUFBVSxDQUFDLEdBQUdqQiwyREFBUyxFQUF5QjtFQUN4RCxNQUFNa0IsTUFBTSxHQUFHSiwrREFBUyxDQUFFLHFCQUFvQkcsU0FBVSxFQUFDLENBQUM7RUFDMUQsTUFBTUUsZUFBZSxHQUFHQyxRQUFRLENBQUNILFNBQVMsRUFBRSxFQUFFLENBQUM7RUFDL0MsTUFBTTtJQUFFSSxRQUFRO0lBQUVDLGVBQWU7SUFBRUMsaUJBQWlCO0lBQUVDO0VBQXFCLENBQUMsR0FDMUVmLGdGQUFpQixFQUFFO0VBQ3JCLE1BQU0sQ0FBQ2dCLFdBQVcsRUFBRUMsY0FBYyxDQUFDLEdBQUczQiwrQ0FBUSxDQUFDLElBQUksQ0FBQztFQUNwRCxNQUFNLENBQUM0QixZQUFZLEVBQUVDLGVBQWUsQ0FBQyxHQUFHN0IsK0NBQVEsQ0FBQyxFQUFFLENBQUM7RUFDcEQsTUFBTThCLFlBQVksR0FBRy9CLDZDQUFNLENBQXVCLElBQUksQ0FBQztFQUN2RCxNQUFNO0lBQUVnQztFQUFRLENBQUMsR0FBR3RCLG9GQUFtQixFQUFFO0VBRXpDLE1BQU11QixRQUFRLEdBQUdqQyw2Q0FBTSxDQUFxQixJQUFJLENBQUM7RUFDakQsTUFBTSxDQUFDa0MsWUFBWSxFQUFFQyxlQUFlLENBQUMsR0FBR2xDLCtDQUFRLEVBQVc7RUFDM0QsTUFBTSxDQUFDbUMsbUJBQW1CLEVBQUVDLHNCQUFzQixDQUFDLEdBQUdwQywrQ0FBUSxDQUFDLEtBQUssQ0FBQztFQUNyRSxNQUFNLENBQUNxQyxv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Q0FBQyxFQUNwQkEsQ0FBQyxDQUFDLCtDQUErQyxDQUFDLEVBQ2xESiwyQkFBMkIsQ0FBQ3lHLGFBQWEsRUFDekNyRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQ1hBLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDWDtJQUNGc0csY0FBYztFQUFBLEVBRWpCLEVBQ0FwQixhQUFhLGlCQUNaeEIsS0FBQSxDQUFBQyxhQUFBLENBQUMyQixxRUFBTTtJQUNMWSxJQUFJLEVBQUVoQixhQUFjO0lBQ3BCaUIsT0FBTyxFQUFFZCxVQUFXO0lBQ3BCZSxPQUFPLEVBQUVaLG1CQUFtQixDQUMxQnhGLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFDZkEsQ0FBQyxDQUFDLDZEQUE2RCxDQUFDLEVBQ2hFSiwyQkFBMkIsQ0FBQzJELG9CQUFvQixFQUNoRHZELENBQUMsQ0FBQyxXQUFXLENBQUMsRUFDZEEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUNUO0lBQ0ZzRyxjQUFjO0VBQUEsRUFFakIsRUFDQW5CLGNBQWMsaUJBQ2J6QixLQUFBLENBQUFDLGFBQUEsQ0FBQzJCLHFFQUFNO0lBQ0xZLElBQUksRUFBRWYsY0FBZTtJQUNyQmdCLE9BQU8sRUFBRWQsVUFBVztJQUNwQmUsT0FBTyxFQUFFWixtQkFBbUIsQ0FDMUJ4RixDQUFDLENBQUMsU0FBUyxDQUFDLEVBQ1pBLENBQUMsQ0FBQywwREFBMEQsQ0FBQyxFQUM3REosMkJBQTJCLENBQUM0RCxxQkFBcUIsRUFDakR4RCxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQ2pCQSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQ1Q7SUFDRnNHLGNBQWM7RUFBQSxFQUVqQixDQUNBO0FBRVAsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvRWRpdE5ldHdvcmsudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvTmV0d29ya0RldGFpbHNEaWFsb2dzLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUGFyYW1zIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBTY3JvbGxiYXJzLFxuICBTY3JvbGxiYXJzUmVmLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdG9hc3QsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IFBhZ2VUaXRsZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vUGFnZVRpdGxlJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgQ3VzdG9tUnBjSGVhZGVycyxcbiAgTmV0d29yayxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvbW9kZWxzJztcblxuaW1wb3J0IHtcbiAgTmV0d29ya0Zvcm0sXG4gIE5ldHdvcmtGb3JtQWN0aW9uLFxuICBOZXR3b3JrRm9ybUFjdGlvbnMsXG59IGZyb20gJy4vTmV0d29ya0Zvcm0nO1xuaW1wb3J0IHtcbiAgTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLFxuICBOZXR3b3JrRGV0YWlsc0RpYWxvZ3MsXG59IGZyb20gJy4vTmV0d29ya0RldGFpbHNEaWFsb2dzJztcbmltcG9ydCB7IHVzZUdvQmFjayB9IGZyb20gJ0BzcmMvaG9va3MvdXNlR29CYWNrJztcblxuZXhwb3J0IGNvbnN0IEVkaXROZXR3b3JrID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgbmV0d29ya0lkIH0gPSB1c2VQYXJhbXM8eyBuZXR3b3JrSWQ6IHN0cmluZyB9PigpO1xuICBjb25zdCBnb0JhY2sgPSB1c2VHb0JhY2soYC9uZXR3b3Jrcy9kZXRhaWxzLyR7bmV0d29ya0lkfWApO1xuICBjb25zdCBzZWxlY3RlZENoYWluSWQgPSBwYXJzZUludChuZXR3b3JrSWQsIDEwKTtcbiAgY29uc3QgeyBuZXR3b3JrcywgaXNDdXN0b21OZXR3b3JrLCBzYXZlQ3VzdG9tTmV0d29yaywgdXBkYXRlRGVmYXVsdE5ldHdvcmsgfSA9XG4gICAgdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgW2lzRm9ybVZhbGlkLCBzZXRJc0Zvcm1WYWxpZF0gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW2Vycm9yTWVzc2FnZSwgc2V0RXJyb3JNZXNzYWdlXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3Qgc2Nyb2xsYmFyUmVmID0gdXNlUmVmPFNjcm9sbGJhcnNSZWYgfCBudWxsPihudWxsKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG5cbiAgY29uc3QgY2hpbGRSZWYgPSB1c2VSZWY8TmV0d29ya0Zvcm1BY3Rpb25zPihudWxsKTtcbiAgY29uc3QgW25ldHdvcmtTdGF0ZSwgc2V0TmV0d29ya1N0YXRlXSA9IHVzZVN0YXRlPE5ldHdvcms+KCk7XG4gIGNvbnN0IFtpc1Jlc2V0UnBjVXJsRGlhbG9nLCBzZXRJc1Jlc2V0UnBjVXJsRGlhbG9nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzVXBkYXRlUnBjVXJsRGlhbG9nLCBzZXRJc1VwZGF0ZVJwY1VybERpYWxvZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc1NhdmluZywgc2V0SXNTYXZpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgbmV0d29ya0RhdGEgPSBuZXR3b3Jrcy5maW5kKFxuICAgICAgKG5ldHdvcmtJdGVtKSA9PiBuZXR3b3JrSXRlbS5jaGFpbklkID09PSBzZWxlY3RlZENoYWluSWQsXG4gICAgKTtcblxuICAgIHNldE5ldHdvcmtTdGF0ZShuZXR3b3JrRGF0YSk7XG4gIH0sIFtuZXR3b3Jrcywgc2V0TmV0d29ya1N0YXRlLCBzZWxlY3RlZENoYWluSWRdKTtcblxuICBjb25zdCBpc0N1c3RvbSA9IG5ldHdvcmtTdGF0ZSAmJiBpc0N1c3RvbU5ldHdvcmsobmV0d29ya1N0YXRlLmNoYWluSWQpO1xuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChuZXdOZXR3b3JrU3RhdGU6IE5ldHdvcmssIGlzVmFsaWQ6IGJvb2xlYW4pID0+IHtcbiAgICBzZXRJc0Zvcm1WYWxpZChpc1ZhbGlkKTtcbiAgICBzZXROZXR3b3JrU3RhdGUoe1xuICAgICAgLi4ubmV3TmV0d29ya1N0YXRlLFxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IG9uRWRpdFN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgY2FwdHVyZSgnQ3VzdG9tTmV0d29ya0VkaXRlZCcpO1xuICAgIHRvYXN0LnN1Y2Nlc3ModCgnQ3VzdG9tIE5ldHdvcmsgRWRpdGVkIScpLCB7IGR1cmF0aW9uOiAyMDAwIH0pO1xuICAgIHNldEVycm9yTWVzc2FnZSgnJyk7XG4gICAgZ29CYWNrKCk7XG4gIH07XG4gIGNvbnN0IG9uVXBkYXRlVVJMU3VjY2VzcyA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjYXB0dXJlKCdEZWZhdWx0TmV0d29ya1JQQ0VkaXRlZCcpO1xuICAgIHRvYXN0LnN1Y2Nlc3ModCgnUlBDIFVSTCBVcGRhdGVkIScpLCB7IGR1cmF0aW9uOiAyMDAwIH0pO1xuICAgIHNldEVycm9yTWVzc2FnZSgnJyk7XG4gIH0sIFtjYXB0dXJlLCB0XSk7XG5cbiAgY29uc3Qgb25SZXNldFVSTFN1Y2Nlc3MgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY2FwdHVyZSgnRGVmYXVsdE5ldHdvcmtSUENSZXNldCcpO1xuICAgIHRvYXN0LnN1Y2Nlc3ModCgnUlBDIFVSTCBSZXNldCEnKSwgeyBkdXJhdGlvbjogMjAwMCB9KTtcbiAgICBzZXRFcnJvck1lc3NhZ2UoJycpO1xuICB9LCBbY2FwdHVyZSwgdF0pO1xuXG4gIGNvbnN0IGhhbmRsZUVkaXQgPSAoKSA9PiB7XG4gICAgaWYgKCFpc0N1c3RvbSkge1xuICAgICAgb25VcGRhdGVScGNVcmwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0SXNTYXZpbmcodHJ1ZSk7XG4gICAgICBzYXZlQ3VzdG9tTmV0d29yayhuZXR3b3JrU3RhdGUpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICBvbkVkaXRTdWNjZXNzKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChvbkVycm9yKVxuICAgICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgc2V0SXNTYXZpbmcoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25FcnJvciA9IChlOiBzdHJpbmcpID0+IHtcbiAgICBzZXRFcnJvck1lc3NhZ2UoZSk7XG4gICAgc2Nyb2xsYmFyUmVmPy5jdXJyZW50Py5zY3JvbGxUb1RvcCgpO1xuICB9O1xuXG4gIGNvbnN0IHJlc2V0UnBjVXJsID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICghbmV0d29ya1N0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vICBXZSdyZSByZXNldHRpbmcgdGhlIFJQQyB1cmwsIHNvIHdlIHdhbnQgdG8gc2VuZCBpdCBhcyB1bmRlZmluZWQgdG8gdGhlIGJhY2tlbmQuXG5cbiAgICBjb25zdCB7IHJwY1VybCwgLi4ubmV0d29ya1dpdGhvdXRScGNVcmwgfSA9IG5ldHdvcmtTdGF0ZTtcblxuICAgIHVwZGF0ZURlZmF1bHROZXR3b3JrKG5ldHdvcmtXaXRob3V0UnBjVXJsKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBnb0JhY2soKTtcbiAgICAgICAgb25SZXNldFVSTFN1Y2Nlc3MoKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgaGlkZURpYWxvZ3MoKTtcbiAgICAgICAgb25FcnJvcihlKTtcbiAgICAgIH0pXG4gICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgIHNldElzU2F2aW5nKGZhbHNlKTtcbiAgICAgIH0pO1xuICB9LCBbZ29CYWNrLCBuZXR3b3JrU3RhdGUsIG9uUmVzZXRVUkxTdWNjZXNzLCB1cGRhdGVEZWZhdWx0TmV0d29ya10pO1xuXG4gIGNvbnN0IHVwZGF0ZUhlYWRlcnMgPSB1c2VDYWxsYmFjayhcbiAgICAoaGVhZGVyczogQ3VzdG9tUnBjSGVhZGVycykgPT4ge1xuICAgICAgaWYgKCFuZXR3b3JrU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXRJc1NhdmluZyh0cnVlKTtcblxuICAgICAgdXBkYXRlRGVmYXVsdE5ldHdvcmsoe1xuICAgICAgICAuLi5uZXR3b3JrU3RhdGUsXG4gICAgICAgIGN1c3RvbVJwY0hlYWRlcnM6IGhlYWRlcnMsXG4gICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgZ29CYWNrKCk7XG4gICAgICAgICAgdG9hc3Quc3VjY2Vzcyh0KCdSUEMgSGVhZGVycyBVcGRhdGVkJyksIHsgZHVyYXRpb246IDIwMDAgfSk7XG4gICAgICAgICAgc2V0RXJyb3JNZXNzYWdlKCcnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKG9uRXJyb3IpXG4gICAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICBzZXRJc1NhdmluZyhmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgW2dvQmFjaywgbmV0d29ya1N0YXRlLCB0LCB1cGRhdGVEZWZhdWx0TmV0d29ya10sXG4gICk7XG5cbiAgY29uc3QgaGlkZURpYWxvZ3MgPSAoKSA9PiB7XG4gICAgc2V0SXNSZXNldFJwY1VybERpYWxvZyhmYWxzZSk7XG4gICAgc2V0SXNVcGRhdGVScGNVcmxEaWFsb2coZmFsc2UpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZURpYWxvZ1ByaW1hcnlDbGljayA9IHVzZUNhbGxiYWNrKFxuICAgIChkaWFsb2c6IE5ldHdvcmtEZXRhaWxzRGlhbG9nT3B0aW9ucykgPT4ge1xuICAgICAgaWYgKCFuZXR3b3JrU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZXRJc1NhdmluZyh0cnVlKTtcbiAgICAgIHN3aXRjaCAoZGlhbG9nKSB7XG4gICAgICAgIGNhc2UgTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLlJFU0VUX1JQQ19VUkxfRElBTE9HOlxuICAgICAgICAgIHJlc2V0UnBjVXJsKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLlVQREFURV9SUENfVVJMX0RJQUxPRzpcbiAgICAgICAgICB1cGRhdGVEZWZhdWx0TmV0d29yayhuZXR3b3JrU3RhdGUpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIGdvQmFjaygpO1xuICAgICAgICAgICAgICBvblVwZGF0ZVVSTFN1Y2Nlc3MoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgaGlkZURpYWxvZ3MoKTtcbiAgICAgICAgICAgICAgb25FcnJvcihlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgW1xuICAgICAgZ29CYWNrLFxuICAgICAgbmV0d29ya1N0YXRlLFxuICAgICAgb25VcGRhdGVVUkxTdWNjZXNzLFxuICAgICAgcmVzZXRScGNVcmwsXG4gICAgICB1cGRhdGVEZWZhdWx0TmV0d29yayxcbiAgICBdLFxuICApO1xuXG4gIGNvbnN0IG9uVXBkYXRlUnBjVXJsID0gKCkgPT4ge1xuICAgIHNldElzVXBkYXRlUnBjVXJsRGlhbG9nKHRydWUpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVJlc2V0VXJsID0gKCkgPT4ge1xuICAgIHNldElzUmVzZXRScGNVcmxEaWFsb2codHJ1ZSk7XG4gIH07XG5cbiAgaWYgKCFuZXR3b3JrU3RhdGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxIH19PlxuICAgICAgPFBhZ2VUaXRsZT57dCgnRWRpdCBOZXR3b3JrJyl9PC9QYWdlVGl0bGU+XG5cbiAgICAgIDxTdGFjayBzeD17eyBweDogMiwgZmxleEdyb3c6IDEgfX0+XG4gICAgICAgIDxTY3JvbGxiYXJzIHJlZj17c2Nyb2xsYmFyUmVmfT5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIGdhcDogMywgbXQ6IDEsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAge2Vycm9yTWVzc2FnZSAmJiAoXG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiIGNvbG9yPVwiZXJyb3IubWFpblwiPlxuICAgICAgICAgICAgICAgIHtlcnJvck1lc3NhZ2V9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7bmV0d29ya1N0YXRlICYmIChcbiAgICAgICAgICAgICAgPE5ldHdvcmtGb3JtXG4gICAgICAgICAgICAgICAgY3VzdG9tTmV0d29yaz17bmV0d29ya1N0YXRlfVxuICAgICAgICAgICAgICAgIGhhbmRsZUNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgIGhhbmRsZVJwY0hlYWRlcnNDaGFuZ2U9e3VwZGF0ZUhlYWRlcnN9XG4gICAgICAgICAgICAgICAgYWN0aW9uPXtOZXR3b3JrRm9ybUFjdGlvbi5FZGl0fVxuICAgICAgICAgICAgICAgIGlzQ3VzdG9tTmV0d29yaz17aXNDdXN0b219XG4gICAgICAgICAgICAgICAgaGFuZGxlUmVzZXRVcmw9e2hhbmRsZVJlc2V0VXJsfVxuICAgICAgICAgICAgICAgIHJlZj17Y2hpbGRSZWZ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICAgIDwvU3RhY2s+XG5cbiAgICAgIDxTdGFja1xuICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICBzeD17eyBweDogMiwgcHk6IDMsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6IDEgfX1cbiAgICAgID5cbiAgICAgICAgPEJ1dHRvbiBmdWxsV2lkdGggc2l6ZT1cImxhcmdlXCIgY29sb3I9XCJzZWNvbmRhcnlcIiBvbkNsaWNrPXtnb0JhY2t9PlxuICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUVkaXR9XG4gICAgICAgICAgZGlzYWJsZWQ9eyFpc0Zvcm1WYWxpZCB8fCBpc1NhdmluZ31cbiAgICAgICAgICBpc0xvYWRpbmc9e2lzU2F2aW5nfVxuICAgICAgICA+XG4gICAgICAgICAge3QoJ1NhdmUnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPE5ldHdvcmtEZXRhaWxzRGlhbG9nc1xuICAgICAgICBpc1ByaW1hcnlCdXR0b25Mb2FkaW5nPXtpc1NhdmluZ31cbiAgICAgICAgaXNSZXNldFJwY1VybD17aXNSZXNldFJwY1VybERpYWxvZ31cbiAgICAgICAgaXNVcGRhdGVScGNVcmw9e2lzVXBkYXRlUnBjVXJsRGlhbG9nfVxuICAgICAgICBoYW5kbGVQcmltYXJ5Q2xpY2s9e2hhbmRsZURpYWxvZ1ByaW1hcnlDbGlja31cbiAgICAgICAgaGlkZURpYWxvZz17KCkgPT4gaGlkZURpYWxvZ3MoKX1cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBCdXR0b24sIFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCBEaWFsb2cgZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9EaWFsb2cnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuZXhwb3J0IGVudW0gTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zIHtcbiAgREVMRVRFX0RJQUxPRyA9ICdkZWxldGVEaWFsb2cnLFxuICBSRVNFVF9SUENfVVJMX0RJQUxPRyA9ICdyZXNldFJwY1VybERpYWxvZycsXG4gIFVQREFURV9SUENfVVJMX0RJQUxPRyA9ICd1cGRhdGVScGNVcmxEaWFsb2cnLFxufVxuXG5pbnRlcmZhY2UgTmV0d29ya0RldGFpbHNEaWFsb2dzUHJvcHMge1xuICBpc1ByaW1hcnlCdXR0b25Mb2FkaW5nOiBib29sZWFuO1xuICBpc0RlbGV0ZT86IGJvb2xlYW47XG4gIGlzUmVzZXRScGNVcmw/OiBib29sZWFuO1xuICBpc1VwZGF0ZVJwY1VybD86IGJvb2xlYW47XG4gIGhhbmRsZVByaW1hcnlDbGljazogKGRpYWxvZ1R5cGU6IE5ldHdvcmtEZXRhaWxzRGlhbG9nT3B0aW9ucykgPT4gdm9pZDtcbiAgaGlkZURpYWxvZzogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IE5ldHdvcmtEZXRhaWxzRGlhbG9ncyA9ICh7XG4gIGlzRGVsZXRlLFxuICBpc1Jlc2V0UnBjVXJsLFxuICBpc1VwZGF0ZVJwY1VybCxcbiAgaXNQcmltYXJ5QnV0dG9uTG9hZGluZyxcbiAgaGFuZGxlUHJpbWFyeUNsaWNrLFxuICBoaWRlRGlhbG9nLFxufTogTmV0d29ya0RldGFpbHNEaWFsb2dzUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IHJlbmRlckRpYWxvZ0NvbnRlbnQgPSAoXG4gICAgdGl0bGU6IHN0cmluZyxcbiAgICBib2R5VGV4dDogc3RyaW5nLFxuICAgIHByaW1hcnlCdXR0b25GbjogTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLFxuICAgIHByaW1hcnlCdXR0b25UZXh0OiBzdHJpbmcsXG4gICAgc2Vjb25kYXJ5QnV0dG9uVGV4dDogc3RyaW5nLFxuICApID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrIHN4PXt7IGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgc3g9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgbXQ6IDEgfX0+XG4gICAgICAgICAge2JvZHlUZXh0fVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBtdDogMyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgc3g9e3sgbWI6IDEgfX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaGFuZGxlUHJpbWFyeUNsaWNrKHByaW1hcnlCdXR0b25Gbik7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzUHJpbWFyeUJ1dHRvbkxvYWRpbmd9XG4gICAgICAgICAgICBpc0xvYWRpbmc9e2lzUHJpbWFyeUJ1dHRvbkxvYWRpbmd9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3ByaW1hcnlCdXR0b25UZXh0fVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInRleHRcIiBvbkNsaWNrPXsoKSA9PiBoaWRlRGlhbG9nKCl9PlxuICAgICAgICAgICAge3NlY29uZGFyeUJ1dHRvblRleHR9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge2lzRGVsZXRlICYmIChcbiAgICAgICAgPERpYWxvZ1xuICAgICAgICAgIG9wZW49e2lzRGVsZXRlfVxuICAgICAgICAgIG9uQ2xvc2U9e2hpZGVEaWFsb2d9XG4gICAgICAgICAgY29udGVudD17cmVuZGVyRGlhbG9nQ29udGVudChcbiAgICAgICAgICAgIHQoJ0RlbGV0ZSBOZXR3b3JrPycpLFxuICAgICAgICAgICAgdCgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIG5ldHdvcms/JyksXG4gICAgICAgICAgICBOZXR3b3JrRGV0YWlsc0RpYWxvZ09wdGlvbnMuREVMRVRFX0RJQUxPRyxcbiAgICAgICAgICAgIHQoJ0RlbGV0ZScpLFxuICAgICAgICAgICAgdCgnQ2FuY2VsJyksXG4gICAgICAgICAgKX1cbiAgICAgICAgICBiZ0NvbG9yRGVmYXVsdFxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtpc1Jlc2V0UnBjVXJsICYmIChcbiAgICAgICAgPERpYWxvZ1xuICAgICAgICAgIG9wZW49e2lzUmVzZXRScGNVcmx9XG4gICAgICAgICAgb25DbG9zZT17aGlkZURpYWxvZ31cbiAgICAgICAgICBjb250ZW50PXtyZW5kZXJEaWFsb2dDb250ZW50KFxuICAgICAgICAgICAgdCgnUmVzZXQgUlBDPycpLFxuICAgICAgICAgICAgdChcIlJlc2V0dGluZyB0aGUgUlBDIFVSTCB3aWxsIHB1dCBpdCBiYWNrIHRvIGl0J3MgZGVmYXVsdCBVUkwuXCIpLFxuICAgICAgICAgICAgTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLlJFU0VUX1JQQ19VUkxfRElBTE9HLFxuICAgICAgICAgICAgdCgnUmVzZXQgVXJsJyksXG4gICAgICAgICAgICB0KCdCYWNrJyksXG4gICAgICAgICAgKX1cbiAgICAgICAgICBiZ0NvbG9yRGVmYXVsdFxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtpc1VwZGF0ZVJwY1VybCAmJiAoXG4gICAgICAgIDxEaWFsb2dcbiAgICAgICAgICBvcGVuPXtpc1VwZGF0ZVJwY1VybH1cbiAgICAgICAgICBvbkNsb3NlPXtoaWRlRGlhbG9nfVxuICAgICAgICAgIGNvbnRlbnQ9e3JlbmRlckRpYWxvZ0NvbnRlbnQoXG4gICAgICAgICAgICB0KCdXYXJuaW5nJyksXG4gICAgICAgICAgICB0KCdDb3JlIGZ1bmN0aW9uYWxpdHkgbWF5IGJlIHVuc3RhYmxlIHdpdGggY3VzdG9tIFJQQyBVUkxzLicpLFxuICAgICAgICAgICAgTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLlVQREFURV9SUENfVVJMX0RJQUxPRyxcbiAgICAgICAgICAgIHQoJ0NvbmZpcm0gU2F2ZScpLFxuICAgICAgICAgICAgdCgnQmFjaycpLFxuICAgICAgICAgICl9XG4gICAgICAgICAgYmdDb2xvckRlZmF1bHRcbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG59O1xuIl0sIm5hbWVzIjpbInVzZUNhbGxiYWNrIiwidXNlRWZmZWN0IiwidXNlUmVmIiwidXNlU3RhdGUiLCJ1c2VQYXJhbXMiLCJ1c2VUcmFuc2xhdGlvbiIsIkJ1dHRvbiIsIlNjcm9sbGJhcnMiLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJ0b2FzdCIsIlBhZ2VUaXRsZSIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJ1c2VOZXR3b3JrQ29udGV4dCIsIk5ldHdvcmtGb3JtIiwiTmV0d29ya0Zvcm1BY3Rpb24iLCJOZXR3b3JrRGV0YWlsc0RpYWxvZ09wdGlvbnMiLCJOZXR3b3JrRGV0YWlsc0RpYWxvZ3MiLCJ1c2VHb0JhY2siLCJFZGl0TmV0d29yayIsInQiLCJuZXR3b3JrSWQiLCJnb0JhY2siLCJzZWxlY3RlZENoYWluSWQiLCJwYXJzZUludCIsIm5ldHdvcmtzIiwiaXNDdXN0b21OZXR3b3JrIiwic2F2ZUN1c3RvbU5ldHdvcmsiLCJ1cGRhdGVEZWZhdWx0TmV0d29yayIsImlzRm9ybVZhbGlkIiwic2V0SXNGb3JtVmFsaWQiLCJlcnJvck1lc3NhZ2UiLCJzZXRFcnJvck1lc3NhZ2UiLCJzY3JvbGxiYXJSZWYiLCJjYXB0dXJlIiwiY2hpbGRSZWYiLCJuZXR3b3JrU3RhdGUiLCJzZXROZXR3b3JrU3RhdGUiLCJpc1Jlc2V0UnBjVXJsRGlhbG9nIiwic2V0SXNSZXNldFJwY1VybERpYWxvZyIsImlzVXBkYXRlUnBjVXJsRGlhbG9nIiwic2V0SXNVcGRhdGVScGNVcmxEaWFsb2ciLCJpc1NhdmluZyIsInNldElzU2F2aW5nIiwibmV0d29ya0RhdGEiLCJmaW5kIiwibmV0d29ya0l0ZW0iLCJjaGFpbklkIiwiaXNDdXN0b20iLCJoYW5kbGVDaGFuZ2UiLCJuZXdOZXR3b3JrU3RhdGUiLCJpc1ZhbGlkIiwib25FZGl0U3VjY2VzcyIsInN1Y2Nlc3MiLCJkdXJhdGlvbiIsIm9uVXBkYXRlVVJMU3VjY2VzcyIsIm9uUmVzZXRVUkxTdWNjZXNzIiwiaGFuZGxlRWRpdCIsIm9uVXBkYXRlUnBjVXJsIiwidGhlbiIsImNhdGNoIiwib25FcnJvciIsImZpbmFsbHkiLCJlIiwiY3VycmVudCIsInNjcm9sbFRvVG9wIiwicmVzZXRScGNVcmwiLCJycGNVcmwiLCJuZXR3b3JrV2l0aG91dFJwY1VybCIsImhpZGVEaWFsb2dzIiwidXBkYXRlSGVhZGVycyIsImhlYWRlcnMiLCJjdXN0b21ScGNIZWFkZXJzIiwiaGFuZGxlRGlhbG9nUHJpbWFyeUNsaWNrIiwiZGlhbG9nIiwiUkVTRVRfUlBDX1VSTF9ESUFMT0ciLCJVUERBVEVfUlBDX1VSTF9ESUFMT0ciLCJoYW5kbGVSZXNldFVybCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJweCIsImZsZXhHcm93IiwicmVmIiwiZ2FwIiwibXQiLCJhbGlnbkl0ZW1zIiwidmFyaWFudCIsImNvbG9yIiwiY3VzdG9tTmV0d29yayIsImhhbmRsZVJwY0hlYWRlcnNDaGFuZ2UiLCJhY3Rpb24iLCJFZGl0IiwiZGlyZWN0aW9uIiwicHkiLCJmdWxsV2lkdGgiLCJzaXplIiwib25DbGljayIsImRpc2FibGVkIiwiaXNMb2FkaW5nIiwiaXNQcmltYXJ5QnV0dG9uTG9hZGluZyIsImlzUmVzZXRScGNVcmwiLCJpc1VwZGF0ZVJwY1VybCIsImhhbmRsZVByaW1hcnlDbGljayIsImhpZGVEaWFsb2ciLCJEaWFsb2ciLCJpc0RlbGV0ZSIsInJlbmRlckRpYWxvZ0NvbnRlbnQiLCJ0aXRsZSIsImJvZHlUZXh0IiwicHJpbWFyeUJ1dHRvbkZuIiwicHJpbWFyeUJ1dHRvblRleHQiLCJzZWNvbmRhcnlCdXR0b25UZXh0IiwianVzdGlmeUNvbnRlbnQiLCJ0ZXh0QWxpZ24iLCJtYiIsIkZyYWdtZW50Iiwib3BlbiIsIm9uQ2xvc2UiLCJjb250ZW50IiwiREVMRVRFX0RJQUxPRyIsImJnQ29sb3JEZWZhdWx0Il0sInNvdXJjZVJvb3QiOiIifQ==