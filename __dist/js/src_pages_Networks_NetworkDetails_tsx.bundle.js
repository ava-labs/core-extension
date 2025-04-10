"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Networks_NetworkDetails_tsx"],{

/***/ "./src/pages/Networks/NetworkDetails.tsx":
/*!***********************************************!*\
  !*** ./src/pages/Networks/NetworkDetails.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkDetails": () => (/* binding */ NetworkDetails)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/NetworkLogo */ "./src/components/common/NetworkLogo.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _NetworkForm__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./NetworkForm */ "./src/pages/Networks/NetworkForm.tsx");
/* harmony import */ var _NetworkDetailsDialogs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./NetworkDetailsDialogs */ "./src/pages/Networks/NetworkDetailsDialogs.tsx");
/* harmony import */ var _src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/hooks/useGoBack */ "./src/hooks/useGoBack.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");












const NetworkDetails = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_9__.useTranslation)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useHistory)();
  const {
    networkId
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useParams)();
  const selectedChainId = parseInt(networkId, 10);
  const {
    networks,
    isFavoriteNetwork,
    addFavoriteNetwork,
    removeFavoriteNetwork,
    setNetwork,
    network,
    isCustomNetwork,
    removeCustomNetwork
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__.useNetworkContext)();
  const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const selectButtonRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const [errorMessage, setErrorMessage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const scrollbarRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__.useAnalyticsContext)();
  const goBack = (0,_src_hooks_useGoBack__WEBPACK_IMPORTED_MODULE_8__.useGoBack)();
  const childRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const [networkState, setNetworkState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const [isDeleteDialog, setIsDeleteDialog] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isDeleting, setIsDeleting] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const networkData = networks.find(networkItem => networkItem.chainId === selectedChainId);
    setNetworkState(networkData);
  }, [networks, setNetworkState, selectedChainId]);
  if (!networkState) {
    return null;
  }
  const isFavorite = networkState && isFavoriteNetwork(networkState.chainId);
  const isCustom = networkState && isCustomNetwork(networkState.chainId);
  const canConnect = networkState.chainId !== network?.chainId;
  const onDeleteSuccess = () => {
    capture('CustomNetworkDeleted');
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__["default"].success(t('Custom Network Deleted!'), {
      duration: 2000
    });
  };
  const onError = e => {
    setErrorMessage(e);
    scrollbarRef?.current?.scrollToTop();
  };
  const handleDialogPrimaryClick = dialog => {
    switch (dialog) {
      case _NetworkDetailsDialogs__WEBPACK_IMPORTED_MODULE_7__.NetworkDetailsDialogOptions.DELETE_DIALOG:
        setIsDeleting(true);
        removeCustomNetwork(selectedChainId).then(() => {
          goBack();
          onDeleteSuccess();
        }).catch(e => {
          setIsDeleteDialog(false);
          onError(e);
        }).finally(() => {
          setIsDeleting(false);
        });
        break;
      default:
        return null;
    }
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    direction: "row",
    sx: {
      justifyContent: 'space-between',
      alignItems: 'center',
      pr: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__.PageTitle, {
    margin: "12px 0"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    direction: "row",
    sx: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      pr: 1,
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.IconButton, {
    "data-testid": "favorite-button",
    size: "small",
    onClick: e => {
      e.stopPropagation();
      if (!isFavorite) {
        addFavoriteNetwork(networkState.chainId);
        return;
      }
      removeFavoriteNetwork(networkState.chainId);
    }
  }, isFavorite ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.StarFilledIcon, {
    size: 24
  }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.StarIcon, {
    size: 24
  })), isCustom ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.ClickAwayListener, {
    onClickAway: () => setIsOpen(false)
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.IconButton, {
    onClick: () => setIsOpen(!isOpen),
    ref: selectButtonRef,
    "data-testid": "network-options"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.MoreHorizontalIcon, null), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Popper, {
    open: isOpen,
    anchorEl: selectButtonRef.current,
    placement: "bottom-end",
    transition: true
  }, ({
    TransitionProps
  }) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Grow, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, TransitionProps, {
    timeout: 250
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.MenuList, {
    dense: true,
    sx: {
      width: 180,
      p: 0,
      borderRadius: 1,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.MenuItem, {
    onClick: () => {
      history.push(`/networks/edit/${networkId}`);
    },
    sx: {
      flexDirection: 'row',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.EditIcon, {
    size: 14
  }), t('Edit')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.MenuItem, {
    onClick: () => {
      setIsDeleteDialog(true);
      setIsOpen(false);
    },
    sx: {
      flexDirection: 'row',
      gap: 1,
      color: 'error.main'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.TrashIcon, {
    size: 14
  }), t('Delete'))))))) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Button, {
    variant: "text",
    size: "small",
    onClick: () => history.push(`/networks/edit/${networkId}`)
  }, t('Edit'))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      px: 2,
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Scrollbars, {
    ref: scrollbarRef
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    sx: {
      width: 1,
      gap: 3,
      pt: 1,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_NetworkLogo__WEBPACK_IMPORTED_MODULE_3__.NetworkLogo, {
    height: "80px",
    width: "80px",
    padding: "16px",
    src: networkState?.logoUri,
    defaultSize: 80
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Typography, {
    variant: "h4"
  }, networkState?.chainName), errorMessage && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Typography, {
    variant: "body2",
    color: "error.main"
  }, errorMessage), networkState && /*#__PURE__*/React.createElement(_NetworkForm__WEBPACK_IMPORTED_MODULE_6__.NetworkForm, {
    readOnly: true,
    customNetwork: networkState,
    action: _NetworkForm__WEBPACK_IMPORTED_MODULE_6__.NetworkFormAction.Edit,
    isCustomNetwork: isCustom,
    ref: childRef
  })))), canConnect && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Stack, {
    direction: "row",
    sx: {
      px: 2,
      py: 3,
      alignItems: 'center',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_12__.Button, {
    fullWidth: true,
    color: "primary",
    size: "large",
    onClick: () => setNetwork(networkState)
  }, t('Connect Network'))), /*#__PURE__*/React.createElement(_NetworkDetailsDialogs__WEBPACK_IMPORTED_MODULE_7__.NetworkDetailsDialogs, {
    isPrimaryButtonLoading: isDeleting,
    isDelete: isDeleteDialog,
    handlePrimaryClick: handleDialogPrimaryClick,
    hideDialog: () => setIsDeleteDialog(false)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX05ldHdvcmtzX05ldHdvcmtEZXRhaWxzX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNvRDtBQUNLO0FBQ1Y7QUFtQlY7QUFFd0I7QUFDSTtBQUNLO0FBQ0o7QUFNM0M7QUFJVTtBQUNnQjtBQUUxQyxNQUFNK0IsY0FBYyxHQUFHQSxDQUFBLEtBQU07RUFDbEMsTUFBTTtJQUFFQztFQUFFLENBQUMsR0FBRzNCLDZEQUFjLEVBQUU7RUFDOUIsTUFBTTRCLE9BQU8sR0FBRzlCLDZEQUFVLEVBQUU7RUFDNUIsTUFBTTtJQUFFK0I7RUFBVSxDQUFDLEdBQUc5Qiw0REFBUyxFQUF5QjtFQUN4RCxNQUFNK0IsZUFBZSxHQUFHQyxRQUFRLENBQUNGLFNBQVMsRUFBRSxFQUFFLENBQUM7RUFDL0MsTUFBTTtJQUNKRyxRQUFRO0lBQ1JDLGlCQUFpQjtJQUNqQkMsa0JBQWtCO0lBQ2xCQyxxQkFBcUI7SUFDckJDLFVBQVU7SUFDVkMsT0FBTztJQUNQQyxlQUFlO0lBQ2ZDO0VBQ0YsQ0FBQyxHQUFHbkIsZ0ZBQWlCLEVBQUU7RUFDdkIsTUFBTSxDQUFDb0IsTUFBTSxFQUFFQyxTQUFTLENBQUMsR0FBRzVDLCtDQUFRLENBQUMsS0FBSyxDQUFDO0VBQzNDLE1BQU02QyxlQUFlLEdBQUc5Qyw2Q0FBTSxDQUFvQixJQUFJLENBQUM7RUFDdkQsTUFBTSxDQUFDK0MsWUFBWSxFQUFFQyxlQUFlLENBQUMsR0FBRy9DLCtDQUFRLENBQUMsRUFBRSxDQUFDO0VBQ3BELE1BQU1nRCxZQUFZLEdBQUdqRCw2Q0FBTSxDQUF1QixJQUFJLENBQUM7RUFDdkQsTUFBTTtJQUFFa0Q7RUFBUSxDQUFDLEdBQUczQixvRkFBbUIsRUFBRTtFQUN6QyxNQUFNNEIsTUFBTSxHQUFHdEIsK0RBQVMsRUFBRTtFQUUxQixNQUFNdUIsUUFBUSxHQUFHcEQsNkNBQU0sQ0FBcUIsSUFBSSxDQUFDO0VBQ2pELE1BQU0sQ0FBQ3FELFlBQVks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akIsQ0FDQTtBQUVQLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL05ldHdvcmtzL05ldHdvcmtEZXRhaWxzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL05ldHdvcmtzL05ldHdvcmtEZXRhaWxzRGlhbG9ncy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV0d29yayB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtY2hhaW5zLXNkayc7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5LCB1c2VQYXJhbXMgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIENsaWNrQXdheUxpc3RlbmVyLFxuICBFZGl0SWNvbixcbiAgR3JvdyxcbiAgSWNvbkJ1dHRvbixcbiAgTWVudUl0ZW0sXG4gIE1lbnVMaXN0LFxuICBNb3JlSG9yaXpvbnRhbEljb24sXG4gIFBvcHBlcixcbiAgU2Nyb2xsYmFycyxcbiAgU2Nyb2xsYmFyc1JlZixcbiAgU3RhY2ssXG4gIFN0YXJGaWxsZWRJY29uLFxuICBTdGFySWNvbixcbiAgVHJhc2hJY29uLFxuICBUeXBvZ3JhcGh5LFxuICB0b2FzdCxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgUGFnZVRpdGxlIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9QYWdlVGl0bGUnO1xuaW1wb3J0IHsgTmV0d29ya0xvZ28gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL05ldHdvcmtMb2dvJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuXG5pbXBvcnQge1xuICBOZXR3b3JrRm9ybSxcbiAgTmV0d29ya0Zvcm1BY3Rpb24sXG4gIE5ldHdvcmtGb3JtQWN0aW9ucyxcbn0gZnJvbSAnLi9OZXR3b3JrRm9ybSc7XG5pbXBvcnQge1xuICBOZXR3b3JrRGV0YWlsc0RpYWxvZ09wdGlvbnMsXG4gIE5ldHdvcmtEZXRhaWxzRGlhbG9ncyxcbn0gZnJvbSAnLi9OZXR3b3JrRGV0YWlsc0RpYWxvZ3MnO1xuaW1wb3J0IHsgdXNlR29CYWNrIH0gZnJvbSAnQHNyYy9ob29rcy91c2VHb0JhY2snO1xuXG5leHBvcnQgY29uc3QgTmV0d29ya0RldGFpbHMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcbiAgY29uc3QgeyBuZXR3b3JrSWQgfSA9IHVzZVBhcmFtczx7IG5ldHdvcmtJZDogc3RyaW5nIH0+KCk7XG4gIGNvbnN0IHNlbGVjdGVkQ2hhaW5JZCA9IHBhcnNlSW50KG5ldHdvcmtJZCwgMTApO1xuICBjb25zdCB7XG4gICAgbmV0d29ya3MsXG4gICAgaXNGYXZvcml0ZU5ldHdvcmssXG4gICAgYWRkRmF2b3JpdGVOZXR3b3JrLFxuICAgIHJlbW92ZUZhdm9yaXRlTmV0d29yayxcbiAgICBzZXROZXR3b3JrLFxuICAgIG5ldHdvcmssXG4gICAgaXNDdXN0b21OZXR3b3JrLFxuICAgIHJlbW92ZUN1c3RvbU5ldHdvcmssXG4gIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBzZWxlY3RCdXR0b25SZWYgPSB1c2VSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCBbZXJyb3JNZXNzYWdlLCBzZXRFcnJvck1lc3NhZ2VdID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBzY3JvbGxiYXJSZWYgPSB1c2VSZWY8U2Nyb2xsYmFyc1JlZiB8IG51bGw+KG51bGwpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgZ29CYWNrID0gdXNlR29CYWNrKCk7XG5cbiAgY29uc3QgY2hpbGRSZWYgPSB1c2VSZWY8TmV0d29ya0Zvcm1BY3Rpb25zPihudWxsKTtcbiAgY29uc3QgW25ldHdvcmtTdGF0ZSwgc2V0TmV0d29ya1N0YXRlXSA9IHVzZVN0YXRlPE5ldHdvcms+KCk7XG4gIGNvbnN0IFtpc0RlbGV0ZURpYWxvZywgc2V0SXNEZWxldGVEaWFsb2ddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNEZWxldGluZywgc2V0SXNEZWxldGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBuZXR3b3JrRGF0YSA9IG5ldHdvcmtzLmZpbmQoXG4gICAgICAobmV0d29ya0l0ZW0pID0+IG5ldHdvcmtJdGVtLmNoYWluSWQgPT09IHNlbGVjdGVkQ2hhaW5JZCxcbiAgICApO1xuXG4gICAgc2V0TmV0d29ya1N0YXRlKG5ldHdvcmtEYXRhKTtcbiAgfSwgW25ldHdvcmtzLCBzZXROZXR3b3JrU3RhdGUsIHNlbGVjdGVkQ2hhaW5JZF0pO1xuXG4gIGlmICghbmV0d29ya1N0YXRlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBpc0Zhdm9yaXRlID0gbmV0d29ya1N0YXRlICYmIGlzRmF2b3JpdGVOZXR3b3JrKG5ldHdvcmtTdGF0ZS5jaGFpbklkKTtcbiAgY29uc3QgaXNDdXN0b20gPSBuZXR3b3JrU3RhdGUgJiYgaXNDdXN0b21OZXR3b3JrKG5ldHdvcmtTdGF0ZS5jaGFpbklkKTtcbiAgY29uc3QgY2FuQ29ubmVjdCA9IG5ldHdvcmtTdGF0ZS5jaGFpbklkICE9PSBuZXR3b3JrPy5jaGFpbklkO1xuXG4gIGNvbnN0IG9uRGVsZXRlU3VjY2VzcyA9ICgpID0+IHtcbiAgICBjYXB0dXJlKCdDdXN0b21OZXR3b3JrRGVsZXRlZCcpO1xuICAgIHRvYXN0LnN1Y2Nlc3ModCgnQ3VzdG9tIE5ldHdvcmsgRGVsZXRlZCEnKSwgeyBkdXJhdGlvbjogMjAwMCB9KTtcbiAgfTtcblxuICBjb25zdCBvbkVycm9yID0gKGU6IHN0cmluZykgPT4ge1xuICAgIHNldEVycm9yTWVzc2FnZShlKTtcbiAgICBzY3JvbGxiYXJSZWY/LmN1cnJlbnQ/LnNjcm9sbFRvVG9wKCk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlRGlhbG9nUHJpbWFyeUNsaWNrID0gKGRpYWxvZzogTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zKSA9PiB7XG4gICAgc3dpdGNoIChkaWFsb2cpIHtcbiAgICAgIGNhc2UgTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLkRFTEVURV9ESUFMT0c6XG4gICAgICAgIHNldElzRGVsZXRpbmcodHJ1ZSk7XG4gICAgICAgIHJlbW92ZUN1c3RvbU5ldHdvcmsoc2VsZWN0ZWRDaGFpbklkKVxuICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGdvQmFjaygpO1xuICAgICAgICAgICAgb25EZWxldGVTdWNjZXNzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgIHNldElzRGVsZXRlRGlhbG9nKGZhbHNlKTtcbiAgICAgICAgICAgIG9uRXJyb3IoZSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgICBzZXRJc0RlbGV0aW5nKGZhbHNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEgfX0+XG4gICAgICA8U3RhY2tcbiAgICAgICAgZGlyZWN0aW9uPVwicm93XCJcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIHByOiAxLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8UGFnZVRpdGxlIG1hcmdpbj1cIjEycHggMFwiPlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgZGlyZWN0aW9uPVwicm93XCJcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgICAgcHI6IDEsXG4gICAgICAgICAgICAgIGdhcDogMC41LFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImZhdm9yaXRlLWJ1dHRvblwiXG4gICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzRmF2b3JpdGUpIHtcbiAgICAgICAgICAgICAgICAgIGFkZEZhdm9yaXRlTmV0d29yayhuZXR3b3JrU3RhdGUuY2hhaW5JZCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlbW92ZUZhdm9yaXRlTmV0d29yayhuZXR3b3JrU3RhdGUuY2hhaW5JZCk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpc0Zhdm9yaXRlID8gKFxuICAgICAgICAgICAgICAgIDxTdGFyRmlsbGVkSWNvbiBzaXplPXsyNH0gLz5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8U3Rhckljb24gc2l6ZT17MjR9IC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L0ljb25CdXR0b24+XG5cbiAgICAgICAgICAgIHtpc0N1c3RvbSA/IChcbiAgICAgICAgICAgICAgPENsaWNrQXdheUxpc3RlbmVyIG9uQ2xpY2tBd2F5PXsoKSA9PiBzZXRJc09wZW4oZmFsc2UpfT5cbiAgICAgICAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNPcGVuKCFpc09wZW4pfVxuICAgICAgICAgICAgICAgICAgcmVmPXtzZWxlY3RCdXR0b25SZWZ9XG4gICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cIm5ldHdvcmstb3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPE1vcmVIb3Jpem9udGFsSWNvbiAvPlxuXG4gICAgICAgICAgICAgICAgICA8UG9wcGVyXG4gICAgICAgICAgICAgICAgICAgIG9wZW49e2lzT3Blbn1cbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yRWw9e3NlbGVjdEJ1dHRvblJlZi5jdXJyZW50fVxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ9XCJib3R0b20tZW5kXCJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvblxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7KHsgVHJhbnNpdGlvblByb3BzIH0pID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8R3JvdyB7Li4uVHJhbnNpdGlvblByb3BzfSB0aW1lb3V0PXsyNTB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPE1lbnVMaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlbnNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDE4MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaChgL25ldHdvcmtzL2VkaXQvJHtuZXR3b3JrSWR9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBmbGV4RGlyZWN0aW9uOiAncm93JywgZ2FwOiAxIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RWRpdEljb24gc2l6ZT17MTR9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ0VkaXQnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9NZW51SXRlbT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPE1lbnVJdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SXNEZWxldGVEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRJc09wZW4oZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FwOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdlcnJvci5tYWluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRyYXNoSWNvbiBzaXplPXsxNH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dCgnRGVsZXRlJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L01lbnVMaXN0PlxuICAgICAgICAgICAgICAgICAgICAgIDwvR3Jvdz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvUG9wcGVyPlxuICAgICAgICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgICAgICAgPC9DbGlja0F3YXlMaXN0ZW5lcj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoaXN0b3J5LnB1c2goYC9uZXR3b3Jrcy9lZGl0LyR7bmV0d29ya0lkfWApfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoJ0VkaXQnKX1cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvUGFnZVRpdGxlPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTdGFjayBzeD17eyBweDogMiwgZmxleEdyb3c6IDEgfX0+XG4gICAgICAgIDxTY3JvbGxiYXJzIHJlZj17c2Nyb2xsYmFyUmVmfT5cbiAgICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIGdhcDogMywgcHQ6IDEsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgPE5ldHdvcmtMb2dvXG4gICAgICAgICAgICAgIGhlaWdodD1cIjgwcHhcIlxuICAgICAgICAgICAgICB3aWR0aD1cIjgwcHhcIlxuICAgICAgICAgICAgICBwYWRkaW5nPVwiMTZweFwiXG4gICAgICAgICAgICAgIHNyYz17bmV0d29ya1N0YXRlPy5sb2dvVXJpfVxuICAgICAgICAgICAgICBkZWZhdWx0U2l6ZT17ODB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg0XCI+e25ldHdvcmtTdGF0ZT8uY2hhaW5OYW1lfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIHtlcnJvck1lc3NhZ2UgJiYgKFxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBjb2xvcj1cImVycm9yLm1haW5cIj5cbiAgICAgICAgICAgICAgICB7ZXJyb3JNZXNzYWdlfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge25ldHdvcmtTdGF0ZSAmJiAoXG4gICAgICAgICAgICAgIDxOZXR3b3JrRm9ybVxuICAgICAgICAgICAgICAgIHJlYWRPbmx5XG4gICAgICAgICAgICAgICAgY3VzdG9tTmV0d29yaz17bmV0d29ya1N0YXRlfVxuICAgICAgICAgICAgICAgIGFjdGlvbj17TmV0d29ya0Zvcm1BY3Rpb24uRWRpdH1cbiAgICAgICAgICAgICAgICBpc0N1c3RvbU5ldHdvcms9e2lzQ3VzdG9tfVxuICAgICAgICAgICAgICAgIHJlZj17Y2hpbGRSZWZ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICAgIDwvU3RhY2s+XG4gICAgICB7Y2FuQ29ubmVjdCAmJiAoXG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgc3g9e3sgcHg6IDIsIHB5OiAzLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxIH19XG4gICAgICAgID5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0TmV0d29yayhuZXR3b3JrU3RhdGUpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdDb25uZWN0IE5ldHdvcmsnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICl9XG4gICAgICA8TmV0d29ya0RldGFpbHNEaWFsb2dzXG4gICAgICAgIGlzUHJpbWFyeUJ1dHRvbkxvYWRpbmc9e2lzRGVsZXRpbmd9XG4gICAgICAgIGlzRGVsZXRlPXtpc0RlbGV0ZURpYWxvZ31cbiAgICAgICAgaGFuZGxlUHJpbWFyeUNsaWNrPXtoYW5kbGVEaWFsb2dQcmltYXJ5Q2xpY2t9XG4gICAgICAgIGhpZGVEaWFsb2c9eygpID0+IHNldElzRGVsZXRlRGlhbG9nKGZhbHNlKX1cbiAgICAgIC8+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyBCdXR0b24sIFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCBEaWFsb2cgZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9EaWFsb2cnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcblxuZXhwb3J0IGVudW0gTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zIHtcbiAgREVMRVRFX0RJQUxPRyA9ICdkZWxldGVEaWFsb2cnLFxuICBSRVNFVF9SUENfVVJMX0RJQUxPRyA9ICdyZXNldFJwY1VybERpYWxvZycsXG4gIFVQREFURV9SUENfVVJMX0RJQUxPRyA9ICd1cGRhdGVScGNVcmxEaWFsb2cnLFxufVxuXG5pbnRlcmZhY2UgTmV0d29ya0RldGFpbHNEaWFsb2dzUHJvcHMge1xuICBpc1ByaW1hcnlCdXR0b25Mb2FkaW5nOiBib29sZWFuO1xuICBpc0RlbGV0ZT86IGJvb2xlYW47XG4gIGlzUmVzZXRScGNVcmw/OiBib29sZWFuO1xuICBpc1VwZGF0ZVJwY1VybD86IGJvb2xlYW47XG4gIGhhbmRsZVByaW1hcnlDbGljazogKGRpYWxvZ1R5cGU6IE5ldHdvcmtEZXRhaWxzRGlhbG9nT3B0aW9ucykgPT4gdm9pZDtcbiAgaGlkZURpYWxvZzogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IE5ldHdvcmtEZXRhaWxzRGlhbG9ncyA9ICh7XG4gIGlzRGVsZXRlLFxuICBpc1Jlc2V0UnBjVXJsLFxuICBpc1VwZGF0ZVJwY1VybCxcbiAgaXNQcmltYXJ5QnV0dG9uTG9hZGluZyxcbiAgaGFuZGxlUHJpbWFyeUNsaWNrLFxuICBoaWRlRGlhbG9nLFxufTogTmV0d29ya0RldGFpbHNEaWFsb2dzUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IHJlbmRlckRpYWxvZ0NvbnRlbnQgPSAoXG4gICAgdGl0bGU6IHN0cmluZyxcbiAgICBib2R5VGV4dDogc3RyaW5nLFxuICAgIHByaW1hcnlCdXR0b25GbjogTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLFxuICAgIHByaW1hcnlCdXR0b25UZXh0OiBzdHJpbmcsXG4gICAgc2Vjb25kYXJ5QnV0dG9uVGV4dDogc3RyaW5nLFxuICApID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrIHN4PXt7IGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgc3g9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCIgc3g9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgbXQ6IDEgfX0+XG4gICAgICAgICAge2JvZHlUZXh0fVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBtdDogMyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgc3g9e3sgbWI6IDEgfX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaGFuZGxlUHJpbWFyeUNsaWNrKHByaW1hcnlCdXR0b25Gbik7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzUHJpbWFyeUJ1dHRvbkxvYWRpbmd9XG4gICAgICAgICAgICBpc0xvYWRpbmc9e2lzUHJpbWFyeUJ1dHRvbkxvYWRpbmd9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3ByaW1hcnlCdXR0b25UZXh0fVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInRleHRcIiBvbkNsaWNrPXsoKSA9PiBoaWRlRGlhbG9nKCl9PlxuICAgICAgICAgICAge3NlY29uZGFyeUJ1dHRvblRleHR9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge2lzRGVsZXRlICYmIChcbiAgICAgICAgPERpYWxvZ1xuICAgICAgICAgIG9wZW49e2lzRGVsZXRlfVxuICAgICAgICAgIG9uQ2xvc2U9e2hpZGVEaWFsb2d9XG4gICAgICAgICAgY29udGVudD17cmVuZGVyRGlhbG9nQ29udGVudChcbiAgICAgICAgICAgIHQoJ0RlbGV0ZSBOZXR3b3JrPycpLFxuICAgICAgICAgICAgdCgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIG5ldHdvcms/JyksXG4gICAgICAgICAgICBOZXR3b3JrRGV0YWlsc0RpYWxvZ09wdGlvbnMuREVMRVRFX0RJQUxPRyxcbiAgICAgICAgICAgIHQoJ0RlbGV0ZScpLFxuICAgICAgICAgICAgdCgnQ2FuY2VsJyksXG4gICAgICAgICAgKX1cbiAgICAgICAgICBiZ0NvbG9yRGVmYXVsdFxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtpc1Jlc2V0UnBjVXJsICYmIChcbiAgICAgICAgPERpYWxvZ1xuICAgICAgICAgIG9wZW49e2lzUmVzZXRScGNVcmx9XG4gICAgICAgICAgb25DbG9zZT17aGlkZURpYWxvZ31cbiAgICAgICAgICBjb250ZW50PXtyZW5kZXJEaWFsb2dDb250ZW50KFxuICAgICAgICAgICAgdCgnUmVzZXQgUlBDPycpLFxuICAgICAgICAgICAgdChcIlJlc2V0dGluZyB0aGUgUlBDIFVSTCB3aWxsIHB1dCBpdCBiYWNrIHRvIGl0J3MgZGVmYXVsdCBVUkwuXCIpLFxuICAgICAgICAgICAgTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLlJFU0VUX1JQQ19VUkxfRElBTE9HLFxuICAgICAgICAgICAgdCgnUmVzZXQgVXJsJyksXG4gICAgICAgICAgICB0KCdCYWNrJyksXG4gICAgICAgICAgKX1cbiAgICAgICAgICBiZ0NvbG9yRGVmYXVsdFxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHtpc1VwZGF0ZVJwY1VybCAmJiAoXG4gICAgICAgIDxEaWFsb2dcbiAgICAgICAgICBvcGVuPXtpc1VwZGF0ZVJwY1VybH1cbiAgICAgICAgICBvbkNsb3NlPXtoaWRlRGlhbG9nfVxuICAgICAgICAgIGNvbnRlbnQ9e3JlbmRlckRpYWxvZ0NvbnRlbnQoXG4gICAgICAgICAgICB0KCdXYXJuaW5nJyksXG4gICAgICAgICAgICB0KCdDb3JlIGZ1bmN0aW9uYWxpdHkgbWF5IGJlIHVuc3RhYmxlIHdpdGggY3VzdG9tIFJQQyBVUkxzLicpLFxuICAgICAgICAgICAgTmV0d29ya0RldGFpbHNEaWFsb2dPcHRpb25zLlVQREFURV9SUENfVVJMX0RJQUxPRyxcbiAgICAgICAgICAgIHQoJ0NvbmZpcm0gU2F2ZScpLFxuICAgICAgICAgICAgdCgnQmFjaycpLFxuICAgICAgICAgICl9XG4gICAgICAgICAgYmdDb2xvckRlZmF1bHRcbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG59O1xuIl0sIm5hbWVzIjpbInVzZUVmZmVjdCIsInVzZVJlZiIsInVzZVN0YXRlIiwidXNlSGlzdG9yeSIsInVzZVBhcmFtcyIsInVzZVRyYW5zbGF0aW9uIiwiQnV0dG9uIiwiQ2xpY2tBd2F5TGlzdGVuZXIiLCJFZGl0SWNvbiIsIkdyb3ciLCJJY29uQnV0dG9uIiwiTWVudUl0ZW0iLCJNZW51TGlzdCIsIk1vcmVIb3Jpem9udGFsSWNvbiIsIlBvcHBlciIsIlNjcm9sbGJhcnMiLCJTdGFjayIsIlN0YXJGaWxsZWRJY29uIiwiU3Rhckljb24iLCJUcmFzaEljb24iLCJUeXBvZ3JhcGh5IiwidG9hc3QiLCJQYWdlVGl0bGUiLCJOZXR3b3JrTG9nbyIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJ1c2VOZXR3b3JrQ29udGV4dCIsIk5ldHdvcmtGb3JtIiwiTmV0d29ya0Zvcm1BY3Rpb24iLCJOZXR3b3JrRGV0YWlsc0RpYWxvZ09wdGlvbnMiLCJOZXR3b3JrRGV0YWlsc0RpYWxvZ3MiLCJ1c2VHb0JhY2siLCJOZXR3b3JrRGV0YWlscyIsInQiLCJoaXN0b3J5IiwibmV0d29ya0lkIiwic2VsZWN0ZWRDaGFpbklkIiwicGFyc2VJbnQiLCJuZXR3b3JrcyIsImlzRmF2b3JpdGVOZXR3b3JrIiwiYWRkRmF2b3JpdGVOZXR3b3JrIiwicmVtb3ZlRmF2b3JpdGVOZXR3b3JrIiwic2V0TmV0d29yayIsIm5ldHdvcmsiLCJpc0N1c3RvbU5ldHdvcmsiLCJyZW1vdmVDdXN0b21OZXR3b3JrIiwiaXNPcGVuIiwic2V0SXNPcGVuIiwic2VsZWN0QnV0dG9uUmVmIiwiZXJyb3JNZXNzYWdlIiwic2V0RXJyb3JNZXNzYWdlIiwic2Nyb2xsYmFyUmVmIiwiY2FwdHVyZSIsImdvQmFjayIsImNoaWxkUmVmIiwibmV0d29ya1N0YXRlIiwic2V0TmV0d29ya1N0YXRlIiwiaXNEZWxldGVEaWFsb2ciLCJzZXRJc0RlbGV0ZURpYWxvZyIsImlzRGVsZXRpbmciLCJzZXRJc0RlbGV0aW5nIiwibmV0d29ya0RhdGEiLCJmaW5kIiwibmV0d29ya0l0ZW0iLCJjaGFpbklkIiwiaXNGYXZvcml0ZSIsImlzQ3VzdG9tIiwiY2FuQ29ubmVjdCIsIm9uRGVsZXRlU3VjY2VzcyIsInN1Y2Nlc3MiLCJkdXJhdGlvbiIsIm9uRXJyb3IiLCJlIiwiY3VycmVudCIsInNjcm9sbFRvVG9wIiwiaGFuZGxlRGlhbG9nUHJpbWFyeUNsaWNrIiwiZGlhbG9nIiwiREVMRVRFX0RJQUxPRyIsInRoZW4iLCJjYXRjaCIsImZpbmFsbHkiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzeCIsIndpZHRoIiwiZGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwicHIiLCJtYXJnaW4iLCJnYXAiLCJzaXplIiwib25DbGljayIsInN0b3BQcm9wYWdhdGlvbiIsIm9uQ2xpY2tBd2F5IiwicmVmIiwib3BlbiIsImFuY2hvckVsIiwicGxhY2VtZW50IiwidHJhbnNpdGlvbiIsIlRyYW5zaXRpb25Qcm9wcyIsIl9leHRlbmRzIiwidGltZW91dCIsImRlbnNlIiwicCIsImJvcmRlclJhZGl1cyIsIm92ZXJmbG93IiwicHVzaCIsImZsZXhEaXJlY3Rpb24iLCJjb2xvciIsInZhcmlhbnQiLCJweCIsImZsZXhHcm93IiwicHQiLCJoZWlnaHQiLCJwYWRkaW5nIiwic3JjIiwibG9nb1VyaSIsImRlZmF1bHRTaXplIiwiY2hhaW5OYW1lIiwicmVhZE9ubHkiLCJjdXN0b21OZXR3b3JrIiwiYWN0aW9uIiwiRWRpdCIsInB5IiwiZnVsbFdpZHRoIiwiaXNQcmltYXJ5QnV0dG9uTG9hZGluZyIsImlzRGVsZXRlIiwiaGFuZGxlUHJpbWFyeUNsaWNrIiwiaGlkZURpYWxvZyIsIkRpYWxvZyIsImlzUmVzZXRScGNVcmwiLCJpc1VwZGF0ZVJwY1VybCIsInJlbmRlckRpYWxvZ0NvbnRlbnQiLCJ0aXRsZSIsImJvZHlUZXh0IiwicHJpbWFyeUJ1dHRvbkZuIiwicHJpbWFyeUJ1dHRvblRleHQiLCJzZWNvbmRhcnlCdXR0b25UZXh0IiwidGV4dEFsaWduIiwibXQiLCJtYiIsImRpc2FibGVkIiwiaXNMb2FkaW5nIiwiRnJhZ21lbnQiLCJvbkNsb3NlIiwiY29udGVudCIsImJnQ29sb3JEZWZhdWx0IiwiUkVTRVRfUlBDX1VSTF9ESUFMT0ciLCJVUERBVEVfUlBDX1VSTF9ESUFMT0ciXSwic291cmNlUm9vdCI6IiJ9