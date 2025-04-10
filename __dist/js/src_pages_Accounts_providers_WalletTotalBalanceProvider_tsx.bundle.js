"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Accounts_providers_WalletTotalBalanceProvider_tsx"],{

/***/ "./src/background/services/balances/handlers/getTotalBalanceForWallet/models.ts":
/*!**************************************************************************************!*\
  !*** ./src/background/services/balances/handlers/getTotalBalanceForWallet/models.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ADDRESS_GAP_LIMIT": () => (/* binding */ ADDRESS_GAP_LIMIT),
/* harmony export */   "GLACIER_ADDRESS_FETCH_LIMIT": () => (/* binding */ GLACIER_ADDRESS_FETCH_LIMIT),
/* harmony export */   "IMPORTED_ACCOUNTS_WALLET_ID": () => (/* binding */ IMPORTED_ACCOUNTS_WALLET_ID),
/* harmony export */   "ITERATION_LIMIT": () => (/* binding */ ITERATION_LIMIT),
/* harmony export */   "isImportedAccountsRequest": () => (/* binding */ isImportedAccountsRequest)
/* harmony export */ });
const ITERATION_LIMIT = 10; // Abitrary number to avoid an infinite loop.
const ADDRESS_GAP_LIMIT = 20;
const GLACIER_ADDRESS_FETCH_LIMIT = 64; // Requested addresses are encoded as query params, and Glacier enforces URI length limits
const IMPORTED_ACCOUNTS_WALLET_ID = '__IMPORTED__';
const isImportedAccountsRequest = walletId => walletId === IMPORTED_ACCOUNTS_WALLET_ID;

/***/ }),

/***/ "./src/pages/Accounts/providers/WalletTotalBalanceProvider.tsx":
/*!*********************************************************************!*\
  !*** ./src/pages/Accounts/providers/WalletTotalBalanceProvider.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WalletTotalBalanceContext": () => (/* binding */ WalletTotalBalanceContext),
/* harmony export */   "WalletTotalBalanceProvider": () => (/* binding */ WalletTotalBalanceProvider),
/* harmony export */   "useWalletTotalBalanceContext": () => (/* binding */ useWalletTotalBalanceContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_background_services_balances_handlers_getTotalBalanceForWallet_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/balances/handlers/getTotalBalanceForWallet/models */ "./src/background/services/balances/handlers/getTotalBalanceForWallet/models.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







const WalletTotalBalanceContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  walletBalances: {},
  fetchBalanceForWallet: () => Promise.resolve()
});
const WalletTotalBalanceProvider = ({
  children
}) => {
  const {
    accounts: {
      imported
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_2__.useAccountsContext)();
  const {
    wallets
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_4__.useWalletContext)();
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_5__.useConnectionContext)();
  const hasImportedAccounts = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => Object.keys(imported).length > 0, [imported]);
  const [walletBalances, setWalletBalances] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const fetchBalanceForWallet = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async walletId => {
    setWalletBalances(prevState => ({
      ...prevState,
      [walletId]: {
        ...prevState[walletId],
        hasErrorOccurred: false,
        isLoading: true
      }
    }));
    request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_6__.ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET,
      params: {
        walletId
      }
    }).then(walletBalanceInfo => {
      setWalletBalances(prevState => ({
        ...prevState,
        [walletId]: {
          ...walletBalanceInfo,
          hasErrorOccurred: false,
          isLoading: false
        }
      }));
    }).catch(err => {
      console.log('Error while fetching total balance for wallet', err);
      setWalletBalances(prevState => ({
        ...prevState,
        [walletId]: {
          ...prevState[walletId],
          hasErrorOccurred: true,
          isLoading: false
        }
      }));
    });
  }, [request]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let isMounted = true;
    const fetchWalletBalancesSequentially = async walletIds => {
      for (const walletId of walletIds) {
        await fetchBalanceForWallet(walletId);
        if (!isMounted) {
          return;
        }
      }
    };
    const walletIds = [...wallets.map(({
      id
    }) => id), hasImportedAccounts ? _src_background_services_balances_handlers_getTotalBalanceForWallet_models__WEBPACK_IMPORTED_MODULE_3__.IMPORTED_ACCOUNTS_WALLET_ID : undefined].filter(lodash__WEBPACK_IMPORTED_MODULE_1__.isString);
    fetchWalletBalancesSequentially(walletIds);
    return () => {
      isMounted = false;
    };
  }, [wallets, hasImportedAccounts, fetchBalanceForWallet]);
  return /*#__PURE__*/React.createElement(WalletTotalBalanceContext.Provider, {
    value: {
      walletBalances,
      fetchBalanceForWallet
    }
  }, children);
};
function useWalletTotalBalanceContext() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(WalletTotalBalanceContext);
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FjY291bnRzX3Byb3ZpZGVyc19XYWxsZXRUb3RhbEJhbGFuY2VQcm92aWRlcl90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZU8sTUFBTUEsZUFBZSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLE1BQU1DLGlCQUFpQixHQUFHLEVBQUU7QUFDNUIsTUFBTUMsMkJBQTJCLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDeEMsTUFBTUMsMkJBQTJCLEdBQUcsY0FBYztBQUVsRCxNQUFNQyx5QkFBeUIsR0FBSUMsUUFBZ0IsSUFDeERBLFFBQVEsS0FBS0YsMkJBQTJCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2QzQjtBQUNtQjtBQUVrQztBQUlnQjtBQUNwQjtBQUNRO0FBRWtCO0FBV25GLE1BQU1jLHlCQUF5QixnQkFBR1gsb0RBQWEsQ0FHbkQ7RUFDRFksY0FBYyxFQUFFLENBQUMsQ0FBQztFQUNsQkMscUJBQXFCLEVBQUVBLENBQUEsS0FBTUMsT0FBTyxDQUFDQyxPQUFPO0FBQzlDLENBQUMsQ0FBQztBQUVLLE1BQU1DLDBCQUEwQixHQUFHQSxDQUFDO0VBQ3pDQztBQUM4QixDQUFDLEtBQUs7RUFDcEMsTUFBTTtJQUNKQyxRQUFRLEVBQUU7TUFBRUM7SUFBUztFQUN2QixDQUFDLEdBQUdaLGtGQUFrQixFQUFFO0VBQ3hCLE1BQU07SUFBRWE7RUFBUSxDQUFDLEdBQUdaLDhFQUFnQixFQUFFO0VBQ3RDLE1BQU07SUFBRWE7RUFBUSxDQUFDLEdBQUdaLHNGQUFvQixFQUFFO0VBRTFDLE1BQU1hLG1CQUFtQixHQUFHbEIsOENBQU8sQ0FDakMsTUFBTW1CLE1BQU0sQ0FBQ0MsSUFBSSxDQUFDTCxRQUFRLENBQUMsQ0FBQ00sTUFBTSxHQUFHLENBQUMsRUFDdEMsQ0FBQ04sUUFBUSxDQUFDLENBQ1g7RUFFRCxNQUFNLENBQUNQLGNBQWMsRUFBRWMsaUJBQWlCLENBQUMsR0FBR3JCLCtDQUFRLENBRWxELENBQUMsQ0FBQyxDQUFDO0VBRUwsTUFBTVEscUJBQXFCLEdBQUdaLGtEQUFXLENBQ3ZDLE1BQU9GLFFBQWdCLElBQUs7SUFDMUIyQixpQkFBaUIsQ0FBRUMsU0FBUyxLQUFNO01BQ2hDLEdBQUdBLFNBQVM7TUFDWixDQUFDNUIsUUFBUSxHQUFHO1FBQ1YsR0FBRzRCLFNBQVMsQ0FBQzVCLFFBQVEsQ0FBQztRQUN0QjZCLGdCQUFnQixFQUFFLEtBQUs7UUFDdkJDLFNBQVMsRUFBRTtNQUNiO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFFSFIsT0FBTyxDQUFrQztNQUN2Q1MsTUFBTSxFQUFFcEIsa0lBQThDO01BQ3REc0IsTUFBTSxFQUFFO1FBQ05qQztNQUNGO0lBQ0YsQ0FBQyxDQUFDLENBQ0NrQyxJQUFJLENBQUVDLGlCQUFpQixJQUFLO01BQzNCUixpQkFBaUIsQ0FBRUMsU0FBUyxLQUFNO1FBQ2hDLEdBQUdBLFNBQVM7UUFDWixDQUFDNUIsUUFBUSxHQUFHO1VBQ1YsR0FBR21DLGlCQUFpQjtVQUNwQk4sZ0JBQWdCLEVBQUUsS0FBSztVQUN2QkMsU0FBUyxFQUFFO1FBQ2I7TUFDRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUNETSxLQUFLLENBQUVDLEdBQUcsSUFBSztNQUNkQyxPQUFPLENBQUNDLEdBQUcsQ0FBQywrQ0FBK0MsRUFBRUYsR0FBRyxDQUFDO01BQ2pFVixpQkFBaUIsQ0FBRUMsU0FBUyxLQUFNO1FBQ2hDLEdBQUdBLFNBQVM7UUFDWixDQUFDNUIsUUFBUSxHQUFHO1VBQ1YsR0FBRzRCLFNBQVMsQ0FBQzVCLFFBQVEsQ0FBQztVQUN0QjZCLGdCQUFnQixFQUFFLElBQUk7VUFDdEJDLFNBQVMsRUFBRTtRQUNiO01BQ0YsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7RUFDTixDQUFDLEVBQ0QsQ0FBQ1IsT0FBTyxDQUFDLENBQ1Y7RUFDRGxCLGdEQUFTLENBQUMsTUFBTTtJQUNkLElBQUlvQyxTQUFTLEdBQUcsSUFBSTtJQUVwQixNQUFNQywrQkFBK0IsR0FBRyxNQUFPQyxTQUFtQixJQUFLO01BQ3JFLEtBQUssTUFBTTFDLFFBQVEsSUFBSTBDLFNBQVMsRUFBRTtRQUNoQyxNQUFNNUIscUJBQXFCLENBQUNkLFFBQVEsQ0FBQztRQUNyQyxJQUFJLENBQUN3QyxTQUFTLEVBQUU7VUFDZDtRQUNGO01BQ0Y7SUFDRixDQUFDO0lBRUQsTUFBTUUsU0FBUyxHQUFHLENBQ2hCLEdBQUdyQixPQUFPLENBQUNzQixHQUFHLENBQUMsQ0FBQztNQUFFQztJQUFHLENBQUMsS0FBS0EsRUFBRSxDQUFDLEVBQzlCckIsbUJBQW1CLEdBQUd6QixtSUFBMkIsR0FBRytDLFNBQVMsQ0FDOUQsQ0FBQ0MsTUFBTSxDQUFDdkMsNENBQVEsQ0FBQztJQUVsQmtDLCtCQUErQixDQUFDQyxTQUFTLENBQUM7SUFFMUMsT0FBTyxNQUFNO01BQ1hGLFNBQVMsR0FBRyxLQUFLO0lBQ25CLENBQUM7RUFDSCxDQUFDLEVBQUUsQ0FBQ25CLE9BQU8sRUFBRUUsbUJBQW1CLEVBQUVULHFCQUFxQixDQUFDLENBQUM7RUFFekQsb0JBQ0VpQyxLQUFBLENBQUFDLGFBQUEsQ0FBQ3BDLHlCQUF5QixDQUFDcUMsUUFBUTtJQUNqQ0MsS0FBSyxFQUFFO01BQ0xyQyxjQUFjO01BQ2RDO0lBQ0Y7RUFBRSxHQUVESSxRQUFRLENBQzBCO0FBRXpDLENBQUM7QUFFTSxTQUFTaUMsNEJBQTRCQSxDQUFBLEVBQUc7RUFDN0MsT0FBT2hELGlEQUFVLENBQUNTLHlCQUF5QixDQUFDO0FBQzlDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2JhbGFuY2VzL2hhbmRsZXJzL2dldFRvdGFsQmFsYW5jZUZvcldhbGxldC9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9wcm92aWRlcnMvV2FsbGV0VG90YWxCYWxhbmNlUHJvdmlkZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYWluQWRkcmVzc0NoYWluSWRNYXBMaXN0UmVzcG9uc2UgfSBmcm9tICdAYXZhbGFicy9nbGFjaWVyLXNkayc7XG5cbmV4cG9ydCB0eXBlIEdldFRvdGFsQmFsYW5jZUZvcldhbGxldFBhcmFtcyA9IHtcbiAgd2FsbGV0SWQ6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFRvdGFsQmFsYW5jZUZvcldhbGxldCA9IHtcbiAgdG90YWxCYWxhbmNlSW5DdXJyZW5jeT86IG51bWJlcjtcbiAgaGFzQmFsYW5jZU9uVW5kZXJpdmVkQWNjb3VudHM6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBBZGRyZXNzQWN0aXZpdHlGZXRjaGVyID0gKFxuICBhZGRyZXNzZXM6IHN0cmluZ1tdLFxuKSA9PiBQcm9taXNlPENoYWluQWRkcmVzc0NoYWluSWRNYXBMaXN0UmVzcG9uc2U+O1xuXG5leHBvcnQgY29uc3QgSVRFUkFUSU9OX0xJTUlUID0gMTA7IC8vIEFiaXRyYXJ5IG51bWJlciB0byBhdm9pZCBhbiBpbmZpbml0ZSBsb29wLlxuZXhwb3J0IGNvbnN0IEFERFJFU1NfR0FQX0xJTUlUID0gMjA7XG5leHBvcnQgY29uc3QgR0xBQ0lFUl9BRERSRVNTX0ZFVENIX0xJTUlUID0gNjQ7IC8vIFJlcXVlc3RlZCBhZGRyZXNzZXMgYXJlIGVuY29kZWQgYXMgcXVlcnkgcGFyYW1zLCBhbmQgR2xhY2llciBlbmZvcmNlcyBVUkkgbGVuZ3RoIGxpbWl0c1xuZXhwb3J0IGNvbnN0IElNUE9SVEVEX0FDQ09VTlRTX1dBTExFVF9JRCA9ICdfX0lNUE9SVEVEX18nO1xuXG5leHBvcnQgY29uc3QgaXNJbXBvcnRlZEFjY291bnRzUmVxdWVzdCA9ICh3YWxsZXRJZDogc3RyaW5nKSA9PlxuICB3YWxsZXRJZCA9PT0gSU1QT1JURURfQUNDT1VOVFNfV0FMTEVUX0lEO1xuIiwiaW1wb3J0IHtcbiAgY3JlYXRlQ29udGV4dCxcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZUNvbnRleHQsXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlU3RhdGUsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIElNUE9SVEVEX0FDQ09VTlRTX1dBTExFVF9JRCxcbiAgVG90YWxCYWxhbmNlRm9yV2FsbGV0LFxufSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvaGFuZGxlcnMvZ2V0VG90YWxCYWxhbmNlRm9yV2FsbGV0L21vZGVscyc7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7IEdldFRvdGFsQmFsYW5jZUZvcldhbGxldEhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYmFsYW5jZXMvaGFuZGxlcnMvZ2V0VG90YWxCYWxhbmNlRm9yV2FsbGV0JztcbmltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuXG5pbnRlcmZhY2UgV2FsbGV0VG90YWxCYWxhbmNlQ29udGV4dFByb3BzIHtcbiAgY2hpbGRyZW4/OiBSZWFjdC5SZWFjdE5vZGU7XG59XG5cbmV4cG9ydCB0eXBlIFdhbGxldFRvdGFsQmFsYW5jZVN0YXRlID0gUGFydGlhbDxUb3RhbEJhbGFuY2VGb3JXYWxsZXQ+ICYge1xuICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gIGhhc0Vycm9yT2NjdXJyZWQ6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgY29uc3QgV2FsbGV0VG90YWxCYWxhbmNlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8e1xuICBmZXRjaEJhbGFuY2VGb3JXYWxsZXQod2FsbGV0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG4gIHdhbGxldEJhbGFuY2VzOiBSZWNvcmQ8c3RyaW5nLCBXYWxsZXRUb3RhbEJhbGFuY2VTdGF0ZT47XG59Pih7XG4gIHdhbGxldEJhbGFuY2VzOiB7fSxcbiAgZmV0Y2hCYWxhbmNlRm9yV2FsbGV0OiAoKSA9PiBQcm9taXNlLnJlc29sdmUoKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgV2FsbGV0VG90YWxCYWxhbmNlUHJvdmlkZXIgPSAoe1xuICBjaGlsZHJlbixcbn06IFdhbGxldFRvdGFsQmFsYW5jZUNvbnRleHRQcm9wcykgPT4ge1xuICBjb25zdCB7XG4gICAgYWNjb3VudHM6IHsgaW1wb3J0ZWQgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IHdhbGxldHMgfSA9IHVzZVdhbGxldENvbnRleHQoKTtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuXG4gIGNvbnN0IGhhc0ltcG9ydGVkQWNjb3VudHMgPSB1c2VNZW1vKFxuICAgICgpID0+IE9iamVjdC5rZXlzKGltcG9ydGVkKS5sZW5ndGggPiAwLFxuICAgIFtpbXBvcnRlZF0sXG4gICk7XG5cbiAgY29uc3QgW3dhbGxldEJhbGFuY2VzLCBzZXRXYWxsZXRCYWxhbmNlc10gPSB1c2VTdGF0ZTxcbiAgICBSZWNvcmQ8c3RyaW5nLCBXYWxsZXRUb3RhbEJhbGFuY2VTdGF0ZT5cbiAgPih7fSk7XG5cbiAgY29uc3QgZmV0Y2hCYWxhbmNlRm9yV2FsbGV0ID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHdhbGxldElkOiBzdHJpbmcpID0+IHtcbiAgICAgIHNldFdhbGxldEJhbGFuY2VzKChwcmV2U3RhdGUpID0+ICh7XG4gICAgICAgIC4uLnByZXZTdGF0ZSxcbiAgICAgICAgW3dhbGxldElkXToge1xuICAgICAgICAgIC4uLnByZXZTdGF0ZVt3YWxsZXRJZF0sXG4gICAgICAgICAgaGFzRXJyb3JPY2N1cnJlZDogZmFsc2UsXG4gICAgICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuXG4gICAgICByZXF1ZXN0PEdldFRvdGFsQmFsYW5jZUZvcldhbGxldEhhbmRsZXI+KHtcbiAgICAgICAgbWV0aG9kOiBFeHRlbnNpb25SZXF1ZXN0LkJBTEFOQ0VTX0dFVF9UT1RBTF9GT1JfV0FMTEVULFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICB3YWxsZXRJZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKCh3YWxsZXRCYWxhbmNlSW5mbykgPT4ge1xuICAgICAgICAgIHNldFdhbGxldEJhbGFuY2VzKChwcmV2U3RhdGUpID0+ICh7XG4gICAgICAgICAgICAuLi5wcmV2U3RhdGUsXG4gICAgICAgICAgICBbd2FsbGV0SWRdOiB7XG4gICAgICAgICAgICAgIC4uLndhbGxldEJhbGFuY2VJbmZvLFxuICAgICAgICAgICAgICBoYXNFcnJvck9jY3VycmVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBmZXRjaGluZyB0b3RhbCBiYWxhbmNlIGZvciB3YWxsZXQnLCBlcnIpO1xuICAgICAgICAgIHNldFdhbGxldEJhbGFuY2VzKChwcmV2U3RhdGUpID0+ICh7XG4gICAgICAgICAgICAuLi5wcmV2U3RhdGUsXG4gICAgICAgICAgICBbd2FsbGV0SWRdOiB7XG4gICAgICAgICAgICAgIC4uLnByZXZTdGF0ZVt3YWxsZXRJZF0sXG4gICAgICAgICAgICAgIGhhc0Vycm9yT2NjdXJyZWQ6IHRydWUsXG4gICAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBbcmVxdWVzdF0sXG4gICk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBmZXRjaFdhbGxldEJhbGFuY2VzU2VxdWVudGlhbGx5ID0gYXN5bmMgKHdhbGxldElkczogc3RyaW5nW10pID0+IHtcbiAgICAgIGZvciAoY29uc3Qgd2FsbGV0SWQgb2Ygd2FsbGV0SWRzKSB7XG4gICAgICAgIGF3YWl0IGZldGNoQmFsYW5jZUZvcldhbGxldCh3YWxsZXRJZCk7XG4gICAgICAgIGlmICghaXNNb3VudGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHdhbGxldElkcyA9IFtcbiAgICAgIC4uLndhbGxldHMubWFwKCh7IGlkIH0pID0+IGlkKSxcbiAgICAgIGhhc0ltcG9ydGVkQWNjb3VudHMgPyBJTVBPUlRFRF9BQ0NPVU5UU19XQUxMRVRfSUQgOiB1bmRlZmluZWQsXG4gICAgXS5maWx0ZXIoaXNTdHJpbmcpO1xuXG4gICAgZmV0Y2hXYWxsZXRCYWxhbmNlc1NlcXVlbnRpYWxseSh3YWxsZXRJZHMpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlzTW91bnRlZCA9IGZhbHNlO1xuICAgIH07XG4gIH0sIFt3YWxsZXRzLCBoYXNJbXBvcnRlZEFjY291bnRzLCBmZXRjaEJhbGFuY2VGb3JXYWxsZXRdKTtcblxuICByZXR1cm4gKFxuICAgIDxXYWxsZXRUb3RhbEJhbGFuY2VDb250ZXh0LlByb3ZpZGVyXG4gICAgICB2YWx1ZT17e1xuICAgICAgICB3YWxsZXRCYWxhbmNlcyxcbiAgICAgICAgZmV0Y2hCYWxhbmNlRm9yV2FsbGV0LFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9XYWxsZXRUb3RhbEJhbGFuY2VDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVdhbGxldFRvdGFsQmFsYW5jZUNvbnRleHQoKSB7XG4gIHJldHVybiB1c2VDb250ZXh0KFdhbGxldFRvdGFsQmFsYW5jZUNvbnRleHQpO1xufVxuIl0sIm5hbWVzIjpbIklURVJBVElPTl9MSU1JVCIsIkFERFJFU1NfR0FQX0xJTUlUIiwiR0xBQ0lFUl9BRERSRVNTX0ZFVENIX0xJTUlUIiwiSU1QT1JURURfQUNDT1VOVFNfV0FMTEVUX0lEIiwiaXNJbXBvcnRlZEFjY291bnRzUmVxdWVzdCIsIndhbGxldElkIiwiY3JlYXRlQ29udGV4dCIsInVzZUNhbGxiYWNrIiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZU1lbW8iLCJ1c2VTdGF0ZSIsImlzU3RyaW5nIiwidXNlQWNjb3VudHNDb250ZXh0IiwidXNlV2FsbGV0Q29udGV4dCIsInVzZUNvbm5lY3Rpb25Db250ZXh0IiwiRXh0ZW5zaW9uUmVxdWVzdCIsIldhbGxldFRvdGFsQmFsYW5jZUNvbnRleHQiLCJ3YWxsZXRCYWxhbmNlcyIsImZldGNoQmFsYW5jZUZvcldhbGxldCIsIlByb21pc2UiLCJyZXNvbHZlIiwiV2FsbGV0VG90YWxCYWxhbmNlUHJvdmlkZXIiLCJjaGlsZHJlbiIsImFjY291bnRzIiwiaW1wb3J0ZWQiLCJ3YWxsZXRzIiwicmVxdWVzdCIsImhhc0ltcG9ydGVkQWNjb3VudHMiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwic2V0V2FsbGV0QmFsYW5jZXMiLCJwcmV2U3RhdGUiLCJoYXNFcnJvck9jY3VycmVkIiwiaXNMb2FkaW5nIiwibWV0aG9kIiwiQkFMQU5DRVNfR0VUX1RPVEFMX0ZPUl9XQUxMRVQiLCJwYXJhbXMiLCJ0aGVuIiwid2FsbGV0QmFsYW5jZUluZm8iLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJpc01vdW50ZWQiLCJmZXRjaFdhbGxldEJhbGFuY2VzU2VxdWVudGlhbGx5Iiwid2FsbGV0SWRzIiwibWFwIiwiaWQiLCJ1bmRlZmluZWQiLCJmaWx0ZXIiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJQcm92aWRlciIsInZhbHVlIiwidXNlV2FsbGV0VG90YWxCYWxhbmNlQ29udGV4dCJdLCJzb3VyY2VSb290IjoiIn0=