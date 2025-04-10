"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Wallet_RenameAccount_tsx"],{

/***/ "./src/pages/Wallet/RenameAccount.tsx":
/*!********************************************!*\
  !*** ./src/pages/Wallet/RenameAccount.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RenameAccount": () => (/* binding */ RenameAccount)
/* harmony export */ });
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../SignTransaction/components/ApprovalTxDetails */ "./src/pages/SignTransaction/components/ApprovalTxDetails.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");








function RenameAccount() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_2__.useGetRequestId)();
  const {
    action,
    updateAction,
    cancelHandler
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_0__.useApproveAction)(requestId);
  if (!action) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
      sx: {
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.CircularProgress, {
      size: 60
    }));
  }
  const site = action.site ?? {
    domain: '#',
    name: t('Unknown website')
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: 1,
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      flexGrow: 1,
      width: 1,
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "h4",
    sx: {
      mt: 1.5,
      mb: 3.5
    }
  }, t('Rename account?')), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionHeader, {
    label: t('Action Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionBody, {
    sx: {
      py: 1,
      px: 2,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_5__.WebsiteDetails, {
    site: site
  }))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionHeader, {
    label: t('Account Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionBody, {
    sx: {
      py: 1,
      px: 2,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_5__.AccountDetails, {
    address: action.displayData.account.addressC,
    label: t('Account to rename')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_4__.TxDetailsRow, {
    label: t('New name')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption"
  }, action.displayData.newName))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    sx: {
      width: 1,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Stack, {
    direction: "row",
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    color: "secondary",
    size: "large",
    "data-testid": "switch-account-reject-btn",
    onClick: () => {
      cancelHandler();
      window.close();
    },
    fullWidth: true
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    "data-testid": "switch-account-approve-btn",
    size: "large",
    color: "primary",
    onClick: () => {
      updateAction({
        status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_1__.ActionStatus.SUBMITTING,
        id: requestId
      });
    },
    fullWidth: true
  }, t('Approve')))));
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1dhbGxldF9SZW5hbWVBY2NvdW50X3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUErQztBQU1WO0FBRzBCO0FBQ1E7QUFDVjtBQUtKO0FBQ21CO0FBSW5CO0FBR2xELFNBQVNjLGFBQWFBLENBQUEsRUFBRztFQUM5QixNQUFNO0lBQUVDO0VBQUUsQ0FBQyxHQUFHZiw2REFBYyxFQUFFO0VBQzlCLE1BQU1nQixTQUFTLEdBQUdULDJFQUFlLEVBQUU7RUFFbkMsTUFBTTtJQUFFVSxNQUFNO0lBQUVDLFlBQVk7SUFBRUM7RUFBYyxDQUFDLEdBQUdkLDZFQUFnQixDQUc3RFcsU0FBUyxDQUFDO0VBRWIsSUFBSSxDQUFDQyxNQUFNLEVBQUU7SUFDWCxvQkFDRUcsS0FBQSxDQUFBQyxhQUFBLENBQUNsQiw4REFBSztNQUNKbUIsRUFBRSxFQUFFO1FBQ0ZDLEtBQUssRUFBRSxDQUFDO1FBQ1JDLE1BQU0sRUFBRSxDQUFDO1FBQ1RDLGNBQWMsRUFBRSxRQUFRO1FBQ3hCQyxVQUFVLEVBQUU7TUFDZDtJQUFFLGdCQUVGTixLQUFBLENBQUFDLGFBQUEsQ0FBQ25CLHlFQUFnQjtNQUFDeUIsSUFBSSxFQUFFO0lBQUcsRUFBRyxDQUN4QjtFQUVaO0VBRUEsTUFBTUMsSUFBb0IsR0FBR1gsTUFBTSxDQUFDVyxJQUFJLElBQUk7SUFDMUNDLE1BQU0sRUFBRSxHQUFHO0lBQ1hDLElBQUksRUFBRWYsQ0FBQyxDQUFDLGlCQUFpQjtFQUMzQixDQUFDO0VBRUQsb0JBQ0VLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDbEIsOERBQUs7SUFBQ21CLEVBQUUsRUFBRTtNQUFFQyxLQUFLLEVBQUUsQ0FBQztNQUFFUSxFQUFFLEVBQUU7SUFBRTtFQUFFLGdCQUM3QlgsS0FBQSxDQUFBQyxhQUFBLENBQUNsQiw4REFBSztJQUFDbUIsRUFBRSxFQUFFO01BQUVVLFFBQVEsRUFBRSxDQUFDO01BQUVULEtBQUssRUFBRSxDQUFDO01BQUVVLEdBQUcsRUFBRTtJQUFFO0VBQUUsZ0JBQzNDYixLQUFBLENBQUFDLGFBQUEsQ0FBQ2pCLG1FQUFVO0lBQUM4QixPQUFPLEVBQUMsSUFBSTtJQUFDWixFQUFFLEVBQUU7TUFBRWEsRUFBRSxFQUFFLEdBQUc7TUFBRUMsRUFBRSxFQUFFO0lBQUk7RUFBRSxHQUMvQ3JCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUNWLGVBQ2JLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDYiw0RkFBZSxxQkFDZFksS0FBQSxDQUFBQyxhQUFBLENBQUNYLGtHQUFxQjtJQUFDMkIsS0FBSyxFQUFFdEIsQ0FBQyxDQUFDLGdCQUFnQjtFQUFFLEVBQUcsZUFDckRLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDWixnR0FBbUI7SUFBQ2EsRUFBRSxFQUFFO01BQUVnQixFQUFFLEVBQUUsQ0FBQztNQUFFUCxFQUFFLEVBQUUsQ0FBQztNQUFFRSxHQUFHLEVBQUU7SUFBRTtFQUFFLGdCQUNoRGIsS0FBQSxDQUFBQyxhQUFBLENBQUNSLHlGQUFjO0lBQUNlLElBQUksRUFBRUE7RUFBSyxFQUFHLENBQ1YsQ0FDTixlQUNsQlIsS0FBQSxDQUFBQyxhQUFBLENBQUNiLDRGQUFlLHFCQUNkWSxLQUFBLENBQUFDLGFBQUEsQ0FBQ1gsa0dBQXFCO0lBQUMyQixLQUFLLEVBQUV0QixDQUFDLENBQUMsaUJBQWlCO0VBQUUsRUFBRyxlQUN0REssS0FBQSxDQUFBQyxhQUFBLENBQUNaLGdHQUFtQjtJQUFDYSxFQUFFLEVBQUU7TUFBRWdCLEVBQUUsRUFBRSxDQUFDO01BQUVQLEVBQUUsRUFBRSxDQUFDO01BQUVFLEdBQUcsRUFBRTtJQUFFO0VBQUUsZ0JBQ2hEYixLQUFBLENBQUFDLGFBQUEsQ0FBQ1QseUZBQWM7SUFDYjJCLE9BQU8sRUFBRXRCLE1BQU0sQ0FBQ3VCLFdBQVcsQ0FBQ0MsT0FBTyxDQUFDQyxRQUFTO0lBQzdDTCxLQUFLLEVBQUV0QixDQUFDLENBQUMsbUJBQW1CO0VBQUUsRUFDOUIsZUFDRkssS0FBQSxDQUFBQyxhQUFBLENBQUNWLHNGQUFZO0lBQUMwQixLQUFLLEVBQUV0QixDQUFDLENBQUMsVUFBVTtFQUFFLGdCQUNqQ0ssS0FBQSxDQUFBQyxhQUFBLENBQUNqQixtRUFBVTtJQUFDOEIsT0FBTyxFQUFDO0VBQVMsR0FDMUJqQixNQUFNLENBQUN1QixXQUFXLENBQUNHLE9BQU8sQ0FDaEIsQ0FDQSxDQUNLLENBQ04sQ0FDWixlQUNSdkIsS0FBQSxDQUFBQyxhQUFBLENBQUNsQiw4REFBSztJQUFDbUIsRUFBRSxFQUFFO01BQUVDLEtBQUssRUFBRSxDQUFDO01BQUVFLGNBQWMsRUFBRTtJQUFnQjtFQUFFLGdCQUN2REwsS0FBQSxDQUFBQyxhQUFBLENBQUNsQiw4REFBSztJQUFDeUMsU0FBUyxFQUFDLEtBQUs7SUFBQ3RCLEVBQUUsRUFBRTtNQUFFVyxHQUFHLEVBQUU7SUFBRTtFQUFFLGdCQUNwQ2IsS0FBQSxDQUFBQyxhQUFBLENBQUNwQiwrREFBTTtJQUNMNEMsS0FBSyxFQUFDLFdBQVc7SUFDakJsQixJQUFJLEVBQUMsT0FBTztJQUNaLGVBQVksMkJBQTJCO0lBQ3ZDbUIsT0FBTyxFQUFFQSxDQUFBLEtBQU07TUFDYjNCLGFBQWEsRUFBRTtNQUNmNEIsTUFBTSxDQUFDQyxLQUFLLEVBQUU7SUFDaEIsQ0FBRTtJQUNGQyxTQUFTO0VBQUEsR0FFUmxDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDTCxlQUNUSyxLQUFBLENBQUFDLGFBQUEsQ0FBQ3BCLCtEQUFNO0lBQ0wsZUFBWSw0QkFBNEI7SUFDeEMwQixJQUFJLEVBQUMsT0FBTztJQUNaa0IsS0FBSyxFQUFDLFNBQVM7SUFDZkMsT0FBTyxFQUFFQSxDQUFBLEtBQU07TUFDYjVCLFlBQVksQ0FBQztRQUNYZ0MsTUFBTSxFQUFFNUMsNEZBQXVCO1FBQy9COEMsRUFBRSxFQUFFcEM7TUFDTixDQUFDLENBQUM7SUFDSixDQUFFO0lBQ0ZpQyxTQUFTO0VBQUEsR0FFUmxDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDTixDQUNILENBQ0YsQ0FDRjtBQUVaIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvUmVuYW1lQWNjb3VudC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWNjb3VudHMvbW9kZWxzJztcbmltcG9ydCB7IHVzZUFwcHJvdmVBY3Rpb24gfSBmcm9tICdAc3JjL2hvb2tzL3VzZUFwcHJvdmVBY3Rpb24nO1xuaW1wb3J0IHsgQWN0aW9uU3RhdHVzIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjdGlvbnMvbW9kZWxzJztcbmltcG9ydCB7IHVzZUdldFJlcXVlc3RJZCB9IGZyb20gJ0BzcmMvaG9va3MvdXNlR2V0UmVxdWVzdElkJztcbmltcG9ydCB7XG4gIEFwcHJvdmFsU2VjdGlvbixcbiAgQXBwcm92YWxTZWN0aW9uQm9keSxcbiAgQXBwcm92YWxTZWN0aW9uSGVhZGVyLFxufSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL0FwcHJvdmFsU2VjdGlvbic7XG5pbXBvcnQgeyBUeERldGFpbHNSb3cgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL2FwcHJvdmFsL1R4RGV0YWlsc1Jvdyc7XG5pbXBvcnQge1xuICBBY2NvdW50RGV0YWlscyxcbiAgV2Vic2l0ZURldGFpbHMsXG59IGZyb20gJy4uL1NpZ25UcmFuc2FjdGlvbi9jb21wb25lbnRzL0FwcHJvdmFsVHhEZXRhaWxzJztcbmltcG9ydCB7IERvbWFpbk1ldGFkYXRhIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL21vZGVscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBSZW5hbWVBY2NvdW50KCkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHJlcXVlc3RJZCA9IHVzZUdldFJlcXVlc3RJZCgpO1xuXG4gIGNvbnN0IHsgYWN0aW9uLCB1cGRhdGVBY3Rpb24sIGNhbmNlbEhhbmRsZXIgfSA9IHVzZUFwcHJvdmVBY3Rpb248e1xuICAgIGFjY291bnQ6IEFjY291bnQ7XG4gICAgbmV3TmFtZTogc3RyaW5nO1xuICB9PihyZXF1ZXN0SWQpO1xuXG4gIGlmICghYWN0aW9uKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGFja1xuICAgICAgICBzeD17e1xuICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxDaXJjdWxhclByb2dyZXNzIHNpemU9ezYwfSAvPlxuICAgICAgPC9TdGFjaz5cbiAgICApO1xuICB9XG5cbiAgY29uc3Qgc2l0ZTogRG9tYWluTWV0YWRhdGEgPSBhY3Rpb24uc2l0ZSA/PyB7XG4gICAgZG9tYWluOiAnIycsXG4gICAgbmFtZTogdCgnVW5rbm93biB3ZWJzaXRlJyksXG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIHB4OiAyIH19PlxuICAgICAgPFN0YWNrIHN4PXt7IGZsZXhHcm93OiAxLCB3aWR0aDogMSwgZ2FwOiAzIH19PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiaDRcIiBzeD17eyBtdDogMS41LCBtYjogMy41IH19PlxuICAgICAgICAgIHt0KCdSZW5hbWUgYWNjb3VudD8nKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uPlxuICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ0FjdGlvbiBEZXRhaWxzJyl9IC8+XG4gICAgICAgICAgPEFwcHJvdmFsU2VjdGlvbkJvZHkgc3g9e3sgcHk6IDEsIHB4OiAyLCBnYXA6IDEgfX0+XG4gICAgICAgICAgICA8V2Vic2l0ZURldGFpbHMgc2l0ZT17c2l0ZX0gLz5cbiAgICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgICAgICA8QXBwcm92YWxTZWN0aW9uPlxuICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ0FjY291bnQgRGV0YWlscycpfSAvPlxuICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IHB5OiAxLCBweDogMiwgZ2FwOiAxIH19PlxuICAgICAgICAgICAgPEFjY291bnREZXRhaWxzXG4gICAgICAgICAgICAgIGFkZHJlc3M9e2FjdGlvbi5kaXNwbGF5RGF0YS5hY2NvdW50LmFkZHJlc3NDfVxuICAgICAgICAgICAgICBsYWJlbD17dCgnQWNjb3VudCB0byByZW5hbWUnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdOZXcgbmFtZScpfT5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImNhcHRpb25cIj5cbiAgICAgICAgICAgICAgICB7YWN0aW9uLmRpc3BsYXlEYXRhLm5ld05hbWV9XG4gICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIDwvVHhEZXRhaWxzUm93PlxuICAgICAgICAgIDwvQXBwcm92YWxTZWN0aW9uQm9keT5cbiAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH19PlxuICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3g9e3sgZ2FwOiAxIH19PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInN3aXRjaC1hY2NvdW50LXJlamVjdC1idG5cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBjYW5jZWxIYW5kbGVyKCk7XG4gICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdSZWplY3QnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInN3aXRjaC1hY2NvdW50LWFwcHJvdmUtYnRuXCJcbiAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICB1cGRhdGVBY3Rpb24oe1xuICAgICAgICAgICAgICAgIHN0YXR1czogQWN0aW9uU3RhdHVzLlNVQk1JVFRJTkcsXG4gICAgICAgICAgICAgICAgaWQ6IHJlcXVlc3RJZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZnVsbFdpZHRoXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ0FwcHJvdmUnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJ1c2VUcmFuc2xhdGlvbiIsIkJ1dHRvbiIsIkNpcmN1bGFyUHJvZ3Jlc3MiLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJ1c2VBcHByb3ZlQWN0aW9uIiwiQWN0aW9uU3RhdHVzIiwidXNlR2V0UmVxdWVzdElkIiwiQXBwcm92YWxTZWN0aW9uIiwiQXBwcm92YWxTZWN0aW9uQm9keSIsIkFwcHJvdmFsU2VjdGlvbkhlYWRlciIsIlR4RGV0YWlsc1JvdyIsIkFjY291bnREZXRhaWxzIiwiV2Vic2l0ZURldGFpbHMiLCJSZW5hbWVBY2NvdW50IiwidCIsInJlcXVlc3RJZCIsImFjdGlvbiIsInVwZGF0ZUFjdGlvbiIsImNhbmNlbEhhbmRsZXIiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzeCIsIndpZHRoIiwiaGVpZ2h0IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwic2l6ZSIsInNpdGUiLCJkb21haW4iLCJuYW1lIiwicHgiLCJmbGV4R3JvdyIsImdhcCIsInZhcmlhbnQiLCJtdCIsIm1iIiwibGFiZWwiLCJweSIsImFkZHJlc3MiLCJkaXNwbGF5RGF0YSIsImFjY291bnQiLCJhZGRyZXNzQyIsIm5ld05hbWUiLCJkaXJlY3Rpb24iLCJjb2xvciIsIm9uQ2xpY2siLCJ3aW5kb3ciLCJjbG9zZSIsImZ1bGxXaWR0aCIsInN0YXR1cyIsIlNVQk1JVFRJTkciLCJpZCJdLCJzb3VyY2VSb290IjoiIn0=