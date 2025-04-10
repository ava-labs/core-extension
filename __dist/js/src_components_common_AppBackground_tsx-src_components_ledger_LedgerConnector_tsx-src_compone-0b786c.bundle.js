(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_AppBackground_tsx-src_components_ledger_LedgerConnector_tsx-src_compone-0b786c"],{

/***/ "./src/components/common/AppBackground.tsx":
/*!*************************************************!*\
  !*** ./src/components/common/AppBackground.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppBackground": () => (/* binding */ AppBackground)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/styled.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const FallbackImage = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack)`
  height: 100%;
  min-height: 100%;
  min-width: 50vw;
  width: 50vw;
  background: url('/images/onboarding-background.png') no-repeat center/cover;
`;
const VideoBackground = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])('video')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: fixed;
`;
function AppBackground() {
  const QUERY = '(prefers-reduced-motion: reduce)';
  const mediaQueryList = window.matchMedia(QUERY);
  const prefersReducedMotion = mediaQueryList.matches;
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Stack, {
    sx: {
      minHeight: '100vh',
      height: '100vh',
      overflow: 'hidden'
    }
  }, prefersReducedMotion ? /*#__PURE__*/React.createElement(FallbackImage, null) : /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
    fallback: /*#__PURE__*/React.createElement(FallbackImage, null)
  }, /*#__PURE__*/React.createElement(VideoBackground, {
    autoPlay: true,
    loop: true,
    muted: true
  }, /*#__PURE__*/React.createElement("source", {
    src: "/images/core-ext-hero-hq.webm",
    type: "video/webm"
  }))));
}

/***/ }),

/***/ "./src/components/common/Dropdown.tsx":
/*!********************************************!*\
  !*** ./src/components/common/Dropdown.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dropdown": () => (/* binding */ Dropdown),
/* harmony export */   "DropdownItem": () => (/* binding */ DropdownItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


const TriggerIcon = ({
  ...rest
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.ChevronDownIcon, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    size: 20,
    sx: {
      '.MuiSelect-icon': {
        transition: 'transform 150ms ease-in-out',
        right: theme.spacing(2),
        top: 'calc(50% - 10px)'
      },
      '.MuiSelect-iconOpen': {
        transform: 'rotateX(180deg)'
      }
    }
  }, rest));
};
const useDropdownProps = ({
  InputProps: {
    sx: inputSx = {},
    ...otherInputProps
  } = {},
  SelectProps: {
    MenuProps: {
      PaperProps: {
        sx: paperSx = {},
        ...otherPaperProps
      } = {},
      ...otherMenuProps
    } = {},
    ...otherSelectProps
  } = {},
  ...rest
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return {
    InputProps: {
      sx: {
        padding: 0,
        height: theme.spacing(6),
        border: `1px solid ${theme.palette.grey[800]}`,
        backgroundColor: theme.palette.grey[850],
        fontSize: theme.typography.body1.fontSize,
        '&.Mui-focused': {
          backgroundColor: theme.palette.grey[850]
        },
        '.MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': {
          border: 'none'
        },
        '.MuiOutlinedInput-input': {
          padding: theme.spacing(1.5, 2)
        },
        ...inputSx
      },
      ...otherInputProps
    },
    SelectProps: {
      IconComponent: TriggerIcon,
      MenuProps: {
        PaperProps: {
          sx: {
            border: `1px solid ${theme.palette.grey[850]}`,
            maxWidth: 343,
            maxHeight: 144,
            mt: 2,
            ...paperSx
          },
          ...otherPaperProps
        },
        ...otherMenuProps
      },
      ...otherSelectProps
    },
    ...rest
  };
};
const Dropdown = ({
  children,
  ...props
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const {
    SelectProps,
    InputProps,
    ...rest
  } = useDropdownProps(props);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.Select, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    variant: "outlined",
    InputProps: InputProps,
    SelectProps: SelectProps,
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: theme.typography.body2.fontSize
      }
    }
  }, rest), children);
};
const DropdownItem = ({
  sx,
  children,
  ...props
}) => {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__.MenuItem, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    sx: {
      minHeight: 'auto',
      height: theme.spacing(5),
      fontSize: theme.typography.body2.fontSize,
      gap: 1,
      ...sx
    }
  }, props), children);
};

/***/ }),

/***/ "./src/components/common/LedgerNano.tsx":
/*!**********************************************!*\
  !*** ./src/components/common/LedgerNano.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerNano": () => (/* binding */ LedgerNano)
/* harmony export */ });
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
function LedgerNano({
  height = '136px'
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "136",
    height: height,
    viewBox: "0 0 136 136",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "29.1699",
    y: "83.2567",
    width: "106.009",
    height: "33.4258",
    rx: "2.68124",
    transform: "rotate(-37.834 29.1699 83.2567)",
    fill: "#1A1A1C",
    stroke: "#F8F8FB",
    strokeWidth: "1.32311"
  }), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#clip0_3198_56193)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M97.2573 63.6016L98.0221 64.6068L104.921 59.3577L101.472 54.8241L100.467 55.589L103.151 59.1174L97.2573 63.6016ZM85.8743 48.6398L86.6391 49.6451L92.5331 45.1608L95.2177 48.6894L96.223 47.9246L92.7736 43.3908L85.8743 48.6398ZM88.2329 59.1234L86.4558 56.7875L88.0328 55.5877C88.8017 55.0027 89.2725 55.049 89.805 55.7489L90.1199 56.1628C90.6673 56.8823 90.5886 57.3312 89.8099 57.9236L88.2329 59.1234ZM91.0511 57.6327C91.6281 56.8981 91.6207 55.8454 91.0134 55.0472C90.631 54.5446 90.089 54.241 89.4371 54.1612C88.6189 54.0677 87.8155 54.3211 86.9976 54.9434L84.78 56.6305L90.029 63.5298L91.0148 62.7799L88.9227 60.0301L90.4012 58.9053C91.16 58.328 91.7056 58.4108 92.3056 59.1995L93.5579 60.8455L94.5632 60.0806L93.4308 58.5923C92.606 57.5081 92.0349 57.2892 91.1562 57.7708L91.0511 57.6327ZM82.9248 64.1731L85.9606 61.8634L85.2708 60.9567L82.235 63.2663L80.6602 61.1965L83.9916 58.6619L83.3018 57.7552L78.9649 61.0547L84.214 67.954L88.6986 64.542L88.0088 63.6353L84.5296 66.2823L82.9248 64.1731ZM79.9003 67.05L80.2602 67.523C81.0176 68.5185 80.9004 69.1214 79.9839 69.8186L79.7671 69.9836C78.8503 70.681 78.1818 70.7226 77.1395 69.3526L75.7297 67.4996C74.68 66.1198 74.9257 65.4813 75.8422 64.7841L76.0392 64.6342C76.9362 63.9517 77.477 64.0695 78.1916 64.9886L79.2759 64.1637C78.1425 62.8784 76.5835 62.711 75.2233 63.7458C74.563 64.2482 74.1685 64.8752 74.0544 65.5842C73.8759 66.6382 74.2809 67.8863 75.3307 69.2661C76.343 70.5967 77.3887 71.3573 78.4645 71.5034C79.1858 71.5926 79.9225 71.3745 80.4843 70.947C81.0756 70.4972 81.4379 69.848 81.3238 69.1257L81.4617 69.0209L81.9566 69.6714L82.8634 68.9815L80.1564 65.4236L77.4854 67.4557L78.1753 68.3624L79.9003 67.05ZM68.6653 70.3222L69.7397 69.5048C70.755 68.7324 71.5019 68.5686 72.5519 69.9486L73.9315 71.7621C74.9813 73.1418 74.6244 73.8182 73.6091 74.5907L72.5347 75.4081L68.6653 70.3222ZM74.3877 75.4303C76.2703 73.9979 75.8826 72.0366 74.3454 70.016C72.7856 67.966 70.9719 67.1362 69.1188 68.546L66.9898 70.1658L72.2388 77.0651L74.3877 75.4303ZM65.1838 77.6705L68.2196 75.3609L67.5298 74.4542L64.494 76.7638L62.9192 74.6939L66.2505 72.1594L65.5607 71.2527L61.2238 74.5522L66.4729 81.4515L70.9577 78.0395L70.2678 77.1327L66.7886 79.7798L65.1838 77.6705ZM56.4142 78.2114L55.409 78.9762L60.658 85.8755L65.1919 82.4261L64.502 81.5194L60.9734 84.204L56.4142 78.2114ZM53.7489 91.1324L57.1983 95.6662L64.0976 90.4172L63.3326 89.4118L57.4386 93.896L54.7541 90.3676L53.7489 91.1324ZM45.0503 79.699L48.4997 84.2328L49.5049 83.468L46.8203 79.9394L52.7144 75.4552L51.9496 74.4499L45.0503 79.699Z",
    fill: "#F8F8FB"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M26.7426 7.6495C27.1296 6.22018 28.6021 5.37527 30.0314 5.76234L116.692 29.231C123.913 31.1864 128.181 38.6252 126.226 45.846C124.27 53.0668 116.831 57.3351 109.611 55.3797L22.9501 31.9111C21.5207 31.524 20.6758 30.0515 21.0629 28.6222L26.7426 7.6495Z",
    fill: "#2A2A2D",
    stroke: "white",
    strokeWidth: "1.32311"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M31.197 91.7998L24.6608 97.1192C23.7162 97.888 23.5736 99.2769 24.3424 100.222L32.8944 110.73C33.6632 111.674 35.0521 111.817 35.9967 111.048L42.5329 105.728",
    stroke: "white",
    strokeWidth: "1.32311"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M26.376 108.171C20.692 111.839 8.6832 121.557 6.12049 131.088M25.4704 107.258C21.5934 109.346 12.106 116.265 5.17325 127.233",
    stroke: "white",
    strokeWidth: "0.882075"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "112.2",
    cy: "42.5",
    r: "9.537",
    fill: "#2A2A2D",
    stroke: "white",
    strokeWidth: "1.326"
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "clip0_3198_56193"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "60.0324",
    height: "20.0631",
    fill: "white",
    transform: "translate(45.05 79.6991) rotate(-37.2641)"
  }))));
}

/***/ }),

/***/ "./src/components/common/StyledNumberList.tsx":
/*!****************************************************!*\
  !*** ./src/components/common/StyledNumberList.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./src/components/ledger/LedgerConnector.tsx":
/*!***************************************************!*\
  !*** ./src/components/ledger/LedgerConnector.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerConnector": () => (/* binding */ LedgerConnector),
/* harmony export */   "LedgerStatus": () => (/* binding */ LedgerStatus)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/LedgerProvider */ "./src/contexts/LedgerProvider.tsx");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/constants.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getAddressFromXPub.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/Avalanche/wallets/legacy/LedgerWallet.js");
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/utils/getEvmAddressFromPubKey.js");
/* harmony import */ var _src_hooks_useGetAvaxBalance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/hooks/useGetAvaxBalance */ "./src/hooks/useGetAvaxBalance.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_pages_Onboarding_components_DerivationPathDropDown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/pages/Onboarding/components/DerivationPathDropDown */ "./src/pages/Onboarding/components/DerivationPathDropDown.tsx");
/* harmony import */ var _src_pages_Onboarding_components_DerivedAddresses__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/pages/Onboarding/components/DerivedAddresses */ "./src/pages/Onboarding/components/DerivedAddresses.tsx");
/* harmony import */ var _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/secrets/models */ "./src/background/services/secrets/models.ts");
/* harmony import */ var _src_pages_Accounts_hooks_useImportLedger__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/pages/Accounts/hooks/useImportLedger */ "./src/pages/Accounts/hooks/useImportLedger.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");











let LedgerStatus = /*#__PURE__*/function (LedgerStatus) {
  LedgerStatus["LEDGER_UNINITIATED"] = "uninitiated";
  LedgerStatus["LEDGER_LOADING"] = "loading";
  LedgerStatus["LEDGER_CONNECTED"] = "connected";
  LedgerStatus["LEDGER_CONNECTION_FAILED"] = "failed";
  return LedgerStatus;
}({});

/**
 * Waiting this amount of time otherwise this screen would be a blip and the user wouldnt even know it happened
 */
const WAIT_1500_MILLI_FOR_USER = 1500;
function LedgerConnector({
  onSuccess,
  onTroubleshoot,
  checkIfWalletExists
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_2__.useAnalyticsContext)();
  const {
    getExtendedPublicKey,
    popDeviceSelection,
    hasLedgerTransport,
    wasTransportAttempted,
    initLedgerTransport,
    getPublicKey
  } = (0,_src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_1__.useLedgerContext)();
  const {
    getAvaxBalance
  } = (0,_src_hooks_useGetAvaxBalance__WEBPACK_IMPORTED_MODULE_3__.useGetAvaxBalance)();
  const [publicKeyState, setPublicKeyState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(LedgerStatus.LEDGER_UNINITIATED);
  const [isLedgerExistsError, setIsLedgerExistsError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [pathSpec, setPathSpec] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.BIP44);
  const [addresses, setAddresses] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [hasPublicKeys, setHasPublicKeys] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [dropdownDisabled, setDropdownDisabled] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const lastAccountIndexWithBalance = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const {
    importLedger
  } = (0,_src_pages_Accounts_hooks_useImportLedger__WEBPACK_IMPORTED_MODULE_7__.useImportLedger)();
  const resetStates = () => {
    setPublicKeyState(LedgerStatus.LEDGER_LOADING);
    setAddresses([]);
    setHasPublicKeys(false);
    setPathSpec(_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.BIP44);
  };
  const getAddressFromXpubKey = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (xpubValue, accountIndex, addressList = []) => {
    const address = (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_11__.getAddressFromXPub)(xpubValue, accountIndex);
    const {
      balance
    } = await getAvaxBalance(address);
    const newAddresses = [...addressList, {
      address,
      balance: balance.balanceDisplayValue || '0'
    }];
    setAddresses(newAddresses);
    lastAccountIndexWithBalance.current = Math.max(0, newAddresses.findLastIndex(addr => addr.balance !== '0'));
    if (accountIndex < 2) {
      await getAddressFromXpubKey(xpubValue, accountIndex + 1, newAddresses);
    }
    if (accountIndex >= 2) {
      capture('OnboardingLedgerConnected');
      setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
      setHasPublicKeys(true);
    }
  }, [capture, getAvaxBalance]);
  const isLedgerWalletExist = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async ({
    xpub,
    xpubXP,
    publicKeys,
    derivationPath
  }) => {
    setIsLedgerExistsError(false);
    try {
      return await importLedger({
        xpub,
        xpubXP,
        pubKeys: publicKeys,
        secretType: derivationPath === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.BIP44 ? _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_6__.SecretType.Ledger : _src_background_services_secrets_models__WEBPACK_IMPORTED_MODULE_6__.SecretType.LedgerLive,
        dryRun: true
      });
    } catch (e) {
      if (typeof e === 'string' && e === 'This wallet already exists') {
        setIsLedgerExistsError(true);
      }
      throw new Error(String(e));
    }
  }, [importLedger]);
  const getXPublicKey = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    try {
      const xpubValue = await getExtendedPublicKey();
      const xpubXPValue = await getExtendedPublicKey(_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_12__.LedgerWallet.getAccountPath('X'));
      if (checkIfWalletExists) {
        await isLedgerWalletExist({
          xpub: xpubValue,
          xpubXP: xpubXPValue,
          publicKeys: undefined,
          derivationPath: _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.BIP44
        });
      }
      setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
      capture('OnboardingLedgerConnected');
      await getAddressFromXpubKey(xpubValue, 0);
      onSuccess({
        xpub: xpubValue,
        xpubXP: xpubXPValue,
        publicKeys: undefined,
        hasPublicKeys: true,
        pathSpec: _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.BIP44,
        lastAccountIndexWithBalance: lastAccountIndexWithBalance.current
      });
    } catch {
      capture('OnboardingLedgerConnectionFailed');
      setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
      popDeviceSelection();
    }
  }, [getExtendedPublicKey, checkIfWalletExists, capture, getAddressFromXpubKey, onSuccess, isLedgerWalletExist, popDeviceSelection]);
  const getDerivationPathValue = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async derivationPathSpec => {
    if (!derivationPathSpec) {
      return;
    }
    await initLedgerTransport();
  }, [initLedgerTransport]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    initLedgerTransport();
  }, [initLedgerTransport]);
  const getPubKeys = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (derivationPathSpec, accountIndex = 0, addressList = [], pubKeys = []) => {
    try {
      const pubKey = await getPublicKey(accountIndex, derivationPathSpec);
      const pubKeyXP = await getPublicKey(accountIndex, derivationPathSpec, 'AVM');
      const address = (0,_avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_13__.getEvmAddressFromPubKey)(pubKey);
      const {
        balance
      } = await getAvaxBalance(address);
      const newAddresses = [...addressList, {
        address,
        balance: balance.balanceDisplayValue || '0'
      }];
      setAddresses(newAddresses);
      lastAccountIndexWithBalance.current = Math.max(0, newAddresses.findLastIndex(addr => addr.balance !== '0'));
      if (accountIndex < 2) {
        await getPubKeys(derivationPathSpec, accountIndex + 1, newAddresses, [...pubKeys, {
          evm: pubKey.toString('hex'),
          xp: pubKeyXP.toString('hex')
        }]);
      }
      if (accountIndex >= 2) {
        capture('OnboardingLedgerConnected');
        setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
        const publicKeyValue = [...pubKeys, {
          evm: pubKey.toString('hex'),
          xp: pubKeyXP.toString('hex')
        }];
        if (checkIfWalletExists) {
          await isLedgerWalletExist({
            xpub: '',
            xpubXP: '',
            publicKeys: publicKeyValue,
            derivationPath: _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.LedgerLive
          });
        }
        setHasPublicKeys(true);
        onSuccess({
          xpub: '',
          xpubXP: '',
          publicKeys: publicKeyValue,
          hasPublicKeys: true,
          pathSpec: _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.LedgerLive,
          lastAccountIndexWithBalance: lastAccountIndexWithBalance.current
        });
      }
    } catch {
      capture('OnboardingLedgerConnectionFailed');
      setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
      popDeviceSelection();
    }
  }, [getPublicKey, getAvaxBalance, capture, checkIfWalletExists, onSuccess, isLedgerWalletExist, popDeviceSelection]);
  const tryPublicKey = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    capture('OnboardingLedgerRetry');
    setPublicKeyState(LedgerStatus.LEDGER_LOADING);
    setDropdownDisabled(true);
    if (!hasLedgerTransport) {
      // make sure we have a transport
      await initLedgerTransport();
    }
    if (pathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.BIP44) {
      await getXPublicKey();
      setDropdownDisabled(false);
      return;
    }
    if (pathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.LedgerLive) {
      setAddresses([]);
      await getPubKeys(pathSpec);
      setDropdownDisabled(false);
      return;
    }
  }, [capture, getPubKeys, getXPublicKey, hasLedgerTransport, initLedgerTransport, pathSpec]);
  const onPathSelected = async selectedPathSpec => {
    resetStates();
    setPathSpec(selectedPathSpec);
    setDropdownDisabled(true);
    if (selectedPathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.BIP44) {
      setTimeout(async () => {
        await getXPublicKey();
        setDropdownDisabled(false);
      }, WAIT_1500_MILLI_FOR_USER);
      return;
    }
    if (selectedPathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.LedgerLive) {
      getDerivationPathValue(selectedPathSpec);
      await getPubKeys(selectedPathSpec);
      setDropdownDisabled(false);
    }
  };

  // Attempt to automatically connect using Ledger Live as soon as we
  // establish the transport.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const retrieveKeys = async selectedPathSpec => {
      setPublicKeyState(LedgerStatus.LEDGER_LOADING);
      setDropdownDisabled(true);
      if (selectedPathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.LedgerLive) {
        setAddresses([]);
        await getPubKeys(selectedPathSpec);
        setDropdownDisabled(false);
      } else if (selectedPathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_9__.DerivationPath.BIP44) {
        await getXPublicKey();
        setDropdownDisabled(false);
      }
    };
    if (hasPublicKeys) {
      return;
    }
    if (hasLedgerTransport && publicKeyState === LedgerStatus.LEDGER_UNINITIATED) {
      retrieveKeys(pathSpec);
    } else if (!hasLedgerTransport) {
      if (wasTransportAttempted && publicKeyState !== LedgerStatus.LEDGER_CONNECTION_FAILED) {
        setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
      } else {
        getDerivationPathValue(pathSpec);
      }
    }
  }, [pathSpec, hasLedgerTransport, publicKeyState, hasPublicKeys, getPubKeys, getDerivationPathValue, wasTransportAttempted, getXPublicKey]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, {
    sx: {
      width: theme.spacing(44),
      alignSelf: 'center',
      mt: 7.5
    }
  }, /*#__PURE__*/React.createElement(_src_pages_Onboarding_components_DerivationPathDropDown__WEBPACK_IMPORTED_MODULE_4__.DerivationPathDropdown, {
    pathSpec: pathSpec,
    onPathSelected: onPathSelected,
    isDisabled: dropdownDisabled
  }), pathSpec && publicKeyState !== LedgerStatus.LEDGER_UNINITIATED && publicKeyState !== LedgerStatus.LEDGER_CONNECTION_FAILED && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, {
    sx: {
      mt: 4,
      rowGap: 3
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Divider, {
    flexItem: true
  }), /*#__PURE__*/React.createElement(_src_pages_Onboarding_components_DerivedAddresses__WEBPACK_IMPORTED_MODULE_5__.DerivedAddresses, {
    addresses: addresses
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, {
    sx: {
      alignItems: 'center'
    }
  }, publicKeyState === LedgerStatus.LEDGER_CONNECTION_FAILED && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, {
    sx: {
      mt: 1,
      rowGap: 3,
      width: theme.spacing(44)
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Stack, {
    direction: "row"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Typography, {
    variant: "caption",
    sx: {
      color: theme.palette.error.main
    }
  }, !isLedgerExistsError && /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_15__.Trans, {
    i18nKey: 'Unable to connect. View the troubleshoot guide <linkText>here</linkText>',
    components: {
      linkText: /*#__PURE__*/React.createElement("span", {
        onClick: () => onTroubleshoot(),
        style: {
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationColor: theme.palette.error.main
        }
      })
    }
  }), isLedgerExistsError && t('This wallet already exists'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_14__.Button, {
    onClick: () => tryPublicKey(),
    fullWidth: true
  }, t('Retry')))));
}

/***/ }),

/***/ "./src/components/ledger/LedgerTroublesSteps.tsx":
/*!*******************************************************!*\
  !*** ./src/components/ledger/LedgerTroublesSteps.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerTroubleSteps": () => (/* binding */ LedgerTroubleSteps),
/* harmony export */   "LedgerTroubleStepsFontVariant": () => (/* binding */ LedgerTroubleStepsFontVariant)
/* harmony export */ });
/* harmony import */ var _src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/StyledNumberList */ "./src/components/common/StyledNumberList.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pages/Onboarding/components/TypographyLink */ "./src/pages/Onboarding/components/TypographyLink.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




let LedgerTroubleStepsFontVariant = /*#__PURE__*/function (LedgerTroubleStepsFontVariant) {
  LedgerTroubleStepsFontVariant["small"] = "body1";
  LedgerTroubleStepsFontVariant["large"] = "body2";
  return LedgerTroubleStepsFontVariant;
}({});
function LedgerTroubleSteps({
  fontVariant = LedgerTroubleStepsFontVariant.small,
  sx = {}
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      ...sx,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      rowGap: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_0__.StyledNumberList, null, t('1.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: fontVariant
  }, t('Connect the Ledger device to your computer.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_0__.StyledNumberList, null, t('2.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: fontVariant
  }, t('Enter your PIN.'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
    sx: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_StyledNumberList__WEBPACK_IMPORTED_MODULE_0__.StyledNumberList, null, t('3.')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: fontVariant
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_5__.Trans, {
    i18nKey: "Ensure you have installed the latest <typography>Avalanche App</typography> and open it on your device.",
    components: {
      typography: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
        as: "span",
        sx: {
          fontWeight: 'bold'
        }
      })
    }
  }))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Divider, {
    flexItem: true,
    style: {
      margin: `${theme.spacing(1)} 0`
    }
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: fontVariant
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_5__.Trans, {
    i18nKey: "If you do not have the latest Avalanche App, please add it through the <ledgerLink>Ledger Live</ledgerLink> app manager.",
    components: {
      ledgerLink: /*#__PURE__*/React.createElement(_pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__.TypographyLink, {
        as: "a",
        href: "https://www.ledger.com/ledger-live",
        target: "_blank",
        rel: "noreferrer",
        variant: fontVariant
      })
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Typography, {
    variant: fontVariant
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_5__.Trans, {
    i18nKey: "More instructions can be found <ledgerLink>here</ledgerLink>.",
    components: {
      ledgerLink: /*#__PURE__*/React.createElement(_pages_Onboarding_components_TypographyLink__WEBPACK_IMPORTED_MODULE_1__.TypographyLink, {
        as: "a",
        href: "https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true",
        target: "_blank",
        rel: "noopener noreferrer",
        variant: fontVariant
      })
    }
  }))));
}

/***/ }),

/***/ "./src/hooks/useGetAvaxBalance.ts":
/*!****************************************!*\
  !*** ./src/hooks/useGetAvaxBalance.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useGetAvaxBalance": () => (/* binding */ useGetAvaxBalance)
/* harmony export */ });
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");


function useGetAvaxBalance() {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_1__.useConnectionContext)();
  async function getAvaxBalance(address) {
    const result = await request({
      method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_0__.ExtensionRequest.BALANCE_NATIVE_GET,
      params: [address, 'eip155:43114']
    });
    return result;
  }
  return {
    getAvaxBalance
  };
}

/***/ }),

/***/ "./src/pages/Accounts/hooks/useImportLedger.ts":
/*!*****************************************************!*\
  !*** ./src/pages/Accounts/hooks/useImportLedger.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useImportLedger": () => (/* binding */ useImportLedger)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/background/connections/extensionConnection/models */ "./src/background/connections/extensionConnection/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");



const useImportLedger = () => {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__.useConnectionContext)();
  const [isImporting, setIsImporting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const importLedger = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async params => {
    setIsImporting(true);
    try {
      const result = await request({
        method: _src_background_connections_extensionConnection_models__WEBPACK_IMPORTED_MODULE_1__.ExtensionRequest.WALLET_IMPORT_LEDGER,
        params: [params]
      });
      return result;
    } finally {
      setIsImporting(false);
    }
  }, [request]);
  return {
    isImporting,
    importLedger
  };
};

/***/ }),

/***/ "./src/pages/Ledger/LedgerWrongVersion.tsx":
/*!*************************************************!*\
  !*** ./src/pages/Ledger/LedgerWrongVersion.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerWrongVersion": () => (/* binding */ LedgerWrongVersion),
/* harmony export */   "LedgerWrongVersionContent": () => (/* binding */ LedgerWrongVersionContent)
/* harmony export */ });
/* harmony import */ var _src_components_common_LedgerNano__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/LedgerNano */ "./src/components/common/LedgerNano.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const LedgerWrongVersionContent = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
  variant: "body2",
  sx: {
    pt: 1,
    pb: 4
  }
}, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_2__.Trans, {
  i18nKey: "Please update the <typography>Avalanche Application</typography> on your Ledger device to continue.",
  components: {
    typography: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
      sx: {
        fontWeight: 'semibold'
      }
    })
  }
})), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
  sx: {
    alignItems: 'center'
  }
}, /*#__PURE__*/React.createElement(_src_components_common_LedgerNano__WEBPACK_IMPORTED_MODULE_0__.LedgerNano, null)), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
  variant: "body2",
  sx: {
    mt: 3,
    mb: 1
  }
}, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_2__.Trans, {
  i18nKey: "Download <ledgerLink>Ledger Live</ledgerLink> to update.",
  components: {
    ledgerLink: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
      sx: {
        cursor: 'pointer',
        fontWeight: 'semibold',
        color: 'secondary.main'
      },
      as: "a",
      target: "_blank",
      href: "https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true",
      rel: "noreferrer"
    })
  }
})));
function LedgerWrongVersion({
  onClose,
  className
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Card, {
    sx: {
      p: theme.spacing(2),
      width: theme.spacing(43)
    },
    className: className
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Stack, {
    sx: {
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    variant: "text",
    onClick: () => onClose?.(),
    sx: {
      alignSelf: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.XIcon, {
    sx: {
      height: 2,
      color: 'primary.main'
    }
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_1__.Typography, {
    variant: "h5"
  }, t('Update Required')), /*#__PURE__*/React.createElement(LedgerWrongVersionContent, null)));
}

/***/ }),

/***/ "./src/pages/Ledger/LedgerWrongVersionOverlay.tsx":
/*!********************************************************!*\
  !*** ./src/pages/Ledger/LedgerWrongVersionOverlay.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LedgerWrongVersionOverlay": () => (/* binding */ LedgerWrongVersionOverlay)
/* harmony export */ });
/* harmony import */ var _LedgerWrongVersion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LedgerWrongVersion */ "./src/pages/Ledger/LedgerWrongVersion.tsx");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/LedgerProvider */ "./src/contexts/LedgerProvider.tsx");
/* harmony import */ var _src_utils_isLedgerVersionCompatible__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/isLedgerVersionCompatible */ "./src/utils/isLedgerVersionCompatible.ts");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function LedgerWrongVersionOverlay({
  onClose
}) {
  const {
    isLedgerWallet
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_1__.useWalletContext)();
  const {
    ledgerVersionWarningClosed,
    updateLedgerVersionWarningClosed,
    avaxAppVersion,
    hasLedgerTransport
  } = (0,_src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_2__.useLedgerContext)();

  // checks to make sure there is a AVAX ledger app version
  // ledger is connected
  // AVAX ledger app meets mininum version requirement
  const ledgerCheck = avaxAppVersion && hasLedgerTransport && !(0,_src_utils_isLedgerVersionCompatible__WEBPACK_IMPORTED_MODULE_3__.isLedgerVersionCompatible)(avaxAppVersion, _src_contexts_LedgerProvider__WEBPACK_IMPORTED_MODULE_2__.REQUIRED_LEDGER_VERSION);

  // Used in Onboarding
  if (onClose && ledgerCheck) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Backdrop, {
      open: true
    }, /*#__PURE__*/React.createElement(_LedgerWrongVersion__WEBPACK_IMPORTED_MODULE_0__.LedgerWrongVersion, {
      onClose: onClose
    }));
  }

  // Used on Portfolio
  if (!ledgerVersionWarningClosed && isLedgerWallet && ledgerCheck) {
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Backdrop, {
      open: true
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_4__.Stack, {
      sx: {
        m: 2
      }
    }, /*#__PURE__*/React.createElement(_LedgerWrongVersion__WEBPACK_IMPORTED_MODULE_0__.LedgerWrongVersion, {
      onClose: () => updateLedgerVersionWarningClosed()
    })));
  }
  return null;
}

/***/ }),

/***/ "./src/pages/Onboarding/components/DerivationPathDropDown.tsx":
/*!********************************************************************!*\
  !*** ./src/pages/Onboarding/components/DerivationPathDropDown.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DerivationPathDropdown": () => (/* binding */ DerivationPathDropdown)
/* harmony export */ });
/* harmony import */ var _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-wallets-sdk */ "./node_modules/@avalabs/core-wallets-sdk/esm/EVM/constants.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/components/common/Dropdown */ "./src/components/common/Dropdown.tsx");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function DerivationPathDropdown({
  pathSpec,
  onPathSelected,
  isDisabled
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, null, /*#__PURE__*/React.createElement(_src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_0__.Dropdown, {
    defaultValue: pathSpec,
    inputProps: {
      MenuProps: {
        MenuListProps: {
          sx: {
            backgroundColor: theme.palette.grey[850]
          }
        }
      }
    },
    SelectProps: {
      defaultValue: '',
      native: false,
      displayEmpty: true,
      renderValue: () => {
        switch (pathSpec) {
          case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.DerivationPath.LedgerLive:
            return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, null, t('Ledger Live'));
          case _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.DerivationPath.BIP44:
            return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, null, t('BIP44 (Default)'));
        }
      },
      onChange: e => {
        const path = e.target.value;
        if (path && path !== pathSpec) {
          onPathSelected(path);
        }
      }
    },
    label: t('Select derivation path'),
    InputProps: {
      disabled: isDisabled
    }
  }, /*#__PURE__*/React.createElement(_src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_0__.DropdownItem, {
    value: _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.DerivationPath.BIP44,
    selected: pathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.DerivationPath.BIP44,
    "data-testid": "connect-account-menu-item"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2"
  }, t('BIP44 (Default)')), pathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.DerivationPath.BIP44 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CheckIcon, null))), /*#__PURE__*/React.createElement(_src_components_common_Dropdown__WEBPACK_IMPORTED_MODULE_0__.DropdownItem, {
    value: _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.DerivationPath.LedgerLive,
    selected: pathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.DerivationPath.LedgerLive,
    "data-testid": "connect-account-menu-item"
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2"
  }, t('Ledger Live')), pathSpec === _avalabs_core_wallets_sdk__WEBPACK_IMPORTED_MODULE_4__.DerivationPath.LedgerLive && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CheckIcon, null)))));
}

/***/ }),

/***/ "./src/pages/Onboarding/components/DerivedAddresses.tsx":
/*!**************************************************************!*\
  !*** ./src/pages/Onboarding/components/DerivedAddresses.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DerivedAddresses": () => (/* binding */ DerivedAddresses)
/* harmony export */ });
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* harmony import */ var _src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/getExplorerAddress */ "./src/utils/getExplorerAddress.ts");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@mui/material/styles/useTheme.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");





function DerivedAddresses({
  addresses
}) {
  const theme = (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)();
  const hasBalance = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    return addresses.find(address => address.balance !== '0');
  }, [addresses]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Card, {
    sx: {
      width: theme.spacing(43.5),
      height: theme.spacing(21.25),
      backgroundColor: theme.palette.grey[850]
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.CardContent, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, null, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2",
    sx: {
      fontWeight: 'semibold'
    }
  }, t('Your Derived Addresses')), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    alignItems: "space-between",
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Divider, {
      flexItem: true
    })
  }, addresses.map((addressData, index) => {
    if (hasBalance && addressData.balance === '0') {
      return;
    }
    const explorerLink = (0,_src_utils_getExplorerAddress__WEBPACK_IMPORTED_MODULE_1__.getAvalancheAddressLink)(addressData.address);
    return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      key: index
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      sx: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      sx: {
        flexDirection: 'row'
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      sx: {
        pr: 2
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "body2"
    }, index + 1, ".")), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      sx: {
        pr: 2
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Tooltip, {
      placement: "top",
      title: addressData.address
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "body2",
      sx: {
        fontWeight: 'semibold'
      }
    }, (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__.truncateAddress)(addressData.address))))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
      sx: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        columnGap: 1
      }
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      variant: "body2"
    }, addressData.balance, " AVAX"), explorerLink && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
      as: "a",
      href: explorerLink,
      target: "_blank",
      rel: "noreferrer"
    }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.ExternalLinkIcon, {
      sx: {
        color: 'primary.main'
      }
    })))));
  }), addresses.length < 3 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      flexDirection: 'row',
      py: 1.5,
      alignItems: 'center'
    },
    divider: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Divider, {
      flexItem: true
    })
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Stack, {
    sx: {
      pr: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Typography, {
    variant: "body2"
  }, addresses.length + 1, ".")), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_5__.Skeleton, {
    sx: {
      width: theme.spacing(41.3),
      height: theme.spacing(2)
    }
  }))))));
}

/***/ }),

/***/ "./src/utils/isLedgerVersionCompatible.ts":
/*!************************************************!*\
  !*** ./src/utils/isLedgerVersionCompatible.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isLedgerVersionCompatible": () => (/* binding */ isLedgerVersionCompatible)
/* harmony export */ });
// ledgerAppVersion >= requiredAppVersion
function isLedgerVersionCompatible(ledgerAppVersion, requiredAppVersion) {
  const compare = ledgerAppVersion.localeCompare(requiredAppVersion, undefined, {
    numeric: true,
    sensitivity: 'base'
  });

  // ledgerAppVersion > requiredAppVersion
  if (compare === 1) return true;
  // ledgerAppVersion = requiredAppVersion
  if (compare === 0) return true;
  // ledgerAppVersion < requiredAppVersion
  if (compare === -1) return false;
}

/***/ }),

/***/ "?dba7":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX0FwcEJhY2tncm91bmRfdHN4LXNyY19jb21wb25lbnRzX2xlZGdlcl9MZWRnZXJDb25uZWN0b3JfdHN4LXNyY19jb21wb25lLTBiNzg2Yy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBNEQ7QUFDM0I7QUFFakMsTUFBTUcsYUFBYSxHQUFHRix1RUFBTSxDQUFDRCw4REFBSyxDQUFFO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBRUQsTUFBTUksZUFBZSxHQUFHSCx1RUFBTSxDQUFDLE9BQU8sQ0FBRTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFFTSxTQUFTSSxhQUFhQSxDQUFBLEVBQUc7RUFDOUIsTUFBTUMsS0FBSyxHQUFHLGtDQUFrQztFQUNoRCxNQUFNQyxjQUFjLEdBQUdDLE1BQU0sQ0FBQ0MsVUFBVSxDQUFDSCxLQUFLLENBQUM7RUFDL0MsTUFBTUksb0JBQW9CLEdBQUdILGNBQWMsQ0FBQ0ksT0FBTztFQUVuRCxvQkFDRUMsS0FBQSxDQUFBQyxhQUFBLENBQUNiLDhEQUFLO0lBQ0pjLEVBQUUsRUFBRTtNQUNGQyxTQUFTLEVBQUUsT0FBTztNQUNsQkMsTUFBTSxFQUFFLE9BQU87TUFDZkMsUUFBUSxFQUFFO0lBQ1o7RUFBRSxHQUVEUCxvQkFBb0IsZ0JBQ25CRSxLQUFBLENBQUFDLGFBQUEsQ0FBQ1YsYUFBYSxPQUFHLGdCQUVqQlMsS0FBQSxDQUFBQyxhQUFBLENBQUNYLDJDQUFRO0lBQUNnQixRQUFRLGVBQUVOLEtBQUEsQ0FBQUMsYUFBQSxDQUFDVixhQUFhO0VBQUksZ0JBQ3BDUyxLQUFBLENBQUFDLGFBQUEsQ0FBQ1QsZUFBZTtJQUFDZSxRQUFRO0lBQUNDLElBQUk7SUFBQ0MsS0FBSztFQUFBLGdCQUNsQ1QsS0FBQSxDQUFBQyxhQUFBO0lBQVFTLEdBQUcsRUFBQywrQkFBK0I7SUFBQ0MsSUFBSSxFQUFDO0VBQVksRUFBRyxDQUNoRCxD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eHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vQXBwQmFja2dyb3VuZC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9Ecm9wZG93bi50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9MZWRnZXJOYW5vLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1N0eWxlZE51bWJlckxpc3QudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9sZWRnZXIvTGVkZ2VyQ29ubmVjdG9yLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbXBvbmVudHMvbGVkZ2VyL0xlZGdlclRyb3VibGVzU3RlcHMudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlR2V0QXZheEJhbGFuY2UudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9BY2NvdW50cy9ob29rcy91c2VJbXBvcnRMZWRnZXIudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9MZWRnZXIvTGVkZ2VyV3JvbmdWZXJzaW9uLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL0xlZGdlci9MZWRnZXJXcm9uZ1ZlcnNpb25PdmVybGF5LnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvY29tcG9uZW50cy9EZXJpdmF0aW9uUGF0aERyb3BEb3duLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL09uYm9hcmRpbmcvY29tcG9uZW50cy9EZXJpdmVkQWRkcmVzc2VzLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL2lzTGVkZ2VyVmVyc2lvbkNvbXBhdGlibGUudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi9pZ25vcmVkfC9Vc2Vycy9jc2FiYS52YWx5aS9wcmovY29yZS1leHRlbnNpb24vbm9kZV9tb2R1bGVzL3R3ZWV0bmFjbHxjcnlwdG8iXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIHN0eWxlZCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBTdXNwZW5zZSB9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgRmFsbGJhY2tJbWFnZSA9IHN0eWxlZChTdGFjaylgXG4gIGhlaWdodDogMTAwJTtcbiAgbWluLWhlaWdodDogMTAwJTtcbiAgbWluLXdpZHRoOiA1MHZ3O1xuICB3aWR0aDogNTB2dztcbiAgYmFja2dyb3VuZDogdXJsKCcvaW1hZ2VzL29uYm9hcmRpbmctYmFja2dyb3VuZC5wbmcnKSBuby1yZXBlYXQgY2VudGVyL2NvdmVyO1xuYDtcblxuY29uc3QgVmlkZW9CYWNrZ3JvdW5kID0gc3R5bGVkKCd2aWRlbycpYFxuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvYmplY3QtZml0OiBjb3ZlcjtcbiAgcG9zaXRpb246IGZpeGVkO1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIEFwcEJhY2tncm91bmQoKSB7XG4gIGNvbnN0IFFVRVJZID0gJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJztcbiAgY29uc3QgbWVkaWFRdWVyeUxpc3QgPSB3aW5kb3cubWF0Y2hNZWRpYShRVUVSWSk7XG4gIGNvbnN0IHByZWZlcnNSZWR1Y2VkTW90aW9uID0gbWVkaWFRdWVyeUxpc3QubWF0Y2hlcztcblxuICByZXR1cm4gKFxuICAgIDxTdGFja1xuICAgICAgc3g9e3tcbiAgICAgICAgbWluSGVpZ2h0OiAnMTAwdmgnLFxuICAgICAgICBoZWlnaHQ6ICcxMDB2aCcsXG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAge3ByZWZlcnNSZWR1Y2VkTW90aW9uID8gKFxuICAgICAgICA8RmFsbGJhY2tJbWFnZSAvPlxuICAgICAgKSA6IChcbiAgICAgICAgPFN1c3BlbnNlIGZhbGxiYWNrPXs8RmFsbGJhY2tJbWFnZSAvPn0+XG4gICAgICAgICAgPFZpZGVvQmFja2dyb3VuZCBhdXRvUGxheSBsb29wIG11dGVkPlxuICAgICAgICAgICAgPHNvdXJjZSBzcmM9XCIvaW1hZ2VzL2NvcmUtZXh0LWhlcm8taHEud2VibVwiIHR5cGU9XCJ2aWRlby93ZWJtXCIgLz5cbiAgICAgICAgICA8L1ZpZGVvQmFja2dyb3VuZD5cbiAgICAgICAgPC9TdXNwZW5zZT5cbiAgICAgICl9XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIENoZXZyb25Eb3duSWNvbixcbiAgSWNvbkJhc2VQcm9wcyxcbiAgTWVudUl0ZW0sXG4gIE1lbnVJdGVtUHJvcHMsXG4gIFNlbGVjdCxcbiAgVGV4dEZpZWxkUHJvcHMsXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5jb25zdCBUcmlnZ2VySWNvbiA9ICh7IC4uLnJlc3QgfTogSWNvbkJhc2VQcm9wcykgPT4ge1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8Q2hldnJvbkRvd25JY29uXG4gICAgICBzaXplPXsyMH1cbiAgICAgIHN4PXt7XG4gICAgICAgICcuTXVpU2VsZWN0LWljb24nOiB7XG4gICAgICAgICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxNTBtcyBlYXNlLWluLW91dCcsXG4gICAgICAgICAgcmlnaHQ6IHRoZW1lLnNwYWNpbmcoMiksXG4gICAgICAgICAgdG9wOiAnY2FsYyg1MCUgLSAxMHB4KScsXG4gICAgICAgIH0sXG4gICAgICAgICcuTXVpU2VsZWN0LWljb25PcGVuJzoge1xuICAgICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZVgoMTgwZGVnKScsXG4gICAgICAgIH0sXG4gICAgICB9fVxuICAgICAgey4uLnJlc3R9XG4gICAgLz5cbiAgKTtcbn07XG5cbmNvbnN0IHVzZURyb3Bkb3duUHJvcHMgPSAoe1xuICBJbnB1dFByb3BzOiB7IHN4OiBpbnB1dFN4ID0ge30sIC4uLm90aGVySW5wdXRQcm9wcyB9ID0ge30sXG4gIFNlbGVjdFByb3BzOiB7XG4gICAgTWVudVByb3BzOiB7XG4gICAgICBQYXBlclByb3BzOiB7IHN4OiBwYXBlclN4ID0ge30sIC4uLm90aGVyUGFwZXJQcm9wcyB9ID0ge30sXG4gICAgICAuLi5vdGhlck1lbnVQcm9wc1xuICAgIH0gPSB7fSxcbiAgICAuLi5vdGhlclNlbGVjdFByb3BzXG4gIH0gPSB7fSxcbiAgLi4ucmVzdFxufTogVGV4dEZpZWxkUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiB7XG4gICAgSW5wdXRQcm9wczoge1xuICAgICAgc3g6IHtcbiAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDYpLFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHt0aGVtZS5wYWxldHRlLmdyZXlbODAwXX1gLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuZ3JleVs4NTBdLFxuICAgICAgICBmb250U2l6ZTogdGhlbWUudHlwb2dyYXBoeS5ib2R5MS5mb250U2l6ZSxcblxuICAgICAgICAnJi5NdWktZm9jdXNlZCc6IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuZ3JleVs4NTBdLFxuICAgICAgICB9LFxuICAgICAgICAnLk11aU91dGxpbmVkSW5wdXQtbm90Y2hlZE91dGxpbmUsICY6aG92ZXIgLk11aU91dGxpbmVkSW5wdXQtbm90Y2hlZE91dGxpbmUnOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICcuTXVpT3V0bGluZWRJbnB1dC1pbnB1dCc6IHtcbiAgICAgICAgICBwYWRkaW5nOiB0aGVtZS5zcGFjaW5nKDEuNSwgMiksXG4gICAgICAgIH0sXG4gICAgICAgIC4uLmlucHV0U3gsXG4gICAgICB9LFxuICAgICAgLi4ub3RoZXJJbnB1dFByb3BzLFxuICAgIH0sXG4gICAgU2VsZWN0UHJvcHM6IHtcbiAgICAgIEljb25Db21wb25lbnQ6IFRyaWdnZXJJY29uLFxuICAgICAgTWVudVByb3BzOiB7XG4gICAgICAgIFBhcGVyUHJvcHM6IHtcbiAgICAgICAgICBzeDoge1xuICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7dGhlbWUucGFsZXR0ZS5ncmV5Wzg1MF19YCxcbiAgICAgICAgICAgIG1heFdpZHRoOiAzNDMsXG4gICAgICAgICAgICBtYXhIZWlnaHQ6IDE0NCxcbiAgICAgICAgICAgIG10OiAyLFxuICAgICAgICAgICAgLi4ucGFwZXJTeCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLm90aGVyUGFwZXJQcm9wcyxcbiAgICAgICAgfSxcbiAgICAgICAgLi4ub3RoZXJNZW51UHJvcHMsXG4gICAgICB9LFxuICAgICAgLi4ub3RoZXJTZWxlY3RQcm9wcyxcbiAgICB9LFxuICAgIC4uLnJlc3QsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgRHJvcGRvd24gPSAoeyBjaGlsZHJlbiwgLi4ucHJvcHMgfTogVGV4dEZpZWxkUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IFNlbGVjdFByb3BzLCBJbnB1dFByb3BzLCAuLi5yZXN0IH0gPSB1c2VEcm9wZG93blByb3BzKHByb3BzKTtcblxuICByZXR1cm4gKFxuICAgIDxTZWxlY3RcbiAgICAgIHZhcmlhbnQ9XCJvdXRsaW5lZFwiXG4gICAgICBJbnB1dFByb3BzPXtJbnB1dFByb3BzfVxuICAgICAgU2VsZWN0UHJvcHM9e1NlbGVjdFByb3BzfVxuICAgICAgaW5wdXRMYWJlbFByb3BzPXt7XG4gICAgICAgIHN4OiB7IHRyYW5zZm9ybTogJ25vbmUnLCBmb250U2l6ZTogdGhlbWUudHlwb2dyYXBoeS5ib2R5Mi5mb250U2l6ZSB9LFxuICAgICAgfX1cbiAgICAgIHsuLi5yZXN0fVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1NlbGVjdD5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBEcm9wZG93bkl0ZW0gPSAoeyBzeCwgY2hpbGRyZW4sIC4uLnByb3BzIH06IE1lbnVJdGVtUHJvcHMpID0+IHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPE1lbnVJdGVtXG4gICAgICBzeD17e1xuICAgICAgICBtaW5IZWlnaHQ6ICdhdXRvJyxcbiAgICAgICAgaGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDUpLFxuICAgICAgICBmb250U2l6ZTogdGhlbWUudHlwb2dyYXBoeS5ib2R5Mi5mb250U2l6ZSxcbiAgICAgICAgZ2FwOiAxLFxuICAgICAgICAuLi5zeCxcbiAgICAgIH19XG4gICAgICB7Li4ucHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvTWVudUl0ZW0+XG4gICk7XG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIExlZGdlck5hbm8oeyBoZWlnaHQgPSAnMTM2cHgnIH06IHsgaGVpZ2h0Pzogc3RyaW5nIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8c3ZnXG4gICAgICB3aWR0aD1cIjEzNlwiXG4gICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgIHZpZXdCb3g9XCIwIDAgMTM2IDEzNlwiXG4gICAgICBmaWxsPVwibm9uZVwiXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICA+XG4gICAgICA8cmVjdFxuICAgICAgICB4PVwiMjkuMTY5OVwiXG4gICAgICAgIHk9XCI4My4yNTY3XCJcbiAgICAgICAgd2lkdGg9XCIxMDYuMDA5XCJcbiAgICAgICAgaGVpZ2h0PVwiMzMuNDI1OFwiXG4gICAgICAgIHJ4PVwiMi42ODEyNFwiXG4gICAgICAgIHRyYW5zZm9ybT1cInJvdGF0ZSgtMzcuODM0IDI5LjE2OTkgODMuMjU2NylcIlxuICAgICAgICBmaWxsPVwiIzFBMUExQ1wiXG4gICAgICAgIHN0cm9rZT1cIiNGOEY4RkJcIlxuICAgICAgICBzdHJva2VXaWR0aD1cIjEuMzIzMTFcIlxuICAgICAgLz5cbiAgICAgIDxnIGNsaXBQYXRoPVwidXJsKCNjbGlwMF8zMTk4XzU2MTkzKVwiPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNOTcuMjU3MyA2My42MDE2TDk4LjAyMjEgNjQuNjA2OEwxMDQuOTIxIDU5LjM1NzdMMTAxLjQ3MiA1NC44MjQxTDEwMC40NjcgNTUuNTg5TDEwMy4xNTEgNTkuMTE3NEw5Ny4yNTczIDYzLjYwMTZaTTg1Ljg3NDMgNDguNjM5OEw4Ni42MzkxIDQ5LjY0NTFMOTIuNTMzMSA0NS4xNjA4TDk1LjIxNzcgNDguNjg5NEw5Ni4yMjMgNDcuOTI0Nkw5Mi43NzM2IDQzLjM5MDhMODUuODc0MyA0OC42Mzk4Wk04OC4yMzI5IDU5LjEyMzRMODYuNDU1OCA1Ni43ODc1TDg4LjAzMjggNTUuNTg3N0M4OC44MDE3IDU1LjAwMjcgODkuMjcyNSA1NS4wNDkgODkuODA1IDU1Ljc0ODlMOTAuMTE5OSA1Ni4xNjI4QzkwLjY2NzMgNTYuODgyMyA5MC41ODg2IDU3LjMzMTIgODkuODA5OSA1Ny45MjM2TDg4LjIzMjkgNTkuMTIzNFpNOTEuMDUxMSA1Ny42MzI3QzkxLjYyODEgNTYuODk4MSA5MS42MjA3IDU1Ljg0NTQgOTEuMDEzNCA1NS4wNDcyQzkwLjYzMSA1NC41NDQ2IDkwLjA4OSA1NC4yNDEgODkuNDM3MSA1NC4xNjEyQzg4LjYxODkgNTQuMDY3NyA4Ny44MTU1IDU0LjMyMTEgODYuOTk3NiA1NC45NDM0TDg0Ljc4IDU2LjYzMDVMOTAuMDI5IDYzLjUyOThMOTEuMDE0OCA2Mi43Nzk5TDg4LjkyMjcgNjAuMDMwMUw5MC40MDEyIDU4LjkwNTNDOTEuMTYgNTguMzI4IDkxLjcwNTYgNTguNDEwOCA5Mi4zMDU2IDU5LjE5OTVMOTMuNTU3OSA2MC44NDU1TDk0LjU2MzIgNjAuMDgwNkw5My40MzA4IDU4LjU5MjNDOTIuNjA2IDU3LjUwODEgOTIuMDM0OSA1Ny4yODkyIDkxLjE1NjIgNTcuNzcwOEw5MS4wNTExIDU3LjYzMjdaTTgyLjkyNDggNjQuMTczMUw4NS45NjA2IDYxLjg2MzRMODUuMjcwOCA2MC45NTY3TDgyLjIzNSA2My4yNjYzTDgwLjY2MDIgNjEuMTk2NUw4My45OTE2IDU4LjY2MTlMODMuMzAxOCA1Ny43NTUyTDc4Ljk2NDkgNjEuMDU0N0w4NC4yMTQgNjcuOTU0TDg4LjY5ODYgNjQuNTQyTDg4LjAwODggNjMuNjM1M0w4NC41Mjk2IDY2LjI4MjNMODIuOTI0OCA2NC4xNzMxWk03OS45MDAzIDY3LjA1TDgwLjI2MDIgNjcuNTIzQzgxLjAxNzYgNjguNTE4NSA4MC45MDA0IDY5LjEyMTQgNzkuOTgzOSA2OS44MTg2TDc5Ljc2NzEgNjkuOTgzNkM3OC44NTAzIDcwLjY4MSA3OC4xODE4IDcwLjcyMjYgNzcuMTM5NSA2OS4zNTI2TDc1LjcyOTcgNjcuNDk5NkM3NC42OCA2Ni4xMTk4IDc0LjkyNTcgNjUuNDgxMyA3NS44NDIyIDY0Ljc4NDFMNzYuMDM5MiA2NC42MzQyQzc2LjkzNjIgNjMuOTUxNyA3Ny40NzcgNjQuMDY5NSA3OC4xOTE2IDY0Ljk4ODZMNzkuMjc1OSA2NC4xNjM3Qzc4LjE0MjUgNjIuODc4NCA3Ni41ODM1IDYyLjcxMSA3NS4yMjMzIDYzLjc0NThDNzQuNTYzIDY0LjI0ODIgNzQuMTY4NSA2NC44NzUyIDc0LjA1NDQgNjUuNTg0MkM3My44NzU5IDY2LjYzODIgNzQuMjgwOSA2Ny44ODYzIDc1LjMzMDcgNjkuMjY2MUM3Ni4zNDMgNzAuNTk2NyA3Ny4zODg3IDcxLjM1NzMgNzguNDY0NSA3MS41MDM0Qzc5LjE4NTggNzEuNTkyNiA3OS45MjI1IDcxLjM3NDUgODAuNDg0MyA3MC45NDdDODEuMDc1NiA3MC40OTcyIDgxLjQzNzkgNjkuODQ4IDgxLjMyMzggNjkuMTI1N0w4MS40NjE3IDY5LjAyMDlMODEuOTU2NiA2OS42NzE0TDgyLjg2MzQgNjguOTgxNUw4MC4xNTY0IDY1LjQyMzZMNzcuNDg1NCA2Ny40NTU3TDc4LjE3NTMgNjguMzYyNEw3OS45MDAzIDY3LjA1Wk02OC42NjUzIDcwLjMyMjJMNjkuNzM5NyA2OS41MDQ4QzcwLjc1NSA2OC43MzI0IDcxLjUwMTkgNjguNTY4NiA3Mi41NTE5IDY5Ljk0ODZMNzMuOTMxNSA3MS43NjIxQzc0Ljk4MTMgNzMuMTQxOCA3NC42MjQ0IDczLjgxODIgNzMuNjA5MSA3NC41OTA3TDcyLjUzNDcgNzUuNDA4MUw2OC42NjUzIDcwLjMyMjJaTTc0LjM4NzcgNzUuNDMwM0M3Ni4yNzAzIDczLjk5NzkgNzUuODgyNiA3Mi4wMzY2IDc0LjM0NTQgNzAuMDE2QzcyLjc4NTYgNjcuOTY2IDcwLjk3MTkgNjcuMTM2MiA2OS4xMTg4IDY4LjU0Nkw2Ni45ODk4IDcwLjE2NThMNzIuMjM4OCA3Ny4wNjUxTDc0LjM4NzcgNzUuNDMwM1pNNjUuMTgzOCA3Ny42NzA1TDY4LjIxOTYgNzUuMzYwOUw2Ny41Mjk4IDc0LjQ1NDJMNjQuNDk0IDc2Ljc2MzhMNjIuOTE5MiA3NC42OTM5TDY2LjI1MDUgNzIuMTU5NEw2NS41NjA3IDcxLjI1MjdMNjEuMjIzOCA3NC41NTIyTDY2LjQ3MjkgODEuNDUxNUw3MC45NTc3IDc4LjAzOTVMNzAuMjY3OCA3Ny4xMzI3TDY2Ljc4ODYgNzkuNzc5OEw2NS4xODM4IDc3LjY3MDVaTTU2LjQxNDIgNzguMjExNEw1NS40MDkgNzguOTc2Mkw2MC42NTggODUuODc1NUw2NS4xOTE5IDgyLjQyNjFMNjQuNTAyIDgxLjUxOTRMNjAuOTczNCA4NC4yMDRMNTYuNDE0MiA3OC4yMTE0Wk01My43NDg5IDkxLjEzMjRMNTcuMTk4MyA5NS42NjYyTDY0LjA5NzYgOTAuNDE3Mkw2My4zMzI2IDg5LjQxMThMNTcuNDM4NiA5My44OTZMNTQuNzU0MSA5MC4zNjc2TDUzLjc0ODkgOTEuMTMyNFpNNDUuMDUwMyA3OS42OTlMNDguNDk5NyA4NC4yMzI4TDQ5LjUwNDkgODMuNDY4TDQ2LjgyMDMgNzkuOTM5NEw1Mi43MTQ0IDc1LjQ1NTJMNTEuOTQ5NiA3NC40NDk5TDQ1LjA1MDMgNzkuNjk5WlwiXG4gICAgICAgICAgZmlsbD1cIiNGOEY4RkJcIlxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk0yNi43NDI2IDcuNjQ5NUMyNy4xMjk2IDYuMjIwMTggMjguNjAyMSA1LjM3NTI3IDMwLjAzMTQgNS43NjIzNEwxMTYuNjkyIDI5LjIzMUMxMjMuOTEzIDMxLjE4NjQgMTI4LjE4MSAzOC42MjUyIDEyNi4yMjYgNDUuODQ2QzEyNC4yNyA1My4wNjY4IDExNi44MzEgNTcuMzM1MSAxMDkuNjExIDU1LjM3OTdMMjIuOTUwMSAzMS45MTExQzIxLjUyMDcgMzEuNTI0IDIwLjY3NTggMzAuMDUxNSAyMS4wNjI5IDI4LjYyMjJMMjYuNzQyNiA3LjY0OTVaXCJcbiAgICAgICAgZmlsbD1cIiMyQTJBMkRcIlxuICAgICAgICBzdHJva2U9XCJ3aGl0ZVwiXG4gICAgICAgIHN0cm9rZVdpZHRoPVwiMS4zMjMxMVwiXG4gICAgICAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk0zMS4xOTcgOTEuNzk5OEwyNC42NjA4IDk3LjExOTJDMjMuNzE2MiA5Ny44ODggMjMuNTczNiA5OS4yNzY5IDI0LjM0MjQgMTAwLjIyMkwzMi44OTQ0IDExMC43M0MzMy42NjMyIDExMS42NzQgMzUuMDUyMSAxMTEuODE3IDM1Ljk5NjcgMTExLjA0OEw0Mi41MzI5IDEwNS43MjhcIlxuICAgICAgICBzdHJva2U9XCJ3aGl0ZVwiXG4gICAgICAgIHN0cm9rZVdpZHRoPVwiMS4zMjMxMVwiXG4gICAgICAvPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk0yNi4zNzYgMTA4LjE3MUMyMC42OTIgMTExLjgzOSA4LjY4MzIgMTIxLjU1NyA2LjEyMDQ5IDEzMS4wODhNMjUuNDcwNCAxMDcuMjU4QzIxLjU5MzQgMTA5LjM0NiAxMi4xMDYgMTE2LjI2NSA1LjE3MzI1IDEyNy4yMzNcIlxuICAgICAgICBzdHJva2U9XCJ3aGl0ZVwiXG4gICAgICAgIHN0cm9rZVdpZHRoPVwiMC44ODIwNzVcIlxuICAgICAgLz5cbiAgICAgIDxjaXJjbGVcbiAgICAgICAgY3g9XCIxMTIuMlwiXG4gICAgICAgIGN5PVwiNDIuNVwiXG4gICAgICAgIHI9XCI5LjUzN1wiXG4gICAgICAgIGZpbGw9XCIjMkEyQTJEXCJcbiAgICAgICAgc3Ryb2tlPVwid2hpdGVcIlxuICAgICAgICBzdHJva2VXaWR0aD1cIjEuMzI2XCJcbiAgICAgIC8+XG4gICAgICA8ZGVmcz5cbiAgICAgICAgPGNsaXBQYXRoIGlkPVwiY2xpcDBfMzE5OF81NjE5M1wiPlxuICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICB3aWR0aD1cIjYwLjAzMjRcIlxuICAgICAgICAgICAgaGVpZ2h0PVwiMjAuMDYzMVwiXG4gICAgICAgICAgICBmaWxsPVwid2hpdGVcIlxuICAgICAgICAgICAgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDQ1LjA1IDc5LjY5OTEpIHJvdGF0ZSgtMzcuMjY0MSlcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICA8L2RlZnM+XG4gICAgPC9zdmc+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBzdHlsZWQsIFR5cG9ncmFwaHkgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkTnVtYmVyTGlzdCA9IHN0eWxlZChUeXBvZ3JhcGh5KWBcbiAgJHsoeyB0aGVtZSB9KSA9PiAoe1xuICAgIC4uLnRoZW1lLnR5cG9ncmFwaHkuYm9keTEsXG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuYmFja2dyb3VuZC5wYXBlcixcbiAgICBsaW5lSGVpZ2h0OiB0aGVtZS5zcGFjaW5nKDMpLFxuICAgIGhlaWdodDogdGhlbWUuc3BhY2luZygzKSxcbiAgICB3aWR0aDogdGhlbWUuc3BhY2luZygzKSxcbiAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgbWFyZ2luUmlnaHQ6IHRoZW1lLnNwYWNpbmcoMiksXG4gICAgZmxleFNocmluazogMCxcbiAgfSl9XG5gO1xuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUxlZGdlckNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0xlZGdlclByb3ZpZGVyJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIEF2YWxhbmNoZSxcbiAgRGVyaXZhdGlvblBhdGgsXG4gIGdldEFkZHJlc3NGcm9tWFB1YixcbiAgZ2V0RXZtQWRkcmVzc0Zyb21QdWJLZXksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgdXNlR2V0QXZheEJhbGFuY2UgfSBmcm9tICdAc3JjL2hvb2tzL3VzZUdldEF2YXhCYWxhbmNlJztcbmltcG9ydCB7IFB1YktleVR5cGUgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L21vZGVscyc7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgRGl2aWRlcixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgRGVyaXZhdGlvblBhdGhEcm9wZG93biB9IGZyb20gJ0BzcmMvcGFnZXMvT25ib2FyZGluZy9jb21wb25lbnRzL0Rlcml2YXRpb25QYXRoRHJvcERvd24nO1xuaW1wb3J0IHsgRGVyaXZlZEFkZHJlc3NlcyB9IGZyb20gJ0BzcmMvcGFnZXMvT25ib2FyZGluZy9jb21wb25lbnRzL0Rlcml2ZWRBZGRyZXNzZXMnO1xuaW1wb3J0IHsgU2VjcmV0VHlwZSB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9zZWNyZXRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VJbXBvcnRMZWRnZXIgfSBmcm9tICdAc3JjL3BhZ2VzL0FjY291bnRzL2hvb2tzL3VzZUltcG9ydExlZGdlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWRkcmVzc1R5cGUge1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIGJhbGFuY2U6IHN0cmluZztcbn1cblxuZXhwb3J0IGVudW0gTGVkZ2VyU3RhdHVzIHtcbiAgTEVER0VSX1VOSU5JVElBVEVEID0gJ3VuaW5pdGlhdGVkJyxcbiAgTEVER0VSX0xPQURJTkcgPSAnbG9hZGluZycsXG4gIExFREdFUl9DT05ORUNURUQgPSAnY29ubmVjdGVkJyxcbiAgTEVER0VSX0NPTk5FQ1RJT05fRkFJTEVEID0gJ2ZhaWxlZCcsXG59XG5cbi8qKlxuICogV2FpdGluZyB0aGlzIGFtb3VudCBvZiB0aW1lIG90aGVyd2lzZSB0aGlzIHNjcmVlbiB3b3VsZCBiZSBhIGJsaXAgYW5kIHRoZSB1c2VyIHdvdWxkbnQgZXZlbiBrbm93IGl0IGhhcHBlbmVkXG4gKi9cbmNvbnN0IFdBSVRfMTUwMF9NSUxMSV9GT1JfVVNFUiA9IDE1MDA7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGVkZ2VyQ29ubmVjdG9yRGF0YSB7XG4gIHhwdWI6IHN0cmluZztcbiAgeHB1YlhQOiBzdHJpbmc7XG4gIHB1YmxpY0tleXM6IFB1YktleVR5cGVbXSB8IHVuZGVmaW5lZDtcbiAgaGFzUHVibGljS2V5czogYm9vbGVhbjtcbiAgcGF0aFNwZWM6IERlcml2YXRpb25QYXRoO1xuICBsYXN0QWNjb3VudEluZGV4V2l0aEJhbGFuY2U6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIExlZGdlckNvbm5lY3RvclByb3BzIHtcbiAgb25TdWNjZXNzOiAoZGF0YTogTGVkZ2VyQ29ubmVjdG9yRGF0YSkgPT4gdm9pZDtcbiAgb25Ucm91Ymxlc2hvb3Q6ICgpID0+IHZvaWQ7XG4gIGNoZWNrSWZXYWxsZXRFeGlzdHM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTGVkZ2VyQ29ubmVjdG9yKHtcbiAgb25TdWNjZXNzLFxuICBvblRyb3VibGVzaG9vdCxcbiAgY2hlY2tJZldhbGxldEV4aXN0cyxcbn06IExlZGdlckNvbm5lY3RvclByb3BzKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBnZXRFeHRlbmRlZFB1YmxpY0tleSxcbiAgICBwb3BEZXZpY2VTZWxlY3Rpb24sXG4gICAgaGFzTGVkZ2VyVHJhbnNwb3J0LFxuICAgIHdhc1RyYW5zcG9ydEF0dGVtcHRlZCxcbiAgICBpbml0TGVkZ2VyVHJhbnNwb3J0LFxuICAgIGdldFB1YmxpY0tleSxcbiAgfSA9IHVzZUxlZGdlckNvbnRleHQoKTtcbiAgY29uc3QgeyBnZXRBdmF4QmFsYW5jZSB9ID0gdXNlR2V0QXZheEJhbGFuY2UoKTtcblxuICBjb25zdCBbcHVibGljS2V5U3RhdGUsIHNldFB1YmxpY0tleVN0YXRlXSA9IHVzZVN0YXRlPExlZGdlclN0YXR1cz4oXG4gICAgTGVkZ2VyU3RhdHVzLkxFREdFUl9VTklOSVRJQVRFRCxcbiAgKTtcbiAgY29uc3QgW2lzTGVkZ2VyRXhpc3RzRXJyb3IsIHNldElzTGVkZ2VyRXhpc3RzRXJyb3JdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IFtwYXRoU3BlYywgc2V0UGF0aFNwZWNdID0gdXNlU3RhdGU8RGVyaXZhdGlvblBhdGg+KFxuICAgIERlcml2YXRpb25QYXRoLkJJUDQ0LFxuICApO1xuICBjb25zdCBbYWRkcmVzc2VzLCBzZXRBZGRyZXNzZXNdID0gdXNlU3RhdGU8QWRkcmVzc1R5cGVbXT4oW10pO1xuICBjb25zdCBbaGFzUHVibGljS2V5cywgc2V0SGFzUHVibGljS2V5c10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtkcm9wZG93bkRpc2FibGVkLCBzZXREcm9wZG93bkRpc2FibGVkXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBsYXN0QWNjb3VudEluZGV4V2l0aEJhbGFuY2UgPSB1c2VSZWYoMCk7XG5cbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IGltcG9ydExlZGdlciB9ID0gdXNlSW1wb3J0TGVkZ2VyKCk7XG5cbiAgY29uc3QgcmVzZXRTdGF0ZXMgPSAoKSA9PiB7XG4gICAgc2V0UHVibGljS2V5U3RhdGUoTGVkZ2VyU3RhdHVzLkxFREdFUl9MT0FESU5HKTtcbiAgICBzZXRBZGRyZXNzZXMoW10pO1xuICAgIHNldEhhc1B1YmxpY0tleXMoZmFsc2UpO1xuICAgIHNldFBhdGhTcGVjKERlcml2YXRpb25QYXRoLkJJUDQ0KTtcbiAgfTtcblxuICBjb25zdCBnZXRBZGRyZXNzRnJvbVhwdWJLZXkgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoXG4gICAgICB4cHViVmFsdWU6IHN0cmluZyxcbiAgICAgIGFjY291bnRJbmRleDogbnVtYmVyLFxuICAgICAgYWRkcmVzc0xpc3Q6IEFkZHJlc3NUeXBlW10gPSBbXSxcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IGFkZHJlc3MgPSBnZXRBZGRyZXNzRnJvbVhQdWIoeHB1YlZhbHVlLCBhY2NvdW50SW5kZXgpO1xuXG4gICAgICBjb25zdCB7IGJhbGFuY2UgfSA9IGF3YWl0IGdldEF2YXhCYWxhbmNlKGFkZHJlc3MpO1xuXG4gICAgICBjb25zdCBuZXdBZGRyZXNzZXMgPSBbXG4gICAgICAgIC4uLmFkZHJlc3NMaXN0LFxuICAgICAgICB7IGFkZHJlc3MsIGJhbGFuY2U6IGJhbGFuY2UuYmFsYW5jZURpc3BsYXlWYWx1ZSB8fCAnMCcgfSxcbiAgICAgIF07XG4gICAgICBzZXRBZGRyZXNzZXMobmV3QWRkcmVzc2VzKTtcbiAgICAgIGxhc3RBY2NvdW50SW5kZXhXaXRoQmFsYW5jZS5jdXJyZW50ID0gTWF0aC5tYXgoXG4gICAgICAgIDAsXG4gICAgICAgIG5ld0FkZHJlc3Nlcy5maW5kTGFzdEluZGV4KChhZGRyKSA9PiBhZGRyLmJhbGFuY2UgIT09ICcwJyksXG4gICAgICApO1xuICAgICAgaWYgKGFjY291bnRJbmRleCA8IDIpIHtcbiAgICAgICAgYXdhaXQgZ2V0QWRkcmVzc0Zyb21YcHViS2V5KHhwdWJWYWx1ZSwgYWNjb3VudEluZGV4ICsgMSwgbmV3QWRkcmVzc2VzKTtcbiAgICAgIH1cbiAgICAgIGlmIChhY2NvdW50SW5kZXggPj0gMikge1xuICAgICAgICBjYXB0dXJlKCdPbmJvYXJkaW5nTGVkZ2VyQ29ubmVjdGVkJyk7XG4gICAgICAgIHNldFB1YmxpY0tleVN0YXRlKExlZGdlclN0YXR1cy5MRURHRVJfQ09OTkVDVEVEKTtcbiAgICAgICAgc2V0SGFzUHVibGljS2V5cyh0cnVlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtjYXB0dXJlLCBnZXRBdmF4QmFsYW5jZV0sXG4gICk7XG5cbiAgY29uc3QgaXNMZWRnZXJXYWxsZXRFeGlzdCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh7IHhwdWIsIHhwdWJYUCwgcHVibGljS2V5cywgZGVyaXZhdGlvblBhdGggfSkgPT4ge1xuICAgICAgc2V0SXNMZWRnZXJFeGlzdHNFcnJvcihmYWxzZSk7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgaW1wb3J0TGVkZ2VyKHtcbiAgICAgICAgICB4cHViLFxuICAgICAgICAgIHhwdWJYUCxcbiAgICAgICAgICBwdWJLZXlzOiBwdWJsaWNLZXlzLFxuICAgICAgICAgIHNlY3JldFR5cGU6XG4gICAgICAgICAgICBkZXJpdmF0aW9uUGF0aCA9PT0gRGVyaXZhdGlvblBhdGguQklQNDRcbiAgICAgICAgICAgICAgPyBTZWNyZXRUeXBlLkxlZGdlclxuICAgICAgICAgICAgICA6IFNlY3JldFR5cGUuTGVkZ2VyTGl2ZSxcbiAgICAgICAgICBkcnlSdW46IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAodHlwZW9mIGUgPT09ICdzdHJpbmcnICYmIGUgPT09ICdUaGlzIHdhbGxldCBhbHJlYWR5IGV4aXN0cycpIHtcbiAgICAgICAgICBzZXRJc0xlZGdlckV4aXN0c0Vycm9yKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihTdHJpbmcoZSkpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2ltcG9ydExlZGdlcl0sXG4gICk7XG5cbiAgY29uc3QgZ2V0WFB1YmxpY0tleSA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeHB1YlZhbHVlID0gYXdhaXQgZ2V0RXh0ZW5kZWRQdWJsaWNLZXkoKTtcbiAgICAgIGNvbnN0IHhwdWJYUFZhbHVlID0gYXdhaXQgZ2V0RXh0ZW5kZWRQdWJsaWNLZXkoXG4gICAgICAgIEF2YWxhbmNoZS5MZWRnZXJXYWxsZXQuZ2V0QWNjb3VudFBhdGgoJ1gnKSxcbiAgICAgICk7XG4gICAgICBpZiAoY2hlY2tJZldhbGxldEV4aXN0cykge1xuICAgICAgICBhd2FpdCBpc0xlZGdlcldhbGxldEV4aXN0KHtcbiAgICAgICAgICB4cHViOiB4cHViVmFsdWUsXG4gICAgICAgICAgeHB1YlhQOiB4cHViWFBWYWx1ZSxcbiAgICAgICAgICBwdWJsaWNLZXlzOiB1bmRlZmluZWQsXG4gICAgICAgICAgZGVyaXZhdGlvblBhdGg6IERlcml2YXRpb25QYXRoLkJJUDQ0LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHNldFB1YmxpY0tleVN0YXRlKExlZGdlclN0YXR1cy5MRURHRVJfQ09OTkVDVEVEKTtcbiAgICAgIGNhcHR1cmUoJ09uYm9hcmRpbmdMZWRnZXJDb25uZWN0ZWQnKTtcbiAgICAgIGF3YWl0IGdldEFkZHJlc3NGcm9tWHB1YktleSh4cHViVmFsdWUsIDApO1xuICAgICAgb25TdWNjZXNzKHtcbiAgICAgICAgeHB1YjogeHB1YlZhbHVlLFxuICAgICAgICB4cHViWFA6IHhwdWJYUFZhbHVlLFxuICAgICAgICBwdWJsaWNLZXlzOiB1bmRlZmluZWQsXG4gICAgICAgIGhhc1B1YmxpY0tleXM6IHRydWUsXG4gICAgICAgIHBhdGhTcGVjOiBEZXJpdmF0aW9uUGF0aC5CSVA0NCxcbiAgICAgICAgbGFzdEFjY291bnRJbmRleFdpdGhCYWxhbmNlOiBsYXN0QWNjb3VudEluZGV4V2l0aEJhbGFuY2UuY3VycmVudCxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgY2FwdHVyZSgnT25ib2FyZGluZ0xlZGdlckNvbm5lY3Rpb25GYWlsZWQnKTtcbiAgICAgIHNldFB1YmxpY0tleVN0YXRlKExlZGdlclN0YXR1cy5MRURHRVJfQ09OTkVDVElPTl9GQUlMRUQpO1xuICAgICAgcG9wRGV2aWNlU2VsZWN0aW9uKCk7XG4gICAgfVxuICB9LCBbXG4gICAgZ2V0RXh0ZW5kZWRQdWJsaWNLZXksXG4gICAgY2hlY2tJZldhbGxldEV4aXN0cyxcbiAgICBjYXB0dXJlLFxuICAgIGdldEFkZHJlc3NGcm9tWHB1YktleSxcbiAgICBvblN1Y2Nlc3MsXG4gICAgaXNMZWRnZXJXYWxsZXRFeGlzdCxcbiAgICBwb3BEZXZpY2VTZWxlY3Rpb24sXG4gIF0pO1xuXG4gIGNvbnN0IGdldERlcml2YXRpb25QYXRoVmFsdWUgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoZGVyaXZhdGlvblBhdGhTcGVjOiBEZXJpdmF0aW9uUGF0aCkgPT4ge1xuICAgICAgaWYgKCFkZXJpdmF0aW9uUGF0aFNwZWMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXdhaXQgaW5pdExlZGdlclRyYW5zcG9ydCgpO1xuICAgIH0sXG4gICAgW2luaXRMZWRnZXJUcmFuc3BvcnRdLFxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaW5pdExlZGdlclRyYW5zcG9ydCgpO1xuICB9LCBbaW5pdExlZGdlclRyYW5zcG9ydF0pO1xuXG4gIGNvbnN0IGdldFB1YktleXMgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAoXG4gICAgICBkZXJpdmF0aW9uUGF0aFNwZWM6IERlcml2YXRpb25QYXRoLFxuICAgICAgYWNjb3VudEluZGV4ID0gMCxcbiAgICAgIGFkZHJlc3NMaXN0OiBBZGRyZXNzVHlwZVtdID0gW10sXG4gICAgICBwdWJLZXlzOiBQdWJLZXlUeXBlW10gPSBbXSxcbiAgICApID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHB1YktleSA9IGF3YWl0IGdldFB1YmxpY0tleShhY2NvdW50SW5kZXgsIGRlcml2YXRpb25QYXRoU3BlYyk7XG4gICAgICAgIGNvbnN0IHB1YktleVhQID0gYXdhaXQgZ2V0UHVibGljS2V5KFxuICAgICAgICAgIGFjY291bnRJbmRleCxcbiAgICAgICAgICBkZXJpdmF0aW9uUGF0aFNwZWMsXG4gICAgICAgICAgJ0FWTScsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSBnZXRFdm1BZGRyZXNzRnJvbVB1YktleShwdWJLZXkpO1xuICAgICAgICBjb25zdCB7IGJhbGFuY2UgfSA9IGF3YWl0IGdldEF2YXhCYWxhbmNlKGFkZHJlc3MpO1xuICAgICAgICBjb25zdCBuZXdBZGRyZXNzZXMgPSBbXG4gICAgICAgICAgLi4uYWRkcmVzc0xpc3QsXG4gICAgICAgICAgeyBhZGRyZXNzLCBiYWxhbmNlOiBiYWxhbmNlLmJhbGFuY2VEaXNwbGF5VmFsdWUgfHwgJzAnIH0sXG4gICAgICAgIF07XG4gICAgICAgIHNldEFkZHJlc3NlcyhuZXdBZGRyZXNzZXMpO1xuICAgICAgICBsYXN0QWNjb3VudEluZGV4V2l0aEJhbGFuY2UuY3VycmVudCA9IE1hdGgubWF4KFxuICAgICAgICAgIDAsXG4gICAgICAgICAgbmV3QWRkcmVzc2VzLmZpbmRMYXN0SW5kZXgoKGFkZHIpID0+IGFkZHIuYmFsYW5jZSAhPT0gJzAnKSxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGFjY291bnRJbmRleCA8IDIpIHtcbiAgICAgICAgICBhd2FpdCBnZXRQdWJLZXlzKGRlcml2YXRpb25QYXRoU3BlYywgYWNjb3VudEluZGV4ICsgMSwgbmV3QWRkcmVzc2VzLCBbXG4gICAgICAgICAgICAuLi5wdWJLZXlzLFxuICAgICAgICAgICAgeyBldm06IHB1YktleS50b1N0cmluZygnaGV4JyksIHhwOiBwdWJLZXlYUC50b1N0cmluZygnaGV4JykgfSxcbiAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWNjb3VudEluZGV4ID49IDIpIHtcbiAgICAgICAgICBjYXB0dXJlKCdPbmJvYXJkaW5nTGVkZ2VyQ29ubmVjdGVkJyk7XG4gICAgICAgICAgc2V0UHVibGljS2V5U3RhdGUoTGVkZ2VyU3RhdHVzLkxFREdFUl9DT05ORUNURUQpO1xuICAgICAgICAgIGNvbnN0IHB1YmxpY0tleVZhbHVlID0gW1xuICAgICAgICAgICAgLi4ucHViS2V5cyxcbiAgICAgICAgICAgIHsgZXZtOiBwdWJLZXkudG9TdHJpbmcoJ2hleCcpLCB4cDogcHViS2V5WFAudG9TdHJpbmcoJ2hleCcpIH0sXG4gICAgICAgICAgXTtcbiAgICAgICAgICBpZiAoY2hlY2tJZldhbGxldEV4aXN0cykge1xuICAgICAgICAgICAgYXdhaXQgaXNMZWRnZXJXYWxsZXRFeGlzdCh7XG4gICAgICAgICAgICAgIHhwdWI6ICcnLFxuICAgICAgICAgICAgICB4cHViWFA6ICcnLFxuICAgICAgICAgICAgICBwdWJsaWNLZXlzOiBwdWJsaWNLZXlWYWx1ZSxcbiAgICAgICAgICAgICAgZGVyaXZhdGlvblBhdGg6IERlcml2YXRpb25QYXRoLkxlZGdlckxpdmUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0SGFzUHVibGljS2V5cyh0cnVlKTtcbiAgICAgICAgICBvblN1Y2Nlc3Moe1xuICAgICAgICAgICAgeHB1YjogJycsXG4gICAgICAgICAgICB4cHViWFA6ICcnLFxuICAgICAgICAgICAgcHVibGljS2V5czogcHVibGljS2V5VmFsdWUsXG4gICAgICAgICAgICBoYXNQdWJsaWNLZXlzOiB0cnVlLFxuICAgICAgICAgICAgcGF0aFNwZWM6IERlcml2YXRpb25QYXRoLkxlZGdlckxpdmUsXG4gICAgICAgICAgICBsYXN0QWNjb3VudEluZGV4V2l0aEJhbGFuY2U6IGxhc3RBY2NvdW50SW5kZXhXaXRoQmFsYW5jZS5jdXJyZW50LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgY2FwdHVyZSgnT25ib2FyZGluZ0xlZGdlckNvbm5lY3Rpb25GYWlsZWQnKTtcbiAgICAgICAgc2V0UHVibGljS2V5U3RhdGUoTGVkZ2VyU3RhdHVzLkxFREdFUl9DT05ORUNUSU9OX0ZBSUxFRCk7XG4gICAgICAgIHBvcERldmljZVNlbGVjdGlvbigpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW1xuICAgICAgZ2V0UHVibGljS2V5LFxuICAgICAgZ2V0QXZheEJhbGFuY2UsXG4gICAgICBjYXB0dXJlLFxuICAgICAgY2hlY2tJZldhbGxldEV4aXN0cyxcbiAgICAgIG9uU3VjY2VzcyxcbiAgICAgIGlzTGVkZ2VyV2FsbGV0RXhpc3QsXG4gICAgICBwb3BEZXZpY2VTZWxlY3Rpb24sXG4gICAgXSxcbiAgKTtcblxuICBjb25zdCB0cnlQdWJsaWNLZXkgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgY2FwdHVyZSgnT25ib2FyZGluZ0xlZGdlclJldHJ5Jyk7XG4gICAgc2V0UHVibGljS2V5U3RhdGUoTGVkZ2VyU3RhdHVzLkxFREdFUl9MT0FESU5HKTtcbiAgICBzZXREcm9wZG93bkRpc2FibGVkKHRydWUpO1xuXG4gICAgaWYgKCFoYXNMZWRnZXJUcmFuc3BvcnQpIHtcbiAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBoYXZlIGEgdHJhbnNwb3J0XG4gICAgICBhd2FpdCBpbml0TGVkZ2VyVHJhbnNwb3J0KCk7XG4gICAgfVxuICAgIGlmIChwYXRoU3BlYyA9PT0gRGVyaXZhdGlvblBhdGguQklQNDQpIHtcbiAgICAgIGF3YWl0IGdldFhQdWJsaWNLZXkoKTtcbiAgICAgIHNldERyb3Bkb3duRGlzYWJsZWQoZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGF0aFNwZWMgPT09IERlcml2YXRpb25QYXRoLkxlZGdlckxpdmUpIHtcbiAgICAgIHNldEFkZHJlc3NlcyhbXSk7XG4gICAgICBhd2FpdCBnZXRQdWJLZXlzKHBhdGhTcGVjKTtcbiAgICAgIHNldERyb3Bkb3duRGlzYWJsZWQoZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSwgW1xuICAgIGNhcHR1cmUsXG4gICAgZ2V0UHViS2V5cyxcbiAgICBnZXRYUHVibGljS2V5LFxuICAgIGhhc0xlZGdlclRyYW5zcG9ydCxcbiAgICBpbml0TGVkZ2VyVHJhbnNwb3J0LFxuICAgIHBhdGhTcGVjLFxuICBdKTtcblxuICBjb25zdCBvblBhdGhTZWxlY3RlZCA9IGFzeW5jIChzZWxlY3RlZFBhdGhTcGVjOiBEZXJpdmF0aW9uUGF0aCkgPT4ge1xuICAgIHJlc2V0U3RhdGVzKCk7XG4gICAgc2V0UGF0aFNwZWMoc2VsZWN0ZWRQYXRoU3BlYyk7XG4gICAgc2V0RHJvcGRvd25EaXNhYmxlZCh0cnVlKTtcbiAgICBpZiAoc2VsZWN0ZWRQYXRoU3BlYyA9PT0gRGVyaXZhdGlvblBhdGguQklQNDQpIHtcbiAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBnZXRYUHVibGljS2V5KCk7XG4gICAgICAgIHNldERyb3Bkb3duRGlzYWJsZWQoZmFsc2UpO1xuICAgICAgfSwgV0FJVF8xNTAwX01JTExJX0ZPUl9VU0VSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNlbGVjdGVkUGF0aFNwZWMgPT09IERlcml2YXRpb25QYXRoLkxlZGdlckxpdmUpIHtcbiAgICAgIGdldERlcml2YXRpb25QYXRoVmFsdWUoc2VsZWN0ZWRQYXRoU3BlYyk7XG4gICAgICBhd2FpdCBnZXRQdWJLZXlzKHNlbGVjdGVkUGF0aFNwZWMpO1xuICAgICAgc2V0RHJvcGRvd25EaXNhYmxlZChmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEF0dGVtcHQgdG8gYXV0b21hdGljYWxseSBjb25uZWN0IHVzaW5nIExlZGdlciBMaXZlIGFzIHNvb24gYXMgd2VcbiAgLy8gZXN0YWJsaXNoIHRoZSB0cmFuc3BvcnQuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcmV0cmlldmVLZXlzID0gYXN5bmMgKHNlbGVjdGVkUGF0aFNwZWM6IERlcml2YXRpb25QYXRoKSA9PiB7XG4gICAgICBzZXRQdWJsaWNLZXlTdGF0ZShMZWRnZXJTdGF0dXMuTEVER0VSX0xPQURJTkcpO1xuICAgICAgc2V0RHJvcGRvd25EaXNhYmxlZCh0cnVlKTtcbiAgICAgIGlmIChzZWxlY3RlZFBhdGhTcGVjID09PSBEZXJpdmF0aW9uUGF0aC5MZWRnZXJMaXZlKSB7XG4gICAgICAgIHNldEFkZHJlc3NlcyhbXSk7XG4gICAgICAgIGF3YWl0IGdldFB1YktleXMoc2VsZWN0ZWRQYXRoU3BlYyk7XG4gICAgICAgIHNldERyb3Bkb3duRGlzYWJsZWQoZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFBhdGhTcGVjID09PSBEZXJpdmF0aW9uUGF0aC5CSVA0NCkge1xuICAgICAgICBhd2FpdCBnZXRYUHVibGljS2V5KCk7XG4gICAgICAgIHNldERyb3Bkb3duRGlzYWJsZWQoZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgaWYgKGhhc1B1YmxpY0tleXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBoYXNMZWRnZXJUcmFuc3BvcnQgJiZcbiAgICAgIHB1YmxpY0tleVN0YXRlID09PSBMZWRnZXJTdGF0dXMuTEVER0VSX1VOSU5JVElBVEVEXG4gICAgKSB7XG4gICAgICByZXRyaWV2ZUtleXMocGF0aFNwZWMpO1xuICAgIH0gZWxzZSBpZiAoIWhhc0xlZGdlclRyYW5zcG9ydCkge1xuICAgICAgaWYgKFxuICAgICAgICB3YXNUcmFuc3BvcnRBdHRlbXB0ZWQgJiZcbiAgICAgICAgcHVibGljS2V5U3RhdGUgIT09IExlZGdlclN0YXR1cy5MRURHRVJfQ09OTkVDVElPTl9GQUlMRURcbiAgICAgICkge1xuICAgICAgICBzZXRQdWJsaWNLZXlTdGF0ZShMZWRnZXJTdGF0dXMuTEVER0VSX0NPTk5FQ1RJT05fRkFJTEVEKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdldERlcml2YXRpb25QYXRoVmFsdWUocGF0aFNwZWMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW1xuICAgIHBhdGhTcGVjLFxuICAgIGhhc0xlZGdlclRyYW5zcG9ydCxcbiAgICBwdWJsaWNLZXlTdGF0ZSxcbiAgICBoYXNQdWJsaWNLZXlzLFxuICAgIGdldFB1YktleXMsXG4gICAgZ2V0RGVyaXZhdGlvblBhdGhWYWx1ZSxcbiAgICB3YXNUcmFuc3BvcnRBdHRlbXB0ZWQsXG4gICAgZ2V0WFB1YmxpY0tleSxcbiAgXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2s+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogdGhlbWUuc3BhY2luZyg0NCksXG4gICAgICAgICAgYWxpZ25TZWxmOiAnY2VudGVyJyxcbiAgICAgICAgICBtdDogNy41LFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8RGVyaXZhdGlvblBhdGhEcm9wZG93blxuICAgICAgICAgIHBhdGhTcGVjPXtwYXRoU3BlY31cbiAgICAgICAgICBvblBhdGhTZWxlY3RlZD17b25QYXRoU2VsZWN0ZWR9XG4gICAgICAgICAgaXNEaXNhYmxlZD17ZHJvcGRvd25EaXNhYmxlZH1cbiAgICAgICAgLz5cbiAgICAgICAge3BhdGhTcGVjICYmXG4gICAgICAgICAgcHVibGljS2V5U3RhdGUgIT09IExlZGdlclN0YXR1cy5MRURHRVJfVU5JTklUSUFURUQgJiZcbiAgICAgICAgICBwdWJsaWNLZXlTdGF0ZSAhPT0gTGVkZ2VyU3RhdHVzLkxFREdFUl9DT05ORUNUSU9OX0ZBSUxFRCAmJiAoXG4gICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICBtdDogNCxcbiAgICAgICAgICAgICAgICByb3dHYXA6IDMsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxEaXZpZGVyIGZsZXhJdGVtIC8+XG4gICAgICAgICAgICAgIDxEZXJpdmVkQWRkcmVzc2VzIGFkZHJlc3Nlcz17YWRkcmVzc2VzfSAvPlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICApfVxuICAgICAgPC9TdGFjaz5cbiAgICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAge3B1YmxpY0tleVN0YXRlID09PSBMZWRnZXJTdGF0dXMuTEVER0VSX0NPTk5FQ1RJT05fRkFJTEVEICYmIChcbiAgICAgICAgICA8U3RhY2sgc3g9e3sgbXQ6IDEsIHJvd0dhcDogMywgd2lkdGg6IHRoZW1lLnNwYWNpbmcoNDQpIH19PlxuICAgICAgICAgICAgPFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiPlxuICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjYXB0aW9uXCJcbiAgICAgICAgICAgICAgICBzeD17eyBjb2xvcjogdGhlbWUucGFsZXR0ZS5lcnJvci5tYWluIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7IWlzTGVkZ2VyRXhpc3RzRXJyb3IgJiYgKFxuICAgICAgICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgICAgICAgIGkxOG5LZXk9e1xuICAgICAgICAgICAgICAgICAgICAgICdVbmFibGUgdG8gY29ubmVjdC4gVmlldyB0aGUgdHJvdWJsZXNob290IGd1aWRlIDxsaW5rVGV4dD5oZXJlPC9saW5rVGV4dD4nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgICAgICAgICAgICAgIGxpbmtUZXh0OiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblRyb3VibGVzaG9vdCgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbkNvbG9yOiB0aGVtZS5wYWxldHRlLmVycm9yLm1haW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAge2lzTGVkZ2VyRXhpc3RzRXJyb3IgJiYgdCgnVGhpcyB3YWxsZXQgYWxyZWFkeSBleGlzdHMnKX1cbiAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgIDxCdXR0b24gb25DbGljaz17KCkgPT4gdHJ5UHVibGljS2V5KCl9IGZ1bGxXaWR0aD5cbiAgICAgICAgICAgICAge3QoJ1JldHJ5Jyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICApfVxuICAgICAgPC9TdGFjaz5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgU3R5bGVkTnVtYmVyTGlzdCB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vU3R5bGVkTnVtYmVyTGlzdCc7XG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIERpdmlkZXIsXG4gIFN0YWNrLFxuICBTeFByb3BzLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IFR5cG9ncmFwaHlMaW5rIH0gZnJvbSAnLi4vLi4vcGFnZXMvT25ib2FyZGluZy9jb21wb25lbnRzL1R5cG9ncmFwaHlMaW5rJztcblxuZXhwb3J0IGVudW0gTGVkZ2VyVHJvdWJsZVN0ZXBzRm9udFZhcmlhbnQge1xuICBzbWFsbCA9ICdib2R5MScsXG4gIGxhcmdlID0gJ2JvZHkyJyxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIExlZGdlclRyb3VibGVTdGVwcyh7XG4gIGZvbnRWYXJpYW50ID0gTGVkZ2VyVHJvdWJsZVN0ZXBzRm9udFZhcmlhbnQuc21hbGwsXG4gIHN4ID0ge30sXG59OiB7XG4gIGZvbnRWYXJpYW50PzogTGVkZ2VyVHJvdWJsZVN0ZXBzRm9udFZhcmlhbnQ7XG4gIHN4PzogU3hQcm9wcztcbn0pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB0aGVtZSA9IHVzZVRoZW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgLi4uc3gsIHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICByb3dHYXA6IDIsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxTdGFja1xuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFN0eWxlZE51bWJlckxpc3Q+e3QoJzEuJyl9PC9TdHlsZWROdW1iZXJMaXN0PlxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9e2ZvbnRWYXJpYW50fT5cbiAgICAgICAgICAgIHt0KCdDb25uZWN0IHRoZSBMZWRnZXIgZGV2aWNlIHRvIHlvdXIgY29tcHV0ZXIuJyl9XG4gICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdHlsZWROdW1iZXJMaXN0Pnt0KCcyLicpfTwvU3R5bGVkTnVtYmVyTGlzdD5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PXtmb250VmFyaWFudH0+e3QoJ0VudGVyIHlvdXIgUElOLicpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICA8U3RhY2tcbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTdHlsZWROdW1iZXJMaXN0Pnt0KCczLicpfTwvU3R5bGVkTnVtYmVyTGlzdD5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PXtmb250VmFyaWFudH0+XG4gICAgICAgICAgICA8VHJhbnNcbiAgICAgICAgICAgICAgaTE4bktleT1cIkVuc3VyZSB5b3UgaGF2ZSBpbnN0YWxsZWQgdGhlIGxhdGVzdCA8dHlwb2dyYXBoeT5BdmFsYW5jaGUgQXBwPC90eXBvZ3JhcGh5PiBhbmQgb3BlbiBpdCBvbiB5b3VyIGRldmljZS5cIlxuICAgICAgICAgICAgICBjb21wb25lbnRzPXt7XG4gICAgICAgICAgICAgICAgdHlwb2dyYXBoeTogKFxuICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCJcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgPC9TdGFjaz5cblxuICAgICAgICA8RGl2aWRlciBmbGV4SXRlbSBzdHlsZT17eyBtYXJnaW46IGAke3RoZW1lLnNwYWNpbmcoMSl9IDBgIH19IC8+XG5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD17Zm9udFZhcmlhbnR9PlxuICAgICAgICAgIDxUcmFuc1xuICAgICAgICAgICAgaTE4bktleT1cIklmIHlvdSBkbyBub3QgaGF2ZSB0aGUgbGF0ZXN0IEF2YWxhbmNoZSBBcHAsIHBsZWFzZSBhZGQgaXQgdGhyb3VnaCB0aGUgPGxlZGdlckxpbms+TGVkZ2VyIExpdmU8L2xlZGdlckxpbms+IGFwcCBtYW5hZ2VyLlwiXG4gICAgICAgICAgICBjb21wb25lbnRzPXt7XG4gICAgICAgICAgICAgIGxlZGdlckxpbms6IChcbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeUxpbmtcbiAgICAgICAgICAgICAgICAgIGFzPVwiYVwiXG4gICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly93d3cubGVkZ2VyLmNvbS9sZWRnZXItbGl2ZVwiXG4gICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgICB2YXJpYW50PXtmb250VmFyaWFudH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9e2ZvbnRWYXJpYW50fT5cbiAgICAgICAgICA8VHJhbnNcbiAgICAgICAgICAgIGkxOG5LZXk9XCJNb3JlIGluc3RydWN0aW9ucyBjYW4gYmUgZm91bmQgPGxlZGdlckxpbms+aGVyZTwvbGVkZ2VyTGluaz4uXCJcbiAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgbGVkZ2VyTGluazogKFxuICAgICAgICAgICAgICAgIDxUeXBvZ3JhcGh5TGlua1xuICAgICAgICAgICAgICAgICAgYXM9XCJhXCJcbiAgICAgICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3N1cHBvcnQubGVkZ2VyLmNvbS9oYy9lbi11cy9hcnRpY2xlcy80NDA0Mzg5NjA2NDE3LURvd25sb2FkLWFuZC1pbnN0YWxsLUxlZGdlci1MaXZlP2RvY3M9dHJ1ZVwiXG4gICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgICB2YXJpYW50PXtmb250VmFyaWFudH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICA8L1N0YWNrPlxuICAgIDwvU3RhY2s+XG4gICk7XG59XG4iLCJpbXBvcnQgeyBHZXROYXRpdmVCYWxhbmNlSGFuZGxlciB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9iYWxhbmNlcy9oYW5kbGVycy9nZXROYXRpdmVCYWxhbmNlJztcbmltcG9ydCB7IEV4dGVuc2lvblJlcXVlc3QgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvY29ubmVjdGlvbnMvZXh0ZW5zaW9uQ29ubmVjdGlvbi9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VHZXRBdmF4QmFsYW5jZSgpIHtcbiAgY29uc3QgeyByZXF1ZXN0IH0gPSB1c2VDb25uZWN0aW9uQ29udGV4dCgpO1xuICBhc3luYyBmdW5jdGlvbiBnZXRBdmF4QmFsYW5jZShhZGRyZXNzOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXF1ZXN0PEdldE5hdGl2ZUJhbGFuY2VIYW5kbGVyPih7XG4gICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuQkFMQU5DRV9OQVRJVkVfR0VULFxuICAgICAgcGFyYW1zOiBbYWRkcmVzcywgJ2VpcDE1NTo0MzExNCddLFxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldEF2YXhCYWxhbmNlLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQge1xuICBJbXBvcnRMZWRnZXJXYWxsZXRQYXJhbXMsXG4gIEltcG9ydFdhbGxldFJlc3VsdCxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3dhbGxldC9oYW5kbGVycy9tb2RlbHMnO1xuaW1wb3J0IHsgRXh0ZW5zaW9uUmVxdWVzdCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9jb25uZWN0aW9ucy9leHRlbnNpb25Db25uZWN0aW9uL21vZGVscyc7XG5pbXBvcnQgeyB1c2VDb25uZWN0aW9uQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29ubmVjdGlvblByb3ZpZGVyJztcbmltcG9ydCB7IEltcG9ydExlZGdlckhhbmRsZXIgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvd2FsbGV0L2hhbmRsZXJzL2ltcG9ydExlZGdlcic7XG5cbnR5cGUgSW1wb3J0V2FsbGV0Rm4gPSAoXG4gIHBhcmFtczogSW1wb3J0TGVkZ2VyV2FsbGV0UGFyYW1zLFxuKSA9PiBQcm9taXNlPEltcG9ydFdhbGxldFJlc3VsdD47XG5cbmV4cG9ydCBjb25zdCB1c2VJbXBvcnRMZWRnZXIgPSAoKSA9PiB7XG4gIGNvbnN0IHsgcmVxdWVzdCB9ID0gdXNlQ29ubmVjdGlvbkNvbnRleHQoKTtcbiAgY29uc3QgW2lzSW1wb3J0aW5nLCBzZXRJc0ltcG9ydGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgaW1wb3J0TGVkZ2VyOiBJbXBvcnRXYWxsZXRGbiA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChwYXJhbXMpID0+IHtcbiAgICAgIHNldElzSW1wb3J0aW5nKHRydWUpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXF1ZXN0PEltcG9ydExlZGdlckhhbmRsZXI+KHtcbiAgICAgICAgICBtZXRob2Q6IEV4dGVuc2lvblJlcXVlc3QuV0FMTEVUX0lNUE9SVF9MRURHRVIsXG4gICAgICAgICAgcGFyYW1zOiBbcGFyYW1zXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHNldElzSW1wb3J0aW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtyZXF1ZXN0XSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGlzSW1wb3J0aW5nLFxuICAgIGltcG9ydExlZGdlcixcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBMZWRnZXJOYW5vIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL2NvbW1vbi9MZWRnZXJOYW5vJztcbmltcG9ydCB7IFRyYW5zLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQnV0dG9uLFxuICBDYXJkLFxuICBTdGFjayxcbiAgVHlwb2dyYXBoeSxcbiAgdXNlVGhlbWUsXG4gIFhJY29uLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgTGVkZ2VyV3JvbmdWZXJzaW9uQ29udGVudCA9ICgpID0+IChcbiAgPD5cbiAgICA8VHlwb2dyYXBoeVxuICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgIHN4PXt7XG4gICAgICAgIHB0OiAxLFxuICAgICAgICBwYjogNCxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFRyYW5zXG4gICAgICAgIGkxOG5LZXk9XCJQbGVhc2UgdXBkYXRlIHRoZSA8dHlwb2dyYXBoeT5BdmFsYW5jaGUgQXBwbGljYXRpb248L3R5cG9ncmFwaHk+IG9uIHlvdXIgTGVkZ2VyIGRldmljZSB0byBjb250aW51ZS5cIlxuICAgICAgICBjb21wb25lbnRzPXt7XG4gICAgICAgICAgdHlwb2dyYXBoeTogPFR5cG9ncmFwaHkgc3g9e3sgZm9udFdlaWdodDogJ3NlbWlib2xkJyB9fSAvPixcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgPC9UeXBvZ3JhcGh5PlxuICAgIDxTdGFjayBzeD17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgIDxMZWRnZXJOYW5vIC8+XG4gICAgPC9TdGFjaz5cbiAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBtdDogMywgbWI6IDEgfX0+XG4gICAgICA8VHJhbnNcbiAgICAgICAgaTE4bktleT1cIkRvd25sb2FkIDxsZWRnZXJMaW5rPkxlZGdlciBMaXZlPC9sZWRnZXJMaW5rPiB0byB1cGRhdGUuXCJcbiAgICAgICAgY29tcG9uZW50cz17e1xuICAgICAgICAgIGxlZGdlckxpbms6IChcbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5XG4gICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ3NlbWlib2xkJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3NlY29uZGFyeS5tYWluJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgYXM9XCJhXCJcbiAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vc3VwcG9ydC5sZWRnZXIuY29tL2hjL2VuLXVzL2FydGljbGVzLzQ0MDQzODk2MDY0MTctRG93bmxvYWQtYW5kLWluc3RhbGwtTGVkZ2VyLUxpdmU/ZG9jcz10cnVlXCJcbiAgICAgICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICksXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgIDwvVHlwb2dyYXBoeT5cbiAgPC8+XG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gTGVkZ2VyV3JvbmdWZXJzaW9uKHtcbiAgb25DbG9zZSxcbiAgY2xhc3NOYW1lLFxufToge1xuICBvbkNsb3NlOiAoKSA9PiB2b2lkO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG59KSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICByZXR1cm4gKFxuICAgIDxDYXJkXG4gICAgICBzeD17e1xuICAgICAgICBwOiB0aGVtZS5zcGFjaW5nKDIpLFxuICAgICAgICB3aWR0aDogdGhlbWUuc3BhY2luZyg0MyksXG4gICAgICB9fVxuICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgPlxuICAgICAgPFN0YWNrXG4gICAgICAgIHN4PXt7XG4gICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gb25DbG9zZT8uKCl9XG4gICAgICAgICAgc3g9e3sgYWxpZ25TZWxmOiAnZmxleC1lbmQnIH19XG4gICAgICAgID5cbiAgICAgICAgICA8WEljb25cbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICAgICAgY29sb3I6ICdwcmltYXJ5Lm1haW4nLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCI+e3QoJ1VwZGF0ZSBSZXF1aXJlZCcpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgPExlZGdlcldyb25nVmVyc2lvbkNvbnRlbnQgLz5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9DYXJkPlxuICApO1xufVxuIiwiaW1wb3J0IHsgTGVkZ2VyV3JvbmdWZXJzaW9uIH0gZnJvbSAnLi9MZWRnZXJXcm9uZ1ZlcnNpb24nO1xuaW1wb3J0IHsgdXNlV2FsbGV0Q29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvV2FsbGV0UHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgUkVRVUlSRURfTEVER0VSX1ZFUlNJT04sXG4gIHVzZUxlZGdlckNvbnRleHQsXG59IGZyb20gJ0BzcmMvY29udGV4dHMvTGVkZ2VyUHJvdmlkZXInO1xuaW1wb3J0IHsgaXNMZWRnZXJWZXJzaW9uQ29tcGF0aWJsZSB9IGZyb20gJ0BzcmMvdXRpbHMvaXNMZWRnZXJWZXJzaW9uQ29tcGF0aWJsZSc7XG5pbXBvcnQgeyBCYWNrZHJvcCwgU3RhY2sgfSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gTGVkZ2VyV3JvbmdWZXJzaW9uT3ZlcmxheSh7XG4gIG9uQ2xvc2UsXG59OiB7XG4gIG9uQ2xvc2U/OiAoKSA9PiB2b2lkO1xufSkge1xuICBjb25zdCB7IGlzTGVkZ2VyV2FsbGV0IH0gPSB1c2VXYWxsZXRDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBsZWRnZXJWZXJzaW9uV2FybmluZ0Nsb3NlZCxcbiAgICB1cGRhdGVMZWRnZXJWZXJzaW9uV2FybmluZ0Nsb3NlZCxcbiAgICBhdmF4QXBwVmVyc2lvbixcbiAgICBoYXNMZWRnZXJUcmFuc3BvcnQsXG4gIH0gPSB1c2VMZWRnZXJDb250ZXh0KCk7XG5cbiAgLy8gY2hlY2tzIHRvIG1ha2Ugc3VyZSB0aGVyZSBpcyBhIEFWQVggbGVkZ2VyIGFwcCB2ZXJzaW9uXG4gIC8vIGxlZGdlciBpcyBjb25uZWN0ZWRcbiAgLy8gQVZBWCBsZWRnZXIgYXBwIG1lZXRzIG1pbmludW0gdmVyc2lvbiByZXF1aXJlbWVudFxuICBjb25zdCBsZWRnZXJDaGVjayA9XG4gICAgYXZheEFwcFZlcnNpb24gJiZcbiAgICBoYXNMZWRnZXJUcmFuc3BvcnQgJiZcbiAgICAhaXNMZWRnZXJWZXJzaW9uQ29tcGF0aWJsZShhdmF4QXBwVmVyc2lvbiwgUkVRVUlSRURfTEVER0VSX1ZFUlNJT04pO1xuXG4gIC8vIFVzZWQgaW4gT25ib2FyZGluZ1xuICBpZiAob25DbG9zZSAmJiBsZWRnZXJDaGVjaykge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFja2Ryb3Agb3Blbj5cbiAgICAgICAgPExlZGdlcldyb25nVmVyc2lvbiBvbkNsb3NlPXtvbkNsb3NlfSAvPlxuICAgICAgPC9CYWNrZHJvcD5cbiAgICApO1xuICB9XG5cbiAgLy8gVXNlZCBvbiBQb3J0Zm9saW9cbiAgaWYgKCFsZWRnZXJWZXJzaW9uV2FybmluZ0Nsb3NlZCAmJiBpc0xlZGdlcldhbGxldCAmJiBsZWRnZXJDaGVjaykge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFja2Ryb3Agb3Blbj5cbiAgICAgICAgPFN0YWNrIHN4PXt7IG06IDIgfX0+XG4gICAgICAgICAgPExlZGdlcldyb25nVmVyc2lvblxuICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gdXBkYXRlTGVkZ2VyVmVyc2lvbldhcm5pbmdDbG9zZWQoKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0YWNrPlxuICAgICAgPC9CYWNrZHJvcD5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCJpbXBvcnQgeyBEZXJpdmF0aW9uUGF0aCB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtd2FsbGV0cy1zZGsnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB7XG4gIENoZWNrSWNvbixcbiAgU3RhY2ssXG4gIFR5cG9ncmFwaHksXG4gIHVzZVRoZW1lLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgRHJvcGRvd24sIERyb3Bkb3duSXRlbSB9IGZyb20gJ0BzcmMvY29tcG9uZW50cy9jb21tb24vRHJvcGRvd24nO1xuXG5pbnRlcmZhY2UgRGVyaXZhdGlvblBhdGhEcm9wZG93blByb3BzIHtcbiAgb25QYXRoU2VsZWN0ZWQ6IChwYXRoOiBEZXJpdmF0aW9uUGF0aCkgPT4gdm9pZDtcbiAgcGF0aFNwZWM6IERlcml2YXRpb25QYXRoO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRGVyaXZhdGlvblBhdGhEcm9wZG93bih7XG4gIHBhdGhTcGVjLFxuICBvblBhdGhTZWxlY3RlZCxcbiAgaXNEaXNhYmxlZCxcbn06IERlcml2YXRpb25QYXRoRHJvcGRvd25Qcm9wcykge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjaz5cbiAgICAgIDxEcm9wZG93blxuICAgICAgICBkZWZhdWx0VmFsdWU9e3BhdGhTcGVjfVxuICAgICAgICBpbnB1dFByb3BzPXt7XG4gICAgICAgICAgTWVudVByb3BzOiB7XG4gICAgICAgICAgICBNZW51TGlzdFByb3BzOiB7XG4gICAgICAgICAgICAgIHN4OiB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGVtZS5wYWxldHRlLmdyZXlbODUwXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfX1cbiAgICAgICAgU2VsZWN0UHJvcHM9e3tcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6ICcnLFxuICAgICAgICAgIG5hdGl2ZTogZmFsc2UsXG4gICAgICAgICAgZGlzcGxheUVtcHR5OiB0cnVlLFxuICAgICAgICAgIHJlbmRlclZhbHVlOiAoKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBhdGhTcGVjKSB7XG4gICAgICAgICAgICAgIGNhc2UgRGVyaXZhdGlvblBhdGguTGVkZ2VyTGl2ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gPFR5cG9ncmFwaHk+e3QoJ0xlZGdlciBMaXZlJyl9PC9UeXBvZ3JhcGh5PjtcbiAgICAgICAgICAgICAgY2FzZSBEZXJpdmF0aW9uUGF0aC5CSVA0NDpcbiAgICAgICAgICAgICAgICByZXR1cm4gPFR5cG9ncmFwaHk+e3QoJ0JJUDQ0IChEZWZhdWx0KScpfTwvVHlwb2dyYXBoeT47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkNoYW5nZTogKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIGlmIChwYXRoICYmIHBhdGggIT09IHBhdGhTcGVjKSB7XG4gICAgICAgICAgICAgIG9uUGF0aFNlbGVjdGVkKHBhdGggYXMgRGVyaXZhdGlvblBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH19XG4gICAgICAgIGxhYmVsPXt0KCdTZWxlY3QgZGVyaXZhdGlvbiBwYXRoJyl9XG4gICAgICAgIElucHV0UHJvcHM9e3sgZGlzYWJsZWQ6IGlzRGlzYWJsZWQgfX1cbiAgICAgID5cbiAgICAgICAgPERyb3Bkb3duSXRlbVxuICAgICAgICAgIHZhbHVlPXtEZXJpdmF0aW9uUGF0aC5CSVA0NH1cbiAgICAgICAgICBzZWxlY3RlZD17cGF0aFNwZWMgPT09IERlcml2YXRpb25QYXRoLkJJUDQ0fVxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY29ubmVjdC1hY2NvdW50LW1lbnUtaXRlbVwiXG4gICAgICAgID5cbiAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj57dCgnQklQNDQgKERlZmF1bHQpJyl9PC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAge3BhdGhTcGVjID09PSBEZXJpdmF0aW9uUGF0aC5CSVA0NCAmJiA8Q2hlY2tJY29uIC8+fVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvRHJvcGRvd25JdGVtPlxuXG4gICAgICAgIDxEcm9wZG93bkl0ZW1cbiAgICAgICAgICB2YWx1ZT17RGVyaXZhdGlvblBhdGguTGVkZ2VyTGl2ZX1cbiAgICAgICAgICBzZWxlY3RlZD17cGF0aFNwZWMgPT09IERlcml2YXRpb25QYXRoLkxlZGdlckxpdmV9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjb25uZWN0LWFjY291bnQtbWVudS1pdGVtXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MlwiPnt0KCdMZWRnZXIgTGl2ZScpfTwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgIHtwYXRoU3BlYyA9PT0gRGVyaXZhdGlvblBhdGguTGVkZ2VyTGl2ZSAmJiA8Q2hlY2tJY29uIC8+fVxuICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgIDwvRHJvcGRvd25JdGVtPlxuICAgICAgPC9Ecm9wZG93bj5cbiAgICA8L1N0YWNrPlxuICApO1xufVxuIiwiaW1wb3J0IHsgdHJ1bmNhdGVBZGRyZXNzIH0gZnJvbSAnQHNyYy91dGlscy90cnVuY2F0ZUFkZHJlc3MnO1xuaW1wb3J0IHsgQWRkcmVzc1R5cGUgfSBmcm9tICcuLi9wYWdlcy9MZWRnZXIvTGVkZ2VyQ29ubmVjdCc7XG5pbXBvcnQgeyBnZXRBdmFsYW5jaGVBZGRyZXNzTGluayB9IGZyb20gJ0BzcmMvdXRpbHMvZ2V0RXhwbG9yZXJBZGRyZXNzJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQge1xuICBDYXJkLFxuICBDYXJkQ29udGVudCxcbiAgRGl2aWRlcixcbiAgRXh0ZXJuYWxMaW5rSWNvbixcbiAgU2tlbGV0b24sXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxuICB1c2VUaGVtZSxcbiAgVG9vbHRpcCxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmludGVyZmFjZSBEZXJpdmVkQWRkcmVzc2VzUHJvcHMge1xuICBhZGRyZXNzZXM6IEFkZHJlc3NUeXBlW107XG59XG5leHBvcnQgZnVuY3Rpb24gRGVyaXZlZEFkZHJlc3Nlcyh7IGFkZHJlc3NlcyB9OiBEZXJpdmVkQWRkcmVzc2VzUHJvcHMpIHtcbiAgY29uc3QgdGhlbWUgPSB1c2VUaGVtZSgpO1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IGhhc0JhbGFuY2UgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gYWRkcmVzc2VzLmZpbmQoKGFkZHJlc3MpID0+IGFkZHJlc3MuYmFsYW5jZSAhPT0gJzAnKTtcbiAgfSwgW2FkZHJlc3Nlc10pO1xuXG4gIHJldHVybiAoXG4gICAgPENhcmRcbiAgICAgIHN4PXt7XG4gICAgICAgIHdpZHRoOiB0aGVtZS5zcGFjaW5nKDQzLjUpLFxuICAgICAgICBoZWlnaHQ6IHRoZW1lLnNwYWNpbmcoMjEuMjUpLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuZ3JleVs4NTBdLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8Q2FyZENvbnRlbnQ+XG4gICAgICAgIDxTdGFjaz5cbiAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17eyBmb250V2VpZ2h0OiAnc2VtaWJvbGQnIH19PlxuICAgICAgICAgICAge3QoJ1lvdXIgRGVyaXZlZCBBZGRyZXNzZXMnKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgPFN0YWNrIGFsaWduSXRlbXM9XCJzcGFjZS1iZXR3ZWVuXCIgZGl2aWRlcj17PERpdmlkZXIgZmxleEl0ZW0gLz59PlxuICAgICAgICAgICAge2FkZHJlc3Nlcy5tYXAoKGFkZHJlc3NEYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoaGFzQmFsYW5jZSAmJiBhZGRyZXNzRGF0YS5iYWxhbmNlID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc3QgZXhwbG9yZXJMaW5rID0gZ2V0QXZhbGFuY2hlQWRkcmVzc0xpbmsoYWRkcmVzc0RhdGEuYWRkcmVzcyk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8U3RhY2sga2V5PXtpbmRleH0+XG4gICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgIHB5OiAxLjUsXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxTdGFja1xuICAgICAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwcjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+e2luZGV4ICsgMX0uPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwcjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRvb2x0aXAgcGxhY2VtZW50PVwidG9wXCIgdGl0bGU9e2FkZHJlc3NEYXRhLmFkZHJlc3N9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJib2R5MlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdzZW1pYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0cnVuY2F0ZUFkZHJlc3MoYWRkcmVzc0RhdGEuYWRkcmVzcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgICAgICA8U3RhY2tcbiAgICAgICAgICAgICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uR2FwOiAxLFxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHthZGRyZXNzRGF0YS5iYWxhbmNlfSBBVkFYXG4gICAgICAgICAgICAgICAgICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgICAgICAgICAgICAgICAgICAgIHtleHBsb3JlckxpbmsgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXM9XCJhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17ZXhwbG9yZXJMaW5rfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEV4dGVybmFsTGlua0ljb24gc3g9e3sgY29sb3I6ICdwcmltYXJ5Lm1haW4nIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgICAgIDwvU3RhY2s+XG4gICAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAge2FkZHJlc3Nlcy5sZW5ndGggPCAzICYmIChcbiAgICAgICAgICAgICAgPFN0YWNrXG4gICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICAgICAgICAgICAgICAgICAgcHk6IDEuNSxcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgZGl2aWRlcj17PERpdmlkZXIgZmxleEl0ZW0gLz59XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8U3RhY2sgc3g9e3sgcHI6IDIgfX0+XG4gICAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIj5cbiAgICAgICAgICAgICAgICAgICAge2FkZHJlc3Nlcy5sZW5ndGggKyAxfS5cbiAgICAgICAgICAgICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgICAgICAgICAgICA8L1N0YWNrPlxuICAgICAgICAgICAgICAgIDxTa2VsZXRvblxuICAgICAgICAgICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoZW1lLnNwYWNpbmcoNDEuMyksXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhlbWUuc3BhY2luZygyKSxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgPC9TdGFjaz5cbiAgICAgIDwvQ2FyZENvbnRlbnQ+XG4gICAgPC9DYXJkPlxuICApO1xufVxuIiwiLy8gbGVkZ2VyQXBwVmVyc2lvbiA+PSByZXF1aXJlZEFwcFZlcnNpb25cbmV4cG9ydCBmdW5jdGlvbiBpc0xlZGdlclZlcnNpb25Db21wYXRpYmxlKFxuICBsZWRnZXJBcHBWZXJzaW9uOiBzdHJpbmcsXG4gIHJlcXVpcmVkQXBwVmVyc2lvbjogc3RyaW5nLFxuKSB7XG4gIGNvbnN0IGNvbXBhcmUgPSBsZWRnZXJBcHBWZXJzaW9uLmxvY2FsZUNvbXBhcmUoXG4gICAgcmVxdWlyZWRBcHBWZXJzaW9uLFxuICAgIHVuZGVmaW5lZCxcbiAgICB7XG4gICAgICBudW1lcmljOiB0cnVlLFxuICAgICAgc2Vuc2l0aXZpdHk6ICdiYXNlJyxcbiAgICB9LFxuICApO1xuXG4gIC8vIGxlZGdlckFwcFZlcnNpb24gPiByZXF1aXJlZEFwcFZlcnNpb25cbiAgaWYgKGNvbXBhcmUgPT09IDEpIHJldHVybiB0cnVlO1xuICAvLyBsZWRnZXJBcHBWZXJzaW9uID0gcmVxdWlyZWRBcHBWZXJzaW9uXG4gIGlmIChjb21wYXJlID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgLy8gbGVkZ2VyQXBwVmVyc2lvbiA8IHJlcXVpcmVkQXBwVmVyc2lvblxuICBpZiAoY29tcGFyZSA9PT0gLTEpIHJldHVybiBmYWxzZTtcbn1cbiIsIi8qIChpZ25vcmVkKSAqLyJdLCJuYW1lcyI6WyJTdGFjayIsInN0eWxlZCIsIlN1c3BlbnNlIiwiRmFsbGJhY2tJbWFnZSIsIlZpZGVvQmFja2dyb3VuZCIsIkFwcEJhY2tncm91bmQiLCJRVUVSWSIsIm1lZGlhUXVlcnlMaXN0Iiwid2luZG93IiwibWF0Y2hNZWRpYSIsInByZWZlcnNSZWR1Y2VkTW90aW9uIiwibWF0Y2hlcyIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4IiwibWluSGVpZ2h0IiwiaGVpZ2h0Iiwib3ZlcmZsb3ciLCJmYWxsYmFjayIsImF1dG9QbGF5IiwibG9vcCIsIm11dGVkIiwic3JjIiwidHlwZSIsIkNoZXZyb25Eb3duSWNvbiIsIk1lbnVJdGVtIiwiU2VsZWN0IiwidXNlVGhlbWUiLCJUcmlnZ2VySWNvbiIsInJlc3QiLCJ0aGVtZSIsIl9leHRlbmRzIiwic2l6ZSIsInRyYW5zaXRpb24iLCJyaWdodCIsInNwYWNpbmciLCJ0b3AiLCJ0cmFuc2Zvcm0iLCJ1c2VEcm9wZG93blByb3BzIiwiSW5wdXRQcm9wcyIsImlucHV0U3giLCJvdGhlcklucHV0UHJvcHMiLCJTZWxlY3RQcm9wcyIsIk1lbnVQcm9wcyIsIlBhcGVyUHJvcHMiLCJwYXBlclN4Iiwib3RoZXJQYXBlclByb3BzIiwib3RoZXJNZW51UHJvcHMiLCJvdGhlclNlbGVjdFByb3BzIiwicGFkZGluZyIsImJvcmRlciIsInBhbGV0dGUiLCJncmV5IiwiYmFja2dyb3VuZENvbG9yIiwiZm9udFNpemUiLCJ0eXBvZ3JhcGh5IiwiYm9keTEiLCJJY29uQ29tcG9uZW50IiwibWF4V2lkdGgiLCJtYXhIZWlnaHQiLCJtdCIsIkRyb3Bkb3duIiwiY2hpbGRyZW4iLCJwcm9wcyIsInZhcmlhbnQiLCJpbnB1dExhYmVsUHJvcHMiLCJib2R5MiIsIkRyb3Bkb3duSXRlbSIsImdhcCIsIkxlZGdlck5hbm8iLCJ3aWR0aCIsInZpZXdCb3giLCJmaWxsIiwieG1sbnMiLCJ4IiwieSIsInJ4Iiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJjbGlwUGF0aCIsImQiLCJjeCIsImN5IiwiciIsImlkIiwiVHlwb2dyYXBoeSIsIlN0eWxlZE51bWJlckxpc3QiLCJkaXNwbGF5IiwiYmFja2dyb3VuZCIsInBhcGVyIiwibGluZUhlaWdodCIsImJvcmRlclJhZGl1cyIsInRleHRBbGlnbiIsIm1hcmdpblJpZ2h0IiwiZmxleFNocmluayIsInVzZUNhbGxiYWNrIiwidXNlRWZmZWN0IiwidXNlUmVmIiwidXNlU3RhdGUiLCJ1c2VMZWRnZXJDb250ZXh0IiwidXNlQW5hbHl0aWNzQ29udGV4dCIsIkF2YWxhbmNoZSIsIkRlcml2YXRpb25QYXRoIiwiZ2V0QWRkcmVzc0Zyb21YUHViIiwiZ2V0RXZtQWRkcmVzc0Zyb21QdWJLZXkiLCJ1c2VHZXRBdmF4QmFsYW5jZSIsIlRyYW5zIiwidXNlVHJhbnNsYXRpb24iLCJCdXR0b24iLCJEaXZpZGVyIiwiRGVyaXZhdGlvblBhdGhEcm9wZG93biIsIkRlcml2ZWRBZGRyZXNzZXMiLCJTZWNyZXRUeXBlIiwidXNlSW1wb3J0TGVkZ2VyIiwiTGVkZ2VyU3RhdHVzIiwiV0FJVF8xNTAwX01JTExJX0ZPUl9VU0VSIiwiTGVkZ2VyQ29ubmVjdG9yIiwib25TdWNjZXNzIiwib25Ucm91Ymxlc2hvb3QiLCJjaGVja0lmV2FsbGV0RXhpc3RzIiwiY2FwdHVyZSIsImdldEV4dGVuZGVkUHVibGljS2V5IiwicG9wRGV2aWNlU2VsZWN0aW9uIiwiaGFzTGVkZ2VyVHJhbnNwb3J0Iiwid2FzVHJhbnNwb3J0QXR0ZW1wdGVkIiwiaW5pdExlZGdlclRyYW5zcG9ydCIsImdldFB1YmxpY0tleSIsImdldEF2YXhCYWxhbmNlIiwicHVibGljS2V5U3RhdGUiLCJzZXRQdWJsaWNLZXlTdGF0ZSIsIkxFREdFUl9VTklOSVRJQVRFRCIsImlzTGVkZ2VyRXhpc3RzRXJyb3IiLCJzZXRJc0xlZGdlckV4aXN0c0Vycm9yIiwicGF0aFNwZWMiLCJzZXRQYXRoU3BlYyIsIkJJUDQ0IiwiYWRkcmVzc2VzIiwic2V0QWRkcmVzc2VzIiwiaGFzUHVibGljS2V5cyIsInNldEhhc1B1YmxpY0tleXMiLCJkcm9wZG93bkRpc2FibGVkIiwic2V0RHJvcGRvd25EaXNhYmxlZCIsImxhc3RBY2NvdW50SW5kZXhXaXRoQmFsYW5jZSIsInQiLCJpbXBvcnRMZWRnZXIiLCJyZXNldFN0YXRlcyIsIkxFREdFUl9MT0FESU5HIiwiZ2V0QWRkcmVzc0Zyb21YcHViS2V5IiwieHB1YlZhbHVlIiwiYWNjb3VudEluZGV4IiwiYWRkcmVzc0xpc3QiLCJhZGRyZXNzIiwiYmFsYW5jZSIsIm5ld0FkZHJlc3NlcyIsImJhbGFuY2VEaXNwbGF5VmFsdWUiLCJjdXJyZW50IiwiTWF0aCIsIm1heCIsImZpbmRMYXN0SW5kZXgiLCJhZGRyIiwiTEVER0VSX0NPTk5FQ1RFRCIsImlzTGVkZ2VyV2FsbGV0RXhpc3QiLCJ4cHViIiwieHB1YlhQIiwicHVibGljS2V5cyIsImRlcml2YXRpb25QYXRoIiwicHViS2V5cyIsInNlY3JldFR5cGUiLCJMZWRnZXIiLCJMZWRnZXJMaXZlIiwiZHJ5UnVuIiwiZSIsIkVycm9yIiwiU3RyaW5nIiwiZ2V0WFB1YmxpY0tleSIsInhwdWJYUFZhbHVlIiwiTGVkZ2VyV2FsbGV0IiwiZ2V0QWNjb3VudFBhdGgiLCJ1bmRlZmluZWQiLCJMRURHRVJfQ09OTkVDVElPTl9GQUlMRUQiLCJnZXREZXJpdmF0aW9uUGF0aFZhbHVlIiwiZGVyaXZhdGlvblBhdGhTcGVjIiwiZ2V0UHViS2V5cyIsInB1YktleSIsInB1YktleVhQIiwiZXZtIiwidG9TdHJpbmciLCJ4cCIsInB1YmxpY0tleVZhbHVlIiwidHJ5UHVibGljS2V5Iiwib25QYXRoU2VsZWN0ZWQiLCJzZWxlY3RlZFBhdGhTcGVjIiwic2V0VGltZW91dCIsInJldHJpZXZlS2V5cyIsImFsaWduU2VsZiIsImlzRGlzYWJsZWQiLCJyb3dHYXAiLCJmbGV4SXRlbSIsImFsaWduSXRlbXMiLCJkaXJlY3Rpb24iLCJjb2xvciIsImVycm9yIiwibWFpbiIsImkxOG5LZXkiLCJjb21wb25lbnRzIiwibGlua1RleHQiLCJvbkNsaWNrIiwic3R5bGUiLCJjdXJzb3IiLCJ0ZXh0RGVjb3JhdGlvbiIsInRleHREZWNvcmF0aW9uQ29sb3IiLCJmdWxsV2lkdGgiLCJUeXBvZ3JhcGh5TGluayIsIkxlZGdlclRyb3VibGVTdGVwc0ZvbnRWYXJpYW50IiwiTGVkZ2VyVHJvdWJsZVN0ZXBzIiwiZm9udFZhcmlhbnQiLCJzbWFsbCIsImZsZXhEaXJlY3Rpb24iLCJhcyIsImZvbnRXZWlnaHQiLCJtYXJnaW4iLCJsZWRnZXJMaW5rIiwiaHJlZiIsInRhcmdldCIsInJlbCIsIkV4dGVuc2lvblJlcXVlc3QiLCJ1c2VDb25uZWN0aW9uQ29udGV4dCIsInJlcXVlc3QiLCJyZXN1bHQiLCJtZXRob2QiLCJCQUxBTkNFX05BVElWRV9HRVQiLCJwYXJhbXMiLCJpc0ltcG9ydGluZyIsInNldElzSW1wb3J0aW5nIiwiV0FMTEVUX0lNUE9SVF9MRURHRVIiLCJDYXJkIiwiWEljb24iLCJMZWRnZXJXcm9uZ1ZlcnNpb25Db250ZW50IiwiRnJhZ21lbnQiLCJwdCIsInBiIiwibWIiLCJMZWRnZXJXcm9uZ1ZlcnNpb24iLCJvbkNsb3NlIiwiY2xhc3NOYW1lIiwicCIsInVzZVdhbGxldENvbnRleHQiLCJSRVFVSVJFRF9MRURHRVJfVkVSU0lPTiIsImlzTGVkZ2VyVmVyc2lvbkNvbXBhdGlibGUiLCJCYWNrZHJvcCIsIkxlZGdlcldyb25nVmVyc2lvbk92ZXJsYXkiLCJpc0xlZGdlcldhbGxldCIsImxlZGdlclZlcnNpb25XYXJuaW5nQ2xvc2VkIiwidXBkYXRlTGVkZ2VyVmVyc2lvbldhcm5pbmdDbG9zZWQiLCJhdmF4QXBwVmVyc2lvbiIsImxlZGdlckNoZWNrIiwib3BlbiIsIm0iLCJDaGVja0ljb24iLCJkZWZhdWx0VmFsdWUiLCJpbnB1dFByb3BzIiwiTWVudUxpc3RQcm9wcyIsIm5hdGl2ZSIsImRpc3BsYXlFbXB0eSIsInJlbmRlclZhbHVlIiwib25DaGFuZ2UiLCJwYXRoIiwidmFsdWUiLCJsYWJlbCIsImRpc2FibGVkIiwic2VsZWN0ZWQiLCJqdXN0aWZ5Q29udGVudCIsInRydW5jYXRlQWRkcmVzcyIsImdldEF2YWxhbmNoZUFkZHJlc3NMaW5rIiwiQ2FyZENvbnRlbnQiLCJFeHRlcm5hbExpbmtJY29uIiwiU2tlbGV0b24iLCJUb29sdGlwIiwidXNlTWVtbyIsImhhc0JhbGFuY2UiLCJmaW5kIiwiZGl2aWRlciIsIm1hcCIsImFkZHJlc3NEYXRhIiwiaW5kZXgiLCJleHBsb3JlckxpbmsiLCJrZXkiLCJweSIsInByIiwicGxhY2VtZW50IiwidGl0bGUiLCJjb2x1bW5HYXAiLCJsZW5ndGgiLCJsZWRnZXJBcHBWZXJzaW9uIiwicmVxdWlyZWRBcHBWZXJzaW9uIiwiY29tcGFyZSIsImxvY2FsZUNvbXBhcmUiLCJudW1lcmljIiwic2Vuc2l0aXZpdHkiXSwic291cmNlUm9vdCI6IiJ9