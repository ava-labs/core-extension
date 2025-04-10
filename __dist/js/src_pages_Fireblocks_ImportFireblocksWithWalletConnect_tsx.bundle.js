"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Fireblocks_ImportFireblocksWithWalletConnect_tsx"],{

/***/ "./src/pages/Fireblocks/ImportFireblocksWithWalletConnect.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/Fireblocks/ImportFireblocksWithWalletConnect.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImportFireblocksWithWalletConnect)
/* harmony export */ });
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ImportWithWalletConnect_ImportWithWalletConnect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ImportWithWalletConnect/ImportWithWalletConnect */ "./src/pages/ImportWithWalletConnect/ImportWithWalletConnect.tsx");
/* harmony import */ var _components_FireblocksAvatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/FireblocksAvatar */ "./src/pages/Fireblocks/components/FireblocksAvatar.tsx");
/* harmony import */ var _components_FireblocksBitcoinDialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/FireblocksBitcoinDialog */ "./src/pages/Fireblocks/components/FireblocksBitcoinDialog.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function ImportFireblocksWithWalletConnect() {
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_0__.useAnalyticsContext)();
  const [isBtcDialogVisible, setIsBtcDialogVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [importedAccountId, setImportedAccountId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const onSuccessfullConnection = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(({
    accountId
  }) => {
    capture('ImportWithFireblocks_Success_EVM');
    setImportedAccountId(accountId);
    setIsBtcDialogVisible(true);
  }, [capture]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_ImportWithWalletConnect_ImportWithWalletConnect__WEBPACK_IMPORTED_MODULE_2__["default"], {
    onConnect: onSuccessfullConnection,
    appIcon: /*#__PURE__*/React.createElement(_components_FireblocksAvatar__WEBPACK_IMPORTED_MODULE_3__.FireblocksAvatar, null)
  }), isBtcDialogVisible && /*#__PURE__*/React.createElement(_components_FireblocksBitcoinDialog__WEBPACK_IMPORTED_MODULE_4__.FireblocksBitcoinDialog, {
    accountId: importedAccountId
  }));
}

/***/ }),

/***/ "./src/pages/Fireblocks/components/FireblocksAvatar.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/Fireblocks/components/FireblocksAvatar.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FireblocksAvatar": () => (/* binding */ FireblocksAvatar)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

const FireblocksAvatar = ({
  badgeIcon = 'walletConnect'
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Badge, {
  overlap: "circular",
  badgeContent: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Avatar, {
    sx: {
      width: '24px',
      height: '24px',
      backgroundColor: badgeIcon === 'walletConnect' ? 'info.dark' : 'transparent',
      border: '1px solid',
      borderColor: 'background.paper'
    }
  }, badgeIcon === 'walletConnect' && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.WalletConnectIcon, {
    size: 16
  }), badgeIcon === 'bitcoin' && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.BitcoinColorIcon, {
    size: 24
  })),
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.Avatar, {
  sx: {
    width: '64px',
    height: '64px',
    background: 'transparent',
    border: '1px solid',
    borderColor: 'primary.main'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__.FireblocksIcon, {
  size: 32
})));

/***/ }),

/***/ "./src/pages/Fireblocks/components/FireblocksBitcoinDialog.tsx":
/*!*********************************************************************!*\
  !*** ./src/pages/Fireblocks/components/FireblocksBitcoinDialog.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FireblocksBitcoinDialog": () => (/* binding */ FireblocksBitcoinDialog)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




const FireblocksBitcoinDialog = ({
  accountId
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_0__.useAnalyticsContext)();
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useHistory)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Dialog, {
    open: true
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.DialogTitle, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "h5"
  }, t('Connect Bitcoin Wallet?'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.DialogContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, null, t('Core supports Bitcoin via Fireblocks with a few extra steps. If you choose to skip, you will not be able to bridge or use the Bitcoin Network.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.DialogActions, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    onClick: () => {
      capture('ImportWithFireblocks_BTC_Started');
      history.push(`/fireblocks/connect-bitcoin/${accountId}`);
    },
    variant: "contained",
    size: "large"
  }, t('Next')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    onClick: () => {
      capture('ImportWithFireblocks_BTC_Skipped');
      _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"].success(t('New Account Added!'), {
        duration: 2000
      });
      history.push('/accounts');
    },
    variant: "text"
  }, t('Skip'))));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0ZpcmVibG9ja3NfSW1wb3J0RmlyZWJsb2Nrc1dpdGhXYWxsZXRDb25uZWN0X3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFzRTtBQUN4QjtBQUcyQztBQUV4QjtBQUNjO0FBRWhFLFNBQVNNLGlDQUFpQ0EsQ0FBQSxFQUFHO0VBQzFELE1BQU07SUFBRUM7RUFBUSxDQUFDLEdBQUdQLG9GQUFtQixFQUFFO0VBQ3pDLE1BQU0sQ0FBQ1Esa0JBQWtCLEVBQUVDLHFCQUFxQixDQUFDLEdBQUdQLCtDQUFRLENBQUMsS0FBSyxDQUFDO0VBQ25FLE1BQU0sQ0FBQ1EsaUJBQWlCLEVBQUVDLG9CQUFvQixDQUFDLEdBQUdULCtDQUFRLENBQUMsRUFBRSxDQUFDO0VBRTlELE1BQU1VLHVCQUEwQyxHQUFHWCxrREFBVyxDQUM1RCxDQUFDO0lBQUVZO0VBQVUsQ0FBQyxLQUFLO0lBQ2pCTixPQUFPLENBQUMsa0NBQWtDLENBQUM7SUFDM0NJLG9CQUFvQixDQUFDRSxTQUFTLENBQUM7SUFDL0JKLHFCQUFxQixDQUFDLElBQUksQ0FBQztFQUM3QixDQUFDLEVBQ0QsQ0FBQ0YsT0FBTyxDQUFDLENBQ1Y7RUFFRCxvQkFDRU8sS0FBQSxDQUFBQyxhQUFBLENBQUFELEtBQUEsQ0FBQUUsUUFBQSxxQkFDRUYsS0FBQSxDQUFBQyxhQUFBLENBQUNaLHdGQUF1QjtJQUN0QmMsU0FBUyxFQUFFTCx1QkFBd0I7SUFDbkNNLE9BQU8sZUFBRUosS0FBQSxDQUFBQyxhQUFBLENBQUNYLDBFQUFnQjtFQUFJLEVBQzlCLEVBQ0RJLGtCQUFrQixpQkFDakJNLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVix3RkFBdUI7SUFBQ1EsU0FBUyxFQUFFSDtFQUFrQixFQUN2RCxDQUNBO0FBRVA7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QnFDO0FBTTlCLE1BQU1OLGdCQUFnQixHQUFHQSxDQUFDO0VBQy9Cb0IsU0FBUyxHQUFHO0FBQ1MsQ0FBQyxrQkFDdEJWLEtB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Q0FDVDtBQUViLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0ZpcmVibG9ja3MvSW1wb3J0RmlyZWJsb2Nrc1dpdGhXYWxsZXRDb25uZWN0LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0ZpcmVibG9ja3MvY29tcG9uZW50cy9GaXJlYmxvY2tzQXZhdGFyLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0ZpcmVibG9ja3MvY29tcG9uZW50cy9GaXJlYmxvY2tzQml0Y29pbkRpYWxvZy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBPbkNvbm5lY3RDYWxsYmFjayB9IGZyb20gJy4uLy4uL2NvbnRleHRzL1dhbGxldENvbm5lY3RDb250ZXh0UHJvdmlkZXIvbW9kZWxzJztcbmltcG9ydCBJbXBvcnRXaXRoV2FsbGV0Q29ubmVjdCBmcm9tICcuLi9JbXBvcnRXaXRoV2FsbGV0Q29ubmVjdC9JbXBvcnRXaXRoV2FsbGV0Q29ubmVjdCc7XG5cbmltcG9ydCB7IEZpcmVibG9ja3NBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvRmlyZWJsb2Nrc0F2YXRhcic7XG5pbXBvcnQgeyBGaXJlYmxvY2tzQml0Y29pbkRpYWxvZyB9IGZyb20gJy4vY29tcG9uZW50cy9GaXJlYmxvY2tzQml0Y29pbkRpYWxvZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEltcG9ydEZpcmVibG9ja3NXaXRoV2FsbGV0Q29ubmVjdCgpIHtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IFtpc0J0Y0RpYWxvZ1Zpc2libGUsIHNldElzQnRjRGlhbG9nVmlzaWJsZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpbXBvcnRlZEFjY291bnRJZCwgc2V0SW1wb3J0ZWRBY2NvdW50SWRdID0gdXNlU3RhdGUoJycpO1xuXG4gIGNvbnN0IG9uU3VjY2Vzc2Z1bGxDb25uZWN0aW9uOiBPbkNvbm5lY3RDYWxsYmFjayA9IHVzZUNhbGxiYWNrKFxuICAgICh7IGFjY291bnRJZCB9KSA9PiB7XG4gICAgICBjYXB0dXJlKCdJbXBvcnRXaXRoRmlyZWJsb2Nrc19TdWNjZXNzX0VWTScpO1xuICAgICAgc2V0SW1wb3J0ZWRBY2NvdW50SWQoYWNjb3VudElkKTtcbiAgICAgIHNldElzQnRjRGlhbG9nVmlzaWJsZSh0cnVlKTtcbiAgICB9LFxuICAgIFtjYXB0dXJlXSxcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8SW1wb3J0V2l0aFdhbGxldENvbm5lY3RcbiAgICAgICAgb25Db25uZWN0PXtvblN1Y2Nlc3NmdWxsQ29ubmVjdGlvbn1cbiAgICAgICAgYXBwSWNvbj17PEZpcmVibG9ja3NBdmF0YXIgLz59XG4gICAgICAvPlxuICAgICAge2lzQnRjRGlhbG9nVmlzaWJsZSAmJiAoXG4gICAgICAgIDxGaXJlYmxvY2tzQml0Y29pbkRpYWxvZyBhY2NvdW50SWQ9e2ltcG9ydGVkQWNjb3VudElkfSAvPlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEF2YXRhcixcbiAgQmFkZ2UsXG4gIEJpdGNvaW5Db2xvckljb24sXG4gIEZpcmVibG9ja3NJY29uLFxuICBXYWxsZXRDb25uZWN0SWNvbixcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW50ZXJmYWNlIEZpcmVibG9ja3NBdmF0YXJQcm9wcyB7XG4gIGJhZGdlSWNvbj86ICd3YWxsZXRDb25uZWN0JyB8ICdiaXRjb2luJztcbn1cblxuZXhwb3J0IGNvbnN0IEZpcmVibG9ja3NBdmF0YXIgPSAoe1xuICBiYWRnZUljb24gPSAnd2FsbGV0Q29ubmVjdCcsXG59OiBGaXJlYmxvY2tzQXZhdGFyUHJvcHMpID0+IChcbiAgPEJhZGdlXG4gICAgb3ZlcmxhcD1cImNpcmN1bGFyXCJcbiAgICBiYWRnZUNvbnRlbnQ9e1xuICAgICAgPEF2YXRhclxuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAnMjRweCcsXG4gICAgICAgICAgaGVpZ2h0OiAnMjRweCcsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOlxuICAgICAgICAgICAgYmFkZ2VJY29uID09PSAnd2FsbGV0Q29ubmVjdCcgPyAnaW5mby5kYXJrJyA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkJyxcbiAgICAgICAgICBib3JkZXJDb2xvcjogJ2JhY2tncm91bmQucGFwZXInLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7YmFkZ2VJY29uID09PSAnd2FsbGV0Q29ubmVjdCcgJiYgPFdhbGxldENvbm5lY3RJY29uIHNpemU9ezE2fSAvPn1cbiAgICAgICAge2JhZGdlSWNvbiA9PT0gJ2JpdGNvaW4nICYmIDxCaXRjb2luQ29sb3JJY29uIHNpemU9ezI0fSAvPn1cbiAgICAgIDwvQXZhdGFyPlxuICAgIH1cbiAgICBhbmNob3JPcmlnaW49e3tcbiAgICAgIHZlcnRpY2FsOiAnYm90dG9tJyxcbiAgICAgIGhvcml6b250YWw6ICdyaWdodCcsXG4gICAgfX1cbiAgPlxuICAgIDxBdmF0YXJcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiAnNjRweCcsXG4gICAgICAgIGhlaWdodDogJzY0cHgnLFxuICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBib3JkZXI6ICcxcHggc29saWQnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ3ByaW1hcnkubWFpbicsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxGaXJlYmxvY2tzSWNvbiBzaXplPXszMn0gLz5cbiAgICA8L0F2YXRhcj5cbiAgPC9CYWRnZT5cbik7XG4iLCJpbXBvcnQge1xuICBEaWFsb2csXG4gIERpYWxvZ1RpdGxlLFxuICBUeXBvZ3JhcGh5LFxuICBEaWFsb2dBY3Rpb25zLFxuICBCdXR0b24sXG4gIERpYWxvZ0NvbnRlbnQsXG4gIHRvYXN0LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlQW5hbHl0aWNzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQW5hbHl0aWNzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7IHVzZUhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcblxudHlwZSBGaXJlYmxvY2tzQml0Y29pbkRpYWxvZ1Byb3BzID0ge1xuICBhY2NvdW50SWQ6IHN0cmluZztcbn07XG5cbmV4cG9ydCBjb25zdCBGaXJlYmxvY2tzQml0Y29pbkRpYWxvZyA9ICh7XG4gIGFjY291bnRJZCxcbn06IEZpcmVibG9ja3NCaXRjb2luRGlhbG9nUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGNhcHR1cmUgfSA9IHVzZUFuYWx5dGljc0NvbnRleHQoKTtcbiAgY29uc3QgaGlzdG9yeSA9IHVzZUhpc3RvcnkoKTtcblxuICByZXR1cm4gKFxuICAgIDxEaWFsb2cgb3Blbj5cbiAgICAgIDxEaWFsb2dUaXRsZT5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+e3QoJ0Nvbm5lY3QgQml0Y29pbiBXYWxsZXQ/Jyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgPC9EaWFsb2dUaXRsZT5cbiAgICAgIDxEaWFsb2dDb250ZW50PlxuICAgICAgICA8VHlwb2dyYXBoeT5cbiAgICAgICAgICB7dChcbiAgICAgICAgICAgICdDb3JlIHN1cHBvcnRzIEJpdGNvaW4gdmlhIEZpcmVibG9ja3Mgd2l0aCBhIGZldyBleHRyYSBzdGVwcy4gSWYgeW91IGNob29zZSB0byBza2lwLCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBicmlkZ2Ugb3IgdXNlIHRoZSBCaXRjb2luIE5ldHdvcmsuJyxcbiAgICAgICAgICApfVxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L0RpYWxvZ0NvbnRlbnQ+XG4gICAgICA8RGlhbG9nQWN0aW9ucz5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGNhcHR1cmUoJ0ltcG9ydFdpdGhGaXJlYmxvY2tzX0JUQ19TdGFydGVkJyk7XG4gICAgICAgICAgICBoaXN0b3J5LnB1c2goYC9maXJlYmxvY2tzL2Nvbm5lY3QtYml0Y29pbi8ke2FjY291bnRJZH1gKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHZhcmlhbnQ9XCJjb250YWluZWRcIlxuICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgID5cbiAgICAgICAgICB7dCgnTmV4dCcpfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIGNhcHR1cmUoJ0ltcG9ydFdpdGhGaXJlYmxvY2tzX0JUQ19Ta2lwcGVkJyk7XG4gICAgICAgICAgICB0b2FzdC5zdWNjZXNzKHQoJ05ldyBBY2NvdW50IEFkZGVkIScpLCB7IGR1cmF0aW9uOiAyMDAwIH0pO1xuICAgICAgICAgICAgaGlzdG9yeS5wdXNoKCcvYWNjb3VudHMnKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdTa2lwJyl9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9EaWFsb2dBY3Rpb25zPlxuICAgIDwvRGlhbG9nPlxuICApO1xufTtcbiJdLCJuYW1lcyI6WyJ1c2VBbmFseXRpY3NDb250ZXh0IiwidXNlQ2FsbGJhY2siLCJ1c2VTdGF0ZSIsIkltcG9ydFdpdGhXYWxsZXRDb25uZWN0IiwiRmlyZWJsb2Nrc0F2YXRhciIsIkZpcmVibG9ja3NCaXRjb2luRGlhbG9nIiwiSW1wb3J0RmlyZWJsb2Nrc1dpdGhXYWxsZXRDb25uZWN0IiwiY2FwdHVyZSIsImlzQnRjRGlhbG9nVmlzaWJsZSIsInNldElzQnRjRGlhbG9nVmlzaWJsZSIsImltcG9ydGVkQWNjb3VudElkIiwic2V0SW1wb3J0ZWRBY2NvdW50SWQiLCJvblN1Y2Nlc3NmdWxsQ29ubmVjdGlvbiIsImFjY291bnRJZCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkZyYWdtZW50Iiwib25Db25uZWN0IiwiYXBwSWNvbiIsIkF2YXRhciIsIkJhZGdlIiwiQml0Y29pbkNvbG9ySWNvbiIsIkZpcmVibG9ja3NJY29uIiwiV2FsbGV0Q29ubmVjdEljb24iLCJiYWRnZUljb24iLCJvdmVybGFwIiwiYmFkZ2VDb250ZW50Iiwic3giLCJ3aWR0aCIsImhlaWdodCIsImJhY2tncm91bmRDb2xvciIsImJvcmRlciIsImJvcmRlckNvbG9yIiwic2l6ZSIsImFuY2hvck9yaWdpbiIsInZlcnRpY2FsIiwiaG9yaXpvbnRhbCIsImJhY2tncm91bmQiLCJEaWFsb2ciLCJEaWFsb2dUaXRsZSIsIlR5cG9ncmFwaHkiLCJEaWFsb2dBY3Rpb25zIiwiQnV0dG9uIiwiRGlhbG9nQ29udGVudCIsInRvYXN0IiwidXNlVHJhbnNsYXRpb24iLCJ1c2VIaXN0b3J5IiwidCIsImhpc3RvcnkiLCJvcGVuIiwidmFyaWFudCIsIm9uQ2xpY2siLCJwdXNoIiwic3VjY2VzcyIsImR1cmF0aW9uIl0sInNvdXJjZVJvb3QiOiIifQ==