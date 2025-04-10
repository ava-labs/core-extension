"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Networks_AddNetwork_tsx"],{

/***/ "./src/pages/Networks/AddNetwork.tsx":
/*!*******************************************!*\
  !*** ./src/pages/Networks/AddNetwork.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddNetwork": () => (/* binding */ AddNetwork)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_hooks_usePageHistory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/usePageHistory */ "./src/hooks/usePageHistory.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _NetworkForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NetworkForm */ "./src/pages/Networks/NetworkForm.tsx");
/* harmony import */ var _Networks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Networks */ "./src/pages/Networks/Networks.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");











const FlexScrollbars = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Scrollbars)`
  flex-grow: 1;
  max-height: unset;
  height: 100%;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;
const AddNetwork = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_9__.useTranslation)();
  const {
    saveCustomNetwork,
    isDeveloperMode
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  const {
    getPageHistoryData,
    setNavigationHistoryData
  } = (0,_src_hooks_usePageHistory__WEBPACK_IMPORTED_MODULE_2__.usePageHistory)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useHistory)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__["default"])();
  const defaultNetworkValues = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    chainName: '',
    chainId: 0,
    vmName: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_12__.NetworkVMType.EVM,
    rpcUrl: '',
    networkToken: {
      name: '',
      symbol: '',
      description: '',
      decimals: 18,
      logoUri: ''
    },
    logoUri: '',
    explorerUrl: ''
  }), []);
  const [network, setNetwork] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultNetworkValues);
  const pageHistoryData = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    ...getPageHistoryData()
  }), [getPageHistoryData]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (Object.keys(pageHistoryData).length) {
      setShowErrors(true);
    }
    setNetwork({
      ...defaultNetworkValues,
      ...pageHistoryData
    });
  }, [defaultNetworkValues, pageHistoryData]);
  const [isFormValid, setIsFormValid] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showErrors, setShowErrors] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [errorMessage, setErrorMessage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const scrollbarRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_4__.useAnalyticsContext)();
  const [isSaving, setIsSaving] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const onSuccess = () => {
    capture('CustomNetworkAdded');
    _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_13__["default"].success(t('Custom network added!'), {
      duration: 2000
    });
    history.push(`/networks?activeTab=${_Networks__WEBPACK_IMPORTED_MODULE_6__.NetworkTab.Custom}`);
  };
  const onError = e => {
    setErrorMessage(e);
    scrollbarRef?.current?.scrollToTop();
  };
  const handleSave = () => {
    setIsSaving(true);
    saveCustomNetwork(network).then(onSuccess).catch(onError).finally(() => {
      setIsSaving(false);
    });
  };
  const handleChange = (networkState, formValid) => {
    setNetwork({
      ...networkState,
      isTestnet: isDeveloperMode
    });
    setNavigationHistoryData({
      ...networkState
    });
    setIsFormValid(formValid);
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_1__.PageTitle, null, t('Add Network')), /*#__PURE__*/React.createElement(FlexScrollbars, {
    ref: scrollbarRef
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      gap: 1,
      px: 2
    }
  }, errorMessage && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    variant: "body2",
    color: theme.palette.error.main,
    sx: {
      py: 1,
      mb: 2
    }
  }, errorMessage), /*#__PURE__*/React.createElement(_NetworkForm__WEBPACK_IMPORTED_MODULE_5__.NetworkForm, {
    customNetwork: network,
    handleChange: handleChange,
    showErrors: showErrors,
    action: _NetworkForm__WEBPACK_IMPORTED_MODULE_5__.NetworkFormAction.Add
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    direction: "row",
    sx: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      py: 3,
      gap: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Button, {
    color: "secondary",
    "data-testid": "cancel-network-save",
    size: "large",
    fullWidth: true,
    onClick: history.goBack,
    sx: {
      px: 0
    }
  }, t('Cancel')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Tooltip, {
    title: !isFormValid && t('There are invalid fields in the form'),
    sx: {
      boxSizing: 'border-box',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Button, {
    color: "primary",
    "data-testid": "add-network-save",
    size: "large",
    fullWidth: true,
    disabled: !isFormValid || isSaving,
    isLoading: isSaving,
    onClick: () => {
      setShowErrors(true);
      if (isFormValid) {
        handleSave();
      }
    },
    sx: {
      px: 0
    }
  }, t('Save')))));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX05ldHdvcmtzX0FkZE5ldHdvcmtfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQTZEO0FBQ2Y7QUFDQztBQVdWO0FBQzZCO0FBRUw7QUFDRjtBQUNPO0FBQ0k7QUFFUDtBQUN2QjtBQUV4QyxNQUFNc0IsY0FBYyxHQUFHWCx1RUFBTSxDQUFDSixtRUFBVSxDQUFFO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFFTSxNQUFNZ0IsVUFBVSxHQUFHQSxDQUFBLEtBQU07RUFDOUIsTUFBTTtJQUFFQztFQUFFLENBQUMsR0FBR25CLDZEQUFjLEVBQUU7RUFDOUIsTUFBTTtJQUFFb0IsaUJBQWlCO0lBQUVDO0VBQWdCLENBQUMsR0FBR1QsZ0ZBQWlCLEVBQUU7RUFDbEUsTUFBTTtJQUFFVSxrQkFBa0I7SUFBRUM7RUFBeUIsQ0FBQyxHQUFHWix5RUFBYyxFQUFFO0VBRXpFLE1BQU1hLE9BQU8sR0FBR3pCLDZEQUFVLEVBQUU7RUFDNUIsTUFBTTBCLEtBQUssR0FBR2pCLHdFQUFRLEVBQUU7RUFDeEIsTUFBTWtCLG9CQUFvQixHQUFHNUIsOENBQU8sQ0FDbEMsT0FBTztJQUNMNkIsU0FBUyxFQUFFLEVBQUU7SUFDYkMsT0FBTyxFQUFFLENBQUM7SUFDVkMsTUFBTSxFQUFFcEIsd0VBQWlCO0lBQ3pCc0IsTUFBTSxFQUFFLEVBQUU7SUFDVkMsWUFBWSxFQUFFO01BQ1pDLElBQUksRUFBRSxFQUFFO01BQ1JDLE1BQU0sRUFBRSxFQUFFO01BQ1ZDLFdBQVcsRUFBRSxFQUFFO01BQ2ZDLFFBQVEsRUFBRSxFQUFFO01BQ1pDLE9BQU8sRUFBRTtJQUNYLENBQUM7SUFDREEsT0FBTyxFQUFFLEVBQUU7SUFDWEMsV0FBVyxFQUFFO0VBQ2YsQ0FBQyxDQUFDLEVBQ0YsRUFBRSxDQUNIO0VBQ0QsTUFBTSxDQUFDQyxPQUFPLEVBQUVDLFVBQVUsQ0FBQyxH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LFNBQVMsRUFBRSxZQUFZO01BQUV2QixLQUFLLEVBQUU7SUFBTztFQUFFLGdCQUUvQ0gsS0FBQSxDQUFBQyxhQUFBLENBQUN4RSwrREFBTTtJQUNMK0UsS0FBSyxFQUFDLFNBQVM7SUFDZixlQUFZLGtCQUFrQjtJQUM5QmEsSUFBSSxFQUFDLE9BQU87SUFDWkMsU0FBUztJQUNUSyxRQUFRLEVBQUUsQ0FBQ3JELFdBQVcsSUFBSU8sUUFBUztJQUNuQytDLFNBQVMsRUFBRS9DLFFBQVM7SUFDcEIwQyxPQUFPLEVBQUVBLENBQUEsS0FBTTtNQUNibEQsYUFBYSxDQUFDLElBQUksQ0FBQztNQUNuQixJQUFJQyxXQUFXLEVBQUU7UUFDZmtCLFVBQVUsRUFBRTtNQUNkO0lBQ0YsQ0FBRTtJQUNGVSxFQUFFLEVBQUU7TUFBRUksRUFBRSxFQUFFO0lBQUU7RUFBRSxHQUViM0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUNILENBQ0QsQ0FDSixDQUNGO0FBRVosQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTmV0d29ya3MvQWRkTmV0d29yay50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgU2Nyb2xsYmFycyxcbiAgU2Nyb2xsYmFyc1JlZixcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG4gIHN0eWxlZCxcbiAgdG9hc3QsXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgTmV0d29yaywgTmV0d29ya1ZNVHlwZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtY2hhaW5zLXNkayc7XG5cbmltcG9ydCB7IFBhZ2VUaXRsZSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vUGFnZVRpdGxlJztcbmltcG9ydCB7IHVzZVBhZ2VIaXN0b3J5IH0gZnJvbSAnQHNyYy9ob29rcy91c2VQYWdlSGlzdG9yeSc7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcblxuaW1wb3J0IHsgTmV0d29ya0Zvcm0sIE5ldHdvcmtGb3JtQWN0aW9uIH0gZnJvbSAnLi9OZXR3b3JrRm9ybSc7XG5pbXBvcnQgeyBOZXR3b3JrVGFiIH0gZnJvbSAnLi9OZXR3b3Jrcyc7XG5cbmNvbnN0IEZsZXhTY3JvbGxiYXJzID0gc3R5bGVkKFNjcm9sbGJhcnMpYFxuICBmbGV4LWdyb3c6IDE7XG4gIG1heC1oZWlnaHQ6IHVuc2V0O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xuXG4gICYgPiBkaXYge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IEFkZE5ldHdvcmsgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgeyBzYXZlQ3VzdG9tTmV0d29yaywgaXNEZXZlbG9wZXJNb2RlIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCB7IGdldFBhZ2VIaXN0b3J5RGF0YSwgc2V0TmF2aWdhdGlvbkhpc3RvcnlEYXRhIH0gPSB1c2VQYWdlSGlzdG9yeSgpO1xuXG4gIGNvbnN0IGhpc3RvcnkgPSB1c2VIaXN0b3J5KCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgZGVmYXVsdE5ldHdvcmtWYWx1ZXMgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBjaGFpbk5hbWU6ICcnLFxuICAgICAgY2hhaW5JZDogMCxcbiAgICAgIHZtTmFtZTogTmV0d29ya1ZNVHlwZS5FVk0sXG4gICAgICBycGNVcmw6ICcnLFxuICAgICAgbmV0d29ya1Rva2VuOiB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBzeW1ib2w6ICcnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGRlY2ltYWxzOiAxOCxcbiAgICAgICAgbG9nb1VyaTogJycsXG4gICAgICB9LFxuICAgICAgbG9nb1VyaTogJycsXG4gICAgICBleHBsb3JlclVybDogJycsXG4gICAgfSksXG4gICAgW10sXG4gICk7XG4gIGNvbnN0IFtuZXR3b3JrLCBzZXROZXR3b3JrXSA9IHVzZVN0YXRlPE5ldHdvcms+KGRlZmF1bHROZXR3b3JrVmFsdWVzKTtcblxuICBjb25zdCBwYWdlSGlzdG9yeURhdGEgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICAuLi5nZXRQYWdlSGlzdG9yeURhdGEoKSxcbiAgICB9KSxcbiAgICBbZ2V0UGFnZUhpc3RvcnlEYXRhXSxcbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChPYmplY3Qua2V5cyhwYWdlSGlzdG9yeURhdGEpLmxlbmd0aCkge1xuICAgICAgc2V0U2hvd0Vycm9ycyh0cnVlKTtcbiAgICB9XG4gICAgc2V0TmV0d29yayh7IC4uLmRlZmF1bHROZXR3b3JrVmFsdWVzLCAuLi5wYWdlSGlzdG9yeURhdGEgfSk7XG4gIH0sIFtkZWZhdWx0TmV0d29ya1ZhbHVlcywgcGFnZUhpc3RvcnlEYXRhXSk7XG5cbiAgY29uc3QgW2lzRm9ybVZhbGlkLCBzZXRJc0Zvcm1WYWxpZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG93RXJyb3JzLCBzZXRTaG93RXJyb3JzXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yTWVzc2FnZSwgc2V0RXJyb3JNZXNzYWdlXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3Qgc2Nyb2xsYmFyUmVmID0gdXNlUmVmPFNjcm9sbGJhcnNSZWYgfCBudWxsPihudWxsKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IFtpc1NhdmluZywgc2V0SXNTYXZpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IG9uU3VjY2VzcyA9ICgpID0+IHtcbiAgICBjYXB0dXJlKCdDdXN0b21OZXR3b3JrQWRkZWQnKTtcbiAgICB0b2FzdC5zdWNjZXNzKHQoJ0N1c3RvbSBuZXR3b3JrIGFkZGVkIScpLCB7IGR1cmF0aW9uOiAyMDAwIH0pO1xuICAgIGhpc3RvcnkucHVzaChgL25ldHdvcmtzP2FjdGl2ZVRhYj0ke05ldHdvcmtUYWIuQ3VzdG9tfWApO1xuICB9O1xuXG4gIGNvbnN0IG9uRXJyb3IgPSAoZTogc3RyaW5nKSA9PiB7XG4gICAgc2V0RXJyb3JNZXNzYWdlKGUpO1xuICAgIHNjcm9sbGJhclJlZj8uY3VycmVudD8uc2Nyb2xsVG9Ub3AoKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVTYXZlID0gKCkgPT4ge1xuICAgIHNldElzU2F2aW5nKHRydWUpO1xuXG4gICAgc2F2ZUN1c3RvbU5ldHdvcmsobmV0d29yaylcbiAgICAgIC50aGVuKG9uU3VjY2VzcylcbiAgICAgIC5jYXRjaChvbkVycm9yKVxuICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICBzZXRJc1NhdmluZyhmYWxzZSk7XG4gICAgICB9KTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAobmV0d29ya1N0YXRlOiBOZXR3b3JrLCBmb3JtVmFsaWQ6IGJvb2xlYW4pID0+IHtcbiAgICBzZXROZXR3b3JrKHtcbiAgICAgIC4uLm5ldHdvcmtTdGF0ZSxcbiAgICAgIGlzVGVzdG5ldDogaXNEZXZlbG9wZXJNb2RlLFxuICAgIH0pO1xuICAgIHNldE5hdmlnYXRpb25IaXN0b3J5RGF0YSh7IC4uLm5ldHdvcmtTdGF0ZSB9KTtcbiAgICBzZXRJc0Zvcm1WYWxpZChmb3JtVmFsaWQpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxIH19PlxuICAgICAgPFBhZ2VUaXRsZT57dCgnQWRkIE5ldHdvcmsnKX08L1BhZ2VUaXRsZT5cbiAgICAgIDxGbGV4U2Nyb2xsYmFycyByZWY9e3Njcm9sbGJhclJlZn0+XG4gICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDEsIHB4OiAyIH19PlxuICAgICAgICAgIHtlcnJvck1lc3NhZ2UgJiYgKFxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgICAgICAgY29sb3I9e3RoZW1lLnBhbGV0dGUuZXJyb3IubWFpbn1cbiAgICAgICAgICAgICAgc3g9e3sgcHk6IDEsIG1iOiAyIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtlcnJvck1lc3NhZ2V9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8TmV0d29ya0Zvcm1cbiAgICAgICAgICAgIGN1c3RvbU5ldHdvcms9e25ldHdvcmt9XG4gICAgICAgICAgICBoYW5kbGVDaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIHNob3dFcnJvcnM9e3Nob3dFcnJvcnN9XG4gICAgICAgICAgICBhY3Rpb249e05ldHdvcmtGb3JtQWN0aW9uLkFkZH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9GbGV4U2Nyb2xsYmFycz5cbiAgICAgIDxTdGFja1xuICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICBzeD17e1xuICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgIHB5OiAzLFxuICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICBweDogMixcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImNhbmNlbC1uZXR3b3JrLXNhdmVcIlxuICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgb25DbGljaz17aGlzdG9yeS5nb0JhY2t9XG4gICAgICAgICAgc3g9e3sgcHg6IDAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdDYW5jZWwnKX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgdGl0bGU9eyFpc0Zvcm1WYWxpZCAmJiB0KCdUaGVyZSBhcmUgaW52YWxpZCBmaWVsZHMgaW4gdGhlIGZvcm0nKX1cbiAgICAgICAgICBzeD17eyBib3hTaXppbmc6ICdib3JkZXItYm94Jywgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgY29sb3I9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWRkLW5ldHdvcmstc2F2ZVwiXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgICBkaXNhYmxlZD17IWlzRm9ybVZhbGlkIHx8IGlzU2F2aW5nfVxuICAgICAgICAgICAgaXNMb2FkaW5nPXtpc1NhdmluZ31cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0U2hvd0Vycm9ycyh0cnVlKTtcbiAgICAgICAgICAgICAgaWYgKGlzRm9ybVZhbGlkKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlU2F2ZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgc3g9e3sgcHg6IDAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnU2F2ZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIl0sIm5hbWVzIjpbInVzZUVmZmVjdCIsInVzZVJlZiIsInVzZVN0YXRlIiwidXNlTWVtbyIsInVzZUhpc3RvcnkiLCJ1c2VUcmFuc2xhdGlvbiIsIkJ1dHRvbiIsIlNjcm9sbGJhcnMiLCJTdGFjayIsIlRvb2x0aXAiLCJUeXBvZ3JhcGh5Iiwic3R5bGVkIiwidG9hc3QiLCJ1c2VUaGVtZSIsIk5ldHdvcmtWTVR5cGUiLCJQYWdlVGl0bGUiLCJ1c2VQYWdlSGlzdG9yeSIsInVzZU5ldHdvcmtDb250ZXh0IiwidXNlQW5hbHl0aWNzQ29udGV4dCIsIk5ldHdvcmtGb3JtIiwiTmV0d29ya0Zvcm1BY3Rpb24iLCJOZXR3b3JrVGFiIiwiRmxleFNjcm9sbGJhcnMiLCJBZGROZXR3b3JrIiwidCIsInNhdmVDdXN0b21OZXR3b3JrIiwiaXNEZXZlbG9wZXJNb2RlIiwiZ2V0UGFnZUhpc3RvcnlEYXRhIiwic2V0TmF2aWdhdGlvbkhpc3RvcnlEYXRhIiwiaGlzdG9yeSIsInRoZW1lIiwiZGVmYXVsdE5ldHdvcmtWYWx1ZXMiLCJjaGFpbk5hbWUiLCJjaGFpbklkIiwidm1OYW1lIiwiRVZNIiwicnBjVXJsIiwibmV0d29ya1Rva2VuIiwibmFtZSIsInN5bWJvbCIsImRlc2NyaXB0aW9uIiwiZGVjaW1hbHMiLCJsb2dvVXJpIiwiZXhwbG9yZXJVcmwiLCJuZXR3b3JrIiwic2V0TmV0d29yayIsInBhZ2VIaXN0b3J5RGF0YSIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJzZXRTaG93RXJyb3JzIiwiaXNGb3JtVmFsaWQiLCJzZXRJc0Zvcm1WYWxpZCIsInNob3dFcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJzZXRFcnJvck1lc3NhZ2UiLCJzY3JvbGxiYXJSZWYiLCJjYXB0dXJlIiwiaXNTYXZpbmciLCJzZXRJc1NhdmluZyIsIm9uU3VjY2VzcyIsInN1Y2Nlc3MiLCJkdXJhdGlvbiIsInB1c2giLCJDdXN0b20iLCJvbkVycm9yIiwiZSIsImN1cnJlbnQiLCJzY3JvbGxUb1RvcCIsImhhbmRsZVNhdmUiLCJ0aGVuIiwiY2F0Y2giLCJmaW5hbGx5IiwiaGFuZGxlQ2hhbmdlIiwibmV0d29ya1N0YXRlIiwiZm9ybVZhbGlkIiwiaXNUZXN0bmV0IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJ3aWR0aCIsInJlZiIsImdhcCIsInB4IiwidmFyaWFudCIsImNvbG9yIiwicGFsZXR0ZSIsImVycm9yIiwibWFpbiIsInB5IiwibWIiLCJjdXN0b21OZXR3b3JrIiwiYWN0aW9uIiwiQWRkIiwiZGlyZWN0aW9uIiwiZmxleEdyb3ciLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJzaXplIiwiZnVsbFdpZHRoIiwib25DbGljayIsImdvQmFjayIsInRpdGxlIiwiYm94U2l6aW5nIiwiZGlzYWJsZWQiLCJpc0xvYWRpbmciXSwic291cmNlUm9vdCI6IiJ9