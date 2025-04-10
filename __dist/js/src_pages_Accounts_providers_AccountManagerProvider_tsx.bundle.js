"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Accounts_providers_AccountManagerProvider_tsx"],{

/***/ "./src/background/services/accounts/utils/typeGuards.ts":
/*!**************************************************************!*\
  !*** ./src/background/services/accounts/utils/typeGuards.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isFireblocksAccount": () => (/* binding */ isFireblocksAccount),
/* harmony export */   "isImportedAccount": () => (/* binding */ isImportedAccount),
/* harmony export */   "isPrimaryAccount": () => (/* binding */ isPrimaryAccount),
/* harmony export */   "isWalletConnectAccount": () => (/* binding */ isWalletConnectAccount)
/* harmony export */ });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ "./src/background/services/accounts/models.ts");

const isFireblocksAccount = account => account?.type === _models__WEBPACK_IMPORTED_MODULE_0__.AccountType.FIREBLOCKS;
const isWalletConnectAccount = account => account?.type === _models__WEBPACK_IMPORTED_MODULE_0__.AccountType.WALLET_CONNECT;
const isPrimaryAccount = account => account?.type === _models__WEBPACK_IMPORTED_MODULE_0__.AccountType.PRIMARY;
const isImportedAccount = account => Boolean(account) && !isPrimaryAccount(account);

/***/ }),

/***/ "./src/pages/Accounts/providers/AccountManagerProvider.tsx":
/*!*****************************************************************!*\
  !*** ./src/pages/Accounts/providers/AccountManagerProvider.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccountManagerContext": () => (/* binding */ AccountManagerContext),
/* harmony export */   "AccountManagerProvider": () => (/* binding */ AccountManagerProvider),
/* harmony export */   "SelectionMode": () => (/* binding */ SelectionMode),
/* harmony export */   "useAccountManager": () => (/* binding */ useAccountManager)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/FeatureFlagsProvider */ "./src/contexts/FeatureFlagsProvider.tsx");
/* harmony import */ var _src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/background/services/featureFlags/models */ "./src/background/services/featureFlags/models.ts");
/* harmony import */ var _src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/accounts/utils/typeGuards */ "./src/background/services/accounts/utils/typeGuards.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





const AccountManagerContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  exitManageMode() {},
  isManageMode: false,
  isAccountSelectable() {
    return false;
  },
  selectedAccounts: [],
  selectAccount() {},
  deselectAccount() {},
  toggleManageMode() {}
});
let SelectionMode = /*#__PURE__*/function (SelectionMode) {
  SelectionMode[SelectionMode["None"] = 0] = "None";
  SelectionMode[SelectionMode["Any"] = 1] = "Any";
  SelectionMode[SelectionMode["Consecutive"] = 2] = "Consecutive";
  return SelectionMode;
}({});
const AccountManagerProvider = ({
  children
}) => {
  const {
    accounts
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  const {
    featureFlags
  } = (0,_src_contexts_FeatureFlagsProvider__WEBPACK_IMPORTED_MODULE_2__.useFeatureFlagContext)();
  const [selectedAccounts, setSelectedAccounts] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isManageMode, setIsManageMode] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const isAccountSelectable = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(account => {
    if (!featureFlags[_src_background_services_featureFlags_models__WEBPACK_IMPORTED_MODULE_3__.FeatureGates.PRIMARY_ACCOUNT_REMOVAL] || !(0,_src_background_services_accounts_utils_typeGuards__WEBPACK_IMPORTED_MODULE_4__.isPrimaryAccount)(account)) {
      return account.id in accounts.imported;
    }
    const {
      id: accountId,
      walletId
    } = account;
    if (selectedAccounts.includes(accountId)) {
      return true;
    }
    const walletPrimaryAccounts = accounts.primary[walletId];
    if (!walletPrimaryAccounts) {
      return false;
    }
    const allAccountsCount = Object.values(accounts.primary).flat().length;
    if (allAccountsCount - 1 === selectedAccounts.length) {
      return false;
    }
    return walletPrimaryAccounts.slice(walletPrimaryAccounts.indexOf(account) + 1).every(({
      id
    }) => selectedAccounts.includes(id));
    return false;
  }, [featureFlags, selectedAccounts, accounts.primary, accounts.imported]);
  const selectAccount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(accountId => {
    setSelectedAccounts(currentSet => {
      return [...currentSet, accountId];
    });
  }, []);
  const deselectAccount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((accountId, deselectPrevious = false) => {
    setSelectedAccounts(currentSet => {
      const index = currentSet.indexOf(accountId);
      if (index === -1) {
        return currentSet;
      }
      currentSet.splice(index, deselectPrevious ? currentSet.length - index : 1);
      return Array.from(currentSet);
    });
  }, []);
  const toggleManageMode = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setIsManageMode(wasManageModeEnabled => !wasManageModeEnabled);
  }, []);
  const exitManageMode = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setIsManageMode(false);
    setSelectedAccounts([]);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setSelectedAccounts([]);
  }, [isManageMode]);
  return /*#__PURE__*/React.createElement(AccountManagerContext.Provider, {
    value: {
      exitManageMode,
      isAccountSelectable,
      isManageMode,
      selectedAccounts,
      selectAccount,
      deselectAccount,
      toggleManageMode
    }
  }, children);
};
function useAccountManager() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(AccountManagerContext);
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX0FjY291bnRzX3Byb3ZpZGVyc19BY2NvdW50TWFuYWdlclByb3ZpZGVyX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPbUI7QUFFWixNQUFNQyxtQkFBbUIsR0FDOUJDLE9BQWlCLElBQ2dCQSxPQUFPLEVBQUVDLElBQUksS0FBS0gsMkRBQXNCO0FBRXBFLE1BQU1LLHNCQUFzQixHQUNqQ0gsT0FBaUIsSUFFakJBLE9BQU8sRUFBRUMsSUFBSSxLQUFLSCwrREFBMEI7QUFFdkMsTUFBTU8sZ0JBQWdCLEdBQzNCTCxPQUErQixJQUNEQSxPQUFPLEVBQUVDLElBQUksS0FBS0gsd0RBQW1CO0FBRTlELE1BQU1TLGlCQUFpQixHQUM1QlAsT0FBaUIsSUFDY1EsT0FBTyxDQUFDUixPQUFPLENBQUMsSUFBSSxDQUFDSyxnQkFBZ0IsQ0FBQ0wsT0FBTyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xCaEU7QUFFcUQ7QUFDTztBQUNDO0FBRVU7QUFNL0UsTUFBTWlCLHFCQUFxQixnQkFBR1Isb0RBQWEsQ0FRL0M7RUFDRFMsY0FBY0EsQ0FBQSxFQUFHLENBQUMsQ0FBQztFQUNuQkMsWUFBWSxFQUFFLEtBQUs7RUFDbkJDLG1CQUFtQkEsQ0FBQSxFQUFHO0lBQ3BCLE9BQU8sS0FBSztFQUNkLENBQUM7RUFDREMsZ0JBQWdCLEVBQUUsRUFBRTtFQUNwQkMsYUFBYUEsQ0FBQSxFQUFHLENBQUMsQ0FBQztFQUNsQkMsZUFBZUEsQ0FBQSxFQUFHLENBQUMsQ0FBQztFQUNwQkMsZ0JBQWdCQSxDQUFBLEVBQUcsQ0FBQztBQUN0QixDQUFDLENBQUM7QUFFSyxJQUFLQyxhQUFhLDBCQUFiQSxhQUFhO0VBQWJBLGFBQWEsQ0FBYkEsYUFBYTtFQUFiQSxhQUFhLENBQWJBLGFBQWE7RUFBYkEsYUFBYSxDQUFiQSxhQUFhO0VBQUEsT0FBYkEsYUFBYTtBQUFBO0FBTWxCLE1BQU1DLHNCQUFzQixHQUFHQSxDQUFDO0VBQ3JDQztB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QUM7RUFFTixNQUFNcEMsY0FBYyxHQUFHUixrREFBVyxDQUFDLE1BQU07SUFDdkNxQixlQUFlLENBQUMsS0FBSyxDQUFDO0lBQ3RCRCxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7RUFDekIsQ0FBQyxFQUFFLEVBQUUsQ0FBQztFQUVObEIsZ0RBQVMsQ0FBQyxNQUFNO0lBQ2RrQixtQkFBbUIsQ0FBQyxFQUFFLENBQUM7RUFDekIsQ0FBQyxFQUFFLENBQUNYLFlBQVksQ0FBQyxDQUFDO0VBRWxCLG9CQUNFb0MsS0FBQSxDQUFBQyxhQUFBLENBQUN2QyxxQkFBcUIsQ0FBQ3dDLFFBQVE7SUFDN0JDLEtBQUssRUFBRTtNQUNMeEMsY0FBYztNQUNkRSxtQkFBbUI7TUFDbkJELFlBQVk7TUFDWkUsZ0JBQWdCO01BQ2hCQyxhQUFhO01BQ2JDLGVBQWU7TUFDZkM7SUFDRjtFQUFFLEdBRURHLFFBQVEsQ0FDc0I7QUFFckMsQ0FBQztBQUVNLFNBQVNnQyxpQkFBaUJBLENBQUEsRUFBRztFQUNsQyxPQUFPaEQsaURBQVUsQ0FBQ00scUJBQXFCLENBQUM7QUFDMUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvdXRpbHMvdHlwZUd1YXJkcy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0FjY291bnRzL3Byb3ZpZGVycy9BY2NvdW50TWFuYWdlclByb3ZpZGVyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBY2NvdW50LFxuICBBY2NvdW50VHlwZSxcbiAgRmlyZWJsb2Nrc0FjY291bnQsXG4gIEltcG9ydGVkQWNjb3VudCxcbiAgUHJpbWFyeUFjY291bnQsXG4gIFdhbGxldENvbm5lY3RBY2NvdW50LFxufSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgY29uc3QgaXNGaXJlYmxvY2tzQWNjb3VudCA9IChcbiAgYWNjb3VudD86IEFjY291bnQsXG4pOiBhY2NvdW50IGlzIEZpcmVibG9ja3NBY2NvdW50ID0+IGFjY291bnQ/LnR5cGUgPT09IEFjY291bnRUeXBlLkZJUkVCTE9DS1M7XG5cbmV4cG9ydCBjb25zdCBpc1dhbGxldENvbm5lY3RBY2NvdW50ID0gKFxuICBhY2NvdW50PzogQWNjb3VudCxcbik6IGFjY291bnQgaXMgV2FsbGV0Q29ubmVjdEFjY291bnQgPT5cbiAgYWNjb3VudD8udHlwZSA9PT0gQWNjb3VudFR5cGUuV0FMTEVUX0NPTk5FQ1Q7XG5cbmV4cG9ydCBjb25zdCBpc1ByaW1hcnlBY2NvdW50ID0gKFxuICBhY2NvdW50PzogUGljazxBY2NvdW50LCAndHlwZSc+LFxuKTogYWNjb3VudCBpcyBQcmltYXJ5QWNjb3VudCA9PiBhY2NvdW50Py50eXBlID09PSBBY2NvdW50VHlwZS5QUklNQVJZO1xuXG5leHBvcnQgY29uc3QgaXNJbXBvcnRlZEFjY291bnQgPSAoXG4gIGFjY291bnQ/OiBBY2NvdW50LFxuKTogYWNjb3VudCBpcyBJbXBvcnRlZEFjY291bnQgPT4gQm9vbGVhbihhY2NvdW50KSAmJiAhaXNQcmltYXJ5QWNjb3VudChhY2NvdW50KTtcbiIsImltcG9ydCB7XG4gIGNyZWF0ZUNvbnRleHQsXG4gIHVzZUNhbGxiYWNrLFxuICB1c2VDb250ZXh0LFxuICB1c2VFZmZlY3QsXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHVzZUFjY291bnRzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQWNjb3VudHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VGZWF0dXJlRmxhZ0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0ZlYXR1cmVGbGFnc1Byb3ZpZGVyJztcbmltcG9ydCB7IEZlYXR1cmVHYXRlcyB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9mZWF0dXJlRmxhZ3MvbW9kZWxzJztcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcbmltcG9ydCB7IGlzUHJpbWFyeUFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvdXRpbHMvdHlwZUd1YXJkcyc7XG5cbmludGVyZmFjZSBBY2NvdW50TWFuYWdlckNvbnRleHRQcm9wcyB7XG4gIGNoaWxkcmVuPzogUmVhY3QuUmVhY3ROb2RlO1xufVxuXG5leHBvcnQgY29uc3QgQWNjb3VudE1hbmFnZXJDb250ZXh0ID0gY3JlYXRlQ29udGV4dDx7XG4gIGV4aXRNYW5hZ2VNb2RlKCk6IHZvaWQ7XG4gIGlzTWFuYWdlTW9kZTogYm9vbGVhbjtcbiAgaXNBY2NvdW50U2VsZWN0YWJsZShhY2NvdW50OiBBY2NvdW50KTogYm9vbGVhbjtcbiAgc2VsZWN0ZWRBY2NvdW50czogc3RyaW5nW107XG4gIHNlbGVjdEFjY291bnQoYWNjb3VudElkOiBzdHJpbmcpOiB2b2lkO1xuICBkZXNlbGVjdEFjY291bnQoYWNjb3VudElkOiBzdHJpbmcsIGRlc2VsZWN0UHJldmlvdXM/OiBib29sZWFuKTogdm9pZDtcbiAgdG9nZ2xlTWFuYWdlTW9kZShuZXdWYWx1ZT86IGJvb2xlYW4pOiB2b2lkO1xufT4oe1xuICBleGl0TWFuYWdlTW9kZSgpIHt9LFxuICBpc01hbmFnZU1vZGU6IGZhbHNlLFxuICBpc0FjY291bnRTZWxlY3RhYmxlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgc2VsZWN0ZWRBY2NvdW50czogW10sXG4gIHNlbGVjdEFjY291bnQoKSB7fSxcbiAgZGVzZWxlY3RBY2NvdW50KCkge30sXG4gIHRvZ2dsZU1hbmFnZU1vZGUoKSB7fSxcbn0pO1xuXG5leHBvcnQgZW51bSBTZWxlY3Rpb25Nb2RlIHtcbiAgTm9uZSwgLy8gUmVzZXJ2ZWQgZm9yIFNlZWRsZXNzXG4gIEFueSxcbiAgQ29uc2VjdXRpdmUsXG59XG5cbmV4cG9ydCBjb25zdCBBY2NvdW50TWFuYWdlclByb3ZpZGVyID0gKHtcbiAgY2hpbGRyZW4sXG59OiBBY2NvdW50TWFuYWdlckNvbnRleHRQcm9wcykgPT4ge1xuICBjb25zdCB7IGFjY291bnRzIH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcbiAgY29uc3QgeyBmZWF0dXJlRmxhZ3MgfSA9IHVzZUZlYXR1cmVGbGFnQ29udGV4dCgpO1xuICBjb25zdCBbc2VsZWN0ZWRBY2NvdW50cywgc2V0U2VsZWN0ZWRBY2NvdW50c10gPSB1c2VTdGF0ZTxzdHJpbmdbXT4oW10pO1xuICBjb25zdCBbaXNNYW5hZ2VNb2RlLCBzZXRJc01hbmFnZU1vZGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGlzQWNjb3VudFNlbGVjdGFibGUgPSB1c2VDYWxsYmFjayhcbiAgICAoYWNjb3VudDogQWNjb3VudCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICAhZmVhdHVyZUZsYWdzW0ZlYXR1cmVHYXRlcy5QUklNQVJZX0FDQ09VTlRfUkVNT1ZBTF0gfHxcbiAgICAgICAgIWlzUHJpbWFyeUFjY291bnQoYWNjb3VudClcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gYWNjb3VudC5pZCBpbiBhY2NvdW50cy5pbXBvcnRlZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBpZDogYWNjb3VudElkLCB3YWxsZXRJZCB9ID0gYWNjb3VudDtcblxuICAgICAgaWYgKHNlbGVjdGVkQWNjb3VudHMuaW5jbHVkZXMoYWNjb3VudElkKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgd2FsbGV0UHJpbWFyeUFjY291bnRzID0gYWNjb3VudHMucHJpbWFyeVt3YWxsZXRJZF07XG5cbiAgICAgIGlmICghd2FsbGV0UHJpbWFyeUFjY291bnRzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWxsQWNjb3VudHNDb3VudCA9IE9iamVjdC52YWx1ZXMoYWNjb3VudHMucHJpbWFyeSkuZmxhdCgpLmxlbmd0aDtcbiAgICAgIGlmIChhbGxBY2NvdW50c0NvdW50IC0gMSA9PT0gc2VsZWN0ZWRBY2NvdW50cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gd2FsbGV0UHJpbWFyeUFjY291bnRzXG4gICAgICAgIC5zbGljZSh3YWxsZXRQcmltYXJ5QWNjb3VudHMuaW5kZXhPZihhY2NvdW50KSArIDEpXG4gICAgICAgIC5ldmVyeSgoeyBpZCB9KSA9PiBzZWxlY3RlZEFjY291bnRzLmluY2x1ZGVzKGlkKSk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIFtmZWF0dXJlRmxhZ3MsIHNlbGVjdGVkQWNjb3VudHMsIGFjY291bnRzLnByaW1hcnksIGFjY291bnRzLmltcG9ydGVkXSxcbiAgKTtcblxuICBjb25zdCBzZWxlY3RBY2NvdW50ID0gdXNlQ2FsbGJhY2soKGFjY291bnRJZDogc3RyaW5nKSA9PiB7XG4gICAgc2V0U2VsZWN0ZWRBY2NvdW50cygoY3VycmVudFNldCkgPT4ge1xuICAgICAgcmV0dXJuIFsuLi5jdXJyZW50U2V0LCBhY2NvdW50SWRdO1xuICAgIH0pO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgZGVzZWxlY3RBY2NvdW50ID0gdXNlQ2FsbGJhY2soXG4gICAgKGFjY291bnRJZDogc3RyaW5nLCBkZXNlbGVjdFByZXZpb3VzID0gZmFsc2UpID0+IHtcbiAgICAgIHNldFNlbGVjdGVkQWNjb3VudHMoKGN1cnJlbnRTZXQpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBjdXJyZW50U2V0LmluZGV4T2YoYWNjb3VudElkKTtcblxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRTZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50U2V0LnNwbGljZShcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBkZXNlbGVjdFByZXZpb3VzID8gY3VycmVudFNldC5sZW5ndGggLSBpbmRleCA6IDEsXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oY3VycmVudFNldCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFtdLFxuICApO1xuXG4gIGNvbnN0IHRvZ2dsZU1hbmFnZU1vZGUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0SXNNYW5hZ2VNb2RlKCh3YXNNYW5hZ2VNb2RlRW5hYmxlZCkgPT4gIXdhc01hbmFnZU1vZGVFbmFibGVkKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGV4aXRNYW5hZ2VNb2RlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldElzTWFuYWdlTW9kZShmYWxzZSk7XG4gICAgc2V0U2VsZWN0ZWRBY2NvdW50cyhbXSk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFNlbGVjdGVkQWNjb3VudHMoW10pO1xuICB9LCBbaXNNYW5hZ2VNb2RlXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8QWNjb3VudE1hbmFnZXJDb250ZXh0LlByb3ZpZGVyXG4gICAgICB2YWx1ZT17e1xuICAgICAgICBleGl0TWFuYWdlTW9kZSxcbiAgICAgICAgaXNBY2NvdW50U2VsZWN0YWJsZSxcbiAgICAgICAgaXNNYW5hZ2VNb2RlLFxuICAgICAgICBzZWxlY3RlZEFjY291bnRzLFxuICAgICAgICBzZWxlY3RBY2NvdW50LFxuICAgICAgICBkZXNlbGVjdEFjY291bnQsXG4gICAgICAgIHRvZ2dsZU1hbmFnZU1vZGUsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0FjY291bnRNYW5hZ2VyQ29udGV4dC5Qcm92aWRlcj5cbiAgKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBY2NvdW50TWFuYWdlcigpIHtcbiAgcmV0dXJuIHVzZUNvbnRleHQoQWNjb3VudE1hbmFnZXJDb250ZXh0KTtcbn1cbiJdLCJuYW1lcyI6WyJBY2NvdW50VHlwZSIsImlzRmlyZWJsb2Nrc0FjY291bnQiLCJhY2NvdW50IiwidHlwZSIsIkZJUkVCTE9DS1MiLCJpc1dhbGxldENvbm5lY3RBY2NvdW50IiwiV0FMTEVUX0NPTk5FQ1QiLCJpc1ByaW1hcnlBY2NvdW50IiwiUFJJTUFSWSIsImlzSW1wb3J0ZWRBY2NvdW50IiwiQm9vbGVhbiIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDYWxsYmFjayIsInVzZUNvbnRleHQiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsInVzZUFjY291bnRzQ29udGV4dCIsInVzZUZlYXR1cmVGbGFnQ29udGV4dCIsIkZlYXR1cmVHYXRlcyIsIkFjY291bnRNYW5hZ2VyQ29udGV4dCIsImV4aXRNYW5hZ2VNb2RlIiwiaXNNYW5hZ2VNb2RlIiwiaXNBY2NvdW50U2VsZWN0YWJsZSIsInNlbGVjdGVkQWNjb3VudHMiLCJzZWxlY3RBY2NvdW50IiwiZGVzZWxlY3RBY2NvdW50IiwidG9nZ2xlTWFuYWdlTW9kZSIsIlNlbGVjdGlvbk1vZGUiLCJBY2NvdW50TWFuYWdlclByb3ZpZGVyIiwiY2hpbGRyZW4iLCJhY2NvdW50cyIsImZlYXR1cmVGbGFncyIsInNldFNlbGVjdGVkQWNjb3VudHMiLCJzZXRJc01hbmFnZU1vZGUiLCJQUklNQVJZX0FDQ09VTlRfUkVNT1ZBTCIsImlkIiwiaW1wb3J0ZWQiLCJhY2NvdW50SWQiLCJ3YWxsZXRJZCIsImluY2x1ZGVzIiwid2FsbGV0UHJpbWFyeUFjY291bnRzIiwicHJpbWFyeSIsImFsbEFjY291bnRzQ291bnQiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmbGF0IiwibGVuZ3RoIiwic2xpY2UiLCJpbmRleE9mIiwiZXZlcnkiLCJjdXJyZW50U2V0IiwiZGVzZWxlY3RQcmV2aW91cyIsImluZGV4Iiwic3BsaWNlIiwiQXJyYXkiLCJmcm9tIiwid2FzTWFuYWdlTW9kZUVuYWJsZWQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJQcm92aWRlciIsInZhbHVlIiwidXNlQWNjb3VudE1hbmFnZXIiXSwic291cmNlUm9vdCI6IiJ9