"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_pages_ManageTokens_ManageTokens_tsx-src_pages_ManageTokens_ManageTokensList_tsx"],{

/***/ "./src/components/common/MaliciousTokenWarning.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/MaliciousTokenWarning.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MaliciousTokenWarningBox": () => (/* binding */ MaliciousTokenWarningBox),
/* harmony export */   "MaliciousTokenWarningIcon": () => (/* binding */ MaliciousTokenWarningIcon)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/pages/Permissions/components/WarningBox */ "./src/pages/Permissions/components/WarningBox.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const MaliciousTokenWarningBox = props => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Box, props, /*#__PURE__*/React.createElement(_src_pages_Permissions_components_WarningBox__WEBPACK_IMPORTED_MODULE_0__.WarningBox, {
    title: t('Malicious Token'),
    text: t('This token has been flagged as malicious. Use caution when interacting with it.')
  }));
};
const MaliciousTokenWarningIcon = ({
  size
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    title: t('This token has been flagged as malicious')
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.AlertTriangleIcon, {
    color: theme.palette.warning.main,
    size: size ?? 16
  }));
};

/***/ }),

/***/ "./src/components/common/scrollbars/Scrollbars.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/scrollbars/Scrollbars.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scrollbars": () => (/* binding */ Scrollbars)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var react_custom_scrollbars_2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-custom-scrollbars-2 */ "./node_modules/react-custom-scrollbars-2/lib/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




// See https://github.com/RobPethick/react-custom-scrollbars-2/blob/master/docs/API.md
// for available props
const Scrollbars = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(function Scrollbars(props, ref) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const renderThumb = ({
    style,
    ...rest
  }) => {
    const thumbStyle = {
      backgroundColor: theme.palette.grey[800],
      borderRadius: 9999
    };
    return /*#__PURE__*/React.createElement("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      style: {
        ...style,
        ...thumbStyle
      }
    }, rest));
  };
  return /*#__PURE__*/React.createElement(react_custom_scrollbars_2__WEBPACK_IMPORTED_MODULE_1__.Scrollbars, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    renderThumbVertical: renderThumb,
    ref: ref
  }, props));
});

/***/ }),

/***/ "./src/pages/ManageTokens/ManageTokens.tsx":
/*!*************************************************!*\
  !*** ./src/pages/ManageTokens/ManageTokens.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ManageTokens": () => (/* binding */ ManageTokens),
/* harmony export */   "Sort": () => (/* binding */ Sort)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _ManageTokensList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ManageTokensList */ "./src/pages/ManageTokens/ManageTokensList.tsx");
/* harmony import */ var _src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/common/scrollbars/Scrollbars */ "./src/components/common/scrollbars/Scrollbars.tsx");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");
/* harmony import */ var _src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");







let Sort = /*#__PURE__*/function (Sort) {
  Sort["TOKEN_AMOUNT"] = "Token Amount";
  Sort["NAME"] = "Name";
  Sort["BALANCE"] = "Balance";
  return Sort;
}({});
const ManageTokens = () => {
  const history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useHistory)();
  const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.useTranslation)();
  const [showSortMenu, setShowSortMenu] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const sortItems = {
    [Sort.TOKEN_AMOUNT]: t('Token Amount'),
    [Sort.NAME]: t('Name'),
    [Sort.BALANCE]: t('Balance')
  };
  const [selectedSort, setSelectedSort] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(Sort.TOKEN_AMOUNT);
  function handleSortChange(keyName) {
    setSelectedSort(keyName);
    setShowSortMenu(false);
  }
  const FilterItem = ({
    keyName,
    onClick
  }) => {
    function onClickHandler() {
      onClick(keyName);
    }
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.MenuItem, {
      disableRipple: true,
      onClick: onClickHandler,
      sx: {
        height: 32,
        minHeight: 32
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
      sx: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
      variant: "body2",
      sx: {
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      title: keyName
    }, keyName), selectedSort === keyName && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.CheckIcon, {
      size: 12
    })));
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_PageTitle__WEBPACK_IMPORTED_MODULE_3__.PageTitle, null, t('Manage Tokens')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexGrow: 1,
      width: '100%',
      py: 1,
      px: 2,
      rowGap: '30px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.SearchBar, {
    "data-testid": "search-token-list-input",
    placeholder: t('Search'),
    onChange: event => setSearchQuery(event.target.value),
    autoFocus: true
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    variant: "text",
    "data-testid": "add-custom-token-button",
    onClick: () => history.push('/manage-tokens/add'),
    sx: {
      alignSelf: 'flex-start',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    direction: "row",
    alignItems: "center",
    sx: {
      height: '24px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    justifyContent: "center",
    alignItems: "center",
    sx: {
      width: '24px',
      height: '24px'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.PlusIcon, {
    size: 20
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    sx: {
      mx: 1
    }
  }, t('Add Custom Token')))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      justifyContent: 'flex-end',
      position: 'relative'
    },
    onClick: () => {
      setShowSortMenu(!showSortMenu);
    },
    "data-testid": "filter-activity-menu"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    variant: "caption",
    sx: {
      m: '0 8px 0 5px',
      fontWeight: 'fontWeightMedium'
    }
  }, t('Sort By'), ": ", selectedSort), showSortMenu ? /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ChevronUpIcon, {
    size: 20
  }) : /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.ChevronDownIcon, {
    size: 20
  }), showSortMenu && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      position: 'absolute',
      top: '30px',
      right: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.MenuList, {
    "data-testid": "sort-list-options",
    sx: {
      width: 160,
      justifyContent: 'flex-start',
      zIndex: 1,
      height: 120
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__.Scrollbars, {
    style: {
      flexGrow: 1,
      maxHeight: 'unset',
      height: '100%'
    }
  }, Object.keys(sortItems).map(sortItem => /*#__PURE__*/React.createElement(FilterItem, {
    key: sortItem,
    keyName: sortItem,
    onClick: handleSortChange
  }))))))), /*#__PURE__*/React.createElement(_src_components_common_scrollbars_Scrollbars__WEBPACK_IMPORTED_MODULE_2__.Scrollbars, {
    style: {
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement(_ManageTokensList__WEBPACK_IMPORTED_MODULE_1__.ManageTokensList, {
    searchQuery: searchQuery,
    sort: selectedSort
  }))));
};

/***/ }),

/***/ "./src/pages/ManageTokens/ManageTokensList.tsx":
/*!*****************************************************!*\
  !*** ./src/pages/ManageTokens/ManageTokensList.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ManageTokensList": () => (/* binding */ ManageTokensList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/hooks/useTokensWithBalances */ "./src/hooks/useTokensWithBalances.ts");
/* harmony import */ var _src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/components/common/TokenIcon */ "./src/components/common/TokenIcon.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_utils_isTokenMalicious__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/isTokenMalicious */ "./src/utils/isTokenMalicious.ts");
/* harmony import */ var _src_components_common_MaliciousTokenWarning__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/components/common/MaliciousTokenWarning */ "./src/components/common/MaliciousTokenWarning.tsx");
/* harmony import */ var _ManageTokens__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ManageTokens */ "./src/pages/ManageTokens/ManageTokens.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");









const ManageTokensList = ({
  searchQuery,
  sort
}) => {
  const tokensWithBalances = (0,_src_hooks_useTokensWithBalances__WEBPACK_IMPORTED_MODULE_2__.useTokensWithBalances)({
    forceShowTokensWithoutBalances: true,
    forceHiddenTokens: true
  });
  const sortingTokens = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (a, b) => {
    if (sort === _ManageTokens__WEBPACK_IMPORTED_MODULE_7__.Sort.NAME) {
      return b.name - a.name;
    }
    if (sort === _ManageTokens__WEBPACK_IMPORTED_MODULE_7__.Sort.BALANCE) {
      return (parseFloat(b.balanceCurrencyDisplayValue) || 0) - (parseFloat(a.balanceCurrencyDisplayValue) || 0);
    }
    return (parseFloat(b.balanceDisplayValue) || 0) - (parseFloat(a.balanceDisplayValue) || 0);
  }, [sort]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Divider, {
      flexItem: true,
      sx: {
        borderColor: 'grey.800'
      }
    }),
    sx: {
      rowGap: '10px'
    }
  }, tokensWithBalances.filter(token => token.type !== _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.NATIVE && (searchQuery.length ? token.name.toLowerCase().includes(searchQuery.toLowerCase()) || token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) : true)).sort(sortingTokens).map(token => /*#__PURE__*/React.createElement(ManageTokensListItem, {
    key: token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.ERC20 ? token.address : token.symbol,
    token: token
  })));
};
const ManageTokensListItem = ({
  token
}) => {
  const {
    getTokenVisibility,
    toggleTokenVisibility
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_4__.useSettingsContext)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    direction: "row",
    "data-testid": `${token.symbol.toLowerCase()}-token-list-item`,
    justifyContent: "space-between",
    alignItems: "center",
    sx: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    direction: "row",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(_src_components_common_TokenIcon__WEBPACK_IMPORTED_MODULE_3__.TokenIcon, {
    width: "32px",
    height: "32px",
    src: token.logoUri,
    name: token.name
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      mx: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, {
    sx: {
      mb: 0.5
    }
  }, token.name), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Typography, null, token.balanceDisplayValue))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1
    }
  }, (0,_src_utils_isTokenMalicious__WEBPACK_IMPORTED_MODULE_5__.isTokenMalicious)(token) && /*#__PURE__*/React.createElement(_src_components_common_MaliciousTokenWarning__WEBPACK_IMPORTED_MODULE_6__.MaliciousTokenWarningIcon, {
    size: 16
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__.Switch, {
    size: "small",
    checked: getTokenVisibility(token),
    onChange: () => toggleTokenVisibility(token)
  })));
};

/***/ }),

/***/ "./src/pages/Permissions/components/WarningBox.tsx":
/*!*********************************************************!*\
  !*** ./src/pages/Permissions/components/WarningBox.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WarningBox": () => (/* binding */ WarningBox)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

function WarningBox({
  title,
  text
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Alert, {
    severity: "warning",
    icon: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.GppMaybeIcon, {
      size: 24,
      color: theme.palette.common.black
    }),
    sx: {
      backgroundColor: 'warning.light',
      borderColor: 'transparent',
      px: 2,
      color: 'common.black',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.AlertContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      fontWeight: 600,
      display: 'block'
    }
  }, title), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "caption",
    sx: {
      display: 'block'
    }
  }, text)));
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3BhZ2VzX01hbmFnZVRva2Vuc19NYW5hZ2VUb2tlbnNfdHN4LXNyY19wYWdlc19NYW5hZ2VUb2tlbnNfTWFuYWdlVG9rZW5zTGlzdF90c3guYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNcUM7QUFDVTtBQUUyQjtBQUVuRSxNQUFNTSx3QkFBd0IsR0FBSUMsS0FBZSxJQUFLO0VBQzNELE1BQU07SUFBRUM7RUFBRSxDQUFDLEdBQUdKLDZEQUFjLEVBQUU7RUFFOUIsb0JBQ0VLLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVCw0REFBRyxFQUFLTSxLQUFLLGVBQ1pFLEtBQUEsQ0FBQUMsYUFBQSxDQUFDTCxvRkFBVTtJQUNUTSxLQUFLLEVBQUVILENBQUMsQ0FBQyxpQkFBaUIsQ0FBRTtJQUM1QkksSUFBSSxFQUFFSixDQUFDLENBQ0wsaUZBQWlGO0VBQ2pGLEVBQ0YsQ0FDRTtBQUVWLENBQUM7QUFFTSxNQUFNSyx5QkFBeUIsR0FBR0EsQ0FBQztFQUFFQztBQUF3QixDQUFDLEtBQUs7RUFDeEUsTUFBTTtJQUFFTjtFQUFFLENBQUMsR0FBR0osNkRBQWMsRUFBRTtFQUM5QixNQUFNVyxLQUFLLEdBQUdaLHVFQUFRLEVBQUU7RUFFeEIsb0JBQ0VNLEtBQUEsQ0FBQUMsYUFBQSxDQUFDUixnRUFBTztJQUFDUyxLQUFLLEVBQUVILENBQUMsQ0FBQywwQ0FBMEM7RUFBRSxnQkFDNURDLEtBQUEsQ0FBQUMsYUFBQSxDQUFDViwwRUFBaUI7SUFBQ2dCLEtBQUssRUFBRUQsS0FBSyxDQUFDRSxPQUFPLENBQUNDLE9BQU8sQ0FBQ0MsSUFBSztJQUFDTCxJQUFJLEVBQUVBLElBQUksSUFBSTtFQUFHLEVBQUcsQ0FDbEU7QUFFZCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25DNkQ7QUFDaEI7QUFDUztBQUl2RDtBQUNBO0FBQ08sTUFBTVEsVUFBVSxnQkFBR0QsaURBQVUsQ0FBQyxTQUFTQyxVQUFVQSxDQUN0RGYsS0FBc0MsRUFDdENnQixH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USxFQUFFQSxDQUFBLEtBQU0wRCxxQkFBcUIsQ0FBQ1gsS0FBSztFQUFFLEVBQzdDLENBQ0ksQ0FDRjtBQUVaLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUdvQztBQU85QixTQUFTNUgsVUFBVUEsQ0FBQztFQUFFTSxLQUFLO0VBQUVDO0FBQXNCLENBQUMsRUFBRTtFQUMzRCxNQUFNRyxLQUFLLEdBQUdaLHVFQUFRLEVBQUU7RUFDeEIsb0JBQ0VNLEtBQUEsQ0FBQUMsYUFBQSxDQUFDd0ksOERBQUs7SUFDSkcsUUFBUSxFQUFDLFNBQVM7SUFDbEJDLElBQUksZUFBRTdJLEtBQUEsQ0FBQUMsYUFBQSxDQUFDMEkscUVBQVk7TUFBQ3RJLElBQUksRUFBRSxFQUFHO01BQUNFLEtBQUssRUFBRUQsS0FBSyxDQUFDRSxPQUFPLENBQUNzSSxNQUFNLENBQUNDO0lBQU0sRUFBSTtJQUNwRXRGLEVBQUUsRUFBRTtNQUNGdEMsZUFBZSxFQUFFLGVBQWU7TUFDaENtRyxXQUFXLEVBQUUsYUFBYTtNQUMxQmhELEVBQUUsRUFBRSxDQUFDO01BQ0wvRCxLQUFLLEVBQUUsY0FBYztNQUNyQndELEtBQUssRUFBRTtJQUNUO0VBQUUsZ0JBRUYvRCxLQUFBLENBQUFDLGFBQUEsQ0FBQ3lJLHFFQUFZLHFCQUNYMUksS0FBQSxDQUFBQyxhQUFBLENBQUNvQyxtRUFBVTtJQUNUMkIsT0FBTyxFQUFDLFNBQVM7SUFDakJQLEVBQUUsRUFBRTtNQUFFNkIsVUFBVSxFQUFFLEdBQUc7TUFBRTBELE9BQU8sRUFBRTtJQUFRO0VBQUUsR0FFekM5SSxLQUFLLENBQ0ssZUFDYkYsS0FBQSxDQUFBQyxhQUFBLENBQUNvQyxtRUFBVTtJQUFDMkIsT0FBTyxFQUFDLFNBQVM7SUFBQ1AsRUFBRSxFQUFFO01BQUV1RixPQUFPLEVBQUU7SUFBUTtFQUFFLEdBQ3BEN0ksSUFBSSxDQUNNLENBQ0EsQ0FDVDtBQUVaIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9NYWxpY2lvdXNUb2tlbldhcm5pbmcudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2Nyb2xsYmFycy9TY3JvbGxiYXJzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL01hbmFnZVRva2Vucy9NYW5hZ2VUb2tlbnMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvTWFuYWdlVG9rZW5zL01hbmFnZVRva2Vuc0xpc3QudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvUGVybWlzc2lvbnMvY29tcG9uZW50cy9XYXJuaW5nQm94LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBbGVydFRyaWFuZ2xlSWNvbixcbiAgQm94LFxuICBCb3hQcm9wcyxcbiAgVG9vbHRpcCxcbiAgdXNlVGhlbWUsXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyBXYXJuaW5nQm94IH0gZnJvbSAnQHNyYy9wYWdlcy9QZXJtaXNzaW9ucy9jb21wb25lbnRzL1dhcm5pbmdCb3gnO1xuXG5leHBvcnQgY29uc3QgTWFsaWNpb3VzVG9rZW5XYXJuaW5nQm94ID0gKHByb3BzOiBCb3hQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHsuLi5wcm9wc30+XG4gICAgICA8V2FybmluZ0JveFxuICAgICAgICB0aXRsZT17dCgnTWFsaWNpb3VzIFRva2VuJyl9XG4gICAgICAgIHRleHQ9e3QoXG4gICAgICAgICAgJ1RoaXMgdG9rZW4gaGFzIGJlZW4gZmxhZ2dlZCBhcyBtYWxpY2lvdXMuIFVzZSBjYXV0aW9uIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCBpdC4nLFxuICAgICAgICApfVxuICAgICAgLz5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBNYWxpY2lvdXNUb2tlbldhcm5pbmdJY29uID0gKHsgc2l6ZSB9OiB7IHNpemU/OiBudW1iZXIgfSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxUb29sdGlwIHRpdGxlPXt0KCdUaGlzIHRva2VuIGhhcyBiZWVuIGZsYWdnZWQgYXMgbWFsaWNpb3VzJyl9PlxuICAgICAgPEFsZXJ0VHJpYW5nbGVJY29uIGNvbG9yPXt0aGVtZS5wYWxldHRlLndhcm5pbmcubWFpbn0gc2l6ZT17c2l6ZSA/PyAxNn0gLz5cbiAgICA8L1Rvb2x0aXA+XG4gICk7XG59O1xuIiwiaW1wb3J0ICogYXMgQ3VzdG9tU2Nyb2xsYmFycyBmcm9tICdyZWFjdC1jdXN0b20tc2Nyb2xsYmFycy0yJztcbmltcG9ydCB7IGZvcndhcmRSZWYsIExlZ2FjeVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVRoZW1lIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IHR5cGUgU2Nyb2xsYmFyc1JlZiA9IEN1c3RvbVNjcm9sbGJhcnMuU2Nyb2xsYmFycztcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Sb2JQZXRoaWNrL3JlYWN0LWN1c3RvbS1zY3JvbGxiYXJzLTIvYmxvYi9tYXN0ZXIvZG9jcy9BUEkubWRcbi8vIGZvciBhdmFpbGFibGUgcHJvcHNcbmV4cG9ydCBjb25zdCBTY3JvbGxiYXJzID0gZm9yd2FyZFJlZihmdW5jdGlvbiBTY3JvbGxiYXJzKFxuICBwcm9wczogQ3VzdG9tU2Nyb2xsYmFycy5TY3JvbGxiYXJQcm9wcyxcbiAgcmVmOiBMZWdhY3lSZWY8U2Nyb2xsYmFyc1JlZj4gfCB1bmRlZmluZWQsXG4pIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCByZW5kZXJUaHVtYiA9ICh7IHN0eWxlLCAuLi5yZXN0IH0pID0+IHtcbiAgICBjb25zdCB0aHVtYlN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODAwXSxcbiAgICAgIGJvcmRlclJhZGl1czogOTk5OSxcbiAgICB9O1xuICAgIHJldHVybiA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlLCAuLi50aHVtYlN0eWxlIH19IHsuLi5yZXN0fSAvPjtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxDdXN0b21TY3JvbGxiYXJzLlNjcm9sbGJhcnNcbiAgICAgIHJlbmRlclRodW1iVmVydGljYWw9e3JlbmRlclRodW1ifVxuICAgICAgcmVmPXtyZWZ9XG4gICAgICB7Li4ucHJvcHN9XG4gICAgLz5cbiAgKTtcbn0pO1xuIiwiaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBNYW5hZ2VUb2tlbnNMaXN0IH0gZnJvbSAnLi9NYW5hZ2VUb2tlbnNMaXN0JztcbmltcG9ydCB7IFNjcm9sbGJhcnMgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL3Njcm9sbGJhcnMvU2Nyb2xsYmFycyc7XG5pbXBvcnQgeyB1c2VIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBQYWdlVGl0bGUgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1BhZ2VUaXRsZSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDaGVja0ljb24sXG4gIENoZXZyb25Eb3duSWNvbixcbiAgQ2hldnJvblVwSWNvbixcbiAgTWVudUl0ZW0sXG4gIE1lbnVMaXN0LFxuICBQbHVzSWNvbixcbiAgU2VhcmNoQmFyLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuZXhwb3J0IGVudW0gU29ydCB7XG4gIFRPS0VOX0FNT1VOVCA9ICdUb2tlbiBBbW91bnQnLFxuICBOQU1FID0gJ05hbWUnLFxuICBCQUxBTkNFID0gJ0JhbGFuY2UnLFxufVxuXG5leHBvcnQgY29uc3QgTWFuYWdlVG9rZW5zID0gKCkgPT4ge1xuICBjb25zdCBoaXN0b3J5ID0gdXNlSGlzdG9yeSgpO1xuICBjb25zdCBbc2VhcmNoUXVlcnksIHNldFNlYXJjaFF1ZXJ5XSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IFtzaG93U29ydE1lbnUsIHNldFNob3dTb3J0TWVudV0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG5cbiAgY29uc3Qgc29ydEl0ZW1zID0ge1xuICAgIFtTb3J0LlRPS0VOX0FNT1VOVF06IHQoJ1Rva2VuIEFtb3VudCcpLFxuICAgIFtTb3J0Lk5BTUVdOiB0KCdOYW1lJyksXG4gICAgW1NvcnQuQkFMQU5DRV06IHQoJ0JhbGFuY2UnKSxcbiAgfTtcblxuICBjb25zdCBbc2VsZWN0ZWRTb3J0LCBzZXRTZWxlY3RlZFNvcnRdID0gdXNlU3RhdGU8U29ydD4oU29ydC5UT0tFTl9BTU9VTlQpO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZVNvcnRDaGFuZ2Uoa2V5TmFtZSkge1xuICAgIHNldFNlbGVjdGVkU29ydChrZXlOYW1lKTtcbiAgICBzZXRTaG93U29ydE1lbnUoZmFsc2UpO1xuICB9XG5cbiAgY29uc3QgRmlsdGVySXRlbSA9ICh7IGtleU5hbWUsIG9uQ2xpY2sgfSkgPT4ge1xuICAgIGZ1bmN0aW9uIG9uQ2xpY2tIYW5kbGVyKCkge1xuICAgICAgb25DbGljayhrZXlOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxNZW51SXRlbVxuICAgICAgICBkaXNhYmxlUmlwcGxlXG4gICAgICAgIG9uQ2xpY2s9e29uQ2xpY2tIYW5kbGVyfVxuICAgICAgICBzeD17eyBoZWlnaHQ6IDMyLCBtaW5IZWlnaHQ6IDMyIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICB2YXJpYW50PVwiYm9keTJcIlxuICAgICAgICAgICAgc3g9e3sgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX1cbiAgICAgICAgICAgIHRpdGxlPXtrZXlOYW1lfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtrZXlOYW1lfVxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICB7c2VsZWN0ZWRTb3J0ID09PSBrZXlOYW1lICYmIDxDaGVja0ljb24gc2l6ZT17MTJ9IC8+fVxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9NZW51SXRlbT5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGZsZXg6IDEgfX0+XG4gICAgICA8UGFnZVRpdGxlPnt0KCdNYW5hZ2UgVG9rZW5zJyl9PC9QYWdlVGl0bGU+XG4gICAgICA8U3RhY2sgc3g9e3sgZmxleEdyb3c6IDEsIHdpZHRoOiAnMTAwJScsIHB5OiAxLCBweDogMiwgcm93R2FwOiAnMzBweCcgfX0+XG4gICAgICAgIDxTZWFyY2hCYXJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC10b2tlbi1saXN0LWlucHV0XCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnU2VhcmNoJyl9XG4gICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0U2VhcmNoUXVlcnkoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICBhdXRvRm9jdXM9e3RydWV9XG4gICAgICAgIC8+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgdmFyaWFudD1cInRleHRcIlxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhZGQtY3VzdG9tLXRva2VuLWJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoaXN0b3J5LnB1c2goJy9tYW5hZ2UtdG9rZW5zL2FkZCcpfVxuICAgICAgICAgICAgc3g9e3sgYWxpZ25TZWxmOiAnZmxleC1zdGFydCcsIHBhZGRpbmc6IDAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIHN4PXt7IGhlaWdodDogJzI0cHgnIH19PlxuICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgICAgICAgc3g9e3sgd2lkdGg6ICcyNHB4JywgaGVpZ2h0OiAnMjRweCcgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxQbHVzSWNvbiBzaXplPXsyMH0gLz5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgc3g9e3sgbXg6IDEgfX0+e3QoJ0FkZCBDdXN0b20gVG9rZW4nKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgIDwvQnV0dG9uPlxuXG4gICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRTaG93U29ydE1lbnUoIXNob3dTb3J0TWVudSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJmaWx0ZXItYWN0aXZpdHktbWVudVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgdmFyaWFudD1cImNhcHRpb25cIlxuICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgIG06ICcwIDhweCAwIDVweCcsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2ZvbnRXZWlnaHRNZWRpdW0nLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnU29ydCBCeScpfToge3NlbGVjdGVkU29ydH1cbiAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIHtzaG93U29ydE1lbnUgPyAoXG4gICAgICAgICAgICAgIDxDaGV2cm9uVXBJY29uIHNpemU9ezIwfSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPENoZXZyb25Eb3duSWNvbiBzaXplPXsyMH0gLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7c2hvd1NvcnRNZW51ICYmIChcbiAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgdG9wOiAnMzBweCcsXG4gICAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPE1lbnVMaXN0XG4gICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInNvcnQtbGlzdC1vcHRpb25zXCJcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNjAsXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1zdGFydCcsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogMSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxMjAsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxTY3JvbGxiYXJzXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZsZXhHcm93OiAxLCBtYXhIZWlnaHQ6ICd1bnNldCcsIGhlaWdodDogJzEwMCUnIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtPYmplY3Qua2V5cyhzb3J0SXRlbXMpLm1hcCgoc29ydEl0ZW0pID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8RmlsdGVySXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtzb3J0SXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleU5hbWU9e3NvcnRJdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlU29ydENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICAgICAgICAgICAgICA8L01lbnVMaXN0PlxuICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8L1N0YWNrPlxuXG4gICAgICAgIDxTY3JvbGxiYXJzIHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogJzE2cHgnIH19PlxuICAgICAgICAgIDxNYW5hZ2VUb2tlbnNMaXN0IHNlYXJjaFF1ZXJ5PXtzZWFyY2hRdWVyeX0gc29ydD17c2VsZWN0ZWRTb3J0fSAvPlxuICAgICAgICA8L1Njcm9sbGJhcnM+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIERpdmlkZXIsXG4gIFN0YWNrLFxuICBTd2l0Y2gsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBUb2tlblR5cGUsIFRva2VuV2l0aEJhbGFuY2UgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuXG5pbXBvcnQgeyB1c2VUb2tlbnNXaXRoQmFsYW5jZXMgfSBmcm9tICdAc3JjL2hvb2tzL3VzZVRva2Vuc1dpdGhCYWxhbmNlcyc7XG5pbXBvcnQgeyBUb2tlbkljb24gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL1Rva2VuSWNvbic7XG5pbXBvcnQgeyB1c2VTZXR0aW5nc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL1NldHRpbmdzUHJvdmlkZXInO1xuaW1wb3J0IHsgaXNUb2tlbk1hbGljaW91cyB9IGZyb20gJ0BzcmMvdXRpbHMvaXNUb2tlbk1hbGljaW91cyc7XG5pbXBvcnQgeyBNYWxpY2lvdXNUb2tlbldhcm5pbmdJY29uIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9NYWxpY2lvdXNUb2tlbldhcm5pbmcnO1xuXG5pbXBvcnQgeyBTb3J0IH0gZnJvbSAnLi9NYW5hZ2VUb2tlbnMnO1xuXG50eXBlIE1hbmFnZVRva2Vuc0xpc3RQcm9wcyA9IHtcbiAgc2VhcmNoUXVlcnk6IHN0cmluZztcbiAgc29ydD86IHN0cmluZztcbn07XG5cbmV4cG9ydCBjb25zdCBNYW5hZ2VUb2tlbnNMaXN0ID0gKHtcbiAgc2VhcmNoUXVlcnksXG4gIHNvcnQsXG59OiBNYW5hZ2VUb2tlbnNMaXN0UHJvcHMpID0+IHtcbiAgY29uc3QgdG9rZW5zV2l0aEJhbGFuY2VzID0gdXNlVG9rZW5zV2l0aEJhbGFuY2VzKHtcbiAgICBmb3JjZVNob3dUb2tlbnNXaXRob3V0QmFsYW5jZXM6IHRydWUsXG4gICAgZm9yY2VIaWRkZW5Ub2tlbnM6IHRydWUsXG4gIH0pO1xuXG4gIGNvbnN0IHNvcnRpbmdUb2tlbnMgPSB1c2VNZW1vKFxuICAgICgpID0+IChhLCBiKSA9PiB7XG4gICAgICBpZiAoc29ydCA9PT0gU29ydC5OQU1FKSB7XG4gICAgICAgIHJldHVybiBiLm5hbWUgLSBhLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoc29ydCA9PT0gU29ydC5CQUxBTkNFKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgKHBhcnNlRmxvYXQoYi5iYWxhbmNlQ3VycmVuY3lEaXNwbGF5VmFsdWUpIHx8IDApIC1cbiAgICAgICAgICAocGFyc2VGbG9hdChhLmJhbGFuY2VDdXJyZW5jeURpc3BsYXlWYWx1ZSkgfHwgMClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoXG4gICAgICAgIChwYXJzZUZsb2F0KGIuYmFsYW5jZURpc3BsYXlWYWx1ZSkgfHwgMCkgLVxuICAgICAgICAocGFyc2VGbG9hdChhLmJhbGFuY2VEaXNwbGF5VmFsdWUpIHx8IDApXG4gICAgICApO1xuICAgIH0sXG4gICAgW3NvcnRdLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBkaXZpZGVyPXs8RGl2aWRlciBmbGV4SXRlbSBzeD17eyBib3JkZXJDb2xvcjogJ2dyZXkuODAwJyB9fSAvPn1cbiAgICAgIHN4PXt7IHJvd0dhcDogJzEwcHgnIH19XG4gICAgPlxuICAgICAge3Rva2Vuc1dpdGhCYWxhbmNlc1xuICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICh0b2tlbikgPT5cbiAgICAgICAgICAgIHRva2VuLnR5cGUgIT09IFRva2VuVHlwZS5OQVRJVkUgJiZcbiAgICAgICAgICAgIChzZWFyY2hRdWVyeS5sZW5ndGhcbiAgICAgICAgICAgICAgPyB0b2tlbi5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoUXVlcnkudG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgICAgICAgICB0b2tlbi5zeW1ib2wudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICA6IHRydWUpLFxuICAgICAgICApXG4gICAgICAgIC5zb3J0KHNvcnRpbmdUb2tlbnMpXG4gICAgICAgIC5tYXAoKHRva2VuKSA9PiAoXG4gICAgICAgICAgPE1hbmFnZVRva2Vuc0xpc3RJdGVtXG4gICAgICAgICAgICBrZXk9e3Rva2VuLnR5cGUgPT09IFRva2VuVHlwZS5FUkMyMCA/IHRva2VuLmFkZHJlc3MgOiB0b2tlbi5zeW1ib2x9XG4gICAgICAgICAgICB0b2tlbj17dG9rZW59XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG5cbnR5cGUgTWFuYWdlVG9rZW5zTGlzdEl0ZW1Qcm9wcyA9IHtcbiAgdG9rZW46IFRva2VuV2l0aEJhbGFuY2U7XG59O1xuXG5jb25zdCBNYW5hZ2VUb2tlbnNMaXN0SXRlbSA9ICh7IHRva2VuIH06IE1hbmFnZVRva2Vuc0xpc3RJdGVtUHJvcHMpID0+IHtcbiAgY29uc3QgeyBnZXRUb2tlblZpc2liaWxpdHksIHRvZ2dsZVRva2VuVmlzaWJpbGl0eSB9ID0gdXNlU2V0dGluZ3NDb250ZXh0KCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2tcbiAgICAgIGRpcmVjdGlvbj1cInJvd1wiXG4gICAgICBkYXRhLXRlc3RpZD17YCR7dG9rZW4uc3ltYm9sLnRvTG93ZXJDYXNlKCl9LXRva2VuLWxpc3QtaXRlbWB9XG4gICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxuICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICBzeD17eyB3aWR0aDogJzEwMCUnIH19XG4gICAgPlxuICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIGFsaWduSXRlbXM9XCJjZW50ZXJcIj5cbiAgICAgICAgPFRva2VuSWNvblxuICAgICAgICAgIHdpZHRoPVwiMzJweFwiXG4gICAgICAgICAgaGVpZ2h0PVwiMzJweFwiXG4gICAgICAgICAgc3JjPXt0b2tlbi5sb2dvVXJpfVxuICAgICAgICAgIG5hbWU9e3Rva2VuLm5hbWV9XG4gICAgICAgIC8+XG4gICAgICAgIDxTdGFjayBzeD17eyBteDogMiB9fT5cbiAgICAgICAgICA8VHlwb2dyYXBoeSBzeD17eyBtYjogMC41IH19Pnt0b2tlbi5uYW1lfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICA8VHlwb2dyYXBoeT57dG9rZW4uYmFsYW5jZURpc3BsYXlWYWx1ZX08L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvU3RhY2s+XG4gICAgICA8L1N0YWNrPlxuICAgICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxIH19PlxuICAgICAgICB7aXNUb2tlbk1hbGljaW91cyh0b2tlbikgJiYgPE1hbGljaW91c1Rva2VuV2FybmluZ0ljb24gc2l6ZT17MTZ9IC8+fVxuICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICBjaGVja2VkPXtnZXRUb2tlblZpc2liaWxpdHkodG9rZW4pfVxuICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiB0b2dnbGVUb2tlblZpc2liaWxpdHkodG9rZW4pfVxuICAgICAgICAvPlxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIEFsZXJ0LFxuICBBbGVydENvbnRlbnQsXG4gIFR5cG9ncmFwaHksXG4gIHVzZVRoZW1lLFxuICBHcHBNYXliZUljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5cbmludGVyZmFjZSBXYXJuaW5nQm94UHJvcHMge1xuICB0aXRsZTogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBXYXJuaW5nQm94KHsgdGl0bGUsIHRleHQgfTogV2FybmluZ0JveFByb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgcmV0dXJuIChcbiAgICA8QWxlcnRcbiAgICAgIHNldmVyaXR5PVwid2FybmluZ1wiXG4gICAgICBpY29uPXs8R3BwTWF5YmVJY29uIHNpemU9ezI0fSBjb2xvcj17dGhlbWUucGFsZXR0ZS5jb21tb24uYmxhY2t9IC8+fVxuICAgICAgc3g9e3tcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2FybmluZy5saWdodCcsXG4gICAgICAgIGJvcmRlckNvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBweDogMixcbiAgICAgICAgY29sb3I6ICdjb21tb24uYmxhY2snLFxuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8QWxlcnRDb250ZW50PlxuICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICBzeD17eyBmb250V2VpZ2h0OiA2MDAsIGRpc3BsYXk6ICdibG9jaycgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiY2FwdGlvblwiIHN4PXt7IGRpc3BsYXk6ICdibG9jaycgfX0+XG4gICAgICAgICAge3RleHR9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvQWxlcnRDb250ZW50PlxuICAgIDwvQWxlcnQ+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiQWxlcnRUcmlhbmdsZUljb24iLCJCb3giLCJUb29sdGlwIiwidXNlVGhlbWUiLCJ1c2VUcmFuc2xhdGlvbiIsIldhcm5pbmdCb3giLCJNYWxpY2lvdXNUb2tlbldhcm5pbmdCb3giLCJwcm9wcyIsInQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJ0aXRsZSIsInRleHQiLCJNYWxpY2lvdXNUb2tlbldhcm5pbmdJY29uIiwic2l6ZSIsInRoZW1lIiwiY29sb3IiLCJwYWxldHRlIiwid2FybmluZyIsIm1haW4iLCJDdXN0b21TY3JvbGxiYXJzIiwiZm9yd2FyZFJlZiIsIlNjcm9sbGJhcnMiLCJyZWYiLCJyZW5kZXJUaHVtYiIsInN0eWxlIiwicmVzdCIsInRodW1iU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJncmV5IiwiYm9yZGVyUmFkaXVzIiwiX2V4dGVuZHMiLCJyZW5kZXJUaHVtYlZlcnRpY2FsIiwidXNlU3RhdGUiLCJNYW5hZ2VUb2tlbnNMaXN0IiwidXNlSGlzdG9yeSIsIlBhZ2VUaXRsZSIsIkJ1dHRvbiIsIkNoZWNrSWNvbiIsIkNoZXZyb25Eb3duSWNvbiIsIkNoZXZyb25VcEljb24iLCJNZW51SXRlbSIsIk1lbnVMaXN0IiwiUGx1c0ljb24iLCJTZWFyY2hCYXIiLCJTdGFjayIsIlR5cG9ncmFwaHkiLCJTb3J0IiwiTWFuYWdlVG9rZW5zIiwiaGlzdG9yeSIsInNlYXJjaFF1ZXJ5Iiwic2V0U2VhcmNoUXVlcnkiLCJzaG93U29ydE1lbnUiLCJzZXRTaG93U29ydE1lbnUiLCJzb3J0SXRlbXMiLCJUT0tFTl9BTU9VTlQiLCJOQU1FIiwiQkFMQU5DRSIsInNlbGVjdGVkU29ydCIsInNldFNlbGVjdGVkU29ydCIsImhhbmRsZVNvcnRDaGFuZ2UiLCJrZXlOYW1lIiwiRmlsdGVySXRlbSIsIm9uQ2xpY2siLCJvbkNsaWNrSGFuZGxlciIsImRpc2FibGVSaXBwbGUiLCJzeCIsImhlaWdodCIsIm1pbkhlaWdodCIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJ3aWR0aCIsInZhcmlhbnQiLCJ0ZXh0T3ZlcmZsb3ciLCJvdmVyZmxvdyIsImZsZXgiLCJmbGV4R3JvdyIsInB5IiwicHgiLCJyb3dHYXAiLCJwbGFjZWhvbGRlciIsIm9uQ2hhbmdlIiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsImF1dG9Gb2N1cyIsInB1c2giLCJhbGlnblNlbGYiLCJwYWRkaW5nIiwiZGlyZWN0aW9uIiwibXgiLCJjdXJzb3IiLCJwb3NpdGlvbiIsIm0iLCJmb250V2VpZ2h0IiwidG9wIiwicmlnaHQiLCJ6SW5kZXgiLCJtYXhIZWlnaHQiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwic29ydEl0ZW0iLCJrZXkiLCJtYXJnaW5Cb3R0b20iLCJzb3J0IiwidXNlTWVtbyIsIkRpdmlkZXIiLCJTd2l0Y2giLCJUb2tlblR5cGUiLCJ1c2VUb2tlbnNXaXRoQmFsYW5jZXMiLCJUb2tlbkljb24iLCJ1c2VTZXR0aW5nc0NvbnRleHQiLCJpc1Rva2VuTWFsaWNpb3VzIiwidG9rZW5zV2l0aEJhbGFuY2VzIiwiZm9yY2VTaG93VG9rZW5zV2l0aG91dEJhbGFuY2VzIiwiZm9yY2VIaWRkZW5Ub2tlbnMiLCJzb3J0aW5nVG9rZW5zIiwiYSIsImIiLCJuYW1lIiwicGFyc2VGbG9hdCIsImJhbGFuY2VDdXJyZW5jeURpc3BsYXlWYWx1ZSIsImJhbGFuY2VEaXNwbGF5VmFsdWUiLCJkaXZpZGVyIiwiZmxleEl0ZW0iLCJib3JkZXJDb2xvciIsImZpbHRlciIsInRva2VuIiwidHlwZSIsIk5BVElWRSIsImxlbmd0aCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJzeW1ib2wiLCJNYW5hZ2VUb2tlbnNMaXN0SXRlbSIsIkVSQzIwIiwiYWRkcmVzcyIsImdldFRva2VuVmlzaWJpbGl0eSIsInRvZ2dsZVRva2VuVmlzaWJpbGl0eSIsInNyYyIsImxvZ29VcmkiLCJtYiIsImdhcCIsImNoZWNrZWQiLCJBbGVydCIsIkFsZXJ0Q29udGVudCIsIkdwcE1heWJlSWNvbiIsInNldmVyaXR5IiwiaWNvbiIsImNvbW1vbiIsImJsYWNrIiwiZGlzcGxheSJdLCJzb3VyY2VSb290IjoiIn0=