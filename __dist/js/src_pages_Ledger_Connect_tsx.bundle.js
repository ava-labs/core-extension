"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Ledger_Connect_tsx"],{

/***/ "./src/components/common/StyledNumberList.tsx":
/*!****************************************************!*\
  !*** ./src/components/common/StyledNumberList.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StyledNumberList": () => (/* binding */ StyledNumberList)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");

const StyledNumberList = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography)`
  ${({
  theme
}) => ({
  ...theme.typography.body1,
  display: 'block',
  backgroundColor: theme.palette.background.paper,
  lineHeight: theme.spacing(3),
  height: theme.spacing(3),
  width: theme.spacing(3),
  borderRadius: '50%',
  textAlign: 'center',
  marginRight: theme.spacing(2),
  flexShrink: 0
})}
`;

/***/ }),

/***/ "./src/pages/Ledger/Connect.tsx":
/*!**************************************!*\
  !*** ./src/pages/Ledger/Connect.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerConnect": () => (/* binding */ LedgerConnect)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/components/common/StyledNumberList */ "./src/components/common/StyledNumberList.tsx");
/* harmony import */ var _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/LedgerProvider */ "./src/contexts/LedgerProvider.tsx");
/* harmony import */ var _src_components_common_ConnectionIndicatorK2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/ConnectionIndicatorK2 */ "./src/components/common/ConnectionIndicatorK2.tsx");
/* harmony import */ var _hooks_useAppTypeFromParams__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hooks/useAppTypeFromParams */ "./src/pages/Ledger/hooks/useAppTypeFromParams.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







function LedgerConnect() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const {
    hasLedgerTransport,
    appType,
    popDeviceSelection
  } = (0,_src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_2__.useLedgerContext)();
  const requiredAppType = (0,_hooks_useAppTypeFromParams__WEBPACK_IMPORTED_MODULE_4__.useAppTypeFromParams)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    popDeviceSelection();
    // Do this exactly once, all retries should be initiated by the user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const connectedWithCorrectApp = hasLedgerTransport && appType === requiredAppType;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      height: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "h4"
  }, t('Ledger Status')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Card, {
    sx: {
      my: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.CardContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      width: 1,
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, null, t('Status')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_ConnectionIndicatorK2__WEBPACK_IMPORTED_MODULE_3__.ConnectionIndicatorK2, {
    connected: hasLedgerTransport,
    size: 8
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      ml: 1
    },
    color: "text.secondary"
  }, hasLedgerTransport ? t('Connected') : t('Disconnected')))), hasLedgerTransport && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    sx: {
      width: 1,
      mt: 2,
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, null, t('Application')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      ml: 1
    },
    color: "text.secondary"
  }, appType))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Card, {
    sx: {
      mt: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.CardContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, null, connectedWithCorrectApp ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      fontWeight: 'fontWeightSemibold',
      mb: 2,
      py: 1
    }
  }, t('To Continue:')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row"
  }, /*#__PURE__*/React.createElement(_src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_1__.StyledNumberList, null, t('1.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      mb: 3
    }
  }, t('Click close below.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row"
  }, /*#__PURE__*/React.createElement(_src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_1__.StyledNumberList, null, t('2.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      mb: 3
    }
  }, t('Open Core in your browser.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row"
  }, /*#__PURE__*/React.createElement(_src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_1__.StyledNumberList, null, t('3.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, null, t('Reenter the transaction details and try again.')))) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      width: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      fontWeight: 'fontWeightSemibold',
      mb: 2,
      py: 1
    }
  }, t('To Connect:')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row"
  }, /*#__PURE__*/React.createElement(_src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_1__.StyledNumberList, null, t('1.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      mb: 3
    }
  }, t('Connect the Ledger device to your computer.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row"
  }, /*#__PURE__*/React.createElement(_src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_1__.StyledNumberList, null, t('2.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      mb: 3
    }
  }, t('Enter your PIN and access your device.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row"
  }, /*#__PURE__*/React.createElement(_src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_1__.StyledNumberList, null, t('3.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, null, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_7__.Trans, {
    i18nKey: "Ensure you have installed the latest <typography>{{requiredAppType}} App</typography> and open it on your device.",
    values: {
      requiredAppType: requiredAppType
    },
    components: {
      typography: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
        component: "span",
        sx: {
          fontWeight: 'fontWeightSemibold'
        }
      })
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      mt: 3,
      py: 1
    }
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_7__.Trans, {
    i18nKey: 'If you do not have the <typography>{{requiredAppType}} App</typography> on your Ledger, please add it through the Ledger Live app manager.',
    values: {
      requiredAppType: requiredAppType
    },
    components: {
      typography: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
        component: "span",
        sx: {
          fontWeight: 'fontWeightSemibold'
        }
      })
    }
  })))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexGrow: 1,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    size: "large",
    fullWidth: true,
    onClick: () => {
      if (connectedWithCorrectApp) {
        window.close();
      } else {
        popDeviceSelection();
      }
    }
  }, connectedWithCorrectApp ? t('Close') : t('Retry'))));
}

/***/ }),

/***/ "./src/pages/Ledger/hooks/useAppTypeFromParams.ts":
/*!********************************************************!*\
  !*** ./src/pages/Ledger/hooks/useAppTypeFromParams.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useAppTypeFromParams": () => (/* binding */ useAppTypeFromParams)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var xss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xss */ "./node_modules/xss/lib/index.js");
/* harmony import */ var xss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xss__WEBPACK_IMPORTED_MODULE_1__);



const useAppTypeFromParams = () => {
  const {
    search
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const {
      app
    } = Object.fromEntries(new URLSearchParams(search).entries());
    return xss__WEBPACK_IMPORTED_MODULE_1___default()(app);
  }, [search]);
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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dkQsTUFBTTtJQUFFcUM7RUFBTyxDQUFDLEdBQUdGLDZEQUFXLEVBQUU7RUFFaEMsT0FBT0QsOENBQU8sQ0FBQyxNQUFNO0lBQ25CLE1BQU07TUFBRUk7SUFBSSxDQUFDLEdBQUlDLE1BQU0sQ0FBU0MsV0FBVyxDQUN4QyxJQUFJQyxlQUFlLENBQUNKLE1BQU0sQ0FBQyxDQUFTSyxPQUFPLEVBQUUsQ0FDL0M7SUFDRCxPQUFPTiwwQ0FBRyxDQUFDRSxHQUFHLENBQUM7RUFDakIsQ0FBQyxFQUFFLENBQUNELE1BQU0sQ0FBQyxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vU3R5bGVkTnVtYmVyTGlzdC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9MZWRnZXIvQ29ubmVjdC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9MZWRnZXIvaG9va3MvdXNlQXBwVHlwZUZyb21QYXJhbXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3R5bGVkLCBUeXBvZ3JhcGh5IH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IFN0eWxlZE51bWJlckxpc3QgPSBzdHlsZWQoVHlwb2dyYXBoeSlgXG4gICR7KHsgdGhlbWUgfSkgPT4gKHtcbiAgICAuLi50aGVtZS50eXBvZ3JhcGh5LmJvZHkxLFxuICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmJhY2tncm91bmQucGFwZXIsXG4gICAgbGluZUhlaWdodDogdGhlbWUuc3BhY2luZygzKSxcbiAgICBoZWlnaHQ6IHRoZW1lLnNwYWNpbmcoMyksXG4gICAgd2lkdGg6IHRoZW1lLnNwYWNpbmcoMyksXG4gICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIG1hcmdpblJpZ2h0OiB0aGVtZS5zcGFjaW5nKDIpLFxuICAgIGZsZXhTaHJpbms6IDAsXG4gIH0pfVxuYDtcbiIsImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFRyYW5zLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDYXJkLFxuICBDYXJkQ29udGVudCxcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IFN0eWxlZE51bWJlckxpc3QgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1N0eWxlZE51bWJlckxpc3QnO1xuaW1wb3J0IHsgdXNlTGVkZ2VyQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTGVkZ2VyUHJvdmlkZXInO1xuaW1wb3J0IHsgQ29ubmVjdGlvbkluZGljYXRvcksyIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9Db25uZWN0aW9uSW5kaWNhdG9ySzInO1xuXG5pbXBvcnQgeyB1c2VBcHBUeXBlRnJvbVBhcmFtcyB9IGZyb20gJy4vaG9va3MvdXNlQXBwVHlwZUZyb21QYXJhbXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gTGVkZ2VyQ29ubmVjdCgpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGhhc0xlZGdlclRyYW5zcG9ydCwgYXBwVHlwZSwgcG9wRGV2aWNlU2VsZWN0aW9uIH0gPVxuICAgIHVzZUxlZGdlckNvbnRleHQoKTtcbiAgY29uc3QgcmVxdWlyZWRBcHBUeXBlID0gdXNlQXBwVHlwZUZyb21QYXJhbXMoKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHBvcERldmljZVNlbGVjdGlvbigpO1xuICAgIC8vIERvIHRoaXMgZXhhY3RseSBvbmNlLCBhbGwgcmV0cmllcyBzaG91bGQgYmUgaW5pdGlhdGVkIGJ5IHRoZSB1c2VyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbXSk7XG5cbiAgY29uc3QgY29ubmVjdGVkV2l0aENvcnJlY3RBcHAgPVxuICAgIGhhc0xlZGdlclRyYW5zcG9ydCAmJiBhcHBUeXBlID09PSByZXF1aXJlZEFwcFR5cGU7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgaGVpZ2h0OiAxLCBweDogMiB9fT5cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiPnt0KCdMZWRnZXIgU3RhdHVzJyl9PC9UeXBvZ3JhcGh5PlxuXG4gICAgICA8Q2FyZCBzeD17eyBteTogMSB9fT5cbiAgICAgICAgPENhcmRDb250ZW50PlxuICAgICAgICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICBkaXJlY3Rpb249XCJyb3dcIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5Pnt0KCdTdGF0dXMnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIiBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgICAgICA8Q29ubmVjdGlvbkluZGljYXRvcksyXG4gICAgICAgICAgICAgICAgICBjb25uZWN0ZWQ9e2hhc0xlZGdlclRyYW5zcG9ydH1cbiAgICAgICAgICAgICAgICAgIHNpemU9ezh9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtbDogMSB9fSBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICB7aGFzTGVkZ2VyVHJhbnNwb3J0ID8gdCgnQ29ubmVjdGVkJykgOiB0KCdEaXNjb25uZWN0ZWQnKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAge2hhc0xlZGdlclRyYW5zcG9ydCAmJiAoXG4gICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgbXQ6IDIsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5Pnt0KCdBcHBsaWNhdGlvbicpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtbDogMSB9fSBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICB7YXBwVHlwZX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG4gICAgICA8Q2FyZCBzeD17eyBtdDogMyB9fT5cbiAgICAgICAgPENhcmRDb250ZW50PlxuICAgICAgICAgIDxTdGFjaz5cbiAgICAgICAgICAgIHtjb25uZWN0ZWRXaXRoQ29ycmVjdEFwcCA/IChcbiAgICAgICAgICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxIH19PlxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJywgbWI6IDIsIHB5OiAxIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3QoJ1RvIENvbnRpbnVlOicpfVxuICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICA8U3R5bGVkTnVtYmVyTGlzdD57dCgnMS4nKX08L1N0eWxlZE51bWJlckxpc3Q+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtYjogMyB9fT5cbiAgICAgICAgICAgICAgICAgICAge3QoJ0NsaWNrIGNsb3NlIGJlbG93LicpfVxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICA8U3R5bGVkTnVtYmVyTGlzdD57dCgnMi4nKX08L1N0eWxlZE51bWJlckxpc3Q+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtYjogMyB9fT5cbiAgICAgICAgICAgICAgICAgICAge3QoJ09wZW4gQ29yZSBpbiB5b3VyIGJyb3dzZXIuJyl9XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgIDxTdHlsZWROdW1iZXJMaXN0Pnt0KCczLicpfTwvU3R5bGVkTnVtYmVyTGlzdD5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICB7dCgnUmVlbnRlciB0aGUgdHJhbnNhY3Rpb24gZGV0YWlscyBhbmQgdHJ5IGFnYWluLicpfVxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEgfX0+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgIHN4PXt7IGZvbnRXZWlnaHQ6ICdmb250V2VpZ2h0U2VtaWJvbGQnLCBtYjogMiwgcHk6IDEgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dCgnVG8gQ29ubmVjdDonKX1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgPFN0eWxlZE51bWJlckxpc3Q+e3QoJzEuJyl9PC9TdHlsZWROdW1iZXJMaXN0PlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgc3g9e3sgbWI6IDMgfX0+XG4gICAgICAgICAgICAgICAgICAgIHt0KCdDb25uZWN0IHRoZSBMZWRnZXIgZGV2aWNlIHRvIHlvdXIgY29tcHV0ZXIuJyl9XG4gICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICAgICAgICAgIDxTdGFjayBkaXJlY3Rpb249XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgIDxTdHlsZWROdW1iZXJMaXN0Pnt0KCcyLicpfTwvU3R5bGVkTnVtYmVyTGlzdD5cbiAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHN4PXt7IG1iOiAzIH19PlxuICAgICAgICAgICAgICAgICAgICB7dCgnRW50ZXIgeW91ciBQSU4gYW5kIGFjY2VzcyB5b3VyIGRldmljZS4nKX1cbiAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgICAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgPFN0eWxlZE51bWJlckxpc3Q+e3QoJzMuJyl9PC9TdHlsZWROdW1iZXJMaXN0PlxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgIDxUcmFuc1xuICAgICAgICAgICAgICAgICAgICAgIGkxOG5LZXk9XCJFbnN1cmUgeW91IGhhdmUgaW5zdGFsbGVkIHRoZSBsYXRlc3QgPHR5cG9ncmFwaHk+e3tyZXF1aXJlZEFwcFR5cGV9fSBBcHA8L3R5cG9ncmFwaHk+IGFuZCBvcGVuIGl0IG9uIHlvdXIgZGV2aWNlLlwiXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZEFwcFR5cGU6IHJlcXVpcmVkQXBwVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cG9ncmFwaHk6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ9XCJzcGFuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgIDwvU3RhY2s+XG5cbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtdDogMywgcHk6IDEgfX0+XG4gICAgICAgICAgICAgICAgICA8VHJhbnNcbiAgICAgICAgICAgICAgICAgICAgaTE4bktleT17XG4gICAgICAgICAgICAgICAgICAgICAgJ0lmIHlvdSBkbyBub3QgaGF2ZSB0aGUgPHR5cG9ncmFwaHk+e3tyZXF1aXJlZEFwcFR5cGV9fSBBcHA8L3R5cG9ncmFwaHk+IG9uIHlvdXIgTGVkZ2VyLCBwbGVhc2UgYWRkIGl0IHRocm91Z2ggdGhlIExlZGdlciBMaXZlIGFwcCBtYW5hZ2VyLidcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9e3tcbiAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZEFwcFR5cGU6IHJlcXVpcmVkQXBwVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgICAgICAgICAgICAgIHR5cG9ncmFwaHk6IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudD1cInNwYW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiAnZm9udFdlaWdodFNlbWlib2xkJyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgICA8L0NhcmQ+XG4gICAgICA8U3RhY2sgc3g9e3sgZmxleEdyb3c6IDEsIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnIH19PlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29ubmVjdGVkV2l0aENvcnJlY3RBcHApIHtcbiAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwb3BEZXZpY2VTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge2Nvbm5lY3RlZFdpdGhDb3JyZWN0QXBwID8gdCgnQ2xvc2UnKSA6IHQoJ1JldHJ5Jyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgTGVkZ2VyQXBwVHlwZSB9IGZyb20gJ0BzcmMvY29udGV4dHMvTGVkZ2VyUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeHNzIGZyb20gJ3hzcyc7XG5cbmV4cG9ydCBjb25zdCB1c2VBcHBUeXBlRnJvbVBhcmFtcyA9ICgpOiBMZWRnZXJBcHBUeXBlID0+IHtcbiAgY29uc3QgeyBzZWFyY2ggfSA9IHVzZUxvY2F0aW9uKCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHsgYXBwIH0gPSAoT2JqZWN0IGFzIGFueSkuZnJvbUVudHJpZXMoXG4gICAgICAobmV3IFVSTFNlYXJjaFBhcmFtcyhzZWFyY2gpIGFzIGFueSkuZW50cmllcygpLFxuICAgICk7XG4gICAgcmV0dXJuIHhzcyhhcHApIGFzIExlZGdlckFwcFR5cGU7XG4gIH0sIFtzZWFyY2hdKTtcbn07XG4iXSwibmFtZXMiOlsic3R5bGVkIiwiVHlwb2dyYXBoeSIsIlN0eWxlZE51bWJlckxpc3QiLCJ0aGVtZSIsInR5cG9ncmFwaHkiLCJib2R5MSIsImRpc3BsYXkiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwYWxldHRlIiwiYmFja2dyb3VuZCIsInBhcGVyIiwibGluZUhlaWdodCIsInNwYWNpbmciLCJoZWlnaHQiLCJ3aWR0aCIsImJvcmRlclJhZGl1cyIsInRleHRBbGlnbiIsIm1hcmdpblJpZ2h0IiwiZmxleFNocmluayIsInVzZUVmZmVjdCIsIlRyYW5zIiwidXNlVHJhbnNsYXRpb24iLCJCdXR0b24iLCJDYXJkIiwiQ2FyZENvbnRlbnQiLCJTdGFjayIsInVzZUxlZGdlckNvbnRleHQiLCJDb25uZWN0aW9uSW5kaWNhdG9ySzIiLCJ1c2VBcHBUeXBlRnJvbVBhcmFtcyIsIkxlZGdlckNvbm5lY3QiLCJ0IiwiaGFzTGVkZ2VyVHJhbnNwb3J0IiwiYXBwVHlwZSIsInBvcERldmljZVNlbGVjdGlvbiIsInJlcXVpcmVkQXBwVHlwZSIsImNvbm5lY3RlZFdpdGhDb3JyZWN0QXBwIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3giLCJweCIsInZhcmlhbnQiLCJteSIsImZsZXhHcm93IiwiZGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiY29ubmVjdGVkIiwic2l6ZSIsIm1sIiwiY29sb3IiLCJtdCIsImZvbnRXZWlnaHQiLCJtYiIsInB5IiwiaTE4bktleSIsInZhbHVlcyIsImNvbXBvbmVudHMiLCJjb21wb25lbnQiLCJmdWxsV2lkdGgiLCJvbkNsaWNrIiwid2luZG93IiwiY2xvc2UiLCJ1c2VNZW1vIiwidXNlTG9jYXRpb24iLCJ4c3MiLCJzZWFyY2giLCJhcHAiLCJPYmplY3QiLCJmcm9tRW50cmllcyIsIlVSTFNlYXJjaFBhcmFtcyIsImVudHJpZXMiXSwic291cmNlUm9vdCI6IiJ9