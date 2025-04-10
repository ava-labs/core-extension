"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_SeedlessPopups_SeedlessRemoveTotp_tsx"],{

/***/ "./src/pages/SeedlessPopups/SeedlessRemoveTotp.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/SeedlessPopups/SeedlessRemoveTotp.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SeedlessRemoveTotp": () => (/* binding */ SeedlessRemoveTotp)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_hooks_useSeedlessMfa__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useSeedlessMfa */ "./src/hooks/useSeedlessMfa.tsx");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var _src_contexts_SeedlessMfaManagementProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/SeedlessMfaManagementProvider */ "./src/contexts/SeedlessMfaManagementProvider.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");






var State = /*#__PURE__*/function (State) {
  State["Loading"] = "loading";
  State["IncompatibleWallet"] = "incompatible-wallet";
  State["NameYourDevice"] = "name-your-device";
  State["AddAuthenticator"] = "add-authenticator";
  State["Success"] = "success";
  State["Failure"] = "failure";
  return State;
}(State || {});
const SeedlessRemoveTotp = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const {
    removeTotp
  } = (0,_src_contexts_SeedlessMfaManagementProvider__WEBPACK_IMPORTED_MODULE_3__.useSeedlessMfaManager)();
  const {
    renderMfaPrompt
  } = (0,_src_hooks_useSeedlessMfa__WEBPACK_IMPORTED_MODULE_1__.useSeedlessMfa)();
  const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(State.Loading);
  const remove = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    try {
      await removeTotp();
      setState(State.Success);
    } catch {
      setState(State.Failure);
    }
  }, [removeTotp]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    remove();
  }, [remove]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 375,
      height: 600,
      px: 2,
      alignSelf: 'center',
      borderRadius: 1,
      backgroundColor: 'background.paper'
    }
  }, state === State.Failure && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 1,
      height: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      px: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.AlertCircleIcon, {
    size: 72
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      textAlign: 'center',
      gap: 0.5
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "h5",
    sx: {
      mb: 2
    }
  }, t('Something Went Wrong')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2"
  }, t('We encountered an unexpected issue.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2"
  }, t('Please try again.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    fullWidth: true,
    sx: {
      mt: 4
    },
    onClick: remove,
    "data-testid": "btn-try-again"
  }, t('Try again')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    fullWidth: true,
    variant: "text",
    onClick: window.close,
    "data-testid": "btn-close"
  }, t('Close'))), state === State.Success && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      width: 1,
      height: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      px: 2,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.CheckCircleIcon, {
    size: 72,
    sx: {
      color: 'success.main'
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "h5"
  }, t('Success!')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2"
  }, t('Authenticator app removed successfully!')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
    fullWidth: true,
    onClick: window.close,
    "data-testid": "btn-close",
    sx: {
      mt: 3
    }
  }, t('Close'))), state === State.Loading && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__.PageTitle, {
    showBackButton: false,
    variant: _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_2__.PageTitleVariant.PRIMARY,
    margin: "0 0 0 -16px"
  }, t('Authenticator Removal')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.CircularProgress, {
    size: 72
  })), renderMfaPrompt()));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1NlZWRsZXNzUG9wdXBzX1NlZWRsZXNzUmVtb3ZlVG90cF90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXlEO0FBQ1Y7QUFRVjtBQUVzQjtBQUNvQjtBQUNLO0FBQUEsSUFFL0VjLEtBQUssMEJBQUxBLEtBQUs7RUFBTEEsS0FBSztFQUFMQSxLQUFLO0VBQUxBLEtBQUs7RUFBTEEsS0FBSztFQUFMQSxLQUFLO0VBQUxBLEtBQUs7RUFBQSxPQUFMQSxLQUFLO0FBQUEsRUFBTEEsS0FBSztBQVNILE1BQU1DLGtCQUFrQixHQUFHQSxDQUFBLEtBQU07RUFDdEMsTUFBTTtJQUFFQztFQUFFLENBQUMsR0FBR2IsNkRBQWMsRUFBRTtFQUM5QixNQUFNO0lBQUVjO0VBQVcsQ0FBQyxHQUFHSixrR0FBcUIsRUFBRTtFQUM5QyxNQUFNO0lBQUVLO0VBQWdCLENBQUMsR0FBR1IseUVBQWMsRUFBRTtFQUM1QyxNQUFNLENBQUNTLEtBQUssRUFBRUMsUUFBUSxDQUFDLEdBQUdsQiwrQ0FBUSxDQUFDWSxLQUFLLENBQUNPLE9BQU8sQ0FBQztFQUVqRCxNQUFNQyxNQUFNLEdBQUd0QixrREFBVyxDQUFDLFlBQVk7SUFDckMsSUFBSTtNQUNGLE1BQU1pQixVQUFVLEVBQUU7TUFDbEJHLFFBQVEsQ0FBQ04sS0FBSyxDQUFDUyxPQUFPLENBQUM7SUFDekIsQ0FBQyxDQUFDLE1BQU07TUFDTkgsUUFBUSxDQUFDTixLQUFLLENBQUNVLE9BQU8sQ0FBQztJQUN6QjtFQUNGLENBQUMsRUFBRSxDQUFDUCxVQUFVLENBQUMsQ0FBQztFQUVoQmhCLGdEQUFTLENBQUMsTUFBTTtJQUNkcUIsTUFBTSxFQUFFO0VBQ1YsQ0FBQyxFQUFFLENBQUNBLE1BQU0sQ0FBQyxDQUFDO0VBRVosb0JBQ0VHLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbEIsOERBQUs7SUFDSm1CLEVBQUUsRUFBRTtNQUNGQyxLQUFLLEVBQUUsR0FBRztNQUNWQyxNQUFNLEVB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QixDQUFDLENBQUMsT0FBTyxDQUFDLENBQ0osQ0FFWixFQUNBRyxLQUFLLEtBQUtMLEtBQUssQ0FBQ08sT0FBTyxpQkFDdEJJLEtBQUEsQ0FBQUMsYUFBQSxDQUFBRCxLQUFBLENBQUFzQixRQUFBLHFCQUNFdEIsS0FBQSxDQUFBQyxhQUFBLENBQUNmLHVFQUFTO0lBQ1JxQyxjQUFjLEVBQUUsS0FBTTtJQUN0QlQsT0FBTyxFQUFFM0Isc0ZBQXlCO0lBQ2xDc0MsTUFBTSxFQUFDO0VBQWEsR0FFbkJsQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FDakIsZUFDWlMsS0FBQSxDQUFBQyxhQUFBLENBQUNsQiw4REFBSztJQUNKbUIsRUFBRSxFQUFFO01BQUVPLGNBQWMsRUFBRSxRQUFRO01BQUVDLFVBQVUsRUFBRSxRQUFRO01BQUVnQixRQUFRLEVBQUU7SUFBRTtFQUFFLGdCQUVwRTFCLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbkIseUVBQWdCO0lBQUM4QixJQUFJLEVBQUU7RUFBRyxFQUFHLENBQ3hCLEVBQ1BuQixlQUFlLEVBQUUsQ0FFckIsQ0FDSztBQUVaLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlZWRsZXNzUG9wdXBzL1NlZWRsZXNzUmVtb3ZlVG90cC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQWxlcnRDaXJjbGVJY29uLFxuICBCdXR0b24sXG4gIENoZWNrQ2lyY2xlSWNvbixcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IHVzZVNlZWRsZXNzTWZhIH0gZnJvbSAnQHNyYy9ob29rcy91c2VTZWVkbGVzc01mYSc7XG5pbXBvcnQgeyBQYWdlVGl0bGUsIFBhZ2VUaXRsZVZhcmlhbnQgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB1c2VTZWVkbGVzc01mYU1hbmFnZXIgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NlZWRsZXNzTWZhTWFuYWdlbWVudFByb3ZpZGVyJztcblxuZW51bSBTdGF0ZSB7XG4gIExvYWRpbmcgPSAnbG9hZGluZycsXG4gIEluY29tcGF0aWJsZVdhbGxldCA9ICdpbmNvbXBhdGlibGUtd2FsbGV0JyxcbiAgTmFtZVlvdXJEZXZpY2UgPSAnbmFtZS15b3VyLWRldmljZScsXG4gIEFkZEF1dGhlbnRpY2F0b3IgPSAnYWRkLWF1dGhlbnRpY2F0b3InLFxuICBTdWNjZXNzID0gJ3N1Y2Nlc3MnLFxuICBGYWlsdXJlID0gJ2ZhaWx1cmUnLFxufVxuXG5leHBvcnQgY29uc3QgU2VlZGxlc3NSZW1vdmVUb3RwID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgcmVtb3ZlVG90cCB9ID0gdXNlU2VlZGxlc3NNZmFNYW5hZ2VyKCk7XG4gIGNvbnN0IHsgcmVuZGVyTWZhUHJvbXB0IH0gPSB1c2VTZWVkbGVzc01mYSgpO1xuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKFN0YXRlLkxvYWRpbmcpO1xuXG4gIGNvbnN0IHJlbW92ZSA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgcmVtb3ZlVG90cCgpO1xuICAgICAgc2V0U3RhdGUoU3RhdGUuU3VjY2Vzcyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBzZXRTdGF0ZShTdGF0ZS5GYWlsdXJlKTtcbiAgICB9XG4gIH0sIFtyZW1vdmVUb3RwXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZW1vdmUoKTtcbiAgfSwgW3JlbW92ZV0pO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogMzc1LFxuICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgcHg6IDIsXG4gICAgICAgIGFsaWduU2VsZjogJ2NlbnRlcicsXG4gICAgICAgIGJvcmRlclJhZGl1czogMSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnYmFja2dyb3VuZC5wYXBlcicsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtzdGF0ZSA9PT0gU3RhdGUuRmFpbHVyZSAmJiAoXG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgZ2FwOiAyLFxuICAgICAgICAgICAgcHg6IDMsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxBbGVydENpcmNsZUljb24gc2l6ZT17NzJ9IC8+XG4gICAgICAgICAgPFN0YWNrIHN4PXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIGdhcDogMC41IH19PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgc3g9e3sgbWI6IDIgfX0+XG4gICAgICAgICAgICAgIHt0KCdTb21ldGhpbmcgV2VudCBXcm9uZycpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAgICAgIHt0KCdXZSBlbmNvdW50ZXJlZCBhbiB1bmV4cGVjdGVkIGlzc3VlLicpfVxuICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+e3QoJ1BsZWFzZSB0cnkgYWdhaW4uJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHN4PXt7IG10OiA0IH19XG4gICAgICAgICAgICBvbkNsaWNrPXtyZW1vdmV9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImJ0bi10cnktYWdhaW5cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdUcnkgYWdhaW4nKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3dpbmRvdy5jbG9zZX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYnRuLWNsb3NlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnQ2xvc2UnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICl9XG4gICAgICB7c3RhdGUgPT09IFN0YXRlLlN1Y2Nlc3MgJiYgKFxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGdhcDogMixcbiAgICAgICAgICAgIHB4OiAyLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPENoZWNrQ2lyY2xlSWNvbiBzaXplPXs3Mn0gc3g9e3sgY29sb3I6ICdzdWNjZXNzLm1haW4nIH19IC8+XG4gICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+e3QoJ1N1Y2Nlc3MhJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPlxuICAgICAgICAgICAge3QoJ0F1dGhlbnRpY2F0b3IgYXBwIHJlbW92ZWQgc3VjY2Vzc2Z1bGx5IScpfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cblxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgb25DbGljaz17d2luZG93LmNsb3NlfVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJidG4tY2xvc2VcIlxuICAgICAgICAgICAgc3g9e3sgbXQ6IDMgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnQ2xvc2UnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgICl9XG4gICAgICB7c3RhdGUgPT09IFN0YXRlLkxvYWRpbmcgJiYgKFxuICAgICAgICA8PlxuICAgICAgICAgIDxQYWdlVGl0bGVcbiAgICAgICAgICAgIHNob3dCYWNrQnV0dG9uPXtmYWxzZX1cbiAgICAgICAgICAgIHZhcmlhbnQ9e1BhZ2VUaXRsZVZhcmlhbnQuUFJJTUFSWX1cbiAgICAgICAgICAgIG1hcmdpbj1cIjAgMCAwIC0xNnB4XCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnQXV0aGVudGljYXRvciBSZW1vdmFsJyl9XG4gICAgICAgICAgPC9QYWdlVGl0bGU+XG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17eyBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBmbGV4R3JvdzogMSB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxDaXJjdWxhclByb2dyZXNzIHNpemU9ezcyfSAvPlxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAge3JlbmRlck1mYVByb21wdCgpfVxuICAgICAgICA8Lz5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iXSwibmFtZXMiOlsidXNlQ2FsbGJhY2siLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsInVzZVRyYW5zbGF0aW9uIiwiQWxlcnRDaXJjbGVJY29uIiwiQnV0dG9uIiwiQ2hlY2tDaXJjbGVJY29uIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIlN0YWNrIiwiVHlwb2dyYXBoeSIsInVzZVNlZWRsZXNzTWZhIiwiUGFnZVRpdGxlIiwiUGFnZVRpdGxlVmFyaWFudCIsInVzZVNlZWRsZXNzTWZhTWFuYWdlciIsIlN0YXRlIiwiU2VlZGxlc3NSZW1vdmVUb3RwIiwidCIsInJlbW92ZVRvdHAiLCJyZW5kZXJNZmFQcm9tcHQiLCJzdGF0ZSIsInNldFN0YXRlIiwiTG9hZGluZyIsInJlbW92ZSIsIlN1Y2Nlc3MiLCJGYWlsdXJlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJ3aWR0aCIsImhlaWdodCIsInB4IiwiYWxpZ25TZWxmIiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiZ2FwIiwic2l6ZSIsInRleHRBbGlnbiIsInZhcmlhbnQiLCJtYiIsImZ1bGxXaWR0aCIsIm10Iiwib25DbGljayIsIndpbmRvdyIsImNsb3NlIiwiY29sb3IiLCJGcmFnbWVudCIsInNob3dCYWNrQnV0dG9uIiwiUFJJTUFSWSIsIm1hcmdpbiIsImZsZXhHcm93Il0sInNvdXJjZVJvb3QiOiIifQ==