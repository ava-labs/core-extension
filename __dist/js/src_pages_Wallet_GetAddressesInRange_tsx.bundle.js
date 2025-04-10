"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_Wallet_GetAddressesInRange_tsx"],{

/***/ "./src/pages/Wallet/GetAddressesInRange.tsx":
/*!**************************************************!*\
  !*** ./src/pages/Wallet/GetAddressesInRange.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GetAddressesInRange": () => (/* binding */ GetAddressesInRange)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/hooks/useApproveAction */ "./src/hooks/useApproveAction.ts");
/* harmony import */ var _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/actions/models */ "./src/background/services/actions/models.ts");
/* harmony import */ var _src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useGetRequestId */ "./src/hooks/useGetRequestId.ts");
/* harmony import */ var _src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/approval/ApprovalSection */ "./src/components/common/approval/ApprovalSection.tsx");
/* harmony import */ var _SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../SignTransaction/components/ApprovalTxDetails */ "./src/pages/SignTransaction/components/ApprovalTxDetails.tsx");
/* harmony import */ var _src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/approval/TxDetailsRow */ "./src/components/common/approval/TxDetailsRow.tsx");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










function GetAddressesInRange() {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_8__.useTranslation)();
  const requestId = (0,_src_hooks_useGetRequestId__WEBPACK_IMPORTED_MODULE_3__.useGetRequestId)();
  const {
    action,
    updateAction,
    cancelHandler
  } = (0,_src_hooks_useApproveAction__WEBPACK_IMPORTED_MODULE_1__.useApproveAction)(requestId);
  if (!action) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
      sx: {
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.CircularProgress, {
      size: 60
    }));
  }
  const site = action.site ?? {
    domain: '#',
    name: t('Unknown website')
  };
  const {
    addresses,
    indices
  } = action.displayData;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      width: 1,
      px: 2,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      flexGrow: 1,
      width: 1,
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "h4",
    sx: {
      mt: 1.5
    }
  }, t('Expose addresses')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Scrollbars, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      gap: 1.5
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_4__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_4__.ApprovalSectionHeader, {
    label: t('Action Details')
  }), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_4__.ApprovalSectionBody, {
    sx: {
      py: 1,
      px: 2,
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_SignTransaction_components_ApprovalTxDetails__WEBPACK_IMPORTED_MODULE_5__.WebsiteDetails, {
    site: site
  }), indices.externalLimit > 0 && /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_6__.TxDetailsRow, {
    label: t('Requested external indices')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, t('From {{start}} to {{end}}', {
    start: indices.externalStart,
    end: indices.externalStart + indices.externalLimit
  }))), indices.internalLimit > 0 && /*#__PURE__*/React.createElement(_src_components_common_approval_TxDetailsRow__WEBPACK_IMPORTED_MODULE_6__.TxDetailsRow, {
    label: t('Requested internal indices')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, t('From {{start}} to {{end}}', {
    start: indices.internalStart,
    end: indices.internalStart + indices.internalLimit
  }))))), addresses.external.length > 0 && /*#__PURE__*/React.createElement(AddressesSection, {
    label: t('External addresses'),
    addresses: addresses.external
  }), addresses.internal.length > 0 && /*#__PURE__*/React.createElement(AddressesSection, {
    label: t('Internal addresses'),
    addresses: addresses.internal
  })))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      width: 1,
      pt: 2,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    direction: "row",
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    color: "secondary",
    size: "large",
    "data-testid": "expose-addresses-reject-btn",
    onClick: () => {
      cancelHandler();
      window.close();
    },
    fullWidth: true
  }, t('Reject')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    "data-testid": "expose-addresses-approve-btn",
    size: "large",
    color: "primary",
    onClick: () => {
      updateAction({
        status: _src_background_services_actions_models__WEBPACK_IMPORTED_MODULE_2__.ActionStatus.SUBMITTING,
        id: requestId
      });
    },
    fullWidth: true
  }, t('Approve')))));
}
const AddressesSection = ({
  label,
  addresses
}) => {
  const [hideAddresses, setHideAddresses] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const shouldWrap = addresses.length > 5;
  return /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_4__.ApprovalSection, null, /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_4__.ApprovalSectionHeader, {
    label: label
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.IconButton, {
    size: "small",
    "data-testid": "show-addresses",
    onClick: () => setHideAddresses(v => !v)
  }, hideAddresses ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.EyeIcon, null) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.EyeOffIcon, null))), /*#__PURE__*/React.createElement(_src_components_common_approval_ApprovalSection__WEBPACK_IMPORTED_MODULE_4__.ApprovalSectionBody, {
    sx: {
      py: 1.5,
      px: 2,
      flexDirection: shouldWrap ? 'row' : 'column',
      justifyContent: shouldWrap ? 'space-between' : 'initial',
      rowGap: 1.5,
      columnGap: 3,
      flexWrap: shouldWrap ? 'wrap' : 'nowrap'
    }
  }, addresses.map(address => /*#__PURE__*/React.createElement(AddressItem, {
    address: address,
    key: address,
    truncate: hideAddresses
  }))));
};
const AddressItem = ({
  address,
  truncate
}) => {
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Tooltip, {
    title: truncate ? address : '',
    sx: {
      flexBasis: '25%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Typography, {
    variant: "caption"
  }, truncate ? (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_7__.truncateAddress)(address) : address));
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX1dhbGxldF9HZXRBZGRyZXNzZXNJblJhbmdlX3RzeC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWlDO0FBQ2M7QUFXVjtBQUcwQjtBQUNRO0FBQ1Y7QUFLSjtBQUN3QjtBQUVMO0FBQ2Y7QUFFdEQsU0FBU29CLG1CQUFtQkEsQ0FBQSxFQUFHO0VBQ3BDLE1BQU07SUFBRUM7RUFBRSxDQUFDLEdBQUdwQiw2REFBYyxFQUFFO0VBQzlCLE1BQU1xQixTQUFTLEdBQUdULDJFQUFlLEVBQUU7RUFFbkMsTUFBTTtJQUFFVSxNQUFNO0lBQUVDLFlBQVk7SUFBRUM7RUFBYyxDQUFDLEdBQzNDZCw2RUFBZ0IsQ0FBaUNXLFNBQVMsQ0FBQztFQUU3RCxJQUFJLENBQUNDLE1BQU0sRUFBRTtJQUNYLG9CQUNFRyxLQUFBLENBQUFDLGFBQUEsQ0FBQ25CLDhEQUFLO01BQ0pvQixFQUFFLEVBQUU7UUFDRkMsS0FBSyxFQUFFLENBQUM7UUFDUkMsTUFBTSxFQUFFLENBQUM7UUFDVEMsY0FBYyxFQUFFLFFBQVE7UUFDeEJDLFVBQVUsRUFBRTtNQUNkO0lBQUUsZ0JBRUZOLEtBQUEsQ0FBQUMsYUFBQSxDQUFDeEIseUVBQWdCO01BQUM4QixJQUFJLEVBQUU7SUFBRyxFQUFHLENBQ3hCO0VBRVo7RUFFQSxNQUFNQyxJQUFvQixHQUFHWCxNQUFNLENBQUNXLElBQUksSUFBSTtJQUMxQ0MsTUFBTSxFQUFFLEdBQUc7SUFDWEMsSUFBSSxFQUFFZixDQUFDLENBQUMsaUJBQWlCO0VBQzNCLENBQUM7RUFFRCxNQUFNO0lBQUVnQixTQUFTO0lBQUVDO0VBQVEsQ0FBQyxHQUFHZixNQUFNLENBQUNnQixXQUFXO0VBRWpELG9CQUNFYixLQUFBLENBQUFDLGFBQUEsQ0FBQ25CLDhEQUFLO0lBQUNvQixFQUFFLEVBQUU7TUFBRUMsS0FBSyxFQUFFLENBQUM7TUFBRVcsRUFBRSxFQUFFLENBQUM7TUFBRUMsUUFBUSxFQUFFO0lBQVM7RUFB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LGFBQUEsQ0FBQ2pCLG1FQUFVO0lBQUNrQyxPQUFPLEVBQUM7RUFBUyxHQUMxQm9DLFFBQVEsR0FBRzdELDJFQUFlLENBQUMwRCxPQUFPLENBQUMsR0FBR0EsT0FBTyxDQUNuQyxDQUNMO0FBRWQsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvV2FsbGV0L0dldEFkZHJlc3Nlc0luUmFuZ2UudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgQ2lyY3VsYXJQcm9ncmVzcyxcbiAgRXllSWNvbixcbiAgRXllT2ZmSWNvbixcbiAgSWNvbkJ1dHRvbixcbiAgU2Nyb2xsYmFycyxcbiAgU3RhY2ssXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmltcG9ydCB7IEdldEFkZHJlc3Nlc0luUmFuZ2VEaXNwbGF5RGF0YSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9hY2NvdW50cy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQXBwcm92ZUFjdGlvbiB9IGZyb20gJ0BzcmMvaG9va3MvdXNlQXBwcm92ZUFjdGlvbic7XG5pbXBvcnQgeyBBY3Rpb25TdGF0dXMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvYWN0aW9ucy9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlR2V0UmVxdWVzdElkIH0gZnJvbSAnQHNyYy9ob29rcy91c2VHZXRSZXF1ZXN0SWQnO1xuaW1wb3J0IHtcbiAgQXBwcm92YWxTZWN0aW9uLFxuICBBcHByb3ZhbFNlY3Rpb25Cb2R5LFxuICBBcHByb3ZhbFNlY3Rpb25IZWFkZXIsXG59IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvQXBwcm92YWxTZWN0aW9uJztcbmltcG9ydCB7IFdlYnNpdGVEZXRhaWxzIH0gZnJvbSAnLi4vU2lnblRyYW5zYWN0aW9uL2NvbXBvbmVudHMvQXBwcm92YWxUeERldGFpbHMnO1xuaW1wb3J0IHsgRG9tYWluTWV0YWRhdGEgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvbW9kZWxzJztcbmltcG9ydCB7IFR4RGV0YWlsc1JvdyB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vYXBwcm92YWwvVHhEZXRhaWxzUm93JztcbmltcG9ydCB7IHRydW5jYXRlQWRkcmVzcyB9IGZyb20gJ0BzcmMvdXRpbHMvdHJ1bmNhdGVBZGRyZXNzJztcblxuZXhwb3J0IGZ1bmN0aW9uIEdldEFkZHJlc3Nlc0luUmFuZ2UoKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgcmVxdWVzdElkID0gdXNlR2V0UmVxdWVzdElkKCk7XG5cbiAgY29uc3QgeyBhY3Rpb24sIHVwZGF0ZUFjdGlvbiwgY2FuY2VsSGFuZGxlciB9ID1cbiAgICB1c2VBcHByb3ZlQWN0aW9uPEdldEFkZHJlc3Nlc0luUmFuZ2VEaXNwbGF5RGF0YT4ocmVxdWVzdElkKTtcblxuICBpZiAoIWFjdGlvbikge1xuICAgIHJldHVybiAoXG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8Q2lyY3VsYXJQcm9ncmVzcyBzaXplPXs2MH0gLz5cbiAgICAgIDwvU3RhY2s+XG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IHNpdGU6IERvbWFpbk1ldGFkYXRhID0gYWN0aW9uLnNpdGUgPz8ge1xuICAgIGRvbWFpbjogJyMnLFxuICAgIG5hbWU6IHQoJ1Vua25vd24gd2Vic2l0ZScpLFxuICB9O1xuXG4gIGNvbnN0IHsgYWRkcmVzc2VzLCBpbmRpY2VzIH0gPSBhY3Rpb24uZGlzcGxheURhdGE7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgd2lkdGg6IDEsIHB4OiAyLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XG4gICAgICA8U3RhY2sgc3g9e3sgZmxleEdyb3c6IDEsIHdpZHRoOiAxLCBnYXA6IDMgfX0+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiIHN4PXt7IG10OiAxLjUgfX0+XG4gICAgICAgICAge3QoJ0V4cG9zZSBhZGRyZXNzZXMnKX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuXG4gICAgICAgIDxTY3JvbGxiYXJzPlxuICAgICAgICAgIDxTdGFjayBzeD17eyBnYXA6IDEuNSB9fT5cbiAgICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb24+XG4gICAgICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e3QoJ0FjdGlvbiBEZXRhaWxzJyl9IC8+XG4gICAgICAgICAgICAgIDxBcHByb3ZhbFNlY3Rpb25Cb2R5IHN4PXt7IHB5OiAxLCBweDogMiwgZ2FwOiAxIH19PlxuICAgICAgICAgICAgICAgIDxXZWJzaXRlRGV0YWlscyBzaXRlPXtzaXRlfSAvPlxuICAgICAgICAgICAgICAgIHtpbmRpY2VzLmV4dGVybmFsTGltaXQgPiAwICYmIChcbiAgICAgICAgICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ1JlcXVlc3RlZCBleHRlcm5hbCBpbmRpY2VzJyl9PlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdGcm9tIHt7c3RhcnR9fSB0byB7e2VuZH19Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGluZGljZXMuZXh0ZXJuYWxTdGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogaW5kaWNlcy5leHRlcm5hbFN0YXJ0ICsgaW5kaWNlcy5leHRlcm5hbExpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHtpbmRpY2VzLmludGVybmFsTGltaXQgPiAwICYmIChcbiAgICAgICAgICAgICAgICAgIDxUeERldGFpbHNSb3cgbGFiZWw9e3QoJ1JlcXVlc3RlZCBpbnRlcm5hbCBpbmRpY2VzJyl9PlxuICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdGcm9tIHt7c3RhcnR9fSB0byB7e2VuZH19Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGluZGljZXMuaW50ZXJuYWxTdGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogaW5kaWNlcy5pbnRlcm5hbFN0YXJ0ICsgaW5kaWNlcy5pbnRlcm5hbExpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICA8L1R4RGV0YWlsc1Jvdz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgICAgICAgICA8L0FwcHJvdmFsU2VjdGlvbj5cbiAgICAgICAgICAgIHthZGRyZXNzZXMuZXh0ZXJuYWwubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgIDxBZGRyZXNzZXNTZWN0aW9uXG4gICAgICAgICAgICAgICAgbGFiZWw9e3QoJ0V4dGVybmFsIGFkZHJlc3NlcycpfVxuICAgICAgICAgICAgICAgIGFkZHJlc3Nlcz17YWRkcmVzc2VzLmV4dGVybmFsfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHthZGRyZXNzZXMuaW50ZXJuYWwubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgIDxBZGRyZXNzZXNTZWN0aW9uXG4gICAgICAgICAgICAgICAgbGFiZWw9e3QoJ0ludGVybmFsIGFkZHJlc3NlcycpfVxuICAgICAgICAgICAgICAgIGFkZHJlc3Nlcz17YWRkcmVzc2VzLmludGVybmFsfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1Njcm9sbGJhcnM+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFN0YWNrIHN4PXt7IHdpZHRoOiAxLCBwdDogMiwganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9fT5cbiAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIHN4PXt7IGdhcDogMSB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBjb2xvcj1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBzaXplPVwibGFyZ2VcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJleHBvc2UtYWRkcmVzc2VzLXJlamVjdC1idG5cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBjYW5jZWxIYW5kbGVyKCk7XG4gICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdSZWplY3QnKX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImV4cG9zZS1hZGRyZXNzZXMtYXBwcm92ZS1idG5cIlxuICAgICAgICAgICAgc2l6ZT1cImxhcmdlXCJcbiAgICAgICAgICAgIGNvbG9yPVwicHJpbWFyeVwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHVwZGF0ZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBBY3Rpb25TdGF0dXMuU1VCTUlUVElORyxcbiAgICAgICAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBmdWxsV2lkdGhcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnQXBwcm92ZScpfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuXG5jb25zdCBBZGRyZXNzZXNTZWN0aW9uID0gKHtcbiAgbGFiZWwsXG4gIGFkZHJlc3Nlcyxcbn06IHtcbiAgbGFiZWw6IHN0cmluZztcbiAgYWRkcmVzc2VzOiBzdHJpbmdbXTtcbn0pID0+IHtcbiAgY29uc3QgW2hpZGVBZGRyZXNzZXMsIHNldEhpZGVBZGRyZXNzZXNdID0gdXNlU3RhdGUodHJ1ZSk7XG5cbiAgY29uc3Qgc2hvdWxkV3JhcCA9IGFkZHJlc3Nlcy5sZW5ndGggPiA1O1xuXG4gIHJldHVybiAoXG4gICAgPEFwcHJvdmFsU2VjdGlvbj5cbiAgICAgIDxBcHByb3ZhbFNlY3Rpb25IZWFkZXIgbGFiZWw9e2xhYmVsfT5cbiAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2hvdy1hZGRyZXNzZXNcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEhpZGVBZGRyZXNzZXMoKHYpID0+ICF2KX1cbiAgICAgICAgPlxuICAgICAgICAgIHtoaWRlQWRkcmVzc2VzID8gPEV5ZUljb24gLz4gOiA8RXllT2ZmSWNvbiAvPn1cbiAgICAgICAgPC9JY29uQnV0dG9uPlxuICAgICAgPC9BcHByb3ZhbFNlY3Rpb25IZWFkZXI+XG4gICAgICA8QXBwcm92YWxTZWN0aW9uQm9keVxuICAgICAgICBzeD17e1xuICAgICAgICAgIHB5OiAxLjUsXG4gICAgICAgICAgcHg6IDIsXG4gICAgICAgICAgZmxleERpcmVjdGlvbjogc2hvdWxkV3JhcCA/ICdyb3cnIDogJ2NvbHVtbicsXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6IHNob3VsZFdyYXAgPyAnc3BhY2UtYmV0d2VlbicgOiAnaW5pdGlhbCcsXG4gICAgICAgICAgcm93R2FwOiAxLjUsXG4gICAgICAgICAgY29sdW1uR2FwOiAzLFxuICAgICAgICAgIGZsZXhXcmFwOiBzaG91bGRXcmFwID8gJ3dyYXAnIDogJ25vd3JhcCcsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHthZGRyZXNzZXMubWFwKChhZGRyZXNzKSA9PiAoXG4gICAgICAgICAgPEFkZHJlc3NJdGVtXG4gICAgICAgICAgICBhZGRyZXNzPXthZGRyZXNzfVxuICAgICAgICAgICAga2V5PXthZGRyZXNzfVxuICAgICAgICAgICAgdHJ1bmNhdGU9e2hpZGVBZGRyZXNzZXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L0FwcHJvdmFsU2VjdGlvbkJvZHk+XG4gICAgPC9BcHByb3ZhbFNlY3Rpb24+XG4gICk7XG59O1xuXG5jb25zdCBBZGRyZXNzSXRlbSA9ICh7XG4gIGFkZHJlc3MsXG4gIHRydW5jYXRlLFxufToge1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIHRydW5jYXRlOiBib29sZWFuO1xufSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxUb29sdGlwIHRpdGxlPXt0cnVuY2F0ZSA/IGFkZHJlc3MgOiAnJ30gc3g9e3sgZmxleEJhc2lzOiAnMjUlJyB9fT5cbiAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJjYXB0aW9uXCI+XG4gICAgICAgIHt0cnVuY2F0ZSA/IHRydW5jYXRlQWRkcmVzcyhhZGRyZXNzKSA6IGFkZHJlc3N9XG4gICAgICA8L1R5cG9ncmFwaHk+XG4gICAgPC9Ub29sdGlwPlxuICApO1xufTtcbiJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZVRyYW5zbGF0aW9uIiwiQnV0dG9uIiwiQ2lyY3VsYXJQcm9ncmVzcyIsIkV5ZUljb24iLCJFeWVPZmZJY29uIiwiSWNvbkJ1dHRvbiIsIlNjcm9sbGJhcnMiLCJTdGFjayIsIlRvb2x0aXAiLCJUeXBvZ3JhcGh5IiwidXNlQXBwcm92ZUFjdGlvbiIsIkFjdGlvblN0YXR1cyIsInVzZUdldFJlcXVlc3RJZCIsIkFwcHJvdmFsU2VjdGlvbiIsIkFwcHJvdmFsU2VjdGlvbkJvZHkiLCJBcHByb3ZhbFNlY3Rpb25IZWFkZXIiLCJXZWJzaXRlRGV0YWlscyIsIlR4RGV0YWlsc1JvdyIsInRydW5jYXRlQWRkcmVzcyIsIkdldEFkZHJlc3Nlc0luUmFuZ2UiLCJ0IiwicmVxdWVzdElkIiwiYWN0aW9uIiwidXBkYXRlQWN0aW9uIiwiY2FuY2VsSGFuZGxlciIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJoZWlnaHQiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJzaXplIiwic2l0ZSIsImRvbWFpbiIsIm5hbWUiLCJhZGRyZXNzZXMiLCJpbmRpY2VzIiwiZGlzcGxheURhdGEiLCJweCIsIm92ZXJmbG93IiwiZmxleEdyb3ciLCJnYXAiLCJ2YXJpYW50IiwibXQiLCJsYWJlbCIsInB5IiwiZXh0ZXJuYWxMaW1pdCIsInN0YXJ0IiwiZXh0ZXJuYWxTdGFydCIsImVuZCIsImludGVybmFsTGltaXQiLCJpbnRlcm5hbFN0YXJ0IiwiZXh0ZXJuYWwiLCJsZW5ndGgiLCJBZGRyZXNzZXNTZWN0aW9uIiwiaW50ZXJuYWwiLCJwdCIsImRpcmVjdGlvbiIsImNvbG9yIiwib25DbGljayIsIndpbmRvdyIsImNsb3NlIiwiZnVsbFdpZHRoIiwic3RhdHVzIiwiU1VCTUlUVElORyIsImlkIiwiaGlkZUFkZHJlc3NlcyIsInNldEhpZGVBZGRyZXNzZXMiLCJzaG91bGRXcmFwIiwidiIsImZsZXhEaXJlY3Rpb24iLCJyb3dHYXAiLCJjb2x1bW5HYXAiLCJmbGV4V3JhcCIsIm1hcCIsImFkZHJlc3MiLCJBZGRyZXNzSXRlbSIsImtleSIsInRydW5jYXRlIiwidGl0bGUiLCJmbGV4QmFzaXMiXSwic291cmNlUm9vdCI6IiJ9