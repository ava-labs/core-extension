"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_components_common_FunctionIsUnavailable_tsx-src_pages_Send_components_ContactInput_tsx-sr-45b814"],{

/***/ "./src/background/services/history/utils/isTxHistoryItem.ts":
/*!******************************************************************!*\
  !*** ./src/background/services/history/utils/isTxHistoryItem.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNonXPHistoryItem": () => (/* binding */ isNonXPHistoryItem),
/* harmony export */   "isPchainTxHistoryItem": () => (/* binding */ isPchainTxHistoryItem)
/* harmony export */ });
function isNonXPHistoryItem(tx) {
  return tx.vmType !== 'AVM' && tx.vmType !== 'PVM';
}
function isPchainTxHistoryItem(tx) {
  return tx.vmType === 'PVM';
}

/***/ }),

/***/ "./src/background/services/network/utils/isSolanaNetwork.ts":
/*!******************************************************************!*\
  !*** ./src/background/services/network/utils/isSolanaNetwork.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isSolanaChainId": () => (/* binding */ isSolanaChainId),
/* harmony export */   "isSolanaNetwork": () => (/* binding */ isSolanaNetwork)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isSolanaNetwork(network) {
  return network ? isSolanaChainId(network.chainId) : false;
}
function isSolanaChainId(chainId) {
  return _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SOLANA_DEVNET_ID === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SOLANA_MAINNET_ID === chainId || _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.ChainId.SOLANA_TESTNET_ID === chainId;
}

/***/ }),

/***/ "./src/components/common/FunctionIsUnavailable.tsx":
/*!*********************************************************!*\
  !*** ./src/components/common/FunctionIsUnavailable.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionIsUnavailable": () => (/* binding */ FunctionIsUnavailable)
/* harmony export */ });
/* harmony import */ var _PageTitle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PageTitle */ "./src/components/common/PageTitle.tsx");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/Trans.js");
/* harmony import */ var _FunctionIsOffline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FunctionIsOffline */ "./src/components/common/FunctionIsOffline.tsx");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");




function FunctionIsUnavailable({
  functionName,
  network,
  children
}) {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitle, {
    variant: _PageTitle__WEBPACK_IMPORTED_MODULE_0__.PageTitleVariant.PRIMARY
  }, functionName), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexGrow: 1,
      px: 4,
      alignContent: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body1",
    minHeight: 24,
    align: "center"
  }, /*#__PURE__*/React.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_4__.Trans, {
    i18nKey: "Sorry, {{functionName}} is unavailable on <br/>{{network}} network.",
    values: {
      functionName: (0,_FunctionIsOffline__WEBPACK_IMPORTED_MODULE_1__.getTranslatedFunctionName)(functionName) ?? t('This Feature'),
      network
    }
  })), children));
}

/***/ }),

/***/ "./src/hooks/useQueryParams.ts":
/*!*************************************!*\
  !*** ./src/hooks/useQueryParams.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useQueryParams": () => (/* binding */ useQueryParams)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/esm/react-router.js");


const useQueryParams = () => {
  const {
    search
  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useLocation)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => new URLSearchParams(search), [search]);
};

/***/ }),

/***/ "./src/pages/Send/components/AddressDropdownList.tsx":
/*!***********************************************************!*\
  !*** ./src/pages/Send/components/AddressDropdownList.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddressDropdownList": () => (/* binding */ AddressDropdownList)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _AddressDropdownListItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AddressDropdownListItem */ "./src/pages/Send/components/AddressDropdownListItem.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_components_settings_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/settings/models */ "./src/components/settings/models.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/isBitcoin */ "./src/utils/isBitcoin.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/services/network/utils/isSolanaNetwork */ "./src/background/services/network/utils/isSolanaNetwork.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");










const AddressDropdownList = ({
  contacts,
  selectedContact,
  onChange,
  addContact
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_8__.useTranslation)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  const useBtcAddress = (0,_src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_4__.isBitcoin)(network);
  const useXPAddress = (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_5__.isPchainNetwork)(network) || (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_6__.isXchainNetwork)(network);
  const useSVMAddress = Boolean(network && (0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_7__.isSolanaNetwork)(network));
  const selectedAddress = selectedContact?.[useSVMAddress ? 'addressSVM' : useBtcAddress ? 'addressBTC' : useXPAddress ? 'addressXP' : 'address']?.toLowerCase();
  const {
    setIsSettingsOpen,
    setSettingsActivePage
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__.useSettingsContext)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Stack, {
    sx: {
      flexGrow: 1
    }
  }, addContact && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Box, {
    sx: {
      py: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
    variant: "text",
    onClick: () => {
      setSettingsActivePage(_src_components_settings_models__WEBPACK_IMPORTED_MODULE_2__.SettingsPages.ADD_CONTACT);
      setIsSettingsOpen(true);
    },
    "data-testid": "send-add-new-contact"
  }, t('+ Add New Contact'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_9__.Scrollbars, {
    style: {
      flexGrow: 1,
      height: '100%',
      width: '100%'
    }
  }, contacts.map((contact, i) => /*#__PURE__*/React.createElement(_AddressDropdownListItem__WEBPACK_IMPORTED_MODULE_0__.AddressDropdownListItem, {
    key: `${contact.address}${i}`,
    contact: contact,
    isSelected: contact?.[useSVMAddress ? 'addressSVM' : useBtcAddress ? 'addressBTC' : useXPAddress ? 'addressXP' : 'address']?.toLowerCase() === selectedAddress,
    onChange: onChange
  }))));
};

/***/ }),

/***/ "./src/pages/Send/components/AddressDropdownListItem.tsx":
/*!***************************************************************!*\
  !*** ./src/pages/Send/components/AddressDropdownListItem.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddressDropdownListItem": () => (/* binding */ AddressDropdownListItem)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _ContactAddress__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContactAddress */ "./src/pages/Send/components/ContactAddress.tsx");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* harmony import */ var _src_images_logos_solana_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/images/logos/solana.png */ "./src/images/logos/solana.png");







const AddressDropdownListItem = ({
  contact,
  isSelected,
  onChange
}) => {
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  const initials = contact.name.split(' ').slice(0, 2).map(part => part[0] ?? '') || '?';
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    variant: "text",
    "data-testid": "send-address-list-item",
    fullWidth: true,
    sx: {
      justifyContent: 'space-between',
      py: 2,
      gap: 2,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      maxHeight: 'none'
    },
    color: isSelected ? 'secondary' : 'primary',
    onClick: e => {
      e.stopPropagation();
      if (contact.addressXP && (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_2__.isPchainNetwork)(network)) {
        const contactWithPrefix = {
          ...contact,
          addressXP: `P-${contact.addressXP}`
        };
        onChange(contactWithPrefix);
      } else if (contact.addressXP && (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_4__.isXchainNetwork)(network)) {
        const contactWithPrefix = {
          ...contact,
          addressXP: `X-${contact.addressXP}`
        };
        onChange(contactWithPrefix);
      } else {
        onChange(contact);
      }
    },
    disableRipple: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2.5,
      flexGrow: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Avatar, {
    sx: {
      width: 32,
      height: 32
    },
    alt: contact.name,
    useColor: true
  }, initials), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {
    title: contact.name,
    wrapWithSpan: false,
    disableInteractive: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Typography, {
    noWrap: true,
    variant: "body1",
    component: "span",
    sx: {
      fontWeight: 'semibold'
    },
    color: "inherit"
  }, contact.name))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.Stack, {
    sx: {
      gap: 0.5
    }
  }, contact.address && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ContactAddress__WEBPACK_IMPORTED_MODULE_1__.ContactAddress, {
    address: contact.address,
    networkIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.AvalancheColorIcon, {
      size: 16
    })
  }), contact.addressBTC && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ContactAddress__WEBPACK_IMPORTED_MODULE_1__.ContactAddress, {
    address: contact.addressBTC,
    networkIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.BitcoinColorIcon, {
      size: 16
    })
  }), contact.addressXP && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ContactAddress__WEBPACK_IMPORTED_MODULE_1__.ContactAddress, {
    address: (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_2__.isPchainNetwork)(network) ? `P-${contact.addressXP}` : `X-${contact.addressXP}`,
    networkIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_6__.XAndPChainsIcon, {
      size: 16
    })
  }), contact.addressSVM && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ContactAddress__WEBPACK_IMPORTED_MODULE_1__.ContactAddress, {
    address: contact.addressSVM,
    networkIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
      src: _src_images_logos_solana_png__WEBPACK_IMPORTED_MODULE_5__["default"],
      alt: "Solana",
      height: 24
    })
  })));
};

/***/ }),

/***/ "./src/pages/Send/components/AddressDropdownListMyAccounts.tsx":
/*!*********************************************************************!*\
  !*** ./src/pages/Send/components/AddressDropdownListMyAccounts.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddressDropdownListMyAccounts": () => (/* binding */ AddressDropdownListMyAccounts)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _AddressDropdownListItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AddressDropdownListItem */ "./src/pages/Send/components/AddressDropdownListItem.tsx");
/* harmony import */ var _src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/SettingsProvider */ "./src/contexts/SettingsProvider.tsx");
/* harmony import */ var _src_components_settings_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/components/settings/models */ "./src/components/settings/models.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/isBitcoin */ "./src/utils/isBitcoin.ts");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/background/services/network/utils/isSolanaNetwork */ "./src/background/services/network/utils/isSolanaNetwork.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");












const AddressDropdownListMyAccounts = ({
  contacts,
  selectedContact,
  onChange,
  addContact
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_10__.useTranslation)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_3__.useNetworkContext)();
  const useBtcAddress = (0,_src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_4__.isBitcoin)(network);
  const useSvmAddress = network && (0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_9__.isSolanaNetwork)(network);
  const {
    wallets
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_5__.useWalletContext)();
  const useXpAddress = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(() => {
    return (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_6__.isPchainNetwork)(network) || (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isXchainNetwork)(network);
  }, [network]);
  const addressType = useSvmAddress ? 'addressSVM' : useBtcAddress ? 'addressBTC' : useXpAddress ? 'addressXP' : 'address';
  const selectedAddress = selectedContact?.[addressType]?.toLowerCase();
  const {
    setIsSettingsOpen,
    setSettingsActivePage
  } = (0,_src_contexts_SettingsProvider__WEBPACK_IMPORTED_MODULE_1__.useSettingsContext)();
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
    sx: {
      flexGrow: 1
    }
  }, addContact && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Box, {
    sx: {
      py: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
    variant: "text",
    onClick: () => {
      setSettingsActivePage(_src_components_settings_models__WEBPACK_IMPORTED_MODULE_2__.SettingsPages.ADD_CONTACT);
      setIsSettingsOpen(true);
    },
    "data-testid": "send-add-new-contact"
  }, t('+ Add New Contact'))), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Scrollbars, {
    style: {
      flexGrow: 1,
      height: '100%',
      width: '100%'
    }
  }, wallets.map(({
    id,
    name: walletName
  }) => {
    const walletAccounts = contacts[id];
    if (walletAccounts && walletAccounts.length) {
      return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Stack, {
        key: id
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
        variant: "button"
      }, walletName), walletAccounts.map((contact, i) => /*#__PURE__*/React.createElement(_AddressDropdownListItem__WEBPACK_IMPORTED_MODULE_0__.AddressDropdownListItem, {
        key: `${contact.address}${i}`,
        contact: contact,
        isSelected: contact?.[addressType]?.toLowerCase() === selectedAddress,
        onChange: onChange
      })));
    }
  }), contacts.imported && Object.values(contacts.imported).length > 0 && /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_11__.Typography, {
    variant: "button"
  }, t('Imported')), contacts.imported && Object.values(contacts.imported).map(acc => /*#__PURE__*/React.createElement(_AddressDropdownListItem__WEBPACK_IMPORTED_MODULE_0__.AddressDropdownListItem, {
    key: `${acc.id}`,
    contact: acc,
    isSelected: acc?.[addressType]?.toLowerCase() === selectedAddress,
    onChange: onChange
  }))));
};

/***/ }),

/***/ "./src/pages/Send/components/ContactAddress.tsx":
/*!******************************************************!*\
  !*** ./src/pages/Send/components/ContactAddress.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContactAddress": () => (/* binding */ ContactAddress)
/* harmony export */ });
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/react-hot-toast/dist/index.mjs");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



const ContactAddress = ({
  networkIcon,
  address
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  const copyAddress = ev => {
    ev.stopPropagation();
    navigator.clipboard.writeText(address);
    (0,_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_2__["default"])(t('Copied!'), {
      duration: 2000
    });
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Stack, {
    sx: {
      flexDirection: 'row',
      gap: 0.25,
      alignItems: 'center'
    }
  }, networkIcon, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.CopyIcon, {
    role: "button",
    onClick: copyAddress,
    size: 16,
    sx: {
      p: 0.5,
      ':hover': {
        color: 'secondary.main'
      }
    },
    color: "primary"
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Tooltip, {
    title: address,
    wrapWithSpan: false,
    disableInteractive: true,
    PopperProps: {
      disablePortal: true
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_3__.Typography, {
    variant: "body2",
    color: "inherit",
    sx: {
      width: '92px'
    }
  }, (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_0__.truncateAddress)(address))));
};

/***/ }),

/***/ "./src/pages/Send/components/ContactInput.tsx":
/*!****************************************************!*\
  !*** ./src/pages/Send/components/ContactInput.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContactInput": () => (/* binding */ ContactInput)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _solana_kit__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @solana/kit */ "./node_modules/@solana/addresses/dist/index.browser.mjs");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @avalabs/core-bridge-sdk */ "./node_modules/@avalabs/core-bridge-sdk/esm/lib/btc/address.js");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/address/checks.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _ContactSelect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContactSelect */ "./src/pages/Send/components/ContactSelect.tsx");
/* harmony import */ var _src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/truncateAddress */ "./src/utils/truncateAddress.ts");
/* harmony import */ var _hooks_useIdentifyAddress__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useIdentifyAddress */ "./src/pages/Send/hooks/useIdentifyAddress.ts");
/* harmony import */ var _src_components_common_ContainedDropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/components/common/ContainedDropdown */ "./src/components/common/ContainedDropdown.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _src_contexts_ContactsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/ContactsProvider */ "./src/contexts/ContactsProvider.tsx");
/* harmony import */ var _src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/utils/isBitcoin */ "./src/utils/isBitcoin.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* harmony import */ var _src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/utils/isAddressValid */ "./src/utils/isAddressValid.ts");
/* harmony import */ var _src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @src/background/services/network/utils/isSolanaNetwork */ "./src/background/services/network/utils/isSolanaNetwork.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");


















const truncateName = name => {
  if (name.length < 28) return name;
  return `${name.substring(0, 28)}...`;
};
const ContactInput = ({
  contact,
  onChange,
  isContactsOpen,
  setIsOpen,
  containerRef
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_12__.useTranslation)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_5__.useNetworkContext)();
  const inputWrapperRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const inputRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const identifyAddress = (0,_hooks_useIdentifyAddress__WEBPACK_IMPORTED_MODULE_3__.useIdentifyAddress)();
  const {
    contacts
  } = (0,_src_contexts_ContactsProvider__WEBPACK_IMPORTED_MODULE_6__.useContactsContext)();
  const [contactsLength, setContactsLength] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(contacts.length);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (contacts.length > contactsLength) {
      const recentlyAddedContact = contacts[contacts.length - 1];
      if ((0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network) && recentlyAddedContact) {
        recentlyAddedContact.addressXP = recentlyAddedContact.addressXP ? `P-${recentlyAddedContact.addressXP}` : '';
      } else if ((0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_9__.isXchainNetwork)(network) && recentlyAddedContact) {
        recentlyAddedContact.addressXP = recentlyAddedContact.addressXP ? `X-${recentlyAddedContact.addressXP}` : '';
      }
      onChange(recentlyAddedContact);
    }
    setContactsLength(contacts.length);
  }, [contacts, contactsLength, network, onChange]);
  function changeAndCloseDropdown(selectedContact, selectedTab) {
    onChange(selectedContact, selectedTab);
    setIsOpen(!isContactsOpen);
  }
  const [inputFocused, setInputFocused] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [inputHovered, setInputHovered] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  /**
   * For BTC transactions, 'address' is empty.
   * For non-BTC transactions, 'addressBTC' is empty.
   * @see useIdentifyAddress() hook.
   */
  const contactAddress = network && (0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_11__.isSolanaNetwork)(network) ? contact?.addressSVM : (0,_src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_7__.isBitcoin)(network) ? contact?.addressBTC : (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network) || (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_9__.isXchainNetwork)(network) ? contact?.addressXP : contact?.address;
  const [cursor, setCursor] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursor, cursor);
    }
  }, [inputRef, cursor, contactAddress]);
  const isValidAddress = () => {
    if (network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_13__.NetworkVMType.EVM) {
      return contact ? (0,ethers__WEBPACK_IMPORTED_MODULE_14__.isAddress)(contact.address) : false;
    }
    if (network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_13__.NetworkVMType.BITCOIN) {
      return contact && contact.addressBTC ? (0,_avalabs_core_bridge_sdk__WEBPACK_IMPORTED_MODULE_15__.isBech32Address)(contact.addressBTC) : false;
    }
    if ((0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network)) {
      return contact && contact.addressXP ? (0,_src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_10__.isValidPvmAddress)(contact.addressXP) : false;
    }
    if ((0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_9__.isXchainNetwork)(network)) {
      return contact && contact.addressXP ? (0,_src_utils_isAddressValid__WEBPACK_IMPORTED_MODULE_10__.isValidAvmAddress)(contact.addressXP) : false;
    }
    if ((0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_11__.isSolanaNetwork)(network)) {
      return Boolean(contact && contact.addressSVM && (0,_solana_kit__WEBPACK_IMPORTED_MODULE_16__.isAddress)(contact.addressSVM));
    }
    return false;
  };
  const getInputDisplayValue = () => {
    if (!contactAddress) {
      return '';
    }
    // Show the full address string when the text field is focused
    if (inputFocused) {
      return contactAddress || '';
    }

    // When address is known, show the contact's name and truncated address
    if (contact?.isKnown) {
      const address = isValidAddress() ? (0,_src_utils_truncateAddress__WEBPACK_IMPORTED_MODULE_2__.truncateAddress)(contactAddress) : contactAddress;
      return `${truncateName(contact.name)}\n${address}`;
    }

    // For unknown addresses, always show the full address
    return contactAddress;
  };
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    sx: {
      position: 'relative',
      width: '100%',
      px: 2
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Stack, {
    ref: inputWrapperRef,
    sx: {
      gap: 1
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.Tooltip
  // Tooltip does not render at all when title is empty. Falling back to a single space prevents the input from re-rendering and losing focus when users starts typing.
  , {
    title: contactAddress ?? ' ',
    open: Boolean(!inputFocused && inputHovered && contact?.isKnown),
    sx: {
      flexDirection: 'column',
      gap: 1
    },
    placement: "top-end",
    PopperProps: {
      anchorEl: inputRef.current
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.TextField, {
    "data-testid": "send-address-input",
    color: "primary",
    fullWidth: true,
    label: t('Sending To'),
    inputLabelProps: {
      sx: {
        transform: 'none',
        fontSize: 'body2.fontSize',
        mb: 1
      }
    },
    inputRef: inputRef,
    InputProps: {
      sx: {
        py: 1,
        pl: 2,
        pr: 1
      },
      endAdornment: /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.InputAdornment, {
        position: "end",
        sx: {
          mt: 2,
          alignItems: 'end'
        }
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.IconButton, {
        onClick: () => setIsOpen(!isContactsOpen),
        onMouseEnter: () => setInputHovered(false),
        "data-testid": "contacts-button"
      }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_17__.UserSearchIcon, null)))
    },
    onFocus: () => {
      setInputFocused(true);
      setIsOpen(false);
    },
    onBlur: () => setInputFocused(false),
    onMouseEnter: () => setInputHovered(true),
    onMouseLeave: () => setInputHovered(false),
    placeholder: t('Input an Address'),
    multiline: true,
    minRows: 2,
    onChange: e => {
      onChange(identifyAddress(e.target.value.trim()));
      setCursor(e.target.selectionStart);
    },
    value: getInputDisplayValue()
  })), /*#__PURE__*/React.createElement(_src_components_common_ContainedDropdown__WEBPACK_IMPORTED_MODULE_4__.ContainedDropdown, {
    anchorEl: inputWrapperRef,
    isOpen: isContactsOpen,
    setIsOpen: setIsOpen,
    containerRef: containerRef
  }, /*#__PURE__*/React.createElement(_ContactSelect__WEBPACK_IMPORTED_MODULE_1__.ContactSelect, {
    onChange: changeAndCloseDropdown,
    selectedContact: contact
  }))));
};

/***/ }),

/***/ "./src/pages/Send/components/ContactSelect.tsx":
/*!*****************************************************!*\
  !*** ./src/pages/Send/components/ContactSelect.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContactSelect": () => (/* binding */ ContactSelect)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/useTranslation.js");
/* harmony import */ var _avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @avalabs/core-k2-components */ "./node_modules/@avalabs/core-k2-components/dist/index.js");
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_ContactsProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/ContactsProvider */ "./src/contexts/ContactsProvider.tsx");
/* harmony import */ var _src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/contexts/WalletProvider */ "./src/contexts/WalletProvider.tsx");
/* harmony import */ var _AddressDropdownList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AddressDropdownList */ "./src/pages/Send/components/AddressDropdownList.tsx");
/* harmony import */ var _hooks_useIdentifyAddress__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hooks/useIdentifyAddress */ "./src/pages/Send/hooks/useIdentifyAddress.ts");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var _AddressDropdownListMyAccounts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./AddressDropdownListMyAccounts */ "./src/pages/Send/components/AddressDropdownListMyAccounts.tsx");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _src_background_services_history_utils_isTxHistoryItem__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @src/background/services/history/utils/isTxHistoryItem */ "./src/background/services/history/utils/isTxHistoryItem.ts");
/* harmony import */ var _src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @src/utils/stripAddressPrefix */ "./src/utils/stripAddressPrefix.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @src/background/services/network/utils/isBitcoinNetwork */ "./src/background/services/network/utils/isBitcoinNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* harmony import */ var _src_utils_bridgeTransactionUtils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @src/utils/bridgeTransactionUtils */ "./src/utils/bridgeTransactionUtils.ts");
/* harmony import */ var _src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @src/background/services/network/utils/isSolanaNetwork */ "./src/background/services/network/utils/isSolanaNetwork.ts");
/* provided dependency */ var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");



















var TabId = /*#__PURE__*/function (TabId) {
  TabId[TabId["ADDRESS_BOOK"] = 0] = "ADDRESS_BOOK";
  TabId[TabId["RECENT_ADDRESSES"] = 1] = "RECENT_ADDRESSES";
  TabId[TabId["MY_ACCOUNTS"] = 2] = "MY_ACCOUNTS";
  return TabId;
}(TabId || {});
const NoContactsMessage = ({
  header,
  description
}) => /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
  sx: {
    pt: 12,
    gap: 1,
    textAlign: 'center',
    width: '100%'
  }
}, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
  variant: "h4",
  color: "text.primary"
}, header), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Typography, {
  variant: "body2",
  color: "text.secondary"
}, description));
const ContactSelect = ({
  onChange,
  selectedContact
}) => {
  const {
    t
  } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_17__.useTranslation)();
  const identifyAddress = (0,_hooks_useIdentifyAddress__WEBPACK_IMPORTED_MODULE_5__.useIdentifyAddress)();
  const {
    getTransactionHistory
  } = (0,_src_contexts_WalletProvider__WEBPACK_IMPORTED_MODULE_3__.useWalletContext)();
  const {
    accounts: {
      imported: importedAccounts,
      primary: primaryAccounts,
      active: activeAccount
    }
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_1__.useAccountsContext)();
  const {
    contacts
  } = (0,_src_contexts_ContactsProvider__WEBPACK_IMPORTED_MODULE_2__.useContactsContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_6__.useNetworkContext)();
  const [selectedTab, setSelectedTab] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(TabId.ADDRESS_BOOK);
  const [historyContacts, setHistoryContacts] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!network) {
      return;
    }
    getTransactionHistory().then(history => {
      const filteredHistory = history.filter((tx, index, self) => {
        if (!tx.isSender || (0,_src_background_services_history_utils_isTxHistoryItem__WEBPACK_IMPORTED_MODULE_9__.isNonXPHistoryItem)(tx) && tx.isContractCall) {
          return false;
        }
        // filter out dupe to addresses
        return index === self.findIndex(temp => temp.to === tx.to) && tx.to !== _src_utils_bridgeTransactionUtils__WEBPACK_IMPORTED_MODULE_14__.ETHEREUM_ADDRESS;
      });
      const contactHistory = filteredHistory.reduce((acc, tx) => {
        const addressIdentities = [identifyAddress(tx.to)];
        addressIdentities.forEach(identity => {
          const addressToCheck = (0,_src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_12__.isBitcoinNetwork)(network) ? identity.addressBTC : (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network) || (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isXchainNetwork)(network) ? identity.addressXP : identity.address;
          const userAddress = (0,_src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_12__.isBitcoinNetwork)(network) ? activeAccount?.addressBTC : (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network) ? (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_10__.stripAddressPrefix)(activeAccount?.addressPVM ?? '') : (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isXchainNetwork)(network) ? (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_10__.stripAddressPrefix)(activeAccount?.addressAVM ?? '') : activeAccount?.addressC;
          const addressesInList = acc.map(value => (0,_src_background_services_network_utils_isBitcoinNetwork__WEBPACK_IMPORTED_MODULE_12__.isBitcoinNetwork)(network) ? value.addressBTC : (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network) || (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isXchainNetwork)(network) ? value.addressXP : value.address);
          if ((0,lodash__WEBPACK_IMPORTED_MODULE_11__.indexOf)(addressesInList, addressToCheck) === -1 && userAddress !== addressToCheck) {
            acc.push(identity);
          }
        });
        return acc;
      }, []);
      setHistoryContacts(contactHistory);
    });
  }, [activeAccount?.addressAVM, activeAccount?.addressBTC, activeAccount?.addressC, activeAccount?.addressPVM, getTransactionHistory, identifyAddress, network]);
  const formattedAccounts = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const formattedPrimary = {};
    Object.keys(primaryAccounts).forEach(walletId => {
      const walletAccount = primaryAccounts[walletId];
      if (!walletAccount || !walletAccount.length) {
        return;
      }
      const result = walletAccount.map(({
        id,
        addressC,
        name,
        addressBTC,
        addressPVM,
        addressAVM,
        addressSVM
      }) => ({
        id,
        address: network?.vmName == _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.EVM ? addressC : '',
        addressBTC: network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.BITCOIN ? addressBTC : '',
        addressXP: (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network) && addressPVM ? (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_10__.stripAddressPrefix)(addressPVM) : (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isXchainNetwork)(network) && addressAVM ? (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_10__.stripAddressPrefix)(addressAVM) : '',
        addressSVM: network && (0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_15__.isSolanaNetwork)(network) ? addressSVM : '',
        name,
        isKnown: true
      }));
      formattedPrimary[walletId] = result;
    });
    const importedAccountToPrep = Object.values(importedAccounts);
    if (!importedAccountToPrep.length) {
      return formattedPrimary;
    }
    const formattedImported = importedAccountToPrep?.map(({
      id,
      addressC,
      name,
      addressBTC,
      addressPVM,
      addressAVM,
      addressSVM
    }) => ({
      id,
      address: network?.vmName == _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.EVM ? addressC : '',
      addressBTC: network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.BITCOIN && addressBTC ? addressBTC : '',
      addressXP: (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network) && addressPVM ? (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_10__.stripAddressPrefix)(addressPVM) : (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isXchainNetwork)(network) && addressAVM ? (0,_src_utils_stripAddressPrefix__WEBPACK_IMPORTED_MODULE_10__.stripAddressPrefix)(addressAVM) : '',
      addressSVM: network && (0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_15__.isSolanaNetwork)(network) ? addressSVM : '',
      name,
      isKnown: true
    }));
    return {
      ...formattedPrimary,
      ...(formattedImported.length ? {
        imported: formattedImported
      } : {})
    };
  }, [importedAccounts, network, primaryAccounts]);
  const formattedContacts = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return contacts.filter(contact => {
      if (network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.EVM) {
        return contact.address;
      }
      if (network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.BITCOIN) {
        return contact.addressBTC;
      }
      if ((0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network) || (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isXchainNetwork)(network)) {
        return contact.addressXP;
      }
      if ((0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_15__.isSolanaNetwork)(network)) {
        return contact.addressSVM;
      }
    }).map(contact => ({
      ...contact,
      address: network?.vmName == _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.EVM ? contact.address : '',
      addressBTC: network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_18__.NetworkVMType.BITCOIN ? contact.addressBTC : '',
      addressPVM: (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_8__.isPchainNetwork)(network) ? contact.addressXP : '',
      addressAVM: (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_13__.isXchainNetwork)(network) ? contact.addressXP : '',
      addressSVM: network && (0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_15__.isSolanaNetwork)(network) ? contact.addressSVM : '',
      isKnown: true
    }));
  }, [contacts, network]);
  return /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Stack, {
    sx: {
      width: '100%',
      px: 2,
      pt: 3,
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Tabs, {
    variant: "fullWidth",
    indicatorColor: "secondary",
    value: selectedTab,
    onChange: (_, tab) => setSelectedTab(tab),
    sx: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Tab, {
    value: TabId.ADDRESS_BOOK,
    "data-testid": "send-address-book-tab",
    tabIndex: 0,
    label: t('Address Book')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Tab, {
    value: TabId.RECENT_ADDRESSES,
    "data-testid": "send-recent-contact-tab",
    tabIndex: 1,
    label: t('Recents')
  }), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Tab, {
    value: TabId.MY_ACCOUNTS,
    "data-testid": "send-my-accounts-tab",
    tabIndex: 2,
    label: t('My Accounts')
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.Box, {
    sx: {
      width: '100%',
      borderTop: 1,
      borderColor: 'divider',
      mt: -0.25,
      // Move the container up, just below the tab indicator.
      pt: 0.75,
      // Then add some padding at the top to equalize the missed space.
      flexGrow: 1,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.TabPanel, {
    value: selectedTab,
    index: TabId.ADDRESS_BOOK,
    sx: {
      display: 'flex',
      height: selectedTab === TabId.ADDRESS_BOOK ? '100%' : 0
    }
  }, /*#__PURE__*/React.createElement(_AddressDropdownList__WEBPACK_IMPORTED_MODULE_4__.AddressDropdownList, {
    contacts: formattedContacts,
    onChange: contact => onChange(contact, 'addressBook'),
    selectedContact: selectedContact,
    addContact: true
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.TabPanel, {
    value: selectedTab,
    index: TabId.RECENT_ADDRESSES,
    sx: {
      display: 'flex',
      height: selectedTab === TabId.RECENT_ADDRESSES ? '100%' : 0
    }
  }, historyContacts.length > 0 ? /*#__PURE__*/React.createElement(_AddressDropdownList__WEBPACK_IMPORTED_MODULE_4__.AddressDropdownList, {
    contacts: historyContacts,
    selectedContact: selectedContact,
    onChange: contact => onChange(contact, 'recents')
  }) : /*#__PURE__*/React.createElement(NoContactsMessage, {
    header: t('No Recent Recipients'),
    description: t('Enter the address in the above field')
  })), /*#__PURE__*/React.createElement(_avalabs_core_k2_components__WEBPACK_IMPORTED_MODULE_16__.TabPanel, {
    value: selectedTab,
    index: TabId.MY_ACCOUNTS,
    sx: {
      display: 'flex',
      height: selectedTab === TabId.MY_ACCOUNTS ? '100%' : 0
    }
  }, /*#__PURE__*/React.createElement(_AddressDropdownListMyAccounts__WEBPACK_IMPORTED_MODULE_7__.AddressDropdownListMyAccounts, {
    contacts: formattedAccounts,
    onChange: contact => onChange(contact, 'accounts'),
    selectedContact: selectedContact
  }))));
};

/***/ }),

/***/ "./src/pages/Send/hooks/useIdentifyAddress.ts":
/*!****************************************************!*\
  !*** ./src/pages/Send/hooks/useIdentifyAddress.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useIdentifyAddress": () => (/* binding */ useIdentifyAddress)
/* harmony export */ });
/* harmony import */ var _src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/contexts/AccountsProvider */ "./src/contexts/AccountsProvider.tsx");
/* harmony import */ var _src_contexts_ContactsProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/contexts/ContactsProvider */ "./src/contexts/ContactsProvider.tsx");
/* harmony import */ var _src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/NetworkProvider */ "./src/contexts/NetworkProvider.tsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/isBitcoin */ "./src/utils/isBitcoin.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalanchePchainNetwork */ "./src/background/services/network/utils/isAvalanchePchainNetwork.ts");
/* harmony import */ var _src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/background/services/network/utils/isAvalancheXchainNetwork */ "./src/background/services/network/utils/isAvalancheXchainNetwork.ts");
/* harmony import */ var _utils_correctAddressByPrefix__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/correctAddressByPrefix */ "./src/pages/Send/utils/correctAddressByPrefix.ts");
/* harmony import */ var _src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/background/services/network/utils/isSolanaNetwork */ "./src/background/services/network/utils/isSolanaNetwork.ts");









const UNSAVED_CONTACT_BASE = {
  id: '',
  name: 'Unsaved Address',
  isKnown: false
};
const useIdentifyAddress = () => {
  const {
    contacts
  } = (0,_src_contexts_ContactsProvider__WEBPACK_IMPORTED_MODULE_1__.useContactsContext)();
  const {
    allAccounts
  } = (0,_src_contexts_AccountsProvider__WEBPACK_IMPORTED_MODULE_0__.useAccountsContext)();
  const {
    network
  } = (0,_src_contexts_NetworkProvider__WEBPACK_IMPORTED_MODULE_2__.useNetworkContext)();

  /**
   * Identifies if an address exists in the accounts or contacts
   */
  const identifyAddress = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(address => {
    if (!address) return {
      ...UNSAVED_CONTACT_BASE,
      address: '',
      addressBTC: '',
      addressXP: '',
      addressSVM: ''
    };
    const addressLowerCase = address.toLowerCase();
    for (const contact of contacts) {
      if (contact.address.toLowerCase() === addressLowerCase || contact.addressBTC?.toLowerCase() === addressLowerCase || `p-${contact.addressXP?.toLowerCase()}` === (0,_utils_correctAddressByPrefix__WEBPACK_IMPORTED_MODULE_7__.correctAddressByPrefix)(addressLowerCase, 'p-') || `x-${contact.addressXP?.toLowerCase()}` === (0,_utils_correctAddressByPrefix__WEBPACK_IMPORTED_MODULE_7__.correctAddressByPrefix)(addressLowerCase, 'x-')) {
        const addressToUse = (0,_src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_4__.isBitcoin)(network) ? {
          addressBTC: address,
          address: '',
          addressPVM: ''
        } : (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_5__.isPchainNetwork)(network) || (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_6__.isXchainNetwork)(network) ? {
          addressXP: address,
          address: '',
          addressBTC: ''
        } : {
          address: address
        };
        return {
          id: contact.id,
          ...addressToUse,
          name: contact.name,
          isKnown: true
        };
      }
    }
    for (const account of allAccounts) {
      if (account.addressC.toLowerCase() === addressLowerCase || account.addressBTC?.toLocaleLowerCase() === addressLowerCase || account.addressPVM?.toLocaleLowerCase() === (0,_utils_correctAddressByPrefix__WEBPACK_IMPORTED_MODULE_7__.correctAddressByPrefix)(addressLowerCase, 'p-') || account.addressAVM?.toLowerCase() === (0,_utils_correctAddressByPrefix__WEBPACK_IMPORTED_MODULE_7__.correctAddressByPrefix)(addressLowerCase, 'x-') || account.addressSVM?.toLowerCase() === addressLowerCase) {
        const addressToUse = network && (0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_8__.isSolanaNetwork)(network) ? {
          addressSVM: account.addressSVM,
          address: ''
        } : (0,_src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_4__.isBitcoin)(network) ? {
          addressBTC: account.addressBTC,
          address: ''
        } : (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_5__.isPchainNetwork)(network) ? {
          addressXP: address,
          address: '',
          addressBTC: ''
        } : (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_6__.isXchainNetwork)(network) ? {
          addressXP: address,
          address: '',
          addressBTC: ''
        } : {
          address: account.addressC
        };
        return {
          id: '',
          ...addressToUse,
          name: account.name,
          isKnown: true
        };
      }
    }
    return (0,_src_background_services_network_utils_isSolanaNetwork__WEBPACK_IMPORTED_MODULE_8__.isSolanaNetwork)(network) ? {
      ...UNSAVED_CONTACT_BASE,
      address: '',
      addressXP: '',
      addressBTC: '',
      addressSVM: address
    } : (0,_src_utils_isBitcoin__WEBPACK_IMPORTED_MODULE_4__.isBitcoin)(network) ? {
      ...UNSAVED_CONTACT_BASE,
      address: '',
      addressBTC: address,
      addressXP: ''
    } : (0,_src_background_services_network_utils_isAvalanchePchainNetwork__WEBPACK_IMPORTED_MODULE_5__.isPchainNetwork)(network) || (0,_src_background_services_network_utils_isAvalancheXchainNetwork__WEBPACK_IMPORTED_MODULE_6__.isXchainNetwork)(network) ? {
      ...UNSAVED_CONTACT_BASE,
      address: '',
      addressBTC: '',
      addressXP: address
    } : {
      ...UNSAVED_CONTACT_BASE,
      address,
      addressBTC: '',
      addressXP: ''
    };
  }, [allAccounts, contacts, network]);
  return identifyAddress;
};

/***/ }),

/***/ "./src/pages/Send/hooks/useSend/useEVMSend.ts":
/*!****************************************************!*\
  !*** ./src/pages/Send/hooks/useSend/useEVMSend.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useEVMSend": () => (/* binding */ useEVMSend)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");
/* harmony import */ var _src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/contexts/ConnectionProvider */ "./src/contexts/ConnectionProvider.tsx");
/* harmony import */ var _utils_buildSendTx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/buildSendTx */ "./src/pages/Send/utils/buildSendTx.ts");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");






const useEVMSend = ({
  chainId,
  from,
  provider,
  maxFee,
  nativeToken
}) => {
  const {
    request
  } = (0,_src_contexts_ConnectionProvider__WEBPACK_IMPORTED_MODULE_2__.useConnectionContext)();
  const [isSending, setIsSending] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isValidating, setIsValidating] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [maxAmount, setMaxAmount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('0');
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const getTx = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(options => (0,_utils_buildSendTx__WEBPACK_IMPORTED_MODULE_3__.buildTx)(from, provider, options), [from, provider]);
  const send = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async options => {
    try {
      setIsSending(true);
      const tx = await getTx(options);
      const hash = await request({
        method: _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_4__.RpcMethod.ETH_SEND_TRANSACTION,
        params: [{
          ...tx,
          chainId
        }]
      });
      return hash;
    } finally {
      setIsSending(false);
    }
  }, [request, chainId, getTx]);
  const getGasLimit = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async options => {
    const tx = await getTx(options);
    return provider.estimateGas(tx);
  }, [provider, getTx]);
  const validateErc721 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({
    address
  }) => {
    if (!address) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.ADDRESS_REQUIRED);
    } else if (nativeToken.balance === 0n) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE);
    }
  }, [nativeToken.balance]);
  const validateErc1155 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({
    address,
    token
  }) => {
    if (!address) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.ADDRESS_REQUIRED);
    } else if (token.balance === 0n) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE);
    } else if (nativeToken.balance === 0n) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE);
    }
  }, [nativeToken.balance]);
  const validateNativeAndErc20 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async ({
    address,
    token,
    amount
  }) => {
    // For ERC-20 and native tokens, we want to know the max. transfer amount
    // even if the validation as a whole fails (e.g. user did not provide
    // the target address yet).
    const amountBigInt = (0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_5__.stringToBigint)(amount || '0', token.decimals);
    const gasLimit = await getGasLimit({
      address: address || from,
      // gas used for transfer will be the same no matter the target address
      amount: amount || '0',
      // the amount does not change the gas costs
      token
    });
    const totalFee = gasLimit * maxFee;
    const remainingBalance = nativeToken.balance - amountBigInt;
    if (token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_4__.TokenType.NATIVE) {
      setMaxAmount((nativeToken.balance - totalFee).toString());
      if (remainingBalance < totalFee) {
        setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE);
        return;
      }
    } else if (token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_4__.TokenType.ERC20) {
      setMaxAmount(token.balance.toString());
    }
    if (!address) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.ADDRESS_REQUIRED);
      return;
    }
    if (!amount) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.AMOUNT_REQUIRED);
      return;
    }
    if (amountBigInt && (amountBigInt === 0n || amountBigInt < 0)) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.AMOUNT_REQUIRED);
      return;
    }
    if (amountBigInt && token.balance < amountBigInt) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE);
      return;
    }
  }, [from, getGasLimit, maxFee, nativeToken.balance]);
  const validate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async options => {
    const {
      token
    } = options;
    setIsValidating(true);
    setError(undefined);
    if (!token) {
      setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.TOKEN_REQUIRED);
      return;
    }
    try {
      if ((0,_utils_buildSendTx__WEBPACK_IMPORTED_MODULE_3__.isErc721Send)(options)) {
        validateErc721(options);
      } else if ((0,_utils_buildSendTx__WEBPACK_IMPORTED_MODULE_3__.isErc1155Send)(options)) {
        validateErc1155(options);
      } else if ((0,_utils_buildSendTx__WEBPACK_IMPORTED_MODULE_3__.isNativeSend)(options) || (0,_utils_buildSendTx__WEBPACK_IMPORTED_MODULE_3__.isErc20Send)(options)) {
        await validateNativeAndErc20(options);
      } else {
        setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.UNSUPPORTED_TOKEN);
      }
    } catch (err) {
      if (!!err?.message && err?.message.includes('insufficient funds')) {
        setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE);
      } else {
        // We don't want to send those errors to Sentry,
        // as they'll likely include identifiable data (i.e. addresses).
        console.error(err);
        setError(_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.UNKNOWN_ERROR);
      }
    } finally {
      setIsValidating(false);
    }
  }, [validateErc1155, validateErc721, validateNativeAndErc20]);
  return {
    error,
    isSending,
    isValid: !error,
    isValidating,
    maxAmount,
    send,
    validate
  };
};

/***/ }),

/***/ "./src/pages/Send/hooks/useValidAddressFromParams.ts":
/*!***********************************************************!*\
  !*** ./src/pages/Send/hooks/useValidAddressFromParams.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useValidAddressFromParams": () => (/* binding */ useValidAddressFromParams)
/* harmony export */ });
/* harmony import */ var _src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @src/hooks/useQueryParams */ "./src/hooks/useQueryParams.ts");

const useValidAddressFromParams = validateAddress => {
  const params = (0,_src_hooks_useQueryParams__WEBPACK_IMPORTED_MODULE_0__.useQueryParams)();
  const addressFromParams = params.get('address') ?? '';
  return validateAddress(addressFromParams) ? addressFromParams : '';
};

/***/ }),

/***/ "./src/pages/Send/utils/buildSendTx.ts":
/*!*********************************************!*\
  !*** ./src/pages/Send/utils/buildSendTx.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildErc1155Tx": () => (/* binding */ buildErc1155Tx),
/* harmony export */   "buildErc20Tx": () => (/* binding */ buildErc20Tx),
/* harmony export */   "buildErc721Tx": () => (/* binding */ buildErc721Tx),
/* harmony export */   "buildNativeTx": () => (/* binding */ buildNativeTx),
/* harmony export */   "buildTx": () => (/* binding */ buildTx),
/* harmony export */   "isErc1155Send": () => (/* binding */ isErc1155Send),
/* harmony export */   "isErc20Send": () => (/* binding */ isErc20Send),
/* harmony export */   "isErc721Send": () => (/* binding */ isErc721Send),
/* harmony export */   "isNativeSend": () => (/* binding */ isNativeSend)
/* harmony export */ });
/* harmony import */ var _openzeppelin_contracts_build_contracts_ERC20_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openzeppelin/contracts/build/contracts/ERC20.json */ "./node_modules/@openzeppelin/contracts/build/contracts/ERC20.json");
/* harmony import */ var _openzeppelin_contracts_build_contracts_ERC721_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openzeppelin/contracts/build/contracts/ERC721.json */ "./node_modules/@openzeppelin/contracts/build/contracts/ERC721.json");
/* harmony import */ var _openzeppelin_contracts_build_contracts_ERC1155_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openzeppelin/contracts/build/contracts/ERC1155.json */ "./node_modules/@openzeppelin/contracts/build/contracts/ERC1155.json");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/contract/contract.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/stringToBigint */ "./src/utils/stringToBigint.ts");






const asHex = value => `0x${value.toString(16)}`;
const buildErc20Tx = async (from, provider, {
  address,
  amount,
  token
}) => {
  const contract = new ethers__WEBPACK_IMPORTED_MODULE_5__.Contract(token.address || '', _openzeppelin_contracts_build_contracts_ERC20_json__WEBPACK_IMPORTED_MODULE_0__.abi, provider);
  const populatedTransaction = await contract.transfer.populateTransaction(address, asHex((0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_4__.stringToBigint)(amount, token.decimals)));
  const unsignedTx = {
    ...populatedTransaction,
    // only includes `to` and `data`
    chainId: populatedTransaction.chainId ? Number(populatedTransaction.chainId) : undefined,
    from
  };
  return unsignedTx;
};
const buildErc721Tx = async (from, provider, {
  address,
  token
}) => {
  const contract = new ethers__WEBPACK_IMPORTED_MODULE_5__.Contract(token.address || '', _openzeppelin_contracts_build_contracts_ERC721_json__WEBPACK_IMPORTED_MODULE_1__.abi, provider);
  const populatedTransaction = await contract['safeTransferFrom(address,address,uint256)'].populateTransaction(from, address, token.tokenId);
  const unsignedTx = {
    ...populatedTransaction,
    chainId: populatedTransaction.chainId ? Number(populatedTransaction.chainId) : undefined,
    from
  };
  return unsignedTx;
};
const buildErc1155Tx = async (from, provider, {
  address,
  token
}) => {
  const contract = new ethers__WEBPACK_IMPORTED_MODULE_5__.Contract(token.address || '', _openzeppelin_contracts_build_contracts_ERC1155_json__WEBPACK_IMPORTED_MODULE_2__.abi, provider);
  const populatedTransaction = await contract['safeTransferFrom(address,address,uint256,uint256,bytes)'].populateTransaction(from, address, token.tokenId, 1, new Uint8Array());
  const unsignedTx = {
    ...populatedTransaction,
    chainId: populatedTransaction.chainId ? Number(populatedTransaction.chainId) : undefined,
    from
  };
  return unsignedTx;
};
const buildNativeTx = (from, {
  address,
  amount,
  token
}) => ({
  from,
  to: address,
  value: asHex((0,_src_utils_stringToBigint__WEBPACK_IMPORTED_MODULE_4__.stringToBigint)(amount, token.decimals))
});
const isNativeSend = options => options.token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__.TokenType.NATIVE;
const isErc20Send = options => options.token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__.TokenType.ERC20;
const isErc721Send = options => options.token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__.TokenType.ERC721;
const isErc1155Send = options => options.token.type === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__.TokenType.ERC1155;
const buildTx = async (from, provider, options) => {
  if (isNativeSend(options)) {
    return buildNativeTx(from, options);
  }
  if (isErc20Send(options)) {
    return buildErc20Tx(from, provider, options);
  }
  if (isErc721Send(options)) {
    return buildErc721Tx(from, provider, options);
  }
  if (isErc1155Send(options)) {
    return buildErc1155Tx(from, provider, options);
  }
  throw new Error(`Unknown send options object`);
};

/***/ }),

/***/ "./src/pages/Send/utils/correctAddressByPrefix.ts":
/*!********************************************************!*\
  !*** ./src/pages/Send/utils/correctAddressByPrefix.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "correctAddressByPrefix": () => (/* binding */ correctAddressByPrefix)
/* harmony export */ });
const correctAddressByPrefix = (address, prefix) => {
  return !address.startsWith(prefix) ? `${prefix}${address}` : address;
};

/***/ }),

/***/ "./src/pages/Send/utils/sendErrorMessages.ts":
/*!***************************************************!*\
  !*** ./src/pages/Send/utils/sendErrorMessages.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getSendErrorMessage": () => (/* binding */ getSendErrorMessage)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var _src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/utils/send/models */ "./src/utils/send/models.ts");


function getSendErrorMessage(key, details) {
  if (key === _src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.AMOUNT_TOO_LOW) {
    return details?.minAmount ? (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('At least {{minAmount}} is required', details) : (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Amount too low');
  }
  const translations = {
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.AMOUNT_REQUIRED]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Amount required'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.ADDRESS_REQUIRED]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Address required'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INVALID_ADDRESS]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Address is invalid'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INVALID_NETWORK_FEE]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Network Fee is invalid'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Insufficient balance.'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Insufficient balance for fee'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.TOKEN_REQUIRED]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Token is required'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.UNABLE_TO_FETCH_UTXOS]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Internal error. Please try again'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.UNSUPPORTED_TOKEN]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Unsupported token'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.UNKNOWN_ERROR]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Unknown error'),
    [_src_utils_send_models__WEBPACK_IMPORTED_MODULE_1__.SendErrorMessage.EXCESSIVE_NETWORK_FEE]: (0,i18next__WEBPACK_IMPORTED_MODULE_0__.t)('Selected fee is too high')
  };
  return translations[key] ?? key;
}

/***/ }),

/***/ "./src/utils/bridgeTransactionUtils.ts":
/*!*********************************************!*\
  !*** ./src/utils/bridgeTransactionUtils.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ETHEREUM_ADDRESS": () => (/* binding */ ETHEREUM_ADDRESS),
/* harmony export */   "isPendingBridgeTransaction": () => (/* binding */ isPendingBridgeTransaction)
/* harmony export */ });
const ETHEREUM_ADDRESS = '0x0000000000000000000000000000000000000000';
function isPendingBridgeTransaction(item) {
  return 'addressBTC' in item || 'sourceChain' in item;
}

/***/ }),

/***/ "./src/utils/handleTxOutcome.ts":
/*!**************************************!*\
  !*** ./src/utils/handleTxOutcome.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "handleTxOutcome": () => (/* binding */ handleTxOutcome)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./src/utils/errors/index.ts");


/**
 * Use this util function to distinguish between the user rejecting the
 */
async function handleTxOutcome(txRequestPromise) {
  try {
    const result = await txRequestPromise;
    return {
      isApproved: true,
      hasError: false,
      result
    };
  } catch (err) {
    return {
      isApproved: !(0,_errors__WEBPACK_IMPORTED_MODULE_0__.isUserRejectionError)(err),
      hasError: true,
      error: err
    };
  }
}

/***/ }),

/***/ "./src/utils/isBitcoin.ts":
/*!********************************!*\
  !*** ./src/utils/isBitcoin.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBitcoin": () => (/* binding */ isBitcoin)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");

function isBitcoin(network) {
  return network?.vmName === _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.BITCOIN;
}

/***/ }),

/***/ "./src/utils/send/models.ts":
/*!**********************************!*\
  !*** ./src/utils/send/models.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SendErrorMessage": () => (/* binding */ SendErrorMessage)
/* harmony export */ });
let SendErrorMessage = /*#__PURE__*/function (SendErrorMessage) {
  SendErrorMessage["AMOUNT_REQUIRED"] = "AMOUNT_REQUIRED";
  SendErrorMessage["AMOUNT_TOO_LOW"] = "AMOUNT_TOO_LOW";
  SendErrorMessage["ADDRESS_REQUIRED"] = "ADDRESS_REQUIRED";
  SendErrorMessage["C_CHAIN_REQUIRED"] = "C_CHAIN_REQUIRED";
  SendErrorMessage["INVALID_ADDRESS"] = "INVALID_ADDRESS";
  SendErrorMessage["INVALID_NETWORK_FEE"] = "INVALID_NETWORK_FEE";
  SendErrorMessage["INSUFFICIENT_BALANCE"] = "INSUFFICIENT_BALANCE";
  SendErrorMessage["INSUFFICIENT_BALANCE_FOR_FEE"] = "INSUFFICIENT_BALANCE_FOR_FEE";
  SendErrorMessage["EXCESSIVE_NETWORK_FEE"] = "EXCESSIVE_NETWORK_FEE";
  SendErrorMessage["TOKEN_REQUIRED"] = "TOKEN_REQUIRED";
  SendErrorMessage["UNSUPPORTED_TOKEN"] = "UNSUPPORTED_TOKEN";
  SendErrorMessage["UNABLE_TO_FETCH_UTXOS"] = "UNABLE_TO_FETCH_UTXOS";
  SendErrorMessage["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
  SendErrorMessage["UNSUPPORTED_BY_LEDGER"] = "UNSUPPORTED_BY_LEDGER";
  SendErrorMessage["SEND_NOT_AVAILABLE"] = "SEND_NOT_AVAILABLE";
  return SendErrorMessage;
}({});

/***/ }),

/***/ "./src/images/logos/solana.png":
/*!*************************************!*\
  !*** ./src/images/logos/solana.png ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/7f209345589c18fa38a2081553b8f26b.png");

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NvbXBvbmVudHNfY29tbW9uX0Z1bmN0aW9uSXNVbmF2YWlsYWJsZV90c3gtc3JjX3BhZ2VzX1NlbmRfY29tcG9uZW50c19Db250YWN0SW5wdXRfdHN4LXNyLTQ1YjgxNC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFHTyxTQUFTQSxrQkFBa0JBLENBQ2hDQyxFQUFpQixFQUdqQjtFQUNBLE9BQU9BLEVBQUUsQ0FBQ0MsTUFBTSxLQUFLLEtBQUssSUFBSUQsRUFBRSxDQUFDQyxNQUFNLEtBQUssS0FBSztBQUNuRDtBQUVPLFNBQVNDLHFCQUFxQkEsQ0FDbkNGLEVBQWlCLEVBQ3VCO0VBQ3hDLE9BQU9BLEVBQUUsQ0FBQ0MsTUFBTSxLQUFLLEtBQUs7QUFDNUI7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmNEQ7QUFFckQsU0FBU0csZUFBZUEsQ0FBQ0MsT0FBaUIsRUFBRTtFQUNqRCxPQUFPQSxPQUFPLEdBQUdDLGVBQWUsQ0FBQ0QsT0FBTyxDQUFDRSxPQUFPLENBQUMsR0FBRyxLQUFLO0FBQzNEO0FBRU8sU0FBU0QsZUFBZUEsQ0FBQ0MsT0FBZSxFQUFFO0VBQy9DLE9BQ0VKLDhFQUF3QixLQUFLSSxPQUFPLElBQ3BDSiwrRUFBeUIsS0FBS0ksT0FBTyxJQUNyQ0osK0VBQXlCLEtBQUtJLE9BQU87QUFFekM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWDBEO0FBQ0o7QUFDVTtBQUNBO0FBT3pELFNBQVNXLHFCQUFxQkEsQ0FBQztFQUNwQ0MsWUFBWTtFQUNaZCxPQUFPO0VBQ1BlO0FBQ3lDLENBQUMsRUFBRTtFQUM1QyxNQUFNO0lBQUVDO0VBQUUsQ0FBQyxHQUFHUCw2REFBYyxFQUFFO0VBRTlCLG9CQUNFUSxLQUFBLENBQUFDLGFBQUEsQ0FBQ1AsOERBQUs7SUFDSlEsRUFBRSxFQUFFO01BQ0ZDLEtBQUssRUFBRSxNQUFNO01BQ2JDLE1BQU0sRUFBRTtJQUNWO0VBQUUsZ0JBRUZKLEtBQUEsQ0FBQUMsYUFBQSxDQUFDWixpREFBUztJQUFDZ0Is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U0FBU0EsQ0FBQzVDLE9BQWlCLEVBQUU7RUFDM0MsT0FBT0EsT0FBTyxFQUFFOEssTUFBTSxLQUFLaEMsMkVBQXFCO0FBQ2xEOzs7Ozs7Ozs7Ozs7OztBQ0pPLElBQUs0SSxnQkFBZ0IsMEJBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBaEJBLGdCQUFnQjtFQUFoQkEsZ0JBQWdCO0VBQWhCQSxnQkFBZ0I7RUFBQSxPQUFoQkEsZ0JBQWdCO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0FDQTVCLGlFQUFlLHFCQUF1QixnREFBZ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc2VydmljZXMvaGlzdG9yeS91dGlscy9pc1R4SGlzdG9yeUl0ZW0udHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNTb2xhbmFOZXR3b3JrLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvY29tcG9uZW50cy9jb21tb24vRnVuY3Rpb25Jc1VuYXZhaWxhYmxlLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2hvb2tzL3VzZVF1ZXJ5UGFyYW1zLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2VuZC9jb21wb25lbnRzL0FkZHJlc3NEcm9wZG93bkxpc3QudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2VuZC9jb21wb25lbnRzL0FkZHJlc3NEcm9wZG93bkxpc3RJdGVtLnRzeCIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvY29tcG9uZW50cy9BZGRyZXNzRHJvcGRvd25MaXN0TXlBY2NvdW50cy50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZW5kL2NvbXBvbmVudHMvQ29udGFjdEFkZHJlc3MudHN4Iiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2VuZC9jb21wb25lbnRzL0NvbnRhY3RJbnB1dC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZW5kL2NvbXBvbmVudHMvQ29udGFjdFNlbGVjdC50c3giLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9wYWdlcy9TZW5kL2hvb2tzL3VzZUlkZW50aWZ5QWRkcmVzcy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvaG9va3MvdXNlU2VuZC91c2VFVk1TZW5kLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2VuZC9ob29rcy91c2VWYWxpZEFkZHJlc3NGcm9tUGFyYW1zLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvU2VuZC91dGlscy9idWlsZFNlbmRUeC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvdXRpbHMvY29ycmVjdEFkZHJlc3NCeVByZWZpeC50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3BhZ2VzL1NlbmQvdXRpbHMvc2VuZEVycm9yTWVzc2FnZXMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9icmlkZ2VUcmFuc2FjdGlvblV0aWxzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvaGFuZGxlVHhPdXRjb21lLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvaXNCaXRjb2luLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvc2VuZC9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9pbWFnZXMvbG9nb3Mvc29sYW5hLnBuZyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXR3b3JrVk1UeXBlIH0gZnJvbSAnQGF2YWxhYnMvdm0tbW9kdWxlLXR5cGVzJztcbmltcG9ydCB7IFR4SGlzdG9yeUl0ZW0gfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNOb25YUEhpc3RvcnlJdGVtKFxuICB0eDogVHhIaXN0b3J5SXRlbSxcbik6IHR4IGlzIFR4SGlzdG9yeUl0ZW08XG4gIEV4Y2x1ZGU8TmV0d29ya1ZNVHlwZSwgTmV0d29ya1ZNVHlwZS5BVk0gfCBOZXR3b3JrVk1UeXBlLlBWTT5cbj4ge1xuICByZXR1cm4gdHgudm1UeXBlICE9PSAnQVZNJyAmJiB0eC52bVR5cGUgIT09ICdQVk0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQY2hhaW5UeEhpc3RvcnlJdGVtKFxuICB0eDogVHhIaXN0b3J5SXRlbSxcbik6IHR4IGlzIFR4SGlzdG9yeUl0ZW08TmV0d29ya1ZNVHlwZS5QVk0+IHtcbiAgcmV0dXJuIHR4LnZtVHlwZSA9PT0gJ1BWTSc7XG59XG4iLCJpbXBvcnQgeyBOZXR3b3JrLCBDaGFpbklkIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzU29sYW5hTmV0d29yayhuZXR3b3JrPzogTmV0d29yaykge1xuICByZXR1cm4gbmV0d29yayA/IGlzU29sYW5hQ2hhaW5JZChuZXR3b3JrLmNoYWluSWQpIDogZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NvbGFuYUNoYWluSWQoY2hhaW5JZDogbnVtYmVyKSB7XG4gIHJldHVybiAoXG4gICAgQ2hhaW5JZC5TT0xBTkFfREVWTkVUX0lEID09PSBjaGFpbklkIHx8XG4gICAgQ2hhaW5JZC5TT0xBTkFfTUFJTk5FVF9JRCA9PT0gY2hhaW5JZCB8fFxuICAgIENoYWluSWQuU09MQU5BX1RFU1RORVRfSUQgPT09IGNoYWluSWRcbiAgKTtcbn1cbiIsImltcG9ydCB7IFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgUGFnZVRpdGxlLCBQYWdlVGl0bGVWYXJpYW50IH0gZnJvbSAnLi9QYWdlVGl0bGUnO1xuaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCc7XG5pbXBvcnQgeyBnZXRUcmFuc2xhdGVkRnVuY3Rpb25OYW1lIH0gZnJvbSAnLi9GdW5jdGlvbklzT2ZmbGluZSc7XG5pbXBvcnQgeyBTdGFjaywgVHlwb2dyYXBoeSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBGdW5jdGlvbk5hbWVzIH0gZnJvbSAnQHNyYy9ob29rcy91c2VJc0Z1bmN0aW9uQXZhaWxhYmxlJztcbmludGVyZmFjZSBGdW5jdGlvbklzT2ZmbGluZVByb3BzIHtcbiAgZnVuY3Rpb25OYW1lOiBGdW5jdGlvbk5hbWVzO1xuICBuZXR3b3JrOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBGdW5jdGlvbklzVW5hdmFpbGFibGUoe1xuICBmdW5jdGlvbk5hbWUsXG4gIG5ldHdvcmssXG4gIGNoaWxkcmVuLFxufTogUHJvcHNXaXRoQ2hpbGRyZW48RnVuY3Rpb25Jc09mZmxpbmVQcm9wcz4pIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrXG4gICAgICBzeD17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgPFBhZ2VUaXRsZSB2YXJpYW50PXtQYWdlVGl0bGVWYXJpYW50LlBSSU1BUll9PntmdW5jdGlvbk5hbWV9PC9QYWdlVGl0bGU+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBweDogNCxcbiAgICAgICAgICBhbGlnbkNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkxXCIgbWluSGVpZ2h0PXsyNH0gYWxpZ249XCJjZW50ZXJcIj5cbiAgICAgICAgICA8VHJhbnNcbiAgICAgICAgICAgIGkxOG5LZXk9XCJTb3JyeSwge3tmdW5jdGlvbk5hbWV9fSBpcyB1bmF2YWlsYWJsZSBvbiA8YnIvPnt7bmV0d29ya319IG5ldHdvcmsuXCJcbiAgICAgICAgICAgIHZhbHVlcz17e1xuICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6XG4gICAgICAgICAgICAgICAgZ2V0VHJhbnNsYXRlZEZ1bmN0aW9uTmFtZShmdW5jdGlvbk5hbWUpID8/IHQoJ1RoaXMgRmVhdHVyZScpLFxuICAgICAgICAgICAgICBuZXR3b3JrLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn1cbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG5leHBvcnQgY29uc3QgdXNlUXVlcnlQYXJhbXMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgc2VhcmNoIH0gPSB1c2VMb2NhdGlvbigpO1xuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+IG5ldyBVUkxTZWFyY2hQYXJhbXMoc2VhcmNoKSwgW3NlYXJjaF0pO1xufTtcbiIsImltcG9ydCB7IEJveCwgQnV0dG9uLCBTY3JvbGxiYXJzLCBTdGFjayB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHR5cGUgeyBDb250YWN0IH0gZnJvbSAnQGF2YWxhYnMvdHlwZXMnO1xuXG5pbXBvcnQgeyBBZGRyZXNzRHJvcGRvd25MaXN0SXRlbSB9IGZyb20gJy4vQWRkcmVzc0Ryb3Bkb3duTGlzdEl0ZW0nO1xuaW1wb3J0IHsgdXNlU2V0dGluZ3NDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9TZXR0aW5nc1Byb3ZpZGVyJztcbmltcG9ydCB7IFNldHRpbmdzUGFnZXMgfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvc2V0dGluZ3MvbW9kZWxzJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgaXNCaXRjb2luIH0gZnJvbSAnQHNyYy91dGlscy9pc0JpdGNvaW4nO1xuaW1wb3J0IHsgaXNQY2hhaW5OZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNBdmFsYW5jaGVQY2hhaW5OZXR3b3JrJztcbmltcG9ydCB7IGlzWGNoYWluTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzQXZhbGFuY2hlWGNoYWluTmV0d29yayc7XG5pbXBvcnQgeyBpc1NvbGFuYU5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc1NvbGFuYU5ldHdvcmsnO1xuXG50eXBlIEFkZHJlc3NEcm9wZG93bkxpc3RQcm9wcyA9IHtcbiAgY29udGFjdHM6IENvbnRhY3RbXTtcbiAgc2VsZWN0ZWRDb250YWN0PzogQ29udGFjdDtcbiAgb25DaGFuZ2UoY29udGFjdDogQ29udGFjdCk6IHZvaWQ7XG4gIGFkZENvbnRhY3Q/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGNvbnN0IEFkZHJlc3NEcm9wZG93bkxpc3QgPSAoe1xuICBjb250YWN0cyxcbiAgc2VsZWN0ZWRDb250YWN0LFxuICBvbkNoYW5nZSxcbiAgYWRkQ29udGFjdCxcbn06IEFkZHJlc3NEcm9wZG93bkxpc3RQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgdXNlQnRjQWRkcmVzcyA9IGlzQml0Y29pbihuZXR3b3JrKTtcbiAgY29uc3QgdXNlWFBBZGRyZXNzID0gaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspIHx8IGlzWGNoYWluTmV0d29yayhuZXR3b3JrKTtcbiAgY29uc3QgdXNlU1ZNQWRkcmVzcyA9IEJvb2xlYW4obmV0d29yayAmJiBpc1NvbGFuYU5ldHdvcmsobmV0d29yaykpO1xuXG4gIGNvbnN0IHNlbGVjdGVkQWRkcmVzcyA9XG4gICAgc2VsZWN0ZWRDb250YWN0Py5bXG4gICAgICB1c2VTVk1BZGRyZXNzXG4gICAgICAgID8gJ2FkZHJlc3NTVk0nXG4gICAgICAgIDogdXNlQnRjQWRkcmVzc1xuICAgICAgICAgID8gJ2FkZHJlc3NCVEMnXG4gICAgICAgICAgOiB1c2VYUEFkZHJlc3NcbiAgICAgICAgICAgID8gJ2FkZHJlc3NYUCdcbiAgICAgICAgICAgIDogJ2FkZHJlc3MnXG4gICAgXT8udG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCB7IHNldElzU2V0dGluZ3NPcGVuLCBzZXRTZXR0aW5nc0FjdGl2ZVBhZ2UgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgIHthZGRDb250YWN0ICYmIChcbiAgICAgICAgPEJveCBzeD17eyBweTogMiB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldFNldHRpbmdzQWN0aXZlUGFnZShTZXR0aW5nc1BhZ2VzLkFERF9DT05UQUNUKTtcbiAgICAgICAgICAgICAgc2V0SXNTZXR0aW5nc09wZW4odHJ1ZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZW5kLWFkZC1uZXctY29udGFjdFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJysgQWRkIE5ldyBDb250YWN0Jyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICAgIDxTY3JvbGxiYXJzIHN0eWxlPXt7IGZsZXhHcm93OiAxLCBoZWlnaHQ6ICcxMDAlJywgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAge2NvbnRhY3RzLm1hcCgoY29udGFjdCwgaSkgPT4gKFxuICAgICAgICAgIDxBZGRyZXNzRHJvcGRvd25MaXN0SXRlbVxuICAgICAgICAgICAga2V5PXtgJHtjb250YWN0LmFkZHJlc3N9JHtpfWB9XG4gICAgICAgICAgICBjb250YWN0PXtjb250YWN0fVxuICAgICAgICAgICAgaXNTZWxlY3RlZD17XG4gICAgICAgICAgICAgIGNvbnRhY3Q/LltcbiAgICAgICAgICAgICAgICB1c2VTVk1BZGRyZXNzXG4gICAgICAgICAgICAgICAgICA/ICdhZGRyZXNzU1ZNJ1xuICAgICAgICAgICAgICAgICAgOiB1c2VCdGNBZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgID8gJ2FkZHJlc3NCVEMnXG4gICAgICAgICAgICAgICAgICAgIDogdXNlWFBBZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgPyAnYWRkcmVzc1hQJ1xuICAgICAgICAgICAgICAgICAgICAgIDogJ2FkZHJlc3MnXG4gICAgICAgICAgICAgIF0/LnRvTG93ZXJDYXNlKCkgPT09IHNlbGVjdGVkQWRkcmVzc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9TY3JvbGxiYXJzPlxuICAgIDwvU3RhY2s+XG4gICk7XG59O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0eXBlIHsgQ29udGFjdCB9IGZyb20gJ0BhdmFsYWJzL3R5cGVzJztcbmltcG9ydCB7XG4gIFN0YWNrLFxuICBBdmFsYW5jaGVDb2xvckljb24sXG4gIEJpdGNvaW5Db2xvckljb24sXG4gIEF2YXRhcixcbiAgQnV0dG9uLFxuICBUeXBvZ3JhcGh5LFxuICBUb29sdGlwLFxuICBYQW5kUENoYWluc0ljb24sXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBDb250YWN0QWRkcmVzcyB9IGZyb20gJy4vQ29udGFjdEFkZHJlc3MnO1xuaW1wb3J0IHsgaXNQY2hhaW5OZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNBdmFsYW5jaGVQY2hhaW5OZXR3b3JrJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgaXNYY2hhaW5OZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNBdmFsYW5jaGVYY2hhaW5OZXR3b3JrJztcblxuaW1wb3J0IFNvbGFuYUxvZ28gZnJvbSAnQHNyYy9pbWFnZXMvbG9nb3Mvc29sYW5hLnBuZyc7XG5cbnR5cGUgQWRkcmVzc0Ryb3Bkb3duTGlzdEl0ZW1Qcm9wcyA9IHtcbiAgY29udGFjdDogQ29udGFjdDtcbiAgaXNTZWxlY3RlZDogYm9vbGVhbjtcbiAgc2VsZWN0ZWRDb250YWN0PzogQ29udGFjdDtcbiAgb25DaGFuZ2UoY29udGFjdDogQ29udGFjdCk6IHZvaWQ7XG59O1xuXG5leHBvcnQgY29uc3QgQWRkcmVzc0Ryb3Bkb3duTGlzdEl0ZW0gPSAoe1xuICBjb250YWN0LFxuICBpc1NlbGVjdGVkLFxuICBvbkNoYW5nZSxcbn06IEFkZHJlc3NEcm9wZG93bkxpc3RJdGVtUHJvcHMpID0+IHtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuXG4gIGNvbnN0IGluaXRpYWxzID1cbiAgICBjb250YWN0Lm5hbWVcbiAgICAgIC5zcGxpdCgnICcpXG4gICAgICAuc2xpY2UoMCwgMilcbiAgICAgIC5tYXAoKHBhcnQpID0+IHBhcnRbMF0gPz8gJycpIHx8ICc/JztcblxuICByZXR1cm4gKFxuICAgIDxCdXR0b25cbiAgICAgIHZhcmlhbnQ9XCJ0ZXh0XCJcbiAgICAgIGRhdGEtdGVzdGlkPVwic2VuZC1hZGRyZXNzLWxpc3QtaXRlbVwiXG4gICAgICBmdWxsV2lkdGhcbiAgICAgIHN4PXt7XG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgIHB5OiAyLFxuICAgICAgICBnYXA6IDIsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgbWF4SGVpZ2h0OiAnbm9uZScsXG4gICAgICB9fVxuICAgICAgY29sb3I9e2lzU2VsZWN0ZWQgPyAnc2Vjb25kYXJ5JyA6ICdwcmltYXJ5J31cbiAgICAgIG9uQ2xpY2s9eyhlOiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChjb250YWN0LmFkZHJlc3NYUCAmJiBpc1BjaGFpbk5ldHdvcmsobmV0d29yaykpIHtcbiAgICAgICAgICBjb25zdCBjb250YWN0V2l0aFByZWZpeCA9IHtcbiAgICAgICAgICAgIC4uLmNvbnRhY3QsXG4gICAgICAgICAgICBhZGRyZXNzWFA6IGBQLSR7Y29udGFjdC5hZGRyZXNzWFB9YCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIG9uQ2hhbmdlKGNvbnRhY3RXaXRoUHJlZml4KTtcbiAgICAgICAgfSBlbHNlIGlmIChjb250YWN0LmFkZHJlc3NYUCAmJiBpc1hjaGFpbk5ldHdvcmsobmV0d29yaykpIHtcbiAgICAgICAgICBjb25zdCBjb250YWN0V2l0aFByZWZpeCA9IHtcbiAgICAgICAgICAgIC4uLmNvbnRhY3QsXG4gICAgICAgICAgICBhZGRyZXNzWFA6IGBYLSR7Y29udGFjdC5hZGRyZXNzWFB9YCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIG9uQ2hhbmdlKGNvbnRhY3RXaXRoUHJlZml4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbkNoYW5nZShjb250YWN0KTtcbiAgICAgICAgfVxuICAgICAgfX1cbiAgICAgIGRpc2FibGVSaXBwbGVcbiAgICA+XG4gICAgICA8U3RhY2tcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBnYXA6IDIuNSxcbiAgICAgICAgICBmbGV4R3JvdzogMSxcbiAgICAgICAgICBtaW5XaWR0aDogMCxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEF2YXRhciBzeD17eyB3aWR0aDogMzIsIGhlaWdodDogMzIgfX0gYWx0PXtjb250YWN0Lm5hbWV9IHVzZUNvbG9yPlxuICAgICAgICAgIHtpbml0aWFsc31cbiAgICAgICAgPC9BdmF0YXI+XG4gICAgICAgIDxUb29sdGlwIHRpdGxlPXtjb250YWN0Lm5hbWV9IHdyYXBXaXRoU3Bhbj17ZmFsc2V9IGRpc2FibGVJbnRlcmFjdGl2ZT5cbiAgICAgICAgICA8VHlwb2dyYXBoeVxuICAgICAgICAgICAgbm9XcmFwXG4gICAgICAgICAgICB2YXJpYW50PVwiYm9keTFcIlxuICAgICAgICAgICAgY29tcG9uZW50PVwic3BhblwiXG4gICAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnc2VtaWJvbGQnLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGNvbG9yPVwiaW5oZXJpdFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge2NvbnRhY3QubmFtZX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgIDwvVG9vbHRpcD5cbiAgICAgIDwvU3RhY2s+XG4gICAgICA8U3RhY2sgc3g9e3sgZ2FwOiAwLjUgfX0+XG4gICAgICAgIHtjb250YWN0LmFkZHJlc3MgJiYgKFxuICAgICAgICAgIDxDb250YWN0QWRkcmVzc1xuICAgICAgICAgICAgYWRkcmVzcz17Y29udGFjdC5hZGRyZXNzfVxuICAgICAgICAgICAgbmV0d29ya0ljb249ezxBdmFsYW5jaGVDb2xvckljb24gc2l6ZT17MTZ9IC8+fVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIHtjb250YWN0LmFkZHJlc3NCVEMgJiYgKFxuICAgICAgICAgIDxDb250YWN0QWRkcmVzc1xuICAgICAgICAgICAgYWRkcmVzcz17Y29udGFjdC5hZGRyZXNzQlRDfVxuICAgICAgICAgICAgbmV0d29ya0ljb249ezxCaXRjb2luQ29sb3JJY29uIHNpemU9ezE2fSAvPn1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgICB7Y29udGFjdC5hZGRyZXNzWFAgJiYgKFxuICAgICAgICAgIDxDb250YWN0QWRkcmVzc1xuICAgICAgICAgICAgYWRkcmVzcz17XG4gICAgICAgICAgICAgIGlzUGNoYWluTmV0d29yayhuZXR3b3JrKVxuICAgICAgICAgICAgICAgID8gYFAtJHtjb250YWN0LmFkZHJlc3NYUH1gXG4gICAgICAgICAgICAgICAgOiBgWC0ke2NvbnRhY3QuYWRkcmVzc1hQfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ldHdvcmtJY29uPXs8WEFuZFBDaGFpbnNJY29uIHNpemU9ezE2fSAvPn1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgICB7Y29udGFjdC5hZGRyZXNzU1ZNICYmIChcbiAgICAgICAgICA8Q29udGFjdEFkZHJlc3NcbiAgICAgICAgICAgIGFkZHJlc3M9e2NvbnRhY3QuYWRkcmVzc1NWTX1cbiAgICAgICAgICAgIG5ldHdvcmtJY29uPXs8aW1nIHNyYz17U29sYW5hTG9nb30gYWx0PVwiU29sYW5hXCIgaGVpZ2h0PXsyNH0gLz59XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9CdXR0b24+XG4gICk7XG59O1xuIiwiaW1wb3J0IHtcbiAgQm94LFxuICBCdXR0b24sXG4gIFNjcm9sbGJhcnMsXG4gIFN0YWNrLFxuICBUeXBvZ3JhcGh5LFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0JztcbmltcG9ydCB0eXBlIHsgQ29udGFjdCB9IGZyb20gJ0BhdmFsYWJzL3R5cGVzJztcblxuaW1wb3J0IHsgQWRkcmVzc0Ryb3Bkb3duTGlzdEl0ZW0gfSBmcm9tICcuL0FkZHJlc3NEcm9wZG93bkxpc3RJdGVtJztcbmltcG9ydCB7IHVzZVNldHRpbmdzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvU2V0dGluZ3NQcm92aWRlcic7XG5pbXBvcnQgeyBTZXR0aW5nc1BhZ2VzIH0gZnJvbSAnQHNyYy9jb21wb25lbnRzL3NldHRpbmdzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7IGlzQml0Y29pbiB9IGZyb20gJ0BzcmMvdXRpbHMvaXNCaXRjb2luJztcbmltcG9ydCB7IFdhbGxldElkIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2FjY291bnRzL21vZGVscyc7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRQcm92aWRlcic7XG5pbXBvcnQgeyBpc1BjaGFpbk5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZVBjaGFpbk5ldHdvcmsnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGlzWGNoYWluTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzQXZhbGFuY2hlWGNoYWluTmV0d29yayc7XG5pbXBvcnQgeyBpc1NvbGFuYU5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc1NvbGFuYU5ldHdvcmsnO1xuXG5leHBvcnQgdHlwZSBNeUFjY291bnRDb250YWN0ID0ge1xuICBpZDogc3RyaW5nO1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIGFkZHJlc3NCVEM6IHN0cmluZztcbiAgYWRkcmVzc1hQOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgaXNLbm93bjogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIE15QWNjb3VudENvbnRhY3RzID0gUmVjb3JkPFxuICBXYWxsZXRJZCB8ICdpbXBvcnRlZCcsXG4gIE15QWNjb3VudENvbnRhY3RbXVxuPjtcblxudHlwZSBBZGRyZXNzRHJvcGRvd25MaXN0TXlBY2NvdW50c1Byb3BzID0ge1xuICBjb250YWN0czogTXlBY2NvdW50Q29udGFjdHM7XG4gIHNlbGVjdGVkQ29udGFjdD86IENvbnRhY3Q7XG4gIG9uQ2hhbmdlKGNvbnRhY3Q6IENvbnRhY3QpOiB2b2lkO1xuICBhZGRDb250YWN0PzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBjb25zdCBBZGRyZXNzRHJvcGRvd25MaXN0TXlBY2NvdW50cyA9ICh7XG4gIGNvbnRhY3RzLFxuICBzZWxlY3RlZENvbnRhY3QsXG4gIG9uQ2hhbmdlLFxuICBhZGRDb250YWN0LFxufTogQWRkcmVzc0Ryb3Bkb3duTGlzdE15QWNjb3VudHNQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gIGNvbnN0IHsgbmV0d29yayB9ID0gdXNlTmV0d29ya0NvbnRleHQoKTtcbiAgY29uc3QgdXNlQnRjQWRkcmVzcyA9IGlzQml0Y29pbihuZXR3b3JrKTtcbiAgY29uc3QgdXNlU3ZtQWRkcmVzcyA9IG5ldHdvcmsgJiYgaXNTb2xhbmFOZXR3b3JrKG5ldHdvcmspO1xuICBjb25zdCB7IHdhbGxldHMgfSA9IHVzZVdhbGxldENvbnRleHQoKTtcblxuICBjb25zdCB1c2VYcEFkZHJlc3MgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspIHx8IGlzWGNoYWluTmV0d29yayhuZXR3b3JrKTtcbiAgfSwgW25ldHdvcmtdKTtcblxuICBjb25zdCBhZGRyZXNzVHlwZSA9IHVzZVN2bUFkZHJlc3NcbiAgICA/ICdhZGRyZXNzU1ZNJ1xuICAgIDogdXNlQnRjQWRkcmVzc1xuICAgICAgPyAnYWRkcmVzc0JUQydcbiAgICAgIDogdXNlWHBBZGRyZXNzXG4gICAgICAgID8gJ2FkZHJlc3NYUCdcbiAgICAgICAgOiAnYWRkcmVzcyc7XG4gIGNvbnN0IHNlbGVjdGVkQWRkcmVzcyA9IHNlbGVjdGVkQ29udGFjdD8uW2FkZHJlc3NUeXBlXT8udG9Mb3dlckNhc2UoKTtcblxuICBjb25zdCB7IHNldElzU2V0dGluZ3NPcGVuLCBzZXRTZXR0aW5nc0FjdGl2ZVBhZ2UgfSA9IHVzZVNldHRpbmdzQ29udGV4dCgpO1xuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyBmbGV4R3JvdzogMSB9fT5cbiAgICAgIHthZGRDb250YWN0ICYmIChcbiAgICAgICAgPEJveCBzeD17eyBweTogMiB9fT5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB2YXJpYW50PVwidGV4dFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIHNldFNldHRpbmdzQWN0aXZlUGFnZShTZXR0aW5nc1BhZ2VzLkFERF9DT05UQUNUKTtcbiAgICAgICAgICAgICAgc2V0SXNTZXR0aW5nc09wZW4odHJ1ZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZW5kLWFkZC1uZXctY29udGFjdFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJysgQWRkIE5ldyBDb250YWN0Jyl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cbiAgICAgIDxTY3JvbGxiYXJzIHN0eWxlPXt7IGZsZXhHcm93OiAxLCBoZWlnaHQ6ICcxMDAlJywgd2lkdGg6ICcxMDAlJyB9fT5cbiAgICAgICAge3dhbGxldHMubWFwKCh7IGlkLCBuYW1lOiB3YWxsZXROYW1lIH0pID0+IHtcbiAgICAgICAgICBjb25zdCB3YWxsZXRBY2NvdW50cyA9IGNvbnRhY3RzW2lkXTtcbiAgICAgICAgICBpZiAod2FsbGV0QWNjb3VudHMgJiYgd2FsbGV0QWNjb3VudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8U3RhY2sga2V5PXtpZH0+XG4gICAgICAgICAgICAgICAgPFR5cG9ncmFwaHkgdmFyaWFudD1cImJ1dHRvblwiPnt3YWxsZXROYW1lfTwvVHlwb2dyYXBoeT5cblxuICAgICAgICAgICAgICAgIHt3YWxsZXRBY2NvdW50cy5tYXAoKGNvbnRhY3QsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgIDxBZGRyZXNzRHJvcGRvd25MaXN0SXRlbVxuICAgICAgICAgICAgICAgICAgICBrZXk9e2Ake2NvbnRhY3QuYWRkcmVzc30ke2l9YH1cbiAgICAgICAgICAgICAgICAgICAgY29udGFjdD17Y29udGFjdH1cbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17XG4gICAgICAgICAgICAgICAgICAgICAgY29udGFjdD8uW2FkZHJlc3NUeXBlXT8udG9Mb3dlckNhc2UoKSA9PT0gc2VsZWN0ZWRBZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9TdGFjaz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgICAge2NvbnRhY3RzLmltcG9ydGVkICYmIE9iamVjdC52YWx1ZXMoY29udGFjdHMuaW1wb3J0ZWQpLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJidXR0b25cIj57dCgnSW1wb3J0ZWQnKX08L1R5cG9ncmFwaHk+XG4gICAgICAgICl9XG4gICAgICAgIHtjb250YWN0cy5pbXBvcnRlZCAmJlxuICAgICAgICAgIE9iamVjdC52YWx1ZXMoY29udGFjdHMuaW1wb3J0ZWQpLm1hcCgoYWNjKSA9PiAoXG4gICAgICAgICAgICA8QWRkcmVzc0Ryb3Bkb3duTGlzdEl0ZW1cbiAgICAgICAgICAgICAga2V5PXtgJHthY2MuaWR9YH1cbiAgICAgICAgICAgICAgY29udGFjdD17YWNjfVxuICAgICAgICAgICAgICBpc1NlbGVjdGVkPXthY2M/LlthZGRyZXNzVHlwZV0/LnRvTG93ZXJDYXNlKCkgPT09IHNlbGVjdGVkQWRkcmVzc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgIDwvU2Nyb2xsYmFycz5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7XG4gIENvcHlJY29uLFxuICBTdGFjayxcbiAgdG9hc3QsXG4gIFRvb2x0aXAsXG4gIFR5cG9ncmFwaHksXG59IGZyb20gJ0BhdmFsYWJzL2NvcmUtazItY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuXG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAc3JjL3V0aWxzL3RydW5jYXRlQWRkcmVzcyc7XG5cbnR5cGUgQ29udGFjdEFkZHJlc3NQcm9wcyA9IHtcbiAgbmV0d29ya0ljb246IEpTWC5FbGVtZW50O1xuICBhZGRyZXNzOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgY29uc3QgQ29udGFjdEFkZHJlc3MgPSAoe1xuICBuZXR3b3JrSWNvbixcbiAgYWRkcmVzcyxcbn06IENvbnRhY3RBZGRyZXNzUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuXG4gIGNvbnN0IGNvcHlBZGRyZXNzID0gKGV2OiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoYWRkcmVzcyk7XG4gICAgdG9hc3QodCgnQ29waWVkIScpLCB7IGR1cmF0aW9uOiAyMDAwIH0pO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPFN0YWNrIHN4PXt7IGZsZXhEaXJlY3Rpb246ICdyb3cnLCBnYXA6IDAuMjUsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAge25ldHdvcmtJY29ufVxuICAgICAgPENvcHlJY29uXG4gICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICBvbkNsaWNrPXtjb3B5QWRkcmVzc31cbiAgICAgICAgc2l6ZT17MTZ9XG4gICAgICAgIHN4PXt7IHA6IDAuNSwgJzpob3Zlcic6IHsgY29sb3I6ICdzZWNvbmRhcnkubWFpbicgfSB9fVxuICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgLz5cbiAgICAgIDxUb29sdGlwXG4gICAgICAgIHRpdGxlPXthZGRyZXNzfVxuICAgICAgICB3cmFwV2l0aFNwYW49e2ZhbHNlfVxuICAgICAgICBkaXNhYmxlSW50ZXJhY3RpdmVcbiAgICAgICAgUG9wcGVyUHJvcHM9e3sgZGlzYWJsZVBvcnRhbDogdHJ1ZSB9fVxuICAgICAgPlxuICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBjb2xvcj1cImluaGVyaXRcIiBzeD17eyB3aWR0aDogJzkycHgnIH19PlxuICAgICAgICAgIHt0cnVuY2F0ZUFkZHJlc3MoYWRkcmVzcyl9XG4gICAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICAgIDwvVG9vbHRpcD5cbiAgICA8L1N0YWNrPlxuICApO1xufTtcbiIsImltcG9ydCB7IFJlZk9iamVjdCwgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgSWNvbkJ1dHRvbixcbiAgSW5wdXRBZG9ybm1lbnQsXG4gIFN0YWNrLFxuICBUZXh0RmllbGQsXG4gIFRvb2x0aXAsXG4gIFVzZXJTZWFyY2hJY29uLFxufSBmcm9tICdAYXZhbGFicy9jb3JlLWsyLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgaXNBZGRyZXNzIGFzIGlzU29sYW5hQWRkcmVzcyB9IGZyb20gJ0Bzb2xhbmEva2l0JztcbmltcG9ydCB0eXBlIHsgQ29udGFjdCB9IGZyb20gJ0BhdmFsYWJzL3R5cGVzJztcbmltcG9ydCB7IE5ldHdvcmtWTVR5cGUgfSBmcm9tICdAYXZhbGFicy9jb3JlLWNoYWlucy1zZGsnO1xuaW1wb3J0IHsgaXNCZWNoMzJBZGRyZXNzIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1icmlkZ2Utc2RrJztcbmltcG9ydCB7IGlzQWRkcmVzcyB9IGZyb20gJ2V0aGVycyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHsgQ29udGFjdFNlbGVjdCB9IGZyb20gJy4vQ29udGFjdFNlbGVjdCc7XG5pbXBvcnQgeyB0cnVuY2F0ZUFkZHJlc3MgfSBmcm9tICdAc3JjL3V0aWxzL3RydW5jYXRlQWRkcmVzcyc7XG5pbXBvcnQgeyB1c2VJZGVudGlmeUFkZHJlc3MgfSBmcm9tICcuLi9ob29rcy91c2VJZGVudGlmeUFkZHJlc3MnO1xuaW1wb3J0IHsgQ29udGFpbmVkRHJvcGRvd24gfSBmcm9tICdAc3JjL2NvbXBvbmVudHMvY29tbW9uL0NvbnRhaW5lZERyb3Bkb3duJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQ29udGFjdHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db250YWN0c1Byb3ZpZGVyJztcbmltcG9ydCB7IGlzQml0Y29pbiB9IGZyb20gJ0BzcmMvdXRpbHMvaXNCaXRjb2luJztcbmltcG9ydCB7IGlzUGNoYWluTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzQXZhbGFuY2hlUGNoYWluTmV0d29yayc7XG5pbXBvcnQgeyBpc1hjaGFpbk5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZVhjaGFpbk5ldHdvcmsnO1xuaW1wb3J0IHtcbiAgaXNWYWxpZEF2bUFkZHJlc3MsXG4gIGlzVmFsaWRQdm1BZGRyZXNzLFxufSBmcm9tICdAc3JjL3V0aWxzL2lzQWRkcmVzc1ZhbGlkJztcbmltcG9ydCB7IGlzU29sYW5hTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzU29sYW5hTmV0d29yayc7XG5cbmNvbnN0IHRydW5jYXRlTmFtZSA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgaWYgKG5hbWUubGVuZ3RoIDwgMjgpIHJldHVybiBuYW1lO1xuICByZXR1cm4gYCR7bmFtZS5zdWJzdHJpbmcoMCwgMjgpfS4uLmA7XG59O1xuXG50eXBlIENvbnRhY3RJbnB1dFByb3BzID0ge1xuICBjb250YWN0PzogQ29udGFjdDtcbiAgb25DaGFuZ2UoY29udGFjdD86IENvbnRhY3QsIHNlbGVjdGVkVGFiPzogc3RyaW5nKTogdm9pZDtcbiAgaXNDb250YWN0c09wZW46IGJvb2xlYW47XG4gIHNldElzT3BlbjogKGlzT3BlbjogYm9vbGVhbikgPT4gdm9pZDtcbiAgY29udGFpbmVyUmVmPzogUmVmT2JqZWN0PEhUTUxEaXZFbGVtZW50Pjtcbn07XG5cbmV4cG9ydCBjb25zdCBDb250YWN0SW5wdXQgPSAoe1xuICBjb250YWN0LFxuICBvbkNoYW5nZSxcbiAgaXNDb250YWN0c09wZW4sXG4gIHNldElzT3BlbixcbiAgY29udGFpbmVyUmVmLFxufTogQ29udGFjdElucHV0UHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICBjb25zdCB7IG5ldHdvcmsgfSA9IHVzZU5ldHdvcmtDb250ZXh0KCk7XG4gIGNvbnN0IGlucHV0V3JhcHBlclJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IGlucHV0UmVmID0gdXNlUmVmPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCBpZGVudGlmeUFkZHJlc3MgPSB1c2VJZGVudGlmeUFkZHJlc3MoKTtcbiAgY29uc3QgeyBjb250YWN0cyB9ID0gdXNlQ29udGFjdHNDb250ZXh0KCk7XG4gIGNvbnN0IFtjb250YWN0c0xlbmd0aCwgc2V0Q29udGFjdHNMZW5ndGhdID0gdXNlU3RhdGUoY29udGFjdHMubGVuZ3RoKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChjb250YWN0cy5sZW5ndGggPiBjb250YWN0c0xlbmd0aCkge1xuICAgICAgY29uc3QgcmVjZW50bHlBZGRlZENvbnRhY3QgPSBjb250YWN0c1tjb250YWN0cy5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChpc1BjaGFpbk5ldHdvcmsobmV0d29yaykgJiYgcmVjZW50bHlBZGRlZENvbnRhY3QpIHtcbiAgICAgICAgcmVjZW50bHlBZGRlZENvbnRhY3QuYWRkcmVzc1hQID0gcmVjZW50bHlBZGRlZENvbnRhY3QuYWRkcmVzc1hQXG4gICAgICAgICAgPyBgUC0ke3JlY2VudGx5QWRkZWRDb250YWN0LmFkZHJlc3NYUH1gXG4gICAgICAgICAgOiAnJztcbiAgICAgIH0gZWxzZSBpZiAoaXNYY2hhaW5OZXR3b3JrKG5ldHdvcmspICYmIHJlY2VudGx5QWRkZWRDb250YWN0KSB7XG4gICAgICAgIHJlY2VudGx5QWRkZWRDb250YWN0LmFkZHJlc3NYUCA9IHJlY2VudGx5QWRkZWRDb250YWN0LmFkZHJlc3NYUFxuICAgICAgICAgID8gYFgtJHtyZWNlbnRseUFkZGVkQ29udGFjdC5hZGRyZXNzWFB9YFxuICAgICAgICAgIDogJyc7XG4gICAgICB9XG4gICAgICBvbkNoYW5nZShyZWNlbnRseUFkZGVkQ29udGFjdCk7XG4gICAgfVxuICAgIHNldENvbnRhY3RzTGVuZ3RoKGNvbnRhY3RzLmxlbmd0aCk7XG4gIH0sIFtjb250YWN0cywgY29udGFjdHNMZW5ndGgsIG5ldHdvcmssIG9uQ2hhbmdlXSk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlQW5kQ2xvc2VEcm9wZG93bihcbiAgICBzZWxlY3RlZENvbnRhY3Q6IENvbnRhY3QsXG4gICAgc2VsZWN0ZWRUYWI6IHN0cmluZyxcbiAgKSB7XG4gICAgb25DaGFuZ2Uoc2VsZWN0ZWRDb250YWN0LCBzZWxlY3RlZFRhYik7XG4gICAgc2V0SXNPcGVuKCFpc0NvbnRhY3RzT3Blbik7XG4gIH1cblxuICBjb25zdCBbaW5wdXRGb2N1c2VkLCBzZXRJbnB1dEZvY3VzZWRdID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xuICBjb25zdCBbaW5wdXRIb3ZlcmVkLCBzZXRJbnB1dEhvdmVyZWRdID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBGb3IgQlRDIHRyYW5zYWN0aW9ucywgJ2FkZHJlc3MnIGlzIGVtcHR5LlxuICAgKiBGb3Igbm9uLUJUQyB0cmFuc2FjdGlvbnMsICdhZGRyZXNzQlRDJyBpcyBlbXB0eS5cbiAgICogQHNlZSB1c2VJZGVudGlmeUFkZHJlc3MoKSBob29rLlxuICAgKi9cbiAgY29uc3QgY29udGFjdEFkZHJlc3MgPVxuICAgIG5ldHdvcmsgJiYgaXNTb2xhbmFOZXR3b3JrKG5ldHdvcmspXG4gICAgICA/IGNvbnRhY3Q/LmFkZHJlc3NTVk1cbiAgICAgIDogaXNCaXRjb2luKG5ldHdvcmspXG4gICAgICAgID8gY29udGFjdD8uYWRkcmVzc0JUQ1xuICAgICAgICA6IGlzUGNoYWluTmV0d29yayhuZXR3b3JrKSB8fCBpc1hjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgICA/IGNvbnRhY3Q/LmFkZHJlc3NYUFxuICAgICAgICAgIDogY29udGFjdD8uYWRkcmVzcztcblxuICBjb25zdCBbY3Vyc29yLCBzZXRDdXJzb3JdID0gdXNlU3RhdGU8bnVtYmVyIHwgbnVsbD4obnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgaW5wdXRSZWYuY3VycmVudC5zZXRTZWxlY3Rpb25SYW5nZShjdXJzb3IsIGN1cnNvcik7XG4gICAgfVxuICB9LCBbaW5wdXRSZWYsIGN1cnNvciwgY29udGFjdEFkZHJlc3NdKTtcblxuICBjb25zdCBpc1ZhbGlkQWRkcmVzcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICBpZiAobmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkVWTSkge1xuICAgICAgcmV0dXJuIGNvbnRhY3QgPyBpc0FkZHJlc3MoY29udGFjdC5hZGRyZXNzKSA6IGZhbHNlO1xuICAgIH1cbiAgICBpZiAobmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkJJVENPSU4pIHtcbiAgICAgIHJldHVybiBjb250YWN0ICYmIGNvbnRhY3QuYWRkcmVzc0JUQ1xuICAgICAgICA/IGlzQmVjaDMyQWRkcmVzcyhjb250YWN0LmFkZHJlc3NCVEMpXG4gICAgICAgIDogZmFsc2U7XG4gICAgfVxuICAgIGlmIChpc1BjaGFpbk5ldHdvcmsobmV0d29yaykpIHtcbiAgICAgIHJldHVybiBjb250YWN0ICYmIGNvbnRhY3QuYWRkcmVzc1hQXG4gICAgICAgID8gaXNWYWxpZFB2bUFkZHJlc3MoY29udGFjdC5hZGRyZXNzWFApXG4gICAgICAgIDogZmFsc2U7XG4gICAgfVxuICAgIGlmIChpc1hjaGFpbk5ldHdvcmsobmV0d29yaykpIHtcbiAgICAgIHJldHVybiBjb250YWN0ICYmIGNvbnRhY3QuYWRkcmVzc1hQXG4gICAgICAgID8gaXNWYWxpZEF2bUFkZHJlc3MoY29udGFjdC5hZGRyZXNzWFApXG4gICAgICAgIDogZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzU29sYW5hTmV0d29yayhuZXR3b3JrKSkge1xuICAgICAgcmV0dXJuIEJvb2xlYW4oXG4gICAgICAgIGNvbnRhY3QgJiYgY29udGFjdC5hZGRyZXNzU1ZNICYmIGlzU29sYW5hQWRkcmVzcyhjb250YWN0LmFkZHJlc3NTVk0pLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGdldElucHV0RGlzcGxheVZhbHVlID0gKCkgPT4ge1xuICAgIGlmICghY29udGFjdEFkZHJlc3MpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgLy8gU2hvdyB0aGUgZnVsbCBhZGRyZXNzIHN0cmluZyB3aGVuIHRoZSB0ZXh0IGZpZWxkIGlzIGZvY3VzZWRcbiAgICBpZiAoaW5wdXRGb2N1c2VkKSB7XG4gICAgICByZXR1cm4gY29udGFjdEFkZHJlc3MgfHwgJyc7XG4gICAgfVxuXG4gICAgLy8gV2hlbiBhZGRyZXNzIGlzIGtub3duLCBzaG93IHRoZSBjb250YWN0J3MgbmFtZSBhbmQgdHJ1bmNhdGVkIGFkZHJlc3NcbiAgICBpZiAoY29udGFjdD8uaXNLbm93bikge1xuICAgICAgY29uc3QgYWRkcmVzcyA9IGlzVmFsaWRBZGRyZXNzKClcbiAgICAgICAgPyB0cnVuY2F0ZUFkZHJlc3MoY29udGFjdEFkZHJlc3MpXG4gICAgICAgIDogY29udGFjdEFkZHJlc3M7XG5cbiAgICAgIHJldHVybiBgJHt0cnVuY2F0ZU5hbWUoY29udGFjdC5uYW1lKX1cXG4ke2FkZHJlc3N9YDtcbiAgICB9XG5cbiAgICAvLyBGb3IgdW5rbm93biBhZGRyZXNzZXMsIGFsd2F5cyBzaG93IHRoZSBmdWxsIGFkZHJlc3NcbiAgICByZXR1cm4gY29udGFjdEFkZHJlc3M7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8U3RhY2sgc3g9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIHB4OiAyIH19PlxuICAgICAgPFN0YWNrIHJlZj17aW5wdXRXcmFwcGVyUmVmfSBzeD17eyBnYXA6IDEgfX0+XG4gICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgLy8gVG9vbHRpcCBkb2VzIG5vdCByZW5kZXIgYXQgYWxsIHdoZW4gdGl0bGUgaXMgZW1wdHkuIEZhbGxpbmcgYmFjayB0byBhIHNpbmdsZSBzcGFjZSBwcmV2ZW50cyB0aGUgaW5wdXQgZnJvbSByZS1yZW5kZXJpbmcgYW5kIGxvc2luZyBmb2N1cyB3aGVuIHVzZXJzIHN0YXJ0cyB0eXBpbmcuXG4gICAgICAgICAgdGl0bGU9e2NvbnRhY3RBZGRyZXNzID8/ICcgJ31cbiAgICAgICAgICBvcGVuPXtCb29sZWFuKCFpbnB1dEZvY3VzZWQgJiYgaW5wdXRIb3ZlcmVkICYmIGNvbnRhY3Q/LmlzS25vd24pfVxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgICAgICAgIGdhcDogMSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYWNlbWVudD1cInRvcC1lbmRcIlxuICAgICAgICAgIFBvcHBlclByb3BzPXt7XG4gICAgICAgICAgICBhbmNob3JFbDogaW5wdXRSZWYuY3VycmVudCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZW5kLWFkZHJlc3MtaW5wdXRcIlxuICAgICAgICAgICAgY29sb3I9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgIGZ1bGxXaWR0aFxuICAgICAgICAgICAgbGFiZWw9e3QoJ1NlbmRpbmcgVG8nKX1cbiAgICAgICAgICAgIGlucHV0TGFiZWxQcm9wcz17e1xuICAgICAgICAgICAgICBzeDogeyB0cmFuc2Zvcm06ICdub25lJywgZm9udFNpemU6ICdib2R5Mi5mb250U2l6ZScsIG1iOiAxIH0sXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgaW5wdXRSZWY9e2lucHV0UmVmfVxuICAgICAgICAgICAgSW5wdXRQcm9wcz17e1xuICAgICAgICAgICAgICBzeDoge1xuICAgICAgICAgICAgICAgIHB5OiAxLFxuICAgICAgICAgICAgICAgIHBsOiAyLFxuICAgICAgICAgICAgICAgIHByOiAxLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBlbmRBZG9ybm1lbnQ6IChcbiAgICAgICAgICAgICAgICA8SW5wdXRBZG9ybm1lbnRcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uPVwiZW5kXCJcbiAgICAgICAgICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICAgICAgICAgIG10OiAyLFxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnZW5kJyxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNPcGVuKCFpc0NvbnRhY3RzT3Blbil9XG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SW5wdXRIb3ZlcmVkKGZhbHNlKX1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjb250YWN0cy1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8VXNlclNlYXJjaEljb24gLz5cbiAgICAgICAgICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgICAgICAgICA8L0lucHV0QWRvcm5tZW50PlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0SW5wdXRGb2N1c2VkKHRydWUpO1xuICAgICAgICAgICAgICBzZXRJc09wZW4oZmFsc2UpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uQmx1cj17KCkgPT4gc2V0SW5wdXRGb2N1c2VkKGZhbHNlKX1cbiAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SW5wdXRIb3ZlcmVkKHRydWUpfVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRJbnB1dEhvdmVyZWQoZmFsc2UpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ0lucHV0IGFuIEFkZHJlc3MnKX1cbiAgICAgICAgICAgIG11bHRpbGluZVxuICAgICAgICAgICAgbWluUm93cz17Mn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICBvbkNoYW5nZShpZGVudGlmeUFkZHJlc3MoZS50YXJnZXQudmFsdWUudHJpbSgpKSk7XG4gICAgICAgICAgICAgIHNldEN1cnNvcihlLnRhcmdldC5zZWxlY3Rpb25TdGFydCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdmFsdWU9e2dldElucHV0RGlzcGxheVZhbHVlKCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICA8Q29udGFpbmVkRHJvcGRvd25cbiAgICAgICAgICBhbmNob3JFbD17aW5wdXRXcmFwcGVyUmVmfVxuICAgICAgICAgIGlzT3Blbj17aXNDb250YWN0c09wZW59XG4gICAgICAgICAgc2V0SXNPcGVuPXtzZXRJc09wZW59XG4gICAgICAgICAgY29udGFpbmVyUmVmPXtjb250YWluZXJSZWZ9XG4gICAgICAgID5cbiAgICAgICAgICA8Q29udGFjdFNlbGVjdFxuICAgICAgICAgICAgb25DaGFuZ2U9e2NoYW5nZUFuZENsb3NlRHJvcGRvd259XG4gICAgICAgICAgICBzZWxlY3RlZENvbnRhY3Q9e2NvbnRhY3R9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9Db250YWluZWREcm9wZG93bj5cbiAgICAgIDwvU3RhY2s+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBDb250YWN0IH0gZnJvbSAnQGF2YWxhYnMvdHlwZXMnO1xuaW1wb3J0IHsgTmV0d29ya1ZNVHlwZSB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtY2hhaW5zLXNkayc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnO1xuaW1wb3J0IHtcbiAgQm94LFxuICBTdGFjayxcbiAgVGFiLFxuICBUYWJQYW5lbCxcbiAgVGFicyxcbiAgVHlwb2dyYXBoeSxcbn0gZnJvbSAnQGF2YWxhYnMvY29yZS1rMi1jb21wb25lbnRzJztcblxuaW1wb3J0IHsgdXNlQWNjb3VudHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9BY2NvdW50c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZUNvbnRhY3RzQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvQ29udGFjdHNQcm92aWRlcic7XG5pbXBvcnQgeyB1c2VXYWxsZXRDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9XYWxsZXRQcm92aWRlcic7XG5pbXBvcnQgeyBBZGRyZXNzRHJvcGRvd25MaXN0IH0gZnJvbSAnLi9BZGRyZXNzRHJvcGRvd25MaXN0JztcbmltcG9ydCB7IHVzZUlkZW50aWZ5QWRkcmVzcyB9IGZyb20gJy4uL2hvb2tzL3VzZUlkZW50aWZ5QWRkcmVzcyc7XG5pbXBvcnQgeyB1c2VOZXR3b3JrQ29udGV4dCB9IGZyb20gJ0BzcmMvY29udGV4dHMvTmV0d29ya1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIEFkZHJlc3NEcm9wZG93bkxpc3RNeUFjY291bnRzLFxuICBNeUFjY291bnRDb250YWN0cyxcbn0gZnJvbSAnLi9BZGRyZXNzRHJvcGRvd25MaXN0TXlBY2NvdW50cyc7XG5pbXBvcnQgeyBpc1BjaGFpbk5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZVBjaGFpbk5ldHdvcmsnO1xuaW1wb3J0IHsgaXNOb25YUEhpc3RvcnlJdGVtIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL2hpc3RvcnkvdXRpbHMvaXNUeEhpc3RvcnlJdGVtJztcbmltcG9ydCB7IHN0cmlwQWRkcmVzc1ByZWZpeCB9IGZyb20gJ0BzcmMvdXRpbHMvc3RyaXBBZGRyZXNzUHJlZml4JztcbmltcG9ydCB7IGluZGV4T2YgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgaXNCaXRjb2luTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzQml0Y29pbk5ldHdvcmsnO1xuaW1wb3J0IHsgaXNYY2hhaW5OZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNBdmFsYW5jaGVYY2hhaW5OZXR3b3JrJztcbmltcG9ydCB7IEVUSEVSRVVNX0FERFJFU1MgfSBmcm9tICdAc3JjL3V0aWxzL2JyaWRnZVRyYW5zYWN0aW9uVXRpbHMnO1xuaW1wb3J0IHsgaXNTb2xhbmFOZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNTb2xhbmFOZXR3b3JrJztcblxuaW50ZXJmYWNlIENvbnRhY3RTZWxlY3RQcm9wcyB7XG4gIHNlbGVjdGVkQ29udGFjdD86IENvbnRhY3Q7XG4gIG9uQ2hhbmdlKGNvbnRhY3Q6IENvbnRhY3QsIHNlbGVjdGVkVGFiOiBzdHJpbmcpOiB2b2lkO1xufVxuXG5lbnVtIFRhYklkIHtcbiAgQUREUkVTU19CT09LLFxuICBSRUNFTlRfQUREUkVTU0VTLFxuICBNWV9BQ0NPVU5UUyxcbn1cblxuY29uc3QgTm9Db250YWN0c01lc3NhZ2UgPSAoeyBoZWFkZXIsIGRlc2NyaXB0aW9uIH0pID0+IChcbiAgPFN0YWNrIHN4PXt7IHB0OiAxMiwgZ2FwOiAxLCB0ZXh0QWxpZ246ICdjZW50ZXInLCB3aWR0aDogJzEwMCUnIH19PlxuICAgIDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJoNFwiIGNvbG9yPVwidGV4dC5wcmltYXJ5XCI+XG4gICAgICB7aGVhZGVyfVxuICAgIDwvVHlwb2dyYXBoeT5cbiAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBjb2xvcj1cInRleHQuc2Vjb25kYXJ5XCI+XG4gICAgICB7ZGVzY3JpcHRpb259XG4gICAgPC9UeXBvZ3JhcGh5PlxuICA8L1N0YWNrPlxuKTtcblxuZXhwb3J0IGNvbnN0IENvbnRhY3RTZWxlY3QgPSAoe1xuICBvbkNoYW5nZSxcbiAgc2VsZWN0ZWRDb250YWN0LFxufTogQ29udGFjdFNlbGVjdFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgY29uc3QgaWRlbnRpZnlBZGRyZXNzID0gdXNlSWRlbnRpZnlBZGRyZXNzKCk7XG4gIGNvbnN0IHsgZ2V0VHJhbnNhY3Rpb25IaXN0b3J5IH0gPSB1c2VXYWxsZXRDb250ZXh0KCk7XG4gIGNvbnN0IHtcbiAgICBhY2NvdW50czoge1xuICAgICAgaW1wb3J0ZWQ6IGltcG9ydGVkQWNjb3VudHMsXG4gICAgICBwcmltYXJ5OiBwcmltYXJ5QWNjb3VudHMsXG4gICAgICBhY3RpdmU6IGFjdGl2ZUFjY291bnQsXG4gICAgfSxcbiAgfSA9IHVzZUFjY291bnRzQ29udGV4dCgpO1xuICBjb25zdCB7IGNvbnRhY3RzIH0gPSB1c2VDb250YWN0c0NvbnRleHQoKTtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuICBjb25zdCBbc2VsZWN0ZWRUYWIsIHNldFNlbGVjdGVkVGFiXSA9IHVzZVN0YXRlKFRhYklkLkFERFJFU1NfQk9PSyk7XG4gIGNvbnN0IFtoaXN0b3J5Q29udGFjdHMsIHNldEhpc3RvcnlDb250YWN0c10gPSB1c2VTdGF0ZTxDb250YWN0W10+KFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbmV0d29yaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBnZXRUcmFuc2FjdGlvbkhpc3RvcnkoKS50aGVuKChoaXN0b3J5KSA9PiB7XG4gICAgICBjb25zdCBmaWx0ZXJlZEhpc3RvcnkgPSBoaXN0b3J5LmZpbHRlcigodHgsIGluZGV4LCBzZWxmKSA9PiB7XG4gICAgICAgIGlmICghdHguaXNTZW5kZXIgfHwgKGlzTm9uWFBIaXN0b3J5SXRlbSh0eCkgJiYgdHguaXNDb250cmFjdENhbGwpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGZpbHRlciBvdXQgZHVwZSB0byBhZGRyZXNzZXNcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHRlbXApID0+IHRlbXAudG8gPT09IHR4LnRvKSAmJlxuICAgICAgICAgIHR4LnRvICE9PSBFVEhFUkVVTV9BRERSRVNTXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29udGFjdEhpc3RvcnkgPSBmaWx0ZXJlZEhpc3RvcnkucmVkdWNlKChhY2MsIHR4KSA9PiB7XG4gICAgICAgIGNvbnN0IGFkZHJlc3NJZGVudGl0aWVzID0gW2lkZW50aWZ5QWRkcmVzcyh0eC50byldO1xuXG4gICAgICAgIGFkZHJlc3NJZGVudGl0aWVzLmZvckVhY2goKGlkZW50aXR5KSA9PiB7XG4gICAgICAgICAgY29uc3QgYWRkcmVzc1RvQ2hlY2sgPSBpc0JpdGNvaW5OZXR3b3JrKG5ldHdvcmspXG4gICAgICAgICAgICA/IGlkZW50aXR5LmFkZHJlc3NCVENcbiAgICAgICAgICAgIDogaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspIHx8IGlzWGNoYWluTmV0d29yayhuZXR3b3JrKVxuICAgICAgICAgICAgICA/IGlkZW50aXR5LmFkZHJlc3NYUFxuICAgICAgICAgICAgICA6IGlkZW50aXR5LmFkZHJlc3M7XG5cbiAgICAgICAgICBjb25zdCB1c2VyQWRkcmVzcyA9IGlzQml0Y29pbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgICAgID8gYWN0aXZlQWNjb3VudD8uYWRkcmVzc0JUQ1xuICAgICAgICAgICAgOiBpc1BjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgICAgICAgPyBzdHJpcEFkZHJlc3NQcmVmaXgoYWN0aXZlQWNjb3VudD8uYWRkcmVzc1BWTSA/PyAnJylcbiAgICAgICAgICAgICAgOiBpc1hjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgICAgICAgICA/IHN0cmlwQWRkcmVzc1ByZWZpeChhY3RpdmVBY2NvdW50Py5hZGRyZXNzQVZNID8/ICcnKVxuICAgICAgICAgICAgICAgIDogYWN0aXZlQWNjb3VudD8uYWRkcmVzc0M7XG5cbiAgICAgICAgICBjb25zdCBhZGRyZXNzZXNJbkxpc3QgPSBhY2MubWFwKCh2YWx1ZSkgPT5cbiAgICAgICAgICAgIGlzQml0Y29pbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgICAgICAgPyB2YWx1ZS5hZGRyZXNzQlRDXG4gICAgICAgICAgICAgIDogaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspIHx8IGlzWGNoYWluTmV0d29yayhuZXR3b3JrKVxuICAgICAgICAgICAgICAgID8gdmFsdWUuYWRkcmVzc1hQXG4gICAgICAgICAgICAgICAgOiB2YWx1ZS5hZGRyZXNzLFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaW5kZXhPZihhZGRyZXNzZXNJbkxpc3QsIGFkZHJlc3NUb0NoZWNrKSA9PT0gLTEgJiZcbiAgICAgICAgICAgIHVzZXJBZGRyZXNzICE9PSBhZGRyZXNzVG9DaGVja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYWNjLnB1c2goaWRlbnRpdHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIFtdIGFzIENvbnRhY3RbXSk7XG4gICAgICBzZXRIaXN0b3J5Q29udGFjdHMoY29udGFjdEhpc3RvcnkpO1xuICAgIH0pO1xuICB9LCBbXG4gICAgYWN0aXZlQWNjb3VudD8uYWRkcmVzc0FWTSxcbiAgICBhY3RpdmVBY2NvdW50Py5hZGRyZXNzQlRDLFxuICAgIGFjdGl2ZUFjY291bnQ/LmFkZHJlc3NDLFxuICAgIGFjdGl2ZUFjY291bnQ/LmFkZHJlc3NQVk0sXG4gICAgZ2V0VHJhbnNhY3Rpb25IaXN0b3J5LFxuICAgIGlkZW50aWZ5QWRkcmVzcyxcbiAgICBuZXR3b3JrLFxuICBdKTtcblxuICBjb25zdCBmb3JtYXR0ZWRBY2NvdW50cyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGZvcm1hdHRlZFByaW1hcnk6IE15QWNjb3VudENvbnRhY3RzID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhwcmltYXJ5QWNjb3VudHMpLmZvckVhY2goKHdhbGxldElkKSA9PiB7XG4gICAgICBjb25zdCB3YWxsZXRBY2NvdW50ID0gcHJpbWFyeUFjY291bnRzW3dhbGxldElkXTtcbiAgICAgIGlmICghd2FsbGV0QWNjb3VudCB8fCAhd2FsbGV0QWNjb3VudC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gd2FsbGV0QWNjb3VudC5tYXAoXG4gICAgICAgICh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgYWRkcmVzc0MsXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICBhZGRyZXNzQlRDLFxuICAgICAgICAgIGFkZHJlc3NQVk0sXG4gICAgICAgICAgYWRkcmVzc0FWTSxcbiAgICAgICAgICBhZGRyZXNzU1ZNLFxuICAgICAgICB9KSA9PiAoe1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGFkZHJlc3M6IG5ldHdvcms/LnZtTmFtZSA9PSBOZXR3b3JrVk1UeXBlLkVWTSA/IGFkZHJlc3NDIDogJycsXG4gICAgICAgICAgYWRkcmVzc0JUQzpcbiAgICAgICAgICAgIG5ldHdvcms/LnZtTmFtZSA9PT0gTmV0d29ya1ZNVHlwZS5CSVRDT0lOID8gYWRkcmVzc0JUQyA6ICcnLFxuICAgICAgICAgIGFkZHJlc3NYUDpcbiAgICAgICAgICAgIGlzUGNoYWluTmV0d29yayhuZXR3b3JrKSAmJiBhZGRyZXNzUFZNXG4gICAgICAgICAgICAgID8gc3RyaXBBZGRyZXNzUHJlZml4KGFkZHJlc3NQVk0pXG4gICAgICAgICAgICAgIDogaXNYY2hhaW5OZXR3b3JrKG5ldHdvcmspICYmIGFkZHJlc3NBVk1cbiAgICAgICAgICAgICAgICA/IHN0cmlwQWRkcmVzc1ByZWZpeChhZGRyZXNzQVZNKVxuICAgICAgICAgICAgICAgIDogJycsXG4gICAgICAgICAgYWRkcmVzc1NWTTogbmV0d29yayAmJiBpc1NvbGFuYU5ldHdvcmsobmV0d29yaykgPyBhZGRyZXNzU1ZNIDogJycsXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICBpc0tub3duOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgICBmb3JtYXR0ZWRQcmltYXJ5W3dhbGxldElkXSA9IHJlc3VsdDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGltcG9ydGVkQWNjb3VudFRvUHJlcCA9IE9iamVjdC52YWx1ZXMoaW1wb3J0ZWRBY2NvdW50cyk7XG4gICAgaWYgKCFpbXBvcnRlZEFjY291bnRUb1ByZXAubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZm9ybWF0dGVkUHJpbWFyeTtcbiAgICB9XG5cbiAgICBjb25zdCBmb3JtYXR0ZWRJbXBvcnRlZCA9IGltcG9ydGVkQWNjb3VudFRvUHJlcD8ubWFwKFxuICAgICAgKHtcbiAgICAgICAgaWQsXG4gICAgICAgIGFkZHJlc3NDLFxuICAgICAgICBuYW1lLFxuICAgICAgICBhZGRyZXNzQlRDLFxuICAgICAgICBhZGRyZXNzUFZNLFxuICAgICAgICBhZGRyZXNzQVZNLFxuICAgICAgICBhZGRyZXNzU1ZNLFxuICAgICAgfSkgPT4gKHtcbiAgICAgICAgaWQsXG4gICAgICAgIGFkZHJlc3M6IG5ldHdvcms/LnZtTmFtZSA9PSBOZXR3b3JrVk1UeXBlLkVWTSA/IGFkZHJlc3NDIDogJycsXG4gICAgICAgIGFkZHJlc3NCVEM6XG4gICAgICAgICAgbmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkJJVENPSU4gJiYgYWRkcmVzc0JUQ1xuICAgICAgICAgICAgPyBhZGRyZXNzQlRDXG4gICAgICAgICAgICA6ICcnLFxuICAgICAgICBhZGRyZXNzWFA6XG4gICAgICAgICAgaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspICYmIGFkZHJlc3NQVk1cbiAgICAgICAgICAgID8gc3RyaXBBZGRyZXNzUHJlZml4KGFkZHJlc3NQVk0pXG4gICAgICAgICAgICA6IGlzWGNoYWluTmV0d29yayhuZXR3b3JrKSAmJiBhZGRyZXNzQVZNXG4gICAgICAgICAgICAgID8gc3RyaXBBZGRyZXNzUHJlZml4KGFkZHJlc3NBVk0pXG4gICAgICAgICAgICAgIDogJycsXG4gICAgICAgIGFkZHJlc3NTVk06IG5ldHdvcmsgJiYgaXNTb2xhbmFOZXR3b3JrKG5ldHdvcmspID8gYWRkcmVzc1NWTSA6ICcnLFxuICAgICAgICBuYW1lLFxuICAgICAgICBpc0tub3duOiB0cnVlLFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5mb3JtYXR0ZWRQcmltYXJ5LFxuICAgICAgLi4uKGZvcm1hdHRlZEltcG9ydGVkLmxlbmd0aCA/IHsgaW1wb3J0ZWQ6IGZvcm1hdHRlZEltcG9ydGVkIH0gOiB7fSksXG4gICAgfTtcbiAgfSwgW2ltcG9ydGVkQWNjb3VudHMsIG5ldHdvcmssIHByaW1hcnlBY2NvdW50c10pO1xuXG4gIGNvbnN0IGZvcm1hdHRlZENvbnRhY3RzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGNvbnRhY3RzXG4gICAgICAuZmlsdGVyKChjb250YWN0KSA9PiB7XG4gICAgICAgIGlmIChuZXR3b3JrPy52bU5hbWUgPT09IE5ldHdvcmtWTVR5cGUuRVZNKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRhY3QuYWRkcmVzcztcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkJJVENPSU4pIHtcbiAgICAgICAgICByZXR1cm4gY29udGFjdC5hZGRyZXNzQlRDO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1BjaGFpbk5ldHdvcmsobmV0d29yaykgfHwgaXNYY2hhaW5OZXR3b3JrKG5ldHdvcmspKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRhY3QuYWRkcmVzc1hQO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1NvbGFuYU5ldHdvcmsobmV0d29yaykpIHtcbiAgICAgICAgICByZXR1cm4gY29udGFjdC5hZGRyZXNzU1ZNO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLm1hcCgoY29udGFjdCkgPT4gKHtcbiAgICAgICAgLi4uY29udGFjdCxcbiAgICAgICAgYWRkcmVzczogbmV0d29yaz8udm1OYW1lID09IE5ldHdvcmtWTVR5cGUuRVZNID8gY29udGFjdC5hZGRyZXNzIDogJycsXG4gICAgICAgIGFkZHJlc3NCVEM6XG4gICAgICAgICAgbmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkJJVENPSU4gPyBjb250YWN0LmFkZHJlc3NCVEMgOiAnJyxcbiAgICAgICAgYWRkcmVzc1BWTTogaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspID8gY29udGFjdC5hZGRyZXNzWFAgOiAnJyxcbiAgICAgICAgYWRkcmVzc0FWTTogaXNYY2hhaW5OZXR3b3JrKG5ldHdvcmspID8gY29udGFjdC5hZGRyZXNzWFAgOiAnJyxcbiAgICAgICAgYWRkcmVzc1NWTTpcbiAgICAgICAgICBuZXR3b3JrICYmIGlzU29sYW5hTmV0d29yayhuZXR3b3JrKSA/IGNvbnRhY3QuYWRkcmVzc1NWTSA6ICcnLFxuICAgICAgICBpc0tub3duOiB0cnVlLFxuICAgICAgfSkpO1xuICB9LCBbY29udGFjdHMsIG5ldHdvcmtdKTtcblxuICByZXR1cm4gKFxuICAgIDxTdGFjayBzeD17eyB3aWR0aDogJzEwMCUnLCBweDogMiwgcHQ6IDMsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgPFRhYnNcbiAgICAgICAgdmFyaWFudD1cImZ1bGxXaWR0aFwiXG4gICAgICAgIGluZGljYXRvckNvbG9yPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgdmFsdWU9e3NlbGVjdGVkVGFifVxuICAgICAgICBvbkNoYW5nZT17KF8sIHRhYikgPT4gc2V0U2VsZWN0ZWRUYWIodGFiKX1cbiAgICAgICAgc3g9e3sgZmxleFNocmluazogMCB9fVxuICAgICAgPlxuICAgICAgICA8VGFiXG4gICAgICAgICAgdmFsdWU9e1RhYklkLkFERFJFU1NfQk9PS31cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlbmQtYWRkcmVzcy1ib29rLXRhYlwiXG4gICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgbGFiZWw9e3QoJ0FkZHJlc3MgQm9vaycpfVxuICAgICAgICAvPlxuICAgICAgICA8VGFiXG4gICAgICAgICAgdmFsdWU9e1RhYklkLlJFQ0VOVF9BRERSRVNTRVN9XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZW5kLXJlY2VudC1jb250YWN0LXRhYlwiXG4gICAgICAgICAgdGFiSW5kZXg9ezF9XG4gICAgICAgICAgbGFiZWw9e3QoJ1JlY2VudHMnKX1cbiAgICAgICAgLz5cbiAgICAgICAgPFRhYlxuICAgICAgICAgIHZhbHVlPXtUYWJJZC5NWV9BQ0NPVU5UU31cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInNlbmQtbXktYWNjb3VudHMtdGFiXCJcbiAgICAgICAgICB0YWJJbmRleD17Mn1cbiAgICAgICAgICBsYWJlbD17dCgnTXkgQWNjb3VudHMnKX1cbiAgICAgICAgLz5cbiAgICAgIDwvVGFicz5cbiAgICAgIDxCb3hcbiAgICAgICAgc3g9e3tcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGJvcmRlclRvcDogMSxcbiAgICAgICAgICBib3JkZXJDb2xvcjogJ2RpdmlkZXInLFxuICAgICAgICAgIG10OiAtMC4yNSwgLy8gTW92ZSB0aGUgY29udGFpbmVyIHVwLCBqdXN0IGJlbG93IHRoZSB0YWIgaW5kaWNhdG9yLlxuICAgICAgICAgIHB0OiAwLjc1LCAvLyBUaGVuIGFkZCBzb21lIHBhZGRpbmcgYXQgdGhlIHRvcCB0byBlcXVhbGl6ZSB0aGUgbWlzc2VkIHNwYWNlLlxuICAgICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFRhYlBhbmVsXG4gICAgICAgICAgdmFsdWU9e3NlbGVjdGVkVGFifVxuICAgICAgICAgIGluZGV4PXtUYWJJZC5BRERSRVNTX0JPT0t9XG4gICAgICAgICAgc3g9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgIGhlaWdodDogc2VsZWN0ZWRUYWIgPT09IFRhYklkLkFERFJFU1NfQk9PSyA/ICcxMDAlJyA6IDAsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxBZGRyZXNzRHJvcGRvd25MaXN0XG4gICAgICAgICAgICBjb250YWN0cz17Zm9ybWF0dGVkQ29udGFjdHN9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGNvbnRhY3QpID0+IG9uQ2hhbmdlKGNvbnRhY3QsICdhZGRyZXNzQm9vaycpfVxuICAgICAgICAgICAgc2VsZWN0ZWRDb250YWN0PXtzZWxlY3RlZENvbnRhY3R9XG4gICAgICAgICAgICBhZGRDb250YWN0XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgPFRhYlBhbmVsXG4gICAgICAgICAgdmFsdWU9e3NlbGVjdGVkVGFifVxuICAgICAgICAgIGluZGV4PXtUYWJJZC5SRUNFTlRfQUREUkVTU0VTfVxuICAgICAgICAgIHN4PXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICBoZWlnaHQ6IHNlbGVjdGVkVGFiID09PSBUYWJJZC5SRUNFTlRfQUREUkVTU0VTID8gJzEwMCUnIDogMCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge2hpc3RvcnlDb250YWN0cy5sZW5ndGggPiAwID8gKFxuICAgICAgICAgICAgPEFkZHJlc3NEcm9wZG93bkxpc3RcbiAgICAgICAgICAgICAgY29udGFjdHM9e2hpc3RvcnlDb250YWN0c31cbiAgICAgICAgICAgICAgc2VsZWN0ZWRDb250YWN0PXtzZWxlY3RlZENvbnRhY3R9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoY29udGFjdCkgPT4gb25DaGFuZ2UoY29udGFjdCwgJ3JlY2VudHMnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxOb0NvbnRhY3RzTWVzc2FnZVxuICAgICAgICAgICAgICBoZWFkZXI9e3QoJ05vIFJlY2VudCBSZWNpcGllbnRzJyl9XG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uPXt0KCdFbnRlciB0aGUgYWRkcmVzcyBpbiB0aGUgYWJvdmUgZmllbGQnKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgPFRhYlBhbmVsXG4gICAgICAgICAgdmFsdWU9e3NlbGVjdGVkVGFifVxuICAgICAgICAgIGluZGV4PXtUYWJJZC5NWV9BQ0NPVU5UU31cbiAgICAgICAgICBzeD17e1xuICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgaGVpZ2h0OiBzZWxlY3RlZFRhYiA9PT0gVGFiSWQuTVlfQUNDT1VOVFMgPyAnMTAwJScgOiAwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8QWRkcmVzc0Ryb3Bkb3duTGlzdE15QWNjb3VudHNcbiAgICAgICAgICAgIGNvbnRhY3RzPXtmb3JtYXR0ZWRBY2NvdW50c31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoY29udGFjdCkgPT4gb25DaGFuZ2UoY29udGFjdCwgJ2FjY291bnRzJyl9XG4gICAgICAgICAgICBzZWxlY3RlZENvbnRhY3Q9e3NlbGVjdGVkQ29udGFjdH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1RhYlBhbmVsPlxuICAgICAgPC9Cb3g+XG4gICAgPC9TdGFjaz5cbiAgKTtcbn07XG4iLCJpbXBvcnQgdHlwZSB7IENvbnRhY3QgfSBmcm9tICdAYXZhbGFicy90eXBlcyc7XG5pbXBvcnQgeyB1c2VBY2NvdW50c0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FjY291bnRzUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQ29udGFjdHNDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9Db250YWN0c1Byb3ZpZGVyJztcbmltcG9ydCB7IHVzZU5ldHdvcmtDb250ZXh0IH0gZnJvbSAnQHNyYy9jb250ZXh0cy9OZXR3b3JrUHJvdmlkZXInO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBpc0JpdGNvaW4gfSBmcm9tICdAc3JjL3V0aWxzL2lzQml0Y29pbic7XG5pbXBvcnQgeyBpc1BjaGFpbk5ldHdvcmsgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvbmV0d29yay91dGlscy9pc0F2YWxhbmNoZVBjaGFpbk5ldHdvcmsnO1xuaW1wb3J0IHsgaXNYY2hhaW5OZXR3b3JrIH0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL25ldHdvcmsvdXRpbHMvaXNBdmFsYW5jaGVYY2hhaW5OZXR3b3JrJztcbmltcG9ydCB7IGNvcnJlY3RBZGRyZXNzQnlQcmVmaXggfSBmcm9tICcuLi91dGlscy9jb3JyZWN0QWRkcmVzc0J5UHJlZml4JztcbmltcG9ydCB7IGlzU29sYW5hTmV0d29yayB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9zZXJ2aWNlcy9uZXR3b3JrL3V0aWxzL2lzU29sYW5hTmV0d29yayc7XG5cbmNvbnN0IFVOU0FWRURfQ09OVEFDVF9CQVNFID0ge1xuICBpZDogJycsXG4gIG5hbWU6ICdVbnNhdmVkIEFkZHJlc3MnLFxuICBpc0tub3duOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBjb25zdCB1c2VJZGVudGlmeUFkZHJlc3MgPSAoKSA9PiB7XG4gIGNvbnN0IHsgY29udGFjdHMgfSA9IHVzZUNvbnRhY3RzQ29udGV4dCgpO1xuICBjb25zdCB7IGFsbEFjY291bnRzIH0gPSB1c2VBY2NvdW50c0NvbnRleHQoKTtcbiAgY29uc3QgeyBuZXR3b3JrIH0gPSB1c2VOZXR3b3JrQ29udGV4dCgpO1xuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVzIGlmIGFuIGFkZHJlc3MgZXhpc3RzIGluIHRoZSBhY2NvdW50cyBvciBjb250YWN0c1xuICAgKi9cbiAgY29uc3QgaWRlbnRpZnlBZGRyZXNzID0gdXNlQ2FsbGJhY2soXG4gICAgKGFkZHJlc3M6IHN0cmluZyk6IENvbnRhY3QgPT4ge1xuICAgICAgaWYgKCFhZGRyZXNzKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLlVOU0FWRURfQ09OVEFDVF9CQVNFLFxuICAgICAgICAgIGFkZHJlc3M6ICcnLFxuICAgICAgICAgIGFkZHJlc3NCVEM6ICcnLFxuICAgICAgICAgIGFkZHJlc3NYUDogJycsXG4gICAgICAgICAgYWRkcmVzc1NWTTogJycsXG4gICAgICAgIH07XG4gICAgICBjb25zdCBhZGRyZXNzTG93ZXJDYXNlID0gYWRkcmVzcy50b0xvd2VyQ2FzZSgpO1xuICAgICAgZm9yIChjb25zdCBjb250YWN0IG9mIGNvbnRhY3RzKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjb250YWN0LmFkZHJlc3MudG9Mb3dlckNhc2UoKSA9PT0gYWRkcmVzc0xvd2VyQ2FzZSB8fFxuICAgICAgICAgIGNvbnRhY3QuYWRkcmVzc0JUQz8udG9Mb3dlckNhc2UoKSA9PT0gYWRkcmVzc0xvd2VyQ2FzZSB8fFxuICAgICAgICAgIGBwLSR7Y29udGFjdC5hZGRyZXNzWFA/LnRvTG93ZXJDYXNlKCl9YCA9PT1cbiAgICAgICAgICAgIGNvcnJlY3RBZGRyZXNzQnlQcmVmaXgoYWRkcmVzc0xvd2VyQ2FzZSwgJ3AtJykgfHxcbiAgICAgICAgICBgeC0ke2NvbnRhY3QuYWRkcmVzc1hQPy50b0xvd2VyQ2FzZSgpfWAgPT09XG4gICAgICAgICAgICBjb3JyZWN0QWRkcmVzc0J5UHJlZml4KGFkZHJlc3NMb3dlckNhc2UsICd4LScpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IGFkZHJlc3NUb1VzZSA9IGlzQml0Y29pbihuZXR3b3JrKVxuICAgICAgICAgICAgPyB7IGFkZHJlc3NCVEM6IGFkZHJlc3MsIGFkZHJlc3M6ICcnLCBhZGRyZXNzUFZNOiAnJyB9XG4gICAgICAgICAgICA6IGlzUGNoYWluTmV0d29yayhuZXR3b3JrKSB8fCBpc1hjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgICAgICAgPyB7IGFkZHJlc3NYUDogYWRkcmVzcywgYWRkcmVzczogJycsIGFkZHJlc3NCVEM6ICcnIH1cbiAgICAgICAgICAgICAgOiB7IGFkZHJlc3M6IGFkZHJlc3MgfTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IGNvbnRhY3QuaWQsXG4gICAgICAgICAgICAuLi5hZGRyZXNzVG9Vc2UsXG4gICAgICAgICAgICBuYW1lOiBjb250YWN0Lm5hbWUsXG4gICAgICAgICAgICBpc0tub3duOiB0cnVlLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgYWNjb3VudCBvZiBhbGxBY2NvdW50cykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgYWNjb3VudC5hZGRyZXNzQy50b0xvd2VyQ2FzZSgpID09PSBhZGRyZXNzTG93ZXJDYXNlIHx8XG4gICAgICAgICAgYWNjb3VudC5hZGRyZXNzQlRDPy50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBhZGRyZXNzTG93ZXJDYXNlIHx8XG4gICAgICAgICAgYWNjb3VudC5hZGRyZXNzUFZNPy50b0xvY2FsZUxvd2VyQ2FzZSgpID09PVxuICAgICAgICAgICAgY29ycmVjdEFkZHJlc3NCeVByZWZpeChhZGRyZXNzTG93ZXJDYXNlLCAncC0nKSB8fFxuICAgICAgICAgIGFjY291bnQuYWRkcmVzc0FWTT8udG9Mb3dlckNhc2UoKSA9PT1cbiAgICAgICAgICAgIGNvcnJlY3RBZGRyZXNzQnlQcmVmaXgoYWRkcmVzc0xvd2VyQ2FzZSwgJ3gtJykgfHxcbiAgICAgICAgICBhY2NvdW50LmFkZHJlc3NTVk0/LnRvTG93ZXJDYXNlKCkgPT09IGFkZHJlc3NMb3dlckNhc2VcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3QgYWRkcmVzc1RvVXNlID1cbiAgICAgICAgICAgIG5ldHdvcmsgJiYgaXNTb2xhbmFOZXR3b3JrKG5ldHdvcmspXG4gICAgICAgICAgICAgID8geyBhZGRyZXNzU1ZNOiBhY2NvdW50LmFkZHJlc3NTVk0sIGFkZHJlc3M6ICcnIH1cbiAgICAgICAgICAgICAgOiBpc0JpdGNvaW4obmV0d29yaylcbiAgICAgICAgICAgICAgICA/IHsgYWRkcmVzc0JUQzogYWNjb3VudC5hZGRyZXNzQlRDLCBhZGRyZXNzOiAnJyB9XG4gICAgICAgICAgICAgICAgOiBpc1BjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NYUDogYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzQlRDOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgOiBpc1hjaGFpbk5ldHdvcmsobmV0d29yaylcbiAgICAgICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzWFA6IGFkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NCVEM6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgOiB7IGFkZHJlc3M6IGFjY291bnQuYWRkcmVzc0MgfTtcbiAgICAgICAgICByZXR1cm4geyBpZDogJycsIC4uLmFkZHJlc3NUb1VzZSwgbmFtZTogYWNjb3VudC5uYW1lLCBpc0tub3duOiB0cnVlIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlzU29sYW5hTmV0d29yayhuZXR3b3JrKVxuICAgICAgICA/IHtcbiAgICAgICAgICAgIC4uLlVOU0FWRURfQ09OVEFDVF9CQVNFLFxuICAgICAgICAgICAgYWRkcmVzczogJycsXG4gICAgICAgICAgICBhZGRyZXNzWFA6ICcnLFxuICAgICAgICAgICAgYWRkcmVzc0JUQzogJycsXG4gICAgICAgICAgICBhZGRyZXNzU1ZNOiBhZGRyZXNzLFxuICAgICAgICAgIH1cbiAgICAgICAgOiBpc0JpdGNvaW4obmV0d29yaylcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgLi4uVU5TQVZFRF9DT05UQUNUX0JBU0UsXG4gICAgICAgICAgICAgIGFkZHJlc3M6ICcnLFxuICAgICAgICAgICAgICBhZGRyZXNzQlRDOiBhZGRyZXNzLFxuICAgICAgICAgICAgICBhZGRyZXNzWFA6ICcnLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIDogaXNQY2hhaW5OZXR3b3JrKG5ldHdvcmspIHx8IGlzWGNoYWluTmV0d29yayhuZXR3b3JrKVxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgLi4uVU5TQVZFRF9DT05UQUNUX0JBU0UsXG4gICAgICAgICAgICAgICAgYWRkcmVzczogJycsXG4gICAgICAgICAgICAgICAgYWRkcmVzc0JUQzogJycsXG4gICAgICAgICAgICAgICAgYWRkcmVzc1hQOiBhZGRyZXNzLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAuLi5VTlNBVkVEX0NPTlRBQ1RfQkFTRSxcbiAgICAgICAgICAgICAgICBhZGRyZXNzLFxuICAgICAgICAgICAgICAgIGFkZHJlc3NCVEM6ICcnLFxuICAgICAgICAgICAgICAgIGFkZHJlc3NYUDogJycsXG4gICAgICAgICAgICAgIH07XG4gICAgfSxcbiAgICBbYWxsQWNjb3VudHMsIGNvbnRhY3RzLCBuZXR3b3JrXSxcbiAgKTtcblxuICByZXR1cm4gaWRlbnRpZnlBZGRyZXNzO1xufTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgU2VuZEVycm9yTWVzc2FnZSB9IGZyb20gJ0BzcmMvdXRpbHMvc2VuZC9tb2RlbHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdGlvbkNvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0Nvbm5lY3Rpb25Qcm92aWRlcic7XG5cbmltcG9ydCB7XG4gIGJ1aWxkVHgsXG4gIGlzRXJjMTE1NVNlbmQsXG4gIGlzRXJjMjBTZW5kLFxuICBpc0VyYzcyMVNlbmQsXG4gIGlzTmF0aXZlU2VuZCxcbn0gZnJvbSAnLi4vLi4vdXRpbHMvYnVpbGRTZW5kVHgnO1xuaW1wb3J0IHtcbiAgRXJjMjBTZW5kT3B0aW9ucyxcbiAgTmF0aXZlU2VuZE9wdGlvbnMsXG4gIE5mdFNlbmRPcHRpb25zLFxuICBTZW5kT3B0aW9ucyxcbn0gZnJvbSAnLi4vLi4vbW9kZWxzJztcbmltcG9ydCB7IFNlbmRBZGFwdGVyRVZNIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUnBjTWV0aG9kLCBUb2tlblR5cGUgfSBmcm9tICdAYXZhbGFicy92bS1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgc3RyaW5nVG9CaWdpbnQgfSBmcm9tICdAc3JjL3V0aWxzL3N0cmluZ1RvQmlnaW50JztcblxuZXhwb3J0IGNvbnN0IHVzZUVWTVNlbmQ6IFNlbmRBZGFwdGVyRVZNID0gKHtcbiAgY2hhaW5JZCxcbiAgZnJvbSxcbiAgcHJvdmlkZXIsXG4gIG1heEZlZSxcbiAgbmF0aXZlVG9rZW4sXG59KSA9PiB7XG4gIGNvbnN0IHsgcmVxdWVzdCB9ID0gdXNlQ29ubmVjdGlvbkNvbnRleHQoKTtcblxuICBjb25zdCBbaXNTZW5kaW5nLCBzZXRJc1NlbmRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNWYWxpZGF0aW5nLCBzZXRJc1ZhbGlkYXRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbbWF4QW1vdW50LCBzZXRNYXhBbW91bnRdID0gdXNlU3RhdGUoJzAnKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxTZW5kRXJyb3JNZXNzYWdlPigpO1xuXG4gIGNvbnN0IGdldFR4ID0gdXNlQ2FsbGJhY2soXG4gICAgKG9wdGlvbnM6IFNlbmRPcHRpb25zKSA9PiBidWlsZFR4KGZyb20sIHByb3ZpZGVyLCBvcHRpb25zKSxcbiAgICBbZnJvbSwgcHJvdmlkZXJdLFxuICApO1xuXG4gIGNvbnN0IHNlbmQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAob3B0aW9uczogU2VuZE9wdGlvbnMpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldElzU2VuZGluZyh0cnVlKTtcblxuICAgICAgICBjb25zdCB0eCA9IGF3YWl0IGdldFR4KG9wdGlvbnMpO1xuXG4gICAgICAgIGNvbnN0IGhhc2ggPSBhd2FpdCByZXF1ZXN0KHtcbiAgICAgICAgICBtZXRob2Q6IFJwY01ldGhvZC5FVEhfU0VORF9UUkFOU0FDVElPTixcbiAgICAgICAgICBwYXJhbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLi4udHgsXG4gICAgICAgICAgICAgIGNoYWluSWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBoYXNoO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0SXNTZW5kaW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtyZXF1ZXN0LCBjaGFpbklkLCBnZXRUeF0sXG4gICk7XG5cbiAgY29uc3QgZ2V0R2FzTGltaXQgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAob3B0aW9uczogU2VuZE9wdGlvbnMpOiBQcm9taXNlPGJpZ2ludD4gPT4ge1xuICAgICAgY29uc3QgdHggPSBhd2FpdCBnZXRUeChvcHRpb25zKTtcblxuICAgICAgcmV0dXJuIHByb3ZpZGVyLmVzdGltYXRlR2FzKHR4KTtcbiAgICB9LFxuICAgIFtwcm92aWRlciwgZ2V0VHhdLFxuICApO1xuXG4gIGNvbnN0IHZhbGlkYXRlRXJjNzIxID0gdXNlQ2FsbGJhY2soXG4gICAgKHsgYWRkcmVzcyB9OiBOZnRTZW5kT3B0aW9ucykgPT4ge1xuICAgICAgaWYgKCFhZGRyZXNzKSB7XG4gICAgICAgIHNldEVycm9yKFNlbmRFcnJvck1lc3NhZ2UuQUREUkVTU19SRVFVSVJFRCk7XG4gICAgICB9IGVsc2UgaWYgKG5hdGl2ZVRva2VuLmJhbGFuY2UgPT09IDBuKSB7XG4gICAgICAgIHNldEVycm9yKFNlbmRFcnJvck1lc3NhZ2UuSU5TVUZGSUNJRU5UX0JBTEFOQ0VfRk9SX0ZFRSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbbmF0aXZlVG9rZW4uYmFsYW5jZV0sXG4gICk7XG5cbiAgY29uc3QgdmFsaWRhdGVFcmMxMTU1ID0gdXNlQ2FsbGJhY2soXG4gICAgKHsgYWRkcmVzcywgdG9rZW4gfTogTmZ0U2VuZE9wdGlvbnMpID0+IHtcbiAgICAgIGlmICghYWRkcmVzcykge1xuICAgICAgICBzZXRFcnJvcihTZW5kRXJyb3JNZXNzYWdlLkFERFJFU1NfUkVRVUlSRUQpO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi5iYWxhbmNlID09PSAwbikge1xuICAgICAgICBzZXRFcnJvcihTZW5kRXJyb3JNZXNzYWdlLklOU1VGRklDSUVOVF9CQUxBTkNFKTtcbiAgICAgIH0gZWxzZSBpZiAobmF0aXZlVG9rZW4uYmFsYW5jZSA9PT0gMG4pIHtcbiAgICAgICAgc2V0RXJyb3IoU2VuZEVycm9yTWVzc2FnZS5JTlNVRkZJQ0lFTlRfQkFMQU5DRV9GT1JfRkVFKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtuYXRpdmVUb2tlbi5iYWxhbmNlXSxcbiAgKTtcblxuICBjb25zdCB2YWxpZGF0ZU5hdGl2ZUFuZEVyYzIwID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKHtcbiAgICAgIGFkZHJlc3MsXG4gICAgICB0b2tlbixcbiAgICAgIGFtb3VudCxcbiAgICB9OiBOYXRpdmVTZW5kT3B0aW9ucyB8IEVyYzIwU2VuZE9wdGlvbnMpID0+IHtcbiAgICAgIC8vIEZvciBFUkMtMjAgYW5kIG5hdGl2ZSB0b2tlbnMsIHdlIHdhbnQgdG8ga25vdyB0aGUgbWF4LiB0cmFuc2ZlciBhbW91bnRcbiAgICAgIC8vIGV2ZW4gaWYgdGhlIHZhbGlkYXRpb24gYXMgYSB3aG9sZSBmYWlscyAoZS5nLiB1c2VyIGRpZCBub3QgcHJvdmlkZVxuICAgICAgLy8gdGhlIHRhcmdldCBhZGRyZXNzIHlldCkuXG4gICAgICBjb25zdCBhbW91bnRCaWdJbnQgPSBzdHJpbmdUb0JpZ2ludChhbW91bnQgfHwgJzAnLCB0b2tlbi5kZWNpbWFscyk7XG4gICAgICBjb25zdCBnYXNMaW1pdCA9IGF3YWl0IGdldEdhc0xpbWl0KHtcbiAgICAgICAgYWRkcmVzczogYWRkcmVzcyB8fCBmcm9tLCAvLyBnYXMgdXNlZCBmb3IgdHJhbnNmZXIgd2lsbCBiZSB0aGUgc2FtZSBubyBtYXR0ZXIgdGhlIHRhcmdldCBhZGRyZXNzXG4gICAgICAgIGFtb3VudDogYW1vdW50IHx8ICcwJywgLy8gdGhlIGFtb3VudCBkb2VzIG5vdCBjaGFuZ2UgdGhlIGdhcyBjb3N0c1xuICAgICAgICB0b2tlbixcbiAgICAgIH0gYXMgU2VuZE9wdGlvbnMpO1xuICAgICAgY29uc3QgdG90YWxGZWUgPSBnYXNMaW1pdCAqIG1heEZlZTtcbiAgICAgIGNvbnN0IHJlbWFpbmluZ0JhbGFuY2UgPSBuYXRpdmVUb2tlbi5iYWxhbmNlIC0gYW1vdW50QmlnSW50O1xuXG4gICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLk5BVElWRSkge1xuICAgICAgICBzZXRNYXhBbW91bnQoKG5hdGl2ZVRva2VuLmJhbGFuY2UgLSB0b3RhbEZlZSkudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgaWYgKHJlbWFpbmluZ0JhbGFuY2UgPCB0b3RhbEZlZSkge1xuICAgICAgICAgIHNldEVycm9yKFNlbmRFcnJvck1lc3NhZ2UuSU5TVUZGSUNJRU5UX0JBTEFOQ0VfRk9SX0ZFRSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5FUkMyMCkge1xuICAgICAgICBzZXRNYXhBbW91bnQodG9rZW4uYmFsYW5jZS50b1N0cmluZygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFhZGRyZXNzKSB7XG4gICAgICAgIHNldEVycm9yKFNlbmRFcnJvck1lc3NhZ2UuQUREUkVTU19SRVFVSVJFRCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFhbW91bnQpIHtcbiAgICAgICAgc2V0RXJyb3IoU2VuZEVycm9yTWVzc2FnZS5BTU9VTlRfUkVRVUlSRUQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChhbW91bnRCaWdJbnQgJiYgKGFtb3VudEJpZ0ludCA9PT0gMG4gfHwgYW1vdW50QmlnSW50IDwgMCkpIHtcbiAgICAgICAgc2V0RXJyb3IoU2VuZEVycm9yTWVzc2FnZS5BTU9VTlRfUkVRVUlSRUQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChhbW91bnRCaWdJbnQgJiYgdG9rZW4uYmFsYW5jZSA8IGFtb3VudEJpZ0ludCkge1xuICAgICAgICBzZXRFcnJvcihTZW5kRXJyb3JNZXNzYWdlLklOU1VGRklDSUVOVF9CQUxBTkNFKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2Zyb20sIGdldEdhc0xpbWl0LCBtYXhGZWUsIG5hdGl2ZVRva2VuLmJhbGFuY2VdLFxuICApO1xuXG4gIGNvbnN0IHZhbGlkYXRlID0gdXNlQ2FsbGJhY2soXG4gICAgYXN5bmMgKG9wdGlvbnM6IFNlbmRPcHRpb25zKSA9PiB7XG4gICAgICBjb25zdCB7IHRva2VuIH0gPSBvcHRpb25zO1xuXG4gICAgICBzZXRJc1ZhbGlkYXRpbmcodHJ1ZSk7XG4gICAgICBzZXRFcnJvcih1bmRlZmluZWQpO1xuXG4gICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgIHNldEVycm9yKFNlbmRFcnJvck1lc3NhZ2UuVE9LRU5fUkVRVUlSRUQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChpc0VyYzcyMVNlbmQob3B0aW9ucykpIHtcbiAgICAgICAgICB2YWxpZGF0ZUVyYzcyMShvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0VyYzExNTVTZW5kKG9wdGlvbnMpKSB7XG4gICAgICAgICAgdmFsaWRhdGVFcmMxMTU1KG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzTmF0aXZlU2VuZChvcHRpb25zKSB8fCBpc0VyYzIwU2VuZChvcHRpb25zKSkge1xuICAgICAgICAgIGF3YWl0IHZhbGlkYXRlTmF0aXZlQW5kRXJjMjAoXG4gICAgICAgICAgICBvcHRpb25zIGFzIE5hdGl2ZVNlbmRPcHRpb25zIHwgRXJjMjBTZW5kT3B0aW9ucyxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldEVycm9yKFNlbmRFcnJvck1lc3NhZ2UuVU5TVVBQT1JURURfVE9LRU4pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICBpZiAoISFlcnI/Lm1lc3NhZ2UgJiYgZXJyPy5tZXNzYWdlLmluY2x1ZGVzKCdpbnN1ZmZpY2llbnQgZnVuZHMnKSkge1xuICAgICAgICAgIHNldEVycm9yKFNlbmRFcnJvck1lc3NhZ2UuSU5TVUZGSUNJRU5UX0JBTEFOQ0UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gc2VuZCB0aG9zZSBlcnJvcnMgdG8gU2VudHJ5LFxuICAgICAgICAgIC8vIGFzIHRoZXknbGwgbGlrZWx5IGluY2x1ZGUgaWRlbnRpZmlhYmxlIGRhdGEgKGkuZS4gYWRkcmVzc2VzKS5cbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgc2V0RXJyb3IoU2VuZEVycm9yTWVzc2FnZS5VTktOT1dOX0VSUk9SKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0SXNWYWxpZGF0aW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFt2YWxpZGF0ZUVyYzExNTUsIHZhbGlkYXRlRXJjNzIxLCB2YWxpZGF0ZU5hdGl2ZUFuZEVyYzIwXSxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGVycm9yLFxuICAgIGlzU2VuZGluZyxcbiAgICBpc1ZhbGlkOiAhZXJyb3IsXG4gICAgaXNWYWxpZGF0aW5nLFxuICAgIG1heEFtb3VudCxcbiAgICBzZW5kLFxuICAgIHZhbGlkYXRlLFxuICB9O1xufTtcbiIsImltcG9ydCB7IHVzZVF1ZXJ5UGFyYW1zIH0gZnJvbSAnQHNyYy9ob29rcy91c2VRdWVyeVBhcmFtcyc7XG5cbmV4cG9ydCBjb25zdCB1c2VWYWxpZEFkZHJlc3NGcm9tUGFyYW1zID0gKFxuICB2YWxpZGF0ZUFkZHJlc3M6IChhZGRyZXNzOiBzdHJpbmcpID0+IGJvb2xlYW4sXG4pID0+IHtcbiAgY29uc3QgcGFyYW1zID0gdXNlUXVlcnlQYXJhbXMoKTtcbiAgY29uc3QgYWRkcmVzc0Zyb21QYXJhbXMgPSBwYXJhbXMuZ2V0KCdhZGRyZXNzJykgPz8gJyc7XG5cbiAgcmV0dXJuIHZhbGlkYXRlQWRkcmVzcyhhZGRyZXNzRnJvbVBhcmFtcykgPyBhZGRyZXNzRnJvbVBhcmFtcyA6ICcnO1xufTtcbiIsImltcG9ydCBFUkMyMCBmcm9tICdAb3BlbnplcHBlbGluL2NvbnRyYWN0cy9idWlsZC9jb250cmFjdHMvRVJDMjAuanNvbic7XG5pbXBvcnQgRVJDNzIxIGZyb20gJ0BvcGVuemVwcGVsaW4vY29udHJhY3RzL2J1aWxkL2NvbnRyYWN0cy9FUkM3MjEuanNvbic7XG5pbXBvcnQgRVJDMTE1NSBmcm9tICdAb3BlbnplcHBlbGluL2NvbnRyYWN0cy9idWlsZC9jb250cmFjdHMvRVJDMTE1NS5qc29uJztcbmltcG9ydCB7IEpzb25ScGNCYXRjaEludGVybmFsIH0gZnJvbSAnQGF2YWxhYnMvY29yZS13YWxsZXRzLXNkayc7XG5pbXBvcnQgeyBDb250cmFjdCwgVHJhbnNhY3Rpb25SZXF1ZXN0IH0gZnJvbSAnZXRoZXJzJztcblxuaW1wb3J0IHtcbiAgRXJjMjBTZW5kT3B0aW9ucyxcbiAgTmF0aXZlU2VuZE9wdGlvbnMsXG4gIE5mdFNlbmRPcHRpb25zLFxuICBTZW5kT3B0aW9ucyxcbn0gZnJvbSAnLi4vbW9kZWxzJztcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gJ0BhdmFsYWJzL3ZtLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyBzdHJpbmdUb0JpZ2ludCB9IGZyb20gJ0BzcmMvdXRpbHMvc3RyaW5nVG9CaWdpbnQnO1xuXG5jb25zdCBhc0hleCA9ICh2YWx1ZTogYmlnaW50KSA9PiBgMHgke3ZhbHVlLnRvU3RyaW5nKDE2KX1gO1xuXG5leHBvcnQgY29uc3QgYnVpbGRFcmMyMFR4ID0gYXN5bmMgKFxuICBmcm9tOiBzdHJpbmcsXG4gIHByb3ZpZGVyOiBKc29uUnBjQmF0Y2hJbnRlcm5hbCxcbiAgeyBhZGRyZXNzLCBhbW91bnQsIHRva2VuIH06IEVyYzIwU2VuZE9wdGlvbnMsXG4pID0+IHtcbiAgY29uc3QgY29udHJhY3QgPSBuZXcgQ29udHJhY3QodG9rZW4uYWRkcmVzcyB8fCAnJywgRVJDMjAuYWJpLCBwcm92aWRlcik7XG5cbiAgY29uc3QgcG9wdWxhdGVkVHJhbnNhY3Rpb24gPSBhd2FpdCBjb250cmFjdC50cmFuc2ZlciEucG9wdWxhdGVUcmFuc2FjdGlvbihcbiAgICBhZGRyZXNzLFxuICAgIGFzSGV4KHN0cmluZ1RvQmlnaW50KGFtb3VudCwgdG9rZW4uZGVjaW1hbHMpKSxcbiAgKTtcbiAgY29uc3QgdW5zaWduZWRUeDogVHJhbnNhY3Rpb25SZXF1ZXN0ID0ge1xuICAgIC4uLnBvcHVsYXRlZFRyYW5zYWN0aW9uLCAvLyBvbmx5IGluY2x1ZGVzIGB0b2AgYW5kIGBkYXRhYFxuICAgIGNoYWluSWQ6IHBvcHVsYXRlZFRyYW5zYWN0aW9uLmNoYWluSWRcbiAgICAgID8gTnVtYmVyKHBvcHVsYXRlZFRyYW5zYWN0aW9uLmNoYWluSWQpXG4gICAgICA6IHVuZGVmaW5lZCxcbiAgICBmcm9tLFxuICB9O1xuXG4gIHJldHVybiB1bnNpZ25lZFR4O1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkRXJjNzIxVHggPSBhc3luYyAoXG4gIGZyb206IHN0cmluZyxcbiAgcHJvdmlkZXI6IEpzb25ScGNCYXRjaEludGVybmFsLFxuICB7IGFkZHJlc3MsIHRva2VuIH06IE5mdFNlbmRPcHRpb25zLFxuKSA9PiB7XG4gIGNvbnN0IGNvbnRyYWN0ID0gbmV3IENvbnRyYWN0KHRva2VuLmFkZHJlc3MgfHwgJycsIEVSQzcyMS5hYmksIHByb3ZpZGVyKTtcblxuICBjb25zdCBwb3B1bGF0ZWRUcmFuc2FjdGlvbiA9IGF3YWl0IGNvbnRyYWN0W1xuICAgICdzYWZlVHJhbnNmZXJGcm9tKGFkZHJlc3MsYWRkcmVzcyx1aW50MjU2KSdcbiAgXSEucG9wdWxhdGVUcmFuc2FjdGlvbihmcm9tLCBhZGRyZXNzLCB0b2tlbi50b2tlbklkKTtcblxuICBjb25zdCB1bnNpZ25lZFR4OiBUcmFuc2FjdGlvblJlcXVlc3QgPSB7XG4gICAgLi4ucG9wdWxhdGVkVHJhbnNhY3Rpb24sXG4gICAgY2hhaW5JZDogcG9wdWxhdGVkVHJhbnNhY3Rpb24uY2hhaW5JZFxuICAgICAgPyBOdW1iZXIocG9wdWxhdGVkVHJhbnNhY3Rpb24uY2hhaW5JZClcbiAgICAgIDogdW5kZWZpbmVkLFxuICAgIGZyb20sXG4gIH07XG4gIHJldHVybiB1bnNpZ25lZFR4O1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkRXJjMTE1NVR4ID0gYXN5bmMgKFxuICBmcm9tOiBzdHJpbmcsXG4gIHByb3ZpZGVyOiBKc29uUnBjQmF0Y2hJbnRlcm5hbCxcbiAgeyBhZGRyZXNzLCB0b2tlbiB9OiBOZnRTZW5kT3B0aW9ucyxcbikgPT4ge1xuICBjb25zdCBjb250cmFjdCA9IG5ldyBDb250cmFjdCh0b2tlbi5hZGRyZXNzIHx8ICcnLCBFUkMxMTU1LmFiaSwgcHJvdmlkZXIpO1xuXG4gIGNvbnN0IHBvcHVsYXRlZFRyYW5zYWN0aW9uID0gYXdhaXQgY29udHJhY3RbXG4gICAgJ3NhZmVUcmFuc2ZlckZyb20oYWRkcmVzcyxhZGRyZXNzLHVpbnQyNTYsdWludDI1NixieXRlcyknXG4gIF0hLnBvcHVsYXRlVHJhbnNhY3Rpb24oZnJvbSwgYWRkcmVzcywgdG9rZW4udG9rZW5JZCwgMSwgbmV3IFVpbnQ4QXJyYXkoKSk7XG5cbiAgY29uc3QgdW5zaWduZWRUeDogVHJhbnNhY3Rpb25SZXF1ZXN0ID0ge1xuICAgIC4uLnBvcHVsYXRlZFRyYW5zYWN0aW9uLFxuICAgIGNoYWluSWQ6IHBvcHVsYXRlZFRyYW5zYWN0aW9uLmNoYWluSWRcbiAgICAgID8gTnVtYmVyKHBvcHVsYXRlZFRyYW5zYWN0aW9uLmNoYWluSWQpXG4gICAgICA6IHVuZGVmaW5lZCxcbiAgICBmcm9tLFxuICB9O1xuXG4gIHJldHVybiB1bnNpZ25lZFR4O1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkTmF0aXZlVHggPSAoXG4gIGZyb206IHN0cmluZyxcbiAgeyBhZGRyZXNzLCBhbW91bnQsIHRva2VuIH06IE5hdGl2ZVNlbmRPcHRpb25zLFxuKTogVHJhbnNhY3Rpb25SZXF1ZXN0ID0+ICh7XG4gIGZyb20sXG4gIHRvOiBhZGRyZXNzLFxuICB2YWx1ZTogYXNIZXgoc3RyaW5nVG9CaWdpbnQoYW1vdW50LCB0b2tlbi5kZWNpbWFscykpLFxufSk7XG5cbmV4cG9ydCBjb25zdCBpc05hdGl2ZVNlbmQgPSAoXG4gIG9wdGlvbnM6IFNlbmRPcHRpb25zLFxuKTogb3B0aW9ucyBpcyBOYXRpdmVTZW5kT3B0aW9ucyA9PiBvcHRpb25zLnRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5OQVRJVkU7XG5cbmV4cG9ydCBjb25zdCBpc0VyYzIwU2VuZCA9IChcbiAgb3B0aW9uczogU2VuZE9wdGlvbnMsXG4pOiBvcHRpb25zIGlzIEVyYzIwU2VuZE9wdGlvbnMgPT4gb3B0aW9ucy50b2tlbi50eXBlID09PSBUb2tlblR5cGUuRVJDMjA7XG5cbmV4cG9ydCBjb25zdCBpc0VyYzcyMVNlbmQgPSAob3B0aW9uczogU2VuZE9wdGlvbnMpOiBvcHRpb25zIGlzIE5mdFNlbmRPcHRpb25zID0+XG4gIG9wdGlvbnMudG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkVSQzcyMTtcblxuZXhwb3J0IGNvbnN0IGlzRXJjMTE1NVNlbmQgPSAoXG4gIG9wdGlvbnM6IFNlbmRPcHRpb25zLFxuKTogb3B0aW9ucyBpcyBOZnRTZW5kT3B0aW9ucyA9PiBvcHRpb25zLnRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5FUkMxMTU1O1xuXG5leHBvcnQgY29uc3QgYnVpbGRUeCA9IGFzeW5jIChcbiAgZnJvbTogc3RyaW5nLFxuICBwcm92aWRlcjogSnNvblJwY0JhdGNoSW50ZXJuYWwsXG4gIG9wdGlvbnM6IFNlbmRPcHRpb25zLFxuKSA9PiB7XG4gIGlmIChpc05hdGl2ZVNlbmQob3B0aW9ucykpIHtcbiAgICByZXR1cm4gYnVpbGROYXRpdmVUeChmcm9tLCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmIChpc0VyYzIwU2VuZChvcHRpb25zKSkge1xuICAgIHJldHVybiBidWlsZEVyYzIwVHgoZnJvbSwgcHJvdmlkZXIsIG9wdGlvbnMpO1xuICB9XG5cbiAgaWYgKGlzRXJjNzIxU2VuZChvcHRpb25zKSkge1xuICAgIHJldHVybiBidWlsZEVyYzcyMVR4KGZyb20sIHByb3ZpZGVyLCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmIChpc0VyYzExNTVTZW5kKG9wdGlvbnMpKSB7XG4gICAgcmV0dXJuIGJ1aWxkRXJjMTE1NVR4KGZyb20sIHByb3ZpZGVyLCBvcHRpb25zKTtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBzZW5kIG9wdGlvbnMgb2JqZWN0YCk7XG59O1xuIiwiZXhwb3J0IGNvbnN0IGNvcnJlY3RBZGRyZXNzQnlQcmVmaXggPSAoYWRkcmVzczogc3RyaW5nLCBwcmVmaXg6IHN0cmluZykgPT4ge1xuICByZXR1cm4gIWFkZHJlc3Muc3RhcnRzV2l0aChwcmVmaXgpID8gYCR7cHJlZml4fSR7YWRkcmVzc31gIDogYWRkcmVzcztcbn07XG4iLCJpbXBvcnQgeyB0IH0gZnJvbSAnaTE4bmV4dCc7XG5cbmltcG9ydCB7IFNlbmRFcnJvck1lc3NhZ2UgfSBmcm9tICdAc3JjL3V0aWxzL3NlbmQvbW9kZWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbmRFcnJvck1lc3NhZ2UoXG4gIGtleTogU2VuZEVycm9yTWVzc2FnZSxcbiAgZGV0YWlscz86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHVuZGVmaW5lZD4sXG4pOiBzdHJpbmcge1xuICBpZiAoa2V5ID09PSBTZW5kRXJyb3JNZXNzYWdlLkFNT1VOVF9UT09fTE9XKSB7XG4gICAgcmV0dXJuIGRldGFpbHM/Lm1pbkFtb3VudFxuICAgICAgPyB0KCdBdCBsZWFzdCB7e21pbkFtb3VudH19IGlzIHJlcXVpcmVkJywgZGV0YWlscylcbiAgICAgIDogdCgnQW1vdW50IHRvbyBsb3cnKTtcbiAgfVxuXG4gIGNvbnN0IHRyYW5zbGF0aW9ucyA9IHtcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5BTU9VTlRfUkVRVUlSRURdOiB0KCdBbW91bnQgcmVxdWlyZWQnKSxcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5BRERSRVNTX1JFUVVJUkVEXTogdCgnQWRkcmVzcyByZXF1aXJlZCcpLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLklOVkFMSURfQUREUkVTU106IHQoJ0FkZHJlc3MgaXMgaW52YWxpZCcpLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLklOVkFMSURfTkVUV09SS19GRUVdOiB0KCdOZXR3b3JrIEZlZSBpcyBpbnZhbGlkJyksXG4gICAgW1NlbmRFcnJvck1lc3NhZ2UuSU5TVUZGSUNJRU5UX0JBTEFOQ0VdOiB0KCdJbnN1ZmZpY2llbnQgYmFsYW5jZS4nKSxcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5JTlNVRkZJQ0lFTlRfQkFMQU5DRV9GT1JfRkVFXTogdChcbiAgICAgICdJbnN1ZmZpY2llbnQgYmFsYW5jZSBmb3IgZmVlJyxcbiAgICApLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLlRPS0VOX1JFUVVJUkVEXTogdCgnVG9rZW4gaXMgcmVxdWlyZWQnKSxcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5VTkFCTEVfVE9fRkVUQ0hfVVRYT1NdOiB0KFxuICAgICAgJ0ludGVybmFsIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluJyxcbiAgICApLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLlVOU1VQUE9SVEVEX1RPS0VOXTogdCgnVW5zdXBwb3J0ZWQgdG9rZW4nKSxcbiAgICBbU2VuZEVycm9yTWVzc2FnZS5VTktOT1dOX0VSUk9SXTogdCgnVW5rbm93biBlcnJvcicpLFxuICAgIFtTZW5kRXJyb3JNZXNzYWdlLkVYQ0VTU0lWRV9ORVRXT1JLX0ZFRV06IHQoJ1NlbGVjdGVkIGZlZSBpcyB0b28gaGlnaCcpLFxuICB9O1xuXG4gIHJldHVybiB0cmFuc2xhdGlvbnNba2V5XSA/PyBrZXk7XG59XG4iLCJpbXBvcnQgeyBCcmlkZ2VUcmFuc2FjdGlvbiB9IGZyb20gJ0BhdmFsYWJzL2NvcmUtYnJpZGdlLXNkayc7XG5pbXBvcnQgeyBCcmlkZ2VUcmFuc2ZlciB9IGZyb20gJ0BhdmFsYWJzL2JyaWRnZS11bmlmaWVkJztcbmltcG9ydCB7IFR4SGlzdG9yeUl0ZW0gfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvaGlzdG9yeS9tb2RlbHMnO1xuXG5leHBvcnQgY29uc3QgRVRIRVJFVU1fQUREUkVTUyA9ICcweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNQZW5kaW5nQnJpZGdlVHJhbnNhY3Rpb24oXG4gIGl0ZW06IFR4SGlzdG9yeUl0ZW0gfCBCcmlkZ2VUcmFuc2FjdGlvbiB8IEJyaWRnZVRyYW5zZmVyLFxuKTogaXRlbSBpcyBCcmlkZ2VUcmFuc2FjdGlvbiB8IEJyaWRnZVRyYW5zZmVyIHtcbiAgcmV0dXJuICdhZGRyZXNzQlRDJyBpbiBpdGVtIHx8ICdzb3VyY2VDaGFpbicgaW4gaXRlbTtcbn1cbiIsImltcG9ydCB7IGlzVXNlclJlamVjdGlvbkVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuXG4vKipcbiAqIFVzZSB0aGlzIHV0aWwgZnVuY3Rpb24gdG8gZGlzdGluZ3Vpc2ggYmV0d2VlbiB0aGUgdXNlciByZWplY3RpbmcgdGhlXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVUeE91dGNvbWU8VD4odHhSZXF1ZXN0UHJvbWlzZTogUHJvbWlzZTxUPik6IFByb21pc2U8XG4gIHwge1xuICAgICAgaXNBcHByb3ZlZDogYm9vbGVhbjtcbiAgICAgIHJlc3VsdDogVDtcbiAgICAgIGVycm9yPzogbmV2ZXI7XG4gICAgICBoYXNFcnJvcjogZmFsc2U7XG4gICAgfVxuICB8IHtcbiAgICAgIGlzQXBwcm92ZWQ6IGJvb2xlYW47XG4gICAgICByZXN1bHQ/OiBuZXZlcjtcbiAgICAgIGVycm9yOiB1bmtub3duO1xuICAgICAgaGFzRXJyb3I6IHRydWU7XG4gICAgfVxuPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdHhSZXF1ZXN0UHJvbWlzZTtcblxuICAgIHJldHVybiB7XG4gICAgICBpc0FwcHJvdmVkOiB0cnVlLFxuICAgICAgaGFzRXJyb3I6IGZhbHNlLFxuICAgICAgcmVzdWx0LFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiB7XG4gICAgICBpc0FwcHJvdmVkOiAhaXNVc2VyUmVqZWN0aW9uRXJyb3IoZXJyKSxcbiAgICAgIGhhc0Vycm9yOiB0cnVlLFxuICAgICAgZXJyb3I6IGVycixcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBOZXR3b3JrLCBOZXR3b3JrVk1UeXBlIH0gZnJvbSAnQGF2YWxhYnMvY29yZS1jaGFpbnMtc2RrJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQml0Y29pbihuZXR3b3JrPzogTmV0d29yaykge1xuICByZXR1cm4gbmV0d29yaz8udm1OYW1lID09PSBOZXR3b3JrVk1UeXBlLkJJVENPSU47XG59XG4iLCJleHBvcnQgZW51bSBTZW5kRXJyb3JNZXNzYWdlIHtcbiAgQU1PVU5UX1JFUVVJUkVEID0gJ0FNT1VOVF9SRVFVSVJFRCcsXG4gIEFNT1VOVF9UT09fTE9XID0gJ0FNT1VOVF9UT09fTE9XJyxcbiAgQUREUkVTU19SRVFVSVJFRCA9ICdBRERSRVNTX1JFUVVJUkVEJyxcbiAgQ19DSEFJTl9SRVFVSVJFRCA9ICdDX0NIQUlOX1JFUVVJUkVEJyxcbiAgSU5WQUxJRF9BRERSRVNTID0gJ0lOVkFMSURfQUREUkVTUycsXG4gIElOVkFMSURfTkVUV09SS19GRUUgPSAnSU5WQUxJRF9ORVRXT1JLX0ZFRScsXG4gIElOU1VGRklDSUVOVF9CQUxBTkNFID0gJ0lOU1VGRklDSUVOVF9CQUxBTkNFJyxcbiAgSU5TVUZGSUNJRU5UX0JBTEFOQ0VfRk9SX0ZFRSA9ICdJTlNVRkZJQ0lFTlRfQkFMQU5DRV9GT1JfRkVFJyxcbiAgRVhDRVNTSVZFX05FVFdPUktfRkVFID0gJ0VYQ0VTU0lWRV9ORVRXT1JLX0ZFRScsXG4gIFRPS0VOX1JFUVVJUkVEID0gJ1RPS0VOX1JFUVVJUkVEJyxcbiAgVU5TVVBQT1JURURfVE9LRU4gPSAnVU5TVVBQT1JURURfVE9LRU4nLFxuICBVTkFCTEVfVE9fRkVUQ0hfVVRYT1MgPSAnVU5BQkxFX1RPX0ZFVENIX1VUWE9TJyxcbiAgVU5LTk9XTl9FUlJPUiA9ICdVTktOT1dOX0VSUk9SJyxcbiAgVU5TVVBQT1JURURfQllfTEVER0VSID0gJ1VOU1VQUE9SVEVEX0JZX0xFREdFUicsXG4gIFNFTkRfTk9UX0FWQUlMQUJMRSA9ICdTRU5EX05PVF9BVkFJTEFCTEUnLFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImFzc2V0cy83ZjIwOTM0NTU4OWMxOGZhMzhhMjA4MTU1M2I4ZjI2Yi5wbmdcIjsiXSwibmFtZXMiOlsiaXNOb25YUEhpc3RvcnlJdGVtIiwidHgiLCJ2bVR5cGUiLCJpc1BjaGFpblR4SGlzdG9yeUl0ZW0iLCJDaGFpbklkIiwiaXNTb2xhbmFOZXR3b3JrIiwibmV0d29yayIsImlzU29sYW5hQ2hhaW5JZCIsImNoYWluSWQiLCJTT0xBTkFfREVWTkVUX0lEIiwiU09MQU5BX01BSU5ORVRfSUQiLCJTT0xBTkFfVEVTVE5FVF9JRCIsIlBhZ2VUaXRsZSIsIlBhZ2VUaXRsZVZhcmlhbnQiLCJUcmFucyIsInVzZVRyYW5zbGF0aW9uIiwiZ2V0VHJhbnNsYXRlZEZ1bmN0aW9uTmFtZSIsIlN0YWNrIiwiVHlwb2dyYXBoeSIsIkZ1bmN0aW9uSXNVbmF2YWlsYWJsZSIsImZ1bmN0aW9uTmFtZSIsImNoaWxkcmVuIiwidCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInN4Iiwid2lkdGgiLCJoZWlnaHQiLCJ2YXJpYW50IiwiUFJJTUFSWSIsImZsZXhHcm93IiwicHgiLCJhbGlnbkNvbnRlbnQiLCJqdXN0aWZ5Q29udGVudCIsIm1pbkhlaWdodCIsImFsaWduIiwiaTE4bktleSIsInZhbHVlcyIsInVzZU1lbW8iLCJ1c2VMb2NhdGlvbiIsInVzZVF1ZXJ5UGFyYW1zIiwic2VhcmNoIiwiVVJMU2VhcmNoUGFyYW1zIiwiQm94IiwiQnV0dG9uIiwiU2Nyb2xsYmFycyIsIkFkZHJlc3NEcm9wZG93bkxpc3RJdGVtIiwidXNlU2V0dGluZ3NDb250ZXh0IiwiU2V0dGluZ3NQYWdlcyIsInVzZU5ldHdvcmtDb250ZXh0IiwiaXNCaXRjb2luIiwiaXNQY2hhaW5OZXR3b3JrIiwiaXNYY2hhaW5OZXR3b3JrIiwiQWRkcmVzc0Ryb3Bkb3duTGlzdCIsImNvbnRhY3RzIiwic2VsZWN0ZWRDb250YWN0Iiwib25DaGFuZ2UiLCJhZGRDb250YWN0IiwidXNlQnRjQWRkcmVzcyIsInVzZVhQQWRkcmVzcyIsInVzZVNWTUFkZHJlc3MiLCJCb29sZWFuIiwic2VsZWN0ZWRBZGRyZXNzIiwidG9Mb3dlckNhc2UiLCJzZXRJc1NldHRpbmdzT3BlbiIsInNldFNldHRpbmdzQWN0aXZlUGFnZSIsInB5Iiwib25DbGljayIsIkFERF9DT05UQUNUIiwic3R5bGUiLCJtYXAiLCJjb250YWN0IiwiaSIsImtleSIsImFkZHJlc3MiLCJpc1NlbGVjdGVkIiwiQXZhbGFuY2hlQ29sb3JJY29uIiwiQml0Y29pbkNvbG9ySWNvbiIsIkF2YXRhciIsIlRvb2x0aXAiLCJYQW5kUENoYWluc0ljb24iLCJDb250YWN0QWRkcmVzcyIsIlNvbGFuYUxvZ28iLCJpbml0aWFscyIsIm5hbWUiLCJzcGxpdCIsInNsaWNlIiwicGFydCIsImZ1bGxXaWR0aCIsImdhcCIsImFsaWduSXRlbXMiLCJmbGV4RGlyZWN0aW9uIiwibWF4SGVpZ2h0IiwiY29sb3IiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiYWRkcmVzc1hQIiwiY29udGFjdFdpdGhQcmVmaXgiLCJkaXNhYmxlUmlwcGxlIiwibWluV2lkdGgiLCJhbHQiLCJ1c2VDb2xvciIsInRpdGxlIiwid3JhcFdpdGhTcGFuIiwiZGlzYWJsZUludGVyYWN0aXZlIiwibm9XcmFwIiwiY29tcG9uZW50IiwiZm9udFdlaWdodCIsIm5ldHdvcmtJY29uIiwic2l6ZSIsImFkZHJlc3NCVEMiLCJhZGRyZXNzU1ZNIiwic3JjIiwidXNlV2FsbGV0Q29udGV4dCIsIkFkZHJlc3NEcm9wZG93bkxpc3RNeUFjY291bnRzIiwidXNlU3ZtQWRkcmVzcyIsIndhbGxldHMiLCJ1c2VYcEFkZHJlc3MiLCJhZGRyZXNzVHlwZSIsImlkIiwid2FsbGV0TmFtZSIsIndhbGxldEFjY291bnRzIiwibGVuZ3RoIiwiaW1wb3J0ZWQiLCJPYmplY3QiLCJhY2MiLCJDb3B5SWNvbiIsInRvYXN0IiwidHJ1bmNhdGVBZGRyZXNzIiwiY29weUFkZHJlc3MiLCJldiIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsImR1cmF0aW9uIiwicm9sZSIsInAiLCJQb3BwZXJQcm9wcyIsImRpc2FibGVQb3J0YWwiLCJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsIkljb25CdXR0b24iLCJJbnB1dEFkb3JubWVudCIsIlRleHRGaWVsZCIsIlVzZXJTZWFyY2hJY29uIiwiaXNBZGRyZXNzIiwiaXNTb2xhbmFBZGRyZXNzIiwiTmV0d29ya1ZNVHlwZSIsImlzQmVjaDMyQWRkcmVzcyIsIkNvbnRhY3RTZWxlY3QiLCJ1c2VJZGVudGlmeUFkZHJlc3MiLCJDb250YWluZWREcm9wZG93biIsInVzZUNvbnRhY3RzQ29udGV4dCIsImlzVmFsaWRBdm1BZGRyZXNzIiwiaXNWYWxpZFB2bUFkZHJlc3MiLCJ0cnVuY2F0ZU5hbWUiLCJzdWJzdHJpbmciLCJDb250YWN0SW5wdXQiLCJpc0NvbnRhY3RzT3BlbiIsInNldElzT3BlbiIsImNvbnRhaW5lclJlZiIsImlucHV0V3JhcHBlclJlZiIsImlucHV0UmVmIiwiaWRlbnRpZnlBZGRyZXNzIiwiY29udGFjdHNMZW5ndGgiLCJzZXRDb250YWN0c0xlbmd0aCIsInJlY2VudGx5QWRkZWRDb250YWN0IiwiY2hhbmdlQW5kQ2xvc2VEcm9wZG93biIsInNlbGVjdGVkVGFiIiwiaW5wdXRGb2N1c2VkIiwic2V0SW5wdXRGb2N1c2VkIiwiaW5wdXRIb3ZlcmVkIiwic2V0SW5wdXRIb3ZlcmVkIiwiY29udGFjdEFkZHJlc3MiLCJjdXJzb3IiLCJzZXRDdXJzb3IiLCJjdXJyZW50Iiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJpc1ZhbGlkQWRkcmVzcyIsInZtTmFtZSIsIkVWTSIsIkJJVENPSU4iLCJnZXRJbnB1dERpc3BsYXlWYWx1ZSIsImlzS25vd24iLCJwb3NpdGlvbiIsInJlZiIsIm9wZW4iLCJwbGFjZW1lbnQiLCJhbmNob3JFbCIsImxhYmVsIiwiaW5wdXRMYWJlbFByb3BzIiwidHJhbnNmb3JtIiwiZm9udFNpemUiLCJtYiIsIklucHV0UHJvcHMiLCJwbCIsInByIiwiZW5kQWRvcm5tZW50IiwibXQiLCJvbk1vdXNlRW50ZXIiLCJvbkZvY3VzIiwib25CbHVyIiwib25Nb3VzZUxlYXZlIiwicGxhY2Vob2xkZXIiLCJtdWx0aWxpbmUiLCJtaW5Sb3dzIiwidGFyZ2V0IiwidmFsdWUiLCJ0cmltIiwic2VsZWN0aW9uU3RhcnQiLCJpc09wZW4iLCJUYWIiLCJUYWJQYW5lbCIsIlRhYnMiLCJ1c2VBY2NvdW50c0NvbnRleHQiLCJzdHJpcEFkZHJlc3NQcmVmaXgiLCJpbmRleE9mIiwiaXNCaXRjb2luTmV0d29yayIsIkVUSEVSRVVNX0FERFJFU1MiLCJUYWJJZCIsIk5vQ29udGFjdHNNZXNzYWdlIiwiaGVhZGVyIiwiZGVzY3JpcHRpb24iLCJwdCIsInRleHRBbGlnbiIsImdldFRyYW5zYWN0aW9uSGlzdG9yeSIsImFjY291bnRzIiwiaW1wb3J0ZWRBY2NvdW50cyIsInByaW1hcnkiLCJwcmltYXJ5QWNjb3VudHMiLCJhY3RpdmUiLCJhY3RpdmVBY2NvdW50Iiwic2V0U2VsZWN0ZWRUYWIiLCJBRERSRVNTX0JPT0siLCJoaXN0b3J5Q29udGFjdHMiLCJzZXRIaXN0b3J5Q29udGFjdHMiLCJ0aGVuIiwiaGlzdG9yeSIsImZpbHRlcmVkSGlzdG9yeSIsImZpbHRlciIsImluZGV4Iiwic2VsZiIsImlzU2VuZGVyIiwiaXNDb250cmFjdENhbGwiLCJmaW5kSW5kZXgiLCJ0ZW1wIiwidG8iLCJjb250YWN0SGlzdG9yeSIsInJlZHVjZSIsImFkZHJlc3NJZGVudGl0aWVzIiwiZm9yRWFjaCIsImlkZW50aXR5IiwiYWRkcmVzc1RvQ2hlY2siLCJ1c2VyQWRkcmVzcyIsImFkZHJlc3NQVk0iLCJhZGRyZXNzQVZNIiwiYWRkcmVzc0MiLCJhZGRyZXNzZXNJbkxpc3QiLCJwdXNoIiwiZm9ybWF0dGVkQWNjb3VudHMiLCJmb3JtYXR0ZWRQcmltYXJ5Iiwia2V5cyIsIndhbGxldElkIiwid2FsbGV0QWNjb3VudCIsInJlc3VsdCIsImltcG9ydGVkQWNjb3VudFRvUHJlcCIsImZvcm1hdHRlZEltcG9ydGVkIiwiZm9ybWF0dGVkQ29udGFjdHMiLCJpbmRpY2F0b3JDb2xvciIsIl8iLCJ0YWIiLCJmbGV4U2hyaW5rIiwidGFiSW5kZXgiLCJSRUNFTlRfQUREUkVTU0VTIiwiTVlfQUNDT1VOVFMiLCJib3JkZXJUb3AiLCJib3JkZXJDb2xvciIsIm92ZXJmbG93IiwiZGlzcGxheSIsInVzZUNhbGxiYWNrIiwiY29ycmVjdEFkZHJlc3NCeVByZWZpeCIsIlVOU0FWRURfQ09OVEFDVF9CQVNFIiwiYWxsQWNjb3VudHMiLCJhZGRyZXNzTG93ZXJDYXNlIiwiYWRkcmVzc1RvVXNlIiwiYWNjb3VudCIsInRvTG9jYWxlTG93ZXJDYXNlIiwiU2VuZEVycm9yTWVzc2FnZSIsInVzZUNvbm5lY3Rpb25Db250ZXh0IiwiYnVpbGRUeCIsImlzRXJjMTE1NVNlbmQiLCJpc0VyYzIwU2VuZCIsImlzRXJjNzIxU2VuZCIsImlzTmF0aXZlU2VuZCIsIlJwY01ldGhvZCIsIlRva2VuVHlwZSIsInN0cmluZ1RvQmlnaW50IiwidXNlRVZNU2VuZCIsImZyb20iLCJwcm92aWRlciIsIm1heEZlZSIsIm5hdGl2ZVRva2VuIiwicmVxdWVzdCIsImlzU2VuZGluZyIsInNldElzU2VuZGluZyIsImlzVmFsaWRhdGluZyIsInNldElzVmFsaWRhdGluZyIsIm1heEFtb3VudCIsInNldE1heEFtb3VudCIsImVycm9yIiwic2V0RXJyb3IiLCJnZXRUeCIsIm9wdGlvbnMiLCJzZW5kIiwiaGFzaCIsIm1ldGhvZCIsIkVUSF9TRU5EX1RSQU5TQUNUSU9OIiwicGFyYW1zIiwiZ2V0R2FzTGltaXQiLCJlc3RpbWF0ZUdhcyIsInZhbGlkYXRlRXJjNzIxIiwiQUREUkVTU19SRVFVSVJFRCIsImJhbGFuY2UiLCJJTlNVRkZJQ0lFTlRfQkFMQU5DRV9GT1JfRkVFIiwidmFsaWRhdGVFcmMxMTU1IiwidG9rZW4iLCJJTlNVRkZJQ0lFTlRfQkFMQU5DRSIsInZhbGlkYXRlTmF0aXZlQW5kRXJjMjAiLCJhbW91bnQiLCJhbW91bnRCaWdJbnQiLCJkZWNpbWFscyIsImdhc0xpbWl0IiwidG90YWxGZWUiLCJyZW1haW5pbmdCYWxhbmNlIiwidHlwZSIsIk5BVElWRSIsInRvU3RyaW5nIiwiRVJDMjAiLCJBTU9VTlRfUkVRVUlSRUQiLCJ2YWxpZGF0ZSIsInVuZGVmaW5lZCIsIlRPS0VOX1JFUVVJUkVEIiwiVU5TVVBQT1JURURfVE9LRU4iLCJlcnIiLCJtZXNzYWdlIiwiaW5jbHVkZXMiLCJjb25zb2xlIiwiVU5LTk9XTl9FUlJPUiIsImlzVmFsaWQiLCJ1c2VWYWxpZEFkZHJlc3NGcm9tUGFyYW1zIiwidmFsaWRhdGVBZGRyZXNzIiwiYWRkcmVzc0Zyb21QYXJhbXMiLCJnZXQiLCJFUkM3MjEiLCJFUkMxMTU1IiwiQ29udHJhY3QiLCJhc0hleCIsImJ1aWxkRXJjMjBUeCIsImNvbnRyYWN0IiwiYWJpIiwicG9wdWxhdGVkVHJhbnNhY3Rpb24iLCJ0cmFuc2ZlciIsInBvcHVsYXRlVHJhbnNhY3Rpb24iLCJ1bnNpZ25lZFR4IiwiTnVtYmVyIiwiYnVpbGRFcmM3MjFUeCIsInRva2VuSWQiLCJidWlsZEVyYzExNTVUeCIsIlVpbnQ4QXJyYXkiLCJidWlsZE5hdGl2ZVR4IiwiRXJyb3IiLCJwcmVmaXgiLCJzdGFydHNXaXRoIiwiZ2V0U2VuZEVycm9yTWVzc2FnZSIsImRldGFpbHMiLCJBTU9VTlRfVE9PX0xPVyIsIm1pbkFtb3VudCIsInRyYW5zbGF0aW9ucyIsIklOVkFMSURfQUREUkVTUyIsIklOVkFMSURfTkVUV09SS19GRUUiLCJVTkFCTEVfVE9fRkVUQ0hfVVRYT1MiLCJFWENFU1NJVkVfTkVUV09SS19GRUUiLCJpc1BlbmRpbmdCcmlkZ2VUcmFuc2FjdGlvbiIsIml0ZW0iLCJpc1VzZXJSZWplY3Rpb25FcnJvciIsImhhbmRsZVR4T3V0Y29tZSIsInR4UmVxdWVzdFByb21pc2UiLCJpc0FwcHJvdmVkIiwiaGFzRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9