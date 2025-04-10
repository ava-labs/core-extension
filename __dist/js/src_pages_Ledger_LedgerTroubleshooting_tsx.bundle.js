"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Ledger_LedgerTroubleshooting_tsx"],{

/***/ "./src/pages/Ledger/LedgerTroubleshooting.tsx":
/*!****************************************************!*\
  !*** ./src/pages/Ledger/LedgerTroubleshooting.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerTroubleshooting": () => (/* binding */ LedgerTroubleshooting)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/Overlay */ "./src/components/common/Overlay.tsx");
/* harmony import */ var _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/LedgerProvider */ "./src/contexts/LedgerProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const LedgerTroubleshooting = () => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const {
    popDeviceSelection
  } = (0,_src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_1__.useLedgerContext)();
  const [isConnected, setIsConnected] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  return /*#__PURE__*/React.createElement(_src_components_common_Overlay__WEBPACK_IMPORTED_MODULE_0__.Overlay, {
    isBackgroundFilled: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      width: 375,
      p: 3,
      gap: 2,
      alignSelf: 'center',
      backgroundColor: 'grey.900',
      borderRadius: 1,
      textAlign: 'center'
    }
  }, isConnected && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "h5"
  }, t('Successfully reconnected!')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    color: "primary",
    size: "large",
    sx: {
      mt: 3
    },
    onClick: window.close
  }, t('Close'))), !isConnected && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "h5"
  }, t('Ledger Disconnected')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: "body2"
  }, t('Core is no longer connected to your Ledger device. Reconnect your Ledger to continue.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    color: "primary",
    size: "large",
    onClick: async () => {
      try {
        await popDeviceSelection();
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    },
    sx: {
      mt: 3
    }
  }, t('Reconnect')))));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0xlZGdlcl9MZWRnZXJUcm91Ymxlc2hvb3RpbmdfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStDO0FBQ3lCO0FBRWY7QUFDTztBQUMvQjtBQUUxQixNQUFNTyxxQkFBcUIsR0FBR0EsQ0FBQSxLQUFNO0VBQ3pDLE1BQU07SUFBRUM7RUFBRSxDQUFDLEdBQUdSLDZEQUFjLEVBQUU7RUFDOUIsTUFBTTtJQUFFUztFQUFtQixDQUFDLEdBQUdKLDhFQUFnQixFQUFFO0VBRWpELE1BQU0sQ0FBQ0ssV0FBVyxFQUFFQyxjQUFjLENBQUMsR0FBR0wsK0NBQVEsQ0FBQyxLQUFLLENBQUM7RUFFckQsb0JBQ0VNLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVCxtRUFBTztJQUFDVSxrQkFBa0I7RUFBQSxnQkFDekJGLEtBQUEsQ0FBQUMsYUFBQSxDQUFDWCw4REFBSztJQUNKYSxFQUFFLEVBQUU7TUFDRkMsS0FBSyxFQUFFLEdBQUc7TUFDVkMsQ0FBQyxFQUFFLENBQUM7TUFDSkMsR0FBRyxFQUFFLENBQUM7TUFDTkMsU0FBUyxFQUFFLFFBQVE7TUFDbkJDLGVBQWUsRUFBRSxVQUFVO01BQzNCQyxZQUFZLEVBQUUsQ0FBQztNQUNmQyxTQUFTLEVBQUU7SUFDYjtFQUFFLEdBRURaLFdBQVcsaUJBQ1ZFLEtBQUEsQ0FBQUMsYUFBQSxDQUFBRCxLQUFBLENBQUFXLFFBQUEscUJBQ0VYLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVixtRUFBVTtJQUFDcUIsT0FBTyxFQUFDO0VBQUksR0FDckJoQixDQUFDLENBQUMsMkJBQTJCLENBQUMsQ0FDcEIsZUFDYkksS0FBQSxDQUFBQyxhQUFBLENBQUNaLCtEQUFNO0lBQ0x3QixLQUFLLEVBQUMsU0FBUztJQUNmQyxJQUFJLEVBQUMsT0FBTztJQUNaWCxFQUFFLEVBQUU7TUFBRVksRUFBRSxFQUFFO0lBQUUsQ0FBRTtJQUNkQyxPQUFPLEVBQUVDLE1BQU0sQ0FBQ0M7RUFBTSxHQUVyQnRCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDSixDQUVaLEVBQ0EsQ0FBQ0UsV0FBVyxpQkFDWEUsS0FBQSxDQUFBQyxhQUFBLENBQUFELEtBQUEsQ0FBQVcsUUFBQSxxQkFDRVgsS0FBQSxDQUFBQyxhQUFBLENBQUNWLG1FQUFVO0lBQUNxQixPQUFPLEVBQUM7RUFBSSxHQUFFaEIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQWMsZUFDaEVJLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVixtRUFBVTtJQUFDcUIsT0FBTyxFQUFDO0VBQU8sR0FDeEJoQixDQUFDLENBQ0EsdUZBQXVGLENBQ3hGLENBQ1UsZUFDYkksS0FBQSxDQUFBQyxhQUFBLENBQUNaLCtEQUFNO0lBQ0x3QixLQUFLLEVBQUMsU0FBUztJQUNmQyxJQUFJLEVBQUMsT0FBTztJQUNaRSxPQUFPLEVBQUUsTUFBQUEsQ0FBQSxLQUFZO01BQ25CLElBQUk7UUFDRixNQUFNbkIsa0JBQWtCLEVBQUU7UUFDMUJFLGNBQWMsQ0FBQyxJQUFJLENBQUM7TUFDdEIsQ0FBQyxDQUFDLE1BQU07UUFDTkEsY0FBYyxDQUFDLEtBQUssQ0FBQztNQUN2QjtJQUNGLENBQUU7SUFDRkksRUFBRSxFQUFFO01BQUVZLEVBQUUsRUFBRTtJQUFFO0VBQUUsR0FFYm5CLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FDUixDQUVaLENBQ0ssQ0FDQTtBQUVkLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0xlZGdlci9MZWRnZXJUcm91Ymxlc2hvb3RpbmcudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBCdXR0b24sIFN0YWNrLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vT3ZlcmxheSc7XG5pbXBvcnQgeyB1c2VMZWRnZXJDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9MZWRnZXJQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGNvbnN0IExlZGdlclRyb3VibGVzaG9vdGluZyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IHBvcERldmljZVNlbGVjdGlvbiB9ID0gdXNlTGVkZ2VyQ29udGV4dCgpO1xuXG4gIGNvbnN0IFtpc0Nvbm5lY3RlZCwgc2V0SXNDb25uZWN0ZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHJldHVybiAoXG4gICAgPE92ZXJsYXkgaXNCYWNrZ3JvdW5kRmlsbGVkPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6IDM3NSxcbiAgICAgICAgICBwOiAzLFxuICAgICAgICAgIGdhcDogMixcbiAgICAgICAgICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2dyZXkuOTAwJyxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDEsXG4gICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge2lzQ29ubmVjdGVkICYmIChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+XG4gICAgICAgICAgICAgIHt0KCdTdWNjZXNzZnVsbHkgcmVjb25uZWN0ZWQhJyl9XG4gICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgIHN4PXt7IG10OiAzIH19XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3dpbmRvdy5jbG9zZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ0Nsb3NlJyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cbiAgICAgICAgeyFpc0Nvbm5lY3RlZCAmJiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNVwiPnt0KCdMZWRnZXIgRGlzY29ubmVjdGVkJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XG4gICAgICAgICAgICAgIHt0KFxuICAgICAgICAgICAgICAgICdDb3JlIGlzIG5vIGxvbmdlciBjb25uZWN0ZWQgdG8geW91ciBMZWRnZXIgZGV2aWNlLiBSZWNvbm5lY3QgeW91ciBMZWRnZXIgdG8gY29udGludWUuJyxcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgY29sb3I9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgICAgb25DbGljaz17YXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBhd2FpdCBwb3BEZXZpY2VTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgIHNldElzQ29ubmVjdGVkKHRydWUpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgc2V0SXNDb25uZWN0ZWQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgc3g9e3sgbXQ6IDMgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ1JlY29ubmVjdCcpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC8+XG4gICAgICAgICl9XG4gICAgICA8L1N0YWNrPlxuICAgIDwvT3ZlcmxheT5cbiAgKTtcbn07XG4iXSwibmFtZXMiOlsidXNlVHJhbnNsYXRpb24iLCJCdXR0b24iLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJPdmVybGF5IiwidXNlTGVkZ2VyQ29udGV4dCIsInVzZVN0YXRlIiwiTGVkZ2VyVHJvdWJsZXNob290aW5nIiwidCIsInBvcERldmljZVNlbGVjdGlvbiIsImlzQ29ubmVjdGVkIiwic2V0SXNDb25uZWN0ZWQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJpc0JhY2tncm91bmRGaWxsZWQiLCJzeCIsIndpZHRoIiwicCIsImdhcCIsImFsaWduU2VsZiIsImJhY2tncm91bmRDb2xvciIsImJvcmRlclJhZGl1cyIsInRleHRBbGlnbiIsIkZyYWdtZW50IiwidmFyaWFudCIsImNvbG9yIiwic2l6ZSIsIm10Iiwib25DbGljayIsIndpbmRvdyIsImNsb3NlIl0sInNvdXJjZVJvb3QiOiIifQ==