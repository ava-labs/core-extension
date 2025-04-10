"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Wallet_RenameWallet_tsx"],{

/***/ "./src/pages/Wallet/RenameWallet.tsx":
/*!*******************************************!*\
  !*** ./src/pages/Wallet/RenameWallet.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RenameWallet": () => (/* binding */ RenameWallet)
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








function RenameWallet() {
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
  }, t('Rename Wallet?')), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionHeader, {
    label: t('Wallet Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionBody, {
    sx: {
      py: 1,
      px: 2,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_5__.WebsiteDetails, {
    site: site
  }))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionHeader, {
    label: t('Wallet Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_3__.ApprovalSectionBody, {
    sx: {
      py: 1,
      px: 2,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_4__.TxDetailsRow, {
    label: t('Old Wallet Name')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Typography, {
    variant: "caption"
  }, action.displayData.walletName)), /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_4__.TxDetailsRow, {
    label: t('New Wallet Name')
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
    "data-testid": "rename-wallet-reject-btn",
    onClick: () => {
      cancelHandler();
      window.close();
    },
    fullWidth: true
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    "data-testid": "rename-wallet-approve-btn",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1dhbGxldF9SZW5hbWVXYWxsZXRfdHN4LmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStDO0FBTVY7QUFFMEI7QUFDUTtBQUNWO0FBS0o7QUFDbUI7QUFDSztBQUcxRSxTQUFTYSxZQUFZQSxDQUFBLEVBQUc7RUFDN0IsTUFBTTtJQUFFQztFQUFFLENBQUMsR0FBR2QsNkRBQWMsRUFBRTtFQUM5QixNQUFNZSxTQUFTLEdBQUdSLDJFQUFlLEVBQUU7RUFFbkMsTUFBTTtJQUFFUyxNQUFNO0lBQUVDLFlBQVk7SUFBRUM7RUFBYyxDQUFDLEdBQUdiLDZFQUFnQixDQUk3RFUsU0FBUyxDQUFDO0VBRWIsSUFBSSxDQUFDQyxNQUFNLEVBQUU7SUFDWCxvQkFDRUcsS0FBQSxDQUFBQyxhQUFBLENBQUNqQiw4REFBSztNQUNKa0IsRUFBRSxFQUFFO1FBQ0ZDLEtBQUssRUFBRSxDQUFDO1FBQ1JDLE1BQU0sRUFBRSxDQUFDO1FBQ1RDLGNBQWMsRUFBRSxRQUFRO1FBQ3hCQyxVQUFVLEVBQUU7TUFDZDtJQUFFLGdCQUVGTixLQUFBLENBQUFDLGFBQUEsQ0FBQ2xCLHlFQUFnQjtNQUFDd0IsSUFBSSxFQUFFO0lBQUcsRUFBRyxDQUN4QjtFQUVaO0VBRUEsTUFBTUMsSUFBb0IsR0FBR1gsTUFBTSxDQUFDVyxJQUFJLElBQUk7SUFDMUNDLE1BQU0sRUFBRSxHQUFHO0lBQ1hDLElBQUksRUFBRWYsQ0FBQyxDQUFDLGlCQUFpQjtFQUMzQixDQUFDO0VBRUQsb0JBQ0VLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDakIsOERBQUs7SUFBQ2tCLEVBQUUsRUFBRTtNQUFFQyxLQUFLLEVBQUUsQ0FBQztNQUFFUSxFQUFFLEVBQUU7SUFBRTtFQUFFLGdCQUM3QlgsS0FBQSxDQUFBQyxhQUFBLENBQUNqQiw4REFBSztJQUFDa0IsRUFBRSxFQUFFO01BQUVVLFFBQVEsRUFBRSxDQUFDO01BQUVULEtBQUssRUFBRSxDQUFDO01BQUVVLEdBQUcs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LENBQ0YsQ0FDRjtBQUVaIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9XYWxsZXQvUmVuYW1lV2FsbGV0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDaXJjdWxhclByb2dyZXNzLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgdXNlQXBwcm92ZUFjdGlvbiB9IGZyb20gJ0BzcmMvaG9va3MvdXNlQXBwcm92ZUFjdGlvbic7XG5pbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlR2V0UmVxdWVzdElkIH0gZnJvbSAnQHNyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQnO1xuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcbmltcG9ydCB7IFdlYnNpdGVEZXRhaWxzIH0gZnJvbSAnLi4vU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvQXBwcm92YWxUeERldGFpbHMnO1xuaW1wb3J0IHsgRG9tYWluTWV0YWRhdGEgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvbW9kZWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlbmFtZVdhbGxldCgpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCByZXF1ZXN0SWQgPSB1c2VHZXRSZXF1ZXN0SWQoKTtcblxuICBjb25zdCB7IGFjdGlvbiwgdXBkYXRlQWN0aW9uLCBjYW5jZWxIYW5kbGVyIH0gPSB1c2VBcHByb3ZlQWN0aW9uPHtcbiAgICB3YWxsZXRJZDogc3RyaW5nO1xuICAgIG5ld05hbWU6IHN0cmluZztcbiAgICB3YWxsZXROYW1lOiBzdHJpbmc7XG4gIH0+KHJlcXVlc3RJZCk7XG5cbiAgaWYgKCFhY3Rpb24pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPENpcmN1bGFyUHJvZ3Jlc3Mgc2l6ZT17NjB9IC8+XG4gICAgICA8L1N0YWNrPlxuICAgICk7XG4gIH1cblxuICBjb25zdCBzaXRlOiBEb21haW5NZXRhZGF0YSA9IGFjdGlvbi5zaXRlID8/IHtcbiAgICBkb21haW46ICcjJyxcbiAgICBuYW1lOiB0KCdVbmtub3duIHdlYnNpdGUnKSxcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSwgcHg6IDIgfX0+XG4gICAgICA8U3RhY2sgc3g9e3sgZmxleEdyb3c6IDEsIHdpZHRoOiAxLCBnYXA6IDMgfX0+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiIHN4PXt7IG10OiAxLjUsIG1iOiAzLjUgfX0+XG4gICAgICAgICAge3QoJ1JlbmFtZSBXYWxsZXQ/Jyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbj5cbiAgICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdXYWxsZXQgRGV0YWlscycpfSAvPlxuICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IHB5OiAxLCBweDogMiwgZ2FwOiAxIH19PlxuICAgICAgICAgICAgPFdlYnNpdGVEZXRhaWxzIHNpdGU9e3NpdGV9IC8+XG4gICAgICAgICAgPC9BcHByb3ZhbFNlY3Rpb25Cb2R5PlxuICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgICAgPEFwcHJvdmFsU2VjdGlvbj5cbiAgICAgICAgICA8QXBwcm92YWxTZWN0aW9uSGVhZGVyIGxhYmVsPXt0KCdXYWxsZXQgRGV0YWlscycpfSAvPlxuICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IHB5OiAxLCBweDogMiwgZ2FwOiAxIH19PlxuICAgICAgICAgICAgPFR4RGV0YWlsc1JvdyBsYWJlbD17dCgnT2xkIFdhbGxldCBOYW1lJyl9PlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgIHthY3Rpb24uZGlzcGxheURhdGEud2FsbGV0TmFtZX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9UeERldGFpbHNSb3c+XG4gICAgICAgICAgICA8VHhEZXRhaWxzUm93IGxhYmVsPXt0KCdOZXcgV2FsbGV0IE5hbWUnKX0+XG4gICAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICAgICAge2FjdGlvbi5kaXNwbGF5RGF0YS5uZXdOYW1lfVxuICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICAgIDwvQXBwcm92YWxTZWN0aW9uPlxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTdGFjayBzeD17eyB3aWR0aDogMSwganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIHN4PXt7IGdhcDogMSB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJyZW5hbWUtd2FsbGV0LXJlamVjdC1idG5cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBjYW5jZWxIYW5kbGVyKCk7XG4gICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdSZWplY3QnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInJlbmFtZS13YWxsZXQtYXBwcm92ZS1idG5cIlxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyxcbiAgICAgICAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnQXBwcm92ZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIl0sIm5hbWVzIjpbInVzZVRyYW5zbGF0aW9uIiwiQnV0dG9uIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIlN0YWNrIiwiVHlwb2dyYXBoeSIsInVzZUFwcHJvdmVBY3Rpb24iLCJBY3Rpb25TdGF0dXMiLCJ1c2VHZXRSZXF1ZXN0SWQiLCJBcHByb3ZhbFNlY3Rpb24iLCJBcHByb3ZhbFNlY3Rpb25Cb2R5IiwiQXBwcm92YWxTZWN0aW9uSGVhZGVyIiwiVHhEZXRhaWxzUm93IiwiV2Vic2l0ZURldGFpbHMiLCJSZW5hbWVXYWxsZXQiLCJ0IiwicmVxdWVzdElkIiwiYWN0aW9uIiwidXBkYXRlQWN0aW9uIiwiY2FuY2VsSGFuZGxlciIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJoZWlnaHQiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJzaXplIiwic2l0ZSIsImRvbWFpbiIsIm5hbWUiLCJweCIsImZsZXhHcm93IiwiZ2FwIiwidmFyaWFudCIsIm10IiwibWIiLCJsYWJlbCIsInB5IiwiZGlzcGxheURhdGEiLCJ3YWxsZXROYW1lIiwibmV3TmFtZSIsImRpcmVjdGlvbiIsImNvbG9yIiwib25DbGljayIsIndpbmRvdyIsImNsb3NlIiwiZnVsbFdpZHRoIiwic3RhdHVzIiwiU1VCTUlUVElORyIsImlkIl0sInNvdXJjZVJvb3QiOiIifQ==